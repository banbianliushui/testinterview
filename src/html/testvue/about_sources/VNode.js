class VNode{
    constructor(tag,data,children,text,elm){
        this.tag = tag ;
        this.data = data ;
        this.children = children;
        this.text = text;
        this.elm = elm;
    }
}

function render(){
    return new VNode(
        'span',
        {
            directives:[{
                rawName:'v-show',
                expression:'isShow',
                name:'show',
                value:true

            }],
            staticClass:'demo'
        },
        [new VNode(undefined,undefined,undefined,'this is')]
    )
}

function createEmptyVNode(){
    const node = new VNode();
    node.text = '';
    return node;
}

function createTextVNode(val){
    return new VNode(undefined,undefined,undefined,String(val))
}
function cloneVNode(node){
    const cloneVnode = new VNode(
        node.tag,
        node.data,
        node.children,
        node.text,
        node.elm
    )
    return cloneVnode;
}