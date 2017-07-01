import React from 'react'

import { Well } from 'react-bootstrap'

class About extends React.Component {
    render() {
        return (
            <Well bsSize="large">
                <p>This little web app thoughtfully brought to you by... <a href="https://kdcinfo.com/resume" target="kdcNewWin">me</a> :) <small><i>(...Keith)</i></small></p>
                <p>Just a simple hard-working Front-End <s>Dev</s> (...er, Engineer) learning React in 2017. </p>
                <p>
                    <strong><i>Related Online References:</i></strong>
                </p>
                <ul>
                    <li>Track Your Cash Source Code (GitHub) - <a href="https://github.com/KDCinfo/track-your-cash" target="kdcNewWin">https://github.com/KDCinfo/track-your-cash</a></li>
                    <li>Track Your Cash Demo (GitHub Pages) - <a href="https://KDCinfo.github.io/track-your-cash/" target="kdcNewWin">https://KDCinfo.github.io/track-your-cash/</a></li>
                    <li>Travis CI (Production Build) - <a href="https://travis-ci.org/KDCinfo/track-your-cash" target="kdcNewWin">https://travis-ci.org/KDCinfo/track-your-cash</a></li>
                    <li>Quick mockup of checking register entry layout - <a href="http://framebox.org/ABYqI-eNFlwC" target="kdcNewWin">http://framebox.org/ABYqI-eNFlwC</a></li>
                </ul>
                <ul>
                    <li>Personal Portfolio - <a href="https://kdcinfo.com" target="kdcNewWin">https://kdcinfo.com</a></li>
                    <li>Online Resume - <a href="https://kdcinfo.com/resume" target="kdcNewWin">https://kdcinfo.com/resume</a></li>
                    <li>GitHub - <a href="https://github.com/KDCinfo" target="kdcNewWin">https://github.com/KDCinfo</a></li>
                    <li className="hide">x - <a href="x" target="kdcNewWin">x</a></li>
                </ul>
            </Well>
        )
    }
}

export default About