(function($) {
	var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
			'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
			'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

	function generateMixed(n) {
		var res = "";
		for (var i = 0; i < n; i++) {
			if(i==0){
				var id = Math.ceil(Math.random() * 24+11);
			}else{
				var id = Math.ceil(Math.random() * 35);
			}
			
			res += chars[id];
		}
		return res;
	}
	function simpleWin(data) {
		// data:{msg,ok_fun:function,close_fun,closebtn:true,okbtn:true;width;height:10rem}
		var ids = generateMixed(6);
		var width = null;
		var height = null;
//		if (data.width) {
//			var pos1 = data.width.toString().trim().indexOf("rem");
//			width = data.width.toString().trim().substring(0, pos1);
//		}
//		if (data.height) {
//			var pos2 = data.height.toString().trim().indexOf("rem");
//			height = data.height.toString().trim().substring(0, pos2);
//		}
		var html = "<div class='fore_ppwin fore_simppopwin'  style='";
//		if (width != null) {
//			html += "width:" + width + "rem;";
//			html += "margin-left:-" + (width/2 )+ "rem;";
//		}
//		if (height != null) {
//			html += "height:" + height + "rem;";
//			html += "margin-top:-" + (width/2 )+ "rem;";
//		}
		
		html += "'";
		html += " id='" + ids + "'>";
		html +="";
		if (data.closebtn == false) {
		} else {
			html += "<div class='fore_rightalign'><div class='fore_simpclosebtn'>×</div></div>";
		}
		html += "<div class=' winbody'>" + data.msg + "</div>";
		if (data.okbtn) {
			html += +"<div class='pop_bbar'>" + "<div class='ok_btn'>确定</div>"
					+ "</div>";
		}

		html += "</div>";
		html+= " <div class='fore_ppwin fore_backdrop' style=''> </div>  ";

		// var html = "<div class='pop_win winback ' id="
		// + ids
		// + " >"
		// + "<div class=''>"
		// + ""
		// + data.msg
		// + "</div>"
		// + "<div class='pop_bbar'>"
		// + "<div class='ok_btn'>确定</div>"
		// + "</div>"
		// + "</div>"
		// + " <div class='pop_win fore_backdrop' style=''> </div> ";
		$(".fore_ppwin").remove();
		// $(".fore_simppopwin").remove();
		$("body").append(html);
		var height=$(".fore_ppwin.fore_simppopwin").height();
		var  width=$(".fore_ppwin.fore_simppopwin").width();
		$(".fore_ppwin.fore_simppopwin")[0].style.marginTop="-"+(height/2)+"px";
		$(".fore_ppwin.fore_simppopwin")[0].style.marginLeft="-"+(width/2)+"px";
		
		if (data.okbtn) {
			$(".fore_simppopwin#" + ids + " .ok_btn").off("click")
			$(".fore_simppopwin#" + ids + " .ok_btn").on("click", function() {
						if (data.ok_fun) {
							data.ok_fun();
						}

					});
		}
		console.log("closelick", $(".fore_simppopwin#" + ids
						+ " .fore_simpclosebtn"));
		$(".fore_simppopwin#" + ids + " .fore_simpclosebtn").off("click")
		$(".fore_simppopwin#" + ids + " .fore_simpclosebtn").on("click",
				function() {
					$(".fore_ppwin").remove();

					if (data.close_fun) {
						data.close_fun();
					}

				});

	};
	$.extend($.fn, {
				simpleWin : simpleWin
			});
})(Zepto);