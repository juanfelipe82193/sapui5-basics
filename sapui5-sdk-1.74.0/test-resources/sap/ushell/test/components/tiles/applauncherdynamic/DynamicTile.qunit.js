// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/Config",
    "sap/ui/thirdparty/datajs",
    "sap/ushell/resources",
    "sap/ushell/services/Container"
], function (Config, OData) {
    "use strict";

    /* global module, ok, start, strictEqual, stop, test, jQuery, sap, sinon, QUnit */

    module("sap.ushell.components.tiles.applauncherdynamic.DynamicTile", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(start);
            this.oController = new sap.ui.controller(
                "sap.ushell.components.tiles.applauncherdynamic.DynamicTile"
            );

            // use constant language as the test depends on it
            sap.ui.getCore().getConfiguration().setLanguage("en");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
            if (OData && OData.read && OData.read.restore) {
                OData.read.restore();
            }
            if (jQuery.sap.log.error.restore) {
                jQuery.sap.log.error.restore();
            }
            if (jQuery.sap.log.warning.restore) {
                jQuery.sap.log.warning.restore();
            }
            if (this.oController.errorHandlerFn.restore) {
                this.oController.errorHandlerFn.restore();
            }
        }
    });

    [{
        testDescription: "sap-system parameter is given",
        input: {
            navigation_target_url: "test://url",
            "sap-system": "XYZ"
        },
        expected: {
            navigation_target_url: "test://url?sap-system=XYZ"
        }
    },
    {
        testDescription: "sap-system parameter is not given",
        input: {
            navigation_target_url: "test://url"
        },
        expected: {
            navigation_target_url: "test://url"
        }
    }].forEach(function (oFixture) {
        test("constructTargetUrlWithSapSystem, when " + oFixture.testDescription, function (assert) {

            //act
            var sNavigationTargetUrl = oFixture.input.navigation_target_url,
                sSystem = oFixture.input["sap-system"];

            var sResult = this.oController.constructTargetUrlWithSapSystem(sNavigationTargetUrl, sSystem);

            //assert
            assert.strictEqual(sResult, oFixture.expected.navigation_target_url, "is called correct");
        });

    });

    [{
        testDescription: "static service URL",
        input: {
            initialServiceUrl: "test://url?param1=abc",
            resolveUserDefaultParametersResult: {
                url: "test://url?param1=abc" // unchanged
            }
        },
        expected: {
            finalServiceUrl: "test://url?param1=abc&sap-language=EN",
            bODataCalled: true
        }
    }, {
        testDescription: "service URL contains User Default parameter",
        input: {
            initialServiceUrl: "test://url?param1=%%UserDefault.ABC%%",
            resolveUserDefaultParametersResult: {
                url: "test://url?param1=12345"
            }
        },
        expected: {
            finalServiceUrl: "test://url?param1=12345&sap-language=EN",
            bODataCalled: true
        }
    }, {
        testDescription: "service URL contains 1 User Default parameter without values",
        input: {
            initialServiceUrl: "test://url?param1=%%UserDefault.ABC%%",
            resolveUserDefaultParametersResult: {
                url: "test://url?param1=", // empty value
                defaultsWithoutValue: ["UserDefault.ABC"]
            }
        },
        expected: {
            finalServiceUrl: "test://url?param1=&sap-language=EN",
            loggedWarning: "Failed to update data via service\n" +
                "  service URL: test://url?param1=%%UserDefault.ABC%%\n" +
                "  The service URL contains User Default(s) with no set value: UserDefault.ABC",
            bODataCalled: false
        }
    }, {
        testDescription: "service URL contains 2 User Default parameter without values",
        input: {
            initialServiceUrl: "test://url?param1=%%UserDefault.ABC%%&param2=%%UserDefault.DEF%%",
            resolveUserDefaultParametersResult: {
                url: "test://url?param1=&param2=", // empty values
                defaultsWithoutValue: ["UserDefault.ABC", "UserDefault.DEF"]
            }
        },
        expected: {
            finalServiceUrl: "test://url?param1=&param2=&sap-language=EN",
            loggedWarning: "Failed to update data via service\n" +
                "  service URL: test://url?param1=%%UserDefault.ABC%%&param2=%%UserDefault.DEF%%\n" +
                "  The service URL contains User Default(s) with no set value: UserDefault.ABC, UserDefault.DEF",
            bODataCalled: false
        }
    }, {
        testDescription: "service URL contains references which are ignored",
        input: {
            initialServiceUrl: "test://url?param1=%%ABC%%&param2=%%DEF%%",
            resolveUserDefaultParametersResult: {
                url: "test://url?param1=%%ABC%%&param2=%%DEF%%",
                ignoredReferences: ["ABC", "DEF"]
            }
        },
        expected: {
            finalServiceUrl: "test://url?param1=%%ABC%%&param2=%%DEF%%&sap-language=EN",
            loggedError: "Failed to update data via service\n" +
                "  service URL: test://url?param1=%%ABC%%&param2=%%DEF%%\n" +
                "  The service URL contains invalid Reference(s): ABC, DEF",
            bODataCalled: false
        }
    }].forEach(function (oFixture) {
        test("handleInlineCountRequest, when " + oFixture.testDescription, function () {
            // Arrange
            var fnLogWarningStub = sinon.spy(jQuery.sap.log, "warning"),
                fnLogErrorStub = sinon.spy(jQuery.sap.log, "error"),
                fnErrorHandlerStub = sinon.spy(this.oController, "errorHandlerFn"),
                oReferenceResolverService = sap.ushell.Container.getService("ReferenceResolver"),
                fnResolveUserDefaultParameters = sinon.stub(oReferenceResolverService, "resolveUserDefaultParameters")
                .returns((new jQuery.Deferred())
                    .resolve(oFixture.input.resolveUserDefaultParametersResult)
                    .promise()
                );
            var fnODataReadStub = sinon.stub(OData, "read", function (request, success, fail) {
                var oResult = { "__count": "444" };
                success(oResult);
            });

            this.oController.navigationTargetUrl = "test1";
            this.oController.getView = sinon.stub().returns({
                getModel: sinon.stub().returns({
                    getProperty: function () {
                        return {
                            service_url: oFixture.input.initialServiceUrl,
                            navigation_target_url: "#a-b?x=y"
                        };
                    },
                    setProperty: sinon.spy()
                }),
                getViewData: function () {
                    return {
                        chip: {
                            visible: {
                                isVisible: function () {
                                    return true;
                                }
                            },
                            url: {
                                getApplicationSystem: function () {
                                    return "";
                                }
                            }
                        }
                    };
                }
            });

            // Act
            this.oController.prepareToLoadData(0);

            // Assert
            strictEqual(fnResolveUserDefaultParameters.callCount, 1,
                "resolveUserDefaultParameters called once");
            strictEqual(fnResolveUserDefaultParameters.firstCall.args[0], oFixture.input.initialServiceUrl,
                "resolveUserDefaultParameters called with service URL with default params");
            if (oFixture.expected.bODataCalled) {
                strictEqual(this.oController.getView().getModel().setProperty.callCount, 2,
                    "model set properties called 2 time");
                strictEqual(fnODataReadStub.callCount, 1, "OData Read called once");
                strictEqual(fnODataReadStub.firstCall.args[0].requestUri, oFixture.expected.finalServiceUrl,
                    "OData Read called with correct URL and language");
            } else {
                strictEqual(fnODataReadStub.callCount, 0, "OData Read was not called");
            }
            if (oFixture.expected.loggedWarning) {
                strictEqual(fnErrorHandlerStub.callCount, 1, "errorHandlerFn called exactly once");
                strictEqual(fnLogWarningStub.callCount, 1, "prerequisite: only one warning log");
                strictEqual(fnLogWarningStub.firstCall.args[0], oFixture.expected.loggedWarning, "expected warning");
            }
            if (oFixture.expected.loggedError) {
                strictEqual(fnErrorHandlerStub.callCount, 1, "errorHandlerFn called exactly once");
                strictEqual(fnLogErrorStub.callCount, 1, "prerequisite: only one error log");
                strictEqual(fnLogErrorStub.firstCall.args[0], oFixture.expected.loggedError, "expected error");
            }
        });
    });

    test("User Defaults are only resolved once", function () {
        //create oDynamicTileView that has a config.
        // service_url
        // nservice_refresh_interval = 0;
        var sServiceUrlTemplate = "test://url?param1=%%UserDefault.ABC%%";
        var sServiceUrl = "test://url?param1=12345";

        // arrange
        var fnODataReadStub = sinon.stub(OData, "read", function (request, success, fail) {
            var oResult = { "__count": "444" };
            success(oResult);
        });

        var oReferenceResolverService = sap.ushell.Container.getService("ReferenceResolver");
        var fnResolveUserDefaultParameters = sinon.stub(oReferenceResolverService, "resolveUserDefaultParameters")
            .returns((new jQuery.Deferred()).resolve({
                url: sServiceUrl
            }).promise());

        this.oController.navigationTargetUrl = "test1";
        this.oController.getView = sinon.stub().returns({
            getModel: sinon.stub().returns({
                getProperty: function () {
                    return {
                        service_url: sServiceUrlTemplate,
                        navigation_target_url: "#a-b?x=y"
                    };
                },
                setProperty: sinon.spy()
            }),
            getViewData: function () {
                return {
                    chip: {
                        visible: {
                            isVisible: function () {
                                return true;
                            }
                        },
                        url: {
                            getApplicationSystem: function () {
                                return "";
                            }
                        }
                    }
                };
            }
        });

        // act
        this.oController.prepareToLoadData(0);
        this.oController.prepareToLoadData(0);

        // assert
        strictEqual(fnResolveUserDefaultParameters.callCount, 1,
            "resolveUserDefaultParameters called once");
        strictEqual(fnResolveUserDefaultParameters.firstCall.args[0], sServiceUrlTemplate,
            "resolveUserDefaultParameters called with service URL with default params");
        strictEqual(fnODataReadStub.callCount, 2, "OData Read called twice");
    });

    test("No URL Test", function () {
        //create oDynamicTileView that has a config.
        // service_url
        // nservice_refresh_interval = 0;
        var fnODataReadStub = sinon.stub(OData, "read", function (request, success, fail) {
                var oResult = {
                    "__count": 444
                };
                success(oResult);
            }),
            fnErrorHandlerFnStub = sinon.stub(this.oController, "errorHandlerFn");

        this.oController.navigationTargetUrl = "test1";
        this.oController.getView = sinon.stub().returns({
            getModel: sinon.stub().returns({
                getProperty: function () {
                    return { service_url: "" };
                },
                setProperty: sinon.spy()
            }),
            getViewData: function () {
                return {
                    chip: {
                        visible: {
                            isVisible: function () {
                                return true;
                            }
                        }
                    }
                };
            }
        });


        this.oController.prepareToLoadData(0);
        ok(this.oController.getView().getModel().setProperty.callCount === 0, "validate that set property was not called");
        ok(fnErrorHandlerFnStub.called, "errorHandlerFN was called");
        strictEqual(fnODataReadStub.callCount, 0, "OData Read was not called");
    });

    [
        {
            testDescription: "tile is invisible",
            isVisible: false,
            expected: {
                bStopRequestCalled: true,
                bRefreshTileCalled: false
            }
        },
        {
            testDescription: "tile is visible",
            isVisible: true,
            expected: {
                bStopRequestCalled: false,
                bRefreshTileCalled: true
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("visible handler test - " + oFixture.testDescription, function (assert) {
            // Arrange
            var fnStopRequestsStub = sinon.stub(this.oController, 'stopRequests'),
                fnRefreshTileStub = sinon.stub(this.oController, 'refreshTile');

            // Act
            this.oController.visibleHandler(oFixture.isVisible);

            // Assert
            assert.strictEqual(fnStopRequestsStub.called, oFixture.expected.bStopRequestCalled, "stopRequests() was called/not called like expected");
            assert.strictEqual(fnRefreshTileStub.called, oFixture.expected.bRefreshTileCalled, "refreshTile() was called/not called like expected");
        });
    });

    test("refresh handler test", function () {
        // Arrange
        var fnRefreshTileStub = sinon.stub(this.oController, 'refreshTile');

        this.oController.bNeedsRefresh = false;

        // Act
        this.oController.refreshHandler();

        // Assert
        ok(fnRefreshTileStub.called, "refreshTile() was called like expected");
        ok(this.oController.bNeedsRefresh, "refresh status flag is set correctly");
    });

    [
        {
            testDescription: "tile is invisible, refresh is not needed and a request is not pending",
            arrange: {
                bNeedsRefresh: false,
                isVisible: false,
                bRequestPending: false
            },
            expected: {
                bPrepareToLoadDataCalled: false,
                bNeedsRefresh: false
            }
        },
        {
            testDescription: "tile is invisible, refresh is not needed and a request is pending",
            arrange: {
                bNeedsRefresh: false,
                isVisible: false,
                bRequestPending: true
            },
            expected: {
                bPrepareToLoadDataCalled: false,
                bNeedsRefresh: false
            }
        },
        {
            testDescription: "tile is invisible, refresh is needed and a request is not pending",
            arrange: {
                bNeedsRefresh: true,
                isVisible: false,
                bRequestPending: false
            },
            expected: {
                bPrepareToLoadDataCalled: false,
                bNeedsRefresh: true
            }
        },
        {
            testDescription: "tile is invisible, refresh is needed and a request is pending",
            arrange: {
                bNeedsRefresh: true,
                isVisible: false,
                bRequestPending: true
            },
            expected: {
                bPrepareToLoadDataCalled: false,
                bNeedsRefresh: true
            }
        },
        {
            testDescription: "tile is visible, refresh is not needed and a request is not pending",
            arrange: {
                bNeedsRefresh: false,
                isVisible: true,
                bRequestPending: false
            },
            expected: {
                bPrepareToLoadDataCalled: false,
                bNeedsRefresh: false
            }
        },
        {
            testDescription: "tile is visible, refresh is not needed and a request is pending",
            arrange: {
                bNeedsRefresh: false,
                isVisible: true,
                bRequestPending: true
            },
            expected: {
                bPrepareToLoadDataCalled: false,
                bNeedsRefresh: false
            }
        },
        {
            testDescription: "tile is visible, refresh is needed and a request is not pending",
            arrange: {
                bNeedsRefresh: true,
                isVisible: true,
                bRequestPending: false
            },
            expected: {
                bPrepareToLoadDataCalled: true,
                bNeedsRefresh: false
            }
        },
        {
            testDescription: "tile is visible, refresh is needed and a request is pending",
            arrange: {
                bNeedsRefresh: true,
                isVisible: true,
                bRequestPending: true
            },
            expected: {
                bPrepareToLoadDataCalled: false,
                bNeedsRefresh: false
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("refresh tile test - " + oFixture.testDescription, function (assert) {
            // Arrange
            var fnPrepareToLoadDataStub = sinon.stub(this.oController, 'prepareToLoadData');
            this.oController.bNeedsRefresh = oFixture.arrange.bNeedsRefresh;
            this.oController.oDataRequest = oFixture.arrange.bRequestPending;
            this.oController.getView = sinon.stub().returns({
                getViewData : sinon.stub().returns({
                    chip : {
                        visible : {
                            isVisible : function () {
                                return oFixture.arrange.isVisible;
                            }
                        }
                    }
                })
            });

            // Act
            this.oController.refreshTile();

            // Assert
            assert.strictEqual(fnPrepareToLoadDataStub.called, oFixture.expected.bPrepareToLoadDataCalled, "prepareToLoadData() was called/not called like expected");
            assert.strictEqual(this.oController.bNeedsRefresh, oFixture.expected.bNeedsRefresh, "refresh status flag is set correctly");
        });
    });

    [
        {
            testDescription: "no other interval is running",
            arrange: {
                iNrOfTimerRunning: 0
            },
            expected: {
                iNrOfTimerRunning: 0,
                bNeedsRefresh: true,
                bRefreshTileCalled: true
            }
        },
        {
            testDescription: "another interval is running",
            arrange: {
                iNrOfTimerRunning: 1
            },
            expected: {
                iNrOfTimerRunning: 1,
                bNeedsRefresh: false,
                bRefreshTileCalled: false
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("refresh after intervall test - " + oFixture.testDescription, function (assert) {
            // Arrange
            var fnRefreshTileStub = sinon.stub(this.oController, 'refreshTile'),
                that = this;
            this.oController.bNeedsRefresh = false;
            this.oController.iNrOfTimerRunning = oFixture.arrange.iNrOfTimerRunning;

            // Act
            this.oController.refeshAfterInterval(0);

            // Assert
            var done = assert.async();

            setTimeout(function () {
                assert.strictEqual(fnRefreshTileStub.called, oFixture.expected.bRefreshTileCalled, "refreshTile() was called/not called like expected");
                assert.strictEqual(that.oController.bNeedsRefresh, oFixture.expected.bNeedsRefresh, "refresh status flag is set correctly");
                done();
            }, 0);
        });
    });


    [
        {
            testDescription: "refresh interval is 0",
            arrange: {
                iRefreshInterval: 0
            },
            expected: {
                bRefeshAfterInterval: false
            }
        },
        {
            testDescription: "refresh interval is 5",
            arrange: {
                iRefreshInterval: 5
            },
            expected: {
                iRefreshInterval: 10,
                bRefeshAfterInterval: true
            }
        },
        {
            testDescription: "refresh interval is 15",
            arrange: {
                iRefreshInterval: 15
            },
            expected: {
                iRefreshInterval: 15,
                bRefeshAfterInterval: true
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("success handler test - " + oFixture.testDescription, function (assert) {
            // Arrange
            var fnRefeshAfterIntervalStub = sinon.stub(this.oController, 'refeshAfterInterval'),
                fnGetDataToDisplayStub = sinon.stub(sap.ushell.components.tiles.utilsRT, 'getDataToDisplay'),
                fnAddParamsToUrlStub = sinon.stub(sap.ushell.components.tiles.utilsRT, 'addParamsToUrl');

            sinon.stub(this.oController, 'extractData');
            this.oController.getView = sinon.stub().returns({
                getModel: sinon.stub().returns({
                    getProperty: function () {
                        return {
                            service_refresh_interval: oFixture.arrange.iRefreshInterval,
                            navigation_target_url: 'someurl'
                        };
                    },
                    setProperty: sinon.stub()
                }),
                getViewData : sinon.stub().returns({
                    chip: {
                        url: {
                            getApplicationSystem: function () {
                                return "";
                            }
                        }
                    }
                })
            });

            // Act
            this.oController.successHandlerFn("","");

            // Assert
            assert.strictEqual(fnRefeshAfterIntervalStub.called, oFixture.expected.bRefeshAfterInterval, "refreshAfterInterval was called/not called like expected");
            if (oFixture.expected.bRefeshAfterInterval) {
                assert.strictEqual(fnRefeshAfterIntervalStub.getCall(0).args[0], oFixture.expected.iRefreshInterval, "requested interval is as expected");
            }

            fnGetDataToDisplayStub.restore();
            fnAddParamsToUrlStub.restore();
        });
    });

    test("errorHandlerFn logs message with correct log level", function () {
        // Setup
        sinon.stub(this.oController, "getView", function () {
            return {
                getModel: function () {
                    return {
                        getProperty: function () {
                            return {
                                service_url: "test://url"
                            };
                        },

                        setProperty: function () { }
                    };
                }
            };
        });

        var sapLogInfoSpy = sinon.spy(jQuery.sap.log, "info"),
            sapLogWarningSpy = sinon.spy(jQuery.sap.log, "warning"),
            sapLogErrorSpy = sinon.spy(jQuery.sap.log, "error");

        var oMessage;

        // Test case - message equals "Request Aborted".
        oMessage = { message: "Request aborted" };
        this.oController.errorHandlerFn(oMessage, false);
        ok(sapLogInfoSpy.called, "OData load cancellation logged with level `info`");

        // Test case - message NOT equals "Request Aborted" and is a warning.
        oMessage = { message: "something else" };
        this.oController.errorHandlerFn(oMessage, true);
        ok(sapLogWarningSpy.called, "OData load cancellation logged with level `warning`");

        // Test case - message NOT equals "Request Aborted" and is an error.
        oMessage = { message: "something else" };
        this.oController.errorHandlerFn(oMessage, false);
        ok(sapLogErrorSpy.called, "OData load cancellation logged with level `error`");
    });

    test("test sizeBehavior property of the Dynamic tile", function (assert) {
        var sSizeBehaviorStart,
            sNewSizeBehavior;
        var oView = sap.ui.view({
            viewName: "sap.ushell.components.tiles.applauncherdynamic.DynamicTile",
            type: sap.ui.core.mvc.ViewType.JS,
            viewData: {
                chip: {
                    configurationUi: {
                        isEnabled: function () {
                            return false;
                        }
                    },
                    configuration: {
                        getParameterValueAsString: function () {
                            return "";
                        }
                    },
                    bag: {
                        getBag: function () {
                            return {
                                getPropertyNames: function () {
                                    return [];
                                },
                                getTextNames: function () {
                                    return [];
                                }
                            };
                        }
                    },
                    url: {
                        getApplicationSystem: function () {
                            return "";
                        }
                    }
                }
            }
        }),
        oModel = oView.getModel();
        var done = assert.async();

        if (Config.last("/core/home/sizeBehavior") === "Responsive") {
            sSizeBehaviorStart = "Responsive";
            sNewSizeBehavior = "Small";
        } else {
            sSizeBehaviorStart = "Small";
            sNewSizeBehavior = "Responsive";
        }
        // Check if default is set
        ok(oModel.getProperty("/sizeBehavior") === sSizeBehaviorStart, "Size correctly set at startup.");
        // emit new configuration
        Config.emit("/core/home/sizeBehavior", sNewSizeBehavior);
        // check if size property has changed
        Config.once("/core/home/sizeBehavior").do(function () {
            ok(oModel.getProperty("/sizeBehavior") === sNewSizeBehavior, "Size correctly set after change.");
            done();
        });
    });

    test("loadData: sap-client is set if url is relative", function (assert) {
        var ODataStub = sinon.stub(OData, "read"),
            oGetClientStub = sinon.stub(sap.ushell.Container.getLogonSystem(), "getClient").returns("XYZ");

        //act
        this.oController.loadData({
            url: "/sap/opu/odata/sap/ZFAR_CUSTOMER_LINE_ITEMS2_SRV/Item"
        });

        //assert
        assert.strictEqual(ODataStub.getCall(0).args[0].headers["sap-client"], "XYZ", "sap-client is set in the header");

        oGetClientStub.restore();
        ODataStub.restore();
    });

    test("loadData: sap-client is not set if url is absolute", function (assert) {
        var ODataStub = sinon.stub(OData, "read"),
            oGetClientStub = sinon.stub(sap.ushell.Container.getLogonSystem(), "getClient").returns("XYZ");

        //act
        this.oController.loadData({
            url: "test://url"
        });

        //assert
        assert.strictEqual(ODataStub.getCall(0).args[0].headers["sap-client"], undefined, "sap-client should not be set in the header");

        oGetClientStub.restore();
        ODataStub.restore();
    });

});
