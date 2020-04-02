/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.PictureItem.
jQuery.sap.declare("sap.ca.ui.PictureItem");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new PictureItem.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * A picture / photo Item for AddPicture and PictureViewer Controls
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @deprecated Since version 1.22. 
 * This control has been made available in sap.m.
 * Please use the sap.m.Carousel instead!
 * This control will not be supported anymore.
 * @name sap.ca.ui.PictureItem
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.ca.ui.PictureItem", /** @lends sap.ca.ui.PictureItem.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * The status of the picture / photo : Added, Deleted, Read
		 */
		status : {type : "string", group : "Behavior", defaultValue : null},

		/**
		 * The content of the picture. Either the uri or base64 content.
		 */
		source : {type : "string", group : "Data", defaultValue : null},

		/**
		 * The original name of the picture.
		 */
		name : {type : "string", group : "Data", defaultValue : null},

		/**
		 * The width of the picture.
		 * @deprecated Since version 1.16.2. 
		 * Width is defined by the AddPicture control
		 */
		width : {type : "sap.ui.core.CSSSize", group : "Data", defaultValue : '62px', deprecated: true},

		/**
		 * The height of the picture.
		 * @deprecated Since version 1.16.2. 
		 * Height is defined by the AddPicture control
		 */
		height : {type : "sap.ui.core.CSSSize", group : "Data", defaultValue : '62px', deprecated: true}
	},
	events : {

		/**
		 * Fired when the Image is really loaded
		 */
		loaded : {}
	}
}});

/**
 * Status Object
 * @type {Object}
 */
sap.ca.ui.PictureItem.STATUS = {'ADD':'Added','DELETE':'Deleted','READ':'Read'};

/**
 * Initialize control
 */
sap.ca.ui.PictureItem.prototype.init = function() {
  this._oTapHandler = jQuery.proxy(this._onTap, this);
  this._oImage = new sap.m.Image({id:this.getId() + "-image"});
  this._oImage.attachPress(this._oTapHandler);
  this._oImage.addStyleClass("sapCaUiPictureItemImage");
  this._iRenderCount = 0;
  this._sourceInfo = {isDataUri : false, mimeType : "", data : ""};
};



/**
 * Called when the control is destroyed
 */
sap.ca.ui.PictureItem.prototype.exit = function() {

	if (this._oImage) {
		this._oImage.detachPress(this._oTapHandler);
		this._oImage.destroy();
	}
	if (this._internalFile){
		delete this._internalFile;
	}
};


/**
 * Set the source for the picture, either uri or data url scheme (base64 information).
 * @override
 * @public
 * @param {string} sValue The URI of the image or the DATA URL scheme.
 * <BR>Samples:
 * <BR>1 - "./images/IMG_0095.PNG"
 * <BR>2 - "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAKCAYAAABWiWWfAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAhtJREFUOE+tkF9oUlEcx11pmbnVkw+lvkQwWPXQoMegl57qrZcIpjEqqociiOoloraBIIxRG7UoSNhsq1axGpmatRUEaTljbm56s6b3rnmdXv+k13/ffsfYIPKxH3y53/M953zOl6tYN57y/Q81vUxdVCiHeajtAvRjP9E8IkA5xGPDsFD3m0kq8lr6toz+ydi+iu6wM6tSPRTs658n1Yp9T+LwiTISxSrCmTI63MswPPiBCPlJoQDlAAdbKIvvuTI4yhyLBeweiUFz5xs0g6S70RcbbTGtgs2zhQxShQpOT8TR+zGBvfcjOPNaAJtqDWi/F8ErLguJHrviXkLyVwWPQxmorbNo6Z2b0vaHdXUQm6EvSZQqNYwF0zg6GsWW69N4H83BF8tDzJfR83YJEyEJy9SsrS+IkFjEB9rfdM3/aatlRr8GYqatx49Hn0UIkoxiuQarR4BM8C5HDJ4FCQE+D8dsGhWqyUslZIsVWFzxgOayd8dfILZov+HDfosfR/pn6g3ZJTacWIBIbeqQtAyJfsUFexjHBoPzO6/6Wv8BseC2axEruRL4lIwcvSqXq4gmCuh+ysE6HqW2VZRI8ZUidKfe8bqzk3sagli469wUTgx8xSXbHA51eXH8ZgCHu73Qmd3Y1vkGpr5pdN4KsDy1/aTngLHD2Ww0ORvzjGYnDCYn9KRVb6CM+bW1yZnXm10HCdJKOk9qakT7DfsPyGaTv0W2AAAAAElFTkSuQmCC"
 */
sap.ca.ui.PictureItem.prototype.setSource = function(sValue) {

	if (sValue == null || sValue == ""){
		jQuery.sap.log.warning("Cannot set a NULL or empty to the image source");
		return;
	}

	this._sourceInfo = this._getSourceInfo(sValue);
	
	this._oImage.setSrc(sValue);
	this.setProperty("source", sValue, false);
};

/**
 * Set the File object
 * @public
 * @param file {File}
 * @param oConfig {Object} Canvas config
 */
sap.ca.ui.PictureItem.prototype.setFile = function(file, oConfig) {

	var that = this;
	
	this._internalFile = file;

	// resize image
	var canvasHelper = new sap.ca.ui.utils.CanvasHelper({
		width: oConfig.width,
		height: oConfig.height,
		crop: oConfig.crop,
		quality: oConfig.quality,
		minWeight: oConfig.minWeight,
		done: function(oEvent) {
			that.setSource(oEvent.getParameters().data);
			that.fireLoaded();
		}
	});
	canvasHelper.resize(file);
	

};




/**
 * Returns the File object (if exists), data content can be retrieved in order to trigger the real upload
 * @return file {File}
 */
sap.ca.ui.PictureItem.prototype.getFile = function(file) {
	if (!this._internalFile){
		jQuery.sap.log.warning("no file has been set");
		return null;
	}
	
	return this._internalFile;
};

/**
 * Whether the picture source is a Data URI, containing base64 encoding
 * @return {boolean} returns true if the source is a Data URI rather than a URL
 */
sap.ca.ui.PictureItem.prototype.isSourceDataUri = function() {
	if (!this._sourceInfo) {
		return false;
	}

	return this._sourceInfo.isDataUri;
};

/**
 * Get the mime type for source Data URIs
 * @return {string} returns empty if the source is a URL rather than a Data URI
 */
sap.ca.ui.PictureItem.prototype.getMimeType = function() {

	return this._sourceInfo.mimeType;
};

/**
 * Get the base64 image encoding for source Data URIs
 * @return {string} returns empty if the source is a URL rather than a Data URI
 */
sap.ca.ui.PictureItem.prototype.getBase64Encoding = function() {

	return this._sourceInfo.data;
};

sap.ca.ui.PictureItem.prototype._resizeImage = function(){
	// scale and crop images to target width and height

	// set the default css settings
	var scaledWidth = "auto";
	var scaledHeight = "auto";

	// get the actual image size
	var $this = this.$();
	
	
	var domRef = jQuery.sap.domById(this.getId() + "-image");
	if (domRef) {
		// check that we have usable sizes
		if (domRef.width == 0 || domRef.height == 0) {
			// needs some time to render the image in the dom (on ipad/iphone), lets try again later
			var rerender = jQuery.proxy(this.onAfterRendering, this);
			this._iRenderCount++;
			// prevent infinite loop, never seen, but you never know
			if (this._iRenderCount <= 5) {
				setTimeout(rerender, 100);
			} else {
				scaledWidth = $this.height(); // best default option
				this._iRenderCount = 0;
			}
		} else {
			// ensure that the smallest side fits, scale the smallest size first then the largest size
			if (domRef.width < domRef.height) {
				// get the scaling factor for the width, then scale the height
				var targetWidth = parseInt($this.width(), 10);
				scaledHeight = (targetWidth / domRef.width) * domRef.height;
			} else  {
				// get the scaling factor for the height, then scale the width
				var targetHeight = parseInt($this.height(), 10);
				scaledWidth = (targetHeight / domRef.height) * domRef.width;
			}
			this._iRenderCount = 0;
		}
		
		// set the css on the image
		var $image = this._oImage.$();
		$image.width(scaledWidth);
		$image.height(scaledHeight);
	}
};


/**
 * Called after the control has been rendered
 */
sap.ca.ui.PictureItem.prototype.onAfterRendering = function() {
	var $image = this._oImage.$();
	var $this = this.$();
	var fnResize = function(){
		this._resizeImage();
		$image.css({"margin-left":(($this.width() - $image.width()) / 2) + "px",
			"margin-top": (($this.height() - $image.height()) / 2) + "px"});
	};
	// If the height is 0, the image is not loaded so we wait for the loading to resize
	// CSS I-0120061532 0001071001 2014
	if ($image.height() > 0) {
	   fnResize.call(this);
	} else {
		$image.load(jQuery.proxy(fnResize,this));
	}
	// remove tabindex from image - containing div has it.
	// this prevents unwanted tab and speech for accessibility
	$image.attr("tabIndex", -1);
};



/**
 * Handler for tap event of picture item
 * @private
 */
sap.ca.ui.PictureItem.prototype._onTap = function() {
	var oAddPicture = sap.ui.getCore().byId(this._addPictureId);
	if (oAddPicture){
		oAddPicture._pictureTapped(this);
	}
};

/**
 * Handle the key up event for SPACE and ENTER.
 *
 * @param {jQuery.Event} oEvent - the keyboard event.
 * @private
 */
sap.ca.ui.PictureItem.prototype.onkeyup = function(oEvent) {
	if (oEvent.which == jQuery.sap.KeyCodes.SPACE || oEvent.which == jQuery.sap.KeyCodes.ENTER) {
		this._onTap();
	}
};

/**
 * Get the source information for the picture
 * @private
 * @return {object}
 */
sap.ca.ui.PictureItem.prototype._getSourceInfo = function(sSource) {
	if (!sSource) {
		return;
	}
	
	var regex = /^data:(.+);base64,(.*)$/;

	var matches = sSource.match(regex);

	var sourceInfo;
	if (matches) {
		var sMimeType = matches[1];
		var sBase64 = matches[2];
		sourceInfo = { isDataUri : true, mimeType : sMimeType, data : sBase64};
	} else {
		sourceInfo = { isDataUri : false, mimeType : "", data : ""};
	}

	return sourceInfo;
};
