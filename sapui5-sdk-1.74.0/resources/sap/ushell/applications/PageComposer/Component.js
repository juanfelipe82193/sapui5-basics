// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/UIComponent","./controller/ErrorDialog","sap/ui/model/json/JSONModel","./util/PagePersistence"],function(U,E,J,P){"use strict";return U.extend("sap.ushell.applications.PageComposer.Component",{metadata:{"manifest":"json"},_role:null,_oTransportPromise:null,init:function(){U.prototype.init.apply(this,arguments);this.getRouter().initialize();var c=this.getComponentData();var s=c&&c.startupParameters;this._handleStartupParams(s||{});this.getModel("PageRepository").setHeaders({"sap-language":sap.ushell.Container.getUser().getLanguage(),"sap-client":sap.ushell.Container.getLogonSystem().getClient()});this.setMetaModelData();this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(),"message");},getPageRepository:function(){if(!this.oPagePersistenceInstance){this.oPagePersistenceInstance=new P(this.getModel("PageRepository"),this.getModel("i18n").getResourceBundle(),this.getModel("message"));}return this.oPagePersistenceInstance;},isTransportSupported:function(){var m=this.getManifestEntry("sap.ui5");return!!m.componentUsages&&!!m.componentUsages.transportInformation&&!!m.componentUsages.transportInformation.componentData&&m.componentUsages.transportInformation.componentData.supported;},_saveRole:function(r){this._sRole=r;},getRole:function(){return this._sRole;},_handleStartupParams:function(s){var p=s.pageId&&s.pageId[0];var r=s.roleId&&s.roleId[0];var m=s.mode&&s.mode[0];this._saveRole(r);if(p){m=["edit","view"].indexOf(m)>-1?m:"view";this.getRouter().navTo(m,{pageId:encodeURIComponent(p)},true);}},showErrorDialog:function(e){E.open(e,this.getModel("i18n"));},createTransportComponent:function(p){if(this.isTransportSupported()){if(!this._oTransportPromise){this._oTransportPromise=this.createComponent({async:true,usage:"transportInformation"});}return this._oTransportPromise.then(function(t){t.reset({"package":p});return t;});}return Promise.reject();},setMetaModelData:function(){this.getModel("PageRepository").getMetaModel().loaded().then(function(){var m=this.getModel("PageRepository").getMetaModel();var M={copySupported:!!m.getODataFunctionImport("copyPage"),deleteSupported:!!m.getODataFunctionImport("deletePage"),createSupported:this.getMetadata().getConfig().enableCreate,previewSupported:this.getMetadata().getConfig().enablePreview};this.setModel(new J(M),"SupportedOperationModel");}.bind(this));}});});
