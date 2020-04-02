/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.OverviewTile.
jQuery.sap.declare("sap.ca.ui.OverviewTile");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.m.Tile");


/**
 * Constructor for a new OverviewTile.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Display aTile that presents an overview of a customer
 * @extends sap.m.Tile
 *
 * @constructor
 * @public
 * @deprecated Since version 1.24.3. 
 * This control is not required anymore as per central UX requirements.
 * This control will not be supported anymore.
 * @name sap.ca.ui.OverviewTile
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.m.Tile.extend("sap.ca.ui.OverviewTile", /** @lends sap.ca.ui.OverviewTile.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * This property is used to set the title of the tile
		 */
		title : {type : "string", group : "Misc", defaultValue : 'null'},

		/**
		 * This property is used to set the image of the tile
		 */
		icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : 'null'},

		/**
		 * This property is used to set the contact of the tile
		 */
		contact : {type : "string", group : "Misc", defaultValue : 'null'},

		/**
		 * This property is used to set the address field in the form of the tile
		 */
		address : {type : "string", group : "Misc", defaultValue : 'null'},

		/**
		 * This property is used to set the opportunities field in the form of the tile
		 */
		opportunities : {type : "string", group : "Misc", defaultValue : 'null'},

		/**
		 * This property is used to set the rating field in the form of the tile
		 */
		rating : {type : "string", group : "Misc", defaultValue : 'null'},

		/**
		 * This property is used to set the last contact field in the form of the tile
		 */
		lastContact : {type : "string", group : "Misc", defaultValue : 'null'},

		/**
		 * This property is used to set the next contact field in the form of the tile
		 */
		nextContact : {type : "string", group : "Misc", defaultValue : 'null'},

		/**
		 * This property is used to set the revenue to date field in the form of the tile
		 */
		revenue : {type : "string", group : "Misc", defaultValue : 'null'},

		/**
		 * This property is used to show/hide the tile
		 */
		visible : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * This property is used to set the width of the control
		 */
		width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

		/**
		 * This property is used to enable an event to be thrown when clicking on the contact's name
		 */
		contactActive : {type : "boolean", group : "Behavior", defaultValue : false}
	},
	events : {

		/**
		 * This event is fired when the end user clicks on the contact link.
		 */
		contactPress : {}
	}
}});


/**
 * The initialization method
 *
 * @name sap.ca.ui.OverviewTile#init
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

jQuery.sap.require("sap.ui.core.IconPool");
jQuery.sap.require("sap.ca.ui.utils.resourcebundle");

sap.ca.ui.OverviewTile.prototype.init = function () {
	this._address = new sap.m.Text({maxLines: 1});
	this._address.setParent(this);
	this._address.addStyleClass("sapCaUiOTAddress");

	this._oppLabel = new sap.m.Label();
	this._opp = new sap.m.Text({maxLines: 1});
	this._createFormLine(this._oppLabel, this._opp, "OverviewTile.opportunities");

	this._revenueLabel = new sap.m.Label();
	this._revenue = new sap.m.Text({maxLines: 1});
	this._createFormLine(this._revenueLabel, this._revenue, "OverviewTile.revenue");

	this._ratingLabel = new sap.m.Label();
	this._rating = new sap.m.Text({maxLines: 1});
	this._createFormLine(this._ratingLabel, this._rating, "OverviewTile.rating");

	this._lastCtxLabel = new sap.m.Label();
	this._lastCtx = new sap.m.Text({maxLines: 1});
	this._createFormLine(this._lastCtxLabel, this._lastCtx, "OverviewTile.lastAppointment");

	this._nextCtxLabel = new sap.m.Label();
	this._nextCtx = new sap.m.Text({maxLines: 1});
	this._createFormLine(this._nextCtxLabel, this._nextCtx, "OverviewTile.nextAppointment");
	this._title = new sap.m.Text({maxLines: 2});
	this._title.setParent(this);
	this._title.addStyleClass("sapCaUiOverviewTileTitle");

	this._ctxlink = new sap.m.Link(this.getId() + "-link");
	this._ctxlink.setParent(this);
	this._ctxlink.addStyleClass("sapCaUiOverviewTileContact");

	this._sapCaUiPath = jQuery.sap.getModulePath("sap.ca.ui");

	this._ctxlink.setEnabled(false);

	if (jQuery.device.is.desktop) {
		var fnOnSpace = jQuery.proxy(function (oEvent) {
			this.ontap(oEvent);
			//event should not trigger any further actions
			oEvent.stopPropagation();
			oEvent.preventDefault();
		}, this);
		this.onsapspace = fnOnSpace;
	}

};

sap.ca.ui.OverviewTile.prototype._createFormLine = function (oLabelCtrl, oTextCtrl, sLabelTextKey) {
	oLabelCtrl.setText(sap.ca.ui.utils.resourcebundle.getText(sLabelTextKey));
	oLabelCtrl.setParent(this);
	oLabelCtrl.addStyleClass("sapCaUiOTFormLbl");
	oLabelCtrl.setTextAlign(sap.ui.core.TextAlign.Right);
	oTextCtrl.setParent(this);
	oTextCtrl.addStyleClass("sapCaUiOTFormVal");
	oLabelCtrl.setLabelFor(oTextCtrl);
};

sap.ca.ui.OverviewTile.prototype._getImageCtrl = function () {
	return this._image;
};

sap.ca.ui.OverviewTile.prototype._getTitleCtrl = function () {
	return this._title;
};

sap.ca.ui.OverviewTile.prototype._getContactCtrl = function () {
	return this._ctxlink;
};

sap.ca.ui.OverviewTile.prototype._getAddressCtrl = function () {
	return this._address;
};

sap.ca.ui.OverviewTile.prototype._getOppLabelCtrl = function () {
	return this._oppLabel;
};

sap.ca.ui.OverviewTile.prototype._getOppCtrl = function () {
	return this._opp;
};

sap.ca.ui.OverviewTile.prototype._getRevenueLabelCtrl = function () {
	return this._revenueLabel;
};

sap.ca.ui.OverviewTile.prototype._getRevenueCtrl = function () {
	return this._revenue;
};

sap.ca.ui.OverviewTile.prototype._getRatingLabelCtrl = function () {
	return this._ratingLabel;
};

sap.ca.ui.OverviewTile.prototype._getRatingCtrl = function () {
	return this._rating;
};

sap.ca.ui.OverviewTile.prototype._getLastCtxCtrl = function () {
	return this._lastCtx;
};

sap.ca.ui.OverviewTile.prototype._getLastCtxLabelCtrl = function () {
	return this._lastCtxLabel;
};

sap.ca.ui.OverviewTile.prototype._getNextCtxCtrl = function () {
	return this._nextCtx;
};

sap.ca.ui.OverviewTile.prototype._getNextCtxLabelCtrl = function () {
	return this._nextCtxLabel;
};

/**
 * Called when the control is destroyed.
 *
 * @private
 */
sap.ca.ui.OverviewTile.prototype.exit = function () {
	if (this._image) {
		this._image.destroy();
		this._image = null;
	}
	this._ctxlink.destroy();
	this._ctxlink = null;
	this._title.destroy();
	this._title = null;

	this._address.destroy();
	this._address = null;
	this._oppLabel.destroy();
	this._oppLabel = null;
	this._opp.destroy();
	this._opp = null;
	this._revenueLabel.destroy();
	this._revenueLabel = null;
	this._revenue.destroy();
	this._revenue = null;
	this._ratingLabel.destroy();
	this._ratingLabel = null;
	this._rating.destroy();
	this._rating = null;
	this._lastCtxLabel.destroy();
	this._lastCtxLabel = null;
	this._lastCtx.destroy();
	this._lastCtx = null;
	this._nextCtxLabel.destroy();
	this._nextCtxLabel = null;
	this._nextCtx.destroy();
	this._nextCtx = null;
};
/**
 * Overrides the icon property of the Tile Control
 */
sap.ca.ui.OverviewTile.prototype.getIcon = function () {
	if (!this.getProperty("icon")) {
		this.setProperty("icon", this._sapCaUiPath + "/images/placeholder.png");
	}
	return this.getProperty("icon");

};

sap.ca.ui.OverviewTile.prototype.setTitle = function (iTitle) {
	this.setProperty("title", iTitle);
	this._title.setText(iTitle);
};

sap.ca.ui.OverviewTile.prototype.setContact = function (iContact) {
	this.setProperty("contact", iContact);
	this._ctxlink.setText(iContact);
};

sap.ca.ui.OverviewTile.prototype.setAddress = function (iAddress) {
	this.setProperty("address", iAddress);
	this._address.setText(iAddress);
};

sap.ca.ui.OverviewTile.prototype.setOpportunities = function (iOpportunities) {
	this.setProperty("opportunities", iOpportunities);
	this._opp.setText(iOpportunities);
};

sap.ca.ui.OverviewTile.prototype.setRevenue = function (iRevenue) {
	this.setProperty("revenue", iRevenue);
	this._revenue.setText(iRevenue);
};

sap.ca.ui.OverviewTile.prototype.setRating = function (iRating) {
	this.setProperty("rating", iRating);
	this._rating.setText(iRating);
};

sap.ca.ui.OverviewTile.prototype.setLastContact = function (iLastContact) {
	this.setProperty("lastContact", iLastContact);
	this._lastCtx.setText(iLastContact);
};

sap.ca.ui.OverviewTile.prototype.setNextContact = function (iNextContact) {
	this.setProperty("nextContact", iNextContact);
	this._nextCtx.setText(iNextContact);
};

sap.ca.ui.OverviewTile.prototype.setContactActive = function (bContactActive) {
	var bActive = (bContactActive === true); // else undefined or null -> enabled
	this.setProperty("contactActive", bActive);
	this._ctxlink.setEnabled(bActive);
};

sap.ca.ui.OverviewTile.prototype.onBeforeRendering = function () {
	var mProperties = {
		src: this.getIcon(),
		padding: "0 0 0 0",
		height: "3rem",
		width: "3rem",
		size: "3rem"
	};
	this._image = sap.m.ImageHelper.getImageControl(this.getId() + "-img", this._image, null, mProperties);
};

sap.ca.ui.OverviewTile.prototype.ontap = function (oEvent) {
	if (oEvent && oEvent.target && oEvent.target.id === this._ctxlink.getId() && this.getContactActive()) {
		this.fireContactPress(this._ctxlink);
	} else {
		sap.m.Tile.prototype.ontap.call(this);
	}
};

sap.ca.ui.OverviewTile.prototype.onkeyup = function (oEvent) {
	if (oEvent.which === jQuery.sap.KeyCodes.ENTER) {
		this.ontap(oEvent);
		// event should not trigger any further actions
		oEvent.stopPropagation();
		oEvent.preventDefault();
	}
};

sap.ca.ui.OverviewTile.prototype.ontouchmove = function () {
	if (!this.isEditable()) {
		this.$().toggleClass('sapMTileActive sapMTileActive-CTX', false);
	}
};

