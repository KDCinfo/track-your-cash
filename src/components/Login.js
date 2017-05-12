import React from 'react'

import { Grid, Row, Col } from 'react-bootstrap'

class Login extends React.Component {
    render() {
        return (
            <Grid fluid={true}>
                <Row>
                    <Col xs={12}>
                        <p>Once working, this (currently unstyled) form will validate, then open the actual 'register' component upon successful login (or account creation)</p>
                    </Col>
                </Row>
                <Row className="show-grid">
                    <Col xs={12} sm={3}>
                        <input type="text" placeholder="E-mail" />
                    </Col>
                    <Col xs={12} sm={9}>
                        <button>Login</button>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default Login