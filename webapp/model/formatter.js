sap.ui.define([], function () {
	"use strict";

	return {
		delivery: function (iWeight, sMeasure) {
			var sResult = "";

			if (sMeasure === "G") {
				iWeight = iWeight / 1000;
			}

			if (iWeight < 0.5) {
				sResult = "Mail Deliver";
			} else if (iWeight < 5) {
				sResult = "Parcel Delivery";
			} else {
				sResult = "Carrier Delivery";
			}

			return sResult;
		},

		numberFormat: function (sNumber) {
			var oString = "";

			if (sNumber) {
				var numSplit = sNumber.split(".");
				oString = numSplit[0] + numSplit[1];
			}

			return oString;
		}
	};
});