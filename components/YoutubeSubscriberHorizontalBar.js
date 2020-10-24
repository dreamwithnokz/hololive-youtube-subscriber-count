import React from "react";
import Chart from "chart.js";
import { HorizontalBar } from "react-chartjs-2";

const data = {
  labels: [],
  datasets: [
    {
      data: [],
      label: "Subscribers",
      backgroundColor: "rgba(244,105,105,0.5)",
      hoverBackgroundColor: "rgba(255,0,54,0.4)",
      hoverBorderColor: "rgb(0,88,101)",
      order: 2,
    },
    {
      data: [],
      type: "scatter",
      label: "Name",
      backgroundColor: "rgba(244,105,105,0.0)",
      hoverBackgroundColor: "rgba(255,0,54,0.4)",
      order: 1,
    },
  ],
};

const options = {
  legend: {
    position: "bottom",
    onClick: (e) => e.stopPropagation(),
    labels: {
      filter: function (item, chart) {
        return !item.text.includes("Name");
      },
    },
  },
  hover: {
    onHover: function (e, data) {
      // show hand cursor when pointer hits data on chart
      document.getElementById('chart').style.cursor = data[0] ? 'pointer' : 'default';
    }
  },
  maintainAspectRatio: false,
};

function addItemsToData(items) {
  items.forEach(function (item, i) {
    Chart.pluginService.register({
      afterUpdate: function (chart) {},
    });
    data.labels.push(item.channelName);
    data.datasets[0].data.push(item.subscriberCount);
    data.datasets[1].data.push({
      x: item.subscriberCount,
      y: item.channelName,
    });
    Chart.pluginService.register({
      afterUpdate: function (chart) {
        var img = new Image(40, 40);
        img.src = item.avatarUrl.default.url;
        chart.getDatasetMeta(1).data[i]._model.pointStyle = img;
        chart.getDatasetMeta(0).data[i]._model.channelId = item.channelId;
      },
    });
  });
}

function sortItemsAscending(items) {
  var arrItems = [];
  for (var item of items) {
    arrItems.push({
      channelId: item.id,
      channelName: item.snippet.title,
      subscriberCount: item.statistics.subscriberCount,
      avatarUrl: item.snippet.thumbnails,
    });
  }
  arrItems
    .sort(function (a, b) {
      return a.subscriberCount - b.subscriberCount;
    })
    .reverse();
  return arrItems;
}

export default class YoutubeSubscriberHorizontalBar extends React.Component {
  handleElementsClick(e) {
    // view item's YouTube channel on new tab
    if (e.length == 0) {
      return;
    }
    let channelId = e[1]._model.channelId;
    window.open(`https://youtube.com/channel/${channelId}`, '_blank');
  }

  render() {
    addItemsToData(sortItemsAscending(this.props.items));
    return (
      <div>
        <HorizontalBar
          id="chart"
          data={data}
          options={options}
          width={400}
          height={2200}
          onElementsClick={this.handleElementsClick}
        />
      </div>
    );
  }
}
