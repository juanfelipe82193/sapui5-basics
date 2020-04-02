/*!
 * @copyright@
 */
sap.ui.define(["sap/base/Log","sap/fe/macros/CommonHelper","sap/fe/navigation/SelectionVariant"],function(L,C,S){"use strict";var N={removeSensitiveData:function(c,d){if(!c){L.error("Context is required");return;}var p=[],i,P,o=c.getObject(),m=c.getModel().getMetaModel(),e=C.getTargetCollection(c),I=function(s,a,D){var b;a=a||e;D=D||o;b=m.getObject(a+"/"+s+"@");if(b){if(b["@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"]||b["@com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"]||b["@com.sap.vocabularies.Analytics.v1.Measure"]){return true;}else if(b["@com.sap.vocabularies.Common.v1.FieldControl"]){var f=b["@com.sap.vocabularies.Common.v1.FieldControl"];if(f["$EnumMember"]&&f["$EnumMember"].split("/")[1]==="Inapplicable"){return true;}else if(f["$Path"]){var F=f["$Path"],g=F.split("/");if(g.length>1){return D[g[0]]&&D[g[0]][g[1]]&&D[g[0]][g[1]]===0;}else{return D[F]===0;}}}}return false;};if(d){P=d;if(d.getMetadata&&d.getMetadata().getName()==="sap.fe.navigation.SelectionVariant"){i=true;p=d.getPropertyNames()||[];}else if(d instanceof Object){p=Object.keys(d)||[];}else{L.error("Unsupported format - Sensitive data not removed. Pass a SelectionVariant or data map");}}else{p=Object.keys(o)||[];P=JSON.parse(JSON.stringify(o));}p.forEach(function(s){if(!(o[s]instanceof Object)){if(I(s)){if(i){P.removeSelectOption(s);}else{delete P[s];}}}else{var a="/"+m.getObject(e+"/$NavigationPropertyBinding/"+s),n=i?JSON.parse(d.getSelectOption(s)[0].Low):P[s],b=Object.keys(n),f=false;b.forEach(function(g){if(I(g,a,n)){f=true;delete n[g];}});if(f){if(i){P.removeSelectOption(s);P.addSelectOption(s,"I","EQ",JSON.stringify(n));}else{P[s]=n;}}}});return P;},mixAttributesAndSelectionVariant:function(s,a){var o=new S(a);var n=new S();if(o.getFilterContextUrl()){n.setFilterContextUrl(o.getFilterContextUrl());}if(o.getParameterContextUrl()){n.setParameterContextUrl(o.getParameterContextUrl());}for(var p in s){if(s.hasOwnProperty(p)){var v=s[p];if(jQuery.type(v)==="array"||jQuery.type(v)==="object"){v=JSON.stringify(v);}else if(jQuery.type(v)==="date"){v=v.toJSON();}else if(jQuery.type(v)==="number"||jQuery.type(v)==="boolean"){v=v.toString();}if(v===""){L.info("Semantic attribute "+p+" is an empty string and is being ignored.");continue;}if(v===null){L.warning("Semantic attribute "+p+" is null and ignored for mix in to selection variant");continue;}if(v===undefined){L.warning("Semantic attribute "+p+" is undefined and ignored for mix in to selection variant");continue;}if(jQuery.type(v)==="string"){n.addSelectOption(p,"I","EQ",v);}else{throw"NavigationHandler.INVALID_INPUT";}}}var P=o.getParameterNames();for(var i=0;i<P.length;i++){if(!n.getSelectOption(P[i])){n.addSelectOption(P[i],"I","EQ",o.getParameter(P[i]));}}var b=o.getSelectOptionsPropertyNames();for(i=0;i<b.length;i++){if(!n.getSelectOption(b[i])){var c=o.getSelectOption(b[i]);for(var j=0;j<c.length;j++){n.addSelectOption(b[i],c[j].Sign,c[j].Option,c[j].Low,c[j].High);}}}return n;},addConditionsToSelectionVariant:function(s,c){var f=function(o){var l=o.values[0],h=o.values[1],b={Sign:"I"};switch(o.operator){case"Contains":b.Option="CP";b.Low="*"+l+"*";break;case"StartsWith":b.Option="CP";b.Low=l+"*";break;case"EndsWith":b.Option="CP";b.Low="*"+l;break;case"Empty":b.Option="EQ";b.Low="";break;case"EEQ":case"EQ":case"BT":case"LE":case"GE":case"GT":case"LT":b.Option=o.operator==="EEQ"?"EQ":o.operator;b.Low=l;break;default:L.error("Opertation is not supported '"+o.operator+"'");return;}if(o.operator==="BT"){b.High=h;}return b;};for(var p in c){if(c.hasOwnProperty(p)&&c[p].length){var a=c[p].map(f);s.massAddSelectOption(p,a);}}return s;}};return N;});
