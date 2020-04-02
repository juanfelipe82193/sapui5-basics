// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell_abap/bootstrap/evo/abap.constants","sap/base/util/deepClone"],function(a,d){"use strict";return function(){this.getDefaultConfig=function(){return Promise.resolve(d(a.defaultUshellConfig));};};},true);
