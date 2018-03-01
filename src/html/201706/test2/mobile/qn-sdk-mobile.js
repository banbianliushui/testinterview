//2013年06月26日16:47:48
//朱棣
//v2.0
(function(global){
    if(global.mobile){
        return;
    }
    var mobile = {};

    mobile.ns = function () {
        var obj = this;
        var name;
        var fn;
        if(arguments.length == 0){
            return;
        }else if(arguments.length == 1){
            fn =  arguments[0];
        }else{
            name = arguments[0];
            fn =  arguments[1];
            var names = name.split('.'),
                i = -1;

            while (names[++i]) {
                if (obj[names[i]] === undefined) {
                    obj[names[i]] = {};
                }
                obj = obj[names[i]];
            }
        }
        !!fn && fn.call(obj, mobile);
    };




//2012年12月28日15:17:37
//TOP

var doc = document,
    head = document.getElementsByTagName('head')[0];
//utils
function isType(type) {
    return function(obj) {
        return Object.prototype.toString.call(obj) === "[object " + type + "]"
    }
}
var isObject = isType("Object");
var isString = isType("String");
var isArray = Array.isArray || isType("Array");
var isFunction = isType("Function");

function isNumeric(str){
    return isType('Number')(str) || /^([+-]?)\d*\.*\d+$/.test(str);
}

function guid(){
    return "tmd" + (Math.random() * (1 << 30)).toString(16).replace('.', '');
}
function createExecIframe(src){
    var iframe = document.createElement("iframe");
    iframe.style.display = 'none';
    iframe.dataset.ajax="false";
    if(src && isString(src)){
        iframe.src = src;
    }
    document.body.appendChild(iframe);
    return iframe;
}
function unparam(str) {
    var sep = '&', eq = '=';

    var params = {}, parts = str.split(sep), i, pair;

    for( i = 0; i < parts.length; i++) {
        pair = parts[i].split(eq);
        if(pair && (pair.length == 2)) {
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
    }

    return params;
}
function param(obj) {
    if(typeof obj === 'string') {
        return obj;
    }

    var sep = '&', eq = '=';
    var pairs = [];

    for(var i in obj) {
        var val = obj[i];
        //function对象就不要传了，传了也转不回来
        if(val !== null && typeof val !== 'undefined'
            && typeof val !== 'function') {
            pairs.push(encodeURIComponent(i) + eq + encodeURIComponent(val));
        }
    }

    pairs.sort();
    return pairs.join(sep);
}
function trim(str) {
    if(str){
        if(isString(str)){
            return str.replace(/^\s*|\s*$/g, '');
        }
        if(isObject(str)){
            for(var key in str){
                if(str.hasOwnProperty(key) && isString(str[key])){
                    str[key] = trim(str[key]);
                }
            }
            return str;
        }
    }
    return str;
}

function getScript(url, cb){
    var node = doc.createElement('script');

    node.src = url;
    node.async = true;
    node.id = guid();
    node.charset = 'utf-8';

    cb && isFunction(cb) && (function(node, cb){
        var oldCb = cb;
        cb = function(){
            oldCb && oldCb();
            node.parentNode.removeChild(node);
        }
        if(doc.addEventListener){
            // 不能直接使用onload，这种情况下node元素存在，但无法在dom中获取到，且脚本也没真正执行
            node.addEventListener('load', cb, false);
        }else{
            node.onreadystatechange = function(){
                var state = node.readyState;
                if(/loaded|complete/i.test(state)){
                    cb();
                }
            }
        }
    })(node, cb);

    head.appendChild(node);

    return node
}

mobile.ns('util',function(){

    this.isObject = isObject;
    this.isString = isString;
    this.isArray = isArray;
    this.isNumeric = isNumeric;
    this.isFunction=isFunction;
    this.guid = guid;
    this.createExecIframe=createExecIframe;
    this.unparam=unparam;
    this.param=param;
    this.trim=trim;
    this.getScript = getScript;

});

/**
 * @namespace ua
 * @desc 用户代理模块
 */
mobile.ns('ua',function(){
    var util = mobile.util;
    //某些奇葩的Android手机拿userAgent会为空,或者有权限问题
    var userAgent = "";
    var unKown = false;
    try{
        userAgent = navigator.userAgent.toLowerCase();
        if(!userAgent || util.trim(userAgent) == ""){
            unKown = true;
        }
    }catch(e){
        unKown = true;
    }


    // only one key in @kyes can be true
    function pick (o, keys) {
        for (var i = 0; i < keys.length; i ++) {
            if (o[keys[i]]) {
                return keys[i];
            }
        }
        return 'Unknown';
    }

    //OS
    var OS = {
        ios: /iPhone|iPod|iPad|IOS/i.test(userAgent),
        iphone: /iPhone/i.test(userAgent),
        ipod: /iPod/i.test(userAgent),
        ipad: /iPad/i.test(userAgent),
        iphoneVersion: (userAgent.match( /.+(?:iphone\ os)[\/: ]([\d_]+)/ ) || [0,0])[1].toString().split('_').join('.'),
        ipadVersion: (userAgent.match( /.+(?:cpu\ os)[\/: ]([\d_]+)/ ) || [0,0])[1].toString().split('_').join('.'),

        android: /Android/i.test(userAgent),
        androidPhone: /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i.test(userAgent),
        androidPad: (/Android/i.test(userAgent) && !/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i.test(userAgent)),
        androidVersion: (userAgent.match( /.+(?:android)[\/: ]([\d.]+)/ ) || [0,0])[1],

        blackberry: /BlackBerry/i.test(userAgent), //! can match small part of Opera Mini
        blackberryVersion: (userAgent.match(/BlackBerry(\s)?(\d+)/i) || [0,0,0])[2],

        palm: /PalmSource|Blazer/i.test(userAgent),
        palmVersion: (/Blazer/i.test(userAgent) ? '>3.1' : 0),

        symbian: /SymbianOS|GoBrowser/i.test(userAgent),
        symbianVersion: (userAgent.match(/SymbianOS\/([\d\.]+)/i) || [0,0])[1],

        winPhone: /Windows\ Phone/i.test(userAgent),
        winPhoneVersion: (userAgent.match( /.+(?:windows\ phone\ os)[\/: ]([\d_]+)/i ) || [0,0])[1],

        winPC: /windows\ nt/i.test(userAgent),
        winPCVersion: (userAgent.match(/windows\ nt\ ([\d\.]+)/i) || [0,0])[1]
    };

    var ver = 0, osname = 'Unknown';
    if (OS.iphone) {
        osname = 'iphone';
        ver = OS.iphoneVersion;
    } else if (OS.ipod) {
        osname = 'ipod';
        ver = OS.iphoneVersion;
    } else if (OS.ipad) {
        osname = 'ipad';
        ver = OS.ipadVersion;
    } else if (OS.android) {
        osname = OS.androidPhone ? 'androidPhone' : 'androidPad';
        ver = OS.androidVersion;
    } else if (OS.blackberry) {
        osname = 'blackberry';
        ver = OS.blackberryVersion;
    } else if (OS.palm) {
        osname = 'palm';
        ver = OS.palmVersion;
    } else if (OS.symbian) {
        osname = 'symbian';
        ver = OS.symbianVersion;
    } else if (OS.winPhone) {
        osname = 'winPhone';
        ver = OS.winPhoneVersion;
    } else if (OS.winPC) {
        osname = 'winPC';
        ver = OS.winPCVersion;
    }
    OS.version = ver;
    OS.name = osname;

    //browser
    var browser = {
        chrome: /chrome/.test( userAgent ),
        safari: (/webkit/.test( userAgent ) && !/chrome/.test( userAgent )),
        opera: /opera/.test( userAgent ),
        firefox: /firefox/.test( userAgent ),
        msie: (/msie/.test( userAgent ) && !/opera/.test( userAgent )),
        qqbrowser: /qqbrowser/.test(userAgent),
        ucbrowser: (/UCBrowser/i.test(userAgent) && !/UCWEB/i.test(userAgent)), //非极速模式
        ucweb: /UCWEB/i.test(userAgent), //极速模式UC
        wechart: /wechart|MicroMessenger/i.test(userAgent), //微信自带浏览器
        //spec browser
        bolt: /bolt/.test(userAgent),
        doris: /doris/.test(userAgent),
        fennec: /fennec/.test(userAgent),
        gobrowser: /gobrowser/.test(userAgent),
        iris: /iris/.test(userAgent),
        minimo: /minimo/.test(userAgent),

        //browser core
        mozilla: (/mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )),
        webkit: /webkit/.test(userAgent),

        gecko: /[^like]{4} gecko/.test( userAgent ),
        presto: /presto/.test( userAgent ),

        xoom: /xoom/.test( userAgent )
    };
    browser.name = pick(browser, ['chrome', 'safari', 'opera', 'firefox', 'msie', 'qqbrowser', 'ucbrowser', 'ucweb', 'wechart']);
    browser.core = pick(browser, ['mozilla', 'webkit', 'gecko', 'presto', 'xoom']);
    browser.version = (userAgent.match( /.+(?:rv|it|ra|ie|me|ve)[\/: ]([\d.]+)/ ) || [])[1];

    /**
     * @name OS
     * @memberOf ua
     * @desc 操作传统信息
     * @example
     * //调用
     * TOP.mobile.ua.OS
     */
    this.OS = OS;
    /**
     * @name browser
     * @memberOf ua
     * @desc 浏览器信息
     * @example
     * //调用
     * TOP.mobile.ua.browser
     */
    this.browser = browser;

    //下面的属性是对外的，用来做逻辑判断用的
    /**
     * @name iphone
     * @memberOf ua
     * @desc 设备是否为iphone
     * @example
     * //调用
     * TOP.mobile.ua.iphone
     */
    this.iphone = (userAgent.match(/iphone os/i) == "iphone os") || OS.iphone || OS.ipod;
    /**
     * @name ipad
     * @memberOf ua
     * @desc 设备是否为ipad
     * @example
     * //调用
     * TOP.mobile.ua.ipad
     */
    this.ipad = (userAgent.match(/ipad/i) == "ipad") || OS.ipad;
    /**
     * @name android
     * @memberOf ua
     * @desc 设备是否为android
     * @example
     * //调用
     * TOP.mobile.ua.android
     */
    this.android = unKown || (userAgent.match(/android/i) == "android") ||OS.android || OS.androidPhone || OS.androidPad;
    /**
     * @name ios
     * @memberOf ua
     * @desc 设备系统是否为ios
     * @example
     * //调用
     * TOP.mobile.ua.ios
     */
    this.ios = this.iphone || this.ipad;
    /**
     * @name isInQianniu
     * @memberOf ua
     * @desc 是否在千牛应用中
     * @example
     * //调用
     * TOP.mobile.ua.isInQianniu
     */
    this.isInQianniu = /AliApp\(QN\//i.test(userAgent);
    /**
     * @name isInAliApp
     * @memberOf ua
     * @desc 是否在阿里的App中
     * @example
     * //调用
     * TOP.mobile.ua.isInAliApp
     */    
    this.isInAliApp = /AliApp/i.test(userAgent);

});


var listeners = {};

function event(){
    var caller = this;
    this['on']=function(id,ev,fn,once){
        if(!isFunction(fn)){
            return;
        }
        if(once){
            var oldFn = fn;
            fn = function(args){
                oldFn.call(this, args);
                caller.off(id, ev, fn);
            }
        }

        if(!listeners[id]) {
            listeners[id] = {};
        }
        if(!listeners[id][ev]) {
            listeners[id][ev] = [];
        }

        // 不使用push的原因：见fire方法
        listeners[id][ev].unshift(fn);
    };
    this['off']=function(id, ev,fn) {
        if(!listeners[id]) {
            return;
        }
        if(!listeners[id][ev]) {
            return;
        }
        if(arguments.length == 2){
             delete listeners[id][ev];
        }else{
            var fns = listeners[id][ev];
            for(var i = 0, len = fns.length; i < len; i++) {
                if(fns[i] == fn) {
                    fns.splice(i, 1);
                    return;
                }
            }
        }

    }
    this['fire']=function(id, ev, data) {
        if(listeners[id] && listeners[id][ev]) {
            var fns = listeners[id][ev];
            /*
             * 一次性的监听函数会使fns的长度在fire的过程中发生变化
             * 如果顺序处理，需要判断fns的长度变化以调整i的值
             */
            for(var i = fns.length - 1; i >= 0; i--){
                fns[i](data);
            }
        }
    };
    //内部使用，列出所有的监听者
    this['_list']=function(id, ev) {
        if(listeners[id] && listeners[id][ev]) {
            return listeners[id][ev];
        }else{
            return null;
        }
    }
}

//event
(function(global){

    event.apply(global);
    
})(mobile);


var invokeEvent = {}
var setTimeoutFn = window.setTimeout;
var clearTimeoutFn = window.clearTimeout;
var defaultTimeout = 20000;
var androidEnv = function(){
    try{
        return !!(JDY && JDY.dispatchEvent);
    }catch(e){
        return false;
    }
};
//IOS invoke
function invokeIos(){
    var on = this.on;
    var fire = this.fire;
    var _list = this._list;

    this['invoke']=function(method,params,cb,timeout){

            if(document.body){
                if(!timeout){
                    timeout = defaultTimeout;
                }

                var uuid = guid();
                var timer;

                var src = 'tbsellerplatformbrage://'+method+'/'+uuid+"?"+param(trim(params));
                var execIframe = createExecIframe(src);
                on(invokeEvent,uuid,function(data){
                    if (timer) {
                        clearTimeoutFn(timer);
                    }
                    execIframe && execIframe.parentNode.removeChild(execIframe);
                    execIframe = null;
                    cb && cb(data);
                },true);

                if(timeout > 0){
                    timer = setTimeoutFn(function(){
                        timer = null;
                        fire(invokeEvent,uuid,'timeout');
                    },timeout);
                }
            }else{
                var self = this;
                setTimeout(function(){
                    self.invoke(method,params,cb,timeout);
                },500);
            }
    }
    this['callback']=function(uuid,data,stream){
        var cb = null;
        if(stream){
            var listener = _list(invokeEvent,uuid);
            if(listener && listener.length > 0){
                cb = listener[0];
            }
        }
        fire(invokeEvent,uuid,data);
        if(stream && cb){ //如果是stream类型，会收到多次
            on(invokeEvent,uuid,cb,true);
        }
    }
}

//API bridge andorid

function invokeAndroid(){
    var on = this.on;
    var fire = this.fire;
    var _list = this._list;
    var env = androidEnv();
    this['invoke']=function(method,params,cb,timeout){
        var uuid = guid();
        var bridge = {
            command:method,
            parameter:params,
            sequence:uuid
        };
        var timer;
        on(invokeEvent,uuid,function(data){
            if (timer) {
                clearTimeoutFn(timer);
            };
            cb && cb(data);
        },true);

        //android 2.3下，一使用JDY对象就会抛错，这个时候需要调用prompt
        if(env){
            JDY.dispatchEvent(JSON.stringify(bridge));
        }else{
            prompt('dispatchEvent',JSON.stringify(bridge));
        }
        if(!timeout){
            timeout = defaultTimeout;
        }
        if(timeout > 0){
            timer = setTimeoutFn(function(){
                timer = null;
                fire(invokeEvent,uuid,'timeout');
            },timeout);
        }
    }

    this['callback']=function(uuid,data,stream){
        var cb = null;
        if(stream){
            var listener = _list(invokeEvent,uuid);
            if(listener && listener.length > 0){
                cb = listener[0];
            }
        }
        fire(invokeEvent,uuid,data);
        if(stream && cb){ //如果是stream类型，会收到多次
            on(invokeEvent,uuid,cb,true);
        }
    }

};

//unsupported
function invokeUnsupport(){
    this['invoke']=function(method,params,cb,timeout){
        console && console.log &&  console.log("unsupported env");
    }
    this['callback']=function(uuid,data){

    }
}

//UA and Mobile Properties
(function(mobile){
    mobile._initInvoke = function(){
        if (this.ua.isInQianniu) {
            if(this.ua.iphone || this.ua.ipad){
                invokeIos.apply(this);
            } else if(androidEnv() || this.ua.android){
                invokeAndroid.apply(this);
            } else {
                invokeUnsupport.apply(this);
            }
        } else {
            invokeUnsupport.apply(this);
        }
    };
    mobile._initInvoke();
})(mobile);

(function(mobile){

    if ( document.readyState === "complete" ) {
        mobile.invoke('jSBroadcast',{
            event:"DOMContentLoaded"
        });
        mobile.invoke('jSBroadcast',{
            event:"load"
        });
    }else{
        document.addEventListener("DOMContentLoaded",function(){
            mobile.invoke('jSBroadcast',{
                event:"DOMContentLoaded"
            });
        },false);

        window.addEventListener("load",function(){
            mobile.invoke('jSBroadcast',{
                event:"load"
            });
        },false);
    }
    window.addEventListener("hashchange",function(){
        mobile.invoke('jSBroadcast',{
            event:"hashchange"
        });
    },false);

})(mobile);






    mobile.ConditionLatch = function(){
        var conditons = [];
        for(var index in arguments){
            if(isString(arguments[index])){
                conditons.push(arguments[index]);
            }
        }
        var callback;
        var target = this;
        this.await = function(cb){
             callback = cb;
        }
        this.countdown = function(condition){
              if(isString(condition)){
                  for(var i = 0, len = conditons.length; i < len; i++) {
                      if(conditons[i] == condition) {
                          conditons.splice(i, 1);
                      }
                  }
                  if(conditons.length <= 0 && callback){
                      isFunction(callback) && callback.call(target,target);
                      callback = null;
                  }
              }
        }

    };
    mobile.CountDownLatch = function(numberCountDown){
        var count  = (isNumeric(numberCountDown) && numberCountDown >=0) ? numberCountDown : 0;
        var callback;
        var target = this;
        this.await = function(cb){
            callback = cb;
        }
        this.countdown = function(){
            count = count - 1;
            if(count <= 0 && callback){
                isFunction(callback) && callback.call(target,target);
                callback = null;
            }
        }


    };

    //for ios bugfix
    //如果界面里存在空的select，当用户点击后，滑动选择器会crash，所以如果select为0，不能让选择器弹出来
    if(mobile.ua.ios) {
        document.addEventListener('click', function(event) {
            var target = event.target;
            if(target && target.tagName.toUpperCase() == "SELECT" && event.target.options.length==0){
                target.blur();
                alert("无选项可供选择");
            }
        }, false);
    }

    global.mobile = mobile;

})((window.TOP = window.TOP || {}));

(function(mobile){
    var vpageProperties = false;
    var canGoBackProperties = true;
    /**
    * @namespace vpage
    * 
    * @desc <h4>页面控制模块，用户可以选择当前页面是否开启代理</h4>
    * <p>如果当前页面要开启代理  TOP.mobile.vpage(true);</p>
    * 
    * 开启菜单代理详情请看{@link //open.taobao.com/doc/detail.htm?spm=0.0.0.0.6XcJrr&id=102103}
    *
    */
    var vpage = function(pro){
    // function vpage(pro){
        if(arguments.length == 0){
            return vpageProperties;
        }else{
            if (pro) {
                vpageProperties = true;
            }else{
                vpageProperties = false;
            }
            mobile.invoke('vpageRefresh',{
                vpage:vpageProperties,
                canGoBack:canGoBackProperties,
                title:document.title,
                action:"set"
            });
        }
    };

    /**
    * @name canGoback
    * @memberOf vpage
    * @function
    * @desc 在开启代理的情况下，控制回退按钮是否显示
    * 
    * @param {boolean} [pro] 控制回退按钮是否显示
    * @example
    * //回退按钮显示
    * TOP.mobile.vpage.canGoBack(true);
    */
    vpage.canGoBack = function(pro){
        if(arguments.length == 0){
            return canGoBackProperties;
        }else{
            if (pro) {
                canGoBackProperties = true;
            }else{
                canGoBackProperties = false;
            }
            //兼容代码：TOP.mobile.canGoBack
            mobile.canGoBack = canGoBackProperties;
            mobile.invoke('vpageRefresh',{
                vpage:vpageProperties,
                canGoBack:canGoBackProperties,
                title:document.title,
                action:"set"
            });
        }
    };
    /**
    * @name title
    * @memberOf vpage
    * @function
    * @desc 修改页面标题
    * 
    * @param {string} [pro] 标题
    * @example
    * //将标题修改为“千牛二周年”
    * TOP.mobile.vpage.title("千牛二周年");
    */
    vpage.title = function(pro){
        if(arguments.length == 0){
            return document.title;
        }else{
            document.title = pro;
            mobile.invoke('vpageRefresh',{
                vpage:vpageProperties,
                canGoBack:canGoBackProperties,
                title:document.title,
                action:"set"
            });
        }
    };

    /**
    * @name close
    * @memberOf vpage
    * @function
    * @desc 关闭页面容器
    * 
    * @param {number} [delay] 延时毫秒数,默认是100ms
    * @example
    * //让窗口200ms后关闭
    * TOP.mobile.vpage.close(200);
    */
    vpage.close = function(delay){
        //close 接口延迟1秒触发
        setTimeout(function(){
            mobile.invoke('vpageRefresh',{
                action:"close"
            });
        },delay||100);
    };

    mobile['vpage'] = vpage;

})(TOP.mobile);






(function(){
     var mobile = TOP.mobile;
     var ua = mobile.ua;
     var util = mobile.util;
    /***  
    * @namespace item
    * @desc 去往商品相关页面
    */
    mobile.ns('item',function(){
        /***
        * @name list
        * @memberOf item
        * @function
        * @desc 跳到商品列表
        * 
        * @param {string} itemStatus item状态,可选值为onsale、
        * @example
        * //在售卖的
        * TOP.mobile.item.list('onsale');
        */
        this.list = function(itemStatus){
            mobile.invoke(
                'itemList',
                {
                    itemStatus: itemStatus
                });
        }
        /***
        * @name list
        * @memberOf item
        * @function
        * @desc 跳到商品列表
        * @desc 去往商品详情
        * @param {string} num_iid 商品num_iid
        * @example
        * TOP.mobile.item.detail('2678678332');
        */
        this.detail = function(num_iid){
            mobile.invoke(
                'itemDetail',
                {
                    num_iid:num_iid
            });
        }
    });

    /***  
    * @namespace trade
    * @desc 交易相关模块
    */
    mobile.ns('trade',function(){
        /***
         * @name list
         * @memberOf trade
         * @function
         * @desc 跳到交易列表
         * @param  {object} searcher [交易相关信息JSON]
         * @example
         * TOP.mobile.trade.list({
         *    tradeStatus:'wait_for_pay', //交易状态
         *    buyerNick:'zhudi', //卖家昵称
         *    startCreated:'1234', //
         *    endCreated:'423432', //
         *    user_id:'5566733' //
         * })
         * 
         */
        this.list = function(searcher){
            mobile.invoke('tradeList',searcher);
        }

        /***
         * @name list
         * @memberOf item
         * @function
         * @desc 交易详情
         * @param  {number} tid [交易id]
         * @example
         * TOP.mobile.trade.detail(4645345345356353534534);
         * 
         */
        this.detail = function(tid){
            mobile.invoke(
                'tradeDetail',
                {
                    tid:tid
                });
        }
    });

    /***
     * @namespace ww
     * @desc 旺旺模块
     */
    mobile.ns('ww',function(){
        /***
         * @name chat
         * @memberOf ww
         * @function
         * @desc 调起旺旺聊天
         * @param  {object} chatInfo 聊天信息JSON
         * @example
         * TOP.mobile.ww.chat({
         *    chatNick:'商家测试帐号1',           //商家昵称
         *    text:'你好,欢迎',                  //聊天内容
         *    domain_code:taobao|alichn|aliint  //domain_cod聊天用户所属站点，可选值有taobao(淘宝)|alichn(阿里巴巴中文站)|aliint(阿里国际站)
         *    iid:'124234234234',               //iid
         *    tid:'42423423423423'              //tid
         * });
         */
        this.chat = function(chatInfo){
            mobile.invoke('chat',chatInfo);
        }
    });

    /***
     * @module fileManager
     * @desc 文件管理模块
     */
    mobile.ns("fileManager",function(){
        var fileMapping = {};
        /***
         * module:fileManager
         * @desc  存储文件
         * @param  {string} [guid] 随机标示符，可传可不传
         * @param  {string} file 文件名字
         * 
         */
        this._storeFile = function(){
            var guid;
            var file;
            if(arguments.length == 1){
                guid = util.guid();
                file = arguments[0];
            }else{
                guid = arguments[0];
                file = arguments[1];
            }
            fileMapping[guid] = file;
            return guid;
        }
        this._getFile = function(guid){
            return fileMapping[guid];
        }
        this._removeFile = function(guid){
            delete fileMapping[guid];
        }
    });

    /**
     * @namespace sys
     * @desc 系统模块
     */
    mobile.ns('sys',function(){
        /**
         * @name pasteboard
         * @memberOf sys
         * @function
         * @desc 剪切板操作
         * @param  {string|function} text 当text为string格式时表示复制到剪切板，当为function格式时表示从剪切板获取内容
         * @example
         * //复制到剪切板
         * TOP.mobile.sys.pasteboard('亲，把我复制到剪切板吧');
         * //从剪切板获取内容
         * TOP.mobile.sys.pasteboard(function(info){
         *     //对拿到的信息进行操作
         *     alert(info);
         * });
         */
        this.pasteboard = function(text){
            if(util.isString(text)){
                mobile.invoke(
                    'pasteboard',
                    {
                        content:text,
                        type:'text',
                        action:'copy'
                    });
            }else if(util.isFunction(text)){
                var cb = text;
                mobile.invoke(
                    'pasteboard',
                    {action:'paste'},
                    cb);
            }
        }

        // 想用的直接用camera里面scan就好了
        this.scan = function(cb){
            mobile.invoke('scan',{},cb,-1);
        }

        /**
         * @name sso
         * @memberOf sys
         * @function
         * @desc 发起sso
         * @param  {function} cb 回调函数
         * @example
         * TOP.mobile.sys.sso(function(info){
         *     //回调函数代码
         * });
         */
        this.sso = function(cb){
            mobile.invoke(
                'sso',
                {forceRefresh:true},
                cb,-1);
        }
        var fileManager = mobile.fileManager;

        // top性能监控打点
        // HOLD top打点可以直接在客户端加过滤，目前needTopUac永远返回false
//        var trackUac = function(timing, apiParam, response) {
//            timing.end = performance.now();
//            var pageInfo = mobile.page || {};
//            if (pageInfo.needTopUac) {
//                var data = [pageInfo.networkEnvironment, pageInfo.pluginId, apiParam.method, pageInfo.isMain, !!response.error_response,
//                    '', '', 0, '', '', '', '', '', '', '', '', '', '', '', '',
//                    Math.round(timing.end - timing.start), '', '', '', '', '', '', '', '', '', ''];
//                if (response.error_response) {
//                    data.push(response.error_response.code);
//                    var errorMsg = response.error_response.msg || response.error_response.sub_msg;
//                    errorMsg && data.push(errorMsg);
//                }
//                mobile.invoke('pluginPerformanceUacLog', {
//                    cmd : apiParam.method,
//                    data : data
//                })
//            }
//        };
//        
        /**
         * @name api
         * @memberOf sys
         * @function
         * @desc 客户端发起TOP API请求
         * @param  {object} parameters 注意：系统级参数只需要输入method，其他的（appkey,session,sign）容器会替你填入；如果涉及到文件上传类型API，请将文件转成{name:name,data:base64String}格式的对象
         * @example
         * //例子一：
         * var request = TOP.mobile.sys.api({
         *     method:'taobao.user.seller.get',
         *     fields:'nick,sex,seller_credit,type,alipay_bind,consumer_protection,avatar,online_gaming'
         * });
         * request(function(result){
         *     alert(JSON.stringify(result));
         * });
         *
         * //例子二：上传图片类
         * var request = TOP.mobile.sys.api({
         *     method:'taobao.picture.upload',
         *     picture_category_id:3,
         *     //涉及到文件上传类型API，请将文件转成{name:name,data:base64String}格式的对象
         *     img:{
         *         name:"Bule.jpg",
         *         data:"data:image/gif;base64,R0lGODlhAwADAIABAL6+vv///yH5BAEAAAEALAAAAAADAAMAAAIDjA9WADs="
         *     },
         *     image_input_title:"Bule.jpg",
         *     title:"zhudi test"
         * });
         * request(function(result){
         *     alert(JSON.stringify(result));
         * });
         */
        this.api = function(parameters){ // MARK 2015.01.21 增加top性能监控 HOLD
            //var timing = {start : performance.now(),end : 0};

            return function(cb,timeout){
                var ios = ua.iphone || ua.ipad;
                var apiPara = parameters;
                if(ios){
                    apiPara = {};
                    for(var key in parameters){
                        if(parameters.hasOwnProperty(key) && util.isObject(parameters[key])){
                            apiPara[key] = "zd://["+util.guid()+"]";//私有协议
                            fileManager._storeFile(apiPara[key],parameters[key]);
                        }else{
                            apiPara[key] = parameters[key];
                        }
                    }
                }
                mobile.invoke(
                    'api',apiPara,
                    function(resp){
                        if(resp.error_response){
                           var sessionInvalid = resp.error_response.code == 26
                               ||resp.error_response.code == 27
                               || resp.error_response.code == 53;
                           if(sessionInvalid){ //如果失效，调用SSO后重新发起API请求，只重试一次
                               mobile.invoke(
                                   'sso',
                                   {forceRefresh:true},
                                   function(){
                                       mobile.invoke(
                                           'api',apiPara,cb,timeout);
                                   },3000);
                           }else{
                               cb && cb.apply(this,arguments);
                           }
                        }else{
                            cb && cb.apply(this,arguments);
                        }

                        // call track uac method
                        //trackUac(timing, apiPara, resp);
                    },timeout);
            }
        }

        //获取一些设备信息
        this.InformationOption = {
           NETWORK:"network",
           SYS_VERSION:"sysVersion",
           SYS_NAME:"sysName",
           QN_VERSION:"clientVersion"
        }

        /**
         * @name information
         * @memberOf sys
         * @function
         * @desc 获取系统信息
         * @param  {Array} optionArray 要查询的项组成的数组，目前支持network(网络类型)、sysVersion(操作系统版本)、sysName(传统名称)、clientVersion(千牛版本)
         * @example
         * var system = TOP.mobile.sys,
         *     InformationOption = system.InformationOption;
         * //获取系统信息，需要查什么optionArray传什么
         * system.information([InformationOption.NETWORK,InformationOption.QN_VERSION],function(info){
         * 
         * });
         *
         * // InformationOption 为要查询的option，目前可选的有：
         *    // NETWORK:网络情况
         *    // SYS_VERSION:系统版本
         *    // SYS_NAME:系统名称
         *    // QN_VERSION:千牛版本
         */
        this.information = function(optionArray,cb){
            mobile.invoke(
                'clientinfo',{fields:optionArray.join(",")},
                cb);
        }
    });

    /**
     * @namespace notification
     * @desc 设备视觉、声音和触觉反馈模块
     */
    mobile.ns('notification',function(){

        function UIAlert(){
            this.uuid = mobile.util.guid();
            this.text = "";
            this.listener = [];
        }

        UIAlert.prototype.show = function(){
            if(document.getElementById(this.uuid)){
                return;
            }
            var div = document.createElement("div");
            div.id = this.uuid;
            div.style.width = '30%';
            div.style.backgroundColor = "black";
            div.style.margin = "10px 25%";
            div.style.padding = "20px 10%";
            div.style.opacity = "0.7";
            div.style.zIndex = 10000;
            div.style.position = "absolute";
            div.style.top = (window.innerHeight/3+window.scrollY)+"px";
            div.style.webkitBorderRadius = "8px";
            div.style.borderRadius = "8px";
            div.style.color = "white";
            div.style.wordBreak = "break-all";
            div.style.fontSize = "1em";
            div.style.textAlign = "center";
            div.innerText = this.text;
            var backMark = document.createElement("div");
            backMark.id = this.uuid + "_back";
            backMark.style.position = "absolute";
            backMark.style.top = "0px";
            backMark.style.backgroundColor = "black";
            backMark.style.opacity = "0";
            backMark.style.filter="alpha(opacity=0)";
            backMark.style.width = "100%";
            backMark.style.height = document.body.scrollHeight+"px";
            backMark.style.zIndex = 9999;
            var self = this;
            backMark.addEventListener("click",function(e){
                for(var index in self.listener){
                    self.listener[index](e);
                }
            },false);
            document.body.appendChild(backMark);
            document.body.appendChild(div);
        }

        UIAlert.prototype.hide = function(){
            var div = document.getElementById(this.uuid);
            var backMark = document.getElementById(this.uuid+"_back");
            if(div){
                setTimeout(function(){
                    div.style.opacity = "0.5";
                    setTimeout(function(){
                        div.style.opacity = "0.3";
                        setTimeout(function(){
                            document.body.removeChild(div);
                            document.body.removeChild(backMark);
                        },50);
                    },50);
                },50);
            }
        }

        UIAlert.prototype.tap = function(cb){
            mobile.util.isFunction(cb) && this.listener.push(cb);
        }

        /**
         * @name warn
         * @memberOf notification
         * @function
         * @desc 提醒
         * @param {string} [text] 提醒的文案
         * @param {number} [delay] 提醒窗口出现的时间延时，单位ms
         * @return {object} UIAlert
         *
         * @example
         * var notification = TOP.mobile.notification;
         * notification.warn('这是警告文案', 2000); 
         */
        this.warn = function(text,delay){
            var a = new UIAlert();
            a.text = text;
            a.show();
            setTimeout(function(){
                a.hide();
            },(delay&&delay>0)?delay:2000);
            return a;
        }

        /**
         * @name error
         * @memberOf notification
         * @function
         * @desc 错误提示
         * @param  {string} text  错误文案
         * @return {object}       UIAlert
         *
         * @example
         * var notification = TOP.mobile.notification;
         * notification.error('这是错误文案'); 
         */
        this.error = function(text){
            var a = new UIAlert();
            a.text = text;
            a.show();
            a.tap(function(){
                a.hide();
            });
            return a;
        }

        /**
         * @name vibrate
         * @memberOf notification
         * @function
         * @desc 震动起来
         * 
         * @example
         * var notification = TOP.mobile.notification;
         * notification.vibrate();     
         */
        this.vibrate = function(){
            mobile.invoke("notification",{
                action:"vibrate"
            });
        }
        
        /**
         * @name lockscreen
         * @memberOf notification
         * @function
         * @desc 锁屏操作
         * @param {boolean} lock 是否允许锁屏，true表示允许锁屏，false表示不允许锁屏
         * @see {@link //www.taobao.com} 查看源码
         * 
         * @example
         * var notification = TOP.mobile.notification;
         * //允许锁屏
         * notification.lockscreen(true);
         * //不允许锁屏，lock 参数不传相当于false
         * notification.lockscreen(false);
         */
        this.lockscreen = function(lock){
            mobile.invoke("notification",{
                action:"lockscreen",
                disable:lock?"false":"true"
            });
        }
    });
    
    /**
     * @namespace widget
     * @desc 组件模块
     */
    mobile.ns('widget',function(){
        /**
         * @name pay
         * @memberOf widget
         * @function
         * @desc 呼起支付宝支付流程
         * @param {string} trade_no 交易号字符串
         * @return cb 回调函数
         * 
         * @example
         * var ui = TOP.mobile.widget.pay('324232;423434;424324');
         * ui(function(info){
         *     //回调函数
         * });
         */
        this.pay = function(trade_no){
            return function(cb){
                mobile.invoke(
                    'pay',
                    {trade_no:trade_no},
                    cb,-1);
            }
        }

        /**
         * @name payBySimpleSDK
         * @memberOf widget
         * @function
         * @desc 使用支付宝极简SDK
         * @param {string} orderString 订单字符串
         * @return cb 回调函数
         * 
         * @example
         * //orderString由业务方和支付宝相关人员约定
         * var ui = TOP.mobile.widget.payBySimpleSDK(orderString);
         * ui(function(result){
         *     //回调函数
         * });
         */
        this.payBySimpleSDK = function(orderString){
            return function(cb){
                mobile.invoke(
                    'pay',
                    {orderString:orderString},
                    cb,-1);
            }
        }

        /***
         * @name order
         * @memberOf widget
         * @function
         * @desc 订购引导
         * @param {string} article_code 订单字符串
         * @return cb 回调函数
         * 
         * @example
         * var ui = TOP.mobile.widget.order(article_code);
         * ui(function(result){
         *     //回调函数
         * });
         */
        this.order = function(article_code){
            return function(cb){
                mobile.invoke('sub_plugin',{
                    target_article_code:article_code
                },cb,-1);
            }
        }

        /***
         * @name changePrice
         * @memberOf widget
         * @function
         * @desc 改价组件
         * @param {number} tid 商品id
         * @return cb 回调函数
         * 
         * @example
         * var ui = TOP.mobile.widget.changePrice(424232234234);
         * ui(function(result){
         *     //回调函数
         * });
         */
        this.changePrice = function(tid){
            return function(cb){
                mobile.invoke(
                    'ui',{uiname:'changePrice',
                     tid:tid},cb,-1);
            }
        }

        /***
         * @name refund
         * @memberOf widget
         * @function
         * @desc 退款组件
         * @param {number} rid 退款单号
         * @return cb 回调函数
         * 
         * @example
         * var ui = TOP.mobile.widget.refund(424232234234);
         * ui(function(result){
         *     //回调函数
         * });
         *
         * //注意：只有以下四种情况可以呼出
         * //(1)买家已付款，卖家未发货，等待卖家同意退款
         * //(2)卖家已发货，买家未收到货，等待卖家同意退款
         * //(3)买家已收到货，申请退款（不需要退货），等待卖家同意退款
         * //(4)买家已退货，等待卖家同意退款
         */
        this.refund = function(rid){
            return function(cb){
                mobile.invoke(
                    'ui',{uiname:'refund',
                        rid:rid},cb,-1);
            }
        }
    });

    /**
     * @namespace contacts
     * @desc 联系人模块
     */
    mobile.ns('contacts',function(){
        this.pageIndex = 0;
        this.pageSize = 1000;
        /**
        * @name list
        * @memberOf contacts
        * @function
        * @desc 获取联系人列表
        * @param {function} callback 回调函数
        * @example
        * TOP.mobile.contacts.list(function(info){
        *     //如果无权访问用户的通讯录，会返回code，所以要做好兼容
        *     if(info.code) {
        *         alert("错误码："+info.code);
        *     } else {
        *         //成功情况下对应的操作
        *     }
        * });
        */
        this.list = function(cb){
            TOP.mobile.invoke(
                'addressBookPick',{
                    pageIndex:this.pageIndex>=0?this.pageIndex:0,
                    pageSize:this.pageSize>=0?this.pageSize:1000
            },cb,-1);
        }
        if(!ua.iphone && !ua.ipad){ //如果不是IOS
           this.myPhoneNum = function(cb){
               TOP.mobile.invoke(
                   'addressBookPick',{
                       action:'myself'
                },cb,-1);
           }
        }
    });

    /**
     * @namespace fm
     * @desc 电台模块
     */
    mobile.ns('fm',function(){
        /**
        * @name spread
        * @memberOf fm
        * @function
        * @desc 帮用户订阅电台
        * @param {array} subscription 二级类目数组
        * @param {function} cb 成功回调函数
        * 
        * @example
        * TOP.mobile.fm.spread(['68313','36789'], function(result){
        *     alert(JSON.stringify(result));
        * });
        */
        this.spread = function(subscription,cb){
            mobile.invoke("fmSubscribe",{
                action:"update",
                subscription:subscription.join(",")
            },cb,-1);
        }

        /**
        * @name info
        * @memberOf fm
        * @function
        * @desc 查询用户的电台订阅信息
        * @param {function} cb  成功回调函数
        * 
        * @example
        * TOP.mobile.fm.info(function(result){
        *     alert(JSON.stringify(result));
        * });
        */
        this.info = function(cb){
            mobile.invoke("fmSubscribe",{action:"select"},arguments[0],-1);
        }

        /**
        * @name openSetting
        * @memberOf fm
        * @function
        * @desc 通用推广
        * @param {string} fm  需要通用推广的电台id
        * 
        * @example
        * TOP.mobile.fm.openSetting('6789687');
        * 
        */
        this.openSetting = function(fm){
            var ios = ua.iphone || ua.ipad;
            if(ios){
                mobile.invoke("fmSubscribe",{
                    action:"openSetting",
                    fm:fm?fm:null
                });
            }else{
                var fmCallerFrame = mobile.util.createExecIframe();
                fmCallerFrame.src = "tbsellerplatform://?session_event=event_back_platform&module=module_messagecenter&sub_module=submodule_fm_info&service_id="+fm;
                setTimeout(function(){
                    fmCallerFrame && fmCallerFrame.parentNode.removeChild(fmCallerFrame);
                },10000);
            }
        }

        /**
        * @name getIconBadgeNumber
        * @memberOf fm
        * @function
        * @desc 获取电台未读消息数
        * @param {string} [fm_id] 电台一级类目，如果不填，默认取绑定FM
        * @param {function} cb 回调函数
        * 
        * @example
        * TOP.mobile.fm.getIconBadgeNumber('6789687',function(result){
        *     //回调函数
        * });
        * 
        */
        this.getIconBadgeNumber = function(){
            var cb = null;
            var fm = null;
            if(arguments.length == 1){
               if(util.isFunction(arguments[0])){
                   cb = arguments[0];
               }else{
                   fm = arguments[0];
               }
            }else if(arguments.length > 1){
                fm = arguments[0];
                cb = util.isFunction(arguments[1])?arguments[1]:0;
            }
            mobile.invoke("fmSubscribe",{
                action:"getUnReadNum",
                fm:fm?fm:null
            },cb);
        }
    });
    
    /**
     * @namespace device
     * @desc 设备模块
     * @private
     */
    mobile.ns('device',function(){
        //图片选取
        var ios = ua.iphone || ua.ipad;
        var camera = {};
        var PictureSourceType = {
            PHOTO_ALBUM:1,
            CAMERA:2
        };
        var PictureMIMEType = {
            PNG:1,
            JPEG:2
        };
        var PictureReturnType = {
            IMAGE:1,
            REF:2
        }
        camera.sourceType = PictureSourceType.PHOTO_ALBUM;
        camera.PictureSourceType = PictureSourceType;
        camera.PictureMIMEType = PictureMIMEType;
        camera.mimeType = PictureMIMEType.PNG;
        camera.PictureReturnType=PictureReturnType;
        camera.returnType = PictureReturnType.IMAGE;
        function getPicture(cb,source,mimeType,size,quality){
            mobile.invoke('camera',{
                action:"getPicture",
                sourceType:source||camera.sourceType,
                quality:quality||100,
                size:size||"",
                mimeType:mimeType||camera.mimeType,
                limit:1,
                returnType:camera.returnType
            },function(data){
                //兼容新老格式的协议
                 if(data.datas && util.isArray(data.datas) && data.datas.length > 0){
                     data.data = data.datas[0].base64;
                     data.size = data.datas[0].size;
                     delete data.datas;
                     cb && cb.call(this,data);
                 }else{
                     cb && cb.call(this,data);
                 }
            },-1);
        };
        function getPictureV2(conf){
            mobile.invoke('camera',{
                action:"getPicture",
                sourceType:conf.sourceType||camera.sourceType,
                quality:conf.quality||100,
                size:conf.size||"",
                mimeType:conf.mimeType||camera.mimeType,
                limit:conf.limit||1,
                returnType:conf.returnType||camera.returnType
            },function(data){
                //兼容新老格式的协议
                if(data.data){
                    data.datas = [{
                        base64:data.data,
                        size:data.size
                    }];
                    delete data.data;
                    delete data.size;
                    conf.cb && conf.cb.call(this,data);
                }else{
                    conf.cb && conf.cb.call(this,data);
                }

            },-1);
        };
        /**
        * @namespace device.camera
        * @desc device.camera 设备模块
        * @name device.camera
        */        

        /**
        * @name getPicture
        * @memberOf device.camera
        * @function
        * @desc 获取图片接口说明
        * @param {object} conf 关于配置的JSON
        * @param {number} [conf.sourceType] 图片来源类型，可选值为1|2，其中1代表从相册获取，2激起摄像头，默认是1
        * @param {number} [conf.quality] 图片质量，为0-100之间的数值，表示JPEG类型图片的压缩比（其他图片格式暂时不支持），默认为100
        * @param {string} [conf.size] 为width_height格式，表示图片的大小。如100_*、200_100、200_*
        * @param {number} [conf.limit] 图片数量 默认是一张
        * @param {number} [conf.mineType] 图片格式，可选值为1|2，1代表PNG（默认值为1），2代表JPG
        * @param {number} [conf.returnType] 返回图片格式，可选值为1|2，1代表IMAGE(默认为1)，2代表REF
        * @param {function} conf.cb 回调函数
        * 
        * @example
        * var camera = TOP.mobile.device.camera;
        * camera.getPicture({
        *     //照片通过拍照获得
        *     sourceType: 2,
        *     //图片质量为100,这句可以省略
        *     quality: 100,
        *     cb: function(){
        *         //回调
        *     }
        * });
        */
        camera.getPicture = function(){
            if(arguments.length == 1 && !util.isFunction(arguments[0])){
                getPictureV2.apply(this,arguments);
            }else{
                getPicture.apply(this,arguments);
            }
        };

        /**
        * @name getPictureByKey
        * @memberOf device.camera
        * @function
        * @desc 根据路径拿图片
        * @param {object} conf 关于配置的JSON
        * @param {string} conf.key 图片路径
        * @param {number} [conf.quality] 图片质量，为0-100之间的数值，表示JPEG类型图片的压缩比（其他图片格式暂时不支持），默认为100
        * @param {string} [conf.size] 为width_height格式，表示图片的大小。如100_*、200_100、200_*
        * @param {number} [conf.mineType] 图片格式，可选值为1|2，1代表PNG（默认值为1），2代表JPG
        * @param {function} conf.cb 回调函数
        * @return {object} 范例：{MIME:MIME,data:base64String,code:[0|-1|-2]},code中，code为0成功，code为-1用户取消，code为-2请求重复提交
        * 
        * @example
        * var camera = TOP.mobile.device.camera;
        * camera.getPictureByKey({
        *     //路径
        *     key: 'file://fhsjkh7',       
        *     
        *     //图片质量为100,这句可以省略
        *     quality: 100,
        *     cb: function(data){
        *         //回调
        *     }
        * });
        */
        camera.getPictureByKey = function(conf){
            mobile.invoke('camera',{
                action:"getPictureByUrl",
                key:conf.key,
                quality:conf.quality||100,
                size:conf.size||"",
                mimeType:conf.mimeType||camera.mimeType
            },conf.cb,-1);
        };

        /**
        * @name resize
        * @memberOf device.camera
        * @function
        * @desc 压缩图片接口
        * @param {function} cb 回调函数
        * @param {string} data 图片,base64格式
        * @param {number} [minType] 图片格式，可选值为1|2，1代表PNG（默认值为1），2代表JPG
        * @param {string} [size] 压缩的格式大小
        * 
        * @example
        * var camera = TOP.mobile.device.camera;
        * camera.resize(
        *   function(result){
        *       //成功回调
        *       $camera_t.eq(index-1).val(JSON.stringify(result));
        *   },
        *   'data:image/gif;base64,R0lGODlhBAABAIABAMLBwfLx8SH5BAEAAAEALAAAAAAEAAEAAAICRF4AOw==',
        *   2,
        *   '120_120'
        * );
        */
        camera.resize = function(cb,data,mimeType,size){

            var value = data;
            if(ios){
                var fileManager = mobile.fileManager;
                var g = util.guid();
                fileManager._storeFile(g,data);
                value = g;
            }
            mobile.invoke('camera',{
                action:"reSize",
                img:value,
                quality:100,
                size:size||"100_100",
                mimeType:mimeType||camera.mimeType
            },cb,-1);
        };

        /**
        * @name scan
        * @memberOf device.camera
        * @function
        * @desc 二维码扫描
        * @param {function} cb 成功回调函数
        * 
        * @example
        * var camera = TOP.mobile.device.camera;
        * camera.scan(function(info){
        *    alert(info);
        * });
        */
        camera.scan = function(cb){
            mobile.invoke('scan',{},cb,-1);
        };

        /**
        * @name save
        * @memberOf device.camera
        * @function
        * @desc 保存网络图片
        * @param {object} conf 关于配置的JSON
        * @param {string} [conf.img] 图片的base64 string, 跟url二选一
        * @param {string} [conf.url] 图片地址，跟img二选一
        * @param {function} conf.success 成功回调函数
        * @param {function} [conf.error] 错误回调函数
        * 
        * @example
        * var camera = TOP.mobile.device.camera;
        * camera.save({
        *     //img跟url二选一
        *     img: 'data:image/gif;base64,R0lGODlhBAABAIABAMLBwfLx8SH5BAEAAAEALAAAAAAEAAEAAAICRF4AOw==',
        *     //url: 'http://img.alicdn.com/tps/i1/TB19uLIHXXXXXbEXpXXc8PZ9XXX-130-200.png',
        *     success: function(){
        *         //成功回调
        *         console.log('保存成功');
        *     },
        *     error: function(){
        *         //错误回调
        *         console.log('保存失败');
        *     }
        * });
        */
        camera.save = function(conf){
            var value = conf.img;
            if(ios && conf.img){
                var fileManager = mobile.fileManager;
                var g = util.guid();
                fileManager._storeFile(g,conf.img);
                value = g;
            }
            mobile.invoke('camera',{
                action:"save",
                img:value,
                url:conf.url
            },function(result){
                if(result === true){
                    conf.success && conf.success();
                }else{
                    conf.error && conf.error();
                }
            },-1);
        };
        this.camera = camera;

        /**
         * @namespace device.audio
         * @desc device.audio 音频模块
         */
        var audio = {};
        var AudioMIMEType = {
            TEXT:1,
            MPEG:2
        }
        audio.mimeType = AudioMIMEType.TEXT;
        audio.AudioMIMEType = AudioMIMEType;
        /**
         * @name getRecording
         * @memberOf device.audio
         * @function
         * 
         * @param {number} [mimeType] 可选值为1|2，1代表TEXT（默认值为1），2代表MPEG
         * @param {function} cb 回调函数
         *
         * @example
         * TOP.mobile.device.audio.getRecording(function(result){
         *     //回调函数
         * }, 2);
         */
        audio.getRecording = function(cb,mimeType){
            mobile.invoke('audio',{
                action:"getRecording",
                mimeType:mimeType||audio.mimeType
            },cb,-1);
        }
        this.audio = audio;
    });


    /***
    * @namespace log
    * @desc 收集打点模块
    */
    mobile.ns('log',function(){

        var LogType = {
            event:1,
            consume:2
        };

        var EventType = {
            TAPED:"used",
            APPEAR:"appear"
        }

        /**
        * @namespace log.getLogger
        * @desc 打点收集模块
        */
        this.getLogger = function(module,page){

            var log = {};
            /**
             * @name used
             * @memberOf log.getLogger
             * @function
             * @desc 用户操作了页面上的某个功能的统计
             *
             * @param {string} btnName 表示功能名称
             * @example
             * var log = TOP.mobile.log.getLogger('itemDetail','itemUpateView');
             * log.used("sendGoods");
             */
            log.used = function(btnName){
                mobile.invoke('trace',{
                    module:module,
                    page:page,
                    type:LogType.event,
                    action:btnName,
                    actionValue:EventType.TAPED
                });
            };

            /**
             * @name consume
             * @memberOf log.getLogger
             * @function
             * @desc 功能消耗统计
             *
             * @param {string} consumeItem 表示功能名称
             * @param {number} consume 表示消耗时间，单位毫秒（ms）
             * @example
             * var log = TOP.mobile.log.getLogger('itemDetail','itemUpateView');
             * log.consume("sendGoods",500);
             */
            log.consume = function(consumeItem,consume){
                mobile.invoke('trace',{
                    module:module,
                    page:page,
                    type:LogType.consume,
                    action:consumeItem,
                    actionValue:consume
                });
            };
            /**
             * @name appear
             * @memberOf log.getLogger
             * @function
             * @desc 功能展示统计
             *
             * @param {string} areaName 表示展示的功能名称
             * @example
             * var log = TOP.mobile.log.getLogger('itemDetail','itemUpateView');
             * log.appear("showBuyerDetailInfo");
             */
            log.appear = function(areaName){
                mobile.invoke('trace',{
                    module:module,
                    page:page,
                    type:LogType.event,
                    action:areaName,
                    actionValue:EventType.APPEAR
                });
            }
            /**
             * @name pvTrace
             * @memberOf log.getLogger
             * @function
             * @desc 计算当前页面PV一次
             * 
             * @example
             * var log = TOP.mobile.log.getLogger('itemDetail','itemUpateView');
             * log.pvTrace();
             */
            log.pvTrace = function(){
                log.appear("");
            }

            return log;
        }
    });

    //给安全团队开的接口
    var android = !ua.iphone && !ua.ipad;
    if(android){ //如果不是IOS，才开security接口
        mobile.ns('security',function(){
            this.listInstallation = function(cb){
                mobile.invoke('security',{
                    action:'list'
                },cb);
            };

            this.uninstall = function(app,cb){
                mobile.invoke('security',{
                    action:"uninstall",
                    target:app
                },cb);
            }
        });
    }

    /**
     * @namespace application
     * @desc 调用千牛通用协议模块
     */
    mobile.ns('application',function(){
        /**
         * @name request
         * @memberOf application
         * @function
         * @desc 协议请求
         * 
         * @param {object} config 配置
         * @param {string} config.event 事件参数，也就是API name
         * @param {function} config.success 成功回调函数
         * @param {function} config.fail 失败回调函数
         *
         * @example
         * TOP.mobile.application.request({
         *     event: 'itemDetail',
         *     biz:{
         *          iid:’46745325400042342’
         *     },
         *     success:function(){
         *  
         *     },
         *     error:function(){
         *     
         *     }
         * 
         * });
         */
        this.request = function(config){
            mobile.invoke('caller',{
                type:config.type,
                value:config.value,
                event:config.event,
                biz:android?config.biz:JSON.stringify(config.biz)
            },function(resp){
                 if(resp.success){
                      util.isFunction(config.success) && config.success(resp.success);
                 }else{
                     util.isFunction(config.success) && config.error(resp.fail);
                 }
            },-1);
        }

        /**
         * @name respone
         * @memberOf application
         * @function
         * @desc 协议返回
         * 
         * @param {object} [jsonObject] 成功对象
         * @param {object} [jsonError] 错误对象
         *
         * @example
         * TOP.mobile.application.response({
         *     choose:[{
         *          iid:4543543153453234,
         *          title:'商品1'
         *      },{
         *           iid:4543543585453234,
         *          title:'商品2'
         *      }]
         * },null);
         */
        this.response = function(jsonObject,jsonError){
            mobile.invoke('caller',{
                success:jsonObject?JSON.stringify(jsonObject):null,
                error:jsonError?JSON.stringify(jsonError):null,
                'return':true
            });
        }
    });

})();





/**
 * 用于报告性能监控数据
 */

(function(mobile) {

    // iOS中目前仅有iOS8.0支持performance
    if (!window.performance || !window.performance.timing) return;

    if (!mobile.ua.isInQianniu) return; // 只有在千牛容器里面才打点

    var timing = performance.timing;

    !mobile.page && (mobile.page = {});

    var Track = {
        data: {
            networkEnvironment         : 'UNKNOWN',
            pluginId                   : '',
            // 'url|cmd'                  : '',
            url                        : location.protocol + '//' + location.host + location.pathname,
            isMain                     : 0,
            isSuccess                  : 1,
            redirectCount              : '',
            navigationType             : '',
            navigationStart            : 0,
            unloadEventStart           : '',
            unloadEventEnd             : '',
            redirectStart              : '',
            redirectEnd                : '',
            fetchStart                 : '',
            domainLookupStart          : '',
            domainLookupEnd            : '',
            connectStart               : '',
            connectEnd                 : '',
            secureConnectionStart      : '',
            requestStart               : '',
            responseStart              : '',
            responseEnd                : '',
            domLoading                 : '',
            domInteractive             : '',
            domContentLoadedEventStart : '',
            domContentLoadedEventEnd   : '',
            domComplete                : '',
            loadEventStart             : '',
            loadEventEnd               : '',
            initialJSHeapSize          : '',
            averageJSHeapSize          : '',
            maxJSHeapSize              : ''
            // ErrorCode                  : null,
            // ErrorCodeDesc              : null
        },

        loadEvent : {
            triggered : false,
            callbacks : []
        },

        events : function() {
            var self = this;
            window.addEventListener('load', function() {
                // 浏览器load事件触发后，某些performance数据依然不能马上获取到
                setTimeout(function() {
                    var exeCallbacks = function() {
                        if (self.loadEvent.callbacks.length === 0) return;
                        self.loadEvent.callbacks.shift().apply(self);
                        arguments.callee();
                    };
                    self.loadEvent.triggered = true;
                    exeCallbacks();
                });
            })
        },

        // 保证所有的方法在load之后执行
        winLoad : function(callback) {
            var self = this;
            if (self.loadEvent.triggered) {
                callback.apply(self);
                return;
            }
            self.loadEvent.callbacks.push(callback)
        },

        // 抽签决定是否需要做性能监控
        ballot : function() {
            var self = this;
            mobile.invoke('needPluginPerformanceUac', {
                url : self.data.url
            }, function(response) {
                if (!response || !response.needUac) return;

                mobile.page.needUac = response.needUac;
                mobile.page.needTopUac = response.needTopUac;
                mobile.page.pluginId = self.data.pluginId = response.pluginId;
                mobile.page.isMain = self.data.isMain = response.isMain ? 1 : 0;
                mobile.page.networkEnvironment = self.data.networkEnvironment = response.networkEnvironment;

                self.winLoad(function() {
                    // 初始化数据监听
                    self.calcData();
                    self.logPerformance();
                    self.trackJSHeap();
                })
            })
        },

        calcData : function() {
            var data  = this.data;
            var trackedJSHeapSize  = Number(localStorage.getItem('trackedJSHeapSize'));
            var trackedJSHeapCount = Number(localStorage.getItem('trackedJSHeapCount'));
            var navigationStart = timing.navigationStart;
            data.redirectCount              = performance.navigation.redirectCount;
            data.navigationType             = performance.navigation.type;
            data.navigationStart            = 0;
            if (timing.unloadEventStart) {
                data.unloadEventStart           = timing.unloadEventStart           - navigationStart;
            }
            if (timing.unloadEventEnd) {
                data.unloadEventEnd             = timing.unloadEventEnd             - navigationStart;
            }
            if (timing.redirectStart !== 0) {
                data.redirectStart          = timing.redirectStart              - navigationStart;
            }
            if (timing.redirectEnd !== 0) {
                data.redirectEnd            = timing.redirectEnd                - navigationStart;
            }
            data.fetchStart                 = timing.fetchStart                 - navigationStart;
            data.domainLookupStart          = timing.domainLookupStart          - navigationStart;
            data.domainLookupEnd            = timing.domainLookupEnd            - navigationStart;
            data.connectStart               = timing.connectStart               - navigationStart;
            data.connectEnd                 = timing.connectEnd                 - navigationStart;
            if (timing.secureConnectionStart !== 0) {
                data.secureConnectionStart  = timing.secureConnectionStart      - navigationStart;
            }
            data.requestStart               = timing.requestStart               - navigationStart;
            data.responseStart              = timing.responseStart              - navigationStart;
            data.responseEnd                = timing.responseEnd                - navigationStart;
            data.domLoading                 = timing.domLoading                 - navigationStart;
            data.domInteractive             = timing.domInteractive             - navigationStart;
            data.domContentLoadedEventStart = timing.domContentLoadedEventStart - navigationStart;
            data.domContentLoadedEventEnd   = timing.domContentLoadedEventEnd   - navigationStart;
            data.domComplete                = timing.domComplete                - navigationStart;
            data.loadEventStart             = timing.loadEventStart             - navigationStart;
            data.loadEventEnd               = timing.loadEventEnd               - navigationStart;
            data.initialJSHeapSize          = localStorage.getItem('initialJSHeapSize') || '';
            data.maxJSHeapSize              = localStorage.getItem('maxJSHeapSize') || '';
            if (trackedJSHeapSize && trackedJSHeapCount) {
                data.averageJSHeapSize      = Math.round(trackedJSHeapSize / trackedJSHeapCount);
            }
        },

        logPerformance : function() {
            var self = this;
            var data = self.data;
            data.url = data.url.replace(/\?.*$/, '').replace(/\;.*$/,'');
            mobile.invoke('pluginPerformanceUacLog', {
                url : data.url,
                data : [data.networkEnvironment, data.pluginId, data.url, data.isMain, data.isSuccess,
                    data.redirectCount, data.navigationType, data.navigationStart,
                    data.unloadEventStart, data.unloadEventEnd, data.redirectStart, data.redirectEnd,
                    data.fetchStart, data.domainLookupStart, data.domainLookupEnd,
                    data.connectStart, data.connectEnd, data.secureConnectionStart,
                    data.requestStart, data.responseStart, data.responseEnd,
                    data.domLoading, data.domInteractive, data.domContentLoadedEventStart, data.domContentLoadedEventEnd,
                    data.domComplete, data.loadEventStart, data.loadEventEnd,
                    data.initialJSHeapSize, data.averageJSHeapSize, data.maxJSHeapSize]
            })
        },

        // 页面js性能监控
        trackJSHeap : function() {
            var self = this;
            var memory = performance.memory;
            if (!memory) return;
            localStorage.setItem('initialJSHeapSize', memory.totalJSHeapSize);
            localStorage.setItem('maxJSHeapSize', memory.totalJSHeapSize);
            localStorage.setItem('trackedJSHeapSize', memory.totalJSHeapSize);
            localStorage.setItem('trackedJSHeapCount', 1);
            setInterval(function() {
                var memory = performance.memory;
                var maxJSHeapSize = Number(localStorage.getItem('maxJSHeapSize'));
                var trackedJSHeapSize = Number(localStorage.getItem('trackedJSHeapSize'));
                localStorage.setItem('maxJSHeapSize', Math.max(maxJSHeapSize, memory.totalJSHeapSize));
                localStorage.setItem('trackedJSHeapSize', trackedJSHeapSize + memory.totalJSHeapSize);
                localStorage.setItem('trackedJSHeapCount', Number(localStorage.getItem('trackedJSHeapCount')) + 1);
            }, 5 * 60 * 1000);
        },

        init : function() {
            this.events();
            this.ballot();
        }
    };

    // fire the hole~
    Track.init();

})(TOP.mobile);
/**
 * ISV 性能打点接口，需求如下：
 * 插件首页到达“可用”状态打点：
 * pageReady,home,时间戳（毫秒）,appkey,url等页面标志千牛不使用可以提供给ISV做数据分析
 * 列表页开始启动：
 * pageStart,list,时间戳（毫秒）,appkey,url等页面标志千牛不使用可以提供给ISV做数据分析
 * 列表页到达“可用”状态：
 * pageReady,list,时间戳（毫秒）,appkey,url等页面标志千牛不使用可以提供给ISV做数据分析
 * 详情页（包括详情二级页面）开始启动：
 * pageStart,detail,时间戳（毫秒）,appkey,url等页面标志千牛不使用可以提供给ISV做数据分析
 * 详情页（包括详情二级页面）“可用”状态：
 * pageReady,detail,时间戳（毫秒）,appkey,url等页面标志千牛不使用可以提供给ISV做数据分析 
 */


/**
 * @namespace mobile
 *
 * @desc <strong>页面性能打点模块</strong>
 * <p>主要用于记录插件页面（包含虚拟页）从打开到真正可用的时间间隔</p>
 */
(function(mobile) {
    PAGE_TYPE = ['home', 'list', 'detail'];
    
    function log(page, status, custom) {
        var data = [status, page, new Date().valueOf()];
        custom && data.push(custom);
        mobile.invoke('pluginPerformanceUacLog', {
            url: location.protocol + '//' + location.host + location.pathname,
            data: data
        });
    }

    function Page(pageType) {
        if (PAGE_TYPE.indexOf(pageType) < 0) throw 'Incorrect page type';
        this.pageType = pageType;
    };

    Page.prototype = {
        start: function(custom) {
            log(this.pageType, 'pageStart', custom);
        },
        ready: function(custom) {
            log(this.pageType, 'pageReady', custom);
        }
    };

    /**
     * <p>页面性能打点模块</p>
     * <p>
     * <strong>性能打点分为3个页面类型和2个时间点：</strong><br/>
     * 3个页面类型：<code>home</code>（首页）、<code>list</code>（列表页）、<code>detail</code>（详情页）<br/>
     * 2个时间点：<code>start</code>（虚拟页开始加载）、<code>ready</code>（虚拟页加载完成）<br/>
     * 因此：<br/>
     * <code>TOP.mobile.performance('list').start();</code> 表示列表页面开始加载<br/>
     * <code>TOP.mobile.performance('list').ready();</code> 表示列表页面加载完成<br/>
     * <br/>
     * 此外，start和ready方法中，还可以传入一个自定义标志，用于自定义的页面区分或者自己进行数据分析。<br/>
     * 如：<code>TOP.mobile.performance('list').ready('mypage');</code> 其中mypage就是自定义标志<br/>
     * <br/>
     * <strong>注意：</strong><br/>
     * 1. start的打点需要位于虚拟页开始加载的位置；ready的打点需要位于页面请求到数据并且完成渲染的位置。<br/>
     * 2. 首页不需要打start，因为千牛的容器知道首页加载的开始时刻。<br/>
     * 3. 如果页面数据有使用本地缓存进行缓存，那么页面加载过程中只要缓存数据渲染完成就可以进行ready打点<br/>
     * 4. 如果插件内的任何场景的页面都是通过跳转URL来实现的，那么每个页面只需要进行ready的打点，因为start的时间点千牛容器也是知道的。<br/>
     * </p>
     * @name performance
     * @memberof mobile
     * @method
     * @param  {String} page 页面类型，home，list，detail
     * @return {Object} page 页面对象
     *
     * @example
     * // 自定义标识可以不传，主要用于页面区分或者自己进行数据分析
     * TOP.mobile.performance('home').ready('自定义标识');
     * TOP.mobile.performance('list').start('自定义标识');
     * TOP.mobile.performance('list').ready('自定义标识');
     * TOP.mobile.performance('detail').start('自定义标识');
     * TOP.mobile.performance('detail').ready('自定义标识');
     */
    mobile.performance = function(page) {
        return new Page(page);
    };
})(TOP.mobile);