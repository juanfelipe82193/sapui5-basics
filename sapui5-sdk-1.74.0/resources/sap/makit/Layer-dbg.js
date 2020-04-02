/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides element sap.makit.Layer.
sap.ui.define([
	"./library",
	"./MakitLib",
	"./Row",
	"sap/ui/core/Element",
	"sap/base/Log",
	"sap/base/assert"
], function(makitLibrary, MakitLib, Row, Element, Log, assert) {
	"use strict";

	// shortcut for sap.makit.ChartType
	var ChartType = makitLibrary.ChartType;


	/**
	 * Constructor for a new Layer.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Layer represent a chart in the CombinationChart
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 *
	 * @public
	 * @since 1.12
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 * @alias sap.makit.Layer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Layer = Element.extend("sap.makit.Layer", /** @lends sap.makit.Layer.prototype */ { metadata : {

		deprecated : true,
		library : "sap.makit",
		properties : {

			/**
			 * Chart type
			 */
			type : {type : "sap.makit.ChartType", group : "Appearance", defaultValue : ChartType.Column},

			/**
			 * Specify the line thickness of the line graph. Only applies to Line chart type.
			 */
			lineThickness : {type : "float", group : "Appearance", defaultValue : 1},

			/**
			 * Allow a layer’s primary axis color palette to be modified without affecting other charts in the same screen. If not set, the chart will use the default color palette defined in the theme. This property will take precedence over other CombinationChart's color palette properties.
			 * Accept an array of color in string format or hex format. e.g.
			 * 0xff0000
			 * "red"
			 * "rgb(255,0,0)"
			 */
			primaryColorPalette : {type : "any", group : "Misc", defaultValue : null},

			/**
			 * Specifiy whether this layer should be drawn on the secondary axis.
			 */
			drawOnSecondaryAxis : {type : "boolean", group : "Misc", defaultValue : false}
		},
		aggregations : {

			/**
			 * The data rows of the chart. User should bind these to their data source
			 */
			rows : {type : "sap.makit.Row", multiple : true, singularName : "row", bindable : "bindable"},

			/**
			 * The data column map of the chart.
			 */
			columns : {type : "sap.makit.Column", multiple : true, singularName : "column", bindable : "bindable"},

			/**
			 * Data region property of the chart's Series
			 */
			series : {type : "sap.makit.Series", multiple : false},

			/**
			 * Data region property of the chart's Values
			 */
			values : {type : "sap.makit.Value", multiple : true, singularName : "value"}
		}
	}});


	/**
	 * @override
	 */
	Layer.prototype.init = function() {
		this._datarows = [];
		this._createRowsCalled = false;
		this._lineType = null;
	};

	/**
	 * @override
	 */
	Layer.prototype.addValue = function(oValue){
		Element.prototype.addAggregation.call(this, "values", oValue, false);
		oValue.attachEvent("_change", {type: "values"}, this._onDataRegionPropChanged, this);
		return this;
	};


	Layer.prototype.addColumn = function(oValue){
		Element.prototype.addAggregation.call(this, "columns", oValue, false);
		oValue.attachEvent("_change", {type: "columns"}, this._onColumnPropChanged, this);
		return this;
	};

	/**
	 * @override
	 */
	sap.makit.Chart.prototype.insertValue = function(oValue, iIndex){
		Element.prototype.insertAggregation.call(this, "values", oValue, iIndex, false);
		oValue.attachEvent("_change", {type: "values"}, this._onDataRegionPropChanged, this);
		return this;
	};

	/**
	 * @override
	 */
	sap.makit.Chart.prototype.removeValue = function(oValue){
		var removedObj = Element.prototype.removeAggregation.call(this, "values", oValue, false);
		if (removedObj != null) {
			removedObj.detachEvent("_change", this._onDataRegionPropChanged, this);
		}
		return removedObj;
	};

	/**
	 * @override
	 */
	sap.makit.Chart.prototype.removeAllValues = function(){
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
	Layer.prototype.setSeries = function(oSeries){
		Element.prototype.setAggregation.call(this, "series", oSeries, false);
		oSeries.attachEvent("_change", {type: "series"}, this._onDataRegionPropChanged, this);
		return this;
	};

	/**
	 * @override
	 */
	Layer.prototype.bindAggregation = function(sName, oBindingInfo) {
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
	Layer.prototype.addRow = function(oRow){
		Log.error("The control manages the rows aggregation. The method \"addRow\" cannot be used programmatically!");
	};

	/**
	 * @override
	 */
	Layer.prototype.insertRow = function(oRow, iIndex){
		Log.error("The control manages the rows aggregation. The method \"insertRow\" cannot be used programmatically!");
	};

	/**
	 * @override
	 */
	Layer.prototype.removeRow = function(vRow){
		Log.error("The control manages the rows aggregation. The method \"removeRow\" cannot be used programmatically!");
	};

	/**
	 * @override
	 */

	Layer.prototype.removeAllRows = function(){
		Log.error("The control manages the rows aggregation. The method \"removeAllRows\" cannot be used programmatically!");
	};

	/**
	 * @override
	 */
	Layer.prototype.destroyRows = function(vRow){
		Log.error("The control manages the rows aggregation. The method \"destroyRows\" cannot be used programmatically!");
	};

	/**
	 * @override
	 */
	Layer.prototype.updateRows = function(){
		this.fireEvent("_startUpdateRows", this);
		this._createRows();
		this._createRowsCalled = true;
		this.fireEvent("rowsUpdated");
		this.fireEvent("_endUpdateRows", this);
	};


	/**
	 * @override
	 */
	sap.makit.CombinationChart.prototype.setType = function(oType){
		if (oType == ChartType.Pie || oType == ChartType.Donut || oType == ChartType.Bubble){
			throw new Error("Combination Chart does not support " + oType + " chart type");
			return;
		} else {
			Element.prototype.setProperty.call(this, "type", oType, false);
		}
		return this;
	};

	/*=================================================================================
	 *== PRIVATE METHODS
	 *=================================================================================
	 **/

	/**
	 * Handler for Value and Series data region property change
	 *
	 * @private
	 *
	 * */
	Layer.prototype._onDataRegionPropChanged = function(oEvent, oData){
		assert(oData, "oData is expected to be set in _onDataRegionPropChanged");
		var oParams = oEvent.mParameters;
		oParams["type"] = oData["type"];
		if (oData["type"] == "values") {
			var valObj = oEvent.oSource;
			var idx = this.indexOfValue(valObj);
			oParams["index"] = idx;
		}
		this.fireEvent("dataRegionChanged", oParams);
	};


	Layer.prototype._onColumnPropChanged = function(oEvent, oData){
		var oParams = oEvent.mParameters;
		if (oParams["name"] == "name" && this._createRowsCalled) {
			Log.info("Column name property is changed due to name has been binded");
			this._createRows();
		}
	};
	/**
	 * We will construct the row aggregation in this function
	 *
	 * @private
	 *
	 * */
	Layer.prototype._createRows = function() {
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

		this.destroyAggregation("rows");
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
		for (var i = 0; i < totalRows; i++) {
			if (aContexts && aContexts[i]) {
				var oClone = oTemplate.clone("row" + i);
				oClone.setBindingContext(aContexts[i], sModelName);
				this.addAggregation("rows", oClone);
				this._datarows.push(oClone._datarow);
			}
		}

		// destroy the template
		oTemplate.destroy();
	};

	/**
	 * Set the line type, verticaline or line.
	 *
	 * @internal
	 * */
	Layer.prototype.setLineType = function(sLineType) {
		this._lineType = sLineType;
	};

	/**
	 * return the line type
	 *
	 * @internal
	 */
	Layer.prototype.getLineType = function() {
		return this._lineType;
	};

	/**
	 * Generate the MAKit chart metadata syntax based on the sap.makit.Chart properties.
	 * To be used to create the MAKit chart.
	 * Should only be accessed by CombinationChart
	 * @internal
	 *
	 * */
	Layer.prototype.getSyntax = function(primaryValueAxisObj, secondaryValueAxisObj) {
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

		var drawOnSecondaryAxis = this.getDrawOnSecondaryAxis();
		var valuesSyntax = '<Values>';
		var valueAxisObj = drawOnSecondaryAxis ? secondaryValueAxisObj : primaryValueAxisObj;
		if (valueAxisObj) {
			valuesSyntax = '<Values';
			if (drawOnSecondaryAxis) {
				valuesSyntax += ' SecondaryAxis ="' + drawOnSecondaryAxis + '"';
			}
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
		var lineType = this.getLineType();
		var pieStyle = null;
		if (type === "donut" || type === "pie"){
			pieStyle = type; // it's the pieStyle that can be pie or donut
			type = "pie"; // in MAKit the chart's type is always pie for Pie/Donut chart
		}
		else if (type === "line" && lineType){
			type = lineType;
		}
		var chartSyntax = '<Layer Name ="' + this.getId() + '" ChartType ="' + type + '"';
		if (pieStyle !== null) {
			chartSyntax += ' PieStyle ="' + pieStyle + '"';
		}
		chartSyntax += ' >';

		if (seriesObj) {
			chartSyntax += seriesSyntax;
		}
		chartSyntax += valuesSyntax;
		chartSyntax += '</Layer>';

		return chartSyntax;
	};

	/*=================================================================================
	 *== PUBLIC METHODS
	 *=================================================================================
	 **/

	/**
	 * Update the data table of MAKit chart.
	 *
	 * @private
	 *
	 * */
	Layer.prototype.getDataTable = function() {
		if (this._datarows && this._datarows.length > 0){
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
			return dataTable;
		}

		return null;
	};

	/**
	 * Get the value of the currently highlighted series
	 *
	 * @type string
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Layer.prototype.getSelectedSeries = function(){
		var parent = this.getParent();
		if ( parent ) {
			return parent._getSelectedSeries(this);
		}
	};

	return Layer;
});
