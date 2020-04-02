/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./threejs/thirdparty/three","./threejs/ThreeExtensions"],function(t,a){"use strict";var N={centerOfNodes:function(n,v){var b=new THREE.Box3();n.forEach(function(d){d._expandBoundingBox(b,null,true);});var c=new THREE.Vector3();b.getCenter(c);return c.toArray();}};return N;});
