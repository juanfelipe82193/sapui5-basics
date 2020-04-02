/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.PictureViewerItem.
jQuery.sap.declare("sap.ca.ui.PictureViewerItem");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new PictureViewerItem.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Picture viewer control relying on the TileContainer control
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @deprecated Since version 1.22. 
 * 
 * PictureViewerItem is used in PictureViewer control and is not meant to be consumed outside of PictureViewer usage.
 * PictureViewer was replacing the Carousel as it wasn't supporting some versions of MS Internet Explorer. Now, the
 * sap.m.Carousel is fully functional, please use sap.m.Carousel instead. This control will not be supported anymore.
 * @name sap.ca.ui.PictureViewerItem
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.ca.ui.PictureViewerItem", /** @lends sap.ca.ui.PictureViewerItem.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * Image source url.
		 */
		src : {type : "string", group : "Misc", defaultValue : null}
	},
	aggregations : {

		/**
		 * Pass in an existing Image control to be used inside the PictureViewer
		 */
		image : {type : "sap.m.Image", multiple : false}
	}
}});

/**
 * Setter for property <code>src</code>.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @param {string} sSrc  new value for property <code>src</code>
 * @return {sap.ca.ui.PictureViewerItem} <code>this</code> to allow method chaining
 * @public
 * @name sap.ca.ui.PictureViewerItem#setSrc
 * @function
 */
sap.ca.ui.PictureViewerItem.prototype.setSrc = function(sSrc) {
	this.setProperty("src", sSrc);
	// Also create or update the internal image
	var oImage = this.getImage();
	if (oImage == null) {
		oImage = new sap.m.Image();
	}
	oImage.setSrc(sSrc);
	this.setImage(oImage);
	return this;
};

/**
 * Called when the control is destroyed
 */
sap.ca.ui.PictureViewerItem.prototype.exit = function() {
    var oImage = this.getImage();
    if (oImage) {
        oImage.destroy();
    }
};
