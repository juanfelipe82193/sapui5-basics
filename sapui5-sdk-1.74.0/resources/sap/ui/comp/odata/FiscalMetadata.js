/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var F={isFiscalValue:function(p){for(var i=0;i<this.aAnnotations.length;i++){if(this.isTermDefaultTrue(p[this.aAnnotations[i]])){return true;}}return false;},getFiscalAnotationType:function(p){for(var i=0;i<this.aAnnotations.length;i++){var f=p[this.aAnnotations[i]];if(f&&f.Bool!=="false"){return this.aAnnotations[i];}}return null;},isTermDefaultTrue:function(t){if(t){return t.Bool?t.Bool!=="false":true;}return false;},updateViewMetadata:function(v){var a=this.getFiscalAnotationType(v);if(a==="com.sap.vocabularies.Common.v1.IsFiscalYearPeriod"||a==="com.sap.vocabularies.Common.v1.IsFiscalYearQuarter"||a==="com.sap.vocabularies.Common.v1.IsFiscalYearWeek"){v.maxLength=(parseInt(v.maxLength)+1).toString();}return v;},aAnnotations:["com.sap.vocabularies.Common.v1.IsFiscalYear","com.sap.vocabularies.Common.v1.IsFiscalPeriod","com.sap.vocabularies.Common.v1.IsFiscalYearPeriod","com.sap.vocabularies.Common.v1.IsFiscalQuarter","com.sap.vocabularies.Common.v1.IsFiscalYearQuarter","com.sap.vocabularies.Common.v1.IsFiscalWeek","com.sap.vocabularies.Common.v1.IsFiscalYearWeek","com.sap.vocabularies.Common.v1.IsDayOfFiscalYear","com.sap.vocabularies.Common.v1.IsFiscalYearVariant"]};return F;});
