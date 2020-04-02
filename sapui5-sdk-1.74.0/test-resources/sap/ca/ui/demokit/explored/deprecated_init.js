sap.ui.getCore().attachInitEvent(function () {
    // register and require resources
    sap.ui.localResources("views");
    sap.ui.localResources("util");
    jQuery.sap.require("util.Id");
    jQuery.sap.require("util.Title");
    jQuery.sap.require("util.UiFactory");
    jQuery.sap.require("util.ThemeDetection");
    jQuery.sap.registerModulePath('Application', 'Application');
    // launch application
    jQuery.sap.require("Application");
    new Application({root: "content"});
});
