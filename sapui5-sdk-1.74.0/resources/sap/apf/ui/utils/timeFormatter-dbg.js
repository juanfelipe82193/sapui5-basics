/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2018 SAP SE. All rights reserved
*/
sap.ui.define([
	'sap/ui/model/odata/type/Time'
], function(Time) {
	"use strict";

	var TimeFormatter = function() {
	};
	TimeFormatter.prototype.constructor = TimeFormatter;
	TimeFormatter.prototype.getFormattedValue = function(oMetadata, originalFieldValue) {
		var formattedDateValue = originalFieldValue;
		if (originalFieldValue.__edmType != undefined && originalFieldValue.__edmType === "Edm.Time") {
			var timeFormatter = new Time();
			formattedDateValue = timeFormatter.formatValue(originalFieldValue, "string");
		}
		return formattedDateValue;
	};
	return TimeFormatter;
}, true /*global_export*/);
