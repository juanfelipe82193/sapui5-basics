// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/services/Bookmark",
    "sap/ushell/appRuntime/ui5/AppRuntimeService"
], function (Bookmark, AppRuntimeService) {
    "use strict";

    function BookmarkProxy (oContainerInterface, sParameters, oServiceConfiguration) {
        Bookmark.call(this, oContainerInterface, sParameters, oServiceConfiguration);

        //addBookmark(oParameters, oGroup?) : object - jQuery.Deferred promise
        //Adds a bookmark tile to one of the user's home page groups.
        this.addBookmark = function (oParameters, oGroup) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Bookmark.addBookmarkUI5", {
                    "oParameters": oParameters,
                    "oGroup": oGroup
                });
        };

        this.getShellGroupIDs = function () {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Bookmark.getShellGroupIDs");
        };


        this.addBookmarkByGroupId = function (oParameters, groupId) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Bookmark.addBookmark",
                {
                    "oParameters": oParameters,
                    "groupId": groupId
                }
            );
        };

        //addCatalogTileToGroup(sCatalogTileId, sGroupId?, oCatalogData?) : object - jQuery.Deferred object's promise
        //Adds the catalog tile with the given ID to given group.
        this.addCatalogTileToGroup = function (sCatalogTileId, sGroupId, oCatalogData) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Bookmark.addCatalogTileToGroup", {
                    "sCatalogTileId": sCatalogTileId,
                    "sGroupId": sGroupId,
                    "oCatalogData": oCatalogData
                });
        };

        //countBookmarks(sUrl) : object - jQuery.Deferred object's promise
        //Counts all bookmarks pointing to the given URL from all of the user's pages
        this.countBookmarks = function (sUrl) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Bookmark.countBookmarks", {
                    "sUrl": sUrl
                });
        };

        //deleteBookmarks(sUrl) : object - jQuery.Deferred object's promise
        //Deletes all bookmarks pointing to the given URL from all of the user's pages.
        this.deleteBookmarks = function (sUrl) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Bookmark.deleteBookmarks", {
                    "sUrl": sUrl
                });
        };

        //updateBookmarks(sUrl, oParameters) : object - jQuery.Deferred object's promise
        //Updates all bookmarks pointing to the given URL on all of the user's pages with the given new parameters.
        this.updateBookmarks = function (sUrl, oParameters) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.Bookmark.updateBookmarks", {
                    "sUrl": sUrl,
                    "oParameters": oParameters
                });
        };

    }

    BookmarkProxy.prototype = Object.create(Bookmark.prototype);
    BookmarkProxy.hasNoAdapter = Bookmark.hasNoAdapter;

    return BookmarkProxy;
}, true);
