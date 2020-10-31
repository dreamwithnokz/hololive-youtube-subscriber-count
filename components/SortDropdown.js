import React from 'react'
import { Form } from 'react-bootstrap'
import styles from '../styles/FilterDropdown.module.scss'

export default class YoutubeSubscriberHorizontalBar extends React.Component {
  handleSelect () {
    // todo: handle selection event here
  }

  render() {
    return (
      <Form inline className="mb-2">
        <Form.Label className={[styles.label, "my-1", "mr-2"]} htmlFor="sortPref">
          Sort by 
        </Form.Label>
        <Form.Control
          as="select"
          className={[styles.sortSelection, "my-1", "mr-sm-2"]}
          id="sortPref"
          custom>
          <option>Most subscribers</option>
          <option>Least subscribers</option>
        </Form.Control>
      </Form>
    )
  }
}