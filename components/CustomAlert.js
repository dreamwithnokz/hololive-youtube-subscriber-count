import React from 'react';
import styled from 'styled-components';

const Alert = styled.div`
  background-color: #1b1718;
  border-radius: 0.25em;
  border: 1px solid #121212;
  box-shadow: 0 1px 2px -2px rgba(255, 255, 255, 0.8);
  color: #ff4b4b;
  margin: 1em 0;
  padding: 0.75em 1em;
  width: 100%;
`;

export default class CustomAlert extends React.Component {
  render () {
    const { message, visible } = this.props;
    return (visible) ? <Alert>{message}</Alert> : null;
  }
}