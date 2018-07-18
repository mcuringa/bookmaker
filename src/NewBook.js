import React, { Component } from 'react';
import _ from "lodash";
import {Link, Redirect} from 'react-router-dom';
import dbtools from "./dbtools";

import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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
/*
startRecording = () =>{
      this.setState({
          record: true
      });
      console.log('recording started');
  }

stopRecording = ()=> {
      this.setState({
          record: false
      });
      console.log('recording stopped');
  }

onStop(recordedBlob){
      console.log('Now what to do with this recorded blob?', recordedBlob);
  }
*/

class NewBook extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      book: new Book(),
      saving: false,
      saved: false,
      record: false
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

    return(
      <h4>Stepper Element Goes Here </h4>
        /*VerticalLinearStepper.propTypes = {
          classes: PropTypes.object,
        }*/
    )
  }
}

const styles = theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

function getSteps() {
  return ['Book Information', 'Image Upload', 'Type Text', 'Record Text'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return (
        <div>
         <form onSubmit={this.save}>
                <h1>Book Information</h1>
                //<input type="text" placeholder="Book Title" id="title" value={book.title} onChange={this.handleChange} />
                //<input type="text" placeholder="Author Name" id="author" value={book.author} onChange={this.handleChange} />
                //<input type="text" placeholder="Illustrator Name" id="illustrator" value={book.illustrator} onChange={this.handleChange} />
                //<input type="file" accept="image/png, image/jpeg" id="coverImage" value={book.coverImage} onChange={this.handleChange} />
                //<input type="text" placeholder="Describe the  cover" name="coverAltText" value={book.coverAltText} onChange={this.handleChange} />
           </form>
        </div>
      );
    case 1:
      return (
        <div>
          <form onSubmit={this.save}>
            <h1>Image Upload</h1>
            <h3>Upload Image:</h3>
            //<input type="file" id="pageImage" name="Image" accept="image/png, img/jpeg" value={book.Image} onChange={this.handleChange} />
            //<input type="text" placeholder="describe the image" name="altText" value={book.altText} onChange={this.handleChange} />
          </form>
        </div>
      );
    case 2:
      return (
        <div>
          <form onSubmit={this.save}>
            <h1>Type Text</h1>
            //<input type="text" placeholder="Type in the text on the page" id="text" name="text" value={book.text} onChange={this.handleChange} />
          </form>
        </div>
      );
    case 3:
      return (
        <div>
          <form onSubmit={this.save}>
            <h1>Record Text</h1>
            <row>
                <ReactMic
                record={this.state.record}
                className="sound-wave"
                onStop={this.onStop}
                strokeColor='#000000'
                backgroundColor='#00AF9E' />
                <Button type = "button" onTouchTap={this.startRecording}>RECORD</Button>
                <Button type="button" onTouchTap={this.stopRecording}>STOP</Button>
            </row>
          </form>
        </div>
      );
    default:
      return 'Unknown step';
  }
}

class VerticalLinearStepper extends React.Component {

  state = {
    activeStep: 0,
  };

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
      button: state.submit
      //some way to submit the info generated - tried: this.save == syntax error
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  addPage =() => {
    this.setState({
      activeStep:1,
    });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{getStepContent(index)}</Typography>
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>All steps are finished. What Next?</Typography>
            <Button
              onClick={this.addPage}
              className={classes.button}
              color="primary"
            >
              Add Page
            </Button>
            <Button onClick={()=> {this.props.history.replace('/')}} className={classes.button}>
              Done
            </Button>
          </Paper>
        )}
      </div>
    );
  }
}



export {Book, NewBook, BookList}
