import { Node } from '../editor/node'

export default class PageBuilderNode extends Node {
    static defaultProps = {
        classes: []
    }

    addClass(className) {
        if(!this.classes.includes(className)) this.props.classes.push(className)
    }

    removeClass(className) {
        this.props.classes = this.classes.filter(name => name !== className)
    }

    get classes () {
        return this.props.classes
    }
}