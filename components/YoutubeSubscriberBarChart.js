import React from "react";
import ReactLoading from 'react-loading';
import { Chart, HorizontalBar } from "react-chartjs-2";
import { createIntl, createIntlCache } from 'react-intl';

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
        const subcriberCountText = intl.formatNumber(tooltipItems.xLabel, { notation: "compact", compactDisplay: "short" });
        return ` ${subcriberCountText} Subscribers`;
      },
    }
  },
  maintainAspectRatio: false,
};

function isVertical(vm) {
  return vm && vm.width !== undefined;
}

function getBarBounds(vm) {
  var x1, x2, y1, y2, half;

  if (isVertical(vm)) {
    half = vm.width / 2;
    x1 = vm.x - half;
    x2 = vm.x + half;
    y1 = Math.min(vm.y, vm.base);
    y2 = Math.max(vm.y, vm.base);
  } else {
    half = vm.height / 2;
    x1 = Math.min(vm.x, vm.base);
    x2 = Math.max(vm.x, vm.base);
    y1 = vm.y - half;
    y2 = vm.y + half;
  }

  return {
    left: x1,
    top: y1,
    right: x2,
    bottom: y2
  };
}

function swap(orig, v1, v2) {
  return orig === v1 ? v2 : orig === v2 ? v1 : orig;
}

function parseBorderSkipped(vm) {
  var edge = vm.borderSkipped;
  var res = {};

  if (!edge) {
    return res;
  }

  if (vm.horizontal) {
    if (vm.base > vm.x) {
      edge = swap(edge, 'left', 'right');
    }
  } else if (vm.base < vm.y) {
    edge = swap(edge, 'bottom', 'top');
  }

  res[edge] = true;
  return res;
}

function parseBorderWidth(vm, maxW, maxH) {
  var value = vm.borderWidth;
  var skip = parseBorderSkipped(vm);
  var t, r, b, l;

  if (Chart.helpers.isObject(value)) {
    t = +value.top || 0;
    r = +value.right || 0;
    b = +value.bottom || 0;
    l = +value.left || 0;
  } else {
    t = r = b = l = +value || 0;
  }

  return {
    t: skip.top || (t < 0) ? 0 : t > maxH ? maxH : t,
    r: skip.right || (r < 0) ? 0 : r > maxW ? maxW : r,
    b: skip.bottom || (b < 0) ? 0 : b > maxH ? maxH : b,
    l: skip.left || (l < 0) ? 0 : l > maxW ? maxW : l
  };
}

function boundingRects(vm) {
  var bounds = getBarBounds(vm);
  var width = bounds.right - bounds.left;
  var height = bounds.bottom - bounds.top;
  var border = parseBorderWidth(vm, width / 2, height / 2);

  return {
    outer: {
      x: bounds.left,
      y: bounds.top,
      w: width,
      h: height
    },
    inner: {
      x: bounds.left + border.l,
      y: bounds.top + border.t,
      w: width - border.l - border.r,
      h: height - border.t - border.b
    }
  };
}

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
