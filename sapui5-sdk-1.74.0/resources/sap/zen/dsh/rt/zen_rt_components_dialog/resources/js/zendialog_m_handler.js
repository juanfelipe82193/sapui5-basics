//
//

define("zen.rt.components.dialog/resources/js/zendialog_m_handler", ["sap/zen/basehandler"], function(BaseHandler) {
	
	sap.zen.ZenDialogHandler = function () {
		"use strict";
	
		sap.zen.ZenDialogHandler.anchorDivId = "sapbi_snippet_ROOT_DIALOG";
	
		BaseHandler.apply(this, arguments);
		
		this.dispatcher = BaseHandler.dispatcher;
		
		var that = this;
		
		this.oTopLevelControl = null;
		
		// Loading Indicator
		this.loadingIndicatorCssHasBeenSet = false;
		
		// MatrixLayout
		this.iVertPaddingAndBorderContribution = -1;
		
		this.bIsRuntimeMode = false;
		
		this.bBrowserResize = false;
		this.resizeTimer = null;
		this.resizeEndTimer = null;
		this.initialWindowHeight = 0;
		this.initialWindowWidth = 0;
		this.contentTdHeight = 0;
		this.contentHeight = 0;
		this.oDomContentArea = null;
		this.oDomContentDiv = null;
		
		this.bDialogClosing = false;
		
		/**
		 * Create Control
		 */
		this.createAndAdd = function (oChainedControl, oControlProperties, oComponentProperties, fAppendToParentFunclet, oArgForFunclet) {
			this.dispatcher.enableReady(false);
	
			this.bIsRuntimeMode = oControlProperties.renderruntimeinitvarscreen;
			this.bBrowserResize = oControlProperties.hookbrowserresize;
			this.iVertPaddingAndBorderContribution = -1;
			
			// validate Dialog Content (check if it can be handled)
			this.oTopLevelControl = {};
			var lIsValidContent = this.validateDialogContent(this.oTopLevelControl, oControlProperties, oComponentProperties);
			this.oTopLevelControl = null;
			if (!lIsValidContent) {
				jQuery.sap.log.error("Invalid Dialog Content");
				return;
			}
						
			// create TopLevel Control
			var loMatrixLayout = null;
			if (this.bIsRuntimeMode === true) {
				this.oTopLevelControl = new sap.m.Button(
						oControlProperties["id"], 
						{
							enabled: false
						});
				
				// for navigating away from page, e. g. in S4 context
				var loOrigFuncDestroy = this.oTopLevelControl.destroy;
				this.oTopLevelControl.destroy = function() {
					if (sap.zen.Dispatcher.instance.oCurrentVarDlg) {
						sap.zen.Dispatcher.instance.oCurrentVarDlg.destroy();
						delete sap.zen.Dispatcher.instance.oCurrentVarDlg;
					}
					loOrigFuncDestroy.apply(this, arguments);
				}
				
				this.oTopLevelControl.aZenChildren = [];
				this.oTopLevelControl.aZenChildren.push(sap.zen.Dispatcher.instance.oCurrentVarDlg);
				
				if (typeof(DSH_deployment) !== "undefined" && DSH_deployment === true) {
					fAppendToParentFunclet(this.oTopLevelControl, oArgForFunclet);
				}
			} else {
				this.oTopLevelControl = this.createMatrixLayout(oControlProperties, oComponentProperties);
				loMatrixLayout = this.oTopLevelControl;
				
				this.oTopLevelControl.aZenChildren = [];
				
				fAppendToParentFunclet(this.oTopLevelControl, oComponentProperties);			
			}
					
			// initialize TopLevel Control
			this.oTopLevelControl.oDialogProperties = { 
					oComponentProperties : null,
					oControlProperties : null,
					oMatrixLayout: loMatrixLayout,
					oMsgComponent : null,
					oMsgControl : null,
					tContentComponents : [],
					oContentComponent: null,
					oContentControl : null };
			this.init(this.oTopLevelControl, oControlProperties, oComponentProperties, true);
	
			// additional handling of created objects
			this.hookBrowserResize();
			
			if (this.bIsRuntimeMode === true) {
				this.openDialog();
			} 
		
			return this.oTopLevelControl;
		};
		
		/**
		 * Update Control
		 */
		this.update = function (oControl, oControlProperties, oComponentProperties) {
			if (oControlProperties) {
				  if (oControlProperties.closeDialogCommand && oControlProperties.closeDialogCommand.length > 0) {
						sap.zen.ZenDialogHandler.closeDialog();
						setTimeout(function() {
							 var loFunc = new Function(oControlProperties.closeDialogCommand);
							 loFunc();
						}, 0);
				  } else {
						if (this.validateDialogContent(oControl, oControlProperties, oComponentProperties)) {
							 this.init(oControl, oControlProperties, oComponentProperties, false);
						} else {
							 jQuery.sap.log.error("Invalid Dialog Content");
						}
				  }
			}
		};
	  
		/**
		 * Initialize Control (Create, Update)
		 */
		this.init = function (oControl, oControlProperties, oComponentProperties, initialize) {			
			if (oControlProperties.loadingIndicatorDelay) {
				sap.zen.loadingIndicatorDelay = oControlProperties.loadingIndicatorDelay;
			}			
			if (!this.loadingIndicatorCssHasBeenSet) {
				addLoadingIndicatorCss();
			}
			
			// retrieve Dialog Properties (e.g. Dialog Content, MsgComponent, Component & Control Properties)
			this.extractDialogProperties(oControl, oControlProperties, oComponentProperties, initialize);
			
			// initialize (create/update) the Dialog
			this.initDialog(oControl);
		};
		
		/**
		 * Validate Dialog Content
		 * 	1 Content + 1 Message Item
		 * 	1 Message Item
		 *	1 Content
		 */
		this.validateDialogContent = function(oControl, oControlProperties, oComponentProperties) {
			this.extractDialogProperties(oControl, oControlProperties, oComponentProperties, false);
			
			if (oControlProperties) {
				if (!oControlProperties.content || oControlProperties.content.length > 2) {
					return false;
				}
				
				if (!oControl.oDialogProperties.oMsgComponent) {
					if (!oControl.oDialogProperties.oContentComponent || (oControl.oDialogProperties.oContentComponent && oControlProperties.content.length > 1)) {
						return false;
					}
				} else {
					if (!oControl.oDialogProperties.oContentComponent && oControlProperties.content.length > 1) {
						return false;
					}
				}
			} else {
				return false;
			}
			
			return true;
		};
		
		/**
		 * Retrieve Dialog Properties relevant for the current Control: 
		 * 		Dialog Component Properties
		 * 		Dialog Control Properties
		 * 		Dialog Message Component
		 * 		Dialog Message Control
		 * 		Dialog Content Component(s)
		 */
		this.extractDialogProperties = function(oControl, oControlProperties, oComponentProperties, initialize) {
			if (!oControl.oDialogProperties) {
				oControl.oDialogProperties = { 
						oComponentProperties : null,
						oControlProperties : null,
						oMatrixLayout: null,
						oMsgComponent : null,
						oMsgControl : null,
						tContentComponents : [],
						oContentComponent : null,
						oContentControl : null };
			}
			
			// update Dialog Properties
			oControl.oDialogProperties.oComponentProperties = oComponentProperties;
			oControl.oDialogProperties.oControlProperties = oControlProperties;
			if (initialize) {
				oControl.oDialogProperties.oMsgComponent = null;
				oControl.oDialogProperties.oMsgControl = null;
				oControl.oDialogProperties.tContentComponents = [];
				oControl.oDialogProperties.oContentComponent = null;
				oControl.oDialogProperties.oContentControl = null;
			}
			
			var losMsgComponent = null;
			var ltContentComponents = [];
			// Update Message Component and Content Components
			if (oControlProperties.content && oControlProperties.content.length > 0) {
				for (var i = 0; i < oControlProperties.content.length; i++) {
					var loContent = oControlProperties.content[i];
					if (loContent && loContent.component) {
						if (loContent.component.type === "MESSAGEVIEW_COMPONENT" && !losMsgComponent) {
							losMsgComponent = loContent.component;
						} else {
							ltContentComponents.push(loContent.component);
						}
					}
				}
			}
			
			// Update Content Component
			if (ltContentComponents && ltContentComponents.length > 0) {
				oControl.oDialogProperties.tContentComponents = ltContentComponents;
				oControl.oDialogProperties.oContentComponent = oControl.oDialogProperties.tContentComponents[0];
			}
			
			// Update Content Control
			if (oControl.oDialogProperties.oContentComponent) {
				if (oControl.oDialogProperties.oContentComponent.content && oControl.oDialogProperties.oContentComponent.content.control) {
					oControl.oDialogProperties.oContentControl = this.dispatcher.getControlForId(oControl.oDialogProperties.oContentComponent.content.control.id);
				}
			}
			
			// Update Message Control
			if (losMsgComponent) {
				if (losMsgComponent.content && losMsgComponent.content.control) {
					oControl.oDialogProperties.oMsgComponent = losMsgComponent;
					oControl.oDialogProperties.oMsgControl = this.dispatcher.getControlForId(oControl.oDialogProperties.oMsgComponent.content.control.id);
				}
			}
		};
				
		/**
		 * Initialize Dialog
		 * 		Update the Dialog (Properties, Content, Buttons, Message)
		 */
		this.initDialog = function(oControl) {
			if (!oControl || !oControl.oDialogProperties || !oControl.oDialogProperties.oControlProperties) {
				return;
			}
			
			// create Dialog
			if (!oControl.oDialog) {
				jQuery.sap.require("sap.m.Dialog");
				
				oControl.oDialog = new sap.m.Dialog(
						oControl.getId() + "_dlg",
						{
							"title": oControl.oDialogProperties.oControlProperties.title ? oControl.oDialogProperties.oControlProperties.title : oControl.oDialogProperties.oControlProperties.titletext,
							"showHeader": oControl.oDialogProperties.oControlProperties.displaytitle,
							"resizable": oControl.oDialogProperties.oControlProperties.canresize,
							"draggable": oControl.oDialogProperties.oControlProperties.canmove,
							"horizontalScrolling": false,
							"verticalScrolling": false,
							"contentHeight": "100%",
							"contentWidth": Math.floor(window.innerWidth / 2) + "px",
							"afterOpen" : function() {
								var loJqScrollDiv = this.$().find(".sapMDialogScroll");
								loJqScrollDiv.css("overflow-x", "auto");
								var loJqPayloadDiv;
								if ($.browser.mozilla) {
									loJqPayloadDiv = $(document.getElementById(oControl.oDialogProperties.oContentControl.getId()));
									loJqPayloadDiv.css("display", "inline-table");
								} else if ($.browser.webkit) {
									loJqPayloadDiv = $(document.getElementById(oControl.oDialogProperties.oContentControl.getId()));
									var loParentTd  = loJqPayloadDiv.parent();
									loParentTd.css("height", "100%");
								}
							}
						});
				
				oControl.oDialog.addStyleClass("sapContrastPlus");
				
				oControl.oDialog.attachBrowserEvent("keydown", function(e) {
					if (e.which === 27) {
						if (e.stopPropagation) {
							e.stopPropagation();
						}
						if (e.cancelBubble) {
							e.cancelBubble = true;
						}
					}
				});
					
				sap.zen.Dispatcher.instance.oCurrentVarDlg = oControl.oDialog;
				if (this.bIsRuntimeMode === true) {
					sap.zen.Dispatcher.instance.oCurrentVarDlg.oDispatcherHook = this.oTopLevelControl;
				}
			}
			
			// update Dialog
			if (oControl.oDialog) {			
				if (oControl.oDialogProperties.oControlProperties.title){
					oControl.oDialog.setTitle(oControl.oDialogProperties.oControlProperties.title);
				}
				
				// update Dialog Content (Content Area)
				this.initDialogContent(oControl);
				
				// update Dialog Buttons (Footer Area)
				this.initDialogButtons(oControl);

				// update Dialog Message (Footer Area)
				this.initDialogMessage(oControl);
			}
		};
		
		/**
		 * Initialize Dialog Content
		 */
		this.initDialogContent = function(oControl) {
			if (!oControl || !oControl.oDialog || !oControl.oDialogProperties) {
				return;
			}
			
			if (oControl.oDialogProperties.oMatrixLayout) {
				// create Content Area
				if (oControl.oDialogProperties.oContentComponent) {
					var loContentRow = this.createMatrixLayoutContentArea();
					oControl.oDialogProperties.oMatrixLayout.addRow(loContentRow);
				}
			}
			
			// check if we are in create or update mode
			var lCreate = false;
			if (oControl.oDialogProperties.oMatrixLayout) {
				if (oControl.oDialogProperties.oContentComponent) {
					lCreate = this.dispatcher.getComponentIdForControlId(oControl.oDialogProperties.oContentComponent.content.control.id) == null;
				}
			} else {
				if (oControl.oDialog) {
					lCreate = !oControl.oDialog.isOpen();
				} else {
					lCreate = true;
				}
			}
			
			if (oControl.oDialogProperties.oContentComponent) {
				if (lCreate) {
					oControl.oDialogProperties.oContentControl = this.dispatcher.dispatchCreateControl(oControl.oDialogProperties.oContentComponent);
					
					if (oControl.oDialogProperties.oContentComponent.id) {
						this.oTopLevelControl.aZenChildren.push(oControl.oDialogProperties.oContentComponent.id);
					}
		
					oControl.oDialogProperties.oContentControl.setWidth("100%");
					oControl.oDialogProperties.oContentControl.setHeight("100%");
					
					if (oControl.oDialogProperties.oMatrixLayout) {
						var loContentCell = this.getMatrixLayoutCell(oControl.oDialogProperties.oMatrixLayout, 0, 0);
						loContentCell.addContent(oControl.oDialogProperties.oContentControl);
					}
		
					this.dispatcher.updateComponentProperties(undefined, oControl.oDialogProperties.oContentComponent);
				} else {
					oControl.oDialogProperties.oContentControl = this.dispatcher.getControlForId(oControl.oDialogProperties.oContentComponent.content.control.id)					
					
					this.dispatcher.dispatchUpdateControl(oControl.oDialogProperties.oContentComponent);
					this.dispatcher.updateComponentProperties(null, oControl.oDialogProperties.oContentComponent);
				}				
			}
			
			var loDialogContent = oControl.oDialogProperties.oMatrixLayout ? oControl.oDialogProperties.oMatrixLayout : oControl.oDialogProperties.oContentControl;
			loDialogContent.onAfterRendering = this.dialogCallbackOnAfterRendering(loDialogContent, oControl);
			
			if (!oControl.oDialog.isOpen()) {
				//oControl.oDialog.removeAllContent();
				oControl.oDialog.addContent(loDialogContent);	
			}
		};
		
		/**
		 * Initialize Dialog Buttons
		 * 		remove all Dialog buttons and add buttons defined for the Control
		 */
		this.initDialogButtons = function(oControl) {
			if (!oControl || !oControl.oDialog || !oControl.oDialogProperties || !oControl.oDialogProperties.oControlProperties) {
				return;
			}
			
			if (oControl.oDialogProperties.oMatrixLayout) {
				// create Button Area
				var loButtonRow = this.createMatrixLayoutButtonArea();
				oControl.oDialogProperties.oMatrixLayout.addRow(loButtonRow);
			}
			
			var loFuncPress = function () {
				if (this.zenOkBtn === true) {
					sap.zen.Dispatcher.instance.enableReady(true);
				}
				
				if (this.zenOkBtn === true || this.zenCancelBtn === true) {
					sap.zen.MessageViewHandler.setVariableScreen(false);
				}
				
				that.bDialogClosing = true;
				
				// prevent quick click sequence on button from messing up the runtime
				this.setEnabled(false);
				this.zenOnClick();
			};
			
			if (oControl.oDialogProperties.oControlProperties.buttons && oControl.oDialogProperties.oControlProperties.buttons.length){
				// check if we are in create or update mode
				var lCreate = false;
				if (oControl.oDialogProperties.oMatrixLayout) {
					if (oControl.oDialogProperties.oContentComponent) {
						lCreate = this.dispatcher.getComponentIdForControlId(oControl.oDialogProperties.oContentComponent.content.control.id) == null;
					}
				} else {
					if (oControl.oDialog) {
						lCreate = !oControl.oDialog.isOpen();
					} else {
						lCreate = true;
					}
				}
				
				if (lCreate) {
					oControl.oDialog.removeAllButtons();
				}
				
				for (var i in oControl.oDialogProperties.oControlProperties.buttons){
					var loModelButton = oControl.oDialogProperties.oControlProperties.buttons[i].button;
					
					var loButton;
					if (loModelButton.rendered === true) {
						if (lCreate) {
							loButton = this.createButton(loModelButton.name);
							loButton.setText(loModelButton.text);
							loButton.setEnabled(loModelButton.enabled);
							loButton.zenOkBtn = loModelButton.okBtn;
							loButton.zenCancelBtn = loModelButton.cancelBtn;
							if (loModelButton.okBtn === true) {
								loButton.addStyleClass("zenDialogOkButton");
							}
							if (loModelButton.cancelBtn === true) {
								loButton.addStyleClass("zenDialogCancelButton");
							}
							if (loModelButton.command) {
								loButton.zenOnClick = new Function(loModelButton.command);
								loButton.attachPress(loFuncPress);
							} else {
								loButton.setEnabled(false);
							}
						} else {
							loButton = sap.ui.getCore().getControl(loModelButton.name);
							
							var lEnabled = loModelButton.enabled;
							if (loModelButton.okBtn) {
								lEnabled = lEnabled && !oControl.oDialogProperties.oContentControl.hasClientError;
							}
							
							if (loModelButton.rendered === true) {
								if (loButton) {
									loButton.setEnabled(lEnabled);
									loButton.setVisible(true);
								}
							} else {
								// button may have been rendered initially, but should not be rendered any more
								// -> set existing button to visible
								if (loButton) {
									loButton.setVisible(false);
								}
							}
						}
					}
					if (lCreate && loButton) {
						oControl.oDialog.addButton(loButton);
					}
					
					if (loModelButton.statustodesigner === true) {
						if (loModelButton.command) {
							window.eclipse_setOkButtonEnabled(loModelButton.enabled);
						} else {
							window.eclipse_setOkButtonEnabled(false);
						}
					}
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
				var lIsNew = this.dispatcher.getComponentIdForControlId(oControl.oDialogProperties.oMsgComponent.content.control.id) == null;
				if (lIsNew) {
					if (oControl.oDialogProperties.oMsgComponent.id) {
						this.oTopLevelControl.aZenChildren.push(oControl.oDialogProperties.oMsgComponent.id);
					}
					
					sap.zen.MessageViewHandler.setVariableScreen(true);
					oControl.oDialogProperties.oMsgControl = this.dispatcher.dispatchCreateControl(oControl.oDialogProperties.oMsgComponent);					
					
					if (oControl.oDialogProperties.oMatrixLayout) {
						var loButtonCell = this.getMatrixLayoutCell(oControl.oDialogProperties.oMatrixLayout, 1, 0);
						loButtonCell.addContent(oControl.oDialogProperties.oMsgControl);
					} 
				} else {
					oControl.oDialogProperties.oMsgControl = this.dispatcher.getControlForId(oControl.oDialogProperties.oMsgComponent.content.control.id);
					
					this.dispatcher.dispatchUpdateControl(oControl.oDialogProperties.oMsgComponent);
					this.dispatcher.updateComponentProperties(oControl.oDialogProperties.oMsgControl, oControl.oDialogProperties.oMsgComponent);
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
			
			var loDialogFooter = this.getDialogFooter(oControl.oDialog);
			if (!loDialogFooter) {
				return;
			}
		
			// add message control to Dialog Footer
			var ltFooterContent = [];
			ltFooterContent.push(oControl.oDialogProperties.oMsgControl);
			
			var ltContent = loDialogFooter.getContent();
			if (ltContent) {
				for (var i = 0; i < ltContent.length; i++) {
					var loContent = ltContent[i];
					if (loContent && loContent !== oControl.oDialogProperties.oMsgControl) {
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
		 * Get Dialog Footer
		 */
		this.getDialogFooter = function(oDialog) {
			var loDialogFooter = sap.ui.getCore().byId(oDialog.getId() + "-footer");
			return loDialogFooter;
		};
				
		/**
		 * Open Dialog
		 */
		this.openDialog = function() {
			var loDialog = sap.zen.Dispatcher.instance.oCurrentVarDlg;
			if (loDialog) {
				loDialog.open();
			}
		};
		
		/**
		 * Dialog Content Handler: onAfterRendering
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
		};
		
		/**
		 * Add Loading Indicator
		 */
		function addLoadingIndicatorCss() {
			var lLoadingGIF = "loading.gif?1.0.0";
			if (sapbi_isMobile) {
				lLoadingGIF = "loadingMobile.gif";
			}
	
			var lContent = "margin:-20px 0px 0px -100px; background-position:center;background-repeat:no-repeat;height:40px;width:200px;"
					+ 'background-image:url('
					+ sap.zen.createStaticMimeUrl('zen.rt.client.servlet/resources/images/'+lLoadingGIF) + ');z-index:19994;position:absolute;top:50%;left:50%;';
	
			$('head').prepend('<style>.customLoadingIndicatorZenClass{' + lContent + '}</style>');
			
			that.loadingIndicatorCssHasBeenSet = true;
		};
		
		/**
		 * Create Matrix Layout
		 */
		this.createMatrixLayout = function(oControlProperties, oComponentProperties) {
			$.sap.require("sap.zen.commons.layout.MatrixLayout");
			
			var loMatrixLayout = new sap.zen.commons.layout.MatrixLayout(
					oControlProperties["id"], 
					{
						"layoutFixed": false,
						"height": "100%",
						"width": "100%"
					});
			
			loMatrixLayout.addStyleClass("zenDialogMatrixLayout");
			loMatrixLayout.fOrigOnAfterRendering = loMatrixLayout.onAfterRendering;
			
			var that = this;		
			loMatrixLayout.onAfterRendering = function () {
				if (this.fOrigOnAfterRendering) {
					this.fOrigOnAfterRendering();
				}
			
				// size calculation		
				that.calculateAndSetMatrixLayoutDialogDivSizes();
				that.setMatrixLayoutInitialSizes();
				if (that.bIsRuntimeMode) {
					that.addMsgControlToMatrixLayoutAndReorderDialogButtons();
				}
			};
			
			if (oControlProperties.onepageprompt) {
				loMatrixLayout.addStyleClass("zenDialogOnePage");
			}
			
			if (oControlProperties.toplevelcssclass.length > 0) {
				loMatrixLayout.addStyleClass(oControlProperties.toplevelcssclass);
			}
			
			this.initMatrixLayoutRootArea();
	
			return loMatrixLayout;
		};

		/**
		 * Create Matrix Layout Content Area
		 */
		this.createMatrixLayoutContentArea = function () {
			var loContentCell = new sap.zen.commons.layout.MatrixLayoutCell();
			loContentCell.addStyleClass("zenDialogContentArea");
			
			var loContentRow = new sap.zen.commons.layout.MatrixLayoutRow();
			loContentRow.addStyleClass("zenDialogContentRow");
			loContentRow.addCell(loContentCell);
			
			return loContentRow;
		};
		
		/**
		 * Create Matrix Layout Button Area
		 */
		this.createMatrixLayoutButtonArea = function () {
			var loMsgViewCell = new sap.zen.commons.layout.MatrixLayoutCell(
					{
						"hAlign": sap.zen.commons.layout.HAlign.Begin
					});
			loMsgViewCell.addStyleClass("zenDialogButtonArea");
			
			var loButtonRow = new sap.zen.commons.layout.MatrixLayoutRow();
			loButtonRow.addStyleClass("zenDialogButtonRow");	
			loButtonRow.addCell(oMsgViewCell);
							
			return loButtonRow;
		};
		
		/**
		 * Get Matrix Layout Cell
		 */
		this.getMatrixLayoutCell = function(oMatrixLayout, row, column) {
			var loRow = oMatrixLayout.getRows()[row];
			var loCell = loRow.getCells()[column];
			return loCell;
		};
		
		/**
		 * Get or Create Matrix Layout Root Area
		 */
		this.initMatrixLayoutRootArea = function () {
			var loJqMainDiv = $(document.getElementById(sap.zen.ZenDialogHandler.anchorDivId));
			if(!loJqMainDiv.length) {
				loJqMainDiv = $("<div id=\"" + sap.zen.ZenDialogHandler.anchorDivId + "\"></div>");
				$("body").append(loJqMainDiv);
			}
			
			return loJqMainDiv;
		};
		
		/**
		 * Matrix Layout Div Sizes
		 */
		this.calculateAndSetMatrixLayoutDialogDivSizes = function() {
			this.oDomContentArea = $(".zenDialogContentArea");
			this.oDomContentDiv = this.oDomContentArea.children(0);
			
			if (!this.bIsRuntimeMode) {
				var loJqDiv = this.initMatrixLayoutRootArea();
				var lDlgHeight = parseInt(loJqDiv.css("height"), 10);
							
							
				var lFixedHeight = calculateMatrixLayoutHeightOfFixedElements();
				var lContentRowHeight = lDlgHeight - lFixedHeight;
				
				var lContentDivHeight = lContentRowHeight - this.getMatrixLayoutVertPaddingAndBorderContribution(this.oDomContentArea);
				
				this.oDomContentDiv.css("height", lContentDivHeight + "px");
			} else {
				$(document.getElementById(this.oTopLevelControl.oMatrixLayout.getId())).parent().css("padding", "0px").css("height", "100%");
				this.oDomContentDiv.css("height", "100%");			
			}
		};
		
		/**
		 * Matrix Layout Height of Fixed Elements
		 */
		function calculateMatrixLayoutHeightOfFixedElements() {
			var lCalculatedHeight = getMatrixLayoutHeightByClassSelector('.zenDialogTitleRow');
			lCalculatedHeight += getMatrixLayoutHeightByClassSelector('.zenDialogButtonRow');
			lCalculatedHeight += getMatrixLayoutHeightByClassSelector('.zenDialogResizeRow');
			return lCalculatedHeight;
		};
		
		/**
		 * Matrix Layout Height By Class Selector
		 */
		function getMatrixLayoutHeightByClassSelector(sClass) {
			var lHeight = 0;
			
			var loObject = $(sClass);
			if (loObject && loObject.length > 0) {
				lHeight = loObject.outerHeight();
			}
			
			return lHeight;
		};
		
		/**
		 * Matrix Layout Padding
		 */
		this.getMatrixLayoutVertPaddingAndBorderContribution = function (oJqElement) {
			var lHeight = 0;
			var lValue;
			
			if (this.iVertPaddingAndBorderContribution === -1) {
				lValue = parseInt(oJqElement.css("padding-top"), 10);
				lHeight += (isNaN(iValue) ? 0 : lValue);
				lValue = parseInt(oJqElement.css("padding-bottom"), 10);
				lHeight += (isNaN(iValue) ? 0 : lValue);
				lValue = parseInt(oJqElement.css("border-top"), 10);
				lHeight += (isNaN(iValue) ? 0 : lValue);
				lValue = parseInt(oJqElement.css("border-bottom"), 10);
				lHeight += (isNaN(iValue) ? 0 : lValue);
				this.iVertPaddingAndBorderContribution = lHeight;
			}
			
			return this.iVertPaddingAndBorderContribution;
		};
		
		/**
		 * Matrix Layout Initial Sizes
		 */
		this.setMatrixLayoutInitialSizes = function () {
			if (this.bBrowserResize) {
				this.initialWindowHeight = parseInt($(window).innerHeight(), 10);
				this.initialWindowWidth = parseInt($(window).innerWidth(), 10);
				// subtract one px each since some browsers (Safari) have problems with
				// calculation precision and might show unwanted scrollbars after a resize
				this.contentTdHeight = parseInt(this.oDomContentArea.css("height"), 10) - 1;
				this.contentHeight = parseInt(this.oDomContentDiv.css("height"), 10) - 1;
			}
		};
		
		/**
		 * Add Message Control and Reorder Dialog Buttons
		 */
		this.addMsgControlToMatrixLayoutAndReorderDialogButtons = function() {
			var loDialog = sap.zen.Dispatcher.instance.oCurrentVarDlg;
				
			// This is some hackish stuff here because:
			// 1. We rely on the internal implementation of the m.Dialog using toolbar control as button
			//    container which we can access by the dialog's id + "-footer"
			// 2. We rely on this container not having any aggregation type checks (in contrast to the m.Dialog
			//    itself which won't let us add the m.SegmentedButton oMsgControl into its button aggregation via the addButton() API).
			//    Hence we profit from the addContent() API of that container which lets us add whatever we want.
			//    Discussion with UI5 ongoing in that regard.
			// 3. We assume that the buttons are put into that container with a Spacer object as the first element so that
			//    the spacer and buttons can be reordered to make the segmented msg view button appear to the very left
			if (loDialog && this.oTopLevelControl.oDialogProperties.oMsgControl) {
				var loDialogToolbar = this.getDialogFooter(loDialog);
				if (loDialogToolbar) {
					// put message view to the very left if any
					var ltContent = loDialogToolbar.getContent();
					if (ltContent && ltContent.length > 0) {
						var ltNewContent = [];
						ltNewContent.push(this.oTopLevelControl.oDialogProperties.oMsgControl);
						
						// spacer
						ltNewContent.push(ltContent[0]);
						for (var i = 1; i < ltContent.length; i++) {
							if (ltContent[i] !== this.oTopLevelControl.oDialogProperties.oMsgControl) {
								aNewContent.push(ltContent[i]);
							}
						}
						
						loDialogToolbar.removeAllContent();
						
						for (var i = 0; i < ltNewContent.length; i++) {
							oDialogToolbar.addContent(ltNewContent[i]);
						}
					}
				}
			}
		};
		
		/**
		 * Hook Browser Resize
		 */
		this.hookBrowserResize = function () {
			if (this.bBrowserResize === true) {
				var that = this;
				$(window).resize(function () {
					clearTimeout(that.resizeTimer);
					that.resizeTimer = setTimeout((function (that) {
						return function () {
							that.browserResizeListener();
						};
					})(that), 50);
				});
			}
		};
		
		/**
		 * Browser Resize Listener
		 */
		this.browserResizeListener = function () {
			clearTimeout(this.resizeEndTimer);
			var newHeight = parseInt($(window).innerHeight(), 10);
			var deltaY = newHeight - this.initialWindowHeight;
			var newWidth = parseInt($(window).innerWidth(), 10);
			var deltaX = newWidth - this.initialWindowWidth;
	
			if (deltaY !== 0) {
				this.contentTdHeight += deltaY;
				this.contentHeight += deltaY;
				this.initialWindowHeight = newHeight;
				this.oDomContentArea.css("height", this.contentTdHeight + "px");
				this.oDomContentDiv.css("height", this.contentHeight + "px");
			}
	
			if (deltaX !== 0) {
				this.initialWindowWidth = newWidth;
			}
	
			if (this.oTopLevelControl.oDialogProperties.oContentControl.ZEN_resize) {
				this.oTopLevelControl.oDialogProperties.oContentControl.ZEN_resize();
			}
	
			this.resizeEndTimer = setTimeout((function (that, deltaX, deltaY) {
				return function () {
					that.browserResizeEndEvent(deltaX, deltaY);
				};
			})(this, deltaX, deltaY), 100);
		};
		
		/**
		 * Browser Resize End Event
		 */
		this.browserResizeEndEvent = function (deltaX, deltaY) {
			if (this.oTopLevelControl.oDialogProperties.oContentControl.ZEN_resizeEnd) {
				this.oTopLevelControl.oDialogProperties.oContentControl.ZEN_resizeEnd(deltaX, deltaY);
			}
		};
		
		this.applyForChildren = function (oControl, funclet) {
			if (oControl.aZenChildren) {
				for (var i = 0; i < oControl.aZenChildren.length; i++) {
					var lChildId = oControl.aZenChildren[i];
					
					var loChild = this.dispatcher.getRootControlForComponentId(lChildId);
					if (loChild) {
						var lResult = funclet(loChild);
						if (lResult) {
							return lResult;
						}
					}
				}
			}
			
			return null;
		};
		  
	  /** 
	   * Get Type
	   */
	  this.getType = function() {
		  return "zendialog";
	  };
	}; // Dialog Handler
	
	/**
	 * Close Dialog
	 */
	sap.zen.ZenDialogHandler.closeDialog = function() {
		var loDialog = sap.zen.Dispatcher.instance.oCurrentVarDlg;
		if (loDialog) {
			var loDispatcherHook = loDialog.oDispatcherHook;
			sap.zen.Dispatcher.instance.dispatchRemove(loDispatcherHook);
		}
	};
	
	return new sap.zen.ZenDialogHandler();
});