// 参考 P.js

//可直接创建类（继承自Object），也可以创建子类继承至父类；
//用户可以初始化构造函数。
// 可以new 实例， 直接调用函数也能创建实例
// 内部需要返一个函数作为创建类对象

/* 父类构造器，父类原型对象；  子类构造器，子类原型对象
// 数据传递， 父类构造器和原型对象都要给子类的原型链，同时子类构造器要指向自身。
// 问题1：父类可以自定义，不传则默认父类为Object
// 问题2： 库需要返回一个函数可以用new 或直接调用该函数创建实例。
*/
var Q = (function () {
  //父类
  function baseConstructor() {}
  /**
   *  创建类
   *
   * @param {*} _superClass
   * @param {*} definition
   */
  let QFun = function QFun(_superClass, definition) {
    if (!definition) {
      definition = _superClass;
      _superClass = Object;
    }

    //空函数，为了让C不用new也能返回实例
    function Bare() {}
    //可以使用用户创建的类的函数,子类
    var C = function () {
      let self = new Bare();
      //proto.init是用户定义在实例对象上的函数
      if (typeof proto.init === "function") {
        proto.init.apply(self, arguments); //用户创建对象时传的 参数值
      }
      return self;
    };
    //父类原型对象
    let _super = (baseConstructor["prototype"] = _superClass["prototype"]);
    //子类原型：  父类构造函数+父类原型对象
    let proto = (Bare["prototype"] = C["prototype"] = new baseConstructor());
    //子类原型构造函数指向C
    proto.constructor = C;

    //proto 子类需要被重写
    // (function(define){
    // if(typeof define ==='function'){

    // }
    // })(definition)
    function Open(define) {
      let customDefine = {};
      if (typeof define === "function") {
        //proto 子类原型,_super 父类原型,C 子类构造函数,_superClass  父类构造函数
        define.call(C, proto, _super, C, _superClass);
      }
      console.log("customDefine=", customDefine);
      if (typeof define === "object" && define !== null) {
        Object.assign(proto, customDefine);
      }

      return C;
    }
    C.Open = Open; //暴露给外部修改？
    Open(definition);

    return C;
  };

  return QFun;
})();

var Animal = Q(function (proto, superProto) {
  proto.init = function (name) {
    this.name = name;
  };
  proto.say = function () {
    console.log(this.name + " is saying");
  };
});

let a1 = Animal("花花");
a1.say();
let a2 = new Animal("小凯");
a2.say();
