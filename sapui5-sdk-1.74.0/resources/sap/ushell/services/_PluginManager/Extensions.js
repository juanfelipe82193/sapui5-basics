// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/services/_PluginManager/HeaderExtensions'],function(H){"use strict";var O={"Header":g};function g(){return Promise.resolve(H);}function a(e){var E=O[e];if(!E){return Promise.reject("Unsupported extension: '"+e+"'");}return E();}return a;});
