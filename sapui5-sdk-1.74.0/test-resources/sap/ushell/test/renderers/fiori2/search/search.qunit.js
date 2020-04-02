
/*
* search testsuite
*/
//QUnit.config.testTimeout = 60000;
QUnit.config.testTimeout = 1200000;

//code alias
//jQuery.sap.registerModulePath("com.sap.kelley.appname", "../../resources/APPNAME");
jQuery.sap.registerModulePath("sap.ushell.test.renderers.fiori2.search", "");

//test alias
//jQuery.sap.registerModulePath("com.sap.kelley.appnameTest", "");


//tests to run
//jQuery.sap.require("com.sap.kelley.test.appnameTest.SimpleTest");
// jQuery.sap.require("sap.ushell.test.renderers.fiori2.search.SearchResultsViewTest");
jQuery.sap.require("sap.ushell.test.renderers.fiori2.search.SearchHelperTest");
//[add tests here]
