// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for bootstrap common.configure.ushell.js
 */
sap.ui.require([
    "sap/ushell/bootstrap/common/common.read.ushell.config.from.url"
], function (oReadConfigFromUrl) {

    /* global QUnit */

    "use strict";

    var S_QUERY_PARAM_NAME = "sap-ushell-xx-overwrite-config",
        A_BLOCKED = [];

    QUnit.module("common.read.ushell.config.from.url");

    [{
        testDescription: "url query params at all",
        input: {
            windowLocationSearch: ""
        },
        expectedConfig: {}
    }, {
        testDescription: "different query parameter",
        input: {
            windowLocationSearch: "?param=foo"
        },
        expectedConfig: {}
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with single string value",
        input: {
            windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/bbb/ccc/foo:foo"
        },
        expectedConfig: {
            aaa: {
                bbb: {
                    ccc: {
                        foo: "foo"

                    }
                }
            }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with 2 string values in different namespace",
        input: {
            windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/bbb/ccc/foo:foo,xxx/yyy/zzz/bar:bar%20bar"
        },
        expectedConfig: {
            aaa: {
                bbb: {
                    ccc: {
                        foo: "foo"

                    }
                }
            },
            xxx: {
                yyy: {
                    zzz: {
                        bar: "bar bar"
                    }
                }
            }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with 2 string values in same namespace",
        input: {
            windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/bbb/ccc/foo:foo,aaa/bbb/ccc/bar:bar%20bar"
        },
        expectedConfig: {
            aaa: {
                bbb: {
                    ccc: {
                        foo: "foo",
                        bar: "bar bar"
                    }
                }
            }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with 2 boolean values in same namespace",
        input: {
            windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/bbb/ccc/foo:true,aaa/bbb/ccc/bar:false"
        },
        expectedConfig: {
            aaa: {
                bbb: {
                    ccc: {
                        foo: true,
                        bar: false
                    }
                }
            }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with 2 string values in partially same namespace",
        input: {
            windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/bbb/ccc/foo:foo,aaa/bbb/zzz/bar:bar"
        },
        expectedConfig: {
            aaa: {
                bbb: {
                    ccc: {
                        foo: "foo"
                    },
                    zzz: {
                        bar: "bar"
                    }

                }
            }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with 2 number values in partially same namespace",
        input: {
            windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/bbb/ccc/foo:0,aaa/bbb/zzz/bar:-1.3"
        },
        expectedConfig: {
            aaa: {
                bbb: {
                    ccc: {
                        foo: 0
                    },
                    zzz: {
                        bar: -1.3
                    }

                }
            }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with optional leanding / in namespace (also supported in sap-ui-debug)",
        input: {
            windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=/aaa/bbb/ccc/foo:foo,/aaa/bbb/zzz/bar:bar"
        },
        expectedConfig: {
            aaa: {
                bbb: {
                    ccc: {
                        foo: "foo"
                    },
                    zzz: {
                        bar: "bar"
                    }

                }
            }
        }
    }, {
        testDescription: S_QUERY_PARAM_NAME + " with encoding of colon",
        input: {
            windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa%2ffoo%3abar"
        },
        expectedConfig: {
            aaa: {
                foo: "bar"
            }
        }
    }, {
        // To conform with the specification of the query string ("application/x-www-form-urlencoded")
        // see: https://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
        testDescription: S_QUERY_PARAM_NAME + " with proper encoding of \" \" (space) as \"+\"",
        input: { windowLocationSearch: "?" + S_QUERY_PARAM_NAME + "=aaa/foo:foo+bar" },
        expectedConfig: { aaa: { foo: "foo bar" } }
    }].forEach(function (oFixture) {
        QUnit.test("getConfigFromWindowLocation when " + oFixture.testDescription, function (assert) {
            var oWindowLocationMock,
                oActualConfig;

            // arrange
            oWindowLocationMock = {
                search: oFixture.input.windowLocationSearch
            };

            // act
            oActualConfig = oReadConfigFromUrl._getConfigFromWindowLocation(oWindowLocationMock);

            // assert
            assert.deepEqual(oActualConfig, oFixture.expectedConfig, "returned config");
        });
    });

    [{
        testDescription: "no entries in Blacklist",
        input: {
            oEntry: {
                namespace: "a/b/c",
                propertyName: "foo",
                value: 123
            },
            oBlacklist: {}
        },
        expected: false
    }, {
        testDescription: "different entry in Blacklist",
        input: {
            oEntry: {
                namespace: "a/b/c",
                propertyName: "foo",
                value: 123
            },
            oBlacklist: {
                "x/y/z": A_BLOCKED
            }
        },
        expected: false
    }, {
        testDescription: "entire entry is blocked",
        input: {
            oEntry: {
                namespace: "a/b/c",
                propertyName: "foo",
                value: 123
            },
            oBlacklist: {
                "a/b/c/foo": A_BLOCKED
            }
        },
        expected: true
    }, {
        testDescription: "concrete entry value is blocked",
        input: {
            oEntry: {
                namespace: "a/b/c",
                propertyName: "foo",
                value: 123
            },
            oBlacklist: {
                "a/b/c/foo": [789, 123]
            }
        },
        expected: true
    }, {
        testDescription: "specified value is not blocked",
        input: {
            oEntry: {
                namespace: "a/b/c",
                propertyName: "foo",
                value: "notblocked"
            },
            oBlacklist: {
                "a/b/c/foo": ["bar", "abc"]
            }
        },
        expected: false
    }].forEach(function (oFixture) {
        QUnit.test("_isBalckListed when " + oFixture.testDescription, function (assert) {
            // act
            var bResult = oReadConfigFromUrl._isBlacklisted(
                oFixture.input.oBlacklist,
                oFixture.input.oEntry
            );

            // assert
            assert.strictEqual(bResult, oFixture.expected, "isBlacklisted");
        });
    });
});
