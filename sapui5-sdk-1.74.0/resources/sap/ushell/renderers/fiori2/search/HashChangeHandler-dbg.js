// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global jQuery, sap, window */

// trach navivigation
sap.ui.define([
    'sap/ushell/renderers/fiori2/search/SearchModel',
    'sap/ushell/renderers/fiori2/search/SearchHelper'
], function (SearchModel, SearchHelper) {
    "use strict";

    // model class for track navigation
    // =======================================================================
    var module = sap.ushell.renderers.fiori2.search.HashChangeHandler = {};
    jQuery.extend(module, {

        handle: function (hashChangeInfo) {
            if (!SearchHelper.isLoggingEnabled()) {
                return;
            }

            var that = this;

            that.sourceUrlArray = [];
            if (hashChangeInfo.oldShellHash !== null) {
                that.sourceUrlArray.push(hashChangeInfo.oldShellHash);
            }
            if (hashChangeInfo.oldAppSpecificRoute !== null) {
                if (hashChangeInfo.oldAppSpecificRoute.substring(0, 2) === "&/") {
                    // remove first special parameter indicator "&/"
                    that.sourceUrlArray.push(hashChangeInfo.oldAppSpecificRoute.substring(2));
                } else {
                    that.sourceUrlArray.push(hashChangeInfo.oldAppSpecificRoute);
                }
            }

            that._createSearchModel().then(function () {
                var event = {
                    type: "ITEM_NAVIGATE",
                    sourceUrlArray: this.sourceUrlArray,
                    targetUrl: "#" + hashChangeInfo.newShellHash,
                    systemAndClient: this._getSID()
                };
                if (event.targetUrl.indexOf("=") !== -1) {
                    this.searchModel.sinaNext.logUserEvent(event);
                }

            }.bind(this));
        },

        _createSearchModel: function () {
            var that = this;
            if (that.initializedDeferred) {
                return that.initializedDeferred;
            }

            // get search model and call init
            that.searchModel = sap.ushell.renderers.fiori2.search.getModelSingleton();
            that.initializedDeferred = that.searchModel.initBusinessObjSearch();
            return that.initializedDeferred;
        },

        _getSID: function () {
            // extract System and Client from sap-system=sid(BE1.001)
            var systemAndClient = {
                "systemId": "",
                "client": ""
            };
            var url = window.location.href;
            var systemBegin = url.indexOf("sap-system=sid(");

            if (systemBegin !== -1) {
                var systemEnd = url.substring(systemBegin).indexOf(")");
                if (systemEnd !== -1) {
                    var systemInUrl = url.substring(systemBegin + 15, systemBegin + systemEnd);
                    if (systemInUrl.split(".").length === 2) {
                        systemAndClient.systemId = systemInUrl.split(".")[0];
                        systemAndClient.client = systemInUrl.split(".")[1];
                    }
                }
            }
            return systemAndClient;
        }

    });
    return module;
});
