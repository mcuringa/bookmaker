import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import NewBook from "./NewBook";


class App extends Component {
  

  render() {
    return (
      <div className="App">
        <Header msg="Sophie!" user="Loreto" />
        <NewBook />
      </div>
    );
  }
}

const Header = (props)=> {

  return (
    <header>
      {props.msg}
      <ul>
        <a href="/">Go Home</a>
        <a href="/new">New Book</a>
      </ul>
      You are logged in as {props.user}.
    </header>
  )

}


export default App;
