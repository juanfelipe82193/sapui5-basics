//  please leave these comments untouched!!!
/// <reference path="../../../../../../../visualstudiosupport/sap-ui-core-all.js" />
/// <reference path="../../../../../../../visualstudiosupport/jquery-1.4.4.js" />
if (!window.sap) {
	window.sap = {};
}

if (!sap.zen) {
	sap.zen = {};
}

var sapbi_page = sapbi_page || {};

sap.zen.Dispatcher = function() {
	"use strict";

	var that = this;

	var mapHandlers = {};
	var component_rootele_map = {};
	var mapResizeHandlers = {};

	var suppressRenderingFlag = false;

	var lastDeltaSent = [];

	var bIsDeferredRendering = false;

	var iDelayDispatchingCount = 0;
	var fDelayedCallback = null;
	var bIsInDispatcher = false;
	
	var oUnhandledDropHandlerRegistry = {};
	var oDragDropCancelHandlerRegistry = {};
	var oDragDropPayload;
	var bDragDropEscKeyHandlerRegistered;
	// false by default!
	var bInterComponentDragDropEnabled;
	var oContextMenu;

	if (sapbi_page.m_profileMode && jQuery.sap.measure.getActive()) {
		var iHandlerCounter = 0;
	}

	this.reset = function() {
		component_rootele_map = {};
		mapResizeHandlers = {};
	};

	this.addHandler = function(sType, iIndex, oHandlerObject) {
		if (sapbi_page.m_profileMode && jQuery.sap.measure.getActive()) {
			jQuery.sap.log.info("Register Handler " + iHandlerCounter);
			if (!jQuery.sap.measure.getMeasurement("zen addHandler " + iHandlerCounter)) {
				jQuery.sap.measure.start("zen addHandler " + iHandlerCounter, "addHandler/" + sType);
			} else {
				jQuery.sap.measure.end("zen addHandler " + iHandlerCounter);
				jQuery.sap.measure.start("zen addHandler " + (++iHandlerCounter), "addHandler/" + sType);
			}
		}
		var aHandlersForType = mapHandlers[sType];
		if (!aHandlersForType) {
			aHandlersForType = [];
			mapHandlers[sType] = aHandlersForType;
		}
		aHandlersForType[iIndex] = oHandlerObject;

	};

	this.addHandlers = function(sType, oHandlerObject, decoratorObjectOrName) {
		this.addHandler(sType, 0, oHandlerObject);
		if (sap.zen.designmode) {
			this.addHandler(sType, 1, new sap.zen.designmode.DefaultDesignHandler(null, decoratorObjectOrName,
					oHandlerObject));
		}

	};

	this.getHandlers = function(sType) {
		var handler = mapHandlers[sType];
		if (handler) {
			return handler.slice();
		}

		throw "No handler found for type " + sType;
	};

	this.removeHandlers = function(sType) {
		delete mapHandlers[sType];
	};

	this.dispatchDelta = function(aComponentArray) {
		this.deleteMessageStack();
		suppressRenderingFlag = true;
		bIsDeferredRendering = false;
		lastDeltaSent = aComponentArray;
		this.resizeControlsForNotification = [];
		for (var i = 0; i < aComponentArray.length; i++) {
			var oComponent = aComponentArray[i];
			if (oComponent.component) {
				this.dispatchUpdateControl(oComponent.component, false);
			} else {
				this.dispatchUpdateControl(oComponent, true);
			}
			this.notifyControlsOfResize();
		}
		destroyRemainingTransferControls();

		this.doAfterDispatchingWork();
		suppressRenderingFlag = false;
		lastDeltaSent = [];
		this.renderDeferredObjects();
		return true;
	};
	
	this.resizeControlsForNotification = [];
	
	
	this.registerControlForResizeNotificationIfNecessary = function(oRootControl, oldPos, newPos, oldWidth, newWidth, oldHeight, newHeight){
		if (oldPos && newPos && oRootControl) {
			var isEqual = true;
			// Check for position change

			for ( var onePos in newPos) {
				if (newPos.hasOwnProperty(onePos)) {
					var oneOldPos = oldPos[onePos];
					if (!oneOldPos) {
						isEqual = false;
						break;
					}

					if (newPos[onePos] !== oneOldPos) {
						isEqual = false;
						break;
					}
				}
			}

			// Check for width/height change (old is Number and new is String => compare with != and not !==)
			if (oldWidth !== null && newWidth) {
				if (oldWidth != newWidth && newWidth !== "auto") {
					isEqual = false;
				}
			}
			if (oldHeight !== null && newHeight) {
				if (oldHeight != newHeight && newHeight !== "auto") {
					isEqual = false;
				}
			}

			if (!isEqual) {
				this.resizeControlsForNotification.push(oRootControl);
			}
		}
	}
	
	
	this.notifyControlsOfResize = function(){
		//This is to notify controls of resizes that happen in a delta, in one of the parent containers or in a control itself.
		//This is NOT the same as the resizeing of window callback. It uses the same map and interface however.
		//In a future, we should consider delaying the calls so that it is more likely that rendering has finished.
		for (var i = 0; i < this.resizeControlsForNotification.length; i++) {
			var oRootControl = this.resizeControlsForNotification[i];
				for ( var oControl in mapResizeHandlers) {
					if (mapResizeHandlers.hasOwnProperty(oControl)) {
						var value = mapResizeHandlers[oControl];
						if (!(typeof value.obj === "string")) {
		
							var sIdOfRegisteredControl = value.obj.getId();
							var flag = true;
							if (oRootControl.getId() !== sIdOfRegisteredControl) {
								//Check if controls are even under the root control that was resized
								var result = $(document.getElementById(oRootControl.getId())).find("#" + $.sap.encodeCSS(sIdOfRegisteredControl));
								flag = (result && result.length > 0);
							}
							if (flag) {
								var entry = mapResizeHandlers[oControl].handler;
								var fHandler = entry["beginResize"];
								if (fHandler) {
									fHandler.call(entry, {});
								}
		
								fHandler = entry["endResize"];
								if (fHandler) {
									fHandler.call(entry, {});
								}
		
							}
						}
					}
			}
		}
	}
	
	this.dragHandler = function(){
		var that = this;
		this.dragAreas = [];
		this.dropAreas = [];
		
		this.activeDragArea = null;
		
		this.registerActiveDragArea = function(oDragArea){
			if(this.activeDragArea === null){
				this.activeDragArea = oDragArea;
				return;
			}
			throw "Unregister active drag area first!";
		}
		
		this.unregisterActiveDragArea = function(){
			this.activeDragArea = null;
		}
		
		this.isDragAreaActive = function(){
			return this.activeDragArea !== null;
		}
		
		this.getDragAreas = function(){
			return this.dragAreas;
		}
		
		this.registerDragArea = function(oDragArea){
			if(this.dragAreas.indexOf(oDragArea) === -1){
				this.dragAreas.push(oDragArea);
			}
		}
		
		this.unregisterDragArea = function(oDragArea){
			var index = this.dragAreas.indexOf(oDragArea);
			if (index > -1) {
				this.dragAreas.splice(index, 1);
			}
		};
		
		var lastAffectedAreas = [];
		
		
		this.notifyAffectedDropAreas = function(e){
			var found, i, j;
			var allAffectedAreas = this.getAllAffectedDropAreas();
			for (i = 0; i < allAffectedAreas.length; i++) {
				var oneALLArea = allAffectedAreas[i];
				found = false;
				for (j = 0; j < lastAffectedAreas.length; j++) {
					var oneLASTArea = lastAffectedAreas[j];
					if(oneLASTArea === oneALLArea){
						found = true;
						break;
					}
				}
				if(!found){
					oneALLArea.execInCallback(e,{"drag":this.activeDragArea,"drop":oneALLArea})
					this.activeDragArea.execInCallback(e,{"drag":this.activeDragArea,"drop":oneALLArea});
				}
				oneALLArea.execMoveCallback(e,{"drag":this.activeDragArea,"drop":oneALLArea});
				this.activeDragArea.execMoveCallback(e,{"drag":this.activeDragArea,"drop":oneALLArea});
			}
			for (i = 0; i < lastAffectedAreas.length; i++) {
				var oneLastArea = lastAffectedAreas[i];
				found = false;
				for (j = 0; j < allAffectedAreas.length; j++) {
					var oneAllArea = allAffectedAreas[j];
					if(oneLastArea === oneAllArea){
						found = true;
						break;
					}
				}
				if(!found){
					oneLastArea.execOutCallback(e,{"drag":this.activeDragArea,"drop":oneLastArea});
					this.activeDragArea.execOutCallback(e,{"drag":this.activeDragArea,"drop":oneLastArea});
				}
			}
			
			lastAffectedAreas = allAffectedAreas;
			
		};
		
		
		
		this.getDropAreas = function(){
			return this.dropAreas;
		}
		
		this.registerDropArea = function(oDropArea){
			if(this.dropAreas.indexOf(oDropArea) === -1){
				this.dropAreas.push(oDropArea);
			}
		}
		
		this.unregisterDropArea = function(oDropArea){
			var index = this.dropAreas.indexOf(oDropArea);
			if (index > -1) {
				this.dropAreas.splice(index, 1);
			}
		};
		
		this.zIndexObjects = null;
		
		this.calculateZIndex = function(){
			if(this.zIndexObjects === null){
				this.zIndexObjects = $("body").find("*");
			}
		}
		
		this.getAllAffectedDropAreas = function(){
			this.calculateZIndex();
			var result = [];
			if(this.activeDragArea === null){
				return result;
			}
			var index = -1;
			var tempResult = null;
			for (var i = 0; i < this.dropAreas.length; i++) {
				var oneArea = this.dropAreas[i];
				var objIndex = oneArea.getIndex(this.zIndexObjects);
				if(oneArea.isPointWithinDropInfoRegion(this.activeDragArea.getMousePosX(),this.activeDragArea.getMousePosY()) && objIndex > index){
					tempResult = oneArea;
					index = objIndex;
				}
			}
			if(tempResult === null){
				return result;
			}
			result.push(tempResult);
			return result;
		};
		
		this.executeDrop = function(e){
			var allAffectedAreas = this.getAllAffectedDropAreas();
			var oneALLArea;
			for (var i = 0; i < allAffectedAreas.length; i++) {
				oneALLArea = allAffectedAreas[i];
				oneALLArea.execDropCallback(e,{"drag":this.activeDragArea,"drop":oneALLArea})
			}
			this.activeDragArea.execDropCallback(e,{"drag":this.activeDragArea,"drop":oneALLArea});
			this.cleanup();
		};
		
		this.abort = function(){
			var allAffectedAreas = this.getAllAffectedDropAreas();
			for (var i = 0; i < allAffectedAreas.length; i++) {
				var oneALLArea = allAffectedAreas[i];
				oneALLArea.execOutCallback(this.activeDragArea)
			}
			this.activeDragArea.execOutCallback(oneALLArea);
			this.cleanup();
		};
		
		this.cleanup = function(){
			that.zIndexObjects = null;
			lastAffectedAreas = [];
		};
		
		
	
		
	}
	
	this.dragHandlerInstance = new this.dragHandler();
	
	this.dragAreaBase = function(jqOrPhxObjGiven, sTypeGiven, fMoveGiven, fOutGiven, fInGiven, fDropGiven){
		this.jqObj = jqOrPhxObjGiven;
		this.sType = sTypeGiven;
		this.fMove = fMoveGiven;
		this.fOut = fOutGiven;
		this.fIn = fInGiven;
		this.fDrop = fDropGiven;
		
		this.phxObj = null;

		this.init = function(){
			if(this.jqObj instanceof sap.ui.core.Element){
				this.phxObj = jqOrPhxObjGiven;
			}else{
				this.jqObj = jqOrPhxObjGiven;
			}
		};
		
		this.getJQObject = function(){
			if(this.phxObj){
				return this.phxObj.$();
			}
			return this.jqObj;
		};
		
		this.getPhxObject = function(){
			return this.phxObj;
		};
		
		this.getType = function(){
			return this.sType;
		};
		
		this.execMoveCallback = function(e,oDragOrDropInfo){
			if(this.fMove){
			this.fMove(e,oDragOrDropInfo);
			}
		};
		
		this.execOutCallback = function(e,oDragOrDropInfo){
			if(this.fOut){
			this.fOut(oDragOrDropInfo);
			}
		};
		
		this.execInCallback = function(e,oDragOrDropInfo){
			if(this.fIn){
				this.fIn(oDragOrDropInfo);
			}
		};
		
		this.execDropCallback = function(e,oDragOrDropInfo){
			if(this.fDrop){
			this.fDrop(e,oDragOrDropInfo);
			}
		};
		
		this.isDragArea = function(){
			return false;
		};
		
		this.isDropArea = function(){
			return false;
		};
	};
	
	this.dragArea = function(jqOrPhxObjGiven, sTypeGiven, oPayloadGiven, fCreateGiven, fDownGiven, fMoveGiven, fOutGiven, fInGiven, fDropGiven){
		sap.zen.Dispatcher.instance.dragAreaBase.apply(this,[jqOrPhxObjGiven, sTypeGiven, fMoveGiven, fOutGiven, fInGiven, fDropGiven]);
		this.fDown = fDownGiven;
		this.fCreate = fCreateGiven;
		
		this.oPayload = oPayloadGiven;
		
		this.jqDragClone = null;
		
		this.dragging = false;
		
		var that = this;
		var mouseMoveInternalDrag = function(e){
			that.mouseMove(e);
		};
		
		var mouseUpInternalDrag = function(e){
			that.mouseUp(e);
		};
		
		var abortInternalDrag = function(){
			that.abort();
		};
		
		this.isDragArea = function(){
			return true;
		};
		
		this.getPayload = function(){
			return this.oPayload;
		}
		
		this.iXStart = null;
		this.iYStart = null;
		
		this.lastMousePosX = null;
		this.lastMousePosY = null;
		
		this.getMousePosX = function(){
			return this.lastMousePosX;
		};
		
		this.getMousePosY = function(){
			return this.lastMousePosY;
		};
		
		
		this.getDragCloneX = function(){
			return this.iXStart;
		};
		
		this.getDragCloneY = function(){
			return this.iYStart;
		};
		
		var mouseCallback = function(e){
			var shouldDrag = that.execDownCallback(e,this);
			if(shouldDrag === undefined || shouldDrag === true){
				sap.zen.Dispatcher.instance.dragHandlerInstance.registerActiveDragArea(that);
				
				that.lastMousePosX = e.pageX;
				that.lastMousePosY = e.pageY;
				
				//This must be done here, as the IE does not honor it if it is done in the move instead 
				$(document.body).addClass("zenSplitUserSel");
				
				$(document).bind("mousemove",mouseMoveInternalDrag);
				$(document).bind("mouseup",mouseUpInternalDrag);
				$(document).bind("keydown",abortInternalDrag);
			}
			
		};
		
		var super_init = this.init;
		this.init = function(){
			super_init.apply(this, arguments);
			var obj = this.getPhxObject();
			if(!obj){
				obj = this.getJQObject();
				obj.bind("mousedown",mouseCallback);
			}else{
				obj.attachBrowserEvent("mousedown",mouseCallback);
			}
		};
		var setInitialPosition = function(e){
			//set initial x and y === null because if callback options
			if(that.iXStart === null){
				that.iXStart = that.getJQObject().offset().left;
				}
				if(that.iYStart === null){
					that.iYStart = that.getJQObject().offset().top;
				}
				if(that.lastMousePosX === null){
					that.lastMousePosX = e.pageX;
				}
				if(that.lastMousePosY === null){
					that.lastMousePosY = e.pageY;
				}
		};
		
		var updatePositionInternal = function(e){
			var deltaX =  e.pageX - that.lastMousePosX;
			var deltaY =  e.pageY - that.lastMousePosY;
			
			that.lastMousePosX = e.pageX;
			that.lastMousePosY = e.pageY;
			
			that.iXStart = that.iXStart + deltaX;
			that.iYStart = that.iYStart + deltaY;
			
			if(that.getDragClone()){
				that.getDragClone().css("left",that.getDragCloneX()+"px");
				that.getDragClone().css("top",that.getDragCloneY()+"px");
			}
		};
		this.updatePositions = function(e){
				setInitialPosition(e);
				updatePositionInternal(e);
		};
		
		this.mouseMove = function(e){
			if(this.isDragging() === false){
				this.setDragClone(that.createDragObject(e));
				this.setDragging(true);
			}
			this.updatePositions(e);
			sap.zen.Dispatcher.instance.dragHandlerInstance.notifyAffectedDropAreas(e);
			this.execMoveCallback(e,this);
		};
		
		this.mouseUp = function(e){
			this.updatePositions(e);
			sap.zen.Dispatcher.instance.dragHandlerInstance.executeDrop(e);
			this.cleanup();
		};
		
		this.abort = function(){
			sap.zen.Dispatcher.instance.dragHandlerInstance.abort();
			this.cleanup();
		};
		
		this.cleanup = function(){
			$(document).unbind("mousemove", mouseMoveInternalDrag);
			$(document).unbind("mouseup", mouseUpInternalDrag);
			$(document).unbind("keydown", abortInternalDrag);
			
			sap.zen.Dispatcher.instance.dragHandlerInstance.unregisterActiveDragArea(this);
			
			this.setDragging(false);
			
			this.iXStart = null;
			this.iYStart = null;
			
			this.lastMousePosX = null;
			this.lastMousePosY = null;
			
			$(document.body).removeClass("zenSplitUserSel");
			
			if(this.getDragClone()){
				this.getDragClone().remove();
			}
		};
		
		this.getDragClone = function(){
			return this.jqDragClone;
		};
		
		this.setDragClone = function(jqDragCloneGiven){
			this.jqDragClone = jqDragCloneGiven;
		};
		
		
		this.createDragObject = function(e){
			if(this.fCreate){
				return this.fCreate(e, this);
			}else{
				var result = this.getJQObject().clone();
				result.css("position","absolute");
				result.css("top",this.getJQObject().offset().top+"px");
				result.css("left",this.getJQObject().offset().left+"px");
				result.css("width",this.getJQObject().outerWidth()+"px");
				result.css("height",this.getJQObject().outerHeight()+"px");
				result.addClass("zenDragClone");
				result.appendTo($(document.body));
				return result;
			}
		};
		
		this.setDragging = function(bDragging){
			this.dragging = bDragging;
		};
		this.isDragging = function(){
			return this.dragging;
		};
		
		this.execDownCallback = function(e,oDragOrDropInfo){
			if(this.fDown){
				return this.fDown(e,oDragOrDropInfo);
			}
		};
		
		this.init();
	};
	
	this.dropArea = function(jqOrPhxObjGiven, sTypeGiven ,fMoveGiven, fOutGiven, fInGiven, fDropGiven, iXGiven, iYGiven, iWidthGiven, iHeightGiven){
		sap.zen.Dispatcher.instance.dragAreaBase.apply(this,arguments);
		this.iWidth = iWidthGiven;
		this.iHeight = iHeightGiven;
		
		this.iX = iXGiven;
		this.iY = iYGiven;
		
		this.getX = function(){
			if((this.iX === null || this.iX === undefined)){
				var jqObject = this.getJQObject();
				//As a drag and drop may be performed while UI5 is re-rendering, the jq object may not be there...
				if(jqObject === null || jqObject === undefined || (jqObject.length !== null && jqObject.length !== undefined && jqObject.length === 0)){
					return null;
				}
				return jqObject.offset().left;
			}
			return this.iX;
		};
		
		this.getY = function(){
			if((this.iY === null || this.iY === undefined)){
				var jqObject = this.getJQObject();
				//As a drag and drop may be performed while UI5 is re-rendering, the jq object may not be there...
				if(jqObject === null || jqObject === undefined || (jqObject.length !== null && jqObject.length !== undefined && jqObject.length === 0)){
					return null;
				}
				return jqObject.offset().top;
			}
			return this.iY;
		};
		
		this.getWidth = function(){
			if(this.iWidth === null || this.iWidth === undefined){
				var jqObject = this.getJQObject();
				//As a drag and drop may be performed while UI5 is re-rendering, the jq object may not be there...
				if(jqObject === null || jqObject === undefined || (jqObject.length !== null && jqObject.length !== undefined && jqObject.length === 0)){
					return null;
				}
				return jqObject.outerWidth();
			}
			return this.iWidth;
		};
		
		this.getHeight = function(){
			if(this.iHeight === null || this.iHeight === undefined){
				var jqObject = this.getJQObject();
				//As a drag and drop may be performed while UI5 is re-rendering, the jq object may not be there...
				if(jqObject === null || jqObject === undefined || (jqObject.length !== null && jqObject.length !== undefined && jqObject.length === 0)){
					return null;
				}
				return jqObject.outerHeight();
			}
			return this.iHeight;
		};
		
		this.isDropArea = function(){
			return true;
		};
		
		this.getXPlusWidth = function(){
			//X and Width might be null
			var myX = this.getX();
			if(myX === null){
				return null;
			}
			var myWidth = this.getWidth();
			if(myWidth === null){
				return null;
			}
			return (myX + myWidth);
		};
		
		this.getYPlusHeight = function(){
			//Y and Height might be null
			var myY = this.getY();
			if(myY === null){
				return null;
			}
			var myHeight = this.getHeight();
			if(myHeight === null){
				return null;
			}
			return (myY + myHeight);
		};
		
		this.getIndex = function(aJQObjects){
			return aJQObjects.index(this.getJQObject());
			
		};
		
		this.isPointWithinDropInfoRegion = function(iXGiven, iYGiven){
			var iX = iXGiven;
			var iY = iYGiven;
			var x1 = this.getX();
			var y1 = this.getY();
			var x2 = this.getXPlusWidth();
			var y2 = this.getYPlusHeight();
			//Something might be null
			if(x1 === null || y1 === null || x2 === null || y2 === null){
				return false;
			}
			if (x1 <= iX && iX < x2 && y1 <= iY && iY < y2) {
				return true;
			}
			return false;
		};
		
		this.init();
		
		
		
	};
	
	
	this.aDebugJsonLogger = [];

	this.aDebugJsonReplay = [];

	this.loggerDiv = null;
	this.numberDiv = null;
	this.jsonArea = null;
	this.replayDiv = null;
	this.replayJsonEnder = "<ENDOFJSON>";
	this.replayDivId = null;
	this.replayIndex = 0;

	this.getStringifiedJson = function(jsonGiven) {
		return JSON.stringify(jsonGiven, null, "    ");
	};

	this.convertStringToArray = function(sJsons) {
		if (!sJsons) {
			return [];
		}

		var aJsonStrings = sJsons.split(this.replayJsonEnder);
		var result = [];
		for (var i = 0; i < aJsonStrings.length; i++) {
			if (aJsonStrings[i].length > 0) {
				result.push(JSON.parse(aJsonStrings[i]));
			}
		}

		return result;
	};

	this.logJson = function(jsonGiven, urlParameterWasGiven, divid) {
		if (!this.replayDiv || this.replayDiv.css("display") === "none") {
			this.aDebugJsonLogger.push(jsonGiven);
		}
		this.replayDivId = divid;
		var that = this;
		var loggerDivWidth = "100%";
		if (this.loggerDiv === null) {
			this.loggerDiv = $("<div id='sapZenDebugJsonLogger'/>");
			if (urlParameterWasGiven) {
				this.loggerDiv.height("15px");
				this.loggerDiv.width("10px");
			} else {
				this.loggerDiv.width(loggerDivWidth);
				this.loggerDiv.height("100%");
			}
			this.loggerDiv.css("left", "0");
			this.loggerDiv.css("top", "0");
			this.loggerDiv.css("position", "absolute");
			this.loggerDiv.css("background-color", "red");
			this.loggerDiv.css("overflow", "hidden");

			if (!urlParameterWasGiven) {
				this.loggerDiv.css("display", "none");
			}
			this.numberDiv = $("<span id='sapZenDebugJsonLoggerNumber'/>");
			this.numberDiv.css("background-color", "white");
			this.numberDiv.html(this.aDebugJsonLogger.length - 1);

			this.jsonArea = $("<textarea id='sapZenDebugJsonLoggerArea' />");
			this.jsonArea.width("100%");

			this.jsonArea.css("height", "-webkit-calc(100% - 50px)");
			this.jsonArea.css("height", "calc(100% - 50px)");
			this.jsonArea.css("height", "-moz-calc(100% - 50px)");
			this.jsonArea.css("font-family", "Courier New, monospace");
			this.jsonArea.css("overflow", "auto");
			this.jsonArea.css("-webkit-overflow-scrolling", "touch");

			this.jsonArea.bind("touchmove", function(e) {
				e.stopPropagation();
			});

			this.jsonArea.val(this.getStringifiedJson(this.aDebugJsonLogger[this.aDebugJsonLogger.length - 1]));

			this.numberDiv.bind("click", function() {
				if (that.loggerDiv.width() === 10) {
					that.loggerDiv.width(loggerDivWidth);
					that.loggerDiv.height("100%");
				} else {
					that.loggerDiv.width("10px");
					that.loggerDiv.height("15px");
				}
			});

			var btnBackward = $("<button id='sapZenDebugJsonLoggerBtnBackward' height='20px'/>");
			btnBackward.html("<");
			btnBackward.bind("click", function() {
				var newNumber = parseInt(that.numberDiv.html()) - 1;
				if (newNumber >= 0) {
					that.numberDiv.html(newNumber);
					that.jsonArea.val(that.getStringifiedJson(that.aDebugJsonLogger[newNumber]));
				}

			});
			var btnForward = $("<button id='sapZenDebugJsonLoggerBtnForward' height='20px'/>");
			btnForward.html(">");
			btnForward.bind("click", function() {
				var newNumber = parseInt(that.numberDiv.html()) + 1;
				if (newNumber < that.aDebugJsonLogger.length) {
					that.numberDiv.html(newNumber);
					that.jsonArea.val(that.getStringifiedJson(that.aDebugJsonLogger[newNumber]));
				}

			});

			var btnSummary = $("<button id='sapZenDebugJsonLoggerBtnSummary' height='20px'/>");
			btnSummary.html("Summary");
			btnSummary.bind("click", function() {
				var result = "";
				for (var i = 0; i <= that.aDebugJsonLogger.length - 1; i++) {
					result += "JSON: Z" + i + "\r\n\r\n\r\n";
					result += that.getStringifiedJson(that.aDebugJsonLogger[i]);
					result += "\r\n\r\n\r\n";
				}
				that.jsonArea.val(result);

			});

			var btnReplay = $("<button id='sapZenDebugJsonLoggerBtnReplay' height='20px'/>");
			btnReplay.html("Replay");
			btnReplay.bind("click", function() {
				var result = "";
				for (var i = 0; i <= that.aDebugJsonLogger.length - 1; i++) {
					result += JSON.stringify(that.aDebugJsonLogger[i]);
					result += that.replayJsonEnder;
				}
				that.jsonArea.val(result);

			});

			this.numberDiv.appendTo(this.loggerDiv);
			this.jsonArea.appendTo(this.loggerDiv);

			btnBackward.appendTo(this.loggerDiv);
			btnForward.appendTo(this.loggerDiv);
			btnSummary.appendTo(this.loggerDiv);
			btnReplay.appendTo(this.loggerDiv);

			this.loggerDiv.appendTo($(document.body));

			// REPLAY
			this.replayDiv = $("<div id='sapZenDebugJsonLoggerReplayDiv'/>");
			this.replayDiv.css("right", "0");
			this.replayDiv.css("bottom", "4px");
			this.replayDiv.css("position", "absolute");
			this.replayDiv.css("background-color", "red");
			this.replayDiv.css("display", "none");
			this.replayDiv.width("56px");
			this.replayDiv.height("25px");
			this.replayDiv.appendTo($(document.body));
			var btnReplayBck = $("<button id='sapZenDebugJsonLoggerBtnReplayBck'/>");
			btnReplayBck.html("<");

			btnReplayBck.bind("click", function() {
				if (that.replayIndex > 0) {
					that.replayIndex--;
					sapbi_phx(that.replayDivId, {
						"delta": [ that.aDebugJsonReplay[0] ]
					});
					for (var i = 1; i <= that.replayIndex; i++) {
						sapbi_phx(that.replayDivId, that.aDebugJsonReplay[i]);
					}
				}
			});

			var btnReplayFwd = $("<button id='sapZenDebugJsonLoggerBtnReplayFwd'/>");
			btnReplayFwd.html(">");

			btnReplayFwd.bind("click", function() {
				if (that.replayIndex < that.aDebugJsonReplay.length - 1) {
					that.replayIndex++;
					sapbi_phx(that.replayDivId, that.aDebugJsonReplay[that.replayIndex]);
				}
			});

			btnReplayBck.appendTo(this.replayDiv);
			btnReplayFwd.appendTo(this.replayDiv);

			var myFunction = function(e) {
				//'D' - Display JSONs
				if (e.ctrlKey && e.altKey && e.which === 68) {
					if (that.loggerDiv.css("display") !== "none") {
						that.loggerDiv.css("display", "none");
					} else {
						that.loggerDiv.css("display", "inline");
					}
				}
				//'P' - Playback JSONs
				if (e.ctrlKey && e.altKey && e.which === 80) {
					if (that.replayDiv.css("display") !== "none") {
						that.replayDiv.css("display", "none");
					} else {
						that.replayDiv.css("display", "inline");
						that.aDebugJsonReplay = that.convertStringToArray(prompt("Copy JSON", ""));
						that.aDebugJsonLogger = that.aDebugJsonReplay;
						that.numberDiv.html(0);
						that.jsonArea.val(that.getStringifiedJson(that.aDebugJsonLogger[0]));
						sapbi_phx(that.replayDivId, {
							"delta": [ that.aDebugJsonReplay[0] ]
						});
					}
				}
			};
			$(document).bind("keydown", myFunction);

		} else {

			if (parseInt(this.numberDiv.html()) === this.aDebugJsonLogger.length - 2
					|| (this.replayDiv && this.replayDiv.css("display") !== "none")) {
				var newNumber = this.aDebugJsonLogger.length - 1;
				this.numberDiv.html(newNumber);
				this.jsonArea.val(this.getStringifiedJson(this.aDebugJsonLogger[newNumber]));
			}
		}
	};

	var componentIdRootMap = {};
	function buildRootMap(componentData) {
		if (componentData.content.control) {
			var children = componentData.content.control.content;
			if (children) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i];
					componentIdRootMap[child.component.id] = componentData.id;
					buildRootMap(child.component);
				}
			}
		}
	}

	function getComponentName(sName) {
		var rootNode = componentIdRootMap[sName];
		if (rootNode) {
			return getComponentName(rootNode) + "/" + sName;
		}
		return sName;
	}

	var dummyTableControlIdCounter = 0;
	this.dispatchCreateControl = function(componentData, fAppendToParentFunclet, oArgForFunclet) {

		var dshPrefix = "";
		if(this.dshPrefix){
			dshPrefix = this.dshPrefix;
		}
		
		if(componentData.id === dshPrefix+"ROOT" || componentData.id  === dshPrefix+"ROOT_DIALOG") {
			this.resetDispatcher(componentData.id);
		}
		
		if (sapbi_page.m_profileMode && jQuery.sap.measure.getActive()) {
			if (componentData.id === dshPrefix+"ROOT") {
				componentIdRootMap = {};
			}
			if (!componentIdRootMap[componentData.id]) {
				buildRootMap(componentData);
			}
			jQuery.sap.measure.start("zen create " + componentData.id, "dispatch/create/"
					+ getComponentName(componentData.id) + ":" + componentData.type);
		}

		if (!fAppendToParentFunclet) {
			fAppendToParentFunclet = function() {
				// Dummy
			};

		}

		var controlData;
		if (componentData.content) {
			// normal case in ZEN, component is used
			controlData = componentData.content.control;

			// special case for crosstab dummy data
			if (!controlData) {
				if (componentData.type === "CROSSTAB_COMPONENT") {
					componentData.content.control = dummyTable;
					componentData.content.control.id = componentData.content.control.id
							+ (dummyTableControlIdCounter++);
					controlData = componentData.content.control;
				} else {
					throw "Missing control in component JSON";
				}
			}
		}

		var phxObj = createControl(controlData, componentData, fAppendToParentFunclet, oArgForFunclet);

		if (phxObj) {
			this.setComponentIdForControl(componentData.id, phxObj);

			phxObj.zenControlType = controlData && controlData.type.toLowerCase();
		}
		if (sapbi_page.m_profileMode && jQuery.sap.measure.getActive()) {
			jQuery.sap.measure.end("zen create " + componentData.id);
		}
		this.doAfterDispatchingWork();

		return phxObj;
	};

	this.doAfterDispatchingWork = function() {
		var that = this;
		if (window.eclipse_needsReadyEvents) {
			if (window.eclipse_sendZenUrl) {
				this.sendZenUrlReady();
			} else {
				setTimeout(function() {
					that.sendZenUrlReady();
				}, 100);
			}
		}
	};

	this.bIsReadyEventEnabled = true;

	this.enableReady = function(bEnabled) {
		this.bIsReadyEventEnabled = bEnabled;
	};

	this.sendZenUrlReady = function() {
		if (window.eclipse_sendZenUrl && this.bIsReadyEventEnabled) {
			eclipse_sendZenUrl("zen://ready"); // call browser function injected by Eclipse code
		}
	};

	this.dispatchCreateNestedControl = function(controlData, fAppendToParentFunclet, oArgForFunclet) {
		var phxObj = null;
		var handler = that.getHandlers(controlData.type.toLowerCase())[0];
		if (handler) {
			phxObj = handler.createAndAdd(phxObj, controlData, null, fAppendToParentFunclet, oArgForFunclet);
		}

		if (phxObj && handler.styleClasses[phxObj.getId()]) {
			phxObj.removeStyleClass(handler.styleClasses[phxObj.getId()]);
		}
		if (phxObj && !controlData["cssclass"]) {
			var cssClass = controlData["cssclass"];
			if (cssClass) {
				phxObj.addStyleClass(cssClass);
			}
			handler.styleClasses[phxObj.getId()] = cssClass;
		}
		return phxObj;
	};

	function createControl(controlData, componentData, fAppendToParentFunclet, oArgForFunclet) {
		var phxObj = null;
		var handlers = that.getHandlers(controlData.type.toLowerCase());
		for ( var iIndex in handlers) {
			if (handlers.hasOwnProperty(iIndex)) {
				var handler = handlers[iIndex];
				phxObj = handler.createAndAdd(phxObj, controlData, componentData, fAppendToParentFunclet,
						oArgForFunclet);
				//TODO: CHECK ME!!
				if(phxObj.addStyleClass){
					phxObj.addStyleClass("zenControl");
				}
				if (!(typeof componentData["cssclass"] == "undefined" || !handler.styleClasses)) {
					if (handler.styleClasses[phxObj.getId()]) {
						phxObj.removeStyleClass(handler.styleClasses[phxObj.getId()]);
					}
					var cssClass = componentData["cssclass"];
					if (cssClass) {
						phxObj.addStyleClass(cssClass);
					}
					handler.styleClasses[phxObj.getId()] = cssClass;
				}
			}
		}
		return phxObj;
	}

	this.dispatchUpdateControl = function(componentData, fInsertIntoParentFunclet) {
		if (sapbi_page.m_profileMode && jQuery.sap.measure.getActive()) {
			jQuery.sap.measure.start("zen update " + componentData.id, "dispatch/update/"
					+ getComponentName(componentData.id) + ":" + componentData.type);
		}
		if (componentData.content && !componentData.content.control && componentData.type === "CROSSTAB_COMPONENT") {
			componentData.content.control = dummyTable;
			componentData.content.control.id = componentData.content.control.id
					+ (dummyTableControlIdCounter++);
		}

		var oRootControl = this.getRootControlForComponentId(componentData.id);
		if (!oRootControl) {
			return;
		}
		var controlType = oRootControl.zenControlType;

		var controlData;
		if (componentData.content) {
			// normal case - zen component dispatch
			var content = componentData.content;
			controlData = content && content.control;
		}

		var handlers = this.getHandlers(controlType);

		for (var iIndex in handlers) {
			if (handlers.hasOwnProperty(iIndex)) {
				var handler = handlers[iIndex];
				if (!(typeof componentData["cssclass"] === "undefined" || !handler.styleClasses)) {
					if (handler.styleClasses[oRootControl.getId()]) {
						oRootControl.removeStyleClass(handler.styleClasses[oRootControl.getId()]);
					}
					var cssClass = componentData["cssclass"];
					if (cssClass) {
						oRootControl.addStyleClass(cssClass);
					}
					handler.styleClasses[oRootControl.getId()] = cssClass;
				}
				handler.updateComponent(oRootControl, controlData, componentData, fInsertIntoParentFunclet);

			}
		}
		if (sapbi_page.m_profileMode && jQuery.sap.measure.getActive()) {
			jQuery.sap.measure.end("zen update " + componentData.id);
		}
	};

	this.updateComponentProperties = function(oControl, oComponentProperties) {
		if (oComponentProperties && oControl && this.isApplicationRoot(oControl)) {
			if (oComponentProperties.width !== "auto" && oComponentProperties.height !== "auto") {
				var args = this.createAbsoluteLayoutInfo(oComponentProperties);
				oControl.zenOldLayoutArgs = args;
				oControl.$().css(args);
				var width = this.calcWidthUseOrderOfPriority(args.left, args.right, oComponentProperties.width);
				var height = this.calcHeightUseOrderOfPriority(args.top, args.bottom, oComponentProperties.height);

				this.setWidthHeight(oControl, width, height);
			}

			return;
		}

		this.updateComponentPropertiesBase(oControl, oComponentProperties);
	};

	this.suppressRendering = function() {
		return suppressRenderingFlag;
	};
	var mapRegistersForRendering = {};

	this.registerForDeferredRendering = function(phxObj) {
		mapRegistersForRendering[phxObj.getId()] = phxObj;
	};

	this.isDeferredRendering = function() {
		return bIsDeferredRendering;
	};

	this.renderDeferredObjects = function() {
		bIsDeferredRendering = true;

		var bInvalidatedObjects = false;
		for ( var oneCallback in mapRegistersForRendering) {
			if (mapRegistersForRendering.hasOwnProperty(oneCallback)) {
				bInvalidatedObjects = true;
				var oPhxCtrl = mapRegistersForRendering[oneCallback];
				oPhxCtrl.invalidate();
			}
		}
		if (bInvalidatedObjects) {
			sap.ui.getCore().applyChanges();
		}
		mapRegistersForRendering = {};
		bIsDeferredRendering = false;
	};

	this.isSingleDelta = function(sId) {
		if (lastDeltaSent.length !== 1) {
			return false;
		}
		if (!lastDeltaSent[0].component) {
			return false;
		}

		// If we have a container component (NYI)
		if (lastDeltaSent[0].component.content && lastDeltaSent[0].component.content.control && lastDeltaSent[0].component.content.control.content) {
			return false;
		}

		if (lastDeltaSent[0].component.id === sId) {
			return true;
		}
		return false;
	};

	this.addMessageOverlay = function(oControl, sText, bShowLoadingIcon, bTryAgain) {
		if (oControl.zenMessageControl) {
			this.removeMessageOverlay(oControl);
		}
		if (oControl.showLoadingState) {
			var jqPositioningLayout = oControl.getParent().$();
			var zenMessageControl = $('<div/>');
			var bSizeIsNotShown = false;
			zenMessageControl.attr("id", oControl.getId() + "_loadingState");
			zenMessageControl.addClass("componentLoadingState");
			if (jQuery.support.opacity) {
				zenMessageControl.addClass("zenLoadingStateOpacity");
			} else {
				zenMessageControl.addClass("zenLoadingStateFilter");
			}
			jqPositioningLayout.append(zenMessageControl);
			oControl.zenMessageControl = zenMessageControl;
			var classesToAdd = "";
			if (jqPositioningLayout.width() <= 200 || jqPositioningLayout.height() <= 90) {
				classesToAdd = " hideLoadingStateClass";
				bSizeIsNotShown = true;
			}
			var classesToAddToIcon = "";
			if (jqPositioningLayout.width() <= 68 || jqPositioningLayout.height() <= 14) {
				classesToAddToIcon = " hideLoadingStateClassIcon";
				bSizeIsNotShown = true;
			}
			var jqZenMessageControlBox = $('<div/>');
			jqZenMessageControlBox.attr("id", oControl.getId() + "_loadingStateBox");
			jqZenMessageControlBox.addClass("componentLoadingStateBox" + classesToAdd);

			if (jQuery.support.opacity) {
				jqZenMessageControlBox.addClass("zenLoadingStateOpacity75");
			} else {
				jqZenMessageControlBox.addClass("zenLoadingStateFilter75");
			}

			jqPositioningLayout.append(jqZenMessageControlBox);
			oControl.zenMessageControlBox = jqZenMessageControlBox;

			if (sText !== "") {
				var jqMessage = $("<div/>");
				jqMessage.attr("id", oControl.getId() + "_loadingState_message");
				jqMessage.addClass("componentLoadingStateMessage" + classesToAdd);
				jqMessage.addClass("componentLoadingStateMessageDT");
				if (bShowLoadingIcon) {
					jqMessage.addClass("componentLoadingStateMessageWithIcon");
				}
				jqMessage.attr("title", sText);
				jqMessage.html(sText);
				jqPositioningLayout.append(jqMessage);
				oControl.zenMessageText = jqMessage;
			} else {
				jqZenMessageControlBox.addClass("componentLoadingStateBoxNoText");
			}
			if (bShowLoadingIcon) {
				var jqLoadingIcon = $("<div/>");
				jqLoadingIcon.attr("id", oControl.getId() + "_loadingState_icon");
				jqLoadingIcon.addClass("componentLoadingStateIconBackground" + classesToAddToIcon);
				jqLoadingIcon.addClass("componentLoadingStateIcon");
				jqPositioningLayout.append(jqLoadingIcon);
				oControl.zenMessageIcon = jqLoadingIcon;
			} else {
				jqZenMessageControlBox.addClass("componentLoadingStateBoxNoIcon");
			}

			if (bTryAgain && bSizeIsNotShown) {
				var oControlToTake = oControl;
				var oControlTakenBefore = oControl;
				while (oControlToTake && /ROOT_absolutelayout$/.exec(oControlToTake.sId) === null) {
					var jqControlToTake = oControlToTake.$();
					if (jqControlToTake) {
						if (jqControlToTake.width() > 200 && jqControlToTake.height() > 90
								&& oControlTakenBefore instanceof sap.ui.core.Control) {
							sap.zen.Dispatcher.instance.putOnMessageStack(oControlTakenBefore, oControl,
									function() {
										sap.zen.Dispatcher.instance.addMessageOverlay(oControl, sText,
												bShowLoadingIcon, false);
									});
							oControlTakenBefore.onAfterRendering = function() {
								sap.zen.Dispatcher.instance.execMessageStack(this);
							};
							break;

						}
					}
					oControlTakenBefore = oControlToTake;
					oControlToTake = oControlToTake.getParent();
				}
			}
		}
	};

	this.aMessageStack = [];
	this.putOnMessageStack = function(oControlTakenBefore, oControl, fAddMessageOverlay) {
		if (this.aMessageStack[oControlTakenBefore.sId]) {
			this.aMessageStack[oControlTakenBefore.sId].elements[oControl.sId] = fAddMessageOverlay;
		} else {
			var fOldOnAfterRendering = oControlTakenBefore.onAfterRendering;
			var aElements = [];
			aElements[oControl.sId] = fAddMessageOverlay;
			this.aMessageStack[oControlTakenBefore.sId] = {
				oldOnAfterRendering: fOldOnAfterRendering,
				elements: aElements,
				exec: function(oParentControl) {
					if (this.oldOnAfterRendering) {
						this.oldOnAfterRendering.apply(oParentControl, arguments);
					}
					for ( var element in this.elements) {
						if (this.elements.hasOwnProperty(element)) {
							this.elements[element]();
						}
					}
					oParentControl.onAfterRendering = this.oldOnAfterRendering;
				}
			};
		}
	};

	this.execMessageStack = function(oControl) {
		var oStackItem = this.aMessageStack[oControl.sId];
		if (oStackItem) {
			oStackItem.exec(oControl);
			delete this.aMessageStack[oControl.sId];
		}
	};

	this.deleteMessageStack = function() {
		for ( var element in this.aMessageStack) {
			if (this.aMessageStack.hasOwnProperty(element)) {
				var phxElement = sap.ui.getCore().byId(element);
				if (phxElement) {
					phxElement.onAfterRendering = this.aMessageStack[element].oldOnAfterRendering;
				}
			}
		}
		this.aMessageStack = [];
	};

	this.removeMessageOverlay = function(oControl) {
		oControl.zenMessageControl.remove();
		if (oControl.zenMessageControlBox) {
			oControl.zenMessageControlBox.remove();
		}
		if (oControl.zenMessageText) {
			oControl.zenMessageText.remove();
		}
		if (oControl.zenMessageIcon) {
			oControl.zenMessageIcon.remove();
		}
	};

	this.updateComponentPropertiesBase = function(oControl, oComponentProperties) {
		if (!oComponentProperties || !oControl || this.isApplicationRoot(oControl)) {
			return;
		}

		var lNewArgs = this.createAbsoluteLayoutInfo(oComponentProperties);
		var lNewWidth = this.calcWidthUseOrderOfPriority(lNewArgs.left, lNewArgs.right, oComponentProperties.width);
		var lNewHeight = this.calcHeightUseOrderOfPriority(lNewArgs.top, lNewArgs.bottom, oComponentProperties.height);

		var lOldArgs = this.getAbsoluteLayoutInfo(oControl);
		var lOldWidth = oControl.$().width();
		var lOldHeight = oControl.$().height();
		
		this.setWidthHeight(oControl, lNewWidth, lNewHeight);
		this.setAbsoluteLayoutInfo(oControl, lNewArgs);
		
		this.registerControlForResizeNotificationIfNecessary(oControl, lOldArgs, lNewArgs, lOldWidth, lNewWidth, lOldHeight, lNewHeight);

		if (oComponentProperties.message || oComponentProperties.showLoadingState !== undefined) {
			if (!oComponentProperties.showLoadingState && oComponentProperties.message === undefined) {
				if (oControl.zenMessageControl) {
					oControl.showLoadingState = false;
					this.removeMessageOverlay(oControl);
					oControl.onAfterRendering = oControl.oldAfterRenderingForDispatching || oControl.onAfterRendering;
					delete oControl.oldAfterRenderingForDispatching;
					delete oControl.showLoadingState;
					delete oControl.showLoadingStateText;
					delete oControl.showLoadingStateIcon;
					delete oControl.zenMessageControl;
				}
			} else {
				var bNewLoadingState = oComponentProperties.showLoadingState
						|| oComponentProperties.message !== undefined;
				var sNewLoadingStateText = "";
				var bShowLoadingStateIcon = true;
				if (oComponentProperties.showLoadingStateText) {
					sNewLoadingStateText = oComponentProperties.showLoadingStateText;
				} else if (oComponentProperties.message && oComponentProperties.message._v && sap.zen.designmode) {
					sNewLoadingStateText = oComponentProperties.message._v;
				} else if (oComponentProperties.message && oComponentProperties.message._v && !sap.zen.designmode
						&& oComponentProperties.message.visibleAtRuntime === true) {
					sNewLoadingStateText = oComponentProperties.message._v;
				}

				if (oComponentProperties.message && oComponentProperties.message._v) {
					bShowLoadingStateIcon = false;
				}

				if (oComponentProperties.showLoadingState) {
					bShowLoadingStateIcon = true;
				}

				if (oControl.showLoadingState !== bNewLoadingState
						|| oControl.showLoadingStateText !== sNewLoadingStateText
						|| oControl.showLoadingStateIcon !== bShowLoadingStateIcon) {
					if (!oControl.zenMessageControl) {
						oControl.oldAfterRenderingForDispatching = oControl.onAfterRendering;
					}
					oControl.showLoadingState = bNewLoadingState;
					oControl.showLoadingStateText = sNewLoadingStateText;
					oControl.showLoadingStateIcon = bShowLoadingStateIcon;
					this
							.addMessageOverlay(oControl, oControl.showLoadingStateText, oControl.showLoadingStateIcon,
									true);
					oControl.onAfterRendering = function() {
						if (this.oldAfterRenderingForDispatching) {
							this.oldAfterRenderingForDispatching();
						}

						sap.zen.Dispatcher.instance.addMessageOverlay(this, this.showLoadingStateText,
								this.showLoadingStateIcon, true);
					};
				}
			}
		}

		if (oComponentProperties.visible === false) {
			if (jQuery.support.opacity) {
				oControl.addStyleClass("zenInvisibleWithOpacity");
			} else {
				oControl.addStyleClass("zenInvisibleWithFilter");
			}
		} else if (oComponentProperties.visible === true) {
			if (jQuery.support.opacity) {
				oControl.removeStyleClass("zenInvisibleWithOpacity");
			} else {
				oControl.removeStyleClass("zenInvisibleWithFilter");
			}
		}
	};

	this.calcWidthUseOrderOfPriority = function(leftMargin, rightMargin, width) {
		if (leftMargin && leftMargin !== "auto" && rightMargin && rightMargin !== "auto") {
			return "auto";
		}
		return width;
	};

	this.calcHeightUseOrderOfPriority = function(topMargin, bottomMargin, height) {
		if (topMargin && topMargin !== "auto" && bottomMargin && bottomMargin !== "auto") {
			return "auto";
		}
		return height;
	};

	var transferControls = {};

	this.getTransferControl = function(componentId) {
		var phxControl = this.getRootControlForComponentId(componentId);
		delete transferControls[phxControl.getId()];
		return phxControl;
	};

	this.addTransferControl = function(phxControl, fRemoveFunction) {
		fRemoveFunction(phxControl);
		// Ab in den Transfermarkt
		transferControls[phxControl.getId()] = phxControl;
	};

	function destroyRemainingTransferControls() {
		for ( var id in transferControls) {
			if (transferControls.hasOwnProperty(id)) {
				var control = transferControls[id];
				that.dispatchRemove(control);
			}
		}
		transferControls = {};
	}

	this.dispatchRemove = function(oControl) {
		var controlType = oControl.zenControlType;
		var handlers = this.getHandlers(controlType);
		for (var iIndex = handlers.length - 1; iIndex >= 0; iIndex--) {
			var handler = handlers[iIndex];
			if (handler.styleClasses && handler.styleClasses[oControl.getId()]) {
				delete handler.styleClasses[oControl.getId()];
			}
			if (handler.remove) {
				handler.remove(oControl);
			}
		}
		var sComponentId = this.getComponentIdForControl(oControl);
		if (sComponentId) {
			this.removeComponentId(sComponentId);
		}
	};

	this.cleanChildrenControls = function(id) {
		var to_remove_map = {}, key;

		for (key in component_rootele_map) {
			if (component_rootele_map.hasOwnProperty(key) && component_rootele_map[key]) { // we can have empty keys for dummy deledates
				// key is component id
				if (component_rootele_map[key].getId().indexOf(id) > -1 && component_rootele_map[key].getId() !== id) {
					component_rootele_map[key].destroy();

					component_rootele_map[key] = null;
					to_remove_map[key] = key;
				}
			}
		}

		for (key in to_remove_map) {
			if (component_rootele_map.hasOwnProperty(key) && component_rootele_map[key]) { // we can have empty keys for dummy deledates
				// key is component id
				removeComponentId(key);
			}
		}
	};

	this.cleanAllControls = function() {
		component_rootele_map = {};
	};

	this.setAbsoluteLayoutInfo = function(oControl, args) {
		var posContainer = oControl.getParent();

		var oldArgs = this.getAbsoluteLayoutInfo(oControl);
		if (posContainer.updatePosition) {
			args = jQuery.extend(jQuery.extend({}, oldArgs), args);

			posContainer.updatePosition(args);
			oControl.zenOldLayoutArgs = args;
		}

		return args;
	};

	this.getAbsoluteLayoutInfo = function(oControl) {
		return oControl.zenOldLayoutArgs;
	};

	this.createAbsoluteLayoutInfo = function(component) {

		var leftMargin = component.leftmargin;
		var rightMargin = component.rightmargin;
		var topMargin = component.topmargin;
		var bottomMargin = component.bottommargin;

		var args = {};
		if (topMargin) {
			if (topMargin === "auto") {
				args.top = "";
			} else {
				args.top = topMargin + "px";
			}
		}
		if (leftMargin) {
			if (leftMargin === "auto") {
				args.left = "";
			} else {
				args.left = leftMargin + "px";
			}
		}
		if (rightMargin) {
			if (rightMargin === "auto") {
				args.right = "";
			} else {
				args.right = rightMargin + "px";
			}
		}
		if (bottomMargin) {
			if (bottomMargin === "auto") {
				args.bottom = "";
			} else {
				args.bottom = bottomMargin + "px";
			}
		}
		return args;
	};

	this.insertIntoAbsoluteLayoutContainer = function(absoluteLayoutContainer, oControl, iIndex) {
		absoluteLayoutContainer.insertContent(oControl, iIndex);
		if (oControl.zenMessageControl) {
			this.addMessageOverlay(oControl, oControl.showLoadingStateText, oControl.showLoadingStateIcon, true);
		}
	};

	this.getValue = function(component, name) {
		if (component[name]) {
			return component[name]["_v"];
		}
		return null;
	};

	this.isApplicationRoot = function(oControl) {
		var id = oControl.getId();
		if (id === "ROOT_grid" || /ROOT_absolutelayout$/.exec(id) !== null) {
			return true;
		}

		// This is done for Testing-purposes, so a single element can be added without the need for a ROOT absolute
		// Layout!
		// DO NOT REMOVE!
		var oParent = oControl.getParent();
		if (oParent) {
			return false;
		}
		return true;
	};

	this.setWidthHeight = function(phxObj, width, height) {
		if (width && phxObj.setWidth) {
			if (width !== "auto") {
				if (width.indexOf && width.indexOf("%") > -1) {
					phxObj.setWidth(width);
				} else {
					phxObj.setWidth(width + "px");
				}
			} else {
				phxObj.setWidth("auto");
			}
		}
		if (height && phxObj.setHeight) {
			if (height !== "auto") {
				if (height.indexOf && height.indexOf("%") > -1) {
					phxObj.setHeight(height);
				} else {
					phxObj.setHeight(height + "px");
				}
			} else {
				phxObj.setHeight("auto");
			}
		}
	};

	this.setComponentIdForControl = function(componentId, control) {
		component_rootele_map[componentId] = control;
	};

	this.getComponentIds = function() {
		var aComponentIds = [];
		for ( var sComponentId in component_rootele_map) {
			if (component_rootele_map.hasOwnProperty(sComponentId)) {
				aComponentIds.push(sComponentId);
			}
		}
		return aComponentIds;
	};

	this.removeComponentId = function(componentId) {
		delete component_rootele_map[componentId];
	};

	this.getComponentIdForControlId = function(sControlId) {
		for ( var key in component_rootele_map) {
			if (component_rootele_map.hasOwnProperty(key) && component_rootele_map[key].getId() === sControlId) { // key is component id
				return key;
			}
		}
		return null;
	};

	this.getControlForId = function(sControlId) {
		for ( var key in component_rootele_map) {
			if (component_rootele_map.hasOwnProperty(key) && component_rootele_map[key].getId() === sControlId) {
				return component_rootele_map[key];
			}
		}
		return null;
	};

	this.getComponentIdForControl = function(control) {
		var controlId = control.getId();
		return this.getComponentIdForControlId(controlId);
	};

	this.getRootControlForComponentId = function(sId) {
		// never access a destroyed Control
		if (component_rootele_map[sId]) {
			if (component_rootele_map[sId].bIsDestroyed === true) 
			{ 
				component_rootele_map[sId] = null; 
			}
		}
		
		return component_rootele_map[sId];
	};

	this.getGridInfo = function(oGridLayout) {
		var oGridInfo = {};
		oGridInfo.noOfRows = oGridLayout.getRows().length;
		oGridInfo.noOfCols = oGridLayout.getRows()[0].getCells().length;
		oGridInfo.heights = [];
		oGridInfo.widths = oGridLayout.aWidths;
		var rows = oGridLayout.getRows();
		for (var i = 0; i < rows.length; i++) {
			var row = rows[i];
			var height = row.getHeight();
			oGridInfo.heights[i] = height;
		}

		return oGridInfo;
	};

	this.findControlById = function(oGrid, sId) {
		var result = null;
		var funclet = function(oChild, rowIndex, colIndex, contentIndex) {
			if (oChild) {
				if (oChild.getId && oChild.getId() === sId) {
					result = {
						control: oChild,
						row: rowIndex,
						col: colIndex,
						contentIndex: contentIndex
					};
				}
				var handlers = that.getHandlers(oChild.zenControlType);
				if (handlers[0].applyForChildren) {
					handlers[0].applyForChildren(oChild, funclet);
				}

			}
		};
		this.getHandlers(oGrid.zenControlType)[0].applyForChildren(oGrid, funclet);
		return result;
	};

	this.createDelayedResizeHandler = function(startHandler, updateHandler, endHander, nResizeLag, nUpdateInterval) {
		var iSetTimeoutToken = 0;
		var iSetIntervalToken = 0;
		var lastEventArgs = null;

		var resize = function(e) {
			lastEventArgs = e;
			if (iSetTimeoutToken === 0) {
				if (startHandler) {
					startHandler(e);
				}
				iSetIntervalToken = window.setInterval(function() {
					if (updateHandler) {
						updateHandler(lastEventArgs);
					}
				}, nUpdateInterval);

			} else {
				window.clearTimeout(iSetTimeoutToken);
			}
			iSetTimeoutToken = window.setTimeout(function() {
				iSetTimeoutToken = 0;
				window.clearInterval(iSetIntervalToken);
				if (endHander) {
					endHander(lastEventArgs);
				}
				lastEventArgs = null;
			}, nResizeLag);

		};
		return resize;
	};

	this.registerResizeHandler = function(oControl, oHandler) {
		mapResizeHandlers[oControl] = {
			"handler": oHandler,
			"obj": oControl
		};
	};

	this.deregisterResizeHandler = function(oControl) {
		delete mapResizeHandlers[oControl];
	};

	this.registerGlobalHandlers = function() {
		function callOnHandler(sFunctionName, e) {
			for ( var oControl in mapResizeHandlers) {
				if (mapResizeHandlers.hasOwnProperty(oControl)) {

					var entry = mapResizeHandlers[oControl].handler;
					var fHandler = entry[sFunctionName];
					if (fHandler) {
						fHandler.call(entry, e);
					}
				}
			}
		}

		$(window).bind("resize", this.createDelayedResizeHandler(function(e) {
			callOnHandler("beginResize", e);
		}, function(e) {
			callOnHandler("updateResize", e);
		}, function(e) {
			callOnHandler("endResize", e);
		}, 300, 500));
	};

	this.getLogicalParent = function(phxControl) {
		return phxControl.getParent().getParent();
	};

	this.disableContextMenu = function() {
		$(document).bind("contextmenu", function(e) {
			// Show context menu only if Ctrl key is also pressed
			return e.ctrlKey;
		});
	};

	this.prepareCommand = function(sTemplate, sPlaceholder, sValue) {
		sValue = (sValue + "").replace(/\\/g, "\\\\");
		sValue = sValue.replace(/'/g, "\\'");
		sValue = sValue.replace(/\r/g, "");
		sValue = sValue.replace(/\n/g, "");
		if (typeof (DSH_deployment) !== "undefined") { 
			sValue = sValue.replace(/\\/g, "\\\\");
			sValue = sValue.replace(/'/g, "\\'");
		}
		/*
		 * ATTENTION:
		 * the replace of JavaScript removes $-signs:
		 * "_VAR_".replace("_VAR_", "$HELLO$") 		==> $HELLO$ 	OK
		 * "_VAR_".replace("_VAR_", "$$HELLO$$")	==> $HELLO$ 	ERROR
		 * "_VAR_".replace("_VAR_", "$$$HELLO$$$")	==> $$HELLO$$ 	ERROR
		 * 
		 * For this reason we need to find (n) $-signs and replace with (n*2) $-signs before calling the replace below
		 */
		sValue = sValue.replace(/[$]*/g, "$&$&");
		
		return sTemplate.replace(sPlaceholder, sValue);
	};

	this.dispatchAdvancedPropertyCall = function(sComponentId, a1, a2, a3, a4, a5) {
		var oRootControl = this.getRootControlForComponentId(sComponentId);
		if (oRootControl) { // Root control could be hidden
			var controlType = oRootControl.zenControlType;
			var handlers = this.getHandlers(controlType);

			for ( var iIndex in handlers) {
				if (handlers.hasOwnProperty(iIndex)) {
					var handler = handlers[iIndex];
					if (handler.advancedPropertyCall) {
						var result = handler.advancedPropertyCall(oRootControl, a1, a2, a3, a4, a5);
						if (result) {
							return result;
						}
					}
				}
			}
		}
	};

	this.pauseDispatching = function() {
		iDelayDispatchingCount++;
	};

	this.resumeDispatching = function() {
		if(iDelayDispatchingCount > 0) {
			iDelayDispatchingCount--;
			if (iDelayDispatchingCount === 0) {
				var f = fDelayedCallback;
				fDelayedCallback = null;
				if (f)
					f();
			}
		}
	};

	this.isPaused = function(f) {
		if (iDelayDispatchingCount > 0) {
			if (fDelayedCallback != null) {
				jQuery.sap.log.error("Undispatched Delayed Data found " + fDelayedCallback);
			}
			fDelayedCallback = f;
			return true;
		}
		return false;
	};
	
	
	this.isDispatching = function() {
		return bIsInDispatcher;
	};

	this.resetDispatcher = function(rootId) {
		
		var dshPrefix = "", oControl;
		if(this.dshPrefix){
			dshPrefix = this.dshPrefix;
		}

		/*
		 * Keeping the root layout in case of dialog response so it stays
		 * nicely visible in the background.
		 */
		if(rootId === dshPrefix+"ROOT") {
			oControl = this.getRootControlForComponentId(dshPrefix+"ROOT");
			if(oControl){
				this.dispatchRemove(oControl);	
			}
		}
		
		/* 
		 * Need to ignore requests during cleanup operation
		 * since filter panel will send request during destroy
		 */ 
		if (sap.zen.request) {
			sap.zen.request.que.instance.stopScheduling();
			
			oControl = this.getRootControlForComponentId(dshPrefix+"ROOT_DIALOG");
			if(oControl) {
				this.dispatchRemove(oControl);	
			}
			
			sap.zen.request.que.instance.continueScheduling();
		}
		
		if(rootId === dshPrefix+"ROOT") {
			this.reset();
		}
	}

	function updateStatisticsPanel() {
		if (sapbi_page.m_profileMode && jQuery.sap.measure.getActive()) {
			var measurements = jQuery.sap.measure.getAllMeasurements();
			var oTree = sap.ui.getCore().byId("RenderingStatisticsTree");
			var oModel = null;
			var sStep = "Step" + sapbi_statisticsStepCounter++;
			var j;
			if (oTree) {
				oModel = oTree.getModel().getData();
				oModel["root"][sStep] = {};
				oModel["root"][sStep]["text"] = sStep;
			}
			for (j = 0; j < measurements.length; j++) {
				var measurement = measurements[j];
				if (measurement && measurement.id.substr(0, 3) === "zen") {
					if (oModel) {
						var split1 = measurement.info.split(":");
						var split2 = split1[0].split("/");
						var oChild = oModel["root"][sStep];
						var sLeaf = "";
						for (var k = 0; k < split2.length; k++) {
							sLeaf = split2[k];
							if (!oChild[sLeaf]) {
								oChild[sLeaf] = {};
								oChild[sLeaf]["text"] = sLeaf;
							}
							oChild = oChild[sLeaf];
						}
						oChild["text"] = sLeaf + ": " + measurement.duration + " ms";
					}
					jQuery.sap.measure.remove(measurement.id);
				}
			}
			if (oModel) {
				oTree.getModel().setData(oModel);
				var element = sap.ui.getCore().byId("ZEN_PROFILING");
				element.setMinWidth("50%");
				element.setMinHeight("50%");
				
				// Check if the profiling dialog has been "kicked out" by some other dialog/popup.
				// "Kicked out" means that it has some other parent DIV in the DOM and the parent has the position (-1000, -1000).
				var jqElement = $(document.getElementById(element.getId()));
				var jqParentDiv = jqElement.parent();
				var currentTop = jqParentDiv.css("top");
				if (currentTop && currentTop.charAt(0) === "-") { // Check only for "-" in case the -1000 is changed to another number
					// The dialog it not visible, but its internal state still "thinks" its open.
					// Therefore we close it explicitly to bring the state up-to-date.
					element.close();
					
					// Closing of a UI5 dialog works asynchronously with a delay of 400 ms. Therefore we wait a little more
					// to be sure that the dialog is closed. Then we open it again.
					setTimeout(function() {element.open();}, 500);
				} else {
					element.open();
				}
			}
			if (sapbi_showUI5Measures) {
				jQuery.sap.log.info("Other: ");
				for (j = 0; j < measurements.length; j++) {
					measurement = measurements[j];
					if (measurement && measurement.id.substr(0, 3) !== "zen") {
						jQuery.sap.measure.remove(measurement.id);
					}
				}
			}
		}
	}
	
	this.dispatch = function(json, fCallback) {
	  bIsInDispatcher = true;
	  try {
		if (json.delta) {
			this.dispatchDelta(json.delta);
		} else if (json.component) {
			this.dispatchCreateControl(json.component, fCallback);
		} else if (json.control) {
			this.dispatchCreateControl(json.control, fCallback);
		}
		
		updateStatisticsPanel();
		this.loadCustomCss();
		
		if (sap.zen.designmode) {
			if (window.eclipse_sendZenUrl) {
				sap.zen.designmode.DecoratorManager.instance.sendZenUrl("ready");
			} else {
				setTimeout(function() {
					sap.zen.designmode.DecoratorManager.instance.sendZenUrl("ready");
				}, 100);
			}
			sap.zen.designmode.DecoratorManager.instance.afterDispatching();
		}
	  } finally {
		bIsInDispatcher = false;
	  }
  };

	/**
	 * Like RequireJS require API, but delays dispatching during module loading and loads all modules relative to
	 * initial caller's load path.
	 */
	this.require = function(aModules, fCallback) {
		var includeId = sap.zen.lastIncludeId + 1;
		this.pauseDispatching();
		var src = window.rhino_last_load_path; // when executed in Rhino for CVOM Chart type loading
		if (!src) {
			src = $("script[data-includeid="+ includeId +  "]").attr("src");
		}
		var path = src.substring(0, src.lastIndexOf("/"));
		
		return require( {baseUrl: path}, aModules, function() {
			var result = undefined;
			try {
				if (fCallback) {
					result = fCallback.apply(this, arguments);
				}
			} finally {
				require.config({baseUrl: sapbi_page.staticMimeUrlPrefix});
				that.resumeDispatching();
			}
			return result;
		});
	};
	
	// The following code registers and deregisters SDK custom data sources. 
	// The functions need to be available very early - even before real dispatching. 
	// Therefore they are contained in dispatcher. 

	this.sdkDataSources = {};

	this.sdkDsFindInstances = function (sDs) {
		var result = this.sdkDataSources[sDs];
		if (!result) {
			result = {};
			this.sdkDataSources[sDs] = result;
		}
		return result;
	};

	this.sdkDsFindEntryForComponent = function(sComponent, sDs) {
		var oInstancesForDs = this.sdkDsFindInstances(sDs);
		var entry = oInstancesForDs[sComponent];
		if (!entry) {
			entry = {};
			oInstancesForDs[sComponent] = entry;
		}
		return entry;
	};

	this.sdkDsFindEntryFor = function(sComponent, sProperty, sDs) {
		var oInstancesForComponent = this.sdkDsFindEntryForComponent(sComponent, sDs);
		var entry = oInstancesForComponent[sProperty];
		if (!entry) {
			entry = {
				data: {
					dimensions: []
				}
			};
			oInstancesForComponent[sProperty] = entry;
		}
		return entry;
	};

	this.sdkDsRender = function(sComponent, sProperty, sDs, oSelection, oOptions) {
		var entry = this.sdkDsFindEntryFor(sComponent, sProperty, sDs);
		entry.selection = oSelection;
		entry.options = oOptions;
		var control = sap.zen.Dispatcher.instance.getRootControlForComponentId(sDs);
		if (control) {
			var handler = control.widget;
			handler.updateDataInto(oSelection, oOptions, entry.data);
		}
		return entry.data;
	};

	this.sdkDsRenderMetadata = function(sComponent, sProperty, sDs, oSelection, oOptions) {
		return this.sdkDsRender(sComponent, sProperty, sDs, oSelection, oOptions);
	};

	this.sdkDsCallFunction = function(sDs, sFunction, arg1, arg2, arg3) {
		var control = this.getRootControlForComponentId(sDs);
		if (control) {
			var handler = control.widget;
			var result = handler[sFunction].call(handler, arg1, arg2, arg3);

			handler.lastCallbackResult = function(val) {
				if (val === undefined && result) { // Only getter case is relevant
					return JSON.stringify(result);
				}
				return null;
			};
			handler.firePropertiesChanged([ "lastCallbackResult" ]);
		}
	};

	this.sdkDsUnregister = function(sComponent, sDs) {
		var oInstancesForDs = this.sdkDsFindInstances(sDs);
		delete oInstancesForDs[sComponent];
	};
	
	this.sdkDsDelete = function(sDs) {
		delete this.sdkDataSources[sDs];
	};
	
    this.changeTheme = function(sThemeName) {
        var that = this;
        var sapUiCore = sap.ui.getCore();

        var currentTheme = sapUiCore.getConfiguration().getTheme();
        if (currentTheme !== sThemeName) {
              var fOnThemeChanged = function() {
                    that.resumeDispatching();
                    sapUiCore.detachThemeChanged(fOnThemeChanged);
              };
              
              this.pauseDispatching();
              sapUiCore.attachThemeChanged(fOnThemeChanged);
              sapUiCore.applyTheme(sThemeName);              
        }
  };
	
	// Generic Drag and Drop stuff BEGIN /////
  
  	this.closeContextMenu = function() {
  		if (oContextMenu) {
  			oContextMenu.close();
  		}
  	};
  	
  	this.registerContextMenu = function(poContextMenu) {
  		oContextMenu = poContextMenu;
  	};
  
  	this.cancelDragDropOperation = function() {
		var oControl;
		
  		if (oDragDropPayload) {
  			this.setDragDropCanceled(true);
			$.each(oDragDropCancelHandlerRegistry, function(sComponentId, fHandler) {
				oControl = that.getControlForId(sComponentId);
				if (oControl) {
					setTimeout(function() {
						fHandler.call(oControl);
					}, 0);
				}
			});
	  	}
  	};

  	this.registerEscKeyHandler = function() {
  		if (!bDragDropEscKeyHandlerRegistered) {
  			$(document).on("keydown", function(e) {
  				if (e.which === 27) {
  					that.cancelDragDropOperation();
  				}
  			});
  			bDragDropEscKeyHandlerRegistered = true;
  		}
  	};
  	
  	this.setDragDropCanceled = function(bCanceled) {
  		if (oDragDropPayload) {
  			oDragDropPayload.bDragOperationCanceled = bCanceled;
  		}
  	};
  	
  	this.isDragDropCanceled = function() {
  		if (oDragDropPayload) {
  			return oDragDropPayload.bDragOperationCanceled;
  		}
  		// default: cancel when no payload
  		return true;
  	};
  
  	this.registerDragDropCancelHandler = function(sComponentId, fHandler) {
  		this.registerEscKeyHandler();
  		oDragDropCancelHandlerRegistry[sComponentId] = fHandler;
  	};
  	
	this.deRegisterDragDropCancelHandler = function(sComponentId) {
		delete oDragDropCancelHandlerRegistry[sComponentId];
	};
	
	this.registerUnhandledDropHandler = function(sComponentId, fHandler) {
		oUnhandledDropHandlerRegistry[sComponentId] = fHandler;
	};
	
	this.deRegisterUnhandledDropHandler = function(sComponentId) {
		delete UnhandledDropHandlerRegistry[sComponentId];
	};
	
	this.setDragDropPayload = function(oPayload) {
		oDragDropPayload = oPayload;
	};
	
	this.getDragDropPayload = function() {
		return oDragDropPayload;
	};
	
	this.onUnhandledDrop = function(e, ui) {
		if (oDragDropPayload) {
			var fHandler = oUnhandledDropHandlerRegistry[oDragDropPayload.sComponentId];
			if (fHandler) {
				var oSourceZenControl = that.getControlForId(oDragDropPayload.sComponentId);
				if (oSourceZenControl) {
					fHandler.call(oSourceZenControl, e, ui, oDragDropPayload);
				} 
			}
		}
	};
	
	this.setInterComponentDragDropEnabled = function(bEnabled) {
		bInterComponentDragDropEnabled = bEnabled;
	};
	
	this.isInterComponentDragDropEnabled = function() {
		return bInterComponentDragDropEnabled;
	};
	
	this.createDragDropPayload = function(sComponentId) {
		oDragDropPayload = {"sComponentId" : sComponentId, 
				            "oDragDropInfo" : {"sDimensionName" : "", 
				            	               "sAttributeName" : "", 
				            	               "sAxisName" : "", 
				            	               "bIsMeasureStructure" : false,
				            	               "bIsMemberDrag" : false,
				            	               "iMemberRow" : -1,
				            	               "iMemberCol" : -1
				            	              },
				            "oInterComponentAcceptStatus" : {},
				            "bDragOperationCanceled" : false			        
							};
		
		return oDragDropPayload;
	};
	
	this.setDropAccepted = function(sDroppableId, bAccepted) {
		if (oDragDropPayload) {
			oDragDropPayload.oInterComponentAcceptStatus[sDroppableId] = bAccepted;
		}
	};
	
	this.isDropAcceptedForDroppable = function(sDroppableId) {
		if (oDragDropPayload) {
			return oDragDropPayload.oInterComponentAcceptStatus[sDroppableId];
		}
		return false;
	};
	
	// Generic Drag and Drop stuff END /////
	
	this.mainMode = false;
	
	this.setMainMode = function(bMainMode){
		this.mainMode = bMainMode;
	}
	
	this.isMainMode = function(){
		return this.mainMode;
	}
	
	this.bCompactMode = false;
	
	this.setCompactMode = function(bCompact){
		if (!$(document.body).hasClass("sapUiSizeCozy")) {
			if(bCompact){
				$(document.body).addClass("sapUiSizeCompact");
			}else{
				$(document.body).removeClass("sapUiSizeCompact");
			}
		}
		this.bCompactMode = bCompact;
	};
	
	this.isCompactMode = function(){
		return this.bCompactMode;
	}
	
	this.sCustomCssUrl = null;
	this.bCustomCssLoaded = false;
	this.registerCustomCSS = function(sCustomCSSUrlGiven){
		this.sCustomCssUrl = sCustomCSSUrlGiven;
	}
	
	this.customCssExists = function(){
		return this.sCustomCssUrl !== null && this.sCustomCssUrl !== "";
	}
	
	this.loadCustomCss = function(){
		if(!this.bCustomCssLoaded && this.customCssExists()){
			sapbi_page.loadCssInclude(this.sCustomCssUrl);
			this.bCustomCssLoaded = true;
		}
	}
};

sap.zen.Dispatcher.instance = new sap.zen.Dispatcher();
sap.zen.Dispatcher.instance.registerGlobalHandlers();

define("sap/zen/dispatcher", [], function(){return sap.zen.Dispatcher.instance;});

sap.zen.BaseHandler = function() {
	"use strict";
	var dispatcher = sap.zen.Dispatcher.instance;
	this.styleClasses = [];
	
	this.createUI5Identifier = function(sId) {
		return sId.replace(/[^-A-Za-z0-9_.:]/g, "_");
	}

	this.remove = function(oControl) {
		if (this.applyForChildren) {
			this.applyForChildren(oControl, function(oChild) {
				dispatcher.dispatchRemove(oChild);
			});
		}
		sap.zen.Dispatcher.instance.deregisterResizeHandler(oControl);
		if (oControl.zenMessageControl) {
			sap.zen.Dispatcher.instance.removeMessageOverlay(oControl);
			oControl.onAfterRendering = oControl.oldAfterRenderingForDispatching;
			delete oControl.oldAfterRenderingForDispatching;
			delete oControl.showLoadingState;
			delete oControl.showLoadingStateText;
			delete oControl.showLoadingStateIcon;
			delete oControl.zenMessageControl;
		}
		oControl.destroy();
	};

	this.createAndAdd = function(phxObj, controlData, componentData, fInsertIntoParentFunclet, iIndex) {
		var oNewControl = this.create(phxObj, controlData, componentData);
		if (fInsertIntoParentFunclet) {
			fInsertIntoParentFunclet(oNewControl, iIndex, componentData);
		}
		sap.zen.Dispatcher.instance.updateComponentProperties(oNewControl, componentData, fInsertIntoParentFunclet);
		return oNewControl;
	};

	this.updateComponent = function(oControl, oControlProperties, oComponentProperties, fAppendToParentFunclet) {
		this.update(oControl, oControlProperties, oComponentProperties);
		sap.zen.Dispatcher.instance.updateComponentProperties(oControl, oComponentProperties, fAppendToParentFunclet);
	};

	this.isNew = function(oComponentProperties) {
		return dispatcher.getRootControlForComponentId(oComponentProperties.id) == null;
	};

	/**
	 * fInsertIntoParentFunclet(childControlToInsert, index, ???) fDeleteFromParentFunclet(childControlToRemove)
	 */
	this.updateChildren = function(aChildrenFromJson, oContainer, fInsertIntoParentFunclet, fDeleteFromParentFunclet) {

		var mapAllChildrenComponentIds = this.getAllChildren(oContainer);

		for (var i = 0; i < aChildrenFromJson.length; i++) {
			var jsonChild;
			if (aChildrenFromJson[i].component) {
				jsonChild = aChildrenFromJson[i].component;
			} else {
				jsonChild = {
					id: aChildrenFromJson[i].control.id,
					content: aChildrenFromJson[i]
				};
				var oLayoutProperties = jsonChild.content.control.controlLayoutProperties;
				if (oLayoutProperties) {
					for (var oKey in oLayoutProperties) {
						if (oLayoutProperties.hasOwnProperty(oKey)) {
							jsonChild[oKey] = oLayoutProperties[oKey];
						}
					}
				}
			}
			var childEntry = mapAllChildrenComponentIds[jsonChild.id];

			if (this.isNew(jsonChild)) {
				// new control
				dispatcher.dispatchCreateControl(jsonChild, fInsertIntoParentFunclet, i);
			} else if (childEntry) {
				// control exists
				var iChildIndex = childEntry.i;
				if (iChildIndex !== i) {
					var childControl = childEntry.o;
					fDeleteFromParentFunclet(childControl);
					fInsertIntoParentFunclet(childControl, i);
				}
				dispatcher.dispatchUpdateControl(jsonChild);
			} else {
				var phxControl = dispatcher.getTransferControl(jsonChild.id);
				fInsertIntoParentFunclet(phxControl, i);
				dispatcher.dispatchUpdateControl(jsonChild, fInsertIntoParentFunclet);
			}
			delete mapAllChildrenComponentIds[jsonChild.id];
		}

		var mapChildrenAfterUpdate = this.getAllChildren(oContainer);
		for ( var oRemainingComponentId in mapAllChildrenComponentIds) {

			if (mapChildrenAfterUpdate[oRemainingComponentId]) {
				var oControl = mapAllChildrenComponentIds[oRemainingComponentId].o;
				dispatcher.addTransferControl(oControl, fDeleteFromParentFunclet);
			}
		}
	};

	this.getAllChildren = function(oControl) {
		var result = {};
		var iIndex = 0;
		var funclet = function(oChild) {
			var componentId = dispatcher.getComponentIdForControl(oChild);
			if (componentId) {
				result[componentId] = {
					i: iIndex,
					o: oChild
				};
				iIndex++;
			}
		};
		this.applyForChildren(oControl, funclet);
		return result;
	};

	/**
	 * Call this function if your handler if you want to send a RIC command via Javascript (PVT). The pattern is that a
	 * "template" with a placeholder is passed in. The value is correctly escaped and then put into the placeholder's
	 * position.
	 */
	this.prepareCommand = function(sTemplate, sPlaceholder, sValue) {
		return sap.zen.Dispatcher.instance.prepareCommand(sTemplate, sPlaceholder, sValue);
	};

	this.advancedPropertyCall = function() {
		return null;
	};

	this.getContextMenuAction = function() {
		return null;
	};
	
	
	this.getDefaultProxyClass = function(){
		throw "You have to provide a default proxy class! [<MCLASS>,<UI_COMMONS_CLASS>]";
	};
	
	this.provideFunctionMapping = function(){
		return null;
	};

	var getClassByString = function(sClass){
		var result = resolvePath(sClass);
		if (result == null)
		{
			jQuery.sap.require(sClass);
			result = resolvePath(sClass);
		}
		if (result == null) {
			throw "Object does not exist! Check your getDefaultProxyClass method!";			
		}
		
		return result;	
	}
	
	var attachNewFunction = function(oControl, uiCommonsFunctionName, mFunctionName){
		oControl[uiCommonsFunctionName] = function(){
			if(mFunctionName !== null){
				return this[mFunctionName].apply(this,arguments);
			}
		}
	}
	
	this.createDefaultProxy = function(sId){
		var sClass, oClass;
		if(sap.zen.Dispatcher.instance.isMainMode()){
			sClass = this.getDefaultProxyClass()[0];
			oClass = getClassByString(sClass);
			
			var oControl = new oClass(sId);
			var functionMappings = this.provideFunctionMapping();
			
			if(functionMappings != null){
				for (var i = 0; i < functionMappings.length; i++) {
					var uiCommonsFunctionName = functionMappings[i][1];
					var mFunctionName = functionMappings[i][0];
					attachNewFunction(oControl, uiCommonsFunctionName, mFunctionName);
				}
			}
			
			return oControl;
		} else {
			sClass = this.getDefaultProxyClass()[1];
			oClass = getClassByString(sClass);
			return new oClass(sId);
		}
	};
	
	function resolvePath(sClass) {
		var aPath = sClass.split(".");
		var oResolvedPath = window;
		for ( var i = 0; i < aPath.length; i++) {
			var sOnePathPart = aPath[i];
			oResolvedPath = oResolvedPath[sOnePathPart];
			if(!oResolvedPath){
				break;
			}
		}
		return oResolvedPath;		
	}
	
	/////
	this.createButton = function(sId,oAttr){
		//sId could also be oAttr. Does not matter for this call.
		if(sap.zen.Dispatcher.instance.isMainMode()){
			return new sap.m.Button(sId, oAttr);
		}else{
			return new sap.ui.commons.Button(sId, oAttr);
		}
	};
	
	this.createButtonWithHeight = function(sId){
		//sId could also be oAttr. Does not matter for this call.
		if(sap.zen.Dispatcher.instance.isMainMode()){
			this.createZenButtonClassIfNecessary();
			return new sap.zen.ZenButton(sId);
		}else{
			return new sap.ui.commons.Button(sId);
		}
	};
	
	this.createZenButtonClassIfNecessary = function(){
		if(sap.zen.Dispatcher.instance.isMainMode()){
			sap.m.Button.extend("sap.zen.ZenButton", {
				// the control API:
				metadata : {
					properties : {
						"height" : "sap.ui.core.CSSSize"
					}
				},
			
				renderer : {},
			
				// an event handler:
				onAfterRendering : function(evt) { // is called when the Control's area is
													// clicked - no event registration
													// required
					if (sap.m.Button.prototype.onAfterRendering) {
						sap.m.Button.prototype.onAfterRendering.apply(this, [ evt ]);
					}
					
					this.addStyleClass("zenSapMBtnFixHeight");
			
					var height = this.getHeight();
					var jqThis = this.$();
					var firstChild = $(jqThis.children()[0]);
					var firstChildChild = $(firstChild.children()[0]);
					if (height !== "auto") {
						jqThis.css("height",height);
						firstChild.css("height",height);
						firstChildChild.css("line-height",height);
					}
					
					
				}
			});
		}
	};
	
	this.createPanel = function (sId){
		if(sap.zen.Dispatcher.instance.isMainMode()){
			return new sap.m.Panel(sId);
		}else{
			return new sap.ui.commons.Panel(sId);
		}
	};
	
	this.createDropdownBox = function(sId, oAttr){
		if(sap.zen.Dispatcher.instance.isMainMode()){
			var oSelect = new sap.m.Select(sId, oAttr);
			oSelect.setEditable = function(){
				
			};
			oSelect.getValue = function(){
				return this.getSelectedItem().getKey();
			};
			return oSelect;
		}else{
			return new sap.ui.commons.DropdownBox(sId, oAttr);
		}
	};
	
	this.createTabStrip = function(sId, oAttr){
		if(sap.zen.Dispatcher.instance.isMainMode()){
			var tabStrip = sap.m.IconTabBar(sId, oAttr);
			tabStrip.createTab = function(sTitle,oObject){
				var oTab = new sap.m.IconTabFilter();
				oTab.setText(sTitle);
				oTab.addContent(oObject);
				this.addItem(oTab);
			};
			tabStrip.getSelectedIndex = function(){
				var aItems = this.getItems();
				for ( var i = 0; i < aItems.length; i++) {
					if(aItems[i].getId() === this.getSelectedKey()){
						return i;
					}
				}
				return 0;
			}
			
			tabStrip.setSelectedIndex = function(iTabindex){
				var aItems = this.getItems();
				this.setSelectedKey(aItems[iTabindex].getId());
			}
			
			return tabStrip;
		}else{
			return new sap.ui.commons.TabStrip(sId, oAttr); 
		}
	};
	
	this.createLabel = function(sId, oAttr){
		if(sap.zen.Dispatcher.instance.isMainMode()){
			return new sap.m.Label(sId, oAttr);
		}else{
			return new sap.ui.commons.Label(sId, oAttr);
		}
	};
	
	this.createTree = function(sId){
		if(sap.zen.Dispatcher.instance.isMainMode()){
			sap.ui.getCore().loadLibrary("sap.ui.table");
			return new sap.ui.table.TreeTable(sId,{
				columns: [
				  		new sap.ui.table.Column({label: "Text", template: "text"}),
				  	]});
		}else{
			return new sap.ui.commons.Tree(sId);
		}
	};
	
	this.createDialog = function(sId, oParams){
		if(sap.zen.Dispatcher.instance.isMainMode()){
			var oDialog = new sap.m.Dialog(sId);
			oDialog.attachClosed = function(fFunclet){
				this.attachAfterClose(fFunclet);
			};
			oDialog.setResizable = function(){
				
			};
			oDialog.setMinWidth = function(){
				
			};
			oDialog.setMinHeight = function(){
				
			};
			
			// Newer UI5 versions do not add this any more!
			oDialog.addStyleClass("sapUiPopupWithPadding");
			
			return oDialog;
		}else{
			return new sap.ui.commons.Dialog(sId, oParams);
		}
		
	};
	
	this.createMenu = function(sId, oAttr){
		if(sap.zen.Dispatcher.instance.isMainMode()){
			$.sap.require("sap.ui.unified.Menu");
			return new sap.ui.unified.Menu(sId, oAttr);
		}else{
			return new sap.ui.commons.Menu(sId, oAttr);
		}
	};
	
	this.createMenuItem = function(sId, oParams){
		if(sap.zen.Dispatcher.instance.isMainMode()){
			return new sap.ui.unified.MenuItem(sId,oParams);
		}else{
			return new sap.ui.commons.MenuItem(sId,oParams);
		}
	};
	
	this.createCheckBox = function(sId, oAttr){
		if(sap.zen.Dispatcher.instance.isMainMode()){
			var cb = new sap.m.CheckBox(sId, oAttr);
			 cb.setChecked = function(cChecked){
				this.setSelected(cChecked);
			 };

			 cb.getChecked = function(){
				return this.getSelected();
			 };

			 cb.attachChange = function(fFunclet){
				 this.attachSelect(fFunclet);
			 }
			return cb;
		}else{
			return new sap.ui.commons.CheckBox(sId, oAttr);
		}
	};
	
	this.createTextView = function(sId, oAttr) {
		if (sap.zen.Dispatcher.instance.isMainMode()) {
			return new sap.m.Text(sId, oAttr);
		} else {
			return new sap.ui.commons.TextView(sId, oAttr);
		}
	};
	
	this.createTextField = function(sId, oAttr){
		if(sap.zen.Dispatcher.instance.isMainMode()){
			return new sap.m.Input(sId, oAttr);
		}else{
			return new sap.ui.commons.TextField(sId, oAttr);
		}
	};
	
	this.createTextArea = function(sId, oAttr){
		//sId could also be oAttr. Does not matter for this call.
		if(sap.zen.Dispatcher.instance.isMainMode()){
			return new sap.m.TextArea(sId, oAttr);
		}else{
			return new sap.ui.commons.TextArea(sId, oAttr);
		}
	};
	
	this.useMessageBox = function(){
		if(sap.zen.Dispatcher.instance.isMainMode()){
			return sap.m.MessageBox;
		}else{
			return sap.ui.commons.MessageBox;
		}
	}
	
	this.createTextWithHeight = function(sId, oAttr){
		this.createTextClassWithHeight();
		//sId could also be oAttr. Does not matter for this call.
		return new sap.zen.ZenTextView(sId, oAttr);
	}
	
	this.createTextClassWithHeight = function(){
		//This fix is intended for S4HANA. A switch between apps can happen, which use commons and m respectively.
		//In this case we need to recreate the class with a different superclass.
		if(sap.zen.ZenTextView && sap.zen.ZenTextView.isMainMode !== sap.zen.Dispatcher.instance.isMainMode()){
			delete sap.zen.ZenTextView;
		}
		
		if(!sap.zen.ZenTextView){
			var toInheritFrom;
			if(sap.zen.Dispatcher.instance.isMainMode()){
				toInheritFrom = sap.m.Text;
			}else{
				toInheritFrom = sap.ui.commons.TextView;
			}
			toInheritFrom.extend("sap.zen.ZenTextView", {
				// the control API:
				metadata : {
					properties : {
						"height" : "sap.ui.core.CSSSize",
						"cssStyle" : "string"
					}
				},
	
				renderer : {},
	
				// an event handler:
				onAfterRendering : function(evt) { // is called when the Control's area is
													// clicked - no event registration
													// required
					if (toInheritFrom.prototype.onAfterRendering) {
						toInheritFrom.prototype.onAfterRendering.apply(this, [ evt ]);
					}
	
					var height = this.getHeight();
					var jqThis = this.$();
					if (height !== "auto") {
						// set height
						jqThis.height(height);			
					}
					
					var newstyle = jqThis.attr("style");
					newstyle += ";" + this.getCssStyle();
					jqThis.attr("style", newstyle);
				}
			});
			sap.zen.ZenTextView.isMainMode = sap.zen.Dispatcher.instance.isMainMode();
		}
	};
	
	this.createAbsoluteLayout = function(sId, oParams){
		$.sap.require("sap.zen.commons.layout.AbsoluteLayout");
		return new sap.zen.commons.layout.AbsoluteLayout(sId, oParams);
	};
	
	////

};
sap.zen.BaseHandler.dispatcher = sap.zen.Dispatcher.instance;

define("sap/zen/basehandler", [], function() {return sap.zen.BaseHandler;});

var dummyTable = {
	"type": "xtable",
	"id": "CROSSTAB_1_ia_pt_a",
	"fixedcolheaders": 3,
	"fixedrowheaders": 2,
	"totaldatarows": 12,
	"totaldatacols": 4,
	"sentdatarows": 12,
	"sentdatacols": 4,
	"tilerows": 10000,
	"tilecols": 10000,
	"dataproviderchanged": true,
	"resultsetchanged": true,
	"clientheaderhpos": "0",
	"clientvpos": "0",
	"clientvscrolledtoend": false,
	"clienthpos": "0",
	"clienthscrolledtoend": false,
	"headerinfo" : {
		"cols" : {
			"0" : {
				"charname" : "0CALMONTH"
			},
			"1" : {
				"charname" : "0D_PH2"
			},
			"length" : 2
		},
		"rows" : {
			"0" : {
				"charname" : "4MEWGNJ58QSS34XN52IGIJIGH"
			},
			"1" : {
				"charname" : "0D_PH1"
			},
			"2" : {
				"charname" : "0D_PH1"
			},
			"length" : 3
		}
	},
	"changed": true,
	"rows": [
			{
				"row": {
					"rowidx": "1",
					"cells": [ {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_0_0",
							"rowspan": 2,
							"colidx": 1,
							"style": "TITLE",
							"_v": "DIMHEADER"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_0_1",
							"colidx": 2,
							"style": "TITLE",
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_0_2",
							"colspan": 4,
							"colidx": 3,
							"key": "4LVUCIXH4POZ2EA900TT71TF6",
							"style": "HEADER",
							"_v": "Net Sales"
						}
					} ]
				}
			},
			{
				"row": {
					"rowidx": "2",
					"cells": [
							{
								"control": {
									"type": "xcell",
									"id": "CROSSTAB_1_ia_pt_1_1",
									"colidx": 2,
									"style": "TITLE",
									"_v": "Product group"
								}
							},
							{
								"control": {
									"type": "xcell",
									"id": "CROSSTAB_1_ia_pt_1_2",
									"colidx": 3,
									"key": "4LVUCIXH4POZ2EA900TT71TF6/DS10",
									"style": "HEADER",
									"sort": "NONE",
									"sortalternativetext": "Unsorted. Select to sort ascending.",
									"sorttooltip": "Unsorted. Select to sort ascending.",
									"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','1',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v": "Computer,keybord"
								}
							},
							{
								"control": {
									"type": "xcell",
									"id": "CROSSTAB_1_ia_pt_1_3",
									"colidx": 4,
									"key": "4LVUCIXH4POZ2EA900TT71TF6/DS20",
									"style": "HEADER",
									"sort": "NONE",
									"sortalternativetext": "Unsorted. Select to sort ascending.",
									"sorttooltip": "Unsorted. Select to sort ascending.",
									"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','2',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v": "Accessories+space"
								}
							},
							{
								"control": {
									"type": "xcell",
									"id": "CROSSTAB_1_ia_pt_1_4",
									"colidx": 5,
									"key": "4LVUCIXH4POZ2EA900TT71TF6/DS30",
									"style": "HEADER",
									"sort": "NONE",
									"sortalternativetext": "Unsorted. Select to sort ascending.",
									"sorttooltip": "Unsorted. Select to sort ascending.",
									"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','3',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v": "Hardware software"
								}
							},
							{
								"control": {
									"type": "xcell",
									"id": "CROSSTAB_1_ia_pt_1_5",
									"colidx": 6,
									"key": "4LVUCIXH4POZ2EA900TT71TF6/SUMME",
									"style": "TOTAL",
									"sort": "NONE",
									"sortalternativetext": "Unsorted. Select to sort ascending.",
									"sorttooltip": "Unsorted. Select to sort ascending.",
									"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','4',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v": "Overall Result"
								}
							} ]
				}
			},
			{
				"row": {
					"rowidx": "3",
					"cells": [
							{
								"control": {
									"type": "xcell",
									"id": "CROSSTAB_1_ia_pt_2_0",
									"colidx": 1,
									"style": "TITLE",
									"sort": "ASC",
									"sortalternativetext": "Ascending",
									"sorttooltip": "Sort in Descending Order",
									"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','5',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v": "Calendar Year/Month"
								}
							},
							{
								"control": {
									"type": "xcell",
									"id": "CROSSTAB_1_ia_pt_2_1",
									"colidx": 2,
									"style": "TITLE",
									"sort": "ASC",
									"sortalternativetext": "Ascending",
									"sorttooltip": "Sort in Descending Order",
									"sortaction": "sapbi_page.sendCommandArray([['BI_COMMAND',null,0,[['GUID','6',0],['BI_COMMAND_TYPE','ABSTRACT',0]]]]);",
									"_v": "Product"
								}
							}, {
								"control": {
									"type": "xcell",
									"id": "CROSSTAB_1_ia_pt_2_2",
									"colidx": 3,
									"style": "HEADER",
									"_v": "* 1,000 $"
								}
							}, {
								"control": {
									"type": "xcell",
									"id": "CROSSTAB_1_ia_pt_2_3",
									"colidx": 4,
									"style": "HEADER",
									"_v": "* 1,000 $"
								}
							}, {
								"control": {
									"type": "xcell",
									"id": "CROSSTAB_1_ia_pt_2_4",
									"colidx": 5,
									"style": "HEADER",
									"_v": "* 1,000 $"
								}
							}, {
								"control": {
									"type": "xcell",
									"id": "CROSSTAB_1_ia_pt_2_5",
									"colidx": 6,
									"style": "TOTAL",
									"_v": "* 1,000 $"
								}
							} ]
				}
			}, {
				"row": {
					"rowidx": "4",
					"cells": [ {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_3_0",
							"rowspan": 12,
							"colidx": 1,
							"key": "200301",
							"style": "HEADER",
							"_v": "JAN 2003"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_3_1",
							"colidx": 2,
							"key": "200301/PDS01",
							"style": "HEADER",
							"_v": "Notebook tfas"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_3_2",
							"colidx": 3,
							"_v": "24,139"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_3_3",
							"colidx": 4,
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_3_4",
							"colidx": 5,
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_3_5",
							"colidx": 6,
							"style": "TOTAL",
							"_v": "24,139"
						}
					} ]
				}
			}, {
				"row": {
					"rowidx": "5",
					"cells": [ {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_4_1",
							"colidx": 2,
							"key": "200301/PDS02",
							"style": "HEADER",
							"_v": "Notebook Speedy II"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_4_2",
							"colidx": 3,
							"style": "ALTERNATING",
							"_v": "20,962"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_4_3",
							"colidx": 4,
							"style": "ALTERNATING",
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_4_4",
							"colidx": 5,
							"style": "ALTERNATING",
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_4_5",
							"colidx": 6,
							"style": "TOTAL",
							"_v": "20,962"
						}
					} ]
				}
			}, {
				"row": {
					"rowidx": "6",
					"cells": [ {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_5_1",
							"colidx": 2,
							"key": "200301/PDS03",
							"style": "HEADER",
							"_v": "A4 Writing Case"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_5_2",
							"colidx": 3,
							"_v": "21,901"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_5_3",
							"colidx": 4,
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_5_4",
							"colidx": 5,
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_5_5",
							"colidx": 6,
							"style": "TOTAL",
							"_v": "21,901"
						}
					} ]
				}
			}, {
				"row": {
					"rowidx": "7",
					"cells": [ {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_6_1",
							"colidx": 2,
							"key": "200301/PDS04",
							"style": "HEADER",
							"_v": "Automatic umbrella"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_6_2",
							"colidx": 3,
							"style": "ALTERNATING",
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_6_3",
							"colidx": 4,
							"style": "ALTERNATING",
							"_v": "18,333"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_6_4",
							"colidx": 5,
							"style": "ALTERNATING",
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_6_5",
							"colidx": 6,
							"style": "TOTAL",
							"_v": "18,333"
						}
					} ]
				}
			}, {
				"row": {
					"rowidx": "8",
					"cells": [ {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_7_1",
							"colidx": 2,
							"key": "200301/PDS05",
							"style": "HEADER",
							"_v": "PX2  updated"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_7_2",
							"colidx": 3,
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_7_3",
							"colidx": 4,
							"_v": "22,927"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_7_4",
							"colidx": 5,
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_7_5",
							"colidx": 6,
							"style": "TOTAL",
							"_v": "22,927"
						}
					} ]
				}
			}, {
				"row": {
					"rowidx": "9",
					"cells": [ {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_8_1",
							"colidx": 2,
							"key": "200301/PDS06",
							"style": "HEADER",
							"_v": "Stereo Kit"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_8_2",
							"colidx": 3,
							"style": "ALTERNATING",
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_8_3",
							"colidx": 4,
							"style": "ALTERNATING",
							"_v": "24,578"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_8_4",
							"colidx": 5,
							"style": "ALTERNATING",
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_8_5",
							"colidx": 6,
							"style": "TOTAL",
							"_v": "24,578"
						}
					} ]
				}
			}, {
				"row": {
					"rowidx": "10",
					"cells": [ {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_9_1",
							"colidx": 2,
							"key": "200301/PDS07",
							"style": "HEADER",
							"_v": "Camera Connector"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_9_2",
							"colidx": 3,
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_9_3",
							"colidx": 4,
							"_v": "26,120"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_9_4",
							"colidx": 5,
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_9_5",
							"colidx": 6,
							"style": "TOTAL",
							"_v": "26,120"
						}
					} ]
				}
			}, {
				"row": {
					"rowidx": "11",
					"cells": [ {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_10_1",
							"colidx": 2,
							"key": "200301/PDS08",
							"style": "HEADER",
							"_v": "USB Storage"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_10_2",
							"colidx": 3,
							"style": "ALTERNATING",
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_10_3",
							"colidx": 4,
							"style": "ALTERNATING",
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_10_4",
							"colidx": 5,
							"style": "ALTERNATING",
							"_v": "22,238"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_10_5",
							"colidx": 6,
							"style": "TOTAL",
							"_v": "22,238"
						}
					} ]
				}
			}, {
				"row": {
					"rowidx": "12",
					"cells": [ {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_11_1",
							"colidx": 2,
							"key": "200301/PDS09",
							"style": "HEADER",
							"_v": "Harddrive onTour"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_11_2",
							"colidx": 3,
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_11_3",
							"colidx": 4,
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_11_4",
							"colidx": 5,
							"_v": "23,380"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_11_5",
							"colidx": 6,
							"style": "TOTAL",
							"_v": "23,380"
						}
					} ]
				}
			}, {
				"row": {
					"rowidx": "13",
					"cells": [ {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_12_1",
							"colidx": 2,
							"key": "200301/PDS10",
							"style": "HEADER",
							"_v": "USB MegaStorage"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_12_2",
							"colidx": 3,
							"style": "ALTERNATING",
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_12_3",
							"colidx": 4,
							"style": "ALTERNATING",
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_12_4",
							"colidx": 5,
							"style": "ALTERNATING",
							"_v": "20,312"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_12_5",
							"colidx": 6,
							"style": "TOTAL",
							"_v": "20,312"
						}
					} ]
				}
			}, {
				"row": {
					"rowidx": "14",
					"cells": [ {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_13_1",
							"colidx": 2,
							"key": "200301/PDS11",
							"style": "HEADER",
							"_v": "Flatscreen Vision I"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_13_2",
							"colidx": 3,
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_13_3",
							"colidx": 4,
							"_v": ""
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_13_4",
							"colidx": 5,
							"_v": "24,598"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_13_5",
							"colidx": 6,
							"style": "TOTAL",
							"_v": "24,598"
						}
					} ]
				}
			}, {
				"row": {
					"rowidx": "15",
					"cells": [ {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_14_1",
							"colidx": 2,
							"key": "200301/SUMME",
							"style": "TOTAL",
							"_v": "Result"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_14_2",
							"colidx": 3,
							"style": "TOTAL",
							"_v": "67,002"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_14_3",
							"colidx": 4,
							"style": "TOTAL",
							"_v": "91,959"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_14_4",
							"colidx": 5,
							"style": "TOTAL",
							"_v": "90,528"
						}
					}, {
						"control": {
							"type": "xcell",
							"id": "CROSSTAB_1_ia_pt_14_5",
							"colidx": 6,
							"style": "TOTAL",
							"_v": "249,488"
						}
					} ]
				}
			} ]

};
