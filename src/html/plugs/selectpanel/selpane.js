/**
 *
 * limis 限制条件是：
 *  limitation="category=catering|retail|trade"
 *  表示category查询行的查询值是catering或retail或trade时本行（limitation所挂的查询行）显示
 *
 *
 */
$(function() {
    var isEmpty = function(obj) {

        for ( var name in obj) {
            return false;
        }
        return true;

    }
	function SelPanel($Dom, opts) {
		this.dom = $($Dom);
		this.opts = opts;
		this.values = {};
		this.texts = {};
		var self = this;
		this.limitations = [];
		var uls = $(this.dom).find('.sel-groups .sel-line');
		for (var i = 0; i < uls.length; i++) {
			var limi = $(uls[i]).attr("limitation");
			if (limi == null || limi == "") {

			} else {
				var limis = limi.split("=");
				var litor = {};
				if (limis.length > 1) {
					litor[limis[0]] = limis[1].replace(/;/g, "").split("|");
				}
				if (!isEmpty(litor)) {
					var lio = {
						id : $(uls[i]).attr("id"),
						limitation : litor,
						type : $(uls[i]).attr("type")
					}
					this.limitations.push(lio);
				}

			}
		}
		$(this.dom).find(".sel-groups a").unbind('click');
		$(this.dom).find(".sel-groups a").unbind('mouseover');
		$(this.dom).find(".sel-groups a").unbind('mouseout');
		$(this.dom).find(".asy-secondary-pane").unbind('mouseover');
		$(this.dom).find(".asy-secondary-pane").unbind('mouseleave');
		$(this.dom).on('mouseleave',".asy-secondary-pane",function(){
			var secondary = $(self.dom).find(".asy-secondary-pane");
			secondary.remove();
		})
		
		$(this.dom).on(
				'mouseover',
				'.sel-groups a',
				function(e) {// mkbtn-link
					// nav加入选中，panel隐藏相应行
                   var $panel = $($(this).parents(".sel-pane"));
					var isSelbtn=false;
					//var isSecPanbtn = false;//hover框中的
					var $ul = $(this).parents(".sel-line ");
					var typeval = $ul.attr("typeval");
					var type = $ul.attr("type");
					var val = $(this).attr("value");
					var text = $(this).text();
					var secondary = $(self.dom).find(".asy-secondary-pane");
					if (secondary.length > 0) {						
						if(secondary.parent()[0]==$(this).parent().parent().parent().parent()[0]){
							// 在同一个节点下
							isSelbtn=true;
						}else{
							// 不在同一个节点下，需删除secondarypane
							secondary.remove();
						}
						
					} else {
						
					}
					self.opts.onHoverItemClick.call(this, e,$panel, {
						type : type,
						value : val
					}, self.getValues(),isSelbtn)
				});
		
		
	
		$(this.dom).on(
				'click',
				'.sel-groups a',
				function(e) {// mkbtn-link
					// nav加入选中，panel隐藏相应行
					var isSelbtn=false;
					var $ul = $(this).parents(".sel-line");
					var typeval = $ul.attr("typeval");
					var type = $ul.attr("type");
					var val = $(this).attr("value");
					var text = $(this).text();

					if ($ul.hasClass("sel-single")
							&& $(this).hasClass("active")&&$(this).next().hasClass('asy-secondary-pane')) {
						if($(this).next().hasClass('hide')){
							$(this).next().removeClass('hide');
						}else{
							$(this).next().addClass('hide');
						}
						return;
					}else if ($ul.hasClass("sel-single")
							&& $(this).hasClass("active")) {
						return;
					}
					var v = {};
					v[type] = val;

					var secondary = $(self.dom).find(".asy-secondary-pane");
					
					if (secondary.length > 0) {
						$(self.dom).find(
								".sel-groups .sel-line[type='" + type + "'] a")
								.removeClass("active");
						if(secondary.parent()[0]==$(this).parent().parent().parent().parent()[0]){
							// 在同一个节点下
							isSelbtn=true;
							$(this).parent().parent().find(".active").removeClass("active");
							$(this).addClass("active");
							var $btn=$(secondary[0].previousSibling)
							$btn.addClass('active')
						}else{
							
							// 不在同一个节点下，需删除secondarypane
							secondary.remove();
							//if(val==""){//全部，全市，全省
								$(this).addClass("active");
							//}
						}
						
					} else {
						if ($(this).hasClass("active")) {
							$(this).removeClass("active");
							v[type] = "";
						} else {
							$(self.dom).find(
									".sel-groups .sel-line[type='" + type + "'] a")
									.removeClass("active");
							$(this).addClass("active");
						}
					}
					self.checkLimit(type, val);
					
					self.opts.onSelItemClick.call(this, e, {
						type : type,
						value : val
					}, self.getValues(),isSelbtn);
					self.opts.onResize.call(self);
				});
		
		self.getSelValues();
	}
	SelPanel.prototype.checkLimit = function(changedtype, changedValue) {
		var limis = this.limitations;
		for (var i = 0; i < limis.length; i++) {
			var o = limis[i];
			var filter = limis[i].limitation;
			if (filter[changedtype] != null) {
				var filt = filter[changedtype];
				$(this.dom).find(".sel-line[type='" + o['type'] + "']")
				.addClass('hide');
				for (var k = 0; k < filt.length; k++) {
					if (filt[k] == changedValue) {
						
						$("#" + o["id"]).removeClass('hide');
					}
				}
			}
		}
		this.getSelValues();
	}
	SelPanel.prototype.clear = function() {
		//$(this.dom).find(".sel-navs .sel-tag").remove();
		$(this.dom).find(".sel-groups ").show();
		$(this.dom).find(".sel-groups .sel-line").show();
		if(!isEmpty(this.values)){
			var $typeuls = $(this.dom).find(".sel-groups .sel-line");
			for(var k = 0;k<$typeuls.length;k++){
				var $typeul = $($typeuls[k])
				if(!$typeul.hasClass('sel-single')){
					$(this.dom).find(".mkbtn-select.active").removeClass('active');
				}
			}
		}
		this.getSelValues();
		//sel-single

	}
	
	// 获取界面上选中的值，不包括隐藏的查询行
	SelPanel.prototype.getSelValues = function() {

		var val = {};
		var texts = {};
		var $typeuls = $(this.dom).find(".sel-groups .sel-line");
		for (var k = 0; k < $typeuls.length; k++) {
			if (!$($typeuls[k]).hasClass("hide")) {
				var type = $($typeuls[k]).attr("type");
				var value = "";
				var text = "";
				var temval = {};
				var temtext = {};
				var $active = $($typeuls[k]).find(".mkbtn-select.active");
				if ($active.length > 0) {
					value = $($active).attr("value");
					text = $($active[0]).text();
					if($active.length>1){
						$($active).each(function(item){
							if($(this).hasClass('second-sel')){
								var tempv = $(this).attr("value");
								if(tempv!=value){
									text =  $(this).text();
									value = tempv;
								}
								
								
							}
						});
						
					}					
				}
				temval[type] = value;// 二级可覆盖父级值和
				temtext[type] = text;
				val = $.extend({}, val, temval);
				texts = $.extend({}, texts, temtext);
			}
		}
		this.values = val;
		this.texts = texts;
		return val;
	}
	//显示二级查询面板
	SelPanel.prototype.loadSecondaryData = function(params) {
		var param = params[0]
		var type = param.type;
		var data = param.data;
		var value = param.value;
		var defaultIndex = param.defaultIndex;//默认选中索引号
		var e = param.e;// click e? 需要加二级查询的父元素 this.values

		var lihtml = "";
		var activecls="";
		var panstyle="";
		var arrowstyle="";
		var offleft=$(e).parent()[0].offsetLeft;
		var outerwith=$(e).parent().parent()[0].clientWidth;
		var diff =(offleft+6+300-outerwith);
		if(diff>0){
			panstyle="style='left:-"+diff+"px' ";
			arrowstyle="style='left:"+diff+"px' ";
		}
		for (var k = 0; k < data.length; k++) {
			activecls="";
			if(defaultIndex!=null&&defaultIndex!=""&&String(Number(defaultIndex))!="NaN"&&k==Number(defaultIndex)){
				activecls=" active "
			}
			if(this.values[type]==data[k].value ){
				activecls=" active "
			}
			lihtml += "<li class='left'>" + "<a class='mkbtn-select second-sel "+activecls+"' value='"
					+ data[k].value + "'>" + data[k].text
			"</a>" + "</li>";
		}
		var html = "<div class='asy-secondary-pane ' "+panstyle+">"
				+ "<div class='arrow-outer' "+arrowstyle+"><span class='top-arrow'></span><span class='bottom-arrow'></span></div>"
				+ "<ul type='" + type + "' class='mk-clearfix '>" + lihtml
		"</ul>" + "</div>";
		$(e).parent().append(html);
	}
	SelPanel.prototype.getText = function() {
		return this.texts;
	}
	SelPanel.prototype.setValues = function(vals) {
		if (vals != null) {
			vals = vals[0];
		}
		var newV = {};
		var $typeuls = $(this.dom).find(".sel-groups .sel-line");
		for (var u = 0; u < $typeuls.length; u++) {
			var type = $($typeuls[u]).attr("type");
			if (vals[type] != null) {
				$($typeuls[u]).find("li a").removeClass("active")
				$($typeuls[u]).find("li a[value='" + vals[type] + "']")
						.addClass("active");
				newV[type] = vals[type];
				this.checkLimit(type, vals[type]);
			}
		}
		this.values = newV;
		return;
	}
	SelPanel.prototype.getValues = function() {
		return this.values;
	}
	/*
	 * function pathsplit (){ var s = location.search.trim() ; if(s!=""){ } }
	 */
	function Plugin(options) {
		var opts = $.fn.selpane.defaults;
		if (typeof options == "string") {
			var $bar = $(this).data("selpane");
			if ($bar != null) {
				var arg = Array.prototype.slice.call(arguments, 1);
				return $bar[options](arg);
			}

			return;
		}
		opts = $.extend({}, opts, options);
		return this.each(function() {
			var $bar = $(this).data("selpane");
			if ($bar == null) {
				$(this).data("selpane", $bar = new SelPanel(this, opts));
			}
		});
	}
	/*
	 * Plugin.prototype.getValue=function(){ return this.value; }
	 */

	$.fn.selpane = Plugin;
	$.fn.selpane.defaults = {
		onTagItemClick : function() {
		},
		onSelItemClick : function() {
		},
		onHoverItemClick:function(){
			
		},
		onResize : function() {
		}
	}
	/*
	 * $(window).on('load', function () {
	 * $('[data-comp="sel-pane"]').each(function () { var $carousel = $(this)
	 * Plugin.call($carousel, $carousel.data());//$carousel.data()这里可以没有参数 }) })
	 */

})