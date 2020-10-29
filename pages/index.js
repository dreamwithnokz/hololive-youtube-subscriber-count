import Head from "next/head";
import { Container, Row, Col, Card } from "react-bootstrap";
import YoutubeSubscriberBarChart from "../components/YoutubeSubscriberBarChart.js";

const YOUTUBE_CHANNELS_API =
  "https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet";
const YOUTUBE_CHANNEL_IDS = [
  "UCp6993wxpyDPHUpavwDFqgg",
  "UCDqI2jOz0weumE8s7paEk6g",
  "UC-hM6YJuNYVAmUWxeIr9FeA",
  "UC5CwaMl1eIgY8h02uZw7u8A",
  "UCD8HOxPs4Xvsm8H0ZxXGiBw",
  "UCQ0UDLQCjY0rmuxCDE38FGg",
  "UCdn5BQ06XqgXoAxIhbqw5Rg",
  "UCFTLzh12_nrtzqBPsTCqenA",
  "UC1CfXB_kRs3C-zaeTG3oGyg",
  "UC1opHUrw8rvnsadT-iGp7Cg",
  "UCXTpFs_3PqI41qX2d9tL2Rw",
  "UC7fk0CB07ly8oSl0aqKkqFg",
  "UC1suqwovbL1kzsoaZgFZLKg",
  "UCvzGlP9oQwU--Y0r9id_jnA",
  "UCp-5t9SrOQwXMU7iIjQfARg",
  "UChAnqc_AY5_I3Px5dig3X1Q",
  "UCvaTdHTWBGv3MKj3KVqJVCw",
  "UC1DCedRgGHBdm81E1llLhOQ",
  "UCl_gCybOJRIgOXw6Qb4qJzQ",
  "UCvInZx9h3jC2JzsIzoOebWg",
  "UCdyqAaZDKHXg4Ahi7VENThQ",
  "UCCzUftO8KOVkV4wQG1vkUvg",
  "UCZlDXzGoo7d44bwdNObFacg",
  "UCS9uQI-jC3DE0L4IpXyvr6w",
  "UCqm3BQLlJfvkTsX_hvm0UmA",
  "UC1uv2Oq6kNxgATlCiez59hw",
  "UCa9Y57gfeY0Zro_noHRVrnw",
  "UCFKOVgVbGmX65RxO3EtH3iw",
  "UCAWSyEs_Io8MtpY3m-zqILA",
  "UCUKD-uaobj9jiqB-VXt71mA",
  "UCK9V2B22uJYu3N7eR_BT9QA",
  "UC0TXe_LYZ4scaW2XMyi5_kw",
  "UCL_qhgtOy0dy1Agp8vkySQg",
  "UCHsx4Hqa-1ORjQTh9TYDhww",
  "UCMwGHR0BTZuLsmjY_NT5Pwg",
  "UCoSrY_IQQVpmIRZ9Xf-y93g",
  "UCyl1z3jo3XHR1riLFKG5UAg",
  "UCOyYb1c43VlX9rc_lT6NKQw",
  "UCP0BspO_AMEe3aQqqpo89Dg",
  "UCAoy6rzhSf4ydcYjJw3WoVg",
];

export async function getServerSideProps() {
  const res = await fetch(
    `${YOUTUBE_CHANNELS_API}&id=${YOUTUBE_CHANNEL_IDS}&key=${process.env.YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  return (
    <div>
      <Head>
        <title>Hololive YouTube Subscriber Count</title>
        <link rel="icon" href="/favicon.png" />
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
          <Col>
            <YoutubeSubscriberBarChart items={data.items} />
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
