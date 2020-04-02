/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// Provides control sap.uiext.inbox.InboxLaunchPad.
jQuery.sap.declare("sap.uiext.inbox.InboxLaunchPad");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new InboxLaunchPad.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * InboxLaunchPad Documentation to be updated later
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @experimental Since version 1.7.0. 
 * API is not yet finished and might change completely
 * @name sap.uiext.inbox.InboxLaunchPad
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.uiext.inbox.InboxLaunchPad", /** @lends sap.uiext.inbox.InboxLaunchPad.prototype */ { metadata : {

	deprecated : true,
	library : "sap.uiext.inbox",
	properties : {

		/**
		 * The title text appearing in Inbox LaunchPad header bar.
		 */
		title : {type : "string", defaultValue : 'Inbox Launch Pad Title'},

		/**
		 * Path (src) to the logo icon to be displayed in the Inbox LaunchPad header.
		 */
		logoSrc : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Property to indicate whether the Logoff button in the header should be displayed or not. Default value is true.
		 */
		showLogoutButton : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * Property to indicate whether loggod on User's Name in the header should be displayed or not. Default value is true.
		 */
		showUserName : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * User name to be shown in the header.
		 */
		userName : {type : "string", group : "Misc", defaultValue : null}
	},
	aggregations : {

		/**
		 * Hidden aggregation to contain the Inbox LaunchPad header.
		 */
		launchPadHeader : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}, 

		/**
		 * Hidden aggregation to contain the Inbox LaunchPad tile container.
		 */
		launchPadTileContainer : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}
	},
	events : {

		/**
		 * Fires an event when a tile is selected in Inbox LaunchPad.
		 */
		tileSelected : {}, 

		/**
		 * Fired when the user clicks the "Log-off" button.
		 */
		logout : {}
	}
}});

/*global OData */// declare unusual global vars for JSLint/SAPUI5 validation
jQuery.sap.require("sap.ui.core.IconPool");
jQuery.sap.require("sap.uiext.inbox.InboxTile");

sap.uiext.inbox.InboxLaunchPad.prototype.init = function() {
	var that = this;
	this.oCore = sap.ui.getCore();
	this._oBundle = this.oCore.getLibraryResourceBundle("sap.uiext.inbox");
	this.setAggregation("launchPadHeader", new sap.m.Bar("mbar", {
		contentMiddle : [ new sap.m.Label({
			text : this.getTitle()
		}) ],
		contentRight : [ new sap.m.Button({
			icon : sap.ui.core.IconPool.getIconURI("person-placeholder"),
			tooltip : this.getUserName(),
			type : sap.m.ButtonType.Transparent 
		}),new sap.m.Button({
			tooltip : that._oBundle.getText("INBOX_LP_LOGOFF_TOOLTIP"),
			icon : sap.ui.core.IconPool.getIconURI("log"),
			type : sap.m.ButtonType.Default
		}).attachPress(function() {
			that.fireLogout();
		})],
		contentLeft : [ new sap.m.Image({
			src : this.getLogoSrc()
		}).addStyleClass("logo") ]})
	);
	var tileTemplate = new sap.uiext.inbox.InboxTile({
		icon : "sap-icon://task",
		title : "{name}",
		number : "{numberOfTasks}"
	}).data("defID", "{defID}").attachPress(function(oEvent) {
		that.fireTileSelected({
			"defID" : this.data("defID")
		});
	});

	this.setAggregation("launchPadTileContainer", new sap.m.TileContainer({
		editable : false,
		allowAdd : false,
		tiles : {
			path : "/Tasks",
			template : tileTemplate
		}
	}));
};

sap.uiext.inbox.InboxLaunchPad.prototype.setTitle = function(sTitle) {
	this.setProperty("title", sTitle, true);
	this.getAggregation("launchPadHeader").destroyContentMiddle()
			.addContentMiddle(new sap.m.Label({
				text : this.getTitle()
			}));
	return this;
};

sap.uiext.inbox.InboxLaunchPad.prototype.setUserName = function(sUserName) {
	if (sUserName !== undefined) {
		this.getAggregation("launchPadHeader").getContentRight()[0].setTooltip(sUserName);
	}
	return this;
};

sap.uiext.inbox.InboxLaunchPad.prototype.setShowUserName = function(bShow) {
	if (bShow === true) {
		this.getAggregation("launchPadHeader").getContentRight()[0]
				.setVisible(true);
	} else {
		this.getAggregation("launchPadHeader").getContentRight()[0]
				.setVisible(false);
	}
	return this;
};

sap.uiext.inbox.InboxLaunchPad.prototype.setShowLogoutButton = function(bShow) {
	if (bShow === true) {
		this.getAggregation("launchPadHeader").getContentRight()[1]
				.setVisible(true);
	} else {
		this.getAggregation("launchPadHeader").getContentRight()[1]
				.setVisible(false);
	}
	return this;
};

sap.uiext.inbox.InboxLaunchPad.prototype.setLogoSrc = function(sLogoSrc) {
	this.setProperty("logoSrc", sLogoSrc, true);
	this.getAggregation("launchPadHeader").destroyContentLeft().addContentLeft(
			new sap.m.Image({
				src : this.getLogoSrc()
			}).addStyleClass("logo"));
	return this;
};
