/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/Element'
], function (Element) {
	"use strict";
	/**
	 * Creates and initializes a new Locale
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The locale control is used for converting the UTC date time to your local date time
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.config.Locale
	 */
	var Locale = Element.extend("sap.gantt.config.Locale", /** @lends sap.gantt.config.Locale.prototype */ {
		metadata: {
			properties: {

				/**
				 * User time zone
				 */
				timeZone: {type: "string", defaultValue: "UTC"},

				/**
				 * Gap value to the UTC time in the format hhmmss
				 */
				utcdiff: {type: "string", defaultValue: "000000"},

				/**
				 * Sign of the gap to the UTC time. Two valid values: "+" or "-".
				 */
				utcsign: {type: "string", defaultValue: "+"},

				/**
				 * Day-light saving time periods. Array of {@link sap.gantt.config.TimeHorizon}
				 * other locale info like langu, dateFormat, timeFormat and numberFormat, please use UI5 standard configuration object.
				 */
				dstHorizons: {type: "object[]", defaultValue: []}	// dst: day-light saving
			}
		}
	});

	return Locale;
}, true);
