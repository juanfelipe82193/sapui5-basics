// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for MenuBar.controller
 */
sap.ui.require([
    "sap/ushell/components/shell/MenuBar/controller/MenuBar.controller",
    "sap/ushell/EventHub"
], function (MenuBarController, EventHub) {
    "use strict";
    /* global QUnit, sinon */

    QUnit.module("The function onInit", {
        beforeEach: function () {
            this.oEventHubDoStub = sinon.stub();
            this.oEventHubOnStub = sinon.stub(EventHub, "on");
            this.oEventHubOnStub.withArgs("enableMenuBarNavigation").returns({
                do: this.oEventHubDoStub
            });

            this.oAttachMatchedStub = sinon.stub();
            this.oGetServiceAsyncStub = sinon.stub();
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub,
                getRenderer: function () {
                    return {
                        getRouter: function () {
                            return {
                                getRoute: function () {
                                    return {
                                        attachMatched: this.oAttachMatchedStub
                                    };
                                }.bind(this)
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

            this.oController = new MenuBarController();

            this.oSelectIndexAfterRouteChangeStub = sinon.stub(this.oController, "_selectIndexAfterRouteChange");

            this.oSetModelStub = sinon.stub();
            this.oSetPropertyStub = sinon.stub();
            this.oGetModelStub = sinon.stub();
            this.oGetModelStub.withArgs("viewConfiguration").returns({
                setProperty: this.oSetPropertyStub
            });
            this.oController.getView = function () {
                return {
                    setModel: this.oSetModelStub,
                    getModel: this.oGetModelStub
                };
            }.bind(this);
        },
        afterEach: function () {
            this.oSelectIndexAfterRouteChangeStub.restore();
            this.oEventHubOnStub.restore();
        }
    });

    QUnit.test("Gets the pages service and URL parsing service asynchronously", function (assert) {
        //Arrange
        var oExpectedModelObject = {
            selectedKey: "None Existing Key",
            enableMenuBarNavigation: true
        };

        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oSelectIndexAfterRouteChangeStub.callCount, 1, "The method _oSelectIndexAfterRouteChangeStub is called once");
        assert.strictEqual(this.oSetModelStub.callCount, 1, "The model was set once");
        assert.deepEqual(this.oSetModelStub.getCall(0).args[0].getProperty("/"), oExpectedModelObject, "The correct data was set in the model.");
        assert.strictEqual(this.oSetModelStub.getCall(0).args[1], "viewConfiguration", "The model has the correct name.");
    });

    QUnit.test("Attaches handlers to matched routes", function (assert) {
        // Act
        this.oController.onInit();

        // Assert
        assert.equal(this.oAttachMatchedStub.callCount, 2, "The function attachMatched is called twice");
        assert.strictEqual(this.oAttachMatchedStub.getCall(0).args[0], this.oSelectIndexAfterRouteChangeStub, "The function attachMatched is called with correct parameters");
        assert.strictEqual(this.oAttachMatchedStub.getCall(1).args[0], this.oSelectIndexAfterRouteChangeStub, "The function attachMatched is called with correct parameters");
    });

    QUnit.test("Attaches EventHub Listener", function (assert) {
        //Arrange
        //Act
        this.oController.onInit();

        //Assert
        assert.strictEqual(this.oEventHubOnStub.callCount, 1, "EventHub Listener was attached");
    });

    QUnit.test("Calls EventHub Listener with parameter true", function (assert) {
        //Arrange
        //Act
        this.oController.onInit();
        this.oEventHubDoStub.getCall(0).args[0](true); //simulate trigger EventHub

        //Assert
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "setProperty was called once");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/enableMenuBarNavigation", true], "setProperty was called with the correct parameters");
    });

    QUnit.test("Calls EventHub Listener with parameter false", function (assert) {
        //Arrange
        //Act
        this.oController.onInit();
        this.oEventHubDoStub.getCall(0).args[0](false); //simulate trigger EventHub

        //Assert
        assert.strictEqual(this.oSetPropertyStub.callCount, 1, "setProperty was called once");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/enableMenuBarNavigation", false], "setProperty was called with the correct parameters");
    });

    QUnit.module("The function onMenuItemSelection", {
        beforeEach: function () {
            this.oGetParameterStub = sinon.stub();
            this.oGetPropertyStub = sinon.stub();
            this.oGetPropertyStub.withArgs("/").returns([
                {
                    uid: "ID-1",
                    title: "Space title",
                    description: "Space description",
                    icon: "sap-icon://document",
                    type: "intent",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            {
                                name: "spaceId",
                                value: "Z_TEST_SPACE"
                            },
                            {
                                name: "pageId",
                                value: "Z_TEST_PAGE"
                            }
                        ],
                        innerAppRoute: "&/some/in/app/route"
                    },
                    menuEntries: []
                },
                {
                    uid: "ID-2",
                    title: "Space title",
                    description: "Space description",
                    icon: "sap-icon://document",
                    type: "url",
                    target: {
                        url: "https://sap.com"
                    },
                    menuEntries: []
                },
                {
                    uid: "ID-3",
                    title: "Space title",
                    description: "Space description",
                    icon: "sap-icon://document",
                    type: "text",
                    menuEntries: []
                }
            ]);
            this.oUIBaseEvent = {
                getParameter: this.oGetParameterStub
            };
            this.oController = new MenuBarController();
            this.oController.getView = function () {
                return {
                    getModel: function () {
                        return {
                            getProperty: this.oGetPropertyStub
                        };
                    }.bind(this)
                };
            }.bind(this);
            this.oPerformCANStub = sinon.stub(this.oController, "_performCrossApplicationNavigation");
            this.oOpenURLStub = sinon.stub(this.oController, "_openURL");
        },
        afterEach: function () {
            this.oPerformCANStub.restore();
            this.oOpenURLStub.restore();
        }
    });

    QUnit.test("Calls _performCrossApplicationNavigation if the navigation type is 'intent'", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("key").returns("ID-1");

        var oExpectedDestinationTarget = {
            semanticObject: "Launchpad",
            action: "openFLPPage",
            parameters: [
                { name: "spaceId", value: "Z_TEST_SPACE" },
                { name: "pageId", value: "Z_TEST_PAGE" }
            ],
            innerAppRoute: "&/some/in/app/route"
        };

        // Act
        this.oController.onMenuItemSelection(this.oUIBaseEvent);

        // Assert
        assert.deepEqual(this.oPerformCANStub.firstCall.args, [oExpectedDestinationTarget], "The _performCrossApplicationNavigation function was called with the right destination target.");
        assert.strictEqual(this.oOpenURLStub.callCount, 0, "The _openURL function was not called.");
    });

    QUnit.test("Calls _openURL if the navigation type is 'url'", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("key").returns("ID-2");

        var oExpectedDestinationTarget = {
            url: "https://sap.com"
        };

        // Act
        this.oController.onMenuItemSelection(this.oUIBaseEvent);

        // Assert
        assert.deepEqual(this.oOpenURLStub.firstCall.args, [oExpectedDestinationTarget], "The _openURL function was called with the right destination target.");
        assert.strictEqual(this.oPerformCANStub.callCount, 0, "The _performCrossApplicationNavigation function was not called.");
    });

    QUnit.test("Doesn't perform any navigation if the navigation type is not 'url' or 'intent'", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("key").returns("ID-3");

        // Act
        this.oController.onMenuItemSelection(this.oUIBaseEvent);

        // Assert
        assert.strictEqual(this.oOpenURLStub.callCount, 0, "The _openURL function was not called.");
        assert.strictEqual(this.oPerformCANStub.callCount, 0, "The _performCrossApplicationNavigation function was not called.");
    });

    QUnit.module("The function _performCrossApplicationNavigation", {
        beforeEach: function () {
            this.oToExternalStub = sinon.stub();
            this.oGetServiceAsyncStub = sinon.stub();
            this.oCANService = {
                toExternal: this.oToExternalStub
            };
            this.oGetServiceAsyncStub.withArgs("CrossApplicationNavigation").resolves(this.oCANService);
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };
            this.oController = new MenuBarController();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Calls 'toExternal' of CrossApplicationNavigation service with the right intent", function (assert) {
        // Arrange
        var oDestinationTarget = {
            semanticObject: "Launchpad",
            action: "openFLPPage",
            parameters: [
                {
                    name: "spaceId",
                    value: "Z_TEST_SPACE"
                },
                {
                    name: "pageId",
                    value: "Z_TEST_PAGE"
                }
            ]
        };

        var oExpectedIntent = {
            "params": {
                "pageId": [
                    "Z_TEST_PAGE"
                ],
                "spaceId": [
                    "Z_TEST_SPACE"
                ]
            },
            "target": {
                "action": "openFLPPage",
                "semanticObject": "Launchpad"
            }
        };

        // Act
        return this.oController._performCrossApplicationNavigation(oDestinationTarget).then(function () {
            // Assert
            assert.deepEqual(this.oToExternalStub.firstCall.args, [oExpectedIntent], "The function calls 'toExternal' of the CrossAppNavigation service with the right intent.");
        }.bind(this));
    });

    QUnit.module("The function _openURL", {
        beforeEach: function () {
            this.oController = new MenuBarController();
            this.oOpenStub = sinon.stub(window, "open");
        },
        afterEach: function () {
            this.oOpenStub.restore();
        }
    });

    QUnit.test("Opens the target URL in a new browser tab", function (assert) {
        // Act
        this.oController._openURL({
            url: "https://sap.com"
        });

        // Assert
        assert.deepEqual(this.oOpenStub.firstCall.args, ["https://sap.com", "_blank"], "The function opened the URL https://sap.com in a new browser tab.");
    });

    QUnit.module("The function _selectIndexAfterRouteChange", {
        beforeEach: function () {
            this.oParseShellHashStub = sinon.stub();
            this.oURLParsingService = {
                parseShellHash: this.oParseShellHashStub
            };

            this.oSetPropertyStub = sinon.stub();
            this.oController = new MenuBarController();
            this.oController.oURLParsingService = Promise.resolve(this.oURLParsingService);
            this.oController.getView = function () {
                return {
                    getModel: sinon.stub().withArgs("viewConfiguration").returns({
                        setProperty: this.oSetPropertyStub
                    })
                };
            }.bind(this);
            this.oGetMenuUIDStub = sinon.stub(this.oController, "_getMenuUID");
            window.hasher = {
                getHash: function () { }
            };
        },
        afterEach: function () {
            delete window.hasher;
        }
    });

    QUnit.test("Sets selectedKey equal to an empty string if the hash action is 'home'", function (assert) {
        // Arrange
        this.oParseShellHashStub.returns({
            semanticObject: "Shell",
            action: "home"
        });

        // Act
        return this.oController._selectIndexAfterRouteChange().then(function () {
            // Assert
            assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The setProperty function of the viewConfiguration model was called once.");
            assert.deepEqual(this.oSetPropertyStub.firstCall.args, ["/selectedKey", ""], "The selected key was set to an empty string.");
        }.bind(this));
    });

    QUnit.test("Sets selectedKey equal to 'None Existing Key' if the no matching menu entry couldn't be determined for the provided space & page id", function (assert) {
        // Arrange
        this.oParseShellHashStub.returns({
            params: {
                "sap-ui-debug": [true]
            }
        });

        this.oGetMenuUIDStub.returns(undefined);

        // Act
        return this.oController._selectIndexAfterRouteChange().then(function () {
            // Assert
            assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The setProperty function of the viewConfiguration model was called once.");
            assert.deepEqual(this.oSetPropertyStub.firstCall.args, ["/selectedKey", "None Existing Key"], "The selected key was set to 'None Existing Key'.");
        }.bind(this));
    });

    QUnit.test("Sets selectedKey equal to the right key", function (assert) {
        // Arrange
        this.oParseShellHashStub.returns({
            params: {
                spaceId: ["Z_TEST_SPACE"],
                pageId: ["Z_TEST_PAGE"]
            }
        });

        this.oGetMenuUIDStub.withArgs("Z_TEST_SPACE", "Z_TEST_PAGE").returns("ID-1");

        // Act
        return this.oController._selectIndexAfterRouteChange().then(function () {
            // Assert
            assert.strictEqual(this.oSetPropertyStub.callCount, 1, "The setProperty function of the viewConfiguration model was called once.");
            assert.deepEqual(this.oSetPropertyStub.firstCall.args, ["/selectedKey", "ID-1"], "The selected key was set to the correct menu entry UID.");
        }.bind(this));
    });

    QUnit.module("The function _getMenuUID", {
        beforeEach: function () {
            this.oController = new MenuBarController();
            this.aMenuEntries = [
                {
                    uid: "ID-1",
                    title: "First menu entry",
                    description: "First menu entry description",
                    type: "intent",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            {
                                name: "spaceId",
                                value: "Z_FIRST_SPACE"
                            },
                            {
                                name: "pageId",
                                value: "Z_FIRST_PAGE"
                            }
                        ]
                    },
                    menuEntries: []
                },
                {
                    uid: "ID-2",
                    title: "Second menu entry",
                    description: "Second menu entry description",
                    type: "intent",
                    target: {
                        semanticObject: "Launchpad",
                        action: "openFLPPage",
                        parameters: [
                            {
                                name: "spaceId",
                                value: "Z_SECOND_SPACE"
                            },
                            {
                                name: "pageId",
                                value: "Z_SECOND_PAGE"
                            }
                        ]
                    },
                    menuEntries: []
                }
            ];
            this.oController.getView = function () {
                return {
                    getModel: sinon.stub().withArgs("menu").returns({
                        getProperty: sinon.stub().withArgs("/").callsFake(function () {
                            return this.aMenuEntries;
                        }.bind(this))
                    })
                };
            }.bind(this);
        }
    });

    QUnit.test("Returns the UID of the menu entry which has a target with the matching space & page id parameters", function (assert) {
        // Act
        var sMenuEntryUID = this.oController._getMenuUID("Z_SECOND_SPACE", "Z_SECOND_PAGE");

        // Assert
        assert.strictEqual(sMenuEntryUID, "ID-2", "The function returned the correct menu UID: 'ID-2'.");
    });

    QUnit.test("Returns undefined if no matching menu entry could be found", function (assert) {
        // Act
        var sMenuEntryUID = this.oController._getMenuUID("Z_TEST_SPACE", "Z_SECOND_PAGE");

        // Assert
        assert.strictEqual(sMenuEntryUID, undefined, "The function returned undefined.");
    });

    QUnit.module("The onExit function", {
        beforeEach: function () {
            this.oEventHubOffStub = sinon.stub();

            this.oController = new MenuBarController();
            this.oController.oEventHubListener = {
                off: this.oEventHubOffStub
            };
        },
        afterEach: function () {
            this.oController.destroy();
        }
    });

    QUnit.test("Detaches EventHub Listener", function (assert) {
        //Arrange
        //Act
        this.oController.onExit();
        //Assert
        assert.strictEqual(this.oEventHubOffStub.callCount, 1, "off was called once");
    });
});
