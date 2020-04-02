// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.pages.controller.PagesRuntime
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/components/pages/controller/PageRuntime.controller",
    "sap/ushell/resources",
    "sap/ushell/Config",
    "sap/m/MessageToast",
    "sap/ushell/components/pages/StateManager",
    "sap/base/util/ObjectPath",
    "sap/ushell/components/pages/ActionMode",
    "sap/base/Log",
    "sap/ushell/EventHub"
], function (PagesRuntimeController, resources, Config, MessageToast, oStateManager, ObjectPath, ActionMode, Log, EventHub) {
    "use strict";

    var sandbox = sinon.createSandbox({});

    QUnit.start();

    QUnit.module("The onInit function", {
        beforeEach: function () {
            this.oAttachMatchedStub = sinon.stub();
            this.oGetServiceAsyncStub = sinon.stub();
            this.oGetRouteStub = sinon.stub().returns({
                attachMatched: this.oAttachMatchedStub
            });
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub,
                getRenderer: function () {
                    return {
                        getRouter: function () {
                            return {
                                getRoute: this.oGetRouteStub
                            };
                        }.bind(this)
                    };
                }.bind(this)
            };

            this.oGetModelStub = sinon.stub();
            this.oGetServiceAsyncStub.withArgs("Pages").returns(
                Promise.resolve({
                    getModel: this.oGetModelStub
                })
            );
            this.oStateManagerInitStub = sandbox.stub(oStateManager, "init");

            this.oController = new PagesRuntimeController();
            this.oOpenFLPPageStub = sandbox.stub(this.oController, "_openFLPPage");
            this.oAttachNavigateStub = sinon.stub();
            this.oByIdStub = sinon.stub();
            this.oNavContainer = {
                attachNavigate: this.oAttachNavigateStub
            };
            this.oByIdStub.withArgs("pagesRuntimeNavContainer").returns(this.oNavContainer);
            this.oByIdStub.withArgs("pagesNavContainer").returns(this.oNavContainer);
            this.oController.byId = this.oByIdStub;

            this.oSetModelStub = sinon.stub();
            this.oController.getView = function () {
                return {
                    setModel: this.oSetModelStub
                };
            }.bind(this);

            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/shell/enablePersonalization");

            this.oEventHubDoStub = sinon.stub();
            this.oEventHubOnceStub = sandbox.stub(EventHub, "once");
            this.oEventHubOnceStub.withArgs("PagesRuntimeRendered").returns({
                do: this.oEventHubDoStub
            });
            this.oCreateActionModeButtonStub = sandbox.stub(this.oController, "_createActionModeButton");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Gets pages service and URL parsing service asynchronously", function (assert) {
        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oGetServiceAsyncStub.callCount, 3, "The method getServiceAsync is called 3 times");
        assert.deepEqual(this.oGetServiceAsyncStub.getCall(0).args, ["VisualizationLoading"], "The method getServiceAsync is called with 'VisualizationLoading'");
        assert.deepEqual(this.oGetServiceAsyncStub.getCall(1).args, ["Pages"], "The method getServiceAsync is called with 'Pages'");
        assert.deepEqual(this.oGetServiceAsyncStub.getCall(2).args, ["URLParsing"], "The method getServiceAsync is called with 'URLParsing'");
    });

    QUnit.test("Sets the correct data in the view settings model during instantiation", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/home/sizeBehavior").returns("Responsive");
        var oExpectedJSONModelData = {
            sizeBehavior: "Responsive",
            actionModeActive: false
        };

        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oSetModelStub.firstCall.args[0].getMetadata().getName(), "sap.ui.model.json.JSONModel", "The assigned model is of type sap.ui.model.json.JSONModel.");
        assert.deepEqual(this.oSetModelStub.firstCall.args[0].getData(), oExpectedJSONModelData, "The model data is correct.");
        assert.strictEqual(this.oSetModelStub.firstCall.args[1], "viewSettings", "The model is set to the view with name 'viewSettings'.");
    });

    QUnit.test("Updates the sizeBehavior property on the view settings model on configuration change", function (assert) {
        // Arrange
        var done = assert.async();
        Config.emit("/core/home/sizeBehavior", "NewSizeBehaviour");

        // Act
        this.oController.onInit();

        // Assert
        Config.once("/core/home/sizeBehavior").do(function () {
            assert.strictEqual(this.oController._oViewSettingsModel.getProperty("/sizeBehavior"), "NewSizeBehaviour", "");
            done();
        }.bind(this));
    });

    QUnit.test("Sets the correct data in the error page model during instantiation", function (assert) {
        // Arrange
        var oExpectedJSONModelData = {
            icon: "sap-icon://documents",
            text: "",
            description: "",
            details: ""
        };

        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oSetModelStub.getCall(1).args[0].getMetadata().getName(), "sap.ui.model.json.JSONModel", "The assigned model is of type sap.ui.model.json.JSONModel.");
        assert.deepEqual(this.oSetModelStub.getCall(1).args[0].getData(), oExpectedJSONModelData, "The model data is correct.");
        assert.strictEqual(this.oSetModelStub.getCall(1).args[1], "errorPage", "The model is set to the view with name 'errorPage'.");
    });

    QUnit.test("Retrieves a model from pages services and set the model for the page runtime controller", function (assert) {
        // Arrange
        var oModel = {
            id: "model1"
        };
        this.oGetModelStub.returns(oModel);

        // Act
        this.oController.onInit();

        // Assert
        return this.oController._oPagesService.then(function () {
            assert.strictEqual(this.oGetModelStub.callCount, 1, "The method getModel is called once");
            assert.deepEqual(this.oSetModelStub.getCall(2).args[0], oModel, "The method setModel is called with correct parameters");
        }.bind(this));
    });

    QUnit.test("Attaches handlers to matched routes", function (assert) {
        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oAttachMatchedStub.callCount, 2, "The function attachMatched is called twice");
        assert.strictEqual(this.oGetRouteStub.getCall(0).args[0], "home", "The function attachMatched is called on the 'home' route");
        assert.strictEqual(this.oGetRouteStub.getCall(1).args[0], "openFLPPage", "The function attachMatched is called on the 'openFLPPage' route");
        assert.strictEqual(this.oAttachMatchedStub.getCall(0).args[0], this.oOpenFLPPageStub, "The function attachMatched is called with correct parameters");
        assert.strictEqual(this.oAttachMatchedStub.getCall(1).args[0], this.oOpenFLPPageStub, "The function attachMatched is called with correct parameters");
    });

    QUnit.test("Calls the 'init' method of StateManager", function (assert) {
        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oStateManagerInitStub.callCount, 1, "The method 'init' of StateManager is called once");
        assert.deepEqual(this.oStateManagerInitStub.getCall(0).args, [this.oNavContainer, this.oNavContainer], "The method 'init' of StateManager is called once");
    });

    QUnit.test("Calls _createActionModeButton if personalization is enabled", function (assert) {
        //Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);

        //Act
        this.oController.onInit();
        this.oEventHubDoStub.getCall(0).args[0]();

        //Assert
        assert.strictEqual(this.oCreateActionModeButtonStub.callCount, 1, "_createActionModeButton was called once");
    });

    QUnit.test("Does not call _createActionModeButton if personalization is disabled", function (assert) {
        //Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);

        //Act
        this.oController.onInit();
        this.oEventHubDoStub.getCall(0).args[0]();

        //Assert
        assert.strictEqual(this.oCreateActionModeButtonStub.callCount, 0, "_createActionModeButton was not called");
    });

    QUnit.module("The function _getPageAndSpaceId", {
        beforeEach: function () {
            this.oGetHashStub = sinon.stub();
            window.hasher = {
                getHash: this.oGetHashStub
            };
            this.oController = new PagesRuntimeController();
            this.oParseShellHashStub = sinon.stub();
            this.oController._oURLParsingService = Promise.resolve({
                parseShellHash: this.oParseShellHashStub
            });
            this.oParsePageAndSpaceIdStub = sinon.stub(this.oController, "_parsePageAndSpaceId");
        },
        afterEach: function () {
            this.oParsePageAndSpaceIdStub.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Calls the function _parsePageAndSpaceId with the pageId and spaceId returned by the URL Parsing service", function (assert) {
        // Arrange
        this.oParseShellHashStub.returns({
            semanticObject: "Shell",
            action: "home",
            params: {
                pageId: ["page1"],
                spaceId: ["space1"]
            }
        });
        var oExpectedResult = [
            ["page1"],
            ["space1"],
            {
                semanticObject: "Shell",
                action: "home"
            }
        ];

        // Act
        var oResult = this.oController._getPageAndSpaceId();

        // Assert
        return oResult.then(function () {
            assert.ok(this.oParsePageAndSpaceIdStub.calledOnce, "The function _parsePageAndSpaceId is called once");
            assert.deepEqual(this.oParsePageAndSpaceIdStub.getCall(0).args, oExpectedResult, "The function _parsePageAndSpaceId is called with correct parameters");
        }.bind(this));
    });

    QUnit.test("Calls the function _parsePageAndSpaceId with the emtpy arrays when no pageId and spaceId are returned by the URL Parsing service", function (assert) {
        // Arrange
        this.oParseShellHashStub.returns({});
        var oExpectedResult = [
            [],
            [],
            {
                semanticObject: "",
                action: ""
            }
        ];

        // Act
        var oResult = this.oController._getPageAndSpaceId();

        // Assert
        return oResult.then(function () {
            assert.ok(this.oParsePageAndSpaceIdStub.calledOnce, "The function _parsePageAndSpaceId is called once");
            assert.deepEqual(this.oParsePageAndSpaceIdStub.getCall(0).args, oExpectedResult, "The function _parsePageAndSpaceId is called with correct parameters");
        }.bind(this));
    });

    QUnit.test("Returns the returned value of the function _parsePageAndSpaceId", function (assert) {
        // Arrange
        this.oParseShellHashStub.returns({});
        this.oParsePageAndSpaceIdStub.returns({
            pageId: "page1",
            spaceId: "space1"
        });

        // Act
        return this.oController._getPageAndSpaceId().then(function (result) {
            // Assert
            assert.ok(this.oParsePageAndSpaceIdStub.calledOnce, "The function _parsePageAndSpaceId is called once");
            assert.deepEqual(result, {pageId: "page1", spaceId: "space1"}, "The correct result is returned");
        }.bind(this));
    });

    QUnit.module("The function _getAssignedPage", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oResourceI18nGetTextStub = sinon.stub(resources.i18n, "getText").returns("This is a translated error message.");
            this.oGetMenuEntriesStub = sinon.stub();
            this.oMenuServiceStub = sinon.stub().withArgs("Menu").returns(Promise.resolve({
                getMenuEntries: this.oGetMenuEntriesStub
            }));
            sap.ushell.Container = {
                getServiceAsync: this.oMenuServiceStub
            };
        },
        afterEach: function () {
            this.oResourceI18nGetTextStub.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Returns a rejected promise with an error message when there is no menu entry", function (assert) {
        // Arrange
        this.oGetMenuEntriesStub.resolves([]);

        // Act
        return this.oController._getAssignedPage().catch(function (error) {
            // Assert
            assert.ok(this.oGetMenuEntriesStub.calledOnce, "The function getMenuEntries of the menu service is called once.");
            assert.strictEqual(error, "This is a translated error message.", "A rejected promise with the correct error message is returned.");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise with an error message when the first menu entry doesn't have a space and/or page id", function (assert) {
        // Arrange
        this.oGetMenuEntriesStub.resolves([{
            uid: "entry1",
            title: "First space",
            type: "intent",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "some-parameter", value: "param-value" }
                ]
            }
        }]);

        // Act
        return this.oController._getAssignedPage().catch(function (error) {
            // Assert
            assert.ok(this.oGetMenuEntriesStub.calledOnce, "The function getMenuEntries of the menu service is called once.");
            assert.strictEqual(error, "This is a translated error message.", "A rejected promise with the correct error message is returned.");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise with an error message when the first menu entry doesn't have any parameters", function (assert) {
        // Arrange
        this.oGetMenuEntriesStub.resolves([{
            uid: "entry1",
            title: "First space",
            type: "intent",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage"
            }
        }]);

        // Act
        return this.oController._getAssignedPage().catch(function (error) {
            // Assert
            assert.ok(this.oGetMenuEntriesStub.calledOnce, "The function getMenuEntries of the menu service is called once.");
            assert.strictEqual(error, "This is a translated error message.", "A rejected promise with the correct error message is returned.");
        }.bind(this));
    });

    QUnit.test("Returns a promise which resolves to an object with a spaceId and a pageId", function (assert) {
        // Arrange
        this.oGetMenuEntriesStub.resolves([{
            uid: "entry1",
            title: "First space",
            type: "intent",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "spaceId", value: "space1" },
                    { name: "pageId", value: "page1" }
                ]
            }
        }]);

        var oExpectedResult = {
            pageId: "page1",
            spaceId: "space1"
        };

        // Act
        return this.oController._getAssignedPage().then(function (result) {
            // Assert
            assert.deepEqual(result, oExpectedResult, "The resolved default page is 'page1' and default space is 'space1.");
        });
    });

    QUnit.module("The function _openFLPPage", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oLoadVisualizationDataStub = sinon.stub().resolves();
            this.oController._oVisualizationLoadingService = Promise.resolve({
                loadVisualizationData: this.oLoadVisualizationDataStub
            });
            this.oLoadPageStub = sinon.stub().resolves();
            this.oController._oPagesService = Promise.resolve({
                loadPage: this.oLoadPageStub
            });
            this.oGetPageAndSpaceIdStub = sinon.stub(this.oController, "_getPageAndSpaceId").resolves({
                spaceId: "space1",
                pageId: "page1"
            });
            this.oNavigateStub = sinon.stub(this.oController, "_navigate");
            this.oResourceI18nGetTextStub = sinon.stub(resources.i18n, "getText").returns("This is a translated error message.");
            this.oNavContainerToStub = sinon.stub();
            this.oSetPropertyStub = sinon.stub();
            this.oController._oErrorPageModel = {
                setProperty: this.oSetPropertyStub
            };
            this.oController.oPagesRuntimeNavContainer = {
                to: this.oNavContainerToStub
            };
            this.oController.oErrorPage = {
                id: "page-1"
            };
        },
        afterEach: function () {
            this.oGetPageAndSpaceIdStub.restore();
            this.oNavigateStub.restore();
            this.oResourceI18nGetTextStub.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Gets the pageId and spaceId", function (assert) {
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oGetPageAndSpaceIdStub.callCount, 1, "The function _getPageAndSpaceId is called once.");
        }.bind(this));
    });

    QUnit.test("Loads the visualization data", function (assert) {
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oLoadVisualizationDataStub.callCount, 1, "The function loadVisualizationData of the VisualizationLoading service is called once.");
        }.bind(this));
    });

    QUnit.test("Loads the required page", function (assert) {
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.deepEqual(this.oLoadPageStub.getCall(0).args, ["page1"], "The function loadPage of the pages service is called with page id 'page1'.");
        }.bind(this));
    });

    QUnit.test("Navigates to the specified page", function (assert) {
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.deepEqual(this.oNavigateStub.firstCall.args, ["page1"], "The function navigate is called with page id 'page1.");
        }.bind(this));
    });

    QUnit.test("Executes the service functions in the right order", function (assert) {
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oLoadVisualizationDataStub.callCount, 1, "The function loadVisualizationData of the VisualizationLoading service is called once.");
            assert.ok(this.oLoadPageStub.calledAfter(this.oLoadVisualizationDataStub), "The function loadPage of the Pages service is called after loadVisualizationData.");
            assert.ok(this.oNavigateStub.calledAfter(this.oLoadPageStub), "The function _navigate of the PagesRuntime controller is called after loadPage.");
        }.bind(this));
    });

    QUnit.test("Navigates to an error page when _getPageAndSpaceId returns a rejected promise", function (assert) {
        // Arrange
        var oError = {
            error: "This is an error"
        };
        this.oGetPageAndSpaceIdStub.rejects(oError);

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oNavContainerToStub.callCount, 1, "The function 'to' of navContainer is called once.");
            assert.strictEqual(this.oNavContainerToStub.getCall(0).args[0], this.oController.oErrorPage, "The function 'to' of navContainer is called parameters.");
        }.bind(this));
    });

    QUnit.test("Sets the properties in the error page model when _getPageAndSpaceId returns a rejected promise", function (assert) {
        // Arrange
        var oError = {
            error: "This is an error"
        };
        this.oGetPageAndSpaceIdStub.rejects(oError);

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oSetPropertyStub.callCount, 4, "The method setProperty of the error page model is called 4 times.");
            assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/icon", "sap-icon://documents"], "The method setProperty is called with correct parameters.");
            assert.deepEqual(this.oSetPropertyStub.getCall(1).args, ["/text", oError], "The method setProperty is called with correct parameters.");
            assert.deepEqual(this.oSetPropertyStub.getCall(2).args, ["/description", ""], "The method setProperty is called with correct parameters.");
            assert.deepEqual(this.oSetPropertyStub.getCall(3).args, ["/details", ""], "The method setProperty is called with correct parameters.");
        }.bind(this));
    });

    QUnit.test("Sets the properties in the error page model when an error that is a javascript error object occurs", function (assert) {
        // Arrange
        this.oController._oPagesService = Promise.reject(new Error("A javascript error object"));

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.deepEqual(this.oResourceI18nGetTextStub.getCall(0).args, ["PageRuntime.GeneralError.Text"], "The function getText of resource.i18n is called with correct parameters.");
            assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The method setProperty of the error page model is called once.");
            assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/text", "This is a translated error message."], "The method setProperty is called with correct parameters.");
        }.bind(this));
    });

    QUnit.test("Navigates to an error page when an error that is a javascript error object occurs", function (assert) {
        // Arrange
        this.oController._oPagesService = Promise.reject(new Error("A javascript error object"));

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oNavContainerToStub.callCount, 1, "The function 'to' of navContainer is called once.");
            assert.strictEqual(this.oNavContainerToStub.getCall(0).args[0], this.oController.oErrorPage, "The function 'to' of navContainer is called parameters.");
        }.bind(this));
    });

    QUnit.test("Sets the properties in the error page model when there is an error", function (assert) {
        // Arrange
        var oError = {
            error: "This is an error"
        };
        this.oController._oPagesService = Promise.reject(oError);

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 2, "The function getText of resource.i18n is called twice.");
            assert.strictEqual(this.oSetPropertyStub.callCount, 4, "The method setProperty of the error page model is called 4 times.");
            assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/icon", "sap-icon://documents"], "The method setProperty is called with correct parameters.");
            assert.deepEqual(this.oSetPropertyStub.getCall(1).args, ["/text", "This is a translated error message."], "The method setProperty is called with correct parameters.");
            assert.deepEqual(this.oSetPropertyStub.getCall(2).args, ["/description", ""], "The method setProperty is called with correct parameters.");
            assert.deepEqual(this.oSetPropertyStub.getCall(3).args, ["/details", "This is a translated error message." + JSON.stringify(oError)], "The method setProperty is called with correct parameters.");
        }.bind(this));
    });

    QUnit.test("Navigates to an error page when there is an error", function (assert) {
        // Arrange
        this.oController._oPagesService = Promise.reject();

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oNavContainerToStub.callCount, 1, "The function 'to' of navContainer is called once.");
            assert.strictEqual(this.oNavContainerToStub.getCall(0).args[0], this.oController.oErrorPage, "The function 'to' of navContainer is called parameters.");
        }.bind(this));
    });

    QUnit.test("Updates the sCurrentTargetPageId property with the current pageId", function (assert) {
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oController.sCurrentTargetPageId, "page1", "The correct value has been found.");
        }.bind(this));
    });

    QUnit.test("Does not call _navigate if the pageId is no longer the current target", function (assert) {
        // Arrange
        this.oController._oPagesService = Promise.resolve({
            loadPage: function () {
                // Use fake implementation to asynchronously set sCurrentTargetPageId.
                // (Otherwise, the resolver function is executed synchronously.)
                return new Promise(function (resolve) {
                    this.oController.sCurrentTargetPageId = "otherPageId";
                    resolve();
                }.bind(this));
            }.bind(this)
        });

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oNavigateStub.callCount, 0, "The function _navigate has not been called.");
        }.bind(this));
    });

    QUnit.module("The function _navigate", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.aPages = [];
            this.oNavContainerToStub = sinon.stub();
            this.oNavContainerGetPagesStub = function () {
                return this.aPages.map(function (value) {
                    return {
                        data: function () {
                            return value;
                        }
                    };
                });
            }.bind(this);
            this.oController.oPagesNavContainer = {
                getPages: this.oNavContainerGetPagesStub,
                to: this.oNavContainerToStub
            };
            this.oController.oPagesRuntimeNavContainer = {
                to: this.oNavContainerToStub
            };
        },
        afterEach: function () {
            this.oController.destroy();
        }
    });

    QUnit.test("Navigates using the NavContainer to the specified page", function (assert) {
        // Arrange
        this.aPages = ["/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_PAGE_2"];

        // Act
        this.oController._navigate("/UI2/FLP_DEMO_PAGE");

        // Assert
        assert.strictEqual(this.oNavContainerToStub.callCount, 2, "The 'to' function of the NavContainer was called twice.");
    });

    QUnit.test("Doesn't navigate if the navigation container has no pages", function (assert) {
        // Arrange
        this.aPages = [];

        // Act
        this.oController._navigate("/UI2/FLP_DEMO_PAGE");

        // Assert
        assert.strictEqual(this.oNavContainerToStub.callCount, 0, "The 'to' function of the NavContainer wasn't called.");
    });

    QUnit.test("Doesn't navigate if no page contains the target page id", function (assert) {
        // Arrange
        this.aPages = ["/UI2/FLP_DEMO_PAGE"];

        // Act
        this.oController._navigate("ZTEST");

        // Assert
        assert.strictEqual(this.oNavContainerToStub.callCount, 0, "The 'to' function of the NavContainer wasn't called.");
    });

    QUnit.module("The function _visualizationFactory", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oInstantiateVisualizationStub = sinon.stub().returns("sap.ushell.ui.launchpad.VizInstanceDefault");
            this.oController._oResolvedVisualizationLoadingService = {
                instantiateVisualization: this.oInstantiateVisualizationStub
            };
        },
        afterEach: function () {
            this.oController.destroy();
        }
    });

    QUnit.test("Instantiates a visualization from the the VisualizationLoading service", function (assert) {
        // Arrange
        var oContext = {
            getObject: function () {
                return {
                    tileId: ""
                };
            }
        };

        var oExpectedVisualizationData = {
            tileId: ""
        };

        // Act
        var oControl = this.oController._visualizationFactory("someId", oContext);

        // Assert
        assert.deepEqual(this.oInstantiateVisualizationStub.firstCall.args, [oExpectedVisualizationData], "The function instantiateVisualization of the VisualizationLoading service was called with the right visualization data.");
        assert.strictEqual(oControl, "sap.ushell.ui.launchpad.VizInstanceDefault", "The function returns the control from the VisualizationLoading service.");
    });

    QUnit.test("Returns a GenericTile if the VisualizationLoading service is not resolved", function (assert) {
        // Arrange
        delete this.oController._oResolvedVisualizationLoadingService;

        // Act
        var oControl = this.oController._visualizationFactory();

        // Assert
        assert.strictEqual(oControl.getMetadata().getName(), "sap.m.GenericTile", "The function returns a sap.m.GenericTile as a fallback if the VisualizationLoading service is not resolved.");
        assert.strictEqual(oControl.getState(), "Failed", "The returned GenericTile has a failed loading state.");
    });

    QUnit.module("The function onExit", {
        beforeEach: function () {
            this.oStateManagerExitStub = sandbox.stub(oStateManager, "exit");
            this.oController = new PagesRuntimeController();
            this.oHomeDetachedMatchedStub = sinon.stub();
            this.oOpenFLPPageDetachedMatchedStub = sinon.stub();
            this.oController.oContainerRouter = {
                getRoute: function () { }
            };
            this.oOffStub = sinon.stub();
            this.oController._aConfigListeners = {
                off: this.oOffStub
            };
            this.oGetRouteStub = sandbox.stub(this.oController.oContainerRouter, "getRoute");
            this.oGetRouteStub.withArgs("home").returns({
                detachMatched: this.oHomeDetachedMatchedStub
            });
            this.oGetRouteStub.withArgs("openFLPPage").returns({
                detachMatched: this.oOpenFLPPageDetachedMatchedStub
            });
            this.oEventHubOffStub = sinon.stub();
            this.oController.oEventHubListener = {
                off: this.oEventHubOffStub
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Detaches matched event from home route", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oHomeDetachedMatchedStub.callCount, 1, "The function 'detachMatched' was called for route 'home'.");
    });

    QUnit.test("Detaches matched event from openFLPPage route", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oOpenFLPPageDetachedMatchedStub.callCount, 1, "The function 'detachMatched' was called for route 'openFLPPage'.");
    });

    QUnit.test("Detaches all config listeners", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oOffStub.callCount, 1, "The function 'off' was called.");
    });

    QUnit.test("Calls the exit of the state manager", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oStateManagerExitStub.callCount, 1, "The function 'exit' was called once.");
    });

    QUnit.test("Detaches all EventHub listeners", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oEventHubOffStub.callCount, 1, "The function 'off' was called.");
    });

    QUnit.module("The function _pressViewDetailsButton", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oSetPropertyStub = sinon.stub();
            this.oGetPropertyStub = sinon.stub();
            this.oController._oErrorPageModel = {
                getProperty: this.oGetPropertyStub,
                setProperty: this.oSetPropertyStub
            };
            this.oController.oPagesRuntimeNavContainer = {
                to: this.oNavContainerToStub
            };
        },
        afterEach: function () {
            this.oController.destroy();
        }
    });

    QUnit.test("Sets the error description", function (assert) {
        // Arrange
        this.oGetPropertyStub.returns("description-1");
        // Act
        this.oController._pressViewDetailsButton();

        // Assert
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The method setProperty of the error page model is called once.");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/description", "description-1"], "The method setProperty is called with correct parameters.");
        assert.strictEqual(this.oGetPropertyStub.callCount, 1, "The method getProperty of the error page model is called once.");
        assert.deepEqual(this.oGetPropertyStub.getCall(0).args, ["/details"], "The method getProperty of the error page model is called with correct parameters.");
    });

    QUnit.test("Uses the default description when it is not available", function (assert) {
        // Arrange
        this.oGetPropertyStub.returns(undefined);

        // Act
        this.oController._pressViewDetailsButton();

        // Assert
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/description", ""], "The method setProperty is called with correct parameters.");
    });

    QUnit.module("The function _copyToClipboard", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oGetPropertyStub = sinon.stub().returns("This is some text");
            this.oController._oErrorPageModel = {
                getProperty: this.oGetPropertyStub
            };
            this.oTextArea = {
                select: sinon.stub(),
                parentNode: {
                    removeChild: sinon.stub()
                }
            };
            var oOriginalDocumentMethods = {
                createElement: document.createElement,
                appendChild: document.documentElement.appendChild,
                execCommand: document.execCommand
            };
            this.oCreateElementStub = sinon.stub(document, "createElement").callsFake(function (type) {
                if (type === "textarea") {
                    return this.oTextArea;
                }
                return oOriginalDocumentMethods.createElement.apply(document, arguments);
            }.bind(this));
            this.oAppendChildStub = sinon.stub(document.documentElement, "appendChild").callsFake(function (element) {
                if (!element === this.oTextArea) {
                    return oOriginalDocumentMethods.appendChild.apply(document, arguments);
                }
            }.bind(this));
            this.oExecStub = sinon.stub(document, "execCommand").callsFake(function (command) {
                if (!command === "copy") {
                    return oOriginalDocumentMethods.execCommand.apply(document, arguments);
                }
            });
            this.oShowStub = sinon.stub(MessageToast, "show");
            this.oGetTextStub = sinon.stub(resources.i18n, "getText");
        },
        afterEach: function () {
            this.oCreateElementStub.restore();
            this.oAppendChildStub.restore();
            this.oExecStub.restore();
            this.oShowStub.restore();
            this.oGetTextStub.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Properly copies the string provided to the clipboard", function (assert) {
        // Arrange
        var oExpectedTextArea = {
                contentEditable: true,
                readonly: false,
                textContent: "This is some text"
            };

        this.oGetTextStub
            .withArgs("PageRuntime.CannotLoadPage.CopySuccess")
            .returns("Success")
            .withArgs("PageRuntime.CannotLoadPage.CopyFail")
            .returns("Fail");

        // Act
        this.oController._copyToClipboard();

        // Assert
        assert.strictEqual(this.oTextArea.contentEditable, oExpectedTextArea.contentEditable, "contentEditable property of the textArea has the expected value");
        assert.strictEqual(this.oTextArea.readonly, oExpectedTextArea.readonly, "readonly property of the textArea has the expected value");
        assert.strictEqual(this.oTextArea.textContent, oExpectedTextArea.textContent, "textContent property of the textArea has the expected value");
        assert.deepEqual(this.oShowStub.firstCall.args, ["Success", {closeOnBrowserNavigation: false}], "MessageToast was displayed as expected");
        assert.deepEqual(this.oTextArea.parentNode.removeChild.firstCall.args[0], this.oTextArea, "TextArea was removed at the end");
    });

    QUnit.test("Shows a MessageToast containing an error when the content could not be copied to the clipboard", function (assert) {
        // Arrange
        this.oAppendChildStub.throws(new Error());
        this.oGetTextStub
            .withArgs("PageRuntime.CannotLoadPage.CopySuccess")
            .returns("Success")
            .withArgs("PageRuntime.CannotLoadPage.CopyFail")
            .returns("Fail");
        // Act
        this.oController._copyToClipboard();
        // Assert
        assert.strictEqual(this.oShowStub.firstCall.args[0], "Fail", "MessageToast was displayed as expected");
    });

    QUnit.module("The function _parsePageAndSpaceId", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oResourceI18nGetTextStub = sinon.stub(resources.i18n, "getText").returns("translation");
            this.oGetAssignedPageStub = sinon.stub(this.oController, "_getAssignedPage").resolves("page1");
        },
        afterEach: function () {
            this.oResourceI18nGetTextStub.restore();
            this.oGetAssignedPageStub.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Returns a rejected promise when the intent is not Shell-home and no pageId and spaceId are provided", function (assert) {
        return this.oController._parsePageAndSpaceId([/*pageId */], [/*spaceId*/], {/*intent*/ }).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.NoPageIdAndSpaceIdProvided", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.test("Returns the result of _getAssignedPage when the intent is Shell-home and no pageId and spaceId are provided", function (assert) {
        // Arrange
        var oIntent = {
            semanticObject: "Shell",
            action: "home"
        };
        return this.oController._parsePageAndSpaceId([/*pageId*/], [/*spaceId*/], oIntent).then(function (result) {
            // Assert
            assert.strictEqual(this.oGetAssignedPageStub.callCount, 1, "The function _getAssignedPage is called once.");
            assert.strictEqual(result, "page1", "The correct result is returned.");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise when only a spaceId is provided", function (assert) {
        return this.oController._parsePageAndSpaceId([/*pageId*/], ["space1"], {/*intent*/}).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.OnlySpaceIdProvided", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise when only a pageId are provided", function (assert) {
        return this.oController._parsePageAndSpaceId(["page1"], [/*spaceId*/], {/*intent*/}).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.OnlyPageIdProvided", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.test("Returns a rejected promise when more than one pageId or spaceId are provided", function (assert) {
        return this.oController._parsePageAndSpaceId(["page1", "page2"], [ /*spaceId*/ ], {/*intent*/ }).catch(function (error) {
            // Assert
            assert.strictEqual(this.oResourceI18nGetTextStub.callCount, 1, "The function getText of resource.i18n is called once.");
            assert.strictEqual(this.oResourceI18nGetTextStub.getCall(0).args[0], "PageRuntime.MultiplePageOrSpaceIdProvided", "The function getText is called with correct parameters.");
            assert.strictEqual(error, "translation", "The correct error message is returned");
        }.bind(this));
    });

    QUnit.module("The _createActionModeButton function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oGetTextStub = sandbox.stub(resources.i18n, "getText");
            this.oGetTextStub.withArgs("PageRuntime.EditMode.Activate").returns("PageRuntime.EditMode.Activate");
            this.oExpectedUserActionButtonParameters = {
                controlType: "sap.ushell.ui.launchpad.ActionItem",
                oControlProperties: {
                    id: "ActionModeBtn",
                    text: "PageRuntime.EditMode.Activate",
                    icon: "sap-icon://edit"
                },
                bIsVisible: true,
                aStates: ["home"]
            };

            this.oDoneStub = sinon.stub();
            this.oAddUserActionStub = sinon.stub();
            this.oAddUserActionStub.returns({
                done: this.oDoneStub
            });
            this.oGetRendererStub = sinon.stub();
            this.oGetRendererStub.withArgs("fiori2").returns({
                addUserAction: this.oAddUserActionStub
            });
            ObjectPath.set("ushell.Container.getRenderer", this.oGetRendererStub, sap);

            this.oSetTooltipStub = sinon.stub();
            this.oSetTextStub = sinon.stub();
            this.oAttachPressStub = sinon.stub();
            this.oByIdStub = sandbox.stub(sap.ui.getCore(), "byId");
            this.oByIdStub.withArgs("ActionModeBtn").returns({
                setTooltip: this.oSetTooltipStub,
                setText: this.oSetTextStub,
                attachPress: this.oAttachPressStub
            });

            this.oAddStyleClassStub = sinon.stub();
            this.oActionButtonMock = {
                addStyleClass: this.oAddStyleClassStub
            };

            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/extension/enableHelp").returns(true);
        },
        afterEach: function () {
            sandbox.restore();
            delete sap.ushell.Container.getRenderer;
            this.oController.destroy();
        }
    });

    QUnit.test("Button exists already", function (assert) {
        //Arrange
        //Act
        this.oController._createActionModeButton();
        //Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "A text was required");
        assert.strictEqual(this.oSetTooltipStub.getCall(0).args[0], this.oExpectedUserActionButtonParameters.oControlProperties.text, "correct tooltip text was applied");
        assert.strictEqual(this.oSetTextStub.getCall(0).args[0], this.oExpectedUserActionButtonParameters.oControlProperties.text, "correct text was applied");
        assert.strictEqual(typeof this.oAttachPressStub.getCall(0).args[0][0], "function", "A handler was attached");
    });

    QUnit.test("Button does not already exist", function (assert) {
        //Arrange
        this.oByIdStub.withArgs("ActionModeBtn").returns();
        //Act
        this.oController._createActionModeButton();
        this.oDoneStub.getCall(0).args[0](this.oActionButtonMock);
        //Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "Correct text was required");
        assert.strictEqual(this.oAddUserActionStub.callCount, 1, "user action menu entry was added");
        assert.strictEqual(typeof this.oAddUserActionStub.getCall(0).args[0].oControlProperties.press[0], "function", "A handler was attached");
        var oAddUserActionsParameters = this.oAddUserActionStub.getCall(0).args[0];
        delete oAddUserActionsParameters.oControlProperties.press;
        assert.deepEqual(oAddUserActionsParameters, this.oExpectedUserActionButtonParameters, "correct parameters were applied");
        assert.strictEqual(this.oAddStyleClassStub.getCall(0).args[0], "help-id-ActionModeBtn", "xRray style class was added");
    });

    QUnit.module("The pressActionModeButton function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oRequireStub = sandbox.stub(sap.ui, "require");
            this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).returns();
            this.oRequireStub.callThrough();

            this.oGetPropertyStub = sinon.stub();
            this.oGetModelStub = sinon.stub();
            this.oGetModelStub.withArgs("viewSettings").returns({
                getProperty: this.oGetPropertyStub
            });
            this.oGetViewStub = sinon.stub();
            this.oGetViewStub.returns({
                getModel: this.oGetModelStub
            });
            this.oController.getView = this.oGetViewStub;
            this.oCancelStub = sandbox.stub(ActionMode, "cancel");
            this.oStartStub = sandbox.stub(ActionMode, "start");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Action mode is active", function (assert) {
        //Arrange
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(true);
        //Act
        this.oController.pressActionModeButton();
        this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).getCall(0).args[1](ActionMode);
        //Assert
        assert.strictEqual(this.oCancelStub.callCount, 1, "cancel was called exactly once");
    });

    QUnit.test("Action mode is not active", function (assert) {
        //Arrange
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(false);
        //Act
        this.oController.pressActionModeButton();
        this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).getCall(0).args[1](ActionMode);
        //Assert
        assert.strictEqual(this.oStartStub.callCount, 1, "start was called exactly once");
        assert.strictEqual(this.oStartStub.getCall(0).args[0], this.oController, "start was called with the right controller");
    });

    QUnit.module("The handleEditModeAction function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oRequireStub = sandbox.stub(sap.ui, "require");
            this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).returns();
            this.oRequireStub.callThrough();

            this.sMockHandler = "sMockHandler";
            this.oMockEvent = {id: "oMockEvent"};
            this.oMockSource = {id: "oMockSource"};
            this.oMockParameters = {id: "oMockParameters"};

            this.oMockHandler = sinon.stub();
            ActionMode[this.sMockHandler] = this.oMockHandler;
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        //Arrange
        //Act
        this.oController.handleEditModeAction(this.sMockHandler, this.oMockEvent, this.oMockSource, this.oMockParameters);
        this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).getCall(0).args[1](ActionMode);
        //Assert
        assert.deepEqual(this.oMockHandler.getCall(0).args[0], this.oMockEvent, "the event object was passed");
        assert.deepEqual(this.oMockHandler.getCall(0).args[1], this.oMockSource, "the source object was passed");
        assert.deepEqual(this.oMockHandler.getCall(0).args[2], this.oMockParameters, "the parameters object was passed");
    });

    QUnit.module("The visualizationMove function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oInfoStub = sandbox.stub(Log, "info");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        //Arrange
        //Act
        this.oController.visualizationMove();
        //Assert
        assert.strictEqual(this.oInfoStub.callCount, 1, "cleanup was called once");
    });
});
