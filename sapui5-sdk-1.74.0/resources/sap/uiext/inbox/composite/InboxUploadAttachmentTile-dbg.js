/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides control sap.uiext.inbox.composite.InboxUploadAttachmentTile.
jQuery.sap.declare("sap.uiext.inbox.composite.InboxUploadAttachmentTile");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new composite/InboxUploadAttachmentTile.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * InboxUploadAttachmentTile
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @name sap.uiext.inbox.composite.InboxUploadAttachmentTile
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxUploadAttachmentTile", /** @lends sap.uiext.inbox.composite.InboxUploadAttachmentTile.prototype */ { metadata : {

	library : "sap.uiext.inbox",
	properties : {

		/**
		 * name of the selected file
		 */
		fileName : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * icon URI of the selected file type
		 */
		fileTypeIcon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null}
	},
	events : {

		/**
		 * event is fired when upload for selected file is requested
		 */
		uploadSelectedFile : {}
	}
}});

sap.uiext.inbox.composite.InboxUploadAttachmentTile.prototype.init = function(){
	var that = this;
	this._oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
	
	this.oUploadButton = new sap.ui.commons.Button({
		tooltip : that._oBundle.getText("INBOX_UPLOAD_ATTACHMENT"),
		text : that._oBundle.getText("INBOX_UPLOAD_ATTACHMENT_TOOLTIP")
	});
	
	/*this.oTextField = new sap.ui.commons.TextField({
		tooltip : that._oBundle.getText("INBOX_ATTACHMENT_DESCRIPTION"),
		placeholder : that._oBundle.getText("INBOX_ATTACHMENT_DESCRIPTION_TOOLTIP"),
		width : "160px"
	});*/
	
	this.oCancelButton = new sap.ui.commons.Button({
		text : that._oBundle.getText("INBOX_CANCEL_TEXT"),
		tooltip : that._oBundle.getText("INBOX_CANCEL_TEXT"),
	});
};

sap.uiext.inbox.composite.InboxUploadAttachmentTile.prototype.onAfterRendering = function(){
	var oFocusRef = this.oUploadButton.getFocusDomRef();
	if (oFocusRef) {
		jQuery.sap.focus(oFocusRef);
	}
};

sap.uiext.inbox.composite.InboxUploadAttachmentTile.prototype.getUploadButton = function(){
	return this.oUploadButton;
};

sap.uiext.inbox.composite.InboxUploadAttachmentTile.prototype.getCancelButton = function(){
	return this.oCancelButton;
};

/*sap.uiext.inbox.composite.InboxUploadAttachmentTile.prototype.getTextField = function(){
	return this.oTextField;
};*/