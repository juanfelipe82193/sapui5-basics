define("zen.rt.components/resources/js/messageview_m_handler", ["sap/zen/basehandler"], function(BaseHandler){
	
	sap.zen.MessageViewHandler = function() {
		"use strict";
	
		BaseHandler.apply(this, arguments);
		
		var dispatcher = BaseHandler.dispatcher;
	
		var that = this;
		
		sap.zen.MessageViewHandler.info = "INFO";
		sap.zen.MessageViewHandler.warning = "WARNING";
		sap.zen.MessageViewHandler.error = "ERROR";
		
		var mainMessageviewId = sap.zen.Dispatcher.instance.dshPrefix + "MESSAGE_messageview1";
		var footerBarId = sap.zen.Dispatcher.instance.dshPrefix + "FOOTERBAR_footerbar";
		var panelBodyId = sap.zen.Dispatcher.instance.dshPrefix + "PANEL_BODY_panel1";
		
		this.customSize;
		this.sLogCommand;
		this.oldMessagesAfterVarScreen = [];
		this.oMessageView;
		this.oFooter;
		
		/**
		 * Create Control
		 */
		this.createAndAdd = function (phxObj, controlData, componentData, fInsertIntoParentFunclet, iIndex) {
			var loControl = this.create(phxObj, controlData, componentData);
			if (fInsertIntoParentFunclet) {
				fInsertIntoParentFunclet(loControl, iIndex, componentData);
			}
			sap.zen.Dispatcher.instance.updateComponentProperties(loControl, componentData, fInsertIntoParentFunclet);
			return loControl;
		};
		
		this.create = function(oChainedControl, oControlProperties) {
			$.sap.require("sap.ui.core.IconPool");
			
			this.sLogCommand = oControlProperties.log_command;
			
			var lId = oControlProperties["id"];

			// destroy old Message Button
			var loOldMsgBtn = sap.ui.getCore().byId(lId);
			if (loOldMsgBtn) {
				loOldMsgBtn.destroy();
			}
			// create new Message Button
			var loMsgBtn = new sap.m.Button({
				id: lId,
				icon: sap.ui.core.IconPool.getIconURI("message-popup"),
				text: "{/count}",
				type: sap.m.ButtonType.Emphasized,
				press: function () {
					this.oMsgPopover.toggle(this);
				}
			});
			this.oMessageView = loMsgBtn;
			
			var loMessageTemplate = new sap.m.MessagePopoverItem({
			    type: '{type}',
			    title: '{title}',
			    description: '{description}'
			  });
	
			var that = this;
			var loHeaderButton = new sap.m.Button({
				icon: "sap-icon://delete",
				press: function () {
					loMsgBtn.oMsgPopover.getModel().setData([]);
					loMsgBtn.setVisible(false);
					that.updateFooterBar(loMsgBtn);
				}
			});
	
			loMsgBtn.oMsgPopover = new sap.m.MessagePopover({
			    items: {
			        path: '/',
			        template: loMessageTemplate
				},
				headerButton: loHeaderButton
			});
			
			this.updateFooterBar(loMsgBtn);
			
			if (!loMsgBtn.fSaveOnAfterRendering) {
				loMsgBtn.fSaveOnAfterRendering = loMsgBtn.onAfterRendering;
				loMsgBtn.onAfterRendering = function () {
					if (loMsgBtn.fSaveOnAfterRendering) {
						loMsgBtn.fSaveOnAfterRendering();
					}
					if (!instance.varScreenMode) {
						var oJqUi5BlockLayer = $('#sap-ui-blocklayer-popup');
						var jqMsgBtn = loMsgBtn.$();
						
						if (oJqUi5BlockLayer && oJqUi5BlockLayer.length > 0
								&& oJqUi5BlockLayer.css("visibility") === "visible" 
									&& oJqUi5BlockLayer.outerWidth() > 0 && oJqUi5BlockLayer.outerHeight() > 0) {
							
							var sZIndex = oJqUi5BlockLayer.css("z-index");
							if (sZIndex && sZIndex.length > 0) {
								var iZIndex = parseInt(sZIndex, 10);
								jqMsgBtn.css("z-index", "" + (iZIndex + 1));
							}
						} else {
							jqMsgBtn.css("z-index", "auto");
						}
					}
				};
			}
			
			this.init(loMsgBtn, oControlProperties);
			
			return loMsgBtn;
		};
		
		/**
		 * Update Control
		 */
		this.update = function(oControl, oControlProperties) {
			if (oControlProperties) {
				this.oMessageView = oControl;
				this.init(oControl, oControlProperties);
			}
		};
		
		/**
		 * Initialize (Create, Update)
		 */
		this.init = function (oMsgBtn, oControlProperties) {		
			var loModel, ltPreviousModelData = [];
			if (oMsgBtn.oMsgPopover) {
				loModel = oMsgBtn.oMsgPopover.getModel();
				if (loModel) {
					var loData = loModel.getData();
					if (loData) {
						ltPreviousModelData = loData;
					}
				}
			}
			
			var ltMessages = this.convertMessageFormatToUi5(ltPreviousModelData, oControlProperties);		
			if (oMsgBtn.oMsgPopover.getModel()) {
				oMsgBtn.oMsgPopover.getModel().setData(ltMessages);
			} else {
				loModel = new sap.ui.model.json.JSONModel();
				loModel.setData(ltMessages);
				oMsgBtn.oMsgPopover.setModel(loModel);
			}
			
			this.updateMessageView();
		};
		
		/**
		 * Convert Message Format to UI5
		 */
		this.convertMessageFormatToUi5 = function (tPreviousModelData, oControlProperties) {
			var ltMessages = tPreviousModelData;
			var ltOldMessages = oControlProperties.messages;
			
			if (ltOldMessages && ltOldMessages.length > 0) {
				for (var i = 0; i < ltOldMessages.length; i++) {
					var loOldMessage = ltOldMessages[i].message;
					var loNewMessage = {};
					if (loOldMessage.level === "ERROR") {
						loNewMessage.type = "Error";
					} else if (loOldMessage.level === "WARNING") {
						loNewMessage.type = "Warning";
					} else {
						loNewMessage.type = "Information";
					}
					loNewMessage.title = loOldMessage.short_text;
					loNewMessage.description = loOldMessage.long_text;
					
					ltMessages.push(loNewMessage);
				}
			} else {
				if (this.isHanaRuntime()) {
					// the message view in the "main app" is not removed when opening a var screen in the hana
					// runtime
					// therefore, no need to restore messages when closing the var screen
					if (ltMessages) {
						return ltMessages;
					} else {
						return []; // initial rendering
					}
				}
				
				if (sap.zen.MessageViewHandler.oldMessagesAfterVarScreen && !this.varScreenMode) {
					// restoring old messages is only necessary when not on the variable screen
					// this failed when opening a var screen without any messages on the var screen initially,
					// because it still showed the "main app" messages
					var result = sap.zen.MessageViewHandler.oldMessagesAfterVarScreen.slice();
					delete sap.zen.MessageViewHandler.oldMessagesAfterVarScreen;
					return result;
				}
				
				return []; //initial rendering
			}
			
			return ltMessages;
		};
		
		/**
		 * Is Hana Runtime
		 */
		this.isHanaRuntime = function(){
			if(typeof (DSH_deployment) !== "undefined"){
				return true;
			} else {
				return false;
			}
		};
		
		/**
		 * Update MessageView
		 */
		this.updateMessageView = function () {
			var lMessageCount = this.oMessageView.oMsgPopover.getModel().getData().length;
			this.oMessageView.setText(lMessageCount);
			this.oMessageView.setVisible((this.oMessageView.oMsgPopover.getModel().getData() && lMessageCount > 0));
			this.updateFooterBar(that.oMessageView);
		};

		/**
		 * Update FooterBar
		 */
		this.updateFooterBar = function (oMessageView) {
			if (mainMessageviewId !== oMessageView.getId()) {
				return;
			}
			
			var loFooter = sap.ui.getCore().byId(footerBarId);
			var loPanelBody = sap.ui.getCore().byId(panelBodyId);
			if (loFooter && loPanelBody) {
				var lVisible = oMessageView.getVisible();
				loFooter.setHeight(lVisible ? "40px" : "0px");
				var lPosition = loPanelBody.getPositions()[0];
				var lPositionBottom = lPosition.getBottom();
				if (lVisible && lPositionBottom !== "40px") {
					lPosition.setBottom("40px");
					loPanelBody.invalidate();
				}
				if (!lVisible && lPositionBottom !== "0px") {
					lPosition.setBottom("0px");
					loPanelBody.invalidate();
				}
			}
		};
		
		/**
		 * Remove
		 */
		var super_remove = this.remove;
		this.remove = function(oControl){
			if(oControl.oMsgPopover){
				oControl.oMsgPopover.destroy();
			}
			super_remove.apply(this,arguments);
		};
		
		/**
		 * Retrieve Highest Message Level
		 */
		this.getHighestMessageLevel = function(oModel){
			var ltMessages = oModel.getData();
			
			var lWarningFound = false;
			for(var i = 0; i < ltMessages.length; i++){
				var loMessage = ltMessages[i];
				if(loMessage.type === "Error"){
					return "message-error";
				}else if(loMessage.type === "Warning"){
					lWarningFound = true;
				}
			}
			
			if(lWarningFound){
				return "message-warning";
			}
			
			return "message-information";
		};
		
		/**
		 * Set Variable Screen
		 */
		sap.zen.MessageViewHandler.setVariableScreen = function(bMode){
			if(bMode){
				var loMsgBtn = sap.ui.getCore().byId(instance.oMessageView.getId())
				if(loMsgBtn){
					this.oldMessagesAfterVarScreen = loMsgBtn.oMsgPopover.getModel().getData();
				}
			}
			instance.varScreenMode = bMode;
		};
		
		/**
		 * Create Message
		 */
		sap.zen.MessageViewHandler.createMessage = function (sLevel, sShortText, sLongText, bLogMessage) {
			var loMsgBtn = this.oMessageView;
			if (!loMsgBtn) {
				return;
			}
			
			var loNewMessage = {};
			if (sLevel === "ERROR") {
				loNewMessage.type = "Error";
			} else if (sLevel === "WARNING") {
				loNewMessage.type = "Warning";
			} else {
				loNewMessage.type = "Information";
			}
			loNewMessage.title = sShortText;
			loNewMessage.description = sLongText;
			
			var loModel;
			if (loMsgBtn.oMsgPopover && loMsgBtn.oMsgPopover.getModel()) {
				loModel = loMsgBtn.oMsgPopover.getModel()
				loModel.setData([ loNewMessage ]);
			} else {
				loModel = new sap.ui.model.json.JSONModel();
				loModel.setData([ loNewMessage ]);
				loModel.oMsgPopover.setModel(oModel);
			}
			
			this.updateMessageView();
			
			if (bLogMessage) {
				this.logMessage(sLevel, sShortText, sLongText);
			}
		};
		
		/**
		 * Log Message
		 */
		sap.zen.MessageViewHandler.logMessage = function (sLevel, sShortText, sLongText) {
			if (this.sLogCommand) {
				var lsCommand = this.sLogCommand;
				lsCommand = sap.zen.Dispatcher.instance.prepareCommand(lsCommand, "__LEVEL__", sLevel);
				lsCommand = sap.zen.Dispatcher.instance.prepareCommand(lsCommand, "__SHORTTEXT__", sShortText);
				lsCommand = sap.zen.Dispatcher.instance.prepareCommand(lsCommand, "__LONGTEXT__", sLongText);
	
				var loFuncAction = new Function(lsCommand);
				loFuncAction();
			}
		};
		
		/**
		 * Clear Messages
		 */
		sap.zen.MessageViewHandler.clearMessages = function () {
			var loMsgBtn = this.oMessageView;
			if (loMsgBtn && loMsgBtn.oMsgPopover && loMsgBtn.oMsgPopover.getModel()) {
				var loModel = loMsgBtn.oMsgPopover.getModel()
				loModel.setData([]);
			}
		};
	}; // MessageView Handler
	
	var instance = new sap.zen.MessageViewHandler();
	sap.zen.Dispatcher.instance.addHandlers("messageview", instance);
	return instance;
});