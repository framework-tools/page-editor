import Block from '../utils/Block'

export default class DynamicBlock extends Block {
    static spec = {
        ...Block.spec,
        props: {
            ...Block.defaultProps,
            tag: 'div'
        }
    }

    get name () {
        let names = {
            'div': 'Div',
            'header': 'Header',
            'footer': 'Footer',
            'p': 'Paragraph'
        }

        return names[this.tag]
    }

    get tag () {
        return this.props.tag
    }
}