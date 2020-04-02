// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.SmartNavigation service.
 */

/* global sap, jQuery, QUnit, sinon */

( function ( sap, jQuery, QUnit, sinon ) {
    "use strict";

    jQuery.sap.require( "sap.ushell.services.Container" );
    sap.ushell.bootstrap( "local" ).then(function () {

    sap.ui.require(
        [
            "sap/ushell/services/AppConfiguration",
            "sap/ushell/services/SmartNavigation",
            "sap/ushell/services/_SmartNavigation/complements",
            "sap/ushell/test/utils"
        ],
        function ( oAppConfiguration, SmartNavigation, oSmartNavPrivate, testUtils ) {

            var oCrossAppNav, oPersonalizationStore,
                oContainer = sap.ushell.Container,
                oSmartNavigation = new SmartNavigation(null, null, {config: {isTrackingEnabled: true}});


            QUnit.module(
                "SmartNavigation with tracking",
                {
                    beforeEach: function () {
                        var sCurrentAppHash;

                        sCurrentAppHash = "Action-totest" + Date.now();

                        oCrossAppNav = oContainer.getService( "CrossApplicationNavigation" );
                        oPersonalizationStore = oContainer.getService( "Personalization" );

                        sinon.stub( oCrossAppNav, "getLinks", function ( oQuery ) {

                            // Watered-down implementation that does not
                            // consider parameters and other attributes in
                            // the query, since we can rely on the quality
                            // of CrossApplicationNavigation.

                            var aLinks;

                            if ( oQuery ) {
                                aLinks = getAllLinks().filter( function ( oLink ) {
                                    var yes = true;

                                    if ( oQuery.semanticObject ) {
                                        yes = yes && oLink.intent.indexOf( "#" + oQuery.semanticObject + "-" ) === 0;
                                    }

                                    if ( oQuery.action ) {
                                        yes = yes && oLink.intent.endsWith( oQuery.action );
                                    }

                                    return yes;
                                });
                            } else {
                                aLinks = getAllLinks();
                            }

                            return jQuery.when( aLinks );
                        });
                        sinon.stub( oCrossAppNav, "toExternal" );
                        sinon.stub( oCrossAppNav, "hrefForExternal" );

                        sinon.stub( oAppConfiguration, "getCurrentApplication", function () {
                            return {
                                sShellHash: sCurrentAppHash,
                                componentHandle: {
                                    getInstance: function () {
                                        return { };
                                    }
                                }
                            };
                        } );
                    },
                    afterEach: function () {
                        [
                            oCrossAppNav.getLinks,
                            oCrossAppNav.toExternal,
                            oCrossAppNav.hrefForExternal,
                            oAppConfiguration.getCurrentApplication,
                            oPersonalizationStore.getContainer
                        ].forEach( function ( method ) {
                            method.restore && method.restore();
                        });
                    }
                }
            );

            if (!String.prototype.endsWith) {
                String.prototype.endsWith = function(pattern) {
                    var d = this.length - pattern.length;
                    return d >= 0 && this.lastIndexOf(pattern) === d;
                };
            }

            QUnit.test(
                "Service construction using sap.ushell.Container.getService(\"SmartNavigation\")",
                function ( assert ) {
                    var oServiceInstance = sap.ushell.Container.getService( "SmartNavigation" );

                    assert.ok( oServiceInstance, "Service instance can be constructed using sap.ushell.Container.getService( \"SmartNavigation\" )" );
                }
            );

            QUnit.test( "#getLinks()", function ( assert ) {
                var aFinished;
                var done = assert.async();

                // Arrange
                sinon.stub( oPersonalizationStore, "getContainer", function () {
                    var oContainer = {};

                    return jQuery.when( {
                        save: function () {
                            /* no op */
                        },
                        getItemKeys: function () {
                            return Object.keys( oContainer );
                        },
                        getItemValue: function ( sKey ) {
                            return oContainer[ sKey ];
                        },
                        setItemValue: function ( sKey, vValue ) {
                            oContainer[ sKey ] = vValue;
                        }
                    });
                });
                aFinished = [
                    {
                        description: "When called without a query argument and given that no tracking has ever occurred, returns same items as CrossApplicationNavigation#getLinks() and in same order",
                        input: {
                            oQuery: null
                        },
                        expected: {
                            links: getAllLinks()
                        }
                    },
                    {
                        description: "When called with an oQuery argument and given that no tracking has ever occurred, returns same items as CrossApplicationNavigation#getLinks(oQuery) and in same order",
                        input: {
                            oQuery: {
                                semanticObject: "Action"
                            }
                        },
                        expected: {
                            links: getAllLinks().filter( function ( oLink ) {
                                return oLink.intent.indexOf( "#Action-" ) === 0;
                            })
                        }
                    }
                ].map( function ( oFixture ) {
                    // Act
                    return oSmartNavigation.getLinks( oFixture.input.oQuery )
                        // Assert
                        .then( function ( oActualLinks ) {
                            assert.deepEqual(
                                oActualLinks,
                                oFixture.expected.links,
                                oFixture.description
                            );
                        });
                });

                // Assert
                jQuery.when.apply( jQuery, aFinished )
                    .then( function () {
                        assert.deepEqual(
                            oCrossAppNav.getLinks.callCount,
                            aFinished.length,
                            "CrossApplicationNavigation#getLinks() was called as many times as expected for all assertions"
                        );
                    })
                    .then( done, done );
            });

            QUnit.test( "#toExternal()", function ( assert ) {
                var done = assert.async();

                // Arrange
                sinon.stub( oSmartNavPrivate, "recordNavigationOccurrences", function () {
                    return jQuery.when();
                });

                oSmartNavigation
                    // Act
                    .toExternal( {
                        target: { shellHash: "#Action-toappcontextsample" }
                    })
                    // Assert
                    .then( function () {
                        return assert.ok(
                            oCrossAppNav.toExternal.calledOnce,
                            "Call to toExternal() eventually calls CrossApplicationNavigation#toExternal()"
                        );
                    })
                    .then( function () {
                        oSmartNavPrivate.recordNavigationOccurrences.restore();
                    })
                    .then( done, done );
            });
            [
                {
                    testDescription: "Shell hash is not a valid intent",
                    testFlavour: "shell hash",
                    target: { shellHash: "www.foo.bar" }
                },
                {
                    testDescription: "Semantic Object only is not a valid intent",
                    testFlavour: "semantic object only",
                    target: { semanticObject: "foo" }
                }
            ].forEach( function ( oElem ) {
                QUnit.test( "#toExternal() " + oElem.testDescription, function ( assert ) {

                    sinon.stub( jQuery.sap.log, "warning" );

                    var done = assert.async();
                    oSmartNavigation
                        .toExternal( { target: oElem.target })
                        .then( function () {
                            assert.ok(
                                jQuery.sap.log.warning.calledOnce,
                                "Logged the warning out as " + oElem.testFlavour + " is not set correctly"
                            );

                            assert.ok(
                                oCrossAppNav.toExternal.calledOnce,
                                "Still called the CrossAppNav service to handle the error"
                            );
                            jQuery.sap.log.warning.restore();

                        })
                        .then( done, done );
                });
            });

            QUnit.test( "#hrefForExternal()", function ( assert ) {
                oSmartNavigation.hrefForExternal( {
                    target: { shellHash: "#Action-toappcontextsample" }
                });

                assert.ok(
                    oCrossAppNav.hrefForExternal.calledOnce,
                    "Call to hrefForExternal() eventually calls CrossApplicationNavigation#hrefForExternal()"
                );
            });

            [
                {
                    testDescription: "destinationShellHash is valid",
                    oTarget: { shellHash: "Action-nosysNonwrappedTR" }
                },
                {
                    testDescription: "destinationShellHash with parameters is valid",
                    oTarget: { shellHash: "Action-nosysNonwrappedTR?foo=bar" }
                },
                {
                    testDescription: "Destination is just a string",
                    oTarget: "SomeString",
                    expectedErrorMessage: "Navigation not tracked - no valid destination provided"
                },
                {
                    testDescription: "destinationShellHash is not a valid intent",
                    oTarget: { shellHash: "www.google.com" },
                    expectedErrorMessage: "Navigation not tracked - no valid destination provided"
                },
                {
                    testDescription: "there is no destinationShellHash",
                    oTarget: undefined,
                    expectedErrorMessage: "Navigation not tracked - no valid destination provided"
                },
                {
                    testDescription: "no shellHash and only SemanticObject provided",
                    oTarget: { semanticObject: "notOk" },
                    expectedErrorMessage: "Navigation not tracked - no valid destination provided"
                },
                {
                    testDescription: "no shellHash and only Action provided",
                    oTarget: { action: "notOk" },
                    expectedErrorMessage: "Navigation not tracked - no valid destination provided"
                }
            ].forEach( function ( oFixture ) {
                QUnit.test( "#trackNavigation() : when "
                    + oFixture.testDescription, function ( assert ) {

                        var done = assert.async();

                        sinon.stub( jQuery.sap.log, "warning" );
                        sinon.stub(
                            oSmartNavPrivate,
                            "recordNavigationOccurrences",
                            function () {
                                return jQuery.when();
                            }
                        );

                        oSmartNavigation
                            // Act
                            .trackNavigation( { target: oFixture.oTarget })
                            // Assert
                            .then( function ( oResult ) {

                                if ( oFixture.expectedErrorMessage ) {
                                    assert.strictEqual( jQuery.sap.log.warning.getCalls().length, 1,
                                        "jQuery.sap.log.warning was called 1 time" );

                                    assert.deepEqual( jQuery.sap.log.warning.getCall( 0 ).args, [
                                        oFixture.expectedErrorMessage,
                                        null,
                                        "sap.ushell.services.SmartNavigation"
                                    ], "jQuery.sap.log.warning was called with the expected arguments" );
                                } else {
                                    assert.strictEqual(
                                        jQuery.sap.log.warning.getCalls().length, 0,
                                        "Success"
                                    );
                                }
                            })
                            .then( function () {
                                oSmartNavPrivate.recordNavigationOccurrences.restore();
                                jQuery.sap.log.warning.restore();
                            })
                            .then( done, done );

                    });
            });

            QUnit.test(
                "The dependency of #getLinks() & #toExternal() on AppConfiguration#getCurrentApplication()#.sShellHash",
                function ( assert ) {
                    var done = assert.async();

                    // Arrange
                    oAppConfiguration.getCurrentApplication.restore();
                    sinon.stub(
                        oAppConfiguration,
                        "getCurrentApplication",
                        function () {
                            return {
                                componentHandle: {
                                    getInstance: function () {
                                        return { };
                                    }
                                }
                            };
                        }
                    );
                    sinon.stub( jQuery.sap.log, "warning" );

                    oSmartNavigation
                        // Act
                        .toExternal( {
                            target: {
                                semanticObject: "ShellHash",
                                action: "test"
                            }
                        })
                        .then( jQuery.when.bind( jQuery, oSmartNavigation.getLinks(), oCrossAppNav.getLinks() ) )
                        // Assert
                        .then( function ( aSmartLinks, aNormalLinks ) {
                            assert.deepEqual(
                                aSmartLinks,
                                aNormalLinks,
                                "When AppConfiguration#getCurrentApplication()#sShellHash"
                                + " is undefined, oSmartNavigation#getLinks() behaves"
                                + " exactly the same as oCrossAppNav#getLinks()"
                            );

                            assert.ok(
                                jQuery.sap.log.warning.calledTwice,
                                "Each time sShellHash is required but it's undefined, a warning is logged"
                            );
                        })
                        .then( done, done );
                }
            );

            QUnit.test(
                "The dependency of #getLinks() & #toExternal() on `AppConfiguration().#getCurrentApplication().#componentHandle`",
                function (assert) {
                    var done = assert.async();

                    // Arrange
                    oAppConfiguration.getCurrentApplication.restore();
                    sinon.stub(
                        oAppConfiguration,
                        "getCurrentApplication",
                        function () {
                            return {
                                componentHandle: null
                            };
                        }
                    );

                    jQuery
                        .when(oSmartNavigation.toExternal({
                            target: {
                                semanticObject: "ShellHash",
                                action: "test"
                            }
                        }), oSmartNavigation.getLinks())
                        .then(function () {
                            assert.ok(true, "when `AppConfiguration().#getCurrentApplication().#componentHandle` is falsy, it does not cause an error in #getLinks()");
                            assert.ok(true, "when `AppConfiguration().#getCurrentApplication().#componentHandle` is falsy, it does not cause an error in #toExternal()");
                        })
                        .then(done, done);
                }
            );

            QUnit.test(
                "Interaction between #getLinks() and #toExternal()",
                function ( assert ) {
                    var oNavigationsComplete;
                    var done = assert.async();
                    var aDestinationTargets = [
                        {
                            intent: "#SO-action7",
                            clickCount: 1
                        },
                        {
                            intent: "#SO-action5",
                            clickCount: 3
                        },
                        {
                            intent: "#SO-action2",
                            clickCount: 14
                        },
                        {
                            intent: "#SO-action3",
                            clickCount: 12
                        },
                        {
                            intent: "#SO-action4?one=1",
                            clickCount: 7
                        },
                        {
                            intent: "#SO-action0",
                            clickCount: 36
                        },
                        {
                            intent: "#SO-action6",
                            clickCount: 3
                        },
                        {
                            intent: "#SO-action1?two=2&/InAppView",
                            clickCount: 25
                        }
                    ];
                    var aExpectedOrderOfDestinationTargets = [
                        {
                            intent: "#SO-action0"
                        },
                        {
                            intent: "#SO-action1?two=2&/InAppView"
                        },
                        {
                            intent: "#SO-action2"
                        },
                        {
                            intent: "#SO-action3"
                        },
                        {
                            intent: "#SO-action4?one=1"
                        },
                        {
                            intent: "#SO-action5"
                        },
                        {
                            intent: "#SO-action6"
                        },
                        {
                            intent: "#SO-action7"
                        }
                    ];

                    sinon.stub( oPersonalizationStore, "getContainer", function () {
                        var oContainer = {};

                        return jQuery.when( {
                            save: function () {
                                /* no op */
                            },
                            getItemKeys: function () {
                                return Object.keys( oContainer );
                            },
                            getItemValue: function ( sKey ) {
                                return oContainer[ sKey ];
                            },
                            setItemValue: function ( sKey, vValue ) {
                                oContainer[ sKey ] = vValue;
                            }
                        });
                    });

                    oNavigationsComplete = aDestinationTargets
                        .reduce( function ( oAggregateCompletion, oDestinationTarget ) {
                            var oArg = {
                                target: { shellHash: oDestinationTarget.intent }
                            };
                            var iClickCount = oDestinationTarget.clickCount;

                            while ( iClickCount-- ) {
                                oAggregateCompletion = oAggregateCompletion
                                    .then( oSmartNavigation.toExternal.bind( null, oArg ) );
                            }

                            return oAggregateCompletion;
                        }, jQuery.when( null ) );

                    oNavigationsComplete
                        .then( function () {
                            return oSmartNavigation.getLinks( { semanticObject: "SO" });
                        })
                        .then( function ( aLinks ) {
                            var aActualTopLinks = aLinks
                                .slice( 0, aExpectedOrderOfDestinationTargets.length )
                                .map( function ( oLink ) {
                                    return {
                                        intent: oLink.intent
                                    };
                                });

                            assert.deepEqual(
                                aActualTopLinks,
                                aExpectedOrderOfDestinationTargets,
                                "Links are sorted based on the clickCount of "
                                + "navigation via SmartNavigation#toExternal() "
                                + "to their respective app"
                            );
                        })
                        .then( done, done );
                }
            );

            var oPersService,
                oPersSpy;

            QUnit.module("SmartNavigation without tracking", {
                beforeEach: function () {
                    oPersService = new sap.ushell.services.Personalization();
                    oPersSpy = sinon.spy(oPersService, "getContainer");
                    sinon.stub(oSmartNavPrivate, "isTrackingEnabled", function() {
                        return false;
                    });
                    sinon.stub( oCrossAppNav, "toExternal" );
                    sinon.stub( oCrossAppNav, "hrefForExternal" );
                },

                afterEach: function () {
                    testUtils.restoreSpies(
                        oPersSpy,
                        oSmartNavPrivate.isTrackingEnabled,
                        oCrossAppNav.toExternal,
                        oCrossAppNav.hrefForExternal
                    );
                }
            });

            QUnit.test("GetLinks should not load data from Personalizer", function (assert) {

                //act
                oSmartNavigation.getLinks({semanticObject: "foo"});

                //assert
                assert.equal(oPersSpy.callCount, 0, "Personalization service not called");

            });

            QUnit.test("toExternal", function (assert) {

                //act
                oSmartNavigation.toExternal({semanticObject: "foo", action: "bar"});

                //assert
                assert.equal(oPersSpy.callCount, 0, "Personalization service not called");
                assert.equal(oCrossAppNav.toExternal.callCount, 1, "CrossAppNavigation.toExternal called exactly once");
            });

            QUnit.test("trackNavigation should not write data to Personalizer", function (assert) {

                var done = assert.async();

                //act
                oSmartNavigation.trackNavigation({semanticObject: "foo"}).then(function() {
                    //assert
                    assert.equal(oPersSpy.callCount, 0, "Personalization service not called");
                }).then(done, done);

            });

            function getAllLinks() {
                return [
                    {
                        intent: "#AccessControlRole-desktop",
                        text: "Application State Example (Icons)"
                    },
                    {
                        intent: "#AccessControlRole-desktopPhone",
                        text: "Application State Example (Icons)"
                    },
                    {
                        intent: "#AccessControlRole-desktopTablet",
                        text: "Application State Example (Icons)"
                    },
                    {
                        intent: "#AccessControlRole-desktopTabletPhone",
                        text: "Application State Example (Icons)"
                    },
                    {
                        intent: "#AccessControlRole-none",
                        text: "Application State Example (Icons)"
                    },
                    {
                        intent: "#Action-EPMSalesOrder",
                        text: "EPM Sales Order"
                    },
                    {
                        intent: "#Action-EPMSalesOrderExt",
                        text: "EPM Sales Order Extension 1"
                    },
                    {
                        intent: "#Action-EPMSalesOrderExt2",
                        text: "EPM Sales Order Extension 2"
                    },
                    {
                        intent: "#Action-multipleInputs",
                        text: "Receiving CostCenter, SendingCostCenter and CostCenter as input parmeters map to CostCenter"
                    },
                    {
                        intent: "#Action-nosysAbsoluteUrl",
                        text: "Absolute URL"
                    },
                    {
                        intent: "#Action-nosysNonwrappedTR",
                        text: "No System Alias Relative Wrapped TR"
                    },
                    {
                        intent: "#Action-nosysWDA",
                        text: "Relative WDA URL"
                    },
                    {
                        intent: "#Action-nosysWrappedTR",
                        text: "toWrappedTR"
                    },
                    {
                        intent: "#Action-parameterRename",
                        text: "Display received parameters"
                    },
                    {
                        intent: "#Action-pickTechnology",
                        text: "pickTechnology (UI5 Technology)"
                    },
                    {
                        intent: "#Action-showuserdefaults",
                        text: "Application Navigation Sample 1 for User Default Values"
                    },
                    {
                        intent: "#Action-startgui",
                        text: ""
                    },
                    {
                        intent: "#Action-sysNonwrappedTR",
                        text: "Non wrapped TR with system alias"
                    },
                    {
                        intent: "#Action-sysRelativeUrl",
                        text: "Relative Url with System Alias"
                    },
                    {
                        intent: "#Action-sysWDA",
                        text: "WDA URL With System Alias"
                    },
                    {
                        intent: "#Action-sysWrappedTR",
                        text: "toSystemAliasWrappedTR"
                    },
                    {
                        intent: "#Action-toAbsoluteUrl",
                        text: "toAbsoluteUrl"
                    },
                    {
                        intent: "#Action-toBookmark",
                        text: "Bookmark Sample"
                    },
                    {
                        intent: "#Action-toDuplicateWithPriority",
                        text: "gtpCharliePriority"
                    },
                    {
                        intent: "#Action-toHelloFlp",
                        text: "Hello FLP"
                    },
                    {
                        intent: "#Action-toLrepSmartFormSample",
                        text: "LREP Smart Form Sample"
                    },
                    {
                        intent: "#Action-toRelativeUrl",
                        text: "toRelativeUrl"
                    },
                    {
                        intent: "#Action-toRelativeUrlEmbedded",
                        text: "toRelativeUrlEmbedded"
                    },
                    {
                        intent: "#Action-toRtaDemoApp",
                        text: "Runtime Adaptation Demo App"
                    },
                    {
                        intent: "#Action-toRtaSampleApp",
                        text: "Runtime Authoring Sample"
                    },
                    {
                        intent: "#Action-toRtaTestApp",
                        text: "Runtime Authoring Test App"
                    },
                    {
                        intent: "#Action-toSU01Windows",
                        text: "toSU01Windows"
                    },
                    {
                        intent: "#Action-toStandaloneUI5App",
                        text: "Datacontext Test Container"
                    },
                    {
                        intent: "#Action-toUrlOnOtherServer",
                        text: "toUrlOnOtherServer"
                    },
                    {
                        intent: "#Action-toUserDefaultFiltering",
                        text: "Gtp User Default Filtering (defaulted)"
                    },
                    {
                        intent: "#Action-toUserDefaultTarget",
                        text: "Navigate with User Default Parameter"
                    },
                    {
                        intent: "#Action-toWda",
                        text: "toWda"
                    },
                    {
                        intent: "#Action-toWdaProductDetails",
                        text: "toWdaProductDetails"
                    },
                    {
                        intent: "#Action-toWdaProductSearch",
                        text: "toWdaProductSearch"
                    },
                    {
                        intent: "#Action-toappcontextsample",
                        text: "PersSrvTest"
                    },
                    {
                        intent: "#Action-toappdeptest1",
                        text: "App Dependency Test 1 (Original App)"
                    },
                    {
                        intent: "#Action-toappdeptest2",
                        text: "App Dependency Test 2 (Extension App)"
                    },
                    {
                        intent: "#Action-toappdeptestfail",
                        text: "App Dependency Test provoking load failure"
                    },
                    {
                        intent: "#Action-toappnavsample",
                        text: "App Navigation Sample 1"
                    },
                    {
                        intent: "#Action-toappnavsample2",
                        text: "App Navigation Sample 2"
                    },
                    {
                        intent: "#Action-toappnavsample_ud",
                        text: "AppNavSample with user default parameters"
                    },
                    {
                        intent: "#Action-toappperssample",
                        text: "App Personalization Sample 1"
                    },
                    {
                        intent: "#Action-toappperssample2",
                        text: "App Personalization Sample 2"
                    },
                    {
                        intent: "#Action-toappperssample3",
                        text: "App Personalization Sample 3"
                    },
                    {
                        intent: "#Action-toappstateformsample",
                        text: "AppStateForm"
                    },
                    {
                        intent: "#Action-toappstatesample",
                        text: "Application State Example (Icons)"
                    },
                    {
                        intent: "#Action-toperssrvtest",
                        text: "PersSrvTest"
                    },
                    {
                        intent: "#Action-toreceive",
                        text: "Received Parameters Test Application"
                    },
                    {
                        intent: "#Action-toshowparameters",
                        text: "Show received user default parameters"
                    },
                    {
                        intent: "#Action-tosu01",
                        text: "tosu01"
                    },
                    {
                        intent: "#Action-touserdefaults",
                        text: "UserDefaults Editor"
                    },
                    {
                        intent: "#ActionPickTech-pickTechnologyNoWDA",
                        text: "pickTechnology (UI5 Technology)"
                    },
                    {
                        intent: "#Customer-display",
                        text: ""
                    },
                    {
                        intent: "#Document-display",
                        text: ""
                    },
                    {
                        intent: "#EPMProduct-display",
                        text: "Display EPM Product"
                    },
                    {
                        intent: "#EPMProduct-lookup",
                        text: "Search Product"
                    },
                    {
                        intent: "#EPMPurchaseOrder-manage",
                        text: ""
                    },
                    {
                        intent: "#EPMSalesOrder-display",
                        text: "PB8/120"
                    },
                    {
                        intent: "#EPMSalesOrder-manage",
                        text: "Sales Orders"
                    },
                    {
                        intent: "#FioriCatalog-display",
                        text: "Backend Catalog Mass Maintenance"
                    },
                    {
                        intent: "#NewsFeed-displayNewsList",
                        text: "News Item List"
                    },
                    {
                        intent: "#WDANavSource-display",
                        text: "Webdynpro test application to trigger navigation"
                    },
                    {
                        intent: "#WDANavTarget-display",
                        text: ""
                    },
                    {
                        intent: "#ZLSO-zbhr_lso_bdg",
                        text: "ZBHR_LSO_BDG"
                    },
                    {
                        intent: "#SO-action0",
                        text: "SO-action0"
                    },
                    {
                        intent: "#SO-action1?two=2&/InAppView",
                        text: "SO-action1"
                    },
                    {
                        intent: "#SO-action2",
                        text: "SO-action2"
                    },
                    {
                        intent: "#SO-action3",
                        text: "SO-action3"
                    },
                    {
                        intent: "#SO-action4?one=1",
                        text: "SO-action4"
                    },
                    {
                        intent: "#SO-action5",
                        text: "SO-action5"
                    },
                    {
                        intent: "#SO-action6",
                        text: "SO-action6"
                    },
                    {
                        intent: "#SO-action7",
                        text: "SO-action7"
                    }
                ];
            }
        }
    );
});
})( sap, jQuery, QUnit, sinon );