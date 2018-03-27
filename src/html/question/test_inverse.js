
/*数值逆序输出*/
function inverseInt(a,str){

   if(typeof str==='undefined'){
       str ="";
   }
    var mod =  a%10;
    var div = Math.floor(a/10);
    if(div>=0){
        str  = str+''+mod;
    }
    if(div>0){
        str = inverseInt(div,str )
    }

   return      str ;
}
console.log(inverseInt(132))