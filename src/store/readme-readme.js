const myMarkR = `# Git README.md - Track Your Cash

Track Your Cash is a project I am in the process of creating to get a better understanding of how the React ecosystem works.

## Application URLs

[Demo running on Digital Ocean](http://138.68.225.64)

[Quick mockup of checking register entry layout](http://framebox.org/ABYqI-eNFlwC)

## Work In Progress

Approximate completion percentage: 70%

### High-Level To-Dos:

  - Get checking register 'previous entries' working (15%)
  - Leftover tweaks and massaging (15%)

### High-Level Completions:

**(<=20%)**

  - High-level page/component layout and formatting (make somewhat presentable)
  - Get React Router 4 working (with Redux)
  - Get Markdown working (2 components; 1 is local-only)
  - Get project uploaded/shared on GitHub

**(<=50%)**

  - Get Login/Create account working with session- and local- Storage
  - Restrict actual check register page (if not logged in (i.e., no session storage exists))

**(<=70%)**

  - Login Page - E-mail input field auto-focused (HTML5 rocks!)
    - A life-saver when logging out and back in all the time.

  - Got register 'add entry' (new form) working.

    - All register entries prior to form submission are saved in 'session storage'.
      - Session storage entries are persisted into 'local storage' when the form is successfully submitted.
      - Session storage entries are lost on 'Logout' and when user clears local browser storage.
      - Local storage entries (all previous register entries) will be lost when user clears local browser storage.

    - Made 'Date' input field native (i.e., type="date")

      - Provided fallback for browser's that don't support the native date input field type (e.g., Firefox; as of 2017-06-05).
        - The conditional 'Date' code block is its own component (used in each register entry form, both new and previous (existing))
        - Year/Month/Day fields are recorded independently per [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)
        - Changing 'Month' and 'Year' updates the number of days accounting for leap year and individual month variations (also per the MDN docs).

    - The 'Amount' field uses native 'number' input.
      - The input type 'number' entry cannot show padded decimals (e.g., 1.00) although data is stored as: '1.00'
      - I would either:
          1) live without the decimal 0 padding, or
          2) Just use a text field and live without the number spinner
      - [A potential compromise](https://stackoverflow.com/questions/7790561/how-can-i-make-the-html5-number-field-display-trailing-zeroes) (conditionally swap input type to 'text')

    - Added form client-side validation for all fields (could likely use validation on field blurs as well, but didn't implement)

    - Added type-ahead for both 'Type' and 'Category' fields.
      - Created their own little 'delete' pop-overs (using a common component, ofc).

  - Got register 'previous entries' form laid out

## Notes and Considerations

**Using Local Storage**

  - Just FYI the maximum size of local storage is 4.75 - 5 MB (depending on browser).
  - That in mind, I believe it would behoove me to determine the storage size, and begin auto-archiving at 4-4.5 MB.
    - A check could be done after every register update, or the beginning of a new session.
    - Create a new user and append a '_backup' or some such.

--------------------------------------------------

## HISTORY / Project Updates

--------------------------------------------------

### 2017-05-27 : Sat

#### FIXED:

##### Routing
Being able to trigger a history.push from a component (RegisterContainer)
  - I was missing \`withRouter\` (which is in the [React Router -> Redux Integration documentation](https://reacttraining.com/react-router/web/guides/redux-integration) (if you happen to understand what you're reading ;) )
  - Also good reading: [github.com/ReactTraining/history](https://github.com/ReactTraining/history)
\`\`\`
// before
export default connect(mapStateToProps)(Something)

// after
import { withRouter } from 'react-router-dom'
export default withRouter(connect(mapStateToProps)(Something))
\`\`\`

#### IMPLEMENTED:

##### Pseudo-Auth Restrict / Redirect
  - I am borrowing my friend Craig's implementation via the \`componentDidMount\` component class method (Craig did an awesome little project that was configured really, really well (IMO), so I'll be borrowing a bit from his expertise).
\`\`\`
class RegisterContainer extends React.Component {
  componentDidMount() {
    if(!getStorageItem(sessionStorage, 'user')) {
      this.props.history.push('/login');
    }
  }
\`\`\`
--------------------------------------------------

### 2017-05-30 : Tue

#### IMPLEMENTED:

##### Data Structure

Determined data structure and tweaked all pertinent configs, actions, functions, and reducers.

Note: Because this is my first React project endeavor, most configs, actions, functions and reducers were borrowed from a similar project.

##### Pseudo-Authentication Working

Accounts are local to the client using windows storage.

Login/create account now works with sessionStorage (stores current user) and localStorage (all created users and their registries).

--------------------------------------------------

### 2017-06-05 : Mon

#### IMPLEMENTED:

##### Login Page

E-mail input field auto-focused (HTML5 rocks!).

##### Register 'add entry' (new form) - 50%

All register entries prior to form submission are saved in 'session storage'.

Made 'Date' input field native (i.e., type="date") with non-native fallback support per MDN recommendation.

The 'Amount' field uses native 'number' input.

--------------------------------------------------

### 2017-06-11 : Sun

#### IMPLEMENTED:

##### Login Page - E-mail input field auto-focused (HTML5 rocks!)

##### Checking Register Form - Add New Entry

###### All register entries prior to form submission are saved in 'session storage'.

###### Made 'Date' input field native (i.e., type="date")

Provided fallback for browser's that don't support the native date input field type

###### The 'Amount' field uses native 'number' input.

###### Added form client-side validation for all fields (could likely use validation on field blurs as well, but didn't implement)

###### Added type-ahead for both 'Type' and 'Category' fields.

##### Got register 'previous entries' form laid out

--------------------------------------------------

  - @TODO - Edit previous (existing) entries (can edit/update one previous entry at a time)

    - Set 'disabled' to false for active existing entry
    - 'Edit' button replaced with 'Update' button.
    - 'delete' button replaced with 'Cancel' button.

  - @TODO - Add link for how to clear local storage
`

export default myMarkR