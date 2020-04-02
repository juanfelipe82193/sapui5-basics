/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/core/LocaleData","sap/ui/core/format/DateFormat",'sap/ui/core/Core'],function(B,L,D,C){"use strict";var F=B.extend("sap.ui.comp.odata.FiscalFormat",{metadata:{library:"sap.ui.comp"},constructor:function(i,f){B.call(this,i,f);var a,p,b,c,l=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale(),o=L.getInstance(l),m=sap.ui.getCore().getConfiguration().getFormatSettings().getCustomLocaleData(),d=/(m|y)(?:.*)(\W)(m|y)/i,s=m["dateFormats-short"];this.oFormatOptions=f;if(this.oFormatOptions.format.length>4){a="yM";}else if(this.oFormatOptions.format==="PPP"){a="M";}else{a=this.oFormatOptions.format;}if(s&&a==="yM"){c=s.match(d).splice(1).join("");if(c){p=c;}}else{p=o.getCustomDateTimePattern(a,this.oFormatOptions.calendarType);}if(this.oFormatOptions.format.length>4){p=p.replace(/y/i,this.oFormatOptions.format.slice(0,this.oFormatOptions.format.lastIndexOf("Y")+1));p=p.replace(/m/i,this.oFormatOptions.format.slice(this.oFormatOptions.format.lastIndexOf("Y")+1));}else if(this.oFormatOptions.format==="PPP"){p=p.replace(/l/i,"PPP");}b=this.parseCldrDatePattern(p);this.oFormatOptions.pattern=b.length>1?p:"";this._setFormatRegex(b);this._setParseRegex(b);this._setValidationRegex(b);}});F.getDateInstance=function(f){return new F(null,f);};F.prototype.getPattern=function(){return this.oFormatOptions.pattern;};F.prototype._setFormatRegex=function(f){var r=[],R=[],p,s,o,y,i;for(i=0;i<f.length;i++){p=f[i];s=p.symbol||"";o=this.oSymbols[s].format;if(s===""){R[i]=(p.value);}else if(s==="y"||s==="Y"){r.unshift("("+o.source+")");R[i]=('$'+1);}else{r.push("("+o.source+")");y=f.some(function(p){return p.symbol==="y"||p.symbol==="Y";});R[i]=y?('$'+2):('$'+1);}}this.sFromatRegExPattern=new RegExp(r.join(""));this.sFormatRegExGroups=R.join("");};F.prototype._setParseRegex=function(f){var p,s,r,i,c,R=[],o={},n=0;for(i=0;i<f.length;i++){p=f[i];s=p.symbol||"";r=this.oSymbols[s].parse;if(s===""){R.push("\\D+?");}else{R.push("("+r.source+")");c=++n;o[c]=p;}}this.sParseRegExPattern=new RegExp("^"+R.join("")+"$");this.fnParseRegExReplacer=function(){var p,g,a=[];for(var i in o){p=o[i];g=arguments[i];if(g.length<p.digits){if(p.symbol==="y"||p.symbol==="Y"){g="2"+g.padStart(p.digits-1,'0');}else{g=g.padStart(p.digits,'0');}}if(p.symbol==="y"||p.symbol==="Y"){a.unshift(g);}else{a.push(g);}}return a.join("");};};F.prototype._setValidationRegex=function(f){var i,p,s,r,R=[];for(i=0;i<f.length;i++){p=f[i];s=p.symbol||"";r=this.oSymbols[s].format;if(s===""){continue;}else if(s==="y"||s==="Y"){R.unshift(r.source);}else{R.push(r.source);}}this.sValidationRegExPattern=new RegExp("^("+R.join(")(")+")$");};F.prototype.parseCldrDatePattern=function(p){var i,c,s,o,f=[];for(i=0;i<p.length;i++){c=p[i];if(s!==c){o={};}else{o.digits+=1;continue;}if(typeof this.oSymbols[c]==="undefined"){o.value=c;o.type="text";}else{o.symbol=c;o.digits=1;}s=c;f.push(o);}return f;};F.prototype.format=function(v){return v.replace(this.sFromatRegExPattern,this.sFormatRegExGroups);};F.prototype.parse=function(v){return v.replace(this.sParseRegExPattern,this.fnParseRegExReplacer);};F.prototype.validate=function(v){return this.sValidationRegExPattern.test(v);};F.oRegexFormatPatterns={"year":/[1-9][0-9]{3}/,"period":/[0-9]{3}/,"quarter":/[1-4]/,"week":/0[1-9]|[1-4][0-9]|5[0-3]/,"day":/[1-9]|[1-9][0-9]|[1-3][0-6][0-9]|370|371/};F.oRegexParsePatterns={"year":/[0-9]{1,4}/,"period":/[0-9]{1,3}/,"quarter":/[1-4]/,"week":/[0-9]{1,2}/,"day":/[1-9]/};F.prototype.oSymbols={"":"","y":{format:F.oRegexFormatPatterns.year,parse:F.oRegexParsePatterns.year},"Y":{format:F.oRegexFormatPatterns.year,parse:F.oRegexParsePatterns.year},"P":{format:F.oRegexFormatPatterns.period,parse:F.oRegexParsePatterns.period},"W":{format:F.oRegexFormatPatterns.week,parse:F.oRegexParsePatterns.week},"d":{format:F.oRegexFormatPatterns.day,parse:F.oRegexParsePatterns.day},"Q":{format:F.oRegexFormatPatterns.quarter,parse:F.oRegexParsePatterns.quarter},"q":{format:F.oRegexFormatPatterns.quarter,parse:F.oRegexParsePatterns.quarter}};F.prototype.destroy=function(){B.prototype.destroy.apply(this,arguments);if(this._oAnnotationValidationRegexPattern){this._oAnnotationValidationRegexPattern=null;}};return F;});
