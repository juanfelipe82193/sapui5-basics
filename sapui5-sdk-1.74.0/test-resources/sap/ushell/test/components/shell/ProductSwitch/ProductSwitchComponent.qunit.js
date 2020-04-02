// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.ProductSwitch.Components
 *
 */
sap.ui.require([
    "sap/m/Popover",
    "sap/ushell/services/Container",
    "sap/ushell/Config",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/ushell/components/shell/ProductSwitch/Component"
], function (Popover, Container, Config, ShellHeadItem, ProductSwitchComponent) {
    "use strict";
    /*global QUnit, test, sinon, sap, window */

    QUnit.module("sap.ushell.components.shell.ProductSwitch.Components", {

        beforeEach: function () {
            window["sap-ushell-config"] = {
                "productSwitch": {
                    "url": "/some/url"
                },
                "renderers": {
                    "fiori2": {
                        "componentData": {
                            "config": {
                                "applications": {
                                    "Shell-home": {}
                                },
                                "rootIntent": "Shell-home"
                            }
                        }
                    }
                }
            };
        },
        afterEach: function () {
            // delete Container; will not work have to use delete sap.ushell.Container;
            delete sap.ushell.Container;
        }
    });

    var mockRendered;
    var createRenderer = function () {
        mockRendered = {
            hideHeaderEndItem: sinon.spy()
        };
        sap.ushell.Container.getRenderer = function () {
            return mockRendered;
        };
    };

    QUnit.test("Remove button from header if there is no products in response", function (assert) {
        var fnDone = assert.async();
        // arrange
        sap.ushell.bootstrap("local").then(function () {
            createRenderer();

            var oXHRStub = sinon.useFakeXMLHttpRequest();
            var aRequests = [];
            oXHRStub.onCreate = function (xhr) {
                aRequests.push(xhr);
            }

            // act
            ProductSwitchComponent.prototype._getModel();
            assert.equal(aRequests.length, 1, "ProductSwitch should make request to get the data");
            //return empty json
            aRequests[0].respond(200, {"Content-Type": "application/json"}, '[]');
            setTimeout(function () {
                var fnHideItem = sap.ushell.Container.getRenderer().hideHeaderEndItem;
                assert.ok(fnHideItem.calledOnce,
                    "remove productSwitchBtn from header if there is no products");
                assert.deepEqual(fnHideItem.getCall(0).args, ["productSwitchBtn"], "the correct button is removed");
                fnDone();
            }, 10);

             // clean up
             oXHRStub.restore();
        });
    });

    QUnit.test("Remove button from header if request fails", function (assert) {
        var fnDone = assert.async();
        // arrange
        sap.ushell.bootstrap("local").then(function () {
            createRenderer();

            var oXHRStub = sinon.useFakeXMLHttpRequest();
            var aRequests = [];
            oXHRStub.onCreate = function (xhr) {
                aRequests.push(xhr);
            }

            // act
            ProductSwitchComponent.prototype._getModel();
            assert.equal(aRequests.length, 1, "ProductSwitch should make request to get the data");
            //return empty json
            aRequests[0].respond(500, {"Content-Type": "text/html"}, "");
            setTimeout(function () {
                var fnHideItem = sap.ushell.Container.getRenderer().hideHeaderEndItem;
                assert.ok(fnHideItem.calledOnce,
                    "remove productSwitchBtn from header if there is no products");
                assert.deepEqual(fnHideItem.getCall(0).args, ["productSwitchBtn"], "the correct button is removed");
                fnDone();
            }, 10);

             // clean up
             oXHRStub.restore();
        });
    });

    QUnit.test("productSwitchBtn should be set visible if there are products in response", function (assert) {
        var done = assert.async();
        // arrange
        sap.ushell.bootstrap("local").then(function () {
            var oProductSwitchButton = new ShellHeadItem({
                id: "productSwitchBtn"
            });
            var oSetVisibleSpy = sinon.spy(oProductSwitchButton, "setVisible");

            var oXHRStub = sinon.useFakeXMLHttpRequest();
            var aRequests = [];
            oXHRStub.onCreate = function (xhr) {
                aRequests.push(xhr);
            }

            // act
            ProductSwitchComponent.prototype._getModel();
            assert.equal(aRequests.length, 1, "ProductSwitch should make request to get the data");

            aRequests[0].respond(200, {"Content-Type": "text/html"}, '[{"title": "test"}]');
            setTimeout(function () {
                assert.ok(oSetVisibleSpy.calledOnce, "productSwitchBtn should be set visible");
                assert.deepEqual(oSetVisibleSpy.getCall(0).args, [true], "productSwitchBtn should be set visible");
                // clean up
                oProductSwitchButton.destroy();
                oXHRStub.restore();
                done();
            }, 10);
        });
    });

    QUnit.test("create popover if it was not created", function (assert) {
        var fnDone = assert.async();
        // arrange
        sap.ushell.bootstrap("local").then(function () {
            var oOverflowButton = new ShellHeadItem({
                id: "endItemsOverflowBtn"
            });

            var oPopover = new Popover("test"),
                oOpenByStub= sinon.stub(oPopover, "openBy"),
                oFragmentStub = sinon.stub(sap.ui, "xmlfragment").returns(oPopover);

            oPopover.setModel = sinon.spy();

            // act
            ProductSwitchComponent.prototype._openProductSwitch();
            assert.ok(oOpenByStub.calledOnce, "popover was opened");
            assert.ok(oPopover.setModel.calledTwice, "model is set for fragment");


            oPopover.destroy();
            oOverflowButton.destroy();
            fnDone();

        });
    });

    QUnit.test("open popover by overflow if there is no productSwitchBtn", function (assert) {
        var fnDone = assert.async();
        // arrange
        sap.ushell.bootstrap("local").then(function () {
            var oOverflowButton = new ShellHeadItem({
                id: "endItemsOverflowBtn"
            });

            var oPopover = new Popover("sapUshellProductSwitchPopover");
            var oOpenByStub= sinon.stub(oPopover, "openBy");

            // act
            ProductSwitchComponent.prototype._openProductSwitch();
            assert.ok(oOpenByStub.calledOnce, "popover was opened");
            assert.equal(oOpenByStub.getCall(0).args[0].getId(), "endItemsOverflowBtn", "popover was opened on endItemsOverflowBtn");

            oPopover.destroy();
            oOverflowButton.destroy();
            fnDone();

        });
    });

    QUnit.test("Close popover and open new tab by press on a product", function (assert) {
        var fnDone = assert.async();
        // arrange
        sap.ushell.bootstrap("local").then(function () {
            var oPopover = new Popover("sapUshellProductSwitchPopover"),
                oPopoverCloseStub= sinon.stub(oPopover, "close"),
                oWindowOpenStub = sinon.stub(window, "open"),
                sUrl = "https://www.sap.com";

            var oEvent = {
                getParameter: function () {
                    return {
                        getTargetSrc: function () {
                            return sUrl;
                        }
                    };
                }
            }

            // act
            ProductSwitchComponent.prototype.onProductItemPress(oEvent);
            assert.ok(oPopoverCloseStub.calledOnce, "popover was closed");
            assert.ok(oWindowOpenStub.calledOnce, "new tab was opened");
            assert.deepEqual(oWindowOpenStub.getCall(0).args, [sUrl, "_blank"], "the correct url is opened");

            oPopover.destroy();
            oWindowOpenStub.restore();
            fnDone();

        });
    });


});


