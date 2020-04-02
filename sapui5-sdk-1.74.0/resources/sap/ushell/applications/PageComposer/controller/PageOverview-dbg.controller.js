// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview Controller of the PageOverview fragment.
 */
sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    BaseController,
    MessageToast,
    JSONModel,
    Filter,
    FilterOperator
) {
    "use strict";

    /**
     * @typedef {object} ButtonStateModel The model for the button states (e.g. delete button)
     * @property {boolean} isDeleteAndCopyEnabled Whether the delete and copy buttons are enabled
     */

    return BaseController.extend("sap.ushell.applications.PageComposer.controller.Main", {
        aPropertiesToFilter: [ // used for the SearchField in the headerToolbar
            "id",
            "title",
            "description",
            "createdByFullname",
            "modifiedByFullname",
            "BusinessRoleId",
            "BusinessRole"
        ],
        oDialogFactory: null,

        /**
         * Called when controller is initialized.
         *
         * @private
         */
        onInit: function () {
            this.setModel(new JSONModel({
                busy: false,
                pages: [],
                transportSupported: this.getOwnerComponent().isTransportSupported()
            }));
            this.getRouter().getRoute("overview").attachPatternMatched(this._onPageOverviewMatched, this);
            this.setModel(this._createInitialButtonStateModel(), "buttonStates");
        },

        /**
         * Called if a list item in the pageOverview table is pressed.
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
         */
        onItemPress: function (oEvent) {
            var oPage = oEvent.getParameter("listItem").getBindingContext().getObject();
            this._navigateToDetail(oPage.content.id);
        },

        /**
         * Called if the route is entered. Refreshes the model.
         *
         * @private
         */
        _onPageOverviewMatched: function () {
            this._refreshModel();
        },

        /**
         * Navigates to the page edit page.
         *
         * @param {string} pageId The pageId to navigate to
         *
         * @private
         */
        _navigateToEdit: function (pageId) {
            this.getRouter().navTo("edit", {
                pageId: encodeURIComponent(pageId)
            });
        },

        /**
         * Navigates to the page detail page
         *
         * @param {string} pageId The page ID to navigate to
         *
         * @private
         */
        _navigateToDetail: function (pageId) {
            this.getRouter().navTo("view", {
                pageId: encodeURIComponent(pageId)
            });
        },

        /**
         * Called if a list item in the pageOverview table is selected
         * Sets the state of the Delete button and Copy button to enabled.
         *
         * @param {sap.ui.base.Event} oEvent The select event
         *
         * @private
         */
        onSelectionChange: function (oEvent) {
            this._setDeleteAndCopyButtonEnabled(true);
        },

        /**
         * Called if the edit button in the pageOverview table is pressed
         * Sets the config values and navigates to the dashboard
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
         */
        onEdit: function (oEvent) {
            var oPage = oEvent.getSource().getBindingContext().getObject();
            this._navigateToEdit(oPage.content.id);
        },

        /**
         * Called if the add button is clicked
         * Creates and saves (!) a new page, then sets the config values and navigates to the dashboard
         *
         * @private
         */
        onAdd: function () {
            var oResourceBundle = this.getResourceBundle();
            this.showCreateDialog(function (pageInfo) {
                sap.ushell.Container.getServiceAsync("PageReferencing")
                    .then(function (PageReferencing) {
                        return PageReferencing.createReferencePage(pageInfo, []);
                    })
                    .then(function (oReferencePage) {
                        return this.getPageRepository().createPage(oReferencePage);
                    }.bind(this))
                    .then(function () {
                        this._navigateToDetail(pageInfo.content.id);
                        MessageToast.show(oResourceBundle.getText("Message.PageCreated"), {
                            closeOnBrowserNavigation: false
                        });
                    }.bind(this))
                    .catch(this.handleBackendError.bind(this));
            }.bind(this));
        },

        /**
         * Called if the delete dialog is confirmed
         * Deletes the selected page and refreshes the model to display the change in the pageOverview table
         *
         * @param {sap.ui.base.Event} oEvent The press event
         * @returns {Promise<void>} The delete promise
         *
         * @private
         */
        _deletePage: function (oEvent) {
            var oResourceBundle = this.getResourceBundle();
            var oDialog = oEvent.getSource().getParent();
            var sTransportId = oEvent.metadata && oEvent.metadata.transportId || "";
            var oTable = this.byId("table");
            var aItemsToDelete = oTable.getSelectedItems().map(function (item) {
                return item.getBindingContext().getObject();
            });
            var sSuccessMsg = oResourceBundle.getText("Message.SuccessDeletePage");

            var aDeletePromises = aItemsToDelete.map(function (oItemToDelete) {
                return this.getPageRepository().deletePage(oItemToDelete.content.id, sTransportId);
            }.bind(this));

            return Promise.all(aDeletePromises)
                .then(function () {
                    return this._refreshModel();
                }.bind(this))
                .then(function () {
                    oTable.removeSelections();
                    this._setDeleteAndCopyButtonEnabled(false);
                    oTable.fireSelectionChange();
                    MessageToast.show(sSuccessMsg, {
                        closeOnBrowserNavigation: false
                    });
                    oDialog.close();
                }.bind(this))
                .catch(this.handleBackendError.bind(this));
        },

        /**
         * Called if the delete button is clicked
         * Displays the delete dialog with the pages to delete
         * on confirmation deletes the pages
         * on cancel closes the dialog
         *
         * @private
         */
        onDelete: function () {
            var oTable = this.byId("table");
            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {
                return;
            }

            this.checkShowDeleteDialog(
                oSelectedItem.getBindingContext().getObject(),
                this._deletePage.bind(this)
            );
        },

        /**
         * Called if the copy button is clicked.
         * Calls the copy dialog with the page to copy and navigates to the dashboard.
         *
         * @private
         */
        onCopy: function () {
            var oTable = this.byId("table");
            var oSelectedItem = oTable.getSelectedItem();
            var oResourceBundle = this.getResourceBundle();

            if (!oSelectedItem) {
                return;
            }

            var oPage = oSelectedItem.getBindingContext().getObject();
            this.showCopyDialog(oPage, function (pageInfo) {
                this.pageInfo = pageInfo;

                sap.ushell.Container.getServiceAsync("PageReferencing")
                    .then(function (PageReferencing) {
                        return PageReferencing.createReferencePage(pageInfo, []);
                    })
                    .then(function (oReferencePage) {
                        return this.getPageRepository().copyPage(oReferencePage);
                    }.bind(this))
                    .then(function () {
                        return this._refreshModel();
                    }.bind(this))
                    .then(function (/*oResolvedResult*/) {
                        this._navigateToDetail(this.pageInfo.content.targetId);
                        MessageToast.show(oResourceBundle.getText("Message.PageCreated"), {
                            closeOnBrowserNavigation: false
                        });
                    }.bind(this))
                    .catch(this.handleBackendError.bind(this));
            }.bind(this));
        },

        /**
         * Filters the Table
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
         */
        onSearch: function (oEvent) {
            var oTable = this.byId("table");
            var oBinding = oTable.getBinding("items");
            var oResourceBundle = this.getResourceBundle();
            var sSearchValue = oEvent.getSource().getValue();
            var aFilters = this.aPropertiesToFilter.map(
                function (sPropertyToFilter) {
                    return new Filter({
                        path: "content/" + sPropertyToFilter,
                        operator: FilterOperator.Contains,
                        value1: sSearchValue
                    });
                }
            );
            this.oSearchFilter = new Filter({
                filters: aFilters,
                and: false
            });

            this._applyCombinedFilters();

            if (oBinding.getLength() === 0) { // Adjust empty table message in case all pages are filtered out.
                if (sSearchValue) {
                    oTable.setNoDataText(oResourceBundle.getText("Message.NoPagesFound"));
                } else {
                    oTable.setNoDataText(oResourceBundle.getText("Message.NoPages"));
                }
            }
        },

        /**
         * Loads available pages and sets the model
         *
         * @returns {Promise<void>} Promise that resolves when the pages have been loaded
         *
         * @private
         */
        _refreshModel: function () {
            this.getModel().setProperty("/busy", true);
            return this._loadAvailablePages().then(function (pages) {
                this.getModel().setSizeLimit(pages.pages.length);
                this.getModel().setProperty("/pages", pages.pages);
                this.getModel().setProperty("/busy", false);
            }.bind(this), function (sErrorMsg) {
                this.getModel().setProperty("/busy", false);
                this.showMessageBoxError(sErrorMsg);
            }.bind(this));
        },

        /**
         * Called when table was updated, for example, filter items via search
         *
         * @private
         */
        onTableUpdate: function () {
            var oTable = this.byId("table");
            // if filter hides selected item,
            // we need to reset copy button and delete button and selected item
            if (oTable.getSelectedItems().length === 0) {
                // true -> remove all selections (also hidden by filter)
                oTable.removeSelections(true);
                this._setDeleteAndCopyButtonEnabled(false);
            }
        },

        /**
         * Load available pages from the page persistence
         *
         * @returns {Promise<{pages: array}>} A promise which contains an object with the pages
         *
         * @private
         */
        _loadAvailablePages: function () {
            return this.getPageRepository().getPages().then(function (aPages) {
                return { pages: aPages };
            });
        },

        /**
         * Creates the model for the state of the delete button
         *
         * @returns {ButtonStateModel} The Model for storing the button
         *
         * @private
         */
        _createInitialButtonStateModel: function () {
            return new JSONModel({
                isDeleteAndCopyEnabled: false
            });
        },

        /**
         * Changes the state model of the delete and copy button.
         *
         * @param {boolean} bEnabled Whether the delete and copy buttons should be enabled.
         *
         * @private
         */
        _setDeleteAndCopyButtonEnabled: function (bEnabled) {
            this.getView().getModel("buttonStates").setProperty("/isDeleteAndCopyEnabled", bEnabled);
        },

        /**
         * Called when the error message is clicked to display more detailed error message.
         * @param {sap.ui.base.Event} oEvent The press event
         * @private
         */
        onErrorMessageClicked: function (oEvent) {
            var oSelectedObject = oEvent.getSource().getBindingContext().getObject();
            var oFilteredErrorMsgByPageId = this.onfilterErrorMessages(oSelectedObject.content.id);
            if (oFilteredErrorMsgByPageId.length) {
                this.showMessageBoxWarning("Page "+ oSelectedObject.content.id +" : " + oFilteredErrorMsgByPageId[0].message, false);
            }
        },

        /**
         * Returns an array of all different values of a given property name from a given array of pages.
         *
         * @param {object[]} aPages Array of pages.
         * @param {string} sPropertyName Name of the property.
         * @param {boolean} bMetadata If the property is in the metadata instead of the content.
         * @returns {string[]} an array of all different values
         *
         * @private
         */
        _removeDuplicates: function (aPages, sPropertyName, bMetadata) {
            var mKeys = {},
                aKeys = [];

            aPages.forEach(function (oPage) {
                var oObject = bMetadata ? oPage.metadata : oPage.content,
                    sName = oObject[sPropertyName];

                if (!mKeys[sName]) {
                    mKeys[sName] = true;
                    aKeys.push({ key: sName });
                }
            });

            return aKeys;
        },

        /**
         * Opens and creates the ViewSettingsDialog
         *
         * @param {string} sName The name of the tab to be displayed.
         *
         * @private
         */
        showViewSettingsDialog: function (sName) {
            if (this._oViewSettingsDialog) {
                this._oViewSettingsDialog.open(sName);
                return;
            }

            sap.ui.require([
                "sap/ui/core/Fragment",
                "sap/ui/Device",
                "sap/ushell/applications/PageComposer/controller/ViewSettingsDialog.controller"
            ], function (Fragment, Device, ViewSettingsDialogController) {
                Fragment.load({
                    name: "sap.ushell.applications.PageComposer.view.ViewSettingsDialog",
                    type: "XML",
                    controller: new ViewSettingsDialogController(this)
                }).then(function (oFragment) {
                    this._oViewSettingsDialog = oFragment;

                    if (Device.system.desktop) {
                        oFragment.addStyleClass("sapUiSizeCompact");
                    }

                    var aPages = this.getModel().getProperty("/pages");
                    oFragment.setModel(new JSONModel({
                        editAllowed: this._removeDuplicates(aPages, "editAllowed"),
                        devclass: this._removeDuplicates(aPages, "devclass", true),
                        transportId: this._removeDuplicates(aPages, "transportId", true),
                        createdByFullname: this._removeDuplicates(aPages, "createdByFullname"),
                        modifiedByFullname: this._removeDuplicates(aPages, "modifiedByFullname")
                    }), "uniqueValues");

                    this.getView().addDependent(oFragment);
                    oFragment.open(sName);
                }.bind(this));
            }.bind(this));
        },

        /**
         * Combines the filters from the viewSettingsDialog and the filters from the search
         * and applies them together.
         *
         * @private
         */
        _applyCombinedFilters: function () {
            var aFilters = this.aViewSettingsFilters || [],
                oTable = this.byId("table"),
                oBinding = oTable.getBinding("items");

            if (this.oSearchFilter) {
                aFilters = aFilters.concat(this.oSearchFilter);
            }

            // apply filter settings
            oBinding.filter(new Filter({
                filters: aFilters,
                and: true
            }));
        }
    });
});
