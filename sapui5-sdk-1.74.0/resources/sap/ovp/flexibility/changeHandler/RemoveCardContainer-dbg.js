/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */

sap.ui.define([
        "sap/m/MessageToast",
        "sap/ovp/app/resources"
    ], function (MessageToast, OvpResources) {
        "use strict";
        /**
         * Change handler for removing of a componentContainer control.
         * @alias sap.ui.fl.changeHandler.RemoveCardContainer
         * @author SAP SE
         * @version 1.74.0
         * @experimental Since 1.27.0
         */
        var RemoveCardContainer = {
            "changeHandler": {},
            "layers": {
                "VENDOR": true,
                "CUSTOMER_BASE": true,
                "CUSTOMER": true,
                "USER": true
            }
        };

        /**
         * Removes a componentContainer control.
         *
         * @param {sap.ui.fl.Change} oChange change object with instructions to be applied on the control map
         * @param {sap.ui.core.Control} oControl control that matches the change selector for applying the change
         * @param {object} mPropertyBag - map of properties
         * @returns {boolean} true - if change could be applied
         * @public
         */
        RemoveCardContainer.changeHandler.applyChange = function (oChange, oControl, mPropertyBag) {
            var oModifier = mPropertyBag.modifier,
                oMainView = mPropertyBag.appComponent.getRootControl(),
                oMainController = oMainView.getController(),
                oUIModel = oMainController.getUIModel(),
                aCards = oUIModel.getProperty("/cards"),
                oLayout = oMainController.getLayout(),
                sCardId = oChange.getContent().id,
                sElementId = oMainController._getCardId(sCardId),
                oAppComponent = mPropertyBag.appComponent,
                oSelector = {
                    id: sCardId,
                    isLocalId: false
                },
                oCardControl = oModifier.bySelector(oSelector, oAppComponent, oMainView),
                iIndex;
            for (iIndex = 0; iIndex < aCards.length; iIndex++) {
                if (aCards[iIndex].id === sElementId) {
                    break;
                }
            }
            var oCard = aCards.splice(iIndex, 1);
            oUIModel.setProperty("/cards", aCards);
            oChange.setRevertData({
                id: sCardId,
                oCard: oCard[0],
                index: iIndex
            }); // Here the information is stored on the change
            oModifier.setVisible(oCardControl, false);
            if (oUIModel.getProperty('/containerLayout') === 'resizable') {
                var oLayoutUtil = oLayout.getDashboardLayoutUtil();
                if (oLayoutUtil.aCards) {
                    oLayoutUtil.updateCardVisibility([{
                        id: oLayoutUtil.getCardIdFromComponent(sCardId),
                        visibility: false
                    }]);
                }
            }

            /**
             *  Inside RTA Mode
             *  Message Toast is shown when the card has been successfully removed
             */
            var sMessage = OvpResources.getText("OVP_KEYUSER_TOAST_MESSAGE_FOR_REMOVE", [oCardControl.getComponentInstance().getComponentData().settings.title]);

            MessageToast.show(sMessage, {
                duration: 10000
            });

            oLayout.rerender();
            return true;
        };

        /**
         * Reverts removing of a componentContainer control.
         *
         * @param {sap.ui.fl.Change} oChange change object with instructions to be applied on the control map
         * @param {sap.ui.core.Control} oControl control that matches the change selector for applying the change
         * @param {object} mPropertyBag - map of properties
         * @returns {boolean} true - if change could be applied
         * @public
         */
        RemoveCardContainer.changeHandler.revertChange = function (oChange, oControl, mPropertyBag) {
            var oModifier = mPropertyBag.modifier,
                oMainView = mPropertyBag.appComponent.getRootControl(),
                oMainController = oMainView.getController(),
                oUIModel = oMainController.getUIModel(),
                aCards = oUIModel.getProperty("/cards"),
                oLayout = oMainController.getLayout(),
                oRevertedData = oChange.getRevertData(),
                oCardControl = oModifier.bySelector(oRevertedData.id);
            aCards.splice(oRevertedData.index, 0, oRevertedData.oCard);
            oUIModel.setProperty("/cards", aCards);
            oModifier.setVisible(oCardControl, true);
            oChange.resetRevertData(); // Clear the revert data on the change
            if (oUIModel.getProperty('/containerLayout') === 'resizable') {
                var oLayoutUtil = oLayout.getDashboardLayoutUtil();
                oLayoutUtil.updateCardVisibility([{id: oLayoutUtil.getCardIdFromComponent(oRevertedData.id), visibility: true}]);
            }
            oLayout.rerender();
            return true;
        };

        /**
         * Completes the change by adding change handler specific content
         *
         * @param {sap.ui.fl.oChange} oChange change object to be completed
         * @param {object} oSpecificChangeInfo as an empty object since no additional attributes are required for this operation
         * @param {object} mPropertyBag - map of properties
         * @param {sap.ui.core.UiComponent} mPropertyBag.appComponent component in which the change should be applied
         * @public
         */
        RemoveCardContainer.changeHandler.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
            return;
        };

        return RemoveCardContainer;
    },
    /* bExport= */true);
