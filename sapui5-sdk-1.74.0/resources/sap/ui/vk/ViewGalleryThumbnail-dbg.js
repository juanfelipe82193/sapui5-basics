/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/m/Image"

],
function(
	Image
	) {

	"use strict";

	/**
	 *  Constructor for a new ViewGalleryThumbnail.
	 *
	 * @class
	 * Creates a thumbnail for use in a ViewGallery control
	 *
	 * @param {string} [sId] ID for the new control. This ID is generated automatically if no ID is provided.
	 * @param {object} [mSettings] Initial settings for the new ViewGalleryThumbnail.
	 * @private
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.m.Image
	 * @alias sap.ui.vk.ViewGalleryThumbnail
	 * @since 1.72.0
	 */

	var ViewGalleryThumbnail = Image.extend("sap.ui.vk.ViewGalleryThumbnail", /** @lends sap.m.Image.prototype */ {
		metadata: {
			associations: {
				viewGallery: {
					type: "sap.ui.vk.ViewGallery"
				}
			},
			properties: {
				enabled: { type: "boolean", defaultValue: true },
				thumbnailWidth: { type: "sap.ui.core.CSSSize", defaultValue: "5rem" },
				thumbnailHeight: { type: "sap.ui.core.CSSSize", defaultValue: "5rem" },
				source: { type: "string", defaultValue: "" },
				tooltip: { type: "string", defaultValue: "" },
				selected: { type: "boolean", defaultValue: false },
				processing: { type: "boolean", defaultValue: false },
				animated: { type: "boolean", defaultValue: false }
			}
		}
	});

	ViewGalleryThumbnail.prototype.init = function() {

	};

	/*
	 * Returns the responsible gallery control
	 *
	 * @returns {sap.ui.vk.ViewGallery|undefined}
	 * @protected
	 */
	ViewGalleryThumbnail.prototype.getViewGallery = function() {
		var viewGallery = sap.ui.getCore().byId(this.getAssociation("viewGallery"));
		if (viewGallery instanceof sap.ui.vk.ViewGallery) {
			return viewGallery;
		}
	};

	ViewGalleryThumbnail.prototype._getIndex = function() {
		var viewGallery = this.getViewGallery();
		var index = viewGallery._viewItems.indexOf(this);

		return index;
	};


	return ViewGalleryThumbnail;
});
