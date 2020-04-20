// 框架定义
// 1.配置 模块别名->模块url 用require 函数 缓存
// 2.define
// 3. require
//  <script src="./requirejs.js" data-main="./js/main" async="true" defer ></script>
/**
 * 1.获取当前页面基础路径
 * 2. 读取配置文件 缓存对应模块和路径
 * 3. require 加载依赖列表，加载完成后执行回调。
 *
 *
 */
(function (global) {
  let modules = {};
  let modulesMap = {};
  let modulesPathMap = {};
  let requireQueue = [];
  let moduleCount = 0;
  let head;
  head = document.getElementsByTagName("head")[0];
  /**
   *
   *
   * @param {*} moduleId  定义模块id
   * @param {*} dependenceMouldes 该模块依赖的模块列表
   * @param {*} callback  模块内容
   */
  function define(moduleId, dependenceMouldes, callback) {
    if (typeof dependenceMouldes === "function") {
      callback = dependenceMouldes;
      dependenceMouldes = {};
    }

    // modulesMap[moduleId] = {
    //   export: callback.call(this, dependenceMouldes),
    // };

    modules[modulesPathMap[moduleId]].export = callback.call(
      modules,
      dependenceMouldes
    );
    console.log(modules);
  }
  define.amd = true;
  function checkloaded() {
    let count = 0;
    for (let mod in modules) {
      if (modules[mod].state == 2) {
        count++;
      }
    }
    if (moduleCount == count) {
      while (true) {
        if (requireQueue.length === 0) {
          break;
        }
        let queueObj = requireQueue.pop();
        let exportFuns = [];
        queueObj.args &&
          queueObj.args.forEach((item) => {
            exportFuns.push(modules[item].export);
          });

        queueObj.fn.call(modules, ...exportFuns);
        //modules[queueObj.path].state = 4; //已经执行
      }
      // for (let i = 0; i < requireQueue.length; i++) {
      //   requireQueue[i].fn.call(modules, ...requireQueue[i].args);

      //   modules[requireQueue[i].path].state = 4//已经执行
      // }
    }
  }
  /**
   *
   *
   * @param {*} [module] 数组， 要加载的模块
   * @param {*} callback 加载成功之后的回调函数
   *
   * 1.根据id 获取url
   * 2. 检测此模块是否加载过
   * 3. 未加载则加载js文件，创建script节点，绑定onerror,onload,onreadychange等时间，将src赋值给href，requirejs用的src（因为script的 href 能加载js文件但不会自动执行，执行这一步框架里做?）
   * 4. 将模块url，依赖表等信息构成一个对象，放到检测队列中，上述事件触发时进行检测
   * 5.  执行后获取返回的模块导出对象，模块状态信息等缓存
   *
   */
  var req = function require(reqmodules, callback) {
    let newModule = [];
    reqmodules.forEach((item) => {
      newModule.push(modulesPathMap[item]);
    });
    requireQueue.push({
      fn: callback,
      args: newModule,
      // path: modulesPathMap[item],//当前文件的path
    });
    //callback.call(reqmodules, ...newModule);
  };

  req.config = function config(options) {
    let opt = { paths: {}, baseUrl: "" };
    opt = Object.assign({}, opt, options);
    let paths = opt.paths;
    for (let alia in paths) {
      let path = paths[alia];
      modules[path] = {
        path: path,
        alia: alia,
        export: {},
        state: 1,
      };
      modulesPathMap[alia] = path;
      moduleCount++;
    }

    req.load();
  };
  req.load = function load() {
    for (let modulePath in modules) {
      req.loadScript(modules, modulePath);
    }
  };
  req.loadScript = function loadScript(modules, modulePath) {
    let node = req.createScriptNode();
    modules[modulePath].state = 1; //加载中
    node.onload = function () {
      console.log(arguments);
      modules[modulePath].state = 2; //加载成功
      checkloaded();
    };
    node.onerror = function () {
      console.log(arguments);
      modules[modulePath].state = 3; //加载失败
    };
    node.src = modules[modulePath].path;
    head.appendChild(node);
  };

  req.createScriptNode = function createScriptNode() {
    let node = document.createElement("script");
    node.type = "text/javascript";
    node.async = true;
    return node;
  };
  function requirejs() {}
  //data-main
  function init() {
    let amdScriptDom = document.querySelector("script[data-main]");
    let dataMain = amdScriptDom.getAttribute("data-main");
    let node = req.createScriptNode();
    node.onload = function () {
      console.log(arguments);
      console.log(this.readyState);
    };
    node.onerror = function () {
      console.log(arguments);
    };
    node.src = dataMain;

    head.appendChild(node);
  }

  //requirejs.config = config;
  //global.srequirejs = requirejs;
  global.define = define;
  global.require = req;
  init();
})(this);
