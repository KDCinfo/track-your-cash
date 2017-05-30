import { getStorageItem, getObjectFromStorage, deleteStorageItem } from './functions'
import { VisibilityFilters } from './actions'

const { SHOW_ALL } = VisibilityFilters

const initialState = {
    loggedInId: '',
    base: 0,
    registry: [],
    visibilityFilter: SHOW_ALL,
    withdrawError : false,
    transactionSuccess : false,
}

export const getLoadedState = () => {
    let loadedState = {}
    let userId = getStorageItem(sessionStorage, 'user')
    if(userId) {
        let isLoadedState = getObjectFromStorage(localStorage, userId)
        if(isLoadedState) {
            loadedState.loggedInId = userId
        } else {
            // Session 'user' exists, but no localStorage 'user' found
            // Likely a problem when creating localStorage: Start over
            loadedState.loggedInId = ''
            deleteStorageItem(sessionStorage, 'user')
        }
    }
    return {...initialState, ...loadedState}
}

export default initialState
/*
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
