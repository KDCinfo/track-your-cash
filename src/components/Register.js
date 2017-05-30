import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
// import { withRouter, Link } from 'react-router-dom'
import { Grid, Row, Col } from 'react-bootstrap'

import {getStorageItem} from '../store/functions';

class RegisterContainer extends React.Component {
    componentDidMount() {
        if(!getStorageItem(sessionStorage, 'user')) {
            this.props.history.push('/login');
        }
    }
    render() {
        return (
            <div>
                <br />

                <h1>Your Registry</h1>

                <h3><cite>(Currently being worked on...)</cite></h3>

                { this.props.registry.map( (entry, idx) => <Grid key={idx}><RegisterEntryFilled entry={entry} /></Grid> ) }

                <br />
                <br />
            </div>
        )
    }
}

class RegisterEntryFilled extends React.Component {
    render() {
        return (
            <Row className="show-grid">
                <Col xs={6} sm={4}>{this.props.entry.id}</Col>
                <Col xs={6} sm={4}>{this.props.entry.date}</Col>
                <Col xs={6} sm={4}>{this.props.entry.description}</Col>
                <Col xs={6} sm={4}>{this.props.entry.amount}</Col>
                <Col xs={6} sm={4}>{this.props.entry.type}</Col>
                <Col xs={6} sm={4}>{this.props.entry.category}</Col>
                <Col xs={6} sm={4}>{this.props.entry.notes}</Col>
                <Col xs={6} sm={4}>{this.props.entry.reconciled}</Col>
            </Row>

            // Entry Date | Entry Type | Entry Description | -(Entry Amount) | [Update]

            // Category   | Notes                          | Reconciled      | [Delete]

            // Add Entry                                                     | [Logout]

        )
    }
}

const mapStateToProps = (state) => {
    console.log('state', state)
    return {
        registry: state.registry
    }
}

const Register = withRouter(connect(
    mapStateToProps
)(RegisterContainer))

export default Register
