window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.ca.ui.utils.resourcebundle");

    module("Check resource Text: OK");

    test("getText dialog.ok", function () {
        var sOK = sap.ca.ui.utils.resourcebundle.getText("dialog.ok");
        ok(sOK === "OK", "Get the text OK from the resource bundle: " + sOK);
    });
});
