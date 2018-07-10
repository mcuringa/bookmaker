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


import {BookList, NewBook} from "./NewBook";
import BookForm from "./BookForm.js";

const ComingSoon = (props)=> {
  return <h4>Coming soon!</h4>
}


class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
          <Header msg="Sophie!" user="Loreto" />
          <Switch>
            <Route exact path="/" component={BookList} />
            <Route exact path="/new" component={NewBook} />
            <Route path="/:book/edit" component={BookForm} />
            <Route path="/:book/read" component={ComingSoon} />
          </Switch>
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
