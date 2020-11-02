import React from 'react';
import CustomCheckbox from './CustomCheckbox';

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
  'music': 'INoNaKa MUSIC',
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

  renderFilterOptions () {
    const { filters } = this.props;
    return Object.keys(FILTERS).map(key =>
      <CustomCheckbox checked={filters.includes(key)} key={key} name={key} label={FILTERS[key]} onCheckChange={this.handleCheckChange} />
    );
  }

  render () {
    return (
      <div className={this.props.collapse ? 'collapse' : ''}>
        <span style={{ color: '#dedede', fontWeight: 'bold', fontSize: 14 }}>Filters</span>
        <div className="mb-2">{this.renderFilterOptions()}</div>
      </div>
    )
  }
}