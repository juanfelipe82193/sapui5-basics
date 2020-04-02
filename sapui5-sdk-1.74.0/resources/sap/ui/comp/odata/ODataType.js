/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/model/odata/type/Boolean','sap/ui/model/odata/type/Byte','sap/ui/model/odata/type/DateTime','sap/ui/model/odata/type/DateTimeOffset','sap/ui/model/odata/type/Decimal','sap/ui/model/odata/type/Double','sap/ui/model/odata/type/Single','sap/ui/model/odata/type/Guid','sap/ui/model/odata/type/Int16','sap/ui/model/odata/type/Int32','sap/ui/model/odata/type/Int64','sap/ui/model/odata/type/SByte','sap/ui/model/odata/type/String','sap/ui/model/odata/type/Time','sap/ui/comp/odata/type/StringDate','sap/ui/comp/odata/type/FiscalDate'],function(B,a,D,b,c,d,S,G,I,e,f,g,h,T,i,F){"use strict";var u={"Edm.Boolean":B,"Edm.Byte":a,"Edm.DateTime":D,"Edm.DateTimeOffset":b,"Edm.Decimal":c,"Edm.Double":d,"Edm.Float":S,"Edm.Guid":G,"Edm.Int16":I,"Edm.Int32":e,"Edm.Int64":f,"Edm.SByte":g,"Edm.Single":S,"Edm.String":h,"Edm.Time":T};var m={"Edm.Boolean":"Bool","Edm.Byte":"Int","Edm.DateTime":"Date","Edm.DateTimeOffset":"DateTimeOffset","Edm.Decimal":"Decimal","Edm.Double":"Float","Edm.Float":"Float","Edm.Guid":"Guid","Edm.Int16":"Int","Edm.Int32":"Int","Edm.Int64":"Int","Edm.SByte":"Int","Edm.Single":"Float","Edm.String":"String","Edm.Time":"TimeOfDay"};var n={"Edm.Byte":true,"Edm.Decimal":true,"Edm.Double":true,"Edm.Float":true,"Edm.Int16":true,"Edm.Int32":true,"Edm.Int64":true,"Edm.SByte":true,"Edm.Single":true};var j={"Edm.DateTime":true,"Edm.DateTimeOffset":true,"Edm.Time":true};var O={getType:function(t,o,C,s){var k=null,_;if(s){if(typeof s==="boolean"||s.isCalendarDate){return new i(o);}if(s.isFiscalDate){return new F(o,C,{anotationType:s.fiscalType});}}_=u[t];if(_){k=new _(o,C);}return k;},isNumeric:function(t){return n[t]?true:false;},isDateOrTime:function(t){return j[t]?true:false;},getDefaultValueTypeName:function(t){return m[t];},getTypeName:function(t){if(t.indexOf("Edm.")===0){return t.substring(4);}return t;}};return O;},true);
