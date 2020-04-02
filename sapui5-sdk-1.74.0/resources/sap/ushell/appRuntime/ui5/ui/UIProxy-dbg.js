// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Button"
], function (Button) {
    "use strict";

    function UIProxy () {
        sap.ushell = sap.ushell || {};
        sap.ushell.ui = sap.ushell.ui || {};
        sap.ushell.ui.footerbar = {
            JamDiscussButton: function () {
                return new Button();
            },
            JamShareButton: function () {
                return new Button();
            },
            AddBookmarkButton: function () {
                return new Button();
            }
        };
    }

    return new UIProxy();
});
