// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/ui/Device","sap/ushell/resources","sap/ushell/Config"],function(C,J,D,r,a){"use strict";return C.extend("sap.ushell.components.shell.UserSettings.Spaces",{onInit:function(){this.bSpacesEnabledSavedValue=a.last("/core/spaces/enabled");this.oModel=new J({isSpacesEnabled:this.bSpacesEnabledSavedValue,textAlign:D.system.phone?"Begin":"End",labelWidth:D.system.phone?"auto":"12rem"});this.getView().setModel(this.oModel,"config");this.getView().setModel(r.getTranslationModel(),"i18n");this.oUserInfoServicePromise=sap.ushell.Container.getServiceAsync("UserInfo");},getContent:function(){var d=jQuery.Deferred();d.resolve(this.getView());return d.promise();},getValue:function(){return jQuery.Deferred().resolve().promise();},onCancel:function(){this.oModel.setProperty("/isSpacesEnabled",this.bSpacesEnabledSavedValue);},onSave:function(){var d=jQuery.Deferred();var s=this.oModel.getProperty("/isSpacesEnabled");if(s===this.bSpacesEnabledSavedValue){d.resolve();return d.promise();}this.oUserInfoServicePromise.then(function(u){var U=u.getUser();U.setChangedProperties({propertyName:"spacesEnabled",name:"SPACES_ENABLEMENT"},this.bSpacesEnabledSavedValue,s);u.updateUserPreferences(U).done(function(){U.resetChangedProperty("spacesEnabled");this.bSpacesEnabledSavedValue=s;d.resolve({refresh:true});}.bind(this)).fail(function(e){this.oModel.setProperty("/isSpacesEnabled",this.bSpacesEnabledSavedValue);U.resetChangedProperty("spacesEnabled");d.reject(e);}.bind(this));}.bind(this));return d.promise();}});});
