/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides element sap.makit.Row.
sap.ui.define([
	"./library",
	"sap/ui/core/Element"
], function(makitLibrary, Element) {
	"use strict";


	/**
	 * Constructor for a new Row.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The data row of the Chart's data table
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 *
	 * @public
	 * @since 1.8
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 * @alias sap.makit.Row
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Row = Element.extend("sap.makit.Row", /** @lends Row.prototype */ { metadata : {

		deprecated : true,
		library : "sap.makit",
		aggregations : {

			/**
			 * Representing the cells of the row. User should not add individual cells. The cells will be added automatically via Column mapping.
			 */
			cells : {type : "sap.makit.Column", multiple : true, singularName : "cell"}
		}
	}});

	Row.prototype.init = function(){
		this._datarow = {};
	};

	Row.prototype.addCell = function(oCell){
		Element.prototype.addAggregation.call(this, "cells", oCell, false);
		var sId = this.getId();
		//We only want to attach event on real rows not on template rows.
		if (!sId.endsWith("dummyrows")){
			this._datarow[oCell.getName()] = oCell.getValue();
			oCell.attachEvent("_change", this.onCellChanged, this);
		}
	};

	Row.prototype.onCellChanged = function(oEvent){
		if (oEvent.mParameters['name'] === "name"){
			var oldName = oEvent.mParameters['oldValue'];
			var newName = oEvent.mParameters['newValue'];
			this._datarow[newName] = undefined;
			if (oldName && oldName !== ""){
				this._datarow[newName] = this._datarow[oldName];
				this._datarow[oldName] = null;
				this._datarow[oldName] = undefined;
				delete this._datarow[oldName];
			}
		}
		else if (oEvent.mParameters['name'] === "value"){
			var cellName = oEvent.oSource.getName();
			this._datarow[cellName] = oEvent.mParameters['newValue'];
		}
	};

	return Row;
});