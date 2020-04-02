/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.HierarchyItem.
jQuery.sap.declare("sap.ca.ui.HierarchyItem");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new HierarchyItem.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Item that represent a line of the Hierarchy control. The emphasized property should apply to the item
 * that we want to represent in his hierarchy. Optionals item will be hidden if the option is true on the Hierarchy
 * control.
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @deprecated Since version 1.24. 
 * This control is deprecated as per central UX requirements.
 * This control will not be supported anymore.
 * @name sap.ca.ui.HierarchyItem
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.ca.ui.HierarchyItem", /** @lends sap.ca.ui.HierarchyItem.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * Icon for the item
		 */
		icon : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : null},

		/**
		 * Level type
		 */
		levelType : {type : "string", group : "Data", defaultValue : null},

		/**
		 * Title
		 */
		title : {type : "string", group : "Data", defaultValue : null},

		/**
		 * Identifier text
		 */
		identifier : {type : "string", group : "Data", defaultValue : null},

		/**
		 * Text of the link
		 */
		link : {type : "string", group : "Data", defaultValue : null},

		/**
		 * Does the item looks emphasized
		 */
		emphasized : {type : "boolean", group : "Data", defaultValue : false},

		/**
		 * Is the item optional, so we hide it if option is set on the Hierarchy control
		 */
		optional : {type : "boolean", group : "Data", defaultValue : false}
	},
	aggregations : {

		/**
		 * Icon control
		 */
		_iconControl : {type : "sap.ui.core.Icon", multiple : false, visibility : "hidden"}, 

		/**
		 * Label for levelType
		 */
		_levelTypeLabel : {type : "sap.m.Label", multiple : false, visibility : "hidden"}, 

		/**
		 * Label for identifier
		 */
		_identifierLabel : {type : "sap.m.Label", multiple : false, visibility : "hidden"}, 

		/**
		 * Label for title
		 */
		_titleLabel : {type : "sap.m.Label", multiple : false, visibility : "hidden"}, 

		/**
		 * Link control
		 */
		_linkControl : {type : "sap.m.Link", multiple : false, visibility : "hidden"}
	},
	events : {

		/**
		 * Event when a link is pressed
		 */
		linkPress : {}
	}
}});

jQuery.sap.require("sap.ui.layout.VerticalLayout");
jQuery.sap.require("sap.ui.core.theming.Parameters");


sap.ca.ui.HierarchyItem.prototype.init = function () {
};

sap.ca.ui.HierarchyItem.prototype._getIconControl = function () {
    var oIcon = this.getAggregation("_iconControl");
    if (oIcon == undefined) {
        oIcon = new sap.ui.core.Icon({
            src:this.getProperty("icon"),
            color:sap.ui.core.theming.Parameters.get("sapUiContentNonInteractiveIconColor")
        }).addStyleClass("sapCaUiHierarchyItemIcon");
        this.setAggregation("_iconControl", oIcon);
    }
    return oIcon;
};
sap.ca.ui.HierarchyItem.prototype._getLevelTypeLabel = function () {
    var oLevelTypeLabel = this.getAggregation("_levelTypeLabel");
    if (oLevelTypeLabel == undefined) {
        oLevelTypeLabel = new sap.m.Label({
            text:this.getProperty("levelType")
        }).addStyleClass("sapCaUiHierarchyItemLevelTypeLbl");
        this.setAggregation("_levelTypeLabel", oLevelTypeLabel);
    }
    return oLevelTypeLabel;
};
sap.ca.ui.HierarchyItem.prototype._getIdentifierLabel = function () {
    var oIdentifierLabel = this.getAggregation("_identifierLabel");
    if (oIdentifierLabel == undefined) {
        oIdentifierLabel = new sap.m.Label({
            text:this.getProperty("identifier")
        }).addStyleClass("sapCaUiHierarchyItemIdentifierLbl");
        this.setAggregation("_identifierLabel", oIdentifierLabel);
    }
    return oIdentifierLabel;
};
sap.ca.ui.HierarchyItem.prototype._getTitleLabel = function () {
    var oTitleLabel = this.getAggregation("_titleLabel");
    if (oTitleLabel == undefined) {
        oTitleLabel = new sap.m.Label({
            text:this.getProperty("title")
        }).addStyleClass("sapCaUiHierarchyItemTitleLbl");
        this.setAggregation("_titleLabel", oTitleLabel);
    }
    return oTitleLabel;
};
sap.ca.ui.HierarchyItem.prototype._getLinkControl = function () {
    var oLinkControl = this.getAggregation("_linkControl");
    if (oLinkControl == undefined) {
        oLinkControl = new sap.m.Link({
            text:this.getProperty("link")
        }).addStyleClass("sapCaUiHierarchyItemLink");
        oLinkControl.attachPress(this.fireLinkPress, this);
        this.setAggregation("_linkControl", oLinkControl);
    }
    return oLinkControl;
};


