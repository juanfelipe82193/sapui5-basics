// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/Opa5",
    "./arrangements/Setup",
    "./arrangements/Teardown",

    // include journeys here so that they get executed
    "./tests/header/journeys/MeArea"
], function (Opa5, Setup, Teardown) {
    "use strict";

    Opa5.extendConfig({
        arrangements: new Setup(),
        assertions: new Teardown(),
        autoWait: true,
        timeout: 120,
        asyncPolling: true
    });

    /* global QUnit */
    QUnit.start();
});