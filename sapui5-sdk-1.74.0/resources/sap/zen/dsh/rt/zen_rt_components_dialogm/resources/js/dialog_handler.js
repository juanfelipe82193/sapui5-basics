define("zen.rt.components.dialogm/resources/js/dialog_handler", ["sap/zen/basehandler"], function(BaseHandler){

	var DialogHandler = function() {
		"use strict";

		BaseHandler.apply(this, arguments);

		var dispatcher = BaseHandler.dispatcher;

		var that = this;
		
		/**
		 * Create Control
		 */
		this.createAndAdd = function(chainedControl, oControlProperties, oComponentProperties, fAppendToParentFunclet, oArgForFunclet) {
			if(sap.zen.designmode) {
				//force center rendering/fullscreen
				if (oComponentProperties.width){
					this._componentWidth = oComponentProperties.width;
				}			
				if (oComponentProperties.height){
					this._componentHeight = oComponentProperties.height;
				}		
				oComponentProperties.leftmargin = oControlProperties.fullscreen ? 0 : (Math.floor(jQuery(document).width()/2 - oComponentProperties.width/2));
				oComponentProperties.topmargin = oControlProperties.fullscreen ? 0 : (Math.floor(jQuery(document).height()/2 - oComponentProperties.height/2));		
				if (oControlProperties.fullscreen){
					oComponentProperties.width = jQuery(document).width();
					oComponentProperties.height = jQuery(document).height();
				}
				
				var loAbsLayout = this.createAbsoluteLayout();
				loAbsLayout.addStyleClass("uidialogzenroot");
				loAbsLayout.oDialogProperties = { 
						isAbsLayout: true };
				loAbsLayout.titleArea = this.createTitleAreaForDesignMode(this.oAbsLayout, oControlProperties);
				loAbsLayout.contentArea = this.createContentAreaForDesignMode(this.oAbsLayout, oControlProperties);
				loAbsLayout.footerArea = this.createFooterAreForDesignModea(this.oAbsLayout, oControlProperties);
				
				fAppendToParentFunclet(loAbsLayout, oArgForFunclet);
				sap.zen.Dispatcher.instance.updateComponentProperties(loAbsLayout, oComponentProperties);
				
				this.init(loAbsLayout, oControlProperties, oComponentProperties);
				
				loAbsLayout.fnOrigAfterRendering = loAbsLayout.onAfterRendering;
				loAbsLayout.onAfterRendering = function(){
					if (this.fnOrigAfterRendering) {
						this.fnOrigAfterRendering();
					}
					var that = this;
					setTimeout(function(){
						if(that.footerArea){
							var ltPositions = that.footerArea.getPositions();
							var lRight = 0;
							for(var i = ltPositions.length-1; i>=0; i--){
								var loPosition = ltPositions[i];
								loPosition.updatePosition({"right":right+"px","top":"0px"});
								lRight += loPosition.$().width();
							}
						}
					},50);
				};
				loAbsLayout.onAfterRendering();
				
				return loAbsLayout;
			} else {
				var loControl = this.createDefaultProxy(oControlProperties["id"]);
				loControl.oDialogProperties = { 
						isAbsLayout : false,
						oComponentProperties : null,
						oProperties : null,
						tDialogContent : [],
						oMsgComponent : null,
						oMsgControl : null };
				fAppendToParentFunclet(loControl, oArgForFunclet);
				
				this.init(loControl, oControlProperties, oComponentProperties);
				
				return loControl;
			}	
		};
		
		/**
		 * Update Control
		 */
		this.update = function(oControl, oControlProperties, oComponentProperties) {
			oControlProperties = oControlProperties || {};
					
			if(oComponentProperties.width){
				this._componentWidth = oComponentProperties.width;
			}
			if(oComponentProperties.height){
				this._componentHeight = oComponentProperties.height;
			}
			
			// force center rendering or fullscreen rendering
			var _w = oComponentProperties.width ? oComponentProperties.width : this._componentWidth;
			var _h = oComponentProperties.height ? oComponentProperties.height : this._componentHeight;
			var _lMarginDelta = Math.floor(jQuery(document).width()/2-_w/2);
			var _tMarginDelta = Math.floor(jQuery(document).height()/2-_h/2);
			oComponentProperties.leftmargin = oControlProperties.fullscreen ? 1 : _lMarginDelta;
			oComponentProperties.topmargin = oControlProperties.fullscreen ? 1 : _tMarginDelta;
			
			if(oControlProperties.fullscreen){
				oComponentProperties.width = jQuery(document).width();
				oComponentProperties.height = jQuery(document).height();
			}
			
			this.init(oControl, oControlProperties, oComponentProperties);
			
			if (sap.zen.designmode || !oControlProperties.hasOwnProperty("show")) {
				var loAbsLayout = oControl.oDialogProperties.isAbsLayout ? oControl : oControl.oDialogProperties.oAbsLayout;
				if (loAbsLayout) {
					loAbsLayout.onAfterRendering();
				}
			}
			
			return oControl;
		};
		
		/**
		 * Initialize (Create, Update)
		 */
		this.init = function(oControl, oControlProperties, oComponentProperties) {
			if (sap.zen.designmode) {
				var loModelButton, loButton;
				if(oControl.footerArea && oControlProperties.Buttons){
					oControl.footerArea.removeAllContent();
					
					for (var i in oControlProperties.Buttons){
						loModelButton = oControlProperties.Buttons[i].Button;
						
						loButton = new sap.m.Button({
							text: loModelButton.text,
							enabled: loModelButton.buttonenabled==="X",
							visible: loModelButton.buttonvisible==="X"
						});
						
						oControl.footerArea.addContent(loButton,{"top":"-1000px"});
					}
				}
				
				if (oControl.titleArea && oControlProperties.title){
					oControl.titleArea.removeAllContent();
					var lTitle = this.createTextView( { text : oControlProperties.title } );
					lTitle && oControl.titleArea.addContent(lTitle);
				}
				
				if (oControlProperties.content){
					var loAbsLayout = oControl.contentArea;
					var ltChildren = oControlProperties.content;
					this.updateChildren(ltChildren, loAbsLayout, 
							function(oNewControl, index) {
								dispatcher.insertIntoAbsoluteLayoutContainer(loAbsLayout, oNewControl, index);
							}, 
							function(oControlToRemove) {
								loAbsLayout.removeContent(oControlToRemove);
							}
						);
				}
			} else {
				// retrieve Dialog Properties (e.g. Dialog Content, MsgComponent, Component & Control Properties)
				this.extractDialogProperties(oControl, oControlProperties, oComponentProperties);
				
				// initialize (create/update) the Dialog
				this.initDialog(oControl);
			}				
		};
		
		/*
		 * >>> DesignMode Functions
		 */
		if (sap.zen.designmode){
			sap.zen.designmode.DialogContainerDecorator = function (decoratorManager, phxControl, oHandler){
				"use strict";
				
				sap.zen.designmode.AbsLayoutDecorator.apply(this, arguments);

				this._debugInfo = "DialogContainerDecorator";
				var decoratorInstance = this;
				
				function foreachChild(callback){
					var aChildren = oHandler.getAllChildren(phxControl,true);
					for ( var sChildId in aChildren) {
						var oChildDecorator = decoratorManager.getDecorator(aChildren[sChildId].o);
						if(oChildDecorator) {
							callback(oChildDecorator);
						}
					}
				};
				
				function calcNewPosition(jqChild,jqParent){
					var result = {};
					var curPos = jqChild.position();
					var _pos = jqParent.position();
					if(this.origPos){
						var lDelta = this.origPos.left - curPos.left;
						var newLeft = lDelta + (_pos.left);
						result["left"] = newLeft+"px";
						
						var tDelta = this.origPos.top - curPos.top;
						var newTop = tDelta + (_pos.top);
						result["top"] = newTop+"px";
					}
					return result;
				};

				var super_create = this.create;
				var super_update = this.update;
				
				this.create = function () {
					super_create.apply(this, arguments);
				};
				
				this.moveBegin = function(){
					sap.zen.designmode.DecoratorManager.instance.abortMove();
					this.origPos = this.jqDecorator.position();
				};
				
				this.moveEnd = function(){
					foreachChild(function (oChildDecorator) {
						if (oChildDecorator) {
							var pos = calcNewPosition.bind(decoratorInstance,oChildDecorator.$(),decoratorInstance.jqDecorator)();
							oChildDecorator.$().css(pos);
						}
					});
				};
				
				this.update = function(){
					super_update.apply(this,arguments);
				};
				
				this.getDockingVisualizers = function () {
			          return {};
			    };
			};
		}

		this.createTitleAreaForDesignMode = function(oParent){
			var loTitleArea = this.createAbsoluteLayout();
			loTitleArea.addStyleClass("uidialogzentitle");
			oParent.insertContent(loTitleArea,0);
			return loTitleArea;
		};
		
		this.createFooterAreaForDesignMode = function(oParent){
			var loFooterArea = this.createAbsoluteLayout();
			loFooterArea.addStyleClass("uidialogzenfooter sapMFooter-CTX");
			oParent.insertContent(loFooterArea, 2, {"bottom":"0px","left":"0px"});
			return loFooterArea;
		};
		
		this.createContentAreaForDesignMode = function(oParent){
			var loContentArea = this.createAbsoluteLayout();
			loContentArea.addStyleClass("uidialogzencontent");
			oParent.insertContent(loContentArea, 1, {"top":"2.5rem"});
			return loContentArea;
		};
		/*
		 * <<< DesignMode Functions
		 */
		
		/*
		 * >>> RuntimeMode Functions
		 */
		/**
		 * Retrieve Dialog Properties relevant for the current Control: 
		 * 		Dialog Content
		 * 		MsgComponent
		 * 		Component Properties
		 * 		Control Properties
		 */
		this.extractDialogProperties = function(oControl, oControlProperties, oComponentProperties) {
			oControl.oDialogProperties.oComponentProperties = oComponentProperties;
			oControl.oDialogProperties.oProperties = oControlProperties;
			oControl.oDialogProperties.oMsgComponent = null;
			oControl.oDialogProperties.tDialogContent = [];
			
			if (oControlProperties.content && oControlProperties.content.length > 0) {
				for (var i = 0; i < oControlProperties.content.length; i++) {
					var loContent = oControlProperties.content[i];
					if (loContent && loContent.component) {
						if (loContent.component.type === "MESSAGEVIEW_COMPONENT" && !oControl.oDialogProperties.oMsgComponent) {
							oControl.oDialogProperties.oMsgComponent = loContent.component;
						} else {
							oControl.oDialogProperties.tDialogContent.push(loContent);
						}
					}
				}
			}
		};
		
		/**
		 * Initialize Dialog
		 * 		Processing is only required if Dialog is to be opened
		 * 		The Dialog is created on demand
		 * 		Update the Dialog (Properties, Message, Content, Buttons)
		 */
		this.initDialog = function(oControl) {
			if (!oControl || !oControl.oDialogProperties || !oControl.oDialogProperties.oProperties) {
				return;
			}
			
			var loProperties = oControl.oDialogProperties.oProperties;
			
			var lShowDialog = loProperties.hasOwnProperty("show") && loProperties.show;
			
			// create Dialog
			if (!oControl.oDialog) {
				if (lShowDialog) {
					jQuery.sap.require("sap.m.Dialog");
					
					oControl.oDialog = new sap.m.Dialog(
							oControl.getId() + "_dlg", 
							{
								stretch: loProperties.fullscreen,
								resizable: loProperties.resizable,
								draggable: loProperties.draggable
							});

					//workaround for the fact that in Fiori it seems to be unpadded, which doesn't match our behaviour in the Java RT.
					//So with this, the 2 should be the same...  with padding.
					oControl.oDialog.attachAfterClose(this.dialogCallbackOnAfterClose(oControl));
				}
			}
			
			// update Dialog
			if (oControl.oDialog) {			
				if (loProperties.title){
					oControl.oDialog.setTitle(loProperties.title);
				}

				// handle Dialog Message component
				this.initDialogMessage(oControl);
				
				// update Dialog Content
				this.initDialogContent(oControl);
				
				// update Dialog Buttons
				this.initDialogButtons(oControl);
				
				// show/hide Dialog
				if (lShowDialog) {
					this.showDialog(oControl);
				} else {
					this.hideDialog(oControl);
				}
			}
		};
		
		/**
		 * Initialize Dialog Message
		 * 		Message Component and its Control must be created or updated
		 */
		this.initDialogMessage = function(oControl) {
			if (!oControl || !oControl.oDialogProperties) {
				return;
			}
			
			if (oControl.oDialogProperties.oMsgComponent) {
				var lIsNew = dispatcher.getComponentIdForControlId(oControl.oDialogProperties.oMsgComponent.content.control.id) == null;
				if (lIsNew) {
					oControl.oDialogProperties.oMsgControl = dispatcher.dispatchCreateControl(oControl.oDialogProperties.oMsgComponent);					
				} else {
					dispatcher.dispatchUpdateControl(oControl.oDialogProperties.oMsgComponent);
					dispatcher.updateComponentProperties(oControl.oDialogProperties.oMsgControl, oControl.oDialogProperties.oMsgComponent);
				}
			}
		}
		
		/**
		 * Initialize Dialog Content
		 * 		Dialog Content is an AbsolueLayout container
		 * 		The AbsolueLayout container contains the control items defined in the Dialog Component
		 * 		All control items must be added/removed accordingly from the AbsoluteLayout container
		 */
		this.initDialogContent = function(oControl) {
			if (!oControl || !oControl.oDialog || !oControl.oDialogProperties) {
				return;
			}
			
			var loAbsLayout = null;
			
			// create absolute layout
			var loAbsLayout = sap.ui.getCore().byId(oControl.getId() + "_abslayout");
			if (!loAbsLayout) {
				loAbsLayout = this.createAbsoluteLayout(oControl.getId() + "_abslayout");
				loAbsLayout.zenControlType = "absolutelayout";
				loAbsLayout.setVisible(false);
				loAbsLayout.onAfterRendering = this.dialogCallbackOnAfterRendering(loAbsLayout, oControl);
			}
			
			// handle absolute layout
			dispatcher.updateComponentProperties(loAbsLayout, oControl.oDialogProperties.oComponentProperties);
			
			// handle absolute layout content
			this.updateChildren(oControl.oDialogProperties.tDialogContent, loAbsLayout, 
					function(oNewControl, index) {
						dispatcher.insertIntoAbsoluteLayoutContainer(loAbsLayout, oNewControl, index);
					}, 
					function(oControlToRemove) {
						loAbsLayout.removeContent(oControlToRemove);
					}
				);
			
			// update Dialog content
			loAbsLayout.setVisible(true);
			if (oControl.oDialogProperties.oProperties.fullscreen){
				loAbsLayout.setWidth("100%");
			}
				
			oControl.oDialog.removeAllContent();
			oControl.oDialog.insertContent(loAbsLayout, 0);
		};
		
		/**
		 * Initialize Dialog Buttons
		 * 		remove all Dialog buttons and add buttons defined for the Control
		 */
		this.initDialogButtons = function(oControl) {
			if (!oControl || !oControl.oDialog || !oControl.oDialogProperties || !oControl.oDialogProperties.oProperties) {
				return;
			}
			
			var loProperties = oControl.oDialogProperties.oProperties;
			
			if(loProperties.Buttons && loProperties.Buttons.length){
				oControl.oDialog.removeAllButtons();
				
				for (var i in loProperties.Buttons){
					var loModelButton = loProperties.Buttons[i].Button;
					
					var loButton = this.createButton(loModelButton.name);
					loButton.setText(loModelButton.text);
					loButton.setEnabled(loModelButton.buttonenabled==="X");
					loButton.setVisible(loModelButton.buttonvisible==="X");
					
					if (loModelButton.onclick) {
						(function(script){
							loButton.attachPress(function () {
								var loFunction = new Function(script);
								loFunction();
							});
						})(loModelButton.onclick);
					} else {
						loButton.setEnabled(false);
					}
					
					oControl.oDialog.addButton(loButton);
				}
			}
		};
		
		/**
		 * Initialize Dialog Footer
		 * 		handle the Dialog Footer by adding the message control to it
		 */
		this.initDialogFooter = function(oControl) {
			if (!oControl || !oControl.oDialog || !oControl.oDialogProperties.oMsgControl) {
				return;
			}
			
			var loDialogFooter = sap.ui.getCore().byId(oControl.oDialog.getId() + "-footer");
			if (!loDialogFooter) {
				return;
			}

			var loMsgControl = oControl.oDialogProperties.oMsgControl;
			
			// add message control to Dialog Footer
			var ltFooterContent = [];
			ltFooterContent.push(loMsgControl);
			
			var ltContent = loDialogFooter.getContent();
			if (ltContent) {
				for (var i = 0; i < ltContent.length; i++) {
					var loContent = ltContent[i];
					if (loContent && loContent !== loMsgControl) {
						ltFooterContent.push(loContent);
					}
				}
			}
				
			loDialogFooter.removeAllContent();
			for (var i = 0; i < ltFooterContent.length; i++) {
				var loContent = ltFooterContent[i];
				if (loContent) {
					loDialogFooter.addContent(loContent);
				}
			}
		};
		
		/**
		 * Show Dialog
		 * 		ensure Dialog is open
		 */
		this.showDialog = function(oControl) {
			if (!oControl || !oControl.oDialog) {
				return;
			}
	
			if (!oControl.oDialog.isOpen()) {
				oControl.oDialog.open();
			}
		};
		
		/**
		 * Hide Dialog
		 * 		ensure Dialog is closed
		 */
		this.hideDialog = function(oControl){
			if (!oControl || !oControl.oDialog) {
				return;
			}
			
			if (oControl.oDialog.isOpen()) {
				oControl.oDialog.close();
			}
		};
		
		/**
		 * Dialog Handler: OnAfterClose
		 */
		this.dialogCallbackOnAfterClose = function(oControl) {
			var that = this;
			return function() {
				oControl.oDialog = null;
				
				this.removeAllButtons(); // theoretically it should then not destroy our Message Control
				this.removeAllContent(); // theoretically it should then not destroy our AbsoluteLayout
				this.destroy(); // now we destroy the dialog and all of its content
				
				
				var loMsgControl = sap.ui.getCore().byId(oControl.oDialogProperties.oMsgControl.getId());
				if (!loMsgControl) { // dialog also destroyed our Message Control
					// remove Message Control from Dispatcher so that it can be created again
					dispatcher.dispatchRemove(oControl.oDialogProperties.oMsgControl);
				}
			
				if (oControl.oDialogProperties.oProperties.command) {
					eval(oControl.oDialogProperties.oProperties.command);
				}
			}
		}
		
		/**
		 * AbsoluteLayout Handler: onAfterRendering
		 */
		this.dialogCallbackOnAfterRendering = function(oOwner, oControl) {
			oOwner.fOrigOnAfterRendering = oOwner.onAfterRendering;
			
			var that = this;
			return function() {
				if (this.fOrigOnAfterRendering) {
					this.fOrigOnAfterRendering();
				}
			
				that.initDialogFooter(oControl);
			}
		}
		/*
		 * <<< RuntimeMode Functions
		 */
		
		this.fnOrigRemove = this.remove;
		this.remove = function(oControl){
			if(this.fnOrigRemove && sap.zen.designmode.DecoratorManager.instance.getDecorator(oControl)){
				this.fnOrigRemove.apply(this, oControl);
			}
		};

		this.applyForChildren = function(oAbsLayout, funclet) {
			if (!oAbsLayout.getPositions) {
				return null;
			}
			
			var ltPositions = oAbsLayout.getPositions();
			for (var i=0; i< ltPositions.length; i++) {
				var loControl = ltPositions[i].getControl();
				if (loControl) {
					var loResult = funclet(loControl);
					if (loResult)
						return loResult;
				}
			}
			
			return null;
		};
		
		// ================= Container handling =================

		this.getDefaultProxyClass = function(){
			return ["sap.m.Text"];
		};

		this.getType = function() {
			return "dialog";
		};
		
		this.getDecorator = function(){
			return "DialogContainerDecorator";
		};
		
		this.fnOrigGetAllChildren = this.getAllChildren;
		this.getAllChildren = function(oControl, isOwner){
			if(isOwner){
				var oResult = {}, lIndex = 0;
				
				for (var lPosition in oControl.getPositions()){
					var ltPositions = oControl.getPositions()[lPosition].getControl().getPositions();
					ltPositions.map(function(oPosition){
						var loControl = oPosition.getControl();
						if(loControl){
							var lComponentId = dispatcher.getComponentIdForControl(loControl);
							if (lComponentId) {
								oResult[lComponentId] = {
									i: lIndex,
									o: loControl
								};
								lIndex++;
							}
						}
					});
				}
				
				return oResult;
			} else{
				if(this.fnOrigGetAllChildren){
					return this.fnOrigGetAllChildren.apply(this,arguments);
				}
			}
		};
	}; // DialogHandler

	return new DialogHandler();
});