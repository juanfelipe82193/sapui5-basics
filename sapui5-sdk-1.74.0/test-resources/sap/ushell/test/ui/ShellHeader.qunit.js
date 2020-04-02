// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.HeaderManager
 */
sap.ui.require([
    "jquery.sap.global",
    "sap/ui/core/IconPool",
    "sap/ushell/ui/ShellHeader",
    "sap/ushell/ui/shell/ShellAppTitle",
    "sap/ushell/ui/shell/ShellHeadItem"
], function (jQuery, IconPool, ShellHeader, ShellAppTitle, ShellHeadItem) {
    "use strict";

    /* global QUnit, sinon */

    // for the AppTitle control
    sap.ushell.Container = {
        getService: function () {
            return {
                isEnabled: function () {
                    return true;
                }
            };
        }
    };

    var oShellHeader;

    QUnit.module("basic test", {
        beforeEach: function (assert) {
            var done = assert.async();
            var delegate = {
                onAfterRendering: function () {
                    oShellHeader.removeDelegate(delegate);
                    done();
                }
            };
            if (oShellHeader) {
                oShellHeader.destroy();
            }
            oShellHeader = new ShellHeader("shell-header", {
                logo: jQuery.sap.getModulePath("sap.ushell") + '/themes/base/img/sap_55x27.png',
                showLogo: true,
                visible: true,
                headItems: [
                    new ShellHeadItem("backBtn", {icon: IconPool.getIconURI("back"), ariaLabel: "Back"})
                ],
                headEndItems: [
                    new ShellHeadItem("sf", {icon: IconPool.getIconURI("search"), ariaLabel: "Search"})
                ],
                title: "Subtitle with a long text",
                appTitle: new ShellAppTitle("shellAppTitle", { text: "AppTitle with a long text" }),
                search: new sap.m.Input()
            });
            oShellHeader.createUIArea("canvas");
            oShellHeader.addDelegate(delegate);
        },
        afterEach: {
        }
    });

    QUnit.test("Logo linked if not on homepage, navigate home", function (assert) {
        var done = assert.async();
        var oDelegate = {
            onAfterRendering: function () {
                oShellHeader.removeDelegate(oDelegate);
                assert.equal(jQuery(".sapUshellShellIco").attr("href"), "#Shell-home", "Logo is linked");
                assert.equal(jQuery(".sapUshellShellIco").attr("tabindex"), 0, "Tabindex is set correct for logo");
                assert.equal(jQuery(".sapUshellShellIco").attr("aria-label"), "Home", "Aria-label is set correct for logo");
                // Navigate home
                var oLogo = oShellHeader.$("logo")[0];
                oShellHeader.onsapspace({
                    target: oLogo
                });
                assert.strictEqual(oLogo.href, window.location.href, "Navigate home by space on the logo");
                done();
            }
        };
        if (oShellHeader) {
            oShellHeader.destroy();
        }
        window.hasher = { getHash: sinon.stub().returns('aaa-bbb-ccc') };

        oShellHeader = new ShellHeader("shell-header", {
            homeUri: "#Shell-home"
        });
        oShellHeader.createUIArea("canvas");
        oShellHeader.addDelegate(oDelegate);
    });

    QUnit.test("Logo not linked on homepage", function (assert) {
        var done = assert.async();
        var oDelegate = {
            onAfterRendering: function () {
                assert.notOk(jQuery(".sapUshellShellIco").attr("tabindex"), "tabindex is not set");
                assert.notOk(jQuery(".sapUshellShellIco").attr("title"), "title is not set");
                oShellHeader.removeDelegate(oDelegate);
                done();
            }
        };
        if (oShellHeader) {
            oShellHeader.destroy();
        }
        window.hasher = { getHash: sinon.stub().returns("Shell-home") };
        oShellHeader = new ShellHeader("shell-header", {
            visible: true,
            homeUri: "#Shell-home"
        });
        oShellHeader.createUIArea("canvas");
        oShellHeader.addDelegate(oDelegate);
    });

    QUnit.test("Rendering", function (assert) {
        assert.ok(oShellHeader.getId() === "shell-header", "Shell Header is rendered");
        assert.ok(jQuery("#shellAppTitle .sapUshellHeadTitle").text() === oShellHeader.getAppTitle().getText(), "Apptitle is rendered");
        assert.ok(jQuery(".sapUshellShellHeadSubtitle .sapUshellHeadTitle").text() === oShellHeader.getTitle(), "Title is rendered");
        assert.ok(jQuery(".sapUshellShellIco").length === 1, "Logo is rendered");
        assert.ok(jQuery(".sapUshellShellIco").attr("id") === "shell-header-logo", "Logo has an ID");
        assert.ok(jQuery("#sf").length === 1, "Search button is rendered");
    });

    QUnit.test("Test that accessibility property is set correctly", function (assert) {
        var aHeadItems = oShellHeader.getHeadItems(),
            aHeadEndItems = oShellHeader.getHeadEndItems();

        function assertShellHeaderItem(oItem) {
            if (!oItem.getDomRef()) {
                return;
            }
            var jQueryItem = jQuery(oItem.getDomRef()),
                sId = oItem.getId();
            assert.equal(jQueryItem.attr("tabindex"), 0, "tabindex is set correctly for ShellHeaderItem: " + sId);
            assert.equal(jQueryItem.attr("role"), "button", "role is set correctly for ShellHeaderItem: " + sId);
            assert.ok(!!jQueryItem.attr("aria-label"), "aria-label is not empty for ShellHeaderItem: " + sId);
        }

        aHeadItems.forEach(assertShellHeaderItem);
        aHeadEndItems.forEach(assertShellHeaderItem);

    });

    QUnit.test("_handleFocus:", function (assert) {
        [
            {
                sTestDescription: "navigation from outside and navigation direction forward, no HeadItems",
                bFromOutside: true,
                bForwardNavigation: true,
                bExpectedFocusOnShell: true,
                bExpectedFocusOnShellHeadItem: false,
                bExpectedFocusOnAppTitle: true,
                bExpectedFocusOnShellHeadEndItem: false,
                bExpectedHandleEventUsingExternalKeysHandlerCalled: false
            },
            {
                sTestDescription: "navigation from outside and navigation direction forward, with HeadItems",
                bFromOutside: true,
                bForwardNavigation: true,
                bShellHeadItems: true,
                bExpectedFocusOnShell: true,
                bExpectedFocusOnShellHeadItem: true,
                bExpectedFocusOnAppTitle: false,
                bExpectedFocusOnShellHeadEndItem: false,
                bExpectedHandleEventUsingExternalKeysHandlerCalled: false
            },
            {
                sTestDescription: "navigation from outside and navigation direction backwards, no HeadEndItems",
                bFromOutside: true,
                bForwardNavigation: false,
                bExpectedFocusOnShell: true,
                bExpectedFocusOnShellHeadItem: false,
                bExpectedFocusOnAppTitle: true,
                bExpectedFocusOnShellHeadEndItem: false,
                bExpectedHandleEventUsingExternalKeysHandlerCalled: false
            },
            {
                sTestDescription: "navigation from outside and navigation direction backwards, with HeadEndItems",
                bFromOutside: true,
                bForwardNavigation: false,
                bShellHeadEndItems: true,
                bExpectedFocusOnShell: true,
                bExpectedFocusOnShellHeadItem: false,
                bExpectedFocusOnAppTitle: false,
                bExpectedFocusOnShellHeadEndItem: true,
                bExpectedHandleEventUsingExternalKeysHandlerCalled: false
            },
            {
                sTestDescription: "navigation from inside and navigation direction backwards",
                bFromOutside: false,
                bForwardNavigation: false,
                bExpectedFocusOnShell: false,
                bExpectedFocusOnShellHeadItem: false,
                bExpectedFocusOnAppTitle: false,
                bExpectedFocusOnShellHeadEndItem: false,
                bExpectedHandleEventUsingExternalKeysHandlerCalled: true
            }
        ].forEach(function (oFixture) {
            // Arrange
            var bHandleEventUsingExternalKeysHandlerCalled = false;
            var oAccessKeyHandler = {
                fromOutside: oFixture.bFromOutside,
                bForwardNavigation: oFixture.bForwardNavigation,
                bFocusOnShell: true,
                _handleEventUsingExternalKeysHandler: function () {
                    bHandleEventUsingExternalKeysHandlerCalled = true;
                }
            };

            var oFocusResult = {
                bShellHeadItem: false,
                bAppTitle: false,
                bShellHeadEndItem: false
            };

            var fnGetHeadItemsStub = sinon.stub(oShellHeader, "getHeadItems",
                    function () {
                        return oFixture.bShellHeadItems ? [{
                            focus: function () {
                                oFocusResult.bShellHeadItem = true;
                            }
                        }] : [];
                    }
                ),
                fnGetAppTitleStub = sinon.stub(oShellHeader, "getAppTitle").returns({
                    focus: function () {
                        oFocusResult.bAppTitle = true;
                    }
                }),
                fnGetHeadEndItemsStub = sinon.stub(oShellHeader, "getHeadEndItems",
                    function () {
                        return oFixture.bShellHeadEndItems ? [{
                            focus: function () {
                                oFocusResult.bShellHeadEndItem = true;
                            }
                        }] : [];
                    }
                );


            oShellHeader.setAccessKeyHandler(oAccessKeyHandler);

            // Act
            oShellHeader._handleFocus();

            // Assert
            assert.strictEqual(
                oAccessKeyHandler.bFocusOnShell,
                oFixture.bExpectedFocusOnShell,
                "Focus was (not) set on the shell when " + oFixture.sTestDescription);
            assert.strictEqual(
                oFocusResult.bShellHeadItem,
                oFixture.bExpectedFocusOnShellHeadItem,
                "Focus was (not) set on the first shellHeadItem when " + oFixture.sTestDescription);
            assert.strictEqual(
                oFocusResult.bAppTitle,
                oFixture.bExpectedFocusOnAppTitle,
                "Focus was (not) set on the appTitle when " + oFixture.sTestDescription);
            assert.strictEqual(
                oFocusResult.bShellHeadEndItem,
                oFixture.bExpectedFocusOnShellHeadEndItem,
                "Focus was (not) set on the last shellHeadEndItem when " + oFixture.sTestDescription);
            assert.strictEqual(
                bHandleEventUsingExternalKeysHandlerCalled,
                oFixture.bExpectedHandleEventUsingExternalKeysHandlerCalled,
                "_handleEventUsingExternalKeysHandler was (not) called when " + oFixture.sTestDescription);

            fnGetAppTitleStub.restore();
            fnGetHeadItemsStub.restore();
            fnGetHeadEndItemsStub.restore();
        });
    });

    QUnit.test("Search State", function (assert) {
        var done = assert.async();
        var _afterOpen = {
            onAfterRendering: function () { // after search open
                oShellHeader.removeDelegate(_afterOpen);
                var searchContainer = jQuery("#shell-header-hdr-search");
                var maxWidth = searchContainer[0].style.maxWidth;
                assert.strictEqual(maxWidth, "10rem", "Search field width is correctly set");
                assert.strictEqual(searchContainer.width() > 0, true, "Search Field container is visible");

                // close search
                oShellHeader.setSearchState("COL", 10, true);
                oShellHeader.addDelegate(_afterClose);
            }
        };

        var _afterClose = {
            onAfterRendering: function () { // after search close
                oShellHeader.removeDelegate(_afterClose);
                var searchContainer = jQuery("#shell-header-hdr-search");
                var maxWidth = searchContainer[0].style.maxWidth;
                assert.strictEqual(maxWidth, "0rem", "Search field width is correctly set");
                assert.strictEqual(searchContainer.width(), 0, "Search Field container is invisible");
                done();
            }
        };

        // open search
        oShellHeader.setSearchState("EXP", 10, true);
        oShellHeader.addDelegate(_afterOpen);
    });
});
