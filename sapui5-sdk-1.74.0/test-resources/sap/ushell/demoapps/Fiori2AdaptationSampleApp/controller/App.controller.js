
sap.ui.define([
   "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
   "use strict";
   return Controller.extend("sap.ui.demo.wt.controller.App", {
       
      onUpdateTitle : function() {
        this.getView().byId("page1").setTitle("Page1Updated");
      },
      toDetailPage : function () {
       var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("page2");
      },
      toDetailDetailPage : function () {
          var oPage3 = this.getView().byId("page3");
          this.getView().byId("app").to(oPage3);
      },
      back : function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo(" ");
          MessageToast.show("AppCustomBack")
      }
   });
});