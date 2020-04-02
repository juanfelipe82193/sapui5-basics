// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../../sina/NavigationTarget'], function (NavigationTarget) {
    "use strict";

    var _oCrossAppNav;
    if (typeof sap !== "undefined" && sap.ushell && sap.ushell.Container) {
        _oCrossAppNav = (sap.ushell.Container.getService("SmartNavigation") || sap.ushell.Container.getService("CrossApplicationNavigation"));
    }

    return NavigationTarget.derive({

        _meta: {
            properties: {
                externalTarget: {
                    required: true
                },
                systemId: {
                    required: false
                },
                client: {
                    required: false
                }
            }
        },

        performNavigation: function (params) {
            params = params || {};
            var suppressTracking = params.suppressTracking || false;
            var trackingOnly = params.trackingOnly || false;
            if (_oCrossAppNav) {
                if (!suppressTracking) {
                    this._trackNavigation();
                }
                if (!trackingOnly) {
                    _oCrossAppNav.toExternal(this.externalTarget);
                }
            } else {
                NavigationTarget.prototype.performNavigation.apply(this, arguments);
            }
        },

        _trackNavigation: function () {
            if (_oCrossAppNav && _oCrossAppNav.trackNavigation) {
                _oCrossAppNav.trackNavigation({
                    target: this.externalTarget.target
                });
            }
        }
    });
});
