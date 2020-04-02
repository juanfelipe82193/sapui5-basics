// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "./controller/ErrorDialog",
    "sap/ui/model/json/JSONModel",
    "./util/PagePersistence"
], function (UIComponent, ErrorDialog, JSONModel, PagePersistence) {
    "use strict";

    return UIComponent.extend("sap.ushell.applications.PageComposer.Component", {
        metadata: { "manifest": "json" },
        _role: null,
        _oTransportPromise: null,

        /**
         * Initializes the component
         *
         * @protected
         */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();

            var oComponentData = this.getComponentData();
            var oStartupParams = oComponentData && oComponentData.startupParameters;

            this._handleStartupParams(oStartupParams || {});

            this.getModel("PageRepository").setHeaders({
                "sap-language": sap.ushell.Container.getUser().getLanguage(),
                "sap-client": sap.ushell.Container.getLogonSystem().getClient()
            });

            this.setMetaModelData();

            // set message model
            this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");

        },

        /**
         * Instantiates the page persistence utility and returns the created instance.
         *
         * @returns {sap.ushell.applications.PageComposer.util.PagePersistence} An instance of the page persistence utility.
         * @protected
         */
        getPageRepository: function () {
            if (!this.oPagePersistenceInstance) {
                this.oPagePersistenceInstance = new PagePersistence(
                    this.getModel("PageRepository"),
                    this.getModel("i18n").getResourceBundle(),
                    this.getModel("message")
                );
            }
            return this.oPagePersistenceInstance;
        },

        /**
         * Returns whether there is an entry for transport in the manifest entry sap.ui5/componentUsages
         * @returns {boolean} True if transport is supported / false if not
         */
        isTransportSupported: function () {
            var oManifestEntry = this.getManifestEntry("sap.ui5");
            return !!oManifestEntry.componentUsages &&
                !!oManifestEntry.componentUsages.transportInformation &&
                !!oManifestEntry.componentUsages.transportInformation.componentData &&
                oManifestEntry.componentUsages.transportInformation.componentData.supported;
        },

        /**
         * Saves the role in memory
         *
         * @param {string} role The role to save
         * @private
         */
        _saveRole: function (role) {
            this._sRole = role;
        },

        /**
         * Returns the saved role
         *
         * @returns {string} The role
         */
        getRole: function () {
            return this._sRole;
        },

        /**
         * Handles startup parameters for pageId, roleIds and mode
         * If there is a pageId set, navigate to that pageId in edit|view mode and append the roleIds as query param
         *
         * @param {object} startupParameters The parameters passed as startup params to the application via URL
         *
         * @private
         */
        _handleStartupParams: function (startupParameters) {
            var sPageId = startupParameters.pageId && startupParameters.pageId[0];
            var sRoleId = startupParameters.roleId && startupParameters.roleId[0];
            var sMode = startupParameters.mode && startupParameters.mode[0];

            this._saveRole(sRoleId);

            if (sPageId) {
                sMode = ["edit", "view"].indexOf(sMode) > -1 ? sMode : "view";
                this.getRouter().navTo(sMode, { pageId: encodeURIComponent(sPageId) }, true);
            }
        },

        /**
         * Shows an error dialog
         *
         * @param {object} oError The error object
         * @protected
         */
        showErrorDialog: function (oError) {
            ErrorDialog.open(oError, this.getModel("i18n"));
        },

        /**
         * Get the component defined in the metadata "componentUsages" property
         *
         * @param {string} [pagePackage] The page package name
         * @returns {Promise<sap.ui.core.Component>} Promise resolving to the component instance or void if
         * no component is declared
         * Rejected if transport is not supported
         * @protected
         */
        createTransportComponent: function (pagePackage) {
            if (this.isTransportSupported()) {
                if (!this._oTransportPromise) {
                    this._oTransportPromise = this.createComponent({
                        async: true,
                        usage: "transportInformation"
                    });
                }

                return this._oTransportPromise.then(function (transportComponent) {
                    transportComponent.reset({
                        "package": pagePackage
                    });
                    return transportComponent;
                });
            }

            return Promise.reject();
        },

        /**
         * set the function import information from metadata to a global model
         *
         * @protected
         */
        setMetaModelData: function () {
            this.getModel("PageRepository").getMetaModel().loaded().then(function () {
                var oMetaModel = this.getModel("PageRepository").getMetaModel();
                var oMetaModelData = {
                    copySupported: !!oMetaModel.getODataFunctionImport("copyPage"),
                    deleteSupported: !!oMetaModel.getODataFunctionImport("deletePage"),
                    createSupported: this.getMetadata().getConfig().enableCreate,
                    previewSupported: this.getMetadata().getConfig().enablePreview
                };
                this.setModel(new JSONModel(oMetaModelData), "SupportedOperationModel");
            }.bind(this));
        }
    });
});
