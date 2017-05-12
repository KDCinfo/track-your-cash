const myMarkP = `## App State

\`\`\`
  id,
  username,
  email,
  registry: [
    {
      id, date, description, amount, type, category, notes, reconciled
    }
  ],
\`\`\`

## Components

### App

  - Header
  - Content*
  - Footer

### Content - Login

('Get Started' page)

  - Username
  - E-mail
  - [Login] (An account will be created if e-mail does not already exist)

### Content - Registry

  Entry Date | Entry Type | Entry Description | -(Entry Amount) | [Update]

  Category   | Notes                          | Reconciled      | [Delete]

  Add Entry                                                     | [Logout]
`

export default myMarkP