import React from 'react'
import { render } from 'react-dom'

import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk';

import {localStorageMiddleWare} from './store/functions';

import { Router, Route, Switch } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'

// // // // // // // // // //
// [reducers.js]
//
import reducers from './store/reducers'

// // // // // // // // // //
// [index.css]
//
import './index.css'

// // // // // // // // // //
// [initial-state.js]
//
import initialState, { getLoadedState, getLoadedEntry } from './store/initial-state'

import ContentFrame from './components/ContentFrame'
import Home from './components/Home'
import About from './components/About'
import Login from './components/Login'
import RegisterRoot from './components/RegisterRoot'
import ProjectNotes from './components/ProjectNotes'
import Markdown from './components/Markdown.js'
import myMarkR from './store/readme-cra.js'

    const initialStateLoad = {...initialState, ...getLoadedState(), currentEntry: getLoadedEntry()}
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    // compose: Config for Chrome [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension#usage)

    const customHistory = createBrowserHistory()

// // // // // // // // // //
// middleware
//
let middleware = [thunkMiddleware, localStorageMiddleWare];
if(process.env.NODE_ENV !== 'production') {
    let logger = require('redux-logger');
    const loggerMiddleware = logger.createLogger();
    middleware = [...middleware, loggerMiddleware];
}

let store = createStore(reducers, initialStateLoad, composeEnhancers(
    applyMiddleware(...middleware)
))

if(process.env.NODE_ENV !== 'production') {
    console.clear() // 'console' object references are removed in prod builds
}

// // // // // // // // // //
// [ContentFrame.js]
//

    // // // // // // // // // //
    // [Home.js]
    //
    const HomeContainer = () => <ContentFrame><Home /></ContentFrame>

    // // // // // // // // // //
    // [About.js]
    //
    const AboutContainer = () => <ContentFrame><About /></ContentFrame>

    // // // // // // // // // //
    // [Login.js]
    //
    const inputMessage = 'E-mail (required)'
    const LoginContainer = () => <ContentFrame><Login inputMessage={inputMessage} /></ContentFrame>

    // // // // // // // // // //
    // [RegisterRoot.js]
    //
    const RegisterRootContainer = () => <ContentFrame><RegisterRoot /></ContentFrame>

    // // // // // // // // // //
    // [ProjectNotes.js]
    //
    const ProjectNotesContainer = () => <ContentFrame><ProjectNotes /></ContentFrame>

    // // // // // // // // // //
    // [Markdown.js]
    //
    const CRA = () => <Markdown myMark={myMarkR} />
    const CRAContainer = () => <ContentFrame><CRA /></ContentFrame>

const App = ({ store }) => (
    <Provider store={store}>
        <Router history={customHistory}>
            <Switch>
                <Route path="/" exact component={HomeContainer} />
                <Route path="/login" component={LoginContainer} />
                <Route path="/register" component={RegisterRootContainer} />
                <Route path="/readme" component={ProjectNotesContainer} />
                <Route path="/cra" component={CRAContainer} />
                <Route path="/about" component={AboutContainer} />
            </Switch>
        </Router>
    </Provider>
)

render(
    <App store={store} />,
    root
)