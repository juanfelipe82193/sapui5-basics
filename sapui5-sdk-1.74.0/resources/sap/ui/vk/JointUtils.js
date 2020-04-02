/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./thirdparty/gl-matrix"],function(g){"use strict";var m=g.mat4;var A=g.glMatrix.ARRAY_TYPE;var J={recalculateJoints:function(j,n,t){var w;if(t.length===16){w=t;}else{w=new A(16);m.fromRotationTranslationScale(w,t.quaternion||[0,0,0,1],t.translation||[0,0,0],t.scale||[1,1,1]);}var i=new A(16);m.invert(i,w);var a=new A(16);var b=[];j.forEach(function(c){if(c.parent===n){m.multiply(a,i,c.node.matrixWorld.elements);}else if(c.node===n){m.invert(a,c.parent.matrixWorld.elements);m.multiply(a,a,w);}else{return;}m.getTranslation(c.translation,a);m.getScaling(c.scale,a);m.scale(a,a,[1/c.scale[0],1/c.scale[1],1/c.scale[2]]);m.getRotation(c.quaternion,a);b.push(c);});return b;}};return J;});
