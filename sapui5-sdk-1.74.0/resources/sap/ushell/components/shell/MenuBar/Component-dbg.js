// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("sap.ushell.components.shell.MenuBar.Component", {
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            var oMenuModel = new JSONModel();
            this.setModel(oMenuModel, "menu");

            sap.ushell.Container.getServiceAsync("Menu")
                .then(function (oMenuService) {
                    return oMenuService.getMenuEntries();
                })
                .then(function (aMenuEntries) {
                    oMenuModel.setProperty("/", aMenuEntries);
                });
        }
    });
});