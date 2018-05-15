/**
 * Created by xiaozhu on 2018/5/9.
 */

var obj = {
    *[Symbol.iterator] (){
        yield 1;
        yield 2;
    }
}


let gen= function *() {
    yield 1;
    yield * [2,3];
    yield 5;
}

let  it=gen();
it.next();
it.next();

function Mobj(value){
    this.value =value;
    this.next = null;
}
Mobj.prototype[Symbol.iterator]=function(){
    let iterator = {
        next:next
    }
    let  current = this;
    function next(){
            if(current){
                let value = current.value;
                current = current.next;
                return {value:value,done:false}
            }else{
                return {value:undefined,done:true}
            }
    }
    return iterator;
}


Mobj.prototype.add=function (value) {
   let newobj =  new Mobj(value);
    this.next = newobj;
    return newobj;
}

var obj = new Mobj('4');
    obj.add("8").add("10").add("18");

    for(let o of obj){
        console.log(o.value,"done ="+o.done)
    }




function makerIteror (arr){
    var index = 0;
    return {
        next:function(){
            if(index<arr.length){
                index++;
                return {value:arr[index-1],done:false}
            }else{
                return {value:undefined,done:true}
            }
        }
    }
}

let it = makerIteror ([2,3,6])
it.next()