/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.AddPicture.
jQuery.sap.declare("sap.ca.ui.AddPicture");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new AddPicture.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Enables users to add pictures into a form. Contains PictureItem controls that describe the media.
 * It is designed to be used simultaneously with the PictureViewer control
 * @extends sap.ui.core.Control
 *
 * @author SAP SE
 *
 * @constructor
 * @public
 * @deprecated Since version 1.26. 
 * As per central UX requirements, this control is replaced by sap.m.UploadCollection. Please use the new control if you start developing an application instead of using this AddPicture control.
 * @name sap.ca.ui.AddPicture
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.ca.ui.AddPicture", /** @lends sap.ca.ui.AddPicture.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * The page container type in which the button is embedded : Tab or Form
		 */
		buttonPageType : {type : "string", group : "Appearance", defaultValue : 'Tab'},

		/**
		 * Defines whether the button should appear or not.
		 */
		editable : {type : "boolean", group : "Appearance", defaultValue : true},

		/**
		 * Defines the maximum number of pictures you can add. Default is set to 10
		 */
		maxPictureNumber : {type : "int", group : "Behavior", defaultValue : 10},

		/**
		 * Url of server we wish to upload to, only used as a fallback when FileReader is not supported by the browser
		 */
		uploadUrl : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * The width of the control.
		 */
		width : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : '100%'},

		/**
		 * The text of the button.
		 */
		text : {type : "string", group : "Appearance", defaultValue : null},

		/**
		 * The text of the button.
		 */
		pictureAlign : {type : "sap.ui.core.TextAlign", group : "Appearance", defaultValue : sap.ui.core.TextAlign.Left},

		/**
		 * Defines thumbnail size (height / width) in Pixels
		 */
		itemSize : {type : "int", group : "Appearance", defaultValue : 64},

		/**
		 * Defines whether or not you want to maximize the compression. Possible values : "Low" (thumbnail size) or "High" (screen size)
		 */
		compression : {type : "string", group : "Appearance", defaultValue : 'low'}
	},
	aggregations : {

		/**
		 * The list of pictures
		 */
		pictures : {type : "sap.ca.ui.PictureItem", multiple : true, singularName : "picture", bindable : "bindable"}
	},
	events : {

		/**
		 * Indicates that the user wishes to view the picture
		 */
		show : {}, 

		/**
		 * Indicates that the image upload failed, only used as a fallback when FileReader is not supported by the browser
		 */
		pictureAdded : {}, 

		/**
		 * Indicates that the limit number of pictures has been reached
		 */
		maxPictureLimitReached : {}, 

		/**
		 * Indicates that the image upload failed, only used as a fallback when FileReader is not supported by the browser
		 */
		imageUploadFailed : {}, 

		/**
		 * Image upload failed, only supports image format files
		 */
		fileNotSupported : {
			parameters : {

				/**
				 * An array containing the file names that are not supported
				 */
				fileNames : {type : "any"}
			}
		}
	}
}});

jQuery.sap.require("sap.ca.ui.utils.resourcebundle");
jQuery.sap.require("sap.ca.ui.PictureItem");
jQuery.sap.require("sap.ca.ui.utils.CanvasHelper");


sap.ca.ui.AddPicture.BUTTON_PAGE_TYPE = {'TAB': 'Tab', 'FORM': 'Form'};

/**
 * Initialise control.
 */
sap.ca.ui.AddPicture.prototype.init = function () {

	// proxy to keep the "this" pointer
	var fireCaptureInput = jQuery.proxy(this._clickCaptureInput, this);

	// Add Button
	this._oButton = new sap.m.Button(this.getId() + "-add", {
		press: fireCaptureInput,
		icon: "sap-icon://add",
		type: sap.m.ButtonType.Transparent,
		width: "100%",
		enabled: true
	}).setParent(this).addStyleClass("sapCaUiAddPictureButton");

	// set the default button text (sets the property at the same time)
	this.setText(sap.ca.ui.utils.resourcebundle.getText("addPicture.text"));

	// for testing iFrame in other browsers
	this._forceUpload = false;

};

/**
 * Called when the control is destroyed
 */
sap.ca.ui.AddPicture.prototype.exit = function () {

	if (this._oButton) {
		this._oButton.destroy();
	}

	if (!window.FileReader || this._forceUpload) {
		jQuery.sap.byId(this.getId() + "-capture").fileupload('destroy');
	}
};

/**
 * Called after the control has been rendered
 */
sap.ca.ui.AddPicture.prototype.onAfterRendering = function () {

	// client side file upload support? // not IE9 for example
	if (!window.FileReader || this._forceUpload) {
		// check the URL for upload
		var sURL = this.getUploadUrl();
		// if the URL is empty we can not upload
		if (sURL == null || sURL.length == 0) {
			jQuery.sap.log.error("AddPicture: The 'uploadUrl' property has not been set or is empty, and is required for this browser");
		} else {
			jQuery.sap.byId(this.getId() + "-capture").fileupload({
				url: sURL,
				add: jQuery.proxy(this._handleServerUpload, this),
				done: jQuery.proxy(this._handleServerUploadComplete, this),
				fail: jQuery.proxy(this._handleServerUploadFail, this)
			});
		}
	} else {
		// supported browsers
		var inputCapture = jQuery.sap.domById(this.getId() + "-capture"); // input object
		if (inputCapture) {
			inputCapture.onchange = jQuery.proxy(this._handleClientUpload, this);
		}
	}

	//if max limit of pictures reached
	var iNbPict = this.getPictures().length;
	if (inputCapture) {
		inputCapture.visibility = iNbPict >= this.getMaxPictureNumber();
	}
};


/**
 * Set the text for the button
 * @override
 * @public
 * @param sValue {string}
 */
sap.ca.ui.AddPicture.prototype.setText = function (sValue) {
	this._oButton.setText(sValue);
	this.setProperty("text", sValue);
};


/**
 * Accessor for the button control used by the renderer
 * @return {sap.m.Button} The button control
 * @private
 */
sap.ca.ui.AddPicture.prototype._getButton = function () {
	return this._oButton;
};

/**
 * Handler for the input change event
 * @private
 */
sap.ca.ui.AddPicture.prototype._handleClientUpload = function () {
	var input = jQuery.sap.domById(this.getId() + "-capture"); // input object
	var files = input.files;
	var rejectedAttachments = [];

	// files not supported
	if (!files) {
		jQuery.sap.log.error("HTML5 files property not supported on input element for this browser");
	} else {
		// other browsers
		var i, f;
		// Loop through the FileList and render image files as thumbnails.
		for (i = 0; f = files[i]; i++) {
			// Only process image files.
			if (!f.type.match('image.*')) {
				rejectedAttachments.push(f.name);
				continue;
			}
			this._readFile(f);
		}
		if (rejectedAttachments.length > 0) {
			this.fireFileNotSupported({
				fileNames: rejectedAttachments
			});
		}
	}
};


/**
 * Handler for server upload
 * @private
 */
sap.ca.ui.AddPicture.prototype._handleServerUpload = function (event, data) {
	try {
		this._enableUpload(false);
		// upload
		data.submit();
	} catch (error) {
		this._enableUpload(true);
		this.fireImageUploadFailed({
			reason: "Submit Error",
			response: data
		});
	}
};

/**
 * Handler for server upload complete
 * @private
 */
sap.ca.ui.AddPicture.prototype._handleServerUploadComplete = function (event, data) {
	this._enableUpload(true);

	var errorStatus = null;

	// check that we have a result object
	if (data != null && data.result != null) {
		var fileName = null;
		if (data.files != null && data.files.length === 1) {
			fileName = data.files[0].name;
		}

		// the response is inside <html><body><pre> when using the iFrame
		try {
			var $result = data.result.find("pre");
			if ($result.length === 0) {
				$result = jQuery('pre', data.result);
			}

			var imageSource = $result.text();
			if (imageSource != null && imageSource.indexOf("data:image/") === 0) {
				this._createAndAddPictureItem(imageSource, fileName);
			} else if (data.result.indexOf != null && data.result.indexOf("data:image/") === 0) {
				// if the browser supports XHR then the result is good
				// create the image using the data returned from the server
				this._createAndAddPictureItem(data.result, fileName);
			} else if (data.result[0] != null && data.result[0].title != null) {
				// it could be a HTML page returned (error case) - session timeout, not logged on
				errorStatus = data.result[0].title;
			}
		} catch (e) {
			jQuery.sap.log.error("Error while retrieving upload response from iframe");
			errorStatus = "No response found";
		}
	} else {
		errorStatus = "Invalid response";
	}

	// provide information on event so that custom error message can be used
	if (errorStatus != null) {
		this.fireImageUploadFailed({
			reason: errorStatus,
			response: data
		});
	}
};

/**
 * Handler for server upload complete
 * @private
 */
sap.ca.ui.AddPicture.prototype._handleServerUploadFail = function (event, data) {
	this._enableUpload(true);

	this.fireImageUploadFailed({
		reason: "Upload Failed",
		response: data
	});
};

/**
 * File reader
 * @private
 */
sap.ca.ui.AddPicture.prototype._readFile = function (f) {
	this._createAndAddPictureItemFromFile(f);
};


/**
 * Handler for the input click event
 * @private
 */
sap.ca.ui.AddPicture.prototype._clickCaptureInput = function (oEvent) {
	//if max limit of pictures reached, fire event.
	var iNbPict = this.getPictures().length;
	if (iNbPict >= this.getMaxPictureNumber()) {
		// fire max limit reached
		this.fireMaxPictureLimitReached({
			Limit: iNbPict
		});
	} else {
		jQuery.sap.domById(this.getId() + '-capture').click();
	}
};


/**
 * Create and add a new PictureItem
 * @private
 */
sap.ca.ui.AddPicture.prototype._createAndAddPictureItem = function (imageSource, filename) {
	var oPictureItem = new sap.ca.ui.PictureItem({ status: sap.ca.ui.PictureItem.STATUS.ADD,
		name: filename, source: imageSource
	});
	this.addPicture(oPictureItem);
	this.firePictureAdded({
		pictureItem: oPictureItem
	});
};

/**
 * Create and add a new PictureItem
 * @private
 */
sap.ca.ui.AddPicture.prototype._createAndAddPictureItemFromFile = function (file) {
	var oPictureItem = new sap.ca.ui.PictureItem({ status: sap.ca.ui.PictureItem.STATUS.ADD, name: file.name });

	var that = this;
	oPictureItem.attachLoaded(function () {
		that.addPicture(oPictureItem);

		that.firePictureAdded({
			pictureItem: oPictureItem
		});
	});

	oPictureItem.setFile(file, this._getConfig());
};


sap.ca.ui.AddPicture.prototype._getConfig = function () {
	var compression = this.getCompression();
	var oConfig = {};
	switch (compression) {
		case "high":
			// do NOT crop on IE otherwise you get black area in your image
			oConfig = {width: 320, height: 320, crop: sap.ui.getCore().isMobile(), quality: 72};
			oConfig.minWeight = 50;
			break;
		case "low":
		default:
			if (jQuery.device.is.desktop) {
				oConfig = {width: 1024, height: 1024, crop: false, quality: 144};
			} else {
				oConfig = {width: 800, height: 800, crop: false, quality: 144};
			}
			oConfig.minWeight = 150;
			break;
	}

	return oConfig;
};


/**
 * Control fires show event caused by the picture item
 * @private
 */
sap.ca.ui.AddPicture.prototype._pictureTapped = function (oPictureItem) {
	this.fireShow({
		pictureItem: oPictureItem
	});
};


sap.ca.ui.AddPicture.prototype.ontouchstart = function (oEvent) {
	if (!jQuery.device.is.desktop && oEvent.target.id === this.getId() + "-capture") {
		this._oButton._activeButton();
	}

};

sap.ca.ui.AddPicture.prototype.ontouchend = function (oEvent) {
	if (!jQuery.device.is.desktop) {
		this._oButton._inactiveButton();
	}
};

sap.ca.ui.AddPicture.prototype.ontouchcancel = function (oEvent) {
	if (!jQuery.device.is.desktop) {
		this._oButton._inactiveButton();
	}
};


/**
 * Function is called when tap occurs on button.
 *
 * @private
 */
sap.ca.ui.AddPicture.prototype.ontap = function (oEvent) {
	if (!jQuery.device.is.desktop && oEvent.target.id === this.getId() + "-capture") {
		this._oButton.fireTap();
	}
};


/**
 *
 * @param bEnabled
 * @private
 */
sap.ca.ui.AddPicture.prototype._enableUpload = function (bEnabled) {
	bEnabled = !!bEnabled;

	var input = jQuery.sap.domById(this.getId() + "-capture");
	if (input) {
		input.style.width = (bEnabled ? "auto" : "0px");
	}
	this._oButton.setEnabled(bEnabled);
};
