/*global sap, jQuery */
//define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.ValidateUrlMessagePopoverSample.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

//new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.ValidateUrlMessagePopoverSample.Component", {

 oMainView : null,

 // use inline declaration instead of component.json to save 1 round trip
 metadata : {

     version : "1.74.0",

     library : "sap.ushell.demo.ValidateUrlMessagePopoverSample",

     dependencies : {
         libs : [ "sap.m" ],
         components : []
     },
     config: {
         "title": "ValidateUrlMessagePopoverSample",
         //"resourceBundle" : "i18n/i18n.properties",
         //"titleResource" : "shellTitle",
         "icon" : "sap-icon://Fiori2/F0429"
     }
 // properties : {
 // // the shell passes application startup parameters using the
 // // componentData object
 // componentData : {
 // type : "object"
 // }
 // }
 },

 createContent : function () {
     "use strict";
     var oMainView = sap.ui.view({
         type : sap.ui.core.mvc.ViewType.XML,
         viewName : "sap.ushell.demo.ValidateUrlMessagePopoverSample.Main"
     });
     this.oMainView = oMainView;
     return oMainView;
 }
});

