/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2018 SAP SE. All rights reserved
*/
sap.ui.define(['sap/ui/core/mvc/Controller','sap/apf/modeler/ui/utils/constants'],function(M,c){'use strict';return M.extend("sap.apf.modeler.ui.controller.toolbar",{onInit:function(){this.oCoreApi=this.getView().getViewData().oConfigListInstance.oCoreApi;this.oConfigListInstance=this.getView().getViewData().oConfigListInstance;this._setDisplayText();},_setDisplayText:function(){this.byId("idAddButton").setText(this.oCoreApi.getText("addButton"));this.byId("idCopyButton").setText(this.oCoreApi.getText("copyButton"));this.byId("idDeleteButton").setText(this.oCoreApi.getText("deleteButton"));this.byId("idMoveUp").setTooltip(this.oCoreApi.getText("moveUp"));this.byId("idMoveDown").setTooltip(this.oCoreApi.getText("moveDown"));},enableCopyDeleteButton:function(){if(!this.byId("idCopyButton").getEnabled()){this.byId("idCopyButton").setEnabled(true);}if(!this.byId("idDeleteButton").getEnabled()){this.byId("idDeleteButton").setEnabled(true);}},disableCopyDeleteButton:function(){if(this.byId("idCopyButton").getEnabled()){this.byId("idCopyButton").setEnabled(false);}if(this.byId("idDeleteButton").getEnabled()){this.byId("idDeleteButton").setEnabled(false);}},_setAddMenuText:function(){sap.ui.core.Fragment.byId("idAddMenuFragment","idNewConfig").setText(this.oCoreApi.getText("newConfiguration"));sap.ui.core.Fragment.byId("idAddMenuFragment","idNewFacetFilter").setText(this.oCoreApi.getText("newFacetFilter"));sap.ui.core.Fragment.byId("idAddMenuFragment","idNewCategory").setText(this.oCoreApi.getText("newCategory"));sap.ui.core.Fragment.byId("idAddMenuFragment","idNewNavigationTarget").setText(this.oCoreApi.getText("newNavigationTarget"));sap.ui.core.Fragment.byId("idAddMenuFragment","idStep").setText(this.oCoreApi.getText("step"));sap.ui.core.Fragment.byId("idAddMenuFragment","idNewStep").setText(this.oCoreApi.getText("newStep"));sap.ui.core.Fragment.byId("idAddMenuFragment","idExistingStep").setText(this.oCoreApi.getText("existingStep"));sap.ui.core.Fragment.byId("idAddMenuFragment","idHierarchicalStep").setText(this.oCoreApi.getText("hierarchicalStep"));sap.ui.core.Fragment.byId("idAddMenuFragment","idNewRepresentation").setText(this.oCoreApi.getText("newRepresentation"));},_setExistingStepDialogText:function(){sap.ui.core.Fragment.byId("idExistingStepDialogFragment","idExistingStepDialog").setTitle(this.oCoreApi.getText("existingStepDialogTitle"));},_enableDisableAddMenuItems:function(s,a){var f;var A=a.getItems();var n,m={};if(this.oConfigListInstance.configEditor){f=Object.keys(this.oConfigListInstance.configEditor.getFilterOption())[0];}if(this.oConfigListInstance.configurationHandler.getList().length===0||s===null){n="default";}else{n=s.nodeObjectType;}m["default"]=1;m[c.configurationObjectTypes.CONFIGURATION]=4;m[c.configurationObjectTypes.FACETFILTER]=4;m[c.configurationObjectTypes.SMARTFILTERBAR]=4;m[c.configurationObjectTypes.CATEGORY]=5;m[c.configurationObjectTypes.STEP]=6;m[c.configurationObjectTypes.REPRESENTATION]=6;m[c.configurationObjectTypes.NAVIGATIONTARGET]=4;A.forEach(function(o,i){if(i<m[n]){o.setEnabled(true);if(f!==c.configurationObjectTypes.FACETFILTER&&i===1){o.setEnabled(false);}}else{o.setEnabled(false);}});},_handlePressAddButton:function(e){var s;var S=this,i=true;if(this.oConfigListInstance.getView().byId("idConfigDetailData").getContent().length>=1){s=(typeof this.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController==="function")?this.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController():undefined;}e.getSource().$().blur();var n=sap.apf.modeler.ui.utils.navigationHandler.getInstance();if(s!==undefined){i=typeof s.getValidationState==="function"?s.getValidationState.call(s):true;}var a=this.oConfigListInstance.configEditor?jQuery.extend(true,{},this.oConfigListInstance.configEditor):undefined;this.oConfigListInstance.bIsSaved=a?a.isSaved():undefined;var b=false;var o=this.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(this.oConfigListInstance.oTreeInstance.getSelectedItem());var A=e.getSource();var d=function(){if(!this.addMenu){this.addMenu=new sap.ui.xmlfragment("idAddMenuFragment","sap.apf.modeler.ui.fragment.addMenu",this);this.getView().addDependent(this.addMenu);this._setAddMenuText();}var f=sap.ui.core.Popup.Dock;this._enableDisableAddMenuItems(o,this.addMenu);this.addMenu.open(false,A,f.BeginTop,f.BeginBottom,A);};if(!i){n.throwMandatoryPopup(S.oConfigListInstance,{yes:function(){var p=S.oConfigListInstance.oTreeInstance.getParentNodeContext(o);S.oConfigListInstance.configEditor=S.oConfigListInstance.configurationHandler.restoreMemorizedConfiguration(p.configId);if(S.oConfigListInstance.bIsSaved===false&&S.oConfigListInstance.configEditor){S.oConfigListInstance.configEditor.setIsUnsaved();}var N=S.oConfigListInstance._navMandatoryResetState(S.oConfigListInstance);if(!N.isNewView){d.call(S);}}});b=true;}if(!b){d.call(S);}},_handleAddMenuItemPress:function(e){var i=this.addMenu.getItems();var a=e.getParameters("item");var n;var N={"idAddMenuFragment--idNewFacetFilter":c.configurationObjectTypes.FACETFILTER,"idAddMenuFragment--idNewCategory":c.configurationObjectTypes.CATEGORY,"idAddMenuFragment--idNewStep":c.configurationObjectTypes.STEP,"idAddMenuFragment--idHierarchicalStep":c.configurationObjectTypes.STEP,"idAddMenuFragment--idNewRepresentation":c.configurationObjectTypes.REPRESENTATION,"idAddMenuFragment--idNewConfig":c.configurationObjectTypes.CONFIGURATION,"idAddMenuFragment--idNewNavigationTarget":c.configurationObjectTypes.NAVIGATIONTARGET,"default":c.configurationObjectTypes.CONFIGURATION};i.forEach(function(o){if(o.getId()===a.id){n=N[o.getId()];}else if(o.getSubmenu()){o.getSubmenu().getItems().forEach(function(o){if(o.getId()===a.id){n=N[o.getId()];}});}});var I=false;if(a.id==="idAddMenuFragment--idExistingStep"){this._handleAddExistingStepPress();}else if(a.id!=="idAddMenuFragment--idStep"&&n!==undefined){if(a.id==="idAddMenuFragment--idHierarchicalStep"){I=true;}this.oConfigListInstance.oTreeInstance.addNodeInTree(n,undefined,I);}},_copyConfiguration:function(C,n){var o=this.oConfigListInstance.configurationHandler.getConfiguration(C);var a={},b;a.AnalyticalConfiguration=o.AnalyticalConfiguration;a.name="< "+o.AnalyticalConfigurationName+" >";a.Application=o.Application;a.type=c.configurationObjectTypes.CONFIGURATION;a.bIsLoaded=false;a.bToggleState=false;a.isSelected=true;a.expanded=true;a.selectable=true;a.hasExpander=true;this.oConfigListInstance.oModel.getData().aConfigDetails.push(a);this.oConfigListInstance.oModel.updateBindings();b=this.oConfigListInstance.oTreeInstance.getModel().getContext(n);this.oConfigListInstance.selectedNode=this.oConfigListInstance.oTreeInstance.getItemNodeByContextWithoutExpand(b.sPath);this.oConfigListInstance.modelUpdateDeferred[this.oConfigListInstance.oModel.getData().aConfigDetails.length-1]=new jQuery.Deferred();var d={appId:this.oConfigListInstance.appId,configId:C};sap.ui.core.UIComponent.getRouterFor(this.oConfigListInstance).navTo(a.type,d,true);},_handlePressCopyButton:function(e){var d=jQuery.Deferred();var s,a;var S=this,b=true;if(this.oConfigListInstance.getView().byId("idConfigDetailData").getContent().length>=1){s=(typeof this.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController==="function")?this.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController():undefined;}e.getSource().$().blur();var n=sap.apf.modeler.ui.utils.navigationHandler.getInstance();if(s!==undefined){b=typeof s.getValidationState==="function"?s.getValidationState.call(s):true;}var f=this.oConfigListInstance.configEditor?jQuery.extend(true,{},this.oConfigListInstance.configEditor):undefined;this.oConfigListInstance.bIsSaved=f?f.isSaved():undefined;var g=false;var h=function(){var C=this;var N;var m=this.oTreeInstance.getAPFTreeNodeContext(this.oTreeInstance.getSelectedItem()||this.selectedNode);this.selectedNode=this.oTreeInstance.getSelectedItem()||this.selectedNode;var p,q,r,t,O,u,v,w,x,y;r=m.nodeContext;switch(m.nodeObjectType){case c.configurationObjectTypes.FACETFILTER:var F=this.oCoreApi.getText("copyOf")+"  "+m.nodeTitle;var z=this.configEditor.copyFacetFilter(m.nodeAPFId);var A=this.configEditor.getFacetFilter(z);var T=sap.apf.modeler.ui.utils.TranslationFormatMap.FACETFILTER_LABEL;this.oTextPool.setTextAsPromise(F,T).done(function(i){A.setLabelKey(i);O=r.split("/");a=O[2];u=O[6];var j=this.oModel.getData().aConfigDetails[a].configData[0].filters[u];j.isSelected=false;var h1=jQuery.extend(true,{},j);h1.id=z;h1.name="< "+F+" >";h1.isSelected=true;t=this.oModel.getData().aConfigDetails[a].configData[0].filters.length;this.oModel.getData().aConfigDetails[a].configData[0].filters.push(h1);O[6]=t;q=O.join("/");g1();}.bind(this));break;case c.configurationObjectTypes.CATEGORY:var B=this.oCoreApi.getText("copyOf")+"  "+m.nodeTitle;var D=this.configEditor.copyCategory(m.nodeAPFId);var E=sap.apf.modeler.ui.utils.TranslationFormatMap.CATEGORY_TITLE;this.oTextPool.setTextAsPromise(B,E).done(function(h1){var i1={labelKey:h1};this.configEditor.setCategory(i1,D);O=r.split("/");a=O[2];v=O[6];var j1=[];var k1=this.configEditor.getSteps();k1.forEach(function(o1){if(C.configEditor.getCategoriesForStep(o1.getId())[0]===D){j1.push(o1.getId());}});var l1=this.oModel.getData().aConfigDetails[a].configData[1].categories[v];l1.isSelected=false;var m1=jQuery.extend(true,{},l1);if(m1.steps){for(var i=0;i<m1.steps.length;i++){m1.steps[i].id=j1[i];var n1=C.configEditor.getStep(j1[i]);N=n1.getRepresentations();if(m1.steps[i].representations){for(var j=0;j<m1.steps[i].representations.length;j++){m1.steps[i].representations[j].id=N[j].getId();}}}}m1.id=D;m1.name="< "+B+" >";m1.isSelected=true;t=this.oModel.getData().aConfigDetails[a].configData[1].categories.length;this.oModel.getData().aConfigDetails[a].configData[1].categories.push(m1);O[6]=t;q=O.join("/");g1();}.bind(this));break;case c.configurationObjectTypes.NAVIGATIONTARGET:var G=this.oCoreApi.getText("copyOf")+"  "+m.nodeTitle;var H=this.configEditor.copyNavigationTarget(m.nodeAPFId);O=r.split("/");a=O[2];w=O[6];var I=this.oModel.getData().aConfigDetails[a].configData[2].navTargets[w];I.isSelected=false;var J=jQuery.extend(true,{},I);J.id=H;J.name="< "+G+" >";J.isSelected=true;t=this.oModel.getData().aConfigDetails[a].configData[2].navTargets.length;this.oModel.getData().aConfigDetails[a].configData[2].navTargets.push(J);O[6]=t;q=O.join("/");g1();S.oConfigListInstance._setNavigationTargetName({configIndexInTree:a});break;case c.configurationObjectTypes.STEP:var K=this.oCoreApi.getText("copyOf")+"  "+m.nodeTitle;var L=this.configEditor.copyStep(m.nodeAPFId);var P=this.configEditor.getCategoriesForStep(L);var Q=this.configEditor.getStep(L);var R=sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_TITLE;this.oTextPool.setTextAsPromise(K,R).done(function(i){var j;Q.setTitleId(i);O=r.split("/");a=O[2];v=O[6];x=O[8];var h1=this.oModel.getData().aConfigDetails[a].configData[1].categories[v].steps[x];h1.isSelected=false;var i1=jQuery.extend(true,{},h1);N=Q.getRepresentations();i1.id=L;i1.name="< "+K+" >";if(i1.representations){for(j=0;j<i1.representations.length;j++){i1.representations[j].id=N[j].getId();}}t=this.oModel.getData().aConfigDetails[a].configData[1].categories[v].steps.length;O[8]=t;q=O.join("/");for(var j1=0;j1<P.length;j1++){var k1=jQuery.extend(true,{},i1);var l1={arguments:{configId:S.oConfigListInstance.configId,categoryId:P[j1]}};var m1=S.oConfigListInstance.getSPathFromURL(l1).sPath.split("/");var n1=m1[6];this.oModel.getData().aConfigDetails[a].configData[1].categories[n1].steps.push(k1);}this.oModel.getData().aConfigDetails[a].configData[1].categories[v].steps[t].isSelected=true;g1();}.bind(this));break;case c.configurationObjectTypes.REPRESENTATION:O=r.split("/");a=O[2];v=O[6];x=O[8];y=O[10];var U=this.oModel.getData().aConfigDetails[a].configData[1].categories[v].steps[x].id;var V=this.configEditor.getStep(U);var W=this.configEditor.getCategoriesForStep(U);this.oModel.getData().aConfigDetails[a].configData[1].categories[v].steps[x].representations[y].isSelected=false;var X=this.oModel.getData().aConfigDetails[a].configData[1].categories[v].steps[x].representations[y];var Y=jQuery.extend(true,{},X);var Z=V.copyRepresentation(Y.id);Y.id=Z;t=this.oModel.getData().aConfigDetails[a].configData[1].categories[v].steps[x].representations.length;O[10]=t;q=O.join("/");for(var $=0;$<W.length;$++){var _=jQuery.extend(true,{},Y);var a1={arguments:{configId:S.oConfigListInstance.configId,categoryId:W[$],stepId:U}};var b1=S.oConfigListInstance.getSPathFromURL(a1).sPath.split("/");var c1=b1[6];var d1=b1[8];this.oModel.getData().aConfigDetails[a].configData[1].categories[c1].steps[d1].representations.push(_);}this.oModel.getData().aConfigDetails[a].configData[1].categories[v].steps[x].representations[t].isSelected=true;g1();break;case c.configurationObjectTypes.CONFIGURATION:var e1=this.oCoreApi.getText("copyOf")+"  "+m.nodeTitle;O=r.split("/");a=O[2];var f1=this.oModel.getData().aConfigDetails[a];f1.isSelected=false;O[2]=this.oModel.getData().aConfigDetails.length;q=O.join("/");this.configurationHandler.copyConfiguration(m.nodeAPFId,function(i){var j={AnalyticalConfigurationName:e1};var h1=C.configurationHandler.setConfiguration(j,i);C.configTitle=e1;C.configurationHandler.loadConfiguration(h1,function(i1){var e1=C.configTitle;var j1=sap.apf.modeler.ui.utils.TranslationFormatMap.APPLICATION_TITLE;C.configurationHandler.getTextPool().setTextAsPromise(e1,j1).done(function(k1){i1.setApplicationTitle(k1);});});S._copyConfiguration(i,q);});break;default:break;}function g1(){C.oModel.updateBindings();p=C.oTreeInstance.getModel().getContext(q);C.selectedNode=C.oTreeInstance.getItemNodeByContextWithoutExpand(p.sPath);var i=C.oTreeInstance.getAPFTreeNodeContext(C.selectedNode);var j=C.oTreeInstance.getParentNodeContext(i);C.navigateToDifferntView(j,i);C.configEditor.setIsUnsaved();d.resolve();}};var k=function(){var i=new sap.m.Label().addStyleClass("noConfigSelected");i.setText(S.oConfigListInstance.oCoreApi.getText("noConfigSelected"));i.placeAt(S.oConfigListInstance.byId("idConfigDetailData"));S.oConfigListInstance.toolbarController.disableCopyDeleteButton();S.oConfigListInstance._enableDisableExportAndExecuteButton();};var o;if(!b){n.throwMandatoryPopup(S.oConfigListInstance,{yes:function(){var i=S.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(S.oConfigListInstance.oTreeInstance.getSelectedItem());var p=S.oConfigListInstance.oTreeInstance.getParentNodeContext(i);S.oConfigListInstance.bIsDifferntConfig=S.oConfigListInstance.oTreeInstance.isConfigurationSwitched(S.oConfigListInstance.oPreviousSelectedNode,S.oConfigListInstance.selectedNode);S.oConfigListInstance.configEditor=S.oConfigListInstance.configurationHandler.restoreMemorizedConfiguration(p.configId);if(S.oConfigListInstance.bIsSaved===false&&S.oConfigListInstance.configEditor){S.oConfigListInstance.configEditor.setIsUnsaved();}if(S.oConfigListInstance.bIsDifferntConfig===false){var s=(typeof S.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController==="function")?S.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController():undefined;var j=S.oConfigListInstance._isNewSubView(s.getView().getViewData().oParams);if(!j){h.call(S.oConfigListInstance);S.oConfigListInstance._navHandleExpandDelete.call(S.oConfigListInstance,S.oConfigListInstance.oSelectedNodeDetails,p);}else{S.oConfigListInstance.handleConfirmDeletion();}}else{var N=S.oConfigListInstance._navMandatoryResetState(S.oConfigListInstance);if(!N.isNewView){if(N.bIsSaved===false){o(S.oConfigListInstance);}else{h.call(S.oConfigListInstance);}}}}});g=true;}var l;if(s.getView().getViewData().oParams.name==="configuration"){l=true;}o=function(i){n.throwLossOfDataPopup(i,{yes:function(j){S.oConfigListInstance._navSaveState(function(){j(function(m){if(S.oConfigListInstance.selectedNode){var B=S.oConfigListInstance.selectedNode._getBindingContext().sPath;var C=B.split("/");var a=C[2];}S.oConfigListInstance.oModel.getData().aConfigDetails[a].AnalyticalConfiguration=S.oConfigListInstance.configId;S.oConfigListInstance.oModel.updateBindings();h.call(S.oConfigListInstance);});});},no:function(){var i={appId:S.oConfigListInstance.appId,configId:S.oConfigListInstance.configId};var s=(typeof S.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController==="function")?S.oConfigListInstance.getView().byId("idConfigDetailData").getContent()[0].getController():undefined;var l=(s.getView().getViewData().oParams.name==="configuration")?true:false;if(S.oConfigListInstance.configId.indexOf(c.configurationObjectTypes.ISNEWCONFIG)===0){S.oConfigListInstance._navHandleExpandDelete.call(S.oConfigListInstance,{},i,l);S.oConfigListInstance.clearTitleAndBreadCrumb();S.oConfigListInstance.byId("idConfigDetailData").removeAllContent();k();}else{S.oConfigListInstance._navConfigResetState(S.oConfigListInstance,function(){h.call(S.oConfigListInstance);});}}});};if(S.oConfigListInstance.bIsSaved===false&&b&&l){o(S.oConfigListInstance);g=true;}if(!g){h.call(S.oConfigListInstance);}return d.promise();},_handlePressDeleteButton:function(e){var d;var s=this.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(this.oConfigListInstance.oTreeInstance.getSelectedItem());var n=this.oCoreApi.getText(s.nodeObjectType);e.getSource().$().blur();if(s.nodeObjectType===c.configurationObjectTypes.STEP){d=this.oCoreApi.getText("confirmStepDeletion",[s.nodeTitle]);}else{d=this.oCoreApi.getText("confirmDeletion",[n,s.nodeTitle]);}this._openDeleteConfirmationDialog(d);},_openDeleteConfirmationDialog:function(d){var s=this;var C=jQuery.extend(s.oConfigListInstance,{closeDialog:s.closeDialog.bind(s)});if(!this.confirmationDialog){this.confirmationDialog=sap.ui.xmlfragment("idConfigConfirmationDialogFragment","sap.apf.modeler.ui.fragment.deleteConfirmationDialog",C);this.getView().addDependent(this.confirmationDialog);this._setConfirmationDialogText();}var a=new sap.m.Text();a.setText(d);this.confirmationDialog.removeAllContent();this.confirmationDialog.addContent(a);this.confirmationDialog.addAriaDescribedBy(a);jQuery.sap.syncStyleClass("sapUiSizeCompact",this.getView(),this.confirmationDialog);this.confirmationDialog.open();},closeDialog:function(){if(this.confirmationDialog&&this.confirmationDialog.isOpen()){this.confirmationDialog.close();}},_setConfirmationDialogText:function(){sap.ui.core.Fragment.byId("idConfigConfirmationDialogFragment","idDeleteConfirmation").setTitle(this.oCoreApi.getText("confirmation"));sap.ui.core.Fragment.byId("idConfigConfirmationDialogFragment","idDeleteButton").setText(this.oCoreApi.getText("deleteButton"));sap.ui.core.Fragment.byId("idConfigConfirmationDialogFragment","idCancelButtonDialog").setText(this.oCoreApi.getText("cancel"));},_handlePressMoveUpButton:function(){this.bIsDown=false;var s=this.oConfigListInstance.oTreeInstance.getSelectedItem();if(s!==null){var a=this.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(s);if(a!==undefined){this._moveUpOrDown(a,this.bIsDown);}}},_handlePressMoveDownButton:function(){this.bIsDown=true;var s=this.oConfigListInstance.oTreeInstance.getSelectedItem();if(s!==null){var a=this.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(s);if(a!==undefined){this._moveUpOrDown(a,this.bIsDown);}}},_moveUpOrDown:function(s,i){var a=s.nodeObjectType;var b=s.nodeAPFId;var n=s.nodeContext;var d=n.split('/')[2];var o,e,t,T,l;var S=false;var f=n.split('/')[n.split('/').length-1];switch(a){case c.configurationObjectTypes.FACETFILTER:o=this.oConfigListInstance.oModel.getData().aConfigDetails[d].configData[0].filters;l=o.length;if(i){if(parseInt(f,10)!==(l-1)){this.oConfigListInstance.configEditor.moveFacetFilterUpOrDown(b,1);e=parseInt(f,10)+1;S=true;}}else{if(parseInt(f,10)!==0){this.oConfigListInstance.configEditor.moveFacetFilterUpOrDown(b,-1);e=parseInt(f,10)-1;S=true;}}break;case c.configurationObjectTypes.CATEGORY:o=this.oConfigListInstance.oModel.getData().aConfigDetails[d].configData[1].categories;l=o.length;if(i){if(parseInt(f,10)!==(l-1)){this.oConfigListInstance.configEditor.moveCategoryUpOrDown(b,1);e=parseInt(f,10)+1;S=true;}}else{if(parseInt(f,10)!==0){this.oConfigListInstance.configEditor.moveCategoryUpOrDown(b,-1);e=parseInt(f,10)-1;S=true;}}break;case c.configurationObjectTypes.NAVIGATIONTARGET:o=this.oConfigListInstance.oModel.getData().aConfigDetails[d].configData[2].navTargets;l=o.length;if(i){if(parseInt(f,10)!==(l-1)){this.oConfigListInstance.configEditor.moveNavigationTargetUpOrDown(b,1);e=parseInt(f,10)+1;S=true;}}else{if(parseInt(f,10)!==0){this.oConfigListInstance.configEditor.moveNavigationTargetUpOrDown(b,-1);e=parseInt(f,10)-1;S=true;}}break;case c.configurationObjectTypes.STEP:var g=n.split('/')[6];var h=this.oConfigListInstance.oModel.getData().aConfigDetails[d].configData[1].categories[g];o=h.steps;l=o.length;if(i){if(parseInt(f,10)!==(l-1)){this.oConfigListInstance.configEditor.moveCategoryStepAssignmentUpOrDown(h.id,b,1);e=parseInt(f,10)+1;S=true;}}else{if(parseInt(f,10)!==0){this.oConfigListInstance.configEditor.moveCategoryStepAssignmentUpOrDown(h.id,b,-1);e=parseInt(f,10)-1;S=true;}}break;case c.configurationObjectTypes.REPRESENTATION:var j=this.oConfigListInstance.oTreeInstance.getSelectedItem();var k=j.getParentNode();var m=this.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(k).nodeAPFId;var p=this.oConfigListInstance.configEditor.getStep(m);g=n.split('/')[6];var q=n.split('/')[8];o=this.oConfigListInstance.oModel.getData().aConfigDetails[d].configData[1].categories[g].steps[q].representations;l=o.length;if(i){if(parseInt(f,10)!==(l-1)){p.moveRepresentationUpOrDown(b,1);e=parseInt(f,10)+1;S=true;}}else{if(parseInt(f,10)!==0){p.moveRepresentationUpOrDown(b,-1);e=parseInt(f,10)-1;S=true;}}break;default:break;}if(S){t=o[f];T=o[e];o[e]=t;o[f]=T;this.oConfigListInstance.oModel.updateBindings();this.oConfigListInstance.configEditor.setIsUnsaved();}},_handleAddExistingStepPress:function(){var s=this;var a=this.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(this.oConfigListInstance.oTreeInstance.getSelectedItem());var b=this.oConfigListInstance.oTreeInstance.getParentNodeContext(a).categoryId;var S=this.oConfigListInstance.configEditor.getStepsNotAssignedToCategory(b);var d;var e=[];S.forEach(function(f){var o={};var g=s.oConfigListInstance.configEditor.getStep(f);d=s.oConfigListInstance.oTextPool.get(g.getTitleId()).TextElementDescription;o.id=f;o.name=d;e.push(o);});var m=new sap.ui.model.json.JSONModel({existingStepData:e});if(!this.addExistingStepDialog){this.addExistingStepDialog=sap.ui.xmlfragment("idExistingStepDialogFragment","sap.apf.modeler.ui.fragment.existingStepDialog",this);this._setExistingStepDialogText();}this.getView().addDependent(this.addExistingStepDialog);this.addExistingStepDialog.setModel(m);this.addExistingStepDialog.open();},_handleExistingStepDialogOK:function(e){var n=c.configurationObjectTypes.STEP;var s=e.getParameters("listItem").selectedItems;var a=s.length;var b=this.oConfigListInstance.oTreeInstance.getAPFTreeNodeContext(this.oConfigListInstance.oTreeInstance.getSelectedItem());var d=this.oConfigListInstance.oTreeInstance.getParentNodeContext(b).categoryId;var E=[];for(var i=0;i<a;i++){var p=e.getParameters("selectedItems").selectedContexts[i].sPath.split('/')[2];var o=e.getSource().getModel().getData().existingStepData[p];var f=this.oConfigListInstance.configEditor.getStep(o.id);this.oConfigListInstance.configEditor.addCategoryStepAssignment(d,o.id);var r=f.getRepresentations();var g=r.length;var R=[];for(var j=0;j<g;j++){var h={};h.id=r[j].getId();h.name=r[j].getRepresentationType();h.icon=this._getRepresentationIcon(h.name);R.push(h);}var S={};S.step=o;S.representations=R;S.noOfReps=g;E.push(S);}if(a!==0){var k={noOfSteps:a,aExistingStepsToBeAdded:E};this.oConfigListInstance.oTreeInstance.addNodeInTree(n,k);}},_getRepresentationIcon:function(r){var i;var R=this.oCoreApi.getRepresentationTypes();for(var a=0;a<R.length;a++){if(r===R[a].id){i=R[a].picture;break;}}return i;},_handleExistingStepDialogSearch:function(e){var v=e.getParameter("value");var f=new sap.ui.model.Filter("name",sap.ui.model.FilterOperator.Contains,v);var b=e.getSource().getBinding("items");b.filter([f]);},_handleExistingStepDialogClose:function(e){if(this.addExistingStepDialog){e.getSource().getBinding("items").filter([]);}}});},true);
