import React from 'react'
import CustomCheckbox from './CustomCheckbox'

export default class FilterControl extends React.Component {
  render () {
    const { collapse } = this.props
    return (
      <div className={collapse ? 'collapse' : ''}>
        <span style={{ color: '#dedede', fontWeight: 'bold', fontSize: 14 }}>Filters</span>
        <div className="mb-2">
          <CustomCheckbox checked={true} label="3D Talents" />
          <CustomCheckbox checked={true} label="2D Talents" />
          <CustomCheckbox checked={true} label="GAMERS" />
          <CustomCheckbox checked={true} label="1st Generation" />
          <CustomCheckbox checked={true} label="2nd Generation" />
          <CustomCheckbox checked={true} label="3rd Generation" />
          <CustomCheckbox checked={true} label="4th Generation" />
          <CustomCheckbox checked={true} label="5th Generation" />
        </div>
      </div>
    )
  }
}