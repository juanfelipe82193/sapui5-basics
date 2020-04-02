// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.Pages
 */
/* global QUnit sinon*/
sap.ui.require([
    "sap/ushell/services/Pages",
    "sap/ui/model/Model",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readHome",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations",
    "sap/ushell/utils",
    "sap/base/Log"
],
function (Pages, Model, readHome, readVisualizations, utils, Log) {
    "use strict";

    var sandbox = sinon.createSandbox({});

    QUnit.module("Constructor", {
        beforeEach: function () {
            sap.ushell = { Container: {} };
            sap.ushell.Container.getServiceAsync = function (sParam) {
                return sParam;
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("initial Properties are set correctly", function (assert) {
        //Arrange

        //Act
        var oPagesService = new Pages();

        //Assert
        assert.strictEqual(oPagesService.COMPONENT_NAME, "sap/ushell/services/Pages", "initial value was succesfully set");
        assert.strictEqual(oPagesService._oCdmServicePromise, "CommonDataModel", "Cdm Service was successfully called");
        assert.ok(oPagesService._oPagesModel instanceof Model, "Model was successfully added");
    });

    QUnit.module("_getParsedCdmPage", {
        beforeEach: function () {
            QUnit.dump.maxDepth = 6;
            this.oSite = {
                site: {
                    identification: {
                        "id": "pageId1",
                        "title": "pageTitle",
                        "description": "pageDescription"
                    }
                }
            };
            this.oExpectedResult = {
                id: "pageId1",
                title: "pageTitle",
                description: "pageDescription",
                sections: [{
                    id: "oGetGroupIdStub",
                    title: "oGetGroupTitleStub",
                    visualizations: [{
                        vizId: "oGetTileVizIdStub",
                        vizType: "oGetTypeIdStub",
                        title: "oGetTitleStub",
                        subTitle: "oGetSubTitleStub",
                        icon: "oGetIconStub",
                        keywords: "oGetKeywordsStub",
                        info: "oGetInfoStub",
                        target: "oGetTargetStub"
                    }]
                }]
            };
            sap.ushell = { Container: {} };
            sap.ushell.Container.getServiceAsync = function (sParam) {
                return sParam;
            };

            this.oTestTile = {
                id: "TestTileId",
                vizId: "TestTileVizId"
            };

            //On the readHome object
            this.oGetGroupIdsFromSiteStub = sandbox.stub(readHome, "getGroupIdsFromSite");
            this.oGetGroupFromSiteStub = sandbox.stub(readHome, "getGroupFromSite");
            this.oGetGroupIdStub = sandbox.stub(readHome, "getGroupId");
            this.oGetGroupTitleStub = sandbox.stub(readHome, "getGroupTitle");
            this.oGetGroupTilesStub = sandbox.stub(readHome, "getGroupTiles");
            this.oGetTileVizIdStub = sandbox.stub(readHome, "getTileVizId");

            //On the readVisualizations object
            this.oGetStub = sandbox.stub(readVisualizations, "get");
            this.oGetCdmPartsStub = sandbox.stub(readVisualizations, "getCdmParts");
            this.oGetTypeIdStub = sandbox.stub(readVisualizations, "getTypeId");
            this.oGetTitleStub = sandbox.stub(readVisualizations, "getTitle");
            this.oGetSubTitleStub = sandbox.stub(readVisualizations, "getSubTitle");
            this.oGetIconStub = sandbox.stub(readVisualizations, "getIcon");
            this.oGetKeywordsStub = sandbox.stub(readVisualizations, "getKeywords");
            this.oGetInfoStub = sandbox.stub(readVisualizations, "getInfo");
            this.oGetTargetStub = sandbox.stub(readVisualizations, "getTarget");

            this.fnRefreshStubs = function () {
                //On the readHome object
                this.oGetGroupIdsFromSiteStub.withArgs(this.oSite).returns(["oGetGroupIdsFromSiteStub"]);
                this.oGetGroupFromSiteStub.withArgs(this.oSite, "oGetGroupIdsFromSiteStub").returns("oGetGroupFromSiteStub");
                this.oGetGroupIdStub.withArgs("oGetGroupFromSiteStub").returns("oGetGroupIdStub");
                this.oGetGroupTitleStub.withArgs("oGetGroupFromSiteStub").returns("oGetGroupTitleStub");
                this.oGetGroupTilesStub.withArgs("oGetGroupFromSiteStub").returns([this.oTestTile]);
                this.oGetTileVizIdStub.withArgs(this.oTestTile).returns("oGetTileVizIdStub");

                //On the readVisualizations object
                this.oGetStub.withArgs(this.oSite, "oGetTileVizIdStub").returns("oGetStub");
                this.oGetCdmPartsStub.withArgs(this.oSite, this.oTestTile).returns("oGetCdmPartsStub");
                this.oGetTypeIdStub.withArgs("oGetStub").returns("oGetTypeIdStub");
                this.oGetTitleStub.withArgs("oGetCdmPartsStub").returns("oGetTitleStub");
                this.oGetSubTitleStub.withArgs("oGetCdmPartsStub").returns("oGetSubTitleStub");
                this.oGetIconStub.withArgs("oGetCdmPartsStub").returns("oGetIconStub");
                this.oGetKeywordsStub.withArgs("oGetCdmPartsStub").returns("oGetKeywordsStub");
                this.oGetInfoStub.withArgs("oGetCdmPartsStub").returns("oGetInfoStub");
                this.oGetTargetStub.withArgs("oGetStub").returns("oGetTargetStub");
            };

            this.oLogErrorStub = sandbox.stub(Log, "error");

            this.oPagesService = new Pages();
            this.fnRefreshStubs();
        },
        afterEach: function () {
            delete sap.ushell.Container;

            sandbox.restore();
        }
    });

    QUnit.test("A CDM Site is correctly transformed according to the model", function (assert) {
        //Arrange
        //Act
        var oResult = this.oPagesService._getParsedCdmPage(this.oSite);
        //Assert
        assert.deepEqual(oResult, this.oExpectedResult, "Transformation of the cdm object to the model was correct");
    });

    QUnit.test("A CDM Site is correctly transformed with default values", function (assert) {
        //Arrange
        this.oSite = {
            site: {
                identification: {}
            }
        };
        this.fnRefreshStubs();

        //On the readHome object
        this.oGetGroupIdStub.withArgs("oGetGroupFromSiteStub").returns();
        this.oGetGroupTitleStub.withArgs("oGetGroupFromSiteStub").returns();

        //On the readVisualizations object
        this.oGetTypeIdStub.withArgs("oGetStub").returns();
        this.oGetTitleStub.withArgs("oGetCdmPartsStub").returns();
        this.oGetSubTitleStub.withArgs("oGetCdmPartsStub").returns();
        this.oGetIconStub.withArgs("oGetCdmPartsStub").returns();
        this.oGetKeywordsStub.withArgs("oGetCdmPartsStub").returns();
        this.oGetInfoStub.withArgs("oGetCdmPartsStub").returns();
        this.oGetTargetStub.withArgs("oGetStub").returns();

        this.oExpectedResult = {
            id: "",
            title: "",
            description: "",
            sections: [{
                id: "",
                title: "",
                visualizations: [{
                    vizId: "oGetTileVizIdStub",
                    vizType: "",
                    title: "",
                    subTitle: "",
                    icon: "",
                    keywords: [],
                    info: "",
                    target: {}
                }]
            }]
        };
        //Act
        var oResult = this.oPagesService._getParsedCdmPage(this.oSite);
        //Assert
        assert.deepEqual(oResult, this.oExpectedResult, "Transformation of the cdm object to the model was correct");
    });

    QUnit.test("A tile without valid visualization gets filtered out", function (assert) {
        //Arrange
        this.oGetStub.withArgs(this.oSite, "oGetTileVizIdStub").returns();

        //Remove the visualization of the tile
        this.oExpectedResult.sections[0].visualizations.splice(0, 1);

        //Act
        var oResult = this.oPagesService._getParsedCdmPage(this.oSite);
        //Assert
        assert.deepEqual(oResult, this.oExpectedResult, "Transformation of the cdm object to the model was correct.");
        assert.strictEqual(this.oLogErrorStub.callCount, 1, "The method error of Log is called once.");
        assert.deepEqual(this.oLogErrorStub.getCall(0).args, ["Tile TestTileId with vizId TestTileVizId has no matching visualization. As the tile cannot be used to start an app it is removed from the page."], "The method error of Log is called with correct paramters.");
    });

    QUnit.module("getModel", {
        beforeEach: function () {
            sap.ushell = { Container: {} };
            sap.ushell.Container.getServiceAsync = function (sParam) {
                return sParam;
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Model is correctly exposed", function (assert) {
        //Arrange
        var oPagesService = new Pages();
        //Act
        var oModel = oPagesService.getModel();
        //Assert
        assert.strictEqual(oModel, oPagesService._oPagesModel, "The model was returned");
    });

    QUnit.module("getPagePath", {
        beforeEach: function () {
            sap.ushell = { Container: {} };
            sap.ushell.Container.getServiceAsync = function (sParam) {
                return sParam;
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("page with pageId is in model", function (assert) {
        //Arrange
        var oPagesService = new Pages();
        oPagesService._oPagesModel._setProperty("/pages/0", {id: "ImHere"});
        //Act
        var sPath = oPagesService.getPagePath("ImHere");
        //Assert
        assert.strictEqual(sPath, "/pages/0", "path to page was returned");
    });

    QUnit.test("page with pageId is not in model", function (assert) {
        //Arrange
        var oPagesService = new Pages();
        //Act
        var sPath = oPagesService.getPagePath("ImNotHere");
        //Assert
        assert.strictEqual(sPath, "", "An empty string was returned");
    });

    QUnit.module("loadPage", {
        beforeEach: function () {
            sap.ushell = { Container: {} };
            this.sMockError = "Custom Error";
            this.oGetPageStub = sinon.stub();
            this.oGetPageStub.resolves();
            sap.ushell.Container.getServiceAsync = sinon.stub().resolves({_getPage: this.oGetPageStub});
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("CDM Service cannot be resolved", function (assert) {
        var done = assert.async();
        //Arrange
        sap.ushell.Container.getServiceAsync = sinon.stub().rejects(this.sMockError);

        var oPagesService = new Pages();
        sandbox.stub(oPagesService, "_getParsedCdmPage").returns({});
        sandbox.stub(oPagesService, "getPagePath").returns("");
        //Act
        var oPromise = oPagesService.loadPage("ZTEST");
        //Assert
        assert.ok(oPromise instanceof Promise, "Return value is a promise");
        oPromise.then(function () {
                assert.ok(false, "Promise was unexpectedly resolved");
            })
            .catch(function (oError) {
                assert.equal(oError, this.sMockError, "Error was was handled correctly");
            }.bind(this))
            .finally(function () {
                sandbox.restore();
                done();
            });
    });

    QUnit.test("Site cannot be gathered from CDM Service", function (assert) {
        var done = assert.async();
        //Arrange
        this.oGetPageStub.rejects(this.sMockError);

        var oPagesService = new Pages();
        sandbox.stub(oPagesService, "getPagePath").returns("");
        sandbox.stub(oPagesService, "_getParsedCdmPage").returns({});
        //Act
        var oPromise = oPagesService.loadPage("ZTEST");
        //Assert
        assert.ok(oPromise instanceof Promise, "Return value is a promise");
        oPromise.then(function () {
                assert.ok(false, "Promise was unexpectedly resolved");
            })
            .catch(function (oError) {
                assert.equal(oError, this.sMockError, "Error was was handled correctly");
            }.bind(this))
            .finally(function () {
                sandbox.restore();
                done();
            });
    });

    QUnit.test("load a page which exists and a page which was already loaded", function (assert) {
        var done = assert.async();
        //Arrange
        var sPagePathMock = "/pages/0";
        var oPagesService = new Pages();
        var oParseCdmPageStub = sandbox.stub(oPagesService, "_getParsedCdmPage").returns({id: "ZTEST"});
        var oGetPagePathStub = sandbox.stub(oPagesService, "getPagePath");
        oGetPagePathStub.returns("");
        var oExpectedResult = {pages: [{id: "ZTEST"}]};
        //Act
        var oPromise = oPagesService.loadPage("ZTEST");
        //Assert
        assert.ok(oPromise instanceof Promise, "Return value is a promise");
        oPromise.then(function (sPath) {
            assert.strictEqual(sPath, sPagePathMock, "correct pagePath was returned");
            assert.strictEqual(this.oGetPageStub.callCount, 1, "getPage within the CDM Service was called once");
            assert.strictEqual(oParseCdmPageStub.callCount, 1, "_getParsedCdmPage was called once");
            assert.deepEqual(oPagesService._oPagesModel.getProperty("/"), oExpectedResult, "page was succesfully added to the model");

            //page is already in model
            oGetPagePathStub.returns(sPagePathMock);

            return oPagesService.loadPage("ZTEST");
        }.bind(this))
        .then(function (sSecondPath) {
            assert.strictEqual(sSecondPath, sPagePathMock, "correct pagePath was returned");
            assert.strictEqual(this.oGetPageStub.callCount, 1, "getPage within the CDM Service was called once");
            assert.strictEqual(oParseCdmPageStub.callCount, 1, "_getParsedCdmPage was called once");
            assert.deepEqual(oPagesService._oPagesModel.getProperty("/"), oExpectedResult, "page was succesfully added to the model");

            sandbox.restore();
            done();
        }.bind(this));
    });
});