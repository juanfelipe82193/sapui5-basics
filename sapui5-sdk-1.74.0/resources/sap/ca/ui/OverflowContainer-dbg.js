/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.OverflowContainer.
jQuery.sap.declare("sap.ca.ui.OverflowContainer");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new OverflowContainer.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * 
 * The OverflowContainer allows the content of a control to be partially displayed before being fully expanded.
 * It will cut its content to a fixed height that can be defined. It is fully suitable within an IconTabBar.
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @deprecated Since version 1.24.1. 
 * OverflowContainer is deprecated as per central UX requirements. This control will not be supported anymore.
 * @name sap.ca.ui.OverflowContainer
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.ca.ui.OverflowContainer", /** @lends sap.ca.ui.OverflowContainer.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * 
		 * The height of the container when not expanded. It should be determined by the application.
		 * The default value is set to 200px.
		 */
		overflowHeight : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '200px'},

		/**
		 * This property allows to fully expand the container
		 */
		expanded : {type : "boolean", group : "Behavior", defaultValue : false}
	},
	aggregations : {

		/**
		 * Controls to be embedded.
		 */
		content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"}
	}
}});

sap.ca.ui.OverflowContainer.prototype.init = function(){
	this._oExpandCollapseBtn = new sap.m.Button({
		id : this.getId() + "-button",
		icon: "sap-icon://slim-arrow-down",
		type: sap.m.ButtonType.Transparent,
		tap: jQuery.proxy(this._toggleExpandCollapse, this)
	}).setParent(this).addStyleClass("sapCaUiOCBtn");
};

sap.ca.ui.OverflowContainer.prototype._toggleExpandCollapse = function(){
	var $container = this.$();
	this.setProperty("expanded", !this.getExpanded(), true);
	var $overlay = jQuery.sap.byId(this.getId() + "-overlay");
	var bIsExpanded = this.getExpanded();
	if (bIsExpanded){
		// Expanded: no overlay
		$overlay.hide();
		this._oExpandCollapseBtn.setProperty("icon", "sap-icon://slim-arrow-up", false);
		 $container.css("max-height", "none");
	} else {
		// Collapse
		this._oExpandCollapseBtn.setProperty("icon","sap-icon://slim-arrow-down", false);
		$container.css("max-height", this.getOverflowHeight());
		$overlay.show();
	}
};

sap.ca.ui.OverflowContainer.prototype.onBeforeRendering = function() {
	//unregister the resize listener
	if (this._sResizeListenerId) {
	  sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
		this._sResizeListenerId = null;
	}
};

sap.ca.ui.OverflowContainer.prototype.onAfterRendering = function(){
  this._sResizeListenerId = sap.ui.core.ResizeHandler.register(jQuery.sap.domById(this.getId() + "-content"), jQuery.proxy(this._resize, this));
	var buttonIcon = this.getExpanded() ? "sap-icon://slim-arrow-up" : "sap-icon://slim-arrow-down";
	this._oExpandCollapseBtn.setProperty("icon", buttonIcon, false);
	this._updateState(this.getExpanded());
};

sap.ca.ui.OverflowContainer.prototype._updateState = function(bExpand){
	var $content = jQuery.sap.byId(this.getId() + "-content");
	var $overlay = jQuery.sap.byId(this.getId() + "-overlay");
	$overlay.hide();
	if (parseInt(this.getOverflowHeight(), 10) >  $content.outerHeight(true) ){
		this._oExpandCollapseBtn.setVisible(false);
	} else {
		this._oExpandCollapseBtn.setVisible(true);
		var $container = this.$();
		if (bExpand){
			$container.css("max-height", "none");
		} else {
			$container.css("max-height", this.getOverflowHeight());
			$overlay.show();
		}
	}
};

sap.ca.ui.OverflowContainer.prototype._getButton = function(){
	return this._oExpandCollapseBtn;
};

sap.ca.ui.OverflowContainer.prototype.exit = function() {
  this._oExpandCollapseBtn.destroy();
	if (this._sResizeListenerId) {
		sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
		this._sResizeListenerId = null;
	}
};

sap.ca.ui.OverflowContainer.prototype._resize = function() {
  if (!this.getDomRef()) {
	// this component is not rendered, maybe deleted from DOM -> deregister resize
	// handler and do nothing
	// Cleanup resize event registration on exit
	if (this._sResizeListenerId) {
	  sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
	  this._sResizeListenerId = null;
	}
	return;
  }
  this._updateState(this.getExpanded());
};
