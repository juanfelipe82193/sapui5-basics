// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/testUtils",
    "sap/ui/model/json/JSONModel"
], function (testUtils, JSONModel) {
    "use strict";
    /* global QUnit window Promise */

    var oInitialNavigationConfig = {
            enableInPlaceForClassicUIs:{
                GUI: true,
                WDA: false,
                WCF: false
            },
            enableWdaLocalResolution: true,
            enableWebguiLocalResolution: true,
            flpURLDetectionPattern: "[/]FioriLaunchpad.html[^#]+#[^-]+?-[^-]+"
        },
        oUshellConfig = testUtils.overrideObject({}, {
            "/services/ClientSideTargetResolution/config": oInitialNavigationConfig
        });

    window["sap-ushell-config"] = oUshellConfig;

    function createFakeBindingContextOnPath (sPath) {
        return {
            isA: function () { return "sap.ui.model.Context"; },
            getPath: function () { return sPath; }
        };
    }

    sap.ui.require(["sap/ushell/Config"], function (Config) {
        QUnit.module("sap/ushell/Config", {
            setup: Config._reset
        });

        //Config channel is created from window["sap-ushell-config"] when require sap/ushell/Config
        QUnit.test("Initial contract from sap-ushell-config", function (assert) {
            assert.deepEqual(Config.last("/core/navigation"), oInitialNavigationConfig, "the initial config is set up correctly");
        });

        QUnit.test("register new configuration", function (assert) {
            var bIsThrowException = false,
                oNewContract = testUtils.overrideObject({}, {
                    "/a/b/c": true
                });

            Config._reset();
            Config.registerConfiguration("core", oNewContract);

            try {
                Config.last("/core/navigation");
            } catch (ex) {
                bIsThrowException = true;
            }

            assert.ok(bIsThrowException, "the old configuration contract should be removed");
            assert.ok(Config.last("/a/b/c"), "the new configuration contract should be applyed");

        });

        [
            {
                testDescription: "model is created from configuration",
                testConfigurationContract: {
                    root: {
                        core: {
                            childA: {
                                childB: "value"
                            }
                        }
                    }
                },

                sCreateModel: "/root/core",

                expectedModelData: {
                    childA: {
                        childB: "value"
                    }
                },
                expectedThrows: false
            },
            {
                testDescription: "model is created from configuration and value is changed afterwards via emit",
                testConfigurationContract: {
                    root: {
                        core: {
                            childA: {
                                childB: "value"
                            }
                        }
                    }
                },

                sCreateModel: "/root/core",

                fnOnAfterModelCreated: function (oConfig, oModel) {
                    return new Promise(function (fnDone) {
                        oConfig.emit("/root/core/childA/childB", "nextValue");
                        oConfig.wait("/root/core/childA/childB").then(function () {
                            oConfig.once("/root/core/childA/childB").do(fnDone);
                        });
                    });
                },

                expectedModelData: {
                    childA: {
                        childB: "nextValue"
                    }
                }
            },
            {
                testDescription: "createModel is called on a leaf node",
                testConfigurationContract: {
                    root: {
                        core: {
                            childA: {
                                childB: "value"
                            }
                        }
                    }
                },

                sCreateModel: "/root/core/childA/childB",
                expectedThrows: true
            },
            {
                testDescription: "createModel is called with an object",
                testConfigurationContract: {
                    root: {
                        childA: {
                            a: "123"
                        },
                        childB: {
                            b: "456"
                        }
                    }
                },

                sCreateModel: {
                    prop1: "/root/childA/a",
                    prop2: "/root/childB/b"
                },
                expectedThrows: false,
                expectedModelData: {
                    prop1: "123",
                    prop2: "456"
                }
            },
            {
                testDescription: "createModel is called with an object and configuration option is changed",
                testConfigurationContract: {
                    root: {
                        childA: {
                            a: "AAA"
                        },
                        childB: {
                            b: "BBB"
                        }
                    }
                },

                sCreateModel: {
                    prop1: "/root/childA/a",
                    prop2: "/root/childB/b"
                },
                fnOnAfterModelCreated: function (oConfig, oModel) {
                    return new Promise(function (fnDone) {
                        oConfig.emit("/root/childA/a", "nextValue");
                        oConfig.wait("/root/childA/a").then(function () {
                            oConfig.once("/root/childA/a").do(fnDone);
                        });
                    });
                },

                expectedThrows: false,
                expectedModelData: {
                    prop1: "nextValue",
                    prop2: "BBB"
                }
            }
        ].forEach(function (oFixture) {
            QUnit.test("createModel: can create model out of a given path when " + oFixture.testDescription, function (assert) {
                // Arrange
                var fnDone = assert.async(),
                    oJsonModel,
                    bIsThrowException = false;

                var iNumKeys = Object.keys(oFixture.testConfigurationContract).length;
                if (iNumKeys !== 1) {
                    throw new Error("this test expects exactly one root key for testConfigurationContract");
                }

                Config._reset();
                Config.registerConfiguration(null, oFixture.testConfigurationContract);

                var sNo = oFixture.expectedThrows ? "" : "no";

                // Act
                try {
                    oJsonModel = Config.createModel(oFixture.sCreateModel, JSONModel);
                    assert.ok(!oFixture.expectedThrows, sNo + " exception is thrown when createModel is called.");
                } catch (ex) {
                    bIsThrowException = true;
                    assert.ok(oFixture.expectedThrows, sNo + " exception is thrown when createModel is called. ERROR: " + ex);
                    fnDone();
                    return;
                }

                var fnOnAfterModelCreated = Promise.resolve.bind(Promise);
                if (oFixture.fnOnAfterModelCreated) {
                    fnOnAfterModelCreated = oFixture.fnOnAfterModelCreated;
                }

                fnOnAfterModelCreated(Config, oJsonModel).then(function () {
                    // Assert
                    if (!bIsThrowException) {
                        assert.deepEqual(
                            oJsonModel.getData(),
                            oFixture.expectedModelData,
                            "obtained the expected data from the model"
                        );
                    }
                    fnDone();
                });
            });
        });

        [
            {
                testDescription: "setProperty is called on a model defined via single path definition",
                testConfigurationContract: {
                    a: {
                        b: true
                    }
                },
                vCreateModelArg: "/a",
                fnChangeModel: function (oJSONModel) {
                    oJSONModel.setProperty("/b", false);
                },
                expectedConfig: {
                    path: "/a",
                    result: {
                        b: false
                    }
                }
            },
            {
                testDescription: "setProperty is called on a model created with multi-path definition",
                testConfigurationContract: {
                    a: {
                        b: true,
                        c: {
                            f: undefined,
                            g: 1,
                            h: {
                                k: {}
                            }
                        }
                    }
                },
                vCreateModelArg: {
                    hello: "/a/c/h",
                    hi: "/a"
                },
                fnChangeModel: function (oJSONModel) {
                    oJSONModel.setProperty("/hello", { k: [1,2,3] });
                    oJSONModel.setProperty("/hi/c/f", false);
                },
                expectedConfig: {
                    path: "/a",
                    result: {
                        b: true,
                        c: {
                            f: false,
                            g: 1,
                            h: { k: [1, 2, 3] }
                        }
                    }
                }
            },
            {
                testDescription: "setData is called on a defined via single path definition",
                testConfigurationContract: {
                    a: {
                        b: true,
                        c: {
                            f: undefined,
                            g: 1,
                            h: false
                        }
                    }
                },
                vCreateModelArg: "/a/c",
                fnChangeModel: function (oJSONModel) {
                    oJSONModel.setData("/h", true);
                },
                expectedThrows: true
            },
            {
                testDescription: "setProperty is called with relative path and a binding context",
                testConfigurationContract: {
                    a: {
                        b: true,
                        c: {
                            f: "123",
                            g: 1,
                            h: false
                        }
                    }
                },
                vCreateModelArg: "/a",
                fnChangeModel: function (oJSONModel) {
                    var oFakeBindingContext = {
                        isA: function () { return "sap.ui.model.Context"; },
                        getPath: function () { return "/c"; }
                    };
                    oJSONModel.setProperty("h", true, oFakeBindingContext);
                },
                expectedThrows: false,
                expectedConfig: {
                    path: "/a",
                    result: {
                        b: true,
                        c: {
                            f: "123",
                            g: 1,
                            h: true /* updated */
                        }
                    }
                }
            },
            {
                testDescription: "setProperty is called with no binding context and absolute path that does not fully belong to the contract",
                testConfigurationContract: {
                    a: {
                        b: true,
                        c: {
                            f: "123",
                            g: 1,
                            h: false
                        }
                    }
                },
                vCreateModelArg: "/a",
                fnChangeModel: function (oJSONModel, Config) {
                    oJSONModel.setProperty("/c/h", [ { test: "value1" } ]);

                    var oDoable = Config.on("/a/c/h");
                    oDoable.do(function (aArray) {
                        if (typeof aArray !== "object") {
                            return;
                        }
                        oDoable.off();

                        oJSONModel.setProperty("/c/h/0/test", "value2");
                    });
                },
                expectedThrows: false,
                expectedConfig: {
                    path: "/a",
                    result: {
                        b: true,
                        c: {
                            f: "123",
                            g: 1,
                            h: [ { test: "value2" }]
                        }
                    }
                }
            },
            {
                testDescription: "setProperty is called with an absolute path and a binding context",
                testConfigurationContract: {
                    a: {
                        b: true,
                        c: {
                            f: "123",
                            g: 1,
                            h: false
                        }
                    }
                },
                vCreateModelArg: "/a",
                fnChangeModel: function (oJSONModel) {
                    var oFakeBindingContext = {
                        isA: function () { return "sap.ui.model.Context"; },
                        getPath: function () { return "/c"; }
                    };

                    // Because the path is absolute, the binding context is
                    // ignored.
                    oJSONModel.setProperty("/b", "UPDATED", oFakeBindingContext);
                },
                expectedThrows: false,
                expectedConfig: {
                    path: "/a",
                    result: {
                        b: "UPDATED",
                        c: {
                            f: "123",
                            g: 1,
                            h: false
                        }
                    }
                }
            },
            {
                testDescription: "setProperty is called with a deeper binding context",
                testConfigurationContract: {
                    a: {
                        b: true,
                        c: {
                            f: {
                                g: {
                                    h: {
                                        i: 100
                                    }
                                }
                            },
                            g: 1,
                            h: false
                        }
                    }
                },
                vCreateModelArg: "/a/c",
                fnChangeModel: function (oJSONModel) {
                    var oFakeBindingContext = createFakeBindingContextOnPath("/f/g/h");
                    oJSONModel.setProperty("i", 200, oFakeBindingContext);
                },
                expectedThrows: false,
                expectedConfig: {
                    path: "/a",
                    result: {
                        b: true,
                        c: {
                            f: {
                                g: {
                                    h: {
                                        i: 200
                                    }
                                }
                            },
                            g: 1,
                            h: false
                        }
                    }
                }
            },
            {
                testDescription: "setProperty is called with binding context after setting a deep property on the model",
                testConfigurationContract: {
                    a: {
                        b: true,
                        c: {
                            f: {},
                            g: 1,
                            h: false
                        }
                    }
                },
                vCreateModelArg: "/a/c",
                fnChangeModel: function (oJSONModel) {
                    var oFakeBindingContext = createFakeBindingContextOnPath("/f");

                    // set deep property
                    oJSONModel.setProperty("/f", { g: { h: { i: 100 }}});

                    oJSONModel.setProperty("g/h/i", 200, oFakeBindingContext);
                },
                expectedThrows: false,
                expectedConfig: {
                    path: "/a",
                    result: {
                        b: true,
                        c: {
                            f: {
                                g: {
                                    h: {
                                        i: 200
                                    }
                                }
                            },
                            g: 1,
                            h: false
                        }
                    }
                }
            }
        ].forEach(function (oFixture) {

            QUnit.test("createModel: can create model out of a given path when " + oFixture.testDescription, function (assert) {
                // Arrange
                var fnDone = assert.async();

                Config._reset();
                Config.registerConfiguration(null, oFixture.testConfigurationContract);

                var oJSONModel = Config.createModel(oFixture.vCreateModelArg, JSONModel);

                var bThrows = false;
                var sError;
                try {
                    oFixture.fnChangeModel(oJSONModel, Config);
                } catch (oError) {
                    sError = oError;
                    bThrows = true;
                }

                if (oFixture.hasOwnProperty("expectedThrows")) {
                    assert.strictEqual(
                        bThrows,
                        !!oFixture.expectedThrows,
                        "expectation on raising an exception was met."
                            + (sError ? " " + sError : "")
                    );
                    if (bThrows !== oFixture.expectedThrows) {
                        fnDone();
                        return;
                    }
                }

                if (oFixture.expectedConfig) {
                    if (!oFixture.expectedConfig.path || !oFixture.expectedConfig.result) {
                        throw new Error("Please specify both /expectedConfig/path and /expectedConfig/result in test fixture");
                    }
                    Config.once(oFixture.expectedConfig.path).do(function () {
                        assert.deepEqual(
                            Config.last(oFixture.expectedConfig.path),
                            oFixture.expectedConfig.result,
                            "obtained the expected data from the model"
                        );
                        fnDone();
                    });
                } else {
                    fnDone();
                }
            });
        });

    });
});
