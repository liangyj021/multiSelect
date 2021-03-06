$.fn.multiSelect = function(data) {
	
	var myconst = {
		level1:"1",
		level2:"2",
		level3:"3",
		level3Stage:"level3-stage",
		selectedStage:"selected-stage"
		}
	var this_ = $(this);
	var dataNodeId = 0;
	/*************************** 初始化 ***************************/
	(function() {
		var $multiSelect = $("<div class='multiSelect'></div>");
//		$multiSelect.append(createLevel1(1, data.leve1));
//		$multiSelect.append(createLevel2(2, data.leve2));
		var $switchPanel = createSwitchPanel();
		
		$switchPanel.append(createLevel3(1, data.leve1.data,"",data.leve1.parentNodeId));
		$switchPanel.append(createLevel3(2, data.leve2.data,"3",data.leve2.data.parentNodeId));
		$switchPanel.append(createLevel3Stage());
		
		$multiSelect.append($switchPanel);
		$multiSelect.append(createSwitchBtn);
		$multiSelect.append(createSelectedStage());
		this_.append($multiSelect);
		
		multiSelect_addEventListener();
	})();
	/******************************生成dom*****************************/
	function createSwitchPanel(){
		return $("<div class='switch-panel'></div>")
	}
	function createSwitchBtn(){
		return $("<div class='switch-btn'><div class='arrow'></div></div>");
	}
	//生成第一级
	function createLevel1(level, dataOfLevel) {
		var $panel = $("<div class='level"+level+"'></div>");
		var $title = $("<div class='title'></div>");
		var $content = $("<div class='content'></div>");
		var $right = $("<div class='right'></div>");
		var $ul=$("<ul></ul>");
		$.each(dataOfLevel,function(index, obj){
			$ul.append(createLI(level, obj));
		});
		
		$panel.append($title);
		$panel.append($content.append($ul));
		$panel.append($right);
		return $panel;
	}
	//生成第二级
	function createLevel2(level, dataOfLevel) {
		var $panel = $("<div class='level"+level+"'></div>");
		var $title = $("<div class='title'></div>");
		var $content = $("<div class='content'></div>");
		var $right = $("<div class='right'></div>");
		var $ul=$("<ul></ul>");
		$.each(dataOfLevel,function(index, obj){
			$ul.append(createLI(level, obj));
		});
		
		$panel.append($title);
		$panel.append($content.append($ul));
		$panel.append($right);
		return $panel;
	}
	//生成第三级
	function createLevel3(level, dataOfLevel, childAmount, parentNodeId) {
		var $panel = $("<div class='level"+level+"' data-parent-node-id='"+parentNodeId+"'></div>");
		var $title = $("<div class='title'>"+gettitle(level, parentNodeId)+"</div>");
		var $content = $("<div class='content'></div>");
		var $right = $("<div class='right'></div>");
		var $ul=$("<ul></ul>");
		$.each(dataOfLevel,function(index, obj){
			$ul.append(createLI(level, obj, childAmount));
		});
		
		$panel.append($title);
		$panel.append($content.append($ul));
		$panel.append($right);
		return $panel;
	}

	//生成 level3 展示区域
	function createLevel3Stage() {
		return $("<div class='level3-stage'></div>");
	}
	//生成 已选择 展示区域
	function createSelectedStage() {
		return $("<div class='selected-stage'><div class='title'>已选择：</div><div class='content'></div><div class='right'></div></div>");
	}
	function createLI(level, obj, childAmount){
		if(level==3){
			var li = "<li data-node-id='"+dataNodeId+"' data-child-amount='"+childAmount+"'><a><input type='checkbox' value='"+obj.value+"'>"+obj.name+"</a></li>";
		}else{
			var li = "<li data-node-id='"+dataNodeId+"' data-child-amount='"+childAmount+"'><div class='header'><a><input type='checkbox' value='"+obj.value+"'>"+obj.name+"</a><span class='num'></span></div></li>";
		}
		dataNodeId++;
		return $(li);
	}
	function gettitle(level, parentNodeId) {
		if (level == myconst.level1) {
			return "本院：";
		} else if (level == myconst.level2) {
			return "筛选辖区："
		} else if (level == myconst.level3) {
			var name = $(".multiSelect .level2 .content li[data-node-id='"+parentNodeId+"'] .header a").text();
			return name+"：";
		}else if(level == myconst.level3Stage){
			return "**州";
		}else if(level == myconst.selectedStage){
			return "已选择";
		}
	}
	/*********************************点击事件处理******************************/
	function level2Click($btn, dataLevel3){
		//将原child放回相应的parent
		putOldChildBack(); 
		//展示数据
		$btn.parent("li").addClass("on").siblings("li").removeClass("on")
		var $child = $($btn.siblings(".level3"));
		var length = $child.find("li").length;
		if(length==0 && dataLevel3 ==0){ 
			alert("没有数据");
			debugger
		}
		if (length == 0 && dataLevel3!=null) {
			//渲染三级节点
			$child = createLevel3(3, dataLevel3.data, "0", dataLevel3.parentNodeId);
			length = $child.find("li").length;
		}
		//设置父节点孩子数
		$btn.parents("li").attr("data-child-amount", length);
		var $level3Stage = $(".multiSelect .level3-stage");
		$level3Stage.append($child);
	}
	function isHasChild($btn){
		var $child = $($btn.siblings(".level3"));
		var length = $child.find("li").length;
		if(length > 0){
			return true;
		}
		return false;
	}
	/** 将原level3放到对应的level2下 */
	function putOldChildBack() {
		var $level3Stage = $(".multiSelect .level3-stage");
		var $childOld = $level3Stage.children(".level3");
		var parentNodeId = $level3Stage.children(".level3").attr("data-parent-node-id");
		var $parentNode = $(".multiSelect .level2 .content ul li[data-node-id=" + parentNodeId + "]");
		$parentNode.append($childOld);
	}
	/*********************** 返回方法 可供外部调用  ***********************************/
	return {
		createLevel3: createLevel3,
		putOldChildBack: putOldChildBack,
		level2Click: level2Click,
		isHasChild: isHasChild
		
	}
}



var multiSelect_addEventListener = function(){
	var cssSelectedAll = "selected-all"; //全选样式
	var cssSelectedPart = "selected-part"; //选择部分 样式
	var cssBtnQuanxuan = "on"; //全选按钮 选中样式
	var state = {
		empty: "empty",
		part: "part",
		all: "all"
	};
		/** checkbox单击事件*/
	$(".multiSelect").delegate("input[type=checkbox]","click",function(event) {
//		event.stopPropagation();
		var $this = $(this);
		var $parentLi = $this.parents("li");
		var nodeid = $parentLi.attr("data-node-id");
		var level = getLevel($this);

		if ($this.is(':checked')) {
			//已选中行  插入节点
			createNodeOnSelectedStage(nodeid);
			//增加全选样式
			$parentLi.addClass(cssSelectedAll);
			if (level == 1) {
				//设置子节点全选
//				$(".multiSelect input[type=checkbox]").map(function(){
//					this.checked = true;
//					$(this).parents("li").addClass(cssSelectedAll)
//				});
			}else if (level == 2) {
				//设置子节点全选
				setChildAllSelected(nodeid);
			}else if(level == 3){
				//监听数量
				setNum(nodeid, 1);
			}
		} else {
			//从已选择行中删除
			setNodeUncheckedById(nodeid);
			//移除全选样式
			$parentLi.removeClass(cssSelectedAll);
			//取消子节点全选
			if (level == 1) {
//				$(".multiSelect input[type=checkbox]").checked = false;
			}else if (level == 2) {
				setChildAllUnselected(nodeid);
			}else if(level == 3){
				//监听数量
				var parentId = getParentNodeidByObj(getNodeById(nodeid));
				var curstate = getState(nodeid);
				if(curstate==state.all){
					//移除父级 
					if(getRefNodeById(parentId).length>0){
						removeItemFromStageById(parentId);
					}
					//检测增加同级
					$(".level3[data-parent-node-id = " + parentId + "] .content li").map(function() {
						var thisId = $(this).attr("data-node-id");
						if(nodeid!=thisId && getRefNodeById(thisId).length==0){
							createNodeOnSelectedStage(thisId);
						}
					});
				}
				setNum(nodeid, -1);
			}
		}
		
		//检测全选状态
		//判断当前层级
		//当前层级是否全选
	});

	function getState(nodeid){
		var parentId = getParentNodeidByObj(getNodeById(nodeid));
		var $parent = getNodeById(parentId);
		var $num = $parent.find(".header .num");
		var amount = $parent.attr("data-child-amount");
		
		var num=0;
		if($num.text()!=""){
			num = parseInt($num.text());
		}
		if(num==0){
			return state.empty;
		}else if(num>0 && num<amount){
			return state.part;
		}else if(num==amount){
			return state.all;
		}else{
		debugger
			alert("出错了")
		}
	}
	function getNum(nodeid){
		var parentId = getParentNodeidByObj(getNodeById(nodeid));
		var $parent = getNodeById(parentId);
		var $num = $parent.find(".header .num");
		
		var num = 0;
		if($num.text()!=""){
			num = parseInt($num.text());
		}
		return num;
	}
	function setNum(nodeid, num){
		var parentId = getParentNodeidByObj(getNodeById(nodeid));
		var $parent = getNodeById(parentId);
		var $num = $parent.find(".header .num");
		var amount = $parent.attr("data-child-amount");
		
		num = num + getNum(nodeid);
		if(num==0){
			//没有选中
			$parent.removeClass(cssSelectedPart);
			$parent.removeClass(cssSelectedAll);
		}else if(num>0 && num<amount){
			//部分选中
			$parent.addClass(cssSelectedPart);
			$parent.removeClass(cssSelectedAll);
			setNodeUnchecked(parentId)
		}else if(num == amount){
			//全部选中
			$parent.addClass(cssSelectedAll)	
			setNodeChecked(parentId);
			
			//移除同级 增加父级
			var children = getChildrenIdByParentId(parentId);
			//移除三级子节点
			removeItemsFromStage(children);
			//增加二级父节点  判重
			if(getRefNodeById(parentId).length==0){
				createNodeOnSelectedStage(parentId)
			}
		}
		$num.text(num);
	}
	/**
	 * @param array of data-ref-node-id
	 * */
	function removeItemsFromStage(arr){
		$(".selected-stage .content .item").each(function(index, item){
			var $this = $(this);
			var itemid =  $(this).attr("data-ref-node-id");
			var flag = $.inArray(itemid, arr);
			if(flag>=0){
				$this.remove();
			}
		});
	}

	/**
	 * @param data-ref-node-id
	 * */
	function removeItemFromStageById(nodeid){
		getRefNodeById(nodeid).remove();
	}

	/**
	 * 全选三级节点
	 * @parentNodeId 三级节点对应的二级节点ID
	 * */
	function setChildAllSelected(parentNodeId) {
		var $parentNode = getNodeById();
		$(".level3[data-parent-node-id = " + parentNodeId + "] .content li input[type=checkbox]").map(function() {
			if (this.checked == true) {
				return;
			}
			this.checked = true;

			var $node = $(this).parents("li");
			var nodeid = $node.attr("data-node-id");
			setNum(nodeid, 1);
		});
		//设置父节点
		$parentNode.addClass(cssSelectedAll);
		setNodeChecked(parentNodeId);
	}
	/**
	 * 全部取消三级节点
	 * @parentNodeId 三级节点对应的二级节点ID
	 * */
	function setChildAllUnselected(parentNodeId) {
		var $parentNode = getNodeById();
		$(".level3[data-parent-node-id = " + parentNodeId + "] .content li input[type=checkbox]").map(function() {
			if (this.checked == false) {
				return;
			}
			this.checked = false;

			var $node = $(this).parents("li");
			var nodeid = $node.attr("data-node-id");
			setNodeUncheckedById(nodeid);
			setNum(nodeid, -1);
		});
		//设置父节点
		$parentNode.removeClass(cssSelectedAll);
		setNodeUnchecked(parentNodeId);
	}
	/**已选择行 生成节点*/
	function createNodeOnSelectedStage(nodeid) {
//		//判重
//		if(getRefNodeById(nodeid).length>0){
//			return;
//		}
		
		var $node = getNodeById(nodeid);
		var level = getLevel($node);
		var className = "level" + level;
		var text = "";
		if (level == 3) {
			text = $node.children("a").text();
		} else {
			//level2
			text = $node.find(".header a").text();
		}

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
		
		var level = getLevel(getNodeById(nodeid));
		//监听数量
		if(level == 3){
			setNum(nodeid, -1);
		}else if(level == 2){
			//取消子节点checkbox
			setChildAllUnselected(nodeid);
		}
	});

	/**
	 * @param parentid
	 * @return Array of childrenIDs
	 * */
	function getChildrenIdByParentId(parentId){
		var idArray = $(".level3[data-parent-node-id = " + parentId + "] .content li").map(function() {
			return $(this).attr("data-node-id");
		});
		return idArray;
	}
	/**
	 * @return Array of SelectedStage ItemIDs
	 * */
	function getSelectedStageItemsId(){
		var idArray = $(".multiSelect .selected-stage .content .item").map(function() {
			return $(this).attr("data-ref-node-id");
		});
		return idArray;
	}
	/**
	 * @param parentid
	 * @return Array of childrenIDs
	 * */
	function getChildrenIdByParentId(parentId){
		var idArray = $(".level3[data-parent-node-id = " + parentId + "] .content li").map(function() {
			return $(this).attr("data-node-id");
		});
		return idArray;
	}
	/**
	 * @return Array of SelectedStage ItemIDs
	 * */
	function getSelectedStageItemsId(){
		var idArray = $(".multiSelect .selected-stage .content .item").map(function() {
			return $(this).attr("data-ref-node-id");
		});
		return idArray;
	}
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

	/**已选中行 删除节点、设置节点为未选中**/
	function setNodeUncheckedById(nodeid) {
		//设置checkbox
		setNodeUnchecked(nodeid);
		//从舞台删除
		removeItemFromStageById(nodeid)
	}
	/** 通过node取消checkbox选中*/
	function setNodeUnchecked(nodeid) {
		var node = getNodeById(nodeid);
		if (node.find("input[type=checkbox]").length == 0) {
			return;
		}
		node.find("input[type=checkbox]")[0].checked = false;
		node.removeClass(cssSelectedAll);
	}
	/** 通过node设置checkbox为选中*/
	function setNodeChecked(nodeid) {
		var node = getNodeById(nodeid);
		if (node.find("input[type=checkbox]").length == 0) {
			return;
		}
		node.find("input[type=checkbox]")[0].checked = true;
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
	/**展开收起**/
	$(".multiSelect .switch-btn").delegate(".arrow", "click", function(){
		var $this = $(this);
		var $panel = $(".switch-panel");
		$panel.slideToggle("normal");
		$this.toggleClass("close", "slow");
	});

}
