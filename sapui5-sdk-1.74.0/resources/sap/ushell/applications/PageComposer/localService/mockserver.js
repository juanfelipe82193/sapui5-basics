// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/util/MockServer"],function(M){"use strict";return{init:function(r,m,c){r=r||"/";var o=new M({rootUri:r});M.config({autoRespond:true,autoRespondAfter:0});o.simulate(m,c);o.start();}};});
