// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for PageComposer - PageDetailEdit (sap.ushell.applications.PageComposer.controller.PageDetailEdit)
 */

/* global QUnit, sinon */
sap.ui.require([
    "sap/ushell/applications/PageComposer/controller/PageDetailEdit.controller"
], function (PageDetailEditController) {
    "use strict";

    QUnit.module("The function _pageEditAllowed", {
        beforeEach: function () {
            this.oPageDetailEditController = new PageDetailEditController();
            this.oCheckMasterLanguageMismatchStub = sinon.stub(this.oPageDetailEditController, "checkMasterLanguageMismatch");
            this.oCheckPageHasErrorsStub = sinon.stub(this.oPageDetailEditController, "_checkPageHasErrors");
        },
        afterEach: function () {
            delete this.oPageDetailEditController;
            this.oCheckMasterLanguageMismatchStub.restore();
        }
    });

    QUnit.test("returns false if languages differ & Page doesn't have errors", function (assert) {
        var done = assert.async();
        assert.expect(1);
        this.oCheckMasterLanguageMismatchStub.returns(true);
        this.oCheckPageHasErrorsStub.returns(false);
        this.oPageDetailEditController._pageEditAllowed(this.oPage).then(function (editAllowed) {
            assert.strictEqual(editAllowed, false, "The result was false");
        }).catch(function (oError) {
            assert.ok(false, "An unexpected error occurred: " + oError.message);
        }).finally(done);
    });

    QUnit.test("returns false if languages is same & Page has errors", function (assert) {
        var done = assert.async();
        assert.expect(1);
        this.oCheckMasterLanguageMismatchStub.returns(false);
        this.oCheckPageHasErrorsStub.returns(true);
        this.oPageDetailEditController._pageEditAllowed(this.oPage).then(function (editAllowed) {
            assert.strictEqual(editAllowed, false, "The result was false");
        }).catch(function (oError) {
            assert.ok(false, "An unexpected error occurred: " + oError.message);
        }).finally(done);
    });

    QUnit.test("returns true if languages match & Page has no errors", function (assert) {
        var done = assert.async();
        assert.expect(1);
        this.oCheckMasterLanguageMismatchStub.returns(false);
        this.oCheckPageHasErrorsStub.returns(false);
        this.oPageDetailEditController._pageEditAllowed(this.oPage).then(function (editAllowed) {
            assert.strictEqual(editAllowed, true, "The result was true");
        }).catch(function (oError) {
            assert.ok(false, "An unexpected error occurred: " + oError.message);
        }).finally(done);
    });

    QUnit.test("returns false if languages mismatch & Page has errors", function (assert) {
        var done = assert.async();
        assert.expect(1);
        this.oCheckMasterLanguageMismatchStub.returns(true);
        this.oCheckPageHasErrorsStub.returns(true);
        this.oPageDetailEditController._pageEditAllowed(this.oPage).then(function (editAllowed) {
            assert.strictEqual(editAllowed, false, "The result was false");
        }).catch(function (oError) {
            assert.ok(false, "An unexpected error occurred: " + oError.message);
        }).finally(done);
    });

    QUnit.module("The function addSectionAt", {
        beforeEach: function () {
            this.aSections = [
                {
                    title: "title1",
                    visualizations: []
                }, {
                    title: "title2",
                    visualizations: []
                }
            ];

            this.oPageDetailEditController = new PageDetailEditController();

            this.oGetModelStub = sinon.stub(this.oPageDetailEditController, "getModel").returns({
                getProperty: function () {},
                setProperty: function () {}
            });
            this.oGetPropertyStub = sinon.stub(this.oPageDetailEditController.getModel(), "getProperty").returns(this.aSections);
            this.oSetPropertyStub = sinon.stub(this.oPageDetailEditController.getModel(), "setProperty");
        },

        afterEach: function () {
            delete this.oPageDetailEditController;
            this.oGetPropertyStub.restore();
            this.oSetPropertyStub.restore();
        }
    });

    QUnit.test("adds a section at a specific index", function (assert) {
        //Arrange
        var iIndex = 1,
            aSectionsExpected = [
                {
                    title: "title1",
                    visualizations: []
                }, {
                    title: "",
                    visualizations: []
                }, {
                    title: "title2",
                    visualizations: []
                }
            ];

        //Act
        this.oPageDetailEditController.addSectionAt(iIndex);

        //Assert
        assert.deepEqual(this.oSetPropertyStub.firstCall.args[1], aSectionsExpected, "The sections were set correctly.");
    });

    QUnit.test("adds a section at the beginning", function (assert) {
        //Arrange
        var iIndex = 0,
            aSectionsExpected = [
                {
                    title: "",
                    visualizations: []
                }, {
                    title: "title1",
                    visualizations: []
                }, {
                    title: "title2",
                    visualizations: []
                }
            ];

        //Act
        this.oPageDetailEditController.addSectionAt(iIndex);

        //Assert
        assert.deepEqual(this.oSetPropertyStub.firstCall.args[1], aSectionsExpected, "The sections were set correctly.");
    });

    QUnit.test("adds a section at the end because there is no index given", function (assert) {
        //Arrange
        var aSectionsExpected = [
            {
                title: "title1",
                visualizations: []
            }, {
                title: "title2",
                visualizations: []
            }, {
                title: "",
                visualizations: []
            }
        ];

        //Act
        this.oPageDetailEditController.addSectionAt();

        //Assert
        assert.deepEqual(this.oSetPropertyStub.firstCall.args[1], aSectionsExpected, "The sections were set correctly.");
    });

    QUnit.test("adds a section at the end because the index is out of bounds", function (assert) {
        //Arrange
        var iIndex = 42,
            aSectionsExpected = [
                {
                    title: "title1",
                    visualizations: []
                }, {
                    title: "title2",
                    visualizations: []
                }, {
                    title: "",
                    visualizations: []
                }
            ];

        //Act
        this.oPageDetailEditController.addSectionAt(iIndex);

        //Assert
        assert.deepEqual(this.oSetPropertyStub.firstCall.args[1], aSectionsExpected, "The sections were set correctly.");
    });
});
