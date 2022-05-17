import React from 'react';
import CustomCheckbox from './CustomCheckbox';
import { Button } from 'react-bootstrap';

const FILTERS = {
  'gen0': '0th Generation',
  'gen1': '1st Generation',
  'gen2': '2nd Generation',
  'gamers': 'Gamers',
  'gen3': '3rd Generation',
  'gen4': '4th Generation',
  'gen5': '5th Generation',
  'gen6': '6th Generation',
  
  'myth': 'Myth (EN1)',
  "projectHope": "Project:HOPE",
  'council': 'Council (EN2)',

  'area15': 'Area 15 (ID1)',
  'holoID2': 'Hololive ID 2nd Gen',
  'holoID3': 'Hololive ID 3rd Gen',

  'starsGen1': 'Holostars 1st Gen',
  'starsGen2': 'Holostars 2nd Gen',
  'starsGen3': 'Holostars 3rd Gen',

  "official": "Official Channels"
};

export default class FilterControl extends React.Component {
  handleCheckChange = (name, value) => {
    const { onFilterUpdate } = this.props;
    if (!onFilterUpdate) {
      return;
    }
    const newFilters = this.props.filters.filter(e => e != name);
    if (value) {
      newFilters.push(name);
    }
    onFilterUpdate(newFilters);
  }

  handleSelectAllClick = () => {
    this.props.onFilterUpdate(Object.keys(FILTERS));
  }

  handleClearAllClick = () => {
    this.props.onFilterUpdate([]);
  }

  renderFilterOptions () {
    const { filters } = this.props;
    return Object.keys(FILTERS).map(key =>
      <CustomCheckbox checked={filters.includes(key)} key={key} name={key} label={FILTERS[key]} onCheckChange={this.handleCheckChange} />
    );
  }

  render () {
    return (
      <div className={this.props.collapse ? 'collapse' : ''}>
        <span className="mr-4" style={{ color: '#dedede', fontWeight: 'bold', fontSize: 14 }}>Filters</span>
        <Button className="btn-sm btn-danger py-0 mr-2" onClick={this.handleSelectAllClick}>All</Button>
        <Button className="btn-sm btn-dark py-0" onClick={this.handleClearAllClick}>Clear</Button>
        <div className="my-2">{this.renderFilterOptions()}</div>
      </div>
    )
  }
}
