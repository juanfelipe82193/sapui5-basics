// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for QuickAccess
 */
sap.ui.require([
    "jquery.sap.global",
    "sap/ushell/ui/QuickAccess",
    "sap/ui/core/Fragment"
], function (jQuery, QuickAccess, Fragment) {
    "use strict";
    /* global QUnit sinon */

    var oDialog;
    var oIconTabBar;

    QUnit.module("QuickAccess functionality", {
        before: function () {
            sap.ushell.Container = sap.ushell.Container || {};
        },
        beforeEach: function () {
            sap.ushell.Container.getService = sinon.stub();
            oIconTabBar = {
                setBusy: sinon.spy()
            };
            oDialog = {
                getContent: function () {
                    return [oIconTabBar];
                },
                setContentHeight: sinon.spy()
            };
        }
    });

    QUnit.test("Check that set busy is set durung the updating the dialog", function (assert) {
        var fnDone = assert.async();
        var oQuickAccess = QuickAccess._getQuickAccess();

        sap.ushell.Container.getService.returns({
            getRecentActivity: function () {
                return new jQuery.Deferred().resolve([]);
            },
            getFrequentActivity: function () {
                return new jQuery.Deferred().resolve([]);
            }
        });

        oQuickAccess._updateQuickAccessDialog(oDialog);
        setTimeout(function () {
            assert.ok(oIconTabBar.setBusy.calledTwice, "Busy indicator should be set during the update and reset when promise is resolved");
            assert.equal(oIconTabBar.setBusy.getCall(0).args[0], true, "first call setBusy is correct");
            assert.equal(oIconTabBar.setBusy.getCall(1).args[0], false, "second call of setBusy is correct");
            assert.equal(oDialog.setContentHeight.getCall(0).args[0], "18rem", "set minimal size for content height, because there is no items");
            fnDone();
        }, 10);
    });

    QUnit.test("fail case for getActivity is handle as empty array", function (assert) {
        var fnDone = assert.async();
        var oQuickAccess = QuickAccess._getQuickAccess();

        sap.ushell.Container.getService.returns({
            getRecentActivity: function () {
                return new jQuery.Deferred().resolve([]);
            },
            getFrequentActivity: function () {
                return new jQuery.Deferred().resolve([{}, {}, {}, {}, {}]);
            }
        });

        oQuickAccess._updateQuickAccessDialog(oDialog);
        setTimeout(function () {
            assert.equal(oDialog.setContentHeight.getCall(0).args[0], "24.75rem", "set minimal size for content height");
            fnDone();
        }, 10);
    });

    QUnit.test("set content height based on bigger list", function (assert) {
        var fnDone = assert.async();
        var oQuickAccess = QuickAccess._getQuickAccess();

        sap.ushell.Container.getService.returns({
            getRecentActivity: function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.reject("error");
                return oDeferred.promise();
            },
            getFrequentActivity: function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.reject("error");
                return oDeferred.promise();
            }
        });

        oQuickAccess._updateQuickAccessDialog(oDialog);
        setTimeout(function () {
            assert.ok(oIconTabBar.setBusy.calledTwice, "Busy indicator should be set during the update and reset when promise is resolved");
            assert.equal(oIconTabBar.setBusy.getCall(0).args[0], true, "first call setBusy is correct");
            assert.equal(oIconTabBar.setBusy.getCall(1).args[0], false, "second call of setBusy is correct");
            assert.equal(oDialog.setContentHeight.getCall(0).args[0], "18rem", "set minimal size for content height");
            fnDone();
        }, 10);
    });

    QUnit.test("_setDialogContentHeight: set calculated size if height is in the range [18; 42]", function (assert) {
        var oQuickAccess = QuickAccess._getQuickAccess();
        oQuickAccess._setDialogContentHeight(oDialog, 5);
        assert.equal(oDialog.setContentHeight.getCall(0).args[0], "24.75rem", "set minimal size for content height");
    });

    QUnit.test("_setDialogContentHeight: set max height if calculated height is > 42", function (assert) {
        var oQuickAccess = QuickAccess._getQuickAccess();
        oQuickAccess._setDialogContentHeight(oDialog, 15);
        assert.equal(oDialog.setContentHeight.getCall(0).args[0], "42rem", "set minimal size for content height");
    });

    QUnit.test("_setDialogContentHeight: set min height if calculated height is < 18", function (assert) {
        var oQuickAccess = QuickAccess._getQuickAccess();
        oQuickAccess._setDialogContentHeight(oDialog, 1);
        assert.equal(oDialog.setContentHeight.getCall(0).args[0], "18rem", "set minimal size for content height");
    });

});