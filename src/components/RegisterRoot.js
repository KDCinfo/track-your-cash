import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { Grid } from 'react-bootstrap'

import { getStorageItem, setStorageItem } from '../store/functions'

import RegisterEntryFilled from './RegisterEntryFilled'

import * as ACTIONS from '../store/actions'

class RegisterRootContainer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            editId: 0
        }

        this.editEntry = this.editEntry.bind(this)
        this.editEntryCancel = this.editEntryCancel.bind(this)
        this.editEntrySave = this.editEntrySave.bind(this)
        this.deleteEntry = this.deleteEntry.bind(this)
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
    editEntrySave() {
        //
    }
    deleteEntry(paramObj) {
        this.props.actions.removeFromStateArray(paramObj.entryId)

        const oldStateArray = this.props.registry,
              newStateArray = oldStateArray.filter( ( entry ) => entry.id !== paramObj.entryId ),
              newStateRegistry = {...this.props.oldState, registry: newStateArray}

        setStorageItem(localStorage, this.props.loggedInId, JSON.stringify(newStateRegistry))
    }
    render() {
        const editEntry = this.editEntry,
              editEntryCancel = this.editEntryCancel,
              editEntrySave = this.editEntrySave,
              deleteEntry = this.deleteEntry

        const callbacksCurrent = {editEntry, editEntryCancel, editEntrySave, deleteEntry}

        return (
            <div className="register-outer-div">
                <h1>Your Registry</h1>

                <h3>New Entry</h3>

                <Grid bsClass="grid-layout" key={this.props.currentEntry.id} fluid={true}><RegisterEntryFilled {...callbacksCurrent} entry={this.props.currentEntry} editId={this.state.editId} yieldRouteHistoryBlock={true} /></Grid>

                <h3 className={this.props.registry.length === 0 ? 'hide' : ''}>Previous Entries</h3>

                <div className="show-grid">
                    { this.props.registry.map( (entry, idx) => <Grid bsClass="grid-layout" key={entry.id} fluid={true}><RegisterEntryFilled {...callbacksCurrent} entry={entry} editId={this.state.editId} yieldRouteHistoryBlock={false} /></Grid> ) }
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
