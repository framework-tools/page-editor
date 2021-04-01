

export class View {
    constructor(el, state){
        this.dom = el
        this.state = state
    }
}


class ViewState {
    constructor() {
        
    }

    static fromJSON(json){

        
        return new this()
    }
}