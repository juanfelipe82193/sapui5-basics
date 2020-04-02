// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/renderers/fiori2/search/SearchHelper'],function(S){"use strict";return sap.m.Label.extend('sap.ushell.renderers.fiori2.search.controls.SearchLabel',{renderer:'sap.m.LabelRenderer',onAfterRendering:function(){var d=this.getDomRef();S.boldTagUnescaper(d);S.forwardEllipsis4Whyfound(d);}});});
