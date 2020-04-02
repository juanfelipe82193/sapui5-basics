/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/merge"],function(m){"use strict";var s={};function _(r,t){var f=r.reduce(function(f,R){if(R[t]){return f.concat(R[t]);}return f;},[]);var c=[];return f.filter(function(C){var F=C.fileName;var b=c.indexOf(F)!==-1;if(b){return false;}c.push(F);return true;});}function a(r){return r.reduce(function(u,R){return m({},u,R.ui2personalization);},{});}s.merge=function(p){return{appDescriptorChanges:_(p.responses,"appDescriptorChanges"),changes:_(p.responses,"changes"),ui2personalization:a(p.responses),variants:_(p.responses,"variants"),variantChanges:_(p.responses,"variantChanges"),variantDependentControlChanges:_(p.responses,"variantDependentControlChanges"),variantManagementChanges:_(p.responses,"variantManagementChanges")};};return s;});
