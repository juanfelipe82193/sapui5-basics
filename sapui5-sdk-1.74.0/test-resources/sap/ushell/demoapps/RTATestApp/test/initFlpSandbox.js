/* global Promise */
sap.ui.define([
    "../localService/mockserver",
    "./flpSandbox"
], function (mockserver, flpSandbox) {
    "use strict";

    var aInitializations = [];

    // initialize the mock server
    aInitializations.push(mockserver.init());
    aInitializations.push(flpSandbox.init());

    Promise.all(aInitializations);
});
