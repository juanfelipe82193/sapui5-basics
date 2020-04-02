// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.CardUserRecents
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "jquery.sap.global",
    "sap/ushell/ui5service/CardUserRecents",
    "sap/ushell/EventHub",
    "sap/ushell/Config"
], function (jQuery, CardUserRecents, EventHub, Config) {
    "use strict";

    QUnit.start();

    QUnit.module("The function getData", {
        beforeEach: function () {
            this.oGetRecentActivityStub = sinon.stub();
            this.aRecentActivities = [{
                appId: "#Bank-manage",
                appType: "Application",
                timestamp: 1550484010831,
                title: "Application Navigation Sample",
                url: "#Bank-manage?sap-ui-app-id-hint=fin.cash.bankmaster.manage&version=basic"
            }];
            this.aExpectedCardItems = [{
                Name: "Application Navigation Sample",
                Description: "Application",
                Intent: {
                    SemanticObject: "Bank",
                    Action: "manage",
                    Parameters: {
                        a: ["b"]
                    }
                }
            }];
            var oPromise = jQuery.Deferred().resolve(this.aRecentActivities).promise();
            sap.ushell.Container = {
                getService: function () {
                    return {
                        getRecentActivity: this.oGetRecentActivityStub.returns(oPromise)
                    };
                }.bind(this)
            };
            this.oGetActivitiesAsCardItemsStub = sinon.stub(CardUserRecents.prototype, "_getActivitiesAsCardItems").returns(this.aExpectedCardItems);
            this.oCardUserRecents = new CardUserRecents();
            this.oConfigStub = sinon.stub(Config, "last").returns(true);
        },
        afterEach: function () {
            delete sap.ushell.Container;
            this.oGetActivitiesAsCardItemsStub.restore();
            this.oConfigStub.restore();
        }
    });

    QUnit.test("Calls getRecentActivity of the UserRecentsService", function (assert) {
        return this.oCardUserRecents.getData().then(function () {
            assert.strictEqual(this.oGetRecentActivityStub.callCount, 1, "The function getData calls the getRecentActivity function of the UserRecentsService once.");
        }.bind(this));
    });

    QUnit.test("Calls _getActivitiesAsCardItems of CardUserRecentsBase", function (assert) {
        return this.oCardUserRecents.getData().then(function () {
            assert.strictEqual(this.oGetActivitiesAsCardItemsStub.callCount, 1, "The function getData calls the _getActivitiesAsCardItems function of the UserRecentsService once.");
        }.bind(this));
    });

    QUnit.test("Returns a promise containing an array of recent card items", function (assert) {
        return this.oCardUserRecents.getData().then(function (aCardUserRecentsResult) {
            assert.deepEqual(aCardUserRecentsResult, this.aExpectedCardItems, "The function getData returns a promise with the expected card items.");
        }.bind(this));
    });

    QUnit.test("Returns a promise containing an empty array if the user disabled the activity tracking", function (assert) {
        this.oConfigStub.returns(false);
        return this.oCardUserRecents.getData().then(function (aCardUserRecentsResult) {
            assert.deepEqual(aCardUserRecentsResult, [], "The function getData returns a promise with an empty array.");
        });
    });

    QUnit.module("The function attachDataChanged", {
        beforeEach: function () {
            sap.ushell.Container = {
                getService: function () { }
            };
            this.oGetActivitiesAsCardItemsStub = sinon.stub(CardUserRecents.prototype, "_getActivitiesAsCardItems").returns([]);
            this.oAttachDataChangedCallback = sinon.stub();
            this.oCardUserRecents = new CardUserRecents();
            this.oCardUserRecents.attachDataChanged(this.oAttachDataChangedCallback);
        },
        afterEach: function () {
            this.oGetActivitiesAsCardItemsStub.restore();
            this.oCardUserRecents.detachDataChanged();
        }
    });

    QUnit.test("Executes the callback on the newUserRecentsItem event from the EventHub", function (assert) {
        EventHub.emit("newUserRecentsItem", {
            recentUsageArray: []
        });

        return EventHub.wait("newUserRecentsItem").then(function () {
            assert.strictEqual(this.oGetActivitiesAsCardItemsStub.callCount, 1, "The function callback calls the _getActivitiesAsCardItems function of the UserRecentsService once.");
            assert.ok(this.oAttachDataChangedCallback.calledWithExactly({ data: [] }), "The callback gets executes with the expected data object.");
        }.bind(this));
    });

    QUnit.test("Executes the callback on the userRecentsCleared event from the EventHub", function (assert) {
        EventHub.emit("userRecentsCleared");

        return EventHub.wait("userRecentsCleared").then(function () {
            assert.ok(this.oAttachDataChangedCallback.calledWithExactly({ data: [] }), "The callback gets executes with an empty data object.");
        }.bind(this));
    });

    QUnit.module("The function detachDataChanged", {
        beforeEach: function () {
            sap.ushell.Container = {
                getService: function () { }
            };
            this.oEventHubOffStub = sinon.stub();
            this.oEventHubOnStub = sinon.stub(EventHub, "on").returns({ off: this.oEventHubOffStub });
            this.oCardUserRecents = new CardUserRecents();
        },
        afterEach: function () {
            this.oEventHubOnStub.restore();
        }
    });

    QUnit.test("Unsubscribes from two events of the EventHub", function (assert) {
        this.oCardUserRecents.detachDataChanged();
        assert.strictEqual(this.oEventHubOffStub.callCount, 2, "The function off of the EventHub gets called on two events.");
    });

    QUnit.test("Unsubscribes from the userRecentsCleared event of the EventHub", function (assert) {
        this.oCardUserRecents.detachDataChanged();
        assert.ok(this.oEventHubOnStub.calledWithExactly("userRecentsCleared"), "The function off of the EventHub gets called on the userRecentsCleared Event.");
    });

    QUnit.test("Unsubscribes from the newUserRecentsItem event of the EventHub", function (assert) {
        this.oCardUserRecents.detachDataChanged();
        assert.ok(this.oEventHubOnStub.calledWithExactly("newUserRecentsItem"), "The function off of the EventHub gets called on the newUserRecentsItem Event.");
    });

});
