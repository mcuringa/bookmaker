import React from 'react';
import 'jquery';
import 'react-materialize';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import dbtools from './dbtools';
import registerServiceWorker from './registerServiceWorker';
dbtools.init();
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
