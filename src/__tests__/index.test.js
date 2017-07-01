/*
    I have very little knowledge of testing,
    and have no idea if including everything as I have below
    is correct or not (as it's done in the main [index.js] file).

    Unsure how routing is tested; if perhaps routes are entered manually,
    or if there'd be a suite of imports covering each route from separate test files.

    But... the below passed the 2 core tests:
        // Do snapshots align and measure up?
        // Plain and simple --> Does it load?
*/
import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'

import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk';

import { Router, Route, Switch } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'

import { localStorageMiddleWare } from '../store/functions';

import reducers from '../store/reducers'

import initialState from '../store/initial-state'

import ContentFrame from '../components/ContentFrame'
import Login from '../components/Login'

    const inputMessage = 'E-mail (required)'
    const LoginContainer = () => <ContentFrame><Login inputMessage={inputMessage} /></ContentFrame>

    const initialStateLoad = () => initialState
    const customHistory = createBrowserHistory()

let middleware = [thunkMiddleware, localStorageMiddleWare];

    if(process.env.NODE_ENV !== 'production') {
        let logger = require('redux-logger');
        const loggerMiddleware = logger.createLogger();
        middleware = [...middleware, loggerMiddleware];
    }

let store = createStore(reducers, initialStateLoad(
    applyMiddleware(...middleware)
))

const App = ({ store }) => (
    <Provider store={store}>
        <Router history={customHistory}>
            <Route path="/" component={LoginContainer} />
        </Router>
    </Provider>
)

// The tests included below, although they do pass, are incomplete
// and meant only to serve as a base for testing (PRs are welcome)

    // Tests Include:
    // Jest Snapshots
    // Does it Crash?

// This article is a good resource for component testing
// https://www.sitepoint.com/test-react-components-jest/

// [describe] Optional - For logical grouping

// Can wrap Tests in either [test] or [it]

describe('LoginContainer:', () => {

    test('Jest Snapshot', () => {
        const component = renderer.create(
            <App store={store} />
        )
        let tree = component.toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('renders without crashing', () => {
        const div = document.createElement('div')
        ReactDOM.render(<App store={store} />, div)
    })
})