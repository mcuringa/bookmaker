import React, { Component } from 'react';
import './App.css';
import {Button, Icon} from 'react-materialize';
// import Button from '@material-ui/core/Button';


import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink,
  Switch,
} from "react-router-dom";

import {BookEditor, PageEditor} from "./BookEditor";
import BookList from "./BookList";



const ComingSoon = (props)=> {
  return (
      <div>
        <h4>Book Title Goes Here</h4>
        <p>Book image goes here</p>
        <h4>Author Name:</h4>
        <h4>Illustrator:</h4>
      </div>
)}

//Maybe try using this sample: https://material-ui.com/demos/steppers/#mobile-stepper-text
/*const readBook =(props)=> {
  return (
    <div className="readBook">
      <div className="cover"
        <div className="bookTitle">
          {props.book.title}
        </div>

        <img
          className="coverImage"
          src={props.book.coverImage}
          alt={props.book.coverAltText}
        />

        <div className="author">
          <h4>Written by: {props.book.author} </h4>
        </div>

        <div className="illustrator">
          <h4>Illustrated by: {props.book.illustrator} </h4>
        </div>
    </div>

    <div className ="Page">
      <img
        className="pageImage"
        src={props.book.Image}
        alt={props.book.altText}
      </>
      <div className="pageText">
        <h4>{props.book.text}</h4>
      </div>
    </div>
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
            <Route exact path="/new" component={BookEditor} />
            <Route path="/:book/edit/page/:page" component={PageEditor} />
            <Route path="/:book/edit" component={BookEditor} />
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
