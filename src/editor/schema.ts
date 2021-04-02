import { Node, TextNode, NodeSpec } from './node'
import { Fragment, FragmentType } from './fragment'
import { ContentMatch } from './contentmatch'

class Property {
    hasDefault: any
    default: any

    constructor(value) {
        this.hasDefault = value !== undefined
        this.default = value
    }

    get isRequired() {
        return !this.hasDefault
    }
}

function computeProps(props, value) {
    let built = {}
    
    for (let name in props) {
        let given = value && value[name]
        if (given === undefined) {
            let prop = props[name]
            if (prop.hasDefault) given = prop.default
            else throw new RangeError("No value supplied for property " + name)
        }

        built[name] = given
    }
    return built
}

function initProps(props) {
    let result: { [key: string]: Property } = {}
    if (props) for (let name in props) result[name] = new Property(props[name])
    return result
}

export class NodeType {
    name: string
    schema: Schema
    node: typeof Node
    spec: NodeSpec
    groups: string[]
    props: { [key: string]: Property }
    defaultProps: any
    contentMatch: ContentMatch
    inlineContent: boolean
    isBlock: boolean
    isText: boolean

    constructor(schema: Schema, node: typeof Node) {
        // :: string
        // The name the node type has in this schema.
        this.spec = node.spec
        this.name = this.spec.name
        // :: Schema
        // A link back to the `Schema` the node type belongs to.
        this.schema = schema

        this.node = node

        this.groups = this.spec.groups || []
        this.props = initProps(this.spec.props)

        this.defaultProps = this.props

        // :: bool
        // True if this is a block type
        this.isBlock = !(this.spec.inline || this.name == "Text")

        // :: bool
        // True if this is the text node type.
        this.isText = this.name == "Text"
    }

    // :: bool
    // True if this is an inline type.
    get isInline() { return !this.isBlock }

    // :: bool
    // True if this is a textblock type, a block that contains inline
    // content.
    get isTextblock() { return this.isBlock && this.inlineContent }

    // :: bool
    // True for node types that allow no content.
    get isLeaf() { return this.contentMatch == ContentMatch.empty }

    // :: bool
    // True when this node is an atom, i.e. when it does not have
    // directly editable content.
    get isAtom() { return this.isLeaf || this.spec.atom }

    // :: () → bool
    // Tells you whether this node type has any required attributes.
    hasRequiredProps() {
        for (let n in this.props) if (this.props[n].isRequired) return true
        return false
    }

    compatibleContent(other) {
        return this == other || this.contentMatch.compatible(other.contentMatch)
    }

    computeProps(props) {
        if (!props && this.defaultProps) return this.defaultProps
        else return computeProps(this.props, props)
    }

    // :: (?Object, ?union<Fragment, Node, [Node]>, ?[Mark]) → Node
    // Create a `Node` of this type. The given attributes are
    // checked and defaulted (you can pass `null` to use the type's
    // defaults entirely, if no required attributes exist). `content`
    // may be a `Fragment`, a node, an array of nodes, or
    // `null`. Similarly `marks` may be `null` to default to the empty
    // set of marks.
    create(props: any, content: FragmentType) {
        if (this.isText) throw new Error("NodeType.create can't construct text nodes")
        return new this.node(this, this.computeProps(props), Fragment.createFragment(content))
    }

    // :: (?Object, ?union<Fragment, Node, [Node]>, ?[Mark]) → Node
    // Like [`create`](#model.NodeType.create), but check the given content
    // against the node type's content restrictions, and throw an error
    // if it doesn't match.
    createChecked(props, content, marks) {
        content = Fragment.from(content)
        if (!this.validContent(content))
            throw new RangeError("Invalid content for node " + this.name)
        return new this.node(this, this.computeProps(props), content)
    }

    // :: (?Object, ?union<Fragment, Node, [Node]>, ?[Mark]) → ?Node
    // Like [`create`](#model.NodeType.create), but see if it is necessary to
    // add nodes to the start or end of the given fragment to make it
    // fit the node. If no fitting wrapping can be found, return null.
    // Note that, due to the fact that required nodes can always be
    // created, this will always succeed if you pass null or
    // `Fragment.empty` as content.
    createAndFill(props, content, marks) {
        props = this.computeProps(props)
        content = Fragment.from(content)
        if (content.size) {
            let before = this.contentMatch.fillBefore(content)
            if (!before) return null
            content = before.append(content)
        }
        let after = this.contentMatch.matchFragment(content).fillBefore(new Fragment(), true)
        if (!after) return null
        return new this.node(this, props, content.append(after))
    }

    // :: (Fragment) → bool
    // Returns true if the given fragment is valid content for this node
    // type with the given attributes.
    validContent(content) {
        let result = this.contentMatch.matchFragment(content)
        if (!result || !result.validEnd) return false
        return true
    }


    static compile(nodes: typeof Node[], schema: Schema) {
        let result = Object.create(null)
        nodes.map(node => result[node.spec.name] = new NodeType(schema, node))

        if (!result[schema.topNodeType]) throw new RangeError("Schema is missing its top node type ('" + schema.topNodeType + "')")
        if (!result.Text) throw new RangeError("Every schema needs a 'Text' type")
        for (let _ in result.Text.props) throw new RangeError("The 'Text' node type should not have properties")

        return result
    }
}

export class Schema {
    nodes: { [key: string]: NodeType }
    topNodeType: string

    constructor(spec: { nodes: typeof Node[], topNodeType?: string }) {

        this.topNodeType = spec.topNodeType || 'Doc'
        this.nodes = NodeType.compile(spec.nodes, this)

        let contentExprCache = {}
        for (let prop in this.nodes) {
            let type = this.nodes[prop]
            let contentExpr = type.spec.content || ""
            type.contentMatch = contentExprCache[contentExpr] ||
                (contentExprCache[contentExpr] = ContentMatch.parse(contentExpr, this.nodes))
            type.inlineContent = type.contentMatch.inlineContent
        }

        this.nodeFromJSON = this.nodeFromJSON.bind(this)
    }

    text(text: string) {
        return new TextNode(this.nodes.Text, text)
    }

    node(type: string, props: any, children: FragmentType) {
        let node = this.nodes[type]

        return node.create(props, children)
    }

    nodeFromJSON(json) {
        if (json.type === 'Text') {
            if (typeof json.text !== 'string') throw new Error('Invalid text node in JSON')
            return this.text(json.text)
        }

        if(!this.nodes[json.type]) throw new Error('No schema for node type: ' + json.type)

        return this.nodes[json.type].node.fromJSON(this, json)
    }
}
