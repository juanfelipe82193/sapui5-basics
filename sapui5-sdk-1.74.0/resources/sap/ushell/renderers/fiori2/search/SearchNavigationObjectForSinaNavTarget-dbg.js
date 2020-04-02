// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sap */

sap.ui.define([
    'sap/ushell/renderers/fiori2/search/SearchNavigationObject'
], function (SearchNavigationObject) {
    "use strict";

    return SearchNavigationObject.extend("sap.ushell.renderers.fiori2.search.SearchNavigationObjectForSinaNavTarget", {

        constructor: function (sinaNavigationTarget) {
            SearchNavigationObject.prototype.constructor.apply(this, arguments);
            this._sinaNavigationTarget = sinaNavigationTarget;
            this.setHref(sinaNavigationTarget.targetUrl);
            this.setText(sinaNavigationTarget.label);
            this.setTarget(sinaNavigationTarget.target);
            this.sina = this._sinaNavigationTarget.sina;
        },

        performNavigation: function (properties) {
            this.trackNavigation();
            this._sinaNavigationTarget.performNavigation(properties);
        },

        getResultSet: function () {
            return this.getResultSetItem().parent;
        },

        getResultSetItem: function () {
            var parent = this._sinaNavigationTarget.parent;
            if (parent instanceof this.sina.SearchResultSetItemAttribute) {
                // navigation target on attribute level -> parent is SearchResultSetItem
                parent = parent.parent;
            }
            if (!(parent instanceof this.sina.SearchResultSetItem)) {
                throw 'programm error';
            }
            if (parent.parent instanceof this.sina.ObjectSuggestion) {
                // for object suggestions: item = object suggestion
                parent = parent.parent;
            }
            return parent;
        },

        getResultSetId: function () {
            return this.getResultSet().id;
        },

        getPositionInList: function () {
            var resultSet = this.getResultSet();
            var resultSetItem = this.getResultSetItem();
            return resultSet.items.indexOf(resultSetItem);
        }

    });
});
