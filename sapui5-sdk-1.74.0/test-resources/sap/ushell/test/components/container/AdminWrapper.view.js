// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
(function () {
    "use strict";
    /*global jQuery, sap */

    jQuery.sap.includeStyleSheet(
        "/ushell/test-resources/sap/ushell/test/components/container/pgadm.css",
        "pgadm"
    );

    jQuery.sap.registerModulePath("sap.ui2.shell", "/sap/public/bc/ui2/shell-api/sap/ui2/shell/");
    jQuery.sap.require("sap.ui2.shell.shell");

    jQuery.sap.registerModulePath("sap.ui2.ui5lib",
        "/sap/public/bc/ui2/page-administration/sap/ui2/ui5lib/");
    jQuery.sap.require("sap.ui2.ui5lib.library");

    jQuery.sap.registerModulePath("sap.ui2.srvc", "/sap/public/bc/ui2/services/sap/ui2/srvc/");
    jQuery.sap.require("sap.ui2.srvc.factory");
    jQuery.sap.require("sap.ui2.srvc.page");
    jQuery.sap.require("sap.ui2.srvc.pbs");

    jQuery.sap.registerModulePath("sap.ui2.pgadm",
        "/sap/public/bc/ui2/page-administration/sap/ui2/pgadm/");
    jQuery.sap.require("sap.ui2.pgadm.filter");

    sap.ui.jsview("sap.ushell.test.components.container.AdminWrapper", {
        /**
         * Note: There is no controller for this view!
         */
        createContent : function () {
            return sap.ui.view({
                id: "pageAdminView",
                type: sap.ui.core.mvc.ViewType.XML,
                viewName: "sap.ui2.pgadm.Admin",
                viewData: {
                    pagebuilderUrl: "/sap/public/bc/ui2/pagebuilder"
                }
            });
        }
    });
}());
