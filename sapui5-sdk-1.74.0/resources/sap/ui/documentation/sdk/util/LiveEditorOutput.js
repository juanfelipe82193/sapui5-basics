/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(){"use strict";window.addEventListener("message",function(e){if(e.origin!==(window.location.protocol+"//"+window.location.host)){return;}var d=e.data;if(!d||!d.src||!d.moduleNameToRequire){return;}a();p(d);});function p(d){sap.ui.require.preload(d.src);sap.ui.require([d.moduleNameToRequire]);}function a(){window.addEventListener("error",function(e){e.preventDefault();var E=document.createElement("span");E.innerText=e.message;E.style.cssText="position:absolute; top:1rem; left:1rem";if(!document.body){document.write("<span></span>");}document.body.appendChild(E);});window.addEventListener("unhandledrejection",function(e){e.preventDefault();var E=document.createElement("span");E.innerText=e.reason&&e.reason.message;E.style.cssText="position:absolute; top:1rem; left:1rem";if(!document.body){document.write("<span></span>");}document.body.appendChild(E);});}})();
