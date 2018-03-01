/**
 * 
 */
postMessage("I\'m working before postMessage(\'ali\').");//第二步，加载时执行通知主页面onmessage

var t={
		i:0
}
for(var k=0;k<40;k++){
	t.i=k;
}
postMessage("t.i=="+t.i);
//第四步 和 postMessage、onmessage 按顺序初始化，postMessage执行完后，初始化onmessage
onmessage = function (oEvent) {//第五步  myWorker.postMessage("ali"); 这里发送过来的
  postMessage("Hi " + oEvent.data);
};