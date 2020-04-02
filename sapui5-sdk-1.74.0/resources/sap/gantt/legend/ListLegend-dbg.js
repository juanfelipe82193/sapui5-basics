/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
/**
 * CheckBox Value of ListLegend Item.
 *
 * @enum {string}
 * @public
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.gantt.legend = sap.gantt.legend || {};
sap.gantt.legend.ListLegendItemCheckbox = {
	/**
	 * The list legend item has no checkbox.
	 * @public
	 */
	NoShow : "noShow",

	/**
	 * The list legend item has a checked checkbox.
	 * @public
	 */
	Checked : "checked",

	/**
	 * The list legend item has a unchecked checkbox.
	 * @public
	 */
	Unchecked : "unchecked"
};

sap.ui.define([
	"./LegendBase", "sap/m/CheckBox", "sap/gantt/drawer/Legend"
], function (LegendBase, CheckBox, LegendDrawer) {
	"use strict";

	/**
	 * Creates and initializes a new List Legend class.
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * List Legend is a legend template that contains a list of shapes. You can use this class to define a list legend.
	 *
	 * @extends sap.gantt.legend.LegendBase
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.legend.ListLegend
	 */
	var ListLegend = LegendBase.extend("sap.gantt.legend.ListLegend",/** @lends sap.gantt.legend.ListLegend.prototype */ {
		metadata: {
			properties: {
				/**
				 * Shapes for legend items. These shapes are used in the Gantt chart.
				 */
				shapes: {type: "sap.gantt.config.Shape[]"}
			},
			events: {
				/**
				 * Event fired when the check box of a certain legend item is selected.
				 */
				checkBoxChange: {
					parameters: {
						/**
						 * The shape that is checked or unchecked.
						 */
						legendType: {type: "string"},

						/**
						 * The value of the check box.
						 */
						value: {type: "boolean"}
					}
				}
			}
		}
	});

	ListLegend.prototype.init = function () {
		LegendBase.prototype.init.apply(this, arguments);
		this._oListLegendDrawer = new LegendDrawer();
		this._aCheckBoxes = [];
	};

	ListLegend.prototype.onAfterRendering = function () {
		for (var i = 0; i < this._aShapeInstance.length; i++) {
			var oShape = this._aShapeInstance[i];
			var aSvg = d3.select("#" + this.getId() + "-svg-" + i);
			var aShape = aSvg.selectAll("." + oShape.getId())
							.data([i]);
			this._oListLegendDrawer._drawPerTag(aShape, oShape);
		}
	};


	ListLegend.prototype.setShapes = function (aShapes) {
		var that = this;

		this.setProperty("shapes", aShapes);

		function afterInst() {
			var bHasCheckBox = false;

			for (var i = 0; i < that._aShapeInstance.length; i++) {
				var sSwitchOfCheckBox = that._aShapeInstance[i].mShapeConfig.getSwitchOfCheckBox();
				if (sSwitchOfCheckBox == sap.gantt.legend.ListLegendItemCheckbox.Checked || sSwitchOfCheckBox == sap.gantt.legend.ListLegendItemCheckbox.Unchecked) {
					bHasCheckBox = true;
					break;
				}
			}

			if (bHasCheckBox) {
				for (var j = 0; j < that._aShapeInstance.length; j++) {
					var oShape = that._aShapeInstance[j];
					var sCheckBoxValue = oShape.mShapeConfig.getSwitchOfCheckBox();

					var oCheckBox = new CheckBox({
						selected: (sCheckBoxValue == sap.gantt.legend.ListLegendItemCheckbox.Checked) ? true : false,
						enabled: (sCheckBoxValue == sap.gantt.legend.ListLegendItemCheckbox.NoShow) ? false : true
					})
						.data("key", (oShape.mShapeConfig.getKey && oShape.mShapeConfig.getKey()) ? oShape.mShapeConfig.getKey()
							: oShape.getLegend())
						.setTooltip(oShape.getLegend())
						.attachSelect(that._onCheckBoxChange, that);
					that._aCheckBoxes.push(oCheckBox);
				}
			}
		}

		if (aShapes && aShapes.length > 0) {
			this._aCheckBoxes = [];

			try {
				that._aShapeInstance = that._instantShapeSync(aShapes);
				afterInst();
			} catch (oErr) {
				that._instantShapeAsync(aShapes).then(function(aShapeInst) {
					that._aShapeInstance = aShapeInst;
					afterInst();
				});
			}
		}

		return this;
	};

	ListLegend.prototype._onCheckBoxChange = function(oEvent) {
		var oSource = oEvent.getSource();
		this.fireCheckBoxChange({legendType: oSource.data("key"), value: oEvent.getParameter("selected")});
	};

	return ListLegend;
}, true);
