import { getStorageItem, getObjectFromStorage, setStorageItem, deleteStorageItem } from './functions'
import { VisibilityFilters } from './actions'

const { SHOW_ALL } = VisibilityFilters

const initialState = {
    loggedInId: '',
    base: 0,
    registry: [],
    visibilityFilter: SHOW_ALL,
    withdrawError : false,
    transactionSuccess : false,
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

export const getLoadedEntry = () => {
    const userObjStor = getStorageItem(sessionStorage, 'user'),
          entryObjStor = getStorageItem(sessionStorage, 'entry')

    let entryObj

    if(!entryObjStor) {
        entryObj = currentEntry
        if(userObjStor) {
            setStorageItem(sessionStorage, 'entry', JSON.stringify(entryObj));
        }
    } else {
        entryObj = JSON.parse(entryObjStor)
    }
    return entryObj
}

export const getLoadedEntryExisting = () => {
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

export const getLoadedState = () => {
    let loadedState = {},
        userId = getStorageItem(sessionStorage, 'user')

    if(userId) {
        let getLocalUserStorage = getObjectFromStorage(localStorage, userId)

        if(getLocalUserStorage) {
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
            -> Remove sessionStorage 'entry'
            -> Run getLoadedEntry()

        Existing Form: Update Fields
            -> [Edit] button
                -> Add selected existing register entry to state.existingEntry
                ...These should happen automatically when state.existingEntry is populated
                    -> Show [Update] buttton + [Cancel] button (hide [Delete] button)
                    -> Enable selected existing register entry

        Update Register
            -> Get current Register ID (Key: entry.Id)
            -> Copy state.existingEntry to replace existing state.registry[]
            -> Clear state.existingEntry

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
        // The live register base will be the totality of the archived registries

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