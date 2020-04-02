sap.ui.define([ "sap/ui/test/Opa5" ],
	function (Opa5) {
		"use strict";

		return {
			getAppParameters: function () {
				var oAppParams = {};

				var sAppId = Opa5.getTestLibConfig('fioriElementsTestLibrary').Common.appId;
				var sEntitySet = Opa5.getTestLibConfig('fioriElementsTestLibrary').Common.entitySet;

				oAppParams.AppId = sAppId;
				oAppParams.EntitySet = sEntitySet;
				oAppParams.LRPrefixID = sAppId + "::sap.suite.ui.generic.template.ListReport.view.ListReport::" + sEntitySet;
				oAppParams.ALPPrefixID = sAppId + "::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::" + sEntitySet;
				oAppParams.OPPrefixID = sAppId + "::sap.suite.ui.generic.template.ObjectPage.view.Details::" + sEntitySet;
				oAppParams.OPNavigation = sAppId + "::sap.suite.ui.generic.template.ObjectPage.view.Details::";

				return oAppParams;
			},

			getNavigationPart: function (sNavigationProperty, sEntitySet) {
				var oAppParams = this.getAppParameters();
				var sNavPart = (sEntitySet && sEntitySet.length) ? sEntitySet : oAppParams.EntitySet;
				sNavPart = sNavPart + "--" + sNavigationProperty;
				return sNavPart;
			}

		};
	}
);
