/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides control sap.uiext.inbox.composite.InboxAttachmentsTileContainer.
jQuery.sap.declare("sap.uiext.inbox.composite.InboxAttachmentsTileContainer");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new composite/InboxAttachmentsTileContainer.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * InboxAttachmentsTileContainer
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @name sap.uiext.inbox.composite.InboxAttachmentsTileContainer
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxAttachmentsTileContainer", /** @lends sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype */ { metadata : {

	library : "sap.uiext.inbox",
	properties : {

		/**
		 * URL to upload the selected file
		 */
		uploadUrl : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * name of the selected file for uploading
		 */
		fileName : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * type of the selected file for uploading
		 */
		fileType : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * boolean property to indicate if user has selected a file to upload
		 */
		isFileSelected : {type : "boolean", group : "Misc", defaultValue : null},

		/**
		 * description string entered by user while uploading a file
		 */
		enteredDescription : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * boolean value to indicate whether to show Add Attachment tile
		 */
		showAddTile : {type : "boolean", group : "Misc", defaultValue : true}
	},
	aggregations : {

		/**
		 * aggregation for attachments tile
		 */
		attachments : {type : "sap.uiext.inbox.composite.InboxAttachmentTile", multiple : true, singularName : "attachment"}, 

		/**
		 * aggregation for the first tile in tile container
		 */
		firstTile : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}
	},
	events : {

		/**
		 * event is fired to add all the header parameters just before uploading a file
		 */
		uploadButtonPress : {}, 

		/**
		 * event is fired when uploading a file is completed successfully
		 */
		uploadSuccess : {}, 

		/**
		 * event is fired when uploading a file has failed
		 */
		uploadFailed : {}
	}
}});


jQuery.sap.require("sap.uiext.inbox.composite.InboxAttachmentFileUploader");
jQuery.sap.require("sap.uiext.inbox.InboxUtils");
jQuery.sap.require("sap.ui.commons.MessageBox");

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.init = function(){

	var that = this;
	this.oUtils = sap.uiext.inbox.InboxUtils;
	this._oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
	
	this.oAddAttachmentTile = new sap.uiext.inbox.composite.InboxAddAttachmentTile();
	this.setAggregation("firstTile", this.oAddAttachmentTile);

	this.oUploadAttachmentTile = new sap.uiext.inbox.composite.InboxUploadAttachmentTile();
	
	this.oUploadAttachmentTile.getUploadButton().attachPress(function(oEvent) {
		that.getAggregation("firstTile").setBusy(true);
		that.fireUploadButtonPress();
	});
	
	this.oUploadAttachmentTile.getCancelButton().attachPress(function(oEvent) {
		that.resetFileUploader();
		that.resetFirstTile();
	});
	
	this.oFileUploader = new sap.uiext.inbox.composite.InboxAttachmentFileUploader({
		sendXHR : true,
		
		change : jQuery.proxy(function(oEvent) {
			this.oFileUploader.setUploadUrl(this.getUploadUrl());
			var oFile = this.oFileUploader.oFileUpload.files[0];
			if(oFile && oFile.size === 0){
				this.oFileUploader.setValue("");
				sap.ui.commons.MessageBox.alert(that._oBundle.getText("SIZE_ZERO_ATTACHMENT_ALERT"));
			}
			else{
				this.oUploadAttachmentTile.setFileName(oFile.name).setFileTypeIcon(this.oUtils._getFileTypeIcon(oFile.type));
				this.setAggregation("firstTile", this.oUploadAttachmentTile);
			}
			
		}, this),
		
		uploadComplete : function(oEvent) {
			var statusCode = oEvent.getParameter("status");
			if (statusCode && statusCode == 201) {
				that.fireUploadSuccess({
					"attachmentResponse": oEvent.getParameter("response"), 
					"statusCode": statusCode, 
					"headerParameters": oEvent.getParameter("headerParameters")
				});
			} else {
				that.fireUploadFailed({
					"attachmentResponse": oEvent.getParameter("response"),
					"statusCode": statusCode,
					"securityToken": oEvent.getParameter("x-csrf-token"),
					"headerParameters": oEvent.getParameter("headerParameters")
				});
			}
			that.resetFileUploader();
			that.resetFirstTile();
		}
		
	});
	
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.onclick = function(oEvent){
	if (oEvent.target.id === this.getAggregation("firstTile").getId() + "_textAddAttachment") {
			jQuery.sap.byId(this.oFileUploader.getId() + "-fu").trigger("click");
		}
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.getFileName = function() {
	if (this.getIsFileSelected()) {
		return this.oFileUploader.oFileUpload.files[0].name;
	}
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.getFileType = function() {
	if (this.getIsFileSelected()) {
		return this.oFileUploader.oFileUpload.files[0].type;
	}
};

/**
 * method to add a header parameter while uploading a file. This method takes header name and header value as input.
 *
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */
sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.addUploadHeader = function(sHeaderName, sHeaderValue) {
	this.oFileUploader.addHeaderParameter(new sap.ui.commons.FileUploaderParameter({name: sHeaderName, value: sHeaderValue}));
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.getIsFileSelected = function() {
	return this.oFileUploader.oFileUpload.files.length>0;
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.resetFileUploader = function() {
	this.oFileUploader.setValue("").destroyHeaderParameters();
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.resetFirstTile = function() {
	this.getAggregation("firstTile").setBusy(false);
	this.setAggregation("firstTile", this.oAddAttachmentTile);
};

sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.triggerUpload = function(oEvent){
	this.oFileUploader.upload();
};

/**
 * method to remove a headerParameter of fileUploader
 *
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */
sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.removeUploadHeader = function(sHeaderParameter) {
	var that = this;
	jQuery.each(this.oFileUploader.getHeaderParameters(), function(i, oHeader) {
		if (oHeader.getName() === sHeaderParameter)
			that.oFileUploader.removeHeaderParameter(oHeader);
	});
};

/*sap.uiext.inbox.composite.InboxAttachmentsTileContainer.prototype.getEnteredDescription = function() {
	return this.oUploadAttachmentTile.getTextField().getLiveValue();
};
*/