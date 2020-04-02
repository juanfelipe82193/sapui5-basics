/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/m/Dialog","sap/m/Button","sap/m/Text","sap/m/MessageBox","sap/fe/core/actions/messageHandling"],function(D,B,T,M,m){"use strict";function c(C,p){var P=p||{},l=sap.ui.getCore().getLibraryResourceBundle("sap.fe.core"),r=typeof P.bPreserveChanges==="undefined"||(typeof P.bPreserveChanges==="boolean"&&P.bPreserveChanges);function o(O){if(O){var b=C.getModel(),e=b.bindContext(C.getPath()+"/DraftAdministrativeData").getBoundContext();return e.requestObject().then(function(f){if(f){m.removeUnboundTransitionMessages();var i=f.InProcessByUserDescription||f.InProcessByUser;if(i){M.error(l.getText("OBJECT_PAGE_DRAFT_LOCKED_BY_USER",i));throw new Error(l.getText("OBJECT_PAGE_DRAFT_LOCKED_BY_USER",i));}else{return s(f).then(function(){return C.executeDraftEditAction(false);});}}});}return Promise.reject(new Error("Draft creation aborted for document: "+C.getPath()));}function s(b){return new Promise(function(e,f){var i=b.CreatedByUserDescription||b.CreatedByUser,g=new D({title:l.getText("OBJECT_PAGE_WARNING"),state:"Warning",content:new T({text:l.getText("OBJECT_PAGE_DRAFT_UNSAVED_CHANGES",i)}),beginButton:new B({text:l.getText("OBJECT_PAGE_EDIT"),type:"Emphasized",press:function(){g.close();e(true);}}),endButton:new B({text:l.getText("OBJECT_PAGE_CANCEL"),press:function(){g.close();f("Draft creation aborted for document: "+C.getPath());}}),afterClose:function(){g.destroy();}});g.addStyleClass("sapUiContentPadding");g.open();});}if(!C){return Promise.reject(new Error("Binding context to active document is required"));}if(!C.executeDraftEditAction){return Promise.reject(new Error("Draft is not supported by document: "+C.getPath()));}return Promise.resolve(P.fnBeforeCreateDraftFromActiveDocument?P.fnBeforeCreateDraftFromActiveDocument(C,r):true).then(function(e){if(!e){throw new Error("Draft creation was aborted by extension for document: "+C.getPath());}return C.executeDraftEditAction(r).catch(function(R){if(r&&R.status===409){return Promise.resolve(P.fnWhenDecisionToOverwriteDocumentIsRequired?P.fnWhenDecisionToOverwriteDocumentIsRequired():true).then(o);}else{throw new Error(R);}});}).then(function(b){return Promise.resolve(P.fnAfterCreateDraftFromActiveDocument?P.fnAfterCreateDraftFromActiveDocument(C,b):b);}).catch(function(e){return Promise.reject(e);});}function a(C,p){var P=p||{};if(!C){return Promise.reject(new Error("Binding context to draft document is required"));}if(!C.executeDraftActivationAction){return Promise.reject(new Error("Activation action is not supported for document : "+C.getPath()));}return Promise.resolve(P.fnBeforeActivateDocument?P.fnBeforeActivateDocument(C):true).then(function(e){if(!e){return Promise.reject(new Error("Activation of the document was aborted by extension for document: "+C.getPath()));}if(!C.executeDraftPreparationAction){return C.executeDraftActivationAction();}return C.executeDraftPreparationAction().then(function(){return C.executeDraftActivationAction();}).catch(function(b){return Promise.reject(b);});}).then(function(A){return Promise.resolve(P.fnAfterActivateDocument?P.fnAfterActivateDocument(C,A):A);}).catch(function(e){return Promise.reject(e);});}var d={createDraftFromActiveDocument:c,activateDocument:a};return d;});
