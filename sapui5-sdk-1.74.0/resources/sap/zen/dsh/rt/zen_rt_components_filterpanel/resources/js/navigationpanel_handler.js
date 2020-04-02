define("zen.rt.components.filterpanel/resources/js/navigationpanel_handler",  ["sap/zen/basehandler"], function(BaseHandler) {
	"use strict";
	
var NavigationPanelHandler = function() {
	var that = this;
	var oJqCurrentDraggable;
	var oJqCurrentSortable;
	BaseHandler.apply(this, arguments);
	
	this.createSplitter = function(oConfig) {
		// create the UI5 splitter control
		var oSplitter = new sap.ui.layout.Splitter();
		oSplitter.oSplitterConfig = oConfig;
		if (oConfig.splitterOrientation === "Horizontal") {
			oSplitter.setOrientation(sap.ui.core.Orientation.Vertical);
		}
		
		//wrap methods for adding content areas to the splitter control
		oSplitter.addFirstPaneContent = function(oControl) {
			oSplitter.addContentArea(oControl);
			// set initial default width
			oControl.getLayoutData().setMinSize(oSplitter.oSplitterConfig.minSizeFirstPane);
			oControl.getLayoutData().setSize(oSplitter.oSplitterConfig.splitterPosition);
		};
		
		oSplitter.addSecondPaneContent = function(oControl) {
			oSplitter.addContentArea(oControl);
			// set initial default width
			oControl.getLayoutData().setMinSize(oSplitter.oSplitterConfig.minSizeSecondPane);
			oControl.getLayoutData().setSize("auto"); // depends on splitterPosition valid for 1st content area
		};
		
		return oSplitter;
	};
	
	this.updateSplitter = function(oSplitter) {
		if (!oSplitter) {
			return;
		}
		
		// determine size
		var lSplitterSize = 0;
		if (oSplitter.getOrientation() === "Horizontal") {
			lSplitterSize = oSplitter.getDomRef().offsetWidth;
		} else {
			lSplitterSize = oSplitter.getDomRef().offsetHeight;
		}
		
		// check if size has changed: calculate new size if necessary
		if (oSplitter.splitterSize && oSplitter.splitterSize != lSplitterSize){
			// calculate total size of content areas and determine if recalculation is required
			var lRecalculate = 0;
			var lTotalSize = 0;
			oSplitter.getContentAreas().forEach(function(oContentArea){
				// determine size of content area
				var lSize = 0;
				if (oSplitter.getOrientation() === "Horizontal") {
					lSize = oContentArea.getDomRef().offsetWidth;
				} else {
					lSize = oContentArea.getDomRef().offsetHeight;
				}
				// add to total size of content areas
				lTotalSize += lSize;
				// check if size needs to be recalculated: this is the case if size is not percentage or auto)
				if (oContentArea.getLayoutData().getSize().endsWith("px")) {
					lRecalculate += 1;
				}
			});
			
			// perform recalculation if required (new size is set in percentage)
			if (lRecalculate > 1) {
				oSplitter.getContentAreas().forEach(function(oContentArea){
					// determine size of content area
					var lSize = 0;
					if (oSplitter.getOrientation() === "Horizontal") {
						lSize = oContentArea.getDomRef().offsetWidth;
					} else {
						lSize = oContentArea.getDomRef().offsetHeight;
					}
					// calculate new size
					var lNewSize = (lSize * 100) / lTotalSize;
					// apply new size to content area
					oContentArea.getLayoutData().setSize(lNewSize + "%");
				});
			}
		}
		
		// set the new splitter size
		oSplitter.splitterSize = lSplitterSize;
	}
	
	this.createMainPanel = function(sId) {
		var oMainPanel = new sap.m.NavContainer(sId, {autoFocus: false}).addStyleClass("zenNavigationPanelM").addStyleClass("sapContrastPlus");
		var oPage = this.createPanel({});
		oMainPanel.addPage(oPage);
		oMainPanel.setTop = function(oControl) {
			oPage.setTop(oControl);
		};
		oMainPanel.setCenter = function(oControl) {
			oPage.setCenter(oControl);
		};
		oMainPanel.destroyTop = function() {
			oMainPanel.getPages()[0].destroySubHeader();
		};
		oMainPanel.destroyCenter = function() {
			oMainPanel.getPages()[0].destroyContent();
		};
		return oMainPanel;
	};
	
	this.createPanel = function(oConfig) {
		var oPanel = null;
		if (jQuery.type(oConfig) === "string") {
			oPanel = new sap.m.Page(oConfig);
		} else {
			oPanel = new sap.m.Page();
		}
		oPanel.setShowHeader(false);
		oPanel.setTop = function(oControl) {
			oPanel.setSubHeader(oControl);
		};
		oPanel.setCenter = function(oControl) {
			var aContent = oControl.content;
			if (aContent) {
				for (var i = 0; i < aContent.length; i++) {
					oPanel.addContent(aContent[i]);
				}
			}
		};
		if (oConfig.top) {
			oPanel.setTop(oConfig.top);
		}
		if (oConfig.center) {
			oPanel.setCenter(oConfig.center);
		}
		oPanel.addEventDelegate({
		    onAfterRendering:function() {
		    	var jqPanel = oPanel.$();
				if (jqPanel.closest(".sapUiSizeCompact").length === 0 && jqPanel.children("header").length > 0) { // check if runs not in Compact mode
					jqPanel.children("section").css("top", "3rem");
				}
		    }
		});
		return oPanel;
	};
	
	this.createTopArea = function(oConfig) {
		var oTop = new sap.m.Toolbar();
		var aContent = oConfig.content;
		if (oConfig.contentAlign === "right") {
			oTop.addContent(new sap.m.ToolbarSpacer());
		}
		if (aContent) {
			for (var i = 0; i < aContent.length; i++) {
				oTop.addContent(aContent[i]);
			}
		}
		return oTop;
	};
	
	this.createCenterArea = function(oConfig) {
		var oCenter = {
			content: oConfig.content ? oConfig.content : [],
			addContent: function(oContent) {
				this.content.push(oContent);
			}
		};
		return oCenter;
	};
	
	this.createSearchField = function(oConfig) {
		var oSearchField = new sap.m.SearchField();
		oSearchField.setWidth(oConfig.width);
		oSearchField.attachLiveChange(oConfig.suggest);
		return oSearchField;
	};
	
	this.createText = function(oConfig, id) {
		if (oConfig && oConfig.design) {
			delete oConfig.design;
		}
		return new sap.m.Title(id, oConfig);
	};
	
	this.createLabel = function(oConfig, id) {
		var oLabel;
		if (oConfig && oConfig.design === "Bold") {
			delete oConfig.design;
			delete oConfig.labelFor;
			oLabel = new sap.m.Title(id, oConfig);
		} else {
			oLabel = new sap.m.Label(id, oConfig);
		}
		return oLabel;
	};
	
	this.createRowRepeater = function() {
		var oRowRepeater = new sap.m.List({
			noDataText: " "
		});
		return oRowRepeater;
	};
	
	this.cloneRowRepeater = function(oOldRowRepeater) {
		var oRowRepeater = oOldRowRepeater.clone();
		return oRowRepeater;
	};
	
	this.getRowRepeaterAggregation = function() {
		return "items";
	};
	
	this.create = function(oChainedControl, oControlProperties) {
		var oControl, sNavigationPanelMode = oControlProperties.property.navigationpanelmode;
		var cssClassSuffix = "M";
		$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');
		$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-widget');
		$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-mouse');
		$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-draggable');
		$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-droppable');
		$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-sortable');
		$.sap.require("sap.ui.model.json.JSONModel");
		
		sap.zen.Dispatcher.instance.registerUnhandledDropHandler(oControlProperties.id, this.onUnhandledDrop);
		sap.zen.Dispatcher.instance.registerDragDropCancelHandler(oControlProperties.id, this.onEscKeyPressed);
		
		//prepare model
		var oJsonModel = new sap.ui.model.json.JSONModel();
		oJsonModel.setSizeLimit(Number.MAX_VALUE);
		//add client site properties
		if (!oControlProperties.navigationpanel) {
			oControlProperties.navigationpanel = {};
		}
		if (!oControlProperties.navigationpanel.apply) {
			oControlProperties.navigationpanel.apply = {};
		}
		if (!oControlProperties.navigationpanel.measures) {
			oControlProperties.navigationpanel.measures = {};
		}
		oControlProperties.navigationpanel.apply.ready = false;
		oControlProperties.navigationpanel.measures.expanded = false;
		
		this.rewriteMeasuresPosition(oControlProperties);
		
		oJsonModel.setData(oControlProperties);
		
		if (oChainedControl) {
			oControl = oChainedControl;
			oControl.destroyTop();
			oControl.destroyCenter();
		} else {
			oControl = this.createMainPanel(oControlProperties["id"]);
			var super_exit = oControl.exit;
			oControl.exit = function() {
				if (super_exit) {
					super_exit.apply(oControl, arguments);
				}
				new Function(oJsonModel.getProperty("/command/destroyfiltercomponent"))();
			};
			if (!oControlProperties.visible && !this.isDesignModeD4LIncluded()) {
				oControl.addStyleClass("zenHideFilterPanel");
			}
		}
		if (sNavigationPanelMode !== "LIST_ONLY") {
			oControl.oHorizontalSplitter = {};
			oControl.oHorizontalSplitter = this.createSplitter({
				splitterOrientation: "Vertical",
				splitterPosition: "50%",
				minSizeFirstPane: 50,
				minSizeSecondPane: 50,
				showScrollBars: false,
				width: "100%",
				height: "100%"
			});
		}
		oControl.setModel(oJsonModel);
		
		var oRowRepeater = this.createRowRepeater();

		//attach data to the RowRepeater
		oRowRepeater.bindAggregation(this.getRowRepeaterAggregation(), {
			path : "/characteristics",
			factory : that.getRowFactory(oControl, "/characteristic/name", "/characteristic/text", function(sText){return sText;}, true)
		});
		var fRowFactory = this.getRowFactory(oControl, "/entry/name", "/entry/name", function(sName) {
			var i;
			var aCharacteristics = oJsonModel.getProperty("/characteristics"), oCharacteristic;
			for (i = 0; i < aCharacteristics.length; i++) {
				oCharacteristic = aCharacteristics[i].characteristic;
				if (oCharacteristic.name === sName) {
					return oCharacteristic.text;
				}
			}
			
			var aCharNames = oJsonModel.getProperty("/charnames");
			if (aCharNames) {
				for (i = 0; i < aCharNames.length; i++) {
					oCharacteristic = aCharNames[i];
					if (oCharacteristic.name === sName) {
						return oCharacteristic.text;
					}
				}
			}
			
			var aMeasures = oJsonModel.getProperty("/measures");
			if (aMeasures) {
				for (i = 0; i < aMeasures.length; i++) {
					oCharacteristic = aMeasures[i].characteristic;
					if (oCharacteristic.name === sName) {
						return oCharacteristic.text;
					}
				}
			}
			return sName;
		});
		
		var oSearch = this.createSearchField({
			enableListSuggest: false,
			width: "100%",
			enableClear: true,
			startSuggestion: 0,
			suggest: function(oEvent){
				var sValue = oEvent.getParameter("newValue");
				var oFilter = new sap.ui.model.Filter("characteristic/text", sap.ui.model.FilterOperator.Contains, sValue);
				oRowRepeater.getBinding(that.getRowRepeaterAggregation()).filter([ oFilter ]);
			}
		});
		
		var oDimensionssLabel = this.createText({
			width: "100%",
			design: "Bold"
		}, oControl.getId() + "_dimensions_label").bindProperty("text", {
			path : "/text/dimensions",
			mode : sap.ui.model.BindingMode.OneWay,
			formatter : function(sText) {
				if (sText) {
					return sText.toUpperCase();
				}
				return "";
			}
		});
		
		var oTopArea = this.createTopArea({size: "30px", overflowX: "hidden", overflowY: "hidden", content: [oSearch]});
		var oCenterArea = this.createCenterArea({overflowX: "hidden", overflowY: "hidden"});
		var oBorderLayoutLeftBottom = this.createPanel({
			top: this.createTopArea({
				size: "30px", overflowX: "hidden", overflowY: "hidden", content: [oDimensionssLabel]
			}).addStyleClass("zenNavigationPanel-SubHeader"),
			center: this.createCenterArea({content: [oRowRepeater]})
		});
		if (oControlProperties.property && oControlProperties.property.showmeasuresseparately) {
			var oLeftSplitter = this.createSplitter({
				splitterOrientation: "Horizontal",
				splitterPosition: "40%",
				minSizeFirstPane: 50,
				minSizeSecondPane: 50,
				showScrollBars: false,
				width: "100%",
				height: "100%"
			});
			var oMatrixLayout = new sap.zen.commons.layout.MatrixLayout({widths: ["20px", "auto"]});
			var oRowRepeaterMeasures = this.createRowRepeater();
			oRowRepeaterMeasures.bindAggregation(this.getRowRepeaterAggregation(), {
				path : "/measures",
				factory : that.getRowFactory(oControl, "/characteristic/name", "/characteristic/text", function(sText){
					if (sText) {
						return sText.toUpperCase();
					}
						return "";
				}, false, function() {
					oMatrixLayout.destroyRows();
					that.changeTemplate(oControl, oMatrixLayout, {sPath: "/measures/0", oModel: oJsonModel}, true, true);
				})
			});
			var oBorderLayoutLeftTop = this.createPanel({
				top: this.createTopArea({size: "30px", overflowX: "hidden", overflowY: "hidden", content: [oRowRepeaterMeasures]}).addStyleClass("zenNavigationPanel-SubHeader"),
				center: this.createCenterArea({overflowX: "hidden", overflowY: "hidden", content: [oMatrixLayout]})
			}).addStyleClass("zenNavigationPanel-MeasuresPanel");
			oLeftSplitter.addFirstPaneContent(oBorderLayoutLeftTop);
			oLeftSplitter.addSecondPaneContent(oBorderLayoutLeftBottom);
			oCenterArea.addContent(oLeftSplitter);
		} else {
			oCenterArea.addContent(oBorderLayoutLeftBottom);
		}
		
		if (sNavigationPanelMode === "LIST_ONLY") {
			oRowRepeater.onAfterRendering = this.getDimensionsOnAfterRendering(oControl, oRowRepeater.getId());
			if (oRowRepeaterMeasures) {
				oRowRepeaterMeasures.onAfterRendering = this.getDimensionsOnAfterRendering(oControl, oRowRepeaterMeasures.getId());
			}
			oControl.setTop(oTopArea);
			oControl.setCenter(oCenterArea);
		} else {
			oControl.setCenter(this.createCenterArea({
				overflowX: "hidden", overflowY: "hidden", content: [oControl.oHorizontalSplitter]
			}));
			
			var oRowRepeaterRows = this.cloneRowRepeater(oRowRepeater);
			var oRowRepeaterColumns = this.cloneRowRepeater(oRowRepeater);
			
			oRowRepeater.onAfterRendering = this.getDimensionsOnAfterRendering(oControl, oRowRepeater.getId(), oRowRepeaterRows.getId(), oRowRepeaterColumns.getId());
			if (oRowRepeaterMeasures) {
				oRowRepeaterMeasures.onAfterRendering = this.getDimensionsOnAfterRendering(oControl, oRowRepeaterMeasures.getId(), oRowRepeaterRows.getId(), oRowRepeaterColumns.getId());
			}
			
			var fApply = function() {
				var oModel = oControl.getModel();
				var sMethod = that.prepareCommand(oModel.getProperty("/command/submitonlyfilter"), "__STRING__", JSON.stringify({
					filters : [],
					axis : oModel.getProperty("/axis")
				}));
				sMethod = that.prepareCommand(sMethod, "__BOOLEAN__", "X");
				new Function(sMethod)();
				oModel.setProperty("/navigationpanel/apply/ready", false);
			};
            oControl.ZEN_submit = fApply;
			
			oRowRepeaterRows.onAfterRendering = this.getAxisOnAfterRendering("rows", oRowRepeaterColumns.getId(), oControl, fApply);
			oRowRepeaterColumns.onAfterRendering = this.getAxisOnAfterRendering("columns", oRowRepeaterRows.getId(), oControl, fApply);
			
			oRowRepeaterRows.bindAggregation(this.getRowRepeaterAggregation(), {
				path : "/axis/rows",
				factory : fRowFactory
			});
			oRowRepeaterColumns.bindAggregation(this.getRowRepeaterAggregation(), {
				path : "/axis/columns",
				factory : fRowFactory
			});
	
			var oBorderLayoutLeft = this.createPanel({top: oTopArea, center: oCenterArea}).addStyleClass("zenNavigationPanel"+cssClassSuffix+"-BorderLayoutLeft");
			if (oControl.oHorizontalSplitter) {
				oControl.oHorizontalSplitter.addFirstPaneContent(oBorderLayoutLeft);
			}
			
			//define right side
			var oRowsLabel = this.createLabel({
				text: "{/text/ROWS}",
				design: "Bold"
			}, oControl.getId() + "_rows_label");
			
			var oTopLayoutRows = this.createTopArea({
					size: "30px",
					overflowX: "hidden", overflowY: "hidden"
				}).addStyleClass("zenNavigationPanel-SubHeader");
				
			var oBorderLayoutRows = this.createPanel({
				width: "100%", height: "100%", 
				top: oTopLayoutRows,
				center: this.createCenterArea({content: [oRowRepeaterRows]})
			});
			
			oTopLayoutRows.addContent(oRowsLabel);
			
			var oColumnsLabel = this.createLabel({
				text: "{/text/COLUMNS}",
				design: "Bold"
			}, oControl.getId() + "_columns_label");
			
			var oTopLayoutColumns = this.createTopArea({
					size: "32px",
					overflowX: "hidden", overflowY: "hidden"
				}).addStyleClass("zenNavigationPanel-SubHeader");
				
			var oBorderLayoutColumns = this.createPanel({
				width: "100%", height: "100%", 
				top: oTopLayoutColumns,
				center: this.createCenterArea({content: [oRowRepeaterColumns]})
			});

			oTopLayoutColumns.addContent(oColumnsLabel);
			
			//create a horizontal Splitter
			oControl.oVerticalSplitter = {};
			oControl.oVerticalSplitter = this.createSplitter({
				splitterOrientation: "Horizontal",
				splitterPosition: "50%",
				minSizeFirstPane: 50,
				minSizeSecondPane: 50,
				showScrollBars: false,
				width: "100%",
				height: "100%"
			}).addStyleClass("zenNavigationPanel"+cssClassSuffix+"-SplitterH");
	
			//adding Labels to both panes
			oControl.oVerticalSplitter.addFirstPaneContent(oBorderLayoutColumns);
			oControl.oVerticalSplitter.addSecondPaneContent(oBorderLayoutRows);
			
			var oldResizeSplitterElements = oControl.oVerticalSplitter.resizeSplitterElements;
			oControl.oVerticalSplitter.resizeSplitterElements = function() {
				oldResizeSplitterElements.apply(this);
				oBorderLayoutRows.invalidate();
				oBorderLayoutColumns.invalidate();
			};
			
			var oBorderLayoutRightCenter = this.createCenterArea({overflowX: "hidden", overflowY: "hidden", content: [oControl.oVerticalSplitter]});
			var oBorderLayoutRight = this.createPanel({
				width: "100%", 
				height: "100%", 
				top: this.createTopArea({
					contentAlign: "right",
					size: "30px",
					content: [new sap.m.Button(oControl.getId() + "_pause_refresh", {
						press: function () {
							var oModel = oControl.getModel();
							var sMethod = that.prepareCommand(oModel.getProperty("/command/pauserefreshcommand"), "__BOOLEAN__", oModel.getProperty("/property/pauserefresh") ? "" : "X");
							new Function(sMethod)();
						}
					}).bindProperty("text", {
						path : "/property/pauserefresh",
						mode : sap.ui.model.BindingMode.OneWay,
						formatter : function (bPauseRefresh) {
						var oModel = oControl.getModel();
						return bPauseRefresh ? oModel.getProperty("/text/refresh") : oModel.getProperty("/text/pause")
						}
					})]
				}),
				center: oBorderLayoutRightCenter
			}).addStyleClass("zenNavigationPanel"+cssClassSuffix+"-BorderLayoutRight");
			
			if (oControl.oHorizontalSplitter) {
				oControl.oHorizontalSplitter.addSecondPaneContent(oBorderLayoutRight);
			}
		}
		
		oControl.onAfterRendering = function() {
			var jqControl = this.$();
			var aTrs = $(jqControl.children("tbody")).children("tr");
			var aTrsLength = aTrs.length - 1;
			for (var i = 0; i < aTrsLength; i++) {
				var aTr = aTrs[i];
				$(aTr).css("height", "0px");
			}
		};
		
		return oControl;
	};
	
	this.rewriteMeasuresPosition = function(oControlProperties, bShowMeasuresSeparately) {
		if (oControlProperties && oControlProperties.characteristics && (bShowMeasuresSeparately || (oControlProperties.property && oControlProperties.property.showmeasuresseparately))) {
			for (var i = 0, l=oControlProperties.characteristics.length; i < l; i++) {
				var oCharacteristic = oControlProperties.characteristics[i];
				if (oCharacteristic.characteristic.measureStructure) {
					oControlProperties.measures = [oCharacteristic];
					oControlProperties.characteristics.splice(i, 1);
					break;
				}
			}
		}
	};
	
	this.getRowFactory = function(oControl, sKeyPath, sTextPath, fTextFormatter, bMarker, fCallback) {
		return function(sRowId, oContext) {
			//create the template control that will be repeated and will display the data
			var oRowTemplate = new sap.zen.commons.layout.MatrixLayout({widths: ["20px", "auto"]});
			var oModel = oContext.oModel;
			var bMeasure = oModel.getProperty(oContext.sPath + "/characteristic/measureStructure");
			var  matrixRow, markerMatrixCell, matrixCell, control;
			var sListItemId = oControl.getId() + "-" + that.createUI5Identifier(oModel.getProperty(oContext.sPath + sKeyPath));
			if (oContext.sPath.indexOf("/axis/rows") !== -1) {
				sListItemId += "-rows"
			}
			if (oContext.sPath.indexOf("/axis/columns") !== -1) {
				sListItemId += "-columns"
			}
			// main matrix
			oRowTemplate.setWidth("100%");
			// main row
			matrixRow = new sap.zen.commons.layout.MatrixLayoutRow();
	
			if (bMarker) {
				var oIcon = new sap.ui.core.Icon();
				if (bMeasure) {
					oIcon.bindProperty("src", {
						path : "/navigationpanel/measures/expanded",
						mode : sap.ui.model.BindingMode.OneWay,
						formatter : function(bExpanded) {
							if (bExpanded) {
								return "sap-icon://navigation-down-arrow";
							}
							return "sap-icon://navigation-right-arrow";
						}
					});
					oIcon.attachPress(function() {
						oModel.setProperty("/navigationpanel/measures/expanded", !oModel.getProperty("/navigationpanel/measures/expanded"));
						that.changeTemplate(oControl, oRowTemplate, oContext);
					});
					oIcon.addStyleClass("sapzenExpandMeasuresIcon");
				} else {
					oIcon.setSrc("sap-icon://accept");
					oIcon.bindProperty("color", {
						path : oContext.sPath + "/characteristic/axis",
						mode : sap.ui.model.BindingMode.OneWay,
						formatter : function(sAxis) {
							if (sAxis === "FREE") {
								return "transparent";
							}
							return "inherit";
						}
					});
				}
				markerMatrixCell = new sap.zen.commons.layout.MatrixLayoutCell({hAlign: sap.zen.commons.layout.HAlign.Center});
				markerMatrixCell.addContent(oIcon);
				matrixRow.addCell(markerMatrixCell);
			}
			
			//label
			control = that.createText();
			control.bindProperty("text", {
				path : oContext.sPath + sTextPath,
				mode : sap.ui.model.BindingMode.OneWay,
				formatter : fTextFormatter
			});

			control.onAfterRendering = function() {
				this.$().css("cursor", "move");
			};
				
			matrixCell = new sap.zen.commons.layout.MatrixLayoutCell({colSpan: 2});
			matrixCell.addContent(control);
			matrixCell.addContent(that.createLabel({width: "0px"}).bindProperty("text", {
				path : oContext.sPath + sKeyPath,
				mode : sap.ui.model.BindingMode.OneWay}
			).addStyleClass("zenDimensionId").addStyleClass("zenHideFilterPanel"));
			matrixRow.addCell(matrixCell);
			
			// add row to matrix
			oRowTemplate.addRow(matrixRow);
			
			if (bMeasure) {
				//add measures
				that.changeTemplate(oControl, oRowTemplate, oContext);
			}
			
			if (bMeasure) {
				oRowTemplate.addEventDelegate({
					onAfterRendering:function() {
						var qvTr = oRowTemplate.$().find("tr");
						qvTr.not(".zenMeasure").css("cursor", "move");
						qvTr.css("white-space","nowrap");
					}
				});
			}
			if (fCallback) {
				fCallback();
			}
			
			return new sap.m.CustomListItem(sListItemId, {
				content: [oRowTemplate]
			});
		};
	};
	
	this.changeTemplate = function(oControl, oRowTemplate, oContext, bExpand) {
		var oModel = oContext.oModel;
		if (bExpand || oModel.getProperty("/navigationpanel/measures/expanded")) {
			var aMeasures = oModel.getProperty(oContext.sPath + "/characteristic/members");
			var sCharName = oModel.getProperty(oContext.sPath + "/characteristic/name");
			var sCharAxis = oModel.getProperty(oContext.sPath + "/characteristic/axis");
			for (var i = 0; i < aMeasures.length; i++) {
				var oMeasure = aMeasures[i];
				var oMeasureIcon = new sap.ui.core.Icon({src: "sap-icon://accept"});
				oMeasureIcon.bindProperty("color", {
					path : "/filters/"+sCharName,
					mode : sap.ui.model.BindingMode.OneWay,
					formatter : that.getFilterFormatter(oMeasure.key, sCharAxis, oMeasure.parents)
				});
				var oTextCell = new sap.zen.commons.layout.MatrixLayoutCell({
					content: [
					          this.createText({text: oMeasure.text}), 
					          this.createLabel({width: "0px", text: sCharName}).addStyleClass("zenDimensionId").addStyleClass("zenHideFilterPanel"),
					          this.createLabel({width: "0px", text: oMeasure.key}).addStyleClass("zenMemberId").addStyleClass("zenHideFilterPanel")
					         ]
				});
				var oRow = new sap.zen.commons.layout.MatrixLayoutRow(oControl.getId() + "-MeasureRow-" + (oMeasure.key ? oMeasure.key.replace("!", "x") : "x"));
				oRow.addCell(new sap.zen.commons.layout.MatrixLayoutCell({
					content:[this.createText()]
				}));
				oRow.addCell(new sap.zen.commons.layout.MatrixLayoutCell({
					content:[oMeasureIcon]
				}));
				oRow.addCell(oTextCell);
				oRow.addStyleClass("zenMeasure");
				oRowTemplate.addRow(oRow);
			}
			oRowTemplate.setWidths(["20px", "20px", "auto"]);
		} else {
			while (oRowTemplate.getRows().length > 1) {
				oRowTemplate.removeRow(1).destroy();
			}
			oRowTemplate.setWidths(["20px", "auto"]);
		}
	};
	
	this.getFilterFormatter = function(sMeasureKey, sCharAxis, aParents) {
		return function(oFilters) {
			var i, j, l;
			if (sCharAxis === "FREE") {
				return "transparent";
			}
			if (oFilters) {
				if (oFilters.members && oFilters.members.length > 0) {
					for (j = 0, l=oFilters.members.length; j < l; j++) {
						var sKey = oFilters.members[j].key;
						if (sKey === sMeasureKey) {
							return oFilters.exclude ? "transparent" :"inherit";
						}
						if (aParents) {
							for (i = 0; i < aParents.length; i++) {
								if (aParents[i].key === sKey) {
									return oFilters.exclude ? "transparent" :"inherit";
								}
							}
						}
					}
					return oFilters.exclude ? "inherit" :"transparent";
				} else if (oFilters.ranges && oFilters.ranges.length > 0) {
					var bOnlyExclusions = true;
					for (j = 0, l=oFilters.ranges.length; j < l; j++) {
						var oRange = oFilters.ranges[j];
						if (oRange.operation === "EQ" || !oRange.operation) {
							sKey = oRange.from.key;
							if (sKey === sMeasureKey) {
								return oRange.exclude ? "transparent" :"inherit";
							}
							if (aParents) {
								for (i = 0; i < aParents.length; i++) {
									if (aParents[i].key === sKey) {
										return oRange.exclude ? "transparent" :"inherit";
									}
								}
							}
						}
						if (bOnlyExclusions && !oRange.exclude) {
							bOnlyExclusions = false;
						}
					}
					return bOnlyExclusions ? "inherit" :"transparent";
				}
			}
			return "inherit";
		};
	};
	
	this.isDropInPanel = function(e, sId) {
		var oRect = document.getElementById(sId).getBoundingClientRect();
		return (e.clientX >= oRect.left && e.clientX <= oRect.right && e.clientY >= oRect.top && e.clientY <= oRect.bottom);
	};
	
	this.onUnhandledDrop = function(e) {
		if (!that.isDropInPanel(e, this.getId())) {
			sap.zen.Dispatcher.instance.setDragDropCanceled(true);
		}
	};
	
	this.onEscKeyPressed = function() {
		sap.zen.Dispatcher.instance.setDragDropCanceled(true);
		if (oJqCurrentDraggable) {
			oJqCurrentDraggable.draggable().trigger("mouseup");
		}
		if (oJqCurrentSortable) {
			oJqCurrentSortable.sortable().trigger("mouseup");
		}
	};
	
	this.getDimensionsOnAfterRendering = function(oControl, sRowRepeaterId, sRowRepeaterRowsId, sRowRepeaterColumnsId) {
		return function() {
			var jqRepeaterElements = $(document.getElementById(sRowRepeaterId)).children("ul").children("li");
			var jqRowRepeater = $(document.getElementById(sRowRepeaterId));
			var sRootComponentId = oControl.getModel().getProperty("/property/rootcomponentid");
			if (!sRootComponentId) {
				sRootComponentId = "ROOT";
			}
			jqRowRepeater.find(".sapUiRrNoData").remove();
			jqRowRepeater.find(".sapMListNoData").remove();
			var oDraggable = {
				helper: function() {
					// fill context
					var dimId = that.getDimensionNameAndIdForJQElement($(this)).dimensionName;
					var oPayload = sap.zen.Dispatcher.instance.createDragDropPayload(oControl.getId());
					oPayload.oDragDropInfo.sDimensionName = dimId;
					sap.zen.Dispatcher.instance.setDragDropPayload(oPayload);
					oJqCurrentDraggable = $(this);
			        return $("<div class='zenDnDHelper'></div>").append($($(this).find('span').not(".sapUiIcon")[0]).clone());
			    },
			    appendTo: document.getElementById(BaseHandler.dispatcher.getRootControlForComponentId(sRootComponentId).getId()),
			    revert: function(ui) {
			    	if (sap.zen.Dispatcher.instance.isDragDropCanceled()) {
			    		this.context.ZENcancel = function() {
			    			var elements;
			    			if ($(document.getElementById(sRowRepeaterRowsId)).find(ui).length > 0 || $(document.getElementById(sRowRepeaterColumnsId)).find(ui).length > 0) {
					    		elements = ui.sortable("cancel").find("li");
					    		$(elements[elements.length - 1]).remove();
			    			 }
				    	};
			    		return true;
			    	}
			    	var oPayload = sap.zen.Dispatcher.instance.getDragDropPayload();
			    	if (oPayload && ui && oPayload.oInterComponentAcceptStatus[$(ui).attr("id")] === true) {
			    		return false;
			    	}
			    	//logic to determine, if the element is already in rows/columns
			    	var dimensionElement = that.getDimensionNameAndIdForJQElement($(this));
			    	if (ui) {
							var aDimensions = ui.children().not(".ui-draggable");
							var fCancel = function() {
								var elements = ui.sortable("cancel").find("li");
								$(elements[elements.length - 1]).remove();
							};
				    	for (var i = 0; i < aDimensions.length; i++) {
				    		var qvDimension = that.getDimensionNameAndIdForJQElement($(aDimensions[i]));
				    		if (sRowRepeaterRowsId && sRowRepeaterColumnsId && 
				    				(ui.attr("id") === sRowRepeaterRowsId+"-listUl" || ui.attr("id") === sRowRepeaterColumnsId+"-listUl") && 
				    				qvDimension.dimensionName === dimensionElement.dimensionName && qvDimension.id !== dimensionElement.id) {
				    			this.context.ZENcancel = fCancel;
									return true;
				    		}
							}
			    	}
			    	return false;
				},
				start: function (e) {
					//workaround. Sometimes e.isDefaultPrevented() returns true and then DnD didn't work. Happens e.g. after a value help dialog was opened...
					if (e.isDefaultPrevented && e.isDefaultPrevented() === true) {
						e.isDefaultPrevented = function(){return false};
					}
					var jqElement = $(e.toElement);
					if (jqElement.length > 0 && (jqElement.hasClass("zenMeasure") || jqElement.parents(".zenMeasure").length > 0)) {
						return false;
					}
				},
				stop: function() {
					if (this.ZENcancel) {
						this.ZENcancel();
						this.ZENcancel = undefined;
					}
				}
			};
			if (sRowRepeaterRowsId && sRowRepeaterColumnsId) {
				oDraggable.connectToSortable = "#"+sRowRepeaterRowsId + " > ul" + ", #"+sRowRepeaterColumnsId + " > ul";
			}
			jqRepeaterElements.draggable(oDraggable).disableSelection();
			var qvTr = jqRepeaterElements.find("tr");
			qvTr.not(".zenMeasure").css("cursor", "move");
			qvTr.css("white-space","nowrap");
			
			// Prevent pagebook from swapping pages when D&D
			jqRepeaterElements.mousedown(function(e) {
				sap.zen.Dispatcher.instance.closeContextMenu();
				//prevent only, if not the expand icon for measures was clicked
				if (e && (!e.target || !$(e.target).hasClass("sapzenExpandMeasuresIcon"))) {
					if (e.preventDefault) {
						e.preventDefault();
					}
					if (e.stopPropagation) {
						e.stopPropagation();
					}
					if (e.cancelBubble) {
						e.cancelBubble = true;
					}
				}
			});
			
			if (sap.ui.Device.support.touch) {
				jqRepeaterElements.bind(that.touchBindObject);
			}
		};
	};
	
	this.isOverParent = function(ui) {
		var x = ui.offset.left;
		var y = ui.offset.top;
		var h = ui.item.outerHeight();
		var b = y + h*2;
		var r = x + h;
	
		var parent = ui.item.parent();
		if (parent.length === 0) {
			parent = ui.item;
		}
		var px = parent.offset().left;
		var py = parent.offset().top;
		var ph = parent.outerHeight();
		var pw = parent.outerWidth();
		var pb = py + ph;
		var pr = px + pw;

		if (pb < y || py > b || pr < x || px > r) {
			return false;
		}
		return true;
	};
	
	this.getAxisOnAfterRendering = function(sAxis, sConnectWith, oControl, fApply) {
		var oOpositeAxis = {
			rows: "columns",
			columns: "rows"
		};
		return function() {
			var sRowRepeaterId = this.getId();
			var jqPage = $(document.getElementById(sRowRepeaterId)).children("ul");
			$(document.getElementById(sRowRepeaterId+"-body")).height("100%");
			jqPage.height("100%");
			jqPage.find(".sapUiRrNoData").remove();
			jqPage.find(".sapMListNoData").remove();
			
			var jqRow = $(document.getElementById(sRowRepeaterId)).find("li");
			jqRow.css("cursor", "move");
			jqRow.find("tr").css("white-space","nowrap");
			var iRowsHeight = jqRow.outerHeight() * (jqRow.length + 1) ;
			var jqThis = this.$();
			if(iRowsHeight === 0){
				jqThis.height("100%");
			} else {
				jqThis.height(iRowsHeight + "px");
			}
			
			var sRowOuterHeight = jqRow.outerHeight() + "px";
			jqPage.sortable({
				containment: $(document.getElementById(oControl.getId())),
				connectWith : "#"+sConnectWith + " > ul",
				tolerance: "pointer",
				helper: function(e,elem) {
					// fill context
					var oPayload = sap.zen.Dispatcher.instance.createDragDropPayload(oControl.getId());
					oPayload.oDragDropInfo.sDimensionName = "";
					sap.zen.Dispatcher.instance.setDragDropPayload(oPayload);
					oJqCurrentSortable = $(this);
			        return $("<div class='zenDnDHelper'></div>").append($(elem).find('span').clone());
			    },
			    placeholder: "zenNavDropHighlight",
			    forcePlaceholderSize: true,
			    change: function(e, ui) {
			    	ui.placeholder.css("height", sRowOuterHeight);
			    },
				stop: function(e, ui) {
					if (sap.zen.Dispatcher.instance.isDragDropCanceled()) {
						$(this).sortable("cancel");
						return;
					}
					if (!that.isOverParent(ui)) {
						var sCharName = that.getDimensionNameAndIdForJQElement(ui.item).dimensionName;
						if (sCharName) {
							var oModel = oControl.getModel();
							var aRowOrColumn = oModel.getProperty("/axis/" + sAxis);
							for (var i = 0; i < aRowOrColumn.length; i++) {
								var oneRowOrColumnName = aRowOrColumn[i].entry.name;
								if (oneRowOrColumnName === sCharName) {
									aRowOrColumn.splice(i, 1);
									oModel.setProperty("/axis/"+sAxis, aRowOrColumn);
									oModel.setProperty("/navigationpanel/apply/ready", true);
									if (!oModel.getProperty("/property/pauserefresh")) {
										fApply();
									}
									break;
								}
							}
						}
					}
				},
				appendTo: document.getElementById(oControl.getId()),
				update: function(e, ui) {
					var i, j;

					that.clearDragGhosts();
					if (sap.zen.Dispatcher.instance.isDragDropCanceled()) {
						return;
					}
					
					var aElements = $(this).find("li");
					var aNewAxis = [], aElementsToRemove = [];
					var sOppositeAxisName = oOpositeAxis[sAxis];
					var oModel = oControl.getModel();
					var aOppositeAxis = oModel.getProperty("/axis/"+sOppositeAxisName);
					for (i = 0; i < aElements.length; i++) {
						var sDimensionId = that.getDimensionNameAndIdForJQElement($(aElements[i])).dimensionName;
						if (sDimensionId) {
							var bPush = true;
							for (j = 0; j < aNewAxis.length; j++) {
								if (sDimensionId === aNewAxis[j].entry.name) {
									bPush = false;
									break;
								}
							}
							if (bPush) {
								for (j = 0; j < aOppositeAxis.length; j++) {
									if (aOppositeAxis[j].entry.name === sDimensionId) {
										aOppositeAxis.splice(j, 1);
										break;
									}
								}
								if (ui.item[0] !== aElements[i] || that.isOverParent(ui)) {
									aNewAxis.push({entry : {name : sDimensionId}});
								} else {
									aElementsToRemove.push(i);
								}
							}
						}
					}
					for (i = 0; i < aElementsToRemove.length; i++) {
						$(aElements[aElementsToRemove[i]]).remove();
					}
					var oTimeout = oModel.getProperty("/navigationpanel/timeout");
					if (oTimeout) {
						clearTimeout(oTimeout);
					}
					oModel.setProperty("/navigationpanel/timeout", setTimeout(function() {
						var oModel = oControl.getModel();
						oModel.setProperty("/axis/"+sAxis, aNewAxis);
						oModel.setProperty("/axis/"+sOppositeAxisName, aOppositeAxis);
						oModel.setProperty("/navigationpanel/apply/ready", true);
						if (!oModel.getProperty("/property/pauserefresh")) {
							fApply();
						}
						oModel.setProperty("/navigationpanel/timeout", undefined);
					}, 0));
				},
				cursor: "move"
			}).disableSelection();
			
			// Prevent pagebook from swapping pages when D&D
			jqPage.mousedown(function(e) {
				sap.zen.Dispatcher.instance.closeContextMenu();
				if (e) {
					if (e.preventDefault) {
						e.preventDefault();
					}
					if (e.stopPropagation) {
						e.stopPropagation();
					}
					if (e.cancelBubble) {
						e.cancelBubble = true;
					}
				}
			});
			
			if (sap.ui.Device.support.touch) {
				jqPage.bind(that.touchBindObject);
			}
		};
	};
	
	if (sap.ui.Device.support.touch) {
		this.getTouchToMouse = function(sMouseEvent) {
			return function(e) {
			 	var touch = e.originalEvent.changedTouches[0];
		        var mouseEvent = document.createEvent('MouseEvents');
			    e.preventDefault();
		        mouseEvent.initMouseEvent(sMouseEvent, true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY);
			    e.target.dispatchEvent(mouseEvent);
			  };
		};
		
		this.touchBindObject = {
			  touchstart: that.getTouchToMouse("mousedown"),
			  touchmove: that.getTouchToMouse("mousemove"),
			  touchend: that.getTouchToMouse("mouseup")
		};
	}
	
	this.update = function(oControl, oControlProperties, oComponentProperties) {
		if (oControl && oControlProperties) {
			var oModel = oControl.getModel();
			if (this.isDesignModeD4LIncluded() || 
				(oControlProperties.newds && oControlProperties.property && oModel.getProperty("/property/navigationpanelmode") !== oControlProperties.property.navigationpanelmode)) {
					return this.create(oControl, oControlProperties, oComponentProperties);
			}
			if (oControlProperties.newds || !oModel.getProperty("/navigationpanel/apply/ready")) {
				if (oControlProperties.charnames) {
					oModel.setProperty("/charnames", oControlProperties.charnames);
				}
				if (oControlProperties.characteristics) {
					this.rewriteMeasuresPosition(oControlProperties, oModel.getProperty("/property/showmeasuresseparately"));
					oModel.setProperty("/characteristics", oControlProperties.characteristics);
					oModel.setProperty("/measures", oControlProperties.measures);
				}
				if (oControlProperties.axis && this.axisArraysNotSame(oControlProperties.axis, oModel.getProperty("/axis"))) {
					oModel.setProperty("/axis", oControlProperties.axis);
				}
			}
			if (oControlProperties.filters) {
				oModel.setProperty("/filters", oControlProperties.filters);
			}
			if (oControlProperties.changeVisibility) {
				if (oControlProperties.visible) {
					oControl.removeStyleClass("zenHideFilterPanel");
				} else {
					oControl.addStyleClass("zenHideFilterPanel");
				}
			}
			if(typeof (DSH_deployment) !== "undefined") {
					if (!oControlProperties.pauserefresh && oControl.getModel().getProperty("/property/pauserefresh")) {
						oControl.ZEN_submit();
					}
					oControl.getModel().setProperty("/property/pauserefresh", oControlProperties.pauserefresh);
			}
			oControl.getModel().setProperty("/dsName", oControlProperties.dsName);
		}

		that.clearDragGhosts();	// clear all dragGhost DIVs that might still be hanging around
		
		if (oControl)  {
			this.updateSplitter(oControl.oHorizontalSplitter);
		}
		
		return oControl;
	};

	this.axisArraysNotSame = function(aAxis1, aAxis2) {
		var aAxisNames = ["rows", "columns"];
		if (aAxis1 && aAxis2) {
			for (var n = 0; n < 2; n++) {
				var sAxisName = aAxisNames[n];
				if (aAxis1[sAxisName].length === aAxis2[sAxisName].length) {
					for (var i = 0; i < aAxis1[sAxisName].length; i++) {
						if (aAxis1[sAxisName][i].entry.name !== aAxis2[sAxisName][i].entry.name) {
							return true;
						}
					}
				} else {
					return true;
				}
			}
			return false;
		}
		return true;
	};
	
	this.getContextMenuAction = function(sContextMenuComponentId, oClickedUI5Component, oDomClickedElement) {
		var sCommand = oClickedUI5Component.getModel().getProperty("/command/createcontextmenu");
		if (sCommand) {
			var sClickedTag = oDomClickedElement.prop("tagName").toLowerCase();
			
			var sDimensionName;
			var sMemberName;
			if (sClickedTag === "label" || sClickedTag === "span") {
				sDimensionName = that.getDimensionNameAndIdForJQElement(oDomClickedElement.parent(), false, true).dimensionName;
				sMemberName = that.getDimensionNameAndIdForJQElement(oDomClickedElement.parent(), true, true).dimensionName;
			} 
			else if (sClickedTag === "td") {
				sDimensionName = that.getDimensionNameAndIdForJQElement(oDomClickedElement).dimensionName;
				sMemberName = that.getDimensionNameAndIdForJQElement(oDomClickedElement.parent(), true).dimensionName;
			}
			
			if (sDimensionName) {
				var sMethod = that.prepareCommand(sCommand, "__STRING__", sContextMenuComponentId);
				sMethod = that.prepareCommand(sMethod, "__STRING2__", sDimensionName);
				sMethod = that.prepareCommand(sMethod, "__STRING3__", sMemberName);
				sMethod = that.prepareCommand(sMethod, "__STRING4__", oDomClickedElement[0].id);
				return new Function(sMethod);
			}
		}
		return null;
	};
	
	this.isDesignModeD4LIncluded = function(){
		return sap.zen.designmode;
	};
	
	this.getType = function() {
		return "navigationpanel";
	};
	
	this.getDecorator = function() {
		return "DataSourceControlDecorator";
	};

	// clear all DragGhosts that are still around. In some cases the draggable.stop() function
	// is not called and so the DragGhost is not cleared. This happens usually when the user 
	// is dragging quickly one after another. In that case the drag is disrupted by a loading of 
	// e.g. the crosstab. 
	this.clearDragGhosts = function() {
		$('div.zenDnDHelper').remove();
	}

	this.getDimensionNameAndIdForJQElement = function (jqElement, bMember, bSibling) {
		var dimIdElem = bSibling ? jqElement.siblings(bMember ? ".zenMemberId" : ".zenDimensionId") : jqElement.find(bMember ? ".zenMemberId" : ".zenDimensionId");
		var control = dimIdElem.control(0);
		return {
			dimensionName: control && control.getText(),
			id: dimIdElem.attr("id")
		}
	}
};

var instance = new NavigationPanelHandler();
return instance;

});