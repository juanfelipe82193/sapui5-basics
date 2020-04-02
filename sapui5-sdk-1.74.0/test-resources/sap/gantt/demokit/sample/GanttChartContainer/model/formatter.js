sap.ui.define([
	"sap/ui/model/type/Currency"
], function (Currency) {
	"use strict";

	var mColorMapping = {
		"FU_PLANNED" : {
			strokeWidth: 2,
			fill: "#99D101",
			strokeDasharray: ""
		},
		"FU_UNPLANNED": {
			stroke: "#99D101",
			strokeWidth: 2,
			fill: "#fff",
			strokeDasharray: "3,3"
		},

		"FO_PLANNED" : {
			strokeWidth: 0,
			fill: "#99D101",
			stroke: "#99D101",
			strokeDasharray: ""
		},
		"FO_UNPLANNED": {
			stroke: "#99D101",
			strokeWidth: 3,
			fill: "#fff",
			strokeDasharray: "3,3"
		},
		"DEFAULT": {
			stroke: "#000",
			strokeWidth: 2,
			fill: "#000",
			strokeDasharray: "5,1"
		}
	};

	function getMappingItem(sType, sPlanStatus) {
		var sKey = (sType && sPlanStatus) ? sType.toUpperCase() + "_" + sPlanStatus.toUpperCase() : "DEFAULT";

		return mColorMapping[sKey];
	}

	return {

		orderTitle: function(sRequirementId, sSource, sDestination) {
			return [sRequirementId, ':', sSource, "->", sDestination].join(" ");
		},

		strokeColor: function(sType, sPlanStatus) {
			return getMappingItem(sType, sPlanStatus)["stroke"];
		},
		strokeWidth: function(sType, sPlanStatus) {
			return getMappingItem(sType, sPlanStatus)["strokeWidth"];
		},

		strokeDasharray: function(sType, sPlanStatus) {
			return getMappingItem(sType, sPlanStatus)["strokeWidth"];
		},

		fillColor: function(sType, sPlanStatus) {
			return getMappingItem(sType, sPlanStatus)["fill"];
		},

		statusIconColor: function(sPlanStatus) {
			return sPlanStatus === "planned" ? "Success" : "Normal";
		}
	};
});
