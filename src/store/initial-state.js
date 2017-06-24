import { getStorageItem, getObjectFromStorage, setStorageItem, deleteStorageItem } from './functions'

const initialState = {
    loggedInId: '',
    base: 0,
    registry: [],
    currentEntry: {},
    types: ['Deposit', 'Withdraw', 'EFT', 'Cash', 'ATM', 'Debit', 'Credit'],
    categorys: [
        'Income - Salary',
        'Income - Refund',
        'Expense - Dining',
        'Expense - Entertainment',
        'Expense - Groceries',
        'Expense - Health',
        'Expense - Petty Cash',
        'Expense - Travel',
    ]
}

const newDate = new Date()

const currentEntry = {
    "id": 0,
    "date": (newDate.getFullYear()) + ('0' + (newDate.getMonth()+1)).slice(-2) + ('0' + newDate.getDate()).slice(-2),
    "description": "",
    "amount": "0",
    "type": "",
    "category": "",
    "notes": "",
    "reconciled": false
}

export const newCurrentEntry = {
    "description": "",
    "amount": "0",
    "type": "",
    "category": "",
    "notes": "",
    "reconciled": false
}

// INITIAL LOAD ORDER

// const initialStateLoad = {...initialState, ...getLoadedState(), currentEntry: getLoadedEntry()}

export const getLoadedState = () => {
    let loadedState = {},
        userId = getStorageItem(sessionStorage, 'user')

    if(userId) {
        let getLocalUserStorage = getObjectFromStorage(localStorage, userId)

        if (getLocalUserStorage) {
            loadedState.loggedInId = userId
            loadedState.registry = getLocalUserStorage.registry
        } else {
            // Session 'user' exists, but no localStorage 'user' found
            // Likely a problem when creating localStorage: Start over
            loadedState.loggedInId = ''
            deleteStorageItem(sessionStorage, 'user')
            deleteStorageItem(sessionStorage, 'entry')
            deleteStorageItem(sessionStorage, 'entryExist')
        }
    }
    return {...initialState, ...loadedState}
}

export const getLoadedEntry = () => {
    const userObjStor = getStorageItem(sessionStorage, 'user'),
          entryObjStor = getStorageItem(sessionStorage, 'entry')

    let entryObj

    if(!entryObjStor) {                             // If no session entry, create it
        entryObj = currentEntry                     // create it using [currentEntry] (set above)
        if(userObjStor) {                           // but only if there is an active user
            setStorageItem(sessionStorage, 'entry', JSON.stringify(entryObj));
        }                                           // else just return an initialized (empty) entry object
    } else {
        entryObj = JSON.parse(entryObjStor)         // If session entry exists, return it for initializing state
    }
    return entryObj
}

export const getLoadedEntryExisting = () => {       // I'm unsure I'm using this (yet)
    const userObjStor = getStorageItem(sessionStorage, 'user'),
          entryObjStor = getStorageItem(sessionStorage, 'entryExist')

    let entryObj

    if(!entryObjStor) {
        entryObj = currentEntry
        if(userObjStor) {
            setStorageItem(sessionStorage, 'entryExist', JSON.stringify(entryObj));
        }
    } else {
        entryObj = JSON.parse(entryObjStor)
    }
    return entryObj
}

export default initialState
/*
    [index.js]
        Initial Load
            -> Set State: initialStateLoad = {
                ...initialState,
                ...getLoadedState(),
                currentEntry: getLoadedEntry() }

    [Login.js]                      -> handleSubmit()
        -> Run getLoadedEntry()

    [Register.js]
        Initial Load
            -> Run getLoadedEntry()
            -> mapStateToProps      -> state.currentEntry

    [RegisterEntryFilled.js]
        Add Form: Update Fields     -> handleChangeAmount() -> handleStorageSet()
            -> setStorageItem(sessionStorage, 'entry', JSON.stringify(entryObjNew))
            -> this.props.actions.inputTyping('currentEntry', entryObjNew)

        Add to Register
            -> Update (increment) Register ID (currentEntry.Id)
            -> Copy currentEntry    -> state.registry[]
            -> Clear sessionStorage 'entry'
            -> Run getLoadedEntry()

        Existing Form: Update Fields
            -> [Edit] button
                -> Add selected existing register entry to sessionStorage['existingEntry']
                ...These should happen automatically when 'existingEntry' is populated
                    -> Show [Save] buttton + [Cancel] button (hide [Delete] button)
                    -> Enable selected existing register entry

        Update Register
            -> Get current Register ID (Key: entry.Id)
            -> Copy 'existingEntry' to replace existing state.registry[]
            -> Clear sessionStorage['existingEntry']

    [ContentFrame.js]
        Logout Nav Link             -> handleClickLogout()
            -> Set State: initialState = { loggedInId: '', registry: [], currentEntry: {} }
            -> Remove sessionStorage 'user'
            -> Remove sessionStorage 'entry'

    -> getLoadedEntry = () =>
        -> Check for storage
            None
                FUNCTION
                    -> Add currentEntry initial object to storage
                REDUCER
                    -> Add currentEntry initial object to state
            Exists
                REDUCER
                    -> Add/Overwite state with storage {...state, ...storageEntry}

    [loggedInId: '']
    [registry: [ {}, {}, {} ]]
    [base: 0]

    // 'Base' is to allow for future archiving
        // The live register base (starting total) will be the totality of the archived registries

    registry: [
        {   "id" : 0,
            "date": "",
            "description": "",
            "amount": 0,
            "type": "",
            "category": "",
            "notes": "",
            "reconciled": false
        }
    ]
    registry: [
        {   "id" : 0,
            "date": 'Today',
            "description": "First",
            "amount": 1.25,
            "type": "Deposit",
            "category": "Household",
            "notes": "Initializing an entry",
            "reconciled": false
        }
    ]
*/