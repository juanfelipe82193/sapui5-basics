// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/bootstrap/cdm/cdm.constants","sap/base/util/deepClone"],function(c,d){"use strict";return function(){this.getDefaultConfig=function(){return Promise.resolve(d(c.defaultConfig));};};},true);
