import React from 'react'

import { NavLink } from 'react-router-dom'

import { PageHeader } from 'react-bootstrap'

class ContentFrame extends React.Component {
    constructor(props) {
        super(props)
        const isLocal = window.location.href.indexOf('192.168') > 0
        this.state = {
            whichLink:
            this.props.isLoggedIn ?
                <span>
                    [ <NavLink to="/register">Register</NavLink> ]&nbsp;
                    [ <NavLink to="/logout">Logout</NavLink> ]&nbsp;
                </span>
                :
                <span>
                    [ <NavLink to="/login">Get Started</NavLink> ]&nbsp;
                </span>,
            showCRA: isLocal ?
                <span>
                    [ <NavLink to="/cra">CRA</NavLink> ]&nbsp;
                </span>
                : ''
        }
    }
    render() {
        return (
            <div>
                <header>
                    <PageHeader>Track Your Cash
                        <br/><small>(a checking register)</small></PageHeader>
                    [ <NavLink exact to="/">Home</NavLink> ]&nbsp;
                    {this.state.whichLink}
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

export default ContentFrame