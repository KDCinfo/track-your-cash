const myMarkP = `# Project Notes

This 'Project Notes' section is \`coded in Markdown\` (just wanted to see that I could). And for convenience, a copy of the project's \`README.md\` is included just below these notes as well.

## App State

\`\`\`
  loggedInId: '',
  registry: [
    {
      id, date, description, amount, type, category, notes, reconciled
    }
  ],
  currentEntry: {},
  types: [
    'Deposit',
    'Withdraw',
    'EFT',
    'Cash',
    'ATM',
    'Debit',
    'Credit'
  ],
  categorys: [
    'Income - Salary',
    'Income - Refund',
    'Expense - Dining',
    'Expense - Entertainment',
    'Expense - Groceries',
    'Expense - Health',
    'Expense - Petty Cash',
    'Expense - Travel',
  ],
  base: 0,                    // (to be used for archiving)
  visibilityFilter: SHOW_ALL, // (to be used for filtering)
  withdrawError : false,      // (to be used for overdraft warnings/notifications)
  transactionSuccess : false, // (currently unused)
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
\`\`\`
  Entry Date | Entry Description | -(Entry Amount) |  [Edit]  | [Cancel]

  Entry Type | Category  | Notes |    Reconciled   | [Delete] |  [Save]

                                 |     Add Entry
\`\`\`
`
console.log('myMarkP')

export default myMarkP