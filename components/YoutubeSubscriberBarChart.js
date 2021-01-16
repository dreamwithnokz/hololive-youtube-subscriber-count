import React from "react";
import { Chart, HorizontalBar } from "react-chartjs-2";
import { createIntl, createIntlCache } from "react-intl";
import { boundingRects } from "../utils/app-utils";
import styled from "styled-components";

const intl = createIntl(
  { locale: "en", defaultLocale: "en" },
  createIntlCache()
);

const THUMBNAIL_SIZE = 38.5;

const ROW_HEIGHT = 53.5;

const X_AXIS_HEIGHT = 38;

const GRIDLINE_COLOR = "#262424";

const CHART_OPTIONS = {
  legend: {
    display: false,
  },
  hover: {
    onHover: function (e, data) {
      // show hand cursor when pointer hits data on chart
      document.getElementById("chart").style.cursor = data[0]
        ? "pointer"
        : "default";
    },
  },
  scales: {
    yAxes: [
      {
        gridLines: {
          color: GRIDLINE_COLOR,
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          color: GRIDLINE_COLOR,
        },
        ticks: {
          beginAtZero: true,
          callback: function (value) {
            return intl.formatNumber(value, {
              notation: "compact",
              compactDisplay: "short",
            });
          },
        },
      },
    ],
  },
  tooltips: {
    enabled: true,
    mode: "single",
    displayColors: false,
    callbacks: {
      title: function (tooltipItems) {
        return tooltipItems.length == 0 ? "" : tooltipItems[0].yLabel;
      },
      label: function (tooltipItems, data) {
        const subcriberCountText = intl.formatNumber(tooltipItems.xLabel, {
          notation: "compact",
          compactDisplay: "short",
          maximumFractionDigits: 2,
        });
        let text = [];
        text.push(` ${subcriberCountText} Subscribers`);
        if (data.datasets[0].isLive[tooltipItems.index]) {
          text.push(` Currently Live`);
        } else if (data.datasets[0].isUpcomingLive[tooltipItems.index]) {
          text.push(
            ` Live at ` +
              new Date(
                data.datasets[0].isUpcomingLive[
                  tooltipItems.index
                ].live_schedule
              ).toLocaleTimeString(navigator.language, {
                hour: "2-digit",
                minute: "2-digit",
              })
          );
        }
        return text;
      },
    },
  },
  maintainAspectRatio: false,
};

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw() {
    const { ctx } = this._chart;
    const img = this._chart.data.images[this._index];
    const barColor = this._chart.data.barColors[this._index];
    const isLive = this._chart.data.datasets[0].isLive[this._index];
    const isUpcomingLive = this._chart.data.datasets[0].isUpcomingLive[
      this._index
    ];

    var vm = this._view;
    var { outer, inner } = boundingRects(vm);

    ctx.fillStyle = barColor;
    ctx.fillRect(outer.x, outer.y, outer.w, outer.h);

    // extend: draw image
    if (img && img.width > 0 && img.height > 0) {
      const x0 = this._chart.chartArea.left;
      ctx.drawImage(
        img,
        Math.max(x0, outer.x + outer.w - THUMBNAIL_SIZE),
        outer.y,
        THUMBNAIL_SIZE,
        THUMBNAIL_SIZE
      );
    }

    if (isLive) {
      ctx.beginPath();
      ctx.arc(
        Math.max(
          this._chart.chartArea.left,
          outer.x + outer.w - THUMBNAIL_SIZE
        ) + 38,
        outer.y,
        5,
        0,
        2 * Math.PI,
        false
      );
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#330000";
      ctx.stroke();
    } else if (isUpcomingLive) {
      ctx.beginPath();
      ctx.arc(
        Math.max(
          this._chart.chartArea.left,
          outer.x + outer.w - THUMBNAIL_SIZE
        ) + 38,
        outer.y,
        5,
        0,
        2 * Math.PI,
        false
      );
      ctx.fillStyle = "yellow";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#333300";
      ctx.stroke();
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
    ctx.fill("evenodd");
    ctx.restore();
  },
});

export default class YoutubeSubscriberHorizontalBar extends React.Component {
  getDisplayedDataHeight() {
    return this.getDisplayedDataCount() * ROW_HEIGHT + X_AXIS_HEIGHT;
  }

  getDisplayedDataCount() {
    return this.props.data.filter((e) => e.display).length;
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
          label: "Subscribers",
          backgroundColor: "rgba(244,105,105,0.5)",
          hoverBackgroundColor: "rgba(255,0,54,0.4)",
        },
      ],
    };

    let currentLive = this.props.liveStatusData.live;
    let currentUpcomingLive = this.props.liveStatusData.upcoming;
    let displayedIndex = 0;
    let isLive = false;
    data.forEach(function (item, i) {
      if (!item.display) {
        return;
      }
      isLive = currentLive.some(
        (obj) => obj.channel.yt_channel_id == item.channelId
      );
      let isUpcomingLive = currentUpcomingLive.find(
        (obj) => obj.channel.yt_channel_id == item.channelId
      );
      chartData.labels.push(item.channelName);
      chartData.datasets[0].data.push(item.subscriberCount);
      chartData.datasets[0].isLive.push(isLive);
      chartData.datasets[0].isUpcomingLive.push(isUpcomingLive);
      chartData.datasets[0].channelIds.push(item.channelId);
      chartData.datasets[0].barColors[displayedIndex] = item.color;
      chartData.datasets[0].images.push(item.channelImage);
      displayedIndex++;
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

  handleElementsClick(e, f) {
    // view item's YouTube channel on new tab
    if (e.length == 0) {
      return;
    }
    const channelId = e[0]._chart.data.channelIds[e[0]._index];
    window.open(`https://youtube.com/channel/${channelId}`, "_blank");
  }

  render() {
    return this.getDisplayedDataCount() > 0 ? (
      <div
        className="w-100"
        style={{ height: Math.max(this.getDisplayedDataHeight(), 50) }}
      >
        <HorizontalBar
          id="chart"
          data={this.loadDataToChart(this.props.data)}
          options={CHART_OPTIONS}
          onElementsClick={this.handleElementsClick}
        />
      </div>
    ) : null;
  }
}
