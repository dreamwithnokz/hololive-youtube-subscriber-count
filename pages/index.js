import Head from 'next/head'
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function Home() {
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
      <p className="text-light">asd</p>
      <footer>
      </footer>
    </div>
  )
}
