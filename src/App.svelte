<script>
import { element } from './store'

import ContentArray from './ContentArray.svelte'
// import DataRepeater from './DataRepeater.svelte'
// import Element from './Element.svelte'

let contentArrayComponent
let currentElement
let updateFn

let root = {
	content: []
}

let rect

element.set([root, item => root = item])
element.subscribe(([element, updateElement]) => {
	currentElement = element
	updateFn = updateElement
})


function addItem(type){
	let item = {
		type
	}

	if(type !== 'text'){
		item.content = []
	}

	currentElement.content = [...currentElement.content, item]

	updateFn(currentElement)
}

// async function updateRect(){
// 	if(currentElement?.el){
// 		await tick()
// 		console.log(focusElement.el)
// 		let focusRect = focusElement.el.getBoundingClientRect()
// 		rect.style.top = focusRect.top + 'px'
// 		rect.style.left = focusRect.left + 'px'
// 		rect.style.width = focusRect.width  + 'px'
// 		rect.style.height = '1px'
// 	}
// }

// $: { currentElement && updateRect() }

$: width = currentElement?.el?.style.width || '100'

function updateWidth(val){
	currentElement.style.width = val.target.value + 'px'
	updateFn(currentElement)
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
		<div class="controls">
			width
			<input type="text" value={width} on:input={updateWidth}>
		</div>
	</div>
	<div class="content">
		<div class="rect" bind:this={rect}/>
		<!-- <DataRepeater let:val={val}>
				<div class="post">
					<h3>
						{val.title}
					</h3>
					<span>{val.author}</span>
				</div>
		</DataRepeater> -->
		{#if false}
			<pre>
				{ JSON.stringify(items, null, 4) }
				{ JSON.stringify(focusElement, null, 4)}
			</pre>
		{/if}
		
		<ContentArray
			bind:parent={root}
			bind:this={contentArrayComponent}
			/>
	</div>
</div>

<style>
	.icon {
		background: rgba(255,255,255,0.15);
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
	}

	.rect {
		background: purple;
		position: absolute;
	}
	
	.wrapper {
		display: grid;
		grid-template-columns: 300px 1fr;
		height: 100%;
	}
	
	.sidebar {
		color: white;
		background: #112233;
		display: grid;
		grid-template-columns: repeat(3, max-content);
		grid-gap: 10px;
		padding: 10px;
	}

	:global(*){
		box-sizing: border-box;
	}

</style>