/*
    React Component - Form:

        - Parent container for [Form: Date Input Field]
        - (native Date input field with non-native fallback)

    Usage:

        - [index.js]

            import React from 'react';
            import ReactDOM from 'react-dom';
            import FormDateContainer from './FormDateContainer';

            ReactDOM.render(
                <App store={store} />,
                root
            )

    Integration / Implementation:

        - Search this file for: CUSTOM

    Author:

        - Keith D Commiskey (2017-06)
*/

import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button } from 'react-bootstrap'

import DateInput from './FormDate'

import { populateDays } from './form-functions'

class FormDateContainer extends React.Component {
    constructor(props) {
        super(props)

        // Test whether a native date input falls back to a text input (i.e., native date input is not supported)
        //
            let testType = document.createElement('input'),
                showNativeDate
            testType.type = 'date'
            showNativeDate = testType.type === 'text' ? false : true

        this.state = {
            showNativeDate: showNativeDate,
            formState: this.initialFormData(),   // Updated on input field changes
            sourceState: this.initialFormData(), // Is only updated on form submit
            fieldRequired: {
                date: true
            },
            idValid: null,
            idError: '',
            dateValid: null,
            dateError: ''
        }

        // Bind component methods
        //
            this.validateForm = this.validateForm.bind(this)
            this.clearForm = this.clearForm.bind(this)
    }
    componentDidMount() {                               // CUSTOM:
        const testProps = this.props.formParams,        // 'formParams' Expects Object with a 'date' key
                                                        // { fid: [0], date: 'yyyymmdd' }
              propsHasDate = typeof(testProps) !== 'undefined' && typeof(testProps.date) !== 'undefined',
              thisProps = propsHasDate ? testProps : this.state.sourceState,
              mergedFormData = Object.assign({}, {...this.state.sourceState}, {...thisProps})

        this.setState({ 'formState': mergedFormData })
    }
    initialFormData() {
        const newDate = new Date()
        return {
            "fid": 0,
            "date": (newDate.getFullYear()) + ('0' + (newDate.getMonth()+1)).slice(-2) + ('0' + newDate.getDate()).slice(-2),
        }
    }
    clearForm() {
        this.setState({ formState: this.initialFormData() })
    }
    handleChange = (field, data) => {
        const oldFormData = this.state.formState,
              newFormData = {...oldFormData, [field]: data}
        this.setState({ 'formState': newFormData })
    }
    handleChangeDate(newDate) {
        this.handleChange('date', newDate)
    }
    handleSubmit(e) {
        if (e) {
            e.preventDefault()
        }

        const thisEntry = this.state.formState

        // Validate Form
        if (this.validateForm( thisEntry )) {

            // CUSTOM:

            // This is where you would pass this form's data [this.state.formData] to a props callback function
                // e.g., this.props.processFormData(this.state.formState)
                // Or call a Redux action to update the core Redux state
            // Instead, for this standalone purpose, we'll just update our fake 'sourceState'
            this.setState( { sourceState: thisEntry } )

            console.log('[UPDATE submitted]', thisEntry)

        } else {
            console.log('Errors were found -> Error states have been set (which should toggle individual field error visibility)')
        }
    }
    validateForm(form) {

        const errors = {},
              formatDateStripped = /^\d{8}$/

        for (let [key, val] of Object.entries( form )) {
            switch (key) {
                case 'fid':
                    // console.log('fid', val, typeof(val))

                    if (typeof(val) !== 'number' || (typeof(val) === 'number' && val < 0)) {
                        errors[key] = '[' + key + '] should be a Whole Number'
                        this.setState({ idValid: 'error' })
                        this.setState({ idError: errors[key] })
                    }
                    break

                case 'date':
                    // console.log('date', val, typeof(val))

                    if (typeof(val) !== 'string' || val.length !== 8 || !val.match(formatDateStripped)) {
                        errors[key] = 'The [' + key + '] field should be an 8-digit number representing yyyymmdd'
                        this.setState({ dateValid: 'error' })
                        this.setState({ dateError: errors[key] })
                    } else {
                        // This could be validated further where:
                            // yyyy should be a number between 1900 and 9999
                            // mm   should be a 2-digit string (number) and should represent a float from 1-12
                            // dd   should be a 2-digit string (number) and should represent a float from 1-31
                    }
                    break

                default:
                    break
            }
        }

        if (Object.keys(errors).length > 0) {
            return false
        } else {
            return true
        }
    }
    render() {

        const // { id, date } = this.props
              // { id, date } = this.state.sourceState,
              formId = this.state.formState.fid,
              propsObj = {
                'data-id': formId,
                required: true
              },
        isEdit = true,
        entryEdit = this.state.formState

        return (
            <Form onSubmit={this.handleSubmit.bind(this)} data-id={'form-' + entryEdit.fid} inline>
                <Row className="show-grid">
                    <Col className="field-col" xs={6} xsOffset={3}>
                        <DateInput
                            {...propsObj}
                            entryId={entryEdit.fid}
                            showNativeDate={!this.state.showNativeDate}
                            handleChangeDate={this.handleChangeDate.bind(this)}
                            date={entryEdit.date}
                            days={populateDays(entryEdit.date)}
                            daySelect={entryEdit.date.substr(6, 2)}
                            monthSelect={entryEdit.date.substr(4, 2)}
                            yearSelect={entryEdit.date.substr(0, 4)}
                            fullDateYearLeft={entryEdit.date.substr(0, 4) + '-' + entryEdit.date.substr(4, 2) + '-' + entryEdit.date.substr(6, 2)}
                            isDateRequired={this.state.fieldRequired['date']}
                            isDateDisabled={!isEdit}
                        />
                        <Button type="submit">Submit Form</Button>
                        <Button onClick={this.clearForm}>Reset Form</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

if(process.env.NODE_ENV !== 'production') {
    FormDateContainer.propTypes = {

        formParams : PropTypes.object.isRequired
        // Object with a 'date' key: { fid: 0, date: 'yyyymmdd' }

    }
}

export default FormDateContainer