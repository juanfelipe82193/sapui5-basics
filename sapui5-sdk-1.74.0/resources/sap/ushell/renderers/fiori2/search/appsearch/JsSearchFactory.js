// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/renderers/fiori2/search/appsearch/JsSearch'],function(J){"use strict";return{createJsSearch:function(o){o.algorithm=o.algorithm||{id:'contains-ranked',options:[50,49,40,39,5,4,51]};return new J(o);}};});
