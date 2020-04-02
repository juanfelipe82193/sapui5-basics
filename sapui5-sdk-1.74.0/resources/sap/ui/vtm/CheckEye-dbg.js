/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vtm.CheckEye.
sap.ui.define([
	"jquery.sap.global", "sap/ui/core/Icon", "sap/ui/core/IconRenderer", "./library"
], function(jQuery, Icon, IconRenderer, library) {
	"use strict";



	/**
	 * Constructor for a new CheckEye.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A custom control for the VTM Tree with 'eye' icons, used to indicate and control the visibility of associated geometry.
	 * @extends sap.ui.core.Icon
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @private
	 * @since 1.16.0
	 * @alias sap.ui.vtm.CheckEye
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 * @experimental Since 1.32.0 This class is experimental and might be modified or removed in future versions.
	 */
	var CheckEye = Icon.extend("sap.ui.vtm.CheckEye", /** @lends sap.ui.vtm.CheckEye.prototype */ {
		metadata: {
			library: "sap.ui.vtm",

			properties: {
				/**
				 * Indicates whether the associated content is visible.
				 */
				visibility: {type: "boolean"}
			}
		},

		onAfterRendering: function() {
			var $this = this.$();
			$this.addClass("sapUiVtmCheckEye");
		},

		renderer: IconRenderer.render,

		setVisibility: function(visibility) {
			this.setProperty("visibility", visibility);
			switch (visibility) {
				case true:
					this.setSrc("sap-icon://show");
					this.setVisible(true);
					break;
				case false:
					this.setSrc("sap-icon://hide");
					this.setVisible(true);
					break;
				default:
					this.setVisible(false);
					break;
			}
		}
	});

	return CheckEye;

}, /* bExport= */ true);
