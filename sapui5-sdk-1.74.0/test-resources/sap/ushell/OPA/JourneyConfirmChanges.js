// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/Opa5",
    "./arrangements/Setup",
    "./arrangements/Teardown",
    "./tests/homepage/journeys/ConfirmChanges"
], function (Opa5, Setup, Teardown) {
    "use strict";

    Opa5.extendConfig({
        arrangements: new Setup(),
        assertions: new Teardown(),
        autoWait: true,
        timeout: 30,
        asyncPolling: true,
        viewNamespace: "sap.ushell.applications.PageComposer.view."
    });

    /* global QUnit */
    QUnit.start();
});