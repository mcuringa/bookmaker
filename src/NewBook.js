import React, { Component } from 'react';
import {Button, Icon} from 'react-materialize';


const NewBook = (props)=> {


    return (
      <div class="container">
        <form>
          <div id="bookInfo" class="input-field">
            <h1>Book Information</h1>
            <input type="text" placeholder="Book Title" name="bookTitle" />
            <input type="text" placeholder="Author Name" name="authorName" />
            <input type="text" placeholder="Illustrator Name" name="Illustrator Name" />

            <Button waves='light' class="right">NEXT</Button>
          </div>
        
          <div id="photoUpload">
            <h1>Image Upload</h1>
            <h3>Upload Image:</h3>
            <input type="file" id="pageImage" name="Image" accept="image/png, img/jpeg" />
            <h3>Alternative Text:</h3>
            <input type="text" placeholder="describe the image" name="altText" />
            <Button waves='light' class="right">BACK</Button>
            <Button waves='light' class="right">NEXT</Button>
          </div>
        
          <div id="pageText">
            <h1>Type Text</h1>
            <input type="text" placeholder="Type in the text on the page" id="text" name="text" />
            <Button waves='light' class="right">BACK</Button>
            <Button waves='light' class="right">NEXT</Button>
          </div>
        
          <div id="audioRecord">
            <h1>Record Text</h1>
            <input type="file" accept="audio/*" id="narration" capture="microphone"></input>
            <Button waves='light' class="right">BACK</Button>
            <Button waves='light' class="right">NEXT</Button>
          </div>
        
          <div id="morePages">
            <h1>Add another page?</h1>
            <Button waves='light' class="right">NOPE, DONE</Button>
            <Button waves='light' class="right">YES, ADD</Button>
          </div>
        </form>
      </div>

    )
}

export default NewBook;