import React, { Component } from 'react';
// import './App.css';
import {Button, Icon} from 'react-materialize';

import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink,
  Switch,
} from "react-router-dom";

import {BookEditor} from "./BookEditor";
import BookList from "./BookList";


class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
          <Header msg="Sophie!" user="Loreto" />
          <Switch>
            <Route exact path="/new" component={BookEditor} />
            <Route exact path="/:book/edit" component={BookEditor} />
            <Route path="/:book/read" component={()=>{"Coming Soon!"}} />
            <Route exact path="/" component={BookList} />

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
