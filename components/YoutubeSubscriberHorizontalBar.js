import React from "react";
import { HorizontalBar } from "react-chartjs-2";

const data = {
  labels: [
    "as",
    "asd",
    "asdd",
    "asd",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
  ],
  datasets: [
    {
      data: [14, 20, 30, 65, 59, 80, 81, 56, 55, 40],
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

export default class YoutubeSubscriberHorizontalBar extends React.Component {
  render() {
    return (
      <div>
        <HorizontalBar data={data} options={options} width={400} height={300} />
      </div>
    );
  }
}
