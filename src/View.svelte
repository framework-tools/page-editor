<script>
import ContentArray from './ContentArray.svelte'
import { onMount, onDestroy } from 'svelte'
import { selectionFromDOM } from './view/selectionUpdate'
import { NodeTree } from './view/Tree'

export let root
export let currentNode


let rect


let currentTree
// let view = new View({
//     rootNode: root
// })

// $: if (root) view = view

function updateSelection(){
    let sel = selectionFromDOM(el, nodeTree, currentTree)
    console.log(sel.$anchor)
}

$: nodeTree = new NodeTree(root)

onMount(()=>{
	document.addEventListener('selectionchange', updateSelection)
})

onDestroy(() => {
	document.removeEventListener('selectionchange', updateSelection)
})

// async function updateRect(){
// 	if(currentElement?.el){
// 		await tick()
// 		let focusRect = focusElement.el.getBoundingClientRect()
// 		rect.style.top = focusRect.top + 'px'
// 		rect.style.left = focusRect.left + 'px'
// 		rect.style.width = focusRect.width  + 'px'
// 		rect.style.height = '1px'
// 	}
// }

let el

$: if(el) nodeTree.setFragment(el)

</script>
<div class="content">
    <div class="rect" bind:this={rect}/>
    <div class="root" bind:this={el} contenteditable="true">
        <ContentArray
            bind:parentTree={nodeTree}
            />
    </div>
</div>
<style>
.root {
    outline: none;
}

.rect {
    background: purple;
    position: absolute;
}
</style>