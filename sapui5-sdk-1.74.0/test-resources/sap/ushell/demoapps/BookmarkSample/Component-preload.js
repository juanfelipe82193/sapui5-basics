//@ui5-bundle sap/ushell/demo/bookmark/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/bookmark/Component.js":function(){/*
 * Copyright (C) 2015 SAP AG or an SAP affiliate company. All rights reserved
 */

//define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.bookmark.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

//new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.bookmark.Component", {
    metadata : {
        "manifest": "json"
    },

    /**
     *  Initialize the application
     *  @returns {sap.ui.core.Control} the content
     */
    createContent: function() {
        jQuery.sap.log.info("sap.ushell.demo.bookmark: Component.createContent");
        this.oMainView = sap.ui.xmlview("sap.ushell.demo.bookmark.bookmark");
        return this.oMainView;
    }

});
},
	"sap/ushell/demo/bookmark/bookmark.controller.js":function(){/*
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
},
	"sap/ushell/demo/bookmark/bookmark.view.xml":'<?xml version="1.0" encoding="UTF-8" standalone="no"?>\r\n<!--\r\n    Copyright (C) 2015 SAP AG or an SAP affiliate company. All rights reserved\r\n-->\r\n<core:View\r\n  xmlns:core="sap.ui.core"\r\n  xmlns="sap.m"\r\n  xmlns:html="http://www.w3.org/1999/xhtml"\r\n  xmlns:l="sap.ui.layout"\r\n  xmlns:f="sap.ui.layout.form"\r\n  xmlns:footerbar="sap.ushell.ui.footerbar"\r\n  controllerName="sap.ushell.demo.bookmark.bookmark"\r\n  >\r\n\r\n    <Shell>\r\n      <app>\r\n        <Page id="page" title="Bookmark Sample App" enableScrolling="false" showFooter="true">\r\n            <content>\r\n              <Panel>\r\n                <content>\r\n                  <f:SimpleForm title="Bookmark Tile Properties">\r\n                      <Label text="Target to be bookmarked" />\r\n                      <Input id="inputTarget" value="{/bookmarkedUrl}" />\r\n                      <Label text="Title" />\r\n                      <Input id="inputTitle" value="{/title}" />\r\n                      <Label text="Subtitle" />\r\n                      <Input value="{/subtitle}" />\r\n                      <Label text="Info" />\r\n                      <Input value="{/info}" />\r\n                      <Label text="Icon" />\r\n                      <Input value="{/icon}" />\r\n                      <core:Icon src="{/icon}" size="32px"/>\r\n                      <Label text="Number Unit" />\r\n                      <Input value="{/numberUnit}" />\r\n                      <Label text="Service URL" />\r\n                      <Input value="{/serviceUrl}" />\r\n                      <Label text="Refresh Intervall" />\r\n                      <Input value="{/serviceRefreshInterval}" />\r\n                  </f:SimpleForm>\r\n                  <Button id="addBookmarkButton" text="Add Bookmark" press="onAddBookmark" icon="sap-icon://add"/>\r\n                  <f:SimpleForm title="Count, Update or Delete Bookmark Tiles">\r\n                     <Label text="Match all tiles with target" />\r\n                     <Input value="{/identificationUrl}" />\r\n                     <Label text="Count Result"/>\r\n                     <Input id="countResult" value="{/bookmarkCount}"/>\r\n                  </f:SimpleForm>\r\n                  <Button id="updateBookmarkButton" text="Update Bookmark" press="onUpdateBookmark" icon="sap-icon://edit"/>\r\n                  <Button id="countBookmarkButton" text="Count Bookmarks" press="onCountBookmark" icon="sap-icon://synchronize"/>\r\n                  <Button id="deleteBookmarkButton" text="Delete Bookmark" press="onDeleteBookmark" icon="sap-icon://delete"/>\r\n                </content>\r\n              </Panel>\r\n            </content>\r\n            <footer>\r\n              <Bar>\r\n                <contentLeft>\r\n                  <footerbar:AddBookmarkButton id="addToHome" />\r\n                </contentLeft>\r\n              </Bar>\r\n            </footer>\r\n        </Page>\r\n      </app>\r\n    </Shell>\r\n</core:View>',
	"sap/ushell/demo/bookmark/i18n/i18n.properties":'# SAPUI5 TRANSLATION-KEY 7d524c80-71ab-11e5-a837-0800200c9a66\r\n# Copyright (c) 2009-2015 SAP SE, All Rights Reserved\r\n# See Translation Guide for SAPUI5 Application Developers in the\r\n# sap help portal for details\r\n# http://help.sap.com/saphelp_uiaddon10/helpdata/en/b9/a2a70596e241ebad8901f1d19fe28e/content.htm?frameset=/en/0c/5f019e130e45ceb8914d72fb0257dd/frameset.htm&current_toc=/en/e4/843b8c3d05411c83f58033bac7f072/plain.htm&node_id=652\r\n\r\n# XTIT: Dialog title\r\ntitle=Bookmark Sample\r\n\r\n# XTXT: description\r\ndescription=Sample app for creating and editing of Fiori Launchpad bookmark tiles\r\n\r\n# XTXT: keyword\r\nkeyword.sample=Sample App\r\n# XTXT: keyword\r\nkeyword.demo=Demo App\r\n# XTXT: keyword\r\nkeyword.flp=Fiori Launchpad\r\n',
	"sap/ushell/demo/bookmark/manifest.json":'{\n    "_version": "1.4.0",\n    "sap.app": {\n        "id": "sap.ushell.demo.bookmark",\n        "_version": "1.1.0",\n        "i18n": "i18n/i18n.properties",\n        "type": "application",\n        "applicationVersion": {\n            "version": "1.0.0"\n        },\n        "title": "{{title}}",\n        "description": "{{description}}",\n        "tags": {\n            "keywords": [\n                "{{keyword.sample}}",\n                "{{keyword.demo}}",\n                "{{keyword.flp}}"\n            ]\n        },\n        "ach": "CA-UI2-INT-FE",\n        "crossNavigation": {\n            "inbounds": {\n                "inb": {\n                    "semanticObject": "Action",\n                    "action": "toBookmark",\n                    "signature": {\n                        "parameters": {},\n                        "additionalParameters": "allowed"\n                    }\n                }\n            }\n        }\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n        "technology": "UI5",\n        "icons": {\n            "icon": "sap-icon://favorite"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        },\n        "supportedThemes": [\n            "sap_hcb",\n            "sap_bluecrystal"\n        ]\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "dependencies": {\n            "minUI5Version": "1.28",\n            "libs": {\n                "sap.m": {\n                    "minVersion": "1.28"\n                }\n            }\n        },\n        "models": {\n            "i18n": {\n                "type": "sap.ui.model.resource.ResourceModel",\n                "uri": "i18n/i18n.properties"\n            }\n        },\n        "rootView": {\n            "viewName": "sap.ushell.demo.bookmark.bookmark",\n            "type": "XML"\n        },\n        "handleValidation": false,\n        "contentDensities": {\n            "compact": false,\n            "cozy": true\n        }\n    }\n}'
},"sap/ushell/demo/bookmark/Component-preload"
);
