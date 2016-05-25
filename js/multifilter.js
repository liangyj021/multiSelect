$(function() {
	var cssSelectedAll = "selected-all"; //全选样式
	var cssSelectedPart = "selected-part"; //选择部分 样式
	var cssBtnQuanxuan = "on"; //全选按钮 选中样式
	$(".multiSelect>.level2>.content>ul>li").delegate(".head", "click", function(event) {
		putOldChildBack(); //将原child放回相应的parent
		//展示数据
		var $me = $(this);
		$me.parent("li").addClass("on").siblings("li").removeClass("on")
		var $child = $($me.siblings(".level3"));
		if ($child == null) {
			//没有子数据，去后台请求
			//childdata=..
			debugger
		}
		var $level3Stage = $(".multiSelect .level3-stage");
		$level3Stage.append($child);

	});
	/** 将原child放回相应的parent */
	function putOldChildBack() {
		var $level3Stage = $(".multiSelect .level3-stage");
		var $childOld = $level3Stage.children(".level3");
		var parentNodeId = $level3Stage.children(".level3").attr("data-parent-node-id");
		var $parentNode = $(".multiSelect .level2 .content ul li[data-node-id=" + parentNodeId + "]");

		$parentNode.append($childOld);
	}

	$(".multiSelect>.level2>.content>ul>li>a").delegate("input[type=checkbox]", "click", function(event) {
		event.stopPropagation();
	});
	/** checkbox单击事件*/
	$(".multiSelect input[type=checkbox]").click(function(event) {
		event.stopPropagation();
		var $this = $(this);
		var $parentLi = $this.parents("li");
		var nodeid = $parentLi.attr("data-node-id");
		var level = getLevel($this);

		if ($this.is(':checked')) {
			//已选中行  插入节点
			createNodeOnSelectedStage(nodeid);
			//增加全选样式
			$parentLi.addClass(cssSelectedAll);
			//设置子节点全选
			if (level == 2) {
				setChildAllSelected(nodeid);
			}
		} else {
			//从已选择行中删除
			deleteFromSelectedByID(nodeid);
			//移除全选样式
			$parentLi.removeClass(cssSelectedAll);
			//取消子节点全选
			if (level == 2) {
				setChildAllUnselected(nodeid);
			}
		}
	});
	//全选子节点
	function setChildAllSelected(parentNodeId) {
		var $parentNode = getNodeById();
		$(".level3[data-parent-node-id = " + parentNodeId + "] .content li input[type=checkbox]").map(function() {
			if (this.checked == true) {
				return;
			}
			this.checked = true;

			var $node = $(this).parents("li");
			var nodeid = $node.attr("data-node-id");
			createNodeOnSelectedStage(nodeid)
		});
		//设置父节点
		$parentNode.addClass(cssSelectedAll);
		setNodeChecked(parentNodeId);
	}
	//取消子节点全选
	function setChildAllUnselected(parentNodeId) {
		var $parentNode = getNodeById();
		$(".level3[data-parent-node-id = " + parentNodeId + "] .content li input[type=checkbox]").map(function() {
			if (this.checked == false) {
				return;
			}
			this.checked = false;

			var $node = $(this).parents("li");
			var nodeid = $node.attr("data-node-id");
			deleteFromSelectedByID(nodeid);
		});
		//设置父节点
		$parentNode.removeClass(cssSelectedAll);
		//		setNodeUnchecked($parentNode);
		setNodeUnchecked(parentNodeId);
	}
	/**已选择行 生成节点*/
	function createNodeOnSelectedStage(nodeid) {
		var $node = getNodeById(nodeid);
		var level = getLevel($node);
		if (level == 3) {
			var text = $node.children("a").text();
		} else {
			//level2
			var text = $node.find(".head a").text();
		}
		var className = "level" + level;

		var a = $("<a class='item " + className + "' data-ref-node-id='" + nodeid + "'>" + text + "<span class='icon'></span></a>");
		$(".selected-stage .content").append($(a));
	}
	/** 已选择行 节点点击事件*/
	$(".selected-stage .content").delegate(".item", "click", function(event) {
		var $this = $(this);
		//设置源checkbox为未选择状态
		var nodeid = $this.attr("data-ref-node-id");
		setNodeUncheckedById(nodeid);
		//删除自己
		$this.remove();
	});
	//全选按钮事件
	$(".level3").delegate(".btn-select-all", "click", function() {
		var $btn = $(this);
		var parentNodeId = getParentNodeidByObj($btn);
		//调用父节点checkbox事件，实现全选
		getNodeById(parentNodeId).find("input[type=checkbox]").click();

	});

	/**
	 * @param data-node-id
	 * @return node
	 * */
	function getNodeById(nodeid) {
		var li = $(".multiSelect .content li[data-node-id=" + nodeid + "]");
		return li;
	}
	/**
	 * @param data-ref-node-id
	 * @return node
	 * */
	function getRefNodeById(nodeid) {
		return $(".multiSelect .selected-stage .content .item[data-ref-node-id=" + nodeid + "]");
	}
	/** 
	 * @param data-parent-node-id
	 * @return node
	 * */
	function getChildByParentId(nodeid) {
		var node = $(".multiSelect .level3[data-parent-node-id=" + nodeid + "]");
		return node;
	}
	/** 
	 * @param node
	 * @return data-parent-node-id
	 * */
	function getParentNodeidByObj(obj) {
		var nodeid = $(obj).parents(".level3").attr("data-parent-node-id");
		return nodeid;
	}
	/**
	 * 已选中行 删除节点
	 * @param data-ref-node-id
	 * **/
	function deleteFromSelectedByID(nodeid) {
		$(getRefNodeById(nodeid)).remove();
		//修改数字 或全选样式
		getNodeById(nodeid).click()
	}
	/**设置节点为未选中**/
	function setNodeUncheckedById(nodeid) {
		//		var node = getNodeById(nodeid);
		setNodeUnchecked(nodeid);

		deleteFromSelectedByID(nodeid);
	}
	/** 通过node取消checkbox选中*/
	function setNodeUnchecked(nodeid) {
		var node = getNodeById(nodeid);
		if (node.find("input[type=checkbox]").length == 0) {
			return;
		}
		node.find("input[type=checkbox]")[0].checked = false;
		node.removeClass(cssSelectedAll);
		//设计level2样式
	}
	/** 通过node设置checkbox为选中*/
	function setNodeChecked(nodeid) {
		var node = getNodeById(nodeid);
		if (node.find("input[type=checkbox]").length == 0) {
			return;
		}
		node.find("input[type=checkbox]")[0].checked = true;
		//设置level2样式
	}
	/**获取节点所在层级**/
	function getLevel(obj) {
		if ($(obj).parents(".level3").length != 0) {
			return 3;
		} else if ($(obj).parents(".level2").length != 0) {
			return 2;
		} else {
			return 1;
		}
	}
});