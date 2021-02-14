import React from 'react';
import CustomCheckbox from './CustomCheckbox';
import { Button } from 'react-bootstrap';

const FILTERS = {
  'gen1': '1st Generation',
  'gen2': '2nd Generation',
  'gen3': '3rd Generation',
  'gen4': '4th Generation',
  'gen5': '5th Generation',
  'gamers': 'Gamers',
  '2d': '2D Talents',
  '3d': '3D Talents',
  'myth': '-Myth- (EN)',
  'area15': 'Area 15 (ID)',
  'holoID2': 'Hololive ID 2nd Gen',
  'music': 'INoNaKa MUSIC',
  'starsGen1': 'Holostars 1st Gen',
  'starsGen2': 'Holostars 2nd Gen',
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
