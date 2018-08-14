import React from 'react';

import { Link } from 'react-router-dom'
import _ from "lodash";
import { ProgressBar, Icon, Button } from "react-materialize";
import dbtools from "./dbtools";

let firebase = require("firebase");

const storageFileName = (path)=> {
  let start = path.lastIndexOf("/");
  let end = path.lastIndexOf("?")
  let fileName = (end === -1)?path.slice(start): path.slice(start,end);
  fileName = fileName.replace(/%2F/g,"/");
  return fileName;
}

const fileName = (path)=> {
  return  _.last(storageFileName(path).split("/"));
}


const formatFileSize = (bytes, si)=>{
  const thresh = si ? 1000 : 1024;
  if(bytes < thresh) return bytes + ' B';
  const units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
  let u = -1;
  do {
      bytes /= thresh;
      ++u;
  } while(bytes >= thresh);
  return bytes.toFixed(1)+' '+units[u];
}


class UploadProgress extends React.Component {

  constructor(props) {
    super(props);
    this.state = {paused: false};
  }


  render() {
    let pct = this.props.pct;
    if((!pct || _.isNaN(pct)) && !this.props.show)
      return null;

    pct = this.props.pct || 0;

    const pause = ()=>{
      try {
        this.props.task.pause();
        this.setState({paused: true});
      }
      catch(e) {
        console.log(e);
      }
    }

    const resume = ()=>{
      try {
        this.props.task.resume();
        this.setState({paused: false});
      }
      catch(e) {
        console.log(e);
      }
    }
    const cancel = ()=>{
      try {
        if(this.state.paused)
          this.props.task.resume().then(this.props.task.cancel);
        else
          this.props.task.cancel();
      }
      catch(e) {
        console.log(e);
      }
    }

    const MediaControls = ()=>{

      if(!this.props.task)
        return null;

      return (
        <div className="MediaControls">
          <Button waves='light' onClick={pause}>pause<Icon left>pause_circle_filled</Icon></Button>
          <Button waves='light' onClick={resume}>resume<Icon left>play_circle_filled</Icon></Button>
          <Button waves='light' onClick={cancel}>cancel<Icon left>stop</Icon></Button>
        </div>
      )
    }

    return (
      <div>
        <MediaControls />
        <ProgressBar progress={pct}/>
      </div>
    );
  }
}


class MediaUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pct: 0, 
      msg: 0,
      uploading: false
    };
    this.uploadTask = null;

    this.handleUpload = _.bind(this.handleUpload, this);
    this.reportValidity = _.bind(this.reportValidity, this);
    this.getErrorMsg = _.bind(this.getErrorMsg, this);
    this.getFileSizeErrorMsg = _.bind(this.getFileSizeErrorMsg, this);

    this.reportValidity = _.throttle(this.reportValidity, 1000);
  }

  reportValidity() {
    const url = this.props.url || "";
    const empty = (this.props.required && url.trim().length === 0)
    if(empty)
      return false;
    if(this.state.uploading)
      return false;
    if(this.state.fileSizeExceeded) {
      return false;
    }

    return true;

  }

  getFileSizeErrorMsg() {
    return this.props.filesizeErrorMsg || "Your file is too large. Max file size is " + formatFileSize(this.props.maxFileSize, true);
  }

  getErrorMsg() {

    const noUrl = (!this.props.url || this.props.url.trim().length === 0);

    if(this.state.uploading)
      return "Please wait for your upload to complete before saving.";
    if(this.state.fileSizeExceeded)
      return this.getFileSizeErrorMsg();
    if(noUrl)
      return this.props.requiredErrorMsg || "Please upload a file before submitting.";
    
    return null;
  }

  componentWillUnmount() {
    if(this.state.uploading && this.handleUpload && this.handleUpload.cancel) {
      this.handleUpload.cancel();
    }
  }

  componentDidUpdate() {
    const id = `${this.props.id}`;
    let field = document.getElementById(id);
    if(field && !this.reportValidity()) {
      field.setCustomValidity(this.getErrorMsg());
    }
  }

  handleUpload(e) {


    let file = e.target.files[0];
    this.setState({mimeType: file.type});
    const size = file.size;
    if(this.props.maxFileSize && this.props.maxFileSize < size) {
      this.setState({fileSizeExceeded: true});
      return;
    }

    const key = e.target.id;

    this.setState({
        pct: 1,
        msg: "uploading...", 
        fileSizeExceeded: false,
        uploading: true});

    
    const succ = ()=> {
      this.setState({
        pct: 0,
        msg: "",
        uploading: false,
        mimeType: null
      });

      this.props.handleUpload(this.uploadTask.snapshot.downloadURL, key);
    }

    const watch = (snapshot)=> {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      const xfer = formatFileSize(snapshot.bytesTransferred, true);
      const total = formatFileSize(snapshot.totalBytes, true);

      this.setState( {
        pct: progress, 
        msg: `${xfer} of ${total}`
      });
    }

    const err = (e)=> {
      if(e.code === 'storage/canceled') {
        this.setState({
          pct: 0,
          msg: "",
          uploading: false,
          mimeType: null
        });
      }
      else {
        console.log("error uploading media");
        console.log(e);       
      }

    }

    this.uploadTask = this.uploadMedia(file, this.props.path, watch, succ, err);
  }

  uploadMedia(file, path, progress, succ, err) {
    console.log("begin file upload");
    let storageRef = firebase.storage().ref();
    const name = dbtools.slug(file.name);
    console.log("file", name);
    const id = dbtools.uuid();
    path = `${path}/${id}/${name}`;
    console.log("full path", path);

    let ref = storageRef.child(path);
    let uploadTask = ref.put(file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, progress, err, succ );
    return uploadTask;

  }


  render() {

    if(this.props.hide)
      return null;
    
    const validCss = (this.reportValidity())?"is-valid":"was-validated is-invalid";

    const params = _.omit(this.props, ["handleUpload"]);

    return (

      <div className={`MediaUploader ${this.props.className||""} ${validCss}`}>
        <Uploader />

      </div>

    )
  }
}


const ImageUpload = (props)=> {
  const clear = ()=> {
    props.clearMedia(props.id);
  }

  return (
    <div>
      <Label label={props.label} htmlFor="" />
      <div className="ImageUploadLabel d-flex justify-content-between">
        <FileNameLink {...props} />
        <div className="ImageUploadButtonImproved p-0 m-0 d-flex justify-content-end">
          <UploadFileInput id={props.id} handleUpload={props.handleUpload} accept="image/*"/>
          <label className="text-primary p-0 m-0" htmlFor={props.id}>
            <div className="btn btn-link p-0 m-0 icon-secondary">
              <DeviceCameraIcon />
            </div>
          </label>
          <Button waves='light' onClick={clear}><Icon>delete</Icon></Button>

        </div>
      </div>
      <div className="collapse bg-dark p-2" id={`ImgUpload_${props.id}`}>
        <img src={props.url || props.placeholderImg} alt="upload preview" />
      </div>
      <UploadProgress pct={props.pct} msg={props.msg}  show={props.uploading} />
    </div>
  )
}

const ImageOnlyUpload = (props)=> {
  return (
    <div className="ImageUploadImproved">
      <div className="position-relative" id={`ImgUpload_${props.id}`}>
        <UploadBtn {...props} />
        <img src={props.url || props.placeholderImg} alt="upload preview" />
      </div>
      <UploadProgress pct={props.pct} msg={props.msg}  show={props.uploading} />
    </div>
  )
}

const UploadBtn = (props)=> {

  const clear = ()=> {
    props.clearMedia(props.id);
  }

  return (
    <div className="ImageUploadButtonImproved p-0 m-0 position-absolute d-flex justify-content-between align-items-baseline"
      style={{bottom: 0, left: 0, right: 0}}>
      <UploadFileInput id={props.id} handleUpload={props.handleUpload} accept="image/*" />
      <label className="p-0 m-0" htmlFor={props.id}>
        <div className="btn btn-link p-0 ml-1 icon-secondary">
          <DeviceCameraIcon className="" />
        </div>
      </label>
      <Button waves='light' onClick={clear}><Icon>delete</Icon></Button>

    </div>
  )
}

export {UploadProgress, formatFileSize, MediaUpload};