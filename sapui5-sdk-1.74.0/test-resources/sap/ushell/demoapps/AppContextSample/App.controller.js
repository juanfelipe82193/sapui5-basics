// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*global sap, jQuery, JSONModel*/
sap.ui.controller(
    "sap.ushell.demo.AppContextSample.App",
    {
        getComponent : function () {
            "use strict";
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            return sap.ui.component(sComponentId);
        },
        onInit : function () {
            "use strict";
            // Read potentially existing personalization favorites.
            var oId = {
                    container : "/UI2/USHELL/AppContextSample",
                    item : "favorites"
                },
                that = this,
                sFruitFavsContextKey = "",
                sInnerAppStateKey = "",
                sComponentId,
                myComponent;
            this.sKeyPrefix = "/UI2/USHELL/AppCSmp";
            // standard pattern to obtain the enclosing component 
            myComponent = this.getComponent();
            // set received parameter state
            this.initFruitFavorites(myComponent);

            // restore an Inner App State, if present
            sInnerAppStateKey = this.getInnerAppStateKey();
            this.restoreAppState(sInnerAppStateKey); // hashkey  

            // below, we document two distinct models for the state
            // model a) on every state change, we generate a *new* uid and alter the links
            //        (this is used for the app state which is passed to the next app!
            //         compare the makeURL method, 
            //         note that there is a slight latency as the model update is only performed after the new container has been obtained
            //         (asynchronously) 
            //
            // model b) we generate one uid per app invocation, keep it stable during app runtime
            //          and change the context underneath



            // preparing passing app context: 
            // -> we generate urls in a model
            // the link tags are bound to the model

            this.oURLModel = new sap.ui.model.json.JSONModel({ "toApp_href" : "<dummy>" });
            this.makeURLModel(""); // update model with empty key!
            this.getView().setModel(this.oURLModel);

            // model b), our unique app context key
            this.oAppContext = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(this.getMyComponent());
            this.sOurAppInstanceContextKey = this.oAppContext.getKey();
            sap.ui.core.routing.HashChanger.getInstance().replaceHash("/key/" + this.sOurAppInstanceContextKey);
            this.onSelectedFruitChanged();
        },

        getMyComponent: function () {
            "use strict";
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            return sap.ui.component(sComponentId);
        },

        getInnerAppStateKey : function () {
            "use strict";
            var sHash = sap.ui.core.routing.HashChanger.getInstance().getHash(),
                res;
            if (sHash && sHash.match("/key/(.*)")) {
                res = new RegExp("/key/(.*)").exec(sHash);
                return res[1];
            }
            return "";
        },

        makeURLModel : function (sKey) {
            "use strict";
            // shell compliant cross application navigation link generation
            var sToOurApp = sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal({
                target: { semanticObject : "Action",
                    action : "toappcontextsample" },
//                params : { "fruitfavscontextkey" : sKey },
                appStateKey : sKey
            }) || "";

            this.oURLModel.setData({
                toApp_href : sToOurApp
            });
        },

        generateId : function () {
            "use strict";
            return String(Number(new Date())) + this.createId("ctx");
        },

        // received context (if any)
        initFruitFavorites : function (oComponent) {
            "use strict";
            var i,
                that = this,
                aPanelMilkshakeFavorites = that.getView().byId("PanelFruitFavorites").getContent();
            for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                aPanelMilkshakeFavorites[i].setEnabled(false);
            }
            sap.ushell.Container.getService("CrossApplicationNavigation").getStartupAppState(oComponent).done(
                function (oContainer) {
                    that.transferAppStateToPanel(oContainer, "PanelFruitFavorites", "Fruits");
                }
            );
                //sap.ushell.Container.getService("Personalization").getContainer(this.sKeyPrefix + sKey, {validity : 30 /*FLP window!*/ })
        },

        restoreAppState : function (sKey) {
            "use strict";
            var that = this,
                i,
                aPanelMilkshakeFavorites;
            this.disableInput("PanelSelectedFruitFavorites");
            this.disableInput("PanelMilkshakeFavorites");
            // restore an old state
            aPanelMilkshakeFavorites = that.getView().byId("PanelMilkshakeFavorites").getContent();
            for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                //aPanelMilkshakeFavorites[i].setSelected(that.oIceCreamContainer.getItemValue(aPanelMilkshakeFavorites[i].getId()) || false);
                aPanelMilkshakeFavorites[i].setEnabled(false);
            }
            sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(this.getMyComponent(), sKey)
                .done(function (oContainer) {
                    that.disableInput("PanelSelectedFruitFavorites", true);
                    that.disableInput("PanelMilkshakeFavorites", true);
                    that.transferAppStateToPanel(oContainer, "PanelSelectedFruitFavorites", "Fruits");
                    that.transferAppStateToPanel(oContainer, "PanelMilkshakeFavorites", "Milkshakes");
                });
        },



        transferContainerToPanel : function (oContainer, sPanel, sItemPrefix) {
            "use strict";
            var i,
                val,
                aPanel = this.getView().byId(sPanel).getContent();
            for (i = 0; i < aPanel.length; i = i + 1) {
                val = (oContainer && oContainer.getItemValue(sItemPrefix + String(i))) || false;
                aPanel[i].setSelected(val);
            }
            //this.getView().invalidate();
        },

        /**
         * transfer 
         */
        transferPanelToContainer : function (oContainer, sPanel, sItemPrefix) {
            "use strict";
            // the button is only available if we have loaded the data 
            var aPanel = this.getView().byId(sPanel).getContent(),
                i;
            for (i = 0; i < aPanel.length; i = i + 1) {
                oContainer.setItemValue(sItemPrefix + String(i), aPanel[i].getSelected());
            }
            // not saved yet!
        },

        transferAppStateToPanel : function (oContainer, sPanel, sItemPrefix) {
            "use strict";
            var i,
                val,
                aPanel = this.getView().byId(sPanel).getContent();
            for (i = 0; i < aPanel.length; i = i + 1) {
                val = (oContainer && oContainer.getData() && oContainer.getData()[sItemPrefix + String(i)]) || false;
                aPanel[i].setSelected(val);
            }
            //this.getView().invalidate();
        },

        /**
         * transfer 
         */
        transferPanelToAppState : function (oContainer, sPanel, sItemPrefix) {
            "use strict";
            // the button is only available if we have loaded the data 
            var aPanel = this.getView().byId(sPanel).getContent(),
                i,
                o;
            o = oContainer.getData() || {};
            for (i = 0; i < aPanel.length; i = i + 1) {
                o[sItemPrefix + String(i)] = aPanel[i].getSelected();
            }
            oContainer.setData(o);
            // not saved yet!
        },

        disableInput : function (sPanel, boolNewState) {
            "use strict";
            var i,
                aPanel = this.getView().byId(sPanel).getContent();
            boolNewState = boolNewState || false;
            for (i = 0; i < aPanel.length; i = i + 1) {
                aPanel[i].setEnabled(boolNewState);
            }
        },


        /**
         * Gets the favorites from browser storage
         */
        applyExistingFruitFavorites : function (oId) {
            "use strict";
            this.oPersonalizer
                    .getPersData()
                    .done(this.onFruitFavoritesRead.bind(this))
                    .fail(
                    function () {
                        jQuery.sap.log
                                .error("Reading personalization data failed.");
                    }
                );
        },


        /**
         * Called when "Save ice cream favorites is changed 
         */
        onMilkshakeChanged : function () {
            "use strict";
            this.transferPanelToAppState(this.oAppContext, "PanelMilkshakeFavorites", "Milkshakes");
            this.oAppContext.save();
        },

        onSelectedFruitChanged : function () {
            "use strict";
            var that = this;
            this.transferPanelToAppState(this.oAppContext, "PanelSelectedFruitFavorites", "Fruits"); // update app context
            this.oAppContext.save();
            //
            this.updateURLTargets();
        },


        updateURLTargets : function () {
            "use strict";
            // generate a new uid 
            var that = this,
                oComponent = this.getComponent(),
                oContainer;
            // create new context and transfer the state
            oContainer = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(oComponent);
            //            sap.ushell.Container.getService("Personalization").createEmptyContainer(this.sKeyPrefix + sNewURLContextId, {validity : 30}).
            this.transferPanelToAppState(oContainer, "PanelSelectedFruitFavorites", "Fruits"); // update app context
            this.makeURLModel(oContainer.getKey());
            oContainer.save();
        },
        onDestroy : function () {
            "use strict";
        }
    }
);