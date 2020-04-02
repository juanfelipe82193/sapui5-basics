// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap */

sap.ui.define([], function () {
    "use strict";

    // =======================================================================
    // declare package
    // =======================================================================
    jQuery.sap.declare('sap.ushell.renderers.fiori2.search.suggestions.SuggestionTypeProps');
    var module = sap.ushell.renderers.fiori2.search.suggestions.SuggestionTypeProps = {};

    // =======================================================================
    // constants for suggestion types
    // =======================================================================
    module.App = 'App';
    module.DataSource = 'DataSource';
    module.SearchTermHistory = 'SearchTermHistory';
    module.SearchTermData = 'SearchTermData';
    module.Object = 'Object';
    module.Header = 'Header'; // section header
    module.BusyIndicator = 'BusyIndicator'; // busy indicator entry

    // =======================================================================
    // list of all suggestion types
    // =======================================================================
    module.types = [module.App, module.DataSource, module.SearchTermHistory, module.SearchTermData, module.Object];

    // =======================================================================
    // properties of suggestion types
    // =======================================================================
    module.properties = {
        App: {
            position: 100, // TODO sinaNext check values
            limitDsAll: 3,
            limit: 7 // Ds=Apps
        },
        DataSource: {
            position: 200,
            limitDsAll: 2,
            limit: 2
        },
        SearchTermHistory: {
            position: 400,
            limitDsAll: 7,
            limit: 5
        },
        SearchTermData: {
            position: 400,
            limitDsAll: 7,
            limit: 5
        },
        Object: {
            position: 300,
            limitDsAll: 3,
            limit: 5
        },
        BusyIndicator: {
            position: 900
        }
    };

    return module;
});
