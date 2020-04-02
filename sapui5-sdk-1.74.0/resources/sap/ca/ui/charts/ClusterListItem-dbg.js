/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.charts.ClusterListItem.
jQuery.sap.declare("sap.ca.ui.charts.ClusterListItem");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.m.ListItemBase");


/**
 * Constructor for a new charts/ClusterListItem.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * The cluster list item consists of a title and items.
 * @extends sap.m.ListItemBase
 *
 * @author SAP SE
 *
 * @constructor
 * @public
 * @name sap.ca.ui.charts.ClusterListItem
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 * @deprecated Since version 1.24. 
 * 
 * Sap.ca charts have been replaced with sap.viz and VizFrame in 1.24.
 * The UI5 control "sap.viz.ui5.controls.VizFrame" serves as a single point of entry for all the new charts.
 * Now that 1.24 is available you are asked to use sap.viz charts and the VizFrame instead!
 * This control will not be supported anymore from 1.24.
 */
sap.m.ListItemBase.extend("sap.ca.ui.charts.ClusterListItem", /** @lends sap.ca.ui.charts.ClusterListItem.prototype */ { metadata : {

	library : "sap.ca.ui",
	properties : {

		/**
		 * Title
		 */
		title : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Items
		 */
		items : {type : "object", group : "Data", defaultValue : null}
	}
}});

jQuery.sap.require("sap.m.ListItemBase");
sap.ca.ui.charts.ClusterListItem.prototype.init = function() {
    sap.m.ListItemBase.prototype.init.apply(this, arguments);
    this.addStyleClass("sapCaUiCLI");
};
