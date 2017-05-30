import React from 'react'

import Markdown from './Markdown.js'
import myMarkP from '../store/readme-project.js'

import './ProjectNotes.css'

class ProjectNotes extends React.Component {
    render() {
        return (
            <div>
                <h2>An Ambitious 1<sup>st</sup> React-based Project</h2>
                <p>Working on this project provided me a more in-depth look into React components, state (both local and Redux), and routing... amongst so many other learnables.</p>
                <p>
                    This project was bootstrapped using [<a href="https://www.npmjs.com/package/create-react-app" target="kdcNewWin">Create React App</a>].
                </p>
                <p>
                    Project Module Versions:
                </p>
                <dl>
                    <dt className="highlight">react</dt><dd className="highlight"><code>^15.5.4</code></dd>
                    <dt>react-dom</dt><dd><code>^15.5.4</code></dd>

                    <dt className="highlight">react-router</dt><dd className="highlight"><code>^4.1.1</code></dd>
                    <dt>react-router-dom</dt><dd><code>^4.1.1</code></dd>

                    <dt className="highlight">redux</dt><dd className="highlight"><code>^3.6.0</code></dd>
                    <dt>react-redux</dt><dd><code>^5.0.4</code></dd>
                    <dt>react-router-redux</dt><dd><code>^4.0.8</code></dd>

                    <dt>prop-types</dt><dd><code>^15.5.8</code></dd>
                    <dt>react-scripts</dt><dd><code>0.9.5</code></dd>
                    <dt>react-bootstrap</dt><dd><code>^0.31.0</code></dd>
                    <dt>react-markdown-renderer</dt><dd><code>^1.2.0</code></dd>
                </dl>

                <div className="clear"></div>

                <Markdown myMark={myMarkP} />
            </div>
        )
    }
}

export default ProjectNotes