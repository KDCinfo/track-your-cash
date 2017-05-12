import { combineReducers } from 'redux'
import { ADD_TODO, TOGGLE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters } from './actions'
const { SHOW_ALL } = VisibilityFilters

console.log('reducers', SHOW_ALL)

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}

function registry(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
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
    case TOGGLE_TODO:
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

function isLoggedIn(state = [], action) {
  return state
}

const rootReducer = combineReducers({
  visibilityFilter,
  registry,
  isLoggedIn
})

export default rootReducer
