sap.ui.define(["sap/ui/model/odata/ODataUtils"],function(O){'use strict';var A=function(a){var m=a.manifests&&a.manifests.manifest;var d=m&&m["sap.app"].dataSources;var s=a.functions.getSapSystem();var b=m&&m["sap.ui5"]&&m["sap.ui5"].dependencies&&m["sap.ui5"].dependencies.libs&&m["sap.ui5"].dependencies.libs["sap.apf"]&&m["sap.ui5"].dependencies.libs["sap.apf"].minVersion;this.getAnnotationsForService=function(f){if(!d){return g(f);}return e(f);};function g(f){if(!(typeof b==="string")||b<"1.44.0"){var h=a.functions.getODataPath(f)+"annotation.xml";if(s){h=O.setOrigin(h,{force:true,alias:s});}if(a.instances.fileExists.check(h)){return[h];}}return[];}function r(f){if(f&&f[f.length-1]==='/'){f=f.substring(0,f.length-1);}var i;if(!f){return f;}var h=f.split(";");var n=h[0];for(i=1;i<h.length;i++){if(h[i].search("o=")===-1){n=n+';'+h[i];}}return n;}function c(u,f){var n=r(u);var h=r(f);return(n===h);}function e(f){var u=[];var h;for(h in d){if(c(d[h].uri,f)){var i=d[h].settings&&d[h].settings.annotations;if(i){i.forEach(j);}else{return g(f);}return u;}}return g(f);function j(k){var l=d[k]&&d[k].uri;var n=d[k]&&d[k].settings&&d[k].settings.localUri;var o;if(l){if(s){l=O.setOrigin(l,{force:true,alias:s});}u.push(l);}if(n&&n[0]!=='/'){var p=a.functions.getComponentNameFromManifest(a.manifests.manifest);o=a.functions.getBaseURLOfComponent(p);u.push(a.functions.addRelativeToAbsoluteURL(o,n));}else if(n&&n[0]==='/'){u.push(n);}}}};sap.apf.core.utils.AnnotationHandler=A;return{constructor:A};},true);
