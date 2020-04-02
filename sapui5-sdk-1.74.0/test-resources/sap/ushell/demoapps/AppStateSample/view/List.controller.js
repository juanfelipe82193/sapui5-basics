/*global sap, jQuery, JSONModel*/
(function () {
    "use strict";
    jQuery.sap.require("sap.ui.commons.Panel");
    jQuery.sap.require("sap.ushell.ui.footerbar.JamDiscussButton");
    jQuery.sap.require("sap.ushell.ui.footerbar.JamShareButton");
    jQuery.sap.require("sap.ushell.ui.footerbar.AddBookmarkButton");
    sap.ui.controller("sap.ushell.demo.AppStateSample.view.List", {
    /**
    * Called when a controller is instantiated and its View controls (if available) are already created.
    * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
    * @memberOf view.List
    */
        onInit: function () {
            var page = this.oView.getContent()[0],
                srvc = sap.ushell.services.AppConfiguration,
                oActionSheet,
                oActionsButton,
                that = this;

            this.getView().byId("MasterPage").setTitle("AppStateSample Instance #" + this.getMyComponent().INSTANCECOUNTER);
            if (srvc) {
                page.setShowFooter(true);
                oActionSheet = new sap.m.ActionSheet({ placement: sap.m.PlacementType.Top });
                oActionSheet.addButton(new sap.ushell.ui.footerbar.JamDiscussButton());
                oActionSheet.addButton(new sap.ushell.ui.footerbar.JamShareButton());
                oActionSheet.addButton(new sap.ushell.ui.footerbar.AddBookmarkButton());
                oActionsButton = new sap.m.Button({
                    press : function () {
                        oActionSheet.openBy(this);
                    },
                    icon : "sap-icon://action"
                });
                if (srvc && typeof srvc.getSettingsControl === "function") {
                    page.setFooter(new sap.m.Bar({
                        contentLeft: srvc.getSettingsControl(),
                        contentRight: oActionsButton
                    }));
                }
                this.oModel = new sap.ui.model.json.JSONModel({ icons: this.getIconCollections() });
                //register selectListItemByCollectionName on attachChange event
                this.getMyComponent().getModel("AppState").bindProperty("/appState/CollectionName").attachChange(function () {
                    try {
                        that.selectListItemByCollectionName((that.getMyComponent().getModel("AppState")).getProperty("/appState/CollectionName"));
                    } catch (e) {
                        jQuery.sap.log.warning("Could not excecute selectListItemByCollectionName (yet)",
                            e.toString(), "sap.ushell.demo.AppStateSample.view.List");
                    }
                });
                this.getView().setModel(this.oModel);
                //call it once to ensure that one item is selected -> after we set the model because ListItems have to be loaded!
                that.selectListItemByCollectionName(this.getMyComponent().getModel("AppState").getProperty("/appState/CollectionName"));
            }
        },

        handleCollectionItemSelect : function (ev) {
            var path,
                oBindContext = ev.getSource().getSelectedItem().getBindingContext(),
                sCollectionName = oBindContext.getObject().CollectionName;
            sCollectionName = sCollectionName || "";
            ev.oSource.getModel("AppState").setProperty("/appState/CollectionName", sCollectionName);
            this.getMyComponent().navTo("toCatIcons");
        },

        getIconCollections : function () {
            var res = [],
                nr,
                that;
            //add an "all" @ the very top of the list
            res.push({ CollectionName : "Show All" });
            sap.ui.core.IconPool.getIconCollectionNames().forEach(function (sCollectionName) {
                res.push({ CollectionName : sCollectionName });
            });
            return res;
        },

        //loop over the ListItems and select the item which matches to the passed collectionName
        selectListItemByCollectionName : function (sCollectionName) {
            this.getView().byId("categoryList").getItems().forEach(function (ListItem) {
                if (ListItem.getTitle() === sCollectionName) {
                    ListItem.setSelected(true); //select item
                }
            });
        },

        getMyComponent : function () {
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            return sap.ui.component(sComponentId);
        },

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        }
    });
}());
