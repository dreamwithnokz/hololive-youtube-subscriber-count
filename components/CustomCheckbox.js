import React from 'react'
import styled from 'styled-components'

const CheckboxContainer = styled.div`
  display: inline-block;
`

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: ${props => props.checked ? '#dc3545' : '#0f0f0f'};
  border-radius: 3px;
  border: 1px solid #0a0a0a;
  transition: all 150ms;
  vertical-align: middle;
  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 2px #dc3545;
  }
  ${Icon} {
    margin-top: -0.75em;
    visibility: ${props => props.checked ? 'visible' : 'hidden'}
  }
`

const Label = styled.span`
  color: #dedede;
  margin-left: 0.5em;
  font-size: 0.9em;
  user-select: none;
`

const Checkbox = ({ className, checked, ...props }) => (
  <CheckboxContainer className={className}>
    <HiddenCheckbox checked={checked} {...props} />
    <StyledCheckbox checked={checked}>
      <Icon viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </Icon>
    </StyledCheckbox>
  </CheckboxContainer>
)

export default class CustomCheckbox extends React.Component {
  state = { checked: this.props.checked || false }

  handleCheckboxChange = event => {
    const { onCheckChange } = this.props
    this.setState({ checked: event.target.checked })
    if (typeof onCheckChange != 'undefined') {
      onCheckChange(event)
    }
  }

  render() {
    return (
      <span className="mr-4">
        <label>
          <Checkbox checked={this.state.checked} onChange={this.handleCheckboxChange}/>
          <Label>{this.props.label}</Label>
        </label>
      </span>
    )
  }
}