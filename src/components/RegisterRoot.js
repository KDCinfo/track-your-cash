import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { Grid, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'

import { getStorageItem, setStorageItem, deleteStorageItem, formatFixed2 } from '../store/functions'

import RegisterEntryFilled from './RegisterEntryFilled'
import TextFiltered from './TextFiltered'

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
    componentWillUnmount() {
        this.setState({ showSortsPopup: false })
    }
    editEntry(paramObj) {
        this.setState({ editId: paramObj.entryId })
    }
    editEntryCancel() {
        this.setState({ editId: 0 })
        deleteStorageItem(sessionStorage, 'entryExist')
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
        // console.log('[setSort]', e.target.name, e.target.value)
        this.setState({ [e.target.name]: e.target.value })
    }
    setFilter(e) {
        this.setState({ filterText: e.target.value })
    }
    showSortsPopup() {
        // console.log('[showSortsPopup]', this.state.showSortsPopup)
        if (this.state.showSortsPopup) {
            document.removeEventListener("keyup", this._handleKeyDown)
            this.setState({ showSortsPopup: false })
        } else {
            document.addEventListener("keyup", this._handleKeyDown)
            this.setState({ showSortsPopup: true })
        }
    }
    _handleKeyDown(event) {
        // console.log('[_handleKeyDown]', event)
        // const ESCAPE_KEY = 27
        switch( event.keyCode ) {
            case 27:
                this.showSortsPopup()
                break;
            default:
                break;
        }
    }
    showTotalFiltered = () => {
        const registryThinned = this.props.registry
            .filter( this.filterIt )
            .reduce(
                (acc, cur) => (parseFloat(cur.amount) + acc), 0
            )
        return '$' + formatFixed2(registryThinned)
    }
    showTotalReconciled = () => {
        const registryThinned = this.props.registry
            .filter( entry => entry.reconciled )
            .reduce(
                (acc, cur) => (parseFloat(cur.amount) + acc), 0
            )
        return '$' + formatFixed2(registryThinned)
    }
    showTotalAll = () => {
        const registryThinned = this.props.registry
            .reduce(
                (acc, cur) => (parseFloat(cur.amount) + acc), 0
            )
        return '$' + formatFixed2(registryThinned)
    }
    render() {
        const editEntry = this.editEntry,
              editEntryCancel = this.editEntryCancel,
              deleteEntry = this.deleteEntry

        const callbacksCurrent = {editEntry, editEntryCancel, deleteEntry},
              orderFields = [
                { key: 'date',        value: 'Date' },
                { key: 'description', value: 'Description' },
                { key: 'amount',      value: 'Amount' },
                { key: 'type',        value: 'Type' },
                { key: 'category',    value: 'Category' },
                { key: 'notes',       value: 'Memo' },
                { key: 'reconciled',  value: 'Reconciled' },
              ],
              orderDir = [
                { key: 'ASC',           value: 'Ascending [a-z]' },
                { key: 'DESC',          value: 'Descending [z-a]' },
              ]

        const showTotals = {
            filterText: this.state.filterText,
            showTotalFiltered: this.showTotalFiltered,
            showTotalReconciled: this.showTotalReconciled,
            showTotalAll: this.showTotalAll
        }

        return (
            <div className="register-outer-div">
                <div className="entries-title-titlebar">
                    <h1>Your Registry</h1>
                </div>

                <div className="entries-current-titlebar">
                    <h3>New Entry...</h3>
                    <div className="pull-right title-right-slot">
                        <TextFiltered {...showTotals} />
                    </div>
                </div>

                <Grid bsClass="grid-layout" key={this.props.currentEntry.id} fluid={true}><RegisterEntryFilled {...callbacksCurrent} entry={this.props.currentEntry} editId={this.state.editId} yieldRouteHistoryBlock={true} /></Grid>

                <div className={this.props.registry.length === 0 ? 'hide' : 'entries-previous-titlebar'}>
                    <h3>Previous Entries</h3>
                    <div className="pull-right title-right-slot">

                        <input type="text" size="10" placeholder="Filter text" onChange={this.setFilter.bind(this)} />

                        <Button type="button" className="btn btn-success" onClick={this.showSortsPopup}>Sort Options {this.state.showSortsPopup ? '--' : '+'}</Button>
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

                <div className={this.props.registry.length === 0 ? 'hide' : 'show-grid'}>
                    { this.props.registry.filter( this.filterIt ).sort( this.sortIt ).map( (entry, idx) => <Grid bsClass="grid-layout" key={entry.id} fluid={true}><RegisterEntryFilled {...callbacksCurrent} entry={entry} editId={this.state.editId} yieldRouteHistoryBlock={false} /></Grid> ) }
                </div>

                <div className={this.props.registry.length === 0 ? 'hide' : 'entries-footer-titlebar'}>
                    <div className="pull-right title-right-slot">
                        <TextFiltered {...showTotals} />
                    </div>
                </div>
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
