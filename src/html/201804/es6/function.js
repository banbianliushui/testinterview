function tailFactorial(n,total){
    if(n===1) return total;
    return tailFactorial(n-1,n*total);
}
//一
function factorial(n){
    return tailFactorial(n,1);
}
//二
function currying(fn,n){
    return function  (m) {
        return fn.call(this,m,n);

    }
}

var factorial1 = currying(tailFactorial,1);
console.log(factorial1(5));
//三
function factorial(n,total=1){
    if(n===1) return total;
    return tailFactorial(n-1,n*total);
}
console.log(factorial(5));