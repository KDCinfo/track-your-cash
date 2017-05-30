# track-your-cash
Track Your Cash is a project I am in the process of creating to get a better understanding of how the React ecosystem works.

## Work In Progress

Approximate completion percentage: 50%

### High-Level To-Dos:

  - Get the actual check registry page working (30%)
  - Leftover tweaks and massaging (15%)
  - Clean up CSS (5%)

### High-Level Completions:

*(20%)*

  - High-level page/component layout and formatting (make somewhat presentable)
  - Get React Router 4 working (with Redux)
  - Get Markdown working (2 components; 1 is local-only)
  - Get project uploaded/shared on GitHub

*(30% += 50%)*

  - Get Login/Create account working with session- and local- Storage
  - Restrict actual check registry page

## Notes and Considerations

  _Using Local Storage_
  - Just FYI the minimum size of local storage is 4.75 - 5 MB.
  - That in mind, I believe it would behoove me to determine the storage size, and begin auto-archiving at 4.5 MB.
    - A check could be done after every registry update, or the beginning of a new session.
    - Create a new user and append a '_backup' or some such.

## HISTORY / Project Updates

### 2017-05-30 : Mon

#### IMPLEMENTED:

##### Data Structure

Determined data structure and tweaked all pertinent configs, actions, functions, and reducers.

Note: Because this is my first React project endeavor, most configs, actions, functions and reducers were borrowed from a similar project.

##### Pseudo-Authentication Working

Accounts are local to the client using windows storage.

Login/create account now works with sessionStorage (stores current user) and localStorage (all created users and their registries).

### 2017-05-27 : Sat

#### FIXED:

##### Routing
Being able to trigger a history.push from a component (RegisterContainer)
  - I was missing `withRouter` (which is in the [React Router -> Redux Integration documentation](https://reacttraining.com/react-router/web/guides/redux-integration) (if you happen to understand what you're reading ;) )
  - Also good reading: [github.com/ReactTraining/history](https://github.com/ReactTraining/history)
```
// before
export default connect(mapStateToProps)(Something)

// after
import { withRouter } from 'react-router-dom'
export default withRouter(connect(mapStateToProps)(Something))
```

#### IMPLEMENTED:

##### Pseudo-Auth Restrict / Redirect
  - I am borrowing my friend Craig's implementation via the `componentDidMount` component class method (Craig did an awesome little project that was configured really, really well (IMO), so I'll be borrowing a bit from his expertise).
```
class RegisterContainer extends React.Component {
  componentDidMount() {
    if(!getStorageItem(sessionStorage, 'user')) {
      this.props.history.push('/login');
    }
  }
```
