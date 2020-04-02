/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

// configure shims for non-UI5 modules
sap.ui.loader.config({
	shim: {
		"sap/makit/js/SybaseMA": {
			exports: "$MA"
		},
		"sap/makit/localization/jQueryGlobalization": {
			deps: ["sap/ui/thirdparty/jquery"],
			exports: "jQuery"
		},
		"sap/makit/localization/jQueryCoreLang": {
			deps: ["sap/makit/localization/jQueryGlobalization"],
			exports: "jQuery"
		}
	}
});

// Provides element sap.makit.MakitLib.
sap.ui.define([
	"./library",
	"./js/SybaseMA",
	"./localization/jQueryGlobalization",
	"./localization/jQueryCoreLang",
	"sap/ui/core/Element",
	"sap/base/Log"
], function(
	makitLibrary,
	SybaseMA,
	jQueryGlobalization,
	jQueryCoreLang,
	Element,
	Log
) {
	"use strict";


	/**
	 * Constructor for a new MakitLib.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Wrapper for MAKit Chart Library. Only to be used used internally.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 *
	 * @public
	 * @since 1.12
	 * @deprecated Since version 1.38.
	 * MAKIT charts have been replaced with sap.viz and vizFrame in 1.38. This control will not be supported anymore from 1.38.
	 * @alias sap.makit.MakitLib
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var MakitLib = Element.extend("sap.makit.MakitLib", /** @lends MakitLib.prototype */ { metadata : {

		deprecated : true,
		library : "sap.makit"
	}});

	/*
	 * Static function to handle theme change event.
	 * We only need to do getStyles once because it is applied globally
	 *
	 * @private
	 * */
	MakitLib._onThemeChanged = function (oEvent){
		window.$MA.Chart.getStyles();
	};

	//Static init function to prepare the Makit library
	// Immediately executed when this library is loaded
	MakitLib._libraryInit = (function () {
		var oRB = sap.ui.getCore().getLibraryResourceBundle("sap.makit");
		var sCurrentLocale = sap.ui.getCore().getConfiguration().getLanguage();
		window.$MA.GlobalizedResource = {};
		window.$MA.GlobalizedResource[sCurrentLocale] = {
			"Others": oRB.getText("CHART_OTHERS"),
			"Total": oRB.getText("CHART_TOTAL"),
			"Thousand_ShortForm": oRB.getText("Thousand_ShortForm"),
			"Million_ShortForm": oRB.getText("Million_ShortForm"),
			"Billion_ShortForm": oRB.getText("Billion_ShortForm"),
			"Trillion_ShortForm": oRB.getText("Trillion_ShortForm")
		};

		window.$MA.setLocale(sCurrentLocale);
		//Set the images folder
		var imgName = "popup_tt_left.png"; // Use one the image's filename from chart range selector
		var path = sap.ui.resource("sap.makit", "themes/base/images/" + imgName); //Get the correct resource path
		path = path.substring(0, path.length - imgName.length); //We don't need the filename.
		window.$MA.setImagesFolder(path);
		sap.ui.getCore().attachThemeChanged(MakitLib._onThemeChanged);
		window.$MA.Chart.getStyles(); //Ideally we should call this function whenever styles has changed
		if (Log.getLogger().getLevel() == Log.Level.TRACE) {
			window.$MA.setTrace(3); //Ideally we should call this function whenever styles has changed
		}
	}());

	return MakitLib;
});