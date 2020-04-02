// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/playground/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/NotificationListGroup",
    "sap/m/NotificationListItem",
    "sap/m/MessageToast",
    "sap/ui/core/Priority"
], function (
    BaseController,
    JSONModel,
    NotificationListGroup,
    NotificationListItem,
    MessageToast,
    Priority
) {
    "use strict";

    return BaseController.extend("sap.ushell.playground.controller.NotificationListItem", {
        onInit: function () {
            var oModel = new JSONModel({
                title: "Test Title",
                showCloseButton: false,
                busy: false,
                visible: true,
                datetime: "1 hour",
                authorName: "Jane Doe",
                priorities: Object.keys(Priority).map(function (key) {
                    return {
                        Key: key,
                        Name: key
                    };
                }),
                priority: Priority.None,
                authorPictures: [{
                    "Key": "",
                    "Name": "None"
                }, {
                    "Key": "sap-icon://world",
                    "Name": "World"
                }, {
                    "Key": "sap-icon://delete",
                    "Name": "Delete"
                }, {
                    "Key": "sap-icon://email",
                    "Name": "Email"
                }],
                authorPicture: "sap-icon://world",
                truncate: false,
                description: "Test Description"
            });

            this.getView().setModel(oModel);
        }
    });
});