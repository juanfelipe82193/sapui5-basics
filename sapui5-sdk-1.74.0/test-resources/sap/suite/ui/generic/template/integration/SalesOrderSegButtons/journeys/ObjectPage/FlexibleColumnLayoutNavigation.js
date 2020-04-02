sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Flexible Column Layout Navigation");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			// arrangements
		//	Given.iStartTheListReport();
			Given.iStartMyApp("test-resources/sap/suite/ui/generic/template/demokit/flpSandbox.html?flpApps=SalesOrder-SegButtons#SalesOrder-SegButtons?serverDelay=50&responderOn=true&sap-ui-language=en_US&sap-theme=sap_belize");

			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportPage:::DynamicPageTitle-expandBtn");

			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch();

			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Navigate to the main ObjectPage", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000002"});

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002")
				.and
				.iShouldSeeTheSections(["Sales Order Items","ProductTableReuse"])
				.and
				.iShouldSeeTheButtonWithId("fullScreen");
		});
		
		
		opaTest("Change to fullscreen, close the column and open another item", function (Given, When, Then) {
			When.onTheGenericListReport
			// Header could be collapsed when window vertical size is very small and system starts to scroll
//				.iClickTheButtonWithId("template:::ListReportPage:::DynamicPageTitle-expandBtn")
//				.and
				.iSetTheFilter({Field:"editStateFilter", Value:1})
				.and
				.iExecuteTheSearch();

			When.onTheGenericObjectPage
				.iClickTheButtonWithId("fullScreen");

			When.onTheGenericObjectPage
			.iClickTheButtonWithId("closeColumn")
				
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});
				
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("closeColumn");
		});				
		
		

		opaTest("Maximize the ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("fullScreen");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("exitFullScreen");
		});
		
		opaTest("Minimize the ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("exitFullScreen");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("fullScreen")
				.and
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
		});

		opaTest("Expand the ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-right");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-left");
		});

		opaTest("Collapse the ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-left");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
		});

		opaTest("Navigate to items Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"30"});

			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["Schedule Lines"])
				.and
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
//				.and
//				.iShouldSeeTheButtonWithId("fullScreen", "C_STTA_SalesOrderItem_WD_20");
		});

/* Maximizing on SubObjectPage does not work if the winodow is too small which is the case when running in the test-suite.
 * In that case the maximize button is not visible which seems to be a bug 

		opaTest("Maximize the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("fullScreen", "C_STTA_SalesOrderItem_WD_20");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("exitFullScreen", "C_STTA_SalesOrderItem_WD_20");
		});
		
		opaTest("Minimize the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("exitFullScreen", "C_STTA_SalesOrderItem_WD_20");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("fullScreen", "C_STTA_SalesOrderItem_WD_20")
				.and
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
		});
*/
		opaTest("Expand the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-right");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-left");
		});

		opaTest("Collapse the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-left");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");

			Then.onTheListReportPage.iTeardownMyApp();
		});
	}
);