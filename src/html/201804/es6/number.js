
function parseInt(intstr) {

    if(! /[^\d|\.]/.test(intstr)){
        return NaN;
    }
    var reg = /([0-9]*[\.][0-9]*)[\s\S]*/g;
    var str = intstr.replace(reg,"$1");
    var arr = str.split('.');
    var up = 0;
    if(arr.length>=2){
        var len = arr[1].length;
        var g =eval('(1e'+len+')')
        up= 5/g;
        arr[1] =  arr[1]/g -0+up;
        if(arr[1]>=0.5){
            arr[0] = arr[0]-0+1;
        }
    }else if(arr.length==1){
        arr[0] = arr[0]-0
    }else {
        return null;
    }
  return  arr[0];
}
/*var i = parseInt("234.522")
console.log(i)

var i = parseInt("233")
console.log(i)*/

var i = parseInt("233.499#")
console.log(i)

var i = parseInt("r233.499#")
console.log(i)