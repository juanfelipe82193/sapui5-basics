// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap*/

sap.ui.define([
    'sap/ushell/renderers/fiori2/search/userpref/SearchPrefsModel'
], function (SearchPrefsModel) {
    "use strict";

    // search preferences administration functions
    // =======================================================================
    var module = sap.ushell.renderers.fiori2.search.userpref.SearchPrefs = {};
    jQuery.extend(module, {

        model: new SearchPrefsModel(),

        getEntry: function () {
            return {
                title: sap.ushell.resources.i18n.getText('sp.userProfiling'),
                editable: true,
                isSearchPrefsActive: this.model.isSearchPrefsActive.bind(this.model),
                value: this.model.shortStatus.bind(this.model),
                onSave: this.model.savePreferences.bind(this.model),
                onCancel: this.model.cancelPreferences.bind(this.model),
                content: function () {
                    return this.model.asyncInit().then(function () {
                        var userProfilingView = sap.ui.view({
                            id: 'searchPrefsView',
                            type: sap.ui.core.mvc.ViewType.JS,
                            viewName: 'sap.ushell.renderers.fiori2.search.userpref.SearchPrefsDialog'
                        });
                        userProfilingView.setModel(this.model);
                        return userProfilingView;
                    }.bind(this));
                }.bind(this)
            };
        }
    });
    return module;
});
