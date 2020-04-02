/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/merge"],function(m){"use strict";var D={isKeyUser:false,isVariantSharingEnabled:false,isAtoAvailable:false,isAtoEnabled:false,draft:{},isProductiveSystem:true,isZeroDowntimeUpgradeRunning:false,system:"",client:""};function _(r){var d={};var b=!!r.features.isVersioningEnabled;r.layers.forEach(function(l){d[l]=b;});return d;}return{mergeResults:function(r){var R=D;r.forEach(function(o){Object.keys(o.features).forEach(function(k){if(k!=="isVersioningEnabled"){R[k]=o.features[k];}});R.draft=m(R.draft,_(o));});return R;}};});
