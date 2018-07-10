import React, { Component } from 'react';
import _ from "lodash";
import dbtools from "./dbtools";
import {Book} from "./NewBook";

class BookForm extends React.Component {
  constructor(props) {
    super(props);

    this.bookId = this.props.match.params.book;

    this.state = {
      book: new Book(),
      saving: false,
      loading: true
    };

    this.handleChange = _.bind(this.handleChange, this);
    this.save = _.bind(this.save, this);
    // wait for a 1 sec pause before saving
    this.save = _.debounce(this.save, 1000); 
  }

  componentWillMount() {
    dbtools.get("/books", this.bookId).then((book)=>{
      console.log("book loaded", book);
      this.setState({book: book, loading: false});
    });
  }

  save() {
    console.log("saving book.");
    this.setState({saving: true});
    const afterSave = ()=>{
      console.log("saved");
      this.setState({saving: false});
    }
    dbtools.save("/books", this.bookId, this.state.book).then(afterSave);
  }

  handleChange(e) {
    e.preventDefault();
    let book = this.state.book;
    book[e.target.id] = e.target.value;
    this.setState({book: book});
    this.save();
  }


  render() {
    const book = this.state.book;

    return (
      <div>
        <h4>Edit Book</h4>
        <Saving saving={this.state.saving} />
        <form onSubmit={this.save}>
          <div>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" value={book.title} onChange={this.handleChange} />
          </div>
          <div>
            <label htmlFor="desc">Description</label>
            <textarea id="desc" value={book.desc} onChange={this.handleChange} />
          </div>
        </form>
      </div>

    )
  }
}

const Saving = (props)=>{
  if(!props.saving)
    return null;
  return (<div>Saving...</div>)
}

export default BookForm;
