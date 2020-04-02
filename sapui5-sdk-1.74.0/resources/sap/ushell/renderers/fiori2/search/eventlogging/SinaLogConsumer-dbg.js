// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap */

sap.ui.define([
    'sap/ushell/renderers/fiori2/search/eventlogging/EventConsumer'
], function (EventConsumer) {
    "use strict";

    // =======================================================================
    // declare package
    // =======================================================================
    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.eventlogging.SinaLogConsumer');

    // =======================================================================
    // SinaLogConsumer
    // =======================================================================
    var module = sap.ushell.renderers.fiori2.search.eventlogging.SinaLogConsumer = function () {
        this.init.apply(this, arguments);
    };

    module.prototype = jQuery.extend(new EventConsumer(), {

        init: function (sinaNext) {
            this.sinaNext = sinaNext;
        },

        logEvent: function (event) {
            this.sinaNext.logUserEvent(event);
        }

    });

    return module;
});
