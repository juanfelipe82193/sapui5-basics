// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/base/Log",
    "sap/base/strings/formatMessage"
], function (
    BaseController,
    JSONModel,
    MessageToast,
    Log,
    formatMessage
) {
    "use strict";
    return BaseController.extend("sap.ushell.applications.SpaceDesigner.controller.SpaceDetail", {
        /**
         * Called when controller is initialized.
         *
         * @private
         */
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("view").attachPatternMatched(this._onPageMatched, this);
            this.setModel(new JSONModel({
                space: {},
                editMode: false,
                transportSupported: this.getOwnerComponent().isTransportSupported()
            }));

            this.getView().addEventDelegate({
                onBeforeHide: this.onRouteLeave.bind(this)
            });
        },

        /**
         * Called when space detail view is exited.
         *
         * @private
         */
        onExit: function () {
            this.space.exit();
        },

        formatMessage: formatMessage,

        /**
         * Called if the route matched the pattern for viewing a space.
         * Loads the space with the id given in the URL parameter
         *
         * @param {sap.ui.base.Event} event The routing event
         *
         * @private
         */
        _onPageMatched: function (event) {
            var oArguments = event.getParameter("arguments");
            var sSpaceId = oArguments.spaceId;
            var sRole = this.getOwnerComponent().getRole();
            this.getModel().setProperty("/space", {});
            this.getView().setBusy(true);

            Log.info("The space with id " + sSpaceId + " was opened in view mode scoped by the following role", sRole);

            this._loadSpace(decodeURIComponent(sSpaceId)).then(function (oSpace) {
                this.getModel().setProperty("/space", oSpace);

            }.bind(this)).catch(function () {
                this.navigateToErrorPage(sSpaceId);
            }.bind(this)).finally(function () {
                this.getView().setBusy(false);
            }.bind(this));
        },

        /**
         * Loads the page with the given pageId from the PagePersistence.
         *
         * @param {string} spaceId The pageId to load
         * @returns {Promise<object>} A promise resolving to the page
         *
         * @private
         */
        _loadSpace: function (spaceId) {
            return Promise.all([
                this.getSpaceRepository().getSpace(spaceId)
            ]).then(function (promiseResults) {
                this.getModel().updateBindings(true);
                return promiseResults[1];
            }.bind(this));
        },

        /**
         * Navigates to the space detail page
         *
         * @param {string} spaceId The pageId to navigate to
         *
         * @private
         */
        _navigateToEdit: function (spaceId) {

        },

        /**
         * Called if the delete action has been confirmed
         *
         * @param {sap.ui.base.Event} oEvent The deleteSpace event
         * @returns {Promise<void>} A promise resolving when the space has been deleted
         *
         * @private
         */
        _deleteSpace: function (oEvent) {
            var oDialog = oEvent.getSource().getParent();
            var sTransportId = oEvent.metadata && oEvent.metadata.transportId || "";
            var sSpaceToDeleteId = this.getModel().getProperty("/space/content/id");
            var sSuccessMsg = this.getResourceBundle().getText("Message.SuccessDeletePage");

            return this.getSpaceRepository().deleteSpace(sSpaceToDeleteId, sTransportId)
                .then(function () {
                    this.navigateToPageOverview();
                    MessageToast.show(sSuccessMsg, {
                        closeOnBrowserNavigation: false
                    });
                    oDialog.close();
                }.bind(this))
                .catch(this.handleBackendError.bind(this));
        },

        /**
         * Called if the Edit button is clicked.
         * Loads the edit route
         *
         * @private
         */
        onEdit: function () {
            this._navigateToEdit(this.getModel().getProperty("/page/content/id"));
        },

        /**
         * Called if the delete button is clicked
         * Shows the Delete Dialog
         *
         * @private
         */
        onDelete: function () {
            var oSpace = this.getModel().getProperty("/space");
            this.checkShowDeleteDialog(oSpace, this._deleteSpace.bind(this));
        },

        /**
         * Called if the copy button is clicked
         * Copies the page and redirects to the new copy
         *
         * @private
         */
        onCopy: function () {
            var oPage = this.getModel().getProperty("/page");
            this.showCopyDialog(oPage, function (pageInfo) {
                sap.ushell.Container.getServiceAsync("PageReferencing")
                    .then(function (PageReferencing) {
                        return PageReferencing.createReferencePage(pageInfo, []);
                    })
                    .then(function (oReferencePage) {
                        return this.getPageRepository().copyPage(oReferencePage);
                    }.bind(this))
                    .then(function () {
                        this._navigateToEdit(pageInfo.content.targetId);
                        MessageToast.show(this.getResourceBundle().getText("Message.PageCreated"), {
                            closeOnBrowserNavigation: false
                        });
                    }.bind(this))
                    .catch(this.handleBackendError.bind(this));
            }.bind(this));
        }
    });
});
