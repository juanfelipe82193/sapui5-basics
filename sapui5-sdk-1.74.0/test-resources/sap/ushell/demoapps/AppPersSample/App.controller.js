// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*global sap, jQuery */

sap.ui.define([
], function (Controller) {
    "use strict";

    sap.ui.controller("sap.ushell.demo.AppPersSample.App", {
        onInit: function () {
            // Read potentially existing personalization favorites.
            var that = this;
            var oId = {
                    container : "sap.ushell.demo.FruitFavorites",
                    item : "favorites"
                };

            this.oPersonalizationPromise = this.getOwnerComponent().getService("Personalization").then(function (oPersonalization) {
                var oPersonalizer,
                    oConstants;

                oConstants = oPersonalization.constants;
                oPersonalizer = oPersonalization.getPersonalizer(
                    oId, {
                        keyCategory: oConstants.keyCategory.FIXED_KEY,
                        writeFrequency: oConstants.writeFrequency.LOW,
                        clientStorageAllowed: true
                    }, that.getMyComponent()
                );

                return {
                    personalizer: oPersonalizer,
                    constants: oConstants,
                    service: oPersonalization
                };

            }, function (oError) {
                throw new Error("Cannot get Personalization service: " + oError);
            });

            this.applyExistingFruitFavorites(oId);
            this.initIceCreamFavorites();
            this.initMilkshakeFavorites();

        },

        getMyComponent: function () {
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            return sap.ui.component(sComponentId);
        },


        initIceCreamFavorites : function () {
            var that = this;

            //retrieve constants from namespace 'constants' of personalization service
            this.oPersonalizationPromise.then(function (oPersonalization) {
                var oConstants;
                oConstants = oPersonalization.constants;

                // Ice cream favorites
                that.getView().byId("btnSaveIceCream").setEnabled(false);

                oPersonalization.service.getContainer("sap.ushell.IceCreamFavorites", { validity : 2, keyCategory : oConstants.keyCategory.FIXED_KEY, writeFrequency: oConstants.writeFrequency.LOW, clientStorageAllowed : false }, that.getMyComponent())
                    .done(function (oContainer) {
                        var i,
                            aPanelIceCreamFavorites = that.getView() && that.getView().byId("PanelIceCreamFavorites") && that.getView().byId("PanelIceCreamFavorites").getContent();
                        if (!aPanelIceCreamFavorites) {
                            jQuery.sap.log.error("View or control PanelIceCreamFavorites no longer present");
                            return;
                        }
                        that.oIceCreamContainer = oContainer;
                        for (i = 0; i < aPanelIceCreamFavorites.length; i = i + 1) {
                            if (aPanelIceCreamFavorites[i] instanceof sap.m.CheckBox) {
                                aPanelIceCreamFavorites[i].setSelected(that.oIceCreamContainer.getItemValue(String(i)) || false);
                            }
                        }
                        that.getView().byId("btnSaveIceCream").setEnabled(true);
                    });
                });
        },

        initMilkshakeFavorites : function () {
            // Ice cream favorites
            var that = this;

            //retrieve constants from namespace 'constants' of personalization service
            this.oPersonalizationPromise.then(function (oPersonalization) {
                var i,
                    aPanelMilkshakeFavorites = that.getView().byId("PanelMilkshakeFavorites").getContent(),
                    oConstants;

                oConstants = oPersonalization.constants;

                for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                    //aPanelMilkshakeFavorites[i].setSelected(that.oIceCreamContainer.getItemValue(aPanelMilkshakeFavorites[i].getId()) || false);
                    aPanelMilkshakeFavorites[i].setEnabled(false);
                }

                oPersonalization.service.getContainer("sap.ushell.MilkshakeFavorites", { keyCategory : oConstants.keyCategory.FIXED_KEY, clientStorageAllowed : true, writeFrequency: oConstants.writeFrequency.LOW, validity : 0 /*FLP window!*/ }, that.getMyComponent())
                    .done(function (oContainer) {
                        var i,
                            aPanelMilkshakeFavorites = that.getView() && that.getView().byId("PanelMilkshakeFavorites") && that.getView().byId("PanelMilkshakeFavorites").getContent();
                        if (!aPanelMilkshakeFavorites) {
                            jQuery.sap.log.error("View or control aPanelMilkshakeFavorites no longer present");
                            return;
                        }
                        that.oMilkshakeContainer = oContainer;
                        for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                            if (aPanelMilkshakeFavorites[i] instanceof sap.m.CheckBox) {
                                aPanelMilkshakeFavorites[i].setSelected(that.oMilkshakeContainer.getItemValue(String(i)) || false);
                            }
                            aPanelMilkshakeFavorites[i].setEnabled(true);
                        }
                    });
            });
        },

        /**
         * Gets the favorites from browser storage
         */
        applyExistingFruitFavorites : function (oId) {
            var that = this;
            this.oPersonalizationPromise.then(function (oPersonalization) {
                oPersonalization.personalizer.getPersData()
                    .done(that.onFruitFavoritesRead.bind(that))
                    .fail(
                    function () {
                        jQuery.sap.log
                                .error("Reading personalization data failed.");
                    });
            });
        },

        /**
         * Called by applyExistingFavorites Sets the check-boxes if
         * favorites were saved
         */
        onFruitFavoritesRead : function (aCheckBoxValues) {
            var i;

            if (!aCheckBoxValues) {
                // TODO The following string is never used...
                // sDisplayValue = "(Personalization data is not available from service)";
            } else {
                for (i = 0; i < aCheckBoxValues.length; i = i + 1) {
                    this.getView().byId("PanelFruitFavorites")
                            .getContent()[i]
                            .setSelected(aCheckBoxValues[i]);
                }
            }
        },

        /**
         * Called when "Save Fruit Favorites" button is pressed
         */
        onSaveFruitFavorites : function () {
            var aCheckBoxValues = [],
                i,
                aPanelFavorites = this.getView().byId("PanelFruitFavorites").getContent();

            for (i = 0; i < aPanelFavorites.length - 1; i = i + 1) {
                aCheckBoxValues[i] = aPanelFavorites[i]
                        .getSelected();
            }

            this.oPersonalizationPromise.then(function (oPersonalization) {
                oPersonalization.personalizer.setPersData(aCheckBoxValues);
            });
            // neither the done nor the fail is checked
        },

        /**
         * Called when "Save ice cream favorites is changed
         */
        onSaveIceCreamFavorites : function () {
            // the button is only available if we have loaded the data
            var aPanelIceCreamFavorites = this.getView().byId("PanelIceCreamFavorites").getContent(),
                i;
            for (i = 0; i < aPanelIceCreamFavorites.length; i = i + 1) {
                if (aPanelIceCreamFavorites[i] instanceof sap.m.CheckBox) {
                    this.oIceCreamContainer.setItemValue(String(i), aPanelIceCreamFavorites[i].getSelected());
                }
            }
            this.oIceCreamContainer.save();
            // neither the done nor the fail is checked
        },
        /**
         * Called when "Save ice cream favorites is changed
         */
        onMilkshakeChanged : function () {
            // the button is only available if we have loaded the data
            var aPanelMilkshakeFavorites = this.getView().byId("PanelMilkshakeFavorites").getContent(),
                i;
            for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                if (aPanelMilkshakeFavorites[i] instanceof sap.m.CheckBox) {
                    this.oMilkshakeContainer.setItemValue(String(i), aPanelMilkshakeFavorites[i].getSelected());
                }
            }
            this.oMilkshakeContainer.save(); // TODO Deferred
            // neither the done nor the fail is checked
        },
        onDestroy : function () {
            this.oMilkshakeContainer.save();
        }
    });
});
