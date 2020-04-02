/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.Notifications.Settings
 */
(function () {
    "use strict";
    /* eslint-disable */ // TBD: make ESLint conform

    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon, window, hasher */

    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.m.Table");
    jQuery.sap.require("sap.ushell.resources");
    var oController,
        oDefferedSettings,
        getUserSettingsFlagsStub,
        oView,
        readSettingsStub,
        oSettingsData,
        oOriginalSettingsData;

    module("sap.ushell.components.shell.Notifications.Settings", {
        setup: function () {
            window["sap-ushell-config"] = {
                "services": {
                    "Notifications": {
                        config: {
                            enabled: true,
                            serviceUrl: "/sap/opu/odata/SAP/ZNS_NOTIFICATIONS_SRV"
                        }
                    }
                },
                "renderers": {
                    "fiori2": {
                        "componentData": {
                            "config": {
                                "enableNotificationsUI": true,
                                "applications": {
                                    "Shell-home": {}
                                },
                                "rootIntent": "Shell-home"
                            }
                        }
                    }
                }
            };
            oSettingsData = {
                context: "",
                value: [{
                    "UserId": "BAR-LEV",
                    "NotificationTypeId": "id1",
                    "NotificationTypeDesc": "LeaveRequestType1",
                    "PriorityDefault": "40-HIGH",
                    "DoNotDeliver": true,
                    "DoNotDeliverMob": true
                }, {
                    "UserId": "BAR-LEV",
                    "NotificationTypeId": "id2",
                    "NotificationTypeDesc": "LeaveRequestType2",
                    "PriorityDefault": "40-HIGH",
                    "DoNotDeliver": true,
                    "DoNotDeliverMob": false
                }, {
                    "UserId": "BAR-LEV",
                    "NotificationTypeId": "id3",
                    "NotificationTypeDesc": "PurchaseOrderType1",
                    "PriorityDefault": "40-HIGH",
                    "DoNotDeliver": true,
                    "DoNotDeliverMob": true
                }, {
                    "UserId": "BAR-LEV",
                    "NotificationTypeId": "id4",
                    "NotificationTypeDesc": "PurchaseOrderType2",
                    "PriorityDefault": "40-HIGH",
                    "DoNotDeliver": true,
                    "DoNotDeliverMob": false
                }]
            };
            // Same structure as oSettingsData, but with changes in the DoNotDeliver and DoNotDeliverMob flags
            oOriginalSettingsData = {
                context: "",
                value: [{
                    "UserId": "BAR-LEV",
                    "NotificationTypeId": "id1",
                    "NotificationTypeDesc": "LeaveRequestType1",
                    "PriorityDefault": "40-HIGH",
                    "DoNotDeliver": true,
                    "DoNotDeliverMob": true
                }, {
                    "UserId": "BAR-LEV",
                    "NotificationTypeId": "id2",
                    "NotificationTypeDesc": "LeaveRequestType2",
                    "PriorityDefault": "40-HIGH",
                    "DoNotDeliver": false,
                    "DoNotDeliverMob": false
                }, {
                    "UserId": "BAR-LEV",
                    "NotificationTypeId": "id3",
                    "NotificationTypeDesc": "PurchaseOrderType1",
                    "PriorityDefault": "40-HIGH",
                    "DoNotDeliver": true,
                    "DoNotDeliverMob": true
                }, {
                    "UserId": "BAR-LEV",
                    "NotificationTypeId": "id4",
                    "NotificationTypeDesc": "PurchaseOrderType2",
                    "PriorityDefault": "",
                    "DoNotDeliver": true,
                    "DoNotDeliverMob": true
                }]
            };

            stop();
            sap.ushell.bootstrap("local").then(function () {
                getUserSettingsFlagsStub = sinon.stub(sap.ushell.Container.getService("Notifications"), "getUserSettingsFlags");
                readSettingsStub = sinon.stub(sap.ushell.Container.getService("Notifications"), "readSettings");
                oDefferedSettings = jQuery.Deferred();
                readSettingsStub.returns(oDefferedSettings.promise());
                getUserSettingsFlagsStub.returns({
                    done : function (fCallback) {
                        fCallback({ highPriorityBannerEnabled: true });
                    }
                });
                start();
            });
        },

        teardown: function () {
            getUserSettingsFlagsStub.restore();
            readSettingsStub.restore();

            delete sap.ushell.Container;
        }
    });

    test("Init settings view - model initialization", function (assert) {
        oView = new sap.ui.view({
            type: sap.ui.core.mvc.ViewType.JS,
            viewName: "sap.ushell.components.shell.Notifications.Settings"
        });
        oController = oView.getController();

        oController.getModel = function () {
            return oController.getView().getModel();
        };

        oDefferedSettings.resolve(JSON.stringify(oSettingsData));

        // Check model rows and flags
        assert.ok(oController.getView().getModel().getProperty("/rows").length === 4, "Correct number or rows in the model");
        assert.ok(oController.getView().getModel().getProperty("/originalRows").length === 4, "Correct number or original rows in the model");

        assert.ok(oController.getView().getModel().getProperty("/rows/3").NotificationTypeDesc === "PurchaseOrderType2", "Correct object value in the model");
        assert.ok(oController.getView().getModel().getProperty("/originalRows/3").NotificationTypeDesc === "PurchaseOrderType2", "Correct original object value in the model");

        assert.ok(oController.getView().getModel().getProperty("/flags/highPriorityBannerEnabled") === true, "Correct 2nd switch flag in the model");
        assert.ok(oController.getView().getModel().getProperty("/originalFlags/highPriorityBannerEnabled") === true, "Correct 2nd original switch flag in the model");

        oView.destroy();
    });

    test("Init settings view - No data", function (assert) {
        var oView = new sap.ui.view({
                type: sap.ui.core.mvc.ViewType.JS,
                viewName: "sap.ushell.components.shell.Notifications.Settings"
            }),
            oController = oView.getController(),
            oGetNoDataUiStub;

        oController.getModel = function () {
            return oController.getView().getModel();
        };
        oGetNoDataUiStub = sinon.stub(oView, "getNoDataUI").returns({id : "noData"});
        oView.removeAllContent = sinon.spy();
        oView.addContent = sinon.spy();

        oDefferedSettings.resolve(JSON.stringify({
            "@odata.context" : "$metadata#NotificationTypePersonalizationSet",
            "value" : {}
        }));

        // Check model rows and flags
        assert.ok(oController.getView().getModel().getProperty("/rows").length === undefined, "Correct number or rows in the model");

        assert.ok(oController.getView().getModel().getProperty("/originalRows").length === undefined, "Correct number or original rows in the model");

        assert.ok(oController.getView().getModel().getProperty("/flags/highPriorityBannerEnabled") === true, "Correct 2nd switch flag in the model");
        assert.ok(oController.getView().getModel().getProperty("/originalFlags/highPriorityBannerEnabled") === true, "Correct 2nd original switch flag in the model");

        //ok(oView.getNoDataUI.calledOnce === true, "oView.getNoDataUI is called");
        //ok(oView.removeAllContent.calledOnce === true, "oView.removeAllContent is called");
        //ok(oView.addContent.calledOnce === true, "oView.addContent is called");
        //ok(oView.addContent.args[0][0].id === "noData", "oView.addContent is called with the object returned from getNoDataUI");

        oGetNoDataUiStub.restore();
        readSettingsStub.restore();
        oView.destroy();
    });

    test("Init settings view - oData failure", function (assert) {
        var oView = new sap.ui.view({
                type: sap.ui.core.mvc.ViewType.JS,
                viewName: "sap.ushell.components.shell.Notifications.Settings"
            }),
            oController = oView.getController(),
            oGetNoDataUiStub;

        oController.getModel = function () {
            return oController.getView().getModel();
        };
        oGetNoDataUiStub = sinon.stub(oView, "getNoDataUI").returns({id : "noData"});
        oView.removeAllContent = sinon.spy();
        oView.addContent = sinon.spy();

        oDefferedSettings.reject();

        ok(oView.getNoDataUI.calledOnce === true, "oView.getNoDataUI is called");
        ok(oView.removeAllContent.calledOnce === true, "oView.removeAllContent is called");
        ok(oView.addContent.calledOnce === true, "oView.addContent is called");
        ok(oView.addContent.args[0][0].id === "noData", "oView.addContent is called with the object returned from getNoDataUI");

        oGetNoDataUiStub.restore();
        readSettingsStub.restore();
        oView.destroy();
    });

    test("OnAfterRendering - verify copy of rows and flags to originalRows and originalFlags", function (assert) {
        var oView = new sap.ui.view({
                type: sap.ui.core.mvc.ViewType.JS,
                viewName: "sap.ushell.components.shell.Notifications.Settings"
            });

        oController = oView.getController();

        oController.getModel = function () {
            return oController.getView().getModel();
        };

        // We would like to verify that OnAfterRendering copies the data from the model entries "rows" and "flags"
        // into "originalRows" "originalFlas", and also empties "aDitryRowsIndicator".
        // For this we initialize "originalRows", "originalFlas" and "aDitryRowsIndicator" 
        //  and check their content after the call to onAfterRendering 
        oController.getView().getModel().setProperty("/originalFlags", {});
        oController.getView().getModel().setProperty("/originalRows", []);
        oController.getView().getModel().setProperty("/aDitryRowsIndicator", [true, false, true]);
        oController.getView().getModel().setProperty("/flags", { highPriorityBannerEnabled: false });

        oController.getView().getModel().setProperty("/rows", oSettingsData.value);

        oController.onAfterRendering();

        // Check model originalRows
        assert.ok(oController.getView().getModel().getProperty("/originalRows").length === 4, "After onAfterRendering: originalRows updated correctly");
        assert.ok(oController.getView().getModel().getProperty("/originalRows")[0].NotificationTypeId === oSettingsData.value[0].NotificationTypeId, "After onAfterRendering: 1st row is correct");
        assert.ok(oController.getView().getModel().getProperty("/originalRows")[3].NotificationTypeId === oSettingsData.value[3].NotificationTypeId, "After onAfterRendering: 4th row is correct");

        assert.ok(oController.getView().getModel().getProperty("/originalFlags").highPriorityBannerEnabled === false, "After onAfterRendering: 2nd original flag is correct");
        assert.ok(oController.getView().getModel().getProperty("/aDitryRowsIndicator").length === 0, "After onAfterRendering: aDitryRowsIndicator was cleaned");
        oView.destroy();
    });

    test("onCancel - verify copy of original data to rows and flags", function (assert) {
        var oOriginalFlags = {
                highPriorityBannerEnabled : true
            };

        oView = new sap.ui.view({
            type: sap.ui.core.mvc.ViewType.JS,
            viewName: "sap.ushell.components.shell.Notifications.Settings"
        });
        oController = oView.getController();

        oController.getModel = function () {
            return oController.getView().getModel();
        };

        // We would like to verify that OnAfterRendering copies the data from the model entries "rows" and "flags"
        // into "originalRows" "originalFlas", and also empties "aDitryRowsIndicator".
        // For this we initialize "originalRows", "originalFlas" and "aDitryRowsIndicator"
        //  and check their content after the call to onAfterRendering
        oController.getView().getModel().setProperty("/originalFlags", oOriginalFlags);
        oController.getView().getModel().setProperty("/originalRows", oOriginalSettingsData.value);
        oController.getView().getModel().setProperty("/aDitryRowsIndicator", [true, false, undefined, true]);

        oController.getView().getModel().setProperty("/flags", { highPriorityBannerEnabled: false });
        oController.getView().getModel().setProperty("/rows", oSettingsData.value);

        oController.onCancel();

        // Check that rows are set correctly with the data of originalRows
        assert.ok(oController.getView().getModel().getProperty("/rows").length === 4, "correct number of rows");
        assert.ok(oController.getView().getModel().getProperty("/rows")[0].DoNotDeliver === oOriginalSettingsData.value[0].DoNotDeliver, "After onCancel: DoNotDeliver flag of 1st row is correct");
        assert.ok(oController.getView().getModel().getProperty("/rows")[3].DoNotDeliver === oOriginalSettingsData.value[3].DoNotDeliver, "After onCancel: DoNotDeliver flag of 4th row is correct");

        // Check that flags are set correctly with the data of originalFlags
        assert.ok(oController.getView().getModel().getProperty("/flags").highPriorityBannerEnabled === oOriginalFlags.highPriorityBannerEnabled, "After onCancel: 2nd flag is correct");

        assert.ok(oController.getView().getModel().getProperty("/originalFlags").highPriorityBannerEnabled === undefined, "no 2nd originalFlag");
        assert.ok(oController.getView().getModel().getProperty("/originalRows").length === 0, "originalRows cleaned");
        assert.ok(oController.getView().getModel().getProperty("/aDitryRowsIndicator").length === 0, "aDitryRowsIndicator array cleaned");

        oView.destroy();
    });

    test("onSave - verify calling flags and rows save functions (for rows: only changed ones)", function (assert) {
        var oView = new sap.ui.view({
                type: sap.ui.core.mvc.ViewType.JS,
                viewName: "sap.ushell.components.shell.Notifications.Settings"
            }),
            oController = oView.getController(),
            oSaveRowStub = sinon.stub(sap.ushell.Container.getService("Notifications"), "saveSettingsEntry").returns();

        oController.getModel = function () {
            return oController.getView().getModel();
        };
        oController._handleSwitchFlagsSave = sinon.spy();

        oController.getView().getModel().setProperty("/rows", oSettingsData.value);
        oController.getView().getModel().setProperty("/originalRows", oOriginalSettingsData.value);

        // "dirty" flags indicate that elements 2, 3 and 4 were "touched" by the user (indexes 1,2 and 3),
        // while actually only elements 2 and 4 (indexes 1 and 3) were changed
        oController.getView().getModel().setProperty("/aDitryRowsIndicator", [false, true, true, true]);

        oController.onSave();

        assert.ok(oController._handleSwitchFlagsSave.calledOnce === true, "Save flags function called");
        // There are only two elements that were actually changed 
        assert.ok(oSaveRowStub.calledTwice === true, "Save row functionality called twice");
        assert.ok(oSaveRowStub.args[0][0].NotificationTypeId === "id2", "Save row function called for typeId id2");
        assert.ok(oSaveRowStub.args[1][0].NotificationTypeId === "id4", "Save row function called for typeId id4");
        assert.ok(oController.getView().getModel().getProperty("/aDitryRowsIndicator").length === 0, "aDitryRowsIndicator emptied");

        oSaveRowStub.restore();
        oView.destroy();
    });

    test("onSave - dirtyIndicator prevents rows from being saved, and non-existing index is considered as not-dirty", function (assert) {
        var oView = new sap.ui.view({
                type: sap.ui.core.mvc.ViewType.JS,
                viewName: "sap.ushell.components.shell.Notifications.Settings"
            }),
            oController = oView.getController(),
            oSaveRowStub = sinon.stub(sap.ushell.Container.getService("Notifications"), "saveSettingsEntry").returns();

        oController.getModel = function () {
            return oController.getView().getModel();
        };
        oController._handleSwitchFlagsSave = sinon.spy();

        oController.getView().getModel().setProperty("/rows", oSettingsData.value);
        oController.getView().getModel().setProperty("/originalRows", oOriginalSettingsData.value);
        oController.getView().getModel().setProperty("/aDitryRowsIndicator", [false, true, undefined, false]);
        oController.onSave();

        assert.ok(oController._handleSwitchFlagsSave.calledOnce === true, "Save flags function called");
        assert.ok(oSaveRowStub.calledOnce === true, "Only one row has been saved");
        assert.ok(oSaveRowStub.args[0][0].NotificationTypeId === "id2", "Save row function called for typeId id2");
        assert.ok(oController.getView().getModel().getProperty("/aDitryRowsIndicator").length === 0, "aDitryRowsIndicator emptied");

        oSaveRowStub.restore();
        oView.destroy();
    });

    test("switchFlagsSave - Flags equal original flags", function (assert) {
        var oView = new sap.ui.view({
                type: sap.ui.core.mvc.ViewType.JS,
                viewName: "sap.ushell.components.shell.Notifications.Settings"
            }),
            oController = oView.getController(),
            oNotificationService = sap.ushell.Container.getService("Notifications"),
            oEventBusPublishStub = sinon.stub(sap.ui.getCore().getEventBus(), "publish").returns(),
            oNotificationServiceSetFlagsStub = sinon.stub(oNotificationService, "setUserSettingsFlags").returns();

        oController.getModel = function () {
            return oController.getView().getModel();
        };

        oController.getView().getModel().setProperty("/flags/highPriorityBannerEnabled", false);
        oController.getView().getModel().setProperty("/originalFlags/highPriorityBannerEnabled", false);

        oController._handleSwitchFlagsSave();

        assert.ok(oNotificationServiceSetFlagsStub.notCalled === true, "Notification Service function setUserSettingsFlags not called");
        assert.ok(oEventBusPublishStub.notCalled === true, "No event published");

        oNotificationServiceSetFlagsStub.restore();
        oEventBusPublishStub.restore();
        oView.destroy();
    });
}());