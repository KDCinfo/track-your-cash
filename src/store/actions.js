import {actionCreator, getLastTransaction, getObjectFromStorage} from './functions'

/*
 * action types
 */
export const ADD_TODO = 'ADD_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

export const CLEAR_FORM = 'CLEAR_FORM'
export const CLEAR_FORM_EXIST = 'CLEAR_FORM_EXIST'
export const INPUT_TYPING = 'INPUT_TYPING'
export const UPDATE_STATE_FIELD = 'UPDATE_STATE_FIELD'
export const ADD_TO_STATE_ARRAY = 'ADD_TO_STATE_ARRAY'
export const REMOVE_FROM_STATE_ARRAY = 'REMOVE_FROM_STATE_ARRAY'
export const UPDATE_REGISTRY_ENTRY = 'UPDATE_REGISTRY_ENTRY'
export const LOGIN_NEW = 'LOGIN_NEW'
export const LOGIN_EXISTING = 'LOGIN_EXISTING'
export const SUBMIT_TRANSACTION = 'SUBMIT_TRANSACTION'
export const INVALID_TRANSACTION = 'INVALID_TRANSACTION'
export const LOGOUT = 'LOGOUT'

/*
 * other constants
 */

export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
}

export const clearForm = actionCreator(CLEAR_FORM)
export const clearFormExist = actionCreator(CLEAR_FORM_EXIST)
export const inputTyping = actionCreator(INPUT_TYPING, 'key', 'value')
export const updateStateField = actionCreator(UPDATE_STATE_FIELD, 'key', 'value')
export const addToStateArray = actionCreator(ADD_TO_STATE_ARRAY, 'key', 'value')
export const removeFromStateArray = actionCreator(REMOVE_FROM_STATE_ARRAY, 'previousEntry')
export const updateRegistryEntry = actionCreator(UPDATE_REGISTRY_ENTRY, 'updatedEntry')
const logout = actionCreator(LOGOUT)
const loginNew = actionCreator(LOGIN_NEW, 'email')
const loginExisting = actionCreator(LOGIN_EXISTING, 'email', 'loadedState')
const invalidTransaction = actionCreator(INVALID_TRANSACTION)
const submitTransactionValid = actionCreator(SUBMIT_TRANSACTION, 'whichType', 'amount', 'description', 'date')

/*
 * action creators
 */

export function addTodo(text) {
    return { type: ADD_TODO, text }
}

export function toggleTodo(index) {
    return { type: TOGGLE_TODO, index }
}

export function setVisibilityFilter(filter) {
    return { type: SET_VISIBILITY_FILTER, filter }
}

export const logoutUser = (LOGOUT) => {
    console.log('logging out...')
    return dispatch => {
        dispatch(logout())
    }
}

export const login = email => {
    return dispatch => {
        let item = getObjectFromStorage(localStorage, email)
        if(item){
            dispatch(loginExisting(email, item))
        } else {
            dispatch(loginNew(email))
        }
    }
}

export const submitTransaction = (whichType, amount, description, date) => {
    return (dispatch, getState) => {
        let lastTransaction = getLastTransaction(getState().transactionList, getState().transactionEntries)
        let balance = lastTransaction ? lastTransaction.balance : 0
        if(balance < amount) {
            dispatch(invalidTransaction())
        } else {
            dispatch(submitTransactionValid(whichType, amount, description, date))
        }
    }
}
