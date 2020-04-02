/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/documentation/sdk/controller/BaseController"],function(B){"use strict";return B.extend("sap.ui.documentation.sdk.controller.Group",{onInit:function(){this.getRouter().getRoute("group").attachPatternMatched(this._onGroupMatched,this);},_onGroupMatched:function(e){this._id=e.getParameter("arguments").id;}});});
