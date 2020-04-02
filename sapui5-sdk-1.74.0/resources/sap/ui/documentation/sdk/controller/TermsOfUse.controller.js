/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/documentation/sdk/controller/BaseController"],function(B){"use strict";return B.extend("sap.ui.documentation.sdk.controller.TermsOfUse",{onInit:function(){this.oRouter=this.getRouter();this.oRouter.getRoute("termsOfUse").attachPatternMatched(this._onTopicMatched,this);},_onTopicMatched:function(e){jQuery.ajax({url:"./TermsOfUse.txt",dataType:"text"}).done(function(t){this.getView().byId("termsOfUseText").setText(t);}.bind(this)).fail(function(){this.oRouter.myNavToWithoutHash("sap.ui.documentation.sdk.view.NotFound","XML",false);}.bind(this));}});});
