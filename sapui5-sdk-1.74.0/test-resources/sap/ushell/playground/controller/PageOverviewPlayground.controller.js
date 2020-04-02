// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ushell/extensions/_PageComposition/Factory/PageOverview"
], function (Controller, MessageToast, PageOverview) {
    "use strict";

    return Controller.extend("sap.ushell.playground.controller.PageOverviewPlayground", {
        onInit: function () {
            this.oPages = {
                "pages": [
                    {
                        "Id": "page-1",
                        "Name": "Sales Page",
                        "Description": "Page for a Sales Professional",
                        "CreatedBy": "Sales Professional",
                        "CreatedAt": "2019-05-05",
                        "ChangedBy": "",
                        "ChangedAt": ""
                    },
                    {
                        "Id": "page-2",
                        "Name": "Marketing Page",
                        "Description": "Page for a Marketing Professional",
                        "CreatedBy": "Marketing Professional",
                        "CreatedAt": "2019-05-04",
                        "ChangedBy": "Marketing Professional",
                        "ChangedAt": "2019-05-05"
                    },
                    {
                        "Id": "page-3",
                        "Name": "Contract Page",
                        "Description": "Page for a Contract Manager",
                        "CreatedBy": "Contract Manager",
                        "CreatedAt": "2019-05-01",
                        "ChangedBy": "Contract Manager",
                        "ChangedAt": "2019-05-03"
                    },
                    {
                        "Id": "page-4",
                        "Name": "Analytics Page",
                        "Description": "Page for an Analytics Professional",
                        "CreatedBy": "Analytics Professional",
                        "CreatedAt": "2019-05-12",
                        "ChangedBy": "",
                        "ChangedAt": ""
                    }
                ]
            };
        },

        loadPageOverviewData: function () {
            return Promise.resolve(this.oPages);
        },

        onOpenDialog: function () {
            var oPageOverview = PageOverview.create(this.loadPageOverviewData.bind(this));
            oPageOverview.selectPage().then(function (sSelectedPage) {
                if (!sSelectedPage) {
                    return;
                }

                MessageToast.show(sSelectedPage);
            });
        }
    });
});
