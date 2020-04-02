// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sap */

// no prefs request when adding entry
// only single sina get server info request in fail case
// mathias: dataType:'text'
sap.ui.define([
    'sap/ui/model/json/JSONModel',
    'sap/ushell/renderers/fiori2/search/SearchModel',
    'sap/ushell/renderers/fiori2/search/SearchConfiguration',
    'sap/ushell/renderers/fiori2/search/SearchHelper'
], function (JSONModel, SearchModel, SearchConfiguration, SearchHelper) {
    "use strict";

    // model class for search preferences view
    // =======================================================================
    var path = 'sap.ushell.renderers.fiori2.search.userpref.SearchPrefsModel';
    return sap.ui.model.json.JSONModel.extend(path, {

        asyncInit: function () {

            // check cache
            var that = this;
            if (that.initializedDeferred) {
                return that.initializedDeferred;
            }

            // get search model and call init
            that.searchModel = sap.ushell.renderers.fiori2.search.getModelSingleton();
            that.initializedDeferred = that.searchModel.initBusinessObjSearch().then(function () {
                if (!that.searchModel.config.searchBusinessObjects) {
                    that.setProperty('/searchPrefsActive', false);
                    that.setProperty('/personalizedSearch', false);
                    that.setProperty('/resetButtonWasClicked', false);
                    return undefined;
                }
                var sinaNext = that.searchModel.sinaNext;
                return SearchHelper.convertPromiseTojQueryDeferred(sinaNext.getConfigurationAsync({
                    forceReload: true
                })).then(function (configuration) {
                    that.configuration = configuration;
                    that.setProperty('/searchPrefsActive', configuration.isPersonalizedSearchEditable);
                    that.setProperty('/personalizedSearch', configuration.personalizedSearch);
                    that.setProperty('/resetButtonWasClicked', false);
                });
            });
            return that.initializedDeferred;

        },

        reload: function () {
            this.initializedDeferred = false;
            return this.asyncInit();
        },

        shortStatus: function () {
            return this.asyncInit().then(function () {
                return this.getProperty('/personalizedSearch') ? sap.ushell.resources.i18n.getText('sp.on') : sap.ushell.resources.i18n.getText('sp.off');
            }.bind(this));
        },

        isSearchPrefsActive: function () {
            return this.asyncInit().then(function () {
                return this.getProperty('/searchPrefsActive');
            }.bind(this));
        },

        savePreferences: function () {
            this.configuration.setPersonalizedSearch(this.getProperty('/personalizedSearch'));
            return SearchHelper.convertPromiseTojQueryDeferred(this.configuration.saveAsync()).then(function () {
                this.setProperty('/resetButtonWasClicked', false);
            }.bind(this));
        },

        cancelPreferences: function () {
            this.setProperty('/personalizedSearch', this.configuration.personalizedSearch);
            this.setProperty('/resetButtonWasClicked', false);
        },

        resetProfile: function () {
            return SearchHelper.convertPromiseTojQueryDeferred(this.configuration.resetPersonalizedSearchDataAsync()).then(function () {
                this.setProperty('/resetButtonWasClicked', true);
            }.bind(this));
        }

    });

});
