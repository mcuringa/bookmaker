import React, { Component } from 'react';
import _ from "lodash";
import {Link, Redirect} from 'react-router-dom';
import dbtools from "./dbtools";
import {Button, Icon} from 'react-materialize';



function Book() {

  return {
    title: "",
    author: "",
    illustrator: "",
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
      <div className="container">
        <form onSubmit={this.save}>
          <div id="bookInfo" className="input-field">
            <h1>Book Information</h1>
            <input type="text" placeholder="Book Title" id="title" value={book.title} onChange={this.handleChange} />
            <input type="text" placeholder="Author Name" id="author" value={book.author} onChange={this.handleChange} />
            <input type="text" placeholder="Illustrator Name" id="illustrator" value={book.illustrator} onChange={this.handleChange} />

            <Button waves='light' className="right" onClick={this.save}>NEXT</Button>
          </div>
        
          <div id="photoUpload">
            <h1>Image Upload</h1>
            <h3>Upload Image:</h3>
            <input type="file" id="pageImage" name="Image" accept="image/png, img/jpeg" />
            <h3>Alternative Text:</h3>
            <input type="text" placeholder="describe the image" name="altText" />
            <Button waves='light' className="right">BACK</Button>
            <Button waves='light' className="right">NEXT</Button>
          </div>
        
          <div id="pageText">
            <h1>Type Text</h1>
            <input type="text" placeholder="Type in the text on the page" id="text" name="text" />
            <Button waves='light' className="right">BACK</Button>
            <Button waves='light' className="right">NEXT</Button>
          </div>
        
          <div id="audioRecord">
            <h1>Record Text</h1>
            <input type="file" accept="audio/*" id="narration" capture="microphone"></input>
            <Button waves='light' className="right">BACK</Button>
            <Button waves='light' className="right">NEXT</Button>
          </div>
        
          <div id="morePages">
            <h1>Add another page?</h1>
            <Button waves='light' className="right">NOPE, DONE</Button>
            <Button waves='light' className="right">YES, ADD</Button>
          </div>
        </form>
      </div>

    )
  }
}

export { Book, NewBook, BookList };
