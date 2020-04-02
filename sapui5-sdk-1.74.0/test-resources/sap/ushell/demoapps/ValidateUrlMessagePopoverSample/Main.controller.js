// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

(function () {
    "use strict";

    var oMessageTemplate = new sap.m.MessagePopoverItem({
        type: '{type}',
        title: '{title}',
        description: '{description}',
        markupDescription: '{markupDescription}'
    });

    var oMessagePopover1 = new sap.m.MessagePopover({
        items: {
            path: '/',
            template: oMessageTemplate
        }
    });

    var oMessagePopover2 = new sap.m.MessagePopover({
        items: {
            path: '/',
            template: oMessageTemplate
        }
    });

    var oMessagePopover3 = new sap.m.MessagePopover({
        items: {
            path: '/',
            template: oMessageTemplate
        },
        initiallyExpanded: false
    });

    sap.ui.controller("sap.ushell.demo.ValidateUrlMessagePopoverSample.Main", {
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf Main
         */
        onInit: function () {
            var aMockMessages = [{
                type: 'Information',
                title: 'Visiting an external web site',
                description: "You can find cool search results at <a href='http://www.google.de'>Google</a>.",
                markupDescription: true
            }, {
                type: 'Error',
                title: 'Reading books is not yet introduced',
                description: "You are not allowed to read interesting books at <a href='#Buecher-lesen'>#Buecher-lesen</a>.",
                markupDescription: true
            }, {
                type: 'Information',
                title: 'Going to another SAP application',
                description: "Let's navigate to another sample application: <a href='#Action-toappstatesample'>Appstate Sample Application</a>.",
                markupDescription: true
            }];

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(aMockMessages);

            var viewModel = new sap.ui.model.json.JSONModel()
            viewModel.setData({
                messagesLength: aMockMessages.length + ''
            });

            this.getView().setModel(viewModel);

            oMessagePopover1.setModel(oModel);
            oMessagePopover2.setModel(oModel);
            oMessagePopover3.setModel(oModel);
        },

        handleMessagePopoverPress1: function (oEvent) {
            oMessagePopover1.openBy(oEvent.getSource());
        },

        handleMessagePopoverPress2: function (oEvent) {
            oMessagePopover2.openBy(oEvent.getSource());
        },

        handleMessagePopoverPress3: function (oEvent) {
            oMessagePopover3.openBy(oEvent.getSource());
        }
    });
}());
