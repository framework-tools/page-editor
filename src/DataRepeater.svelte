<script>
let arr = [
	{ title: 'first item', author: 'Albert'},
	{ title: 'second item', author: 'Will'}
]

</script>

{#each arr as val}
<slot val={val}/>
{/each}