// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.CardUserRecentsBase
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/services/AppType",
    "sap/ushell/ui5service/_CardUserRecents/CardUserRecentsBase"
], function (AppType, CardUserRecentsBase) {
    "use strict";

    QUnit.start();
    QUnit.module("The constructor", {
        beforeEach: function () {
            this.oGetServiceStub = sinon.stub();
            sap.ushell.Container = {
                getService: this.oGetServiceStub
            };
            this.oCardUserRecentsBase = new CardUserRecentsBase();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Retrieves all required ushell services", function (assert) {
        assert.strictEqual(this.oGetServiceStub.callCount, 2, "The function getService gets called twice.");
    });

    QUnit.test("Retrieves the UserRecentsService", function (assert) {
        assert.ok(this.oGetServiceStub.calledWithExactly("UserRecents"), "The function getService is called with: UserRecents");
    });

    QUnit.test("Retrieves the URLParsingService", function (assert) {
        assert.ok(this.oGetServiceStub.calledWithExactly("URLParsing"), "The function getService is called with: URLParsing");
    });

    QUnit.module("The function _getActivitiesAsCardItems", {
        beforeEach: function () {
            this.oShellHashResult = null;
            sap.ushell.Container = {
                getService: function () {
                    return {
                        parseShellHash: function () {
                            return this.oShellHashResult;
                        }.bind(this)
                    };
                }.bind(this)
            };
            this.oCardUserRecentsBase = new CardUserRecentsBase();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Returns an array of card items with intent based navigation", function (assert) {
        // Arrange
        this.oShellHashResult = {
            semanticObject: "Bank",
            action: "manage",
            params: {
                a: ["b"]
            }
        };

        var aActivities = [{
            appId: "#Bank-manage",
            appType: AppType.APP,
            timestamp: 1550484010831,
            icon: "sap-icon://product",
            title: "Application Navigation Sample",
            url: "#Bank-manage?sap-ui-app-id-hint=fin.cash.bankmaster.manage&version=basic"
        }];

        var aExpectedCardItems = [{
            Name: "Application Navigation Sample",
            Description: AppType.getDisplayName(AppType.APP),
            Icon: "sap-icon://product",
            Intent: {
                SemanticObject: "Bank",
                Action: "manage",
                Parameters: {
                    a: ["b"]
                },
                "AppSpecificRoute": undefined
            }
        }];

        // Act
        var aCardItems = this.oCardUserRecentsBase._getActivitiesAsCardItems(aActivities);

        // Assert
        assert.deepEqual(aCardItems, aExpectedCardItems, "The function _getActivitiesAsCardItems returns a correctly formated array of card items.");
    });

    QUnit.test("Returns an array of card items with URL based/external navigation", function (assert) {
        // Arrange
        this.oShellHashResult = undefined;

        var aActivities = [{
            appId: "URLTile",
            appType: AppType.URL,
            timestamp: 1550484010831,
            title: "URL Tile",
            url: "http://www.sap.com"
        }];

        var aExpectedCardItems = [{
            Name: "URL Tile",
            Description: AppType.getDisplayName(AppType.URL),
            Icon: "sap-icon://product",
            Url: "http://www.sap.com"
        }];

        // Act
        var aCardItems = this.oCardUserRecentsBase._getActivitiesAsCardItems(aActivities);

        // Assert
        assert.deepEqual(aCardItems, aExpectedCardItems, "The function _getActivitiesAsCardItems returns a correctly formated array of card items if the activity has a URL instead of an intent.");
    });

});
