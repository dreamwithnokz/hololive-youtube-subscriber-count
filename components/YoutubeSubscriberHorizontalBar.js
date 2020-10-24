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

function addData(items) {
  for (var item of items) {
    data.labels.push(item.snippet.title);
    data.datasets[0].data.push(item.statistics.subscriberCount);
  }
}

export default class YoutubeSubscriberHorizontalBar extends React.Component {
  render() {
    addData(this.props.items);
    return (
      <div>
        <HorizontalBar data={data} options={options} width={400} height={700} />
      </div>
    );
  }
}
