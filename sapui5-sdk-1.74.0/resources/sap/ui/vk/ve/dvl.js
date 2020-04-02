/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  (C) 2016 SAP SE or an SAP affiliate company. All rights reserved.
 */

var sap = sap || {};
sap.ve = sap.ve || {};
sap.ve.dvl = sap.ve.dvl || {};
sap.ve.dvl.createRuntime = function(options) {
	return new Promise(function(resolve, reject) {
		function createModule(options) {
			// Emscripten module definition begins here. It ends in module_end.js.

			var mergeOption = function(optionName, defaultOptionValue) {
				if (!options) {
					return defaultOptionValue;
				}
				return typeof options[optionName] === "undefined" ? defaultOptionValue : options[optionName];
			};

			// Merge any input options with defaults.
			var mergedOptions = {
				totalMemory:          mergeOption("totalMemory",          128 * 1024 * 1024), // 128 MB
				logElementId:         mergeOption("logElementId",         null),
				statusElementId:      mergeOption("statusElementId",      null),
				prefixURL:            mergeOption("filePackagePrefixURL", null)
			};

			//Create initial Module object with defaults
			var Module = {
				TOTAL_MEMORY: mergedOptions.totalMemory,
				prefixURL: mergedOptions.prefixURL,
				preInit: [],
				postRun: [],
				totalDependencies: 0,
				monitorRunDependencies: null,
				noInitialRun: true,
				noFSInit: true, // NB: Do not initialize standard streams (a workaround for cases when a file is opened before standard streams are initialized).
				print: function() {
					var args = Array.prototype.slice.call(arguments);
					var text = args.join(" ");
					if (mergedOptions.logElementId) {
						var element = document.getElementById(mergedOptions.logElementId);
						element.value += text + "\n";
						element.scrollTop = 99999;
					} else if (window.console) {
						console.log("print: " + text);
					}
				},
				printf: function() {
					var args = Array.prototype.slice.call(arguments);
					args.push("(printf)");
					Module.print(args);
				},
				printErr: function() {
					var args = Array.prototype.slice.call(arguments);
					args.push("(printErr)");
					Module.print(args);
				},
				// setStatus is called from Emscripten libraries.
				setStatus: function(text) {
					if (mergedOptions.statusElementId) {
						if (Module.setStatus.interval) {
							clearInterval(Module.setStatus.interval);
						}
						var statusElement = document.getElementById(mergedOptions.statusElementId);
						statusElement.innerHTML = text;
					} else if (Module.logElementId) {
						var args = Array.prototype.slice.call(arguments);
						args.push("(setStatus)");
						Module.print(args);
					}
				},
				locateFile: function(path, scriptDirectory) {
					return this.prefixURL + path;
				}
			};

			// NB: Emscripten generated code will be inserted after this line.

var Module=typeof Module!=="undefined"?Module:{};var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}Module["arguments"]=[];Module["thisProgram"]="./this.program";Module["quit"]=(function(status,toThrow){throw toThrow});Module["preRun"]=[];Module["postRun"]=[];var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;var ENVIRONMENT_IS_SHELL=false;ENVIRONMENT_IS_WEB=typeof window==="object";ENVIRONMENT_IS_WORKER=typeof importScripts==="function";ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof require==="function"&&!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER;ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}else{return scriptDirectory+path}}if(ENVIRONMENT_IS_NODE){scriptDirectory=__dirname+"/";var nodeFS;var nodePath;Module["read"]=function shell_read(filename,binary){var ret;if(!nodeFS)nodeFS=require("fs");if(!nodePath)nodePath=require("path");filename=nodePath["normalize"](filename);ret=nodeFS["readFileSync"](filename);return binary?ret:ret.toString()};Module["readBinary"]=function readBinary(filename){var ret=Module["read"](filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}assert(ret.buffer);return ret};if(process["argv"].length>1){Module["thisProgram"]=process["argv"][1].replace(/\\/g,"/")}Module["arguments"]=process["argv"].slice(2);if(typeof module!=="undefined"){module["exports"]=Module}process["on"]("uncaughtException",(function(ex){if(!(ex instanceof ExitStatus)){throw ex}}));process["on"]("unhandledRejection",(function(reason,p){process["exit"](1)}));Module["quit"]=(function(status){process["exit"](status)});Module["inspect"]=(function(){return"[Emscripten Module object]"})}else if(ENVIRONMENT_IS_SHELL){if(typeof read!="undefined"){Module["read"]=function shell_read(f){return read(f)}}Module["readBinary"]=function readBinary(f){var data;if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}data=read(f,"binary");assert(typeof data==="object");return data};if(typeof scriptArgs!="undefined"){Module["arguments"]=scriptArgs}else if(typeof arguments!="undefined"){Module["arguments"]=arguments}if(typeof quit==="function"){Module["quit"]=(function(status){quit(status)})}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WEB){if(document.currentScript){scriptDirectory=document.currentScript.src}}else{scriptDirectory=self.location.href}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1)}else{scriptDirectory=""}Module["read"]=function shell_read(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){Module["readBinary"]=function readBinary(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}Module["readAsync"]=function readAsync(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function xhr_onload(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)};Module["setWindowTitle"]=(function(title){document.title=title})}else{}var out=Module["print"]||(typeof console!=="undefined"?console.log.bind(console):typeof print!=="undefined"?print:null);var err=Module["printErr"]||(typeof printErr!=="undefined"?printErr:typeof console!=="undefined"&&console.warn.bind(console)||out);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key]}}moduleOverrides=undefined;var STACK_ALIGN=16;function staticAlloc(size){var ret=STATICTOP;STATICTOP=STATICTOP+size+15&-16;return ret}function dynamicAlloc(size){var ret=HEAP32[DYNAMICTOP_PTR>>2];var end=ret+size+15&-16;HEAP32[DYNAMICTOP_PTR>>2]=end;if(end>=TOTAL_MEMORY){var success=enlargeMemory();if(!success){HEAP32[DYNAMICTOP_PTR>>2]=ret;return 0}}return ret}function alignMemory(size,factor){if(!factor)factor=STACK_ALIGN;var ret=size=Math.ceil(size/factor)*factor;return ret}function getNativeTypeSize(type){switch(type){case"i1":case"i8":return 1;case"i16":return 2;case"i32":return 4;case"i64":return 8;case"float":return 4;case"double":return 8;default:{if(type[type.length-1]==="*"){return 4}else if(type[0]==="i"){var bits=parseInt(type.substr(1));assert(bits%8===0);return bits/8}else{return 0}}}}function warnOnce(text){if(!warnOnce.shown)warnOnce.shown={};if(!warnOnce.shown[text]){warnOnce.shown[text]=1;err(text)}}var asm2wasmImports={"f64-rem":(function(x,y){return x%y}),"debugger":(function(){debugger})};var jsCallStartIndex=1;var functionPointers=new Array(0);function addFunction(func,sig){var base=0;for(var i=base;i<base+0;i++){if(!functionPointers[i]){functionPointers[i]=func;return jsCallStartIndex+i}}throw"Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."}function removeFunction(index){functionPointers[index-jsCallStartIndex]=null}var funcWrappers={};function getFuncWrapper(func,sig){if(!func)return;assert(sig);if(!funcWrappers[sig]){funcWrappers[sig]={}}var sigCache=funcWrappers[sig];if(!sigCache[func]){if(sig.length===1){sigCache[func]=function dynCall_wrapper(){return dynCall(sig,func)}}else if(sig.length===2){sigCache[func]=function dynCall_wrapper(arg){return dynCall(sig,func,[arg])}}else{sigCache[func]=function dynCall_wrapper(){return dynCall(sig,func,Array.prototype.slice.call(arguments))}}}return sigCache[func]}function makeBigInt(low,high,unsigned){return unsigned?+(low>>>0)+ +(high>>>0)*4294967296:+(low>>>0)+ +(high|0)*4294967296}function dynCall(sig,ptr,args){if(args&&args.length){return Module["dynCall_"+sig].apply(null,[ptr].concat(args))}else{return Module["dynCall_"+sig].call(null,ptr)}}var Runtime={dynCall:dynCall};var GLOBAL_BASE=1024;var ABORT=false;var EXITSTATUS=0;function assert(condition,text){if(!condition){abort("Assertion failed: "+text)}}var globalScope=this;function getCFunc(ident){var func=Module["_"+ident];assert(func,"Cannot call unknown function "+ident+", make sure it is exported");return func}var JSfuncs={"stackSave":(function(){stackSave()}),"stackRestore":(function(){stackRestore()}),"arrayToC":(function(arr){var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}),"stringToC":(function(str){var ret=0;if(str!==null&&str!==undefined&&str!==0){var len=(str.length<<2)+1;ret=stackAlloc(len);stringToUTF8(str,ret,len)}return ret})};var toC={"string":JSfuncs["stringToC"],"array":JSfuncs["arrayToC"]};function ccall(ident,returnType,argTypes,args,opts){function convertReturnValue(ret){if(returnType==="string")return Pointer_stringify(ret);if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func.apply(null,cArgs);ret=convertReturnValue(ret);if(stack!==0)stackRestore(stack);return ret}function cwrap(ident,returnType,argTypes,opts){argTypes=argTypes||[];var numericArgs=argTypes.every((function(type){return type==="number"}));var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return(function(){return ccall(ident,returnType,argTypes,arguments,opts)})}function setValue(ptr,value,type,noSafe){type=type||"i8";if(type.charAt(type.length-1)==="*")type="i32";switch(type){case"i1":HEAP8[ptr>>0]=value;break;case"i8":HEAP8[ptr>>0]=value;break;case"i16":HEAP16[ptr>>1]=value;break;case"i32":HEAP32[ptr>>2]=value;break;case"i64":tempI64=[value>>>0,(tempDouble=value,+Math_abs(tempDouble)>=1?tempDouble>0?(Math_min(+Math_floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math_ceil((tempDouble- +(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[ptr>>2]=tempI64[0],HEAP32[ptr+4>>2]=tempI64[1];break;case"float":HEAPF32[ptr>>2]=value;break;case"double":HEAPF64[ptr>>3]=value;break;default:abort("invalid type for setValue: "+type)}}function getValue(ptr,type,noSafe){type=type||"i8";if(type.charAt(type.length-1)==="*")type="i32";switch(type){case"i1":return HEAP8[ptr>>0];case"i8":return HEAP8[ptr>>0];case"i16":return HEAP16[ptr>>1];case"i32":return HEAP32[ptr>>2];case"i64":return HEAP32[ptr>>2];case"float":return HEAPF32[ptr>>2];case"double":return HEAPF64[ptr>>3];default:abort("invalid type for getValue: "+type)}return null}var ALLOC_NORMAL=0;var ALLOC_STACK=1;var ALLOC_STATIC=2;var ALLOC_DYNAMIC=3;var ALLOC_NONE=4;function allocate(slab,types,allocator,ptr){var zeroinit,size;if(typeof slab==="number"){zeroinit=true;size=slab}else{zeroinit=false;size=slab.length}var singleType=typeof types==="string"?types:null;var ret;if(allocator==ALLOC_NONE){ret=ptr}else{ret=[typeof _malloc==="function"?_malloc:staticAlloc,stackAlloc,staticAlloc,dynamicAlloc][allocator===undefined?ALLOC_STATIC:allocator](Math.max(size,singleType?1:types.length))}if(zeroinit){var stop;ptr=ret;assert((ret&3)==0);stop=ret+(size&~3);for(;ptr<stop;ptr+=4){HEAP32[ptr>>2]=0}stop=ret+size;while(ptr<stop){HEAP8[ptr++>>0]=0}return ret}if(singleType==="i8"){if(slab.subarray||slab.slice){HEAPU8.set(slab,ret)}else{HEAPU8.set(new Uint8Array(slab),ret)}return ret}var i=0,type,typeSize,previousType;while(i<size){var curr=slab[i];type=singleType||types[i];if(type===0){i++;continue}if(type=="i64")type="i32";setValue(ret+i,curr,type);if(previousType!==type){typeSize=getNativeTypeSize(type);previousType=type}i+=typeSize}return ret}function getMemory(size){if(!staticSealed)return staticAlloc(size);if(!runtimeInitialized)return dynamicAlloc(size);return _malloc(size)}function Pointer_stringify(ptr,length){if(length===0||!ptr)return"";var hasUtf=0;var t;var i=0;while(1){t=HEAPU8[ptr+i>>0];hasUtf|=t;if(t==0&&!length)break;i++;if(length&&i==length)break}if(!length)length=i;var ret="";if(hasUtf<128){var MAX_CHUNK=1024;var curr;while(length>0){curr=String.fromCharCode.apply(String,HEAPU8.subarray(ptr,ptr+Math.min(length,MAX_CHUNK)));ret=ret?ret+curr:curr;ptr+=MAX_CHUNK;length-=MAX_CHUNK}return ret}return UTF8ToString(ptr)}function AsciiToString(ptr){var str="";while(1){var ch=HEAP8[ptr++>>0];if(!ch)return str;str+=String.fromCharCode(ch)}}function stringToAscii(str,outPtr){return writeAsciiToMemory(str,outPtr,false)}var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(u8Array,idx){var endPtr=idx;while(u8Array[endPtr])++endPtr;if(endPtr-idx>16&&u8Array.subarray&&UTF8Decoder){return UTF8Decoder.decode(u8Array.subarray(idx,endPtr))}else{var u0,u1,u2,u3,u4,u5;var str="";while(1){u0=u8Array[idx++];if(!u0)return str;if(!(u0&128)){str+=String.fromCharCode(u0);continue}u1=u8Array[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}u2=u8Array[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u3=u8Array[idx++]&63;if((u0&248)==240){u0=(u0&7)<<18|u1<<12|u2<<6|u3}else{u4=u8Array[idx++]&63;if((u0&252)==248){u0=(u0&3)<<24|u1<<18|u2<<12|u3<<6|u4}else{u5=u8Array[idx++]&63;u0=(u0&1)<<30|u1<<24|u2<<18|u3<<12|u4<<6|u5}}}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}}}function UTF8ToString(ptr){return UTF8ArrayToString(HEAPU8,ptr)}function stringToUTF8Array(str,outU8Array,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;outU8Array[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;outU8Array[outIdx++]=192|u>>6;outU8Array[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;outU8Array[outIdx++]=224|u>>12;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else if(u<=2097151){if(outIdx+3>=endIdx)break;outU8Array[outIdx++]=240|u>>18;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else if(u<=67108863){if(outIdx+4>=endIdx)break;outU8Array[outIdx++]=248|u>>24;outU8Array[outIdx++]=128|u>>18&63;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else{if(outIdx+5>=endIdx)break;outU8Array[outIdx++]=252|u>>30;outU8Array[outIdx++]=128|u>>24&63;outU8Array[outIdx++]=128|u>>18&63;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}}outU8Array[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127){++len}else if(u<=2047){len+=2}else if(u<=65535){len+=3}else if(u<=2097151){len+=4}else if(u<=67108863){len+=5}else{len+=6}}return len}var UTF16Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf-16le"):undefined;function UTF16ToString(ptr){var endPtr=ptr;var idx=endPtr>>1;while(HEAP16[idx])++idx;endPtr=idx<<1;if(endPtr-ptr>32&&UTF16Decoder){return UTF16Decoder.decode(HEAPU8.subarray(ptr,endPtr))}else{var i=0;var str="";while(1){var codeUnit=HEAP16[ptr+i*2>>1];if(codeUnit==0)return str;++i;str+=String.fromCharCode(codeUnit)}}}function stringToUTF16(str,outPtr,maxBytesToWrite){if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647}if(maxBytesToWrite<2)return 0;maxBytesToWrite-=2;var startPtr=outPtr;var numCharsToWrite=maxBytesToWrite<str.length*2?maxBytesToWrite/2:str.length;for(var i=0;i<numCharsToWrite;++i){var codeUnit=str.charCodeAt(i);HEAP16[outPtr>>1]=codeUnit;outPtr+=2}HEAP16[outPtr>>1]=0;return outPtr-startPtr}function lengthBytesUTF16(str){return str.length*2}function UTF32ToString(ptr){var i=0;var str="";while(1){var utf32=HEAP32[ptr+i*4>>2];if(utf32==0)return str;++i;if(utf32>=65536){var ch=utf32-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}else{str+=String.fromCharCode(utf32)}}}function stringToUTF32(str,outPtr,maxBytesToWrite){if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647}if(maxBytesToWrite<4)return 0;var startPtr=outPtr;var endPtr=startPtr+maxBytesToWrite-4;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343){var trailSurrogate=str.charCodeAt(++i);codeUnit=65536+((codeUnit&1023)<<10)|trailSurrogate&1023}HEAP32[outPtr>>2]=codeUnit;outPtr+=4;if(outPtr+4>endPtr)break}HEAP32[outPtr>>2]=0;return outPtr-startPtr}function lengthBytesUTF32(str){var len=0;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343)++i;len+=4}return len}function allocateUTF8(str){var size=lengthBytesUTF8(str)+1;var ret=_malloc(size);if(ret)stringToUTF8Array(str,HEAP8,ret,size);return ret}function allocateUTF8OnStack(str){var size=lengthBytesUTF8(str)+1;var ret=stackAlloc(size);stringToUTF8Array(str,HEAP8,ret,size);return ret}function demangle(func){return func}function demangleAll(text){var regex=/__Z[\w\d_]+/g;return text.replace(regex,(function(x){var y=demangle(x);return x===y?x:x+" ["+y+"]"}))}function jsStackTrace(){var err=new Error;if(!err.stack){try{throw new Error(0)}catch(e){err=e}if(!err.stack){return"(no stack trace available)"}}return err.stack.toString()}function stackTrace(){var js=jsStackTrace();if(Module["extraStackTrace"])js+="\n"+Module["extraStackTrace"]();return demangleAll(js)}var PAGE_SIZE=16384;var WASM_PAGE_SIZE=65536;var ASMJS_PAGE_SIZE=16777216;var MIN_TOTAL_MEMORY=16777216;function alignUp(x,multiple){if(x%multiple>0){x+=multiple-x%multiple}return x}var HEAP,buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBuffer(buf){Module["buffer"]=buffer=buf}function updateGlobalBufferViews(){Module["HEAP8"]=HEAP8=new Int8Array(buffer);Module["HEAP16"]=HEAP16=new Int16Array(buffer);Module["HEAP32"]=HEAP32=new Int32Array(buffer);Module["HEAPU8"]=HEAPU8=new Uint8Array(buffer);Module["HEAPU16"]=HEAPU16=new Uint16Array(buffer);Module["HEAPU32"]=HEAPU32=new Uint32Array(buffer);Module["HEAPF32"]=HEAPF32=new Float32Array(buffer);Module["HEAPF64"]=HEAPF64=new Float64Array(buffer)}var STATIC_BASE,STATICTOP,staticSealed;var STACK_BASE,STACKTOP,STACK_MAX;var DYNAMIC_BASE,DYNAMICTOP_PTR;STATIC_BASE=STATICTOP=STACK_BASE=STACKTOP=STACK_MAX=DYNAMIC_BASE=DYNAMICTOP_PTR=0;staticSealed=false;function abortOnCannotGrowMemory(){abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value "+TOTAL_MEMORY+", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")}if(!Module["reallocBuffer"])Module["reallocBuffer"]=(function(size){var ret;try{var oldHEAP8=HEAP8;ret=new ArrayBuffer(size);var temp=new Int8Array(ret);temp.set(oldHEAP8)}catch(e){return false}var success=_emscripten_replace_memory(ret);if(!success)return false;return ret});function enlargeMemory(){var PAGE_MULTIPLE=Module["usingWasm"]?WASM_PAGE_SIZE:ASMJS_PAGE_SIZE;var LIMIT=2147483648-PAGE_MULTIPLE;if(HEAP32[DYNAMICTOP_PTR>>2]>LIMIT){return false}var OLD_TOTAL_MEMORY=TOTAL_MEMORY;TOTAL_MEMORY=Math.max(TOTAL_MEMORY,MIN_TOTAL_MEMORY);while(TOTAL_MEMORY<HEAP32[DYNAMICTOP_PTR>>2]){if(TOTAL_MEMORY<=536870912){TOTAL_MEMORY=alignUp(2*TOTAL_MEMORY,PAGE_MULTIPLE)}else{TOTAL_MEMORY=Math.min(alignUp((3*TOTAL_MEMORY+2147483648)/4,PAGE_MULTIPLE),LIMIT)}}var replacement=Module["reallocBuffer"](TOTAL_MEMORY);if(!replacement||replacement.byteLength!=TOTAL_MEMORY){TOTAL_MEMORY=OLD_TOTAL_MEMORY;return false}updateGlobalBuffer(replacement);updateGlobalBufferViews();return true}var byteLength;try{byteLength=Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,"byteLength").get);byteLength(new ArrayBuffer(4))}catch(e){byteLength=(function(buffer){return buffer.byteLength})}var TOTAL_STACK=Module["TOTAL_STACK"]||5242880;var TOTAL_MEMORY=Module["TOTAL_MEMORY"]||16777216;if(TOTAL_MEMORY<TOTAL_STACK)err("TOTAL_MEMORY should be larger than TOTAL_STACK, was "+TOTAL_MEMORY+"! (TOTAL_STACK="+TOTAL_STACK+")");if(Module["buffer"]){buffer=Module["buffer"]}else{if(typeof WebAssembly==="object"&&typeof WebAssembly.Memory==="function"){Module["wasmMemory"]=new WebAssembly.Memory({"initial":TOTAL_MEMORY/WASM_PAGE_SIZE});buffer=Module["wasmMemory"].buffer}else{buffer=new ArrayBuffer(TOTAL_MEMORY)}Module["buffer"]=buffer}updateGlobalBufferViews();function getTotalMemory(){return TOTAL_MEMORY}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback();continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){Module["dynCall_v"](func)}else{Module["dynCall_vi"](func,callback.arg)}}else{func(callback.arg===undefined?null:callback.arg)}}}var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATEXIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;var runtimeExited=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function ensureInitRuntime(){if(runtimeInitialized)return;runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function exitRuntime(){callRuntimeCallbacks(__ATEXIT__);runtimeExited=true}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPreMain(cb){__ATMAIN__.unshift(cb)}function addOnExit(cb){__ATEXIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}function writeStringToMemory(string,buffer,dontAddNull){warnOnce("writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!");var lastChar,end;if(dontAddNull){end=buffer+lengthBytesUTF8(string);lastChar=HEAP8[end]}stringToUTF8(string,buffer,Infinity);if(dontAddNull)HEAP8[end]=lastChar}function writeArrayToMemory(array,buffer){HEAP8.set(array,buffer)}function writeAsciiToMemory(str,buffer,dontAddNull){for(var i=0;i<str.length;++i){HEAP8[buffer++>>0]=str.charCodeAt(i)}if(!dontAddNull)HEAP8[buffer>>0]=0}function unSign(value,bits,ignore){if(value>=0){return value}return bits<=32?2*Math.abs(1<<bits-1)+value:Math.pow(2,bits)+value}function reSign(value,bits,ignore){if(value<=0){return value}var half=bits<=32?Math.abs(1<<bits-1):Math.pow(2,bits-1);if(value>=half&&(bits<=32||value>half)){value=-2*half+value}return value}var Math_abs=Math.abs;var Math_cos=Math.cos;var Math_sin=Math.sin;var Math_tan=Math.tan;var Math_acos=Math.acos;var Math_asin=Math.asin;var Math_atan=Math.atan;var Math_atan2=Math.atan2;var Math_exp=Math.exp;var Math_log=Math.log;var Math_sqrt=Math.sqrt;var Math_ceil=Math.ceil;var Math_floor=Math.floor;var Math_pow=Math.pow;var Math_imul=Math.imul;var Math_fround=Math.fround;var Math_round=Math.round;var Math_min=Math.min;var Math_max=Math.max;var Math_clz32=Math.clz32;var Math_trunc=Math.trunc;var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function getUniqueRunDependency(id){return id}function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};var memoryInitializer=null;var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return String.prototype.startsWith?filename.startsWith(dataURIPrefix):filename.indexOf(dataURIPrefix)===0}function integrateWasmJS(){var method="native-wasm";var wasmTextFile="dvl.wast";var wasmBinaryFile="dvl.wasm";var asmjsCodeFile="dvl.temp.asm.js";if(!isDataURI(wasmTextFile)){wasmTextFile=locateFile(wasmTextFile)}if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}if(!isDataURI(asmjsCodeFile)){asmjsCodeFile=locateFile(asmjsCodeFile)}var wasmPageSize=64*1024;var info={"global":null,"env":null,"asm2wasm":asm2wasmImports,"parent":Module};var exports=null;function mergeMemory(newBuffer){var oldBuffer=Module["buffer"];if(newBuffer.byteLength<oldBuffer.byteLength){err("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here")}var oldView=new Int8Array(oldBuffer);var newView=new Int8Array(newBuffer);newView.set(oldView);updateGlobalBuffer(newBuffer);updateGlobalBufferViews()}function fixImports(imports){return imports}function getBinary(){try{if(Module["wasmBinary"]){return new Uint8Array(Module["wasmBinary"])}if(Module["readBinary"]){return Module["readBinary"](wasmBinaryFile)}else{throw"both async and sync fetching of the wasm failed"}}catch(err){abort(err)}}function getBinaryPromise(){if(!Module["wasmBinary"]&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then((function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()})).catch((function(){return getBinary()}))}return new Promise((function(resolve,reject){resolve(getBinary())}))}function doNativeWasm(global,env,providedBuffer){if(typeof WebAssembly!=="object"){err("no native wasm support detected");return false}if(!(Module["wasmMemory"]instanceof WebAssembly.Memory)){err("no native wasm Memory in use");return false}env["memory"]=Module["wasmMemory"];info["global"]={"NaN":NaN,"Infinity":Infinity};info["global.Math"]=Math;info["env"]=env;function receiveInstance(instance,module){exports=instance.exports;if(exports.memory)mergeMemory(exports.memory);Module["asm"]=exports;Module["usingWasm"]=true;removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");if(Module["instantiateWasm"]){try{return Module["instantiateWasm"](info,receiveInstance)}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}function receiveInstantiatedSource(output){receiveInstance(output["instance"],output["module"])}function instantiateArrayBuffer(receiver){getBinaryPromise().then((function(binary){return WebAssembly.instantiate(binary,info)})).then(receiver).catch((function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)}))}if(!Module["wasmBinary"]&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&typeof fetch==="function"){WebAssembly.instantiateStreaming(fetch(wasmBinaryFile,{credentials:"same-origin"}),info).then(receiveInstantiatedSource).catch((function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");instantiateArrayBuffer(receiveInstantiatedSource)}))}else{instantiateArrayBuffer(receiveInstantiatedSource)}return{}}Module["asmPreload"]=Module["asm"];var asmjsReallocBuffer=Module["reallocBuffer"];var wasmReallocBuffer=(function(size){var PAGE_MULTIPLE=Module["usingWasm"]?WASM_PAGE_SIZE:ASMJS_PAGE_SIZE;size=alignUp(size,PAGE_MULTIPLE);var old=Module["buffer"];var oldSize=old.byteLength;if(Module["usingWasm"]){try{var result=Module["wasmMemory"].grow((size-oldSize)/wasmPageSize);if(result!==(-1|0)){return Module["buffer"]=Module["wasmMemory"].buffer}else{return null}}catch(e){return null}}});Module["reallocBuffer"]=(function(size){if(finalMethod==="asmjs"){return asmjsReallocBuffer(size)}else{return wasmReallocBuffer(size)}});var finalMethod="";Module["asm"]=(function(global,env,providedBuffer){env=fixImports(env);if(!env["table"]){var TABLE_SIZE=Module["wasmTableSize"];if(TABLE_SIZE===undefined)TABLE_SIZE=1024;var MAX_TABLE_SIZE=Module["wasmMaxTableSize"];if(typeof WebAssembly==="object"&&typeof WebAssembly.Table==="function"){if(MAX_TABLE_SIZE!==undefined){env["table"]=new WebAssembly.Table({"initial":TABLE_SIZE,"maximum":MAX_TABLE_SIZE,"element":"anyfunc"})}else{env["table"]=new WebAssembly.Table({"initial":TABLE_SIZE,element:"anyfunc"})}}else{env["table"]=new Array(TABLE_SIZE)}Module["wasmTable"]=env["table"]}if(!env["memoryBase"]){env["memoryBase"]=Module["STATIC_BASE"]}if(!env["tableBase"]){env["tableBase"]=0}var exports;exports=doNativeWasm(global,env,providedBuffer);assert(exports,"no binaryen method succeeded.");return exports});var methodHandler=Module["asm"]}integrateWasmJS();var ASM_CONSTS=[(function($0){jDVLClient_Constructor(Pointer_stringify($0));return 0}),(function($0){console.log("DVLRESULT",$0)}),(function($0){console.log("DVLRESULT",$0)}),(function($0){console.log("SetDynamicLabel",$0)}),(function($0,$1){var canvas=window.jDVLDynamicLabelPOIIconCanvas;var id=canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height);var p=$0;var n=$1;for(var i=0;i<n;++i)setValue(p++,id.data[i],"i8");return DvlEnums.DVLRESULT.OK}),(function($0){jDVLClient_Destructor(Pointer_stringify($0));return 0}),(function($0,$1,$2){jDVLClient_NotifySceneGeometryFailed(Pointer_stringify($0),Pointer_stringify($1),$2);return 0}),(function($0,$1){jDVLClient_NotifySceneGeometryLoaded(Pointer_stringify($0),Pointer_stringify($1));return 0}),(function($0){return jDVLClient_RequestCallback($0)}),(function($0,$1){jDVLClient_NotifyFrameFinished(Pointer_stringify($0),Pointer_stringify($1));return 0}),(function($0,$1){jDVLClient_NotifyFrameStarted(Pointer_stringify($0),Pointer_stringify($1));return 0}),(function($0,$1){return jDVLClient_NotifyFileLoadProgress(Pointer_stringify($0),$1)}),(function($0,$1,$2){jDVLClient_OnUrlClick(Pointer_stringify($0),Pointer_stringify($1),Pointer_stringify($2));return 0}),(function($0,$1,$2){jDVLClient_OnStepEvent(Pointer_stringify($0),$1,Pointer_stringify($2));return 0}),(function($0,$1,$2,$3){jDVLClient_LogMessage(Pointer_stringify($0),$1,Pointer_stringify($2),Pointer_stringify($3));return 0}),(function($0,$1,$2,$3,$4){jDVLClient_OnNodeVisibilityChanged(Pointer_stringify($0),Pointer_stringify($1),Pointer_stringify($2),$3,Pointer_stringify($4));return 0}),(function($0,$1,$2,$3,$4){jDVLClient_OnNodeSelectionChanged(Pointer_stringify($0),Pointer_stringify($1),$2,Pointer_stringify($3),Pointer_stringify($4));return 0}),(function($0,$1,$2,$3){var text=Pointer_stringify($0);var sceneId=Pointer_stringify($1);var mode3D=$2;var dpr=window.devicePixelRatio;var dpi=96*dpr;var poiIconImage=Pointer_stringify($3);var poiIconSize="64,64";if(window.DOMParser){var parser=new DOMParser;xmlDoc=parser.parseFromString(text,"text/xml")}else{xmlDoc=new ActiveXObject("Microsoft.XMLDOM");xmlDoc.async=false;xmlDoc.loadXML(text)}if(!xmlDoc)return DvlEnums.DVLRESULT.NOINTERFACE;var errors=xmlDoc.getElementsByTagName("parsererror");if(errors.length>0){for(var ei=0;ei<errors.length;++ei)console.log(errors[ei].innerText);return DvlEnums.DVLRESULT.BADFORMAT}if(xmlDoc.childNodes.length==0||xmlDoc.childNodes[0].nodeName!="dynamic-labels")return DvlEnums.DVLRESULT.BADARG;if(!window.hasOwnProperty("DynamicLabels"))window.DynamicLabels=[];var DynamicLabels=window.DynamicLabels;var root=xmlDoc.childNodes[0];var poiColors=[];var labelCrop=root.getAttribute("label-crop");labelCrop=labelCrop?!(labelCrop.toLowerCase()=="false"||parseInt(labelCrop)==0):true;console.log("label-crop",labelCrop);for(var ni=0;ni<root.childNodes.length;++ni){var node=root.childNodes[ni];if(node.nodeName=="dynamic-label"){var o={};o.id=node.getAttribute("id");o.name=node.getAttribute("name");o.image=node.getAttribute("image");o.text=node.getAttribute("text");o.font=node.getAttribute("font");o.fontSize=node.getAttribute("font-size");o.textColor=node.getAttribute("text-color");o.bgColor=node.getAttribute("bg-color");o.frameColor=node.getAttribute("frame-color");o.opacity=node.getAttribute("opacity");o.size=node.getAttribute("size");o.pos=node.getAttribute("position");o.pivotPoint=node.getAttribute("pivot-point");o.margin=node.getAttribute("margin");o.alignment=node.getAttribute("alignment");o.poiColorIndex=node.getAttribute("poi-color");o.size=(o.size?o.size:"_").split(",").map(Number);if(isNaN(o.size[0])||isNaN(o.size[1])){if(mode3D){o.size[0]=4;o.size[1]=3}else{o.size[0]=1;o.size[1]=1}}if(o.size[0]<=0||o.size[1]<=0)continue;o.pos=(o.pos?o.pos:"0,0").split(",").map(Number);if(isNaN(o.pos[0])||isNaN(o.pos[1])){o.pos[0]=0;o.pos[1]=0}o.pivotPoint=(o.pivotPoint?o.pivotPoint:"0.5,0.5").split(",").map(Number);if(isNaN(o.pivotPoint[0])||isNaN(o.pivotPoint[1])){o.pivotPoint[0]=.5;o.pivotPoint[1]=.5}o.margin=(o.margin?o.margin:"0,0").split(",").map(Number);if(isNaN(o.margin[0])||isNaN(o.margin[1])){o.margin[0]=0;o.margin[1]=0}o.alignment=(o.alignment?o.alignment:"0,0").split(",").map((function(value){return parseInt(value,10)}));if(isNaN(o.alignment[0])||isNaN(o.alignment[1])){o.alignment[0]=0;o.alignment[1]=0}o.fontSize=o.fontSize?parseFloat(o.fontSize):12;if(isNaN(o.fontSize)||o.fontSize<4)o.fontSize=4;if(o.textColor)o.textColor="#"+o.textColor;if(o.bgColor)o.bgColor="#"+o.bgColor;if(o.frameColor)o.frameColor="#"+o.frameColor;if(o.opacity)o.opacity=parseFloat(o.opacity);o.poiColorIndex=o.poiColorIndex?parseInt(o.poiColorIndex):0;o.poiColor=o.poiColorIndex<poiColors.length?poiColors[o.poiColorIndex]:4294967295;o.fontSize*=dpr;o.margin[0]=Math.ceil(o.margin[0]*dpr);o.margin[1]=Math.ceil(o.margin[1]*dpr);if(mode3D){o.size[0]=Math.ceil(o.size[0]*dpi/2.54);o.size[1]=Math.ceil(o.size[1]*dpi/2.54);if(labelCrop&&!o.image&&o.text&&o.fontSize>0){var borderThickness=Math.ceil(2*dpr);var maxWidth=o.size[0]-(o.margin[0]+borderThickness)*2;var maxHeight=o.size[1]-(o.margin[1]+borderThickness)*2;if(maxWidth>0||maxHeight>0){var rowHeight=Math.ceil(o.fontSize*96/72);var rows=o.text.split("\n");var numRows=Math.min(rows.length,maxHeight/rowHeight|0);if(numRows>0){var canvas=document.createElement("canvas");canvas.id="jDVLDynamicLabelCanvas";canvas.style.visibility="hidden";canvas.style.display="none";canvas.width=maxWidth;canvas.height=maxHeight;var ctx=canvas.getContext("2d");ctx.font=o.fontSize+"pt "+(o.font?o.font:"Arial");o.size[0]=0;o.size[1]=Math.ceil(numRows*rowHeight+(o.margin[1]+borderThickness)*2);for(var i=0;i<numRows;i++){var rowText=rows[i];while(ctx.measureText(rowText).width>maxWidth&&rowText.length>0)rowText=rowText.substr(0,rowText.length-1);if(rowText.length<rows[i].length)rowText=rowText.substr(0,rowText.length-3)+"...";o.size[0]=Math.max(o.size[0],ctx.measureText(rowText).width)}o.size[0]=Math.ceil(o.size[0]+(o.margin[0]+borderThickness)*2);delete canvas}}}}var index=-1;if(o.text!==null&&o.text!==undefined||o.opacity>0){index=DynamicLabels.length;for(var ti=0;ti<DynamicLabels.length;++ti){if(typeof DynamicLabels[ti]=="undefined"){index=ti;break}}}index=Module.ccall("jDVLScene_SetDynamicLabel","number",["string","string","string","number","number","number","number","number","number","number","number","number"],[sceneId,o.id,o.name,index,o.size[0],o.size[1],o.pos[0],o.pos[1],o.pivotPoint[0],o.pivotPoint[1],o.poiColorIndex,o.poiColor]);if(index>=0)DynamicLabels[index]=o;if(o.image&&index>=0){var image=document.createElement("img");image.sceneId=sceneId;image.index=index;image.dynamicLabel=o;image.id="img_"+Math.random().toString(36).substr(2,9);image.style.visibility="hidden";image.style.display="none";image.onerror=(function(){console.log("jDVL: Error loading image for texture.");DynamicLabels[this.index].image=null;Module.ccall("jDVLScene_UpdateDynamicLabel","number",["string","number"],[this.sceneId,this.index])});image.onload=(function(){console.log("UpdateDynamicLabel",this.index,this.width+"x"+this.height);Module.ccall("jDVLScene_UpdateDynamicLabel","number",["string","number"],[this.sceneId,this.index])});image.src="data:image/png;base64,"+o.image;o.image=image}}else if(node.nodeName=="poi-color"){if(node.textContent){var c=parseInt(node.textContent,16);if(!isNaN(c))poiColors.push(c|4278190080)}}else if(node.nodeName=="poi-icon"){poiIconImage=node.getAttribute("image");poiIconSize=node.getAttribute("size")}}if(poiIconImage){var image=document.createElement("img");image.sceneId=sceneId;image.iconSize=poiIconSize;image.id="img_"+Math.random().toString(36).substr(2,9);image.style.visibility="hidden";image.style.display="none";image.onerror=(function(){console.log("jDVL: Error loading image for POI icon.");Module.ccall("jDVLScene_SetPOIIcon","number",["string","number","number","number","number"],[this.sceneId,0,0,0,0])});image.onload=(function(){console.log("POI icon image size",this.width+"x"+this.height);var size=(this.iconSize?this.iconSize:"_").split(",").map(Number);if(isNaN(size[0])||isNaN(size[1])){size[0]=this.width;size[1]=this.height}console.log("POI icon size",size[0]+"x"+size[1]);size[0]*=dpr;size[1]*=dpr;var canvas=window.jDVLDynamicLabelPOIIconCanvas=document.createElement("canvas");canvas.id="jDVLDynamicLabelPOIIconCanvas";canvas.style.visibility="hidden";canvas.style.display="none";canvas.width=Math.pow(2,Math.round(Math.log(size[0])/Math.LN2));canvas.height=Math.pow(2,Math.round(Math.log(size[1])/Math.LN2));console.log("POI icon texture size",canvas.width+"x"+canvas.height);document.body.appendChild(canvas);canvas.getContext("2d").drawImage(this,0,0,this.width,this.height,0,0,canvas.width,canvas.height);Module.ccall("jDVLScene_SetPOIIcon","number",["string","number","number","number","number"],[this.sceneId,size[0],size[1],canvas.width,canvas.height]);document.body.removeChild(canvas);delete window.jDVLDynamicLabelPOIIconCanvas});image.src="data:image/png;base64,"+poiIconImage;window.POIIconImage=image}console.log(DynamicLabels);return DvlEnums.DVLRESULT.OK}),(function($0,$1,$2){var js1=encodeURIComponent(escape(Pointer_stringify($0)));var js2=encodeURIComponent(escape(Pointer_stringify($1)));if($2){js1=js1.toLocaleUpperCase();js2=js2.toLocaleUpperCase()}return js1.localeCompare(js2)}),(function($0,$1,$2){var js1=encodeURIComponent(escape(Pointer_stringify($0)));var js2=encodeURIComponent(escape(Pointer_stringify($1)));if($2){js1=js1.toLocaleUpperCase();js2=js2.toLocaleUpperCase()}return js1.indexOf(js2)>=0}),(function($0,$1,$2){var js1=encodeURIComponent(escape(Pointer_stringify($0)));var js2=encodeURIComponent(escape(Pointer_stringify($1)));if($2){js1=js1.toLocaleUpperCase();js2=js2.toLocaleUpperCase()}return js1.indexOf(js2)==0}),(function($0,$1,$2){var jspattern=new RegExp(encodeURIComponent(escape(Pointer_stringify($0))));var jstext=encodeURIComponent(escape(Pointer_stringify($1)));return $2?jspattern.exec(jstext)==jstext:jspattern.test(jstext)}),(function($0,$1,$2,$3){var p=$0;var w=$1;var h=$2;var n=w*h*4;var canvasId=Pointer_stringify($3);var canvas=document.getElementById(canvasId);var id=canvas.getContext("2d").getImageData(0,0,w,h);for(var i=0;i<n;++i)setValue(p++,id.data[i],"i8");return DvlEnums.DVLRESULT.OK}),(function($0,$1,$2,$3){var image=document.createElement("img");image.bitmap=Pointer_stringify($0);image.maxSize=$3;image.id="img_"+Math.random().toString(36).substr(2,9);image.style.visibility="hidden";image.style.display="none";image.onerror=(function(){console.log("jDVL: Error loading image for texture."+" ("+(new Date).getTime()+")")});image.onload=(function(){var width=Math.pow(2,Math.round(Math.log(this.width)/Math.LN2));var height=Math.pow(2,Math.round(Math.log(this.height)/Math.LN2));width=Math.min(width,this.maxSize);height=Math.min(height,this.maxSize);console.log("image.onload: bitmap='"+image.bitmap+"' "+this.width+"x"+this.height+" -> "+width+"x"+height);var canvas=document.createElement("canvas");canvas.id="jDVLBitmapCanvas-"+Math.random().toString(36).substr(2,9);canvas.style.visibility="hidden";canvas.style.display="none";canvas.width=width;canvas.height=height;document.body.appendChild(canvas);var ctx=canvas.getContext("2d");ctx.imageSmoothingQuality="high";ctx.drawImage(this,0,0,this.width,this.height,0,0,canvas.width,canvas.height);Module.ccall("jDVLBitmap_CreateTexture","null",["string","string","number","number"],[this.bitmap,canvas.id,canvas.width,canvas.height]);document.body.removeChild(canvas);delete canvas});image.src="data:image/"+Pointer_stringify($2)+";base64,"+Pointer_stringify($1);return DvlEnums.DVLRESULT.OK}),(function($0){delete window.DynamicLabels[$0]}),(function($0,$1,$2,$3,$4,$5,$6){console.log("DynamicLabel::Draw:",$0,$3+"x"+$4);var canvas=window.jDVLDynamicLabelCanvas;var ctx=canvas.getContext("2d");var dl=window.DynamicLabels[$0];var image=dl.image;var dpr=window.devicePixelRatio;var cr=$5*dpr;var ft=Math.ceil($6*dpr);if(image){ctx.globalAlpha=dl.opacity?dl.opacity:1;if(image.width>0&&image.height>0&&ctx.globalAlpha>0){cr=0;var iw=$3;var ih=$4;if(iw*image.height>ih*image.width)iw=ih*image.width/image.height;else ih=iw*image.height/image.width;ctx.drawImage(image,0,0,image.width,image.height,$1+($3-iw)*.5,$2+($4-ih)*.5,iw,ih)}}else if(dl.bgColor||dl.opacity){ctx.globalAlpha=dl.opacity?dl.opacity:.5;if(ctx.globalAlpha>0){ctx.fillStyle=dl.bgColor?dl.bgColor:"#000000";if(cr>0){var x=$1;var y=$2;var w=$3;var h=$4;ctx.beginPath();ctx.moveTo(x+cr,y);ctx.lineTo(x+w-cr,y);ctx.quadraticCurveTo(x+w,y,x+w,y+cr);ctx.lineTo(x+w,y+h-cr);ctx.quadraticCurveTo(x+w,y+h,x+w-cr,y+h);ctx.lineTo(x+cr,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-cr);ctx.lineTo(x,y+cr);ctx.quadraticCurveTo(x,y,x+cr,y);ctx.closePath();ctx.fill()}else ctx.fillRect($1,$2,$3,$4)}}ctx.globalAlpha=1;if(dl.frameColor){ctx.strokeStyle=dl.frameColor;for(var i=0;i<ft;i++){var x=$1+.5+i;var y=$2+.5+i;var w=$3-1-i*2;var h=$4-1-i*2;if(cr>0){var r=cr-i;ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();ctx.stroke()}else ctx.strokeRect(x,y,w,h)}}if(dl.text&&dl.fontSize>0){var maxWidth=$3-(dl.margin[0]+ft)*2;var maxHeight=$4-(dl.margin[1]+ft)*2;if(maxWidth<=0||maxHeight<=0)return DvlEnums.DVLRESULT.OK;var rowHeight=Math.ceil(dl.fontSize*96/72);var rows=dl.text.split("\n");var numRows=Math.min(rows.length,maxHeight/rowHeight|0);if(numRows<=0)return DvlEnums.DVLRESULT.OK;ctx.font=dl.fontSize+"pt "+(dl.font?dl.font:"Arial");ctx.fillStyle=dl.textColor?dl.textColor:"#FFFFFF";var posX=$1+dl.margin[0]+ft;var posY=$2+dl.margin[1]+ft;switch(dl.alignment[0]){default:case 0:ctx.textAlign="left";break;case 1:ctx.textAlign="center";posX+=maxWidth/2;break;case 2:ctx.textAlign="right";posX+=maxWidth;break}switch(dl.alignment[1]){default:case 0:ctx.textBaseline="top";break;case 1:ctx.textBaseline="middle";posY+=(maxHeight-(numRows-1)*rowHeight)*.5;break;case 2:ctx.textBaseline="bottom";posY+=maxHeight-(numRows-1)*rowHeight;break}for(var i=0;i<numRows;i++){var rowText=rows[i];while(ctx.measureText(rowText).width>maxWidth&&rowText.length>0)rowText=rowText.substr(0,rowText.length-1);if(rowText.length<rows[i].length)rowText=rowText.substr(0,rowText.length-3)+"...";ctx.fillText(rowText,posX,posY);posY+=rowHeight}}return DvlEnums.DVLRESULT.OK}),(function($0,$1){var canvas=window.jDVLDynamicLabelCanvas=document.createElement("canvas");canvas.id="jDVLDynamicLabelCanvas";canvas.style.visibility="hidden";canvas.style.display="none";canvas.width=$0;canvas.height=$1;document.body.appendChild(canvas);return DvlEnums.DVLRESULT.OK}),(function($0,$1){var canvas=window.jDVLDynamicLabelCanvas;var id=canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height);var p=$0;var n=$1;for(var i=0;i<n;++i)setValue(p++,id.data[i],"i8");document.body.removeChild(canvas);delete window.jDVLDynamicLabelCanvas;return DvlEnums.DVLRESULT.OK}),(function($0,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22){var bitmap=Pointer_stringify($0);var size=$1;var rcTexCoords=$2;var w=$3;var h=$4;var pixelRatio=$5;var style=$6;var bgOpacity=$7;var bgColor=$8;var borderOpacity=$9;var borderColor=$10;var borderLineStyle=$11;var bw=$12;var text=Pointer_stringify($13);var textColor=$14;var font=Pointer_stringify($15)||"Arial";var fontSize=$16;var fontWeight=$17;var fontItalic=$18;var encoding=$19;var horizontalAlignment=$20;var verticalAlignment=$21;var link=Pointer_stringify($22);var canvas=document.createElement("canvas");canvas.id="jDVLAnnotationCanvas-"+Math.random().toString(36).substr(2,9);canvas.style.visibility="hidden";canvas.style.display="none";canvas.width=1024;canvas.height=1024;document.body.appendChild(canvas);var ctx=canvas.getContext("2d");fontWeight=Math.min(Math.max(Math.round(fontWeight/100),1),9)*100;ctx.font=fontWeight+(fontItalic?" italic ":" ")+fontSize+"px "+font;var hp=fontSize*.2;var vp=fontSize*.2;var lineSpacing=Math.ceil(fontSize);var maxLineWidth=(encoding==0?1024:w)-(hp+bw)*2;var maxLines=((encoding==0?1024:h)-(vp+bw)*2)/lineSpacing|0;var textWidth=0;var linkWidth=0;var textLines=encoding==0?text.split("\n"):[];textLines.length=Math.min(textLines.length,link.length>0?maxLines-1:maxLines);function truncate(str){return str.substr(0,str.length-2)+"\u2026"}var linkLines=[];if(link.length>0){var maxLinkLines=maxLines-textLines.length;while(link.length>0&&textLines.length<maxLinkLines){var rowText=link;while(ctx.measureText(rowText).width>maxLineWidth&&rowText.length>1){rowText=rowText.substring(0,rowText.length-1)}linkLines.push(rowText);link=link.substring(rowText.length,link.length)}if(link.length>0){linkLines[linkLines.length-1]=truncate(linkLines[linkLines.length-1])}for(var i=0;i<linkLines.length;i++){linkWidth=Math.max(ctx.measureText(linkLines[i]).width,linkWidth)}}if(encoding==0){for(var i=0;i<textLines.length;i++){textWidth=Math.max(ctx.measureText(textLines[i]).width,textWidth)}w=Math.max(textWidth,linkWidth)+hp*2;h=(textLines.length+linkLines.length)*lineSpacing+vp*2}w=Math.ceil(w+2*bw);h=Math.ceil(h+2*bw);if(style==1){w=h=Math.max(w,h)}setValue(size,w,"float");setValue(size+4,h,"float");w*=pixelRatio;h*=pixelRatio;var tw=Math.pow(2,Math.ceil(Math.log(w)/Math.LN2));var th=Math.pow(2,Math.ceil(Math.log(h)/Math.LN2));tw=Math.min(tw,canvas.width);th=Math.min(th,canvas.height);if(w>tw||h>th){var scale=Math.min(tw/w,th/h);w*=scale;h*=scale;pixelRatio*=scale}hp*=pixelRatio;vp*=pixelRatio;bw*=pixelRatio;fontSize*=pixelRatio;lineSpacing*=pixelRatio;textWidth*=pixelRatio;setValue(rcTexCoords,0,"float");setValue(rcTexCoords+4,1-h/th,"float");setValue(rcTexCoords+8,w/tw,"float");setValue(rcTexCoords+12,1,"float");bgColor=bgColor.toString(16);bgColor="#"+"000000".substring(bgColor.length)+bgColor;ctx.fillStyle=bgColor;borderColor=borderColor.toString(16);borderColor="#"+"000000".substring(borderColor.length)+borderColor;ctx.strokeStyle=borderColor;ctx.lineWidth=bw;var bw2=bw/2;switch(borderLineStyle){case 2:ctx.setLineDash([bw*5,bw]);break;case 3:ctx.setLineDash([bw*2,bw]);break;case 4:ctx.setLineDash([bw*5,bw,bw*2,bw]);break;case 5:ctx.setLineDash([bw*5,bw,bw*2,bw,bw*2,bw]);break}if(style==0){if(bgOpacity>0){ctx.globalAlpha=bgOpacity;ctx.fillRect(0,0,w,h)}if(borderOpacity>0){ctx.globalAlpha=borderOpacity;ctx.strokeRect(bw2,bw2,w-bw,h-bw)}}else if(style==1){var xc=w/2;var yc=h/2;var radius=Math.min(xc,yc);ctx.beginPath();ctx.arc(xc,yc,radius-bw2,0,2*Math.PI);ctx.closePath();if(bgOpacity>0){ctx.globalAlpha=bgOpacity;ctx.fill()}if(borderOpacity>0){ctx.globalAlpha=borderOpacity;ctx.stroke()}}ctx.globalAlpha=1;ctx.setLineDash([]);ctx.font=fontWeight+(fontItalic?" italic ":" ")+fontSize+"px "+font;ctx.textAlign="left";ctx.textBaseline="middle";function renderLink(){if(linkLines.length>0){ctx.fillStyle="#0000FF";h-=linkLines.length*lineSpacing;var x=(w-linkWidth)*.5;var y=h-bw-vp+lineSpacing*.5;for(var i=0;i<linkLines.length;i++){ctx.fillText(linkLines[i],x,y);y+=lineSpacing}}}if(encoding==0){renderLink();textColor=textColor.toString(16);ctx.fillStyle="#"+"000000".substring(textColor.length)+textColor;ctx.strokeStyle=bgColor;ctx.lineWidth=3;var x=(w-textWidth)*.5;var y=(h-(textLines.length-1)*lineSpacing)*.5;if(textLines.length==1){x=w*.5;ctx.textAlign="center"}for(var i=0;i<textLines.length;i++){if(style==3){ctx.strokeText(textLines[i],x,y)}ctx.fillText(textLines[i],x,y);y+=lineSpacing}Module.ccall("jDVLBitmap_CreateTexture","null",["string","string","number","number"],[bitmap,canvas.id,tw,th]);document.body.removeChild(canvas)}else if(encoding==1&&typeof html2canvas!="undefined"){renderLink();var iframe=document.createElement("iframe");iframe.style.visibility="hidden";iframe.width=(w-bw*2)/pixelRatio;iframe.height=(h-bw*2)/pixelRatio;document.body.appendChild(iframe);var doc=iframe.contentDocument||iframe.contentWindow.document;doc.open();doc.close();doc.body.innerHTML=text;var htmlCanvas=document.createElement("canvas");htmlCanvas.width=iframe.width*pixelRatio;htmlCanvas.height=iframe.height*pixelRatio;htmlCanvas.style.width=iframe.width+"px";htmlCanvas.style.height=iframe.height+"px";var context=htmlCanvas.getContext("2d");context.scale(pixelRatio,pixelRatio);html2canvas(doc.body,{canvas:htmlCanvas,backgroundColor:null}).then((function(htmlCanvas){if(htmlCanvas.width>0&&htmlCanvas.height>0){canvas.getContext("2d").drawImage(htmlCanvas,bw,bw)}Module.ccall("jDVLBitmap_CreateTexture","null",["string","string","number","number"],[bitmap,canvas.id,tw,th]);document.body.removeChild(iframe);document.body.removeChild(canvas)}))}else{Module.ccall("jDVLBitmap_CreateTexture","null",["string","string","number","number"],[bitmap,canvas.id,tw,th]);document.body.removeChild(canvas)}return DvlEnums.DVLRESULT.OK}),(function($0,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22){var bitmap=Pointer_stringify($0);var size=$1;var rcTexCoords=$2;var w=$3;var h=$4;var pixelRatio=$5;var style=$6;var bgOpacity=$7;var bgColor=$8;var borderOpacity=$9;var borderColor=$10;var borderLineStyle=$11;var bw=$12;var text=Pointer_stringify($13);var textColor=$14;var font=Pointer_stringify($15);var fontSize=$16;var fontWeight=$17;var fontItalic=$18;var encoding=$19;var horizontalAlignment=$20;var verticalAlignment=$21;var link=Pointer_stringify($22);var canvas=document.createElement("canvas");canvas.id="jDVLAnnotationCanvas-"+Math.random().toString(36).substr(2,9);canvas.style.visibility="hidden";canvas.style.display="none";canvas.width=1024;canvas.height=1024;document.body.appendChild(canvas);var ctx=canvas.getContext("2d");fontWeight=Math.min(Math.max(Math.round(fontWeight/100),1),9)*100;ctx.font=fontWeight+(fontItalic?" italic ":" ")+fontSize+"px "+font;var hp=fontSize*.2;var vp=fontSize*.2;var lineSpacing=Math.ceil(fontSize);var maxLineWidth=(encoding==0?1024:w)-(hp+bw)*2;var maxLines=((encoding==0?1024:h)-(vp+bw)*2)/lineSpacing|0;var textWidth=0;var linkWidth=0;var textLines=encoding==0?text.split("\n"):[];textLines.length=Math.min(textLines.length,link.length>0?maxLines-1:maxLines);function truncate(str){return str.substr(0,str.length-2)+"\u2026"}var linkLines=[];var dimensionWidth=0;var toleralanceWidth=0;var space=0;if(encoding==0){dimensionWidth=ctx.measureText(textLines[0]).width;var toleralanceWidth1=ctx.measureText(textLines[1]).width;var toleralanceWidth2=ctx.measureText(textLines[1]).width;toleralanceWidth=toleralanceWidth1>toleralanceWidth2?toleralanceWidth1:toleralanceWidth2;textWidth=dimensionWidth+toleralanceWidth;space=toleralanceWidth*.2;w=textWidth+space+4*hp;h=2*lineSpacing+vp*2}w=Math.ceil(w+2*bw);h=Math.ceil(h+2*bw);if(style==1){w=h=Math.max(w,h)}setValue(size,w,"float");setValue(size+4,h,"float");w*=pixelRatio;h*=pixelRatio;var tw=Math.pow(2,Math.ceil(Math.log(w)/Math.LN2));var th=Math.pow(2,Math.ceil(Math.log(h)/Math.LN2));tw=Math.min(tw,canvas.width);th=Math.min(th,canvas.height);if(w>tw||h>th){var scale=Math.min(tw/w,th/h);w*=scale;h*=scale;pixelRatio*=scale}hp*=pixelRatio;vp*=pixelRatio;bw*=pixelRatio;fontSize*=pixelRatio;lineSpacing*=pixelRatio;textWidth*=pixelRatio;dimensionWidth*=pixelRatio;toleralanceWidth*=pixelRatio;space*=pixelRatio;setValue(rcTexCoords,0,"float");setValue(rcTexCoords+4,1-h/th,"float");setValue(rcTexCoords+8,w/tw,"float");setValue(rcTexCoords+12,1,"float");bgColor=bgColor.toString(16);bgColor="#"+"000000".substring(bgColor.length)+bgColor;ctx.fillStyle=bgColor;borderColor=borderColor.toString(16);borderColor="#"+"000000".substring(borderColor.length)+borderColor;ctx.strokeStyle=borderColor;ctx.lineWidth=bw;var bw2=bw/2;switch(borderLineStyle){case 2:ctx.setLineDash([bw*5,bw]);break;case 3:ctx.setLineDash([bw*2,bw]);break;case 4:ctx.setLineDash([bw*5,bw,bw*2,bw]);break;case 5:ctx.setLineDash([bw*5,bw,bw*2,bw,bw*2,bw]);break}if(style==0){if(bgOpacity>0){ctx.globalAlpha=bgOpacity;ctx.fillRect(0,0,w,h)}if(borderOpacity>0){ctx.globalAlpha=borderOpacity;ctx.strokeRect(bw2,bw2,w-bw,h-bw)}}else if(style==1){var xc=w/2;var yc=h/2;var radius=Math.min(xc,yc);ctx.beginPath();ctx.arc(xc,yc,radius-bw2,0,2*Math.PI);ctx.closePath();if(bgOpacity>0){ctx.globalAlpha=bgOpacity;ctx.fill()}if(borderOpacity>0){ctx.globalAlpha=borderOpacity;ctx.stroke()}}ctx.globalAlpha=1;ctx.setLineDash([]);ctx.font=fontWeight+(fontItalic?" italic ":" ")+fontSize+"px "+font;ctx.textAlign="left";ctx.textBaseline="middle";if(encoding==0){textColor=textColor.toString(16);ctx.fillStyle="#"+"000000".substring(textColor.length)+textColor;ctx.strokeStyle=bgColor;ctx.lineWidth=3;x=dimensionWidth+space;y=lineSpacing*.5;ctx.fillText(textLines[1],x,y);x=hp;y=lineSpacing;ctx.fillText(textLines[0],x,y);x=dimensionWidth+space;y=lineSpacing*1.5;ctx.fillText(textLines[2],x,y);Module.ccall("jDVLBitmap_CreateTexture","null",["string","string","number","number"],[bitmap,canvas.id,tw,th]);document.body.removeChild(canvas)}return DvlEnums.DVLRESULT.OK})];function _emscripten_asm_const_ii(code,a0){return ASM_CONSTS[code](a0)}function _emscripten_asm_const_iidddddd(code,a0,a1,a2,a3,a4,a5,a6){return ASM_CONSTS[code](a0,a1,a2,a3,a4,a5,a6)}function _emscripten_asm_const_iiiii(code,a0,a1,a2,a3){return ASM_CONSTS[code](a0,a1,a2,a3)}function _emscripten_asm_const_iii(code,a0,a1){return ASM_CONSTS[code](a0,a1)}function _emscripten_asm_const_iiii(code,a0,a1,a2){return ASM_CONSTS[code](a0,a1,a2)}function _emscripten_asm_const_iiiiii(code,a0,a1,a2,a3,a4){return ASM_CONSTS[code](a0,a1,a2,a3,a4)}function _emscripten_asm_const_iid(code,a0,a1){return ASM_CONSTS[code](a0,a1)}function _emscripten_asm_const_iiiidddididiiiiiiiiiiiii(code,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22){return ASM_CONSTS[code](a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22)}STATIC_BASE=GLOBAL_BASE;STATICTOP=STATIC_BASE+397040;__ATINIT__.push({func:(function(){__GLOBAL__sub_I_VDSReader_cpp()})},{func:(function(){__GLOBAL__sub_I_CoreImp_cpp()})},{func:(function(){__GLOBAL__sub_I_query_cpp()})},{func:(function(){__GLOBAL__sub_I_MathConstants_cpp()})},{func:(function(){__GLOBAL__sub_I_UuId_cpp()})},{func:(function(){__GLOBAL__sub_I_ActiveOperationFactory_cpp()})},{func:(function(){__GLOBAL__sub_I_ChangeManager_cpp()})},{func:(function(){__GLOBAL__sub_I_Drawing_cpp()})},{func:(function(){__GLOBAL__sub_I_Id_cpp()})},{func:(function(){__GLOBAL__sub_I_LabelDefinition_cpp()})},{func:(function(){__GLOBAL__sub_I_Material_cpp()})},{func:(function(){__GLOBAL__sub_I_DataModelSQLiteReader_cpp()})},{func:(function(){__GLOBAL__sub_I_ZIPVFSCompression_cpp()})},{func:(function(){___emscripten_environ_constructor()})},{func:(function(){__GLOBAL__sub_I_iostream_cpp()})});var STATIC_BUMP=397040;Module["STATIC_BASE"]=STATIC_BASE;Module["STATIC_BUMP"]=STATIC_BUMP;var tempDoublePtr=STATICTOP;STATICTOP+=16;function copyTempFloat(ptr){HEAP8[tempDoublePtr]=HEAP8[ptr];HEAP8[tempDoublePtr+1]=HEAP8[ptr+1];HEAP8[tempDoublePtr+2]=HEAP8[ptr+2];HEAP8[tempDoublePtr+3]=HEAP8[ptr+3]}function copyTempDouble(ptr){HEAP8[tempDoublePtr]=HEAP8[ptr];HEAP8[tempDoublePtr+1]=HEAP8[ptr+1];HEAP8[tempDoublePtr+2]=HEAP8[ptr+2];HEAP8[tempDoublePtr+3]=HEAP8[ptr+3];HEAP8[tempDoublePtr+4]=HEAP8[ptr+4];HEAP8[tempDoublePtr+5]=HEAP8[ptr+5];HEAP8[tempDoublePtr+6]=HEAP8[ptr+6];HEAP8[tempDoublePtr+7]=HEAP8[ptr+7]}function _emscripten_set_main_loop_timing(mode,value){Browser.mainLoop.timingMode=mode;Browser.mainLoop.timingValue=value;if(!Browser.mainLoop.func){return 1}if(mode==0){Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_setTimeout(){var timeUntilNextTick=Math.max(0,Browser.mainLoop.tickStartTime+value-_emscripten_get_now())|0;setTimeout(Browser.mainLoop.runner,timeUntilNextTick)};Browser.mainLoop.method="timeout"}else if(mode==1){Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_rAF(){Browser.requestAnimationFrame(Browser.mainLoop.runner)};Browser.mainLoop.method="rAF"}else if(mode==2){if(typeof setImmediate==="undefined"){var setImmediates=[];var emscriptenMainLoopMessageId="setimmediate";function Browser_setImmediate_messageHandler(event){if(event.data===emscriptenMainLoopMessageId||event.data.target===emscriptenMainLoopMessageId){event.stopPropagation();setImmediates.shift()()}}addEventListener("message",Browser_setImmediate_messageHandler,true);setImmediate=function Browser_emulated_setImmediate(func){setImmediates.push(func);if(ENVIRONMENT_IS_WORKER){if(Module["setImmediates"]===undefined)Module["setImmediates"]=[];Module["setImmediates"].push(func);postMessage({target:emscriptenMainLoopMessageId})}else postMessage(emscriptenMainLoopMessageId,"*")}}Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_setImmediate(){setImmediate(Browser.mainLoop.runner)};Browser.mainLoop.method="immediate"}return 0}function _emscripten_get_now(){abort()}function _emscripten_set_main_loop(func,fps,simulateInfiniteLoop,arg,noSetTiming){Module["noExitRuntime"]=true;assert(!Browser.mainLoop.func,"emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");Browser.mainLoop.func=func;Browser.mainLoop.arg=arg;var browserIterationFunc;if(typeof arg!=="undefined"){browserIterationFunc=(function(){Module["dynCall_vi"](func,arg)})}else{browserIterationFunc=(function(){Module["dynCall_v"](func)})}var thisMainLoopId=Browser.mainLoop.currentlyRunningMainloop;Browser.mainLoop.runner=function Browser_mainLoop_runner(){if(ABORT)return;if(Browser.mainLoop.queue.length>0){var start=Date.now();var blocker=Browser.mainLoop.queue.shift();blocker.func(blocker.arg);if(Browser.mainLoop.remainingBlockers){var remaining=Browser.mainLoop.remainingBlockers;var next=remaining%1==0?remaining-1:Math.floor(remaining);if(blocker.counted){Browser.mainLoop.remainingBlockers=next}else{next=next+.5;Browser.mainLoop.remainingBlockers=(8*remaining+next)/9}}console.log('main loop blocker "'+blocker.name+'" took '+(Date.now()-start)+" ms");Browser.mainLoop.updateStatus();if(thisMainLoopId<Browser.mainLoop.currentlyRunningMainloop)return;setTimeout(Browser.mainLoop.runner,0);return}if(thisMainLoopId<Browser.mainLoop.currentlyRunningMainloop)return;Browser.mainLoop.currentFrameNumber=Browser.mainLoop.currentFrameNumber+1|0;if(Browser.mainLoop.timingMode==1&&Browser.mainLoop.timingValue>1&&Browser.mainLoop.currentFrameNumber%Browser.mainLoop.timingValue!=0){Browser.mainLoop.scheduler();return}else if(Browser.mainLoop.timingMode==0){Browser.mainLoop.tickStartTime=_emscripten_get_now()}if(Browser.mainLoop.method==="timeout"&&Module.ctx){err("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!");Browser.mainLoop.method=""}Browser.mainLoop.runIter(browserIterationFunc);if(thisMainLoopId<Browser.mainLoop.currentlyRunningMainloop)return;if(typeof SDL==="object"&&SDL.audio&&SDL.audio.queueNewAudioData)SDL.audio.queueNewAudioData();Browser.mainLoop.scheduler()};if(!noSetTiming){if(fps&&fps>0)_emscripten_set_main_loop_timing(0,1e3/fps);else _emscripten_set_main_loop_timing(1,1);Browser.mainLoop.scheduler()}if(simulateInfiniteLoop){throw"SimulateInfiniteLoop"}}var Browser={mainLoop:{scheduler:null,method:"",currentlyRunningMainloop:0,func:null,arg:0,timingMode:0,timingValue:0,currentFrameNumber:0,queue:[],pause:(function(){Browser.mainLoop.scheduler=null;Browser.mainLoop.currentlyRunningMainloop++}),resume:(function(){Browser.mainLoop.currentlyRunningMainloop++;var timingMode=Browser.mainLoop.timingMode;var timingValue=Browser.mainLoop.timingValue;var func=Browser.mainLoop.func;Browser.mainLoop.func=null;_emscripten_set_main_loop(func,0,false,Browser.mainLoop.arg,true);_emscripten_set_main_loop_timing(timingMode,timingValue);Browser.mainLoop.scheduler()}),updateStatus:(function(){if(Module["setStatus"]){var message=Module["statusMessage"]||"Please wait...";var remaining=Browser.mainLoop.remainingBlockers;var expected=Browser.mainLoop.expectedBlockers;if(remaining){if(remaining<expected){Module["setStatus"](message+" ("+(expected-remaining)+"/"+expected+")")}else{Module["setStatus"](message)}}else{Module["setStatus"]("")}}}),runIter:(function(func){if(ABORT)return;if(Module["preMainLoop"]){var preRet=Module["preMainLoop"]();if(preRet===false){return}}try{func()}catch(e){if(e instanceof ExitStatus){return}else{if(e&&typeof e==="object"&&e.stack)err("exception thrown: "+[e,e.stack]);throw e}}if(Module["postMainLoop"])Module["postMainLoop"]()})},isFullscreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:(function(){if(!Module["preloadPlugins"])Module["preloadPlugins"]=[];if(Browser.initted)return;Browser.initted=true;try{new Blob;Browser.hasBlobConstructor=true}catch(e){Browser.hasBlobConstructor=false;console.log("warning: no blob constructor, cannot create blobs with mimetypes")}Browser.BlobBuilder=typeof MozBlobBuilder!="undefined"?MozBlobBuilder:typeof WebKitBlobBuilder!="undefined"?WebKitBlobBuilder:!Browser.hasBlobConstructor?console.log("warning: no BlobBuilder"):null;Browser.URLObject=typeof window!="undefined"?window.URL?window.URL:window.webkitURL:undefined;if(!Module.noImageDecoding&&typeof Browser.URLObject==="undefined"){console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");Module.noImageDecoding=true}var imagePlugin={};imagePlugin["canHandle"]=function imagePlugin_canHandle(name){return!Module.noImageDecoding&&/\.(jpg|jpeg|png|bmp)$/i.test(name)};imagePlugin["handle"]=function imagePlugin_handle(byteArray,name,onload,onerror){var b=null;if(Browser.hasBlobConstructor){try{b=new Blob([byteArray],{type:Browser.getMimetype(name)});if(b.size!==byteArray.length){b=new Blob([(new Uint8Array(byteArray)).buffer],{type:Browser.getMimetype(name)})}}catch(e){warnOnce("Blob constructor present but fails: "+e+"; falling back to blob builder")}}if(!b){var bb=new Browser.BlobBuilder;bb.append((new Uint8Array(byteArray)).buffer);b=bb.getBlob()}var url=Browser.URLObject.createObjectURL(b);var img=new Image;img.onload=function img_onload(){assert(img.complete,"Image "+name+" could not be decoded");var canvas=document.createElement("canvas");canvas.width=img.width;canvas.height=img.height;var ctx=canvas.getContext("2d");ctx.drawImage(img,0,0);Module["preloadedImages"][name]=canvas;Browser.URLObject.revokeObjectURL(url);if(onload)onload(byteArray)};img.onerror=function img_onerror(event){console.log("Image "+url+" could not be decoded");if(onerror)onerror()};img.src=url};Module["preloadPlugins"].push(imagePlugin);var audioPlugin={};audioPlugin["canHandle"]=function audioPlugin_canHandle(name){return!Module.noAudioDecoding&&name.substr(-4)in{".ogg":1,".wav":1,".mp3":1}};audioPlugin["handle"]=function audioPlugin_handle(byteArray,name,onload,onerror){var done=false;function finish(audio){if(done)return;done=true;Module["preloadedAudios"][name]=audio;if(onload)onload(byteArray)}function fail(){if(done)return;done=true;Module["preloadedAudios"][name]=new Audio;if(onerror)onerror()}if(Browser.hasBlobConstructor){try{var b=new Blob([byteArray],{type:Browser.getMimetype(name)})}catch(e){return fail()}var url=Browser.URLObject.createObjectURL(b);var audio=new Audio;audio.addEventListener("canplaythrough",(function(){finish(audio)}),false);audio.onerror=function audio_onerror(event){if(done)return;console.log("warning: browser could not fully decode audio "+name+", trying slower base64 approach");function encode64(data){var BASE="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var PAD="=";var ret="";var leftchar=0;var leftbits=0;for(var i=0;i<data.length;i++){leftchar=leftchar<<8|data[i];leftbits+=8;while(leftbits>=6){var curr=leftchar>>leftbits-6&63;leftbits-=6;ret+=BASE[curr]}}if(leftbits==2){ret+=BASE[(leftchar&3)<<4];ret+=PAD+PAD}else if(leftbits==4){ret+=BASE[(leftchar&15)<<2];ret+=PAD}return ret}audio.src="data:audio/x-"+name.substr(-3)+";base64,"+encode64(byteArray);finish(audio)};audio.src=url;Browser.safeSetTimeout((function(){finish(audio)}),1e4)}else{return fail()}};Module["preloadPlugins"].push(audioPlugin);function pointerLockChange(){Browser.pointerLock=document["pointerLockElement"]===Module["canvas"]||document["mozPointerLockElement"]===Module["canvas"]||document["webkitPointerLockElement"]===Module["canvas"]||document["msPointerLockElement"]===Module["canvas"]}var canvas=Module["canvas"];if(canvas){canvas.requestPointerLock=canvas["requestPointerLock"]||canvas["mozRequestPointerLock"]||canvas["webkitRequestPointerLock"]||canvas["msRequestPointerLock"]||(function(){});canvas.exitPointerLock=document["exitPointerLock"]||document["mozExitPointerLock"]||document["webkitExitPointerLock"]||document["msExitPointerLock"]||(function(){});canvas.exitPointerLock=canvas.exitPointerLock.bind(document);document.addEventListener("pointerlockchange",pointerLockChange,false);document.addEventListener("mozpointerlockchange",pointerLockChange,false);document.addEventListener("webkitpointerlockchange",pointerLockChange,false);document.addEventListener("mspointerlockchange",pointerLockChange,false);if(Module["elementPointerLock"]){canvas.addEventListener("click",(function(ev){if(!Browser.pointerLock&&Module["canvas"].requestPointerLock){Module["canvas"].requestPointerLock();ev.preventDefault()}}),false)}}}),createContext:(function(canvas,useWebGL,setInModule,webGLContextAttributes){if(useWebGL&&Module.ctx&&canvas==Module.canvas)return Module.ctx;var ctx;var contextHandle;if(useWebGL){var contextAttributes={antialias:false,alpha:false};if(webGLContextAttributes){for(var attribute in webGLContextAttributes){contextAttributes[attribute]=webGLContextAttributes[attribute]}}contextHandle=GL.createContext(canvas,contextAttributes);if(contextHandle){ctx=GL.getContext(contextHandle).GLctx}}else{ctx=canvas.getContext("2d")}if(!ctx)return null;if(setInModule){if(!useWebGL)assert(typeof GLctx==="undefined","cannot set in module if GLctx is used, but we are a non-GL context that would replace it");Module.ctx=ctx;if(useWebGL)GL.makeContextCurrent(contextHandle);Module.useWebGL=useWebGL;Browser.moduleContextCreatedCallbacks.forEach((function(callback){callback()}));Browser.init()}return ctx}),destroyContext:(function(canvas,useWebGL,setInModule){}),fullscreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullscreen:(function(lockPointer,resizeCanvas,vrDevice){Browser.lockPointer=lockPointer;Browser.resizeCanvas=resizeCanvas;Browser.vrDevice=vrDevice;if(typeof Browser.lockPointer==="undefined")Browser.lockPointer=true;if(typeof Browser.resizeCanvas==="undefined")Browser.resizeCanvas=false;if(typeof Browser.vrDevice==="undefined")Browser.vrDevice=null;var canvas=Module["canvas"];function fullscreenChange(){Browser.isFullscreen=false;var canvasContainer=canvas.parentNode;if((document["fullscreenElement"]||document["mozFullScreenElement"]||document["msFullscreenElement"]||document["webkitFullscreenElement"]||document["webkitCurrentFullScreenElement"])===canvasContainer){canvas.exitFullscreen=document["exitFullscreen"]||document["cancelFullScreen"]||document["mozCancelFullScreen"]||document["msExitFullscreen"]||document["webkitCancelFullScreen"]||(function(){});canvas.exitFullscreen=canvas.exitFullscreen.bind(document);if(Browser.lockPointer)canvas.requestPointerLock();Browser.isFullscreen=true;if(Browser.resizeCanvas){Browser.setFullscreenCanvasSize()}else{Browser.updateCanvasDimensions(canvas)}}else{canvasContainer.parentNode.insertBefore(canvas,canvasContainer);canvasContainer.parentNode.removeChild(canvasContainer);if(Browser.resizeCanvas){Browser.setWindowedCanvasSize()}else{Browser.updateCanvasDimensions(canvas)}}if(Module["onFullScreen"])Module["onFullScreen"](Browser.isFullscreen);if(Module["onFullscreen"])Module["onFullscreen"](Browser.isFullscreen)}if(!Browser.fullscreenHandlersInstalled){Browser.fullscreenHandlersInstalled=true;document.addEventListener("fullscreenchange",fullscreenChange,false);document.addEventListener("mozfullscreenchange",fullscreenChange,false);document.addEventListener("webkitfullscreenchange",fullscreenChange,false);document.addEventListener("MSFullscreenChange",fullscreenChange,false)}var canvasContainer=document.createElement("div");canvas.parentNode.insertBefore(canvasContainer,canvas);canvasContainer.appendChild(canvas);canvasContainer.requestFullscreen=canvasContainer["requestFullscreen"]||canvasContainer["mozRequestFullScreen"]||canvasContainer["msRequestFullscreen"]||(canvasContainer["webkitRequestFullscreen"]?(function(){canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"])}):null)||(canvasContainer["webkitRequestFullScreen"]?(function(){canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"])}):null);if(vrDevice){canvasContainer.requestFullscreen({vrDisplay:vrDevice})}else{canvasContainer.requestFullscreen()}}),requestFullScreen:(function(lockPointer,resizeCanvas,vrDevice){err("Browser.requestFullScreen() is deprecated. Please call Browser.requestFullscreen instead.");Browser.requestFullScreen=(function(lockPointer,resizeCanvas,vrDevice){return Browser.requestFullscreen(lockPointer,resizeCanvas,vrDevice)});return Browser.requestFullscreen(lockPointer,resizeCanvas,vrDevice)}),nextRAF:0,fakeRequestAnimationFrame:(function(func){var now=Date.now();if(Browser.nextRAF===0){Browser.nextRAF=now+1e3/60}else{while(now+2>=Browser.nextRAF){Browser.nextRAF+=1e3/60}}var delay=Math.max(Browser.nextRAF-now,0);setTimeout(func,delay)}),requestAnimationFrame:function requestAnimationFrame(func){if(typeof window==="undefined"){Browser.fakeRequestAnimationFrame(func)}else{if(!window.requestAnimationFrame){window.requestAnimationFrame=window["requestAnimationFrame"]||window["mozRequestAnimationFrame"]||window["webkitRequestAnimationFrame"]||window["msRequestAnimationFrame"]||window["oRequestAnimationFrame"]||Browser.fakeRequestAnimationFrame}window.requestAnimationFrame(func)}},safeCallback:(function(func){return(function(){if(!ABORT)return func.apply(null,arguments)})}),allowAsyncCallbacks:true,queuedAsyncCallbacks:[],pauseAsyncCallbacks:(function(){Browser.allowAsyncCallbacks=false}),resumeAsyncCallbacks:(function(){Browser.allowAsyncCallbacks=true;if(Browser.queuedAsyncCallbacks.length>0){var callbacks=Browser.queuedAsyncCallbacks;Browser.queuedAsyncCallbacks=[];callbacks.forEach((function(func){func()}))}}),safeRequestAnimationFrame:(function(func){return Browser.requestAnimationFrame((function(){if(ABORT)return;if(Browser.allowAsyncCallbacks){func()}else{Browser.queuedAsyncCallbacks.push(func)}}))}),safeSetTimeout:(function(func,timeout){Module["noExitRuntime"]=true;return setTimeout((function(){if(ABORT)return;if(Browser.allowAsyncCallbacks){func()}else{Browser.queuedAsyncCallbacks.push(func)}}),timeout)}),safeSetInterval:(function(func,timeout){Module["noExitRuntime"]=true;return setInterval((function(){if(ABORT)return;if(Browser.allowAsyncCallbacks){func()}}),timeout)}),getMimetype:(function(name){return{"jpg":"image/jpeg","jpeg":"image/jpeg","png":"image/png","bmp":"image/bmp","ogg":"audio/ogg","wav":"audio/wav","mp3":"audio/mpeg"}[name.substr(name.lastIndexOf(".")+1)]}),getUserMedia:(function(func){if(!window.getUserMedia){window.getUserMedia=navigator["getUserMedia"]||navigator["mozGetUserMedia"]}window.getUserMedia(func)}),getMovementX:(function(event){return event["movementX"]||event["mozMovementX"]||event["webkitMovementX"]||0}),getMovementY:(function(event){return event["movementY"]||event["mozMovementY"]||event["webkitMovementY"]||0}),getMouseWheelDelta:(function(event){var delta=0;switch(event.type){case"DOMMouseScroll":delta=event.detail;break;case"mousewheel":delta=event.wheelDelta;break;case"wheel":delta=event["deltaY"];break;default:throw"unrecognized mouse wheel event: "+event.type}return delta}),mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:{},lastTouches:{},calculateMouseEvent:(function(event){if(Browser.pointerLock){if(event.type!="mousemove"&&"mozMovementX"in event){Browser.mouseMovementX=Browser.mouseMovementY=0}else{Browser.mouseMovementX=Browser.getMovementX(event);Browser.mouseMovementY=Browser.getMovementY(event)}if(typeof SDL!="undefined"){Browser.mouseX=SDL.mouseX+Browser.mouseMovementX;Browser.mouseY=SDL.mouseY+Browser.mouseMovementY}else{Browser.mouseX+=Browser.mouseMovementX;Browser.mouseY+=Browser.mouseMovementY}}else{var rect=Module["canvas"].getBoundingClientRect();var cw=Module["canvas"].width;var ch=Module["canvas"].height;var scrollX=typeof window.scrollX!=="undefined"?window.scrollX:window.pageXOffset;var scrollY=typeof window.scrollY!=="undefined"?window.scrollY:window.pageYOffset;if(event.type==="touchstart"||event.type==="touchend"||event.type==="touchmove"){var touch=event.touch;if(touch===undefined){return}var adjustedX=touch.pageX-(scrollX+rect.left);var adjustedY=touch.pageY-(scrollY+rect.top);adjustedX=adjustedX*(cw/rect.width);adjustedY=adjustedY*(ch/rect.height);var coords={x:adjustedX,y:adjustedY};if(event.type==="touchstart"){Browser.lastTouches[touch.identifier]=coords;Browser.touches[touch.identifier]=coords}else if(event.type==="touchend"||event.type==="touchmove"){var last=Browser.touches[touch.identifier];if(!last)last=coords;Browser.lastTouches[touch.identifier]=last;Browser.touches[touch.identifier]=coords}return}var x=event.pageX-(scrollX+rect.left);var y=event.pageY-(scrollY+rect.top);x=x*(cw/rect.width);y=y*(ch/rect.height);Browser.mouseMovementX=x-Browser.mouseX;Browser.mouseMovementY=y-Browser.mouseY;Browser.mouseX=x;Browser.mouseY=y}}),asyncLoad:(function(url,onload,onerror,noRunDep){var dep=!noRunDep?getUniqueRunDependency("al "+url):"";Module["readAsync"](url,(function(arrayBuffer){assert(arrayBuffer,'Loading data file "'+url+'" failed (no arrayBuffer).');onload(new Uint8Array(arrayBuffer));if(dep)removeRunDependency(dep)}),(function(event){if(onerror){onerror()}else{throw'Loading data file "'+url+'" failed.'}}));if(dep)addRunDependency(dep)}),resizeListeners:[],updateResizeListeners:(function(){var canvas=Module["canvas"];Browser.resizeListeners.forEach((function(listener){listener(canvas.width,canvas.height)}))}),setCanvasSize:(function(width,height,noUpdates){var canvas=Module["canvas"];Browser.updateCanvasDimensions(canvas,width,height);if(!noUpdates)Browser.updateResizeListeners()}),windowedWidth:0,windowedHeight:0,setFullscreenCanvasSize:(function(){if(typeof SDL!="undefined"){var flags=HEAPU32[SDL.screen>>2];flags=flags|8388608;HEAP32[SDL.screen>>2]=flags}Browser.updateCanvasDimensions(Module["canvas"]);Browser.updateResizeListeners()}),setWindowedCanvasSize:(function(){if(typeof SDL!="undefined"){var flags=HEAPU32[SDL.screen>>2];flags=flags&~8388608;HEAP32[SDL.screen>>2]=flags}Browser.updateCanvasDimensions(Module["canvas"]);Browser.updateResizeListeners()}),updateCanvasDimensions:(function(canvas,wNative,hNative){if(wNative&&hNative){canvas.widthNative=wNative;canvas.heightNative=hNative}else{wNative=canvas.widthNative;hNative=canvas.heightNative}var w=wNative;var h=hNative;if(Module["forcedAspectRatio"]&&Module["forcedAspectRatio"]>0){if(w/h<Module["forcedAspectRatio"]){w=Math.round(h*Module["forcedAspectRatio"])}else{h=Math.round(w/Module["forcedAspectRatio"])}}if((document["fullscreenElement"]||document["mozFullScreenElement"]||document["msFullscreenElement"]||document["webkitFullscreenElement"]||document["webkitCurrentFullScreenElement"])===canvas.parentNode&&typeof screen!="undefined"){var factor=Math.min(screen.width/w,screen.height/h);w=Math.round(w*factor);h=Math.round(h*factor)}if(Browser.resizeCanvas){if(canvas.width!=w)canvas.width=w;if(canvas.height!=h)canvas.height=h;if(typeof canvas.style!="undefined"){canvas.style.removeProperty("width");canvas.style.removeProperty("height")}}else{if(canvas.width!=wNative)canvas.width=wNative;if(canvas.height!=hNative)canvas.height=hNative;if(typeof canvas.style!="undefined"){if(w!=wNative||h!=hNative){canvas.style.setProperty("width",w+"px","important");canvas.style.setProperty("height",h+"px","important")}else{canvas.style.removeProperty("width");canvas.style.removeProperty("height")}}}}),wgetRequests:{},nextWgetRequestHandle:0,getNextWgetRequestHandle:(function(){var handle=Browser.nextWgetRequestHandle;Browser.nextWgetRequestHandle++;return handle})};function __ZN3dvl11Abstraction12DynamicLabel8SetImageEPKvj(){err("missing function: _ZN3dvl11Abstraction12DynamicLabel8SetImageEPKvj");abort(-1)}function __ZN3sap2ve4core18EntityElementCache19ElementIsSuppressedEPKcS4_S4_(){err("missing function: _ZN3sap2ve4core18EntityElementCache19ElementIsSuppressedEPKcS4_S4_");abort(-1)}function __ZN3sap2ve4core18EntityElementCacheC1EPNS1_5ModelE(){err("missing function: _ZN3sap2ve4core18EntityElementCacheC1EPNS1_5ModelE");abort(-1)}function __ZN3sap2ve4core18EntityElementCacheD1Ev(){err("missing function: _ZN3sap2ve4core18EntityElementCacheD1Ev");abort(-1)}function __ZN3sap2ve4core21GraphSelectorResolver12WalkSelectorEPNS1_6EntityEPKNS1_8SelectorE(){err("missing function: _ZN3sap2ve4core21GraphSelectorResolver12WalkSelectorEPNS1_6EntityEPKNS1_8SelectorE");abort(-1)}function __ZN3sap2ve4core21GraphSelectorResolver26SelectorTargetIsSuppressedEPNS1_6EntityEPKNS1_8SelectorE(){err("missing function: _ZN3sap2ve4core21GraphSelectorResolver26SelectorTargetIsSuppressedEPNS1_6EntityEPKNS1_8SelectorE");abort(-1)}function __ZN3sap2ve4core21GraphSelectorResolverC1Ev(){err("missing function: _ZN3sap2ve4core21GraphSelectorResolverC1Ev");abort(-1)}function __ZN3sap2ve4core21GraphSelectorResolverD1Ev(){err("missing function: _ZN3sap2ve4core21GraphSelectorResolverD1Ev");abort(-1)}function __ZN3sap2ve4core27cVDSDataTypeReader_Geometry15DetermineQuantsERjS3_S3_(){err("missing function: _ZN3sap2ve4core27cVDSDataTypeReader_Geometry15DetermineQuantsERjS3_S3_");abort(-1)}function __ZN3sap2ve4core27cVDSDataTypeReader_Geometry6DecodeEv(){err("missing function: _ZN3sap2ve4core27cVDSDataTypeReader_Geometry6DecodeEv");abort(-1)}function ___block_all_sigs(){err("missing function: __block_all_sigs");abort(-1)}var ENV={};function ___buildEnvironment(environ){var MAX_ENV_VALUES=64;var TOTAL_ENV_SIZE=1024;var poolPtr;var envPtr;if(!___buildEnvironment.called){___buildEnvironment.called=true;ENV["USER"]=ENV["LOGNAME"]="web_user";ENV["PATH"]="/";ENV["PWD"]="/";ENV["HOME"]="/home/web_user";ENV["LANG"]="C.UTF-8";ENV["_"]=Module["thisProgram"];poolPtr=getMemory(TOTAL_ENV_SIZE);envPtr=getMemory(MAX_ENV_VALUES*4);HEAP32[envPtr>>2]=poolPtr;HEAP32[environ>>2]=envPtr}else{envPtr=HEAP32[environ>>2];poolPtr=HEAP32[envPtr>>2]}var strings=[];var totalSize=0;for(var key in ENV){if(typeof ENV[key]==="string"){var line=key+"="+ENV[key];strings.push(line);totalSize+=line.length}}if(totalSize>TOTAL_ENV_SIZE){throw new Error("Environment size exceeded TOTAL_ENV_SIZE!")}var ptrSize=4;for(var i=0;i<strings.length;i++){var line=strings[i];writeAsciiToMemory(line,poolPtr);HEAP32[envPtr+i*ptrSize>>2]=poolPtr;poolPtr+=line.length+1}HEAP32[envPtr+strings.length*ptrSize>>2]=0}function _emscripten_get_now_is_monotonic(){return ENVIRONMENT_IS_NODE||typeof dateNow!=="undefined"||(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&self["performance"]&&self["performance"]["now"]}var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};function ___setErrNo(value){if(Module["___errno_location"])HEAP32[Module["___errno_location"]()>>2]=value;return value}function _clock_gettime(clk_id,tp){var now;if(clk_id===0){now=Date.now()}else if(clk_id===1&&_emscripten_get_now_is_monotonic()){now=_emscripten_get_now()}else{___setErrNo(ERRNO_CODES.EINVAL);return-1}HEAP32[tp>>2]=now/1e3|0;HEAP32[tp+4>>2]=now%1e3*1e3*1e3|0;return 0}function ___clock_gettime(){return _clock_gettime.apply(null,arguments)}function ___clone(){err("missing function: __clone");abort(-1)}function ___cxa_allocate_exception(size){return _malloc(size)}var EXCEPTIONS={last:0,caught:[],infos:{},deAdjust:(function(adjusted){if(!adjusted||EXCEPTIONS.infos[adjusted])return adjusted;for(var key in EXCEPTIONS.infos){var ptr=+key;var info=EXCEPTIONS.infos[ptr];if(info.adjusted===adjusted){return ptr}}return adjusted}),addRef:(function(ptr){if(!ptr)return;var info=EXCEPTIONS.infos[ptr];info.refcount++}),decRef:(function(ptr){if(!ptr)return;var info=EXCEPTIONS.infos[ptr];assert(info.refcount>0);info.refcount--;if(info.refcount===0&&!info.rethrown){if(info.destructor){Module["dynCall_vi"](info.destructor,ptr)}delete EXCEPTIONS.infos[ptr];___cxa_free_exception(ptr)}}),clearRef:(function(ptr){if(!ptr)return;var info=EXCEPTIONS.infos[ptr];info.refcount=0})};function ___cxa_begin_catch(ptr){var info=EXCEPTIONS.infos[ptr];if(info&&!info.caught){info.caught=true;__ZSt18uncaught_exceptionv.uncaught_exception--}if(info)info.rethrown=false;EXCEPTIONS.caught.push(ptr);EXCEPTIONS.addRef(EXCEPTIONS.deAdjust(ptr));return ptr}function ___cxa_current_primary_exception(){var ret=EXCEPTIONS.caught[EXCEPTIONS.caught.length-1]||0;if(ret)EXCEPTIONS.addRef(EXCEPTIONS.deAdjust(ret));return ret}function ___cxa_decrement_exception_refcount(ptr){EXCEPTIONS.decRef(EXCEPTIONS.deAdjust(ptr))}function ___cxa_increment_exception_refcount(ptr){EXCEPTIONS.addRef(EXCEPTIONS.deAdjust(ptr))}function ___cxa_pure_virtual(){ABORT=true;throw"Pure virtual function called!"}function ___cxa_free_exception(ptr){try{return _free(ptr)}catch(e){}}function ___cxa_end_catch(){Module["setThrew"](0);var ptr=EXCEPTIONS.caught.pop();if(ptr){EXCEPTIONS.decRef(EXCEPTIONS.deAdjust(ptr));EXCEPTIONS.last=0}}function ___cxa_rethrow(){var ptr=EXCEPTIONS.caught.pop();ptr=EXCEPTIONS.deAdjust(ptr);if(!EXCEPTIONS.infos[ptr].rethrown){EXCEPTIONS.caught.push(ptr);EXCEPTIONS.infos[ptr].rethrown=true}EXCEPTIONS.last=ptr;throw ptr+" - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."}function ___cxa_rethrow_primary_exception(ptr){if(!ptr)return;EXCEPTIONS.caught.push(ptr);EXCEPTIONS.infos[ptr].rethrown=true;___cxa_rethrow()}function ___resumeException(ptr){if(!EXCEPTIONS.last){EXCEPTIONS.last=ptr}throw ptr+" - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."}function ___cxa_find_matching_catch(){var thrown=EXCEPTIONS.last;if(!thrown){return(setTempRet0(0),0)|0}var info=EXCEPTIONS.infos[thrown];var throwntype=info.type;if(!throwntype){return(setTempRet0(0),thrown)|0}var typeArray=Array.prototype.slice.call(arguments);var pointer=Module["___cxa_is_pointer_type"](throwntype);if(!___cxa_find_matching_catch.buffer)___cxa_find_matching_catch.buffer=_malloc(4);HEAP32[___cxa_find_matching_catch.buffer>>2]=thrown;thrown=___cxa_find_matching_catch.buffer;for(var i=0;i<typeArray.length;i++){if(typeArray[i]&&Module["___cxa_can_catch"](typeArray[i],throwntype,thrown)){thrown=HEAP32[thrown>>2];info.adjusted=thrown;return(setTempRet0(typeArray[i]),thrown)|0}}thrown=HEAP32[thrown>>2];return(setTempRet0(throwntype),thrown)|0}function ___cxa_throw(ptr,type,destructor){EXCEPTIONS.infos[ptr]={ptr:ptr,adjusted:ptr,type:type,destructor:destructor,refcount:0,caught:false,rethrown:false};EXCEPTIONS.last=ptr;if(!("uncaught_exception"in __ZSt18uncaught_exceptionv)){__ZSt18uncaught_exceptionv.uncaught_exception=1}else{__ZSt18uncaught_exceptionv.uncaught_exception++}throw ptr+" - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."}function ___cxa_uncaught_exception(){return!!__ZSt18uncaught_exceptionv.uncaught_exception}function ___gxx_personality_v0(){}function ___lock(){}function ___map_file(pathname,size){___setErrNo(ERRNO_CODES.EPERM);return-1}function ___muldc3(){err("missing function: __muldc3");abort(-1)}function ___mulsc3(){err("missing function: __mulsc3");abort(-1)}function ___restore_sigs(){err("missing function: __restore_sigs");abort(-1)}var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};var PATH={splitPath:(function(filename){var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return splitPathRe.exec(filename).slice(1)}),normalizeArray:(function(parts,allowAboveRoot){var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==="."){parts.splice(i,1)}else if(last===".."){parts.splice(i,1);up++}else if(up){parts.splice(i,1);up--}}if(allowAboveRoot){for(;up;up--){parts.unshift("..")}}return parts}),normalize:(function(path){var isAbsolute=path.charAt(0)==="/",trailingSlash=path.substr(-1)==="/";path=PATH.normalizeArray(path.split("/").filter((function(p){return!!p})),!isAbsolute).join("/");if(!path&&!isAbsolute){path="."}if(path&&trailingSlash){path+="/"}return(isAbsolute?"/":"")+path}),dirname:(function(path){var result=PATH.splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){return"."}if(dir){dir=dir.substr(0,dir.length-1)}return root+dir}),basename:(function(path){if(path==="/")return"/";var lastSlash=path.lastIndexOf("/");if(lastSlash===-1)return path;return path.substr(lastSlash+1)}),extname:(function(path){return PATH.splitPath(path)[3]}),join:(function(){var paths=Array.prototype.slice.call(arguments,0);return PATH.normalize(paths.join("/"))}),join2:(function(l,r){return PATH.normalize(l+"/"+r)}),resolve:(function(){var resolvedPath="",resolvedAbsolute=false;for(var i=arguments.length-1;i>=-1&&!resolvedAbsolute;i--){var path=i>=0?arguments[i]:FS.cwd();if(typeof path!=="string"){throw new TypeError("Arguments to path.resolve must be strings")}else if(!path){return""}resolvedPath=path+"/"+resolvedPath;resolvedAbsolute=path.charAt(0)==="/"}resolvedPath=PATH.normalizeArray(resolvedPath.split("/").filter((function(p){return!!p})),!resolvedAbsolute).join("/");return(resolvedAbsolute?"/":"")+resolvedPath||"."}),relative:(function(from,to){from=PATH.resolve(from).substr(1);to=PATH.resolve(to).substr(1);function trim(arr){var start=0;for(;start<arr.length;start++){if(arr[start]!=="")break}var end=arr.length-1;for(;end>=0;end--){if(arr[end]!=="")break}if(start>end)return[];return arr.slice(start,end-start+1)}var fromParts=trim(from.split("/"));var toParts=trim(to.split("/"));var length=Math.min(fromParts.length,toParts.length);var samePartsLength=length;for(var i=0;i<length;i++){if(fromParts[i]!==toParts[i]){samePartsLength=i;break}}var outputParts=[];for(var i=samePartsLength;i<fromParts.length;i++){outputParts.push("..")}outputParts=outputParts.concat(toParts.slice(samePartsLength));return outputParts.join("/")})};var TTY={ttys:[],init:(function(){}),shutdown:(function(){}),register:(function(dev,ops){TTY.ttys[dev]={input:[],output:[],ops:ops};FS.registerDevice(dev,TTY.stream_ops)}),stream_ops:{open:(function(stream){var tty=TTY.ttys[stream.node.rdev];if(!tty){throw new FS.ErrnoError(ERRNO_CODES.ENODEV)}stream.tty=tty;stream.seekable=false}),close:(function(stream){stream.tty.ops.flush(stream.tty)}),flush:(function(stream){stream.tty.ops.flush(stream.tty)}),read:(function(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.get_char){throw new FS.ErrnoError(ERRNO_CODES.ENXIO)}var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=stream.tty.ops.get_char(stream.tty)}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EIO)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.timestamp=Date.now()}return bytesRead}),write:(function(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.put_char){throw new FS.ErrnoError(ERRNO_CODES.ENXIO)}for(var i=0;i<length;i++){try{stream.tty.ops.put_char(stream.tty,buffer[offset+i])}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EIO)}}if(length){stream.node.timestamp=Date.now()}return i})},default_tty_ops:{get_char:(function(tty){if(!tty.input.length){var result=null;if(ENVIRONMENT_IS_NODE){var BUFSIZE=256;var buf=new Buffer(BUFSIZE);var bytesRead=0;var isPosixPlatform=process.platform!="win32";var fd=process.stdin.fd;if(isPosixPlatform){var usingDevice=false;try{fd=fs.openSync("/dev/stdin","r");usingDevice=true}catch(e){}}try{bytesRead=fs.readSync(fd,buf,0,BUFSIZE,null)}catch(e){if(e.toString().indexOf("EOF")!=-1)bytesRead=0;else throw e}if(usingDevice){fs.closeSync(fd)}if(bytesRead>0){result=buf.slice(0,bytesRead).toString("utf-8")}else{result=null}}else if(typeof window!="undefined"&&typeof window.prompt=="function"){result=window.prompt("Input: ");if(result!==null){result+="\n"}}else if(typeof readline=="function"){result=readline();if(result!==null){result+="\n"}}if(!result){return null}tty.input=intArrayFromString(result,true)}return tty.input.shift()}),put_char:(function(tty,val){if(val===null||val===10){out(UTF8ArrayToString(tty.output,0));tty.output=[]}else{if(val!=0)tty.output.push(val)}}),flush:(function(tty){if(tty.output&&tty.output.length>0){out(UTF8ArrayToString(tty.output,0));tty.output=[]}})},default_tty1_ops:{put_char:(function(tty,val){if(val===null||val===10){err(UTF8ArrayToString(tty.output,0));tty.output=[]}else{if(val!=0)tty.output.push(val)}}),flush:(function(tty){if(tty.output&&tty.output.length>0){err(UTF8ArrayToString(tty.output,0));tty.output=[]}})}};var MEMFS={ops_table:null,mount:(function(mount){return MEMFS.createNode(null,"/",16384|511,0)}),createNode:(function(parent,name,mode,dev){if(FS.isBlkdev(mode)||FS.isFIFO(mode)){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}if(!MEMFS.ops_table){MEMFS.ops_table={dir:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,lookup:MEMFS.node_ops.lookup,mknod:MEMFS.node_ops.mknod,rename:MEMFS.node_ops.rename,unlink:MEMFS.node_ops.unlink,rmdir:MEMFS.node_ops.rmdir,readdir:MEMFS.node_ops.readdir,symlink:MEMFS.node_ops.symlink},stream:{llseek:MEMFS.stream_ops.llseek}},file:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:{llseek:MEMFS.stream_ops.llseek,read:MEMFS.stream_ops.read,write:MEMFS.stream_ops.write,allocate:MEMFS.stream_ops.allocate,mmap:MEMFS.stream_ops.mmap,msync:MEMFS.stream_ops.msync}},link:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,readlink:MEMFS.node_ops.readlink},stream:{}},chrdev:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:FS.chrdev_stream_ops}}}var node=FS.createNode(parent,name,mode,dev);if(FS.isDir(node.mode)){node.node_ops=MEMFS.ops_table.dir.node;node.stream_ops=MEMFS.ops_table.dir.stream;node.contents={}}else if(FS.isFile(node.mode)){node.node_ops=MEMFS.ops_table.file.node;node.stream_ops=MEMFS.ops_table.file.stream;node.usedBytes=0;node.contents=null}else if(FS.isLink(node.mode)){node.node_ops=MEMFS.ops_table.link.node;node.stream_ops=MEMFS.ops_table.link.stream}else if(FS.isChrdev(node.mode)){node.node_ops=MEMFS.ops_table.chrdev.node;node.stream_ops=MEMFS.ops_table.chrdev.stream}node.timestamp=Date.now();if(parent){parent.contents[name]=node}return node}),getFileDataAsRegularArray:(function(node){if(node.contents&&node.contents.subarray){var arr=[];for(var i=0;i<node.usedBytes;++i)arr.push(node.contents[i]);return arr}return node.contents}),getFileDataAsTypedArray:(function(node){if(!node.contents)return new Uint8Array;if(node.contents.subarray)return node.contents.subarray(0,node.usedBytes);return new Uint8Array(node.contents)}),expandFileStorage:(function(node,newCapacity){if(node.contents&&node.contents.subarray&&newCapacity>node.contents.length){node.contents=MEMFS.getFileDataAsRegularArray(node);node.usedBytes=node.contents.length}if(!node.contents||node.contents.subarray){var prevCapacity=node.contents?node.contents.length:0;if(prevCapacity>=newCapacity)return;var CAPACITY_DOUBLING_MAX=1024*1024;newCapacity=Math.max(newCapacity,prevCapacity*(prevCapacity<CAPACITY_DOUBLING_MAX?2:1.125)|0);if(prevCapacity!=0)newCapacity=Math.max(newCapacity,256);var oldContents=node.contents;node.contents=new Uint8Array(newCapacity);if(node.usedBytes>0)node.contents.set(oldContents.subarray(0,node.usedBytes),0);return}if(!node.contents&&newCapacity>0)node.contents=[];while(node.contents.length<newCapacity)node.contents.push(0)}),resizeFileStorage:(function(node,newSize){if(node.usedBytes==newSize)return;if(newSize==0){node.contents=null;node.usedBytes=0;return}if(!node.contents||node.contents.subarray){var oldContents=node.contents;node.contents=new Uint8Array(new ArrayBuffer(newSize));if(oldContents){node.contents.set(oldContents.subarray(0,Math.min(newSize,node.usedBytes)))}node.usedBytes=newSize;return}if(!node.contents)node.contents=[];if(node.contents.length>newSize)node.contents.length=newSize;else while(node.contents.length<newSize)node.contents.push(0);node.usedBytes=newSize}),node_ops:{getattr:(function(node){var attr={};attr.dev=FS.isChrdev(node.mode)?node.id:1;attr.ino=node.id;attr.mode=node.mode;attr.nlink=1;attr.uid=0;attr.gid=0;attr.rdev=node.rdev;if(FS.isDir(node.mode)){attr.size=4096}else if(FS.isFile(node.mode)){attr.size=node.usedBytes}else if(FS.isLink(node.mode)){attr.size=node.link.length}else{attr.size=0}attr.atime=new Date(node.timestamp);attr.mtime=new Date(node.timestamp);attr.ctime=new Date(node.timestamp);attr.blksize=4096;attr.blocks=Math.ceil(attr.size/attr.blksize);return attr}),setattr:(function(node,attr){if(attr.mode!==undefined){node.mode=attr.mode}if(attr.timestamp!==undefined){node.timestamp=attr.timestamp}if(attr.size!==undefined){MEMFS.resizeFileStorage(node,attr.size)}}),lookup:(function(parent,name){throw FS.genericErrors[ERRNO_CODES.ENOENT]}),mknod:(function(parent,name,mode,dev){return MEMFS.createNode(parent,name,mode,dev)}),rename:(function(old_node,new_dir,new_name){if(FS.isDir(old_node.mode)){var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(new_node){for(var i in new_node.contents){throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)}}}delete old_node.parent.contents[old_node.name];old_node.name=new_name;new_dir.contents[new_name]=old_node;old_node.parent=new_dir}),unlink:(function(parent,name){delete parent.contents[name]}),rmdir:(function(parent,name){var node=FS.lookupNode(parent,name);for(var i in node.contents){throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)}delete parent.contents[name]}),readdir:(function(node){var entries=[".",".."];for(var key in node.contents){if(!node.contents.hasOwnProperty(key)){continue}entries.push(key)}return entries}),symlink:(function(parent,newname,oldpath){var node=MEMFS.createNode(parent,newname,511|40960,0);node.link=oldpath;return node}),readlink:(function(node){if(!FS.isLink(node.mode)){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}return node.link})},stream_ops:{read:(function(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=stream.node.usedBytes)return 0;var size=Math.min(stream.node.usedBytes-position,length);assert(size>=0);if(size>8&&contents.subarray){buffer.set(contents.subarray(position,position+size),offset)}else{for(var i=0;i<size;i++)buffer[offset+i]=contents[position+i]}return size}),write:(function(stream,buffer,offset,length,position,canOwn){if(!length)return 0;var node=stream.node;node.timestamp=Date.now();if(buffer.subarray&&(!node.contents||node.contents.subarray)){if(canOwn){node.contents=buffer.subarray(offset,offset+length);node.usedBytes=length;return length}else if(node.usedBytes===0&&position===0){node.contents=new Uint8Array(buffer.subarray(offset,offset+length));node.usedBytes=length;return length}else if(position+length<=node.usedBytes){node.contents.set(buffer.subarray(offset,offset+length),position);return length}}MEMFS.expandFileStorage(node,position+length);if(node.contents.subarray&&buffer.subarray)node.contents.set(buffer.subarray(offset,offset+length),position);else{for(var i=0;i<length;i++){node.contents[position+i]=buffer[offset+i]}}node.usedBytes=Math.max(node.usedBytes,position+length);return length}),llseek:(function(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){position+=stream.node.usedBytes}}if(position<0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}return position}),allocate:(function(stream,offset,length){MEMFS.expandFileStorage(stream.node,offset+length);stream.node.usedBytes=Math.max(stream.node.usedBytes,offset+length)}),mmap:(function(stream,buffer,offset,length,position,prot,flags){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(ERRNO_CODES.ENODEV)}var ptr;var allocated;var contents=stream.node.contents;if(!(flags&2)&&(contents.buffer===buffer||contents.buffer===buffer.buffer)){allocated=false;ptr=contents.byteOffset}else{if(position>0||position+length<stream.node.usedBytes){if(contents.subarray){contents=contents.subarray(position,position+length)}else{contents=Array.prototype.slice.call(contents,position,position+length)}}allocated=true;ptr=_malloc(length);if(!ptr){throw new FS.ErrnoError(ERRNO_CODES.ENOMEM)}buffer.set(contents,ptr)}return{ptr:ptr,allocated:allocated}}),msync:(function(stream,buffer,offset,length,mmapFlags){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(ERRNO_CODES.ENODEV)}if(mmapFlags&2){return 0}var bytesWritten=MEMFS.stream_ops.write(stream,buffer,0,length,offset,false);return 0})}};var IDBFS={dbs:{},indexedDB:(function(){if(typeof indexedDB!=="undefined")return indexedDB;var ret=null;if(typeof window==="object")ret=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;assert(ret,"IDBFS used, but indexedDB not supported");return ret}),DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:(function(mount){return MEMFS.mount.apply(null,arguments)}),syncfs:(function(mount,populate,callback){IDBFS.getLocalSet(mount,(function(err,local){if(err)return callback(err);IDBFS.getRemoteSet(mount,(function(err,remote){if(err)return callback(err);var src=populate?remote:local;var dst=populate?local:remote;IDBFS.reconcile(src,dst,callback)}))}))}),getDB:(function(name,callback){var db=IDBFS.dbs[name];if(db){return callback(null,db)}var req;try{req=IDBFS.indexedDB().open(name,IDBFS.DB_VERSION)}catch(e){return callback(e)}if(!req){return callback("Unable to connect to IndexedDB")}req.onupgradeneeded=(function(e){var db=e.target.result;var transaction=e.target.transaction;var fileStore;if(db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)){fileStore=transaction.objectStore(IDBFS.DB_STORE_NAME)}else{fileStore=db.createObjectStore(IDBFS.DB_STORE_NAME)}if(!fileStore.indexNames.contains("timestamp")){fileStore.createIndex("timestamp","timestamp",{unique:false})}});req.onsuccess=(function(){db=req.result;IDBFS.dbs[name]=db;callback(null,db)});req.onerror=(function(e){callback(this.error);e.preventDefault()})}),getLocalSet:(function(mount,callback){var entries={};function isRealDir(p){return p!=="."&&p!==".."}function toAbsolute(root){return(function(p){return PATH.join2(root,p)})}var check=FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));while(check.length){var path=check.pop();var stat;try{stat=FS.stat(path)}catch(e){return callback(e)}if(FS.isDir(stat.mode)){check.push.apply(check,FS.readdir(path).filter(isRealDir).map(toAbsolute(path)))}entries[path]={timestamp:stat.mtime}}return callback(null,{type:"local",entries:entries})}),getRemoteSet:(function(mount,callback){var entries={};IDBFS.getDB(mount.mountpoint,(function(err,db){if(err)return callback(err);try{var transaction=db.transaction([IDBFS.DB_STORE_NAME],"readonly");transaction.onerror=(function(e){callback(this.error);e.preventDefault()});var store=transaction.objectStore(IDBFS.DB_STORE_NAME);var index=store.index("timestamp");index.openKeyCursor().onsuccess=(function(event){var cursor=event.target.result;if(!cursor){return callback(null,{type:"remote",db:db,entries:entries})}entries[cursor.primaryKey]={timestamp:cursor.key};cursor.continue()})}catch(e){return callback(e)}}))}),loadLocalEntry:(function(path,callback){var stat,node;try{var lookup=FS.lookupPath(path);node=lookup.node;stat=FS.stat(path)}catch(e){return callback(e)}if(FS.isDir(stat.mode)){return callback(null,{timestamp:stat.mtime,mode:stat.mode})}else if(FS.isFile(stat.mode)){node.contents=MEMFS.getFileDataAsTypedArray(node);return callback(null,{timestamp:stat.mtime,mode:stat.mode,contents:node.contents})}else{return callback(new Error("node type not supported"))}}),storeLocalEntry:(function(path,entry,callback){try{if(FS.isDir(entry.mode)){FS.mkdir(path,entry.mode)}else if(FS.isFile(entry.mode)){FS.writeFile(path,entry.contents,{canOwn:true})}else{return callback(new Error("node type not supported"))}FS.chmod(path,entry.mode);FS.utime(path,entry.timestamp,entry.timestamp)}catch(e){return callback(e)}callback(null)}),removeLocalEntry:(function(path,callback){try{var lookup=FS.lookupPath(path);var stat=FS.stat(path);if(FS.isDir(stat.mode)){FS.rmdir(path)}else if(FS.isFile(stat.mode)){FS.unlink(path)}}catch(e){return callback(e)}callback(null)}),loadRemoteEntry:(function(store,path,callback){var req=store.get(path);req.onsuccess=(function(event){callback(null,event.target.result)});req.onerror=(function(e){callback(this.error);e.preventDefault()})}),storeRemoteEntry:(function(store,path,entry,callback){var req=store.put(entry,path);req.onsuccess=(function(){callback(null)});req.onerror=(function(e){callback(this.error);e.preventDefault()})}),removeRemoteEntry:(function(store,path,callback){var req=store.delete(path);req.onsuccess=(function(){callback(null)});req.onerror=(function(e){callback(this.error);e.preventDefault()})}),reconcile:(function(src,dst,callback){var total=0;var create=[];Object.keys(src.entries).forEach((function(key){var e=src.entries[key];var e2=dst.entries[key];if(!e2||e.timestamp>e2.timestamp){create.push(key);total++}}));var remove=[];Object.keys(dst.entries).forEach((function(key){var e=dst.entries[key];var e2=src.entries[key];if(!e2){remove.push(key);total++}}));if(!total){return callback(null)}var errored=false;var completed=0;var db=src.type==="remote"?src.db:dst.db;var transaction=db.transaction([IDBFS.DB_STORE_NAME],"readwrite");var store=transaction.objectStore(IDBFS.DB_STORE_NAME);function done(err){if(err){if(!done.errored){done.errored=true;return callback(err)}return}if(++completed>=total){return callback(null)}}transaction.onerror=(function(e){done(this.error);e.preventDefault()});create.sort().forEach((function(path){if(dst.type==="local"){IDBFS.loadRemoteEntry(store,path,(function(err,entry){if(err)return done(err);IDBFS.storeLocalEntry(path,entry,done)}))}else{IDBFS.loadLocalEntry(path,(function(err,entry){if(err)return done(err);IDBFS.storeRemoteEntry(store,path,entry,done)}))}}));remove.sort().reverse().forEach((function(path){if(dst.type==="local"){IDBFS.removeLocalEntry(path,done)}else{IDBFS.removeRemoteEntry(store,path,done)}}))})};var NODEFS={isWindows:false,staticInit:(function(){NODEFS.isWindows=!!process.platform.match(/^win/);var flags=process["binding"]("constants");if(flags["fs"]){flags=flags["fs"]}NODEFS.flagsForNodeMap={"1024":flags["O_APPEND"],"64":flags["O_CREAT"],"128":flags["O_EXCL"],"0":flags["O_RDONLY"],"2":flags["O_RDWR"],"4096":flags["O_SYNC"],"512":flags["O_TRUNC"],"1":flags["O_WRONLY"]}}),bufferFrom:(function(arrayBuffer){return Buffer.alloc?Buffer.from(arrayBuffer):new Buffer(arrayBuffer)}),mount:(function(mount){assert(ENVIRONMENT_IS_NODE);return NODEFS.createNode(null,"/",NODEFS.getMode(mount.opts.root),0)}),createNode:(function(parent,name,mode,dev){if(!FS.isDir(mode)&&!FS.isFile(mode)&&!FS.isLink(mode)){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var node=FS.createNode(parent,name,mode);node.node_ops=NODEFS.node_ops;node.stream_ops=NODEFS.stream_ops;return node}),getMode:(function(path){var stat;try{stat=fs.lstatSync(path);if(NODEFS.isWindows){stat.mode=stat.mode|(stat.mode&292)>>2}}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}return stat.mode}),realPath:(function(node){var parts=[];while(node.parent!==node){parts.push(node.name);node=node.parent}parts.push(node.mount.opts.root);parts.reverse();return PATH.join.apply(null,parts)}),flagsForNode:(function(flags){flags&=~2097152;flags&=~2048;flags&=~32768;flags&=~524288;var newFlags=0;for(var k in NODEFS.flagsForNodeMap){if(flags&k){newFlags|=NODEFS.flagsForNodeMap[k];flags^=k}}if(!flags){return newFlags}else{throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}}),node_ops:{getattr:(function(node){var path=NODEFS.realPath(node);var stat;try{stat=fs.lstatSync(path)}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}if(NODEFS.isWindows&&!stat.blksize){stat.blksize=4096}if(NODEFS.isWindows&&!stat.blocks){stat.blocks=(stat.size+stat.blksize-1)/stat.blksize|0}return{dev:stat.dev,ino:stat.ino,mode:stat.mode,nlink:stat.nlink,uid:stat.uid,gid:stat.gid,rdev:stat.rdev,size:stat.size,atime:stat.atime,mtime:stat.mtime,ctime:stat.ctime,blksize:stat.blksize,blocks:stat.blocks}}),setattr:(function(node,attr){var path=NODEFS.realPath(node);try{if(attr.mode!==undefined){fs.chmodSync(path,attr.mode);node.mode=attr.mode}if(attr.timestamp!==undefined){var date=new Date(attr.timestamp);fs.utimesSync(path,date,date)}if(attr.size!==undefined){fs.truncateSync(path,attr.size)}}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),lookup:(function(parent,name){var path=PATH.join2(NODEFS.realPath(parent),name);var mode=NODEFS.getMode(path);return NODEFS.createNode(parent,name,mode)}),mknod:(function(parent,name,mode,dev){var node=NODEFS.createNode(parent,name,mode,dev);var path=NODEFS.realPath(node);try{if(FS.isDir(node.mode)){fs.mkdirSync(path,node.mode)}else{fs.writeFileSync(path,"",{mode:node.mode})}}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}return node}),rename:(function(oldNode,newDir,newName){var oldPath=NODEFS.realPath(oldNode);var newPath=PATH.join2(NODEFS.realPath(newDir),newName);try{fs.renameSync(oldPath,newPath)}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),unlink:(function(parent,name){var path=PATH.join2(NODEFS.realPath(parent),name);try{fs.unlinkSync(path)}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),rmdir:(function(parent,name){var path=PATH.join2(NODEFS.realPath(parent),name);try{fs.rmdirSync(path)}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),readdir:(function(node){var path=NODEFS.realPath(node);try{return fs.readdirSync(path)}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),symlink:(function(parent,newName,oldPath){var newPath=PATH.join2(NODEFS.realPath(parent),newName);try{fs.symlinkSync(oldPath,newPath)}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),readlink:(function(node){var path=NODEFS.realPath(node);try{path=fs.readlinkSync(path);path=NODEJS_PATH.relative(NODEJS_PATH.resolve(node.mount.opts.root),path);return path}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}})},stream_ops:{open:(function(stream){var path=NODEFS.realPath(stream.node);try{if(FS.isFile(stream.node.mode)){stream.nfd=fs.openSync(path,NODEFS.flagsForNode(stream.flags))}}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),close:(function(stream){try{if(FS.isFile(stream.node.mode)&&stream.nfd){fs.closeSync(stream.nfd)}}catch(e){if(!e.code)throw e;throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),read:(function(stream,buffer,offset,length,position){if(length===0)return 0;try{return fs.readSync(stream.nfd,NODEFS.bufferFrom(buffer.buffer),offset,length,position)}catch(e){throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),write:(function(stream,buffer,offset,length,position){try{return fs.writeSync(stream.nfd,NODEFS.bufferFrom(buffer.buffer),offset,length,position)}catch(e){throw new FS.ErrnoError(ERRNO_CODES[e.code])}}),llseek:(function(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){try{var stat=fs.fstatSync(stream.nfd);position+=stat.size}catch(e){throw new FS.ErrnoError(ERRNO_CODES[e.code])}}}if(position<0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}return position})}};var WORKERFS={DIR_MODE:16895,FILE_MODE:33279,reader:null,mount:(function(mount){assert(ENVIRONMENT_IS_WORKER);if(!WORKERFS.reader)WORKERFS.reader=new FileReaderSync;var root=WORKERFS.createNode(null,"/",WORKERFS.DIR_MODE,0);var createdParents={};function ensureParent(path){var parts=path.split("/");var parent=root;for(var i=0;i<parts.length-1;i++){var curr=parts.slice(0,i+1).join("/");if(!createdParents[curr]){createdParents[curr]=WORKERFS.createNode(parent,parts[i],WORKERFS.DIR_MODE,0)}parent=createdParents[curr]}return parent}function base(path){var parts=path.split("/");return parts[parts.length-1]}Array.prototype.forEach.call(mount.opts["files"]||[],(function(file){WORKERFS.createNode(ensureParent(file.name),base(file.name),WORKERFS.FILE_MODE,0,file,file.lastModifiedDate)}));(mount.opts["blobs"]||[]).forEach((function(obj){WORKERFS.createNode(ensureParent(obj["name"]),base(obj["name"]),WORKERFS.FILE_MODE,0,obj["data"])}));(mount.opts["packages"]||[]).forEach((function(pack){pack["metadata"].files.forEach((function(file){var name=file.filename.substr(1);WORKERFS.createNode(ensureParent(name),base(name),WORKERFS.FILE_MODE,0,pack["blob"].slice(file.start,file.end))}))}));return root}),createNode:(function(parent,name,mode,dev,contents,mtime){var node=FS.createNode(parent,name,mode);node.mode=mode;node.node_ops=WORKERFS.node_ops;node.stream_ops=WORKERFS.stream_ops;node.timestamp=(mtime||new Date).getTime();assert(WORKERFS.FILE_MODE!==WORKERFS.DIR_MODE);if(mode===WORKERFS.FILE_MODE){node.size=contents.size;node.contents=contents}else{node.size=4096;node.contents={}}if(parent){parent.contents[name]=node}return node}),node_ops:{getattr:(function(node){return{dev:1,ino:undefined,mode:node.mode,nlink:1,uid:0,gid:0,rdev:undefined,size:node.size,atime:new Date(node.timestamp),mtime:new Date(node.timestamp),ctime:new Date(node.timestamp),blksize:4096,blocks:Math.ceil(node.size/4096)}}),setattr:(function(node,attr){if(attr.mode!==undefined){node.mode=attr.mode}if(attr.timestamp!==undefined){node.timestamp=attr.timestamp}}),lookup:(function(parent,name){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}),mknod:(function(parent,name,mode,dev){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}),rename:(function(oldNode,newDir,newName){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}),unlink:(function(parent,name){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}),rmdir:(function(parent,name){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}),readdir:(function(node){var entries=[".",".."];for(var key in node.contents){if(!node.contents.hasOwnProperty(key)){continue}entries.push(key)}return entries}),symlink:(function(parent,newName,oldPath){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}),readlink:(function(node){throw new FS.ErrnoError(ERRNO_CODES.EPERM)})},stream_ops:{read:(function(stream,buffer,offset,length,position){if(position>=stream.node.size)return 0;var chunk=stream.node.contents.slice(position,position+length);var ab=WORKERFS.reader.readAsArrayBuffer(chunk);buffer.set(new Uint8Array(ab),offset);return chunk.size}),write:(function(stream,buffer,offset,length,position){throw new FS.ErrnoError(ERRNO_CODES.EIO)}),llseek:(function(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){position+=stream.node.size}}if(position<0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}return position})}};var _stdin=STATICTOP;STATICTOP+=16;var _stdout=STATICTOP;STATICTOP+=16;var _stderr=STATICTOP;STATICTOP+=16;var FS={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,trackingDelegate:{},tracking:{openFlags:{READ:1,WRITE:2}},ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,handleFSError:(function(e){if(!(e instanceof FS.ErrnoError))throw e+" : "+stackTrace();return ___setErrNo(e.errno)}),lookupPath:(function(path,opts){path=PATH.resolve(FS.cwd(),path);opts=opts||{};if(!path)return{path:"",node:null};var defaults={follow_mount:true,recurse_count:0};for(var key in defaults){if(opts[key]===undefined){opts[key]=defaults[key]}}if(opts.recurse_count>8){throw new FS.ErrnoError(ERRNO_CODES.ELOOP)}var parts=PATH.normalizeArray(path.split("/").filter((function(p){return!!p})),false);var current=FS.root;var current_path="/";for(var i=0;i<parts.length;i++){var islast=i===parts.length-1;if(islast&&opts.parent){break}current=FS.lookupNode(current,parts[i]);current_path=PATH.join2(current_path,parts[i]);if(FS.isMountpoint(current)){if(!islast||islast&&opts.follow_mount){current=current.mounted.root}}if(!islast||opts.follow){var count=0;while(FS.isLink(current.mode)){var link=FS.readlink(current_path);current_path=PATH.resolve(PATH.dirname(current_path),link);var lookup=FS.lookupPath(current_path,{recurse_count:opts.recurse_count});current=lookup.node;if(count++>40){throw new FS.ErrnoError(ERRNO_CODES.ELOOP)}}}}return{path:current_path,node:current}}),getPath:(function(node){var path;while(true){if(FS.isRoot(node)){var mount=node.mount.mountpoint;if(!path)return mount;return mount[mount.length-1]!=="/"?mount+"/"+path:mount+path}path=path?node.name+"/"+path:node.name;node=node.parent}}),hashName:(function(parentid,name){var hash=0;for(var i=0;i<name.length;i++){hash=(hash<<5)-hash+name.charCodeAt(i)|0}return(parentid+hash>>>0)%FS.nameTable.length}),hashAddNode:(function(node){var hash=FS.hashName(node.parent.id,node.name);node.name_next=FS.nameTable[hash];FS.nameTable[hash]=node}),hashRemoveNode:(function(node){var hash=FS.hashName(node.parent.id,node.name);if(FS.nameTable[hash]===node){FS.nameTable[hash]=node.name_next}else{var current=FS.nameTable[hash];while(current){if(current.name_next===node){current.name_next=node.name_next;break}current=current.name_next}}}),lookupNode:(function(parent,name){var err=FS.mayLookup(parent);if(err){throw new FS.ErrnoError(err,parent)}var hash=FS.hashName(parent.id,name);for(var node=FS.nameTable[hash];node;node=node.name_next){var nodeName=node.name;if(node.parent.id===parent.id&&nodeName===name){return node}}return FS.lookup(parent,name)}),createNode:(function(parent,name,mode,rdev){if(!FS.FSNode){FS.FSNode=(function(parent,name,mode,rdev){if(!parent){parent=this}this.parent=parent;this.mount=parent.mount;this.mounted=null;this.id=FS.nextInode++;this.name=name;this.mode=mode;this.node_ops={};this.stream_ops={};this.rdev=rdev});FS.FSNode.prototype={};var readMode=292|73;var writeMode=146;Object.defineProperties(FS.FSNode.prototype,{read:{get:(function(){return(this.mode&readMode)===readMode}),set:(function(val){val?this.mode|=readMode:this.mode&=~readMode})},write:{get:(function(){return(this.mode&writeMode)===writeMode}),set:(function(val){val?this.mode|=writeMode:this.mode&=~writeMode})},isFolder:{get:(function(){return FS.isDir(this.mode)})},isDevice:{get:(function(){return FS.isChrdev(this.mode)})}})}var node=new FS.FSNode(parent,name,mode,rdev);FS.hashAddNode(node);return node}),destroyNode:(function(node){FS.hashRemoveNode(node)}),isRoot:(function(node){return node===node.parent}),isMountpoint:(function(node){return!!node.mounted}),isFile:(function(mode){return(mode&61440)===32768}),isDir:(function(mode){return(mode&61440)===16384}),isLink:(function(mode){return(mode&61440)===40960}),isChrdev:(function(mode){return(mode&61440)===8192}),isBlkdev:(function(mode){return(mode&61440)===24576}),isFIFO:(function(mode){return(mode&61440)===4096}),isSocket:(function(mode){return(mode&49152)===49152}),flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:(function(str){var flags=FS.flagModes[str];if(typeof flags==="undefined"){throw new Error("Unknown file open mode: "+str)}return flags}),flagsToPermissionString:(function(flag){var perms=["r","w","rw"][flag&3];if(flag&512){perms+="w"}return perms}),nodePermissions:(function(node,perms){if(FS.ignorePermissions){return 0}if(perms.indexOf("r")!==-1&&!(node.mode&292)){return ERRNO_CODES.EACCES}else if(perms.indexOf("w")!==-1&&!(node.mode&146)){return ERRNO_CODES.EACCES}else if(perms.indexOf("x")!==-1&&!(node.mode&73)){return ERRNO_CODES.EACCES}return 0}),mayLookup:(function(dir){var err=FS.nodePermissions(dir,"x");if(err)return err;if(!dir.node_ops.lookup)return ERRNO_CODES.EACCES;return 0}),mayCreate:(function(dir,name){try{var node=FS.lookupNode(dir,name);return ERRNO_CODES.EEXIST}catch(e){}return FS.nodePermissions(dir,"wx")}),mayDelete:(function(dir,name,isdir){var node;try{node=FS.lookupNode(dir,name)}catch(e){return e.errno}var err=FS.nodePermissions(dir,"wx");if(err){return err}if(isdir){if(!FS.isDir(node.mode)){return ERRNO_CODES.ENOTDIR}if(FS.isRoot(node)||FS.getPath(node)===FS.cwd()){return ERRNO_CODES.EBUSY}}else{if(FS.isDir(node.mode)){return ERRNO_CODES.EISDIR}}return 0}),mayOpen:(function(node,flags){if(!node){return ERRNO_CODES.ENOENT}if(FS.isLink(node.mode)){return ERRNO_CODES.ELOOP}else if(FS.isDir(node.mode)){if(FS.flagsToPermissionString(flags)!=="r"||flags&512){return ERRNO_CODES.EISDIR}}return FS.nodePermissions(node,FS.flagsToPermissionString(flags))}),MAX_OPEN_FDS:4096,nextfd:(function(fd_start,fd_end){fd_start=fd_start||0;fd_end=fd_end||FS.MAX_OPEN_FDS;for(var fd=fd_start;fd<=fd_end;fd++){if(!FS.streams[fd]){return fd}}throw new FS.ErrnoError(ERRNO_CODES.EMFILE)}),getStream:(function(fd){return FS.streams[fd]}),createStream:(function(stream,fd_start,fd_end){if(!FS.FSStream){FS.FSStream=(function(){});FS.FSStream.prototype={};Object.defineProperties(FS.FSStream.prototype,{object:{get:(function(){return this.node}),set:(function(val){this.node=val})},isRead:{get:(function(){return(this.flags&2097155)!==1})},isWrite:{get:(function(){return(this.flags&2097155)!==0})},isAppend:{get:(function(){return this.flags&1024})}})}var newStream=new FS.FSStream;for(var p in stream){newStream[p]=stream[p]}stream=newStream;var fd=FS.nextfd(fd_start,fd_end);stream.fd=fd;FS.streams[fd]=stream;return stream}),closeStream:(function(fd){FS.streams[fd]=null}),chrdev_stream_ops:{open:(function(stream){var device=FS.getDevice(stream.node.rdev);stream.stream_ops=device.stream_ops;if(stream.stream_ops.open){stream.stream_ops.open(stream)}}),llseek:(function(){throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)})},major:(function(dev){return dev>>8}),minor:(function(dev){return dev&255}),makedev:(function(ma,mi){return ma<<8|mi}),registerDevice:(function(dev,ops){FS.devices[dev]={stream_ops:ops}}),getDevice:(function(dev){return FS.devices[dev]}),getMounts:(function(mount){var mounts=[];var check=[mount];while(check.length){var m=check.pop();mounts.push(m);check.push.apply(check,m.mounts)}return mounts}),syncfs:(function(populate,callback){if(typeof populate==="function"){callback=populate;populate=false}FS.syncFSRequests++;if(FS.syncFSRequests>1){console.log("warning: "+FS.syncFSRequests+" FS.syncfs operations in flight at once, probably just doing extra work")}var mounts=FS.getMounts(FS.root.mount);var completed=0;function doCallback(err){assert(FS.syncFSRequests>0);FS.syncFSRequests--;return callback(err)}function done(err){if(err){if(!done.errored){done.errored=true;return doCallback(err)}return}if(++completed>=mounts.length){doCallback(null)}}mounts.forEach((function(mount){if(!mount.type.syncfs){return done(null)}mount.type.syncfs(mount,populate,done)}))}),mount:(function(type,opts,mountpoint){var root=mountpoint==="/";var pseudo=!mountpoint;var node;if(root&&FS.root){throw new FS.ErrnoError(ERRNO_CODES.EBUSY)}else if(!root&&!pseudo){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});mountpoint=lookup.path;node=lookup.node;if(FS.isMountpoint(node)){throw new FS.ErrnoError(ERRNO_CODES.EBUSY)}if(!FS.isDir(node.mode)){throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)}}var mount={type:type,opts:opts,mountpoint:mountpoint,mounts:[]};var mountRoot=type.mount(mount);mountRoot.mount=mount;mount.root=mountRoot;if(root){FS.root=mountRoot}else if(node){node.mounted=mount;if(node.mount){node.mount.mounts.push(mount)}}return mountRoot}),unmount:(function(mountpoint){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});if(!FS.isMountpoint(lookup.node)){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var node=lookup.node;var mount=node.mounted;var mounts=FS.getMounts(mount);Object.keys(FS.nameTable).forEach((function(hash){var current=FS.nameTable[hash];while(current){var next=current.name_next;if(mounts.indexOf(current.mount)!==-1){FS.destroyNode(current)}current=next}}));node.mounted=null;var idx=node.mount.mounts.indexOf(mount);assert(idx!==-1);node.mount.mounts.splice(idx,1)}),lookup:(function(parent,name){return parent.node_ops.lookup(parent,name)}),mknod:(function(path,mode,dev){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);if(!name||name==="."||name===".."){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var err=FS.mayCreate(parent,name);if(err){throw new FS.ErrnoError(err)}if(!parent.node_ops.mknod){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}return parent.node_ops.mknod(parent,name,mode,dev)}),create:(function(path,mode){mode=mode!==undefined?mode:438;mode&=4095;mode|=32768;return FS.mknod(path,mode,0)}),mkdir:(function(path,mode){mode=mode!==undefined?mode:511;mode&=511|512;mode|=16384;return FS.mknod(path,mode,0)}),mkdirTree:(function(path,mode){var dirs=path.split("/");var d="";for(var i=0;i<dirs.length;++i){if(!dirs[i])continue;d+="/"+dirs[i];try{FS.mkdir(d,mode)}catch(e){if(e.errno!=ERRNO_CODES.EEXIST)throw e}}}),mkdev:(function(path,mode,dev){if(typeof dev==="undefined"){dev=mode;mode=438}mode|=8192;return FS.mknod(path,mode,dev)}),symlink:(function(oldpath,newpath){if(!PATH.resolve(oldpath)){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}var lookup=FS.lookupPath(newpath,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}var newname=PATH.basename(newpath);var err=FS.mayCreate(parent,newname);if(err){throw new FS.ErrnoError(err)}if(!parent.node_ops.symlink){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}return parent.node_ops.symlink(parent,newname,oldpath)}),rename:(function(old_path,new_path){var old_dirname=PATH.dirname(old_path);var new_dirname=PATH.dirname(new_path);var old_name=PATH.basename(old_path);var new_name=PATH.basename(new_path);var lookup,old_dir,new_dir;try{lookup=FS.lookupPath(old_path,{parent:true});old_dir=lookup.node;lookup=FS.lookupPath(new_path,{parent:true});new_dir=lookup.node}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EBUSY)}if(!old_dir||!new_dir)throw new FS.ErrnoError(ERRNO_CODES.ENOENT);if(old_dir.mount!==new_dir.mount){throw new FS.ErrnoError(ERRNO_CODES.EXDEV)}var old_node=FS.lookupNode(old_dir,old_name);var relative=PATH.relative(old_path,new_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}relative=PATH.relative(new_path,old_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)}var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(old_node===new_node){return}var isdir=FS.isDir(old_node.mode);var err=FS.mayDelete(old_dir,old_name,isdir);if(err){throw new FS.ErrnoError(err)}err=new_node?FS.mayDelete(new_dir,new_name,isdir):FS.mayCreate(new_dir,new_name);if(err){throw new FS.ErrnoError(err)}if(!old_dir.node_ops.rename){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}if(FS.isMountpoint(old_node)||new_node&&FS.isMountpoint(new_node)){throw new FS.ErrnoError(ERRNO_CODES.EBUSY)}if(new_dir!==old_dir){err=FS.nodePermissions(old_dir,"w");if(err){throw new FS.ErrnoError(err)}}try{if(FS.trackingDelegate["willMovePath"]){FS.trackingDelegate["willMovePath"](old_path,new_path)}}catch(e){console.log("FS.trackingDelegate['willMovePath']('"+old_path+"', '"+new_path+"') threw an exception: "+e.message)}FS.hashRemoveNode(old_node);try{old_dir.node_ops.rename(old_node,new_dir,new_name)}catch(e){throw e}finally{FS.hashAddNode(old_node)}try{if(FS.trackingDelegate["onMovePath"])FS.trackingDelegate["onMovePath"](old_path,new_path)}catch(e){console.log("FS.trackingDelegate['onMovePath']('"+old_path+"', '"+new_path+"') threw an exception: "+e.message)}}),rmdir:(function(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var err=FS.mayDelete(parent,name,true);if(err){throw new FS.ErrnoError(err)}if(!parent.node_ops.rmdir){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(ERRNO_CODES.EBUSY)}try{if(FS.trackingDelegate["willDeletePath"]){FS.trackingDelegate["willDeletePath"](path)}}catch(e){console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: "+e.message)}parent.node_ops.rmdir(parent,name);FS.destroyNode(node);try{if(FS.trackingDelegate["onDeletePath"])FS.trackingDelegate["onDeletePath"](path)}catch(e){console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: "+e.message)}}),readdir:(function(path){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;if(!node.node_ops.readdir){throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)}return node.node_ops.readdir(node)}),unlink:(function(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var err=FS.mayDelete(parent,name,false);if(err){throw new FS.ErrnoError(err)}if(!parent.node_ops.unlink){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(ERRNO_CODES.EBUSY)}try{if(FS.trackingDelegate["willDeletePath"]){FS.trackingDelegate["willDeletePath"](path)}}catch(e){console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: "+e.message)}parent.node_ops.unlink(parent,name);FS.destroyNode(node);try{if(FS.trackingDelegate["onDeletePath"])FS.trackingDelegate["onDeletePath"](path)}catch(e){console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: "+e.message)}}),readlink:(function(path){var lookup=FS.lookupPath(path);var link=lookup.node;if(!link){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}if(!link.node_ops.readlink){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}return PATH.resolve(FS.getPath(link.parent),link.node_ops.readlink(link))}),stat:(function(path,dontFollow){var lookup=FS.lookupPath(path,{follow:!dontFollow});var node=lookup.node;if(!node){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}if(!node.node_ops.getattr){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}return node.node_ops.getattr(node)}),lstat:(function(path){return FS.stat(path,true)}),chmod:(function(path,mode,dontFollow){var node;if(typeof path==="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}node.node_ops.setattr(node,{mode:mode&4095|node.mode&~4095,timestamp:Date.now()})}),lchmod:(function(path,mode){FS.chmod(path,mode,true)}),fchmod:(function(fd,mode){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}FS.chmod(stream.node,mode)}),chown:(function(path,uid,gid,dontFollow){var node;if(typeof path==="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}node.node_ops.setattr(node,{timestamp:Date.now()})}),lchown:(function(path,uid,gid){FS.chown(path,uid,gid,true)}),fchown:(function(fd,uid,gid){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}FS.chown(stream.node,uid,gid)}),truncate:(function(path,len){if(len<0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var node;if(typeof path==="string"){var lookup=FS.lookupPath(path,{follow:true});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(ERRNO_CODES.EPERM)}if(FS.isDir(node.mode)){throw new FS.ErrnoError(ERRNO_CODES.EISDIR)}if(!FS.isFile(node.mode)){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var err=FS.nodePermissions(node,"w");if(err){throw new FS.ErrnoError(err)}node.node_ops.setattr(node,{size:len,timestamp:Date.now()})}),ftruncate:(function(fd,len){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}FS.truncate(stream.node,len)}),utime:(function(path,atime,mtime){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;node.node_ops.setattr(node,{timestamp:Math.max(atime,mtime)})}),open:(function(path,flags,mode,fd_start,fd_end){if(path===""){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}flags=typeof flags==="string"?FS.modeStringToFlags(flags):flags;mode=typeof mode==="undefined"?438:mode;if(flags&64){mode=mode&4095|32768}else{mode=0}var node;if(typeof path==="object"){node=path}else{path=PATH.normalize(path);try{var lookup=FS.lookupPath(path,{follow:!(flags&131072)});node=lookup.node}catch(e){}}var created=false;if(flags&64){if(node){if(flags&128){throw new FS.ErrnoError(ERRNO_CODES.EEXIST)}}else{node=FS.mknod(path,mode,0);created=true}}if(!node){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}if(FS.isChrdev(node.mode)){flags&=~512}if(flags&65536&&!FS.isDir(node.mode)){throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)}if(!created){var err=FS.mayOpen(node,flags);if(err){throw new FS.ErrnoError(err)}}if(flags&512){FS.truncate(node,0)}flags&=~(128|512);var stream=FS.createStream({node:node,path:FS.getPath(node),flags:flags,seekable:true,position:0,stream_ops:node.stream_ops,ungotten:[],error:false},fd_start,fd_end);if(stream.stream_ops.open){stream.stream_ops.open(stream)}if(Module["logReadFiles"]&&!(flags&1)){if(!FS.readFiles)FS.readFiles={};if(!(path in FS.readFiles)){FS.readFiles[path]=1;err("read file: "+path)}}try{if(FS.trackingDelegate["onOpenFile"]){var trackingFlags=0;if((flags&2097155)!==1){trackingFlags|=FS.tracking.openFlags.READ}if((flags&2097155)!==0){trackingFlags|=FS.tracking.openFlags.WRITE}FS.trackingDelegate["onOpenFile"](path,trackingFlags)}}catch(e){console.log("FS.trackingDelegate['onOpenFile']('"+path+"', flags) threw an exception: "+e.message)}return stream}),close:(function(stream){if(FS.isClosed(stream)){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if(stream.getdents)stream.getdents=null;try{if(stream.stream_ops.close){stream.stream_ops.close(stream)}}catch(e){throw e}finally{FS.closeStream(stream.fd)}stream.fd=null}),isClosed:(function(stream){return stream.fd===null}),llseek:(function(stream,offset,whence){if(FS.isClosed(stream)){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if(!stream.seekable||!stream.stream_ops.llseek){throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)}stream.position=stream.stream_ops.llseek(stream,offset,whence);stream.ungotten=[];return stream.position}),read:(function(stream,buffer,offset,length,position){if(length<0||position<0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}if(FS.isClosed(stream)){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(ERRNO_CODES.EISDIR)}if(!stream.stream_ops.read){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var seeking=typeof position!=="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)}var bytesRead=stream.stream_ops.read(stream,buffer,offset,length,position);if(!seeking)stream.position+=bytesRead;return bytesRead}),write:(function(stream,buffer,offset,length,position,canOwn){if(length<0||position<0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}if(FS.isClosed(stream)){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(ERRNO_CODES.EISDIR)}if(!stream.stream_ops.write){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}if(stream.flags&1024){FS.llseek(stream,0,2)}var seeking=typeof position!=="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)}var bytesWritten=stream.stream_ops.write(stream,buffer,offset,length,position,canOwn);if(!seeking)stream.position+=bytesWritten;try{if(stream.path&&FS.trackingDelegate["onWriteToFile"])FS.trackingDelegate["onWriteToFile"](stream.path)}catch(e){console.log("FS.trackingDelegate['onWriteToFile']('"+path+"') threw an exception: "+e.message)}return bytesWritten}),allocate:(function(stream,offset,length){if(FS.isClosed(stream)){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if(offset<0||length<=0){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(ERRNO_CODES.EBADF)}if(!FS.isFile(stream.node.mode)&&!FS.isDir(stream.node.mode)){throw new FS.ErrnoError(ERRNO_CODES.ENODEV)}if(!stream.stream_ops.allocate){throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)}stream.stream_ops.allocate(stream,offset,length)}),mmap:(function(stream,buffer,offset,length,position,prot,flags){if((stream.flags&2097155)===1){throw new FS.ErrnoError(ERRNO_CODES.EACCES)}if(!stream.stream_ops.mmap){throw new FS.ErrnoError(ERRNO_CODES.ENODEV)}return stream.stream_ops.mmap(stream,buffer,offset,length,position,prot,flags)}),msync:(function(stream,buffer,offset,length,mmapFlags){if(!stream||!stream.stream_ops.msync){return 0}return stream.stream_ops.msync(stream,buffer,offset,length,mmapFlags)}),munmap:(function(stream){return 0}),ioctl:(function(stream,cmd,arg){if(!stream.stream_ops.ioctl){throw new FS.ErrnoError(ERRNO_CODES.ENOTTY)}return stream.stream_ops.ioctl(stream,cmd,arg)}),readFile:(function(path,opts){opts=opts||{};opts.flags=opts.flags||"r";opts.encoding=opts.encoding||"binary";if(opts.encoding!=="utf8"&&opts.encoding!=="binary"){throw new Error('Invalid encoding type "'+opts.encoding+'"')}var ret;var stream=FS.open(path,opts.flags);var stat=FS.stat(path);var length=stat.size;var buf=new Uint8Array(length);FS.read(stream,buf,0,length,0);if(opts.encoding==="utf8"){ret=UTF8ArrayToString(buf,0)}else if(opts.encoding==="binary"){ret=buf}FS.close(stream);return ret}),writeFile:(function(path,data,opts){opts=opts||{};opts.flags=opts.flags||"w";var stream=FS.open(path,opts.flags,opts.mode);if(typeof data==="string"){var buf=new Uint8Array(lengthBytesUTF8(data)+1);var actualNumBytes=stringToUTF8Array(data,buf,0,buf.length);FS.write(stream,buf,0,actualNumBytes,undefined,opts.canOwn)}else if(ArrayBuffer.isView(data)){FS.write(stream,data,0,data.byteLength,undefined,opts.canOwn)}else{throw new Error("Unsupported data type")}FS.close(stream)}),cwd:(function(){return FS.currentPath}),chdir:(function(path){var lookup=FS.lookupPath(path,{follow:true});if(lookup.node===null){throw new FS.ErrnoError(ERRNO_CODES.ENOENT)}if(!FS.isDir(lookup.node.mode)){throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)}var err=FS.nodePermissions(lookup.node,"x");if(err){throw new FS.ErrnoError(err)}FS.currentPath=lookup.path}),createDefaultDirectories:(function(){FS.mkdir("/tmp");FS.mkdir("/home");FS.mkdir("/home/web_user")}),createDefaultDevices:(function(){FS.mkdir("/dev");FS.registerDevice(FS.makedev(1,3),{read:(function(){return 0}),write:(function(stream,buffer,offset,length,pos){return length})});FS.mkdev("/dev/null",FS.makedev(1,3));TTY.register(FS.makedev(5,0),TTY.default_tty_ops);TTY.register(FS.makedev(6,0),TTY.default_tty1_ops);FS.mkdev("/dev/tty",FS.makedev(5,0));FS.mkdev("/dev/tty1",FS.makedev(6,0));var random_device;if(typeof crypto!=="undefined"){var randomBuffer=new Uint8Array(1);random_device=(function(){crypto.getRandomValues(randomBuffer);return randomBuffer[0]})}else if(ENVIRONMENT_IS_NODE){random_device=(function(){return require("crypto")["randomBytes"](1)[0]})}else{random_device=(function(){return Math.random()*256|0})}FS.createDevice("/dev","random",random_device);FS.createDevice("/dev","urandom",random_device);FS.mkdir("/dev/shm");FS.mkdir("/dev/shm/tmp")}),createSpecialDirectories:(function(){FS.mkdir("/proc");FS.mkdir("/proc/self");FS.mkdir("/proc/self/fd");FS.mount({mount:(function(){var node=FS.createNode("/proc/self","fd",16384|511,73);node.node_ops={lookup:(function(parent,name){var fd=+name;var stream=FS.getStream(fd);if(!stream)throw new FS.ErrnoError(ERRNO_CODES.EBADF);var ret={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:(function(){return stream.path})}};ret.parent=ret;return ret})};return node})},{},"/proc/self/fd")}),createStandardStreams:(function(){if(Module["stdin"]){FS.createDevice("/dev","stdin",Module["stdin"])}else{FS.symlink("/dev/tty","/dev/stdin")}if(Module["stdout"]){FS.createDevice("/dev","stdout",null,Module["stdout"])}else{FS.symlink("/dev/tty","/dev/stdout")}if(Module["stderr"]){FS.createDevice("/dev","stderr",null,Module["stderr"])}else{FS.symlink("/dev/tty1","/dev/stderr")}var stdin=FS.open("/dev/stdin","r");assert(stdin.fd===0,"invalid handle for stdin ("+stdin.fd+")");var stdout=FS.open("/dev/stdout","w");assert(stdout.fd===1,"invalid handle for stdout ("+stdout.fd+")");var stderr=FS.open("/dev/stderr","w");assert(stderr.fd===2,"invalid handle for stderr ("+stderr.fd+")")}),ensureErrnoError:(function(){if(FS.ErrnoError)return;FS.ErrnoError=function ErrnoError(errno,node){this.node=node;this.setErrno=(function(errno){this.errno=errno;for(var key in ERRNO_CODES){if(ERRNO_CODES[key]===errno){this.code=key;break}}});this.setErrno(errno);this.message=ERRNO_MESSAGES[errno];if(this.stack)Object.defineProperty(this,"stack",{value:(new Error).stack,writable:true})};FS.ErrnoError.prototype=new Error;FS.ErrnoError.prototype.constructor=FS.ErrnoError;[ERRNO_CODES.ENOENT].forEach((function(code){FS.genericErrors[code]=new FS.ErrnoError(code);FS.genericErrors[code].stack="<generic error, no stack>"}))}),staticInit:(function(){FS.ensureErrnoError();FS.nameTable=new Array(4096);FS.mount(MEMFS,{},"/");FS.createDefaultDirectories();FS.createDefaultDevices();FS.createSpecialDirectories();FS.filesystems={"MEMFS":MEMFS,"IDBFS":IDBFS,"NODEFS":NODEFS,"WORKERFS":WORKERFS}}),init:(function(input,output,error){assert(!FS.init.initialized,"FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");FS.init.initialized=true;FS.ensureErrnoError();Module["stdin"]=input||Module["stdin"];Module["stdout"]=output||Module["stdout"];Module["stderr"]=error||Module["stderr"];FS.createStandardStreams()}),quit:(function(){FS.init.initialized=false;var fflush=Module["_fflush"];if(fflush)fflush(0);for(var i=0;i<FS.streams.length;i++){var stream=FS.streams[i];if(!stream){continue}FS.close(stream)}}),getMode:(function(canRead,canWrite){var mode=0;if(canRead)mode|=292|73;if(canWrite)mode|=146;return mode}),joinPath:(function(parts,forceRelative){var path=PATH.join.apply(null,parts);if(forceRelative&&path[0]=="/")path=path.substr(1);return path}),absolutePath:(function(relative,base){return PATH.resolve(base,relative)}),standardizePath:(function(path){return PATH.normalize(path)}),findObject:(function(path,dontResolveLastLink){var ret=FS.analyzePath(path,dontResolveLastLink);if(ret.exists){return ret.object}else{___setErrNo(ret.error);return null}}),analyzePath:(function(path,dontResolveLastLink){try{var lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});path=lookup.path}catch(e){}var ret={isRoot:false,exists:false,error:0,name:null,path:null,object:null,parentExists:false,parentPath:null,parentObject:null};try{var lookup=FS.lookupPath(path,{parent:true});ret.parentExists=true;ret.parentPath=lookup.path;ret.parentObject=lookup.node;ret.name=PATH.basename(path);lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});ret.exists=true;ret.path=lookup.path;ret.object=lookup.node;ret.name=lookup.node.name;ret.isRoot=lookup.path==="/"}catch(e){ret.error=e.errno}return ret}),createFolder:(function(parent,name,canRead,canWrite){var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);var mode=FS.getMode(canRead,canWrite);return FS.mkdir(path,mode)}),createPath:(function(parent,path,canRead,canWrite){parent=typeof parent==="string"?parent:FS.getPath(parent);var parts=path.split("/").reverse();while(parts.length){var part=parts.pop();if(!part)continue;var current=PATH.join2(parent,part);try{FS.mkdir(current)}catch(e){}parent=current}return current}),createFile:(function(parent,name,properties,canRead,canWrite){var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);var mode=FS.getMode(canRead,canWrite);return FS.create(path,mode)}),createDataFile:(function(parent,name,data,canRead,canWrite,canOwn){var path=name?PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name):parent;var mode=FS.getMode(canRead,canWrite);var node=FS.create(path,mode);if(data){if(typeof data==="string"){var arr=new Array(data.length);for(var i=0,len=data.length;i<len;++i)arr[i]=data.charCodeAt(i);data=arr}FS.chmod(node,mode|146);var stream=FS.open(node,"w");FS.write(stream,data,0,data.length,0,canOwn);FS.close(stream);FS.chmod(node,mode)}return node}),createDevice:(function(parent,name,input,output){var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);var mode=FS.getMode(!!input,!!output);if(!FS.createDevice.major)FS.createDevice.major=64;var dev=FS.makedev(FS.createDevice.major++,0);FS.registerDevice(dev,{open:(function(stream){stream.seekable=false}),close:(function(stream){if(output&&output.buffer&&output.buffer.length){output(10)}}),read:(function(stream,buffer,offset,length,pos){var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=input()}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EIO)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.timestamp=Date.now()}return bytesRead}),write:(function(stream,buffer,offset,length,pos){for(var i=0;i<length;i++){try{output(buffer[offset+i])}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EIO)}}if(length){stream.node.timestamp=Date.now()}return i})});return FS.mkdev(path,mode,dev)}),createLink:(function(parent,name,target,canRead,canWrite){var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);return FS.symlink(target,path)}),forceLoadFile:(function(obj){if(obj.isDevice||obj.isFolder||obj.link||obj.contents)return true;var success=true;if(typeof XMLHttpRequest!=="undefined"){throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")}else if(Module["read"]){try{obj.contents=intArrayFromString(Module["read"](obj.url),true);obj.usedBytes=obj.contents.length}catch(e){success=false}}else{throw new Error("Cannot load without read() or XMLHttpRequest.")}if(!success)___setErrNo(ERRNO_CODES.EIO);return success}),createLazyFile:(function(parent,name,url,canRead,canWrite){function LazyUint8Array(){this.lengthKnown=false;this.chunks=[]}LazyUint8Array.prototype.get=function LazyUint8Array_get(idx){if(idx>this.length-1||idx<0){return undefined}var chunkOffset=idx%this.chunkSize;var chunkNum=idx/this.chunkSize|0;return this.getter(chunkNum)[chunkOffset]};LazyUint8Array.prototype.setDataGetter=function LazyUint8Array_setDataGetter(getter){this.getter=getter};LazyUint8Array.prototype.cacheLength=function LazyUint8Array_cacheLength(){var xhr=new XMLHttpRequest;xhr.open("HEAD",url,false);xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);var datalength=Number(xhr.getResponseHeader("Content-length"));var header;var hasByteServing=(header=xhr.getResponseHeader("Accept-Ranges"))&&header==="bytes";var usesGzip=(header=xhr.getResponseHeader("Content-Encoding"))&&header==="gzip";var chunkSize=1024*1024;if(!hasByteServing)chunkSize=datalength;var doXHR=(function(from,to){if(from>to)throw new Error("invalid range ("+from+", "+to+") or no bytes requested!");if(to>datalength-1)throw new Error("only "+datalength+" bytes available! programmer error!");var xhr=new XMLHttpRequest;xhr.open("GET",url,false);if(datalength!==chunkSize)xhr.setRequestHeader("Range","bytes="+from+"-"+to);if(typeof Uint8Array!="undefined")xhr.responseType="arraybuffer";if(xhr.overrideMimeType){xhr.overrideMimeType("text/plain; charset=x-user-defined")}xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);if(xhr.response!==undefined){return new Uint8Array(xhr.response||[])}else{return intArrayFromString(xhr.responseText||"",true)}});var lazyArray=this;lazyArray.setDataGetter((function(chunkNum){var start=chunkNum*chunkSize;var end=(chunkNum+1)*chunkSize-1;end=Math.min(end,datalength-1);if(typeof lazyArray.chunks[chunkNum]==="undefined"){lazyArray.chunks[chunkNum]=doXHR(start,end)}if(typeof lazyArray.chunks[chunkNum]==="undefined")throw new Error("doXHR failed!");return lazyArray.chunks[chunkNum]}));if(usesGzip||!datalength){chunkSize=datalength=1;datalength=this.getter(0).length;chunkSize=datalength;console.log("LazyFiles on gzip forces download of the whole file when length is accessed")}this._length=datalength;this._chunkSize=chunkSize;this.lengthKnown=true};if(typeof XMLHttpRequest!=="undefined"){if(!ENVIRONMENT_IS_WORKER)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var lazyArray=new LazyUint8Array;Object.defineProperties(lazyArray,{length:{get:(function(){if(!this.lengthKnown){this.cacheLength()}return this._length})},chunkSize:{get:(function(){if(!this.lengthKnown){this.cacheLength()}return this._chunkSize})}});var properties={isDevice:false,contents:lazyArray}}else{var properties={isDevice:false,url:url}}var node=FS.createFile(parent,name,properties,canRead,canWrite);if(properties.contents){node.contents=properties.contents}else if(properties.url){node.contents=null;node.url=properties.url}Object.defineProperties(node,{usedBytes:{get:(function(){return this.contents.length})}});var stream_ops={};var keys=Object.keys(node.stream_ops);keys.forEach((function(key){var fn=node.stream_ops[key];stream_ops[key]=function forceLoadLazyFile(){if(!FS.forceLoadFile(node)){throw new FS.ErrnoError(ERRNO_CODES.EIO)}return fn.apply(null,arguments)}}));stream_ops.read=function stream_ops_read(stream,buffer,offset,length,position){if(!FS.forceLoadFile(node)){throw new FS.ErrnoError(ERRNO_CODES.EIO)}var contents=stream.node.contents;if(position>=contents.length)return 0;var size=Math.min(contents.length-position,length);assert(size>=0);if(contents.slice){for(var i=0;i<size;i++){buffer[offset+i]=contents[position+i]}}else{for(var i=0;i<size;i++){buffer[offset+i]=contents.get(position+i)}}return size};node.stream_ops=stream_ops;return node}),createPreloadedFile:(function(parent,name,url,canRead,canWrite,onload,onerror,dontCreateFile,canOwn,preFinish){Browser.init();var fullname=name?PATH.resolve(PATH.join2(parent,name)):parent;var dep=getUniqueRunDependency("cp "+fullname);function processData(byteArray){function finish(byteArray){if(preFinish)preFinish();if(!dontCreateFile){FS.createDataFile(parent,name,byteArray,canRead,canWrite,canOwn)}if(onload)onload();removeRunDependency(dep)}var handled=false;Module["preloadPlugins"].forEach((function(plugin){if(handled)return;if(plugin["canHandle"](fullname)){plugin["handle"](byteArray,fullname,finish,(function(){if(onerror)onerror();removeRunDependency(dep)}));handled=true}}));if(!handled)finish(byteArray)}addRunDependency(dep);if(typeof url=="string"){Browser.asyncLoad(url,(function(byteArray){processData(byteArray)}),onerror)}else{processData(url)}}),indexedDB:(function(){return window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB}),DB_NAME:(function(){return"EM_FS_"+window.location.pathname}),DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:(function(paths,onload,onerror){onload=onload||(function(){});onerror=onerror||(function(){});var indexedDB=FS.indexedDB();try{var openRequest=indexedDB.open(FS.DB_NAME(),FS.DB_VERSION)}catch(e){return onerror(e)}openRequest.onupgradeneeded=function openRequest_onupgradeneeded(){console.log("creating db");var db=openRequest.result;db.createObjectStore(FS.DB_STORE_NAME)};openRequest.onsuccess=function openRequest_onsuccess(){var db=openRequest.result;var transaction=db.transaction([FS.DB_STORE_NAME],"readwrite");var files=transaction.objectStore(FS.DB_STORE_NAME);var ok=0,fail=0,total=paths.length;function finish(){if(fail==0)onload();else onerror()}paths.forEach((function(path){var putRequest=files.put(FS.analyzePath(path).object.contents,path);putRequest.onsuccess=function putRequest_onsuccess(){ok++;if(ok+fail==total)finish()};putRequest.onerror=function putRequest_onerror(){fail++;if(ok+fail==total)finish()}}));transaction.onerror=onerror};openRequest.onerror=onerror}),loadFilesFromDB:(function(paths,onload,onerror){onload=onload||(function(){});onerror=onerror||(function(){});var indexedDB=FS.indexedDB();try{var openRequest=indexedDB.open(FS.DB_NAME(),FS.DB_VERSION)}catch(e){return onerror(e)}openRequest.onupgradeneeded=onerror;openRequest.onsuccess=function openRequest_onsuccess(){var db=openRequest.result;try{var transaction=db.transaction([FS.DB_STORE_NAME],"readonly")}catch(e){onerror(e);return}var files=transaction.objectStore(FS.DB_STORE_NAME);var ok=0,fail=0,total=paths.length;function finish(){if(fail==0)onload();else onerror()}paths.forEach((function(path){var getRequest=files.get(path);getRequest.onsuccess=function getRequest_onsuccess(){if(FS.analyzePath(path).exists){FS.unlink(path)}FS.createDataFile(PATH.dirname(path),PATH.basename(path),getRequest.result,true,true,true);ok++;if(ok+fail==total)finish()};getRequest.onerror=function getRequest_onerror(){fail++;if(ok+fail==total)finish()}}));transaction.onerror=onerror};openRequest.onerror=onerror})};var SYSCALLS={DEFAULT_POLLMASK:5,mappings:{},umask:511,calculateAt:(function(dirfd,path){if(path[0]!=="/"){var dir;if(dirfd===-100){dir=FS.cwd()}else{var dirstream=FS.getStream(dirfd);if(!dirstream)throw new FS.ErrnoError(ERRNO_CODES.EBADF);dir=dirstream.path}path=PATH.join2(dir,path)}return path}),doStat:(function(func,path,buf){try{var stat=func(path)}catch(e){if(e&&e.node&&PATH.normalize(path)!==PATH.normalize(FS.getPath(e.node))){return-ERRNO_CODES.ENOTDIR}throw e}HEAP32[buf>>2]=stat.dev;HEAP32[buf+4>>2]=0;HEAP32[buf+8>>2]=stat.ino;HEAP32[buf+12>>2]=stat.mode;HEAP32[buf+16>>2]=stat.nlink;HEAP32[buf+20>>2]=stat.uid;HEAP32[buf+24>>2]=stat.gid;HEAP32[buf+28>>2]=stat.rdev;HEAP32[buf+32>>2]=0;HEAP32[buf+36>>2]=stat.size;HEAP32[buf+40>>2]=4096;HEAP32[buf+44>>2]=stat.blocks;HEAP32[buf+48>>2]=stat.atime.getTime()/1e3|0;HEAP32[buf+52>>2]=0;HEAP32[buf+56>>2]=stat.mtime.getTime()/1e3|0;HEAP32[buf+60>>2]=0;HEAP32[buf+64>>2]=stat.ctime.getTime()/1e3|0;HEAP32[buf+68>>2]=0;HEAP32[buf+72>>2]=stat.ino;return 0}),doMsync:(function(addr,stream,len,flags){var buffer=new Uint8Array(HEAPU8.subarray(addr,addr+len));FS.msync(stream,buffer,0,len,flags)}),doMkdir:(function(path,mode){path=PATH.normalize(path);if(path[path.length-1]==="/")path=path.substr(0,path.length-1);FS.mkdir(path,mode,0);return 0}),doMknod:(function(path,mode,dev){switch(mode&61440){case 32768:case 8192:case 24576:case 4096:case 49152:break;default:return-ERRNO_CODES.EINVAL}FS.mknod(path,mode,dev);return 0}),doReadlink:(function(path,buf,bufsize){if(bufsize<=0)return-ERRNO_CODES.EINVAL;var ret=FS.readlink(path);var len=Math.min(bufsize,lengthBytesUTF8(ret));var endChar=HEAP8[buf+len];stringToUTF8(ret,buf,bufsize+1);HEAP8[buf+len]=endChar;return len}),doAccess:(function(path,amode){if(amode&~7){return-ERRNO_CODES.EINVAL}var node;var lookup=FS.lookupPath(path,{follow:true});node=lookup.node;var perms="";if(amode&4)perms+="r";if(amode&2)perms+="w";if(amode&1)perms+="x";if(perms&&FS.nodePermissions(node,perms)){return-ERRNO_CODES.EACCES}return 0}),doDup:(function(path,flags,suggestFD){var suggest=FS.getStream(suggestFD);if(suggest)FS.close(suggest);return FS.open(path,flags,0,suggestFD,suggestFD).fd}),doReadv:(function(stream,iov,iovcnt,offset){var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];var curr=FS.read(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr;if(curr<len)break}return ret}),doWritev:(function(stream,iov,iovcnt,offset){var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];var curr=FS.write(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr}return ret}),varargs:0,get:(function(varargs){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret}),getStr:(function(){var ret=Pointer_stringify(SYSCALLS.get());return ret}),getStreamFromFD:(function(){var stream=FS.getStream(SYSCALLS.get());if(!stream)throw new FS.ErrnoError(ERRNO_CODES.EBADF);return stream}),getSocketFromFD:(function(){var socket=SOCKFS.getSocket(SYSCALLS.get());if(!socket)throw new FS.ErrnoError(ERRNO_CODES.EBADF);return socket}),getSocketAddress:(function(allowNull){var addrp=SYSCALLS.get(),addrlen=SYSCALLS.get();if(allowNull&&addrp===0)return null;var info=__read_sockaddr(addrp,addrlen);if(info.errno)throw new FS.ErrnoError(info.errno);info.addr=DNS.lookup_addr(info.addr)||info.addr;return info}),get64:(function(){var low=SYSCALLS.get(),high=SYSCALLS.get();if(low>=0)assert(high===0);else assert(high===-1);return low}),getZero:(function(){assert(SYSCALLS.get()===0)})};function ___syscall1(which,varargs){SYSCALLS.varargs=varargs;try{var status=SYSCALLS.get();exit(status);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall10(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr();FS.unlink(path);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}var SOCKFS={mount:(function(mount){Module["websocket"]=Module["websocket"]&&"object"===typeof Module["websocket"]?Module["websocket"]:{};Module["websocket"]._callbacks={};Module["websocket"]["on"]=(function(event,callback){if("function"===typeof callback){this._callbacks[event]=callback}return this});Module["websocket"].emit=(function(event,param){if("function"===typeof this._callbacks[event]){this._callbacks[event].call(this,param)}});return FS.createNode(null,"/",16384|511,0)}),createSocket:(function(family,type,protocol){var streaming=type==1;if(protocol){assert(streaming==(protocol==6))}var sock={family:family,type:type,protocol:protocol,server:null,error:null,peers:{},pending:[],recv_queue:[],sock_ops:SOCKFS.websocket_sock_ops};var name=SOCKFS.nextname();var node=FS.createNode(SOCKFS.root,name,49152,0);node.sock=sock;var stream=FS.createStream({path:name,node:node,flags:FS.modeStringToFlags("r+"),seekable:false,stream_ops:SOCKFS.stream_ops});sock.stream=stream;return sock}),getSocket:(function(fd){var stream=FS.getStream(fd);if(!stream||!FS.isSocket(stream.node.mode)){return null}return stream.node.sock}),stream_ops:{poll:(function(stream){var sock=stream.node.sock;return sock.sock_ops.poll(sock)}),ioctl:(function(stream,request,varargs){var sock=stream.node.sock;return sock.sock_ops.ioctl(sock,request,varargs)}),read:(function(stream,buffer,offset,length,position){var sock=stream.node.sock;var msg=sock.sock_ops.recvmsg(sock,length);if(!msg){return 0}buffer.set(msg.buffer,offset);return msg.buffer.length}),write:(function(stream,buffer,offset,length,position){var sock=stream.node.sock;return sock.sock_ops.sendmsg(sock,buffer,offset,length)}),close:(function(stream){var sock=stream.node.sock;sock.sock_ops.close(sock)})},nextname:(function(){if(!SOCKFS.nextname.current){SOCKFS.nextname.current=0}return"socket["+SOCKFS.nextname.current++ +"]"}),websocket_sock_ops:{createPeer:(function(sock,addr,port){var ws;if(typeof addr==="object"){ws=addr;addr=null;port=null}if(ws){if(ws._socket){addr=ws._socket.remoteAddress;port=ws._socket.remotePort}else{var result=/ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);if(!result){throw new Error("WebSocket URL must be in the format ws(s)://address:port")}addr=result[1];port=parseInt(result[2],10)}}else{try{var runtimeConfig=Module["websocket"]&&"object"===typeof Module["websocket"];var url="ws:#".replace("#","//");if(runtimeConfig){if("string"===typeof Module["websocket"]["url"]){url=Module["websocket"]["url"]}}if(url==="ws://"||url==="wss://"){var parts=addr.split("/");url=url+parts[0]+":"+port+"/"+parts.slice(1).join("/")}var subProtocols="binary";if(runtimeConfig){if("string"===typeof Module["websocket"]["subprotocol"]){subProtocols=Module["websocket"]["subprotocol"]}}subProtocols=subProtocols.replace(/^ +| +$/g,"").split(/ *, */);var opts=ENVIRONMENT_IS_NODE?{"protocol":subProtocols.toString()}:subProtocols;if(runtimeConfig&&null===Module["websocket"]["subprotocol"]){subProtocols="null";opts=undefined}var WebSocketConstructor;if(ENVIRONMENT_IS_NODE){WebSocketConstructor=require("ws")}else if(ENVIRONMENT_IS_WEB){WebSocketConstructor=window["WebSocket"]}else{WebSocketConstructor=WebSocket}ws=new WebSocketConstructor(url,opts);ws.binaryType="arraybuffer"}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH)}}var peer={addr:addr,port:port,socket:ws,dgram_send_queue:[]};SOCKFS.websocket_sock_ops.addPeer(sock,peer);SOCKFS.websocket_sock_ops.handlePeerEvents(sock,peer);if(sock.type===2&&typeof sock.sport!=="undefined"){peer.dgram_send_queue.push(new Uint8Array([255,255,255,255,"p".charCodeAt(0),"o".charCodeAt(0),"r".charCodeAt(0),"t".charCodeAt(0),(sock.sport&65280)>>8,sock.sport&255]))}return peer}),getPeer:(function(sock,addr,port){return sock.peers[addr+":"+port]}),addPeer:(function(sock,peer){sock.peers[peer.addr+":"+peer.port]=peer}),removePeer:(function(sock,peer){delete sock.peers[peer.addr+":"+peer.port]}),handlePeerEvents:(function(sock,peer){var first=true;var handleOpen=(function(){Module["websocket"].emit("open",sock.stream.fd);try{var queued=peer.dgram_send_queue.shift();while(queued){peer.socket.send(queued);queued=peer.dgram_send_queue.shift()}}catch(e){peer.socket.close()}});function handleMessage(data){assert(typeof data!=="string"&&data.byteLength!==undefined);if(data.byteLength==0){return}data=new Uint8Array(data);var wasfirst=first;first=false;if(wasfirst&&data.length===10&&data[0]===255&&data[1]===255&&data[2]===255&&data[3]===255&&data[4]==="p".charCodeAt(0)&&data[5]==="o".charCodeAt(0)&&data[6]==="r".charCodeAt(0)&&data[7]==="t".charCodeAt(0)){var newport=data[8]<<8|data[9];SOCKFS.websocket_sock_ops.removePeer(sock,peer);peer.port=newport;SOCKFS.websocket_sock_ops.addPeer(sock,peer);return}sock.recv_queue.push({addr:peer.addr,port:peer.port,data:data});Module["websocket"].emit("message",sock.stream.fd)}if(ENVIRONMENT_IS_NODE){peer.socket.on("open",handleOpen);peer.socket.on("message",(function(data,flags){if(!flags.binary){return}handleMessage((new Uint8Array(data)).buffer)}));peer.socket.on("close",(function(){Module["websocket"].emit("close",sock.stream.fd)}));peer.socket.on("error",(function(error){sock.error=ERRNO_CODES.ECONNREFUSED;Module["websocket"].emit("error",[sock.stream.fd,sock.error,"ECONNREFUSED: Connection refused"])}))}else{peer.socket.onopen=handleOpen;peer.socket.onclose=(function(){Module["websocket"].emit("close",sock.stream.fd)});peer.socket.onmessage=function peer_socket_onmessage(event){handleMessage(event.data)};peer.socket.onerror=(function(error){sock.error=ERRNO_CODES.ECONNREFUSED;Module["websocket"].emit("error",[sock.stream.fd,sock.error,"ECONNREFUSED: Connection refused"])})}}),poll:(function(sock){if(sock.type===1&&sock.server){return sock.pending.length?64|1:0}var mask=0;var dest=sock.type===1?SOCKFS.websocket_sock_ops.getPeer(sock,sock.daddr,sock.dport):null;if(sock.recv_queue.length||!dest||dest&&dest.socket.readyState===dest.socket.CLOSING||dest&&dest.socket.readyState===dest.socket.CLOSED){mask|=64|1}if(!dest||dest&&dest.socket.readyState===dest.socket.OPEN){mask|=4}if(dest&&dest.socket.readyState===dest.socket.CLOSING||dest&&dest.socket.readyState===dest.socket.CLOSED){mask|=16}return mask}),ioctl:(function(sock,request,arg){switch(request){case 21531:var bytes=0;if(sock.recv_queue.length){bytes=sock.recv_queue[0].data.length}HEAP32[arg>>2]=bytes;return 0;default:return ERRNO_CODES.EINVAL}}),close:(function(sock){if(sock.server){try{sock.server.close()}catch(e){}sock.server=null}var peers=Object.keys(sock.peers);for(var i=0;i<peers.length;i++){var peer=sock.peers[peers[i]];try{peer.socket.close()}catch(e){}SOCKFS.websocket_sock_ops.removePeer(sock,peer)}return 0}),bind:(function(sock,addr,port){if(typeof sock.saddr!=="undefined"||typeof sock.sport!=="undefined"){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}sock.saddr=addr;sock.sport=port;if(sock.type===2){if(sock.server){sock.server.close();sock.server=null}try{sock.sock_ops.listen(sock,0)}catch(e){if(!(e instanceof FS.ErrnoError))throw e;if(e.errno!==ERRNO_CODES.EOPNOTSUPP)throw e}}}),connect:(function(sock,addr,port){if(sock.server){throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)}if(typeof sock.daddr!=="undefined"&&typeof sock.dport!=="undefined"){var dest=SOCKFS.websocket_sock_ops.getPeer(sock,sock.daddr,sock.dport);if(dest){if(dest.socket.readyState===dest.socket.CONNECTING){throw new FS.ErrnoError(ERRNO_CODES.EALREADY)}else{throw new FS.ErrnoError(ERRNO_CODES.EISCONN)}}}var peer=SOCKFS.websocket_sock_ops.createPeer(sock,addr,port);sock.daddr=peer.addr;sock.dport=peer.port;throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS)}),listen:(function(sock,backlog){if(!ENVIRONMENT_IS_NODE){throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)}if(sock.server){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var WebSocketServer=require("ws").Server;var host=sock.saddr;sock.server=new WebSocketServer({host:host,port:sock.sport});Module["websocket"].emit("listen",sock.stream.fd);sock.server.on("connection",(function(ws){if(sock.type===1){var newsock=SOCKFS.createSocket(sock.family,sock.type,sock.protocol);var peer=SOCKFS.websocket_sock_ops.createPeer(newsock,ws);newsock.daddr=peer.addr;newsock.dport=peer.port;sock.pending.push(newsock);Module["websocket"].emit("connection",newsock.stream.fd)}else{SOCKFS.websocket_sock_ops.createPeer(sock,ws);Module["websocket"].emit("connection",sock.stream.fd)}}));sock.server.on("closed",(function(){Module["websocket"].emit("close",sock.stream.fd);sock.server=null}));sock.server.on("error",(function(error){sock.error=ERRNO_CODES.EHOSTUNREACH;Module["websocket"].emit("error",[sock.stream.fd,sock.error,"EHOSTUNREACH: Host is unreachable"])}))}),accept:(function(listensock){if(!listensock.server){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var newsock=listensock.pending.shift();newsock.stream.flags=listensock.stream.flags;return newsock}),getname:(function(sock,peer){var addr,port;if(peer){if(sock.daddr===undefined||sock.dport===undefined){throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)}addr=sock.daddr;port=sock.dport}else{addr=sock.saddr||0;port=sock.sport||0}return{addr:addr,port:port}}),sendmsg:(function(sock,buffer,offset,length,addr,port){if(sock.type===2){if(addr===undefined||port===undefined){addr=sock.daddr;port=sock.dport}if(addr===undefined||port===undefined){throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ)}}else{addr=sock.daddr;port=sock.dport}var dest=SOCKFS.websocket_sock_ops.getPeer(sock,addr,port);if(sock.type===1){if(!dest||dest.socket.readyState===dest.socket.CLOSING||dest.socket.readyState===dest.socket.CLOSED){throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)}else if(dest.socket.readyState===dest.socket.CONNECTING){throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}}if(ArrayBuffer.isView(buffer)){offset+=buffer.byteOffset;buffer=buffer.buffer}var data;data=buffer.slice(offset,offset+length);if(sock.type===2){if(!dest||dest.socket.readyState!==dest.socket.OPEN){if(!dest||dest.socket.readyState===dest.socket.CLOSING||dest.socket.readyState===dest.socket.CLOSED){dest=SOCKFS.websocket_sock_ops.createPeer(sock,addr,port)}dest.dgram_send_queue.push(data);return length}}try{dest.socket.send(data);return length}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}}),recvmsg:(function(sock,length){if(sock.type===1&&sock.server){throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)}var queued=sock.recv_queue.shift();if(!queued){if(sock.type===1){var dest=SOCKFS.websocket_sock_ops.getPeer(sock,sock.daddr,sock.dport);if(!dest){throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)}else if(dest.socket.readyState===dest.socket.CLOSING||dest.socket.readyState===dest.socket.CLOSED){return null}else{throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}}else{throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}}var queuedLength=queued.data.byteLength||queued.data.length;var queuedOffset=queued.data.byteOffset||0;var queuedBuffer=queued.data.buffer||queued.data;var bytesRead=Math.min(length,queuedLength);var res={buffer:new Uint8Array(queuedBuffer,queuedOffset,bytesRead),addr:queued.addr,port:queued.port};if(sock.type===1&&bytesRead<queuedLength){var bytesRemaining=queuedLength-bytesRead;queued.data=new Uint8Array(queuedBuffer,queuedOffset+bytesRead,bytesRemaining);sock.recv_queue.unshift(queued)}return res})}};function __inet_pton4_raw(str){var b=str.split(".");for(var i=0;i<4;i++){var tmp=Number(b[i]);if(isNaN(tmp))return null;b[i]=tmp}return(b[0]|b[1]<<8|b[2]<<16|b[3]<<24)>>>0}function __inet_pton6_raw(str){var words;var w,offset,z,i;var valid6regx=/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;var parts=[];if(!valid6regx.test(str)){return null}if(str==="::"){return[0,0,0,0,0,0,0,0]}if(str.indexOf("::")===0){str=str.replace("::","Z:")}else{str=str.replace("::",":Z:")}if(str.indexOf(".")>0){str=str.replace(new RegExp("[.]","g"),":");words=str.split(":");words[words.length-4]=parseInt(words[words.length-4])+parseInt(words[words.length-3])*256;words[words.length-3]=parseInt(words[words.length-2])+parseInt(words[words.length-1])*256;words=words.slice(0,words.length-2)}else{words=str.split(":")}offset=0;z=0;for(w=0;w<words.length;w++){if(typeof words[w]==="string"){if(words[w]==="Z"){for(z=0;z<8-words.length+1;z++){parts[w+z]=0}offset=z-1}else{parts[w+offset]=_htons(parseInt(words[w],16))}}else{parts[w+offset]=words[w]}}return[parts[1]<<16|parts[0],parts[3]<<16|parts[2],parts[5]<<16|parts[4],parts[7]<<16|parts[6]]}var DNS={address_map:{id:1,addrs:{},names:{}},lookup_name:(function(name){var res=__inet_pton4_raw(name);if(res!==null){return name}res=__inet_pton6_raw(name);if(res!==null){return name}var addr;if(DNS.address_map.addrs[name]){addr=DNS.address_map.addrs[name]}else{var id=DNS.address_map.id++;assert(id<65535,"exceeded max address mappings of 65535");addr="172.29."+(id&255)+"."+(id&65280);DNS.address_map.names[addr]=name;DNS.address_map.addrs[name]=addr}return addr}),lookup_addr:(function(addr){if(DNS.address_map.names[addr]){return DNS.address_map.names[addr]}return null})};var Sockets={BUFFER_SIZE:10240,MAX_BUFFER_SIZE:10485760,nextFd:1,fds:{},nextport:1,maxport:65535,peer:null,connections:{},portmap:{},localAddr:4261412874,addrPool:[33554442,50331658,67108874,83886090,100663306,117440522,134217738,150994954,167772170,184549386,201326602,218103818,234881034]};function __inet_ntop4_raw(addr){return(addr&255)+"."+(addr>>8&255)+"."+(addr>>16&255)+"."+(addr>>24&255)}function __inet_ntop6_raw(ints){var str="";var word=0;var longest=0;var lastzero=0;var zstart=0;var len=0;var i=0;var parts=[ints[0]&65535,ints[0]>>16,ints[1]&65535,ints[1]>>16,ints[2]&65535,ints[2]>>16,ints[3]&65535,ints[3]>>16];var hasipv4=true;var v4part="";for(i=0;i<5;i++){if(parts[i]!==0){hasipv4=false;break}}if(hasipv4){v4part=__inet_ntop4_raw(parts[6]|parts[7]<<16);if(parts[5]===-1){str="::ffff:";str+=v4part;return str}if(parts[5]===0){str="::";if(v4part==="0.0.0.0")v4part="";if(v4part==="0.0.0.1")v4part="1";str+=v4part;return str}}for(word=0;word<8;word++){if(parts[word]===0){if(word-lastzero>1){len=0}lastzero=word;len++}if(len>longest){longest=len;zstart=word-longest+1}}for(word=0;word<8;word++){if(longest>1){if(parts[word]===0&&word>=zstart&&word<zstart+longest){if(word===zstart){str+=":";if(zstart===0)str+=":"}continue}}str+=Number(_ntohs(parts[word]&65535)).toString(16);str+=word<7?":":""}return str}function __read_sockaddr(sa,salen){var family=HEAP16[sa>>1];var port=_ntohs(HEAP16[sa+2>>1]);var addr;switch(family){case 2:if(salen!==16){return{errno:ERRNO_CODES.EINVAL}}addr=HEAP32[sa+4>>2];addr=__inet_ntop4_raw(addr);break;case 10:if(salen!==28){return{errno:ERRNO_CODES.EINVAL}}addr=[HEAP32[sa+8>>2],HEAP32[sa+12>>2],HEAP32[sa+16>>2],HEAP32[sa+20>>2]];addr=__inet_ntop6_raw(addr);break;default:return{errno:ERRNO_CODES.EAFNOSUPPORT}}return{family:family,addr:addr,port:port}}function __write_sockaddr(sa,family,addr,port){switch(family){case 2:addr=__inet_pton4_raw(addr);HEAP16[sa>>1]=family;HEAP32[sa+4>>2]=addr;HEAP16[sa+2>>1]=_htons(port);break;case 10:addr=__inet_pton6_raw(addr);HEAP32[sa>>2]=family;HEAP32[sa+8>>2]=addr[0];HEAP32[sa+12>>2]=addr[1];HEAP32[sa+16>>2]=addr[2];HEAP32[sa+20>>2]=addr[3];HEAP16[sa+2>>1]=_htons(port);HEAP32[sa+4>>2]=0;HEAP32[sa+24>>2]=0;break;default:return{errno:ERRNO_CODES.EAFNOSUPPORT}}return{}}function ___syscall102(which,varargs){SYSCALLS.varargs=varargs;try{var call=SYSCALLS.get(),socketvararg=SYSCALLS.get();SYSCALLS.varargs=socketvararg;switch(call){case 1:{var domain=SYSCALLS.get(),type=SYSCALLS.get(),protocol=SYSCALLS.get();var sock=SOCKFS.createSocket(domain,type,protocol);assert(sock.stream.fd<64);return sock.stream.fd};case 2:{var sock=SYSCALLS.getSocketFromFD(),info=SYSCALLS.getSocketAddress();sock.sock_ops.bind(sock,info.addr,info.port);return 0};case 3:{var sock=SYSCALLS.getSocketFromFD(),info=SYSCALLS.getSocketAddress();sock.sock_ops.connect(sock,info.addr,info.port);return 0};case 4:{var sock=SYSCALLS.getSocketFromFD(),backlog=SYSCALLS.get();sock.sock_ops.listen(sock,backlog);return 0};case 5:{var sock=SYSCALLS.getSocketFromFD(),addr=SYSCALLS.get(),addrlen=SYSCALLS.get();var newsock=sock.sock_ops.accept(sock);if(addr){var res=__write_sockaddr(addr,newsock.family,DNS.lookup_name(newsock.daddr),newsock.dport);assert(!res.errno)}return newsock.stream.fd};case 6:{var sock=SYSCALLS.getSocketFromFD(),addr=SYSCALLS.get(),addrlen=SYSCALLS.get();var res=__write_sockaddr(addr,sock.family,DNS.lookup_name(sock.saddr||"0.0.0.0"),sock.sport);assert(!res.errno);return 0};case 7:{var sock=SYSCALLS.getSocketFromFD(),addr=SYSCALLS.get(),addrlen=SYSCALLS.get();if(!sock.daddr){return-ERRNO_CODES.ENOTCONN}var res=__write_sockaddr(addr,sock.family,DNS.lookup_name(sock.daddr),sock.dport);assert(!res.errno);return 0};case 11:{var sock=SYSCALLS.getSocketFromFD(),message=SYSCALLS.get(),length=SYSCALLS.get(),flags=SYSCALLS.get(),dest=SYSCALLS.getSocketAddress(true);if(!dest){return FS.write(sock.stream,HEAP8,message,length)}else{return sock.sock_ops.sendmsg(sock,HEAP8,message,length,dest.addr,dest.port)}};case 12:{var sock=SYSCALLS.getSocketFromFD(),buf=SYSCALLS.get(),len=SYSCALLS.get(),flags=SYSCALLS.get(),addr=SYSCALLS.get(),addrlen=SYSCALLS.get();var msg=sock.sock_ops.recvmsg(sock,len);if(!msg)return 0;if(addr){var res=__write_sockaddr(addr,sock.family,DNS.lookup_name(msg.addr),msg.port);assert(!res.errno)}HEAPU8.set(msg.buffer,buf);return msg.buffer.byteLength};case 14:{return-ERRNO_CODES.ENOPROTOOPT};case 15:{var sock=SYSCALLS.getSocketFromFD(),level=SYSCALLS.get(),optname=SYSCALLS.get(),optval=SYSCALLS.get(),optlen=SYSCALLS.get();if(level===1){if(optname===4){HEAP32[optval>>2]=sock.error;HEAP32[optlen>>2]=4;sock.error=null;return 0}}return-ERRNO_CODES.ENOPROTOOPT};case 16:{var sock=SYSCALLS.getSocketFromFD(),message=SYSCALLS.get(),flags=SYSCALLS.get();var iov=HEAP32[message+8>>2];var num=HEAP32[message+12>>2];var addr,port;var name=HEAP32[message>>2];var namelen=HEAP32[message+4>>2];if(name){var info=__read_sockaddr(name,namelen);if(info.errno)return-info.errno;port=info.port;addr=DNS.lookup_addr(info.addr)||info.addr}var total=0;for(var i=0;i<num;i++){total+=HEAP32[iov+(8*i+4)>>2]}var view=new Uint8Array(total);var offset=0;for(var i=0;i<num;i++){var iovbase=HEAP32[iov+(8*i+0)>>2];var iovlen=HEAP32[iov+(8*i+4)>>2];for(var j=0;j<iovlen;j++){view[offset++]=HEAP8[iovbase+j>>0]}}return sock.sock_ops.sendmsg(sock,view,0,total,addr,port)};case 17:{var sock=SYSCALLS.getSocketFromFD(),message=SYSCALLS.get(),flags=SYSCALLS.get();var iov=HEAP32[message+8>>2];var num=HEAP32[message+12>>2];var total=0;for(var i=0;i<num;i++){total+=HEAP32[iov+(8*i+4)>>2]}var msg=sock.sock_ops.recvmsg(sock,total);if(!msg)return 0;var name=HEAP32[message>>2];if(name){var res=__write_sockaddr(name,sock.family,DNS.lookup_name(msg.addr),msg.port);assert(!res.errno)}var bytesRead=0;var bytesRemaining=msg.buffer.byteLength;for(var i=0;bytesRemaining>0&&i<num;i++){var iovbase=HEAP32[iov+(8*i+0)>>2];var iovlen=HEAP32[iov+(8*i+4)>>2];if(!iovlen){continue}var length=Math.min(iovlen,bytesRemaining);var buf=msg.buffer.subarray(bytesRead,bytesRead+length);HEAPU8.set(buf,iovbase+bytesRead);bytesRead+=length;bytesRemaining-=length}return bytesRead};default:abort("unsupported socketcall syscall "+call)}}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall114(which,varargs){SYSCALLS.varargs=varargs;try{abort("cannot wait on child processes")}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall118(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD();return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall12(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr();FS.chdir(path);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall121(which,varargs){SYSCALLS.varargs=varargs;try{return-ERRNO_CODES.EPERM}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall122(which,varargs){SYSCALLS.varargs=varargs;try{var buf=SYSCALLS.get();if(!buf)return-ERRNO_CODES.EFAULT;var layout={"sysname":0,"nodename":65,"domainname":325,"machine":260,"version":195,"release":130,"__size__":390};function copyString(element,value){var offset=layout[element];writeAsciiToMemory(value,buf+offset)}copyString("sysname","Emscripten");copyString("nodename","emscripten");copyString("release","1.0");copyString("version","#1");copyString("machine","x86-JS");return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall125(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}var PROCINFO={ppid:1,pid:42,sid:42,pgid:42};function ___syscall132(which,varargs){SYSCALLS.varargs=varargs;try{var pid=SYSCALLS.get();if(pid&&pid!==PROCINFO.pid)return-ERRNO_CODES.ESRCH;return PROCINFO.pgid}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall133(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD();FS.chdir(stream.path);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall14(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),mode=SYSCALLS.get(),dev=SYSCALLS.get();return SYSCALLS.doMknod(path,mode,dev)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall140(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),offset_high=SYSCALLS.get(),offset_low=SYSCALLS.get(),result=SYSCALLS.get(),whence=SYSCALLS.get();var offset=offset_low;FS.llseek(stream,offset,whence);HEAP32[result>>2]=stream.position;if(stream.getdents&&offset===0&&whence===0)stream.getdents=null;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall142(which,varargs){SYSCALLS.varargs=varargs;try{var nfds=SYSCALLS.get(),readfds=SYSCALLS.get(),writefds=SYSCALLS.get(),exceptfds=SYSCALLS.get(),timeout=SYSCALLS.get();assert(nfds<=64,"nfds must be less than or equal to 64");assert(!exceptfds,"exceptfds not supported");var total=0;var srcReadLow=readfds?HEAP32[readfds>>2]:0,srcReadHigh=readfds?HEAP32[readfds+4>>2]:0;var srcWriteLow=writefds?HEAP32[writefds>>2]:0,srcWriteHigh=writefds?HEAP32[writefds+4>>2]:0;var srcExceptLow=exceptfds?HEAP32[exceptfds>>2]:0,srcExceptHigh=exceptfds?HEAP32[exceptfds+4>>2]:0;var dstReadLow=0,dstReadHigh=0;var dstWriteLow=0,dstWriteHigh=0;var dstExceptLow=0,dstExceptHigh=0;var allLow=(readfds?HEAP32[readfds>>2]:0)|(writefds?HEAP32[writefds>>2]:0)|(exceptfds?HEAP32[exceptfds>>2]:0);var allHigh=(readfds?HEAP32[readfds+4>>2]:0)|(writefds?HEAP32[writefds+4>>2]:0)|(exceptfds?HEAP32[exceptfds+4>>2]:0);function check(fd,low,high,val){return fd<32?low&val:high&val}for(var fd=0;fd<nfds;fd++){var mask=1<<fd%32;if(!check(fd,allLow,allHigh,mask)){continue}var stream=FS.getStream(fd);if(!stream)throw new FS.ErrnoError(ERRNO_CODES.EBADF);var flags=SYSCALLS.DEFAULT_POLLMASK;if(stream.stream_ops.poll){flags=stream.stream_ops.poll(stream)}if(flags&1&&check(fd,srcReadLow,srcReadHigh,mask)){fd<32?dstReadLow=dstReadLow|mask:dstReadHigh=dstReadHigh|mask;total++}if(flags&4&&check(fd,srcWriteLow,srcWriteHigh,mask)){fd<32?dstWriteLow=dstWriteLow|mask:dstWriteHigh=dstWriteHigh|mask;total++}if(flags&2&&check(fd,srcExceptLow,srcExceptHigh,mask)){fd<32?dstExceptLow=dstExceptLow|mask:dstExceptHigh=dstExceptHigh|mask;total++}}if(readfds){HEAP32[readfds>>2]=dstReadLow;HEAP32[readfds+4>>2]=dstReadHigh}if(writefds){HEAP32[writefds>>2]=dstWriteLow;HEAP32[writefds+4>>2]=dstWriteHigh}if(exceptfds){HEAP32[exceptfds>>2]=dstExceptLow;HEAP32[exceptfds+4>>2]=dstExceptHigh}return total}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall144(which,varargs){SYSCALLS.varargs=varargs;try{var addr=SYSCALLS.get(),len=SYSCALLS.get(),flags=SYSCALLS.get();var info=SYSCALLS.mappings[addr];if(!info)return 0;SYSCALLS.doMsync(addr,FS.getStream(info.fd),len,info.flags);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall145(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get();return SYSCALLS.doReadv(stream,iov,iovcnt)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall146(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get();return SYSCALLS.doWritev(stream,iov,iovcnt)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall147(which,varargs){SYSCALLS.varargs=varargs;try{var pid=SYSCALLS.get();if(pid&&pid!==PROCINFO.pid)return-ERRNO_CODES.ESRCH;return PROCINFO.sid}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall148(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD();return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall15(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),mode=SYSCALLS.get();FS.chmod(path,mode);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall153(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall150(){return ___syscall153.apply(null,arguments)}function ___syscall151(){return ___syscall153.apply(null,arguments)}function ___syscall152(){return ___syscall153.apply(null,arguments)}function ___syscall163(which,varargs){SYSCALLS.varargs=varargs;try{return-ERRNO_CODES.ENOMEM}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall168(which,varargs){SYSCALLS.varargs=varargs;try{var fds=SYSCALLS.get(),nfds=SYSCALLS.get(),timeout=SYSCALLS.get();var nonzero=0;for(var i=0;i<nfds;i++){var pollfd=fds+8*i;var fd=HEAP32[pollfd>>2];var events=HEAP16[pollfd+4>>1];var mask=32;var stream=FS.getStream(fd);if(stream){mask=SYSCALLS.DEFAULT_POLLMASK;if(stream.stream_ops.poll){mask=stream.stream_ops.poll(stream)}}mask&=events|8|16;if(mask)nonzero++;HEAP16[pollfd+6>>1]=mask}return nonzero}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall180(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),buf=SYSCALLS.get(),count=SYSCALLS.get(),zero=SYSCALLS.getZero(),offset=SYSCALLS.get64();return FS.read(stream,HEAP8,buf,count,offset)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall181(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),buf=SYSCALLS.get(),count=SYSCALLS.get(),zero=SYSCALLS.getZero(),offset=SYSCALLS.get64();return FS.write(stream,HEAP8,buf,count,offset)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall183(which,varargs){SYSCALLS.varargs=varargs;try{var buf=SYSCALLS.get(),size=SYSCALLS.get();if(size===0)return-ERRNO_CODES.EINVAL;var cwd=FS.cwd();var cwdLengthInBytes=lengthBytesUTF8(cwd);if(size<cwdLengthInBytes+1)return-ERRNO_CODES.ERANGE;stringToUTF8(cwd,buf,size);return buf}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall191(which,varargs){SYSCALLS.varargs=varargs;try{var resource=SYSCALLS.get(),rlim=SYSCALLS.get();HEAP32[rlim>>2]=-1;HEAP32[rlim+4>>2]=-1;HEAP32[rlim+8>>2]=-1;HEAP32[rlim+12>>2]=-1;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall192(which,varargs){SYSCALLS.varargs=varargs;try{var addr=SYSCALLS.get(),len=SYSCALLS.get(),prot=SYSCALLS.get(),flags=SYSCALLS.get(),fd=SYSCALLS.get(),off=SYSCALLS.get();off<<=12;var ptr;var allocated=false;if(fd===-1){ptr=_memalign(PAGE_SIZE,len);if(!ptr)return-ERRNO_CODES.ENOMEM;_memset(ptr,0,len);allocated=true}else{var info=FS.getStream(fd);if(!info)return-ERRNO_CODES.EBADF;var res=FS.mmap(info,HEAPU8,addr,len,off,prot,flags);ptr=res.ptr;allocated=res.allocated}SYSCALLS.mappings[ptr]={malloc:ptr,len:len,allocated:allocated,fd:fd,flags:flags};return ptr}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall193(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),zero=SYSCALLS.getZero(),length=SYSCALLS.get64();FS.truncate(path,length);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall194(which,varargs){SYSCALLS.varargs=varargs;try{var fd=SYSCALLS.get(),zero=SYSCALLS.getZero(),length=SYSCALLS.get64();FS.ftruncate(fd,length);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall195(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),buf=SYSCALLS.get();return SYSCALLS.doStat(FS.stat,path,buf)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall196(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),buf=SYSCALLS.get();return SYSCALLS.doStat(FS.lstat,path,buf)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall197(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),buf=SYSCALLS.get();return SYSCALLS.doStat(FS.stat,stream.path,buf)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall198(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),owner=SYSCALLS.get(),group=SYSCALLS.get();FS.chown(path,owner,group);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall202(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall199(){return ___syscall202.apply(null,arguments)}function ___syscall20(which,varargs){SYSCALLS.varargs=varargs;try{return PROCINFO.pid}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall200(){return ___syscall202.apply(null,arguments)}function ___syscall201(){return ___syscall202.apply(null,arguments)}function ___syscall214(which,varargs){SYSCALLS.varargs=varargs;try{var uid=SYSCALLS.get();if(uid!==0)return-ERRNO_CODES.EPERM;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall203(){return ___syscall214.apply(null,arguments)}function ___syscall204(){return ___syscall214.apply(null,arguments)}function ___syscall205(which,varargs){SYSCALLS.varargs=varargs;try{var size=SYSCALLS.get(),list=SYSCALLS.get();if(size<1)return-ERRNO_CODES.EINVAL;HEAP32[list>>2]=0;return 1}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall207(which,varargs){SYSCALLS.varargs=varargs;try{var fd=SYSCALLS.get(),owner=SYSCALLS.get(),group=SYSCALLS.get();FS.fchown(fd,owner,group);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall211(which,varargs){SYSCALLS.varargs=varargs;try{var ruid=SYSCALLS.get(),euid=SYSCALLS.get(),suid=SYSCALLS.get();HEAP32[ruid>>2]=0;HEAP32[euid>>2]=0;HEAP32[suid>>2]=0;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall209(){return ___syscall211.apply(null,arguments)}function ___syscall212(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),owner=SYSCALLS.get(),group=SYSCALLS.get();FS.chown(path,owner,group);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall218(which,varargs){SYSCALLS.varargs=varargs;try{return-ERRNO_CODES.ENOSYS}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall219(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall220(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),dirp=SYSCALLS.get(),count=SYSCALLS.get();if(!stream.getdents){stream.getdents=FS.readdir(stream.path)}var pos=0;while(stream.getdents.length>0&&pos+268<=count){var id;var type;var name=stream.getdents.pop();if(name[0]==="."){id=1;type=4}else{var child=FS.lookupNode(stream.node,name);id=child.id;type=FS.isChrdev(child.mode)?2:FS.isDir(child.mode)?4:FS.isLink(child.mode)?10:8}HEAP32[dirp+pos>>2]=id;HEAP32[dirp+pos+4>>2]=stream.position;HEAP16[dirp+pos+8>>1]=268;HEAP8[dirp+pos+10>>0]=type;stringToUTF8(name,dirp+pos+11,256);pos+=268}return pos}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall221(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),cmd=SYSCALLS.get();switch(cmd){case 0:{var arg=SYSCALLS.get();if(arg<0){return-ERRNO_CODES.EINVAL}var newStream;newStream=FS.open(stream.path,stream.flags,0,arg);return newStream.fd};case 1:case 2:return 0;case 3:return stream.flags;case 4:{var arg=SYSCALLS.get();stream.flags|=arg;return 0};case 12:case 12:{var arg=SYSCALLS.get();var offset=0;HEAP16[arg+offset>>1]=2;return 0};case 13:case 14:case 13:case 14:return 0;case 16:case 8:return-ERRNO_CODES.EINVAL;case 9:___setErrNo(ERRNO_CODES.EINVAL);return-1;default:{return-ERRNO_CODES.EINVAL}}}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall268(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),size=SYSCALLS.get(),buf=SYSCALLS.get();assert(size===64);HEAP32[buf+4>>2]=4096;HEAP32[buf+40>>2]=4096;HEAP32[buf+8>>2]=1e6;HEAP32[buf+12>>2]=5e5;HEAP32[buf+16>>2]=5e5;HEAP32[buf+20>>2]=FS.nextInode;HEAP32[buf+24>>2]=1e6;HEAP32[buf+28>>2]=42;HEAP32[buf+44>>2]=2;HEAP32[buf+36>>2]=255;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall269(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),size=SYSCALLS.get(),buf=SYSCALLS.get();return ___syscall([268,0,size,buf],0)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall272(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall29(which,varargs){SYSCALLS.varargs=varargs;try{return-ERRNO_CODES.EINTR}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall295(which,varargs){SYSCALLS.varargs=varargs;try{var dirfd=SYSCALLS.get(),path=SYSCALLS.getStr(),flags=SYSCALLS.get(),mode=SYSCALLS.get();path=SYSCALLS.calculateAt(dirfd,path);return FS.open(path,flags,mode).fd}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall296(which,varargs){SYSCALLS.varargs=varargs;try{var dirfd=SYSCALLS.get(),path=SYSCALLS.getStr(),mode=SYSCALLS.get();path=SYSCALLS.calculateAt(dirfd,path);return SYSCALLS.doMkdir(path,mode)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall297(which,varargs){SYSCALLS.varargs=varargs;try{var dirfd=SYSCALLS.get(),path=SYSCALLS.getStr(),mode=SYSCALLS.get(),dev=SYSCALLS.get();path=SYSCALLS.calculateAt(dirfd,path);return SYSCALLS.doMknod(path,mode,dev)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall298(which,varargs){SYSCALLS.varargs=varargs;try{var dirfd=SYSCALLS.get(),path=SYSCALLS.getStr(),owner=SYSCALLS.get(),group=SYSCALLS.get(),flags=SYSCALLS.get();assert(flags===0);path=SYSCALLS.calculateAt(dirfd,path);FS.chown(path,owner,group);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall3(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),buf=SYSCALLS.get(),count=SYSCALLS.get();return FS.read(stream,HEAP8,buf,count)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall300(which,varargs){SYSCALLS.varargs=varargs;try{var dirfd=SYSCALLS.get(),path=SYSCALLS.getStr(),buf=SYSCALLS.get(),flags=SYSCALLS.get();var nofollow=flags&256;flags=flags&~256;assert(!flags,flags);path=SYSCALLS.calculateAt(dirfd,path);return SYSCALLS.doStat(nofollow?FS.lstat:FS.stat,path,buf)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall301(which,varargs){SYSCALLS.varargs=varargs;try{var dirfd=SYSCALLS.get(),path=SYSCALLS.getStr(),flags=SYSCALLS.get();path=SYSCALLS.calculateAt(dirfd,path);if(flags===0){FS.unlink(path)}else if(flags===512){FS.rmdir(path)}else{abort("Invalid flags passed to unlinkat")}return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall302(which,varargs){SYSCALLS.varargs=varargs;try{var olddirfd=SYSCALLS.get(),oldpath=SYSCALLS.getStr(),newdirfd=SYSCALLS.get(),newpath=SYSCALLS.getStr();oldpath=SYSCALLS.calculateAt(olddirfd,oldpath);newpath=SYSCALLS.calculateAt(newdirfd,newpath);FS.rename(oldpath,newpath);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall303(which,varargs){SYSCALLS.varargs=varargs;try{return-ERRNO_CODES.EMLINK}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall304(which,varargs){SYSCALLS.varargs=varargs;try{var target=SYSCALLS.get(),newdirfd=SYSCALLS.get(),linkpath=SYSCALLS.get();linkpath=SYSCALLS.calculateAt(newdirfd,linkpath);FS.symlink(target,linkpath);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall305(which,varargs){SYSCALLS.varargs=varargs;try{var dirfd=SYSCALLS.get(),path=SYSCALLS.getStr(),buf=SYSCALLS.get(),bufsize=SYSCALLS.get();path=SYSCALLS.calculateAt(dirfd,path);return SYSCALLS.doReadlink(path,buf,bufsize)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall306(which,varargs){SYSCALLS.varargs=varargs;try{var dirfd=SYSCALLS.get(),path=SYSCALLS.getStr(),mode=SYSCALLS.get(),flags=SYSCALLS.get();assert(flags===0);path=SYSCALLS.calculateAt(dirfd,path);FS.chmod(path,mode);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall307(which,varargs){SYSCALLS.varargs=varargs;try{var dirfd=SYSCALLS.get(),path=SYSCALLS.getStr(),amode=SYSCALLS.get(),flags=SYSCALLS.get();assert(flags===0);path=SYSCALLS.calculateAt(dirfd,path);return SYSCALLS.doAccess(path,amode)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall308(which,varargs){SYSCALLS.varargs=varargs;try{return-ERRNO_CODES.ENOSYS}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall320(which,varargs){SYSCALLS.varargs=varargs;try{var dirfd=SYSCALLS.get(),path=SYSCALLS.getStr(),times=SYSCALLS.get(),flags=SYSCALLS.get();assert(flags===0);path=SYSCALLS.calculateAt(dirfd,path);var seconds=HEAP32[times>>2];var nanoseconds=HEAP32[times+4>>2];var atime=seconds*1e3+nanoseconds/(1e3*1e3);times+=8;seconds=HEAP32[times>>2];nanoseconds=HEAP32[times+4>>2];var mtime=seconds*1e3+nanoseconds/(1e3*1e3);FS.utime(path,atime,mtime);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall324(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),mode=SYSCALLS.get(),offset=SYSCALLS.get64(),len=SYSCALLS.get64();assert(mode===0);FS.allocate(stream,offset,len);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall33(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),amode=SYSCALLS.get();return SYSCALLS.doAccess(path,amode)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall330(which,varargs){SYSCALLS.varargs=varargs;try{var old=SYSCALLS.getStreamFromFD(),suggestFD=SYSCALLS.get(),flags=SYSCALLS.get();assert(!flags);if(old.fd===suggestFD)return-ERRNO_CODES.EINVAL;return SYSCALLS.doDup(old.path,old.flags,suggestFD)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall331(which,varargs){SYSCALLS.varargs=varargs;try{return-ERRNO_CODES.ENOSYS}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall333(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get(),offset=SYSCALLS.get();return SYSCALLS.doReadv(stream,iov,iovcnt,offset)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall334(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get(),offset=SYSCALLS.get();return SYSCALLS.doWritev(stream,iov,iovcnt,offset)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall337(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall34(which,varargs){SYSCALLS.varargs=varargs;try{var inc=SYSCALLS.get();return-ERRNO_CODES.EPERM}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall340(which,varargs){SYSCALLS.varargs=varargs;try{var pid=SYSCALLS.get(),resource=SYSCALLS.get(),new_limit=SYSCALLS.get(),old_limit=SYSCALLS.get();if(old_limit){HEAP32[old_limit>>2]=-1;HEAP32[old_limit+4>>2]=-1;HEAP32[old_limit+8>>2]=-1;HEAP32[old_limit+12>>2]=-1}return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall345(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall36(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall38(which,varargs){SYSCALLS.varargs=varargs;try{var old_path=SYSCALLS.getStr(),new_path=SYSCALLS.getStr();FS.rename(old_path,new_path);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall39(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),mode=SYSCALLS.get();return SYSCALLS.doMkdir(path,mode)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall4(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),buf=SYSCALLS.get(),count=SYSCALLS.get();return FS.write(stream,HEAP8,buf,count)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall40(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr();FS.rmdir(path);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall41(which,varargs){SYSCALLS.varargs=varargs;try{var old=SYSCALLS.getStreamFromFD();return FS.open(old.path,old.flags,0).fd}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}var PIPEFS={BUCKET_BUFFER_SIZE:8192,mount:(function(mount){return FS.createNode(null,"/",16384|511,0)}),createPipe:(function(){var pipe={buckets:[]};pipe.buckets.push({buffer:new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),offset:0,roffset:0});var rName=PIPEFS.nextname();var wName=PIPEFS.nextname();var rNode=FS.createNode(PIPEFS.root,rName,4096,0);var wNode=FS.createNode(PIPEFS.root,wName,4096,0);rNode.pipe=pipe;wNode.pipe=pipe;var readableStream=FS.createStream({path:rName,node:rNode,flags:FS.modeStringToFlags("r"),seekable:false,stream_ops:PIPEFS.stream_ops});rNode.stream=readableStream;var writableStream=FS.createStream({path:wName,node:wNode,flags:FS.modeStringToFlags("w"),seekable:false,stream_ops:PIPEFS.stream_ops});wNode.stream=writableStream;return{readable_fd:readableStream.fd,writable_fd:writableStream.fd}}),stream_ops:{poll:(function(stream){var pipe=stream.node.pipe;if((stream.flags&2097155)===1){return 256|4}else{if(pipe.buckets.length>0){for(var i=0;i<pipe.buckets.length;i++){var bucket=pipe.buckets[i];if(bucket.offset-bucket.roffset>0){return 64|1}}}}return 0}),ioctl:(function(stream,request,varargs){return ERRNO_CODES.EINVAL}),read:(function(stream,buffer,offset,length,position){var pipe=stream.node.pipe;var currentLength=0;for(var i=0;i<pipe.buckets.length;i++){var bucket=pipe.buckets[i];currentLength+=bucket.offset-bucket.roffset}assert(buffer instanceof ArrayBuffer||ArrayBuffer.isView(buffer));var data=buffer.subarray(offset,offset+length);if(length<=0){return 0}if(currentLength==0){throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}var toRead=Math.min(currentLength,length);var totalRead=toRead;var toRemove=0;for(var i=0;i<pipe.buckets.length;i++){var currBucket=pipe.buckets[i];var bucketSize=currBucket.offset-currBucket.roffset;if(toRead<=bucketSize){var tmpSlice=currBucket.buffer.subarray(currBucket.roffset,currBucket.offset);if(toRead<bucketSize){tmpSlice=tmpSlice.subarray(0,toRead);currBucket.roffset+=toRead}else{toRemove++}data.set(tmpSlice);break}else{var tmpSlice=currBucket.buffer.subarray(currBucket.roffset,currBucket.offset);data.set(tmpSlice);data=data.subarray(tmpSlice.byteLength);toRead-=tmpSlice.byteLength;toRemove++}}if(toRemove&&toRemove==pipe.buckets.length){toRemove--;pipe.buckets[toRemove].offset=0;pipe.buckets[toRemove].roffset=0}pipe.buckets.splice(0,toRemove);return totalRead}),write:(function(stream,buffer,offset,length,position){var pipe=stream.node.pipe;assert(buffer instanceof ArrayBuffer||ArrayBuffer.isView(buffer));var data=buffer.subarray(offset,offset+length);var dataLen=data.byteLength;if(dataLen<=0){return 0}var currBucket=null;if(pipe.buckets.length==0){currBucket={buffer:new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),offset:0,roffset:0};pipe.buckets.push(currBucket)}else{currBucket=pipe.buckets[pipe.buckets.length-1]}assert(currBucket.offset<=PIPEFS.BUCKET_BUFFER_SIZE);var freeBytesInCurrBuffer=PIPEFS.BUCKET_BUFFER_SIZE-currBucket.offset;if(freeBytesInCurrBuffer>=dataLen){currBucket.buffer.set(data,currBucket.offset);currBucket.offset+=dataLen;return dataLen}else if(freeBytesInCurrBuffer>0){currBucket.buffer.set(data.subarray(0,freeBytesInCurrBuffer),currBucket.offset);currBucket.offset+=freeBytesInCurrBuffer;data=data.subarray(freeBytesInCurrBuffer,data.byteLength)}var numBuckets=data.byteLength/PIPEFS.BUCKET_BUFFER_SIZE|0;var remElements=data.byteLength%PIPEFS.BUCKET_BUFFER_SIZE;for(var i=0;i<numBuckets;i++){var newBucket={buffer:new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),offset:PIPEFS.BUCKET_BUFFER_SIZE,roffset:0};pipe.buckets.push(newBucket);newBucket.buffer.set(data.subarray(0,PIPEFS.BUCKET_BUFFER_SIZE));data=data.subarray(PIPEFS.BUCKET_BUFFER_SIZE,data.byteLength)}if(remElements>0){var newBucket={buffer:new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),offset:data.byteLength,roffset:0};pipe.buckets.push(newBucket);newBucket.buffer.set(data)}return dataLen}),close:(function(stream){var pipe=stream.node.pipe;pipe.buckets=null})},nextname:(function(){if(!PIPEFS.nextname.current){PIPEFS.nextname.current=0}return"pipe["+PIPEFS.nextname.current++ +"]"})};function ___syscall42(which,varargs){SYSCALLS.varargs=varargs;try{var fdPtr=SYSCALLS.get();if(fdPtr==0){throw new FS.ErrnoError(ERRNO_CODES.EFAULT)}var res=PIPEFS.createPipe();HEAP32[fdPtr>>2]=res.readable_fd;HEAP32[fdPtr+4>>2]=res.writable_fd;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall5(which,varargs){SYSCALLS.varargs=varargs;try{var pathname=SYSCALLS.getStr(),flags=SYSCALLS.get(),mode=SYSCALLS.get();var stream=FS.open(pathname,flags,mode);return stream.fd}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall51(which,varargs){SYSCALLS.varargs=varargs;try{return-ERRNO_CODES.ENOSYS}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall54(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),op=SYSCALLS.get();switch(op){case 21509:case 21505:{if(!stream.tty)return-ERRNO_CODES.ENOTTY;return 0};case 21510:case 21511:case 21512:case 21506:case 21507:case 21508:{if(!stream.tty)return-ERRNO_CODES.ENOTTY;return 0};case 21519:{if(!stream.tty)return-ERRNO_CODES.ENOTTY;var argp=SYSCALLS.get();HEAP32[argp>>2]=0;return 0};case 21520:{if(!stream.tty)return-ERRNO_CODES.ENOTTY;return-ERRNO_CODES.EINVAL};case 21531:{var argp=SYSCALLS.get();return FS.ioctl(stream,op,argp)};case 21523:{if(!stream.tty)return-ERRNO_CODES.ENOTTY;return 0};case 21524:{if(!stream.tty)return-ERRNO_CODES.ENOTTY;return 0};default:abort("bad ioctl syscall "+op)}}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall57(which,varargs){SYSCALLS.varargs=varargs;try{var pid=SYSCALLS.get(),pgid=SYSCALLS.get();if(pid&&pid!==PROCINFO.pid)return-ERRNO_CODES.ESRCH;if(pgid&&pgid!==PROCINFO.pgid)return-ERRNO_CODES.EPERM;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall6(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD();FS.close(stream);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall60(which,varargs){SYSCALLS.varargs=varargs;try{var mask=SYSCALLS.get();var old=SYSCALLS.umask;SYSCALLS.umask=mask;return old}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall63(which,varargs){SYSCALLS.varargs=varargs;try{var old=SYSCALLS.getStreamFromFD(),suggestFD=SYSCALLS.get();if(old.fd===suggestFD)return suggestFD;return SYSCALLS.doDup(old.path,old.flags,suggestFD)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall64(which,varargs){SYSCALLS.varargs=varargs;try{return PROCINFO.ppid}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall66(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall75(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall77(which,varargs){SYSCALLS.varargs=varargs;try{var who=SYSCALLS.get(),usage=SYSCALLS.get();_memset(usage,0,136);HEAP32[usage>>2]=1;HEAP32[usage+4>>2]=2;HEAP32[usage+8>>2]=3;HEAP32[usage+12>>2]=4;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall83(which,varargs){SYSCALLS.varargs=varargs;try{var target=SYSCALLS.getStr(),linkpath=SYSCALLS.getStr();FS.symlink(target,linkpath);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall85(which,varargs){SYSCALLS.varargs=varargs;try{var path=SYSCALLS.getStr(),buf=SYSCALLS.get(),bufsize=SYSCALLS.get();return SYSCALLS.doReadlink(path,buf,bufsize)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall9(which,varargs){SYSCALLS.varargs=varargs;try{var oldpath=SYSCALLS.get(),newpath=SYSCALLS.get();return-ERRNO_CODES.EMLINK}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall91(which,varargs){SYSCALLS.varargs=varargs;try{var addr=SYSCALLS.get(),len=SYSCALLS.get();var info=SYSCALLS.mappings[addr];if(!info)return 0;if(len===info.len){var stream=FS.getStream(info.fd);SYSCALLS.doMsync(addr,stream,len,info.flags);FS.munmap(stream);SYSCALLS.mappings[addr]=null;if(info.allocated){_free(info.malloc)}}return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall94(which,varargs){SYSCALLS.varargs=varargs;try{var fd=SYSCALLS.get(),mode=SYSCALLS.get();FS.fchmod(fd,mode);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall96(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall97(which,varargs){SYSCALLS.varargs=varargs;try{return-ERRNO_CODES.EPERM}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___unlock(){}function ___wait(){}function __exit(status){exit(status)}function _abort(){Module["abort"]()}function _clock(){if(_clock.start===undefined)_clock.start=Date.now();return(Date.now()-_clock.start)*(1e6/1e3)|0}function _decrypt(bufIn,sizeIn,bufOut,sizeOut){var handler=Module.Client.getDecryptionHandler();if(handler&&Module._dvlDerivedKey){var iv=Module.HEAPU8.subarray(bufIn,bufIn+16);var input=Module.HEAPU8.subarray(bufIn+16,bufIn+sizeIn);var decrypted=handler.decrypt(Module._dvlDerivedKey,iv,input);if(decrypted&&decrypted.length!==0&&decrypted.length<=sizeOut){Module.HEAPU8.set(decrypted,bufOut);return decrypted.length}}return 0}function _derive_key(salt,password){var handler=Module.Client.getDecryptionHandler();if(handler){var saltArray=Module.HEAPU8.subarray(salt,salt+16);var passwordArray=Module.HEAPU8.subarray(password,password+Module._strlen(password));Module._dvlDerivedKey=handler.deriveKey(saltArray,passwordArray);return!!Module._dvlDerivedKey}return false}var DLFCN={error:null,errorMsg:null,loadedLibs:{},loadedLibNames:{}};function _dlclose(handle){if(!DLFCN.loadedLibs[handle]){DLFCN.errorMsg="Tried to dlclose() unopened handle: "+handle;return 1}else{var lib_record=DLFCN.loadedLibs[handle];if(--lib_record.refcount==0){if(lib_record.module.cleanups){lib_record.module.cleanups.forEach((function(cleanup){cleanup()}))}delete DLFCN.loadedLibNames[lib_record.name];delete DLFCN.loadedLibs[handle]}return 0}}function _dlerror(){if(DLFCN.errorMsg===null){return 0}else{if(DLFCN.error)_free(DLFCN.error);var msgArr=intArrayFromString(DLFCN.errorMsg);DLFCN.error=allocate(msgArr,"i8",ALLOC_NORMAL);DLFCN.errorMsg=null;return DLFCN.error}}function _dlopen(filenameAddr,flag){abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/kripken/emscripten/wiki/Linking");var searchpaths=[];var filename;if(filenameAddr===0){filename="__self__"}else{filename=Pointer_stringify(filenameAddr);var isValidFile=(function(filename){var target=FS.findObject(filename);return target&&!target.isFolder&&!target.isDevice});if(!isValidFile(filename)){if(ENV["LD_LIBRARY_PATH"]){searchpaths=ENV["LD_LIBRARY_PATH"].split(":")}for(var ident in searchpaths){var searchfile=PATH.join2(searchpaths[ident],filename);if(isValidFile(searchfile)){filename=searchfile;break}}}}if(DLFCN.loadedLibNames[filename]){var handle=DLFCN.loadedLibNames[filename];DLFCN.loadedLibs[handle].refcount++;return handle}var lib_module;if(filename==="__self__"){var handle=-1;lib_module=Module}else{if(Module["preloadedWasm"]!==undefined&&Module["preloadedWasm"][filename]!==undefined){lib_module=Module["preloadedWasm"][filename]}else{var target=FS.findObject(filename);if(!target||target.isFolder||target.isDevice){DLFCN.errorMsg="Could not find dynamic lib: "+filename;return 0}FS.forceLoadFile(target);try{var lib_data=FS.readFile(filename,{encoding:"binary"});if(!(lib_data instanceof Uint8Array))lib_data=new Uint8Array(lib_data);lib_module=loadWebAssemblyModule(lib_data)}catch(e){DLFCN.errorMsg="Could not evaluate dynamic lib: "+filename+"\n"+e;return 0}}var handle=1;for(var key in DLFCN.loadedLibs){if(DLFCN.loadedLibs.hasOwnProperty(key))handle++}if(flag&256){for(var ident in lib_module){if(lib_module.hasOwnProperty(ident)){if(ident[0]=="_"){Module[ident]=lib_module[ident]}}}}}DLFCN.loadedLibs[handle]={refcount:1,name:filename,module:lib_module};DLFCN.loadedLibNames[filename]=handle;return handle}function _dlsym(handle,symbol){symbol=Pointer_stringify(symbol);if(!DLFCN.loadedLibs[handle]){DLFCN.errorMsg="Tried to dlsym() from an unopened handle: "+handle;return 0}else{var lib=DLFCN.loadedLibs[handle];symbol="_"+symbol;if(!lib.module.hasOwnProperty(symbol)){DLFCN.errorMsg='Tried to lookup unknown symbol "'+symbol+'" in dynamic lib: '+lib.name;return 0}else{var result=lib.module[symbol];if(typeof result==="function"){return addFunction(result)}return result}}}var _emscripten_asm_const_int=true;function _endgrent(){err("missing function: endgrent");abort(-1)}function _execl(){___setErrNo(ERRNO_CODES.ENOEXEC);return-1}function _fork(){___setErrNo(ERRNO_CODES.EAGAIN);return-1}var VSM={Property:{StateMask:{Offset:0,Type:"i32"},NodeFlags:{Mask:1,Offset:4,Type:"i32"},NodeFlagsMask:{Offset:8,Type:"i32"},Opacity:{Mask:2,Offset:12,Type:"float"},HighlightColor:{Mask:4,Offset:16,Type:"i32"}},data:[],getByDvlVsm:(function(dvlVsm){for(var data=VSM.data,i=0,count=data.length;i<count;++i){if(data[i].dvlVsm===dvlVsm){return data[i]}}return null}),getByNativeVsm:(function(nativeVsm){for(var data=VSM.data,i=0,count=data.length;i<count;++i){if(data[i].nativeVsm===nativeVsm){return data[i]}}return null}),getByRenderer:(function(renderer){for(var data=VSM.data,i=0,count=data.length;i<count;++i){if(data[i].dvlRenderers.indexOf(renderer)>=0){return data[i]}}return null}),add:(function(nativeVsm,dvlVsm,renderer){var item=VSM.getByNativeVsm(nativeVsm);if(item){if(item.dvlRenderers.indexOf(renderer)<0){item.dvlRenderers.push(renderer)}}else{VSM.data.push({nativeVsm:nativeVsm,dvlVsm:dvlVsm,dvlRenderers:[renderer]})}}),deleteRenderer:(function(renderer){for(var data=VSM.data,i=0,count=data.length;i<count;++i){var rendererIndex=data[i].dvlRenderers.indexOf(renderer);if(rendererIndex>=0){if(data[i].dvlRenderers.length===1){if(data[i].nativeVsm){data[i].nativeVsm.detachVisibilityChanged(VSM.handleVisibilityChanged,VSM);data[i].nativeVsm.detachSelectionChanged(VSM.handleSelectionChanged,VSM);data[i].nativeVsm.detachOpacityChanged(VSM.handleOpacityChanged,VSM);data[i].nativeVsm.detachTintColorChanged(VSM.handleTintColorChanged,VSM)}Module.ccall("jDVL_DeleteViewStateManager",null,["number"],[data[i].dvlVsm]);data.splice(i,1)}else{data[i].dvlRenderers.splice(rendererIndex,1)}return}}}),getProperty:(function(buffer,property){return getValue(buffer+property.Offset,property.Type)}),setProperty:(function(buffer,property,value){setValue(buffer+property.Offset,value,property.Type)}),handleVisibilityChanged:(function(event){var nativeVsm=event.getSource(),item=VSM.getByNativeVsm(nativeVsm);if(item){var dvlVsm=item.dvlVsm;visible=event.getParameter("visible"),hidden=event.getParameter("hidden");visible.forEach((function(nodeId){var id=stringIdToPtr(nodeId);Module.ccall("jDVL_FireNodeVisibilityChanged",null,["number","number","boolean"],[dvlVsm,id,true])}));hidden.forEach((function(nodeId){var id=stringIdToPtr(nodeId);Module.ccall("jDVL_FireNodeVisibilityChanged",null,["number","number","boolean"],[dvlVsm,id,false])}))}}),handleSelectionChanged:(function(event){var nativeVsm=event.getSource(),item=VSM.getByNativeVsm(nativeVsm);if(item){var dvlVsm=item.dvlVsm;selected=event.getParameter("selected"),unselected=event.getParameter("unselected");selected.forEach((function(nodeId){var id=stringIdToPtr(nodeId);Module.ccall("jDVL_FireNodeSelectionChanged",null,["number","number","boolean"],[dvlVsm,id,true])}));unselected.forEach((function(nodeId){var id=stringIdToPtr(nodeId);Module.ccall("jDVL_FireNodeSelectionChanged",null,["number","number","boolean"],[dvlVsm,id,false])}))}}),handleOpacityChanged:(function(event){var nativeVsm=event.getSource(),item=VSM.getByNativeVsm(nativeVsm);if(item){var dvlVsm=item.dvlVsm;changed=event.getParameter("changed"),opacity=event.getParameter("opacity");changed.forEach((function(nodeId){var id=stringIdToPtr(nodeId);Module.ccall("jDVL_FireNodeOpacityChanged",null,["number","number","number"],[dvlVsm,id,opacity])}))}}),handleTintColorChanged:(function(event){var nativeVsm=event.getSource(),item=VSM.getByNativeVsm(nativeVsm);if(item){var dvlVsm=item.dvlVsm;changed=event.getParameter("changed"),highlightColor=event.getParameter("tintColorABGR");changed.forEach((function(nodeId){var id=stringIdToPtr(nodeId);Module.ccall("jDVL_FireNodeHighlightColorChanged",null,["number","number","number"],[dvlVsm,id,highlightColor])}))}})};function repeatString(string,count){if(string.length===0){return""}var result="";while(true){if(count&1){result+=string}count>>>=1;if(count===0){break}string+=string}return result}function padStart(string,targetLength,padString){return repeatString(padString||" ",Math.max(0,targetLength-string.length))+string}function ptrToStringId(ptrOrDvlId,prefix){return prefix+"ffffffff"+padStart(ptrOrDvlId.toString(16),8,"0")}function nodeIdToStringId(nodeId){return ptrToStringId(nodeId,"i")}function stringIdToPtr(str){return parseInt(str.substr(9),16)}function setViewStateManager(rendererId,nativeVsm){var renderer=stringIdToPtr(rendererId),result;if(nativeVsm){var item=VSM.getByNativeVsm(nativeVsm),dvlVsm=item&&item.dvlVsm;if(!item){dvlVsm=Module.ccall("jDVL_CreateViewStateManager","number",[],[]);nativeVsm.attachVisibilityChanged(VSM.handleVisibilityChanged,VSM);nativeVsm.attachSelectionChanged(VSM.handleSelectionChanged,VSM);nativeVsm.attachOpacityChanged(VSM.handleOpacityChanged,VSM);nativeVsm.attachTintColorChanged(VSM.handleTintColorChanged,VSM)}VSM.add(nativeVsm,dvlVsm,renderer);result=Module.ccall("jDVLRenderer_SetViewStateManager","number",["number","number"],[renderer,dvlVsm])}else{result=Module.ccall("jDVLRenderer_SetViewStateManager","number",["number","number"],[renderer,0]);VSM.deleteRenderer(renderer)}return result}function _getNodeState(dvlViewStateManager,nodeId,state){var item=VSM.getByDvlVsm(dvlViewStateManager),nativeVsm=item?item.nativeVsm:null,newStateMask=0;if(nativeVsm){var stateMask=VSM.getProperty(state,VSM.Property.StateMask),id=nodeIdToStringId(nodeId);if(stateMask&VSM.Property.NodeFlags.Mask){var nodeFlagsMask=VSM.getProperty(state,VSM.Property.NodeFlagsMask),nodeFlags=(nativeVsm.getImplementation&&nativeVsm.getImplementation()||nativeVsm)._getFlags(id,nodeFlagsMask);if(nodeFlags===null){VSM.setProperty(state,VSM.Property.NodeFlagsMask,0)}else{newStateMask|=VSM.Property.NodeFlags.Mask;VSM.setProperty(state,VSM.Property.NodeFlags,nodeFlags)}}if(stateMask&VSM.Property.Opacity.Mask){var opacity=nativeVsm.getOpacity(id);if(opacity!==null){newStateMask|=VSM.Property.Opacity.Mask;VSM.setProperty(state,VSM.Property.Opacity,opacity)}}if(stateMask&VSM.Property.HighlightColor.Mask){var highlightColor=(nativeVsm.getImplementation&&nativeVsm.getImplementation()||nativeVsm)._getTintColorABGR(id);if(highlightColor!==null){newStateMask|=VSM.Property.HighlightColor.Mask;VSM.setProperty(state,VSM.Property.HighlightColor,highlightColor)}}}VSM.setProperty(state,VSM.Property.StateMask,newStateMask)}function _getenv(name){if(name===0)return 0;name=Pointer_stringify(name);if(!ENV.hasOwnProperty(name))return 0;if(_getenv.ret)_free(_getenv.ret);_getenv.ret=allocateUTF8(ENV[name]);return _getenv.ret}function _getgrent(){err("missing function: getgrent");abort(-1)}function _getnameinfo(sa,salen,node,nodelen,serv,servlen,flags){var info=__read_sockaddr(sa,salen);if(info.errno){return-6}var port=info.port;var addr=info.addr;var overflowed=false;if(node&&nodelen){var lookup;if(flags&1||!(lookup=DNS.lookup_addr(addr))){if(flags&8){return-2}}else{addr=lookup}var numBytesWrittenExclNull=stringToUTF8(addr,node,nodelen);if(numBytesWrittenExclNull+1>=nodelen){overflowed=true}}if(serv&&servlen){port=""+port;var numBytesWrittenExclNull=stringToUTF8(port,serv,servlen);if(numBytesWrittenExclNull+1>=servlen){overflowed=true}}if(overflowed){return-12}return 0}function _gettimeofday(ptr){var now=Date.now();HEAP32[ptr>>2]=now/1e3|0;HEAP32[ptr+4>>2]=now%1e3*1e3|0;return 0}var GL={counter:1,lastError:0,buffers:[],mappedBuffers:{},programs:[],framebuffers:[],renderbuffers:[],textures:[],uniforms:[],shaders:[],vaos:[],contexts:[],currentContext:null,offscreenCanvases:{},timerQueriesEXT:[],byteSizeByTypeRoot:5120,byteSizeByType:[1,1,2,2,4,4,4,2,3,4,8],programInfos:{},stringCache:{},tempFixedLengthArray:[],packAlignment:4,unpackAlignment:4,init:(function(){GL.miniTempBuffer=new Float32Array(GL.MINI_TEMP_BUFFER_SIZE);for(var i=0;i<GL.MINI_TEMP_BUFFER_SIZE;i++){GL.miniTempBufferViews[i]=GL.miniTempBuffer.subarray(0,i+1)}for(var i=0;i<32;i++){GL.tempFixedLengthArray.push(new Array(i))}}),recordError:function recordError(errorCode){if(!GL.lastError){GL.lastError=errorCode}},getNewId:(function(table){var ret=GL.counter++;for(var i=table.length;i<ret;i++){table[i]=null}return ret}),MINI_TEMP_BUFFER_SIZE:256,miniTempBuffer:null,miniTempBufferViews:[0],getSource:(function(shader,count,string,length){var source="";for(var i=0;i<count;++i){var frag;if(length){var len=HEAP32[length+i*4>>2];if(len<0){frag=Pointer_stringify(HEAP32[string+i*4>>2])}else{frag=Pointer_stringify(HEAP32[string+i*4>>2],len)}}else{frag=Pointer_stringify(HEAP32[string+i*4>>2])}source+=frag}return source}),createContext:(function(canvas,webGLContextAttributes){if(typeof webGLContextAttributes["majorVersion"]==="undefined"&&typeof webGLContextAttributes["minorVersion"]==="undefined"){webGLContextAttributes["majorVersion"]=1;webGLContextAttributes["minorVersion"]=0}var ctx;var errorInfo="?";function onContextCreationError(event){errorInfo=event.statusMessage||errorInfo}try{canvas.addEventListener("webglcontextcreationerror",onContextCreationError,false);try{if(webGLContextAttributes["majorVersion"]==1&&webGLContextAttributes["minorVersion"]==0){ctx=canvas.getContext("webgl",webGLContextAttributes)||canvas.getContext("experimental-webgl",webGLContextAttributes)}else if(webGLContextAttributes["majorVersion"]==2&&webGLContextAttributes["minorVersion"]==0){ctx=canvas.getContext("webgl2",webGLContextAttributes)}else{throw"Unsupported WebGL context version "+majorVersion+"."+minorVersion+"!"}}finally{canvas.removeEventListener("webglcontextcreationerror",onContextCreationError,false)}if(!ctx)throw":("}catch(e){out("Could not create canvas: "+[errorInfo,e,JSON.stringify(webGLContextAttributes)]);return 0}if(!ctx)return 0;var context=GL.registerContext(ctx,webGLContextAttributes);return context}),registerContext:(function(ctx,webGLContextAttributes){var handle=GL.getNewId(GL.contexts);var context={handle:handle,attributes:webGLContextAttributes,version:webGLContextAttributes["majorVersion"],GLctx:ctx};if(ctx.canvas)ctx.canvas.GLctxObject=context;GL.contexts[handle]=context;if(typeof webGLContextAttributes["enableExtensionsByDefault"]==="undefined"||webGLContextAttributes["enableExtensionsByDefault"]){GL.initExtensions(context)}return handle}),makeContextCurrent:(function(contextHandle){var context=GL.contexts[contextHandle];if(!context)return false;GLctx=Module.ctx=context.GLctx;GL.currentContext=context;return true}),getContext:(function(contextHandle){return GL.contexts[contextHandle]}),deleteContext:(function(contextHandle){if(GL.currentContext===GL.contexts[contextHandle])GL.currentContext=null;if(typeof JSEvents==="object")JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);if(GL.contexts[contextHandle]&&GL.contexts[contextHandle].GLctx.canvas)GL.contexts[contextHandle].GLctx.canvas.GLctxObject=undefined;GL.contexts[contextHandle]=null}),initExtensions:(function(context){if(!context)context=GL.currentContext;if(context.initExtensionsDone)return;context.initExtensionsDone=true;var GLctx=context.GLctx;context.maxVertexAttribs=GLctx.getParameter(GLctx.MAX_VERTEX_ATTRIBS);if(context.version<2){var instancedArraysExt=GLctx.getExtension("ANGLE_instanced_arrays");if(instancedArraysExt){GLctx["vertexAttribDivisor"]=(function(index,divisor){instancedArraysExt["vertexAttribDivisorANGLE"](index,divisor)});GLctx["drawArraysInstanced"]=(function(mode,first,count,primcount){instancedArraysExt["drawArraysInstancedANGLE"](mode,first,count,primcount)});GLctx["drawElementsInstanced"]=(function(mode,count,type,indices,primcount){instancedArraysExt["drawElementsInstancedANGLE"](mode,count,type,indices,primcount)})}var vaoExt=GLctx.getExtension("OES_vertex_array_object");if(vaoExt){GLctx["createVertexArray"]=(function(){return vaoExt["createVertexArrayOES"]()});GLctx["deleteVertexArray"]=(function(vao){vaoExt["deleteVertexArrayOES"](vao)});GLctx["bindVertexArray"]=(function(vao){vaoExt["bindVertexArrayOES"](vao)});GLctx["isVertexArray"]=(function(vao){return vaoExt["isVertexArrayOES"](vao)})}var drawBuffersExt=GLctx.getExtension("WEBGL_draw_buffers");if(drawBuffersExt){GLctx["drawBuffers"]=(function(n,bufs){drawBuffersExt["drawBuffersWEBGL"](n,bufs)})}}GLctx.disjointTimerQueryExt=GLctx.getExtension("EXT_disjoint_timer_query");var automaticallyEnabledExtensions=["OES_texture_float","OES_texture_half_float","OES_standard_derivatives","OES_vertex_array_object","WEBGL_compressed_texture_s3tc","WEBGL_depth_texture","OES_element_index_uint","EXT_texture_filter_anisotropic","EXT_frag_depth","WEBGL_draw_buffers","ANGLE_instanced_arrays","OES_texture_float_linear","OES_texture_half_float_linear","EXT_blend_minmax","EXT_shader_texture_lod","WEBGL_compressed_texture_pvrtc","EXT_color_buffer_half_float","WEBGL_color_buffer_float","EXT_sRGB","WEBGL_compressed_texture_etc1","EXT_disjoint_timer_query","WEBGL_compressed_texture_etc","WEBGL_compressed_texture_astc","EXT_color_buffer_float","WEBGL_compressed_texture_s3tc_srgb","EXT_disjoint_timer_query_webgl2"];function shouldEnableAutomatically(extension){var ret=false;automaticallyEnabledExtensions.forEach((function(include){if(extension.indexOf(include)!=-1){ret=true}}));return ret}var exts=GLctx.getSupportedExtensions();if(exts&&exts.length>0){GLctx.getSupportedExtensions().forEach((function(ext){if(automaticallyEnabledExtensions.indexOf(ext)!=-1){GLctx.getExtension(ext)}}))}}),populateUniformTable:(function(program){var p=GL.programs[program];GL.programInfos[program]={uniforms:{},maxUniformLength:0,maxAttributeLength:-1,maxUniformBlockNameLength:-1};var ptable=GL.programInfos[program];var utable=ptable.uniforms;var numUniforms=GLctx.getProgramParameter(p,GLctx.ACTIVE_UNIFORMS);for(var i=0;i<numUniforms;++i){var u=GLctx.getActiveUniform(p,i);var name=u.name;ptable.maxUniformLength=Math.max(ptable.maxUniformLength,name.length+1);if(name.indexOf("]",name.length-1)!==-1){var ls=name.lastIndexOf("[");name=name.slice(0,ls)}var loc=GLctx.getUniformLocation(p,name);if(loc!=null){var id=GL.getNewId(GL.uniforms);utable[name]=[u.size,id];GL.uniforms[id]=loc;for(var j=1;j<u.size;++j){var n=name+"["+j+"]";loc=GLctx.getUniformLocation(p,n);id=GL.getNewId(GL.uniforms);GL.uniforms[id]=loc}}}})};function _glActiveTexture(x0){GLctx["activeTexture"](x0)}function _glAttachShader(program,shader){GLctx.attachShader(GL.programs[program],GL.shaders[shader])}function _glBindBuffer(target,buffer){var bufferObj=buffer?GL.buffers[buffer]:null;GLctx.bindBuffer(target,bufferObj)}function _glBindFramebuffer(target,framebuffer){GLctx.bindFramebuffer(target,framebuffer?GL.framebuffers[framebuffer]:null)}function _glBindRenderbuffer(target,renderbuffer){GLctx.bindRenderbuffer(target,renderbuffer?GL.renderbuffers[renderbuffer]:null)}function _glBindTexture(target,texture){GLctx.bindTexture(target,texture?GL.textures[texture]:null)}function _glBlendFuncSeparate(x0,x1,x2,x3){GLctx["blendFuncSeparate"](x0,x1,x2,x3)}function _glBufferData(target,size,data,usage){if(!data){GLctx.bufferData(target,size,usage)}else{GLctx.bufferData(target,HEAPU8.subarray(data,data+size),usage)}}function _glBufferSubData(target,offset,size,data){GLctx.bufferSubData(target,offset,HEAPU8.subarray(data,data+size))}function _glCheckFramebufferStatus(x0){return GLctx["checkFramebufferStatus"](x0)}function _glClear(x0){GLctx["clear"](x0)}function _glClearColor(x0,x1,x2,x3){GLctx["clearColor"](x0,x1,x2,x3)}function _glClearDepthf(x0){GLctx["clearDepth"](x0)}function _glColorMask(red,green,blue,alpha){GLctx.colorMask(!!red,!!green,!!blue,!!alpha)}function _glCompileShader(shader){GLctx.compileShader(GL.shaders[shader])}function _glCreateProgram(){var id=GL.getNewId(GL.programs);var program=GLctx.createProgram();program.name=id;GL.programs[id]=program;return id}function _glCreateShader(shaderType){var id=GL.getNewId(GL.shaders);GL.shaders[id]=GLctx.createShader(shaderType);return id}function _glDeleteBuffers(n,buffers){for(var i=0;i<n;i++){var id=HEAP32[buffers+i*4>>2];var buffer=GL.buffers[id];if(!buffer)continue;GLctx.deleteBuffer(buffer);buffer.name=0;GL.buffers[id]=null;if(id==GL.currArrayBuffer)GL.currArrayBuffer=0;if(id==GL.currElementArrayBuffer)GL.currElementArrayBuffer=0}}function _glDeleteFramebuffers(n,framebuffers){for(var i=0;i<n;++i){var id=HEAP32[framebuffers+i*4>>2];var framebuffer=GL.framebuffers[id];if(!framebuffer)continue;GLctx.deleteFramebuffer(framebuffer);framebuffer.name=0;GL.framebuffers[id]=null}}function _glDeleteProgram(id){if(!id)return;var program=GL.programs[id];if(!program){GL.recordError(1281);return}GLctx.deleteProgram(program);program.name=0;GL.programs[id]=null;GL.programInfos[id]=null}function _glDeleteRenderbuffers(n,renderbuffers){for(var i=0;i<n;i++){var id=HEAP32[renderbuffers+i*4>>2];var renderbuffer=GL.renderbuffers[id];if(!renderbuffer)continue;GLctx.deleteRenderbuffer(renderbuffer);renderbuffer.name=0;GL.renderbuffers[id]=null}}function _glDeleteShader(id){if(!id)return;var shader=GL.shaders[id];if(!shader){GL.recordError(1281);return}GLctx.deleteShader(shader);GL.shaders[id]=null}function _glDeleteTextures(n,textures){for(var i=0;i<n;i++){var id=HEAP32[textures+i*4>>2];var texture=GL.textures[id];if(!texture)continue;GLctx.deleteTexture(texture);texture.name=0;GL.textures[id]=null}}function _glDepthFunc(x0){GLctx["depthFunc"](x0)}function _glDepthMask(flag){GLctx.depthMask(!!flag)}function _glDisable(x0){GLctx["disable"](x0)}function _glDisableVertexAttribArray(index){GLctx.disableVertexAttribArray(index)}function _glDrawArrays(mode,first,count){GLctx.drawArrays(mode,first,count)}function _glDrawElements(mode,count,type,indices){GLctx.drawElements(mode,count,type,indices)}function _glEnable(x0){GLctx["enable"](x0)}function _glEnableVertexAttribArray(index){GLctx.enableVertexAttribArray(index)}function _glFramebufferRenderbuffer(target,attachment,renderbuffertarget,renderbuffer){GLctx.framebufferRenderbuffer(target,attachment,renderbuffertarget,GL.renderbuffers[renderbuffer])}function _glFramebufferTexture2D(target,attachment,textarget,texture,level){GLctx.framebufferTexture2D(target,attachment,textarget,GL.textures[texture],level)}function _glFrontFace(x0){GLctx["frontFace"](x0)}function _glGenBuffers(n,buffers){for(var i=0;i<n;i++){var buffer=GLctx.createBuffer();if(!buffer){GL.recordError(1282);while(i<n)HEAP32[buffers+i++*4>>2]=0;return}var id=GL.getNewId(GL.buffers);buffer.name=id;GL.buffers[id]=buffer;HEAP32[buffers+i*4>>2]=id}}function _glGenFramebuffers(n,ids){for(var i=0;i<n;++i){var framebuffer=GLctx.createFramebuffer();if(!framebuffer){GL.recordError(1282);while(i<n)HEAP32[ids+i++*4>>2]=0;return}var id=GL.getNewId(GL.framebuffers);framebuffer.name=id;GL.framebuffers[id]=framebuffer;HEAP32[ids+i*4>>2]=id}}function _glGenRenderbuffers(n,renderbuffers){for(var i=0;i<n;i++){var renderbuffer=GLctx.createRenderbuffer();if(!renderbuffer){GL.recordError(1282);while(i<n)HEAP32[renderbuffers+i++*4>>2]=0;return}var id=GL.getNewId(GL.renderbuffers);renderbuffer.name=id;GL.renderbuffers[id]=renderbuffer;HEAP32[renderbuffers+i*4>>2]=id}}function _glGenTextures(n,textures){for(var i=0;i<n;i++){var texture=GLctx.createTexture();if(!texture){GL.recordError(1282);while(i<n)HEAP32[textures+i++*4>>2]=0;return}var id=GL.getNewId(GL.textures);texture.name=id;GL.textures[id]=texture;HEAP32[textures+i*4>>2]=id}}function _glGenerateMipmap(x0){GLctx["generateMipmap"](x0)}function _glGetAttribLocation(program,name){program=GL.programs[program];name=Pointer_stringify(name);return GLctx.getAttribLocation(program,name)}function _glGetError(){if(GL.lastError){var error=GL.lastError;GL.lastError=0;return error}else{return GLctx.getError()}}function emscriptenWebGLGet(name_,p,type){if(!p){GL.recordError(1281);return}var ret=undefined;switch(name_){case 36346:ret=1;break;case 36344:if(type!=="Integer"&&type!=="Integer64"){GL.recordError(1280)}return;case 36345:ret=0;break;case 34466:var formats=GLctx.getParameter(34467);ret=formats.length;break}if(ret===undefined){var result=GLctx.getParameter(name_);switch(typeof result){case"number":ret=result;break;case"boolean":ret=result?1:0;break;case"string":GL.recordError(1280);return;case"object":if(result===null){switch(name_){case 34964:case 35725:case 34965:case 36006:case 36007:case 32873:case 34068:{ret=0;break};default:{GL.recordError(1280);return}}}else if(result instanceof Float32Array||result instanceof Uint32Array||result instanceof Int32Array||result instanceof Array){for(var i=0;i<result.length;++i){switch(type){case"Integer":HEAP32[p+i*4>>2]=result[i];break;case"Float":HEAPF32[p+i*4>>2]=result[i];break;case"Boolean":HEAP8[p+i>>0]=result[i]?1:0;break;default:throw"internal glGet error, bad type: "+type}}return}else if(result instanceof WebGLBuffer||result instanceof WebGLProgram||result instanceof WebGLFramebuffer||result instanceof WebGLRenderbuffer||result instanceof WebGLTexture){ret=result.name|0}else{GL.recordError(1280);return}break;default:GL.recordError(1280);return}}switch(type){case"Integer64":tempI64=[ret>>>0,(tempDouble=ret,+Math_abs(tempDouble)>=1?tempDouble>0?(Math_min(+Math_floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math_ceil((tempDouble- +(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[p>>2]=tempI64[0],HEAP32[p+4>>2]=tempI64[1];break;case"Integer":HEAP32[p>>2]=ret;break;case"Float":HEAPF32[p>>2]=ret;break;case"Boolean":HEAP8[p>>0]=ret?1:0;break;default:throw"internal glGet error, bad type: "+type}}function _glGetFloatv(name_,p){emscriptenWebGLGet(name_,p,"Float")}function _glGetIntegerv(name_,p){emscriptenWebGLGet(name_,p,"Integer")}function _glGetProgramInfoLog(program,maxLength,length,infoLog){var log=GLctx.getProgramInfoLog(GL.programs[program]);if(log===null)log="(unknown error)";if(maxLength>0&&infoLog){var numBytesWrittenExclNull=stringToUTF8(log,infoLog,maxLength);if(length)HEAP32[length>>2]=numBytesWrittenExclNull}else{if(length)HEAP32[length>>2]=0}}function _glGetProgramiv(program,pname,p){if(!p){GL.recordError(1281);return}if(program>=GL.counter){GL.recordError(1281);return}var ptable=GL.programInfos[program];if(!ptable){GL.recordError(1282);return}if(pname==35716){var log=GLctx.getProgramInfoLog(GL.programs[program]);if(log===null)log="(unknown error)";HEAP32[p>>2]=log.length+1}else if(pname==35719){HEAP32[p>>2]=ptable.maxUniformLength}else if(pname==35722){if(ptable.maxAttributeLength==-1){program=GL.programs[program];var numAttribs=GLctx.getProgramParameter(program,GLctx.ACTIVE_ATTRIBUTES);ptable.maxAttributeLength=0;for(var i=0;i<numAttribs;++i){var activeAttrib=GLctx.getActiveAttrib(program,i);ptable.maxAttributeLength=Math.max(ptable.maxAttributeLength,activeAttrib.name.length+1)}}HEAP32[p>>2]=ptable.maxAttributeLength}else if(pname==35381){if(ptable.maxUniformBlockNameLength==-1){program=GL.programs[program];var numBlocks=GLctx.getProgramParameter(program,GLctx.ACTIVE_UNIFORM_BLOCKS);ptable.maxUniformBlockNameLength=0;for(var i=0;i<numBlocks;++i){var activeBlockName=GLctx.getActiveUniformBlockName(program,i);ptable.maxUniformBlockNameLength=Math.max(ptable.maxUniformBlockNameLength,activeBlockName.length+1)}}HEAP32[p>>2]=ptable.maxUniformBlockNameLength}else{HEAP32[p>>2]=GLctx.getProgramParameter(GL.programs[program],pname)}}function _glGetShaderInfoLog(shader,maxLength,length,infoLog){var log=GLctx.getShaderInfoLog(GL.shaders[shader]);if(log===null)log="(unknown error)";if(maxLength>0&&infoLog){var numBytesWrittenExclNull=stringToUTF8(log,infoLog,maxLength);if(length)HEAP32[length>>2]=numBytesWrittenExclNull}else{if(length)HEAP32[length>>2]=0}}function _glGetShaderiv(shader,pname,p){if(!p){GL.recordError(1281);return}if(pname==35716){var log=GLctx.getShaderInfoLog(GL.shaders[shader]);if(log===null)log="(unknown error)";HEAP32[p>>2]=log.length+1}else if(pname==35720){var source=GLctx.getShaderSource(GL.shaders[shader]);var sourceLength=source===null||source.length==0?0:source.length+1;HEAP32[p>>2]=sourceLength}else{HEAP32[p>>2]=GLctx.getShaderParameter(GL.shaders[shader],pname)}}function _glGetString(name_){if(GL.stringCache[name_])return GL.stringCache[name_];var ret;switch(name_){case 7936:case 7937:case 37445:case 37446:ret=allocate(intArrayFromString(GLctx.getParameter(name_)),"i8",ALLOC_NORMAL);break;case 7938:var glVersion=GLctx.getParameter(GLctx.VERSION);{glVersion="OpenGL ES 2.0 ("+glVersion+")"}ret=allocate(intArrayFromString(glVersion),"i8",ALLOC_NORMAL);break;case 7939:var exts=GLctx.getSupportedExtensions();var gl_exts=[];for(var i=0;i<exts.length;++i){gl_exts.push(exts[i]);gl_exts.push("GL_"+exts[i])}ret=allocate(intArrayFromString(gl_exts.join(" ")),"i8",ALLOC_NORMAL);break;case 35724:var glslVersion=GLctx.getParameter(GLctx.SHADING_LANGUAGE_VERSION);var ver_re=/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;var ver_num=glslVersion.match(ver_re);if(ver_num!==null){if(ver_num[1].length==3)ver_num[1]=ver_num[1]+"0";glslVersion="OpenGL ES GLSL ES "+ver_num[1]+" ("+glslVersion+")"}ret=allocate(intArrayFromString(glslVersion),"i8",ALLOC_NORMAL);break;default:GL.recordError(1280);return 0}GL.stringCache[name_]=ret;return ret}function _glGetUniformLocation(program,name){name=Pointer_stringify(name);var arrayOffset=0;if(name.indexOf("]",name.length-1)!==-1){var ls=name.lastIndexOf("[");var arrayIndex=name.slice(ls+1,-1);if(arrayIndex.length>0){arrayOffset=parseInt(arrayIndex);if(arrayOffset<0){return-1}}name=name.slice(0,ls)}var ptable=GL.programInfos[program];if(!ptable){return-1}var utable=ptable.uniforms;var uniformInfo=utable[name];if(uniformInfo&&arrayOffset<uniformInfo[0]){return uniformInfo[1]+arrayOffset}else{return-1}}function _glLineWidth(x0){GLctx["lineWidth"](x0)}function _glLinkProgram(program){GLctx.linkProgram(GL.programs[program]);GL.programInfos[program]=null;GL.populateUniformTable(program)}function _glPolygonOffset(x0,x1){GLctx["polygonOffset"](x0,x1)}function emscriptenWebGLComputeImageSize(width,height,sizePerPixel,alignment){function roundedToNextMultipleOf(x,y){return Math.floor((x+y-1)/y)*y}var plainRowSize=width*sizePerPixel;var alignedRowSize=roundedToNextMultipleOf(plainRowSize,alignment);return height<=0?0:(height-1)*alignedRowSize+plainRowSize}function emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,internalFormat){var sizePerPixel;var numChannels;switch(format){case 6406:case 6409:case 6402:numChannels=1;break;case 6410:numChannels=2;break;case 6407:case 35904:numChannels=3;break;case 6408:case 35906:numChannels=4;break;default:GL.recordError(1280);return null}switch(type){case 5121:sizePerPixel=numChannels*1;break;case 5123:case 36193:sizePerPixel=numChannels*2;break;case 5125:case 5126:sizePerPixel=numChannels*4;break;case 34042:sizePerPixel=4;break;case 33635:case 32819:case 32820:sizePerPixel=2;break;default:GL.recordError(1280);return null}var bytes=emscriptenWebGLComputeImageSize(width,height,sizePerPixel,GL.unpackAlignment);switch(type){case 5121:return HEAPU8.subarray(pixels,pixels+bytes);case 5126:return HEAPF32.subarray(pixels>>2,pixels+bytes>>2);case 5125:case 34042:return HEAPU32.subarray(pixels>>2,pixels+bytes>>2);case 5123:case 33635:case 32819:case 32820:case 36193:return HEAPU16.subarray(pixels>>1,pixels+bytes>>1);default:GL.recordError(1280);return null}}function _glReadPixels(x,y,width,height,format,type,pixels){var pixelData=emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,format);if(!pixelData){GL.recordError(1280);return}GLctx.readPixels(x,y,width,height,format,type,pixelData)}function _glRenderbufferStorage(x0,x1,x2,x3){GLctx["renderbufferStorage"](x0,x1,x2,x3)}function _glScissor(x0,x1,x2,x3){GLctx["scissor"](x0,x1,x2,x3)}function _glShaderSource(shader,count,string,length){var source=GL.getSource(shader,count,string,length);GLctx.shaderSource(GL.shaders[shader],source)}function _glStencilMask(x0){GLctx["stencilMask"](x0)}function _glTexImage2D(target,level,internalFormat,width,height,border,format,type,pixels){var pixelData=null;if(pixels)pixelData=emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,internalFormat);GLctx.texImage2D(target,level,internalFormat,width,height,border,format,type,pixelData)}function _glTexParameterf(x0,x1,x2){GLctx["texParameterf"](x0,x1,x2)}function _glTexParameteri(x0,x1,x2){GLctx["texParameteri"](x0,x1,x2)}function _glTexSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixels){var pixelData=null;if(pixels)pixelData=emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,0);GLctx.texSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixelData)}function _glUniform1f(location,v0){GLctx.uniform1f(GL.uniforms[location],v0)}function _glUniform1i(location,v0){GLctx.uniform1i(GL.uniforms[location],v0)}function _glUniform2fv(location,count,value){var view;if(2*count<=GL.MINI_TEMP_BUFFER_SIZE){view=GL.miniTempBufferViews[2*count-1];for(var i=0;i<2*count;i+=2){view[i]=HEAPF32[value+4*i>>2];view[i+1]=HEAPF32[value+(4*i+4)>>2]}}else{view=HEAPF32.subarray(value>>2,value+count*8>>2)}GLctx.uniform2fv(GL.uniforms[location],view)}function _glUniform3fv(location,count,value){var view;if(3*count<=GL.MINI_TEMP_BUFFER_SIZE){view=GL.miniTempBufferViews[3*count-1];for(var i=0;i<3*count;i+=3){view[i]=HEAPF32[value+4*i>>2];view[i+1]=HEAPF32[value+(4*i+4)>>2];view[i+2]=HEAPF32[value+(4*i+8)>>2]}}else{view=HEAPF32.subarray(value>>2,value+count*12>>2)}GLctx.uniform3fv(GL.uniforms[location],view)}function _glUniform4fv(location,count,value){var view;if(4*count<=GL.MINI_TEMP_BUFFER_SIZE){view=GL.miniTempBufferViews[4*count-1];for(var i=0;i<4*count;i+=4){view[i]=HEAPF32[value+4*i>>2];view[i+1]=HEAPF32[value+(4*i+4)>>2];view[i+2]=HEAPF32[value+(4*i+8)>>2];view[i+3]=HEAPF32[value+(4*i+12)>>2]}}else{view=HEAPF32.subarray(value>>2,value+count*16>>2)}GLctx.uniform4fv(GL.uniforms[location],view)}function _glUniformMatrix4fv(location,count,transpose,value){var view;if(16*count<=GL.MINI_TEMP_BUFFER_SIZE){view=GL.miniTempBufferViews[16*count-1];for(var i=0;i<16*count;i+=16){view[i]=HEAPF32[value+4*i>>2];view[i+1]=HEAPF32[value+(4*i+4)>>2];view[i+2]=HEAPF32[value+(4*i+8)>>2];view[i+3]=HEAPF32[value+(4*i+12)>>2];view[i+4]=HEAPF32[value+(4*i+16)>>2];view[i+5]=HEAPF32[value+(4*i+20)>>2];view[i+6]=HEAPF32[value+(4*i+24)>>2];view[i+7]=HEAPF32[value+(4*i+28)>>2];view[i+8]=HEAPF32[value+(4*i+32)>>2];view[i+9]=HEAPF32[value+(4*i+36)>>2];view[i+10]=HEAPF32[value+(4*i+40)>>2];view[i+11]=HEAPF32[value+(4*i+44)>>2];view[i+12]=HEAPF32[value+(4*i+48)>>2];view[i+13]=HEAPF32[value+(4*i+52)>>2];view[i+14]=HEAPF32[value+(4*i+56)>>2];view[i+15]=HEAPF32[value+(4*i+60)>>2]}}else{view=HEAPF32.subarray(value>>2,value+count*64>>2)}GLctx.uniformMatrix4fv(GL.uniforms[location],!!transpose,view)}function _glUseProgram(program){GLctx.useProgram(program?GL.programs[program]:null)}function _glVertexAttribPointer(index,size,type,normalized,stride,ptr){GLctx.vertexAttribPointer(index,size,type,!!normalized,stride,ptr)}function _glViewport(x0,x1,x2,x3){GLctx["viewport"](x0,x1,x2,x3)}var ___tm_timezone=allocate(intArrayFromString("GMT"),"i8",ALLOC_STATIC);function _gmtime_r(time,tmPtr){var date=new Date(HEAP32[time>>2]*1e3);HEAP32[tmPtr>>2]=date.getUTCSeconds();HEAP32[tmPtr+4>>2]=date.getUTCMinutes();HEAP32[tmPtr+8>>2]=date.getUTCHours();HEAP32[tmPtr+12>>2]=date.getUTCDate();HEAP32[tmPtr+16>>2]=date.getUTCMonth();HEAP32[tmPtr+20>>2]=date.getUTCFullYear()-1900;HEAP32[tmPtr+24>>2]=date.getUTCDay();HEAP32[tmPtr+36>>2]=0;HEAP32[tmPtr+32>>2]=0;var start=Date.UTC(date.getUTCFullYear(),0,1,0,0,0,0);var yday=(date.getTime()-start)/(1e3*60*60*24)|0;HEAP32[tmPtr+28>>2]=yday;HEAP32[tmPtr+40>>2]=___tm_timezone;return tmPtr}function _inet_addr(ptr){var addr=__inet_pton4_raw(Pointer_stringify(ptr));if(addr===null){return-1}return addr}function _is_decryption_handler_installed(){return!!Module.Client.getDecryptionHandler()}function _kill(pid,sig){___setErrNo(ERRNO_CODES.EPERM);return-1}var _llvm_ceil_f32=Math_ceil;var _llvm_ctlz_i32=true;var _llvm_fabs_f32=Math_abs;var _llvm_fabs_f64=Math_abs;var _llvm_floor_f32=Math_floor;var _llvm_nacl_atomic_cmpxchg_i32=undefined;function _llvm_stackrestore(p){var self=_llvm_stacksave;var ret=self.LLVM_SAVEDSTACKS[p];self.LLVM_SAVEDSTACKS.splice(p,1);stackRestore(ret)}function _llvm_stacksave(){var self=_llvm_stacksave;if(!self.LLVM_SAVEDSTACKS){self.LLVM_SAVEDSTACKS=[]}self.LLVM_SAVEDSTACKS.push(stackSave());return self.LLVM_SAVEDSTACKS.length-1}function _llvm_trap(){abort("trap!")}var ___tm_current=STATICTOP;STATICTOP+=48;function _tzset(){if(_tzset.called)return;_tzset.called=true;HEAP32[__get_timezone()>>2]=(new Date).getTimezoneOffset()*60;var winter=new Date(2e3,0,1);var summer=new Date(2e3,6,1);HEAP32[__get_daylight()>>2]=Number(winter.getTimezoneOffset()!=summer.getTimezoneOffset());function extractZone(date){var match=date.toTimeString().match(/\(([A-Za-z ]+)\)$/);return match?match[1]:"GMT"}var winterName=extractZone(winter);var summerName=extractZone(summer);var winterNamePtr=allocate(intArrayFromString(winterName),"i8",ALLOC_NORMAL);var summerNamePtr=allocate(intArrayFromString(summerName),"i8",ALLOC_NORMAL);if(summer.getTimezoneOffset()<winter.getTimezoneOffset()){HEAP32[__get_tzname()>>2]=winterNamePtr;HEAP32[__get_tzname()+4>>2]=summerNamePtr}else{HEAP32[__get_tzname()>>2]=summerNamePtr;HEAP32[__get_tzname()+4>>2]=winterNamePtr}}function _localtime_r(time,tmPtr){_tzset();var date=new Date(HEAP32[time>>2]*1e3);HEAP32[tmPtr>>2]=date.getSeconds();HEAP32[tmPtr+4>>2]=date.getMinutes();HEAP32[tmPtr+8>>2]=date.getHours();HEAP32[tmPtr+12>>2]=date.getDate();HEAP32[tmPtr+16>>2]=date.getMonth();HEAP32[tmPtr+20>>2]=date.getFullYear()-1900;HEAP32[tmPtr+24>>2]=date.getDay();var start=new Date(date.getFullYear(),0,1);var yday=(date.getTime()-start.getTime())/(1e3*60*60*24)|0;HEAP32[tmPtr+28>>2]=yday;HEAP32[tmPtr+36>>2]=-(date.getTimezoneOffset()*60);var summerOffset=(new Date(2e3,6,1)).getTimezoneOffset();var winterOffset=start.getTimezoneOffset();var dst=(summerOffset!=winterOffset&&date.getTimezoneOffset()==Math.min(winterOffset,summerOffset))|0;HEAP32[tmPtr+32>>2]=dst;var zonePtr=HEAP32[__get_tzname()+(dst?4:0)>>2];HEAP32[tmPtr+40>>2]=zonePtr;return tmPtr}function _localtime(time){return _localtime_r(time,___tm_current)}function _emscripten_memcpy_big(dest,src,num){HEAPU8.set(HEAPU8.subarray(src,src+num),dest);return dest}function _usleep(useconds){var msec=useconds/1e3;if((ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&self["performance"]&&self["performance"]["now"]){var start=self["performance"]["now"]();while(self["performance"]["now"]()-start<msec){}}else{var start=Date.now();while(Date.now()-start<msec){}}return 0}Module["_usleep"]=_usleep;function _nanosleep(rqtp,rmtp){var seconds=HEAP32[rqtp>>2];var nanoseconds=HEAP32[rqtp+4>>2];if(rmtp!==0){HEAP32[rmtp>>2]=0;HEAP32[rmtp+4>>2]=0}return _usleep(seconds*1e6+nanoseconds/1e3)}function _pthread_cleanup_pop(){assert(_pthread_cleanup_push.level==__ATEXIT__.length,"cannot pop if something else added meanwhile!");__ATEXIT__.pop();_pthread_cleanup_push.level=__ATEXIT__.length}function _pthread_cleanup_push(routine,arg){__ATEXIT__.push((function(){Module["dynCall_vi"](routine,arg)}));_pthread_cleanup_push.level=__ATEXIT__.length}function _pthread_cond_destroy(){return 0}function _pthread_cond_signal(){return 0}function _pthread_cond_timedwait(){return 0}function _pthread_cond_wait(){return 0}function _pthread_detach(){}function _pthread_equal(x,y){return x==y}var PTHREAD_SPECIFIC={};function _pthread_getspecific(key){return PTHREAD_SPECIFIC[key]||0}function _pthread_join(){}var PTHREAD_SPECIFIC_NEXT_KEY=1;function _pthread_key_create(key,destructor){if(key==0){return ERRNO_CODES.EINVAL}HEAP32[key>>2]=PTHREAD_SPECIFIC_NEXT_KEY;PTHREAD_SPECIFIC[PTHREAD_SPECIFIC_NEXT_KEY]=0;PTHREAD_SPECIFIC_NEXT_KEY++;return 0}function _pthread_mutex_destroy(){}function _pthread_mutex_init(){}function _pthread_mutexattr_destroy(){}function _pthread_mutexattr_init(){}function _pthread_mutexattr_settype(){}function _pthread_once(ptr,func){if(!_pthread_once.seen)_pthread_once.seen={};if(ptr in _pthread_once.seen)return;Module["dynCall_v"](func);_pthread_once.seen[ptr]=1}function _pthread_setcancelstate(){return 0}function _pthread_setspecific(key,value){if(!(key in PTHREAD_SPECIFIC)){return ERRNO_CODES.EINVAL}PTHREAD_SPECIFIC[key]=value;return 0}function _pthread_sigmask(){err("missing function: pthread_sigmask");abort(-1)}function _res_query(){err("missing function: res_query");abort(-1)}function _sched_yield(){return 0}function _setNodeState(dvlViewStateManager,nodeId,state){var item=VSM.getByDvlVsm(dvlViewStateManager),nativeVsm=item?item.nativeVsm:null;if(nativeVsm){var stateMask=VSM.getProperty(state,VSM.Property.StateMask),id=nodeIdToStringId(nodeId);if(stateMask&VSM.Property.NodeFlags.Mask){var nodeFlagsMask=VSM.getProperty(state,VSM.Property.NodeFlagsMask),nodeFlags=VSM.getProperty(state,VSM.Property.NodeFlags);(nativeVsm.getImplementation&&nativeVsm.getImplementation()||nativeVsm)._setFlags(id,nodeFlags,nodeFlagsMask)}if(stateMask&VSM.Property.Opacity.Mask){var opacity=VSM.getProperty(state,VSM.Property.Opacity);nativeVsm.setOpacity(id,opacity)}if(stateMask&VSM.Property.HighlightColor.Mask){var highlightColor=VSM.getProperty(state,VSM.Property.HighlightColor);nativeVsm.setTintColor(id,highlightColor)}}}function _setgrent(){err("missing function: setgrent");abort(-1)}function _sysconf(name){switch(name){case 30:return PAGE_SIZE;case 85:var maxHeapSize=2*1024*1024*1024-65536;return maxHeapSize/PAGE_SIZE;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 80:case 81:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:return 200809;case 79:return 0;case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:return-1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1e3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:{if(typeof navigator==="object")return navigator["hardwareConcurrency"]||1;return 1}}___setErrNo(ERRNO_CODES.EINVAL);return-1}function _setgroups(ngroups,gidset){if(ngroups<1||ngroups>_sysconf(3)){___setErrNo(ERRNO_CODES.EINVAL);return-1}else{___setErrNo(ERRNO_CODES.EPERM);return-1}}function _setitimer(){throw"setitimer() is not implemented yet"}function _sigfillset(set){HEAP32[set>>2]=-1>>>0;return 0}function __isLeapYear(year){return year%4===0&&(year%100!==0||year%400===0)}function __arraySum(array,index){var sum=0;for(var i=0;i<=index;sum+=array[i++]);return sum}var __MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];var __MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];function __addDays(date,days){var newDate=new Date(date.getTime());while(days>0){var leap=__isLeapYear(newDate.getFullYear());var currentMonth=newDate.getMonth();var daysInCurrentMonth=(leap?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR)[currentMonth];if(days>daysInCurrentMonth-newDate.getDate()){days-=daysInCurrentMonth-newDate.getDate()+1;newDate.setDate(1);if(currentMonth<11){newDate.setMonth(currentMonth+1)}else{newDate.setMonth(0);newDate.setFullYear(newDate.getFullYear()+1)}}else{newDate.setDate(newDate.getDate()+days);return newDate}}return newDate}function _strftime(s,maxsize,format,tm){var tm_zone=HEAP32[tm+40>>2];var date={tm_sec:HEAP32[tm>>2],tm_min:HEAP32[tm+4>>2],tm_hour:HEAP32[tm+8>>2],tm_mday:HEAP32[tm+12>>2],tm_mon:HEAP32[tm+16>>2],tm_year:HEAP32[tm+20>>2],tm_wday:HEAP32[tm+24>>2],tm_yday:HEAP32[tm+28>>2],tm_isdst:HEAP32[tm+32>>2],tm_gmtoff:HEAP32[tm+36>>2],tm_zone:tm_zone?Pointer_stringify(tm_zone):""};var pattern=Pointer_stringify(format);var EXPANSION_RULES_1={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S"};for(var rule in EXPANSION_RULES_1){pattern=pattern.replace(new RegExp(rule,"g"),EXPANSION_RULES_1[rule])}var WEEKDAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];var MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];function leadingSomething(value,digits,character){var str=typeof value==="number"?value.toString():value||"";while(str.length<digits){str=character[0]+str}return str}function leadingNulls(value,digits){return leadingSomething(value,digits,"0")}function compareByDay(date1,date2){function sgn(value){return value<0?-1:value>0?1:0}var compare;if((compare=sgn(date1.getFullYear()-date2.getFullYear()))===0){if((compare=sgn(date1.getMonth()-date2.getMonth()))===0){compare=sgn(date1.getDate()-date2.getDate())}}return compare}function getFirstWeekStartDate(janFourth){switch(janFourth.getDay()){case 0:return new Date(janFourth.getFullYear()-1,11,29);case 1:return janFourth;case 2:return new Date(janFourth.getFullYear(),0,3);case 3:return new Date(janFourth.getFullYear(),0,2);case 4:return new Date(janFourth.getFullYear(),0,1);case 5:return new Date(janFourth.getFullYear()-1,11,31);case 6:return new Date(janFourth.getFullYear()-1,11,30)}}function getWeekBasedYear(date){var thisDate=__addDays(new Date(date.tm_year+1900,0,1),date.tm_yday);var janFourthThisYear=new Date(thisDate.getFullYear(),0,4);var janFourthNextYear=new Date(thisDate.getFullYear()+1,0,4);var firstWeekStartThisYear=getFirstWeekStartDate(janFourthThisYear);var firstWeekStartNextYear=getFirstWeekStartDate(janFourthNextYear);if(compareByDay(firstWeekStartThisYear,thisDate)<=0){if(compareByDay(firstWeekStartNextYear,thisDate)<=0){return thisDate.getFullYear()+1}else{return thisDate.getFullYear()}}else{return thisDate.getFullYear()-1}}var EXPANSION_RULES_2={"%a":(function(date){return WEEKDAYS[date.tm_wday].substring(0,3)}),"%A":(function(date){return WEEKDAYS[date.tm_wday]}),"%b":(function(date){return MONTHS[date.tm_mon].substring(0,3)}),"%B":(function(date){return MONTHS[date.tm_mon]}),"%C":(function(date){var year=date.tm_year+1900;return leadingNulls(year/100|0,2)}),"%d":(function(date){return leadingNulls(date.tm_mday,2)}),"%e":(function(date){return leadingSomething(date.tm_mday,2," ")}),"%g":(function(date){return getWeekBasedYear(date).toString().substring(2)}),"%G":(function(date){return getWeekBasedYear(date)}),"%H":(function(date){return leadingNulls(date.tm_hour,2)}),"%I":(function(date){var twelveHour=date.tm_hour;if(twelveHour==0)twelveHour=12;else if(twelveHour>12)twelveHour-=12;return leadingNulls(twelveHour,2)}),"%j":(function(date){return leadingNulls(date.tm_mday+__arraySum(__isLeapYear(date.tm_year+1900)?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR,date.tm_mon-1),3)}),"%m":(function(date){return leadingNulls(date.tm_mon+1,2)}),"%M":(function(date){return leadingNulls(date.tm_min,2)}),"%n":(function(){return"\n"}),"%p":(function(date){if(date.tm_hour>=0&&date.tm_hour<12){return"AM"}else{return"PM"}}),"%S":(function(date){return leadingNulls(date.tm_sec,2)}),"%t":(function(){return"\t"}),"%u":(function(date){var day=new Date(date.tm_year+1900,date.tm_mon+1,date.tm_mday,0,0,0,0);return day.getDay()||7}),"%U":(function(date){var janFirst=new Date(date.tm_year+1900,0,1);var firstSunday=janFirst.getDay()===0?janFirst:__addDays(janFirst,7-janFirst.getDay());var endDate=new Date(date.tm_year+1900,date.tm_mon,date.tm_mday);if(compareByDay(firstSunday,endDate)<0){var februaryFirstUntilEndMonth=__arraySum(__isLeapYear(endDate.getFullYear())?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR,endDate.getMonth()-1)-31;var firstSundayUntilEndJanuary=31-firstSunday.getDate();var days=firstSundayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();return leadingNulls(Math.ceil(days/7),2)}return compareByDay(firstSunday,janFirst)===0?"01":"00"}),"%V":(function(date){var janFourthThisYear=new Date(date.tm_year+1900,0,4);var janFourthNextYear=new Date(date.tm_year+1901,0,4);var firstWeekStartThisYear=getFirstWeekStartDate(janFourthThisYear);var firstWeekStartNextYear=getFirstWeekStartDate(janFourthNextYear);var endDate=__addDays(new Date(date.tm_year+1900,0,1),date.tm_yday);if(compareByDay(endDate,firstWeekStartThisYear)<0){return"53"}if(compareByDay(firstWeekStartNextYear,endDate)<=0){return"01"}var daysDifference;if(firstWeekStartThisYear.getFullYear()<date.tm_year+1900){daysDifference=date.tm_yday+32-firstWeekStartThisYear.getDate()}else{daysDifference=date.tm_yday+1-firstWeekStartThisYear.getDate()}return leadingNulls(Math.ceil(daysDifference/7),2)}),"%w":(function(date){var day=new Date(date.tm_year+1900,date.tm_mon+1,date.tm_mday,0,0,0,0);return day.getDay()}),"%W":(function(date){var janFirst=new Date(date.tm_year,0,1);var firstMonday=janFirst.getDay()===1?janFirst:__addDays(janFirst,janFirst.getDay()===0?1:7-janFirst.getDay()+1);var endDate=new Date(date.tm_year+1900,date.tm_mon,date.tm_mday);if(compareByDay(firstMonday,endDate)<0){var februaryFirstUntilEndMonth=__arraySum(__isLeapYear(endDate.getFullYear())?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR,endDate.getMonth()-1)-31;var firstMondayUntilEndJanuary=31-firstMonday.getDate();var days=firstMondayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();return leadingNulls(Math.ceil(days/7),2)}return compareByDay(firstMonday,janFirst)===0?"01":"00"}),"%y":(function(date){return(date.tm_year+1900).toString().substring(2)}),"%Y":(function(date){return date.tm_year+1900}),"%z":(function(date){var off=date.tm_gmtoff;var ahead=off>=0;off=Math.abs(off)/60;off=off/60*100+off%60;return(ahead?"+":"-")+String("0000"+off).slice(-4)}),"%Z":(function(date){return date.tm_zone}),"%%":(function(){return"%"})};for(var rule in EXPANSION_RULES_2){if(pattern.indexOf(rule)>=0){pattern=pattern.replace(new RegExp(rule,"g"),EXPANSION_RULES_2[rule](date))}}var bytes=intArrayFromString(pattern,false);if(bytes.length>maxsize){return 0}writeArrayToMemory(bytes,s);return bytes.length-1}function _strftime_l(s,maxsize,format,tm){return _strftime(s,maxsize,format,tm)}function _time(ptr){var ret=Date.now()/1e3|0;if(ptr){HEAP32[ptr>>2]=ret}return ret}function _timegm(tmPtr){_tzset();var time=Date.UTC(HEAP32[tmPtr+20>>2]+1900,HEAP32[tmPtr+16>>2],HEAP32[tmPtr+12>>2],HEAP32[tmPtr+8>>2],HEAP32[tmPtr+4>>2],HEAP32[tmPtr>>2],0);var date=new Date(time);HEAP32[tmPtr+24>>2]=date.getUTCDay();var start=Date.UTC(date.getUTCFullYear(),0,1,0,0,0,0);var yday=(date.getTime()-start)/(1e3*60*60*24)|0;HEAP32[tmPtr+28>>2]=yday;return date.getTime()/1e3|0}function _utimes(path,times){var time;if(times){var offset=8+0;time=HEAP32[times+offset>>2]*1e3;offset=8+4;time+=HEAP32[times+offset>>2]/1e3}else{time=Date.now()}path=Pointer_stringify(path);try{FS.utime(path,time,time);return 0}catch(e){FS.handleFSError(e);return-1}}function _wait(stat_loc){___setErrNo(ERRNO_CODES.ECHILD);return-1}function _waitpid(){return _wait.apply(null,arguments)}Module["requestFullScreen"]=function Module_requestFullScreen(lockPointer,resizeCanvas,vrDevice){err("Module.requestFullScreen is deprecated. Please call Module.requestFullscreen instead.");Module["requestFullScreen"]=Module["requestFullscreen"];Browser.requestFullScreen(lockPointer,resizeCanvas,vrDevice)};Module["requestFullscreen"]=function Module_requestFullscreen(lockPointer,resizeCanvas,vrDevice){Browser.requestFullscreen(lockPointer,resizeCanvas,vrDevice)};Module["requestAnimationFrame"]=function Module_requestAnimationFrame(func){Browser.requestAnimationFrame(func)};Module["setCanvasSize"]=function Module_setCanvasSize(width,height,noUpdates){Browser.setCanvasSize(width,height,noUpdates)};Module["pauseMainLoop"]=function Module_pauseMainLoop(){Browser.mainLoop.pause()};Module["resumeMainLoop"]=function Module_resumeMainLoop(){Browser.mainLoop.resume()};Module["getUserMedia"]=function Module_getUserMedia(){Browser.getUserMedia()};Module["createContext"]=function Module_createContext(canvas,useWebGL,setInModule,webGLContextAttributes){return Browser.createContext(canvas,useWebGL,setInModule,webGLContextAttributes)};if(ENVIRONMENT_IS_NODE){_emscripten_get_now=function _emscripten_get_now_actual(){var t=process["hrtime"]();return t[0]*1e3+t[1]/1e6}}else if(typeof dateNow!=="undefined"){_emscripten_get_now=dateNow}else if(typeof self==="object"&&self["performance"]&&typeof self["performance"]["now"]==="function"){_emscripten_get_now=(function(){return self["performance"]["now"]()})}else if(typeof performance==="object"&&typeof performance["now"]==="function"){_emscripten_get_now=(function(){return performance["now"]()})}else{_emscripten_get_now=Date.now}FS.staticInit();__ATINIT__.unshift((function(){if(!Module["noFSInit"]&&!FS.init.initialized)FS.init()}));__ATMAIN__.push((function(){FS.ignorePermissions=false}));__ATEXIT__.push((function(){FS.quit()}));__ATINIT__.unshift((function(){TTY.init()}));__ATEXIT__.push((function(){TTY.shutdown()}));if(ENVIRONMENT_IS_NODE){var fs=require("fs");var NODEJS_PATH=require("path");NODEFS.staticInit()}__ATINIT__.push((function(){SOCKFS.root=FS.mount(SOCKFS,{},null)}));__ATINIT__.push((function(){PIPEFS.root=FS.mount(PIPEFS,{},null)}));var GLctx;GL.init();DYNAMICTOP_PTR=staticAlloc(4);STACK_BASE=STACKTOP=alignMemory(STATICTOP);STACK_MAX=STACK_BASE+TOTAL_STACK;DYNAMIC_BASE=alignMemory(STACK_MAX);HEAP32[DYNAMICTOP_PTR>>2]=DYNAMIC_BASE;staticSealed=true;var ASSERTIONS=false;function intArrayFromString(stringy,dontAddNull,length){var len=length>0?length:lengthBytesUTF8(stringy)+1;var u8array=new Array(len);var numBytesWritten=stringToUTF8Array(stringy,u8array,0,u8array.length);if(dontAddNull)u8array.length=numBytesWritten;return u8array}function intArrayToString(array){var ret=[];for(var i=0;i<array.length;i++){var chr=array[i];if(chr>255){if(ASSERTIONS){assert(false,"Character code "+chr+" ("+String.fromCharCode(chr)+")  at offset "+i+" not in 0x00-0xFF.")}chr&=255}ret.push(String.fromCharCode(chr))}return ret.join("")}Module["wasmTableSize"]=5058;Module["wasmMaxTableSize"]=5058;function invoke_di(index,a1){var sp=stackSave();try{return Module["dynCall_di"](index,a1)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_dii(index,a1,a2){var sp=stackSave();try{return Module["dynCall_dii"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fi(index,a1){var sp=stackSave();try{return Module["dynCall_fi"](index,a1)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fii(index,a1,a2){var sp=stackSave();try{return Module["dynCall_fii"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_fiii(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_fiii"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_i(index){var sp=stackSave();try{return Module["dynCall_i"](index)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ii(index,a1){var sp=stackSave();try{return Module["dynCall_ii"](index,a1)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iif(index,a1,a2){var sp=stackSave();try{return Module["dynCall_iif"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiff(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_iiff"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiffff(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iiffff"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiffffii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iiffffii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiffii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iiffii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iii(index,a1,a2){var sp=stackSave();try{return Module["dynCall_iii"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiid(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_iiid"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiif(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_iiif"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiii(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_iiii"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiif(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iiiif"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiifiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return Module["dynCall_iiiifiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiii(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iiiii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiid(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iiiiid"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiff(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiiiiff"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iiiiii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiid(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiiiiid"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiiiiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return Module["dynCall_iiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return Module["dynCall_iiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return Module["dynCall_iiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiiiijii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return Module["dynCall_iiiiiiijii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiij(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiiiij"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiijii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return Module["dynCall_iiiiijii"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiij(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iiiij"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiiji(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iiiiji"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiiijii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iiiijii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiij(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iiij"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iij(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_iij"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijf(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iijf"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijfj(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iijfj"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iiji(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_iiji"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iijii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijiif(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iijiif"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijiiiij(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return Module["dynCall_iijiiiij"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijiij(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return Module["dynCall_iijiij"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijij(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iijij"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijj(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return Module["dynCall_iijj"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijji(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_iijji"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_iijjiiij(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return Module["dynCall_iijjiiij"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ij(index,a1,a2){var sp=stackSave();try{return Module["dynCall_ij"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_j(index){var sp=stackSave();try{return Module["dynCall_j"](index)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_ji(index,a1){var sp=stackSave();try{return Module["dynCall_ji"](index,a1)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jii(index,a1,a2){var sp=stackSave();try{return Module["dynCall_jii"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jiii(index,a1,a2,a3){var sp=stackSave();try{return Module["dynCall_jiii"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jiiii(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_jiiii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jiiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_jiiiiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jiij(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_jiij"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jiji(index,a1,a2,a3,a4){var sp=stackSave();try{return Module["dynCall_jiji"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jijiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_jijiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jijij(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return Module["dynCall_jijij"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jijjiij(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return Module["dynCall_jijjiij"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_jj(index,a1,a2){var sp=stackSave();try{return Module["dynCall_jj"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_v(index){var sp=stackSave();try{Module["dynCall_v"](index)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vi(index,a1){var sp=stackSave();try{Module["dynCall_vi"](index,a1)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vid(index,a1,a2){var sp=stackSave();try{Module["dynCall_vid"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vif(index,a1,a2){var sp=stackSave();try{Module["dynCall_vif"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viff(index,a1,a2,a3){var sp=stackSave();try{Module["dynCall_viff"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viffffff(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viffffff"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vii(index,a1,a2){var sp=stackSave();try{Module["dynCall_vii"](index,a1,a2)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viif(index,a1,a2,a3){var sp=stackSave();try{Module["dynCall_viif"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viifffiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{Module["dynCall_viifffiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viii(index,a1,a2,a3){var sp=stackSave();try{Module["dynCall_viii"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiif(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_viiif"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiffffifiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{Module["dynCall_viiiffffifiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiifi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viiifi"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiii(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_viiii"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiif(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viiiif"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiifiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{Module["dynCall_viiiifiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viiiiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{Module["dynCall_viiiiiii"](index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiif(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{Module["dynCall_viiiiiiif"](index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiiiiif(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{Module["dynCall_viiiiiiiiiif"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{Module["dynCall_viiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiij(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viiiij"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiiji(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viiiji"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viij(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_viij"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viiji(index,a1,a2,a3,a4,a5){var sp=stackSave();try{Module["dynCall_viiji"](index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viijii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{Module["dynCall_viijii"](index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_vij(index,a1,a2,a3){var sp=stackSave();try{Module["dynCall_vij"](index,a1,a2,a3)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}function invoke_viji(index,a1,a2,a3,a4){var sp=stackSave();try{Module["dynCall_viji"](index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(typeof e!=="number"&&e!=="longjmp")throw e;Module["setThrew"](1,0)}}Module.asmGlobalArg={};Module.asmLibraryArg={"abort":abort,"assert":assert,"enlargeMemory":enlargeMemory,"getTotalMemory":getTotalMemory,"abortOnCannotGrowMemory":abortOnCannotGrowMemory,"invoke_di":invoke_di,"invoke_dii":invoke_dii,"invoke_fi":invoke_fi,"invoke_fii":invoke_fii,"invoke_fiii":invoke_fiii,"invoke_i":invoke_i,"invoke_ii":invoke_ii,"invoke_iif":invoke_iif,"invoke_iiff":invoke_iiff,"invoke_iiffff":invoke_iiffff,"invoke_iiffffii":invoke_iiffffii,"invoke_iiffii":invoke_iiffii,"invoke_iii":invoke_iii,"invoke_iiid":invoke_iiid,"invoke_iiif":invoke_iiif,"invoke_iiii":invoke_iiii,"invoke_iiiif":invoke_iiiif,"invoke_iiiifiiiiii":invoke_iiiifiiiiii,"invoke_iiiii":invoke_iiiii,"invoke_iiiiid":invoke_iiiiid,"invoke_iiiiiff":invoke_iiiiiff,"invoke_iiiiii":invoke_iiiiii,"invoke_iiiiiid":invoke_iiiiiid,"invoke_iiiiiii":invoke_iiiiiii,"invoke_iiiiiiii":invoke_iiiiiiii,"invoke_iiiiiiiii":invoke_iiiiiiiii,"invoke_iiiiiiiiii":invoke_iiiiiiiiii,"invoke_iiiiiiiiiiiii":invoke_iiiiiiiiiiiii,"invoke_iiiiiiijii":invoke_iiiiiiijii,"invoke_iiiiij":invoke_iiiiij,"invoke_iiiiijii":invoke_iiiiijii,"invoke_iiiij":invoke_iiiij,"invoke_iiiiji":invoke_iiiiji,"invoke_iiiijii":invoke_iiiijii,"invoke_iiij":invoke_iiij,"invoke_iij":invoke_iij,"invoke_iijf":invoke_iijf,"invoke_iijfj":invoke_iijfj,"invoke_iiji":invoke_iiji,"invoke_iijii":invoke_iijii,"invoke_iijiif":invoke_iijiif,"invoke_iijiiiij":invoke_iijiiiij,"invoke_iijiij":invoke_iijiij,"invoke_iijij":invoke_iijij,"invoke_iijj":invoke_iijj,"invoke_iijji":invoke_iijji,"invoke_iijjiiij":invoke_iijjiiij,"invoke_ij":invoke_ij,"invoke_j":invoke_j,"invoke_ji":invoke_ji,"invoke_jii":invoke_jii,"invoke_jiii":invoke_jiii,"invoke_jiiii":invoke_jiiii,"invoke_jiiiiii":invoke_jiiiiii,"invoke_jiij":invoke_jiij,"invoke_jiji":invoke_jiji,"invoke_jijiii":invoke_jijiii,"invoke_jijij":invoke_jijij,"invoke_jijjiij":invoke_jijjiij,"invoke_jj":invoke_jj,"invoke_v":invoke_v,"invoke_vi":invoke_vi,"invoke_vid":invoke_vid,"invoke_vif":invoke_vif,"invoke_viff":invoke_viff,"invoke_viffffff":invoke_viffffff,"invoke_vii":invoke_vii,"invoke_viif":invoke_viif,"invoke_viifffiiiiiiii":invoke_viifffiiiiiiii,"invoke_viii":invoke_viii,"invoke_viiif":invoke_viiif,"invoke_viiiffffifiii":invoke_viiiffffifiii,"invoke_viiifi":invoke_viiifi,"invoke_viiii":invoke_viiii,"invoke_viiiif":invoke_viiiif,"invoke_viiiifiiiii":invoke_viiiifiiiii,"invoke_viiiii":invoke_viiiii,"invoke_viiiiii":invoke_viiiiii,"invoke_viiiiiii":invoke_viiiiiii,"invoke_viiiiiiif":invoke_viiiiiiif,"invoke_viiiiiiiiiif":invoke_viiiiiiiiiif,"invoke_viiiiiiiiiiiii":invoke_viiiiiiiiiiiii,"invoke_viiiij":invoke_viiiij,"invoke_viiiji":invoke_viiiji,"invoke_viij":invoke_viij,"invoke_viiji":invoke_viiji,"invoke_viijii":invoke_viijii,"invoke_vij":invoke_vij,"invoke_viji":invoke_viji,"__ZN3dvl11Abstraction12DynamicLabel8SetImageEPKvj":__ZN3dvl11Abstraction12DynamicLabel8SetImageEPKvj,"__ZN3sap2ve4core18EntityElementCache19ElementIsSuppressedEPKcS4_S4_":__ZN3sap2ve4core18EntityElementCache19ElementIsSuppressedEPKcS4_S4_,"__ZN3sap2ve4core18EntityElementCacheC1EPNS1_5ModelE":__ZN3sap2ve4core18EntityElementCacheC1EPNS1_5ModelE,"__ZN3sap2ve4core18EntityElementCacheD1Ev":__ZN3sap2ve4core18EntityElementCacheD1Ev,"__ZN3sap2ve4core21GraphSelectorResolver12WalkSelectorEPNS1_6EntityEPKNS1_8SelectorE":__ZN3sap2ve4core21GraphSelectorResolver12WalkSelectorEPNS1_6EntityEPKNS1_8SelectorE,"__ZN3sap2ve4core21GraphSelectorResolver26SelectorTargetIsSuppressedEPNS1_6EntityEPKNS1_8SelectorE":__ZN3sap2ve4core21GraphSelectorResolver26SelectorTargetIsSuppressedEPNS1_6EntityEPKNS1_8SelectorE,"__ZN3sap2ve4core21GraphSelectorResolverC1Ev":__ZN3sap2ve4core21GraphSelectorResolverC1Ev,"__ZN3sap2ve4core21GraphSelectorResolverD1Ev":__ZN3sap2ve4core21GraphSelectorResolverD1Ev,"__ZN3sap2ve4core27cVDSDataTypeReader_Geometry15DetermineQuantsERjS3_S3_":__ZN3sap2ve4core27cVDSDataTypeReader_Geometry15DetermineQuantsERjS3_S3_,"__ZN3sap2ve4core27cVDSDataTypeReader_Geometry6DecodeEv":__ZN3sap2ve4core27cVDSDataTypeReader_Geometry6DecodeEv,"___block_all_sigs":___block_all_sigs,"___buildEnvironment":___buildEnvironment,"___clock_gettime":___clock_gettime,"___clone":___clone,"___cxa_allocate_exception":___cxa_allocate_exception,"___cxa_begin_catch":___cxa_begin_catch,"___cxa_current_primary_exception":___cxa_current_primary_exception,"___cxa_decrement_exception_refcount":___cxa_decrement_exception_refcount,"___cxa_end_catch":___cxa_end_catch,"___cxa_find_matching_catch":___cxa_find_matching_catch,"___cxa_free_exception":___cxa_free_exception,"___cxa_increment_exception_refcount":___cxa_increment_exception_refcount,"___cxa_pure_virtual":___cxa_pure_virtual,"___cxa_rethrow":___cxa_rethrow,"___cxa_rethrow_primary_exception":___cxa_rethrow_primary_exception,"___cxa_throw":___cxa_throw,"___cxa_uncaught_exception":___cxa_uncaught_exception,"___gxx_personality_v0":___gxx_personality_v0,"___lock":___lock,"___map_file":___map_file,"___muldc3":___muldc3,"___mulsc3":___mulsc3,"___restore_sigs":___restore_sigs,"___resumeException":___resumeException,"___setErrNo":___setErrNo,"___syscall1":___syscall1,"___syscall10":___syscall10,"___syscall102":___syscall102,"___syscall114":___syscall114,"___syscall118":___syscall118,"___syscall12":___syscall12,"___syscall121":___syscall121,"___syscall122":___syscall122,"___syscall125":___syscall125,"___syscall132":___syscall132,"___syscall133":___syscall133,"___syscall14":___syscall14,"___syscall140":___syscall140,"___syscall142":___syscall142,"___syscall144":___syscall144,"___syscall145":___syscall145,"___syscall146":___syscall146,"___syscall147":___syscall147,"___syscall148":___syscall148,"___syscall15":___syscall15,"___syscall150":___syscall150,"___syscall151":___syscall151,"___syscall152":___syscall152,"___syscall153":___syscall153,"___syscall163":___syscall163,"___syscall168":___syscall168,"___syscall180":___syscall180,"___syscall181":___syscall181,"___syscall183":___syscall183,"___syscall191":___syscall191,"___syscall192":___syscall192,"___syscall193":___syscall193,"___syscall194":___syscall194,"___syscall195":___syscall195,"___syscall196":___syscall196,"___syscall197":___syscall197,"___syscall198":___syscall198,"___syscall199":___syscall199,"___syscall20":___syscall20,"___syscall200":___syscall200,"___syscall201":___syscall201,"___syscall202":___syscall202,"___syscall203":___syscall203,"___syscall204":___syscall204,"___syscall205":___syscall205,"___syscall207":___syscall207,"___syscall209":___syscall209,"___syscall211":___syscall211,"___syscall212":___syscall212,"___syscall214":___syscall214,"___syscall218":___syscall218,"___syscall219":___syscall219,"___syscall220":___syscall220,"___syscall221":___syscall221,"___syscall268":___syscall268,"___syscall269":___syscall269,"___syscall272":___syscall272,"___syscall29":___syscall29,"___syscall295":___syscall295,"___syscall296":___syscall296,"___syscall297":___syscall297,"___syscall298":___syscall298,"___syscall3":___syscall3,"___syscall300":___syscall300,"___syscall301":___syscall301,"___syscall302":___syscall302,"___syscall303":___syscall303,"___syscall304":___syscall304,"___syscall305":___syscall305,"___syscall306":___syscall306,"___syscall307":___syscall307,"___syscall308":___syscall308,"___syscall320":___syscall320,"___syscall324":___syscall324,"___syscall33":___syscall33,"___syscall330":___syscall330,"___syscall331":___syscall331,"___syscall333":___syscall333,"___syscall334":___syscall334,"___syscall337":___syscall337,"___syscall34":___syscall34,"___syscall340":___syscall340,"___syscall345":___syscall345,"___syscall36":___syscall36,"___syscall38":___syscall38,"___syscall39":___syscall39,"___syscall4":___syscall4,"___syscall40":___syscall40,"___syscall41":___syscall41,"___syscall42":___syscall42,"___syscall5":___syscall5,"___syscall51":___syscall51,"___syscall54":___syscall54,"___syscall57":___syscall57,"___syscall6":___syscall6,"___syscall60":___syscall60,"___syscall63":___syscall63,"___syscall64":___syscall64,"___syscall66":___syscall66,"___syscall75":___syscall75,"___syscall77":___syscall77,"___syscall83":___syscall83,"___syscall85":___syscall85,"___syscall9":___syscall9,"___syscall91":___syscall91,"___syscall94":___syscall94,"___syscall96":___syscall96,"___syscall97":___syscall97,"___unlock":___unlock,"___wait":___wait,"__addDays":__addDays,"__arraySum":__arraySum,"__exit":__exit,"__inet_ntop4_raw":__inet_ntop4_raw,"__inet_ntop6_raw":__inet_ntop6_raw,"__inet_pton4_raw":__inet_pton4_raw,"__inet_pton6_raw":__inet_pton6_raw,"__isLeapYear":__isLeapYear,"__read_sockaddr":__read_sockaddr,"__write_sockaddr":__write_sockaddr,"_abort":_abort,"_clock":_clock,"_clock_gettime":_clock_gettime,"_decrypt":_decrypt,"_derive_key":_derive_key,"_dlclose":_dlclose,"_dlerror":_dlerror,"_dlopen":_dlopen,"_dlsym":_dlsym,"_emscripten_asm_const_ii":_emscripten_asm_const_ii,"_emscripten_asm_const_iid":_emscripten_asm_const_iid,"_emscripten_asm_const_iidddddd":_emscripten_asm_const_iidddddd,"_emscripten_asm_const_iii":_emscripten_asm_const_iii,"_emscripten_asm_const_iiii":_emscripten_asm_const_iiii,"_emscripten_asm_const_iiiidddididiiiiiiiiiiiii":_emscripten_asm_const_iiiidddididiiiiiiiiiiiii,"_emscripten_asm_const_iiiii":_emscripten_asm_const_iiiii,"_emscripten_asm_const_iiiiii":_emscripten_asm_const_iiiiii,"_emscripten_get_now":_emscripten_get_now,"_emscripten_get_now_is_monotonic":_emscripten_get_now_is_monotonic,"_emscripten_memcpy_big":_emscripten_memcpy_big,"_emscripten_set_main_loop":_emscripten_set_main_loop,"_emscripten_set_main_loop_timing":_emscripten_set_main_loop_timing,"_endgrent":_endgrent,"_execl":_execl,"_fork":_fork,"_getNodeState":_getNodeState,"_getenv":_getenv,"_getgrent":_getgrent,"_getnameinfo":_getnameinfo,"_gettimeofday":_gettimeofday,"_glActiveTexture":_glActiveTexture,"_glAttachShader":_glAttachShader,"_glBindBuffer":_glBindBuffer,"_glBindFramebuffer":_glBindFramebuffer,"_glBindRenderbuffer":_glBindRenderbuffer,"_glBindTexture":_glBindTexture,"_glBlendFuncSeparate":_glBlendFuncSeparate,"_glBufferData":_glBufferData,"_glBufferSubData":_glBufferSubData,"_glCheckFramebufferStatus":_glCheckFramebufferStatus,"_glClear":_glClear,"_glClearColor":_glClearColor,"_glClearDepthf":_glClearDepthf,"_glColorMask":_glColorMask,"_glCompileShader":_glCompileShader,"_glCreateProgram":_glCreateProgram,"_glCreateShader":_glCreateShader,"_glDeleteBuffers":_glDeleteBuffers,"_glDeleteFramebuffers":_glDeleteFramebuffers,"_glDeleteProgram":_glDeleteProgram,"_glDeleteRenderbuffers":_glDeleteRenderbuffers,"_glDeleteShader":_glDeleteShader,"_glDeleteTextures":_glDeleteTextures,"_glDepthFunc":_glDepthFunc,"_glDepthMask":_glDepthMask,"_glDisable":_glDisable,"_glDisableVertexAttribArray":_glDisableVertexAttribArray,"_glDrawArrays":_glDrawArrays,"_glDrawElements":_glDrawElements,"_glEnable":_glEnable,"_glEnableVertexAttribArray":_glEnableVertexAttribArray,"_glFramebufferRenderbuffer":_glFramebufferRenderbuffer,"_glFramebufferTexture2D":_glFramebufferTexture2D,"_glFrontFace":_glFrontFace,"_glGenBuffers":_glGenBuffers,"_glGenFramebuffers":_glGenFramebuffers,"_glGenRenderbuffers":_glGenRenderbuffers,"_glGenTextures":_glGenTextures,"_glGenerateMipmap":_glGenerateMipmap,"_glGetAttribLocation":_glGetAttribLocation,"_glGetError":_glGetError,"_glGetFloatv":_glGetFloatv,"_glGetIntegerv":_glGetIntegerv,"_glGetProgramInfoLog":_glGetProgramInfoLog,"_glGetProgramiv":_glGetProgramiv,"_glGetShaderInfoLog":_glGetShaderInfoLog,"_glGetShaderiv":_glGetShaderiv,"_glGetString":_glGetString,"_glGetUniformLocation":_glGetUniformLocation,"_glLineWidth":_glLineWidth,"_glLinkProgram":_glLinkProgram,"_glPolygonOffset":_glPolygonOffset,"_glReadPixels":_glReadPixels,"_glRenderbufferStorage":_glRenderbufferStorage,"_glScissor":_glScissor,"_glShaderSource":_glShaderSource,"_glStencilMask":_glStencilMask,"_glTexImage2D":_glTexImage2D,"_glTexParameterf":_glTexParameterf,"_glTexParameteri":_glTexParameteri,"_glTexSubImage2D":_glTexSubImage2D,"_glUniform1f":_glUniform1f,"_glUniform1i":_glUniform1i,"_glUniform2fv":_glUniform2fv,"_glUniform3fv":_glUniform3fv,"_glUniform4fv":_glUniform4fv,"_glUniformMatrix4fv":_glUniformMatrix4fv,"_glUseProgram":_glUseProgram,"_glVertexAttribPointer":_glVertexAttribPointer,"_glViewport":_glViewport,"_gmtime_r":_gmtime_r,"_inet_addr":_inet_addr,"_is_decryption_handler_installed":_is_decryption_handler_installed,"_kill":_kill,"_llvm_ceil_f32":_llvm_ceil_f32,"_llvm_fabs_f32":_llvm_fabs_f32,"_llvm_fabs_f64":_llvm_fabs_f64,"_llvm_floor_f32":_llvm_floor_f32,"_llvm_stackrestore":_llvm_stackrestore,"_llvm_stacksave":_llvm_stacksave,"_llvm_trap":_llvm_trap,"_localtime":_localtime,"_localtime_r":_localtime_r,"_nanosleep":_nanosleep,"_pthread_cleanup_pop":_pthread_cleanup_pop,"_pthread_cleanup_push":_pthread_cleanup_push,"_pthread_cond_destroy":_pthread_cond_destroy,"_pthread_cond_signal":_pthread_cond_signal,"_pthread_cond_timedwait":_pthread_cond_timedwait,"_pthread_cond_wait":_pthread_cond_wait,"_pthread_detach":_pthread_detach,"_pthread_equal":_pthread_equal,"_pthread_getspecific":_pthread_getspecific,"_pthread_join":_pthread_join,"_pthread_key_create":_pthread_key_create,"_pthread_mutex_destroy":_pthread_mutex_destroy,"_pthread_mutex_init":_pthread_mutex_init,"_pthread_mutexattr_destroy":_pthread_mutexattr_destroy,"_pthread_mutexattr_init":_pthread_mutexattr_init,"_pthread_mutexattr_settype":_pthread_mutexattr_settype,"_pthread_once":_pthread_once,"_pthread_setcancelstate":_pthread_setcancelstate,"_pthread_setspecific":_pthread_setspecific,"_pthread_sigmask":_pthread_sigmask,"_res_query":_res_query,"_sched_yield":_sched_yield,"_setNodeState":_setNodeState,"_setgrent":_setgrent,"_setgroups":_setgroups,"_setitimer":_setitimer,"_sigfillset":_sigfillset,"_strftime":_strftime,"_strftime_l":_strftime_l,"_sysconf":_sysconf,"_time":_time,"_timegm":_timegm,"_tzset":_tzset,"_usleep":_usleep,"_utimes":_utimes,"_wait":_wait,"_waitpid":_waitpid,"emscriptenWebGLComputeImageSize":emscriptenWebGLComputeImageSize,"emscriptenWebGLGet":emscriptenWebGLGet,"emscriptenWebGLGetTexPixelData":emscriptenWebGLGetTexPixelData,"nodeIdToStringId":nodeIdToStringId,"padStart":padStart,"ptrToStringId":ptrToStringId,"repeatString":repeatString,"setViewStateManager":setViewStateManager,"stringIdToPtr":stringIdToPtr,"DYNAMICTOP_PTR":DYNAMICTOP_PTR,"tempDoublePtr":tempDoublePtr,"STACKTOP":STACKTOP,"STACK_MAX":STACK_MAX};var asm=Module["asm"](Module.asmGlobalArg,Module.asmLibraryArg,buffer);Module["asm"]=asm;var __GLOBAL__I_000101=Module["__GLOBAL__I_000101"]=(function(){return Module["asm"]["__GLOBAL__I_000101"].apply(null,arguments)});var __GLOBAL__sub_I_ActiveOperationFactory_cpp=Module["__GLOBAL__sub_I_ActiveOperationFactory_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_ActiveOperationFactory_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_ChangeManager_cpp=Module["__GLOBAL__sub_I_ChangeManager_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_ChangeManager_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_CoreImp_cpp=Module["__GLOBAL__sub_I_CoreImp_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_CoreImp_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_DataModelSQLiteReader_cpp=Module["__GLOBAL__sub_I_DataModelSQLiteReader_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_DataModelSQLiteReader_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Drawing_cpp=Module["__GLOBAL__sub_I_Drawing_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Drawing_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Id_cpp=Module["__GLOBAL__sub_I_Id_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Id_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_LabelDefinition_cpp=Module["__GLOBAL__sub_I_LabelDefinition_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_LabelDefinition_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_LineRenderer_cpp=Module["__GLOBAL__sub_I_LineRenderer_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_LineRenderer_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_Material_cpp=Module["__GLOBAL__sub_I_Material_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_Material_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_MathConstants_cpp=Module["__GLOBAL__sub_I_MathConstants_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_MathConstants_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_UuId_cpp=Module["__GLOBAL__sub_I_UuId_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_UuId_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_VDSReader_cpp=Module["__GLOBAL__sub_I_VDSReader_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_VDSReader_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_ZIPVFSCompression_cpp=Module["__GLOBAL__sub_I_ZIPVFSCompression_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_ZIPVFSCompression_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_iostream_cpp=Module["__GLOBAL__sub_I_iostream_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_iostream_cpp"].apply(null,arguments)});var __GLOBAL__sub_I_query_cpp=Module["__GLOBAL__sub_I_query_cpp"]=(function(){return Module["asm"]["__GLOBAL__sub_I_query_cpp"].apply(null,arguments)});var __Z22jDVLClient_ConstructorPKc=Module["__Z22jDVLClient_ConstructorPKc"]=(function(){return Module["asm"]["__Z22jDVLClient_ConstructorPKc"].apply(null,arguments)});var __ZSt18uncaught_exceptionv=Module["__ZSt18uncaught_exceptionv"]=(function(){return Module["asm"]["__ZSt18uncaught_exceptionv"].apply(null,arguments)});var ___cxa_can_catch=Module["___cxa_can_catch"]=(function(){return Module["asm"]["___cxa_can_catch"].apply(null,arguments)});var ___cxa_is_pointer_type=Module["___cxa_is_pointer_type"]=(function(){return Module["asm"]["___cxa_is_pointer_type"].apply(null,arguments)});var ___emscripten_environ_constructor=Module["___emscripten_environ_constructor"]=(function(){return Module["asm"]["___emscripten_environ_constructor"].apply(null,arguments)});var ___errno_location=Module["___errno_location"]=(function(){return Module["asm"]["___errno_location"].apply(null,arguments)});var __get_daylight=Module["__get_daylight"]=(function(){return Module["asm"]["__get_daylight"].apply(null,arguments)});var __get_environ=Module["__get_environ"]=(function(){return Module["asm"]["__get_environ"].apply(null,arguments)});var __get_timezone=Module["__get_timezone"]=(function(){return Module["asm"]["__get_timezone"].apply(null,arguments)});var __get_tzname=Module["__get_tzname"]=(function(){return Module["asm"]["__get_tzname"].apply(null,arguments)});var _emscripten_replace_memory=Module["_emscripten_replace_memory"]=(function(){return Module["asm"]["_emscripten_replace_memory"].apply(null,arguments)});var _free=Module["_free"]=(function(){return Module["asm"]["_free"].apply(null,arguments)});var _htons=Module["_htons"]=(function(){return Module["asm"]["_htons"].apply(null,arguments)});var _jDVLBitmap_CreateTexture=Module["_jDVLBitmap_CreateTexture"]=(function(){return Module["asm"]["_jDVLBitmap_CreateTexture"].apply(null,arguments)});var _jDVLCamera_GetFOV=Module["_jDVLCamera_GetFOV"]=(function(){return Module["asm"]["_jDVLCamera_GetFOV"].apply(null,arguments)});var _jDVLCamera_GetFOVBinding=Module["_jDVLCamera_GetFOVBinding"]=(function(){return Module["asm"]["_jDVLCamera_GetFOVBinding"].apply(null,arguments)});var _jDVLCamera_GetMatrix=Module["_jDVLCamera_GetMatrix"]=(function(){return Module["asm"]["_jDVLCamera_GetMatrix"].apply(null,arguments)});var _jDVLCamera_GetName=Module["_jDVLCamera_GetName"]=(function(){return Module["asm"]["_jDVLCamera_GetName"].apply(null,arguments)});var _jDVLCamera_GetOrigin=Module["_jDVLCamera_GetOrigin"]=(function(){return Module["asm"]["_jDVLCamera_GetOrigin"].apply(null,arguments)});var _jDVLCamera_GetOrthoZoomFactor=Module["_jDVLCamera_GetOrthoZoomFactor"]=(function(){return Module["asm"]["_jDVLCamera_GetOrthoZoomFactor"].apply(null,arguments)});var _jDVLCamera_GetProjection=Module["_jDVLCamera_GetProjection"]=(function(){return Module["asm"]["_jDVLCamera_GetProjection"].apply(null,arguments)});var _jDVLCamera_GetRotation=Module["_jDVLCamera_GetRotation"]=(function(){return Module["asm"]["_jDVLCamera_GetRotation"].apply(null,arguments)});var _jDVLCamera_GetTargetDirection=Module["_jDVLCamera_GetTargetDirection"]=(function(){return Module["asm"]["_jDVLCamera_GetTargetDirection"].apply(null,arguments)});var _jDVLCamera_GetTargetNode=Module["_jDVLCamera_GetTargetNode"]=(function(){return Module["asm"]["_jDVLCamera_GetTargetNode"].apply(null,arguments)});var _jDVLCamera_GetUpDirection=Module["_jDVLCamera_GetUpDirection"]=(function(){return Module["asm"]["_jDVLCamera_GetUpDirection"].apply(null,arguments)});var _jDVLCamera_SetFOV=Module["_jDVLCamera_SetFOV"]=(function(){return Module["asm"]["_jDVLCamera_SetFOV"].apply(null,arguments)});var _jDVLCamera_SetFOVBinding=Module["_jDVLCamera_SetFOVBinding"]=(function(){return Module["asm"]["_jDVLCamera_SetFOVBinding"].apply(null,arguments)});var _jDVLCamera_SetMatrix=Module["_jDVLCamera_SetMatrix"]=(function(){return Module["asm"]["_jDVLCamera_SetMatrix"].apply(null,arguments)});var _jDVLCamera_SetName=Module["_jDVLCamera_SetName"]=(function(){return Module["asm"]["_jDVLCamera_SetName"].apply(null,arguments)});var _jDVLCamera_SetOrigin=Module["_jDVLCamera_SetOrigin"]=(function(){return Module["asm"]["_jDVLCamera_SetOrigin"].apply(null,arguments)});var _jDVLCamera_SetOrthoZoomFactor=Module["_jDVLCamera_SetOrthoZoomFactor"]=(function(){return Module["asm"]["_jDVLCamera_SetOrthoZoomFactor"].apply(null,arguments)});var _jDVLCamera_SetRotation=Module["_jDVLCamera_SetRotation"]=(function(){return Module["asm"]["_jDVLCamera_SetRotation"].apply(null,arguments)});var _jDVLCamera_SetTargetDirection=Module["_jDVLCamera_SetTargetDirection"]=(function(){return Module["asm"]["_jDVLCamera_SetTargetDirection"].apply(null,arguments)});var _jDVLCamera_SetTargetNode=Module["_jDVLCamera_SetTargetNode"]=(function(){return Module["asm"]["_jDVLCamera_SetTargetNode"].apply(null,arguments)});var _jDVLCamera_SetUpDirection=Module["_jDVLCamera_SetUpDirection"]=(function(){return Module["asm"]["_jDVLCamera_SetUpDirection"].apply(null,arguments)});var _jDVLCore_CreateEmptyScene=Module["_jDVLCore_CreateEmptyScene"]=(function(){return Module["asm"]["_jDVLCore_CreateEmptyScene"].apply(null,arguments)});var _jDVLCore_CreateRenderer=Module["_jDVLCore_CreateRenderer"]=(function(){return Module["asm"]["_jDVLCore_CreateRenderer"].apply(null,arguments)});var _jDVLCore_DeleteRenderer=Module["_jDVLCore_DeleteRenderer"]=(function(){return Module["asm"]["_jDVLCore_DeleteRenderer"].apply(null,arguments)});var _jDVLCore_DoneRenderer=Module["_jDVLCore_DoneRenderer"]=(function(){return Module["asm"]["_jDVLCore_DoneRenderer"].apply(null,arguments)});var _jDVLCore_ExecuteCallback=Module["_jDVLCore_ExecuteCallback"]=(function(){return Module["asm"]["_jDVLCore_ExecuteCallback"].apply(null,arguments)});var _jDVLCore_GetBuildNumber=Module["_jDVLCore_GetBuildNumber"]=(function(){return Module["asm"]["_jDVLCore_GetBuildNumber"].apply(null,arguments)});var _jDVLCore_GetLibraryPtr=Module["_jDVLCore_GetLibraryPtr"]=(function(){return Module["asm"]["_jDVLCore_GetLibraryPtr"].apply(null,arguments)});var _jDVLCore_GetMajorVersion=Module["_jDVLCore_GetMajorVersion"]=(function(){return Module["asm"]["_jDVLCore_GetMajorVersion"].apply(null,arguments)});var _jDVLCore_GetMicroVersion=Module["_jDVLCore_GetMicroVersion"]=(function(){return Module["asm"]["_jDVLCore_GetMicroVersion"].apply(null,arguments)});var _jDVLCore_GetMinorVersion=Module["_jDVLCore_GetMinorVersion"]=(function(){return Module["asm"]["_jDVLCore_GetMinorVersion"].apply(null,arguments)});var _jDVLCore_GetRendererPtr=Module["_jDVLCore_GetRendererPtr"]=(function(){return Module["asm"]["_jDVLCore_GetRendererPtr"].apply(null,arguments)});var _jDVLCore_Init=Module["_jDVLCore_Init"]=(function(){return Module["asm"]["_jDVLCore_Init"].apply(null,arguments)});var _jDVLCore_InitRenderer=Module["_jDVLCore_InitRenderer"]=(function(){return Module["asm"]["_jDVLCore_InitRenderer"].apply(null,arguments)});var _jDVLCore_LoadScene=Module["_jDVLCore_LoadScene"]=(function(){return Module["asm"]["_jDVLCore_LoadScene"].apply(null,arguments)});var _jDVLCore_LoadSceneFromVDSL=Module["_jDVLCore_LoadSceneFromVDSL"]=(function(){return Module["asm"]["_jDVLCore_LoadSceneFromVDSL"].apply(null,arguments)});var _jDVLCore_OnLowMemory=Module["_jDVLCore_OnLowMemory"]=(function(){return Module["asm"]["_jDVLCore_OnLowMemory"].apply(null,arguments)});var _jDVLCore_Release=Module["_jDVLCore_Release"]=(function(){return Module["asm"]["_jDVLCore_Release"].apply(null,arguments)});var _jDVLCore_SetClientID=Module["_jDVLCore_SetClientID"]=(function(){return Module["asm"]["_jDVLCore_SetClientID"].apply(null,arguments)});var _jDVLCore_SetLocale=Module["_jDVLCore_SetLocale"]=(function(){return Module["asm"]["_jDVLCore_SetLocale"].apply(null,arguments)});var _jDVLLibrary_RetrieveInfo=Module["_jDVLLibrary_RetrieveInfo"]=(function(){return Module["asm"]["_jDVLLibrary_RetrieveInfo"].apply(null,arguments)});var _jDVLLibrary_RetrieveThumbnail=Module["_jDVLLibrary_RetrieveThumbnail"]=(function(){return Module["asm"]["_jDVLLibrary_RetrieveThumbnail"].apply(null,arguments)});var _jDVLMaterial_Clone=Module["_jDVLMaterial_Clone"]=(function(){return Module["asm"]["_jDVLMaterial_Clone"].apply(null,arguments)});var _jDVLMaterial_GetColorParam=Module["_jDVLMaterial_GetColorParam"]=(function(){return Module["asm"]["_jDVLMaterial_GetColorParam"].apply(null,arguments)});var _jDVLMaterial_GetName=Module["_jDVLMaterial_GetName"]=(function(){return Module["asm"]["_jDVLMaterial_GetName"].apply(null,arguments)});var _jDVLMaterial_GetScalarParam=Module["_jDVLMaterial_GetScalarParam"]=(function(){return Module["asm"]["_jDVLMaterial_GetScalarParam"].apply(null,arguments)});var _jDVLMaterial_GetTexture=Module["_jDVLMaterial_GetTexture"]=(function(){return Module["asm"]["_jDVLMaterial_GetTexture"].apply(null,arguments)});var _jDVLMaterial_GetTextureFlag=Module["_jDVLMaterial_GetTextureFlag"]=(function(){return Module["asm"]["_jDVLMaterial_GetTextureFlag"].apply(null,arguments)});var _jDVLMaterial_GetTextureParam=Module["_jDVLMaterial_GetTextureParam"]=(function(){return Module["asm"]["_jDVLMaterial_GetTextureParam"].apply(null,arguments)});var _jDVLMaterial_Release=Module["_jDVLMaterial_Release"]=(function(){return Module["asm"]["_jDVLMaterial_Release"].apply(null,arguments)});var _jDVLMaterial_SetColorParam=Module["_jDVLMaterial_SetColorParam"]=(function(){return Module["asm"]["_jDVLMaterial_SetColorParam"].apply(null,arguments)});var _jDVLMaterial_SetScalarParam=Module["_jDVLMaterial_SetScalarParam"]=(function(){return Module["asm"]["_jDVLMaterial_SetScalarParam"].apply(null,arguments)});var _jDVLMaterial_SetTexture=Module["_jDVLMaterial_SetTexture"]=(function(){return Module["asm"]["_jDVLMaterial_SetTexture"].apply(null,arguments)});var _jDVLMaterial_SetTextureFlag=Module["_jDVLMaterial_SetTextureFlag"]=(function(){return Module["asm"]["_jDVLMaterial_SetTextureFlag"].apply(null,arguments)});var _jDVLMaterial_SetTextureParam=Module["_jDVLMaterial_SetTextureParam"]=(function(){return Module["asm"]["_jDVLMaterial_SetTextureParam"].apply(null,arguments)});var _jDVLRenderer_ActivateCamera=Module["_jDVLRenderer_ActivateCamera"]=(function(){return Module["asm"]["_jDVLRenderer_ActivateCamera"].apply(null,arguments)});var _jDVLRenderer_ActivateStep=Module["_jDVLRenderer_ActivateStep"]=(function(){return Module["asm"]["_jDVLRenderer_ActivateStep"].apply(null,arguments)});var _jDVLRenderer_AttachAuxiliaryScene=Module["_jDVLRenderer_AttachAuxiliaryScene"]=(function(){return Module["asm"]["_jDVLRenderer_AttachAuxiliaryScene"].apply(null,arguments)});var _jDVLRenderer_AttachScene=Module["_jDVLRenderer_AttachScene"]=(function(){return Module["asm"]["_jDVLRenderer_AttachScene"].apply(null,arguments)});var _jDVLRenderer_BeginGesture=Module["_jDVLRenderer_BeginGesture"]=(function(){return Module["asm"]["_jDVLRenderer_BeginGesture"].apply(null,arguments)});var _jDVLRenderer_CanIsolateNode=Module["_jDVLRenderer_CanIsolateNode"]=(function(){return Module["asm"]["_jDVLRenderer_CanIsolateNode"].apply(null,arguments)});var _jDVLRenderer_CreateTexture=Module["_jDVLRenderer_CreateTexture"]=(function(){return Module["asm"]["_jDVLRenderer_CreateTexture"].apply(null,arguments)});var _jDVLRenderer_DetachAuxiliaryScene=Module["_jDVLRenderer_DetachAuxiliaryScene"]=(function(){return Module["asm"]["_jDVLRenderer_DetachAuxiliaryScene"].apply(null,arguments)});var _jDVLRenderer_DrawSelectionRect=Module["_jDVLRenderer_DrawSelectionRect"]=(function(){return Module["asm"]["_jDVLRenderer_DrawSelectionRect"].apply(null,arguments)});var _jDVLRenderer_EndGesture=Module["_jDVLRenderer_EndGesture"]=(function(){return Module["asm"]["_jDVLRenderer_EndGesture"].apply(null,arguments)});var _jDVLRenderer_ForceRenderFrame=Module["_jDVLRenderer_ForceRenderFrame"]=(function(){return Module["asm"]["_jDVLRenderer_ForceRenderFrame"].apply(null,arguments)});var _jDVLRenderer_GetAttachedScenePtr=Module["_jDVLRenderer_GetAttachedScenePtr"]=(function(){return Module["asm"]["_jDVLRenderer_GetAttachedScenePtr"].apply(null,arguments)});var _jDVLRenderer_GetAuxiliarySceneInfo=Module["_jDVLRenderer_GetAuxiliarySceneInfo"]=(function(){return Module["asm"]["_jDVLRenderer_GetAuxiliarySceneInfo"].apply(null,arguments)});var _jDVLRenderer_GetAuxiliaryScenesCount=Module["_jDVLRenderer_GetAuxiliaryScenesCount"]=(function(){return Module["asm"]["_jDVLRenderer_GetAuxiliaryScenesCount"].apply(null,arguments)});var _jDVLRenderer_GetCameraMatrices=Module["_jDVLRenderer_GetCameraMatrices"]=(function(){return Module["asm"]["_jDVLRenderer_GetCameraMatrices"].apply(null,arguments)});var _jDVLRenderer_GetCurrentCamera=Module["_jDVLRenderer_GetCurrentCamera"]=(function(){return Module["asm"]["_jDVLRenderer_GetCurrentCamera"].apply(null,arguments)});var _jDVLRenderer_GetIsolatedNode=Module["_jDVLRenderer_GetIsolatedNode"]=(function(){return Module["asm"]["_jDVLRenderer_GetIsolatedNode"].apply(null,arguments)});var _jDVLRenderer_GetOption=Module["_jDVLRenderer_GetOption"]=(function(){return Module["asm"]["_jDVLRenderer_GetOption"].apply(null,arguments)});var _jDVLRenderer_GetOptionF=Module["_jDVLRenderer_GetOptionF"]=(function(){return Module["asm"]["_jDVLRenderer_GetOptionF"].apply(null,arguments)});var _jDVLRenderer_GetTransitionCamera=Module["_jDVLRenderer_GetTransitionCamera"]=(function(){return Module["asm"]["_jDVLRenderer_GetTransitionCamera"].apply(null,arguments)});var _jDVLRenderer_HitTest=Module["_jDVLRenderer_HitTest"]=(function(){return Module["asm"]["_jDVLRenderer_HitTest"].apply(null,arguments)});var _jDVLRenderer_MultipleHitTest=Module["_jDVLRenderer_MultipleHitTest"]=(function(){return Module["asm"]["_jDVLRenderer_MultipleHitTest"].apply(null,arguments)});var _jDVLRenderer_Pan=Module["_jDVLRenderer_Pan"]=(function(){return Module["asm"]["_jDVLRenderer_Pan"].apply(null,arguments)});var _jDVLRenderer_PauseCurrentStep=Module["_jDVLRenderer_PauseCurrentStep"]=(function(){return Module["asm"]["_jDVLRenderer_PauseCurrentStep"].apply(null,arguments)});var _jDVLRenderer_RectSelect=Module["_jDVLRenderer_RectSelect"]=(function(){return Module["asm"]["_jDVLRenderer_RectSelect"].apply(null,arguments)});var _jDVLRenderer_ReleaseTexture=Module["_jDVLRenderer_ReleaseTexture"]=(function(){return Module["asm"]["_jDVLRenderer_ReleaseTexture"].apply(null,arguments)});var _jDVLRenderer_RenderFrame=Module["_jDVLRenderer_RenderFrame"]=(function(){return Module["asm"]["_jDVLRenderer_RenderFrame"].apply(null,arguments)});var _jDVLRenderer_RenderFrameEx=Module["_jDVLRenderer_RenderFrameEx"]=(function(){return Module["asm"]["_jDVLRenderer_RenderFrameEx"].apply(null,arguments)});var _jDVLRenderer_ResetView=Module["_jDVLRenderer_ResetView"]=(function(){return Module["asm"]["_jDVLRenderer_ResetView"].apply(null,arguments)});var _jDVLRenderer_Rotate=Module["_jDVLRenderer_Rotate"]=(function(){return Module["asm"]["_jDVLRenderer_Rotate"].apply(null,arguments)});var _jDVLRenderer_SetAuxiliarySceneAnchor=Module["_jDVLRenderer_SetAuxiliarySceneAnchor"]=(function(){return Module["asm"]["_jDVLRenderer_SetAuxiliarySceneAnchor"].apply(null,arguments)});var _jDVLRenderer_SetAuxiliarySceneAnchorMatrix=Module["_jDVLRenderer_SetAuxiliarySceneAnchorMatrix"]=(function(){return Module["asm"]["_jDVLRenderer_SetAuxiliarySceneAnchorMatrix"].apply(null,arguments)});var _jDVLRenderer_SetAuxiliarySceneMatrix=Module["_jDVLRenderer_SetAuxiliarySceneMatrix"]=(function(){return Module["asm"]["_jDVLRenderer_SetAuxiliarySceneMatrix"].apply(null,arguments)});var _jDVLRenderer_SetBackgroundColor=Module["_jDVLRenderer_SetBackgroundColor"]=(function(){return Module["asm"]["_jDVLRenderer_SetBackgroundColor"].apply(null,arguments)});var _jDVLRenderer_SetCameraMatrices=Module["_jDVLRenderer_SetCameraMatrices"]=(function(){return Module["asm"]["_jDVLRenderer_SetCameraMatrices"].apply(null,arguments)});var _jDVLRenderer_SetDimensions=Module["_jDVLRenderer_SetDimensions"]=(function(){return Module["asm"]["_jDVLRenderer_SetDimensions"].apply(null,arguments)});var _jDVLRenderer_SetIsolatedNode=Module["_jDVLRenderer_SetIsolatedNode"]=(function(){return Module["asm"]["_jDVLRenderer_SetIsolatedNode"].apply(null,arguments)});var _jDVLRenderer_SetOption=Module["_jDVLRenderer_SetOption"]=(function(){return Module["asm"]["_jDVLRenderer_SetOption"].apply(null,arguments)});var _jDVLRenderer_SetOptionF=Module["_jDVLRenderer_SetOptionF"]=(function(){return Module["asm"]["_jDVLRenderer_SetOptionF"].apply(null,arguments)});var _jDVLRenderer_SetViewStateManager=Module["_jDVLRenderer_SetViewStateManager"]=(function(){return Module["asm"]["_jDVLRenderer_SetViewStateManager"].apply(null,arguments)});var _jDVLRenderer_ShouldRenderFrame=Module["_jDVLRenderer_ShouldRenderFrame"]=(function(){return Module["asm"]["_jDVLRenderer_ShouldRenderFrame"].apply(null,arguments)});var _jDVLRenderer_Tap=Module["_jDVLRenderer_Tap"]=(function(){return Module["asm"]["_jDVLRenderer_Tap"].apply(null,arguments)});var _jDVLRenderer_Zoom=Module["_jDVLRenderer_Zoom"]=(function(){return Module["asm"]["_jDVLRenderer_Zoom"].apply(null,arguments)});var _jDVLRenderer_ZoomTo=Module["_jDVLRenderer_ZoomTo"]=(function(){return Module["asm"]["_jDVLRenderer_ZoomTo"].apply(null,arguments)});var _jDVLScene_ActivateCamera=Module["_jDVLScene_ActivateCamera"]=(function(){return Module["asm"]["_jDVLScene_ActivateCamera"].apply(null,arguments)});var _jDVLScene_ActivateStep=Module["_jDVLScene_ActivateStep"]=(function(){return Module["asm"]["_jDVLScene_ActivateStep"].apply(null,arguments)});var _jDVLScene_BuildPartsList=Module["_jDVLScene_BuildPartsList"]=(function(){return Module["asm"]["_jDVLScene_BuildPartsList"].apply(null,arguments)});var _jDVLScene_ChangeNodeFlags=Module["_jDVLScene_ChangeNodeFlags"]=(function(){return Module["asm"]["_jDVLScene_ChangeNodeFlags"].apply(null,arguments)});var _jDVLScene_CreateCamera=Module["_jDVLScene_CreateCamera"]=(function(){return Module["asm"]["_jDVLScene_CreateCamera"].apply(null,arguments)});var _jDVLScene_CreateNode=Module["_jDVLScene_CreateNode"]=(function(){return Module["asm"]["_jDVLScene_CreateNode"].apply(null,arguments)});var _jDVLScene_CreateNodeCopy=Module["_jDVLScene_CreateNodeCopy"]=(function(){return Module["asm"]["_jDVLScene_CreateNodeCopy"].apply(null,arguments)});var _jDVLScene_DeinstanceContent=Module["_jDVLScene_DeinstanceContent"]=(function(){return Module["asm"]["_jDVLScene_DeinstanceContent"].apply(null,arguments)});var _jDVLScene_DeleteNode=Module["_jDVLScene_DeleteNode"]=(function(){return Module["asm"]["_jDVLScene_DeleteNode"].apply(null,arguments)});var _jDVLScene_Execute=Module["_jDVLScene_Execute"]=(function(){return Module["asm"]["_jDVLScene_Execute"].apply(null,arguments)});var _jDVLScene_FindNodes=Module["_jDVLScene_FindNodes"]=(function(){return Module["asm"]["_jDVLScene_FindNodes"].apply(null,arguments)});var _jDVLScene_GetCurrentCamera=Module["_jDVLScene_GetCurrentCamera"]=(function(){return Module["asm"]["_jDVLScene_GetCurrentCamera"].apply(null,arguments)});var _jDVLScene_GetMaterialByName=Module["_jDVLScene_GetMaterialByName"]=(function(){return Module["asm"]["_jDVLScene_GetMaterialByName"].apply(null,arguments)});var _jDVLScene_GetNodeLocalMatrix=Module["_jDVLScene_GetNodeLocalMatrix"]=(function(){return Module["asm"]["_jDVLScene_GetNodeLocalMatrix"].apply(null,arguments)});var _jDVLScene_GetNodeSelectionInfo=Module["_jDVLScene_GetNodeSelectionInfo"]=(function(){return Module["asm"]["_jDVLScene_GetNodeSelectionInfo"].apply(null,arguments)});var _jDVLScene_GetNodeSubmeshMaterial=Module["_jDVLScene_GetNodeSubmeshMaterial"]=(function(){return Module["asm"]["_jDVLScene_GetNodeSubmeshMaterial"].apply(null,arguments)});var _jDVLScene_GetNodeSubmeshesCount=Module["_jDVLScene_GetNodeSubmeshesCount"]=(function(){return Module["asm"]["_jDVLScene_GetNodeSubmeshesCount"].apply(null,arguments)});var _jDVLScene_GetNodeWorldMatrix=Module["_jDVLScene_GetNodeWorldMatrix"]=(function(){return Module["asm"]["_jDVLScene_GetNodeWorldMatrix"].apply(null,arguments)});var _jDVLScene_Merge=Module["_jDVLScene_Merge"]=(function(){return Module["asm"]["_jDVLScene_Merge"].apply(null,arguments)});var _jDVLScene_PauseCurrentStep=Module["_jDVLScene_PauseCurrentStep"]=(function(){return Module["asm"]["_jDVLScene_PauseCurrentStep"].apply(null,arguments)});var _jDVLScene_PerformAction=Module["_jDVLScene_PerformAction"]=(function(){return Module["asm"]["_jDVLScene_PerformAction"].apply(null,arguments)});var _jDVLScene_Release=Module["_jDVLScene_Release"]=(function(){return Module["asm"]["_jDVLScene_Release"].apply(null,arguments)});var _jDVLScene_Retain=Module["_jDVLScene_Retain"]=(function(){return Module["asm"]["_jDVLScene_Retain"].apply(null,arguments)});var _jDVLScene_RetrieveLayerInfo=Module["_jDVLScene_RetrieveLayerInfo"]=(function(){return Module["asm"]["_jDVLScene_RetrieveLayerInfo"].apply(null,arguments)});var _jDVLScene_RetrieveMetadata=Module["_jDVLScene_RetrieveMetadata"]=(function(){return Module["asm"]["_jDVLScene_RetrieveMetadata"].apply(null,arguments)});var _jDVLScene_RetrieveNodeInfo=Module["_jDVLScene_RetrieveNodeInfo"]=(function(){return Module["asm"]["_jDVLScene_RetrieveNodeInfo"].apply(null,arguments)});var _jDVLScene_RetrieveProcedures=Module["_jDVLScene_RetrieveProcedures"]=(function(){return Module["asm"]["_jDVLScene_RetrieveProcedures"].apply(null,arguments)});var _jDVLScene_RetrieveSceneInfo=Module["_jDVLScene_RetrieveSceneInfo"]=(function(){return Module["asm"]["_jDVLScene_RetrieveSceneInfo"].apply(null,arguments)});var _jDVLScene_RetrieveThumbnail=Module["_jDVLScene_RetrieveThumbnail"]=(function(){return Module["asm"]["_jDVLScene_RetrieveThumbnail"].apply(null,arguments)});var _jDVLScene_RetrieveVEIDs=Module["_jDVLScene_RetrieveVEIDs"]=(function(){return Module["asm"]["_jDVLScene_RetrieveVEIDs"].apply(null,arguments)});var _jDVLScene_SetDynamicLabel=Module["_jDVLScene_SetDynamicLabel"]=(function(){return Module["asm"]["_jDVLScene_SetDynamicLabel"].apply(null,arguments)});var _jDVLScene_SetNodeHighlightColor=Module["_jDVLScene_SetNodeHighlightColor"]=(function(){return Module["asm"]["_jDVLScene_SetNodeHighlightColor"].apply(null,arguments)});var _jDVLScene_SetNodeLocalMatrix=Module["_jDVLScene_SetNodeLocalMatrix"]=(function(){return Module["asm"]["_jDVLScene_SetNodeLocalMatrix"].apply(null,arguments)});var _jDVLScene_SetNodeOpacity=Module["_jDVLScene_SetNodeOpacity"]=(function(){return Module["asm"]["_jDVLScene_SetNodeOpacity"].apply(null,arguments)});var _jDVLScene_SetNodeSubmeshMaterial=Module["_jDVLScene_SetNodeSubmeshMaterial"]=(function(){return Module["asm"]["_jDVLScene_SetNodeSubmeshMaterial"].apply(null,arguments)});var _jDVLScene_SetNodeWorldMatrix=Module["_jDVLScene_SetNodeWorldMatrix"]=(function(){return Module["asm"]["_jDVLScene_SetNodeWorldMatrix"].apply(null,arguments)});var _jDVLScene_SetPOIIcon=Module["_jDVLScene_SetPOIIcon"]=(function(){return Module["asm"]["_jDVLScene_SetPOIIcon"].apply(null,arguments)});var _jDVLScene_UpdateDynamicLabel=Module["_jDVLScene_UpdateDynamicLabel"]=(function(){return Module["asm"]["_jDVLScene_UpdateDynamicLabel"].apply(null,arguments)});var _jDVL_CreateCoreInstance=Module["_jDVL_CreateCoreInstance"]=(function(){return Module["asm"]["_jDVL_CreateCoreInstance"].apply(null,arguments)});var _jDVL_CreateViewStateManager=Module["_jDVL_CreateViewStateManager"]=(function(){return Module["asm"]["_jDVL_CreateViewStateManager"].apply(null,arguments)});var _jDVL_DeleteViewStateManager=Module["_jDVL_DeleteViewStateManager"]=(function(){return Module["asm"]["_jDVL_DeleteViewStateManager"].apply(null,arguments)});var _jDVL_FireNodeHighlightColorChanged=Module["_jDVL_FireNodeHighlightColorChanged"]=(function(){return Module["asm"]["_jDVL_FireNodeHighlightColorChanged"].apply(null,arguments)});var _jDVL_FireNodeOpacityChanged=Module["_jDVL_FireNodeOpacityChanged"]=(function(){return Module["asm"]["_jDVL_FireNodeOpacityChanged"].apply(null,arguments)});var _jDVL_FireNodeSelectionChanged=Module["_jDVL_FireNodeSelectionChanged"]=(function(){return Module["asm"]["_jDVL_FireNodeSelectionChanged"].apply(null,arguments)});var _jDVL_FireNodeVisibilityChanged=Module["_jDVL_FireNodeVisibilityChanged"]=(function(){return Module["asm"]["_jDVL_FireNodeVisibilityChanged"].apply(null,arguments)});var _jDVL_IsErrorString=Module["_jDVL_IsErrorString"]=(function(){return Module["asm"]["_jDVL_IsErrorString"].apply(null,arguments)});var _jDVL_ReleaseString=Module["_jDVL_ReleaseString"]=(function(){return Module["asm"]["_jDVL_ReleaseString"].apply(null,arguments)});var _llvm_bswap_i16=Module["_llvm_bswap_i16"]=(function(){return Module["asm"]["_llvm_bswap_i16"].apply(null,arguments)});var _llvm_bswap_i32=Module["_llvm_bswap_i32"]=(function(){return Module["asm"]["_llvm_bswap_i32"].apply(null,arguments)});var _llvm_round_f32=Module["_llvm_round_f32"]=(function(){return Module["asm"]["_llvm_round_f32"].apply(null,arguments)});var _malloc=Module["_malloc"]=(function(){return Module["asm"]["_malloc"].apply(null,arguments)});var _memalign=Module["_memalign"]=(function(){return Module["asm"]["_memalign"].apply(null,arguments)});var _memcpy=Module["_memcpy"]=(function(){return Module["asm"]["_memcpy"].apply(null,arguments)});var _memmove=Module["_memmove"]=(function(){return Module["asm"]["_memmove"].apply(null,arguments)});var _memset=Module["_memset"]=(function(){return Module["asm"]["_memset"].apply(null,arguments)});var _pthread_cond_broadcast=Module["_pthread_cond_broadcast"]=(function(){return Module["asm"]["_pthread_cond_broadcast"].apply(null,arguments)});var _pthread_mutex_lock=Module["_pthread_mutex_lock"]=(function(){return Module["asm"]["_pthread_mutex_lock"].apply(null,arguments)});var _pthread_mutex_trylock=Module["_pthread_mutex_trylock"]=(function(){return Module["asm"]["_pthread_mutex_trylock"].apply(null,arguments)});var _pthread_mutex_unlock=Module["_pthread_mutex_unlock"]=(function(){return Module["asm"]["_pthread_mutex_unlock"].apply(null,arguments)});var _rintf=Module["_rintf"]=(function(){return Module["asm"]["_rintf"].apply(null,arguments)});var _round=Module["_round"]=(function(){return Module["asm"]["_round"].apply(null,arguments)});var _roundf=Module["_roundf"]=(function(){return Module["asm"]["_roundf"].apply(null,arguments)});var _sbrk=Module["_sbrk"]=(function(){return Module["asm"]["_sbrk"].apply(null,arguments)});var establishStackSpace=Module["establishStackSpace"]=(function(){return Module["asm"]["establishStackSpace"].apply(null,arguments)});var getTempRet0=Module["getTempRet0"]=(function(){return Module["asm"]["getTempRet0"].apply(null,arguments)});var runPostSets=Module["runPostSets"]=(function(){return Module["asm"]["runPostSets"].apply(null,arguments)});var setTempRet0=Module["setTempRet0"]=(function(){return Module["asm"]["setTempRet0"].apply(null,arguments)});var setThrew=Module["setThrew"]=(function(){return Module["asm"]["setThrew"].apply(null,arguments)});var stackAlloc=Module["stackAlloc"]=(function(){return Module["asm"]["stackAlloc"].apply(null,arguments)});var stackRestore=Module["stackRestore"]=(function(){return Module["asm"]["stackRestore"].apply(null,arguments)});var stackSave=Module["stackSave"]=(function(){return Module["asm"]["stackSave"].apply(null,arguments)});var dynCall_di=Module["dynCall_di"]=(function(){return Module["asm"]["dynCall_di"].apply(null,arguments)});var dynCall_dii=Module["dynCall_dii"]=(function(){return Module["asm"]["dynCall_dii"].apply(null,arguments)});var dynCall_fi=Module["dynCall_fi"]=(function(){return Module["asm"]["dynCall_fi"].apply(null,arguments)});var dynCall_fii=Module["dynCall_fii"]=(function(){return Module["asm"]["dynCall_fii"].apply(null,arguments)});var dynCall_fiii=Module["dynCall_fiii"]=(function(){return Module["asm"]["dynCall_fiii"].apply(null,arguments)});var dynCall_i=Module["dynCall_i"]=(function(){return Module["asm"]["dynCall_i"].apply(null,arguments)});var dynCall_ii=Module["dynCall_ii"]=(function(){return Module["asm"]["dynCall_ii"].apply(null,arguments)});var dynCall_iif=Module["dynCall_iif"]=(function(){return Module["asm"]["dynCall_iif"].apply(null,arguments)});var dynCall_iiff=Module["dynCall_iiff"]=(function(){return Module["asm"]["dynCall_iiff"].apply(null,arguments)});var dynCall_iiffff=Module["dynCall_iiffff"]=(function(){return Module["asm"]["dynCall_iiffff"].apply(null,arguments)});var dynCall_iiffffii=Module["dynCall_iiffffii"]=(function(){return Module["asm"]["dynCall_iiffffii"].apply(null,arguments)});var dynCall_iiffii=Module["dynCall_iiffii"]=(function(){return Module["asm"]["dynCall_iiffii"].apply(null,arguments)});var dynCall_iii=Module["dynCall_iii"]=(function(){return Module["asm"]["dynCall_iii"].apply(null,arguments)});var dynCall_iiid=Module["dynCall_iiid"]=(function(){return Module["asm"]["dynCall_iiid"].apply(null,arguments)});var dynCall_iiif=Module["dynCall_iiif"]=(function(){return Module["asm"]["dynCall_iiif"].apply(null,arguments)});var dynCall_iiii=Module["dynCall_iiii"]=(function(){return Module["asm"]["dynCall_iiii"].apply(null,arguments)});var dynCall_iiiif=Module["dynCall_iiiif"]=(function(){return Module["asm"]["dynCall_iiiif"].apply(null,arguments)});var dynCall_iiiifiiiiii=Module["dynCall_iiiifiiiiii"]=(function(){return Module["asm"]["dynCall_iiiifiiiiii"].apply(null,arguments)});var dynCall_iiiii=Module["dynCall_iiiii"]=(function(){return Module["asm"]["dynCall_iiiii"].apply(null,arguments)});var dynCall_iiiiid=Module["dynCall_iiiiid"]=(function(){return Module["asm"]["dynCall_iiiiid"].apply(null,arguments)});var dynCall_iiiiiff=Module["dynCall_iiiiiff"]=(function(){return Module["asm"]["dynCall_iiiiiff"].apply(null,arguments)});var dynCall_iiiiii=Module["dynCall_iiiiii"]=(function(){return Module["asm"]["dynCall_iiiiii"].apply(null,arguments)});var dynCall_iiiiiid=Module["dynCall_iiiiiid"]=(function(){return Module["asm"]["dynCall_iiiiiid"].apply(null,arguments)});var dynCall_iiiiiii=Module["dynCall_iiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiii"].apply(null,arguments)});var dynCall_iiiiiiii=Module["dynCall_iiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiii=Module["dynCall_iiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiiii=Module["dynCall_iiiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_iiiiiiiiiiiii"].apply(null,arguments)});var dynCall_iiiiiiijii=Module["dynCall_iiiiiiijii"]=(function(){return Module["asm"]["dynCall_iiiiiiijii"].apply(null,arguments)});var dynCall_iiiiij=Module["dynCall_iiiiij"]=(function(){return Module["asm"]["dynCall_iiiiij"].apply(null,arguments)});var dynCall_iiiiijii=Module["dynCall_iiiiijii"]=(function(){return Module["asm"]["dynCall_iiiiijii"].apply(null,arguments)});var dynCall_iiiij=Module["dynCall_iiiij"]=(function(){return Module["asm"]["dynCall_iiiij"].apply(null,arguments)});var dynCall_iiiiji=Module["dynCall_iiiiji"]=(function(){return Module["asm"]["dynCall_iiiiji"].apply(null,arguments)});var dynCall_iiiijii=Module["dynCall_iiiijii"]=(function(){return Module["asm"]["dynCall_iiiijii"].apply(null,arguments)});var dynCall_iiij=Module["dynCall_iiij"]=(function(){return Module["asm"]["dynCall_iiij"].apply(null,arguments)});var dynCall_iij=Module["dynCall_iij"]=(function(){return Module["asm"]["dynCall_iij"].apply(null,arguments)});var dynCall_iijf=Module["dynCall_iijf"]=(function(){return Module["asm"]["dynCall_iijf"].apply(null,arguments)});var dynCall_iijfj=Module["dynCall_iijfj"]=(function(){return Module["asm"]["dynCall_iijfj"].apply(null,arguments)});var dynCall_iiji=Module["dynCall_iiji"]=(function(){return Module["asm"]["dynCall_iiji"].apply(null,arguments)});var dynCall_iijii=Module["dynCall_iijii"]=(function(){return Module["asm"]["dynCall_iijii"].apply(null,arguments)});var dynCall_iijiif=Module["dynCall_iijiif"]=(function(){return Module["asm"]["dynCall_iijiif"].apply(null,arguments)});var dynCall_iijiiiij=Module["dynCall_iijiiiij"]=(function(){return Module["asm"]["dynCall_iijiiiij"].apply(null,arguments)});var dynCall_iijiij=Module["dynCall_iijiij"]=(function(){return Module["asm"]["dynCall_iijiij"].apply(null,arguments)});var dynCall_iijij=Module["dynCall_iijij"]=(function(){return Module["asm"]["dynCall_iijij"].apply(null,arguments)});var dynCall_iijj=Module["dynCall_iijj"]=(function(){return Module["asm"]["dynCall_iijj"].apply(null,arguments)});var dynCall_iijji=Module["dynCall_iijji"]=(function(){return Module["asm"]["dynCall_iijji"].apply(null,arguments)});var dynCall_iijjiiij=Module["dynCall_iijjiiij"]=(function(){return Module["asm"]["dynCall_iijjiiij"].apply(null,arguments)});var dynCall_ij=Module["dynCall_ij"]=(function(){return Module["asm"]["dynCall_ij"].apply(null,arguments)});var dynCall_j=Module["dynCall_j"]=(function(){return Module["asm"]["dynCall_j"].apply(null,arguments)});var dynCall_ji=Module["dynCall_ji"]=(function(){return Module["asm"]["dynCall_ji"].apply(null,arguments)});var dynCall_jii=Module["dynCall_jii"]=(function(){return Module["asm"]["dynCall_jii"].apply(null,arguments)});var dynCall_jiii=Module["dynCall_jiii"]=(function(){return Module["asm"]["dynCall_jiii"].apply(null,arguments)});var dynCall_jiiii=Module["dynCall_jiiii"]=(function(){return Module["asm"]["dynCall_jiiii"].apply(null,arguments)});var dynCall_jiiiiii=Module["dynCall_jiiiiii"]=(function(){return Module["asm"]["dynCall_jiiiiii"].apply(null,arguments)});var dynCall_jiij=Module["dynCall_jiij"]=(function(){return Module["asm"]["dynCall_jiij"].apply(null,arguments)});var dynCall_jiji=Module["dynCall_jiji"]=(function(){return Module["asm"]["dynCall_jiji"].apply(null,arguments)});var dynCall_jijiii=Module["dynCall_jijiii"]=(function(){return Module["asm"]["dynCall_jijiii"].apply(null,arguments)});var dynCall_jijij=Module["dynCall_jijij"]=(function(){return Module["asm"]["dynCall_jijij"].apply(null,arguments)});var dynCall_jijjiij=Module["dynCall_jijjiij"]=(function(){return Module["asm"]["dynCall_jijjiij"].apply(null,arguments)});var dynCall_jj=Module["dynCall_jj"]=(function(){return Module["asm"]["dynCall_jj"].apply(null,arguments)});var dynCall_v=Module["dynCall_v"]=(function(){return Module["asm"]["dynCall_v"].apply(null,arguments)});var dynCall_vi=Module["dynCall_vi"]=(function(){return Module["asm"]["dynCall_vi"].apply(null,arguments)});var dynCall_vid=Module["dynCall_vid"]=(function(){return Module["asm"]["dynCall_vid"].apply(null,arguments)});var dynCall_vif=Module["dynCall_vif"]=(function(){return Module["asm"]["dynCall_vif"].apply(null,arguments)});var dynCall_viff=Module["dynCall_viff"]=(function(){return Module["asm"]["dynCall_viff"].apply(null,arguments)});var dynCall_viffffff=Module["dynCall_viffffff"]=(function(){return Module["asm"]["dynCall_viffffff"].apply(null,arguments)});var dynCall_vii=Module["dynCall_vii"]=(function(){return Module["asm"]["dynCall_vii"].apply(null,arguments)});var dynCall_viif=Module["dynCall_viif"]=(function(){return Module["asm"]["dynCall_viif"].apply(null,arguments)});var dynCall_viifffiiiiiiii=Module["dynCall_viifffiiiiiiii"]=(function(){return Module["asm"]["dynCall_viifffiiiiiiii"].apply(null,arguments)});var dynCall_viii=Module["dynCall_viii"]=(function(){return Module["asm"]["dynCall_viii"].apply(null,arguments)});var dynCall_viiif=Module["dynCall_viiif"]=(function(){return Module["asm"]["dynCall_viiif"].apply(null,arguments)});var dynCall_viiiffffifiii=Module["dynCall_viiiffffifiii"]=(function(){return Module["asm"]["dynCall_viiiffffifiii"].apply(null,arguments)});var dynCall_viiifi=Module["dynCall_viiifi"]=(function(){return Module["asm"]["dynCall_viiifi"].apply(null,arguments)});var dynCall_viiii=Module["dynCall_viiii"]=(function(){return Module["asm"]["dynCall_viiii"].apply(null,arguments)});var dynCall_viiiif=Module["dynCall_viiiif"]=(function(){return Module["asm"]["dynCall_viiiif"].apply(null,arguments)});var dynCall_viiiifiiiii=Module["dynCall_viiiifiiiii"]=(function(){return Module["asm"]["dynCall_viiiifiiiii"].apply(null,arguments)});var dynCall_viiiii=Module["dynCall_viiiii"]=(function(){return Module["asm"]["dynCall_viiiii"].apply(null,arguments)});var dynCall_viiiiii=Module["dynCall_viiiiii"]=(function(){return Module["asm"]["dynCall_viiiiii"].apply(null,arguments)});var dynCall_viiiiiii=Module["dynCall_viiiiiii"]=(function(){return Module["asm"]["dynCall_viiiiiii"].apply(null,arguments)});var dynCall_viiiiiiif=Module["dynCall_viiiiiiif"]=(function(){return Module["asm"]["dynCall_viiiiiiif"].apply(null,arguments)});var dynCall_viiiiiiiiiif=Module["dynCall_viiiiiiiiiif"]=(function(){return Module["asm"]["dynCall_viiiiiiiiiif"].apply(null,arguments)});var dynCall_viiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiii"]=(function(){return Module["asm"]["dynCall_viiiiiiiiiiiii"].apply(null,arguments)});var dynCall_viiiij=Module["dynCall_viiiij"]=(function(){return Module["asm"]["dynCall_viiiij"].apply(null,arguments)});var dynCall_viiiji=Module["dynCall_viiiji"]=(function(){return Module["asm"]["dynCall_viiiji"].apply(null,arguments)});var dynCall_viij=Module["dynCall_viij"]=(function(){return Module["asm"]["dynCall_viij"].apply(null,arguments)});var dynCall_viiji=Module["dynCall_viiji"]=(function(){return Module["asm"]["dynCall_viiji"].apply(null,arguments)});var dynCall_viijii=Module["dynCall_viijii"]=(function(){return Module["asm"]["dynCall_viijii"].apply(null,arguments)});var dynCall_vij=Module["dynCall_vij"]=(function(){return Module["asm"]["dynCall_vij"].apply(null,arguments)});var dynCall_viji=Module["dynCall_viji"]=(function(){return Module["asm"]["dynCall_viji"].apply(null,arguments)});Module["asm"]=asm;Module["ccall"]=ccall;Module["cwrap"]=cwrap;function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}ExitStatus.prototype=new Error;ExitStatus.prototype.constructor=ExitStatus;var initialStackTop;var calledMain=false;dependenciesFulfilled=function runCaller(){if(!Module["calledRun"])run();if(!Module["calledRun"])dependenciesFulfilled=runCaller};function run(args){args=args||Module["arguments"];if(runDependencies>0){return}preRun();if(runDependencies>0)return;if(Module["calledRun"])return;function doRun(){if(Module["calledRun"])return;Module["calledRun"]=true;if(ABORT)return;ensureInitRuntime();preMain();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout((function(){setTimeout((function(){Module["setStatus"]("")}),1);doRun()}),1)}else{doRun()}}Module["run"]=run;function exit(status,implicit){if(implicit&&Module["noExitRuntime"]&&status===0){return}if(Module["noExitRuntime"]){}else{ABORT=true;EXITSTATUS=status;STACKTOP=initialStackTop;exitRuntime();if(Module["onExit"])Module["onExit"](status)}Module["quit"](status,new ExitStatus(status))}var abortDecorators=[];function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}if(what!==undefined){out(what);err(what);what=JSON.stringify(what)}else{what=""}ABORT=true;EXITSTATUS=1;throw"abort("+what+"). Build with -s ASSERTIONS=1 for more info."}Module["abort"]=abort;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}Module["noExitRuntime"]=true;run()




			// Emscripten generated code will be inserted before this line.

			/* global Browser, Module, FS, ERRNO_CODES, Pointer_stringify, _jDVL_ReleaseString, console, sap */
			/* eslint-disable new-cap, camelcase */

			FS.createFolder("/", "viewer", true, true);

			function pointerToString(pointer) {
				var string = Pointer_stringify(pointer);
				_jDVL_ReleaseString(pointer);
				return string;
			}

			function parseResult(pointer) {
				var string = pointerToString(pointer);
				return string.indexOf("errorcode") === 0 ? (parseInt(string.substr(15), 16) - 0x100) : JSON.parse(string);
			}

			function stringResult(pointer) {
				var string = pointerToString(pointer);
				return string.indexOf("errorcode") === 0 ? (parseInt(string.substr(15), 16) - 0x100) : string;
			}

			function makeFilename(url) {
				return escape(url.replace(/-/g, "--").replace(/\//g, "-"));
			}

			// The Settings object is used for legacy DVL API.
			/**
			 * The properties exposed in DVL Settings are used internally to track various instance properties.
			 * In general they should be considered readonly unless explicitly stated, and consumed for diagnostic purposes only.
			 *
			 * @typedef {Object} sap.ve.dvl~Settings
			 * @property {boolean} Initialised       A flag that indicates if the runtime is initialized.
			 * @property {number}  MajorVersion      Major version of the DVL library.
			 * @property {number}  MinorVersion      Minor version of the DVL library.
			 * @property {string}  CoreToken         Token of the DVL core instance.
			 * @property {string}  RendererToken     Token of the DVL renderer instance.
			 * @property {string}  LastLoadedSceneId Identifier of the last loaded model.
			 */
			Module.Settings = {
				Initialised: true,
				MajorVersion: null,
				MinorVersion: null,
				CoreToken: null,
				RendererToken: null,
				LastLoadedSceneId: null
			};

			// Client is declared first because the C++ outbound calls will call the client functions.
			// Client functions are *default* implementations and intended to be overwritten by a third party if necessary.
			var dvlClient = {
				constructor: function(clientId) {
					this._forwardToLegacyApi("Constructor", arguments);
				},

				destructor: function(clientId) {
					this._forwardToLegacyApi("Destructor", arguments);
				},

				logMessage: function(clientId, type, source, text) {
					this._forwardToLegacyApi("LogMessage", arguments);
				},

				onNodeSelectionChanged: function(clientId, sceneId, numberOfSelectedNodes, idFirstSelectedNode, rendererId) {
					this._fireNodeSelectionChanged({ clientId: clientId, sceneId: sceneId, numberOfSelectedNodes: numberOfSelectedNodes, idFirstSelectedNode: idFirstSelectedNode, rendererId: rendererId });
					this._forwardToLegacyApi("OnNodeSelectionChanged", arguments);
				},

				onNodeVisibilityChanged: function(clientId, sceneId, nodeId, newVisibility, rendererId) {
					this._fireNodeVisibilityChanged({ clientId: clientId, sceneId: sceneId, nodeId: nodeId, visible: newVisibility, rendererId: rendererId });
				},

				onStepEvent: function(clientId, type, stepId) {
					this._fireStepEvent({ clientId: clientId, type: type, stepId: stepId });
					this._forwardToLegacyApi("OnStepEvent", arguments);
				},

				onUrlClick: function (clientId, url, nodeId) {
					this._fireUrlClicked({ clientId: clientId, url: url, nodeId: nodeId });
					this._forwardToLegacyApi("OnUrlClick", arguments);
				},

				notifyFileLoadProgress: function(clientId, fProgress) {
					return this._forwardToLegacyApi("NotifyFileLoadProgress", arguments) || 1;
				},

				getDebugInfoString: function(clientId) {
					return this._forwardToLegacyApi("GetDebugInfoString", arguments) || clientId + ": from JavaScript Wrapper";
				},

				notifyFrameStarted: function(clientId, rendererId) {
					this._fireFrameStarted({ clientId: clientId, rendererId: rendererId });
					this._forwardToLegacyApi("NotifyFrameStarted", arguments);
				},

				notifyFrameFinished: function(clientId, rendererId) {
					this._fireFrameFinished({ clientId: clientId, rendererId: rendererId });
					this._forwardToLegacyApi("NotifyFrameFinished", arguments);
				},

				notifySceneLoaded: function(clientId, sceneId) {
					this._fireSceneLoaded({ clientId: clientId, sceneId: sceneId });
				},

				notifySceneFailed: function(clientId, sceneId, errorCode) {
					this._fireSceneFailed({ clientId: clientId, sceneId: sceneId, errorCode: errorCode });
				},

				////////////////////////////////////////////////////////////////////
				// BEGIN: Notification handlers.
				attachNodeSelectionChanged: function(callback, listener) {
					return this._attach("_nodeSelectionChangedListeners", callback, listener);
				},

				detachNodeSelectionChanged: function(callback, listener) {
					return this._detach("_nodeSelectionChangedListeners", callback, listener);
				},

				_fireNodeSelectionChanged: function(parameters) {
					return this._fire("_nodeSelectionChangedListeners", parameters);
				},

				attachNodeVisibilityChanged: function(callback, listener) {
					return this._attach("_nodeVisibilityChangedListeners", callback, listener);
				},

				detachNodeVisibilityChanged: function(callback, listener) {
					return this._detach("_nodeVisibilityChangedListeners", callback, listener);
				},

				_fireNodeVisibilityChanged: function(parameters) {
					return this._fire("_nodeVisibilityChangedListeners", parameters);
				},

				attachUrlClicked: function(callback, listener) {
					return this._attach("_urlClickedListeners", callback, listener);
				},

				detachUrlClicked: function(callback, listener) {
					return this._detach("_urlClickedListeners", callback, listener);
				},

				_fireUrlClicked: function(parameters) {
					return this._fire("_urlClickedListeners", parameters);
				},

				attachStepEvent: function(callback, listener) {
					return this._attach("_stepEventListeners", callback, listener);
				},

				detachStepEvent: function(callback, listener) {
					return this._detach("_stepEventListeners", callback, listener);
				},

				_fireStepEvent: function(parameters) {
					return this._fire("_stepEventListeners", parameters);
				},

				attachFrameStarted: function(callback, listener) {
					return this._attach("_frameStarted", callback, listener);
				},

				detachFrameStarted: function(callback, listener) {
					return this._detach("_frameStarted", callback, listener);
				},

				_fireFrameStarted: function(parameters) {
					return this._fire("_frameStarted", parameters);
				},

				attachFrameFinished: function(callback, listener) {
					return this._attach("_frameFinished", callback, listener);
				},

				detachFrameFinished: function(callback, listener) {
					return this._detach("_frameFinished", callback, listener);
				},

				_fireFrameFinished: function(parameters) {
					return this._fire("_frameFinished", parameters);
				},

				attachSceneLoaded: function(callback, listener) {
					return this._attach("_sceneLoaded", callback, listener);
				},

				detachSceneLoaded: function(callback, listener) {
					return this._detach("_sceneLoaded", callback, listener);
				},

				_fireSceneLoaded: function(parameters) {
					return this._fire("_sceneLoaded", parameters);
				},

				attachSceneFailed: function(callback, listener) {
					return this._attach("_sceneFailed", callback, listener);
				},

				detachSceneFailed: function(callback, listener) {
					return this._detach("_sceneFailed", callback, listener);
				},

				_fireSceneFailed: function(parameters) {
					return this._fire("_sceneFailed", parameters);
				},

				// END: Notification handlers.
				////////////////////////////////////////////////////////////////////

				////////////////////////////////////////////////////////////////////
				// BEGIN: Generic notification handlers.

				_attach: function(listenersPropName, callback, listener) {
					var listeners = this[listenersPropName] = this[listenersPropName] || [];
					if (!listeners.some(function(item) { return item.callback === callback && item.listener === listener; })) {
						listeners.push({ callback: callback, listener: listener });
					}
					return this;
				},

				_detach: function(listenersPropName, callback, listener) {
					var listeners = this[listenersPropName] || [];
					for (var i = 0; i < listeners.length; ++i) {
						var item = listeners[i];
						if (item.callback === callback && item.listener === listener) {
							listeners.splice(i, 1);
							break;
						}
					}
					return this;
				},

				_fire: function(listenersPropName, parameters) {
					(this[listenersPropName] || []).slice().forEach(function(item) {
						item.callback.call(item.listener, parameters);
					});
					return this;
				},

				_forwardToLegacyApi: function(method, args) {
					if (Module.Client && Module.Client[method]) {
						return Module.Client[method].apply(Module.Client, args);
					}
				},

				// END: Generic notification handlers.
				////////////////////////////////////////////////////////////////////

				////////////////////////////////////////////////////////////////////
				// BEGIN: Decryption related methods.

				_decryptionHandler: null,

				setDecryptionHandler: function(handler) {
					this._decryptionHandler = handler;
					return this;
				},

				getDecryptionHandler: function() {
					return this._decryptionHandler;
				}

				// END: Decryption related methods.
				////////////////////////////////////////////////////////////////////
			}; // dvlClient

			// The following functions are called from C++.
			// They need to be visible to Emscripten Module.

			function jDVLClient_Constructor(szClientID) {
				dvlClient.constructor(szClientID);
			}

			function jDVLClient_Destructor(szClientID) {
				dvlClient.destructor(szClientID);
			}

			function jDVLClient_OnNodeSelectionChanged(szClientID, szSceneID, uNumberOfSelectedNodes, idFirstSelectedNode, szRendererID) {
				dvlClient.onNodeSelectionChanged(szClientID, szSceneID, uNumberOfSelectedNodes, idFirstSelectedNode, szRendererID);
			}

			function jDVLClient_OnNodeVisibilityChanged(szClientID, szSceneID, szNodeId, bNewVisibility, szRendererID) {
				dvlClient.onNodeVisibilityChanged(szClientID, szSceneID, szNodeId, bNewVisibility, szRendererID);
			}

			function jDVLClient_OnStepEvent(szClientID, type, stepId) {
				dvlClient.onStepEvent(szClientID, type, stepId);
			}

			function jDVLClient_OnUrlClick(szClientID, type, stepId) {
				dvlClient.onUrlClick(szClientID, type, stepId);
			}

			function jDVLClient_LogMessage(szClientID, type, szSource, szText) {
				dvlClient.logMessage(szClientID, type, szSource, szText);
			}

			function jDVLClient_NotifyFileLoadProgress(szClientID, fProgress) {
				return dvlClient.notifyFileLoadProgress(szClientID, fProgress);
			}

			function jDVLClient_NotifyFrameStarted(szClientID, szRendererID) {
				dvlClient.notifyFrameStarted(szClientID, szRendererID);
			}

			function jDVLClient_NotifyFrameFinished(szClientID, szRendererID) {
				dvlClient.notifyFrameFinished(szClientID, szRendererID);
			}

			function jDVLClient_RequestCallback(callbackParam) {
				if (Module.Settings.CoreToken && Module.Settings.LoadAsync) {
					window.setTimeout(function() {
						Module.Core.ExecuteCallback(callbackParam);
					}, 0);
					return true;
				} else {
					return false;
				}
			}

			function jDVLClient_NotifySceneGeometryLoaded(szClientID, szSceneID) {
				dvlClient.notifySceneLoaded(szClientID, szSceneID);
			}

			function jDVLClient_NotifySceneGeometryFailed(szClientID, szSceneID, errorCode) {
				dvlClient.notifySceneFailed(szClientID, szSceneID, errorCode);
			}

			/**
			 * @namespace
			 * @alias sap.ve.dvl~Client
			 */
			Module.Client = {
				Constructor: function(clientId) {
					Module.print("Client.Constructor:" + clientId);
				},

				Destructor: function(clientId) {
					Module.print("Client.Destructor:" + clientId);
				},

				/**
				 * Reports a warning, error, etc.
				 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {number} type     <code>[DVLCLIENTLOGTYPE]{@link sap.ve.dvl.DVLCLIENTLOGTYPE}<code> enum.
				 *                          The type of message to report (DEBUG, INFO, WARNING, ERROR).
				 * @param {string} source   Text representation of the message source. Can be <code>null</code>.
				 *                          <table class="params">
				 *                              <thead><tr><th>Source</th><th class="last">Description</th></tr></thead>
				 *                              <tr><td>OpenGL</td><td class="last">OpenGL rendering layer.</td></tr>
				 *                              <tr><td>Memory</td><td class="last">Memory management routines.</td></tr>
				 *                              <tr><td>LocalFileSystem</td><td class="last">Emscripten virtual local file system manager.</td></tr>
				 *                              <tr><td>VDS</td><td class="last">VDS file reading routines.</td></tr>
				 *                              <tr><td>Scene</td><td class="last">Scene manipulation routines.</td></tr>
				 *                          </table>
				 * @param {string} text     The text message to display. Can be <code>null</code>.
				 */
				LogMessage: function(clientId, type, source, text) {
					Module.print("Client.LogMessage:(" + text + ")");
				},

				/**
				 * Indicates that the selection list has changed.
				 * @param {string} clientId              Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} sceneId               Scene token.
				 * @param {number} numberOfSelectedNodes The number of nodes selected in the list.
				 * @param {string} idFirstSelectedNode   DVLID of the first selected node, or <code>[DVLID_INVALID]{@link sap.ve.dvl.DVLID_INVALID}</code> if none selected.
				 * @deprecated since version 6.2.0. Use [attachNodeSelectionChanged]{@link sap.ve.dvl~Client.attachNodeSelectionChanged}.
				 */
				OnNodeSelectionChanged: function(clientId, sceneId, numberOfSelectedNodes, idFirstSelectedNode, rendererId) {
				},

				/**
				 * Notifies about the step phase that's just been completed.
				 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {number} type     The [DVLSTEPEVENT]{@link sap.ve.dvl.DVLSTEPEVENT} type of the event that happened to the step.
				 * @param {string} stepId   The identifier of the step.
				 * @deprecated since version 6.2.0. Use [attachStepEvent]{@link sap.ve.dvl~Client.attachStepEvent}.
				 */
				OnStepEvent: function(clientId, type, stepId) {
				},

				/**
				 * Called when URL link is clicked.
				 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} url      URL link which is clicked.
				 * @param {string} nodeId   The identifier of the node.
				 * @deprecated since version 6.2.0. Use [attachUrlClicked]{@link sap.ve.dvl~Client.attachUrlClicked}.
				 */
				OnUrlClick: function (clientId, url, nodeId) {
				},

				/**
				 * Notifies about the file loading progress (which may be quite time consuming), and to check if the user wants to abort file loading.
				 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {number} progress A value from <code>0.0</code> to <code>1.0</code> indicating the file loading progress (where <code>1.0</code> means loading is complete).
				 * @returns {boolean}       Return <code>true</code> to proceed with file loading, return <code>false</code> if the loading needs to be canceled.
				 */
				NotifyFileLoadProgress: function(clientId, progress) {
					return true;
				},

				/**
				 * Displays custom information on top of rendered image together with debug information from the renderer.
				 * Only displays the information if <code>[DVLRENDEROPTION.DVLRENDEROPTION_SHOWDEBUG_INFO]{@link sap.ve.dvl.DVLRENDEROPTION}</code> is <code>ON</code>.
				 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
				 * @returns {string}        Return <code>null</code> if you don't need to display any custom text,
				 *                          otherwise return a string with custom text if you need to display something.
				 */
				GetDebugInfoString: function(clientId) {
					return clientId + ": from JavaScript Wrapper";
				},

				/**
				 * Notifies when frame rendering has started.
				 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} rendererId Token representing the renderer instance.
				 * @deprecated since version 6.3.0. Use [attachFrameStarted]{@link sap.ve.dvl~Client.attachFrameStarted}.
				 */
				NotifyFrameStarted: function(clientId, rendererId) {
				},

				/**
				 * Notifies when frame rendering has finished.
				 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} rendererId Token representing the renderer instance.
				 * @deprecated since version 6.3.0. Use [attachFrameFinished]{@link sap.ve.dvl~Client.attachFrameFinished}.
				 */
				NotifyFrameFinished: function(clientId, rendererId) {
				},

				/**
				 * This callback is called when the Node Selection Changed event is fired.
				 * @callback sap.ve.dvl~Client~nodeSelectionChangedCallback
				 * @param {object} parameters                       A map of parameters. See below.
				 * @param {string} parameters.clientId              Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} parameters.sceneId               Scene token.
				 * @param {number} parameters.numberOfSelectedNodes The number of selected nodes.
				 * @param {string} parameters.idFirstSelectedNode   DVLID of the first selected node, or <code>[DVLID_INVALID]{@link sap.ve.dvl.DVLID_INVALID}</code> if none selected.
				 * @param {string} parameters.rendererId            Renderer token.
				 */

				/**
				 * Attach the Node Selection Changed event listener.
				 * @param  {sap.ve.dvl~Client~nodeSelectionChangedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                         listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                                       <code>this</code> to allow method chaining.
				 */
				attachNodeSelectionChanged: function(callback, listener) {
					dvlClient.attachNodeSelectionChanged(callback, listener);
					return this;
				},

				/**
				 * Detach the Node Selection Changed event listener.
				 * @param  {sap.ve.dvl~Client~nodeSelectionChangedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                         listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                                       <code>this</code> to allow method chaining.
				 */
				detachNodeSelectionChanged: function(callback, listener) {
					dvlClient.detachNodeSelectionChanged(callback, listener);
					return this;
				},

				/**
				 * This callback is called when the Node Visibility Changed event is fired.
				 * @callback sap.ve.dvl~Client~nodeVisibilityChangedCallback
				 * @param {object}  parameters            A map of parameters. See below.
				 * @param {string}  parameters.clientId   Token representing the target client instance. This is usually the canvas ID.
				 * @param {string}  parameters.sceneId    Scene token.
				 * @param {string}  parameters.nodeId     The ID of the node.
				 * @param {boolean} parameters.visible    The new visibility state of the node.
				 * @param {string}  parameters.rendererId Renderer token.
				 */

				/**
				 * Attach the Node Visibility Changed event listener.
				 * @param  {sap.ve.dvl~Client~nodeVisibilityChangedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                          listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                                        <code>this</code> to allow method chaining.
				 */
				attachNodeVisibilityChanged: function(callback, listener) {
					dvlClient.attachNodeVisibilityChanged(callback, listener);
					return this;
				},

				/**
				 * Detach the Node Visibility Changed event listener.
				 * @param  {sap.ve.dvl~Client~nodeVisibilityChangedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                          listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                                        <code>this</code> to allow method chaining.
				 */
				detachNodeVisibilityChanged: function(callback, listener) {
					dvlClient.detachNodeVisibilityChanged(callback, listener);
					return this;
				},

				/**
				 * This callback is called when the URL Clicked event is fired.
				 * @callback sap.ve.dvl~Client~urlClickedCallback
				 * @param {object} parameters          A map of parameters. See below.
				 * @param {string} parameters.clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} parameters.url      A URL that was clicked on.
				 * @param {string} parameters.nodeId   A node ID that was clicked on.
				 */

				/**
				 * Attach the URL Clicked event listener.
				 * @param  {sap.ve.dvl~Client~urlClickedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                               listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                             <code>this</code> to allow method chaining.
				 */
				attachUrlClicked: function(callback, listener) {
					dvlClient.attachUrlClicked(callback, listener);
					return this;
				},

				/**
				 * Detach the URL Clicked event listener.
				 *
				 * The passed function and listener object must match the ones used for event registration.
				 * @param  {sap.ve.dvl~Client~urlClickedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                               listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                             <code>this</code> to allow method chaining.
				 */
				detachUrlClicked: function(callback, listener) {
					dvlClient.detachUrlClicked(callback, listener);
					return this;
				},

				/**
				 * This callback is called when the Step Event is fired.
				 * @callback sap.ve.dvl~Client~stepEventCallback
				 * @param {object} parameters          A map of parameters. See below.
				 * @param {string} parameters.clientId Token representing the target client instance. This is usually the canvas ID.
				 * @param {number} parameters.type     The [DVLSTEPEVENT]{@link sap.ve.dvl.DVLSTEPEVENT} type of the event that happened to the step.
				 * @param {string} parameters.stepId   The identifier of the step.
				 */

				/**
				 * Attach the Step Event listener.
				 * @param  {sap.ve.dvl~Client~stepEventCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                              listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                            <code>this</code> to allow method chaining.
				 */
				attachStepEvent: function(callback, listener) {
					dvlClient.attachStepEvent(callback, listener);
					return this;
				},

				/**
				 * Detach the Step Event listener.
				 * @param  {sap.ve.dvl~Client~stepEventCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                              listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                            <code>this</code> to allow method chaining.
				 */
				detachStepEvent: function(callback, listener) {
					dvlClient.detachStepEvent(callback, listener);
					return this;
				},

				/**
				 * This callback is called when the Frame Started event is fired.
				 * @callback sap.ve.dvl~Client~frameStartedCallback
				 * @param {object} parameters            A map of parameters. See below.
				 * @param {string} parameters.clientId   Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} parameters.rendererId Token representing the renderer instance.
				 */

				/**
				 * Attach the Frame Started event listener.
				 * @param {sap.ve.dvl~Client~frameStartedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                              <code>this</code> to allow method chaining.
				 */
				attachFrameStarted: function(callback, listener) {
					dvlClient.attachFrameStarted(callback, listener);
					return this;
				},

				/**
				 * Detach the Frame Started event listener.
				 * @param  {sap.ve.dvl~Client~frameStartedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                 listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                               <code>this</code> to allow method chaining.
				 */
				detachFrameStarted: function(callback, listener) {
					dvlClient.detachFrameStarted(callback, listener);
					return this;
				},

				/**
				 * This callback is called when the Frame Finished event is fired.
				 * @callback sap.ve.dvl~Client~frameFinishedCallback
				 * @param {object} parameters            A map of parameters. See below.
				 * @param {string} parameters.clientId   Token representing the target client instance. This is usually the canvas ID.
				 * @param {string} parameters.rendererId Token representing the renderer instance.
				 */

				/**
				 * Attach the Frame Finished event listener.
				 * @param {sap.ve.dvl~Client~frameFinishedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                 listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                               <code>this</code> to allow method chaining.
				 */
				attachFrameFinished: function(callback, listener) {
					dvlClient.attachFrameFinished(callback, listener);
					return this;
				},

				/**
				 * Detach the Frame Finished event listener.
				 * @param  {sap.ve.dvl~Client~frameFinishedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                  listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                                <code>this</code> to allow method chaining.
				 */
				detachFrameFinished: function(callback, listener) {
					dvlClient.detachFrameFinished(callback, listener);
					return this;
				},


				/**
				 * Attach the Scene Loaded event listener.
				 * @param  {sap.ve.dvl~Client~sceneLoadedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                     <code>this</code> to allow method chaining.
				 */
				attachSceneLoaded: function(callback, listener) {
					dvlClient.attachSceneLoaded(callback, listener);
					return this;
				},

				/**
				 * Detach the Scene Loaded event listener.
				 * @param  {sap.ve.dvl~Client~sceneLoadedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                     <code>this</code> to allow method chaining.
				 */
				detachSceneLoaded: function(callback, listener) {
					dvlClient.detachSceneLoaded(callback, listener);
					return this;
				},

				/**
				 * Attach the Scene Failed event listener.
				 * @param  {sap.ve.dvl~Client~sceneFailedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                     <code>this</code> to allow method chaining.
				 */
				attachSceneFailed: function(callback, listener) {
					dvlClient.attachSceneFailed(callback, listener);
					return this;
				},

				/**
				 * Detach the Scene Failed event listener.
				 * @param  {sap.ve.dvl~Client~sceneFailedCallback} callback The function to be called when the event occurs.
				 * @param  {Object}                                listener The context object to call the event handler with.
				 * @return {sap.ve.dvl~Client}                     <code>this</code> to allow method chaining.
				 */
				detachSceneFailed: function(callback, listener) {
					dvlClient.detachSceneFailed(callback, listener);
					return this;
				},

				/**
				 * @interface Contract for objects that implement decryption.
				 *
				 * An interface for an object provided by an application to decrypt content of encrypted models.
				 *
				 * Content is encrypted with the [AES128]{@link https://en.wikipedia.org/wiki/Advanced_Encryption_Standard} algorithm
				 * in the [CBC]{@link https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher_Block_Chaining_.28CBC.29} mode.
				 *
				 * A key is derived with the [PBKDF2]{@link https://en.wikipedia.org/wiki/PBKDF2} algorithm by applying the
				 * [HMAC]{@link https://en.wikipedia.org/wiki/Hash-based_message_authentication_code}-[SHA256]{@link https://en.wikipedia.org/wiki/SHA-2}
				 * function 10,000 times.
				 *
				 * @example <caption>A sample implementation and usage of the sap.ve.dvl.DecryptionHandler interface with the [asmCrypto]{@link https://github.com/vibornoff/asmcrypto.js} library.</caption>
				 *
				 *   ...
				 *   <script src="http://vibornoff.com/asmcrypto.js"></script>
				 *   ...
				 *   var decryptionHandler = {
				 *       deriveKey: function(salt, password) {
				 *           try {
				 *               return asmCrypto.PBKDF2_HMAC_SHA256.bytes(password, salt, 10000, 16);
				 *           } catch (ex) {
				 *               return null;
				 *           }
				 *       },
				 *       decrypt: function(key, iv, input) {
				 *           try {
				 *               return asmCrypto.AES_CBC.decrypt(input, key, true, iv);
				 *           } catch (ex) {
				 *               return null;
				 *           }
				 *       }
				 *   };
				 *   ...
				 *   var dvl = ...
				 *   dvl.Client.setDecryptionHandler(decryptionHandler);
				 *   ...
				 *
				 * @name sap.ve.dvl.DecryptionHandler
				 * @public
				 */

				/**
				 * Generates a cryptographic session key derived from a base data value.
				 *
				 * The key must be derived with the [PBKDF2]{@link https://en.wikipedia.org/wiki/PBKDF2} algorithm by applying the
				 * [HMAC]{@link https://en.wikipedia.org/wiki/Hash-based_message_authentication_code}-[SHA256]{@link https://en.wikipedia.org/wiki/SHA-2}
				 * function 10,000 times.
				 *
				 * The resulting 128-bit key should be passed to subseqeunt calls to [sap.ve.dvl.DecryptionHandler.decrypt]{@link sap.ve.dvl.DecryptionHandler#decrypt}.
				 *
				 * @name sap.ve.dvl.DecryptionHandler.prototype.deriveKey
				 * @function
				 * @param {Uint8Array} salt Random data that is used as an additional input to a one-way function that "hashes" a password or passphrase.
				 * @param {Uint8Array} password A password used for encryption/decryption.
				 * @return {object} A derived 128-bit key that should be passed to subsequent calls to [sap.ve.dvl.DecryptionHandler.decrypt]{@link sap.ve.dvl.DecryptionHandler#decrypt}.
				 * @public
				 */

				/**
				 * Decrypts the input buffer with the [AES128]{@link https://en.wikipedia.org/wiki/Advanced_Encryption_Standard} algorithm
				 * in the [CBC]{@link https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher_Block_Chaining_.28CBC.29} mode.
				 *
				 * @name sap.ve.dvl.DecryptionHandler.prototype.decrypt
				 * @function
				 * @param {object} key The derived key generated by the previous call to [sap.ve.dvl.DecryptionHandler.deriveKey]{@link sap.ve.dvl.DecryptionHandler#deriveKey}.
				 * @param {Uint8Array} iv The 128-bit [initialization vector]{@link https://en.wikipedia.org/wiki/Initialization_vector}.
				 * @param {Uint8Array} encryptedData The encrypted buffer.
				 * @return {Uint8Array} The decrypted buffer.
				 * @public
				 */

				/**
				 * Sets an object that decrypts content of encrypted models.
				 * @param {sap.ve.dvl.DecryptionHandler} handler An object that decrypts content of encrypted models.
				 * @return {sap.ve.dvl~Client}                   <code>this</code> to allow method chaining.
				 */
				setDecryptionHandler: function(handler) {
					dvlClient.setDecryptionHandler(handler);
					return this;
				},

				/**
				 * Gets an object that decrypts content of encrypted models.
				 * @return {sap.ve.dvl.DecryptionHandler} An object that decrypts content of encrypted models.
				 */
				getDecryptionHandler: function() {
					return dvlClient.getDecryptionHandler();
				}
			}; // Module.Client

			function checkMetadata(path, metadata, mode, str) {
				for (var key in metadata) {
					var value = metadata[key];
					if (typeof value === "string") {
						var name = path + key + "==" + value;
						switch (mode) {
						case 0: //DVLFINDNODEMODE_EQUAL
							if (name == str) {
								console.log(name);
								return true;
							}
							break;
						case 1: //DVLFINDNODEMODE_EQUAL_CASE_INSENSITIVE
							if (name.toLowerCase() == str) {
								console.log(name);
								return true;
							}
							break;
						case 2: //DVLFINDNODEMODE_SUBSTRING
							if (name.indexOf(str) != -1) {
								console.log(name);
								return true;
							}
							break;
						case 3: //DVLFINDNODEMODE_SUBSTRING_CASE_INSENSITIVE
							if (name.toLowerCase().indexOf(str) != -1) {
								console.log(name);
								return true;
							}
							break;
						case 4: //DVLFINDNODEMODE_STARTS_WITH
							if (name.startsWith(str)) {
								console.log(name);
								return true;
							}
							break;
						case 5: //DVLFINDNODEMODE_STARTS_WITH_CASE_INSENSITIVE
							if (name.toLowerCase().startsWith(str)) {
								console.log(name);
								return true;
							}
							break;
						}
					} else {
						if (checkMetadata(path + key + "/", value, mode, str)) {
							//console.log(key);
							return true;
						}
					}
				}

				return false;
			}

			/**
			 * @namespace
			 * @alias sap.ve.dvl~Scene
			 */
			Module.Scene = {
				/**
				 * Retrieves information about the current scene.
				 * @param {string}                  sceneId Scene token.
				 * @param {sap.ve.dvl.DVLSCENEINFO} flags   Bitfield combination of one or more [DVLSCENEINFO]{@link sap.ve.dvl.DVLSCENEINFO} flags.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure depending on flags:<br>
				 * <pre>
				 * {
				 *      "ChildNodes":         [string, ...],
				 *      "SelectedNodes":      [string, ...],
				 *      "LocalizationPrefix": string,
				 *      "SceneDimensions":    [number, number, number, number, number, number],
				 *      "StepId":             string,
				 *      "StepTime":           number,
				 *      "Layers":             [string, ...]
				 * }
				 * </pre>
				 */
				RetrieveSceneInfo: function(sceneId, flags) {
					return parseResult(Module.ccall("jDVLScene_RetrieveSceneInfo", "number", ["string", "number"], [sceneId, flags]));
				},

				/**
				 * Used for checking the node selection state. For example, "Show selected nodes" is only available if there is at least 1 invisible node selected.
				 * @param {string} sceneId Scene token.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure:<br>
				 * <pre>
				 * {
				 *      "HiddenSelectedNodesCount":  number,
				 *      "TotalSelectedNodesCount":   number,
				 *      "VisibleSelectedNodesCount": number
				 * }
				 * </pre>
				 */
				GetNodeSelectionInfo: function(sceneId) {
					return parseResult(Module.ccall("jDVLScene_GetNodeSelectionInfo", "number", ["string"], [sceneId]));
				},

				/**
				 * Executes a particular action on the current scene.
				 * @param {string}                    sceneId Scene token.
				 * @param {sap.ve.dvl.DVLSCENEACTION} action  The action to execute.
				 */
				PerformAction: function(sceneId, action) {
					Module.ccall("jDVLScene_PerformAction", null, ["string", "number"], [sceneId, action]);
				},

				/**
				 * Retrieves information about a particular node.
				 * @param {string}                 sceneId Scene token.
				 * @param {string}                 dvlId   The node ID.
				 * @param {sap.ve.dvl.DVLNODEINFO} flags   Bitfield combination of one or more [DVLNODEINFO]{@link sap.ve.dvl.DVLNODEINFO} flags.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure depending on flags:<br>
				 * <pre>
				 * {
				 *      "NodeName":       string,
				 *      "AssetID":        string,
				 *      "UniqueID":       string,
				 *      "ParentNodes":    [string, ...],
				 *      "ChildNodes":     [string, ...],
				 *      "Flags":          number,
				 *      "Opacity":        number,
				 *      "HighlightColor": number,
				 *      "URIs":           [string, ...]
				 * }
				 * </pre>
				 */
				RetrieveNodeInfo: function(sceneId, dvlid, flags) {
					return parseResult(Module.ccall("jDVLScene_RetrieveNodeInfo", "number", ["string", "string", "number"], [sceneId, dvlid, flags]));
				},

				/**
				 * Retrieves metadata for the specified node.
				 * @param {string} sceneId Scene token.
				 * @param {string} dvlId   The node ID.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure:<br>
				 * <pre>
				 * {
				 *      "metadata": {
				 *          [JSON]
				 *      }
				 * }
				 * </pre>
				 */
				RetrieveMetadata: function(sceneId, dvlid) {
					return parseResult(Module.ccall("jDVLScene_RetrieveMetadata", "number", ["string", "string"], [sceneId, dvlid]));
				},

				/**
				 * Retrieves VEID (Visual Enterprise ID) for the specified node.
				 * @param {string} sceneId Scene token.
				 * @param {string} dvlId   The node ID.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an array of objects with the following structure:<br>
				 * <pre>
				 * {
				 *     "type":   string,
				 *     "source": string,
				 *     "fields": [
				 *         {
				 *             "name":  string,
				 *             "value": string
				 *         },
				 *         ...
				 *     ]
				 * }
				 * </pre>
				 */
				RetrieveVEIDs: function(sceneId, dvlid) {
					return parseResult(Module.ccall("jDVLScene_RetrieveVEIDs", "number", ["string", "string"], [sceneId, dvlid]));
				},

				/**
				 * Retrieves information about a particular Layer.
				 * @param {string} sceneId - Token returned from {@link Module.Core.LoadScene LoadScene}.
				 * @param {string} dvlId - The ID of the Layer.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure:<br>
				 * <pre>
				 * {
				 *     "name":           string,
				 *     "description":    string,
				 *     "isHotspotLayer": boolean,
				 *     "nodes":          [string, ...]
				 * }
				 * </pre>
				 */
				RetrieveLayerInfo: function(sceneId, dvlid) {
					return parseResult(Module.ccall("jDVLScene_RetrieveLayerInfo", "number", ["string", "string"], [sceneId, dvlid]));
				},

				/**
				 * Retrieves a thumbnail of the specified step as a Base64 encoded string.
				 * @param {string} sceneId Scene token.
				 * @param {string} dvlId   The step ID.
				 * @returns {string|sap.ve.dvl.DVLRESULT} An image encoded as a Base64 string or an error code if fails.
				 */
				RetrieveThumbnail: function(sceneId, dvlid) {
					return stringResult(Module.ccall("jDVLScene_RetrieveThumbnail", "number", ["string", "string"], [sceneId, dvlid]));
				},

				/**
				 * Builds a parts list based on input parameter constraints.
				 * @param {string}                      sceneId              Scene token.
				 * @param {number}                      maxParts             Maximum number of parts required.
				 * @param {number}                      maxNodesInSinglePart Maximum number of nodes in a single part to be saved. If more nodes belong to a part, they will be ignored.
				 * @param {number}                      MaxPartNameLength    Maximum length of part name.
				 * @param {sap.ve.dvl.DVLPARTSLISTTYPE} type                 The type of parts to search for.
				 * @param {sap.ve.dvl.DVLPARTSLISTSORT} sort                 Specifies how to sort the parts list.
				 * @param {string}                      dvlidConsumedStep    The DVLID of the step for which to build the parts list. Only used when type is <code>DVLPARTSLISTTYPE_CONSUMED_BY_STEP</code>, set to <code>[DVLID_INVALID]{@link sap.ve.dvl.DVLID_INVALID}</code> or any other value if not.
				 * @param {string}                      substring            Only parts that include substring are returned.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure.<br>
				 * <pre>
				 * {
				 *      "parts": [
				 *          {
				 *              "name":  string,
				 *              "nodes": [string, ...]
				 *          },
				 *          ...
				 *      ]
				 * }
				 * </pre>
				 */
				BuildPartsList: function(sceneId, maxParts, maxNodesInSinglePart, maxPartNameLength, type, sort, dvlidConsumedStep, substring) {
					return parseResult(Module.ccall("jDVLScene_BuildPartsList", "number",
						["string", "number", "number", "number", "number", "number", "string", "string"],
						[sceneId, maxParts, maxNodesInSinglePart, maxPartNameLength, type, sort, dvlidConsumedStep, substring]));
				},

				/**
				 * Finds a list of scene nodes by matching them using a string parameter (different search types are possible: by node name, asset ID or unique ID).
				 * @param {string}                     sceneId Scene token.
				 * @param {sap.ve.dvl.DVLFINDNODETYPE} type    Specifies what node information to use in the search.
				 * @param {sap.ve.dvl.DVLFINDNODEMODE} mode    Specifies the method to use for finding nodes.
				 * @param {string}                     str     String identifier to search on (depends on the value specified for the "<code>type</code>" parameter).
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure:<br>
				 * <pre>
				 * {
				 *      "nodes": [string, ...]
				 * }
				 * </pre>
				 */
				FindNodes: function(sceneId, type, mode, str) {
					if (type == DvlEnums.DVLFINDNODETYPE.DVLFINDNODETYPE_METADATA) {
						if (typeof mode !== "number" || typeof str !== "string") {
							return DvlEnums.DVLRESULT.BADARG;
						}

						var res = parseResult(Module.ccall("jDVLScene_FindNodes", "number", ["string", "number", "number", "string"],
								[sceneId, DvlEnums.DVLFINDNODETYPE.DVLFINDNODETYPE_NODE_NAME, DvlEnums.DVLFINDNODEMODE.DVLFINDNODEMODE_SUBSTRING, ""]));
						if (typeof res === "number" || !res.hasOwnProperty("nodes")) {
							return res;
						}

						if (mode % 2) {
							str = str.toLowerCase();
						}

						var out = {nodes:[]};
						for (var i = 0; i < res.nodes.length; i++) {
							var metadata = parseResult(Module.ccall("jDVLScene_RetrieveMetadata", "number", ["string", "string"], [sceneId, res.nodes[i]]));
							if (typeof metadata === "number" || !metadata.hasOwnProperty("metadata")) {
								continue;
							}

							if (checkMetadata("", metadata.metadata, mode, str)) {
								console.log(res.nodes[i]);
								out.nodes.push(res.nodes[i]);
							}
						}

						return out;
					} else {
						return parseResult(Module.ccall("jDVLScene_FindNodes", "number",
							["string", "number", "number", "string"],
							[sceneId, type, mode, str]));
					}
				},

				/**
				 * Retrieves a list of procedures and portfolios in the scene.
				 * @param {string} sceneId Scene token.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure:<br>
				 * <pre>
				 * {
				 *      "procedures": [
				 *          {
				 *              "name": string,
				 *              "id":   string,
				 *              "steps": [
				 *                  {
				 *                      "name":        string,
				 *                      "id":          string,
				 *                      "description": string
				 *                  },
				 *                  ...
				 *              ]
				 *          },
				 *          ...
				 *      ],
				 *      "portfolios": [
				 *          {
				 *              "name": string,
				 *              "id":   string,
				 *              "steps": [
				 *                  {
				 *                      "name":        string,
				 *                      "id":          string,
				 *                      "description": string
				 *                  },
				 *                  ...
				 *              ]
				 *          },
				 *          ...
				 *      ]
				 * }
				 * </pre>
				 */
				RetrieveProcedures: function(sceneId) {
					return parseResult(Module.ccall("jDVLScene_RetrieveProcedures", "number", ["string"], [sceneId]));
				},

				/**
				 * Activates a step by playing its animation. Optionally plays steps that come after this step.
				 * @param {string}  sceneId           Scene token.
				 * @param {string}  dvlId             The identifier of the step or model view to activate.
				 * @param {boolean} fromTheBeginning  Play the step from beginning, or from the currently paused position.
				 * @param {boolean} continueToTheNext What to do after the current step has finished playing: play the next steps, or stop.
				 * @param {number}  stepTime          The time at which the step animation starts (in seconds). By default, <code>stepTime</code> is set to <code>-1</code>.<br>
				 *                                    Providing a negative value results in a cross-fade transition to the step to activate,
				 *                                    and starts playing that step from time = 0.
				 *                                    Providing a value of 0 or more will instantaneously switch to the camera orientation of the step to activate,
				 *                                    and starts playing that step from time = 0.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				ActivateStep: function(sceneId, dvlid, fromTheBeginning, continueToTheNext, stepTime) {
					return Module.ccall("jDVLScene_ActivateStep", "number", ["string", "string", "boolean", "boolean", "number"], [sceneId, dvlid, fromTheBeginning, continueToTheNext, typeof stepTime !== "undefined" ? stepTime : -1]);
				},

				/**
				 * Pauses the current step, if any.
				 * @param {string} sceneId Scene token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				PauseCurrentStep: function(sceneId) {
					return Module.ccall("jDVLScene_PauseCurrentStep", "number", ["string"], [sceneId]);
				},

				/**
				 * Changes some node flags.
				 * @param {string}                      sceneId Scene token.
				 * @param {string}                      dvlId   The node ID.
				 * @param {sap.ve.dvl.DVLNODEFLAG}      flags   Bitfield combination of one or more [DVLNODEFLAG]{@link sap.ve.dvl.DVLNODEFLAG} flags.
				 * @param {sap.ve.dvl.DVLFLAGOPERATION} flagop  The flag operarion to apply.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				ChangeNodeFlags: function(sceneId, dvlid, flags, flagop) { //DVLFLAGOPERATION flagop
					return Module.ccall("jDVLScene_ChangeNodeFlags", "number", ["string", "string", "number", "number"], [sceneId, dvlid, flags, flagop]);
				},

				/**
				 * Sets the opacity for a specified node.
				 * @param {string} sceneId Scene token.
				 * @param {string} dvlId   The node ID.
				 * @param {number} opacity Opacity amount. The value can be anywhere from <code>0.0</code> (fully transparent) to <code>1.0</code> (fully opaque).
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetNodeOpacity: function(sceneId, dvlid, opacity) {
					return Module.ccall("jDVLScene_SetNodeOpacity", "number", ["string", "string", "number"], [sceneId, dvlid, opacity]);
				},

				/**
				 * Sets the highlight color for a node.
				 * @param {string} sceneId Scene token.
				 * @param {string} dvlId   The node ID.
				 * @param {number} color   Highlight color value (32-bit ABGR, where A is amount of blending between material color and highlight color).
				 *                         Make sure you set the 'A' component to a non-zero value, otherwise the highlight will not be visible (as the amount would be '0').
				 *                         For example, <code>0xFF0000FF</code> gives 100% red highlight, and <code>0x7F00FF00</code> gives 50% green highlight. Set "color" to <code>0</code> to clear highlighting.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetNodeHighlightColor: function(sceneId, dvlid, color) {
					return Module.ccall("jDVLScene_SetNodeHighlightColor", "number", ["string", "string", "number"], [sceneId, dvlid, color]);
				},

				/**
				 * Retrieves a node's world matrix. This matrix is re-evaluated every frame during animation.
				 * If you specify the matrix via [SetNodeWorldMatrix]{@link sap.ve.dvl~Scene.SetNodeWorldMatrix}, it will override node matrix until [SetNodeWorldMatrix]{@link sap.ve.dvl~Scene.SetNodeWorldMatrix}(id, null) is performed.
				 * @param {string} sceneId Scene token.
				 * @param {string} dvlId   The node ID.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure:<br>
				 * <pre>
				 * {
				 *      "matrix": [number, ...] // A 4x4 matrix, 16 numbers
				 * }
				 * </pre>
				 */
				GetNodeWorldMatrix: function(sceneId, dvlid) {
					return parseResult(Module.ccall("jDVLScene_GetNodeWorldMatrix", "number", ["string", "string"], [sceneId, dvlid]));
				},

				/**
				 * Sets a node's world matrix. If you set the matrix with this call, it will override node matrix evaluation. Animation for this node will not play.
				 * @param {string}   sceneId  Scene token.
				 * @param {string}   dvlId    The node ID.
				 * @param {number[]} [matrix] A 4x4 matrix, 16 numbers.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetNodeWorldMatrix: function(sceneId, dvlid, matrix) {
					var result;
					if (matrix) {
						var buf = Module._malloc(16 * Float32Array.BYTES_PER_ELEMENT);
						Module.HEAPF32.set(matrix, buf / Float32Array.BYTES_PER_ELEMENT);
						result = Module.ccall("jDVLScene_SetNodeWorldMatrix", "number", ["string", "string", "number"], [sceneId, dvlid, buf]);
						Module._free(buf);
					} else {
						result = Module.ccall("jDVLScene_SetNodeWorldMatrix", "number", ["string", "string", "number"], [sceneId, dvlid, null]);
					}
					return result;
				},

				/**
				 * Retrieves the local matrix for the specified node.
				 * @param {string} sceneId Scene token.
				 * @param {string} dvlId   The node ID.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure.<br>
				 * <pre>
				 * {
				 *      "matrix": [number, ...] // A 4x4 matrix, 16 numbers
				 * }
				 * </pre>
				 */
				GetNodeLocalMatrix: function(sceneId, dvlid) {
					return parseResult(Module.ccall("jDVLScene_GetNodeLocalMatrix", "number", ["string", "string"], [sceneId, dvlid]));
				},

				/**
				 * Sets the local matrix for the specified node.
				 * @param {string}   sceneId  Scene token.
				 * @param {string}   dvlId    The node ID.
				 * @param {number[]} [matrix] A 4x4 matrix, 16 numbers.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetNodeLocalMatrix: function(sceneId, dvlid, matrix) {
					var result;
					if (matrix) {
						var buf = Module._malloc(16 * Float32Array.BYTES_PER_ELEMENT);
						Module.HEAPF32.set(matrix, buf / Float32Array.BYTES_PER_ELEMENT);
						result = Module.ccall("jDVLScene_SetNodeLocalMatrix", "number", ["string", "string", "number"], [sceneId, dvlid, buf]);
						Module._free(buf);
					} else {
						result = Module.ccall("jDVLScene_SetNodeLocalMatrix", "number", ["string", "string", "number"], [sceneId, dvlid, null]);
					}
					return result;
				},

				/**
				 * Retrieves a material with given name.
				 * @param {string} sceneId Scene token.
				 * @param {string} name    The name of material.
				 * @returns {string} Material token.
				 * @private
				 */
				GetMaterialByName: function(sceneId, name) {
					return pointerToString(Module.ccall("jDVLScene_GetMaterialByName", "number", ["string", "string"], [sceneId, name]));
				},

				/**
				 * Retrieves sub mesh count.
				 * @param {string} sceneId Scene token.
				 * @param {string} nodeId  The node ID.
				 * @returns {number} Sub mesh count.
				 * @private
				 */
				GetNodeSubmeshesCount : function(sceneId, nodeId) {
					return Module.ccall("jDVLScene_GetNodeSubmeshesCount", "number", ["string", "string"], [sceneId, nodeId]);
				},

				/**
				 * Retrieves the material for the specified submesh.
				 * @param {string} sceneId      Scene token.
				 * @param {string} nodeId       The node ID.
				 * @param {number} subMeshIndex Index of the submesh.
				 * @returns {string} Material token.
				 * @private
				 */
				GetNodeSubmeshMaterial : function(sceneId, nodeId, subMeshIndex) {
					return pointerToString(Module.ccall("jDVLScene_GetNodeSubmeshMaterial", "number", ["string", "string", "number"], [sceneId, nodeId, subMeshIndex]));
				},

				/**
				 * Sets the material for the specified submesh.
				 * @param {string} sceneId      Scene token.
				 * @param {string} nodeId       The node ID.
				 * @param {number} subMeshIndex Index of the submesh.
				 * @param {string} materialId   Material token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 * @private
				 */
				SetNodeSubmeshMaterial : function(sceneId, nodeId, subMeshIndex, materialId) {
					return Module.ccall("jDVLScene_SetNodeSubmeshMaterial", "number", ["string", "string", "number", "string"], [sceneId, nodeId, subMeshIndex, materialId]);
				},

				/**
				 * Retrieves the current scene camera.
				 * @param {string} sceneId Scene token.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Camera token or an error code if fails.
				 * @private
				 */
				GetCurrentCamera: function(sceneId) {
					return stringResult(Module.ccall("jDVLScene_GetCurrentCamera", "number", ["string"], [sceneId]));
				},

				/**
				 * Creates a new camera in the scene.
				 * @param {string}                         sceneId    Scene token.
				 * @param {sap.ve.dvl.DVLCAMERAPROJECTION} projection The camera projection type.
				 * @param {string}                         parentId   The node ID of the parent node where the camera node will be added.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Camera token or an error code if fails.
				 * @private
				 */
				CreateCamera: function(sceneId, projection, parentId) {
					return stringResult(Module.ccall("jDVLScene_CreateCamera", "number", ["string", "number", "string"], [sceneId, projection, parentId]));
				},

				/**
				 * Activates a camera in the scene.
				 * @param {string} sceneId  Scene token.
				 * @param {string} cameraId The node ID of the camera node.
				 * @param {number} crossFadeSeconds Time to perform the "fly to" animation. Set to 0 to do this immediately.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 * @private
				 */
				ActivateCamera: function(sceneId, cameraId, crossFadeSeconds) {
					return Module.ccall("jDVLScene_ActivateCamera", "number", ["string", "string", "number"], [sceneId, cameraId, crossFadeSeconds]);
				},

				/**
				 * Executes a query.
				 * @param {string}                sceneId Scene token.
				 * @param {sap.ve.dvl.DVLEXECUTE} type    Query type.
				 * @param {string}                str     Query string, see [DVLEXECUTE]{@link sap.ve.dvl.DVLEXECUTE} for string format.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				Execute: function(sceneId, type, str) { //DVLEXECUTE type
					return Module.ccall("jDVLScene_Execute", "number", ["string", "number", "string"], [sceneId, type, str]);
				},

				/**
				 * Releases the scene, and deletes it if the reference count is zero.
				 * @param {string} sceneId Scene token.
				 */
				Release: function(sceneId) {
					Module.ccall("jDVLScene_Release", null, ["string"], [sceneId]);
				},

				/**
				 * Copies a node.
				 * @param {string} sceneId      Scene token.
				 * @param {string} nodeId       The ID of the node to copy.
				 * @param {string} parentNodeId The ID of the parent node where the copied node will be added to.
				 * @param {number} flags        A combination of [DVLCREATENODECOPYFLAG]{@link sap.ve.dvl.DVLCREATENODECOPYFLAG} flags.
				 * @param {string} nodeName     The name of the created node.
				 * @param {string} insertBeforeNodeId The created node is added before this specified node.
				 * @returns {string} The ID of the created node.
				 */
				CreateNodeCopy: function(sceneId, nodeId, parentNodeId, flags, nodeName, insertBeforeNodeId) {
					return pointerToString(Module.ccall("jDVLScene_CreateNodeCopy", "number", ["string", "string", "string", "number", "string", "string"], [sceneId, nodeId, parentNodeId, flags, nodeName, typeof insertBeforeNodeId !== "undefined" ? insertBeforeNodeId : sap.ve.dvl.DVLID_INVALID]));
				},

				/**
				 * Creates a new node.
				 * @param {string} sceneId            Scene token.
				 * @param {string} parentNodeId       The ID of the parent node where the created node is added to.
				 * @param {string} nodeName           The name of the created node.
				 * @param {string} insertBeforeNodeId The created node is added before this specified node.
				 * @returns {string} The ID of the created node.
				 */
				CreateNode: function(sceneId, parentNodeId, nodeName, insertBeforeNodeId) {
					return pointerToString(Module.ccall("jDVLScene_CreateNode", "number", ["string", "string", "string", "string"], [sceneId, parentNodeId, nodeName, typeof insertBeforeNodeId !== "undefined" ? insertBeforeNodeId : sap.ve.dvl.DVLID_INVALID]));
				},

				/**
				 * Deinstances the specified node content.
				 * @param {string} sceneId Scene token.
				 * @param {string} nodeId  The ID of the node to be deinstanced.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				DeinstanceContent: function(sceneId, nodeId) {
					return Module.ccall("jDVLScene_DeinstanceContent", "number", ["string", "string"], [sceneId, nodeId]);
				},

				/**
				 * Deletes the specified node.
				 * @param {string} sceneId Scene token.
				 * @param {string} nodeId  The ID of the node to be deleted.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				DeleteNode: function(sceneId, nodeId) {
					return Module.ccall("jDVLScene_DeleteNode", "number", ["string", "string"], [sceneId, nodeId]);
				},

				/**
				 * Merge second scene to main scene.
				 * @param {string} mainSceneId main scene token.
				 * @param {string} secondSceneId  second scene token.
				 * @param {string} nodeId  The ID of the node in main scene under which the nodes of second scene to be placed
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				Merge: function(mainSceneId, secondSceneId, nodeId) {
					return Module.ccall("jDVLScene_Merge", "number", ["string", "string", "string"], [mainSceneId, secondSceneId, nodeId]);
				}

			}; // Module.Scene

			/**
			 * @namespace
			 * @alias sap.ve.dvl~Material
			 * @private
			 */
			Module.Material = {
				GetName: Module.cwrap("jDVLMaterial_GetName", "string", ["string"]),                              // function(materialId)
				GetColorParam: Module.cwrap("jDVLMaterial_GetColorParam", "number", ["string", "number"]),        // function(materialId, param)
				SetColorParam: Module.cwrap("jDVLMaterial_SetColorParam", null, ["string", "number", "number"]),  // function(materialId, param, color)
				GetScalarParam: Module.cwrap("jDVLMaterial_GetScalarParam", "number", ["string", "number"]),      // function(materialId, param)
				SetScalarParam: Module.cwrap("jDVLMaterial_SetScalarParam", null, ["string", "number", "number"]), // function(materialId, param, f)
				GetTexture: function (materialId, textureType) {
					return pointerToString(Module.ccall("jDVLMaterial_GetTexture", "number", ["string", "number"], [materialId, textureType]));
				},
				SetTexture: Module.cwrap("jDVLMaterial_SetTexture", null, ["string", "number", "string"]),                      // function(materialId, textureType, texture)
				GetTextureParam: Module.cwrap("jDVLMaterial_GetTextureParam", "number", ["string", "number", "number"]),        // function(materialId, textureType, param)
				SetTextureParam: Module.cwrap("jDVLMaterial_SetTextureParam", null, ["string", "number", "number", "number"]),  // function(materialId, textureType, param, f)
				GetTextureFlag: function(materialId, textureType, flag) {
					return !!Module.ccall("jDVLMaterial_GetTextureFlag", "number", ["string", "number", "number"], [materialId, textureType, flag]);
				},
				SetTextureFlag: Module.cwrap("jDVLMaterial_SetTextureFlag", null, ["string", "number", "number", "number"]),    // function(materialId, textureType, flag, b)
				Clone: function (materialId) {
					return pointerToString(Module.ccall("jDVLMaterial_Clone", "number", ["string"], [materialId]));
				},
				Release: function(materialId) {
					return Module.ccall("jDVLMaterial_Release", "number", ["string"], [materialId]);
				}
			}; // Module.Material

			/**
			 * @namespace
			 * @alias sap.ve.dvl~Camera
			 * @private
			 */
			Module.Camera = {
				GetName: Module.cwrap("jDVLCamera_GetName", "string", ["string"]),                                      // function(cameraId)
				SetName: Module.cwrap("jDVLCamera_SetName", null, ["string", "string"]),                                // function(cameraId, name)
				GetTargetNode: function(cameraId) {
					return stringResult(Module.ccall("jDVLCamera_GetTargetNode", "number", ["string"], [cameraId]));
				},
				SetTargetNode: Module.cwrap("jDVLCamera_SetTargetNode", null, ["string", "string"]),                    // function(cameraId, nodeId)
				GetOrigin: function(cameraId) { // returns [x, y, z]
					return parseResult(Module.ccall("jDVLCamera_GetOrigin", "number", ["string"], [cameraId]));
				},
				SetOrigin: Module.cwrap("jDVLCamera_SetOrigin", null, ["string", "number", "number", "number"]),        // function(cameraId, x, y, z)
				GetTargetDirection: function(cameraId) { // returns [x, y, z]
					return parseResult(Module.ccall("jDVLCamera_GetTargetDirection", "number", ["string"], [cameraId]));
				},
				SetTargetDirection: Module.cwrap("jDVLCamera_SetTargetDirection", null, ["string", "number", "number", "number"]),   // function(cameraId, x, y, z)
				GetUpDirection: function(cameraId) { // returns [x, y, z]
					return parseResult(Module.ccall("jDVLCamera_GetUpDirection", "number", ["string"], [cameraId]));
				},
				SetUpDirection: Module.cwrap("jDVLCamera_SetUpDirection", null, ["string", "number", "number", "number"]),           // function(cameraId, x, y, z)
				GetRotation: function(cameraId) { // returns [yaw, pitch, roll]
					return parseResult(Module.ccall("jDVLCamera_GetRotation", "number", ["string"], [cameraId]));
				},
				SetRotation: Module.cwrap("jDVLCamera_SetRotation", null, ["string", "number", "number", "number"]),    // function(cameraId, yaw, pitch, roll)
				GetMatrix: function(cameraId) {
					return parseResult(Module.ccall("jDVLCamera_GetMatrix", "number", ["string"], [cameraId]));
				},
				SetMatrix: function(cameraId, mat) {
					var m = mat.hasOwnProperty("matrix") ? mat.matrix : mat;
					var buf = Module._malloc(64);
					Module.HEAPF32.set(m, buf / 4);
					Module.ccall("jDVLCamera_SetMatrix", null, ["string", "number"], [cameraId, buf]);
					Module._free(buf);
				},
				GetProjection: Module.cwrap("jDVLCamera_GetProjection", "number", ["string"]),                  // function(cameraId)
				GetFOV: Module.cwrap("jDVLCamera_GetFOV", "number", ["string"]),                                // function(cameraId)
				SetFOV: Module.cwrap("jDVLCamera_SetFOV", null, ["string", "number"]),                          // function(cameraId, f)
				GetOrthoZoomFactor: Module.cwrap("jDVLCamera_GetOrthoZoomFactor", "number", ["string"]),        // function(cameraId)
				SetOrthoZoomFactor: Module.cwrap("jDVLCamera_SetOrthoZoomFactor", null, ["string", "number"]),  // function(cameraId, f)
				GetFOVBinding: Module.cwrap("jDVLCamera_GetFOVBinding", "number", ["string"]),                  // function(cameraId)
				SetFOVBinding: Module.cwrap("jDVLCamera_SetFOVBinding", null, ["string", "number"])             // function(cameraId, i)
			}; // Module.Camera

			// This is a map rendererId <-> [function], where [function] is an array of command to execute before rendering the next frame.
			var rendererCommands = {};

			/**
			 * @namespace
			 * @alias sap.ve.dvl~Renderer
			 */
			Module.Renderer = {
				/**
				 * Sets the dimensions of the canvas. You usually call this in the <code>OnResize()</code> handler of your application.
				 * You also need to call it once the renderer is created to let it know the target resolution.
				 * @param {number} width        Target width of the canvas in device pixels.
				 * @param {number} height       Target height of the canvas in device pixels.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetDimensions: function(width, height, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_SetDimensions", "number", ["string", "number", "number"], [rendererId, width, height]);
				},

				/**
				 * Sets the color which is used to clear the screen. Can be a gradient from top to bottom.
				 * @param {number} topRed       Red component of the top of a vertical color gradient background.
				 * @param {number} topGreen     Green component of the top of a vertical color gradient background.
				 * @param {number} topBlue      Blue component of the top of a vertical color gradient background.
				 * @param {number} topAlpha     Alpha component of the top of a vertical color gradient background.
				 * @param {number} bottomRed    Red component of the bottom of a vertical color gradient background.
				 * @param {number} bottomGreen  Green component of the bottom of a vertical color gradient background.
				 * @param {number} bottomBlue   Blue component of the bottom of a vertical color gradient background.
				 * @param {number} bottomAlpha  Alpha component of the bottom of a vertical color gradient background.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetBackgroundColor: function(topRed, topGreen, topBlue, topAlpha, bottomRed, bottomGreen, bottomBlue, bottomAlpha, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					Module.ccall("jDVLRenderer_SetBackgroundColor", null, ["string", "number", "number", "number", "number", "number", "number", "number", "number"], [rendererId, topRed, topGreen, topBlue, topAlpha, bottomRed, bottomGreen, bottomBlue, bottomAlpha]);
				},

				/**
				 * Attaches a scene that will be displayed through this interface.
				 * @param {string} sceneId      Scene token.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				AttachScene: function(sceneId, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_AttachScene", "number", ["string", "string"], [rendererId, sceneId]);
				},

				/**
				 * Retrieves the scene token for the currently attached scene.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Scene token or an error code if fails.
				 */
				GetAttachedScenePtr: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return stringResult(Module.ccall("jDVLRenderer_GetAttachedScenePtr", "number", ["string"], [rendererId]));
				},

				/**
				 * Checks if the scene has been somehow modified and requires re-rendering.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {boolean} <code>true</code> if the scene should be re-rendered, <code>false</code> otherwise.
				 */
				ShouldRenderFrame: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_ShouldRenderFrame", "bool", ["string"], [rendererId]);
				},

				/**
				 * Renders a single frame using the currently activated camera. Call this method to draw the attached scene.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				RenderFrame: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_RenderFrame", "number", ["string"], [rendererId]);
				},

				/**
				 * Sets the flags to force render frame. This call does not actually renders frame.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				ForceRenderFrame: function(rendererId) {
					return Module.ccall("jDVLRenderer_ForceRenderFrame", "number", ["string"], [rendererId]);
				},

				/**
				 * Renders a single frame using explicitly defined View and Projection matrices. Call this method to draw the attached scene.<br>
				 * The function takes two unrolled 4x4 matrices.
				 * <table class="params">
				 *     <thead><tr><th>Parameter</th><th class="last">Description</th></tr></thead>
				 *     <tr><td>v[row][column]</td><td class="last">A View matrix in local coordinates.</td></tr>
				 *     <tr><td>p[row][column]</td><td class="last">A Projection matrix.</td></tr>
				 * </table>
				 * @param {number} v00 A View matrix element at index [0,0].
				 * @param {number} v01 A View matrix element at index [0,1].
				 * @param {number} v02 A View matrix element at index [0,2].
				 * @param {number} v03 A View matrix element at index [0,3].
				 * @param {number} v10 A View matrix element at index [1,0].
				 * @param {number} v11 A View matrix element at index [1,1].
				 * @param {number} v12 A View matrix element at index [1,2].
				 * @param {number} v13 A View matrix element at index [1,3].
				 * @param {number} v20 A View matrix element at index [2,0].
				 * @param {number} v21 A View matrix element at index [2,1].
				 * @param {number} v22 A View matrix element at index [2,2].
				 * @param {number} v23 A View matrix element at index [2,3].
				 * @param {number} v30 A View matrix element at index [3,0].
				 * @param {number} v31 A View matrix element at index [3,1].
				 * @param {number} v32 A View matrix element at index [3,2].
				 * @param {number} v33 A View matrix element at index [3,3].
				 * @param {number} p00 A Projection matrix element at index [0,0].
				 * @param {number} p01 A Projection matrix element at index [0,1].
				 * @param {number} p02 A Projection matrix element at index [0,2].
				 * @param {number} p03 A Projection matrix element at index [0,3].
				 * @param {number} p10 A Projection matrix element at index [1,0].
				 * @param {number} p11 A Projection matrix element at index [1,1].
				 * @param {number} p12 A Projection matrix element at index [1,2].
				 * @param {number} p13 A Projection matrix element at index [1,3].
				 * @param {number} p20 A Projection matrix element at index [2,0].
				 * @param {number} p21 A Projection matrix element at index [2,1].
				 * @param {number} p22 A Projection matrix element at index [2,2].
				 * @param {number} p23 A Projection matrix element at index [2,3].
				 * @param {number} p30 A Projection matrix element at index [3,0].
				 * @param {number} p31 A Projection matrix element at index [3,1].
				 * @param {number} p32 A Projection matrix element at index [3,2].
				 * @param {number} p33 A Projection matrix element at index [3,3].
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				RenderFrameEx: function(v00, v01, v02, v03, v10, v11, v12, v13, v20, v21, v22, v23, v30, v31, v32, v33, p00, p01, p02, p03, p10, p11, p12, p13, p20, p21, p22, p23, p30, p31, p32, p33, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_RenderFrameEx", "number",
										["string", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number"],
										[rendererId, v00, v01, v02, v03, v10, v11, v12, v13, v20, v21, v22, v23, v30, v31, v32, v33, p00, p01, p02, p03, p10, p11, p12, p13, p20, p21, p22, p23, p30, p31, p32, p33]);
				},

				/**
				 * Gets camera matrices - View and Projection matrices.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure:<br>
				 * <pre>
				 * {
				 *      "view":       [number, ...],
				 *      "projection": [number, ...]
				 * }
				 * </pre>
				 */
				GetCameraMatrices: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return parseResult(Module.ccall("jDVLRenderer_GetCameraMatrices", "number", ["string"], [rendererId]));
				},

				/**
				 * Sets or clears the specified rendering option.
				 * @param {sap.ve.dvl.DVLRENDEROPTION} option       The option to change.
				 * @param {boolean}                    enable       <code>true</code> to set the option, <code>false</code> to clear the option.
				 * @param {string}                     [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 *     <table class="props">
				 *         <thead><tr><th>Code</th><th class="last">Description</th></tr></thead>
				 *         <tr><td><code>DVLRESULT_NOTINITIALIZED</code></td><td class="last">If renderer initialization was not performed.</td></tr>
				 *         <tr><td><code>DVLRESULT_HARDWAREERROR</code> </td><td class="last">If the new option state is not supported by hardware.</td></tr>
				 *         <tr><td><code>DVLRESULT_BADARG</code>        </td><td class="last">If the option does not exist.</td></tr>
				 *         <tr><td><code>DVLRESULT_OK</code>            </td><td class="last">If the option was changed successfully.</td></tr>
				 *     </table>
				 */
				SetOption: function(option, enable, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_SetOption", "number", ["string", "number", "boolean"], [rendererId, option, enable]);
				},

				/**
				 * Returns the current state of rendering options.
				 * @param {sap.ve.dvl.DVLRENDEROPTION} option       The rendering option to get the status of.
				 * @param {string}                     [rendererId] Renderer token.
				 * @returns {boolean} Current status of the specified rendering option. <code>true</code> if the option is set, <code>false</code> if the option is cleared.
				 */
				GetOption: function(option, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_GetOption", "boolean", ["string", "number"], [rendererId, option]);
				},

				/**
				 * Sets the specified rendering option value.
				 * @param {sap.ve.dvl.DVLRENDEROPTIONF} option       The option to change.
				 * @param {number}                      value        A numeric value of a non boolean option to set.
				 * @param {string}                      [rendererId] Renderer token
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 *     <table class="props">
				 *         <thead><tr><th>Code</th><th class="last">Description</th></tr></thead>
				 *         <tr><td><code>DVLRESULT_NOTINITIALIZED</code></td><td class="last">If renderer initialization was not performed.</td></tr>
				 *         <tr><td><code>DVLRESULT_HARDWAREERROR</code> </td><td class="last">If the new option value is not supported by hardware.</td></tr>
				 *         <tr><td><code>DVLRESULT_BADARG</code>        </td><td class="last">If the option does not exist.</td></tr>
				 *         <tr><td><code>DVLRESULT_OK</code>            </td><td class="last">If the option was changed successfully.</td></tr>
				 *     </table>
				 */
				SetOptionF: function(option, value, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_SetOptionF", "number", ["string", "number", "number"], [rendererId, option, value]);
				},

				/**
				 * Returns the current value of rendering options.
				 * @param {sap.ve.dvl.DVLRENDEROPTIONF} option       The option to get the value of.
				 * @param {string}                      [rendererId] Renderer token.
				 * @returns {number} Value of the specified option.
				 */
				GetOptionF: function(option, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_GetOptionF", "number", ["string", "number"], [rendererId, option]);
				},

				/**
				 * Changes view to default viewport (the "Home" mode).
				 * @param {number} flags        A combination of [DVLRESETVIEWFLAG]{@link sap.ve.dvl.DVLRESETVIEWFLAG} flags.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				ResetView: function(flags, rendererId) {
					if (arguments.length === 1 && typeof flags === "number") {
						rendererId = Module.Settings.RendererToken;
					} else if (arguments.length === 1 && typeof flags === "string") {
						rendererId = flags;
						flags = sap.ve.dvl.DVLRESETVIEWFLAG.CAMERA | sap.ve.dvl.DVLRESETVIEWFLAG.SMOOTHTRANSITION;
					} else if (typeof flags !== "number" || typeof rendererId !== "string") {
						flags = sap.ve.dvl.DVLRESETVIEWFLAG.CAMERA | sap.ve.dvl.DVLRESETVIEWFLAG.SMOOTHTRANSITION;
						rendererId = Module.Settings.RendererToken;
					}
					return Module.ccall("jDVLRenderer_ResetView", "number", ["number", "string"], [flags, rendererId]);
				},

				/**
				 * Begins a gesture by computing target hit point, touch direction etc. Should be called at the beginning of each gesture.
				 * @param {number} x            Horizontal coordinate in device pixels.
				 * @param {number} y            Vertical coordinate in device pixels.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				BeginGesture: function(x, y, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_BeginGesture", "number", ["string", "number", "number"], [rendererId, x, y]);
				},

				/**
				 * Ends a gesture. Should be called at the end of each gesture to decrease the internal counter.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				EndGesture: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_EndGesture", "number", ["string"], [rendererId]);
				},

				/**
				 * Pans the scene.
				 * @param {number} x            Horizontal delta in device pixels.
				 * @param {number} y            Vertical delta in device pixels.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				Pan: function(dx, dy, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_Pan", "number", ["string", "number", "number"], [rendererId, dx, dy]);
				},

				/**
				 * Rotates the scene around 3D orbit rotation center (which is calculated by the [BeginGesture]{@link sap.ve.dvl~Renderer.BeginGesture} method).
				 * @param {number} dx           Horizontal delta in device pixels.
				 * @param {number} dy           Vertical delta in device pixels.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				Rotate: function(dx, dy, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_Rotate", "number", ["string", "number", "number"], [rendererId, dx, dy]);
				},

				/**
				 * Zooms the scene.
				 * @param {number} y Zoom velocity in pixels per second.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				Zoom: function(dy, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_Zoom", "number", ["string", "number"], [rendererId, dy]);
				},

				/**
				 * Checks if the provided node can be isolated (by seeing if there are any visible geometry underneath it).
				 * @param {string} dvlId        The ID of the node.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {boolean} <code>true</code> if the node can be isolated, <code>false</code> otherwise.
				 */
				CanIsolateNode: function(dvlid, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_CanIsolateNode", "boolean", ["string", "string"], [rendererId, dvlid]);
				},

				/**
				 * Sets or clears an isolated node.
				 * @param {string} dvlId        The ID of the node. To clear an isolated node, you need to pass <code>[DVLID_INVALID]{@link sap.ve.dvl.DVLID_INVALID}</code>.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetIsolatedNode: function(dvlid, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_SetIsolatedNode", "number", ["string", "string"], [rendererId, dvlid]);
				},

				/**
				 * Returns the ID of the currently isolated node or <code>[DVLID_INVALID]{@link sap.ve.dvl.DVLID_INVALID}</code> if nothing is isolated.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {string|sap.ve.dvl.DVLRESULT} The ID of the isolated node or an error code if fails.
				 */
				GetIsolatedNode: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return stringResult(Module.ccall("jDVLRenderer_GetIsolatedNode", "number", ["string"], [rendererId]));
				},

				/**
				 * Zooms the scene to a bounding box created from a particular set of nodes.
				 * @param {sap.ve.dvl.DVLZOOMTO} what             What set of nodes to zoom to, and optionally from which view.
				 * @param {string|string[]}      nodes            The target nodes IDs. Only used if what equals <code>DVLZOOMTONODE</code> or <code>DVLZOOMTONODE_SETISOLATION</code>.
				 * @param {number}               crossFadeSeconds Time to perform the "fly to" animation. Set to <code>0.0f</code> to do this immediately.
				 * @param {number}               [margin]         Margin.
				 * @param {string}               [rendererId]     Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				ZoomTo: function(what, nodes, crossFadeSeconds, margin, rendererId) { //DVLZOOMTO
					rendererId = rendererId !== undefined ? rendererId : Module.Settings.RendererToken;
					margin = margin || 0;
					if (typeof nodes === 'string') {
						nodes = [nodes];
					}
					if (Array.isArray(nodes) && nodes.length > 0) {
						var nodesArray = new Uint32Array(nodes.length);
						for (var i in nodes) {
							nodesArray[i] = parseInt(nodes[i].substr(9), 16); // stringIdToPtr
						}
						var buf = Module._malloc(nodesArray.length * Uint32Array.BYTES_PER_ELEMENT);
						Module.HEAPU32.set(nodesArray, buf / Uint32Array.BYTES_PER_ELEMENT);
						var result = Module.ccall("jDVLRenderer_ZoomTo", "number", ["string", "number", "number", "number", "number", "number"], [rendererId, what, nodesArray.length, buf, crossFadeSeconds, margin]);
						Module._free(buf);
						return result;
					} else {
						return Module.ccall("jDVLRenderer_ZoomTo", "number", ["string", "number", "number", "number", "number", "number"], [rendererId, what, 0, null, crossFadeSeconds, margin]);
					}
				},

				/**
				 * Sends the "tap" event to the core (for selection).
				 * @param {number}  x            Horizontal coordinate in device pixels.
				 * @param {number}  y            Vertical coordinate in device pixels.
				 * @param {boolean} isDouble     Should the call be handled as a double or single tap.
				 * @param {boolean} changeSelection Allow or prevent changes in node selection states
				 * @param {string}  [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				Tap: function(x, y, isDouble, changeSelection, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_Tap", "number", ["string", "number", "number", "boolean", "boolean"], [rendererId, x, y, isDouble, changeSelection]);
				},

				/**
				 * Performs hit testing and finds a 3D object(s) under the X, Y coordinates.
				 * @param {number|number[]} x            Horizontal coordinate in device pixels or an array of numbers. The length of the array must be even.
				 *                                       The array contains (x,y) pairs [x1, y1, x2, y2, ...].
				 * @param {number}          y            Vertical coordinate in device pixels.
				 * @param {string}          [rendererId] Renderer token.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure.<br>
				 * <pre>
				 * [
				 *     {
				 *         "id":                string,
				 *         "ScreenCoordinateX": number,
				 *         "ScreenCoordinateY": number,
				 *         "WorldCoordinateX":  number,
				 *         "WorldCoordinateY":  number,
				 *         "WorldCoordinateZ":  number,
				 *         "LocalCoordinateX":  number,
				 *         "LocalCoordinateY":  number,
				 *         "LocalCoordinateZ":  number
				 *     },
				 *     ...
				 * ]
				 */
				HitTest: function(x, y, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					var p;
					if (x instanceof Array) {
						var buf = Module._malloc(x.length * 4);
						Module.HEAP32.set(x, buf / 4);
						p = Module.ccall("jDVLRenderer_MultipleHitTest", "number", ["string", "number", "number"], [rendererId, x.length / 2, buf]);
						Module._free(buf);
					} else {
						p = Module.ccall("jDVLRenderer_HitTest", "number", ["string", "number", "number"], [rendererId, x, y]);
					}
					return parseResult(p);
				},

				/**
				 * Create texture with given data
				 * @param {number} width        Width of texture.
				 * @param {number} height       Height of texture.
				 * @param {Uint8Array} Data     Raw texture data. 4 bytes per pixel. The data length must be at least 4 * width * height.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Texture token or an error code if fails.
				 * @private
				 */
				CreateTexture: function(width, height, data, rendererId) {
					var bytesPerPixel = 4;
					if (data.length < width * height * bytesPerPixel)
						return DvlEnums.DVLRESULT.BADARG;

					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					var buf = Module._malloc(data.length);
					console.log(data.length);
					Module.HEAPU8.set(data, buf);
					var texture = stringResult(Module.ccall("jDVLRenderer_CreateTexture", "number", ["string", "number", "number", "number", "number"], [rendererId, width, height, bytesPerPixel, buf]));
					Module._free(buf);
					return texture;
				},

				/**
				 * Releases the texture and frees the memory allocated for it.
				 * @param {string} textureId    Texture token.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 * @private
				 */
				ReleaseTexture: function(textureId, rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return Module.ccall("jDVLRenderer_ReleaseTexture", "number", ["string", "string"], [rendererId, textureId]);
				},

				/**
				 * Set an instance of IDVLViewStateManager to be used by the Renderer to get per-viewport node properties.
				 * @param {object} viewStateManager A object that implements ViewStateManager interface in JavaScript.
				 * @param {string} rendererId       Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 * @private
				 */
				SetViewStateManager: function(viewStateManager, rendererId) {
					return setViewStateManager(rendererId, viewStateManager);
				},

				/**
				 * Returns the current camera.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Camera token or an error code if fails.
				 */
				GetCurrentCamera: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return stringResult(Module.ccall("jDVLRenderer_GetCurrentCamera", "number", ["string"], [rendererId]));
				},

				/**
				 * Returns the transition camera.
				 * @param {string} [rendererId] Renderer token.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Camera token or an error code if fails.
				 */
				GetTransitionCamera: function(rendererId) {
					rendererId = typeof rendererId !== "undefined" ? rendererId : Module.Settings.RendererToken;
					return stringResult(Module.ccall("jDVLRenderer_GetTransitionCamera", "number", ["string"], [rendererId]));
				},

				/**
				 * Activates a step by playing its animation. Optionally plays steps that come after this step.
				 * @param {string}  rendererId        Renderer token.
				 * @param {string}  dvlId             The identifier of the step or model view to activate.
				 * @param {boolean} fromTheBeginning  Play the step from beginning, or from the currently paused position.
				 * @param {boolean} continueToTheNext What to do after the current step has finished playing: play the next steps, or stop.
				 * @param {number}  stepTime          The time at which the step animation starts (in seconds). By default, <code>stepTime</code> is set to <code>-1</code>.<br>
				 *                                    Providing a negative value results in a cross-fade transition to the step to activate,
				 *                                    and starts playing that step from time = 0.
				 *                                    Providing a value of 0 or more will instantaneously switch to the camera orientation of the step to activate,
				 *                                    and starts playing that step from time = 0.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				ActivateStep: function(rendererId, dvlid, fromTheBeginning, continueToTheNext, stepTime) {
					return Module.ccall("jDVLRenderer_ActivateStep", "number", ["string", "string", "boolean", "boolean", "number"], [rendererId, dvlid, fromTheBeginning, continueToTheNext, typeof stepTime !== "undefined" ? stepTime : -1]);
				},

				/**
				 * Pauses the current step, if any.
				 * @param {string} rendererId Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				PauseCurrentStep: function(rendererId) {
					return Module.ccall("jDVLRenderer_PauseCurrentStep", "number", ["string"], [rendererId]);
				},

				/**
				 * Activates a camera in the renderer.
				 * @param {string} rendererId       Renderer token.
				 * @param {string} cameraId         The node ID of the camera node.
				 * @param {number} crossFadeSeconds Time to perform the "fly to" animation. Set to 0 to do this immediately.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 * @private
				 */
				ActivateCamera: function(rendererId, cameraId, crossFadeSeconds) {
					return Module.ccall("jDVLRenderer_ActivateCamera", "number", ["string", "string", "number"], [rendererId, cameraId, crossFadeSeconds]);
				},


				/**
				 * Set selection rectangle for rendering.
				 * @param {number}  x1            Horizontal coordinate in device pixels of top-left vertex of selecion rectangle.
				 * @param {number}  y1            Vertical coordinate in device pixels of top-left vertex of selecion rectangle.
				 * @param {number}  x2            Horizontal coordinate in device pixels of bottom-right vertex of selecion rectangle.
				 * @param {number}  y2            Vertical coordinate in device pixelsof bottom-right vertex of selecion rectangle.
				 * @param {string}  [rendererId] Renderer token.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */

				DrawSelectionRect: function(x1, y1, x2, y2, rendererId) {
					return Module.ccall("jDVLRenderer_DrawSelectionRect", "number", ["string", "number", "number", "number", "number"], [rendererId, x1, y1, x2, y2]);
				},

				/**
				 * Sends the "rectangular selection" event to the core (for selection).
				 * @param {number}  x1            Horizontal coordinate in device pixels of top-left vertex of selecion rectangle.
				 * @param {number}  y1            Vertical coordinate in device pixels of top-left vertex of selecion rectangle.
				 * @param {number}  x2            Horizontal coordinate in device pixels of bottom-right vertex of selecion rectangle.
				 * @param {number}  y2            Vertical coordinate in device pixelsof bottom-right vertex of selecion rectangle.
				 * @param {string}  [rendererId] Renderer token.
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure.<br>
				 * <pre>
				 * {	selectedNodes: [string, string, ...]	}
				 */
				RectSelect: function(x1, y1, x2, y2, rendererId) {
					p = Module.ccall("jDVLRenderer_RectSelect", "number", ["string", "number", "number", "number", "number"], [rendererId, x1, y1, x2, y2]);
					return parseResult(p);
				},


				_queueCommand: function(command, rendererId) {
					rendererCommands[rendererId].push(command);
					return this;
				},

				_processCommandQueue: function(rendererId) {
					var commands = rendererCommands[rendererId].splice(0, rendererCommands[rendererId].length);
					commands.forEach(function(command) {
						command();
					});
				}
			}; // Module.Renderer

			/**
			 * @namespace
			 * @alias sap.ve.dvl~Library
			 */
			Module.Library = {
				/**
				 * Retrieves a base64 encoded thumbnail for a file stored in the Emscripten virtual file system.
				 * @param {string}                    url            The file URL.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation The source location of the file: "local" or "remote".
				 * @returns {string} A thumbnail encoded as a Base64 string.
				 */
				RetrieveThumbnail: function(url, sourceLocation) {
					var libraryId = pointerToString(Module.ccall("jDVLCore_GetLibraryPtr", "number", ["string"], [Module.Settings.CoreToken]));
					var filename = makeFilename(sourceLocation + "/" + url);
					return pointerToString(Module.ccall("jDVLLibrary_RetrieveThumbnail", "number", ["string", "string"], [libraryId, "file:///viewer/" + filename]));
				},

				/**
				 * Retrieves file information.
				 * @param {string}                    url            The file URL.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation The source location of the file: "local" or "remote".
				 * @returns {JSON|sap.ve.dvl.DVLRESULT} An error code or an object with the following structure.<br>
				 * <pre>
				 * {
				 *     flags: number,
				 *     major: number,
				 *     minor: number
				 * }
				 * </pre>
				 */
				RetrieveInfo: function(url, sourceLocation) {
					var libraryId = pointerToString(Module.ccall("jDVLCore_GetLibraryPtr", "number", ["string"], [Module.Settings.CoreToken]));
					var filename = makeFilename(sourceLocation + "/" + url);
					return parseResult(Module.ccall("jDVLLibrary_RetrieveInfo", "number", ["string", "string"], [libraryId, "file:///viewer/" + filename]));
				}
			}; // Module.Library

			/**
			 * @namespace
			 * @alias sap.ve.dvl~Core
			 */
			Module.Core = {
				/**
				 * Performs all class initialization, and verifies that the library is compatible (by checking major/minor version).
				 * @param {number} versionMajor Major version to check against build.
				 * @param {number} versionMinor Minor version to check against build.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */

				Init: function(versionMajor, versionMinor) {
					return Module.ccall("jDVLCore_Init", "number", ["string", "number", "number"], [Module.Settings.CoreToken, versionMajor, versionMinor]);
				},

				/**
				 * Performs all renderer initialization.
				 * @returns {string} Renderer token.
				 */
				InitRenderer: function() {
					Module.ccall("jDVLCore_InitRenderer", "number", ["string"], [Module.Settings.CoreToken]);
					var rendererId = stringResult(Module.ccall("jDVLCore_GetRendererPtr", "number", ["string"], [Module.Settings.CoreToken]));
					if (typeof rendererId === "string") {
						rendererCommands[rendererId] = [];
						Module.Settings.RendererToken = rendererId;
					}
					return rendererId;
				},

				/**
				 * Deletes the current renderer, and releases all allocated resources (or JavaScript equivalent).
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				DoneRenderer: function() {
					delete rendererCommands[Module.Settings.RendererToken];
					var result = Module.ccall("jDVLCore_DoneRenderer", "number", ["string"], [Module.Settings.CoreToken]);
					Module.Settings.RendererToken = null;
					return result;
				},

				/**
				 * Create a new renderer and performs renderer initialization.
				 * This method must be used for multi-viewport applications.
				 * Can be used for single-viewport (internally it would execute InitRenderer() for single-viewport).
				 *
				 * @returns {string|sap.ve.dvl.DVLRESULT} The ID of the newly created renderer or an error code if fails.
				 */
				CreateRenderer: function() {
					var rendererId = stringResult(Module.ccall("jDVLCore_CreateRenderer", "number", ["string"], [Module.Settings.CoreToken]));
					if (typeof rendererId === "string") {
						rendererCommands[rendererId] = [];
						if (!Module.Settings.RendererToken) {
							Module.Settings.RendererToken = rendererId;
						}
					}
					return rendererId;
				},

				/**
				 * Deletes the renderer and releases all resources allocated by it.
				 *
				 * @param {string} rendererId The renderer ID.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				DeleteRenderer: function(rendererId) {
					delete rendererCommands[rendererId];
					var result = Module.ccall("jDVLCore_DeleteRenderer", "number", ["string", "string"], [Module.Settings.CoreToken, rendererId]);
					if (rendererId === Module.Settings.RendererToken) {
						Module.Settings.RendererToken = null;
					}
					return result;
				},

				/**
				 * Deletes the DVL instance.
				 */
				Release: function() {
					Module.ccall("jDVLCore_Release", null, ["string"], [Module.Settings.CoreToken]);
					Module.Settings.CoreToken = null;
				},

				/**
				 * Returns the major version of DVL.
				 * @returns {number} Core major version.
				 */
				GetMajorVersion: function() {
					return Module.ccall("jDVLCore_GetMajorVersion", "number", ["string"], [Module.Settings.CoreToken]);
				},

				/**
				 * Returns the minor version of DVL.
				 * @returns {number} Core minor version.
				 */
				GetMinorVersion: function() {
					return Module.ccall("jDVLCore_GetMinorVersion", "number", ["string"], [Module.Settings.CoreToken]);
				},

				/**
				 * Returns the micro version of DVL.
				 * @returns {number} Core micro version.
				 */
				GetMicroVersion: function() {
					return Module.ccall("jDVLCore_GetMicroVersion", "number", ["string"], [Module.Settings.CoreToken]);
				},
				/**
				 * Returns the build number of DVL.
				 * @returns {number} Core build number.
				 */
				GetBuildNumber: function() {
					return Module.ccall("jDVLCore_GetBuildNumber", "number", ["string"], [Module.Settings.CoreToken]);
				},
				/**
				 * Returns the overall version of DVL.
				 * @returns {string} The string representation of the DVL version with the following structure: <i>Major.Minor.Micro.BuildNumber</i>.
				 */
				GetVersion: function() {
					return Module.Core.GetMajorVersion().toString() + "." + Module.Core.GetMinorVersion().toString() + "." + Module.Core.GetMicroVersion().toString() + "-" + Module.Core.GetBuildNumber().toString();
				},
				/**
				 * Sets the locale which is used for getting the text in viewports, layers, callouts, etc. during file load. Default is "neutral locale".
				 * Some examples of locale format include <code>"en-US"</code> and <code>"de-DE"</code>.
				 * Use <code>null</code> or <code>""</code> value to set a "neutral locale".
				 * Locale setting is only used during scene loading. If you change the locale setting on the fly, you will need to reload the file.
				 * @param {string} locale The locale to set.
				 * @returns {sap.ve.dvl.DVLRESULT} The result code of the operation.
				 */
				SetLocale: function(locale) {
					return Module.ccall("jDVLCore_SetLocale", "number", ["string", "string"], [Module.Settings.CoreToken, locale]);
				},

				/**
				 * Creates a new scene.<br>
				 * Call the [Release]{@link sap.ve.dvl~Scene.Release} method once finished with it.
				 * @returns {string|sap.ve.dvl.DVLRESULT} The ID of the newly created scene or an error code if fails.
				 */
				CreateEmptyScene: function() {
					return stringResult(Module.ccall("jDVLCore_CreateEmptyScene", "number", ["string"], [Module.Settings.CoreToken]));
				},

				/**
				 * Creates a new scene by loading it from a file in the Emscripten virtual file system.<br>
				 * Call the [Release]{@link sap.ve.dvl~Scene.Release} method once finished with it.
				 * @param {string} filename           The name of the file in the Emscripten virtual file system.
				 * @param {string} [optionalPassword] Password to access the file. Required only if the file is encrypted.
				 * @returns {string|sap.ve.dvl.DVLRESULT} The ID of the newly loaded scene or an error code if fails.
				 */
				LoadScene: function(filename, optionalPassword) {
					var p = null;
					var lookupFile = null;
					try {
						lookupFile = FS.lookupPath("/viewer/" + filename, { parent: false });
					} catch (e) {
						if (!(e instanceof FS.ErrnoError && e.errno === ERRNO_CODES.ENOENT)) {
							throw e;
						}
					}

					if (!lookupFile) {
						throw Error("File " + filename + " not found.");
					} else {
						p = Module.ccall("jDVLCore_LoadScene", "number", ["string", "string", "string"], [Module.Settings.CoreToken, "file:///viewer/" + filename, optionalPassword]);
					}
					var s = stringResult(p);
					Module.Settings.LastLoadedSceneId = s;
					return s;
				},

				/**
				 * Creates a new scene by loading it from the specified URL.<br>
				 * Call the [Release]{@link sap.ve.dvl~Scene.Release} method once finished with it.
				 * @param {string}                    url              The URL of the file to load.
				 * @param {string}                    optionalPassword The password to access the file. Required only if the file is encrypted.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation   The source location of the file: "local" or "remote".
				 * @returns {string|sap.ve.dvl.DVLRESULT} The ID of the newly loaded scene or an error code if fails.
				 */
				LoadSceneByUrl: function(url, optionalPassword, sourceLocation /* can be "local" or "remote" */) {
					var filename = makeFilename(sourceLocation + "/" + url);
					Module.Settings.LoadAsync = false;
					return this.LoadScene(filename, optionalPassword);
				},

				/**
				 * Creates a new scene by loading it from ArrayBuffer.<br>
				 * Call the [Release]{@link sap.ve.dvl~Scene.Release} method once finished with it.
				 * @param {ArrayBuffer}               buffer             ArrayBuffer which has the file data.
				 * @param {string}                    emscriptenFilename The buffer is stored under this filename in the Emscription virtual system.
				 * @param {string}                    password           Password to access the file. Required only if the file is encrypted.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation     The source location of the file: "local" or "remote".
				 * @returns {string|sap.ve.dvl.DVLRESULT} The ID of the newly loaded scene or an error code if fails.
				 */
				LoadFileFromArrayBuffer: function(buffer, emscriptenFilename, password, sourceLocation /* can be "local" or "remote" */) {
					this.CreateFileFromArrayBuffer(buffer, emscriptenFilename, sourceLocation);
					var filename = makeFilename(sourceLocation + "/" + emscriptenFilename);
					Module.Settings.LoadAsync = false;
					return this.LoadScene(filename, password);
				},

				/**
				 * Creates a new scene by loading a VDSL file from a specified URL.<br>
				 * Call the [Release]{@link sap.ve.dvl~Scene.Release} method once finished with it.
				 * @param {string} content            The content of the VDSL file.
				 * @param {string} [optionalPassword] Password to access the file. Required only if the file is encrypted.
				 * @returns {string|sap.ve.dvl.DVLRESULT} The ID of the newly loaded scene or an error code if fails.
				 */
				LoadSceneFromVDSL: function (content, optionalPassword) {
					Module.Settings.LoadAsync = false;
					var p = Module.ccall("jDVLCore_LoadSceneFromVDSL", "number", ["string", "string", "string"], [Module.Settings.CoreToken, content, optionalPassword]);
					var s = stringResult(p);
					Module.Settings.LastLoadedSceneId = s;
					return s;
				},

				/**
				 * Creates a new scene by loading it from the specified URL.<br>
				 * @param {string}                    url              The URL of the file to load.
				 * @param {string}                    optionalPassword The password to access the file. Required only if the file is encrypted.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation   The source location of the file: "local" or "remote".
				 * @returns {string|sap.ve.dvl.DVLRESULT} The sap.ve.dvl.DVLRESULT.OK or an error code if fails.
				 */
				LoadSceneByUrlAsync: function(url, optionalPassword, sourceLocation /* can be "local" or "remote" */) {
					var filename = makeFilename(sourceLocation + "/" + url);
					Module.Settings.LoadAsync = true;
					var res = this.LoadScene(filename, optionalPassword);
					return typeof res === "number" ? res : DvlEnums.DVLRESULT.OK;
				},

				/**
				 * Creates a new scene by loading a VDSL file from a specified URL.<br>
				 * @param {string} content            The content of the VDSL file.
				 * @param {string} [optionalPassword] Password to access the file. Required only if the file is encrypted.
				 * @returns {sap.ve.dvl.DVLRESULT} The sap.ve.dvl.DVLRESULT.OK or an error code if fails.
				 */
				LoadSceneFromVDSLAsync: function (content, optionalPassword) {
					Module.Settings.LoadAsync = true;
					var p = Module.ccall("jDVLCore_LoadSceneFromVDSL", "number", ["string", "string", "string"], [Module.Settings.CoreToken, content, optionalPassword]);
					var s = stringResult(p);
					Module.Settings.LastLoadedSceneId = s;
					return typeof s === "number" ? s : DvlEnums.DVLRESULT.OK;
				},

				/**
				 * Returns the token that uniquely identifies the current [Renderer]{@link sap.ve.dvl~Renderer} instance.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Renderer token or an error code if fails.
				 */
				GetRendererPtr: function() {
					return stringResult(Module.ccall("jDVLCore_GetRendererPtr", "number", ["string"], [Module.Settings.CoreToken]));
				},

				/**
				 * Returns the token that uniquely identifies the current [Library]{@link sap.ve.dvl~Library} instance.
				 * @returns {string|sap.ve.dvl.DVLRESULT} Library token or an error code if fails.
				 */
				GetLibraryPtr: function() {
					return stringResult(Module.ccall("jDVLCore_GetLibraryPtr", "number", ["string"], [Module.Settings.CoreToken]));
				},

				/**
				 * Releases internal caches and any other information that can be recreated by DVL core when necessary (mainly targets iOS with limited relevance to dvl.js).
				 */
				OnLowMemory: function() {
					Module.ccall("jDVLCore_OnLowMemory", null, ["string"], [Module.Settings.CoreToken]);
				},

				// TODO: Move this function to Helpers.
				/**
				 * Creates a WebGL context with the given canvas.
				 * @param {HTMLCanvasElement} canvas                 The canvas element in DOM.
				 * @param {object}            webGLContextAttributes See {@link https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.2 webGLContextAttributes}.
				 * @returns {WebGLRenderingContext} The [WebGL context]{@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext} associated with the canvas element.
				 */
				CreateWebGLContext: function(canvas, webGLContextAttributes) {
					var context;
					// NB: Browser.createContext() checks if the context has already been created for this canvas, so we do not check ourselves.
					// NB: Browser.createContext() resets canvas' backgroundColor to "black".
					var backgroundColor = canvas.style.backgroundColor;
					try {
						context = Browser.createContext(canvas, /* useWebGL= */ true, /* setInModule= */ true, webGLContextAttributes);
					} finally {
						canvas.style.backgroundColor = backgroundColor;
					}
					Module.canvas = canvas;
					// Module.ctx = oContext; // this is done in Browser.createContext().
					return context;
				},

				// TODO: Move this function to Helpers.
				/**
				 * Deletes the file from the Emscripten virtual file system.
				 * @param {string}                    url            The URL of the file to delete.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation The source location of the file: "local" or "remote".
				 * @returns {sap.ve.dvl~Core} <code>this</code> for chaining.
				 */
				DeleteFileByUrl: function(url, sourceLocation /* can be "local" or "remote" */) {
					var filename = makeFilename(sourceLocation + "/" + url);
					try {
						//Check to see if the file exists. If it does, destroy the file (so that we can load changed files from disk)
						var lookupFileInFS = FS.lookupPath("/viewer/" + filename, { parent: false });
						if (lookupFileInFS) {
							FS.destroyNode(lookupFileInFS.node);
						}
					} catch (e) {
						if (!(e instanceof FS.ErrnoError && e.errno === ERRNO_CODES.ENOENT)) {
							throw e;
						}
					}
					return this;
				},

				// TODO: Move this function to Helpers.
				/**
				 * Creates files in the virtual file system with the given ArrayBuffer.
				 * @param {ArrayBuffer}               buffer         The ArrayBuffer containing data.
				 * @param {string}                    url            The URL of the file.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation The source location of the file: "local" or "remote".
				 * @returns {string} The full file name in the Emscripten virtual file system.
				 */
				CreateFileFromArrayBuffer: function(buffer, url, sourceLocation /* can be "local" or "remote" */) {
					var filename = makeFilename(sourceLocation + "/" + url);
					try {
						//Check to see if the file exists. If it does, destroy the file (so that we can load changed files from disk)
						var lookupFileInFS = FS.lookupPath("/viewer/" + filename, { parent: false });
						if (lookupFileInFS) {
							FS.destroyNode(lookupFileInFS.node);
						}
					} catch (e) {
						if (!(e instanceof FS.ErrnoError && e.errno === ERRNO_CODES.ENOENT)) {
							throw e;
						}
					}

					FS.createDataFile("/viewer/", filename, new Uint8Array(buffer), true, true);

					return "/viewer/" + filename;
				},

				/**
				 * Gets the full file name of the file stored in the Emscripten virtual file system.
				 * @param {string}                    url            URL to the file.
				 * @param {sap.ve.dvl.SOURCELOCATION} sourceLocation The source location of the file: "local" or "remote".
				 * @returns {string} The full name of the file in the Emscripten virtual file system.
				 */
				GetFilename: function(url, sourceLocation) {
					return "file:///viewer/" + makeFilename(sourceLocation + "/" + url);
				},

				/**
				 * Starts the render loop.
				 * Frames are rendered only if render loop is enabled.
				 */
				StartRenderLoop: function() {
					if (!this._iRenderLoopAnimationRequestId) {
						this._iRenderLoopAnimationRequestId = window.requestAnimationFrame(this._renderLoop.bind(this));
					}
				},

				/**
				 * Stops the render loop.
				 * Frames are rendered only if render loop is enabled.
				 */
				StopRenderLoop: function() {
					if (this._iRenderLoopAnimationRequestId) {
						window.cancelAnimationFrame(this._iRenderLoopAnimationRequestId);
						this._iRenderLoopAnimationRequestId = null;
					}
				},

				_renderLoop: function() {
					// Update all renderers.
					// For now there is only one renderer.
					if (Module.Settings.RendererToken) {
						Module.Renderer._processCommandQueue(Module.Settings.RendererToken);
						if (Module.Renderer.ShouldRenderFrame(Module.Settings.RendererToken)) {
							Module.Renderer.RenderFrame(Module.Settings.RendererToken);
						}
					}
					this._iRenderLoopAnimationRequestId = window.requestAnimationFrame(this._renderLoop.bind(this));
				},

				ExecuteCallback: function(callbackParam) {
					return Module.ccall("jDVLCore_ExecuteCallback", null, ["string", "number"], [Module.Settings.CoreToken, callbackParam]);
				}
			}; // Module.Core

			Module.CreateCoreInstance = function(clientId) {
				var ct = stringResult(Module.ccall("jDVL_CreateCoreInstance", "number", ["string"], [clientId || "default"]));
				Module.Settings.CoreToken = ct;
				Module.Settings.MajorVersion = Module.Core.GetMajorVersion();
				Module.Settings.MinorVersion = Module.Core.GetMinorVersion();
				return ct;
			};

			return Module;
		}

		var module = null;
		var defaultMemorySize  = 128 * 1024 * 1024; // 128 MB
		var stepDownMemorySize = 128 * 1024 * 1024; // 128 MB
		var stepDownAmount = 16 * 1024 * 1024; //16 MB

		options.totalMemory = options.totalMemory || defaultMemorySize;
		while (module === null && options.totalMemory > 0) {
			console.log("Trying to allocate memory: " + options.totalMemory + " bytes.");
			try {
				module = createModule(options);
			} catch (e) {
				if (e.name === "RangeError" /*Chrome, Edge, and Firefox */ || e.name === "TypeError" /*Internet Explorer */) {
					console.log(e.message + ": " + options.totalMemory);
					stepDownMemorySize = stepDownMemorySize - stepDownAmount;
					options.totalMemory = stepDownMemorySize;
				} else {
					console.log("ERROR CREATING DVL");
					console.log(e);
					throw e;
				}
			}
		}

		module.onRuntimeInitialized = function() {
			resolve(
				{
					CreateCoreInstance: module.CreateCoreInstance,
					Settings: module.Settings,
					Client: module.Client,
					Core: module.Core,
					Scene: module.Scene,
					Renderer: module.Renderer,
					Material: module.Material,
					Camera: module.Camera,
					Library: module.Library
				}
			)
		};
})};

// DvlEnums is defined at global level for backward compatiblity.
/**
 * SAP Visual Enterprise DVL namespace.
 * @namespace
 * @alias sap.ve.dvl
 */
var DvlEnums = {
	/**
	 * Enum of DVL results.
	 * @readonly
	 * @enum {number}
	 */
	DVLRESULT: {
		/** Indicates that no password was provided for the encrypted file, or the password provided was incorrect.*/
		ENCRYPTED: -19,
		/** Indicates that no file was found.*/
		FILENOTFOUND: -18,
		/** Indicates that the library has not been initialized properly.*/
		NOTINITIALIZED: -17,
		/** Indicates the version is wrong (file version, library version, etc).*/
		WRONGVERSION: -16,
		/** Indicates the file name does not have an extension.*/
		MISSINGEXTENSION: -15,
		/** Indicates access to the file has been denied.*/
		ACCESSDENIED: -14,
		/** Indicates there is no such interface.*/
		NOINTERFACE: -13,
		/** Indicates out of memory exception occurred.*/
		OUTOFMEMORY: -12,
		/** Indicates an invalid call was made.*/
		INVALIDCALL: -11,
		/** Indicates the item or file is not found.*/
		NOTFOUND: -10,
		/** Indicates the argument is invalid.*/
		BADARG: -9,
		/** Failure, something went completely wrong.*/
		FAIL: -8,
		/** Indicates that the thread is invalid.*/
		BADTHREAD: -7,
		/** Indicates incorrect format.*/
		BADFORMAT: -6,
		/** Indicates that an error occurred while reading the file.*/
		FILEERROR: -5,
		/** Indicates the requested feature is not yet implemented.*/
		NOTIMPLEMENTED: -4,
		/** Indicates that a hardware error occurred.*/
		HARDWAREERROR: -3,
		/** Indicates the process has been interrupted.*/
		INTERRUPTED: -1,
		/** Indicates a negative result.*/
		FALSE: 0,
		/** Indicates that everything is OK.*/
		OK: 1,
		/** Indicates that nothing was changed as a result of processing/action (similar to <code>OK</code>).
		 * For example, if you want to "hide a node that is already hidden".*/
		PROCESSED: 2,
		/** Indicates the initialization has been performed.
		 * Initialization can be done multiple times. However, this is not optimal.*/
		ALREADYINITIALIZED: 3,
		/** Returns the description of the DVLRESULT code.
		 * @type {sap.ve.dvl~getDvlResultDescription} */
		getDescription: function(code) {
			switch (code) {
				case DvlEnums.DVLRESULT.ENCRYPTED:          return "The file is encrypted and password is either not provided or incorrect";
				case DvlEnums.DVLRESULT.FILENOTFOUND:       return "The file is not found";
				case DvlEnums.DVLRESULT.NOTINITIALIZED:     return "The library has not been initialized properly";
				case DvlEnums.DVLRESULT.WRONGVERSION:       return "The version is wrong (file version, library version, etc)";
				case DvlEnums.DVLRESULT.MISSINGEXTENSION:   return "The name does not have an extension";
				case DvlEnums.DVLRESULT.ACCESSDENIED:       return "Access is denied";
				case DvlEnums.DVLRESULT.NOINTERFACE:        return "There is no such interface";
				case DvlEnums.DVLRESULT.OUTOFMEMORY:        return "Out of memory";
				case DvlEnums.DVLRESULT.INVALIDCALL:        return "Invalid call";
				case DvlEnums.DVLRESULT.NOTFOUND:           return "The item or file is not found";
				case DvlEnums.DVLRESULT.BADARG:             return "The argument is invalid";
				case DvlEnums.DVLRESULT.FAIL:               return "Failure, something went completely wrong";
				case DvlEnums.DVLRESULT.BADTHREAD:          return "Invalid thread";
				case DvlEnums.DVLRESULT.BADFORMAT:          return "Incorrect format";
				case DvlEnums.DVLRESULT.FILEERROR:          return "File reading error";
				case DvlEnums.DVLRESULT.NOTIMPLEMENTED:     return "The requested feature is not yet implemented";
				case DvlEnums.DVLRESULT.HARDWAREERROR:      return "Hardware error";
				case DvlEnums.DVLRESULT.INTERRUPTED:        return "The process has been interrupted";
				case DvlEnums.DVLRESULT.FALSE:              return "Negative result";
				case DvlEnums.DVLRESULT.OK:                 return "Everything is OK";
				case DvlEnums.DVLRESULT.PROCESSED:          return "Nothing was changed as a result of processing/action (similar to OK), for example if you want to hide a node that is already hidden";
				case DvlEnums.DVLRESULT.ALREADYINITIALIZED: return "The initialization has already been made (it is OK to initialize multiple times, just not optimal)";
				default:                                    return "Unknown";
			}
		}
	},
	/**
	 * Enum of step events.
	 * @readonly
	 * @enum {number}
	 */
	DVLSTEPEVENT: {
		/** Indicates the step has started (<code>stepId</code> is a new step).*/
		DVLSTEPEVENT_STARTED:  0,
		/** Indicates the previous step has finished, and the new one has started (<code>stepId</code> is a new step).*/
		DVLSTEPEVENT_SWITCHED: 1,
		/** Indicates the step has finished playing, and no more steps are to be played (<code>stepId</code> is the old step).*/
		DVLSTEPEVENT_FINISHED: 2
	},
	/**
	 * Enum of flag operations.
	 * @readonly
	 * @enum {number}
	 */
	DVLFLAGOPERATION: {
		/** Set the flag.*/
		DVLFLAGOP_SET:                0,
		/** Clear the flag.*/
		DVLFLAGOP_CLEAR:              1,
		/**
		 * If <code>DVLFLAGOP_MODIFIER_RECURSIVE</code>, then child node flags are set to parent flag values.
		 * For example, if parent is visible and child is hidden, after this operation both parent and child will be hidden.
		 */
		DVLFLAGOP_INVERT:             2,
		/**
		 * If <code>DVLFLAGOP_MODIFIER_RECURSIVE</code>, then child nodes are inverted.
		 * For example, if parent is visible and child is hidden, after this operation the parent will be hidden and the child visible.
		 */
		DVLFLAGOP_INVERT_INDIVIDUAL:  3,
		/** Bit mask.*/
		DVLFLAGOP_VALUES_BITMASK:     0x7F,
		/** Perform the operation recursively for all the subitems.*/
		DVLFLAGOP_MODIFIER_RECURSIVE: 0x80
	},
	/**
	 * Enum of zoom actions.
	 * @readonly
	 * @enum {number}
	 */
	DVLZOOMTO: {
		/** Zoom to the bounding box of the whole scene. */
		DVLZOOMTO_ALL:                        0,
		/** Zoom to the bounding box of visible nodes. */
		DVLZOOMTO_VISIBLE:                    1,
		/** Zoom to the bounding box of selected nodes. */
		DVLZOOMTO_SELECTED:                   2,
		/** Zoom to the bounding box of a specific node and its children. */
		DVLZOOMTO_NODE:                       3,
		/**  Same as <code>DVLZOOMTO_NODE</code>, but also does <code>[Renderer.SetIsolatedNode()]{@link Module.Renderer.SetIsolatedNode}</code> for the node. */
		DVLZOOMTO_NODE_SETISOLATION:          4,
		/** Zoom to the previously saved view. The view is saved every time <code>[Renderer.ZoomTo()]{@link Module.Renderer.ZoomTo}</code> is executed. */
		DVLZOOMTO_RESTORE:                    5,
		/**  Same as <code>DVLZOOMTO_RESTORE</code>, but also does <code>[Renderer.SetIsolatedNode()]{@link Module.Renderer.SetIsolatedNode}</code> with the <code>DVLID_INVALID</code> parameter. */
		DVLZOOMTO_RESTORE_REMOVEISOLATION:    6,
		/** Zoom to the left view. */
		VIEW_LEFT:   1 << 8,
		/** Zoom to the right view. */
		VIEW_RIGHT:  2 << 8,
		/** Zoom to the top view. */
		VIEW_TOP:    3 << 8,
		/** Zoom to the bottom view. */
		VIEW_BOTTOM: 4 << 8,
		/** Zoom to the back view. */
		VIEW_BACK:   5 << 8,
		/** Zoom to the front view. */
		VIEW_FRONT:  6 << 8
	},
	/**
	 * Enum of DVL execute actions.
	 * @readonly
	 * @enum {number}
	 */
	DVLEXECUTE: {
		/**
		 * VE query language. For example:
		 * <pre>
		 *   everything() select()
		 * <pre>
		 * Only for 3D files.
		 */
		DVLEXECUTE_QUERY:             0,
		/**
		 * SAP Paint XML. For example:
		 * <pre>
		 *   &lt;PAINT_LIST ASSEMBLY_PAINTING_ENABLED="true" ASSEMBLY_LEVEL="5">
		 *     &lt;PAINT COLOR="#008000" OPACITY="1.0" VISIBLE="true" ALLOW_OVERRIDE="false">
		 *       &lt;NODE ID="0__moto_x_asm">&lt;/NODE>
		 *     &lt;/PAINT>
		 *   &lt;/PAINT_LIST>
		 * </pre>
		 * Only for 3D files.
		 */
		DVLEXECUTE_PAINTXML:          1,
		/**
		 * CGM navigate action. For example:
		 * <pre>
		 *   pictid(engine_top).id(oil-pump-t,full+newHighlight)
		 * </pre>
		 * Only for 2D files.
		 * <br>See [WebCGM Intelligent Content]{@link http://www.w3.org/TR/webcgm20/WebCGM20-IC.html} for further information.
		 */
		DVLEXECUTE_CGMNAVIGATEACTION: 2,
		/**
		 * Dynamic Labels XML.
		 */
		DVLEXECUTE_DYNAMICLABELS:     3
	},
	/**
	 * Enum of rendering options.
	 * @readonly
	 * @enum {number}
	 */
	DVLRENDEROPTION: {
		/** Enable debug information to be displayed (for example, Frames Per Second (FPS)). By default, this is turned 'Off'. */
		DVLRENDEROPTION_SHOW_DEBUG_INFO:            0,
		/** Display backfacing triangles or not. By default, this option is 'Off'. */
		DVLRENDEROPTION_SHOW_BACKFACING:            1,
		/** Enable shadows to be displayed. By default, this option is 'On'. */
		DVLRENDEROPTION_SHOW_SHADOW:                2,
		/** Set camera rotation to Orbit or Turntable mode. By default, this option is 'Off' (Turntable mode). */
		DVLRENDEROPTION_CAMERA_ROTATION_MODE_ORBIT: 3,
		/**
		 * Clear the color buffer during each <code>[Renderer.RenderFrame()]{@link Module.Renderer.RenderFrame}</code> or not. Default: ON.
		 * By setting this option OFF, you can draw a textured background or paint video camera
		 * frame. The caller application would need to clear color buffer itself before calling
		 * <code>[Renderer.RenderFrame()]{@link Module.Renderer.RenderFrame}</code> if option is OFF.
		 */
		DVLRENDEROPTION_CLEAR_COLOR_BUFFER:         4,
		/** Enable Ambient Occlusion render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_AMBIENT_OCCLUSION:          5,
		/** Enable Anaglyph Stereo render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_ANAGLYPH_STEREO:            6,
		/** Enable hotspots to be displayed or not. By default, this option is 'Off'. This only works for 2D .cgm scenes. */
		DVLRENDEROPTION_SHOW_ALL_HOTSPOTS:          9,
		/** Enable Left+Right Stereo render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_LEFT_RIGHT_STEREO:          10,
		/** Enable Solid render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_SOLID:                      11,
		/** Enable Transparent render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_TRANSPARENT:                12,
		/** Enable Line Illustration render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_LINE_ILLUSTRATION:          13,
		/** Enable Solid Outline render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_SOLID_OUTLINE:              14,
		/** Enable Shaded Illustration render mode. If this option is turned 'On', other render modes will be disabled. */
		DVLRENDEROPTION_SHADED_ILLUSTRATION:        15
	},
	/**
	 * Enum of additional rendering options.
	 * @readonly
	 * @enum {number}
	 */
	DVLRENDEROPTIONF: {
		/**
		 * Indicates the DPI (Dots Per Inch) setting. Defaults to 132.0 on iPad, and 96.0 on other platforms.
		 * Used in calculating the size of sprites and polyline thickness. It is highly recommended that you set the DPI properly.
		 */
		DVLRENDEROPTIONF_DPI: 0,

		///**
		// * Amount of millions of triangles in scene used to determine whether "dynamic loading" should be performed or not.
		// * If the scene has less than the given number of triangles, normal rendering is performed.
		// * Otherwise, "dynamic loading" is done: meshes are loaded on demand and rendering via occlusion culling is performed.
		// * Default: 3.0 (3,000,000 triangles in scene is needed to use "dynamic loading").
		// * Set to 0.0f to always have dynamic loading.
		// * Set to -1.0f to disable dynamic loading.
		// *
		// * Not available in JavaScript applications.
		// */
		//DVLRENDEROPTIONF_DYNAMIC_LOADING_THRESHOLD: 1,

		///**
		// * Indicates the maximum amount of video memory (in megabytes) that DVL Core may use for loading meshes.
		// * Default: 256 MB on iPad, and 512 MB on other platforms.
		// *
		// * Not available in JavaScript applications.
		// */
		//DVLRENDEROPTIONF_VIDEO_MEMORY_SIZE: 2,

		/**
		 * Indicates the minimum visible CGM font size.
		 * The default font size is 20.
		 */
		DVLRENDEROPTIONF_MIN_VISIBLE_FONT_SIZE: 3,

		/**
		 * Indicates the minimum visible object size in pixels.
		 * The default object size is 4.
		 */
		DVLRENDEROPTIONF_MIN_VISIBLE_OBJECT_SIZE: 4
	},
	/**
	 * Enum of scene actions.
	 * @readonly
	 * @enum {number}
	 */
	DVLSCENEACTION: {
		/** Make all nodes in the scene "visible". */
		DVLSCENEACTION_SHOW_ALL:      0,
		/** Make all nodes in the scene "hidden". */
		DVLSCENEACTION_HIDE_ALL:      1,
		/** Make selected nodes and all their children "visible". */
		DVLSCENEACTION_SHOW_SELECTED: 2,
		/** Make selected nodes and all their children "hidden". */
		DVLSCENEACTION_HIDE_SELECTED: 3
	},
	/**
	 * Enum of scene information.
	 * @readonly
	 * @enum {number}
	 */
	DVLSCENEINFO: {
		/** Retrieve the list of child nodes.*/
		DVLSCENEINFO_CHILDREN:            0x01,
		/** Retrieve the list of selected nodes.*/
		DVLSCENEINFO_SELECTED:            0x02,
		/** Retrieve the prefix for scene localization.*/
		DVLSCENEINFO_LOCALIZATION_PREFIX: 0x04,
		/** Retrieve the dimensions of the scene.*/
		DVLSCENEINFO_DIMENSIONS:          0x08,
		/** Retrieve the current step ID and step time.*/
		DVLSCENEINFO_STEP_INFO:           0x10,
		/** Retrieve a list of layers in the scene.*/
		DVLSCENEINFO_LAYERS:              0x20,
		/** Retrieve the display units used in the scene.*/
		DVLSCENEINFO_DISPLAY_UNITS:       0x40,
		/** Retrieve a list of all materials. Reserved for future. */
		DVLSCENEINFO_MATERIALS:           0x80,
		/** Retrieve a list of all hotspots.*/
		DVLSCENEINFO_HOTSPOTS:            0x100,
		/** Retrieve a list of hotspot layers.*/
		DVLSCENEINFO_HOTSPOT_LAYERS:      0x200
	},
	/**
	 * Enum of node information retrieval methods.
	 * @readonly
	 * @enum {number}
	 */
	DVLNODEINFO: {
		/** Retrieve the name of the node. */
		DVLNODEINFO_NAME:            0x0001,
		/** Retrieve the node asset ID. */
		DVLNODEINFO_ASSETID:         0x0002,
		/** Retrieve the node unique ID. */
		DVLNODEINFO_UNIQUEID:        0x0004,
		/** Retrieve parents of the node. */
		DVLNODEINFO_PARENTS:         0x0008,
		/** Retrieve children of the node. */
		DVLNODEINFO_CHILDREN:        0x0010,
		/** Retrieve node flags. */
		DVLNODEINFO_FLAGS:           0x0020,
		/** Retrieve node opacity. */
		DVLNODEINFO_OPACITY:         0x0040,
		/** Retrieve node highlight color. */
		DVLNODEINFO_HIGHLIGHT_COLOR: 0x0080,
		/** Retrieve node URIs. */
		DVLNODEINFO_URI:             0x0100
	},
	/**
	 * Enum of node flags.
	 * @readonly
	 * @enum {number}
	 */
	DVLNODEFLAG: {
		/** Indicates the node is visible. */
		DVLNODEFLAG_VISIBLE: 0x01,
		/** Indicates the node is selected.*/
		DVLNODEFLAG_SELECTED: 0x02,
		/** Indicates the node is a hotspot.*/
		DVLNODEFLAG_HOTSPOT: 0x04,
		/** Indicates the node is closed (the node itself and all children are treated as a single node).*/
		DVLNODEFLAG_CLOSED: 0x08,
		/** Indicates the node is single-sided.*/
		DVLNODEFLAG_SINGLE_SIDED: 0x10,
		/** Indicates the node is double-sided.*/
		DVLNODEFLAG_DOUBLE_SIDED: 0x20,
		/** Indicates the node cannot be 'hit'; that is, the node remains transparent when clicked or tapped.*/
		DVLNODEFLAG_UNHITABLE: 0x40,
		/** Indicates the node is a common billboard - it scales with the camera, but is always orthogonal.*/
		DVLNODEFLAG_BILLBOARD_VIEW: 0x80,
		/** Indicates the node is positioned on a 2D layer on top of the screen.*/
		DVLNODEFLAG_BILLBOARD_LOCK_TO_VIEWPORT: 0x100,
		// mapped node flags (flags that don't really exist and are emulated for DVL purposes)
		// (m_pChildren !: NULL)
		/** Indicates the node has children.*/
		DVLNODEFLAG_MAPPED_HASCHILDREN: 0x0200,
		// m_Name.NotEmpty()
		/** Indicates the node has a name.*/
		DVLNODEFLAG_MAPPED_HASNAME: 0x0400,
		// m_AssetID.NotEmpty()
		/** Indicates the node has an asset identifier.*/
		DVLNODEFLAG_MAPPED_HASASSETID: 0x0800,
		// m_UniqueID.NotEmpty() //
		/** Indicates the node has a unique identifier.*/
		DVLNODEFLAG_MAPPED_HASUNIQUEID: 0x1000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT0: 0x00010000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT1: 0x00020000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT2: 0x00040000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT3: 0x00080000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT4: 0x00100000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT5: 0x00200000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT6: 0x00400000,
		///** Reserved for internal use. */
		//DVLNODEFLAG_INTERNAL_QUERY_BIT7: 0x00800000,
		// temporary node flags (used for some purposes, but not saved/loaded from file
		/** Temporary flag: Indicates the visibility of the node in the previous frame.*/
		DVLNODEFLAG_TEMPORARY_PREVIOUS_VISIBILITY: 0x10000000,
		/** Temporary flag: Indicates the visibility of the node when the file was just loaded.*/
		DVLNODEFLAG_TEMPORARY_ORIGINAL_VISIBILITY: 0x20000000,
		/** Temporary flag: Indicates whether the node was consumed in this step or not.*/
		DVLNODEFLAG_TEMPORARY_CONSUMED: 0x40000000
	},
	/**
	 * Enum of options for building parts list.
	 * @readonly
	 * @enum {number}
	 */
	DVLPARTSLISTTYPE: {
		/**
		 * Build a parts list using all the nodes.
		 */
		DVLPARTSLISTTYPE_ALL:              0,
		/**
		 * Build a parts list using only the visible nodes.
		 */
		DVLPARTSLISTTYPE_VISIBLE:          1,
		/**
		 * Build a parts list using only the nodes consumed by a particular step.
		 * Step DVLID is passed as a parameter to the BuildPartsList() call.
		 */
		DVLPARTSLISTTYPE_CONSUMED_BY_STEP: 2
	},
	/**
	 * Enum of options for sorting parts list.
	 * @readonly
	 * @enum {number}
	 */
	DVLPARTSLISTSORT: {
		/** Sort parts alphabetically in ascending order (from A to Z).*/
		DVLPARTSLISTSORT_NAME_ASCENDING:    0,
		/** Sort parts alphabetically in descending order (from Z to A).*/
		DVLPARTSLISTSORT_NAME_DESCENDING:   1,
		/** Sort parts by the number of nodes in the part; parts with smaller number of nodes go first.*/
		DVLPARTSLISTSORT_COUNT_ASCENDING:   2,
		/** Sort parts by the number of nodes in the part; parts with larger number of nodes go first.*/
		DVLPARTSLISTSORT_COUNT_DESCENDING:  3
	},
	/**
	 * Enum of the options for finding nodes.
	 * @readonly
	 * @enum {number}
	 */
	DVLFINDNODETYPE: {
		/** Find node or nodes by node name.*/
		DVLFINDNODETYPE_NODE_NAME:      0,
		/** Find node or nodes by asset ID (asset ID is stored inside some VDS files, and is optional).*/
		DVLFINDNODETYPE_ASSET_ID:       1,
		/** Find node or nodes by unique ID (unique ID is stored inside some VDS files, and is optional).*/
		DVLFINDNODETYPE_UNIQUE_ID:      2,
		/** Find node or nodes by DS selector ID (DS selector ID is stored inside some VDS files, and is optional).*/
		DVLFINDNODETYPE_DSSELECTOR_ID:  3,
		/** Find node or nodes by metadata (metadata is optional).*/
		DVLFINDNODETYPE_METADATA:       4
	},
	/**
	 * Enum of the different modes for finding nodes.
	 * @readonly
	 * @enum {number}
	 */
	DVLFINDNODEMODE: {
		/** Match nodes by comparing node name/assetid/uniqueid with "str". Case sensitive search.
		 * This is the fastest search option (does buffer compare without UTF8 parsing).*/
		DVLFINDNODEMODE_EQUAL:                          0,
		/** Match nodes by comparing node name/assetid/uniqueid with "str". Case insensitive search. UTF8-aware.*/
		DVLFINDNODEMODE_EQUAL_CASE_INSENSITIVE:         1,
		/** Match nodes by finding "str" substring in node name/assetid/uniqueid. Case sensitive search. UTF8-aware.*/
		DVLFINDNODEMODE_SUBSTRING:                      2,
		/** Match nodes by finding "str" substring in node name/assetid/uniqueid. Case insensitive search. UTF8-aware.*/
		DVLFINDNODEMODE_SUBSTRING_CASE_INSENSITIVE:     3,
		/** Match nodes by comparing first "strlen(str)" symbols of node name/assetid/uniqueid with "str". Case sensitive search. UTF8-aware.*/
		DVLFINDNODEMODE_STARTS_WITH:                    4,
		/** Match nodes by comparing first "strlen(str)" symbols of node name/assetid/uniqueid with "str". Case insensitive search. UTF8-aware.*/
		DVLFINDNODEMODE_STARTS_WITH_CASE_INSENSITIVE:   5
	},
	/**
	 * Enum of client log types.
	 * @readonly
	 * @enum {number}
	 */
	DVLCLIENTLOGTYPE: {
		/** Indicates 'debug' type message has been logged (can usually be ignored).*/
		DVLLOGTYPE_DEBUG:   0,
		/** Indicates an 'information' type message has been logged (for example, the name of the file loaded, or the ID of the activated step).*/
		DVLLOGTYPE_INFO:    1,
		/** Indicates a 'warning' type message has been logged (something went wrong, but you can proceed).*/
		DVLLOGTYPE_WARNING: 2,
		/** Indicates an 'error' type message has been logged (something has failed).*/
		DVLLOGTYPE_ERROR:   3
	},
	/**
	 * Enum of material color parameters.
	 * @readonly
	 * @enum {number}
	 */
	DVLMATERIALCOLORPARAM: {
		/** Ambient color. */
		AMBIENT:  0,
		/** Diffuse color. */
		DIFFUSE:  1,
		/** Specular color. */
		SPECULAR: 2,
		/** Emissive color. */
		EMISSIVE: 3
	},
	/**
	 * Enum of material scalar parameters.
	 * @readonly
	 * @enum {number}
	 */
	DVLMATERIALSCALARPARAM: {
		/** Opacity. */
		OPACITY: 0,
		/** Glossiness. */
		GLOSSINESS: 1,
		/** Specular Level. */
		SPECULAR_LEVEL: 2
	},
	/**
	 * Enum of material color parameters.
	 * @readonly
	 * @enum {number}
	 */
	DVLMATERIALTEXTURE: {
		/** First diffuse color. */
		DIFFUSE:           0,
		/** Second diffuse color. */
		DIFFUSE2:          1,
		/** Third diffuse color. */
		DIFFUSE3:          2,
		/** Fourth diffuse color. */
		DIFFUSE4:          3,
		/** Self illumination color. */
		SELF_ILLUMINATION: 4,
		/** Reflection. */
		REFLECTION:        5,
		/** Bump map. */
		BUMP:              6
	},
	/**
	 * Enum of material texture parameters.
	 * @readonly
	 * @enum {number}
	 */
	DVLMATERIALTEXTUREPARAM: {
		/** Texture amount. */
		AMOUNT: 0,
		/** Texture offset in the U-axis. */
		OFFSET_U: 1,
		/** Texture offset in the V-axis. */
		OFFSET_V: 2,
		/** Texture scale in the U-axis. */
		SCALE_U: 3,
		/** Texture scale in the V-axis. */
		SCALE_V: 4,
		/** Texture angle. */
		ANGLE: 5
	},
	/**
	 * Enum of material texture flags.
	 * @readonly
	 * @enum {number}
	 */
	DVLMATERIALTEXTUREFLAG: {
		/** Clamp u flag. */
		CLAMP_U: 0,
		/** Clamp v flag. */
		CLAMP_V: 1,
		/** Modulate flag. */
		MODULATE: 2,
		/** Invert flag. */
		INVERT: 4,
		/** Color map flag. */
		COLOR_MAP: 5,
		/** Decal flag. */
		DECAL: 6
	},
	/**
	 * Enum of camera projection types.
	 * @readonly
	 * @enum {number}
	 */
	DVLCAMERAPROJECTION: {
		/** Perspective projection. */
		PERSPECTIVE:   0,
		/** Orthographic projection. */
		ORTHOGRAPHIC:  1
	},
	/**
	 * Enum of camera field of view (FOV) binding.
	 * @readonly
	 * @enum {number}
	 */
	DVLCAMERAFOVBINDING: {
		/** Bind the camera field of view to the shortest edge of the viewport. */
		MIN:  0,
		/** Bind the camera field of view to the longest edge of the viewport. */
		MAX:  1,
		/** Bind the camera field of view horizontally. */
		HORZ: 2,
		/** Bind the camera field of view vertically. */
		VERT: 3
	},
	/**
	 * Enum of flag states related to creating node copies.
	 * @readonly
	 * @enum {number}
	 */
	DVLCREATENODECOPYFLAG: {
		/** Copy children of the node. */
		COPY_CHILDREN:  0x1,
		/** Copy animations attached to the node. */
		COPY_ANIMATION: 0x2,
		/** Copy children of the node and animations attached to the node. */
		FULL_COPY:   0xFFFF
	},
	/**
	 * Enum of flag states describing the features of a VDS file. Flags can be combined.
	 * @readonly
	 * @enum {number}
	 */
	DVLFILEFLAG: {
		/** Indicates the individual pages inside the file are compressed.*/
		PAGESCOMPRESSED: 1,
		/** Indicates the whole file is compressed.*/
		WHOLEFILECOMPRESSED: 2,
		/** Indicates the file is encrypted.*/
		ENCRYPTED: 4
	},
	/**
	 * Enum of reset view options.
	 * @readonly
	 * @enum {number}
	 */
	DVLRESETVIEWFLAG: {
		/** Reset the camera position. */
		CAMERA: 1,
		/** Reset the node visibility. */
		VISIBILITY: 1 << 1,
		/** Perform smooth animated transition between current viewport and home viewport. */
		SMOOTHTRANSITION: 1 << 2
	},
	/** Enum of actions that define the way a layer is applied to the scene in <code>ApplyLayerVisibility()</code>.
	 * @readOnly
	 * @enum {number}
	 */
	DVLLAYERVISIBILITYACTION: {
		/** Hide all nodes in the scene, and then show only the nodes in the layer.*/
		HIDEALL_SHOWLAYER: 0,
		/** Show all nodes in the scene, and then hide only the nodes in the layer.*/
		SHOWALL_HIDELAYER: 1,
		/** Make nodes in the layer visible. Does not change the visibility of nodes that are not in the layer.*/
		SHOWLAYER: 2,
		/** Make nodes in the layer hidden. Does not change the visibility of nodes that are not in the layer.*/
		HIDELAYER: 3
	},
	/** of model source locations.
	 * @readonly
	 * @enum {string}
	 */
	SOURCELOCATION: {
		/** File is loaded from a computer's local file system via the [File API]{@link https://developer.mozilla.org/en-US/docs/Web/API/File}. */
		LOCAL: "local",
		/** File is loaded from a remote location via the HTTP(S) protocol. */
		REMOTE: "remote"
	},
	/**
	 * Indicates an 'invalid' value of the DVLID type.
	 * @readonly
	 * @type {string}
	 */
	DVLID_INVALID: "iffffffffffffffff"
}; // DvlEnums

Object.getOwnPropertyNames(DvlEnums).forEach(function(propName) {
	sap.ve.dvl[propName] = DvlEnums[propName];
});

/**
 * Top level SAP namespace.
 * @namespace sap
 */

/**
 * SAP Visual Enterprise namespace.
 * @namespace sap.ve
 */

// This namespace defined as alias for DvlEnums.
///**
// * SAP Visual Enterprise DVL namespace.
// * @namespace sap.ve.dvl
// */

/**
 * Creates a DVL module runtime instance.
 * @function sap.ve.dvl.createRuntime
 * @param {object} [options] Emscripten runtime module settings. A JSON object with the following properties:
 * @param {number} [options.totalMemory=128*1024*1024] Size of Emscripten module memory in bytes.
 * @param {string} [options.logElementId]              ID of a textarea DOM element to write the log to.
 * @param {string} [options.statusElementId]           ID of a DOM element to write the status messages to.</li>
 * @returns {sap.ve.dvl~DVL}                           A DVL module runtime instance.
 */

/**
 * DVL module runtime. Instances of this type are not created with operator <code>new</code>.
 * They can only be created with a call to [sap.ve.dvl.createRuntime()]{@link sap.ve.dvl.createRuntime}.
 * @typedef {Object} sap.ve.dvl~DVL
 * @property {sap.ve.dvl~CreateCoreInstance} CreateCoreInstance A function to create a new instance of DVL core.
 * @property {sap.ve.dvl~Settings}           Settings           The DVL settings used internally to track various instance properties.
 * @property {sap.ve.dvl~Client}             Client             A set of callback functions used for notifications from the DVL library.
 * @property {sap.ve.dvl~Core}               Core               A set of functions that defines the main interface for interaction with the DVL library.
 * @property {sap.ve.dvl~Scene}              Scene              A set of functions that allow to access the scene tree, enumerate nodes and perform some operations,
 *                                                              like selection or metadata retrieval.
 * @property {sap.ve.dvl~Renderer}           Renderer           A set of functions for interaction with the rendering system of the DVL library.
 * @property {sap.ve.dvl~Library}            Library            A set of functions for interaction with file library.
 */

/**
 * Returns the description of the <code>DVLRESULT</code> code.
 * @function sap.ve.dvl~getDvlResultDescription
 * @param {sap.ve.dvl.DVLRESULT} code The <code>DVLRESULT</code> enum code.
 * @returns {string} The description of the <code>DVLRESULT</code> code.
 */

/**
 * Creates a new instance of DVL core.
 * @function sap.ve.dvl~CreateCoreInstance
 * @param {string} clientId Token representing the target client instance. This is usually the canvas ID.
 * @returns {string|sap.ve.dvl.DVLRESULT} The DVL core token or an error code if fails.
 */
