import React, { Component } from 'react';

const TextReader = (props)=>{
  return (
    var synth= window.speechSynthesis;
    //var inputForm = document.querySelector('form');
    var inputTxt = document.querySelector('#text');

    onload = function(event){
    event.preventDefault();
    
    var utterThis = new SpeechSynthesisUtterance(inputText.value);
    }

    synth.speak(utterThis);
  )
}

export default TextReader