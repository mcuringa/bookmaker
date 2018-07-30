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
import {
  Button, 
  Icon, 
  Card, 
  Preloader,
  Collection,
  CollectionItem
} from 'react-materialize';
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

function Page(bookId) {

  return {
    id: 0,
    bookId: bookId,
    pageNum: 0,
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
    <Button type="button" waves='light' className="center" onClick={props.onClick}>{props.children}</Button>
  )

}


class BookForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      book: new Book(),
      pages: [],
      saving: false,
      saved: false,
      loading: true
    };

    this.handleChange = _.bind(this.handleChange, this);
    this.save = _.bind(this.save, this);
    this.addPage = _.bind(this.addPage, this);
    this.updatePage = _.bind(this.updatePage, this);
  }

  componentWillMount() {
    const id = this.props.match.params.book;
    console.log("book id", id);
    if(id) {
      const loadBook = (b)=> {this.setState({"book": b});}
      const loadPages = (t)=> {
        // let pages = _.keyBy(t, (p)=>p.id);
        let pages = _.keyBy(t, "id");
        // let pages = t;
        this.setState({"pages": pages});
      }
      const bookPromise = dbtools.get("/books", id).then(loadBook);
      const pagesPromise = dbtools.findAll(`/books/${id}/pages`).then(loadPages);
      Promise.all([bookPromise, pagesPromise]).then(()=>{this.setState({loading: false});});

    }
  }

  handleChange(e) {
    e.preventDefault();
    let book = this.state.book;
    book[e.target.id] = e.target.value;

    this.setState({book: book});
  }

  updatePage() {
    console.log("updatePage");
  }

  addPage() {
    let p = new Page(this.state.book.id);
    if(this.state.pages.length > 0)
      p.id = this.state.pages.length + 1;
    else
      p.id = 1;
    p.pageNum = p.id;
    this.setState({currentPage: p});
  }

  save() {
    console.log("Saving...")
    this.setState({saving: true});
    const done = (book)=>{this.setState({book: book, saving: false, saved: true});};
    dbtools.save("/books", this.state.book).then(done);
  }

  render() {
    if(this.state.loading)
      return (
        <div className="container text-center">
          <Preloader />
          <p>Loading book...</p>
        </div>
      )

    const book = this.state.book;

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
          <SaveButton onClick={this.save} saving={this.state.saving}>Save Book</SaveButton>
          <SaveButton onClick={this.addPage} saving={this.state.saving} savingLabel="---  ---">Add Page</SaveButton>
        </form>

        <PageForm book={this.state.book} 
          pages={this.state.pages} 
          page={this.state.currentPage} 
          addPage={this.addPage}
          closePage={()=>{this.setState({currentPage: null})}}
          updatePage={this.updatePage} />

        <PageList pages={this.state.pages} />

      </div>

    )
  }
}


const PageList = (props)=> {
  const pages = _.sortBy(props.pages, "id");
  const Page = (p)=> {

    return (
      <CollectionItem>
        page {p.pageNum}
      </CollectionItem>
    )
  } 

  const pageItems = _.map(pages, Page);
  return (
    <Collection>{pageItems}</Collection>
  )
}

class PageForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      saved: false
    };

    this.handleChange = _.bind(this.handleChange, this);
    this.save = _.bind(this.save, this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.page !== this.props.page)
      this.setState({"page": this.props.page});
  }

  handleChange(e) {
    e.preventDefault();
    let page = this.state.page;
    page[e.target.id] = e.target.value;

    this.setState({page: page});

  }

  save(add) {
    this.setState({saving: true});
    const done = (p)=>{
      this.setState({page: p, saving: false, saved: true});
      this.props.updatePage(this.state.page);
      if(this.add)
        this.props.addPage();
      else
        this.props.closePage();


    };
    dbtools.save(`/books/${this.state.page.bookId}/pages`, this.state.page).then(done);
  }

  render() {
    const page = this.state.page;
    console.log("book page", this.state.page);
    if(_.isNil(page))
      return null;


    return (
      <form onSubmit={this.save}>

        <h1>Page Editor <small>page {page.pageNum}</small></h1>
        <div>
          <label htmlFor="pageNum">Page number</label>
          <input type="text" placeholder="page number" value={page.pageNum} id="pageNum" onChange={this.handleChange} />
        </div>
        <Card id="photoUpload" title="Page Image">
          <label htmlFor="pageImg">
            Upload the Image:
          </label>
          <div>
            <input type="file" id="pageImage" name="Image" accept="image/png, img/jpeg" value={page.img} onChange={this.handleChange} />
          </div>
          <div>
            <label htmlFor="altText">Alternative Text:</label>
            <input type="text" placeholder="describe the image" name="altText" value={page.alt} onChange={this.handleChange} />
          </div>
        </Card>
      
        <Card id="pageText" title="Page Text">
          <textarea placeholder="Type in the text on the page" id="text" style={{height:"10em"}} value={page.text} onChange={this.handleChange} />
        </Card>
      
        <div id="morePages">
          <div><label>Add another page?</label></div>
          <SaveButton onClick={this.save} saving={this.state.saving}>NOPE, DONE</SaveButton>
          <SaveButton onClick={this.save} saving={this.state.saving}>YES, ADD</SaveButton>
        </div>
      </form>

    )
  }
}



export { Book, BookEditor };
