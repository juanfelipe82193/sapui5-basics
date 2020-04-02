// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.PrivateFunctions_SmartNavigation service.
 */

/* global QUnit, sinon */

sap.ui.require( [
    "sap/ushell/services/Container",
    "sap/ushell/services/URLParsing",
    "sap/ushell/services/AppLifeCycle",
    "sap/ushell/services/Personalization",
    "sap/ushell/services/_SmartNavigation/complements",
    "sap/ushell/utils"
], function (oContainer, oURLParsing, oAppLifeCycle, oPersonalizationStore, oPrivate, utils) {
        "use strict";

        QUnit.module(
            "SmartNavigation",
            {
                beforeEach: function (assert) {
                    var fnDone = assert.async();
                    sap.ushell.bootstrap("local").done(function () {
                        oContainer = sap.ushell.Container;

                        oURLParsing = oContainer.getService( "URLParsing" );
                        oAppLifeCycle = oContainer.getService( "AppLifeCycle" );
                        oPersonalizationStore = oContainer.getService( "Personalization" );
                        fnDone();
                    });

                },
                afterEach: function () {
                    delete sap.ushell.Container;
                }
            }
        );

        QUnit.test("#isTrackingEnabled works as expected for different configs", function (assert) {
            var isDisabledByDefault = oPrivate.isTrackingEnabled(undefined, utils),
                isEnabledIfConfigured = oPrivate.isTrackingEnabled({config: {isTrackingEnabled: true}}, utils),
                isDisabledWithIncompleteConfig = oPrivate.isTrackingEnabled({foo: "bar"}, utils);

            assert.ok(!isDisabledByDefault, "disabled by default");
            assert.ok(isEnabledIfConfigured, "enabled if config says so");
            assert.ok(!isDisabledWithIncompleteConfig, "disabled for some various config");
        });

        QUnit.test( "#getHashCode", function ( assert ) {
            var fnGetHashCode = oPrivate.getHashCode;

            [
                // String input
                {
                    value: "foo-bar",
                    expression: '"foo-bar"'
                },
                // Object inputs
                {
                    value: {},
                    expression: "{}"
                },
                {
                    value: { foo: "bar" },
                    expression: '{ foo: "bar" }'
                },
                {
                    value: new Date(),
                    expression: "new Date()"
                },
                {
                    value: null,
                    expression: "null"
                },
                {
                    // eslint-disable-next-line no-new-wrappers
                    value: new Number(498),
                    expression: "new Number( 498 )"
                },
                {
                    // eslint-disable-next-line no-new-wrappers
                    value: new String("foofoo"),
                    expression: 'new String("foofoo")'
                },
                // Undefined input
                {
                    value: undefined,
                    expression: "undefined"
                },
                // Number inputs
                {
                    value: 54658,
                    expression: "54658"
                }
            ].forEach( function ( oFixture ) {
                assert.equal(
                    // eslint-disable-next-line no-self-compare
                    fnGetHashCode(oFixture.value) === fnGetHashCode(oFixture.value),
                    true,
                    "the calculated hash code for an input value like `"
                    + oFixture.expression
                    + "` at any instant in time is always the same for any other time"
                );
            });

            assert.throws(
                function () {
                    fnGetHashCode( Object.create( null ) );
                },
                TypeError,
                "Throws a TypeError error when given input cannot be coerced to a string"
            );

            assert.notEqual(
                fnGetHashCode( "foo-bar" ),
                fnGetHashCode( "bar-foo" ),
                "Return different hash codes for inputs of the same length and composed of same characters but which are not equal"
            );
        });

        QUnit.test( "#getBaseHashPart", function ( assert ) {
            var fnGetBaseHashPart = oPrivate.getBaseHashPart;
            var iParseShellHashCallCount = 0;

            sinon.spy( oURLParsing, "parseShellHash" );

            [
                {
                    input: {
                        intent: "#foo-bar"
                    },
                    expected: {
                        hash: "foo-bar"
                    }
                },
                {
                    input: {
                        intent: "#foo-bar?"
                    },
                    expected: {
                        hash: "foo-bar"
                    }
                },
                {
                    input: {
                        intent: "foo-bar"
                    },
                    expected: {
                        hash: "foo-bar"
                    }
                }
            ].forEach( function ( oFixture ) {
                assert.equal(
                    fnGetBaseHashPart( oURLParsing, oFixture.input.intent ),
                    oFixture.expected.hash,
                    "Base hash part calculated correctly for `" + oFixture.input.intent + "`"
                );

                ++iParseShellHashCallCount;
            });

            [
                {
                    input: {
                        intent: "foo"
                    }
                },
                {
                    input: {
                        intent: "#foo"
                    }
                },
                {
                    input: {
                        intent: "foo?"
                    }
                },
                {
                    input: {
                        intent: "foo-"
                    }
                },
                {
                    input: {
                        intent: ""
                    }
                },
                {
                    input: {
                        intent: null
                    }
                }
            ].forEach( function ( oFixture ) {
                assert.throws(
                    function () {
                        fnGetBaseHashPart( oURLParsing, oFixture.input.intent );
                    },
                    /Invalid intent/i,
                    "Throws for invalid intent `" + oFixture.input.intent + "`"
                );

                ++iParseShellHashCallCount;
            });

            assert.equal(
                oURLParsing.parseShellHash.callCount,
                iParseShellHashCallCount,
                "Interacts with URLParsing#parseShellHash as expected"
            );

            oURLParsing.parseShellHash.restore();
        });

        QUnit.test( "#getHashFromOArg", function ( assert ) {
            [
                {
                    input: {
                        shellHash: "foo-bar"
                    },
                    expectedHash: "foo-bar"
                },
                {
                    input: {
                        action: "bar",
                        semanticObject: "foo"
                    },
                    expectedHash: "foo-bar"
                },
                {
                    input: {
                        shellHash: "foo"
                    },
                    expectedHash: null
                },
                {
                    input: {
                        action: "bar"
                    },
                    expectedHash: null
                },
                {
                    input: {
                        semanticObject: "foo"
                    },
                    expectedHash: null
                }
            ].forEach( function ( oFixture ) {
                var fnGetHashFromOArgs = oPrivate.getHashFromOArgs;
                var sHash = fnGetHashFromOArgs( oFixture.input, oURLParsing );

                if ( oFixture.expectedHash ) {
                    assert.equal(
                        sHash,
                        oFixture.expectedHash,
                        "Correctly determines hash when oArgs has the form `" + JSON.stringify( oFixture.input ) + "`"
                    );
                } else {
                    assert.equal(
                        sHash,
                        oFixture.expectedHash,
                        "Return `null` for a given `oArgs` that is malformed"
                    );
                }
            });
        });

        QUnit.test( "#getPersContainerKey", function ( assert ) {
            var fnGetPersContainerKey = oPrivate.getPersContainerKey;
            var sKey = fnGetPersContainerKey( "foo-bar" );

            assert.ok(
                sKey.indexOf( oPrivate.PERS_CONTAINER_KEY_PREFIX ) === 0,
                "Container keys begin with `" + oPrivate.PERS_CONTAINER_KEY_PREFIX + "`"
            );
        });

        QUnit.test( "#getNavigationOccurrences", function ( assert ) {
            var fnGetNavigationOccurrences = oPrivate.getNavigationOccurrences;

            var oComponent = {};

            var fnFinishTest = assert.async();

            var aExpectedNavOccurrences;

            // -- Arrange.
            sinon.stub( oPersonalizationStore, "getContainer", function () {
                var iNow = Date.now();
                // Totally random times in the near past.
                var fiveSecondsAgo = iNow - 5000;
                var fortySecondsAgo = iNow - 40000;

                var oStorage = {
                    "foo": {
                        actions: {
                            bar: {
                                latestVisit: iNow,
                                dailyFrequency: [ 4, 2, 5, 0, 0, 2, 6 ]
                            },
                            rab: {
                                latestVisit: fortySecondsAgo,
                                dailyFrequency: [ 3, 56, 4 ]
                            }
                        },
                        latestVisit: iNow,
                        dailyFrequency: [ /* not accurate but we're not testing this */ ]
                    },
                    "boo": {
                        actions: {
                            tar: {
                                latestVisit: fiveSecondsAgo,
                                dailyFrequency: [ 8, 3, 5 ]
                            }
                        },
                        latestVisit: fiveSecondsAgo,
                        dailyFrequency: [ /* not accurate but we're not testing this */ ]
                    }
                };

                return jQuery.when( {
                    getItemKeys: function () {
                        return Object.keys( oStorage );
                    },
                    getItemValue: function ( sKey ) {
                        return oStorage[ sKey ];
                    }
                });
            });
            aExpectedNavOccurrences = [
                {
                    intent: "foo-bar",
                    clickCount: 19
                },
                {
                    intent: "foo-rab",
                    clickCount: 63
                },
                {
                    intent: "boo-tar",
                    clickCount: 16
                }
            ];

            fnGetNavigationOccurrences( "nomatter-causestubbed", oPersonalizationStore, oComponent, oURLParsing )
                .then( function ( aNavigationOccurrences ) {
                    assert.deepEqual(
                        aNavigationOccurrences,
                        aExpectedNavOccurrences,
                        "Reads and summarises navigation history/statistics"
                    );
                    assert.ok(
                        oPersonalizationStore.getContainer.calledOnce,
                        "Interacts with Personalization#getContainer"
                    );
                })
                .then( function () {
                    oPersonalizationStore.getContainer.restore();
                })
                .then( fnFinishTest, fnFinishTest );
        });

        QUnit.test(
            "#prepareLinksForSorting (same as #mapClickCountsIntoLinkItems)",
            function ( assert ) {
                assert.ok( true, "see #mapClickCountsIntoLinkItems" );
            }
        );

        QUnit.test( "#mapClickCountsIntoLinkItems", function ( assert ) {
            var fnMapClickCountsIntoLinkItems = oPrivate.mapClickCountsIntoLinkItems;

            var aLinks = [
                { intent: "foo-bar" },
                { intent: "fooz-barz" },
                { intent: "foox-barx" },
                { intent: "foov-barv" },
                { intent: "no-history" }
            ];
            var aNavigationOccurrences = [
                {
                    intent: "foo-bar",
                    clickCount: 5
                },
                {
                    intent: "fooz-barz",
                    clickCount: 2
                },
                {
                    intent: "foox-barx",
                    clickCount: 0
                },
                {
                    intent: "foov-barv",
                    clickCount: 21
                }
            ];

            fnMapClickCountsIntoLinkItems( aLinks, aNavigationOccurrences, oURLParsing );

            assert.deepEqual(
                aLinks,
                [
                    { intent: "foo-bar", clickCount: 5 },
                    { intent: "fooz-barz", clickCount: 2 },
                    { intent: "foox-barx", clickCount: 0 },
                    { intent: "foov-barv", clickCount: 21 },
                    { intent: "no-history", clickCount: 0 }
                ],
                "Inserts frequency of inward navigation for the past 30 days to each intent in the link list"
            );
        });

        QUnit.test( "#recordNavigationOccurrences", function ( assert ) {
            // arrange
            var fnRecordNavigationOccurrences = oPrivate.recordNavigationOccurrences;

            var fnFinishTest = assert.async();

            sinon.stub( oPersonalizationStore, "getContainer", ( function () {
                var oContainers = Object.create( null );
                var iNow = Date.now();

                // "current-app" application
                oContainers[ oPrivate.getPersContainerKey( "current-app" ) ] = {
                    destination1: {
                        actions: {
                            app: {
                                latestVisit: iNow,
                                dailyFrequency: [ 3, 7, 0, 1, 4 ]
                            }
                        },
                        latestVisit: iNow,
                        dailyFrequency: [ 3, 7, 0, 1, 4 ]
                    },
                    destination2: {
                        actions: {
                            app: {
                                latestVisit: iNow,
                                dailyFrequency: [ 6, 2, 21, 32, 85 ]
                            }
                        },
                        latestVisit: iNow,
                        dailyFrequency: [ 6, 2, 21, 32, 85 ]
                    },
                    destination3: {
                        actions: {
                            app: {
                                latestVisit: iNow,
                                dailyFrequency: [ 5, 4, 8, 12 ]
                            }
                        },
                        latestVisit: iNow - oPrivate.ONE_DAY_IN_MILLISECOND,
                        dailyFrequency: [ 5, 4, 8, 12 ]
                    }
                };
                // "foo-bar" application
                oContainers[ oPrivate.getPersContainerKey( "foo-bar" ) ] = {};

                return function ( sPersContainerKey ) {
                    var oContainer = oContainers[ sPersContainerKey ];

                    if ( !oContainer ) {
                        oContainer = {};
                        oContainers[ sPersContainerKey ] = oContainer;
                    }

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
                };
            })() );

            var aFixtures = [
                {
                    input: {
                        fromCurrentShellHash: "current-app",
                        toDestinationShellHash: "destination1-app"
                    },
                    expected: {
                        dailyFrequency: [ 4, 7, 0, 1, 4 ]
                    },
                    description: "Increments navigation frequency to `destination1-app` for today if the destination was previously visited today"
                },
                {
                    input: {
                        fromCurrentShellHash: "current-app",
                        toDestinationShellHash: "destination2-app"
                    },
                    expected: {
                        dailyFrequency: [ 7, 2, 21, 32, 85 ]
                    },
                    description: "Increments navigation frequency to `destination2-app` for today if the destination was previously visited today"
                },
                {
                    input: {
                        fromCurrentShellHash: "current-app",
                        toDestinationShellHash: "destination3-app"
                    },
                    expected: {
                        dailyFrequency: [ 1, 5, 4, 8, 12 ]
                    },
                    description: "Records new navigation history entry for today if the last time the destination was visited is more than one day ago"
                },
                {
                    input: {
                        fromCurrentShellHash: "foo-bar",
                        toDestinationShellHash: "first_time-visit_ever"
                    },
                    expected: {
                        dailyFrequency: [ 1 ]
                    },
                    description: "Records new navigation history entry for today for a destination application that was visited for the first time ever from the current app"
                }
            ];
            aFixtures.reduce( function ( oPromiseToCompletePreviousFixture, oCurrentFixture ) {
                var sCurrentHash = oCurrentFixture.input.fromCurrentShellHash;
                var sDestinationHash = oCurrentFixture.input.toDestinationShellHash;

                return oPromiseToCompletePreviousFixture
                    .then( function () {
                        // act
                        return fnRecordNavigationOccurrences(
                            sCurrentHash,
                            sDestinationHash,
                            oPersonalizationStore,
                            {},
                            oURLParsing
                        );
                    })
                    .then( function () {
                        var sPersContainerKey = oPrivate.getPersContainerKey( sCurrentHash );
                        return oPersonalizationStore.getContainer( sPersContainerKey );
                    })
                    .then( function ( oContainer ) {
                        // assert
                        var so = sDestinationHash.split( "-" )[ 0 ];
                        var oActualStoredValue = oContainer.getItemValue( so );

                        assert.deepEqual(
                            oActualStoredValue.dailyFrequency,
                            oCurrentFixture.expected.dailyFrequency,
                            oCurrentFixture.description
                        );
                    });
            }, jQuery.when( null ) ).then( fnFinishTest, fnFinishTest );

            oPersonalizationStore.getContainer.restore();
        });

        QUnit.test( "#updateHistoryEntryWithCurrentUsage", function ( assert ) {
            var iNow = Date.now();
            var iOneMonth = 28 * oPrivate.ONE_DAY_IN_MILLISECOND;
            var iFiveDaysAgo = iNow - 5 * oPrivate.ONE_DAY_IN_MILLISECOND;
            var iFourMonthsAgo = iNow - 4 * iOneMonth;

            [
                {
                    input: {
                        historyEntry: {
                            latestVisit: iNow,
                            dailyFrequency: [ 5, 2, 56, 0, 9 ]
                        }
                    },
                    expected: {
                        historyEntry: {
                            latestVisit: iNow,
                            dailyFrequency: [ 6, 2, 56, 0, 9 ]
                        }
                    },
                    description: "Updates history entry accordingly when usage occurs same day"
                },
                {
                    input: {
                        historyEntry: {
                            latestVisit: iFiveDaysAgo,
                            dailyFrequency: [ 5, 2, 56, 0, 9 ]
                        }
                    },
                    expected: {
                        historyEntry: {
                            latestVisit: iNow,
                            dailyFrequency: [ 1, 0, 0, 0, 0, 5, 2, 56, 0, 9 ]
                        }
                    },
                    description: "Updates history entry accordingly when used after 5 days break"
                },
                {
                    input: {
                        historyEntry: {
                            latestVisit: iFourMonthsAgo,
                            dailyFrequency: ( function () {
                                // Emulates once-a-day usage for last 90 days.
                                var iIndex = 0, iCount = 90;
                                var aDailyUsageStat = [ ];

                                while ( iIndex++ < iCount ) {
                                    aDailyUsageStat.push( 1 );
                                }

                                return aDailyUsageStat;
                            })()
                        }
                    },
                    expected: {
                        historyEntry: {
                            dailyFrequency: ( function () {
                                // Emulates break of 4 * 28 days before next
                                // use.
                                var iIndex = 0, iCount = oPrivate.STATISTIC_COLLECTION_WINDOW_DAYS - 1;
                                var aDailyUsageStat = [ 1 ];

                                while ( iIndex++ < iCount ) {
                                    aDailyUsageStat.push( 0 );
                                }

                                return aDailyUsageStat;
                            })()
                        }
                    },
                    description: "Updates history entry accordingly when usage was once-a-day for hundred days, then a 4 * 28 days break before next use"
                }
            ].forEach( function ( oFixture ) {
                var fnUpdateHistoryItemWithCurrentUsage = oPrivate.updateHistoryEntryWithCurrentUsage;

                fnUpdateHistoryItemWithCurrentUsage( oFixture.input.historyEntry );

                assert.deepEqual(
                    oFixture.input.historyEntry.dailyFrequency,
                    oFixture.expected.historyEntry.dailyFrequency,
                    oFixture.description
                );
            });
        });
});
