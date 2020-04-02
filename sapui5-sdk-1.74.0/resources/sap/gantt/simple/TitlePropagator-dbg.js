/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

// Provides helper sap.gantt.simple.TitlePropagator
sap.ui.define(['./BaseShape'],
	function(BaseShape) {
	"use strict";

	/**
	 * Helper Class for enhancement of a BaseShape with propagation of title and showTitle property.
	 *
	 * <b>This constructor should be applied to the prototype of a BaseShape</b>
	 *
	 * Example:
	 * <code>
	 * sap.ui.core.TitlePropagator.call(<i>Some-Shape</i>.prototype, <i>Default-value, ...</i>);
	 * </code>
	 * e.g.
	 * <code>
	 * sap.ui.core.TitlePropagator.call(sap.gantt.simple.BaseRectangle.prototype);
	 * </code>
	 *
	 * @class
	 * @param {boolean} [bDefault=true] the value that should be used as default value for the property showTitle of the enhanced element.
	 * @private
	 * @alias sap.gantt.simple.TitlePropagator
	 */
	var TitlePropagator = function(bDefault) {
		// Ensure only Controls are enhanced
		if (!(this instanceof BaseShape)) {
			throw new Error("TitlePropagator only supports subclasses of BaseShape");
		}

		// default for the default
		if ( bDefault === undefined ) {
			bDefault = true;
		}

		this.getShowTitle = function() {
			return this.getProperty("showTitle");
		};
		this.setShowTitle = function(bShow) {
			return this.setProperty("showTitle", bShow);
		};

		this.getMetadata().addProperty("showTitle", {type : "boolean", group : "Appearance", defaultValue :  !!bDefault});
		this.getMetadata().addPublicMethods('getShowTitle');
		this.getMetadata().addPublicMethods('setShowTitle');


		this.getTitle = function() {
			return this.getProperty("title");
		};
		this.setTitle = function(sTitle) {
			return this.setProperty("title", sTitle);
		};
		this.getMetadata().addProperty("title", {type: "string", group: "Appearance", defaultValue: null});
		this.getMetadata().addPublicMethods("getTitle");
		this.getMetadata().addPublicMethods('setTitle');
	};


	return TitlePropagator;

}, /* bExport= */ true);
