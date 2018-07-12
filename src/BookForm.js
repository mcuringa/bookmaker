import React, { Component } from 'react';
import _ from "lodash";
import dbtools from "./dbtools";
import {Book} from "./NewBook";
import {Button, Icon} from 'react-materialize';

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
      <div className="container">
        <div className="row">
        <h1>Edit Book</h1>
        <h4 className="left">Cover Information</h4>
        </div>
        <Saving saving={this.state.saving} />
        <form onSubmit={this.save}>
          <div className="row">
              <div className="col s5">
                <div>
                <label htmlFor="coverImage" className="left">Cover Image</label>
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/HungryCaterpillar.JPG/220px-HungryCaterpillar.JPG"/>
                <Button className="right"> Update Image</Button>
                </div>
                <div>
                <label htmlFor="coverAltText" className="left">Cover Image Description</label>
                <input type="text" name="coverAltText" value={book.coverAltText} onChange={this.handleChange} />
                </div>
              </div>
        
              <div className="col s7">
                  <div>
                    <label htmlFor="title" className="left">Title</label>
                    <input type="text" id="title" value={book.title} onChange={this.handleChange} />
                  </div>

                  <div>
                    <label htmlFor="authorName" className="left">Author Name</label>
                    <input type="text" id="author" value={book.author} onChange={this.handleChange} />
                  </div>

                  <div>
                    <label htmlFor="illustratorName" className="left">Illustrator Name</label>
                    <input type="text" value={book.illustrator} onChange={this.handleChange} />
                  </div>
              </div>
          </div>
        
          <div className="row">
            <h4 className="left">Book Pages</h4>
          </div>
          <div className="row">
            <div className="col s5">
                <div>
                <label htmlFor="pageImage" className="left">Page Image</label>
                //Placeholder image for now
                <img src="https://origin2images-rainbowresource.netdna-ssl.com/products/004170i1.jpg" height ="100" width="200"/>
                <Button className="right"> Update Image</Button>
                </div>
                <div>
                <input type="text" placeholder="Describe the image" name="altText" value={book.altText} onChange={this.handleChange} />
                </div>
            </div>
        
            <div className="col 7">
                <div>
                <label htmlFor="text" className="left">Page Text</label>
                <input type="text" id="text" name="text" value={book.text} onChange={this.handleChange} />
                </div>
                <div>
                <label htmlFor="audio" className="left">Audio Recording</label>
                <p>User can review and re-record if needed</p>
                </div>
            </div>
        </div>
        <div className="row">
            <Button className="right" type="submit" onClick={()=> {this.props.history.replace('/')}}>DONE</Button>
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
