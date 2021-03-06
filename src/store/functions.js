import { LOGIN_NEW, SUBMIT_TRANSACTION } from '../store/actions'

export function actionCreator(type, ...argNames) {
    return function(...args) {
        let action = {
            type
        }
        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index]
        })
        return action
    }
}

export const formatCurrency = amount => {
    let amt = amount
    let formatted = ''
    if(amt < 0) {
        formatted += '-'
        amt *= -1
    }
    formatted += '$'
    formatted += amt.toFixed(2)
    return formatted
}

export const formatFixed2 = amount => {
    let amt = parseFloat(amount)
    let formatted = amt.toFixed(2)
    return formatted
}

export const getLastTransactionId = tArr => {
    return tArr[0]
}

export const getLastTransaction = (tArr, transactions) => {
    const lastId = getLastTransactionId(tArr)
    return transactions[lastId]
}

/*
    Storage (local; client-side [window])
    https://developer.mozilla.org/en-US/docs/Web/API/Storage
*/

export const setStorageItem = (storage, key, value) => {
    try {
        storage.setItem(key, value)
    } catch(e) {
        console.error(e)
    }
}

export const getStorageItem = (storage, key) => {
    try {
        return storage.getItem(key)
    } catch(e) {
        console.error(e)
        return null
    }
}

export const getObjectFromStorage = (storage, key) => {
    let sItem = getStorageItem(storage, key)
    if(sItem !== undefined) {
        sItem = JSON.parse(sItem)
    }
    return sItem
}

export const deleteStorageItem = (storage, key) => {
    try {
        storage.removeItem(key)
    } catch(e) {
        console.error(e)
    }
}

export const localStorageMiddleWare = store => next => action => {
    let result = next(action)
    if(action.type === LOGIN_NEW) {
        let newState = store.getState()
        // let {registry} = newState
        // let dataObj = {registry}
// console.log('localStorageMiddleWare LOGIN_NEW', newState, dataObj, JSON.stringify(dataObj))
        setStorageItem(localStorage, newState.loggedInId, JSON.stringify(newState))
    }
    if(action.type === SUBMIT_TRANSACTION) {
        let newState = store.getState()
        let {registry} = newState
        let dataObj = {registry}
// console.log('localStorageMiddleWare SUBMIT_TRANSACTION', newState, dataObj, JSON.stringify(dataObj))
        setStorageItem(localStorage, newState.loggedInId, JSON.stringify(dataObj))
    }
    return result
}