/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides control sap.uiext.inbox.composite.InboxTaskTitleControl.
jQuery.sap.declare("sap.uiext.inbox.composite.InboxTaskTitleControl");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new composite/InboxTaskTitleControl.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * InboxTaskTitleControl
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @name sap.uiext.inbox.composite.InboxTaskTitleControl
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxTaskTitleControl", /** @lends sap.uiext.inbox.composite.InboxTaskTitleControl.prototype */ { metadata : {

	library : "sap.uiext.inbox",
	properties : {

		/**
		 * The Task Title of the Task
		 */
		taskTitle : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Category icon
		 */
		categoryIconURI : {type : "sap.ui.core.URI", group : "Misc", defaultValue : 'hasCategory'},

		/**
		 * has Attachments
		 */
		hasAttachments : {type : "boolean", group : "Misc", defaultValue : null},

		/**
		 * has Comments
		 */
		hasComments : {type : "boolean", group : "Misc", defaultValue : null}
	},
	aggregations : {

		/**
		 * Internal aggregation to hold the inner Task Title Link
		 */
		titleLink : {type : "sap.ui.core.Control", multiple : false}
	}
}});

jQuery.sap.require("sap.ui.core.IconPool");

sap.uiext.inbox.composite.InboxTaskTitleControl.prototype.init = function(){
	//var that = this;
	//this.setAggregation("titleLink", new sap.ui.commons.Link());
};


sap.uiext.inbox.composite.InboxTaskTitleControl.prototype.setTaskTitle = function(sValue){
    this.setProperty("taskTitle", sValue, true /*no re-rendering of whole search field needed*/);
    this.getAggregation("titleLink").setText(sValue); // Note: this triggers re-rendering of text field!
};

sap.uiext.inbox.composite.InboxTaskTitleControl.prototype.setTooltip = function(sValue){
    this.setProperty("taskTitle", sValue, true /*no re-rendering of whole search field needed*/);
    this.getAggregation("titleLink").setTooltip(sValue); // Note: this triggers re-rendering of text field!
};