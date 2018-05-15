/**
 * Created by xiaozhu on 2018/4/16.
 */
const ncname = '[a-zA-Z_][\\w\\-\\.]*';
const singleAttrIdentifier = /([^\s"'<>/=]+)/
const singleAttrAssign = /(?:=)/
const singleAttrValues = [
    /"([^"]*)"+/.source,
    /'([^']*)'+/.source,
    /([^\s"'=<>`]+)/.source
]
const attribute = new RegExp(
    '^\\s*' + singleAttrIdentifier.source +
    '(?:\\s*(' + singleAttrAssign.source + ')' +
    '\\s*(?:' + singleAttrValues.join('|') + '))?'
)

const qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')'
const startTagOpen = new RegExp('^<' + qnameCapture)
const startTagClose = /^\s*(\/?)>/

const endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>')

const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g

const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/

function advance(n){
    index+=n;
    html = html.substring(n);
}
function parseHTML(){
    while(html){
        let textEnd= html.indexOf('<');
        if(textEnd == 0){
            if(html.match(endTag)){
                const endTagMatch = html.match(endTag);
                if(endTagMatch){
                    advance(endTagMatch[0].length);
                    parseEndTag(endTagMatch[1]);
                }
                continue;
            }
            if(html.match(startTagOpen)){
                const startTagMatch = parseStartTag();
                const element = {
                    type:1,
                    tag:startTagMatch.tagName,
                    lowerCasedTag : startTagMatch.tagName.toLowerCase(),
                    attrsList:startTagMatch.attrs,
                    attrsMap:makeAttrsMap(startTagMatch.attrs),
                    parent:currentParent,
                    children:[]
                }

                processIf(element);
                processFor(element);
                
                if(!root){
                    root = element;
                }
                if(currentParent){
                    currentParent.children.push(element);
                }
                stack.push(element);
                currentParent = element;
                continue;
            }
        }else{//文本标签
            text = html.substring(0,textEnd);
            advance(textEnd);
            let expression;
            if(expression = parseText(text)){
                currentParent.children.push({
                    type:2,
                    text,
                    expression
                });
            }else{
                currentParent.children.push({
                    type:3,
                    text
                })
            }

            continue;
        }
    }
}

/*解析起始标签*/
function parseStartTag() {
    const start = html.match(startTagOpen);//得到标签头部，可以得到标签名称，attrs用来存放标签内的属性
    if (start) {
        const match = {
            tagName: start[1],
            attrs: [],
            start: index
        }
        advance(start[0].length);
        let end, attr;
        //解析标签结束以及标签内属性
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {

            advance(attr[0].length);
            match.attrs.push({
                name: attr[1],
                value: attr[3]
            });


        }
        if (end) {
            match.unarySlash = end[1];//单斜杠
            advance(end[0].length);
            match.end = index;
            return match
        }
    }
}

function makeAttrsMap(attrs){
        const map = {};
        for(let i = 0,l = attrs.length;i<1;i++){
            map[attrs[i].name] = attrs[i].value
        }
        return map ;
}

/*解析尾标签后从stack栈中取出最近的和自己一致的元素将currentParent指向那个元素*/
function parseEndTag(tagName){
  let pos;
  for(pos = stack.length-1;pos >=0;pos --){
      if(stack[pos].lowerCasedTag === tagName.toLowerCase()){
          break;
      }
  }
  if(pos>=0){
      stack.length = pos;
      currentParent = stack[pos];
  }
}


function parseText(){
    if(!defaultTagRE.test(text)) return ;
    const tokens = [];
    let lastIndex = defaultTagRE.lastIndex=0
    let match , index
    while((match = defaultTagRE.exec(text))){
        //exec 多个子表达式  会返回数组
        index = match.index
        if(index > lastIndex){
            tokens.push(JSON.stringify(text.slice(lastIndex,index)))
        }
        const exp  = match[1].trim()
        tokens.push(`_s(${exp})`)
        lastIndex = index + match[0].length

    }
    if(lastIndex < text.length){
        tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return tokens.join('+');//将数组中的执行代码用+ 返回表达式
}

/*<div>hello,{{name}}.</div>
*tokens = ['hello,', _s(name), '.'];
* 'hello' + _s(name) + '.';
* */

///*从el中获取name对应的值
// */
function getAndRemoveAttr(el,name) {
    let val
    if((val =el.attrsMap[name])!=null){
        const list = el.attrsList
        for(let i =0, l =list.length;i<l;i++){
            if(list[i].name === name){
                list.splice(i,1)
                break;
            }
        }
    }
    return val
}

//getAndRemoveAttr(el,'v-for')

    /* v-for 指令解析成for属性以及alias属性*/
/*v-if 将条件存入ifConditions数组*/
function processFor(el) {
    let exp
    if ((exp = getAndRemoveAttr(el, 'v-for'))) {
        const inMatch = exp.match(forAliasRE);
        el.for = inMatch[2].trim();// v-for='item in sz' 中的 sz
        el.alias = inMatch[1].trim();// v-for='item in sz' 中的 item
    }
}

function processIf(el){
    const exp = getAndRemoveAttr(el,'v-if');
    if(exp){
        el.if = exp;
        if(!el.ifConditions){
            el.ifConditions = [];
        }
        /* v-if="isShow" */
        el.ifConditions.push({
            exp:exp,/*  'exp': 'isShow'*/
            block:el
        })
    }
}

/*patch的过程是将VNode节点层层对比,然后将[差异]更新到视图上
* 而一些静态节点是不会根据数据变化而变化的，这些数据没有对比需求，
* 可以跳过这些静态节点的比对，这需要在静态节点上做一些标记
* */

function isStatic(node){
    if(node.type ===2){//表达式节点
        return false;
    }
    if(node.type === 3){//文本节点
        return true
    }
    return (!node.if && !node.for)
}

function markStatic(node){
    node.static = isStatic(node);//文本节点 为静态，表达式节点{{}}、v-if、v-for 不能为静态
    if(node.type === 1){
        for(let i =0 ,l = node.children.length;i<l;i++){
            const child = node.children[i];
            markStatic(child)
            if(!child.static){//其他都标注为非静态节点
                node.static = false;
            }
        }
    }
}

/*标记staticRoot静态根。有一个子节点是文本节点的元素节点设为静态根*/
function markStaticRoots(node){
    if(node.type === 1){
        if(node.static && node.children.length && !(
            node.children.length === 1 &&
                node.children[0].type === 3
            )){
            node.staticRoot  = true;
            return ;
        }else{
            node.staticRoot = false;
        }
    }
}

function optimize(rootAst){
    markStatic(rootAst);
    markStaticRoots(rootAst);
}

/*将AST转化成render function字符串，最终得到render 字符串以及staticRenderFns*/

/*处理if*/
function genIf(el){
    el.ifProcessed = true;
    if(!el.ifConditions.length){
        return '_e()';
    }
    return `(${el.ifConditions[0].exp})?${genElement(el.ifConditions[0].block)}:_el()`
}

/*处理for*/
function genFor(el){
    el.forProcessed = true;
    const exp = el.for;
    const alias = el.alias;
    const iterator1 = el.iterator1 ? `,${el.iterator1}` : '';
    const iterator2 = el.iterator2 ? `,${el.iterator2}` : '';
    return `_l((${exp}),`+
        `function(${alias}${iterator1}${iterator2}){` +
        `return ${genElement(el)}` +
        '})';
    /*function(item,xx,yy)*/
}

/*处理文本节点*/
function genText(el){
    return `_v(${el.expression})`
}

/**genElement会根据当前节点是否有 if 或者 for 标记
 * 然后判断是否要用 genIf 或者 genFor 处理，否则通过 genChildren 处理子节点，
 * 同时得到 staticClass、class 等属性。
 * genChildren 比较简单，遍历所有子节点，通过 genNode 处理后用“，”隔开拼接成字符串。
 genNode 则是根据 type 来判断该节点是用文本节点 genText 还是标签节点 genElement 来处理。
 */

function genNode(el){
    if(el.type ===1){
        return genElement(el)
    }else{
        return genText(el)
    }
}

function genChildren(el){
    const children = el.children;
    if(children && children.length>0){
        return `${children.map(genNode).join(',')}`;
    }
}

function genElement(el){
    if (el.if && !el.ifProcessed) {
        return genIf(el);
    } else if (el.for && !el.forProcessed) {
        return genFor(el);
    } else {
        const children = genChildren(el);
        let code ;
        code = `_c('${el.tag},'{
        staticClass:${el.attrsMap && el.attrsMap[':class']},
        class:${el.attrsMap && el.attrsMap['class']},
        }${
            children?`,${children}`:''
        })`
        return code;
    }
}

function  generate(rootAst) {
    const  code = rootAst ? genElement(rootAst):'_c("div")'

    return {
        /*这个this是render调用时的上下文？*/
        render:`with(this){return ${code}}`
    }
}












