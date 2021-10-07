<script>
import SvelteRepeaterItem from './SvelteRepeaterItem.svelte'

export let tree

let items = [
    { title: 'first item', author: 'Albert'},
    { title: 'second item', author: 'Will'}
]

</script>
{#each items as item, index}
    <SvelteRepeaterItem bind:item bind:tree index={index}/>
{/each}