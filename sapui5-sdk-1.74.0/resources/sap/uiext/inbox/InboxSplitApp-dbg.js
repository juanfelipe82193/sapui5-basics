/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides control sap.uiext.inbox.InboxSplitApp.
jQuery.sap.declare("sap.uiext.inbox.InboxSplitApp");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new InboxSplitApp.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Inbox Split App
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @experimental Since version 1.7.0. 
 * API is not yet finished and might change completely
 * @name sap.uiext.inbox.InboxSplitApp
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.InboxSplitApp", /** @lends sap.uiext.inbox.InboxSplitApp.prototype */ { metadata : {

	deprecated : true,
	library : "sap.uiext.inbox",
	properties : {

		/**
		 * Show/Hide the Navigation Button for the Master Page
		 */
		showMasterPageNavBtn : {type : "boolean", group : "Appearance", defaultValue : null},

		/**
		 * TCM service URL
		 */
		tcmServiceURL : {type : "string", defaultValue : null},

		/**
		 * Filters to be applied on the data shown in the MasterPage
		 */
		filters : {type : "object[]", group : "Misc", defaultValue : null},

		/**
		 * TCM Configuration object for control initialization.
		 */
		tcmConfiguration : {type : "object", group : "Misc", defaultValue : null}
	},
	aggregations : {

		/**
		 * This is the splitApp that is created inside the control
		 */
		splitAppl : {type : "sap.m.SplitApp", multiple : false}
	},
	events : {

		/**
		 * Navigation Button of the Master Page is pressed, if visible.
		 */
		navButtonPressed : {}
	}
}});

 jQuery.sap.require("sap.uiext.inbox.splitapp.MasterPage");
 jQuery.sap.require("sap.uiext.inbox.splitapp.DetailViewPage");
 /*global OData */// declare unusual global vars for JSLint/SAPUI5 validation
sap.uiext.inbox.InboxSplitApp.prototype.init = function() {
	this.oCore = sap.ui.getCore();
	
	this.bPhoneDevice = jQuery.device.is.phone;

	this.setAggregation("splitAppl", new sap.m.SplitApp({mode: this.bPhoneDevice ? sap.m.SplitAppMode.HideMode : sap.m.SplitAppMode.StretchCompressMode}));
	this.oSplitApp = this.getAggregation("splitAppl");
	
    this.oInboxMasterPage = new sap.uiext.inbox.splitapp.MasterPage(this.getId() + "-mp");
	this.oSplitApp.addMasterPage(this.oInboxMasterPage.getPage());
	
	this.oInboxDetailPage = new sap.uiext.inbox.splitapp.DetailViewPage(this.getId() + "-dp");
	this.oSplitApp.addDetailPage(this.oInboxDetailPage.getPage());
	
	var fnHandleListSelect = jQuery.proxy(this._handleListSelect, this);
	this.oCore.getEventBus().subscribe('sap.uiext.inbox', "masterPageListSelected", fnHandleListSelect);
	
	var fnNavButtonTapHandler = jQuery.proxy(this._handleNavButtonTapped, this);
	this.oCore.getEventBus().subscribe('sap.uiext.inbox', "masterPageNavButtonTapped", fnNavButtonTapHandler);
	
	var fnNavButtonPressDetailPageHandler = jQuery.proxy(this._handleNavButtonPressDetailPage, this);
	this.oCore.getEventBus().subscribe('sap.uiext.inbox', "detailPageNavButtonTapped", fnNavButtonPressDetailPageHandler);
	
	var fnTaskTitleHandler = jQuery.proxy(this._handleOpenTaskExecutionUI, this);
	this.oCore.getEventBus().subscribe('sap.uiext.inbox', "detailPageTaskTitleSelected", fnTaskTitleHandler);
	
	var fnHandleTaskActionCompleted = jQuery.proxy(this._handleTaskActionCompleted, this);
	this.oCore.getEventBus().subscribe('sap.uiext.inbox', "taskActionCompleted",fnHandleTaskActionCompleted);
};

sap.uiext.inbox.InboxSplitApp.prototype.setTcmServiceURL = function(sValue){
    this.setProperty("tcmServiceURL", sValue, true);
    
    var oTCMModel = new sap.ui.model.odata.ODataModel(sValue,true);
	oTCMModel.setCountSupported(false);
	this.setModel(oTCMModel,"inboxTCMModel");
	
    this.oInboxDetailPage._setTcmServiceURL(sValue);
    this.oInboxMasterPage._setTcmServiceURL(sValue);
    return this;
};


sap.uiext.inbox.InboxSplitApp.prototype.setTcmConfiguration = function(oTCMConfiguration){
	this.setProperty("tcmConfiguration", oTCMConfiguration, true);
	var oTcmConfiguration = this.getProperty("tcmConfiguration");
	
	this.oInboxDetailPage._setTcmConfiguration(oTcmConfiguration);
	return this;
};

sap.uiext.inbox.InboxSplitApp.prototype.setShowMasterPageNavBtn = function(bValue){
    this.setProperty("showMasterPageNavBtn", bValue, true);
    this.oInboxMasterPage.setShowNavButton(bValue);
    return this;
};

sap.uiext.inbox.InboxSplitApp.prototype._handleNavButtonTapped = function(sChannel, sEvent, oParams){
    this.fireNavButtonPressed();
};

sap.uiext.inbox.InboxSplitApp.prototype._handleNavButtonPressDetailPage = function (sChannel, sEvent) {
	this.oSplitApp.toMaster(this.oInboxMasterPage.getPage().getId());
}

/**
 * Call this method to display data in the InboxSplitApp
 *
 * @param {object[]} aFilters
 * @type sap.uiext.inbox.InboxSplitApp
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */
sap.uiext.inbox.InboxSplitApp.prototype.bindTasks = function(aFilters) {
	this.oInboxMasterPage.bindService(aFilters);
	return this;
};

/**
 * Call this method to reset the search criteria.
 *
 * @type sap.uiext.inbox.InboxSplitApp
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */
sap.uiext.inbox.InboxSplitApp.prototype.resetSearchCriteria = function() {
	if (this.oInboxMasterPage) {
		this.oInboxMasterPage.resetSearchCriteria();
	}
	return this;
};

sap.uiext.inbox.InboxSplitApp.prototype._handleOpenTaskExecutionUI = function( sChannel, sEvent, oTaskSelection) {
    if(!this.oTaskExecutionUIPageObj){
    	this._createTaskExecutionUIPage();
    }
    this.oTaskExecutionUIPageObj.getPage().setBindingContext(oTaskSelection.context);
    this.oTaskExecutionUIPageObj.open();
    if (jQuery.device.is.phone){
    	this.oSplitApp.to(this.oTaskExecutionUIPageObj.getPage().getId());
    }
};

sap.uiext.inbox.InboxSplitApp.prototype._createTaskExecutionUIPage = function() {
	jQuery.sap.require("sap.uiext.inbox.splitapp.TaskExecutionUIPage");
	
	this.oTaskExecutionUIPageObj = new sap.uiext.inbox.splitapp.TaskExecutionUIPage(this.getId() + "-exUi");  
	
	this.oSplitApp.addPage(this.oTaskExecutionUIPageObj.getPage());
	
	var fnCloseTaskExecUI = jQuery.proxy(this._handleTaskExecUIPageNavButtonPressed, this);
	this.oCore.getEventBus().subscribe('sap.uiext.inbox', "taskExecUIPageNavButtonPressed", fnCloseTaskExecUI);

};

sap.uiext.inbox.InboxSplitApp.prototype._handleTaskExecUIPageNavButtonPressed = function( sChannel, sEvent, oParams) {
	this.oSplitApp.backToTopDetail(); 
	this.oInboxMasterPage._refreshTasks(null, this.oInboxMasterPage);
	this.oInboxDetailPage.renderDetailsPage();
};

sap.uiext.inbox.InboxSplitApp.prototype._handleListSelect = function( sChannel, sEvent, oListSelected) {
	this.oInboxDetailPage.getPage().setBindingContext(oListSelected.context);
	if (this.bPhoneDevice) {
		this.oSplitApp.toDetail(this.oInboxDetailPage.getPage().getId());
	}
	if(this.oInboxDetailPage.getPage().getId() == this.oSplitApp.getCurrentPage().getId()){
		this.oInboxDetailPage.renderDetailsPage(oListSelected.onUpdate);
		/*if (this.oInboxDetailPage.isCommentsSupported === true){

			this.oInboxDetailPage._displayCommentsIfCommentsSelectedinIconBar();

		}*/
	}else{
		this._handleOpenTaskExecutionUI(null, null, oListSelected);
	}
};

sap.uiext.inbox.InboxSplitApp.prototype._handleTaskActionCompleted = function( sChannel, sEvent, oTaskData) {
	if (!this.bPhoneDevice) {
		this.oInboxMasterPage.rerenderTask(oTaskData.taskData);
	}else{
		this.oInboxDetailPage.updateTaskDataInModel(oTaskData.taskData);
		if(oTaskData.taskData.Status != "COMPLETED") {
			this.oInboxDetailPage.renderDetailsPage();
		}else {
			this.oSplitApp.toMaster(this.oInboxMasterPage.getPage().getId());
		}
	}	
};

