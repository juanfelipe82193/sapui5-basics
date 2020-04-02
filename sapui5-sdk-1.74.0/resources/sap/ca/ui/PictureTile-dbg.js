/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.PictureTile.
jQuery.sap.declare("sap.ca.ui.PictureTile");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.m.CustomTile");


/**
 * Constructor for a new PictureTile.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Tile control embedding an image and allowing custom sizing
 * @extends sap.m.CustomTile
 *
 * @constructor
 * @public
 * @deprecated Since version 1.22. 
 * 
 * PictureTile is used in PictureViewer control and is not meant to be consumed outside of PictureViewer usage.
 * PictureViewer was replacing the sap.m.Carousel as it wasn't supporting some versions of MS Internet Explorer.
 * Now, the sap.m.Carousel is fully functional, please use sap.m.Carousel instead. This control will not be supported anymore.
 * @name sap.ca.ui.PictureTile
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.m.CustomTile.extend("sap.ca.ui.PictureTile", /** @lends sap.ca.ui.PictureTile.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * height (in pixels) of the picture viewer control.
		 */
		height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '32px'},

		/**
		 * width (in pixels) of the picture viewer control.
		 */
		width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '32px'}
	},
	associations : {

		/**
		 * Reference to one PictureViewerItem coming from the PictureViewer.
		 */
		tileContent : {type : "sap.ca.ui.PictureViewerItem", multiple : false}
	},
	events : {

		/**
		 * Fired when the user deletes a picture
		 */
		pictureDelete : {}
	}
}});


sap.ca.ui.PictureTile.prototype.init = function(oTileContent) {
	
	this._oDeletePictureButton = new sap.m.Button({
        icon:"sap-icon://sys-cancel",
        press: jQuery.proxy(this._deletePictureRequestHandler, this),
        type: sap.m.ButtonType.Transparent
    }).addStyleClass("sapCaUiPTDeleteButton");
	
	if (!jQuery.device.is.desktop) {
		 this.attachPress(this._tilePressedHandler);
		 this.attachBrowserEvent("swipe", jQuery.proxy(this._tileSwipedHandler, this));
		 this._oDeletePictureButton.addStyleClass("hide");
	}
};

    
/**
 * Reference to one PictureViewerItem coming from the PictureViewer.
 *
 * @override
 * @param {string | sap.ca.ui.PictureViewerItem} vTileContent
 *    Id of an element which becomes the new target of this <code>tileContent</code> association.
 *    Alternatively, an element instance may be given.
 * @return {sap.ca.ui.PictureTile} <code>this</code> to allow method chaining
 * @public
 * @name sap.ca.ui.PictureTile#setTileContent
 * @function
 */
sap.ca.ui.PictureTile.prototype.setTileContent = function(oTileContent) {
	this.setContent(null);
	if (oTileContent) {
        var image = oTileContent.getImage();
        
		if (jQuery.device.is.desktop) {
			this.setContent(image);
		} else {
			this.setContent(new sap.ca.ui.ZoomableScrollContainer({
				content : oTileContent.getImage()
			}));
		}
		
	} else {
		this.setContent(null);
	}
	this.setAssociation("tileContent", oTileContent);
};



/**
 * Sets the pixel size of the tile 
 * @param {int} iWidth width
 * @param {int} iHeight height
 * @private
 */ 
sap.ca.ui.PictureTile.prototype.setSize = function(iWidth,iHeight){

	this._width = iWidth;
	this._height = iHeight;
	
	var $this = this.$();
	if ($this){
		$this.css({width: iWidth+"px", height: iHeight+"px"});
		
		// adding this class later because display: inline-block is causing issue for width/height calculation
		jQuery.sap.byId(this.getId()+"-wrapper").addClass("sapCaUiPTWrapper");
	}
};


sap.ca.ui.PictureTile.prototype._tilePressedHandler = function (oEvent) {	
    this.switchVisibility();
};

sap.ca.ui.PictureTile.prototype.switchVisibility = function (bVisible) {
	var $delBtn = this._oDeletePictureButton.$();
	if (bVisible === undefined){
		$delBtn.toggleClass("hide");
	}
	else {
		$delBtn.toggleClass("hide", !bVisible);	
	}
	
	
};

sap.ca.ui.PictureTile.prototype._tileSwipedHandler = function (oEvent) {
    var $deleteBtn = this._oDeletePictureButton.$();
    if ($deleteBtn && !$deleteBtn.hasClass("hide")){
    	$deleteBtn.addClass("hide");
    		
    }	
};

/**
 * 
 */
sap.ca.ui.PictureTile.prototype._deletePictureRequestHandler = function () {

	this.firePictureDelete();
    
};

