import React, { Component } from 'react';
import _ from "lodash";
import {Link, Redirect} from 'react-router-dom';
import dbtools from "./dbtools";



function Book() {

  return {
    title: "",
    author: "",
    desc: "",
    created: new Date(),
    modified: new Date()
  }
}


class BookList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { books: [] };
  }

  componentDidMount() {
    const makeList = (books)=> {
      this.setState({books: books});
    }
    dbtools.findAll("/books").then(makeList);
  }

  render() {
    const list = _.map(this.state.books, BookItem);

    return (
      <div>
        <h4>Book List</h4>
        {list}
      </div>
    )

  }
}

const BookItem = (book)=> {

  return (
    <div key={`book_${book.id}`}>
      <em>{book.title}</em>
      <Link to={`/${book.id}/read`}>[read]</Link> 
      ~ <Link to={`/${book.id}/edit`}>[edit]</Link>
      <hr />
    </div>
  )
}



class NewBook extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      book: new Book(),
      saving: false,
      saved: false
    };

    this.handleChange = _.bind(this.handleChange, this);
    this.save = _.bind(this.save, this);
  }

  handleChange(e) {
    e.preventDefault();
    let book = this.state.book;
    book[e.target.id] = e.target.value;

    this.setState({book: book});
  }

  save() {
    this.setState({saving: true});
    const done = ()=>{this.setState({saving: false, saved: true});};
    dbtools.add("/books", this.state.book).then(done);
  }

  render() {
    const book = this.state.book;

    if(this.state.saving) {
      return (
        <div>Saving...</div>
      )
    }


    if(this.state.saved) {
      return (
        <Redirect
          to={{ pathname: "/", state: { from: this.props.location }
          }}
        />
      )
    }


    return (
      <div>
        <form onSubmit={this.save}>
          <div>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" value={book.title} onChange={this.handleChange} />
          </div>
          <div>
            <label htmlFor="desc">Description</label>
            <textarea id="desc" value={book.desc} onChange={this.handleChange} />
          </div>
          <div>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>

    )
  }
}

export { Book, NewBook, BookList };
