
let   arraylike ={
    'a':'大于',
    '1':'哈哈'
    ,
    length:3
}

var a = Array.from(arraylike);
var b = [].slice.call(arraylike);
console.log(a);
console.log(b);

for(let [index,elem] of ['a','b'].entries()){
    console.log(index,elem)

 }

 let letter = ['a','b']
 let entries = letter.entries();

 console.log( entries.next().value)
 console.log( entries.next().value)
