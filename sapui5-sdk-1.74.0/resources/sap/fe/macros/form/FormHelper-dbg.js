/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/model/odata/v4/AnnotationHelper","sap/fe/macros/CommonHelper"],function(O,C){"use strict";var F={resolveAnnotationPathForForm:function(c){var n,N,e;var p=c.getPath();var a=c.getObject();var s=O.getNavigationPath(a);if(s){n=s.split("/");N=n.length>1?n.join("/$NavigationPropertyBinding/"):n[0];e=C.getTargetCollection(c,N);return a.replace(s,e);}else{return p;}},getTargetEntitySet:function(c){var e=O.getNavigationPath(c.getPath());return"/"+c.getObject(e);},checkIfCollectionFacetNeedsToBeRendered:function(c,p){if(c.$Type==="com.sap.vocabularies.UI.v1.CollectionFacet"&&c.Facets.length){var f=function(a,R){var b=R["@com.sap.vocabularies.UI.v1.PartOfPreview"];return((a!=="false"&&b!==false)||(a==="false"&&b===false));};var r=c.Facets;return r.some(f.bind(null,p));}return false;},getDataFieldCollection:function(c){var p=c.getPath();if(c.getObject(p+"/Data")){return p+"/Data";}else{return p;}}};return F;},true);
