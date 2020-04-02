// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/library","sap/base/util/merge","./BaseController","sap/ui/core/Fragment"],function(c,m,B,F){"use strict";var V=c.ValueState;return B.extend("sap.ushell.applications.SpaceComposer.controller.BaseDialog.controller",{destroy:function(){if(this._oView.byId(this.sViewId)){this._oView.byId(this.sViewId).destroy();}},onCancel:function(){this._oView.byId(this.sViewId).close();if(this._fnCancel){this._fnCancel();}},attachConfirm:function(a){this._fnConfirm=a;},onConfirm:function(e){if(this._fnConfirm){this._fnConfirm(e);}},getModel:function(){return this._oModel;},validate:function(v){for(var i in v){if(!v[i]){return false;}}return true;},attachCancel:function(a){this._fnCancel=a;},transportExtensionPoint:function(a){this._oView.byId("transportContainer").setComponent(a);},load:function(){var f={id:this._oView.getId(),name:this.sId,controller:this};return F.load(f).then(function(a){a.setModel(this._oModel);}.bind(this));},open:function(){var d=this._oView.byId(this.sViewId);this._oView.addDependent(d);d.open();},handlePackageNamespaceChange:function(s,f){var t=this._oView.byId("transportContainer").getComponentInstance(),p=t&&t.getRootControl().byId("packageInput");if(p&&!p.getValue().length){var P=s.split("/");P.pop();P=P.join("/");if(P){if(f){p.fireLiveChange({value:P});}else{p.setValue(P);p.fireChange({value:P});}}}},onTitleLiveChange:function(e){var i=e.getSource(),M=this.getModel(),I=i.getValue(),b=this.isValidTitle(I),v=m({},M.getProperty("/validation"),{title:b}),s=b?V.None:V.Error;M.setProperty("/validation",v);i.setValueState(s);},onSpaceIDLiveChange:function(e){var i=e.getSource(),M=this.getModel(),I=i.getValue(),b=this.isValidID(I),v=m({},M.getProperty("/validation"),{id:b}),s=b?V.None:V.Error;M.setProperty("/validation",v);i.setValueState(s);if(I.length>0){i.setValueStateText(this._oResourceBundle.getText("Message.InvalidSpaceID"));}else{i.setValueStateText(this._oResourceBundle.getText("Message.EmptySpaceID"));}this.handlePackageNamespaceChange(I,true);},onSpaceIDChange:function(e){var n=e.getParameters().value;this.handlePackageNamespaceChange(n,false);},isValidID:function(i){return/^[A-Z_/]{1}[A-Z0-9_/]{0,34}$/g.test(i);},isValidTitle:function(t){return/^.{1,100}$/g.test(t);}});});
