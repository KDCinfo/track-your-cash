import React from "react"

class RegisterList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            deleteTypeItem: {
                item: this.props.listItem,
                list: this.props.listList
            }
        }
        this.returnDeleteType = this.returnDeleteType.bind(this)
    }
    returnDeleteType(e) {
        e.preventDefault()
        this.props.deleteListItem(this.state.deleteTypeItem)
    }
    render() {
        return (
            <tr>
                <td className="align-right">{ this.props.listItem }</td>
                <td><button name={'register-list-' + this.props.listItem} onClick={this.returnDeleteType}>Delete</button></td>
            </tr>
        )
    }
}

export default RegisterList