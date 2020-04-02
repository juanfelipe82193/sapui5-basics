(function(oFF) {
	oFF.QCmdAbstract = function() {
	};
	oFF.QCmdAbstract.prototype = new oFF.XObjectExt();
	oFF.QCmdAbstract.castParentToCartesianList = function(filterOp) {
		var parent;
		if (oFF.notNull(filterOp)) {
			parent = filterOp.getParent();
			if (oFF.notNull(parent)
					&& parent.getComponentType() === oFF.FilterComponentType.CARTESIAN_LIST) {
				return parent;
			}
		}
		return null;
	};
	oFF.QCmdAbstract.prototype.clearSingleMemberFilterByDimension = function(
			dimension, memberName, comparisonOperator) {
		if (oFF.notNull(dimension)) {
			return this.clearSingleMemberFilterByName(dimension.getName(),
					memberName, comparisonOperator);
		}
		return this;
	};
	oFF.QCmdAbstract.prototype.clearSingleMemberFilter = function(member,
			comparisonOperator) {
		var dimName;
		if (oFF.notNull(member)) {
			dimName = member.getDimension().getName();
			return this.clearSingleMemberFilterByName(dimName,
					member.getName(), comparisonOperator);
		}
		return this;
	};
	oFF.QCmdAbstract.prototype.addSingleMemberVisibilityFilterByDimension = function(
			dimension, memberName, comparisonOperator) {
		if (oFF.notNull(dimension)) {
			return this.addSingleMemberVisibilityFilterByDimensionName(
					dimension.getName(), memberName, comparisonOperator);
		}
		return null;
	};
	oFF.QCmdAbstract.prototype.addSingleMemberFilterByDimension = function(
			dimension, memberName, comparisonOperator) {
		if (oFF.notNull(dimension)) {
			return this.addSingleMemberFilterByDimensionName(dimension
					.getName(), memberName, comparisonOperator);
		}
		return null;
	};
	oFF.QCmdAbstract.prototype.clearFilters = function() {
		return this.clearAllFiltersExt(oFF.FilterLayer.DYNAMIC,
				oFF.FilterScopeVariables.IGNORE);
	};
	oFF.QCmdAbstract.prototype.clearVisibilityFilters = function() {
		return this.clearAllFiltersExt(oFF.FilterLayer.VISIBILITY,
				oFF.FilterScopeVariables.IGNORE);
	};
	oFF.QCmdAbstract.prototype.clearFiltersNotAffectedByVariables = function() {
		return this.clearAllFiltersExt(oFF.FilterLayer.DYNAMIC,
				oFF.FilterScopeVariables.NOT_AFFECTED_BY_VARIABLES);
	};
	oFF.QCmdAbstract.prototype.clearFiltersNotCreatedByVariables = function() {
		return this.clearAllFiltersExt(oFF.FilterLayer.DYNAMIC,
				oFF.FilterScopeVariables.NOT_CREATED_BY_VARIABLES);
	};
	oFF.QCmdAbstract.prototype.clearMeasureFilters = function() {
		return this.clearFiltersByDimensionExt(oFF.FilterLayer.DYNAMIC,
				oFF.DimensionType.MEASURE_STRUCTURE, null);
	};
	oFF.QCmdAbstract.prototype.clearFiltersByDimensionName = function(dimName) {
		return this.clearFiltersByDimensionExt(oFF.FilterLayer.DYNAMIC, null,
				dimName);
	};
	oFF.QCmdAbstract.prototype.clearVisibilityFiltersByDimensionName = function(
			dimName) {
		return this.clearFiltersByDimensionExt(oFF.FilterLayer.VISIBILITY,
				null, dimName);
	};
	oFF.QCmdAbstract.prototype.clearFiltersByDimension = function(dimension) {
		if (oFF.notNull(dimension)) {
			return this.clearFiltersByDimensionExt(oFF.FilterLayer.DYNAMIC,
					null, dimension.getName());
		}
		return this;
	};
	oFF.QCmdAbstract.prototype.clearVisibilityFiltersByDimension = function(
			dimension) {
		if (oFF.notNull(dimension)) {
			return this.clearFiltersByDimensionExt(oFF.FilterLayer.VISIBILITY,
					null, dimension.getName());
		}
		return this;
	};
	oFF.QCmdAbstract.prototype.clearFilterById = function(uniqueId) {
		return this.clearFilterByIdExt(oFF.FilterLayer.DYNAMIC, uniqueId);
	};
	oFF.QCmdAbstract.prototype.clearVisibilityFilterById = function(uniqueId) {
		return this.clearFilterByIdExt(oFF.FilterLayer.VISIBILITY, uniqueId);
	};
	oFF.QCmdAbstract.prototype.addSimpleSingleMemberFilter = function(dimName,
			memberName) {
		return this.addSingleMemberFilterByDimensionName(dimName, memberName,
				oFF.ComparisonOperator.EQUAL);
	};
	oFF.QCmdAbstract.prototype.addSearchForKeyUsingDynamicFilter = function(
			dimension, searchValue) {
		return oFF.isNull(dimension) ? null : dimension
				.addSearchForKeyUsingDynamicFilter(searchValue);
	};
	oFF.QCmdAbstract.prototype.addSearchForTextUsingDynamicFilter = function(
			dimension, searchValue) {
		return oFF.isNull(dimension) ? null : dimension
				.addSearchForTextUsingDynamicFilter(searchValue);
	};
	oFF.QCmdAbstract.prototype.addSingleMeasureFilter = function(measureName) {
		return this.addSingleMemberFilter(oFF.FilterLayer.DYNAMIC,
				oFF.DimensionType.MEASURE_STRUCTURE, null, measureName,
				oFF.ComparisonOperator.EQUAL);
	};
	oFF.QCmdAbstract.prototype.addSingleMeasureVisibilityFilter = function(
			measureName) {
		return this.addSingleMemberFilter(oFF.FilterLayer.VISIBILITY,
				oFF.DimensionType.MEASURE_STRUCTURE, null, measureName,
				oFF.ComparisonOperator.EQUAL);
	};
	oFF.QCmdAbstract.prototype.addSingleStructureMemberFilterByType = function(
			structureType, structureMemberName, comparisonOperator) {
		return this.addSingleMemberFilter(oFF.FilterLayer.DYNAMIC,
				structureType, null, structureMemberName, comparisonOperator);
	};
	oFF.QCmdAbstract.prototype.addSingleStructureMemberVisibilityFilterByType = function(
			structureType, structureMemberName, comparisonOperator) {
		return this.addSingleMemberFilter(oFF.FilterLayer.VISIBILITY,
				structureType, null, structureMemberName, comparisonOperator);
	};
	oFF.QCmdAbstract.prototype.addSingleMemberFilterByDimensionMember = function(
			dimensionMember, comparisonOperator) {
		return this.addSingleMemberFilter(oFF.FilterLayer.DYNAMIC, null,
				dimensionMember.getDimension().getName(), dimensionMember
						.getName(), comparisonOperator);
	};
	oFF.QCmdAbstract.prototype.addSingleMemberVisibilityFilterByDimensionMember = function(
			dimensionMember, comparisonOperator) {
		return this.addSingleMemberFilter(oFF.FilterLayer.VISIBILITY, null,
				dimensionMember.getDimension().getName(), dimensionMember
						.getName(), comparisonOperator);
	};
	oFF.QCmdAbstract.prototype.addSingleMemberFilterByDimensionName = function(
			dimName, memberName, comparisonOperator) {
		return this.addSingleMemberFilter(oFF.FilterLayer.DYNAMIC, null,
				dimName, memberName, comparisonOperator);
	};
	oFF.QCmdAbstract.prototype.addSingleMemberVisibilityFilterByDimensionName = function(
			dimName, memberName, comparisonOperator) {
		return this.addSingleMemberFilter(oFF.FilterLayer.VISIBILITY, null,
				dimName, memberName, comparisonOperator);
	};
	oFF.QCmdAbstract.prototype.addIntervallFilterByIntegerValues = function(
			dimensionName, lowValue, highValue) {
		return this.addIntervallFilterByStringValues(dimensionName,
				oFF.XInteger.convertToString(lowValue), oFF.XInteger
						.convertToString(highValue));
	};
	oFF.QCmdAbstract.prototype.addIntervallFilterByLongValues = function(
			dimensionName, lowValue, highValue) {
		return this.addIntervallFilterByStringValues(dimensionName, oFF.XLong
				.convertToString(lowValue), oFF.XLong
				.convertToString(highValue));
	};
	oFF.QCmdAbstract.prototype.addIntervallFilterByStringValues = function(
			dimensionName, lowValue, highValue) {
		var filterOp = this.addFilter(oFF.FilterLayer.DYNAMIC, null,
				dimensionName, null, null, lowValue, highValue,
				oFF.ComparisonOperator.BETWEEN);
		return oFF.QCmdAbstract.castParentToCartesianList(filterOp);
	};
	oFF.QCmdAbstract.prototype.addIntervallVisibilityFilterByStringValues = function(
			dimensionName, lowValue, highValue) {
		var filterOp = this.addFilter(oFF.FilterLayer.VISIBILITY, null,
				dimensionName, null, null, lowValue, highValue,
				oFF.ComparisonOperator.BETWEEN);
		return oFF.QCmdAbstract.castParentToCartesianList(filterOp);
	};
	oFF.QCmdAbstract.prototype.moveDimensionToRows = function(dimName) {
		return this.moveDimensionToAxis(dimName, oFF.AxisType.ROWS);
	};
	oFF.QCmdAbstract.prototype.moveDimensionToColumns = function(dimName) {
		return this.moveDimensionToAxis(dimName, oFF.AxisType.COLUMNS);
	};
	oFF.QCmdAbstract.prototype.moveDimensionToFree = function(dimName) {
		return this.moveDimensionToAxis(dimName, oFF.AxisType.FREE);
	};
	oFF.QCmdAbstract.prototype.moveMeasureDimensionToAxis = function(targetAxis) {
		return this.moveDimensionByTypeToAxis(
				oFF.DimensionType.MEASURE_STRUCTURE, targetAxis);
	};
	oFF.QCmdAbstract.prototype.moveDimensionByTypeToAxis = function(dimType,
			targetAxis) {
		return this.moveDimensionExt(dimType, null, targetAxis, -1);
	};
	oFF.QCmdAbstract.prototype.moveDimensionOnAxisTo = function(dimName,
			targetAxis, index) {
		return this.moveDimensionExt(null, dimName, targetAxis, index);
	};
	oFF.QCmdAbstract.prototype.moveDimensionToAxis = function(dimName,
			targetAxis) {
		return this.moveDimensionExt(null, dimName, targetAxis, -1);
	};
	oFF.QCmdAbstract.prototype.addDimension = function(dimName) {
		return this.moveDimensionExt(null, dimName, oFF.AxisType.ROWS, -1);
	};
	oFF.QCmdAbstract.prototype.addAllDimensionFieldsToResultSet = function() {
		return this.addAllFieldsToModelArea(oFF.QContextType.RESULT_SET);
	};
	oFF.QCmdAbstract.prototype.addAllDimensionFieldsToSelector = function() {
		return this.addAllFieldsToModelArea(oFF.QContextType.SELECTOR);
	};
	oFF.QCmdAbstract.prototype.clearAllDimensionFieldsFromResultSet = function() {
		return this.clearAllFieldsFromModelArea(oFF.QContextType.RESULT_SET);
	};
	oFF.QCmdAbstract.prototype.clearAllDimensionFieldsFromSelector = function() {
		return this.clearAllFieldsFromModelArea(oFF.QContextType.SELECTOR);
	};
	oFF.QCmdAbstract.prototype.addAllFieldsToResultSet = function(dimName) {
		return this.addAllFieldsOfDimensionToModelArea(dimName,
				oFF.QContextType.RESULT_SET);
	};
	oFF.QCmdAbstract.prototype.addAllFieldsToSelector = function(dimName) {
		return this.addAllFieldsOfDimensionToModelArea(dimName,
				oFF.QContextType.SELECTOR);
	};
	oFF.QCmdAbstract.prototype.addFieldToResultSet = function(dimName,
			fieldName) {
		return this.addField(null, dimName, null, fieldName,
				oFF.QContextType.RESULT_SET);
	};
	oFF.QCmdAbstract.prototype.addFieldToSelector = function(dimName, fieldName) {
		return this.addField(null, dimName, null, fieldName,
				oFF.QContextType.SELECTOR);
	};
	oFF.QCmdAbstract.prototype.clearAllResultSetFields = function(dimName) {
		return this.clearFields(null, dimName, oFF.QContextType.RESULT_SET);
	};
	oFF.QCmdAbstract.prototype.clearAllSelectorFields = function(dimName) {
		return this.clearFields(null, dimName, oFF.QContextType.SELECTOR);
	};
	oFF.QCmdAbstract.prototype.clearAllFields = function(dimName, contextType) {
		return this.clearFields(null, dimName, contextType);
	};
	oFF.QCmdAbstract.prototype.clearFieldFromResultSet = function(dimName,
			fieldName) {
		return this.removeField(null, dimName, null, fieldName,
				oFF.QContextType.RESULT_SET);
	};
	oFF.QCmdAbstract.prototype.clearFieldFromSelector = function(dimName,
			fieldName) {
		return this.removeField(null, dimName, null, fieldName,
				oFF.QContextType.SELECTOR);
	};
	oFF.QCmdAbstract.prototype.containsResultSetField = function(dimName,
			fieldName) {
		return this.containsField(dimName, fieldName,
				oFF.QContextType.RESULT_SET);
	};
	oFF.QCmdAbstract.prototype.containsSelectorField = function(dimName,
			fieldName) {
		return this
				.containsField(dimName, fieldName, oFF.QContextType.SELECTOR);
	};
	oFF.QCmdAbstract.prototype.addPresentation = function(dimType, dimName,
			presentationType, contextType) {
		return this.addField(dimType, dimName, presentationType, null,
				contextType);
	};
	oFF.QCmdAbstract.prototype.addMeasureFieldByTypeToResultSet = function(
			presentationType) {
		return this.addPresentation(oFF.DimensionType.MEASURE_STRUCTURE, null,
				presentationType, oFF.QContextType.RESULT_SET);
	};
	oFF.QCmdAbstract.prototype.addMeasureFieldByTypeToSelector = function(
			presentationType) {
		return this.addPresentation(oFF.DimensionType.MEASURE_STRUCTURE, null,
				presentationType, oFF.QContextType.SELECTOR);
	};
	oFF.QCmdAbstract.prototype.addFieldByTypeToResultSet = function(dimName,
			presentationType) {
		return this.addPresentation(null, dimName, presentationType,
				oFF.QContextType.RESULT_SET);
	};
	oFF.QCmdAbstract.prototype.addFieldByTypeToSelector = function(dimName,
			presentationType) {
		return this.addPresentation(null, dimName, presentationType,
				oFF.QContextType.SELECTOR);
	};
	oFF.QCmdAbstract.prototype.clearMeasureFieldByTypeFromResultSet = function(
			presentationType) {
		return this.removePresentation(oFF.DimensionType.MEASURE_STRUCTURE,
				null, presentationType, oFF.QContextType.RESULT_SET);
	};
	oFF.QCmdAbstract.prototype.clearMeasureFieldByTypeFromSelector = function(
			presentationType) {
		return this.removePresentation(oFF.DimensionType.MEASURE_STRUCTURE,
				null, presentationType, oFF.QContextType.SELECTOR);
	};
	oFF.QCmdAbstract.prototype.removePresentation = function(dimType, dimName,
			presentationType, contextType) {
		return this.removeField(dimType, dimName, presentationType, null,
				contextType);
	};
	oFF.QCmdAbstract.prototype.clearFieldByTypeFromResultSet = function(
			dimName, presentationType) {
		return this.removePresentation(null, dimName, presentationType,
				oFF.QContextType.RESULT_SET);
	};
	oFF.QCmdAbstract.prototype.clearFieldByTypeFromSelector = function(dimName,
			presentationType) {
		return this.removePresentation(null, dimName, presentationType,
				oFF.QContextType.SELECTOR);
	};
	oFF.QCmdAbstract.prototype.showKey = function(dimName) {
		this.setField(null, dimName, oFF.PresentationType.ACTIVE_KEY, null,
				oFF.QContextType.RESULT_SET);
		return this;
	};
	oFF.QCmdAbstract.prototype.showText = function(dimName) {
		this.setField(null, dimName, oFF.PresentationType.ACTIVE_TEXT, null,
				oFF.QContextType.RESULT_SET);
		return this;
	};
	oFF.QCmdAbstract.prototype.showKeyAndText = function(dimName) {
		this.queueEventing();
		this.clearAllFields(dimName, oFF.QContextType.RESULT_SET);
		this.addPresentation(null, dimName, oFF.PresentationType.ACTIVE_KEY,
				oFF.QContextType.RESULT_SET);
		this.addPresentation(null, dimName, oFF.PresentationType.ACTIVE_TEXT,
				oFF.QContextType.RESULT_SET);
		this.resumeEventing();
		return this;
	};
	oFF.QCmdAbstract.prototype.showTextAndKey = function(dimName) {
		this.queueEventing();
		this.clearAllFields(dimName, oFF.QContextType.RESULT_SET);
		this.addPresentation(null, dimName, oFF.PresentationType.ACTIVE_TEXT,
				oFF.QContextType.RESULT_SET);
		this.addPresentation(null, dimName, oFF.PresentationType.ACTIVE_KEY,
				oFF.QContextType.RESULT_SET);
		this.resumeEventing();
		return this;
	};
	oFF.QCmdAbstract.prototype.alignTotalsOnTop = function(totalsController) {
		return this.alignTotals(totalsController.getModelLevel(),
				totalsController.getName(), oFF.ResultAlignment.TOP);
	};
	oFF.QCmdAbstract.prototype.alignTotalsOnBottom = function(totalsController) {
		return this.alignTotals(totalsController.getModelLevel(),
				totalsController.getName(), oFF.ResultAlignment.BOTTOM);
	};
	oFF.QCmdAbstract.prototype.alignTotalsOnTopAndBottom = function(
			totalsController) {
		return this.alignTotals(totalsController.getModelLevel(),
				totalsController.getName(), oFF.ResultAlignment.TOPBOTTOM);
	};
	oFF.QCmdAbstract.prototype.alignTotalsOnDefault = function(totalsController) {
		return this.alignTotals(totalsController.getModelLevel(),
				totalsController.getName(), null);
	};
	oFF.QCmdAbstract.prototype.setTotalsVisibleOnDimension = function(dimName,
			visibility) {
		return this.setTotalsVisible(oFF.QModelLevel.DIMENSIONS, dimName,
				visibility);
	};
	oFF.QCmdAbstract.prototype.setTotalsVisibleOnAxis = function(axisType,
			visibility) {
		if (oFF.notNull(axisType)) {
			return this.setTotalsVisible(oFF.QModelLevel.AXES, axisType
					.getName(), visibility);
		}
		return this;
	};
	oFF.QCmdAbstract.prototype.clearSorting = function() {
		return this.clearSort(null, null);
	};
	oFF.QCmdAbstract.prototype.clearDimensionSort = function(dimName) {
		return this.clearSort(oFF.SortType.ABSTRACT_DIMENSION_SORT, dimName);
	};
	oFF.QCmdAbstract.prototype.sortByKey = function(dimName, direction) {
		return this.sort(oFF.SortType.MEMBER_KEY, null, dimName, null, null,
				null, direction);
	};
	oFF.QCmdAbstract.prototype.sortByText = function(dimName, direction) {
		return this.sort(oFF.SortType.MEMBER_TEXT, null, dimName, null, null,
				null, direction);
	};
	oFF.QCmdAbstract.prototype.sortByHierarchy = function(dimName, direction) {
		return this.sort(oFF.SortType.HIERARCHY, null, dimName, null, null,
				null, direction);
	};
	oFF.QCmdAbstract.prototype.sortByMeasure = function(measureName, direction) {
		return this.sort(oFF.SortType.MEASURE, null, null, null, null,
				measureName, direction);
	};
	oFF.QCmdAbstract.prototype.sortByField = function(fieldName, direction) {
		return this.sort(oFF.SortType.FIELD, null, null, null, fieldName, null,
				direction);
	};
	oFF.QCmdAbstract.prototype.cloneOlapComponent = oFF.noSupport;
	oFF.QCmdContext = function() {
	};
	oFF.QCmdContext.prototype = new oFF.QCmdAbstract();
	oFF.QCmdContext.createDummyContext = function() {
		return new oFF.QCmdContext();
	};
	oFF.QCmdContext.prototype.m_target = null;
	oFF.QCmdContext.prototype.releaseObject = function() {
		this.m_target = null;
		oFF.QCmdAbstract.prototype.releaseObject.call(this);
	};
	oFF.QCmdContext.prototype.getOlapComponentType = function() {
		return null;
	};
	oFF.QCmdContext.prototype.setActiveComponent = function(component) {
		return false;
	};
	oFF.QCmdContext.prototype.setTarget = function(target) {
		this.m_target = target;
	};
	oFF.QCmdContext.prototype.getComponentType = function() {
		return oFF.notNull(this.m_target) ? this.m_target.getComponentType()
				: null;
	};
	oFF.QCmdContext.prototype.getOlapEnv = function() {
		return oFF.notNull(this.m_target) ? this.m_target.getOlapEnv() : null;
	};
	oFF.QCmdContext.prototype.getApplication = function() {
		return oFF.notNull(this.m_target) ? this.m_target.getApplication()
				: null;
	};
	oFF.QCmdContext.prototype.getSession = function() {
		return oFF.notNull(this.m_target) ? this.m_target.getSession() : null;
	};
	oFF.QCmdContext.prototype.select = function(sigSelExpression) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.select(sigSelExpression);
		}
		return this;
	};
	oFF.QCmdContext.prototype.getQueryModel = function() {
		return oFF.notNull(this.m_target) ? this.m_target.getQueryModel()
				: null;
	};
	oFF.QCmdContext.prototype.getDataSource = function() {
		return oFF.notNull(this.m_target) ? this.m_target.getDataSource()
				: null;
	};
	oFF.QCmdContext.prototype.getQueryManager = function() {
		return oFF.notNull(this.m_target) ? this.m_target.getQueryManager()
				: null;
	};
	oFF.QCmdContext.prototype.getQueryServiceConfig = function() {
		return oFF.notNull(this.m_target) ? this.m_target
				.getQueryServiceConfig() : null;
	};
	oFF.QCmdContext.prototype.getDimensionAccessor = function() {
		return oFF.notNull(this.m_target) ? this.m_target
				.getDimensionAccessor() : null;
	};
	oFF.QCmdContext.prototype.getDimension = function(dimName) {
		return oFF.notNull(this.m_target) ? this.m_target.getDimension(dimName)
				: null;
	};
	oFF.QCmdContext.prototype.getField = function(name) {
		return oFF.notNull(this.m_target) ? this.m_target.getField(name) : null;
	};
	oFF.QCmdContext.prototype.getMeasure = function(name) {
		return oFF.notNull(this.m_target) ? this.m_target.getMeasure(name)
				: null;
	};
	oFF.QCmdContext.prototype.getFieldAccessorSingle = function() {
		return oFF.notNull(this.m_target) ? this.m_target
				.getFieldAccessorSingle() : null;
	};
	oFF.QCmdContext.prototype.getModelCapabilities = function() {
		return oFF.notNull(this.m_target) ? this.m_target
				.getModelCapabilities() : null;
	};
	oFF.QCmdContext.prototype.getFirstGISDimension = function() {
		return oFF.notNull(this.m_target) ? this.m_target
				.getFirstGISDimension() : null;
	};
	oFF.QCmdContext.prototype.getFirstDimensionWithType = function(
			dimensionType) {
		return oFF.notNull(this.m_target) ? this.m_target
				.getFirstDimensionWithType(dimensionType) : null;
	};
	oFF.QCmdContext.prototype.getGISAttributesForDimension = function(dim) {
		return oFF.notNull(this.m_target) ? this.m_target
				.getGISAttributesForDimension(dim) : null;
	};
	oFF.QCmdContext.prototype.getDimensionsContainingValueType = function(
			valueType) {
		return oFF.notNull(this.m_target) ? this.m_target
				.getDimensionsContainingValueType(valueType) : null;
	};
	oFF.QCmdContext.prototype.getDrillManager = function() {
		return oFF.notNull(this.m_target) ? this.m_target.getDrillManager()
				: null;
	};
	oFF.QCmdContext.prototype.registerChangedListener = function(listener,
			customIdentifier) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.registerChangedListener(listener,
					customIdentifier);
		}
		return this;
	};
	oFF.QCmdContext.prototype.unregisterChangedListener = function(listener) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.unregisterChangedListener(listener);
		}
		return this;
	};
	oFF.QCmdContext.prototype.getSenderBindings = function() {
		return oFF.notNull(this.m_target) ? this.m_target.getSenderBindings()
				: null;
	};
	oFF.QCmdContext.prototype.getReceiverBindings = function() {
		return oFF.notNull(this.m_target) ? this.m_target.getReceiverBindings()
				: null;
	};
	oFF.QCmdContext.prototype.newSenderBinding = function(type, protocol) {
		if (oFF.notNull(this.m_target)) {
			this.m_target.newSenderBinding(type, protocol);
		}
		return null;
	};
	oFF.QCmdContext.prototype.getReceiverProtocolBindings = function(type) {
		return oFF.notNull(this.m_target) ? this.m_target
				.getReceiverProtocolBindings(type) : null;
	};
	oFF.QCmdContext.prototype.getSenderProtocolBindings = function(type) {
		return oFF.notNull(this.m_target) ? this.m_target
				.getSenderProtocolBindings(type) : null;
	};
	oFF.QCmdContext.prototype.newReceiverBinding = function(type, protocol) {
		if (oFF.notNull(this.m_target)) {
			this.m_target.newReceiverBinding(type, protocol);
		}
		return null;
	};
	oFF.QCmdContext.prototype.reset = function() {
		if (oFF.notNull(this.m_target)) {
			this.m_target.reset();
		}
		return this.m_target;
	};
	oFF.QCmdContext.prototype.resetToDefault = function() {
		if (oFF.notNull(this.m_target)) {
			this.m_target.resetToDefault();
		}
		return this.m_target;
	};
	oFF.QCmdContext.prototype.addFilter = function(filterLayer, dimType,
			dimName, presentationType, fieldName, lowValue, highValue,
			comparisonOperator) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.addFilter(filterLayer, dimType, dimName,
					presentationType, fieldName, lowValue, highValue,
					comparisonOperator);
		}
		return null;
	};
	oFF.QCmdContext.prototype.clearNonMeasureFilters = function() {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.clearNonMeasureFilters();
		}
		return this;
	};
	oFF.QCmdContext.prototype.clearNonStructureFilters = function() {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.clearNonStructureFilters();
		}
		return this;
	};
	oFF.QCmdContext.prototype.clearAllFiltersExt = function(filterLayer,
			filterScopeVariables) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.clearAllFiltersExt(filterLayer,
					filterScopeVariables);
		}
		return this;
	};
	oFF.QCmdContext.prototype.clearFiltersByDimensionExt = function(
			filterLayer, dimType, dimName) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.clearFiltersByDimensionExt(filterLayer,
					dimType, dimName);
		}
		return this;
	};
	oFF.QCmdContext.prototype.clearSingleMemberFilterByName = function(dimName,
			memberName, comparisonOperator) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.clearSingleMemberFilterByName(dimName,
					memberName, comparisonOperator);
		}
		return this;
	};
	oFF.QCmdContext.prototype.clearFilterByIdExt = function(filterLayer,
			uniqueId) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.clearFilterByIdExt(filterLayer, uniqueId);
		}
		return this;
	};
	oFF.QCmdContext.prototype.addSingleMemberFilter = function(filterLayer,
			dimType, dimName, memberName, comparisonOperator) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addSingleMemberFilter(filterLayer, dimType, dimName,
						memberName, comparisonOperator) : null;
	};
	oFF.QCmdContext.prototype.addSingleNodeFilter = function(node,
			comparisonOperator) {
		return oFF.notNull(this.m_target) ? this.m_target.addSingleNodeFilter(
				node, comparisonOperator) : null;
	};
	oFF.QCmdContext.prototype.addStringFilterByField = function(field,
			filterValue, comparisonOperator) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addStringFilterByField(field, filterValue, comparisonOperator)
				: null;
	};
	oFF.QCmdContext.prototype.addFilterByFieldAndValue = function(field,
			filterValue, comparisonOperator) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addFilterByFieldAndValue(field, filterValue,
						comparisonOperator) : null;
	};
	oFF.QCmdContext.prototype.addStringFilterByFieldNameAndOperator = function(
			dimensionName, fieldName, filterValue, comparisonOperator) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addStringFilterByFieldNameAndOperator(dimensionName,
						fieldName, filterValue, comparisonOperator) : null;
	};
	oFF.QCmdContext.prototype.addIntFilterByFieldName = function(dimensionName,
			fieldName, filterValue, comparisonOperator) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addIntFilterByFieldName(dimensionName, fieldName, filterValue,
						comparisonOperator) : null;
	};
	oFF.QCmdContext.prototype.addIntFilterByField = function(field,
			filterValue, comparisonOperator) {
		return oFF.notNull(this.m_target) ? this.m_target.addIntFilterByField(
				field, filterValue, comparisonOperator) : null;
	};
	oFF.QCmdContext.prototype.addDoubleFilterByFieldName = function(
			dimensionName, fieldName, filterValue, comparisonOperator) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addDoubleFilterByFieldName(dimensionName, fieldName,
						filterValue, comparisonOperator) : null;
	};
	oFF.QCmdContext.prototype.addDoubleFilterByField = function(field,
			filterValue, comparisonOperator) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addDoubleFilterByField(field, filterValue, comparisonOperator)
				: null;
	};
	oFF.QCmdContext.prototype.addLongFilterByFieldName = function(
			dimensionName, fieldName, filterValue, comparisonOperator) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addLongFilterByFieldName(dimensionName, fieldName,
						filterValue, comparisonOperator) : null;
	};
	oFF.QCmdContext.prototype.addLongFilterByField = function(field,
			filterValue, comparisonOperator) {
		return oFF.notNull(this.m_target) ? this.m_target.addLongFilterByField(
				field, filterValue, comparisonOperator) : null;
	};
	oFF.QCmdContext.prototype.addStringFilterByName = function(dimensionName,
			fieldName, filterValue, comparisonOperator) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addStringFilterByName(dimensionName, fieldName, filterValue,
						comparisonOperator) : null;
	};
	oFF.QCmdContext.prototype.addStringFilterByPresentation = function(
			dimensionName, presentationType, filterValue, comparisonOperator) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addStringFilterByPresentation(dimensionName, presentationType,
						filterValue, comparisonOperator) : null;
	};
	oFF.QCmdContext.prototype.addIntervalFilterByValues = function(
			dimensionName, lowValue, highValue) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addIntervalFilterByValues(dimensionName, lowValue, highValue)
				: null;
	};
	oFF.QCmdContext.prototype.setSearchTerm = function(searchTerm) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.setSearchTerm(searchTerm);
		}
		return this;
	};
	oFF.QCmdContext.prototype.addWithinDistanceFilter = function(dimension,
			fieldName, point, distance, unit) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addWithinDistanceFilter(dimension, fieldName, point, distance,
						unit) : null;
	};
	oFF.QCmdContext.prototype.addIntersectsRectFilter = function(dimension,
			fieldName, lowerLeft, upperRight) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addIntersectsRectFilter(dimension, fieldName, lowerLeft,
						upperRight) : null;
	};
	oFF.QCmdContext.prototype.addContainsGeometryFilter = function(dimension,
			fieldName, geometry) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addContainsGeometryFilter(dimension, fieldName, geometry)
				: null;
	};
	oFF.QCmdContext.prototype.addIntersectsGeometryFilter = function(dimension,
			fieldName, geometry) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addIntersectsGeometryFilter(dimension, fieldName, geometry)
				: null;
	};
	oFF.QCmdContext.prototype.addCoversGeometryFilter = function(dimension,
			fieldName, geometry) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addCoversGeometryFilter(dimension, fieldName, geometry) : null;
	};
	oFF.QCmdContext.prototype.addCrossesLinestringFilter = function(dimension,
			fieldName, geometry) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addCrossesLinestringFilter(dimension, fieldName, geometry)
				: null;
	};
	oFF.QCmdContext.prototype.addDisjointGeometryFilter = function(dimension,
			fieldName, geometry) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addDisjointGeometryFilter(dimension, fieldName, geometry)
				: null;
	};
	oFF.QCmdContext.prototype.addOverlapsGeometryFilter = function(dimension,
			fieldName, geometry) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addOverlapsGeometryFilter(dimension, fieldName, geometry)
				: null;
	};
	oFF.QCmdContext.prototype.addTouchesGeometryFilter = function(dimension,
			fieldName, geometry) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addTouchesGeometryFilter(dimension, fieldName, geometry)
				: null;
	};
	oFF.QCmdContext.prototype.addWithinGeometryFilter = function(dimension,
			fieldName, geometry) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addWithinGeometryFilter(dimension, fieldName, geometry) : null;
	};
	oFF.QCmdContext.prototype.getFilterById = function(uniqueId) {
		return oFF.notNull(this.m_target) ? this.m_target
				.getFilterById(uniqueId) : null;
	};
	oFF.QCmdContext.prototype.getVisibilityFilterById = function(uniqueId) {
		return oFF.notNull(this.m_target) ? this.m_target
				.getVisibilityFilterById(uniqueId) : null;
	};
	oFF.QCmdContext.prototype.addFilterByField = function(field, firstValue,
			secondValue, thirdValue, comparisonOperator, isVisibility) {
		return oFF.notNull(this.m_target) ? this.m_target.addFilterByField(
				field, firstValue, secondValue, thirdValue, comparisonOperator,
				isVisibility) : null;
	};
	oFF.QCmdContext.prototype.getVariablesNameAndText = function() {
		return oFF.notNull(this.m_target) ? this.m_target
				.getVariablesNameAndText() : null;
	};
	oFF.QCmdContext.prototype.setVariable = function(name, value) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.setVariable(name, value);
		}
		return this;
	};
	oFF.QCmdContext.prototype.submitVariables = function() {
		return oFF.notNull(this.m_target) ? this.m_target.submitVariables()
				: null;
	};
	oFF.QCmdContext.prototype.getVariable = function(name) {
		return oFF.notNull(this.m_target) ? this.m_target.getVariable(name)
				: null;
	};
	oFF.QCmdContext.prototype.getVariableContainer = function() {
		return oFF.notNull(this.m_target) ? this.m_target
				.getVariableContainer() : null;
	};
	oFF.QCmdContext.prototype.switchAxes = function() {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.switchAxes();
		}
		return this;
	};
	oFF.QCmdContext.prototype.clearAxis = function(targetAxis) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.clearAxis(targetAxis);
		}
		return this;
	};
	oFF.QCmdContext.prototype.setDimensionsAndMeasures = function(dimNames,
			measures) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.setDimensionsAndMeasures(dimNames, measures);
		}
		return this;
	};
	oFF.QCmdContext.prototype.setDimensionAndMeasure = function(dimName,
			measure) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.setDimensionAndMeasure(dimName, measure);
		}
		return this;
	};
	oFF.QCmdContext.prototype.moveDimensionExt = function(dimType, dimName,
			targetAxis, index) {
		return oFF.notNull(this.m_target) ? this.m_target.moveDimensionExt(
				dimType, dimName, targetAxis, index) : null;
	};
	oFF.QCmdContext.prototype.addAllDimensions = function() {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.addAllDimensions();
		}
		return this;
	};
	oFF.QCmdContext.prototype.addAttributeToResultSet = function(dimName,
			attributeName) {
		return oFF.notNull(this.m_target) ? this.m_target
				.addAttributeToResultSet(dimName, attributeName) : null;
	};
	oFF.QCmdContext.prototype.removeAttributeFromResultSet = function(dimName,
			attributeName) {
		return oFF.notNull(this.m_target) ? this.m_target
				.removeAttributeFromResultSet(dimName, attributeName) : null;
	};
	oFF.QCmdContext.prototype.addField = function(dimType, dimName,
			presentationType, fieldName, contextType) {
		return oFF.notNull(this.m_target) ? this.m_target.addField(dimType,
				dimName, presentationType, fieldName, contextType) : null;
	};
	oFF.QCmdContext.prototype.setField = function(dimType, dimName,
			presentationType, fieldName, contextType) {
		return oFF.notNull(this.m_target) ? this.m_target.setField(dimType,
				dimName, presentationType, fieldName, contextType) : null;
	};
	oFF.QCmdContext.prototype.addAllFieldsToModelArea = function(contextType) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.addAllFieldsToModelArea(contextType);
		}
		return this;
	};
	oFF.QCmdContext.prototype.clearAllFieldsFromModelArea = function(
			contextType) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.clearAllFieldsFromModelArea(contextType);
		}
		return this;
	};
	oFF.QCmdContext.prototype.addAllFieldsOfDimensionToModelArea = function(
			dimName, contextType) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.addAllFieldsOfDimensionToModelArea(dimName,
					contextType);
		}
		return this;
	};
	oFF.QCmdContext.prototype.clearFields = function(dimType, dimName,
			contextType) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.clearFields(dimType, dimName, contextType);
		}
		return this;
	};
	oFF.QCmdContext.prototype.removeField = function(dimType, dimName,
			presentationType, fieldName, contextType) {
		return oFF.notNull(this.m_target) ? this.m_target.removeField(dimType,
				dimName, presentationType, fieldName, contextType) : null;
	};
	oFF.QCmdContext.prototype.containsField = function(dimName, fieldName,
			contextType) {
		return oFF.notNull(this.m_target)
				&& this.m_target.containsField(dimName, fieldName, contextType);
	};
	oFF.QCmdContext.prototype.containsResultSetFieldByType = function(dimName,
			presentationType) {
		return oFF.notNull(this.m_target)
				&& this.m_target.containsResultSetFieldByType(dimName,
						presentationType);
	};
	oFF.QCmdContext.prototype.containsSelectorFieldByType = function(dimName,
			presentationType) {
		return oFF.notNull(this.m_target)
				&& this.m_target.containsSelectorFieldByType(dimName,
						presentationType);
	};
	oFF.QCmdContext.prototype.setDimensionHierarchy = function(dimName,
			hierarchyName, hierarchyActive, initialDrillLevel) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.setDimensionHierarchy(dimName, hierarchyName,
					hierarchyActive, initialDrillLevel);
		}
		return this;
	};
	oFF.QCmdContext.prototype.drillNode = function(dimName, nodeName,
			drillState) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.drillNode(dimName, nodeName, drillState);
		}
		return this;
	};
	oFF.QCmdContext.prototype.setUniversalDisplayHierarchy = function(
			dimensions, initialDrillLevel, active) {
		return oFF.notNull(this.m_target) ? this.m_target
				.setUniversalDisplayHierarchy(dimensions, initialDrillLevel,
						active) : null;
	};
	oFF.QCmdContext.prototype.sort = function(sortType, dimType, dimName,
			presentationType, fieldName, memberName, direction) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.sort(sortType, dimType, dimName,
					presentationType, fieldName, memberName, direction);
		}
		return this;
	};
	oFF.QCmdContext.prototype.clearSort = function(sortType, name) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.clearSort(sortType, name);
		}
		return this;
	};
	oFF.QCmdContext.prototype.alignTotals = function(modelLevel, name,
			alignment) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.alignTotals(modelLevel, name, alignment);
		}
		return this;
	};
	oFF.QCmdContext.prototype.setTotalsVisible = function(modelLevel, name,
			visibility) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.setTotalsVisible(modelLevel, name, visibility);
		}
		return this;
	};
	oFF.QCmdContext.prototype.addMeasure = function(measure) {
		return oFF.notNull(this.m_target) ? this.m_target.addMeasure(measure)
				: null;
	};
	oFF.QCmdContext.prototype.addNewRestrictedMeasure = function(dimType, name,
			text, member, targetDim, targetMember) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.addNewRestrictedMeasure(dimType, name, text,
					member, targetDim, targetMember);
		}
		return this;
	};
	oFF.QCmdContext.prototype.addNewRestrictedMeasureOnNode = function(dimType,
			name, text, member, targetDim, targetHierarchyName, targetNode) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.addNewRestrictedMeasureOnNode(dimType, name,
					text, member, targetDim, targetHierarchyName, targetNode);
		}
		return this;
	};
	oFF.QCmdContext.prototype.getOffsetColumns = function() {
		return oFF.notNull(this.m_target) ? this.m_target.getOffsetColumns()
				: 0;
	};
	oFF.QCmdContext.prototype.setSuppressKeyfigureCalculation = function(
			doSupress) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.setSuppressKeyfigureCalculation(doSupress);
		}
		return this;
	};
	oFF.QCmdContext.prototype.isKeyfigureCalculationSuppressed = function() {
		return oFF.notNull(this.m_target) ? this.m_target
				.isKeyfigureCalculationSuppressed() : false;
	};
	oFF.QCmdContext.prototype.getMaxColumns = function() {
		return oFF.notNull(this.m_target) ? this.m_target.getMaxColumns() : 0;
	};
	oFF.QCmdContext.prototype.setOffsetColumns = function(offset) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.setOffsetColumns(offset);
		}
		return this;
	};
	oFF.QCmdContext.prototype.setMaxColumns = function(max) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.setMaxColumns(max);
		}
		return this;
	};
	oFF.QCmdContext.prototype.getOffsetRows = function() {
		return oFF.notNull(this.m_target) ? this.m_target.getOffsetRows() : 0;
	};
	oFF.QCmdContext.prototype.getMaxRows = function() {
		return oFF.notNull(this.m_target) ? this.m_target.getMaxRows() : 0;
	};
	oFF.QCmdContext.prototype.setOffsetRows = function(offset) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.setOffsetRows(offset);
		}
		return this;
	};
	oFF.QCmdContext.prototype.setMaxRows = function(max) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.setMaxRows(max);
		}
		return this;
	};
	oFF.QCmdContext.prototype.getMaxResultRecords = function() {
		return oFF.notNull(this.m_target) ? this.m_target.getMaxResultRecords()
				: 0;
	};
	oFF.QCmdContext.prototype.setMaxResultRecords = function(maxResultRecords) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.setMaxResultRecords(maxResultRecords);
		}
		return this;
	};
	oFF.QCmdContext.prototype.resetMaxResultRecords = function() {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.resetMaxResultRecords();
		}
		return this;
	};
	oFF.QCmdContext.prototype.hasMoreColumnRecordsAvailable = function() {
		return oFF.notNull(this.m_target)
				&& this.m_target.hasMoreColumnRecordsAvailable();
	};
	oFF.QCmdContext.prototype.hasMoreRowRecordsAvailable = function() {
		return oFF.notNull(this.m_target)
				&& this.m_target.hasMoreRowRecordsAvailable();
	};
	oFF.QCmdContext.prototype.getReferenceGrid = function(withDetails) {
		if (oFF.notNull(this.m_target)) {
			this.m_target.getReferenceGrid(withDetails);
		}
		return null;
	};
	oFF.QCmdContext.prototype.getAbstractRendering = function(type, protocol) {
		return oFF.notNull(this.m_target) ? this.m_target.getAbstractRendering(
				type, protocol) : null;
	};
	oFF.QCmdContext.prototype.setExecuteRequestOnOldResultSet = function(
			executeRequestOnOldResultSet) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target
					.setExecuteRequestOnOldResultSet(executeRequestOnOldResultSet);
		}
		return this;
	};
	oFF.QCmdContext.prototype.setResultSetPersistanceTargetSchema = function(
			resultSetPersistenceSchema) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target
					.setResultSetPersistanceTargetSchema(resultSetPersistenceSchema);
		}
		return this;
	};
	oFF.QCmdContext.prototype.setResultSetPersistanceTargetTable = function(
			resultSetPersistenceTable) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target
					.setResultSetPersistanceTargetTable(resultSetPersistenceTable);
		}
		return this;
	};
	oFF.QCmdContext.prototype.setResultSetPersistenceIdentifier = function(
			resultSetPersistenceIdentifier) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target
					.setResultSetPersistenceIdentifier(resultSetPersistenceIdentifier);
		}
		return this;
	};
	oFF.QCmdContext.prototype.setResultSetTransportEnabled = function(isEnabled) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.setResultSetTransportEnabled(isEnabled);
		}
		return this;
	};
	oFF.QCmdContext.prototype.getExecuteRequestOnOldResultSet = function() {
		return oFF.notNull(this.m_target)
				&& this.m_target.getExecuteRequestOnOldResultSet();
	};
	oFF.QCmdContext.prototype.processQueryManagerCreation = function(syncType,
			listener, customIdentifier) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.processQueryManagerCreation(syncType,
					listener, customIdentifier);
		}
		return this;
	};
	oFF.QCmdContext.prototype.processQueryExecution = function(syncType,
			listener, customIdentifier) {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.processQueryExecution(syncType, listener,
					customIdentifier);
		}
		return this;
	};
	oFF.QCmdContext.prototype.refresh = function() {
		if (oFF.notNull(this.m_target)) {
			return this.m_target.refresh();
		}
		return this;
	};
	oFF.QCmdContext.prototype.getResultSetPersistenceSchema = function() {
		return oFF.notNull(this.m_target) ? this.m_target
				.getResultSetPersistenceSchema() : null;
	};
	oFF.QCmdContext.prototype.getResultSetPersistenceTable = function() {
		return oFF.notNull(this.m_target) ? this.m_target
				.getResultSetPersistenceTable() : null;
	};
	oFF.QCmdContext.prototype.getResultSetPersistenceIdentifier = function() {
		return oFF.notNull(this.m_target) ? this.m_target
				.getResultSetPersistenceIdentifier() : null;
	};
	oFF.QCmdContext.prototype.isResultSetTransportEnabled = function() {
		return oFF.notNull(this.m_target)
				&& this.m_target.isResultSetTransportEnabled();
	};
	oFF.QCmdContext.prototype.queueEventing = function() {
		if (oFF.notNull(this.m_target)) {
			this.m_target.queueEventing();
		}
	};
	oFF.QCmdContext.prototype.stopEventing = function() {
		if (oFF.notNull(this.m_target)) {
			this.m_target.stopEventing();
		}
	};
	oFF.QCmdContext.prototype.isEventingStopped = function() {
		return oFF.notNull(this.m_target) && this.m_target.isEventingStopped();
	};
	oFF.QCmdContext.prototype.resumeEventing = function() {
		if (oFF.notNull(this.m_target)) {
			this.m_target.resumeEventing();
		}
	};
	oFF.QCmdContext.prototype.isHana = function() {
		return this.m_target.isHana();
	};
	oFF.QCmdContext.prototype.isBw = function() {
		return this.m_target.isBw();
	};
	oFF.QCmdContext.prototype.isBpcs = function() {
		return this.m_target.isBpcs();
	};
	oFF.QCmdContext.prototype.isBpce = function() {
		return this.m_target.isBpce();
	};
	oFF.QCmdContext.prototype.isUniverse = function() {
		return this.m_target.isUniverse();
	};
	oFF.QCmdContext.prototype.isHybris = function() {
		return this.m_target.isHybris();
	};
	oFF.QCmdContext.prototype.isUqas = function() {
		return this.m_target.isUqas();
	};
	oFF.QCmdContext.prototype.isOdata = function() {
		return this.m_target.isOdata();
	};
	oFF.QCmdContext.prototype.isTypeOfBw = function() {
		return this.m_target.isTypeOfBw();
	};
	oFF.QCmdContext.prototype.updateDynamicVariables = function(syncType,
			listener, customIdentifier) {
		if (oFF.notNull(this.m_target)) {
			this.m_target.updateDynamicVariables(syncType, listener,
					customIdentifier);
		}
	};
	oFF.QCmdContext.prototype.setFilterForLeaves = function(dimension) {
		if (oFF.notNull(this.m_target)) {
			this.m_target.setFilterForLeaves(dimension);
		}
	};
	oFF.OlapExtModule = function() {
	};
	oFF.OlapExtModule.prototype = new oFF.DfModule();
	oFF.OlapExtModule.s_module = null;
	oFF.OlapExtModule.getInstance = function() {
		return oFF.OlapExtModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.OlapExtModule.initVersion = function(version) {
		var timestamp;
		if (oFF.isNull(oFF.OlapExtModule.s_module)) {
			oFF.DfModule.checkInitialized(oFF.OlapApiModule
					.initVersion(version));
			timestamp = oFF.DfModule.start("OlapExtModule...");
			oFF.OlapExtModule.s_module = new oFF.OlapExtModule();
			oFF.DfModule.stop(timestamp);
		}
		return oFF.OlapExtModule.s_module;
	};
	oFF.OlapExtModule.getInstance();
})(sap.firefly);