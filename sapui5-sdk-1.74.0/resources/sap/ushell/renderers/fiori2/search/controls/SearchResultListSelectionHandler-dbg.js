// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sap */

sap.ui.define([
    'sap/ui/base/Object'
], function () {
    "use strict";

    return sap.ui.base.Object.extend("sap.ushell.renderers.fiori2.search.controls.SearchResultListSelectionHandler", {

        isMultiSelectionAvailable: function (dataSource) {
            return false;
        },

        actionsForDataSource: function (dataSource) {
            return [];
        }
    });
});
