/*
 * This module provides a function that sets favorite icons
 */
sap.ui.define([
    "sap/ui/util/Mobile",
    "./common.boot.path"
], function (MobileSupport, sBootPath) {
    "use strict";

    return loadIcons;

    function loadIcons () {
        MobileSupport.setIcons({
            "phone": sBootPath + "/sap/ushell/themes/base/img/launchicons/57_iPhone_Desktop_Launch.png",
            "phone@2": sBootPath + "/sap/ushell/themes/base/img/launchicons/114_iPhone-Retina_Web_Clip.png",
            "tablet": sBootPath + "/sap/ushell/themes/base/img/launchicons/72_iPad_Desktop_Launch.png",
            "tablet@2": sBootPath + "/sap/ushell/themes/base/img/launchicons/144_iPad_Retina_Web_Clip.png",
            "favicon": sBootPath + "/sap/ushell/themes/base/img/launchpad_favicon.ico",
            "precomposed": true
        });
    }

});