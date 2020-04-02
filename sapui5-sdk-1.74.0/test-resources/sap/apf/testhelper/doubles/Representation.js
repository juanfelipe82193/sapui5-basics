jQuery.sap.declare('sap.apf.testhelper.doubles.Representation');
jQuery.sap.require('sap.apf.ui.representations.representationInterface');
sap.apf.testhelper.doubles.SelectionStrategy = {
	coCode1000Cust1001 : 'coCode1000Cust1001',
	coCode1000Cust1001_1002 : 'coCode1000Cust1001_1002',
	coCode1000Cust1001_2_1004 : 'coCode1000Cust1001_2_1004',
	indicesOfSelectedData : 'indicesOfSelectedData',
	coArea1000_2000 : 'coArea1000_2000',
	coArea1000project1001_1002 : 'coArea1000project1001_1002',
	threeCompanyCodes : 'threeCompanyCodes',
	twoCompanyCodes : 'twoCompanyCodes',
	oneCompanyCode : 'oneCompanyCode',
	coSAPClient777 : 'cSAPClient777',
	returnReceivedFilter : 'receivedFilter',
	all : 'all',
	nothing : 'nothing',
	undefinedSelection : 'undefinedSelection',
	returnChangedSAPClientAndAddCustomers : 'returnChangedSAPClientAndAddCustomers',
	allMinus1 : 'allMinus1',
	oneCountry : 'oneCountry'
};
sap.apf.testhelper.doubles.RequestOptionStrategy = {
	nothing : 'nothing',
	top : 'top',
	topAndSkip : 'topSkip',
	skip : 'skip',
	inlineCount : 'inlineCount',
	orderbyPropertyTwo : 'orderbyPropertyTwo',
	all : 'all',
	multiOptionsPagingAndOrderbyPropertyOne : 'multiOptionsPagingAndOrderbyPropertyOne',
	multiOptionsPagingAndOrderbyPropertyTwo : 'multiOptionsPagingAndOrderbyPropertyTwo'
};
/**
 * @class sap.apf.testhelper.doubles.Representation
 * @param oApi - required methods interface to APF
 * @param oParameter - parameters for the representation
 */
sap.apf.testhelper.doubles.Representation = function(oApi, oParameter) {
	this.type = oParameter.sRepresentationType;
	check(this.type !== undefined, "No representation type handed over to representation double");
	this.parameter = oParameter;
	this.aDataResponse = undefined; // TODO: remove and adopt changes in all tests - using getParametersOfSetData().dataResponse
	var oParametersOfSetData = {
		dataResponse : undefined,
		metadata : undefined,
		sSelectionStrategy : oParameter.sSelectionStrategy || sap.apf.testhelper.doubles.SelectionStrategy.nothing,
		sRequestOptionStrategy : oParameter.sRequestOptionStrategy || sap.apf.testhelper.doubles.RequestOptionStrategy.nothing
	};
	this.aIndicesOfSelectedData = [];
	var bAdoptionSucceeds;
	var _sFilterMethodType;
	this.oReceivedFilter = undefined;
	/**
	 * @description returns the paramter passed to this representation.
	 */
	this.getParameter = function() {
		return this.parameter;
	};
	this.destroy = function() {
		return;
	};
	/**
	 * @description method is called from binding and sets the data, that has to be displayed
	 */
	this.setData = function(aDataResponse, oMetadata) {
		this.aDataResponse = aDataResponse;
		oParametersOfSetData.dataResponse = aDataResponse;
		oParametersOfSetData.metadata = oMetadata;
	};
	/**
	 * @description selection is transferred, when switching between representations
	 */
	this.setSelectionAsArray = function(aIndicesOfSelectedData) {
		this.aIndicesOfSelectedData = aIndicesOfSelectedData;
	};
	this.getSelections = function() {
		return this.getSelectionAsArray();
	};
	/**
	 * @description this is the basic method, with which the step can detect,
	 *              which data has been selected on the chart.
	 */
	this.getSelectionAsArray = function() {
		var i;
		var aIndices;
		if (oParametersOfSetData.dataResponse === undefined || oParametersOfSetData.dataResponse.length === 0) {
			return [];
		}
		switch (oParametersOfSetData.sSelectionStrategy) {
			case sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001:
				return cutIndicesArrays(getIndicesInaDataResponse('CompanyCode', '1000'), getIndicesInaDataResponse('Customer', '1001'));
			case sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_1002:
				return cutIndicesArrays(getIndicesInaDataResponse('CompanyCode', '1000'), unionIndicesArrays(getIndicesInaDataResponse('Customer', '1001'), getIndicesInaDataResponse('Customer', '1002')));
			case sap.apf.testhelper.doubles.SelectionStrategy.coCode1000Cust1001_2_1004:
				return cutIndicesArrays(getIndicesInaDataResponse('CompanyCode', '1000'), unionIndicesArrays(unionIndicesArrays(getIndicesInaDataResponse('Customer', '1001'), getIndicesInaDataResponse('Customer', '1002')), unionIndicesArrays(
						getIndicesInaDataResponse('Customer', '1003'), getIndicesInaDataResponse('Customer', '1004'))));
			case sap.apf.testhelper.doubles.SelectionStrategy.coArea1000_2000:
				return unionIndicesArrays(getIndicesInaDataResponse('CoArea', '1000'), getIndicesInaDataResponse('CoArea', '2000'));
			case sap.apf.testhelper.doubles.SelectionStrategy.coArea1000project1001_1002:
				return cutIndicesArrays(getIndicesInaDataResponse('CoArea', '1000'), unionIndicesArrays(getIndicesInaDataResponse('Project', '1001'), getIndicesInaDataResponse('Project', '1002')));
			case sap.apf.testhelper.doubles.SelectionStrategy.oneCompanyCode:
				return getIndicesInaDataResponse('CompanyCode', '1000');
			case sap.apf.testhelper.doubles.SelectionStrategy.twoCompanyCodes:
				return unionIndicesArrays(getIndicesInaDataResponse('CompanyCode', '1000'), getIndicesInaDataResponse('CompanyCode', '2000'));
			case sap.apf.testhelper.doubles.SelectionStrategy.threeCompanyCodes:
				return unionIndicesArrays(getIndicesInaDataResponse('CompanyCode', '1000'), unionIndicesArrays(getIndicesInaDataResponse('CompanyCode', '2000'), getIndicesInaDataResponse('CompanyCode', '3000')));
			case sap.apf.testhelper.doubles.SelectionStrategy.nothing:
				return [];
			case sap.apf.testhelper.doubles.SelectionStrategy.all:
				aIndices = [];
				for(i = 0; i < oParametersOfSetData.dataResponse.length; i++) {
					aIndices.push(i);
				}
				return aIndices;
			case sap.apf.testhelper.doubles.SelectionStrategy.undefinedSelection:
				return undefined;
			case sap.apf.testhelper.doubles.SelectionStrategy.indicesOfSelectedData:
				return this.aIndicesOfSelectedData;
			case sap.apf.testhelper.doubles.SelectionStrategy.allMinus1:
				aIndices = [];
				for(i = 2; i < oParametersOfSetData.dataResponse.length - 7; i++) {
					aIndices.push(i);
				}
				return aIndices;
			case sap.apf.testhelper.doubles.SelectionStrategy.oneCountry:
				return getIndicesInaDataResponse('CustomerCountry', 'UA');
		}
	};
	/**
	 * @description the request can be customized with options like $top, $skip,
	 *              $orderby. If these options are required, then an object with
	 *              these properties is returned. Otherwise an empty object is
	 *              returned.
	 */
	this.getRequestOptions = function() {
		switch (oParametersOfSetData.sRequestOptionStrategy) {
			case sap.apf.testhelper.doubles.RequestOptionStrategy.nothing:
				return {};
			case sap.apf.testhelper.doubles.RequestOptionStrategy.top:
				return {
					paging : {
						top : 10
					}
				};
			case sap.apf.testhelper.doubles.RequestOptionStrategy.topAndSkip:
				return {
					paging : {
						top : 20,
						skip : 10
					}
				};
			case sap.apf.testhelper.doubles.RequestOptionStrategy.skip:
				return {
					paging : {
						skip : 10
					}
				};
			case sap.apf.testhelper.doubles.RequestOptionStrategy.inlineCount:
				return {
					paging : {
						inlineCount : true
					}
				};
			case sap.apf.testhelper.doubles.RequestOptionStrategy.all:
				return {
					paging : {
						top : 20,
						skip : 10,
						inlineCount : true
					}
				};
			case sap.apf.testhelper.doubles.RequestOptionStrategy.orderbyPropertyTwo:
				return {
					orderby : 'PropertyTwo'
				};
			case sap.apf.testhelper.doubles.RequestOptionStrategy.multiOptionsPagingAndOrderbyPropertyOne:
				return {
					paging : {
						top : 20,
						skip : 10
					},
					orderby : 'PropertyOne'
				};
			case sap.apf.testhelper.doubles.RequestOptionStrategy.multiOptionsPagingAndOrderbyPropertyTwo:
				return {
					paging : {
						top : 20,
						skip : 10
					},
					orderby : 'PropertyTwo'
				};
		}
	};
	if (this.type.toLowerCase().search("initial") > -1) {
		_sFilterMethodType = sap.apf.core.constants.filterMethodTypes.startFilter;
	} else {
		_sFilterMethodType = sap.apf.core.constants.filterMethodTypes.selectionAsArray;
	}
	/**
	 * @description returns set filter method type
	 */
	this.getFilterMethodType = function() {
		return _sFilterMethodType;
	};
	/**
	 * @description Transfer selection from source representation to target during switch
	 * @parameter Source representation 
	 */
	this.adoptSelection = function(oSource) {
		if (bAdoptionSucceeds) {
			this.emulateSelectionStrategy(sap.apf.testhelper.doubles.SelectionStrategy.indicesOfSelectedData);
			this.setSelectionAsArray(oSource.getSelectionAsArray());
		}
	};
	/**
	 * @description This method holds the logic to remove all selection from the chart. It also updates the step. 
	 */
	this.removeAllSelection = function() {
		this.aIndicesOfSelectedData = [];
	};
	/**
	 * @description This method returns the selection object for serialization.
	 * @return selectionObject 
	 */
	this.serialize = function() {
		return {
			indicesOfSelectedData : this.getSelectionAsArray(),
			selectionStrategy : oParametersOfSetData.sSelectionStrategy,
			data : oParametersOfSetData.dataResponse
		};
	};
	/**
	 * @description This method uses selection object from serialized data and sets the selection to representation
	 * 
	 */
	this.deserialize = function(oSerializable) {
		this.setData(oSerializable.data);
		this.emulateSelectionStrategy(oSerializable.selectionStrategy);
		this.setSelectionAsArray(oSerializable.indicesOfSelectedData);
		return this;
	};
	/**
	 * @description This method returns the main content of the representation
	 * 
	 */
	this.getMainContent = function() {
		self.title = "";
		self.dataset = oParametersOfSetData.dataResponse;
		self.line = new sap.viz.ui5.Line({
			title : {
				visible : false,
				text : self.title
			},
			xAxis : {
				title : {
					visible : true
				}
			},
			yAxis : {
				title : {
					visible : true
				}
			},
			dataset : self.dataset
		});
		self.line.setWidth("800px");
		self.line.setHeight("800px");
		return self.line;
	};
	/**
	 * @description This method returns the alternate representation
	 * 
	 */
	this.getAlternateRepresentation = function() {
		this.picture = null;
		return this;
	};
	/**
	 * HOOKS for steering the test double from out side instead of user
	 * interaction - not part of chart api so the following methods MUST NOT be
	 * implemented by some charts/representations.
	 */
	/**
	 * @description this function emulates, that the user has done a selection
	 *              on data
	 */
	//	this.emulateUserSelectsData = function() {
	//		bDataHasBeenSelected = true;
	//	};
	/**
	 * @description just for testing. see usage in getSelectionAsArray
	 *              intention: want to get several selections from the double
	 *              depending on the test
	 */
	this.emulateSelectionStrategy = function(sStrategy) {
		oParametersOfSetData.sSelectionStrategy = sStrategy;
	};
	/**
	 * @description just for testing. intention: want to get request options for
	 *              retrieving data depending on the test
	 */
	this.emulateRequestOptionsStrategy = function(sStrategy) {
		oParametersOfSetData.sRequestOptionStrategy = sStrategy;
	};
	/**
	 * @description just for testing. Set filter method type that will be returned during test logic.
	 */
	this.emulateFilterMethodType = function(sFilterMethodType) {
		_sFilterMethodType = sFilterMethodType;
	};
	/**
	 * @description Pretend selection adoption successful
	 */
	this.emulateSelectionAdoptionSuccessful = function() {
		bAdoptionSucceeds = true;
	};
	/**
	 * @description Pretend selection adoption fails
	 */
	this.emulateSelectionAdoptionFailed = function() {
		bAdoptionSucceeds = false;
	};
	/**
	 * @description just for testing - test spy intention: check objects that
	 *              have been set by representation interface method setData()
	 */
	this.getParametersOfSetData = function() {
		return oParametersOfSetData;
	};
	/**
	 * @description get an array of indices (like getSelectionAsArray) where
	 *              array[i][sKey] = expectedValue
	 */
	var getIndicesInaDataResponse = function(sKey, expectedValue) {
		var aReturn = [];
		if (oParametersOfSetData.dataResponse && oParametersOfSetData.dataResponse.length > 0) {
			for( var i = 0; i < oParametersOfSetData.dataResponse.length; i++) {
				if (oParametersOfSetData.dataResponse[i][sKey] === expectedValue) {
					aReturn.push(i);
				}
			}
		}
		return aReturn;
	};
	/**
	 * @description calculate the union of indices in the two arrays
	 */
	var unionIndicesArrays = function(a1, a2) {
		var aReturn = a1;
		// add all from a2 to return array if they aren't already there
		jQuery.each(a2, function(key, value) {
			if (jQuery.inArray(value, a1) === -1) {
				aReturn.push(value);
			}
		});
		return aReturn;
	};
	/**
	 * @description calculate the intersection of indices in the two arrays
	 */
	var cutIndicesArrays = function(a1, a2) {
		var aReturn = [];
		// add all from a2 to return array if they aren't already there
		jQuery.each(a2, function(key, value) {
			if (jQuery.inArray(value, a1) > -1) {
				aReturn.push(value);
			}
		});
		return aReturn;
	};
	/**
	 * simulate the check routine
	 */
	function check(booleExpression, sMessage) {
		var sErrorCode = "5100";
		if (!booleExpression) {
			var oMessageObject = oApi.createMessageObject({
				code : sErrorCode,
				aParameters : [ sMessage ]
			});
			oApi.putMessage(oMessageObject);
		}
	}
};
/**
 * @description get the path to the representation Interface
 */
sap.apf.testhelper.doubles.getPathToRepresentationInterface = function() {
	var nStartApfLocation = "";
	if (document.URL.search('tests') > -1) {
		nStartApfLocation = document.URL.search('tests');
	} else {
		nStartApfLocation = document.URL.search('sap\.apf');
	}
	return document.URL.substring(0, nStartApfLocation).concat('sap/apf/representationInterface.js');
};
// Use representationInterface to set prototype
sap.apf.testhelper.doubles.Representation.prototype = sap.apf.ui.representations.representationInterface();