import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux';

import { NavLink } from 'react-router-dom'
import { PageHeader, Button } from 'react-bootstrap'

import Logout from './Logout'
import { getStorageItem, deleteStorageItem } from '../store/functions'
import { logoutUser } from '../store/actions'
import config from '../store/config';

class ContentFrameContainer extends React.Component {
    constructor(props) {
        super(props)

        const isLocal = (process.env.NODE_ENV !== 'production'),
              whichPath = config.rootPath

        this.handleClickLogout = this.handleClickLogout.bind(this)
        this.getRegisterLink = this.getRegisterLink.bind(this)
        this.getLogoutLink = this.getLogoutLink.bind(this)

        this.state = {
            showCRA: isLocal ?
                <span>
                    <span className="no-wrap"><NavLink to={whichPath + '/cra'}>CRA</NavLink></span>&nbsp;
                </span>
                : '',
            whichPath
        }
    }
    getRegisterLink() {
        const loggedInIdLocal = (typeof(sessionStorage) !== 'undefined' && getStorageItem(sessionStorage, 'user')) || '',
              isLoggedIn = loggedInIdLocal.length > 0

        return (
            isLoggedIn ?
                <span>
                    <span className="no-wrap"><NavLink to={this.state.whichPath + '/register'}>Your Register</NavLink></span>&nbsp;
                </span>
                :
                <span>
                    <span className="no-wrap"><NavLink to={this.state.whichPath + '/login'}>Get Started</NavLink></span>&nbsp;
                </span>
        )
    }
    getLogoutLink() {
        const loggedInIdLocal = (typeof(sessionStorage) !== 'undefined' && getStorageItem(sessionStorage, 'user')) || '',
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
        if (window.confirm('Are you absolutely sure\r\n\r\nyou want to delete all your data?')) {
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
    isLoggedIn() {
        const loggedInIdLocal = (typeof(sessionStorage) !== 'undefined' && getStorageItem(sessionStorage, 'user')) || ''
        return loggedInIdLocal.length > 0
    }
    render() {
        const buttonTitleExport = 'Save your data to a local file you can view on your system.',
              buttonTitleDelete = 'You will be asked to confirm the removal of all your data.',
              typeName = 'div-' + this.props.children.type.name.toLowerCase()

        return (
            <div className={typeName}>
                <header>
                    <PageHeader>
                        Track Your Ca<small><b>$</b></small>h<br/>
                        <small>(a checking register)</small>
                    </PageHeader>
                    <nav>
                        <span className="no-wrap"><NavLink exact to={this.state.whichPath + '/'}>Home</NavLink></span>&nbsp;
                        {this.getRegisterLink()}
                        <span className="no-wrap"><NavLink to={this.state.whichPath + '/readme'}>Project Notes</NavLink></span>&nbsp;
                        {this.state.showCRA}
                        <span className="no-wrap"><NavLink to={this.state.whichPath + '/about'}>About</NavLink></span>&nbsp;
                        {this.getLogoutLink()}
                    </nav>
                </header>

                <main className="content">{this.props.children}</main>

                <footer>
                    <div className="github">
                        Track Your Cash is <a href="https://github.com/KDCinfo/track-your-cash" target="kdcNewWin">Open Source on GitHub</a>
                    </div>
                    <div className={!this.isLoggedIn() ? 'hide' : 'delete-account'}>
                        <Button bsSize="sm" title={buttonTitleExport} onClick={this.exportIt.bind(this)}>Export (save your data)</Button>
                        &nbsp;&nbsp;
                        <Button bsSize="sm" title={buttonTitleDelete}onClick={this.deleteAccount.bind(this)}>Delete Account</Button>
                    </div>
                    <div className="footer-right">
                        <span className="mobile-only"><span className="hide-created-575">Created by: </span><a href="https://kdcinfo.com" target="kdcinfo">KDC-Info</a></span>
                        <span className="non-mobile-i">Created by: <a href="https://kdcinfo.com" target="kdcinfo">KDC-Info</a></span>
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
        actions: bindActionCreators({ logoutUser }, dispatch)
    }
}

const ContentFrame = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ContentFrameContainer))

export default ContentFrame