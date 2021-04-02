<script>
export let root

export let stylesList = {
	'header': `{
    background: #111;
    color: white;
    width: 100%;
    padding: 20px;
    display: block;
}`,
	'inner-content': `{
    padding-left: 20px;
    padding-right: 20px;
}`,
	'heading': `{
    border-bottom: 3px solid rgb(200, 20, 20);
}`
}

$: stylesheet = createStylesheet(getUsedStyles(root.children))

function getUsedStyles(children = []){
	let styles = []
	for(const node of children){
        if(node.classes) styles.push(...node.classes)
        if(node.children) styles.push(...getUsedStyles(node.children))
	}
	return styles
}

function createStylesheet(rules){
	let stylesheet = ``
	
	rules.map(rule => stylesheet += `.${rule} ${stylesList[rule]}`)

	return stylesheet
}


</script>
<svelte:head>
    {@html `<style>${stylesheet}</style>`}
</svelte:head>