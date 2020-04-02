// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/*global jQuery, sap, window */
jQuery.sap.require("sap.m.MessageToast");

sap.ui.controller("sap.ushell.demo.letterBoxing.App", {

    onInit: function () {
        this.fullWidth = true;
    },

    onChaneLetterBoxing : function() {
        sap.ushell.services.AppConfiguration.setApplicationFullWidth(!this.fullWidth);
        this.fullWidth = !this.fullWidth;
    }
});