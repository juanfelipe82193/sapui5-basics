/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(['sap/apf/modeler/ui/utils/nullObjectChecker','sap/apf/modeler/ui/utils/textManipulator'],function(n,t){'use strict';function S(T,o){this.oTextReader=T;this.oOptionsValueModelBuilder=o;}S.prototype.constructor=S;S.prototype.getNavTargetTypeData=function(){var N=[this.oTextReader("globalNavTargets"),this.oTextReader("stepSpecific")];return this.oOptionsValueModelBuilder.convert(N,N.length);};S.prototype.getSortDirections=function(){var s=[{key:"true",name:this.oTextReader("ascending")},{key:"false",name:this.oTextReader("descending")}];return this.oOptionsValueModelBuilder.prepareModel(s,s.length);};sap.apf.modeler.ui.utils.StaticValuesBuilder=S;return S;},true);
