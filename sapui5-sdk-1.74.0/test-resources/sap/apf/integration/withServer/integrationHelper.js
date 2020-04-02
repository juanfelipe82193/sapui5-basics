/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.apf.integration.withServer.integrationHelper");

/**
 * Hard codes access to 2 existing message files. To be used when no loading of the appl config file happens.
 * @param {sap.apf.core.constants.resourceLocation} bundleId
 * @returns {(string|error)} throws error if bundleId not defined.
 */
sap.apf.integration.withServer.getResourceLocation4Testing = function (bundleId) {
    var file = "xxx";
    switch (bundleId) {
        case sap.apf.core.constants.resourceLocation.apfUiTextBundle:
            file = "apfUi.properties";
            break;
        case sap.apf.core.constants.resourceLocation.applicationUiTextBundle: //            file= "apfUi.properties";
            file = "applicationUi.properties";
            break;
        case sap.apf.core.constants.resourceLocation.apfMessageTextBundle: //            file= "apfMessages.properties";
            file = "apfUi.properties";
            break;
        case sap.apf.core.constants.resourceLocation.applicationMessageTextBundle: //            file= "applicationMessages.properties";
            file = "apfUi.properties";
            break;
        default:
            throw new Error("stub getResourceLocation unexpected bundleId");
    }
    var i18n = 'resources/i18n/';
    return sap.apf.integration.withServer.getLocationOfTestResources() + i18n + file;
};

/**
 * Returns the path to the test folder, depending on the server like Tomcat or Karma.
 * The path ends with slash: "/".
 * @returns {*}
 */
sap.apf.integration.withServer.getLocationOfTestResources = function () {
    var sUrl = null;
    var apfLocation = sap.apf.core.utils.uriGenerator.getApfLocation();
    var index = apfLocation.indexOf("/base");
    if (index > -1) { // Karma
        index = apfLocation.indexOf('/main'); // cut off 'main'-path and substitute by test path
        sUrl = apfLocation.slice(0, index) + '/test/uilib/';
    } else { // HTML QUnit based
        index = apfLocation.indexOf("/qunit-testrunner");
        if (index > -1) { // in UI5 testrunner on Tomcat or Jenkins/Jetty
            sUrl = apfLocation.slice(0, index) + "/qunit-testrunner/test-resources/";
        } else {
            sUrl = jQuery("#apf_deployment_information").attr("export_folder") + 'test-resources/';
        }
    }
    return sUrl;
};
