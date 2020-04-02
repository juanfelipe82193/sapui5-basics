/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides control sap.makit.Chart.
sap.ui.define([
	"./library",
	"./MakitLib",
	"./CategoryAxis",
	"./ValueAxis",
	"./ValueBubble",
	"./Row",
	"./ChartRenderer",
	"sap/ui/core/Control",
	"sap/ui/core/Element",
	"sap/ui/core/RenderManager",
	"sap/ui/core/ResizeHandler",
	"sap/ui/thirdparty/jquery",
	"sap/base/Log",
	"sap/base/assert"
], function(
	makitLibrary,
	MakitLib,
	CategoryAxis,
	ValueAxis,
	ValueBubble,
	Row,
	ChartRenderer,
	Control,
	Element,
	RenderManager,
	ResizeHandler,
	jQuery,
	Log,
	assert
) {
    "use strict";

	// shortcut for sap.makit.LegendPosition
	var LegendPosition = makitLibrary.LegendPosition;

	// shortcut for sap.makit.ChartType
	var ChartType = makitLibrary.ChartType;


	/**
	 * Constructor for a new Chart.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The Chart control.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 *
	 * @public
	 * @since 1.8
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and VizFrame in 1.38. This control will not be supported anymore from 1.38.
	 * @alias sap.makit.Chart
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Chart = Control.extend("sap.makit.Chart", /** @lends sap.makit.Chart.prototype */ { metadata : {

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
			 * Chart type
			 */
			type : {type : "sap.makit.ChartType", group : "Appearance", defaultValue : ChartType.Column},

			/**
			 * Specify whether the range selector should be visible.
			 */
			showRangeSelector : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * Toggle to display table view
			 */
			showTableView : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * Legend position all chart types except Bar chart.
			 * Default position for Pie/Donut chart is Left. All other chart's default position is None. Note: the default legend position is set when the chart type is set first time, subsequent change to the chart type will keep using initial legend position unless it is changed explicitly by user.
			 */
			legendPosition : {type : "sap.makit.LegendPosition", group : "Misc", defaultValue : null},

			/**
			 * Specify the line thickness of the line graph. Only applies to Line chart type.
			 */
			lineThickness : {type : "float", group : "Misc", defaultValue : 1},

			/**
			 * Toggle to display the table value on a Bar chart. Only applies to Bar chart.
			 */
			showTableValue : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Set the maximum number of slices in a Pie/Donut chart. If exceeding the specified value, the rest will be categorised into a single slice. Only applies to Pie/Donut.
			 */
			maxSliceCount : {type : "int", group : "Misc", defaultValue : 12},

			/**
			 * Allow a chart’s color palette to be modified without affecting the other charts' color palette. If not set, the chart will use the default color palette defined in the theme.
			 * Accept an array of color in string format or hex format. e.g.
			 * 0xff0000
			 * "red"
			 * "rgb(255,0,0)"
			 */
			primaryColorPalette : {type : "any", group : "Misc", defaultValue : null},

			/**
			 * Specify whether to show the sum of the value for Waterfall/Waterfall Bar chart. Only applies to Waterfall/WaterfallBar chart.
			 */
			showTotalValue : {type : "boolean", group : "Misc", defaultValue : false},

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
			 * The data rows of the chart. User should bind these to their data source
			 * @deprecated Since version 1.38.
			 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
			 */
			rows : {type : "sap.makit.Row", multiple : true, singularName : "row", bindable : "bindable", deprecated: true},

			/**
			 * The data column map of the chart.
			 * @deprecated Since version 1.38.
			 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
			 */
			columns : {type : "sap.makit.Column", multiple : true, singularName : "column", bindable : "bindable", deprecated: true},

			/**
			 * Data region property of the chart's Series
			 * @deprecated Since version 1.38.
			 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
			 */
			series : {type : "sap.makit.Series", multiple : false, deprecated: true},

			/**
			 * Data region property of the chart's Values
			 * @deprecated Since version 1.38.
			 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
			 */
			values : {type : "sap.makit.Value", multiple : true, singularName : "value", deprecated: true},

			/**
			 * Data region property of the chart's Categories
			 * @deprecated Since version 1.38.
			 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
			 */
			categoryRegions : {type : "sap.makit.Category", multiple : true, singularName : "categoryRegion", deprecated: true},

			/**
			 * Data region property of the chart's Category
			 * @deprecated Since version 1.38.
			 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
			 */
			category : {type : "sap.makit.Category", multiple : false, deprecated: true},

			/**
			 * Category Axis property of the Chart. Accepts only an instance of CategoryAxis element.
			 * @deprecated Since version 1.38.
			 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
			 */
			categoryAxis : {type : "sap.makit.CategoryAxis", multiple : false, deprecated: true},

			/**
			 * Value Axis property of the Chart. Accept only an instance of ValueAxis element.
			 * @deprecated Since version 1.38.
			 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
			 */
			valueAxis : {type : "sap.makit.ValueAxis", multiple : false, deprecated: true},

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
	Chart.prototype.init = function() {
		//Private variable
		this._makitChart = null;
		this._parentCurrentHeight = 0;
		this._selectedCatIdx = 0;
		this._chartTypeDefined = false;
		this._legendPosDefined = false;
		this._createRowsCalled = false;

		this._datarows = []; //This is the placeholder for the Chart's data row it's a 1-to-1 mapping to rows aggregation.
		this._styleClasses = []; //workaround for custom classes

		this.setCategoryAxis(new CategoryAxis());
		this.setValueAxis(new ValueAxis());
		this.setValueBubble(new ValueBubble());
		this.setPrimaryColorPalette(null);


		if (this.getType() === ChartType.Pie || this.getType() === ChartType.Donut) {
			this.setLegendPosition(LegendPosition.Left);
		}
		else {
			this.setLegendPosition(LegendPosition.None);
		}

		this.attachEvent("_change", this._onPropertyChanged);
		sap.ui.getCore().attachThemeChanged(this._applyCSS, this);
	};

	/**
	 * Attempt to preserve the chart's DOM reference before re-rendering it
	 * @override
	 */
	Chart.prototype.onBeforeRendering = function(oEvent) {
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
	Chart.prototype.onAfterRendering = function(oEvent) {
		this.fireEvent("_afterRendering", this);
		var $placeholder = jQuery(document.getElementById("sap-ui-dummy-" + this.getId()));
		var $oldContent = RenderManager.findPreservedContent(this.getId());
		var $newContent = null;

		if ($oldContent.size() == 0) {
			this.fireEvent("_createMAKitObject", this);
			this._createChartObject();
			$newContent = new jQuery(this.getDomRef());
			$placeholder.replaceWith($newContent);
			var parentDom = document.getElementById(this.getParent().getId());
			this._parentCurrentHeight = parentDom.offsetHeight;
			ResizeHandler.register(parentDom, jQuery.proxy(this._onResize, this));
		} else if ( $oldContent.size() > 0 ) {
			this.fireEvent("_restoreMAKitObject", this);
			// replace dummy with old content
			$placeholder.replaceWith($oldContent);
		} else {
			$placeholder.remove();
		}

		if ($newContent) {
			this._makitChart.showRangeSelectorView(this.getShowRangeSelector());
			this._makitChart.showTableView(this.getShowTableView());
			this._makitChart.setGraphLineWidth(this.getLineThickness());
			this._makitChart.showTableValue(this.getShowTableValue());
			this._makitChart.setMaxPies(this.getMaxSliceCount());
			this._makitChart.setPalette(this.getPrimaryColorPalette());
			this._makitChart.setProperty("ShowTotal", this.getShowTotalValue());
			this._makitChart.setNumberOfVisibleCategories(this.getNumberOfVisibleCategories());
			this._makitChart.setRangeSelectorStartPosition(this.getRangeSelectorStartPosition());
		}

		this._setDataTable();
	};


	/**
	 * WORKAROUND: MAKit chart current behavior overwrite the div's css class when it's created
	 *				So we need to intercept addition of custom style classes before
	 *				this._makitChart is created.
	 * @override
	 */
	Chart.prototype.addStyleClass = function(sStyleClass, bSuppressRerendering) {
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
	Chart.prototype.removeStyleClass = function(sStyleClass, bSuppressRerendering) {
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
	Chart.prototype.bindAggregation = function(sName, oBindingInfo) {
		// special handling for the rows aggregation
		if (sName === "rows") {
			// old API compatibility (sName, sPath, oTemplate, oSorter, aFilters)
			if (typeof oBindingInfo == "string") {
				oBindingInfo = {
					path: arguments[1],
					template: arguments[2],
					sorter: arguments[3],
					filters: arguments[4]
				};
			}
			// the rows aggregation has neither a template nor a factory function!
			oBindingInfo.template = undefined;
			oBindingInfo.factory = function() {};
			// call the real bindAggregation method
			return Element.prototype.bindAggregation.call(this, sName, oBindingInfo);
		}
		// call the real bindAggregation method
		return Element.prototype.bindAggregation.apply(this, arguments);
	};

	/**
	 * User should not use these API programmatically.
	 * @override
	 */
	Chart.prototype.addRow = function(oRow){
		Log.error("The control manages the rows aggregation. The method \"addRow\" cannot be used programmatically!");
	};

	/**
	 * @override
	 */
	Chart.prototype.insertRow = function(oRow, iIndex){
		Log.error("The control manages the rows aggregation. The method \"insertRow\" cannot be used programmatically!");
	};

	/**
	 * @override
	 */
	Chart.prototype.removeRow = function(vRow){
		Log.error("The control manages the rows aggregation. The method \"removeRow\" cannot be used programmatically!");
	};

	/**
	 * @override
	 */
	Chart.prototype.removeAllRows = function(){
		Log.error("The control manages the rows aggregation. The method \"removeAllRows\" cannot be used programmatically!");
	};

	/**
	 * @override
	 */
	Chart.prototype.destroyRows = function(vRow){
		Log.error("The control manages the rows aggregation. The method \"destroyRows\" cannot be used programmatically!");
	};

	/**
	 * @override
	 */
	Chart.prototype.updateRows = function(){
		this.fireEvent("_startUpdateRows", this);
		this._createRows();
		this._createRowsCalled = true;
		if (this._makitChart) {
			this._setDataTable();
		}
		this.fireEvent("_endUpdateRows", this);
	};

	/**
	 * @override
	 */
	Chart.prototype.setValueBubble = function(oValueBubble){
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
	Chart.prototype.setCategory = function(oCategory){
		//sap.ui.core.Element.prototype.setAggregation.call(this, "category", oCategory, false);
		//oCategory.attachEvent("_change", {type: "category"}, this._onDataRegionPropChanged, this);
		var categories = this.getCategoryRegions();
		if (categories.length > 0){
			this.removeCategoryRegion(0);
		}
		this.insertCategoryRegion(oCategory, 0);
		return this;
	};

	/**
	 * @override
	 */
	Chart.prototype.getCategory = function(oCategory){
		var categories = this.getCategoryRegions();
		return categories[0];
	};

	/**
	 * @override
	 */
	Chart.prototype.destroyCategory = function(){
		this.removeCategoryRegion(0);
		return this;
	};

	/**
	 * @override
	 */
	Chart.prototype.addCategoryRegion = function(oCategory){
		Element.prototype.addAggregation.call(this, "categoryRegions", oCategory, false);
		oCategory.attachEvent("_change", {type: "categories"}, this._onDataRegionPropChanged, this);
		return this;
	};

	/**
	 * @override
	 */
	Chart.prototype.insertCategoryRegion = function(oCategory, iIndex){
		Element.prototype.insertAggregation.call(this, "categoryRegions", oCategory, iIndex, false);
		oCategory.attachEvent("_change", {type: "categories"}, this._onDataRegionPropChanged, this);
		return this;
	};

	/**
	 * @override
	 */
	Chart.prototype.removeCategoryRegion = function(oCategory){
		var removedObj = Element.prototype.removeAggregation.call(this, "categoryRegions", oCategory, false);
		if (removedObj != null) {
			oCategory.detachEvent("_change", this._onDataRegionPropChanged, this);
		}
		return removedObj;
	};

	/**
	 * @override
	 */
	Chart.prototype.removeAllCategoryRegions = function(){
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
	Chart.prototype.addValue = function(oValue){
		Element.prototype.addAggregation.call(this, "values", oValue, false);
		oValue.attachEvent("_change", {type: "values"}, this._onDataRegionPropChanged, this);
		return this;
	};

	/**
	 * @override
	 */
	Chart.prototype.insertValue = function(oValue, iIndex){
		Element.prototype.insertAggregation.call(this, "values", oValue, iIndex, false);
		oValue.attachEvent("_change", {type: "values"}, this._onDataRegionPropChanged, this);
		return this;
	};

	/**
	 * @override
	 */
	Chart.prototype.removeValue = function(oValue){
		var removedObj = Element.prototype.removeAggregation.call(this, "values", oValue, false);
		if (removedObj != null) {
			removedObj.detachEvent("_change", this._onDataRegionPropChanged, this);
		}
		return removedObj;
	};

	/**
	 * @override
	 */
	Chart.prototype.removeAllValues = function(){
		var removedObjs = Element.prototype.removeAllAggregation.call(this, "values", false);
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
	Chart.prototype.setSeries = function(oSeries){
		Element.prototype.setAggregation.call(this, "series", oSeries, false);
		oSeries.attachEvent("_change", {type: "series"}, this._onDataRegionPropChanged, this);
		return this;
	};

	/**
	 * @override
	 */
	Chart.prototype.setValueAxis = function (oValueAxis){
		if (oValueAxis instanceof ValueAxis) {
			Element.prototype.setAggregation.call(this, "valueAxis", oValueAxis, false);
			oValueAxis.attachEvent("_change", { axis:"values" }, this._onAxisPropChanged, this);
		}
		else {
			throw new Error("valueAxis property must be of type sap.makit.ValueAxis");
		}
		return this;
	};

	/**
	 * @override
	 */
	Chart.prototype.setCategoryAxis = function (oCategoryAxis){
		if (oCategoryAxis instanceof CategoryAxis) {
			Element.prototype.setAggregation.call(this, "categoryAxis", oCategoryAxis, false);
			oCategoryAxis.attachEvent("_change", { axis:"category" }, this._onAxisPropChanged, this);
		}
		else {
			throw new Error("categoryAxis property must be of type sap.makit.CategoryAxis");
		}
		return this;
	};

	/**
	 * @override
	 */
	Chart.prototype.setPrimaryColorPalette = function(oColorPalette) {
		if (oColorPalette == null || (oColorPalette instanceof Array && oColorPalette.length > 0)) {
			Element.prototype.setProperty.call(this, "primaryColorPalette", oColorPalette, false);
			if (this._makitChart) {
				this._makitChart.setPalette(oColorPalette);
			}
		}
		else {
			throw new Error("primaryColorPalette property must be an array");
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
	Chart.prototype._setRealHeight = function(height){
		var elem = this.getDomRef();
		var prevHeight = elem.style.height;
		var newHeight = "0px";
		if (height.indexOf("%") > -1) {
			//always get parentDom, fixed for IE QUnit Test failed.
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
	 * We will construct the row aggregation in this function
	 *
	 * @private
	 *
	 * */
	Chart.prototype._createRows = function() {
		this.fireEvent("_startCreateRows", this);
		var oTemplate = new Row(this.getId() + "-dummyrows");
		var aCols = this.getColumns();
		for (var i = 0, l = aCols.length; i < l; i++) {
			var oColTemplate = aCols[i];
			if (oColTemplate) {
				var oClone = oColTemplate.clone("col" + i);
				oClone.detachEvent("_change", this._onColumnPropChanged, this);
				for (var prop in oColTemplate.mProperties) {
					if (oColTemplate.mProperties.hasOwnProperty(prop)) {
						oClone.setProperty(prop, oColTemplate.getProperty(prop), false);
					}
				}
				oClone.data("sap-ui-colindex", i);
				oTemplate.addAggregation("cells",oClone);
				oClone.unbindAggregation("name",true);
			}
		}
		this.fireEvent("_endColumn", this);
		this.destroyAggregation("rows");
		this.fireEvent("_endDestroyRows", this);
		var aContexts = undefined;
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			aContexts = oBinding.getContexts();
		}
		var totalRows = oBinding.getLength();
		this._datarows = [];
		var bi = this.getBindingInfo("rows");
		var sModelName = undefined;
		if (bi && bi.model) {
			sModelName = bi.model;
		}
		this.fireEvent("_endPrepareRows", this);
		for (var i = 0; i < totalRows; i++) {
			if (aContexts && aContexts[i]) {
				var oClone = oTemplate.clone("row" + i);
				oClone.setBindingContext(aContexts[i], sModelName);
				this.addAggregation("rows", oClone);
				this._datarows.push(oClone._datarow);
			}
		}
		this.fireEvent("_endCreateRows", this);
		// destroy the template
		oTemplate.destroy();
	};

	/**
	 * Create and initialize the MAKit $MA.Chart object
	 *
	 * @private
	 *
	 * */
	Chart.prototype._createChartObject = function (){
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
	Chart.prototype._setMakitChartProperties = function() {
		if (!this._makitChart) {
			return;
		}
		this._makitChart.setLegend(this.getLegendPosition().toLowerCase());

		// We should only apply this if the chart's data has been initialised at least once
		if (this._dataInitialized){
			this._makitChart.showTableView(this.getShowTableView());
			this._makitChart.showRangeSelectorView(this.getShowRangeSelector());
			this._makitChart.setGraphLineWidth(this.getLineThickness());
			this._makitChart.showTableValue(this.getShowTableValue());
			this._makitChart.setPalette(this.getPrimaryColorPalette());
			this._makitChart.setProperty("ShowTotal", this.getShowTotalValue());
			this._makitChart.setNumberOfVisibleCategories(this.getNumberOfVisibleCategories());
			this._makitChart.setRangeSelectorStartPosition(this.getRangeSelectorStartPosition());
		}

		var valueBubble = this.getValueBubble();
		if (valueBubble) {
			var valueBubbleObj = valueBubble.toObject();
			this._makitChart.setValueBubbleStyle(valueBubbleObj);
			if (this._makitChart.isValueBubbleVisible() != valueBubbleObj.visible) {
				this._makitChart.showValueBubble(valueBubbleObj.visible);
			}
		}
	};

	Chart.prototype.addColumn = function(oValue){
		Element.prototype.addAggregation.call(this, "columns", oValue, false);
		oValue.attachEvent("_change", {type: "columns"}, this._onColumnPropChanged, this);
		return this;
	};

	/**
	 * Generate the MAKit chart metadata syntax based on the sap.makit.Chart properties.
	 * To be used to create the MAKit chart.
	 *
	 * @private
	 *
	 * */
	Chart.prototype._getChartSyntax = function() {
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
			throw new Error("Chart '" + this.getId() + "' needs at least one Category data region");
		}

		var seriesObj = this.getSeries();
		var seriesSyntax = '';
		if (seriesObj) {
			seriesSyntax = '<Series Column ="' + seriesObj.getColumn() + '"';
			if (seriesObj.getFormat()) {
				seriesSyntax += ' format ="' + seriesObj.getFormat() + '"';
			}
			if (seriesObj.getDisplayName()) {
				seriesSyntax += ' displayname ="' + seriesObj.getDisplayName() + '"';
			}
			seriesSyntax += '/>';
		}

		var valueAxisObj = this.getValueAxis();
		var valuesSyntax = '<Values>';
		if (valueAxisObj) {
			valuesSyntax = '<Values';
			valuesSyntax += ' showprimaryline ="' + valueAxisObj.getShowPrimaryLine() + '"';
			valuesSyntax += ' showgrid ="' + valueAxisObj.getShowGrid() + '"';
			valuesSyntax += ' showlabel ="' + valueAxisObj.getShowLabel() + '"';
			valuesSyntax += ' thickness ="' + valueAxisObj.getThickness() + '"';
			valuesSyntax += ' color ="' + valueAxisObj.getColor() + '"';
			if (valueAxisObj.getMin() !== "") {
				valuesSyntax += ' min ="' + valueAxisObj.getMin() + '"';
			}
			if (valueAxisObj.getMax() !== "") {
				valuesSyntax += ' max ="' + valueAxisObj.getMax() + '"';
			}
			valuesSyntax += '>';
		}

		var valuesObj = this.getValues();
		var length = valuesObj.length;
		if (length == 0) {
			throw new Error("Chart '" + this.getId() + "' needs at least one Value data region");
		}
		var valueObj;
		for (var i = 0; i < length; i++) {
			valueObj = valuesObj[i];
			valuesSyntax += '<Value Expression ="' + valueObj.getExpression() + '"';
			if (valueObj.getFormat()) {
				valuesSyntax += ' format ="' + valueObj.getFormat() + '"';
			}
			if (valueObj.getDisplayName()) {
				valuesSyntax += ' displayname ="' + valueObj.getDisplayName() + '"';
			}
			if (valueObj.getLocale() !== "") {
				valuesSyntax += ' Locale ="' + valueObj.getLocale() + '"';
			}
			valuesSyntax += '/>';
		}
		valuesSyntax += '</Values>';

		var type = this.getType().toLowerCase();
		var pieStyle = null;
		if (type === "donut" || type === "pie"){
			pieStyle = type; // it's the pieStyle that can be pie or donut
			type = "pie"; // in MAKit the chart's type is always pie for Pie/Donut chart
		}
		var chartSyntax = '<Chart ChartType ="' + type + '"';
		if (pieStyle !== null) {
			chartSyntax += ' PieStyle ="' + pieStyle + '"';
		}
		chartSyntax += ' >';

		chartSyntax += categorySyntax;
		if (seriesObj) {
			chartSyntax += seriesSyntax;
		}
		chartSyntax += valuesSyntax;
		chartSyntax += '</Chart>';

		return chartSyntax;
	};

	/**
	 * Update the data table of MAKit chart.
	 *
	 * @private
	 *
	 * */
	Chart.prototype._setDataTable = function() {
		//Use delayed call to prevent setDataTable to be called too fast and too many times in a short period.
		this._setDataTableTimer = this._setDataTableTimer || setTimeout(function(){
			assert(this._makitChart, "_makitChart is not initialized");
			if (this._datarows && this._datarows.length > 0){
				this.fireEvent("_createDataTable", this);
				var data = this._datarows;
				var dataTable = new window.$MA.DataTable();
				var columns = this.getColumns();
				var colLen = columns.length;
				if (colLen == 0) {
					columns = this.getRows()[0].getCells();
					colLen = columns.length;
				}
				for (var i = 0; i < colLen; i++){
					dataTable.addColumn(columns[i].getName(), columns[i].getType());
				}

				dataTable.addRows(data);
				this.fireEvent("_beforeSetDataTable", this);
				this._makitChart.setDataTable(dataTable);
				this._dataInitialized = true;
			}
			this._setDataTableTimer = undefined;
		}.bind(this), 150);
	};


	/**
	 * Read and parse the css classes in the document and apply those style to the MAKit Chart
	 *
	 * @private
	 */
	Chart.prototype._applyCSS = function(oEvent) {
		if (this._makitChart){
			this._makitChart.applyCSS();
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
	Chart.prototype._onResize = function(oEvent) {
		var parentDom = document.getElementById(this.getParent().getId());
		var parentDomCurHeight = parentDom.offsetHeight;
		var parentDomCurWidth = parentDom.offsetWidth;

		if ((this._parentCurrentHeight != parentDomCurHeight && parentDomCurHeight > 0) || parentDomCurHeight < 5) {
			this._setRealHeight(this.getHeight());
			this._parentCurrentHeight = parentDom.offsetHeight;
		}
		if (this._makitChart != null && parentDomCurHeight > 0 && parentDomCurWidth > 0) {
			this._makitChart.refresh();
		}
	};

	/**
	 * Handler for Chart's direct properties change.
	 *
	 * @private
	 *
	 * */
	Chart.prototype._onPropertyChanged = function(oEvent){
		var name = oEvent.mParameters["name"];
		var newVal = oEvent.mParameters["newValue"];

		if (name === "type" && !this._chartTypeDefined) {
			this._chartTypeDefined = true;
			if (!this._legendPosDefined){
				if (newVal === ChartType.Pie || newVal === ChartType.Donut) {
					this.setLegendPosition(LegendPosition.Left);
				}
				else {
					this.setLegendPosition(LegendPosition.None);
				}
			}
		}
		else if (name === "legendPosition" && !this._legendPosDefined) {
			this._legendPosDefined = true;
		}

		if (this._makitChart){
			if (name === "type") {
				var type = newVal.toLowerCase();
				var pieStyle = null;
				this._makitChart.setProperty("ChartType", type);
				if (type === "donut" || type === "pie"){
					pieStyle = type; // it's the pieStyle that can be pie or donut
					type = "pie"; // in MAKit the chart's type is always pie for Pie/Donut chart
					this._makitChart.setProperty("PieStyle", pieStyle);
				}
			} else if (name === "showRangeSelector") {
				this._makitChart.showRangeSelectorView(newVal);
			}
			else if (name === "showTableView") {
				this._makitChart.showTableView(newVal);
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
			else if (name === "lineThickness") {
				this._makitChart.setGraphLineWidth(newVal);
			}
			else if (name === "maxSliceCount") {
				this._makitChart.setMaxPies(newVal);
			}
			else if (name === "showTableValue") {
				this._makitChart.showTableValue(newVal);
			}
			else if (name === "primaryColorPalette") {
				this._makitChart.setPalette(newVal);
			}
			else if (name === "showTotalValue") {
				this._makitChart.setProperty("ShowTotal", newVal);
			} else if (name === "numberOfVisibleCategories") {
				this._makitChart.setNumberOfVisibleCategories(newVal);
			} else if (name === "rangeSelectorStartPosition") {
				this._makitChart.setRangeSelectorStartPosition(newVal);
			}

			this._makitChart.setSelectedCategoryIndex(this._selectedCatIdx);
			this._makitChart.refresh();
		}
	};

	Chart.prototype._onColumnPropChanged = function(oEvent, oData){
		var oParams = oEvent.mParameters;
		if (oParams["name"] == "name" && this._createRowsCalled) {
			Log.info("Column name property is changed due to name has been binded");
			this._createRows();
		}
	};

	/**
	 * Handler for Category, Value and Series data region property change
	 *
	 * @private
	 *
	 * */
	Chart.prototype._onDataRegionPropChanged = function(oEvent, oData){
		assert(oData, "oData is expected to be set in _onDataRegionPropChanged");
		if (!this._makitChart) {
			return;
		}
		var oParams = oEvent.mParameters;
		if (oData["type"] == "values") {
			var valObj = oEvent.oSource;
			var idx = this.indexOfValue(valObj);
			if (idx > -1){
				this._makitChart.setProperty(oData["type"] + "[" + idx + "]." + oParams["name"], oParams["newValue"]);
			}
		}
		else if (oData["type"] == "categories") {
			var catObj = oEvent.oSource;
			var idx = this.indexOfCategoryRegion(catObj);
			var propName = oParams["name"];
			if (idx > -1){
				if (propName == "displayName") {
					var cats = this.getCategoryRegions();
					var i, value = "", len = cats.length;
					for (i = 0; i < len; i++){
						value += cats[i].getDisplayName();
						if (i != len - 1) {
							value +=  " | ";
						}
					}
					this._makitChart.setProperty("category." + propName, oParams["newValue"]);
				}
				else {
					this._makitChart.setProperty(oData["type"] + "[" + idx + "]." + propName, oParams["newValue"]);
				}
			}
		} else {
			this._makitChart.setProperty(oData["type"] + "." + oParams["name"], oParams["newValue"]);
		}
	};

	/**
	 * Handler for CategoryAxis and ValueAxis change
	 *
	 * @private
	 *
	 * */
	Chart.prototype._onAxisPropChanged = function(oEvent, oData){
		assert(oData, "oData is expected to be set in _onAxisPropChanged");
		if (!this._makitChart) {
			return;
		}
		var oParams = oEvent.mParameters;
		var sName =  oParams["name"].toLowerCase();
		var value =  oParams["newValue"];
		// Sortorder in makit only accepts lowercase value
		var axis = oData["axis"];
		if (sName === "sortorder") {
			value = value.toLowerCase();
		}
		else if (sName === "displayall") {
			axis = "categories";
			sName = "display";
			if (!value){
				value = "";
			}
		}

		this._makitChart.setProperty(axis + "." + sName, value);
		if (sName === "sortorder") {
			this._setDataTable();
		}

	};

	/**
	 * Handler for ValueBubble properties change
	 *
	 * @private
	 *
	 * */
	Chart.prototype._onValueBubbleChanged = function (oEvent){
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
	Chart.prototype.getSelectedCategory = function() {
		var selectedCategory = undefined;
		if (this._makitChart){
			selectedCategory = this._makitChart.getSelectedCategory();
		}
		return selectedCategory;
	};

	/**
	 * Get the value of the currently highlighted series
	 *
	 * @type string
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Chart.prototype.getSelectedSeries = function() {
		var selectedSeries = undefined;
		if (this._makitChart){
			selectedSeries = this._makitChart.getSelectedSeries();
		}
		return selectedSeries;
	};

	/**
	 * Get the number of distinct category values
	 *
	 * @type int
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Chart.prototype.getNumberOfCategories = function() {
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
	Chart.prototype.getSelectedCategoryGroup = function() {
		var selectedCategoryGroup = undefined;
		if (this._makitChart){
			selectedCategoryGroup = this._makitChart.getSelectedCategoryGroup();
		}
		return selectedCategoryGroup;
	};

	return Chart;
});
