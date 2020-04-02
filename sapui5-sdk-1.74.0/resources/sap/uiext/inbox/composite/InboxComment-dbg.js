/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides control sap.uiext.inbox.composite.InboxComment.
jQuery.sap.declare("sap.uiext.inbox.composite.InboxComment");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new composite/InboxComment.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * fsgg
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @name sap.uiext.inbox.composite.InboxComment
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxComment", /** @lends sap.uiext.inbox.composite.InboxComment.prototype */ { metadata : {

	library : "sap.uiext.inbox",
	properties : {

		/**
		 * Sender of the comment chunk
		 */
		sender : {type : "string", group : "Data", defaultValue : null},

		/**
		 * Format is ISO 8601 YYYY-MM-DDThh:mm:ss.sZ, Z meaning the time is in UTC time zone
		 */
		timestamp : {type : "string", group : "Data", defaultValue : null},

		/**
		 * URL to the thumbnail image.
		 */
		thumbnailSrc : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},

		/**
		 * The FeedChunk text
		 */
		text : {type : "string", group : "Data", defaultValue : null},

		/**
		 * Unique username of the user responsible for adding comment
		 */
		createdBy : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Represent system origin in case of multi origin scenario
		 */
		sapOrigin : {type : "string", group : "Misc", defaultValue : null}
	}
}});

/**
 * This file defines behavior for the control,
 */
sap.uiext.inbox.composite.InboxComment.prototype.init = function(){
    this.rb = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
};
