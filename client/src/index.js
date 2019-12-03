import React from 'react';
import { render } from 'react-dom'
import './index.css';
import "typeface-roboto";
import App from './App';
import * as serviceWorker from './serviceWorker';


import { ThemeProvider } from 'react-jss';

// const styles = theme => ({
//     root: {
//         height: '100%',
//         minHeight: '100%'
//     }

// })

const theme = {
    colorPrimary: 'blue',
    colorActive: 'red',
    customColor: 'white'
};


const renderApp = () =>
    render(
        <ThemeProvider theme={theme}>
            <App theme={theme} />
        </ThemeProvider>,
        document.getElementById('root')
    )

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./App', renderApp)
}

renderApp()
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
