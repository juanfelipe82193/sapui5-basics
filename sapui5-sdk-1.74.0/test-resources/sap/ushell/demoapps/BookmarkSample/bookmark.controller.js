/*
 * Copyright (C) 2015 SAP AG or an SAP affiliate company. All rights reserved
 */

sap.ui.controller("sap.ushell.demo.bookmark.bookmark", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf fiori2helloworld.Fiori2HelloWorld
     */
    onInit: function() {
        var that = this,
        oView = this.getView(),
        oAddToHome = oView.byId("addToHome");
        oView.setModel(new sap.ui.model.json.JSONModel({
            identificationUrl: location.hash,
            bookmarkedUrl: location.hash,
            title: "My Bookmark" ,
            subtitle: "(via button)",
            info: "",
            icon: "sap-icon://world",
            numberUnit: "EUR",
            serviceUrl: "",
            serviceRefreshInterval: 0,
            bookmarkCount: "#"
        }));
        oAddToHome.setAppData(oView.getModel().oData);
        oView.byId("addToHome").setBeforePressHandler(function () {
            oAddToHome.setAppData(that.getView().getModel().oData);
        });
    },

    onAddBookmark: function () {
        var oBookmarkService = sap.ushell.Container.getService("Bookmark"),
            oData = this.getView().getModel().oData;
        oBookmarkService.addBookmark({
            title: oData.title,
            url: oData.bookmarkedUrl,
            icon: oData.icon,
            info: oData.info,
            subtitle: oData.subtitle,
            serviceUrl: oData.serviceUrl,
            serviceRefreshInterval: oData.serviceRefreshInterval,
            numberUnit: oData.numberUnit
        }).done(function () {
            sap.m.MessageToast.show("Bookmark added", {duration: 5000});
        }).fail(function (sMessage) {
            sap.m.MessageToast.show("Failed to add bookmark: " + sMessage, {duration: 5000});
        });
    },

    onCountBookmark: function () {
        var oBookmarkService = sap.ushell.Container.getService("Bookmark"),
            oModel = this.getView().getModel(),
            oData = this.getView().getModel().oData;
        oBookmarkService.countBookmarks(oData.identificationUrl).done(function (iCount) {
            sap.m.MessageToast.show("Found " + iCount + " bookmarks for target '" + oData.identificationUrl + "'",
                {duration: 5000});

            oModel.setProperty("/bookmarkCount", iCount);


        }).fail(function (sMessage) {
            sap.m.MessageToast.show("Failed to count bookmarks for target '" + oData.identificationUrl + "': " + sMessage,
                {duration: 5000});

            oData.setProperty("/bookmarkCount", "#");
        });
    },

    onDeleteBookmark: function () {
        var oBookmarkService = sap.ushell.Container.getService("Bookmark"),
            oModel = this.getView().getModel(),
            oData = this.getView().getModel().oData;
        oBookmarkService.deleteBookmarks(oData.identificationUrl).done(function (iCount) {
            sap.m.MessageToast.show("Deleted " + iCount + " bookmarks for target '" + oData.identificationUrl + "'",
                {duration: 5000});

            oModel.setProperty("/bookmarkCount", iCount);

        }).fail(function (sMessage) {
            sap.m.MessageToast.show("Failed to delete bookmarks for target '" + oData.identificationUrl + "': " + sMessage,
                {duration: 5000});

            oData.setProperty("/bookmarkCount", "#");
        });
    },

    onUpdateBookmark: function () {
        var oBookmarkService = sap.ushell.Container.getService("Bookmark"),
            oModel = this.getView().getModel(),
            oData = this.getView().getModel().oData;
        oBookmarkService.updateBookmarks(oData.identificationUrl, {
            title: oData.title,
            url: oData.bookmarkedUrl,
            icon: oData.icon,
            info: oData.info,
            subtitle: oData.subtitle,
            serviceUrl: oData.serviceUrl,
            serviceRefreshInterval: oData.serviceRefreshInterval,
            numberUnit: oData.numberUnit
        }).done(function (iCount) {
            sap.m.MessageToast.show("Updated " + iCount + " bookmarks for target '" + oData.identificationUrl + "'",
                {duration: 5000});

            oModel.setProperty("/bookmarkCount", iCount);

        }).fail(function (sMessage) {
            sap.m.MessageToast.show("Failed to update bookmarks for target '" + oData.identificationUrl + "': " + sMessage,
                {duration: 5000});

            oData.setProperty("/bookmarkCount", "#");
        });
    }
});