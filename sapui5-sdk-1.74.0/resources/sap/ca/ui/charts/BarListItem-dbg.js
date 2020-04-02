/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.charts.BarListItem.
jQuery.sap.declare("sap.ca.ui.charts.BarListItem");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.m.ListItemBase");


/**
 * Constructor for a new charts/BarListItem.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * The display list item consists of a label and a value.
 * @extends sap.m.ListItemBase
 *
 * @author SAP SE
 *
 * @constructor
 * @public
 * @deprecated Since version 1.24. 
 * 
 * Sap.ca charts have been replaced with sap.viz and vizFrame in 1.24.
 * The UI5 control "sap.viz.ui5.controls.VizFrame" serves as a single point of entry for all the new charts.
 * Now that 1.24 is available you are asked to use sap.viz charts and the VizFrame instead!
 * This control will not be supported anymore from 1.24.
 * @name sap.ca.ui.charts.BarListItem
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.m.ListItemBase.extend("sap.ca.ui.charts.BarListItem", /** @lends sap.ca.ui.charts.BarListItem.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * List item label
		 */
		axis : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * List item label
		 */
		group : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * List item value
		 */
		value : {type : "string", group : "Data", defaultValue : null}
	}
}});
