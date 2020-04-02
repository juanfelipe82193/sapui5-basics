/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides control sap.uiext.inbox.composite.InboxAttachmentTile.
jQuery.sap.declare("sap.uiext.inbox.composite.InboxAttachmentTile");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new composite/InboxAttachmentTile.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * InboxAttachmentTile
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentTile
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxAttachmentTile", /** @lends sap.uiext.inbox.composite.InboxAttachmentTile.prototype */ { metadata : {

	library : "sap.uiext.inbox",
	properties : {

		/**
		 * Name of the attachment
		 */
		fileName : {type : "string", defaultValue : null},

		/**
		 * size of the attachment
		 */
		fileSize : {type : "string", defaultValue : null},

		/**
		 * description of the attachment
		 */
		fileDescription : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Icon URI of the file type
		 */
		fileTypeIcon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},

		/**
		 * creation date of the attachment
		 */
		creationDate : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * URL for attachment title link to download the attachment.
		 */
		downloadUrl : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * name of the user who has uploaded attachment
		 */
		createdBy : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * boolean value to indicate whether to show delete button
		 */
		showDeleteButton : {type : "boolean", group : "Misc", defaultValue : true}
	},
	events : {

		/**
		 * fire this event to delete the attachment
		 */
		deleteAttachment : {}
	}
}});

sap.uiext.inbox.composite.InboxAttachmentTile.prototype.init = function(){
	this.oCore = sap.ui.getCore();
	this._oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
};

sap.uiext.inbox.composite.InboxAttachmentTile.prototype.onclick = function(oEvent){
	var sTargetId = oEvent.target.getAttribute( 'ID' );

};
