import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { Grid, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

import { getStorageItem, setStorageItem } from '../store/functions'

import RegisterEntryFilled from './RegisterEntryFilled'

import * as ACTIONS from '../store/actions'

class RegisterRootContainer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            editId: 0,
            sortField: 'date',
            sortOrder: 'ASC',
            filterText: '',
            showSortsPopup: false
        }

        this.editEntry = this.editEntry.bind(this)
        this.editEntryCancel = this.editEntryCancel.bind(this)
        this.deleteEntry = this.deleteEntry.bind(this)
        this.setSort = this.setSort.bind(this)
        this.filterIt = this.filterIt.bind(this)
        this.sortIt = this.sortIt.bind(this)
        this.showSortsPopup = this.showSortsPopup.bind(this)
        this._handleKeyDown = this._handleKeyDown.bind(this)
    }
    componentDidMount() {
        if(!getStorageItem(sessionStorage, 'user')) {
            this.props.history.push('/login');
        }
    }
    editEntry(paramObj) {
        this.setState({ editId: paramObj.entryId })
    }
    editEntryCancel() {
        this.setState({ editId: 0 })
    }
    deleteEntry(paramObj) {
        this.props.actions.removeFromStateArray(paramObj.entryId)

        const oldStateArray = this.props.registry,
              newStateArray = oldStateArray.filter( ( entry ) => entry.id !== paramObj.entryId ),
              newStateRegistry = {...this.props.oldState, registry: newStateArray}

        setStorageItem(localStorage, this.props.loggedInId, JSON.stringify(newStateRegistry))
    }
    sortIt(a,b) {
        if (this.state.sortOrder === 'DESC') {
            return (b[this.state.sortField] > a[this.state.sortField])
        } else {
            return (b[this.state.sortField] < a[this.state.sortField])
        }
    }
    filterIt(entry) {
        return entry.description.toLowerCase().includes(this.state.filterText.toLowerCase())
         || entry.notes.toLowerCase().includes(this.state.filterText.toLowerCase())
         || entry.type.toLowerCase().includes(this.state.filterText.toLowerCase())
         || entry.category.toLowerCase().includes(this.state.filterText.toLowerCase())
         || entry.date.toLowerCase().includes(this.state.filterText.toLowerCase())
         || entry.amount.includes(this.state.filterText)
    }
    setSort(e) {
        console.log('[setSort]', e.target.name, e.target.value)
        this.setState({ [e.target.name]: e.target.value })
    }
    setFilter(e) {
        this.setState({ filterText: e.target.value })
    }
    showSortsPopup() {
        console.log('[showSortsPopup]', this.state.showSortsPopup)
        if (this.state.showSortsPopup) {
            document.removeEventListener("keyup", this._handleKeyDown)
            this.setState({ showSortsPopup: false })
        } else {
            document.addEventListener("keyup", this._handleKeyDown)
            this.setState({ showSortsPopup: true })
        }
    }
    _handleKeyDown(event) {
        console.log('[_handleKeyDown]', event)
        // const ESCAPE_KEY = 27
        switch( event.keyCode ) {
            case 27:
                this.showSortsPopup()
                break;
            default:
                break;
        }
    }
    onKeyPress = event => {
console.log('[onKeyPress]', event, event.key)
        if(event.key === 'Enter') {
           // this.setState({ value: event.target.value })
        }
    }
    render() {
        const editEntry = this.editEntry,
              editEntryCancel = this.editEntryCancel,
              deleteEntry = this.deleteEntry

        const callbacksCurrent = {editEntry, editEntryCancel, deleteEntry},
              orderFields = [
                  { key: 'date',            value: 'Date' },
                  { key: 'description',     value: 'Description' },
                  { key: 'amount',          value: 'Amount' },
                  { key: 'type',            value: 'Type' },
                  { key: 'category',        value: 'Category' },
                  { key: 'notes',           value: 'Memo' },
                  { key: 'reconciled',      value: 'Reconciled' },
              ],
              orderDir = [
                { key: 'ASC',               value: 'Ascending [a-z]' },
                { key: 'DESC',              value: 'Descending [z-a]' },
              ]

        return (
            <div className="register-outer-div">
                <h1>Your Registry</h1>

                <h3>New Entry</h3>

                <Grid bsClass="grid-layout" key={this.props.currentEntry.id} fluid={true}><RegisterEntryFilled {...callbacksCurrent} entry={this.props.currentEntry} editId={this.state.editId} yieldRouteHistoryBlock={true} /></Grid>

                <div className="entries-previous">
                    <h3 className={this.props.registry.length === 0 ? 'hide' : ''}>Previous Entries</h3>
                    <div className="pull-right sortFilter">

                        <input type="text" size="10" placeholder="Filter text" onChange={this.setFilter.bind(this)} />

                        <button type="button" className="btn btn-success" onClick={this.showSortsPopup}>Sort Options {this.state.showSortsPopup ? '--' : '+'}</button>
                        <div className={this.state.showSortsPopup ? 'pref preferences' : 'pref preferences-hide'}>
                            <FormGroup>
                                <ControlLabel><span>Sort Field</span></ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    name="sortField"
                                    onChange={this.setSort}
                                >
                                    { orderFields.map( (obj, key) => <option key={obj.key} value={obj.key}>{obj.value}</option> ) }
                                </FormControl>
                            </FormGroup>

                            <FormGroup>
                                <ControlLabel><span>Sort Order</span></ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    name="sortOrder"
                                    onChange={this.setSort}
                                >
                                    { orderDir.map( (obj, key) => <option key={obj.key} value={obj.key}>{obj.value}</option> ) }
                                </FormControl>
                            </FormGroup>
                        </div>
                    </div>
                </div>

                <div className="show-grid">
                    { this.props.registry.filter( this.filterIt ).sort( this.sortIt ).map( (entry, idx) => <Grid bsClass="grid-layout" key={entry.id} fluid={true}><RegisterEntryFilled {...callbacksCurrent} entry={entry} editId={this.state.editId} yieldRouteHistoryBlock={false} /></Grid> ) }
                </div>

                <br />
                <br />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        oldState: state,
        registry: state.registry,
        currentEntry: state.currentEntry,
        loggedInId: state.loggedInId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(ACTIONS, dispatch)
    }
}

const RegisterRoot = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterRootContainer))

export default RegisterRoot
