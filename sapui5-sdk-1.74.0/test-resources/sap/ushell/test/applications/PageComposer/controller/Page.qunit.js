// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.require([
    "sap/ushell/applications/PageComposer/controller/Page"
], function (
    Page
) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("visualizationFactory", {
        beforeEach: function () {
            this.oTestContextInfo = {
                vizId: "TEST-VIZ-ID",
                tileType: "STATIC",
                title: "TEST-TITLE",
                subTitle: "TEST-SUBTITLE",
                iconUrl: "TEST-ICON"
            };
            this.oContext = {
                getProperty: sinon.stub().returns(this.oTestContextInfo),
                getPath: sinon.stub()
            };
            this.oInstantiateVisualizationStub = sinon.stub().returns({
                _getInnerControlPromise: sinon.stub().returns(Promise.resolve()),
                attachPress: sinon.stub(),
                getTarget: sinon.stub(),
                setState: sinon.stub(),
                getState: sinon.stub(),
                getBindingContext: sinon.stub().returns(this.oContext),
                getInnerControl: sinon.stub().returns({
                    setScope: sinon.stub(),
                    bindProperty: sinon.stub(),
                    attachPress: sinon.stub().returns({
                        getParameter: sinon.stub()
                    })
                })
            });
            this.oControllerStub = {
                getModel: sinon.stub().returns({
                    getProperty: sinon.stub().returns(true)
                }),
                getResourceBundle: sinon.stub().returns({
                    getText: sinon.stub().withArgs("Title.CustomTile").returns("TEST-CUSTOM-TILE-FOOTER")
                }),
                getView: sinon.stub().returns({
                    byId: sinon.stub().returns({
                        setModel: sinon.stub(),
                        toggleStyleClass: sinon.stub()
                    })
                }),
                oVisualizationLoadingService: {
                    instantiateVisualization: this.oInstantiateVisualizationStub
                }
            };
            this.oPage = Page.init(this.oControllerStub);
        }
    });

    QUnit.test("calls the visualizationService with the expected object if tileType is STATIC", function (assert) {
        Page.visualizationFactory(null, this.oContext);

        assert.ok(this.oInstantiateVisualizationStub.called, "The visualizationService was called");
        assert.ok(this.oInstantiateVisualizationStub.calledWith({
            vizId: this.oTestContextInfo.vizId,
            previewMode: true,
            localLoad: true,
            tileType: "sap.ushell.ui.tile.StaticTile",
            properties: {
                icon: this.oTestContextInfo.iconUrl,
                subtitle: this.oTestContextInfo.subTitle,
                tileType: this.oTestContextInfo.tileType,
                title: this.oTestContextInfo.title,
                vizId: this.oTestContextInfo.vizId
            }
        }), "The visualizationService was called with the expected object for STATIC tileType.");
    });

    QUnit.test("calls the visualizationService with the expected object if tileType is DYNAMIC", function (assert) {
        this.oTestContextInfo.tileType = "DYNAMIC";
        Page.visualizationFactory(null, this.oContext);

        assert.ok(this.oInstantiateVisualizationStub.called, "The visualizationService was called");
        assert.ok(this.oInstantiateVisualizationStub.calledWith({
            vizId: this.oTestContextInfo.vizId,
            previewMode: true,
            localLoad: true,
            tileType: "sap.ushell.ui.tile.DynamicTile",
            properties: {
                icon: this.oTestContextInfo.iconUrl,
                subtitle: this.oTestContextInfo.subTitle,
                tileType: this.oTestContextInfo.tileType,
                title: this.oTestContextInfo.title,
                vizId: this.oTestContextInfo.vizId
            }
        }), "The visualizationService was called with the expected object for STATIC tileType.");
    });

    QUnit.test("calls the visualizationService with the expected object if tileType is CUSTOM", function (assert) {
        this.oTestContextInfo.tileType = "TEST-CUSTOM-TILE-TYPE";
        Page.visualizationFactory(null, this.oContext);

        assert.ok(this.oInstantiateVisualizationStub.called, "The visualizationService was called");
        assert.ok(this.oInstantiateVisualizationStub.calledWith({
            vizId: this.oTestContextInfo.vizId,
            previewMode: true,
            localLoad: true,
            tileType: "sap.ushell.ui.tile.StaticTile",
            properties: {
                icon: this.oTestContextInfo.iconUrl,
                info: "[TEST-CUSTOM-TILE-FOOTER]",
                subtitle: this.oTestContextInfo.subTitle,
                tileType: this.oTestContextInfo.tileType,
                title: this.oTestContextInfo.title,
                vizId: this.oTestContextInfo.vizId
            }
        }), "The visualizationService was called with the expected object for STATIC tileType.");
    });
});
