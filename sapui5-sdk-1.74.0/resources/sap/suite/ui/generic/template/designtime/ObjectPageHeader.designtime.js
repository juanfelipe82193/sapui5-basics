sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils","sap/base/util/deepExtend","./library.designtime"],function(U,D,d){"use strict";var O={};var H="com.sap.vocabularies.UI.v1.HeaderInfo";O.addHeaderActionButtonSettingsHandler=function(t,p){var a=[];if(t.getParent().getId().indexOf("--objectPageHeader")>-1){a=t.getParent().getActions();}else{a=t.getActions();}var c="addHeaderActionButton";return D.addSettingsHandler(t,p,a,c);};O.getObjectHeaderProperties=function(h){var p=D.ignoreAllProperties(h);var P={objectImageShape:{ignore:false}};return d({},p,P);};O.getHBoxProperties=function(h){var p=D.ignoreAllProperties(h);var P={visible:{ignore:false}};return d({},p,P);};O.getDesigntime=function(e){var r=sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();return{getCommonInstanceData:function(e){var t,T=U.getTemplatingInfo(e);if(T){var E=T.target;if(E){t=E+"/"+H;}}return{target:t,annotation:H};},name:{singular:function(){return r.getText("FE_OBJECT_PAGE_HEADER");}},properties:function(e){return O.getObjectHeaderProperties(e);},actions:{settings:{name:"Add Action Button",handler:O.addHeaderActionButtonSettingsHandler,icon:"sap-icon://add"}},aggregations:{actions:{properties:O.getHBoxProperties(e),actions:{move:function(e){switch(e.getMetadata().getElementName()){case"sap.uxap.ObjectPageHeaderActionButton":var t=U.getTemplatingInfo(e);var a=/.+(sap.suite.ui.generic.template.ObjectPage.view.Details::).+(?:--edit|--delete|--relatedApps|--template::Share|--template::NavigationUp|--template::NavigationDown|--fullScreen|--exitFullScreen|--closeColumn)$/;if(a.test(e.getId())||!t){return null;}return"moveHeaderAndFooterActionButton";}}}},navigationBar:{ignore:true}},annotations:{headerInfo:{namespace:"com.sap.vocabularies.UI.v1",annotation:"HeaderInfo",whiteList:{properties:["Title","Description","ImageUrl","TypeImageUrl","TypeName","Initials"],Title:{types:["DataField"],properties:["Value"]},Description:{types:["DataField"],properties:["Value"]}},appliesTo:["ObjectPageHeader"]}}};};return O;});
