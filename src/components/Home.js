import React from 'react'

import { NavLink } from 'react-router-dom'

import { Well } from 'react-bootstrap'

import './Home.css'

class Home extends React.Component {
    render() {
        return (
            <Well bsSize="large">
                <div>
                    <h2>Welcome to your very own simplified checking register.</h2>
                </div>
                <div>
                    <p>Your login and entries are saved directly in your browser (like cookies).</p>
                    <p>Usage Idea: Good for trip expenses (just don't clear your local storage).</p>
                    <p>
                        As referenced in the footer, the code for Track Your Cash is <a href="https://github.com/KDCinfo/track-your-cash" target="kdcNewWin">Open Source on GitHub</a>,
                        so feel free to fork and create your own register.
                    </p>
                    <p>
                        Project Purpose: Web developers are in a constant state of learning,
                        and this project is no exception:
                        I created 'Track Your Cash' to get an understanding of how the React ecosystem works.
                        You can read more on the <NavLink to="/readme">Project Notes</NavLink> page.
                    </p>
                </div>
            </Well>
        )
    }
}

export default Home