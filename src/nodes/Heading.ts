import Block from '../utils/Block'

export default class Heading extends Block {
    static spec = {
        ...Block.spec,
        name: 'Heading',
        props: {
            ...Block.defaultProps,
            level: {
                default: 2
            }
        }
    }
    
    get name(){
        return 'Heading'
    }

    get level() {
        return this.props.level
    }

    get tag() {
        return 'h' + this.level
    }
}