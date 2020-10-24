import React from "react";
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
    },
  ],
};

const options = {
  legend: {
    position: "bottom",
    onClick: (e) => e.stopPropagation(),
  },
};

function addItemsToData(items) {
  for (var item of items) {
    data.labels.push(item.channelName);
    data.datasets[0].data.push(item.subscriberCount);
  }
}

function sortItemsAscending(items) {
  var arrItems = [];
  for (var item of items) {
    arrItems.push({
      'channelName': item.snippet.title,
      'subscriberCount': item.statistics.subscriberCount,
      'avatarUrl': item.snippet.thumbnails,
    });
  }
  arrItems.sort(function(a, b) {
    return a.subscriberCount - b.subscriberCount;
  }).reverse();
  return arrItems;
}

export default class YoutubeSubscriberHorizontalBar extends React.Component {
  render() {
    addItemsToData(sortItemsAscending(this.props.items));
    return (
      <div>
        <HorizontalBar data={data} options={options} width={400} height={500} />
      </div>
    );
  }
}
