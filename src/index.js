import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import store from './store'

// Material Dashboard 2 React Context Provider
import {MaterialUIControllerProvider} from './context';
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <MaterialUIControllerProvider>
            <Provider store={store}>
                <App/>
            </Provider>
        </MaterialUIControllerProvider>
    </BrowserRouter>
);

reportWebVitals();
