/*/
 * Created on 19.04.2019.
 * Copyright(c) 2019 SAP SE
 */
/*global sap */

sap.ui.define([
	"sap/m/VBox",
	"sap/m/FlexBox",
	"sap/m/Text",
	"sap/m/FlexAlignItems",
	"sap/m/FlexJustifyContent",
	'sap/apf/ui/utils/constants',
	'sap/apf/utils/trace'
], function (mVBox, mFlexBox, mText, mFlexAlignItems, mFlexJustifyContent, UiUtilsConstants, trace) {
	'use strict'

	var itemChartHeightWithTexts = "120px";
	var itemChartWidthWithTexts = "200px";
	var previewChartWidthWithTexts = "80px";
	var previewChartHeightWithTexts = "100px";
	var previewChartWidthWithTexts = "150px";
	var activeBoxStyleName = "carouselActiveBorderedChartWithCornerTexts";
	var inactiveBoxStyleName = "carouselBorderedChartWithCornerTexts";
	var cloneCnt = 0;

	function isTreeTable(oRepr){
		return oRepr.type === UiUtilsConstants.representationTypes.TREE_TABLE_REPRESENTATION;
	}
	function isIconDisplayed (oRepr){
		return oRepr.type === UiUtilsConstants.representationTypes.TABLE_REPRESENTATION
			|| oRepr.type === UiUtilsConstants.representationTypes.TREE_TABLE_REPRESENTATION
			|| oRepr.bIsAlternateView === true // is a listView by a table
			;
	}
	function getClonedChart (oStep) {
		trace.logCall("getClonedChart");
		var oRepr = oStep.getSelectedRepresentation();
		var oOriginalChart = oRepr.chart;
		var originalProperties;
		var oClonedChart;
		if (module.isIconDisplayed(oRepr)) {
			trace.logReturn("getClonedChart", " return createIconThumbnail()");
			return module.createIconThumbnail(oRepr);
		}
		if (!oOriginalChart) { // if not yet available as in case of openPath then use thumbnail chart
			oOriginalChart = oRepr.getChartForCustomListItem();
			trace.log("getClonedChart", ",  switches to substitute for main chart ", ", cloning:", (oRepr.chart4CustomItemList) ? oRepr.chart4CustomItemList.sId : "undefined");
			oClonedChart = oRepr.chart4CustomItemList.clone(1000 + cloneCnt++); // decouple from side effects on thumbnail
		} else {
			trace.log("getClonedChart", " takes oRepr.chart", ", cloning:", oOriginalChart.sId);
			oClonedChart = oOriginalChart.clone(cloneCnt++); // must not side effect the main chart
			if (oRepr.fnHandleSelection) {
				oClonedChart.detachSelectData(oRepr.fnHandleSelection); // vizSelection changes selection, trigger path update.
				oClonedChart.detachDeselectData(oRepr.fnHandleDeselection);
			}
		}
		if (oOriginalChart.getVizProperties) { // not copied by clone()
			originalProperties = oOriginalChart.getVizProperties();
		}
		if (oClonedChart.getVizProperties) {
			oClonedChart.setVizProperties(originalProperties); // necessary since after clone getVizProperties returns === {}
			module.setAllLabelsInvisible(oClonedChart);
			module.setAllAxisInvisible(oClonedChart);
		} else {
			trace.emphasize("getClonedChart", " cannot set setVizProperties since method is missing");
		}
		trace.logReturn("getClonedChart", " cloned ID=" + (oClonedChart ? oClonedChart.sId : "-"));
		return oClonedChart
	}
	function createIconThumbnail (oRepr) {
		var iconSource = "sap-icon://table-chart";
		if (module.isTreeTable(oRepr)){
			iconSource = "sap-icon://tree"
		}
		// the following returns an icon which will be decorated in old style
		var oTableIcon = new sap.ui.core.Icon({
			src: iconSource,
			size: "400%"
		}).addStyleClass('carouselTableIconOldStyle');
		return oTableIcon;
	}

	function setAllAxisInvisible (oChart) {
		var properties = oChart.getVizProperties();
		properties.title = {
			visible : false
		};
		properties.categoryAxis = {
			visible : false
		};
		properties.valueAxis = {
			visible : false
		};
		properties.categoryAxis2 = {
			visible : false
		};
		properties.valueAxis2 = {
			visible : false
		};
	}
	function setAllLabelsInvisible (oChart){
		var properties = oChart.getVizProperties();
		if(properties){
			Object.keys(properties).forEach(function(key){
				if(properties[key].label){
					properties[key].label.visible = false;
				}
			});
		}
		properties.legend = {// test manually: legend not shown any more after representation changes
			visible : false,
			title : {
				visible : false
			}
		};
		properties.timeAxis = {
			visible : false,
			title : {
				visible : false
			}
		};
		properties.plotArea = {
			window : {
				start : "firstDataPoint",
				end : "lastDataPoint"
			}
		};
		properties.interaction = {
			noninteractiveMode: true,
			selectability: false
		};
		if (properties.toolTip) {
			properties.toolTip.visible = false
		}
		if(!properties.general || !properties.general.layout) {
			properties.general = {
				layout: {}
			}
		}
		properties.general.layout.paddingLeft = this.paddingLeft;
		properties.general.layout.paddingRight = this.paddingRight;
		properties.general.layout.paddingBottom = this.paddingBottom;
		properties.general.layout.paddingTop = this.paddingTop;
		oChart.setVizProperties(properties);
	}

	function getStepTitleText(oCoreApi, oStep) {
		var oTitle = oStep.longTitle && !oCoreApi.isInitialTextKey(oStep.longTitle.key) ? oStep.longTitle : oStep.title;
		return oCoreApi.getTextNotHtmlEncoded(oTitle);
	}

	function createTopLayoutWithCornerTexts(that, oCornerTexts) {
		that.oTopLayout = new mFlexBox({
			items: [new mText({
				text: oCornerTexts.leftUpper,
				tooltip: oCornerTexts.leftUpper,
				wrapping: true,
				maxLines: 2,
				textAlign: sap.ui.core.TextAlign.Left
			}).addStyleClass("thumbanilText"), new mText({
				text: oCornerTexts.rightUpper,
				tooltip: oCornerTexts.rightUpper,
				wrapping: true,
				maxLines: 2,
				textAlign: sap.ui.core.TextAlign.Right
			}).addStyleClass("thumbanilText")],
			alignItems: mFlexAlignItems.Start,
			justifyContent: mFlexJustifyContent.SpaceBetween
		}).addStyleClass("topLayout");
	}
	function createBottomLayoutWithCornerTexts(that, oCornerTexts) {
		that.oBottomLayout = new mFlexBox({
			items: [new mText({
				text: oCornerTexts.leftLower,
				tooltip: oCornerTexts.leftLower,
				wrapping: true,
				maxLines: 2,
				textAlign: sap.ui.core.TextAlign.Left
			}).addStyleClass("thumbanilText"), new mText({
				text: oCornerTexts.rightLower,
				tooltip: oCornerTexts.rightLower,
				wrapping: true,
				maxLines: 2,
				textAlign: sap.ui.core.TextAlign.Right
			}).addStyleClass("thumbanilText")],
			alignItems: mFlexAlignItems.Start,
			justifyContent: mFlexJustifyContent.SpaceBetween
		}).addStyleClass("bottomLayout");
	}
	function wrapTheChart(that, oClonedChart){
		that.oThumbnailChartLayout = new mVBox({
			items: [oClonedChart],
			alignItems: sap.ui.core.TextAlign.Center
		}).addStyleClass('carouselChartVerticalBox');
	}
	function createTitleBox(that, titleText){
		that.oStepTitle = new mText({
			text: "\n" + titleText,
			wrapping: true,
			maxLines: 2
		}).addStyleClass('carouselThumbnailTitle');
	}
	function createBoxForTextsAndChart(that, oStep, stepIsActive){
		that.oThumbnailVLayout = new mVBox({ // the surrounding box which carries a border.
			items: [that.oTopLayout, that.oThumbnailChartLayout, that.oBottomLayout]
		}).addStyleClass(inactiveBoxStyleName); //default inactive
		if (stepIsActive) {
			that.setHighlighted();
		}
	}
	function createBoxWithTitleAndRest(that){
		return new mVBox({
			items: [that.oStepTitle, that.oThumbnailVLayout]
		}).addStyleClass("carouselItemVerticalLayout");
	}
	function _setSizeOfChart(oClonedChart, isPreview){
		if (oClonedChart){
			if (isPreview) {
				oClonedChart.setHeight(previewChartHeightWithTexts);
				oClonedChart.setWidth(previewChartWidthWithTexts);
			} else {
				oClonedChart.setHeight(itemChartHeightWithTexts);
				oClonedChart.setWidth(itemChartWidthWithTexts);
			}
		}
	}
	/**
	 * Protected method. Each instance exposes all boxes by members. Required for changing styles.
	 * Its private member oItemVerticalLayout is the topmost view used to visualize the thumbnail and used as content in the custom list item.
	 * The member oThumbnailVLayout is used to highlight the selected step of a path.
	 * @param controller carousel.controller
	 * @param oStep
	 * @param oClonedChart
	 * @param parameter in preview mode there is no carousel.controller, and hence information is passed through this object.
	 * @constructor
	 */
	function WrappedChartWithCornerTexts(controller, oStep, oClonedChart, parameter) {
		//fixme test that when active step then setHighlighted is called.
		parameter = parameter || {};
		var oItemVerticalLayout;
		var oCornerTexts = {},
			stepIsActive = false,
			titleText = "initial";
		var isPreview = parameter.mode === "preview";
		if (!isPreview){
			oCornerTexts = controller.getStepData(oStep).oStepTexts;
			titleText = getStepTitleText(controller.oCoreApi, oStep);
			stepIsActive = controller.oCoreApi.stepIsActive(oStep);
		} else {
			oCornerTexts = parameter.oCornerTexts;
			titleText = parameter.titleText;
		}
		var isHighlighted = true;
		this.setHighlighted = function () {
			isHighlighted = true;
			this.oThumbnailVLayout.removeStyleClass(inactiveBoxStyleName);
			this.oThumbnailVLayout.addStyleClass(activeBoxStyleName);
		};
		this.setNonHighlighted = function () {
			isHighlighted = false;
			this.oThumbnailVLayout.removeStyleClass(activeBoxStyleName);
			this.oThumbnailVLayout.addStyleClass(inactiveBoxStyleName);
		};
		this.isHighlighted = function() {
			return isHighlighted;
		};
		this.getContent = function() {
			return oItemVerticalLayout;
		};
		//
		_setSizeOfChart(oClonedChart, isPreview);
		createTopLayoutWithCornerTexts(this, oCornerTexts);
		createBottomLayoutWithCornerTexts(this, oCornerTexts);
		wrapTheChart(this, oClonedChart);
		createTitleBox(this, titleText);
		createBoxForTextsAndChart(this, oStep, stepIsActive);
		oItemVerticalLayout = createBoxWithTitleAndRest(this);
	}
	var module = {
		constructor: WrappedChartWithCornerTexts,
		itemChartHeightWithTexts : itemChartHeightWithTexts,
		itemChartWidthWithTexts : itemChartWidthWithTexts,
		activeBoxStyleName : activeBoxStyleName,
		inactiveBoxStyleName : inactiveBoxStyleName,
		createIconThumbnail : createIconThumbnail,
		setAllAxisInvisible : setAllAxisInvisible,
		setAllLabelsInvisible : setAllLabelsInvisible,
		getClonedChart : getClonedChart,
		isIconDisplayed : isIconDisplayed,
		isTreeTable : isTreeTable
	};
	return module;
});
