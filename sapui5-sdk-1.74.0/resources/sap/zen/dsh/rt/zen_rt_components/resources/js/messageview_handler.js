define("zen.rt.components/resources/js/messageview_handler", ["sap/zen/basehandler"], function(BaseHandler){
	"use strict";
	

sap.zen.MessageViewHandler = function () {
	"use strict";

	BaseHandler.apply(this, arguments);

	var oDataModel = null, oJsonModel = null, oRenderData = {
		hDist: 15,
		vDist1: 15,
		vDist2: 80,
		oMainLayout: undefined,
		oPopup: undefined,
		iInitialLayoutHeight: 0,
		bDynamicHeight: undefined
	}, oTexts = {}, oHeaderText = null, applicationProperties = {}, heightExpanded = "180px", heightCollapsed = "60px", position = {
		top: "auto",
		bottom: "auto",
		left: "auto",
		right: "auto"
	};

	this.create = function (oChainedControl, oControlProperties, oComponentProperties) {
		var id = oControlProperties["id"], oNotificationButton;

		oControlProperties = oControlProperties || {};

		if (oControlProperties.texts) {
			oTexts = oControlProperties.texts;
		}
		if (oControlProperties.log_command) {
			sap.zen.MessageViewHandler.JSMessageHandler.sLogCommand = oControlProperties.log_command;
		}
		if (oControlProperties.application_properties) {
			applicationProperties = oControlProperties.application_properties;
			sap.zen.MessageViewHandler.JSMessageHandler.sMessageTypes = oControlProperties.application_properties.message_types;
		}
		// Message Types to show: NONE
		else {
			oNotificationButton = new sap.ui.commons.Button(id, {
				"width": "150px",
				"height": "50px"
			});
			oNotificationButton.setVisible(false);
			
			sap.zen.MessageViewHandler.JSMessageHandler.oNotificationButton = oNotificationButton;
			sap.zen.MessageViewHandler.JSMessageHandler.createSavedMessages();
			return oNotificationButton;
		}
		oNotificationButton = this.buildUI(id, oComponentProperties);
		if (oControlProperties.messages) {
			addMessages(oControlProperties);
			oJsonModel.setData(oDataModel.getData());
		} else if (sap.zen.MessageViewHandler.JSMessageHandler.oOldDataModel && !sap.zen.MessageViewHandler.bIsVariableScreen){
			oDataModel.setData(sap.zen.MessageViewHandler.JSMessageHandler.oOldDataModel);
			oJsonModel.setData(oDataModel.getData());
			sap.zen.MessageViewHandler.JSMessageHandler.oOldDataModel = null;
		} else {
			oNotificationButton.setVisible(false);
		}
	
		sap.zen.MessageViewHandler.JSMessageHandler.oNotificationButton = oNotificationButton;
		sap.zen.MessageViewHandler.JSMessageHandler.createSavedMessages();

		var oResult = oNotificationButton;
		if (!sap.zen.MessageViewHandler.bIsVariableScreen) {
			/*
			 * Performance optimization: The NotificationButton is inside an 0px/0px abs layout. This prevents a
			 * rerendering of the whole root layout whenever the NotificationButton is set to visible or invisible. This
			 * doesn't work in the variable screen because of special handling there.
			 */
			var oAbsLayout = this.createAbsoluteLayout(id + "_abs");
			oAbsLayout.setHorizontalScrolling(sap.ui.core.Scrolling.None);
			oAbsLayout.setVerticalScrolling(sap.ui.core.Scrolling.None);
			oAbsLayout.insertContent(oNotificationButton, 0);
			
			if (!oAbsLayout.fSaveOnAfterRendering) {
				oAbsLayout.fSaveOnAfterRendering = oAbsLayout.onAfterRendering;
				oAbsLayout.onAfterRendering = function() {
					if (oAbsLayout.fSaveOnAfterRendering) {
						oAbsLayout.fSaveOnAfterRendering();
					}
					if (!sap.zen.MessageViewHandler.bIsVariableScreen) {
						var oJqUi5BlockLayer = $('#sap-ui-blocklayer-popup');
						var oJqAbsLayout = $(document.getElementById(this.getId()));
						
						if (oJqUi5BlockLayer 
								&& oJqUi5BlockLayer.length > 0 
								&& oJqUi5BlockLayer.css("visibility") === "visible" 
								&& oJqUi5BlockLayer.outerWidth() > 0 
								&& oJqUi5BlockLayer.outerHeight() > 0) {
							
							var sZIndex = oJqUi5BlockLayer.css("z-index");
							if (sZIndex && sZIndex.length > 0) {
								var iZIndex = parseInt(sZIndex, 10);
								oJqAbsLayout.css("z-index", "" + (iZIndex + 1));
							}
						} else {
							oJqAbsLayout.css("z-index", "auto");
						}
					}
				};
			}
			
			oResult = oAbsLayout;
		}
		return oResult;
	};

	this.update = function (oControl, oControlProperties, oComponentProperties) {
		if (oControlProperties && oControlProperties.messages && oControlProperties.messages.length > 0 && oDataModel) {
			addMessages(oControlProperties);
			oJsonModel.setData(oDataModel.getData());
			var oBtn;
			if(oControl.getContent){
				//Not on the variable screen
				oBtn = oControl.getContent()[0];
			} else {
				//On the variable screen
				oBtn = oControl;
			}
			oBtn.setVisible(true);
			oBtn.removeStyleClass("zenDialogMsgButton");
		}
		if (oComponentProperties) {
			this.setMessagePosition(oComponentProperties);
		}
		return oControl;
	};

	this.buildUI = function (id, oComponentProperties) {

		// create json model
		oDataModel = new sap.zen.MessageViewHandler.DataModel();
		sap.zen.MessageViewHandler.JSMessageHandler.oDataModel = oDataModel;
		sap.zen.MessageViewHandler.JSMessageHandler.oRenderData = oRenderData;

		var oDataObject = oDataModel.getData();

		jQuery.sap.require("sap.ui.model.json.JSONModel");
		oJsonModel = new sap.ui.model.json.JSONModel();
		sap.zen.MessageViewHandler.JSMessageHandler.oJsonModel = oJsonModel;
		oJsonModel.setData(oDataObject);
		sap.ui.getCore().setModel(oJsonModel);

		// -----------Center--------
		var oMainBorderLayout = new sap.ui.commons.layout.BorderLayout();
		sap.zen.MessageViewHandler.JSMessageHandler.oRenderData.oMainLayout = oMainBorderLayout;
		oMainBorderLayout.addStyleClass("sapzenmessageview-PopupContainer");

		var oRowRepeater = new sap.ui.commons.RowRepeater("", {
			design: "BareShell",
			numberOfRows: 15,
			currentPage: 1
		});

		oRowRepeater
				.bindAggregation(
						"rows",
						{
							path: "/data",
							factory: function (sId, oContext) {
								var oRowBorderLayout = new sap.ui.commons.layout.BorderLayout();
								oRowBorderLayout.addStyleClass("sapzenmessageview-RowRepeaterRow");
								oRowBorderLayout.setWidth("320px");
								oRowBorderLayout.setHeight("60px");

								var fExpandCollapse = function (e) {
									var oRowBorderLayout;
									var oExpandImage;

									if (e.oSource) {
										oRowBorderLayout = e.oSource.oParent.oParent;
										oExpandImage = this;
									} else {
										oRowBorderLayout = sap.ui.getCore().byId(
												$(e.target.parentElement.parentElement.parentElement.parentElement)
														.attr("id"));
										oExpandImage = oRowBorderLayout.getBegin().getContent()[0];
									}

									var oBottom = oRowBorderLayout.getBottom();
									if (oBottom.getVisible()) {
										oRowBorderLayout.setHeight(heightCollapsed);
										oBottom.setVisible(false);
										oExpandImage.removeStyleClass("sapzenmessageview-ExpandImageActive");
										oRowBorderLayout.removeStyleClass("sapzenmessageview-RowRepeaterRowActive");
									} else {
										oRowBorderLayout.setHeight(heightExpanded);
										oBottom.setVisible(true);
										oExpandImage.addStyleClass("sapzenmessageview-ExpandImageActive");
										oRowBorderLayout.addStyleClass("sapzenmessageview-RowRepeaterRowActive");
									}
								};

								// begin
								var oExpandImage = new sap.ui.commons.Image();
								oExpandImage.addStyleClass("sapzenmessageview-ExpandImage");
								oExpandImage.setSrc(sap.zen.createStaticMimeUrl("zen.rt.components/resources/img/transparent.png"));
								oExpandImage.setAlt(oTexts.expand);
								oExpandImage.attachPress(fExpandCollapse);

								oRowBorderLayout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.begin,
										oExpandImage);

								oRowBorderLayout.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.begin, {
									size: "36px",
									visible: true
								});

								// center
								var oHorizontalLayout = new sap.ui.commons.layout.HorizontalLayout();

								var oLevelImage = new sap.ui.commons.Image();
								var sLevelStyleClass = "sapzenmessageview-LevelImageInfo";
								var sMessageLevel = oJsonModel.getProperty(oContext + "/message/level");
								if (sMessageLevel === "ERROR") {
									sLevelStyleClass = "sapzenmessageview-LevelImageError";
								} else if (sMessageLevel === "WARNING") {
									sLevelStyleClass = "sapzenmessageview-LevelImageWarning";
								}
								oLevelImage.setSrc(sap.zen.createStaticMimeUrl("zen.rt.components/resources/img/transparent.png"));
								oLevelImage.addStyleClass(sLevelStyleClass);

								oHorizontalLayout.addContent(oLevelImage);

								var oText2 = new sap.ui.commons.TextView();
								oText2.setDesign(sap.ui.commons.TextViewDesign.H2);
								oText2.addStyleClass("sapzenmessageview-HeaderText");
								oText2.bindProperty("text", oContext + "/message/short_text");
								oText2.setWrapping(false);

								oHorizontalLayout.addContent(oText2);
								oHorizontalLayout.attachBrowserEvent("click", fExpandCollapse);

								oRowBorderLayout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center,
										oHorizontalLayout);

								oRowBorderLayout.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.center, {
									visible: true
								});

								// end
								var oRemoveImage = new sap.ui.commons.Image();
								oRemoveImage.setSrc(sap.zen.createStaticMimeUrl("zen.rt.components/resources/img/transparent.png"));
								oRemoveImage.addStyleClass("sapzenmessageview-RemoveImage");
								oRemoveImage.setAlt(oTexts.remove);
								oRemoveImage.attachPress(function (e) {
									oDataModel.remove(e.oSource.getBindingContext().sPath);
									oJsonModel.setData(oDataModel.getData());
								});

								oRowBorderLayout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.end,
										oRemoveImage);

								oRowBorderLayout.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.end, {
									size: "39px",
									visible: true
								});

								// bottom
								var oText4 = new sap.ui.commons.TextView();
								oText4.bindProperty("text", oContext + "/message/long_text");

								oRowBorderLayout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.bottom, oText4);

								oRowBorderLayout.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.bottom, {
									size: "120px",
									contentAlign: "left",
									visible: false
								});

								return oRowBorderLayout;
							}
						});

		var noDataTextView = new sap.ui.commons.TextView("", {
			text: oTexts.no_notifications
		});
		noDataTextView.setDesign(sap.ui.commons.TextViewDesign.H1);
		noDataTextView.addStyleClass("sapzenmessageview-NoNotifications");
		oRowRepeater.setNoData(noDataTextView);

		oMainBorderLayout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center, oRowRepeater);

		// -----------Header--------

		var oHeaderBorderLayout = new sap.ui.commons.layout.BorderLayout();
		oHeaderBorderLayout.addStyleClass("sapzenmessageview-PopupContainerHeader");

		// center
		oHeaderText = new sap.ui.commons.TextView();
		oHeaderText.bindProperty("text", "/length", function (length) {
			return length + " " + (length === 1 ? oTexts.notification_header_singular : oTexts.notification_header);
		});

		oHeaderText.setDesign(sap.ui.commons.TextViewDesign.H1);

		oHeaderBorderLayout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.center, oHeaderText);

		// end
		var oClearAllButton = new sap.ui.commons.Button();
		oClearAllButton.setText(oTexts.clear_all);

		oClearAllButton.attachPress(function () {
			oDataModel.removeAll();
			oJsonModel.setData(oDataModel.getData());
			oPopup.close(100);
		});

		oHeaderBorderLayout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.end, oClearAllButton);

		oHeaderBorderLayout.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.begin, {
			size: "75px",
			visible: true
		});

		oHeaderBorderLayout.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.center, {
			visible: true
		});

		oHeaderBorderLayout.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.end, {
			size: "75px",
			visible: true
		});

		oMainBorderLayout.addContent(sap.ui.commons.layout.BorderLayoutAreaTypes.top, oHeaderBorderLayout);

		oMainBorderLayout.setAreaData(sap.ui.commons.layout.BorderLayoutAreaTypes.top, {
			visible: true
		});

		oMainBorderLayout.attachBrowserEvent("mousedown", function () {
			jQuery.sap.delayedCall(0, this, function () {
				oClearAllButton.focus();
			});
		});

		var oNotificationButton = new sap.ui.commons.Button(id, {
			text: "{/length}",
			icon: sap.zen.createStaticMimeUrl("zen.rt.components/resources/img/transparent.png")
		});

		if (!sap.zen.MessageViewHandler.bIsVariableScreen) {
			oNotificationButton.setWidth(sap.zen.MessageViewHandler.width + "px");
			oNotificationButton.setHeight(sap.zen.MessageViewHandler.height + "px");
		}

		oDataModel.addMaxLevelChangeListener(function (maxLevel) {
			oNotificationButton.removeStyleClass("sapzenmessageview-ButtonLevelImageInfo");
			oNotificationButton.removeStyleClass("sapzenmessageview-ButtonLevelImageWarning");
			oNotificationButton.removeStyleClass("sapzenmessageview-ButtonLevelImageError");

			var sNewStyleClass;
			if (maxLevel === "INFO") {
				sNewStyleClass = "sapzenmessageview-ButtonLevelImageInfo";
			} else if (maxLevel === "WARNING") {
				sNewStyleClass = "sapzenmessageview-ButtonLevelImageWarning";
			} else {
				sNewStyleClass = "sapzenmessageview-ButtonLevelImageError";
			}

			oNotificationButton.addStyleClass(sNewStyleClass);
		});

		this.setMessagePosition(oComponentProperties);
		var oPopup = new sap.ui.core.Popup(oMainBorderLayout, false, true, false);
		oRenderData.oPopup = oPopup;

		var that = this;
		oNotificationButton.attachPress(function () {
			if (oPopup.isOpen()) {
				oPopup.close(100);
			} else {
				that.openMessagePopup(oPopup);
			}
		});

		// needed for scrolling on iPad
		if (sapbi_isMobile) {
			oMainBorderLayout.attachBrowserEvent("touchstart", function () {
				var layNullCenter = $(this.$().children()[1]);

				if (layNullCenter.scrollTop() === 0) {
					layNullCenter.scrollTop(1);
				}
			});

			oMainBorderLayout.attachBrowserEvent("touchmove", function (e) {
				var layNullCenter = $(this.$().children()[1]);
				var maxScrollTop = (oRowRepeater.$().height() - layNullCenter.outerHeight()) - 1;

				if (maxScrollTop < 5 || !$(e.target).parents("#" + layNullCenter.attr("id")).length) {
					return false;
				}

				if (layNullCenter.scrollTop() < 1) {
					layNullCenter.scrollTop(0);
				}

				if (layNullCenter.scrollTop() >= maxScrollTop) {
					layNullCenter.scrollTop(maxScrollTop);
				}
				e.stopPropagation();
			});
		}

		oPopup.attachClosed(function () {
			if (!oJsonModel.getProperty("/length")) {
				oNotificationButton.setVisible(false);
			}
		});

		oPopup.setAnimations(function ($Ref, iDuration, fnCallback) {
			$Ref.css("top", position.top);
			$Ref.css("bottom", position.bottom);
			$Ref.css("left", position.left);
			$Ref.css("right", position.right);

			fnCallback();
		}, function ($Ref, iDuration, fnCallback) {
			fnCallback();
		});

		return oNotificationButton;
	};

	this.openMessagePopup = function (oPopup) {
		var my, at, offset = [];
		
		//reset position because the var screen overwrites these properties
		position = {
				top: "auto",
				bottom: "auto",
				left: "auto",
				right: "auto"
			};

		if (applicationProperties.message_popup_position === "LEFT") {
			if (applicationProperties.message_position === "BOTTOMLEFT"
					|| applicationProperties.message_position === "BOTTOMRIGHT") {
				my = at = sap.ui.core.Popup.Dock.LeftBottom;
				offset[0] = oRenderData.hDist;
				offset[1] = applicationProperties.message_position === "BOTTOMLEFT" ? -oRenderData.vDist2
						: -oRenderData.vDist1;
				if (sap.zen.MessageViewHandler.fCalculationCallback) {
					sap.zen.MessageViewHandler.fCalculationCallback(offset,
							applicationProperties.message_popup_position, applicationProperties.message_position);
				}
				position.left = (offset[0] >= 0 ? offset[0] : -offset[0]) + "px";
				position.bottom = (offset[1] >= 0 ? offset[1] : -offset[1]) + "px";
			} else {
				my = at = sap.ui.core.Popup.Dock.LeftTop;
				offset[0] = oRenderData.hDist;
				offset[1] = applicationProperties.message_position === "TOPLEFT" ? oRenderData.vDist2
						: oRenderData.vDist1;
				if (sap.zen.MessageViewHandler.fCalculationCallback) {
					sap.zen.MessageViewHandler.fCalculationCallback(offset,
							applicationProperties.message_popup_position, applicationProperties.message_position);
				}
				position.left = (offset[0] >= 0 ? offset[0] : -offset[0]) + "px";
				position.top = (offset[1] >= 0 ? offset[1] : -offset[1]) + "px";
			}
		} else {
			if (applicationProperties.message_position === "BOTTOMLEFT"
					|| applicationProperties.message_position === "BOTTOMRIGHT") {
				my = at = sap.ui.core.Popup.Dock.RightBottom;
				offset[0] = -oRenderData.hDist;
				offset[1] = applicationProperties.message_position === "BOTTOMRIGHT" ? -oRenderData.vDist2
						: -oRenderData.vDist1;
				if (sap.zen.MessageViewHandler.fCalculationCallback) {
					sap.zen.MessageViewHandler.fCalculationCallback(offset,
							applicationProperties.message_popup_position, applicationProperties.message_position);
				}
				position.right = (offset[0] >= 0 ? offset[0] : -offset[0]) + "px";
				position.bottom = (offset[1] >= 0 ? offset[1] : -offset[1]) + "px";
			} else {
				my = at = sap.ui.core.Popup.Dock.RightTop;
				offset[0] = -oRenderData.hDist;
				offset[1] = applicationProperties.message_position === "TOPRIGHT" ? oRenderData.vDist2
						: oRenderData.vDist1;
				if (sap.zen.MessageViewHandler.fCalculationCallback) {
					sap.zen.MessageViewHandler.fCalculationCallback(offset,
							applicationProperties.message_popup_position, applicationProperties.message_position);
				}
				position.right = (offset[0] >= 0 ? offset[0] : -offset[0]) + "px";
				position.top = (offset[1] >= 0 ? offset[1] : -offset[1]) + "px";
			}
		}
		oPopup.setPosition(my, at, document, offset.join(" "));
		oPopup.open(100);
	};

	this.setMessagePosition = function (oComponentProperties) {
		var iBottommargin = oRenderData.vDist1;
		var iRightmargin = oRenderData.hDist;

		if (!sap.zen.MessageViewHandler.bIsVariableScreen) {
			oComponentProperties.width = "0";
			oComponentProperties.height = "0";
			iBottommargin = iBottommargin + sap.zen.MessageViewHandler.height;
			iRightmargin = iRightmargin + sap.zen.MessageViewHandler.width;
		} else {
			oComponentProperties.width = sap.zen.MessageViewHandler.width;
			oComponentProperties.height = sap.zen.MessageViewHandler.height;
		}

		if (applicationProperties.message_position === "BOTTOMLEFT") {
			oComponentProperties.leftmargin = oRenderData.hDist;
			oComponentProperties.bottommargin = iBottommargin;
			oComponentProperties.topmargin = "auto";
			oComponentProperties.rightmargin = "auto";
		} else if (applicationProperties.message_position === "BOTTOMRIGHT") {
			oComponentProperties.leftmargin = "auto";
			oComponentProperties.bottommargin = iBottommargin;
			oComponentProperties.topmargin = "auto";
			oComponentProperties.rightmargin = iRightmargin;
		} else if (applicationProperties.message_position === "TOPLEFT") {
			oComponentProperties.leftmargin = oRenderData.hDist;
			oComponentProperties.bottommargin = "auto";
			oComponentProperties.topmargin = oRenderData.vDist1;
			oComponentProperties.rightmargin = "auto";
		} else if (applicationProperties.message_position === "TOPRIGHT") {
			oComponentProperties.leftmargin = "auto";
			oComponentProperties.bottommargin = "auto";
			oComponentProperties.topmargin = oRenderData.vDist1;
			oComponentProperties.rightmargin = iRightmargin;
		}

	};

	var addMessages = function (oControlProperties) {
		var oMessage;
		for (var i = 0; i < oControlProperties.messages.length; i++) {
			oMessage = oControlProperties.messages[i];
			oDataModel.add(oMessage);
		}
	};

};

sap.zen.MessageViewHandler.DataModel = function () {
	this.oDataObject = {};
	this.oDataObject.data = [];
	this.oDataObject.data.messageNumber = 0;
	this.maxLevelChangelisteners = [];

	this.add = function (oMessage) {
		this.oDataObject.data.unshift(oMessage);
		this.oDataObject.length = this.oDataObject.data.length;
		this.maxLevelNotify();
	};

	this.remove = function (sBindingContext) {
		var iLastSlash = sBindingContext.lastIndexOf("/");
		var iIndex = parseInt(sBindingContext.substring(iLastSlash + 1));
		this.oDataObject.data.splice(iIndex, 1);
		this.oDataObject.length = this.oDataObject.data.length;
		this.maxLevelNotify();
	};

	this.removeAll = function () {
		this.oDataObject.data = [];
		this.oDataObject.length = 0;
		this.maxLevelNotify();
	};

	this.getData = function () {
		return this.oDataObject;
	};
	
	this.setData = function(aData) {
		for(var i=0; i<aData.length; i++){
			this.add(aData[i]);
		}
	};

	this.maxLevelNotify = function () {
		var oldValue = this.oDataObject.maxLevel, i;
		this.oDataObject.maxLevel = "INFO";
		for (i = 0; i < this.oDataObject.data.length
				&& (this.oDataObject.maxLevel === "INFO" || this.oDataObject.maxLevel === "WARNING"); i++) {
			if (this.oDataObject.data[i].message.level === "WARNING") {
				this.oDataObject.maxLevel = "WARNING";
			} else if (this.oDataObject.data[i].message.level === "ERROR") {
				this.oDataObject.maxLevel = "ERROR";
			}
		}
		if (oldValue !== this.oDataObject.maxLevel) {
			for (i = 0; i < this.maxLevelChangelisteners.length; i++) {
				this.maxLevelChangelisteners[i](this.oDataObject.maxLevel);
			}
		}
	};

	this.addMaxLevelChangeListener = function (listener) {
		this.maxLevelChangelisteners.push(listener);
	};
};

sap.zen.MessageViewHandler.createMessage = function (sLevel, sShortText, sLongText, bLogMessage) {
	sap.zen.MessageViewHandler.JSMessageHandler.createMessage(sLevel, sShortText, sLongText, bLogMessage);
};

sap.zen.MessageViewHandler.clearMessages = function () {
	sap.zen.MessageViewHandler.JSMessageHandler.clearAllMessages();
};

sap.zen.MessageViewHandler.logMessage = function (sLevel, sShortText, sLongText) {
	sap.zen.MessageViewHandler.JSMessageHandler.createLogMessage(sLevel, sShortText, sLongText);
};

sap.zen.MessageViewHandler.setSize = function (oSize) {
	sap.zen.MessageViewHandler.width = oSize.width;
	sap.zen.MessageViewHandler.height = oSize.height;
};

sap.zen.MessageViewHandler.setVariableScreen = function (bIsVariableScreen) {
	if(!bIsVariableScreen){
		sap.zen.MessageViewHandler.width = 150;
		sap.zen.MessageViewHandler.height = 50;
		sap.zen.MessageViewHandler.JSMessageHandler.setPopupAutoClose(false);
		
		sap.zen.MessageViewHandler.JSMessageHandler.setPopupAreaIds([ ]);
		sap.zen.MessageViewHandler.JSMessageHandler.setDistanceToButton(80);
		sap.zen.MessageViewHandler.JSMessageHandler.allowDynSizeBehavior(false);
	} else {
		if(sap.zen.MessageViewHandler.JSMessageHandler.oRenderData){
			var oPopup = sap.zen.MessageViewHandler.JSMessageHandler.oRenderData.oPopup;
			if(oPopup){
				oPopup.close();
			}
			var oData = sap.zen.MessageViewHandler.JSMessageHandler.oDataModel.getData().data;
			if(oData && oData.length > 0){				
				sap.zen.MessageViewHandler.JSMessageHandler.oOldDataModel = oData;
			} else {
				sap.zen.MessageViewHandler.JSMessageHandler.oOldDataModel = null;
			}
		}
	}
	
	sap.zen.MessageViewHandler.bIsVariableScreen = bIsVariableScreen;
};

sap.zen.MessageViewHandler.registerOffsetCalulationCallback = function (fCalculationCallback) {
	sap.zen.MessageViewHandler.fCalculationCallback = fCalculationCallback;
};

sap.zen.MessageViewHandler.width = 150;
sap.zen.MessageViewHandler.height = 50;

sap.zen.MessageViewHandler.bIsVariableScreen = false;

sap.zen.MessageViewHandler.info = "INFO";
sap.zen.MessageViewHandler.warning = "WARNING";
sap.zen.MessageViewHandler.error = "ERROR";

sap.zen.MessageViewHandler.JSMessageHandler = new function () {

	var aSavedMessages = undefined;

	this.oDataModel = undefined;
	this.oOldDataModel = undefined;
	this.oJsonModel = undefined;
	this.oRenderData = undefined;
	this.oNotificationButton = undefined;
	this.sLogCommand = undefined;
	this.sMessageTypes = undefined;
	this.bAutoClose = false;
	this.aPopupAreaIds = [];

	this.setDistanceToButton = function (vDist2) {
		this.oRenderData.vDist2 = vDist2;
	};

	this.setPopupAutoClose = function (bAutoClose) {
		this.bAutoClose = bAutoClose;
	};

	this.setPopupAreaIds = function (aPopupAreaIds) {
		this.aPopupAreaIds = aPopupAreaIds;
	};

	this.allowDynSizeBehavior = function (bAllow) {
		// register for window resize
		function doResize (bOnAfterRendering) {
			var oDomLayout = $(document.getElementById(that.oRenderData.oMainLayout.getId()));
			var iBottom = parseInt(oDomLayout.css("bottom"), 10);
			var iWindowHeight = parseInt($(window).innerHeight(), 10);
			
			if (iWindowHeight - that.oRenderData.iInitialLayoutHeight - iBottom < 0) {
				if (!that.oRenderData.bDynamicHeight || bOnAfterRendering === true) {
					oDomLayout.css("top", "1px");
					oDomLayout.addClass("sapzenmessageview-AutoHeight");
					that.oRenderData.bDynamicHeight = true;
				}
			} else {
				if (that.oRenderData.bDynamicHeight === true || bOnAfterRendering === true) {
					oDomLayout.css("top", "auto");
					oDomLayout.removeClass("sapzenmessageview-AutoHeight");
					that.oRenderData.bDynamicHeight = false;
				}
			}
		}

		function resizeAfterOpeningPopup () {
			clearTimeout(popupTimer);
			if (that.oRenderData.oPopup.isOpen()) {
				doResize(true);
			} else {
				popupTimer = setTimeout(resizeAfterOpeningPopup, 150);
			}
		}

		// after rendering of the main layout
		var that = this;
		var popupTimer;
		if(bAllow){
			this.oRenderData.oMainLayout.oldOnAfterRendering = this.oRenderData.oMainLayout.onAfterRendering;
			this.oRenderData.oMainLayout.onAfterRendering = function () {
				if (this.oldOnAfterRendering) {
					this.oldOnAfterRendering();
				}
				if (that.oRenderData.iInitialLayoutHeight === 0) {
					that.oRenderData.iInitialLayoutHeight = parseInt($(document.getElementById(this.getId())).css("height"), 10);
				}
				
				that.oRenderData.oPopup.setAutoClose(that.bAutoClose);
				if (that.bAutoClose) {
					var aDomAreas = [], i, id, oDomArea;

					for (i = 0; i < that.aPopupAreaIds.length; i++) {
						id = that.aPopupAreaIds[i];
						if (id) {
							oDomArea = $(document.getElementById(id));
							if (oDomArea && oDomArea.length > 0) {
								aDomAreas.push(oDomArea[0]);
							}
						}
					}
					// add notification button itself
					aDomAreas.push(document.getElementById(that.oNotificationButton.getId()));
					that.oRenderData.oPopup.setAutoCloseAreas(aDomAreas);
				}
				
				popupTimer = setTimeout(resizeAfterOpeningPopup, 150);
				
			};
			
			
			$(window).resize(doResize);
		} else {
			if(this.oRenderData.oMainLayout.oldOnAfterRendering){
				this.oRenderData.oMainLayout.onAfterRendering= this.oRenderData.oMainLayout.oldOnAfterRendering;
			}
		}
	};

	this.clearAllMessages = function () {
		if (this.oDataModel) {
			this.oDataModel.removeAll();
			if (this.oJsonModel) {
				this.oJsonModel.setData(this.oDataModel.getData());
			}
		}
	};

	this.createLogMessage = function (sLevel, sShortText, sLongText) {
		if (!this.oNotificationButton) {
			// This means the whole message view has not been initialized yet.
			// All messages are stored until the message view is ready to log them.
			this.saveMessage(sLevel, sShortText, sLongText, true, true);
		} else {
			this.logMessage(sLevel, sShortText, sLongText);
		}
	};

	this.createMessage = function (sLevel, sShortText, sLongText, bLogMessage) {
		if (!this.oNotificationButton) {
			// This means the whole message view has not been initialized yet.
			// All messages are stored until the message view is ready to display them.
			this.saveMessage(sLevel, sShortText, sLongText, bLogMessage, false);
		} else {
			this.createMessageInternal(sLevel, sShortText, sLongText);
			if (bLogMessage) {
				this.logMessage(sLevel, sShortText, sLongText);
			}
		}
	};

	this.saveMessage = function (sLevel, sShortText, sLongText, bLogMessage, bLogOnly) {
		if (!aSavedMessages) {
			aSavedMessages = [];
		}

		var oMsg = {};
		oMsg.sLevel = sLevel;
		oMsg.sShortText = sShortText;
		oMsg.sLongText = sLongText;
		oMsg.bLogMessage = bLogMessage;
		oMsg.bLogOnly = bLogOnly;

		aSavedMessages.push(oMsg);
	};

	this.createSavedMessages = function () {
		if (aSavedMessages) {
			for (var i = 0; i < aSavedMessages.length; i++) {
				var oMsg = aSavedMessages[i];
				if (!oMsg.bLogOnly) {
					this.createMessageInternal(oMsg.sLevel, oMsg.sShortText, oMsg.sLongText);
				}
				if (oMsg.bLogMessage) {
					this.logMessage(oMsg.sLevel, oMsg.sShortText, oMsg.sLongText);
				}
			}
			aSavedMessages = undefined;
		}

	};

	this.logMessage = function (sLevel, sShortText, sLongText) {
		if (this.sLogCommand) {
			var sCommand = this.sLogCommand;
			sCommand = sap.zen.Dispatcher.instance.prepareCommand(sCommand, "__LEVEL__", sLevel);
			sCommand = sap.zen.Dispatcher.instance.prepareCommand(sCommand, "__SHORTTEXT__", sShortText);
			sCommand = sap.zen.Dispatcher.instance.prepareCommand(sCommand, "__LONGTEXT__", sLongText);

			var fAction = new Function(sCommand);
			fAction();
		}
	};

	this.createMessageInternal = function (sLevel, sShortText, sLongText) {
		var bValidMessageType = true;

		if (!this.sMessageTypes) {
			// this means: show no messages
			bValidMessageType = false;
		} else {
			if (sLevel !== sap.zen.MessageViewHandler.error && sLevel !== sap.zen.MessageViewHandler.warning
					&& sLevel !== sap.zen.MessageViewHandler.info) {
				// Not one of the three known message types
				bValidMessageType = false;
			}
			if (sLevel === sap.zen.MessageViewHandler.warning && this.sMessageTypes === "ERRORS") {
				// Warnings should not be displayed
				bValidMessageType = false;
			}
			if (sLevel === sap.zen.MessageViewHandler.info && this.sMessageTypes === "ERRORS") {
				// Infos should not be displayed
				bValidMessageType = false;
			}
			if (sLevel === sap.zen.MessageViewHandler.info && this.sMessageTypes === "WARNINGSERRORS") {
				// Infos should not be displayed
				bValidMessageType = false;
			}
		}

		if (bValidMessageType) {
			var oMessage = {};
			var newMessage = {};

			newMessage.msg_idx = 0;
			newMessage.id = "FrontEnd-Message-" + new Date().getTime();
			newMessage.short_text = sShortText;
			newMessage.long_text = sLongText;
			newMessage.level = sLevel;

			oMessage.message = newMessage;
			this.oDataModel.add(oMessage);
			this.oJsonModel.setData(this.oDataModel.getData());
			this.oNotificationButton.setVisible(true);

			if (!sap.ui.getCore().getUIDirty()) {
				// When the message is created from an onAfterRendering event UI5 doesn't redraw the notification
				// button.
				// It needs to be invalidated manually, however, this is not allowed from within the onAfterRendering.
				// Therefore, invalidate needs to be called with a delay.
				var that = this;
				window.setTimeout(function () {
					that.oNotificationButton.invalidate();
				}, 10);
			}

		}
	};
}();

sap.zen.Dispatcher.instance.addHandlers("messageview", new sap.zen.MessageViewHandler());
});