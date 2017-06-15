/*
    React Component - Form: Date Input Field

        - An HTML5 native Date input field with non-native fallback support as outlined in the MDN documentation

    Simplified Overview

        Native:
            <input type="date" />

        Non-Native Fallback:
            <select name="year" />
            <select name="month" />
            <select name="day" />

    Dependencies

        {   "dependencies": {
                "history": "^4.6.1",
                "react": "^15.5.4",
                "react-bootstrap": "^0.30.10",
                "react-dom": "^15.5.4",
            },
            "devDependencies": {
                "react-redux": "^5.0.4",
                "react-router": "^4.1.1",
                "react-router-dom": "^4.1.1",
                "react-router-redux": "^4.0.8",
                "redux": "^3.6.0",
        }    }

    Features

        Auto-detects native date field support
        Auto-adjusts number of days available based on year/month input

    Files

        Container: RegisterEntryFilled.js
        Date Input: DateInput.js (you are here)

    Author: Keith D Commiskey (2017-06)
*/

import React from "react"
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'

// this.props.entryId                      // [int] >= 0 | Used for: IDs - field-date- field-inputYear- field-inputMonth- field-inputDay-
// this.props.showInputDate                // [bool] true|false | Used for: Show native date input (t) or individual y/m/d selectors (f)
// this.props.handleChangeDate(newDate)    // yyyymmdd | A callback function that should handle the (newDate); API, local / session, etc.
// this.props.fullDateYearLeft             // yyyy-mm-dd        | Format used to populate the native date input field
// this.props.yearSelect                   // yyyy              | Non-native fallback support - Year field
// this.props.monthSelect                  // 01 (0-padded)     | Non-native fallback support - Month field
// this.props.daySelect                    // 01 (0-padded)     | Non-native fallback support - Day field
// this.props.months                       // ['Jan','Feb',...] | Set in parent to allow for parental 'day' field manipulation.
// this.props.days                         // [<option>1</option><option>2</option>,...] | An array whose length is based on year & month.
// this.props.isDateRequired               // [bool] true|false |

class DateInputContainer extends React.Component {
    constructor(props) {
        super(props)

        const thisDate = new Date(),
              years = Array.from(Array(thisDate.getFullYear()-2000+11), (e,i)=>i+(2000))

        this.state = {
            years: years,
            nativePickerDisplay: 'none',
            fallbackPickerDisplay: 'none',
            fallbackLabelDisplay: 'none',
            fallbackRequired: false
        }
    }
    componentWillMount() {
        // console.log('componentWillMount [this.state] and [this.props]')
        // console.log(this.state)
        // console.log(this.props)

        if (this.props.showInputDate) {
            // Show the native date picker (keep fallback date entries hidden)
            this.setState({nativePickerDisplay: 'block'})

        } else {
            // Show the fallback date entries (keep native date picker hidden)
            this.setState({fallbackPickerDisplay: 'inline-block'})
            this.setState({fallbackLabelDisplay: 'inline-block'})
            this.setState({fallbackRequired: true})
        }
    }
    componentDidMount() {
        // console.log('componentDidMount [this.state] and [this.props]')
        // console.log(this.state)
        // console.log(this.props)
    }
    componentWillUpdate() {
        // console.log('componentWillUpdate [this.state] and [this.props]')
        // console.log(this.state)
        // console.log(this.props)
    }
    componentDidUpdate() {
        // console.log('componentDidUpdate [this.state] and [this.props]')
        // console.log(this.state)
        // console.log(this.props)
    }
    handleChangeYearSelect(e) {
        const newDate = e.target.value + this.props.monthSelect + this.props.daySelect

        this.props.handleChangeDate(newDate)
    }
    handleChangeMonthSelect(e) {
        const newMonth = ('0' + (e.target.selectedIndex + 1)).slice(-2),
              newDate = this.props.yearSelect + newMonth + this.props.daySelect

        this.props.handleChangeDate(newDate)
    }
    handleChangeDaySelect(e) {
        const newDay = ('0' + e.target.value).slice(-2),
              newDate = this.props.yearSelect + this.props.monthSelect + newDay

        this.props.handleChangeDate(newDate)
    }
    handleChangeDateNative(e) {
        // Native date input value is: 2017-12-31 // Storing without '-'
        this.props.handleChangeDate(e.target.value.replace(/-/gi, ''))
    }
    render() {
        // The native input 'date' value is always formatted [yyyy-mm-dd]
        // <input className="hide" name="date-old" onChange={this.props.handleChange} value={this.props.date} type="date" title="yyyy-mm-dd" placeholder="yyyy-mm-dd" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" />
        return (
            <div>
                <div style={{display: this.state.nativePickerDisplay}} className="nativeDatePicker">
                    <FormGroup controlId={'field-date-' + this.props.entryId}>
                        <ControlLabel srOnly={this.props.isDateDisabled} bsClass="field-label"><span>Date:</span></ControlLabel>
                        <FormControl
                            autoFocus={this.props.focusNew}
                            disabled={this.props.isDateDisabled}
                            required={this.props.isDateRequired}
                            type="date"
                            placeholder="Date"
                            name="inputDate"
                            onChange={this.handleChangeDateNative.bind(this)}
                            value={this.props.fullDateYearLeft}
                        />
                        <FormControl.Feedback />
                    </FormGroup>
                </div>
                <p style={{display: this.state.fallbackLabelDisplay}} className="fallbackLabel hide">Enter Date:</p>
                <div style={{display: this.state.fallbackPickerDisplay}} className="fallbackDatePicker">
                    <FormGroup>
                        <ControlLabel srOnly={this.props.isDateDisabled} htmlFor={"field-inputYear-" + this.props.entryId}><span>Year</span></ControlLabel>
                        <FormControl
                            autoFocus={this.props.focusNew}
                            disabled={this.props.isDateDisabled}
                            required={this.state.fallbackRequired && this.props.isDateRequired}
                            componentClass="select"
                            placeholder="Year"
                            id={"field-inputYear-" + this.props.entryId}
                            name="inputYear"
                            onChange={this.handleChangeYearSelect.bind(this)}
                            value={parseFloat(this.props.yearSelect)}
                        >
                            { this.state.years.map( (day, idx) => <option key={idx}>{day}</option> ) }
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel srOnly={this.props.isDateDisabled} htmlFor={"field-inputMonth-" + this.props.entryId}><span>Month</span></ControlLabel>
                        <FormControl
                            disabled={this.props.isDateDisabled}
                            required={this.state.fallbackRequired && this.props.isDateRequired}
                            componentClass="select"
                            placeholder="Year"
                            id={"field-inputMonth-" + this.props.entryId}
                            name="inputMonth"
                            onChange={this.handleChangeMonthSelect.bind(this)}
                            value={this.props.months[parseFloat(this.props.monthSelect)-1]}
                        >
                            { this.props.months.map( (month, idx) => <option key={idx}>{month}</option> ) }
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel srOnly={this.props.isDateDisabled} htmlFor={"field-inputDay-" + this.props.entryId}><span>Day</span></ControlLabel>
                        <FormControl
                            disabled={this.props.isDateDisabled}
                            required={this.state.fallbackRequired && this.props.isDateRequired}
                            componentClass="select"
                            placeholder="Year"
                            id={"field-inputDay-" + this.props.entryId}
                            name="inputDay"
                            onChange={this.handleChangeDaySelect.bind(this)}
                            value={parseFloat(this.props.daySelect)}
                        >
                            { this.props.days.map( (day, idx) => <option key={idx}>{day}</option> ) }
                        </FormControl>
                    </FormGroup>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = dispatch => {
    return {}
}

const DateInput = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(DateInputContainer))

export default DateInput