import React from 'react'

import { NavLink } from 'react-router-dom'

import { Well } from 'react-bootstrap'

import './Home.css'

class Home extends React.Component {
    render() {
        const whichPath = (process.env.NODE_ENV === 'production') ? '/track-your-cash' : ''
        return (
            <Well bsSize="large">
                <div className="div-home">
                    <h2>Your Digital Checkbook</h2>
                </div>
                <div>
                    <p>"Track Your Cash" is an <a href="https://github.com/KDCinfo/track-your-cash" target="kdcNewWin">open-source</a> (free) online checkbook.</p>
                    <p>All data is saved directly in your browser (like with cookies, only it's called 'local/session storage').</p>

                    <h3>Usage Ideas:</h3>
                    <ul>
                        <li>Good for trip expenses (just don't clear your local storage)</li>
                        <li><a href="https://github.com/KDCinfo/track-your-cash" target="kdcNewWin">Fork the code on GitHub</a> and create your own turbocharged checkbook registry!</li>
                    </ul>

                    <h3>Project Purpose:</h3>
                    <p>
                        Web developers are in a constant state of learning: I created
                        'Track Your Cash' to get an understanding of how the <a href="https://facebook.github.io/react/" target="kdcNewWin">React</a> ecosystem works.
                        You can read more on the <NavLink to={whichPath + '/readme'}>Project Notes</NavLink> page.
                    </p>
                </div>
            </Well>
        )
    }
}

export default Home