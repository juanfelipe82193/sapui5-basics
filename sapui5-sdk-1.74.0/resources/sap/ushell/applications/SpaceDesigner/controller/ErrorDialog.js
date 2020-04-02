// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/Fragment","sap/ui/model/json/JSONModel","sap/m/MessageToast"],function(F,J,M){"use strict";var c={onAfterClose:function(e){e.getSource().destroy();},onShowDetails:function(e){e.getSource().getModel().setProperty("/showDetails",true);},onConfirm:function(e){e.getSource().getParent().close();},onCopy:function(e){var t=document.createElement("textarea");try{t.contentEditable=true;t.readonly=false;t.textContent=e.getSource().getModel().getProperty("/description");document.documentElement.appendChild(t);if(navigator.userAgent.match(/ipad|iphone/i)){var r=document.createRange();r.selectNodeContents(t);window.getSelection().removeAllRanges();window.getSelection().addRange(r);t.setSelectionRange(0,999999);}else{jQuery(t).select();}document.execCommand("copy");M.show(e.getSource().getModel("i18n").getResourceBundle().getText("Message.ClipboardCopySuccess"),{closeOnBrowserNavigation:false});}catch(E){M.show(e.getSource().getModel("i18n").getResourceBundle().getText("Message.ClipboardCopyFail"),{closeOnBrowserNavigation:false});}finally{jQuery(t).remove();}}};function o(e,i){var r=JSON.parse(e.responseText);var m=new J({message:r.error.message.value,description:JSON.stringify(r,null,3).replace(/\{|\}/g,""),statusCode:e.statusCode,statusText:e.statusText,showDetails:false});F.load({name:"sap.ushell.applications.SpaceDesigner.view.ErrorDialog",controller:c}).then(function(d){d.setModel(m);d.setModel(i,"i18n");d.open();});}return{open:o};});
