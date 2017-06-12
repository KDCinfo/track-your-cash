import * as ACTIONS from './actions'
// import {getLastTransaction} from './functions'
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
/*
  const buildTransactionObject = (type, amount, description, date) => {
      const amt = amount
      const newBalance = amt
      return {
          date: date,
          description: description,
          amount: amt,
          balance: newBalance
      }
  }
  const getNewStateAfterTransaction = (date, entry, entries) => {
      const newEntries = {...entries, [date]: entry}
      const obj = {transactionEntries: newEntries, transactionSuccess: true, pageIndex: 1}
      return {...clearFormObject(), ...obj}
  }
*/

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

//           const oldStateArray = state[action.key]
// console.log('[reducers 5a]', oldStateArray)

//           let newStateArray;
//                 oldStateArray.push(action.value)
//                 newStateArray = oldStateArray


          const oldStateArray = state[action.key],
                newRegistryEntry = action.value
console.log('[NEW - oldStateArray 0]', typeof(oldStateArray), Object.prototype.toString.call( oldStateArray ), oldStateArray)
          let newStateArray;
                newStateArray = oldStateArray.concat([newRegistryEntry])

                // obj = {[action.key]: newState}
console.log('[reducers 1]', typeof(action.key), action.key)   // string, registry
console.log('[reducers 2]', action.value) // JSON parsed object
console.log('[reducers 3a]', state[action.key])
console.log('[reducers 3b]', newStateArray)     // [Object, Object]
// console.log('[reducers 4]', obj)
          // JSON.stringify({...oldState, registry: newRegistry })
          return {...state, [action.key]: newStateArray}
          // return {...state}
        }
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
