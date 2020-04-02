// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.PagesCommonDataModelAdapter
 */
sap.ui.require([
    "sap/ushell/adapters/cdm/PagesCommonDataModelAdapter",
    "sap/base/Log"
], function (
    PagesCDMAdapter,
    Log
) {
    "use strict";

    /* global sinon, QUnit */

    QUnit.module("The constructor");

    QUnit.test("initializes all the class properties", function (assert) {
        // Act
        var oCDMAdapter = new PagesCDMAdapter();

        // Assert
        assert.deepEqual(oCDMAdapter._oCDMPagesRequests, {}, "The constructor sets the property _oCDMPagesRequests to an empty object.");
        assert.strictEqual(oCDMAdapter._sComponent, "sap/ushell/adapters/cdm/PagesCommonDataModelAdapter", "The constructor sets the property _sComponent to 'sap/ushell/adapters/cdm/PagesCommonDataModelAdapter'.");
    });

    QUnit.module("The function getPersonalization", {
        beforeEach: function () {
            this.oNavigationData = Promise.resolve();
            this.oVisualizationData = Promise.resolve();
            this.oPageData = Promise.resolve();
            sap.ushell.Container = {
                getServiceAsync: sinon.stub().callsFake(function (sService) {
                    switch (sService) {
                        case "NavigationDataProvider":
                            return this.oNavigationData;
                        case "VisualizationDataProvider":
                            return this.oVisualizationData;
                        case "PagePersistence":
                            return this.oPageData;
                        default:
                            return Promise.reject();
                    }
                }).bind(this)
            };
            this.oLogStub = sinon.stub(Log, "fatal").returns(true);
        },
        afterEach: function () {
            this.oLogStub.restore();
        }
    });

    QUnit.test("returns a jQuery.Deferred.Promise", function (assert) {
        assert.expect(1);
        var fnDone = assert.async();
        var oCDMAdapter = new PagesCDMAdapter(
            {},
            {},
            {
                config: {
                    pageId: "mySuperPage"
                }
            });

        var oPersonalizationPromise = oCDMAdapter.getPersonalization();

        oPersonalizationPromise.always(function () {
            assert.ok(true, "A jQuery.Deferred.Promise was returned");
            fnDone();
        });
    });

    QUnit.module("The function setPersonalization", {
        beforeEach: function () {
            this.oNavigationData = Promise.resolve();
            this.oVisualizationData = Promise.resolve();
            this.oPageData = Promise.resolve();
            sap.ushell.Container = {
                getServiceAsync: sinon.stub().callsFake(function (sService) {
                    switch (sService) {
                        case "NavigationDataProvider":
                            return this.oNavigationData;
                        case "VisualizationDataProvider":
                            return this.oVisualizationData;
                        case "PagePersistence":
                            return this.oPageData;
                        default:
                            return Promise.reject();
                    }
                }).bind(this)
            };
            this.oLogStub = sinon.stub(Log, "fatal").returns(true);
        },
        afterEach: function () {
            this.oLogStub.restore();
        }
    });

    QUnit.test("returns a jQuery.Deferred.Promise", function (assert) {
        assert.expect(2);
        var fnDone = assert.async();
        var oCDMAdapter = new PagesCDMAdapter(
            {},
            {},
            {
                config: {
                    pageId: "mySuperPage"
                }
            });

        var oPersonalizationPromise = oCDMAdapter.setPersonalization();

        oPersonalizationPromise
            .done(function () {
                assert.ok(true, "Promise was resolved");
            })
            .fail(function () {
                assert.ok(false, "Promise was rejected");
            })
            .always(function () {
                assert.ok(true, "A jQuery.Deferred.Promise was returned");
                fnDone();
            });
    });

    QUnit.module("The function getSite", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sinon.stub();
            this.oGetMenuEntriesStub = sinon.stub();
            this.oGetPageStub = sinon.stub();
            this.oLogErrorStub = sinon.stub(Log, "error");
            this.oGetServiceAsyncStub.withArgs("Menu").resolves({
                getMenuEntries: this.oGetMenuEntriesStub
            });
            sap.ushell.Container = {
                getServiceAsync: this.oGetServiceAsyncStub
            };
            this.oCDMAdapter = new PagesCDMAdapter();
            this.oCDMAdapter._getPage = this.oGetPageStub;
        },
        afterEach: function () {
            delete sap.ushell.Container;
            this.oLogErrorStub.restore();
        }
    });

    QUnit.test("returns a CDM site for the first page which is returned by the menu service", function (assert) {
        // Arrange
        this.oGetMenuEntriesStub.resolves([{
            uid: "1",
            title: "Space 1",
            type: "intent",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "spaceId", value: "TEST_SPACE" },
                    { name: "pageId", value: "TEST_PAGE" }
                ]
            }
        }]);

        this.oGetPageStub.resolves();

        // Act
        return this.oCDMAdapter.getSite().done(function () {
            assert.deepEqual(this.oGetPageStub.firstCall.args, ["TEST_PAGE"], "The function _getPage was called with the page id of the first menu entry: 'TEST_PAGE'");
        }.bind(this));
    });

    QUnit.test("rejects the jQuery.Deferred.Promise if a page cannot be retrieved", function (assert) {
        // Arrange
        var fnDone = assert.async();

        this.oGetMenuEntriesStub.resolves([{
            uid: "1",
            title: "Space 1",
            type: "intent",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage",
                parameters: [
                    { name: "spaceId", value: "TEST_SPACE" },
                    { name: "pageId", value: "TEST_PAGE" }
                ]
            }
        }]);

        this.oGetPageStub.rejects();

        // Act
        this.oCDMAdapter.getSite()
            .done(function () {
                assert.ok(false, "The jQuery.Deferred.Promise was resolved instead of rejected.");
            })
            .fail(function () {
                assert.ok(true, "The jQuery.Deferred.Promise was rejected.");
            })
            .always(function () {
                fnDone();
            });
    });

    QUnit.test("rejects the jQuery.Deferred.Promise if a default page could not be determined", function (assert) {
        // Arrange
        var fnDone = assert.async();

        this.oGetMenuEntriesStub.resolves([{
            uid: "1",
            title: "Space 1",
            type: "intent",
            target: {
                semanticObject: "Launchpad",
                action: "openFLPPage"
            }
        }]);

        this.oGetPageStub.resolves();

        // Act
        this.oCDMAdapter.getSite()
            .done(function () {
                assert.ok(false, "The jQuery.Deferred.Promise was resolved instead of rejected.");
            })
            .fail(function (sErrorMessage) {
                assert.ok(true, "The jQuery.Deferred.Promise was rejected.");
                assert.strictEqual(sErrorMessage, "PagesCommonDataModelAdapter: Couldn't determine the default page from the first menu entry", "The promise was rejected with the correct error message");
                assert.deepEqual(this.oLogErrorStub.firstCall.args, ["PagesCommonDataModelAdapter: Couldn't determine the default page from the first menu entry", null, "sap/ushell/adapters/cdm/PagesCommonDataModelAdapter"], "The correct error was logged to the console");
            }.bind(this))
            .always(function () {
                fnDone();
            });
    });

    QUnit.module("The function getPage", {
        beforeEach: function () {
            this.sPageIdMock = "PAGE ID";
            this.oCDMPageMock = { someProperty: "ThisRepresentsACDMSite" };
            this.oDereferencedPageMock = { id: "this represents a dereferenced site" };

            this.oGetNavigationDataStub = sinon.stub();
            this.oGetNavigationDataStub.resolves("navigationData");

            this.oGetVisualizationDataStub = sinon.stub();
            this.oGetVisualizationDataStub.resolves("visualizationData");

            this.oGetPageStub = sinon.stub();
            this.oGetPageStub.resolves({content: this.oDereferencedPageMock});

            this.oDereferencePageStub = sinon.stub();
            this.oDereferencePageStub.returns(this.oCDMPageMock);

            this.oServiceMocks = {
                NavigationDataProvider: {getNavigationData: this.oGetNavigationDataStub},
                PagePersistence: {getPage: this.oGetPageStub},
                PageReferencing: {dereferencePage: this.oDereferencePageStub},
                VisualizationDataProvider: {getVisualizationData: this.oGetVisualizationDataStub}
            };

            this.oLogErrorStub = sinon.stub(Log, "error").returns(true);
            sap.ushell.Container = {
                getServiceAsync: sinon.stub().callsFake(function (service) {
                    return this.oServiceMocks[service] ? Promise.resolve(this.oServiceMocks[service]) : Promise.reject();
                }.bind(this))
            };

            this.oCDMAdapter = new PagesCDMAdapter();
        },
        afterEach: function () {
            this.oLogErrorStub.restore();
        }
    });

    QUnit.test("returns the expected data when all services are working properly and the functions is called once", function (assert) {
        // Arrange
        this.oCDMAdapter.oCDMSiteRequestPromise = Promise.resolve(["some", "data", "foo"]);

        //Act
        return this.oCDMAdapter._getPage(this.sPageIdMock)
            .then(function (page) {
                //Assert
                assert.deepEqual(page, this.oCDMPageMock, "Expected result was returned");
                assert.strictEqual(this.oGetNavigationDataStub.callCount, 1, "getNavigationData called once");
                assert.strictEqual(this.oGetVisualizationDataStub.callCount, 1, "getVisualizationData called once");
                assert.strictEqual(this.oGetPageStub.callCount, 1, "getPage called once");
                assert.strictEqual(this.oDereferencePageStub.callCount, 1, "dereferencePage called once");

                assert.ok(this.oGetPageStub.calledWithExactly(this.sPageIdMock), "getPage called with the right parameter");
                assert.ok(this.oDereferencePageStub.calledWithExactly(this.oDereferencedPageMock, "visualizationData", "navigationData"), "dereferencePage, called with the right parameters");
            }.bind(this))
            .catch(function () {
                assert.ok(false, "Promise was rejected");
            });
    });

    QUnit.test("returns the expected data when all services are working properly and the functions is called once", function (assert) {
        //Arrange
        this.oCDMAdapter.oCDMSiteRequestPromise = Promise.resolve(["some", "data", "foo"]);

        var fnAssertFunctionCalls = function (page) {
            assert.deepEqual(page, this.oCDMPageMock, "Expected result was returned");
            assert.strictEqual(this.oGetNavigationDataStub.callCount, 1, "getNavigationData called once");
            assert.strictEqual(this.oGetVisualizationDataStub.callCount, 1, "getVisualizationData called once");
            assert.strictEqual(this.oGetPageStub.callCount, 1, "getPage called once");
            assert.strictEqual(this.oDereferencePageStub.callCount, 1, "dereferencePage called once");

            assert.ok(this.oGetPageStub.calledWithExactly(this.sPageIdMock), "getPage called with the right parameter");
            assert.ok(this.oDereferencePageStub.calledWithExactly(this.oDereferencedPageMock, "visualizationData", "navigationData"), "dereferencePage, called with the right parameters");
        }.bind(this);

        // Act
        return this.oCDMAdapter._getPage(this.sPageIdMock)
            .then(function (page) {
                //Assert
                fnAssertFunctionCalls(page);
                //The second _getPage call is used to check the caching of the pagesCDMAdapter
                return this.oCDMAdapter._getPage(this.sPageIdMock);
            }.bind(this))
            .then(function (page) {
                //Assert
                fnAssertFunctionCalls(page);
            });
    });

    QUnit.test("rejects the promise if _getPage is called without parameter", function (assert) {
        //Act
        return this.oCDMAdapter._getPage()
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
                //Assert
                assert.ok(true, "Promise was rejected");
            });
    });


    QUnit.test("rejects the promise when calling _getPage and NavigationDataProvider service is not available", function (assert) {
        // Arrange
        delete this.oServiceMocks.NavigationDataProvider;

        // Act
        return this.oCDMAdapter._getPage(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
            //Assert
            assert.ok(true, "Promise was rejected");
        });
    });

    QUnit.test("rejects the promise when calling _getPage and VisualizationDataProvider service is not available", function (assert) {
        // Arrange
        delete this.oServiceMocks.VisualizationDataProvider;

        // Act
        return this.oCDMAdapter._getPage(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
            //Assert
            assert.ok(true, "Promise was rejected");
        });
    });

    QUnit.test("rejects the promise when calling _getPage and PagePersistence service is not available", function (assert) {
        // Arrange
        delete this.oServiceMocks.PagePersistence;

        // Act
        return this.oCDMAdapter._getPage(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
            //Assert
            assert.ok(true, "Promise was rejected");
        });
    });

    QUnit.test("rejects the promise when calling _getPage and PageReferencing service is not available", function (assert) {
        // Arrange
        delete this.oServiceMocks.PageReferencing;

        // Act
        return this.oCDMAdapter._getPage(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
            //Assert
            assert.ok(true, "Promise was rejected");
        });
    });

    QUnit.test("rejects the promise when calling _getPage and NavigationDataProvider.getNavigationData() is rejected", function (assert) {
        // Arrange
        this.oGetNavigationDataStub.rejects("Error");

        // Act
        return this.oCDMAdapter._getPage(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
            //Assert
            assert.ok(true, "Promise was rejected");
        });
    });

    QUnit.test("rejects the promise when calling _getPage and VisualizationDataProvider.getVisualizationData() is rejected", function (assert) {
        // Arrange
        this.oGetVisualizationDataStub.rejects("Error");

        //Act
        return this.oCDMAdapter._getPage(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
            //Assert
            assert.ok(true, "Promise was rejected");
        });
    });

    QUnit.test("rejects the promise when calling _getPage and PagePersistence.getPage() is rejected", function (assert) {
        // Arrange
        this.oGetPageStub.rejects("Error");

        //Act
        return this.oCDMAdapter._getPage(this.sPageIdMock)
            .then(function () {
                assert.ok(false, "Promise was resolved");
            }).catch(function () {
            //Assert
            assert.ok(true, "Promise was rejected");
        });
    });
});
