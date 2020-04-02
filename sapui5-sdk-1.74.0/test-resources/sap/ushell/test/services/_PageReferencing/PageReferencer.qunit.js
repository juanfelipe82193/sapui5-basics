// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for module "PageReferencer"
 * "
 */

sap.ui.require([
    "sap/ushell/services/_PageReferencing/PageReferencer",
    "sap/ushell/services/Container"
], function (PageReferencer, Container) {
    "use strict";

    /* global QUnit sinon */

    var oPageInfo = {
        content: {
            id: "Z_TEST_ID",
            title: "Test Page",
            description: "Test"
        },
        metadata: {

        }
    };

    var oPageLayout = [
        {
            id: "Group1",
            title: "Group 1",
            tiles: []
        },
        {
            id: "Group2",
            title: "Group 2",
            tiles: [
                {
                    tileCatalogId: "id1",
                    target: "#Action-toappnavsample"
                },
                {
                    tileCatalogId: "id2",
                    target: "#Action-totestapp"
                }
            ]
        }
    ];

    var oResolveHashStub;

    QUnit.module("sap/ushell/services/_PageReferencing/PageReferencer", {

        beforeEach: function (assert) {
            var fnDone = assert.async();
            sap.ushell.bootstrap("local").done(function () {
                fnDone();
            });
        },
        afterEach: function () {
            delete sap.ushell.Container;
            if (oResolveHashStub) {
                oResolveHashStub.restore();
            }
        }

    });

    QUnit.test("Create reference page with empty section", function (assert) {
        var fnDone = assert.async();
        var oResultPromise = PageReferencer.createReferencePage(oPageInfo, []);
        oResultPromise.then(function (oResult) {
            assert.equal(oResult.content.id, oPageInfo.content.id, "Id set correctly in reference page");
            assert.equal(oResult.content.title, oPageInfo.content.title, "Title set correctly in reference page");
            assert.equal(oResult.content.description, oPageInfo.content.description, "Description set correctly in reference page");
            assert.equal(oResult.content.sections.length, 0, "Sections should be empty");
            fnDone();
        });
    });

    QUnit.test("Create reference page for one group without any tiles", function (assert) {
        var fnDone = assert.async(),
            oEmptyGroup = oPageLayout[0];

        PageReferencer.createReferencePage(oPageInfo, [oEmptyGroup]).then(function (oResult) {
            assert.equal(oResult.content.sections.length, 1, "Sections should conteain 1 item");
            assert.equal(oResult.content.sections[0].id, oEmptyGroup.id, "Id of the empty group set correctly in reference page");
            assert.equal(oResult.content.sections[0].title, oEmptyGroup.title, "Title  of the empty group set correctly in reference page");
            assert.equal(oResult.content.sections[0].visualizations.length, 0, "The empty group hasn't tiles in reference page");
            fnDone();
        });
    });

    QUnit.test("Create reference page when all tiles resolved", function (assert) {
        var fnDone = assert.async(),
            oGroup = oPageLayout[1],
            oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            permanentKey = "X-SAP-UI2-CATALOGPAGE:/UI2/FLP/UW2:ET091D7N8BTEAL3ATDLMJ1B8Q";

        oResolveHashStub = sinon.stub(oNavTargetResolution, "resolveHashFragment").returns(jQuery.Deferred().resolve({
            inboundPermanentKey: permanentKey
        }));

        PageReferencer.createReferencePage(oPageInfo, oPageLayout).then(function (oResult) {
            var aVisualizations = oResult.content.sections[1].visualizations;
            assert.equal(oResolveHashStub.callCount, oGroup.tiles.length, "resolveHashFragment called for all hash targets");
            assert.equal(aVisualizations.length, oGroup.tiles.length, "The number of tiles in reference page is the same as in layout");
            assert.equal(aVisualizations[0].inboundPermanentKey, permanentKey, "inboundPermanentKey is taken from ClientSideTargetResolution");
            assert.equal(aVisualizations[0].vizId, oGroup.tiles[0].tileCatalogId, "vizId set correctly");
            assert.equal(aVisualizations[1].inboundPermanentKey, permanentKey, "inboundPermanentKey is taken from ClientSideTargetResolution");
            assert.equal(aVisualizations[1].vizId, oGroup.tiles[1].tileCatalogId, "vizId set correctly");
            oResolveHashStub.restore();
            fnDone();
        });
    });

    QUnit.test("Create reference page is rejected when one of the tile is not resolved", function (assert) {
        var fnDone = assert.async(),
            oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution");

        oResolveHashStub = sinon.stub(oNavTargetResolution, "resolveHashFragment");
        oResolveHashStub.withArgs("#Action-toappnavsample").returns(jQuery.Deferred().reject("reject"));
        oResolveHashStub.returns(jQuery.Deferred().resolve({
            inboundPermanentKey: "key"
        }));

        PageReferencer.createReferencePage(oPageInfo, oPageLayout).then(
            function () {
                assert.ok(false, "Promise should be rejected");
                fnDone();
            },
            function () {
                assert.ok(true, "Promise should be rejected");
                fnDone();
            }
        );
    });

    QUnit.test("Do not call resolveHashFragment for duplicate target", function (assert) {
        var fnDone = assert.async(),
            oGroup = {
                id: "Group2",
                title: "Group 2",
                tiles: [
                    {
                        tileCatalogId: "id1",
                        target: "#Action-toappnavsample"
                    },
                    {
                        tileCatalogId: "id2",
                        target: "#Action-toappnavsample"
                    }
                ]
            },
            oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution");

        oResolveHashStub = sinon.stub(oNavTargetResolution, "resolveHashFragment").returns(jQuery.Deferred().resolve({
            inboundPermanentKey: "key"
        }));

        PageReferencer.createReferencePage(oPageInfo, [oGroup]).then(function () {
            assert.equal(oResolveHashStub.callCount, 1, "resolveHashFragment called for all unique hash targets");
            oResolveHashStub.restore();
            fnDone();
        });
    });


    QUnit.test("Do not call resolveHashFragment if target is not defined", function (assert) {
        var fnDone = assert.async(),
            oGroup = {
                id: "Group2",
                title: "Group 2",
                tiles: [
                    {
                        tileCatalogId: "id1",
                        target: undefined
                    }
                ]
            },
            oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution");

        oResolveHashStub = sinon.stub(oNavTargetResolution, "resolveHashFragment").returns(jQuery.Deferred().resolve({
            inboundPermanentKey: "key"
        }));

        PageReferencer.createReferencePage(oPageInfo, [oGroup]).then(function (oResult) {
            var aVisualizations = oResult.content.sections[0].visualizations;
            assert.equal(oResolveHashStub.callCount, 0, "resolveHashFragment should not be called if the target is not defined");
            assert.equal(aVisualizations[0].inboundPermanentKey, undefined, "inboundPermanentKey should be undefined when target is not defined");
            oResolveHashStub.restore();
            fnDone();
        });
    });

});
