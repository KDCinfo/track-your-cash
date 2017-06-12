import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {bindActionCreators} from 'redux';

import { NavLink } from 'react-router-dom'
import { PageHeader } from 'react-bootstrap'

import Logout from './Logout'
import { getStorageItem, deleteStorageItem } from '../store/functions'
import * as ACTIONS from '../store/actions'

class ContentFrameContainer extends React.Component {
    constructor(props) {
        super(props)

        const isLocal = window.location.href.indexOf('192.168') > 0

        this.handleClickLogout = this.handleClickLogout.bind(this)
        this.getWhichLink = this.getWhichLink.bind(this)

        this.state = {
            showCRA: isLocal ?
                <span>
                    [ <NavLink to="/cra">CRA</NavLink> ]&nbsp;
                </span>
                : ''
        }
    }
    getWhichLink() {
        const loggedInIdLocal = getStorageItem(sessionStorage, 'user') || '',
              isLoggedIn = loggedInIdLocal.length > 0

        return (
            isLoggedIn ?
                <span>
                    [ <NavLink to="/register">Your Register</NavLink> ]&nbsp;
                    [ <span className="NavLink"><Logout handleClick={this.handleClickLogout} /></span> ]&nbsp;
                </span>
                :
                <span>
                    [ <NavLink to="/login">Get Started</NavLink> ]&nbsp;
                </span>
        )
    }
    handleClickLogout() {
        this.props.actions.logoutUser();
        deleteStorageItem(sessionStorage, 'user');
        deleteStorageItem(sessionStorage, 'entry');
        this.props.history.push('/');
    }
    render() {
        return (
            <div>
                <header>
                    <PageHeader>
                        Track Your Cash<br/>
                        <small>(a checking register)</small>
                    </PageHeader>
                    [ <NavLink exact to="/">Home</NavLink> ]&nbsp;
                    {this.getWhichLink()}
                    [ <NavLink to="/about">About</NavLink> ]&nbsp;
                    [ <NavLink to="/readme">Project Notes</NavLink> ]&nbsp;
                    {this.state.showCRA}
                </header>

                <main className="content">{this.props.children}</main>

                <footer>Footer</footer>
            </div>
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

const ContentFrame = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ContentFrameContainer))

export default ContentFrame