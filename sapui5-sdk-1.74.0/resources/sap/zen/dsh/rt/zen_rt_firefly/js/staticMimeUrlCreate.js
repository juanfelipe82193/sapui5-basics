sap.zen.createStaticMimeUrl = function(path){
	var s = "";
	var li = path.lastIndexOf(".");
	var li2 = path.lastIndexOf("/");
	if(li2 > li){
		li = -1;
	}
	
	if(sap.zen.doReplaceDots){
		// replace . in package names with _, BUT don't replace ..
		for(var i=0; i<path.length; i++){
			var c = path.charAt(i);
			if(i==li){
				s+= c; 
			} else {
				if(c == '.') {
					if(path.charAt(i+1)=="."){
						s+= "..";
						i++;
					} else {
						s+= "_";
					}
				} else {
					s+= c; 
				}
			}
		}
	}
	
	return sapbi_page.staticMimeUrlPrefix + s; 
};

sap.zen.createStaticSdkMimeUrl = function(sdkExtensionId, path) {
	sdkExtensionId = sdkExtensionId.replace(/\./g, "_"); 
	return "/designstudio_extensions/" + sdkExtensionId + "/" + path;
};

