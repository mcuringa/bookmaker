import React, { Component } from 'react';


const NewBook = (props)=> {


    return (
      <div>
        <form>
          <div>
            <label for="bookTitle">Title</label>
            <input type="text" name="bookTitle" />
          </div>
          <div>
            <label for="bookText">Text</label>
            <textarea name="bookText" />
          </div>
        </form>
      </div>

    )
}

export default NewBook;