import React from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom'

import { Grid, Row, Col } from 'react-bootstrap'

class RegisterContainer extends React.Component {
    render() {
        return (
            <div>
                <h1>Your Registry</h1>

                { this.props.registry.map( (entry, idx) => <Grid key={idx}><RegisterEntryFilled entry={entry} /></Grid> ) }

                <p>Feel free to jump over to: <Link to="/logout">Logout</Link></p>
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

const Register = connect(
    mapStateToProps
)(RegisterContainer)

export default Register