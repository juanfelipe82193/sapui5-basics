/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides control sap.makit.ValueBubble.
sap.ui.define([
	"./library",
	"sap/ui/core/Element"
], function(makitLibrary, Element) {
	"use strict";

	// shortcut for sap.makit.ValueBubbleStyle
	var ValueBubbleStyle = makitLibrary.ValueBubbleStyle;

	// shortcut for sap.makit.ValueBubblePosition
	var ValueBubblePosition = makitLibrary.ValueBubblePosition;


	/**
	 * Constructor for a new ValueBubble.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The properties of the Chart's Value Bubble.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 *
	 * @public
	 * @since 1.8
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 * @alias sap.makit.ValueBubble
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ValueBubble = Element.extend("sap.makit.ValueBubble", /** @lends sap.makit.ValueBubble.prototype */ { metadata : {

		deprecated : true,
		library : "sap.makit",
		properties : {

			/**
			 * Whether to display category's text on the Value Bubble
			 */
			showCategoryText : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Whether to display category's display name on the Value Bubble
			 */
			showCategoryDisplayName : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Whether to display value's display name on the Value Bubble
			 */
			showValueDisplayName : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Whether to display value on Pie or Donut chart
			 */
			showValueOnPieChart : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * Whether to display legend's label (Pie or Donut chart only)
			 */
			showLegendLabel : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Whether to render null item on the Value Bubble
			 */
			showNullValue : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * The position of the Value Bubble (Pie or Donut chart only)
			 */
			position : {type : "sap.makit.ValueBubblePosition", group : "Misc", defaultValue : ValueBubblePosition.Top},

			/**
			 * Value Bubble positioning style (All the chart types except: Pie/Donut/HBar chart)
			 */
			style : {type : "sap.makit.ValueBubbleStyle", group : "Misc", defaultValue : ValueBubbleStyle.Top},

			/**
			 * Whether the Value Bubble is visible
			 */
			visible : {type : "boolean", group : "Appearance", defaultValue : true}
		}
	}});

	ValueBubble.prototype.toObject = function(){
		var obj = {};

		obj.showCategoryText = this.getShowCategoryText();
		obj.showCategoryDisplayName = this.getShowCategoryDisplayName();
		obj.showValueDisplayName = this.getShowValueDisplayName();
		obj.showValueOnPieChart = this.getShowValueOnPieChart();
		obj.showLegendLabel = this.getShowLegendLabel();
		obj.showNullValue  = this.getShowNullValue();
		obj.style = this.getStyle().toLowerCase();
		obj.position = this.getPosition().toLowerCase();
		obj.visible = this.getVisible();
		return obj;
	};

	return ValueBubble;
});