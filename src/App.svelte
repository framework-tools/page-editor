<script lang="ts">
import { element } from './store'
import { getOffset } from './Selection'
import ElementEditor from './ElementEditor.svelte'
import createRecursiveProxy from './recursiveProxy'
import { Schema } from './editor/schema'
import Stylesheet from './Stylesheet.svelte'


import ContentArray from './ContentArray.svelte'
import DataRepeater from './DataRepeater.svelte'
import { onDestroy, onMount } from 'svelte';

import Doc from './nodes/Doc'
import Heading from './nodes/Heading'
import Text from './nodes/Text';
import DynamicBlock from './nodes/DynamicBlock';

let schema = new Schema({
	nodes: [
		Doc,
		DynamicBlock,
		Heading,
		Text
	]
})

let currentNode
let stylesList

let offset = 0
let view

function updateOffset(){
	let selection = window.getSelection()
	if(root.el.contains(selection.anchorNode)){
		offset = getOffset(root.el, selection)
		console.log(offset)
	}
}

// onMount(()=>{
// 	root.el.childNodes[0].innerHTML = `<p>test</p>abc<img>de<p>fg<img>hi</p>jk`
// 	document.addEventListener('selectionchange', updateOffset)
// })

// onDestroy(() => {
// 	document.removeEventListener('selectionchange', updateOffset)
// })



let doc = Doc.fromJSON(schema, {
	type: 'Doc',
	props: {
		classes: []
	},
	children: [
		{
			type: 'Block',
			props: {
				tag: 'header',
				classes: ['header']
			},
			children: [
				{
					type: 'Text',
					text: 'this is a header'
				}
			]
		},
		{
			type: 'Block',
			props: {
				tag: 'div',
				classes: ['inner-content']
			},
			children: [
				{
					type: 'Block',
					props: {
						tag: 'p'
					},
					children: [
						{
							type: 'Text',
							text: 'this is a paragraph'
						}
					]
				},
				{
					type: 'Heading',
					props: {
						level: 1,
						classes: ['heading']
					},
					children: [
						{
							type: 'Text',
							text: 'this is a heading'
						}
					]
				}
			]
		}
	]
})

// watch the whole tree of the document for changes
let root = createRecursiveProxy(doc, () => {
	root = root
	currentNode = currentNode
})

$: if(root.el) {
	root.el.NodeView = root
}


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


// onMount(()=>{
// 	document.addEventListener('selectionchange', updateSelection)
// })

// onDestroy(() => {
// 	document.removeEventListener('selectionchange', updateSelection)
// })

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
<Stylesheet bind:root bind:stylesList/>
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
		<div class="rect" bind:this={rect}/>
		<div class="root" bind:this={root.el} contenteditable="true">
			<ContentArray
				bind:parent={root}
				/>
		</div>
	</div>
	<div class="sidebar">
		{#if currentNode && currentNode.classes }
			<ElementEditor bind:stylesList bind:currentNode bind:schema/>
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

	.root {
		outline: none;
	}

</style>
<svelte:head>
	<link rel="preconnect" href="https://fonts.gstatic.com">
	<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
</svelte:head>