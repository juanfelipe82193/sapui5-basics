// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["./common.debug.mode","./common.load.script"],function(d,l){"use strict";function a(p){var u=sap.ui.require.toUrl((p).replace(/\./g,"/")),i;if(d){sap.ui.require(["sap/ui/core/Core"],function(c){c.boot();});}else{for(i=0;i<4;i++){l(u+"/core-min-"+i+".js");}}}return a;});
