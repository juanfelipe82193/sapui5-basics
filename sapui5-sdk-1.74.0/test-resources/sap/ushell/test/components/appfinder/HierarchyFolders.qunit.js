// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.appfinder.HierarchyFolders
 */
sap.ui.require([
    "sap/ushell/services/Container",
    "sap/ushell/resources",
    "sap/ushell/shells/demo/fioriDemoConfig",
    "sap/m/Page",
    "sap/m/SelectDialog"
], function (
    Container,
    resources,
    fioriDemoConfig,
    Page,
    SelectDialog
) {
    "use strict";

    var oController;
    var aTestSystems = [
        {
            systemName: "testSystemName1",
            systemId: "testSystemId1"
        }, {
            systemName: "testSystemName2",
            systemId: "testSystemId2"
        }, {
            systemName: "testSystemName3",
            systemId: "testSystemId3"
        }
    ];

    module("sap.ushell.components.appfinder.HierarchyFolders", {
        beforeEach: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                oController = new sap.ui.controller("sap.ushell.components.appfinder.HierarchyFolders"); // must use global reference (sap.ui.controller) or rewrite the test to use modules
                var oModel = new sap.ui.model.json.JSONModel();
                oController.getView = function () {
                    return {
                        getModel: function (/*modelName*/) {
                            return oModel;
                        },
                        translationBundle: sap.ushell.resources.i18n
                    }
                };
                start();
            });
        },

        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            delete sap.ushell.Container;
            oController.destroy();
        }
    });

    test("setSystemSelected - should update in model", function () {
        oController.createDialog();
        var oTestSystem = aTestSystems[0];
        oController.setSystemSelected(oTestSystem);

        assert.deepEqual(oController.getView().getModel().getProperty("/systemSelected"), oTestSystem, "system is updated in the model");

        oController.destroyDialog();
    });

    asyncTest("setSystemSelected - should update in personalization", function () {
        oController.createDialog();
        var oTestSystem = aTestSystems[0];
        oController.setSystemSelected(oTestSystem);

        oController.getSelectedSystemInPersonalization().then(function (oSystemFromPersonalization) {
            start();
            assert.deepEqual(oSystemFromPersonalization, oTestSystem, "system is updated in the personalization layer");
        });

        oController.destroyDialog();
    });

    asyncTest("getSelectedSystem - with only one system", function () {
        oController.createDialog();
        oController.getView().getModel().setProperty("/systemsList", [aTestSystems[0]]);

        var spy = sinon.spy(oController, "getSelectedSystemInPersonalization");

        oController.getSelectedSystem().then(function (oSystem) {
            assert.deepEqual(oSystem, aTestSystems[0], "first system is selected");
            assert.ok(!spy.called, "getSelectedSystemInPersonalization should not be called");
            start();
        });

        oController.destroyDialog();
    });

    asyncTest("getSelectedSystem - more then one system and value is stored in personalization", function () {
        oController.createDialog();
        oController.getView().getModel().setProperty("/systemsList", aTestSystems);

        sinon.stub(oController, "getSelectedSystemInPersonalization", function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve(aTestSystems[1]);
            return oDeferred.promise();
        });
        oController.getSelectedSystem().then(function (oSystem) {
            assert.deepEqual(oSystem, aTestSystems[1], "second system is selected - since it's defined in personalization");
            start();
        });

        oController.destroyDialog();
    });

    asyncTest("getSelectedSystem - more then one system, value is stored in personalization but not in the systems list", function () {
        oController.createDialog();
        oController.getView().getModel().setProperty("/systemsList", aTestSystems);

        var spy = sinon.spy(oController, "setSystemSelectedInPersonalization");

        sinon.stub(oController, "getSelectedSystemInPersonalization", function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve({
                systemName: "someFakeSystemName",
                systemId: "someFakeSystemId"
            });
            return oDeferred.promise();
        });

        oController.getSelectedSystem().then(function (oSystem) {
            assert.ok(!oSystem, "when personalized system is not in the list should return undefined");
            assert.ok(spy.calledWith(), "system was removed from personalization");
            oController.destroyDialog();
            start();
        });
    });

    test("onSystemSelectionPress - only one system in list should not open dialog", function () {
        oController.createDialog();
        oController.getView().getModel().setProperty("/systemsList", [aTestSystems[0]]);

        var spy = sinon.spy(oController.oDialog, "open");

        oController.onSystemSelectionPress();

        assert.ok(!spy.called, "dialog did not open");

        oController.destroyDialog();
    });

    test("onSystemSelectionPress - should open dialog", function () {
        oController.createDialog();
        oController.getView().getModel().setProperty("/systemsList", aTestSystems);

        var spy = sinon.spy(oController.oDialog, "open");

        oController.onSystemSelectionPress();

        assert.ok(spy.called, "dialog opened");

        oController.destroyDialog();
    });

    test("systemConfirmHandler - updates the model", function () {
        oController.createDialog();
        var oTestSystem = aTestSystems[1],
            oItem = {
                getBindingContext: function () {
                    return {
                        getObject: function () {
                            return oTestSystem
                        }
                    }
                }
            },
            oEvent = {
                getParameters: function () {
                    return { selectedItem: oItem }
                }
            };

        oController.systemConfirmHandler(oEvent);

        assert.deepEqual(oController.getView().getModel().getProperty("/systemSelected"), oTestSystem, "selected system is updated in the model");
    });

    test("titleFormatter - with system name should return the system name", function () {
        var result = oController.titleFormatter("some system name");
        assert.equal(result, "some system name");
    });

    test("titleFormatter - without system name should return the system id", function () {
        var result = oController.titleFormatter(undefined, "someId");
        assert.equal(result, "someId");
    });

    test("descriptionFormatter - with system name should return the system id", function () {
        var result = oController.descriptionFormatter("some system name", "someId");
        assert.equal(result, "someId");
    });

    test("descriptionFormatter - without system name should return null", function () {
        var result = oController.descriptionFormatter(undefined, "someId");
        assert.equal(result, null);
    });

    test("selectedFormatter - with system name which is the selected system should return true", function () {
        oController.getView().getModel("easyAccessSystems").setProperty("/systemSelected", { systemName: "name1", systemId: "id1" });
        var result = oController.selectedFormatter("name1", "id1");
        assert.equal(result, true);
    });

    test("selectedFormatter - with system name which is not the selected system should return false", function () {
        oController.getView().getModel("easyAccessSystems").setProperty("/systemSelected", { systemName: "name1", systemId: "id1" });
        var result = oController.selectedFormatter("name2", "Id2");
        assert.equal(result, false);
    });

    test("selectedFormatter - without system name which is the selected system should return true", function () {
        oController.getView().getModel("easyAccessSystems").setProperty("/systemSelected", { systemId: "id1" });
        var result = oController.selectedFormatter(undefined, "id1");
        assert.equal(result, true);
    });

    test("selectedFormatter - without system name which is not the selected system should return false", function () {
        oController.getView().getModel("easyAccessSystems").setProperty("/systemSelected", { systemId: "id1" });
        var result = oController.selectedFormatter(undefined, "Id2");
        assert.equal(result, false);
    });

    test("systemSelectorTextFormatter - should return the system name ", function () {
        var result = oController.systemSelectorTextFormatter({ systemName: "name1", systemId: "id1" });
        assert.ok(result === "name1");
    });

    test("systemSelectorTextFormatter - should return the system id ", function () {
        var result = oController.systemSelectorTextFormatter({ systemName: undefined, systemId: "id1" });
        assert.ok(result === "id1");
    });

    test("systemSelectorTextFormatter - no system - should return 'Select System'", function () {
        var result = oController.systemSelectorTextFormatter(undefined);
        assert.ok(result === oController.getView().translationBundle.getText("easyAccessSelectSystemTextWithoutSystem"));
    });

    test("systemSearchHandler create a filter of systemName and filter of systemId", function () {
        var oEvent = {
            getParameter: function (sValue) {
                if (sValue === "value") {
                    return "val1"
                }
            },
            getSource: function () {
                return {
                    getBinding: function (/*name*/) {
                        return {
                            filter: function () {
                                return;
                            }
                        };
                    }
                }
            }
        };

        var filtersSpy = sinon.spy(sap.ui.model, "Filter"); // must use global reference (sap.ui.model) or rewrite the test to use modules
        oController.systemSearchHandler(oEvent);
        assert.ok(filtersSpy.calledWith("systemName", sap.ui.model.FilterOperator.Contains, "val1"));
        assert.ok(filtersSpy.calledWith("systemId", sap.ui.model.FilterOperator.Contains, "val1"));
        sap.ui.model.Filter.restore();
    });
});
