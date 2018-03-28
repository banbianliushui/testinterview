/**
 * 
 */

/**
 * 
 */

(function($){
	var govEditor=function(elem,options){
		this.$elem=elem;
		this.options=options;
		this.init();
		this.bind();
			
	}
	//1.文本中的标签转义，
	govEditor.prototype.init=function(){
		var params=this.options;
		
		var id = "modal" + new Date().getTime();
		var title = "提示";
		var style = "";
		var contentsty = "";
		var noborder = "";
		var btnsalign = "";
		var modalcls = "";
		var backdrop = "";
		if (params.id) {
			id = params.id;
		}
		if (params.title) {
			title = params.title;
		}
		if (params.style) {
			style = params.style;
		}
		if (params.width) {
			contentsty += "width: " + params.width + ";";
		}else{
			params.width="300px";
			contentsty += "width: " + params.width + ";";						
		}
		if (params.height) {
			contentsty += "height:" + params.height + ";";
		}
		if (params.width && params.height) {
			// 保持窗口屏幕居中
			params.width=params.width.replace("px","");
			params.height=params.height.replace("px","");
			contentsty += "position: absolute; top: 50%; left: 50%; margin-left: -" + parseInt(params.width) / 2 + "px; margin-top: -" + parseInt(params.height) / 2 + "px;";
		}
		if (params.bodynoborder == false && params.bodynoborder != undefined) {

		} else {
			noborder = "body-noborder";
		}
		if (params.btnsalign != undefined) {
			btnsalign = "text-align:" + params.btnsalign + ";"
		} else {
			// btnsalign="text-align:center;";
		}
		if (params.modalcls) {
			modalcls = params.modalcls;
		}
		if(params.backdrop){
			//backdrop
			if(typeof params.backdrop =="string"){
				backdrop=" data-backdrop='"+params.backdrop+"'";
			}else{
				backdrop=" data-backdrop="+params.backdrop+"";
			}
			
		}else{
			backdrop=" data-backdrop='static'";
		}
		
		var html = '<div class="modal fade ' + modalcls + '" id="' + id + '" ' + ' tabindex="-1" role="dialog" aria-labelledby="myModalLabel" '
		+backdrop+' aria-hidden="true"  style="overflow:hidden;">' + '<div class="modal-dialog" style="'
				+ contentsty + '">' + '<div class="modal-content" >' + '<div class="modal-header ">'
				+ '<button type="button" class="close" data-dismiss="modal" 	aria-hidden="true">×</button>' + '<h4 class="modal-title" id="myModalLabel">' + title + '</h4>' + '</div>'
				+ '<div class="modal-body ' + noborder + '" style="min-height:50px;' + style + '" >';
		html+="<div id='goveditor'  class='goveditor'>"+		
				"<div  class='goveditor-content' contenteditable='true'> " +
				"" +
				"</div>" +
				"<div class='goveditor-menu '>" +
				"<div class='menu-group'> <a class='imgbtn'>" +
				(params.imgBtnIcon !=""|| params.imgBtnIcon !=null ?"<img src='"+params.imgBtnIcon
						+"' style='width:16px;height:16px;' >":"") +
				"添加照片" +
				"<form id='g_uploadimgform' enctype='multipart/form-data' onsubmit='return false;'  method='post'>"
				+"<input class='imgbtn-input' name='uploadimage' type='file' accept='image/jpg,image/jpeg,image/png,image/gif,image/bmp' >" +
				"</form></a></div>" +
				"<div class='menu-group'> " +
				"<a  class='g_cancelbtn'>取消</a>" +
				"</div>" +
				"<div class='menu-group'> " +
				"<a  class='g_sendbtn'>发送</a>" +
				"</div>" +
				"" +
				"</div>" +				
				"</div>";				
			html+= '</div>';		
	
		this.$elem.append(html);
		this.$goveditor=$('#goveditor');
		this.$editContainer=$('.goveditor-content');
		this.$bar=$('.goveditor-menu .menu-group');
	}
	govEditor.prototype.close=function(){
		$(this.$elem).data('govEditor',undefined);
		$("#goveditor").remove();
	}
	govEditor.prototype.bind=function(){		
		var that=this;
		that.$bar.on('click','.g_sendbtn',function(){
			//测试
			//return;
			var params={};			
			if(that.options&&that.options.messDto!=null){
				var msdto=that.options.messDto;
				params=$.extend({},params,msdto);				
			}
			//messDto
			//$('.goveditor-content .')
			$(".editor_tagcls").remove();
			params['content']=$('.goveditor-content').html();
			$.ajax({
				//dataType:"text", 
				type:'post', 
				url: "/topware-govdocsearch/web/dw/doc/correct", 
			//	beforeSubmit:showRequest,  
				success:function(){
					if(that.options.onSend){
						that.options.onSend();
					}
					that.close();
				}
				//clearForm:true ,
			});			
			
			
		})
		that.$bar.on('click','.g_cancelbtn',function(){
			that.close();
		})
		that.$bar.on('change','.imgbtn-input',function(){	
			var  $imginput=$(this);
			//测试代码
			var imgs=[{guid:'1',src:'http://localhost:8080/topware-govdocsearch/1479806352654'},
			          {guid:'2',src:'http://localhost:8080/topware-govdocsearch/1479806352658'}				,
				 {guid:'3',src:'http://localhost:8080/topware-govdocsearch/1479806352757'}				
			    ];
			var k=Math.floor(Math.random()*3);
			var im=imgs[k];
			var html="<img  style='width:40px;height:30px;' src='"+im.src+"' imgid='"+im.guid+"'>";	
			that.insertHtmlToTag(html,$(".goveditor-content"));
			$imginput.after($imginput.clone().val(""));      
      	  	$imginput.remove();  //jquery
			
      	  	return;
			//运行时代码
			 var formData = new FormData($( "#g_uploadimgform" )[0]);  
		     $.ajax({  
		          url: that.options.uploadImgUrl,  
		          type: 'POST',  
		          data: formData,  
		          async: false,  
		          cache: false,  
		          contentType: false,  
		          processData: false,		          
		          success: function (data) {  
		        	  $imginput.after($imginput.clone().val(""));      
		        	  $imginput.remove();  //jquery
		        	  // console.log(data);
		        	  //清理file input
		        	  //1.var obj = document.getElementById('fileupload') ; 
		        	  //obj.select(); 
		        	  //document.selection.clear(); 
		        	  //2.var obj = document.getElementById('fileupload') ; 
		        	  // obj.outerHTML=obj.outerHTML; 
		        	  //3. $imginput.after($imginput.clone().val(""));      
		        	  // $imginput.remove(); 	        	  
		        	  var html="<img   style='width:40px;height:30px;' src='"
		        		  +data.url+"' imgid='"+data.guId+"'>";	
		  				that.insertHtmlToTag(html,$(".goveditor-content"));		        	  
		          },  
		          error: function (returndata) {  
		          }  
		     }); 
		});

		$('body').on('keyup','.goveditor-content',function(){
			var taghtml="<span  class='editor_tagcls'></span>";
			$(".editor_tagcls").remove();
			that.insertHtml(taghtml,$(this));
//			if(that.options&&that.options.txtmaxlength){
//				var txt=$('.goveditor-content').text();
//				$('.goveditor-content').text(txt.substr(0,300))
//			}
		});
		
		$('body').on('click','.goveditor-content',function(){
			var taghtml="<span  class='editor_tagcls'></span>";
			$(".editor_tagcls").remove();
			that.insertHtml(taghtml,$(this));
			})

	
	}
	
    govEditor.prototype.isOrContainsNode=function(ancestor,descendant){
    	var node=descendant;
    	while(node){
    		if(node === ancestor){
    			return true;
    		}
    		node=node.parentNode;
    	}
    	return false;
    }
    
    govEditor.prototype.insertHtmlToTag=function(html,$container){
    	if(window.getSelection){ 
    		var sel=window.getSelection();
    		var $tag=$(".editor_tagcls")[0];
    		var range=sel.getRangeAt(0);
    		range.setStartBefore($tag)//把该范围的开始点设置为紧邻指定节点之前。
			//range.setStartAfter();//设置末尾位置  ?  设置开始位置
			range.collapse(true);//合并范围至末尾 ? 范围的边界点重合。collapse(toStart) 如果把参数 toStart 设置为 true，该方法将把范围的结束点设置为与开始点相同的值。否则，它将把范围的开始点设置为与结束点相同的值。
			sel.removeAllRanges();//清除range  
			sel.addRange(range);//设置range 
			//以上移动到标记位置
    		var el=document.createElement('div');
			el.innerHTML=html;
			//Range.createContextualFragment从给定代码串创建文档片段
			//createDocumentFragment创建一虚拟的节点对象，节点对象包含所有属性和方法。
			var frag = document.createDocumentFragment(),node,lastNode;
			while((node=el.firstChild)){
				lastNode = frag.appendChild(node);
			}
			if(this.isOrContainsNode($container[0],range.commonAncestorContainer)){
				range.deleteContents();//删除当前 Range 对象表示的文档区域。
    			range.insertNode(frag);//把指定的节点插入文档范围的开始点。
			}else{
				$container.append(html);
			}
			 // 设置选区
			if(lastNode){
				range=range.cloneRange();
				range.setStartAfter(lastNode);//设置末尾位置  ?  设置开始位置
				range.collapse(true);//合并范围至末尾 ?
				sel.removeAllRanges();//清除range  
				sel.addRange(range);//设置range  
			}			
			
    	}else if(document.selection){
    		var $tag=$(".editor_tagcls")[0];			
			 var textRange = document.body.createTextRange();
	         textRange.moveToElementText($tag);
	         textRange.collapse(false);
	         textRange.select();
	         var range = document.selection.createRange();
		     range.pasteHTML( html ); 	
    	}
    }
    govEditor.prototype.insertHtml=function(html,$container){
    	if(window.getSelection){    		
    		var sel=window.getSelection();
    		if(sel.getRangeAt&&sel.rangeCount){
    			var range=sel.getRangeAt(0);
    			var el=document.createElement('div');
    			el.innerHTML=html;
    			var frag = document.createDocumentFragment(),node,lastNode;
    			while((node=el.firstChild)){
    				lastNode = frag.appendChild(node);
    			}
    			if(this.isOrContainsNode($container[0],range.commonAncestorContainer)){
    				range.deleteContents();
        			range.insertNode(frag)
    			}else{
    				$container.append(html);
    			}
    			if(lastNode){
    				range=range.cloneRange();
    				range.setStartAfter(lastNode);//设置末尾位置  ?  设置开始位置
    				range.collapse(true);//合并范围至末尾 ?
    				sel.removeAllRanges();//清除range  
    				sel.addRange(range);//设置range  
    			}     			
    		}
    		
    	}else if(document.selection){
    		var sel=document.selection;
    		var range=sel.createRange();
    		 range.pasteHTML( html );
    	}
    }
	
	
	govEditor.prototype.show=function(){
		
	}
	//messDto: content/title/type/documentGuId/docId/documentName/
	govEditor.defaults={
			uploadImgUrl:"/topware-govdocsearch/web/dw/doc/correct",
			delImgUrl:"",
			imgBtnIcon:"",
			messDto:null,
			onSend:function(){
				
			}
			
	}
	$.fn.govEditor=Plugin;
	//$.fn.govEditor.Constructor=govEditor;
	//$.fn.govEditor.
	function Plugin(options){
		return this.each(function(){
			var $this=$(this);
			var data=$this.data('govEditor');
			if(!options){
				options={};
			}
			var opts=$.extend({},govEditor.defaults,options);
			if(!data){
				$this.data('govEditor',new govEditor($this,opts));
			}
			//return this;
		});
	}
	
})(window.jQuery)

//			 var formData = new FormData($( "#imguploadform" )[0]);  
//		     $.ajax({  
//		          url: that.options.uploadImgUrl,  
//		          type: 'POST',  
//		          data: formData,  
//		          async: false,  
//		          cache: false,  
//		          contentType: false,  
//		          processData: false,  
//		          success: function (returndata) {  
//		        	  console.log(returndata)
//		              //alert(returndata);  
//		          },  
//		          error: function (returndata) {  
//		             // alert(returndata);  
//		          }  
//		     });  