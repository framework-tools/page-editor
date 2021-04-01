<script>
import { element } from './store'
import { getOffset } from './Selection'
import ElementEditor from './ElementEditor.svelte'
import { View } from './view'
import { Doc } from './Node'
import createRecursiveProxy from './recursiveProxy'


import ContentArray from './ContentArray.svelte'
import DataRepeater from './DataRepeater.svelte'
import { onDestroy, onMount } from 'svelte';

let currentNode

let offset = 0
let view

// onMount(() => {
// 	let state = {
// 		content: root
// 	}
// 	view = new View(doc, state)
// })

let stylesheet

function updateOffset(){
	offset = getOffset(doc, document.getSelection())
}

// onMount(()=>{
// 	document.addEventListener('selectionchange', updateOffset)
// })

// onDestroy(() => {
// 	document.removeEventListener('selectionchange', updateOffset)
// })



let doc = Doc.fromJSON({
	props: {
		classes: []
	},
	children: [
		{
			type: 'block',
			props: {
				tag: 'header',
				classes: ['header']
			},
			children: [
				// {
				// 	type: 'text',
				// 	text: 'this is a header'
				// }
			]
		},
		// {
		// 	type: 'block',
		// 	props: {
		// 		tag: 'div',
		// 		classes: ['inner-content']
		// 	},
		// 	children: [
		// 		{
		// 			type: 'block',
		// 			props: {
		// 				tag: 'p'
		// 			},
		// 			children: [
		// 				{
		// 					type: 'text',
		// 					text: 'this is a paragraph'
		// 				}
		// 			]
		// 		},
		// 		{
		// 			type: 'heading',
		// 			props: {
		// 				level: 1,
		// 				classes: ['heading']
		// 			},
		// 			children: [
		// 				{
		// 					type: 'text',
		// 					text: 'this is a heading'
		// 				}
		// 			]
		// 		}
		// 	]
		// }
	]
})

// watch the whole tree of the document for changes
let root = createRecursiveProxy(doc, () => {
	root = root
	currentNode = currentNode
})


element.set(root)
element.subscribe(updatedNode => currentNode = updatedNode)

function addItem(type){
	let item = {
		type,
		attrs: {
			classes: []
		}
	}

	if(type !== 'text'){
		item.content = []
	}

	currentNode.content = [...currentNode.content, item]
	currentNode = currentNode
}

function createSelectionPath(el){
	let currentEl = el
	
	let path = []

	while(currentEl !== root.el){
		path.unshift(currentEl)
		currentEl = currentEl.parentNode
	}

	return path
}

function updateSelection(){
	let sel = window.getSelection()
	console.log(createSelectionPath(sel.anchorNode))
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

let rect
// $: { currentElement && updateRect() }



</script>
<div class="wrapper">
	<div class="sidebar">
		<div class="elements">
			<div class="icon" on:click={()=>addItem('div')}>
				Div
			</div>
			<div class="icon" on:click={()=>addItem('text')}>
				Text
			</div>
		</div>
	</div>
	<div class="content">
		{@html `<style>${stylesheet}</style>`}
		<div class="rect" bind:this={rect}/>
		<!-- <DataRepeater let:item={item}>
				<div class="post">
					<h3>
						{item.title}
					</h3>
					<span>{item.author}</span>
				</div>
		</DataRepeater> -->
		{#if false}
			<pre>
				{ JSON.stringify(items, null, 4) }
				{ JSON.stringify(focusElement, null, 4)}
			</pre>
		{/if}
		<div bind:this={root.el}>
			<ContentArray
				bind:parent={root}
				/>
		</div>
	</div>
	<div class="sidebar">
		{#if currentNode}
			<ElementEditor bind:stylesheet bind:root bind:currentNode/>
		{/if}
	</div>
</div>

<style>
	.icon {
		background: rgba(0,0,0,0.15);
		height: 60px;
		border-radius: 5px;
		font-weight: 600;
		cursor: pointer;
		width: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	:global(body) {
		margin: 0;
		padding: 0;
		background: #E5E5E5;
		font-family: 'Roboto', sans-serif;
	}

	.rect {
		background: purple;
		position: absolute;
	}
	
	.wrapper {
		display: grid;
		grid-template-columns:  300px 1fr 300px;
		height: 100%;
	}
	
	.sidebar {
		color: #424D5A;
		background: #fff;
		grid-gap: 10px;
	}

	:global(*){
		box-sizing: border-box;
	}

	.elements {
		display: grid;
		grid-template-columns: repeat(3, max-content);
		grid-gap: 10px;
	}

</style>
<svelte:head>
	<link rel="preconnect" href="https://fonts.gstatic.com">
	<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
</svelte:head>