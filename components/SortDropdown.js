import React from 'react'
import { Form } from 'react-bootstrap'
import styles from '../styles/FilterDropdown.module.scss'

const sortOptions = {
  'SUBSCRIBERS_DESC': 'Most subscribers',
  'SUBSCRIBERS_ASC': 'Least subscribers',
}

export default class YoutubeSubscriberHorizontalBar extends React.Component {
  handleSortChange (e) {
    if (typeof this.props.onSortChange != 'undefined') {
      this.props.onSortChange(e.target.value)
    }
  }

  renderSortOptions () {
    return Object.keys(sortOptions).map(key => {
      return <option key={key} value={key}>{sortOptions[key]}</option>
    })
  }

  render() {
    return (
      <Form inline className="mb-2 w-100 justify-content-sm-end">
        <Form.Label className={[styles.label, "my-1", "mr-2"]} htmlFor="sortPref">
          Sort by 
        </Form.Label>
        <Form.Control
          as="select"
          id="sortPref"
          className={[styles.sortSelection, "my-1"]}
          onChange={this.handleSortChange.bind(this)}
          custom>
            {this.renderSortOptions()}
        </Form.Control>
      </Form>
    )
  }
}