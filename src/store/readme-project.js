const myMarkP = `# Project Notes

This entire notes section is \`coded in Markdown\` for a little easier prettification (as opposed to formatting it with full HTML tagging).

## App State

\`\`\`
  loggedInId: '',
  base: 0,
  registry: [
    {
      id, date, description, amount, type, category, notes, reconciled
    }
  ],
  visibilityFilter: SHOW_ALL,
  withdrawError : false,
  transactionSuccess : false,
\`\`\`

## Components

### App

  - Header
  - Content*
  - Footer

### Content - Login

('Get Started' page)

  - E-mail
  - [Login] (An account will be created if e-mail does not already exist)

### Content - Registry

  Entry Date | Entry Type | Entry Description | -(Entry Amount) | [Update]

  Category   | Notes                          | Reconciled      | [Delete]

  Add Entry                                                     | [Logout]
`

export default myMarkP