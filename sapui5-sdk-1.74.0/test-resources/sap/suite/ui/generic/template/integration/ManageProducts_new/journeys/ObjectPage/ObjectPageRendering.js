sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function(opaTest,OpaManifest) {	
		"use strict";

		QUnit.module("Object Page Rendering");

		opaTest("The Title is rendered correctly", function(Given, When, Then) {
			// arrangements
			Given.iStartTheObjectPage();

			// actions
			When.onTheObjectPage.iLookAtTheScreen();

			// assertions
			Then.onTheObjectPage.thePageShouldContainTheCorrectTitle();
			Then.onTheGenericObjectPage
				.iShouldSeeTheControlWithId("objectImage")
				.and
				.theButtonWithIdIsEnabled("edit", true)
				.and
				.theButtonWithLabelIsEnabled("Delete", true);
		});
		
		opaTest("The Header Content breakout is rendered correctly", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();

			Then.onTheObjectPage
				.iShouldSeeHeaderContentAfterExtension()
				.and
				.iShouldSeeHeaderContentBeforeExtension();
	});

		opaTest("Clicking the image should show a popup", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheControlWithId("objectImage");
			Then.onTheGenericObjectPage
				.iShouldSeeTheControlWithId("imageDialog");
		});

		opaTest("Closing the image popup", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Close");
			Then.onTheGenericObjectPage
				.iShouldSeeTheControlWithId("objectImage");
		});

		opaTest("The Global Actions are rendered correctly", function (Given, When, Then) {
			// actions
			When.onTheObjectPage.iLookAtTheScreen();

			// assertions
			Then.onTheObjectPage.thePageShouldContainTheCorrectGlobalActions();
		});

		opaTest("The Determining Actions are rendered correctly", function (Given, When, Then) {
			// actions
			When.onTheObjectPage.iLookAtTheScreen();

			// assertions
			Then.onTheObjectPage.thePageShouldContainTheCorrectDeterminingActions();
		});

		opaTest("The Header Facets are rendered correctly", function (Given, When, Then) {
			// actions
			When.onTheObjectPage.iLookAtTheScreen();

			// assertions
			var oManifestJSONModel = OpaManifest.demokit["sample.stta.manage.products"];
			if (oManifestJSONModel.getProperty("/sap.ui.generic.app/pages/0/pages/0/component/settings/simpleHeaderFacets")) {
				// assertions
				Then.onTheObjectPage
					.theSimpleHeaderFacetGeneralInformationIsRendered();
			}
			else {
				Then.onTheObjectPage
					.theHeaderFacetGeneralInformationIsRendered()
					.and
					.theHeaderFacetProductCategoryIsRendered()
					.and
					.theHeaderFacetPriceDataPointIsRendered()
					.and
					.theHeaderFacetStockAvailabilityDataPointIsRendered()
					.and
					.theHeaderFacetProductDescriptionPlainTextIsRendered()
					.and
					.theHeaderFacetSmartMicroChartIsAnnotatedAndIsRendered()
					.and
					.theHeaderFacetProgressIndicatorIsAnnotatedAndIsRendered()
					.and
					.theHeaderFacetRatingIndicactorIsRendered(true /* Aggregated */);
			}
		});	
		opaTest("The Facets are rendered correctly", function(Given, When, Then) {
			// actions
			When.onTheObjectPage
				.iLookAtTheScreen()
				.and
				.iClickASubMenuButtonInTheAnchorBar("General Information")
				//.iClickOnTheGeneralInformationButtonInTheAchorBar()
				.and
				.iClickOnTheProductionInformationInTheAnchorBarPopover();

			// assertions
			Then.onTheObjectPage.theFacetProductInformationInsideTheFacetGeneralInformationIsRenderedCorrectly();

			// actions
			When.onTheObjectPage
				.iClickOnTheGeneralInformationButtonInTheAchorBar()
				.and
				.iClickOnTheProductDescriptionsAndSupplierInTheAnchorBarPopover();

			// assertions
			Then.onTheObjectPage
				.theFacetProductDescriptionsAndSupplierInsideTheFacetGeneralInformationIsRenderedCorrectly()
				.and
				.theFacetProductDescriptionsAndSupplierInsideTheFacetGeneralInformationRendersCharts();
			Then.onTheObjectPage
				.theSearchFieldInTheTableToolbarVisible();
			
/* Product Text Navigation removed from reference app
			// actions
			When.onTheObjectPage
				.iClickOnTheGeneralInformationButtonInTheAchorBar()
				.and
				.iClickOnTheProductTextNavigationInTheAnchorBarPopover();

			// assertions
			Then.onTheObjectPage
				.theFacetProductTextNavigationInsideTheFacetGeneralInformationIsRenderedCorrectly()
				.and
				.theFacetProductTextNavigationInsideTheFacetGeneralInformationRendersCharts();
*/
			
/* SalesRevenue facet taken out because of issues with this table */			
			// actions
			When.onTheObjectPage.iClickOnTheSalesRevenueButtonInTheAnchorBar();

			// assertions
			Then.onTheObjectPage.theFacetSalesRevenueIsRenderedCorrectly();
/**/
			// actions
			When.onTheObjectPage.iClickOnTheContactsButtonInTheAnchorBar();

			// assertions
			Then.onTheObjectPage.theFacetContactsIsRenderedCorrectly();

			// actions
			When.onTheObjectPage.iClickOnTheExtensionSalesDataButtonInTheAnchorBar();

			// assertions
			Then.onTheObjectPage
				.theExtensionFacetSalesDataIsRenderedCorrectly();
		});

		//Based on the property hideChevronForUnauthorizedExtNav in manifest the chevron visibity is maintained where navigation is not possible
		opaTest("Row Action Chevron Rendering in Table", function(Given, When, Then) {

			// actions
			When.onTheObjectPage.iClickOnTheSalesRevenueButtonInTheAnchorBar();

			// assertions
			var oManifestJSONModel = OpaManifest.demokit["sample.stta.manage.products"];
			if (oManifestJSONModel.getProperty("/sap.ui.generic.app/pages/0/pages/0/pages/1/component/settings/hideChevronForUnauthorizedExtNav"))
				{
				Then.onTheObjectPage.theChevronIsVisibleInSalesRevenueTable(false);
				}
			else
				{
				Then.onTheObjectPage.theChevronIsVisibleInSalesRevenueTable(true);
				}			
		});
		
		opaTest("Dynamic Side Content Validation- Show Content", function(Given, When, Then) {
			//action
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Sales Revenue")
				.and
				.iClickTheButtonHavingLabel("Show File");
			
			Then.onTheObjectPage
				.iShouldSeeTheSideContentLoadedSuccessfully(true);

		});
		
		opaTest("Dynamic Side Content Validation- Hide Content", function(Given, When, Then) {
			//action
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Hide File");
			
			Then.onTheObjectPage
				.iShouldSeeTheSideContentLoadedSuccessfully(false);

		});
		
		opaTest("The Default Inline Create Sort is enabled", function(Given, When, Then) {
			// actions
			When.onTheObjectPage.iLookAtTheScreen();

			// assertions
			Then.onTheObjectPage
				.iCheckTableForDefaultInlineCreateSort(true);
		});
		
		opaTest("Subsection extension is rendered properly", function(Given, When, Then) {
			//action
			When.onTheObjectPage.iLookAtTheScreen();
			//asertion
			Then.onTheObjectPage.iShouldSeeSubsectionExtension();
		});

		opaTest("Reused Components are refreshed on changing the Price value", function(Given, When, Then) {
			//action
			When.onTheObjectPage
			.iClickTheEditButton()
			.and
			.iClickOnTheGeneralInformationButtonInTheAchorBar()
			.and
			.iEnterValueInField("900","com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::Price::Field-input")
			.and
			.iLookAtTheScreen();

			//asertion
			Then.onTheGenericObjectPage
			.iShouldSeeTheMessageToastWithText("Refreshed Price");
		 });

		opaTest("Reused Components are refreshed on changing the Supplier value", function(Given, When, Then) {
		 	//action
			When.onTheObjectPage
		 	.iClickOnTheGeneralInformationButtonInTheAchorBar()
			.and
			.iEnterValueInField("100000047","com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::Supplier::Field-input")
			.and
			.iLookAtTheScreen();

			//asertion
			Then.onTheGenericObjectPage
			.iShouldSeeTheMessageToastWithText("Refreshed Supplier");
			
			Then.iTeardownMyApp();
		});
	}
);
