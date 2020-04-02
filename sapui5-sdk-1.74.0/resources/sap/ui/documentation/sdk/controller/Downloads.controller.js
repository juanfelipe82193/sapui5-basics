/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/documentation/sdk/controller/BaseController"],function(B){"use strict";return B.extend("sap.ui.documentation.sdk.controller.Downloads",{onInit:function(){this.getRouter().getRoute("downloads").attachPatternMatched(this._onMatched,this);},_onMatched:function(){this.hideMasterSide();}});});
