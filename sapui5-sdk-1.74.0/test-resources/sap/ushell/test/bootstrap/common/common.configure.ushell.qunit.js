// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for bootstrap common.configure.ushell.js
 */
sap.ui.require([
    "sap/ushell/bootstrap/common/common.configure.ushell",
    "sap/ushell/bootstrap/common/common.read.metatags"
], function (fnConfigureUshell, oMetaTagReader) {

    /* global QUnit */
    "use strict";

    var oOldUshellConfig;

    QUnit.module("common.configure.ushell", {
        setup: function () {
            // save ushell config for restoring
            oOldUshellConfig = window["sap-ushell-config"];
        },
        teardown: function () {
            // restore config
            window["sap-ushell-config"] = oOldUshellConfig;
        }
    });

    [
        {
            testDescription: "services.Container.adapter.config.userProfilePersonalization is provided",
            input: {
                ushellConfig: {
                    services: {
                        Container: {
                            adapter: {
                                config: {
                                    userProfilePersonalization: {
                                        items: {
                                            itemOne: {
                                                someProperty: "someValue"
                                            }
                                        },
                                        __metadata: "ToBeDeleted"
                                    }
                                }
                            }
                        }
                    }
                },
                oSettings: {}
            },
            expectedResult: {
                userProfilePersonalization: {
                    itemOne: {
                        someProperty: "someValue" // The actual Result will be trimmed because the object is too deep for a deepEqual!
                    }
                }
            },
            "sap-ui-debug": false // This is -always- added!
        }
    ].forEach(function (oFixture) {
        QUnit.test("configure Ushell when " + oFixture.testDescription, function (assert) {
            var oResult,
                oMetaTagReaderStub = sinon.stub(oMetaTagReader, "readMetaTags").returns([]);

            // arrange
            window["sap-ushell-config"] = oFixture.input.ushellConfig;

            // act
            oResult = fnConfigureUshell(oFixture.input.oSettings /*bDebug false*/);
            oResult = jQuery.sap.getObject("services.Container.adapter.config", 0, oResult);

            // assert
            assert.deepEqual(oResult, oFixture.expectedResult);
            ok(oMetaTagReaderStub.called);

            oMetaTagReaderStub.restore();
        });
    }),

        [
            {
                testDescription: "services.Container.adapter.config.userProfilePersonalization is undefined",
                input: {
                    ushellConfig: {},
                    oSettings: {}
                },
                expectedResult: {
                    "sap-ui-debug": false // This is -always- added!
                }
            },
            {
                testDescription: "oSettings is undefined",
                input: {
                    ushellConfig: {},
                    oSettings: undefined
                },
                expectedResult: {
                    "sap-ui-debug": false // This is -always- added!
                }
            },
            {
                testDescription: "ushellConfig is undefined",
                input: {
                    ushellConfig: undefined,
                    oSettings: {}
                },
                expectedResult: {
                    "sap-ui-debug": false // This is -always- added!
                }
            },
            {
                testDescription: "ushellConfig and oSettings are undefined",
                input: {
                    ushellConfig: undefined,
                    oSettings: undefined
                },
                expectedResult: {
                    "sap-ui-debug": false // This is -always- added!
                }
            },
            {
                testDescription: "valid ushellConfig",
                input: {
                    ushellConfig: {
                        'services': {
                            'PluginManager': {
                                'config': {
                                    'someConfig': true
                                }
                            },
                            'Container': {
                                'adapter': {
                                    'config': {
                                        'systemProperties': {},
                                        'userProfile': {
                                            'metadata': {
                                                'someMetaData': ['entry']
                                            },
                                            'defaults': { 'someDefaultProperty': 'foo' }
                                        },
                                        'anotherProperty': {}
                                    }
                                }
                            }
                        }
                    },
                    oSettings: undefined
                },
                expectedResult: {
                    'services': {
                        'PluginManager': {
                            'config': {
                                'someConfig': true
                            }
                        },
                        'Container': {
                            'adapter': {
                                'config': {
                                    'systemProperties': {},
                                    'userProfile': {
                                        'metadata': {
                                            'someMetaData': ['entry']
                                        },
                                        'defaults': { 'someDefaultProperty': 'foo' }
                                    },
                                    'anotherProperty': {}
                                }
                            }
                        }
                    },
                    "sap-ui-debug": false // This is -always- added!
                }
            },
            {
                testDescription: "ushellConfig is undefined; oSettings valid",
                input: {
                    ushellConfig: undefined,
                    oSettings: {
                        "defaultUshellConfig": {
                            "defaultRenderer": "some renderer",
                            'services': {
                                'PluginManager': {
                                    'config': {
                                        'someConfig': true
                                    }
                                },
                                'Container': {
                                    'adapter': {
                                        'config': {
                                            'systemProperties': {},
                                            'userProfile': {
                                                'metadata': {
                                                    'someMetaData': ['entry']
                                                },
                                                'defaults': { 'someDefaultProperty': 'foo' }
                                            },
                                            'anotherProperty': {}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                expectedResult: {
                    "defaultRenderer": "some renderer",
                    'services': {
                        'PluginManager': {
                            'config': {
                                'someConfig': true
                            }
                        },
                        'Container': {
                            'adapter': {
                                'config': {
                                    'systemProperties': {},
                                    'userProfile': {
                                        'metadata': {
                                            'someMetaData': ['entry']
                                        },
                                        'defaults': { 'someDefaultProperty': 'foo' }
                                    },
                                    'anotherProperty': {}
                                }
                            }
                        }
                    },
                    "sap-ui-debug": false // This is -always- added!
                }
            },
            {
                testDescription: "ushellConfig and oSettings are valid and merged with undefined userProfilePersonalization",
                input: {
                    ushellConfig: {
                        'services': {
                            'PluginManager': {
                                'config': {
                                    'someConfig': true
                                }
                            },
                            'Container': {
                                'adapter': {
                                    'config': {
                                        'systemProperties': {},
                                        'userProfile': {
                                            'metadata': {
                                                'someMetaData': ['entry']
                                            },
                                            'defaults': { 'someDefaultProperty': 'foo' }
                                        },
                                        'anotherProperty': {}
                                    }
                                }
                            }
                        }
                    },
                    oSettings: {
                        "defaultUshellConfig": {
                            "defaultRenderer": "some renderer",
                            'services': {
                                'MockService': {
                                    'config': {
                                        'someOtherConfig': true
                                    }
                                },
                                'AnotherService': {
                                    'adapter': {
                                        'config': {
                                            'systemProperties': {},
                                            'userProfile': {
                                                'metadata': {
                                                    'someMetaData': ['entry']
                                                },
                                                'defaults': { 'someDefaultProperty': 'foo' }
                                            },
                                            'anotherProperty': {}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                expectedResult: {
                    "defaultRenderer": "some renderer",
                    'services': {
                        'PluginManager': {
                            'config': {
                                'someConfig': true
                            }
                        },
                        'Container': {
                            'adapter': {
                                'config': {
                                    'systemProperties': {},
                                    'userProfile': {
                                        'metadata': {
                                            'someMetaData': ['entry']
                                        },
                                        'defaults': { 'someDefaultProperty': 'foo' }
                                    },
                                    'anotherProperty': {}
                                }
                            }
                        },
                        'MockService': {
                            'config': {
                                'someOtherConfig': true
                            }
                        },
                        'AnotherService': {
                            'adapter': {
                                'config': {
                                    'systemProperties': {},
                                    'userProfile': {
                                        'metadata': {
                                            'someMetaData': ['entry']
                                        },
                                        'defaults': { 'someDefaultProperty': 'foo' }
                                    },
                                    'anotherProperty': {}
                                }
                            }
                        }
                    },
                    "sap-ui-debug": false // This is -always- added!
                }
            },
            {
                testDescription: "ushellConfig and oSettings are valid and merged with additional userProfilePersonalization",
                input: {
                    ushellConfig: {
                        'services': {
                            'PluginManager': {
                                'config': {
                                    'someConfig': true
                                }
                            },
                            'Container': {
                                'adapter': {
                                    'config': {
                                        'systemProperties': {},
                                        'userProfile': {
                                            'metadata': {
                                                'someMetaData': ['entry']
                                            },
                                            'defaults': { 'someDefaultProperty': 'foo' }
                                        },
                                        'anotherProperty': {},
                                        'userProfilePersonalization': {
                                            'items': {
                                                'anItem': 'FooBar'
                                            },
                                            '__metadata': "someMetaData"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    oSettings: {
                        "defaultUshellConfig": {
                            "defaultRenderer": "some renderer",
                            'services': {
                                'MockService': {
                                    'config': {
                                        'someOtherConfig': true
                                    }
                                },
                                'AnotherService': {
                                    'adapter': {
                                        'config': {
                                            'systemProperties': {},
                                            'userProfile': {
                                                'metadata': {
                                                    'someMetaData': ['entry']
                                                },
                                                'defaults': { 'someDefaultProperty': 'foo' }
                                            },
                                            'anotherProperty': {}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                expectedResult: {
                    "defaultRenderer": "some renderer",
                    'services': {
                        'PluginManager': {
                            'config': {
                                'someConfig': true
                            }
                        },
                        'Container': {
                            'adapter': {
                                'config': {
                                    'systemProperties': {},
                                    'userProfile': {
                                        'metadata': {
                                            'someMetaData': ['entry']
                                        },
                                        'defaults': { 'someDefaultProperty': 'foo' }
                                    },
                                    'anotherProperty': {},
                                    'userProfilePersonalization': {
                                        'anItem': 'FooBar'
                                    }
                                }
                            }
                        },
                        'MockService': {
                            'config': {
                                'someOtherConfig': true
                            }
                        },
                        'AnotherService': {
                            'adapter': {
                                'config': {
                                    'systemProperties': {},
                                    'userProfile': {
                                        'metadata': {
                                            'someMetaData': ['entry']
                                        },
                                        'defaults': { 'someDefaultProperty': 'foo' }
                                    },
                                    'anotherProperty': {}
                                }
                            }
                        }
                    },
                    "sap-ui-debug": false // This is -always- added!
                }
            },
            {
                testDescription: "ushellConfig and oSettings are valid and merged with additional userProfilePersonalization plus meta tag configs",
                input: {
                    ushellConfig: {
                        'services': {
                            'PluginManager': {
                                'config': {
                                    'someConfig': true
                                }
                            },
                            'Container': {
                                'adapter': {
                                    'config': {
                                        'systemProperties': {},
                                        'userProfile': {
                                            'metadata': {
                                                'someMetaData': ['entry']
                                            },
                                            'defaults': { 'someDefaultProperty': 'foo' }
                                        },
                                        'anotherProperty': {},
                                        'userProfilePersonalization': {
                                            'items': {
                                                'anItem': 'FooBar'
                                            },
                                            '__metadata': "someMetaData"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    oSettings: {
                        "defaultUshellConfig": {
                            "defaultRenderer": "some renderer",
                            'services': {
                                'MockService': {
                                    'config': {
                                        'someOtherConfig': true
                                    }
                                },
                                'AnotherService': {
                                    'adapter': {
                                        'config': {
                                            'systemProperties': {},
                                            'userProfile': {
                                                'metadata': {
                                                    'someMetaData': ['entry']
                                                },
                                                'defaults': { 'someDefaultProperty': 'foo' }
                                            },
                                            'anotherProperty': {}
                                        }
                                    }
                                }
                            }
                        }
                    },
                    configItemsFromMeta: [{
                        services: {
                            testService: {
                                someSettings: "FooBar"
                            }
                        }
                    }]
                },
                expectedResult: {
                    "defaultRenderer": "some renderer",
                    'services': {
                        'PluginManager': {
                            'config': {
                                'someConfig': true
                            }
                        },
                        'Container': {
                            'adapter': {
                                'config': {
                                    'systemProperties': {},
                                    'userProfile': {
                                        'metadata': {
                                            'someMetaData': ['entry']
                                        },
                                        'defaults': { 'someDefaultProperty': 'foo' }
                                    },
                                    'anotherProperty': {},
                                    'userProfilePersonalization': {
                                        'anItem': 'FooBar'
                                    }
                                }
                            }
                        },
                        'MockService': {
                            'config': {
                                'someOtherConfig': true
                            }
                        },
                        'AnotherService': {
                            'adapter': {
                                'config': {
                                    'systemProperties': {},
                                    'userProfile': {
                                        'metadata': {
                                            'someMetaData': ['entry']
                                        },
                                        'defaults': { 'someDefaultProperty': 'foo' }
                                    },
                                    'anotherProperty': {}
                                }
                            }
                        },
                        "testService": {
                            'someSettings': 'FooBar'
                        }
                    },
                    "sap-ui-debug": false // This is -always- added!
                }
            },
            {
                testDescription: "duplicate settings are provided (ushellConfig + defaultUshellConfig) -> defaultUshellConfig prioritized",
                input: {
                    ushellConfig: {
                        'services': {
                            'MockService': {
                                'config': {
                                    'someOtherConfig': false
                                }
                            }
                        }
                    },
                    oSettings: {
                        "defaultUshellConfig": {
                            'services': {
                                'MockService': {
                                    'config': {
                                        'someOtherConfig': true
                                    }
                                }
                            }
                        }
                    }
                },
                expectedResult: {
                    'services': {
                        'MockService': {
                            'config': {
                                'someOtherConfig': true
                            }
                        }
                    },
                    "sap-ui-debug": false // This is -always- added!
                }
            },
            {
                testDescription: "duplicate settings are provided (ushellConfig + defaultUshellConfig + metatags) -> MetaTags prioritized",
                input: {
                    ushellConfig: {
                        'services': {
                            'MockService': {
                                'config': {
                                    'someOtherConfig': false
                                }
                            }
                        }
                    },
                    oSettings: {
                        "defaultUshellConfig": {
                            'services': {
                                'MockService': {
                                    'config': {
                                        'someOtherConfig': true
                                    }
                                }
                            }
                        }
                    },
                    configItemsFromMeta: [{
                        services: {
                            MockService: {
                                config: {
                                    someOtherConfig: false
                                }
                            }
                        }
                    }]
                },
                expectedResult: {
                    'services': {
                        'MockService': {
                            'config': {
                                'someOtherConfig': false
                            }
                        }
                    },
                    "sap-ui-debug": false // This is -always- added!
                }
            }
        ].forEach(function (oFixture) {
            QUnit.test("configure Ushell when " + oFixture.testDescription, function (assert) {
                var oResult,
                    oConfigItemsFromMeta = oFixture.input.configItemsFromMeta || [],
                    oMetaTagReaderStub = sinon.stub(oMetaTagReader, "readMetaTags").returns(oConfigItemsFromMeta);

                // arrange
                window["sap-ushell-config"] = oFixture.input.ushellConfig;

                // act
                oResult = fnConfigureUshell(oFixture.input.oSettings /*bDebug false*/);

                // assert
                assert.deepEqual(oResult, oFixture.expectedResult);
                ok(oMetaTagReaderStub.called);

                oMetaTagReaderStub.restore();
            });
        });
});
