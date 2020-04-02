/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides control sap.makit.CombinationChart.
sap.ui.define([
	"./library",
	"./MakitLib",
	"./CategoryAxis",
	"./ValueAxis",
	"./ValueBubble",
	"./CombinationChartRenderer",
	"sap/ui/core/Control",
	"sap/ui/core/Element",
	"sap/ui/core/RenderManager",
	"sap/ui/core/ResizeHandler",
	"sap/ui/thirdparty/jquery",
	"sap/base/assert"
], function(
	makitLibrary,
	MakitLib,
	CategoryAxis,
	ValueAxis,
	ValueBubble,
	CombinationChartRenderer,
	Control,
	Element,
	RenderManager,
	ResizeHandler,
	jQuery,
	assert
) {
    "use strict";

	// shortcut for sap.makit.ChartType
	var ChartType = makitLibrary.ChartType;

	// shortcut for sap.makit.LegendPosition
	var LegendPosition = makitLibrary.LegendPosition;


	/**
	 * Constructor for a new CombinationChart.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The CombinationChart control.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 *
	 * @public
	 * @since 1.12
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 * @alias sap.makit.CombinationChart
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CombinationChart = Control.extend("sap.makit.CombinationChart", /** @lends sap.makit.CombinationChart.prototype */ { metadata : {

		deprecated : true,
		library : "sap.makit",
		properties : {

			/**
			 * The width of the Chart
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},

			/**
			 * The height of the Chart
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},

			/**
			 * Specify whether the range selector should be visible.
			 */
			showRangeSelector : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * Legend position for Pie /Donut chart only.
			 */
			legendPosition : {type : "sap.makit.LegendPosition", group : "Misc", defaultValue : LegendPosition.Left},

			/**
			 * Allow a combination chart’s primary axis color palette to be modified without affecting other charts' color palette. If not set, the chart will use the default color palette defined in the theme.
			 * Accept an array of color in string format or hex format. e.g.
			 * 0xff0000
			 * "red"
			 * "rgb(255,0,0)"
			 */
			primaryColorPalette : {type : "any", group : "Misc", defaultValue : null},

			/**
			 * Allow a combination chart’s secondary axis color palette to be modified without affecting other charts' color palette. If not set, the chart will use the default color palette defined in the theme.
			 * Accept an array of color in string format or hex format. e.g.
			 * 0xff0000
			 * "red"
			 * "rgb(255,0,0)"
			 */
			secondaryColorPalette : {type : "any", group : "Misc", defaultValue : null},

			/**
			 * Toggle to display the table value on a Bar chart. Only applies to Bar chart.
			 */
			showTableValue : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * The number of categories that will be visible on the chart at any time. The minimum value is 2. If not set, the number of visible categories will be automatically adjusted depending on the screen size
			 */
			numberOfVisibleCategories : {type : "int", group : "Misc", defaultValue : null},

			/**
			 * Specify the range selector start position, default value is 0.
			 */
			rangeSelectorStartPosition : {type : "int", group : "Misc", defaultValue : 0}
		},
		aggregations : {

			/**
			 * Data region property of the chart's Categories
			 * @deprecated Since version 1.38.
			 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
			 */
			categoryRegions : {type : "sap.makit.Category", multiple : true, singularName : "categoryRegion", deprecated: true},

			/**
			 * The collection of charts
			 * @deprecated Since version 1.38.
			 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
			 */
			layers : {type : "sap.makit.Layer", multiple : true, singularName : "layer", deprecated: true},

			/**
			 * Category Axis property of the Chart. Accepts only an instance of CategoryAxis element.
			 * @deprecated Since version 1.38.
			 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
			 */
			categoryAxis : {type : "sap.makit.CategoryAxis", multiple : false, deprecated: true},

			/**
			 * Property of the Combination Chart's primary Value Axis. Accept only an instance of ValueAxis element.
			 * @deprecated Since version 1.38.
			 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
			 */
			primaryValueAxis : {type : "sap.makit.ValueAxis", multiple : false, deprecated: true},

			/**
			 * Property of the Combination Chart's secondary Value Axis. Accept only an instance of ValueAxis element.
			 * @deprecated Since version 1.38.
			 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
			 */
			secondaryValueAxis : {type : "sap.makit.ValueAxis", multiple : false, deprecated: true},

			/**
			 * Value Bubble property of the Chart. Accept only an instance of ValueBubble element.
			 * @deprecated Since version 1.38.
			 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
			 */
			valueBubble : {type : "sap.makit.ValueBubble", multiple : false, deprecated: true}
		},
		events : {

			/**
			 * Double tap event on the chart
			 */
			doubletap : {},

			/**
			 * Single tap event on the chart
			 */
			tap : {},

			/**
			 * Long press event on the chart
			 */
			longpress : {}
		}
	}});

	/**
	 * @override
	 */
	CombinationChart.prototype.init = function() {
		//Private variable
		this._makitChart = null;

		this._parentCurrentHeight = 0;
		this._selectedCatIdx = 0;

		this._datarows = []; //This is the placeholder for the Chart's data row it's a 1-to-1 mapping to rows aggregation.
		this._styleClasses = []; //workaround for custom classes

		this.setCategoryAxis(new CategoryAxis());
		this.setPrimaryValueAxis(new ValueAxis());
		this.setSecondaryValueAxis(new ValueAxis());
		this.setValueBubble(new ValueBubble());

		this.attachEvent("_change", this._onPropertyChanged);
		sap.ui.getCore().attachThemeChanged(this._applyCSS, this);
	};

	/**
	 * Attempt to preserve the chart's DOM reference before re-rendering it
	 * @override
	 */
	CombinationChart.prototype.onBeforeRendering = function(oEvent) {
		this.fireEvent("_beforeRendering", this);
		if (this.getDomRef() && !RenderManager.isPreservedContent(this.getDomRef())){
			RenderManager.preserveContent(this.getDomRef(), /* bPreserveRoot */ true, /* bPreserveNodesWithId */ false);
		}
	};

	/**
	 * Once the place holder is rendered, we will create the MAKit chart object or
	 * retrieve the preserved chart DOM reference if exists.
	 * @override
	 */
	CombinationChart.prototype.onAfterRendering = function(oEvent) {
		this.fireEvent("_afterRendering", this);
		var $placeholder = jQuery(document.getElementById("sap-ui-dummy-" + this.getId()));
		var $oldContent = RenderManager.findPreservedContent(this.getId());
		var $newContent = null;
		if (this.getLayers().length > 0) {
			if ($oldContent.size() == 0) {
				this.fireEvent("_createMAKitObject", this);
				$newContent = new jQuery(this.getDomRef());
				$placeholder.replaceWith($newContent);
				this._createChartObject();
				var parentDom = document.getElementById(this.getParent().getId());
				this._parentCurrentHeight = parentDom.offsetHeight;
				ResizeHandler.register(parentDom, jQuery.proxy(this._onResize, this));
			} else if ( $oldContent.size() > 0 ) {
				this.fireEvent("_restoreMAKitObject", this);
				// replace dummy with old content
				$placeholder.replaceWith($oldContent);
			}

			if ($newContent) {
				//this._makitChart.showRangeSelectorView(this.getShowRangeSelector());
				this._makitChart.setPalette(this.getPrimaryColorPalette(), "primaryaxis");
				this._makitChart.setPalette(this.getSecondaryColorPalette(), "secondaryaxis");
				//this._makitChart.showTableValue(this.getShowTableValue());
				this._makitChart.setNumberOfVisibleCategories(this.getNumberOfVisibleCategories());
				this._makitChart.setRangeSelectorStartPosition(this.getRangeSelectorStartPosition());
				this._setDataTable();
			}
		}
	};

	/**
	 * WORKAROUND: MAKit chart current behavior overwrite the div's css class when it's created
	 *				So we need to intercept addition of custom style classes before
	 *				this._makitChart is created.
	 * @override
	 */
	CombinationChart.prototype.addStyleClass = function(sStyleClass, bSuppressRerendering) {
		 //If it's already in the control, then it is in the _styleClasses array
		if (this._styleClasses.indexOf(sStyleClass) === -1) {
			this._styleClasses.push(sStyleClass);
		}

		if (this._makitChart) {
			Control.prototype.addStyleClass.call(this, sStyleClass, bSuppressRerendering);
		}
		return this;
	};

	/**
	 * @override
	 */
	CombinationChart.prototype.removeStyleClass = function(sStyleClass, bSuppressRerendering) {
		var idx = this._styleClasses.indexOf(sStyleClass);
		if (idx > -1) {
			this._styleClasses.splice(idx, 1);
		}

		if (this._makitChart) {
			Control.prototype.removeStyleClass.call(this, sStyleClass, bSuppressRerendering);
		}
		return this;
	};

	/**
	 * @override
	 */
	CombinationChart.prototype.addLayer = function(oLayer){
		if (this._makitChart) {
			throw new Error("Cannot add layer once the chart has been rendered");
		}
		this._checkLayer(oLayer);

		Element.prototype.addAggregation.call(this, "layers", oLayer, false);
		oLayer.attachEvent("rowsUpdated", this._setDataTable, this);
		oLayer.attachEvent("dataRegionChanged", this._onDataRegionPropChanged, this);
		oLayer.attachEvent("_change", this._onLayerPropertyChanged, this);
		return this;
	};

	/**
	 * @override
	 */
	CombinationChart.prototype.insertLayer = function(oLayer, iIndex){
		if (this._makitChart) {
			throw new Error("Cannot add layer once the chart has been rendered");
		}
		this._checkLayer(oLayer);

		Element.prototype.insertAggregation.call(this, "layers", oLayer, iIndex, false);
		oLayer.attachEvent("rowsUpdated", this._setDataTable, this);
		oLayer.attachEvent("dataRegionChanged", this._onDataRegionPropChanged, this);
		oLayer.attachEvent("_change", this._onLayerPropertyChanged, this);
		return this;
	};

	/**
	 * @override
	 */
	CombinationChart.prototype.removeLayer = function(oLayer){
		if (this._makitChart) {
			throw new Error("Cannot remove layer once the chart has been rendered");
		}
		var removedObj = Element.prototype.removeAggregation.call(this, "layers", oLayer, false);
		if (removedObj != null) {
			removedObj.detachEvent("rowsUpdated", this._setDataTable, this);
			removedObj.detachEvent("dataRegionChanged", this._onDataRegionPropChanged, this);
			removedObj.detachEvent("_change", this._onLayerPropertyChanged, this);
		}
		return removedObj;
	};

	/**
	 * @override
	 */
	CombinationChart.prototype.removeAllLayers = function(){
		if (this._makitChart) {
			throw new Error("Cannot remove layers once the chart has been rendered");
		}
		var removedObjs = Element.prototype.removeAllAggregation.call(this, "layers", false);
		var len = removedObjs.length;
		var i;
		for ( i = 0; i < len; i++){
			removedObjs[i].detachEvent("rowsUpdated", this._setDataTable, this);
			removedObjs[i].detachEvent("dataRegionChanged", this._onDataRegionPropChanged, this);
			removedObjs[i].detachEvent("_change", this._onLayerPropertyChanged, this);
		}
		return removedObjs;
	};

	CombinationChart.prototype._checkLayer = function(oLayer){
		var layers = this.getLayers();
		var layersCount = layers.length;
		var i;
		if (oLayer.getType() == ChartType.Line){
			for (i = 0; i < layersCount; i++) {
				if (layers[i].getType() == ChartType.Bar){
					oLayer.setLineType("verticalline");
					break;
				}
				else {
					oLayer.setLineType("line");
				}
			}
		}
		else {
			for (i = 0; i < layersCount; i++) {
				if (layers[i].getType() != ChartType.Line){
					throw new Error("Cannot combine 2 different non-line chart type");
				}
			}

			for (i = 0; i < layersCount; i++) {
				if (layers[i].getType() == ChartType.Line){
					if (oLayer.getType() == ChartType.Bar){
						layers[i].setLineType("verticalline");
					}
					else {
						layers[i].setLineType("line");
					}
				}
			}
		}
	};

	/**
	 * @override
	 */
	CombinationChart.prototype.setValueBubble = function(oValueBubble){
		if (oValueBubble instanceof ValueBubble) {
			Element.prototype.setAggregation.call(this, "valueBubble", oValueBubble, false);
			oValueBubble.attachEvent("_change", this._onValueBubbleChanged, this);
			if (this._makitChart) {
				var valueBubbleObj = oValueBubble.toObject();
				this._makitChart.setValueBubbleStyle(valueBubbleObj);
				if (this._makitChart.isValueBubbleVisible() != valueBubbleObj.visible) {
					this._makitChart.showValueBubble(valueBubbleObj.visible);
				}
			}
		}
		else {
			throw new Error("valueBubble property must be of type sap.makit.ValueBubble");
		}
		return this;
	};

	/**
	 * @override
	 */
	CombinationChart.prototype.addCategoryRegion = function(oCategory){
		Element.prototype.addAggregation.call(this, "categoryRegions", oCategory, false);
		oCategory.attachEvent("_change", {type: "categories"}, this._onDataRegionPropChanged, this);
		return this;
	};

	/**
	 * @override
	 */
	CombinationChart.prototype.insertCategoryRegion = function(oCategory, iIndex){
		Element.prototype.insertAggregation.call(this, "categoryRegions", oCategory, iIndex, false);
		oCategory.attachEvent("_change", {type: "categories"}, this._onDataRegionPropChanged, this);
		return this;
	};

	/**
	 * @override
	 */
	CombinationChart.prototype.removeCategoryRegion = function(oCategory){
		var removedObj = Element.prototype.removeAggregation.call(this, "categoryRegions", oCategory, false);
		if (removedObj != null) {
			oCategory.detachEvent("_change", this._onDataRegionPropChanged, this);
		}
		return removedObj;
	};

	/**
	 * @override
	 */
	CombinationChart.prototype.removeAllCategoryRegions = function(){
		var removedObjs = Element.prototype.removeAllAggregation.call(this, "categoryRegions", false);
		var len = removedObjs.length;
		var i;
		for ( i = 0; i < len; i++){
			removedObjs[i].detachEvent("_change", this._onDataRegionPropChanged, this);
		}
		return removedObjs;
	};

	/**
	 * @override
	 */
	CombinationChart.prototype.setPrimaryValueAxis = function (oValueAxis){
		if (oValueAxis instanceof ValueAxis) {
			Element.prototype.setAggregation.call(this, "primaryValueAxis", oValueAxis, false);
			oValueAxis.attachEvent("_change", { axis:"values", secondaryAxis: false }, this._onAxisPropChanged, this);
		}
		else {
			throw new Error("primaryValueAxis property must be of type sap.makit.ValueAxis");
		}
		return this;
	};

	/**
	 * @override
	 */
	CombinationChart.prototype.setSecondaryValueAxis = function (oValueAxis){
		if (oValueAxis instanceof ValueAxis) {
			Element.prototype.setAggregation.call(this, "secondaryValueAxis", oValueAxis, false);
			oValueAxis.attachEvent("_change", { axis:"values", secondaryAxis: true }, this._onAxisPropChanged, this);
		}
		else {
			throw new Error("secondaryValueAxis property must be of type sap.makit.ValueAxis");
		}
		return this;
	};

	/**
	 * @override
	 */
	CombinationChart.prototype.setCategoryAxis = function (oCategoryAxis){
		if (oCategoryAxis instanceof CategoryAxis) {
			Element.prototype.setAggregation.call(this, "categoryAxis", oCategoryAxis, false);
			oCategoryAxis.attachEvent("_change", { axis:"category" }, this._onAxisPropChanged, this);
		}
		else {
			throw new Error("categoryAxis property must be of type sap.makit.CategoryAxis");
		}
		return this;
	};

	/*=================================================================================
	 *== PRIVATE METHODS
	 *=================================================================================
	 **/

	/**
	 * Set the Chart's height. Canvas does not support % height,
	 * so it need to have an absolute height
	 *
	 * @return true, if the height is using % value, false otherwise
	 *
	 * @private
	 *
	 * */
	CombinationChart.prototype._setRealHeight = function(height){
		var elem = this.getDomRef();
		var prevHeight = elem.style.height;
		var newHeight = "0px";
		if (height.indexOf("%") > -1) {
			var parentDom = document.getElementById(this.getParent().getId());
			var intHeight = parseInt(height);
			var realHeight = Math.ceil(parentDom.offsetHeight * (intHeight / 100));
			newHeight = realHeight + "px";
		}
		else {
			newHeight = height;
		}

		if (prevHeight != newHeight){
			elem.style.height = newHeight;
		}
	};

	/**
	 * Create and initialize the MAKit $MA.Chart object
	 *
	 * @private
	 *
	 * */
	CombinationChart.prototype._createChartObject = function (){
		var elem = this.getDomRef();
		assert(elem, "Chart's DomRef is not ready");

		elem.style.width = this.getWidth();
		this._setRealHeight(this.getHeight());

		this._makitChart = new window.$MA.Chart(this.getId(), true);
		var that = this;
		this._makitChart.bind("initialized", function() {
			that._makitChart.showToolBar(false);
			that._setMakitChartProperties();
		});

		this._makitChart.bind("beforerender", function() {
			that.fireEvent("_makitBeforeRender", that);
		});

		this._makitChart.bind("renderstart", function() {
			that.fireEvent("_makitRenderStart", that);
		});

		this._makitChart.bind("renderend", function() {
			that.fireEvent("_makitRenderEnd", that);
		});

		this._makitChart.bind("animationend", function() {
			that.fireEvent("_makitAnimationEnd", that);
		});

		var syntax = this._getChartSyntax();

		this._makitChart.create(syntax);
		this._makitChart.bind("tap", function(param) {
			that._selectedCatIdx = that._makitChart.getSelectedCategoryIndex();
			that.fireTap(param);
		});
		this._makitChart.bind("doubletap", function(param) {
			that.fireEvent("doubletap", param);
		});
		this._makitChart.bind("longpress", function(param) {
			that._selectedCatIdx = that._makitChart.getSelectedCategoryIndex();
			that.fireEvent("longpress", param);
		});

		//workaround for overwritten classes
		var len = this._styleClasses.length;
		for (var i = 0; i < len; i++ ){
			this.addStyleClass(this._styleClasses[i]);
		}

		this._applyCSS();
	};

	/**
	 * This function is used to apply the Makit properties that will be reset when changing chart type.
	 *
	 * @private
	 *
	 * */
	CombinationChart.prototype._setMakitChartProperties = function() {
		if (!this._makitChart) {
			return;
		}
		this._makitChart.setLegend(this.getLegendPosition().toLowerCase());
		// We should only apply this if the chart's data has been initialised at least once
		//if (this._dataInitialized){
			this._makitChart.setPalette(this.getPrimaryColorPalette(), "primaryaxis");
			this._makitChart.setPalette(this.getSecondaryColorPalette(), "secondaryaxis");
			this._makitChart.showRangeSelectorView(this.getShowRangeSelector());
			this._makitChart.showTableValue(this.getShowTableValue());
			this._makitChart.setNumberOfVisibleCategories(this.getNumberOfVisibleCategories());
			this._makitChart.setRangeSelectorStartPosition(this.getRangeSelectorStartPosition());

		//}

		var valueBubble = this.getValueBubble();
		if (valueBubble) {
			var valueBubbleObj = valueBubble.toObject();
			this._makitChart.setValueBubbleStyle(valueBubbleObj);
			if (this._makitChart.isValueBubbleVisible() != valueBubbleObj.visible) {
				this._makitChart.showValueBubble(valueBubbleObj.visible);
			}
		}

		var layersArr = this.getLayers();
		var len = layersArr.length;
		for (var i = 0; i < len; i++) {
			var layer = layersArr[i];
			if (layer.getType() == ChartType.Line) {
				this._makitChart.setGraphLineWidth(layer.getLineThickness(), layer.getId());
			}

			var pcp = layer.getPrimaryColorPalette();
			if (pcp) {
				this._makitChart.setPalette(pcp, layer.getId());
			}
			this._makitChart.setProperty(layer.getId() + ".values.SecondaryAxis", layer.getDrawOnSecondaryAxis());
		}
	};

	/**
	 * Generate the MAKit chart metadata syntax based on the sap.makit.Chart properties.
	 * To be used to create the MAKit chart.
	 *
	 * @private
	 *
	 * */
	CombinationChart.prototype._getChartSyntax = function() {
		var categoryAxisObj = this.getCategoryAxis();
		var categoryObjs = this.getCategoryRegions();
		var catLen = categoryObjs.length;
		if (catLen > 0){
			var i;
			var categorySyntax = "<Categories";
			if (categoryAxisObj) {
				if (categoryAxisObj.getDisplayAll()) {
					categorySyntax += ' display ="' + categoryAxisObj.getDisplayAll() + '"';
				}
			}
			categorySyntax += ">";
			var displayNames = "";
			for (i = catLen - 1; i >= 0; i--) {
				var temp = categoryObjs[i].getDisplayName();
				if (temp && temp.length > 0 ){
					displayNames += temp + " | ";
				}
			}
			displayNames = displayNames.substr(0, displayNames.length - 3);

			for (i = 0; i < catLen; i++){
				var categoryObj = categoryObjs[i];
				categorySyntax += '<Category column ="' + categoryObj.getColumn() + '"';
				if (categoryObj.getFormat()) {
						categorySyntax += ' format ="' + categoryObj.getFormat() + '"';
				}
				if (i == 0) {
					categorySyntax += ' displayname ="' + displayNames + '"';
				}
				if (categoryAxisObj) {
					categorySyntax += ' showprimaryline ="' + categoryAxisObj.getShowPrimaryLine() + '"';
					categorySyntax += ' showgrid ="' + categoryAxisObj.getShowGrid() + '"';
					categorySyntax += ' showlabel ="' + categoryAxisObj.getShowLabel() + '"';
					categorySyntax += ' thickness ="' + categoryAxisObj.getThickness() + '"';
					categorySyntax += ' color ="' + categoryAxisObj.getColor() + '"';
					categorySyntax += ' sortorder ="' + categoryAxisObj.getSortOrder().toLowerCase() + '"';
					categorySyntax += ' displaylastlabel ="' + categoryAxisObj.getDisplayLastLabel() + '"';
				}
				categorySyntax += ' />';
			}
			categorySyntax += "</Categories>";
		}
		else {
			throw new Error("CombinationChart '" + this.getId() + "' needs at least one Category data region");
		}

		var layersArr = this.getLayers();
		var len = layersArr.length;
		var layersSyntax = "";

		for (var i = 0; i < len; i++) {
			var layer = layersArr[i];
			layersSyntax += layer.getSyntax(this.getPrimaryValueAxis(), this.getSecondaryValueAxis() );
		}

		var overlayGroupSyntax = '<OverlayGroup>';
		overlayGroupSyntax += categorySyntax;
		overlayGroupSyntax += layersSyntax;
		overlayGroupSyntax += '</OverlayGroup>';

		return overlayGroupSyntax;
	};

	/**
	 * Update the data table of MAKit chart.
	 *
	 * @private
	 *
	 * */
	CombinationChart.prototype._setDataTable = function() {
		//Use delayed call to prevent setDataTable to be called too fast and too many times in a short period.
		if (this._makitChart){
			this._setDataTableTimer = this._setDataTableTimer || setTimeout(function(){
				assert(this._makitChart, "_makitChart is not initialized");
				this.fireEvent("_createDataTable", this);
				var layersArr = this.getLayers();
				var len = layersArr.length;

				this.fireEvent("_beforeSetDataTable", this);
				for (var i = 0; i < len; i++) {
					var layer = layersArr[i];
					//layersSyntax += layer.getSyntax();
					this._makitChart.setDataTable(layer.getDataTable(), layer.getId());
				}

				//this._makitChart.setDataTable(dataTable);
				this._dataInitialize = true;

				this._setDataTableTimer = undefined;
			}.bind(this), 150);
		}
	};


	/**
	 * Read and parse the css classes in the document and apply those style to the MAKit Chart
	 *
	 * @private
	 */
	CombinationChart.prototype._applyCSS = function(oEvent) {
		if (this._makitChart){
			this._makitChart.applyCSS();
		}
	};

	/**
	 * Retrieve selected series value of the layer
	 *
	 * @private
	 */
	CombinationChart.prototype._getSelectedSeries = function(oLayer) {
		var index = this.indexOfLayer(oLayer);
		if (index >= 0 && this._makitChart){
			return this._makitChart.getSelectedSeries(oLayer.getId());
		}
	};

	/*===================================================================================
	 *=	PRIVATE EVENT HANDLERS
	 *===================================================================================
	 **/

	/**
	 * Handler for onresize event.
	 *
	 * @private
	 *
	 * */
	CombinationChart.prototype._onResize = function(oEvent) {
		var parentDom = document.getElementById(this.getParent().getId());
		var parentDomCurHeight = parentDom.offsetHeight;
		var parentDomCurWidth = parentDom.offsetWidth;

		if (this._parentCurrentHeight != parentDomCurHeight && parentDomCurHeight > 0 ) {
			this._setRealHeight(this.getHeight());
			this._parentCurrentHeight = parentDom.offsetHeight;
		}
		if (this._makitChart != null && parentDomCurHeight > 0 && parentDomCurWidth > 0) {
			this._makitChart.refresh();
		}
	};

	/**
	 * Handler for properties change.
	 *
	 * @private
	 *
	 * */
	CombinationChart.prototype._onPropertyChanged = function(oEvent){
		if (!this._makitChart) {
			return;
		}
		var name = oEvent.mParameters["name"];
		var newVal = oEvent.mParameters["newValue"];
		if (this._makitChart){
			if (name === "showRangeSelector") {
				this._makitChart.showRangeSelectorView(newVal);
			}
			else if (name === "legendPosition") {
				this._makitChart.setLegend(newVal.toLowerCase());
			}
			else if (name === "width") {
				this.getDomRef().style.width = this.getWidth();
			}
			else if (name === "height") {
				this._setRealHeight(newVal);
			}
			else if (name === "showTableValue") {
				this._makitChart.showTableValue(newVal);
			}
			else if (name === "primaryColorPalette") {
				this._makitChart.setPalette(newVal, "primaryaxis");
			}
			else if (name === "secondaryColorPalette") {
				this._makitChart.setPalette(newVal, "secondaryaxis");
			} else if (name === "numberOfVisibleCategories") {
				this._makitChart.setNumberOfVisibleCategories(newVal);
			} else if (name === "rangeSelectorStartPosition") {
				this._makitChart.setRangeSelectorStartPosition(newVal);
			}

			this._makitChart.setSelectedCategoryIndex(this._selectedCatIdx);
			this._makitChart.refresh();
		}
	};

	/**
	 * Handler for Layer's properties change.
	 *
	 * @private
	 *
	 * */
	CombinationChart.prototype._onLayerPropertyChanged = function(oEvent){
		if (!this._makitChart) {
			return;
		}
		var name = oEvent.mParameters["name"];
		var newVal = oEvent.mParameters["newValue"];
		var oldVal = oEvent.mParameters["oldValue"];
		if (this._makitChart){
			if (name === "type") {
				var layer = oEvent.getSource();
				var index = this.indexOfLayer(layer);

				var layers = this.getLayers();
				var layersCount = layers.length;

				var i;
				//If the new chart type is not Line we need to check and make sure it does not conflict
				if (newVal != ChartType.Line) {
					//First check for conflict type
					for (i = 0; i < layersCount; i++) {
						var chartType = layers[i].getType();
						if (index != i && chartType != ChartType.Line) {
							layer.setType(oldVal); //set it back to old value;
							throw new Error("CombinationChart : " + newVal + " chart type cannot be combine with " + chartType + " chart type");
						}
					}
				}
				//We need to find what is the major chart type to determine which orientation the line should be
				// 	(i.e. vertical line or horizontal line)

				var mainChartType = newVal;
				//If the mainChartType is Line, find out what type of chart
				// is the main type (i.e. or Vertical or Horizontal)
				if (mainChartType == ChartType.Line) {
					for (i = 0; i < layersCount; i++) {
						if (layers[i].getType() != ChartType.Line) {
							mainChartType = layers[i].getType();
							break;
						}
					}
				}

				//Determine which type of line it should be
				var lineType = "line";
				if (mainChartType == ChartType.Bar) {
					lineType = "verticalline";
				}

				var type = newVal;
				if (newVal == ChartType.Line) {
					type = lineType;
				}

				this._makitChart.setProperty(layer.getId() + ".ChartType", type);

				//Set the rest of the Line chart layers to the correct type (vertical or not), if required.
				for (i = 0; i < layersCount; i++) {
					if (layers[i].getType() == ChartType.Line && layers[i].getLineType() != lineType && layer != layers[i]) {
						layers[i].setLineType(lineType);
						this._makitChart.setProperty(layers[i].getId() + ".ChartType", lineType);
					}
				}
			}
			else if (name === "lineThickness") {
				this._makitChart.setGraphLineWidth(newVal, oEvent.getSource().getId());
			}
			else if (name === "primaryColorPalette") {
				this._makitChart.setPalette(newVal, oEvent.getSource().getId());
			}
			else if (name === "drawOnSecondaryAxis") {
				this._makitChart.setProperty(oEvent.getSource().getId() + ".values.SecondaryAxis", newVal);
			}
			this._makitChart.setSelectedCategoryIndex(this._selectedCatIdx);
			this._makitChart.refresh();
		}
	};

	/**
	 * Handler for Category, Value and Series data region property change
	 *
	 * @private
	 *
	 * */
	CombinationChart.prototype._onDataRegionPropChanged = function(oEvent, oData){
		if (!this._makitChart) {
			return;
		}

		var oParams = oEvent.mParameters;
		if (oParams["type"] == "values") {
			var id = oEvent.getSource().getId();
			var idx = oParams["index"];
			if (idx > -1){
				this._makitChart.setProperty(id + "." + oParams["type"] + "[" + idx + "]." + oParams["name"], oParams["newValue"]);
			}
		}
		else if (oParams["type"] == "series") {
			var id = oEvent.getSource().getId();
			var idx = oParams["index"];
			this._makitChart.setProperty(id + "." + oParams["type"] + "[" + idx + "]." + oParams["name"], oParams["newValue"]);
		}
		else if (oData != undefined){
			this._makitChart.setProperty(oData["type"] + "." + oParams["name"], oParams["newValue"]);
		}
	};

	/**
	 * Handler for CategoryAxis and ValueAxis change
	 *
	 * @private
	 *
	 * */
	CombinationChart.prototype._onAxisPropChanged = function(oEvent, oData){
		assert(oData, "oData is expected to be set in _onAxisPropChanged");
		if (!this._makitChart) {
			return;
		}
		var oParams = oEvent.mParameters;
		var sName =  oParams["name"].toLowerCase();
		var value =  oParams["newValue"];
		// Sortorder in makit only accepts lowercase value
		if (sName === "sortorder") {
			value = value.toLowerCase();
		}
		if (oData["axis"] == "values"){
			var whichAxis = "primaryaxis";
			if (oData["secondaryAxis"]) {
				whichAxis = "secondaryaxis";
			}
			this._makitChart.setProperty(whichAxis + "." + oData["axis"] + "." + sName, value);
		}
		else {
			var axis = oData["axis"];
			if (sName === "displayall") {
				axis = "categories";
				sName = "display";
				if (!value){
					value = "";
				}
			}
			this._makitChart.setProperty(axis + "." + sName, value);
		}

		this._makitChart.refresh();

		if (sName === "sortorder" || sName == "display") {
			this._setDataTable();
		}

	};

	/**
	 * Handler for ValueBubble properties change
	 *
	 * @private
	 *
	 * */
	CombinationChart.prototype._onValueBubbleChanged = function (oEvent){
		if (!this._makitChart) {
			return;
		}
		var valueBubbleObj = this.getValueBubble().toObject();
		this._makitChart.setValueBubbleStyle(valueBubbleObj);
		if (this._makitChart.isValueBubbleVisible() != valueBubbleObj.visible) {
			this._makitChart.showValueBubble(valueBubbleObj.visible);
		}
		this._makitChart.refresh();
	};

	/*=================================================================================
	 *== PUBLIC METHODS
	 *=================================================================================
	 **/

	/**
	 * Get the value of the currently highlighted category
	 *
	 * @type string
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	CombinationChart.prototype.getSelectedCategory = function() {
		var selectedCategory = undefined;
		if (this._makitChart){
			selectedCategory = this._makitChart.getSelectedCategory();
		}
		return selectedCategory;
	};


	/**
	 * Get the number of distinct category values
	 *
	 * @type int
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	CombinationChart.prototype.getNumberOfCategories = function() {
		var numOfCat = undefined;
		if (this._makitChart){
			numOfCat = this._makitChart.getNumberOfCategories();
		}
		return numOfCat;
	};



	/**
	 * Return an array of categories value that is currently selected.
	 *
	 * @type object
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	CombinationChart.prototype.getSelectedCategoryGroup = function() {
		var selectedCategoryGroup = undefined;
		if (this._makitChart){
			selectedCategoryGroup = this._makitChart.getSelectedCategoryGroup();
		}
		return selectedCategoryGroup;
	};

	return CombinationChart;
});
