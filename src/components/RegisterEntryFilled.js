/*
    React Component - Form: Checking Register Entry Form (new and existing entries) (new: eid=0), existing: eid>0)

        // Entry Date | Trans Type | Entry Description | -(Entry Amount) | Existing:  [Edit]  | [Update]
        // Category   | Notes                          | Reconciled      | Existing: [Delete] | [Cancel]
        //                                             | New: [Add]

    Author: Keith D Commiskey (2017-06)
*/

import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import Autosuggest from 'react-bootstrap-autosuggest'
    // https://github.com/affinipay/react-bootstrap-autosuggest/blob/gh-pages/apidocs/Autosuggest.md
    // https://affinipay.github.io/react-bootstrap-autosuggest/

import DateInput from './DateInput'
import RegisterList from './RegisterList'

import { Row, Col, Form, FormGroup, ControlLabel, FormControl, Button, Table, HelpBlock, Popover, OverlayTrigger, Glyphicon } from 'react-bootstrap'

import * as ACTIONS from '../store/actions'

import { formatFixed2, getStorageItem, setStorageItem, deleteStorageItem } from '../store/functions'

class RegisterEntryFilledContainer extends React.Component {
    constructor(props) {
        super(props)

        // test whether a new date input falls back to a text input or not
        let testType = document.createElement('input'),
            showInputDate
        testType.type = 'date'
        showInputDate = testType.type === 'text' ? false : true

        const setHistoryBlocker = this.props.yieldRouteHistoryBlock ? this.props.history.block((location, action) => {
                if (getStorageItem(sessionStorage, 'entryExist')) {
                    return 'Are you sure you want to leave this page?'
                }
            }) : () => undefined

        this.state = {
            editId: 0,
            // unblock: this.props.history.block('Are you sure you want to leave this page?')
            unblock: setHistoryBlocker,
            months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            fieldRequired: {
                date: true,
                description: true,
                amount: true,
                type: true,
                category: true,
                notes: false,
                reconciled: false
            },
            showInputDate: showInputDate,
            descriptionLength: 150,
            typeLength: 25,
            categoryLength: 50,
            notesLength: 150,
            formValid: null,
            showModal: false,

            id: 0,
            date: '',
            amount: 0,
            description: '',
            type: '',
            category: '',
            notes: '',
            reconciled: '',

            idError: '',
            dateError: '',
            amountError: '',
            descriptionError: '',
            typeError: '',
            categoryError: '',
            notesError: '',
            reconciledError: '',

            idValid: null,
            dateValid: null,
            amountValid: null,
            descriptionValid: null,
            typeValid: null,
            categoryValid: null,
            notesValid: null,
            reconciledValid: null
        }
        this.validateForm = this.validateForm.bind(this)
        this.closeTypes = this.closeTypes.bind(this)
        this.deleteListItem = this.deleteListItem.bind(this)
        // this.handleChangeTypeahead = this.handleChangeTypeahead.bind(this)
    }
    componentWillUnmount() {
        this.props.actions.clearFormExist()
        deleteStorageItem(sessionStorage, 'entryExist')
        this.state.unblock()
    }
    handleStorageSet(field, val, eid) {
        const entryOrig = this.props.entry

        let entryObj,
            entryObjStr,
            entryObjNew,
            whichStorage = 'entry',
            whichState = 'currentEntry'

        if (parseFloat(eid) > 0) {
            whichStorage = 'entryExist'
            whichState = 'existingEntry'
        }

        entryObj = getStorageItem(sessionStorage, whichStorage)
        entryObjStr = (!entryObj) ? {} : JSON.parse(entryObj) // {data} stored in [window.]storage are stringify()'d
        entryObjNew = {...entryOrig, ...entryObjStr, [field]: val}

        // ValidateForm
            // this.setState( {[field]: val}, () => { this.validateField(field, val) } )
            // I could update per-field error states on handleChange,
                // but some fields require validation on form submit (e.g., id and checkbox)
                // Plus, field-level validation would show a lot of fields as errors on initial load (for currentEntry)
                // Better to show all error fields after form is submitted
        setStorageItem(sessionStorage, whichStorage, JSON.stringify(entryObjNew))
        this.props.actions.inputTyping(whichState, entryObjNew)
    }
    handleChange = e => {
        const whichField = e.target.name

        let newVal = e.target.value
        if (whichField === 'amount') {
            newVal = formatFixed2(e.target.value)
        }
        this.handleStorageSet(whichField, newVal, e.target.getAttribute('data-id'))
    }
    handleChangeTypeaheadType(e) {
        this.handleChangeTypeahead(e, 'type')
    }
    handleChangeTypeaheadCat(e) {
        this.handleChangeTypeahead(e, 'category')
    }
    handleChangeTypeahead = (e, field) => {

        const eValue = e,
              eField = field,
              eKeyPlural = eField + 's', // Yea... 'categorys' is a bit annoying.
              existingVal = this.props.entry[eField]

        if (eValue.length === 0 || eValue === existingVal) {
            return false
        }

        this.handleStorageSet(eField, eValue, this.props.entryId)

        if (!this.props[eKeyPlural].includes(eValue)) {

            const oldState = this.props.oldState,
                  newTypesArray = this.props[eKeyPlural].concat(eValue)

// @TODO - Check for adding quotes, apostrophes, <>
        // Add 'Remove' for previous entries
        // Disable previous entries - set disabled CSS with no input borders
        // Add "TOTAL" based on calculation of all previous entries (+ reconciled)
        // Add "NetTotal" based on calc (- reconciled)
        // Add 'Export' option (just save the localStorage to a local JSON file)

            this.props.actions.updateStateField(eKeyPlural, newTypesArray)
            setStorageItem(localStorage, this.props.loggedInId, JSON.stringify({...oldState, [eKeyPlural]: newTypesArray}))
        }
    }
    handleChangeCheckbox = e => {
        this.handleStorageSet(e.target.name, e.target.checked ? true : false, e.target.getAttribute('data-id'))
    }
    showButton(id) {
        return <Button type="submit"><span>{id === 0 ? 'Add' : 'Edit'}</span></Button>
    }
    validateForm(form) {

        const errors = {},
              formatCurrency = /^(?:-)?\d+(?:\.\d{1,2})?$/,
              // formatDate = /^\d{4}[-]\d{2}[-]\d{2}$/,
              formatDateStripped = /^\d{8}$/,
              lengths = {
                description: this.state.descriptionLength,
                type: this.state.typeLength,
                category: this.state.categoryLength,
                notes: this.state.notesLength
              }
              // numberWhole = /^\d+$/

        // WHOLE NUMBER
            //  \d       match a digit...
            //  +        one or more times
        // CURRENCY
            //  \d       match a digit...
            //  +        one or more times
            //   (        begin group...
            //    ?:      but do not capture anything
            //    \.      match literal dot
            //    \d      match a digit...
            //    {1,2}   one or two times
            //   )        end group
            //  ?        make the entire group optional

            // success, warning, error, null

        this.setState({ formValid: null })

        let entryFieldText = '',
            errorReturn

        // I was going to extrapolate the {for} loop below into its own function or component or whatever it would be best as
        // But couldn't figure out how... thinking I will need to pass back an object (or two) allowing the {setState}s
        // Or calling them as HOF from here (the parent) - but that's a lot of HOF calls.
            // My beginning coding attempts... no idea which is the correct/best/most logical way to take this.
            // -----
            // import ValidationSwitch from './ValidationSwitch'
            // const
            // <ValidationSwitch key={key} val={val} form={form} />
            // errorReturn = this.validateCaseFn(val, key, lengths[key], entryFieldText, this.state.fieldRequired[key])
            // const { key, val, form } = this.props

        for (let [key, val] of Object.entries( JSON.parse(form) )) {
            switch (key) {
                case 'id':
                    // console.log('id', val, typeof(val))
                    if (typeof(val) !== 'number' || (typeof(val) === 'number' && val < 0)) {
                        errors[key] = '[' + key + '] should be a Whole Number'
                        this.setState({ formValid: 'error' })
                        this.setState({ idValid: 'error' })
                        this.setState({ idError: errors[key] })
                    } else {
                        this.setState({ idValid: null })
                        this.setState({ idError: '' })
                    }
                    break
                case 'amount':
                    // console.log('amount', val, typeof(val), !isNaN(val))
                    if (!isNaN(val) && typeof(val) === 'string' && val.length > 0) {
                        if (val.match(formatCurrency)) {
                            this.setState({ amountValid: null })
                            this.setState({ amountError: '' })
                        } else {
                            errors[key] = '[' + key + '] should exist and be a 0-, 1-, or 2-digit decimal'
                            this.setState({ formValid: 'error' })
                            this.setState({ amountValid: 'error' })
                            this.setState({ amountError: errors[key] })
                        }
                    } else {
                        errors[key] = '[' + key + '] should be a populated String'
                        this.setState({ formValid: 'error' })
                        this.setState({ amountValid: 'error' })
                        this.setState({ amountError: errors[key] })
                    }
                    break
                case 'date':
                    if (typeof(val) === 'string' && val.length === 8 && val.match(formatDateStripped)) {
                        // This should be validated further where:
                            // yyyy should be a number between 1900 and 9999
                            // mm   should be a 2-digit string (number) and should represent a float from 1-12
                            // dd   should be a 2-digit string (number) and should represent a float from 1-31
                        this.setState({ dateValid: null })
                        this.setState({ dateError: '' })
                    } else {
                        errors[key] = 'The [' + key + '] field should be an 8-digit number representing yyyymmdd'
                        this.setState({ formValid: 'error' })
                        this.setState({ dateValid: 'error' })
                        this.setState({ dateError: errors[key] })
                    }
                    break
                case 'description':
                    entryFieldText = 'description'
                    errorReturn = this.validateCaseFn(val, key, lengths[key], entryFieldText, this.state.fieldRequired[key])
                    if (errorReturn.length > 0) { errors[key] = errorReturn }
                    break
                case 'type':
                    entryFieldText = 'type'
                    errorReturn = this.validateCaseFn(val, key, lengths[key], entryFieldText, this.state.fieldRequired[key])
                    if (errorReturn.length > 0) { errors[key] = errorReturn }
                    break
                case 'category':
                    entryFieldText = 'category'
                    errorReturn = this.validateCaseFn(val, key, lengths[key], entryFieldText, this.state.fieldRequired[key])
                    if (errorReturn.length > 0) { errors[key] = errorReturn }
                    break
                case 'notes':
                    entryFieldText = 'notes'
                    errorReturn = this.validateCaseFn(val, key, lengths[key], entryFieldText, this.state.fieldRequired[key])
                    if (errorReturn.length > 0) { errors[key] = errorReturn }
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
    validateCaseFn(val, key, maxKeyLength, entryText, fieldRequired) {
        const entryValid = entryText + 'Valid',
              entryError = entryText + 'Error'

        let errorReturn = ''

        if (typeof(val) === 'string' && val.length > 0 && val.length <= maxKeyLength) {
            this.setState({ [entryValid]: null })
            this.setState({ [entryError]: '' })
        } else if (fieldRequired) {
            errorReturn = '[' + key + '] should contain no more than ' + maxKeyLength + ' characters.'
            this.setState({ formValid: 'error' })
            this.setState({ [entryValid]: 'error' })
            this.setState({ [entryError]: errorReturn })
        }

        return errorReturn
    }
    handleSubmit(e) {
        e.preventDefault()

        // Validate Form
        const whichForm = parseFloat(e.target.getAttribute('data-id').substr(5)),       // [form-0] 0 == New entry | >0 == Existing entry
              whichState = (whichForm > 0) ? 'entryExist' : 'entry',                    // sessionStorage
              formVal = this.validateForm( getStorageItem(sessionStorage, whichState) ) // true|false

        if (formVal) {
            if (whichForm === 0) {

                console.log('ADD submitted', getStorageItem(sessionStorage, 'entry'))

                const oldState = this.props.oldState,
                      newRegistryEntry = JSON.parse(getStorageItem(sessionStorage, 'entry')),
                      oldRegistry = this.props.registry

                let newRegistry;

                      newRegistry = oldRegistry.concat([newRegistryEntry])

                    // if (parseFloat(eid) === 0) { // 0 = Current (New) Entry
                    //     whichStorage = 'entry',
                    //     whichState = 'currentEntry'
                    // if (parseFloat(eid) > 0) {   // >0 = Existing Entry
                    //     whichStorage = 'entryExist'
                    //     whichState = 'existingEntry'

                this.props.actions.addToStateArray('registry', newRegistryEntry) // newRegistryEntry = {}
                setStorageItem(localStorage, this.props.loggedInId, JSON.stringify({...oldState, registry: newRegistry }))

            } else {
                console.log('EDIT submitted', getStorageItem(sessionStorage, 'entryExist'))
            }
        } else {
            console.log('errors were found - do NOTHING')
        }
    }
    handleChangeDate(newDate) {
        this.handleStorageSet('date', newDate, this.props.entry.id)
    }
    countDays = () => {
        const monthSelect = parseFloat(this.props.entry.date.substr(4, 2)),
              month = this.state.months[parseFloat(monthSelect)-1],
              yearSelect = parseFloat(this.props.entry.date.substr(0, 4))

        let dayNum

        if(month === 'Jan' | month === 'Mar' | month === 'May' | month === 'Jul' | month === 'Aug' | month === 'Oct' | month === 'Dec') {
            dayNum = 31
        } else if(month === 'Apr' | month === 'Jun' | month === 'Sep' | month === 'Nov') {
            dayNum = 30
        } else {
            (yearSelect - 2016) % 4 === 0 ? dayNum = 29 : dayNum = 28
        }
        return dayNum
    }
    populateDays = () => {
        return Array.from(Array(this.countDays()), (e,i)=>i+1)
    }
    closeTypes(e) {
        this.refs.overTypes.hide()
        this.refs.overCats.hide()
        this.setState({ showModal: false })
    }
    deleteListItem(e) {
        // item = selected list item (types or categorys)
        // list = Array listing of 'types' and 'categorys'

        const { item, list } = e,
              entryListItem = list.substr(0, list.length-1),
              currentListItem = this.props.entry[entryListItem],
              eid = this.props.entry.id

        if (this.props[list].includes(item)) {

            const newTypesArray = this.props[list].filter( listItem => listItem !== item )

            if (currentListItem.toLowerCase() === item.toLowerCase()) {
                const firstListItem = newTypesArray[0]
                console.log('[remove from entry]', entryListItem, firstListItem, eid)
                this.handleStorageSet(entryListItem, firstListItem, eid) // entryListItem: 'type'|'category' // Deposit // 0|[nnn]
            }
            this.props.actions.inputTyping(list, newTypesArray)
            setStorageItem(localStorage, this.props.loggedInId, JSON.stringify({...this.props.oldState, [list]: newTypesArray}))
        }
    }
    render() {
        const propsObj = {
            'data-id': this.props.entry.id,
            required: true
        }
        const showTypesClick = (
            <Popover id="popover-trigger-click">
                <Table striped hover>
                    <thead>
                        <tr>
                            <th className="list-title">Transaction Types</th>
                            <th className="list-title"><Button bsStyle="primary" bsSize="xsmall" autoFocus={true} onClick={this.closeTypes} className={"pull-right"}>Close</Button></th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.types.map( (item, idx) => <RegisterList key={idx} deleteListItem={this.deleteListItem} listItem={item} listList="types" /> ) }
                    </tbody>
                </Table>
            </Popover>
        )
        const typesButton = (
            <OverlayTrigger ref="overTypes" onHide={this.close} rootClose={true} trigger="click" placement="right" overlay={showTypesClick}>
                <Button disabled={!this.props.yieldRouteHistoryBlock}><Glyphicon glyph="th-list" /></Button>
            </OverlayTrigger>
        )
        const showCatsClick = (
            <Popover id="popover-trigger-click">
                <Table striped hover>
                    <thead>
                        <tr>
                            <th className="list-title">Categories</th>
                            <th className="list-title"><Button bsStyle="primary" bsSize="xsmall" autoFocus={true} onClick={this.closeTypes} className={"pull-right"}>Close</Button></th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.categorys.map( (item, idx) => <RegisterList key={idx} deleteListItem={this.deleteListItem} listItem={item} listList="categorys" /> ) }
                    </tbody>
                </Table>
            </Popover>
        )
        const catsButton = (
            <OverlayTrigger ref="overCats" onHide={this.close} rootClose={true} trigger="click" placement="left" overlay={showCatsClick}>
                <Button disabled={!this.props.yieldRouteHistoryBlock}><Glyphicon glyph="th-list" /></Button>
            </OverlayTrigger>
        )
        // console.log('[this.state.fieldRequired]', typeof(this.state.fieldRequired['date']), this.state.fieldRequired['date'])
        return (
            <div className={!this.props.yieldRouteHistoryBlock ? "entry-previous" : "entry-current"}>
                <Form onSubmit={this.handleSubmit.bind(this)} data-id={'form-' + this.props.entry.id} inline>
                    <Row className="show-grid">
                        <Col className="field-col" xs={6} sm={3}>
                            <DateInput
                                entryId={this.props.entry.id}
                                showInputDate={this.state.showInputDate}
                                handleChangeDate={this.handleChangeDate.bind(this)}
                                months={this.state.months}
                                date={this.props.entry.date}
                                days={this.populateDays()}
                                daySelect={this.props.entry.date.substr(6, 2)}
                                monthSelect={this.props.entry.date.substr(4, 2)}
                                yearSelect={this.props.entry.date.substr(0, 4)}
                                fullDateYearLeft={this.props.entry.date.substr(0, 4) + '-' + this.props.entry.date.substr(4, 2) + '-' + this.props.entry.date.substr(6, 2)}
                                isDateRequired={this.state.fieldRequired['date']}
                                isDateDisabled={!this.props.yieldRouteHistoryBlock}
                            />
                        </Col>
                        <Col className="field-col" xs={6} smPush={7} sm={2}>
                            <FormGroup
                                controlId={'field-amount-' + this.props.entry.id}
                                validationState={this.state.amountValid}
                            >
                                <ControlLabel srOnly={!this.props.yieldRouteHistoryBlock} bsClass="field-label"><span>Amount:</span></ControlLabel>
                                <span className="amount">
                                    { /*
                                        The input type 'number' entry cannot show padded decimals (e.g., 1.00) although data is stored as: '1.00'
                                        I would either:
                                            1) live without the decimal 0 padding, or
                                            2) Just use a text field and live without the number spinner
                                        A potential compromise (conditionally swap input type to 'text')
                                        https://stackoverflow.com/questions/7790561/how-can-i-make-the-html5-number-field-display-trailing-zeroes
                                    */ }
                                    <FormControl
                                        {...propsObj}
                                        disabled={!this.props.yieldRouteHistoryBlock}
                                        required={this.state.fieldRequired['amount']}
                                        type="number"
                                        name="amount"
                                        step="0.01"
                                        onChange={this.handleChange.bind(this)}
                                        value={this.props.entry.amount}
                                    />
                                </span>
                                <FormControl.Feedback />
                                {this.state.amountValid && <HelpBlock>{this.state.amountError}</HelpBlock>}
                            </FormGroup>
                        </Col>
                        <Col className="field-col" xs={12} smPull={2} sm={7}>
                            <FormGroup
                                controlId={'field-description-' + this.props.entry.id}
                                validationState={this.state.descriptionValid}
                            >
                                <ControlLabel srOnly={!this.props.yieldRouteHistoryBlock} bsClass="field-label"><span>Description:</span></ControlLabel>
                                <FormControl
                                    type="text"
                                    name="description"
                                    {...propsObj}
                                    disabled={!this.props.yieldRouteHistoryBlock}
                                    required={this.state.fieldRequired['description']}
                                    onChange={this.handleChange.bind(this)}
                                    value={this.props.entry.description}
                                    placeholder="Enter text"
                                />
                                <FormControl.Feedback />
                                {this.state.descriptionValid && <HelpBlock>{this.state.descriptionError}</HelpBlock>}
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className="show-grid clearfix">
                        <Col className="field-col" xs={6} sm={3}>
                            <FormGroup
                                controlId={'field-type-' + this.props.entry.id}
                                validationState={this.state.typeValid}
                            >
                                <ControlLabel srOnly={!this.props.yieldRouteHistoryBlock} bsClass="field-label"><span>Type:</span></ControlLabel>
                                <Autosuggest
                                    datalist={this.props.types}
                                    onBlur={this.handleChangeTypeaheadType.bind(this)}
                                    value={this.props.entry.type}
                                    name={"type-" + this.props.entry.id}
                                    placeholder="TX Type..."
                                    disabled={!this.props.yieldRouteHistoryBlock}
                                    required={this.state.fieldRequired['type']}
                                    buttonAfter={typesButton}
                                />
                                <FormControl.Feedback className="autosuggest" />
                                {this.state.typeValid && <HelpBlock>{this.state.typeError}</HelpBlock>}
                            </FormGroup>
                        </Col>
                        <Col className="field-col" xs={6} sm={4}>
                            <FormGroup
                                controlId={'field-category-' + this.props.entry.id}
                                validationState={this.state.categoryValid}
                            >
                                <ControlLabel srOnly={!this.props.yieldRouteHistoryBlock} bsClass="field-label"><span>Category:</span></ControlLabel>
                                <Autosuggest
                                    datalist={this.props.categorys}
                                    onBlur={this.handleChangeTypeaheadCat.bind(this)}
                                    value={this.props.entry.category}
                                    name={"category-" + this.props.entry.id}
                                    placeholder="Category..."
                                    disabled={!this.props.yieldRouteHistoryBlock}
                                    required={this.state.fieldRequired['category']}
                                    buttonAfter={catsButton}
                                />
                                <FormControl.Feedback className="autosuggest" />
                                {this.state.categoryValid && <HelpBlock>{this.state.categoryError}</HelpBlock>}
                            </FormGroup>
                        </Col>
                        <Col className="field-col" xs={11} sm={4}>
                            <FormGroup
                                controlId={'field-notes-' + this.props.entry.id}
                                validationState={this.state.notesValid}
                            >
                                <ControlLabel srOnly={!this.props.yieldRouteHistoryBlock} bsClass="field-label"><span>Memo:</span></ControlLabel>
                                <FormControl
                                    type="text"
                                    name="notes"
                                    {...propsObj}
                                    disabled={!this.props.yieldRouteHistoryBlock}
                                    required={this.state.fieldRequired['notes']}
                                    onChange={this.handleChange.bind(this)}
                                    value={this.props.entry.notes}
                                    placeholder={!this.props.yieldRouteHistoryBlock ? '' : 'Memo...'}
                                />
                                <FormControl.Feedback />
                                {this.state.notesValid && <HelpBlock>{this.state.notesError}</HelpBlock>}
                            </FormGroup>
                        </Col>
                        <Col className="field-col" xs={1} sm={1}>
                            <ControlLabel htmlFor={'recond-' + this.props.entry.id} srOnly={!this.props.yieldRouteHistoryBlock}><span>Recon'd:</span></ControlLabel>
                                <input
                                    {...propsObj}
                                    id={'recond-' + this.props.entry.id}
                                    name="reconciled"
                                    onChange={this.handleChangeCheckbox.bind(this)}
                                    type="checkbox"
                                    checked={this.props.entry.reconciled}
                                    disabled={!this.props.yieldRouteHistoryBlock}
                                    required={this.state.fieldRequired['reconciled']}
                                />
                        </Col>
                    </Row>
                    <Row className="show-grid clearfix">
                        <Col xs={12} className="text-right">
                            <input type="hidden" value={this.props.entry.id} name="entry-id" required />
                            <Button type="submit" disabled={!this.props.yieldRouteHistoryBlock}>Add</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    // console.log('state', state)
    // console.log('state.registry', typeof(state.registry), state.registry)
    return {
        oldState: state,
        loggedInId: state.loggedInId,
        types: state.types,
        categorys: state.categorys,
        registry: state.registry
    }
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(ACTIONS, dispatch)
    }
}

const RegisterEntryFilled = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterEntryFilledContainer))

export default RegisterEntryFilled
