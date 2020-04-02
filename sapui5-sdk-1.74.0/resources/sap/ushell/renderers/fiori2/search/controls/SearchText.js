// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/renderers/fiori2/search/SearchHelper'],function(S){"use strict";return sap.m.Text.extend('sap.ushell.renderers.fiori2.search.controls.SearchText',{renderer:'sap.m.TextRenderer',onAfterRendering:function(){var d=this.getDomRef();S.boldTagUnescaper(d);}});});
