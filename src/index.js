console.clear() // 'console' object references are removed for prod builds

import React from 'react'
import { render } from 'react-dom'

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk';

import {localStorageMiddleWare} from './store/functions';

import { Router, Route, Switch } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'
const customHistory = createBrowserHistory()

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
import initialState, { getLoadedState } from './store/initial-state'
const initialStateLoad = {...initialState, ...getLoadedState()}

// // // // // // // // // //
// middleware
//
let middleware = [thunkMiddleware, localStorageMiddleWare];
if(process.env.NODE_ENV !== 'production') {
    let logger = require('redux-logger');
    const loggerMiddleware = logger.createLogger();
    middleware = [...middleware, loggerMiddleware];
}

let store = createStore(reducers, initialStateLoad, applyMiddleware(...middleware))

// // // // // // // // // //
// [ContentFrame.js]
//
import ContentFrame from './components/ContentFrame'

    // // // // // // // // // //
    // [Home.js]
    //
    import Home from './components/Home'
    const HomeContainer = () => <ContentFrame><Home /></ContentFrame>

    // // // // // // // // // //
    // [About.js]
    //
    import About from './components/About'
    const AboutContainer = () => <ContentFrame><About /></ContentFrame>

    // // // // // // // // // //
    // [Login.js]
    //
    import Login from './components/Login'
    const inputMessage = 'E-mail (required)'
    const LoginContainer = () => <ContentFrame><Login inputMessage={inputMessage} /></ContentFrame>

    // // // // // // // // // //
    // [Register.js]
    //
    import Register from './components/Register'
    const RegisterContainer = () => <ContentFrame><Register /></ContentFrame>

    // // // // // // // // // //
    // [ProjectNotes.js]
    //
    import ProjectNotes from './components/ProjectNotes'
    const ProjectNotesContainer = () => <ContentFrame><ProjectNotes /></ContentFrame>

    // // // // // // // // // //
    // [Markdown.js]
    //
    import Markdown from './components/Markdown.js'
    import myMarkR from './store/readme-cra.js'
    const CRA = () => <Markdown myMark={myMarkR} />
    const CRAContainer = () => <ContentFrame><CRA /></ContentFrame>

const App = ({ store }) => (
    <Provider store={store}>
        <Router history={customHistory}>
            <Switch>
                <Route path="/" exact component={HomeContainer} />
                <Route path="/login" component={LoginContainer} />
                <Route path="/register" component={RegisterContainer} />
                <Route path="/about" component={AboutContainer} />
                <Route path="/readme" component={ProjectNotesContainer} />
                <Route path="/cra" component={CRAContainer} />
            </Switch>
        </Router>
    </Provider>
)

render(
    <App store={store} />,
    root
)