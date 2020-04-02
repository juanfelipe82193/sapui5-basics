// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Config"],function(C){"use strict";function a(){this.attachSizeBehaviorUpdate=function(c){var d=C.on("/core/home/sizeBehavior");d.do(c);return{detach:d.off};};}a.hasNoAdapter=true;return a;},false);
