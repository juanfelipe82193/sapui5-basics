// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.AppLifeCyclejs
 */
sap.ui.require([
    "sap/ushell/components/applicationIntegration/Storage",
    "sap/ushell/test/utils",
    "sap/ushell/services/Container",
    "sap/ushell/Config"
], function (Storage) {
    "use strict";

    //jQuery.sap.require("sap.ushell.components.applicationIntegration.Storage");

    module("sap.ushell.components.applicationIntegration.Storage", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        setup: function () {
        },

        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {

        }
    });


    QUnit.test("#check eviction:", function (assert) {
        [
            {
                aElemList: [
                    {
                        appId: 1
                    }, {
                        appId: 2
                    },
                    {
                        appId: 3
                    },
                    {
                        appId: 4
                    }
                ],
                aEvicList: [
                    {
                        appId: 1
                    }
                ],
                description: "check single eviction:"
            },
            {
                aElemList: [
                    {
                        appId: 1
                    },
                    {
                        appId: 2
                    },
                    {
                        appId: 3
                    },
                    {
                        appId: 4
                    },
                    {
                        appId: 5
                    }, {
                        appId: 6
                    },
                    {
                        appId: 7
                    },
                    {
                        appId: 8
                    }
                ],
                aEvicList: [
                    {
                        appId: 1
                    },
                    {
                        appId: 2
                    },
                    {
                        appId: 3
                    },
                    {
                        appId: 4
                    },
                    {
                        appId: 5
                    }
                ],
                description: "more then one eviction:"
            },
            {
                aElemList: [
                    {
                        appId: 1
                    },
                    {
                        appId: 2
                    },
                    {
                        appId: 1
                    },
                    {
                        appId: 3
                    },
                    {
                        appId: 1
                    },
                    {
                        appId: 4
                    },
                    {
                        appId: 1
                    },
                    {
                        appId: 5
                    }
                ],
                aEvicList: [
                    {
                        appId: 2
                    },
                    {
                        appId: 3
                    }
                ],
                description: "appId 1: reuse:"
            }

        ].forEach(function (oFixture) {
            //Init storage
            var aElemList = oFixture.aElemList,
                aEvicList = oFixture.aEvicList,
                iCountEvictions = 0,
                iExpectedEvictions = aEvicList.length;

            Storage.init(3, function (evictObj) {
                var oCacheEntry = evictObj.value,
                    oEcpEvict = aEvicList.shift();
                iCountEvictions++;
                ok(evictObj.value.appId === oEcpEvict.appId, oFixture.description + "check evictied object [" + evictObj.value.appId + "] but expecting [" + oEcpEvict.appId + "]");
            }.bind(this));

            while (aElemList.length > 0) {
                var oElem = aElemList.shift();
                Storage.set(oElem.appId, oElem);
            }

            ok(iExpectedEvictions===iCountEvictions, oFixture.description+" check total number of evictions expecting [" + iExpectedEvictions  + "] eviction but recived [" + iCountEvictions + "] eviction.");

        });
    });
});
