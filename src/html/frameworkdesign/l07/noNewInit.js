// function $(a, b) {
//   return new $.prototype.init(a, b)
// }
// $.prototype.init = function (a, b) {
//   //构造函数 变成了$.prototype.init，而不是 $
//   this.a = a
//   this.b = b

//   return this
// }

// var k = $('小明', '23')
// console.log(k)

//jquery

// function jq() {
//   var jQuery = function (selector, context) {
//     // The jQuery object is actually just the init constructor 'enhanced'
//     // Need init if jQuery is called (just allow error to be thrown if not included)
//     return new jQuery.fn.init(selector, context)
//   }
//   jQuery.fn = jQuery.prototype = {}
//   jQuery.extend = jQuery.fn.extend = function () {
//     var options,
//       name,
//       src,
//       copy,
//       copyIsArray,
//       clone,
//       target = arguments[0] || {},
//       i = 1,
//       length = arguments.length,
//       deep = false

//     // Handle a deep copy situation
//     if (typeof target === 'boolean') {
//       deep = target

//       // Skip the boolean and the target
//       target = arguments[i] || {}
//       i++
//     }

//     // Handle case when target is a string or something (possible in deep copy)
//     if (typeof target !== 'object' && !isFunction(target)) {
//       target = {}
//     }

//     // Extend jQuery itself if only one argument is passed
//     if (i === length) {
//       target = this
//       i--
//     }

//     for (; i < length; i++) {
//       // Only deal with non-null/undefined values
//       if ((options = arguments[i]) != null) {
//         // Extend the base object
//         for (name in options) {
//           src = target[name]
//           copy = options[name]

//           // Prevent never-ending loop
//           if (target === copy) {
//             continue
//           }

//           // Recurse if we're merging plain objects or arrays
//           if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
//             if (copyIsArray) {
//               copyIsArray = false
//               clone = src && Array.isArray(src) ? src : []
//             } else {
//               clone = src && jQuery.isPlainObject(src) ? src : {}
//             }

//             // Never move original objects, clone them
//             target[name] = jQuery.extend(deep, clone, copy)

//             // Don't bring in undefined values
//           } else if (copy !== undefined) {
//             target[name] = copy
//           }
//         }
//       }
//     }

//     // Return the modified object
//     return target
//   }
//   var init = (jQuery.fn.init = function (selector, context, root) {})
//   init.prototype = jQuery.fn
//   jQuery.fn.ready = function (fn) {}

//   jQuery.fn.extend({
//     show: function () {
//       return showHide(this, true)
//     }
//   })

//   var // Map over jQuery in case of overwrite
//     _jQuery = window.jQuery,
//     // Map over the $ in case of overwrite
//     _$ = window.$

//   jQuery.noConflict = function (deep) {
//     if (window.$ === jQuery) {
//       window.$ = _$
//     }

//     if (deep && window.jQuery === jQuery) {
//       window.jQuery = _jQuery
//     }

//     return jQuery
//   }

//   if (!noGlobal) {
//     window.jQuery = window.$ = jQuery
//   }
//   return jQuery
// }

//简化版
function jqSimplify() {
  var jQuery = function (selector, context) {
      return new jQuery.fn.init(selector, context)
  }
  jQuery.fn = jQuery.prototype = {}// 用fn属性指向jQuery函数的原型对象

  // jQuery.fn指向jQuery函数的原型对象，所以init函数就是jQuery函数原型上的函数，
  // new init 后返回this是 jQuery.prototype 对象上的成员内容。后期很多暴露给外部使用的函数
  //都是通过jQuery.fn的扩展实现的。
  var init = jQuery.fn.init = function (selector, context, root) {
    console.log('selector',selector)
    this.selector = selector
    return this;
  };
  //TODO  感觉此处 init 函数可以不用，如果init 没有其他用途的话
  // Give the init function the jQuery prototype for later instantiation
  init.prototype = jQuery.fn
  jQuery.fn.ready = function (fn) {
    console.log('jq ready')
  }

  return jQuery
}

var jqFun = jqSimplify()
var jqObj=jqFun('哈哈哈')
jqObj.ready()