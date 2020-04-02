(function(oFF) {
	oFF.RsComplexUnit = function() {
	};
	oFF.RsComplexUnit.prototype = new oFF.XObject();
	oFF.RsComplexUnit.create = function(types, values, descriptions, exponents) {
		var complexUnit = new oFF.RsComplexUnit();
		complexUnit.setupExt(types, values, descriptions, exponents);
		return complexUnit;
	};
	oFF.RsComplexUnit.prototype.m_numberOfSubUnits = 0;
	oFF.RsComplexUnit.prototype.m_types = null;
	oFF.RsComplexUnit.prototype.m_values = null;
	oFF.RsComplexUnit.prototype.m_descriptions = null;
	oFF.RsComplexUnit.prototype.m_exponents = null;
	oFF.RsComplexUnit.prototype.setupExt = function(types, values,
			descriptions, exponents) {
		this.m_types = types;
		this.m_values = values;
		this.m_descriptions = descriptions;
		this.m_exponents = exponents;
		if (oFF.notNull(values)) {
			this.m_numberOfSubUnits = values.size();
		}
	};
	oFF.RsComplexUnit.prototype.releaseObject = function() {
		this.m_types = oFF.XObjectExt.release(this.m_types);
		this.m_values = oFF.XObjectExt.release(this.m_values);
		this.m_descriptions = oFF.XObjectExt.release(this.m_descriptions);
		this.m_exponents = oFF.XObjectExt.release(this.m_exponents);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RsComplexUnit.prototype.getUnitTypes = function() {
		return this.m_types;
	};
	oFF.RsComplexUnit.prototype.getUnitValues = function() {
		return this.m_values;
	};
	oFF.RsComplexUnit.prototype.getUnitDescriptions = function() {
		return this.m_descriptions;
	};
	oFF.RsComplexUnit.prototype.getUnitExponents = function() {
		return this.m_exponents;
	};
	oFF.RsComplexUnit.prototype.getNumberOfSubUnits = function() {
		return this.m_numberOfSubUnits;
	};
	oFF.RsRequestDecoratorFactory = function() {
	};
	oFF.RsRequestDecoratorFactory.prototype = new oFF.XObject();
	oFF.RsRequestDecoratorFactory.RESULTSET_REQUEST_DECORATOR_PROVIDER = "RESULTSET_REQUEST_DECORATOR_PROVIDER.IMPLEMENTATION";
	oFF.RsRequestDecoratorFactory.getResultsetRequestDecorator = function(
			application, systemDescription, requestStructure) {
		var sessionSingletons = application.getSession().getSessionSingletons();
		var factoryObject = sessionSingletons
				.getByKey(oFF.RsRequestDecoratorFactory.RESULTSET_REQUEST_DECORATOR_PROVIDER);
		var factory;
		if (oFF.isNull(factoryObject)) {
			factory = new oFF.RsRequestDecoratorFactory();
			factory.initProviders();
			sessionSingletons
					.put(
							oFF.RsRequestDecoratorFactory.RESULTSET_REQUEST_DECORATOR_PROVIDER,
							factory);
		} else {
			factory = factoryObject;
		}
		return factory.getResultsetRequestDecoratorInternal(application,
				systemDescription, requestStructure);
	};
	oFF.RsRequestDecoratorFactory.prototype.m_providers = null;
	oFF.RsRequestDecoratorFactory.prototype.getResultsetRequestDecoratorInternal = function(
			application, systemDescription, requestStructure) {
		var result = null;
		var i;
		var provider;
		var decorator;
		for (i = 0; i < this.m_providers.size(); i++) {
			provider = this.m_providers.get(i);
			decorator = provider.getResultsetRequestDecorator(application,
					systemDescription, requestStructure);
			if (oFF.isNull(decorator)) {
				continue;
			}
			if (oFF.notNull(result)) {
				throw oFF.XException
						.createIllegalStateException("duplicate decorator");
			}
			result = decorator;
		}
		return result;
	};
	oFF.RsRequestDecoratorFactory.prototype.initProviders = function() {
		var registrationService;
		var clazzes;
		var i;
		var clazz;
		var provider;
		if (oFF.notNull(this.m_providers)) {
			return;
		}
		this.m_providers = oFF.XList.create();
		registrationService = oFF.RegistrationService.getInstance();
		if (oFF.notNull(registrationService)) {
			clazzes = registrationService
					.getReferences(oFF.RsRequestDecoratorFactory.RESULTSET_REQUEST_DECORATOR_PROVIDER);
			if (oFF.notNull(clazzes)) {
				for (i = 0; i < clazzes.size(); i++) {
					clazz = clazzes.get(i);
					provider = clazz.newInstance(this);
					this.m_providers.add(provider);
				}
			}
		}
	};
	oFF.RsInputReadinessState = function() {
	};
	oFF.RsInputReadinessState.prototype = new oFF.XObject();
	oFF.RsInputReadinessState.create = function(inputStateIndex, typeList) {
		var types;
		var parameterMap;
		var i;
		var typeStructure;
		var type;
		var parameter;
		var state;
		if (oFF.isNull(typeList)) {
			return null;
		}
		types = oFF.XList.create();
		parameterMap = oFF.XHashMapByString.create();
		for (i = typeList.size() - 1; i >= 0; i--) {
			typeStructure = typeList.getStructureAt(i);
			type = oFF.RsInputReadinessState
					.getTypeFromStructure(typeStructure);
			if (oFF.isNull(type)) {
				continue;
			}
			types.add(type);
			parameter = oFF.RsInputReadinessState
					.getParametersFromStructure(typeStructure);
			if (oFF.notNull(parameter)) {
				parameterMap.put(type.getName(), parameter);
			}
		}
		if (types.isEmpty()) {
			return null;
		}
		state = new oFF.RsInputReadinessState();
		state.m_rsStateIndex = inputStateIndex;
		state.m_types = types;
		state.m_paramterMap = parameterMap;
		return state;
	};
	oFF.RsInputReadinessState.getTypeFromStructure = function(flagStructure) {
		var typeString;
		if (oFF.isNull(flagStructure)) {
			return null;
		}
		typeString = flagStructure.getStringByKeyExt("Flag", null);
		return oFF.InputReadinessType.getOrCreate(typeString);
	};
	oFF.RsInputReadinessState.getParametersFromStructure = function(
			flagStructure) {
		var parameters;
		var parameterList;
		var j;
		var parameter;
		if (oFF.isNull(flagStructure)) {
			return null;
		}
		parameters = oFF.XListOfString.create();
		parameterList = flagStructure.getListByKey("Parameters");
		if (oFF.isNull(parameterList)) {
			return null;
		}
		for (j = 0; j < parameterList.size(); j++) {
			parameter = parameterList.getStringAtExt(j, null);
			if (oFF.XStringUtils.isNullOrEmpty(parameter)) {
				continue;
			}
			parameters.add(parameter);
		}
		if (parameters.isEmpty()) {
			return null;
		}
		return parameters;
	};
	oFF.RsInputReadinessState.prototype.m_rsStateIndex = 0;
	oFF.RsInputReadinessState.prototype.m_types = null;
	oFF.RsInputReadinessState.prototype.m_paramterMap = null;
	oFF.RsInputReadinessState.prototype.getIndex = function() {
		return this.m_rsStateIndex;
	};
	oFF.RsInputReadinessState.prototype.isInputEnabled = function() {
		return this
				.hasSingleInputReadinessType(oFF.InputReadinessType.INPUT_ENABLED);
	};
	oFF.RsInputReadinessState.prototype.hasSingleInputReadinessType = function(
			type) {
		return this.m_types.size() === 1 && this.hasInputReadinessType(type);
	};
	oFF.RsInputReadinessState.prototype.hasInputReadinessType = function(type) {
		return this.m_types.contains(type);
	};
	oFF.RsInputReadinessState.prototype.getInputReadinessTypes = function() {
		return this.m_types;
	};
	oFF.RsInputReadinessState.prototype.getParameterByType = function(type) {
		return this.m_paramterMap.getByKey(type.getName());
	};
	oFF.RsDataCellEntry = function() {
	};
	oFF.RsDataCellEntry.prototype = new oFF.XObject();
	oFF.RsDataCellEntry.create = function(name) {
		var value = new oFF.RsDataCellEntry();
		value.m_name = name;
		return value;
	};
	oFF.RsDataCellEntry.prototype.m_name = null;
	oFF.RsDataCellEntry.prototype.m_disaggregationMode = null;
	oFF.RsDataCellEntry.prototype.m_disaggregationCellRefName = null;
	oFF.RsDataCellEntry.prototype.releaseObject = function() {
		this.m_name = null;
		this.m_disaggregationMode = null;
		this.m_disaggregationCellRefName = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RsDataCellEntry.prototype.getName = function() {
		return this.m_name;
	};
	oFF.RsDataCellEntry.prototype.setDisaggregationMode = function(
			disaggregationMode) {
		this.m_disaggregationMode = disaggregationMode;
	};
	oFF.RsDataCellEntry.prototype.getDisaggregationMode = function() {
		return this.m_disaggregationMode;
	};
	oFF.RsDataCellEntry.prototype.setDisaggregationRefCellName = function(
			disaggregationRefCellName) {
		this.m_disaggregationCellRefName = disaggregationRefCellName;
	};
	oFF.RsDataCellEntry.prototype.getDisaggregationRefCellName = function() {
		return this.m_disaggregationCellRefName;
	};
	oFF.RsNewLine = function() {
	};
	oFF.RsNewLine.prototype = new oFF.XObject();
	oFF.RsNewLine.create = function(newLineCollection, newLineId, templateTuple) {
		var newLine = new oFF.RsNewLine();
		newLine.setupExt(newLineCollection, newLineId, templateTuple);
		return newLine;
	};
	oFF.RsNewLine.prototype.m_newLineId = 0;
	oFF.RsNewLine.prototype.m_dimensionMembers = null;
	oFF.RsNewLine.prototype.m_dataEntryMap = null;
	oFF.RsNewLine.prototype.m_newLineCollection = null;
	oFF.RsNewLine.prototype.setupExt = function(newLineCollection, newLineId,
			templateTuple) {
		var dimensions;
		var k;
		this.m_newLineCollection = oFF.XWeakReferenceUtil
				.getWeakRef(newLineCollection);
		this.m_dataEntryMap = oFF.XHashMapByString.create();
		this.m_newLineId = newLineId;
		this.m_dimensionMembers = oFF.XListWeakRef.create();
		dimensions = newLineCollection.getRowsAxis().getDimensions();
		for (k = 0; k < dimensions.size(); k++) {
			if (oFF.isNull(templateTuple)) {
				this.m_dimensionMembers.add(dimensions.get(k)
						.newDimensionMemberEmpty());
			} else {
				this.m_dimensionMembers.add(templateTuple.get(k)
						.getDimensionMember());
			}
		}
	};
	oFF.RsNewLine.prototype.releaseObject = function() {
		this.m_dimensionMembers = oFF.XObjectExt
				.release(this.m_dimensionMembers);
		this.m_dataEntryMap = oFF.XObjectExt.release(this.m_dataEntryMap);
		this.m_newLineCollection = oFF.XObjectExt
				.release(this.m_newLineCollection);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RsNewLine.prototype.getNewLineCollection = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_newLineCollection);
	};
	oFF.RsNewLine.prototype.getDimensionCount = function() {
		return this.getNewLineCollection().getRowsAxis().getDimensions().size();
	};
	oFF.RsNewLine.prototype.getDimensionAt = function(index) {
		if (index < 0 || index >= this.getDimensionCount()) {
			return null;
		}
		return this.getNewLineCollection().getRowsAxis().getDimensions().get(
				index);
	};
	oFF.RsNewLine.prototype.setDimensionMember = function(dimensionMember) {
		var dimensionIndex = this.getNewLineCollection().getRowsAxis()
				.getDimensions().getIndex(dimensionMember.getDimension());
		if (dimensionIndex >= 0) {
			this.m_dimensionMembers.set(dimensionIndex, dimensionMember);
			return true;
		}
		return false;
	};
	oFF.RsNewLine.prototype.isValid = function() {
		var k;
		var dimensionMember;
		var keyFieldValue;
		for (k = 0; k < this.m_dimensionMembers.size(); k++) {
			dimensionMember = this.m_dimensionMembers.get(k);
			if (oFF.isNull(dimensionMember)) {
				return false;
			}
			keyFieldValue = dimensionMember.getKeyFieldValue();
			if (oFF.isNull(keyFieldValue)) {
				return false;
			}
		}
		return true;
	};
	oFF.RsNewLine.prototype.getInputEnabledQueryDataCells = function() {
		var collection = this.getNewLineCollection();
		var rowsAxis = collection.getRowsAxis();
		var queryModel = rowsAxis.getQueryModel();
		var qDataCells = queryModel.getQueryDataCells();
		var resultSetContainer = collection.getResultSetContainer();
		var resultSet = resultSetContainer.getClassicResultSet();
		var dataEntryMask = resultSet.getDataEntryMask();
		var inputEnabledQueryDataCellList = oFF.XListOfNameObject.create();
		var k;
		var dataCell;
		var n;
		var dataEntryName;
		for (k = 0; k < qDataCells.size(); k++) {
			dataCell = qDataCells.get(k);
			for (n = 0; n < dataEntryMask.size(); n++) {
				dataEntryName = dataEntryMask.get(n);
				if (oFF.XString.isEqual(dataEntryName, dataCell.getName())) {
					inputEnabledQueryDataCellList.add(dataCell);
					dataEntryMask.removeElement(dataEntryName);
					break;
				}
			}
		}
		return inputEnabledQueryDataCellList;
	};
	oFF.RsNewLine.prototype.getDataEntry = function(dataCell) {
		var dataCells = this.getInputEnabledQueryDataCells();
		var newLineEntry;
		if (!dataCells.contains(dataCell)) {
			return null;
		}
		if (!this.m_dataEntryMap.containsKey(dataCell.getName())) {
			newLineEntry = oFF.RsNewLineEntry.create(this, dataCell);
			this.m_dataEntryMap.put(dataCell.getName(), newLineEntry);
		}
		return this.m_dataEntryMap.getByKey(dataCell.getName());
	};
	oFF.RsNewLine.prototype.getDimensionMembers = function() {
		return this.m_dimensionMembers;
	};
	oFF.RsNewLine.prototype.getLineId = function() {
		return this.m_newLineId;
	};
	oFF.RsNewLine.prototype.getNewLineEntries = function() {
		return this.m_dataEntryMap.getValuesAsReadOnlyList();
	};
	oFF.RsNewLine.prototype.clear = function() {
		this.m_dimensionMembers = oFF.XObjectExt
				.release(this.m_dimensionMembers);
		this.m_dataEntryMap = oFF.XObjectExt.release(this.m_dataEntryMap);
	};
	oFF.RsNewLineCollection = function() {
	};
	oFF.RsNewLineCollection.prototype = new oFF.XObject();
	oFF.RsNewLineCollection.m_newLineIdCounter = 4710;
	oFF.RsNewLineCollection.create = function(queryManager, rowsAxis) {
		var newLineCollection = new oFF.RsNewLineCollection();
		newLineCollection.setupExt(queryManager, rowsAxis);
		return newLineCollection;
	};
	oFF.RsNewLineCollection.prototype.m_newLines = null;
	oFF.RsNewLineCollection.prototype.m_rowsAxis = null;
	oFF.RsNewLineCollection.prototype.m_queryManager = null;
	oFF.RsNewLineCollection.prototype.setupExt = function(queryManager,
			rowsAxis) {
		this.m_rowsAxis = oFF.XWeakReferenceUtil.getWeakRef(rowsAxis);
		this.m_queryManager = oFF.XWeakReferenceUtil.getWeakRef(queryManager);
	};
	oFF.RsNewLineCollection.prototype.releaseObject = function() {
		this.m_newLines = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_newLines);
		this.m_rowsAxis = oFF.XObjectExt.release(this.m_rowsAxis);
		this.m_queryManager = oFF.XObjectExt.release(this.m_queryManager);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RsNewLineCollection.prototype.getResultSetContainer = function() {
		var queryManager = oFF.XWeakReferenceUtil
				.getHardRef(this.m_queryManager);
		return queryManager.getActiveResultSetContainer();
	};
	oFF.RsNewLineCollection.prototype.getRowsAxis = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_rowsAxis);
	};
	oFF.RsNewLineCollection.prototype.createNewLine = function(templateTuple) {
		var newLine;
		oFF.RsNewLineCollection.m_newLineIdCounter++;
		if (oFF.isNull(this.m_newLines)) {
			this.m_newLines = oFF.XList.create();
		}
		newLine = oFF.RsNewLine.create(this,
				oFF.RsNewLineCollection.m_newLineIdCounter, templateTuple);
		this.m_newLines.add(newLine);
		return newLine;
	};
	oFF.RsNewLineCollection.prototype.getNewLines = function() {
		return this.m_newLines;
	};
	oFF.RsNewLineCollection.prototype.hasNewLines = function() {
		return oFF.notNull(this.m_newLines);
	};
	oFF.RsNewLineCollection.prototype.getValidNewLines = function() {
		var validNewLines;
		var k;
		var validNewLine;
		if (!this.hasValidNewLines()) {
			return null;
		}
		validNewLines = oFF.XList.create();
		for (k = 0; k < this.m_newLines.size(); k++) {
			validNewLine = this.m_newLines.get(k);
			if (validNewLine.isValid()) {
				validNewLines.add(validNewLine);
			}
		}
		return validNewLines;
	};
	oFF.RsNewLineCollection.prototype.hasValidNewLines = function() {
		var k;
		if (oFF.isNull(this.m_newLines)) {
			return false;
		}
		for (k = 0; k < this.m_newLines.size(); k++) {
			if (this.m_newLines.get(k).isValid()) {
				return true;
			}
		}
		return false;
	};
	oFF.RsNewLineCollection.prototype.clear = function() {
		var k;
		if (oFF.isNull(this.m_newLines)) {
			return;
		}
		for (k = 0; k < this.m_newLines.size(); k++) {
			this.m_newLines.get(k).clear();
		}
		oFF.XCollectionUtils.releaseEntriesFromCollection(this.m_newLines);
		this.m_newLines.clear();
	};
	oFF.RsNewLineCollection.prototype.retainAll = function(collection) {
		var changed = false;
		var k;
		var newLine;
		for (k = 0; k < this.m_newLines.size(); k++) {
			newLine = this.m_newLines.get(k);
			if (!collection.contains(newLine)) {
				newLine.clear();
				this.m_newLines.removeElement(newLine);
				changed = true;
			}
		}
		return changed;
	};
	oFF.RsNewLineCollection.prototype.isEmpty = function() {
		if (oFF.isNull(this.m_newLines)) {
			return true;
		}
		return this.m_newLines.isEmpty();
	};
	oFF.RsNewLineCollection.prototype.remove = function(element) {
		var changed;
		if (oFF.isNull(this.m_newLines)) {
			return false;
		}
		changed = false;
		if (this.m_newLines.contains(element)) {
			element.clear();
			this.m_newLines.removeElement(element);
			changed = true;
		}
		return changed;
	};
	oFF.RsNewLineCollection.prototype.size = function() {
		if (oFF.isNull(this.m_newLines)) {
			return 0;
		}
		return this.m_newLines.size();
	};
	oFF.RsNewLineEntry = function() {
	};
	oFF.RsNewLineEntry.prototype = new oFF.XObject();
	oFF.RsNewLineEntry.create = function(newLine, qDataCell) {
		var newLineEntry = new oFF.RsNewLineEntry();
		newLineEntry.setupExt(newLine, qDataCell);
		return newLineEntry;
	};
	oFF.RsNewLineEntry.prototype.m_queryDataCell = null;
	oFF.RsNewLineEntry.prototype.m_newLine = null;
	oFF.RsNewLineEntry.prototype.m_xvalue = null;
	oFF.RsNewLineEntry.prototype.setupExt = function(newLine, qDataCell) {
		this.m_queryDataCell = oFF.XWeakReferenceUtil.getWeakRef(qDataCell);
		this.m_newLine = oFF.XWeakReferenceUtil.getWeakRef(newLine);
	};
	oFF.RsNewLineEntry.prototype.releaseObject = function() {
		this.m_queryDataCell = oFF.XObjectExt.release(this.m_queryDataCell);
		this.m_newLine = oFF.XObjectExt.release(this.m_newLine);
		this.m_xvalue = oFF.XObjectExt.release(this.m_xvalue);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RsNewLineEntry.prototype.getNewLine = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_newLine);
	};
	oFF.RsNewLineEntry.prototype.getQueryDataCell = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_queryDataCell);
	};
	oFF.RsNewLineEntry.prototype.setNewValue = function(value) {
		this.m_xvalue = oFF.XDoubleValue.create(value);
	};
	oFF.RsNewLineEntry.prototype.setNewValueExternal = function(valueExternal) {
		this.m_xvalue = oFF.XStringValue.create(valueExternal);
	};
	oFF.RsNewLineEntry.prototype.getNewXValue = function() {
		return this.m_xvalue;
	};
	oFF.RsNewLineEntry.prototype.isValueChanged = function() {
		return oFF.notNull(this.m_xvalue);
	};
	oFF.RsNewLineEntry.prototype.resetNewValue = function() {
		this.m_xvalue = null;
	};
	oFF.RsCursorCurrencyUnit = function() {
	};
	oFF.RsCursorCurrencyUnit.prototype = new oFF.XObject();
	oFF.RsCursorCurrencyUnit.createCurrencyUnit = function() {
		return new oFF.RsCursorCurrencyUnit();
	};
	oFF.RsCursorCurrencyUnit.createCopy = function(origin) {
		var newObject = new oFF.RsCursorCurrencyUnit();
		if (oFF.notNull(origin)) {
			if (origin.hasFormatted()) {
				newObject.setFormatted(origin.getFormatted());
			}
			if (origin.hasPrefix()) {
				newObject.setPrefix(origin.getPrefix());
			}
			if (origin.hasSuffix()) {
				newObject.setSuffix(origin.getSuffix());
			}
			newObject.m_isEmpty = origin.isEmpty();
			newObject.m_hasCurrency = origin.hasCurrency();
			newObject.m_hasUnit = origin.hasUnit();
			newObject.m_isMixed = origin.isMixed();
		}
		return newObject;
	};
	oFF.RsCursorCurrencyUnit.prototype.m_formattedCurrencyUnit = null;
	oFF.RsCursorCurrencyUnit.prototype.m_prefix = null;
	oFF.RsCursorCurrencyUnit.prototype.m_suffix = null;
	oFF.RsCursorCurrencyUnit.prototype.m_isEmpty = false;
	oFF.RsCursorCurrencyUnit.prototype.m_hasCurrency = false;
	oFF.RsCursorCurrencyUnit.prototype.m_hasUnit = false;
	oFF.RsCursorCurrencyUnit.prototype.m_isMixed = false;
	oFF.RsCursorCurrencyUnit.prototype.releaseObject = function() {
		this.m_formattedCurrencyUnit = null;
		this.m_prefix = null;
		this.m_suffix = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RsCursorCurrencyUnit.prototype.reset = function() {
		this.m_hasCurrency = false;
		this.m_hasUnit = false;
		this.m_isMixed = false;
		this.m_isEmpty = false;
		this.m_formattedCurrencyUnit = null;
		this.m_prefix = null;
		this.m_suffix = null;
	};
	oFF.RsCursorCurrencyUnit.prototype.hasFormatted = function() {
		return oFF.notNull(this.m_formattedCurrencyUnit);
	};
	oFF.RsCursorCurrencyUnit.prototype.getFormatted = function() {
		return this.m_formattedCurrencyUnit;
	};
	oFF.RsCursorCurrencyUnit.prototype.setFormatted = function(
			formattedCurrencyUnit) {
		this.m_formattedCurrencyUnit = formattedCurrencyUnit;
	};
	oFF.RsCursorCurrencyUnit.prototype.hasPrefix = function() {
		return oFF.notNull(this.m_prefix);
	};
	oFF.RsCursorCurrencyUnit.prototype.setPrefix = function(prefix) {
		this.m_prefix = prefix;
	};
	oFF.RsCursorCurrencyUnit.prototype.getPrefix = function() {
		return this.m_prefix;
	};
	oFF.RsCursorCurrencyUnit.prototype.hasSuffix = function() {
		return oFF.notNull(this.m_suffix);
	};
	oFF.RsCursorCurrencyUnit.prototype.setSuffix = function(suffix) {
		this.m_suffix = suffix;
	};
	oFF.RsCursorCurrencyUnit.prototype.getSuffix = function() {
		return this.m_suffix;
	};
	oFF.RsCursorCurrencyUnit.prototype.isEmpty = function() {
		return this.m_isEmpty;
	};
	oFF.RsCursorCurrencyUnit.prototype.setIsEmpty = function(isEmpty) {
		this.m_isEmpty = isEmpty;
	};
	oFF.RsCursorCurrencyUnit.prototype.hasCurrency = function() {
		return this.m_hasCurrency;
	};
	oFF.RsCursorCurrencyUnit.prototype.setHasCurrency = function(hasCurrency) {
		this.m_hasCurrency = hasCurrency;
	};
	oFF.RsCursorCurrencyUnit.prototype.hasUnit = function() {
		return this.m_hasUnit;
	};
	oFF.RsCursorCurrencyUnit.prototype.setHasUnit = function(hasUnit) {
		this.m_hasUnit = hasUnit;
	};
	oFF.RsCursorCurrencyUnit.prototype.setIsMixed = function(isMixed) {
		this.m_isMixed = isMixed;
	};
	oFF.RsCursorCurrencyUnit.prototype.isMixed = function() {
		return this.m_isMixed;
	};
	oFF.RsDefAxis = function() {
	};
	oFF.RsDefAxis.prototype = new oFF.XObject();
	oFF.RsDefAxis.create = function(axisType, rsQueryModel) {
		var object = new oFF.RsDefAxis();
		object.setupExt(axisType, rsQueryModel);
		return object;
	};
	oFF.RsDefAxis.prototype.m_axisType = null;
	oFF.RsDefAxis.prototype.m_rsDimensions = null;
	oFF.RsDefAxis.prototype.m_rsQueryModel = null;
	oFF.RsDefAxis.prototype.setupExt = function(axisType, rsQueryModel) {
		this.m_axisType = axisType;
		this.m_rsDimensions = oFF.XList.create();
		this.m_rsQueryModel = rsQueryModel;
	};
	oFF.RsDefAxis.prototype.releaseObject = function() {
		this.m_rsDimensions = oFF.XObjectExt.release(this.m_rsDimensions);
		this.m_rsQueryModel = null;
		this.m_axisType = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RsDefAxis.prototype.addAllDimensions = function(axis) {
		var size = axis.getDimensionCount();
		var i;
		for (i = 0; i < size; i++) {
			this.addDimension(axis.get(i));
		}
	};
	oFF.RsDefAxis.prototype.clearDimensions = function() {
		this.m_rsDimensions.clear();
	};
	oFF.RsDefAxis.prototype.newRsDimension = function(dimension) {
		return oFF.RsDefDimension.create(dimension, this);
	};
	oFF.RsDefAxis.prototype.addDimension = function(dimension) {
		this.m_rsDimensions.add(this.newRsDimension(dimension));
	};
	oFF.RsDefAxis.prototype.getType = function() {
		return this.m_axisType;
	};
	oFF.RsDefAxis.prototype.getRsDimensions = function() {
		return this.m_rsDimensions;
	};
	oFF.RsDefAxis.prototype.getEffectiveRsFields = function() {
		var effectiveFields = oFF.XList.create();
		var size = this.m_rsDimensions.size();
		var i;
		for (i = 0; i < size; i++) {
			effectiveFields.addAll(this.m_rsDimensions.get(i)
					.getResultSetFields());
		}
		return effectiveFields;
	};
	oFF.RsDefAxis.prototype.getConvenienceCommands = function() {
		return this.m_rsQueryModel.getConvenienceCommands();
	};
	oFF.RsDefQueryModel = function() {
	};
	oFF.RsDefQueryModel.prototype = new oFF.XObject();
	oFF.RsDefQueryModel.create = function(queryManager, dimension) {
		var object = new oFF.RsDefQueryModel();
		object.setupExt(queryManager, dimension);
		return object;
	};
	oFF.RsDefQueryModel.prototype.m_rows = null;
	oFF.RsDefQueryModel.prototype.m_cols = null;
	oFF.RsDefQueryModel.prototype.m_queryManager = null;
	oFF.RsDefQueryModel.prototype.setupExt = function(queryManager, dimension) {
		var queryModel;
		this.m_rows = oFF.RsDefAxis.create(oFF.AxisType.ROWS, this);
		this.m_cols = oFF.RsDefAxis.create(oFF.AxisType.COLUMNS, this);
		this.m_queryManager = oFF.XWeakReferenceUtil.getWeakRef(queryManager);
		queryModel = queryManager.getQueryModel();
		if (oFF.notNull(dimension)) {
			this.m_rows.addDimension(dimension);
		} else {
			if (oFF.notNull(queryModel)) {
				this.m_rows.addAllDimensions(queryModel.getRowsAxis());
				this.m_cols.addAllDimensions(queryModel.getColumnsAxis());
			}
		}
	};
	oFF.RsDefQueryModel.prototype.releaseObject = function() {
		this.m_cols = oFF.XObjectExt.release(this.m_cols);
		this.m_rows = oFF.XObjectExt.release(this.m_rows);
		this.m_queryManager = oFF.XObjectExt.release(this.m_queryManager);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RsDefQueryModel.prototype.getRowsAxisDef = function() {
		return this.m_rows;
	};
	oFF.RsDefQueryModel.prototype.getColumnsAxisDef = function() {
		return this.m_cols;
	};
	oFF.RsDefQueryModel.prototype.getAxisDef = function(axis) {
		if (axis === oFF.AxisType.ROWS) {
			return this.m_rows;
		}
		return this.m_cols;
	};
	oFF.RsDefQueryModel.prototype.getQueryManager = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_queryManager);
	};
	oFF.RsDefQueryModel.prototype.getConvenienceCommands = function() {
		return this.getQueryManager().getConvenienceCommands();
	};
	oFF.RsDataEntryCollection = function() {
	};
	oFF.RsDataEntryCollection.prototype = new oFF.XObject();
	oFF.RsDataEntryCollection.create = function(resultSetContainer) {
		var entryCollection = new oFF.RsDataEntryCollection();
		entryCollection.m_rsContainer = oFF.XWeakReference
				.create(resultSetContainer);
		entryCollection.m_entries = oFF.XHashMapByString.create();
		entryCollection.m_cellEntries = oFF.XHashMapByString.create();
		entryCollection.m_entriesViaMember = oFF.XList.create();
		return entryCollection;
	};
	oFF.RsDataEntryCollection.prototype.m_rsContainer = null;
	oFF.RsDataEntryCollection.prototype.m_entries = null;
	oFF.RsDataEntryCollection.prototype.m_cellEntries = null;
	oFF.RsDataEntryCollection.prototype.m_entriesViaMember = null;
	oFF.RsDataEntryCollection.prototype.m_dataEntryDescription = null;
	oFF.RsDataEntryCollection.prototype.releaseObject = function() {
		this.m_rsContainer = oFF.XObjectExt.release(this.m_rsContainer);
		this.m_entries = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_entries);
		this.m_cellEntries = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_cellEntries);
		this.m_entriesViaMember = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_entriesViaMember);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RsDataEntryCollection.prototype.getDataEntriesByProcessingOrder = function() {
		var result = oFF.XHashMapByString.create();
		var keys = oFF.XCollectionUtils.sortListAsIntegers(this.m_entries
				.getKeysAsReadOnlyListOfString(), oFF.XSortDirection.ASCENDING);
		var i;
		var entry;
		var processingOrder;
		var entriesByOrder;
		for (i = 0; i < keys.size(); i++) {
			entry = this.m_entries.getByKey(keys.get(i));
			if (!entry.isNewValueForced() && !entry.isValueChanged()
					&& !entry.isValueLockChanged() && !entry.isValueLocked()
					&& entry.getPlanningCommand() === null) {
				continue;
			}
			processingOrder = oFF.XInteger.convertToString(entry
					.getProcessingOrder());
			entriesByOrder = result.getByKey(processingOrder);
			if (oFF.isNull(entriesByOrder)) {
				entriesByOrder = oFF.XList.create();
				result.put(processingOrder, entriesByOrder);
			}
			entriesByOrder.add(entry);
		}
		return result;
	};
	oFF.RsDataEntryCollection.prototype.getChangedDataEntries = function() {
		var result = oFF.XList.create();
		var entries = this.getDataEntriesByProcessingOrder();
		var orders;
		var i;
		var entriesByOrder;
		if (entries.isEmpty()) {
			return result;
		}
		orders = oFF.XListOfString.createFromReadOnlyList(entries
				.getKeysAsReadOnlyListOfString());
		orders.sortByDirection(oFF.XSortDirection.ASCENDING);
		for (i = 0; i < orders.size(); i++) {
			entriesByOrder = entries.getByKey(orders.get(i));
			result.addAll(entriesByOrder);
		}
		return result;
	};
	oFF.RsDataEntryCollection.prototype.getDataEntry = function(columnIndex,
			rowIndex, dataCell) {
		return this.getDataEntryInternal(columnIndex, rowIndex, dataCell, true);
	};
	oFF.RsDataEntryCollection.prototype.getDataEntryIfExisting = function(
			columnIndex, rowIndex, dataCell) {
		return this
				.getDataEntryInternal(columnIndex, rowIndex, dataCell, false);
	};
	oFF.RsDataEntryCollection.prototype.getDataEntryInternal = function(
			columnIndex, rowIndex, dataCell, createNew) {
		var container;
		var resultSet;
		var index;
		var entry;
		if (oFF.isNull(dataCell)) {
			return null;
		}
		container = oFF.XWeakReferenceUtil.getHardRef(this.m_rsContainer);
		resultSet = container.getCursorResultSet();
		index = oFF.XInteger.convertToString(columnIndex
				* resultSet.getDataRows() + rowIndex);
		entry = this.m_entries.getByKey(index);
		if (oFF.isNull(entry) && createNew) {
			entry = oFF.RsDataEntry.create(this, columnIndex, rowIndex,
					dataCell);
			this.m_entries.put(index, entry);
		}
		return entry;
	};
	oFF.RsDataEntryCollection.prototype.hasChangedValues = function() {
		var allEntries = this.getAllEntries();
		var i;
		var entry;
		for (i = 0; i < allEntries.size(); i++) {
			entry = allEntries.get(i);
			if (entry.isValueChanged() || entry.isNewValueForced()) {
				return true;
			}
		}
		return false;
	};
	oFF.RsDataEntryCollection.prototype.hasChangedValueLocks = function() {
		var allEntries = this.getAllEntries();
		var i;
		var entry;
		for (i = 0; i < allEntries.size(); i++) {
			entry = allEntries.get(i);
			if (entry.isValueLockChanged() || entry.isValueLocked()) {
				return true;
			}
		}
		return false;
	};
	oFF.RsDataEntryCollection.prototype.hasPlanningCommands = function() {
		var allEntries = this.getAllEntries();
		var i;
		for (i = 0; i < allEntries.size(); i++) {
			if (allEntries.get(i).getPlanningCommand() !== null) {
				return true;
			}
		}
		return false;
	};
	oFF.RsDataEntryCollection.prototype.hasChangedDataEntries = function() {
		var allEntries = this.getAllEntries();
		var i;
		var entry;
		for (i = 0; i < allEntries.size(); i++) {
			entry = allEntries.get(i);
			if (entry.isValueChanged() || entry.isNewValueForced()
					|| entry.isValueLockChanged() || entry.isValueLocked()
					|| entry.getPlanningCommand() !== null) {
				return true;
			}
		}
		return false;
	};
	oFF.RsDataEntryCollection.prototype.getAllEntries = function() {
		var all = oFF.XList.create();
		var iterator = this.m_entries.getIterator();
		var i;
		while (iterator.hasNext()) {
			all.add(iterator.next());
		}
		for (i = 0; i < this.m_entriesViaMember.size(); i++) {
			all.add(this.m_entriesViaMember.get(i));
		}
		return all;
	};
	oFF.RsDataEntryCollection.prototype.clear = function() {
		this.m_entries.clear();
		this.m_cellEntries.clear();
		this.m_entriesViaMember.clear();
	};
	oFF.RsDataEntryCollection.prototype.getDataCellEntry = function(name) {
		var cellEntry;
		if (oFF.XStringUtils.isNullOrEmpty(name)) {
			return null;
		}
		cellEntry = this.m_cellEntries.getByKey(name);
		if (oFF.isNull(cellEntry)) {
			cellEntry = oFF.RsDataCellEntry.create(name);
			this.m_cellEntries.put(name, cellEntry);
		}
		return cellEntry;
	};
	oFF.RsDataEntryCollection.prototype.getDataCellEntryIfExisting = function(
			name) {
		if (oFF.XStringUtils.isNullOrEmpty(name)) {
			return null;
		}
		return this.m_cellEntries.getByKey(name);
	};
	oFF.RsDataEntryCollection.prototype.setDataCellEntryDescription = function(
			description) {
		this.m_dataEntryDescription = description;
	};
	oFF.RsDataEntryCollection.prototype.getDataCellEntryDescription = function() {
		return this.m_dataEntryDescription;
	};
	oFF.RsDataEntryCollection.prototype.getDataEntriesViaMember = function() {
		return this.m_entriesViaMember;
	};
	oFF.RsDataEntryCollection.prototype.getNewDataEntryViaMember = function() {
		var entry = oFF.RsDataEntryViaMember.create(this);
		this.m_entriesViaMember.add(entry);
		return entry;
	};
	oFF.AbstractRsDataEntry = function() {
	};
	oFF.AbstractRsDataEntry.prototype = new oFF.XObject();
	oFF.AbstractRsDataEntry.prototype.m_collection = null;
	oFF.AbstractRsDataEntry.prototype.m_originXValue = null;
	oFF.AbstractRsDataEntry.prototype.m_xvalue = null;
	oFF.AbstractRsDataEntry.prototype.m_originalLock = false;
	oFF.AbstractRsDataEntry.prototype.m_lockSet = false;
	oFF.AbstractRsDataEntry.prototype.m_lock = false;
	oFF.AbstractRsDataEntry.prototype.m_forceNewValue = false;
	oFF.AbstractRsDataEntry.prototype.m_processingOrder = 0;
	oFF.AbstractRsDataEntry.prototype.m_priority = 0;
	oFF.AbstractRsDataEntry.prototype.m_processingType = null;
	oFF.AbstractRsDataEntry.prototype.m_planningCommand = null;
	oFF.AbstractRsDataEntry.prototype.setupEntry = function(collection) {
		this.m_collection = oFF.XWeakReferenceUtil.getWeakRef(collection);
	};
	oFF.AbstractRsDataEntry.prototype.getCollection = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_collection);
	};
	oFF.AbstractRsDataEntry.prototype.assertType = function(valueType) {
		if (this.m_xvalue.getValueType() !== valueType) {
			oFF.noSupport();
		}
	};
	oFF.AbstractRsDataEntry.prototype.setDouble = function(value) {
		this.m_xvalue = oFF.XDoubleValue.create(value);
	};
	oFF.AbstractRsDataEntry.prototype.getDouble = function() {
		this.assertType(oFF.XValueType.DOUBLE);
		return this.m_xvalue.getDouble();
	};
	oFF.AbstractRsDataEntry.prototype.setString = function(value) {
		this.m_xvalue = oFF.XStringValue.create(value);
	};
	oFF.AbstractRsDataEntry.prototype.getString = function() {
		this.assertType(oFF.XValueType.STRING);
		return this.m_xvalue.getString();
	};
	oFF.AbstractRsDataEntry.prototype.isValueChanged = function() {
		if (oFF.isNull(this.m_originXValue)) {
			return true;
		}
		return !this.m_originXValue.isEqualTo(this.m_xvalue);
	};
	oFF.AbstractRsDataEntry.prototype.resetNewValue = function() {
		this.m_xvalue.resetValue(this.m_originXValue);
	};
	oFF.AbstractRsDataEntry.prototype.setValueLock = function(lock) {
		if (lock === this.m_originalLock) {
			this.resetValueLock();
		} else {
			this.m_lock = lock;
			this.m_lockSet = true;
		}
	};
	oFF.AbstractRsDataEntry.prototype.isValueLocked = function() {
		return this.m_lock;
	};
	oFF.AbstractRsDataEntry.prototype.isValueLockChanged = function() {
		return this.m_lockSet;
	};
	oFF.AbstractRsDataEntry.prototype.resetValueLock = function() {
		this.m_lock = this.m_originalLock;
		this.m_lockSet = false;
	};
	oFF.AbstractRsDataEntry.prototype.forceNewValue = function(forceNewValue) {
		this.m_forceNewValue = forceNewValue;
	};
	oFF.AbstractRsDataEntry.prototype.isNewValueForced = function() {
		return this.m_forceNewValue;
	};
	oFF.AbstractRsDataEntry.prototype.getProcessingOrder = function() {
		return this.m_processingOrder;
	};
	oFF.AbstractRsDataEntry.prototype.setProcessingOrder = function(
			processingOrder) {
		if (processingOrder < 0) {
			throw oFF.XException
					.createIllegalArgumentException("processing order must not be negative");
		}
		this.m_processingOrder = processingOrder;
	};
	oFF.AbstractRsDataEntry.prototype.getPriority = function() {
		return this.m_priority;
	};
	oFF.AbstractRsDataEntry.prototype.setPriority = function(priority) {
		this.m_priority = priority;
	};
	oFF.AbstractRsDataEntry.prototype.getProcessingType = function() {
		return this.m_processingType;
	};
	oFF.AbstractRsDataEntry.prototype.setProcessingType = function(
			dataEntryProcessingType) {
		this.m_processingType = dataEntryProcessingType;
	};
	oFF.AbstractRsDataEntry.prototype.getPlanningCommand = function() {
		return this.m_planningCommand;
	};
	oFF.AbstractRsDataEntry.prototype.setPlanningCommand = function(
			planningCommand) {
		this.m_planningCommand = planningCommand;
	};
	oFF.AbstractRsDataEntry.prototype.setDate = function(value) {
		this.m_xvalue = value;
	};
	oFF.AbstractRsDataEntry.prototype.getDate = function() {
		this.assertType(oFF.XValueType.DATE);
		return this.m_xvalue;
	};
	oFF.AbstractRsDataEntry.prototype.setDateTime = function(value) {
		this.m_xvalue = value;
	};
	oFF.AbstractRsDataEntry.prototype.getDateTime = function() {
		this.assertType(oFF.XValueType.DATE_TIME);
		return this.m_xvalue;
	};
	oFF.AbstractRsDataEntry.prototype.setNewValueExternal = function(
			valueExternal) {
		if (this.m_xvalue.getValueType() === oFF.XValueType.STRING) {
			this.m_xvalue.setString(valueExternal);
		} else {
			this.m_xvalue = oFF.XStringValue.create(valueExternal);
		}
	};
	oFF.AbstractRsDataEntry.prototype.getNewValueExternal = function() {
		var newXString;
		this.assertType(oFF.XValueType.STRING);
		newXString = this.m_xvalue;
		return newXString.getString();
	};
	oFF.AbstractRsDataEntry.prototype.setXValue = function(value) {
		this.m_xvalue = value;
	};
	oFF.AbstractRsDataEntry.prototype.getXValue = function() {
		return this.m_xvalue;
	};
	oFF.AbstractRsDataEntry.prototype.resetAllChanges = function() {
		this.resetNewValue();
		this.resetValueLock();
		this.setPlanningCommand(null);
		this.setProcessingOrder(0);
		this.setPriority(0);
	};
	oFF.AbstractRsDataEntry.prototype.setDataCellEntryDescription = function(
			description) {
		this.getCollection().setDataCellEntryDescription(description);
	};
	oFF.AbstractRsDataEntry.prototype.getDataCellEntryDescription = function() {
		return this.getCollection().getDataCellEntryDescription();
	};
	oFF.AbstractRsDataEntry.prototype.releaseObject = function() {
		this.m_xvalue = oFF.XObjectExt.release(this.m_xvalue);
		this.m_originXValue = oFF.XObjectExt.release(this.m_originXValue);
		this.m_planningCommand = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RsAxisTuple = function() {
	};
	oFF.RsAxisTuple.prototype = new oFF.XObject();
	oFF.RsAxisTuple.create = function(axis, axisIndex) {
		var object = new oFF.RsAxisTuple();
		object.setupExt(axis, axisIndex);
		return object;
	};
	oFF.RsAxisTuple.prototype.m_axis = null;
	oFF.RsAxisTuple.prototype.m_elements = null;
	oFF.RsAxisTuple.prototype.m_attributeMembers = null;
	oFF.RsAxisTuple.prototype.m_valueCount = 0;
	oFF.RsAxisTuple.prototype.m_axisIndex = 0;
	oFF.RsAxisTuple.prototype.setupExt = function(axis, axisIndex) {
		this.m_axis = oFF.XWeakReferenceUtil.getWeakRef(axis);
		this.m_axisIndex = axisIndex;
		this.m_valueCount = -1;
	};
	oFF.RsAxisTuple.prototype.releaseObject = function() {
		var size;
		var i;
		var tupleElement;
		this.m_axis = null;
		if (oFF.notNull(this.m_elements)) {
			size = this.m_elements.size();
			for (i = 0; i < size; i++) {
				tupleElement = this.m_elements.get(i);
				oFF.XObjectExt.release(tupleElement);
			}
			this.m_elements = oFF.XObjectExt.release(this.m_elements);
		}
		this.m_attributeMembers = oFF.XObjectExt
				.release(this.m_attributeMembers);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RsAxisTuple.prototype.setTupleElements = function(elements) {
		this.m_elements = elements;
	};
	oFF.RsAxisTuple.prototype.getAxis = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_axis);
	};
	oFF.RsAxisTuple.prototype.size = function() {
		return this.m_elements.size();
	};
	oFF.RsAxisTuple.prototype.getAxisIndex = function() {
		return this.m_axisIndex;
	};
	oFF.RsAxisTuple.prototype.getScalingFactor = function() {
		var axis = this.getAxis();
		var isColumns = axis.getType() === oFF.AxisType.COLUMNS;
		var resultSet = axis.getResultSet();
		var size = isColumns ? resultSet.getDataRows() : resultSet
				.getDataColumns();
		var dataCell;
		var scalingFactor;
		var i;
		if (size > 0) {
			dataCell = isColumns ? resultSet.getDataCell(this.m_axisIndex, 0)
					: resultSet.getDataCell(0, this.m_axisIndex);
			scalingFactor = dataCell.getScalingFactor();
			for (i = 1; i < size; i++) {
				dataCell = isColumns ? resultSet.getDataCell(this.m_axisIndex,
						i) : resultSet.getDataCell(i, this.m_axisIndex);
				if (scalingFactor !== dataCell.getScalingFactor()) {
					return null;
				}
			}
			return oFF.XIntegerValue.create(scalingFactor);
		}
		return null;
	};
	oFF.RsAxisTuple.prototype.getTupleElementAt = function(index) {
		return this.get(index);
	};
	oFF.RsAxisTuple.prototype.get = function(index) {
		return this.m_elements.get(index);
	};
	oFF.RsAxisTuple.prototype.getElementByDimension = function(dimension) {
		return this.getTupleElementByDimension(dimension);
	};
	oFF.RsAxisTuple.prototype.getTupleElementByDimension = function(dimension) {
		var name;
		var udhWithThisDimensionIncluded = dimension
				.getUDHWithThisDimensionIncluded();
		var rsDimensions;
		var indexByName;
		if (oFF.notNull(udhWithThisDimensionIncluded)
				&& udhWithThisDimensionIncluded.isActive()) {
			name = udhWithThisDimensionIncluded.getName();
		} else {
			name = dimension.getName();
		}
		rsDimensions = this.getAxis().getRsDimensions();
		indexByName = oFF.XCollectionUtils.getIndexByName(rsDimensions, name);
		return indexByName === -1 ? null : this.m_elements.get(indexByName);
	};
	oFF.RsAxisTuple.prototype.getElements = function() {
		return this.m_elements;
	};
	oFF.RsAxisTuple.prototype.getValueCount = function() {
		var size;
		var i;
		var element;
		if (this.m_valueCount === -1) {
			this.m_valueCount = 0;
			size = this.m_elements.size();
			for (i = 0; i < size; i++) {
				element = this.m_elements.get(i);
				this.m_valueCount = this.m_valueCount
						+ element.getDimension().getResultSetFields().size();
			}
		}
		return this.m_valueCount;
	};
	oFF.RsAxisTuple.prototype.getAttributeMemberAt = function(index) {
		var size;
		var idxTupleElement;
		var element;
		var dimensionMember;
		var resultSetAttributeMembers;
		if (oFF.isNull(this.m_attributeMembers)) {
			this.m_attributeMembers = oFF.XList.create();
			size = this.m_elements.size();
			for (idxTupleElement = 0; idxTupleElement < size; idxTupleElement++) {
				element = this.m_elements.get(idxTupleElement);
				dimensionMember = element.getDimensionMember();
				resultSetAttributeMembers = dimensionMember
						.getResultSetFieldValues();
				this.m_attributeMembers.addAll(resultSetAttributeMembers);
			}
		}
		return this.m_attributeMembers.get(index);
	};
	oFF.RsAxisTuple.prototype.getValueTypeAt = function(index) {
		return this.getAttributeMemberAt(index).getValueType();
	};
	oFF.RsAxisTuple.prototype.getIntegerAt = function(index) {
		return this.getAttributeMemberAt(index).getInteger();
	};
	oFF.RsAxisTuple.prototype.getDoubleAt = function(index) {
		return this.getAttributeMemberAt(index).getDouble();
	};
	oFF.RsAxisTuple.prototype.getStringAt = function(index) {
		return this.getAttributeMemberAt(index).getString();
	};
	oFF.RsAxisTuple.prototype.getLongAt = function(index) {
		return this.getAttributeMemberAt(index).getLong();
	};
	oFF.RsAxisTuple.prototype.getBooleanAt = function(index) {
		return this.getAttributeMemberAt(index).getBoolean();
	};
	oFF.RsAxisTuple.prototype.getValueByField = function(field) {
		var size = this.size();
		var dimension = field.getDimension();
		var i;
		var element;
		for (i = 0; i < size; i++) {
			element = this.m_elements.get(i);
			if (element.getDimension() === dimension) {
				return element.getDimensionMember().getFieldValue(field);
			}
		}
		return null;
	};
	oFF.RsAxisTuple.prototype.getIntegerByField = function(field) {
		var valueByField = this.getValueByField(field);
		return oFF.isNull(valueByField) ? 0 : valueByField.getInteger();
	};
	oFF.RsAxisTuple.prototype.getDoubleByField = function(field) {
		var valueByField = this.getValueByField(field);
		return oFF.isNull(valueByField) ? 0 : valueByField.getDouble();
	};
	oFF.RsAxisTuple.prototype.getStringByField = function(field) {
		var valueByField = this.getValueByField(field);
		return oFF.isNull(valueByField) ? null : valueByField.getString();
	};
	oFF.RsAxisTuple.prototype.getBooleanByField = function(field) {
		var valueByField = this.getValueByField(field);
		return oFF.isNull(valueByField) ? false : valueByField.getBoolean();
	};
	oFF.RsAxisTuple.prototype.getTristateByField = function(field) {
		var valueByField = this.getValueByField(field);
		return oFF.isNull(valueByField) ? oFF.TriStateBool._DEFAULT
				: oFF.TriStateBool.lookup(valueByField.getBoolean());
	};
	oFF.RsAxisTuple.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		var size = this.m_elements.size();
		var i;
		var element;
		for (i = 0; i < size; i++) {
			if (i > 0) {
				buffer.append("\r\n");
			}
			element = this.get(i);
			buffer.append(element.toString());
		}
		return buffer.toString();
	};
	oFF.RsAxisTuple.prototype.isEmpty = function() {
		return this.m_elements.isEmpty();
	};
	oFF.RsAxisTuple.prototype.hasElements = function() {
		return this.m_elements.hasElements();
	};
	oFF.RsAxisTuple.prototype.getIntegerAtExt = function(index, defaultValue) {
		return this.getIntegerAt(index);
	};
	oFF.RsAxisTuple.prototype.getBooleanAtExt = function(index, defaultValue) {
		return this.getBooleanAt(index);
	};
	oFF.RsAxisTuple.prototype.getDoubleAtExt = function(index, defaultValue) {
		return this.getDoubleAt(index);
	};
	oFF.RsAxisTuple.prototype.getStringAtExt = function(index, defaultValue) {
		return this.getStringAt(index);
	};
	oFF.RsAxisTuple.prototype.getLongAtExt = function(index, defaultValue) {
		return this.getLongAt(index);
	};
	oFF.RsCursorAxisTupleElementContent = function() {
	};
	oFF.RsCursorAxisTupleElementContent.prototype = new oFF.DfApplicationContext();
	oFF.RsCursorAxisTupleElementContent.create = function(application,
			dimension, rsDimension) {
		var object = new oFF.RsCursorAxisTupleElementContent();
		object.setupExt(application, dimension, rsDimension);
		return object;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.m_dimension = null;
	oFF.RsCursorAxisTupleElementContent.prototype.m_rsDimension = null;
	oFF.RsCursorAxisTupleElementContent.prototype.m_dimensionMemberName = null;
	oFF.RsCursorAxisTupleElementContent.prototype.m_valueOfHierarchyNavigationKey = null;
	oFF.RsCursorAxisTupleElementContent.prototype.m_nameValueException = null;
	oFF.RsCursorAxisTupleElementContent.prototype.m_fieldList = null;
	oFF.RsCursorAxisTupleElementContent.prototype.m_currentAttributeMember = null;
	oFF.RsCursorAxisTupleElementContent.prototype.m_fieldIndex = 0;
	oFF.RsCursorAxisTupleElementContent.prototype.m_dimensionMemberType = null;
	oFF.RsCursorAxisTupleElementContent.prototype.m_drillState = null;
	oFF.RsCursorAxisTupleElementContent.prototype.m_displayLevel = 0;
	oFF.RsCursorAxisTupleElementContent.prototype.m_absoluteLevel = 0;
	oFF.RsCursorAxisTupleElementContent.prototype.m_parentNodeIndex = 0;
	oFF.RsCursorAxisTupleElementContent.prototype.m_nodeId = null;
	oFF.RsCursorAxisTupleElementContent.prototype.m_childCount = 0;
	oFF.RsCursorAxisTupleElementContent.prototype.setupExt = function(
			application, dimension, rsDimension) {
		this.setupApplicationContext(application);
		this.m_dimension = oFF.XWeakReferenceUtil.getWeakRef(dimension);
		this.m_rsDimension = oFF.XWeakReferenceUtil.getWeakRef(rsDimension);
		this.m_fieldIndex = -1;
		this.m_fieldList = oFF.XList.create();
		this.m_dimensionMemberType = oFF.MemberType.MEMBER;
		this.m_parentNodeIndex = -1;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.clone = function() {
		var clone = oFF.RsCursorAxisTupleElementContent.create(this
				.getApplication(), this
				.getDimensionAtCurrentPositionFromQueryModel(), this
				.getRsDimensionAtCurrentPosition());
		var size;
		var i;
		clone.m_dimensionMemberName = this.m_dimensionMemberName;
		clone.m_valueOfHierarchyNavigationKey = this.m_valueOfHierarchyNavigationKey;
		clone.m_nameValueException = this.m_nameValueException;
		size = this.m_fieldList.size();
		for (i = 0; i < size; i++) {
			clone.addFieldMetadata(this.m_fieldList.get(i).getField());
		}
		clone.m_fieldIndex = this.m_fieldIndex;
		clone.m_dimensionMemberType = this.m_dimensionMemberType;
		clone.m_drillState = this.m_drillState;
		clone.m_displayLevel = this.m_displayLevel;
		clone.m_absoluteLevel = this.m_absoluteLevel;
		clone.m_parentNodeIndex = this.m_parentNodeIndex;
		clone.m_nodeId = this.m_nodeId;
		clone.m_childCount = this.m_childCount;
		return clone;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.releaseObject = function() {
		this.m_dimension = oFF.XObjectExt.release(this.m_dimension);
		this.m_rsDimension = oFF.XObjectExt.release(this.m_rsDimension);
		this.m_dimensionMemberName = null;
		this.m_valueOfHierarchyNavigationKey = null;
		this.m_nameValueException = null;
		this.m_fieldList = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_fieldList);
		this.m_currentAttributeMember = null;
		this.m_dimensionMemberType = null;
		this.m_drillState = null;
		this.m_nodeId = null;
		oFF.DfApplicationContext.prototype.releaseObject.call(this);
	};
	oFF.RsCursorAxisTupleElementContent.prototype.addFieldMetadata = function(
			field) {
		this.m_fieldList.add(oFF.RsCursorFieldValue.create(field));
	};
	oFF.RsCursorAxisTupleElementContent.prototype.getDimensionAtCurrentPosition = function() {
		var dimension = oFF.XWeakReferenceUtil.getHardRef(this.m_dimension);
		if (oFF.isNull(dimension)) {
			return this.getRsDimensionAtCurrentPosition();
		}
		return dimension;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.getDimensionAtCurrentPositionFromQueryModel = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_dimension);
	};
	oFF.RsCursorAxisTupleElementContent.prototype.getRsDimensionAtCurrentPosition = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_rsDimension);
	};
	oFF.RsCursorAxisTupleElementContent.prototype.getDimensionMemberNameValueException = function() {
		return this.m_nameValueException;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.getValueOfHierarchyNavigationKey = function() {
		return this.m_valueOfHierarchyNavigationKey;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.setValueOfHierarchyNavigationKey = function(
			value) {
		this.m_valueOfHierarchyNavigationKey = value;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.getDimensionMemberName = function() {
		return this.m_dimensionMemberName;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.setDimensionMemberName = function(
			name) {
		this.m_dimensionMemberName = name;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.setDimensionMemberNameValueException = function(
			valueException) {
		this.m_nameValueException = valueException;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.setDimensionMemberType = function(
			type) {
		this.m_dimensionMemberType = type;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.getDimensionMemberType = function() {
		return this.m_dimensionMemberType;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.createDimensionMemberFromCurrentPosition = function() {
		return oFF.QFactory.newDimensionMemberFromTupleElement(this);
	};
	oFF.RsCursorAxisTupleElementContent.prototype.setFieldValueCursorBeforeStart = function() {
		this.m_fieldIndex = -1;
		this.m_currentAttributeMember = null;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.hasNextFieldValue = function() {
		return this.m_fieldIndex < this.m_fieldList.size() - 1;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.nextFieldValue = function() {
		this.m_fieldIndex++;
		this.m_currentAttributeMember = this.m_fieldList.get(this.m_fieldIndex);
		return this.m_currentAttributeMember;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.getFieldValue = function() {
		return this.m_currentAttributeMember;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.setDrillState = function(
			drillState) {
		this.m_drillState = drillState;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.setDisplayLevel = function(
			displayLevel) {
		this.m_displayLevel = displayLevel;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.setParentNodeIndex = function(
			parentIndex) {
		this.m_parentNodeIndex = parentIndex;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.setAbsoluteLevel = function(
			absoluteLevel) {
		this.m_absoluteLevel = absoluteLevel;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.getDrillState = function() {
		return this.m_drillState;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.getAbsoluteLevel = function() {
		return this.m_absoluteLevel;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.getDisplayLevel = function() {
		return this.m_displayLevel;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.getNodeId = function() {
		return this.m_nodeId;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.setNodeId = function(nodeId) {
		this.m_nodeId = nodeId;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.getParentNodeIndex = function() {
		return this.m_parentNodeIndex;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.setChildCount = function(
			childCount) {
		this.m_childCount = childCount;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.getChildCount = function() {
		return this.m_childCount;
	};
	oFF.RsCursorAxisTupleElementContent.prototype.getFieldValueList = function() {
		return this.m_fieldList;
	};
	oFF.RsDataEntry = function() {
	};
	oFF.RsDataEntry.prototype = new oFF.AbstractRsDataEntry();
	oFF.RsDataEntry.create = function(collection, column, row, originalCell) {
		var value = new oFF.RsDataEntry();
		var originalXValue2;
		value.setupEntry(collection);
		value.m_column = column;
		value.m_row = row;
		originalXValue2 = originalCell.getXValue();
		if (oFF.isNull(originalXValue2)) {
			originalXValue2 = oFF.XDoubleValue.create(0);
		}
		value.m_originXValue = originalXValue2.clone();
		value.m_xvalue = originalXValue2.clone();
		value.m_originalLock = originalCell.getOriginalValueLock();
		value.m_lock = originalCell.getOriginalValueLock();
		value.m_planningCommand = originalCell.getPlanningCommand();
		value.m_forceNewValue = originalCell.isNewValueForced();
		return value;
	};
	oFF.RsDataEntry.prototype.m_column = 0;
	oFF.RsDataEntry.prototype.m_row = 0;
	oFF.RsDataEntry.prototype.getColumn = function() {
		return this.m_column;
	};
	oFF.RsDataEntry.prototype.getRow = function() {
		return this.m_row;
	};
	oFF.RsDataEntryViaMember = function() {
	};
	oFF.RsDataEntryViaMember.prototype = new oFF.AbstractRsDataEntry();
	oFF.RsDataEntryViaMember.create = function(collection) {
		var obj = new oFF.RsDataEntryViaMember();
		obj.setupEntry(collection);
		obj.m_memberContext = oFF.XHashMapOfStringByString.create();
		return obj;
	};
	oFF.RsDataEntryViaMember.prototype.m_memberContext = null;
	oFF.RsDataEntryViaMember.prototype.addMemberContext = function(
			dimensionName, memberName) {
		this.m_memberContext.put(dimensionName, memberName);
	};
	oFF.RsDataEntryViaMember.prototype.getMemberContext = function() {
		return this.m_memberContext;
	};
	oFF.RsDataEntryViaMember.prototype.releaseObject = function() {
		this.m_memberContext = oFF.XObjectExt.release(this.m_memberContext);
		oFF.AbstractRsDataEntry.prototype.releaseObject.call(this);
	};
	oFF.DfRsAxisProvider = function() {
	};
	oFF.DfRsAxisProvider.prototype = new oFF.DfApplicationContext();
	oFF.DfRsAxisProvider.prototype.m_cursorAxis = null;
	oFF.DfRsAxisProvider.prototype.setCursorAxis = function(axis) {
		this.m_cursorAxis = oFF.XWeakReferenceUtil.getWeakRef(axis);
	};
	oFF.DfRsAxisProvider.prototype.releaseObject = function() {
		this.m_cursorAxis = oFF.XObjectExt.release(this.m_cursorAxis);
		oFF.DfApplicationContext.prototype.releaseObject.call(this);
	};
	oFF.DfRsAxisProvider.prototype.getCursorAxis = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_cursorAxis);
	};
	oFF.RsPagingType = function() {
	};
	oFF.RsPagingType.prototype = new oFF.XConstant();
	oFF.RsPagingType.SINGLE_REQUEST = null;
	oFF.RsPagingType.TWO_REQUESTS = null;
	oFF.RsPagingType.MULTIPLE_REQUESTS = null;
	oFF.RsPagingType.staticSetup = function() {
		oFF.RsPagingType.SINGLE_REQUEST = oFF.XConstant.setupName(
				new oFF.RsPagingType(), "SingleRequest");
		oFF.RsPagingType.TWO_REQUESTS = oFF.XConstant.setupName(
				new oFF.RsPagingType(), "TwoRequests");
		oFF.RsPagingType.MULTIPLE_REQUESTS = oFF.XConstant.setupName(
				new oFF.RsPagingType(), "MultipleRequests");
	};
	oFF.ResultSet = function() {
	};
	oFF.ResultSet.prototype = new oFF.DfApplicationContext();
	oFF.ResultSet.create = function(resultSetContainer, cursor) {
		var resultSet = new oFF.ResultSet();
		resultSet.setupExt(resultSetContainer, cursor);
		return resultSet;
	};
	oFF.ResultSet.prototype.m_resultSetContainer = null;
	oFF.ResultSet.prototype.m_queryModel = null;
	oFF.ResultSet.prototype.m_state = null;
	oFF.ResultSet.prototype.m_dataColumns = 0;
	oFF.ResultSet.prototype.m_dataRows = 0;
	oFF.ResultSet.prototype.m_columnsAxis = null;
	oFF.ResultSet.prototype.m_rowsAxis = null;
	oFF.ResultSet.prototype.m_dataCells = null;
	oFF.ResultSet.prototype.m_complexUnitsSetting = null;
	oFF.ResultSet.prototype.m_cursorResultSet = null;
	oFF.ResultSet.prototype.setupExt = function(resultSetContainer, cursor) {
		this.setupApplicationContext(resultSetContainer.getApplication());
		this.setResultSetContainer(resultSetContainer);
		this.m_queryModel = oFF.XWeakReferenceUtil.getWeakRef(cursor
				.getQueryModel());
		this.m_cursorResultSet = oFF.XWeakReferenceUtil.getWeakRef(cursor);
		this.m_columnsAxis = oFF.RsAxis.create(this, oFF.AxisType.COLUMNS,
				cursor.getCursorColumnsAxis());
		this.m_rowsAxis = oFF.RsAxis.create(this, oFF.AxisType.ROWS, cursor
				.getCursorRowsAxis());
		this.m_complexUnitsSetting = oFF.XWeakReferenceUtil.getWeakRef(cursor
				.getComplexUnitsSetting());
		this.m_state = cursor.getState();
		if (this.m_state === oFF.ResultSetState.DATA_AVAILABLE) {
			this.m_dataColumns = cursor.getDataColumns();
			this.m_dataRows = cursor.getDataRows();
		} else {
			this.m_dataColumns = -1;
			this.m_dataRows = -1;
		}
	};
	oFF.ResultSet.prototype.releaseObject = function() {
		var size;
		var i;
		var dataCell;
		this.m_resultSetContainer = null;
		this.m_queryModel = null;
		this.m_state = oFF.ResultSetState.TERMINATED;
		this.m_dataColumns = -1;
		this.m_dataRows = -1;
		if (oFF.notNull(this.m_dataCells)) {
			size = this.m_dataCells.size();
			for (i = 0; i < size; i++) {
				dataCell = this.m_dataCells.get(i);
				oFF.XObjectExt.release(dataCell);
			}
			this.m_dataCells = oFF.XObjectExt.release(this.m_dataCells);
		}
		this.m_columnsAxis = oFF.XObjectExt.release(this.m_columnsAxis);
		this.m_rowsAxis = oFF.XObjectExt.release(this.m_rowsAxis);
		this.m_cursorResultSet = null;
		this.m_complexUnitsSetting = oFF.XObjectExt
				.release(this.m_complexUnitsSetting);
		oFF.DfApplicationContext.prototype.releaseObject.call(this);
	};
	oFF.ResultSet.prototype.isActive = function() {
		return this.getResultSetContainer() !== null;
	};
	oFF.ResultSet.prototype.setResultSetContainer = function(resultSetContainer) {
		this.m_resultSetContainer = oFF.XWeakReferenceUtil
				.getWeakRef(resultSetContainer);
	};
	oFF.ResultSet.prototype.getResultSetContainer = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_resultSetContainer);
	};
	oFF.ResultSet.prototype.getQueryManager = function() {
		return this.getResultSetContainer().getQueryManager();
	};
	oFF.ResultSet.prototype.getQueryModel = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_queryModel);
	};
	oFF.ResultSet.prototype.getDataColumns = function() {
		return this.m_dataColumns;
	};
	oFF.ResultSet.prototype.getDataRows = function() {
		return this.m_dataRows;
	};
	oFF.ResultSet.prototype.getAvailableDataCellCount = function() {
		if (this.m_state === oFF.ResultSetState.DATA_AVAILABLE) {
			return this.m_dataColumns * this.m_dataRows;
		}
		return -1;
	};
	oFF.ResultSet.prototype.getState = function() {
		return this.m_state;
	};
	oFF.ResultSet.prototype.getRowsAxis = function() {
		return this.m_rowsAxis;
	};
	oFF.ResultSet.prototype.getColumnsAxis = function() {
		return this.m_columnsAxis;
	};
	oFF.ResultSet.prototype.getAxis = function(axis) {
		return axis === oFF.AxisType.ROWS ? this.m_rowsAxis
				: this.m_columnsAxis;
	};
	oFF.ResultSet.prototype.setupDataCells = function() {
		var size = this.m_dataColumns * this.m_dataRows;
		var index;
		var cursorResultSet;
		var y;
		var x;
		this.m_dataCells = oFF.XArray.create(size);
		index = 0;
		cursorResultSet = this.getCursorResultSet();
		for (y = 0; y < this.m_dataRows; y++) {
			for (x = 0; x < this.m_dataColumns; x++) {
				this.m_dataCells.set(index, oFF.RsDataCell.createCopy(this,
						cursorResultSet.getDataCell(x, y)));
				++index;
			}
		}
	};
	oFF.ResultSet.prototype.getDataCell = function(column, row) {
		var invalidCol = column < 0 || column > this.m_dataColumns;
		var invalidRow = row < 0 || row > this.m_dataRows;
		var maxCol = this.m_dataColumns;
		var maxRow = this.m_dataRows;
		if (this.getApplication().getVersion() >= oFF.XVersion.V105_ASSERT_RESULTSET_BOUNDARIES) {
			invalidCol = column < 0 || column >= this.m_dataColumns;
			invalidRow = row < 0 || row >= this.m_dataRows;
			maxCol = this.m_dataColumns - 1;
			maxRow = this.m_dataRows - 1;
		}
		oFF.XBooleanUtils.checkFalse(invalidCol, oFF.XStringUtils.concatenate3(
				"Column index is invalid, valid indices are [0, ",
				oFF.XIntegerValue.create(maxCol).toString(), "]"));
		oFF.XBooleanUtils.checkFalse(invalidRow, oFF.XStringUtils.concatenate3(
				"Row index is invalid, valid indices are [0, ",
				oFF.XIntegerValue.create(maxRow).toString(), "]"));
		if (oFF.isNull(this.m_dataCells)) {
			this.setupDataCells();
		}
		return this.m_dataCells.get(column + row * this.m_dataColumns);
	};
	oFF.ResultSet.prototype.getDataCellByTuples = function(columnTuple,
			rowTuple) {
		return this.getDataCell(columnTuple.getAxisIndex(), rowTuple
				.getAxisIndex());
	};
	oFF.ResultSet.prototype.isValid = function() {
		return this.getCursorResultSet().isValid();
	};
	oFF.ResultSet.prototype.hasErrors = function() {
		return this.getCursorResultSet().hasErrors();
	};
	oFF.ResultSet.prototype.getNumberOfErrors = function() {
		return this.getCursorResultSet().getNumberOfErrors();
	};
	oFF.ResultSet.prototype.hasSeverity = function(severity) {
		return this.getCursorResultSet().hasSeverity(severity);
	};
	oFF.ResultSet.prototype.getNumberOfSeverity = function(severity) {
		return this.getCursorResultSet().getNumberOfSeverity(severity);
	};
	oFF.ResultSet.prototype.getFirstWithSeverity = function(severity) {
		return this.getCursorResultSet().getFirstWithSeverity(severity);
	};
	oFF.ResultSet.prototype.getErrors = function() {
		return this.getCursorResultSet().getErrors();
	};
	oFF.ResultSet.prototype.getWarnings = function() {
		return this.getCursorResultSet().getWarnings();
	};
	oFF.ResultSet.prototype.getInfos = function() {
		return this.getCursorResultSet().getInfos();
	};
	oFF.ResultSet.prototype.getSemanticalErrors = function() {
		return this.getCursorResultSet().getSemanticalErrors();
	};
	oFF.ResultSet.prototype.getMessages = function() {
		return this.getCursorResultSet().getMessages();
	};
	oFF.ResultSet.prototype.getFirstError = function() {
		return this.getCursorResultSet().getFirstError();
	};
	oFF.ResultSet.prototype.getSummary = function() {
		return this.getCursorResultSet().getSummary();
	};
	oFF.ResultSet.prototype.isDataEntryEnabled = function() {
		return this.getCursorResultSet().isDataEntryEnabled();
	};
	oFF.ResultSet.prototype.getInputReadinessStates = function() {
		return this.getCursorResultSet().getInputReadinessStates();
	};
	oFF.ResultSet.prototype.getClientStatusCode = function() {
		return this.getCursorResultSet().getClientStatusCode();
	};
	oFF.ResultSet.prototype.getServerStatusCode = function() {
		return this.getCursorResultSet().getServerStatusCode();
	};
	oFF.ResultSet.prototype.getServerStatusDetails = function() {
		return this.getCursorResultSet().getServerStatusDetails();
	};
	oFF.ResultSet.prototype.getInputReadinessStateAt = function(index) {
		var cursorResultSet = this.getCursorResultSet();
		return cursorResultSet.getInputReadinessStateAt(index);
	};
	oFF.ResultSet.prototype.getRootProfileNode = function() {
		return this.getCursorResultSet().getRootProfileNode();
	};
	oFF.ResultSet.prototype.isNewLinePossible = function() {
		return !this.isDataEntryEnabled() ? false : this.getDataEntryMask()
				.hasElements();
	};
	oFF.ResultSet.prototype.getCursorResultSet = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_cursorResultSet);
	};
	oFF.ResultSet.prototype.getDataEntryMask = function() {
		return this.getCursorResultSet().getDataEntryMask();
	};
	oFF.ResultSet.prototype.getResultSetType = function() {
		return oFF.ResultSetType.CLASSIC;
	};
	oFF.ResultSet.prototype.getRsQueryModelDef = function() {
		return this.getCursorResultSet().getRsQueryModelDef();
	};
	oFF.ResultSet.prototype.resetNewValues = function() {
		var i;
		var dataCell;
		if (oFF.notNull(this.m_dataCells)) {
			for (i = 0; i < this.m_dataCells.size(); i++) {
				dataCell = this.m_dataCells.get(i);
				dataCell.resetAllChanges();
			}
		}
	};
	oFF.ResultSet.prototype.getComplexUnitsSetting = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_complexUnitsSetting);
	};
	oFF.ResultSet.prototype.getNewDataEntryViaMember = function() {
		return this.getCursorResultSet().getNewDataEntryViaMember();
	};
	oFF.RsDefDimension = function() {
	};
	oFF.RsDefDimension.prototype = new oFF.DfNameTextObject();
	oFF.RsDefDimension.create = function(dimension, rsDefAxis) {
		var object = new oFF.RsDefDimension();
		object.setupExt(dimension, rsDefAxis);
		return object;
	};
	oFF.RsDefDimension.prototype.m_isMeasureDimension = false;
	oFF.RsDefDimension.prototype.m_isStructure = false;
	oFF.RsDefDimension.prototype.m_isHierarchyActive = false;
	oFF.RsDefDimension.prototype.m_hierarchyName = null;
	oFF.RsDefDimension.prototype.m_dimensionType = null;
	oFF.RsDefDimension.prototype.m_childAlignment = null;
	oFF.RsDefDimension.prototype.m_axis = null;
	oFF.RsDefDimension.prototype.m_rsFields = null;
	oFF.RsDefDimension.prototype.m_allFieldNames = null;
	oFF.RsDefDimension.prototype.setupExt = function(dimension, rsDefAxis) {
		this.m_axis = rsDefAxis;
		if (oFF.notNull(dimension)) {
			this.setName(dimension.getName());
			this.setText(dimension.getText());
			this.m_isMeasureDimension = dimension.isMeasureStructure();
			this.m_isStructure = dimension.isStructure();
			this.m_isHierarchyActive = dimension.isHierarchyActive();
			this.m_hierarchyName = dimension.getHierarchyName();
			this.m_dimensionType = dimension.getDimensionType();
			this.m_childAlignment = dimension.getLowerLevelNodeAlignment();
		}
		this.m_rsFields = oFF.XLinkedMap.create();
		this.m_allFieldNames = oFF.XListOfString.create();
	};
	oFF.RsDefDimension.prototype.releaseObject = function() {
		this.m_rsFields = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_rsFields);
		this.m_axis = oFF.XObjectExt.release(this.m_axis);
		this.m_allFieldNames = oFF.XObjectExt.release(this.m_allFieldNames);
		this.m_hierarchyName = null;
		this.m_dimensionType = null;
		this.m_childAlignment = null;
		oFF.DfNameTextObject.prototype.releaseObject.call(this);
	};
	oFF.RsDefDimension.prototype.isMeasureStructure = function() {
		return this.m_isMeasureDimension;
	};
	oFF.RsDefDimension.prototype.isStructure = function() {
		return this.m_isStructure;
	};
	oFF.RsDefDimension.prototype.getAllFieldNames = function() {
		return this.m_allFieldNames;
	};
	oFF.RsDefDimension.prototype.addField = function(fieldName) {
		this.m_allFieldNames.add(fieldName);
	};
	oFF.RsDefDimension.prototype.isHierarchyActive = function() {
		return this.m_isHierarchyActive;
	};
	oFF.RsDefDimension.prototype.setHierarchyActive = function(isActive) {
		this.m_isHierarchyActive = isActive;
	};
	oFF.RsDefDimension.prototype.getResultSetFields = function() {
		return this.m_rsFields;
	};
	oFF.RsDefDimension.prototype.addRsField = function(fieldName, fieldText,
			presentationType, valueType) {
		this.m_rsFields.add(oFF.RsDefField.create(fieldName, fieldText,
				presentationType, valueType, this));
	};
	oFF.RsDefDimension.prototype.getAxisType = function() {
		return this.m_axis.getType();
	};
	oFF.RsDefDimension.prototype.setHierarchyName = function(hierarchyName) {
		this.m_hierarchyName = hierarchyName;
	};
	oFF.RsDefDimension.prototype.getHierarchyName = function() {
		return this.m_hierarchyName;
	};
	oFF.RsDefDimension.prototype.getIndexOnAxis = function() {
		return this.m_axis.getRsDimensions().getIndex(this);
	};
	oFF.RsDefDimension.prototype.getDimensionType = function() {
		return this.m_dimensionType;
	};
	oFF.RsDefDimension.prototype.setDimensionType = function(dimensionType) {
		this.m_dimensionType = dimensionType;
	};
	oFF.RsDefDimension.prototype.getLowerLevelNodeAlignment = function() {
		return this.m_childAlignment;
	};
	oFF.RsDefDimension.prototype.hasDefaultLowerLevelNodeAlignment = function() {
		return this.m_childAlignment === oFF.Alignment.DEFAULT_VALUE;
	};
	oFF.RsDefDimension.prototype.setLowerLevelNodeAlignment = function(
			alignment) {
		this.m_childAlignment = alignment;
	};
	oFF.RsDefDimension.prototype.setupInADimension = function(inaDimension) {
		this.setName(inaDimension.getName());
		this.setHierarchyName(inaDimension.getHierarchyName());
		this.setDimensionType(inaDimension.getDimensionType());
		this.setHierarchyActive(inaDimension.isHierarchyActive());
		this.setLowerLevelNodeAlignment(inaDimension
				.getLowerLevelNodeAlignment());
	};
	oFF.RsDefDimension.prototype._getFieldByPresentation = function(flatType,
			hierarchyType) {
		var size = this.m_rsFields.size();
		var i;
		var rsField;
		for (i = 0; i < size; i++) {
			rsField = this.m_rsFields.get(i);
			if (this.m_isHierarchyActive
					&& rsField.getPresentationType() === hierarchyType) {
				return rsField;
			}
			if (!this.m_isHierarchyActive
					&& rsField.getPresentationType() === flatType) {
				return rsField;
			}
		}
		return null;
	};
	oFF.RsDefDimension.prototype.getKeyField = function() {
		return this._getFieldByPresentation(oFF.PresentationType.KEY,
				oFF.PresentationType.HIERARCHY_KEY);
	};
	oFF.RsDefDimension.prototype.getDisplayKeyField = function() {
		return this._getFieldByPresentation(oFF.PresentationType.DISPLAY_KEY,
				oFF.PresentationType.HIERARCHY_DISPLAY_KEY);
	};
	oFF.RsDefDimension.prototype.getTextField = function() {
		return this._getFieldByPresentation(oFF.PresentationType.TEXT,
				oFF.PresentationType.HIERARCHY_TEXT);
	};
	oFF.RsDefDimension.prototype.getConvenienceCommands = function() {
		return this.m_axis.getConvenienceCommands();
	};
	oFF.RsDefField = function() {
	};
	oFF.RsDefField.prototype = new oFF.DfNameTextObject();
	oFF.RsDefField.create = function(name, text, presentationType, valueType,
			rsDefDimension) {
		var rsDefField = new oFF.RsDefField();
		rsDefField.setName(name);
		rsDefField.setText(text);
		rsDefField.m_presentationType = presentationType;
		rsDefField.m_valueType = valueType;
		rsDefField.m_dimension = rsDefDimension;
		return rsDefField;
	};
	oFF.RsDefField.prototype.m_dimension = null;
	oFF.RsDefField.prototype.m_presentationType = null;
	oFF.RsDefField.prototype.m_valueType = null;
	oFF.RsDefField.prototype.releaseObject = function() {
		this.m_dimension = null;
		this.m_presentationType = null;
		this.m_valueType = null;
		oFF.DfNameTextObject.prototype.releaseObject.call(this);
	};
	oFF.RsDefField.prototype.getPresentationType = function() {
		return this.m_presentationType;
	};
	oFF.RsDefField.prototype.getValueType = function() {
		return this.m_valueType;
	};
	oFF.RsDefField.prototype.getConvenienceCommands = function() {
		return this.m_dimension.getConvenienceCommands();
	};
	oFF.BLOBContainer = function() {
	};
	oFF.BLOBContainer.prototype = new oFF.SyncAction();
	oFF.BLOBContainer.createBLOBContainer = function(manager, rpcFunction) {
		var blobContainer = new oFF.BLOBContainer();
		blobContainer.setupSynchronizingObject(manager);
		blobContainer.m_rpcFunction = rpcFunction;
		blobContainer.setData(blobContainer);
		return blobContainer;
	};
	oFF.BLOBContainer.prototype.m_listener = null;
	oFF.BLOBContainer.prototype.m_rpcFunction = null;
	oFF.BLOBContainer.prototype.releaseObject = function() {
		this.m_listener = oFF.XObjectExt.release(this.m_listener);
		this.m_rpcFunction = oFF.XObjectExt.release(this.m_rpcFunction);
		oFF.SyncAction.prototype.releaseObject.call(this);
	};
	oFF.BLOBContainer.prototype.processExecution = function(syncType, listener,
			customIdentifier) {
		this.m_listener = listener;
		return this.processSyncAction(syncType, listener, customIdentifier);
	};
	oFF.BLOBContainer.prototype.processSynchronization = function(syncType) {
		this.setSyncChild(this.m_rpcFunction);
		this.m_rpcFunction.processFunctionExecution(syncType, this, null);
		return true;
	};
	oFF.BLOBContainer.prototype.callListener = function(extResult, listener,
			data, customIdentifier) {
		listener.onBLOBAvailable(extResult, data, customIdentifier);
	};
	oFF.BLOBContainer.prototype.onFunctionExecuted = function(extResult,
			response, customIdentifier) {
		this.addAllMessages(extResult);
		if (extResult.isValid() && oFF.notNull(response)) {
			this.setResultStructureForBLOB(response);
		}
		this.endSync();
	};
	oFF.BLOBContainer.prototype.setResultStructureForBLOB = function(response) {
		var rootElementAsString = response.getRootElementAsString();
		var queryManager;
		var rootElement;
		var keys;
		var i;
		var resourceKey;
		var contentAndMime;
		var thingsOfInterest;
		if (oFF.notNull(rootElementAsString)) {
			queryManager = this.getQueryManager();
			rootElement = response.getRootElement();
			keys = rootElement.getKeysAsReadOnlyListOfString();
			for (i = 0; i < keys.size(); i++) {
				resourceKey = keys.get(i);
				contentAndMime = rootElement.getStructureByKey(resourceKey);
				thingsOfInterest = oFF.XHashMapOfStringByString.create();
				thingsOfInterest.put("Content-Type", contentAndMime
						.getStringByKey("Content-Type"));
				thingsOfInterest.put("ContentString", contentAndMime
						.getStringByKey("ContentString"));
				thingsOfInterest.put("Content-Length", contentAndMime
						.getStringByKey("Content-Length"));
				queryManager.getOlapEnv().addBLOBDetailsToCache(
						this.getQueryManager().getResourcePath(),
						thingsOfInterest);
			}
			this.endProfileStep();
		}
	};
	oFF.BLOBContainer.prototype.getQueryManager = function() {
		var context = this.getContext();
		if (oFF.isNull(context)) {
			return null;
		}
		return context.getQueryManager();
	};
	oFF.BLOBContainer.prototype.getContext = function() {
		var actionContext = this.getActionContext();
		if (oFF.isNull(actionContext)) {
			return null;
		}
		return actionContext.getContext();
	};
	oFF.DfRsSyncAction = function() {
	};
	oFF.DfRsSyncAction.prototype = new oFF.SyncAction();
	oFF.DfRsSyncAction.prototype.getContext = function() {
		var actionContext = this.getActionContext();
		if (oFF.isNull(actionContext)) {
			return null;
		}
		return actionContext.getContext();
	};
	oFF.DfRsSyncAction.prototype.getOlapEnv = function() {
		return this.getActionContext().getOlapEnv();
	};
	oFF.DfRsSyncAction.prototype.getApplication = function() {
		if (this.getActionContext() === null) {
			return null;
		}
		return this.getActionContext().getApplication();
	};
	oFF.DfRsSyncAction.prototype.getQueryManager = function() {
		var context = this.getContext();
		if (oFF.isNull(context)) {
			return null;
		}
		return context.getQueryManager();
	};
	oFF.DfRsSyncAction.prototype.getQueryModel = function() {
		var context = this.getContext();
		if (oFF.isNull(context)) {
			return null;
		}
		return context.getQueryModel();
	};
	oFF.DfRsSyncAction.prototype.queueEventing = function() {
	};
	oFF.DfRsSyncAction.prototype.stopEventing = function() {
	};
	oFF.DfRsSyncAction.prototype.isEventingStopped = function() {
		return false;
	};
	oFF.DfRsSyncAction.prototype.resumeEventing = function() {
	};
	oFF.RsDataCell = function() {
	};
	oFF.RsDataCell.prototype = new oFF.XAbstractValue();
	oFF.RsDataCell.createDefault = function(cursorResultSet) {
		var cell = new oFF.RsDataCell();
		cell.setupDefault(cursorResultSet);
		return cell;
	};
	oFF.RsDataCell.createCopy = function(classicResultSet, origin) {
		var cell = new oFF.RsDataCell();
		cell.setupCopy(classicResultSet, origin);
		return cell;
	};
	oFF.RsDataCell.prototype.m_classicResultSet = null;
	oFF.RsDataCell.prototype.m_cursorResultSet = null;
	oFF.RsDataCell.prototype.m_queryDataCell = null;
	oFF.RsDataCell.prototype.m_column = 0;
	oFF.RsDataCell.prototype.m_row = 0;
	oFF.RsDataCell.prototype.m_decimalPlaces = 0;
	oFF.RsDataCell.prototype.m_scalingFactor = 0;
	oFF.RsDataCell.prototype.m_inputReadinessIndex = 0;
	oFF.RsDataCell.prototype.m_formattedValue = null;
	oFF.RsDataCell.prototype.m_formatString = null;
	oFF.RsDataCell.prototype.m_complexUnitIndex = 0;
	oFF.RsDataCell.prototype.m_xvalue = null;
	oFF.RsDataCell.prototype.m_valueType = null;
	oFF.RsDataCell.prototype.m_valueException = null;
	oFF.RsDataCell.prototype.m_planningCommandIds = null;
	oFF.RsDataCell.prototype.m_currencyUnit = null;
	oFF.RsDataCell.prototype.m_exceptionSettings = null;
	oFF.RsDataCell.prototype.m_exceptionPriorities = null;
	oFF.RsDataCell.prototype.m_maxAlertLevel = null;
	oFF.RsDataCell.prototype.m_maxAlertLevelName = null;
	oFF.RsDataCell.prototype.m_dataEntry = null;
	oFF.RsDataCell.prototype.m_dataEntryEnabled = false;
	oFF.RsDataCell.prototype.m_originalValueLock = false;
	oFF.RsDataCell.prototype.setupDefault = function(cursorResultSet) {
		this.m_cursorResultSet = oFF.XWeakReferenceUtil
				.getWeakRef(cursorResultSet);
		this.m_currencyUnit = oFF.RsCursorCurrencyUnit.createCurrencyUnit();
		this.m_maxAlertLevel = oFF.AlertLevel.NORMAL;
		this.m_queryDataCell = null;
		this.m_valueType = oFF.XValueType.DOUBLE;
		this.m_column = -1;
		this.m_row = -1;
		this.m_complexUnitIndex = -1;
	};
	oFF.RsDataCell.prototype.setupCopy = function(classicResultSet, origin) {
		var originPlanningCommandIds;
		var readinessState;
		this.m_classicResultSet = oFF.XWeakReferenceUtil
				.getWeakRef(classicResultSet);
		this.m_cursorResultSet = oFF.XWeakReferenceUtil.getWeakRef(origin
				.getCursorResultSet());
		this.m_xvalue = oFF.XObjectExt.cloneIfNotNull(origin.getXValue());
		this.m_column = origin.getColumn();
		this.m_row = origin.getRow();
		this.m_maxAlertLevel = origin.getMaxAlertLevel();
		this.setExceptionSettings(origin.getExceptionSettings());
		this.setExceptionPriorities(origin.getExceptionPriorities());
		this.m_maxAlertLevelName = origin.getMaxAlertLevelName();
		this.m_valueType = origin.getValueType();
		this.m_queryDataCell = oFF.XWeakReferenceUtil.getWeakRef(origin
				.getDataCell());
		this.m_formattedValue = origin.getFormattedValue();
		this.m_formatString = origin.getFormatString();
		this.m_valueException = origin.getValueException();
		this.m_dataEntryEnabled = origin.isDataEntryEnabled();
		this.m_originalValueLock = origin.getOriginalValueLock();
		this.m_currencyUnit = oFF.RsCursorCurrencyUnit.createCopy(origin
				.getCurrencyUnit());
		this.m_decimalPlaces = origin.getDecimalPlaces();
		this.m_scalingFactor = origin.getScalingFactor();
		this.m_complexUnitIndex = origin.getUnitIndex();
		originPlanningCommandIds = origin.getPlanningCommandIds();
		if (oFF.notNull(originPlanningCommandIds)) {
			this.m_planningCommandIds = oFF.XListOfString
					.createFromReadOnlyList(originPlanningCommandIds);
		}
		readinessState = origin.getInputReadinessState();
		if (oFF.notNull(readinessState)) {
			this.m_inputReadinessIndex = readinessState.getIndex();
		}
	};
	oFF.RsDataCell.prototype.forceNewValue = function(forceNewValue) {
		var dataEntry = this.getDataEntry(true);
		if (oFF.notNull(dataEntry)) {
			dataEntry.forceNewValue(forceNewValue);
		}
	};
	oFF.RsDataCell.prototype.getColumn = function() {
		return this.m_column;
	};
	oFF.RsDataCell.prototype.getComponentType = function() {
		return oFF.OlapComponentType.RD_DATA_CELL;
	};
	oFF.RsDataCell.prototype.getCurrencyUnit = function() {
		return this.m_currencyUnit;
	};
	oFF.RsDataCell.prototype.getCurrencyUnitBase = function() {
		return this.m_currencyUnit;
	};
	oFF.RsDataCell.prototype.getResultSet = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_classicResultSet);
	};
	oFF.RsDataCell.prototype.getResultSetContainer = function() {
		var cursorResultSet = this.getCursorResultSet();
		var classicResultSet;
		if (oFF.notNull(cursorResultSet)) {
			return cursorResultSet.getResultSetContainer();
		}
		classicResultSet = this.getResultSet();
		if (oFF.notNull(classicResultSet)) {
			return classicResultSet.getResultSetContainer();
		}
		return null;
	};
	oFF.RsDataCell.prototype.getCursorResultSet = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_cursorResultSet);
	};
	oFF.RsDataCell.prototype.getDataCell = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_queryDataCell);
	};
	oFF.RsDataCell.prototype.getDataCellEntryDescription = function() {
		var entryCollection = this.getDataEntryCollectionInternal(false);
		return oFF.isNull(entryCollection) ? null : entryCollection
				.getDataCellEntryDescription();
	};
	oFF.RsDataCell.prototype.getDataEntry = function(createNew) {
		return this.getDataEntryCheckEnabled(createNew, true);
	};
	oFF.RsDataCell.prototype.getDataEntryCheckEnabledWithAssert = function() {
		var dataEntry = this.getDataEntryCheckEnabled(true, true);
		oFF.XObjectExt.checkNotNull(dataEntry, "DataCell is not inputEnabled");
		return dataEntry;
	};
	oFF.RsDataCell.prototype.getDataEntryCheckEnabled = function(createNew,
			checkDataEntryEnabled) {
		if (checkDataEntryEnabled && !this.isDataEntryEnabled()) {
			return null;
		}
		if (oFF.isNull(this.m_dataEntry)) {
			this.m_dataEntry = this.getDataEntryInternal(createNew);
		}
		return this.m_dataEntry;
	};
	oFF.RsDataCell.prototype.getDataEntryCollectionInternal = function(
			createNew) {
		var resultSetContainer = this.getResultSetContainer();
		if (oFF.isNull(resultSetContainer)) {
			return null;
		}
		if (createNew || resultSetContainer.hasDataEntryCollection()) {
			return resultSetContainer.getDataEntryCollection();
		}
		return null;
	};
	oFF.RsDataCell.prototype.getDataEntryInternal = function(createNew) {
		var dataEntryCollection = this
				.getDataEntryCollectionInternal(createNew);
		if (oFF.isNull(dataEntryCollection)) {
			return null;
		}
		if (createNew) {
			return dataEntryCollection.getDataEntry(this.m_column, this.m_row,
					this);
		}
		return dataEntryCollection.getDataEntryIfExisting(this.m_column,
				this.m_row, this);
	};
	oFF.RsDataCell.prototype.getDateTime = function() {
		var dataEntry;
		this.assertValueException();
		dataEntry = this.getDataEntry(false);
		if (oFF.isNull(dataEntry)) {
			this.assertValueType(oFF.XValueType.DATE_TIME);
			return this.m_xvalue;
		}
		return dataEntry.getDateTime();
	};
	oFF.RsDataCell.prototype.getDate = function() {
		var dataEntry;
		this.assertValueException();
		dataEntry = this.getDataEntry(false);
		if (oFF.isNull(dataEntry)) {
			this.assertValueType(oFF.XValueType.DATE);
			return this.m_xvalue;
		}
		return dataEntry.getDate();
	};
	oFF.RsDataCell.prototype.getDecimalPlaces = function() {
		return this.m_decimalPlaces;
	};
	oFF.RsDataCell.prototype.getDouble = function() {
		var dataEntry;
		var valueType;
		this.assertValueException();
		dataEntry = this.getDataEntry(false);
		if (oFF.isNull(dataEntry)) {
			if (oFF.isNull(this.m_xvalue)) {
				return 0;
			}
			valueType = this.m_xvalue.getValueType();
			if (!valueType.isNumber()) {
				oFF.noSupport();
			}
			return this.m_xvalue.getDouble();
		}
		return dataEntry.getDouble();
	};
	oFF.RsDataCell.prototype.getExceptionPriorities = function() {
		return this.m_exceptionPriorities;
	};
	oFF.RsDataCell.prototype.getExceptionSettingPriorityByName = function(
			exceptionSettingName) {
		return this.m_exceptionPriorities.getByKey(exceptionSettingName);
	};
	oFF.RsDataCell.prototype.getExceptionSettings = function() {
		return this.m_exceptionSettings;
	};
	oFF.RsDataCell.prototype.getExceptionSettingValueByName = function(
			exceptionSettingName) {
		return oFF.isNull(this.m_exceptionSettings) ? null
				: this.m_exceptionSettings.getByKey(exceptionSettingName);
	};
	oFF.RsDataCell.prototype.getFormatString = function() {
		return this.m_formatString;
	};
	oFF.RsDataCell.prototype.getFormattedValue = function() {
		return this.m_formattedValue;
	};
	oFF.RsDataCell.prototype.getUnitIndex = function() {
		return this.m_complexUnitIndex;
	};
	oFF.RsDataCell.prototype.setUnitIndex = function(unitIndex) {
		this.m_complexUnitIndex = unitIndex;
	};
	oFF.RsDataCell.prototype.getInputReadinessState = function() {
		var cursorResultSet;
		if (this.getQueryModel() === null
				|| !this.getQueryModel().getQueryManager()
						.supportsInputReadinessStates()) {
			return null;
		}
		cursorResultSet = this.getCursorResultSet();
		return oFF.isNull(cursorResultSet) ? null : cursorResultSet
				.getInputReadinessStateAt(this.m_inputReadinessIndex);
	};
	oFF.RsDataCell.prototype.getMaxAlertLevel = function() {
		return this.m_maxAlertLevel;
	};
	oFF.RsDataCell.prototype.getMaxAlertLevelName = function() {
		return this.m_maxAlertLevelName;
	};
	oFF.RsDataCell.prototype.getNewValueExternal = function() {
		var dataEntry = this.getDataEntry(false);
		if (oFF.isNull(dataEntry)) {
			return this.getString();
		}
		return dataEntry.getNewValueExternal();
	};
	oFF.RsDataCell.prototype.getOriginalValueLock = function() {
		return this.m_originalValueLock;
	};
	oFF.RsDataCell.prototype.getPlanningCommand = function() {
		var dataEntry = this.getDataEntryCheckEnabled(false, false);
		return oFF.isNull(dataEntry) ? null : dataEntry.getPlanningCommand();
	};
	oFF.RsDataCell.prototype.getPlanningCommandIds = function() {
		if (oFF.isNull(this.m_planningCommandIds)
				|| this.m_planningCommandIds.isEmpty()) {
			return null;
		}
		return this.m_planningCommandIds;
	};
	oFF.RsDataCell.prototype.getPlanningCommandIdsBase = function() {
		if (oFF.isNull(this.m_planningCommandIds)) {
			this.m_planningCommandIds = oFF.XListOfString.create();
		}
		return this.m_planningCommandIds;
	};
	oFF.RsDataCell.prototype.getPriority = function() {
		var dataEntry = this.getDataEntryCheckEnabled(false, false);
		return oFF.isNull(dataEntry) ? 0 : dataEntry.getPriority();
	};
	oFF.RsDataCell.prototype.getProcessingOrder = function() {
		var dataEntry = this.getDataEntryCheckEnabled(false, false);
		return oFF.isNull(dataEntry) ? 0 : dataEntry.getProcessingOrder();
	};
	oFF.RsDataCell.prototype.getQueryModel = function() {
		var cursorResultSet = this.getCursorResultSet();
		var classicResultSet;
		if (oFF.notNull(cursorResultSet)) {
			return cursorResultSet.getQueryModel();
		}
		classicResultSet = this.getResultSet();
		if (oFF.notNull(classicResultSet)) {
			return classicResultSet.getQueryModel();
		}
		return null;
	};
	oFF.RsDataCell.prototype.getRow = function() {
		return this.m_row;
	};
	oFF.RsDataCell.prototype.getScalingFactor = function() {
		return this.m_scalingFactor;
	};
	oFF.RsDataCell.prototype.getStringRepresentation = function() {
		return oFF.isNull(this.m_xvalue) ? null : this.getXValue()
				.getStringRepresentation();
	};
	oFF.RsDataCell.prototype.getString = function() {
		var dataEntry;
		var sv;
		this.assertValueException();
		dataEntry = this.getDataEntry(false);
		if (oFF.isNull(dataEntry)) {
			this.assertValueType(oFF.XValueType.STRING);
			sv = this.m_xvalue;
			return sv.getString();
		}
		return dataEntry.getString();
	};
	oFF.RsDataCell.prototype.getValue = function() {
		return this.getDouble();
	};
	oFF.RsDataCell.prototype.getValueException = function() {
		return this.m_valueException;
	};
	oFF.RsDataCell.prototype.getValueType = function() {
		return this.m_valueType;
	};
	oFF.RsDataCell.prototype.getXValue = function() {
		var dataEntry = this.getDataEntry(false);
		return oFF.isNull(dataEntry) ? this.m_xvalue : dataEntry.getXValue();
	};
	oFF.RsDataCell.prototype.isDataEntryEnabled = function() {
		var queryManager;
		var inputState;
		if (this.getQueryModel() === null) {
			return this.m_dataEntryEnabled;
		}
		queryManager = this.getQueryModel().getQueryManager();
		if (queryManager.supportsInputReadinessStates()) {
			inputState = this.getInputReadinessState();
			if (oFF.isNull(inputState)) {
				return false;
			}
			if (queryManager.isPublicVersionEditPossible()
					&& inputState
							.hasSingleInputReadinessType(oFF.InputReadinessType.PUBLIC_VERSION)) {
				return true;
			}
			return inputState.isInputEnabled();
		}
		return this.m_dataEntryEnabled;
	};
	oFF.RsDataCell.prototype.isNewValueForced = function() {
		var dataEntry = this.getDataEntry(false);
		return oFF.isNull(dataEntry) ? false : dataEntry.isNewValueForced();
	};
	oFF.RsDataCell.prototype.isValueChanged = function() {
		var dataEntry = this.getDataEntry(false);
		return oFF.isNull(dataEntry) ? false : dataEntry.isValueChanged();
	};
	oFF.RsDataCell.prototype.isValueLockChanged = function() {
		var dataEntry = this.getDataEntry(false);
		return oFF.isNull(dataEntry) ? false : dataEntry.isValueLockChanged();
	};
	oFF.RsDataCell.prototype.isValueLocked = function() {
		var dataEntry = this.getDataEntry(false);
		if (oFF.isNull(dataEntry)) {
			return this.getOriginalValueLock();
		}
		return dataEntry.isValueLocked();
	};
	oFF.RsDataCell.prototype.releaseObject = function() {
		this.m_dataEntry = oFF.XObjectExt.release(this.m_dataEntry);
		this.m_cursorResultSet = oFF.XObjectExt.release(this.m_cursorResultSet);
		this.m_classicResultSet = oFF.XObjectExt
				.release(this.m_classicResultSet);
		this.m_xvalue = oFF.XObjectExt.release(this.m_xvalue);
		this.m_currencyUnit = oFF.XObjectExt.release(this.m_currencyUnit);
		this.m_exceptionSettings = oFF.XObjectExt
				.release(this.m_exceptionSettings);
		this.m_exceptionPriorities = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_exceptionPriorities);
		this.m_planningCommandIds = oFF.XObjectExt
				.release(this.m_planningCommandIds);
		this.m_queryDataCell = oFF.XObjectExt.release(this.m_queryDataCell);
		this.m_valueType = null;
		this.m_formatString = null;
		this.m_maxAlertLevel = null;
		this.m_maxAlertLevelName = null;
		this.m_valueException = null;
		this.m_formattedValue = null;
		oFF.XAbstractValue.prototype.releaseObject.call(this);
	};
	oFF.RsDataCell.prototype.reset = function() {
		this.m_dataEntry = null;
		this.getCurrencyUnitBase().reset();
	};
	oFF.RsDataCell.prototype.resetAllChanges = function() {
		if (oFF.notNull(this.m_dataEntry)) {
			this.m_dataEntry.resetAllChanges();
			this.m_dataEntry = null;
		}
	};
	oFF.RsDataCell.prototype.resetNewValue = function() {
		var dataEntry = this.getDataEntry(false);
		if (oFF.notNull(dataEntry)) {
			dataEntry.resetNewValue();
		}
	};
	oFF.RsDataCell.prototype.resetValueLock = function() {
		var dataEntry = this.getDataEntry(false);
		if (oFF.notNull(dataEntry)) {
			dataEntry.resetValueLock();
		}
	};
	oFF.RsDataCell.prototype.setColumn = function(column) {
		this.m_column = column;
	};
	oFF.RsDataCell.prototype.setDataCellEntryDescription = function(description) {
		var entryCollection = this.getDataEntryCollectionInternal(true);
		if (oFF.notNull(entryCollection)) {
			entryCollection.setDataCellEntryDescription(description);
		}
	};
	oFF.RsDataCell.prototype.setDataEntryEnabled = function(dataEntryEnabled) {
		this.m_dataEntryEnabled = dataEntryEnabled;
	};
	oFF.RsDataCell.prototype.setDateTime = function(value) {
		var dataEntry = this.getDataEntryCheckEnabledWithAssert();
		dataEntry.setDateTime(value);
		this.updateValueException(value);
	};
	oFF.RsDataCell.prototype.setDate = function(value) {
		var dataEntry = this.getDataEntryCheckEnabledWithAssert();
		dataEntry.setDate(value);
		this.updateValueException(value);
	};
	oFF.RsDataCell.prototype.setDecimalPlaces = function(decimalPlaces) {
		this.m_decimalPlaces = decimalPlaces;
	};
	oFF.RsDataCell.prototype.setDouble = function(value) {
		var dataEntry = this.getDataEntryCheckEnabledWithAssert();
		dataEntry.setDouble(value);
		this.setValueException(oFF.ValueException.NORMAL);
	};
	oFF.RsDataCell.prototype.setExceptionPriorities = function(
			exceptionPriorities) {
		if (oFF.isNull(exceptionPriorities)) {
			this.m_exceptionPriorities = null;
		} else {
			this.m_exceptionPriorities = exceptionPriorities
					.createMapByStringCopy();
		}
	};
	oFF.RsDataCell.prototype.setExceptionSettings = function(exceptionSettings) {
		if (oFF.isNull(exceptionSettings)) {
			this.m_exceptionSettings = null;
		} else {
			this.m_exceptionSettings = exceptionSettings
					.createMapOfStringByStringCopy();
		}
	};
	oFF.RsDataCell.prototype.setFormatString = function(formatString) {
		this.m_formatString = formatString;
	};
	oFF.RsDataCell.prototype.setFormattedValue = function(value) {
		this.m_formattedValue = value;
	};
	oFF.RsDataCell.prototype.setInitialValue = function(value) {
		this.m_xvalue = value;
	};
	oFF.RsDataCell.prototype.setInputReadinessIndex = function(index) {
		this.m_inputReadinessIndex = index;
	};
	oFF.RsDataCell.prototype.setMaxAlertLevel = function(alertLevel) {
		this.m_maxAlertLevel = alertLevel;
	};
	oFF.RsDataCell.prototype.setMaxAlertLevelName = function(name) {
		this.m_maxAlertLevelName = name;
	};
	oFF.RsDataCell.prototype.setNewValueExternal = function(valueExternal) {
		var dataEntry = this.getDataEntryCheckEnabledWithAssert();
		dataEntry.setNewValueExternal(valueExternal);
	};
	oFF.RsDataCell.prototype.setOriginalValueLock = function(valueLock) {
		this.m_originalValueLock = valueLock;
	};
	oFF.RsDataCell.prototype.setPlanningCommand = function(planningCommand) {
		var existingDataEntry;
		var checkDataEntryEnabled;
		var commandType;
		var planningAction;
		var actionForQueryIdentifier;
		var planningActionType;
		var planningCommandIds;
		var planningCommandId;
		var dataEntry;
		if (oFF.isNull(planningCommand)) {
			existingDataEntry = this.getDataEntry(false);
			if (oFF.notNull(existingDataEntry)) {
				existingDataEntry.setPlanningCommand(null);
			}
			return;
		}
		checkDataEntryEnabled = true;
		commandType = planningCommand.getCommandType();
		if (commandType === oFF.PlanningCommandType.PLANNING_ACTION) {
			planningAction = planningCommand;
			actionForQueryIdentifier = planningAction
					.getActionForQueryIdentifier();
			planningActionType = actionForQueryIdentifier.getActionType();
			if (planningActionType === oFF.PlanningActionType.QUERY_SINGLE) {
				checkDataEntryEnabled = false;
			} else {
				if (planningActionType === oFF.PlanningActionType.DATA_ENTRY) {
					planningCommandIds = this.getPlanningCommandIds();
					if (oFF.isNull(planningCommandIds)) {
						return;
					}
					planningCommandId = actionForQueryIdentifier.getActionId();
					if (!planningCommandIds.contains(planningCommandId)) {
						return;
					}
				}
			}
		}
		dataEntry = this.getDataEntryCheckEnabled(true, checkDataEntryEnabled);
		dataEntry.setPlanningCommand(planningCommand);
	};
	oFF.RsDataCell.prototype.setPriority = function(priority) {
		var dataEntry = this.getDataEntryCheckEnabled(true, false);
		dataEntry.setPriority(priority);
	};
	oFF.RsDataCell.prototype.setProcessingOrder = function(processingOrder) {
		var dataEntry = this.getDataEntryCheckEnabled(true, false);
		dataEntry.setProcessingOrder(processingOrder);
	};
	oFF.RsDataCell.prototype.setQueryDataCellReference = function(reference) {
		var queryModel = this.getQueryModel();
		var queryDataCell;
		if (oFF.notNull(queryModel)) {
			queryDataCell = queryModel.getQueryDataCell(reference);
			this.m_queryDataCell = oFF.XWeakReferenceUtil
					.getWeakRef(queryDataCell);
		}
	};
	oFF.RsDataCell.prototype.setRow = function(row) {
		this.m_row = row;
	};
	oFF.RsDataCell.prototype.setScalingFactor = function(scalingFactor) {
		this.m_scalingFactor = scalingFactor;
	};
	oFF.RsDataCell.prototype.setString = function(value) {
		var dataEntry = this.getDataEntryCheckEnabledWithAssert();
		dataEntry.setString(value);
		this
				.setValueException(oFF.isNull(value) ? oFF.ValueException.NULL_VALUE
						: oFF.ValueException.NORMAL);
	};
	oFF.RsDataCell.prototype.updateValueException = function(value) {
		this
				.setValueException(oFF.isNull(value) ? oFF.ValueException.NULL_VALUE
						: oFF.ValueException.NORMAL);
	};
	oFF.RsDataCell.prototype.setValueException = function(valueException) {
		this.m_valueException = valueException;
	};
	oFF.RsDataCell.prototype.setValueLock = function(lock) {
		var dataEntry = this.getDataEntryCheckEnabledWithAssert();
		dataEntry.setValueLock(lock);
	};
	oFF.RsDataCell.prototype.setValueType = function(valueType) {
		this.m_valueType = valueType;
	};
	oFF.RsDataCell.prototype.setXValue = function(value) {
		var dataEntry = this.getDataEntryCheckEnabledWithAssert();
		dataEntry.setXValue(value);
	};
	oFF.RsDataCell.prototype.assertValueException = function() {
		if (this.getValueException() === oFF.ValueException.UNDEFINED
				|| this.getValueException() === oFF.ValueException.NULL_VALUE) {
			oFF.noSupport();
		}
	};
	oFF.RsDataCell.prototype.getProcessingType = function() {
		var dataEntry = this.getDataEntryCheckEnabled(false, false);
		return oFF.isNull(dataEntry) ? null : dataEntry.getProcessingType();
	};
	oFF.RsDataCell.prototype.setProcessingType = function(
			dataEntryProcessingType) {
		var dataEntry = this.getDataEntryCheckEnabled(true, false);
		dataEntry.setProcessingType(dataEntryProcessingType);
	};
	oFF.RsDataCell.prototype.getSession = function() {
		var queryModel = this.getQueryModel();
		return oFF.isNull(queryModel) ? null : queryModel.getSession();
	};
	oFF.RsDataCell.prototype.getApplication = function() {
		var queryModel = this.getQueryModel();
		return oFF.isNull(queryModel) ? null : queryModel.getApplication();
	};
	oFF.RsDataCell.prototype.resetValue = oFF.noSupport;
	oFF.RsDataCell.prototype.toString = function() {
		return oFF.isNull(this.m_formattedValue) ? "DataCell"
				: this.m_formattedValue;
	};
	oFF.RsDataCell.prototype.getComplexUnit = function() {
		var unitsSettings;
		var rsCursor;
		if (this.m_complexUnitIndex < 0) {
			return null;
		}
		unitsSettings = null;
		rsCursor = this.getCursorResultSet();
		if (oFF.notNull(rsCursor)) {
			unitsSettings = rsCursor.getComplexUnitsSetting();
		}
		return oFF.isNull(unitsSettings) ? null : unitsSettings
				.get(this.m_complexUnitIndex);
	};
	oFF.RsAxis = function() {
	};
	oFF.RsAxis.prototype = new oFF.XObject();
	oFF.RsAxis.create = function(resultset, axisType, cursor) {
		var object = new oFF.RsAxis();
		object.setupExt(resultset, axisType, cursor);
		return object;
	};
	oFF.RsAxis.prototype.m_resultset = null;
	oFF.RsAxis.prototype.m_axisType = null;
	oFF.RsAxis.prototype.m_dataCount = 0;
	oFF.RsAxis.prototype.m_tuplesCount = 0;
	oFF.RsAxis.prototype.m_tuplesCountTotal = 0;
	oFF.RsAxis.prototype.m_tupleElementCount = 0;
	oFF.RsAxis.prototype.m_cursor = null;
	oFF.RsAxis.prototype.m_tuples = null;
	oFF.RsAxis.prototype.m_indexLookupViaName = null;
	oFF.RsAxis.prototype.m_indexLookupViaType = null;
	oFF.RsAxis.prototype.m_rsDimensions = null;
	oFF.RsAxis.prototype.setupExt = function(resultset, axisType, cursor) {
		this.setResultSet(resultset);
		this.m_axisType = axisType;
		this.m_cursor = oFF.XWeakReferenceUtil.getWeakRef(cursor);
		this.m_rsDimensions = cursor.getRsDimensions();
		this.m_tupleElementCount = cursor.getTupleElementsCount();
		this.m_tuplesCount = cursor.getTuplesCount();
		this.m_tuplesCountTotal = cursor.getTuplesCountTotal();
		this.m_dataCount = cursor.getDataCount();
	};
	oFF.RsAxis.prototype.releaseObject = function() {
		this.m_tuples = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_tuples);
		this.m_indexLookupViaName = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_indexLookupViaName);
		this.m_indexLookupViaType = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_indexLookupViaType);
		this.m_resultset = null;
		this.m_axisType = null;
		this.m_cursor = null;
		this.m_dataCount = -1;
		this.m_tuplesCount = -1;
		this.m_tuplesCountTotal = -1;
		this.m_tupleElementCount = -1;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RsAxis.prototype.createCursorAccessor = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_cursor);
	};
	oFF.RsAxis.prototype.getDataCount = function() {
		return this.m_dataCount;
	};
	oFF.RsAxis.prototype.getTuplesCount = function() {
		return this.m_tuplesCount;
	};
	oFF.RsAxis.prototype.getTuplesCountTotal = function() {
		return this.m_tuplesCountTotal;
	};
	oFF.RsAxis.prototype.getTupleElementsCount = function() {
		return this.m_tupleElementCount;
	};
	oFF.RsAxis.prototype.getTupleAt = function(index) {
		this.setupStorage();
		return this.m_tuples.get(index);
	};
	oFF.RsAxis.prototype.getAllMembers = function(dimension) {
		var selectName;
		var udhWithThisDimensionIncluded = dimension
				.getUDHWithThisDimensionIncluded();
		var indexByName;
		var memberMap;
		var iterator;
		var list;
		var list2;
		var tupleSize;
		var idxTuple;
		if (oFF.notNull(udhWithThisDimensionIncluded)
				&& udhWithThisDimensionIncluded.isActive()) {
			selectName = udhWithThisDimensionIncluded.getName();
		} else {
			selectName = dimension.getName();
		}
		indexByName = oFF.XCollectionUtils.getIndexByName(this.m_rsDimensions,
				selectName);
		if (indexByName === -1) {
			return null;
		}
		memberMap = this.setupStorage();
		if (oFF.notNull(memberMap)) {
			iterator = memberMap.get(indexByName).getIterator();
			list = oFF.XList.create();
			while (iterator.hasNext()) {
				list.add(iterator.next());
			}
			oFF.XObjectExt.release(iterator);
			return list;
		} else {
			if (oFF.notNull(this.m_tuples)) {
				list2 = oFF.XList.create();
				tupleSize = this.m_tuples.size();
				for (idxTuple = 0; idxTuple < tupleSize; idxTuple++) {
					list2.add(this.m_tuples.get(idxTuple)
							.getTupleElementByDimension(dimension)
							.getDimensionMember());
				}
				return list2;
			}
		}
		return null;
	};
	oFF.RsAxis.prototype.getTuplesIterator = function() {
		this.setupStorage();
		return this.m_tuples.getIterator();
	};
	oFF.RsAxis.prototype.setupStorage = function() {
		var memberMap = null;
		var cursor;
		var dimensionsOnAxis;
		var dimIndex;
		var dimMemberMap;
		var elements;
		var positionOnAxis;
		var axisTuple;
		var tupleElementPosition;
		var currentMemberType;
		var isResultMember;
		var hierarchyNavigationKey;
		var dimensionMemberKey;
		var lastTupleElement;
		var lastDimensionMember;
		var lastDimMemberName;
		var isNewMemberName;
		var lastDimMemberType;
		var isNewMemberType;
		var allResponseMembers;
		var dimensionMember;
		var nodeId;
		var tupleElement;
		var k;
		if (oFF.isNull(this.m_tuples)) {
			this.m_tuples = oFF.XList.create();
			cursor = this.createCursorAccessor();
			cursor.setTupleCursorBeforeStart();
			dimensionsOnAxis = cursor.getTupleElementsCount();
			memberMap = oFF.XArray.create(dimensionsOnAxis);
			for (dimIndex = 0; dimIndex < dimensionsOnAxis; dimIndex++) {
				dimMemberMap = oFF.XLinkedHashMapByString.create();
				memberMap.set(dimIndex, dimMemberMap);
			}
			elements = oFF.XArray.create(dimensionsOnAxis);
			for (positionOnAxis = 0; cursor.hasNextTuple(); positionOnAxis++) {
				cursor.nextTuple();
				axisTuple = oFF.RsAxisTuple.create(this, positionOnAxis);
				for (tupleElementPosition = 0; cursor.hasNextTupleElement(); tupleElementPosition++) {
					cursor.nextTupleElement();
					currentMemberType = cursor.getDimensionMemberType();
					isResultMember = currentMemberType === oFF.MemberType.RESULT
							|| currentMemberType === oFF.MemberType.CONDITION_OTHERS_RESULT
							|| currentMemberType === oFF.MemberType.CONDITION_RESULT;
					hierarchyNavigationKey = cursor
							.getValueOfHierarchyNavigationKey();
					if (cursor.getDimensionMemberNameValueException() === oFF.ValueException.NULL_VALUE) {
						dimensionMemberKey = "$$NullKey$$";
					} else {
						if (!isResultMember
								&& oFF.notNull(hierarchyNavigationKey)) {
							dimensionMemberKey = hierarchyNavigationKey;
						} else {
							dimensionMemberKey = cursor
									.getDimensionMemberName();
						}
					}
					lastTupleElement = elements.get(tupleElementPosition);
					if (oFF.notNull(lastTupleElement)) {
						lastDimensionMember = lastTupleElement
								.getDimensionMember();
						lastDimMemberName = lastDimensionMember.getName();
						isNewMemberName = !oFF.XString.isEqual(
								dimensionMemberKey, lastDimMemberName);
						lastDimMemberType = lastDimensionMember.getMemberType();
						isNewMemberType = lastDimMemberType !== currentMemberType;
						if (isNewMemberName
								|| isNewMemberType
								|| lastDimensionMember
										.getDimensionMemberNameValueException() === oFF.ValueException.NULL_VALUE) {
							lastTupleElement = null;
						}
						if (isNewMemberType && !isNewMemberName
								&& isResultMember) {
							dimensionMemberKey = currentMemberType.getName();
						}
					} else {
						if (isResultMember) {
							dimensionMemberKey = currentMemberType.getName();
						}
					}
					if (oFF.isNull(lastTupleElement)) {
						allResponseMembers = memberMap
								.get(tupleElementPosition);
						dimensionMember = allResponseMembers
								.getByKey(dimensionMemberKey);
						if (oFF.isNull(dimensionMember)) {
							dimensionMember = cursor
									.createDimensionMemberFromCurrentPosition();
							allResponseMembers.put(dimensionMemberKey,
									dimensionMember);
						}
						nodeId = cursor.getNodeId();
						if (currentMemberType.isTypeOf(oFF.MemberType.RESULT)
								&& oFF.XStringUtils.isNullOrEmpty(nodeId)) {
							nodeId = cursor.getDimensionMemberName();
						}
						tupleElement = oFF.RsAxisTupleElement.create(this,
								nodeId, dimensionMember, tupleElementPosition,
								cursor.getDrillState(), cursor
										.getDisplayLevel(), cursor
										.getChildCount(), cursor
										.getAbsoluteLevel());
						tupleElement.setFirstTuple(axisTuple);
						tupleElement
								.setExceptionName(cursor.getExceptionName());
						tupleElement.setAlertLevel(cursor.getAlertLevel());
						elements.set(tupleElementPosition, tupleElement);
						for (k = tupleElementPosition + 1; k < dimensionsOnAxis; k++) {
							elements.set(k, null);
						}
					}
				}
				axisTuple.setTupleElements(elements.createArrayCopy());
				this.m_tuples.add(axisTuple);
			}
			this.setParentNodes();
		}
		return memberMap;
	};
	oFF.RsAxis.prototype.setParentNodes = function() {
		var cursor = this.createCursorAccessor();
		var idxTuple;
		var idxTupleElement;
		var parentIndex;
		var tupleElement;
		cursor.setTupleCursorToIndex(0);
		cursor.setTupleCursorBeforeStart();
		for (idxTuple = 0; cursor.hasNextTuple(); idxTuple++) {
			cursor.nextTuple();
			for (idxTupleElement = 0; cursor.hasNextTupleElement(); idxTupleElement++) {
				cursor.nextTupleElement();
				parentIndex = cursor.getParentNodeIndex();
				if (parentIndex > -1) {
					tupleElement = this.m_tuples.get(idxTuple).get(
							idxTupleElement);
					tupleElement.setParentNode(this.m_tuples.get(parentIndex)
							.get(idxTupleElement));
				}
			}
		}
	};
	oFF.RsAxis.prototype.getResultSet = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_resultset);
	};
	oFF.RsAxis.prototype.setResultSet = function(resultSet) {
		this.m_resultset = oFF.XWeakReferenceUtil.getWeakRef(resultSet);
	};
	oFF.RsAxis.prototype.getQueryModel = function() {
		return this.getResultSet().getQueryModel();
	};
	oFF.RsAxis.prototype.getEffectiveRsFields = function() {
		var effectiveFields = oFF.XList.create();
		var size = this.m_rsDimensions.size();
		var i;
		for (i = 0; i < size; i++) {
			effectiveFields.addAll(this.m_rsDimensions.get(i)
					.getResultSetFields());
		}
		return effectiveFields;
	};
	oFF.RsAxis.prototype.getType = function() {
		return this.m_axisType;
	};
	oFF.RsAxis.prototype.getDimensionPresentationKey = function(dimensionName,
			presentationType) {
		var buffer = oFF.XStringBuffer.create();
		buffer.append("[");
		buffer.append(dimensionName);
		buffer.append("].[");
		buffer.append(presentationType.getName());
		buffer.append("]");
		return buffer.toString();
	};
	oFF.RsAxis.prototype.getDimensionFieldKey = function(dimensionName,
			fieldName) {
		var buffer = oFF.XStringBuffer.create();
		buffer.append("[");
		buffer.append(dimensionName);
		buffer.append("].[");
		buffer.append(fieldName);
		buffer.append("]");
		return buffer.toString();
	};
	oFF.RsAxis.prototype.buildFieldIndex = function(buildByPresentation) {
		var dimCount;
		var indexPos;
		var idxDim;
		var dim;
		var resultSetAttributes;
		var attCount;
		var idxField;
		var attribute;
		var newKey;
		if (buildByPresentation) {
			this.m_indexLookupViaType = oFF.XHashMapByString.create();
		} else {
			this.m_indexLookupViaName = oFF.XHashMapByString.create();
		}
		dimCount = this.m_rsDimensions.size();
		indexPos = 0;
		for (idxDim = 0; idxDim < dimCount; idxDim++) {
			dim = this.m_rsDimensions.get(idxDim);
			resultSetAttributes = dim.getResultSetFields();
			attCount = resultSetAttributes.size();
			for (idxField = 0; idxField < attCount; idxField++) {
				attribute = resultSetAttributes.get(idxField);
				if (buildByPresentation) {
					newKey = this.getDimensionPresentationKey(dim.getName(),
							attribute.getPresentationType());
					this.m_indexLookupViaType.put(newKey, oFF.XIntegerValue
							.create(indexPos));
				} else {
					newKey = this.getDimensionFieldKey(dim.getName(), attribute
							.getName());
					this.m_indexLookupViaName.put(newKey, oFF.XIntegerValue
							.create(indexPos));
				}
				++indexPos;
			}
		}
	};
	oFF.RsAxis.prototype.getFieldIndexViaPresentation = function(dimensionName,
			presentationType) {
		var someKey;
		var indexObj;
		if (oFF.isNull(this.m_indexLookupViaType)) {
			this.buildFieldIndex(true);
		}
		someKey = this.getDimensionPresentationKey(dimensionName,
				presentationType);
		indexObj = this.m_indexLookupViaType.getByKey(someKey);
		return oFF.isNull(indexObj) ? -1 : indexObj.getInteger();
	};
	oFF.RsAxis.prototype.getFieldIndex = function(dimensionName, fieldName) {
		var someKey;
		var indexObj;
		if (oFF.isNull(this.m_indexLookupViaName)) {
			this.buildFieldIndex(false);
		}
		someKey = this.getDimensionFieldKey(dimensionName, fieldName);
		indexObj = this.m_indexLookupViaName.getByKey(someKey);
		return oFF.isNull(indexObj) ? -1 : indexObj.getInteger();
	};
	oFF.RsAxis.prototype.getSession = function() {
		return this.getApplication().getSession();
	};
	oFF.RsAxis.prototype.getApplication = function() {
		return this.getResultSet().getApplication();
	};
	oFF.RsAxis.prototype.getRsDimensions = function() {
		return this.m_rsDimensions;
	};
	oFF.RsAxis.prototype.setDrillState = function(tupleIndex, elementIndex,
			drillState) {
		var tuple = this.getTupleAt(tupleIndex);
		var element = tuple.get(elementIndex);
		element.setNextDrillState(drillState);
	};
	oFF.RsAxis.prototype.getDrillPath = function(tupleIndex, elementIndex) {
		var tuple = this.getTupleAt(tupleIndex);
		var element = tuple.get(elementIndex);
		return element.getDrillPath();
	};
	oFF.RsAxis.prototype.toString = function() {
		return this.getType().toString();
	};
	oFF.RsAxis.prototype.getNewLineCollection = function() {
		var resultSetContainer;
		if (this.getType() !== oFF.AxisType.ROWS) {
			return null;
		}
		if (oFF.isNull(this.m_resultset)) {
			return null;
		}
		resultSetContainer = this.getResultSet().getResultSetContainer();
		return oFF.isNull(resultSetContainer) ? null : resultSetContainer
				.getNewLineCollection();
	};
	oFF.RsAxis.prototype.getRsAxisDef = function() {
		return this;
	};
	oFF.RsAxis.prototype.getConvenienceCommands = function() {
		return this.getQueryModel().getConvenienceCommands();
	};
	oFF.RsCursorFieldValue = function() {
	};
	oFF.RsCursorFieldValue.prototype = new oFF.XObject();
	oFF.RsCursorFieldValue.create = function(field) {
		var object = new oFF.RsCursorFieldValue();
		object.m_field = field;
		return object;
	};
	oFF.RsCursorFieldValue.prototype.m_field = null;
	oFF.RsCursorFieldValue.prototype.m_formattedValue = null;
	oFF.RsCursorFieldValue.prototype.m_errorValue = null;
	oFF.RsCursorFieldValue.prototype.m_dateValue = null;
	oFF.RsCursorFieldValue.prototype.m_timeValue = null;
	oFF.RsCursorFieldValue.prototype.m_dateTimeValue = null;
	oFF.RsCursorFieldValue.prototype.m_timespanValue = null;
	oFF.RsCursorFieldValue.prototype.m_stringValue = null;
	oFF.RsCursorFieldValue.prototype.m_intValue = null;
	oFF.RsCursorFieldValue.prototype.m_longValue = null;
	oFF.RsCursorFieldValue.prototype.m_doubleValue = null;
	oFF.RsCursorFieldValue.prototype.m_booleanValue = null;
	oFF.RsCursorFieldValue.prototype.m_propertiesValue = null;
	oFF.RsCursorFieldValue.prototype.m_structureValue = null;
	oFF.RsCursorFieldValue.prototype.m_structureListValue = null;
	oFF.RsCursorFieldValue.prototype.m_lineStringValue = null;
	oFF.RsCursorFieldValue.prototype.m_multiLineStringValue = null;
	oFF.RsCursorFieldValue.prototype.m_polygonValue = null;
	oFF.RsCursorFieldValue.prototype.m_multiPolygonValue = null;
	oFF.RsCursorFieldValue.prototype.m_pointValue = null;
	oFF.RsCursorFieldValue.prototype.m_multiPointValue = null;
	oFF.RsCursorFieldValue.prototype.m_currentValue = null;
	oFF.RsCursorFieldValue.prototype.m_valueException = null;
	oFF.RsCursorFieldValue.prototype.releaseObject = function() {
		this.m_field = null;
		this.m_intValue = oFF.XObjectExt.release(this.m_intValue);
		this.m_longValue = oFF.XObjectExt.release(this.m_longValue);
		this.m_doubleValue = oFF.XObjectExt.release(this.m_doubleValue);
		this.m_booleanValue = oFF.XObjectExt.release(this.m_booleanValue);
		this.m_timeValue = oFF.XObjectExt.release(this.m_timeValue);
		this.m_stringValue = oFF.XObjectExt.release(this.m_stringValue);
		this.m_formattedValue = null;
		this.m_valueException = null;
		this.m_currentValue = null;
		this.m_dateValue = oFF.XObjectExt.release(this.m_dateValue);
		this.m_errorValue = oFF.XObjectExt.release(this.m_errorValue);
		this.m_dateTimeValue = oFF.XObjectExt.release(this.m_dateTimeValue);
		this.m_timespanValue = oFF.XObjectExt.release(this.m_timespanValue);
		this.m_propertiesValue = oFF.XObjectExt.release(this.m_propertiesValue);
		this.m_structureValue = oFF.XObjectExt.release(this.m_structureValue);
		this.m_lineStringValue = oFF.XObjectExt.release(this.m_lineStringValue);
		this.m_multiLineStringValue = oFF.XObjectExt
				.release(this.m_multiLineStringValue);
		this.m_polygonValue = oFF.XObjectExt.release(this.m_polygonValue);
		this.m_multiPolygonValue = oFF.XObjectExt
				.release(this.m_multiPolygonValue);
		this.m_pointValue = oFF.XObjectExt.release(this.m_pointValue);
		this.m_multiPointValue = oFF.XObjectExt.release(this.m_multiPointValue);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RsCursorFieldValue.prototype.getFormattedValue = function() {
		return this.m_formattedValue;
	};
	oFF.RsCursorFieldValue.prototype.setFormattedValue = function(
			formattedValue) {
		this.m_formattedValue = formattedValue;
	};
	oFF.RsCursorFieldValue.prototype.getDate = function() {
		return this.m_dateValue;
	};
	oFF.RsCursorFieldValue.prototype.setCurrentValue = function(currentValue) {
		this.m_currentValue = oFF.XWeakReferenceUtil.getWeakRef(currentValue);
	};
	oFF.RsCursorFieldValue.prototype.setDate = function(value) {
		this.m_dateValue = value;
		this.setCurrentValue(value);
	};
	oFF.RsCursorFieldValue.prototype.setTime = function(value) {
		this.m_timeValue = value;
		this.setCurrentValue(this.m_timeValue);
	};
	oFF.RsCursorFieldValue.prototype.getTime = function() {
		return this.m_timeValue;
	};
	oFF.RsCursorFieldValue.prototype.setDateTime = function(value) {
		this.m_dateTimeValue = value;
		this.setCurrentValue(this.m_dateTimeValue);
	};
	oFF.RsCursorFieldValue.prototype.getDateTime = function() {
		return this.m_dateTimeValue;
	};
	oFF.RsCursorFieldValue.prototype.getString = function() {
		return this.getValue().toString();
	};
	oFF.RsCursorFieldValue.prototype.setString = function(value) {
		if (oFF.isNull(this.m_stringValue)) {
			this.m_stringValue = oFF.XStringValue.create(value);
		} else {
			this.m_stringValue.setString(value);
		}
		this.setCurrentValue(this.m_stringValue);
	};
	oFF.RsCursorFieldValue.prototype.getInteger = function() {
		return oFF.isNull(this.m_intValue) ? 0 : this.m_intValue.getInteger();
	};
	oFF.RsCursorFieldValue.prototype.setInteger = function(value) {
		if (oFF.isNull(this.m_intValue)) {
			this.m_intValue = oFF.XIntegerValue.create(value);
		} else {
			this.m_intValue.setInteger(value);
		}
		this.setCurrentValue(this.m_intValue);
	};
	oFF.RsCursorFieldValue.prototype.getLong = function() {
		return oFF.isNull(this.m_longValue) ? 0 : this.m_longValue.getLong();
	};
	oFF.RsCursorFieldValue.prototype.setLong = function(value) {
		if (oFF.isNull(this.m_longValue)) {
			this.m_longValue = oFF.XLongValue.create(value);
		} else {
			this.m_longValue.setLong(value);
		}
		this.setCurrentValue(this.m_longValue);
	};
	oFF.RsCursorFieldValue.prototype.getDouble = function() {
		return oFF.isNull(this.m_doubleValue) ? 0 : this.m_doubleValue
				.getDouble();
	};
	oFF.RsCursorFieldValue.prototype.setDouble = function(value) {
		if (oFF.isNull(this.m_doubleValue)) {
			this.m_doubleValue = oFF.XDoubleValue.create(value);
		} else {
			this.m_doubleValue.setDouble(value);
		}
		this.setCurrentValue(this.m_doubleValue);
	};
	oFF.RsCursorFieldValue.prototype.getBoolean = function() {
		return oFF.isNull(this.m_booleanValue) ? false : this.m_booleanValue
				.getBoolean();
	};
	oFF.RsCursorFieldValue.prototype.setBoolean = function(value) {
		if (oFF.isNull(this.m_booleanValue)) {
			this.m_booleanValue = oFF.XBooleanValue.create(value);
		} else {
			this.m_booleanValue.setBoolean(value);
		}
		this.setCurrentValue(this.m_booleanValue);
	};
	oFF.RsCursorFieldValue.prototype.getGeometry = function() {
		return this.getValue();
	};
	oFF.RsCursorFieldValue.prototype.getPolygon = function() {
		return this.m_polygonValue;
	};
	oFF.RsCursorFieldValue.prototype.setPolygon = function(value) {
		this.m_polygonValue = value;
		this.setCurrentValue(this.m_polygonValue);
	};
	oFF.RsCursorFieldValue.prototype.getPoint = function() {
		return this.m_pointValue;
	};
	oFF.RsCursorFieldValue.prototype.setPoint = function(value) {
		this.m_pointValue = value;
		this.setCurrentValue(this.m_pointValue);
	};
	oFF.RsCursorFieldValue.prototype.getTimeSpan = function() {
		return this.m_timespanValue;
	};
	oFF.RsCursorFieldValue.prototype.setTimeSpan = function(value) {
		this.m_timespanValue = value;
		this.setCurrentValue(this.m_timespanValue);
	};
	oFF.RsCursorFieldValue.prototype.getPropertiesValue = function() {
		return this.m_propertiesValue;
	};
	oFF.RsCursorFieldValue.prototype.setPropertiesValue = function(properties) {
		this.m_propertiesValue = properties;
		this.setCurrentValue(this.m_propertiesValue);
	};
	oFF.RsCursorFieldValue.prototype.getStructureValue = function() {
		return this.m_structureValue;
	};
	oFF.RsCursorFieldValue.prototype.getStructureListValue = function() {
		return this.m_structureListValue;
	};
	oFF.RsCursorFieldValue.prototype.setStructureValue = function(value) {
		this.m_structureValue = value;
		this.setCurrentValue(this.m_structureValue);
	};
	oFF.RsCursorFieldValue.prototype.setStructureListValue = function(value) {
		this.m_structureListValue = value;
		this.setCurrentValue(this.m_structureListValue);
	};
	oFF.RsCursorFieldValue.prototype.getErrorValue = function() {
		return this.m_errorValue;
	};
	oFF.RsCursorFieldValue.prototype.setErrorValue = function(value) {
		this.m_errorValue = value;
		this.setCurrentValue(this.m_errorValue);
	};
	oFF.RsCursorFieldValue.prototype.getField = function() {
		return this.m_field;
	};
	oFF.RsCursorFieldValue.prototype.getValueType = function() {
		return this.m_field.getValueType();
	};
	oFF.RsCursorFieldValue.prototype.createFieldValueFromCurrentPosition = function() {
		var copy;
		if (oFF.isNull(this.m_currentValue)) {
			return oFF.QFactory.newFieldValueEmpty(this.m_field,
					this.m_valueException);
		}
		copy = this.getValue().clone();
		return oFF.QFactory.newFieldValue(this.m_field, this.m_valueException,
				copy, this.m_formattedValue);
	};
	oFF.RsCursorFieldValue.prototype.getValue = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_currentValue);
	};
	oFF.RsCursorFieldValue.prototype.getDimensionMember = oFF.noSupport;
	oFF.RsCursorFieldValue.prototype.getMultiPolygon = function() {
		return this.m_multiPolygonValue;
	};
	oFF.RsCursorFieldValue.prototype.setMultiPolygon = function(value) {
		this.m_multiPolygonValue = value;
		this.setCurrentValue(this.m_multiPolygonValue);
	};
	oFF.RsCursorFieldValue.prototype.getLineString = function() {
		return this.m_lineStringValue;
	};
	oFF.RsCursorFieldValue.prototype.setLineString = function(value) {
		this.m_lineStringValue = value;
		this.setCurrentValue(this.m_lineStringValue);
	};
	oFF.RsCursorFieldValue.prototype.getMultiLineString = function() {
		return this.m_multiLineStringValue;
	};
	oFF.RsCursorFieldValue.prototype.setMultiLineString = function(value) {
		this.m_multiLineStringValue = value;
		this.setCurrentValue(this.m_multiLineStringValue);
	};
	oFF.RsCursorFieldValue.prototype.getNull = oFF.noSupport;
	oFF.RsCursorFieldValue.prototype.setNullByType = function(nullValueType) {
		this.setCurrentValue(oFF.XValueAccess.createWithType(nullValueType)
				.getValue());
	};
	oFF.RsCursorFieldValue.prototype.getValueException = function() {
		return this.m_valueException;
	};
	oFF.RsCursorFieldValue.prototype.setValueException = function(
			valueException) {
		this.m_valueException = valueException;
	};
	oFF.RsCursorFieldValue.prototype.getMultiPoint = function() {
		return this.m_multiPointValue;
	};
	oFF.RsCursorFieldValue.prototype.setMultiPoint = function(value) {
		this.m_multiPointValue = value;
		this.setCurrentValue(this.m_multiPointValue);
	};
	oFF.RsCursorFieldValue.prototype.hasValue = oFF.noSupport;
	oFF.RsCursorFieldValue.prototype.parseString = oFF.noSupport;
	oFF.RsCursorFieldValue.prototype.copyFrom = oFF.noSupport;
	oFF.RsCursorFieldValue.prototype.setXValue = function(value) {
		this.copyFrom(oFF.XValueAccess.createWithValue(value));
	};
	oFF.ResultSetContainer = function() {
	};
	oFF.ResultSetContainer.prototype = new oFF.DfRsSyncAction();
	oFF.ResultSetContainer.MAX_RECORDS_DEFAULT = -1;
	oFF.ResultSetContainer.create = function(manager, template) {
		var rsContainer = new oFF.ResultSetContainer();
		rsContainer.setupContainer(manager, null, null, null, template);
		return rsContainer;
	};
	oFF.ResultSetContainer.createWithRequest = function(queryManagerBase,
			resultSetProviderFactory, request, rsDefQueryModel) {
		var rsContainer = new oFF.ResultSetContainer();
		rsContainer.setupContainer(queryManagerBase, resultSetProviderFactory,
				request, rsDefQueryModel, null);
		return rsContainer;
	};
	oFF.ResultSetContainer.prototype.m_resultSetProviderFactory = null;
	oFF.ResultSetContainer.prototype.m_request = null;
	oFF.ResultSetContainer.prototype.m_classicResultSet = null;
	oFF.ResultSetContainer.prototype.m_cursorResultSet = null;
	oFF.ResultSetContainer.prototype.m_cursorResultSetInSync = null;
	oFF.ResultSetContainer.prototype.m_offsetRows = 0;
	oFF.ResultSetContainer.prototype.m_offsetColumns = 0;
	oFF.ResultSetContainer.prototype.m_maxRows = 0;
	oFF.ResultSetContainer.prototype.m_maxColumns = 0;
	oFF.ResultSetContainer.prototype.m_maxResultRecords = 0;
	oFF.ResultSetContainer.prototype.m_resultSetPersistenceSchema = null;
	oFF.ResultSetContainer.prototype.m_resultSetPersistenceTable = null;
	oFF.ResultSetContainer.prototype.m_resultSetPersistenceIdentifier = null;
	oFF.ResultSetContainer.prototype.m_suppressKeyfigureCalculation = false;
	oFF.ResultSetContainer.prototype.m_serializedView = null;
	oFF.ResultSetContainer.prototype.m_serializedCube = null;
	oFF.ResultSetContainer.prototype.m_dataRefreshEnabled = null;
	oFF.ResultSetContainer.prototype.m_executeRequestOnOldResultSet = false;
	oFF.ResultSetContainer.prototype.m_isResultSetTransportEnabled = false;
	oFF.ResultSetContainer.prototype.m_dataEntryCollection = null;
	oFF.ResultSetContainer.prototype.m_newLineCollection = null;
	oFF.ResultSetContainer.prototype.m_resultSetId = null;
	oFF.ResultSetContainer.prototype.m_resultSetIdSet = false;
	oFF.ResultSetContainer.prototype.m_rsDefQueryModel = null;
	oFF.ResultSetContainer.prototype.m_currentSyncType = null;
	oFF.ResultSetContainer.prototype.m_listener = null;
	oFF.ResultSetContainer.prototype.m_customIdentifier = null;
	oFF.ResultSetContainer.prototype.m_activeRemoteQueries = null;
	oFF.ResultSetContainer.prototype.m_isRemotePreQuery = false;
	oFF.ResultSetContainer.prototype.setupContainer = function(queryManager,
			resultSetProviderFactory, request, rsDefQueryModel, template) {
		oFF.DfRsSyncAction.prototype.setupSynchronizingObject.call(this,
				queryManager);
		this.m_rsDefQueryModel = rsDefQueryModel;
		if (oFF.isNull(template)) {
			this.m_offsetRows = 0;
			this.m_offsetColumns = 0;
			this.m_maxRows = -1;
			this.m_maxColumns = -1;
			this.m_maxResultRecords = oFF.ResultSetContainer.MAX_RECORDS_DEFAULT;
			this.m_isResultSetTransportEnabled = true;
			this.m_dataRefreshEnabled = oFF.ActionChoice.OFF;
		} else {
			this.m_offsetRows = template.getOffsetRows();
			this.m_offsetColumns = template.getOffsetColumns();
			this.m_maxRows = template.getMaxRows();
			this.m_maxColumns = template.getMaxColumns();
			this.m_maxResultRecords = template.getMaxResultRecords();
			this.m_isResultSetTransportEnabled = template
					.isResultSetTransportEnabled();
			this.m_resultSetPersistenceTable = template
					.getResultSetPersistenceTable();
			this.m_resultSetPersistenceIdentifier = template
					.getResultSetPersistenceIdentifier();
			this.m_resultSetPersistenceSchema = template
					.getResultSetPersistenceSchema();
			this.m_executeRequestOnOldResultSet = template
					.getExecuteRequestOnOldResultSet();
			this.m_dataRefreshEnabled = template.getDataRefreshEnabled();
			this.m_serializedView = template.getSerializedView();
			this.m_serializedCube = template.getSerializedCube();
		}
		this.m_resultSetProviderFactory = oFF.XWeakReferenceUtil
				.getWeakRef(resultSetProviderFactory);
		this.m_request = oFF.XWeakReferenceUtil.getWeakRef(request);
		this.m_activeRemoteQueries = oFF.XList.create();
	};
	oFF.ResultSetContainer.prototype.getComponentName = function() {
		return "ResultSetContainer";
	};
	oFF.ResultSetContainer.prototype.releaseObject = function() {
		this.m_resultSetId = null;
		this.m_resultSetPersistenceTable = null;
		this.m_resultSetPersistenceSchema = null;
		this.m_resultSetPersistenceIdentifier = null;
		this.m_serializedView = null;
		this.m_serializedCube = null;
		this.m_request = oFF.XObjectExt.release(this.m_request);
		this.m_resultSetProviderFactory = oFF.XObjectExt
				.release(this.m_resultSetProviderFactory);
		this.m_rsDefQueryModel = oFF.XObjectExt.release(this.m_rsDefQueryModel);
		this.m_cursorResultSet = oFF.XObjectExt.release(this.m_cursorResultSet);
		this.m_cursorResultSetInSync = oFF.XObjectExt
				.release(this.m_cursorResultSetInSync);
		this.m_classicResultSet = oFF.XObjectExt
				.release(this.m_classicResultSet);
		this.m_dataEntryCollection = oFF.XObjectExt
				.release(this.m_dataEntryCollection);
		this.m_newLineCollection = oFF.XObjectExt
				.release(this.m_newLineCollection);
		this.m_currentSyncType = null;
		this.m_listener = null;
		this.m_customIdentifier = null;
		this.m_activeRemoteQueries = oFF.XObjectExt
				.release(this.m_activeRemoteQueries);
		oFF.DfRsSyncAction.prototype.releaseObject.call(this);
	};
	oFF.ResultSetContainer.prototype.cancelSynchronization = function() {
		var queryManager;
		var lifeCycleState;
		var activeSyncType;
		oFF.XBooleanUtils.checkTrue(
				this.getSyncState() === oFF.SyncState.PROCESSING,
				"Cannot cancel action that is not processing");
		oFF.DfRsSyncAction.prototype.cancelSynchronization.call(this);
		queryManager = this.getQueryManager();
		if (oFF.notNull(queryManager)) {
			lifeCycleState = queryManager.getLifeCycleState();
			if (lifeCycleState === oFF.LifeCycleState.ACTIVE) {
				activeSyncType = this.getActiveSyncType();
				queryManager.processCancel(activeSyncType);
			}
		}
	};
	oFF.ResultSetContainer.prototype.processExecution = function(syncType,
			listener, customIdentifier) {
		var queryModel;
		var preQueries;
		var qm;
		this.m_currentSyncType = syncType;
		this.m_listener = listener;
		this.m_customIdentifier = customIdentifier;
		queryModel = this.getQueryModel();
		if (this.m_activeRemoteQueries.hasElements()
				|| !this.executeRemoteQueries(queryModel)) {
			return this;
		}
		preQueries = this.isSerializedRemotePreQuery() ? null : this
				.getPreQueries(queryModel);
		if (oFF.XCollectionUtils.hasElements(preQueries)) {
			return this.executePreQueries(syncType, listener, customIdentifier,
					preQueries);
		}
		if (oFF.notNull(queryModel) && queryModel.isBasedOnMicroCube()) {
			qm = queryModel.getDataSource().getMicroCube();
			return this.executeMicroCubeBatch(syncType, listener,
					customIdentifier, qm);
		}
		return this.processSyncAction(syncType, listener, customIdentifier);
	};
	oFF.ResultSetContainer.prototype.onPreQueryExecuted = function() {
		this.processExecution(this.m_currentSyncType, this.m_listener,
				this.m_customIdentifier);
	};
	oFF.ResultSetContainer.prototype.executePreQueries = function(syncType,
			listener, customIdentifier, preQueries) {
		var connectionPool = this.getApplication().getConnectionPool();
		var queryManager = this.getQueryManager();
		var systemName = queryManager.getSystemName();
		var preQueryExecutor = queryManager.getPreQueryExecutor();
		var implicitBatchStarted;
		var size;
		var i;
		var preQueryPair;
		var preQueryManager;
		var processSyncAction;
		if (!preQueryExecutor.serializeRemotePreQueries(syncType, systemName,
				preQueries, this)) {
			if (preQueryExecutor.getMessages().hasElements()) {
				this.clearMessages();
				this.addAllMessages(preQueryExecutor);
				this.handleErrorsBeforeProcessExecution();
			}
			return this;
		}
		implicitBatchStarted = this.startBatch(connectionPool, systemName);
		size = preQueries.size();
		for (i = 0; i < size; i++) {
			preQueryPair = preQueries.get(i);
			preQueryManager = preQueryPair.getObject().getQueryManager();
			preQueryManager.getPreQueryExecutor()
					.processExecutionAsPreQueryInBatch(systemName,
							preQueryPair.getName(), this);
		}
		processSyncAction = this.processSyncAction(oFF.SyncType.NON_BLOCKING,
				listener, customIdentifier);
		if (implicitBatchStarted && queryManager.getPreQueryName() === null) {
			connectionPool.disableBatchMode(syncType, systemName);
		}
		return processSyncAction;
	};
	oFF.ResultSetContainer.prototype.handleErrorsBeforeProcessExecution = function() {
		if (!this.isValid()) {
			this.attachListener(this.m_listener, oFF.ListenerType.SPECIFIC,
					this.m_customIdentifier);
			this.callListeners(true);
		}
	};
	oFF.ResultSetContainer.prototype.executeMicroCubeBatch = function(syncType,
			listener, customIdentifier, microCube) {
		var connectionPool = this.getApplication().getConnectionPool();
		var systemName = this.getQueryManager().getSystemName();
		var implicitBatchStarted = this.startBatch(connectionPool, systemName);
		var batchReqManager = connectionPool.getConnection(systemName)
				.getBatchRequestManager();
		var microCubeName;
		var processSyncAction;
		if (!implicitBatchStarted) {
			microCubeName = microCube.getNameForMicroCubeUse();
			if (!batchReqManager.getMicroCubesNames().contains(microCubeName)) {
				this.addQueryManagerToBatch(microCube.getQueryManager(), false,
						null, true);
				batchReqManager.addMicroCubeName(microCubeName);
			}
		} else {
			this.addQueryManagerToBatch(microCube.getQueryManager(), false,
					null, true);
		}
		processSyncAction = this.processSyncAction(oFF.SyncType.NON_BLOCKING,
				listener, customIdentifier);
		if (implicitBatchStarted) {
			connectionPool.disableBatchMode(syncType, systemName);
		}
		return processSyncAction;
	};
	oFF.ResultSetContainer.prototype.startBatch = function(connectionPool,
			systemName) {
		var implicitBatchStarted = false;
		if (!connectionPool.isBatchModeEnabled(systemName)) {
			connectionPool.enableBatchMode(systemName);
			implicitBatchStarted = true;
		}
		return implicitBatchStarted;
	};
	oFF.ResultSetContainer.prototype.addQueryManagerToBatch = function(
			queryManager, isPreQuery, preQueryName, isMicroCube) {
		var queryModel;
		var tmpResultSetTransportEnabled;
		if (isPreQuery) {
			queryManager.setPreQueryName(preQueryName);
		}
		queryModel = null;
		if (isMicroCube) {
			queryModel = queryManager.getQueryModel();
			queryModel.setBatchModeForMicroCube(true);
		}
		tmpResultSetTransportEnabled = queryManager
				.isResultSetTransportEnabled();
		queryManager.setResultSetTransportEnabled(false);
		queryManager.processQueryExecution(oFF.SyncType.NON_BLOCKING, null,
				null);
		if (isPreQuery) {
			queryManager.setPreQueryName(null);
		}
		if (isMicroCube) {
			queryModel.setBatchModeForMicroCube(false);
		}
		queryManager.setResultSetTransportEnabled(tmpResultSetTransportEnabled);
	};
	oFF.ResultSetContainer.prototype.executeRemoteQueries = function(queryModel) {
		var blendingDefinition;
		var blendingHost;
		var isRemoteBlending;
		var sources;
		var olapEnv;
		var source;
		var model;
		var manager;
		var cache;
		if (oFF.notNull(queryModel) && queryModel.isBlendingModel()) {
			blendingDefinition = queryModel.getBlendingDefinition();
			blendingHost = blendingDefinition.getBlendingHost();
			isRemoteBlending = blendingDefinition.isRemoteBlending();
			sources = queryModel.getBlendingSources().getIterator();
			olapEnv = this.getOlapEnv();
			while (sources.hasNext()) {
				source = sources.next();
				model = source.getQueryModel();
				if (!this.executeRemoteQueries(model)) {
					return false;
				}
				manager = model.getQueryManager();
				if (source.isRemoteSource()) {
					if (!source.isRemoteQueryPersistenceIdentifierUpToDate()) {
						source.updatePersistenceIdentifier(blendingHost);
						cache = olapEnv.getCachedRemoteBlendingData(manager
								.getResultSetPersistenceIdentifier());
						if (oFF.isNull(cache)) {
							if (this.executeBlendingSource(source, manager)) {
								return false;
							}
						} else {
							manager.getActiveResultSetContainer()
									.setSerializedData(cache.getView(),
											cache.getCube());
						}
					}
				} else {
					if (isRemoteBlending
							&& model.supportsCubeCache()
							&& !source
									.isRemoteQueryPersistenceIdentifierUpToDate()) {
						source.updatePersistenceIdentifier(null);
						if (this.executeBlendingSource(source, manager)) {
							return false;
						}
					}
				}
			}
		}
		return true;
	};
	oFF.ResultSetContainer.prototype.executeBlendingSource = function(source,
			queryManager) {
		var syncType;
		this.m_activeRemoteQueries.add(source);
		syncType = this.m_currentSyncType;
		queryManager.processQueryExecutionAsBlendingSource(syncType, this,
				source);
		return this.hasErrors() || syncType === oFF.SyncType.NON_BLOCKING;
	};
	oFF.ResultSetContainer.prototype.onQueryExecuted = function(extResult,
			resultSetContainer, customIdentifier) {
		var source = customIdentifier;
		source.getQueryModel().addQueryModelIdToMessages(
				extResult.getMessages());
		this.addAllMessages(extResult);
		this.m_activeRemoteQueries.removeElement(source);
		if (!source.isRemoteQueryPersistenceIdentifierUpToDate()) {
			this
					.addMessage(oFF.XMessage
							.createError(
									oFF.OriginLayer.APPLICATION,
									"Persistence identifier still invalid after executing remote query",
									null, false, null));
		}
		if (this.isValid()) {
			if (this.m_currentSyncType === oFF.SyncType.NON_BLOCKING) {
				this.processExecution(this.m_currentSyncType, this.m_listener,
						this.m_customIdentifier);
			}
		} else {
			this.handleErrorsBeforeProcessExecution();
		}
	};
	oFF.ResultSetContainer.prototype.getPreQueries = function(queryModel) {
		var preQueries;
		var sourcesIterator;
		var source;
		var sourceModel;
		if (oFF.isNull(queryModel)) {
			return oFF.XList.create();
		}
		if (queryModel.isBlendingModel()) {
			preQueries = oFF.XList.create();
			sourcesIterator = queryModel.getBlendingSources().getIterator();
			while (sourcesIterator.hasNext()) {
				source = sourcesIterator.next();
				sourceModel = source.getQueryModel();
				if (oFF.notNull(sourceModel) && !source.isRemoteSource()) {
					preQueries.addAll(this.getPreQueries(sourceModel));
				}
			}
			return preQueries;
		}
		return queryModel.getPreQueries();
	};
	oFF.ResultSetContainer.prototype.getRequest = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_request);
	};
	oFF.ResultSetContainer.prototype.processSynchronization = function(syncType) {
		var resultSetProviderFactory = oFF.XWeakReferenceUtil
				.getHardRef(this.m_resultSetProviderFactory);
		if (oFF.isNull(resultSetProviderFactory)) {
			resultSetProviderFactory = this.getQueryManager()
					.getResultSetProviderFactory();
		}
		if (oFF.isNull(this.m_rsDefQueryModel)) {
			this.m_rsDefQueryModel = oFF.RsDefQueryModel.create(this
					.getQueryManager(), null);
		}
		this.m_cursorResultSet = oFF.RsCursorResultSet.create(this,
				resultSetProviderFactory, this.getRequest(),
				this.m_rsDefQueryModel);
		this.setSyncChild(this.m_cursorResultSet);
		this.m_cursorResultSet.processResultSetFetch(syncType, this, null);
		return true;
	};
	oFF.ResultSetContainer.prototype.onResultSetFetch = function(extResult,
			resultset, customIdentifier) {
		this.addAllMessages(extResult);
		this.setDataEntryCollection(null);
		if (extResult.isValid()) {
			this.m_cursorResultSetInSync = oFF.XWeakReferenceUtil
					.getWeakRef(this.m_cursorResultSet);
			if (this.m_dataRefreshEnabled === oFF.ActionChoice.ONCE) {
				this.m_dataRefreshEnabled = oFF.ActionChoice.OFF;
			}
			this.setData(this);
		} else {
			this.m_cursorResultSetInSync = null;
		}
		this.endSync();
	};
	oFF.ResultSetContainer.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onQueryExecuted(extResult, data, customIdentifier);
	};
	oFF.ResultSetContainer.prototype.getClassicResultSet = function() {
		var rs;
		if (oFF.isNull(this.m_classicResultSet)) {
			rs = this.getCursorResultSet();
			if (oFF.notNull(rs)) {
				this.m_classicResultSet = oFF.ResultSet.create(this, rs);
			}
		}
		return this.m_classicResultSet;
	};
	oFF.ResultSetContainer.prototype.isClassicResultSetAvailable = function() {
		return oFF.notNull(this.m_classicResultSet);
	};
	oFF.ResultSetContainer.prototype.getCursorResultSet = function() {
		var syncState;
		if (oFF.isNull(this.m_cursorResultSetInSync)) {
			syncState = this.getSyncState();
			if (syncState === oFF.SyncState.PROCESSING) {
				throw oFF.XException
						.createIllegalStateException("Cannot retrieve the resultset while processing");
			}
			if (syncState === oFF.SyncState.OUT_OF_SYNC) {
				this.processExecution(oFF.SyncType.BLOCKING, null, null);
			}
		}
		return oFF.XWeakReferenceUtil.getHardRef(this.m_cursorResultSetInSync);
	};
	oFF.ResultSetContainer.prototype.isCursorResultSetAvailable = function() {
		return oFF.notNull(this.m_cursorResultSetInSync);
	};
	oFF.ResultSetContainer.prototype.setOffsetRows = function(offset) {
		this.m_offsetRows = offset;
		return null;
	};
	oFF.ResultSetContainer.prototype.setOffsetColumns = function(offset) {
		this.m_offsetColumns = offset;
		return null;
	};
	oFF.ResultSetContainer.prototype.getOffsetRows = function() {
		return this.m_offsetRows;
	};
	oFF.ResultSetContainer.prototype.getOffsetColumns = function() {
		return this.m_offsetColumns;
	};
	oFF.ResultSetContainer.prototype.setMaxRows = function(max) {
		this.m_maxRows = max;
		return null;
	};
	oFF.ResultSetContainer.prototype.setMaxColumns = function(max) {
		this.m_maxColumns = max;
		return null;
	};
	oFF.ResultSetContainer.prototype.getMaxRows = function() {
		return this.m_maxRows;
	};
	oFF.ResultSetContainer.prototype.getMaxColumns = function() {
		return this.m_maxColumns;
	};
	oFF.ResultSetContainer.prototype.getExecuteRequestOnOldResultSet = function() {
		return this.m_executeRequestOnOldResultSet;
	};
	oFF.ResultSetContainer.prototype.setExecuteRequestOnOldResultSet = function(
			executeRequestOnOldResultSet) {
		this.m_executeRequestOnOldResultSet = executeRequestOnOldResultSet;
		return null;
	};
	oFF.ResultSetContainer.prototype.hasDataEntryCollection = function() {
		return oFF.notNull(this.m_dataEntryCollection);
	};
	oFF.ResultSetContainer.prototype.getDataEntryCollection = function() {
		if (oFF.isNull(this.m_dataEntryCollection)) {
			this.m_dataEntryCollection = oFF.RsDataEntryCollection.create(this);
		}
		return this.m_dataEntryCollection;
	};
	oFF.ResultSetContainer.prototype.setDataEntryCollection = function(
			dataEntryCollection) {
		this.m_dataEntryCollection = dataEntryCollection;
	};
	oFF.ResultSetContainer.prototype.resetDataEntryCollection = function() {
		if (oFF.notNull(this.m_cursorResultSet)) {
			this.m_cursorResultSet.resetNewValues();
		}
		if (oFF.notNull(this.m_classicResultSet)) {
			this.m_classicResultSet.resetNewValues();
		}
		if (oFF.notNull(this.m_dataEntryCollection)) {
			this.m_dataEntryCollection.clear();
		}
	};
	oFF.ResultSetContainer.prototype.hasNewLineCollection = function() {
		return oFF.notNull(this.m_newLineCollection);
	};
	oFF.ResultSetContainer.prototype.getNewLineCollection = function() {
		if (oFF.isNull(this.m_newLineCollection)) {
			this.m_newLineCollection = oFF.RsNewLineCollection.create(this
					.getQueryManager(), this.getQueryModel().getRowsAxis());
		}
		return this.m_newLineCollection;
	};
	oFF.ResultSetContainer.prototype.setNewLineCollection = function(
			newLineCollection) {
		this.m_newLineCollection = newLineCollection;
	};
	oFF.ResultSetContainer.prototype.resetNewLineCollection = function() {
		if (oFF.notNull(this.m_newLineCollection)) {
			this.m_newLineCollection.clear();
		}
	};
	oFF.ResultSetContainer.prototype.getId = function() {
		if (!this.m_resultSetIdSet) {
			this.setId(oFF.XGuid.getGuid());
		}
		return this.m_resultSetId;
	};
	oFF.ResultSetContainer.prototype.setId = function(identifier) {
		this.m_resultSetId = identifier;
		this.m_resultSetIdSet = true;
	};
	oFF.ResultSetContainer.prototype.getResultSetSyncState = function() {
		return this.getSyncState();
	};
	oFF.ResultSetContainer.prototype.getResultSetMessages = function() {
		return this;
	};
	oFF.ResultSetContainer.prototype.getResultSetManager = function() {
		return this.getActionContext();
	};
	oFF.ResultSetContainer.prototype.hasMoreColumnRecordsAvailable = function() {
		var currentMaxTuple = this.m_offsetColumns + this.m_maxColumns;
		var cursorColumnsAxis;
		if (currentMaxTuple === -1) {
			return false;
		}
		cursorColumnsAxis = this.m_cursorResultSet.getCursorColumnsAxis();
		return currentMaxTuple < cursorColumnsAxis.getTuplesCountTotal();
	};
	oFF.ResultSetContainer.prototype.hasMoreRowRecordsAvailable = function() {
		var currentMaxTuple = this.m_offsetRows + this.m_maxRows;
		var cursorRowsAxis;
		if (currentMaxTuple === -1) {
			return false;
		}
		cursorRowsAxis = this.m_cursorResultSet.getCursorRowsAxis();
		return currentMaxTuple < cursorRowsAxis.getTuplesCountTotal();
	};
	oFF.ResultSetContainer.prototype.getMaxResultRecords = function() {
		return this.m_maxResultRecords;
	};
	oFF.ResultSetContainer.prototype.setMaxResultRecords = function(
			maxResultRecords) {
		this.m_maxResultRecords = maxResultRecords;
		return null;
	};
	oFF.ResultSetContainer.prototype.resetMaxResultRecords = function() {
		this.m_maxResultRecords = -1;
		return null;
	};
	oFF.ResultSetContainer.prototype.setDataRefreshEnabled = function(
			dataRefreshEnabled) {
		this.m_dataRefreshEnabled = dataRefreshEnabled;
	};
	oFF.ResultSetContainer.prototype.getDataRefreshEnabled = function() {
		return this.m_dataRefreshEnabled;
	};
	oFF.ResultSetContainer.prototype.setResultSetPersistanceTargetSchema = function(
			resultSetPersistenceSchema) {
		this.m_resultSetPersistenceSchema = resultSetPersistenceSchema;
		return null;
	};
	oFF.ResultSetContainer.prototype.setResultSetPersistanceTargetTable = function(
			resultSetPersistenceTable) {
		this.m_resultSetPersistenceTable = resultSetPersistenceTable;
		return null;
	};
	oFF.ResultSetContainer.prototype.setResultSetPersistenceIdentifier = function(
			resultSetPersistenceIdentifier) {
		this.m_resultSetPersistenceIdentifier = resultSetPersistenceIdentifier;
		return null;
	};
	oFF.ResultSetContainer.prototype.getResultSetPersistenceSchema = function() {
		return this.m_resultSetPersistenceSchema;
	};
	oFF.ResultSetContainer.prototype.getResultSetPersistenceTable = function() {
		return this.m_resultSetPersistenceTable;
	};
	oFF.ResultSetContainer.prototype.getResultSetPersistenceIdentifier = function() {
		return this.m_resultSetPersistenceIdentifier;
	};
	oFF.ResultSetContainer.prototype.isResultSetTransportEnabled = function() {
		return this.m_isResultSetTransportEnabled;
	};
	oFF.ResultSetContainer.prototype.setResultSetTransportEnabled = function(
			isEnabled) {
		this.m_isResultSetTransportEnabled = isEnabled;
		return null;
	};
	oFF.ResultSetContainer.prototype.getAbstractRendering = function(type,
			protocol) {
		var grid;
		if (type.isTypeOf(oFF.SemanticBindingType.CHART)) {
			return oFF.ChartRendererFactory.createRenderer(protocol).render(
					type, this.getCursorResultSet());
		}
		grid = oFF.ReferenceGridFactory.createForVizGrid(this
				.getClassicResultSet());
		return grid.exportToVizGrid();
	};
	oFF.ResultSetContainer.prototype.setSerializedData = function(view, cube) {
		this.m_serializedView = view;
		this.m_serializedCube = cube;
	};
	oFF.ResultSetContainer.prototype.getSerializedView = function() {
		return this.m_serializedView;
	};
	oFF.ResultSetContainer.prototype.getSerializedCube = function() {
		return this.m_serializedCube;
	};
	oFF.ResultSetContainer.prototype.isKeyfigureCalculationSuppressed = function() {
		return this.m_suppressKeyfigureCalculation;
	};
	oFF.ResultSetContainer.prototype.setSuppressKeyfigureCalculation = function(
			doSupress) {
		if (this.getQueryManager().supportsAnalyticCapabilityActive(
				oFF.InACapabilities.SUPPRESS_KEYFIGURE_CALCULATION)) {
			this.m_suppressKeyfigureCalculation = doSupress;
		}
		return null;
	};
	oFF.ResultSetContainer.prototype.setIsRemotePreQuery = function(
			isRemotePreQuery) {
		this.m_isRemotePreQuery = isRemotePreQuery;
	};
	oFF.ResultSetContainer.prototype.isRemotePreQuery = function() {
		return this.m_isRemotePreQuery;
	};
	oFF.ResultSetContainer.prototype.isSerializedRemotePreQuery = function() {
		var queryManager = this.getQueryManager();
		if (oFF.notNull(queryManager) && this.m_isRemotePreQuery) {
			return queryManager.getResultSetPersistenceIdentifier() !== null
					&& queryManager.getPreQueryName() !== null;
		}
		return false;
	};
	oFF.RsCursorResultSet = function() {
	};
	oFF.RsCursorResultSet.prototype = new oFF.DfRsSyncAction();
	oFF.RsCursorResultSet.create = function(resultSetManager, providerFactory,
			request, rsDefQueryModel) {
		var resultSet = new oFF.RsCursorResultSet();
		resultSet.setupResultSet(resultSetManager, providerFactory, request,
				rsDefQueryModel);
		return resultSet;
	};
	oFF.RsCursorResultSet.prototype.m_resultsetContainer = null;
	oFF.RsCursorResultSet.prototype.m_providerFactory = null;
	oFF.RsCursorResultSet.prototype.m_provider = null;
	oFF.RsCursorResultSet.prototype.m_dataCellProvider = null;
	oFF.RsCursorResultSet.prototype.m_dataCell = null;
	oFF.RsCursorResultSet.prototype.m_currentColumn = 0;
	oFF.RsCursorResultSet.prototype.m_currentRow = 0;
	oFF.RsCursorResultSet.prototype.m_rowsAxis = null;
	oFF.RsCursorResultSet.prototype.m_columnAxis = null;
	oFF.RsCursorResultSet.prototype.m_state = null;
	oFF.RsCursorResultSet.prototype.m_dataColumns = 0;
	oFF.RsCursorResultSet.prototype.m_dataRows = 0;
	oFF.RsCursorResultSet.prototype.m_availableDataCellCount = 0;
	oFF.RsCursorResultSet.prototype.m_dataEntryEnabled = false;
	oFF.RsCursorResultSet.prototype.m_inputReadinessStates = null;
	oFF.RsCursorResultSet.prototype.m_dataEntryMask = null;
	oFF.RsCursorResultSet.prototype.m_request = null;
	oFF.RsCursorResultSet.prototype.m_rsDefQueryModel = null;
	oFF.RsCursorResultSet.prototype.m_complexUnitsSetting = null;
	oFF.RsCursorResultSet.prototype.setupResultSet = function(
			resultSetContainer, providerFactory, request, rsDefQueryModel) {
		this.setupSynchronizingObject(resultSetContainer.getQueryManager());
		this.setResultSetContainer(resultSetContainer);
		this.m_rsDefQueryModel = oFF.XWeakReferenceUtil
				.getWeakRef(rsDefQueryModel);
		this.m_providerFactory = oFF.XWeakReferenceUtil
				.getWeakRef(providerFactory);
		this.m_currentRow = -1;
		this.m_currentColumn = -1;
		this.m_dataColumns = -1;
		this.m_dataRows = -1;
		this.m_request = oFF.XWeakReferenceUtil.getWeakRef(request);
		this.m_state = oFF.ResultSetState.INITIAL;
	};
	oFF.RsCursorResultSet.prototype.releaseObject = function() {
		this.m_provider = oFF.XObjectExt.release(this.m_provider);
		this.m_request = oFF.XObjectExt.release(this.m_request);
		this.m_rsDefQueryModel = oFF.XObjectExt.release(this.m_rsDefQueryModel);
		this.m_resultsetContainer = oFF.XObjectExt
				.release(this.m_resultsetContainer);
		this.m_providerFactory = oFF.XObjectExt.release(this.m_providerFactory);
		this.m_dataCellProvider = oFF.XObjectExt
				.release(this.m_dataCellProvider);
		this.m_dataCell = oFF.XObjectExt.release(this.m_dataCell);
		this.m_currentRow = -1;
		this.m_currentColumn = -1;
		this.m_columnAxis = oFF.XObjectExt.release(this.m_columnAxis);
		this.m_rowsAxis = oFF.XObjectExt.release(this.m_rowsAxis);
		this.m_inputReadinessStates = oFF.XObjectExt
				.release(this.m_inputReadinessStates);
		this.m_availableDataCellCount = 0;
		this.m_dataColumns = 0;
		this.m_dataRows = 0;
		this.m_dataEntryMask = null;
		this.m_state = null;
		this.m_complexUnitsSetting = oFF.XObjectExt
				.release(this.m_complexUnitsSetting);
		oFF.DfRsSyncAction.prototype.releaseObject.call(this);
	};
	oFF.RsCursorResultSet.prototype.getComponentName = function() {
		return "RsCursorResultSet";
	};
	oFF.RsCursorResultSet.prototype.isActive = function() {
		return oFF.notNull(this.m_resultsetContainer);
	};
	oFF.RsCursorResultSet.prototype.processResultSetFetch = function(syncType,
			listener, customIdentifier) {
		return this.processSyncAction(syncType, listener, customIdentifier);
	};
	oFF.RsCursorResultSet.prototype.getProviderFactory = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_providerFactory);
	};
	oFF.RsCursorResultSet.prototype.getRequest = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_request);
	};
	oFF.RsCursorResultSet.prototype.processSynchronization = function(syncType) {
		var syncAction;
		if (oFF.isNull(this.m_request)) {
			this.m_provider = this.getProviderFactory()
					.createResultSetProvider(
							oFF.ProviderInitProcedure.REQUEST_BY_MODEL, null);
		} else {
			this.m_provider = this.getProviderFactory()
					.createResultSetProvider(
							oFF.ProviderInitProcedure.REQUEST_BY_STRUCTURE,
							this.getRequest());
		}
		this.m_provider.setResultSet(this);
		syncAction = this.m_provider.processResultSet(syncType, this, null);
		this.setSyncChild(syncAction);
		return true;
	};
	oFF.RsCursorResultSet.prototype.onProviderFetch = function(extResult,
			resultset, customIdentifier) {
		var dataCellProvider;
		var rsQueryModelDef;
		this.addAllMessages(extResult);
		if (extResult.hasErrors()) {
			this.m_state = oFF.ResultSetState.DATA_ACCESS_PROBLEMS;
		} else {
			dataCellProvider = this.m_provider.getDataCellProvider();
			this.m_dataCellProvider = oFF.XWeakReferenceUtil
					.getWeakRef(dataCellProvider);
			this.m_dataColumns = dataCellProvider.getAvailableDataCellColumns();
			this.m_dataRows = dataCellProvider.getAvailableDataCellRows();
			this.m_availableDataCellCount = dataCellProvider
					.getAvailableDataCellCount();
			this.m_dataCell = oFF.RsDataCell.createDefault(this);
			rsQueryModelDef = this.getRsQueryModelDef();
			this.m_columnAxis = oFF.RsCursorAxis.create(this, this.m_provider
					.getColumnAxisProvider(), rsQueryModelDef
					.getColumnsAxisDef());
			this.m_rowsAxis = oFF.RsCursorAxis.create(this, this.m_provider
					.getRowsAxisProvider(), rsQueryModelDef.getRowsAxisDef());
			this.m_complexUnitsSetting = oFF.XWeakReferenceUtil
					.getWeakRef(this.m_provider.getComplexUnitsSetting());
		}
		this.endSync();
	};
	oFF.RsCursorResultSet.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onResultSetFetch(extResult, data, customIdentifier);
	};
	oFF.RsCursorResultSet.prototype.getDataCellProvider = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_dataCellProvider);
	};
	oFF.RsCursorResultSet.prototype.getDataCell = function(column, row) {
		var validCol;
		var validRow;
		var maxCol;
		var maxRow;
		if (column !== this.m_currentColumn || row !== this.m_currentRow) {
			validCol = column < 0 || column > this.m_dataColumns;
			validRow = row < 0 || row > this.m_dataRows;
			maxCol = this.m_dataColumns;
			maxRow = this.m_dataRows;
			if (this.getApplication().getVersion() >= oFF.XVersion.V105_ASSERT_RESULTSET_BOUNDARIES) {
				validCol = column < 0 || column >= this.m_dataColumns;
				validRow = row < 0 || row >= this.m_dataRows;
				maxCol = this.m_dataColumns - 1;
				maxRow = this.m_dataRows - 1;
			}
			if (validCol) {
				throw oFF.XException
						.createIllegalArgumentException(oFF.XStringUtils
								.concatenate3(
										"Column index is invalid, valid indices are [0, ",
										oFF.XIntegerValue.create(maxCol)
												.toString(), "]"));
			}
			if (validRow) {
				throw oFF.XException
						.createIllegalArgumentException(oFF.XStringUtils
								.concatenate3(
										"Row index is invalid, valid indices are [0, ",
										oFF.XIntegerValue.create(maxRow)
												.toString(), "]"));
			}
			this.getDataCellProvider().notifyCursorChange(this.m_dataCell,
					column, row);
			this.m_currentColumn = column;
			this.m_currentRow = row;
		}
		return this.m_dataCell;
	};
	oFF.RsCursorResultSet.prototype.getDataColumns = function() {
		return this.m_dataColumns;
	};
	oFF.RsCursorResultSet.prototype.getDataRows = function() {
		return this.m_dataRows;
	};
	oFF.RsCursorResultSet.prototype.getAvailableDataCellCount = function() {
		return this.m_availableDataCellCount;
	};
	oFF.RsCursorResultSet.prototype.getState = function() {
		return this.m_state;
	};
	oFF.RsCursorResultSet.prototype.setState = function(state) {
		this.m_state = state;
	};
	oFF.RsCursorResultSet.prototype.getCursorRowsAxis = function() {
		return this.getCursorAxis(oFF.AxisType.ROWS);
	};
	oFF.RsCursorResultSet.prototype.getCursorColumnsAxis = function() {
		return this.getCursorAxis(oFF.AxisType.COLUMNS);
	};
	oFF.RsCursorResultSet.prototype.getCursorAxis = function(axis) {
		if (axis === oFF.AxisType.COLUMNS) {
			return this.m_columnAxis;
		}
		return this.m_rowsAxis;
	};
	oFF.RsCursorResultSet.prototype.getResultSetContainer = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_resultsetContainer);
	};
	oFF.RsCursorResultSet.prototype.setResultSetContainer = function(
			resultsetContainer) {
		this.m_resultsetContainer = oFF.XWeakReferenceUtil
				.getWeakRef(resultsetContainer);
	};
	oFF.RsCursorResultSet.prototype.isNewLinePossible = function() {
		var mask = this.getDataEntryMask();
		if (oFF.isNull(mask)) {
			return false;
		}
		return mask.size() > 0;
	};
	oFF.RsCursorResultSet.prototype.getResultSetType = function() {
		return oFF.ResultSetType.CURSOR;
	};
	oFF.RsCursorResultSet.prototype.getRsQueryModelDef = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_rsDefQueryModel);
	};
	oFF.RsCursorResultSet.prototype.setDataEntryMask = function(dataEntryMask) {
		this.m_dataEntryMask = dataEntryMask;
	};
	oFF.RsCursorResultSet.prototype.getDataEntryMask = function() {
		if (oFF.isNull(this.m_dataEntryMask)) {
			return null;
		}
		return this.m_dataEntryMask.createListOfStringCopy();
	};
	oFF.RsCursorResultSet.prototype.isDataEntryEnabled = function() {
		return this.m_dataEntryEnabled;
	};
	oFF.RsCursorResultSet.prototype.setDataEntryEnabled = function(
			dataEntryEnabled) {
		this.m_dataEntryEnabled = dataEntryEnabled;
	};
	oFF.RsCursorResultSet.prototype.getInputReadinessStates = function() {
		return this.m_inputReadinessStates;
	};
	oFF.RsCursorResultSet.prototype.getInputReadinessStateAt = function(index) {
		if (oFF.isNull(this.m_inputReadinessStates)) {
			return null;
		}
		return this.m_inputReadinessStates.get(index);
	};
	oFF.RsCursorResultSet.prototype.setInputReadinessStates = function(states) {
		this.m_inputReadinessStates = states;
	};
	oFF.RsCursorResultSet.prototype.resetNewValues = function() {
		if (oFF.notNull(this.m_dataCell)) {
			this.m_dataCell.resetAllChanges();
		}
	};
	oFF.RsCursorResultSet.prototype.getComplexUnitsSetting = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_complexUnitsSetting);
	};
	oFF.RsCursorResultSet.prototype.getNewDataEntryViaMember = function() {
		var container = this.getResultSetContainer();
		return container.getDataEntryCollection().getNewDataEntryViaMember();
	};
	oFF.DfResultSetProvider = function() {
	};
	oFF.DfResultSetProvider.prototype = new oFF.DfRsSyncAction();
	oFF.DfResultSetProvider.prototype.m_resultSet = null;
	oFF.DfResultSetProvider.prototype.releaseObject = function() {
		this.m_resultSet = oFF.XObjectExt.release(this.m_resultSet);
		oFF.DfRsSyncAction.prototype.releaseObject.call(this);
	};
	oFF.DfResultSetProvider.prototype.processResultSet = function(syncType,
			listener, customIdentifier) {
		return this.processSyncAction(syncType, listener, customIdentifier);
	};
	oFF.DfResultSetProvider.prototype.getComponentName = function() {
		return "DfResultSetProvider";
	};
	oFF.DfResultSetProvider.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onProviderFetch(extResult, data, customIdentifier);
	};
	oFF.DfResultSetProvider.prototype.getData = function() {
		return this;
	};
	oFF.DfResultSetProvider.prototype.getResultSet = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_resultSet);
	};
	oFF.DfResultSetProvider.prototype.setResultSet = function(resultSet) {
		this.m_resultSet = oFF.XWeakReferenceUtil.getWeakRef(resultSet);
	};
	oFF.RsAxisTupleElement = function() {
	};
	oFF.RsAxisTupleElement.prototype = new oFF.DfApplicationContext();
	oFF.RsAxisTupleElement.create = function(axis, name, member,
			tupleElementPosition, drillState, displayLevel, childCount,
			absoluteLevel) {
		var object = new oFF.RsAxisTupleElement();
		object.setupExt(axis, name, member, tupleElementPosition, drillState,
				displayLevel, childCount, absoluteLevel);
		return object;
	};
	oFF.RsAxisTupleElement.prototype.m_axis = null;
	oFF.RsAxisTupleElement.prototype.m_firstTuple = null;
	oFF.RsAxisTupleElement.prototype.m_parentNode = null;
	oFF.RsAxisTupleElement.prototype.m_member = null;
	oFF.RsAxisTupleElement.prototype.m_tupleElementPosition = 0;
	oFF.RsAxisTupleElement.prototype.m_displayLevel = 0;
	oFF.RsAxisTupleElement.prototype.m_absoluteLevel = 0;
	oFF.RsAxisTupleElement.prototype.m_drillState = null;
	oFF.RsAxisTupleElement.prototype.m_name = null;
	oFF.RsAxisTupleElement.prototype.m_exceptionName = null;
	oFF.RsAxisTupleElement.prototype.m_alertLevel = 0;
	oFF.RsAxisTupleElement.prototype.m_osid = null;
	oFF.RsAxisTupleElement.prototype.m_childCount = 0;
	oFF.RsAxisTupleElement.prototype.releaseObject = function() {
		this.m_axis = null;
		this.m_firstTuple = null;
		this.m_parentNode = null;
		this.m_member = null;
		this.m_drillState = null;
		this.m_name = null;
		this.m_exceptionName = null;
		oFF.DfApplicationContext.prototype.releaseObject.call(this);
	};
	oFF.RsAxisTupleElement.prototype.isEqualTo = function(other) {
		var otherTuple;
		if (oFF.isNull(other)) {
			return false;
		}
		if (this === other) {
			return true;
		}
		otherTuple = other;
		if (!oFF.XString.isEqual(this.m_name, otherTuple.getName())) {
			return false;
		}
		if (this.m_displayLevel !== otherTuple.getDisplayLevel()) {
			return false;
		}
		if (this.m_absoluteLevel !== otherTuple.getAbsoluteLevel()) {
			return false;
		}
		if (!this.m_drillState.isEqualTo(otherTuple.getDrillState())) {
			return false;
		}
		return this.m_member.isEqualTo(otherTuple.getDimensionMember());
	};
	oFF.RsAxisTupleElement.prototype.toString = function() {
		return oFF.XStringUtils.concatenate3(this.m_name, ":\t", this.m_member
				.toString());
	};
	oFF.RsAxisTupleElement.prototype.compareTo = function(objectToCompare) {
		var otherTuple;
		var compare;
		if (oFF.isNull(objectToCompare)) {
			return -1;
		}
		if (objectToCompare === this) {
			return 0;
		}
		otherTuple = objectToCompare;
		compare = oFF.XString.compare(this.m_name, otherTuple.getName());
		if (compare === 0) {
			compare = this.m_member.compareTo(otherTuple.getDimensionMember());
		}
		return compare;
	};
	oFF.RsAxisTupleElement.prototype.setupExt = function(axis, name, member,
			tupleElementPosition, drillState, displayLevel, childCount,
			absoluteLevel) {
		if (oFF.notNull(axis)) {
			oFF.DfApplicationContext.prototype.setupApplicationContext.call(
					this, axis.getApplication());
		}
		this.m_axis = oFF.XWeakReferenceUtil.getWeakRef(axis);
		this.m_member = member;
		this.m_tupleElementPosition = tupleElementPosition;
		if (oFF.isNull(drillState)) {
			this.m_drillState = oFF.DrillState.LEAF;
		} else {
			this.m_drillState = drillState;
		}
		this.m_absoluteLevel = absoluteLevel;
		this.m_displayLevel = displayLevel;
		this.m_name = name;
		this.m_childCount = childCount;
	};
	oFF.RsAxisTupleElement.prototype.getAxis = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_axis);
	};
	oFF.RsAxisTupleElement.prototype.getDimensionMember = function() {
		return this.m_member;
	};
	oFF.RsAxisTupleElement.prototype.getDimension = function() {
		return this.m_member.getDimension();
	};
	oFF.RsAxisTupleElement.prototype.getQueryModel = function() {
		return this.getAxis().getQueryModel();
	};
	oFF.RsAxisTupleElement.prototype.getIndexOnAxis = function() {
		var rsDimensions = this.getAxis().getRsDimensions();
		return oFF.XCollectionUtils.getIndexByName(rsDimensions, this.m_member
				.getDimension().getName());
	};
	oFF.RsAxisTupleElement.prototype.getAbsoluteLevel = function() {
		return this.m_absoluteLevel;
	};
	oFF.RsAxisTupleElement.prototype.getDisplayLevel = function() {
		return this.m_displayLevel;
	};
	oFF.RsAxisTupleElement.prototype.getDrillState = function() {
		return this.m_drillState;
	};
	oFF.RsAxisTupleElement.prototype.setNextDrillState = function(drillState) {
		var drillManager = this.getQueryModel().getDrillManager();
		var drillPath;
		if (drillManager.isDrillStateValid(this, drillState)) {
			drillPath = this.getDrillPath();
			return drillManager.setDrillState(drillPath, drillState);
		}
		return null;
	};
	oFF.RsAxisTupleElement.prototype.getDrillPath = function() {
		var drillPath = oFF.XList.create();
		var firstTuple = this.getFirstTuple();
		var isSapFormat = this.getQueryModel()
				.supportsAnalyticCapabilityActive(oFF.InACapabilities.SAP_DATE);
		var i;
		var tupleElement;
		var dimension;
		var dimensionMember;
		var keyFieldValue;
		var value;
		var valueType;
		var element;
		for (i = 0; i <= this.m_tupleElementPosition; i++) {
			tupleElement = firstTuple.get(i);
			dimension = tupleElement.getDimension();
			dimensionMember = tupleElement.getDimensionMember();
			keyFieldValue = dimensionMember.getKeyFieldValue();
			if (isSapFormat) {
				valueType = keyFieldValue.getValueType();
				if (valueType === oFF.XValueType.DATE) {
					value = keyFieldValue.getDate().toSAPFormat();
				} else {
					if (valueType === oFF.XValueType.DATE_TIME) {
						value = keyFieldValue.getDateTime().toSAPFormat();
					} else {
						if (valueType === oFF.XValueType.TIME) {
							value = keyFieldValue.getTime().toSAPFormat();
						} else {
							value = keyFieldValue.getString();
						}
					}
				}
			} else {
				value = keyFieldValue.getString();
			}
			element = oFF.QFactory.newDrillPathElement(null, value, dimension);
			drillPath.add(element);
		}
		return drillPath;
	};
	oFF.RsAxisTupleElement.prototype.getFirstTuple = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_firstTuple);
	};
	oFF.RsAxisTupleElement.prototype.setFirstTuple = function(tuple) {
		this.m_firstTuple = oFF.XWeakReferenceUtil.getWeakRef(tuple);
	};
	oFF.RsAxisTupleElement.prototype.getParentNode = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_parentNode);
	};
	oFF.RsAxisTupleElement.prototype.setParentNode = function(parentNode) {
		this.m_parentNode = oFF.XWeakReferenceUtil.getWeakRef(parentNode);
	};
	oFF.RsAxisTupleElement.prototype.getName = function() {
		return this.m_name;
	};
	oFF.RsAxisTupleElement.prototype.getExceptionName = function() {
		return this.m_exceptionName;
	};
	oFF.RsAxisTupleElement.prototype.setExceptionName = function(exceptionName) {
		this.m_exceptionName = exceptionName;
	};
	oFF.RsAxisTupleElement.prototype.getAlertLevel = function() {
		return this.m_alertLevel;
	};
	oFF.RsAxisTupleElement.prototype.setAlertLevel = function(alertLevel) {
		this.m_alertLevel = alertLevel;
	};
	oFF.RsAxisTupleElement.prototype.getComponentType = function() {
		return this.getMemberType();
	};
	oFF.RsAxisTupleElement.prototype.getOlapComponentType = function() {
		return this.getMemberType();
	};
	oFF.RsAxisTupleElement.prototype.getType = function() {
		return this.getMemberType();
	};
	oFF.RsAxisTupleElement.prototype.getMemberType = function() {
		if (oFF.notNull(this.m_drillState)
				&& this.m_drillState !== oFF.DrillState.LEAF) {
			return oFF.MemberType.TUPLE_ELEMENT_AS_NODE;
		}
		return oFF.MemberType.TUPLE_ELEMENT_AS_MEMBER;
	};
	oFF.RsAxisTupleElement.prototype.getSelectableElement = function() {
		return this.m_member;
	};
	oFF.RsAxisTupleElement.prototype.isLeaf = function() {
		return this.getMemberType().isLeaf();
	};
	oFF.RsAxisTupleElement.prototype.isNode = function() {
		return this.getMemberType().isNode();
	};
	oFF.RsAxisTupleElement.prototype.getOsid = function() {
		var buffer;
		if (oFF.isNull(this.m_osid)) {
			buffer = oFF.XStringBuffer.create();
			buffer.append(this.getName());
			buffer.append("_");
			buffer.appendInt(this.m_member.getSession().getNextSid());
			this.m_osid = buffer.toString();
		}
		return this.m_osid;
	};
	oFF.RsAxisTupleElement.prototype.registerChangedListener = oFF.noSupport;
	oFF.RsAxisTupleElement.prototype.unregisterChangedListener = oFF.noSupport;
	oFF.RsAxisTupleElement.prototype.getChildCount = function() {
		return this.m_childCount;
	};
	oFF.RsAxisTupleElement.prototype.cloneOlapComponent = oFF.noSupport;
	oFF.RsAxisTupleElement.prototype.queueEventing = function() {
	};
	oFF.RsAxisTupleElement.prototype.stopEventing = function() {
	};
	oFF.RsAxisTupleElement.prototype.isEventingStopped = function() {
		return false;
	};
	oFF.RsAxisTupleElement.prototype.resumeEventing = function() {
	};
	oFF.RsCursorAxis = function() {
	};
	oFF.RsCursorAxis.prototype = new oFF.DfOlapEnvContext();
	oFF.RsCursorAxis.create = function(cursorResultSet, provider, rsDefAxis) {
		var object = new oFF.RsCursorAxis();
		object.setupExt(cursorResultSet, provider, rsDefAxis);
		return object;
	};
	oFF.RsCursorAxis.prototype.m_provider = null;
	oFF.RsCursorAxis.prototype.m_cursorResultSet = null;
	oFF.RsCursorAxis.prototype.m_model = null;
	oFF.RsCursorAxis.prototype.m_tupleIndex = 0;
	oFF.RsCursorAxis.prototype.m_tuplesCountTotal = 0;
	oFF.RsCursorAxis.prototype.m_currentTupleElement = null;
	oFF.RsCursorAxis.prototype.m_tupleElementIndex = 0;
	oFF.RsCursorAxis.prototype.m_tupleElementCount = 0;
	oFF.RsCursorAxis.prototype.m_tupleElements = null;
	oFF.RsCursorAxis.prototype.m_currentCursorFieldValue = null;
	oFF.RsCursorAxis.prototype.m_globalFieldValueCount = 0;
	oFF.RsCursorAxis.prototype.m_globalFieldIndex = 0;
	oFF.RsCursorAxis.prototype.m_currentMetadataTupleElement = null;
	oFF.RsCursorAxis.prototype.m_dimensions = null;
	oFF.RsCursorAxis.prototype.m_currentRsDimension = null;
	oFF.RsCursorAxis.prototype.m_pagingMax = 0;
	oFF.RsCursorAxis.prototype.m_rsDefAxis = null;
	oFF.RsCursorAxis.prototype.m_exceptionName = null;
	oFF.RsCursorAxis.prototype.m_alertLevel = 0;
	oFF.RsCursorAxis.prototype.setupExt = function(cursorResultSet, provider,
			rsDefAxis) {
		this.setupOlapApplicationContext(cursorResultSet.getOlapEnv());
		this.m_rsDefAxis = oFF.XWeakReferenceUtil.getWeakRef(rsDefAxis);
		this.m_provider = oFF.XWeakReferenceUtil.getWeakRef(provider);
		provider.setCursorAxis(this);
		this.m_tuplesCountTotal = provider.getTuplesCountTotal();
		this.m_tupleIndex = -1;
		this.m_pagingMax = provider.getTuplesCount();
		this.m_tupleElementCount = provider.getTupleElementsCount();
		this.m_tupleElementIndex = -1;
		this.m_cursorResultSet = oFF.XWeakReferenceUtil
				.getWeakRef(cursorResultSet);
		this.setQueryModel(cursorResultSet.getQueryModel());
		this.m_globalFieldValueCount = 0;
		this.m_globalFieldIndex = -1;
		provider.notifySetAxisMetadata();
	};
	oFF.RsCursorAxis.prototype.getTupleCursorIndex = function() {
		return this.m_tupleIndex;
	};
	oFF.RsCursorAxis.prototype.releaseObject = function() {
		this.m_tupleElements = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_tupleElements);
		this.m_currentCursorFieldValue = oFF.XObjectExt
				.release(this.m_currentCursorFieldValue);
		this.m_currentMetadataTupleElement = oFF.XObjectExt
				.release(this.m_currentMetadataTupleElement);
		this.m_currentRsDimension = oFF.XObjectExt
				.release(this.m_currentRsDimension);
		this.m_dimensions = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_dimensions);
		this.m_currentTupleElement = oFF.XObjectExt
				.release(this.m_currentTupleElement);
		this.m_rsDefAxis = oFF.XObjectExt.release(this.m_rsDefAxis);
		this.m_exceptionName = null;
		this.m_model = oFF.XObjectExt.release(this.m_model);
		this.m_cursorResultSet = oFF.XObjectExt.release(this.m_cursorResultSet);
		this.m_provider = oFF.XObjectExt.release(this.m_provider);
		oFF.DfOlapEnvContext.prototype.releaseObject.call(this);
	};
	oFF.RsCursorAxis.prototype.getCursorResultSet = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_cursorResultSet);
	};
	oFF.RsCursorAxis.prototype.getDataCount = function() {
		return this.getProvider().getDataCount();
	};
	oFF.RsCursorAxis.prototype.getQueryModel = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_model);
	};
	oFF.RsCursorAxis.prototype.setQueryModel = function(model) {
		this.m_model = oFF.XWeakReferenceUtil.getWeakRef(model);
	};
	oFF.RsCursorAxis.prototype.startAddMetadata = function(dimensionsSize) {
		this.m_tupleElements = oFF.XList.create();
		this.m_globalFieldValueCount = 0;
		this.m_dimensions = oFF.XList.create();
	};
	oFF.RsCursorAxis.prototype.addNextTupleElementMetadata = function(index,
			inaRsDimension) {
		var queryModel = this.getQueryModel();
		var dimension = null;
		var tupleElement;
		if (oFF.notNull(queryModel)) {
			dimension = queryModel
					.getDimensionByNameFromExistingMetadata(inaRsDimension
							.getName());
			if (oFF.isNull(dimension)) {
				dimension = queryModel.getMeasureDimension();
			}
		}
		this.m_currentRsDimension = this.getRsAxisDef().newRsDimension(
				dimension);
		this.m_currentRsDimension.setupInADimension(inaRsDimension);
		tupleElement = oFF.RsCursorAxisTupleElementContent.create(this
				.getApplication(), dimension, this.m_currentRsDimension);
		this.m_tupleElements.add(tupleElement);
		this.m_currentMetadataTupleElement = tupleElement;
		this.m_dimensions.add(this.m_currentRsDimension);
	};
	oFF.RsCursorAxis.prototype.addNextFieldMetadata = function(fieldName,
			fieldText, isVisible, presentationType, valueType) {
		var dimension = this.m_currentMetadataTupleElement
				.getDimensionAtCurrentPositionFromQueryModel();
		var field = null;
		var context;
		if (oFF.notNull(dimension)) {
			field = dimension.getFieldByName(fieldName);
		}
		if (oFF.isNull(field)) {
			if (oFF.notNull(dimension)) {
				this.getCursorResultSet().getResultSetContainer().addWarning(
						oFF.ErrorCodes.INVALID_FIELD,
						oFF.XStringUtils.concatenate3("The field '", fieldName,
								"' was not part of the metadata document"));
			}
			context = this.getOlapEnv().getContext();
			field = oFF.QFactory.newField(context, fieldName);
		}
		this.m_currentMetadataTupleElement.addFieldMetadata(field);
		this.m_globalFieldValueCount++;
		this.m_currentRsDimension.addField(fieldName);
		if (isVisible) {
			if (presentationType === oFF.PresentationType.UNDEFINED) {
				this.m_currentRsDimension.addRsField(fieldName, fieldText,
						field.getPresentationType(), valueType);
			} else {
				this.m_currentRsDimension.addRsField(fieldName, fieldText,
						presentationType, valueType);
			}
		}
	};
	oFF.RsCursorAxis.prototype.endAddMetadata = function() {
		this.m_currentMetadataTupleElement = null;
		this.m_currentRsDimension = null;
	};
	oFF.RsCursorAxis.prototype.getRsDimensions = function() {
		return this.m_dimensions;
	};
	oFF.RsCursorAxis.prototype.getTuplesCount = function() {
		return this.getProvider().getTuplesCount();
	};
	oFF.RsCursorAxis.prototype.getTuplesCountTotal = function() {
		return this.m_tuplesCountTotal;
	};
	oFF.RsCursorAxis.prototype.setTupleCursorBeforeStart = function() {
		this.m_tupleIndex = -1;
		this.setGlobalFieldCursorBeforeStart();
	};
	oFF.RsCursorAxis.prototype.hasNextTuple = function() {
		return this.m_tupleIndex < this.m_pagingMax - 1;
	};
	oFF.RsCursorAxis.prototype.getProvider = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_provider);
	};
	oFF.RsCursorAxis.prototype.nextTuple = function() {
		++this.m_tupleIndex;
		this.setGlobalFieldCursorBeforeStart();
		this.getProvider().notifyAxisCursorChange(this.m_tupleIndex);
		this.setGlobalFieldCursorBeforeStart();
	};
	oFF.RsCursorAxis.prototype.setTupleCursorToIndex = function(index) {
		this.m_tupleIndex = index;
		this.setGlobalFieldCursorBeforeStart();
		this.getProvider().notifyAxisCursorChange(this.m_tupleIndex);
		this.setGlobalFieldCursorBeforeStart();
	};
	oFF.RsCursorAxis.prototype.getTupleElementsCount = function() {
		return this.m_tupleElementCount;
	};
	oFF.RsCursorAxis.prototype.setTupleElementCursorBeforeStart = function() {
		this.m_tupleElementIndex = -1;
		this.m_currentTupleElement = null;
		this.setFieldValueCursorBeforeStart();
	};
	oFF.RsCursorAxis.prototype.hasNextTupleElement = function() {
		return this.m_tupleElementIndex < this.m_tupleElementCount - 1;
	};
	oFF.RsCursorAxis.prototype.setCurrentTupleElement = function() {
		var newCurrent = this.m_tupleElements.get(this.m_tupleElementIndex);
		this.m_currentTupleElement = oFF.XWeakReferenceUtil
				.getWeakRef(newCurrent);
		return newCurrent;
	};
	oFF.RsCursorAxis.prototype.getCurrentTupleElement = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_currentTupleElement);
	};
	oFF.RsCursorAxis.prototype.nextTupleElement = function() {
		this.m_tupleElementIndex++;
		this.setCurrentTupleElement().setFieldValueCursorBeforeStart();
		return this.getCurrentTupleElement();
	};
	oFF.RsCursorAxis.prototype.setFieldValueCursorBeforeStart = function() {
		if (oFF.notNull(this.m_currentTupleElement)) {
			this.getCurrentTupleElement().setFieldValueCursorBeforeStart();
		}
		this.m_currentCursorFieldValue = null;
	};
	oFF.RsCursorAxis.prototype.hasNextFieldValue = function() {
		return oFF.isNull(this.m_currentTupleElement) ? false : this
				.getCurrentTupleElement().hasNextFieldValue();
	};
	oFF.RsCursorAxis.prototype.nextFieldValue = function() {
		if (oFF.notNull(this.m_currentTupleElement)) {
			this.m_currentCursorFieldValue = this.getCurrentTupleElement()
					.nextFieldValue();
		}
		return this.m_currentCursorFieldValue;
	};
	oFF.RsCursorAxis.prototype.getEffectiveRsFields = function() {
		return this.getRsAxisDef().getEffectiveRsFields();
	};
	oFF.RsCursorAxis.prototype.setGlobalFieldCursorBeforeStart = function() {
		this.m_globalFieldIndex = -1;
		this.setTupleElementCursorBeforeStart();
	};
	oFF.RsCursorAxis.prototype.getGlobalFieldValueCount = function() {
		return this.m_globalFieldValueCount;
	};
	oFF.RsCursorAxis.prototype.hasNextGlobalFieldValue = function() {
		return this.m_globalFieldIndex < this.m_globalFieldValueCount - 1;
	};
	oFF.RsCursorAxis.prototype.nextGlobalFieldValue = function() {
		if (!this.hasNextFieldValue()) {
			oFF.XBooleanUtils.checkTrue(this.hasNextTupleElement(),
					"No more tuple elements");
			this.nextTupleElement();
		}
		this.m_globalFieldIndex++;
		return this.nextFieldValue();
	};
	oFF.RsCursorAxis.prototype.getDate = function() {
		return this.m_currentCursorFieldValue.getDate();
	};
	oFF.RsCursorAxis.prototype.setDate = function(value) {
		this.m_currentCursorFieldValue.setDate(value);
	};
	oFF.RsCursorAxis.prototype.setTime = function(value) {
		this.m_currentCursorFieldValue.setTime(value);
	};
	oFF.RsCursorAxis.prototype.getTime = function() {
		return this.m_currentCursorFieldValue.getTime();
	};
	oFF.RsCursorAxis.prototype.getDateTime = function() {
		return this.m_currentCursorFieldValue.getDateTime();
	};
	oFF.RsCursorAxis.prototype.setDateTime = function(value) {
		this.m_currentCursorFieldValue.setDateTime(value);
	};
	oFF.RsCursorAxis.prototype.getString = function() {
		return this.m_currentCursorFieldValue.getString();
	};
	oFF.RsCursorAxis.prototype.setString = function(value) {
		this.m_currentCursorFieldValue.setString(value);
	};
	oFF.RsCursorAxis.prototype.getInteger = function() {
		return this.m_currentCursorFieldValue.getInteger();
	};
	oFF.RsCursorAxis.prototype.setInteger = function(value) {
		this.m_currentCursorFieldValue.setInteger(value);
	};
	oFF.RsCursorAxis.prototype.getLong = function() {
		return this.m_currentCursorFieldValue.getLong();
	};
	oFF.RsCursorAxis.prototype.setLong = function(value) {
		this.m_currentCursorFieldValue.setLong(value);
	};
	oFF.RsCursorAxis.prototype.getDouble = function() {
		return this.m_currentCursorFieldValue.getDouble();
	};
	oFF.RsCursorAxis.prototype.setDouble = function(value) {
		this.m_currentCursorFieldValue.setDouble(value);
	};
	oFF.RsCursorAxis.prototype.getGeometry = function() {
		return this.m_currentCursorFieldValue.getGeometry();
	};
	oFF.RsCursorAxis.prototype.getPolygon = function() {
		return this.m_currentCursorFieldValue.getPolygon();
	};
	oFF.RsCursorAxis.prototype.setPolygon = function(value) {
		this.m_currentCursorFieldValue.setPolygon(value);
	};
	oFF.RsCursorAxis.prototype.getPoint = function() {
		return this.m_currentCursorFieldValue.getPoint();
	};
	oFF.RsCursorAxis.prototype.setPoint = function(value) {
		this.m_currentCursorFieldValue.setPoint(value);
	};
	oFF.RsCursorAxis.prototype.getTimeSpan = function() {
		return this.m_currentCursorFieldValue.getTimeSpan();
	};
	oFF.RsCursorAxis.prototype.setTimeSpan = function(value) {
		this.m_currentCursorFieldValue.setTimeSpan(value);
	};
	oFF.RsCursorAxis.prototype.getFormattedValue = function() {
		return this.m_currentCursorFieldValue.getFormattedValue();
	};
	oFF.RsCursorAxis.prototype.setFormattedValue = function(formattedValue) {
		this.m_currentCursorFieldValue.setFormattedValue(formattedValue);
	};
	oFF.RsCursorAxis.prototype.getPropertiesValue = function() {
		return this.m_currentCursorFieldValue.getPropertiesValue();
	};
	oFF.RsCursorAxis.prototype.setPropertiesValue = function(properties) {
		this.m_currentCursorFieldValue.setPropertiesValue(properties);
	};
	oFF.RsCursorAxis.prototype.getStructureValue = function() {
		return this.m_currentCursorFieldValue.getStructureValue();
	};
	oFF.RsCursorAxis.prototype.getStructureListValue = function() {
		return this.m_currentCursorFieldValue.getStructureListValue();
	};
	oFF.RsCursorAxis.prototype.setStructureValue = function(value) {
		this.m_currentCursorFieldValue.setStructureValue(value);
	};
	oFF.RsCursorAxis.prototype.setStructureListValue = function(value) {
		this.m_currentCursorFieldValue.setStructureListValue(value);
	};
	oFF.RsCursorAxis.prototype.getErrorValue = function() {
		return this.m_currentCursorFieldValue.getErrorValue();
	};
	oFF.RsCursorAxis.prototype.setErrorValue = function(value) {
		this.m_currentCursorFieldValue.setErrorValue(value);
	};
	oFF.RsCursorAxis.prototype.getValueType = function() {
		return this.m_currentCursorFieldValue.getField().getValueType();
	};
	oFF.RsCursorAxis.prototype.getValue = function() {
		return this.m_currentCursorFieldValue.getValue();
	};
	oFF.RsCursorAxis.prototype.setBoolean = function(value) {
		this.m_currentCursorFieldValue.setBoolean(value);
	};
	oFF.RsCursorAxis.prototype.getBoolean = function() {
		return this.m_currentCursorFieldValue.getBoolean();
	};
	oFF.RsCursorAxis.prototype.getField = function() {
		return this.m_currentCursorFieldValue.getField();
	};
	oFF.RsCursorAxis.prototype.createFieldValueFromCurrentPosition = function() {
		return this.m_currentCursorFieldValue
				.createFieldValueFromCurrentPosition();
	};
	oFF.RsCursorAxis.prototype.getFieldValue = function() {
		return this.m_currentCursorFieldValue;
	};
	oFF.RsCursorAxis.prototype.getDimensionAtCurrentPosition = function() {
		var currentTupleElement = this.getCurrentTupleElement();
		return oFF.isNull(currentTupleElement) ? null : currentTupleElement
				.getDimensionAtCurrentPosition();
	};
	oFF.RsCursorAxis.prototype.getRsDimensionAtCurrentPosition = function() {
		var currentTupleElement = this.getCurrentTupleElement();
		return oFF.isNull(currentTupleElement) ? null : currentTupleElement
				.getRsDimensionAtCurrentPosition();
	};
	oFF.RsCursorAxis.prototype.setDrillState = function(drillState) {
		this.getCurrentTupleElement().setDrillState(drillState);
	};
	oFF.RsCursorAxis.prototype.setDisplayLevel = function(displayLevel) {
		this.getCurrentTupleElement().setDisplayLevel(displayLevel);
	};
	oFF.RsCursorAxis.prototype.setAbsoluteLevel = function(absoluteLevel) {
		this.getCurrentTupleElement().setAbsoluteLevel(absoluteLevel);
	};
	oFF.RsCursorAxis.prototype.getDrillState = function() {
		return this.getCurrentTupleElement().getDrillState();
	};
	oFF.RsCursorAxis.prototype.getDisplayLevel = function() {
		return this.getCurrentTupleElement().getDisplayLevel();
	};
	oFF.RsCursorAxis.prototype.getAbsoluteLevel = function() {
		return this.getCurrentTupleElement().getAbsoluteLevel();
	};
	oFF.RsCursorAxis.prototype.setNodeId = function(nodeId) {
		this.getCurrentTupleElement().setNodeId(nodeId);
	};
	oFF.RsCursorAxis.prototype.getNodeId = function() {
		return this.getCurrentTupleElement().getNodeId();
	};
	oFF.RsCursorAxis.prototype.getDimensionMemberName = function() {
		return this.getCurrentTupleElement().getDimensionMemberName();
	};
	oFF.RsCursorAxis.prototype.setDimensionMemberName = function(name) {
		this.getCurrentTupleElement().setDimensionMemberName(name);
	};
	oFF.RsCursorAxis.prototype.getValueOfHierarchyNavigationKey = function() {
		return this.getCurrentTupleElement().getValueOfHierarchyNavigationKey();
	};
	oFF.RsCursorAxis.prototype.setValueOfHierarchyNavigationKey = function(
			value) {
		this.getCurrentTupleElement().setValueOfHierarchyNavigationKey(value);
	};
	oFF.RsCursorAxis.prototype.setDimensionMemberType = function(type) {
		this.getCurrentTupleElement().setDimensionMemberType(type);
	};
	oFF.RsCursorAxis.prototype.getDimensionMemberType = function() {
		return this.getCurrentTupleElement().getDimensionMemberType();
	};
	oFF.RsCursorAxis.prototype.createDimensionMemberFromCurrentPosition = function() {
		return this.getCurrentTupleElement()
				.createDimensionMemberFromCurrentPosition();
	};
	oFF.RsCursorAxis.prototype.setParentNodeIndex = function(parentIndex) {
		this.getCurrentTupleElement().setParentNodeIndex(parentIndex);
	};
	oFF.RsCursorAxis.prototype.getParentNodeIndex = function() {
		return this.getCurrentTupleElement().getParentNodeIndex();
	};
	oFF.RsCursorAxis.prototype.getNewLineCollection = function() {
		var resultSetContainer;
		if (this.getType() !== oFF.AxisType.ROWS) {
			return null;
		}
		if (oFF.isNull(this.m_cursorResultSet)) {
			return null;
		}
		resultSetContainer = this.getCursorResultSet().getResultSetContainer();
		return oFF.isNull(resultSetContainer) ? null : resultSetContainer
				.getNewLineCollection();
	};
	oFF.RsCursorAxis.prototype.getDimensionMember = function() {
		return this.m_currentCursorFieldValue.getDimensionMember();
	};
	oFF.RsCursorAxis.prototype.getMultiPolygon = function() {
		return this.m_currentCursorFieldValue.getMultiPolygon();
	};
	oFF.RsCursorAxis.prototype.setMultiPolygon = function(value) {
		this.m_currentCursorFieldValue.setMultiPolygon(value);
	};
	oFF.RsCursorAxis.prototype.getLineString = function() {
		return this.m_currentCursorFieldValue.getLineString();
	};
	oFF.RsCursorAxis.prototype.setLineString = function(value) {
		this.m_currentCursorFieldValue.setLineString(value);
	};
	oFF.RsCursorAxis.prototype.getMultiLineString = function() {
		return this.m_currentCursorFieldValue.getMultiLineString();
	};
	oFF.RsCursorAxis.prototype.setMultiLineString = function(value) {
		this.m_currentCursorFieldValue.setMultiLineString(value);
	};
	oFF.RsCursorAxis.prototype.getNull = function() {
		return this.m_currentCursorFieldValue.getNull();
	};
	oFF.RsCursorAxis.prototype.setNullByType = function(nullValueType) {
		this.m_currentCursorFieldValue.setNullByType(nullValueType);
	};
	oFF.RsCursorAxis.prototype.getValueException = function() {
		return this.m_currentCursorFieldValue.getValueException();
	};
	oFF.RsCursorAxis.prototype.setValueException = function(valueException) {
		this.m_currentCursorFieldValue.setValueException(valueException);
	};
	oFF.RsCursorAxis.prototype.getDimensionMemberNameValueException = function() {
		return this.getCurrentTupleElement()
				.getDimensionMemberNameValueException();
	};
	oFF.RsCursorAxis.prototype.setDimensionMemberNameValueException = function(
			valueException) {
		this.getCurrentTupleElement().setDimensionMemberNameValueException(
				valueException);
	};
	oFF.RsCursorAxis.prototype.getType = function() {
		return this.getRsAxisDef().getType();
	};
	oFF.RsCursorAxis.prototype.getRsAxisDef = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_rsDefAxis);
	};
	oFF.RsCursorAxis.prototype.getMultiPoint = function() {
		return this.m_currentCursorFieldValue.getMultiPoint();
	};
	oFF.RsCursorAxis.prototype.setMultiPoint = function(value) {
		this.m_currentCursorFieldValue.setMultiPoint(value);
	};
	oFF.RsCursorAxis.prototype.getAlertLevel = function() {
		return this.m_alertLevel;
	};
	oFF.RsCursorAxis.prototype.getExceptionName = function() {
		return this.m_exceptionName;
	};
	oFF.RsCursorAxis.prototype.setExceptionName = function(exceptionName) {
		this.m_exceptionName = exceptionName;
	};
	oFF.RsCursorAxis.prototype.setAlertLevel = function(alertLevel) {
		this.m_alertLevel = alertLevel;
	};
	oFF.RsCursorAxis.prototype.hasValue = oFF.noSupport;
	oFF.RsCursorAxis.prototype.parseString = oFF.noSupport;
	oFF.RsCursorAxis.prototype.setXValue = function(value) {
		this.copyFrom(oFF.XValueAccess.createWithValue(value));
	};
	oFF.RsCursorAxis.prototype.copyFrom = function(source) {
	};
	oFF.RsCursorAxis.prototype.setChildCount = function(childCount) {
		this.getCurrentTupleElement().setChildCount(childCount);
	};
	oFF.RsCursorAxis.prototype.getChildCount = function() {
		return this.getCurrentTupleElement().getChildCount();
	};
	oFF.RsCursorAxis.prototype.getFieldValueList = function() {
		return this.getCurrentTupleElement().getFieldValueList();
	};
	oFF.RsCursorAxis.prototype.getConvenienceCommands = function() {
		return this.getQueryModel().getConvenienceCommands();
	};
	oFF.RsCursorAxis.prototype.getDimensionAtCurrentPositionFromQueryModel = function() {
		var currentTupleElement = this.getCurrentTupleElement();
		return oFF.isNull(currentTupleElement) ? null : currentTupleElement
				.getDimensionAtCurrentPositionFromQueryModel();
	};
	oFF.ResultsetModule = function() {
	};
	oFF.ResultsetModule.prototype = new oFF.DfModule();
	oFF.ResultsetModule.s_module = null;
	oFF.ResultsetModule.getInstance = function() {
		return oFF.ResultsetModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.ResultsetModule.initVersion = function(version) {
		var timestamp;
		if (oFF.isNull(oFF.ResultsetModule.s_module)) {
			oFF.DfModule.checkInitialized(oFF.OlapApiModule
					.initVersion(version));
			timestamp = oFF.DfModule.start("ResultsetModule...");
			oFF.ResultsetModule.s_module = new oFF.ResultsetModule();
			oFF.RsPagingType.staticSetup();
			oFF.DfModule.stop(timestamp);
		}
		return oFF.ResultsetModule.s_module;
	};
	oFF.ResultsetModule.getInstance();
})(sap.firefly);