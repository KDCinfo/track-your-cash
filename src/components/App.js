//
//
// Moved all this into [index.js]
//
//

import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

// import logo from './logo.svg'
import './App.css'

import { addTodo, toggleTodo, setVisibilityFilter, VisibilityFilters } from './actions'

class Home extends React.Component {
  render() {
    return (
      <div>
        Link <Link to="/about">About</Link>
        {console.log(store.getState())}
      </div>
    )
  }
}
class About extends React.Component {
  render() { return ( <div>About</div> ) }
}
class Topics extends React.Component {
  render() { return ( <div>Topics</div> ) }
}

  // import { syncHistoryWithStore } from 'react-router-redux'
  // import browserHistory from 'history/createBrowserHistory'

  // const appbrowserHistory = browserHistory(),
        // store = createStore(rootReducer, defaultState = [])
  // const history = syncHistoryWithStore(appbrowserHistory, store)
  // // export default store

// import { createStore } from 'redux'
// import reducers from './reducers'
// const defaultState = {router}
// let store = createStore(reducers, defaultState)

// console.log(store)

import createBrowserHistory from 'history/createBrowserHistory'
const customHistory = createBrowserHistory()

const App = ({ store }) => (
  <Provider store={store}>
    <Router history={customHistory}>
      <div>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/topics" component={Topics} />
      </div>
    </Router>
  </Provider>
)

App.propTypes = {
  store: PropTypes.object.isRequired,
}

export default App
