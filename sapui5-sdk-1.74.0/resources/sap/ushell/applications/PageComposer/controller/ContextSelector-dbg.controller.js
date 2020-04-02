// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "./BaseDialog.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    JSONModel,
    BaseDialogController,
    Filter,
    FilterOperator
) {
    "use strict";

    var oList,
        oResourceBundle;

    return BaseDialogController.extend("sap.ushell.applications.PageComposer.controller.ContextSelector", {
        constructor: function (oView, oResources) {
            this._oView = oView;
            this.sViewId = "contextSelector";
            this.sId = "sap.ushell.applications.PageComposer.view.ContextSelector";
            oResourceBundle = oResources;
        },

        /**
         * Called when search for roles is executed.
         *
         * @param {sap.ui.base.Event} event The search event.
         */
        onSearch: function (event) {
            var oBinding = oList.getBinding("items");
            var sSearchValue = event.getSource().getValue() || "";

            oBinding.filter([
                new Filter([
                    new Filter("name", FilterOperator.Contains, sSearchValue),
                    new Filter("title", FilterOperator.Contains, sSearchValue)
                ], false)
            ]);

            if (oBinding.getLength() === 0) {
                if (sSearchValue) {
                    oList.setNoDataText(oResourceBundle.getText("Message.NoRolesFound"));
                } else {
                    oList.setNoDataText(oResourceBundle.getText("Message.NoRoles"));
                }
            }
        },

        /**
         * Called when the selection in the ContextSelector is changed.
         * It takes care of the validation of the ContextSelector and opens an error message if required.
         *
         * @private
         */
        onSelectionChange: function () {
            var aSelectedItems = oList.getSelectedContexts(true);
            this._oModel.setProperty("/validRoleSelection", aSelectedItems && !!aSelectedItems.length);
        },

        /**
         * Called when the "Select" button is clicked. Closes the dialog and writes the selection to a model.
         *
         * @private
         */
        onConfirm: function () {
            this._writeSelectionToModel();
            this._oView.byId(this.sViewId).close();
            var aSelectedRoles = this._oModel.getProperty("/selectedRoles");
            var aAvailableRoles = this._oModel.getProperty("/availableRoles");
            var aAvailableVisualizations = this._oModel.getProperty("/availableVisualizations");
            var oRoles = {
                selected: aSelectedRoles,
                allSelected: aSelectedRoles.length === aAvailableRoles.length,
                availableVisualizations: aAvailableVisualizations
            };
            if (this._fnConfirm) {
                this._fnConfirm(oRoles);
            }
        },

        /**
         * Called before the contextSelector opens.
         * Creates the validation model, defines variables for the list and registers fragment to message manager.
         *
         * @private
         */
        onBeforeOpen: function () {
            oList = this._oView.byId("contextSelectorList");
            this._setPreSelection();
            var oFragment = this._oView.byId("contextSelector");
            sap.ui.getCore().getMessageManager().registerObject(oFragment, true);
        },


        /**
         * Reads the selected roles from the list, writes the corresponding role IDs to a model,
         * stores an array of all available visualisations for the selected role context.
         *
         * @private
         */
        _writeSelectionToModel: function () {
            var aSelectedRoleIds = [];
            var aAvailableVisualisations = [];
            var aSelectedContexts = oList.getSelectedContexts(true);
            aSelectedContexts.forEach(function (context) {
                aSelectedRoleIds.push(context.getObject().name);
                context.getObject().catalogs.results.forEach(function (catalog) {
                    catalog.visualizations.results.forEach(function (visualization) {
                        aAvailableVisualisations.push(visualization.vizId);
                    });
                });
            });
            this._oModel.setProperty("/selectedRoles", aSelectedRoleIds);
            this._oModel.setProperty("/availableVisualizations", aAvailableVisualisations);
        },

        /**
         * Called before opening the dialog to pre-select roles.
         * If the RoleSelector was opened the first time, all roles should be selected. Otherwise the previous selection
         * should persist and be displayed accordingly.
         *
         * @private
         */
        _setPreSelection: function () {
            var aSelectedRoles = this._oModel.getProperty("/selectedRoles");
            if (!aSelectedRoles.length) {
                oList.selectAll();
            } else {
                oList.getItems().forEach(function (item) {
                   aSelectedRoles.forEach(function (selectedRole) {
                       if (item.getTitle() === selectedRole) {
                           item.setSelected(true);
                       }
                   });
                });
            }
            this._oModel.setProperty("/validRoleSelection", !!oList.getSelectedItems().length);
        },
        /**
         * @typedef {object} RoleObject Object expanded from the oData model containing role information.
         * @property {string} title Title of the role.
         * @property {string} name Name, i.e. the ID of the role.
         * @property {object} catalogs A deferred object to the page catalogs.
         * @property {object} __metadata The metadata for this role object.
         */
        /**
         * Loads the model containing the role context and validation.
         *
         * @param {RoleObject[]} aRoles An array of role objects
         * @param {string[]} [aSelectedRoles] An array IDs of selected roles
         *
         * @private
         */
        initRoles: function (aRoles, aSelectedRoles) {
            this._oModel = new JSONModel({
                availableRoles: aRoles,
                selectedRoles: aSelectedRoles || [],
                availableVisualizations: [],
                validRoleSelection: true,
                rolesAvailable: !!aRoles.length
            });
        }
    });
});
