// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.applications.PageComposer.util.PagePersistence
 */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/applications/PageComposer/util/PagePersistence"
], function (PagePersistence) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.start();
    QUnit.module("The constructor");

    QUnit.test("Returns an instance and creates the OData model", function (assert) {
        // Arrange
        var oModel = { id: "model-1" };
        // Act
        var oResult = new PagePersistence(oModel);
        // Assert
        assert.strictEqual(oResult._oODataModel, oModel, "A PagePersistence instance is instiated with the given model");
        assert.deepEqual(oResult._oEtags, {}, "An object of etags is created");
    });

    QUnit.module("getPages", {
        beforeEach: function () {
            var oModel = {
                read: function () { }
            };
            this.oPagePersistence = new PagePersistence(oModel);
            this.oReadParameters = {};
            this.oODataModelReadStub = sinon.stub(this.oPagePersistence._oODataModel, "read");
            this.ocheckErrorMessageStub = sinon.stub(this.oPagePersistence, "checkErrorMessage");
            this.ocheckErrorMessageStub.returns(true);
        },
        afterEach: function () {
            this.oODataModelReadStub.restore();
            this.ocheckErrorMessageStub.restore();
        }
    });

    QUnit.test("Resolves the promise with the page headers when the request was successful", function (assert) {
        // Arrange
        var done = assert.async();

        var oODataPage = {
            results: [{
                "devclass": "$TMP",
                "id": "TEST_PAGE_01",
                "title": "Page Title 01",
                "transportId": "",
                "description": "Page Description 01",
                "createdBy": "THEUSER01",
                "createdByFullname": "The User 01",
                "createdOn": new Date(0),
                "modifiedByFullname": "The User 01",
                "modifiedBy": "THEUSER01",
                "modifiedOn": new Date(1000),
                "owner": "THEUSER01",
                "masterLanguage": "EN",
                "editAllowed": true,
                "__metadata": { "etag": "etag-1" }
            }, {
                "devclass": "$TMP",
                "id": "TEST_PAGE_02",
                "title": "Page Title 02",
                "transportId": "",
                "description": "Page Description 02",
                "createdBy": "THEUSER02",
                "createdByFullname": "The User 02",
                "createdOn": new Date(2000),
                "modifiedBy": "THEUSER02",
                "modifiedByFullname": "The User 02",
                "modifiedOn": new Date(3000),
                "owner": "THEUSER02",
                "masterLanguage": "EN",
                "editAllowed": true,
                "__metadata": { "etag": "etag-2" }
            }]
        };

        this.oODataModelReadStub.callsFake(function (sPath, mParameters) {
            mParameters.success(oODataPage);
        });

        var aExpectedPageHeaders = [{
            metadata: {
                devclass: "$TMP",
                transportId: ""
            },
            content: {
                id: "TEST_PAGE_01",
                title: "Page Title 01",
                description: "Page Description 01",
                createdBy: "THEUSER01",
                createdByFullname: "The User 01",
                createdOn: new Date(0),
                modifiedBy: "THEUSER01",
                modifiedByFullname: "The User 01",
                modifiedOn: new Date(1000),
                masterLanguage: "EN",
                editAllowed: true
            }
        }, {
            metadata: {
                devclass: "$TMP",
                transportId: ""
            },
            content: {
                id: "TEST_PAGE_02",
                title: "Page Title 02",
                description: "Page Description 02",
                createdBy: "THEUSER02",
                createdByFullname: "The User 02",
                createdOn: new Date(2000),
                modifiedBy: "THEUSER02",
                modifiedByFullname: "The User 02",
                modifiedOn: new Date(3000),
                masterLanguage: "EN",
                editAllowed: true
            }
        }];

        // Act
        this.oPagePersistence.getPages()
            .then(function (aPageHeaders) {
                // Assert
                assert.ok(true, "Promise was resolved");
                assert.deepEqual(aPageHeaders, aExpectedPageHeaders, "The page header data was returned");
            })
            .catch(function () {
                assert.ok(false, "Promise was resolved");
            })
            .finally(done);

    });

    QUnit.test("Rejects the promise when the request was not successful and the responseText exists", function (assert) {
        // Arrange
        var done = assert.async();
        var oError = {
            message: "Error",
            statusCode: undefined,
            statusText: undefined
        };

        this.oODataModelReadStub.callsFake(function (sPath, mParameters) {
            mParameters.error({ message: "Error", responseText: "{\"error\": {\"message\": {\"value\": \"Error\"}}}" });
        });

        // Act
        this.oPagePersistence.getPages()
            .then(function () {
                assert.ok(false, "Promise was rejected");
            })
            .catch(function (error) {
                assert.ok(true, "Promise was rejected");
                assert.deepEqual(error, oError, "The error object was returned");
            })
            .finally(done);
    });

    QUnit.test("Rejects the promise when the request was not successful and the responseText does not exist", function (assert) {
        // Arrange
        var done = assert.async();
        var oError = {
            message: "Error",
            statusCode: undefined,
            statusText: undefined
        };

        this.oODataModelReadStub.callsFake(function (sPath, mParameters) {
            mParameters.error({ message: "Error" });
        });

        // Act
        this.oPagePersistence.getPages()
            .then(function () {
                assert.ok(false, "Promise was rejected");
            })
            .catch(function (error) {
                // Assert
                assert.ok(true, "Promise was rejected");
                assert.deepEqual(error, oError, "The error object was returned");
            })
            .finally(done);
    });


    QUnit.module("getPage", {
        beforeEach: function () {
            var oModel = {
                read: function () { }
            };
            this.oPagePersistence = new PagePersistence(oModel);
            this.oReadParameters = {};
            this.oODataModelReadStub = sinon.stub(this.oPagePersistence._oODataModel, "read");
            this.ocheckErrorMessageStub = sinon.stub(this.oPagePersistence, "checkErrorMessage");
            this.ocheckErrorMessageStub.returns(true);
        },
        afterEach: function () {
            this.oODataModelReadStub.restore();
            this.ocheckErrorMessageStub.restore();
        }
    });

    QUnit.test("Resolves the promise with the page data when the request was successful", function (assert) {
        // Arrange
        var sId = "TEST_PAGE",
            done = assert.async();

        var oODataPage = {
            "__metadata": {
                "id": "https://host:port/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/pageSet('TEST_PAGE')",
                "uri": "https://host:port/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/pageSet('TEST_PAGE')",
                "type": ".UI2.FDM_PAGE_REPOSITORY_SRV.Page",
                "etag": "W/\"datetime'1970-01-01T00%3A00%3A00'\""
            },
            "designTime": "",
            "devclass": "$TMP",
            "id": "TEST_PAGE",
            "title": "Page Title",
            "transportId": "",
            "description": "Page Description",
            "createdBy": "THEUSER",
            "createdByFullname": "The User",
            "createdOn": new Date(0),
            "modifiedBy": "THEUSER",
            "modifiedByFullname": "The User",
            "modifiedOn": new Date(1000),
            "owner": "THEUSER",
            "masterLanguage": "EN",
            "editAllowed": true,
            "sections": {
                "results": [{
                    "__metadata": {
                        "id": "https://host:port/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/sectionSet(id='TEST_GROUP_01',pageId='TEST_PAGE')",
                        "uri": "https://host:port/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/sectionSet(id='TEST_GROUP_01',pageId='TEST_PAGE')",
                        "type": ".UI2.FDM_PAGE_REPOSITORY_SRV.Section",
                        "etag": "W/\"datetime'1970-01-01T00%3A00%3A00'\""
                    },
                    "designTime": "",
                    "pageModifiedOn": new Date(1000),
                    "id": "TEST_GROUP_01",
                    "pageId": "TEST_PAGE",
                    "transportId": "",
                    "parentSectionId": "",
                    "title": "My Section 01",
                    "sectionIndex": 1,
                    "tiles": {
                        "results": [{
                            "__metadata": {
                                "id": "https://host:port/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/tileSet(id='00O2TIH53H32S29MMDGI1PYZ5',pageId='TEST_PAGE',sectionId='TEST_GROUP_01')",
                                "uri": "https://host:port/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/tileSet(id='00O2TIH53H32S29MMDGI1PYZ5',pageId='TEST_PAGE',sectionId='TEST_GROUP_01')",
                                "type": ".UI2.FDM_PAGE_REPOSITORY_SRV.Tile",
                                "etag": "W/\"datetime'1970-01-01T00%3A00%3A00'\""
                            },
                            "catalogTile": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D",
                            "pageModifiedOn": new Date(1000),
                            "id": "00O2TIH53H32S29MMDGI1PYZ5",
                            "pageId": "TEST_PAGE",
                            "sectionId": "TEST_GROUP_01",
                            "itemIndex": 1,
                            "targetMapping": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRG1T6CUY3UT",
                            "transportId": "",
                            "title": "Test Title 1",
                            "subTitle": "Test SubTitle 1",
                            "iconUrl": "sap-icon://Fiori2/F0018",
                            "tileType": "STATIC"
                        }, {
                            "__metadata": {
                                "id": "https://host:port/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/tileSet(id='00O2TIH53H32S29MMDGI1PYZ5',pageId='TEST_PAGE',sectionId='TEST_GROUP_01')",
                                "uri": "https://host:port/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/tileSet(id='00O2TIH53H32S29MMDGI1PYZ5',pageId='TEST_PAGE',sectionId='TEST_GROUP_01')",
                                "type": ".UI2.FDM_PAGE_REPOSITORY_SRV.Tile",
                                "etag": "W/\"datetime'1970-01-01T00%3A00%3A00'\""
                            },
                            "catalogTile": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D",
                            "pageModifiedOn": new Date(1000),
                            "id": "00O2TIH53H32S29MMDGI1PYZ5",
                            "pageId": "TEST_PAGE",
                            "sectionId": "TEST_GROUP_01",
                            "itemIndex": 1,
                            "targetMapping": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRG1T6CUY3UT",
                            "transportId": "",
                            "title": "Test Title 2",
                            "subTitle": "Test SubTitle 2",
                            "iconUrl": "sap-icon://Fiori2/F0019",
                            "tileType": "DYNAMIC"
                        }]
                    }
                }, {
                    "__metadata": {
                        "id": "https://host:port/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/sectionSet(id='TEST_GROUP_02',pageId='TEST_PAGE')",
                        "uri": "https://host:port/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/sectionSet(id='TEST_GROUP_02',pageId='TEST_PAGE')",
                        "type": ".UI2.FDM_PAGE_REPOSITORY_SRV.Section",
                        "etag": "W/\"datetime'1970-01-01T00%3A00%3A00'\""
                    },
                    "designTime": "",
                    "pageModifiedOn": new Date(1000),
                    "id": "TEST_GROUP_02",
                    "pageId": "TEST_PAGE",
                    "transportId": "",
                    "parentSectionId": "",
                    "title": "My Section 02",
                    "sectionIndex": 2,
                    "tiles": {
                        "results": [{
                            "__metadata": {
                                "id": "https://host:port/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/tileSet(id='00O2TIH53H32S29MMDGI1Q5AP',pageId='TEST_PAGE',sectionId='TEST_GROUP_02')",
                                "uri": "https://host:port/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/tileSet(id='00O2TIH53H32S29MMDGI1Q5AP',pageId='TEST_PAGE',sectionId='TEST_GROUP_02')",
                                "type": ".UI2.FDM_PAGE_REPOSITORY_SRV.Tile",
                                "etag": "W/\"datetime'1970-01-01T00%3A00%3A00'\""
                            },
                            "catalogTile": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D",
                            "pageModifiedOn": new Date(1000),
                            "id": "00O2TIH53H32S29MMDGI1Q5AP",
                            "pageId": "TEST_PAGE",
                            "sectionId": "TEST_GROUP_02",
                            "itemIndex": 1,
                            "targetMapping": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRG1T6CUY3UT",
                            "transportId": "",
                            "title": "Test Title 3",
                            "subTitle": "Test SubTitle 3",
                            "iconUrl": "sap-icon://Fiori2/F0020",
                            "tileType": "/UI2/TEST_CUSTOM_TILE"
                        }]
                    }
                }]
            }
        };

        var oExpectedPage = {
            "content": {
                "id": "TEST_PAGE",
                "title": "Page Title",
                "description": "Page Description",
                "createdBy": "THEUSER",
                "createdByFullname": "The User",
                "createdOn": new Date(0),
                "modifiedBy": "THEUSER",
                "modifiedByFullname": "The User",
                "modifiedOn": new Date(1000),
                "masterLanguage": "EN",
                "editAllowed": true,
                "sections": [{
                    "id": "TEST_GROUP_01",
                    "title": "My Section 01",
                    "visualizations": [{
                        "id": "00O2TIH53H32S29MMDGI1PYZ5",
                        "vizId": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D",
                        "inboundPermanentKey": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRG1T6CUY3UT",
                        "title": "Test Title 1",
                        "subTitle": "Test SubTitle 1",
                        "iconUrl": "sap-icon://Fiori2/F0018",
                        "tileType": "STATIC"
                    }, {
                        "id": "00O2TIH53H32S29MMDGI1PYZ5",
                        "vizId": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D",
                        "inboundPermanentKey": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRG1T6CUY3UT",
                        "title": "Test Title 2",
                        "subTitle": "Test SubTitle 2",
                        "iconUrl": "sap-icon://Fiori2/F0019",
                        "tileType": "DYNAMIC"
                    }]
                }, {
                    "id": "TEST_GROUP_02",
                    "title": "My Section 02",
                    "visualizations": [{
                        "id": "00O2TIH53H32S29MMDGI1Q5AP",
                        "vizId": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D",
                        "inboundPermanentKey": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRG1T6CUY3UT",
                        "title": "Test Title 3",
                        "subTitle": "Test SubTitle 3",
                        "iconUrl": "sap-icon://Fiori2/F0020",
                        "tileType": "/UI2/TEST_CUSTOM_TILE"
                    }]
                }]
            },
            "metadata": {
                "transportId": "",
                "devclass": "$TMP"
            }
        };

        this.oODataModelReadStub.callsFake(function (sPath, mParameters) {
            mParameters.success(oODataPage);
        });

        // Act
        this.oPagePersistence.getPage(sId)
            .then(function (page) {
                // Assert
                assert.ok(true, "Promise was resolved");
                assert.deepEqual(page, oExpectedPage, "The page data was returned");
            })
            .catch(function () {
                assert.ok(false, "Promise was resolved");
            })
            .finally(done);
    });

    QUnit.test("Rejects the promise when the request was not successful and the responseText exists", function (assert) {
        // Arrange
        var sId = "TEST_PAGE",
            done = assert.async(),
            oError = {
                message: "Error",
                statusCode: undefined,
                statusText: undefined
            };

        this.oODataModelReadStub.callsFake(function (sPath, mParameters) {
            mParameters.error({ message: "Error", responseText: "{\"error\": {\"message\": {\"value\": \"Error\"}}}" });
        });

        // Act
        this.oPagePersistence.getPage(sId)
            .then(function () {
                assert.ok(false, "Promise was rejected");
            })
            .catch(function (error) {
                assert.ok(true, "Promise was rejected");
                assert.deepEqual(error, oError, "The error object was returned");
            })
            .finally(done);
    });

    QUnit.test("Rejects the promise when the request was not successful and the responseText does not exist", function (assert) {
        // Arrange
        var sId = "TEST_PAGE",
            done = assert.async(),
            oError = {
                message: "Error",
                statusCode: undefined,
                statusText: undefined
            };

        this.oODataModelReadStub.callsFake(function (sPath, mParameters) {
            mParameters.error({ message: "Error" });
        });

        // Act
        this.oPagePersistence.getPage(sId)
            .then(function () {
                assert.ok(false, "Promise was rejected");
            })
            .catch(function (error) {
                assert.ok(true, "Promise was rejected");
                assert.deepEqual(error, oError, "The error object was returned");
            })
            .finally(done);
    });

    QUnit.module("createPage", {
        beforeEach: function () {
            var oSamplePage = {
                __metadata: { etag: "new-etag" },
                id: "page-1",
                modifiedOn: "new-modified-on-date"
            };
            this.oPagePersistence = new PagePersistence();
            this.oConvertReferencePageToODataStub = sinon.stub(this.oPagePersistence, "_convertReferencePageToOData");
            this.oCreatePageStub = sinon.stub(this.oPagePersistence, "_createPage").returns(Promise.resolve(oSamplePage));
        },
        afterEach: function () {
            this.oConvertReferencePageToODataStub.restore();
            this.oCreatePageStub.restore();
        }
    });

    QUnit.test("Calls the function _convertReferencePageToOData", function (assert) {
        // Arrange
        var oPage = { id: "page-1" };

        // Act
        this.oPagePersistence.createPage(oPage);

        // Assert
        assert.equal(this.oConvertReferencePageToODataStub.callCount, 1, "The function _convertReferencePageToOData is called once");
        assert.deepEqual(this.oConvertReferencePageToODataStub.firstCall.args.length, 1, "The function _convertReferencePageToOData is called with correct number of argumens");
        assert.deepEqual(this.oConvertReferencePageToODataStub.firstCall.args[0], oPage, "The function _convertReferencePageToOData is called with correct arguments");
    });

    QUnit.test("Calls the function _createPage", function (assert) {
        // Arrange
        var oPage = { id: "page-1" };
        this.oConvertReferencePageToODataStub.returns(oPage);

        // Act
        this.oPagePersistence.createPage(oPage);

        // Assert
        assert.equal(this.oCreatePageStub.callCount, 1, "The function _createPage is called once");
        assert.deepEqual(this.oCreatePageStub.firstCall.args.length, 1, "The function _createPage is called with correct number of argumens");
        assert.deepEqual(this.oCreatePageStub.firstCall.args[0], oPage, "The function _createPage is called with correct arguments");
    });

    QUnit.test("Returns the result of the function _createPage", function (assert) {
        // Arrange
        var oPage = { content: { id: "page-1" } };

        var oExpectedEtags = {
            "page-1": {
                modifiedOn: "new-modified-on-date",
                etag: "new-etag"
            }
        };

        this.oConvertReferencePageToODataStub.returns(oPage);

        this.oPagePersistence._oEtags = {
            "page-1": {
                modifiedOn: "old-modified-on-date",
                etag: "old-etag"
            }
        };

        // Act
        return this.oPagePersistence.createPage(oPage).then(function () {
            assert.deepEqual(this.oPagePersistence._oEtags, oExpectedEtags, "The result of function _createPage is returned");
        }.bind(this));
    });

    QUnit.module("_createPage", {
        beforeEach: function () {
            var oModel = { create: function () { } };
            this.oPagePersistence = new PagePersistence(oModel);
            this.oODataModelCreateStub = sinon.stub(this.oPagePersistence._oODataModel, "create");
        },
        afterEach: function () {
            this.oODataModelCreateStub.restore();
        }
    });

    QUnit.test("Calls the correct path and resolves the promise when the request was successful", function (assert) {
        // Arrange
        var done = assert.async(),
            oSamplePage = { title: "Some sample page" };

        this.oODataModelCreateStub.callsFake(function (sPath, oPageToCreate, oCallbacks) {
            if (sPath === "/pageSet") {
                oCallbacks.success(oPageToCreate);
            } else {
                oCallbacks.error();
            }
        });

        // Action
        this.oPagePersistence._createPage(oSamplePage)
            .then(function (oResult) {
                // Assert
                assert.ok(true, "Promise was resolved");
                assert.deepEqual(oResult, oSamplePage, "Correct page was provided");
            })
            .catch(function () {
                // Assert
                assert.ok(false, "Promise was resolved");
            })
            .finally(done);
    });

    QUnit.test("Rejects the promise when the request was not successful", function (assert) {
        // Arrange
        var done = assert.async(),
            oSamplePage = { title: "Some sample page" };

        this.oODataModelCreateStub.callsFake(function (sPath, oPageToCreate, oCallbacks) {
            if (sPath === "/pageSet") {
                oCallbacks.error(oPageToCreate);
            } else {
                oCallbacks.success();
            }
        });

        // Action
        this.oPagePersistence._createPage(oSamplePage)
            .then(function () {
                // Assert
                assert.ok(false, "Promise was rejected");
            })
            .catch(function () {
                // Assert
                assert.ok(true, "Promise was rejected");
            })
            .finally(done);
    });

    QUnit.module("updatePage", {
        beforeEach: function () {
            var oSamplePage = {
                __metadata: { etag: "new-etag" },
                id: "page-1",
                modifiedOn: "new-modified-on-date"
            };
            this.oPagePersistence = new PagePersistence();
            this.oCreatePageStub = sinon.stub(this.oPagePersistence, "_createPage").returns(Promise.resolve(oSamplePage));
            this.oConvertReferencePageToODataStub = sinon.stub(this.oPagePersistence, "_convertReferencePageToOData");
        },
        afterEach: function () {
            this.oConvertReferencePageToODataStub.restore();
            this.oCreatePageStub.restore();
        }
    });

    QUnit.test("Calls the function _convertReferencePageToOData", function (assert) {
        // Arrange
        var oPage = { content: { id: "page-1" } };

        this.oPagePersistence._oEtags = { "page-1": { modifiedOn: "modified-on" } };
        this.oConvertReferencePageToODataStub.returns(oPage);

        // Act
        this.oPagePersistence.updatePage(oPage);

        // Assert
        assert.equal(this.oConvertReferencePageToODataStub.callCount, 1, "The function _convertReferencePageToOData is called once");
        assert.deepEqual(this.oConvertReferencePageToODataStub.firstCall.args.length, 1, "The function _convertReferencePageToOData is called with correct number of argumens");
        assert.deepEqual(this.oConvertReferencePageToODataStub.firstCall.args[0], oPage, "The function _convertReferencePageToOData is called with correct arguments");
    });

    QUnit.test("Calls the function _createPage", function (assert) {
        // Arrange
        var oPage = { content: { id: "page-1" } };

        var oExpectedArgument = {
            id: "page-1",
            modifiedOn: "modified-on"
        };

        this.oConvertReferencePageToODataStub.returns(oPage.content);
        this.oPagePersistence._oEtags = { "page-1": { modifiedOn: "modified-on" } };

        this.oConvertReferencePageToODataStub.returns({ id: "page-1" });

        // Act
        this.oPagePersistence.updatePage(oPage);

        // Assert
        assert.equal(this.oCreatePageStub.callCount, 1, "The function _createPage is called once");
        assert.deepEqual(this.oCreatePageStub.firstCall.args.length, 1, "The function _createPage is called with correct number of arguments");
        assert.deepEqual(this.oCreatePageStub.firstCall.args[0], oExpectedArgument, "The function _createPage is called with correct arguments");
    });

    QUnit.test("Returns the result of the function _createPage", function (assert) {
        // Arrange
        var oPage = { content: { id: "page-1" } };

        var oExpectedEtags = {
            "page-1": {
                modifiedOn: "new-modified-on-date",
                etag: "new-etag"
            }
        };

        this.oConvertReferencePageToODataStub.returns(oPage);

        this.oPagePersistence._oEtags = {
            "page-1": {
                modifiedOn: "old-modified-on-date",
                etag: "old-etag"
            }
        };

        // Act
        return this.oPagePersistence.updatePage(oPage).then(function () {
            assert.deepEqual(this.oPagePersistence._oEtags, oExpectedEtags, "The result of function _createPage is returned");
        }.bind(this));

    });

    QUnit.module("copyPage", {
        beforeEach: function () {
            var oModel = {
                callFunction: function () { }
            };
            this.oPagePersistence = new PagePersistence(oModel);
            this.oODataModelCallFunctionStub = sinon.stub(this.oPagePersistence._oODataModel, "callFunction");
        },
        afterEach: function () {
            this.oODataModelCallFunctionStub.restore();
        }
    });

    QUnit.test("Calls the function callFunction with the correct page object", function (assert) {
        var done = assert.async();
        assert.expect(1);
        var oPage = {
            content: {
                targetId: "TestTargetId",
                sourceId: "TestSourceID",
                title: "TestTitle",
                description: "TestDescription with spaces"
            },
            metadata: {
                devclass: "TestDevClass",
                transportId: "TestTransportId"
            }
        };

        this.oODataModelCallFunctionStub.callsFake(function (sPath, oParams) {
            assert.deepEqual(oParams.urlParameters, {
                targetId: "TESTTARGETID",
                sourceId: "TestSourceID",
                title: "TestTitle",
                description: "TestDescription with spaces",
                devclass: "TestDevClass",
                transportId: "TestTransportId"
            }, "The callFunction was called with the correct page object");
            done();
        });

        this.oPagePersistence.copyPage(oPage);
    });

    QUnit.test("Calls the correct path and resolves the promise when the request was successful", function (assert) {
        var done = assert.async();
        var oPage = {
            content: {
                targetId: "TestTargetId",
                sourceId: "TestSourceID",
                title: "TestTitle",
                description: "TestDescription with spaces"
            },
            metadata: {
                devclass: "TestDevClass",
                transportId: "TestTransportId"
            }
        };

        this.oODataModelCallFunctionStub.callsFake(function (sPath, oCallbacks) {
            if (sPath === "/copyPage") {
                oCallbacks.success();
            } else {
                oCallbacks.error();
            }
        });

        // Act
        this.oPagePersistence.copyPage(oPage)
            .then(function () {
                // Assert
                assert.ok(true, "Promise was resolved");
            })
            .catch(function () {
                // Assert
                assert.ok(false, "Promise was resolved");
            })
            .finally(done);
    });


    QUnit.module("deletePage", {
        beforeEach: function () {
            var oModel = {
                callFunction: function () { }
            };
            this.oPagePersistence = new PagePersistence(oModel);
            this.oODataModelCallFunctionStub = sinon.stub(this.oPagePersistence._oODataModel, "callFunction");
        },
        afterEach: function () {
            this.oODataModelCallFunctionStub.restore();
        }
    });

    QUnit.test("Calls the correct path and resolves the promise when the request was successful", function (assert) {
        // Arrange
        var sId = "some ID",
            sTransportId = "",
            done = assert.async();
        this.oPagePersistence._oEtags["some ID"] = {
            etag: "some etag",
            modifiedOn: "new-modified-on-date"
        };

        this.oODataModelCallFunctionStub.callsFake(function (sPath, oCallbacks) {
            if (sPath === "/deletePage") {
                oCallbacks.success();
            } else {
                oCallbacks.error();
            }
        });

        // Act
        this.oPagePersistence.deletePage(sId, sTransportId)
            .then(function () {
                // Assert
                assert.ok(true, "Promise was resolved");
            })
            .catch(function () {
                // Assert
                assert.ok(false, "Promise was resolved");
            })
            .finally(done);
    });

    QUnit.test("Rejects the promise when the request was not successful", function (assert) {
        // Arrange
        var sId = "some ID",
            transportId = "",
            done = assert.async();
        this.oPagePersistence._oEtags["some ID"] = {
            etag: "some etag",
            modifiedOn: "new-modified-on-date"
        };

        this.oODataModelCallFunctionStub.callsFake(function (sPath, oCallbacks) {
            if (sPath === "/deletePage") {
                oCallbacks.error();
            } else {
                oCallbacks.success();
            }
        });
        // Act
        this.oPagePersistence.deletePage(sId, transportId)
            .then(function () {
                assert.ok(false, "Promise was rejected");
            })
            .catch(function () {
                assert.ok(true, "Promise was rejected");
            })
            .finally(done);
    });

    QUnit.module("_convertReferencePageToOData", {
        beforeEach: function () {
            this.oPagePersistence = new PagePersistence();
        },
        afterEach: function () { }
    });

    QUnit.test("Converts a reference page into oData format", function (assert) {
        // Arrange
        var oPage = {
            "content": {
                "id": "TEST_PAGE",
                "title": "Page Title",
                "description": "Page Description",
                "sections": [{
                    "id": "TEST_GROUP_01",
                    "title": "My Section 01",
                    "visualizations": [{
                        "id": "tile-id-1",
                        "vizId": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D",
                        "inboundPermanentKey": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRG1T6CUY3UT"
                    }, {
                        "id": "tile-id-2",
                        "vizId": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D",
                        "inboundPermanentKey": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRG1T6CUY3UT"
                    }]
                }, {
                    "id": "TEST_GROUP_02",
                    "title": "My Section 02",
                    "visualizations": [{
                        "vizId": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D",
                        "inboundPermanentKey": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRG1T6CUY3UT"
                    }]
                }]
            },
            "metadata": {
                "transportId": "",
                "devclass": "$TMP"
            }
        };

        var oExpectedResult = {
            "description": "Page Description",
            "devclass": "$TMP",
            "id": "TEST_PAGE",
            "sections": [{
                "id": "TEST_GROUP_01",
                "tiles": [{
                    "id": "tile-id-1",
                    "catalogTile": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D",
                    "targetMapping": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRG1T6CUY3UT"
                }, {
                    "id": "tile-id-2",
                    "catalogTile": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D",
                    "targetMapping": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRG1T6CUY3UT"
                }],
                "title": "My Section 01"
            }, {
                "id": "TEST_GROUP_02",
                "tiles": [{
                    "id": undefined,
                    "catalogTile": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_WDA_GUI:00O2TR99M0M42Q9E2AF196A2D",
                    "targetMapping": "X-SAP-UI2-PAGE:X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_SAMPLEAPPS_UI5DK:00O2TR99M0M2CFRG1T6CUY3UT"
                }],
                "title": "My Section 02"
            }],
            "title": "Page Title",
            "transportId": ""
        };

        // Act
        var oResult = this.oPagePersistence._convertReferencePageToOData(oPage);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The object is converted correctly");
    });


    QUnit.module("The function _rejectWithErrorMessage", {
        beforeEach: function () {
            this.oPagePersistence = new PagePersistence();
            this.oPagePersistence._oResourceBundle = {
                getText: sinon.stub().returns("TestPageOutdatedErrorMessage")
            };
        }
    });

    QUnit.test("rejects with expected error message if error statuscode is 412", function (assert) {
        var sStatusCode = "412",
            oResult = this.oPagePersistence._rejectWithErrorMessage({
                statusCode: sStatusCode
            }),
            oSimpleError = {
                message: "TestPageOutdatedErrorMessage",
                statusCode: sStatusCode,
                statusText: undefined
            };

        assert.expect(1);

        return oResult
            .then(function () {
                assert.notOk(true, "Then was called, although Promise should be rejected");
            })
            .catch(function (oError) {
                assert.deepEqual(oError, oSimpleError, "The error object with the overwrite changes message was returned");
            });
    });

    QUnit.test("rejects with error.responseText message", function (assert) {
        var oResult = this.oPagePersistence._rejectWithErrorMessage({
                responseText: "{\"error\":{\"message\":{\"value\":\"responseTextError\"}}}",
                message: "TestErrorMessage"
            }),
            oSimpleError = {
                message: "responseTextError",
                statusCode: undefined,
                statusText: undefined
            };
        assert.expect(1);

        return oResult
            .then(function () {
                assert.notOk(true, "Then was called, although Promise should be rejected");
            })
            .catch(function (oError) {
                assert.deepEqual(oError, oSimpleError, "The error object was returned");
            });
    });

    QUnit.test("rejects with error.message if JSON.parse throws", function (assert) {
        sinon.stub(JSON, "parse").throws("JSON.parse error");
        var oResult = this.oPagePersistence._rejectWithErrorMessage({
                responseText: "{\"error\":{\"message\":{\"value\":\"responseTextError\"}}}",
                message: "TestErrorMessage"
            }),
            oSimpleError = {
                message: "TestErrorMessage",
                statusCode: undefined,
                statusText: undefined
            };
        assert.expect(1);
        JSON.parse.restore();

        return oResult
            .then(function () {
                assert.notOk(true, "Then was called, although Promise should be rejected");
            })
            .catch(function (oError) {
                assert.deepEqual(oError, oSimpleError, "The error object was returned");
            });
    });

    QUnit.test("rejects with error.message if there is no responseText message", function (assert) {
        var oResult = this.oPagePersistence._rejectWithErrorMessage({
                responseText: "{\"not\":\"valid\"}",
                message: "TestErrorMessage"
            }),
            oSimpleError = {
                message: "TestErrorMessage",
                statusCode: undefined,
                statusText: undefined
            };
        assert.expect(1);

        return oResult
            .then(function () {
                assert.notOk(true, "Then was called, although Promise should be rejected");
            })
            .catch(function (oError) {
                assert.deepEqual(oError, oSimpleError, "The error object was returned");
            });
    });

    QUnit.module("abortPendingBackendRequests", {
        beforeEach: function () {
            this.oAbortSpy = sinon.spy();
            this.oPendingRequestHandle = {
                abort: this.oAbortSpy
            };
            this.oHasPendingRequestsStub = sinon.stub();
            this.oPagePersistence = new PagePersistence({
                hasPendingRequests: this.oHasPendingRequestsStub,
                aPendingRequestHandles: [
                    this.oPendingRequestHandle,
                    this.oPendingRequestHandle
                ]
            });
        }
    });

    QUnit.test("the abort function is called if there are pending requests", function (assert) {
        this.oHasPendingRequestsStub.returns(true);

        this.oPagePersistence.abortPendingBackendRequests();
        assert.equal(2, this.oAbortSpy.callCount, "The abort spy was called the correct amount of times");
    });

    QUnit.test("the abort function is not called if there are no pending requests", function (assert) {
        this.oHasPendingRequestsStub.returns(false);

        this.oPagePersistence.abortPendingBackendRequests();
        assert.notOk(this.oAbortSpy.called, "The abort spy was not called");
    });

    QUnit.module("getCatalogs", {
        beforeEach: function () {
            this.oPagePersistence = new PagePersistence();

            this.oGetCatalogsByRoleStub = sinon.stub(this.oPagePersistence, "_getCatalogsByRole");
            this.oGetCatalogsByPageStub = sinon.stub(this.oPagePersistence, "_getCatalogsByPage");
        },
        afterEach: function () {
            this.oGetCatalogsByRoleStub.restore();
            this.oGetCatalogsByPageStub.restore();
        }
    });

    QUnit.test("calls _getCatalogsByRole if role is defined", function (assert) {
        this.oPagePersistence.getCatalogs("TEST_PAGE_ID", ["TEST_ROLE_ID"]);
        assert.ok(this.oGetCatalogsByRoleStub.called, "_getCatalogsByRole was called");
    });

    QUnit.test("calls _getCatalogsByPage if role is undefined", function (assert) {
        this.oPagePersistence.getCatalogs(["TEST_PAGE_ID"]);
        assert.ok(this.oGetCatalogsByPageStub.called, "_getCatalogsByPage was called");
    });

    QUnit.module("_getCatalogsByRole", {
        beforeEach: function () {
            var oModel = {
                read: function () {}
            };
            this.oPagePersistence = new PagePersistence(oModel);
        },
        afterEach: function () {
            this.oODataModelCallFunctionStub.restore();
        }
    });

    QUnit.test("resolves with the expected result", function (assert) {
        this.oODataModelCallFunctionStub = sinon.stub(this.oPagePersistence._oODataModel, "read")
            .callsFake(function (sPath, oCallbacks) {
                if (sPath === "/roleSet('TEST_ROLE_ID')") {
                    oCallbacks.success({
                        catalogs: {
                            results: [{test: 1}]
                        }
                    });
                } else {
                    oCallbacks.error();
                }
            });

        return Promise.all(this.oPagePersistence._getCatalogsByRole(["TEST_ROLE_ID"])).then(function (aResults) {
            assert.deepEqual(aResults, [[{test: 1}]], "Result was as expected");
        }).catch(function () {
            assert.notOk(true, "Error occurred");
        });
    });

    QUnit.test("rejects with the expected error", function (assert) {
        this.oODataModelCallFunctionStub = sinon.stub(this.oPagePersistence._oODataModel, "read")
            .callsFake(function (sPath, oCallbacks) {
                oCallbacks.error(new Error("ErrorMessage"));
            });

        return Promise.all(this.oPagePersistence._getCatalogsByRole(["TEST_ROLE_ID"])).then(function () {
            assert.notOk(true, "Error should have occurred");
        }).catch(function (oError) {
            assert.equal("ErrorMessage", oError.message, "The error message was as expected");
        });
    });
});
