
let ignoredProps = ['el', 'type']

export default function createRecursiveProxy(object, update) {
    if(Array.isArray(object)){
        for(const index of object){
            let value = object[index]
            if(value && typeof value === 'object' && !value.isProxy){
                object[index] = createRecursiveProxy(object[index], update)
            }
        }
    } else {
        for(const index in object){
            let value = object[index]
            if(value && typeof value === 'object' && !ignoredProps.includes(index) && !value.isProxy){
                object[index] = createRecursiveProxy(value, update)
            }
        }
    }


    return new Proxy(object, {
        get: (target, property) => {
            if(property === 'isProxy') return true
            return target[property]
        },
        set: (target, prop, value) => {
            if (value && typeof value === 'object' && !ignoredProps.includes(prop) && !value.isProxy) {
                value = createRecursiveProxy(value, update)
            }

            target[prop] = value

			update()

            return true
        }
    })
}