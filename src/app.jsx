import React from "react"
import ReactDOM from "react-dom"
import { Router, hashHistory } from 'react-router'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import reducer from "./dev/reducers/combinedReducer.js"
import routes from "./routes.jsx"
require('./styles/app.scss');

var store = createStore(reducer, applyMiddleware(thunk));

const app = document.getElementById('app');
ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory} routes={routes} />
  </Provider>,
  app
);
