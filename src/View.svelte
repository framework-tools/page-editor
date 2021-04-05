<script>
import { NodeViewDesc } from './view/ViewDescription';
import ContentArray from './ContentArray.svelte'
import { onMount, onDestroy } from 'svelte'
import { selectionFromDOM } from './view/Selection';
import { View } from './view/View';

export let root
export let currentNode

let rect

let view = new View({
    rootNode: root
})

$: if (root) view = view

function updateSelection(){
	let sel = window.getSelection()
    let offset = selectionFromDOM(view)

    console.log(offset)
}


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


</script>
<div class="content">
    <div class="rect" bind:this={rect}/>
    <div class="root" bind:this={view.rootEl} contenteditable="true">
        <ContentArray
            bind:parentViewDesc={view.rootViewDesc}
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