import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {bindActionCreators} from 'redux';

import { NavLink } from 'react-router-dom'
import { PageHeader, Button } from 'react-bootstrap'

import Logout from './Logout'
import { getStorageItem, deleteStorageItem } from '../store/functions'
import * as ACTIONS from '../store/actions'

class ContentFrameContainer extends React.Component {
    constructor(props) {
        super(props)

        const isLocal = window.location.href.indexOf('192.168') > 0

        this.handleClickLogout = this.handleClickLogout.bind(this)
        this.getRegisterLink = this.getRegisterLink.bind(this)
        this.getLogoutLink = this.getLogoutLink.bind(this)

        this.state = {
            showCRA: isLocal ?
                <span>
                    <span className="no-wrap"><NavLink to="/cra">CRA</NavLink></span>&nbsp;
                </span>
                : ''
        }
    }
    getRegisterLink() {
        const loggedInIdLocal = getStorageItem(sessionStorage, 'user') || '',
              isLoggedIn = loggedInIdLocal.length > 0

        return (
            isLoggedIn ?
                <span>
                    <span className="no-wrap"><NavLink to="/register">Your Register</NavLink></span>&nbsp;
                </span>
                :
                <span>
                    <span className="no-wrap"><NavLink to="/login">Get Started</NavLink></span>&nbsp;
                </span>
        )
    }
    getLogoutLink() {
        const loggedInIdLocal = getStorageItem(sessionStorage, 'user') || '',
              isLoggedIn = loggedInIdLocal.length > 0

        return (
            isLoggedIn ?
                <span>
                    <span className="no-wrap"><span className="NavLink"><Logout handleClick={this.handleClickLogout} /></span></span>&nbsp;
                </span>
                :
                <span>
                </span>
        )
    }
    handleClickLogout() {
        this.props.actions.logoutUser();
        deleteStorageItem(sessionStorage, 'user');
        deleteStorageItem(sessionStorage, 'entry');
        this.props.history.push('/');
    }
    deleteAccount(e) {
        // console.log('[deleteAccount]', this.props.loggedInId)
        if (confirm('Are you absolutely sure\r\n\r\nyou want to delete all your data?')) {
            deleteStorageItem(localStorage, this.props.loggedInId);
            deleteStorageItem(sessionStorage, 'user');
            deleteStorageItem(sessionStorage, 'entry');
            this.props.actions.logoutUser();
            this.props.history.push('/');
        }
    }
    exportIt = () => {
        const dataToSave = getStorageItem(localStorage, this.props.loggedInId),
              dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataToSave)

        // http://www.codevoila.com/post/30/export-json-data-to-downloadable-file-using-javascript
        let linkElement = document.createElement('a')
            linkElement.setAttribute('href', dataUri)
            linkElement.setAttribute('download', 'data.json')
            linkElement.click()
    }
    render() {
        const buttonTitleExport = 'Save your data to a local file you can view on your system.',
              buttonTitleDelete = 'You will be asked to confirm the removal of all your data.'
        return (
            <div>
                <header>
                    <PageHeader>
                        Track Your Ca<small><b>$</b></small>h<br/>
                        <small>(a checking register)</small>
                    </PageHeader>
                    <nav>
                        <span className="no-wrap"><NavLink exact to="/">Home</NavLink></span>&nbsp;
                        {this.getRegisterLink()}
                        <span className="no-wrap"><NavLink to="/readme">Project Notes</NavLink></span>&nbsp;
                        {this.state.showCRA}
                        <span className="no-wrap"><NavLink to="/about">About</NavLink></span>&nbsp;
                        {this.getLogoutLink()}
                    </nav>
                </header>

                <main className="content">{this.props.children}</main>

                <footer>
                    <div className="github">
                        Track Your Cash is <a href="https://github.com/KDCinfo/track-your-cash" target="kdcNewWin">Open Source on GitHub</a>
                    </div>
                    <div className="delete-account">
                        <Button className={!this.props.loggedInId ? 'hide' : ''} bsSize="sm" title={buttonTitleExport} onClick={this.exportIt.bind(this)}>Export (save your data)</Button>
                        &nbsp;&nbsp;
                        <Button className={!this.props.loggedInId ? 'hide' : ''} bsSize="sm" title={buttonTitleDelete}onClick={this.deleteAccount.bind(this)}>Delete Account</Button>
                    </div>
                </footer>
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