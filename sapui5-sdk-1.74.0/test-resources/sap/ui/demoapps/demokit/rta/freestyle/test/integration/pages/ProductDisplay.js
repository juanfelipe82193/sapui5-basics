sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/demoapps/rta/freestyle/test/integration/pages/Common"
], function (
	Opa5,
	Common
) {
	"use strict";

	Opa5.createPageObjects({
		onS3ProductDisplayPage: {
			baseClass: Common,
			actions: {
				iClickCompanyCard: function() {
					return this.waitFor({
						controlType: "sap.m.Link",
						viewName: "ProductDetailInfo",

						success: function(oLinks) {
							oLinks[0].firePress();
						}
					});
				},

				iWaitUntilTheBusyIndicatorIsGone: function() {
					return this.waitFor({
						autoWait: true,
						id: "idAppControl",
						viewName: "Root",
						// inline-matcher directly as function
						matchers: function(oRootView) {
							// we set the view busy, so we need to query the parent of the app
							return oRootView.getParent().getBusy() === false;
						},
						errorMessage: "The app is still busy.."
					});
				},

				iClickSalesDataTab: function() {
					return this.waitFor({
						controlType: "sap.m.IconTabBar",
						viewName: "ProductDetail",
						success: function(iconTab) {
							var item = iconTab[0].getItems()[2];

							var evt = iconTab[0].setSelectedItem(item);
							iconTab[0].fireSelect(evt);
							item = iconTab[0].getItems()[0];

							evt = iconTab[0].setSelectedItem(item);
							iconTab[0].fireSelect(evt);
							item = iconTab[0].getItems()[1];

							evt = iconTab[0].setSelectedItem(item);
							iconTab[0].fireSelect(evt);
						},
						errorMessage: "Did not find the Scope Tab"
					});
				}
			},

			assertions: {
				iSeeTableControl: function() {
					return this.waitFor({
						id: "select",
						viewName: "ProductDetailChart",
						matchers: new Opa5.matchers.AggregationFilled({
							name: "items"
						}),
						success: function(oSelectCtrl) {
							ok(oSelectCtrl, "Table control present"); // eslint-disable-line no-undef
						}

					});
				},

				iSeeCompanyCard: function() {
					return this.waitFor({
						id: "companyQuickView-quickView-popover",
						success: function(oPopover) {
							Opa5.assert.ok(oPopover, "Company card pop over is open");
						},
						errorMessage: "Company card pop over is not open"
					});
				},

				iCheckIfProductTitleDisplayedInDetail: function() {
					this.waitFor({
						id: "ProductDetailLayout",
						viewName: "ProductDetail",
						check: function(oPH) {
							if (oPH.getHeaderTitle().getObjectTitle() === this.getContext().sProductTitle) {
								return true;
							} else {
								return false;
							}
						},
						success: function() {
							Opa5.assert.ok(true, "Selected prodcut title is displayed in the detail");
						},
						errorMessage: "Product title does not match"
					});
				}
			}
		}
	});
});
