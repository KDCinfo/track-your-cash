# Track Your Cash

Track Your Cash is a project I created to get a better understanding of how the React ecosystem works.

## Application URLs

[Demo running on Digital Ocean](http://138.68.225.64)

[Quick mockup of checking register entry layout](http://framebox.org/ABYqI-eNFlwC)

## Tech Stack

Working on this project provided me a more in-depth look into
  - React (15.5.4)
  - React-Router 4
  - Redux state management
  - Local component state
  - Props and HOCs/HOFs
  - Client-side localStorage
  - Client-side sessionStorage

My API endpoint of personal choice is still Laravel (PHP), but I did everyting with client-side local storage on this project.
(My professional choice is whatever the Back-End Engineers are comfortable and good with -- Front-End should have (little to) no dependence on a back-end tech stack.)

## Project Progress

Completion percentage: 100%

### High-Level To-Dos:

  -

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

**(<=85%)**
  - Got checking register 'previous entries' working
    - Added 'Delete' for previous entries
    - Added 'Update' for previous entries (can edit/update one previous entry at a time)
      - Set 'disabled' to false for active existing entry
      - 'Edit' button replaced with 'Update' button.
      - 'Delete' button replaced with 'Cancel' button.

**(<=90%)**
  - Added 'Filtering' and 'Sorting'
  - Cleared 'New Entry' form after adding to registry
  - Added a little CSS splash

**(100%)**
  - Added GitHub link in footer
  - Formatted navigation menu buttons
  - Added "TOTAL" based on calculation of all previous entries
  - Added "Cleared" showing only reconciled
  - Added button to delete account (delete everything and logout)
  - Added button to export account details
  - Multiple browser sanity testing

**(110%)**
  - Did some polishing:
    - Added custom font to 'Home' page.
    - Added background-image to all pages:
      - The image is a little stronger on the 'Home' page.
      - The other pages are dimmed so as not to be too distracting.
    - Customized top navigational menu buttons and footer link.

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

  - Disabled all 'previous entry' inputs
  - Set disabled CSS with no input borders

--------------------------------------------------

### 2017-06-14 : Wed

#### QA:

Checked for adding quotes, apostrophes, and <script> tags

#### IMPLEMENTED:

Checking register 'previous entries' can now be updated and deleted.

--------------------------------------------------

### 2017-06-15 : Thu

#### IMPLEMENTED:

##### Filtering

Filtering will yield all entries found in any of the input fields, and is case-insensitive.

##### Sorting

The sorting flyout panel provides the option to select a sort field and a sort direction. The panel will close on a 2nd click to the 'Sort Options' button, or by pressing the Escape key.

##### Starting Clean

When adding a new entry, all fields will clear except the date.

#### CSS Tweaks

Added a little color and contrast to the register panels.

--------------------------------------------------

### 2017-06-16 : Fri

#### IMPLEMENTED:

##### Show Total - "All"

  - Based on calculation of all previous entries.

##### Show Total - "Cleared"

  - Show total of all reconciled entries.

##### Show Total - "Filtered"

  - Show total of entries matching the filter box.

##### "Export Account"

  - Saves stored account data to a local JSON file.

##### "Delete Account"

  - Delete everything and logout

##### "Sanity Testing"

  - I ran manual checks in the following browsers:

    - Chrome [Version 59.0.3071.104 (Official Build) (64-bit)]
    - Firefox [53.0.3 (32-bit)]
    - Microsoft Edge [40.15063.0.0]
    - Opera [45.0.2552.898 (PGO)]

#### Archive

In completing this project, the following notes were removed from the Home page:

```
  <div>
      <p>High-Level Completions:</p>
      <ul>
          <li>High-level page/component layout and formatting (make somewhat presentable)</li>
          <li>Got React Router 4 working (with Redux)</li>
          <li>Got Markdown working (3 components; 1 is local-only)</li>
          <li>Got project uploaded/shared on GitHub</li>
          <li>Got project uploaded/working on Digital Ocean</li>
          <li className="li-bold">(20%)</li>

          <li>Got Login/Create account working with session- and local- Storage</li>
          <li>Restrict actual check registry page</li>
          <li className="li-bold">(30% += 50%)</li>

          <li>Registry 'add new' entry (with client-side validation)</li>
          <li className="li-bold">(20% += 70%)</li>

          <li>Registry 'previous entries' update and delete</li>
          <li className="li-bold">(15% += 85%)</li>

          <li>Added sorting and filtering (and a splash of color)</li>
          <li className="li-bold">(5% += 90%)</li>

          <li>Added total, cleared total, and filtered total to top and bottom of page.</li>
          <li>Added 'Delete Account' functionality.</li>
          <li>Added 'Export' functionality.</li>
          <li className="li-bold">(10% += 100%)</li>
      </ul>
  </div>
```

--------------------------------------------------

### 2017-06-17 : Sat

#### Formatting

  - Prettied up 'Home' page.
  - Added a background-image to all the pages.
  - Customized the top navigational menu buttons and footer link.
