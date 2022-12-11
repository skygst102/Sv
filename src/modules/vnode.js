function htmlToVnode(element) {
    let vnode = [];
    let count = 1;
    if (typeof element==='string') {
        let div=document.createElement('div');
        div.innerHTML=element;
        element=div;
    }
    function vNode(el, obj, root,parentEl) {
        // obj={id:'',pid:'',index:'',}
        let tagName = el.tagName.toLowerCase();
        let name = tagName === 'div' ? 'View' : tagName === 'img' ? 'Image' : tagName === 'input' ? 'TextInput' : tagName;
        let text=parentEl? null:el.firstChild ? el.firstChild.nodeValue:null;
        if (typeof(text)==='string'&&text.replace(/\n|\s|\t/g,'')==='') {
            text=null;
        }
        let nodeObj = {
            tagName: tagName,
            id: obj.id || count,
            index: obj.index || null,
            pid: obj.pid || root || 'root',
            name: name,
            props: {
                attributes: {},
                text: text,
                style: {}
            },
        };
        Array.from(el.attributes).forEach((key, i) => {
            nodeObj.props.attributes[key.name] = key.value||'';
        })
        return nodeObj;
    }

    function recursion(element, pid, id) {
        let nodeArr = Array.prototype.slice.call(element.children);
        if (nodeArr.length > 0) {
            nodeArr.forEach((key, i) => {
                count++;
                vnode.push(vNode(key, { id: count, pid: pid || count }))
                recursion(key,count,count)
            });
        }
    }
    vnode.push(vNode(element, {},null,true))
    recursion(element, count);
    return vnode;
}

export {htmlToVnode}
