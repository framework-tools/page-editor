<script>
import { onDestroy } from 'svelte'
const pause = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000))

async function someAsyncFunction(){
	await pause(5)

	return [
		{ title: 'first item', author: 'Albert'},
		{ title: 'second item', author: 'Will'}
	]
}

let loadingText = 'loading'
let numberOfDots = 1

function updateLoadingText(){
	loadingText = `loading${new Array(numberOfDots).fill('.').join('')}`
	numberOfDots++
	if(numberOfDots == 4) { 
		numberOfDots = 1
	}
}

let interval = setInterval(updateLoadingText, 350)
onDestroy(() => clearInterval(interval))

</script>

{#await someAsyncFunction() }
	{ loadingText }
{:then array}
	{#each array as item}
		<slot item={item}/>
	{/each}
{/await}