<script lang="ts">
import { element } from './store'
import ElementEditor from './ElementEditor.svelte'
import createRecursiveProxy from './recursiveProxy'
import { Schema } from './editor/schema'
import Stylesheet from './Stylesheet.svelte'
import View from './View.svelte'

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
		item.children = []
	}

	currentNode.content = [...currentNode.content, item]
	currentNode = currentNode
}

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
	<Stylesheet bind:root bind:stylesList/>
	<View bind:root bind:currentNode/>
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