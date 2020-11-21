// import React, { Fragment } from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { createGlobalStyle } from 'styled-components';

// import store from './store';
// import App from './components/App';
// import reset from './constants/css/reset';

// const GlobalStyle = createGlobalStyle`${reset}`;

// ReactDOM.render(
//     <BrowserRouter>
//         <Fragment>
//             <Provider store={store}>
//                 <App />
//             </Provider>
//             <GlobalStyle />
//         </Fragment>
//     </BrowserRouter>,
//     document.getElementById('root')
// );
import React from 'react';
import Reactdom from 'react-dom';
import App from './app.jsx';

Reactdom.render(<App/>, document.getElementById("app"))

