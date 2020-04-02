jQuery.sap.declare("AppScflTest.util.Model");

AppScflTest.util.Model = {
		
	getPath : function (oModel, sPath, sProperty, sValue) {
		if (oModel) {
			var mColl = oModel.getProperty(sPath);
			if (mColl) {
				for (var i = 0 ; i < mColl.length ; i++) {
					if (mColl[i] && mColl[i][sProperty] === sValue) {
						return sPath + "/" + i;
					}
				}
			}
		}
		return null;
	}
};