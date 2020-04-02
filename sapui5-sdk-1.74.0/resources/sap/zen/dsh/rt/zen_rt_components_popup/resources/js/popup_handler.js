define("zen.rt.components.popup/resources/js/popup_handler", ["sap/zen/basehandler", "zen.rt.components.popup/resources/js/transitionhandler"], function(BaseHandler, transitions){	
	//TODO load transitionhandler vio require
	
	var PopupHandler = function() {
		"use strict";
	
		BaseHandler.apply(this, arguments);
		
		var dispatcher = BaseHandler.dispatcher;
		
		var
			baseDuration = 600,
			that = this
		;
		
		  
		function init(oAbsLayout, oControlProperties) {
			var aChildren = oControlProperties.content;
	
			if (aChildren) {
	
				that.updateChildren(aChildren, oAbsLayout, function (oNewControl, iIndex) {
					dispatcher.insertIntoAbsoluteLayoutContainer(oAbsLayout, oNewControl, iIndex);
				}, function (oControlToDelete) {
					oAbsLayout.removeContent(oControlToDelete);
				});
	
			}
		}
		
		function isAuto(sProperty) {
			return sProperty === undefined || sProperty === "auto";
		}
		
		this.createAndAdd = function (oChainedControl, oControlProperties, oComponentProperties, fAppendToParentFunclet, iIndex) {
			jQuery.sap.require("sap.ui.core.Popup");
			var 
				store = null,
				properties = {},
				oAbsLayout,
				oText
			;
			
			if(sap.zen.designmode) {
				oAbsLayout = this.createAbsoluteLayout(oControlProperties["id"]);
				properties.isAbsLayout = true;
				oAbsLayout.oPopupProperties = properties;
				
				fAppendToParentFunclet(oAbsLayout, iIndex);
				sap.zen.Dispatcher.instance.updateComponentProperties(oAbsLayout, oComponentProperties);
				
				init(oAbsLayout, oControlProperties);
				
				oAbsLayout.addStyleClass("popup");
				
				return oAbsLayout;
			}
			else {
				oAbsLayout = this.createAbsoluteLayout(oControlProperties["id"] + "_abs");
				oAbsLayout.zenControlType = oControlProperties.type;
				oAbsLayout.zenPopupHackId = oControlProperties["id"];
				
				oText = this.createDefaultProxy(oControlProperties["id"]);
				oText.oCommand = oControlProperties.command;
				oText.zenPopupHackId = oControlProperties["id"] + "_abs";
				
				properties.oAbsLayout = oAbsLayout;
				properties.isAbsLayout = false;
				store = jQuery.extend({}, oComponentProperties);
				properties.positioner = new Positioning(store);
				
				oText.oPopupProperties = properties;
	
				properties.positioner.calculateDimensions(oComponentProperties);
				properties.positioner.setInvisible(oComponentProperties);
				
				fAppendToParentFunclet(oAbsLayout, iIndex);
				sap.zen.Dispatcher.instance.updateComponentProperties(oAbsLayout, oComponentProperties);
				
				init(oAbsLayout, oControlProperties);
				
				if (oControlProperties.show) {
					setTimeout(function(){
						oComponentProperties.leftmargin = store.leftmargin; 
						oComponentProperties.rightmargin = store.rightmargin; 
						that.update(oText, oControlProperties, oComponentProperties, fAppendToParentFunclet, iIndex);
					}, 50);
				}
				
				return oText;
			}
		};
		
		this.update = function(oControl, oControlProperties, oComponentProperties) {
			var 
				oPopupProperties = oControl.oPopupProperties,
				oAbsLayout =  oPopupProperties.isAbsLayout ? oControl : oPopupProperties.oAbsLayout
			;
	
			oControlProperties = oControlProperties || {};
			init(oAbsLayout, oControlProperties);
			
			if(!sap.zen.designmode && oControlProperties.hasOwnProperty("show")) {
				if (oControlProperties.show) {
					oPopupProperties.positioner.calculateDimensions(oComponentProperties);
					if(oComponentProperties.width > 0 && oComponentProperties.height > 0) {
						var nearbyControl = null;	// is out in 1.0
						if (oControlProperties.cid) {
							nearbyControl = dispatcher.getRootControlForComponentId(oControlProperties.cid);
						}
						this.show(oControl, oControlProperties, oComponentProperties, nearbyControl, oAbsLayout);
					}
				}
				else { 
					if(oControl.oPopup && oControl.oPopup.isOpen()) {
						if(oControlProperties.animation.toLowerCase() === "slidevertical" 
						   && ! isAuto(oComponentProperties.bottommargin)
						   && isAuto(oComponentProperties.topmargin)
						   && oControl.oPopup.getOpenState() === "OPENING") {
							setTimeout(function(){
								that.hide(oControl);
							}, baseDuration * 1.5);
						}
						else {
							this.hide(oControl);
						}
					}
					else if(!oControl.hasOwnProperty("oPopup") && !sap.zen.designmode){	// initial hide before show
						oPopupProperties.positioner.setInvisible(oComponentProperties);
					}
				}
				oControl.setVisible(false);
	
				
			}
			
			return oControl;
		};
		
		var super_remove = this.remove;
		this.remove = function(oControl) {
			super_remove.call(this, oControl);
			if(oControl.zenPopupHackId) {
				var oPopup = sap.ui.getCore().byId(oControl.zenPopupHackId);
				if(oPopup) {
					sap.zen.Dispatcher.instance.dispatchRemove(oPopup);
				}
			}
		};
		
		// ================= Method interface =================
		this.show = function(oControl, oControlProperties, oComponentProperties, nearbyControl, oAbsLayout) {
			var 
				animationHandler
			;
			
			nearbyControl = nearbyControl || null;
			
			if(!oControl.oPopup) {
				this.createPopup(oControl, oControlProperties, oAbsLayout);
			}
			else if(oControl.oPopup.isOpen()) {
				return;
			}
	
			animationHandler = this.configureTransitions(oControl, oControlProperties);
			animationHandler && animationHandler.preOperations({
				oComponentProperties: oComponentProperties,
				oAbsLayout: oControl
			});
			oControl.oPopupProperties["duration"] = animationHandler.getDuration() || baseDuration;
			oControl.oPopup.open(oControl.oPopupProperties["duration"]);
			
			animationHandler && animationHandler.postOperations({
				oComponentProperties: oComponentProperties,
				oAbsLayout: oControl
			});
			
		};
		
		this.hide = function(oControl) {
			oControl && oControl.oPopup && oControl.oPopup.close(oControl.oPopupProperties["duration"]);
		};
		
		// ================= Method interface helper =================
		this.createPopup = function(oControl, oControlProperties, oAbsLayout) {
			if(oControlProperties.modal) {
				oControlProperties.autoclose = false;
			}
			
			oControl.oPopup = 
				new sap.ui.core.Popup(oAbsLayout, 					// content
									!!oControlProperties.modal, 	// modality
									true, 							// shadow
									!!oControlProperties.autoclose	// autoclose
									);
			
			//Cleanup the popup as well, since we hack it in we must hack it out.
			var fAbsDestroy = oAbsLayout.destroy;
						
			oAbsLayout.destroy = function(suppress) {
				if (this.zenPopupHackId) {
					var c = sap.ui.getCore().byId(this.zenPopupHackId);
					if(c){
						var oPopup = c.oPopup;
						if (oPopup && oPopup.destroy) {
							oPopup.destroy(suppress);
						}			
					}
				}
				if (fAbsDestroy) {
					fAbsDestroy.call(oAbsLayout, suppress);
				}

			}		
			
			oControl.oPopup.attachClosed(function() {
				that.freeResources(oControl);
			});
		};
		
		this.freeResources = function(oControl) {
			
			if(oControl.oCommand) {
				var command = that.prepareCommand(oControl.oCommand,"__VALUE__", "false");
				eval(command);
			}
	
			if(oControl && oControl.oPopup) {
				oControl.oPopup.destroy();
				oControl.oPopup = null;
			}
		};
		
		// ================= Animation handling =================
		var transitionHandler = {};
	
		this.registerTransitionHandler = function(transitionName, oTransitionHandler) {
			transitionHandler[transitionName] = oTransitionHandler;
		};
	
		this.getTransitionHandler = function(transitionName, positioner) {
			//IE can't handle transitions, and with the UI5 control the moving ones are problematic.  So just fade.
			if(transitionName !== "none" && (jQuery.browser.msie || !document.getElementById("ROOT_absolutelayout"))) { 
				return new transitionHandler["fade"](positioner);
			}
			return new transitionHandler[transitionName](positioner);
		};
		
		this.configureTransitions = function(oControl, oControlProperties) {
			var 
				handler = this.getTransitionHandler(oControlProperties.animation.toLowerCase(), oControl.oPopupProperties.positioner) 
			;
			oControl.oPopup.setAnimations(handler.open, handler.close);
	
			return handler;
		};
	
		
		// ================= Container handling =================
		
		this.applyForChildren = function(absLayout, funclet) {
			if (!absLayout.getPositions) {
				return null;
			}
			var positionContainers = absLayout.getPositions();
			for ( var i = 0; i < positionContainers.length; i++) {
				var oControl = positionContainers[i].getControl();
				if (oControl) {
					var result = funclet(oControl);
					if (result)
						return result;
				}
			}
			return null;
		};
		
		this.getDefaultProxyClass = function(){
			return ["sap.m.Text", "sap.ui.commons.TextView"];
		}
		
		this.getDecorator = function() {
			return "PopupDecorator";
		};
		
		this.getType = function() {
			return "popup";
		};
		
	};
	
	var Positioning = function () {
		var
			defaultOffset = "13 -10",
			startPositionFallback = 1000
		;
		
		this.store = arguments[0] || {};
		this.dockingPosition = null;
		
		function isAuto(sProperty) {
			return sProperty === undefined || sProperty === "auto";
		}

		this.getComponentProperties = function() {
			return this.store;
		}
		this.calculateRedocking = function(ref) {
			var 
				deltaWidth = Math.round(ref.outerWidth()-ref.width()),
				deltaHeight = Math.round(ref.outerHeight()-ref.height()),
				dockingPosition = {
					top: "auto",
					bottom: "auto",
					left: "auto",
					right: "auto"
				}
			;
			
			if(! isAuto( this.store.bottommargin)) {
				if(! isAuto(this.store.topmargin)) {
					dockingPosition.bottom = (this.store.bottommargin - deltaHeight) + "px";
				}
				else {
					dockingPosition.bottom = this.store.bottommargin + "px";
				}
			}
			if(! isAuto(this.store.topmargin)) {
				dockingPosition.top = this.store.topmargin + "px";
			}
			if(! isAuto(this.store.leftmargin)) {
				dockingPosition.left = this.store.leftmargin + "px";
			}
			if(! isAuto(this.store.rightmargin)) {
				if(! isAuto(this.store.leftmargin)) {
					dockingPosition.right = (this.store.rightmargin - deltaWidth) + "px";
				}
				else {
					dockingPosition.right = this.store.rightmargin + "px";
				}
			}
			return this.dockingPosition = dockingPosition;
		};

		this.getDockingPosition = function() {
			return this.dockingPosition;
		}
		
		/*
		 * Recalculate dimensions when width and/or height are not set.
		 */
		this.calculateDimensions = function(oComponentProperties) {
			var jqBody = $("body");
			var 
				viewportWidth = jqBody.width(),
				viewportHeight = jqBody.height()
			;
			
			if(isAuto(oComponentProperties.width)) {
				oComponentProperties.width = viewportWidth - parseInt(oComponentProperties.leftmargin)
													 - parseInt(oComponentProperties.rightmargin);
				oComponentProperties.rightmargin = "auto";
			}
			if(isAuto(oComponentProperties.height)) {
				oComponentProperties.height = viewportHeight - parseInt(oComponentProperties.topmargin)
													   - parseInt(oComponentProperties.bottommargin);
				oComponentProperties.bottommargin = "auto";
			}
		};

		/*
		 * Prepare positioning information according to sapui5-popup.setPosition semantics
		 * return: positionObject
		 */
		this.calculatePosition = function(oComponentProperties, nearbyControl) {
			var 
				popupDock,
				viewportDock,
				horizontalGap,
				verticalGap
			;
			
			if(! isAuto(oComponentProperties.leftmargin)) {
				horizontalGap = parseInt(oComponentProperties.leftmargin);
				if(! isAuto(oComponentProperties.topmargin)) {
					verticalGap = parseInt(oComponentProperties.topmargin);
					popupDock = viewportDock = sap.ui.core.Popup.Dock.LeftTop;
				}
				else {
					verticalGap = parseInt(oComponentProperties.bottommargin) * -1;
					popupDock = viewportDock = sap.ui.core.Popup.Dock.LeftBottom;
				}
			}
			else if(!isAuto(oComponentProperties.rightmargin)) {
				horizontalGap = parseInt(oComponentProperties.rightmargin) * -1;
				if(!isAuto(oComponentProperties.bottommargin)) {
					verticalGap = parseInt(oComponentProperties.bottommargin) * -1;
					popupDock = viewportDock = sap.ui.core.Popup.Dock.RightBottom;
				}
				else {
					verticalGap = parseInt(oComponentProperties.topmargin);
					popupDock = viewportDock = sap.ui.core.Popup.Dock.RightTop;
				}
			}
			
			return {
					my: 		nearbyControl ? sap.ui.core.Popup.Dock.LeftTop : popupDock,
					at:			nearbyControl ? sap.ui.core.Popup.Dock.RightTop : viewportDock,
					of:			document,
					offset:		nearbyControl ? defaultOffset : horizontalGap 
													+ " " 
													+ verticalGap,
					collision: 	"none"
			};
		};
		
		this.setInvisible = function(oComponentProperties) {
			if(!isAuto(oComponentProperties.leftmargin)) {
				oComponentProperties.leftmargin = "-5000";
			}
			else if(!isAuto(oComponentProperties.rightmargin)) {
				oComponentProperties.rightmargin = "5000";
			}
		};
		
	    this.getHorizontalOffset = function(oComponentProperties) {
	    	var 
	    		offset
	    	;
	    	
			if(!isAuto(oComponentProperties.leftmargin) ) {
				offset = parseInt(oComponentProperties.width)
		         ? (-parseInt(oComponentProperties.width) - 10)
		         : -startPositionFallback;
				if(!isAuto(oComponentProperties.topmargin)) {
					offset += " " 
					      + parseInt(oComponentProperties.topmargin);
				}
				else {
					offset += " " 
					      + (parseInt(oComponentProperties.bottommargin)*-1);
				}
			}
			else if(! isAuto(oComponentProperties.rightmargin)) {
				offset = parseInt(oComponentProperties.width)
		         ? (parseInt(oComponentProperties.width) + 10)
		         : startPositionFallback;
				if(! isAuto(oComponentProperties.topmargin)) {
					offset += " " 
					      + parseInt(oComponentProperties.topmargin);
				}
				else {
					offset += " " 
					      + (parseInt(oComponentProperties.bottommargin)*-1);
				}
			}
			return offset;
	    };

	    this.getVerticalOffset = function(oComponentProperties) {
	    	var 
	    		offset
	    	;
	    	
			if(!isAuto(oComponentProperties.topmargin) ) {
				offset = parseInt(oComponentProperties.height)
		         ? (-parseInt(oComponentProperties.height) - 10)
		         : -startPositionFallback;
				
				if(!isAuto(oComponentProperties.leftmargin)) {
					offset = parseInt(oComponentProperties.leftmargin) 
					         + " "
					         + offset;
				}
				else {
					offset = (parseInt(oComponentProperties.rightmargin)*-1)
							+ " "
							+ offset;
				}
			}
			else if(!isAuto(oComponentProperties.bottommargin) ) {
				offset = parseInt(oComponentProperties.height)
		         ? (parseInt(oComponentProperties.height) + 10)
		         : startPositionFallback;
				if(! isAuto(oComponentProperties.leftmargin) ) {
					offset = parseInt(oComponentProperties.leftmargin)
							+ " "
							+ offset;
				}
				else {
					offset = (parseInt(oComponentProperties.rightmargin)*-1)
							+ " "
							+ offset;
				}
			}
			return offset;
	    };
	    
	    
	    
	};	
	
	
	var handler = new PopupHandler();
	
	for (var i=0; i<transitions.length; i++) {
		var transition =  transitions[i];
		handler.registerTransitionHandler(new transition().getType(), transition);
	}

	
	return handler;
	
});
