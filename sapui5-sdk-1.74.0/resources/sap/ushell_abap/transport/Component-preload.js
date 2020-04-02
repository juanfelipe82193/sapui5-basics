//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell_abap/transport/Component.js":function(){//Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell_abap/transport/util/Transport"
], function (UIComponent, JSONModel, TransportHelper) {
    "use strict";
    return UIComponent.extend("sap.ushell_abap.transport.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.getModel("Transport").setHeaders({
                "sap-language": sap.ushell.Container.getUser().getLanguage(),
                "sap-client": sap.ushell.Container.getLogonSystem().getClient()
            });
        },

        /**
         * Returns the transportHelper utility instance
         *
         * @returns {object} The transportHelper instance
         */
        getTransportHelper: function () {
            if (!this._oTransportHelper) {
                this._oTransportHelper = new TransportHelper(this.getModel("Transport"));
            }
            return this._oTransportHelper;
        },

        changeHandler: function () {},

        /**
         * Registers a function to call on the change event of a mandatory input field
         *
         * @param {function} changeHandler The change handler function
         */
        attachChangeEventHandler: function (changeHandler) {
            this.changeHandler = changeHandler;
        },

        /**
         * Called if the transport input data changes
         * Calls a changeHandler function with the validation result
         *
         * @param {boolean} value The boolean validation result
         */
        change: function (value) {
            if (this.changeHandler) {
                this.changeHandler(value);
            }
        },

        /**
         * Merge the existing componentData object with the given object
         *
         * @param {object} componentData Data to merge into the existing componentData
         */
        _setComponentData: function (componentData) {
            this.oComponentData = Object.assign({}, this.oComponentData, componentData);
        },

        /**
         * Resets the models to initial values
         *
         * @param {object} componentData The componentData to set
         */
        reset: function (componentData) {
            var oView = this.getRootControl();
            this._setComponentData(componentData);
            oView.setModel(this.getModel("Transport"), "PackageModel");
            oView.setModel(new JSONModel({
                packageInputReadOnly: false,
                package: "",
                workbenchRequest: "",
                workbenchRequired: false
            }));
        },

        /**
         * Decorates the result object by adding transport-specific properties
         *
         * @param {object} pageInfo The result object
         * @returns {object} The enhanced object
         */
        decorateResultWithTransportInformation: function (pageInfo) {
            pageInfo = pageInfo || {};

            pageInfo.metadata = {
                devclass: this.getRootControl().getModel().getProperty("/package"),
                transportId: this.getRootControl().getModel().getProperty("/workbenchRequest")
            };

            return pageInfo;
        },

        /**
         * Checks if the transport information needs to be shown
         *
         * @param {object} page The page to check
         * @returns {Promise<boolean>} A promise resolving to the boolean result
         */
        showTransport: function (page) {
            return this.getTransportHelper().checkShowTransport(page);
        },

        /**
         * Checks if the page is locked by another user
         *
         * @param {object} page The page to edit
         * @returns {Promise<boolean|object>} A promise with the transport information or false if the page is not locked
         */
        showLockedMessage: function (page) {
            return this.getTransportHelper().checkShowLocked(page);
        }
    });
});
},
	"sap/ushell_abap/transport/controller/TransportInformation.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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
},
	"sap/ushell_abap/transport/i18n/i18n.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# __ldi.translation.uuid=5d1b55e1-37be-4a78-a41c-0b09de2858d9\n\n#XFLD\nLabel.WorkbenchRequest=Workbench Request\n#XFLD\nLabel.Package=Package\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP transport information\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Component to display and validate the fields relevant for ABAP transport\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Please provide a valid package.\n',
	"sap/ushell_abap/transport/i18n/i18n_ar.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=\\u0637\\u0644\\u0628 \\u0645\\u0646\\u0636\\u062F\\u0629 \\u0627\\u0644\\u0639\\u0645\\u0644\n#XFLD\nLabel.Package=\\u0627\\u0644\\u062D\\u0632\\u0645\\u0629\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=\\u0645\\u0639\\u0644\\u0648\\u0645\\u0627\\u062A \\u0646\\u0642\\u0644 ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=\\u0645\\u0643\\u0648\\u0646 \\u0644\\u0639\\u0631\\u0636 \\u0648\\u0627\\u0644\\u062A\\u062D\\u0642\\u0642 \\u0645\\u0646 \\u0635\\u062D\\u0629 \\u0627\\u0644\\u062D\\u0642\\u0648\\u0644 \\u0630\\u0627\\u062A \\u0627\\u0644\\u0635\\u0644\\u0629 \\u0644\\u0644\\u0646\\u0642\\u0644 ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=\\u064A\\u0631\\u062C\\u0649 \\u062A\\u0642\\u062F\\u064A\\u0645 \\u062D\\u0632\\u0645\\u0629 \\u0635\\u0627\\u0644\\u062D\\u0629.\n',
	"sap/ushell_abap/transport/i18n/i18n_bg.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u0438\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u043D\\u0438 \\u0441\\u0440\\u0435\\u0434\\u0441\\u0442\\u0432\\u0430\n#XFLD\nLabel.Package=\\u041F\\u0430\\u043A\\u0435\\u0442\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F \\u0437\\u0430 ABAP \\u0442\\u0440\\u0430\\u043D\\u0441\\u043F\\u043E\\u0440\\u0442\n#XMSG: Description for the Transport Component\nTransportInformation.Description=\\u041A\\u043E\\u043C\\u043F\\u043E\\u043D\\u0435\\u043D\\u0442 \\u0437\\u0430 \\u043F\\u043E\\u043A\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435 \\u0438 \\u043F\\u0440\\u043E\\u0432\\u0435\\u0440\\u043A\\u0430 \\u043D\\u0430 \\u043F\\u043E\\u043B\\u0435\\u0442\\u0430, \\u0440\\u0435\\u043B\\u0435\\u0432\\u0430\\u043D\\u0442\\u043D\\u0438 \\u0437\\u0430 ABAP \\u0442\\u0440\\u0430\\u043D\\u0441\\u043F\\u043E\\u0440\\u0442\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=\\u041C\\u043E\\u043B\\u044F \\u0434\\u0430 \\u043F\\u0440\\u0435\\u0434\\u043E\\u0441\\u0442\\u0430\\u0432\\u0438\\u0442\\u0435 \\u0432\\u0430\\u043B\\u0438\\u0434\\u0435\\u043D \\u043F\\u0430\\u043A\\u0435\\u0442.\n',
	"sap/ushell_abap/transport/i18n/i18n_ca.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Ordre de workenbch\n#XFLD\nLabel.Package=Paquet\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=Informaci\\u00F3 de transport ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Component per visualitzar i validar els camps rellevants per al transport ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Indiqueu un paquet v\\u00E0lid.\n',
	"sap/ushell_abap/transport/i18n/i18n_cs.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Po\\u017Eadavek na workbench\n#XFLD\nLabel.Package=Paket\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=Informace o transportu ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Komponenta pro zobrazen\\u00ED a ov\\u011B\\u0159en\\u00ED pol\\u00ED relevantn\\u00EDch pro transport ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Zadejte platn\\u00FD paket.\n',
	"sap/ushell_abap/transport/i18n/i18n_da.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Workbench-ordre\n#XFLD\nLabel.Package=Pakke\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP-transportinformationer\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Komponent til at vise og validere de felter, der er relevante for ABAP-transport\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Angiv en gyldig pakke.\n',
	"sap/ushell_abap/transport/i18n/i18n_de.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Workbench-Auftrag\n#XFLD\nLabel.Package=Paket\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP-Transportinformationen\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Komponente f\\u00FCr die Anzeige und Validierung der Felder, die f\\u00FCr den ABAP-Transport relevant sind\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Bitte geben Sie ein g\\u00FCltiges Paket an.\n',
	"sap/ushell_abap/transport/i18n/i18n_el.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=\\u0391\\u03AF\\u03C4\\u03B7\\u03C3\\u03B7 \\u03A0\\u03B5\\u03B4\\u03AF\\u03BF\\u03C5 \\u0395\\u03C1\\u03B3\\u03B1\\u03C3\\u03B9\\u03CE\\u03BD\n#XFLD\nLabel.Package=\\u03A0\\u03B1\\u03BA\\u03AD\\u03C4\\u03BF\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=\\u03A3\\u03C4\\u03BF\\u03B9\\u03C7\\u03B5\\u03AF\\u03B1 \\u039C\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AC\\u03C2 ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=\\u03A3\\u03C5\\u03C3\\u03C4\\u03B1\\u03C4\\u03B9\\u03BA\\u03CC \\u03B3\\u03B9\\u03B1 \\u03C4\\u03B7\\u03BD \\u03B5\\u03BC\\u03C6\\u03AC\\u03BD\\u03B9\\u03C3\\u03B7 \\u03BA\\u03B1\\u03B9 \\u03C4\\u03B7\\u03BD \\u03B5\\u03C0\\u03B1\\u03BB\\u03AE\\u03B8\\u03B5\\u03C5\\u03C3\\u03B7 \\u03C4\\u03C9\\u03BD \\u03C0\\u03B5\\u03B4\\u03AF\\u03C9\\u03BD \\u03C0\\u03BF\\u03C5 \\u03B1\\u03C6\\u03BF\\u03C1\\u03BF\\u03CD\\u03BD \\u03BC\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AC ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=\\u0395\\u03B9\\u03C3\\u03AC\\u03B3\\u03B5\\u03C4\\u03B5 \\u03AD\\u03B3\\u03BA\\u03C5\\u03C1\\u03BF \\u03C0\\u03B1\\u03BA\\u03AD\\u03C4\\u03BF.\n',
	"sap/ushell_abap/transport/i18n/i18n_en.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Workbench Request\n#XFLD\nLabel.Package=Package\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP Transport Information\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Component to display and validate the fields relevant for ABAP transport\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Please provide a valid package.\n',
	"sap/ushell_abap/transport/i18n/i18n_en_US_sappsd.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=[[[\\u0174\\u014F\\u0157\\u0137\\u0183\\u0113\\u014B\\u010B\\u0125 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.Package=[[[\\u01A4\\u0105\\u010B\\u0137\\u0105\\u011F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=[[[\\u0100\\u0181\\u0100\\u01A4 \\u0163\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163 \\u012F\\u014B\\u0192\\u014F\\u0157\\u0271\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG: Description for the Transport Component\nTransportInformation.Description=[[[\\u0108\\u014F\\u0271\\u03C1\\u014F\\u014B\\u0113\\u014B\\u0163 \\u0163\\u014F \\u018C\\u012F\\u015F\\u03C1\\u013A\\u0105\\u0177 \\u0105\\u014B\\u018C \\u028B\\u0105\\u013A\\u012F\\u018C\\u0105\\u0163\\u0113 \\u0163\\u0125\\u0113 \\u0192\\u012F\\u0113\\u013A\\u018C\\u015F \\u0157\\u0113\\u013A\\u0113\\u028B\\u0105\\u014B\\u0163 \\u0192\\u014F\\u0157 \\u0100\\u0181\\u0100\\u01A4 \\u0163\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u03C1\\u0157\\u014F\\u028B\\u012F\\u018C\\u0113 \\u0105 \\u028B\\u0105\\u013A\\u012F\\u018C \\u03C1\\u0105\\u010B\\u0137\\u0105\\u011F\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n',
	"sap/ushell_abap/transport/i18n/i18n_en_US_saptrc.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=1fwv5PLoa8sG7aWKY9X46A_Workbench Request\n#XFLD\nLabel.Package=b98Qz8FUkMVMhNBJN9CRoA_Package\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=yFCWygqFeSE9Xlmp9bXVKw_ABAP transport information\n#XMSG: Description for the Transport Component\nTransportInformation.Description=p/jKreFfqJiWwiNxHuHOiA_Component to display and validate the fields relevant for ABAP transport\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=VhIfITZ7MjwxYkxqAKB6Bw_Please provide a valid package.\n',
	"sap/ushell_abap/transport/i18n/i18n_es.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Orden de Workbench\n#XFLD\nLabel.Package=Paquete\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=Informaci\\u00F3n de transporte ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Componente para mostrar y validar los campos relevantes para el transporte ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Indique un paquete v\\u00E1lido.\n',
	"sap/ushell_abap/transport/i18n/i18n_et.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=T\\u00F6\\u00F6lauataotlus\n#XFLD\nLabel.Package=Pakett\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP-i transporditeave\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Komponent ABAP-i transpordi jaoks n\\u00F5utavate v\\u00E4ljade kuvamiseks ja valideerimiseks\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Sisestage sobiv pakett.\n',
	"sap/ushell_abap/transport/i18n/i18n_fi.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Ty\\u00F6p\\u00F6yt\\u00E4tilaus\n#XFLD\nLabel.Package=Paketti\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP-siirron tiedot\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Komponentti ABAP-siirrolle relevanttien kenttien n\\u00E4ytt\\u00E4mist\\u00E4 ja validointia varten\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Anna kelpaava paketti.\n',
	"sap/ushell_abap/transport/i18n/i18n_fr.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Ordre du Workbench\n#XFLD\nLabel.Package=Package\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP Transport Information\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Composante permettant d\'afficher et de valider les zones concernant ABAP Transport.\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Indiquez un package valide.\n',
	"sap/ushell_abap/transport/i18n/i18n_hi.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=\\u0935\\u0930\\u094D\\u0915\\u092C\\u0947\\u0902\\u091A \\u0905\\u0928\\u0941\\u0930\\u094B\\u0927\n#XFLD\nLabel.Package=\\u092A\\u0948\\u0915\\u0947\\u091C\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP \\u091F\\u094D\\u0930\\u093E\\u0902\\u0938\\u092A\\u094B\\u0930\\u094D\\u091F \\u091C\\u093E\\u0928\\u0915\\u093E\\u0930\\u0940\n#XMSG: Description for the Transport Component\nTransportInformation.Description=ABAP \\u091F\\u094D\\u0930\\u093E\\u0902\\u0938\\u092A\\u094B\\u0930\\u094D\\u091F \\u0915\\u0947 \\u0932\\u093F\\u090F \\u092A\\u094D\\u0930\\u093E\\u0938\\u0902\\u0917\\u093F\\u0915 \\u092B\\u093C\\u0940\\u0932\\u094D\\u0921 \\u092A\\u094D\\u0930\\u0926\\u0930\\u094D\\u0936\\u093F\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092E\\u093E\\u0928\\u094D\\u092F \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0918\\u091F\\u0915\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=\\u0915\\u0943\\u092A\\u092F\\u093E \\u0915\\u094B\\u0908 \\u092E\\u093E\\u0928\\u094D\\u092F \\u092A\\u0948\\u0915\\u0947\\u091C \\u092A\\u094D\\u0930\\u0926\\u093E\\u0928 \\u0915\\u0930\\u0947\\u0902.\n',
	"sap/ushell_abap/transport/i18n/i18n_hr.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Workbench zahtjev\n#XFLD\nLabel.Package=Paket\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=Informacije ABAP transporta\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Komponenta za prikaz i validaciju polja relevantnih za ABAP transport\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Navedite va\\u017Ee\\u0107i paket.\n',
	"sap/ushell_abap/transport/i18n/i18n_hu.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Workbench-k\\u00E9relem\n#XFLD\nLabel.Package=Csomag\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP-transzport adatai\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Komponens az ABAP-transzporttal kapcsolatos mez\\u0151k megjelen\\u00EDt\\u00E9s\\u00E9hez \\u00E9s ellen\\u0151rz\\u00E9s\\u00E9hez\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Adjon meg \\u00E9rv\\u00E9nyes csomagot.\n',
	"sap/ushell_abap/transport/i18n/i18n_it.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Richiesta workbench\n#XFLD\nLabel.Package=Pacchetto\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=Informazioni sul trasporto ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Componente per visualizzare e validare i campi rilevanti per il trasporto ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Fornisci un pacchetto valido.\n',
	"sap/ushell_abap/transport/i18n/i18n_iw.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=\\u05D1\\u05E7\\u05E9\\u05EA Workbench\n#XFLD\nLabel.Package=\\u05D7\\u05D1\\u05D9\\u05DC\\u05D4\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=\\u05DE\\u05D9\\u05D3\\u05E2 \\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8 \\u05E9\\u05DC ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=\\u05E8\\u05DB\\u05D9\\u05D1 \\u05DC\\u05EA\\u05E6\\u05D5\\u05D2\\u05D4 \\u05D5\\u05DC\\u05D1\\u05D3\\u05D9\\u05E7\\u05EA \\u05EA\\u05E7\\u05D9\\u05E0\\u05D5\\u05EA \\u05E9\\u05DC \\u05D4\\u05E9\\u05D3\\u05D5\\u05EA \\u05E9\\u05E8\\u05DC\\u05D5\\u05D5\\u05E0\\u05D8\\u05D9\\u05D9\\u05DD \\u05DC\\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8 \\u05E9\\u05DC ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=\\u05E1\\u05E4\\u05E7 \\u05D7\\u05D1\\u05D9\\u05DC\\u05D4 \\u05D7\\u05D5\\u05E7\\u05D9\\u05EA.\n',
	"sap/ushell_abap/transport/i18n/i18n_ja.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=\\u30EF\\u30FC\\u30AF\\u30D9\\u30F3\\u30C1\\u4F9D\\u983C\n#XFLD\nLabel.Package=\\u30D1\\u30C3\\u30B1\\u30FC\\u30B8\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP \\u79FB\\u9001\\u60C5\\u5831\n#XMSG: Description for the Transport Component\nTransportInformation.Description=ABAP \\u79FB\\u9001\\u95A2\\u9023\\u9805\\u76EE\\u306E\\u8868\\u793A\\u304A\\u3088\\u3073\\u30C1\\u30A7\\u30C3\\u30AF\\u306E\\u305F\\u3081\\u306E\\u30B3\\u30F3\\u30DD\\u30FC\\u30CD\\u30F3\\u30C8\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=\\u6709\\u52B9\\u306A\\u30D1\\u30C3\\u30B1\\u30FC\\u30B8\\u3092\\u6307\\u5B9A\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n',
	"sap/ushell_abap/transport/i18n/i18n_kk.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=\\u0410\\u0441\\u043F\\u0430\\u043F\\u0442\\u044B\\u049B \\u049B\\u04B1\\u0440\\u0430\\u043B\\u0434\\u0430\\u0440 \\u0441\\u04B1\\u0440\\u0430\\u0443\\u044B\n#XFLD\nLabel.Package=\\u0411\\u0443\\u043C\\u0430\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP \\u0442\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u044B \\u0442\\u0443\\u0440\\u0430\\u043B\\u044B \\u0430\\u049B\\u043F\\u0430\\u0440\\u0430\\u0442\n#XMSG: Description for the Transport Component\nTransportInformation.Description=ABAP \\u0442\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u044B \\u04AF\\u0448\\u0456\\u043D \\u0440\\u0435\\u043B\\u0435\\u0432\\u0430\\u043D\\u0442\\u0442\\u044B \\u04E9\\u0440\\u0456\\u0441\\u0442\\u0435\\u0440\\u0434\\u0456 \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0435\\u0442\\u0456\\u043D \\u0436\\u04D9\\u043D\\u0435 \\u0431\\u0430\\u0493\\u0430\\u043B\\u0430\\u0439\\u0442\\u044B\\u043D \\u049B\\u04B1\\u0440\\u0430\\u043C\\u0434\\u0430\\u0441\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=\\u0416\\u0430\\u0440\\u0430\\u043C\\u0434\\u044B \\u0431\\u0443\\u043C\\u0430\\u043D\\u044B \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0456\\u04A3\\u0456\\u0437.\n',
	"sap/ushell_abap/transport/i18n/i18n_ko.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=\\uC6CC\\uD06C\\uBCA4\\uCE58 \\uC694\\uCCAD\n#XFLD\nLabel.Package=\\uD328\\uD0A4\\uC9C0\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP \\uC804\\uC1A1 \\uC815\\uBCF4\n#XMSG: Description for the Transport Component\nTransportInformation.Description=ABAP \\uC804\\uC1A1\\uACFC \\uAD00\\uB828\\uB41C \\uD544\\uB4DC\\uB97C \\uD45C\\uC2DC\\uD558\\uACE0 \\uC720\\uD6A8\\uC131\\uC744 \\uD655\\uC778\\uD558\\uB294 \\uCEF4\\uD3EC\\uB10C\\uD2B8\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=\\uC720\\uD6A8\\uD55C \\uD328\\uD0A4\\uC9C0\\uB97C \\uC785\\uB825\\uD558\\uC2ED\\uC2DC\\uC624.\n',
	"sap/ushell_abap/transport/i18n/i18n_lt.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Instrumentini\\u0173 priemoni\\u0173 u\\u017Eklausa\n#XFLD\nLabel.Package=Paketas\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP transporto informacija\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Komponentas, skirtas rodyti ir tikrinti laukams, susijusiems su ABAP transportu\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Pateikite galiojan\\u010Di\\u0105 pakuot\\u0119.\n',
	"sap/ushell_abap/transport/i18n/i18n_lv.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Darbtelpas piepras\\u012Bjums\n#XFLD\nLabel.Package=Pakotne\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP transport\\u0113\\u0161anas inform\\u0101cija\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Komponents ABAP atbilsto\\u0161o lauku att\\u0113lo\\u0161anai un p\\u0101rbaudei\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=L\\u016Bdzu, nodro\\u0161iniet der\\u012Bgu pakotni.\n',
	"sap/ushell_abap/transport/i18n/i18n_ms.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Permintaan Workbench\n#XFLD\nLabel.Package=Pakej\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=Maklumat Pemindahan ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Komponen untuk memaparkan dan mengesahkan medan yang berkaitan bagi pemindahan ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Sila sediakan pakej yang sah.\n',
	"sap/ushell_abap/transport/i18n/i18n_nl.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Workbenchopdracht\n#XFLD\nLabel.Package=Pakket\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP-transportinformatie\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Component voor weergave en validatie van de velden die relevant zijn voor ABAP-transport\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Geef een geldig pakket op.\n',
	"sap/ushell_abap/transport/i18n/i18n_no.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Workbenchordre\n#XFLD\nLabel.Package=Pakke\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP-overf\\u00F8ringsinformasjon\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Komponent for \\u00E5 vise og validere feltene som er relevante for ABAP-overf\\u00F8ring\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Oppgi en gyldig pakke.\n',
	"sap/ushell_abap/transport/i18n/i18n_pl.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Zlecenie Workbench\n#XFLD\nLabel.Package=Pakiet\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=Informacje dot. transportu ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Sk\\u0142adnik do wy\\u015Bwietlania i walidacji p\\u00F3l istotnych dla transportu ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Podaj prawid\\u0142owy pakiet.\n',
	"sap/ushell_abap/transport/i18n/i18n_pt.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Ordem de workbench\n#XFLD\nLabel.Package=Pacote\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=Informa\\u00E7\\u00F5es de transporte ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Componente para exibir e validar os campos relevantes para o transporte ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Forne\\u00E7a um pacote v\\u00E1lido.\n',
	"sap/ushell_abap/transport/i18n/i18n_ro.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Cerere de workbench\n#XFLD\nLabel.Package=Pachet\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=Informa\\u021Bii de transport ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Component\\u0103 pentru afi\\u0219area \\u0219i validarea c\\u00E2mpurilor relevante pentru transport ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Furniza\\u021Bi un pachet valabil.\n',
	"sap/ushell_abap/transport/i18n/i18n_ru.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 \\u043A \\u0438\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u044C\\u043D\\u044B\\u043C \\u0441\\u0440\\u0435\\u0434\\u0441\\u0442\\u0432\\u0430\\u043C\n#XFLD\nLabel.Package=\\u041F\\u0430\\u043A\\u0435\\u0442\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F \\u043E \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u0435 ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=\\u041A\\u043E\\u043C\\u043F\\u043E\\u043D\\u0435\\u043D\\u0442 \\u0434\\u043B\\u044F \\u043F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0430 \\u0438 \\u043F\\u0440\\u043E\\u0432\\u0435\\u0440\\u043A\\u0438 \\u043F\\u043E\\u043B\\u0435\\u0439, \\u0440\\u0435\\u043B\\u0435\\u0432\\u0430\\u043D\\u0442\\u043D\\u044B\\u0445 \\u0434\\u043B\\u044F \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u0430 ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=\\u0423\\u043A\\u0430\\u0436\\u0438\\u0442\\u0435 \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u044B\\u0439 \\u043F\\u0430\\u043A\\u0435\\u0442.\n',
	"sap/ushell_abap/transport/i18n/i18n_sh.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Zahtev za radno okru\\u017Eenje\n#XFLD\nLabel.Package=Paket\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=Informacije o ABAP prenosu\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Komponenta za prikaz i vrednovanje polja relevantnih za ABAP prenos\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Navedite va\\u017Ee\\u0107i paket.\n',
	"sap/ushell_abap/transport/i18n/i18n_sk.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Po\\u017Eiadavka na workbench\n#XFLD\nLabel.Package=Paket\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=Inform\\u00E1cie o transporte ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Komponent na zobrazenie a overenie pol\\u00ED relevantn\\u00FDch pre transport ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Zadajte platn\\u00FD paket.\n',
	"sap/ushell_abap/transport/i18n/i18n_sl.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Nalog Workbencha\n#XFLD\nLabel.Package=Paket\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=Informacije o transportu ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Komponenta za prikaz in validacijo polj, relevantnih za ABAP-transport\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Prosim, navedite veljaven paket.\n',
	"sap/ushell_abap/transport/i18n/i18n_sv.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Workbenchorder\n#XFLD\nLabel.Package=Paket\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP-transportinformation\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Komponent f\\u00F6r visning och validering av f\\u00E4lt relevanta f\\u00F6r ABAP-transport\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Ange ett giltigt paket.\n',
	"sap/ushell_abap/transport/i18n/i18n_th.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=\\u0E04\\u0E33\\u0E02\\u0E2D Workbench\n#XFLD\nLabel.Package=\\u0E41\\u0E1E\\u0E04\\u0E40\\u0E01\\u0E08\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=\\u0E02\\u0E49\\u0E2D\\u0E21\\u0E39\\u0E25\\u0E01\\u0E32\\u0E23\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15 ABAP \n#XMSG: Description for the Transport Component\nTransportInformation.Description=\\u0E2A\\u0E48\\u0E27\\u0E19\\u0E1B\\u0E23\\u0E30\\u0E01\\u0E2D\\u0E1A\\u0E17\\u0E35\\u0E48\\u0E08\\u0E30\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E41\\u0E25\\u0E30\\u0E15\\u0E23\\u0E27\\u0E08\\u0E2A\\u0E2D\\u0E1A\\u0E04\\u0E27\\u0E32\\u0E21\\u0E16\\u0E39\\u0E01\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E02\\u0E2D\\u0E07\\u0E1F\\u0E34\\u0E25\\u0E14\\u0E4C\\u0E17\\u0E35\\u0E48\\u0E40\\u0E01\\u0E35\\u0E48\\u0E22\\u0E27\\u0E02\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E31\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15 ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E23\\u0E30\\u0E1A\\u0E38\\u0E41\\u0E1E\\u0E04\\u0E40\\u0E01\\u0E08\\u0E17\\u0E35\\u0E48\\u0E16\\u0E39\\u0E01\\u0E15\\u0E49\\u0E2D\\u0E07\n',
	"sap/ushell_abap/transport/i18n/i18n_tr.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=\\u00C7al\\u0131\\u015Fma ekran\\u0131 talebi\n#XFLD\nLabel.Package=Paket\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP aktar\\u0131m bilgileri\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Aktar\\u0131mla ili\\u015Fkili alanlar\\u0131 g\\u00F6r\\u00FCnt\\u00FClemek ve do\\u011Frulamak i\\u00E7in bile\\u015Fen\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Ge\\u00E7erli paket sa\\u011Flay\\u0131n.\n',
	"sap/ushell_abap/transport/i18n/i18n_uk.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=\\u0417\\u0430\\u043F\\u0438\\u0442 \\u0456\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u044C\\u043D\\u0438\\u0445 \\u0437\\u0430\\u0441\\u043E\\u0431\\u0456\\u0432\n#XFLD\nLabel.Package=\\u041F\\u0430\\u043A\\u0435\\u0442\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=\\u0406\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0456\\u044F \\u043F\\u0440\\u043E \\u043F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043D\\u044F ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=\\u041A\\u043E\\u043C\\u043F\\u043E\\u043D\\u0435\\u043D\\u0442 \\u0434\\u043B\\u044F \\u0432\\u0456\\u0434\\u043E\\u0431\\u0440\\u0430\\u0436\\u0435\\u043D\\u043D\\u044F \\u0456 \\u043F\\u0435\\u0440\\u0435\\u0432\\u0456\\u0440\\u043A\\u0438 \\u043F\\u043E\\u043B\\u0456\\u0432, \\u0440\\u0435\\u043B\\u0435\\u0432\\u0430\\u043D\\u0442\\u043D\\u0438\\u0445 \\u0434\\u043B\\u044F \\u043F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043D\\u044F ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=\\u0412\\u043A\\u0430\\u0436\\u0456\\u0442\\u044C \\u0434\\u0456\\u0439\\u0441\\u043D\\u0438\\u0439 \\u043F\\u0430\\u043A\\u0435\\u0442.\n',
	"sap/ushell_abap/transport/i18n/i18n_vi.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=Y\\u00EAu c\\u00E2\\u0300u workbench\n#XFLD\nLabel.Package=G\\u00F3i\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=Th\\u00F4ng tin chuy\\u00EA\\u0309n ABAP\n#XMSG: Description for the Transport Component\nTransportInformation.Description=Tha\\u0300nh ph\\u00E2\\u0300n \\u0111\\u00EA\\u0309 hi\\u00EA\\u0309n thi\\u0323 va\\u0300 xa\\u0301c th\\u01B0\\u0323c tr\\u01B0\\u01A1\\u0300ng li\\u00EAn quan \\u0111\\u00EA\\u0301n chuy\\u00EA\\u0309n ABAP\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=Vui lo\\u0300ng cung c\\u1EA5p go\\u0301i h\\u1EE3p l\\u1EC7.\n',
	"sap/ushell_abap/transport/i18n/i18n_zh_CN.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=\\u5DE5\\u4F5C\\u53F0\\u8BF7\\u6C42\n#XFLD\nLabel.Package=\\u5305\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP \\u4F20\\u8F93\\u4FE1\\u606F\n#XMSG: Description for the Transport Component\nTransportInformation.Description=\\u7528\\u4E8E\\u663E\\u793A\\u548C\\u9A8C\\u8BC1 ABAP \\u4F20\\u8F93\\u76F8\\u5173\\u5B57\\u6BB5\\u7684\\u7EC4\\u4EF6\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=\\u8BF7\\u63D0\\u4F9B\\u6709\\u6548\\u7684\\u5305\\u3002\n',
	"sap/ushell_abap/transport/i18n/i18n_zh_TW.properties":'# Translatable texts for the Transport Component used in the Fiori Launchpad Page Composer application\n# \n\n#XFLD\nLabel.WorkbenchRequest=\\u5DE5\\u4F5C\\u53F0\\u8ACB\\u6C42\n#XFLD\nLabel.Package=\\u5957\\u4EF6\n\n#XTIT: Title for the Transport Component\nTransportInformation.Title=ABAP \\u50B3\\u8F38\\u8CC7\\u8A0A\n#XMSG: Description for the Transport Component\nTransportInformation.Description=\\u5143\\u4EF6\\u53EF\\u986F\\u793A\\u548C\\u9A57\\u8B49 ABAP \\u50B3\\u8F38\\u7684\\u76F8\\u95DC\\u6B04\\u4F4D\n#XMSG: Validation message displayed when package input field is empty\nMessage.EmptyPackage=\\u8ACB\\u63D0\\u4F9B\\u6709\\u6548\\u5957\\u4EF6\\u3002\n',
	"sap/ushell_abap/transport/manifest.json":'{\n  "_version": "1.1.0",\n\n  "sap.app": {\n    "_version": "1.1.0",\n    "i18n": "i18n/i18n.properties",\n    "id": "sap.ushell_abap.transport",\n    "type": "component",\n    "embeddedBy": "",\n    "title": "{{TransportInformation.Title}}",\n    "description": "{{TransportInformation.Description}}",\n    "ach": "CA-FLP-COR",\n    "cdsViews": [],\n    "offline": false,\n    "dataSources": {\n      "TransportService": {\n        "uri": "/sap/opu/odata/UI2/FDM_VALUE_HELP_SRV/",\n        "type": "OData",\n        "settings": {\n          "odataVersion": "2.0"\n        }\n      }\n    }\n  },\n  "sap.ui": {\n    "_version": "1.1.0",\n\n    "technology": "UI5",\n    "icons": {\n      },\n    "deviceTypes": {\n      "desktop": true,\n      "tablet": false,\n      "phone": false\n    },\n    "fullWidth": true\n  },\n  "sap.ui5": {\n    "_version": "1.1.0",\n    "resources": {\n      "js": [],\n      "css": []\n    },\n    "dependencies": {\n      "libs": {\n        "sap.m": {\n          "minVersion": "1.68"\n        },\n        "sap.ui.layout": {\n          "minVersion": "1.68"\n        }\n      }\n    },\n    "models": {\n      "i18n": {\n        "type": "sap.ui.model.resource.ResourceModel",\n        "uri": "i18n/i18n.properties"\n      },\n      "Transport": {\n        "dataSource": "TransportService",\n        "preload": true,\n        "settings": {\n          "defaultCountMode": "None",\n          "skipMetadataAnnotationParsing": true,\n          "useBatch": true\n        }\n      }\n    },\n    "rootView": {\n      "viewName": "sap.ushell_abap.transport.view.TransportInformation",\n      "type": "XML",\n      "async": true,\n      "id": "app-transport"\n    },\n    "handleValidation": false,\n    "config": {\n      "fullWidth": true\n    },\n    "routing": {},\n    "contentDensities": { "compact": true, "cozy": true }\n  }\n}\n',
	"sap/ushell_abap/transport/util/Transport.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Filter, FilterOperator) {
    "use strict";

    /**
     * @param {string} oODataModel The oData model of the transport service
     * @constructor
     */
    var TransportHelper = function (oODataModel) {
        this.oODataModel = oODataModel;
    };

    /**
     * Returns a promise which resolves to
     * - the transport information if there are results
     * - true if there are no results
     *
     * @param {string} sPageId The pageId to check
     * @returns {Promise<boolean|object>} A promise resolving to the object or true
     *
     * @private
     */
    TransportHelper.prototype._getTransportLockedInformation = function (sPageId) {
        return this._readTransportInformation(sPageId)
            .then(function (oTransport) {
                return oTransport.results.length ? oTransport.results[0] : true;
            });
    };

    /**
     * Reads the transport information for the given pageId
     *
     * @param {string} sPageId The pageId to check
     * @returns {Promise<object>} A promise resolving to a result object
     *
     * @private
     */
    TransportHelper.prototype._readTransportInformation = function (sPageId) {
        var sUrl = "/transportSet";
        var filter = new Filter("pageId", FilterOperator.EQ, sPageId);
        return new Promise(function (resolve, reject) {
            this.oODataModel.read(sUrl, {
                filters: [filter],
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Checks if a transport is required for the given package name
     *
     * @param {string} sPackageName The package name
     * @returns {Promise<boolean>} A promise resolving to boolean
     *
     * @private
     */
    TransportHelper.prototype._isPackageTransportRequired = function (sPackageName) {
        return this._readPackageInformation(sPackageName)
            .then(function (result) {
                return result.transportRequired;
            });
    };

    /**
     * Reads information for a given package
     *
     * @param {string} sPackageName The package name
     * @returns {Promise<object>} A promise resolving to the result object
     *
     * @private
     */
    TransportHelper.prototype._readPackageInformation = function (sPackageName) {
        var sUrl = "/packageSet('" + encodeURIComponent(sPackageName) + "')";
        return new Promise(function (resolve, reject) {
            this.oODataModel.read(sUrl, {
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Checks if the transport information should be displayed
     *
     * True if the transportId is NOT set but transport is required for the package
     *
     * @param {object} oPage The page object to delete
     * @returns {Promise<boolean>} A promise resolving to the boolean result
     *
     * @private
     */
    TransportHelper.prototype._showTransport = function (oPage) {
        var sPackageName = oPage.metadata.devclass;

        if (oPage && oPage.metadata && !oPage.metadata.transportId) {
            return this._isPackageTransportRequired(sPackageName);
        }

        return Promise.resolve(false);
    };

    /**
     * Checks if the transport information needs to be shown
     *
     * @param {object} page The page to delete
     * @returns {Promise<boolean>} A promise resolving to the boolean result
     *
     * @protected
     */
    TransportHelper.prototype.checkShowTransport = function (page) {
        return this._showTransport(page).then(function (showTransport) {
            return showTransport;
        });
    };

    /**
     * Checks if the page is locked by another user
     *
     * @param {object} page The page to edit
     * @returns {Promise<boolean|object>} A promise with the transport information or false if the page is not locked
     *
     * @protected
     */
    TransportHelper.prototype.checkShowLocked = function (page) {
        return this._getTransportLockedInformation(page.content.id).then(function (transportLockedInformation) {
            if (transportLockedInformation.foreignOwner) {
                return transportLockedInformation;
            }
            return false;
        });
    };

    return TransportHelper;
});
},
	"sap/ushell_abap/transport/view/TransportInformation.view.xml":'<mvc:View\n    controllerName="sap.ushell_abap.transport.controller.TransportInformation"\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:form="sap.ui.layout.form"\n    xmlns:mvc="sap.ui.core.mvc"\n    core:require="{String: \'sap/ui/model/type/String\'}">\n    <form:SimpleForm editable="true">\n        <Label text="{i18n>Label.Package}" />\n        <Input\n            id="packageInput"\n            maxLength="30"\n            required="true"\n            change=".onChange"\n            liveChange=".onPackageLiveChange"\n            valueLiveUpdate="true"\n            editable="{= !${/packageInputReadOnly}}"\n            valueStateText="{i18n>Message.EmptyPackage}"\n            value="{\n                path: \'/package\',\n                type: \'String\'\n            }"\n            type="Text"\n            showSuggestion="true"\n            suggestionItems="{PackageModel>/packageSet/}">\n            <suggestionItems>\n                <core:Item text="{PackageModel>devclass}" />\n            </suggestionItems>\n        </Input>\n        <Label text="{i18n>Label.WorkbenchRequest}" required="{/workbenchRequired}" />\n        <Select\n            id="workbenchRequestSelect"\n            forceSelection="false"\n            change=".onChange"\n            selectedKey="{/workbenchRequest}"\n            enabled="{/workbenchRequired}"\n            width="100%"\n            items="{\n                path: \'PackageModel>/transportSet/\',\n                sorter: { path: \'trkorr\' }\n            }">\n            <core:Item key="{PackageModel>trkorr}" text="{PackageModel>trkorr}-{PackageModel>description}" />\n        </Select>\n    </form:SimpleForm>\n</mvc:View>\n'
},"Component-preload"
);
