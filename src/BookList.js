import React, { Component } from 'react';
import dbtools from "./dbtools";
import _ from "lodash";
import {
  Link
} from "react-router-dom";
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

export default BookList;