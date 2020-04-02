/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/util/XMLPreprocessor","sap/fe/macros/PhantomUtil","./Chart.metadata","./FilterField.metadata","./FilterBar.metadata","./Form.metadata","./MicroChart.metadata","./Contact.metadata","./Table.metadata","./ValueHelp.metadata"],function(X,P,C,F,a,b,M,c,T,V){"use strict";var n="sap.fe.macros",d=[T,b,"FormContainer","Field",a,F,C,V,M,c].map(function(E){if(typeof E==="string"){return{name:E,namespace:n,metadata:{metadataContexts:{},properties:{},events:{}}};}return E;});function r(){d.forEach(function(E){P.register(E);});}function e(){d.forEach(function(E){X.plugIn(null,E.namespace,E.name);});}r();return{register:r,deregister:e};});
