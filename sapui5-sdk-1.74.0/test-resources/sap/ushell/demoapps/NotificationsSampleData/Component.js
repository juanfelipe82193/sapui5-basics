// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
(function () {
    "use strict";

    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.demo.NotificationsSampleData.Component");
    jQuery.sap.require("sap.ui.core.Component");

    // new Component
    sap.ui.core.Component.extend("sap.ushell.demo.NotificationsSampleData.Component", {

        metadata: {
            version: "1.74.0",
            library: "sap.ushell.demo.NotificationsSampleData"
        },
        escapeRegExp: function (str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }
        ,
        init: function () {
            //used for mock the request to the server
            var modelPath = "/ushell/test-resources/sap/ushell/demoapps/NotificationsSampleData/model";
            var notificationsPath = modelPath + "/Notifications";
            //used to load static resources from test folder
            var sResourcePath = "../../../../../test-resources/sap/ushell/demoapps/NotificationsSampleData/model";
            jQuery.sap.require('sap.ui.core.util.MockServer');
            var notificationsByDateDesc = jQuery.sap.loadResource({url: sResourcePath + '/NS_Notifications.json'});
            var notificationsByDateAsc = jQuery.sap.loadResource({url: sResourcePath + '/NS_Notifications_Date_Asc.json'});
            var notificationsPriority = jQuery.sap.loadResource({url: sResourcePath + '/NS_Notifications_Priority_Desc.json'});
            var notificationsByType = jQuery.sap.loadResource({url: sResourcePath + '/NS_Notifications_By_Type.json'});
            var notificationsByParentId = jQuery.sap.loadResource({url: sResourcePath + '/NS_Notifications_By_ParentId.json'});
            var channelEmail = jQuery.sap.loadResource({url: sResourcePath + '/NS_Channel_Email.json'});
            var channelSMP = jQuery.sap.loadResource({url: sResourcePath + '/NS_Channel_SMP.json'});
            var notificationTypePersonalizationSet = jQuery.sap.loadResource({url: sResourcePath + '/NS_NotificationTypePersonalizationSet.json'});
            var oMockServer = new sap.ui.core.util.MockServer({
                requests: [
                    {
                        method: 'GET',
                        path: new RegExp(this.escapeRegExp(notificationsPath +
                            "?$expand=Actions,NavigationTargetParams&$orderby=CreatedAt%20desc&$filter=IsGroupHeader%20eq%20false") + ".*"),
                        response: function (xhr) {
                            xhr.respondJSON(200, {}, notificationsByDateDesc);
                        }
                    },
                    {
                        method: 'GET',
                        path: new RegExp(this.escapeRegExp(notificationsPath + "?$expand=Actions,NavigationTargetParams&$orderby=CreatedAt%20asc&$filter=IsGroupHeader%20eq%20false") + ".*"),
                        response: function (xhr) {
                            xhr.respondJSON(200, {}, notificationsByDateAsc);
                        }
                    },
                    {
                        method: 'GET',
                        path: new RegExp(this.escapeRegExp(notificationsPath + "?$expand=Actions,NavigationTargetParams&$orderby=Priority%20desc&$filter=IsGroupHeader%20eq%20false") + ".*"),
                        response: function (xhr) {
                            xhr.respondJSON(200, {}, notificationsPriority);
                        }
                    },
                    {
                        method: 'GET',
                        path: new RegExp(this.escapeRegExp(notificationsPath + "?$expand=Actions,NavigationTargetParams&$filter=IsGroupHeader%20eq%20true")),
                        response: function (xhr) {
                            xhr.respondJSON(200, {}, notificationsByType);
                        }
                    },

                    {
                        method: 'GET',
                        path: new RegExp(this.escapeRegExp(notificationsPath +
                            "?$expand=Actions,NavigationTargetParams&$orderby=CreatedAt") +
                            ".*6fd8.*" +
                             ".*"
                        ),
                        response: function (xhr) {
                            xhr.respondJSON(200, {}, notificationsByParentId);
                        }
                    },



                    {
                        method: 'GET',
                        path: new RegExp(modelPath + "/GetBadgeNumber().*"),
                        response: function (xhr) {
                            xhr.respondJSON(200, {}, {d: {GetBadgeNumber: {Number: 10}}});
                        }
                    },
                    {
                        method: 'POST',
                        path: new RegExp(modelPath + "/ResetBadgeNumber.*"),
                        response: function (xhr) {
                            xhr.respondJSON(204, {}, '');
                        }
                    },
                    {
                        method: 'POST',
                        path: new RegExp(modelPath + "/Dismiss.*"),
                        response: function (xhr) {
                            xhr.respondJSON(204, {}, '');
                        }
                    },
                    {
                        method: 'POST',
                        path: new RegExp(modelPath + "/MarkRead.*"),
                        response: function (xhr) {
                            xhr.respondJSON(204, {}, '');
                        }
                    },
                    {
                        method: 'POST',
                        path: new RegExp(modelPath + "/ExecuteAction.*"),
                        response: function (xhr) {
                            xhr.respondJSON(204, {}, '');
                        }
                    },
                    {
                        method: 'GET',
                        path: new RegExp(modelPath + "/Channels\\(ChannelId='SAP_SMP'\\).*"),
                        response: function (xhr) {
                            xhr.respondJSON(200, {}, channelSMP);
                        }
                    },
                    {
                        method: 'GET',
                        path: new RegExp(modelPath + "/Channels\\(ChannelId='SAP_EMAIL'\\).*"),
                        response: function (xhr) {
                            xhr.respondJSON(200, {}, channelEmail);
                        }
                    },
                    {
                        method: 'GET',
                        path: new RegExp(modelPath + "/NotificationTypePersonalizationSet.*"),
                        response: function (xhr) {
                            xhr.respondJSON(200, {}, notificationTypePersonalizationSet);
                        }
                    }
                ]
            });
            oMockServer.start();
            var oSrv = sap.ushell.Container.getService('Notifications');
            oSrv._setWorkingMode();
        }
    });
})();
