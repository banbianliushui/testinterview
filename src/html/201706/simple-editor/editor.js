/**
 * 
 */

(function($){
var govEditor=function(elem,options){
		this.$elem=elem;
		this.options=options;
		this.init();
		this.bind();
		this.popup_saved_selection=null;
		this.saveSelection=null;
		this.saveRange=null;
		this.prevKeyup=false;
		this.isIE=false;
		if (navigator.userAgent.indexOf("MSIE") != -1){
			//bind_name = ‘propertychange’;
			this.isIE=true;
			this.IEnbsp='&nbsp;';
			//this.IEnbsp='';
		}
		this.tagpos=0;
		
		
	}


	govEditor.prototype.saveSelectionfun = function( ){
		console.log("saveSelectionfun");
		    if( window.getSelection )
		    {
		        var sel = window.getSelection();
		        this.saveSelection=sel;
		        this.saveRange=sel.getRangeAt(0);
		       // if( sel.rangeCount > 0 )
		           // return sel.getRangeAt(0);
		    }
		    else if( document.selection )
		    {
		        var sel = document.selection;
		        this.saveSelection=sel;
		        this.saveRange=sel.createRange();
		       // return sel.createRange();
		    }else{
		    	 this.saveSelection=null;
			        this.saveRange=null;
		    }
		   
		   
		};
	//1.文本中的标签转义，
	govEditor.prototype.init=function(){
		var options=this.options;
		var html="";
		html+="<div id='goveditor'  class='goveditor'>"+
				"<div class='goveditor-menu '>" +
				"<div class='menu-group'> <a class='imgbtn'>" +
				(options.imgBtnIcon !=""|| options.imgBtnIcon !=null ?"<img src='"+options.imgBtnIcon
						+"' style='width:16px;height:16px;' >":"") +
				"添加照片" +
				"<input class='imgbtn-input' type='file' accept='image/jpg,image/jpeg,image/png,image/gif,image/bmp' >" +
				"</a></div>" +
				"</div>" +
				"<div  class='goveditor-content'  style='border:1px solid black; height:100px;'id='goveditor-content' contenteditable='true'> " +
				"" +
				"</div>" +
				"" +
				"</div>";
		this.$elem.append(html);
		this.$goveditor=$('#goveditor');
		this.$editContainer=$('.goveditor-content');
		this.$bar=$('.goveditor-menu .menu-group');
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
    	var that=this;
    	if(window.getSelection){ 
    		var sel=window.getSelection();
    		var $tag=$(".tagcls")[0];
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
				that.updateTagHtml();
			}			
			
    	}else if(document.selection){
    		 var $tag=$(".tagcls")[0];			
			 var textRange = document.body.createTextRange();
	         textRange.moveToElementText($tag);
	         textRange.collapse(true);//true
	         textRange.select();
	         var range = document.selection.createRange();
		     range.pasteHTML( html ); 
		     that.saveSelectionfun();
		    // that.updateTagHtml();
		     
    	}
    }
    
    
    govEditor.prototype.insertTag=function(){
    	var that=this;
    	var html='&nbsp;<span class="tagcls"></span>';
    	if($('.tagcls').length>0){			
			that.removeTag();
		}
    	var $container=$('.goveditor-content');
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
    				 //that.updateTagHtml();
    				that.saveSelectionfun();
    			}     			
    		}
    		
    	}else if(document.selection){

    		if(that.saveRange!=null){
    			console.log("saveRange！=null");
    			that.saveRange.pasteHTML( html );
    		}else{
        		var sel=document.selection;
        		var range=sel.createRange();
        		 range.pasteHTML( html );
    		}
    		
    		//$('.tagcls')[]
    		var $tag=$('.tagcls')[0];			
			 var textRange = document.body.createTextRange();
			 try{
				 textRange.moveToElementText($tag);
		         textRange.collapse(true);	
		        // textRange.moveEnd("character",1);
		         textRange.select();
	    		that.saveSelectionfun(); 
			 }catch(er){
				 
			 }
    	}
    }
    govEditor.prototype.insertHtml=function(html,$container){
    	console.log('insertHtml');
    	var that=this;
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
    				 //that.updateTagHtml();
    				that.saveSelectionfun();
    			}     			
    		}
    		
    	}else if(document.selection){
    		if(that.saveRange!=null){
    			that.saveRange.pasteHTML( html );
    		}else{
        		var sel=document.selection;
        		var range=sel.createRange();
        		 range.pasteHTML( html );
    		}
    		var $tag=$(html)[0];			
			 var textRange = document.body.createTextRange();
			 try{
				 textRange.moveToElementText($tag);
		         textRange.collapse(true);	
		         textRange.moveEnd("character",0);
		         textRange.select();
	    		that.saveSelectionfun(); 
			 }catch(er){
				 
			 }
    	}
    }
    govEditor.prototype.updateTagHtml=function(){
    	var that=this;
    	that.insertTag();
    	that.saveSelectionfun();
    }
    govEditor.prototype.removeTag=function(){
    	var $tag=$('.tagcls');

		$tag.remove();
    }
	govEditor.prototype.bind=function(){		
		var that=this;
		that.$bar.on('change','.imgbtn-input',function(){
		
			var imgs=[{guid:'1',src:'//img.hb.aicdn.com/a76de1629ea6adc013e8e9c6c214caa5ce0b894ceab5-HJ5REh_sq320'},
			          {guid:'2',src:'//img.hb.aicdn.com/8526f9435ea5c391e382e0b336397cee1d02a5d7b1ce-O6aYqk_sq320'}				,
				 {guid:'3',src:'//img.hb.aicdn.com/380533e59fed767ee4f658e14eb0c1290812de501a769-Ro8nCh_sq320'}
			    ];

			var k=Math.floor(Math.random()*3);
			var im=imgs[k];
			var html="<img  style='width:40px;height:30px;' src='"+im.src+"' imgid='"+im.guid+"'>&nbsp;";	
			that.insertHtmlToTag(html,$(".goveditor-content"));
			var  $imginput=$(this);
			$imginput.after($imginput.clone().val(""));      
      	  	$imginput.remove();  //jquery

			
		});

		$('body').on('keyup ','.goveditor-content',function(e){
			console.log('keyup')
			that.needFocus=true;
			that.saveSelectionfun();
		})
		//document.activeElement.tagName
		$('body .goveditor-content').on('blur',function(){
			console.log('blur')
			if(that.needFocus==true){
				that.insertTag();
				that.needFocus=false;
							
			}else{
				
			}
			
	})

		$('body .goveditor-content').on('click',function(){
			that.needFocus=true;
			console.log('contentclick');
			that.insertTag();
		})

	
	}
	
	
	govEditor.prototype.show=function(){
		
	}
	govEditor.defaults={
			uploadImgUrl:"",
			delImgUrl:"",
			imgBtnIcon:""
			
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


/*https://www.cnblogs.com/zhujl/archive/2011/11/02/2231255.html*/