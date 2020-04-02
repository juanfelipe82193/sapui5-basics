// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.v3._LaunchPage.readVisualizations
 */
/* global QUnit sinon*/
sap.ui.require([
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations",
    "sap/ushell/utils",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readHome"
], function (readVisualizations, utils, readHome) {
    "use strict";

    QUnit.module("getInboundId method", {
        beforeEach: function () {
            this.oGetTargetStub = sinon.stub(readVisualizations, "getTarget");
            this.sMockViz = "sMockViz";
        },
        afterEach: function () {
            this.oGetTargetStub.restore();
        }
    });

    QUnit.test("getTarget returns a string", function (assert) {
        //Arrange
        this.oGetTargetStub.withArgs(this.sMockViz).returns({inboundId: "inboundId"});
        //Act
        var sResult = readVisualizations.getInboundId(this.sMockViz);
        //Assert
        assert.strictEqual(this.oGetTargetStub.callCount, 1, "getTarget was called once");
        assert.strictEqual(sResult, "inboundId", "returns the corrrect result");
    });

    QUnit.test("getTarget returns undefined if a non-existent inbound ID is passed", function (assert) {
        //Arrange
        this.oGetTargetStub.withArgs(this.sMockViz).returns({inboundId2: "inboundId"});
        //Act
        var sResult = readVisualizations.getInboundId(this.sMockViz);
        //Assert
        assert.strictEqual(this.oGetTargetStub.callCount, 1, "getTarget was called once");
        assert.strictEqual(sResult, undefined, "returns the corrrect result");
    });

    QUnit.test("getTarget returns undefined", function (assert) {
        //Arrange
        this.oGetTargetStub.withArgs(this.sMockViz).returns();
        //Act
        var sResult = readVisualizations.getInboundId(this.sMockViz);
        //Assert
        assert.strictEqual(this.oGetTargetStub.callCount, 1, "getTarget was called once");
        assert.strictEqual(sResult, undefined, "returns the corrrect result");
    });

    QUnit.module("getKeywords method", {
        beforeEach: function () {
            this.oCloneStub = sinon.stub(utils, "clone");
            this.oGetNestedObjectPropertyStub = sinon.stub(utils, "getNestedObjectProperty");
            this.aCdmParts = ["obj1", "obj2", "obj3", "obj4"];
            this.aParams = ["sap|app.tags.keywords", "sap|app.tags.keywords"];

            this.oCloneStub.withArgs(this.aCdmParts).returns(this.aCdmParts);
            this.oGetNestedObjectPropertyStub.withArgs(["obj2", "obj4"], this.aParams).returns("oGetNestedObjectPropertyStub");
        },
        afterEach: function () {
            this.oGetNestedObjectPropertyStub.restore();
            this.oCloneStub.restore();
        }
    });

    QUnit.test("Returns the correct keywords", function (assert) {
        //Arrange
        //Act
        var sResult = readVisualizations.getKeywords(this.aCdmParts);
        //Assert
        assert.strictEqual(this.oCloneStub.callCount, 1, "clone was called once");
        assert.strictEqual(this.oGetNestedObjectPropertyStub.callCount, 1, "getNestedObjectProperty was called once");
        assert.strictEqual(sResult, "oGetNestedObjectPropertyStub", "returns the correct value");
    });

    QUnit.module("getTitle method", {
        beforeEach: function () {
            this.oGetNestedObjectPropertyStub = sinon.stub(utils, "getNestedObjectProperty");
            this.aCdmParts = ["obj1", "obj2", "obj3", "obj4"];
            this.aParams = ["title", "sap|app.title", "title", "sap|app.title"];

            this.oGetNestedObjectPropertyStub.withArgs(this.aCdmParts, this.aParams).returns("oGetNestedObjectPropertyStub");
        },
        afterEach: function () {
            this.oGetNestedObjectPropertyStub.restore();
        }
    });

    QUnit.test("Returns the correct title", function (assert) {
        //Arrange
        //Act
        var sResult = readVisualizations.getTitle(this.aCdmParts);
        //Assert
        assert.strictEqual(this.oGetNestedObjectPropertyStub.callCount, 1, "getNestedObjectProperty was called once");
        assert.strictEqual(sResult, "oGetNestedObjectPropertyStub", "returns the correct value");
    });

    QUnit.module("getSubTitle method", {
        beforeEach: function () {
            this.oGetNestedObjectPropertyStub = sinon.stub(utils, "getNestedObjectProperty");
            this.aCdmParts = ["obj1", "obj2", "obj3", "obj4"];
            this.aParams = ["subTitle", "sap|app.subTitle", "subTitle", "sap|app.subTitle"];

            this.oGetNestedObjectPropertyStub.withArgs(this.aCdmParts, this.aParams).returns("oGetNestedObjectPropertyStub");
        },
        afterEach: function () {
            this.oGetNestedObjectPropertyStub.restore();
        }
    });

    QUnit.test("Returns the correct subTitle", function (assert) {
        //Arrange
        //Act
        var sResult = readVisualizations.getSubTitle(this.aCdmParts);
        //Assert
        assert.strictEqual(this.oGetNestedObjectPropertyStub.callCount, 1, "getNestedObjectProperty was called once");
        assert.strictEqual(sResult, "oGetNestedObjectPropertyStub", "returns the correct value");
    });

    QUnit.module("getIcon method", {
        beforeEach: function () {
            this.oGetNestedObjectPropertyStub = sinon.stub(utils, "getNestedObjectProperty");
            this.aCdmParts = ["obj1", "obj2", "obj3", "obj4"];
            this.aParams = ["icon", "sap|ui.icons.icon", "icon", "sap|ui.icons.icon"];

            this.oGetNestedObjectPropertyStub.withArgs(this.aCdmParts, this.aParams).returns("oGetNestedObjectPropertyStub");
        },
        afterEach: function () {
            this.oGetNestedObjectPropertyStub.restore();
        }
    });

    QUnit.test("Returns the correct icon", function (assert) {
        //Arrange
        //Act
        var sResult = readVisualizations.getIcon(this.aCdmParts);
        //Assert
        assert.strictEqual(this.oGetNestedObjectPropertyStub.callCount, 1, "getNestedObjectProperty was called once");
        assert.strictEqual(sResult, "oGetNestedObjectPropertyStub", "returns the correct value");
    });

    QUnit.module("getInfo method", {
        beforeEach: function () {
            this.oGetNestedObjectPropertyStub = sinon.stub(utils, "getNestedObjectProperty");
            this.aCdmParts = ["obj1", "obj2", "obj3", "obj4"];
            this.aParams = ["info", "sap|app.info", "info", "sap|app.info"];

            this.oGetNestedObjectPropertyStub.withArgs(this.aCdmParts, this.aParams).returns("oGetNestedObjectPropertyStub");
        },
        afterEach: function () {
            this.oGetNestedObjectPropertyStub.restore();
        }
    });

    QUnit.test("Returns the correct info", function (assert) {
        //Arrange
        //Act
        var sResult = readVisualizations.getInfo(this.aCdmParts);
        //Assert
        assert.strictEqual(this.oGetNestedObjectPropertyStub.callCount, 1, "getNestedObjectProperty was called once");
        assert.strictEqual(sResult, "oGetNestedObjectPropertyStub", "returns the correct value");
    });

    QUnit.module("getShortTitle method", {
        beforeEach: function () {
            this.oCloneStub = sinon.stub(utils, "clone");
            this.oGetNestedObjectPropertyStub = sinon.stub(utils, "getNestedObjectProperty");
            this.aCdmParts = ["obj1", "obj2", "obj3", "obj4"];
            this.aParams = ["sap|app.shortTitle", "shortTitle", "sap|app.shortTitle"];

            this.oCloneStub.withArgs(this.aCdmParts).returns(this.aCdmParts);
            this.oGetNestedObjectPropertyStub.withArgs(["obj2", "obj3", "obj4"], this.aParams).returns("oGetNestedObjectPropertyStub");
        },
        afterEach: function () {
            this.oGetNestedObjectPropertyStub.restore();
            this.oCloneStub.restore();
        }
    });

    QUnit.test("Returns the correct shortTitle", function (assert) {
        //Arrange
        //Act
        var sResult = readVisualizations.getShortTitle(this.aCdmParts);
        //Assert
        assert.strictEqual(this.oCloneStub.callCount, 1, "clone was called once");
        assert.strictEqual(this.oGetNestedObjectPropertyStub.callCount, 1, "getNestedObjectProperty was called once");
        assert.strictEqual(sResult, "oGetNestedObjectPropertyStub", "returns the correct value");
    });

    QUnit.module("getCdmParts method", {
        beforeEach: function () {
            //On the "this" reference
            this.oGetStub = sinon.stub(readVisualizations, "get");
            this.oGetConfigStub = sinon.stub(readVisualizations, "getConfig");
            this.oGetAppIdStub = sinon.stub(readVisualizations, "getAppId");
            this.oGetAppDescriptorStub = sinon.stub(readVisualizations, "getAppDescriptor");
            this.oGetInboundIdStub = sinon.stub(readVisualizations, "getInboundId");

            //On the readHome object
            this.oGetTileVizIdStub = sinon.stub(readHome, "getTileVizId");
            this.oGetInboundStub = sinon.stub(readHome, "getInbound");

            this.sMockSite = "sMockSite";
            this.sMockTile = "sMockTile";
            this.aExpectedResult = [this.sMockTile, "oGetConfigStub", "oGetInboundStub", "oGetAppDescriptorStub"];

            //On the "this" reference
            this.oGetStub.withArgs(this.sMockSite, "oGetTileVizIdStub").returns("oGetStub");
            this.oGetConfigStub.withArgs("oGetStub").returns("oGetConfigStub");
            this.oGetAppIdStub.withArgs("oGetStub").returns("oGetAppIdStub");
            this.oGetAppDescriptorStub.withArgs(this.sMockSite, "oGetAppIdStub").returns("oGetAppDescriptorStub");
            this.oGetInboundIdStub.withArgs("oGetStub").returns("oGetInboundIdStub");

            //On the readHome object
            this.oGetTileVizIdStub.withArgs(this.sMockTile).returns("oGetTileVizIdStub");
            this.oGetInboundStub.withArgs("oGetAppDescriptorStub", "oGetInboundIdStub").returns({inbound: "oGetInboundStub"});
        },
        afterEach: function () {
            //On the "this" reference
            this.oGetStub.restore();
            this.oGetConfigStub.restore();
            this.oGetAppIdStub.restore();
            this.oGetAppDescriptorStub.restore();
            this.oGetInboundIdStub.restore();

            //On the readHome object
            this.oGetTileVizIdStub.restore();
            this.oGetInboundStub.restore();
        }
    });

    QUnit.test("calls the correct methods with correct parameters", function (assert) {
        //Arrange
        //Act
        var aResult = readVisualizations.getCdmParts(this.sMockSite, this.sMockTile);
        //Assert
        assert.deepEqual(aResult, this.aExpectedResult, "returns the correct result");
        //On the "this" reference
        assert.strictEqual(this.oGetStub.callCount, 1, "get was called once");
        assert.strictEqual(this.oGetConfigStub.callCount, 1, "getConfig was called once");
        assert.strictEqual(this.oGetAppIdStub.callCount, 1, "getAppId was called once");
        assert.strictEqual(this.oGetAppDescriptorStub.callCount, 1, "getAppDescriptor was called once");
        assert.strictEqual(this.oGetInboundIdStub.callCount, 1, "getInboundId was called once");

        //On the readHome object
        assert.strictEqual(this.oGetTileVizIdStub.callCount, 1, "getTileVizId was called once");
        assert.strictEqual(this.oGetInboundStub.callCount, 1, "getInboundId was called once");
    });

    QUnit.test("calls the correct methods with correct parameters and missing applicationInbound", function (assert) {
        //Arrange
        this.aExpectedResult[2] = undefined;
        this.oGetInboundStub.withArgs("oGetAppDescriptorStub", "oGetInboundIdStub").returns();
        //Act
        var aResult = readVisualizations.getCdmParts(this.sMockSite, this.sMockTile);
        //Assert
        assert.deepEqual(aResult, this.aExpectedResult, "returns the correct result");
        //On the "this" reference
        assert.strictEqual(this.oGetStub.callCount, 1, "get was called once");
        assert.strictEqual(this.oGetConfigStub.callCount, 1, "getConfig was called once");
        assert.strictEqual(this.oGetAppIdStub.callCount, 1, "getAppId was called once");
        assert.strictEqual(this.oGetAppDescriptorStub.callCount, 1, "getAppDescriptor was called once");
        assert.strictEqual(this.oGetInboundIdStub.callCount, 1, "getInboundId was called once");

        //On the readHome object
        assert.strictEqual(this.oGetTileVizIdStub.callCount, 1, "getTileVizId was called once");
        assert.strictEqual(this.oGetInboundStub.callCount, 1, "getInboundId was called once");
    });

    QUnit.module("component and integration tests", {
        beforeEach: function () {
            this.oTile = {
                icon: "tileIcon",
                info: "tileInfo",
                subTitle: "tileSubtitle",
                title: "tileTitle",
                vizId: "vizId1"
            };
            this.oSite = {
                applications: {
                    appId1: {
                        "sap.app": {
                            info: "applicationInfo",
                            crossNavigation: {
                                inbounds: {
                                    inboundId1: {
                                        icon: "inboundIcon",
                                        info: "inboundInfo",
                                        shortTitle: "inboundShortTitle",
                                        subTitle: "inboundSubtitle",
                                        title: "inboundTitle"
                                    }
                                }
                            },
                            shortTitle: "applicationShortTitle",
                            subTitle: "applicationSubtitle",
                            tags: {
                                keywords: "applicationKeywords"
                            },
                            title: "applicationTitle"
                        },
                        "sap.ui": {
                            icons: {
                                icon: "applicationIcon"
                            }
                        }
                    }
                },
                visualizations: {
                    vizId1: {
                        vizConfig: {
                            "sap.app": {
                                info: "visualizationInfo",
                                shortTitle: "visualizationShortTitle",
                                subTitle: "visualizationSubtitle",
                                tags: {
                                    keywords: "visualizationKeywords"
                                },
                                title: "visualizationTitle"
                            },
                            "sap.flp": {
                                target: {
                                    appId: "appId1",
                                    inboundId: "inboundId1"
                                }
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "visualizationIcon"
                                }
                            }
                        },
                        vizType: "vizType1"
                    }
                }
            };
        }
    });

    QUnit.test("get evaluated properties from groupTile", function (assert) {
        //Arrange
        var oExpectedResult = {
            keywords: "visualizationKeywords",
            title: "tileTitle",
            subTitle: "tileSubtitle",
            icon: "tileIcon",
            info: "tileInfo",
            shortTitle: "visualizationShortTitle"
        };
        //Act
        var aCdmParts = readVisualizations.getCdmParts(this.oSite, this.oTile);
        var oResult = {
            keywords: readVisualizations.getKeywords(aCdmParts),
            title: readVisualizations.getTitle(aCdmParts),
            subTitle: readVisualizations.getSubTitle(aCdmParts),
            icon: readVisualizations.getIcon(aCdmParts),
            info: readVisualizations.getInfo(aCdmParts),
            shortTitle: readVisualizations.getShortTitle(aCdmParts)
        };
        //Assert
        assert.deepEqual(oResult, oExpectedResult, "returns correct result");
    });

    QUnit.test("get evaluated properties from visualization", function (assert) {
        //Arrange
        var oExpectedResult = {
            keywords: "visualizationKeywords",
            title: "visualizationTitle",
            subTitle: "visualizationSubtitle",
            icon: "visualizationIcon",
            info: "visualizationInfo",
            shortTitle: "visualizationShortTitle"
        };
        this.oTile = {vizId: this.oTile.vizId};
        //Act
        var aCdmParts = readVisualizations.getCdmParts(this.oSite, this.oTile);
        var oResult = {
            keywords: readVisualizations.getKeywords(aCdmParts),
            title: readVisualizations.getTitle(aCdmParts),
            subTitle: readVisualizations.getSubTitle(aCdmParts),
            icon: readVisualizations.getIcon(aCdmParts),
            info: readVisualizations.getInfo(aCdmParts),
            shortTitle: readVisualizations.getShortTitle(aCdmParts)
        };
        //Assert
        assert.deepEqual(oResult, oExpectedResult, "returns correct result");
    });

    QUnit.test("get evaluated properties from applicationInbound", function (assert) {
        //Arrange
        var oExpectedResult = {
            keywords: "applicationKeywords",
            title: "inboundTitle",
            subTitle: "inboundSubtitle",
            icon: "inboundIcon",
            info: "inboundInfo",
            shortTitle: "inboundShortTitle"
        };
        this.oTile = {vizId: this.oTile.vizId};
        delete this.oSite.visualizations.vizId1.vizConfig["sap.app"];
        delete this.oSite.visualizations.vizId1.vizConfig["sap.ui"];
        //Act
        var aCdmParts = readVisualizations.getCdmParts(this.oSite, this.oTile);
        var oResult = {
            keywords: readVisualizations.getKeywords(aCdmParts),
            title: readVisualizations.getTitle(aCdmParts),
            subTitle: readVisualizations.getSubTitle(aCdmParts),
            icon: readVisualizations.getIcon(aCdmParts),
            info: readVisualizations.getInfo(aCdmParts),
            shortTitle: readVisualizations.getShortTitle(aCdmParts)
        };
        //Assert
        assert.deepEqual(oResult, oExpectedResult, "returns correct result");
    });

    QUnit.test("get evaluated properties from application", function (assert) {
        //Arrange
        var oExpectedResult = {
            keywords: "applicationKeywords",
            title: "applicationTitle",
            subTitle: "applicationSubtitle",
            icon: "applicationIcon",
            info: "applicationInfo",
            shortTitle: "applicationShortTitle"
        };
        this.oTile = {vizId: this.oTile.vizId};
        delete this.oSite.visualizations.vizId1.vizConfig["sap.app"];
        delete this.oSite.visualizations.vizId1.vizConfig["sap.ui"];
        delete this.oSite.applications.appId1["sap.app"].crossNavigation.inbounds.inboundId1;
        //Act
        var aCdmParts = readVisualizations.getCdmParts(this.oSite, this.oTile);
        var oResult = {
            keywords: readVisualizations.getKeywords(aCdmParts),
            title: readVisualizations.getTitle(aCdmParts),
            subTitle: readVisualizations.getSubTitle(aCdmParts),
            icon: readVisualizations.getIcon(aCdmParts),
            info: readVisualizations.getInfo(aCdmParts),
            shortTitle: readVisualizations.getShortTitle(aCdmParts)
        };
        //Assert
        assert.deepEqual(oResult, oExpectedResult, "returns correct result");
    });
});