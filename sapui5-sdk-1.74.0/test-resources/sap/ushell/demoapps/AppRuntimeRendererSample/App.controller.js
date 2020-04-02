// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/*global jQuery, sap, window */
jQuery.sap.require("sap.m.MessageToast");

sap.ui.controller("sap.ushell.demo.AppRuntimeRendererSample.App", {

    onCreateBtn : function() {
        var that = this;
        sap.ushell.renderers.fiori2.Renderer.addHeaderItem(
            "sap.ushell.ui.shell.ShellHeadItem",
            {
                id: "idButtonAdd",
                icon: "sap-icon://flight",
                tooltip: "add 2 numbers",
                click: function () {
                    //alert("header button was clicked. This alert is executed inside the iframe");
                    var oView = that.getView();
                    oView.byId("idResult").setValue(Number(oView.byId("idNumber1").getValue()) + Number(oView.byId("idNumber2").getValue()));
                }
            },
            true,
            true,
            ["app"]);
    },

    onCreateEndBtn : function() {
        var that = this;
        sap.ushell.renderers.fiori2.Renderer.addHeaderEndItem(
            "sap.ushell.ui.shell.ShellHeadItem",
            {
                id: "idButtonSub",
                icon: "sap-icon://flight",
                tooltip: "subtrut 2 numbers",
                click: function () {
                    //alert("header button was clicked. This alert is executed inside the iframe");
                    var oView = that.getView();
                    oView.byId("idResult").setValue(Number(oView.byId("idNumber1").getValue()) - Number(oView.byId("idNumber2").getValue()));
                }
            },
            true,
            true,
            ["app"]);
    },

    onRemoveBtn : function() {
        sap.ushell.renderers.fiori2.Renderer.hideHeaderItem(
            ["idButtonAdd"],
            false
        );
    },

    onRemoveEndBtn : function() {
        sap.ushell.renderers.fiori2.Renderer.hideHeaderEndItem(
            ["idButtonSub"],
            true
        );
    },

    onShowBtn : function() {
        sap.ushell.renderers.fiori2.Renderer.showHeaderItem(
            ["idButtonAdd"],
            true
        );
    },

    onShowEndBtn : function() {
        sap.ushell.renderers.fiori2.Renderer.showHeaderEndItem(
            ["idButtonSub"],
            true
        );
    },

    onSetHeaderTitle : function() {
        sap.ushell.renderers.fiori2.Renderer.setHeaderTitle(
            this.getView().byId("idTitle").getValue()
        );
    },

    onHideHeader : function() {
        sap.ushell.renderers.fiori2.Renderer.setHeaderVisibility(
            false,
            true
        );
    },

    onShowHeader : function() {
        sap.ushell.renderers.fiori2.Renderer.setHeaderVisibility(
            true,
            true
        );
    }
});