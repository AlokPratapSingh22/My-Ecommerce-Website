import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import { Provider } from 'react-redux';

import store from './store';

import './bootstrap.min.css';
import './index.css';
import './css/login.css';
import './css/profile.css';
import './css/checkout.css';
import './css/place-order.css';
import './css/admin.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <Provider store={store} >
        <HashRouter>
            <App />
        </HashRouter>

    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();