import React from "react";
import ReactLoading from 'react-loading';
import { Chart, HorizontalBar } from "react-chartjs-2";
import { createIntl, createIntlCache } from 'react-intl';
import { boundingRects } from '../utils/app-utils';

const intl = createIntl({ locale: 'en', defaultLocale: 'en', }, createIntlCache());

const THUMBNAIL_SIZE = 38.5;

const GRIDLINE_COLOR = '#262424';

const CHART_OPTIONS = {
  legend: {
    display: false
  },
  hover: {
    onHover: function (e, data) {
      // show hand cursor when pointer hits data on chart
      document.getElementById('chart').style.cursor = data[0] ? 'pointer' : 'default';
    }
  },
  scales: {
    yAxes: [{
      gridLines: {
        color: GRIDLINE_COLOR
      },
    }],
    xAxes: [{
      gridLines: {
        color: GRIDLINE_COLOR
      },
      ticks: {
        callback: function (value) {
          return intl.formatNumber(value, { notation: "compact", compactDisplay: "short" });
        },
      },
    }]
  },
  tooltips: {
    enabled: true,
    mode: 'single',
    displayColors: false,
    callbacks: {
      title: function (tooltipItems) {
        return (tooltipItems.length == 0) ? '' : tooltipItems[0].yLabel;
      },
      label: function (tooltipItems) {
        const subcriberCountText = intl.formatNumber(tooltipItems.xLabel, { notation: "compact", compactDisplay: "short", maximumFractionDigits: 2 });
        return ` ${subcriberCountText} Subscribers`;
      },
    }
  },
  maintainAspectRatio: false,
};

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw () {
    const { ctx } = this._chart;
    const img = this._chart.data.images[this._index];
    const barColor = this._chart.data.barColors[this._index];

    var vm = this._view;
    var { outer, inner } = boundingRects(vm);

    ctx.fillStyle = barColor;
    ctx.fillRect(outer.x, outer.y, outer.w, outer.h);

    // extend: draw image
    if (img.width > 0 && img.height > 0) {
      const x0 = this._chart.chartArea.left;
      ctx.drawImage(img, Math.max(x0, outer.x + outer.w - THUMBNAIL_SIZE), outer.y, THUMBNAIL_SIZE, THUMBNAIL_SIZE);
    }

    if (outer.w === inner.w && outer.h === inner.h) {
      return;
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(outer.x, outer.y, outer.w, outer.h);
    ctx.clip();
    ctx.fillStyle = vm.borderColor;
    ctx.rect(inner.x, inner.y, inner.w, inner.h);
    ctx.fill('evenodd');
    ctx.restore();
  }
});

export default class YoutubeSubscriberHorizontalBar extends React.Component {
  loadDataToChart (data) {
    const chartData = {
      labels: [],
      datasets: [{
        data: [],
        images: [],
        channelIds: [],
        barColors: [],
        label: "Subscribers",
        backgroundColor: "rgba(244,105,105,0.5)",
        hoverBackgroundColor: "rgba(255,0,54,0.4)",
        hoverBorderColor: "rgb(0,88,101)",
      }],
    };

    data.forEach(function (item, i) {
      chartData.labels.push(item.channelName);
      chartData.datasets[0].data.push(item.subscriberCount);
      chartData.datasets[0].channelIds.push(item.channelId);
      chartData.datasets[0].barColors[i] = item.color;
      chartData.datasets[0].images.push(item.channelImage);
    });

    // inject the images and channelIds on the chart instance because it cannot be in the dataset
    Chart.pluginService.register({
      beforeDatasetUpdate: function (chart) {
        chart.data.images = chartData.datasets[0].images;
        chart.data.channelIds = chartData.datasets[0].channelIds;
        chart.data.barColors = chartData.datasets[0].barColors;
      },
    });

    return chartData;
  }

  handleElementsClick (e, f) {
    // view item's YouTube channel on new tab
    if (e.length == 0) {
      return;
    }
    const channelId = e[0]._chart.data.channelIds[e[0]._index];
    window.open(`https://youtube.com/channel/${channelId}`, '_blank');
  }

  render() {
    const { data } = this.props;
    return (
      <div className="d-flex justify-content-center">
        { (Object.keys(data).length <= 0) ?
          <ReactLoading className="mt-5" type="bubbles" color="#f01f1f" delay={0}/>
          :
          <HorizontalBar
            id="chart"
            data={this.loadDataToChart(data)}
            options={CHART_OPTIONS}
            width={400}
            height={2200}
            onElementsClick={this.handleElementsClick} />
        }
      </div>
    );
  }
}
