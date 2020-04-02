// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/events/PseudoEvents"
], function (
    Controller,
    coreLibrary,
    Filter,
    FilterOperator,
    JSONModel,
    Config,
    ODataModel,
    PseudoEvents
) {
    "use strict";

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    return Controller.extend("sap.ushell_abap.transport.controller.TransportInformation", {
        fnChangeHandler: null,

        onInit: function () {
            // TODO: this is a workaround for problems related to input suggestions
            // problem #1: suggestions autocompleting is not considered even though input value does change
            // problem #2: "liveChange" does not fire when navigating through suggestions via keyboard even though input value does change
            (function () {
                var oPackageInput = this.getView().byId("packageInput"),
                    _suggestionsLiveChangeWorkaround = function (oEvent) {
                        if (oPackageInput._isSuggestionsPopoverOpen() || oEvent.type === PseudoEvents.events.sapescape.sName) {
                            this._handlePackageSuggestion();
                            this.validate();
                        }
                    }.bind(this);
                oPackageInput._oSuggestionPopup.attachAfterOpen(function () { // problem #1
                    if (oPackageInput.getValue() !== oPackageInput.getModel().getProperty("/package")) {
                        this._handlePackageSuggestion();
                        this.validate();
                    }
                }.bind(this));
                oPackageInput.addEventDelegate({ // problem #2
                    onsapup: _suggestionsLiveChangeWorkaround,
                    onsapdown: _suggestionsLiveChangeWorkaround,
                    onsaphome: _suggestionsLiveChangeWorkaround,
                    onsapend: _suggestionsLiveChangeWorkaround,
                    onsappageup: _suggestionsLiveChangeWorkaround,
                    onsappagedown: _suggestionsLiveChangeWorkaround,
                    onsapescape: _suggestionsLiveChangeWorkaround
                });
            }.bind(this))();
        },

        /**
         * If there is a package passed, set the package field to read-only and show the suggestions for the workbench select.
         */
        onAfterRendering: function () {
            var oComponentData = this.getOwnerComponent().getComponentData(),
                sPackage = oComponentData ? oComponentData.package : "",
                oModel = this.getView().getModel();
            if (sPackage) {
                this._filterTransport(sPackage);
                oModel.setProperty("/package", sPackage);
                oModel.setProperty("/workbenchRequired", true);
                oModel.setProperty("/packageInputReadOnly", true);
            }
        },

        /**
         * Checks if the given values are valid.
         *
         * @param {string} sWorkbenchRequest The value of the WorkbenchRequest input.
         * @param {string} sPackage The value of the Package input.
         * @param {boolean} bIsWorkbenchRequired Whether the package requires a transport.
         * @returns {boolean} The result.
         * @private
         */
        _checkModelValidity: function (sWorkbenchRequest, sPackage, bIsWorkbenchRequired) {
            return (sPackage.length > 0) && (!bIsWorkbenchRequired || sWorkbenchRequest.length > 0);
        },

        _handlePackageSuggestion: function (bCorrectCasing) {
            var oPackageInput = this.getView().byId("packageInput"),
                sPackageInputValue = oPackageInput.getValue(),
                oPackageInputModel = oPackageInput.getModel(),
                oPackageSuggestion = oPackageInput.getBinding("suggestionItems").getModel().getProperty(
                    "/packageSet('" + encodeURIComponent(sPackageInputValue.toUpperCase()) + "')/"
                );
            if (oPackageSuggestion) {
                if (bCorrectCasing) {
                    oPackageInputModel.setProperty("/package", oPackageSuggestion.devclass);
                }
                oPackageInputModel.setProperty("/workbenchRequired", oPackageSuggestion.transportRequired);
                this._filterTransport(oPackageSuggestion.devclass);
            } else {
                oPackageInputModel.setProperty("/workbenchRequired", !!sPackageInputValue.length);
            }
        },

        /**
         * Called when the package input field is changed.
         * Sets the current package input text as a suggestion filter, which triggers an OData request.
         *
         * @param {sap.ui.base.Event} oEvent The suggest event.
         * @private
         */
        onPackageLiveChange: function (oEvent) {
            var sNewValue = oEvent.getParameters().value,
                oPackageInput = this.getView().byId("packageInput"),
                oPackageInputModel = oPackageInput.getModel();
            oPackageInputModel.setProperty("/workbenchRequest", "");
            oPackageInput.getBinding("suggestionItems").filter(
                new Filter("devclass", FilterOperator.StartsWith, sNewValue.toUpperCase())
            );
            oPackageInput.setValueState(sNewValue.length ? ValueState.None : ValueState.Error);
            this._handlePackageSuggestion();
            this.validate();
        },

        /**
         * Called when the package or the workbench input fields are changed to validate them. If the package was changed,
         * verifies if the new package is among the suggestions received from the OData service and handles the package change.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         */
        onChange: function (oEvent) {
            var oPackageInput = this.getView().byId("packageInput");
            if (oEvent.getSource() === oPackageInput) {
                this._handlePackageSuggestion(true);
            }
            this.validate();
        },

        /**
         * Filters the workbench selection items according to the given devclass.
         *
         * @param {string} sSelectedPackageDevClass The devclass.
         * @private
         */
        _filterTransport: function (sSelectedPackageDevClass) {
            var aFilters = [new Filter("devclass", FilterOperator.EQ, sSelectedPackageDevClass)],
                oWorkbenchRequestSelect = this.getView().byId("workbenchRequestSelect");
            oWorkbenchRequestSelect.getBinding("items").filter(aFilters);
        },

        /**
         * Validate the input values and call the change handler.
         */
        validate: function () {
            var oPackageInput = this.getView().byId("packageInput"),
                oPackageInputModel = oPackageInput.getModel(),
                sWorkbenchRequestSelectedValue = this.getView().byId("workbenchRequestSelect").getSelectedKey(),
                bIsValid = this._checkModelValidity(
                    sWorkbenchRequestSelectedValue,
                    oPackageInput.getValue(),
                    oPackageInputModel.getProperty("/workbenchRequired")
                );
            this.getOwnerComponent().change(bIsValid);
        },

        /**
         * Attaches the given handler to the change event.
         *
         * @param {function} fnHandler The handler to call on the change event.
         */
        attachChangeEventHandler: function (fnHandler) {
            this.fnChangeHandler = fnHandler;
        }
    });
});
