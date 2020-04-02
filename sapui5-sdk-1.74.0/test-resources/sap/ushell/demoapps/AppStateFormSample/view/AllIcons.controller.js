/*global sap, jQuery */
sap.ui.controller("sap.ushell.demo.AppStateFormSample.view.AllIcons", {

    collectionNames : ["Fiori2",
                       "Fiori3",
                       "Fiori4",
                       "Fiori5",
                       "Fiori6",
                       "Fiori7",
                       "BusinessSuiteInAppSymbols",
                       "FioriInAppIcons",
                       "FioriNonNative"
                       ],

    collectIcons : function () {
        "use strict";
        var res = [],
            sUri = "sap-icon://Fiori2/F0002",
            nr,
            that,
            names;
        this.collectionNames.forEach(function (sCollectionName) {
            if (sap.ui.core.IconPool.getIconCollectionNames().indexOf(sCollectionName) < 0) {
                // in the noshell use case, the icon collections are not registered
                return;
            }
            names = sap.ui.core.IconPool.getIconNames(sCollectionName);
            if (names) {
                names.forEach(function (nm, idx) {
                    sUri = "sap-icon://" + sCollectionName + "/" + nm;
                    res.push({ Key : sUri, Index : idx, CollectionName : sCollectionName, IsFavIcon : "" });
                });
            }
        });
        return res;
    },

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Detail
*/
    onInit: function () {
        "use strict";
        var that = this;
        this.oModel = new sap.ui.model.json.JSONModel({ search : "abc", icons: this.collectIcons()
            //{Key : "sap-icon://Fiori2/F0002", Index : 3 }
            });
        this.getView().setModel(this.oModel);
        //this.oModel.register
        this.getView().byId("search").attachLiveChange(this.handleChange.bind(this));
        this.getMyComponent().getModel("AppState").bindProperty("/appState/filter").attachChange(this.updateModel.bind(this));
        this.getMyComponent().getModel("AppState").bindTree("/").attachChange(this.updateModelIfPersMyIcons.bind(this));
        this.updateModel();
    },

    getMyComponent: function () {
        "use strict";
        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
        return sap.ui.component(sComponentId);
    },

    updateModelIfPersMyIcons : function () {
        var sNewString;
        sNewString = JSON.stringify(this.getMyComponent().getModel("AppState").getProperty("/pers/myicons") || []);
        // update the model if the favorites have changed
        if (this.sOldPersModel !== sNewString) {
            this.sOldPersModel = sNewString;
            this.updateModel();
        }
    },

    updateModel : function () {
        "use strict";
        var filter,
            res,
            bIsFavIcon,
            sIsFavIcon,
            aFavorites;
        res = this.collectIcons();
        filter = this.getMyComponent().getModel("AppState").getProperty("/appState/filter");
        jQuery.sap.log.error("updateModel ... " + filter);
        filter = filter.split(" ");
        aFavorites = this.getMyComponent().getModel("AppState").getProperty("/pers/myicons") || [];
        filter.forEach(function (nv) {
            res = res.filter(function (obj) {
                return obj.Key.indexOf(nv) >= 0;
            });
        });
        res.forEach(function (nv) {
            bIsFavIcon = (aFavorites.filter(function(fav) { return fav.Key === nv.Key; })).length; 
            sIsFavIcon = bIsFavIcon ? "sap-icon://favorite" : "";
            nv.IsFavIcon = sIsFavIcon;
        });
        this.oModel.getData().icons = res;
        this.oModel.refresh();
    },

    handleChange : function (ev) {
        "use strict";
        var res,
            search;
        jQuery.sap.log.error("handleChange ..." + ev.oSource.getModel("AppState").getProperty("/appState/filter"));
        // update the model!
        ev.oSource.getModel("AppState").setProperty("/appState/filter", ev.mParameters.newValue);
    },

    onListItemPress: function (ev, ev2) {
        "use strict";
        // prepare editrecord
        var path, obj, record;
        // prepare editrecord
        path = ev.oSource.getSelectedContextPaths()[0];
        record = ev.oSource.getModel().getProperty(path);
        obj = JSON.parse(JSON.stringify(record));
        obj.description = obj.description || "";
        obj.name = obj.semanticName || "";
        ev.oSource.getModel("AppState").setProperty("/appState/editRecord", obj);
        this.getMyComponent().navTo("displayIcon");
    },

    onListItemPressTable: function (ev, ev2) {
        "use strict";
        ev.oSource.getSelectedItem();
        this.getMyComponent().navTo("displayIcon");
    },

    onTableItemPress: function (ev, ev2) {
        "use strict";
        var path, obj, record;
        // prepare editrecord 
        path = ev.oSource.getSelectedContextPaths()[0];
        record = ev.oSource.getModel().getProperty(path);
        obj = JSON.parse(JSON.stringify(record));
        obj.description = obj.description || "";
        obj.name = obj.semanticName || "";
        ev.oSource.getModel("AppState").setProperty("/appState/editRecord", obj);
        this.getMyComponent().navTo("displayIcon");
    },


    getRouter: function () {
        "use strict";
        return sap.ui.core.UIComponent.getRouterFor(this);
    },

    onClearSearch : function () {
        "use strict";
        this.getView().byId("search").setValue("");
    },
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Detail
*/
//onBeforeRendering: function() {
//
//},

    handleBtn1Press : function () {
        "use strict";
        this.getRouter().navTo("IconFavoriteList", {iAppState : this.getMyComponent().getInnerAppStateKey()});
    }


});