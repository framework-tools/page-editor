<script>
import csstree from 'css-tree/dist/csstree'
import ClassIcon from './ClassIcon.svelte'
import StyleDropdown from './StyleDropdown.svelte'
import Close from 'svelte-material-icons/Close.svelte'
import ChevronDown from 'svelte-material-icons/ChevronDown.svelte'
import clickOutside from './clickOutside.js'
import Block from './utils/Block'

export let currentNode
export let stylesList
export let schema

$: if(currentNode) {
    currentStyle = undefined
}



$: ast = csstree.parse(`.header ${stylesList['header']}`)
$: background = csstree.find(csstree.find(ast, node => node.property === 'background').value, node => (node.type !== 'Value') && node.value).value

function updateBackground(e){
	let backgroundProperty = csstree.find(ast, node => node.type === 'Declaration' && node.property === 'background')

	if(backgroundProperty){
		let hash = csstree.find(backgroundProperty, node => node.type === 'Hash')
		if(hash){
			hash.value = e.target.value
		}
	}

	let list = csstree.find(ast, node => node.type === 'Block')
	
	stylesList[currentStyle] = csstree.generate(list)
	stylesList = stylesList
}

$: width = currentNode?.el?.style.width.replace('px', '') || ''

function updateWidth(val){
	currentNode.el.style.width = val.target.value + 'px'
}

function changeType (type){
    if(type === 'heading'){
        let parent = currentNode.el.parentNode.NodeView
        let index = parent.children.findIndex(node => node === currentNode)
        currentNode = Heading.fromJSON(currentNode.toJSON())
        parent.children[index] = currentNode
        currentNode = currentNode
    } else {
        currentNode.props.tag = type
    }
    tagDropdownToggled = false
}

let currentStyle

let tagDropdownToggled = false


</script>

<div class="controls">
    {#if currentNode instanceof Block }
        <div class="sidebar-seperator classes">
            <div class="sidebar-section">
                <span class="sidebar-section-name">Block Type</span>
                <div class="tag-dropdown-wrapper" use:clickOutside on:clickOutside={() => tagDropdownToggled = false}>
                    <div class="dropdown" on:click={() => tagDropdownToggled = !tagDropdownToggled}>
                        {currentNode.name}
                        <ChevronDown size="18px"/>
                    </div>
                    {#if tagDropdownToggled}
                        <div class="tag-dropdown-list">
                            {#each Object.keys(currentNode.allowedTags) as tag}
                                <div class="tag" on:click={() => changeType(tag)}>{currentNode.allowedTags[tag]}</div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
    <div class="sidebar-seperator classes">
        <div class="sidebar-section">
            <span class="sidebar-section-name">Styles</span>
            <StyleDropdown bind:stylesList/>
        </div>
        {#each currentNode.classes as style}
            <div
                class="style"
                class:selected={currentStyle === style}
                on:click={() => currentStyle = style}
            >
                <span>
                    <ClassIcon size="22px"/>
                    <span class="style-name">.{ style }</span>
                </span>
                <span>
                    <div class="removeStyle" on:click|stopPropagation={() => currentNode.removeClass(style)}>
                        <Close size="18px"/>
                    </div>
                </span>
            </div>
        {/each}
    </div>
    {#if currentStyle }
        <div class="sidebar-seperator">
            <div class="sidebar-section">
                <span class="sidebar-section-name">Styling</span>
            </div>
            <pre class="css-editor">
                .{currentStyle} { stylesList[currentStyle] }
            </pre>
        </div>
    {/if}
    {#if false}
    <div class="sidebar-seperator">
        <div class="sidebar-section">
            <span class="sidebar-section-name">Styling</span>
        </div>
        <div>Background</div>
        <input type="text" value={background} on:input={updateBackground}>
        
        <div>width</div>
        <input type="text" value={width} on:input={updateWidth}>
    </div>
    {/if}
</div>
<style>
    .sidebar-seperator {
        border-top: 1px solid #F3F5F6;
    }

    .sidebar-section {
        padding-left: 10px;
        padding-top: 10px;
        padding-right: 10px;
        padding-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .sidebar-section-name {
        font-weight: 600;
        font-size: 14px;
    }

    .style {
        font-size: 14px;
        padding-right: 10px;
        padding-left: 10px;
        padding-top: 8px;
        padding-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
    }

    .removeStyle {
        opacity: 0;
        display: inline-flex;
    }

    .style:hover .removeStyle {
        opacity: 0.5;
    }

    .style:hover .removeStyle:hover {
        opacity: 1;
        color: #b11;
    }

    .style > span {
        display: inline-flex;
        align-items: center;
    }

    .style-name {
        padding-left: 5px;
    }

    .style:hover, .style.selected {
        background: #F3F5F6;
    }

    .css-editor {
        border-radius: 4px;
        background: #2A2E34;
        color: white;
        padding: 8px;
        margin: 4px;
        overflow: auto;
    }

    .dropdown {
        background: #424D5A22;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        padding-left: 6px;
        padding-top: 6px;
        padding-bottom: 6px;
        padding-right: 4px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
    }

    .dropdown:hover {
        background: #424D5A33;
    }
    .dropdown:active {
        background: #424D5A44;
    }

    
    .tag-dropdown-wrapper {
        position: relative;
    }

    .tag-dropdown-list {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        font-size: 14px;
        border-radius: 4px;
        max-height: 250px;
        overflow-y: auto;
        z-index: 20;
    }

    .tag {
        padding: 10px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
    }

    .tag:hover {
        background: #424D5A11;
    }
</style>