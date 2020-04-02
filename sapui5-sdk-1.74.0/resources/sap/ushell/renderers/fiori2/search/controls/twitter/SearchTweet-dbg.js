// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sap */
sap.ui.define(['sap/ushell/renderers/fiori2/search/controls/twitter/TwitterRenderer'], function (twitterRenderer) {
    "use strict";

    return sap.ui.core.Control.extend("sap.ushell.renderers.fiori2.search.controls.twitter.SearchTweet", {

        metadata: {
            properties: {
                "text": "string"
            }
        },

        renderer: function (oRm, oControl) {
            oRm.write('<div');
            oRm.writeControlData(oControl);
            oRm.writeClasses();
            oRm.write('>');
            twitterRenderer.renderTweet(oRm, oControl.getText());
            oRm.write('</div>');
        }

    });

});
