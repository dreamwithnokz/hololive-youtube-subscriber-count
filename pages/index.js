import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";

const YOUTUBE_SUBSCRIPTIONS_API =
  "https://www.googleapis.com/youtube/v3/channels";

export async function getServerSideProps() {
  const res = await fetch(
    `${YOUTUBE_SUBSCRIPTIONS_API}?part=statistics&part=snippet&id=UCl_gCybOJRIgOXw6Qb4qJzQ&key=${process.env.YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  console.log("data", data);

  console.log("data", data.items[0].snippet.title);
  console.log("data", data.items[0].statistics.subscriberCount);
  return (
    <div>
      <Head>
        <title>Hololive Youtube Subscriber Count</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col xs="auto" md="auto">
            <h2 className="text-light">Hololive Youtube Subscriber Count</h2>
          </Col>
        </Row>
      </Container>
      <p className="text-light">{data.items[0].snippet.title}</p>
      <p className="text-light">{data.items[0].statistics.subscriberCount}</p>
      <footer></footer>
    </div>
  );
}
