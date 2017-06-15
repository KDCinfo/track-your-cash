/*
    React Component - Form: Checking Register Entry Form

    New and Existing entries:
        [New]       eid === 0
        [Existing]  eid > 0

        // Entry Date | Trans Type | Entry Description | -(Entry Amount) | Existing:  [Edit]  | [Cancel]
        // Category   | Notes                          | Reconciled      | Existing: [Delete] |  [Save]
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

import { Row, Col, Form, FormGroup, ControlLabel, FormControl,
         Button, Table, HelpBlock, Popover, OverlayTrigger, Glyphicon } from 'react-bootstrap'

import * as ACTIONS from '../store/actions'

import { formatFixed2, getStorageItem, setStorageItem, deleteStorageItem } from '../store/functions'

import { newCurrentEntry } from '../store/initial-state'

class RegisterEntryFilledContainer extends React.Component {
    constructor(props) {
        super(props)

        // Test whether a native date input falls back to a text input (i.e., native date input is not supported)
        //
            let testType = document.createElement('input'),
                showInputDate
            testType.type = 'date'
            showInputDate = testType.type === 'text' ? false : true

        // Set page exit warning if a 'previous entry' has been modified
        // User is prompted with an alert asking if the would like to cancel the edit, or stay on the page.
        //
            const setHistoryBlocker = this.props.yieldRouteHistoryBlock ? this.props.history.block((location, action) => {
                    if (getStorageItem(sessionStorage, 'entryExist')) {
                        return 'Are you sure you want to leave this page?'
                    }
                }) : () => undefined

        // Set each registry entry with its own state
        //
            this.state = {
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

                amountError: '',
                descriptionError: '',
                typeError: '',
                categoryError: '',
                notesError: '',

                amountValid: null,
                descriptionValid: null,
                typeValid: null,
                categoryValid: null,
                notesValid: null
            }

        // Bind component methods
        //
            this.validateForm = this.validateForm.bind(this)
            this.closeTypes = this.closeTypes.bind(this)
            this.deleteListItem = this.deleteListItem.bind(this)
            this.deleteEntry = this.deleteEntry.bind(this)
            this.editEntry = this.editEntry.bind(this)
            this.editEntryCancel = this.editEntryCancel.bind(this)
    }
    componentWillUnmount() {
        this.props.actions.clearFormExist()
        deleteStorageItem(sessionStorage, 'entryExist')
        this.state.unblock()
    }
    componentWillMount() {
        deleteStorageItem(sessionStorage, 'entryExist')
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
        this.handleStorageSet(whichField, newVal, this.props.entry.id)
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

        this.handleStorageSet(eField, eValue, this.props.entry.id)

        if (!this.props[eKeyPlural].includes(eValue)) {

            const oldState = this.props.oldState,
                  newTypesArray = this.props[eKeyPlural].concat(eValue)

            this.props.actions.updateStateField(eKeyPlural, newTypesArray)
            setStorageItem(localStorage, this.props.loggedInId, JSON.stringify({...oldState, [eKeyPlural]: newTypesArray}))
        }
    }
    handleChangeCheckbox = e => {
        this.handleStorageSet(e.target.name, e.target.checked ? true : false, this.props.entry.id)
    }
    showButton(id) {
        return <Button type="submit"><span>{id === 0 ? 'Add' : 'Edit'}</span></Button>
    }
    validateForm(form) {

        // @TODO: Abstract (to what? How?)

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

        let entryFieldText = '',
            errorReturn

        for (let [key, val] of Object.entries( form )) {
            switch (key) {
                case 'id':
                    // console.log('id', val, typeof(val))
                    if (typeof(val) !== 'number' || (typeof(val) === 'number' && val < 0)) {
                        errors[key] = '[' + key + '] should be a Whole Number'
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
                            this.setState({ amountValid: 'error' })
                            this.setState({ amountError: errors[key] })
                        }
                    } else {
                        errors[key] = '[' + key + '] should be a populated String'
                        this.setState({ amountValid: 'error' })
                        this.setState({ amountError: errors[key] })
                    }
                    break
                case 'date':
                    if (typeof(val) !== 'string' || val.length !== 8 || !val.match(formatDateStripped)) {
                        errors[key] = 'The [' + key + '] field should be an 8-digit number representing yyyymmdd'
                    } else {
                        // This should be validated further where:
                            // yyyy should be a number between 1900 and 9999
                            // mm   should be a 2-digit string (number) and should represent a float from 1-12
                            // dd   should be a 2-digit string (number) and should represent a float from 1-31
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
            this.setState({ [entryValid]: 'error' })
            this.setState({ [entryError]: errorReturn })
        }

        return errorReturn
    }
    getNextId = () => {
        let registryLength = this.props.registry.length,
            maxId
        if (registryLength > 1) {
            maxId = this.props.registry.reduce( (acc, cur) => (acc.id > cur.id) ? acc : cur ).id
        } else {
            maxId = registryLength
        }
        return maxId + 1
    }
    handleSubmit(e) {
        e.preventDefault()

            // if (parseFloat(eid) === 0) { // 0 = Current (New) Entry
            //     whichStorage = 'entry',
            //     whichState = 'currentEntry'

            // if (parseFloat(eid) > 0) {   // >0 = Existing Entry
            //     whichStorage = 'entryExist'
            //     whichState = 'existingEntry'

        // Validate Form
        const thisEntryId = this.props.entry.id,                        // 0 == New entry | >0 == Existing entry
              whichState = (thisEntryId > 0) ? 'entryExist' : 'entry',  // sessionStorage
              getEntry = getStorageItem(sessionStorage, whichState)     // get storage (if exists)

        if (getEntry) {
            const thisEntry = JSON.parse(getEntry)

            if (this.validateForm( thisEntry )) {
                if (thisEntryId === 0) {                                // New Entry

                    const nextId = this.getNextId(),
                          newRegistryEntry = JSON.parse(getStorageItem(sessionStorage, 'entry')),
                          newEntryIdUpdate = {...newRegistryEntry, id: nextId },
                          newRegistry = this.props.registry.concat([newEntryIdUpdate])

                    this.props.actions.addToStateArray('registry', newEntryIdUpdate)
                    setStorageItem(localStorage, this.props.loggedInId, JSON.stringify({...this.props.oldState, registry: newRegistry }))
                    setStorageItem(sessionStorage, 'entry', JSON.stringify( {...newRegistryEntry, ...newCurrentEntry} ))
                    this.props.actions.clearForm()

                    console.log('ADD submitted', thisEntry)

                } else {                                                // Existing Entry - Update Record
                    const newEntryIdUpdate = {...thisEntry, id: thisEntryId},
                          newRegistry = this.props.registry.map((entry, index) => {
                                if (entry.id === thisEntryId) {
                                    return Object.assign({}, entry, newEntryIdUpdate)
                                }
                                return entry
                            })

                    this.props.actions.updateRegistryEntry(newEntryIdUpdate)    // Update State: Redux
                                                                                // Update localStorage
                    setStorageItem(localStorage, this.props.loggedInId, JSON.stringify({...this.props.oldState, registry: newRegistry }))
                    this.props.actions.clearFormExist()                         // Clears state.existingEntry -- Not sure I'm using this
                    deleteStorageItem(sessionStorage, 'entryExist')             // Delete sessionStorage
                    this.editEntryCancel()                                      // Set editId:0 -- Should reset 'edit existing' form

                    console.log('EDIT submitted', thisEntry)
                }
            } else {
                console.log('Errors were found - Error states have been set - do NOTHING')
            }
        } else {
            console.log('Nothing was changed - Close Edits')
            this.editEntryCancel()
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
    deleteListItem(paramObj) {
        // item = selected list item (types or categorys)
        // list = Array listing of 'types' and 'categorys'

        const { item, list } = paramObj,
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
    deleteEntry(e) {
        console.log('[deleteEntry]', this.props.entry.id, e)
        this.props.deleteEntry({entryId: this.props.entry.id})
    }
    editEntry(e) {
        console.log('[editEntry]', this.props.entry.id, e)
        this.props.editEntry({entryId: this.props.entry.id})
    }
    editEntryCancel() {
        console.log('[editEntryCancel] No params')
        this.props.editEntryCancel()
    }
    render() {
        const propsObj = {
            'data-id': this.props.entry.id,
            required: true
        },
        isEdit = (this.props.yieldRouteHistoryBlock || (this.props.editId === this.props.entry.id)),
        entryExistEdit = getStorageItem(sessionStorage, 'entryExist'),
        entryEdit = entryExistEdit && (JSON.parse(entryExistEdit).id === this.props.entry.id) ? JSON.parse(entryExistEdit) : this.props.entry

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
                        { this.props.types.map( (item, idx) => <RegisterList key={idx} deleteListItem={this.props.actions.deleteListItem} listItem={item} listList="types" /> ) }
                    </tbody>
                </Table>
            </Popover>
        )
        const typesButton = (
            <OverlayTrigger ref="overTypes" onHide={this.close} rootClose={true} trigger="click" placement="right" overlay={showTypesClick}>
                <Button disabled={!isEdit}><Glyphicon glyph="th-list" /></Button>
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
                        { this.props.categorys.map( (item, idx) => <RegisterList key={idx} deleteListItem={this.props.actions.deleteListItem} listItem={item} listList="categorys" /> ) }
                    </tbody>
                </Table>
            </Popover>
        )
        const catsButton = (
            <OverlayTrigger ref="overCats" onHide={this.close} rootClose={true} trigger="click" placement="left" overlay={showCatsClick}>
                <Button disabled={!isEdit}><Glyphicon glyph="th-list" /></Button>
            </OverlayTrigger>
        )

        // col[nn] - If 'new entry' form, don't show extra column on end of <Row> for Edit/Delete buttons (only for previous entries)
        // [yieldRouteHistoryBlock] === 'new entry' form
        //
        const col67 = !this.props.yieldRouteHistoryBlock ? 6 : 7,
              col34 = !this.props.yieldRouteHistoryBlock ? 3 : 4,
              col56 = !this.props.yieldRouteHistoryBlock ? 5 : 6,
              col1012 = !this.props.yieldRouteHistoryBlock ? 10 : 12,
              colCurrentHidden = {
                xsHidden: this.props.yieldRouteHistoryBlock,
                smHidden: this.props.yieldRouteHistoryBlock,
                mdHidden: this.props.yieldRouteHistoryBlock,
                lgHidden: this.props.yieldRouteHistoryBlock
              },
              xsColConfig = {
                xsHidden: this.props.yieldRouteHistoryBlock || (!this.props.yieldRouteHistoryBlock && false),
                smHidden: this.props.yieldRouteHistoryBlock || (!this.props.yieldRouteHistoryBlock && true),
                mdHidden: this.props.yieldRouteHistoryBlock || (!this.props.yieldRouteHistoryBlock && true),
                lgHidden: this.props.yieldRouteHistoryBlock || (!this.props.yieldRouteHistoryBlock && true)
              },
              smColConfig = {
                xsHidden: this.props.yieldRouteHistoryBlock || (!this.props.yieldRouteHistoryBlock && true),
                smHidden: this.props.yieldRouteHistoryBlock || (!this.props.yieldRouteHistoryBlock && false),
                mdHidden: this.props.yieldRouteHistoryBlock || (!this.props.yieldRouteHistoryBlock && false),
                lgHidden: this.props.yieldRouteHistoryBlock || (!this.props.yieldRouteHistoryBlock && false)
              }

        return (
            <div className={!this.props.yieldRouteHistoryBlock ? "entry-previous" : "entry-current"}>
                <Form onSubmit={this.handleSubmit.bind(this)} data-id={'form-' + entryEdit.id} inline>
                    <Row className={`show-grid ${!isEdit && 'dotted-bottom'}`}>
                        <Col className="field-col" xs={col56} sm={3}>
                            <DateInput
                                focusNew={(this.props.editId === this.props.entry.id)}
                                entryId={entryEdit.id}
                                showInputDate={this.state.showInputDate}
                                handleChangeDate={this.handleChangeDate.bind(this)}
                                months={this.state.months}
                                date={entryEdit.date}
                                days={this.populateDays()}
                                daySelect={entryEdit.date.substr(6, 2)}
                                monthSelect={entryEdit.date.substr(4, 2)}
                                yearSelect={entryEdit.date.substr(0, 4)}
                                fullDateYearLeft={entryEdit.date.substr(0, 4) + '-' + entryEdit.date.substr(4, 2) + '-' + entryEdit.date.substr(6, 2)}
                                isDateRequired={this.state.fieldRequired['date']}
                                isDateDisabled={!isEdit}
                            />
                        </Col>
                        <Col className="field-col" xs={col56} smPush={col67} sm={2}>
                            <FormGroup
                                controlId={'field-amount-' + entryEdit.id}
                                validationState={this.state.amountValid}
                            >
                                <ControlLabel srOnly={!isEdit} bsClass="field-label"><span>Amount:</span></ControlLabel>
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
                                        disabled={!isEdit}
                                        required={this.state.fieldRequired['amount']}
                                        type="number"
                                        name="amount"
                                        step="0.01"
                                        onChange={this.handleChange.bind(this)}
                                        value={entryEdit.amount}
                                    />
                                </span>
                                <FormControl.Feedback />
                                {this.state.amountValid && <HelpBlock>{this.state.amountError}</HelpBlock>}
                            </FormGroup>
                        </Col>
                        <Col className="entryButtons" xs={2} sm={0} {...colCurrentHidden} {...xsColConfig}>
                            <Button className={isEdit ? 'hide' : 'button-edit'} bsSize="small" onClick={this.editEntry}>Edit</Button>
                            <span><br/><Button className={isEdit ? 'button-cancel' : 'hide'} bsSize="xsmall" onClick={this.editEntryCancel}>Cancel</Button></span>
                        </Col>
                        <Col className="field-col" xs={col1012} smPull={2} sm={col67}>
                            <FormGroup
                                controlId={'field-description-' + entryEdit.id}
                                validationState={this.state.descriptionValid}
                            >
                                <ControlLabel srOnly={!isEdit} bsClass="field-label"><span>Description:</span></ControlLabel>
                                <FormControl
                                    type="text"
                                    name="description"
                                    {...propsObj}
                                    disabled={!isEdit}
                                    required={this.state.fieldRequired['description']}
                                    onChange={this.handleChange.bind(this)}
                                    value={entryEdit.description}
                                    placeholder="Enter text"
                                />
                                <FormControl.Feedback />
                                {this.state.descriptionValid && <HelpBlock>{this.state.descriptionError}</HelpBlock>}
                            </FormGroup>
                        </Col>
                        <Col className="entryButtons" xs={0} sm={1} {...colCurrentHidden} {...smColConfig}>
                            <Button className={isEdit ? 'hide' : 'button-edit'} bsSize="small" onClick={this.editEntry}>Edit</Button>
                            <span><br/><Button className={isEdit ? 'button-cancel' : 'hide'} bsSize="xsmall" onClick={this.editEntryCancel}>Cancel</Button></span>
                        </Col>
                        <Col className="entryButtons" xs={2} sm={0} {...colCurrentHidden} {...xsColConfig}>
                            <Button className={isEdit ? 'hide' : 'button-remove'} bsSize="xsmall" onClick={this.deleteEntry}><Glyphicon glyph="remove" /></Button>
                            <Button className={isEdit ? 'btn btn-primary button-save' : 'hide'} bsSize="small" type="submit">Save</Button>
                        </Col>
                    </Row>
                    <Row className="show-grid clearfix">
                        <Col className="field-col" xs={6} sm={3}>
                            <FormGroup
                                controlId={'field-type-' + entryEdit.id}
                                validationState={this.state.typeValid}
                            >
                                <ControlLabel srOnly={!isEdit} bsClass="field-label"><span>Type:</span></ControlLabel>
                                <Autosuggest
                                    datalist={this.props.types}
                                    onBlur={this.handleChangeTypeaheadType.bind(this)}
                                    value={entryEdit.type}
                                    name={"type-" + entryEdit.id}
                                    placeholder="TX Type..."
                                    disabled={!isEdit}
                                    required={this.state.fieldRequired['type']}
                                    buttonAfter={typesButton}
                                />
                                <FormControl.Feedback className="autosuggest" />
                                {this.state.typeValid && <HelpBlock>{this.state.typeError}</HelpBlock>}
                            </FormGroup>
                        </Col>
                        <Col className="field-col" xs={6} sm={4}>
                            <FormGroup
                                controlId={'field-category-' + entryEdit.id}
                                validationState={this.state.categoryValid}
                            >
                                <ControlLabel srOnly={!isEdit} bsClass="field-label"><span>Category:</span></ControlLabel>
                                <Autosuggest
                                    datalist={this.props.categorys}
                                    onBlur={this.handleChangeTypeaheadCat.bind(this)}
                                    value={entryEdit.category}
                                    name={"category-" + entryEdit.id}
                                    placeholder="Category..."
                                    disabled={!isEdit}
                                    required={this.state.fieldRequired['category']}
                                    buttonAfter={catsButton}
                                />
                                <FormControl.Feedback className="autosuggest" />
                                {this.state.categoryValid && <HelpBlock>{this.state.categoryError}</HelpBlock>}
                            </FormGroup>
                        </Col>
                        <Col className="field-col" xs={10} sm={col34}>
                            <FormGroup
                                controlId={'field-notes-' + entryEdit.id}
                                validationState={this.state.notesValid}
                            >
                                <ControlLabel srOnly={!isEdit} bsClass="field-label"><span>Memo:</span></ControlLabel>
                                <FormControl
                                    type="text"
                                    name="notes"
                                    {...propsObj}
                                    disabled={!isEdit}
                                    required={this.state.fieldRequired['notes']}
                                    onChange={this.handleChange.bind(this)}
                                    value={entryEdit.notes}
                                    placeholder={!this.props.yieldRouteHistoryBlock ? '' : 'Memo...'}
                                />
                                <FormControl.Feedback />
                                {this.state.notesValid && <HelpBlock>{this.state.notesError}</HelpBlock>}
                            </FormGroup>
                        </Col>
                        <Col className="field-col text-center" xs={2} sm={1}>
                            <ControlLabel htmlFor={'recond-' + entryEdit.id} srOnly={!isEdit}><span>Recon'd:</span></ControlLabel>
                                <input
                                    {...propsObj}
                                    id={'recond-' + entryEdit.id}
                                    name="reconciled"
                                    onChange={this.handleChangeCheckbox.bind(this)}
                                    type="checkbox"
                                    checked={entryEdit.reconciled}
                                    disabled={!isEdit}
                                    required={this.state.fieldRequired['reconciled']}
                                />
                        </Col>
                        <Col className="entryButtons" xs={0} sm={1} {...colCurrentHidden} {...smColConfig}>
                            <Button className={isEdit ? 'hide' : 'button-remove'} bsSize="xsmall" onClick={this.deleteEntry}><Glyphicon glyph="remove" /></Button>
                            <Button className={isEdit ? 'btn btn-primary button-save' : 'hide'} bsSize="small" type="submit">Save</Button>
                        </Col>
                    </Row>
                    <Row className="show-grid clearfix">
                        <Col xs={12} className="text-right">
                            <input type="hidden" value={entryEdit.id} name="entry-id" required />
                            <Button type="submit" disabled={!this.props.yieldRouteHistoryBlock}>Add</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
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