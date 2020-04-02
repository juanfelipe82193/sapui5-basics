/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/core/Locale",
	'sap/base/util/isPlainObject'
	], function (
		Locale,
		isPlainObject
	) {
		"use strict";

		/**
		 * Helper class for working with bindings.
		 *
		 * @author SAP SE
		 * @version 1.74.0
		 *
		 * @private
		 * @alias sap.f.cards.Utils
		 */
		var Utils = {};

		/**
		 * Shifts formatter options and locale.
		 * @param {object} formatOptions The format options.
		 * @param {string} locale Custom locale
		 * @returns {object} Locale
		 */
		Utils.processFormatArguments = function (formatOptions, locale) {

			var oFormatOptions = isPlainObject(formatOptions) ? formatOptions : {},
				oLocale = typeof formatOptions === "string" ? new Locale(formatOptions) : (locale && new Locale(locale));

			return {
					formatOptions: oFormatOptions,
					locale: oLocale
				};

		};

		return Utils;
	});

