/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2","sap/suite/ui/generic/template/changeHandler/generic/MoveElements","sap/base/util/isEmptyObject"],function(U,A,M,i){"use strict";var a={},F="com.sap.vocabularies.UI.v1.Facets",b="com.sap.vocabularies.UI.v1.FieldGroup",I="com.sap.vocabularies.UI.v1.Identification";a.applyChange=function(c,C,p){if(!i(c.getContent().movedElements)){M.applyChange(c,C,p);}};a.revertChange=function(c,C,p){};a.completeChangeContent=function(c,s,p){var m=s.movedElements[0].id,g=m.split("--")[1];g=g.substring(0,g.lastIndexOf("::"));if(g.indexOf(b)===0||g.indexOf(I)===0){g="@"+g.replace("::","#");}else{g=g.replace("::","/@").replace("::","#");}var G=p.modifier.bySelector(m,p.appComponent),f=A.getExistingAnnotationsOfEntityType(G,F),o=U.getSmartFormGroupInfo(g,f);s.custom={};s.custom.fieldGroup=b;s.custom.identification=I;s.custom.annotation=F;s.custom.elements=o.aForm;s.custom.fnGetAnnotationIndex=U.getIndexFromInstanceMetadataPath;M.completeChangeContent(c,s,p);};return a;},true);
