/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var c={"com.sap.vocabularies.Common.v1.IsCalendarDate":true,"com.sap.vocabularies.Common.v1.IsCalendarHalfyear":true,"com.sap.vocabularies.Common.v1.IsCalendarMonth":true,"com.sap.vocabularies.Common.v1.IsCalendarQuarter":true,"com.sap.vocabularies.Common.v1.IsCalendarWeek":true,"com.sap.vocabularies.Common.v1.IsCalendarYear":true,"com.sap.vocabularies.Common.v1.IsCalendarYearMonth":true,"com.sap.vocabularies.Common.v1.IsCalendarYearQuarter":true,"com.sap.vocabularies.Common.v1.IsCalendarYearWeek":true};var f={"com.sap.vocabularies.Common.v1.IsFiscalPeriod":true,"com.sap.vocabularies.Common.v1.IsFiscalYear":true,"com.sap.vocabularies.Common.v1.IsFiscalYearPeriod":true};var C={isCalendarValue:function(F){return this._isMatching(F,c);},isFiscalValue:function(F){return this._isMatching(F,f);},isCalendarOrFiscalValue:function(F){return this.isCalendarValue(F)||this.isFiscalValue(F);},_isMatching:function(F,m){var M=false;for(var a in m){if(this._isDefaultTrue(F[a])){M=true;break;}}return M;},_isDefaultTrue:function(t){if(t){return t.Bool?t.Bool!=="false":true;}return false;}};return C;});
