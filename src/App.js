import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink,
  Switch,
} from "react-router-dom";


import NewBook from "./NewBook";
import BookList from "./BookList";


class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
          <Header msg="Sophie!" user="Loreto" />
          <switch>
            <Route exact path="/" component={BookList} />
            <Route exact path="/new" component={NewBook} />
            <Route path="/:book/edit" component={NewBook} />
            <Route path="/:book" component={NewBook} />
          </switch>
        </div>
      </Router>
    );
  }
}

const Header = (props)=> {

  return (
    <header>
      <ul>
        <Link to="/">Go Home</Link> | <Link to="/new">New Book</Link>
      </ul>
    </header>
  )

}


export default App;
