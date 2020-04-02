/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

// Provides control sap.gantt.simple.ListLegendItem.
sap.ui.define([
	'sap/ui/core/Element', "sap/m/CheckBox"
], function(Element, CheckBox) {
	"use strict";

	/**
	 * Constructor for a new ListLegendItem.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class Aggregation element for the List Legend. A List Legend Item consists of a marker and an associated text. The marker can be any shapes you in shape aggregation.
	 * If you need to interact with the legend item, set the interactive to true then the item will display a check box in front of the shape and text.
	 * @extends sap.ui.core.Element
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.ListLegendItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ListLegendItem = Element.extend("sap.gantt.simple.ListLegendItem", /** @lends sap.gantt.simple.ListLegendItem.prototype */
	{
		metadata: {

			library: "sap.gantt",
			properties: {
				legendName: {
					type: "string"
				},

				/**
				 * Indicates whether the check box is visible or not.
				 */
				interactive: {
					type: "boolean",
					defaultValue: false
				},

				/**
				 * Indicates whether the check box is selected or not.
				 */
				selected: {
					type: "boolean",
					defaultValue: true
				}
			},
			defaultAggregation: "shape",
			aggregations: {
				/**
				 * Define a shape class for the List Legend Item.
				 * The shape will be normalized in the rendering phase.
				 */
				shape: {
					type: "sap.gantt.simple.BaseShape",
					group: "Misc",
					multiple: false,
					defaultValue: null
				},
				_checkbox: {
					type: "sap.m.CheckBox",
					multiple: false,
					visibility: "hidden"
				}
			},
			events: {
				/**
				 * The event is raised when there is a click action on the checkbox before legend item.
				 */
				interactiveChange: {
					parameters: {
						/**
						 * The shape name of legend item.
						 */
						legendName: {type: "string"},

						/**
						 * The value indicate that legend is checked or unchecked.
						 */
						value: {type: "boolean"}
					}
				}
			}
		}
	});

	ListLegendItem.prototype.init = function(){
		var oCheckBox = new CheckBox({selected: this.getSelected()}).attachSelect(this._onInteractiveChange, this);
		this.setAggregation("_checkbox", oCheckBox);
		this._getInteractiveCheckBox().setVisible(this.getInteractive());
	};

	ListLegendItem.prototype.setInteractive = function(bInteractive){
		this.setProperty("interactive", bInteractive, true);
		this._getInteractiveCheckBox().setVisible(bInteractive);
		return this;
	};

	ListLegendItem.prototype.setSelected = function(bSelected){
		this.setProperty("selected", bSelected, true);
		this.getAggregation("_checkbox").setSelected(bSelected);
		return this;
	};

	ListLegendItem.prototype._getInteractiveCheckBox = function() {
		return this.getAggregation("_checkbox");
	};

	ListLegendItem.prototype._onInteractiveChange = function(oEvent) {
		this.fireInteractiveChange({
			legendName: this.getLegendName(),
			value: oEvent.getParameter("selected")
		});
		this.setSelected(oEvent.getParameter("selected"));
	};

	return ListLegendItem;

}, true);
