$(function(){
	var cssSelectedAll = "selected-all";//全选样式
	var cssSelectedPart = "selected-part";//选择部分 样式
	$(".multiSelect>.level2>.content>ul>li").delegate(".head","click",function(event){
		putOldChildBack();//将原child放回相应的parent
		//展示数据
		var $me = $(this);
		$me.parent("li").addClass("on").siblings("li").removeClass("on")
		var $child = $($me.siblings(".level3"));
		if($child==null){
			//没有子数据，去后台请求
			//childdata=..
			debugger
		}
		var $level3Stage = $(".multiSelect .level3-stage");
		$level3Stage.append($child);
			
	});
	/** 将原child放回相应的parent */
	function putOldChildBack(){
		var $level3Stage = $(".multiSelect .level3-stage");
		var $childOld = $level3Stage.children(".level3");
		var parentNodeId = $level3Stage.children(".level3").attr("data-parent-node-id");
		var $parentNode = $(".multiSelect .level2 .content ul li[data-node-id="+parentNodeId+"]");
		
		$parentNode.append($childOld);
	}
	
	$(".multiSelect>.level2>.content>ul>li>a").delegate("input[type=checkbox]","click",function(event){
		event.stopPropagation();
	});
	/** checkbox单击事件*/
	$(".multiSelect input[type=checkbox]").click(function(event){
		event.stopPropagation();
		var $this = $(this);
		var $parentLi = $this.parents("li");
		var nodeid = $parentLi.attr("data-node-id");
		var text = $this.parent("a").text();
		var className = "level"+getLevel($this);
		if($this.is(':checked')){
			//已选中行  插入节点
			var a = $("<a class='item "+className+"' data-ref-node-id='"+nodeid+"'>"+text+"<span class='icon'></span></a>");
			$(".selected-stage .content").append($(a));
			//增加全选样式
			$parentLi.addClass(cssSelectedAll);
		}else{
			//从已选择行中删除
			deleteFromSelectedByID(nodeid);
			//移除全选样式
			$parentLi.removeClass(cssSelectedAll);
		}
	});
	/** 已选择*/
	$(".selected-stage .content").delegate(".item","click",function(event){
		var $this = $(this);
		//设置源checkbox为未选择状态
		var nodeid = $this.attr("data-ref-node-id");
		setNodeUncheckedById(nodeid);
		//删除自己
		$this.remove();
	});
	//全选
	$(".level3").delegate(".btn-select-all","click",function(){
		var $this = $(this);
		var parentNodeId = getParentNodeidByObj($this);
		debugger
		//获取同级li
		$this.parents(".level3 .content li input[tupe=checkbox]").map(function(obj){
			debugger
			
		});
		//根据parentNodeId全选
//		$(".level3[data-parent-node-id = "+parentNodeId+"]")
	});
	/**通过ID获取**/
	function getNodeById(nodeid){
		var li = $(".multiSelect .content li[data-node-id="+nodeid+"]");
		return li;
	}
	function getSelectedStage(){
		var o = $(".multiSelect .selected-stage .content");
		return o;
	};
	function getSelectedNodeById(nodeid){
		return $(".multiSelect .selected-stage .content .item[data-ref-node-id="+nodeid+"]");
	}
	function getParentNodeidByObj(obj){
		var nodeid = $(obj).parents(".level3").attr("data-parent-node-id");
		return nodeid;
	}
	/**删除节点**/
	function deleteFromSelectedByID(nodeid){
//		$(getSelectedStage()).get().remove();
		$(getSelectedNodeById(nodeid)).remove();
	}
	/**设置节点为未选中**/
	function setNodeUncheckedById(nodeid){
		var node = getNodeById(nodeid);
		$(node).find("input[type=checkbox]")[0].checked = false;
		
		deleteFromSelectedByID(nodeid);
		
		//样式
//		var level 
	}
	/**获取节点所在层级**/
	function getLevel(obj){
		if($(obj).parents(".level3").length!=0){
			return 3;
		}else if($(obj).parents(".level2").length!=0){
			return 2;
		}else{
			return 1;
		}
	}
	
	//通过nodeid获取已选择节点
});
