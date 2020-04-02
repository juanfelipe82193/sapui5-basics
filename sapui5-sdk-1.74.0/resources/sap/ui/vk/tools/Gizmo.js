/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../library","sap/m/library","sap/m/Input","sap/m/Label","sap/ui/core/library","sap/ui/core/Control","./CoordinateSystem","./AxisColours","./ToolNodeSet"],function(a,L,I,b,c,C,d,A,T){"use strict";var e=L.InputType;var G=C.extend("sap.ui.vk.tools.Gizmo",{metadata:{library:"sap.ui.vk"}});G.prototype.hasDomElement=function(){return true;};G.prototype._createAxisTitles=function(s,f,g){s=s||32;f=f||20;function h(t,j){var k=document.createElement("canvas");k.width=k.height=s*window.devicePixelRatio;var l=k.getContext("2d");var m=k.width*0.5;l.font="Bold "+f*window.devicePixelRatio+"px Arial";l.textAlign="center";l.textBaseline="middle";l.fillStyle="#000";l.globalAlpha=0.5;l.filter="blur(3px)";l.fillText(t,m+1,m+1);l.fillStyle="#fff";l.globalAlpha=1;l.filter="blur(0px)";l.fillText(t,m,m);if(g){l.beginPath();l.arc(m,m,m-window.devicePixelRatio,0,2*Math.PI,false);l.closePath();l.lineWidth=window.devicePixelRatio*2;l.strokeStyle="#fff";l.stroke();}var n=new THREE.Texture(k);n.needsUpdate=true;var o=new THREE.MeshBasicMaterial({map:n,color:j,transparent:true,alphaTest:0.05,premultipliedAlpha:true,side:THREE.DoubleSide});var p=new THREE.Mesh(new THREE.PlaneGeometry(s,s),o);p.userData.color=j;return p;}var i=new THREE.Group();i.add(h("X",A.x));i.add(h("Y",A.y));i.add(h("Z",A.z));return i;};G.prototype._extractBasis=function(m){var f=[new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3()];m.extractBasis(f[0],f[1],f[2]);f[0].normalize();f[1].normalize();f[2].normalize();return f;};G.prototype._updateAxisTitles=function(o,g,f,h,s){var j=this._extractBasis(g.matrixWorld);o.children.forEach(function(k,i){k.position.copy(j[i]).multiplyScalar(h.constructor===THREE.Vector3?h.getComponent(i):h);k.quaternion.copy(f.quaternion);});o.position.copy(g.position);o.scale.setScalar(s);};if(this._viewport&&this._viewport._viewStateManager){this._updateSelection(this._viewport._viewStateManager);this._viewport.setShouldRenderFrame();}G.prototype._updateSelection=function(f){var n=[];if(this._tool){if(this._tool.getNodeSet()===T.Highlight){f.enumerateSelection(function(g){n.push({node:g});});}else{f.enumerateOutlinedNodes(function(g){n.push({node:g});});}}if(this._nodes.length===n.length&&this._nodes.every(function(v,i){return n[i].node===v.node;})){return false;}this._nodes=n;n.forEach(function(g){g.ignore=false;var p=g.node.parent;while(p&&!g.ignore){for(var i=0,l=n.length;i<l;i++){if(n[i].node===p){g.ignore=true;break;}}p=p.parent;}});return true;};G.prototype._recalculateJoints=function(v){var u=[];this._nodes.forEach(function(n){u.push(n.node);});v._recalculateJointsForNodes(u);};G.prototype._getAnchorPoint=function(){return this._viewport?this._viewport._anchorPoint:null;};G.prototype._getSelectionCenter=function(t){if(this._nodes.length===1){t.setFromMatrixPosition(this._nodes[0].node.matrixWorld);}else{t.setScalar(0);if(this._nodes.length>0){var f=new THREE.Vector3();this._nodes.forEach(function(n){var g=n.node;if(g.userData.boundingBox){g.userData.boundingBox.getCenter(f);t.add(f.applyMatrix4(g.matrixWorld));}else{t.add(f.setFromMatrixPosition(g.matrixWorld));}});t.multiplyScalar(1/this._nodes.length);}}};G.prototype._getGizmoScale=function(p){var r=this._viewport.getRenderer();var f=this._viewport.getCamera().getCameraRef();var g=new THREE.Vector4();g.copy(p).applyMatrix4(this._matViewProj);return g.w*2/(r.getSize().width*f.projectionMatrix.elements[0]);};G.prototype._updateGizmoObjectTransformation=function(o,i){var f=this._viewport.getCamera().getCameraRef();var g=this._getAnchorPoint();var n;if(g&&this._coordinateSystem===d.Custom){o.position.copy(g.position);o.quaternion.copy(g.quaternion);}else if(this._coordinateSystem===d.Local){n=this._nodes[i].node;n.matrixWorld.decompose(o.position,o.quaternion,o.scale);}else if(this._nodes.length>0){this._getSelectionCenter(o.position);if(this._coordinateSystem===d.Screen){o.quaternion.copy(f.quaternion);}else{o.quaternion.set(0,0,0,1);}}var s=this._getGizmoScale(o.position);o.scale.setScalar(this._gizmoSize*s);if(n){var h=this._extractBasis(n.matrixWorld);o.matrix.makeBasis(h[0],h[1],h[2]);o.matrix.scale(o.scale);o.matrix.copyPosition(n.matrixWorld);o.matrixAutoUpdate=false;}else{o.matrixAutoUpdate=true;}o.updateMatrixWorld(true);return s;};G.prototype._expandBoundingBox=function(f,g,l){var h=this.getGizmoCount();if(h>0){this._matViewProj.multiplyMatrices(g.projectionMatrix,g.matrixWorldInverse);for(var i=0;i<h;i++){this._updateGizmoTransformation(i,g);this._sceneGizmo._expandBoundingBox(f,l,false);}}};G.prototype._createEditingForm=function(u,w){this._label=new sap.m.Label({}).addStyleClass("sapUiVkTransformationToolEditLabel");this._units=new sap.m.Label({text:u}).addStyleClass("sapUiVkTransformationToolEditUnits");this._input=new I({width:w+"px",type:e.Number,maxLength:10,textAlign:c.TextAlign.Right,change:function(f){this.setValue(f.getParameter("value"));}.bind(this)});this._editingForm=new sap.m.HBox({items:[this._label,this._input,this._units]}).addStyleClass("sapUiSizeCompact");this._editingForm.onkeydown=this._editingForm.ontap=this._editingForm.ontouchstart=function(f){f.setMarked();};};G.prototype._getValueLocaleOptions=function(){return{useGrouping:false};};G.prototype._updateEditingForm=function(f,g){var h=this.getDomRef();if(h){if(f&&this._tool&&this._tool.getShowEditingUI()){this._label.setText(["X","Y","Z"][g]);this._label.rerender();var l=this._label.getDomRef();if(l){l.style.color=new THREE.Color(A[["x","y","z"][g]]).getStyle();}this._lastEditValue=this.getValue();this._input.setValue(this._lastEditValue.toLocaleString("fullwide",this._getValueLocaleOptions()));var p=this._getEditingFormPosition();var i=this._gizmo.position.clone().applyMatrix4(this._matViewProj).sub(p);var v=this._viewport.getDomRef().getBoundingClientRect();var j=h.getBoundingClientRect();var k=Math.sign(i.x)*j.width;var m=j.height*0.5;var x=THREE.Math.clamp(v.width*(p.x*0.5+0.5)+Math.sign(i.x)*-20,Math.max(k,0),v.width+Math.min(k,0));var y=THREE.Math.clamp(v.height*(p.y*-0.5+0.5),m,v.height-m);h.style.left=Math.round(x)+"px";h.style.top=Math.round(y)+"px";h.style.transform="translate("+(i.x<0?"0%":"-100%")+", -50%)";h.style.display="block";}else{h.style.display="none";}}};return G;});
