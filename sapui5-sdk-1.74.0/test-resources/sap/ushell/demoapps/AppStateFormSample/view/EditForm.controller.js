/*global sap, jQuery, JSONModel*/
sap.ui.controller("sap.ushell.demo.AppStateFormSample.view.EditForm", {
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Detail
*/
    onInit: function () {
        "use strict";
        var that = this;
        this.cnt = 0; 
        var oModel = this.getMyComponent().getModel("AppState");
        oModel.bindTree("/").attachChange(function () {
            if (oModel.getProperty("/appState/chatList").length !== that.getView().byId("chatList2").getItems().length) {
                that.alignControls();
            }
        });
        
        this.getView().setModel(this.getMyComponent().getModel("AppState"), "AppState");
        this.getMyComponent().getEventBus().subscribe("sap.ushell.demoapps","restoreUIState", this.restoreUIState.bind(this));
        this.getMyComponent().getEventBus().subscribe("sap.ushell.demoapps","serializeUIState", this.serializeUIState.bind(this));
        this.alignControls();
    },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Detail
*/
   onBeforeRendering: function () {
        this.alignControls();
   },

    alignControls : function () {
        var ctl,
            oModel,
            that = this,
            aArrControls,
            aArr;
        jQuery.sap.log.error("align controls");
        this.getMyComponent().inEvent = true;
        this.alignListLength();
        this.getMyComponent().inEvent = false;
        oModel = this.getView() && this.getView().getModel("AppState");
        aArrControls = this.getView().byId("chatList2").getItems();
        if (!oModel) {
            return;            
        }
        aArr = oModel.getProperty("/appState/chatList");
        aArr.forEach(function (oText, iIndex) {
            oControl = that.getControlByIndex(iIndex);
            if (!oControl) {
                //! create a new Control
                ctl = new sap.m.Input({
                    //"data-change" : that.onInputChange.bind(that)
                    value : "{AppState>/appState/chatList/" + iIndex + "/text}"
                });
                ctl.attachLiveChange(that.onInputChange.bind(that));
                ctl.setModel(that.getView().getModel("AppState"));
                that.getView().byId("chatList2").addItem(ctl);
                setTimeout(function() {
                    jQuery(ctl.getFocusDomRef()).bind("focus",that.onFocus.bind(that));
                }, 100);
            }
        });
        host = this.getView().byId("chatList2");
        while(host.getItems().length > aArr.length ) {
            host.removeItem(host.getItems()[host.getItems().length-1]);
        }
    },

    getRouter: function () {
        "use strict";
        return sap.ui.core.UIComponent.getRouterFor(this);
    },

    getFocusControlIndex : function () {
        var oControl,
            oFocusInfo,
            iFocus,
            iIndexFocus = -1,
            that = this,
            oModel = this.getView() && this.getView().getModel("AppState"),
            aArr,
            aParentChain = [];
        sFocusControlId = sap.ui.getCore().getCurrentFocusedControlId();
        oControl = sap.ui.getCore().byId(sFocusControlId);
        while (oControl && oControl.getParent()) {
            aParentChain.push(oControl.getId());
            oControl = oControl.getParent();
        }
        aArr = oModel.getProperty("/appState/chatList");
        aArr.forEach(function (oState, iIndex) {
            oControl = that.getControlByIndex(iIndex);
            if (oControl) {
                oFocusInfo = oControl.getFocusInfo();
                if (aParentChain.indexOf(oControl.getId()) >= 0) {
                    jQuery.sap.log.error("current focus control index " + iIndex);
                    iIndexFocus = iIndex;
                }
            }
        });
        return iIndexFocus;
    },

    onFocus : function(ev) {
        var idx = -1;
        var oModel = this.getView() && this.getView().getModel("AppState");
        var oFs;
        jQuery.sap.log.error("focus");
        //setTimeout(this.serializeUIState.bind(this) , 100);
        // find out the current control natively as even delayed detection does not work 
        this.getView().byId("chatList2").getItems().forEach(function (ctl,iIndex) {
            if (ctl.getFocusDomRef() === ev.currentTarget) {
                idx = iIndex;
                oFs = ctl.getFocusInfo();
            }
        });
        this.currentFocusIndex = idx;
        this.currentFocusInfo = oFs;
        jQuery.sap.log.error("focus index = " + idx);
        this.currentFocusIndex = idx;
        this.currentFocusInfo = oFs;
        this.setDataIfDifferent(oModel,"/appState/uiState/editForm/focusIndex", this.currentFocusIndex);
        this.setDataIfDifferent(oModel,"/appState/uiState/editForm/focusInfo", this.currentFocusInfo);
        jQuery.sap.log.error("in event current focus control index " + idx + " info " + JSON.stringify(oFs));
        
    },


    onInputChange : function (ev) {
        // this.getView().byId("search").attachLiveChange(this.handleChange.bind(this));
        // if the change is not in the last control and the focus is not in 
        // the last control and the last and next to last 
        var idx = ev.getSource().getParent().getItems().indexOf(ev.getSource()),
            oModel = this.getView() && this.getView().getModel("AppState"),
            oFs,
            ctl,
            that = this,
            aArr;
        oFs = ev.getSource().getFocusInfo();
        aArr = oModel.getProperty("/appState/chatList");
        jQuery.sap.log.error("now change");
        that.currentFocusIndex = idx; 
        that.currentFocusInfo = oFs;
        this.setDataIfDifferent(oModel,"/appState/uiState/editForm/focusIndex", this.currentFocusIndex);
        this.setDataIfDifferent(oModel,"/appState/uiState/editForm/focusInfo", this.currentFocusInfo);
        jQuery.sap.log.error("in event current focus control index " + idx + " info " + JSON.stringify(oFs));
        ctl = ev.getSource();
        setTimeout(function() {
            that.getView().byId("chatList2").getItems().forEach(function (ctl) {
                jQuery(ctl.getFocusDomRef()).bind("focus", that.onFocus.bind(that));
            });
        }, 100);
        this.alignControls();
        //setTimeout(this.serializeUIState.bind(this),100);
    },

    setDataIfDifferent : function (oModel, sPath, newData) {
        var oldData = oModel.getProperty(sPath);
        if (oldData === newData) {
            return;
        }
        if (!oldData || !newData && !(!oldData && !newData)) {
            oModel.setProperty(sPath,newData);
            return;
        }
        if (typeof oldData === "object" && JSON.stringify(oldData) === JSON.stringify(newData)) {
            return;
        }
        oModel.setProperty(sPath,newData);
    },

    alignListLength : function () {
        var oModel = this.getView() && this.getView().getModel("AppState"),
            idx = this.getFocusControlIndex(),
            that = this,
            aArr;
        if (!oModel) {
            return;
        }
        aArr = oModel.getProperty("/appState/chatList");
        jQuery.sap.log.error("align list length" + idx);
        while ((aArr.length > 3 && aArr.length > idx) && (aArr[aArr.length - 1].text === "") && (aArr[aArr.length - 2].text === ""))
        {
            aArr.splice(-1,1);
        }
        if ((aArr.length < 2) || ((aArr.length - 1) === idx) || (aArr[aArr.length - 1].text !== ""))
        {
           aArr.push({text : ""});
        }
    },    
    handleBtn1Press : function () {
        "use strict";
        this.getMyComponent().navTo("toView2");
    },

    getMyComponent: function () {
        "use strict";
        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
        return sap.ui.component(sComponentId);
    },

//
//    getControlByIndex : function (iIndex) {
//        var li;
//        if (iIndex < 0) {
//            li = this.getView().byId("chatList").getItems()[this.getView().byId("chatList").getItems().length - 1];
//            return li.getContent()[0];
//        }
//        jQuery.sap.log.error("iIndex is " + iIndex);
//        li = this.getView().byId("chatList").getItems()[iIndex];
//        if (li === undefined) {
//            return undefined;
//        }
//        return li.getContent()[0];
//    },

    getControlByIndex : function (iIndex) {
        var li;
        if (iIndex < 0) {
            return this.getView().byId("chatList2").getItems()[this.getView().byId("chatList2").getItems().length - 2];
        }  
        li = this.getView().byId("chatList2").getItems()[iIndex];
      
        if (li === undefined) {
            return undefined;
        }
        return li;
    },
    serializeUIState : function () {
        var oControl,
            oFocusInfo,
            iFocus,
            that = this,
            oModel = this.getView() && this.getView().getModel("AppState"),
            aArr,
            iIndex,
            aParentChain = [];
        jQuery.sap.log.error("serializeUIState");
        //oModel.setProperty("/appState/uiState/editForm/focusIndex", this.currentFocusIndex);
        //oModel.setProperty("/appState/uiState/editForm/focusInfo", this.currentFocusInfo);
        //jQuery.sap.log.error("serialize current focus control index " + this.currentFocusIndex + " info " + JSON.stringify(this.currentFocusInfo));
    },

    restoreUIState : function () {
        var oControl,
            oFocusInfo,
            iFocus,
            that = this,
            oModel = this.getView() && this.getView().getModel("AppState"),
            aArr;
        jQuery.sap.log.error("restoreUIState");
        iFocus = oModel.getProperty("/appState/uiState/editForm/focusIndex");
        iFI = oModel.getProperty("/appState/uiState/editForm/focusInfo");
        if (iFocus !== undefined && iFocus >= 0) {
            oControl = this.getControlByIndex(iFocus);
            if (!oControl) {
                return;
            }
            var oCurrentFI = oControl.getFocusInfo();
            jQuery.sap.log.error("current uistate " + JSON.stringify(oCurrentFI));
            jQuery.sap.log.error(" setting focus info on " + iFocus + " to " + JSON.stringify(iFI));
            if (iFI) {
                oCurrentFI.cursorPos = iFI.cursorPos;
                oCurrentFI.selectionEnd = iFI.selectionEnd;
                oCurrentFI.selectionStart = iFI.selectionStart;
                oControl.applyFocusInfo(oCurrentFI);
                setTimeout(function () {
                    jQuery.sap.log.error(" setting focus info on " + iFocus + " to " + JSON.stringify(oCurrentFI));
                    oControl.applyFocusInfo(oCurrentFI);
                    oControl.focus();
                },100);
            }
            oControl.focus();
        }
    },

    findIndex : function (sId, aArray) {
        "use strict";
        return aArray.reduce(function (prevValue, currentElement, index) {
            if (currentElement.Key === sId) {
                return index;
            }
            return prevValue;
        }, aArray.length);
    },

    onBtnBackPressed : function () {
        this.getMyComponent().navTo("displayFavorites");
    },

    onUndoPress : function () {
        "use strict";
        var aUndoStack,
            sLastKey,
            oModel;
        oModel = this.getView().getModel("AppState");
        this.getMyComponent().inEvent = true;
        // add the current model to the favorites (or update the values therein).  
        aUndoStack = oModel.getProperty("/appState/uiState/editForm/undoStack");
        aUndoStack.pop();
        this.getMyComponent().inEvent = false;
        if (aUndoStack.length > 0) {
            sLastKey = aUndoStack[aUndoStack.length - 1];
            this.getRouter().navTo("editForm", {iAppState : sLastKey});
        } else {
            this.getMyComponent().inEvent = true;
            oModel.setProperty("/appState/uiState/editForm/undoStackPresent", aUndoStack.length > 0);
            this.getMyComponent().inEvent = false;
        }
    },


    onAfterRendering : function () {
//        var this = that;
//        $("input").on("focus", function (oEvent) {
//                  that.serializeUIState();
//              });
//        $("input").on("focus", this.serializeUIState.bind(this));
//        $("input").change(this.serializeUIState.bind(this));
    },

    onFillPress : function () {
        "use strict";
        var aUndoStack,
            sLastKey,
            oModel,
            that = this;
        // register a focus change event via jQuery
        this.getView().getModel("AppState").setProperty("/appState/chatList", [{ text : "What do we do?"},
                                                                                 { text : "Save the state before it's to late!"},
                                                                                 { text : "When do we save?"},
                                                                                 { text : "Always, always, on every state change!"},
                                                                                 { text : ""},
                                                                                 { text : "If it's worth asking the user, it's worth remembering."},
                                                                                 { text : "  Alan Cooper"},
                                                                               ]);
        this.getView().byId("chatList2").getItems()[0].focus();
        this.alignControls();
    },
    

    onDeletePress : function () {
        "use strict";
        var aUndoStack,
            sLastKey,
            oModel,
            that = this;
        // register a focus change event via jQuery
        this.getView().getModel("AppState").setProperty("/appState/chatList", [{text : ""}]);
        this.getView().byId("chatList2").getItems()[0].focus();
        this.alignControls();
//        $("input").on("focus", function (oEvent) {
//            that.serializeUIState();
//        });
//        $("input").on("focus", this.serializeUIState.bind(this));
//        $("input").change(this.serializeUIState.bind(this));
         
//        oModel = this.getView().getModel("AppState");
//        this.getMyComponent().inEvent = true;
//        aUndoStack = this.getView().byId("f01x").getFocusInfo();
//        aUndoStack.selectionStart = 10; 
//        aUndoStack.cursorPos = 10;
//        this.getView().byId("f01x").applyFocusInfo(aUndoStack);
//        this.getView().byId("f01x").focus();
        return;
        // add the current model to the favorites (or update the values therein).  
        aUndoStack = oModel.getProperty("/appState/uiState/editForm/undoStack");
        aUndoStack.pop();
        this.getMyComponent().inEvent = false;
        if (aUndoStack.length > 0) {
            sLastKey = aUndoStack[aUndoStack.length - 1];
            this.getRouter().navTo("editIconFavorite", {iAppState : sLastKey});
        } else {
            this.getMyComponent().inEvent = true;
            oModel.setProperty("/appState/uiState/editForm/undoStackPresent", aUndoStack.length > 0);
            this.getMyComponent().inEvent = false;
        }
        //oModel.setProperty("/appState/undoStack", aUndoStack);
        //? pop sLastKey = oUndoStack.pop();
    }

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Detail
*/
//onAfterRendering: function() {
//
//},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Detail
*/
//onExit: function() {
//
//}


});