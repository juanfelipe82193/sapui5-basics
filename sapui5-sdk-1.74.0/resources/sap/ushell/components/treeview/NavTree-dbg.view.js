// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/List",
    "sap/m/CustomListItem",
    "sap/m/Link",
    "sap/ui/model/Sorter",
    "sap/ui/thirdparty/jquery"
], function (List, CustomListItem, Link, Sorter, jQuery) {
    "use strict";

    sap.ui.jsview("sap.ushell.components.treeview.NavTree", {
        createContent: function (oController) {
            var listEntryTemplate = new CustomListItem({
                content: new Link({
                    text: "{title}",
                    href: "{target}"
                }).addStyleClass("sapUshellNavTreeLink")
            }).addEventDelegate({
                onclick: oController.onNavTreeTitleChange.bind(oController)
            }).addStyleClass("sapUshellNavTreeListItem sapUshellNavTreeChild sapUshellNavTreeChildHide sapUshellNavTree_visual_transition");

            var oList = new List({
                items: {
                    path: "/items",
                    groupHeaderFactory: jQuery.proxy(oController.getGroupHeader, oController),
                    sorter: new Sorter("groupIndex", false, true),
                    template: listEntryTemplate
                }
            });
            var orig = oList.onAfterRendering;
            oList.onAfterRendering = function () {
                orig.apply(this, arguments);
                if (this.getItems().length > 0) {
                    var oFirstItem = this.getItems()[0];
                    if (oFirstItem.getMetadata().getName() === "sap.m.GroupHeaderListItem" && oFirstItem.getTitle && !oFirstItem.getTitle()) {
                        oFirstItem.destroy();
                    }
                    var aOpenedGroups = jQuery(".sapUshellNavTreeParent");
                    aOpenedGroups.each(function () {
                        var jQThis = jQuery(this);
                        var oItem = sap.ui.getCore().byId(jQThis.attr("id"));
                        var sIcon = oItem.getContent().length && oItem.getContent()[0] && oItem.getContent()[0].getSrc() || "";
                        if (sIcon === "slim-arrow-down") {
                            jQThis.nextUntil(".sapUshellNavTreeSingle, .sapUshellNavTreeParent").removeClass("sapUshellNavTreeChildHide");
                        }
                    });
                }
            };
            return oList;
        },

        getControllerName: function () {
            return "sap.ushell.components.treeview.NavTree";
        }
    });
}, /* bExport= */ true);
