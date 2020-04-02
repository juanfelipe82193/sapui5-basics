/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides control sap.uiext.inbox.composite.InboxAddAttachmentTile.
jQuery.sap.declare("sap.uiext.inbox.composite.InboxAddAttachmentTile");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new composite/InboxAddAttachmentTile.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * InboxAddAttachmentTile
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @name sap.uiext.inbox.composite.InboxAddAttachmentTile
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxAddAttachmentTile", /** @lends sap.uiext.inbox.composite.InboxAddAttachmentTile.prototype */ { metadata : {

	library : "sap.uiext.inbox"
}});

sap.uiext.inbox.composite.InboxAddAttachmentTile.prototype.init = function() {
	this._oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
};
