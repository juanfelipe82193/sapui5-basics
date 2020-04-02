/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.HierarchicalSelectDialogItem.
jQuery.sap.declare("sap.ca.ui.HierarchicalSelectDialogItem");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.ui.core.Item");


/**
 * Constructor for a new HierarchicalSelectDialogItem.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * 
 * Kind of item required by the sap.ca.ui.HierarchicalSelectDialog control.
 * An item is actually one page of the Dialog.
 * @extends sap.ui.core.Item
 *
 * @author Bruno Vicente
 *
 * @constructor
 * @public
 * @deprecated Since version 1.24. 
 * This control is deprecated as per central UX requirements.
 * This control will not be supported anymore.
 * @name sap.ca.ui.HierarchicalSelectDialogItem
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Item.extend("sap.ca.ui.HierarchicalSelectDialogItem", /** @lends sap.ca.ui.HierarchicalSelectDialogItem.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * Dialog title for this item
		 */
		title : {type : "string", group : "Appearance", defaultValue : null},

		/**
		 * Property used for the binding
		 */
		entityName : {type : "string", group : "Data", defaultValue : null}
	},
	aggregations : {

		/**
		 * Used as a template for each list item of the page
		 */
		listItemTemplate : {type : "sap.m.ListItemBase", multiple : false}
	}
}});

