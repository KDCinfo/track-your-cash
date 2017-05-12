console.clear() // 'console' object references are removed for prod builds

import React from 'react'
import { render } from 'react-dom'

import { createStore } from 'redux'
import { Provider } from 'react-redux'

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
import initialState from './store/initial-state'

let store = createStore(reducers, initialState)

// // // // // // // // // //
// [ContentFrame.js]
//
import ContentFrame from './components/ContentFrame'

const { isLoggedIn } = store.getState()

    // // // // // // // // // //
    // [Home.js]
    //
    import Home from './components/Home'
    const HomeContainer = () => <ContentFrame isLoggedIn={isLoggedIn}><Home /></ContentFrame>

    // // // // // // // // // //
    // [About.js]
    //
    import About from './components/About'
    const AboutContainer = () => <ContentFrame isLoggedIn={isLoggedIn}><About /></ContentFrame>

    // // // // // // // // // //
    // [Login.js]
    //
    import Login from './components/Login'
    const LoginContainer = () => <ContentFrame isLoggedIn={isLoggedIn}><Login /></ContentFrame>

    // // // // // // // // // //
    // [Register.js]
    //
    import Register from './components/Register'
    const RegisterContainer = () => <ContentFrame isLoggedIn={isLoggedIn}><Register /></ContentFrame>

    // // // // // // // // // //
    // [ProjectNotes.js]
    //
    import ProjectNotes from './components/ProjectNotes'
    const ProjectNotesContainer = () => <ContentFrame isLoggedIn={isLoggedIn}><ProjectNotes /></ContentFrame>

    // // // // // // // // // //
    // [Markdown.js]
    //
    import Markdown from './components/Markdown.js'
    import myMarkR from './store/readme-cra.js'
    const CRA = () => <Markdown myMark={myMarkR} />
    const CRAContainer = () => <ContentFrame isLoggedIn={isLoggedIn}><CRA /></ContentFrame>

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