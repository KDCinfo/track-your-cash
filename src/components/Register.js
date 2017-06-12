import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { Grid } from 'react-bootstrap'

import {getStorageItem} from '../store/functions';

import RegisterEntryFilled from './RegisterEntryFilled'

import * as ACTIONS from '../store/actions'

class RegisterContainer extends React.Component {
    componentDidMount() {
        if(!getStorageItem(sessionStorage, 'user')) {
            this.props.history.push('/login');
        }
    }
    render() {
        return (
            <div className="register-outer-div">
                <h1>Your Registry</h1>

                <h3>New Entry</h3>

                <Grid bsClass="grid-layout" key={this.props.currentEntry.id} fluid={true}><RegisterEntryFilled entryIdx={0} entryId={this.props.currentEntry.id} entry={this.props.currentEntry} yieldRouteHistoryBlock={true} /></Grid>

                <h3>Previous Entries</h3>

                <div className="show-grid">
                    { this.props.registry.map( (entry, idx) => <Grid bsClass="grid-layout" key={idx} fluid={true}><RegisterEntryFilled entryIdx={idx} entryId={entry.id} entry={entry} yieldRouteHistoryBlock={false} /></Grid> ) }
                </div>

                <br />
                <br />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        registry: state.registry,
        currentEntry: state.currentEntry
    }
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(ACTIONS, dispatch)
    }
}

const Register = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterContainer))

export default Register
