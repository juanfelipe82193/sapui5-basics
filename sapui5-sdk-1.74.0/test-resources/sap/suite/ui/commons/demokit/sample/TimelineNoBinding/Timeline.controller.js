sap.ui.define([ "sap/ui/core/mvc/Controller" ],
	function(Controller) {
	"use strict";

	var oPageController = Controller.extend("sap.suite.ui.commons.sample.TimelineNoBinding.Timeline", {
		onInit: function () {
			var sBasePath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.Timeline", "");
			this._timeline = this.byId("idTimeline");
			this._timeline.setCustomMessage("Custom filtering demo showing Laurent as credit analyst");
			this._timeline.getContent().forEach(function (oItem) {
				var sUserPicture = oItem.getUserPicture();
				if (sUserPicture) {
					oItem.setUserPicture(sBasePath + sUserPicture);
				}
			});
		},
		onItemFiltering: function (oEvent) {
			// every item is processed by this event
			// oReasons contains information about whether timeline item will be filtered
			// if you want to change this you can use 'prevendDefault' function.
			// when 'prevent default' is called right the OPPOSITE action will take place
			// objects marked to be filtered won't be, and objects marked as passed will be filtered
			var oItem = oEvent.getParameter("item"),
				oReasons = oEvent.getParameter("reasons"),
				iReasonLength = Object.keys(oReasons).length,
				aDataKeys = oEvent.getParameter("dataKeys"),
				sText, sSearchTerm;

			// we show Laurent Dubois as credit analyst even tho by default he would be filtered
			// if there is any data fitlering (aDataKeys contains filtered keys)
			if ((oItem.getUserName() === "Laurent Dubois")
				&& (aDataKeys && aDataKeys.length > 0 && aDataKeys[0].key === "Credit Analyst")
				&& (iReasonLength === 1 && oReasons.Data)) {
				// Laurent is going to be filtered but only because he is not credit analyst (no other reasons as search ...)
				// we want to prevent that -> call prevent default
				oEvent.preventDefault();
			}

			// for custom embedded control we want to search in it
			if (oItem.getUserName() === "--") {
				// we check whether this control would not be filter by any other reason
				if (iReasonLength === 1 && oReasons.Search) {
					sText = this.byId("additionalText").getText();
					sSearchTerm = oEvent.getParameter("searchTerm");
					// search embedded text and if it contains search term call 'prevendDdefault' to change filter result
					if (sText.indexOf(sSearchTerm) !== -1) {
						oEvent.preventDefault();
					}
				}
			}
		}
	});
	return oPageController;
});
