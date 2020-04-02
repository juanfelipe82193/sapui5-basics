/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./thirdparty/three","./PolylineGeometry","./PolylineMaterial"],function(c,P,d){"use strict";function e(g,m){THREE.Mesh.call(this);this.type="PolylineMesh";this.geometry=g!==undefined?g:new P();this.material=m!==undefined?m:new d();}e.prototype=Object.assign(Object.create(THREE.Mesh.prototype),{constructor:e,isPolylineMesh:true,computeLineDistances:(function(){var a=new THREE.Vector4();var b=new THREE.Vector4();var f=new THREE.Vector2();var g=new THREE.Vector2();return function(m,v,n){var h=this.geometry;var k=h.attributes.instanceDistance.data;var o=k.array;var p=h.vertices;var q=0,t;a.copy(p[0]).applyMatrix4(m);for(var i=0,j=0,l=k.count;i<l;i++,j+=2){b.copy(p[i+1]).applyMatrix4(m);if(n!==undefined){if(a.w>=n){f.copy(a).multiplyScalar(1/a.w);if(b.w>=n){g.copy(b).multiplyScalar(1/b.w);}else{t=(a.w-n)/(a.w-b.w);g.copy(b).sub(a).multiplyScalar(t).add(a).multiplyScalar(1/n);}}else if(b.w>=n){g.copy(b).multiplyScalar(1/b.w);t=(b.w-n)/(b.w-a.w);f.copy(a).sub(b).multiplyScalar(t).add(b).multiplyScalar(1/n);}else{f.set(0,0,0);g.set(0,0,0);}}else{f.copy(a);g.copy(b);}o[j]=q;q+=g.sub(f).multiply(v).length()*0.5;o[j+1]=q;a.copy(b);}this.material.lineLength=q;k.needsUpdate=true;return this;};}())});return e;});
