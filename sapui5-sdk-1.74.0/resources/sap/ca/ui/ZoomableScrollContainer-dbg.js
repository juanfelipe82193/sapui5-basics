/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.ZoomableScrollContainer.
jQuery.sap.declare("sap.ca.ui.ZoomableScrollContainer");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.m.ScrollContainer");


/**
 * Constructor for a new ZoomableScrollContainer.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Based on a ScrollContainer, it allows you to pinch and zoom on mobile devices
 * @extends sap.m.ScrollContainer
 *
 * @constructor
 * @public
 * @deprecated Since version 1.22. 
 * 
 * ZoomableScrollContainer is used in PictureViewer control and is not meant to be consumed outside of PictureViewer usage.
 * PictureViewer was replacing the Carousel as it wasn't supporting some versions of MS Internet Explorer. Now, the
 * sap.m.Carousel is fully functional, please use sap.m.Carousel instead. This control will not be supported anymore.
 * @name sap.ca.ui.ZoomableScrollContainer
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.m.ScrollContainer.extend("sap.ca.ui.ZoomableScrollContainer", /** @lends sap.ca.ui.ZoomableScrollContainer.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * Activate or not the zooming functionality. If FALSE, it acts exactly as a basic
		 * ScrollContainer.
		 */
		zoomable : {type : "boolean", group : "Misc", defaultValue : true},

		/**
		 * Initial scaling factor
		 */
		initialScale : {type : "float", group : "Misc", defaultValue : 1},

		/**
		 * Lowest scaling factor allowed
		 */
		minScale : {type : "float", group : "Misc", defaultValue : 1},

		/**
		 * Highest scaling factor allowed
		 */
		maxScale : {type : "float", group : "Misc", defaultValue : 4}
	}
}});

sap.ca.ui.ZoomableScrollContainer.prototype.init = function() {
    sap.m.ScrollContainer.prototype.init.apply(this);
};

sap.ca.ui.ZoomableScrollContainer.prototype.onAfterRendering = function() {

    var fnCallback = this.getScrollDelegate().onAfterRendering;

    var fScale = this.getInitialScale();
    var fMin = this.getMinScale();
    var fMax = this.getMaxScale();
    var bZoomable = this.getZoomable();


    this.getScrollDelegate().onAfterRendering = function(){
        fnCallback.call(this);
        if(this._scroller) {
            this._scroller.scale = fScale;
            this._scroller.options.zoom = bZoomable;
            this._scroller.options.zoomMin = fMin;
            this._scroller.options.zoomMax = fMax;
            this._scroller.zoom(0, 0, fScale);

            this._scroller.options.onZoom = function(oEvent) {
                // "this" is the scroller
            };
            this._scroller.options.onZoomStart = function(oEvent) {
            };
        }

    };
};
