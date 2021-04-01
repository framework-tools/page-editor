
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
            if(value && typeof value === 'object' && index !== 'el' && !value.isProxy){
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
            if (value && typeof value === 'object' && prop !== 'el' && !value.isProxy) {
                value = createRecursiveProxy(value, update)
            }

            target[prop] = value

			update()

            return true
        }
    })
}