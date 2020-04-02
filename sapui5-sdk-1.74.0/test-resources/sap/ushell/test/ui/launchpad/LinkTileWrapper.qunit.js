// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.TileContainer
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, equals, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.launchpad.LinkTileWrapper");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");

    var oLinkTileWrapper,
        demiTestData = {
            id : 'testLingTilwWrapper',
            uuid: 'testUUID',
            target: '#testTarget',
            tileActionModeActive: false
        };

    module("sap.ushell.ui.launchpad.TileContainer", {
        setup: function () {
            sap.ushell.bootstrap("local");
            oLinkTileWrapper = new sap.ushell.ui.launchpad.LinkTileWrapper(demiTestData);
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oLinkTileWrapper.destroy();
            delete sap.ushell.Container;
        }
    });

    test("Link wrapper behavior in Edit Mode vs not in Edit Mode", function () {
        var oFakeClickEvent = {
            preventDefault:  sinon.spy()
            },
            oEventBus = sap.ui.getCore().getEventBus(),
            oPublishStub =  sinon.stub(oEventBus, 'publish'),
            oGetTileViewsStub =  sinon.stub(oLinkTileWrapper, 'getTileViews').returns([
                {getHref: sinon.stub()}
            ]);

        oLinkTileWrapper.onclick(oFakeClickEvent);
        equals(oPublishStub.called, true, "when not in edit mode, Link is clickable and 'dashboardTileLinkClick' event is published");
        equals(oPublishStub.args[0][1], 'dashboardTileLinkClick', "event: 'dashboardTileLinkClick' expected to published");

        oLinkTileWrapper.setTileActionModeActive(true);
        oLinkTileWrapper.onclick(oFakeClickEvent);
        equals(oFakeClickEvent.preventDefault.called, true, "when in edit mode, Link is not clickable");
        equals(oPublishStub.calledOnce, true, "'dashboardTileLinkClick' event is not published again");

        oGetTileViewsStub.restore();
        oPublishStub.restore();
    });
}());
