// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.Notifications.Notifications
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/Config",
    "sap/m/Button"
], function (utils, Config, Button) {
    "use strict";

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.renderers.fiori2.History");
    jQuery.sap.require("sap.ushell.renderers.fiori2.Renderer");
    jQuery.sap.require("sap.ui.thirdparty.datajs");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingDialog");
    jQuery.sap.require("sap.ui.thirdparty.hasher");

    var aResultArray1 = [{
        "Id": "00505692-409C-1EE5-ABDA-8F15E3E3B020",
        "OriginId": "G1Y_800",
        "CreatedAt": "2015-12-30T09:05:12Z",
        "IsActionable": true,
        "IsRead": false,
        "IsGroupable": true,
        "IsGroupHeader": false,
        "NavigationTargetAction": "DisplayObject",
        "NavigationTargetObject": "PurchaseOrder",
        "NotificationTypeId": "00505692-5975-1EE5-A991-2706A9CB0001",
        "ParentId": "00000000-0000-0000-0000-000000000000",
        "Priority": "MEDIUM",
        "SensitiveText": "Purchase order #1807 for $5,000 by Gavin Gradel requires your approval",
        "Text": "A purchase order requires your approval",
        "SubTitle": "Purchase Order #1807 ",
        "description": "description Test #1807",
        "GroupHeaderText": "Purchase orders requiring your approval",
        "NotificationCount": 0,
        "Actor": { "Id": "BAR-LEV", "DisplayText": "BAR-LEV", "ImageSource": "BAR-LEV" },
        "NavigationTargetParams": [
            {
                "NotificationId": "00505692-409C-1EE5-ABDA-8F15E3E3B020",
                "Key": "PurchaseOrderId",
                "Value": "236400"
            }, {
                "NotificationId": "00505692-409C-1EE5-ABDA-8F15E3E3B020",
                "Key": "PurchaseOrderVendor",
                "Value": "PARTNER_137"
            }
        ],
        "Actions": [
            {
                "ActionId": "00505692-5975-1EE5-A991-2706A9CC0000",
                "ActionText": "Accept",
                "GroupActionText": "Accept All",
                "Nature": "POSITIVE"
            }, {
                "ActionId": "00505692-5975-1EE5-A991-2706A9CC0001",
                "ActionText": "Reject",
                "GroupActionText": "Reject All",
                "Nature": "NEGATIVE"
            }
        ]
    }, {
        "Id": "00505692-409C-1EE5-ABDA-8FA41F727020",
        "OriginId": "G1Y_800",
        "CreatedAt": "2015-12-20T09:05:20Z",
        "IsActionable": true,
        "IsRead": true,
        "IsGroupable": true,
        "IsGroupHeader": false,
        "NavigationTargetAction": "display",
        "NavigationTargetObject": "LeaveRequest",
        "NotificationTypeId": "00505692-5975-1EE5-A991-2706A9CB0002",
        "ParentId": "00000000-0000-0000-0000-000000000000",
        "Priority": "LOW",
        "SensitiveText": "Leave request #1808 by Gavin Gradel requires your attention",
        "Text": "A leave request requires your attention",
        "SubTitle": "Purchase Order #1808",
        "description": "description Test #1808",
        "GroupHeaderText": "Leave requests requiring your attention",
        "NotificationCount": 0,
        "Actor": { "Id": "BAR-LEV", "DisplayText": "BAR-LEV", "ImageSource": "BAR-LEV" },
        "NavigationTargetParams": [
            {
                "NotificationId": "00505692-409C-1EE5-ABDA-8FA41F727020",
                "Key": "LeaveRequestId",
                "Value": "AA-DD0055"
            }, {
                "NotificationId": "00505692-409C-1EE5-ABDA-8FA41F727020",
                "Key": "LeaveRequestMode",
                "Value": "EditAsManager"
            }
        ],
        "Actions": [
            {
                "ActionId": "00505692-5975-1EE5-A991-2706A9CC0011",
                "ActionText": "Deny",
                "GroupActionText": "Deny All",
                "Nature": "NEGATIVE"
            }, {
                "ActionId": "00505692-5975-1EE5-A991-2706A9CC0010",
                "ActionText": "Approve",
                "GroupActionText": "Approve All",
                "Nature": "POSITIVE"
            }
        ]
    }, {
        "Id": "00505692-409C-1EE5-ABDA-8F15E3E3B021",
        "OriginId": "G1Y_800",
        "CreatedAt": "2015-12-25T09:05:12Z",
        "IsActionable": true,
        "IsRead": false,
        "IsGroupable": true,
        "IsGroupHeader": false,
        "NavigationTargetAction": "DisplayObject",
        "NavigationTargetObject": "PurchaseOrder",
        "NotificationTypeId": "00505692-5975-1EE5-A991-2706A9CB0001",
        "ParentId": "00000000-0000-0000-0000-000000000000",
        "Priority": "HIGH",
        "SensitiveText": "Purchase order #1807 for $5,000 by Gavin Gradel requires your approval",
        "Text": "A purchase order requires your approval",
        "GroupHeaderText": "Purchase orders requiring your approval",
        "SubTitle": "Purchase order #1807",
        "description": "description Test #1807 for $5,000",
        "NotificationCount": 0,
        "Actor": { "Id": "BAR-LEV", "DisplayText": "BAR-LEV", "ImageSource": "BAR-LEV" },
        "NavigationTargetParams": [
            {
                "NotificationId": "00505692-409C-1EE5-ABDA-8F15E3E3B021",
                "Key": "PurchaseOrderId",
                "Value": "236400"
            }, {
                "NotificationId": "00505692-409C-1EE5-ABDA-8F15E3E3B021",
                "Key": "PurchaseOrderVendor",
                "Value": "PARTNER_137"
            }
        ],
        "Actions": [
            {
                "ActionId": "00505692-5975-1EE5-A991-2706A9CC0000",
                "ActionText": "Accept",
                "GroupActionText": "Accept All",
                "Nature": "POSITIVE"
            }, {
                "ActionId": "00505692-5975-1EE5-A991-2706A9CC0001",
                "ActionText": "Reject",
                "GroupActionText": "Reject All",
                "Nature": "NEGATIVE"
            }
        ]
    }, {
        "Id": "00505692-409C-1EE5-ABDA-8F15E3E3B022",
        "OriginId": "G1Y_800",
        "CreatedAt": "2015-12-25T09:05:12Z",
        "IsActionable": true,
        "IsRead": false,
        "IsGroupable": true,
        "IsGroupHeader": false,
        "NavigationTargetAction": "DisplayObject",
        "NavigationTargetObject": "PurchaseOrder",
        "NotificationTypeId": "00505692-5975-1EE5-A991-2706A9CB0001",
        "ParentId": "00000000-0000-0000-0000-000000000000",
        "Priority": "HIGH",
        "SensitiveText": "",
        "Text": "A purchase order requires your approval",
        "SubTitle": "",
        "description": "description Test",
        "GroupHeaderText": "Purchase orders requiring your approval",
        "NotificationCount": 0,
        "Actor": { "Id": "BAR-LEV", "DisplayText": "BAR-LEV", "ImageSource": "BAR-LEV" },
        "NavigationTargetParams": [
            {
                "NotificationId": "00505692-409C-1EE5-ABDA-8F15E3E3B021",
                "Key": "PurchaseOrderId",
                "Value": "236400"
            }, {
                "NotificationId": "00505692-409C-1EE5-ABDA-8F15E3E3B021",
                "Key": "PurchaseOrderVendor",
                "Value": "PARTNER_137"
            }
        ],
        "Actions": [
            {
                "ActionId": "00505692-5975-1EE5-A991-2706A9CC0000",
                "ActionText": "Accept",
                "GroupActionText": "Accept All",
                "Nature": "POSITIVE"
            }, {
                "ActionId": "00505692-5975-1EE5-A991-2706A9CC0001",
                "ActionText": "Reject",
                "GroupActionText": "Reject All",
                "Nature": "NEGATIVE"
            }
        ]
    }],
        aResultArray2 = [
            { "Id": "Id1" },
            { "Id": "Id2" },
            { "Id": "Id3" },
            { "Id": "Id4" },
            { "Id": "Id5" },
            { "Id": "Id6" }
        ];

    QUnit.module("sap.ushell.components.shell.Notifications.Notifications", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
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
                                "applications": { "Shell-home": {} },
                                "rootIntent": "Shell-home"
                            }
                        }
                    }
                }
            };
            sap.ushell.bootstrap("local").then(function () {
                this.oService = sap.ushell.Container.getService("Notifications");
                this.oMessageService = sap.ushell.Container.getService("Message");
                this.oErrorStub = sinon.stub(this.oMessageService, "error").returns(function () { });
                this.executeActionStub = sinon.stub(this.oService, "executeAction").returns({
                    fail: function () { },
                    done: function () { }
                });
                this.executeBulkActionStub = sinon.stub(this.oService, "executeBulkAction").returns({
                    fail: function () { }
                });
                this.dismissBulkNotificationsStub = sinon.stub(this.oService, "dismissBulkNotifications").returns({
                    fail: function () { }
                });
                this.markReadStub = sinon.stub(this.oService, "markRead").returns({
                    fail: function () { }
                });
                this.dismissNotificationStub = sinon.stub(this.oService, "dismissNotification").returns({
                    fail: function () { }
                });
                this.getNotificationsBufferBySortingType = sinon.stub(this.oService, "getNotificationsBufferBySortingType").returns(jQuery.Deferred().resolve(aResultArray1));

                this.getNotificationStub = sinon.stub(this.oService, "_readNotificationsData").returns(jQuery.Deferred().resolve(aResultArray1));

                this.getNotificationsGroupHeaders = sinon.stub(this.oService, "getNotificationsGroupHeaders").returns(jQuery.Deferred().resolve(
                    "{\"@odata.context\":\"$metadata#Notifications\",\"value\":[{\"Id\":\"005056ab-6fd8-1ee5-b3ca-91c4c583b209\", \"hasMoreItems\": \"true\",\"OriginId\":\"LOCAL\",\"CreatedAt\":\"2016-03-17T13:38:33Z\",\"IsActionable\":true,\"IsRead\":false,\"IsGroupable\":true,\"IsGroupHeader\":true,\"NavigationTargetAction\":\"\",\"NavigationTargetObject\":\"\",\"NotificationTypeId\":\"005056ab-6fd8-1ee5-b3ca-91c4c583b209\",\"NotificationTypeDesc\":\"Purchase Order-1\",\"NotificationTypeKey\":\"LeaveRequest-key\",\"ParentId\":\"00000000-0000-0000-0000-000000000000\",\"Priority\":\"LOW\",\"SensitiveText\":\"\",\"Text\":\"\",\"GroupHeaderText\":\"You have 2 leave requests requiring your attention\",\"NotificationCount\":2,\"Actor\":{\"Id\":\"\",\"DisplayText\":\"\",\"ImageSource\":\"\"},\"NavigationTargetParams\":[],\"Actions\":[{\"ActionId\":\"Deny-key\",\"ActionText\":\"Deny\",\"GroupActionText\":\"Deny All\",\"Nature\":\"NEGATIVE\"},{\"ActionId\":\"Approve-key\",\"ActionText\":\"Approve\",\"GroupActionText\":\"Approve All\",\"Nature\":\"POSITIVE\"}]},{\"Id\":\"005056ab-6fd8-1ee5-b3ca-966123d21209\",\"OriginId\":\"LOCAL\",\"CreatedAt\":\"2016-03-17T12:50:48Z\",\"IsActionable\":true,\"IsRead\":false,\"IsGroupable\":true,\"IsGroupHeader\":true,\"NavigationTargetAction\":\"\",\"NavigationTargetObject\":\"\",\"NotificationTypeId\":\"005056ab-6fd8-1ee5-b3ca-966123d21209\",\"NotificationTypeKey\":\"PurchaseOrder-key\",\"ParentId\":\"005056ab-6fd8-1ee5-b3ca-91c4c583b209\",\"Priority\":\"HIGH\",\"SensitiveText\":\"\",\"Text\":\"\",\"GroupHeaderText\":\"Purchase orders requiring your approval\",\"NotificationCount\":3,\"Actor\":{\"Id\":\"\",\"DisplayText\":\"\",\"ImageSource\":\"\"},\"NavigationTargetParams\":[],\"Actions\":[{\"ActionId\":\"Accept-key\",\"ActionText\":\"Accept\",\"GroupActionText\":\"Accept All\",\"Nature\":\"POSITIVE\"},{\"ActionId\":\"Reject-key\",\"ActionText\":\"Reject\",\"GroupActionText\":\"Reject All\",\"Nature\":\"NEGATIVE\"}]}]}"
                ));

                this.getNotificationsBufferInGroup = sinon.stub(this.oService, "getNotificationsBufferInGroup").returns(jQuery.Deferred().resolve([
                    {
                        "Id": "005056b4-24bc-1ee7-85aa-1d95eca8fde2",
                        "OriginId": "LOCAL",
                        "CreatedAt": "2017-03-30T13:58:17Z",
                        "IsActionable": true,
                        "IsRead": false,
                        "IsGroupable": true,
                        "IsGroupHeader": false,
                        "NavigationTargetAction": "toappstatesample",
                        "NavigationTargetObject": "Action",
                        "NavigationIntent": "Action-toappstatesample",
                        "NotificationTypeId": "005056b4-24bc-1ee7-85aa-1d95eca93de2",
                        "NotificationTypeKey": "PurchaseOrderType2Key",
                        "ParentId": "005056b4-24bc-1ee7-85aa-1d95eca93de2",
                        "Priority": "HIGH",
                        "SensitiveText": "Purchase order #1440 for $2,000 by Gavin Gradel requires your approval",
                        "Text": "A purchase order requires your approval",
                        "GroupHeaderText": "",
                        "NotificationCount": 0,
                        "SubTitle": "Over the last 12 months Gavin Gradel ordered goods $2,000.Currently 10.000 are due.",
                        "NotificationTypeDesc": "Purchase Order",
                        "Actor": {
                            "Id": "MOSSERI",
                            "DisplayText": "MOSSERI",
                            "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                        },
                        "NavigationTargetParams": [
                            {
                                "NotificationId": "005056b4-24bc-1ee7-85aa-1d95eca8fde2",
                                "Key": "PurchaseOrderId",
                                "Value": "236400"
                            }, {
                                "NotificationId": "005056b4-24bc-1ee7-85aa-1d95eca8fde2",
                                "Key": "PurchaseOrderVendor",
                                "Value": "PARTNER_137"
                            }
                        ],
                        "Actions": [
                            {
                                "ActionId": "AcceptPOActionKey",
                                "ActionText": "Accept",
                                "GroupActionText": "Accept All",
                                "Nature": "POSITIVE"
                            }, {
                                "ActionId": "RejectPOActionKey",
                                "ActionText": "Reject",
                                "GroupActionText": "Reject All",
                                "Nature": "NEGATIVE"
                            }
                        ]
                    }, {
                        "Id": "005056b4-24bc-1ee7-85aa-1d95eca91de2",
                        "OriginId": "LOCAL",
                        "CreatedAt": "2017-03-30T13:58:17Z",
                        "IsActionable": true,
                        "IsRead": false,
                        "IsGroupable": true,
                        "IsGroupHeader": false,
                        "NavigationTargetAction": "toappstatesample",
                        "NavigationTargetObject": "Action",
                        "NavigationIntent": "Action-toappstatesample",
                        "NotificationTypeId": "005056b4-24bc-1ee7-85aa-1d95eca93de2",
                        "NotificationTypeKey": "PurchaseOrderType2Key",
                        "ParentId": "005056b4-24bc-1ee7-85aa-1d95eca93de2",
                        "Priority": "HIGH",
                        "SensitiveText": "Purchase order #3631 for $1,000 by Gavin Gradel requires your approval",
                        "Text": "A purchase order requires your approval",
                        "GroupHeaderText": "",
                        "NotificationCount": 0,
                        "SubTitle": "Over the last 12 months Gavin Gradel ordered goods $1,000.Currently 10.000 are due.",
                        "NotificationTypeDesc": "Purchase Order",
                        "Actor": {
                            "Id": "MOSSERI",
                            "DisplayText": "MOSSERI",
                            "ImageSource": "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
                        },
                        "NavigationTargetParams": [
                            {
                                "NotificationId": "005056b4-24bc-1ee7-85aa-1d95eca91de2",
                                "Key": "PurchaseOrderId",
                                "Value": "236400"
                            }, {
                                "NotificationId": "005056b4-24bc-1ee7-85aa-1d95eca91de2",
                                "Key": "PurchaseOrderVendor",
                                "Value": "PARTNER_137"
                            }
                        ],
                        "Actions": [
                            {
                                "ActionId": "AcceptPOActionKey",
                                "ActionText": "Accept",
                                "GroupActionText": "Accept All",
                                "Nature": "POSITIVE"
                            }, {
                                "ActionId": "RejectPOActionKey",
                                "ActionText": "Reject",
                                "GroupActionText": "Reject All",
                                "Nature": "NEGATIVE"
                            }
                        ]
                    }]
                ));

                this.oView = new sap.ui.view({
                    type: sap.ui.core.mvc.ViewType.XML,
                    viewName: "sap.ushell.components.shell.Notifications.Notifications"
                });

                this.oController = this.oView.getController();
                fnDone();
            }.bind(this));
        },

        /**
         * This method is called after each test. Add every restoration code here.
         */
        afterEach: function () {
            this.getNotificationStub.restore();
            this.oErrorStub.restore();
            this.executeActionStub.restore();
            this.dismissBulkNotificationsStub.restore();
            this.dismissNotificationStub.restore();
            this.oController.destroy();
            this.oView.destroy();
            var aNotificationListIds = [
                "sapUshellNotificationsListType",
                "sapUshellNotificationsListPriority",
                "sapUshellNotificationsListDate"
            ];
            for (var i = 0; i < aNotificationListIds.length; i++) {
                var oNotificatyionList = sap.ui.getCore().byId(aNotificationListIds[i]);
                if (oNotificatyionList) {
                    oNotificatyionList.destroy();
                }
            }
            delete sap.ushell.Container;
        }
    });

    QUnit.test("init notification view - model", function (assert) {
        var aSortingTypesInModel = this.oController.getView().getModel().getProperty("/");
        assert.ok(aSortingTypesInModel.notificationsByDateAscending !== undefined, "notificationsByDateAscending exists in the model");
        assert.ok(aSortingTypesInModel.notificationsByDateDescending !== undefined, "notificationsByDateDescending exists in the model");
        assert.ok(aSortingTypesInModel.notificationsByPriorityDescending !== undefined, "notificationsByPriorityDescending exists in the model");
    });

    QUnit.test("test actionButtonPressHandler message - returned value", function (assert) {
        var fnDone = assert.async(),
            oExecuteActionResponse = {
                isSucessfull: true,
                message: "Leave Request approved successfully"
            },
            oDeferred = jQuery.Deferred(),
            oExecuteActionStub,
            oMessageToastObject,
            oShowMessageSpy = sinon.spy(),
            oOrigRequire = sap.ui.require,
            oEvent = {
                getSource: function () {
                    return {
                        getBindingContext: function () {
                            return {
                                getPath: function () {
                                    return "/notificationsByDateDescending/aNotifications/1/Actions/0";
                                }
                            };
                        }
                    };
                }
            };

        oMessageToastObject = { show: oShowMessageSpy };
        sap.ui.require = function (aArr, callback) {
            if (aArr[0] === "sap/m/MessageToast") {
                callback(oMessageToastObject);
            } else {
                oOrigRequire(aArr, callback);
            }
        };

        sap.ui.require.toUrl = function () { };

        oDeferred.resolve(oExecuteActionResponse);
        oExecuteActionStub = sinon.stub(this.oController, "executeAction").returns(oDeferred.promise());

        this.oController.onNotificationItemButtonPress(oEvent);
        setTimeout(function () {
            assert.ok(oShowMessageSpy.calledOnce === true, "MessageToast Show called once");
            assert.ok(oShowMessageSpy.args[0][0] === "Leave Request approved successfully", "MessageToast called with returned message");
            oExecuteActionStub.restore();
            sap.ui.require = oOrigRequire;
            fnDone();
        }, 200);
    });

    QUnit.test("test actionButtonPressHandler message - default value", function (assert) {
        var fnDone = assert.async(),
            oExecuteActionResponse = { isSucessfull: true },
            oDeferred = jQuery.Deferred(),
            oOrigExecuteAction = this.oController.executeAction,
            oExecuteActionStub,
            oMessageToastObject,
            oShowMessageSpy = sinon.spy(),
            oOrigRequire = sap.ui.require,
            oEvent = {
                getSource: function () {
                    return {
                        getBindingContext: function () {
                            return {
                                getPath: function () {
                                    return "/notificationsByDateDescending/aNotifications/1/Actions/0";
                                }
                            };
                        }
                    };
                }
            };

        oMessageToastObject = { show: oShowMessageSpy };
        sap.ui.require = function (aArr, callback) {
            if (aArr[0] === "sap/m/MessageToast") {
                callback(oMessageToastObject);
            } else {
                oOrigRequire(aArr, callback);
            }
        };

        oDeferred.resolveWith(oEvent, [oExecuteActionResponse]);

        oExecuteActionStub = sinon.stub(this.oController, "executeAction").returns(oDeferred.promise());

        this.oController.onNotificationItemButtonPress(oEvent);
        setTimeout(function () {
            assert.ok(oShowMessageSpy.calledOnce === true, "MessageToast Show called once");
            assert.ok(oShowMessageSpy.args[0][0] === sap.ushell.resources.i18n.getText(
                "ActionAppliedToNotification", "Deny"), "MessageToast called with default message"
            );
            oExecuteActionStub.restore();
            this.oController.executeAction = oOrigExecuteAction;
            sap.ui.require = oOrigRequire;
            fnDone();
        }.bind(this), 200);
    });

    QUnit.test("test actionButtonPressHandler DeleteOnReturn", function (assert) {
        var oExecuteActionResponseDeleteOnReturnTrue = {
            isSucessfull: true,
            message: "Leave Request approved successfully",
            DeleteOnReturn: true
        },
            oExecuteActionResponseDeleteOnReturnFalse = {
                isSucessfull: true,
                message: "Leave Request approved successfully",
                DeleteOnReturn: false
            },
            oExecuteActionResponseNoDeleteOnReturn = {
                isSucessfull: true,
                message: "Leave Request approved successfully"
            },
            oDeferred,
            oExecuteActionStub,
            removeNotificationFromModelStub = sinon.stub(this.oController, "removeNotificationFromModel").returns({}),
            cleanModelFromModelStub = sinon.stub(this.oController, "cleanModel").returns({}),
            oEvent = {
                getSource: function () {
                    return {
                        getBindingContext: function () {
                            return {
                                getPath: function () {
                                    return "/notificationsByDateDescending/aNotifications/1/Actions/0";
                                }
                            };
                        }
                    };
                }
            };

        oDeferred = new jQuery.Deferred();
        oDeferred.resolve(oExecuteActionResponseDeleteOnReturnTrue);
        oExecuteActionStub = sinon.stub(this.oController, "executeAction").returns(oDeferred.promise());
        this.oController.onNotificationItemButtonPress(oEvent);
        assert.ok(removeNotificationFromModelStub.calledOnce, "DeleteOnReturn is true, removeNotificationFromModel is called");
        assert.ok(cleanModelFromModelStub.calledOnce, "DeleteOnReturn is true: cleanModel is called");
        oExecuteActionStub.restore();

        oDeferred = new jQuery.Deferred();
        oDeferred.resolve(oExecuteActionResponseDeleteOnReturnFalse);
        oExecuteActionStub = sinon.stub(this.oController, "executeAction").returns(oDeferred.promise());
        this.oController.onNotificationItemButtonPress(oEvent);
        assert.ok(removeNotificationFromModelStub.calledOnce, "DeleteOnReturn is False, removeNotificationFromModel is not called");
        assert.ok(cleanModelFromModelStub.calledOnce, "DeleteOnReturnFalse is False: cleanModel is not called");
        oExecuteActionStub.restore();

        oDeferred = new jQuery.Deferred();
        oDeferred.resolve(oExecuteActionResponseNoDeleteOnReturn);
        oExecuteActionStub = sinon.stub(this.oController, "executeAction").returns(oDeferred.promise());
        this.oController.onNotificationItemButtonPress(oEvent);
        assert.ok(removeNotificationFromModelStub.calledTwice, "DeleteOnReturn is undefined, removeNotificationFromModel is called");
        assert.ok(cleanModelFromModelStub.calledTwice, "DeleteOnReturn is undefined: cleanModel is  called");
        oExecuteActionStub.restore();

        removeNotificationFromModelStub.restore();
        cleanModelFromModelStub.restore();
    });

    QUnit.test("test message toast after executeBulkAction in success flow", function (assert) {
        var sActionName = "Approve-key",
            sActionText = "Approve key",
            oGroupToDelete = { Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209" },
            dfd = jQuery.Deferred(),
            sMessage = "",
            messageShowStub = sinon.stub(sap.m.MessageToast, "show", function (sRetuenedMessage) {
                sMessage = sRetuenedMessage;
            });
        this.executeBulkActionStub.returns(dfd.promise());
        this.oController.reloadGroupHeaders();
        this.oController.executeBulkAction(sActionName, sActionText, oGroupToDelete, "/notificationsByTypeDescending/0");
        dfd.resolve();
        assert.ok(/^"Approve key"/.test(sMessage), "Message starts with \"Approve key\"");
        assert.ok(/"Purchase Order-1"/.test(sMessage), "Message contains group \"Purchase Order-1\"");

        messageShowStub.restore();
    });

    QUnit.test("test message toast after executeBulkAction in failure flow", function (assert) {
        var sActionName = "Approve-key",
            sActionText = "Approve key",
            oGroupToDelete = {
                Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209",
                notifications: [
                    { Id: "005056ab-6fd8-1ee5-bb88-b1231d763dd0" },
                    { Id: "005056ab-6fd8-1ee5-bb88-b15ceb897dd0" }
                ]
            },
            sMessage = "";
        this.oErrorStub.restore();
        this.oErrorStub = sinon.stub(this.oMessageService, "error", function (sReturnedMessage) {
            sMessage = sReturnedMessage;
        });
        var dfd = jQuery.Deferred();
        this.executeBulkActionStub.returns(dfd.promise());
        this.oController.reloadGroupHeaders();
        this.oController.executeBulkAction(sActionName, sActionText, oGroupToDelete, "/notificationsByTypeDescending/0");

        dfd.reject({
            "succededNotifications": [],
            "failedNotifications": [
                "005056ab-6fd8-1ee5-bb88-b1231d763dd0",
                "005056ab-6fd8-1ed5-bb89-ea35b66f609d"
            ]
        });
        assert.ok(sMessage === sap.ushell.resources.i18n.getText("notificationsFailedExecuteBulkAction", "executeBulkAction message in failure flow is correct"));
    });

    QUnit.test("test message toast after executeBulkAction in partial success flow", function (assert) {
        var sActionName = "Approve-key",
            sActionext = "Approve key",
            oGroupToDelete = { Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209", notifications: [{ Id: "005056ab-6fd8-1ee5-bb88-b1231d763dd0" }, { Id: "005056ab-6fd8-1ee5-bb88-b15ceb897dd0" }] },
            sMessage = "",
            messageShowStub = sinon.stub(sap.m.MessageToast, "show", function (sRetuenedMessage) {
                sMessage = sRetuenedMessage;
            });
        var dfd = jQuery.Deferred();
        this.executeBulkActionStub.returns(dfd.promise());
        this.oController.reloadGroupHeaders();
        this.oController.executeBulkAction(sActionName, sActionext, oGroupToDelete, "/notificationsByTypeDescending/0");
        dfd.reject({
            "succededNotifications": ["005056ab-6fd8-1ed5-bb89-ea35b66f609d"],
            "failedNotifications": ["005056ab-6fd8-1ee5-bb88-b1231d763dd0"]
        });
        assert.ok(/^"Approve key"/.test(sMessage), "Message starts with \"Approve key\"");
        assert.ok(/"Purchase Order-1"/.test(sMessage), "Message contains group \"Purchase Order-1\"");
        messageShowStub.restore();
    });

    QUnit.test("verify descendingSortBy model structure", function (assert) {
        var aNotificationByDateDesc = this.oController.getView().getModel().getProperty("/" + this.oController.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING + "/aNotifications");
        assert.ok(aNotificationByDateDesc.length === 4, "Correct number of notification items byDate descensing");
        assert.ok(aNotificationByDateDesc[2].Id === "00505692-409C-1EE5-ABDA-8F15E3E3B021", "Correct 3rd item Id");
    });

    QUnit.test("verify scrollToItem function", function (assert) {
        var number,
            indexInModelByItemIdStub = sinon.stub(this.oController, "getIndexInModelByItemId").returns(1),
            jqNotificationObjectsStub = sinon.stub(this.oController, "_getJqNotificationObjects").returns([
                {
                    length: "1",
                    offset: function () {
                        return {
                            top: 112
                        };
                    },
                    scrollTop: function (num) {
                        number = num;
                        return number;
                    }
                }, {
                    length: "1",
                    css: function () {
                        return "20px";
                    }
                }, {
                    length: "1",
                    css: function () {
                        return "4px";
                    }
                }, {
                    length: "1",
                    css: function () {
                        return "2px";
                    },
                    outerHeight: function () {
                        return 110;
                    }
                }
            ]);
        this.oController.scrollToItem({
            topItemId: "1",
            offSetTop: 112
        });
        assert.ok(number === 134, "calculation of scrollTop is correct");

        indexInModelByItemIdStub.restore();
        jqNotificationObjectsStub.restore();
    });

    QUnit.test("Select tab flow - empty tabs", function (assert) {
        var oSelectEventData = {
            key: "sapUshellNotificationIconTabByDate",
            item: {
                $: function () {
                    return {
                        attr: function () { }
                    };
                }
            }
        },
            oDateList = this.oController.getNotificationList(this.oController.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING),
            oIconTabBar = this.oView.getContent()[0],
            oGetItemsFromModelStub = sinon.stub(this.oController, "getItemsFromModel").returns(new Array(0)),
            oGetNextBufferStub = sinon.stub(this.oController, "getNextBuffer").returns(),
            oBindItemsStub = sinon.stub(oDateList, "bindItems").returns();

        // First select (click on tab) ByDate -> Switch to ByDate ascending
        oIconTabBar.fireSelect(oSelectEventData);
        assert.ok(this.oController.sCurrentSorting === this.oController.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING, "Select ByDate descending, currectSorting is set correctly");
        assert.ok(oBindItemsStub.args[0][0] === "/notificationsByDateAscending/aNotifications", "oNotificationsListDate.bindItems called with notificationsByDateAscending/aNotifications");
        assert.ok(oGetNextBufferStub.calledOnce === true, "GetNextBuffer called once");
        assert.ok(oGetNextBufferStub.args[0][0] === this.oController.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING, "GetNextBuffer called with NOTIFICATIONS_BY_DATE_ASCENDING");

        // Second select (click on tab) ByPriority -> Switch to ByPriority
        oSelectEventData.key = "sapUshellNotificationIconTabByPrio";
        oIconTabBar.fireSelect(oSelectEventData);
        assert.ok(this.oController.sCurrentSorting === this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING, "Select ByPriority descending, currectSorting is set correctly");
        assert.ok(oBindItemsStub.calledOnce === true, "oBindItemsStub NOT called for moving from ByDate tab to ByPriority tab");
        assert.ok(oGetNextBufferStub.calledTwice === true, "GetNextBuffer called once");
        assert.ok(oGetNextBufferStub.args[1][0] === this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING, "GetNextBuffer called with NOTIFICATIONS_BY_PRIORITY_DESCENDING");

        // Third select (click on tab) ByDate -> Switch to ByDate ascending
        oSelectEventData.key = "sapUshellNotificationIconTabByDate";
        oIconTabBar.fireSelect(oSelectEventData);
        assert.ok(this.oController.sCurrentSorting === this.oController.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING, "Return to ByDate descending, currectSorting is set correctly");
        assert.ok(oBindItemsStub.calledOnce === true, "oBindItemsStub NOT called when move back to ByDate tab from ByPriority tab, because old binding is kept");
        assert.ok(oGetNextBufferStub.calledThrice === true, "GetNextBuffer called once");
        assert.ok(oGetNextBufferStub.args[2][0] === this.oController.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING, "GetNextBuffer called with NOTIFICATIONS_BY_DATE_ASCENDING");

        oBindItemsStub.restore();
        oGetNextBufferStub.restore();
        oGetItemsFromModelStub.restore();
    });

    QUnit.test("Select tab flow - tabs with content", function (assert) {
        var oSelectEventData = {
            key: "sapUshellNotificationIconTabByDate",
            item: {
                $: function () {
                    return {
                        attr: function () { }
                    };
                }
            }
        },
            oDateList = this.oController.getNotificationList(this.oController.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING),
            oIconTabBar = this.oView.getContent()[0],
            oGetItemsFromModelStub = sinon.stub(this.oController, "getItemsFromModel").returns(new Array(30)),
            oGetNextBufferStub = sinon.stub(this.oController, "getNextBuffer").returns(),
            oBindItemsStub = sinon.stub(oDateList, "bindItems").returns();

        // First select (click on tab) -> ByDate -> Switch to ByDate ascending (@TODO: No items in the tab)
        oIconTabBar.fireSelect(oSelectEventData);
        assert.ok(this.oController.sCurrentSorting === this.oController.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING, "Select ByDate descending, currectSorting is set correctly");
        assert.ok(oBindItemsStub.args[0][0] === "/notificationsByDateAscending/aNotifications", "oNotificationsListDate.bindItems called with notificationsByDateAscending/aNotifications");
        assert.ok(oGetNextBufferStub.notCalled === true, "GetNextBuffer not called because the tab already has content");

        // Second select (click on tab) -> ByPriority -> Switch to ByPriority
        oSelectEventData.key = "sapUshellNotificationIconTabByPrio";
        oIconTabBar.fireSelect(oSelectEventData);
        assert.ok(this.oController.sCurrentSorting === this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING, "Select ByPriority descending, currectSorting is set correctly");
        assert.ok(oBindItemsStub.calledOnce === true, "oBindItemsStub NOT called for moving from ByDate tab to ByPriority tab");
        assert.ok(oGetNextBufferStub.notCalled === true, "GetNextBuffer not called because the tab already has content");

        // Third select (click on tab) ByDate -> Switch to ByDate ascending
        oSelectEventData.key = "sapUshellNotificationIconTabByDate";
        oIconTabBar.fireSelect(oSelectEventData);
        assert.ok(this.oController.sCurrentSorting === this.oController.oSortingType.NOTIFICATIONS_BY_DATE_ASCENDING, "Return to ByDate descending, currectSorting is set correctly");
        assert.ok(oBindItemsStub.calledOnce === true, "oBindItemsStub NOT called when move back to ByDate tab from ByPriority tab, because old binding is kept");
        assert.ok(oGetNextBufferStub.notCalled === true, "GetNextBuffer not called because the tab already has content");

        oBindItemsStub.restore();
        oGetNextBufferStub.restore();
        oGetItemsFromModelStub.restore();
    });

    QUnit.test("verify getTopItemOnTheScreen function", function (assert) {
        var jqOriginOffSet = jQuery.prototype.offset,
            itemNotificationIdStub = sinon.stub(this.oController, "getItemNotificationId").returns(1),
            indexInModelByItemIdStub = sinon.stub(this.oController, "getIndexInModelByItemId").returns(1),
            oResult,
            jqNotificationObjectsStub = sinon.stub(this.oController, "_getJqNotificationObjects").returns([
                {
                    children: function () {
                        return {
                            length: 1,
                            children: function () {
                                return {
                                    height: function () {
                                        return 12;
                                    },
                                    outerHeight: function () {
                                        return 24;
                                    },
                                    length: 1
                                };
                            },
                            height: function () {
                                return 12;
                            },
                            outerHeight: function () {
                                return 24;
                            }
                        };
                    },
                    find: function () {
                        return jQuery([{
                            id: 1
                        }, { id: 2 }]);
                    },
                    offset: function () {
                        return {
                            top: 50
                        };
                    }
                },
                {},
                {},
                {}
            ]);

        jQuery.prototype.offset = function () {
            return {
                top: 50
            };
        };

        oResult = this.oController.getTopItemOnTheScreen();
        assert.ok(oResult.topItemId === 1 && oResult.offSetTop === 50, "calculation of TopItemOnTheScreen is correct");

        indexInModelByItemIdStub.restore();
        jqNotificationObjectsStub.restore();
        itemNotificationIdStub.restore();
        jQuery.prototype.offset = jqOriginOffSet;
    });

    QUnit.test("test getNumberOfItemsInScreen", function (assert) {
        var oGetItemsFromModelStub,
            oGetNumberOfItemsInScreenStub = sinon.stub(this.oController, "getNumberOfItemsInScreen").returns(5);

        assert.ok(this.oController.getNumberOfItemsToFetchOnScroll() === 15, "5 Items in the screen -> Buffer size is 15");
        oGetNumberOfItemsInScreenStub.restore();

        oGetNumberOfItemsInScreenStub = sinon.stub(this.oController, "getNumberOfItemsInScreen").returns(2);
        assert.ok(this.oController.getNumberOfItemsToFetchOnScroll() === 15, "2 Items in the screen -> Minimum buffer size is 15");
        oGetNumberOfItemsInScreenStub.restore();

        oGetItemsFromModelStub = sinon.stub(this.oController, "getItemsFromModel").returns(new Array(500));
        assert.ok(this.oController.getNumberOfItemsToFetchOnScroll() === 0, "There are alreay 500 items, buffer is 0");
        oGetItemsFromModelStub.restore();

        oGetItemsFromModelStub = sinon.stub(this.oController, "getItemsFromModel").returns(new Array(390));
        assert.ok(this.oController.getNumberOfItemsToFetchOnScroll() === 10, "There are alreay 390 items, buffer is 10");
        oGetItemsFromModelStub.restore();
    });

    QUnit.test("test getNumberOfItemsToFetchOnUpdate", function (assert) {
        var oGetBasicBufferSizeStub = sinon.stub(this.oController, "getBasicBufferSize").returns(20);

        assert.ok(this.oController.getNumberOfItemsToFetchOnUpdate(0) === 20, "0 items in model and bufferSize is 20 -> getNumberOfItemsToFetchOnUpdate returns 20");
        assert.ok(this.oController.getNumberOfItemsToFetchOnUpdate(10) === 20, "10 items in model and bufferSize is 20 -> getNumberOfItemsToFetchOnUpdate returns 20");
        assert.ok(this.oController.getNumberOfItemsToFetchOnUpdate(42) === 60, "42 items in model and bufferSize is 20 -> getNumberOfItemsToFetchOnUpdate returns 60");
        this.oController.iMaxNotificationItemsForDevice = 100;
        assert.ok(this.oController.getNumberOfItemsToFetchOnUpdate(90) === 100, "90 items in model and bufferSize is 20 -> getNumberOfItemsToFetchOnUpdate returns 100");

        oGetBasicBufferSizeStub.restore();
    });

    QUnit.test("test addBufferToModel", function (assert) {
        var aModelItemsAfterMerge,
            bInUpdateFlag;

        sinon.stub(this.oController, "getItemsFromModel").returns(aResultArray1);
        this.oController.getView().getModel().setProperty("/" + this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING + "/inUpdate", true);
        this.oController.addBufferToModel(this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING, aResultArray2);
        aModelItemsAfterMerge = this.oController.getView().getModel().getProperty("/" + this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING + "/aNotifications");
        assert.ok(aModelItemsAfterMerge.length === 10, "After addBufferToModel there are 4 + 6 items in the NOTIFICATIONS_BY_PRIORITY_DESCENDING path");
        bInUpdateFlag = this.oController.getView().getModel().getProperty("/" + this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING + "/inUpdate");
        assert.ok(bInUpdateFlag === false, "After addBufferToModel, the inUpdate flag has the value false");
    });

    QUnit.test("test getNextBuffer", function (assert) {
        var oGetItemsFromModelStub = sinon.stub(this.oController, "getItemsFromModel").returns([]),
            oSetPropertyStub = sinon.stub(this.oController.getView().getModel(), "setProperty").returns(),
            oGetNumberOfItemsToFetchOnScrollStub = sinon.stub(this.oController, "getNumberOfItemsToFetchOnScroll").returns(35),
            oUserSettingInitialization = sinon.stub(this.oService, "_userSettingInitialization").returns();

        this.getNotificationsBufferBySortingType.restore();
        this.getNotificationsBufferBySortingType = sinon.stub(this.oService, "getNotificationsBufferBySortingType").returns(jQuery.Deferred().resolve(aResultArray1));

        this._getNotificationSettingsAvalability = sinon.stub(this.oService, "_getNotificationSettingsAvalability").returns(jQuery.Deferred().resolve());

        this.oController.addBufferToModel = sinon.spy();
        this.oController.addBusyIndicatorToTabFilter = sinon.spy();
        this.oController.removeBusyIndicatorToTabFilter = sinon.spy();
        this.oController.sCurrentSorting = this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING;
        this.oController.getNextBuffer();

        assert.ok(oSetPropertyStub.calledOnce === true, "SetPropertyStub called once");
        assert.ok(oSetPropertyStub.args[0][0] === "/" + this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING + "/inUpdate", "SetPropertyStub called for setting the value of bInUpdate");
        assert.ok(oSetPropertyStub.args[0][1] === true, "SetPropertyStub called for setting the value true of bInUpdate");

        assert.ok(this.getNotificationsBufferBySortingType.calledOnce === true, "GetNotificationsBufferBySortingType called once");
        assert.ok(this.getNotificationsBufferBySortingType.args[0][0] === this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING, "GetNotificationsBufferBySortingType called with correct sorting type");
        assert.ok(this.getNotificationsBufferBySortingType.args[0][1] === 0, "GetNotificationsBufferBySortingType called witn nomberOfItemsInModel = 0");
        assert.ok(this.getNotificationsBufferBySortingType.args[0][2] === 35, "GetNotificationsBufferBySortingType called witn correct required number of items, = 35");

        assert.ok(oUserSettingInitialization.calledOnce === false, "SetPropertyStub called once");

        oGetItemsFromModelStub.restore();
        oGetNumberOfItemsToFetchOnScrollStub.restore();

        oGetItemsFromModelStub = sinon.stub(this.oController, "getItemsFromModel").returns(aResultArray2);
        oGetNumberOfItemsToFetchOnScrollStub = sinon.stub(this.oController, "getNumberOfItemsToFetchOnScroll").returns(35);

        this.oController.getNextBuffer(this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING);

        assert.ok(this.getNotificationsBufferBySortingType.calledTwice === true, "GetNotificationsBufferBySortingType called for the 2nd time");
        assert.ok(this.getNotificationsBufferBySortingType.args[1][0] === this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING, "GetNotificationsBufferBySortingType called with correct sorting type");
        assert.ok(this.getNotificationsBufferBySortingType.args[1][1] === 6, "GetNotificationsBufferBySortingType called witn nomberOfItemsInModel = 6");
        assert.ok(this.getNotificationsBufferBySortingType.args[1][2] === 35, "GetNotificationsBufferBySortingType called witn correct required number of items, = 35");

        oGetNumberOfItemsToFetchOnScrollStub.restore();
        oGetItemsFromModelStub.restore();
        oSetPropertyStub.restore();
        oGetNumberOfItemsToFetchOnScrollStub.restore();
    });

    QUnit.test("test update Notifications Settings", function (assert) {
        var oGetItemsFromModelStub = sinon.stub(this.oController, "getItemsFromModel").returns([]),
            oSetPropertyStub = sinon.stub(this.oController.getView().getModel(), "setProperty").returns(),
            oGetNumberOfItemsToFetchOnScrollStub = sinon.stub(this.oController, "getNumberOfItemsToFetchOnScroll").returns(35),
            oUserSettingInitialization = sinon.stub(this.oService, "_userSettingInitialization").returns();

        this.getNotificationsBufferBySortingType.restore();
        this.getNotificationsBufferBySortingType = sinon.stub(this.oService, "getNotificationsBufferBySortingType").returns(jQuery.Deferred().resolve(aResultArray1));

        this._getNotificationSettingsAvalability = sinon.stub(this.oService, "_getNotificationSettingsAvalability").returns(jQuery.Deferred().promise());

        this.oController.addBufferToModel = sinon.spy();
        this.oController.addBusyIndicatorToTabFilter = sinon.spy();
        this.oController.removeBusyIndicatorToTabFilter = sinon.spy();
        this.oController.sCurrentSorting = this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING;
        this.oController.getNextBuffer();

        assert.ok(oSetPropertyStub.calledOnce === true, "SetPropertyStub called once");
        assert.ok(oSetPropertyStub.args[0][0] === "/" + this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING + "/inUpdate", "SetPropertyStub called for setting the value of bInUpdate");
        assert.ok(oSetPropertyStub.args[0][1] === true, "SetPropertyStub called for setting the value true of bInUpdate");

        assert.ok(this.getNotificationsBufferBySortingType.calledOnce === true, "GetNotificationsBufferBySortingType called once");
        assert.ok(this.getNotificationsBufferBySortingType.args[0][0] === this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING, "GetNotificationsBufferBySortingType called with correct sorting type");
        assert.ok(this.getNotificationsBufferBySortingType.args[0][1] === 0, "GetNotificationsBufferBySortingType called witn nomberOfItemsInModel = 0");
        assert.ok(this.getNotificationsBufferBySortingType.args[0][2] === 35, "GetNotificationsBufferBySortingType called witn correct required number of items, = 35");

        assert.ok(oUserSettingInitialization.calledOnce === true, "_userSettingInitialization called once");

        oGetItemsFromModelStub.restore();
        oGetNumberOfItemsToFetchOnScrollStub.restore();

        oGetItemsFromModelStub = sinon.stub(this.oController, "getItemsFromModel").returns(aResultArray2);
        oGetNumberOfItemsToFetchOnScrollStub = sinon.stub(this.oController, "getNumberOfItemsToFetchOnScroll").returns(35);

        this.oController.getNextBuffer(this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING);

        assert.ok(this.getNotificationsBufferBySortingType.calledTwice === true, "GetNotificationsBufferBySortingType called for the 2nd time");
        assert.ok(this.getNotificationsBufferBySortingType.calledTwice === true, "GetNotificationsBufferBySortingType called for the 2nd time");
        assert.ok(this.getNotificationsBufferBySortingType.args[1][0] === this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING, "GetNotificationsBufferBySortingType called with correct sorting type");
        assert.ok(this.getNotificationsBufferBySortingType.args[1][1] === 6, "GetNotificationsBufferBySortingType called witn nomberOfItemsInModel = 6");
        assert.ok(this.getNotificationsBufferBySortingType.args[1][2] === 35, "GetNotificationsBufferBySortingType called witn correct required number of items, = 35");

        oGetNumberOfItemsToFetchOnScrollStub.restore();
        oGetItemsFromModelStub.restore();
        oSetPropertyStub.restore();
        oGetNumberOfItemsToFetchOnScrollStub.restore();
    });

    QUnit.test("test getNotificationsUpdateCallbackBuffer", function (assert) {
        var //oGetItemsFromModelStub = sinon.stub(this.oController, "getItemsFromModel").returns([]),
            oGetNumberOfItemsToFetchOnUpdateStub = sinon.stub(this.oController, "getNumberOfItemsToFetchOnUpdate").returns(30),
            oSetPropertyStub = sinon.stub(this.oController.getView().getModel(), "setProperty").returns(),
            oDeferred = new jQuery.Deferred(),
            oDeferredResolveStub = sinon.stub(oDeferred, "resolve").returns(),
            oReplaceItemsInModelStub = sinon.stub(this.oController, "replaceItemsInModel").returns();

        this.getNotificationsBufferBySortingType.restore();
        this.getNotificationsBufferBySortingType = sinon.stub(this.oService, "getNotificationsBufferBySortingType").returns(jQuery.Deferred().resolve(aResultArray1));
        this.oController.cleanModel = sinon.spy();

        // First call to notificationsUpdateCallback. Requesting 30 items, getNotificationsBufferBySortingType returns 3 items
        this.oController.notificationsUpdateCallback(oDeferred);
        assert.ok(oGetNumberOfItemsToFetchOnUpdateStub.calledOnce === true, "getNumberOfItemsToFetchOnUpdate called once");
        assert.ok(oDeferredResolveStub.calledOnce === true, "oDependenciesDeferred called once");
        assert.ok(this.getNotificationsBufferBySortingType.calledOnce === true, "getNotificationsBufferBySortingType called once");
        assert.ok(this.getNotificationsBufferBySortingType.args[0][1] === 0, "getNotificationsBufferBySortingType called with skip = 0");
        assert.ok(this.getNotificationsBufferBySortingType.args[0][2] === 30, "getNotificationsBufferBySortingType called with numberOfItemsToFetchStub (top) = 30");
        assert.ok(oReplaceItemsInModelStub.calledOnce === true, "replaceItemsInModel called");
        assert.ok(this.oController.cleanModel.calledOnce === true, "Model cleaned");

        oGetNumberOfItemsToFetchOnUpdateStub.restore();
        oGetNumberOfItemsToFetchOnUpdateStub = sinon.stub(this.oController, "getNumberOfItemsToFetchOnUpdate").returns(280);

        this.getNotificationsBufferBySortingType.restore();
        this.getNotificationsBufferBySortingType = sinon.stub(this.oService, "getNotificationsBufferBySortingType").returns(jQuery.Deferred().resolve(new Array(280)));

        // Second call to notificationsUpdateCallback. Requesting 280 items, getNotificationsBufferBySortingType returns 280 items
        this.oController.notificationsUpdateCallback(oDeferred);
        assert.ok(oDeferredResolveStub.calledTwice === true, "oDependenciesDeferred called once");
        assert.ok(oGetNumberOfItemsToFetchOnUpdateStub.calledOnce === true, "getNumberOfItemsToFetchOnUpdate called once");
        assert.ok(this.getNotificationsBufferBySortingType.calledOnce === true, "getNotificationsBufferBySortingType called once");
        assert.ok(this.getNotificationsBufferBySortingType.args[0][1] === 0, "getNotificationsBufferBySortingType called with skip = 0");
        assert.ok(this.getNotificationsBufferBySortingType.args[0][2] === 280, "getNotificationsBufferBySortingType called with numberOfItemsToFetchStub (top) = 280");
        assert.ok(oReplaceItemsInModelStub.calledTwice === true, "replaceItemsInModel called");
        assert.ok(this.oController.cleanModel.calledTwice === true, "Model cleaned");

        oGetNumberOfItemsToFetchOnUpdateStub.restore();
        oSetPropertyStub.restore();
        this.getNotificationsBufferBySortingType.restore();
        oDeferredResolveStub.restore();
    });

    /**
     * Verify that launching a navigation action from a Notification object results in a correct call to CrossApplicationNavigation service
     * including the business parameters
     */
    QUnit.test("Navigate on Notification launch", function (assert) {
        var notifications = this.oController.getView().getModel().getProperty("/" + this.oController.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING + "/aNotifications"),
            oGetHashStub = sinon.stub(hasher, "getHash", function () {
                return "X-Y";
            }),
            oToExternalSpy = sinon.spy(),
            oGetServiceStub = sinon.stub(sap.ushell.Container, "getService", function (sServiceName) {
                if (sServiceName === "CrossApplicationNavigation") {
                    return {
                        toExternal: oToExternalSpy
                    };
                }
                return null;
            }),
            sFirstNotificationSemanticObject = notifications[0].NavigationTargetObject,
            sFirstNotificationAction = notifications[0].NavigationTargetAction,
            sFirstNotificationParam1Key = notifications[0].NavigationTargetParams[0].Key,
            sFirstNotificationParam1Value = notifications[0].NavigationTargetParams[0].Value,
            sFirstNotificationParam2Key = notifications[0].NavigationTargetParams[1].Key,
            sFirstNotificationParam2Value = notifications[0].NavigationTargetParams[1].Value;

        this.oController.onListItemPress(
            notifications[0].id,
            notifications[0].NavigationTargetObject,
            notifications[0].NavigationTargetAction,
            notifications[0].NavigationTargetParams
        );

        assert.ok(oToExternalSpy.calledOnce === true, "The function toExternal of CrossApplicationNavigation service called once");

        // Verify that the parameters (SemanticObject, Action, businessParameters) of the first notification objects were passed to toExternal
        assert.ok(oToExternalSpy.args[0][0].target.semanticObject === sFirstNotificationSemanticObject, "The function toExternal called with the correct semanticObject");
        assert.ok(oToExternalSpy.args[0][0].target.action === sFirstNotificationAction, "The function toExternal called with the correct action");
        assert.ok(oToExternalSpy.args[0][0].params[sFirstNotificationParam1Key] === sFirstNotificationParam1Value, "The function toExternal called with the correct 1st parameter");
        assert.ok(oToExternalSpy.args[0][0].params[sFirstNotificationParam2Key] === sFirstNotificationParam2Value, "The function toExternal called with the correct correct 2nd parameter");

        oGetHashStub.restore();
        oGetServiceStub.restore();
    });

    QUnit.test("verify markRead", function (assert) {
        var notification = this.oController.getView().getModel().getProperty("/" + this.oController.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING + "/aNotifications");
        assert.equal(notification[0].IsRead, false, "the 1st notification in the array is not read");
        assert.equal(notification[1].IsRead, true, "the 2nd notification in the array is not read");
        assert.equal(notification[2].IsRead, false, "the 3rd notification in the array is  read");
        this.oController.markRead(notification[0].Id); // mark as read the first one
        assert.equal(this.markReadStub.callCount, 1, "service markRead should call once");
        assert.equal(notification[0].IsRead, true, "the 1st notification in the array should be read");
        this.oController.markRead(notification[2].Id); // mark as read the third one
        assert.equal(this.markReadStub.callCount, 2, "service markRead should call twice");
        assert.equal(notification[2].IsRead, true, "the 3rd notification in the array should stay read");
    });

    QUnit.test("error handling - markRead", function (assert) {
        var sId = "00505692-409C-1EE5-ABDA-8F15E3E3B020",
            failCB,
            getNotificationFromModel = function (sId) {
                var notifications = this.oController.getView().getModel().getProperty("/" + this.oController.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING + "/aNotifications");
                return notifications.filter(function (item) {
                    return item.Id === sId;
                })[0];
            }.bind(this),
            failStub = function (cb) {
                failCB = cb;
            };
        this.markReadStub.returns({
            fail: failStub
        });
        this.oController.markRead(sId);
        assert.ok(this.markReadStub.calledOnce, "markRead service call was done");
        assert.ok(getNotificationFromModel(sId).IsRead, "notification marked as read in model");
        failCB();
        assert.ok(!getNotificationFromModel(sId).IsRead, "notification marked as unread in model after fail");

    });

    QUnit.test("error handling - dismissNotification", function (assert) {
        var sId = "00505692-409C-1EE5-ABDA-8F15E3E3B020",
            failCB,
            addNotifStub,
            dismissStub,
            failStub = function (cb) {
                failCB = cb;
            };
        this.dismissNotificationStub.returns({ fail: failStub });

        addNotifStub = sinon.stub(this.oController, "addNotificationToModel", function () { });
        dismissStub = sinon.stub(this.oController, "removeNotificationFromModel", function () {
            return { obj: {}, index: "123" };
        });

        this.oController.getView().getModel().setProperty("/notificationsByPriorityDescending/", { "dummy": "dummy" });
        this.oController.dismissNotification(sId);
        failCB();
        assert.ok(sinon.deepEqual(this.oController.getInitialSortingModelStructure(), this.oController.getView().getModel().getProperty("/notificationsByPriorityDescending/")), "Prio model should be empty after bulk action");
        assert.ok(dismissStub.calledOnce, "removeNotificationFromModel was called after dismiss");
        assert.ok(this.dismissNotificationStub.calledOnce, "dismissNotification service call was done");
        assert.ok(addNotifStub.calledOnce, "addNotificationtoModel was called once.");

        dismissStub.restore();
        addNotifStub.restore();
    });

    QUnit.test("verify reloadGroupHeaders", function (assert) {
        this.oController.reloadGroupHeaders();
        assert.ok(this.getNotificationsGroupHeaders.calledOnce, "getNotificationsGroupHeaders service call was done");
        var aGroups = this.oController.getView().getModel().getProperty("/" + this.oController.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING);
        assert.equal(aGroups.length, 2, "2 groups expected");
        assert.ok(aGroups[0].IsGroupHeader, "Group header expected");
        assert.ok(aGroups[1].IsGroupHeader, "Group header expected");

        assert.notOk(aGroups[1].aNotifications, "aNotifications should not be defined ");
        assert.notOk(aGroups[1].aNotifications, "aNotifications should not be defined ");

        assert.equal(aGroups[0].GroupHeaderText, "You have 2 leave requests requiring your attention", "Leave Request group expected");
        assert.equal(aGroups[1].GroupHeaderText, "Purchase orders requiring your approval", "Purchase Order group expected");
    });

    QUnit.test("verify executeBulkAction", function (assert) {
        var sActionName = "Approve-key",
            sActionext = "Approve key",
            oGroupToDelete = { Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209" },
            aGroups;
        var dfd = jQuery.Deferred();
        this.executeBulkActionStub.returns(dfd.promise());
        this.oController.reloadGroupHeaders();
        this.oController.sCurrentExpandedType = oGroupToDelete.Id;
        this.oController.getNextBufferForType();

        aGroups = this.oController.getView().getModel().getProperty("/notificationsByTypeDescending");

        assert.equal(aGroups.length, 2, "2 groups expected before execute action");
        assert.equal(aGroups[0].GroupHeaderText, "You have 2 leave requests requiring your attention", "The first group in the model is changed to the Purches group");
        assert.equal(aGroups[0].aNotifications.length, 2, "2 notifications expected before execute action");

        this.oController.executeBulkAction(sActionName, sActionext, oGroupToDelete, "/notificationsByTypeDescending/0");
        dfd.resolve();
        aGroups = this.oController.getView().getModel().getProperty("/notificationsByTypeDescending");
        assert.equal(aGroups.length, 1, "1 groups expected since 1 group deleted from Model");
        assert.equal(aGroups[0].GroupHeaderText, "Purchase orders requiring your approval", "The first group in the model is changed to the Purches group");
        assert.notOk(aGroups[0].aNotifications, "Now the first group(that was the second group before has no notifications");

        assert.ok(sinon.deepEqual(this.oController.getInitialSortingModelStructure(), this.oController.getView().getModel().getProperty("/notificationsByPriorityDescending/")), "Prio model should be empty after bulk action");
        assert.ok(this.executeBulkActionStub.calledOnce, "executeBulkAction service call was done");
    });

    QUnit.test("verify executeBulkAction reject", function (assert) {
        var sActionName = "Approve-key",
            sActionext = "Approve key",
            oGroupToDelete = {
                Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209",
                notifications: [
                    { Id: "005056ab-6fd8-1ee5-bb88-b1231d763dd0" },
                    { Id: "005056ab-6fd8-1ee5-bb88-b15ceb897dd0" }
                ]
            },
            aGroups;
        var dfd = jQuery.Deferred();
        this.executeBulkActionStub.returns(dfd.promise());
        this.oController.sCurrentSorting = "notificationsByTypeDescending";
        this.oController.reloadGroupHeaders();
        this.oController.sCurrentExpandedType = oGroupToDelete.Id;
        this.oController.getNextBufferForType();

        aGroups = this.oController.getView().getModel().getProperty("/notificationsByTypeDescending");

        assert.equal(aGroups.length, 2, "2 groups expected before execute action");
        assert.equal(aGroups[0].GroupHeaderText, "You have 2 leave requests requiring your attention", "The first group in the model is changed to the Purches group");
        assert.equal(aGroups[0].aNotifications.length, 2, "2 notifications expected before execute action");



        this.oController.executeBulkAction(sActionName, sActionext, oGroupToDelete, "/notificationsByTypeDescending/0");
        dfd.reject({
            "succededNotifications": ["005056b4-24bc-1ee7-85aa-1d95eca91de2"],
            "failedNotifications": ["005056b4-24bc-1ee7-85aa-1d95eca8fde2"]
        });
        assert.ok(this.executeBulkActionStub.calledOnce, "executeBulkAction service call was done");
        aGroups = this.oController.getView().getModel().getProperty("/notificationsByTypeDescending");
        assert.equal(aGroups.length, 2, "2 groups expected since the group was not deleted from Model");
        assert.equal(aGroups[0].aNotifications.length, 1, "now the 1st group should contain 1 notification");
        assert.equal(aGroups[0].aNotifications[0].Id, "005056b4-24bc-1ee7-85aa-1d95eca8fde2", "the failed notification should remain");
    });

    QUnit.test("verify dismissBulkNotifications", function (assert) {
        var oGroupToDelete = { Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209" },
            aGroups,
            dfd = jQuery.Deferred();

        this.dismissBulkNotificationsStub.returns(dfd.promise());
        this.oController.reloadGroupHeaders();
        this.oController.sCurrentExpandedType = oGroupToDelete.Id;
        this.oController.getNextBufferForType();

        aGroups = this.oController.getView().getModel().getProperty("/notificationsByTypeDescending");

        assert.equal(aGroups.length, 2, "2 groups expected before execute action");
        assert.equal(aGroups[0].GroupHeaderText, "You have 2 leave requests requiring your attention", "The first group in the model is changed to the Purches group");
        assert.equal(aGroups[0].aNotifications.length, 2, "2 notifications expected before execute action");

        this.oController.dismissBulkNotifications(oGroupToDelete);
        dfd.resolve();
        assert.ok(this.dismissBulkNotificationsStub.calledOnce, "dismissBulkNotifications service call was done");
        aGroups = this.oController.getView().getModel().getProperty("/notificationsByTypeDescending");
        assert.equal(aGroups.length, 1, "1 groups expected since 1 group deleted from Model");
        assert.notOk(aGroups[0].aNotifications, "now the 1st group should not contain any notifications");
    });

    QUnit.test("verify dismissBulkNotifications reject", function (assert) {
        var oGroupToDelete = {
            Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209",
            aNotifications: [
                { Id: "005056ab-6fd8-1ee5-bb88-b1231d763dd0" },
                { Id: "005056ab-6fd8-1ee5-bb88-b15ceb897dd0" }
            ]
        },
            aGroups,
            dfd = jQuery.Deferred();

        this.dismissBulkNotificationsStub.returns(dfd.promise());
        this.oController.reloadGroupHeaders();
        this.oController.sCurrentExpandedType = oGroupToDelete.Id;
        this.oController.getNextBufferForType();

        aGroups = this.oController.getView().getModel().getProperty("/notificationsByTypeDescending");

        assert.equal(aGroups.length, 2, "2 groups expected before execute action");
        assert.equal(aGroups[0].GroupHeaderText, "You have 2 leave requests requiring your attention", "The first group in the model is changed to the Purches group");
        assert.equal(aGroups[0].aNotifications.length, 2, "2 notifications expected before execute action");

        this.oController.dismissBulkNotifications(oGroupToDelete);
        dfd.reject();
        assert.ok(this.dismissBulkNotificationsStub.calledOnce, "dismissBulkNotifications service call was done");
        aGroups = this.oController.getView().getModel().getProperty("/notificationsByTypeDescending");
        assert.equal(aGroups.length, 2, "2 groups expected since the group was not deleted from Model");
        assert.equal(aGroups[0].aNotifications.length, 2, "now the 1st group should contain 2 notifications");
        assert.notOk(aGroups[1].aNotifications, "now the 2st group should not contain notifications");
    });

    QUnit.test("filterDismisssedItems: dismissed items are filtered out when dismissed items exist", function (assert) {
        var aFitered = this.oService.filterDismisssedItems(
            [{ originalItemId: "01" }, { originalItemId: "02" }],
            ["01"]
        );
        assert.equal(sinon.deepEqual(aFitered, [{ originalItemId: "02" }]), true, "filtered array with 1 item");
    });

    QUnit.module("sap.ushell.renderers.fiori2.notifications.Notifications, Fiori 3 tests", {
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });
});
