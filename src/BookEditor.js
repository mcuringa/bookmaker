import React, { Component } from 'react';
import _ from "lodash";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from "react-router-dom";
import dbtools from "./dbtools";
import {Button, Icon} from 'react-materialize';
import {ReactMic} from 'react-mic';


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

function Page(bookId, pageNum) {

  return {
    id: pageNum,
    bookId: bookId,
    page: pageNum,
    img: "",
    alt: "",
    text: "",
    created: new Date(),
    modified: new Date()
  }
}



const BookEditor = (props)=> {
  console.log("book editor", props);

  return (
    <Router>
      <Switch>
        <Route exact path="/new" component={BookForm} />
        <Route path="/:book/edit" component={BookForm} />
        <Route path="/:book/page/:page" component={PageForm} />
      </Switch>
    </Router>
  )

}


const SaveButton = (props) => {
  const saving = props.savingLabel || "Saving...";

  if(props.saving) {
    return (
      <Button type="button" waves='light' className="center disasbled" disabled>{saving}</Button>
    )
  }

  return (
    <Button type="button" waves='light' className="center" onClick={props.onClick}>{props.label}</Button>
  )

}


class BookForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      book: new Book(),
      pages: [],
      saving: false,
      saved: false
    };

    this.handleChange = _.bind(this.handleChange, this);
    this.save = _.bind(this.save, this);
  }

  componentWillMount() {
    const id = this.props.match.params.book;
    console.log("book id", id);
    if(id) {
      const loadBook = (b)=> {this.setState({"book": b});}
      const loadPages = (t)=> {
        let pages = _.sortBy(t, "pageNum");
        this.setState({"pages": pages});
      }
      dbtools.get("/books", id).then(loadBook);
      dbtools.findAll(`/books/${id}/pages`).then(loadPages);

    }
  }

  handleChange(e) {
    e.preventDefault();
    let book = this.state.book;
    book[e.target.id] = e.target.value;

    this.setState({book: book});
  }

  addPage() {
    let p = new Page();
    p.bookId = this.state.book.id;
    if(this.state.pages.length > 0)
      p.id = this.state.pages.length + 1;
    else
      p.id = 1;
  }

  save() {
    console.log("Saving...")
    this.setState({saving: true});
    const done = (book)=>{this.setState({book: book, saving: false, saved: true});};
    dbtools.save("/books", this.state.book).then(done);
  }

  render() {
    const book = this.state.book;

    if(this.state.currentPage) {
      return <PageForm page={this.state.currentPage} updatePage={this.updatePage} />
    }

    return (
      <div className="container">
        <form onSubmit={this.save}>
          <div>
            <label htmlFor="title" className="left">Title</label>
            <input type="text" id="title" value={book.title} onChange={this.handleChange} />
          </div>

          <div>
            <label htmlFor="author" className="left">Author Name</label>
            <input type="text" id="author" value={book.author} onChange={this.handleChange} />
          </div>

          <div>
            <label htmlFor="illustrator" className="left">Illustrator Name</label>
            <input type="text" id="illustrator" value={book.illustrator} onChange={this.handleChange} />
          </div>
          <SaveButton onClick={this.save} saving={this.state.saving} label="Save Book" /> 
          <SaveButton onClick={this.addPage} saving={this.state.saving} savingLabel="-" label="Add Page" />
        </form>

      </div>

    )
  }
}


class PageForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      saved: false,
      page: this.props.page
    };

    this.handleChange = _.bind(this.handleChange, this);
    this.save = _.bind(this.save, this);
  }

  foo() {
    const bookId = this.props.match.params.book;
    const pageId = this.props.match.params.page;
    const loadBook = (b)=> {this.setState({"book": b});}
    dbtools.get("/books", bookId).then(loadBook);

    const editPage = (p)=> { this.setState({"page": p}); }
    const newPage = ()=> {
      let p = new Page();
      p.bookId = bookId;
      p.pageNum = 1;
      this.setState({"page": p});
    }

    dbtools.get(`/books/${bookId}/pages`, pageId).then(editPage, newPage);

  }

  handleChange(e) {
    e.preventDefault();
    let page = this.state.page;
    page[e.target.id] = e.target.value;

    this.setState({page: page});
  }

  save() {
    this.setState({saving: true});
    const done = (p)=>{
      this.setState({page: p, saving: false, saved: true});
      this.props.updatePage(this.state.page);

    };
    dbtools.save(`/books/${this.state.page.bookId}/pages`, this.state.page).then(done);
  }

  render() {
    const page = this.state.page;
    
    if(_.isNil(page))
      return null;

    return (
      <div className="container">
        <form onSubmit={this.save}>
          <h1><Link to={`/${this.props.book.id}/edit`}>{this.props.book.title}</Link> <small>Page {page.pageNum}</small></h1>
        
          <div id="photoUpload">
            <h1>Image Upload</h1>
            <h3>Upload Image:</h3>
            <input type="file" id="pageImage" name="Image" accept="image/png, img/jpeg" value={page.img} onChange={this.handleChange} />
            <h3>Alternative Text:</h3>
            <input type="text" placeholder="describe the image" name="altText" value={page.alt} onChange={this.handleChange} />
            <Button type ="button" waves='light' className="left"><i className="material-icons">chevron_left</i>BACK</Button>
            <Button type="button" waves='light' className="right">NEXT<i className="material-icons">chevron_right</i></Button>
          </div>
        
          <div id="pageText">
            <h1>Type Text</h1>
            <input type="text" placeholder="Type in the text on the page" id="text" name="text" value={page.text} onChange={this.handleChange} />
            <Button type= "button" waves='light' className="left"><i className="material-icons">chevron_left</i>BACK</Button>
            <Button type="button" waves='light' className="right">NEXT<i className="material-icons">chevron_right</i></Button>
          </div>
        
          <div id="morePages">
            <h1>Add another page?</h1>
            <Button type="submit" waves='light' className="center">NOPE, DONE</Button>

            <Button type= "button" waves='light' className="center">YES, ADD</Button>
          </div>
        </form>
      </div>

    )
  }
}



export { Book, BookEditor };
