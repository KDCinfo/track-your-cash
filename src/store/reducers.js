import * as ACTIONS from './actions'

import initialState, { getLoadedEntry } from './initial-state'

const clearFormObject = () => {
    return {
        withdrawError: false,
        transactionSuccess: false,
        currentEntry: getLoadedEntry()
    }
}
const clearFormExistObject = () => {
    return {
        withdrawError: false,
        transactionSuccess: false,
        existingEntry: {}
    }
}

const registerReducer = (state = {}, action) => {
    switch (action.type) {
        case ACTIONS.CLEAR_FORM:
          return {...state, ...clearFormObject()}
        case ACTIONS.CLEAR_FORM_EXIST:
          return {...state, ...clearFormExistObject()}
        case ACTIONS.INPUT_TYPING: {
          const obj = {[action.key]: action.value}
          return {...state, ...obj}
        }
        case ACTIONS.UPDATE_STATE_FIELD: {
          const obj = {[action.key]: action.value}
          return {...state, ...obj}
        }
        case ACTIONS.ADD_TO_STATE_ARRAY: {
          const oldStateArray = state[action.key],
                newRegistryEntry = action.value,
                newStateArray = oldStateArray.concat([newRegistryEntry])

          return {...state, [action.key]: newStateArray}
        }
        case ACTIONS.REMOVE_FROM_STATE_ARRAY: {
          const oldStateArray = state['registry'],
                entryId = action.previousEntry,
                newStateArray = oldStateArray.filter( ( entry ) => entry.id !== entryId )
          return {...state, registry: newStateArray}
        }
        case ACTIONS.UPDATE_REGISTRY_ENTRY:
          const newRegistry = state.registry.map((entry, index) => {
            if (entry.id === action.updatedEntry.id) {
              return Object.assign({}, entry, action.updatedEntry)
            }
            return entry
          })
          return {...state, registry: newRegistry}
        case ACTIONS.INPUT_TYPING_REG: {
          const registryObj = [],
            obj = {withdrawError: false, transactionSuccess: false, registry: registryObj.concat( { [action.key]: action.value } ) }
          return {...state, ...obj}
        }
        case ACTIONS.LOGIN_NEW: {
          const newState = {...initialState, loggedInId: action.email}
          return {...state, ...newState}
        }
        case ACTIONS.LOGIN_EXISTING: {
          // loggedInId: action.payload
          const newState = {...action.loadedState, loggedInId: action.email}
          return {...state, ...newState}
        }
        case ACTIONS.LOGOUT:
          return {...state, ...initialState}
        case ACTIONS.INVALID_TRANSACTION:
          return {...state, withdrawError: true}
        case ACTIONS.SUBMIT_TRANSACTION: {
          // const entry = buildTransactionObject(action.whichType, action.amount, action.description, action.date, state);
          // const newState = getNewStateAfterTransaction(state.transactionList, action.date, entry, state.transactionEntries)
          // return {...state, ...newState}
          return {...state}
        }
        case ACTIONS.ADD_TODO:
          return [
            ...state,
            {
              id: state.length,
              date: new Date(),
              description: action.description,
              amount: action.amount,
              type: action.type,
              category: action.category,
              notes: action.notes,
              reconciled: false
            }
          ]
        case ACTIONS.TOGGLE_TODO:
          return state.map((todo, index) => {
            if (index === action.index) {
              return Object.assign({}, todo, {
                reconciled: !todo.reconciled
              })
            }
            return todo
          })
        default:
          return state
    }
}

export default registerReducer
