import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  Interaction,
} from 'chart.js'
import {
  getRelativePosition,
} from 'chart.js/helpers'
import { Bar } from 'react-chartjs-2'
import { createIntl, createIntlCache } from 'react-intl'
import {
  addNormalRectPath,
  boundingRects,
  hasRadius,
  inflateRect,
} from '../utils/app-utils'

const ROW_HEIGHT = 53.5
const X_AXIS_HEIGHT = 38
const GRIDLINE_COLOR = '#262424'

const intl = createIntl({
    locale: "en",
    defaultLocale: "en"
  },
  createIntlCache()
)

const CHART_OPTIONS = {
  legend: {
    display: false,
  },
  onHover: function (e, data) {
    document.getElementById('chart').style.cursor = data[0] ? 'pointer' : 'default'
  },
  interaction: {
    intersect: true,
  },
  scales: {
    y: {
      grid: {
        color: GRIDLINE_COLOR,
      },
    },
    x: {
      grid: {
        color: GRIDLINE_COLOR,
      },
      ticks: {
        beginAtZero: true,
        callback: (value) => {
          return intl.formatNumber(value, {
            notation: 'compact',
            compactDisplay: 'short',
          })
        },
      },
    },
  },
  plugins: {
    tooltip: {
      displayColors: false,
      position: 'nearest',
      callbacks: {
        text: (tooltipItems) => {
          return tooltipItems.length == 0 ? "" : tooltipItems[0].yLabel
        },
        label: (tooltipItems) => {
          const subcriberCountText = intl.formatNumber(tooltipItems.raw, {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 2,
          })
          return `${subcriberCountText} subscribers`
        },
      },
    },
  },
  indexAxis: 'y',
  maintainAspectRatio: false,
  responsive: true,
}

BarElement.prototype.draw = function (ctx, chartArea, dataset, index) {
  const {inflateAmount, options: { borderColor }} = this
  const {inner, outer} = boundingRects(this)
  const addRectPath = hasRadius(outer.radius) ? addRoundedRectPath : addNormalRectPath

  ctx.save()

  if (outer.w !== inner.w || outer.h !== inner.h) {
    ctx.beginPath()
    addRectPath(ctx, inflateRect(outer, inflateAmount, inner))
    ctx.clip()
    addRectPath(ctx, inflateRect(inner, -inflateAmount, outer))
    ctx.fillStyle = borderColor
    ctx.fill('evenodd')
  }

  ctx.beginPath()
  addRectPath(ctx, inflateRect(inner, inflateAmount))
  ctx.fillStyle = dataset.barColors[index]
  ctx.fill()

  const thumbnailSize = 38.5
  const img = dataset.images[index]
  if (img && img.width > 0 && img.height > 0) {
    const x0 = chartArea.left
    ctx.drawImage(
      img,
      Math.max(x0, outer.x + outer.w - thumbnailSize),
      outer.y,
      thumbnailSize,
      thumbnailSize
    )
  }

  ctx.restore()
}

BarController.prototype.draw = function () {
  const meta = this._cachedMeta
  const vScale = meta.vScale
  const rects = meta.data
  const ilen = rects.length
  const dataset = meta._dataset
  const chartArea = this.chart.chartArea

  for (let i = 0; i < ilen; ++i) {
    if (this.getParsed(i)[vScale.axis] !== null) {
      rects[i].draw(this._ctx, chartArea, dataset, i)
    }
  }
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  BarElement,
)

export default class YoutubeSubscriberBarChart extends React.Component {

  constructor(props) {
    super(props)
    this.chart = React.createRef()
  }

  getDisplayedDataHeight() {
    return this.getDisplayedDataCount() * ROW_HEIGHT + X_AXIS_HEIGHT
  }

  getDisplayedDataCount() {
    return this.props.data.filter((e) => e.display).length
  }

  loadDataToChart(data) {
    const chartData = {
      labels: [],
      datasets: [
        {
          data: [],
          images: [],
          channelIds: [],
          barColors: [],
          isLive: [],
          isUpcomingLive: [],
          label: 'Subscribers',
          backgroundColor: '#dc3545',
          hoverBackgroundColor: 'rgba(255,0,54,0.4)',
        },
      ],
    }

    let currentLive = []
    let currentUpcomingLive = []
    let displayedIndex = 0
    let isLive = false

    data.forEach(function (item) {
      if (!item.display) {
        return
      }
      isLive = currentLive.some(
        (obj) => obj.channel.yt_channel_id == item.channelId
      )
      let isUpcomingLive = currentUpcomingLive.find(
        (obj) => obj.channel.yt_channel_id == item.channelId
      )
      chartData.labels.push(item.channelName)
      chartData.datasets[0].data.push(item.subscriberCount)
      chartData.datasets[0].isLive.push(isLive)
      chartData.datasets[0].isUpcomingLive.push(isUpcomingLive)
      chartData.datasets[0].channelIds.push(item.channelId)
      chartData.datasets[0].barColors[displayedIndex] = item.color
      chartData.datasets[0].images.push(item.channelImage)
      displayedIndex++
    })

    ChartJS.register({
      id: 'dataset_config',
      beforeDatasetUpdate: function (chart) {
        chart.data.images = chartData.datasets[0].images
        chart.data.channelIds = chartData.datasets[0].channelIds
        chart.data.barColors = chartData.datasets[0].barColors
      },
    })

    return chartData
  }

  handleElementsClick(e) {
    const pos = getRelativePosition(e, this.chart.current)
    let clickedIndex = -1
    Interaction.evaluateInteractionItems(this.chart.current, 'y', pos, (element, datasetIndex, index) => {
      if (element.active) {
        clickedIndex = index
      }
    })
    if (clickedIndex < 0) {
      return
    }
    const channelId = this.props.data[clickedIndex].channelId
    const wndOpts = (!e.getModifierState('Control')) ? 'toolbar=no,location=no,menubar=no,width=680,height=800' : ''
    window.open(`https://youtube.com/channel/${channelId}`, '_blank', wndOpts)
  }

  render() {
    if (this.getDisplayedDataCount() == 0) {
      return null
    }
    return (
      <div
        className="w-100"
        style={{ height: Math.max(this.getDisplayedDataHeight(), 50) }}
      >
        <Bar
          id="chart"
          ref={this.chart}
          data={this.loadDataToChart(this.props.data)}
          options={CHART_OPTIONS}
          onClick={this.handleElementsClick.bind(this)}
        />
      </div>
    )
  }
}
