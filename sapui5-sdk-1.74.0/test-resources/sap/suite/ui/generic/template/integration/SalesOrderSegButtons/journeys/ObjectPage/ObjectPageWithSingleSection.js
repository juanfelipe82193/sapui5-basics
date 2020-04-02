sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Responsive table occupying available white space in OP");

		opaTest("Expanding the responsive table to occupy the available space.", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReport("manifestWithoutReusable");

			// actions
			When.onTheGenericListReport
               			 .iExecuteTheSearch();
           		 When.onTheGenericListReport
                		 .iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000002"});

           		 Then.onTheObjectPage
               			 .iShouldSeeResponsiveTableExpand();
           		 Then.onTheGenericListReport
				.iTeardownMyApp();
		});
	}
);