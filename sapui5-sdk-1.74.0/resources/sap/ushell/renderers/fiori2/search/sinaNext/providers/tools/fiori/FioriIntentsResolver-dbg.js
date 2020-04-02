// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */

sinaDefine([
    '../../../sina/SinaObject',
    './NavigationTargetForIntent'
], function (SinaObject, NavigationTargetForIntent) {
    "use strict";

    return SinaObject.derive({

        _init: function () {
            if (typeof sap !== "undefined" && sap.ushell && sap.ushell.Container) {
                this._launchpadNavigation = sap.ushell.Container.getService("SmartNavigation") || sap.ushell.Container.getService("CrossApplicationNavigation");
                this._fioriFrontendSystemInfo = {
                    systemId: sap.ushell.Container.getLogonSystem().getName(),
                    client: sap.ushell.Container.getLogonSystem().getClient()
                };
                this._primaryIntentAction = "-displayFactSheet";
                this._suppressInSearchTag = "suppressInEnterpriseSearch".toLowerCase();
            }
        },


        /**
         * Resolves the given semantic object and semantic attributes to a list of
         * sap.ushell.renderers.fiori2.search.sinaNext.sina.sina.fiori.NavigationTargetForIntent
         * objects.
         *
         * @param {object|object[]} [vArgs]
         *   An object containing nominal arguments for the method, having the
         *   following structure:
         *   <pre>
         *   {
         *      semanticObjectType: "String",    // semantic object name
         *
         *      semanticObjectTypeAttributes: {  // semantic attributes
         *         A: "B",
         *         C: ["e", "j"]
         *      },
         *
         *      systemId: "String",              // optional: SID of system where the object data is hosted
         *      client: "String",                // optional: client of system where the object data is hosted
         *
         *      fallbackDefaultNavigationTarget: "sap.ushell.renderers.fiori2.search.sinaNext.sina.sina.NavigationTarget",
         *                                       // optional: fallback navigation target
         *   </pre>
         *
         *   This method supports a mass invocation interface to obtain multiple results
         *   with a single call. In this case the method expects an array of objects which
         *   have the same structure as described above.
         *   </pre>
         *
         * @returns {jQuery.Deferred.promise}
         *   A promise that resolves with an object that has the following structure:
         *   <pre>
         *   {
         *      defaultNavigationTarget: sap.ushell.renderers.fiori2.search.sinaNext.sina.sina.NavigationTarget    //optional
         *      navigationTargets: [ sap.ushell.renderers.fiori2.search.sinaNext.sina.sina.NavigationTarget ]   //optional
         *   }
         *   </pre>
         *
         *   <p>
         *   NOTE: in case the mass invocation interface is used the promise will resolve
         *   to an array of objects which have the same structure as described above. The
         *   objects in the returned array will be in the same order as the corresponding
         *   objects were in the input array.
         *   </p>
         *
         * @public
         */
        resolveIntents: function (vArgs) {
            var that = this;

            if (!that._launchpadNavigation || !vArgs) {
                return Promise.resolve({
                    defaultNavigationTarget: vArgs.fallbackDefaultNavigationTarget
                });
            }

            if (Array.isArray(vArgs)) {
                var proms = [];
                for (var k = 0; k < vArgs.length; k++) {
                    var prom = that._doResolveIntents(vArgs[k]);
                    proms.push(prom);
                }
                return Promise.all(proms);
            }
            return that._doResolveIntents(vArgs);

        },

        _doResolveIntents: function (vArgs) {
            var that = this;

            var semanticObjectType = vArgs.semanticObjectType;
            var semanticObjectTypeAttrs = vArgs.semanticObjectTypeAttributes;
            var systemId = vArgs.systemId;
            var client = vArgs.client;
            var fallbackDefaultNavigationTarget = vArgs.fallbackDefaultNavigationTarget;

            if (!semanticObjectType || semanticObjectType.length === 0) {
                return Promise.resolve({
                    defaultNavigationTarget: fallbackDefaultNavigationTarget
                });
            }

            if (!semanticObjectTypeAttrs || semanticObjectTypeAttrs.length === 0) {
                return Promise.resolve();
            }

            var semanticObjectTypeAttrsAsParams = {};
            var value;
            for (var i = 0; i < semanticObjectTypeAttrs.length; i++) {
                value = this.convertAttributeValueToUI5DataTypeFormats(semanticObjectTypeAttrs[i].value, semanticObjectTypeAttrs[i].type);
                semanticObjectTypeAttrsAsParams[semanticObjectTypeAttrs[i].name] = value;
            }

            var sapSystem = {};
            sapSystem.systemId = systemId || (that._fioriFrontendSystemInfo && that._fioriFrontendSystemInfo.systemId);
            sapSystem.client = client || (that._fioriFrontendSystemInfo.client && that._fioriFrontendSystemInfo.client);

            // Set sap-system parameter if:
            // 1) systemId or client from search response are not undefined or empty
            // 2) fioriFrontendSystemInfo is *NOT* set
            // 3) fioriFrontendSystemInfo is set, but it contains different systemId and client info than the search response
            if (systemId && systemId.trim().length > 0 && client && client.trim().length > 0 && // 1)
                (!that._fioriFrontendSystemInfo || // 2)
                    !(that._fioriFrontendSystemInfo.systemId === systemId && that._fioriFrontendSystemInfo.client === client))) { // 3)
                sapSystem.urlParameter = "sap-system=sid(" + systemId + "." + client + ")";
            }

            var primaryIntentProm = new Promise(function (resolve, reject) {
                if (that._launchpadNavigation.getPrimaryIntent) {
                    that._launchpadNavigation.getPrimaryIntent(semanticObjectType, semanticObjectTypeAttrsAsParams).done(function (primaryIntent) {
                        resolve(primaryIntent);
                    }).fail(function () {
                        resolve();
                    });
                } else {
                    resolve();
                }
            });

            var intentsOuterProm = new Promise(function (resolve, reject) {
                var intentsProm;
                if (that._launchpadNavigation.getLinks) {
                    intentsProm = that._launchpadNavigation.getLinks({
                        semanticObject: semanticObjectType,
                        params: semanticObjectTypeAttrsAsParams,
                        withAtLeastOneUsedParam: true,
                        sortResultOnTexts: true
                    });
                } else {
                    intentsProm = that._launchpadNavigation.getSemanticObjectLinks(semanticObjectType, semanticObjectTypeAttrsAsParams);
                }
                intentsProm.done(function (intents) {
                    resolve(intents);
                }).fail(function () {
                    resolve();
                });
            });

            return Promise.all([primaryIntentProm, intentsOuterProm]).then(function (values) {

                var i;
                var primaryIntent = values[0];
                var intent, intents = values[1];
                var navigationTarget;

                var result = {};

                var defaultNavigationTarget;
                if (primaryIntent && !that._shallIntentBeSuppressed(primaryIntent)) {
                    defaultNavigationTarget = that._getNavigationTargetForIntent(primaryIntent, sapSystem);
                    result.defaultNavigationTarget = defaultNavigationTarget;
                }

                var foundPrimaryIntent = result.defaultNavigationTarget !== undefined;

                result.navigationTargets = [];

                if (intents) {
                    for (i = 0; i < intents.length; i++) {
                        intent = intents[i];

                        if (that._shallIntentBeSuppressed(intent)) {
                            continue;
                        }

                        navigationTarget = that._getNavigationTargetForIntent(intent, sapSystem);

                        if (!foundPrimaryIntent && intent.intent.substring(intent.intent.indexOf("-"), intent.intent.indexOf("?")) === that._primaryIntentAction) {
                            result.defaultNavigationTarget = navigationTarget;
                            foundPrimaryIntent = true;
                        } else if (!defaultNavigationTarget || !navigationTarget.isEqualTo(defaultNavigationTarget)) {
                            result.navigationTargets.push(navigationTarget);
                        }
                    }
                }

                return result;
            });
        },

        _shallIntentBeSuppressed: function (intent) {
            if (intent.tags) {
                for (var i = 0; i < intent.tags.length; i++) {
                    if (intent.tags[i].toLowerCase() === this._suppressInSearchTag) {
                        return true;
                    }
                }
            }
            return false;
        },

        _getNavigationTargetForIntent: function (intent, sapSystem) {
            var that = this;

            var shellHash = intent.intent;

            if (sapSystem.urlParameter) {
                if (shellHash.indexOf('?') === -1) {
                    shellHash += "?";
                } else {
                    shellHash += "&";
                }
                shellHash += sapSystem.urlParameter;
            }

            var externalTarget = {
                target: {
                    shellHash: shellHash
                }
            };
            var externalHash = that._launchpadNavigation.hrefForExternal(externalTarget);

            var navigationObject = that.sina._createNavigationTargetForIntent({
                label: intent.text,
                targetUrl: externalHash,
                externalTarget: externalTarget,
                systemId: sapSystem.systemId,
                client: sapSystem.client
            });

            return navigationObject;
        },

        convertAttributeValueToUI5DataTypeFormats: function (value, sinaAttributeType) {
            var year, month, day, hour, minute, seconds, microseconds;
            switch (sinaAttributeType) {
            case this.sina.AttributeType.Timestamp:
                // sina: JavaScript Date object
                // UI5: "YYYY-MM-DDTHH:MM:SS.mmm"
                year = value.getUTCFullYear();
                month = value.getUTCMonth() + 1;
                day = value.getUTCDate();
                hour = value.getUTCHours();
                minute = value.getUTCMinutes();
                seconds = value.getUTCSeconds();
                microseconds = value.getUTCMilliseconds() * 1000;

                value =
                    this.addLeadingZeros(year.toString(), 4) + '-' +
                    this.addLeadingZeros(month.toString(), 2) + '-' +
                    this.addLeadingZeros(day.toString(), 2) + 'T' +
                    this.addLeadingZeros(hour.toString(), 2) + ':' +
                    this.addLeadingZeros(minute.toString(), 2) + ':' +
                    this.addLeadingZeros(seconds.toString(), 2) + '.' +
                    this.addLeadingZeros(microseconds.toString(), 3);
                break;
            case this.sina.AttributeType.Date:
                // sina: JavaScript Date object
                // UI5: "YYYY-MM-DD"
                value = value.slice(0, 4) + '-' + value.slice(5, 7) + '-' + value.slice(8, 10);
                break;
            }
            return value;
        },

        addLeadingZeros: function (value, length) {
            return '00000000000000'.slice(0, length - value.length) + value;
        }
    });
});
