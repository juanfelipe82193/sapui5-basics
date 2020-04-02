sap.ui.define([ "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/suite/ui/commons/util/DateUtils" ],
	function(Controller, JSONModel, DateUtils) {
	"use strict";

	/**
	 * A context path is the first path of window.locatin.pathname (e.g. sapui5-sdk-dist). It may be empty.
	 * @returns {string} The context path based on the windows url
	 * @private
	 */
	function getBasePath() {
		return jQuery.sap.getModulePath("sap.suite.ui.commons.sample.Timeline", "");
	}

	function convertData(oEvent) {
		var oData,
			oModel = oEvent.getSource(),
			sBasePath = getBasePath();

		if (!oEvent.getParameters().success) {
			return;
		}

		oData = oModel.getData();
		oData.Employees.forEach(function(oEmployee) {
			oEmployee.HireDate = DateUtils.parseDate(oEmployee.HireDate);
			oEmployee.Photo = sBasePath + oEmployee.Photo;
		});
		oModel.updateBindings(true);
	}

	return Controller.extend("sap.suite.ui.commons.sample.TimelineCustomGrouping.Timeline", {
		onInit: function() {
			var oModel = new JSONModel(jQuery.sap.getModulePath("sap.suite.ui.commons.sample.TimelineCustomGrouping", "/data.json"));
			oModel.attachRequestCompleted(convertData);

			this.getView().setModel(oModel);
			this.byId("idTimeline").setCustomGrouping(function(oDate) {
				return {
					key: oDate.getFullYear() + "/" + (oDate.getMonth() < 6 ? 1 : 2),
					title: oDate.getFullYear() + "/" + (oDate.getMonth() < 6 ? "1. half" : "2. half"),
					date: oDate
				};
			});
		}
	});
});
