// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/playground/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("sap.ushell.playground.controller.NavigationList", {
        onInit: function () {
            var playgroundPages = new JSONModel("./navigationList.json");
            this.getView().setModel(playgroundPages, "pages");
        }
    });
});