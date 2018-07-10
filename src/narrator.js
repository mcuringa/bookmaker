import React, { Component } from 'react';

const narrator = (props)=>{
    
    return (
    // checks to see if user can record
    var record = document.querySelector('.record');
    var stop = document.querySelector('.stop');
    var soundClips = document.querySelector('.sound-Clips');
    
    //need to add functionality to these buttons
    var acceptRecording = document.querySelector('.recordingOK');
    var recordAgain = document.querySelector('.recordAgain');
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.');
        navigator.mediaDevices.getUserMedia (
      {
         audio: true
      })
      .then(function(stream) {
      })
      .catch(function(err) {
         console.log('The following getUserMedia error occured: ' + err);
      }
        );
    } else {
        console.log('getUserMedia not supported on your browser!');
    }
    //recording
    var mediaRecorder = new MediaRecorder(stream);
    
    record.onclick = function(){
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log('recorder started');
    }
    //collecting recording
    var chunks = [];
    
    mediaRecorder.ondataavailable = function(e){
        chunks.push(e.data);
    }
    //stop recording
    stop.onclick = function(){
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log('recording stopped');
    }
    //what to do with the recording
    mediaRecorder.onstop = function(e){
        console.log('recorder stopped');
        var clipContainer = document.createElement('article');
        var audio = document.createElement('audio');
        
        clipContainer.classList.add('clip');
        audio.setAttribute('controls','');
        
        clipContainer.appendChild(audio);
        soundClips.appendChild(clipContainer);
        
        var blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'})
        chunks= [];
        var audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL;
    }
    
//end of narrator brackets    
    )
}

export {narrator};