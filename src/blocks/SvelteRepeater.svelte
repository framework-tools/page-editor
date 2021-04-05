<script>
import SvelteRepeaterItem from './SvelteRepeaterItem.svelte'

export let node
export let parentViewDesc

let items = [
    { title: 'first item', author: 'Albert'},
    { title: 'second item', author: 'Will'}
]

</script>
{#each items as item }
    <SvelteRepeaterItem bind:item bind:node bind:parentViewDesc/>
{/each}