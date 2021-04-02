function getTextLength (parent, node, offset) {
    var textLength = 0;

    if (node.nodeName == '#text')
        textLength += offset;
    else for (var i = 0; i < offset; i++)
        textLength += getNodeTextLength(node.childNodes[i]);

    if (node != parent)
        textLength += getTextLength(parent, node.parentNode, getNodeOffset(node));

    return textLength;
}

function getNodeTextLength (node) {
    var textLength = 0;

    // if (node.nodeName == 'BR')
    //     textLength = 1;
    if (node.nodeName == '#text')
        textLength = node.nodeValue.length;
    else if (node.childNodes != null)
        for (var i = 0; i < node.childNodes.length; i++)
            textLength += getNodeTextLength(node.childNodes[i]);


    return textLength;
}

function getNodeOffset (node) {
    return node == null ? -1 : 1 + getNodeOffset(node.previousSibling);
}

export function getOffset(doc, selection){
    return getTextLength(doc, selection.anchorNode, selection.anchorOffset)

    return getNodeLength(root, selection.anchorNode, selection.anchorOffset)
}


function getNodeLength(root, node, offset){
    let offsetLength = 0

    if(node.nodeName === '#text'){
        offsetLength += offset ?? node.textContent.length
    } else if(node.childNodes !== null) {
        for(var i = 0; i < offset; i++) {
            offsetLength += getNodeLength(root, node.childNodes[i])
        }
    } else {
        // leaf content such as <img> <br>
        offsetLength += 1
    }

    if(node !== root){
        offsetLength += getNodeLength()
    }

    return offsetLength
}


class ViewDescription {
    constructor(parent, children, dom, contentDom) {
        this.parent = parent
        this.children = children
        this.dom = dom
        this.contentDom = dom

        dom.ViewDescription = this
    }
}