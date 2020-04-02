/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.FileUpload.
jQuery.sap.declare("sap.ca.ui.FileUpload");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new FileUpload.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Allows you to display a list of uploaded files. You can also upload a new one, rename or delete them
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @deprecated Since version 1.26. 
 * This control is available in sap.m in 1.26, as sap.m.UploadCollection.
 * Please use UploadCollection, as sap.ca.ui.FileUpload will not be supported anymore from 1.26.
 * @name sap.ca.ui.FileUpload
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.ca.ui.FileUpload", /** @lends sap.ca.ui.FileUpload.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * Url of server we wish to upload to
		 */
		uploadUrl : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Relative path in model, pointing to property that stores the name of a file.
		 */
		fileName : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Relative path in model, pointing to property that stores the size of a file.
		 */
		size : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Relative path in model, pointing to property that stores the url at which the file is stored.
		 */
		url : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Relative path in model, pointing to property that stores the date at which a file was uploaded.
		 */
		uploadedDate : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Relative path in model, pointing to property that stores the name of the person who uploaded the file.
		 */
		contributor : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Relative path in model, pointing to property that stores the uploaded files extension. Note: either fileExtension or mimeType may be used, but mimeType is preferable.
		 */
		fileExtension : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Relative path in model, pointing to property that stores the file's mimeType. Note: either fileExtension or mimeType may be used, but mimeType is preferable.
		 */
		mimeType : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * The base path in the model for the control. Avoid trailing forward slashes in value, as per default value.
		 */
		items : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * This property enables & disables the ability to upload a file
		 */
		uploadEnabled : {type : "boolean", group : "Misc", defaultValue : null},

		/**
		 * An identifier property name that is used to uniquely reference the file on the server.
		 */
		fileId : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * The XSRF token the control should use when making the upload request. If it is not set, the control will not use a security token.
		 */
		xsrfToken : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Indicates if the control should send multipart/form data request when uploading
		 */
		useMultipart : {type : "boolean", group : "Misc", defaultValue : false},

		/**
		 * The Accept request header the control should use when sending the upload request
		 */
		acceptRequestHeader : {type : "string", group : "Misc", defaultValue : 'application/json'},

		/**
		 * Url of server that will base64 encode the file
		 */
		encodeUrl : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Indicates whether rename functionality should be enabled
		 */
		renameEnabled : {type : "boolean", group : "Misc", defaultValue : null},

		/**
		 * Indicates whether delete functionality should be enabled
		 */
		deleteEnabled : {type : "boolean", group : "Misc", defaultValue : null},

		/**
		 * Indicates whether the user is allowed to select multiple file at once from his desktop
		 */
		multipleSelectionEnabled : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * Show the label "No data" when the control doesn't have files
		 */
		showNoData : {type : "boolean", group : "Misc", defaultValue : false},

		/**
		 * Indicates whether file uploads should occur sequentially or in parallel. The default is in parallel.
		 */
		sequentialUploadsEnabled : {type : "boolean", group : "Misc", defaultValue : false},

		/**
		 * Show the Attachments count label
		 */
		showAttachmentsLabel : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * Show the edit user controls to rename and delete files (same as deleteEnabled and renameEnabled)
		 */
		useEditControls : {type : "boolean", group : "Misc", defaultValue : false},

		/**
		 * Show the Attachments label in edit mode
		 * @deprecated Since version 1.21.0. 
		 * This method is deprecated now. Use the showAttachmentsLabel instead
		 */
		showAttachmentsLabelInEditMode : {type : "boolean", group : "Misc", defaultValue : true, deprecated: true},

		/**
		 * Property to allow toggling between edit and view screens.
		 * @deprecated Since version 1.21.0. 
		 * This method is deprecatd now. If you want to prevent edit you can use useEditControls property or the deleteEnabled, renameEnabed and uploadEnabled properties
		 */
		editMode : {type : "boolean", group : "Misc", defaultValue : false, deprecated: true}
	},
	aggregations : {

		/**
		 * Aggregation that displays the list of items currently uploaded or uploading
		 */
		_fileList : {type : "sap.m.List", multiple : false, visibility : "hidden"}, 

		/**
		 * Aggregation that displays the current number of items that are being uploaded
		 */
		uploadProgressLabel : {type : "sap.m.Label", multiple : false}, 

		/**
		 * Aggregation that shows the number of files currently uploaded
		 * @deprecated Since version 1.21.0. 
		 * This aggregation is deprecatd now. The label is part of the ToolBar
		 */
		attachmentNumberLabel : {type : "sap.m.Label", multiple : false, deprecated: true}, 

		/**
		 * Aggregation that contains the buttons for adding
		 */
		toolBar : {type : "sap.m.Toolbar", multiple : false}
	},
	events : {

		/**
		 * Fired when a file deletion event occurs typically by clicking a the delete icon. The file descriptor json for the file to be deleted is passed in the event data
		 */
		deleteFile : {}, 

		/**
		 * Fired when a file is renamed. The file descripter json for the file to be renamed is passed in the event data and also a property, newFilename, that contains the new filename.
		 */
		renameFile : {}, 

		/**
		 * Fired when a file is uploaded and the response comes back from service. The service response for the file to be added to the list is passed in the event data and the consumer must format it in the correct json structure and pass it back to the control using commitUploadFile method.
		 */
		uploadFile : {}, 

		/**
		 * Fired when a file fails to upload. The error code and response data is passed in this event. The consumer should handle the error by showing the appropriate message.
		 */
		fileUploadFailed : {}, 

		/**
		 * Fired just before the control is about to make a file upload request. The data passed is the file object selected by the user. You may handle this event to attach custom headers for example if your service implementation requires it.
		 */
		beforeUploadFile : {}, 

		/**
		 * Fired when the save button is clicked. The consumer should handle the event and save all the file renames to backend.
		 * @deprecated Since version 1.21.1. 
		 * This method is deprecated now. The rename or delete event is enough and should be use to commit the action immediatly
		 */
		saveClicked : {deprecated: true}, 

		/**
		 * Fired when the cancel button is clicked. The consumer may handle the event if required.
		 * @deprecated Since version 1.21.1. 
		 * This method is deprecated now
		 */
		cancelClicked : {deprecated: true}
	}
}});


/**
 * Remove the specified file from the control
 *
 * @name sap.ca.ui.FileUpload#removeFile
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Abandon any pending renames to update the filenames
 *
 * @name sap.ca.ui.FileUpload#abandonPendingRenames
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Commit the pending renames so the filename is updated in the model
 *
 * @name sap.ca.ui.FileUpload#commitPendingRenames
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Abandon the pending rename of a specific file
 *
 * @name sap.ca.ui.FileUpload#abandonPendingRename
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Commit the pending rename of a specific file
 *
 * @name sap.ca.ui.FileUpload#commitPendingRename
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Commit the file upload by sending the control the JSON structure of the file descriptor.
 *
 * @name sap.ca.ui.FileUpload#commitFileUpload
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * method to set a custom header for a request. Takes the header name and the value as parameters.
 *
 * @name sap.ca.ui.FileUpload#setCustomHeader
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * method to remove request headers set. Takes name of header to remove.
 *
 * @name sap.ca.ui.FileUpload#removeCustomHeader
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Enable/Disable editing, typically to be used during saves or deletes and other server updates
 *
 * @name sap.ca.ui.FileUpload#preventEdits
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * method to check if control is currently uploading a file
 *
 * @name sap.ca.ui.FileUpload#isUploading
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Method to abort an upload. If a file parameter is supplied only the file will be aborted. Otherwise, all pending uploads are aborted.
 *
 * @name sap.ca.ui.FileUpload#abortUpload
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

jQuery.sap.require("sap.ca.ui.utils.resourcebundle");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");
jQuery.sap.require("sap.ca.ui.model.type.Date");
//************** Control events handlers *********************
sap.ca.ui.FileUpload.prototype.init = function () {
    this._isDataBound = false;
    this._oCustomHeaderArray = [];
    this._oBundle = sap.ca.ui.utils.resourcebundle;
    // initialise the localisation texts as private properties
    this._sOverallUploadingText = this._oBundle.getText("FileUploader.uploadingOutOf", ["{filesUploaded} ", " {filesToUpload}"]);
    this._sDeleteFile = this._oBundle.getText("FileUploader.deleteFile");
    this._sContinue = this._oBundle.getText("FileUploader.continue");
    this._sDeleteQuestion = this._oBundle.getText("FileUploader.deleteQuestion");
    this._oAddButton = new sap.m.Button({
        icon: "sap-icon://add",
        type: sap.m.ButtonType.Transparent,
        press: jQuery.proxy(function () {
            jQuery.sap.domById(this.getId() + '-upload').click();
        }, this),
        visible: this.getUploadEnabled()
    });
    this._setProgressLabel();
    this._oNumberOfAttachmentsLabel = new sap.m.Label(this.getId() + "-attachmentLabel", {design: sap.m.LabelDesign.Standard}).addStyleClass("sapCaUiFileUploadAttachmentLabel");
    this._oToolBar = new sap.m.Toolbar({

        content: [
            this._oAddButton,
            new sap.m.ToolbarSpacer(),
            this._oNumberOfAttachmentsLabel
        ]
    }).addStyleClass('sapCaUiFUToolbar');
    this._oUploadedDateLabel = new sap.m.Label(this.getId() + "-uploadedDate", {visible: "{isUploaded}"});
    this._oUploadingProgressLabel = new sap.m.Label(this.getId() + "-uploadProgressLabel", {
        textAlign: sap.ui.core.TextAlign.End,
        text: this._sOverallUploadingText
    }).addStyleClass("sapCaUiFileUploadProgressLabel");
    this._oFileExtensionLabel = new sap.m.Text(this.getId() + "-extension", {text: "{parsedFileExtension}"}).addStyleClass('sapCaUiFUExtension');
    this._oFileNameLabel = new sap.m.Link(this.getId() + "-filename", { target: "_blank" }).addStyleClass('sapCaUiFileUploadFileLoadedText');
    this._oFileNameEditBox = new sap.m.Input(this.getId() + "-editFileName", {type: sap.m.Input.Text, placeholder: this._oBundle.getText("FileUploader.inputPlaceholder")}).addStyleClass('sapCaUiFileUploadEditBox');
    this._oFileNameEditBox.setLayoutData(new sap.m.FlexItemData({growFactor: 1}));
    this._oFileNameEditBox.attachChange(this._nameChanged, this);
    this._oDateSizeHL = new sap.ui.layout.HorizontalLayout(this.getId() + "-ba-datesizelayout", {
        content: [
            this._oUploadedDateLabel,
            this._oProgressLabel ],
        allowWrapping: true
    }).addStyleClass('sapCaUiFUInnerHL');
    this._oInputExtensionHL = new sap.m.HBox({
        items: [
            this._oFileNameEditBox,
            this._oFileExtensionLabel
        ],
        visible: "{isEditMode}"}).addStyleClass("sapCaUiInnerEditHL");
    var oInnerLayout = new sap.ui.layout.VerticalLayout(this.getId() + "-ba-inner", {
        content: [ this._oFileNameLabel,
            this._oInputExtensionHL,
            this._oDateSizeHL ]
    }).addStyleClass('sapCaUiFUInner');
    this._oItemIcon = new sap.ui.core.Icon(this.getId() + "-icon", {visible: {
        parts: [
            {path: "isPendingFileRename"},
            {path: "isUploaded"}
        ],
        formatter: jQuery.proxy(function (isPendingFileRename, isUploaded) {
            return ((!isPendingFileRename) && isUploaded);
        }, this)
    }   }).addStyleClass("sapCaUiFileUploadItemIcon");
    var _oCancelIcon = new sap.m.Button({
            id: this.getId() + "-cancelIcon",
            icon: "sap-icon://sys-cancel-2",
            type: sap.m.ButtonType.Transparent,
            press: jQuery.proxy(function (oEvent) {
                    this._handleCancel(oEvent.getSource());
                }
                , this
            ),
            visible: {
                parts: [
                    {path: "/isDeleteEnabled"},
                    {path: "isUploading"}
                ],
                formatter: jQuery.proxy(function (isDeleteEnabled, isUploading) {
                    return !isDeleteEnabled && isUploading;
                }, this)
            }
        }
    ).addStyleClass("sapCaUiFileUploadCancelIcon");
    var _oSaveIcon = new sap.m.Button({
        id: this.getId() + "-saveIcon",
        icon: "sap-icon://save",
        type: sap.m.ButtonType.Transparent,
        press: jQuery.proxy(this._handleSave, this),
        visible: { parts: [
            {path: "/isRenameEnabled"},
            {path: "isUploading"},
            {path: "isEditMode"}
        ],
            formatter: jQuery.proxy(function (isRenameEnabled, isUploading, isEditMode) {
                return isRenameEnabled && (!isUploading) && isEditMode;
            }, this)
        }}).addStyleClass("sapCaUiFileUploadEditIcon");
    var _oEditIcon = new sap.m.Button({
        id: this.getId() + "-editIcon",
        icon: "sap-icon://edit",
        type: sap.m.ButtonType.Transparent,
        press: jQuery.proxy(this._handleEdit, this),
        visible: { parts: [
            {path: "/isRenameEnabled"},
            {path: "isUploading"},
            {path: "isEditMode"}
        ],
            formatter: jQuery.proxy(function (isRenameEnabled, isUploading, isEditMode) {
                return isRenameEnabled && (!isUploading) && (!isEditMode);
            }, this)
        }}).addStyleClass("sapCaUiFileUploadEditIcon");
    var oHL = new sap.ui.layout.HorizontalLayout(this.getId() + "-ba-hl", {
        content: [
            new sap.m.BusyIndicator({
                id: this.getId() + "-indicator",
                visible: {
                    parts: [
                        {path: "isPendingFileRename"},
                        {path: "isUploading"}
                    ],
                    formatter: jQuery.proxy(function (isPendingFileRename, isUploading) {
                        return (isPendingFileRename || isUploading);
                    }, this)
                }
            }).setSize('2.5rem').addStyleClass('sapCaUiFileUploadloadingIcon'),
            this._oItemIcon,
            oInnerLayout,
            _oCancelIcon,
            _oEditIcon,
            _oSaveIcon],
        allowWrapping: true
    }).addStyleClass("sapCaUiFUItemHL");
    this._oViewPageList = new sap.m.List({"delete": [this._handleDelete, this]});
    this._oViewPageList.addStyleClass("sapCaFileUploadListBorder");
    this._oTemplate = new sap.m.CustomListItem({content: [ oHL ]});
    this._oViewPageList.addEventDelegate({onAfterRendering: jQuery.proxy(this._onListAfterRendering, this)});
    this.setAggregation("_fileList", this._oViewPageList);
    this.setAggregation("uploadProgressLabel", this._oUploadingProgressLabel);
    this.setAggregation("toolBar", this._oToolBar);
// We need to keep reference of last pressed edit btn path to handle the focus out with this special case
// CSS: 012003146900005514402014
    this._editBtnPressedPath = null;
}
;
sap.ca.ui.FileUpload.prototype.onAfterRendering = function () {
    var sUploadUrl = this.getUploadUrl();
    //Set if the "No data" label have to be displayed.
    this._oViewPageList.setShowNoData(this.getShowNoData());
    var sId = this.getId();
    // escape the jQuery selector for initialisation of the file uploader
    sId = sId.replace(/[#;&,.+*~':"!^$[\]()=>|\/]/g, "\\$&");
    sId = '#' + sId + '-upload';
    // for IE9 or below, we need to first send the multipart/form request to the base64
    // encoder service
    if (this._isIE9OrBelow() && !this.getUseMultipart()) {
        if (this.getEncodeUrl() === "") {
            jQuery.sap.log.warning("FileUpload: encodeUrl property is empty (required by IE9 to base64 encode the file before sending it)");
        }
        sUploadUrl = this.getEncodeUrl();
    }
    if (jQuery(sId).fileupload) {
        jQuery(sId).fileupload({
            multipart: this.getUseMultipart(),
            url: sUploadUrl,
            sequentialUploads: this.getSequentialUploadsEnabled(),
            add: jQuery.proxy(function (e, data) {
                this.onAdd(e, data);
            }, this),
            send: jQuery.proxy(function (e, data) {
                this.sending(e, data);
            }, this),
            progress: jQuery.proxy(function (e, data) {
                this.calculateProgress(e, data);
            }, this),
            done: jQuery.proxy(function (e, data) {
                this.uploadDone(e, data);
            }, this),
            fail: jQuery.proxy(function (e, data) {
                this.handleUploadFailure(e, data);
            }, this),
            beforeSend: jQuery.proxy(function (xhr, data) {
                //allow consumer to handle before file upload in case they want to set custom headers based on file info
                var iFileIndex = this._findFileIndexByInternalId(data.files[0].internalId);
                this.getModel().setProperty(this.getItems() + "/" + iFileIndex + "/abortUplXhr", jQuery.proxy(xhr.abort, xhr));
                // this is a workaround for an Win8.1IE11 issue where the file.contentType is missing (with multipart=false)
                // for files that don't have an associated reader installed on the client machine
                // in that case, we determine it from the file's extension. Other IE versions may have the issue as well according to
                // http://msdn.microsoft.com/en-us/library/ms775147.ASPX
                // CSS  23828/2014
                if (this._isIE() && !this.getUseMultipart() && !data.contentType) {
                    var sMimeType = this._getMimeTypeFromExtension(this._findFileExtension(data.files[0].name));
                    data.contentType = sMimeType;
                    xhr.setRequestHeader("Content-Type", data.contentType);
                }
                this.fireBeforeUploadFile(data.files[0]);
                this._setRequestHeaders(xhr);
            }, this)
        });
    }
    //this fix is required for IE10 xhr2 fileupload with multipart=false support
    //it was taken from this commit in the jQuery FileUpload control
    //https://github.com/blueimp/jQuery-File-Upload/commit/41d50543c6392118323a39320b3cf62594546106
    //TODO: this should be removed once we have approval to update to the latest release of jQuery FileUpload
    jQuery.support.xhrFileUpload = !!(window.ProgressEvent && window.FileReader);
};
sap.ca.ui.FileUpload.prototype.exit = function () {
    this._oViewPageList.destroy();
    this._oViewPageList = null;
    this._oTemplate.destroy();
    this._oTemplate = null;
    this._oFileNameLabel.destroy();
    this._oFileNameLabel = null;
    this._oUploadedDateLabel.destroy();
    this._oUploadedDateLabel = null;
    this._oProgressLabel.destroy();
    this._oProgressLabel = null;
    if (this._oInputExtensionHL) {
        this._oInputExtensionHL.destroy();
        this._oInputExtensionHL = null;
    }
    if (this._oDateSizeHL) {
        this._oDateSizeHL.destroy();
        this._oDateSizeHL = null;
    }
};
//****************** API METHODS *****************************
/**
 * Enable/Disable editing while in edit mode, typically to be used during saves
 * or deletes and other server updates
 */
sap.ca.ui.FileUpload.prototype.preventEdits = function (bLock) {
    var listContext = this.getItems();
    this.getModel().setProperty(listContext + "/isEditEnabled", !bLock);
};
/**
 * removes file from list by id
 * @param fileId
 */
sap.ca.ui.FileUpload.prototype.removeFile = function (fileId) {

    //this is a backwards compatibility fix as previously, passing an array
    //used to work and now it does not (due to strict equal change below)
    if ((fileId instanceof Array) && fileId.length > 0) {
        fileId = fileId[0];
    }
    var oNewItems = [];
    var oItems = this.getModel().getProperty(this.getItems());
    for (var i = 0; i < oItems.length; i++) {
        if (oItems[i][this.getFileId()] !== fileId) {
            oNewItems.push(oItems[i]);
        }
    }
    // preserve the state for remaining uploads
    oNewItems.isUploading = oItems.isUploading;
    oNewItems.filesToUpload = oItems.filesToUpload;
    oNewItems.filesUploaded = oItems.filesUploaded;
    oNewItems.isEditEnabled = oItems.isEditEnabled;
    this.getModel().setProperty(this.getItems(), oNewItems);
    this.commitPendingRenames(true);  //update model with any changes to filenames which have not been handled before delete
};
/**
 * sets the Control's model
 * @param model
 */
sap.ca.ui.FileUpload.prototype.setModel = function (model) {
    this._isDataBound = true;
    if (this._oProgressLabel) {
        this._oProgressLabel.destroy();
    }
    sap.ui.core.Control.prototype.setModel.call(this, model);
    this._setProgressLabel();
    // set the initial states of the existing files
    jQuery.each(this.getModel().getProperty(this.getItems()),
        jQuery.proxy(function (index, value) {
            var sPrefix = this.getItems() + "/" + index;
            this.getModel().setProperty(
                    sPrefix + "/isUploaded", true);
            this.getModel().setProperty(
                    sPrefix + "/isUploading", false);
            this.getModel().setProperty(
                    sPrefix + "/isEditMode", false);
            this.getModel().setProperty(
                    sPrefix + "/isPending", false);
            this.getModel().setProperty(
                    sPrefix + "/isDeleteVisible", false);
            // add states to allow succesful rename of files
            this.getModel().setProperty(
                    sPrefix + "/isPendingFileRename", false);
            this.getModel().setProperty(
                    sPrefix + "/isFileNameSwapped", false);
            this.getModel().setProperty(sPrefix + "/isHiddenFile", false);
            // we need to parse the file type from the filename.
            // split the filename into an array, the final index contains the file extension
            var sParsedFileExtension = this.getModel().getProperty(sPrefix + "/" + this.getFileName()).split(".");
            // case to deal with a file that has no extension, return an empty string for the extension
            if (sParsedFileExtension.length === 1) {
                sParsedFileExtension = "";
                // If a[0] == "" and a.length == 2 it's a hidden file with no extension ie. .htaccess
            } else if (sParsedFileExtension[0] === "" && sParsedFileExtension.length === 2) {
                this.getModel().setProperty(sPrefix + "/isHiddenFile", true);
                sParsedFileExtension = "";
                // otherwise pop off everything at the front of the array, and we know have the file extension
            } else {
                sParsedFileExtension = "." + sParsedFileExtension.pop();
            }
            this.getModel().setProperty(
                    sPrefix + "/parsedFileExtension", sParsedFileExtension);
        }, this)
    );
    // initialise overall state of the control
    this._setIsUploading(false);
    this.getModel().setProperty(this.getItems() + "/filesToUpload", 0);
    this.getModel().setProperty(this.getItems() + "/filesUploaded", 1);
    this.getModel().setProperty(this.getItems() + "/isEditEnabled", true);
    this.getModel().setProperty("/isRenameEnabled", this.getRenameEnabled());
    this.getModel().setProperty("/isDeleteEnabled", this.getDeleteEnabled());
    this._oNumberOfAttachmentsLabel.bindProperty("text", this.getProperty("items") + "/length", function (length) {
        var sLabelText = sap.ca.ui.utils.resourcebundle.getText("FileUploader.attachments") + " (" + length + ")";
        return sLabelText;
    });
    this._oNumberOfAttachmentsLabel.setVisible(this.getShowAttachmentsLabel());
    this._oUploadingProgressLabel.bindProperty("visible", this.getProperty("items") + '/isUploading');
    this._oUploadingProgressLabel.bindElement(this.getProperty("items"));
    this._oNumberOfAttachmentsLabel.bindElement(this.getProperty("items"));
    this._oViewPageList.bindItems(this.getProperty("items"), this._oTemplate, null, null);
    this._oViewPageList.bindProperty("mode", {path: "/isDeleteEnabled", formatter: function (b) {
        return (b ? sap.m.ListMode.Delete : sap.m.ListMode.None);
    }});
    this._oDateSizeHL.addContent(this._oProgressLabel);
};
/**
 * sets the progress label text and visibility
 */
sap.ca.ui.FileUpload.prototype._setProgressLabel = function () {
    this._oProgressLabel = new sap.m.Label(this.getId() + "-progress", {
        text: {
            path: "uploadPercent",
            formatter: function (value) {
                var sBindingContext = this.getBindingContext().getPath();
                var path = sBindingContext + "/uploadPercent";
                var percent = this.getModel().getProperty(path);
                var sValue = sap.ca.ui.utils.resourcebundle.getText("FileUploader.uploading", [percent]);
                return sValue;
            }
        },
        visible: {path: "isUploading",
            formatter: jQuery.proxy(function (oValue) {
                if (this._isIE9OrBelow()) {
                    return false;
                }
                return oValue;
            }, this)
        }
    });
}

/**
 * sets a custom request http header
 * @param sHeader
 * @param sValue
 */
sap.ca.ui.FileUpload.prototype.setCustomHeader = function (sHeader, sValue) {
    if (this._oCustomHeaderArray === []) {
        this._oCusomHeaderArray.push({
            key: sHeader,
            value: sValue
        });
    } else {
        var nLength = this._oCustomHeaderArray.length;
        for (var i = 0; i < nLength; i++) {
            if (this._oCustomHeaderArray[i].key === sHeader) {
                this._oCustomHeaderArray[i].value = sValue;
                return;
            }
        }
        this._oCustomHeaderArray.push({
            key: sHeader,
            value: sValue
        });
    }
};
/**
 * removes a custom http request header
 * @param sHeader
 */
sap.ca.ui.FileUpload.prototype.removeCustomHeader = function (sHeader) {
    var nIndex = -1;
    for (var i = 0; i < this._oCustomHeaderArray.length; i++) {
        if (this._oCustomHeaderArray[i].key === sHeader) {
            nIndex = i;
        }
    }
    if (nIndex !== -1) {
        this._oCustomHeaderArray.splice(nIndex, 1);
    }
};
/**
 * commits file upload for the provided file descriptor
 * @param data
 */
sap.ca.ui.FileUpload.prototype.commitFileUpload = function (data) {
    var Formatter = sap.ca.ui.model.format.FileSizeFormat.getInstance();
    // Remove encodings of the format file%name - to file name
    var uploadedFileName = decodeURI(data[this.getFileName()]);
    //  format the size
    data.size = Formatter.format(data.size);
    var dataLength = this.getModel().getProperty(this.getItems() + "/").length;
    for (var i = 0; i < dataLength; i++) {

        // if the uploaded filename matches one in the local model, update the status
        // even if there are multiple files uploaded with the same name we can tolerate this
        // since we update all properties
        var path = this.getItems() + "/" + i;
        if (this.getModel().getProperty(path + "/" + this.getFileName()) === uploadedFileName &&
            this.getModel().getProperty(path + "/isUploading")) {
            if (this.getFileId() != undefined && this.getFileId() !== "") {
                this.getModel().setProperty(path + "/" + this.getFileId(),
                    data[this.getFileId()]);
            }
            if (this.getFileExtension() != undefined && this.getFileExtension() !== "") {
                this.getModel().setProperty(path + "/" + this.getFileExtension(),
                    data[this.getFileExtension()]);
            }
            if (this.getMimeType() != undefined && this.getMimeType() !== "") {
                this.getModel().setProperty(path + "/" + this.getMimeType(),
                    data[this.getMimeType()]);
            }
            if (this.getContributor() != undefined && this.getContributor() !== "") {
                this.getModel().setProperty(path + "/" + this.getContributor(),
                    data[this.getContributor()]);
            }
            if (this.getUploadedDate() != undefined && this.getUploadedDate() !== "") {
                this.getModel().setProperty(path + "/" + this.getUploadedDate(),
                    data[this.getUploadedDate()]);
            }
            if (this.getFileName() != undefined && this.getFileName() !== "") {
                this.getModel().setProperty(path + "/" + this.getFileName(),
                    data[this.getFileName()]);
            }
            if (this.getUrl() != undefined && this.getUrl() !== "") {
                this.getModel().setProperty(path + "/" + this.getUrl(),
                    data[this.getUrl()]);
            }
            if (this.getSize() != undefined && this.getSize() !== "") {
                this.getModel().setProperty(path + "/" + this.getSize(),
                    data[this.getSize()]);
            }
            this.getModel().setProperty(path + "/isHiddenFile", false);
            // we need to parse the file type from the filename.
            // split the filename into an array, the final index contains the file extension
            var sParsedFileExtension = uploadedFileName.split(".");
            // case to deal with a file that has no extension, return an empty string for the extension
            if (sParsedFileExtension.length === 1) {
                sParsedFileExtension = "";
                // If a[0] == "" and a.length == 2 it's a hidden file with no extension ie. .htaccess
            } else if (sParsedFileExtension[0] === "" && sParsedFileExtension.length === 2) {
                sParsedFileExtension = "";
                this.getModel().setProperty(path + "/isHiddenFile", true);
                // otherwise pop off everything at the front of the array, and we know have the file extension
            } else {
                sParsedFileExtension = "." + sParsedFileExtension.pop();
            }
            this.getModel().setProperty(path + "/parsedFileExtension", sParsedFileExtension);
            this.getModel().setProperty(path + "/isPending", false);
            this.getModel().setProperty(path + "/isUploading", false);
            this.getModel().setProperty(path + "/isUploaded", true);
            // no longer need the abort href
            this.getModel().setProperty(path + "/abortUpl", undefined);
            this.getModel().setProperty(this.getItems() + "/filesUploaded", this.getModel().getProperty(this.getItems() + "/filesUploaded") + 1);
            this._maintainUploadingProgress();
        }
    }
};
/**
 * Changes to filenames are set into the model as the new filename TODO: This is
 * not sufficent, we would also need to update the URLs for the renamed files
 */
sap.ca.ui.FileUpload.prototype.commitPendingRenames = function () {
    var listContext = this.getItems();
    var oItems = this.getModel().getProperty(listContext);
    for (var i = 0; i < oItems.length; i++) {
        // Checking that the file name changed
        if (oItems[i].newFilename !== undefined && oItems[i][this.getFileName()] !== oItems[i].newFilename) {
            var bFileHidden = oItems[i]["isHiddenFile"];
            var sNewFileName = "";
            if (oItems[i].isPendingFileRename) {
                // append the extension to the new fileName
                if (bFileHidden) {
                    sNewFileName = "." + oItems[i].newFilename;
                } else {
                    sNewFileName = oItems[i].newFilename + oItems[i]["parsedFileExtension"];
                }
            }
            else if (oItems[i].isFileNameSwapped) {
                if (bFileHidden) {
                    sNewFileName = "." + oItems[i][this.getFileName()];
                } else {
                    sNewFileName = oItems[i][this.getFileName()] + oItems[i]["parsedFileExtension"];
                }
            }
            this.getModel().setProperty(listContext + "/" + i + "/" + this.getFileName(), sNewFileName);
            this.getModel().setProperty(listContext + "/" + i + "/newFilename", undefined);
        }
        oItems[i].isPendingFileRename = false;
        this.getModel().setProperty(listContext + "/" + i + "/isPendingFileRename", false);
        oItems[i].isFileNameSwapped = false;
    }
};
/**
 * Changes to filename are set into the model as the new filename TODO: This is
 * not sufficent, we would also need to update the URLs for the renamed files
 *
 * @param sFileId id of the file
 */
sap.ca.ui.FileUpload.prototype.commitPendingRename = function (sFileId) {
    var listContext = this.getItems();
    var oItems = this.getModel().getProperty(listContext);
    for (var i = 0; i < oItems.length; i++) {
        // Checking the file id and that the file name changed
        if (oItems[i][this.getFileId()] == sFileId && oItems[i].newFilename !== undefined && oItems[i][this.getFileName()] !== oItems[i].newFilename) {
            var bFileHidden = oItems[i]["isHiddenFile"];
            var sNewFileName = "";
            if (oItems[i].isPendingFileRename) {
                // append the extension to the new fileName
                if (bFileHidden) {
                    sNewFileName = "." + oItems[i].newFilename;
                } else {
                    sNewFileName = oItems[i].newFilename + oItems[i]["parsedFileExtension"];
                }
            }
            else if (oItems[i].isFileNameSwapped) {
                if (bFileHidden) {
                    sNewFileName = "." + oItems[i][this.getFileName()];
                } else {
                    sNewFileName = oItems[i][this.getFileName()] + oItems[i]["parsedFileExtension"];
                }
            }
            this.getModel().setProperty(listContext + "/" + i + "/" + this.getFileName(), sNewFileName);
            this.getModel().setProperty(listContext + "/" + i + "/newFilename", undefined);
            oItems[i].isPendingFileRename = false;
            this.getModel().setProperty(listContext + "/" + i + "/isPendingFileRename", false);
            oItems[i].isFileNameSwapped = false;
            return;
            // We found the corresponding one and process it we're good. Bye bye
        }
    }
};
/**
 * Changes to filenames rolled back to the model versions
 */
sap.ca.ui.FileUpload.prototype.abandonPendingRenames = function () {
    var listContext = this.getItems();
    var oItems = this.getModel().getProperty(listContext);
    // refresh no longer enough
    for (var i = 0; i < oItems.length; i++) {
        if (oItems[i].isFileNameSwapped) {
            // swap back the items so they display correctly
            oItems[i][this.getFileName()] = oItems[i].newFilename;
        }
        // reset everything
        oItems[i].isPendingFileRename = false;
        this.getModel().setProperty(listContext + "/" + i + "/isPendingFileRename", false);
        oItems[i].isFileNameSwapped = false;
    }
};
/**
 * Changes to filename rolled back to the model versions
 *
 * @param sFileId id of the file
 */
sap.ca.ui.FileUpload.prototype.abandonPendingRename = function (sFileId) {
    var listContext = this.getItems();
    var oItems = this.getModel().getProperty(listContext);
    // refresh no longer enough
    for (var i = 0; i < oItems.length; i++) {
        if (oItems[i][this.getFileId()] == sFileId) {
            if (oItems[i].isFileNameSwapped) {
                // swap back the items so they display correctly
                oItems[i][this.getFileName()] = oItems[i].newFilename;
            }
            // reset everything
            oItems[i].isPendingFileRename = false;
            this.getModel().setProperty(listContext + "/" + i + "/isPendingFileRename", false);
            oItems[i].isFileNameSwapped = false;
            return;
            // We found the corresponding one and process it we're good. Bye bye
        }
    }
};
/**
 *  Abort the uploading of files. If file argument is supplied then only the specified file
 *  is aborted, otherwise all currently uploading files are aborted
 *
 *  @param file if provided we will only abort this file
 */
sap.ca.ui.FileUpload.prototype.abortUpload = function (file) {
    var aItems = this.getModel().getProperty(this.getItems());
    var aItemsUploaded = [];
    var filesToUpload = aItems.filesToUpload;
    if (file) {
        jQuery.each(aItems,
            jQuery.proxy(function (index, value) {
                if (value && value.isUploading && file.internalId === value[this.getFileId()]) {
                    value.abortUplXhr && value.abortUplXhr();
                    value.abortUpl && value.abortUpl();
                    filesToUpload--;
                } else if (value && (value.isUploaded || value.isUploading)) {
                    aItemsUploaded.push(value);
                }
            }, this));
    } else {
        jQuery.each(aItems,
            jQuery.proxy(function (index, value) {
                if (value && value.isUploading) {
                    value.abortUplXhr && value.abortUplXhr();
                    value.abortUpl && value.abortUpl();
                    filesToUpload--;
                } else if (value && value.isUploaded) {
                    // easiest way to remove files that aren't already uploaded is to exclude them
                    aItemsUploaded.push(value);
                }
            }, this));
    }
    this.getModel().setProperty(this.getItems(), aItemsUploaded);
    this.getModel().setProperty(this.getItems() + "/filesToUpload", filesToUpload);
    this.getModel().setProperty(this.getItems() + "/filesUploaded", aItems.filesUploaded);
    this.getModel().setProperty(this.getItems() + "/isEditEnabled", aItems.isEditEnabled);
    this._setIsUploading(aItems.isUploading);
    this._maintainUploadingProgress();
};
/**
 * Return true if uploading file
 */

sap.ca.ui.FileUpload.prototype.isUploading = function () {
    return this.getModel().getProperty(this.getItems() + "/isUploading");
};
//*******************SETTERS*****************
/**
 *
 * Uploade the data binding
 *
 * @param sDatePath path for the date binding
 * @param sContributorPath  path for the contributor name
 * @private
 */
sap.ca.ui.FileUpload.prototype._setUploadedDateBinding = function (sDatePath, sContributorPath) {
    if (sDatePath == null) {
        sDatePath = this.getUploadedDate();
    }
    if (sContributorPath == null) {
        sContributorPath = this.getContributor();
    }
    if (sDatePath == null || sContributorPath == null) {
        return;
    }
    var fnFormatter = function (sDate, sContributor) {
        if (sDate == null || sContributor == null) {
            return "";
        }
        var oDateFormat = sap.ca.ui.model.format.DateFormat.getDateInstance({style: 'medium'});
        var sDateFormatted = oDateFormat.format(sDate);
        if (this._isPhone()) {
            return this._oBundle.getText("FileUploader.attached_phone", [sDateFormatted, sContributor]);
        }
        else {
            return this._oBundle.getText("FileUploader.attached", [sDateFormatted, sContributor]);
        }
    };
    this._oUploadedDateLabel.bindProperty("text", {parts: [
        {path: sDatePath},
        {path: sContributorPath}
    ], formatter: jQuery.proxy(fnFormatter, this)});
};
/**
 * sets the items control property
 * @param oValue
 * @override
 */
sap.ca.ui.FileUpload.prototype.setItems = function (oValue) {
    var oldItems = this.getItems();
    if (oldItems !== oValue) {
        this._oFileNameLabel.bindProperty("visible", {parts: [
            {path: "isEditMode"},
            {path: "isUploading"}
        ], formatter: function (bEdit, bUpl) {
            return !bEdit || bUpl;
        }});
        this._oInputExtensionHL.bindProperty("visible", {parts: [
            {path: "isEditMode"},
            {path: "isUploading"}
        ], formatter: function (bEdit, bUpl) {
            return bEdit && !bUpl;
        }});
        this._oDateSizeHL.bindProperty("visible", {parts: [
            {path: "isEditMode"},
            {path: "isUploading"}
        ], formatter: function (bEdit, bUpl) {
            return !(bEdit && !bUpl);
        }});
        this._oFileNameEditBox.bindProperty("enabled", {parts: [
            {path: "isEditMode"},
            {path: "/isRenameEnabled"}
        ], formatter: function (bEdit, bRename) {
            return bEdit && bRename;
        }});
        this.setProperty("items", oValue);
    }
};
/**
 * sets the ShowAttachmentsLabelInEditMode control property
 * @param oValue
 * @override
 * @deprecated since 1.21.1
 */
sap.ca.ui.FileUpload.prototype.setShowAttachmentsLabelInEditMode = function (bValue) {
    this.setShowAttachmentsLabel(bValue);
    jQuery.sap.log.warning("ShowAttachmentsLabelInEditMode is deprecated.");
};
/**
 * sets the ShowAttachmentsLabel control property
 * @param oValue
 * @override
 */
sap.ca.ui.FileUpload.prototype.setShowAttachmentsLabel = function (bValue) {
    this.setProperty("showAttachmentsLabel", bValue);
    this._oNumberOfAttachmentsLabel.setVisible(bValue);
};
/**
 * sets the fileName control property
 * @param oValue
 * @override
 */
sap.ca.ui.FileUpload.prototype.setFileName = function (oValue) {
    var oldname = this.getFileName();
    if (oldname !== oValue) {
        this._oFileNameLabel.bindProperty("text", oValue);
        // dont write edits back to model unless saved
        this._oFileNameEditBox.bindValue(oValue, function (sValue) {
            var sOutput = (sValue && sValue.substr(0, sValue.lastIndexOf('.'))) || sValue;
            return sOutput;
        }, sap.ui.model.BindingMode.OneWay);
        this.setProperty("fileName", oValue);
    }
};
/**
 *  sets the editMode control property
 * @param oValue
 * @override
 * @deprecated since 1.21.1
 */
sap.ca.ui.FileUpload.prototype.setEditMode = function (oValue) {
    jQuery.sap.log.warning("EditMode property is deprecated");
};
/**
 * sets the useEditControls control property
 * @param oValue
 * @override
 */
sap.ca.ui.FileUpload.prototype.setUseEditControls = function (oValue) {
    this.setProperty("useEditControls", oValue);
    this.setRenameEnabled(oValue);
    this.setDeleteEnabled(oValue);
};
/**
 * sets the contributor control property
 * @param oValue
 * @override
 */
sap.ca.ui.FileUpload.prototype.setContributor = function (oValue) {
    var oldContributor = this.getContributor();
    if (oldContributor !== oValue) {
        this._setUploadedDateBinding(null, oValue);
        this.setProperty("contributor", oValue);
    }
};
/**
 * sets the uploadedDate control property
 * @param oValue
 * @override
 */
sap.ca.ui.FileUpload.prototype.setUploadedDate = function (oValue) {
    var olddate = this.getUploadedDate();
    if (olddate !== oValue) {
        this._setUploadedDateBinding(oValue, null);
        this.setProperty("uploadedDate", oValue);
    }
};
/**
 * sets the size control property
 * @param oValue
 * @override
 */
sap.ca.ui.FileUpload.prototype.setSize = function (oValue) {
    var size = this.getSize();
    if (size !== oValue) {
        this.setProperty("size", oValue);
    }
};
/**
 * sets the url control property
 * @param oValue
 * @override
 */
sap.ca.ui.FileUpload.prototype.setUrl = function (oValue) {
    var oldurl = this.getUrl();
    if (oldurl !== oValue) {
        this._oFileNameLabel.bindProperty("href", { path: oValue, formatter: this._removeStartingSlash });
        this.setProperty("url", oValue);
    }
};
/**
 * sets the uploadEnabled control property
 * @param oValue
 * @override
 */
sap.ca.ui.FileUpload.prototype.setUploadEnabled = function (oValue) {
    this._oAddButton.setVisible(oValue);
    this.setProperty("uploadEnabled", oValue);
};
/**
 * sets the deleteEnabled control property
 * @param oValue
 * @override
 */
sap.ca.ui.FileUpload.prototype.setDeleteEnabled = function (oValue) {
    var bEnabled = this.getUseEditControls() ? oValue : false;
    if (this.getModel()) {
        this.getModel().setProperty("/isDeleteEnabled", bEnabled);
    }
    this.setProperty("deleteEnabled", bEnabled);
};
/**
 * sets the uploadEnabled control property
 * @param oValue
 * @override
 */
sap.ca.ui.FileUpload.prototype.setRenameEnabled = function (oValue) {
    var bEnabled = this.getUseEditControls() ? oValue : false;
    if (this.getModel()) {
        this.getModel().setProperty("/isRenameEnabled", bEnabled);
    }
    this.setProperty("renameEnabled", bEnabled);
};
/**
 * sets the mimeType control property
 * @param oValue
 * @override
 */
sap.ca.ui.FileUpload.prototype.setMimeType = function (oValue) {
    var oldmimetype = this.getMimeType();
    if (oldmimetype !== oValue) {
        this._oItemIcon.bindProperty("src", { path: oValue,
            formatter: this._getIconFromMimeType });
        this.setProperty("mimeType", oValue);
    }
};
/**
 * sets the fileExtension control property
 * @param oValue
 * @override
 */
sap.ca.ui.FileUpload.prototype.setFileExtension = function (oValue) {
    var oldextension = this.getFileExtension();
    //only use fileExtension if mimeType hasn't been set as mimeType takes precedence
    if (oldextension !== oValue && !this.getProperty("mimeType")) {
        this._oItemIcon.bindProperty("src", { path: oValue,
            formatter: this._getIconFromExtension });
        this.setProperty("fileExtension", oValue);
    }
};
// GETTERS
/**
 * get label indicating the number of files uploaded
 * @override
 * @deprecated
 */
sap.ca.ui.FileUpload.prototype.getAttachmentNumberLabel = function () {
    jQuery.sap.log.warning("FileUpload getAttachmentNumberLabel is deprecated !");
    return this._oNumberOfAttachmentsLabel;
};
//****************PRIVATES****************************
/*
 * Find the extension of a file
 */
sap.ca.ui.FileUpload.prototype._findFileExtension = function (sFilename) {
    var oExtension = (/[.]/.exec(sFilename)) ? /[^.]+$/.exec(sFilename) : undefined;
    if (jQuery.isArray(oExtension))
        return oExtension[0];
    else
        return '';
};
/**
 * determines file mime type from the file extension.
 * this is by no means an exhaustive list of mime types but these are the most common ones
 * if a match is not found, the generic application/octet-stream is returned
 *
 * @param sExtension
 * @return {String}
 * @private
 */
sap.ca.ui.FileUpload.prototype._getMimeTypeFromExtension = function (sExtension) {
    switch (sExtension) {
        case 'pptx':
            return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        case 'ppt':
            return 'application/vnd.ms-powerpoint';
        case 'potx':
            return 'application/vnd.openxmlformats-officedocument.presentationml.template';
        case 'doc':
            return 'application/msword';
        case 'docx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'dotx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.template';
        case 'csv':
            return 'text/csv';
        case 'xls':
            return 'application/vnd.ms-excel';
        case 'xlsx':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        case 'xltx':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.template';
        case 'pdf':
            return 'application/pdf';
        case 'xhtml':
            return 'application/xhtml+xml';
        case 'zip':
            return 'application/zip';
        case 'gzip':
            return 'application/gzip';
        case 'avi':
            return 'video/avi';
        case 'mpeg':
            return 'video/mpeg';
        case 'mp4':
            return 'video/mp4';
        case 'html':
            return 'text/html';
        case 'txt':
            return 'text/plain';
        case 'xml':
            return 'text/xml';
        case 'gif':
            return 'image/gif';
        case 'jpg':
            return 'image/jpeg';
        case 'jpeg':
            return 'image/jpeg';
        case 'pjpeg':
            return 'image/pjpeg';
        case 'png':
            return 'image/png';
        case 'bmp':
            return 'image/bmp';
        case 'tif':
            return 'image/tiff';
        case 'tiff':
            return 'image/tiff';
        case 'mp3':
            return 'audio/mpeg3';
        case 'wmv':
            return 'audio/x-ms-wmv';
        default:
            return 'application/octet-stream';
    }
};
/**
 * determines file the icon from the file extension.
 * @param sVal
 * @return {String}
 * @private
 */
sap.ca.ui.FileUpload.prototype._getIconFromExtension = function (sVal) {
    if (sVal === "pdf") {
        return "sap-icon://pdf-attachment";
    }
    else if (sVal === "jpg" || sVal === "png" || sVal === "bmp") {
        return "sap-icon://attachment-photo";
    }
    else if (sVal === "txt") {
        return "sap-icon://document-text";
    }
    else if (sVal === "doc" || sVal === "docx" || sVal === "odt") {
        return "sap-icon://doc-attachment";
    }
    else if (sVal === "xls" || sVal === "csv") {
        return "sap-icon://excel-attachment";
    }
    else if (sVal === "ppt" || sVal === "pptx") {
        return "sap-icon://ppt-attachment";
    }
    else {
        return "sap-icon://document";
    }
};
/**
 * determines the icon from the mime type
 * @param sVal
 * @return {String}
 * @private
 */
sap.ca.ui.FileUpload.prototype._getIconFromMimeType = function (sVal) {
    var sIcon = "";
    if (!sVal) {
        return "sap-icon://document";
    }
    if (sVal.indexOf('image') === 0) {
        sIcon = "sap-icon://attachment-photo";
    } else if (sVal.indexOf('video') === 0) {
        sIcon = "sap-icon://attachment-video";
    } else if (sVal.indexOf('text') === 0) {
        sIcon = "sap-icon://attachment-text-file";
    } else if (sVal.indexOf('audio') === 0) {
        sIcon = "sap-icon://attachment-audio";
    } else if (sVal.indexOf('application') === 0) {
        switch (sVal) {
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            case 'application/vnd.ms-powerpoint':
            case 'application/vnd.openxmlformats-officedocument.presentationml.template':
                sIcon = "sap-icon://ppt-attachment";
                break;
            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
                sIcon = "sap-icon://doc-attachment";
                break;
            case 'application/vnd.ms-excel':
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.template':
                sIcon = "sap-icon://excel-attachment";
                break;
            case 'application/pdf':
                sIcon = "sap-icon://pdf-attachment";
                break;
            case 'application/xhtml+xml':
                sIcon = "sap-icon://attachment-html";
                break;
            case 'application/zip':
            case 'application/gzip':
                sIcon = "sap-icon://attachment-zip-file";
                break;
            default:
                sIcon = "sap-icon://document";
        }
    } else {
        sIcon = "sap-icon://document";
    }
    return sIcon;
};
/**
 * remove starting slash
 * @param sVal
 * @return {*}
 * @private
 */
sap.ca.ui.FileUpload.prototype._removeStartingSlash = function (sVal) {
    if (sVal && sVal.charAt(0) === '/') {
        return sVal.substr(1);
    }
    return sVal;
};
/**
 * maintains uploading progress label
 * @private
 */
sap.ca.ui.FileUpload.prototype._maintainUploadingProgress = function () {
    // reinitialise
    if (this.getModel().getProperty(this.getItems() + "/filesUploaded") > this.getModel().getProperty(this.getItems() + "/filesToUpload")) {
        this._setIsUploading(false);
        this.getModel().setProperty(this.getItems() + "/filesToUpload", 0);
        this.getModel().setProperty(this.getItems() + "/filesUploaded", 1);
    }
};
/*
 * Remove the files that are not uploded from the model
 */
sap.ca.ui.FileUpload.prototype._cancelPendingUpload = function (fileId) {
    var aItems = this.getModel().getProperty(this.getItems());
    var iFilesToUpload = this.getModel().getProperty(this.getItems() + "/filesToUpload") - 1;
    var aItemsUploaded = [];
    //Create array with the file uploaded completely in the server
    jQuery.each(aItems,
        jQuery.proxy(function (index, value) {
            if (value && (value[this.getFileId()] !== fileId)) {
                aItemsUploaded.push(value);
            }
        }, this)
    );
    this.getModel().setProperty(this.getItems(), aItemsUploaded);
    //Copy old values to the regenerated model
    this.getModel().setProperty(this.getItems() + "/filesToUpload", iFilesToUpload);
    this.getModel().setProperty(this.getItems() + "/filesUploaded", aItems.filesUploaded);
    this._setIsUploading(iFilesToUpload > 0);
    this.getModel().setProperty(this.getItems() + "/isEditEnabled", aItems.isEditEnabled);
    this._maintainUploadingProgress();
};
/**
 * determines if device is phone
 * @return {*}
 * @private
 */
sap.ca.ui.FileUpload.prototype._isPhone = function () {
    return jQuery.device.is.phone;
};
/**
 * determines if browser is IE9
 * @return {*}
 * @private
 */
sap.ca.ui.FileUpload.prototype._isIE9OrBelow = function () {
    return (sap.ui.Device.browser.name === sap.ui.Device.browser.BROWSER.INTERNET_EXPLORER) && (sap.ui.Device.browser.version < 10);
};
/**
 * determines if browser is IE
 * @return {*}
 * @private
 */
sap.ca.ui.FileUpload.prototype._isIE = function () {
    return (sap.ui.Device.browser.name === sap.ui.Device.browser.BROWSER.INTERNET_EXPLORER);
};
/**
 * set common request headers
 */
sap.ca.ui.FileUpload.prototype._setRequestHeaders = function (xhr) {
    if (this.getAcceptRequestHeader()) {
        xhr.setRequestHeader("Accept", this.getAcceptRequestHeader());
    }
    if (this.getXsrfToken()) {
        xhr.setRequestHeader('x-csrf-token', this.getXsrfToken());
    }
    // set custom headers
    for (var i = 0; i < this._oCustomHeaderArray.length; i++) {
        xhr.setRequestHeader(this._oCustomHeaderArray[i].key, this._oCustomHeaderArray[i].value);
    }
};
/**
 * Listening to the list after rendering to add the mousedown listener on edit button
 * @private
 */
sap.ca.ui.FileUpload.prototype._onListAfterRendering = function () {
    jQuery("span[id*='-editIcon-']").mousedown(jQuery.proxy(function (jQueryEvent) {
        var sId = jQuery(jQueryEvent.currentTarget).attr("id");
        if (sId) {
            var oIcon = sap.ui.getCore().byId(sId);
            if (oIcon) {
                // We are setting the path that is corresponding to this edit btn for future reference
                this._editBtnPressedPath = oIcon.oPropagatedProperties.oBindingContexts[undefined].sPath;
            }
        }
    }, this));
};
/**
 *
 * @param {object} oLineItem, the item to cancel the upload
 * @private
 */
sap.ca.ui.FileUpload.prototype._handleCancel = function (oLineItem) {
    var sPath = oLineItem.getBindingContext().getPath();
    // remove the current item and stop uploading
    var fnAbortXhr = oLineItem.getModel().getProperty(sPath + "/abortUplXhr");
    var fnAbort = oLineItem.getModel().getProperty(sPath + "/abortUpl");
    fnAbortXhr && fnAbortXhr();
    fnAbort && fnAbort();
    var aTokens = sPath.split('/');
    var nInd = aTokens[aTokens.length - 1];
    var oItems = oLineItem.getModel().getProperty(this.getItems());
    oItems.splice(nInd, 1);
    oLineItem.getModel().setProperty(this.getItems(), oItems);
    oLineItem.getModel().setProperty(this.getItems() + "/filesToUpload", oLineItem.getModel().getProperty(this.getItems() + "/filesToUpload") - 1);
    this._maintainUploadingProgress();
};
/**
 * handle delete event
 * @param event
 * @private
 */
sap.ca.ui.FileUpload.prototype._handleDelete = function (event) {
    var oLineItem = event.getParameter("listItem");
    var fileToDelete = oLineItem.getBindingContext().getProperty();
    var sPath = oLineItem.getBindingContext().getPath();
    var bIsUploading = oLineItem.getModel().getProperty(sPath + "/isUploading");
    if (!bIsUploading) {
        sap.ca.ui.dialog.confirmation.open({
            question: this._sDeleteQuestion,
            showNote: false,
            title: this._sDeleteFile,
            confirmButtonLabel: this._sContinue
        }, jQuery.proxy(function (oData) {
            if (oData.isConfirmed) {
                this.fireDeleteFile(fileToDelete);
            }
        }, this));
    }
    else {
        this._handleCancel(oLineItem);
    }
};
/**
 * handle edit event
 * @param {sap.ui.base.Event} e the edit event
 * @private
 */
sap.ca.ui.FileUpload.prototype._handleEdit = function (e) {
    var sPath = e.getSource().oPropagatedProperties.oBindingContexts[undefined].getPath();
    var bIsInEditMode = this.getModel().getProperty(sPath + "/isEditMode");
    // If already editing we revert back to read mode on iOS because we don't handle focus out
    if (!bIsInEditMode) {
        this.getModel().setProperty(sPath + "/isEditMode", true);
        var oLineItem = e.getSource().getParent();
        if (oLineItem && oLineItem.getContent() && (oLineItem.getContent().length >= 3)) {
            var oInnerLayout = oLineItem.getContent()[2];
            if (oInnerLayout && oInnerLayout.getContent() && (oInnerLayout.getContent().length >= 2)) {
                var oInputExtensionHL = oInnerLayout.getContent()[1];
                if (oInputExtensionHL && oInputExtensionHL.getItems() && (oInputExtensionHL.getItems().length >= 1)) {
                    var oInput = oInputExtensionHL.getItems()[0];
                    if (oInput) {
                        jQuery.sap.delayedCall(300, this, this._focusEdit, [oLineItem, oInput]);
                    }
                }
            }
        }
    }
};
/**
 * handle edit event
 * @param {sap.ui.base.Event} e the edit event
 * @private
 */
sap.ca.ui.FileUpload.prototype._handleSave = function (e) {
    this._nameChanged(e);
};
/**
 * handle edit event
 * @param oLineItem the line item control
 * @private
 */
sap.ca.ui.FileUpload.prototype._focusEdit = function (oLineItem, oInput) {
    if (!jQuery.os.iOS) {
        // On iOS focusing is causing issue so we don't handle it
        var $input = oInput.$();
        oInput.focus();
        // We only listen to the event once because we re add the listener each time we edit
        $input.one("focusout blur", jQuery.proxy(function () {
            this._revertToReadState(oLineItem.getBindingContext().getPath(), oInput);
        }, this));
    }
};
/**
 * handle name change event
 * @param {sap.ui.base.Event} event the change event
 * @private
 */
sap.ca.ui.FileUpload.prototype._nameChanged = function (event) {
    var fileToRename = event.getSource().getBindingContext().getProperty();
    fileToRename.newFilename = event.getSource().getValue();
    var sPath = event.getSource().getBindingContext().getPath();
    // save new name in case of rollback
    this.getModel().setProperty(sPath + "/newFilename", fileToRename.newFilename);
    // file has been renamed, set the state to pending
    this.getModel().setProperty(sPath + "/isPendingFileRename", true);
    this.fireRenameFile(fileToRename);
    this._revertToReadState(sPath, null);
    // To maintain backward compatibility we will fire the cancel event
    this.fireSaveClicked();
};
/**
 * Revert to read state
 * @param {string} sPath of the item
 * @param {object} oInput Input control of the line
 * @private
 */
sap.ca.ui.FileUpload.prototype._revertToReadState = function (sPath, oInput) {
    var bIsInEditMode = this.getModel().getProperty(sPath + "/isEditMode");
    if (bIsInEditMode) {
        // We cancel only if we have an input (so we are called from focus out)
        if (oInput != null) {
            var sExtension = this.getModel().getProperty(sPath + "/parsedFileExtension");
            var sNewFileName = oInput.getValue() + sExtension;
            var sFileName = this.getModel().getProperty(sPath + "/" + this.getFileName());
            if (sNewFileName == sFileName) {
                // To maintain backward compatibility we will fire the cancel event
                this.fireCancelClicked();
            } else {
                this._nameChanged(new sap.ui.base.Event("", oInput));
            }
        }
        this.getModel().setProperty(sPath + "/isEditMode", false);
    }
};
/**
 * Find the index of the file in the data model by its internal Id
 * @param internalId  the internal id
 * @returns {number} the index of the file
 * @private
 */
sap.ca.ui.FileUpload.prototype._findFileIndexByInternalId = function (internalId) {
    var aItems = this.getModel().getProperty(this.getItems());
    for (var i = 0; i < aItems.length; i++) {
        if (aItems[i][this.getFileId()] === internalId)
            return i;
    }
    return -1;
};
//************jQuery FileUpload event handlers *****************
/**
 * handle jQuery FileUpload sending event
 * @param e
 * @param data
 */
sap.ca.ui.FileUpload.prototype.sending = function (e, data) {
    for (var j = 0; j < data.files.length; j++) {
        var oDataItems = data.files[j];
        var sfileInternalId = oDataItems.internalId;
        // search through the current list of items we have
        var nDataLength = this.getModel().getProperty(this.getItems()).length;
        for (var i = 0; i < nDataLength; i++) {
            // if the uploaded fileId matches one in the local model, update the status
            var sPath = this.getItems() + "/" + i;
            if (this.getModel().getProperty(sPath)[this.getFileId()] === sfileInternalId &&
                this.getModel().getProperty(sPath).isPending) {
                this.getModel().setProperty(sPath + "/isUploading", true);
                this.getModel().setProperty(sPath + "/isPending", false);
                this.getModel().setProperty(sPath + "/isUploaded", false);
            }
        }
    }
};
sap.ca.ui.FileUpload.prototype._setIsUploading = function (bIsUploading) {
    this.getModel().setProperty(this.getItems() + "/isUploading", bIsUploading);
    this.toggleStyleClass("sapCaUiFUIsUploading", bIsUploading);
};
/**
 * handle jQuery FileUpload onAdd event
 * @param e
 * @param data
 */
sap.ca.ui.FileUpload.prototype.onAdd = function (e, data) {
    var Formatter = sap.ca.ui.model.format.FileSizeFormat.getInstance();
    // add the file items into the model on adding
    for (var j = 0; j < data.files.length; j++) {
        var file = data.files[0];
        var internalId = Math.random().toString();
        data.files[0].internalId = internalId;
        var oItems = this.getModel().getProperty(this.getItems());
        var oNewItem = {};
        oNewItem[this.getFileId()] = internalId;
        oNewItem[this.getFileName()] = file.name;
        oNewItem[this.getSize()] = Formatter.format(file.size);
        oNewItem["isPending"] = false;
        oNewItem["isUploading"] = true;
        oNewItem["isUploaded"] = false;
        oNewItem["uploadPercent"] = 0;
        oNewItem["isDeleteVisible"] = false;
        oNewItem["isPendingFileRename"] = false;
        oNewItem["isFileNameSwapped"] = false;
        oNewItem["isEditMode"] = false;
        oItems.unshift(oNewItem);
        this.getModel().setProperty(this.getItems(), oItems);
        // store ref to abort
        this.getModel().setProperty(this.getItems() + "/0/abortUpl", jQuery.proxy(data.abort, data));
        // add a pending item
        this.getModel().setProperty(this.getItems() + "/filesToUpload", this.getModel().getProperty(this.getItems() + "/filesToUpload") + 1);
        this.getModel().setProperty(this.getItems() + "/isUploading", true);
        var _oCancelUpload = data.submit();
    }
    var dataLength = this.getModel().getProperty(this.getItems() + "/").length;
    // when a new file is added we may need to update the models so that renamed files don't change
    for (var i = 0; i < dataLength; i++) {
        var path = this.getItems() + "/" + i;
        // check if a file has a pending rename, we need to set the filename to be the rename file
        // and the backup file to be the original name...this is to allow a names to appear renamed on a model refresh
        // if files are already swapped don't swap them again
        if (this.getModel().getProperty(path + "/isPendingFileRename")) {
            var sTemp = this.getModel().getProperty(path + "/" + this.getFileName());
            var sNewFileName = this.getModel().getProperty(path + "/newFilename");
            // set the filename to the rename
            this.getModel().setProperty(path + "/" + this.getFileName(),
                sNewFileName);
            // set the rename to the old file name
            this.getModel().setProperty(path + "/newFilename",
                sTemp);
            // set state of file to swapped
            this.getModel().setProperty(path + "/isFileNameSwapped", true);
            // if another file is uploaded, don't want to reswap files so set pending to false
            this.getModel().setProperty(path + "/isPendingFileRename", false);
        }
    }
};
/**
 * calculate file upload progress
 * @param e
 * @param data
 */
sap.ca.ui.FileUpload.prototype.calculateProgress = function (e, data) {
    // search through the current list of items we have
    var dataLength = this.getModel().getProperty(this.getItems()).length;
    for (var i = 0; i < dataLength; i++) {
        // search for the file with the uploading state.
        var progress = parseInt(data.loaded / data.total * 100, 10);
        var path = this.getItems() + "/" + i;
        var property = this.getModel().getProperty(path);
        // always one event per file, no need to iterate over the array
        if (property.isUploading &&
            property[this.getFileId()] === data.files[0].internalId) {
            this.getModel().setProperty(path + "/uploadPercent", progress);
            this.getModel().setProperty(path + "/isUploaded", false);
        }
    }
};
/*
 * Handles the jQuery FileUpload failures event
 */
sap.ca.ui.FileUpload.prototype.handleUploadFailure = function (oEvt, data) {
    if (data.textStatus !== "abort" && data.textStatus !== "canceled") {
        this._cancelPendingUpload(data.files[0].internalId);
        this.fireFileUploadFailed({
            exception: new Error(this._oBundle.getText("FileUploader.error.fileUploadFail")),
            response: data
        });
    }
};
/**
 * handle the jQuery FileUpload uploadDone event
 *
 * @param e
 * @param data
 */
sap.ca.ui.FileUpload.prototype.uploadDone = function (e, data) {
    try {
        //make sure file exists in list before going ahead with uploadDone.
        var iFileIndex = this._findFileIndexByInternalId(data.files[0].internalId);
        if (iFileIndex === -1)
            return;
        //for IE9 or below, we need to build a second request and send the base64 encoded string to server
        if (this._isIE9OrBelow()) {
            // the response is inside <html><body><pre> when using the iFrame
            var sEncodedFile;
            // check that we have a result object
            if (this.getUseMultipart()) {
                sEncodedFile = jQuery('pre', data.result).text();
                var json = jQuery.parseJSON(sEncodedFile);
                this.fireUploadFile(json);
            } else {
                if (null !== data && null !== data.result) {
                    var sFilename = data.files[0].name;
                    var oSelectedFile = data.files[0];
                    sEncodedFile = jQuery('pre', data.result).text();
                    var oJson;
                    //handle error
                    try {
                        oJson = jQuery.parseJSON(sEncodedFile);
                    } catch (e) {
                    } //not parsable, ignore}
                    if (oJson && oJson.error && oJson.error.code && oJson.error.code === '413') {
                        throw new Error(this._oBundle.getText("FileUploader.error.fileUploadFail"));
                    }
                    var sMimeType;
                    //check if mimetype can be parsed
                    try {
                        sMimeType = sEncodedFile.match(/^data\:(.*);base64,/)[1];
                    } catch (e) {
                        throw new Error(this._oBundle.getText("FileUploader.error.fileUploadFail"));
                    }
                    sEncodedFile = sEncodedFile.replace(/^data\:(.*);base64,/, '');
                    if (null !== sEncodedFile) {

                        //POST encoded file
                        //create the data object expected by jquery
                        var oXhr = jQuery.ajax({
                            contentType: sMimeType,
                            data: sEncodedFile,
                            type: "POST",
                            url: this.getUploadUrl(),
                            success: jQuery.proxy(function (data, status) {
                                var oData = data.d ? data.d : data;
                                this.fireUploadFile(oData);
                            }, this),
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                if (textStatus !== 'abort') //on forced abort request from app do not show error
                                    throw new Error(this._oBundle.getText("FileUploader.error.fileUploadFail") + " " + errorThrown);
                            },
                            beforeSend: jQuery.proxy(function (xhr, data) {
                                //allow consumer to handle before file upload in case they want to set custom headers based on file info
                                this.getModel().setProperty(this.getItems() + "/" + iFileIndex + "/abortUplXhr", jQuery.proxy(xhr.abort, xhr));
                                this.fireBeforeUploadFile(oSelectedFile);
                                this._setRequestHeaders(xhr);
                                xhr.setRequestHeader("Content-Transfer-Encoding", 'Base64');
                                xhr.setRequestHeader("Content-Disposition", 'attachment; filename="' + sFilename + '"');
                            }, this)
                        });
                    }
                    // it could be a HTML page returned (error case) - session timeout, not logged on
                    else if (null !== data.result[0] && null !== data.result[0].title) {
                        throw new Error(this._oBundle.getText("FileUploader.error.base64Error") + ": " + data.result[0].title);
                    } else {
                        throw new Error(this._oBundle.getText("FileUploader.error.base64Error"));
                    }
                }
            }
        }
        else if (data && data.result) {
            //fire uploadFile event for consumer to handle
            this.fireUploadFile(data.result);
        } else {
            throw new Error(this._oBundle.getText("FileUploader.error.invalidResponse"));
        }
    }
    catch (err) {
        // provide information on event so that custom error message can be used
        this._cancelPendingUpload(data.files[0].internalId);
        this.fireFileUploadFailed({
            exception: err,
            response: data
        });
    }
};
//*************** control native events *******************
/**
 * handle touchstart to give highlight effect for upload button where the <input> overlaps with button
 *
 * @param oEvent the touch event
 */
sap.ca.ui.FileUpload.prototype.ontouchstart = function (oEvent) {
    if (jQuery.os.ios && oEvent.target.id === this.getId() + "-upload") {
        this._oAddButton._activeButton();
    }
};
/**
 * handle touchend to give highlight effect for upload button where the <input> overlaps with button
 * @param oEvent the touch event
 */
sap.ca.ui.FileUpload.prototype.ontouchend = function (oEvent) {
    if (jQuery.os.ios) {
        this._oAddButton._inactiveButton();
    }
};
/**
 * handle touchcancel to give highlight effect for upload button where the <input> overlaps with button
 * @param oEvent the touch event
 */
sap.ca.ui.FileUpload.prototype.ontouchcancel = function (oEvent) {
    if (jQuery.os.ios) {
        this._oAddButton._inactiveButton();
    }
};
/**
 * Function is called when tap occurs on button.
 * @param oEvent the touch event
 *
 */
sap.ca.ui.FileUpload.prototype.ontap = function (oEvent) {
    if (jQuery.os.ios && oEvent.target.id === this.getId() + "-upload") {
        this._oAddButton.fireTap();
    }
};
