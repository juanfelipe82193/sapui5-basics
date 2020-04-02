module("Check that the private methods/variables of UI5 that can crash the control still exist");

jQuery.sap.require("sap.ca.ui.PictureViewer");
jQuery.sap.require("sap.ca.ui.ExpansibleFeedListItem");

function checkFunctionsExist(oInstance, aFunctions, sObjectName) {
    aFunctions.forEach(function (sFunctionName) {
        equal(typeof oInstance[sFunctionName], "function", sFunctionName + " doesn't exist anymore on " + sObjectName);
    });
}

test("sap.ca.ui.PictureViewer", function () {
    checkFunctionsExist(new sap.ca.ui.PictureViewer(), ["_getDimension", "_applyDimension", "_findTile"], "PictureViewer");
});

test("sap.ca.ui.ExpansibleFeedListItem", function () {
    checkFunctionsExist(new sap.ca.ui.ExpansibleFeedListItem(), ["_getLinkSender"], "ExpansibleFeedListItem");
});
