import React from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import YoutubeSubscriberBarChart from "../components/YoutubeSubscriberBarChart.js";
import CustomAlert from "../components/CustomAlert.js";
import SortDropdown from "../components/SortDropdown.js";
import FilterControl from "../components/FilterControl.js";
import ReactLoading from 'react-loading';
import { rgbToHex } from '../utils/app-utils';
const { getColor } = require('color-thief-node');

const YOUTUBE_CHANNELS_API = "https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet";

export async function getServerSideProps() {
  const channelsReferenceList = (await import('../data/hololive-channels.json'))['channels'];
  const res = await fetch(
    `${YOUTUBE_CHANNELS_API}&id=${Object.keys(channelsReferenceList)}&key=${process.env.YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  return {
    props: {
      data,
      channelsReferenceList,
    },
  };
}

export default class Index extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      offlineAlertVisible: false,
      sort: 'SUBSCRIBERS_DESC',
      data: [],
      filters: [
        'gen1',
        'gen2',
        'gen3',
        'gen4',
        'gen5',
        'gamers',
        'myth',
        '2d',
        '3d',
        'area15',
        'holoID2',
        'music',
      ]
    }
  }

  initializeData (items) {
    const component = this;
    const channelData = items.map(item => ({
      avatarUrl: item.snippet.thumbnails,
      channelId: item.id,
      channelImage: null,
      channelName: item.snippet.title,
      color: '#dc3545',
      subscriberCount: item.statistics.subscriberCount,
      category: this.props.channelsReferenceList[item.id],
      display: true
    }));

    let loadingImageCount = 0;

    channelData.forEach(item => {
      // load avatar images
      let xhr = new XMLHttpRequest();

      // when xhr to the image has loaded, put data in Image object
      xhr.onload = function () {
        let url = URL.createObjectURL(this.response);
        let img = new Image();

        img.src = url;
        loadingImageCount++;

        // when image fails to load, decrement image loading counter
        img.onerror = function () {
          URL.revokeObjectURL(url);
          loadingImageCount--;
          if (loadingImageCount == 0) {
            component.handleDataInitialize(channelData);
          }
        };

        // when image is loaded, decrement loading counter and get dominant color
        img.onload = function () {
          URL.revokeObjectURL(url);
          item.color = rgbToHex(getColor(this, 16));
          loadingImageCount--;
          if (loadingImageCount == 0) {
            component.handleDataInitialize(channelData);
          }
        };

        item.channelImage = img;
      };

      // start xhr to load avatar images properly
      xhr.open('GET', item.avatarUrl.default.url, true);
      xhr.responseType = 'blob';
      xhr.send();
    })
  }

  sortData (data, sort) {
    const sortedData = [...data].sort((a, b) => a.subscriberCount - b.subscriberCount);

    if (sort == 'SUBSCRIBERS_DESC') {
      sortedData.reverse();
    }

    return sortedData;
  }

  filterData (data, filters) {
    return data.map(el => {
      el.display = filters.includes(el.category);
      return el;
    })
  }

  setDisplayData (data, filters, sort) {
    return this.sortData(this.filterData(data, filters), sort);
  }

  handleDataInitialize (data) {
    const { filters, sort } = this.state;
    this.setState({ data: this.setDisplayData(data, filters, sort) });
  }

  handleFilterUpdate = (newFilter) => {
    const { data, sort } = this.state;
    this.setState({ filters: newFilter, data: this.setDisplayData(data, newFilter, sort) });
  }

  handleSortChange = (sort) => {
    const { data, filters } = this.state;
    this.setState({ sort: sort, data: this.setDisplayData(data, filters, sort) });
  }

  handleWindowOffline = () => {
    this.setState({ offlineAlertVisible: true });
  }

  componentDidMount () {
    // call async to not block rendering of loading component
    setTimeout(() => {
      this.initializeData(this.props.data.items);
    }, 0);

    // handle window offline
    window.addEventListener('offline', this.handleWindowOffline);
    this.setState({ offlineAlertVisible: !navigator.onLine });
  }

  render () {
    const { data, filters, sort, offlineAlertVisible } = this.state;
    const mainComponents = (
      <Col>
        <SortDropdown onSortChange={this.handleSortChange} />
        <FilterControl filters={filters} collapse={false} onFilterUpdate={this.handleFilterUpdate} />
        <YoutubeSubscriberBarChart sort={sort} data={data} />
      </Col>
    );
    return (
      <div>
        <Head>
          <title>Hololive YouTube Subscriber Count</title>
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Hololive YT Subscriber Count" />
          <meta name="application-name" content="Hololive YouTube Subscriber Count" />
          <meta name="description" content="View Hololive's VTubers YouTube subscriber count." />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#18191A" />
          <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' />
          <link rel="apple-touch-icon" sizes="512x512" href="/hololive-512.png" />
          <link rel="icon" href="/favicon.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/hololive-32.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.png" />
        </Head>
        <Container className="content">
          <Row className="justify-content-center">
            <Col xs="auto" md="auto">
              <h2 className="mt-5 font-weight-bold text-light text-center">
                Hololive YouTube Subscriber Count
              </h2>
              <p className="text-secondary text-center">
                All data are fetched from the members' official YouTube channel.
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-center">
              <CustomAlert visible={offlineAlertVisible} message="You are offline. Connect to the internet to fetch the latest information." />
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-center">
              {(data.length > 0) ? mainComponents : <ReactLoading className="mt-5" type="bubbles" color="#f01f1f" delay={0} />}
            </Col>
          </Row>
        </Container>
        <div className="footer text-center">
          The developer is not affiliated with Hololive Production.
        <br />
          <a href="https://www.dreamwithnokz.dev" target="_blank">dreamwithnokz.dev</a>
        </div>
      </div>
    );
  }
}
