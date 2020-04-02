// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sap, $ */

sap.ui.define([
    'sap/ushell/renderers/fiori2/search/SearchHelper'
], function (SearchHelper) {
    "use strict";

    return sap.m.Link.extend('sap.ushell.renderers.fiori2.search.controls.SearchLink', {

        metadata: {
            aggregations: {
                icon: {
                    type: "sap.ui.core.Icon",
                    multiple: false
                }
            }
        },

        renderer: 'sap.m.LinkRenderer',

        onAfterRendering: function () {
            var d = this.getDomRef();

            // recover bold tag with the help of text() in a safe way
            SearchHelper.boldTagUnescaper(d);

            var icon = this.getAggregation("icon");
            if (icon) {
                var oRm = sap.ui.getCore().createRenderManager();
                var iconContainer = $("<span></span");
                oRm.render(icon, iconContainer);
                $(d).prepend("&nbsp;");
                $(d).prepend(iconContainer);
                oRm.destroy();
            }
        }
    });
});
