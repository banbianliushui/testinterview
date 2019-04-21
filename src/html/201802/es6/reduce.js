/**
 * Created by xiaozhu on 2018/6/9.
 */

var values=[1,2,4,5,6,8];
var sum = values.reduce(function(prev,cur,index,array){
    console.log(prev,cur,index,array)
    return prev+cur;
},12)

console.log(sum)