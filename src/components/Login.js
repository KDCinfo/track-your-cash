import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {bindActionCreators} from 'redux';

import { Well, Grid, Row, Col } from 'react-bootstrap'

import LoginForm from './LoginForm'
import * as ACTIONS from '../store/actions';
import {setStorageItem} from '../store/functions';
import config from '../store/config';
import { getLoadedEntry } from '../store/initial-state'

class LoginContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputMessage: (typeof(this.props.inputMessage) === 'undefined' || this.props.inputMessage.length === 0)
                ? 'E-mail (a valid e-mail address is required)'
                : this.props.inputMessage
        }
    }
    componentWillUnmount() {
        this.props.actions.clearForm();
        this.props.actions.clearFormExist();
    }
    handleChangeLogin = e => {
        this.props.actions.inputTyping('loggedInId', e.target.value);
    }
    handleSubmit = e => {
        e.preventDefault();
        const email = this.props.loggedInId

        this.props.actions.login(email)
        setStorageItem(sessionStorage, 'user', email)
        this.props.actions.updateStateField('currentEntry', getLoadedEntry())
        this.props.history.push('/' + config.registerText)
    }
    render() {
        const {loggedInId} = this.props;
        const handleChangeLogin = this.handleChangeLogin;
        const handleSubmit = this.handleSubmit;
        const inputMessage = this.state.inputMessage
        const propsObj = {loggedInId, handleChangeLogin, handleSubmit, inputMessage};
        return (
            <Grid fluid={true}>
                <Row>
                    <Col xs={12}>
                        <section>
                            Enter your e-mail below to login or create an account.
                        </section>
                    </Col>
                </Row>
                <Well bsSize="large">
                    <LoginForm {...propsObj} />
                </Well>
                <Row>
                    <Col xs={12}>
                        <aside>
                            An account will be created if the provided e-mail does not already exist in the system.
                            This is a public 'for fun' register and should not be used to keep track of your real finances.
                            You can, however, <a href="https://github.com/KDCinfo/track-your-cash" target="kdcNewWindow">fork this repo from GitHub</a> and set it up on your own local box, or somewhere behind authentication.
                        </aside>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        loggedInId: state.loggedInId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(ACTIONS, dispatch)
    }
}

const Login = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginContainer))

export default Login
