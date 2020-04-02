// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap */

sap.ui.define([], function () {
    "use strict";

    // =======================================================================
    // declare package
    // =======================================================================
    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.eventlogging.EventConsumer');

    // =======================================================================
    // EventConsumer (base class for all consumers)
    // =======================================================================
    var module = sap.ushell.renderers.fiori2.search.eventlogging.EventConsumer = function () {
        this.init.apply(this, arguments);
    };

    module.prototype = {

        init: function () {

        },

        logEvent: function (event) {
            // to be implemented in subclass
        }

    };

    return module;
});
