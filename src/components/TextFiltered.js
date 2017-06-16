import React from 'react'

class TextFiltered extends React.Component {
    render() {
        return (
            <div>
                <div className={this.props.filterText.length > 0 ? 'text-filtered' : 'hide'}>Filtered: { this.props.showTotalFiltered() }</div>
                &nbsp;&nbsp;
                <div className="text-cleared">Cleared: { this.props.showTotalReconciled() }</div>
                &nbsp;&nbsp;
                <div className="text-total">Total: { this.props.showTotalAll() }</div>
            </div>
        )
    }
}

export default TextFiltered