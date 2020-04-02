sap.ui.define(["sap/base/util/ObjectPath","sap/base/util/extend","sap/base/Log"],function(O,e,L){"use strict";var S={};S.setStaticShareData=function(f,s){var r=sap.ui.getCore().getLibraryResourceBundle("sap.m");s.setProperty("/emailButtonText",r.getText("SEMANTIC_CONTROL_SEND_EMAIL"));s.setProperty("/jamButtonText",r.getText("SEMANTIC_CONTROL_SHARE_IN_JAM"));var g=O.get("sap.ushell.Container.getUser");s.setProperty("/jamVisible",!!g&&g().isJamActive());};S.openJamShareDialog=function(t){if(sap.ushell&&sap.ushell.Container&&sap.ushell.Container.runningInIframe&&sap.ushell.Container.runningInIframe()){sap.ushell.Container.getFLPUrl(true).then(function(u){d(t,u);},function(E){L.error("Could not retrieve cFLP URL for the sharing dialog (dialog will not be opened)",E,"sap.suite.ui.generic.template.lib.ShareUtils");});}else{d(t,document.URL);}};function d(t,u){var s=sap.ui.getCore().createComponent({name:"sap.collaboration.components.fiori.sharing.dialog",settings:{object:{id:u,share:t}}});s.open();}S.openSharePopup=function(c,b,f){var s;f.onCancelPressed=function(){s.close();};s=c.getDialogFragment("sap.suite.ui.generic.template.fragments.ShareSheet",f,"share",S.setStaticShareData);var o=s.getModel("share");var n=e(o.getData(),f.getModelData());o.setData(n);s.openBy(b);return s;};S.getCustomUrl=function(){if(!window.hasher){sap.ui.require("sap/ui/thirdparty/hasher");}var h=window.hasher.getHash();return h?("#"+h):window.location.href;};return S;});
