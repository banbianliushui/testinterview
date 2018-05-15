//const targetArray = [1, [2, 3], 4];


[(b)] = [3]
({})
//var  [(a)] = [1]; //写法就报错,这里a模式带括号，下面a是变量， 猜测识别不出 a就是变量，得把a独立出来
var  a ;
[(a)] = [1]
console.log(a);
/*2*/
function f(){
    console.log("测试")
}
let x;
if([1][0] === undefined){
    x = f();
}else{
    x = [1][0];
}
console.log(x);

/*解构2*/
const targetArray = [1, [2, 3]];
const formater = "[a, [b], c]";

function  distructur1(target,formater){
    let tar  = JSON.stringify(target);

    let lc =  formater.indexOf("[");
    let lfc ;
    if(lc!=-1){
        lfc
    }

}

function  distructur2(target,formater,result){

    if(result===undefined){
        formater  = JSON.parse(formater.replace(/\w+/g,'"$&"'));
        result={};
    }
   for(let i = 0 ;i<formater.length;i++){
       if(target[i]){
           if(Array.isArray(target[i])){
               if(Array.isArray(formater[i])){
                   result =  distructur2(target[i],formater[i],result)
               }else{
                   result[formater[i]]=target[i]
               }
           }else{
               result[formater[i]] = target[i]
           }

       }else{
           result[formater[i]]=undefined;
       }
   }
   return result;
}

var result =distructur2(targetArray,formater)
console.log(result)