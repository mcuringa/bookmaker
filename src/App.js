import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Button, Icon} from 'react-materialize';
import {VoicePlayer} from 'react-voice-components';

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
/*

const ReadBook = (props)=> {
  return (
    <div>
        <row>
          <img src ='book.Image' alt='book.altText' />
        </row>
        <row>
          <button class="btn-floating btn-small left"><i class="material-icons">chevron_left</i></button>
          <VoicePlayer play text = book.text />
          <h3 className='book.text'></h3>
          //need to add onClick text to speech

          <button class="btn-floating btn-small right"><i class="material-icons">chevron_right</i></button>
        </row>
        //add some way to trigger onload narrator function
    </div>
  )
}
*/


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
