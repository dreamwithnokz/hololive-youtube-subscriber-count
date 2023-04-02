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
  margin-left: 0.2em;
  font-size: 0.9em;
  user-select: none;
`

const Checkbox = ({ className, checked, ...props }) => (
  <CheckboxContainer className={className}>
    <HiddenCheckbox checked={checked} {...props} />
    <StyledCheckbox checked={checked}>
      <Icon viewBox="0 0 24 24">
        <polyline points="19 3 9 15 4 10" />
      </Icon>
    </StyledCheckbox>
  </CheckboxContainer>
)

export default class CustomCheckbox extends React.Component {
  handleCheckboxChange = (event) => {
    const { onCheckChange, name } = this.props
    if (typeof onCheckChange != 'undefined') {
      onCheckChange(name, event.target.checked)
    }
  }

  render () {
    return (
      <span className="me-2">
        <label>
          <Checkbox checked={this.props.checked} onChange={this.handleCheckboxChange}/>
          <Label>{this.props.label}</Label>
        </label>
      </span>
    )
  }
}
