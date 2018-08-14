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

import {MediaUpload} from "./MediaManager";

function Book() {

  return {
    title: "",
    author: "",
    illustrator: "",
    desc: "",
    coverImg: "",
    created: new Date(),
    modified: new Date()
  }
}

function Page() {

  return {
    pageOrder: 0,
    pageNum: 0,
    img: "",
    storageUrl: "",
    alt: "",
    text: "",
    created: new Date(),
    modified: new Date()
  }
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

class BookEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      book: new Book(),
      saving: false,
      loading: true
    };

    this.handleChange = _.bind(this.handleChange, this);
    this.save = _.bind(this.save, this);
  }

  componentWillMount() {
    const id = this.props.match.params.book;
    if(id) {
      const loadBook = (b)=> {this.setState({loading: false, book: b});}
      dbtools.get("/books", id).then(loadBook);
    }
    else {
      this.setState({loading: false, book: new Book()});
    }
  }

  handleChange(e) {
    e.preventDefault();
    let book = this.state.book;
    book[e.target.id] = e.target.value;

    this.setState({book: book});
  }

  addPage() {
    let p = new Page(this.state.book.id);
    const numPages = _.values(this.state.pages).length;
    p.pageOrder = p.pageNum = numPages + 1;
    this.setState({currentPage: p});
  }

  save() {
    this.setState({saving: true});
    
    let book = this.state.book;
    const done = (book, isNew)=>{this.setState({book: book, saving: false, newBook: isNew});};

    if(!_.isNil(book.id))
      dbtools.save("/books", book).then(done);
    else {
      const newBook = (id)=> {
        book.id = id;
        const redir = (book)=> {done(book, true)};
        dbtools.save("/books", book).then(redir);
      }
      const slug = dbtools.slug(book.title);
      dbtools.uniqueId("/books", slug).then(newBook);
    }
  }

  render() {

    if(this.state.newBook) {
      <Redirect to={`/${this.state.book.id}/edit`} />
    }

    if(this.state.loading)
      return (
        <div className="container text-center">
          <Preloader />
          <p>Loading book...</p>
        </div>
      )

    const book = this.state.book;
    const disabled = (this.state.saving)?"disabled":"";

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
          <MediaUpload url={book.coverImg} />
          <SaveButton onClick={this.save} saving={this.state.saving}>Save Book</SaveButton>
          <Link to={`/${book.id}/edit/page/add`} className={`btn waves-effect waves-light center ${disabled}`}>Add Page</Link>
        </form>
        <PageList pages={book.pages} book={book} />
      </div>

    )
  }
}


const PageList = (props)=> {
  const pages = _.sortBy(props.pages, "pageOrder");
  const Page = (p, i)=> {

    return (
      <CollectionItem key={`page_${i+1}`}>
        page {i+1} [<Link to={`/${props.book.id}/edit/page/${i+1}`}>edit</Link>]
      </CollectionItem>
    )
  } 

  const pageItems = _.map(pages, Page);
  return (
    <Collection>{pageItems}</Collection>
  )
}

class PageEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      loading: true
    };

    this.handleChange = _.bind(this.handleChange, this);
    this.save = _.bind(this.save, this);
    this.loadPage = _.bind(this.loadPage, this);
  }

  loadPage() {
    const id = this.props.match.params.book;
    const pageNum = this.props.match.params.page;
    console.log("mounting page", pageNum);
    const loadBook = (b)=> {
      let page;
      let index = -1;
      if(pageNum === "add") {
        page = new Page();
        index = b.pages.length
        page.pageNum = index + 1;

      }
      else if(!_.isNaN(pageNum) && pageNum - 1 < b.pages.length) {
        index = pageNum -1;
        page = b.pages[index];
      }
      this.setState({loading: false, book: b, page: page, index: index, addPage: false });
    }
    dbtools.get("/books", id).then(loadBook);

  }

  componentWillMount() {
    this.loadPage();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const pageNum = this.props.match.params.page;
    const oldPageNum = prevProps.match.params.page;

    if(pageNum !== oldPageNum)
      this.loadPage();
  }

  handleChange(e) {
    e.preventDefault();
    let page = this.state.page;
    page[e.target.id] = e.target.value;

    this.setState({page: page});

  }

  save(add) {
    this.setState({saving: true});
    const done = (p)=> {
      console.log("save page done");
      const goToBook = !add;
      this.setState({page: p, saving: false, book: book, addPage: add, done: goToBook});
    };

    let book = this.state.book;
    console.log("book id for pages", book.id);
    const i = this.state.index;
    if(!book.pages)
      book.pages = [];

    if(i === -1)
      book.pages.push(this.state.page);
    else
      book.pages[i] = this.state.page;
    console.log("saving pages", book.pages);
    dbtools.save("/books", book).then(done);

  }

  render() {

    if(this.state.addPage) {
      <Redirect to={`/${this.state.book.id}/edit/page/add`} />
    }

    if(this.state.done) {
      <Redirect to={`/${this.state.book.id}/edit`} />
    }

    if(this.state.loading)
      return (
        <div className="container text-center">
          <Preloader />
          <p>Loading page...</p>
        </div>
      )

    const page = this.state.page;
    if(_.isNil(page))
      return null;

    const add = _.ary(this.save, true);
    const done = _.ary(this.save, false);

    return (
      <form onSubmit={this.save}>

        <h3>{this.state.book.title} <small>page {page.pageNum}</small></h3>
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
          <SaveButton onClick={done} saving={this.state.saving}>NOPE, DONE</SaveButton>
          <SaveButton onClick={add} saving={this.state.saving}>YES, ADD</SaveButton>
        </div>
      </form>

    )
  }
}



export { Book, BookEditor, PageEditor };
