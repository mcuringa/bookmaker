import React from 'react';
import 'jquery';
import 'react-materialize';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import dbtools from './dbtools';
import registerServiceWorker from './registerServiceWorker';
import config from "./fb-config";
let firebase = require("firebase");
firebase.initializeApp(config);

dbtools.init();
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
