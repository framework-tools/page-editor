import { Node } from '../editor/node'

export default class Doc extends Node {
    static spec = {
        name: 'Doc',
        content: 'block*'
    }

    get tag() {
        return 'div'
    }
}