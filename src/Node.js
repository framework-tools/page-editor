function createPropStructure(props = {}){
    return {
        classes: [],
        ...props
    }
}


export class Node {
    constructor(json){
        this.type = json.type
        this.props = createPropStructure(json.props)
        this.attrs = json.attrs || {}
        this.children = new Fragment(...(json.children || []).map(json => schema[json.type].fromJSON(json)))
    }

    get tag () {
        return this.type
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

    static fromJSON(json){
        return new this(json)
    }

    subscribe(callback) {
        let i = this.subscibers.length
        this.subscribers.push(callback)

        return () => this.subscibers.splice(i, 1)
    }
}

export class Image extends Node {
    updateSrc(src) {
        this.attrs.src = src
    }
}

export class Fragment extends Array {
    get isEmpty () {
        return this.length === 0
    }
}

export class Doc extends Node {
    get tag () {
        return 'div'
    }
}

// export class Paragraph extends Node {
//     get tag () {
//         return 'p'
//     }
// }

export class Block extends Node {
    get name() {
        return this.allowedTags[this.tag]
    }

    get tag () {
        return this.props.tag
    }

    allowedTags = {
        'div': 'Div',
        'heading': 'Heading',
        'header': 'Header',
        'p': 'Paragraph',
        'span': 'Span',
        'footer': 'Footer'
    }
}

export class Heading extends Block {
    get name() {
        return 'Heading'
    }

    get level () {
        return this.props.level ?? 2
    }

    get tag () {
        return 'h' + this.level
    }
}

export class Text extends Node {
    constructor(json){
        super(json)

        this.text = json.text
    }
}

let schema = {
    block: Block,
    img: Image,
    heading: Heading,
    doc: Doc,
    text: Text
}