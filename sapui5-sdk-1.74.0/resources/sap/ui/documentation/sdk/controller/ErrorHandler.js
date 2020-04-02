/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/m/MessageBox"],function(U,M){"use strict";return U.extend("sap.ui.documentation.sdk.controller.ErrorHandler",{constructor:function(c){this._oComponent=c;this._oModel=c.getModel();this._bMessageOpen=false;this._sErrorText="Sorry, a technical error occurred! Please try again later.";},_showMetadataError:function(d){M.error(this._sErrorText,{id:"metadataErrorMessageBox",details:d,styleClass:this._oComponent.getContentDensityClass(),actions:[M.Action.RETRY,M.Action.CLOSE],onClose:function(a){if(a===M.Action.RETRY){this._oModel.refreshMetadata();}}.bind(this)});},_showServiceError:function(d){if(this._bMessageOpen){return;}this._bMessageOpen=true;M.error(this._sErrorText,{id:"serviceErrorMessageBox",details:d,styleClass:this._oComponent.getContentDensityClass(),actions:[M.Action.CLOSE],onClose:function(){this._bMessageOpen=false;}.bind(this)});}});});
