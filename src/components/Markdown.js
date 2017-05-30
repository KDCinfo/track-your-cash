import React from 'react'

// https://github.com/InsidersByte/react-markdown-renderer
import MarkdownRenderer from 'react-markdown-renderer'

class Markdown extends React.Component {
    render() {
        const markLocal = `
The below is markdown \`import\`ed from a local JavaScript file inside the root container component,
passed down as a prop to a custom <Markdown> component,
processed using [react-markdown-renderer](https://github.com/InsidersByte/react-markdown-renderer) as \`<MarkdownRenderer markdown={this.props.myMark} />\`
whose properly escaped \`ES6 Template Literal\` is returned and assigned to a variable (in the root container component) which is then passed into a <Route> using [React Router v4](https://reacttraining.com/react-router/)`
        return (
            <div className='divMark'>
                <div className='well well-xs'><cite><MarkdownRenderer markdown={markLocal} /></cite></div>
                <MarkdownRenderer markdown={this.props.myMark} />
            </div>
        )
    }
}

export default Markdown