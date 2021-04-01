/** Dispatch event on click outside of node */
export default function clickOutside(node, newval) {

    const handleClick = event => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
                new CustomEvent('clickOutside', node)
            )
        }
    }

    document.addEventListener('click', handleClick, true);
    return {
        destroy() {
            document.addEventListener('click', handleClick, true);
        }
    }
}