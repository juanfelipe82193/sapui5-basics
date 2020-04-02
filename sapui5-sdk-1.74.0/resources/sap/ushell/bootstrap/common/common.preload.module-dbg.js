sap.ui.define([
    "sap/ushell/bootstrap/common/common.load.script"
], function (fnLoadScript) {
    'use strict';

    /**
     * Preload the flp/Component-preload.js
     * @param {String} sResourcePath the resource path
     */
    function fnPreloadFlpComponent (sResourcePath) {
        fnLoadScript(sResourcePath + "/sap/ushell/components/flp/Component-preload.js", null, null, true);
    }

    /**
     * Preload the sap/fiori/flp-controls.js
     * @param {String} sResourcePath the resource path
     */
    function fnPreloadFlpControls (sResourcePath) {
        fnLoadScript(sResourcePath + "/sap/fiori/flp-controls.js", null, null, true).then(function () {
            sap.ui.predefine("sap/fiori/flp-controls", function () {}, false); //Workaround to set that bundle is loaded
        });
    }

    /**
     * Preload sap/fiori/flp-controls.js and flp/Component-preload.js
     * @param {String} sResourcePath the resource path
     */
    function fnPreloadHomeBundle (sResourcePath) {
        fnPreloadFlpControls(sResourcePath);
        fnPreloadFlpComponent(sResourcePath);
    }

    return {
        fnPreloadFlpComponent: fnPreloadFlpComponent,
        fnPreloadFlpControls: fnPreloadFlpControls,
        fnPreloadHomeBundle: fnPreloadHomeBundle
    };

});