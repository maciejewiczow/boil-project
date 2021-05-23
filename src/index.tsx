import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import { Slide, ToastContainer } from 'react-toastify';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const GlobalStyles = createGlobalStyle`
    *, *::after, *::before {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        font-family: 'Roboto', sans-serif;
    }
`;

ReactDOM.render(
    <React.StrictMode>
        <GlobalStyles />
        <App />
        <ToastContainer
            position="bottom-center"
            autoClose={4000}
            limit={5}
            rtl={false}
            transition={Slide}
            style={{ width: '40vw' }}
            hideProgressBar
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    </React.StrictMode>,
    document.getElementById('root'),
);
