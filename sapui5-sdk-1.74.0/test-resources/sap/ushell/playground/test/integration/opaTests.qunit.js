/* global QUnit */
QUnit.config.autoStart = false;

sap.ui.getCore().attachInit(function () {
    "use strict";
    sap.ui.require([
        "ControlPlaygrounds/test/integration/AllJourneys"
    ], function () {
        QUnit.start();
    });
});
