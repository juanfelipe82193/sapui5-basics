sap.ui.define([
	"sap/viz/ui5/controls/VizFrame",
	"sap/viz/ui5/controls/common/feeds/AnalysisObject"
], function(VizFrame, AnalysisObject) {

	/**
	 * Destroy the created vizcontainer.
	 * @param {obj} _vizContainer
	 *
	 */
var destroyVizContainer = function(_vizContainer) {
	if (_vizContainer) {
		_vizContainer.destroy();
	}
};

/*function:equalAnalysisObjects
 * description: compare whether two analysisObjects are equal
 * @param {obj} aop1
 *	@param {obj} aop2
 *@return {boolean} whether the 2 analysisObjects are equal or not.
 */
var equalAnalysisObjects = function(aop1, aop2) {	


	if(aop1 && aop2 ){
		if(aop1.length !== aop2.length){
			return false;
		}else{
			for(var i=0; i<aop1.length;i++){
				var ao1 = aop1[i];
				var ao2 = aop2[i];
				if(ao1.getUid() !== ao2.getUid()) {
					return false;
				}
				if(ao1.getName() !== ao2.getName()) {
					return false;
				}
				if(ao1.getType() !== ao2.getType()) {
					return false;
				}
			}
			return true;		
		}	
	}
};

/*
 *  function objectEqual: check if 2 data points(objects) are the same
 *  @param {object} objA: result data point
 *  @param {object} objB: expected data point
 *  @return {boolean} whether the 2 object are equal or not.
 */  
var objectEqual = function(objA, objB) {
    if(typeof objA !== typeof objB) {
        return false;
    }
    if (objA === undefined) {
        if (objB !== undefined) {
            return false;
        }
    };
    if (objA === null) {
        if (objB !== null) {
            return false;
        }
    };
    if(objA instanceof Array) {
        if (!(objB instanceof Array)) {
            return false;
        }
        if(objA.length !== objB.length) {
            return false;
        };
        var arrayEqualResult = true;
        for(var i = 0; i < objA.length; i++) {
            if(typeof objA[i] !== typeof objB[i]) {
                return false;
            }
            if(typeof objA[i] === 'boolean' || typeof objA[i] === 'number' || typeof objA[i] === 'string' || typeof objA[i] === 'undefined' || objA[i] === null) {
                arrayEqualResult = (objA[i] === objB[i]);
            } else if(objA[i] instanceof Object){
                arrayEqualResult = objectEqual(objA[i] , objB[i]);
            } else{
                return false;
            }
            if(!arrayEqualResult){
                return false;
            }
        }
        return true;
    };
    
    if( objA instanceof Object && objB instanceof Object && typeof objA !== 'function' && typeof objB !== 'function') {
        if(objB === null || objB instanceof Array) {
            return false;
        }
        var attrLenA = 0, attrLenB = 0;
        var attr;
        for(attr in objA) {
            if(!objectEqual(objA[attr], objB[attr])) {
                return false;
            }
            attrLenA++;
        }
        for(attr in objB) {
            if(objB.hasOwnProperty(attr)) {
                attrLenB++;
            }
        }
        if(attrLenA !== attrLenB) {
            return false;
        }
        return true;
    }
    return objA === objB;
};

/*
 *  function arrayEqualIgnoreSequence: check if the 2 arrays of data points are the same except for the order of data points
 *  @param {array} array1: result data points
 *  @param {array} array2: expected data points.
 *  @return {boolean} whether the 2 arrays are equal or not.
 */    
 var arrayEqualIgnoreSequence = function(array1, array2) {
    var hasMap;
    
    if (array1.length!=array2.length) return false;
    
    for(var i = 0; i < array1.length; i++) {
        hasMap = false;

        for(var j = 0; j < array2.length; j++) {
            if(objectEqual(array1[i], array2[j]))
                hasMap = true;
        }
        if(!hasMap) return false;
    }
    return true;
};
/**
 * Set feeds to VizContainer.
 * @param {obj} _vizContainer
 * @param {array} _aFeeds
 *
 */
var setVizContainerFeeds = function(_vizContainer, _aFeeds) {
	if (_vizContainer) {
		_vizContainer.destroyFeeds();
		if (_aFeeds && _aFeeds.length) {
			for (var i = 0; i < _aFeeds.length; i++) {
				_vizContainer.addFeed(_aFeeds[i]);	
			}
		}
	}
};

/**
 * Compare the Uid of two feeds.
 * @param {array} _aFeeds1
 * @param {array} _aFeeds2
 *
 */
var compareFeedsUid = function(_aFeeds1, _aFeeds2) {
	var result = true;
	if (_aFeeds1 && _aFeeds2) {
		if(_aFeeds1.length == _aFeeds2.length) {
			var feeds1Uid = [];
			var feeds2Uid = [];
			for (var i = 0; i < _aFeeds1.length; i++) {
				feeds1Uid[i] = _aFeeds1[i].getUid();
				feeds2Uid[i] = _aFeeds1[i].getUid();
			}
			result = (feeds1Uid.sort().toString() == feeds2Uid.sort().toString());
		}
		else {
			result = false;
		}
	}
	else {
		result =false;
	}
	return result;
};


/**
 * create analys object
 * @param {array} _analysisindexes AnalysisInfo index
 *e,g:_analysisindexes=[0,1,2]
 */
var createAnalysisObj = function(_analysisindexes)
{
	var length = _analysisindexes.length;
	var length_aInfo = AnalysisInfo.length;
	var _analysisObj = [];
	for(var i=0;i<length;i++)
	{
		if(_analysisindexes[i]<length_aInfo)
		{
			var _analysisinfo = new AnalysisObject(AnalysisInfo[_analysisindexes[i]]);
			_analysisObj.push(_analysisinfo);
		}
	};
	return _analysisObj;
};

/**
 * Destroy the created vizframe.
 * @param {obj} _vizframe
 *
 */
var destroyVizFrame = function(_vizframe) {
if (_vizframe) {
	_vizframe.destroy();
}
};


/**
 * create vizFrame
 * @param {obj} it is json, keyword: viztype
 *
 */

var createVizFrame = function(_options)
{
	if(arguments.length == 0)
		_options = {};
	//get viztype
	if(_options.hasOwnProperty("viztype"))
	{
		var viztype = _options.viztype;
	}else
		var viztype = 'column';
 	var vizFrame = new VizFrame( {
 		'uiConfig' : {
            'applicationSet': 'fiori'
        }
	});
 	vizFrame.setVizType(viztype);
	return vizFrame;
};

/**
 * Set feeds to VizContainer or vizFrame
 * @param {obj} _vizContainer
 * @param {array} _aFeeds
 *
 */
var setVizControlFeeds = function(_vizControl, _aFeeds) {
	if (_vizControl) {
		_vizControl.destroyFeeds();
		if (_aFeeds && _aFeeds.length) {
			for (var i = 0; i < _aFeeds.length; i++) {
				_vizControl.addFeed(_aFeeds[i]);	
			}
		}
	}
};

/**
 * converts short notation hex color code to long notation
 * @param input, e.g. #abc
 * @returns {string}, e.g. #aabbcc
 */
var unifyHexNotation = function(input) {
	if (input.length === 4) {
		var colorShortNotationRegexp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		var sResult = colorShortNotationRegexp.exec(input);
		if (sResult) {
			return "#" + sResult[1] + sResult[1] + sResult[2] + sResult[2] + sResult[3] + sResult[3];
		}
	}
	return input;
}

	return {
		destroyVizContainer: destroyVizContainer,
		equalAnalysisObjects: equalAnalysisObjects,
		objectEqual: objectEqual,
		arrayEqualIgnoreSequence: arrayEqualIgnoreSequence,
		setVizContainerFeeds: setVizContainerFeeds,
		compareFeedsUid: compareFeedsUid,
		createAnalysisObj: createAnalysisObj,
		destroyVizFrame: destroyVizFrame,
		createVizFrame: createVizFrame,
		setVizControlFeeds: setVizControlFeeds,
		unifyHexNotation: unifyHexNotation
	};

});
