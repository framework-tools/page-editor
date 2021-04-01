<script>
import { currentNode as currentNodeStore } from './store.js'

export let currentNode

$: currentNodeStore.set(currentNode)
currentNodeStore.subscribe(updatedNode => currentNode = updatedNode)

</script>