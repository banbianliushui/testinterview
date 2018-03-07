/**
 * 
 */
(function($){
	//轮播类定义  具体实现
	function Carousel(elem,options){
		this.init(elem,options);
		
		this.bind();
	}
	Carousel.prototype.init=function(elem,options){
		this.$elem=$(elem);
		this.$indicators=this.$elem.find(".smallpics-wrap li");		
		this.options=options;
		this.$active=null;
		if(this.$elem.find('.item.active').length>0){
			this.$active=this.$elem.find('.item.active');
		}
		this.$items=this.$elem.find(".item");
		var indors=this.options.maxIndicators
		if(this.$indicators.length>indors){
			this.$indicators.each(function(i,item){
				if(i>=indors){
					$(this).addClass('hidden');
				}
			});
		}
	}
	
	Carousel.prototype.bind=function(){
		var that=this;
		var $this=this.$elem;		
		$this.find(".carousel-close").on("click",function(){
			if($this.hasClass("canremove")){
				$this.data('sun.carousel').$elem.remove();
				$this.data('sun.carousel',undefined);
			}else{
				$this.addClass("hidden");
				that.refresh();
			}			
		})
		
		
	}
	Carousel.prototype.loadImage=function(url, callback) {
		 var img = new Image(); //创建一个Image对象，实现图片的预下载
		 img.src = url;		 
		 if(img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
		     callback.call(img);
		     return; // 直接返回，不用再处理onload事件
		    }
		 img.onload = function () { //图片下载完毕时异步调用callback函数。
		        callback.call(img);//将回调函数的this替换为Image对象
		    };
		  img.onerror=function(){
			   callback.call(img);
		   } 
		};
	Carousel.prototype.getItemIndex=function(item){
		this.$items=item.parent().children(".item");
		return this.$items.index(item||this.$active);
	}
	//轮转到指定图片
	Carousel.prototype.to=function(pos){
		var that=this;
		var activeIndex=this.getItemIndex(this.$active=this.$elem.find('.item.active'));
		if(pos>(this.$items.length-1)){
			pos=0;
		}
		if(pos<0){
			pos=this.$items.length-1;
		}
		return this.slide(pos>activeIndex ? 'next':'prev',this.$items.eq(pos),pos);
		
	}
	//hide()、show() 、slideDown、slideUp、 slideToggle、fadeIn()、fadeOut()、fadeTo().animate()
	//轮转图片选中状态
	Carousel.prototype.slide=function(type,next,pos){
		var $this=this.$elem;
		var indors=this.options.maxIndicators;
		if($(next).length>0){
			this.$items.removeClass("active");
			$(next).addClass("active");
			this.$indicators.removeClass("active");
			var inum=this.$indicators.length;
			var lowi=Number(pos)-Math.floor(indors/2);
			var highi=Number(pos)+Math.floor(indors/2);
			this.$indicators.each(function(){
				var nowto=Number($(this).attr("data-slide-to"));
				if(	Number(pos)==0){
					if(nowto<indors){
						$(this).removeClass("hidden");
					}else{
						$(this).addClass("hidden");
					}
					
				}else if(Number(pos)+1==inum){
					if(inum-nowto>=indors){
						
						$(this).addClass("hidden");
					}else{
						$(this).removeClass("hidden");
					}
					
				}else if(lowi>=0&&highi<=inum){
					if(nowto>=lowi&&highi>=nowto){
						$(this).removeClass("hidden");
					}else{
						$(this).addClass("hidden");
					}
					
				}else if(lowi>=0&&highi<=inum){
					if(nowto<lowi&&highi<nowto){
					//	$(this).addClass("hidden");
					}else{
						
					}
					
				}else if(lowi<0&&highi<=inum){
				//	$(this).addClass("hidden");
				}else if(lowi>=0&&highi>inum){
					//$(this).addClass("hidden");
				}else if(lowi<0&&highi>inum){
					
				}
				if(nowto==pos){	
					$(this).addClass("active");
					
				}
			})
			this.resize();
		}
		 /* var _ = this,
          parentWidth = _.$parent.width(),
          amountLeft;
      _.$photos.css('position', 'absolute');
      for (i = 0; i < _.count; i++) {
          amountLeft = parentWidth * i;
          _.$photos.eq(i).css('left', amountLeft);
      }*/
	}
	//如果关闭轮播是隐藏，需要重置到第一张图片展示
	Carousel.prototype.refresh=function(){
		this.to(0);
	}
	//向前轮播一张
	Carousel.prototype.prev=function(){
		var $active=this.$elem.find('.item.active');
		if($active.length==0){	
			this.to(this.$items.length-1);
		}else{
			var pos=this.getItemIndex(this.$active=this.$elem.find('.item.active'));
			this.to(pos-1);
		}
	}
	//向后轮播
	Carousel.prototype.next=function(){
		var $active=this.$elem.find('.item.active');
		if($active.length==0){
			this.to(this.$items.length-1);
		}else{
			var pos=this.getItemIndex(this.$active=this.$elem.find('.item.active'));
			this.to(pos+1);
		}
	}	
	//可视区域大小变化时图片区域自适应变动
	Carousel.prototype.resize=function(){
		 var carousels=this.$elem;
		 var that=this;
		 var h=document.documentElement.clientHeight;
		 carousels.each(function(){
			 	var $inneritem=$(this).find(".carousel-inner .item.active");
			 	var $picwrap=$(this).find(".smallpics-wrap");
			 	var $mainwrap=$(this).find(".carousel-main");
			 	if($picwrap.height()<=0){
			 		var $img=$inneritem.find("img");
					 //carousels.addClass("hidden")
					 var url = $img.attr("src");
					 that.loadImage(url,function(){
						 if($inneritem.length!=0){									
								var oh=Number($picwrap.css("marginTop").replace("px",""));				
								oh=oh+Number($picwrap.css("marginBottom").replace("px",""));
								oh=oh+Number($picwrap.css("paddingTop").replace("px",""));
								oh=oh+Number($picwrap.css("paddingBottom").replace("px",""));
								oh=oh+$picwrap.height();
								oh=oh+Number($mainwrap.css("marginTop")!='auto'? $mainwrap.css("marginTop")!='auto'.replace("px",""):0);				
								oh=oh+Number($mainwrap.css("marginBottom")!='auto'? $mainwrap.css("marginBottom").replace("px",""):0);
								oh=oh+Number($mainwrap.css("paddingTop").replace("px",""));
								oh=oh+Number($mainwrap.css("paddingBottom").replace("px",""));
								$inneritem.css("height",h-oh);
							 }	
					 });
			 	}else{			 		
			 		if($inneritem.length!=0){
						var oh=Number($picwrap.css("marginTop").replace("px",""));				
						oh=oh+Number($picwrap.css("marginBottom").replace("px",""));
						oh=oh+Number($picwrap.css("paddingTop").replace("px",""));
						oh=oh+Number($picwrap.css("paddingBottom").replace("px",""));
						oh=oh+$picwrap.height();
						oh=oh+Number($mainwrap.css("marginTop")!='auto'? $mainwrap.css("marginTop")!='auto'.replace("px",""):0);				
						oh=oh+Number($mainwrap.css("marginBottom")!='auto'? $mainwrap.css("marginBottom").replace("px",""):0);
						oh=oh+Number($mainwrap.css("paddingTop").replace("px",""));
						oh=oh+Number($mainwrap.css("paddingBottom").replace("px",""));
						$inneritem.css("height",h-oh);
					 }			 		
			 	}
								 
		 });
				// carousels.removeClass("hidden");
		//	});
		
	}
	//整体轮播小组件都自适应变动图片区域大小
	Carousel.resize=function(){
		 var carousels=$(".carousel");
		 var h=document.documentElement.clientHeight;
		 carousels.each(function(){
			 var $inneritem=$(this).find(".carousel-inner .item.active");			
			if($inneritem.length!=0){
				var $picwrap=$(this).find(".smallpics-wrap");
				var $mainwrap=$(this).find(".carousel-main");				
				var oh=Number($picwrap.css("marginTop").replace("px",""));				
				oh=oh+Number($picwrap.css("marginBottom").replace("px",""));
				oh=oh+Number($picwrap.css("paddingTop").replace("px",""));
				oh=oh+Number($picwrap.css("paddingBottom").replace("px",""));				
				oh=oh+$picwrap.height();
				oh=oh+Number($mainwrap.css("marginTop").replace("px",""));				
				oh=oh+Number($mainwrap.css("marginBottom").replace("px",""));
				oh=oh+Number($mainwrap.css("paddingTop").replace("px",""));
				oh=oh+Number($mainwrap.css("paddingBottom").replace("px",""));				
				 $inneritem.css("height",h-oh);				
			}
		 });
	}
	//轮播默认参数
	Carousel.DEFAULTS={
			maxIndicators:9
	}
	
	$.fn.carousel = Plugin;
	$.fn.carousel.Constructor=Carousel;
	
	//轮播插件定义，及初始化
	function Plugin(option){
		return this.each(function(){			
			var $this = $(this);
			var data = $this.data("sun.carousel");
			var options = $.extend({},Carousel.DEFAULTS,$this.data(),typeof option == "object"&&option);
			
			if(!data){
				$this.data("sun.carousel",(data=new Carousel(this,options)));
				data.resize();				
			} 
			if(typeof option == "number") data.to(option);			
		});		
	}
	
	function clickHandler(e){
		var href;
		var $this = $(this);
		var $target = $($this.attr("data-target")|| (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''));
		if(!$target.hasClass("carousel")) return ;
		var options = $.extend({},$target.data(),$this.data());
		var slideIndex= $this.attr("data-slide-to");
		Plugin.call($target,options);
		if(slideIndex){
			$target.data('sun.carousel').to(slideIndex);
		}else{
			slideIndex= $this.attr("data-slide");
			if(slideIndex&&slideIndex=="prev"){				
				$target.data('sun.carousel').prev();
				
			}else if(slideIndex&&slideIndex=="next"){				
				$target.data('sun.carousel').next();				
			}			
		}
		e.preventDefault();
	}
	
	
	$(document).on('click', '.carousel [data-slide]', clickHandler)
	    .on('click', '.carousel [data-slide-to]', clickHandler);
	$(window).resize(function() {
		 Carousel.resize();		  
	});
	$(window).on("load",function(){
		$("[data-ride='carousel']").each(function(){
			var $carousel=$(this);
			Plugin.call($carousel,$carousel.data());
		})
	})
	
})(jQuery);



/*<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
<!-- Indicators -->
<ol class="carousel-indicators">
  <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
  <li data-target="#carousel-example-generic" data-slide-to="1"></li>
  <li data-target="#carousel-example-generic" data-slide-to="2"></li>
</ol>

<!-- Wrapper for slides -->
<div class="carousel-inner" role="listbox">
  <div class="item active">
    <img src="..." alt="...">
    <div class="carousel-caption">
      ...
    </div>
  </div>
  <div class="item">
    <img src="..." alt="...">
    <div class="carousel-caption">
      ...
    </div>
  </div>
  ...
</div>

<!-- Controls -->
<a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
  <span class="glyphicon glyphicon-chevron-left"></span>
  <span class="sr-only">Previous</span>
</a>
<a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
  <span class="glyphicon glyphicon-chevron-right"></span>
  <span class="sr-only">Next</span>
</a>
</div>*/