// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.override
 */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/override"
], function (override) {
    "use strict";

    /*global QUnit sinon*/
    QUnit.start();
    QUnit.module("_adaptCurrentGroup", {
        beforeEach: function () {
            this.oItemDestroyStub = sinon.stub();
            this.aItems = [{
                id: "000",
                destroy: this.oItemDestroyStub,
                isA: function () {
                    return false;
                }
            },
            {
                id: "001",
                destroy: this.oItemDestroyStub,
                isA: function () {
                    return false;
                }
            },
            {
                id: "002",
                destroy: this.oItemDestroyStub,
                isA: function () {
                    return false;
                }
            }];
            this.aBindingContexts = [{
                id: "000",
                getProperty: function () {
                    return false;
                }
            }, {
                id: "001",
                getProperty: function () {
                    return false;
                }
            }];
        },
        afterEach: function () {
            this.aItems = null;
            this.aBindingContexts = null;
        }
    });

    QUnit.test("Keeps the items in the current group, when there is no card in the current and incoming groups", function (assert) {
        // Act
        override._adaptCurrentGroup(this.aBindingContexts, this.aItems);

        // Assert
        assert.equal(this.oItemDestroyStub.callCount, 0, "No item is destroyed");
    });

    QUnit.test("Removes the current item and all following items in the current group, when there are cards in the current group", function (assert) {
        // Arrange
        this.aItems[1].isA = function () {
            return true;
        };

        // Act
        override._adaptCurrentGroup(this.aBindingContexts, this.aItems);

        // Assert
        assert.equal(this.oItemDestroyStub.callCount, 2, "Correct number of items are destroyed");
    });

    QUnit.test("Removes the current item and all following items in the current group, when there are cards in the incoming group", function (assert) {
        // Arrange
        this.aBindingContexts[0].getProperty = function () {
            return true;
        };

        // Act
        override._adaptCurrentGroup(this.aBindingContexts, this.aItems);

        // Assert
        assert.equal(this.oItemDestroyStub.callCount, 3, "Correct number of items are destroyed");
    });

    QUnit.module("_updateCurrentGroup", {
        beforeEach: function () {
            this.oItemDestroyStub = sinon.stub();
            this.oItemSetBindingContextStub = sinon.stub();
            this.aItems = [{
                id: "000",
                destroy: this.oItemDestroyStub,
                bIsDestroyed: false,
                setBindingContext: this.oItemSetBindingContextStub
            },
            {
                id: "001",
                destroy: this.oItemDestroyStub,
                bIsDestroyed: false,
                setBindingContext: this.oItemSetBindingContextStub
            },
            {
                id: "002",
                destroy: this.oItemDestroyStub,
                bIsDestroyed: false,
                setBindingContext: this.oItemSetBindingContextStub
            }];
            this.aBindingContexts = [{
                id: "000"
            }, {
                id: "001"
            }, {
                id: "002"
            }];
            this.oFnAddNewItemStub = sinon.stub();
            this.oBindingInfoModel = {};
        },
        afterEach: function () {
            this.aItems = null;
            this.aBindingContexts = null;
            this.oBindingInfoModel = null;
        }
    });

    QUnit.test("Calls setBindingContext when the current item exists and is not destroyed", function (assert) {
        // Act
        override._updateCurrentGroup(this.aBindingContexts, this.aItems, this.oBindingInfoModel, this.oFnAddNewItemStub);

        // Assert
        assert.equal(this.oItemSetBindingContextStub.callCount, 3, "setBindingContext is called 3 times");
    });

    QUnit.test("Calls fnAddNewItem when the current item does not exist", function (assert) {
        // Arrange
        this.aItems = {};

        // Act
        override._updateCurrentGroup(this.aBindingContexts, this.aItems, this.oBindingInfoModel, this.oFnAddNewItemStub);

        // Assert
        assert.equal(this.oFnAddNewItemStub.callCount, 3, "fnAddNewItem is called 3 times");
    });

    QUnit.test("Calls fnAddNewItem when the current item is destroyed", function (assert) {
        // Arrange
        this.aItems[0].bIsDestroyed = true;
        this.aItems[1].bIsDestroyed = true;
        this.aItems[2].bIsDestroyed = true;

        // Act
        override._updateCurrentGroup(this.aBindingContexts, this.aItems, this.oBindingInfoModel, this.oFnAddNewItemStub);

        // Assert
        assert.equal(this.oFnAddNewItemStub.callCount, 3, "fnAddNewItem is called 3 times");
    });

    QUnit.test("Destroys remaining items when the current group is longer than the incoming group", function (assert) {
        // Arrange
        var aNewItems = [{
            id: "003",
            destroy: this.oItemDestroyStub,
            bIsDestroyed: false,
            setBindingContext: this.oItemSetBindingContextStub
        },
        {
            id: "004",
            destroy: this.oItemDestroyStub,
            bIsDestroyed: false,
            setBindingContext: this.oItemSetBindingContextStub
        },
        {
            id: "005",
            destroy: this.oItemDestroyStub,
            bIsDestroyed: false,
            setBindingContext: this.oItemSetBindingContextStub
        }
        ];
        this.aItems = this.aItems.concat(aNewItems);

        // Act
        override._updateCurrentGroup(this.aBindingContexts, this.aItems, this.oBindingInfoModel, this.oFnAddNewItemStub);

        // Assert
        assert.equal(this.oItemDestroyStub.callCount, 3, "destroy is called 3 times");
    });

});
