sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/demoapps/rta/freestyle/test/integration/pages/Common"
], function(Opa5, Common) {
	"use strict";

	var sNotFoundPageId = "page",
		sNotFoundView = "EmptyPage",
		sDetailNotFoundView = "DetailObjectNotFound";

	Opa5.createPageObjects({
		onTheNotFoundPage: {
			baseClass: Common,

			actions: {

				iPressTheBackButton: function(sViewName) {
					return this.waitFor({
						id: sNotFoundPageId,
						viewName: sViewName,
						success: function(oPage) {
							oPage.fireNavButtonPress();
						}
					});
				}

			},

			assertions: {

				iShouldSeeTheNotFoundGeneralPage: function(sPageId, sPageViewName) {
					return this.waitFor({
						controlType: "sap.m.MessagePage",
						viewName: sPageViewName,
						success: function() {
							QUnit.ok(true, "Shows the message page");
						},
						errorMessage: "Did not reach the empty page"
					});
				},

				iShouldSeeTheNotFoundPage: function() {
					return this.iShouldSeeTheNotFoundGeneralPage(sNotFoundPageId, sNotFoundView);
				},

				iShouldSeeTheObjectNotFoundPage: function() {
					return this.iShouldSeeTheNotFoundGeneralPage(sNotFoundPageId, sDetailNotFoundView);
				},

				theNotFoundPageShouldSayResourceNotFound: function() {
					return this.waitFor({
						id: sNotFoundPageId,
						viewName: sNotFoundView,
						success: function(oPage) {
							QUnit.strictEqual(oPage.getTitle(), oPage.getModel("i18n").getProperty("notFoundTitle"),
								"The not found text is shown as title");
							QUnit.strictEqual(oPage.getText(), oPage.getModel("i18n").getProperty("notFoundText"),
								"The resource not found text is shown");
						},
						errorMessage: "Did not display the resource not found text"
					});
				},

				theNotFoundPageShouldSayObjectNotFound: function() {
					return this.waitFor({
						id: sNotFoundPageId,
						viewName: sDetailNotFoundView,
						success: function(oPage) {
							QUnit.strictEqual(oPage.getTitle(), oPage.getModel("i18n").getProperty("detailTitle"), "The object text is shown as title");
							QUnit.strictEqual(oPage.getText(), oPage.getModel("i18n").getProperty("noObjectFoundText"),
								"The object not found text is shown");
						},
						errorMessage: "Did not display the object not found text"
					});
				}

			}

		}

	});

});
