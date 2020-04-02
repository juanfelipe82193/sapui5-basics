// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    /**
     * @name Page renderer.
     * @static
     * @private
     */
    var PageRenderer = {
        apiVersion: 2,

        /**
         * Renders the HTML for the given control, using the provided
         * {@link sap.ui.core.RenderManager}.
         *
         * @param {sap.ui.core.RenderManager} rm
         *            The RenderManager that can be used for writing to the render
         *            output buffer
         * @param {sap.ushell.ui.launchpad.Page} page
         *            Page control that should be rendered
         */
        render: function (rm, page) {
            var aSections = page.getSections(),
                iNrOfSections = aSections.length,
                oSection,
                index;

            rm.openStart("div", page);
            rm.class("sapUshellPage");
            rm.openEnd(); // div - tag

            if (page.getShowTitle()) {
                rm.openStart("h2", page.getId() + "-title");
                rm.class("sapUshellPageTitle");
                rm.openEnd(); // h2 - tag
                rm.text(page.getTitle());
                rm.close("h2");
            }

            if (page.getEdit() && !iNrOfSections) {
                rm.renderControl(page.getAggregation("_addSectionButtons")[0]);
            }

            // render "NoSectionsText" when there are no sections
            if (!iNrOfSections && page.getShowNoSectionsText()) {
                rm.renderControl(page.getAggregation("_noSectionText"));
            }

            for (index = 0; index < iNrOfSections; index++) {
                oSection = aSections[index];
                rm.openStart("div");
                rm.class("sapUshellPageSection");
                if (page.getEdit()) {
                    rm.attr("tabindex", "0");
                    rm.attr("data-sap-ui-customfastnavgroup", "true");
                }
                rm.openEnd(); // div - tag
                rm.renderControl(oSection);
                if (page.getEdit()) {
                    rm.renderControl(page.getAggregation("_addSectionButtons")[index + 1]);
                }
                rm.close("div");
            }

            rm.close("div");
        }
    };

    return PageRenderer;
});
