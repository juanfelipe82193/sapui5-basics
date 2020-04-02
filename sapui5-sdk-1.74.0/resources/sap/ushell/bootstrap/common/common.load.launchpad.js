// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([],function(){"use strict";return l;function l(d){sap.ui.require(["sap/ushell/iconfonts","sap/ushell/services/AppConfiguration"],function(I,C){window.sap.ushell.Container.createRenderer(null,true).then(function(c){c.placeAt(d||"canvas","only");});I.registerFiori2IconFont();});}});
