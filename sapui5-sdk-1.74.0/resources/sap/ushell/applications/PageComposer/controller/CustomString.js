// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/model/SimpleType"],function(S){"use strict";return S.extend("sap.ushell.applications.PageComposer.controller.CustomString",{parseValue:function(v){return v.toUpperCase();},validateValue:function(v){return undefined;},formatValue:function(v){return v;}});});
