/* global define, sap */

define("zen.rt.components.infochart/js/utils/info_chart_locale", [
		"underscore"
	], function(_){

	"use strict";

	function Locale() {
		this._bundles = {};
		this._callbacks = null;
	}

	Locale.prototype.onLoad = function(cb) {
		// XXX Should we get the locale from somewhere else?
		var locale = sap.ui.getCore().getConfiguration().getFormatLocale(),
			that = this;
		var vizLocal = sap.viz.api.env.Locale.get()
		sap.viz.api.env.Format.useDefaultFormatter(true);

		if (locale !== vizLocal) {
			// load language files from UI5
			var ltPaths = [];
			ltPaths.push(jQuery.sap.getModulePath("sap.viz.resources.chart.langs", "/"));
			ltPaths.push(jQuery.sap.getModulePath("sap.viz.resources.framework.langs", "/"));
			sap.viz.api.env.Resource.path("sap.viz.api.env.Language.loadPaths", ltPaths);
			
			if (!this._callbacks) {
				this._callbacks = [];
				this._callbacks.push(cb);
				sap.viz.api.env.Locale.set(locale, function() {
					that._currentLocale = locale;
					_.forEach(that._callbacks, function(cb) {
						cb();
					});
					that._callbacks = null;
				});
			} else {
				// whilst waiting for the locale to load
				this._callbacks.push(cb);
			}
		} else {
			cb();
		}
	};

	Locale.prototype.getBundle = function(url) {
		if (!this._bundles[url]) {
			this._bundles[url] = $.sap.resources({url : url, locale: getLocale() });
		}
		return this._bundles[url];
	};

	function getLocale() {
		var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
		if(sLocale.indexOf("-") > -1) {
			sLocale = sLocale.split("-");
			sLocale = sLocale[0];
		}
		if(sLocale.indexOf("_") > -1) {
			sLocale = sLocale.split("_");
			sLocale = sLocale[0];
		}
		return sLocale;
	}

	return Locale;
});