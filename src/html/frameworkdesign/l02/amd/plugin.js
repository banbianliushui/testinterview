;(function (factory){
  if ( typeof define === "function" && define.amd ) {

      // AMD. Register as an anonymous module.
      define(factory);
  } else {

      // Browser globals
      // 以我的库为例  返回mTools
      window.mTools = factory();
  }
})(function(){
  //我们的js库
  return {
     //模块返回值
  }        

});