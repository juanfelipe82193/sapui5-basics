(function(oFF) {
	oFF.QCsnConverter = {
		s_lookupValueType : null,
		s_lookupValueTypeCsn : null,
		staticSetup : function() {
			oFF.QCsnConverter.setupDimensionType();
		},
		mapConstant : function(mapToEnum, mapToCSN, ffConstant, csnConstant) {
			mapToEnum.put(csnConstant, ffConstant);
			mapToCSN.put(ffConstant.getName(), csnConstant);
		},
		setupDimensionType : function() {
			oFF.QCsnConverter.s_lookupValueType = oFF.XHashMapByString.create();
			oFF.QCsnConverter.s_lookupValueTypeCsn = oFF.XHashMapOfStringByString
					.create();
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.LOWER_CASE_STRING,
					oFF.CsnConstants.TYPE_STRING);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.UPPER_CASE_STRING,
					oFF.CsnConstants.TYPE_STRING);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.STRING, oFF.CsnConstants.TYPE_LARGE_STRING);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.STRING, oFF.CsnConstants.TYPE_STRING);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.CHAR, oFF.CsnConstants.TYPE_STRING);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.INTEGER, oFF.CsnConstants.TYPE_DECIMAL);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.INTEGER, oFF.CsnConstants.TYPE_INTEGER);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.LONG, oFF.CsnConstants.TYPE_INTEGER64);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.BOOLEAN, oFF.CsnConstants.TYPE_BOOLEAN);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.DECIMAL_FLOAT,
					oFF.CsnConstants.TYPE_DECIMAL_FLOAT);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.DOUBLE, oFF.CsnConstants.TYPE_DOUBLE);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.DATE, oFF.CsnConstants.TYPE_LOCAL_DATE);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.DATE, oFF.CsnConstants.TYPE_DATE);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.TIME, oFF.CsnConstants.TYPE_LOCAL_TIME);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.TIME, oFF.CsnConstants.TYPE_TIME);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.DATE_TIME,
					oFF.CsnConstants.TYPE_LOCAL_DATE_TIME);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.DATE_TIME, oFF.CsnConstants.TYPE_DATE_TIME);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.TIMESPAN,
					oFF.CsnConstants.TYPE_UTC_TIMESTAMP);
			oFF.QCsnConverter.mapConstant(oFF.QCsnConverter.s_lookupValueType,
					oFF.QCsnConverter.s_lookupValueTypeCsn,
					oFF.XValueType.TIMESPAN, oFF.CsnConstants.TYPE_TIMESTAMP);
		},
		lookupValueType : function(csnValueType, defaultValueType) {
			var valueType = oFF.QCsnConverter.s_lookupValueType
					.getByKey(csnValueType);
			return oFF.notNull(valueType) ? valueType : defaultValueType;
		},
		lookupValueTypeCsn : function(ffValueType, defaultValueType) {
			var valueType = oFF.QCsnConverter.s_lookupValueTypeCsn
					.getByKey(ffValueType.getName());
			return oFF.notNull(valueType) ? valueType : defaultValueType;
		},
		lookupAxis : function(axisType) {
			var axisTypeUpperCase = oFF.XString.toUpperCase(axisType);
			if (oFF.XString.isEqual(axisTypeUpperCase,
					oFF.CsnConstants.AXIS_ROWS)) {
				return oFF.AxisType.ROWS;
			}
			if (oFF.XString.isEqual(axisTypeUpperCase,
					oFF.CsnConstants.AXIS_COLUMNS)) {
				return oFF.AxisType.COLUMNS;
			}
			return oFF.AxisType.FREE;
		},
		lookupAxisCsn : function(axisType) {
			if (axisType === oFF.AxisType.ROWS) {
				return oFF.CsnConstants.AXIS_ROWS;
			}
			if (axisType === oFF.AxisType.COLUMNS) {
				return oFF.CsnConstants.AXIS_COLUMNS;
			}
			return oFF.CsnConstants.AXIS_FREE;
		}
	};
	oFF.QInADataSourceBlending = {
		exportDataSourceBlending : function(format, blendingDefinition,
				isBlendingDataRequest) {
			var inaRequest = oFF.PrFactory.createStructure();
			var inaMetadata = inaRequest.putNewStructure("Metadata");
			var inaDataSource = inaMetadata.putNewStructure("DataSource");
			var objectName;
			var idx;
			var inaBlendingSources;
			var inaBlendingMappings;
			inaDataSource.putString("Type", oFF.QueryManagerMode.BLENDING
					.getName());
			objectName = oFF.XStringBuffer.create();
			for (idx = 0; idx < blendingDefinition.getSources().size(); idx++) {
				objectName.append(blendingDefinition.getSources().get(idx)
						.getQueryAliasName());
			}
			inaDataSource.putString("ObjectName", objectName.toString());
			inaBlendingSources = oFF.QInADataSourceBlending
					.exportBlendingSources(format, blendingDefinition,
							isBlendingDataRequest);
			inaDataSource.put("Sources", inaBlendingSources);
			inaBlendingMappings = oFF.QInADataSourceBlending
					.exportBlendingMappings(blendingDefinition.getMappings());
			inaDataSource.put("Mappings", inaBlendingMappings);
			return inaDataSource;
		},
		exportBlendingSources : function(format, blendingDefinition,
				isBlendingDataRequest) {
			var blendingHost = blendingDefinition.getBlendingHost();
			var blendingHostSource = blendingHost.getSource();
			var blendingSourceFormat = format;
			var inaSources;
			var sourceIterator;
			var source;
			var queryModel;
			var inaSource;
			var inaDefiningContext;
			var inaQuery;
			var queryManager;
			var persistenceIdentifier;
			var inaResultSetFeatures;
			if (format.isTypeOf(oFF.QModelFormat.INA_DATA)) {
				blendingSourceFormat = oFF.QModelFormat.INA_DATA_BLENDING_SOURCE;
			}
			inaSources = oFF.PrFactory.createList();
			sourceIterator = blendingDefinition.getSources().getIterator();
			while (sourceIterator.hasNext()) {
				source = sourceIterator.next();
				queryModel = source.getQueryModel();
				if (oFF.isNull(queryModel)) {
					return null;
				}
				inaSource = inaSources.addNewStructure();
				inaSource.putString("Type", "Query");
				inaSource.putString("AliasName", source.getQueryAliasName());
				inaSource.putString("ObjectName", source.getQueryAliasName());
				inaDefiningContext = inaSource
						.putNewStructure("DefiningContext");
				inaQuery = queryModel.serializeToElement(blendingSourceFormat,
						null).asStructure();
				oFF.QInADataSourceBlending
						.exportOptimizerHints(
								inaQuery,
								queryModel
										.getOptimizerHintsByExecutionEngine(oFF.ExecutionEngine.MDS));
				queryManager = queryModel.getQueryManager();
				persistenceIdentifier = queryManager
						.getResultSetPersistenceIdentifier();
				if (source !== blendingHostSource
						&& source.isRemoteSource()
						&& !blendingSourceFormat
								.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
					oFF.QInADataSourceBlending.updateRemoteDataSource(inaQuery,
							queryManager, isBlendingDataRequest, blendingHost
									.getSystemDescription());
				} else {
					if (!source.isRemoteSource()
							&& oFF.XStringUtils
									.isNotNullAndNotEmpty(persistenceIdentifier)
							&& isBlendingDataRequest) {
						inaQuery.getStructureByKey("DataSource").putString(
								"InstanceId", persistenceIdentifier);
					}
				}
				inaResultSetFeatures = oFF.QInADataSourceBlending
						.exportResultSetFeatures(queryModel, true);
				inaQuery.put("ResultSetFeatureRequest", inaResultSetFeatures);
				inaDefiningContext.put("Definition", inaQuery);
			}
			oFF.XObjectExt.release(sourceIterator);
			return inaSources;
		},
		updateRemoteDataSource : function(inaQuery, queryManager,
				isBlendingDataRequest, localSystemDescription) {
			var dataSource = inaQuery.putNewStructure("DataSource");
			var systemDescription;
			var mappingRemoteHost;
			var serializedData;
			var resultSetContainer;
			dataSource.putString("Type", "SerializedData");
			dataSource.putString("InstanceId", queryManager
					.getResultSetPersistenceIdentifier());
			systemDescription = queryManager.getSystemDescription();
			if (localSystemDescription.isSystemMappingValid(systemDescription)) {
				mappingRemoteHost = systemDescription
						.getSystemMapping(localSystemDescription
								.getSystemName());
				dataSource.putString("ObjectName", mappingRemoteHost
						.getDeserializeTable());
				dataSource.putString("SchemaName", mappingRemoteHost
						.getDeserializeSchema());
			} else {
				serializedData = dataSource.putNewStructure("SerializedData");
				resultSetContainer = queryManager.getActiveResultSetContainer();
				serializedData.putString("View", resultSetContainer
						.getSerializedView());
				if (isBlendingDataRequest) {
					serializedData.putString("Cube", resultSetContainer
							.getSerializedCube());
				}
			}
			oFF.QInADataSourceBlending.updateBWRemoteSource(inaQuery,
					queryManager.getSystemType());
		},
		exportOptimizerHints : function(inaDefinition, optimizerHints) {
			var sortedList;
			var inaOptimizerHints;
			var inaAEngineHints;
			var sortedListSize;
			var i;
			var hintName;
			var inaHint;
			if (oFF.XCollectionUtils.hasElements(optimizerHints)) {
				sortedList = optimizerHints.getKeysAsReadOnlyListOfString();
				sortedList.sortByDirection(oFF.XSortDirection.ASCENDING);
				inaOptimizerHints = inaDefinition.putNewStructure("Hints");
				inaAEngineHints = inaOptimizerHints
						.putNewList(oFF.ExecutionEngine.MDS.getName());
				sortedListSize = sortedList.size();
				for (i = 0; i < sortedListSize; i++) {
					hintName = sortedList.get(i);
					inaHint = inaAEngineHints.addNewStructure();
					inaHint.putString("Key", hintName);
					inaHint.putString("Value", optimizerHints
							.getByKey(hintName));
				}
			}
		},
		updateBWRemoteSource : function(inaQuery, systemType) {
			if (systemType.isTypeOf(oFF.SystemType.BW)
					|| systemType.isTypeOf(oFF.SystemType.VIRTUAL_INA)) {
				inaQuery.remove("FixedFilter");
				inaQuery.remove("DynamicFilter");
				inaQuery.remove("Filter");
				inaQuery.remove("Query");
				inaQuery.remove("QueryDataCells");
				inaQuery.remove("Sort");
				inaQuery.remove("ExtendedSortTypes");
				inaQuery.remove("Variables");
				inaQuery.remove("UniversalDisplayHierarchies");
			}
		},
		exportResultSetFeatures : function(sourceQueryModel, isSubQuery) {
			var options = oFF.PrFactory.createStructure();
			var queryManager;
			options.putBoolean("UseDefaultAttributeKey", false);
			queryManager = sourceQueryModel.getQueryManager();
			if (queryManager.getMaxResultRecords() !== -1) {
				options.putLong("MaxResultRecords", queryManager
						.getMaxResultRecords());
			}
			queryManager.fillPaging(options);
			options.putString("ResultFormat", "Version2");
			options.putString("ResultEncoding", "None");
			if (isSubQuery) {
				options.putBoolean("IsCubeBlendingSubquery", true);
			}
			if (!queryManager.isResultSetTransportEnabled()) {
				options.putBoolean("ReturnEmptyJsonResultSet", true);
			}
			return options;
		},
		exportDimensionMapping : function(dimensionMapping) {
			var inaMapping = oFF.PrFactory.createStructure();
			var definitionIterator;
			var inaDefinitions;
			var inaAttributeMappings;
			var attributeMappingIterator;
			var attributeMapping;
			var inaAttributeMapping;
			inaMapping.putString("DimensionName", dimensionMapping
					.getMemberName());
			inaMapping.putString("LinkType", dimensionMapping.getLinkType()
					.getName());
			if (dimensionMapping.isPreservingMembers()) {
				inaMapping.putBoolean("PreserveMembers", true);
			}
			if (!dimensionMapping.isReturningOriginKeys()) {
				inaMapping.putBoolean("ReturnOriginKeys", false);
			}
			definitionIterator = dimensionMapping.getMappingDefinitions()
					.getIterator();
			inaDefinitions = oFF.QInADataSourceBlending
					.exportMappingDefinitions(definitionIterator);
			oFF.XObjectExt.release(definitionIterator);
			inaMapping.put("Mapping", inaDefinitions);
			if ((dimensionMapping.getLinkType() === oFF.BlendingLinkType.ALL_DATA || dimensionMapping
					.getLinkType() === oFF.BlendingLinkType.NONE)
					&& dimensionMapping.getConstantMappings().hasElements()) {
				oFF.QInADataSourceBlending.exportConstantMapping(
						inaDefinitions, dimensionMapping.getConstantMappings()
								.getIterator());
			}
			inaAttributeMappings = oFF.PrFactory.createList();
			attributeMappingIterator = dimensionMapping.getAttributeMappings()
					.getIterator();
			while (attributeMappingIterator.hasNext()) {
				attributeMapping = attributeMappingIterator.next();
				inaAttributeMapping = oFF.QInADataSourceBlending
						.exportAttributeMapping(attributeMapping);
				inaAttributeMappings.add(inaAttributeMapping);
			}
			oFF.XObjectExt.release(attributeMappingIterator);
			if (!inaAttributeMappings.isEmpty()) {
				inaMapping.put("AttributeMappings", inaAttributeMappings);
			}
			return inaMapping;
		},
		exportAttributeMapping : function(attributeMapping) {
			var inaAttributeMapping = oFF.PrFactory.createStructure();
			var mappingIterator;
			var inaMappings;
			inaAttributeMapping.putString("AttributeName", attributeMapping
					.getAttributeName());
			inaAttributeMapping.putBoolean("IsLinkKey", attributeMapping
					.isLinkKey());
			mappingIterator = attributeMapping.getAttributeMappingDefinitions()
					.getIterator();
			inaMappings = oFF.QInADataSourceBlending
					.exportMappingDefinitions(mappingIterator);
			oFF.XObjectExt.release(mappingIterator);
			inaAttributeMapping.put("Mapping", inaMappings);
			oFF.QInADataSourceBlending.exportConstantMapping(inaMappings,
					attributeMapping.getConstantMappings().getIterator());
			return inaAttributeMapping;
		},
		exportConstantMapping : function(inaDefinitions, definitionIterator) {
			var constantMapping;
			var inaConstantMapping;
			var inaMappingDefinition;
			var inaMember;
			while (definitionIterator.hasNext()) {
				constantMapping = definitionIterator.next();
				inaConstantMapping = oFF.PrFactory.createStructure();
				inaConstantMapping.putString("AliasName", constantMapping
						.getQueryAliasName());
				inaMappingDefinition = inaConstantMapping
						.putNewStructure("MappingDefinition");
				inaMember = inaMappingDefinition.putNewStructure("Constant");
				inaMember.putString("Value", constantMapping.getMemberName());
				inaMember.putString("ValueType", oFF.QInAConverter
						.lookupValueTypeInA(constantMapping.getValueType()));
				inaDefinitions.add(inaConstantMapping);
			}
		},
		exportMappingDefinitions : function(definitionIterator) {
			var inaDefinitions = oFF.PrFactory.createList();
			var definition;
			var inaDefinition;
			var inaMappingDefinition;
			var inaMember;
			while (definitionIterator.hasNext()) {
				definition = definitionIterator.next();
				inaDefinition = inaDefinitions.addNewStructure();
				inaDefinition.putString("AliasName", definition
						.getQueryAliasName());
				inaMappingDefinition = inaDefinition
						.putNewStructure("MappingDefinition");
				inaMember = inaMappingDefinition.putNewStructure("Member");
				inaMember.putString("Name", definition.getMemberName());
			}
			return inaDefinitions;
		},
		exportBlendingMappings : function(mappings) {
			var inaMappings = oFF.PrFactory.createList();
			var mappingIterator = mappings.getIterator();
			var mapping;
			var inaMapping;
			while (mappingIterator.hasNext()) {
				mapping = mappingIterator.next();
				inaMapping = oFF.QInADataSourceBlending
						.exportDimensionMapping(mapping);
				inaMappings.add(inaMapping);
			}
			return inaMappings;
		}
	};
	oFF.QInADataSourceExtDims = {
		importQd : function(importer, dataSource, inaDataSource) {
			var extendedDimensionsBase;
			var inaExtendedDimensions;
			var extDimSize;
			var i;
			var inaExtendedDimension;
			var name;
			var joinFieldName;
			var joinFieldNameInExtendedDim;
			var extendedDimension;
			var joinTypeValue;
			var joinType;
			var renamingMode;
			var joinCardinalityValue;
			var joinCardinality;
			if (importer.supportsExtendedDimensions) {
				extendedDimensionsBase = dataSource.getExtendedDimensionsBase();
				extendedDimensionsBase.clear();
				inaExtendedDimensions = inaDataSource
						.getListByKey("ExtendedDimensions");
				if (oFF.notNull(inaExtendedDimensions)) {
					extDimSize = inaExtendedDimensions.size();
					for (i = 0; i < extDimSize; i++) {
						inaExtendedDimension = inaExtendedDimensions
								.getStructureAt(i);
						name = inaExtendedDimension.getStringByKey("Name");
						joinFieldName = inaExtendedDimension
								.getStringByKey("JoinFieldName");
						joinFieldNameInExtendedDim = inaExtendedDimension
								.getStringByKey("JoinFieldNameInExtendedDimension");
						extendedDimension = oFF.QExtendedDimension.create(name,
								joinFieldName, joinFieldNameInExtendedDim);
						extendedDimension.setText(inaExtendedDimension
								.getStringByKey("Description"));
						joinTypeValue = inaExtendedDimension
								.getStringByKey("JoinType");
						joinType = oFF.JoinType.lookup(joinTypeValue);
						extendedDimension.setJoinType(joinType);
						oFF.QInADataSourceExtDims.importJoinParameter(
								inaExtendedDimension, extendedDimension);
						oFF.QInADataSourceExtDims.importExtendedDataSource(
								inaExtendedDimension, extendedDimension);
						renamingMode = inaExtendedDimension
								.getStringByKey("FieldRenamingMode");
						if (oFF.notNull(renamingMode)) {
							extendedDimension.setRenamingMode(renamingMode);
						}
						joinCardinalityValue = inaExtendedDimension
								.getStringByKey("JoinCardinality");
						if (oFF.XStringUtils
								.isNotNullAndNotEmpty(joinCardinalityValue)) {
							joinCardinality = oFF.JoinCardinality
									.lookup(joinCardinalityValue);
							extendedDimension
									.setJoinCardinality(joinCardinality);
						}
						extendedDimensionsBase.add(extendedDimension);
					}
				}
			}
		},
		importExtendedDataSource : function(inaExtendedDimension,
				extendedDimension) {
			var inaExternalDataSource = inaExtendedDimension
					.getStructureByKey("DataSource");
			var externalDataSource;
			var type;
			var inaType;
			if (oFF.notNull(inaExternalDataSource)) {
				externalDataSource = oFF.QFactory.newDataSource();
				oFF.QInADataSourceProperties.importQd(externalDataSource,
						inaExternalDataSource);
				inaType = inaExternalDataSource.getStringByKey("Type");
				if (oFF.isNull(inaType)) {
					type = oFF.MetaObjectType.DBVIEW;
				} else {
					type = oFF.MetaObjectType.lookup(oFF.XString
							.toLowerCase(inaType));
				}
				externalDataSource.setType(type);
				extendedDimension.setDataSource(externalDataSource);
			}
		},
		importJoinParameter : function(inaExtendedDimension, extendedDimension) {
			var inaJoinParameters = inaExtendedDimension
					.getListByKey("JoinParameters");
			var joinParameters;
			var joinParamSize;
			var j;
			if (oFF.notNull(inaJoinParameters)) {
				joinParameters = extendedDimension.getJoinParameters();
				joinParameters.clear();
				joinParamSize = inaJoinParameters.size();
				for (j = 0; j < joinParamSize; j++) {
					joinParameters.add(inaJoinParameters.getStringAt(j));
				}
			}
		},
		checkIsValid : function(exporter, extDimension) {
			var joinType = extDimension.getJoinType();
			var dimensionType;
			var externalDataSource;
			var joinParameters;
			if (oFF.isNull(joinType)) {
				exporter.addError(oFF.ErrorCodes.INVALID_PARAMETER,
						oFF.XStringUtils.concatenate3("Extended dimension '",
								extDimension.getName(),
								"' is missing a JoinType"));
				return false;
			}
			dimensionType = extDimension.getDimensionType();
			if (dimensionType.isTypeOf(oFF.DimensionType.GIS_DIMENSION)
					&& joinType.isTypeOf(oFF.JoinType._TIME)) {
				exporter
						.addError(oFF.ErrorCodes.INVALID_PARAMETER,
								"Spatial extended dimensions must not have join type INNER");
				return false;
			} else {
				if ((dimensionType.isTypeOf(oFF.DimensionType.TIME) || dimensionType
						.isTypeOf(oFF.DimensionType.DATE))
						&& joinType.isTypeOf(oFF.JoinType._SPATIAL)) {
					exporter
							.addError(oFF.ErrorCodes.INVALID_PARAMETER,
									"Time extended dimensions must not have spatial join type");
					return false;
				}
			}
			externalDataSource = extDimension.getDataSource();
			if (oFF.isNull(externalDataSource)) {
				exporter.addError(oFF.ErrorCodes.INVALID_PARAMETER,
						oFF.XStringUtils.concatenate3("Extended dimension '",
								extDimension.getName(),
								"' is missing its DataSource"));
				return false;
			}
			joinParameters = extDimension.getJoinParameters();
			if (joinType === oFF.JoinType.WITHIN_DISTANCE
					&& joinParameters.isEmpty()) {
				exporter
						.addError(
								oFF.ErrorCodes.INVALID_PARAMETER,
								oFF.XStringUtils
										.concatenate3(
												"Extended dimension '",
												extDimension.getName(),
												"' of joinType 'WITHIN_DISTANCE' is expected to have the 2 parameters 'distance' and 'unit of measure' (in that order)"));
				return false;
			}
			return true;
		},
		exportQd : function(exporter, dataSource, inaDataSource) {
			var extendedDimensions = dataSource.getExtendedDimensions();
			var inaExtendedDimensions;
			var extDimIdx;
			var extDimension;
			var inaExtendedDimension;
			var joinCardinality;
			var joinParameters;
			var inaJoinParameters;
			var externalDataSource;
			var inaExternalDataSource;
			var type;
			var queryManager;
			if (oFF.XCollectionUtils.hasElements(extendedDimensions)) {
				inaExtendedDimensions = inaDataSource
						.putNewList("ExtendedDimensions");
				for (extDimIdx = 0; extDimIdx < extendedDimensions.size(); extDimIdx++) {
					extDimension = extendedDimensions.get(extDimIdx);
					if (!oFF.QInADataSourceExtDims.checkIsValid(exporter,
							extDimension)) {
						return;
					}
					inaExtendedDimension = inaExtendedDimensions
							.addNewStructure();
					inaExtendedDimension.putString("Name", extDimension
							.getName());
					inaExtendedDimension.putString("Description", extDimension
							.getText());
					inaExtendedDimension.putInteger("DimensionType",
							oFF.QInAConverter
									.lookupDimensionTypeInA(extDimension
											.getDimensionType()));
					inaExtendedDimension.putString("JoinFieldName",
							extDimension.getJoinField());
					inaExtendedDimension.putString(
							"JoinFieldNameInExtendedDimension", extDimension
									.getJoinFieldNameExternal());
					inaExtendedDimension.putString("JoinType", extDimension
							.getJoinType().getName());
					joinCardinality = extDimension.getJoinCardinality();
					if (oFF.notNull(joinCardinality)) {
						inaExtendedDimension.putString("JoinCardinality",
								joinCardinality.getName());
					}
					joinParameters = extDimension.getJoinParameters();
					if (joinParameters.hasElements()) {
						inaJoinParameters = inaExtendedDimension
								.putNewList("JoinParameters");
						inaJoinParameters.addAllStrings(joinParameters);
					}
					externalDataSource = extDimension.getDataSource();
					inaExternalDataSource = inaExtendedDimension
							.putNewStructure("DataSource");
					oFF.QInADataSourceProperties.exportQd(exporter,
							externalDataSource, inaExternalDataSource, false);
					type = externalDataSource.getType();
					if (oFF.isNull(type)) {
						inaExternalDataSource.putString("Type",
								oFF.MetaObjectType.DBVIEW.getCamelCaseName());
					} else {
						inaExternalDataSource.putString("Type", type
								.getCamelCaseName());
					}
					queryManager = dataSource.getQueryManager();
					if (queryManager
							.supportsAnalyticCapabilityActive(oFF.InACapabilities.EXTENDED_DIMENSION_CHANGE_DEFAULT_RENAMING_AND_DESCRIPTION)) {
						inaExtendedDimension.putStringNotNull(
								"FieldRenamingMode", extDimension
										.getRenamingMode());
					}
				}
			}
		}
	};
	oFF.QInADataSourceProperties = {
		importQd : function(dataSource, structure) {
			var name = structure.getStringByKey("ObjectName");
			var environmentName;
			var packageName;
			var schemaName;
			var aliasName;
			var dataArea;
			var runAsUser;
			var text;
			var inaCustomProperties;
			var customPropertyNames;
			var size;
			var i;
			var key;
			dataSource.setName(name);
			environmentName = structure.getStringByKey("Environment");
			dataSource.setEnvironmentName(environmentName);
			packageName = structure.getStringByKey("PackageName");
			dataSource.setPackageName(packageName);
			schemaName = structure.getStringByKey("SchemaName");
			dataSource.setSchemaName(schemaName);
			aliasName = structure.getStringByKey("AliasName");
			dataSource.setAlias(aliasName);
			dataArea = structure.getStringByKey("DataArea");
			dataSource.setDataArea(dataArea);
			runAsUser = structure.getStringByKey("RunAsUser");
			dataSource.setRunAsUser(runAsUser);
			text = structure.getStringByKey("Description");
			dataSource.setText(text);
			inaCustomProperties = structure
					.getStructureByKey("CustomProperties");
			if (oFF.notNull(inaCustomProperties)) {
				customPropertyNames = inaCustomProperties
						.getKeysAsReadOnlyListOfString();
				size = customPropertyNames.size();
				for (i = 0; i < size; i++) {
					key = customPropertyNames.get(i);
					dataSource.addCustomProperty(key, inaCustomProperties
							.getStringByKey(key));
				}
			}
		},
		exportQd : function(exporter, dataSource, inaDataSource, withRunAsUser) {
			var customProperties;
			var customPropertiesIt;
			var inaCustomProperties;
			var key;
			var dataArea;
			var rriName;
			oFF.QInAExportUtil.setNonEmptyString(inaDataSource, "ObjectName",
					dataSource.getObjectName());
			oFF.QInAExportUtil.setNonEmptyString(inaDataSource, "Environment",
					dataSource.getEnvironmentName());
			oFF.QInAExportUtil.setNonEmptyString(inaDataSource, "PackageName",
					dataSource.getPackageName());
			oFF.QInAExportUtil.setNonEmptyString(inaDataSource, "SchemaName",
					dataSource.getSchemaName());
			oFF.QInAExportUtil.setNonEmptyString(inaDataSource, "AliasName",
					dataSource.getAlias());
			customProperties = dataSource.getCustomProperties();
			customPropertiesIt = customProperties.getKeysAsIteratorOfString();
			if (customPropertiesIt.hasNext()) {
				inaCustomProperties = inaDataSource
						.putNewStructure("CustomProperties");
				while (customPropertiesIt.hasNext()) {
					key = customPropertiesIt.next();
					oFF.QInAExportUtil.setNonEmptyString(inaCustomProperties,
							key, customProperties.getByKey(key));
				}
			}
			dataArea = dataSource.getDataArea();
			if (!oFF.XString.isEqual(dataArea, "DEFAULT")) {
				oFF.QInAExportUtil.setNonEmptyString(inaDataSource, "DataArea",
						dataArea);
			}
			if (withRunAsUser) {
				oFF.QInAExportUtil.setNonEmptyString(inaDataSource,
						"RunAsUser", dataSource.getRunAsUser());
			}
			if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)
					|| exporter.mode.containsMetadata()) {
				oFF.QInAExportUtil.setNonEmptyString(inaDataSource,
						"Description", dataSource.getText());
			}
			if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA)
					|| exporter.mode === oFF.QModelFormat.INA_VALUE_HELP) {
				oFF.QInAExportUtil.setNonEmptyString(inaDataSource,
						"InstanceId", dataSource.getInstanceId());
				rriName = dataSource.getRriName();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(rriName)) {
					oFF.QInAExportUtil.setNonEmptyString(inaDataSource,
							rriName, dataSource.getRriValue());
				}
			}
		}
	};
	oFF.QInAComponent = function() {
	};
	oFF.QInAComponent.prototype = new oFF.XObject();
	oFF.QInAComponent.prototype.m_minVersion = 0;
	oFF.QInAComponent.prototype.m_maxVersion = 0;
	oFF.QInAComponent.prototype.getModelFormat = function() {
		return null;
	};
	oFF.QInAComponent.prototype.isMatching = function(version, inaImportElement) {
		if (this.m_minVersion === 0) {
			this.m_minVersion = this.getMinVersion();
			this.m_maxVersion = this.getMaxVersion();
		}
		return this.m_minVersion <= version && version <= this.m_maxVersion;
	};
	oFF.QInAComponent.prototype.getMinVersion = function() {
		return oFF.XVersion.MIN;
	};
	oFF.QInAComponent.prototype.getMaxVersion = function() {
		return oFF.XVersion.MAX;
	};
	oFF.QInAComponent.prototype.getName = function() {
		return this.getComponentType().getName();
	};
	oFF.QInAComponent.prototype.getTagName = function() {
		return null;
	};
	oFF.QInAComponent.prototype.toString = function() {
		return this.getName();
	};
	oFF.QInAExportUtil = {
		extendStructure : function(exporter, modelComponent, source) {
			var protocolExtension;
			var structure;
			var names;
			var i;
			var name;
			if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA)) {
				protocolExtension = modelComponent.getProtocolExtension();
				if (oFF.notNull(protocolExtension)) {
					structure = protocolExtension;
					if (modelComponent.isProtocolExtensionReplacing()) {
						return structure;
					}
					names = structure.getKeysAsReadOnlyListOfString();
					for (i = 0; i < names.size(); i++) {
						name = names.get(i);
						source.put(name, structure.getByKey(name));
					}
				}
			}
			return source;
		},
		extendStructureWithTagging : function(exporter, modelComponentBase,
				source) {
			var tagging;
			var keyList;
			var componentTaggingList;
			var i;
			var currentKey;
			var currentValue;
			var newKeyValuePair;
			if (exporter.mode === oFF.QModelFormat.INA_REPOSITORY) {
				tagging = modelComponentBase.getTagging();
				if (oFF.XCollectionUtils.hasElements(tagging)) {
					keyList = tagging.getKeysAsReadOnlyListOfString();
					componentTaggingList = source.putNewList("ComponentTags");
					for (i = 0; i < keyList.size(); i++) {
						currentKey = keyList.get(i);
						currentValue = tagging.getByKey(currentKey);
						newKeyValuePair = oFF.PrFactory.createStructure();
						componentTaggingList.add(newKeyValuePair);
						newKeyValuePair.putString("KEY", currentKey);
						if (oFF.isNull(currentValue)) {
							newKeyValuePair.putNull("VALUE");
						} else {
							newKeyValuePair.putString("VALUE", currentValue);
						}
					}
				}
			}
			return source;
		},
		extendList : function(modelComponent, source) {
			var protocolExtension;
			var list;
			if (oFF.notNull(source)) {
				protocolExtension = modelComponent.getProtocolExtension();
				if (oFF.notNull(protocolExtension)) {
					list = protocolExtension;
					if (modelComponent.isProtocolExtensionReplacing()) {
						return list;
					}
					source.addAll(list);
				}
			}
			return source;
		},
		setDate : function(exporter, structure, parameterName, date) {
			if (oFF.notNull(date)) {
				structure.putString(parameterName, oFF.QInAExportUtil
						.dateTimeToString(exporter, date));
			}
		},
		isNumberSafe : function(value) {
			return oFF.XMath.abs(value) < 9007199254740992;
		},
		setNonEmptyString : function(structure, parameterName, value) {
			if (oFF.XStringUtils.isNotNullAndNotEmpty(value)) {
				structure.putString(parameterName, value);
			}
		},
		setNameIfNotNull : function(structure, name, namedObject) {
			if (oFF.notNull(namedObject)) {
				structure.putString(name, namedObject.getName());
			}
		},
		dateTimeToString : function(exporter, value) {
			return exporter.supportsSAPDateFormat ? value.toSAPFormat() : value
					.toIsoFormat();
		}
	};
	oFF.QInAImportUtil = {
		importComponentTagging : function(importer, inaElement, modelComponent) {
			var inAStructure;
			var componentTagList;
			var componentTagging;
			var i;
			var currentComponentTag;
			var currentKey;
			if (oFF.notNull(inaElement)) {
				if (importer.mode === oFF.QModelFormat.INA_REPOSITORY
						&& inaElement.isStructure()
						&& oFF.notNull(modelComponent)) {
					inAStructure = inaElement;
					componentTagList = inAStructure
							.getListByKey("ComponentTags");
					if (!oFF.PrUtils.isListEmpty(componentTagList)) {
						componentTagging = modelComponent.getTagging();
						for (i = 0; i < componentTagList.size(); i++) {
							currentComponentTag = componentTagList
									.getStructureAt(i);
							if (oFF.notNull(currentComponentTag)) {
								currentKey = currentComponentTag
										.getStringByKey("KEY");
								if (oFF.XStringUtils
										.isNotNullAndNotEmpty(currentKey)) {
									componentTagging.put(currentKey,
											currentComponentTag
													.getStringByKey("VALUE"));
								}
							}
						}
					}
				}
			}
		}
	};
	oFF.QInASpatialClustering = {
		exportSpatialClusteringRequest : function(exporter, clusterSettings) {
			var request = oFF.PrFactory.createStructure();
			var inaAnalytics = request.putNewStructure("Analytics");
			var clusterField = clusterSettings.getClusterField();
			var queryModel = clusterField.getQueryModel();
			var inaDataSource = exporter.exportDataSource(queryModel
					.getDataSource(), false);
			var inaDimension;
			var inaCluster;
			var inaMeasure;
			var inaMember;
			var inaMemberOperand;
			var inaMembers;
			var inaDimensionList;
			var freeAxis;
			var sizeFreeAxis;
			var idxFree;
			var freeDimension;
			var freeDimensionType;
			var inaDefinition;
			inaAnalytics.put("DataSource", inaDataSource);
			inaDimension = exporter.exportDimension(
					clusterField.getDimension(), null);
			inaDimension.putString("Axis", oFF.QInAConverter
					.lookupAxisTypeInA(oFF.AxisType.ROWS));
			inaCluster = oFF.QInASpatialClustering
					.exportSpatialClusterSettings(clusterSettings);
			inaDimension.put("ClusterDefinition", inaCluster);
			inaMeasure = exporter.exportStructureDimension(queryModel
					.getMeasureDimension());
			inaMeasure.putString("Axis", oFF.QInAConverter
					.lookupAxisTypeInA(oFF.AxisType.COLUMNS));
			if (queryModel.getConvenienceCommands().isTypeOfBw()) {
				inaMember = oFF.PrFactory.createStructure();
				inaMember
						.putString(
								"Visibility",
								oFF.QInAConverter
										.lookupResultSetVisibilityInA(oFF.ResultVisibility.VISIBLE));
				inaMemberOperand = inaMember.putNewStructure("MemberOperand");
				inaMemberOperand.putString("AttributeName", "Measures");
				inaMemberOperand.putString("Comparison", oFF.QInAConverter
						.lookupComparisonInA(oFF.ComparisonOperator.EQUAL));
				inaMemberOperand.putString("Value", "1ROWCOUNT");
				inaMembers = inaMeasure.getListByKey("Members");
				inaMembers.clear();
				inaMembers.add(inaMember);
			}
			inaDimensionList = oFF.PrFactory.createList();
			inaDimensionList.add(inaDimension);
			inaDimensionList.add(inaMeasure);
			freeAxis = queryModel.getAxis(oFF.AxisType.FREE);
			sizeFreeAxis = freeAxis.size();
			for (idxFree = 0; idxFree < sizeFreeAxis; idxFree++) {
				freeDimension = freeAxis.get(idxFree);
				freeDimensionType = freeDimension.getDimensionType();
				if (freeDimensionType === oFF.DimensionType.CALCULATED_DIMENSION) {
					inaDimensionList.add(exporter.exportDimension(
							freeDimension, null));
				}
			}
			inaDefinition = inaAnalytics.putNewStructure("Definition");
			inaDefinition.put("Dimensions", inaDimensionList);
			exporter.exportFilter(queryModel.getFilter(), inaDefinition);
			if (queryModel.supportsConditions()
					&& queryModel.getConditionManager()
							.getEffectiveConditions().size() > 0) {
				exporter.exportConditionManager(queryModel
						.getConditionManager(), inaDefinition);
			}
			exporter.exportVariables(queryModel.getVariableContainer(),
					inaDefinition);
			inaDefinition.put("ResultSetFeatureRequest",
					oFF.QInASpatialClustering
							.exportResultSetFeatures(queryModel));
			return request;
		},
		exportSpatialClusterSettings : function(clusterSettings) {
			var inaCluster = oFF.PrFactory.createStructure();
			var inaParameters;
			var parameters;
			var keys;
			var key;
			var value;
			inaCluster.putBoolean("Active", clusterSettings.isActive());
			inaCluster.putString("ClusterAlgorithm", clusterSettings
					.getClusterAlgorithm().getName());
			inaCluster.putString("GeometryAttribute", clusterSettings
					.getClusterField().getName());
			inaParameters = inaCluster.putNewStructure("ClusterParameters");
			parameters = clusterSettings.getParameters();
			keys = parameters.getKeysAsIteratorOfString();
			while (keys.hasNext()) {
				key = keys.next();
				value = parameters.getByKey(key);
				if (value.getValueType() === oFF.XValueType.INTEGER) {
					inaParameters.putInteger(key, value.getInteger());
				} else {
					if (value.getValueType() === oFF.XValueType.DOUBLE) {
						inaParameters.putDouble(key, value.getDouble());
					} else {
						inaParameters.putString(key, value.toString());
					}
				}
			}
			return inaCluster;
		},
		exportResultSetFeatures : function(sourceQueryModel) {
			var options = oFF.PrFactory.createStructure();
			var queryManager;
			options.putBoolean("UseDefaultAttributeKey", false);
			queryManager = sourceQueryModel.getQueryManager();
			if (queryManager.getMaxResultRecords() !== -1) {
				options.putLong("MaxResultRecords", queryManager
						.getMaxResultRecords());
			}
			queryManager.fillPaging(options);
			options.putString("ResultFormat", "Version2");
			options.putString("ResultEncoding", "None");
			return options;
		}
	};
	oFF.QInAValueHelp = {
		exportVariableHelpRequest : function(exporter, queryModel, dimension,
				variable) {
			var request = oFF.QInAValueHelp.exportMemberHelpRequest(exporter,
					queryModel, dimension);
			var inaAnalytics = request.getStructureByKey("Analytics");
			var inaDefinition = inaAnalytics.getStructureByKey("Definition");
			var inaDimension = inaDefinition.getListByKey("Dimensions")
					.getStructureAt(0);
			var variables;
			var newVariable;
			var type;
			var directives;
			if (variable.getHierarchyName() !== null) {
				oFF.QInAValueHelp.exportVariableHierarchyInformation(
						inaDimension, variable);
			}
			variables = inaDefinition.putNewList("Variables");
			newVariable = variables.addNewStructure();
			newVariable.putString("Name", variable.getName());
			type = inaAnalytics.getStructureByKey("DataSource").getStringByKey(
					"Type");
			if (oFF.XString.isEqual(type, oFF.MetaObjectType.QUERY_VALUEHELP
					.getCamelCaseName())) {
				directives = inaAnalytics
						.putNewStructure("ProcessingDirectives");
				directives.putString("ProcessingStep", "VariableDefinition");
			} else {
				inaDefinition.putString("ValuehelpForVariable", variable
						.getName());
				exporter.exportVariables(queryModel.getVariableContainer(),
						inaDefinition);
				if (dimension.getReadMode(oFF.QContextType.SELECTOR) === oFF.QMemberReadMode.MASTER) {
					inaDefinition.putString("ReadMode", "Master");
				}
				if (inaDefinition.containsKey("FixedFilter")) {
					inaDefinition.remove("FixedFilter");
				}
			}
			return request;
		},
		throwErrorForDependentVariable : function(variable, dependentVariable) {
			var message = oFF.XStringBuffer.create();
			message.append("The dependent variable '");
			message.append(dependentVariable.getName());
			message.append("' of the variable '");
			message.append(variable.getName());
			message.append("' has no value set.");
			throw oFF.XException
					.createIllegalStateException(message.toString());
		},
		exportVariableHierarchyInformation : function(structure, variable) {
			var inaHierarchy = structure.putNewStructure("Hierarchy");
			var dependentVariables;
			var iterator;
			var someVariable;
			var hierarchyNameVariable;
			var hierarchyName;
			var dimensionMemberVariable;
			var someValue;
			if (variable.getVariableType() === oFF.VariableType.HIERARCHY_NODE_VARIABLE) {
				inaHierarchy.putStringNotNullAndNotEmpty("Name", variable
						.getHierarchyName());
				inaHierarchy.putStringNotNullAndNotEmpty("DueDate", variable
						.getHierarchyKeyDate());
				inaHierarchy.putStringNotNullAndNotEmpty("Version", variable
						.getHierarchyVersion());
				inaHierarchy.putInteger("InitialDrillLevel", variable
						.getDimension().getSelectorRootLevel());
			} else {
				dependentVariables = variable.getDependentVariables();
				iterator = dependentVariables.getIterator();
				while (iterator.hasNext()) {
					someVariable = iterator.next();
					if (someVariable.getVariableType() === oFF.VariableType.HIERARCHY_NAME_VARIABLE) {
						hierarchyNameVariable = someVariable;
						hierarchyName = hierarchyNameVariable
								.getValueByString();
						if (oFF.XStringUtils.isNullOrEmpty(hierarchyName)) {
							oFF.QInAValueHelp.throwErrorForDependentVariable(
									variable, hierarchyNameVariable);
						}
						inaHierarchy.putString("Name", hierarchyName);
					} else {
						if (someVariable.getVariableType() === oFF.VariableType.DIMENSION_MEMBER_VARIABLE) {
							dimensionMemberVariable = someVariable;
							someValue = dimensionMemberVariable
									.getValueByString();
							if (oFF.XStringUtils.isNullOrEmpty(someValue)) {
								oFF.QInAValueHelp
										.throwErrorForDependentVariable(
												variable,
												dimensionMemberVariable);
							}
							if (dimensionMemberVariable.getDimension()
									.getDimensionType() === oFF.DimensionType.DATE) {
								inaHierarchy.putStringNotNullAndNotEmpty(
										"DateTo", someValue);
							} else {
								inaHierarchy.putStringNotNullAndNotEmpty(
										"Version", someValue);
							}
						}
					}
				}
				oFF.XObjectExt.release(iterator);
				inaHierarchy.putInteger("InitialDrillLevel", variable
						.getDimension().getSelectorRootLevel());
			}
		},
		exportMemberHelpRequest : function(exporter, queryModel, dimension) {
			var request;
			var inaAnalytics;
			var inaDimensionList;
			var inaDefinition;
			var selectorFilterUsage;
			var isQueryFilter;
			var selectionContainer;
			var selectorHierarchyNode;
			var selectorHierarchyNodeName;
			var selectorHierarchyForLinkedNode;
			var memberValueForFilter;
			var hierarchyNodeFilter;
			var hierarchyNavigation;
			var iterator;
			var node;
			var hierarchyNavigationField;
			var complexRoot;
			var cartesianProduct;
			if (oFF.isNull(queryModel) || oFF.isNull(dimension)) {
				return null;
			}
			request = oFF.PrFactory.createStructure();
			inaAnalytics = request.putNewStructure("Analytics");
			oFF.QInADataSource.exportDataSource(exporter, queryModel
					.getDataSource(), false, inaAnalytics);
			inaDimensionList = oFF.PrFactory.createList();
			inaDimensionList.add(exporter.exportDimension(dimension, null));
			inaDefinition = inaAnalytics.putNewStructure("Definition");
			inaDefinition.put("Dimensions", inaDimensionList);
			exporter.exportVariables(queryModel.getVariableContainer(),
					inaDefinition);
			exporter.exportFixedFilter(queryModel.getFilter(), inaDefinition);
			oFF.QInAValueHelp.setOptionsVh(exporter, inaDefinition, dimension);
			if (exporter.supportsExtendedSort) {
				oFF.QInAValueHelp
						.exportExtendedSortVh(inaDefinition, dimension);
			}
			selectorFilterUsage = dimension.getSelectorFilterUsage();
			isQueryFilter = true;
			selectionContainer = null;
			if (selectorFilterUsage === oFF.QueryFilterUsage.QUERY_FILTER) {
				selectionContainer = queryModel.getFilter().getDynamicFilter();
			} else {
				if (selectorFilterUsage === oFF.QueryFilterUsage.QUERY_FILTER_EFFECTIVE) {
					selectionContainer = queryModel.getFilter()
							.getEffectiveFilter();
				} else {
					if (selectorFilterUsage === oFF.QueryFilterUsage.QUERY_FILTER_EXCLUDING_DIMENSION) {
						selectionContainer = queryModel.getFilter()
								.getDynamicFilter();
						oFF.QInAValueHelp.removeFilterOnDimensionVh(
								selectionContainer, dimension);
					} else {
						if (selectorFilterUsage === oFF.QueryFilterUsage.SELECTOR_FILTER) {
							selectionContainer = queryModel.getFilter()
									.getValuehelpFilter();
							isQueryFilter = false;
						}
					}
				}
			}
			selectorHierarchyNode = dimension.getSelectorHierarchyNode();
			selectorHierarchyNodeName = dimension
					.getSelectorHierarchyNodeName();
			selectorHierarchyForLinkedNode = dimension
					.getSelectorHierarchyForLinkedNode();
			memberValueForFilter = null;
			hierarchyNodeFilter = null;
			if (dimension.isSelectorHierarchyActive()) {
				if (oFF.notNull(selectorHierarchyNode)) {
					hierarchyNavigation = inaDefinition
							.putNewList("HierarchyNavigations");
					iterator = dimension.getNavigationNodes().getIterator();
					while (iterator.hasNext()) {
						node = iterator.next();
						hierarchyNavigationField = dimension
								.getHierarchyNavigationField();
						oFF.QInAValueHelp._addHierarchyNavigation(
								hierarchyNavigation, dimension.getName(),
								hierarchyNavigationField.getName(), node
										.getDimensionMember().getFieldValue(
												hierarchyNavigationField)
										.getString());
					}
					oFF.XObjectExt.release(iterator);
					memberValueForFilter = selectorHierarchyNode.getName();
				} else {
					if (oFF.XStringUtils
							.isNotNullAndNotEmpty(selectorHierarchyNodeName)) {
						oFF.QInAValueHelp._addHierarchyNavigation(inaDefinition
								.putNewList("HierarchyNavigations"), dimension
								.getName(), dimension.getSelectorKeyField()
								.getName(), selectorHierarchyNodeName);
						memberValueForFilter = selectorHierarchyNodeName;
					} else {
						if (oFF.notNull(selectorHierarchyForLinkedNode)
								&& selectorHierarchyForLinkedNode.getKey() !== null
								&& selectorHierarchyForLinkedNode.getValue() !== null) {
							oFF.QInAValueHelp
									._addHierarchyNavigation(
											inaDefinition
													.putNewList("HierarchyNavigations"),
											dimension.getName(),
											dimension
													.getHierarchyNavigationField()
													.getName(),
											selectorHierarchyForLinkedNode
													.getKey().toString());
							memberValueForFilter = selectorHierarchyForLinkedNode
									.getValue().toString();
						}
					}
				}
				if (isQueryFilter && oFF.notNull(selectionContainer)
						&& oFF.notNull(memberValueForFilter)) {
					hierarchyNodeFilter = selectionContainer
							.addSingleMemberFilterByDimension(dimension,
									memberValueForFilter,
									oFF.ComparisonOperator.EQUAL);
				}
			}
			oFF.QInAValueHelp.exportFilterSelectorVh(exporter, inaDefinition,
					selectionContainer);
			if (isQueryFilter && oFF.notNull(selectionContainer)
					&& oFF.notNull(hierarchyNodeFilter)) {
				complexRoot = selectionContainer.getComplexRoot();
				if (oFF.notNull(complexRoot)) {
					complexRoot.removeElement(hierarchyNodeFilter);
				} else {
					cartesianProduct = selectionContainer.getCartesianProduct();
					if (oFF.notNull(cartesianProduct)) {
						cartesianProduct.removeElement(hierarchyNodeFilter);
					}
				}
			}
			return request;
		},
		_addHierarchyNavigation : function(hierarchyNavigationList,
				dimensionName, fieldName, memberValue) {
			var hierarchyNavigation = hierarchyNavigationList.addNewStructure();
			var drillMember;
			hierarchyNavigation.putString("DrillState", oFF.QInAConverter
					.lookupDrillStateInA(oFF.DrillState.EXPANDED));
			drillMember = hierarchyNavigation.putNewStructure("DrillMember");
			drillMember.putString("DimensionName", dimensionName);
			drillMember.putString("FieldName", fieldName);
			drillMember.putString("Member", memberValue);
		},
		exportExtendedSortVh : function(inaDefinition, dimension) {
			var inaSort = inaDefinition.putNewList("Sort");
			var inaDimensionSort = inaSort.addNewStructure();
			inaDimensionSort.putString("Dimension", dimension.getName());
			inaDimensionSort.putString("Direction", oFF.QInAConverter
					.lookupSortDirectionInA2(dimension.getSelectorOrder()));
			inaDimensionSort.putString("SortType", "MemberKey");
		},
		removeFilterOnDimensionVh : function(querySelectionState, dimension) {
			var cartesianProduct = querySelectionState.getCartesianProduct();
			var filterIndex;
			var cartesianChild;
			if (oFF.notNull(cartesianProduct)) {
				filterIndex = 0;
				while (filterIndex < cartesianProduct.size()) {
					cartesianChild = cartesianProduct
							.getCartesianChild(filterIndex);
					if (cartesianChild.getDimension().isEqualTo(dimension)) {
						cartesianProduct.removeAt(filterIndex);
					} else {
						filterIndex++;
					}
				}
			}
		},
		exportFilterSelectorVh : function(exporter, inaDefinition,
				filterExpression) {
			var filterStructureElement = exporter
					.exportFilterExpression(filterExpression);
			if (oFF.notNull(filterStructureElement)) {
				inaDefinition.put("Filter", filterStructureElement);
			}
		},
		setOptionsVh : function(exporter, inaDefinition, dimension) {
			var resultSetFeatureRequest = inaDefinition
					.putNewStructure("ResultSetFeatureRequest");
			var queryModel;
			var subSetDescription;
			resultSetFeatureRequest.putBoolean("UseDefaultAttributeKey", false);
			if (dimension.isSelectorGettingInterval()
					&& exporter.capabilities
							.containsKey(oFF.InACapabilities.RESULTSET_INTERVAL)) {
				resultSetFeatureRequest.putBoolean("Interval", true);
			}
			resultSetFeatureRequest.putString("ResultFormat", "Version2");
			resultSetFeatureRequest.putString("ResultEncoding", "None");
			queryModel = dimension.getQueryModel();
			if (queryModel.supportsKeepOriginalTexts()) {
				resultSetFeatureRequest.putBoolean("ResultKeepOriginalTexts",
						queryModel.isKeepingOriginalTexts());
			}
			subSetDescription = resultSetFeatureRequest
					.putNewStructure("SubSetDescription");
			subSetDescription.putInteger("RowFrom", dimension
					.getSelectorPagingStart());
			subSetDescription.putInteger("RowTo", dimension
					.getSelectorPagingEnd());
		}
	};
	oFF.QInAValueUtils = {
		importValueByType : function(importer, inaElement, parameterName,
				valueType) {
			return oFF.QInAValueUtils._importValueInternal(importer, null,
					inaElement, parameterName, valueType, null, true);
		},
		importSupplementsAndValue : function(importer, valueBag, inaElement,
				parameterName, valueType, field) {
			var supplementsInA;
			var numberOfSupplements;
			var i;
			var supplementElement;
			var key;
			var value;
			var correctedKey;
			var correctedValue;
			oFF.QInAValueUtils.importValue(importer, valueBag, inaElement,
					parameterName, valueType, field);
			supplementsInA = inaElement.getListByKey("Supplements");
			if (oFF.notNull(supplementsInA) && supplementsInA.hasElements()) {
				numberOfSupplements = supplementsInA.size();
				for (i = 0; i < numberOfSupplements; i++) {
					supplementElement = supplementsInA.getStructureAt(i);
					key = supplementElement.getByKey("Key");
					value = supplementElement.getByKey("Value");
					correctedKey = oFF.QInAValueUtils
							.correctRemovingUnwantedBackslashAndQuotes(key
									.getString());
					correctedValue = oFF.QInAValueUtils
							.correctRemovingUnwantedBackslashAndQuotes(value
									.getString());
					valueBag.addSupplementValue(correctedKey, correctedValue);
				}
			}
		},
		containsEscapedQuote : function(junkKey) {
			return oFF.XStringUtils.isNotNullAndNotEmpty(junkKey)
					&& (oFF.XString.getCharAt(junkKey, 0) === 92 || oFF.XString
							.getCharAt(junkKey, 0) === 34)
					&& (oFF.XString.getCharAt(junkKey, oFF.XString
							.size(junkKey) - 1) === 92 || oFF.XString
							.getCharAt(junkKey, oFF.XString.size(junkKey) - 1) === 34);
		},
		correctRemovingUnwantedBackslashAndQuotes : function(junkKey) {
			var cleanedValue = junkKey;
			while (oFF.QInAValueUtils.containsEscapedQuote(cleanedValue)) {
				cleanedValue = oFF.XStringUtils.stripChars(cleanedValue, 1);
			}
			return cleanedValue;
		},
		importValue : function(importer, valueBag, inaElement, parameterName,
				valueType, field) {
			oFF.QInAValueUtils._importValueInternal(importer, valueBag,
					inaElement, parameterName, valueType, field, false);
		},
		getDouble : function(inaElement, parameterName2) {
			var doubleValue;
			var doubleElement = inaElement.getByKey(parameterName2);
			var stringValue;
			if (doubleElement.isString()) {
				stringValue = doubleElement.getString();
				doubleValue = oFF.XDouble.convertFromString(stringValue);
			} else {
				if (doubleElement.isDouble()) {
					doubleValue = doubleElement.getDouble();
				} else {
					if (doubleElement.isInteger()) {
						doubleValue = doubleElement.getInteger();
					} else {
						doubleValue = 0;
					}
				}
			}
			return doubleValue;
		},
		_importValueInternal : function(importer, valueBag, inaElement,
				parameterName, valueType, field, returnValue) {
			var useSapDateFormat = importer.supportsSAPDateFormat;
			var useFieldLiteralValue = oFF.PrUtils.getBooleanValueProperty(
					inaElement, "FieldLiteralValue", false);
			var parameterName2 = parameterName;
			var valueType2;
			var inaValueType;
			var fieldValue;
			var stringValue;
			var dimension;
			var dimensionMember;
			var doubleValue;
			var intValue;
			var booleanValue;
			var longValue;
			var dateValue;
			var timeValue;
			var dateTimeValue;
			var geometry;
			if (oFF.isNull(parameterName2)) {
				parameterName2 = "Value";
			}
			valueType2 = valueType;
			if (oFF.isNull(valueType2)) {
				inaValueType = inaElement.getStringByKey(oFF.XStringUtils
						.concatenate2(parameterName2, "Type"));
				valueType2 = oFF.QInAConverter.lookupValueType(inaValueType);
				useSapDateFormat = false;
			}
			if (valueType2 === oFF.XValueType.STRING) {
				stringValue = inaElement.getStringByKey(parameterName2);
				if (returnValue) {
					return oFF.XStringValue.create(stringValue);
				}
				if (oFF.isNull(field) || !useFieldLiteralValue) {
					valueBag.setString(stringValue);
				} else {
					dimension = field.getDimension();
					dimensionMember = dimension.getDimensionMember(stringValue);
					if (dimension.isStructure() && oFF.notNull(dimensionMember)) {
						valueBag.setDimensionMember(dimensionMember);
					} else {
						fieldValue = field.createFieldLiteralValue();
						fieldValue.setLiteralString(stringValue);
						valueBag.setFieldValue(fieldValue);
					}
				}
			} else {
				if (valueType2 === oFF.XValueType.DOUBLE
						|| valueType2 === oFF.XValueType.DECIMAL_FLOAT) {
					doubleValue = oFF.QInAValueUtils.getDouble(inaElement,
							parameterName2);
					if (returnValue) {
						return oFF.XDoubleValue.create(doubleValue);
					}
					if (oFF.isNull(field) || !useFieldLiteralValue) {
						valueBag.setDouble(doubleValue);
					} else {
						fieldValue = field.createFieldLiteralValue();
						fieldValue.setLiteralDouble(doubleValue);
						valueBag.setFieldValue(fieldValue);
					}
				} else {
					if (valueType2 === oFF.XValueType.INTEGER) {
						intValue = inaElement.getIntegerByKey(parameterName2);
						if (returnValue) {
							return oFF.XIntegerValue.create(intValue);
						}
						if (oFF.isNull(field) || !useFieldLiteralValue) {
							valueBag.setInteger(intValue);
						} else {
							fieldValue = field.createFieldLiteralValue();
							fieldValue.setLiteralInt(intValue);
							valueBag.setFieldValue(fieldValue);
						}
					} else {
						if (valueType2 === oFF.XValueType.BOOLEAN) {
							booleanValue = inaElement
									.getBooleanByKey(parameterName2);
							if (returnValue) {
								return oFF.XBooleanValue.create(booleanValue);
							}
							valueBag.setBoolean(booleanValue);
						} else {
							if (valueType2 === oFF.XValueType.LONG) {
								longValue = oFF.PrUtils.getLongValueProperty(
										inaElement, parameterName2, 0);
								if (returnValue) {
									return oFF.XLongValue.create(longValue);
								}
								if (oFF.isNull(field) || !useFieldLiteralValue) {
									valueBag.setLong(longValue);
								} else {
									fieldValue = field
											.createFieldLiteralValue();
									fieldValue.setLiteralLong(longValue);
									valueBag.setFieldValue(fieldValue);
								}
							} else {
								if (valueType2 === oFF.XValueType.DATE) {
									stringValue = inaElement
											.getStringByKey(parameterName2);
									dateValue = oFF.XDate
											.createDateFromStringWithFlag(
													stringValue,
													useSapDateFormat);
									if (returnValue) {
										return dateValue;
									}
									if (oFF.isNull(field)
											|| !useFieldLiteralValue) {
										valueBag.setDate(dateValue);
									} else {
										fieldValue = field
												.createFieldLiteralValue();
										fieldValue.setLiteralDate(dateValue);
										valueBag.setFieldValue(fieldValue);
									}
								} else {
									if (valueType2 === oFF.XValueType.TIME) {
										stringValue = inaElement
												.getStringByKey(parameterName2);
										timeValue = oFF.XTime
												.createTimeFromStringWithFlag(
														stringValue,
														useSapDateFormat);
										if (returnValue) {
											return timeValue;
										}
										valueBag.setTime(timeValue);
									} else {
										if (valueType2 === oFF.XValueType.DATE_TIME) {
											stringValue = inaElement
													.getStringByKey(parameterName2);
											dateTimeValue = oFF.XDateTime
													.createDateTimeFromStringWithFlag(
															stringValue,
															useSapDateFormat);
											if (returnValue) {
												return dateTimeValue;
											}
											if (oFF.isNull(field)
													|| !useFieldLiteralValue) {
												valueBag
														.setDateTime(dateTimeValue);
											} else {
												fieldValue = field
														.createFieldLiteralValue();
												fieldValue
														.setLiteralDate(dateTimeValue);
												valueBag
														.setFieldValue(fieldValue);
											}
										} else {
											if (valueType2.isSpatial()) {
												stringValue = inaElement
														.getStringByKey(parameterName2);
												geometry = oFF.XGeometryValue
														.createGeometryValueWithWkt(stringValue);
												if (returnValue) {
													return geometry;
												}
												valueBag.setValue(geometry);
												if (importer.supportsSpatialFilterSrid
														&& inaElement
																.containsKey("SRID")) {
													valueBag
															.getGeometry()
															.setSrid(
																	oFF.XIntegerValue
																			.create(inaElement
																					.getIntegerByKey("SRID")));
												}
											} else {
												if (valueType2 === oFF.XValueType.UNSUPPORTED) {
													return null;
												} else {
													if (valueType2 === oFF.XValueType.VARIABLE
															|| valueType2 === oFF.XValueType.CURRENT_MEMBER) {
														if (!returnValue) {
															valueBag
																	.setFilterValueType(valueType2);
														}
														return null;
													} else {
														importer
																.addError(
																		oFF.ErrorCodes.INVALID_TOKEN,
																		oFF.XStringUtils
																				.concatenate3(
																						"Unsupported value type '",
																						valueType2
																								.getName(),
																						"'"));
														return null;
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			return null;
		},
		exportValue : function(exporter, parameterName, inaElement,
				valueAccess, valueType) {
			oFF.QInAValueUtils.exportFieldValue(exporter, parameterName,
					inaElement, null, valueAccess, valueType);
		},
		exportFieldValue : function(exporter, parameterName, inaElement, field,
				valueAccess, valueType) {
			var tmpUseSapDateFormat = exporter.supportsSAPDateFormat;
			var parameterName2 = parameterName;
			var valueType2;
			var inaValueType;
			var geometry;
			var srid;
			if (oFF.isNull(parameterName2)) {
				parameterName2 = "Value";
			}
			valueType2 = valueType;
			if (oFF.isNull(valueType2)) {
				valueType2 = valueAccess.getValueType();
				inaValueType = oFF.QInAConverter.lookupValueTypeInA(valueType2);
				inaElement.putString(oFF.XStringUtils.concatenate2(
						parameterName2, "Type"), inaValueType);
				exporter.supportsSAPDateFormat = false;
			}
			if (valueType2 === oFF.XValueType.STRING) {
				inaElement.putString(parameterName2, valueAccess.getString());
			} else {
				if (valueType2 === oFF.XValueType.INTEGER) {
					inaElement.putInteger(parameterName2, valueAccess
							.getInteger());
				} else {
					if (valueType2 === oFF.XValueType.LONG) {
						inaElement.putLong(parameterName2, valueAccess
								.getLong());
					} else {
						if (valueType2 === oFF.XValueType.DOUBLE
								|| valueType2 === oFF.XValueType.DECIMAL_FLOAT) {
							inaElement.putDouble(parameterName2, valueAccess
									.getDouble());
						} else {
							if (valueType2 === oFF.XValueType.BOOLEAN) {
								inaElement.putBoolean(parameterName2,
										valueAccess.getBoolean());
							} else {
								if (valueType2 === oFF.XValueType.DATE) {
									oFF.QInAExportUtil.setDate(exporter,
											inaElement, parameterName2,
											valueAccess.getDate());
								} else {
									if (valueType2 === oFF.XValueType.TIME) {
										oFF.QInAExportUtil.setDate(exporter,
												inaElement, parameterName2,
												valueAccess.getTime());
									} else {
										if (valueType2 === oFF.XValueType.DATE_TIME) {
											oFF.QInAExportUtil.setDate(
													exporter, inaElement,
													parameterName2, valueAccess
															.getDateTime());
										}
									}
								}
							}
						}
					}
				}
			}
			if (oFF.notNull(valueType2) && valueType2.isSpatial()) {
				geometry = valueAccess.getGeometry();
				inaElement.putString(parameterName2, geometry.toWKT());
				srid = geometry.getSrid();
				if (exporter.supportsSpatialFilterSrid && oFF.notNull(srid)) {
					inaElement.putInteger("SRID", srid.getInteger());
				}
			}
			if (oFF.notNull(field)) {
				inaElement.putBoolean("FieldLiteralValue", true);
			}
			exporter.supportsSAPDateFormat = tmpUseSapDateFormat;
		},
		exportSupplementsAndValue : function(exporter, parameterName,
				inaElement, field, value, valueType) {
			var supplementValues;
			var supplementValuesList;
			var numberOfSupplementValues;
			var j;
			var supplement;
			var ixKeyValuePair;
			oFF.QInAValueUtils.exportFieldValue(exporter, parameterName,
					inaElement, field, value, valueType);
			supplementValues = value.getSupplementValues();
			if (oFF.XCollectionUtils.hasElements(supplementValues)) {
				supplementValuesList = inaElement.putNewList("Supplements");
				numberOfSupplementValues = supplementValues.size();
				for (j = 0; j < numberOfSupplementValues; j++) {
					supplement = supplementValuesList.addNewStructure();
					ixKeyValuePair = supplementValues.get(j);
					supplement.putString("Key", ixKeyValuePair.getKey()
							.toString());
					supplement.putString("Value", ixKeyValuePair.getValue()
							.toString());
				}
			}
		},
		exportFilterValue : function(exporter, parameterName, inaElement,
				value, valueType) {
			var variableValue;
			if (valueType === oFF.XValueType.VARIABLE) {
				variableValue = value.getVariableValue();
				if (oFF.notNull(variableValue)) {
					inaElement
							.putString(parameterName, variableValue.getName());
					if (oFF.XString.isEqual(parameterName, "Low")) {
						inaElement.putString("LowIs", "Variable");
					} else {
						if (oFF.XString.isEqual(parameterName, "High")) {
							inaElement.putString("HighIs", "Variable");
						}
					}
				}
			} else {
				oFF.QInAValueUtils.exportValue(exporter, parameterName,
						inaElement, value, valueType);
			}
		},
		importSupplements : function(importer, value, structure, parameter,
				supplementFields) {
			var supplementValues;
			var sizeA;
			var sizeB;
			var i;
			if (importer.supportsSupplements && oFF.notNull(parameter)
					&& oFF.XCollectionUtils.hasElements(supplementFields)) {
				supplementValues = structure.getListByKey(parameter);
				if (oFF.notNull(supplementValues)) {
					sizeA = supplementValues.size();
					sizeB = supplementFields.size();
					if (sizeA === sizeB) {
						for (i = 0; i < sizeA; i++) {
							value
									.addSupplementValue(supplementFields.get(i)
											.getName(), supplementValues
											.getStringAt(i));
						}
					} else {
						importer
								.addWarning(oFF.ErrorCodes.INVALID_STATE,
										"InA protocol error: Supplement sizes of values and field names do not match.");
					}
				}
			}
		}
	};
	oFF.QInAMdCapabilities = {
		importCapabilities : function(sysCapabilities, queryCapabilities) {
			var systemType = queryCapabilities.getSystemType();
			var isBW = false;
			var isHana = false;
			var isBpcs = false;
			if (oFF.notNull(systemType)) {
				isBW = systemType.isTypeOf(oFF.SystemType.BW);
				isHana = systemType.isTypeOf(oFF.SystemType.HANA);
				isBpcs = systemType.isTypeOf(oFF.SystemType.BPCS);
			}
			queryCapabilities.setSupportsShutdown(oFF.QInAMdCapabilities
					.supports(sysCapabilities,
							oFF.InACapabilities.STATEFUL_DATA_PROVIDER, isBW
									|| isHana));
			queryCapabilities.setSupportsDirectVariableTransfer(!isBW);
			queryCapabilities.setSupportsCheckVariables(!isBW);
			queryCapabilities
					.setSupportsDataCellMixedValues(oFF.QInAMdCapabilities
							.supports(sysCapabilities,
									oFF.InACapabilities.DATA_CELL_MIXED_VALUES,
									false));
			queryCapabilities
					.setSupportsCustomDimensionFilterCapability(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.CUSTOM_DIMENSION_FILTER,
									isBW));
			queryCapabilities
					.setSupportsRestrictedMeasures(oFF.QInAMdCapabilities
							.supports(sysCapabilities,
									oFF.InACapabilities.RESTRICTED_KEYFIGURES,
									isHana));
			queryCapabilities.setSupportsFormulaMeasures(oFF.QInAMdCapabilities
					.supports(sysCapabilities,
							oFF.InACapabilities.CALCULATED_KEYFIGURES, isHana));
			queryCapabilities
					.setSupportsCartesianFilterIntersect(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.CARTESIAN_FILTER_INTERSECT,
									false));
			queryCapabilities.setSupportsIntersectLayers(oFF.QInAMdCapabilities
					.supports(sysCapabilities,
							oFF.InACapabilities.CARTESIAN_FILTER_INTERSECT,
							false));
			queryCapabilities
					.setSupportsCellValueOperands(oFF.QInAMdCapabilities
							.supports(sysCapabilities,
									oFF.InACapabilities.CELL_VALUE_OPERAND,
									false));
			queryCapabilities.setSupportsComplexFilter(oFF.QInAMdCapabilities
					.supports(sysCapabilities,
							oFF.InACapabilities.COMPLEX_FILTERS, false));
			queryCapabilities
					.setSupportsVisibilityFilter(oFF.QInAMdCapabilities
							.supports(sysCapabilities,
									oFF.InACapabilities.VISIBILITY_FILTER,
									false));
			queryCapabilities.setSupportsSetOperand(oFF.QInAMdCapabilities
					.supports(sysCapabilities, oFF.InACapabilities.SET_OPERAND,
							false));
			queryCapabilities
					.setSupportsConvertToFlatFilter(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.HIERARCHY_SELECTION_AS_FLAT_SELECTION,
									false));
			queryCapabilities.setSupportsCummulative(oFF.QInAMdCapabilities
					.supports(sysCapabilities, oFF.InACapabilities.CUMMULATIVE,
							false));
			queryCapabilities
					.setSupportsHierarchyNavCounter(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.HIERARCHY_NAVIGATION_COUNTER,
									false));
			queryCapabilities
					.setSupportsHierarchyAttHierFields(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.ATTRIBUTE_HIERARCHY_HIERARCHY_FIELDS,
									false));
			queryCapabilities
					.setSupportsHierarchyCarryingDim(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.ATTRIBUTE_HIERARCHY_HIERARCHY_FIELDS,
									isBW || isBpcs));
			queryCapabilities.setSupportsSortType(oFF.QInAMdCapabilities
					.supports(sysCapabilities, oFF.InACapabilities.SORT_TYPE,
							false));
			queryCapabilities.setSupportsSpatialFilter(oFF.QInAMdCapabilities
					.supports(sysCapabilities,
							oFF.InACapabilities.SPATIAL_FILTER, false));
			if (queryCapabilities.supportsSpatialFilter()) {
				queryCapabilities
						.setSupportsSpatialFilterSrid(oFF.QInAMdCapabilities
								.supports(
										sysCapabilities,
										oFF.InACapabilities.SPATIAL_FILTER_WITH_SRID,
										false));
			}
			queryCapabilities
					.setSupportsComplexTupleFilter(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InactiveCapabilities.COMPLEX_TUPLE_FILTER
											.getName(), false));
			queryCapabilities.setSupportsTuplesOperand(oFF.QInAMdCapabilities
					.supports(sysCapabilities,
							oFF.InactiveCapabilities.TUPLES_OPERAND.getName(),
							false));
			queryCapabilities
					.setSupportsExtendedDimensions(oFF.QInAMdCapabilities
							.supports(sysCapabilities,
									oFF.InACapabilities.EXTENDED_DIMENSIONS,
									false));
			queryCapabilities.setSupportsSortNewValues(oFF.QInAMdCapabilities
					.supports(sysCapabilities,
							oFF.InACapabilities.SORT_NEW_VALUES, false));
			queryCapabilities
					.setSupportsIgnoreUnitOfZeroValueInAggregation(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.IGNORE_UNIT_OF_ZERO_VALUE_IN_AGGREGATION,
									false));
			queryCapabilities
					.setSupportsCubeBlendingWithNSubqueries(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InactiveCapabilities.CUBE_BLENDING_N_QUERIES
											.getName(), false));
			queryCapabilities
					.setSupportsExtendedDimensionsChangeDefaultRenamingAndDescription(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.EXTENDED_DIMENSION_CHANGE_DEFAULT_RENAMING_AND_DESCRIPTION,
									false));
			queryCapabilities
					.setSupportsExtendedDimensionsCopyAllHierarchies(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.EXTENDED_DIMENSION_COPY_ALL_HIERARCHIES,
									false));
			queryCapabilities
					.setSupportsFixMetadataHierarchyAttributes(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.FIX_METADATA_HIERARCHY_ATTRIBUTES,
									false));
			queryCapabilities
					.setSupportsUniversalDisplayHierarchies(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.UNIVERSAL_DISPLAY_HIERARCHIES,
									false));
			queryCapabilities
					.setSupportsUniversalDisplayHierarchiesCustomDimensions(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InactiveCapabilities.UNIVERSAL_DISPLAY_HIERARCHY_CUSTOM_DIM
											.getName(), false));
			queryCapabilities.setSupportsRemoteBlending(oFF.QInAMdCapabilities
					.supports(sysCapabilities,
							oFF.InACapabilities.REMOTE_BLENDING, false));
			queryCapabilities.setSupportsCubeCache(oFF.QInAMdCapabilities
					.supports(sysCapabilities, oFF.InACapabilities.CUBE_CACHE,
							false));
			queryCapabilities
					.setSupportsCatalogServiceV2(oFF.QInAMdCapabilities
							.supports(sysCapabilities,
									oFF.InACapabilities.CATALOG_SERVICE_V20,
									false));
			queryCapabilities
					.setSupportsExtendedVariableDefinition(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.EXTENDED_VARIABLE_DEFINITION,
									false));
			queryCapabilities.setSupportsCustomSort(oFF.QInAMdCapabilities
					.supports(sysCapabilities, oFF.InACapabilities.CUSTOM_SORT,
							false));
			queryCapabilities
					.setSupportsDataRefreshAndDataTopicality(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.DATA_REFRESH_AND_DATA_TOPICALITY,
									false));
			queryCapabilities
					.setSupportsRemoteBlendingBW(oFF.QInAMdCapabilities
							.supports(sysCapabilities,
									oFF.InactiveCapabilities.REMOTE_BLENDING_BW
											.getName(), false));
			queryCapabilities
					.setSupportsCustomMeasureSortOrder(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.CUSTOM_MEASURE_SORTORDER,
									false));
			queryCapabilities
					.setSupportsExceptionAggregationAvgNullSelectionMember(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.EXCEPTION_AGGREGATION_AVGNULL_SELECTION_MEMBER,
									false));
			queryCapabilities
					.setSupportsExceptionAggregationCountNullSelectionMember(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.EXCEPTION_AGGREGATION_COUNTNULL_SELECTION_MEMBER,
									false));
			queryCapabilities
					.setSupportsStatisticalAggregations(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.STATISTICAL_AGGREGATIONS,
									false));
			queryCapabilities
					.setSupportsF4FilterForTextField(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InactiveCapabilities.F4_FILTER_FOR_TEXT_FIELD
											.getName(), false));
			queryCapabilities
					.setSupportsHierarchyNavigationField(oFF.QInAMdCapabilities
							.supports(sysCapabilities,
									oFF.InactiveCapabilities.SID_PRESENTATION
											.getName(), false));
			queryCapabilities
					.setSupportsVarianceOperator(oFF.QInAMdCapabilities
							.supports(sysCapabilities,
									oFF.InACapabilities.VARIANCE_OPERATOR,
									false));
			queryCapabilities
					.setSupportsAsyncRemoteModelValidation(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.MD_DS_DEF_VAL_EXPOSE_DS,
									false));
			queryCapabilities
					.setSupportsExtendedKeyFigureProperties(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.EXT_KEYFIGURE_PROPERTIES,
									false));
			queryCapabilities
					.setSupportsDetailedResponseExpansion(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InactiveCapabilities.DETAILED_RESPONSE_EXPANSION
											.getName(), false));
			queryCapabilities
					.setSupportsDynamicVariableRefresh(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InactiveCapabilities.VIRTUAL_DS_VARIABLE_VALUES
											.getName(), false));
			queryCapabilities.setSupportsExpandQueryAxis(oFF.QInAMdCapabilities
					.supports(sysCapabilities,
							oFF.InactiveCapabilities.EXPAND_QUERY_AXIS
									.getName(), false));
			queryCapabilities
					.setSupportsQueryCurrencyTranslation(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.QUERY_CURRENCY_TRANSLATION,
									false));
			queryCapabilities
					.setSupportsStructureRestrictionsInValueHelp(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InACapabilities.STRUCTURE_RESTRICTIONS_IN_VALUE_HELP,
									false));
			queryCapabilities
					.setSupportsSpatialChoropleth(oFF.QInAMdCapabilities
							.supports(sysCapabilities,
									oFF.InACapabilities.SPATIAL_CHOROPLETH,
									false));
			queryCapabilities
					.setSupportsInaCurrentMember(oFF.QInAMdCapabilities
							.supports(sysCapabilities,
									oFF.InACapabilities.INA_CURRENT_MEMBER,
									false));
			queryCapabilities
					.setSupportsDimensionDefaultMember(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InactiveCapabilities.DIMENSION_DEFAULT_MEMBER
											.getName(), false));
			queryCapabilities
					.setSupportsDimensionVisibility(oFF.QInAMdCapabilities
							.supports(
									sysCapabilities,
									oFF.InactiveCapabilities.DIMENSION_VISIBILITY
											.getName(), false));
		},
		supports : function(capabilityContainer, name, defaultValue) {
			var flag = defaultValue;
			if (oFF.notNull(capabilityContainer)) {
				flag = flag || capabilityContainer.containsKey(name);
			}
			return flag;
		}
	};
	oFF.PlanningStateHandler = {
		s_planningStateUpdater : null,
		setInstance : function(planningStateUpdater) {
			oFF.PlanningStateHandler.s_planningStateUpdater = planningStateUpdater;
		},
		update : function(application, systemName, response, messageCollector) {
			oFF.PlanningStateHandler.s_planningStateUpdater.update(application,
					systemName, response, messageCollector);
		},
		updateFromResponse : function(application, systemName, request,
				response, messageCollector) {
			oFF.PlanningStateHandler.s_planningStateUpdater.updateFromResponse(
					application, systemName, request, response,
					messageCollector);
		},
		getDataAreaStateByName : function(application, systemName, dataArea) {
			return oFF.PlanningStateHandler.s_planningStateUpdater
					.getDataAreaStateByName(application, systemName, dataArea);
		}
	};
	oFF.PlanningStateHandlerDummyImpl = function() {
	};
	oFF.PlanningStateHandlerDummyImpl.prototype = new oFF.XObject();
	oFF.PlanningStateHandlerDummyImpl.prototype.update = function(application,
			systemName, response, messageCollector) {
		return;
	};
	oFF.PlanningStateHandlerDummyImpl.prototype.updateFromResponse = function(
			application, systemName, request, response, messageCollector) {
		return;
	};
	oFF.PlanningStateHandlerDummyImpl.prototype.getDataAreaStateByName = function(
			application, systemName, dataArea) {
		return null;
	};
	oFF.InAQMgrMergeSettings = function() {
	};
	oFF.InAQMgrMergeSettings.prototype = new oFF.XObject();
	oFF.InAQMgrMergeSettings.create = function(isInitialBWMerge) {
		var newObj = new oFF.InAQMgrMergeSettings();
		newObj.m_isInitialBWMerge = isInitialBWMerge;
		return newObj;
	};
	oFF.InAQMgrMergeSettings.prototype.m_isInitialBWMerge = false;
	oFF.InAQMgrMergeSettings.prototype.isInitialBWMerge = function() {
		return this.m_isInitialBWMerge;
	};
	oFF.InAQMgrUtils = {
		applyResultSetFeatureCapabilities : function(provider, inaQueryModel) {
			var rsFeatureCapabilities = inaQueryModel
					.getStructureByKey("ResultSetFeatureCapabilities");
			var rsFormat;
			var useEncodedRs;
			var i;
			var format;
			if (oFF.notNull(rsFeatureCapabilities)) {
				rsFormat = rsFeatureCapabilities.getListByKey("ResultFormat");
				if (oFF.notNull(rsFormat)) {
					useEncodedRs = provider.useEncodedRs();
					if (useEncodedRs) {
						useEncodedRs = false;
						for (i = 0; i < rsFormat.size(); i++) {
							format = rsFormat.getStringAt(i);
							if (oFF.XString.isEqual(format, "Version2")) {
								useEncodedRs = true;
								break;
							}
						}
						provider.setUseEncodedRs(useEncodedRs);
					}
				}
			}
		}
	};
	oFF.InARsEncodedValues = function() {
	};
	oFF.InARsEncodedValues.prototype = new oFF.XObject();
	oFF.InARsEncodedValues.createByStructure = function(inaValueElement) {
		var inaEncoding = inaValueElement.getStringByKey("Encoding");
		var encoding = oFF.QInAConverter.lookupEncoding(inaEncoding);
		var inaValues = inaValueElement.getListByKey("Values");
		return oFF.InARsEncodedValues.create(encoding, inaValues);
	};
	oFF.InARsEncodedValues.create = function(encoding, values) {
		var object = new oFF.InARsEncodedValues();
		object.setupExt(encoding, values);
		return object;
	};
	oFF.InARsEncodedValues.prototype.m_values = null;
	oFF.InARsEncodedValues.prototype.m_index = 0;
	oFF.InARsEncodedValues.prototype.m_size = 0;
	oFF.InARsEncodedValues.prototype.setupExt = function(encoding, values) {
		this.m_values = values;
		this.m_index = -1;
		if (encoding !== oFF.ResultSetEncoding.NONE) {
			throw oFF.XException
					.createIllegalStateException("Wrong or no encoding given");
		}
		this.m_size = values.size();
	};
	oFF.InARsEncodedValues.prototype.releaseObject = function() {
		this.m_values = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.InARsEncodedValues.prototype.getIndexForIntegerValue = function(value) {
		var size;
		var i;
		if (value > -1) {
			size = this.m_values.size();
			for (i = 0; i < size; i++) {
				if (this.m_values.getIntegerAt(i) === value) {
					return i;
				}
			}
		}
		return value;
	};
	oFF.InARsEncodedValues.prototype.getNextIntegerValue = function() {
		this.m_index++;
		return this.m_values.getIntegerAt(this.m_index);
	};
	oFF.InARsEncodedValues.prototype.getNextStringValue = function() {
		this.m_index++;
		return this.m_values.getStringAt(this.m_index);
	};
	oFF.InARsEncodedValues.prototype.getNextDoubleValue = function() {
		this.m_index++;
		return this.m_values.getDoubleAt(this.m_index);
	};
	oFF.InARsEncodedValues.prototype.hasNextValue = function() {
		return this.m_index + 1 < this.m_size;
	};
	oFF.InARsEncodedValues.prototype.resetCursor = function() {
		this.m_index = -1;
	};
	oFF.InARsEncodedValues.prototype.skip = function() {
		this.m_index++;
	};
	oFF.InARsEncodedValues.prototype.size = function() {
		return this.m_size;
	};
	oFF.QInADataSource = function() {
	};
	oFF.QInADataSource.prototype = new oFF.QInAComponent();
	oFF.QInADataSource.importQd = function(importer, inaParent, name, context) {
		var inaStructure = inaParent;
		var type;
		var legacyDataSource;
		var dataSource;
		var systemName;
		var typeValue;
		var metaObjectType;
		var sources;
		var multiSources;
		var sourceSize;
		var i;
		var sourceStructure;
		var multiSource;
		var mappings;
		var validationHash;
		var genericServiceDescription;
		if (oFF.notNull(name)) {
			if (oFF.notNull(inaStructure) && !inaStructure.containsKey(name)) {
				inaStructure = inaStructure.getStructureByKey("Analytics");
				if (oFF.notNull(inaStructure)
						&& !inaStructure.containsKey(name)) {
					inaStructure = inaStructure.getStructureByKey("Definition");
				}
			}
			if (oFF.notNull(inaStructure) && inaStructure.containsKey(name)) {
				type = inaStructure.getElementTypeByKey(name);
				if (type === oFF.PrElementType.STRING) {
					legacyDataSource = oFF.QFactory.newDataSource();
					legacyDataSource.setType(oFF.MetaObjectType.INFOPROVIDER);
					legacyDataSource.setObjectName(inaStructure
							.getStringByKey(name));
					return legacyDataSource;
				} else {
					if (type === oFF.PrElementType.STRUCTURE) {
						inaStructure = inaStructure.getStructureByKey(name);
					}
				}
			}
		}
		if (oFF.isNull(inaStructure)) {
			return null;
		}
		dataSource = oFF.QFactory.newDataSource();
		systemName = inaStructure.getStringByKey("System");
		if (oFF.notNull(systemName)) {
			dataSource.setSystemName(systemName);
		}
		typeValue = inaStructure.getStringByKey("Type");
		metaObjectType = null;
		if (oFF.notNull(typeValue)) {
			typeValue = oFF.XString.toLowerCase(typeValue);
			metaObjectType = oFF.MetaObjectType.lookup(typeValue);
		}
		if (oFF.isNull(metaObjectType)) {
			metaObjectType = oFF.MetaObjectType.DBVIEW;
		}
		dataSource.setType(metaObjectType);
		oFF.QInADataSourceProperties.importQd(dataSource, inaStructure);
		if (metaObjectType === oFF.MetaObjectType.MULTI_SOURCE
				|| metaObjectType === oFF.MetaObjectType.BLENDING) {
			sources = oFF.PrUtils.getListProperty(inaStructure, "Sources");
			if (oFF.notNull(sources)) {
				multiSources = dataSource.getMultiSourcesBase();
				sourceSize = sources.size();
				for (i = 0; i < sourceSize; i++) {
					sourceStructure = oFF.PrUtils.getStructureElement(sources,
							i);
					multiSource = oFF.QInADataSource.importQd(importer,
							sourceStructure, null, context);
					multiSources.add(multiSource);
				}
			}
			mappings = oFF.PrUtils.getListProperty(inaStructure, "Mappings");
			dataSource.setMappings(mappings);
		}
		oFF.QInADataSourceExtDims.importQd(importer, dataSource, inaStructure);
		validationHash = inaParent.getStringByKey("ValidationHash");
		if (oFF.isNull(validationHash)) {
			validationHash = inaStructure.getStringByKey("ValidationHash");
		}
		dataSource.setValidationHash(validationHash);
		genericServiceDescription = inaParent
				.getStructureByKey("GenericServiceDescription");
		if (oFF.notNull(genericServiceDescription)) {
			dataSource.setGenericServiceDescription(genericServiceDescription);
		}
		return dataSource;
	};
	oFF.QInADataSource.exportDataSource = function(exporter, dataSource,
			withRunAsUser, inaQueryModel) {
		var inaDataSource = oFF.PrFactory.createStructure();
		var type = dataSource.getType();
		var queryModel = dataSource.getQueryModel();
		var systemName;
		var sources;
		var multiSources;
		var multiSourcesSize;
		var i;
		var multiSource;
		var source;
		if (oFF.notNull(type)) {
			if (exporter.mode === oFF.QModelFormat.INA_VALUE_HELP
					&& type === oFF.MetaObjectType.QUERY) {
				inaDataSource.putString("Type",
						oFF.MetaObjectType.QUERY_VALUEHELP.getCamelCaseName());
			} else {
				if (exporter.mode === oFF.QModelFormat.INA_VALUE_HELP
						&& type === oFF.MetaObjectType.MODEL) {
					inaDataSource.putString("Type",
							oFF.MetaObjectType.MODEL_VALUEHELP
									.getCamelCaseName());
				} else {
					inaDataSource.putString("Type", type.getCamelCaseName());
				}
			}
			systemName = dataSource.getSystemName();
			if (oFF.notNull(systemName)
					&& exporter.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
				inaDataSource.putString("System", systemName);
			}
			if (type === oFF.MetaObjectType.MULTI_SOURCE) {
				sources = inaDataSource.putNewList("Sources");
				multiSources = dataSource.getMultiSources();
				multiSourcesSize = multiSources.size();
				for (i = 0; i < multiSourcesSize; i++) {
					multiSource = multiSources.get(i);
					source = oFF.QInADataSource.exportDataSource(exporter,
							multiSource, withRunAsUser, null);
					sources.add(source);
				}
				inaDataSource.put("Mappings", dataSource.getMappings());
			} else {
				if (type === oFF.MetaObjectType.BLENDING) {
					sources = oFF.QInADataSourceBlending.exportBlendingSources(
							exporter.getMode(), queryModel
									.getBlendingDefinition(), true);
					inaDataSource.put("Sources", sources);
					inaDataSource.put("Mappings", dataSource.getMappings());
				}
			}
		}
		oFF.QInADataSourceProperties.exportQd(exporter, dataSource,
				inaDataSource, withRunAsUser);
		oFF.QInADataSourceExtDims.exportQd(exporter, dataSource, inaDataSource);
		if (oFF.notNull(inaQueryModel)) {
			inaQueryModel.put("DataSource", inaDataSource);
		}
		if (oFF.notNull(queryModel)
				&& queryModel.getSystemType().isTypeOf(
						oFF.SystemType.VIRTUAL_INA_GSA)) {
			inaDataSource.put("GenericServiceDescription", dataSource
					.getGenericServiceDescription());
		}
		return inaDataSource;
	};
	oFF.QInADataSource.prototype.getComponentType = function() {
		return oFF.OlapComponentType.DATA_SOURCE;
	};
	oFF.QInADataSource.prototype.importComponent = function(importer,
			inaElement, modelComponent, parentComponent, context) {
		return oFF.QInADataSource.importQd(importer, inaElement, "DataSource",
				context);
	};
	oFF.QInADataSource.prototype.exportComponent = function(exporter,
			modelComponent, inaParentStructure, flags) {
		var withRunAsUser = oFF.XMath.binaryAnd(flags,
				oFF.QImExFlag.RUN_AS_USER) > 0;
		return oFF.QInADataSource.exportDataSource(exporter, modelComponent,
				withRunAsUser, null);
	};
	oFF.QInAComponentWithList = function() {
	};
	oFF.QInAComponentWithList.prototype = new oFF.QInAComponent();
	oFF.QInAComponentWithList.prototype.importComponent = function(importer,
			inaElement, modelComponent, parentComponent, context) {
		var tagName = this.getTagName();
		var inaList = null;
		var inaStructure;
		if (oFF.isNull(tagName)) {
			inaList = inaElement;
		} else {
			if (oFF.notNull(inaElement)) {
				inaStructure = inaElement;
				inaList = inaStructure.getListByKey(tagName);
			}
		}
		return this.importComponentWithList(importer, inaList, modelComponent,
				parentComponent, context);
	};
	oFF.QInAComponentWithList.prototype.exportComponent = function(exporter,
			modelComponent, inaParentStructure, flags) {
		var inaList = null;
		var tagName;
		var inaInsertStructure;
		if (oFF.notNull(modelComponent)) {
			inaList = this.exportComponentWithList(exporter, modelComponent,
					flags);
			tagName = this.getTagName();
			if (oFF.notNull(tagName) && oFF.notNull(inaList)) {
				inaInsertStructure = inaParentStructure;
				if (oFF.isNull(inaInsertStructure)) {
					inaInsertStructure = oFF.PrFactory.createStructure();
				}
				inaInsertStructure.put(tagName, inaList);
				return inaInsertStructure;
			}
		}
		return inaList;
	};
	oFF.QInAComponentWithStructure = function() {
	};
	oFF.QInAComponentWithStructure.prototype = new oFF.QInAComponent();
	oFF.QInAComponentWithStructure.prototype.importComponent = function(
			importer, inaElement, modelComponent, parentComponent, context) {
		var inaStructure = inaElement;
		var tagName = this.getTagName();
		var myModelComponent;
		var application;
		var returnModelComponent;
		if (oFF.notNull(tagName) && oFF.notNull(inaStructure)) {
			inaStructure = inaStructure.getStructureByKey(tagName);
		}
		myModelComponent = modelComponent;
		if (oFF.isNull(modelComponent)) {
			application = null;
			if (oFF.notNull(context)) {
				application = context.getOlapEnv();
			}
			myModelComponent = this.newModelComponent(application,
					parentComponent, context);
			if (oFF.notNull(myModelComponent)) {
				myModelComponent.stopEventing();
			}
		}
		returnModelComponent = this.importComponentWithStructure(importer,
				inaStructure, myModelComponent, parentComponent, context);
		oFF.QInAImportUtil.importComponentTagging(importer, inaStructure,
				returnModelComponent);
		if (oFF.isNull(modelComponent) && oFF.notNull(myModelComponent)) {
			myModelComponent.resumeEventing();
		}
		return returnModelComponent;
	};
	oFF.QInAComponentWithStructure.prototype.newModelComponent = function(
			application, parentComponent, context) {
		return null;
	};
	oFF.QInAComponentWithStructure.prototype.exportComponent = function(
			exporter, modelComponent, inaParentStructure, flags) {
		var inaStructure = null;
		var tagName;
		var inaInsertStructure;
		if (oFF.notNull(modelComponent)) {
			tagName = this.getTagName();
			if (oFF.isNull(tagName)) {
				inaStructure = inaParentStructure;
			}
			if (oFF.isNull(inaStructure)) {
				inaStructure = oFF.PrFactory.createStructure();
			}
			inaStructure = this.exportComponentWithStructure(exporter,
					modelComponent, inaStructure, flags);
			if (oFF.notNull(inaStructure)) {
				inaStructure = oFF.QInAExportUtil.extendStructure(exporter,
						modelComponent, inaStructure);
				inaStructure = oFF.QInAExportUtil.extendStructureWithTagging(
						exporter, modelComponent, inaStructure);
				inaStructure = this.extendCustom(exporter, modelComponent,
						inaStructure);
			}
			if (oFF.notNull(tagName)) {
				if (oFF.notNull(inaStructure)) {
					inaInsertStructure = inaParentStructure;
					if (oFF.isNull(inaInsertStructure)) {
						inaInsertStructure = oFF.PrFactory.createStructure();
					}
					inaInsertStructure.put(tagName, inaStructure);
					return inaInsertStructure;
				}
			}
		}
		return inaStructure;
	};
	oFF.QInAComponentWithStructure.prototype.extendCustom = function(exporter,
			modelComponent, inaStructure) {
		return inaStructure;
	};
	oFF.QInAExportFactoryImpl = function() {
	};
	oFF.QInAExportFactoryImpl.prototype = new oFF.QInAExportFactory();
	oFF.QInAExportFactoryImpl.staticSetupImpl = function() {
		oFF.QInAExportFactory.put(oFF.QModelFormat.INA_CLONE,
				new oFF.QInAExportFactoryImpl());
		oFF.QInAExportFactory.put(oFF.QModelFormat.INA_REPOSITORY,
				new oFF.QInAExportFactoryImpl());
		oFF.QInAExportFactory.put(oFF.QModelFormat.INA_REPOSITORY_DATA,
				new oFF.QInAExportFactoryImpl());
		oFF.QInAExportFactory.put(oFF.QModelFormat.INA_REPOSITORY_NO_VARS,
				new oFF.QInAExportFactoryImpl());
		oFF.QInAExportFactory.put(oFF.QModelFormat.INA_METADATA,
				new oFF.QInAExportFactoryImpl());
		oFF.QInAExportFactory.put(oFF.QModelFormat.INA_METADATA_CORE,
				new oFF.QInAExportFactoryImpl());
		oFF.QInAExportFactory.put(oFF.QModelFormat.INA_METADATA_BLENDING,
				new oFF.QInAExportFactoryImpl());
		oFF.QInAExportFactory.put(oFF.QModelFormat.INA_DATA,
				new oFF.QInAExportFactoryImpl());
		oFF.QInAExportFactory.put(oFF.QModelFormat.INA_DATA_BLENDING_SOURCE,
				new oFF.QInAExportFactoryImpl());
		oFF.QInAExportFactory.put(oFF.QModelFormat.INA_VALUE_HELP,
				new oFF.QInAExportFactoryImpl());
		oFF.QInAExportFactory.put(oFF.QModelFormat.LAYER,
				new oFF.QInAExportFactoryImpl());
		oFF.QInAExportFactory.put(oFF.QModelFormat.CSN_METADATA,
				new oFF.QInAExportFactoryImpl());
	};
	oFF.QInAExportFactoryImpl.prototype.createExporter = function(application,
			modelFormat, capabilities, memberReadModeContext) {
		var object = new oFF.QInAExport();
		object.setupImportExport(application, modelFormat, capabilities,
				memberReadModeContext);
		return object;
	};
	oFF.QInAImportFactoryImpl = function() {
	};
	oFF.QInAImportFactoryImpl.prototype = new oFF.QInAImportFactory();
	oFF.QInAImportFactoryImpl.staticSetupImpl = function() {
		oFF.QInAImportFactory.put(oFF.QModelFormat.INA_CLONE,
				new oFF.QInAImportFactoryImpl());
		oFF.QInAImportFactory.put(oFF.QModelFormat.INA_REPOSITORY,
				new oFF.QInAImportFactoryImpl());
		oFF.QInAImportFactory.put(oFF.QModelFormat.INA_REPOSITORY_DATA,
				new oFF.QInAImportFactoryImpl());
		oFF.QInAImportFactory.put(oFF.QModelFormat.INA_REPOSITORY_NO_VARS,
				new oFF.QInAImportFactoryImpl());
		oFF.QInAImportFactory.put(oFF.QModelFormat.INA_METADATA,
				new oFF.QInAImportFactoryImpl());
		oFF.QInAImportFactory.put(oFF.QModelFormat.INA_METADATA_CORE,
				new oFF.QInAImportFactoryImpl());
		oFF.QInAImportFactory.put(oFF.QModelFormat.INA_METADATA_BLENDING,
				new oFF.QInAImportFactoryImpl());
		oFF.QInAImportFactory.put(oFF.QModelFormat.INA_DATA,
				new oFF.QInAImportFactoryImpl());
		oFF.QInAImportFactory.put(oFF.QModelFormat.INA_DATA_REINIT,
				new oFF.QInAImportFactoryImpl());
		oFF.QInAImportFactory.put(oFF.QModelFormat.LAYER,
				new oFF.QInAImportFactoryImpl());
	};
	oFF.QInAImportFactoryImpl.prototype.createImporter = function(application,
			modelFormat, capabilities) {
		var object = new oFF.QInAImport();
		object.setupImportExport(application, modelFormat, capabilities, null);
		return object;
	};
	oFF.QInAImportFactoryImpl.prototype.createImporterWithQueryManagerCapabilities = function(
			application, modelFormat, queryManager) {
		var capabilities = queryManager.getMainCapabilities();
		return this.createImporter(application, modelFormat, capabilities);
	};
	oFF.QInAFilterCartesianList = function() {
	};
	oFF.QInAFilterCartesianList.prototype = new oFF.QInAComponent();
	oFF.QInAFilterCartesianList.setStringIfFilterBagNotNull = function(
			filterBag, exporter, inaSetOperand, name) {
		if (oFF.notNull(filterBag) && filterBag.getValue() !== null) {
			oFF.QInAValueUtils.exportFilterValue(exporter, name, inaSetOperand,
					filterBag, oFF.XValueType.STRING);
		}
	};
	oFF.QInAFilterCartesianList.prototype.getComponentType = function() {
		return oFF.FilterComponentType.CARTESIAN_LIST;
	};
	oFF.QInAFilterCartesianList.prototype.importComponent = function(importer,
			inaElement, modelComponent, parentComponent, context) {
		var inaCartesianList = inaElement;
		var cartesianListExt = modelComponent;
		var filterExpression = parentComponent;
		var fieldAccessor = context.getFieldAccessorSingle();
		var fieldName = inaCartesianList.getStringByKey("FieldName");
		var cartesianList = cartesianListExt;
		var field;
		var queryModel;
		var dimensionByName;
		var inaHierarchy2;
		var inaHierarchy;
		var inaHierarchyName;
		var convertToFlatFilter;
		var supplementsFieldsNamesList;
		var len;
		var y;
		var name;
		var supplField;
		var elements;
		var size;
		var i;
		var setOperandElement;
		var element;
		if (oFF.notNull(fieldName)) {
			field = fieldAccessor.getFieldByName(fieldName);
			if (oFF.isNull(field)) {
				queryModel = filterExpression.getQueryModel();
				if (oFF.notNull(queryModel)) {
					dimensionByName = queryModel
							.getDimensionByNameFromExistingMetadata(fieldName);
					if (oFF.notNull(dimensionByName)) {
						inaHierarchy2 = inaCartesianList
								.getStructureByKey("Hierarchy");
						if (oFF.isNull(inaHierarchy2)) {
							field = dimensionByName.getFlatKeyField();
						} else {
							field = dimensionByName.getHierarchyKeyField();
						}
					}
				}
			}
			if (oFF.notNull(field)) {
				inaHierarchy = inaCartesianList.getStructureByKey("Hierarchy");
				inaHierarchyName = null;
				if (oFF.notNull(inaHierarchy)) {
					inaHierarchyName = inaHierarchy.getStringByKey("Name");
				}
				if (oFF.isNull(cartesianList)) {
					cartesianList = oFF.QFilterCartesianList._create(context,
							filterExpression, field, inaHierarchyName);
				} else {
					cartesianList.clear();
				}
				convertToFlatFilter = inaCartesianList.getBooleanByKeyExt(
						"ConvertToFlatSelection", false);
				cartesianList.setConvertToFlatFilter(convertToFlatFilter);
				supplementsFieldsNamesList = inaCartesianList
						.getListByKey("SupplementsFieldNames");
				if (oFF.notNull(supplementsFieldsNamesList)) {
					len = supplementsFieldsNamesList.size();
					for (y = 0; y < len; y++) {
						name = supplementsFieldsNamesList.getStringAt(y);
						supplField = fieldAccessor.getFieldByName(name);
						cartesianList.addSupplementField(supplField);
					}
				}
				elements = inaCartesianList.getListByKey("Elements");
				if (oFF.notNull(elements)) {
					size = elements.size();
					for (i = 0; i < size; i++) {
						setOperandElement = elements.getStructureAt(i);
						element = importer.importFilterOperation(
								setOperandElement, cartesianList, context);
						cartesianList.add(element);
					}
				}
			}
		}
		return cartesianList;
	};
	oFF.QInAFilterCartesianList.prototype.exportComponent = function(exporter,
			modelComponent, inaParentStructure, flags) {
		var cartesianList = modelComponent;
		var element;
		var comparisonOperator;
		if (cartesianList.hasElements()) {
			element = cartesianList.getOp(0);
			comparisonOperator = element.getComparisonOperator();
			if (oFF.notNull(comparisonOperator)) {
				if (comparisonOperator
						.isTypeOf(oFF.SpatialComparisonOperator._SPATIAL)) {
					return this.exportSpatialList(exporter, cartesianList,
							inaParentStructure);
				} else {
					if (comparisonOperator === oFF.ComparisonOperator.SEARCH) {
						return this.exportSearchList(exporter, cartesianList,
								inaParentStructure);
					}
				}
			}
			return this.exportStandardList(exporter, cartesianList,
					inaParentStructure);
		}
		return null;
	};
	oFF.QInAFilterCartesianList.prototype.exportStandardList = function(
			exporter, modelComponent, inaParentStructure) {
		var cartesianList = modelComponent;
		var field;
		var inaCartesianList;
		var hierarchyName;
		var inaHierarchy;
		var supplementFields;
		var len;
		var inaSupplements;
		var s;
		var isConvertToFlatFilter;
		var inaElements;
		var size;
		var j;
		var cartesianElement;
		if (cartesianList.isEmpty()) {
			return null;
		}
		field = cartesianList.getField();
		if (oFF.isNull(field)) {
			exporter.addWarning(oFF.ErrorCodes.INVALID_FIELD,
					"A field has to be provided to the cartesian list.");
			return null;
		}
		inaCartesianList = oFF.PrFactory.createStructure();
		inaCartesianList.putString("FieldName", field.getName());
		hierarchyName = cartesianList.getHierarchyName();
		if (oFF.notNull(hierarchyName)) {
			inaHierarchy = inaCartesianList.putNewStructure("Hierarchy");
			inaHierarchy.putString("Name", hierarchyName);
		}
		if (!exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA)) {
			if (exporter.supportsSupplements) {
				supplementFields = cartesianList.getSupplementFields();
				if (oFF.notNull(supplementFields)) {
					len = supplementFields.size();
					if (len > 0) {
						inaSupplements = inaCartesianList
								.putNewList("SupplementsFieldNames");
						for (s = 0; s < len; s++) {
							inaSupplements.addString(supplementFields.get(s)
									.getName());
						}
					}
				}
			}
		}
		isConvertToFlatFilter = cartesianList.isConvertToFlatFilter();
		inaElements = inaCartesianList.putNewList("Elements");
		size = cartesianList.size();
		for (j = 0; j < size; j++) {
			cartesianElement = cartesianList.getOp(j);
			exporter.exportFilterOperation(cartesianElement, inaElements
					.addNewStructure());
			isConvertToFlatFilter = isConvertToFlatFilter
					|| cartesianElement.isConvertToFlatFilter();
		}
		if (exporter.supportsConvertToFlatFilter && isConvertToFlatFilter) {
			inaCartesianList.putBoolean("ConvertToFlatSelection", true);
		}
		if (oFF.notNull(inaParentStructure)) {
			inaParentStructure.put("SetOperand", inaCartesianList);
		}
		return inaCartesianList;
	};
	oFF.QInAFilterCartesianList.prototype.exportSpatialList = function(
			exporter, cartesianList, inaParentStructure) {
		var field;
		var inaOperator;
		var inaSubSelections;
		var size;
		var j;
		var qFilterSelection;
		var comparisonOperator;
		var inaOrElement;
		var inaGeoOperation;
		var geoValueA1;
		var srid;
		var geoValueA2;
		var geoValueA3;
		if (!exporter.supportsSpatialFilter) {
			exporter.addWarning(oFF.ErrorCodes.INVALID_OPERATOR,
					"System does not support spatial filtering.");
			return null;
		}
		field = cartesianList.getField();
		inaOperator = inaParentStructure.putNewStructure("Operator");
		inaOperator.putString("Code", "Or");
		inaSubSelections = inaOperator.putNewList("SubSelections");
		size = cartesianList.size();
		for (j = 0; j < size; j++) {
			qFilterSelection = cartesianList.getOp(j);
			comparisonOperator = qFilterSelection.getComparisonOperator();
			if (oFF.isNull(comparisonOperator)) {
				exporter.addError(oFF.ErrorCodes.INVALID_OPERATOR,
						"Comparison operator is not set");
				return null;
			}
			if (!comparisonOperator
					.isTypeOf(oFF.SpatialComparisonOperator._SPATIAL)) {
				exporter.addError(oFF.ErrorCodes.INVALID_OPERATOR,
						"Comparison operator not spatial");
				return null;
			}
			inaOrElement = inaSubSelections.addNewStructure();
			inaGeoOperation = inaOrElement.putNewStructure("GeometryOperand");
			inaGeoOperation.putString("FieldName", field.getName());
			inaGeoOperation.putString("Comparison", oFF.QInAConverter
					.lookupComparisonInA(comparisonOperator));
			if (qFilterSelection.getSetSign() === oFF.SetSign.EXCLUDING) {
				inaGeoOperation.putBoolean("IsExcluding", true);
			}
			geoValueA1 = qFilterSelection.getLow();
			oFF.QInAFilterCartesianList.setStringIfFilterBagNotNull(geoValueA1,
					exporter, inaGeoOperation, "Value1");
			if (geoValueA1.getValueType().isSpatial()) {
				srid = geoValueA1.getGeometry().getSrid();
				if (exporter.supportsSpatialFilterSrid && oFF.notNull(srid)) {
					inaGeoOperation.putInteger("SRID", srid.getInteger());
				}
			}
			geoValueA2 = qFilterSelection.getHigh();
			oFF.QInAFilterCartesianList.setStringIfFilterBagNotNull(geoValueA2,
					exporter, inaGeoOperation, "Value2");
			geoValueA3 = qFilterSelection.getThird();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(geoValueA3.getString())) {
				oFF.QInAFilterCartesianList.setStringIfFilterBagNotNull(
						geoValueA3, exporter, inaGeoOperation, "Value3");
			}
		}
		return inaParentStructure;
	};
	oFF.QInAFilterCartesianList.prototype.exportSearchList = function(exporter,
			cartesianList, inaParentStructure) {
		var field = cartesianList.getField();
		var fieldValueType = field.getValueType();
		var inaOperator = inaParentStructure.putNewStructure("Operator");
		var inaSubSelections;
		var size;
		var j;
		var qFilterSelection;
		var inaOrElement;
		var inaSearchOperation;
		inaOperator.putString("Code", "Or");
		inaSubSelections = inaOperator.putNewList("SubSelections");
		size = cartesianList.size();
		for (j = 0; j < size; j++) {
			qFilterSelection = cartesianList.getOp(j);
			if (qFilterSelection.getComparisonOperator() !== oFF.ComparisonOperator.SEARCH) {
				exporter.addError(oFF.ErrorCodes.INVALID_OPERATOR,
						"Comparison operator is not search");
				return null;
			}
			inaOrElement = inaSubSelections.addNewStructure();
			inaSearchOperation = inaOrElement.putNewStructure("SearchOperand");
			if (exporter.isAbap(cartesianList.getQueryModel())) {
				inaSearchOperation.putString("FieldName", field.getName());
			}
			inaSearchOperation.putString("AttributeName", field.getName());
			oFF.QInAValueUtils.exportFilterValue(exporter, "Value",
					inaSearchOperation, qFilterSelection.getLow(),
					fieldValueType);
			inaSearchOperation.putDouble("Exactness", qFilterSelection
					.getExactness());
		}
		return inaParentStructure;
	};
	oFF.QInAFilterCartesianProduct = function() {
	};
	oFF.QInAFilterCartesianProduct.prototype = new oFF.QInAComponent();
	oFF.QInAFilterCartesianProduct.iterateCartesianDimensionsNew = function(
			exporter, cartesianProduct, parentList) {
		var size = cartesianProduct.size();
		var i;
		var msl;
		var parentElement;
		for (i = 0; i < size; i++) {
			msl = cartesianProduct.getCartesianChild(i);
			parentElement = oFF.PrFactory.createStructure();
			if (msl.hasElements()) {
				exporter.exportCartesianList(msl, parentElement);
				parentList.add(parentElement);
			}
		}
	};
	oFF.QInAFilterCartesianProduct.prototype.getComponentType = function() {
		return oFF.FilterComponentType.CARTESIAN_PRODUCT;
	};
	oFF.QInAFilterCartesianProduct.prototype.importComponent = function(
			importer, inaElement, modelComponent, parentComponent, context) {
		var inaStructure = inaElement;
		var filterExpression = parentComponent;
		var cartesianProduct = null;
		var inaElements = inaStructure.getListByKey("Elements");
		var size;
		var i;
		var inaCartesianChild;
		var cartesianList;
		if (oFF.isNull(inaElements)) {
			inaElements = inaStructure.getListByKey("SubSelections");
		}
		if (oFF.notNull(inaElements)) {
			cartesianProduct = oFF.QFilterCartesianProduct._create(context,
					filterExpression);
			size = inaElements.size();
			for (i = 0; i < size; i++) {
				inaCartesianChild = inaElements.getStructureAt(i);
				if (oFF.notNull(inaCartesianChild)) {
					cartesianList = importer.importCartesianList(
							inaCartesianChild, null, filterExpression, context);
					cartesianProduct.add(cartesianList);
				}
			}
		}
		return cartesianProduct;
	};
	oFF.QInAFilterCartesianProduct.prototype.exportComponent = function(
			exporter, modelComponent, inaParentStructure, flags) {
		var cartesianProduct = modelComponent;
		var filterDimCount;
		var singleMemberSelection;
		var size;
		var i;
		var msl;
		var inaLogicalOperator;
		var inaSubSelections;
		if (oFF.notNull(cartesianProduct)) {
			filterDimCount = 0;
			singleMemberSelection = null;
			size = cartesianProduct.size();
			for (i = 0; i < size; i++) {
				msl = cartesianProduct.getCartesianChild(i);
				if (msl.hasElements()) {
					filterDimCount++;
					singleMemberSelection = msl;
					if (filterDimCount > 1) {
						break;
					}
				}
			}
			if (filterDimCount > 0) {
				if (filterDimCount === 1
						&& exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA)) {
					return exporter.exportCartesianList(singleMemberSelection,
							inaParentStructure);
				}
				inaLogicalOperator = inaParentStructure
						.putNewStructure("Operator");
				inaLogicalOperator.putString("Code", "And");
				inaSubSelections = inaLogicalOperator
						.putNewList("SubSelections");
				oFF.QInAFilterCartesianProduct.iterateCartesianDimensionsNew(
						exporter, cartesianProduct, inaSubSelections);
				return inaLogicalOperator;
			}
		}
		return null;
	};
	oFF.InAQMgrCapabilities = function() {
	};
	oFF.InAQMgrCapabilities.prototype = new oFF.InACapabilitiesProvider();
	oFF.InAQMgrCapabilities.CLIENT_PLANNING_COMMAND_MAIN_CAPABILITIES = null;
	oFF.InAQMgrCapabilities.staticSetup = function() {
		oFF.InAQMgrCapabilities.CLIENT_PLANNING_COMMAND_MAIN_CAPABILITIES = oFF.CapabilityContainer
				.create("main");
		oFF.InAQMgrCapabilities.CLIENT_PLANNING_COMMAND_MAIN_CAPABILITIES
				.addCapability(oFF.InACapabilities.CLIENT_CAPABILITIES);
		oFF.InAQMgrCapabilities.CLIENT_PLANNING_COMMAND_MAIN_CAPABILITIES
				.addCapability(oFF.InACapabilities.HIERARCHY_NAME_VARIABLE);
	};
	oFF.InAQMgrCapabilities.checkMainVersion = function(serverMetadata,
			providerType) {
		var mainCapabilities = oFF.InAQMgrCapabilities
				.getServerMainCapabilitiesForProviderType(serverMetadata,
						providerType);
		return oFF.notNull(mainCapabilities);
	};
	oFF.InAQMgrCapabilities.getServerMainCapabilitiesForProviderType = function(
			serverMetadata, providerType) {
		var mainCapabilities = null;
		if (providerType === oFF.ProviderType.CATALOG) {
			mainCapabilities = serverMetadata
					.getMetadataForService(oFF.ServerService.CATALOG);
		} else {
			if (providerType === oFF.ProviderType.PLANNING_COMMAND) {
				mainCapabilities = serverMetadata
						.getMetadataForService(oFF.ServerService.PLANNING);
			} else {
				if (providerType === oFF.ProviderType.ANALYTICS_VALUE_HELP) {
					mainCapabilities = serverMetadata
							.getMetadataForService(oFF.ServerService.VALUE_HELP);
				} else {
					if (providerType === oFF.ProviderType.LIST_REPORTING) {
						mainCapabilities = serverMetadata
								.getMetadataForService(oFF.ServerService.LIST_REPORTING);
					}
				}
			}
		}
		if (oFF.isNull(mainCapabilities)) {
			if (providerType === oFF.ProviderType.ANALYTICS
					|| providerType === oFF.ProviderType.ANALYTICS_VALUE_HELP
					|| providerType === oFF.ProviderType.PLANNING
					|| providerType === oFF.ProviderType.CATALOG) {
				mainCapabilities = serverMetadata
						.getMetadataForService(oFF.ServerService.ANALYTIC);
			}
		}
		return mainCapabilities;
	};
	oFF.InAQMgrCapabilities.create = function(serverMetadata, providerType) {
		var inaCapabilities = new oFF.InAQMgrCapabilities();
		var mainCapabilities;
		var betaCapabilitiesForAnalytic;
		if (providerType === oFF.ProviderType.PLANNING_COMMAND) {
			inaCapabilities.m_clientMainCapabilities = oFF.InAQMgrCapabilities.CLIENT_PLANNING_COMMAND_MAIN_CAPABILITIES;
		} else {
			inaCapabilities.m_clientMainCapabilities = oFF.InACapabilitiesProvider
					.createMainCapabilities(serverMetadata.getSession()
							.getVersion());
		}
		if (oFF.notNull(serverMetadata) && oFF.notNull(providerType)) {
			mainCapabilities = oFF.InAQMgrCapabilities
					.getServerMainCapabilitiesForProviderType(serverMetadata,
							providerType);
			inaCapabilities.m_serverMainCapabilities = oFF.XObjectExt
					.cloneIfNotNull(mainCapabilities);
			betaCapabilitiesForAnalytic = serverMetadata
					.getBetaMetadataForAnalytic();
			inaCapabilities.m_serverBetaCapabilities = oFF.XObjectExt
					.cloneIfNotNull(betaCapabilitiesForAnalytic);
		}
		return inaCapabilities;
	};
	oFF.InAQMgrCapabilities.prototype.m_serverPersistencyCapabilities = null;
	oFF.InAQMgrCapabilities.prototype.m_deserializationDocumentCapabilities = null;
	oFF.InAQMgrCapabilities.prototype.m_activeDeserializationCapabilities = null;
	oFF.InAQMgrCapabilities.prototype.importDeserializationDocumentCapabilities = function(
			document) {
		var analytics;
		var capabilities;
		var i;
		var value;
		this.m_deserializationDocumentCapabilities = oFF.CapabilityContainer
				.create("Document");
		analytics = document.getStructureByKey("Analytics");
		if (oFF.notNull(analytics)) {
			capabilities = analytics.getListByKey("Capabilities");
			if (oFF.notNull(capabilities)) {
				for (i = 0; i < capabilities.size(); i++) {
					value = capabilities.getStringAt(i);
					this.m_deserializationDocumentCapabilities
							.addCapability(value);
				}
			}
		}
	};
	oFF.InAQMgrCapabilities.prototype.getActiveDeserializationCapabilities = function() {
		if (oFF.isNull(this.m_activeDeserializationCapabilities)) {
			if (oFF.notNull(this.m_clientMainCapabilities)
					&& oFF.notNull(this.m_deserializationDocumentCapabilities)) {
				this.m_activeDeserializationCapabilities = this.m_deserializationDocumentCapabilities
						.intersect(this.m_clientMainCapabilities);
			}
		}
		return this.m_activeDeserializationCapabilities;
	};
	oFF.InAQMgrCapabilities.prototype.releaseObject = function() {
		this.m_activeDeserializationCapabilities = oFF.XObjectExt
				.release(this.m_activeDeserializationCapabilities);
		this.m_serverPersistencyCapabilities = oFF.XObjectExt
				.release(this.m_serverPersistencyCapabilities);
		this.m_deserializationDocumentCapabilities = oFF.XObjectExt
				.release(this.m_deserializationDocumentCapabilities);
		oFF.InACapabilitiesProvider.prototype.releaseObject.call(this);
	};
	oFF.InAQMgrCapabilities.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		if (oFF.notNull(this.m_serverMainCapabilities)) {
			buffer.appendLine("=== Server Main Capabilities ===");
			buffer.appendLine(this.m_serverMainCapabilities.toString());
		}
		if (oFF.notNull(this.m_serverPersistencyCapabilities)) {
			buffer.appendLine("=== Server Persistency Capabilities ===");
			buffer.appendLine(this.m_serverPersistencyCapabilities.toString());
		}
		if (oFF.notNull(this.m_clientMainCapabilities)) {
			buffer.appendLine("=== Client Main Capabilities ===");
			buffer.appendLine(this.m_clientMainCapabilities.toString());
		}
		return buffer.toString();
	};
	oFF.InAQMgrStartupBlending = function() {
	};
	oFF.InAQMgrStartupBlending.prototype = new oFF.XObject();
	oFF.InAQMgrStartupBlending.create = function(syncAction) {
		var newObject = new oFF.InAQMgrStartupBlending();
		newObject.m_syncAction = syncAction;
		newObject.m_executedQueryManagers = oFF.XList.create();
		return newObject;
	};
	oFF.InAQMgrStartupBlending.prototype.m_syncAction = null;
	oFF.InAQMgrStartupBlending.prototype.m_implicitBatchStarted = false;
	oFF.InAQMgrStartupBlending.prototype.m_hasPreQueries = false;
	oFF.InAQMgrStartupBlending.prototype.m_executedQueryManagers = null;
	oFF.InAQMgrStartupBlending.prototype.m_blendingMgrFunctionSupplier = null;
	oFF.InAQMgrStartupBlending.prototype.m_blendingMgrSyncType = null;
	oFF.InAQMgrStartupBlending.prototype.releaseObject = function() {
		this.m_syncAction = null;
		this.m_executedQueryManagers = oFF.XObjectExt
				.release(this.m_executedQueryManagers);
		this.m_blendingMgrFunctionSupplier = null;
		this.m_blendingMgrSyncType = null;
	};
	oFF.InAQMgrStartupBlending.prototype.prepare = function(syncType) {
		var queryManager = this.m_syncAction.getQueryManager();
		var serviceConfig = queryManager.getServiceConfig();
		var blendingDefinition = serviceConfig.getBlendingDefinition();
		var blendingSources = blendingDefinition.getSources();
		var blendingHost;
		var preQueries;
		var preQueryExecutor;
		if (blendingSources.isEmpty()) {
			this.m_syncAction.addError(oFF.ErrorCodes.INVALID_STATE,
					"No blending sources set");
			return;
		}
		blendingHost = blendingDefinition.getBlendingHost();
		if (oFF.isNull(blendingHost)) {
			this.m_syncAction.addError(oFF.ErrorCodes.INVALID_STATE,
					"Could not find a suitable blending host");
			return;
		}
		serviceConfig.setSystemName(blendingHost.getSystemName());
		this.m_implicitBatchStarted = false;
		this.m_hasPreQueries = false;
		if (blendingDefinition.isRemoteBlending()
				&& !this.executeRemoteQueries(syncType, blendingSources,
						blendingHost)) {
			return;
		}
		preQueries = this.getBlendingPreQueries(blendingSources, blendingHost
				.getSystemName());
		if (preQueries.hasElements()) {
			preQueryExecutor = queryManager.getPreQueryExecutor();
			if (!preQueryExecutor.serializeRemotePreQueries(
					oFF.SyncType.BLOCKING, blendingHost.getSystemName(),
					preQueries, null)) {
				this.m_syncAction.addAllMessages(preQueryExecutor);
				return;
			}
			this.startImplicitBatchMode();
			this.executePreQueries(preQueries, blendingHost);
			this.m_hasPreQueries = true;
		}
	};
	oFF.InAQMgrStartupBlending.prototype.process = function(
			rpcFunctionSupplier, syncType) {
		this.m_blendingMgrFunctionSupplier = rpcFunctionSupplier;
		this.m_blendingMgrSyncType = syncType;
		if (this.allQueriesExecuted()) {
			if (this.m_syncAction.isValid()) {
				this.executeBlendingQueryManagerCreation();
			}
			oFF.XObjectExt.release(this);
		}
	};
	oFF.InAQMgrStartupBlending.prototype.executeBlendingQueryManagerCreation = function() {
		var blendingFunction = this.m_blendingMgrFunctionSupplier
				.createBlendingFunction();
		if (this.m_hasPreQueries) {
			blendingFunction.processFunctionExecution(
					oFF.SyncType.NON_BLOCKING, this.m_syncAction,
					oFF.QueryManagerMode.BLENDING);
			this.stopImplicitBatchMode(this.m_implicitBatchStarted,
					this.m_blendingMgrSyncType);
		} else {
			blendingFunction.processFunctionExecution(
					this.m_blendingMgrSyncType, this.m_syncAction,
					oFF.QueryManagerMode.BLENDING);
		}
	};
	oFF.InAQMgrStartupBlending.prototype.allQueriesExecuted = function() {
		var size = this.m_executedQueryManagers.size();
		var i;
		var queryManager;
		for (i = 0; i < size; i++) {
			queryManager = this.m_executedQueryManagers.get(i);
			if (queryManager.getResultSetSyncState().isNotInSync()) {
				return false;
			}
		}
		return true;
	};
	oFF.InAQMgrStartupBlending.prototype.executeRemoteQueries = function(
			syncType, blendingSources, blendingHost) {
		var i;
		var source;
		var queryModel;
		var queryManager;
		var olapEnv;
		var cache;
		for (i = 0; i < blendingSources.size(); i++) {
			source = blendingSources.get(i);
			queryModel = source.getQueryModel();
			source.setIsRemoteSource(!oFF.XString.isEqual(blendingHost
					.getSystemName(), this.getSystemName(source)));
			if (!queryModel.supportsRemoteBlending()
					|| !blendingHost.supportsRemoteBlending()) {
				oFF.noSupport();
			}
			queryManager = queryModel.getQueryManager();
			if (source.isRemoteSource()) {
				queryModel.getUniversalDisplayHierarchiesBase()
						.updateIncludedDimensions();
				source.updatePersistenceIdentifier(blendingHost);
				olapEnv = queryManager.getOlapEnv();
				cache = olapEnv.getCachedRemoteBlendingData(queryManager
						.getResultSetPersistenceIdentifier());
				if (oFF.isNull(cache)) {
					this.m_executedQueryManagers.add(queryManager);
					queryManager.processQueryExecutionAsBlendingSource(
							syncType, this, source);
				} else {
					queryManager
							.getActiveResultSetContainer()
							.setSerializedData(cache.getView(), cache.getCube());
				}
			} else {
				if (queryModel.supportsCubeCache()) {
					source.updatePersistenceIdentifier(null);
					queryModel.addOptimizerHint(oFF.ExecutionEngine.MDS,
							"cube_cache_with_id", "true");
					this.m_executedQueryManagers.add(queryManager);
					queryManager.processQueryExecutionAsBlendingSource(
							syncType, this, source);
				}
			}
		}
		return this.m_syncAction.isValid();
	};
	oFF.InAQMgrStartupBlending.prototype.onQueryExecuted = function(extResult,
			resultSetContainer, customIdentifier) {
		var source = customIdentifier;
		var queryModel = source.getQueryModel();
		queryModel.addQueryModelIdToMessages(extResult.getMessages());
		this.m_syncAction.addAllMessages(extResult);
		if (oFF.notNull(this.m_blendingMgrFunctionSupplier)
				&& this.allQueriesExecuted()) {
			if (this.m_syncAction.isValid()) {
				this.executeBlendingQueryManagerCreation();
			} else {
				this.m_syncAction.callListeners(true);
			}
			oFF.XObjectExt.release(this);
		}
	};
	oFF.InAQMgrStartupBlending.prototype.getBlendingPreQueries = function(
			blendingSources, blendingHostSystemName) {
		var preQueries = oFF.XList.create();
		var i;
		var source;
		var sourceModel;
		for (i = 0; i < blendingSources.size(); i++) {
			source = blendingSources.get(i);
			sourceModel = source.getQueryModel();
			if (!source.isRemoteSource()) {
				preQueries.addAll(sourceModel.getPreQueries());
			}
			if (sourceModel.isBlendingModel()) {
				preQueries.addAll(this.getBlendingPreQueries(sourceModel
						.getBlendingSources(), blendingHostSystemName));
			}
		}
		return preQueries;
	};
	oFF.InAQMgrStartupBlending.prototype.startImplicitBatchMode = function() {
		var connectionPool = this.m_syncAction.getApplication()
				.getConnectionPool();
		var systemName = this.m_syncAction.getQueryManager().getSystemName();
		if (connectionPool.isBatchModeEnabled(systemName)) {
			this.m_implicitBatchStarted = false;
		} else {
			connectionPool.enableBatchMode(systemName);
			this.m_implicitBatchStarted = true;
		}
	};
	oFF.InAQMgrStartupBlending.prototype.stopImplicitBatchMode = function(
			implicitBatchStarted, syncType) {
		var connectionPool;
		var systemName;
		if (implicitBatchStarted
				&& this.m_syncAction.getQueryManagerBase().getPreQueryName() === null) {
			connectionPool = this.m_syncAction.getApplication()
					.getConnectionPool();
			systemName = this.m_syncAction.getQueryManager().getSystemName();
			connectionPool.disableBatchMode(syncType, systemName);
		}
	};
	oFF.InAQMgrStartupBlending.prototype.executePreQueries = function(
			preQueries, blendingHost) {
		var i;
		var preQueryPair;
		var preQueryManager;
		for (i = 0; i < preQueries.size(); i++) {
			preQueryPair = preQueries.get(i);
			preQueryManager = preQueryPair.getObject().getQueryManager();
			preQueryManager.getPreQueryExecutor()
					.processExecutionAsPreQueryInBatch(
							blendingHost.getSystemName(),
							preQueryPair.getName(), null);
		}
	};
	oFF.InAQMgrStartupBlending.prototype.getSystemName = function(source) {
		var queryManager = source.getQueryModel().getQueryManager();
		return queryManager.getSystemName();
	};
	oFF.QCsnComponentMetadata = function() {
	};
	oFF.QCsnComponentMetadata.prototype = new oFF.QInAComponentWithStructure();
	oFF.QCsnComponentMetadata.prototype.getModelFormat = function() {
		return oFF.QModelFormat.CSN_METADATA;
	};
	oFF.QCsnComponentMetadata.prototype.getDimExternalName = function(dimension) {
		var externalName = dimension.getExternalName();
		return oFF.XStringUtils.isNotNullAndNotEmpty(externalName) ? externalName
				: dimension.getName();
	};
	oFF.QCsnComponentMetadata.prototype.getFieldName = function(field) {
		var name = field.getName();
		var dimensionName = field.getDimension().getName();
		if (oFF.XString.startsWith(name, dimensionName)) {
			name = oFF.XString
					.substring(name, oFF.XString.size(dimensionName) + 1,
							oFF.XString.size(name));
		}
		return name;
	};
	oFF.QInAComponentMetadata = function() {
	};
	oFF.QInAComponentMetadata.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAComponentMetadata.prototype.getModelFormat = function() {
		return oFF.QModelFormat.INA_METADATA_CORE;
	};
	oFF.QInAComponentMetadata.prototype.extendCustom = function(exporter,
			modelComponent, inaStructure) {
		var olapComponentType = this.getComponentType();
		var ctypeValue = oFF.QInAConverter
				.lookupComponentTypeInA(olapComponentType);
		if (oFF.notNull(ctypeValue)) {
			inaStructure.putString("CType", ctypeValue);
		}
		return inaStructure;
	};
	oFF.QInAAttribute = function() {
	};
	oFF.QInAAttribute.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAAttribute.prototype.getComponentType = function() {
		return oFF.OlapComponentType.ATTRIBUTE;
	};
	oFF.QInAAttribute.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var dimension = parentComponent;
		var name = inaStructure.getStringByKey("Name");
		var attribute = dimension.getAttributeByName(name);
		var inaResultSetFields;
		var resultSetFields;
		var len;
		var i;
		var field;
		if (oFF.notNull(attribute)) {
			inaResultSetFields = inaStructure.getListByKey("ResultSetFields");
			if (oFF.notNull(inaResultSetFields)) {
				resultSetFields = attribute.getResultSetFields();
				resultSetFields.clear();
				len = inaResultSetFields.size();
				for (i = 0; i < len; i++) {
					field = attribute.getFieldByName(inaResultSetFields
							.getStringAt(i));
					if (oFF.notNull(field)) {
						resultSetFields.add(field);
					}
				}
			}
		}
		return attribute;
	};
	oFF.QInAAttribute.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var attribute = modelComponent;
		var inaResultSetFields;
		var resultSetFields;
		var len;
		var i;
		inaStructure.putString("Name", attribute.getName());
		inaResultSetFields = inaStructure.putNewList("ResultSetFields");
		resultSetFields = attribute.getResultSetFields();
		len = resultSetFields.size();
		for (i = 0; i < len; i++) {
			inaResultSetFields.addString(resultSetFields.get(i).getName());
		}
		return inaStructure;
	};
	oFF.QInAAxesSettings = function() {
	};
	oFF.QInAAxesSettings.prototype = new oFF.QInAComponentWithList();
	oFF.QInAAxesSettings.prototype.getComponentType = function() {
		return oFF.OlapComponentType.AXES_SETTINGS;
	};
	oFF.QInAAxesSettings.prototype.getTagName = function() {
		return "Axes";
	};
	oFF.QInAAxesSettings.prototype.importComponentWithList = function(importer,
			inaList, modelComponent, parentComponent, context) {
		var queryModel;
		var all;
		var allSize;
		var k;
		var len;
		var i;
		if (oFF.notNull(inaList)) {
			queryModel = context.getQueryModel();
			if (importer.hasCapability(oFF.InACapabilities.ZERO_SUPPRESSION)) {
				all = oFF.AxisType.getAll();
				allSize = all.size();
				for (k = 0; k < allSize; k++) {
					queryModel.getAxisBase(all.get(k))
							.setSupportsZeroSuppression(true);
				}
			}
			len = inaList.size();
			for (i = 0; i < len; i++) {
				importer.importAxis(inaList.getStructureAt(i), null, context);
			}
		}
		return null;
	};
	oFF.QInAAxesSettings.prototype.exportComponentWithList = function(exporter,
			modelComponent, flags) {
		var queryModel = modelComponent;
		var inaAxisStructureList = oFF.PrFactory.createList();
		var inaColumns = exporter.exportAxis(queryModel.getColumnsAxis(), null);
		var inaRows;
		inaAxisStructureList.add(inaColumns);
		inaRows = exporter.exportAxis(queryModel.getRowsAxis(), null);
		inaAxisStructureList.add(inaRows);
		return inaAxisStructureList;
	};
	oFF.QInAAxis = function() {
	};
	oFF.QInAAxis.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAAxis.prototype.getComponentType = function() {
		return oFF.OlapComponentType.AXIS;
	};
	oFF.QInAAxis.prototype.importComponentWithStructure = function(importer,
			inaStructure, modelComponent, parentComponent, context) {
		var supportsZeroSuppression = importer
				.hasCapability(oFF.InACapabilities.ZERO_SUPPRESSION);
		var axisType;
		var axisTypeValue = inaStructure.getStringByKey("Axis");
		var queryModel;
		var axis;
		var valueType;
		var zeroSuppressionType;
		if (oFF.isNull(axisTypeValue)) {
			axisType = oFF.QInAConverter.lookupAxisTypeInt(inaStructure
					.getIntegerByKey("Type"));
		} else {
			axisType = oFF.QInAConverter.lookupAxisType(axisTypeValue);
		}
		queryModel = context.getQueryModel();
		axis = queryModel.getAxisBase(axisType);
		if (oFF.notNull(axis)) {
			if (supportsZeroSuppression) {
				valueType = inaStructure.getIntegerByKey("ZeroSuppressionType");
				zeroSuppressionType = oFF.QInAConverter
						.lookupSuppressionType(valueType);
				axis.setZeroSuppressionType(zeroSuppressionType);
				axis.setDefaultZeroSuppression(zeroSuppressionType);
			}
			importer.importTotals(inaStructure, axis
					.getResultStructureControllerBase(), context);
		}
		return axis;
	};
	oFF.QInAAxis.prototype.exportComponentWithStructure = function(exporter,
			modelComponent, inaStructure, flags) {
		var axis = modelComponent;
		var axisType = axis.getType();
		var typeZeroSuppression;
		inaStructure.putString("Axis", oFF.QInAConverter
				.lookupAxisTypeInA(axisType));
		inaStructure.putInteger("Type", oFF.QInAConverter
				.lookupAxisTypeInAInt(axisType));
		typeZeroSuppression = axis.getZeroSuppressionType();
		inaStructure.putInteger("ZeroSuppressionType", oFF.QInAConverter
				.lookupSuppressionTypeInA(typeZeroSuppression));
		exporter
				.exportTotals(axis.getResultStructureController(), inaStructure);
		return inaStructure;
	};
	oFF.QInAConditionManager = function() {
	};
	oFF.QInAConditionManager.prototype = new oFF.QInAComponentWithList();
	oFF.QInAConditionManager.prototype.getComponentType = function() {
		return oFF.OlapComponentType.CONDITIONS_MANAGER;
	};
	oFF.QInAConditionManager.prototype.getTagName = function() {
		return "Conditions";
	};
	oFF.QInAConditionManager.prototype.importComponentWithList = function(
			importer, inaList, modelComponent, parentComponent, context) {
		var conditionManager = modelComponent;
		var queryModelBase;
		var len;
		var i;
		var inaCurrentCondition;
		var currentCondition;
		if (oFF.notNull(conditionManager)) {
			conditionManager.clear();
			if (oFF.notNull(inaList)) {
				queryModelBase = context.getQueryModel();
				len = inaList.size();
				for (i = 0; i < len; i++) {
					inaCurrentCondition = inaList.getStructureAt(i);
					currentCondition = importer.importCondition(queryModelBase,
							inaCurrentCondition, null);
					conditionManager.add(currentCondition);
				}
			}
		}
		return conditionManager;
	};
	oFF.QInAConditionManager.prototype.exportComponentWithList = function(
			exporter, modelComponent, flags) {
		var conditionManager = modelComponent;
		var conditions;
		var len;
		var inaConditionsList;
		var i;
		if (oFF.notNull(conditionManager)) {
			if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA)) {
				conditions = conditionManager.getEffectiveConditions();
			} else {
				conditions = conditionManager;
			}
			len = conditions.size();
			if (len > 0) {
				inaConditionsList = oFF.PrFactory.createList();
				for (i = 0; i < len; i++) {
					inaConditionsList.add(exporter.exportCondition(conditions
							.get(i)));
				}
				return inaConditionsList;
			}
		}
		return null;
	};
	oFF.QInAConditionsCondition = function() {
	};
	oFF.QInAConditionsCondition.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAConditionsCondition.exportBreakGroupDimensionList = function(
			condition) {
		var inaBreakGroupDimensionList;
		var breakGroupDimensions;
		var len;
		var i;
		if (oFF.isNull(condition)) {
			return null;
		}
		inaBreakGroupDimensionList = oFF.PrFactory.createList();
		breakGroupDimensions = condition.getBreakGroupDimensions();
		len = breakGroupDimensions.size();
		for (i = 0; i < len; i++) {
			inaBreakGroupDimensionList.addString(breakGroupDimensions.get(i)
					.getName());
		}
		return inaBreakGroupDimensionList;
	};
	oFF.QInAConditionsCondition.exportEvaluateOnDimensionsList = function(
			condition) {
		var inaEvaluationDimensionList;
		var evaluationDimensions;
		var len;
		var i;
		if (oFF.isNull(condition)) {
			return null;
		}
		inaEvaluationDimensionList = oFF.PrFactory.createList();
		evaluationDimensions = condition.getEvaluationDimensions();
		len = evaluationDimensions.size();
		for (i = 0; i < len; i++) {
			inaEvaluationDimensionList.addString(evaluationDimensions.get(i)
					.getName());
		}
		return inaEvaluationDimensionList;
	};
	oFF.QInAConditionsCondition.prototype.getComponentType = function() {
		return oFF.OlapComponentType.CONDITION;
	};
	oFF.QInAConditionsCondition.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var newCondition;
		var inACondName;
		var isBackendCondition;
		var onDisabled;
		var inAEvaluateOnDimensionTypeString;
		var conditionDimensionEvaluationType;
		var queryModel;
		var inADimensionList;
		var dimSize;
		var idxDim;
		var inACurrentDimensionName;
		var currentDimension;
		var inAThresholds;
		var thresholdSize;
		var idxThreshold;
		var inACurrentThreshold;
		var inABreakDimensionList;
		var inACurrentBreakDimensionName;
		var currentBreakDimension;
		if (oFF.isNull(inaStructure)) {
			return modelComponent;
		}
		inACondName = inaStructure.getStringByKey("Name");
		if (oFF.isNull(modelComponent)) {
			if (importer.getMode() === oFF.QModelFormat.INA_REPOSITORY) {
				isBackendCondition = inaStructure.getBooleanByKeyExt(
						"IsBackendCondition", true);
				newCondition = oFF.QCondition.create(context, parentComponent,
						inACondName, isBackendCondition);
			} else {
				newCondition = oFF.QCondition.create(context, parentComponent,
						inACondName, true);
			}
		} else {
			newCondition = modelComponent;
			newCondition.setConditionName(inACondName);
		}
		newCondition.setActive(inaStructure.getBooleanByKey("Active"));
		newCondition.setUsedState(inaStructure.getStringByKey("IsUsed"));
		newCondition.setDescription(inaStructure.getStringByKey("Description"));
		onDisabled = inaStructure.getStringByKey("OnDisabled");
		if (oFF.notNull(onDisabled)) {
			if (oFF.XString.isEqual(onDisabled, "Error")) {
				newCondition.setOnDisabledToError();
			} else {
				newCondition.setOnDisabledToWarning();
			}
		}
		inAEvaluateOnDimensionTypeString = inaStructure
				.getStringByKey("EvaluateOnDimensions");
		conditionDimensionEvaluationType = oFF.ConditionDimensionEvaluationType
				.lookupName(inAEvaluateOnDimensionTypeString);
		if (oFF.notNull(conditionDimensionEvaluationType)) {
			newCondition
					.setDimensionEvaluationType(conditionDimensionEvaluationType);
		}
		queryModel = context.getQueryModel();
		inADimensionList = inaStructure
				.getListByKey("EvaluateOnDimensionsList");
		if (!oFF.PrUtils.isListEmpty(inADimensionList)
				&& oFF.notNull(queryModel)) {
			dimSize = inADimensionList.size();
			for (idxDim = 0; idxDim < dimSize; idxDim++) {
				inACurrentDimensionName = inADimensionList.getStringAt(idxDim);
				if (oFF.notNull(inACurrentDimensionName)) {
					currentDimension = queryModel
							.getDimensionByNameFromExistingMetadata(inACurrentDimensionName);
					if (oFF.notNull(currentDimension)) {
						newCondition.addEvaluationDimension(currentDimension);
					}
				}
			}
		}
		inAThresholds = inaStructure.getListByKey("Threshold");
		if (!oFF.PrUtils.isListEmpty(inAThresholds)) {
			thresholdSize = inAThresholds.size();
			for (idxThreshold = 0; idxThreshold < thresholdSize; idxThreshold++) {
				inACurrentThreshold = inAThresholds
						.getStructureAt(idxThreshold);
				if (oFF.notNull(inACurrentThreshold)) {
					newCondition.addThreshold(importer
							.importConditionThreshold(queryModel,
									inACurrentThreshold, null));
				}
			}
		}
		newCondition.setAutoGroup(inaStructure.getBooleanByKeyExt("AutoGroup",
				false));
		newCondition.setBreakGroup(inaStructure.getBooleanByKeyExt(
				"BreakGroup", false));
		inABreakDimensionList = inaStructure.getListByKey("BreakGroupList");
		if (!oFF.PrUtils.isListEmpty(inABreakDimensionList)
				&& oFF.notNull(queryModel)) {
			dimSize = inABreakDimensionList.size();
			for (idxDim = 0; idxDim < dimSize; idxDim++) {
				inACurrentBreakDimensionName = inABreakDimensionList
						.getStringAt(idxDim);
				if (oFF.notNull(inACurrentBreakDimensionName)) {
					currentBreakDimension = queryModel
							.getDimensionByNameFromExistingMetadata(inACurrentBreakDimensionName);
					if (oFF.notNull(currentBreakDimension)) {
						newCondition
								.addBreakGroupDimension(currentBreakDimension);
					}
				}
			}
		}
		return newCondition;
	};
	oFF.QInAConditionsCondition.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var condition = modelComponent;
		var dimensionEvaluationType;
		var queryModel;
		var isMds;
		var exportEvaluateOnDimensionsList;
		var thresholds;
		var thresholdSize;
		var inAThresholdList;
		var i;
		var currentInAThreshold;
		var isGroupBreaking;
		var exportBreakGroupDimensionList;
		if (exporter.getMode() === oFF.QModelFormat.INA_REPOSITORY) {
			inaStructure.putBoolean("IsBackendCondition", condition
					.isBackendCondition());
		}
		inaStructure.putBoolean("Active", condition.isActive());
		inaStructure.putString("Description", condition.getDescription());
		inaStructure.putString("Name", condition.getName());
		dimensionEvaluationType = condition.getDimensionEvaluationType();
		inaStructure.putString("EvaluateOnDimensions", dimensionEvaluationType
				.getName());
		queryModel = modelComponent.getQueryModel();
		isMds = queryModel.getSystemType().isTypeOf(oFF.SystemType.HANA);
		if (dimensionEvaluationType === oFF.ConditionDimensionEvaluationType.GIVEN_LIST) {
			exportEvaluateOnDimensionsList = oFF.QInAConditionsCondition
					.exportEvaluateOnDimensionsList(condition);
			inaStructure.put("EvaluateOnDimensionsList",
					exportEvaluateOnDimensionsList);
			if (isMds && exportEvaluateOnDimensionsList.size() === 1) {
				inaStructure.putBoolean("AutoGroup", condition.isAutoGroup());
			}
		}
		thresholds = condition.getThresholds();
		thresholdSize = thresholds.size();
		if (thresholdSize > 0) {
			inAThresholdList = oFF.PrFactory.createList();
			for (i = 0; i < thresholdSize; i++) {
				currentInAThreshold = exporter
						.exportConditionThreshold(thresholds.get(i));
				if (oFF.notNull(currentInAThreshold)) {
					inAThresholdList.add(currentInAThreshold);
				}
			}
			if (!inAThresholdList.isEmpty()) {
				inaStructure.put("Threshold", inAThresholdList);
			}
		}
		if (isMds) {
			inaStructure.putString("OnDisabled", condition.getOnDisabled());
			isGroupBreaking = condition.isBreakGroup();
			inaStructure.putBoolean("BreakGroup", isGroupBreaking);
			if (isGroupBreaking) {
				exportBreakGroupDimensionList = oFF.QInAConditionsCondition
						.exportBreakGroupDimensionList(condition);
				inaStructure.put("BreakGroupList",
						exportBreakGroupDimensionList);
			}
		}
		return inaStructure;
	};
	oFF.QInAConditionsThreshold = function() {
	};
	oFF.QInAConditionsThreshold.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAConditionsThreshold.importSingleMeasureCoordinate = function(
			queryModelBase, threshold, measureCoordinate) {
		var inADimensionName;
		var inAMemberName;
		var queryModel;
		var dimension;
		var dimensionMember;
		if (oFF.isNull(threshold) || oFF.isNull(measureCoordinate)) {
			return;
		}
		inADimensionName = measureCoordinate.getStringByKey("DimensionName");
		inAMemberName = measureCoordinate.getStringByKey("MemberName");
		if (oFF.XStringUtils.isNullOrEmpty(inADimensionName)
				|| oFF.XStringUtils.isNullOrEmpty(inAMemberName)) {
			return;
		}
		queryModel = queryModelBase;
		if (oFF.isNull(queryModel)) {
			queryModel = threshold.getContext().getQueryModel();
		}
		if (oFF.notNull(queryModel)) {
			dimension = queryModel
					.getDimensionByNameFromExistingMetadata(inADimensionName);
			if (oFF.notNull(dimension)) {
				dimensionMember = dimension.getDimensionMember(inAMemberName);
				if (oFF.notNull(dimensionMember)) {
					threshold.addMeasureCoordinate(dimensionMember);
				}
			}
		}
	};
	oFF.QInAConditionsThreshold.importThresholdValue = function(filterBag,
			inAValue) {
		if (oFF.isNull(filterBag) || oFF.isNull(inAValue)) {
			return;
		}
		if (inAValue.isBoolean()) {
			filterBag.setBoolean(inAValue.getBoolean());
		} else {
			if (inAValue.isString()) {
				filterBag.setString(inAValue.getString());
			} else {
				if (inAValue.isDouble()) {
					filterBag.setDouble(inAValue.getDouble());
				} else {
					if (inAValue.isInteger()) {
						filterBag.setInteger(inAValue.getInteger());
					} else {
						if (inAValue.isLong()) {
							filterBag.setLong(inAValue.getLong());
						}
					}
				}
			}
		}
	};
	oFF.QInAConditionsThreshold.setValue = function(exporter, parameterName,
			inaElement, value, valueType) {
		var variableValue;
		if (valueType === oFF.XValueType.VARIABLE) {
			variableValue = value.getVariableValue();
			if (oFF.notNull(variableValue)) {
				inaElement.putString(parameterName, variableValue.getName());
				if (oFF.XString.isEqual(parameterName, "Low")) {
					inaElement.putString("LowIs", "Variable");
				} else {
					if (oFF.XString.isEqual(parameterName, "High")) {
						inaElement.putString("HighIs", "Variable");
					}
				}
			}
		} else {
			oFF.QInAValueUtils.exportValue(exporter, parameterName, inaElement,
					value, valueType);
		}
	};
	oFF.QInAConditionsThreshold.prototype.getComponentType = function() {
		return oFF.OlapComponentType.CONDITIONS_THRESHOLD;
	};
	oFF.QInAConditionsThreshold.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var newThreshold;
		var inAComparisonOperator;
		var conditionComparisonOperator;
		var inALow;
		var inALowIs;
		var inAHigh;
		var inAHighIs;
		var inAMeasureCoordinates;
		var queryModel;
		var len;
		var i;
		var inaLevel;
		if (oFF.isNull(inaStructure)) {
			return modelComponent;
		}
		if (oFF.isNull(modelComponent)) {
			newThreshold = oFF.QConditionThreshold.create(context,
					parentComponent);
		} else {
			newThreshold = modelComponent;
		}
		inAComparisonOperator = inaStructure.getStringByKey("Comparison");
		conditionComparisonOperator = oFF.ConditionComparisonOperator
				.lookupName(inAComparisonOperator);
		if (oFF.notNull(conditionComparisonOperator)) {
			newThreshold.setComparisonOperator(conditionComparisonOperator);
		}
		inALow = inaStructure.getByKey("Low");
		oFF.QInAConditionsThreshold.importThresholdValue(newThreshold.getLow(),
				inALow);
		inALowIs = inaStructure.getByKey("LowIs");
		oFF.QInAConditionsThreshold.importThresholdValue(newThreshold
				.getLowIs(), inALowIs);
		inAHigh = inaStructure.getByKey("High");
		oFF.QInAConditionsThreshold.importThresholdValue(
				newThreshold.getHigh(), inAHigh);
		inAHighIs = inaStructure.getByKey("HighIs");
		oFF.QInAConditionsThreshold.importThresholdValue(newThreshold
				.getHighIs(), inAHighIs);
		inAMeasureCoordinates = inaStructure.getListByKey("MeasureCoordinate");
		if (oFF.notNull(inAMeasureCoordinates)) {
			queryModel = context.getQueryModel();
			len = inAMeasureCoordinates.size();
			for (i = 0; i < len; i++) {
				oFF.QInAConditionsThreshold.importSingleMeasureCoordinate(
						queryModel, newThreshold, inAMeasureCoordinates
								.getStructureAt(i));
			}
		}
		newThreshold.setLeavesOnly(inaStructure.getBooleanByKeyExt(
				"LeavesOnly", false));
		inaLevel = inaStructure.getByKey("Level");
		if (oFF.notNull(inaLevel)) {
			newThreshold.setLevel(oFF.XIntegerValue.create(inaLevel
					.getInteger()));
		}
		return newThreshold;
	};
	oFF.QInAConditionsThreshold.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var conditionThreshold = modelComponent;
		var measureCoordinates = conditionThreshold.getMeasureCoordinates();
		var inAMeasureCoordinates = oFF.PrFactory.createList();
		var len = measureCoordinates.size();
		var i;
		var currentDimensionMember;
		var singleInACoordinate;
		var queryModel;
		var isMds;
		var lowValue;
		var highValue;
		var level;
		var lowValueIs;
		var highValueIs;
		var comparisonOperator;
		for (i = 0; i < len; i++) {
			currentDimensionMember = measureCoordinates.get(i);
			singleInACoordinate = oFF.PrFactory.createStructure();
			singleInACoordinate.putString("DimensionName",
					currentDimensionMember.getDimension().getName());
			singleInACoordinate.putString("MemberName", currentDimensionMember
					.getName());
			inAMeasureCoordinates.add(singleInACoordinate);
		}
		if (!inAMeasureCoordinates.isEmpty()) {
			inaStructure.put("MeasureCoordinate", inAMeasureCoordinates);
		}
		queryModel = modelComponent.getQueryModel();
		isMds = queryModel.getSystemType().isTypeOf(oFF.SystemType.HANA);
		lowValue = conditionThreshold.getLow();
		highValue = conditionThreshold.getHigh();
		if (isMds) {
			if (lowValue.getValue() !== null) {
				oFF.QInAConditionsThreshold.setValue(exporter, "Low",
						inaStructure, lowValue, oFF.XValueType.STRING);
			}
			if (highValue.getValue() !== null) {
				oFF.QInAConditionsThreshold.setValue(exporter, "High",
						inaStructure, highValue, oFF.XValueType.STRING);
			}
			level = conditionThreshold.getLevel();
			if (oFF.notNull(level)) {
				inaStructure.putInteger("Level", level.getInteger());
			}
			inaStructure.putBoolean("LeavesOnly", conditionThreshold
					.isLeavesOnly());
		} else {
			if (lowValue.getValue() !== null) {
				oFF.QInAConditionsThreshold.setValue(exporter, "Low",
						inaStructure, lowValue, lowValue.getValueType());
			}
			if (highValue.getValue() !== null) {
				oFF.QInAConditionsThreshold.setValue(exporter, "High",
						inaStructure, highValue, highValue.getValueType());
			}
			lowValueIs = conditionThreshold.getLowIs();
			if (lowValueIs.getValue() !== null) {
				oFF.QInAConditionsThreshold.setValue(exporter, "LowIs",
						inaStructure, lowValueIs, lowValueIs.getValueType());
			}
			highValueIs = conditionThreshold.getHighIs();
			if (highValueIs.getValue() !== null) {
				oFF.QInAConditionsThreshold.setValue(exporter, "HighIs",
						inaStructure, highValueIs, highValueIs.getValueType());
			}
		}
		comparisonOperator = conditionThreshold.getComparisonOperator();
		inaStructure.putString("Comparison", comparisonOperator.getName());
		return inaStructure;
	};
	oFF.QInADataCell = function() {
	};
	oFF.QInADataCell.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInADataCell.prototype.getComponentType = function() {
		return oFF.OlapComponentType.DATA_CELL;
	};
	oFF.QInADataCell.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var queryModel = context.getQueryModel();
		var queryDataCellList = queryModel.getQueryDataCellsBase();
		var dataCell = queryDataCellList.newQueryDataCell(inaStructure
				.getStringByKey("Name"));
		var inaBaseValueType;
		var cellValueType;
		var dimensionReferenceName;
		var inaMemberReferences;
		var k;
		dataCell.setSignReversal(inaStructure.getBooleanByKeyExt(
				"SignReversal", false));
		dataCell.setEmphasized(inaStructure.getBooleanByKeyExt("Emphasized",
				false));
		dataCell.setCumulation(inaStructure.getBooleanByKeyExt("Cumulation",
				false));
		dataCell.setInputEnabled(inaStructure.getBooleanByKeyExt(
				"InputEnabled", false));
		dataCell.setDisaggregationMode(oFF.DisaggregationMode
				.lookupWithDefault(inaStructure.getStringByKeyExt(
						"DisaggregationMode", null),
						oFF.DisaggregationMode.NONE));
		dataCell.setDisaggregationRefCellName(inaStructure.getStringByKeyExt(
				"DisaggregationReferenceCellName", null));
		dataCell.setScalingFactor(inaStructure.getIntegerByKeyExt(
				"ScalingFactor", 1));
		dataCell.setDecimalPlaces(inaStructure
				.getIntegerByKeyExt("Decimals", 0));
		inaBaseValueType = inaStructure.getIntegerByKeyExt("CellValueType", 0);
		cellValueType = oFF.QInAConverter
				.lookupValueTypeByInt(inaBaseValueType);
		dataCell.setBaseCellValueType(cellValueType);
		if (cellValueType === oFF.XValueType.DIMENSION_MEMBER) {
			dimensionReferenceName = inaStructure
					.getStringByKey("CellDimensionReference");
			dataCell.setDimensionReference(queryModel.getDimensions().getByKey(
					dimensionReferenceName));
		}
		inaMemberReferences = inaStructure
				.getListByKey("DimensionMemberReferences");
		if (oFF.notNull(inaMemberReferences)) {
			for (k = 0; k < inaMemberReferences.size(); k++) {
				dataCell.addDimensionMemberReference(inaMemberReferences
						.getStringAt(k));
			}
		}
		if (importer.mode === oFF.QModelFormat.INA_METADATA
				&& dataCell.getReferenceStructureElement1() === null
				&& dataCell.getReferenceStructureElement2() === null) {
			queryDataCellList.removeElement(dataCell);
			return null;
		}
		return dataCell;
	};
	oFF.QInADataCell.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var dataCell = modelComponent;
		var disaggregationMode;
		var referenceDataCell;
		var baseValueType;
		var inaBaseValueType;
		var inaMemberReferences;
		var referenceStructureElement;
		inaStructure.putString("Name", dataCell.getName());
		disaggregationMode = dataCell.getDisaggregationMode();
		oFF.QInAExportUtil.setNameIfNotNull(inaStructure, "DisaggregationMode",
				oFF.isNull(disaggregationMode) ? oFF.DisaggregationMode.NONE
						: disaggregationMode);
		referenceDataCell = dataCell.getDisaggregationRefCell();
		inaStructure.putString("DisaggregationReferenceCellName", oFF
				.isNull(referenceDataCell) ? "0" : referenceDataCell.getName());
		inaStructure.putInteger("ScalingFactor", dataCell.getScalingFactor());
		inaStructure.putInteger("Decimals", dataCell.getDecimalPlaces());
		inaStructure.putBoolean("SignReversal", dataCell.hasSignReversal());
		inaStructure.putBoolean("Emphasized", dataCell.isEmphasized());
		inaStructure.putBoolean("Cumulation", dataCell.isCumulated());
		baseValueType = dataCell.getBaseValueType();
		inaBaseValueType = oFF.QInAConverter
				.lookupIntByValueType(baseValueType);
		inaStructure.putInteger("CellValueType", inaBaseValueType);
		inaMemberReferences = inaStructure
				.putNewList("DimensionMemberReferences");
		referenceStructureElement = dataCell.getReferenceStructureElement1();
		if (oFF.notNull(referenceStructureElement)) {
			inaMemberReferences.addString(referenceStructureElement.getName());
			referenceStructureElement = dataCell
					.getReferenceStructureElement2();
			if (oFF.notNull(referenceStructureElement)) {
				inaMemberReferences.addString(referenceStructureElement
						.getName());
			}
		}
		return inaStructure;
	};
	oFF.QInADataCellsAll = function() {
	};
	oFF.QInADataCellsAll.prototype = new oFF.QInAComponentWithList();
	oFF.QInADataCellsAll.prototype.getComponentType = function() {
		return oFF.OlapComponentType.DATA_CELLS;
	};
	oFF.QInADataCellsAll.prototype.getTagName = function() {
		return "QueryDataCells";
	};
	oFF.QInADataCellsAll.prototype.importComponentWithList = function(importer,
			inaList, modelComponent, parentComponent, context) {
		var queryModel = context.getQueryModel();
		var queryDataCellList;
		var i;
		if (queryModel.supportsDataCells()
				&& importer.mode !== oFF.QModelFormat.INA_DATA_REINIT) {
			queryDataCellList = queryModel.getQueryDataCellsBase();
			queryDataCellList.clear();
			if (oFF.notNull(inaList)) {
				for (i = 0; i < inaList.size(); i++) {
					importer.importDataCell(inaList.getStructureAt(i),
							queryModel);
				}
			}
		}
		return null;
	};
	oFF.QInADataCellsAll.prototype.exportComponentWithList = function(exporter,
			modelComponent, flags) {
		var queryModel = modelComponent;
		var inaQueryDataCellList = null;
		var queryDataCells;
		var size;
		var i;
		var cellStructure;
		if (queryModel.supportsDataCells()) {
			queryDataCells = queryModel.getQueryDataCells();
			inaQueryDataCellList = oFF.PrFactory.createList();
			size = queryDataCells.size();
			for (i = 0; i < size; i++) {
				cellStructure = exporter.exportDataCell(queryDataCells.get(i),
						null);
				inaQueryDataCellList.add(cellStructure);
			}
		}
		return inaQueryDataCellList;
	};
	oFF.QInADimension = function() {
	};
	oFF.QInADimension.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInADimension.importQdFieldTransformations = function(importer,
			inaDimension, dimension) {
		var fieldList = inaDimension.getListByKey("Fields");
		var fieldSize;
		var i;
		var currentElement;
		var fieldName;
		var textTransType;
		var field;
		var transformationType;
		if (oFF.notNull(fieldList)) {
			fieldSize = fieldList.size();
			for (i = 0; i < fieldSize; i++) {
				currentElement = fieldList.get(i);
				if (currentElement.isStructure()) {
					fieldName = currentElement.getStringByKey("Name");
					textTransType = currentElement
							.getStringByKey("TextTransformation");
					if (oFF.XStringUtils.isNotNullAndNotEmpty(fieldName)
							&& oFF.XStringUtils
									.isNotNullAndNotEmpty(textTransType)) {
						field = dimension.getFieldByName(fieldName);
						transformationType = oFF.TextTransformationType
								.lookupName(textTransType);
						if (oFF.notNull(field)
								&& oFF.notNull(transformationType)) {
							if (transformationType
									.isTypeOf(oFF.TextTransformationType.SPATIAL_TRANSFORMATION)
									&& !importer.supportsSpatialTransformations) {
								continue;
							}
							field.setTextTransformation(transformationType);
						}
					}
				}
			}
		}
	};
	oFF.QInADimension.exportQdReadMode = function(exporter, dimension,
			inaStructure) {
		var readModeContext;
		var isValuehelp = exporter.getMode() === oFF.QModelFormat.INA_VALUE_HELP;
		var readMode;
		var inaReadModeName;
		var inaReadMode;
		if (isValuehelp) {
			readModeContext = oFF.QContextType.SELECTOR;
		} else {
			readModeContext = oFF.QContextType.RESULT_SET;
		}
		readMode = dimension.getReadMode(readModeContext);
		if (oFF.isNull(readMode)) {
			exporter.addError(oFF.ErrorCodes.INVALID_DIMENSION,
					oFF.XStringUtils.concatenate3(
							"No read mode given for dimension '", dimension
									.getName(), "'!"));
			return;
		}
		if (exporter.isAbap(dimension.getQueryModel())) {
			if (isValuehelp) {
				inaReadModeName = "ReadMode";
			} else {
				inaReadModeName = "ResultSetReadMode";
			}
		} else {
			inaReadModeName = "ReadMode";
		}
		inaReadMode = oFF.QInAConverter.lookupReadModeInA(readMode);
		inaStructure.putStringNotNull(inaReadModeName, inaReadMode);
	};
	oFF.QInADimension.exportQdReadModeLegacy = function(exporter, dimension,
			inaStructure) {
		var readModeContext;
		var inaReadModeName;
		var isBW = exporter.isAbap(dimension.getQueryModel());
		var readMode;
		var inaReadMode;
		if (exporter.getMode() === oFF.QModelFormat.INA_VALUE_HELP) {
			readModeContext = oFF.QContextType.SELECTOR;
			inaReadModeName = "SelectorReadMode";
			if (isBW) {
				inaStructure.putStringNotNull("VariableReadMode",
						oFF.QInAConverter.lookupReadModeInA(dimension
								.getReadMode(oFF.QContextType.VARIABLE)));
			}
		} else {
			readModeContext = oFF.QContextType.RESULT_SET;
			inaReadModeName = "ResultSetReadMode";
		}
		readMode = dimension.getReadMode(readModeContext);
		if (oFF.isNull(readMode)) {
			exporter.addError(oFF.ErrorCodes.INVALID_DIMENSION,
					oFF.XStringUtils.concatenate3(
							"No read mode given for dimension '", dimension
									.getName(), "'!"));
			return;
		}
		inaReadMode = oFF.QInAConverter.lookupReadModeInA(readMode);
		if (exporter.getApplication().getVersion() < oFF.XVersion.V98_NO_NON_EMPTY) {
			inaStructure.putBoolean("NonEmpty",
					readMode === oFF.QMemberReadMode.BOOKED);
		}
		inaStructure.putStringNotNull("ReadMode", inaReadMode);
		if (isBW) {
			inaStructure.putStringNotNull(inaReadModeName, inaReadMode);
		}
	};
	oFF.QInADimension.importDimReadModes = function(importer, queryModel,
			dimension, inaDimension) {
		if (oFF.notNull(queryModel)) {
			if (importer.isAbap(queryModel)) {
				oFF.QInADimension.importReadModeSettings(inaDimension,
						dimension, oFF.QContextType.RESULT_SET,
						"ResultSetReadMode");
				oFF.QInADimension.importReadModeSettings(inaDimension,
						dimension, oFF.QContextType.VARIABLE,
						"VariableReadMode");
			} else {
				oFF.QInADimension.importReadModeSettings(inaDimension,
						dimension, oFF.QContextType.RESULT_SET,
						"ResultSetMemberReadMode");
			}
		}
		oFF.QInADimension.importReadModeSettings(inaDimension, dimension,
				oFF.QContextType.SELECTOR, "SelectorReadMode");
	};
	oFF.QInADimension.importReadModeSettings = function(inaDimension,
			dimension, context, activeReadMode) {
		var inaReadMode = inaDimension.getStringByKey(activeReadMode);
		var readMode;
		var givenReadMode;
		var defaultReadMode;
		var supportedReadModes;
		if (oFF.notNull(inaReadMode)) {
			readMode = oFF.QInAConverter.lookupReadMode(inaReadMode);
			if (oFF.notNull(readMode)
					&& readMode !== oFF.QMemberReadMode.UNDEFINED) {
				dimension.setReadMode(context, readMode);
			}
		}
		givenReadMode = dimension.getReadMode(context);
		if (oFF.isNull(givenReadMode)) {
			defaultReadMode = dimension.getReadModeDefault(context);
			if (oFF.notNull(defaultReadMode)
					&& defaultReadMode !== oFF.QMemberReadMode.UNDEFINED) {
				dimension.setReadMode(context, defaultReadMode);
			} else {
				if (oFF.QContextType.VARIABLE === context) {
					supportedReadModes = dimension
							.getSupportedReadModes(context);
					dimension.setReadMode(context, supportedReadModes
							.getValuesAsReadOnlyList().get(0));
				}
			}
		}
	};
	oFF.QInADimension.importRsAttributeNodes = function(inaDimension, dimension) {
		var inaResultSetAttributes = inaDimension
				.getListByKey("ResultSetAttributeNodes");
		var resultSetAttributes;
		var attributeSize;
		var idxAttribute;
		var attributeName;
		var attribute;
		if (oFF.isNull(inaResultSetAttributes)) {
			inaResultSetAttributes = inaDimension
					.getListByKey("DefaultResultSetAttributeNodes");
		}
		if (oFF.notNull(inaResultSetAttributes)) {
			resultSetAttributes = dimension.getResultSetAttributes();
			resultSetAttributes.clear();
			attributeSize = inaResultSetAttributes.size();
			for (idxAttribute = 0; idxAttribute < attributeSize; idxAttribute++) {
				attributeName = inaResultSetAttributes
						.getStringAt(idxAttribute);
				attribute = dimension.getAttributeByName(attributeName);
				if (oFF.notNull(attribute)) {
					resultSetAttributes.add(attribute);
				}
			}
		}
	};
	oFF.QInADimension.importRsFields = function(inaDimension, dimension) {
		var inaResultSetFields = inaDimension.getListByKey("ResultSetFields");
		var resultSetFields;
		var fieldSize;
		var idxField;
		var fieldName;
		var field;
		if (oFF.isNull(inaResultSetFields)) {
			inaResultSetFields = inaDimension
					.getListByKey("DefaultResultSetAttributes");
		}
		if (oFF.notNull(inaResultSetFields)) {
			resultSetFields = dimension.getResultSetFields();
			resultSetFields.clear();
			fieldSize = inaResultSetFields.size();
			for (idxField = 0; idxField < fieldSize; idxField++) {
				fieldName = inaResultSetFields.getStringAt(idxField);
				field = dimension.getFieldByName(fieldName);
				if (oFF.notNull(field)) {
					resultSetFields.add(field);
				}
			}
		}
	};
	oFF.QInADimension.importFieldsLayout = function(importer, inaDimension,
			dimension, context) {
		var fieldLayoutType;
		var inaFieldLayoutType = inaDimension.getStringByKey("FieldLayoutType");
		var inaAllFields;
		var inaAllFieldSize;
		var p1;
		var inaAllAttributes;
		var inaAllAttributesSize;
		var p2;
		var inaAttribute;
		var inaResultSetFields2;
		var resultSetFields2;
		var mainAttribute;
		var fieldName2;
		var iRsField;
		var resultsetSize;
		var duplicateNames;
		var rsField;
		var inaStructure;
		var field2;
		if (oFF.notNull(inaFieldLayoutType)) {
			fieldLayoutType = oFF.QInAConverter
					.lookupFieldLayoutType(inaFieldLayoutType);
			inaAllFields = inaDimension.getListByKey("FieldSettings");
			if (oFF.notNull(inaAllFields)) {
				inaAllFieldSize = inaAllFields.size();
				for (p1 = 0; p1 < inaAllFieldSize; p1++) {
					importer.importComponent(oFF.OlapComponentType.FIELD,
							inaAllFields.getStructureAt(p1), null, dimension,
							context);
				}
			}
			inaAllAttributes = inaDimension.getListByKey("AttributeSettings");
			if (oFF.notNull(inaAllAttributes)) {
				inaAllAttributesSize = inaAllAttributes.size();
				for (p2 = 0; p2 < inaAllAttributesSize; p2++) {
					inaAttribute = inaAllAttributes.getStructureAt(p2);
					importer.importAttribute(inaAttribute, dimension, context);
				}
			}
			oFF.QInADimension.importRsFields(inaDimension, dimension);
			oFF.QInADimension.importRsAttributeNodes(inaDimension, dimension);
			dimension.setFieldLayoutType(fieldLayoutType);
		} else {
			inaResultSetFields2 = inaDimension.getListByKey("ResultSetFields");
			if (oFF.isNull(inaResultSetFields2)) {
				inaResultSetFields2 = inaDimension
						.getListByKey("DefaultResultSetAttributes");
			}
			if (oFF.notNull(inaResultSetFields2)) {
				fieldLayoutType = oFF.FieldLayoutType.ATTRIBUTE_BASED;
				if (dimension.supportsFieldLayoutType(fieldLayoutType)) {
					dimension.setFieldLayoutType(fieldLayoutType);
				}
				fieldLayoutType = dimension.getFieldLayoutType();
				if (fieldLayoutType === oFF.FieldLayoutType.FIELD_BASED) {
					resultSetFields2 = dimension.getResultSetFields();
					resultSetFields2.clear();
					mainAttribute = dimension.getMainAttribute();
					if (oFF.notNull(mainAttribute)) {
						mainAttribute.getResultSetFields().clear();
					}
					resultsetSize = inaResultSetFields2.size();
					duplicateNames = oFF.XHashSetOfString.create();
					for (iRsField = 0; iRsField < resultsetSize; iRsField++) {
						fieldName2 = inaResultSetFields2.getStringAt(iRsField);
						if (!duplicateNames.contains(fieldName2)) {
							duplicateNames.add(fieldName2);
							rsField = dimension.getFieldByName(fieldName2);
							if (oFF.isNull(rsField)) {
								importer.addError(oFF.ErrorCodes.INVALID_TOKEN,
										oFF.XStringUtils
												.concatenate2(
														"Field not found: ",
														fieldName2));
								return;
							}
							resultSetFields2.add(rsField);
						}
					}
					inaResultSetFields2 = inaDimension
							.getListByKey("Attributes");
					if (oFF.notNull(inaResultSetFields2)) {
						resultsetSize = inaResultSetFields2.size();
						for (iRsField = 0; iRsField < resultsetSize; iRsField++) {
							inaStructure = inaResultSetFields2
									.getStructureAt(iRsField);
							fieldName2 = inaStructure.getStringByKey("Name");
							if (!duplicateNames.contains(fieldName2)) {
								duplicateNames.add(fieldName2);
								field2 = dimension
										.getFieldByNameOrAlias(fieldName2);
								if (oFF.isNull(field2)) {
									importer.addError(
											oFF.ErrorCodes.INVALID_TOKEN,
											oFF.XStringUtils.concatenate2(
													"Field not found: ",
													fieldName2));
									return;
								}
								resultSetFields2.add(field2);
							}
						}
					}
				}
			} else {
				if (dimension.isStructure()) {
					oFF.QInADimension.resetFieldsToDefault(dimension);
				}
			}
		}
	};
	oFF.QInADimension.resetFieldsToDefault = function(dimension) {
		var fieldLayoutType = dimension.getFieldLayoutType();
		var defaultFieldLayoutType = dimension.getDefaultFieldLayoutType();
		var dimDefaultResultSetFields;
		var dimResultSetFields;
		var defaultResultSetAttributes;
		var dimResultSetAttributes;
		var j;
		var currentAttribute;
		var attributeDefaultResultSetFields;
		var attributeResultSetFields;
		if (fieldLayoutType !== defaultFieldLayoutType) {
			dimension.setFieldLayoutType(defaultFieldLayoutType);
		}
		if (defaultFieldLayoutType === oFF.FieldLayoutType.FIELD_BASED) {
			dimDefaultResultSetFields = dimension.getDefaultResultSetFields();
			dimResultSetFields = dimension.getResultSetFields();
			dimResultSetFields.clear();
			dimResultSetFields.addAll(dimDefaultResultSetFields);
		} else {
			defaultResultSetAttributes = dimension
					.getDefaultResultSetAttributes();
			dimResultSetAttributes = dimension.getResultSetAttributes();
			dimResultSetAttributes.clear();
			for (j = 0; j < defaultResultSetAttributes.size(); j++) {
				currentAttribute = defaultResultSetAttributes.get(j);
				attributeDefaultResultSetFields = currentAttribute
						.getDefaultResultSetFields();
				attributeResultSetFields = currentAttribute
						.getResultSetFields();
				attributeResultSetFields.clear();
				attributeResultSetFields
						.addAll(attributeDefaultResultSetFields);
				dimResultSetAttributes.add(currentAttribute);
			}
		}
	};
	oFF.QInADimension.exportFieldLayout = function(exporter, inaDimension,
			dimension) {
		var exportingFields;
		var context = exporter.modelContext;
		var fields;
		var addedFields;
		var attributes;
		var attributeSize;
		var idxAttribute;
		var fieldList;
		var fieldSize;
		var p;
		var field;
		var fieldName;
		var inaFieldList;
		var hiddenFields;
		if (exporter.mode === oFF.QModelFormat.INA_REPOSITORY_DATA) {
			inaDimension.putString("FieldLayoutType", dimension
					.getFieldLayoutType().toString());
			oFF.QInADimension.exportRsFields(inaDimension, dimension);
		}
		if (dimension.getFieldLayoutTypeExt(context) === oFF.FieldLayoutType.FIELD_BASED) {
			exportingFields = dimension.getFieldsExt(context);
		} else {
			fields = oFF.XList.create();
			addedFields = oFF.XHashSetOfString.create();
			attributes = dimension.getAttributesExt(context);
			attributeSize = attributes.size();
			for (idxAttribute = 0; idxAttribute < attributeSize; idxAttribute++) {
				fieldList = attributes.get(idxAttribute).getFieldsExt(context);
				fieldSize = fieldList.size();
				for (p = 0; p < fieldSize; p++) {
					field = fieldList.get(p);
					fieldName = field.getName();
					if (!addedFields.contains(fieldName)) {
						fields.add(field);
						addedFields.add(fieldName);
					}
				}
			}
			exportingFields = fields;
		}
		inaFieldList = inaDimension.putNewList("Attributes");
		oFF.QInADimension.exportListOfFields(exportingFields, inaFieldList,
				exporter, false);
		hiddenFields = oFF.QInADimension.getHiddenFields(exporter, dimension,
				exportingFields);
		oFF.QInADimension.exportListOfFields(hiddenFields, inaFieldList,
				exporter, true);
	};
	oFF.QInADimension.exportRsFields = function(inaDimension, dimension) {
		var resFieldList = inaDimension.putNewList("ResultSetFields");
		var resultSetFields = dimension.getResultSetFields();
		var i;
		for (i = 0; i < resultSetFields.size(); i++) {
			resFieldList.addString(resultSetFields.get(i).getName());
		}
	};
	oFF.QInADimension.exportListOfFields = function(fields, inaFields,
			exporter, hide) {
		var flagVisible = oFF.QImExFlag.DEFAULT_ALL;
		var flagHidden = oFF.XMath.binaryOr(flagVisible, oFF.QImExFlag.HIDE);
		var fieldsSize = fields.size();
		var i;
		for (i = 0; i < fieldsSize; i++) {
			if (hide) {
				inaFields.add(exporter.exportComponent(
						oFF.OlapComponentType.FIELD, fields.get(i), null,
						flagHidden));
			} else {
				inaFields.add(exporter.exportComponent(
						oFF.OlapComponentType.FIELD, fields.get(i), null,
						flagVisible));
			}
		}
	};
	oFF.QInADimension.getHiddenFields = function(exporter, dimension,
			exportingFields) {
		var allFields;
		var hierarchyTextField;
		var hiddenFields;
		var exportSize;
		var i;
		var keyField;
		var textField;
		var queryModel;
		var exportTextField;
		var idxHidden;
		var hiddenField;
		if (exporter.modelContext === oFF.QContextType.SELECTOR) {
			allFields = oFF.XList.create();
			allFields.add(dimension.getKeyFieldExt(oFF.QContextType.SELECTOR));
			hierarchyTextField = dimension.getHierarchyTextField();
			if (oFF.notNull(hierarchyTextField)
					&& dimension.isSelectorHierarchyActive()) {
				allFields.add(hierarchyTextField);
			}
		} else {
			allFields = dimension.getFieldsListByActiveUsageType();
		}
		hiddenFields = allFields.createListCopy();
		exportSize = exportingFields.size();
		for (i = 0; i < exportSize; i++) {
			hiddenFields.removeElement(exportingFields.get(i));
		}
		keyField = dimension.getKeyFieldExt(exporter.modelContext);
		textField = dimension.getTextField();
		if (textField === keyField) {
			textField = null;
		}
		queryModel = dimension.getQueryModel();
		exportTextField = oFF.notNull(queryModel)
				&& queryModel.isExportingTextFieldAlways();
		for (idxHidden = 0; idxHidden < hiddenFields.size();) {
			hiddenField = hiddenFields.get(idxHidden);
			if (hiddenField !== keyField) {
				if (hiddenField !== textField && exportTextField) {
					if (!hiddenField.isAlwaysRequested()) {
						if (hiddenField.hasSorting()) {
							if (hiddenField.getResultSetSorting()
									.getDirection() === oFF.XSortDirection.DEFAULT_VALUE) {
								hiddenFields.removeAt(idxHidden);
								continue;
							}
						} else {
							hiddenFields.removeAt(idxHidden);
							continue;
						}
					}
				}
			}
			idxHidden++;
		}
		if (exportTextField) {
			oFF.QInADimension.moveFieldToStart(hiddenFields, textField);
		}
		oFF.QInADimension.moveFieldToStart(hiddenFields, keyField);
		return hiddenFields;
	};
	oFF.QInADimension.moveFieldToStart = function(hiddenFields, field) {
		var hiddenSize = hiddenFields.size();
		var idxField;
		var hiddenField;
		for (idxField = 0; idxField < hiddenSize; idxField++) {
			hiddenField = hiddenFields.get(idxField);
			if (hiddenField === field) {
				if (idxField !== 0) {
					hiddenFields.removeAt(idxField);
					hiddenFields.insert(0, hiddenField);
				}
				break;
			}
		}
	};
	oFF.QInADimension.prototype.getComponentType = function() {
		return oFF.OlapComponentType.ABSTRACT_DIMENSION;
	};
	oFF.QInADimension.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var queryModel = context.getQueryModel();
		var dimension = modelComponent;
		var dimName;
		var sortingManager;
		var inaSortOrder;
		var sortOrder;
		var skipEntries;
		var topEntries;
		var inaReadMode;
		var readMode;
		var variableContainer;
		var variables;
		var size;
		var i;
		var variable;
		if (oFF.isNull(dimension)) {
			dimName = inaStructure.getStringByKey("Name");
			if (oFF.notNull(queryModel)) {
				dimension = queryModel.getDimensionByNameInternal(dimName);
			}
			if (oFF.isNull(dimension)) {
				return null;
			}
		}
		if (importer.mode !== oFF.QModelFormat.INA_DATA_REINIT) {
			dimension.setSelectorGettingInterval(false);
			oFF.QInADimension.importDimReadModes(importer, queryModel,
					dimension, inaStructure);
			importer.importMembers(inaStructure, dimension, context);
			oFF.QInADimension.importFieldsLayout(importer, inaStructure,
					dimension, context);
			oFF.QInADimension.importQdFieldTransformations(importer,
					inaStructure, dimension);
			importer.importHierarchy(dimension, inaStructure);
			if (oFF.notNull(queryModel) && !queryModel.supportsExtendedSort()) {
				sortingManager = queryModel.getSortingManager();
				if (sortingManager.supportsDimensionSorting(dimension,
						oFF.SortType.MEMBER_KEY)) {
					inaSortOrder = inaStructure
							.getIntegerByKeyExt(
									"SortOrder",
									oFF.QInAConverter
											.lookupSortDirectionInA(oFF.XSortDirection.DEFAULT_VALUE));
					sortOrder = oFF.QInAConverter
							.lookupSortDirection(inaSortOrder);
					dimension.getResultSetSorting().setDirection(sortOrder);
				}
			}
			if (importer.supportsCummulative && dimension.supportsCumulative()) {
				dimension.setIsCumulative(inaStructure.getBooleanByKeyExt(
						"IsCummulative", false));
			}
			skipEntries = inaStructure.getIntegerByKeyExt("Skip", 0);
			dimension.setSkipEntries(skipEntries);
			topEntries = inaStructure.getIntegerByKeyExt("Top", 0);
			dimension.setTopEntries(topEntries);
			inaReadMode = inaStructure.getStringByKey("ReadMode");
			if (oFF.notNull(inaReadMode)) {
				readMode = oFF.QInAConverter.lookupReadMode(inaReadMode);
				dimension.setReadModeGraceful(oFF.QContextType.RESULT_SET,
						readMode);
			}
			importer.importTotals(inaStructure, dimension
					.getResultStructureControllerBase(), context);
			this.importAlternativeFieldValues(inaStructure, dimension);
		} else {
			variableContainer = dimension.getVariableContainer();
			if (oFF.notNull(variableContainer)) {
				variables = variableContainer.getVariables();
				size = variables.size();
				for (i = 0; i < size; i++) {
					variable = variables.get(i);
					if (variable.getVariableType() === oFF.VariableType.HIERARCHY_NAME_VARIABLE
							&& oFF.XString.isEqual(variable
									.getHierarchyNameDimension().getName(),
									dimension.getName())) {
						importer.importHierarchy(dimension, inaStructure);
						break;
					}
				}
			}
		}
		return dimension;
	};
	oFF.QInADimension.prototype.importAlternativeFieldValues = function(
			inaStructure, dimension) {
		var alternativeFieldValuesList = inaStructure
				.getListByKey("AlternativeFieldValues");
		var size;
		var i;
		var currentElement;
		var currentStructure;
		var strValueType;
		var valueType;
		var valueAsString;
		var value;
		var hierarchyKey;
		var memberKey;
		var fieldName;
		var language;
		if (oFF.notNull(alternativeFieldValuesList)) {
			size = alternativeFieldValuesList.size();
			for (i = 0; i < size; i++) {
				currentElement = alternativeFieldValuesList.get(i);
				if (currentElement.isStructure()) {
					currentStructure = currentElement;
					strValueType = currentStructure.getStringByKey("ValueType");
					valueType = oFF.QInAConverter.lookupValueType(strValueType);
					valueAsString = currentStructure.getStringByKey("Value");
					value = null;
					if (valueType === oFF.XValueType.INTEGER) {
						value = oFF.XIntegerValue.create(oFF.XInteger
								.convertFromStringWithRadix(valueAsString, 10));
					} else {
						if (valueType === oFF.XValueType.LONG) {
							value = oFF.XLongValue.create(oFF.XLong
									.convertFromString(valueAsString));
						} else {
							if (valueType === oFF.XValueType.DOUBLE) {
								value = oFF.XDoubleValue.create(oFF.XDouble
										.convertFromString(valueAsString));
							} else {
								if (valueType === oFF.XValueType.STRING) {
									value = oFF.XStringValue
											.create(valueAsString);
								} else {
									if (valueType === oFF.XValueType.DATE) {
										value = oFF.XDate
												.createDateFromIsoFormat(valueAsString);
									} else {
										if (valueType === oFF.XValueType.DATE_TIME) {
											value = oFF.XDateTime
													.createDateTimeFromIsoFormat(valueAsString);
										}
									}
								}
							}
						}
					}
					if (oFF.notNull(value)) {
						hierarchyKey = currentStructure
								.getBooleanByKey("HierarchyKey");
						memberKey = currentStructure
								.getStringByKey("MemberKey");
						fieldName = currentStructure
								.getStringByKey("FieldName");
						language = currentStructure.getStringByKey("Language");
						dimension.setAlternativeFieldValue(hierarchyKey,
								memberKey, fieldName, value, language);
					}
				}
			}
		}
	};
	oFF.QInADimension.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var dimension = modelComponent;
		var exporterVersion;
		var skipReadmode;
		var type;
		var skipEntries;
		var topEntries;
		inaStructure.putString("Name", dimension.getName());
		exporterVersion = exporter.getApplication().getVersion();
		skipReadmode = exporterVersion >= oFF.XVersion.V95_NO_MEASURE_READMODE
				&& dimension.isStructure();
		if (!skipReadmode) {
			if (exporterVersion >= oFF.XVersion.V99_NO_DUPLICATED_READMODE) {
				oFF.QInADimension.exportQdReadMode(exporter, dimension,
						inaStructure);
			} else {
				oFF.QInADimension.exportQdReadModeLegacy(exporter, dimension,
						inaStructure);
			}
		}
		if (exporter.mode === oFF.QModelFormat.INA_VALUE_HELP) {
			type = oFF.AxisType.ROWS;
		} else {
			type = dimension.getAxisType();
		}
		inaStructure.putString("Axis", oFF.QInAConverter
				.lookupAxisTypeInA(type));
		skipEntries = dimension.getSkipEntries();
		if (skipEntries > 0) {
			inaStructure.putInteger("Skip", skipEntries);
		}
		topEntries = dimension.getTopEntries();
		if (topEntries > 0) {
			inaStructure.putInteger("Top", topEntries);
		}
		if (dimension.supportsCumulative()) {
			inaStructure.putBoolean("IsCummulative", dimension.isCumulative());
		}
		if (!oFF.QInAUniversalDisplayHierarchies.isHierarchyConverted(exporter,
				dimension)) {
			exporter.exportHierarchy(dimension, inaStructure);
		}
		if (exporter.mode !== oFF.QModelFormat.INA_VALUE_HELP) {
			if (dimension.supportsTotals()) {
				exporter.exportTotals(dimension, inaStructure);
			}
			if (dimension.getStructureLayout() !== null) {
				exporter.exportMembers(dimension, inaStructure);
			}
		}
		oFF.QInADimension.exportFieldLayout(exporter, inaStructure, dimension);
		return inaStructure;
	};
	oFF.QInADimensionsAll = function() {
	};
	oFF.QInADimensionsAll.prototype = new oFF.QInAComponentWithList();
	oFF.QInADimensionsAll.exportAxisDimensionsWithHeuristic = function(
			exporter, axis, parameterDimensionList, usedDimensions) {
		var queryModel = axis.getQueryModel();
		var repositoryData = exporter.mode === oFF.QModelFormat.INA_REPOSITORY_DATA;
		var optimizedExportModeActive = queryModel
				.isOptimizedExportModeActive();
		var dimCount = axis.getDimensionCount();
		var i;
		var dimension;
		for (i = 0; i < dimCount; i++) {
			dimension = axis.get(i);
			if (optimizedExportModeActive
					&& dimension.isIgnoredOnOptimizedExport()) {
				continue;
			}
			if (repositoryData && !usedDimensions.contains(dimension.getName())) {
				continue;
			}
			parameterDimensionList.add(exporter
					.exportDimension(dimension, null));
		}
	};
	oFF.QInADimensionsAll.exportAxisDimensions = function(exporter, axis,
			parameterDimensionList) {
		var dimCount = axis.getDimensionCount();
		var i;
		var dimension;
		var dimensionWithLeveledHierarchy;
		var udhDimensions;
		var k;
		var dim;
		var dimName;
		if (!oFF.QInAUniversalDisplayHierarchies.isHierarchyConversionRequired(
				exporter, axis)) {
			for (i = 0; i < dimCount; i++) {
				dimension = axis.get(i);
				parameterDimensionList.add(exporter.exportDimension(dimension,
						null));
			}
		} else {
			dimensionWithLeveledHierarchy = oFF.QInAUniversalDisplayHierarchies
					.getDimensionWithLeveledHierarchy(axis).getName();
			udhDimensions = oFF.QInAUniversalDisplayHierarchies
					.getDimensionNames(exporter, axis);
			for (k = 0; k < dimCount; k++) {
				dim = axis.get(k);
				dimName = dim.getName();
				if (oFF.XString.isEqual(dimName, dimensionWithLeveledHierarchy)) {
					oFF.QInADimensionsAll.exportUdhDimensions(exporter, axis,
							parameterDimensionList, udhDimensions);
				} else {
					if (!udhDimensions.contains(dimName)) {
						parameterDimensionList.add(exporter.exportDimension(
								dim, null));
					}
				}
			}
		}
	};
	oFF.QInADimensionsAll.exportUdhDimensions = function(exporter, axis,
			parameterDimensionList, udhDimensions) {
		var size = udhDimensions.size();
		var k;
		var dim;
		var tmpAxis;
		var tmpHierarchyActive;
		for (k = 0; k < size; k++) {
			dim = axis.getQueryModel().getDimensionByName(udhDimensions.get(k));
			dim.stopEventing();
			tmpAxis = dim.getAxisBase();
			tmpHierarchyActive = oFF.QInAUniversalDisplayHierarchies
					.isHierarchyConverted(exporter, dim);
			dim.setAxis(axis);
			if (tmpHierarchyActive) {
				dim.setHierarchyActive(false);
			}
			parameterDimensionList.add(exporter.exportDimension(dim, null));
			dim.setAxis(tmpAxis);
			if (tmpHierarchyActive) {
				dim.setHierarchyActive(true);
			}
			dim.resumeEventing();
		}
	};
	oFF.QInADimensionsAll.prototype.getComponentType = function() {
		return oFF.OlapComponentType.DIMENSIONS;
	};
	oFF.QInADimensionsAll.prototype.getTagName = function() {
		return "Dimensions";
	};
	oFF.QInADimensionsAll.prototype.importComponentWithList = function(
			importer, inaList, modelComponent, parentComponent, context) {
		var queryModel;
		var freeAxis;
		var dimensions;
		var dimensionManager;
		var size;
		var k;
		var inaDimension;
		var dimName;
		var dimAxisString;
		var dimension;
		var importCalculatedDimension;
		var dimAxis;
		if (oFF.isNull(inaList)) {
			return modelComponent;
		}
		queryModel = modelComponent;
		if (importer.mode !== oFF.QModelFormat.INA_DATA_REINIT) {
			freeAxis = queryModel.getFreeAxis();
			dimensions = queryModel.getLoadedDimensions();
			freeAxis.addAll(dimensions);
		}
		dimensionManager = queryModel.getDimensionManagerBase();
		size = inaList.size();
		for (k = 0; k < size; k++) {
			inaDimension = inaList.getStructureAt(k);
			dimName = inaDimension.getStringByKey("Name");
			dimAxisString = inaDimension.getStringByKey("Axis");
			dimension = null;
			if (inaDimension.containsKey("FieldMappings")) {
				importCalculatedDimension = importer.importCalculatedDimension(
						inaDimension, queryModel);
				queryModel.addDimension(importCalculatedDimension);
				dimensionManager
						.finalizeDimensionMetadataSetup(importCalculatedDimension);
			} else {
				if (queryModel.getDimensionReferences().contains(dimName)) {
					dimAxis = oFF.AxisType.lookup(dimAxisString);
					if (importer.getMode() === oFF.QModelFormat.INA_REPOSITORY
							|| dimAxis === oFF.AxisType.COLUMNS
							|| dimAxis === oFF.AxisType.ROWS) {
						dimension = queryModel
								.getDimensionByNameFromExistingMetadata(dimName);
					}
				}
				importer.importDimension(inaDimension, queryModel);
			}
			if (importer.mode !== oFF.QModelFormat.INA_DATA_REINIT) {
				if (oFF.isNull(dimension)) {
					dimension = queryModel.getDimensionByNameInternal(dimName);
					if (oFF.isNull(dimension)) {
						continue;
					}
				}
				if (oFF.isNull(dimAxisString)) {
					dimAxisString = inaDimension.getStringByKeyExt(
							"AxisDefault", "Free");
				}
				queryModel.getAxis(
						oFF.QInAConverter.lookupAxisType(dimAxisString)).add(
						dimension);
			}
		}
		return queryModel;
	};
	oFF.QInADimensionsAll.prototype.exportDimensionIfOnFreeAxis = function(
			dimension) {
		var queryModel = dimension.getQueryModel();
		var usedDimensions = oFF.XHashSetOfString.create();
		var isDimensionFiltered;
		var exceptionManager;
		var hasExceptions;
		oFF.DimensionUsageAnalyzer.addDimensionsUsedInContainer(queryModel
				.getFilter().getDynamicFilter(), usedDimensions);
		isDimensionFiltered = usedDimensions.contains(dimension.getName());
		if (dimension.isMeasureStructure()) {
			exceptionManager = queryModel.getExceptionManager();
			hasExceptions = oFF.XCollectionUtils.hasElements(exceptionManager);
			return isDimensionFiltered || hasExceptions;
		}
		return isDimensionFiltered;
	};
	oFF.QInADimensionsAll.prototype.exportComponentWithList = function(
			exporter, modelComponent, flags) {
		var inaDimensionList = oFF.PrFactory.createList();
		var query;
		var usedDimensions;
		var isOutOfContextBlending;
		var doExportFreeAxisForPlanning;
		var freeAxis;
		var sizeFreeAxis;
		var isAbap;
		var idxFree;
		var freeDimension;
		var freeDimensionType;
		var exportStructure;
		var exportAccountOnFreeAxis;
		if (exporter.mode !== oFF.QModelFormat.INA_VALUE_HELP) {
			query = modelComponent;
			oFF.QInADimensionsAll.exportAxisDimensions(exporter, query
					.getAxis(oFF.AxisType.ROWS), inaDimensionList);
			oFF.QInADimensionsAll.exportAxisDimensions(exporter, query
					.getAxis(oFF.AxisType.COLUMNS), inaDimensionList);
			if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
				usedDimensions = oFF.XHashSetOfString.create();
				if (exporter.mode === oFF.QModelFormat.INA_REPOSITORY_DATA) {
					oFF.DimensionUsageAnalyzer.setupHeuristic(query,
							usedDimensions);
				}
				oFF.QInADimensionsAll.exportAxisDimensionsWithHeuristic(
						exporter, query.getAxis(oFF.AxisType.FREE),
						inaDimensionList, usedDimensions);
			} else {
				if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA)) {
					isOutOfContextBlending = query
							.supportsCubeBlendingOutOfContext()
							&& query.isBlendingModel();
					doExportFreeAxisForPlanning = query.getDataSource()
							.getType() === oFF.MetaObjectType.PLANNING
							&& exporter.getApplication().getVersion() >= oFF.XVersion.V108_EXPORT_FREE_AXIS_FOR_PLANNING;
					freeAxis = query.getAxis(oFF.AxisType.FREE);
					sizeFreeAxis = freeAxis.size();
					isAbap = exporter.isAbap(query);
					for (idxFree = 0; idxFree < sizeFreeAxis; idxFree++) {
						freeDimension = freeAxis.get(idxFree);
						freeDimensionType = freeDimension.getDimensionType();
						if (freeDimensionType === oFF.DimensionType.MEASURE_STRUCTURE
								|| freeDimensionType === oFF.DimensionType.SECONDARY_STRUCTURE) {
							exportStructure = this
									.exportDimensionIfOnFreeAxis(freeDimension);
							if (exportStructure) {
								inaDimensionList.add(exporter.exportDimension(
										freeDimension, null));
							}
						} else {
							if (freeDimensionType === oFF.DimensionType.ACCOUNT) {
								exportAccountOnFreeAxis = this
										.exportDimensionIfOnFreeAxis(freeDimension);
								if (exportAccountOnFreeAxis) {
									inaDimensionList.add(exporter
											.exportDimension(freeDimension,
													null));
								}
							} else {
								if (freeDimensionType === oFF.DimensionType.CALCULATED_DIMENSION
										|| isOutOfContextBlending
										|| (isAbap || doExportFreeAxisForPlanning)
										&& freeDimension.isHierarchyActive()) {
									inaDimensionList.add(exporter
											.exportDimension(freeDimension,
													null));
								}
							}
						}
					}
				}
			}
		}
		return inaDimensionList;
	};
	oFF.QInADrillManager = function() {
	};
	oFF.QInADrillManager.prototype = new oFF.QInAComponentWithList();
	oFF.QInADrillManager.prototype.getComponentType = function() {
		return oFF.OlapComponentType.DRILL_MANAGER;
	};
	oFF.QInADrillManager.prototype.getTagName = function() {
		return "HierarchyNavigations";
	};
	oFF.QInADrillManager.prototype.importComponentWithList = function(importer,
			inaList, modelComponent, parentComponent, context) {
		var drillManager = modelComponent;
		var size;
		var idxHierNav;
		if (oFF.notNull(inaList)) {
			drillManager.removeAllContextDrillOperations();
			size = inaList.size();
			for (idxHierNav = 0; idxHierNav < size; idxHierNav++) {
				importer.importDrillOperation(inaList
						.getStructureAt(idxHierNav), drillManager, context);
			}
		}
		return modelComponent;
	};
	oFF.QInADrillManager.prototype.exportComponentWithList = function(exporter,
			modelComponent, flags) {
		var drillManager = modelComponent;
		var inaOperationsList = null;
		var drillOperations = drillManager.getDrillOperations();
		var drillOpCount = drillOperations.size();
		var inaDeltaOperation;
		var deltaDimension;
		var deltaOperation;
		var targetDimension;
		var i;
		var operation;
		if (drillOpCount > 0) {
			inaDeltaOperation = null;
			deltaDimension = null;
			inaOperationsList = oFF.PrFactory.createList();
			if (drillManager.getContext().getQueryModel()
					.supportsHierarchyNavigationDeltaMode()) {
				deltaOperation = drillOperations.get(drillOpCount - 1);
				targetDimension = deltaOperation.getTargetDimension();
				if (oFF.notNull(targetDimension)
						&& targetDimension.isHierarchyNavigationDeltaMode()) {
					deltaDimension = targetDimension;
					inaDeltaOperation = exporter
							.exportDrillOperation(deltaOperation);
				}
			}
			for (i = 0; i < drillOpCount; i++) {
				operation = drillOperations.get(i);
				if (operation.getType() === oFF.DrillOperationType.CONTEXT) {
					if (oFF.isNull(deltaDimension)
							|| deltaDimension !== operation
									.getTargetDimension()) {
						inaOperationsList.add(exporter
								.exportDrillOperation(operation));
					}
				}
			}
			if (oFF.notNull(inaDeltaOperation)) {
				inaOperationsList.add(inaDeltaOperation);
			}
			if (inaOperationsList.isEmpty()) {
				inaOperationsList = null;
			}
		}
		return inaOperationsList;
	};
	oFF.QInADrillPathElement = function() {
	};
	oFF.QInADrillPathElement.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInADrillPathElement.prototype.getComponentType = function() {
		return oFF.MemberType.DRILL_PATH_ELEMENT;
	};
	oFF.QInADrillPathElement.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var drillManager = parentComponent;
		var queryModel = drillManager.getContext().getQueryModel();
		var fieldName = inaStructure.getStringByKey("FieldName");
		var dimensionName = inaStructure.getStringByKey("DimensionName");
		var dimension;
		var field;
		var element;
		var member;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(dimensionName)) {
			dimension = queryModel
					.getDimensionByNameFromExistingMetadata(dimensionName);
		} else {
			field = queryModel.getFieldByNameOrAlias(fieldName);
			if (oFF.isNull(field)) {
				dimension = queryModel
						.getDimensionByNameFromExistingMetadata(fieldName);
				if (oFF.notNull(dimension)) {
					field = dimension.getKeyField();
					fieldName = field.getName();
				}
			} else {
				dimension = field.getDimension();
			}
		}
		element = oFF.QDrillPathElement._create(context);
		element.setDimension(dimension);
		member = inaStructure.getStringByKey("Member");
		element.setName(member);
		element.setFieldName(fieldName);
		return element;
	};
	oFF.QInADrillPathElement.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var element = modelComponent;
		var name = element.getName();
		var isNameNull;
		var dimension;
		if (oFF.QImExFlag.DRILL_CONTEXT === oFF.XMath.binaryAnd(flags,
				oFF.QImExFlag.DRILL_CONTEXT)) {
			isNameNull = oFF.isNull(name);
		} else {
			isNameNull = oFF.XStringUtils.isNullOrEmpty(name);
		}
		if (isNameNull) {
			inaStructure.putNull("Member");
		} else {
			inaStructure.putString("Member", name);
		}
		inaStructure.putString("FieldName", element.getFieldName());
		if (exporter.mode === oFF.QModelFormat.INA_REPOSITORY) {
			dimension = element.getDimension();
			oFF.QInAExportUtil.setNameIfNotNull(inaStructure, "DimensionName",
					dimension);
		}
		return inaStructure;
	};
	oFF.QInADrillPathOperation = function() {
	};
	oFF.QInADrillPathOperation.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInADrillPathOperation.prototype.getComponentType = function() {
		return oFF.OlapComponentType.DRILL_OPERATION;
	};
	oFF.QInADrillPathOperation.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var drillManager = parentComponent;
		var drillState = inaStructure.getStringByKey("DrillState");
		var drillMember = inaStructure.getStructureByKey("DrillMember");
		var drillPath;
		var drillContext;
		var size;
		var idxHierCtx;
		var drillCtx;
		var drillPathElement;
		var drillPathElementMember;
		var drillOperation;
		var level;
		if (oFF.isNull(drillMember) || oFF.isNull(drillState)) {
			return null;
		}
		drillPath = oFF.XList.create();
		drillContext = inaStructure.getListByKey("DrillContextMembers");
		if (oFF.notNull(drillContext)) {
			size = drillContext.size();
			for (idxHierCtx = 0; idxHierCtx < size; idxHierCtx++) {
				drillCtx = drillContext.getStructureAt(idxHierCtx);
				drillPathElement = importer.importDrillPathElement(drillCtx,
						drillManager, context);
				drillPath.add(drillPathElement);
			}
		}
		drillPathElementMember = importer.importDrillPathElement(drillMember,
				drillManager, context);
		drillPath.add(drillPathElementMember);
		drillOperation = drillManager.setDrillState(drillPath,
				oFF.QInAConverter.lookupDrillStateOp(drillState));
		level = inaStructure.getIntegerByKeyExt("DrillLevel", 1);
		drillOperation.setRelativeLevelCount(level);
		return drillOperation;
	};
	oFF.QInADrillPathOperation.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var operation = modelComponent;
		var inADrillState;
		var relativeLevelCount;
		var drillPath;
		var drillPathCount;
		var element;
		var inaPathElement;
		var inaDrillContextMembers;
		var k;
		if (operation.getType() === oFF.DrillOperationType.CONTEXT) {
			inADrillState = oFF.QInAConverter.lookupDrillStateInA(operation
					.getDrillState());
			inaStructure.putString("DrillState", inADrillState);
			relativeLevelCount = operation.getRelativeLevelCount();
			if (relativeLevelCount !== 1) {
				inaStructure.putInteger("DrillLevel", relativeLevelCount);
			}
			if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA)) {
				if (operation.getDrillManager().supportsDrillCounter()) {
					inaStructure.putInteger("HierarchyNavigationCounter",
							operation.getDrillCounter());
				}
			}
			drillPath = operation.getDrillPath();
			drillPathCount = drillPath.size();
			if (drillPathCount > 0) {
				element = drillPath.get(drillPathCount - 1);
				inaPathElement = exporter.exportDrillPathElement(element, true);
				inaStructure.put("DrillMember", inaPathElement);
				if (drillPathCount > 1) {
					inaDrillContextMembers = oFF.PrFactory.createList();
					inaStructure.put("DrillContextMembers",
							inaDrillContextMembers);
					for (k = 0; k < drillPathCount - 1; k++) {
						element = drillPath.get(k);
						inaPathElement = exporter.exportDrillPathElement(
								element, false);
						inaDrillContextMembers.add(inaPathElement);
					}
				}
			}
		}
		return inaStructure;
	};
	oFF.QInAExceptions = function() {
	};
	oFF.QInAExceptions.prototype = new oFF.QInAComponentWithList();
	oFF.QInAExceptions.getField = function(member, fieldName) {
		var someField = member.getQueryModel().getFieldByName(fieldName);
		var dimensionByName;
		if (oFF.isNull(someField)) {
			dimensionByName = member.getQueryModel()
					.getDimensionByNameFromExistingMetadata(fieldName);
			if (oFF.notNull(dimensionByName)) {
				someField = dimensionByName.getKeyField();
			}
		}
		if (oFF.isNull(someField)) {
			someField = member.getKeyFieldValue().getField();
		}
		return someField;
	};
	oFF.QInAExceptions.importEvaluates = function(inaException, member,
			newException, importer) {
		var inaEvaluates = inaException.getListByKey("EvaluateOn");
		var size;
		var evalIdx;
		var inaEvaluate;
		var fieldName;
		var someField;
		var valueType;
		var lowValue;
		var newEvaluate;
		var highValue;
		var operatorName;
		var operator;
		if (oFF.isNull(inaEvaluates)) {
			return;
		}
		size = inaEvaluates.size();
		for (evalIdx = 0; evalIdx < size; evalIdx++) {
			inaEvaluate = inaEvaluates.getStructureAt(evalIdx);
			fieldName = inaEvaluate.getStringByKey("Name");
			someField = oFF.QInAExceptions.getField(member, fieldName);
			if (oFF.isNull(someField)) {
				importer.addError(oFF.ErrorCodes.INVALID_TOKEN,
						oFF.XStringUtils.concatenate3("Could not find field '",
								fieldName, "'!"));
				return;
			}
			if (!inaEvaluate.containsKey("Low")) {
				importer.addError(oFF.ErrorCodes.INVALID_PARAMETER,
						oFF.XStringUtils.concatenate2(
								"No low value for field: ", fieldName));
				return;
			}
			valueType = someField.getValueType();
			lowValue = oFF.QInAValueUtils.importValueByType(importer,
					inaEvaluate, "Low", valueType);
			if (importer.hasErrors()) {
				importer.addError(oFF.ErrorCodes.INVALID_DATATYPE,
						oFF.XStringUtils.concatenate2(
								"Unexpected low valuetype for field: ",
								valueType.getName()));
				return;
			}
			newEvaluate = newException.addNewEvaluateWithField(someField,
					lowValue);
			if (inaEvaluate.containsKey("High")) {
				highValue = oFF.QInAValueUtils.importValueByType(importer,
						inaEvaluate, "High", valueType);
				if (importer.hasErrors()) {
					importer.addError(oFF.ErrorCodes.INVALID_DATATYPE,
							oFF.XStringUtils.concatenate2(
									"Unexpected high valuetype for field: ",
									valueType.getName()));
					return;
				}
				newEvaluate.setHighValue(highValue);
			}
			newEvaluate.setEvaluate(oFF.QExceptionEvalType
					.lookupExceptionEvalType(inaEvaluate
							.getStringByKey("Evaluate")));
			operatorName = inaEvaluate.getStringByKey("Comparison");
			operator = oFF.QInAConverter.lookupComparison(operatorName);
			if (oFF.isNull(operator)) {
				importer
						.addError(
								oFF.ErrorCodes.INVALID_OPERATOR,
								oFF.XStringUtils
										.concatenate3(
												"Unexpected comparison operator for evaluate: Operator: '",
												operatorName, "'"));
				return;
			}
			newEvaluate.setOperator(operator);
		}
	};
	oFF.QInAExceptions.importThresholds = function(inaException, newException) {
		var inaThresholds = inaException.getListByKey("Threshold");
		var size;
		var thresholdIdx;
		var inaThreshold;
		var alertLevel;
		var newThreshold;
		var isDouble;
		var operator;
		var highDouble;
		var highString;
		if (oFF.notNull(inaThresholds)) {
			size = inaThresholds.size();
			for (thresholdIdx = 0; thresholdIdx < size; thresholdIdx++) {
				inaThreshold = inaThresholds.getStructureAt(thresholdIdx);
				alertLevel = inaThreshold.getIntegerByKeyExt("AlertLevel",
						-9999);
				isDouble = !inaThreshold.hasStringByKey("Low");
				if (isDouble) {
					newThreshold = newException.addNewThreshold(inaThreshold
							.getDoubleByKey("Low"), oFF.QInAConverter
							.lookupAlertLevel(alertLevel));
				} else {
					newThreshold = newException.addNewThresholdWithString(
							inaThreshold.getStringByKey("Low"),
							oFF.QInAConverter.lookupAlertLevel(alertLevel));
				}
				operator = oFF.QInAConverter.lookupComparison(inaThreshold
						.getStringByKey("Comparison"));
				newThreshold.setOperator(operator);
				if (operator.getNumberOfParameters() === 2) {
					if (isDouble) {
						highDouble = inaThreshold.getDoubleByKey("High");
						newThreshold.setHighValue(highDouble);
					} else {
						highString = inaThreshold.getStringByKey("High");
						newThreshold.setHigh(highString);
					}
				}
				oFF.QInAExceptions.importSettings(inaThreshold
						.getListByKey("Settings"), newThreshold);
			}
		}
	};
	oFF.QInAExceptions.importSettings = function(inaSettings, newThreshold) {
		var size;
		var iSetting;
		var inaSetting;
		var name;
		var priority;
		var value;
		var newSetting;
		if (oFF.isNull(inaSettings)) {
			return;
		}
		size = inaSettings.size();
		for (iSetting = 0; iSetting < size; iSetting++) {
			inaSetting = inaSettings.getStructureAt(iSetting);
			name = inaSetting.getStringByKey("Name");
			priority = inaSetting.getIntegerByKey("Priority");
			value = inaSetting.getStringByKey("Value");
			if (oFF.notNull(value) && !oFF.XString.isEqual(value, "")) {
				newSetting = newThreshold.addNewSetting(name, priority);
				newSetting.setValue(value);
			}
		}
	};
	oFF.QInAExceptions.exportStructureContextItem = function(structureContext,
			member, exception) {
		var structure;
		var dimension;
		var memberForDisplay;
		if (oFF.notNull(member)) {
			structure = structureContext.addNewStructure();
			dimension = member.getDimension();
			structure.putString("DimensionName", dimension.getName());
			structure.putString("MemberName", member.getName());
			if (exception.isEvaluateAllMembers(dimension)) {
				structure.putBoolean("EvaluateAllMembers", true);
			}
			memberForDisplay = exception.getDisplayOnOtherMember(member);
			oFF.QInAExportUtil.setNameIfNotNull(structure,
					"DisplayOnOtherMember", memberForDisplay);
		}
	};
	oFF.QInAExceptions.exportEvaluates = function(exception, exporter,
			inaStructure, isBw) {
		var inaEvaluatesList;
		var sizeEvaluates;
		var iEvaluate;
		var inaEvaluateStruct;
		var evaluate;
		var comparisonOperator;
		var comparison;
		if (exception.getEvaluates().isEmpty()) {
			return;
		}
		inaEvaluatesList = inaStructure.putNewList("EvaluateOn");
		sizeEvaluates = exception.getEvaluates().size();
		for (iEvaluate = 0; iEvaluate < sizeEvaluates; iEvaluate++) {
			inaEvaluateStruct = inaEvaluatesList.addNewStructure();
			evaluate = exception.getEvaluates().get(iEvaluate);
			inaEvaluateStruct.putString("Name", evaluate.getField().getName());
			inaEvaluateStruct.putString("Evaluate", evaluate.getEvaluate()
					.toString());
			comparisonOperator = evaluate.getOperator();
			if (comparisonOperator === oFF.ComparisonOperator.NOT_BETWEEN
					&& isBw) {
				comparison = "NOTBETWEEN";
			} else {
				comparison = oFF.QInAConverter
						.lookupComparisonInA(comparisonOperator);
			}
			inaEvaluateStruct.putString("Comparison", comparison);
			oFF.QInAValueUtils.exportValue(exporter, "Low", inaEvaluateStruct,
					evaluate.getLowValue(), evaluate.getValueType());
			if (comparisonOperator.getNumberOfParameters() > 1) {
				oFF.QInAValueUtils.exportValue(exporter, "High",
						inaEvaluateStruct, evaluate.getHighValue(), evaluate
								.getValueType());
			}
		}
	};
	oFF.QInAExceptions.exportThresholds = function(thresholds, exporter,
			inaStructure, isBw) {
		var inaThresholdsList = inaStructure.putNewList("Threshold");
		var sizeThresholds = thresholds.size();
		var iThreshold;
		var threshold;
		var inaThresholdStruct;
		var comparisonOperator;
		var comparison;
		var isDouble;
		for (iThreshold = 0; iThreshold < sizeThresholds; iThreshold++) {
			threshold = thresholds.get(iThreshold);
			inaThresholdStruct = inaThresholdsList.addNewStructure();
			comparisonOperator = threshold.getOperator();
			if (comparisonOperator === oFF.ComparisonOperator.NOT_BETWEEN
					&& isBw) {
				comparison = "NOTBETWEEN";
			} else {
				comparison = oFF.QInAConverter
						.lookupComparisonInA(comparisonOperator);
			}
			inaThresholdStruct.putString("Comparison", comparison);
			isDouble = threshold.getValueType() === oFF.XValueType.DOUBLE;
			if (threshold.getLowXValue() !== null) {
				if (isDouble) {
					inaThresholdStruct
							.putDouble("Low", threshold.getLowValue());
				} else {
					inaThresholdStruct.putString("Low", threshold.getLow());
				}
			}
			if (threshold.getHighXValue() !== null
					&& comparisonOperator.getNumberOfParameters() > 1) {
				if (isDouble) {
					inaThresholdStruct.putDouble("High", threshold
							.getHighValue());
				} else {
					inaThresholdStruct.putString("High", threshold.getHigh());
				}
			}
			if (!threshold.isEmpty()) {
				oFF.QInAExceptions.exportSettings(threshold, exporter,
						inaThresholdStruct);
			} else {
				inaThresholdStruct.putInteger("AlertLevel", threshold
						.getAlertLevel().getLevel());
			}
		}
	};
	oFF.QInAExceptions.exportSettings = function(threshold, exporter,
			inaThresholdStruct) {
		var inaSettings = inaThresholdStruct.putNewList("Settings");
		var size = threshold.size();
		var iSetting;
		var setting;
		var inaSetting;
		var value;
		for (iSetting = 0; iSetting < size; iSetting++) {
			setting = threshold.get(iSetting);
			inaSetting = inaSettings.addNewStructure();
			inaSetting.putString("Name", setting.getName());
			inaSetting.putInteger("Priority", setting.getPriority());
			value = setting.getValue();
			if (oFF.isNull(value) || oFF.XString.isEqual(value, "")) {
				exporter.addError(oFF.ErrorCodes.INVALID_PARAMETER,
						"Exception Threshold Setting is missing it's value");
			} else {
				inaSetting.putString("Value", value);
			}
		}
	};
	oFF.QInAExceptions.prototype.getComponentType = function() {
		return oFF.OlapComponentType.EXCEPTION_MANAGER;
	};
	oFF.QInAExceptions.prototype.getTagName = function() {
		return "Exceptions";
	};
	oFF.QInAExceptions.prototype.isVersion1 = function(qInA, modelComponent) {
		var componentType = modelComponent.getOlapComponentType();
		return !qInA.supportsExceptionsV2
				&& componentType.isTypeOf(oFF.MemberType.ABSTRACT_MEMBER);
	};
	oFF.QInAExceptions.prototype.isVersion2 = function(qInA, modelComponent) {
		var componentType = modelComponent.getOlapComponentType();
		return qInA.supportsExceptionsV2
				&& componentType.isTypeOf(oFF.OlapComponentType.QUERY_MODEL);
	};
	oFF.QInAExceptions.prototype.importComponentWithList = function(importer,
			inaList, modelComponent, parentComponent, context) {
		var exceptionManager = modelComponent.getQueryModel()
				.getExceptionManager();
		if (this.isVersion1(importer, modelComponent)) {
			exceptionManager.removeAllExceptionsOfMeasure(modelComponent);
			this.importFormatV1(importer, inaList, modelComponent);
		} else {
			if (this.isVersion2(importer, modelComponent)) {
				exceptionManager.clear();
				this.importFormatV2(importer, inaList, modelComponent);
			}
		}
		return exceptionManager;
	};
	oFF.QInAExceptions.prototype.importFormatV1 = function(importer, inaList,
			member) {
		var size;
		var exceptionIdx;
		var inaException;
		var exception;
		if (oFF.notNull(inaList)) {
			size = inaList.size();
			for (exceptionIdx = 0; exceptionIdx < size; exceptionIdx++) {
				inaException = inaList.getStructureAt(exceptionIdx);
				exception = this
						.importException(importer, member, inaException);
				exception.setMeasure(member);
				exception.setIsChangeable(inaException.getBooleanByKeyExt(
						"Changegable", true));
			}
		}
	};
	oFF.QInAExceptions.prototype.importException = function(importer, member,
			inaException) {
		var exceptionManager = member.getQueryModel().getExceptionManager();
		var newException = exceptionManager.newException(inaException
				.getStringByKey("Name"), inaException.getStringByKey("Text"));
		var exceptionIsActive;
		var isBeforePostAggregation;
		newException.setEvaluateDefault(oFF.QExceptionEvalType
				.lookupExceptionEvalType(inaException
						.getStringByKey("EvaluateDefault")));
		newException.setHeaderSettingBase(oFF.QExceptionHeaderSettings
				.lookupExceptionHeaderSetting(inaException
						.getStringByKey("ApplySettingsToHeader")));
		exceptionIsActive = inaException.getBooleanByKeyExt("Active", true);
		newException.setActive(exceptionIsActive);
		isBeforePostAggregation = inaException.getBooleanByKeyExt(
				"EvaluateBeforePostAggregation", true);
		newException.setEvaluationAfterCalculations(!isBeforePostAggregation);
		oFF.QInAExceptions.importEvaluates(inaException, member, newException,
				importer);
		oFF.QInAExceptions.importThresholds(inaException, newException);
		exceptionManager.add(newException);
		return newException;
	};
	oFF.QInAExceptions.prototype.importFormatV2 = function(importer, inaList,
			queryModel) {
		var sizeExceptions;
		var iException;
		var inaException;
		var structureContext;
		var exception;
		if (oFF.isNull(inaList)) {
			return;
		}
		sizeExceptions = inaList.size();
		for (iException = 0; iException < sizeExceptions; iException++) {
			inaException = inaList.getStructureAt(iException);
			structureContext = inaException.getListByKey("StructureContext");
			if (!oFF.PrUtils.isListEmpty(structureContext)) {
				exception = this.importContextItem(structureContext
						.getStructureAt(0), queryModel, null, importer,
						inaException);
				if (oFF.notNull(exception)) {
					if (structureContext.size() > 1) {
						this.importContextItem(structureContext
								.getStructureAt(1), queryModel, exception,
								importer, inaException);
					}
					exception.setIsChangeable(inaException.getBooleanByKeyExt(
							"Changegable", true));
				}
			}
		}
	};
	oFF.QInAExceptions.prototype.importContextItem = function(structure,
			queryModel, exception, importer, inaException) {
		var importedException = exception;
		var dimension = queryModel
				.getDimensionByNameFromExistingMetadata(structure
						.getStringByKey("DimensionName"));
		var member;
		if (oFF.notNull(dimension)) {
			member = this.getMemberFromContextItem(structure, dimension);
			if (oFF.notNull(member)) {
				if (oFF.isNull(importedException)) {
					importedException = this.importException(importer, member,
							inaException);
				}
				if (dimension.isMeasureStructure()) {
					importedException.setMeasure(member);
				} else {
					importedException.setStructure(member);
				}
				importedException.displayOnOtherMember(member, dimension
						.getStructureMember(structure
								.getStringByKey("DisplayOnOtherMember")));
				importedException.setEvaluateAllMembers(dimension, structure
						.getBooleanByKeyExt("EvaluateAllMembers", false));
			}
		}
		return importedException;
	};
	oFF.QInAExceptions.prototype.getMemberFromContextItem = function(structure,
			dimension) {
		var member = dimension.getStructureMember(structure
				.getStringByKey("MemberName"));
		var evaluateAllMembers;
		var allStructureMembers;
		if (oFF.isNull(member)) {
			evaluateAllMembers = structure.getBooleanByKeyExt(
					"EvaluateAllMembers", false);
			allStructureMembers = dimension.getAllStructureMembers();
			if (evaluateAllMembers && !allStructureMembers.isEmpty()) {
				return allStructureMembers.get(0);
			}
		}
		return member;
	};
	oFF.QInAExceptions.prototype.exportComponentWithList = function(exporter,
			modelComponent, flags) {
		if (this.isVersion1(exporter, modelComponent)) {
			return this.exportFormatV1(exporter, modelComponent);
		} else {
			if (this.isVersion2(exporter, modelComponent)) {
				return this.exportFormatV2(exporter, modelComponent);
			}
		}
		return null;
	};
	oFF.QInAExceptions.prototype.exportFormatV1 = function(exporter,
			structureMember) {
		var inaExceptionsList = null;
		var exceptions = structureMember.getExceptions();
		var sizeExceptions = exceptions.size();
		var isBw;
		var iException;
		var exception;
		var structure;
		if (sizeExceptions > 0) {
			inaExceptionsList = oFF.PrFactory.createList();
			isBw = exporter.isAbap(structureMember.getQueryModel());
			for (iException = 0; iException < sizeExceptions; iException++) {
				exception = exceptions.get(iException);
				structure = this.exportException(exporter, exception, isBw);
				if (oFF.isNull(structure)) {
					break;
				}
				inaExceptionsList.add(structure);
			}
		}
		return inaExceptionsList;
	};
	oFF.QInAExceptions.prototype.exportException = function(exporter,
			exception, isBw) {
		var inaExceptionStruct = oFF.PrFactory.createStructure();
		var thresholds;
		var headerSetting;
		if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
			inaExceptionStruct.putBoolean("Active", exception.isActive());
			inaExceptionStruct.putBoolean("EvaluateBeforePostAggregation",
					!exception.isEvaluatedAfterCalculations());
			inaExceptionStruct.putBoolean("Changegable", exception
					.isChangeable());
		} else {
			if (isBw) {
				inaExceptionStruct.putBoolean("Active", exception.isActive());
			} else {
				if (!exception.isActive()) {
					exporter.addWarning(
							oFF.ErrorCodes.IMPORT_EXCEPTION_INACTIVE,
							oFF.XStringUtils.concatenate3("Exception '",
									exception.getName(), "' is inactive."));
					return null;
				}
			}
		}
		thresholds = exception.getThresholds();
		if (thresholds.isEmpty()
				&& !exporter.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
			exporter.addWarning(oFF.ErrorCodes.IMPORT_EXCEPTION_NO_THRESHOLDS,
					oFF.XStringUtils.concatenate3("Exception '", exception
							.getName(), "' has no threshold."));
			return null;
		}
		oFF.QInAExceptions.exportThresholds(thresholds, exporter,
				inaExceptionStruct, isBw);
		oFF.QInAExceptions.exportEvaluates(exception, exporter,
				inaExceptionStruct, isBw);
		inaExceptionStruct.putString("Name", exception.getName());
		if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY) || isBw) {
			inaExceptionStruct.putString("Text", exception.getText());
		}
		headerSetting = exception.getHeaderSetting();
		if (headerSetting !== oFF.QExceptionHeaderSettings.NONE) {
			inaExceptionStruct.putString("ApplySettingsToHeader", headerSetting
					.getName());
		}
		inaExceptionStruct.putString("EvaluateDefault", exception
				.getEvaluateDefault().toString());
		return inaExceptionStruct;
	};
	oFF.QInAExceptions.prototype.exportFormatV2 = function(exporter, queryModel) {
		var exceptionManager = queryModel.getExceptionManager();
		var size = exceptionManager.size();
		var exceptions;
		var isBw;
		var i;
		var exception;
		var inaException;
		var structureContext;
		if (size === 0) {
			return null;
		}
		exceptions = oFF.PrFactory.createList();
		isBw = exporter.isAbap(queryModel);
		for (i = 0; i < size; i++) {
			exception = exceptionManager.get(i);
			inaException = this.getExportedExceptionStructureByName(exceptions,
					exception.getName());
			if (oFF.isNull(inaException)) {
				inaException = this.exportException(exporter, exception, isBw);
				if (oFF.isNull(inaException)) {
					break;
				}
				inaException.putNewList("StructureContext");
				exceptions.add(inaException);
			}
			structureContext = inaException.getListByKey("StructureContext");
			oFF.QInAExceptions.exportStructureContextItem(structureContext,
					exception.getMeasure(), exception);
			oFF.QInAExceptions.exportStructureContextItem(structureContext,
					exception.getStructure(), exception);
		}
		return exceptions;
	};
	oFF.QInAExceptions.prototype.getExportedExceptionStructureByName = function(
			exceptions, exceptionName) {
		var size = exceptions.size();
		var i;
		var inaStructure;
		for (i = 0; i < size; i++) {
			inaStructure = exceptions.getStructureAt(i);
			if (oFF.XString.isEqual(inaStructure.getStringByKey("Name"),
					exceptionName)) {
				return inaStructure;
			}
		}
		return null;
	};
	oFF.QInAField = function() {
	};
	oFF.QInAField.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAField.prototype.getComponentType = function() {
		return oFF.OlapComponentType.FIELD;
	};
	oFF.QInAField.prototype.importComponentWithStructure = function(importer,
			inaStructure, modelComponent, parentComponent, context) {
		var field = context.getFieldAccessorSingle().getFieldByName(
				inaStructure.getStringByKey("Name"));
		var inaTextTransformation;
		if (oFF.isNull(field)) {
			return null;
		}
		inaTextTransformation = inaStructure
				.getStringByKey("TextTransformation");
		if (oFF.notNull(inaTextTransformation)) {
			field.setTextTransformation(oFF.QInAConverter
					.lookupTextTransformation(inaTextTransformation));
		}
		field.setDisplayFormat(inaStructure.getStringByKey("DisplayFormat"));
		return field;
	};
	oFF.QInAField.prototype.exportComponentWithStructure = function(exporter,
			modelComponent, inaStructure, flags) {
		var field = modelComponent;
		var obtainabilityType = field.getObtainability();
		var hide = oFF.XMath.binaryAnd(flags, oFF.QImExFlag.HIDE) > 0
				|| oFF.notNull(obtainabilityType)
				&& obtainabilityType !== oFF.ObtainabilityType.ALWAYS;
		var textTransformationType;
		var direction;
		var dimension;
		inaStructure.putString("Name", field.getName());
		if (!exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA_BLENDING_SOURCE)) {
			inaStructure.putStringNotNull("DisplayFormat", field
					.getDisplayFormat());
		}
		textTransformationType = field.getTextTransformation();
		if (oFF.notNull(textTransformationType)) {
			inaStructure.putString("TextTransformation", oFF.QInAConverter
					.lookupTextTransformationInA(textTransformationType));
		}
		if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA)
				|| exporter.mode === oFF.QModelFormat.INA_VALUE_HELP) {
			if (!exporter.supportsExtendedSort
					&& !exporter.isVirtualInA(field.getQueryModel())) {
				if (exporter.modelContext === oFF.QContextType.SELECTOR) {
					if (field.isEqualTo(field.getDimension()
							.getSelectorKeyField())) {
						direction = field.getDimension().getSelectorOrder();
						inaStructure.putInteger("SortOrder", oFF.QInAConverter
								.lookupSortDirectionInA(direction));
					} else {
						inaStructure.putInteger("SortOrder", 0);
					}
				} else {
					if (field.hasSorting()) {
						direction = field.getResultSetSorting().getDirection();
						inaStructure.putInteger("SortOrder", oFF.QInAConverter
								.lookupSortDirectionInA(direction));
					} else {
						if (field.getDimension().hasSorting()) {
							dimension = field.getDimension();
							direction = dimension.getResultSetSorting()
									.getDirection();
							inaStructure.putInteger("SortOrder",
									oFF.QInAConverter
											.lookupSortDirectionInA(direction));
						} else {
							inaStructure.putInteger("SortOrder", 0);
						}
					}
				}
			}
			if (hide) {
				inaStructure.putString("Obtainability", "UserInterface");
			} else {
				inaStructure.putString("Obtainability", "Always");
			}
		}
		if (exporter.isVirtualInA(field.getQueryModel())) {
			inaStructure.putBoolean("IsKey", field.isKeyField());
		}
		return inaStructure;
	};
	oFF.QInAFilter = function() {
	};
	oFF.QInAFilter.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAFilter.mergeAndExportFilterStateList = function(exporter,
			filterStateList) {
		var mergedStructure = null;
		var selectionSize = filterStateList.size();
		var exportedFilters;
		var i;
		var currentFilterStructureElement;
		var exportedSize;
		var mergedSelectionStructure;
		var inaLogicalOperator;
		var mergedSubSelections;
		var j;
		var exportedFilterSelection;
		if (selectionSize > 0) {
			if (selectionSize > 1) {
				exportedFilters = oFF.XList.create();
				for (i = 0; i < selectionSize; i++) {
					currentFilterStructureElement = exporter
							.exportFilterExpression(filterStateList.get(i));
					if (oFF.notNull(currentFilterStructureElement)) {
						exportedFilters.add(currentFilterStructureElement);
					}
				}
				exportedSize = exportedFilters.size();
				if (exportedSize > 0) {
					if (exportedSize > 1) {
						mergedStructure = oFF.PrFactory.createStructure();
						mergedSelectionStructure = mergedStructure
								.putNewStructure("Selection");
						inaLogicalOperator = mergedSelectionStructure
								.putNewStructure("Operator");
						inaLogicalOperator.putString("Code", "And");
						mergedSubSelections = inaLogicalOperator
								.putNewList("SubSelections");
						for (j = 0; j < exportedSize; j++) {
							exportedFilterSelection = exportedFilters.get(j)
									.getStructureByKey("Selection");
							if (oFF.notNull(exportedFilterSelection)) {
								mergedSubSelections
										.add(exportedFilterSelection);
							}
						}
					} else {
						mergedStructure = exportedFilters.get(0);
					}
				}
			} else {
				mergedStructure = exporter
						.exportFilterExpression(filterStateList.get(0));
			}
		}
		return mergedStructure;
	};
	oFF.QInAFilter.prototype.exportFilter = function(exporter, filter,
			filterExpressionState, layeredFilter, tmpFilter) {
		var filterExpressionExternal;
		var effectiveSelectionContainer;
		var effSelectContainerStructure;
		var selectionList;
		var layeredFilters;
		var filterLayer;
		if (!exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA)) {
			return exporter.exportFilterExpression(filterExpressionState);
		}
		if (layeredFilter.size() === 1) {
			filterExpressionExternal = layeredFilter.getIterator().next();
			if (oFF.notNull(filterExpressionExternal)
					&& filterExpressionExternal.supportsOnlyCartesianProduct()) {
				effectiveSelectionContainer = filter.getEffectiveFilter();
				effSelectContainerStructure = exporter
						.exportFilterExpression(effectiveSelectionContainer);
				if (oFF.notNull(effSelectContainerStructure)) {
					return effSelectContainerStructure;
				}
			}
		}
		selectionList = oFF.XList.create();
		if (this.isValidFilterExpression(filterExpressionState)) {
			selectionList.add(filterExpressionState);
		}
		layeredFilters = layeredFilter.getIterator();
		while (layeredFilters.hasNext()) {
			filterLayer = layeredFilters.next();
			if (this.isValidFilterExpression(filterLayer)) {
				selectionList.add(filterLayer);
			}
		}
		if (this.isValidFilterExpression(tmpFilter)) {
			selectionList.add(tmpFilter);
		}
		return oFF.QInAFilter.mergeAndExportFilterStateList(exporter,
				selectionList);
	};
	oFF.QInAFilter.prototype.isValidFilterExpression = function(
			filterExpressionState) {
		return oFF.notNull(filterExpressionState)
				&& filterExpressionState.isAll();
	};
	oFF.QInAFilterAlgebra = function() {
	};
	oFF.QInAFilterAlgebra.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAFilterAlgebra.prototype.getComponentType = function() {
		return oFF.FilterComponentType.BOOLEAN_ALGEBRA;
	};
	oFF.QInAFilterAlgebra.prototype.getTagName = function() {
		return "Operator";
	};
	oFF.QInAFilterAlgebra.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var filterExpression = parentComponent;
		var inaSubSelections = inaStructure.getListByKey("SubSelections");
		var code;
		var setWithChildren;
		var size;
		var i;
		var subSelection;
		var child;
		if (oFF.notNull(inaSubSelections)) {
			code = inaStructure.getStringByKey("Code");
			if (oFF.XString.isEqual(code, "And")) {
				setWithChildren = oFF.QFilterAnd._create(context,
						filterExpression);
			} else {
				if (oFF.XString.isEqual(code, "Not")) {
					setWithChildren = oFF.QFilterNot._create(context,
							filterExpression);
				} else {
					setWithChildren = oFF.QFilterOr._create(context,
							filterExpression);
				}
			}
			size = inaSubSelections.size();
			for (i = 0; i < size; i++) {
				subSelection = inaSubSelections.getStructureAt(i);
				child = importer.importFilterElement(subSelection, null,
						filterExpression, context);
				if (oFF.notNull(child)) {
					setWithChildren.add(child);
				}
			}
			if (setWithChildren.hasElements()) {
				return setWithChildren;
			}
		}
		return null;
	};
	oFF.QInAFilterAlgebra.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var logicalContainer = modelComponent;
		var size = logicalContainer.size();
		var inaSubSelections;
		var i;
		var qCurrentComponent;
		var inaChildElement;
		var type;
		if (size === 0) {
			return null;
		}
		inaSubSelections = oFF.PrFactory.createList();
		for (i = 0; i < size; i++) {
			qCurrentComponent = logicalContainer.get(i);
			if (qCurrentComponent.getOlapComponentType() === oFF.FilterComponentType.TUPLE) {
				inaChildElement = exporter.exportFilterTuple(qCurrentComponent);
			} else {
				inaChildElement = exporter
						.exportFilterElement(qCurrentComponent);
			}
			if (oFF.notNull(inaChildElement) && inaChildElement.hasElements()) {
				inaSubSelections.add(inaChildElement);
			}
		}
		if (!inaSubSelections.hasElements()) {
			return null;
		}
		inaStructure.put("SubSelections", inaSubSelections);
		type = logicalContainer.getComponentType();
		if (type.isTypeOf(oFF.FilterComponentType.AND)) {
			inaStructure.putString("Code", "And");
		} else {
			if (type.isTypeOf(oFF.FilterComponentType.OR)) {
				inaStructure.putString("Code", "Or");
			} else {
				if (type.isTypeOf(oFF.FilterComponentType.NOT)) {
					inaStructure.putString("Code", "Not");
				}
			}
		}
		return inaStructure;
	};
	oFF.QInAFilterAll = function() {
	};
	oFF.QInAFilterAll.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAFilterAll.prototype.getComponentType = function() {
		return oFF.OlapComponentType.SELECTOR;
	};
	oFF.QInAFilterAll.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var filterComponent = modelComponent;
		importer.importFixedFilter(inaStructure, filterComponent, context);
		importer.importDynamicFilter(inaStructure, filterComponent, context);
		importer.importVisibilityFilter(inaStructure, filterComponent, context);
		return filterComponent;
	};
	oFF.QInAFilterAll.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var filter = modelComponent;
		if (filter.getQueryModel().isExportingFixedFilter()) {
			exporter.exportFixedFilter(filter, inaStructure);
		}
		exporter.exportDynamicFilter(filter, inaStructure);
		exporter.exportVisibilityFilter(filter, inaStructure);
		return inaStructure;
	};
	oFF.QInAFilterCellValueOperand = function() {
	};
	oFF.QInAFilterCellValueOperand.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAFilterCellValueOperand.prototype.getComponentType = function() {
		return oFF.OlapComponentType.FILTER_CELL_VALUE_OPERAND;
	};
	oFF.QInAFilterCellValueOperand.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var low = inaStructure.getStringByKey("Low");
		var high;
		var operator;
		var operand;
		if (oFF.XString.isEqual(low, "")) {
			low = null;
		}
		high = inaStructure.getStringByKey("High");
		if (oFF.XString.isEqual(high, "")) {
			high = null;
		}
		operator = oFF.QInAConverter.lookupComparison(inaStructure
				.getStringByKey("Comparison"));
		operand = oFF.QFilterCellValueOperand._create(context, null, low, high,
				operator);
		operand.setIsExcluding(inaStructure.getBooleanByKey("IsExcluding"));
		return operand;
	};
	oFF.QInAFilterCellValueOperand.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var cellValueOperand = modelComponent;
		var comparisonOperator;
		var lowValue;
		var highValue;
		inaStructure.putBoolean("IsExcluding", cellValueOperand.isExcluding());
		comparisonOperator = cellValueOperand.getComparisonOperator();
		inaStructure.putString("Comparison", oFF.QInAConverter
				.lookupComparisonInA(comparisonOperator));
		lowValue = cellValueOperand.getLow();
		inaStructure.putString("Low", lowValue);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(lowValue)
				&& cellValueOperand.isLowVariable()) {
			inaStructure.putString("LowIs", "Variable");
		}
		if (comparisonOperator.getNumberOfParameters() === 2) {
			highValue = cellValueOperand.getHigh();
			inaStructure.putString("High", highValue);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(highValue)
					&& cellValueOperand.isHighVariable()) {
				inaStructure.putString("HighIs", "Variable");
			}
		}
		return inaStructure;
	};
	oFF.QInAFilterElement = function() {
	};
	oFF.QInAFilterElement.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAFilterElement.prototype.getComponentType = function() {
		return oFF.OlapComponentType.FILTER_ELEMENT;
	};
	oFF.QInAFilterElement.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var filterExpression = parentComponent;
		var filterElement = modelComponent;
		var inaSetOperand;
		if (inaStructure.containsKey("Operator")) {
			filterElement = importer.importFilterAlgebra(filterExpression,
					inaStructure, context);
		} else {
			inaSetOperand = inaStructure.getStructureByKey("SetOperand");
			if (oFF.isNull(inaSetOperand)) {
				if (inaStructure.containsKey("MemberOperand")) {
					filterElement = importer.importFilterMemberOperand(
							filterExpression, inaStructure, context);
				} else {
					if (inaStructure.containsKey("GeometryOperand")) {
						filterElement = importer.importFilterGeo(
								filterExpression, inaStructure, context);
					}
				}
			} else {
				filterElement = importer.importCartesianList(inaSetOperand,
						filterElement, filterExpression, context);
			}
		}
		return filterElement;
	};
	oFF.QInAFilterElement.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var filterElement = modelComponent;
		var type = filterElement.getComponentType();
		var continueExport;
		var queryModel;
		var isReInitFlow;
		var filterOperation;
		var comparisonOperator;
		var inaInnerElement;
		var field;
		var hierarchyName;
		var inaHierarchy;
		var inaElementList;
		var inaOperation;
		var cellValueOperand;
		var elements;
		if (type.isTypeOf(oFF.FilterComponentType.BOOLEAN_ALGEBRA)) {
			if (type === oFF.FilterComponentType.CARTESIAN_LIST) {
				exporter.exportCartesianList(filterElement, inaStructure);
			} else {
				if (type === oFF.FilterComponentType.CARTESIAN_PRODUCT) {
					exporter.exportFilterCartesianProduct(filterElement,
							inaStructure);
				} else {
					continueExport = true;
					queryModel = filterElement.getQueryModel();
					isReInitFlow = oFF
							.notNull(exporter.variableProcessingDirective)
							&& oFF.XString.isEqual(
									exporter.variableProcessingDirective,
									"VariableDefinition");
					if (isReInitFlow
							&& queryModel.supportsComplexTupleFilter()
							&& this.supportsVariableMasking(queryModel)
							&& filterElement.getParent() !== null
							&& filterElement.getParent().getOlapComponentType() !== oFF.OlapComponentType.FILTER_EXPRESSION) {
						continueExport = false;
					}
					if (continueExport) {
						exporter.exportFilterAlgebra(filterElement,
								inaStructure);
					}
				}
			}
		} else {
			if (type.isTypeOf(oFF.FilterComponentType.OPERATION)) {
				filterOperation = filterElement;
				comparisonOperator = filterOperation.getComparisonOperator();
				if (oFF.notNull(comparisonOperator)) {
					if (comparisonOperator
							.isTypeOf(oFF.SpatialComparisonOperator._SPATIAL)) {
						exporter.exportFilterGeo(filterOperation, inaStructure);
					} else {
						if (exporter.supportsSetOperand) {
							inaInnerElement = oFF.PrFactory.createStructure();
							field = filterOperation.getField();
							if (oFF.notNull(field)) {
								inaInnerElement.putString("FieldName", field
										.getName());
								hierarchyName = filterOperation
										.getHierarchyName();
								if (oFF.notNull(hierarchyName)) {
									inaHierarchy = inaInnerElement
											.putNewStructure("Hierarchy");
									inaHierarchy.putString("Name",
											hierarchyName);
								}
								if (filterOperation.isConvertToFlatFilter()) {
									inaInnerElement.putBoolean(
											"ConvertToFlatSelection", true);
								}
								inaElementList = inaInnerElement
										.putNewList("Elements");
								inaOperation = inaElementList.addNewStructure();
								exporter.exportFilterOperation(filterOperation,
										inaOperation);
								if (oFF.notNull(inaStructure)) {
									inaStructure.put("SetOperand",
											inaInnerElement);
								}
							}
						} else {
							exporter.exportFilterMemberOperand(filterOperation,
									inaStructure);
						}
					}
				}
			} else {
				if (type
						.isTypeOf(oFF.OlapComponentType.FILTER_CELL_VALUE_OPERAND)) {
					cellValueOperand = oFF.PrStructure.create();
					elements = cellValueOperand.putNewList("Elements");
					elements
							.add(exporter.exportCellValueOperand(filterElement));
					inaStructure.put("CellValueOperand", cellValueOperand);
				}
			}
		}
		return inaStructure;
	};
	oFF.QInAFilterElement.prototype.supportsVariableMasking = function(
			queryModel) {
		var queryManager = queryModel.getQueryManager();
		return queryManager.getInaCapabilities().getActiveMainCapabilities()
				.containsKey(
						oFF.InactiveCapabilities.AV_CAPABILITY_VARIABLE_MASKING
								.getName());
	};
	oFF.QInAFilterExpression = function() {
	};
	oFF.QInAFilterExpression.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAFilterExpression.exportGlobalCellValueOperands = function(exporter,
			filterExpression) {
		var inaGlobalCellValueOperands = null;
		var inaElements;
		var nullSuppression;
		var cellValueOperands;
		var size;
		var i;
		var inaCellValueOperands;
		if (filterExpression.supportsCellValueOperands()) {
			inaElements = oFF.PrFactory.createList();
			if (filterExpression.isSuppressingNulls()) {
				nullSuppression = oFF.QFilterCellValueOperand
						.createForNullSuppression(
								filterExpression.getContext(), null);
				inaElements.add(exporter
						.exportCellValueOperand(nullSuppression));
			}
			cellValueOperands = filterExpression.getCellValueOperands();
			size = cellValueOperands.size();
			for (i = 0; i < size; i++) {
				inaElements.add(exporter
						.exportCellValueOperand(cellValueOperands.get(i)));
			}
			if (!inaElements.isEmpty()) {
				inaCellValueOperands = oFF.PrFactory.createStructure();
				inaCellValueOperands.put("Elements", inaElements);
				inaGlobalCellValueOperands = oFF.PrFactory.createStructure();
				inaGlobalCellValueOperands.put("CellValueOperand",
						inaCellValueOperands);
			}
		}
		return inaGlobalCellValueOperands;
	};
	oFF.QInAFilterExpression.combineSetOperandWithCellValueOperand = function(
			inaExpression, inaGlobalCellValueOperands) {
		var newInaSelection;
		var inaVisibilityFilter;
		var inaSelection;
		var inaOperator;
		var inaSubSelections;
		var inaSet;
		var newSetOperand;
		if (oFF.QInAFilterExpression
				.isCellOperandEmpty(inaGlobalCellValueOperands)
				&& !oFF.QInAFilterExpression.isSetOperandEmpty(inaExpression)) {
			return inaExpression;
		}
		if (!oFF.QInAFilterExpression
				.isCellOperandEmpty(inaGlobalCellValueOperands)
				&& oFF.QInAFilterExpression.isSetOperandEmpty(inaExpression)) {
			newInaSelection = oFF.PrFactory.createStructure();
			newInaSelection.put("Selection", inaGlobalCellValueOperands);
			return newInaSelection;
		}
		if (oFF.QInAFilterExpression
				.isCellOperandEmpty(inaGlobalCellValueOperands)
				&& oFF.QInAFilterExpression.isSetOperandEmpty(inaExpression)) {
			return null;
		}
		inaVisibilityFilter = oFF.PrFactory.createStructure();
		inaSelection = inaVisibilityFilter.putNewStructure("Selection");
		inaOperator = inaSelection.putNewStructure("Operator");
		inaOperator.putString("Code", "And");
		inaSubSelections = inaOperator.putNewList("SubSelections");
		inaSet = inaExpression.getStructureByKey("Selection");
		if (oFF.isNull(inaSet)) {
			newSetOperand = oFF.PrFactory.createStructure();
			newSetOperand.put("SetOperand", inaExpression);
			inaSubSelections.add(newSetOperand);
		} else {
			inaSubSelections.add(inaSet);
		}
		inaSubSelections.add(inaGlobalCellValueOperands);
		return inaVisibilityFilter;
	};
	oFF.QInAFilterExpression.isCellOperandEmpty = function(inaFilter) {
		var inaSelection;
		var inaCellOperand;
		if (oFF.notNull(inaFilter)) {
			inaSelection = inaFilter.getStructureByKey("Selection");
			if (oFF.isNull(inaSelection)) {
				inaCellOperand = inaFilter
						.getStructureByKey("CellValueOperand");
			} else {
				inaCellOperand = inaSelection
						.getStructureByKey("CellValueOperand");
			}
			if (oFF.notNull(inaCellOperand)) {
				return inaCellOperand.getListByKey("Elements").isEmpty();
			}
		}
		return true;
	};
	oFF.QInAFilterExpression.isSetOperandEmpty = function(inaFilter) {
		var inaSelection;
		var inaElements;
		if (oFF.isNull(inaFilter)) {
			return true;
		}
		inaSelection = inaFilter.getStructureByKey("Selection");
		if (oFF.isNull(inaSelection)) {
			inaSelection = inaFilter.getStructureByKey("SetOperand");
			if (oFF.isNull(inaSelection)) {
				inaElements = inaFilter.getListByKey("Elements");
			} else {
				inaElements = inaSelection.getListByKey("Elements");
			}
			return oFF.PrUtils.isListEmpty(inaElements);
		}
		return inaSelection.getKeysAsReadOnlyListOfString().isEmpty();
	};
	oFF.QInAFilterExpression.prototype.getComponentType = function() {
		return oFF.OlapComponentType.FILTER_EXPRESSION;
	};
	oFF.QInAFilterExpression.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var filterExpression = modelComponent;
		var version;
		var inaSelection;
		var filterElement;
		var cartesianProduct;
		var inaCellValueOperand;
		var inaFilterAnd;
		var inaSubSelections;
		var inaSubSelectionStructure;
		var inaElements;
		var nullSuppressionReference;
		var size;
		var inaNullSuppression;
		var nullSuppression;
		var startIdx;
		var idx;
		var inaCellElement;
		var operand;
		if (oFF.isNull(filterExpression)) {
			filterExpression = oFF.QFilterExpression._createByApplication(
					context, parentComponent);
		}
		version = 0;
		inaSelection = null;
		if (oFF.notNull(inaStructure)) {
			inaSelection = inaStructure.getStructureByKey("Selection");
			if (oFF.isNull(inaSelection)) {
				inaSelection = inaStructure.getStructureByKey("SelectionRepo");
				version = 1;
			}
		}
		filterExpression.setCartesianProduct(null);
		filterExpression.setComplexRoot(null);
		if (oFF.notNull(inaSelection)) {
			filterElement = importer.importFilterElement(inaSelection, null,
					filterExpression, context);
			if (oFF.notNull(filterElement)) {
				if (version >= 1) {
					filterExpression.setComplexRoot(filterElement);
				} else {
					cartesianProduct = oFF.QFilterUtil
							.convertComplexFilterToCartesian(filterElement);
					if (oFF.notNull(cartesianProduct)) {
						filterExpression.setCartesianProduct(cartesianProduct);
					} else {
						filterExpression.setComplexRoot(filterElement);
					}
				}
			}
		}
		if (filterExpression.supportsCellValueOperands()) {
			filterExpression.setIsSuppressingNulls(false);
			filterExpression.clearCellValueFilter();
			if (oFF.notNull(inaStructure)) {
				if (importer.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
					filterExpression.setIsSuppressingNulls(inaStructure
							.getBooleanByKeyExt("IsSuppressingNulls", false));
				}
				if (oFF.notNull(inaSelection)) {
					inaCellValueOperand = inaSelection
							.getStructureByKey("CellValueOperand");
					if (oFF.isNull(inaCellValueOperand)) {
						inaFilterAnd = inaSelection
								.getStructureByKey("Operator");
						if (oFF.notNull(inaFilterAnd)) {
							inaSubSelections = inaFilterAnd
									.getListByKey("SubSelections");
							if (inaSubSelections.size() === 2) {
								inaSubSelectionStructure = inaSubSelections
										.getStructureAt(1);
								inaCellValueOperand = inaSubSelectionStructure
										.getStructureByKey("CellValueOperand");
							}
						}
					}
					if (oFF.notNull(inaCellValueOperand)) {
						inaElements = inaCellValueOperand
								.getListByKey("Elements");
						if (oFF.notNull(inaElements)) {
							nullSuppressionReference = oFF.QFilterCellValueOperand
									.createForNullSuppression(context, null);
							size = inaElements.size();
							if (size > 0) {
								inaNullSuppression = inaElements
										.getStructureAt(0);
								nullSuppression = importer
										.importFilterCellValueOperand(
												inaNullSuppression, context);
								startIdx = 0;
								if (nullSuppression
										.isEqualTo(nullSuppressionReference)) {
									filterExpression
											.setIsSuppressingNulls(true);
									startIdx = 1;
								}
								filterExpression.clearCellValueFilter();
								for (idx = startIdx; idx < size; idx++) {
									inaCellElement = inaElements
											.getStructureAt(idx);
									operand = importer
											.importFilterCellValueOperand(
													inaCellElement, context);
									filterExpression
											.addCellValueFilter(operand);
								}
							}
						}
					}
				}
			}
		}
		return filterExpression;
	};
	oFF.QInAFilterExpression.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		return inaStructure;
	};
	oFF.QInAFilterExpression.prototype.exportComponent = function(exporter,
			modelComponent, inaParentStructure, flags) {
		var filterExpression = modelComponent;
		var inaGlobalCellValueOperands = null;
		var filterRootElement;
		var inaSelection;
		var inaStructure;
		if (filterExpression.supportsCellValueOperands()) {
			inaGlobalCellValueOperands = oFF.QInAFilterExpression
					.exportGlobalCellValueOperands(exporter, filterExpression);
		}
		filterRootElement = filterExpression.getFilterRootElement();
		inaSelection = null;
		if (oFF.notNull(filterRootElement)) {
			if (filterRootElement.getOlapComponentType() === oFF.FilterComponentType.TUPLE) {
				inaSelection = exporter.exportFilterTuple(filterRootElement);
			} else {
				if (filterRootElement.getOlapComponentType() === oFF.FilterComponentType.VIRTUAL_DATASOURCE) {
					inaSelection = exporter
							.exportFilterVirtualDatasource(filterRootElement);
				} else {
					inaSelection = exporter
							.exportFilterElement(filterRootElement);
				}
			}
			if (oFF.notNull(inaSelection) && !inaSelection.hasElements()) {
				inaSelection = null;
			}
		}
		inaStructure = null;
		if (oFF.notNull(inaSelection)) {
			inaStructure = oFF.PrFactory.createStructure();
			inaStructure.put("Selection", inaSelection);
		}
		if (oFF.notNull(inaGlobalCellValueOperands)) {
			inaStructure = oFF.QInAFilterExpression
					.combineSetOperandWithCellValueOperand(inaStructure,
							inaGlobalCellValueOperands);
		}
		if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
			if (oFF.isNull(inaStructure)) {
				inaStructure = oFF.PrFactory.createStructure();
			}
			if (filterExpression.supportsCellValueOperands()) {
				inaStructure.putBoolean("IsSuppressingNulls", filterExpression
						.isSuppressingNulls());
			}
		}
		return inaStructure;
	};
	oFF.QInAFilterFixed = function() {
	};
	oFF.QInAFilterFixed.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAFilterFixed.prototype.getComponentType = function() {
		return oFF.OlapComponentType.FILTER_FIXED;
	};
	oFF.QInAFilterFixed.prototype.getTagName = function() {
		return "FixedFilter";
	};
	oFF.QInAFilterFixed.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var filter;
		var filterExpression;
		if (oFF.isNull(inaStructure)) {
			return null;
		}
		filter = parentComponent;
		filterExpression = importer.importFilterExpression(null, inaStructure,
				filter, context);
		if (oFF.notNull(filter) && oFF.notNull(filterExpression)) {
			filter.setFixedFilter(filterExpression);
		}
		return filterExpression;
	};
	oFF.QInAFilterFixed.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var filter = modelComponent;
		var filterExpression = filter.getFixedFilter();
		return exporter.exportFilterExpression(filterExpression);
	};
	oFF.QInAFilterGeo = function() {
	};
	oFF.QInAFilterGeo.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAFilterGeo.tryCreateGeometry = function(strValue) {
		var value = oFF.XGeometryValue.createGeometryValueWithWkt(strValue);
		if (oFF.isNull(value)) {
			value = oFF.XStringValue.create(strValue);
		}
		return value;
	};
	oFF.QInAFilterGeo.prototype.getComponentType = function() {
		return oFF.FilterComponentType.SPATIAL_FILTER;
	};
	oFF.QInAFilterGeo.prototype.getTagName = function() {
		return "GeometryOperand";
	};
	oFF.QInAFilterGeo.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var filterExpression = parentComponent;
		var fieldAccessor = context.getFieldAccessorSingle();
		var inaComparison = inaStructure.getStringByKey("Comparison");
		var inaFieldName = inaStructure.getStringByKey("FieldName");
		var inaValue1 = inaStructure.getStringByKey("Value1");
		var comparison;
		var field;
		var geoFilter;
		var firstValue;
		var inaValue2;
		var secondValue;
		var inaValue3;
		var thirdValue;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(inaComparison)
				&& oFF.XStringUtils.isNotNullAndNotEmpty(inaFieldName)
				&& oFF.XStringUtils.isNotNullAndNotEmpty(inaValue1)) {
			comparison = oFF.QInAConverter.lookupComparison(inaComparison);
			if (oFF.isNull(comparison)) {
				return null;
			}
			if (!comparison.isTypeOf(oFF.SpatialComparisonOperator._SPATIAL)) {
				return null;
			}
			field = fieldAccessor.getFieldByName(inaFieldName);
			if (oFF.isNull(field)) {
				return null;
			}
			geoFilter = oFF.QFactory.newFilterOperationWithOperator(
					filterExpression, field, comparison);
			firstValue = oFF.QInAFilterGeo.tryCreateGeometry(inaValue1);
			geoFilter.getLow().setValue(firstValue);
			inaValue2 = inaStructure.getStringByKey("Value2");
			if (oFF.XStringUtils.isNotNullAndNotEmpty(inaValue2)) {
				secondValue = oFF.QInAFilterGeo.tryCreateGeometry(inaValue2);
				geoFilter.getHigh().setValue(secondValue);
			}
			inaValue3 = inaStructure.getStringByKey("Value3");
			if (oFF.XStringUtils.isNotNullAndNotEmpty(inaValue3)) {
				thirdValue = oFF.QInAFilterGeo.tryCreateGeometry(inaValue3);
				geoFilter.getThird().setValue(thirdValue);
			}
			return geoFilter;
		}
		return null;
	};
	oFF.QInAFilterGeo.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var operation = modelComponent;
		var comparisonOperator = operation.getComparisonOperator();
		var field;
		var geoValue1;
		var blendingDataSource;
		var srid;
		var inaBlendingDataSource;
		var geoValue2;
		var geoValue3;
		if (!comparisonOperator
				.isTypeOf(oFF.SpatialComparisonOperator._SPATIAL)) {
			throw oFF.XException
					.createIllegalStateException("Not a spatial operator");
		}
		inaStructure.putString("Comparison", oFF.QInAConverter
				.lookupComparisonInA(comparisonOperator));
		field = operation.getField();
		inaStructure.putString("FieldName", field.getName());
		geoValue1 = operation.getLow();
		blendingDataSource = operation.getDataSource();
		if (oFF.isNull(blendingDataSource)) {
			if (oFF.notNull(geoValue1) && geoValue1.getValue() !== null) {
				oFF.QInAValueUtils.exportFilterValue(exporter, "Value1",
						inaStructure, geoValue1, geoValue1.getValueType());
				srid = geoValue1.getGeometry().getSrid();
				if (exporter.supportsSpatialFilterSrid && oFF.notNull(srid)) {
					inaStructure.putInteger("SRID", srid.getInteger());
				}
			}
		} else {
			if (oFF.notNull(geoValue1) && geoValue1.getValue() !== null) {
				oFF.QInAValueUtils.exportFilterValue(exporter, "Value1",
						inaStructure, geoValue1, oFF.XValueType.STRING);
			}
			inaBlendingDataSource = oFF.QInADataSource.exportDataSource(
					exporter, blendingDataSource, false, null);
			inaStructure.put("DataSource", inaBlendingDataSource);
		}
		geoValue2 = operation.getHigh();
		if (oFF.notNull(geoValue2) && geoValue2.getValue() !== null) {
			oFF.QInAValueUtils.exportFilterValue(exporter, "Value2",
					inaStructure, geoValue2, oFF.XValueType.STRING);
		}
		geoValue3 = operation.getThird();
		if (oFF.notNull(geoValue3) && geoValue3.getValue() !== null) {
			oFF.QInAValueUtils.exportFilterValue(exporter, "Value3",
					inaStructure, geoValue3, oFF.XValueType.STRING);
		}
		return inaStructure;
	};
	oFF.QInAFilterMemberOp = function() {
	};
	oFF.QInAFilterMemberOp.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAFilterMemberOp.prototype.getComponentType = function() {
		return oFF.FilterComponentType.MEMBER_OPERAND;
	};
	oFF.QInAFilterMemberOp.prototype.getTagName = function() {
		return "MemberOperand";
	};
	oFF.QInAFilterMemberOp.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var inaComparison = inaStructure.getStringByKey("Comparison");
		var comparison;
		var attributeName;
		var field;
		var container;
		var setOperation;
		var operand;
		var valueType;
		if (oFF.isNull(inaComparison)) {
			return null;
		}
		comparison = oFF.QInAConverter.lookupComparison(inaComparison);
		if (oFF.isNull(comparison)) {
			importer.addError(oFF.ErrorCodes.INVALID_OPERATOR,
					"Unknown comparison operator");
			return null;
		}
		attributeName = inaStructure.getStringByKey("AttributeName");
		field = context.getFieldAccessorSingle().getFieldByNameOrAlias(
				attributeName);
		if (oFF.isNull(field)) {
			importer.addError(oFF.ErrorCodes.INVALID_TOKEN,
					"Unknown attribute name");
			return null;
		}
		container = parentComponent;
		setOperation = oFF.QFactory.newFilterOperationWithOperator(container,
				field, comparison);
		operand = setOperation.getLow();
		valueType = field.getValueType();
		oFF.QInAValueUtils.importValue(importer, operand, inaStructure,
				"Value", valueType, field);
		return setOperation;
	};
	oFF.QInAFilterMemberOp.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var operation = modelComponent;
		var field = operation.getField();
		var comparisonOperator = operation.getComparisonOperator();
		var comparison;
		if (comparisonOperator === oFF.ComparisonOperator.NOT_BETWEEN
				&& exporter.isAbap(field.getQueryModel())) {
			comparison = "NOTBETWEEN";
		} else {
			comparison = oFF.QInAConverter
					.lookupComparisonInA(comparisonOperator);
		}
		inaStructure.putString("Comparison", comparison);
		if (field.getDimension().isMeasureStructure()) {
			inaStructure.putString("AttributeName", "Measures");
		} else {
			inaStructure.putString("FieldName", field.getName());
		}
		oFF.QInAValueUtils.exportFilterValue(exporter, "Value", inaStructure,
				operation.getLow(), field.getValueType());
		return inaStructure;
	};
	oFF.QInAFilterOperation = function() {
	};
	oFF.QInAFilterOperation.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAFilterOperation.importValue = function(importer, variableContainer,
			field, value, valueType, inaElement, parameterName,
			parameterIsName, parameterNavigations) {
		var inaValueIs = inaElement.getStringByKey(parameterIsName);
		var variableName;
		var variable;
		var filterType;
		var lowNavigations;
		var memberNavigations;
		var lowSize;
		var lowNaviIdx;
		var lowNavi;
		if (oFF.XString.isEqual("Variable", inaValueIs)) {
			value.setFilterValueType(oFF.XValueType.VARIABLE);
			variableName = inaElement.getStringByKey(parameterName);
			variable = variableContainer.getVariables().getByKey(variableName);
			if (oFF.notNull(variable)) {
				value.setVariableValue(variable);
			}
		} else {
			filterType = oFF.QInAConverter.lookupValueType(inaElement
					.getStringByKeyExt("LowIs", null));
			if (filterType === oFF.XValueType.CURRENT_MEMBER
					|| filterType === oFF.XValueType.VARIABLE) {
				value.setFilterValueType(filterType);
			}
			if (oFF.notNull(parameterNavigations)) {
				lowNavigations = inaElement.getListByKey(parameterNavigations);
				if (oFF.notNull(lowNavigations)) {
					memberNavigations = value.getMemberNavigations();
					lowSize = lowNavigations.size();
					for (lowNaviIdx = 0; lowNaviIdx < lowSize; lowNaviIdx++) {
						lowNavi = lowNavigations.getStructureAt(lowNaviIdx)
								.getStringByKey("Function");
						memberNavigations
								.add(oFF.QFactory
										.createMemberNavigation(oFF.CurrentMemberFunction
												.lookup(lowNavi)));
					}
				}
			}
			oFF.QInAValueUtils.importValue(importer, value, inaElement,
					parameterName, valueType, field);
		}
	};
	oFF.QInAFilterOperation.exportMemberNavigation = function(memberNavigation,
			inaLowNavigation) {
		var parameters;
		var size;
		var inaParameters;
		var i;
		var parameter;
		var inaParameter;
		var parameterType;
		var navigations;
		var inaParameters2;
		var inaParameter2;
		var inaNavigations;
		var naviSize;
		var idxNavi;
		inaLowNavigation.putString("Function", memberNavigation
				.getMemberFunction().getName());
		parameters = memberNavigation.getParameters();
		if (oFF.notNull(parameters)) {
			size = parameters.size();
			inaParameters = inaLowNavigation.putNewList("Parameters");
			for (i = 0; i < size; i++) {
				parameter = parameters.get(i);
				inaParameter = inaParameters.addNewStructure();
				parameterType = parameter.getParameterType();
				if (oFF.XString.isEqual(parameterType, "Range")
						|| oFF.XString.isEqual(parameterType, "Shift")) {
					inaParameter = inaParameter.putNewStructure(parameterType);
				}
				oFF.QInAFilterOperation.exportMemberParameterValues(parameter,
						inaParameter);
			}
		}
		navigations = memberNavigation.getNavigations();
		if (oFF.notNull(navigations)) {
			if (inaLowNavigation.containsKey("Parameters")) {
				inaParameters2 = inaLowNavigation.getListByKey("Parameters");
			} else {
				inaParameters2 = inaLowNavigation.putNewList("Parameters");
			}
			inaParameter2 = inaParameters2.addNewStructure();
			inaNavigations = inaParameter2.putNewList("Navigations");
			naviSize = navigations.size();
			for (idxNavi = 0; idxNavi < naviSize; idxNavi++) {
				oFF.QInAFilterOperation.exportMemberNavigation(navigations
						.get(idxNavi), inaNavigations.addNewStructure());
			}
		}
	};
	oFF.QInAFilterOperation.exportMemberParameterValues = function(parameter,
			inaParameter) {
		var values = parameter.getValues();
		var iterator = values.getKeysAsIteratorOfString();
		var key;
		var value;
		while (iterator.hasNext()) {
			key = iterator.next();
			value = values.getByKey(key);
			if (value.getValueType().isNumber()) {
				inaParameter.putDouble(key, value.getDouble());
			} else {
				inaParameter.putString(key, value.toString());
			}
		}
	};
	oFF.QInAFilterOperation.exportValue = function(exporter, value, valueType,
			inaElement, parameterName, parameterIsName, parameterNavigations) {
		var filterType = value.getFilterValueType();
		var variableValue;
		var memberNavigations;
		var memberNavigationSize;
		var inaLowNavigations;
		var mnIdx;
		if (filterType === oFF.XValueType.VARIABLE) {
			variableValue = value.getVariableValue();
			if (oFF.notNull(variableValue)) {
				inaElement.putString(parameterIsName, "Variable");
				inaElement.putString(parameterName, variableValue.getName());
			}
		} else {
			if (value.isManualInput()) {
				inaElement.putString(parameterIsName, "ManualInput");
			}
			if (filterType === oFF.XValueType.CURRENT_MEMBER) {
				inaElement.putString(parameterIsName, "CurrentMember");
			}
			oFF.QInAValueUtils.exportValue(exporter, parameterName, inaElement,
					value, valueType);
			if (oFF.notNull(parameterNavigations)) {
				memberNavigations = value.getMemberNavigations();
				memberNavigationSize = memberNavigations.size();
				if (memberNavigationSize > 0) {
					inaLowNavigations = inaElement
							.putNewList(parameterNavigations);
					for (mnIdx = 0; mnIdx < memberNavigationSize; mnIdx++) {
						oFF.QInAFilterOperation.exportMemberNavigation(
								memberNavigations.get(mnIdx), inaLowNavigations
										.addNewStructure());
					}
				}
			}
		}
	};
	oFF.QInAFilterOperation.prototype.getComponentType = function() {
		return oFF.FilterComponentType.OPERATION;
	};
	oFF.QInAFilterOperation.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var inaComparison = inaStructure.getStringByKeyExt("Comparison", "=");
		var comparisonOperator = oFF.QInAConverter
				.lookupComparison(inaComparison);
		var cartesianList;
		var filterExpression;
		var field;
		var filterOperation;
		var fieldValueType;
		var isFuzzyOperator;
		var depth;
		var levelOffset;
		var hierarchyStructure;
		var supplementFields;
		var variableContainer;
		var numberOfParameters;
		var low;
		var high;
		var third;
		if (oFF.isNull(comparisonOperator)) {
			importer.addError(oFF.ErrorCodes.INVALID_OPERATOR, oFF.XStringUtils
					.concatenate2("Unsupported comparison operator: ",
							inaComparison));
			return null;
		}
		cartesianList = parentComponent;
		filterExpression = cartesianList.getFilterExpression();
		field = cartesianList.getField();
		filterOperation = oFF.QFactory.newFilterOperationWithOperator(
				filterExpression, field, comparisonOperator);
		fieldValueType = field.getValueType();
		isFuzzyOperator = comparisonOperator
				.isTypeOf(oFF.ComparisonOperator.LIKE)
				|| comparisonOperator.isTypeOf(oFF.ComparisonOperator.MATCH)
				|| comparisonOperator
						.isTypeOf(oFF.ComparisonOperator.NOT_MATCH);
		if (isFuzzyOperator) {
			fieldValueType = oFF.XValueType.STRING;
		}
		if (inaStructure.getBooleanByKeyExt("IsExcluding", false)) {
			filterOperation.setSetSign(oFF.SetSign.EXCLUDING);
		} else {
			filterOperation.setSetSign(oFF.SetSign.INCLUDING);
		}
		filterOperation.resetDepth();
		depth = inaStructure.getIntegerByKeyExt("Depth", -1);
		if (depth !== -1) {
			filterOperation.setDepth(depth);
		}
		filterOperation.resetLevelOffset();
		levelOffset = inaStructure.getIntegerByKeyExt("LevelOffset", -1);
		if (levelOffset !== -1) {
			filterOperation.setLevelOffset(levelOffset);
		}
		hierarchyStructure = inaStructure.getStructureByKey("Hierarchy");
		if (oFF.notNull(hierarchyStructure)) {
			filterOperation.setHierarchyName(hierarchyStructure
					.getStringByKey("Name"));
		}
		if (importer.supportsConvertToFlatFilter) {
			filterOperation.setConvertToFlatFilter(inaStructure
					.getBooleanByKeyExt("ConvertToFlatSelection", false));
		}
		supplementFields = cartesianList.getSupplementFields();
		variableContainer = context.getVariableContainer();
		numberOfParameters = comparisonOperator.getNumberOfParameters();
		if (numberOfParameters >= 1) {
			low = filterOperation.getLow();
			oFF.QInAFilterOperation.importValue(importer, variableContainer,
					field, low, fieldValueType, inaStructure, "Low", "LowIs",
					"LowNavigations");
			oFF.QInAValueUtils.importSupplements(importer, low, inaStructure,
					"LowSupplements", supplementFields);
		}
		if (numberOfParameters >= 2) {
			high = filterOperation.getHigh();
			oFF.QInAFilterOperation.importValue(importer, variableContainer,
					field, high, fieldValueType, inaStructure, "High",
					"HighIs", null);
			oFF.QInAValueUtils.importSupplements(importer, high, inaStructure,
					"HighSupplements", supplementFields);
		}
		if (numberOfParameters >= 3) {
			third = filterOperation.getThird();
			oFF.QInAFilterOperation.importValue(importer, variableContainer,
					field, third, fieldValueType, inaStructure, "Value3",
					"Value3Is", null);
			oFF.QInAValueUtils.importSupplements(importer, third, inaStructure,
					null, supplementFields);
		}
		return filterOperation;
	};
	oFF.QInAFilterOperation.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var filterOperation = modelComponent;
		var field = filterOperation.getField();
		var comparisonOperator;
		var fieldValueType;
		var comparison;
		var hierarchyName;
		var inaHierarchy;
		var numberOfParameters;
		if (oFF.notNull(field)) {
			comparisonOperator = filterOperation.getComparisonOperator();
			if (oFF.isNull(comparisonOperator)) {
				comparisonOperator = oFF.ComparisonOperator.EQUAL;
			}
			fieldValueType = field.getValueType();
			if (comparisonOperator.isTypeOf(oFF.ComparisonOperator.LIKE)
					|| comparisonOperator
							.isTypeOf(oFF.ComparisonOperator.MATCH)
					|| comparisonOperator
							.isTypeOf(oFF.ComparisonOperator.NOT_MATCH)) {
				fieldValueType = oFF.XValueType.STRING;
			}
			if (comparisonOperator === oFF.ComparisonOperator.NOT_BETWEEN
					&& exporter.isAbap(field.getQueryModel())) {
				comparison = "NOTBETWEEN";
			} else {
				comparison = oFF.QInAConverter
						.lookupComparisonInA(comparisonOperator);
			}
			inaStructure.putString("Comparison", comparison);
			if (filterOperation.hasLevelOffset()) {
				inaStructure.putInteger("LevelOffset", filterOperation
						.getLevelOffset());
			}
			if (filterOperation.hasDepth()) {
				inaStructure.putInteger("Depth", filterOperation.getDepth());
			}
			if (filterOperation.getSetSign() === oFF.SetSign.EXCLUDING) {
				inaStructure.putBoolean("IsExcluding", true);
			}
			hierarchyName = filterOperation.getHierarchyName();
			if (oFF.notNull(hierarchyName)) {
				inaHierarchy = inaStructure.putNewStructure("Hierarchy");
				inaHierarchy.putString("Name", hierarchyName);
			}
			if (exporter.supportsConvertToFlatFilter
					&& filterOperation.isConvertToFlatFilter()) {
				inaStructure.putBoolean("ConvertToFlatSelection", true);
			}
			numberOfParameters = comparisonOperator.getNumberOfParameters();
			if (numberOfParameters >= 1) {
				oFF.QInAFilterOperation.exportValue(exporter, filterOperation
						.getLow(), fieldValueType, inaStructure, "Low",
						"LowIs", "LowNavigations");
				if (numberOfParameters >= 2) {
					oFF.QInAFilterOperation.exportValue(exporter,
							filterOperation.getHigh(), fieldValueType,
							inaStructure, "High", "HighIs", null);
				}
				if (numberOfParameters >= 3) {
					oFF.QInAFilterOperation.exportValue(exporter,
							filterOperation.getThird(), fieldValueType,
							inaStructure, "Value3", "Value3Is", null);
				}
			}
		}
		return inaStructure;
	};
	oFF.QInAFilterTuple = function() {
	};
	oFF.QInAFilterTuple.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAFilterTuple.prototype.getComponentType = function() {
		return oFF.FilterComponentType.TUPLE;
	};
	oFF.QInAFilterTuple.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var tupleDetailContainer = modelComponent;
		var inaInnerElement = oFF.PrFactory.createStructure();
		var inaSubSelectionsTuples;
		var tupleStructureInSubSelections;
		var tuplesOperandStructure;
		var fieldNamesInInA;
		var fieldNames;
		var tuplesInInA;
		var tuples;
		var l;
		var singleTupleCondition;
		var tuplesData;
		var j;
		inaInnerElement.putString("Code", "And");
		inaSubSelectionsTuples = inaInnerElement.putNewList("SubSelections");
		tupleStructureInSubSelections = inaSubSelectionsTuples
				.addNewStructure();
		tuplesOperandStructure = tupleStructureInSubSelections
				.putNewStructure("TuplesOperand");
		fieldNamesInInA = tuplesOperandStructure.putNewList("FieldNames");
		fieldNames = tupleDetailContainer.getFieldNames();
		fieldNamesInInA.addAllStrings(fieldNames);
		tuplesInInA = tuplesOperandStructure.putNewList("Tuples");
		tuples = tupleDetailContainer.getTuples();
		for (l = 0; l < tuples.size(); l++) {
			singleTupleCondition = tuples.get(l);
			tuplesData = tuplesInInA.addNewList();
			for (j = 0; j < fieldNames.size(); j++) {
				tuplesData.addString(singleTupleCondition.get(j));
			}
		}
		inaStructure.put("Operator", inaInnerElement);
		return inaStructure;
	};
	oFF.QInAFilterTuple.prototype.importComponentWithStructure = oFF.noSupport;
	oFF.QInAFilterVirtualDatasource = function() {
	};
	oFF.QInAFilterVirtualDatasource.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAFilterVirtualDatasource.prototype.getComponentType = function() {
		return oFF.FilterComponentType.VIRTUAL_DATASOURCE;
	};
	oFF.QInAFilterVirtualDatasource.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var virtualDSFilter = modelComponent;
		var inaInnerElement = oFF.PrFactory.createStructure();
		var vdsSubSelections;
		var schemaOperandElement;
		var packageOperandElement;
		var objectOperandElement;
		inaInnerElement.putString("Code", "And");
		vdsSubSelections = inaInnerElement.putNewList("SubSelections");
		schemaOperandElement = this.createMemberOperand("SchemaName",
				virtualDSFilter.getSchemaName());
		packageOperandElement = this.createMemberOperand("PackageName",
				virtualDSFilter.getPackageName());
		objectOperandElement = this.createMemberOperand("ObjectName",
				virtualDSFilter.getObjectName());
		vdsSubSelections.add(schemaOperandElement);
		vdsSubSelections.add(packageOperandElement);
		vdsSubSelections.add(objectOperandElement);
		inaStructure.put("Operator", inaInnerElement);
		return inaStructure;
	};
	oFF.QInAFilterVirtualDatasource.prototype.createMemberOperand = function(
			level, value) {
		var schemaInA = oFF.PrFactory.createStructure();
		var comparison;
		var schemaOperandElement;
		schemaInA.putString("AttributeName", level);
		comparison = oFF.QInAConverter
				.lookupComparisonInA(oFF.ComparisonOperator.EQUAL);
		schemaInA.putString("Comparison", comparison);
		schemaInA.putString("Value", value);
		schemaOperandElement = oFF.PrFactory.createStructure();
		schemaOperandElement.put("MemberOperand", schemaInA);
		return schemaOperandElement;
	};
	oFF.QInAFilterVirtualDatasource.prototype.importComponentWithStructure = oFF.noSupport;
	oFF.QInAGenericComponent = function() {
	};
	oFF.QInAGenericComponent.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAGenericComponent.prototype.getComponentType = function() {
		return oFF.OlapComponentType.OLAP;
	};
	oFF.QInAGenericComponent.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		return null;
	};
	oFF.QInAGenericComponent.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		inaStructure.putString("Name", modelComponent.getName());
		inaStructure.putString("Type", modelComponent.getComponentType()
				.getName());
		return inaStructure;
	};
	oFF.QInAHierarchy = function() {
	};
	oFF.QInAHierarchy.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAHierarchy.prototype.getComponentType = function() {
		return oFF.OlapComponentType.HIERARCHY;
	};
	oFF.QInAHierarchy.prototype.getTagName = function() {
		return "Hierarchy";
	};
	oFF.QInAHierarchy.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var dimension = modelComponent;
		var hierarchyName;
		var hierarchy;
		var dueDate;
		var dueDateIs;
		var isDueDateVariable;
		var dateTo;
		var dateFrom;
		var inaMetadata;
		var isActive;
		var initialDrillLevel;
		var alignment;
		var nodeAlignment;
		var isExpandingBottomUp;
		var nodeCondensation;
		var memberOfPostedNodeVisibility;
		var visibility;
		if (dimension.supportsHierarchy()) {
			if (oFF.isNull(inaStructure)) {
				dimension.setHierarchy(null);
			} else {
				if (inaStructure.hasStringByKey("Name")) {
					hierarchyName = inaStructure.getStringByKey("Name");
				} else {
					hierarchyName = inaStructure
							.getStringByKey("HierarchyName");
				}
				hierarchy = null;
				if (oFF.XStringUtils.isNotNullAndNotEmpty(hierarchyName)) {
					if (dimension.supportsDimensionHierarchyLevels()) {
						this.importHierarchyAsCatalogItem(inaStructure,
								dimension);
						this.importLeveledHierarchyToMetadata(importer,
								inaStructure, context, dimension);
					}
					hierarchy = oFF.QHierarchy.create(dimension.getContext(),
							dimension, hierarchyName);
					hierarchy.setHierarchyVersion(inaStructure
							.getStringByKey("Version"));
					dueDate = inaStructure.getStringByKey("DueDate");
					dueDateIs = inaStructure.getStringByKey("DueDateIs");
					isDueDateVariable = oFF.notNull(dueDateIs)
							&& oFF.XString.isEqual("Variable", dueDateIs);
					dimension.setUseHierarchyDueDateVariable(isDueDateVariable);
					if (isDueDateVariable) {
						if (oFF.XStringUtils.isNullOrEmpty(dueDate)) {
							dimension.setHierarchyDueDateVariableName(null);
						} else {
							dimension.setHierarchyDueDateVariableName(dueDate);
						}
					} else {
						hierarchy.setHierarchyDueDate(oFF.XDate
								.createDateFromStringWithFlag(dueDate,
										importer.supportsSAPDateFormat));
					}
					dateTo = inaStructure.getStringByKey("DateTo");
					hierarchy.setDateTo(oFF.XDate.createDateFromStringWithFlag(
							dateTo, importer.supportsSAPDateFormat));
					dateFrom = inaStructure.getStringByKey("0DATEFROM");
					hierarchy.setDateFrom(oFF.XDate
							.createDateFromStringWithFlag(dateFrom,
									importer.supportsSAPDateFormat));
					inaMetadata = inaStructure.getStructureByKey("Metadata");
					if (oFF.notNull(inaMetadata)) {
						dateTo = inaMetadata.getStringByKey("DateTo");
						if (oFF.XStringUtils.isNotNullAndNotEmpty(dateTo)) {
							hierarchy.setDateTo(oFF.XDate
									.createDateFromStringWithFlag(dateTo,
											importer.supportsSAPDateFormat));
						}
						dateFrom = inaMetadata.getStringByKey("0DATEFROM");
						if (oFF.XStringUtils.isNotNullAndNotEmpty(dateFrom)) {
							hierarchy.setDateFrom(oFF.XDate
									.createDateFromStringWithFlag(dateFrom,
											importer.supportsSAPDateFormat));
						}
					}
					dimension.setHierarchy(hierarchy);
					isActive = inaStructure.getBooleanByKeyExt(
							"HierarchyActive", true);
					dimension.setHierarchyActive(isActive);
					dimension.setSelectorHierarchyActive(isActive);
				}
				initialDrillLevel = inaStructure.getIntegerByKeyExt(
						"InitialDrillLevel", 0);
				dimension.setInitialDrillLevel(initialDrillLevel);
				dimension.setSelectorInitialDrillLevel(initialDrillLevel);
				alignment = oFF.Alignment.DEFAULT_VALUE;
				if (context.getQueryModel().supportsExpandBottomUp()) {
					nodeAlignment = inaStructure.getStringByKeyExt(
							"LowerLevelNodeAlignment", "Default");
					alignment = oFF.QInAConverter
							.lookupLowerLevelNodeAlignment(nodeAlignment);
					if (inaStructure.containsKey("ExpandBottomUp")) {
						isExpandingBottomUp = inaStructure.getBooleanByKeyExt(
								"ExpandBottomUp", false);
						if (isExpandingBottomUp) {
							alignment = oFF.Alignment.CHILDREN_ABOVE_PARENT;
						}
					}
				}
				dimension.setLowerLevelNodeAlignment(alignment);
				nodeCondensation = inaStructure.getBooleanByKeyExt(
						"NodeCondensation", false);
				dimension.setHasNodeCondensation(nodeCondensation);
				memberOfPostedNodeVisibility = inaStructure.getStringByKeyExt(
						"MemberOfPostedNodeVisibility", "Visible");
				visibility = oFF.QInAConverter
						.lookupResultSetVisibility(memberOfPostedNodeVisibility);
				dimension.setMemberOfPostedNodeVisibility(visibility);
				return hierarchy;
			}
		}
		return null;
	};
	oFF.QInAHierarchy.prototype.importHierarchyAsCatalogItem = function(
			inaStructure, dimension) {
		var hierarchyAsList = oFF.PrFactory.createList();
		var hierarchyCatalogResult;
		hierarchyAsList.add(inaStructure);
		hierarchyCatalogResult = dimension.getHierarchies();
		if (oFF.isNull(hierarchyCatalogResult)) {
			hierarchyCatalogResult = oFF.HierarchyCatalogResult
					.createFromDimensionMetadata(hierarchyAsList, dimension
							.getName());
			dimension.getHierarchyManagerBase().setHierarchies(
					hierarchyCatalogResult);
		} else {
			oFF.HierarchyCatalogResult.appendItemsToCatalogResult(
					hierarchyCatalogResult, hierarchyAsList, dimension
							.getName());
		}
	};
	oFF.QInAHierarchy.prototype.importLeveledHierarchyToMetadata = function(
			importer, inaStructure, context, dimension) {
		var queryManager = dimension.getQueryModelBase().getQueryManagerBase();
		var metadataModel;
		var metaHierarchies;
		var leveledHierarchy;
		if (oFF.notNull(queryManager)
				&& !oFF.PrUtils
						.isListEmpty(inaStructure.getListByKey("Levels"))) {
			metadataModel = queryManager.getMetadataModelBase();
			metaHierarchies = metadataModel.getLeveledHierarchiesBase();
			leveledHierarchy = oFF.QInAMdHierarchy.importLeveledHierarchy(
					importer, context, dimension, inaStructure);
			if (!metaHierarchies.contains(leveledHierarchy)) {
				metaHierarchies.add(leveledHierarchy);
			}
		}
	};
	oFF.QInAHierarchy.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var dimension = modelComponent;
		var optimizeExport = exporter.getApplication().getVersion() >= oFF.XVersion.V103_OPTIMIZE_HIERARCHY_EXPORT
				&& exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA);
		var isHierarchyActive;
		var isInactiveDataHierarchy;
		var hierarchyName;
		var isBw;
		var initialDrillLevel;
		var alignment;
		var nodeAlignment;
		var nodeCondensation;
		var visibility;
		var memberOfPostedNodeVisibility;
		if (dimension.supportsHierarchy()) {
			isHierarchyActive = dimension.isHierarchyActive();
			isInactiveDataHierarchy = !isHierarchyActive
					&& exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA);
			hierarchyName = dimension.getHierarchyName();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(hierarchyName)
					&& !isInactiveDataHierarchy) {
				isBw = exporter.isAbap(dimension.getQueryModel());
				oFF.QInAExportUtil.setNonEmptyString(inaStructure, "Name",
						hierarchyName);
				if (!optimizeExport) {
					oFF.QInAExportUtil.setNonEmptyString(inaStructure,
							"HierarchyName", hierarchyName);
				}
				oFF.QInAExportUtil.setNonEmptyString(inaStructure, "Version",
						dimension.getHierarchyVersion());
				if (!optimizeExport) {
					inaStructure.putBoolean("HierarchyActive",
							isHierarchyActive);
				}
				if (dimension.useHierarchyDueDateVariable()) {
					inaStructure.putString("DueDateIs", "Variable");
					oFF.QInAExportUtil.setNonEmptyString(inaStructure,
							"DueDate", dimension
									.getHierarchyDueDateVariableName());
				} else {
					oFF.QInAExportUtil.setDate(exporter, inaStructure,
							"DueDate", dimension.getHierarchyDueDate());
				}
				initialDrillLevel = dimension.getInitialDrillLevel();
				if (isBw || initialDrillLevel !== 0 || !optimizeExport) {
					inaStructure.putInteger("InitialDrillLevel",
							initialDrillLevel);
				}
				alignment = dimension.getLowerLevelNodeAlignment();
				if (dimension.supportsExpandBottomUp()) {
					if (optimizeExport) {
						if (alignment === oFF.Alignment.CHILDREN_ABOVE_PARENT) {
							inaStructure.putBoolean("ExpandBottomUp", true);
						}
					} else {
						inaStructure
								.putBoolean(
										"ExpandBottomUp",
										alignment === oFF.Alignment.CHILDREN_ABOVE_PARENT);
					}
				}
				if (isBw) {
					if (dimension.getQueryModel() !== null
							&& dimension.getQueryModel()
									.supportsExpandBottomUp()) {
						nodeAlignment = oFF.QInAConverter
								.lookupLowerLevelNodeAlignmentInA(alignment);
					} else {
						nodeAlignment = oFF.QInAConverter
								.lookupLowerLevelNodeAlignmentInA2(alignment);
					}
					inaStructure.putString("LowerLevelNodeAlignment",
							nodeAlignment);
					nodeCondensation = dimension.hasNodeCondensation();
					inaStructure.putBoolean("NodeCondensation",
							nodeCondensation);
					visibility = dimension.getMemberOfPostedNodeVisibility();
					memberOfPostedNodeVisibility = oFF.QInAConverter
							.lookupResultSetVisibilityInA(visibility);
					inaStructure.putString("MemberOfPostedNodeVisibility",
							memberOfPostedNodeVisibility);
				}
				if (dimension.isHierarchyNavigationDeltaMode()) {
					inaStructure.putBoolean("HierarchyNavigationDeltaMode",
							true);
				}
				if (!optimizeExport) {
					this.exportHierarchyLevels(inaStructure, dimension,
							hierarchyName);
				}
				return inaStructure;
			}
		}
		return null;
	};
	oFF.QInAHierarchy.prototype.exportHierarchyLevels = function(inaStructure,
			dimension, hierarchyName) {
		var hierarchies;
		var hierarchiesIt;
		var catalogItem;
		if (dimension.supportsDimensionHierarchyLevels()) {
			hierarchies = dimension.getHierarchies();
			if (oFF.notNull(hierarchies)) {
				hierarchiesIt = hierarchies.getObjectsIterator();
				while (hierarchiesIt.hasNext()) {
					catalogItem = hierarchiesIt.next();
					if (oFF.XString.isEqual(catalogItem.getHierarchyName(),
							hierarchyName)) {
						oFF.QInAMdHierarchy.exportLevels(inaStructure,
								catalogItem);
						return;
					}
				}
			}
		}
	};
	oFF.QInAMember = function() {
	};
	oFF.QInAMember.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAMember.importQdMemberProperties = function(importer, member,
			inaMember) {
		var inaAggregation;
		var aggregationType;
		var visibility;
		var inaPostAggregation;
		var postAggregationType;
		var inaPostAggregationDimensions;
		var postAggregationSize;
		var postDimIdx;
		var ignoreExternalDimensions;
		var inaIgnoreExternalDimensions;
		var externalSize;
		var idxIgnore;
		member.setAggregationType(null);
		inaAggregation = inaMember.getStringByKey("Aggregation");
		if (oFF.XStringUtils.isNotNullAndNotEmpty(inaAggregation)) {
			aggregationType = oFF.QInAConverter
					.lookupAggregationType(inaAggregation);
			member.setAggregationType(aggregationType);
		}
		if (inaMember.containsKey("NumericShift")) {
			member.setNumericShift(inaMember.getIntegerByKey("NumericShift"));
		}
		if (inaMember.containsKey("NumericScale")) {
			member.setNumericScale(inaMember.getIntegerByKey("NumericScale"));
		}
		if (inaMember.containsKey("NumericPrecision")) {
			member.setNumericPrecision(inaMember
					.getIntegerByKey("NumericPrecision"));
		}
		if (inaMember.containsKey("DataType")) {
			member.setDataType(oFF.QInAConverter.lookupValueType(inaMember
					.getStringByKey("DataType")));
		}
		if (member.getQueryModel().supportsMemberVisibility()) {
			visibility = oFF.QInAConverter.lookupResultSetVisibility(inaMember
					.getStringByKeyExt("Visibility", "Visible"));
			member.setResultVisibility(visibility);
		}
		inaPostAggregation = inaMember.getStringByKey("PostAggregation");
		postAggregationType = oFF.QInAConverter
				.lookupAggregationType(inaPostAggregation);
		member.setPostAggregationType(postAggregationType);
		if (inaMember.containsKey("PostAggregationIgnoreHierarchy")) {
			member.setPostAggregationIgnoreHierarchy(true);
		}
		member.clearPostAggregationDimensions();
		inaPostAggregationDimensions = inaMember
				.getListByKey("PostAggregationDimensions");
		if (oFF.notNull(inaPostAggregationDimensions)) {
			postAggregationSize = inaPostAggregationDimensions.size();
			for (postDimIdx = 0; postDimIdx < postAggregationSize; postDimIdx++) {
				member
						.addPostAggregationDimensionName(inaPostAggregationDimensions
								.getStringAt(postDimIdx));
			}
		}
		if (importer.supportsIgnoreExternalDimensions) {
			if (inaMember.hasStringByKey("IgnoreExternalDimensions")) {
				ignoreExternalDimensions = inaMember
						.getStringByKey("IgnoreExternalDimensions");
				if (oFF.XString.isEqual(ignoreExternalDimensions, "All")) {
					member.setIgnoreAllExternalDimensions(true);
				}
			} else {
				if (inaMember.containsKey("IgnoreExternalDimensions")) {
					inaIgnoreExternalDimensions = inaMember
							.getListByKey("IgnoreExternalDimensions");
					externalSize = inaIgnoreExternalDimensions.size();
					for (idxIgnore = 0; idxIgnore < externalSize; idxIgnore++) {
						member
								.addExternalDimensionToIgnore(inaIgnoreExternalDimensions
										.getStringAt(idxIgnore));
					}
				}
			}
		}
	};
	oFF.QInAMember.exportQd = function(exporter, member, inaMember) {
		var basicAggregationType = member.getAggregationType();
		var resultVisibility;
		var presentationSignReversal;
		if (oFF.notNull(basicAggregationType)) {
			inaMember.putString("Aggregation", oFF.QInAConverter
					.lookupAggregationTypeInA(basicAggregationType));
		}
		if (!exporter.supportsDataCells) {
			oFF.QInAMember.setIntegerIfNotNull(inaMember, "NumericShift",
					member.getNumericShift());
		}
		if (!exporter.supportsDataCells
				|| member.getQueryModel().supportsExtendedKeyFigureProperties()) {
			oFF.QInAMember.setIntegerIfNotNull(inaMember, "NumericScale",
					member.getNumericScale());
			oFF.QInAMember.setIntegerIfNotNull(inaMember, "NumericPrecision",
					member.getNumericPrecision());
		}
		if (exporter.supportsMemberVisibility) {
			resultVisibility = member.getResultVisibility();
			if (oFF.isNull(resultVisibility)) {
				resultVisibility = oFF.ResultVisibility.VISIBLE;
			}
			inaMember.putString("Visibility", oFF.QInAConverter
					.lookupResultSetVisibilityInA(resultVisibility));
		}
		presentationSignReversal = member.getPresentationSignReversal();
		if (oFF.notNull(presentationSignReversal)) {
			inaMember.putBoolean("PresentationSignReversal",
					presentationSignReversal.getBoolean());
		}
		oFF.QInAExportUtil.setNameIfNotNull(inaMember, "UnitType", member
				.getUnitType());
		inaMember.putStringNotNull("UnitFixed", member.getUnitFixed());
		if (!exporter.getMode().isTypeOf(
				oFF.QModelFormat.INA_DATA_BLENDING_SOURCE)) {
			inaMember.putStringNotNull("UnitName", member.getUnitName());
			inaMember
					.putStringNotNull("UnitTextName", member.getUnitTextName());
			inaMember.putStringNotNull("DataType", oFF.QInAConverter
					.lookupValueTypeInA(member.getDataType()));
		}
		oFF.QInAMember.exportPostAggregation(member, inaMember);
		oFF.QInAMember.exportIgnoreExternalDimensions(exporter, member,
				inaMember);
		oFF.QInAMember.exportExceptionAggregation(member, inaMember);
	};
	oFF.QInAMember.setIntegerIfNotNull = function(structure, name, value) {
		if (oFF.notNull(value)) {
			structure.putInteger(name, value.getInteger());
		}
	};
	oFF.QInAMember.exportIgnoreExternalDimensions = function(exporter, member,
			inaMember) {
		var ignoredExternalDimensions;
		var inaIgnoredExternalDimensions;
		if (exporter.supportsIgnoreExternalDimensions) {
			if (member.isIgnoringAllExternalDimensions()) {
				inaMember.putString("IgnoreExternalDimensions", "All");
			} else {
				ignoredExternalDimensions = member
						.getIgnoredExternalDimensions();
				if (ignoredExternalDimensions.hasElements()) {
					inaIgnoredExternalDimensions = inaMember
							.putNewList("IgnoreExternalDimensions");
					inaIgnoredExternalDimensions
							.addAllStrings(ignoredExternalDimensions);
				}
			}
		}
	};
	oFF.QInAMember.exportPostAggregation = function(member, inaMember) {
		var postAggregationType = member.getPostAggregationType();
		var postAggregationDimensions;
		var inaPostAggregationDimensions;
		var iterator;
		if (oFF.notNull(postAggregationType)) {
			inaMember.putString("PostAggregation", oFF.QInAConverter
					.lookupAggregationTypeInA(postAggregationType));
		}
		if (member.isPostAggregationIgnoringHierarchy()) {
			inaMember.putBoolean("PostAggregationIgnoreHierarchy", true);
		}
		postAggregationDimensions = member.getPostAggregationDimensions();
		if (postAggregationDimensions.hasElements()) {
			inaPostAggregationDimensions = inaMember
					.putNewList("PostAggregationDimensions");
			iterator = postAggregationDimensions.getIterator();
			while (iterator.hasNext()) {
				inaPostAggregationDimensions.add(oFF.PrString
						.createWithValue(iterator.next()));
			}
		}
	};
	oFF.QInAMember.exportExceptionAggregation = function(member, inaMember) {
		var exceptionAggregationType = member.getExceptionAggregationType();
		var exceptionAggregationDimensions;
		var inaExceptionAggregationDimensions;
		if (oFF.notNull(exceptionAggregationType)) {
			inaMember.putString("ExceptionAggregation",
					exceptionAggregationType.getName());
		}
		exceptionAggregationDimensions = member
				.getExceptionAggregationDimensions();
		if (oFF.notNull(exceptionAggregationDimensions)
				&& exceptionAggregationDimensions.hasElements()) {
			inaExceptionAggregationDimensions = inaMember
					.putNewList("ExceptionAggregationDimensions");
			inaExceptionAggregationDimensions
					.addAllStrings(exceptionAggregationDimensions);
		}
	};
	oFF.QInAMember.prototype.getComponentType = function() {
		return oFF.MemberType.ABSTRACT_MEMBER;
	};
	oFF.QInAMember.prototype.importComponentWithStructure = function(importer,
			inaStructure, modelComponent, parentComponent, context) {
		var queryModel = context.getQueryModel();
		var dimension = parentComponent;
		var newMemberType;
		var newInAMemberType;
		var inaSelection;
		var member;
		var inaAggregationType;
		var aggregationType;
		var qm;
		var inaExceptionAggregationDimensions;
		var exceptionDimSize;
		var idx;
		if (oFF.isNull(dimension)) {
			dimension = queryModel.getMeasureDimension();
		}
		if (inaStructure.containsKey("MemberType")) {
			newInAMemberType = inaStructure.getStringByKeyExt("MemberType",
					"Measure");
			newMemberType = oFF.QInAConverter
					.lookupMeasureStructureMemberType(newInAMemberType);
			if (oFF.isNull(newMemberType)) {
				importer.addError(oFF.ErrorCodes.INVALID_STATE,
						oFF.XStringUtils.concatenate3(
								"MeasureStructure->MemberType unsupported: '",
								newInAMemberType, "'"));
				return null;
			}
		} else {
			if (inaStructure.containsKey("Formula")) {
				newMemberType = oFF.MemberType.FORMULA;
			} else {
				inaSelection = inaStructure.getStructureByKey("Selection");
				if (oFF.notNull(inaSelection)) {
					if (inaSelection.containsKey("Operator")) {
						newMemberType = oFF.MemberType.RESTRICTED_MEASURE;
					} else {
						newMemberType = oFF.MemberType.MEASURE;
					}
				} else {
					newMemberType = oFF.MemberType.MEASURE;
				}
			}
		}
		if (newMemberType === oFF.MemberType.RESTRICTED_MEASURE) {
			member = importer.importRestrictedMeasure(inaStructure, dimension,
					context);
		} else {
			if (newMemberType === oFF.MemberType.FORMULA) {
				member = importer.importFormulaMeasure(inaStructure, dimension,
						queryModel);
			} else {
				if (newMemberType === oFF.MemberType.MEASURE) {
					member = importer.importBasicMeasure(inaStructure,
							dimension, context);
				} else {
					member = null;
				}
			}
		}
		if (oFF.notNull(member)) {
			oFF.QInAMember.importQdMemberProperties(importer, member,
					inaStructure);
			if (inaStructure.containsKey("PresentationSignReversal")) {
				member.setPresentationSignReversal(inaStructure
						.getBooleanByKey("PresentationSignReversal"));
			}
			inaAggregationType = inaStructure.getIntegerByKeyExt(
					"[Measures].[Aggregation]", -1);
			aggregationType = oFF.QInAConverter
					.lookupAggregationType2(inaAggregationType);
			if (oFF.notNull(aggregationType)) {
				member.setAggregationType(aggregationType);
			}
			this.setPrecisionAndScale(importer, inaStructure, queryModel,
					member);
			member.setUnitType(oFF.UnitType.lookup(inaStructure
					.getStringByKey("UnitType")));
			member.setUnitFixed(inaStructure.getStringByKey("UnitFixed"));
			member.setUnitName(inaStructure.getStringByKey("UnitName"));
			member.setUnitTextName(inaStructure.getStringByKey("UnitTextName"));
			importer.importExceptions(inaStructure, member);
			if (oFF.notNull(parentComponent)) {
				qm = parentComponent.getContext().getQueryModel();
				if (oFF.notNull(qm)
						&& qm.supportsExceptionAggregationDimsFormulas()
						|| importer.supportsExceptionAggregationDimsFormulas) {
					member.clearExceptionAggregationDimensions();
				}
				member.setExceptionAggregationType(null);
				inaExceptionAggregationDimensions = inaStructure
						.getListByKey("ExceptionAggregationDimensions");
				if (oFF.notNull(inaExceptionAggregationDimensions)) {
					exceptionDimSize = inaExceptionAggregationDimensions.size();
					for (idx = 0; idx < exceptionDimSize; idx++) {
						member
								.addExceptionAggregationDimensionName(inaExceptionAggregationDimensions
										.getStringAt(idx));
					}
				}
				member.setExceptionAggregationType(oFF.AggregationType
						.lookupOrCreate(inaStructure
								.getStringByKey("ExceptionAggregation")));
			}
		}
		return member;
	};
	oFF.QInAMember.prototype.exportComponentWithStructure = function(exporter,
			modelComponent, inaStructure, flags) {
		var componentType = modelComponent.getComponentType();
		var member;
		var exportBasicMeasures;
		var structureMember;
		var inaMemberType;
		if (componentType.isTypeOf(oFF.MemberType.MEASURE)) {
			member = modelComponent;
			exporter.exportExceptions(member, inaStructure);
			if (componentType === oFF.MemberType.BASIC_MEASURE) {
				exportBasicMeasures = true;
				if (!modelComponent.getQueryModel().isExportingEachMeasure()
						&& exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA)) {
					structureMember = modelComponent;
					if (exporter.supportsExceptionsV2
							|| !oFF.XCollectionUtils
									.hasElements(structureMember
											.getExceptions())) {
						exportBasicMeasures = false;
					}
				}
				if (exportBasicMeasures) {
					exporter.exportBasicMeasure(modelComponent, inaStructure);
				}
			} else {
				if (componentType === oFF.MemberType.FORMULA) {
					exporter.exportFormulaMeasure(modelComponent, inaStructure);
				} else {
					if (componentType === oFF.MemberType.RESTRICTED_MEASURE) {
						exporter.exportRestrictedMeasure(modelComponent,
								inaStructure);
					}
				}
			}
			if (inaStructure.hasElements()) {
				oFF.QInAMember.exportQd(exporter, member, inaStructure);
			}
			if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
				inaMemberType = oFF.QInAConverter
						.lookupMeasureStructureMemberTypeIna(member
								.getMemberType());
				inaStructure.putString("MemberType", inaMemberType);
			}
		}
		return inaStructure;
	};
	oFF.QInAMember.prototype.setPrecisionAndScale = function(importer,
			inaStructure, queryModel, member) {
		var numericPrecision = -1;
		var numericScale = -1;
		if (importer.isAbap(queryModel)) {
			numericPrecision = inaStructure.getIntegerByKeyExt("Digits", -1);
			numericScale = inaStructure.getIntegerByKeyExt("FractDigits", -1);
		} else {
			numericPrecision = inaStructure.getIntegerByKeyExt(
					"[Measures].[Digits]", -1);
			numericScale = inaStructure.getIntegerByKeyExt(
					"[Measures].[FractDigits]", -1);
		}
		if (numericPrecision !== -1) {
			member.setNumericPrecision(numericPrecision);
		}
		if (numericScale !== -1) {
			member.setNumericScale(numericScale);
		}
	};
	oFF.QInAMemberBasicMeasure = function() {
	};
	oFF.QInAMemberBasicMeasure.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAMemberBasicMeasure.prototype.getComponentType = function() {
		return oFF.MemberType.BASIC_MEASURE;
	};
	oFF.QInAMemberBasicMeasure.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var dimension = parentComponent;
		var newMemberName = inaStructure.getStringByKey("Name");
		var newMemberText = inaStructure.getStringByKey("Description");
		var keyField;
		var keyName;
		var textField;
		var textName;
		var memberOperand;
		var isFilterOnMeasures;
		var isFilterEqual;
		var structureMember;
		var member;
		var inaExceptionAggregationDimensions;
		var exceptionSize;
		var idx;
		var exceptionAggregation;
		var inaAggregationDimension;
		if (oFF.isNull(newMemberName) && oFF.isNull(newMemberText)) {
			keyField = dimension.getKeyField();
			keyName = keyField.getName();
			newMemberName = inaStructure.getStringByKey(keyName);
			textField = dimension.getTextField();
			textName = null;
			if (oFF.notNull(textField)) {
				textName = textField.getName();
			}
			newMemberText = inaStructure.getStringByKey(textName);
		}
		if (oFF.XStringUtils.isNullOrEmpty(newMemberName)) {
			memberOperand = inaStructure.getStructureByKey("MemberOperand");
			if (oFF.notNull(memberOperand)) {
				isFilterOnMeasures = oFF.XString.isEqual(memberOperand
						.getStringByKey("AttributeName"), "Measures");
				isFilterEqual = oFF.QInAConverter
						.lookupComparison(memberOperand
								.getStringByKey("Comparison")) === oFF.ComparisonOperator.EQUAL;
				if (isFilterOnMeasures && isFilterEqual) {
					newMemberName = memberOperand.getStringByKey("Value");
				}
			}
		}
		structureMember = dimension.getStructureMember(newMemberName);
		member = structureMember;
		if (oFF.isNull(member) && oFF.notNull(newMemberName)) {
			if (!inaStructure.containsKey("Selection")) {
				member = dimension.addNewBasicMeasure(newMemberName,
						newMemberText);
			}
		}
		if (oFF.notNull(member)) {
			if (dimension.getQueryModel()
					.supportsExceptionAggregationDimsFormulas()) {
				member.clearExceptionAggregationDimensions();
				member.setExceptionAggregationType(null);
				inaExceptionAggregationDimensions = inaStructure
						.getListByKey("ExceptionAggregationDimensions");
				if (oFF.notNull(inaExceptionAggregationDimensions)) {
					exceptionSize = inaExceptionAggregationDimensions.size();
					for (idx = 0; idx < exceptionSize; idx++) {
						member
								.addExceptionAggregationDimensionName(inaExceptionAggregationDimensions
										.getStringAt(idx));
					}
				}
				exceptionAggregation = inaStructure
						.getStringByKey("ExceptionAggregation");
				member.setExceptionAggregationType(oFF.AggregationType
						.lookupOrCreate(exceptionAggregation));
			} else {
				inaAggregationDimension = inaStructure
						.getStringByKey("AggregationDimension");
				if (oFF.XStringUtils
						.isNotNullAndNotEmpty(inaAggregationDimension)) {
					member.setAggregationDimensionName(inaAggregationDimension);
				}
			}
			oFF.QInAMember.importQdMemberProperties(importer, member,
					inaStructure);
			importer.importExceptions(inaStructure, member);
		}
		return member;
	};
	oFF.QInAMemberBasicMeasure.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var basicMeasure = modelComponent;
		var memberOperandElement;
		var basicAggregationType;
		var queryModel;
		var basicAggregationDimensionName;
		var value;
		var fieldValueType;
		var measureSorting;
		if (basicMeasure.getDimension().getDimensionType() === oFF.DimensionType.ACCOUNT) {
			inaStructure.putString("Name", basicMeasure.getName());
			return inaStructure;
		}
		memberOperandElement = oFF.PrFactory.createStructure();
		memberOperandElement.putString("AttributeName", "Measures");
		inaStructure.put("MemberOperand", memberOperandElement);
		basicAggregationType = basicMeasure.getAggregationType();
		if (oFF.notNull(basicAggregationType)) {
			inaStructure.putString("Aggregation", basicAggregationType
					.toString());
		}
		queryModel = basicMeasure.getQueryModel();
		if (!queryModel.supportsExceptionAggregationDimsFormulas()) {
			basicAggregationDimensionName = basicMeasure
					.getAggregationDimensionName();
			if (oFF.notNull(basicAggregationDimensionName)) {
				inaStructure.putString("AggregationDimension",
						basicAggregationDimensionName);
			}
		}
		value = basicMeasure.getKeyFieldValue();
		fieldValueType = value.getValueType();
		memberOperandElement.putString("Comparison", oFF.QInAConverter
				.lookupComparisonInA(oFF.ComparisonOperator.EQUAL));
		if (exporter.isVirtualInA(queryModel)) {
			memberOperandElement.putStringNotNullAndNotEmpty("Description",
					basicMeasure.getText());
		}
		oFF.QInAValueUtils.exportValue(exporter, "Value", memberOperandElement,
				value, fieldValueType);
		if (!exporter.supportsExtendedSort
				&& !exporter.isVirtualInA(queryModel)) {
			measureSorting = queryModel.getSortingManager().getMeasureSorting(
					basicMeasure, false);
			if (oFF.notNull(measureSorting)) {
				inaStructure.putInteger("SortOrder", oFF.QInAConverter
						.lookupSortDirectionInA(measureSorting.getDirection()));
			} else {
				inaStructure.putInteger("SortOrder", 0);
			}
		}
		return inaStructure;
	};
	oFF.QInAMemberFormulaMeasure = function() {
	};
	oFF.QInAMemberFormulaMeasure.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAMemberFormulaMeasure.importQdFormula = function(importer,
			structure, inaFormula, formulaItemx, context) {
		var inaFunction;
		var formulaItem;
		var functionName;
		var functionParameters;
		var newFormulaFunction;
		var paramSize;
		var paraIdx;
		var funcPara;
		var solveOrder;
		var constPara;
		var formulaConstant;
		var valueIs;
		var value;
		var queryModel;
		var variableManager;
		var variable;
		var valueTypePara;
		var valueIsNull;
		var constUnit;
		var constCurrency;
		var memberPara;
		var formulaMember;
		var memberParaName;
		var attribute;
		var attributeName;
		var formulaAttribute;
		if (oFF.isNull(inaFormula)) {
			return null;
		}
		inaFunction = inaFormula.getStructureByKey("Function");
		formulaItem = formulaItemx;
		if (oFF.notNull(inaFunction)) {
			functionName = inaFunction.getStringByKey("Name");
			functionParameters = inaFunction.getListByKey("Parameters");
			newFormulaFunction = oFF.QFactory.newFormulaFunction(context);
			if (oFF.notNull(functionParameters)) {
				newFormulaFunction.setFunctionName(functionName);
				paramSize = functionParameters.size();
				for (paraIdx = 0; paraIdx < paramSize; paraIdx++) {
					funcPara = functionParameters.getStructureAt(paraIdx);
					oFF.QInAMemberFormulaMeasure.importQdFormula(importer,
							structure, funcPara, newFormulaFunction, context);
				}
			}
			solveOrder = inaFormula.getIntegerByKeyExt("SolveOrder", 0);
			newFormulaFunction.setSolveOrder(solveOrder);
			if (oFF.isNull(formulaItem)) {
				formulaItem = newFormulaFunction;
			} else {
				formulaItem.add(newFormulaFunction);
			}
		} else {
			constPara = inaFormula.getStructureByKey("Constant");
			if (oFF.notNull(constPara)) {
				formulaConstant = oFF.QFactory.newFormulaConstant(context);
				valueIs = constPara.getStringByKey("ValueIs");
				if (oFF.XString.isEqual("Variable", valueIs)) {
					value = constPara.getStringByKey("Value");
					if (oFF.XStringUtils.isNotNullAndNotEmpty(value)) {
						queryModel = structure.getQueryModel();
						variableManager = queryModel.getVariableManager();
						variable = variableManager.getVariables().getByKey(
								value);
						formulaConstant.setVariable(variable);
					}
					if (oFF.isNull(formulaItem)) {
						formulaItem = formulaConstant;
					} else {
						formulaItem.add(formulaConstant);
					}
				} else {
					valueTypePara = constPara.getStringByKey("ValueType");
					valueIsNull = constPara.getElementTypeByKey("Value") === oFF.PrElementType.THE_NULL;
					if (oFF.XString.isEqual(valueTypePara, "Number")) {
						if (valueIsNull) {
							formulaConstant
									.setNullByType(oFF.XValueType.DOUBLE);
						} else {
							formulaConstant.setDouble(constPara
									.getDoubleByKey("Value"));
						}
					} else {
						if (oFF.XString.isEqual(valueTypePara, "String")) {
							if (valueIsNull) {
								formulaConstant
										.setNullByType(oFF.XValueType.STRING);
							} else {
								formulaConstant.setString(constPara
										.getStringByKey("Value"));
							}
						} else {
							if (oFF.XString.isEqual(valueTypePara, "Bool")) {
								if (valueIsNull) {
									formulaConstant
											.setNullByType(oFF.XValueType.BOOLEAN);
								} else {
									formulaConstant.setBoolean(constPara
											.getBooleanByKey("Value"));
								}
							} else {
								if (oFF.XString.isEqual(valueTypePara,
										"DateTime")) {
									if (valueIsNull) {
										formulaConstant
												.setNullByType(oFF.XValueType.DATE_TIME);
									} else {
										formulaConstant
												.setDateTime(oFF.XDateTime
														.createDateTimeFromStringWithFlag(
																constPara
																		.getStringByKey("Value"),
																false));
									}
								} else {
									if (oFF.XString.isEqual(valueTypePara,
											"Date")) {
										if (valueIsNull) {
											formulaConstant
													.setNullByType(oFF.XValueType.DATE);
										} else {
											formulaConstant
													.setDate(oFF.XDate
															.createDateFromStringWithFlag(
																	constPara
																			.getStringByKey("Value"),
																	false));
										}
									} else {
										importer
												.addError(
														oFF.ErrorCodes.INVALID_TOKEN,
														"Constant value type is not supported");
										return null;
									}
								}
							}
						}
					}
					constUnit = constPara.getStringByKey("Unit");
					if (oFF.XStringUtils.isNotNullAndNotEmpty(constUnit)) {
						formulaConstant.setUnit(constUnit);
					}
					constCurrency = constPara.getStringByKey("Currency");
					if (oFF.XStringUtils.isNotNullAndNotEmpty(constCurrency)) {
						formulaConstant.setCurrency(constCurrency);
					}
					if (oFF.isNull(formulaItem)) {
						formulaItem = formulaConstant;
					} else {
						formulaItem.add(formulaConstant);
					}
				}
			} else {
				memberPara = inaFormula.getStructureByKey("Member");
				if (oFF.notNull(memberPara)) {
					formulaMember = oFF.QFactory.newFormulaMember(context);
					memberParaName = memberPara.getStringByKey("Name");
					formulaMember.setMemberName(memberParaName);
					formulaMember.setDimensionName(memberPara
							.getStringByKey("Dimension"));
					if (oFF.isNull(formulaItem)) {
						formulaItem = formulaMember;
					} else {
						formulaItem.add(formulaMember);
					}
				} else {
					attribute = inaFormula.getStructureByKey("AttributeValue");
					if (oFF.notNull(attribute)) {
						attributeName = attribute.getStringByKey("Name");
						formulaAttribute = oFF.QFactory
								.newFormulaAttributeWithName(context,
										attributeName);
						if (oFF.isNull(formulaItem)) {
							formulaItem = formulaAttribute;
						} else {
							formulaItem.add(formulaAttribute);
						}
					}
				}
			}
		}
		return formulaItem;
	};
	oFF.QInAMemberFormulaMeasure.buildFormula = function(exporter,
			formulaMeasure, inaContainer) {
		var componentType;
		var fic;
		var constStructure;
		var ficUnit;
		var ficCurrency;
		var fio;
		var opStructure;
		var theOperator;
		var parameters;
		var leftSide;
		var rightSide;
		var fif;
		var funcStructure;
		var funcParameters;
		var i;
		var iqFormulaItem;
		var parameter;
		var solveOrder;
		var fim;
		var memberStructure;
		var memberVariable;
		var fia;
		var inaAttributeValue;
		if (oFF.notNull(formulaMeasure)) {
			componentType = formulaMeasure.getComponentType();
			if (componentType === oFF.OlapComponentType.FORMULA_CONSTANT) {
				fic = formulaMeasure;
				constStructure = inaContainer.putNewStructure("Constant");
				ficUnit = fic.getUnit();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(ficUnit)) {
					constStructure.putString("Unit", ficUnit);
				}
				ficCurrency = fic.getCurrency();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(ficCurrency)) {
					constStructure.putString("Currency", ficCurrency);
				}
				oFF.QInAMemberFormulaMeasure.setFormulaConstantValue(
						constStructure, fic);
			} else {
				if (componentType === oFF.OlapComponentType.FORMULA_OPERATION) {
					fio = formulaMeasure;
					opStructure = inaContainer.putNewStructure("Function");
					theOperator = fio.getOperator();
					opStructure.putString("Name", theOperator
							.getDisplayString());
					parameters = opStructure.putNewList("Parameters");
					leftSide = parameters.addNewStructure();
					oFF.QInAMemberFormulaMeasure.buildFormula(exporter, fio
							.getLeftSide(), leftSide);
					rightSide = parameters.addNewStructure();
					oFF.QInAMemberFormulaMeasure.buildFormula(exporter, fio
							.getRightSide(), rightSide);
				} else {
					if (componentType === oFF.OlapComponentType.FORMULA_FUNCTION) {
						fif = formulaMeasure;
						funcStructure = inaContainer
								.putNewStructure("Function");
						funcStructure.putString("Name", fif.getFunctionName());
						funcParameters = funcStructure.putNewList("Parameters");
						for (i = 0; i < fif.size(); i++) {
							iqFormulaItem = fif.get(i);
							parameter = funcParameters.addNewStructure();
							oFF.QInAMemberFormulaMeasure.buildFormula(exporter,
									iqFormulaItem, parameter);
						}
						solveOrder = fif.getSolveOrder();
						if (solveOrder !== 0) {
							inaContainer.putInteger("SolveOrder", solveOrder);
						}
					} else {
						if (componentType === oFF.OlapComponentType.FORMULA_ITEM_MEMBER) {
							fim = formulaMeasure;
							memberStructure = inaContainer
									.putNewStructure("Member");
							memberVariable = fim.getVariable();
							if (oFF.notNull(memberVariable)) {
								memberStructure.putString("Name", fim
										.getVariable().getName());
								memberStructure.putString("NameIs", "Variable");
							} else {
								memberStructure.putString("Name", fim
										.getMemberName());
								memberStructure.putStringNotNull("Dimension",
										fim.getDimensionName());
							}
						} else {
							if (componentType === oFF.OlapComponentType.FORMULA_ITEM_ATTRIBUTE) {
								fia = formulaMeasure;
								inaAttributeValue = inaContainer
										.putNewStructure("AttributeValue");
								inaAttributeValue.putString("Name", fia
										.getFieldName());
							}
						}
					}
				}
			}
		}
	};
	oFF.QInAMemberFormulaMeasure.setFormulaConstantValue = function(
			constStructure, fic) {
		var valueIsNull = fic.getValue() === null;
		var variable = fic.getVariable();
		var valueType;
		var timeSpanValue;
		if (valueIsNull && oFF.isNull(variable)) {
			constStructure.putNull("Value");
		}
		valueType = fic.getValueType();
		if (valueType === oFF.XValueType.INTEGER) {
			constStructure.putString("ValueType", "Number");
			if (!valueIsNull) {
				constStructure.putInteger("Value", fic.getInteger());
			}
		} else {
			if (valueType === oFF.XValueType.DOUBLE
					|| valueType === oFF.XValueType.DECIMAL_FLOAT) {
				constStructure.putString("ValueType", "Number");
				if (!valueIsNull) {
					constStructure.putDouble("Value", fic.getDouble());
				}
			} else {
				if (valueType === oFF.XValueType.LONG) {
					constStructure.putString("ValueType", "Number");
					if (!valueIsNull) {
						constStructure.putLong("Value", fic.getLong());
					}
				} else {
					if (valueType === oFF.XValueType.STRING) {
						constStructure.putString("ValueType", "String");
						if (!valueIsNull) {
							constStructure.putString("Value", fic.getString());
						}
					} else {
						if (valueType === oFF.XValueType.BOOLEAN) {
							constStructure.putString("ValueType", "Bool");
							if (!valueIsNull) {
								constStructure.putBoolean("Value", fic
										.getBoolean());
							}
						} else {
							if (valueType === oFF.XValueType.DATE) {
								constStructure.putString("ValueType", "Date");
								if (!valueIsNull) {
									constStructure.putString("Value", fic
											.getDate().toString());
								}
							} else {
								if (valueType === oFF.XValueType.DATE_TIME) {
									constStructure.putString("ValueType",
											"Date");
									if (!valueIsNull) {
										constStructure.putString("Value", fic
												.getDateTime().toString());
									}
								} else {
									if (valueType.isSpatial()) {
										constStructure.putString("ValueType",
												"String");
										if (!valueIsNull) {
											constStructure.putString("Value",
													fic.getGeometry().toWKT());
										}
									} else {
										if (valueType === oFF.XValueType.TIMESPAN) {
											constStructure.putString(
													"ValueType", "String");
											if (!valueIsNull) {
												timeSpanValue = fic
														.getTimeSpan();
												constStructure.putString(
														"Value", timeSpanValue
																.toString());
											}
										} else {
											if (valueType === oFF.XValueType.VARIABLE) {
												oFF.QInAExportUtil
														.setNameIfNotNull(
																constStructure,
																"Value",
																variable);
												constStructure.putString(
														"ValueIs", "Variable");
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};
	oFF.QInAMemberFormulaMeasure.prototype.getComponentType = function() {
		return oFF.MemberType.FORMULA;
	};
	oFF.QInAMemberFormulaMeasure.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var dimension = parentComponent;
		var queryModel = context.getQueryModel();
		var newMemberName;
		var newMemberText;
		var keyField;
		var keyName;
		var textField;
		var textName;
		var member;
		var inaFormula;
		var importFormula;
		if (oFF.isNull(dimension)) {
			dimension = queryModel.getMeasureDimension();
		}
		newMemberName = inaStructure.getStringByKey("Name");
		newMemberText = inaStructure.getStringByKey("Description");
		if (oFF.isNull(newMemberName) && oFF.isNull(newMemberText)) {
			if (oFF.notNull(dimension)) {
				keyField = dimension.getKeyField();
				keyName = keyField.getName();
				newMemberName = inaStructure.getStringByKey(keyName);
				textField = dimension.getTextField();
				textName = null;
				if (oFF.notNull(textField)) {
					textName = textField.getName();
				}
				newMemberText = inaStructure.getStringByKey(textName);
			}
		}
		member = oFF.QFormulaMeasure._createFormulaMeasure(context, dimension);
		if (oFF.XStringUtils.isNullOrEmpty(newMemberName)
				&& oFF.XStringUtils.isNullOrEmpty(newMemberText)) {
			member.setName(inaStructure.getStringByKey("Name"));
			member.setText(inaStructure.getStringByKey("Description"));
		} else {
			member.setName(newMemberName);
			member.setText(newMemberText);
		}
		inaFormula = inaStructure.getStructureByKey("Formula");
		importFormula = oFF.QInAMemberFormulaMeasure.importQdFormula(importer,
				dimension, inaFormula, null, context);
		oFF.QInAMember.importQdMemberProperties(importer, member, inaStructure);
		importer.importExceptions(inaStructure, member);
		member.setFormula(importFormula);
		if (member.supportsCalculatedBeforeAggregation()) {
			member.setIsCalculatedBeforeAggregation(oFF.XString.isEqual(
					"CalculationBeforeAggregation", inaStructure
							.getStringByKey("ExecutionStep")));
		}
		return member;
	};
	oFF.QInAMemberFormulaMeasure.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var formulaMeasure = modelComponent;
		var text;
		var isAbap;
		var inaFormula;
		inaStructure.putString("Name", formulaMeasure.getName());
		text = formulaMeasure.getText();
		isAbap = exporter.isAbap(formulaMeasure.getQueryModel());
		if (isAbap || !isAbap && oFF.notNull(text)) {
			inaStructure.putString("Description", text);
		}
		inaFormula = oFF.PrFactory.createStructure();
		oFF.QInAMemberFormulaMeasure.buildFormula(exporter, formulaMeasure
				.getFormula(), inaFormula);
		if (inaFormula.hasElements()) {
			inaStructure.put("Formula", inaFormula);
		}
		if (formulaMeasure.supportsCalculatedBeforeAggregation()) {
			if (formulaMeasure.isCalculatedBeforeAggregation()) {
				inaStructure.putString("ExecutionStep",
						"CalculationBeforeAggregation");
			}
		}
		return inaStructure;
	};
	oFF.QInAMemberRestrictedMeasure = function() {
	};
	oFF.QInAMemberRestrictedMeasure.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAMemberRestrictedMeasure.prototype.getComponentType = function() {
		return oFF.MemberType.RESTRICTED_MEASURE;
	};
	oFF.QInAMemberRestrictedMeasure.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var member;
		var dimension;
		var newMemberName;
		var newMemberText;
		var keyField;
		var keyName;
		var textField;
		var textName;
		var inaAggregationDimension;
		if (oFF.isNull(modelComponent)) {
			dimension = parentComponent;
			newMemberName = inaStructure.getStringByKey("Name");
			newMemberText = inaStructure.getStringByKey("Description");
			if (oFF.isNull(newMemberName) && oFF.isNull(newMemberText)) {
				keyField = dimension.getKeyField();
				keyName = keyField.getName();
				newMemberName = inaStructure.getStringByKey(keyName);
				textField = dimension.getTextField();
				textName = null;
				if (oFF.notNull(textField)) {
					textName = textField.getName();
				}
				newMemberText = inaStructure.getStringByKey(textName);
			}
			member = dimension.addNewRestrictedMeasure(newMemberName,
					newMemberText);
		} else {
			member = modelComponent;
		}
		inaAggregationDimension = inaStructure
				.getStringByKey("AggregationDimension");
		if (oFF.XStringUtils.isNotNullAndNotEmpty(inaAggregationDimension)) {
			member.setAggregationDimensionName(inaAggregationDimension);
		}
		importer.importFilterExpression(member.getFilter(), inaStructure,
				member, context);
		oFF.QInAMember.importQdMemberProperties(importer, member, inaStructure);
		importer.importExceptions(inaStructure, member);
		return member;
	};
	oFF.QInAMemberRestrictedMeasure.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var restrictedMeasure = modelComponent;
		var text;
		var isAbap;
		var restrictedAggregationType;
		var inaAggType;
		var aggregationDimensionName;
		var inaSelection;
		var filter;
		var filterRoot;
		var sb;
		inaStructure.putString("Name", restrictedMeasure.getName());
		text = restrictedMeasure.getText();
		isAbap = exporter.isAbap(restrictedMeasure.getQueryModel());
		if (isAbap || !isAbap && oFF.notNull(text)) {
			inaStructure.putString("Description", text);
		}
		restrictedAggregationType = restrictedMeasure.getAggregationType();
		if (oFF.notNull(restrictedAggregationType)) {
			inaAggType = oFF.QInAConverter
					.lookupAggregationTypeInA(restrictedAggregationType);
			inaStructure.putString("Aggregation", inaAggType);
		}
		if (!restrictedMeasure.supportsExceptionAggregationDimsFormulas()) {
			aggregationDimensionName = restrictedMeasure
					.getAggregationDimensionName();
			if (oFF.notNull(aggregationDimensionName)) {
				inaStructure.putString("AggregationDimension",
						aggregationDimensionName);
			}
		}
		inaSelection = null;
		filter = restrictedMeasure.getFilter();
		filterRoot = filter.getFilterRootElement();
		if (oFF.notNull(filterRoot)) {
			inaSelection = exporter.exportFilterElement(filterRoot);
		} else {
			if (restrictedMeasure.getAggregationDimensionName() !== null) {
				inaSelection = oFF.PrFactory.createStructure();
				sb = oFF.XStringBuffer.create();
				sb.append(restrictedMeasure.getName());
				sb.append(":");
				sb.append(restrictedMeasure.getAggregationDimensionName());
				inaSelection.putString("MeasureOperand", sb.toString());
			}
		}
		if (oFF.notNull(inaSelection)) {
			inaStructure.put("Selection", inaSelection);
		}
		return inaStructure;
	};
	oFF.QInAMembersAll = function() {
	};
	oFF.QInAMembersAll.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAMembersAll.prototype.getComponentType = function() {
		return oFF.OlapComponentType.MEMBERS;
	};
	oFF.QInAMembersAll.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var dimension = modelComponent;
		var inaMemberList;
		var structureLayout;
		var inaMemberListSize;
		var iMember;
		var inaMember;
		var member;
		var member2;
		if (dimension.supportsCustomMembers()) {
			dimension.removeCustomMembers();
		}
		inaMemberList = inaStructure.getListByKey("MembersRepo");
		if (oFF.isNull(inaMemberList)) {
			inaMemberList = inaStructure.getListByKey("Members");
			if (oFF.isNull(inaMemberList)) {
				return null;
			}
		}
		structureLayout = dimension.getStructureLayout();
		if (oFF.notNull(structureLayout)) {
			structureLayout.clear();
			inaMemberListSize = inaMemberList.size();
			for (iMember = 0; iMember < inaMemberListSize; iMember++) {
				inaMember = inaMemberList.getStructureAt(iMember);
				member = importer.importStructureMember(dimension, inaMember,
						context);
				if (oFF.notNull(member)) {
					member2 = dimension.getStructureMember(member.getName());
					if (oFF.isNull(member2)) {
						dimension.addMeasure(member);
					} else {
						if (member2 !== member) {
							throw oFF.XException
									.createIllegalStateException("Internal error: New member with same name not allowed");
						}
						structureLayout.removeElement(member2);
						structureLayout.add(member2);
					}
				}
			}
		}
		return dimension;
	};
	oFF.QInAMembersAll.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var dimension = modelComponent;
		var allStructureMembers = dimension.getStructureLayout();
		var isDimensionMeasure;
		var membersList;
		var size;
		var idxMember;
		var structureMember;
		var inaMember;
		var type;
		if (oFF.notNull(allStructureMembers)) {
			isDimensionMeasure = dimension.isMeasureStructure();
			if (!isDimensionMeasure && allStructureMembers.isEmpty()) {
				return null;
			}
			if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA)) {
				membersList = inaStructure.putNewList("Members");
			} else {
				membersList = inaStructure.putNewList("MembersRepo");
			}
			size = allStructureMembers.size();
			for (idxMember = 0; idxMember < size; idxMember++) {
				structureMember = allStructureMembers.get(idxMember);
				if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA)) {
					inaMember = exporter.exportStructureMember(structureMember);
				} else {
					type = structureMember.getMemberType();
					if (type === oFF.MemberType.RESTRICTED_MEASURE
							|| type === oFF.MemberType.FORMULA) {
						inaMember = exporter
								.exportStructureMember(structureMember);
						inaMember.putString("MemberType", oFF.QInAConverter
								.lookupMeasureStructureMemberTypeIna(type));
					} else {
						inaMember = exporter
								.exportStructureMember(structureMember);
					}
				}
				if (inaMember.hasElements()) {
					membersList.add(inaMember);
				}
			}
		}
		return inaStructure;
	};
	oFF.QInAQuery = function() {
	};
	oFF.QInAQuery.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAQuery.prototype.getComponentType = function() {
		return oFF.OlapComponentType.QUERY_MODEL;
	};
	oFF.QInAQuery.prototype.importComponentWithStructure = function(importer,
			inaStructure, modelComponent, parentComponent, context) {
		var queryModel = modelComponent;
		var inaDefinition = inaStructure;
		var inaQueries = inaDefinition.getListByKey("Queries");
		var resultStructureController;
		var queryManager;
		var inaPreQueries;
		var mainQuerySystemname;
		var inaDataSource;
		if (oFF.notNull(inaQueries)) {
			inaDefinition = inaQueries.getStructureAt(inaQueries.size() - 1);
		}
		if (oFF.notNull(inaDefinition)
				&& inaDefinition.containsKey("Analytics")) {
			inaDefinition = inaDefinition.getStructureByKey("Analytics");
			if (oFF.notNull(inaDefinition)
					&& inaDefinition.containsKey("Definition")) {
				inaDefinition = inaDefinition.getStructureByKey("Definition");
			}
		}
		if (oFF.notNull(inaDefinition)) {
			importer.importDimensions(inaDefinition, queryModel, queryModel);
			importer.importFilter(inaDefinition, queryModel.getFilterBase(),
					queryModel);
			importer.importSortingManager(inaDefinition, queryModel
					.getSortingManagerBase(), queryModel);
			importer.importDrillManager(inaDefinition, queryModel
					.getDrillManager(), queryModel);
			importer.importVariableContainer(inaDefinition, queryModel
					.getVariableManagerBase(), queryModel);
			importer.importQuerySettings(inaDefinition, queryModel);
			importer.importDataCells(inaDefinition, queryModel);
			importer.importConditionManager(inaDefinition, queryModel
					.getConditionManagerBase(), queryModel);
			importer
					.importUniversalDisplayHierarchies(inaDefinition,
							queryModel.getUniversalDisplayHierarchiesBase(),
							queryModel);
			importer.importExceptions(inaDefinition, queryModel);
			if (importer.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
				resultStructureController = queryModel
						.getResultStructureController();
				importer.importComponent(null, inaDefinition,
						resultStructureController, queryModel, queryModel);
				queryManager = queryModel.getQueryManager();
				if (oFF.notNull(queryManager)) {
					queryManager
							.setResultSetPersistanceTargetTable(inaStructure
									.getStringByKey("ResultSetPersistanceTable"));
					queryManager
							.setResultSetPersistanceTargetSchema(inaStructure
									.getStringByKey("ResultSetPersistanceSchema"));
					queryManager.setResultSetPersistenceIdentifier(inaStructure
							.getStringByKey("ResultSetPersistanceIdentifier"));
				}
				inaPreQueries = inaDefinition.getListByKey("PreQueries");
				if (oFF.notNull(inaPreQueries)) {
					mainQuerySystemname = null;
					inaDataSource = inaDefinition
							.getStructureByKey("DataSource");
					if (oFF.notNull(inaDataSource)) {
						mainQuerySystemname = inaDataSource
								.getStringByKey("System");
					}
					this.importPreQueries(importer, queryModel, inaPreQueries,
							mainQuerySystemname);
				}
			}
		}
		return queryModel;
	};
	oFF.QInAQuery.prototype.getInactiveCapabilities = function(queryModel) {
		var capabilities = oFF.XHashMapByString.create();
		var allCapabilities = oFF.InactiveCapabilities
				.getAllInactiveCapabilities();
		var allIterator = allCapabilities.getKeysAsIteratorOfString();
		var experimentalFeatureSet;
		var activatedIterator;
		while (allIterator.hasNext()) {
			capabilities.put(allIterator.next(), oFF.XBooleanValue
					.create(false));
		}
		experimentalFeatureSet = queryModel.getQueryManager()
				.getQueryServiceConfig().getExperimentalFeatureSet();
		if (oFF.notNull(experimentalFeatureSet)) {
			activatedIterator = experimentalFeatureSet
					.getKeysAsIteratorOfString();
			while (activatedIterator.hasNext()) {
				capabilities.put(activatedIterator.next(), oFF.XBooleanValue
						.create(true));
			}
		}
		return capabilities;
	};
	oFF.QInAQuery.prototype.importPreQueries = function(importer, queryModel,
			inaPreQueries, mainQuerySystemname) {
		var modeHolder = importer.getMode();
		var dsBuffer;
		var capabilitiesToActivate;
		var preQueriesSize;
		var i;
		var inaPreQuery;
		var inaRuntime;
		var inaDataSource;
		var commandFactory;
		var xCmdDeserialize;
		var preQuerySystemName;
		var processCommand;
		var preQuery;
		var inaPreQueryName;
		var preQueryExisting;
		importer.mode = importer.getOriginalMode();
		dsBuffer = oFF.XStringBuffer.create();
		capabilitiesToActivate = this.getInactiveCapabilities(queryModel);
		preQueriesSize = inaPreQueries.size();
		for (i = 0; i < preQueriesSize; i++) {
			inaPreQuery = inaPreQueries.getStructureAt(i);
			inaRuntime = inaPreQuery.getStructureByKey("Runtime");
			if (oFF.isNull(inaRuntime)) {
				inaRuntime = inaPreQuery;
			}
			inaDataSource = inaRuntime.getStructureByKey("DataSource");
			dsBuffer.clear();
			dsBuffer.append(inaDataSource.getStringByKey("Type")).append(":[");
			dsBuffer.append(inaDataSource.getStringByKey("SchemaName"));
			dsBuffer.append("][");
			dsBuffer.append(inaDataSource.getStringByKey("PackageName"));
			dsBuffer.append("][");
			dsBuffer.append(inaDataSource.getStringByKey("ObjectName")).append(
					"]");
			commandFactory = oFF.XCommandFactory.create(queryModel
					.getApplication());
			xCmdDeserialize = commandFactory
					.createCommand(oFF.CmdCreateQueryManager.CMD_NAME);
			xCmdDeserialize.addParameter(
					oFF.CmdCreateQueryManager.PARAM_I_APPLICATION, queryModel
							.getApplication());
			xCmdDeserialize
					.addParameter(
							oFF.CmdCreateQueryManager.PARAM_I_ENFORCE_INACTIVE_CAPABILITIES,
							capabilitiesToActivate);
			preQuerySystemName = inaDataSource.getStringByKey("System");
			if (importer.mode === oFF.QModelFormat.INA_REPOSITORY
					&& oFF.XString.isEqual(preQuerySystemName,
							mainQuerySystemname)) {
				preQuerySystemName = queryModel.getDataSource().getSystemName();
			}
			xCmdDeserialize.addParameterString(
					oFF.CmdCreateQueryManager.PARAM_I_SYSTEM,
					preQuerySystemName);
			xCmdDeserialize.addParameterString(
					oFF.CmdCreateQueryManager.PARAM_I_DATA_SOURCE, dsBuffer
							.toString());
			processCommand = xCmdDeserialize.processCommand(
					oFF.SyncType.BLOCKING, null, null);
			importer.addAllMessages(processCommand);
			oFF.XObjectExt.release(xCmdDeserialize);
			if (processCommand.isValid()) {
				preQuery = processCommand.getData().getResultParameter(
						oFF.CmdCreateQueryManager.PARAM_E_QUERY_MANAGER)
						.getQueryModel();
				importer.importPreQuery(inaPreQuery, preQuery);
				inaPreQueryName = inaPreQuery.getStringByKey("ObjectName");
				preQueryExisting = queryModel
						.getPreQueryByName(inaPreQueryName);
				if (oFF.isNull(preQueryExisting)) {
					queryModel.addPreQueryWithName(preQuery, inaPreQueryName);
				}
			}
		}
		importer.mode = modeHolder;
	};
	oFF.QInAQuery.prototype.exportComponentWithStructure = function(exporter,
			modelComponent, inaStructure, flags) {
		var queryModel = modelComponent;
		var withDataSource;
		var withVariables;
		var preQueries;
		var preQueriesSize;
		var inaPreQueries;
		var modeHolder;
		var i;
		var preQuery;
		var inaPreQuery;
		var preQueryName;
		var resultStructureController;
		var queryManager;
		var serviceConfig;
		exporter.exportUniversalDisplayHierarchies(queryModel
				.getUniversalDisplayHierarchies(), inaStructure);
		exporter.exportDrillManager(queryModel.getDrillManager(), inaStructure);
		withDataSource = oFF.XMath.binaryAnd(flags, oFF.QImExFlag.DATASOURCE) > 0;
		if (withDataSource) {
			oFF.QInADataSource
					.exportDataSource(
							exporter,
							queryModel.getDataSource(),
							queryModel
									.supportsAnalyticCapabilityActive(oFF.InACapabilities.RUN_AS_USER),
							inaStructure);
		}
		exporter.exportDimensions(queryModel, inaStructure);
		exporter.exportSortingManager(queryModel.getSortingManager(),
				inaStructure);
		if (!queryModel.hasProcessingStep()
				|| exporter.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
			exporter.exportDataCells(queryModel, inaStructure);
		}
		exporter.exportQuerySettings(queryModel, inaStructure);
		exporter.exportFilter(queryModel.getFilter(), inaStructure);
		exporter.exportConditionManager(queryModel.getConditionManager(),
				inaStructure);
		exporter.exportExceptions(queryModel, inaStructure);
		withVariables = oFF.XMath.binaryAnd(flags, oFF.QImExFlag.VARIABLES) > 0;
		if (withVariables
				&& exporter.mode !== oFF.QModelFormat.INA_REPOSITORY_NO_VARS) {
			if (queryModel.isExportingVariables()
					|| queryModel.hasProcessingStep()) {
				exporter.exportVariables(queryModel.getVariableContainer(),
						inaStructure);
			}
		}
		if (queryModel.isBatchModeForMicroCube()) {
			inaStructure.putString("Name", queryModel.getNameForMicroCubeUse());
		}
		if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
			preQueries = queryModel.getPreQueries();
			if (oFF.notNull(preQueries)) {
				preQueriesSize = preQueries.size();
				if (preQueriesSize > 0) {
					inaPreQueries = inaStructure.getListByKey("PreQueries");
					if (oFF.isNull(inaPreQueries)) {
						inaPreQueries = inaStructure.putNewList("PreQueries");
					}
					modeHolder = exporter.getMode();
					exporter.mode = exporter.getOriginalMode();
					for (i = 0; i < preQueriesSize; i++) {
						preQuery = preQueries.get(i);
						inaPreQuery = exporter.exportPreQuery(preQuery
								.getObject());
						preQueryName = preQuery.getName();
						inaPreQuery.putString("ObjectName", preQueryName);
						inaPreQueries.add(inaPreQuery);
					}
					exporter.mode = modeHolder;
					inaStructure.put("PreQueries", inaPreQueries);
				}
			}
			resultStructureController = queryModel
					.getResultStructureController();
			exporter.exportComponent(null, resultStructureController,
					inaStructure, flags);
			queryManager = queryModel.getQueryManager();
			serviceConfig = queryManager.getServiceConfig();
			inaStructure.putString("ExperimentalFeatures", serviceConfig
					.getExperimentalFeatures());
			inaStructure.putString("ResultSetPersistanceTable", queryManager
					.getResultSetPersistenceTable());
			inaStructure.putString("ResultSetPersistanceSchema", queryManager
					.getResultSetPersistenceSchema());
			inaStructure.putString("ResultSetPersistanceIdentifier",
					queryManager.getResultSetPersistenceIdentifier());
		}
		return inaStructure;
	};
	oFF.QInAQuerySettings = function() {
	};
	oFF.QInAQuerySettings.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAQuerySettings.prototype.getComponentType = function() {
		return oFF.OlapComponentType.QUERY_SETTINGS;
	};
	oFF.QInAQuerySettings.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var definitionNameString = oFF.PrUtils.getStringProperty(inaStructure,
				"Name");
		var queryModel = context.getQueryModel();
		var inaQuery;
		var inaCurrencyTranslation;
		var currencyTranslationDetails;
		var axesLayoutList;
		var len;
		var axesLayoutIndex;
		var axisLayoutStructure;
		var axisType;
		var axis;
		var orderedDimensionNamesList;
		var orderedDimensionNames;
		var dimensionNameIndex;
		var dimensionNameString;
		if (oFF.notNull(definitionNameString)) {
			queryModel.setDefinitionName(definitionNameString.getString());
		}
		inaQuery = inaStructure.getStructureByKey("Query");
		importer.importAxesSettings(inaQuery, queryModel);
		if (importer.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
			inaCurrencyTranslation = inaStructure
					.getStructureByKey("CurrencyTranslation");
			if (oFF.notNull(inaCurrencyTranslation)) {
				currencyTranslationDetails = queryModel
						.getCurrencyTranslationDetails();
				currencyTranslationDetails
						.setCurrencyTranslationName(inaCurrencyTranslation
								.getStringByKey("Name"));
				currencyTranslationDetails
						.setCurrencyTranslationOperation(oFF.CurrencyTranslationOperation
								.lookup(inaCurrencyTranslation
										.getStringByKey("Operation")));
				currencyTranslationDetails
						.setCurrencyTranslationTarget(inaCurrencyTranslation
								.getStringByKey("Target"));
			}
			axesLayoutList = oFF.PrUtils
					.getListProperty(inaQuery, "AxesLayout");
			len = oFF.PrUtils.getListSize(axesLayoutList, 0);
			for (axesLayoutIndex = 0; axesLayoutIndex < len; axesLayoutIndex++) {
				axisLayoutStructure = oFF.PrUtils.getStructureElement(
						axesLayoutList, axesLayoutIndex);
				axisType = oFF.AxisType.lookup(oFF.PrUtils
						.getStringValueProperty(axisLayoutStructure, "Axis",
								null));
				axis = queryModel.getAxis(axisType);
				if (oFF.isNull(axis)) {
					continue;
				}
				orderedDimensionNamesList = oFF.PrUtils.getListProperty(
						axisLayoutStructure, "OrderedDimensionNames");
				if (oFF.isNull(orderedDimensionNamesList)) {
					continue;
				}
				orderedDimensionNames = oFF.XListOfString.create();
				for (dimensionNameIndex = 0; dimensionNameIndex < oFF.PrUtils
						.getListSize(orderedDimensionNamesList, 0); dimensionNameIndex++) {
					dimensionNameString = oFF.PrUtils.getStringElement(
							orderedDimensionNamesList, dimensionNameIndex);
					if (oFF.isNull(dimensionNameString)) {
						continue;
					}
					orderedDimensionNames.add(dimensionNameString.getString());
				}
				axis.reOrderDimensions(orderedDimensionNames);
			}
		}
		return queryModel;
	};
	oFF.QInAQuerySettings.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var queryModel = modelComponent;
		var definitionName = queryModel.getDefinitionName();
		var inaQuery;
		var axesLayoutList;
		var allAxisTypes;
		var axisTypeIndex;
		var axisType;
		var axis;
		var dimensionNames;
		var axisLayoutStructure;
		var orderedDimensionNamesList;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(definitionName)) {
			inaStructure.putString("Name", definitionName);
		}
		if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA)
				&& !exporter.isAbap(queryModel)) {
			return inaStructure;
		}
		inaQuery = inaStructure.getStructureByKey("Query");
		if (oFF.isNull(inaQuery)) {
			inaQuery = inaStructure.putNewStructure("Query");
		}
		exporter.exportAxesSettings(queryModel, inaQuery);
		this.exportCurrencyTranslationDetails(inaStructure, queryModel);
		if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
			axesLayoutList = inaQuery.putNewList("AxesLayout");
			allAxisTypes = oFF.AxisType.getAll();
			for (axisTypeIndex = 0; axisTypeIndex < allAxisTypes.size(); axisTypeIndex++) {
				axisType = allAxisTypes.get(axisTypeIndex);
				axis = queryModel.getAxis(axisType);
				if (oFF.isNull(axis)) {
					continue;
				}
				dimensionNames = axis.getOrderedDimensionNames();
				if (oFF.isNull(dimensionNames)) {
					continue;
				}
				axisLayoutStructure = axesLayoutList.addNewStructure();
				axisLayoutStructure.putString("Axis", axis.getName());
				orderedDimensionNamesList = axisLayoutStructure
						.putNewList("OrderedDimensionNames");
				orderedDimensionNamesList.addAllStrings(dimensionNames);
			}
		}
		return inaStructure;
	};
	oFF.QInAQuerySettings.prototype.exportCurrencyTranslationDetails = function(
			inaStructure, queryModel) {
		var currencyTranslationDetails = queryModel
				.getCurrencyTranslationDetails();
		var inaCurrencyTranslation;
		var inaCurrencyTranslationEmpty;
		if (oFF.notNull(currencyTranslationDetails)) {
			if (oFF.XStringUtils
					.isNotNullAndNotEmpty(currencyTranslationDetails
							.getCurrencyTranslationName())) {
				inaCurrencyTranslation = inaStructure
						.putNewStructure("CurrencyTranslation");
				if (currencyTranslationDetails
						.getCurrencyTranslationOperation() === null) {
					throw oFF.XException
							.createIllegalArgumentException("CurrencyTranslation Operation required.");
				}
				inaCurrencyTranslation.putString("Operation",
						currencyTranslationDetails
								.getCurrencyTranslationOperation().getName());
				inaCurrencyTranslation
						.putString("Name", currencyTranslationDetails
								.getCurrencyTranslationName());
				if (currencyTranslationDetails
						.getCurrencyTranslationOperation() === oFF.CurrencyTranslationOperation.BOTH
						|| currencyTranslationDetails
								.getCurrencyTranslationOperation() === oFF.CurrencyTranslationOperation.TARGET) {
					if (currencyTranslationDetails
							.getCurrencyTranslationTarget() === null) {
						throw oFF.XException
								.createIllegalArgumentException("CurrencyTranslation Target Currency required.");
					}
					inaCurrencyTranslation.putString("Target",
							currencyTranslationDetails
									.getCurrencyTranslationTarget());
				}
			} else {
				if (queryModel.getCurrencyTranslationDetailsReset()) {
					inaCurrencyTranslationEmpty = inaStructure
							.putNewStructure("CurrencyTranslation");
					inaCurrencyTranslationEmpty.putString("Operation", "");
					inaCurrencyTranslationEmpty.putString("Name", "");
					inaCurrencyTranslationEmpty.putString("Target", "");
					queryModel.setCurrencyTranslationDetailsReset(false);
				}
			}
		}
	};
	oFF.QInASort = function() {
	};
	oFF.QInASort.prototype = new oFF.QInAComponentWithList();
	oFF.QInASort.prototype.getComponentType = function() {
		return oFF.OlapComponentType.SORT_MANAGER;
	};
	oFF.QInASort.prototype.getTagName = function() {
		return "Sort";
	};
	oFF.QInASort.prototype.importComponentWithList = function(importer,
			inaList, modelComponent, parentComponent, context) {
		var sortingManager = modelComponent;
		var queryModel;
		var sortIdx;
		var inaSort;
		var inaSortType;
		var sortType;
		var sortingOp;
		if (importer.mode !== oFF.QModelFormat.INA_DATA_REINIT
				&& importer.supportsExtendedSort) {
			sortingManager.getSortingOperations().clear();
			if (oFF.notNull(inaList)) {
				queryModel = sortingManager.getQueryModel();
				for (sortIdx = 0; sortIdx < inaList.size(); sortIdx++) {
					inaSort = inaList.getStructureAt(sortIdx);
					inaSortType = inaSort.getStringByKey("SortType");
					sortType = oFF.QInAConverter.lookupSortType(inaSortType);
					if (sortType === oFF.SortType.FIELD) {
						sortingOp = this.importFieldSorting(sortingManager,
								queryModel, inaSort);
					} else {
						if (sortType === oFF.SortType.MEASURE) {
							sortingOp = this.importMeasureSorting(
									sortingManager, queryModel, inaSort);
						} else {
							if (sortType === oFF.SortType.DATA_CELL_VALUE
									|| sortType === oFF.SortType.COMPLEX) {
								sortingOp = this.importPathSorting(context,
										sortingManager, queryModel, inaSort,
										sortType);
							} else {
								sortingOp = this.importDimensionSorting(
										sortingManager, queryModel, inaSort,
										sortType);
							}
						}
					}
					if (oFF.notNull(sortingOp)) {
						this.importGenericSorting(queryModel, inaSort,
								sortingOp);
					}
				}
			}
		}
		return sortingManager;
	};
	oFF.QInASort.prototype.importGenericSorting = function(queryModel, inaSort,
			sortingOp) {
		var inaDirection = inaSort.getStringByKey("Direction");
		var sortDirection;
		var inaCollator;
		if (oFF.notNull(inaDirection)) {
			sortDirection = oFF.QInAConverter
					.lookupSortDirection2(inaDirection);
			if (oFF.notNull(sortDirection)) {
				sortingOp.setDirection(sortDirection);
			}
		}
		if (sortingOp.supportsPreserveGrouping()
				&& sortingOp.supportsBreakGrouping()) {
			sortingOp.setPreserveGrouping(inaSort.getBooleanByKeyExt(
					"PreserveGrouping", false));
		}
		if (queryModel.supportsLocaleSorting()) {
			inaCollator = inaSort.getStructureByKey("Collator");
			if (oFF.notNull(inaCollator)) {
				sortingOp.setIsCaseSensitive(inaCollator.getBooleanByKeyExt(
						"CaseSensitive", false));
				sortingOp.setLocale(inaCollator.getStringByKeyExt("Locale",
						null));
			}
		}
	};
	oFF.QInASort.prototype.importPathSorting = function(context,
			sortingManager, queryModel, inaSort, sortType) {
		var inaPath = inaSort.getListByKey("SortTuple");
		var path;
		var idxStruct;
		var pathElement;
		var inaFieldName;
		var inaValue;
		var field;
		var inaHierarchyName;
		if (inaPath.isEmpty()) {
			return null;
		}
		path = oFF.XList.create();
		for (idxStruct = 0; idxStruct < inaPath.size(); idxStruct++) {
			pathElement = inaPath.getStructureAt(idxStruct);
			inaFieldName = pathElement.getStringByKey("FieldName");
			inaValue = pathElement.getStringByKey("Value");
			if (oFF.notNull(inaFieldName) && oFF.notNull(inaValue)) {
				field = queryModel.getFieldByName(inaFieldName);
				if (oFF.isNull(field)) {
					return null;
				}
				inaHierarchyName = pathElement.getStringByKey("Hierarchy");
				path.add(oFF.QSelectValue._createDimensionElement2(context,
						field, inaHierarchyName, inaValue));
			} else {
				return null;
			}
		}
		if (sortType === oFF.SortType.DATA_CELL_VALUE) {
			return sortingManager.getDataCellSorting(path, true);
		}
		return sortingManager.getComplexSorting(path, true);
	};
	oFF.QInASort.prototype.importDimensionSorting = function(sortingManager,
			queryModel, inaSort, sortType) {
		var dimension = queryModel
				.getDimensionByNameFromExistingMetadata(inaSort
						.getStringByKey("Dimension"));
		var dimensionSorting;
		if (oFF.isNull(dimension)) {
			return null;
		}
		dimensionSorting = sortingManager.getDimensionSorting(dimension, true);
		if (sortType === oFF.SortType.FILTER) {
			dimensionSorting.setSortByFilter();
		} else {
			if (sortType === oFF.SortType.MEMBER_KEY) {
				dimensionSorting.setSortByKey();
			} else {
				if (sortType === oFF.SortType.MEMBER_TEXT) {
					dimensionSorting.setSortByText();
				} else {
					if (sortType === oFF.SortType.HIERARCHY) {
						dimensionSorting.setSortByHierarchy();
					}
				}
			}
		}
		return dimensionSorting;
	};
	oFF.QInASort.prototype.importMeasureSorting = function(sortingManager,
			queryModel, inaSort) {
		var measureName = inaSort.getStringByKey("MeasureName");
		var measureSorting = null;
		var measureDimension;
		var measure;
		var structureName;
		var structure;
		if (oFF.notNull(measureName)) {
			measureDimension = queryModel.getMeasureDimension();
			measure = measureDimension.getStructureMember(measureName);
			if (oFF.notNull(measure)) {
				measureSorting = sortingManager
						.getMeasureSorting(measure, true);
			}
			structureName = inaSort.getStringByKey("StructureName");
			structure = queryModel.getNonMeasureDimension();
			if (oFF.notNull(structureName) && oFF.notNull(structure)
					&& oFF.notNull(measureSorting)) {
				measureSorting.setStructure(structure
						.getStructureMember(structureName));
			}
		}
		return measureSorting;
	};
	oFF.QInASort.prototype.importFieldSorting = function(sortingManager,
			queryModel, inaSort) {
		var fieldName = inaSort.getStringByKey("FieldName");
		var fieldSorting = null;
		var field;
		if (oFF.notNull(fieldName)) {
			field = queryModel.getFieldByName(fieldName);
			if (oFF.notNull(field)) {
				fieldSorting = sortingManager.getFieldSorting(field, true);
			}
		}
		return fieldSorting;
	};
	oFF.QInASort.prototype.exportComponentWithList = function(exporter,
			modelComponent, flags) {
		var inaSortOps;
		var sortingManager;
		var sortingOperations;
		var size;
		var i;
		var sortOp;
		var dimension;
		var convertedLbhDimension;
		var inaSortOp;
		var sortingType;
		var direction;
		var measureDimensionSorting;
		var mode;
		if (!exporter.supportsExtendedSort) {
			return null;
		}
		inaSortOps = oFF.PrFactory.createList();
		sortingManager = modelComponent;
		sortingOperations = sortingManager.getSortingOperations();
		size = sortingOperations.size();
		for (i = 0; i < size; i++) {
			sortOp = sortingOperations.get(i);
			dimension = null;
			convertedLbhDimension = null;
			if (sortOp.supportsDimension()) {
				dimension = sortOp.getDimension();
			}
			if (oFF.notNull(dimension)
					&& dimension.getAxisType() === oFF.AxisType.FREE) {
				convertedLbhDimension = oFF.QInAUniversalDisplayHierarchies
						.getDimensionWithLeveledHierarchyWhichContainsGivenDim(
								exporter, dimension);
				if (oFF.isNull(convertedLbhDimension)
						|| sortingManager.getDimensionSorting(
								convertedLbhDimension, false) === null) {
					continue;
				}
			}
			inaSortOp = oFF.PrFactory.createStructure();
			sortingType = sortOp.getSortingType();
			inaSortOp.putString("SortType", oFF.QInAConverter
					.lookupSortTypeInA(sortingType));
			direction = this.getSortDirection(sortOp, sortingManager,
					convertedLbhDimension);
			if (direction !== oFF.XSortDirection.DEFAULT_VALUE) {
				inaSortOp.putString("Direction", oFF.QInAConverter
						.lookupSortDirectionInA2(direction));
			} else {
				if (sortingType === oFF.SortType.MEASURE) {
					continue;
				}
			}
			this.exportGenericSorting(sortOp, inaSortOp);
			if (sortingType === oFF.SortType.FIELD) {
				this.exportFieldSorting(sortOp, inaSortOp);
			} else {
				if (sortingType === oFF.SortType.MEASURE) {
					this.exportMeasureSorting(sortOp, inaSortOp);
				} else {
					if (sortingType === oFF.SortType.DATA_CELL_VALUE
							|| sortingType === oFF.SortType.COMPLEX) {
						this.exportPathSorting(sortOp, inaSortOp);
					} else {
						if (sortingType === oFF.SortType.HIERARCHY) {
							if (!sortOp.getDimension()
									.isHierarchyAssignedAndActive()) {
								inaSortOp = null;
							}
						} else {
							if (sortingType === oFF.SortType.MEMBER_KEY) {
								measureDimensionSorting = sortOp;
								this
										.exportCustomSortDetails(
												measureDimensionSorting
														.getCustomSort(),
												measureDimensionSorting
														.getCustomSortPosition(),
												inaSortOp);
							}
						}
					}
				}
			}
			if (oFF.notNull(inaSortOp)) {
				oFF.QInAExportUtil.setNameIfNotNull(inaSortOp, "Dimension",
						dimension);
				inaSortOps.add(inaSortOp);
			}
		}
		mode = exporter.mode;
		if (mode.isTypeOf(oFF.QModelFormat.INA_DATA)
				|| mode === oFF.QModelFormat.INA_VALUE_HELP) {
			inaSortOps = oFF.QInAExportUtil.extendList(sortingManager,
					inaSortOps);
		}
		if (exporter.getApplication().getVersion() >= oFF.XVersion.V97_NO_EMPTY_SORT
				&& inaSortOps.isEmpty()) {
			return null;
		}
		return inaSortOps;
	};
	oFF.QInASort.prototype.getSortDirection = function(sortOp, sortingManager,
			convertedLbhDimension) {
		var sorting;
		if (oFF.notNull(convertedLbhDimension)
				&& convertedLbhDimension !== sortOp.getDimension()) {
			sorting = sortingManager.getDimensionSorting(convertedLbhDimension,
					false);
			if (oFF.notNull(sorting)) {
				return sorting.getDirection();
			}
		}
		return sortOp.getDirection();
	};
	oFF.QInASort.prototype.exportGenericSorting = function(sortOp, inaSortOp) {
		var inaCollator;
		var icuLocale;
		if (sortOp.supportsPreserveGrouping() && sortOp.supportsBreakGrouping()) {
			inaSortOp.putBoolean("PreserveGrouping", sortOp
					.isPreserveGroupingEnabled());
		}
		if (sortOp.getQueryModel().supportsLocaleSorting()) {
			inaCollator = oFF.PrFactory.createStructure();
			inaCollator.putBoolean("CaseSensitive", sortOp.isCaseSensitive());
			icuLocale = sortOp.getLocale();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(icuLocale)) {
				inaCollator.putString("Locale", icuLocale);
			}
			if (inaCollator.hasElements()) {
				inaSortOp.put("Collator", inaCollator);
			}
		}
	};
	oFF.QInASort.prototype.exportPathSorting = function(sortOp, inaSortOp) {
		var inaPath = inaSortOp.putNewList("SortTuple");
		var elementPath = sortOp.getElementPath();
		var pathSize = elementPath.size();
		var idxPath;
		var dimElement;
		var inaPathElement;
		var selectHierarchyName;
		for (idxPath = 0; idxPath < pathSize; idxPath++) {
			dimElement = elementPath.get(idxPath);
			inaPathElement = inaPath.addNewStructure();
			inaPathElement.putString("FieldName", dimElement.getSelectField()
					.getName());
			inaPathElement.putString("Value", dimElement.getSelectValue());
			selectHierarchyName = dimElement.getSelectHierarchyName();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(selectHierarchyName)) {
				inaPathElement.putString("Hierarchy", selectHierarchyName);
			}
		}
	};
	oFF.QInASort.prototype.exportMeasureSorting = function(sortOp, inaSortOp) {
		var measureSorting = sortOp;
		var measureName = measureSorting.getMeasure().getName();
		var structureMember;
		inaSortOp.putString("MeasureName", measureName);
		structureMember = measureSorting.getStructure();
		oFF.QInAExportUtil.setNameIfNotNull(inaSortOp, "StructureName",
				structureMember);
	};
	oFF.QInASort.prototype.exportFieldSorting = function(sortOp, inaSortOp) {
		var fieldSorting = sortOp;
		var customOrder;
		inaSortOp.putString("FieldName", fieldSorting.getField().getName());
		customOrder = fieldSorting.getCustomSort();
		this.exportCustomSortDetails(customOrder, fieldSorting
				.getCustomSortPosition(), inaSortOp);
		if (inaSortOp.getListByKey("CustomSort") !== null) {
			inaSortOp.remove("Collator");
		}
	};
	oFF.QInASort.prototype.exportCustomSortDetails = function(customOrder,
			customSortPosition, inaSortOp) {
		var customOrderList;
		var customOrderSize;
		var customOrderIndex;
		if (oFF.XCollectionUtils.hasElements(customOrder)) {
			customOrderList = inaSortOp.putNewList("CustomSort");
			customOrderSize = customOrder.size();
			for (customOrderIndex = 0; customOrderIndex < customOrderSize; customOrderIndex++) {
				customOrderList.addString(customOrder.get(customOrderIndex));
			}
		}
		oFF.QInAExportUtil.setNameIfNotNull(inaSortOp, "CustomSortPosition",
				customSortPosition);
	};
	oFF.QInATotals = function() {
	};
	oFF.QInATotals.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInATotals.prototype.getComponentType = function() {
		return oFF.OlapComponentType.TOTALS;
	};
	oFF.QInATotals.prototype.importComponentWithStructure = function(importer,
			inaStructure, modelComponent, parentComponent, context) {
		var controller;
		var inaResultStructure;
		var alignment;
		var inaInnerResultStructure;
		var flexibleResultStructure;
		var size;
		var i;
		var resultStructureItem;
		if (importer.mode !== oFF.QModelFormat.INA_DATA_REINIT) {
			controller = modelComponent;
			if (controller.supportsResultVisibility()) {
				inaResultStructure = this.getResultStructure(inaStructure);
				alignment = this.importResultAlignment(controller,
						inaResultStructure);
				controller.restoreTotalsVisibility(
						oFF.RestoreAction.DEFAULT_VALUE, false);
				inaInnerResultStructure = inaResultStructure
						.getListByKey("ResultStructure");
				if (oFF.notNull(inaInnerResultStructure)) {
					if (controller.supportsAdvancedResultStructure()
							&& alignment === oFF.ResultAlignment.STRUCTURE) {
						flexibleResultStructure = controller
								.getAdvancedResultStructure();
						flexibleResultStructure.clear();
						if (oFF.isNull(alignment)) {
							controller.setResultAlignmentBase(
									oFF.ResultAlignment.STRUCTURE, true);
						}
					} else {
						flexibleResultStructure = null;
					}
					size = inaInnerResultStructure.size();
					for (i = 0; i < size; i++) {
						resultStructureItem = inaInnerResultStructure
								.getStructureAt(i);
						this.importResultStructureItem(resultStructureItem,
								controller, flexibleResultStructure);
					}
				}
			}
		}
		return null;
	};
	oFF.QInATotals.prototype.importResultAlignment = function(controller,
			inaResultStructure) {
		var inaResultAlignment;
		var alignment;
		if (controller.supportsResultAlignment()) {
			controller.restoreTotalsAlignment(oFF.RestoreAction.DEFAULT_VALUE,
					false);
			inaResultAlignment = inaResultStructure
					.getStringByKey("ResultAlignment");
			if (oFF.XStringUtils.isNullOrEmpty(inaResultAlignment)) {
				return null;
			}
			alignment = oFF.QInAConverter.lookupAlignment(inaResultAlignment);
			controller.setResultAlignmentBase(alignment, false);
			return alignment;
		}
		return null;
	};
	oFF.QInATotals.prototype.getResultStructure = function(inaStructure) {
		var inaResultStructure = inaStructure
				.getStructureByKey("ResultStructureBag");
		if (oFF.isNull(inaResultStructure)) {
			inaResultStructure = inaStructure
					.getStructureByKey("DefaultResultStructure");
			if (oFF.isNull(inaResultStructure)) {
				return inaStructure;
			}
		}
		return inaResultStructure;
	};
	oFF.QInATotals.prototype.importResultStructureItem = function(
			resultStructureItem, controller, flexibleResultStructure) {
		var resultStructureElement = resultStructureItem
				.getStringByKey("Result");
		var element;
		var inaVisibility;
		var visibility;
		if (oFF.XString.isEqual(resultStructureElement, "Members")) {
			element = oFF.ResultStructureElement.MEMBERS;
		} else {
			if (oFF.XString.isEqual(resultStructureElement, "Total")) {
				element = oFF.ResultStructureElement.TOTAL;
			} else {
				if (oFF.XString.isEqual(resultStructureElement,
						"TotalIncludedMembers")) {
					element = oFF.ResultStructureElement.TOTAL_INCLUDED_MEMBERS;
				} else {
					if (oFF.XString.isEqual(resultStructureElement,
							"TotalRemainingMembers")) {
						element = oFF.ResultStructureElement.TOTAL_REMAINING_MEMBERS;
					} else {
						return;
					}
				}
			}
		}
		inaVisibility = resultStructureItem.getStringByKey("Visibility");
		visibility = oFF.QInAConverter.lookupResultSetVisibility(inaVisibility);
		if (oFF.isNull(flexibleResultStructure)) {
			controller.setResultVisibilityByElement(element, visibility);
		} else {
			flexibleResultStructure.addWithVisibility(element, visibility);
		}
	};
	oFF.QInATotals.prototype.exportComponentWithStructure = function(exporter,
			modelComponent, inaStructure, flags) {
		var controller = modelComponent;
		var inaResultStructure;
		var resultStructure;
		if (controller.supportsTotals()) {
			if (exporter.mode.containsMetadata()
					|| exporter.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
				inaResultStructure = inaStructure
						.putNewStructure("ResultStructureBag");
			} else {
				inaResultStructure = inaStructure;
			}
			this.exportAlignment(exporter, controller, inaResultStructure);
			if (controller.supportsResultVisibility()) {
				if (!controller.isTotalsVisibilityOnDefault()
						|| controller.getModelLevel() === oFF.QModelLevel.DIMENSIONS) {
					resultStructure = controller.getTotalsStructure();
					if (oFF.XCollectionUtils.hasElements(resultStructure)) {
						this.exportResultStructureItems(inaResultStructure,
								resultStructure, controller);
					}
				}
			}
		}
		return inaStructure;
	};
	oFF.QInATotals.prototype.exportAlignment = function(exporter, controller,
			inaResultStructure) {
		var resultAlignment;
		if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA)
				&& !exporter.isAbap(controller.getQueryModel())) {
			return;
		}
		if (controller.supportsResultAlignment()) {
			if (!controller.isTotalsAlignmentOnDefault()) {
				resultAlignment = controller.getResultAlignment();
				if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA)) {
					if (resultAlignment === oFF.ResultAlignment.STRUCTURE) {
						resultAlignment = null;
					}
				}
				if (oFF.notNull(resultAlignment)) {
					inaResultStructure.putString("ResultAlignment",
							oFF.QInAConverter
									.lookupAlignmentInA(resultAlignment));
				}
			}
		}
	};
	oFF.QInATotals.prototype.exportResultStructureItems = function(
			inaResultStructure, resultStructure, controller) {
		var structure = inaResultStructure.putNewList("ResultStructure");
		var size = resultStructure.size();
		var i;
		var item;
		var visibility;
		var element;
		for (i = 0; i < size; i++) {
			item = resultStructure.get(i);
			visibility = item.getResultVisibility();
			if (!this.isResultVisible(controller, visibility)) {
				continue;
			}
			element = item.getResultStructureElement();
			if (element === oFF.ResultStructureElement.MEMBERS) {
				this.exportResultStructureElement(structure, visibility,
						"Members");
			} else {
				if (element === oFF.ResultStructureElement.TOTAL) {
					this.exportResultStructureElement(structure, visibility,
							"Total");
				} else {
					if (element === oFF.ResultStructureElement.TOTAL_INCLUDED_MEMBERS) {
						if (this.supportsConditionalResult(controller, element)) {
							this.exportResultStructureElement(structure,
									visibility, "TotalIncludedMembers");
						}
					} else {
						if (element === oFF.ResultStructureElement.TOTAL_REMAINING_MEMBERS) {
							if (this.supportsConditionalResult(controller,
									element)) {
								this.exportResultStructureElement(structure,
										visibility, "TotalRemainingMembers");
							}
						}
					}
				}
			}
		}
	};
	oFF.QInATotals.prototype.isResultVisible = function(controller, visibility) {
		return visibility === oFF.ResultVisibility.VISIBLE
				|| visibility === oFF.ResultVisibility.ALWAYS
				|| visibility === oFF.ResultVisibility.CONDITIONAL
				&& controller.supportsConditionalResultVisibility();
	};
	oFF.QInATotals.prototype.supportsConditionalResult = function(controller,
			element) {
		return controller.supportsConditionalResults()
				&& controller.getSupportedConditionalResults()
						.contains(element);
	};
	oFF.QInATotals.prototype.exportResultStructureElement = function(inaParent,
			visibility, elementName) {
		var resultStructureLine = inaParent.addNewStructure();
		resultStructureLine.putString("Result", elementName);
		resultStructureLine.putString("Visibility", oFF.QInAConverter
				.lookupResultSetVisibilityInA(visibility));
	};
	oFF.QInAUniversalDisplayHierarchies = function() {
	};
	oFF.QInAUniversalDisplayHierarchies.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAUniversalDisplayHierarchies.isHierarchyConversionRequired = function(
			exporter, axis) {
		return oFF.QInAUniversalDisplayHierarchies.isHierarchyConversionActive(
				exporter, axis.getQueryManager())
				&& oFF.QInAUniversalDisplayHierarchies
						.getDimensionWithLeveledHierarchy(axis) !== null;
	};
	oFF.QInAUniversalDisplayHierarchies.isHierarchyConverted = function(
			exporter, dimension) {
		return oFF.QInAUniversalDisplayHierarchies.isHierarchyConversionActive(
				exporter, dimension.getQueryManager())
				&& dimension.isHierarchyActive()
				&& dimension.getLeveledHierarchy(dimension.getHierarchyName()) !== null;
	};
	oFF.QInAUniversalDisplayHierarchies.isHierarchyConversionActive = function(
			exporter, queryManager) {
		return exporter.mode === oFF.QModelFormat.INA_DATA
				&& queryManager.isHierarchyToUDHConversionEnabled()
				&& oFF.XCollectionUtils.hasElements(queryManager
						.getQueryModel().getUniversalDisplayHierarchies()
						.getHierarchies());
	};
	oFF.QInAUniversalDisplayHierarchies.getDimensionNames = function(exporter,
			axis) {
		var dimension;
		var leveledHierarchy;
		var size;
		var dimensions;
		var i;
		if (oFF.QInAUniversalDisplayHierarchies.isHierarchyConversionActive(
				exporter, axis.getQueryManager())) {
			dimension = oFF.QInAUniversalDisplayHierarchies
					.getDimensionWithLeveledHierarchy(axis);
			if (oFF.notNull(dimension)) {
				leveledHierarchy = dimension.getLeveledHierarchy(dimension
						.getHierarchyName());
				size = leveledHierarchy.getAllLevel().size();
				dimensions = oFF.XListOfString.create();
				for (i = 0; i < size; i++) {
					dimensions.add(leveledHierarchy.getLevel(i)
							.getLevelDimensionName());
				}
				return dimensions;
			}
		}
		return axis.getDimensionNames();
	};
	oFF.QInAUniversalDisplayHierarchies.getDimensionWithLeveledHierarchyWhichContainsGivenDim = function(
			exporter, dimension) {
		var dimensionName;
		var rowsAxis;
		var colAxis;
		if (oFF.QInAUniversalDisplayHierarchies.isHierarchyConversionActive(
				exporter, dimension.getQueryManager())) {
			dimensionName = dimension.getName();
			rowsAxis = dimension.getQueryModel().getRowsAxis();
			if (oFF.QInAUniversalDisplayHierarchies.getDimensionNames(exporter,
					rowsAxis).contains(dimensionName)) {
				return oFF.QInAUniversalDisplayHierarchies
						.getDimensionWithLeveledHierarchy(rowsAxis);
			}
			colAxis = dimension.getQueryModel().getColumnsAxis();
			if (oFF.QInAUniversalDisplayHierarchies.getDimensionNames(exporter,
					colAxis).contains(dimensionName)) {
				return oFF.QInAUniversalDisplayHierarchies
						.getDimensionWithLeveledHierarchy(colAxis);
			}
		}
		return null;
	};
	oFF.QInAUniversalDisplayHierarchies.getDimensionWithLeveledHierarchy = function(
			axis) {
		var dimensionCount;
		var i;
		var dimension;
		if (oFF.isNull(axis)
				|| (axis.getType() !== oFF.AxisType.ROWS && axis.getType() !== oFF.AxisType.COLUMNS)) {
			return null;
		}
		dimensionCount = axis.getDimensionCount();
		for (i = 0; i < dimensionCount; i++) {
			dimension = axis.get(i);
			if (dimension.isHierarchyActive()
					&& dimension.getLeveledHierarchy(dimension
							.getHierarchyName()) !== null) {
				return dimension;
			}
		}
		return null;
	};
	oFF.QInAUniversalDisplayHierarchies.prototype.getComponentType = function() {
		return oFF.OlapComponentType.UNIVERSAL_DISPLAY_HIERARCHIES;
	};
	oFF.QInAUniversalDisplayHierarchies.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var universalDisplayHierarchies = modelComponent;
		var hierarchiesStructure;
		var hierarchies;
		var size;
		var i;
		if (oFF.notNull(inaStructure)) {
			hierarchiesStructure = inaStructure
					.getByKey("UniversalDisplayHierarchies");
			if (oFF.notNull(hierarchiesStructure)
					&& hierarchiesStructure.isList()) {
				hierarchies = hierarchiesStructure;
				size = hierarchies.size();
				for (i = 0; i < size; i++) {
					oFF.QInAMdUniversalDisplayHierarchies.importHierarchy(
							universalDisplayHierarchies, hierarchies
									.getStructureAt(i));
				}
			}
		}
		oFF.QInAMdUniversalDisplayHierarchies
				.assignAxesToHierarchies(universalDisplayHierarchies);
		return universalDisplayHierarchies;
	};
	oFF.QInAUniversalDisplayHierarchies.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var universalDisplayHierarchies = modelComponent;
		var udhIterator;
		var udhStructure;
		if (oFF.notNull(universalDisplayHierarchies)) {
			universalDisplayHierarchies.updateIncludedDimensions();
			udhIterator = universalDisplayHierarchies.getChildrenIterator();
			if (udhIterator.hasNext()) {
				udhStructure = inaStructure
						.putNewList("UniversalDisplayHierarchies");
				while (udhIterator.hasNext()) {
					this.exportHierarchy(exporter, udhStructure, udhIterator
							.next());
				}
			}
		}
		return inaStructure;
	};
	oFF.QInAUniversalDisplayHierarchies.prototype.exportHierarchy = function(
			exporter, udhStructure, hierarchy) {
		var dimensionListValid = true;
		var axis = hierarchy.getHierarchyDedicatedAxis();
		var hierarchyConversionDimension = oFF.QInAUniversalDisplayHierarchies
				.isHierarchyConversionActive(exporter, axis.getQueryManager()) ? oFF.QInAUniversalDisplayHierarchies
				.getDimensionWithLeveledHierarchy(axis)
				: null;
		var supportsUdhZeroBased;
		var udhConvertedFromLBH;
		var hierarchyStructure;
		if (oFF.notNull(hierarchyConversionDimension)) {
			supportsUdhZeroBased = hierarchy
					.getQueryModel()
					.supportsAnalyticCapability(
							oFF.InACapabilities.UNIVERSAL_DISPLAY_HIERARCHY_ZERO_BASED);
			udhConvertedFromLBH = udhStructure.addNewStructure();
			udhConvertedFromLBH.putString("Name", hierarchy.getName());
			udhConvertedFromLBH.putInteger("InitialDrillLevel",
					supportsUdhZeroBased ? hierarchyConversionDimension
							.getInitialDrillLevel()
							: hierarchyConversionDimension
									.getInitialDrillLevel() + 1);
			udhConvertedFromLBH.putString("LowerLevelNodeAlignment", hierarchy
					.getAlignment().getName());
			udhConvertedFromLBH.putBoolean("Active", true);
			udhConvertedFromLBH.putNewList("DimensionNames").addAllStrings(
					oFF.QInAUniversalDisplayHierarchies.getDimensionNames(
							exporter, axis));
			udhConvertedFromLBH.putString("LevelHierarchyName",
					hierarchyConversionDimension.getHierarchyName());
			return;
		} else {
			if (hierarchy.isActive() && !hierarchy.isDimensionListValid()) {
				dimensionListValid = false;
				exporter
						.addError(
								oFF.ErrorCodes.INVALID_STATE,
								oFF.XStringUtils
										.concatenate3("Dimensions for UDH '",
												hierarchy.getName(),
												"' must be placed next to each other on the axis"));
			}
		}
		hierarchyStructure = udhStructure.addNewStructure();
		hierarchyStructure.putString("Name", hierarchy.getName());
		hierarchyStructure.putInteger("InitialDrillLevel", hierarchy
				.getInitialDrillLevel());
		hierarchyStructure.putString("LowerLevelNodeAlignment", hierarchy
				.getAlignment().getName());
		hierarchyStructure.putBoolean("Active", hierarchy.isActive()
				&& dimensionListValid);
		hierarchyStructure.putNewList("DimensionNames").addAllStrings(
				hierarchy.getDimensionNames());
		if (hierarchy.hasCustomDimensions()) {
			hierarchyStructure.putBoolean("CustomDimensions", true);
		}
	};
	oFF.QInAVarDimMember = function() {
	};
	oFF.QInAVarDimMember.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAVarDimMember.prototype.getComponentType = function() {
		return oFF.VariableType.DIMENSION_MEMBER_VARIABLE;
	};
	oFF.QInAVarDimMember.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var memberVariable = modelComponent;
		var inaValues = inaStructure.getStructureByKey("Values");
		var selectionContainer;
		var newSelectionContainer;
		if (oFF.notNull(inaValues)) {
			selectionContainer = oFF.QFilterExpression._createByApplication(
					context, memberVariable);
			newSelectionContainer = importer.importFilterExpression(
					selectionContainer, inaValues, memberVariable, context);
			memberVariable.setFilter(newSelectionContainer);
		} else {
			if (memberVariable.getVariableType() === oFF.VariableType.HIERARCHY_NODE_VARIABLE
					&& memberVariable.hasMemberFilter()
					&& memberVariable.getDimension().getKeyField() !== memberVariable
							.getMemberFilter().getField()) {
				memberVariable.setDimension(memberVariable.getDimension());
			}
		}
		return memberVariable;
	};
	oFF.QInAVarDimMember.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var dimensionMemberVariable = modelComponent;
		var name = dimensionMemberVariable.getName();
		var targetMemberFilter;
		var externMemberSelection;
		var memberSelection;
		var inaVariableValues;
		var inaSelection;
		inaStructure.putString("Name", name);
		targetMemberFilter = null;
		externMemberSelection = dimensionMemberVariable
				.getExternalMemberFilter();
		if (oFF.XCollectionUtils.hasElements(externMemberSelection)) {
			targetMemberFilter = externMemberSelection;
		} else {
			if (dimensionMemberVariable.hasMemberFilter()) {
				memberSelection = dimensionMemberVariable.getMemberFilter();
				if (oFF.XCollectionUtils.hasElements(memberSelection)) {
					targetMemberFilter = memberSelection;
				}
			}
		}
		if (oFF.notNull(targetMemberFilter)) {
			inaVariableValues = inaStructure.putNewStructure("Values");
			inaSelection = inaVariableValues.putNewStructure("Selection");
			exporter.exportCartesianList(targetMemberFilter, inaSelection);
		} else {
			if (!dimensionMemberVariable.isMandatory()) {
				inaStructure.putNewStructure("Values");
			}
		}
		return inaStructure;
	};
	oFF.QInAVarOptionList = function() {
	};
	oFF.QInAVarOptionList.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAVarOptionList.prototype.getComponentType = function() {
		return oFF.VariableType.OPTION_LIST_VARIABLE;
	};
	oFF.QInAVarOptionList.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var optionListVariable = modelComponent;
		var inaOptionValues = inaStructure.getListByKey("OptionValues");
		var currentOption;
		var len;
		var idxOption;
		if (oFF.notNull(inaOptionValues)) {
			if (optionListVariable.supportsMultipleValues()) {
				optionListVariable.clear();
				len = inaOptionValues.size();
				for (idxOption = 0; idxOption < len; idxOption++) {
					currentOption = inaOptionValues.getStringAt(idxOption);
					optionListVariable.addString(currentOption);
				}
			} else {
				if (inaOptionValues.size() === 1) {
					currentOption = inaOptionValues.getStringAt(0);
					optionListVariable.setString(currentOption);
				}
			}
		}
		return optionListVariable;
	};
	oFF.QInAVarOptionList.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var variable = modelComponent;
		var inaVariableOptionValues;
		var multiOptionNames;
		var len;
		var c;
		var optionName;
		var currentOption;
		inaStructure.putString("Name", variable.getName());
		inaVariableOptionValues = inaStructure.putNewList("OptionValues");
		if (variable.supportsMultipleValues()) {
			multiOptionNames = variable.getValues();
			len = multiOptionNames.size();
			for (c = 0; c < len; c++) {
				optionName = multiOptionNames.get(c);
				inaVariableOptionValues.addString(optionName.getString());
			}
		} else {
			currentOption = variable.getCurrentOption();
			if (oFF.notNull(currentOption)) {
				inaVariableOptionValues.addString(currentOption.getName());
			}
		}
		return inaStructure;
	};
	oFF.QInAVarSimpleType = function() {
	};
	oFF.QInAVarSimpleType.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAVarSimpleType.prototype.getComponentType = function() {
		return oFF.VariableType.SIMPLE_TYPE_VARIABLE;
	};
	oFF.QInAVarSimpleType.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var simpleTypeVariable = modelComponent;
		var valueType;
		if (simpleTypeVariable.supportsMultipleValues()) {
			simpleTypeVariable.clear();
		}
		valueType = simpleTypeVariable.getValueType();
		if (valueType.isNumber()) {
			this.importNumericValues(importer, inaStructure,
					simpleTypeVariable, valueType);
		} else {
			if (valueType.isString()) {
				this.importStringValues(inaStructure, simpleTypeVariable);
			} else {
				if (valueType === oFF.XValueType.DATE) {
					this.importDateValues(importer, inaStructure,
							simpleTypeVariable);
				} else {
					if (valueType === oFF.XValueType.TIME) {
						this.importTimeValues(importer, inaStructure,
								simpleTypeVariable);
					} else {
						if (valueType === oFF.XValueType.DATE_TIME) {
							this.importDateTimeValues(importer, inaStructure,
									simpleTypeVariable);
						} else {
							if (valueType === oFF.XValueType.BOOLEAN) {
								this.importBooleanValues(inaStructure,
										simpleTypeVariable);
							}
						}
					}
				}
			}
		}
		return null;
	};
	oFF.QInAVarSimpleType.prototype.getFirstValueAsString = function(values) {
		var element = values.get(0);
		if (oFF.notNull(element) && element.isString()) {
			return element.getString();
		}
		return null;
	};
	oFF.QInAVarSimpleType.prototype.importDateTimeValues = function(importer,
			inaStructure, simpleTypeVariable) {
		var inaSimpleDateTimeValues = inaStructure
				.getListByKey("SimpleStringValues");
		var sizeValue;
		var idxValue;
		var dateTimeValue;
		var dateTimeValue2;
		if (oFF.notNull(inaSimpleDateTimeValues)) {
			sizeValue = inaSimpleDateTimeValues.size();
			if (simpleTypeVariable.supportsMultipleValues()) {
				for (idxValue = 0; idxValue < sizeValue; idxValue++) {
					dateTimeValue = inaSimpleDateTimeValues
							.getStringAt(idxValue);
					if (oFF.XStringUtils.isNotNullAndNotEmpty(dateTimeValue)) {
						simpleTypeVariable.addDateTime(oFF.XDateTime
								.createDateTimeFromStringWithFlag(
										dateTimeValue,
										importer.supportsSAPDateFormat));
					}
				}
			} else {
				if (sizeValue === 1) {
					dateTimeValue2 = this
							.getFirstValueAsString(inaSimpleDateTimeValues);
					if (oFF.XStringUtils.isNotNullAndNotEmpty(dateTimeValue2)) {
						simpleTypeVariable.setDateTime(oFF.XDateTime
								.createDateTimeFromStringWithFlag(
										dateTimeValue2,
										importer.supportsSAPDateFormat));
					}
				}
			}
		}
	};
	oFF.QInAVarSimpleType.prototype.importTimeValues = function(importer,
			inaStructure, simpleTypeVariable) {
		var inaSimpleTimeValues = inaStructure
				.getListByKey("SimpleStringValues");
		var sizeValue;
		var idxValue;
		var timeValue;
		var timeValue2;
		if (oFF.notNull(inaSimpleTimeValues)) {
			sizeValue = inaSimpleTimeValues.size();
			if (simpleTypeVariable.supportsMultipleValues()) {
				for (idxValue = 0; idxValue < sizeValue; idxValue++) {
					timeValue = inaSimpleTimeValues.getStringAt(idxValue);
					if (oFF.XStringUtils.isNotNullAndNotEmpty(timeValue)) {
						simpleTypeVariable.addTime(oFF.XTime
								.createTimeFromStringWithFlag(timeValue,
										importer.supportsSAPDateFormat));
					}
				}
			} else {
				if (sizeValue === 1) {
					timeValue2 = this
							.getFirstValueAsString(inaSimpleTimeValues);
					if (oFF.XStringUtils.isNotNullAndNotEmpty(timeValue2)) {
						simpleTypeVariable.setTime(oFF.XTime
								.createTimeFromStringWithFlag(timeValue2,
										importer.supportsSAPDateFormat));
					}
				}
			}
		}
	};
	oFF.QInAVarSimpleType.prototype.importDateValues = function(importer,
			inaStructure, simpleTypeVariable) {
		var inaSimpleDateValues = inaStructure
				.getListByKey("SimpleStringValues");
		var sizeValue;
		var idxValue;
		var dateValue;
		var dateValue2;
		if (oFF.notNull(inaSimpleDateValues)) {
			sizeValue = inaSimpleDateValues.size();
			if (simpleTypeVariable.supportsMultipleValues()) {
				for (idxValue = 0; idxValue < sizeValue; idxValue++) {
					dateValue = inaSimpleDateValues.getStringAt(idxValue);
					if (oFF.XStringUtils.isNotNullAndNotEmpty(dateValue)) {
						simpleTypeVariable.addDate(oFF.XDate
								.createDateFromStringWithFlag(dateValue,
										importer.supportsSAPDateFormat));
					}
				}
			} else {
				if (sizeValue === 1) {
					dateValue2 = this
							.getFirstValueAsString(inaSimpleDateValues);
					if (oFF.XStringUtils.isNotNullAndNotEmpty(dateValue2)) {
						simpleTypeVariable.setDate(oFF.XDate
								.createDateFromStringWithFlag(dateValue2,
										importer.supportsSAPDateFormat));
					}
				}
			}
		}
	};
	oFF.QInAVarSimpleType.prototype.importStringValues = function(inaStructure,
			simpleTypeVariable) {
		var inaSimpleStringValues = inaStructure
				.getListByKey("SimpleStringValues");
		var sizeValue;
		var idxValue;
		var element;
		if (oFF.notNull(inaSimpleStringValues)) {
			sizeValue = inaSimpleStringValues.size();
			if (simpleTypeVariable.supportsMultipleValues()) {
				for (idxValue = 0; idxValue < sizeValue; idxValue++) {
					simpleTypeVariable.addString(inaSimpleStringValues
							.getStringAt(idxValue));
				}
			} else {
				if (sizeValue === 1) {
					element = inaSimpleStringValues.get(0);
					if (oFF.notNull(element) && element.isString()) {
						simpleTypeVariable.setString(element.getString());
					}
				}
			}
		}
	};
	oFF.QInAVarSimpleType.prototype.importBooleanValues = function(
			inaStructure, simpleTypeVariable) {
		var inaSimpleBooleanValues = inaStructure
				.getListByKey("SimpleStringValues");
		var sizeValue;
		var idxValue;
		var element;
		if (oFF.notNull(inaSimpleBooleanValues)) {
			sizeValue = inaSimpleBooleanValues.size();
			if (simpleTypeVariable.supportsMultipleValues()) {
				for (idxValue = 0; idxValue < sizeValue; idxValue++) {
					simpleTypeVariable.addBoolean(inaSimpleBooleanValues
							.getBooleanAt(idxValue));
				}
			} else {
				if (sizeValue === 1) {
					element = inaSimpleBooleanValues.get(0);
					if (oFF.notNull(element) && element.isBoolean()) {
						simpleTypeVariable.setBoolean(element.asBoolean()
								.getBoolean());
					}
				}
			}
		}
	};
	oFF.QInAVarSimpleType.prototype.importNumericString = function(
			simpleTypeVariable, valueType, stringValue) {
		if (valueType === oFF.XValueType.INTEGER) {
			simpleTypeVariable.addInteger(oFF.XInteger
					.convertFromString(stringValue));
		} else {
			if (valueType === oFF.XValueType.DOUBLE
					|| valueType === oFF.XValueType.DECIMAL_FLOAT) {
				simpleTypeVariable.addDouble(oFF.XDouble
						.convertFromString(stringValue));
			} else {
				if (valueType === oFF.XValueType.LONG) {
					simpleTypeVariable.addLong(oFF.XLong
							.convertFromString(stringValue));
				}
			}
		}
	};
	oFF.QInAVarSimpleType.prototype.addIntegerValue = function(exporter,
			simpleValues, intValue) {
		if (exporter.supportsNumberAsString
				&& !oFF.QInAExportUtil.isNumberSafe(intValue)) {
			simpleValues.addString(oFF.XInteger.convertToString(intValue));
		} else {
			simpleValues.addInteger(intValue);
		}
	};
	oFF.QInAVarSimpleType.prototype.addLongValue = function(exporter,
			simpleValues, longValue) {
		if (exporter.supportsNumberAsString
				&& !oFF.QInAExportUtil.isNumberSafe(longValue)) {
			simpleValues.addString(oFF.XLong.convertToString(longValue));
		} else {
			simpleValues.addLong(longValue);
		}
	};
	oFF.QInAVarSimpleType.prototype.addDoubleValue = function(exporter,
			simpleValues, doubleValue) {
		if (exporter.supportsNumberAsString
				&& !oFF.QInAExportUtil.isNumberSafe(doubleValue)) {
			simpleValues.addString(oFF.XDouble.convertToString(doubleValue));
		} else {
			simpleValues.addDouble(doubleValue);
		}
	};
	oFF.QInAVarSimpleType.prototype.importNumericValues = function(importer,
			inaStructure, simpleTypeVariable, valueType) {
		var inaSimpleNumericValues = inaStructure
				.getListByKey("SimpleNumericValues");
		var sizeValue;
		var idxValue;
		var elementAt;
		var integerValue;
		var doubleValue;
		var longValue;
		var numericElement0;
		if (oFF.notNull(inaSimpleNumericValues)) {
			sizeValue = inaSimpleNumericValues.size();
			if (simpleTypeVariable.supportsMultipleValues()) {
				for (idxValue = 0; idxValue < sizeValue; idxValue++) {
					elementAt = inaSimpleNumericValues.get(idxValue);
					if (importer.supportsNumberAsString
							&& oFF.notNull(elementAt)
							&& elementAt.getType() === oFF.PrElementType.STRING) {
						this.importNumericString(simpleTypeVariable, valueType,
								inaSimpleNumericValues.getStringAt(idxValue));
						continue;
					}
					if (valueType === oFF.XValueType.INTEGER) {
						integerValue = inaSimpleNumericValues
								.getIntegerAt(idxValue);
						simpleTypeVariable.addInteger(integerValue);
					} else {
						if (valueType === oFF.XValueType.DOUBLE
								|| valueType === oFF.XValueType.DECIMAL_FLOAT) {
							doubleValue = inaSimpleNumericValues
									.getDoubleAt(idxValue);
							simpleTypeVariable.addDouble(doubleValue);
						} else {
							if (valueType === oFF.XValueType.LONG) {
								longValue = inaSimpleNumericValues
										.getLongAt(idxValue);
								simpleTypeVariable.addLong(longValue);
							}
						}
					}
				}
			} else {
				if (sizeValue === 1) {
					numericElement0 = inaSimpleNumericValues.get(0);
					if (oFF.notNull(numericElement0)
							&& numericElement0.isNumeric()) {
						if (valueType === oFF.XValueType.INTEGER) {
							simpleTypeVariable
									.setInteger(inaSimpleNumericValues
											.getIntegerAt(0));
						} else {
							if (valueType === oFF.XValueType.DOUBLE
									|| valueType === oFF.XValueType.DECIMAL_FLOAT) {
								simpleTypeVariable
										.setDouble(inaSimpleNumericValues
												.getDoubleAt(0));
							} else {
								if (valueType === oFF.XValueType.LONG) {
									simpleTypeVariable
											.setLong(inaSimpleNumericValues
													.getLongAt(0));
								}
							}
						}
					}
				}
			}
		}
	};
	oFF.QInAVarSimpleType.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var variable = modelComponent;
		var valueType;
		var simpleValues;
		inaStructure.putString("Name", variable.getName());
		valueType = variable.getValueType();
		if (valueType === oFF.XValueType.STRING
				|| valueType === oFF.XValueType.DATE
				|| valueType === oFF.XValueType.TIME
				|| valueType === oFF.XValueType.DATE_TIME
				|| valueType === oFF.XValueType.BOOLEAN
				|| valueType.isSpatial()) {
			simpleValues = inaStructure.putNewList("SimpleStringValues");
		} else {
			if (valueType === oFF.XValueType.DOUBLE
					|| valueType === oFF.XValueType.DECIMAL_FLOAT
					|| valueType === oFF.XValueType.LONG
					|| valueType === oFF.XValueType.INTEGER) {
				simpleValues = inaStructure.putNewList("SimpleNumericValues");
			} else {
				exporter.addError(oFF.ErrorCodes.INVALID_DATATYPE,
						oFF.XStringUtils.concatenate3("SimpleTypeVariable '",
								variable.getName(), "' not exported"));
				return null;
			}
		}
		if (variable.supportsMultipleValues()) {
			this.exportMultipleValues(exporter, variable, valueType,
					simpleValues);
		} else {
			this.exportSingleValue(exporter, variable, valueType, simpleValues);
		}
		return inaStructure;
	};
	oFF.QInAVarSimpleType.prototype.exportSingleValue = function(exporter,
			variable, valueType, simpleValues) {
		var repoFormatAndNoValue = !variable.hasValue()
				&& (exporter.getMode() === oFF.QModelFormat.INA_REPOSITORY || variable
						.getQueryModel().getSystemType().isTypeOf(
								oFF.SystemType.VIRTUAL_INA));
		if (valueType === oFF.XValueType.INTEGER) {
			if (repoFormatAndNoValue) {
				simpleValues.addNull();
			} else {
				this.addIntegerValue(exporter, simpleValues, variable
						.getInteger());
			}
		} else {
			if (valueType === oFF.XValueType.LONG) {
				if (repoFormatAndNoValue) {
					simpleValues.addNull();
				} else {
					this.addLongValue(exporter, simpleValues, variable
							.getLong());
				}
			} else {
				if (valueType === oFF.XValueType.BOOLEAN) {
					if (repoFormatAndNoValue) {
						simpleValues.addNull();
					} else {
						simpleValues.addBoolean(variable.getBoolean());
					}
				} else {
					if (valueType === oFF.XValueType.DOUBLE
							|| valueType === oFF.XValueType.DECIMAL_FLOAT) {
						if (repoFormatAndNoValue) {
							simpleValues.addNull();
						} else {
							this.addDoubleValue(exporter, simpleValues,
									variable.getDouble());
						}
					} else {
						if (!variable.hasValue()) {
							if (exporter.getMode() !== oFF.QModelFormat.INA_REPOSITORY) {
								simpleValues.addString("");
							}
						} else {
							if (valueType === oFF.XValueType.STRING
									|| valueType.isSpatial()) {
								simpleValues.addString(variable.getString());
							} else {
								if (valueType === oFF.XValueType.DATE) {
									simpleValues.addString(oFF.QInAExportUtil
											.dateTimeToString(exporter,
													variable.getDate()));
								} else {
									if (valueType === oFF.XValueType.TIME) {
										simpleValues
												.addString(oFF.QInAExportUtil
														.dateTimeToString(
																exporter,
																variable
																		.getTime()));
									} else {
										if (valueType === oFF.XValueType.DATE_TIME) {
											simpleValues
													.addString(oFF.QInAExportUtil
															.dateTimeToString(
																	exporter,
																	variable
																			.getDateTime()));
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};
	oFF.QInAVarSimpleType.prototype.exportMultipleValues = function(exporter,
			variable, valueType, simpleValues) {
		var multiValues = variable.getValues();
		var size = multiValues.size();
		var idx;
		var intValue;
		var longValue;
		var doubleValue;
		var stringValue;
		var dateValue;
		var booleanValue;
		var spatialValue;
		for (idx = 0; idx < size; idx++) {
			if (valueType === oFF.XValueType.INTEGER) {
				intValue = multiValues.get(idx);
				this.addIntegerValue(exporter, simpleValues, intValue
						.getInteger());
			} else {
				if (valueType === oFF.XValueType.LONG) {
					longValue = multiValues.get(idx);
					this.addLongValue(exporter, simpleValues, longValue
							.getLong());
				} else {
					if (valueType === oFF.XValueType.DOUBLE) {
						doubleValue = multiValues.get(idx);
						this.addDoubleValue(exporter, simpleValues, doubleValue
								.getDouble());
					} else {
						if (valueType === oFF.XValueType.STRING) {
							stringValue = multiValues.get(idx);
							simpleValues.addString(stringValue.getString());
						} else {
							if (valueType === oFF.XValueType.DATE
									|| valueType === oFF.XValueType.TIME
									|| valueType === oFF.XValueType.DATE_TIME) {
								dateValue = multiValues.get(idx);
								simpleValues.addString(oFF.QInAExportUtil
										.dateTimeToString(exporter, dateValue));
							} else {
								if (valueType === oFF.XValueType.BOOLEAN) {
									booleanValue = multiValues.get(idx);
									simpleValues.addString(oFF.XBoolean
											.convertToString(booleanValue
													.getBoolean()));
								} else {
									if (valueType.isSpatial()) {
										spatialValue = multiValues.get(idx);
										simpleValues.addString(spatialValue
												.toWKT());
									}
								}
							}
						}
					}
				}
			}
		}
	};
	oFF.QInAVariableContainer = function() {
	};
	oFF.QInAVariableContainer.prototype = new oFF.QInAComponentWithList();
	oFF.QInAVariableContainer.prototype.getComponentType = function() {
		return oFF.OlapComponentType.VARIABLE_CONTAINER;
	};
	oFF.QInAVariableContainer.prototype.getTagName = function() {
		return "Variables";
	};
	oFF.QInAVariableContainer.prototype.importComponentWithList = function(
			importer, inaList, modelComponent, parentComponent, context) {
		var variableContainer = modelComponent;
		importer.importVariableList(inaList, variableContainer);
		return modelComponent;
	};
	oFF.QInAVariableContainer.prototype.exportComponentWithList = function(
			exporter, modelComponent, flags) {
		var variableContainer = modelComponent;
		var queryModel = variableContainer.getQueryModel();
		var variables;
		if (oFF.notNull(queryModel) && !queryModel.isExportingVariables()
				&& !queryModel.hasProcessingStep()) {
			return null;
		}
		variables = variableContainer.getVariables();
		if (oFF.XCollectionUtils.hasElements(variables)) {
			return exporter.exportVariableList(variableContainer);
		}
		return null;
	};
	oFF.QInAVariablesList = function() {
	};
	oFF.QInAVariablesList.prototype = new oFF.QInAComponentWithList();
	oFF.QInAVariablesList.prototype.getComponentType = function() {
		return oFF.OlapComponentType.VARIABLE_LIST;
	};
	oFF.QInAVariablesList.prototype.importComponentWithList = function(
			importer, inaList, modelComponent, parentComponent, context) {
		var variableContainer = modelComponent;
		var len;
		var varIdx;
		var inaVariable;
		var variableName;
		var variable;
		var variableType;
		var dimMemberVar;
		if (oFF.notNull(inaList)) {
			len = inaList.size();
			for (varIdx = 0; varIdx < len; varIdx++) {
				inaVariable = inaList.getStructureAt(varIdx);
				variableName = inaVariable.getStringByKey("Name");
				variable = variableContainer
						.getVariableBaseByName(variableName);
				if (oFF.notNull(variable)) {
					variableType = variable.getVariableType();
					if (variableType
							.isTypeOf(oFF.VariableType.SIMPLE_TYPE_VARIABLE)) {
						importer.importSimpleTypeVariable(inaVariable,
								variable, context);
					} else {
						if (variableType
								.isTypeOf(oFF.VariableType.DIMENSION_MEMBER_VARIABLE)) {
							dimMemberVar = variable;
							importer.importDimensionMemberVariable(inaVariable,
									dimMemberVar, null, dimMemberVar);
						} else {
							if (variableType
									.isTypeOf(oFF.VariableType.OPTION_LIST_VARIABLE)) {
								importer.importOptionListVariable(inaVariable,
										variable, context);
							} else {
								importer
										.addError(
												oFF.ErrorCodes.INVALID_PARAMETER,
												oFF.XStringUtils
														.concatenate5(
																"The variable '",
																variableName,
																"' of variable type '",
																variableType
																		.getName(),
																"' was not imported correctly"));
							}
						}
					}
				} else {
					importer.addWarning(oFF.ErrorCodes.ET_ELEMENT_NOT_FOUND,
							oFF.XStringUtils.concatenate3("The variable '",
									variableName, "' was not found"));
				}
			}
		}
		return modelComponent;
	};
	oFF.QInAVariablesList.prototype.exportComponentWithList = function(
			exporter, modelComponent, flags) {
		var variableContainer = modelComponent;
		var variables = variableContainer.getVariables();
		var inaVariableList;
		var len;
		var mode;
		var i;
		var variable;
		var inaVariable;
		var externalVariable;
		if (oFF.isNull(variables) || variables.isEmpty()) {
			return null;
		}
		inaVariableList = oFF.PrFactory.createList();
		len = variables.size();
		mode = exporter.mode;
		for (i = 0; i < len; i++) {
			variable = variables.get(i);
			inaVariable = null;
			if (mode === oFF.QModelFormat.INA_METADATA) {
				exporter.exportVariable(variable, null);
			} else {
				if (mode.isTypeOf(oFF.QModelFormat.INA_DATA)
						|| mode === oFF.QModelFormat.INA_VALUE_HELP) {
					externalVariable = variable.getExternalRepresentation();
					if (oFF.notNull(externalVariable)
							&& variable.getOlapComponentType() === externalVariable
									.getOlapComponentType()
							&& oFF.XString.isEqual(externalVariable.getName(),
									variable.getName())) {
						variable = externalVariable;
					}
					if (variable.isInputEnabled()) {
						inaVariable = oFF.PrFactory.createStructure();
						inaVariable.putString("Name", variable.getName());
						exporter.exportVariable(variable, inaVariable);
					}
				} else {
					inaVariable = oFF.PrFactory.createStructure();
					inaVariable.putString("Name", variable.getName());
					exporter.exportVariable(variable, inaVariable);
				}
			}
			if (oFF.notNull(inaVariable)) {
				inaVariableList.add(inaVariable);
			}
		}
		return inaVariableList;
	};
	oFF.QInARepository = function() {
	};
	oFF.QInARepository.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInARepository.prototype.getModelFormat = function() {
		return oFF.QModelFormat.INA_REPOSITORY;
	};
	oFF.QInARepository.prototype.isMatching = function(version,
			inaImportElement) {
		var isMatching = oFF.QInAComponentWithStructure.prototype.isMatching
				.call(this, version, inaImportElement);
		var inaStructure;
		var tagName;
		if (isMatching && oFF.notNull(inaImportElement)) {
			inaStructure = inaImportElement;
			tagName = this.getTagName();
			if (oFF.isNull(tagName)) {
				if (inaStructure.getStringByKey("CType") === null) {
					isMatching = false;
				}
			} else {
				isMatching = inaStructure.containsKey(tagName);
			}
		}
		return isMatching;
	};
	oFF.QInARepository.prototype.extendCustom = function(exporter,
			modelComponent, inaStructure) {
		var olapComponentType = this.getComponentType();
		var ctypeValue = oFF.QInAConverter
				.lookupComponentTypeInA(olapComponentType);
		if (oFF.isNull(ctypeValue)) {
			throw oFF.XException.createRuntimeException("ctype not found");
		}
		inaStructure.putString("CType", ctypeValue);
		return inaStructure;
	};
	oFF.QInAHierarchyValueHelp = function() {
	};
	oFF.QInAHierarchyValueHelp.prototype = new oFF.QInAComponentWithStructure();
	oFF.QInAHierarchyValueHelp.prototype.getComponentType = function() {
		return oFF.OlapComponentType.HIERARCHY;
	};
	oFF.QInAHierarchyValueHelp.prototype.getTagName = function() {
		return "Hierarchy";
	};
	oFF.QInAHierarchyValueHelp.prototype.getModelFormat = function() {
		return oFF.QModelFormat.INA_VALUE_HELP;
	};
	oFF.QInAHierarchyValueHelp.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var dimension = modelComponent;
		var hierarchyName = dimension.getHierarchyName();
		var inaHierarchy;
		var hierarchyVersion;
		var visibility;
		var memberOfPostedNodeVisibility;
		if (dimension.isSelectorHierarchyActive()
				&& oFF.XStringUtils.isNotNullAndNotEmpty(hierarchyName)) {
			inaHierarchy = oFF.PrFactory.createStructure();
			hierarchyVersion = dimension.getHierarchyVersion();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(hierarchyVersion)) {
				inaHierarchy.putString("Version", hierarchyVersion);
			}
			oFF.QInAExportUtil.setDate(exporter, inaHierarchy, "DueDate",
					dimension.getHierarchyDueDate());
			inaHierarchy.putString("Name", hierarchyName);
			inaHierarchy.putInteger("InitialDrillLevel", dimension
					.getSelectorRootLevel());
			visibility = dimension.getMemberOfPostedNodeVisibility();
			memberOfPostedNodeVisibility = oFF.QInAConverter
					.lookupResultSetVisibilityInA(visibility);
			inaHierarchy.putString("MemberOfPostedNodeVisibility",
					memberOfPostedNodeVisibility);
			return inaHierarchy;
		}
		return null;
	};
	oFF.QInAHierarchyValueHelp.prototype.importComponentWithStructure = oFF.noSupport;
	oFF.QCsnMdDimMembers = function() {
	};
	oFF.QCsnMdDimMembers.prototype = new oFF.QCsnComponentMetadata();
	oFF.QCsnMdDimMembers.prototype.getComponentType = function() {
		return oFF.OlapComponentType.MEMBERS;
	};
	oFF.QCsnMdDimMembers.prototype.newModelComponent = function(application,
			parentComponent, context) {
		return null;
	};
	oFF.QCsnMdDimMembers.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		return null;
	};
	oFF.QCsnMdDimMembers.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var dimension = modelComponent;
		var displayKeyField = dimension.getFlatDisplayKeyField();
		var members = dimension.getAllStructureMembers();
		var size = members.size();
		var i;
		var member;
		var displayKeyFieldValue;
		var csnStructureMember;
		for (i = 0; i < size; i++) {
			member = members.get(i);
			displayKeyFieldValue = member.getFieldValue(displayKeyField)
					.getValue();
			csnStructureMember = this.createStructureMemberElement(member,
					dimension.getDefaultAxisType());
			inaStructure.put(displayKeyFieldValue.getStringRepresentation(),
					csnStructureMember);
		}
		return inaStructure;
	};
	oFF.QCsnMdDimMembers.prototype.createStructureMemberElement = function(
			member, axisType) {
		var structure = oFF.PrFactory.createStructure();
		var aggregationType;
		var csnDfAggregation;
		var numericPrecision;
		var numericScale;
		var resultVisibility;
		var queryDataCells;
		var queryDataCell;
		structure.putBoolean(oFF.CsnConstants.A_MEASURE, true);
		structure.putString(oFF.CsnConstants.A_COMMON_LABEL, member.getText());
		structure.putNewStructure(oFF.CsnConstants.A_QUERY_AXIS).putString(
				oFF.CsnConstants.ENUM,
				oFF.QCsnConverter.lookupAxisCsn(axisType));
		aggregationType = member.getAggregationType();
		if (oFF.notNull(aggregationType)) {
			csnDfAggregation = structure
					.putNewStructure(oFF.CsnConstants.A_DEFAULT_AGGREGATION);
			csnDfAggregation.putString(oFF.CsnConstants.ENUM, aggregationType
					.getName());
		}
		numericPrecision = member.getNumericPrecision();
		if (oFF.notNull(numericPrecision)) {
			structure.putInteger(oFF.CsnConstants.PRECISION, numericPrecision
					.getInteger());
		}
		numericScale = member.getNumericScale();
		if (oFF.notNull(numericScale)) {
			structure.putInteger(oFF.CsnConstants.SCALE, numericScale
					.getInteger());
		}
		resultVisibility = member.getResultVisibility();
		if (resultVisibility === oFF.ResultVisibility.HIDDEN) {
			structure.putBoolean(oFF.CsnConstants.A_UI_HIDDEN, true);
		}
		queryDataCells = member.getQueryDataCells();
		if (queryDataCells.size() === 1) {
			queryDataCell = queryDataCells.get(0);
			structure.putInteger(oFF.CsnConstants.A_DECIMALS, queryDataCell
					.getDecimalPlaces());
			this.addCurrencyDimReference(structure, member, queryDataCell);
			this.addUnitDimReference(structure, member, queryDataCell);
		}
		return structure;
	};
	oFF.QCsnMdDimMembers.prototype.addCurrencyDimReference = function(
			structure, member, dataCell) {
		var valueType = dataCell.getBaseValueType();
		var queryModel;
		var currencyDimension;
		if (valueType === oFF.XValueType.AMOUNT) {
			queryModel = member.getDimension().getQueryModel();
			currencyDimension = queryModel
					.getDimensionByType(oFF.DimensionType.CURRENCY);
			if (oFF.notNull(currencyDimension)) {
				structure.putNewStructure(oFF.CsnConstants.A_ISO_CURRENCY)
						.putString(oFF.CsnConstants.REFERENCE,
								this.getDimExternalName(currencyDimension));
			}
		}
	};
	oFF.QCsnMdDimMembers.prototype.addUnitDimReference = function(structure,
			member, dataCell) {
		var valueType = dataCell.getBaseValueType();
		var queryModel;
		var unitDimension;
		if (valueType === oFF.XValueType.QUANTITY) {
			queryModel = member.getDimension().getQueryModel();
			unitDimension = queryModel
					.getDimensionByType(oFF.DimensionType.UNIT);
			if (oFF.notNull(unitDimension)) {
				structure.putNewStructure(oFF.CsnConstants.A_MEASURES_UNIT)
						.putString(oFF.CsnConstants.REFERENCE,
								this.getDimExternalName(unitDimension));
			}
		}
	};
	oFF.QCsnMdDimension = function() {
	};
	oFF.QCsnMdDimension.prototype = new oFF.QCsnComponentMetadata();
	oFF.QCsnMdDimension.getDisplay = function(dimension) {
		var displayTypes = oFF.XListOfString.create();
		var rsFields = dimension.getMainAttribute().getDefaultResultSetFields();
		var i = 0;
		while (i < rsFields.size() && displayTypes.size() < 2) {
			oFF.XCollectionUtils.addIfNotPresent(displayTypes, rsFields.get(i)
					.isKeyField() ? oFF.CsnConstants.DISPLAY_KEY
					: oFF.CsnConstants.DISPLAY_TEXT);
			i++;
		}
		return displayTypes.hasElements() ? oFF.XCollectionUtils.join(
				displayTypes, "_") : oFF.CsnConstants.DISPLAY_KEY;
	};
	oFF.QCsnMdDimension.getTotals = function(dimension) {
		return dimension.isTotalsVisibilityOnDefault() ? oFF.CsnConstants.TOTALS_SHOW
				: oFF.CsnConstants.TOTALS_HIDE;
	};
	oFF.QCsnMdDimension.prototype.getComponentType = function() {
		return oFF.OlapComponentType.ABSTRACT_DIMENSION;
	};
	oFF.QCsnMdDimension.prototype.newModelComponent = function(application,
			parentComponent, context) {
		return null;
	};
	oFF.QCsnMdDimension.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		return null;
	};
	oFF.QCsnMdDimension.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var dimension = modelComponent;
		var keyField = dimension.getFlatKeyField();
		var csnQueryDimension = inaStructure.putNewStructure(this
				.getDimExternalName(dimension));
		var csnDimension;
		csnQueryDimension.putBoolean(oFF.CsnConstants.A_DIMENSION, true);
		csnQueryDimension.putString(oFF.CsnConstants.TYPE,
				oFF.CsnConstants.TYPE_ASSOCIATION);
		csnQueryDimension.putString(oFF.CsnConstants.TARGET, dimension
				.getName());
		this.addLength(csnQueryDimension, keyField);
		csnQueryDimension.putNewStructure(oFF.CsnConstants.A_QUERY_AXIS)
				.putString(
						oFF.CsnConstants.ENUM,
						oFF.QCsnConverter.lookupAxisCsn(dimension
								.getDefaultAxisType()));
		csnQueryDimension.putNewStructure(oFF.CsnConstants.A_QUERY_DISPLAY)
				.putString(oFF.CsnConstants.ENUM,
						oFF.QCsnMdDimension.getDisplay(dimension));
		csnQueryDimension.putNewStructure(oFF.CsnConstants.A_QUERY_TOTALS)
				.putString(oFF.CsnConstants.ENUM,
						oFF.QCsnMdDimension.getTotals(dimension));
		csnQueryDimension.putNewList(oFF.CsnConstants.KEYS).addNewStructure()
				.putNewList(oFF.CsnConstants.REF).addAllStrings(
						this.getAllKeys(dimension));
		csnDimension = oFF.PrFactory.createStructure();
		csnDimension.putString(oFF.CsnConstants.A_COMMON_LABEL, dimension
				.getText());
		csnDimension.putString(oFF.CsnConstants.KIND,
				oFF.CsnConstants.KIND_ENTITY);
		csnDimension.putNewStructure(oFF.CsnConstants.A_DATA_CATEGORY)
				.putString(oFF.CsnConstants.ENUM,
						oFF.CsnConstants.DATA_CATEGORY_DIMENSION);
		csnDimension.putString(oFF.CsnConstants.A_REPRESENTATIVE_KEY, this
				.getFieldName(keyField));
		this.addFields(csnDimension.putNewStructure(oFF.CsnConstants.ELEMENTS),
				dimension);
		return csnDimension;
	};
	oFF.QCsnMdDimension.prototype.addFields = function(csnElements, dimension) {
		var keyField = dimension.getFlatKeyField();
		var textField = dimension.getFlatTextField();
		var fields = dimension.getFields();
		var size = fields.size();
		var i;
		var field;
		var csnElement;
		var textAttribute;
		for (i = 0; i < size; i++) {
			field = fields.get(i);
			csnElement = csnElements.putNewStructure(this.getFieldName(field));
			this.addLength(csnElement, field);
			csnElement.putString(oFF.CsnConstants.TYPE, oFF.QCsnConverter
					.lookupValueTypeCsn(field.getValueType(),
							oFF.CsnConstants.TYPE_STRING));
			if (field.isKeyField()) {
				csnElement.putBoolean(oFF.CsnConstants.KEY, true);
				textAttribute = field === keyField && oFF.notNull(textField) ? this
						.getFieldName(textField)
						: null;
				if (oFF.XStringUtils.isNotNullAndNotEmpty(textAttribute)) {
					csnElement.putNewStructure(
							oFF.CsnConstants.A_TEXT_ATTRIBUTE).putString(
							oFF.CsnConstants.REFERENCE, textAttribute);
				}
			} else {
				csnElement.putNewStructure(oFF.CsnConstants.A_TEXT_FOR)
						.putString(oFF.CsnConstants.REFERENCE,
								this.getFieldName(keyField));
			}
			if (!field.isFilterable()) {
				csnElement.putBoolean(oFF.CsnConstants.A_FILTERABLE, false);
			}
		}
	};
	oFF.QCsnMdDimension.prototype.addLength = function(structure, field) {
		if (field.getValueType().isString() && field.getLength() > 0) {
			structure.putInteger(oFF.CsnConstants.LENGTH, field.getLength());
		}
	};
	oFF.QCsnMdDimension.prototype.getAllKeys = function(dimension) {
		var keys = oFF.XListOfString.create();
		var keyField = dimension.getFlatKeyField();
		var fields = dimension.getFields();
		var size = fields.size();
		var i;
		var field;
		var type;
		var isDefaultKeyField;
		var isFlatKeyField;
		for (i = 0; i < size; i++) {
			field = fields.get(i);
			type = field.getPresentationType();
			isDefaultKeyField = field === keyField;
			isFlatKeyField = type === oFF.PresentationType.KEY
					&& !field.isHierarchyKeyField();
			if (isDefaultKeyField || isFlatKeyField) {
				keys.add(this.getFieldName(field));
			}
		}
		return keys;
	};
	oFF.QCsnMdDimensions = function() {
	};
	oFF.QCsnMdDimensions.prototype = new oFF.QCsnComponentMetadata();
	oFF.QCsnMdDimensions.prototype.getComponentType = function() {
		return oFF.OlapComponentType.DIMENSIONS;
	};
	oFF.QCsnMdDimensions.prototype.newModelComponent = function(application,
			parentComponent, context) {
		return null;
	};
	oFF.QCsnMdDimensions.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		return null;
	};
	oFF.QCsnMdDimensions.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var queryModel = modelComponent;
		var csnQueryDefinition = inaStructure.getStructureByKey(queryModel
				.getDataSource().getObjectName());
		var csnQueryElements = csnQueryDefinition
				.getStructureByKey(oFF.CsnConstants.ELEMENTS);
		var dimensions = queryModel.getDimensions();
		var size = dimensions.size();
		var i;
		var dimension;
		var csnDimension;
		for (i = 0; i < size; i++) {
			dimension = dimensions.get(i);
			if (dimension.isMeasureStructure()) {
				exporter.exportMembers(dimension, csnQueryElements);
			} else {
				csnDimension = exporter.exportDimension(dimension,
						csnQueryElements);
				inaStructure.put(dimension.getName(), csnDimension);
			}
		}
		return inaStructure;
	};
	oFF.QCsnMdQuery = function() {
	};
	oFF.QCsnMdQuery.prototype = new oFF.QCsnComponentMetadata();
	oFF.QCsnMdQuery.prototype.getComponentType = function() {
		return oFF.OlapComponentType.QUERY_MODEL;
	};
	oFF.QCsnMdQuery.prototype.newModelComponent = function(application,
			parentComponent, context) {
		return oFF.QueryModel.create(application, null, oFF.QCapabilities
				.create());
	};
	oFF.QCsnMdQuery.prototype.importComponentWithStructure = function(importer,
			inaStructure, modelComponent, parentComponent, context) {
		return null;
	};
	oFF.QCsnMdQuery.prototype.exportComponentWithStructure = function(exporter,
			modelComponent, inaStructure, flags) {
		var queryModel = modelComponent;
		var csnDefinitions = inaStructure
				.putNewStructure(oFF.CsnConstants.DEFINITIONS);
		var csnQueryDefinition = csnDefinitions.putNewStructure(queryModel
				.getDataSource().getObjectName());
		csnQueryDefinition.putString(oFF.CsnConstants.KIND,
				oFF.CsnConstants.KIND_ENTITY);
		csnQueryDefinition.putString(oFF.CsnConstants.A_COMMON_LABEL,
				queryModel.getText());
		csnQueryDefinition.putNewStructure(oFF.CsnConstants.ELEMENTS);
		exporter.exportDimensions(queryModel, csnDefinitions);
		exporter.exportVariables(queryModel.getVariableContainer(),
				inaStructure);
		return inaStructure;
	};
	oFF.QCsnMdVariable = function() {
	};
	oFF.QCsnMdVariable.prototype = new oFF.QCsnComponentMetadata();
	oFF.QCsnMdVariable.prototype.getComponentType = function() {
		return oFF.VariableType.ANY_VARIABLE;
	};
	oFF.QCsnMdVariable.prototype.newModelComponent = function(application,
			parentComponent, context) {
		return null;
	};
	oFF.QCsnMdVariable.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		return null;
	};
	oFF.QCsnMdVariable.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var variable = modelComponent;
		inaStructure.putString(oFF.CsnConstants.NAME, this
				.getVariableName(variable));
		return inaStructure;
	};
	oFF.QCsnMdVariable.prototype.getVariableName = function(variable) {
		var externalName = variable.getNameExternal();
		return oFF.XStringUtils.isNotNullAndNotEmpty(externalName) ? externalName
				: variable.getName();
	};
	oFF.QCsnMdVariables = function() {
	};
	oFF.QCsnMdVariables.prototype = new oFF.QCsnComponentMetadata();
	oFF.QCsnMdVariables.prototype.getComponentType = function() {
		return oFF.OlapComponentType.VARIABLE_CONTAINER;
	};
	oFF.QCsnMdVariables.prototype.newModelComponent = function(application,
			parentComponent, context) {
		return null;
	};
	oFF.QCsnMdVariables.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		return null;
	};
	oFF.QCsnMdVariables.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var variableContainer = modelComponent;
		var variables = variableContainer.getVariables();
		var csnParameters;
		var size;
		var i;
		if (variables.hasElements()) {
			csnParameters = inaStructure
					.putNewList(oFF.CsnConstants.PARAMETERS);
			size = variables.size();
			for (i = 0; i < size; i++) {
				exporter.exportVariable(variables.get(i), csnParameters
						.addNewStructure());
			}
		}
		return inaStructure;
	};
	oFF.QInAComponentContainer = function() {
	};
	oFF.QInAComponentContainer.prototype = new oFF.DfNameObject();
	oFF.QInAComponentContainer.create = function(type) {
		var newObj = new oFF.QInAComponentContainer();
		newObj.setName(type.getName());
		newObj.m_type = type;
		newObj.m_components = oFF.XList.create();
		return newObj;
	};
	oFF.QInAComponentContainer.prototype.m_components = null;
	oFF.QInAComponentContainer.prototype.m_type = null;
	oFF.QInAComponentContainer.prototype.isEmpty = function() {
		return this.m_components.isEmpty();
	};
	oFF.QInAComponentContainer.prototype.hasElements = function() {
		return this.m_components.hasElements();
	};
	oFF.QInAComponentContainer.prototype.size = function() {
		return this.m_components.size();
	};
	oFF.QInAComponentContainer.prototype.get = function(version,
			inaImportElement) {
		var size = this.m_components.size();
		var i;
		var currentComponent;
		for (i = 0; i < size; i++) {
			currentComponent = this.m_components.get(i);
			if (currentComponent.isMatching(version, inaImportElement)) {
				return currentComponent;
			}
		}
		return null;
	};
	oFF.QInAComponentContainer.prototype.add = function(component) {
		oFF.XBooleanUtils.checkFalse(this.m_components.contains(component),
				"Container already exists");
		this.m_components.add(component);
	};
	oFF.QInAComponentContainer.prototype.getComponentType = function() {
		return this.m_type;
	};
	oFF.QInAComponentContainer.prototype.getComponents = function() {
		return this.m_components;
	};
	oFF.QInAMdBasicMeasure = function() {
	};
	oFF.QInAMdBasicMeasure.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdBasicMeasure.prototype.getComponentType = function() {
		return oFF.MemberType.BASIC_MEASURE;
	};
	oFF.QInAMdBasicMeasure.prototype.newModelComponent = function(application,
			parentComponent, context) {
		return oFF.QBasicMeasure._createBasicMeasure(context, parentComponent);
	};
	oFF.QInAMdBasicMeasure.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var basicMeasure = modelComponent;
		basicMeasure.setName(inaStructure.getStringByKey("Name"));
		return modelComponent;
	};
	oFF.QInAMdBasicMeasure.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		inaStructure.putString("Name", modelComponent.getName());
		return inaStructure;
	};
	oFF.QInAMdDataSource = function() {
	};
	oFF.QInAMdDataSource.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdDataSource.importMd = function(importer, inaQueryModel,
			queryModel, context) {
		var inaStructure = inaQueryModel;
		var dataSource;
		var text;
		var baseDatasource;
		var infoProvider;
		if (oFF.notNull(inaStructure)
				&& !inaStructure.containsKey("DataSource")) {
			inaStructure = inaStructure.getStructureByKey("Analytics");
			if (oFF.notNull(inaStructure)
					&& !inaStructure.containsKey("DataSource")) {
				inaStructure = inaStructure.getStructureByKey("Definition");
			}
		}
		if (oFF.notNull(inaStructure) && inaStructure.containsKey("DataSource")) {
			dataSource = oFF.QInADataSource.importQd(importer, inaStructure,
					"DataSource", context);
			if (oFF.notNull(dataSource)) {
				if (oFF.XStringUtils.isNullOrEmpty(dataSource.getText())) {
					text = inaStructure.getStringByKey("Description");
					if (oFF.XStringUtils.isNotNullAndNotEmpty(text)) {
						dataSource.setText(text);
					}
				}
				queryModel.setDataSource(dataSource);
				queryModel.setText(dataSource.getText());
			}
		}
		baseDatasource = oFF.QInADataSource.importQd(importer, inaQueryModel,
				"BaseDataSource", context);
		if (oFF.notNull(baseDatasource)) {
			queryModel.setBaseDataSource(baseDatasource);
			infoProvider = oFF.QInfoProvider.createInfoProvider(queryModel,
					baseDatasource.getObjectName(), baseDatasource
							.getObjectName(), null);
			queryModel.setInfoProvider(infoProvider);
		}
	};
	oFF.QInAMdDataSource.exportMd = function(exporter, inaStructure, queryModel) {
		var inaDataSource = oFF.QInADataSource.exportDataSource(exporter,
				queryModel.getDataSource(), false, inaStructure);
		if (queryModel.getDataSource().getValidationHash() !== null) {
			inaDataSource.putString("ValidationHash", queryModel
					.getDataSource().getValidationHash());
		}
		return inaDataSource;
	};
	oFF.QInAMdDataSource.prototype.getComponentType = function() {
		return null;
	};
	oFF.QInAMdDataSource.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var queryModel = modelComponent;
		oFF.QInAMdDataSource.importMd(importer, inaStructure, queryModel,
				context);
		return modelComponent;
	};
	oFF.QInAMdDataSource.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var queryModel = modelComponent;
		return oFF.QInAMdDataSource
				.exportMd(exporter, inaStructure, queryModel);
	};
	oFF.QInAMdDimMembers = function() {
	};
	oFF.QInAMdDimMembers.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdDimMembers.importMd = function(importer, dimension, inaStructure) {
		var inaStructureMemberList;
		var fieldList;
		var keyField;
		var keyFieldName;
		var textField;
		var textFieldName;
		var size;
		var memberIdx;
		var inaStructureMember;
		var memberName;
		var memberText;
		var structureMember;
		var inaDefaultSelectedDimensions;
		var sizeDefaultSelections;
		var idxDefaultSelection;
		var resultCalculation;
		var aggregationType;
		var numericPrecision;
		var numericScale;
		var numericShift;
		var singleValueCalculation;
		var fieldSize;
		var fieldIdx;
		var field;
		var name;
		var valueType;
		var orderedNamesList;
		var orderedStructureMemberNames;
		var len;
		var orderedNameIndex;
		var orderedNameString;
		if (dimension.supportsBasicStructureMembers()) {
			inaStructureMemberList = inaStructure.getListByKey("BasicMembers");
			if (oFF.isNull(inaStructureMemberList)) {
				inaStructureMemberList = inaStructure.getListByKey("Members");
			}
			if (oFF.notNull(inaStructureMemberList)) {
				fieldList = dimension.getFields();
				keyField = dimension.getKeyField();
				keyFieldName = keyField.getName();
				textField = dimension.getTextField();
				textFieldName = oFF.isNull(textField) ? null : textField
						.getName();
				size = inaStructureMemberList.size();
				for (memberIdx = 0; memberIdx < size; memberIdx++) {
					inaStructureMember = inaStructureMemberList
							.getStructureAt(memberIdx);
					memberName = inaStructureMember
							.getStringByKey(keyFieldName);
					memberText = inaStructureMember
							.getStringByKey(textFieldName);
					structureMember = dimension.addNewBasicMeasure(memberName,
							memberText);
					structureMember.setIsSelectionCandidate(inaStructureMember
							.getBooleanByKeyExt("IsSelectionCandidate", true));
					inaDefaultSelectedDimensions = inaStructureMember
							.getListByKey("DefaultSelectedDimensions");
					if (oFF.notNull(inaDefaultSelectedDimensions)) {
						sizeDefaultSelections = inaDefaultSelectedDimensions
								.size();
						for (idxDefaultSelection = 0; idxDefaultSelection < sizeDefaultSelections; idxDefaultSelection++) {
							structureMember
									.addDefaultSelectionDimensionByName(inaDefaultSelectedDimensions
											.getStringAt(idxDefaultSelection));
						}
					}
					resultCalculation = oFF.QInAConverter
							.lookupResultCalculation(inaStructureMember
									.getStringByKeyExt("ResultCalculation",
											null));
					structureMember.setResultCalculation(resultCalculation);
					aggregationType = oFF.AggregationType.lookup(oFF.PrUtils
							.getStringValueProperty(inaStructureMember,
									"Aggregation", null));
					if (oFF.notNull(aggregationType)) {
						structureMember.setAggregationType(aggregationType);
					}
					numericPrecision = oFF.PrUtils.getIntegerProperty(
							inaStructureMember, "NumericPrecision");
					if (oFF.notNull(numericPrecision)) {
						structureMember.setNumericPrecision(numericPrecision
								.getInteger());
					}
					numericScale = oFF.PrUtils.getIntegerProperty(
							inaStructureMember, "NumericScale");
					if (oFF.notNull(numericScale)) {
						structureMember.setNumericScale(numericScale
								.getInteger());
					}
					numericShift = oFF.PrUtils.getIntegerProperty(
							inaStructureMember, "NumericShift");
					if (oFF.notNull(numericShift)) {
						structureMember.setNumericShift(numericShift
								.getInteger());
					}
					singleValueCalculation = oFF.QInAConverter
							.lookupSingleValueCalculation(inaStructureMember
									.getStringByKeyExt(
											"SingleValueCalculation", null));
					structureMember
							.setSingleValueCalculation(singleValueCalculation);
					fieldSize = fieldList.size();
					for (fieldIdx = 0; fieldIdx < fieldSize; fieldIdx++) {
						field = fieldList.get(fieldIdx);
						if (field.isCubeBlendingPropertiesField()) {
							continue;
						}
						name = field.getName();
						if (!inaStructureMember.containsKey(name)) {
							continue;
						}
						valueType = field.getValueType();
						if (valueType === oFF.XValueType.STRING) {
							structureMember.createAndAddFieldValueWithString(
									field, inaStructureMember
											.getStringByKey(name));
						} else {
							if (valueType === oFF.XValueType.BOOLEAN) {
								structureMember
										.createAndAddFieldValueWithBoolean(
												field, inaStructureMember
														.getBooleanByKey(name));
							} else {
								if (valueType === oFF.XValueType.INTEGER) {
									structureMember
											.createAndAddFieldValueWithInteger(
													field,
													inaStructureMember
															.getIntegerByKey(name));
								} else {
									if (valueType === oFF.XValueType.LONG) {
										structureMember
												.createAndAddFieldValueWithLong(
														field,
														inaStructureMember
																.getLongByKey(name));
									} else {
										if (valueType === oFF.XValueType.DOUBLE
												|| valueType === oFF.XValueType.DECIMAL_FLOAT) {
											structureMember
													.createAndAddFieldValueWithDouble(
															field,
															inaStructureMember
																	.getDoubleByKey(name));
										} else {
											importer
													.addError(
															oFF.ErrorCodes.INVALID_TOKEN,
															"Unsupported member type");
											return;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		orderedNamesList = oFF.PrUtils.getListProperty(inaStructure,
				"OrderedStructureMemberNames");
		if (oFF.notNull(orderedNamesList)) {
			orderedStructureMemberNames = oFF.XListOfString.create();
			len = oFF.PrUtils.getListSize(orderedNamesList, 0);
			for (orderedNameIndex = 0; orderedNameIndex < len; orderedNameIndex++) {
				orderedNameString = oFF.PrUtils.getStringElement(
						orderedNamesList, orderedNameIndex);
				oFF.XObjectExt.checkNotNull(orderedNameString, "illegal state");
				orderedStructureMemberNames.add(orderedNameString.getString());
			}
			dimension.reOrderStructureMembers(orderedStructureMemberNames);
		}
	};
	oFF.QInAMdDimMembers.exportMd = function(exporter, inaDimension, dimension) {
		var basicStructureMembers = dimension.getBasicStructureMembers();
		var fieldList;
		var fieldSize;
		var inaBasicMemberList;
		var memberSize;
		var idxMember;
		var inaMember;
		var idxField;
		var field;
		var fieldValue;
		var structureMember;
		var defaultSelectedDimensions;
		var inaDefaultSelectedDimensions;
		var numericPrecision;
		var numericScale;
		var numericShift;
		var fieldName;
		var valueType;
		var orderedStructureMemberNames;
		var orderedNamesList;
		if (oFF.notNull(basicStructureMembers)) {
			fieldList = dimension.getFields();
			fieldSize = fieldList.size();
			inaBasicMemberList = inaDimension.putNewList("BasicMembers");
			memberSize = basicStructureMembers.size();
			for (idxMember = 0; idxMember < memberSize; idxMember++) {
				inaMember = inaBasicMemberList.addNewStructure();
				for (idxField = 0; idxField < fieldSize; idxField++) {
					field = fieldList.get(idxField);
					if (field.isCubeBlendingPropertiesField()) {
						continue;
					}
					fieldValue = basicStructureMembers.get(idxMember)
							.getFieldValue(field);
					if (oFF.isNull(fieldValue)) {
						continue;
					}
					structureMember = basicStructureMembers.get(idxMember);
					if (!structureMember.isSelectionCandidate()) {
						inaMember.putBoolean("IsSelectionCandidate", false);
					}
					defaultSelectedDimensions = structureMember
							.getDefaultSelectedDimensionNames();
					if (oFF.notNull(defaultSelectedDimensions)) {
						inaDefaultSelectedDimensions = inaMember
								.putNewList("DefaultSelectedDimensions");
						inaDefaultSelectedDimensions
								.addAllStrings(defaultSelectedDimensions);
					}
					oFF.QInAExportUtil.setNameIfNotNull(inaMember,
							"SingleValueCalculation", structureMember
									.getSingleValueCalculation());
					oFF.QInAExportUtil.setNameIfNotNull(inaMember,
							"ResultCalculation", structureMember
									.getResultCalculation());
					oFF.QInAExportUtil
							.setNameIfNotNull(inaMember, "Aggregation",
									structureMember.getAggregationType());
					numericPrecision = structureMember.getNumericPrecision();
					if (oFF.notNull(numericPrecision)) {
						inaMember.putInteger("NumericPrecision",
								numericPrecision.getInteger());
					}
					numericScale = structureMember.getNumericScale();
					if (oFF.notNull(numericScale)) {
						inaMember.putInteger("NumericScale", numericScale
								.getInteger());
					}
					numericShift = structureMember.getNumericShift();
					if (oFF.notNull(numericShift)) {
						inaMember.putInteger("NumericShift", numericShift
								.getInteger());
					}
					fieldName = field.getName();
					valueType = fieldValue.getValueType();
					if (valueType === oFF.XValueType.STRING) {
						inaMember.putString(fieldName, fieldValue.getString());
					} else {
						if (valueType === oFF.XValueType.BOOLEAN) {
							inaMember.putBoolean(fieldName, fieldValue
									.getBoolean());
						} else {
							if (valueType === oFF.XValueType.INTEGER) {
								inaMember.putInteger(fieldName, fieldValue
										.getInteger());
							} else {
								if (valueType === oFF.XValueType.LONG) {
									inaMember.putLong(fieldName, fieldValue
											.getLong());
								} else {
									if (valueType === oFF.XValueType.DOUBLE
											|| valueType === oFF.XValueType.DECIMAL_FLOAT) {
										inaMember.putDouble(fieldName,
												fieldValue.getDouble());
									} else {
										exporter.addError(
												oFF.ErrorCodes.INVALID_TOKEN,
												"Unsupported element type");
									}
								}
							}
						}
					}
				}
			}
		}
		orderedStructureMemberNames = dimension
				.getOrderedStructureMemberNames();
		if (oFF.notNull(orderedStructureMemberNames)) {
			orderedNamesList = inaDimension
					.putNewList("OrderedStructureMemberNames");
			orderedNamesList.addAllStrings(orderedStructureMemberNames);
		}
	};
	oFF.QInAMdDimMembers.prototype.getComponentType = function() {
		return null;
	};
	oFF.QInAMdDimMembers.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		oFF.QInAMdDimMembers.importMd(importer, modelComponent, inaStructure);
		return modelComponent;
	};
	oFF.QInAMdDimMembers.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		oFF.QInAMdDimMembers.exportMd(exporter, inaStructure, modelComponent);
		return inaStructure;
	};
	oFF.QInAMdDimProperties = function() {
	};
	oFF.QInAMdDimProperties.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdDimProperties.importMdNameValuePairs = function(inaStructure,
			dimension) {
		var inaHierarchyProperties = oFF.PrUtils.getStructureProperty(
				inaStructure, "HierarchyProperties");
		var inaMasterDataProperties;
		var masterDataMaintenance;
		if (oFF.notNull(inaHierarchyProperties)) {
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyMaintenance", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyCreation", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyCreationByReference", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyUpdate", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyCopy", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyDeletion", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchySaving", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyActivation", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyExternalDimension", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyIntervals", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyReverseSign", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyStructureTimeDep", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyTimeDep", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyVersionDep", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyLocalMaintenance", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyLocalCreation", inaHierarchyProperties);
			oFF.QInAMdDimProperties
					.importHierarchyProperties(dimension,
							"HierarchyLocalCreationByReference",
							inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyLocalUpdate", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyLocalCopy", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyLocalDeletion", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyLocalSaving", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyLocalActivation", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyLocalExternalDimension", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyLocalIntervals", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyLocalReverseSign", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyLocalStructureTimeDep", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyLocalTimeDep", inaHierarchyProperties);
			oFF.QInAMdDimProperties.importHierarchyProperties(dimension,
					"HierarchyLocalVersionDep", inaHierarchyProperties);
		}
		inaMasterDataProperties = oFF.PrUtils.getStructureProperty(
				inaStructure, "MasterDataProperties");
		if (oFF.notNull(inaMasterDataProperties)) {
			masterDataMaintenance = oFF.PrUtils.getBooleanProperty(
					inaMasterDataProperties, "MasterDataMaintenance");
			if (oFF.notNull(masterDataMaintenance)) {
				dimension.addNameValuePair(oFF.XNameValuePair.createWithValues(
						"MasterDataMaintenance", oFF.XBoolean
								.convertToString(masterDataMaintenance
										.getBoolean())));
			}
		}
	};
	oFF.QInAMdDimProperties.importHierarchyProperties = function(dimension,
			propertyName, inaStructureHierarchyProperties) {
		var booleanProperty = oFF.PrUtils.getBooleanProperty(
				inaStructureHierarchyProperties, propertyName);
		if (oFF.notNull(booleanProperty)) {
			dimension.addNameValuePair(oFF.XNameValuePair.createWithValues(
					propertyName, oFF.XBoolean.convertToString(booleanProperty
							.getBoolean())));
		}
	};
	oFF.QInAMdDimProperties.prototype.getComponentType = function() {
		return null;
	};
	oFF.QInAMdDimProperties.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		oFF.QInAMdDimProperties.importMdNameValuePairs(inaStructure,
				modelComponent);
		return modelComponent;
	};
	oFF.QInAMdDimProperties.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		return inaStructure;
	};
	oFF.QInAMdDimension = function() {
	};
	oFF.QInAMdDimension.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdDimension.importDimensionGroups = function(inaStructure,
			dimensionMetadata) {
		var isGrouping = inaStructure.getBooleanByKeyExt("IsDimensionGroup",
				false);
		var dimensionGroups;
		var len;
		var j;
		var dimensionGroup;
		dimensionMetadata.setIsGroupingDimension(isGrouping);
		dimensionGroups = oFF.PrUtils.getListProperty(inaStructure,
				"DimensionGroups");
		len = oFF.PrUtils.getListSize(dimensionGroups, 0);
		for (j = 0; j < len; j++) {
			dimensionGroup = oFF.PrUtils.getStringElement(dimensionGroups, j);
			if (oFF.notNull(dimensionGroup)) {
				dimensionMetadata.addGroupingDimension(dimensionGroup
						.getString());
			}
		}
	};
	oFF.QInAMdDimension.exportDimensionGroup = function(inaStructure, dimension) {
		var groupingDimensionNames;
		var dimensionGroupList;
		var lenGrouping;
		var j;
		if (dimension.isGroupingDimension()) {
			inaStructure.putBoolean("IsDimensionGroup", true);
		}
		groupingDimensionNames = dimension.getGroupingDimensionNames();
		if (groupingDimensionNames.hasElements()) {
			dimensionGroupList = inaStructure.putNewList("DimensionGroups");
			lenGrouping = groupingDimensionNames.size();
			for (j = 0; j < lenGrouping; j++) {
				dimensionGroupList.addString(groupingDimensionNames.get(j));
			}
		}
	};
	oFF.QInAMdDimension.importDimensionFlags = function(dimensionMetadata,
			inaStructure) {
		var supportsMultipleValues;
		var selectionCapabilities;
		dimensionMetadata.setExternalName(inaStructure
				.getStringByKey("NameExternal"));
		dimensionMetadata.setSupportsLowerCase(oFF.PrUtils
				.getBooleanValueProperty(inaStructure, "LowercaseSupported",
						false));
		dimensionMetadata.setIsOwnerDimension(inaStructure.getBooleanByKeyExt(
				"IsOwnerDimension", false));
		dimensionMetadata.setIsPrivate(inaStructure.getBooleanByKeyExt(
				"Private", false));
		dimensionMetadata.setSupportsCumulative(inaStructure
				.getBooleanByKeyExt("SupportsCummulative", false));
		supportsMultipleValues = oFF.PrUtils.getBooleanValueProperty(
				inaStructure, "MultipleValues", true);
		selectionCapabilities = dimensionMetadata.getFilterCapabilitiesBase();
		selectionCapabilities.setSupportsMultipleValues(supportsMultipleValues);
		dimensionMetadata.setCanBeAggregated(inaStructure.getBooleanByKeyExt(
				"CanBeAggregated", true));
		dimensionMetadata.setIsHierarchyMandatory(inaStructure
				.getBooleanByKeyExt("IsHierarchyMandatory", false));
	};
	oFF.QInAMdDimension.exportDimensionFlags = function(inaStructure, dimension) {
		var selectionCapabilities;
		inaStructure.putString("Description", dimension.getText());
		inaStructure.putString("NameExternal", dimension.getExternalName());
		inaStructure.putBoolean("LowercaseSupported", dimension
				.supportsLowerCase());
		inaStructure.putBoolean("IsOwnerDimension", dimension
				.isOwnerDimension());
		inaStructure.putBoolean("Private", dimension.isPrivate());
		inaStructure.putBoolean("SupportsCummulative", dimension
				.supportsCumulative());
		selectionCapabilities = dimension.getFilterCapabilities();
		inaStructure.putBoolean("MultipleValues", selectionCapabilities
				.supportsMultipleValues());
		inaStructure.putBoolean("CanBeAggregated", dimension.canBeAggregated());
		inaStructure.putBoolean("IsHierarchyMandatory", dimension
				.isHierarchyMandatory());
	};
	oFF.QInAMdDimension.importAxesConstraints = function(dimensionMetadata,
			inaStructure) {
		var axisConstraints = inaStructure.getListByKey("AxisConstraints");
		var size;
		var axisIdx;
		if (oFF.PrUtils.isListEmpty(axisConstraints)) {
			dimensionMetadata.addSupportedAxis(oFF.AxisType.FREE);
			dimensionMetadata.addSupportedAxis(oFF.AxisType.ROWS);
			dimensionMetadata.addSupportedAxis(oFF.AxisType.COLUMNS);
		} else {
			size = axisConstraints.size();
			for (axisIdx = 0; axisIdx < size; axisIdx++) {
				dimensionMetadata.addSupportedAxis(oFF.QInAConverter
						.lookupAxisType(axisConstraints.getStringAt(axisIdx)));
			}
		}
	};
	oFF.QInAMdDimension.exportAxesConstraints = function(inaDimension,
			dimension) {
		var supportedAxesTypes = dimension.getSupportedAxesTypes()
				.getIterator();
		var inaAxisConstaints = inaDimension.putNewList("AxisConstraints");
		while (supportedAxesTypes.hasNext()) {
			inaAxisConstaints.addString(supportedAxesTypes.next().getName());
		}
		oFF.XObjectExt.release(supportedAxesTypes);
	};
	oFF.QInAMdDimension.importDimensionReadModes = function(queryModel,
			dimension, inaStructure) {
		if (oFF.notNull(queryModel)) {
			oFF.QInAMdDimension.importMdReadModeSettings(inaStructure,
					dimension, oFF.QContextType.RESULT_SET,
					"SupportedResultSetReadModes",
					"SupportedResultSetMemberReadModes",
					"ResultSetDefaultReadMode", "DefaultResultSetReadMode",
					"ResultSetMemberDefaultReadMode");
			oFF.QInAMdDimension.importMdReadModeSettings(inaStructure,
					dimension, oFF.QContextType.VARIABLE,
					"SupportedVariableReadModes", null,
					"DefaultVariableReadMode", null, null);
		}
		oFF.QInAMdDimension.importMdReadModeSettings(inaStructure, dimension,
				oFF.QContextType.SELECTOR, "SupportedSelectorReadModes", null,
				"SelectorDefaultReadMode", "DefaultSelectorReadMode", null);
	};
	oFF.QInAMdDimension.addSupportedReadModes = function(
			supportedRsMemberReadModes, dimension, context) {
		var size = supportedRsMemberReadModes.size();
		var i;
		var qReadMode;
		for (i = 0; i < size; i++) {
			qReadMode = oFF.QInAConverter
					.lookupReadMode(supportedRsMemberReadModes.getStringAt(i));
			if (oFF.notNull(qReadMode)) {
				dimension.addSupportedReadMode(context, qReadMode);
			}
		}
	};
	oFF.QInAMdDimension.setDefaultReadmode = function(inaDimension, dimension,
			context, defaultReadModeV1, defaultReadModeV2, defaultReadModeV3) {
		var readModeName = inaDimension.getStringByKey(defaultReadModeV1);
		var readMode;
		if (oFF.isNull(readModeName) && oFF.notNull(defaultReadModeV2)) {
			readModeName = inaDimension.getStringByKey(defaultReadModeV2);
		}
		if (oFF.isNull(readModeName) && oFF.notNull(defaultReadModeV3)) {
			readModeName = inaDimension.getStringByKey(defaultReadModeV3);
		}
		if (oFF.notNull(readModeName)) {
			readMode = oFF.QInAConverter.lookupReadMode(readModeName);
			if (oFF.notNull(readMode)) {
				dimension.setReadModeDefault(context, readMode);
			}
		}
	};
	oFF.QInAMdDimension.importMdReadModeSettings = function(inaDimension,
			dimension, context, supportedReadModesV1, supportedReadModesV2,
			defaultReadModeV1, defaultReadModeV2, defaultReadModeV3) {
		var inaSupportedRsMemberReadModes = inaDimension
				.getListByKey(supportedReadModesV1);
		if (oFF.isNull(inaSupportedRsMemberReadModes)
				&& oFF.notNull(supportedReadModesV2)) {
			inaSupportedRsMemberReadModes = inaDimension
					.getListByKey(supportedReadModesV2);
		}
		if (oFF.PrUtils.isListEmpty(inaSupportedRsMemberReadModes)) {
			dimension.addSupportedReadMode(context, oFF.QMemberReadMode.BOOKED);
			dimension.addSupportedReadMode(context, oFF.QMemberReadMode.MASTER);
			dimension.setReadModeDefault(context, oFF.QMemberReadMode.BOOKED);
		} else {
			oFF.QInAMdDimension.addSupportedReadModes(
					inaSupportedRsMemberReadModes, dimension, context);
			oFF.QInAMdDimension.setDefaultReadmode(inaDimension, dimension,
					context, defaultReadModeV1, defaultReadModeV2,
					defaultReadModeV3);
		}
	};
	oFF.QInAMdDimension.exportDimensionReadModes = function(exporter,
			inaStructure, dimension) {
		if (exporter.isAbap(dimension.getQueryModel())) {
			oFF.QInAMdDimension.exportMdSupportedReadModes(dimension,
					oFF.QContextType.RESULT_SET, inaStructure,
					"SupportedResultSetReadModes", "ResultSetDefaultReadMode");
			oFF.QInAMdDimension.exportMdSupportedReadModes(dimension,
					oFF.QContextType.VARIABLE, inaStructure,
					"SupportedVariableReadModes", "DefaultVariableReadMode");
		} else {
			oFF.QInAMdDimension.exportMdSupportedReadModes(dimension,
					oFF.QContextType.RESULT_SET, inaStructure,
					"SupportedResultSetMemberReadModes",
					"ResultSetDefaultReadMode");
		}
		oFF.QInAMdDimension.exportMdSupportedReadModes(dimension,
				oFF.QContextType.SELECTOR, inaStructure,
				"SupportedSelectorReadModes", "SelectorDefaultReadMode");
	};
	oFF.QInAMdDimension.exportMdSupportedReadModes = function(dimension,
			context, inaStructure, inaSupportedName, inaDefaultReadModeName) {
		var readModesIterator = dimension.getSupportedReadModes(context)
				.getIterator();
		var sortedList = oFF.XListOfString.create();
		var inaSupportedReadModes;
		var readModeDefault;
		while (readModesIterator.hasNext()) {
			sortedList.add(readModesIterator.next().getName());
		}
		oFF.XObjectExt.release(readModesIterator);
		sortedList.sortByDirection(oFF.XSortDirection.ASCENDING);
		inaSupportedReadModes = inaStructure.putNewList(inaSupportedName);
		inaSupportedReadModes.addAllStrings(sortedList);
		readModeDefault = dimension.getReadModeDefault(context);
		if (oFF.notNull(readModeDefault)) {
			inaStructure.putString(inaDefaultReadModeName, oFF.QInAConverter
					.lookupReadModeInA(readModeDefault));
		}
	};
	oFF.QInAMdDimension.exportMdSupportedSortTypes = function(exporter,
			inaStructure, dimension) {
		var supportedSortTypes = dimension.getSupportedSortTypes();
		var inaSortTypes;
		var keys;
		var allSize;
		var i;
		var sortType;
		if (oFF.notNull(supportedSortTypes) && exporter.supportsExtendedSort) {
			inaSortTypes = inaStructure.putNewList("ExtendedSortTypes");
			keys = supportedSortTypes.getKeysAsReadOnlyListOfString();
			allSize = keys.size();
			for (i = 0; i < allSize; i++) {
				sortType = supportedSortTypes.getByKey(keys.get(i));
				inaSortTypes.addString(oFF.QInAConverter
						.lookupSortTypeInA(sortType));
			}
		}
	};
	oFF.QInAMdDimension.prototype.getComponentType = function() {
		return oFF.OlapComponentType.ABSTRACT_DIMENSION;
	};
	oFF.QInAMdDimension.prototype.newModelComponent = function(application,
			parentComponent, context) {
		var myParent = parentComponent;
		if (oFF.isNull(myParent)) {
			myParent = context.getQueryModel();
		}
		return oFF.QDimension._create(context, myParent);
	};
	oFF.QInAMdDimension.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var dimension = modelComponent;
		var dimName = inaStructure.getStringByKey("Name");
		var dimensionVisibility;
		var defaultMemberValue;
		var queryModel;
		var hasQueryModel;
		var dataSource;
		var systemName;
		var queryName;
		var providerType;
		var validationHash;
		var olapEnvironment;
		var connection;
		var openConnections;
		var isSharedMetadata;
		var dimensionMetadataKey;
		var dimensionMetadata;
		var inaDimType;
		var dimType;
		var attValueType;
		var axisDefaultName;
		var axisDefault;
		var supportedAxesTypes;
		var iterator;
		var sortingManager;
		var inaSortTypes;
		var sortTypes;
		var sortSize;
		var i;
		var sortType;
		dimension.setName(dimName);
		dimension.setText(inaStructure.getStringByKey("Description"));
		dimensionVisibility = inaStructure.getIntegerByKeyExt("Visibility", -1);
		if (dimensionVisibility !== -1) {
			dimension.setVisibility(oFF.DimensionVisibility
					._getByInaCode(dimensionVisibility));
		}
		defaultMemberValue = inaStructure.getStringByKey("DefaultMember");
		if (oFF.notNull(defaultMemberValue)) {
			dimension.setDefaultMemberValue(defaultMemberValue);
		}
		queryModel = modelComponent.getQueryModel();
		hasQueryModel = oFF.notNull(queryModel);
		dataSource = context.getDataSource();
		systemName = dataSource.getSystemName();
		queryName = dataSource.getFullQualifiedName();
		providerType = "";
		if (context.getQueryManager() !== null) {
			providerType = context.getQueryManager().getProviderType()
					.getName();
		}
		validationHash = dataSource.getValidationHash();
		olapEnvironment = importer.getApplication().getOlapEnvironment();
		openConnections = olapEnvironment.getConnectionPool()
				.getOpenConnections(systemName);
		if (openConnections.isEmpty()) {
			connection = olapEnvironment.getConnection(systemName);
		} else {
			connection = openConnections.get(0);
		}
		isSharedMetadata = connection.getSystemDescription().getSystemType()
				.isTypeOf(oFF.SystemType.ABAP)
				&& dataSource.getRriName() !== null;
		dimensionMetadataKey = oFF.XStringUtils.concatenate5(oFF.XStringUtils
				.concatenate5(systemName, "~", isSharedMetadata ? null
						: queryName, "~", dimName), "~", providerType, "~",
				validationHash);
		dimensionMetadata = olapEnvironment
				.getDimensionMetadataByKey(dimensionMetadataKey);
		inaDimType = inaStructure.getIntegerByKeyExt("DimensionType", 3);
		dimType = oFF.QInAConverter.lookupDimensionType(inaDimType);
		if (inaDimType === 0 && hasQueryModel
				&& queryModel.supportsExpandQueryAndDetailedResponse()) {
			dimType = oFF.DimensionType.DIMENSION_INCOMPLETE;
		}
		if (oFF.isNull(dimensionMetadata)
				|| dimType === oFF.DimensionType.DIMENSION_INCOMPLETE) {
			dimensionMetadata = oFF.QDimensionMetadata.create(systemName,
					isSharedMetadata ? null : queryName, dimName, providerType,
					validationHash);
			dimensionMetadata.setDimensionType(dimType);
			oFF.QInAMdDimension.importDimensionGroups(inaStructure,
					dimensionMetadata);
			dimensionMetadata.setAttributeViewName(inaStructure
					.getStringByKeyExt("ViewAttributes", null));
			if (importer.supportsCustomDimensionMemberExecutionStep
					&& dimensionMetadata.isStructure()) {
				dimensionMetadata.setSupportsCalculatedBeforeAggregation(true);
			}
			dimensionMetadata.setEnforceDynamicValue(inaStructure
					.getBooleanByKeyExt("EnforceDynamicValue", false));
			attValueType = oFF.QInAConverter.lookupValueType(inaStructure
					.getStringByKey("DataType"));
			if (attValueType !== oFF.XValueType.UNSUPPORTED) {
				dimensionMetadata.setValueType(attValueType);
			}
			if (hasQueryModel) {
				oFF.QInAMdDimension.importAxesConstraints(dimensionMetadata,
						inaStructure);
				oFF.QInAMdDimension.importDimensionFlags(dimensionMetadata,
						inaStructure);
				axisDefaultName = inaStructure.getStringByKey("AxisDefault");
				if (oFF.XStringUtils.isNullOrEmpty(axisDefaultName)) {
					axisDefaultName = inaStructure.getStringByKey("Axis");
				}
				if (oFF.isNull(axisDefaultName)) {
					axisDefault = oFF.AxisType.FREE;
				} else {
					axisDefault = oFF.QInAConverter
							.lookupAxisType(axisDefaultName);
				}
				if (dimType !== oFF.DimensionType.DIMENSION_INCOMPLETE
						&& !dimensionMetadata.supportsAxis(axisDefault)) {
					supportedAxesTypes = dimensionMetadata
							.getSupportedAxesTypes();
					iterator = supportedAxesTypes.getIterator();
					if (iterator.hasNext()) {
						axisDefault = iterator.next();
					}
					oFF.XObjectExt.release(iterator);
				}
				dimensionMetadata.setDefaultAxisType(axisDefault);
			}
			if (!hasQueryModel || !queryModel.supportsExpandQueryAxis()
					|| inaDimType !== 0) {
				olapEnvironment.setDimensionMetadata(dimensionMetadata);
			} else {
				if (queryModel.supportsExpandQueryAxis()) {
					dimensionMetadata.setIncompleteDimensionMetadata(true);
				}
			}
		}
		dimension.setMetadata(dimensionMetadata);
		dimension.setDimensionType(dimType);
		if (!importer.supportsExtendedSort && hasQueryModel
				&& !importer.isVirtualInA(queryModel)) {
			if (!dimension.isMeasureStructure()) {
				sortingManager = queryModel.getSortingManagerBase();
				sortingManager.addSupportedSortType(oFF.SortType.FIELD);
				sortingManager.addSupportedSortType(oFF.SortType.MEMBER_KEY);
				sortingManager.addSupportedSortType(oFF.SortType.MEMBER_TEXT);
			}
		}
		inaSortTypes = inaStructure.getListByKey("ExtendedSortTypes");
		if (importer.supportsExtendedSort && oFF.notNull(inaSortTypes)) {
			sortTypes = oFF.XSetOfNameObject.create();
			sortSize = inaSortTypes.size();
			for (i = 0; i < sortSize; i++) {
				sortType = oFF.QInAConverter.lookupSortType(inaSortTypes
						.getStringAt(i));
				if (oFF.notNull(sortType)) {
					sortTypes.add(sortType);
				}
			}
			dimension.setSupportedSortTypes(sortTypes);
		}
		oFF.QInAMdFieldsList.importMd(importer, inaStructure, dimension);
		oFF.QInAMdFieldsAttributes.importMd(dimension, inaStructure);
		oFF.QInAMdFieldsRoles.importMd(importer, inaStructure, dimension);
		oFF.QInAMdFilterCapability.updateFilterCapabilities(dimension);
		oFF.QInAMdFieldsResultSet.importMd(importer, inaStructure, dimension);
		oFF.QInAMdDimMembers.importMd(importer, dimension, inaStructure);
		oFF.QInAMdDimension.importDimensionReadModes(queryModel, dimension,
				inaStructure);
		oFF.QInAMdHierarchy
				.importMdHierarchy(importer, inaStructure, dimension);
		oFF.QInAMdDimProperties.importMdNameValuePairs(inaStructure, dimension);
		return dimension;
	};
	oFF.QInAMdDimension.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var dimension = modelComponent;
		var dimName = dimension.getName();
		var dimensionVisibility;
		var defaultMemberValue;
		var dimType;
		var axisType;
		var inaAxisType;
		inaStructure.putString("Name", dimName);
		dimensionVisibility = dimension.getVisibility();
		if (oFF.notNull(dimensionVisibility)) {
			inaStructure.putInteger("Visibility", dimensionVisibility
					._getInaCode());
		}
		defaultMemberValue = dimension.getDefaultMemberValue();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(defaultMemberValue)) {
			inaStructure.putString("DefaultMember", defaultMemberValue);
		}
		dimType = -1;
		if (dimension.getDimensionType() === oFF.DimensionType.DIMENSION_INCOMPLETE
				&& dimension.getQueryModel()
						.supportsExpandQueryAndDetailedResponse()) {
			dimType = 0;
		} else {
			dimType = oFF.QInAConverter.lookupDimensionTypeInA(dimension
					.getDimensionType());
		}
		inaStructure.putInteger("DimensionType", dimType);
		inaStructure.putStringNotNull("ViewAttributes", dimension
				.getAttributeViewName());
		axisType = dimension.getDefaultAxisType();
		inaAxisType = oFF.QInAConverter.lookupAxisTypeInA(axisType);
		inaStructure.putString("AxisDefault", inaAxisType);
		oFF.QInAMdDimension.exportDimensionFlags(inaStructure, dimension);
		oFF.QInAMdDimMembers.exportMd(exporter, inaStructure, dimension);
		oFF.QInAMdFieldsList.exportMd(exporter, inaStructure, dimension);
		oFF.QInAMdFieldsResultSet.exportMd(inaStructure, dimension);
		oFF.QInAMdFieldsRoles.exportMd(inaStructure, dimension);
		oFF.QInAMdFieldsAttributes.exportMd(inaStructure, dimension);
		oFF.QInAMdDimension.exportDimensionGroup(inaStructure, dimension);
		oFF.QInAMdHierarchy
				.exportMdHierarchy(exporter, inaStructure, dimension);
		oFF.QInAMdDimension.exportAxesConstraints(inaStructure, dimension);
		oFF.QInAMdDimension.exportDimensionReadModes(exporter, inaStructure,
				dimension);
		oFF.QInAMdDimension.exportMdSupportedSortTypes(exporter, inaStructure,
				dimension);
		inaStructure.putBoolean("EnforceDynamicValue", dimension
				.isEnforcedDynamicValue());
		inaStructure.putStringNotNull("DataType", oFF.QInAConverter
				.lookupValueTypeInA(dimension.getValueType()));
		return inaStructure;
	};
	oFF.QInAMdDrillManager = function() {
	};
	oFF.QInAMdDrillManager.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdDrillManager.prototype.getComponentType = function() {
		return oFF.OlapComponentType.DRILL_MANAGER;
	};
	oFF.QInAMdDrillManager.prototype.newModelComponent = function(application,
			parentComponent, context) {
		return oFF.QFactory.newDrillManager(context);
	};
	oFF.QInAMdDrillManager.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var supports = importer.supportsHierNavCounter;
		var drillManager;
		if (oFF.notNull(inaStructure)) {
			supports = inaStructure.getBooleanByKeyExt(
					"SupportsHierNavCounter", supports);
		}
		drillManager = modelComponent;
		drillManager.setSupportsDrillCounter(supports);
		return drillManager;
	};
	oFF.QInAMdDrillManager.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var drillManager = modelComponent;
		inaStructure.putBoolean("SupportsHierNavCounter", drillManager
				.supportsDrillCounter());
		return inaStructure;
	};
	oFF.QInAMdExceptionAggregationManager = function() {
	};
	oFF.QInAMdExceptionAggregationManager.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdExceptionAggregationManager.prototype.getComponentType = function() {
		return oFF.OlapComponentType.EXCEPTION_AGGREGATION_MANAGER;
	};
	oFF.QInAMdExceptionAggregationManager.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var excpAggrManager = modelComponent;
		var inaExcepAggrs;
		var inaDimensionSetsList;
		var inaDimensionSetsSize;
		var i;
		var inaExcepAggrGroups;
		var inaExcepAggrSize;
		var j;
		if (oFF.notNull(inaStructure) && oFF.notNull(excpAggrManager)) {
			excpAggrManager._clear();
			inaExcepAggrs = inaStructure
					.getStructureByKey("ExceptionAggregations");
			if (oFF.notNull(inaExcepAggrs)) {
				inaDimensionSetsList = inaExcepAggrs
						.getListByKey("DimensionSets");
				if (!oFF.PrUtils.isListEmpty(inaDimensionSetsList)) {
					inaDimensionSetsSize = inaDimensionSetsList.size();
					for (i = 0; i < inaDimensionSetsSize; i++) {
						this._importDimensionSet(excpAggrManager,
								inaDimensionSetsList.get(i).asStructure());
					}
				}
				inaExcepAggrGroups = inaExcepAggrs
						.getListByKey("AggregationGroups");
				if (!oFF.PrUtils.isListEmpty(inaExcepAggrGroups)) {
					inaExcepAggrSize = inaExcepAggrGroups.size();
					for (j = 0; j < inaExcepAggrSize; j++) {
						this._importExceptionAggregationGroup(excpAggrManager,
								inaExcepAggrGroups.get(j).asStructure());
					}
				}
			} else {
				excpAggrManager._setupDefaultConfigurations();
			}
		}
		return excpAggrManager;
	};
	oFF.QInAMdExceptionAggregationManager.prototype._importDimensionSet = function(
			excpAggrManager, inaDimensionSet) {
		excpAggrManager._addDimensionSet(
				inaDimensionSet.getStringByKey("Name"), this
						._getAsStringList(inaDimensionSet
								.getListByKey("Dimensions")));
	};
	oFF.QInAMdExceptionAggregationManager.prototype._importExceptionAggregationGroup = function(
			excpAggrManager, inaExcepAggrGroup) {
		var groupName = inaExcepAggrGroup.getStringByKey("Name");
		var supportedDimensionSet = inaExcepAggrGroup.getStringByKeyExt(
				"SupportedDimensions", "");
		var maxNumberOfDim = inaExcepAggrGroup.getIntegerByKeyExt(
				"MaxNumberOfDimensions", -1);
		var inaAggregationMapList = inaExcepAggrGroup
				.getListByKey("AggregationMap");
		var inaAggrMapSize = inaAggregationMapList.size();
		var i;
		var inaAggrMap;
		var membersCode;
		for (i = 0; i < inaAggrMapSize; i++) {
			inaAggrMap = inaAggregationMapList.getStructureAt(i);
			membersCode = inaAggrMap.getIntegerByKeyExt("MembersCode",
					excpAggrManager._getDefaultMembersCode());
			excpAggrManager
					._addExceptionAggregationGroup(oFF.QExceptionAggregationGroup
							._create(excpAggrManager, groupName, membersCode,
									maxNumberOfDim, supportedDimensionSet,
									this._getAsStringList(inaAggrMap
											.getListByKey("AggregationTypes"))));
		}
	};
	oFF.QInAMdExceptionAggregationManager.prototype._getAsStringList = function(
			sourceList) {
		var targetList = oFF.XListOfString.create();
		var sourceListSize = sourceList.size();
		var i;
		for (i = 0; i < sourceListSize; i++) {
			targetList.add(sourceList.getStringAt(i));
		}
		return targetList;
	};
	oFF.QInAMdExceptionAggregationManager.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var excpAggrManager = modelComponent;
		var inaExcepAggrs;
		var inaDimensionSetsList;
		var dimensionSets;
		var dimensionSetsKeys;
		var setsSize;
		var i;
		var setName;
		var inaAggrGroupsList;
		var excepAggrGroups;
		var groupsSize;
		var supportedGroups;
		var j;
		if (oFF.notNull(excpAggrManager)) {
			inaExcepAggrs = inaStructure
					.putNewStructure("ExceptionAggregations");
			inaDimensionSetsList = inaExcepAggrs.putNewList("DimensionSets");
			dimensionSets = excpAggrManager._getDimensionSets();
			dimensionSetsKeys = dimensionSets.getKeysAsReadOnlyListOfString();
			setsSize = dimensionSetsKeys.size();
			for (i = 0; i < setsSize; i++) {
				setName = dimensionSetsKeys.get(i);
				inaDimensionSetsList.add(this._exportDimensionSet(setName,
						dimensionSets.getByKey(setName)));
			}
			inaAggrGroupsList = inaExcepAggrs.putNewList("AggregationGroups");
			excepAggrGroups = excpAggrManager
					._getExceptionAggregationGroupNames();
			groupsSize = excepAggrGroups.size();
			supportedGroups = excpAggrManager._getExceptionAggregationGroups();
			for (j = 0; j < groupsSize; j++) {
				inaAggrGroupsList.add(this
						._exportExceptionAggregationGroup(supportedGroups
								.get(j)));
			}
		}
		return inaStructure;
	};
	oFF.QInAMdExceptionAggregationManager.prototype._exportDimensionSet = function(
			setName, dimensions) {
		var dimSize = dimensions.size();
		var inaDimensionSet = oFF.PrStructure.create();
		var inaDimensions;
		var i;
		inaDimensionSet.putString("Name", setName);
		inaDimensions = inaDimensionSet.putNewList("Dimensions");
		for (i = 0; i < dimSize; i++) {
			inaDimensions.add(oFF.PrString.createWithValue(dimensions.get(i)));
		}
		return inaDimensionSet;
	};
	oFF.QInAMdExceptionAggregationManager.prototype._exportExceptionAggregationGroup = function(
			excepAggrGroup) {
		var inaExcepAggrGroup = oFF.PrStructure.create();
		var inaAggrMap;
		var inaAggrTypes;
		var supportedAggregations;
		var supportedAggrSize;
		var i;
		var inaAggrMapList;
		inaExcepAggrGroup.putString("Name", excepAggrGroup.getName());
		inaExcepAggrGroup.putString("SupportedDimensions", excepAggrGroup
				._getSupportedDimensionSetName());
		inaExcepAggrGroup.putInteger("MaxNumberOfDimensions", excepAggrGroup
				._getNumberOfAllowedDimensions());
		inaAggrMap = oFF.PrStructure.create();
		inaAggrMap.putInteger("MembersCode", excepAggrGroup._getMembersCode());
		inaAggrTypes = inaAggrMap.putNewList("AggregationTypes");
		supportedAggregations = excepAggrGroup
				._getSupportedAggregationTypeNames();
		supportedAggrSize = supportedAggregations.size();
		for (i = 0; i < supportedAggrSize; i++) {
			inaAggrTypes.add(oFF.PrString.createWithValue(supportedAggregations
					.get(i)));
		}
		inaAggrMapList = inaExcepAggrGroup.putNewList("AggregationMap");
		inaAggrMapList.add(inaAggrMap);
		return inaExcepAggrGroup;
	};
	oFF.QInAMdField = function() {
	};
	oFF.QInAMdField.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdField.prototype.getComponentType = function() {
		return oFF.OlapComponentType.FIELD;
	};
	oFF.QInAMdField.prototype.newModelComponent = function(application,
			parentComponent, context) {
		return oFF.QField._createField(context, parentComponent, null);
	};
	oFF.QInAMdField.prototype.importComponentWithStructure = function(importer,
			inaStructure, modelComponent, parentComponent, context) {
		var field = modelComponent;
		var fieldName = inaStructure.getStringByKey("Name");
		var dimensionNameFromInA = inaStructure.getStringByKey("DimensionName");
		var inaTextTransformation;
		var dataSource;
		var systemName;
		var queryName;
		var providerType;
		var validationHash;
		var olapEnvironment;
		var connection;
		var openConnections;
		var isSharedMetadata;
		var fieldMetadataKey;
		var fieldMetadata;
		var queryModel;
		var inaDataType;
		var attValueType;
		var dimensionName;
		var precision;
		var usageTypeValue;
		var inaInfoObjectType;
		var infoObjectType;
		var inaVisibilityType;
		var visibilityType;
		var dimension;
		var dimSelectionCapabilities;
		var fieldSelectionCapability;
		field.setName(fieldName);
		field.setText(inaStructure.getStringByKey("Description"));
		field.setObtainability(oFF.ObtainabilityType.lookup(inaStructure
				.getStringByKey("Obtainability")));
		field.setDisplayFormat(inaStructure.getStringByKey("DisplayFormat"));
		inaTextTransformation = inaStructure
				.getStringByKey("TextTransformation");
		if (oFF.notNull(inaTextTransformation)) {
			field.setTextTransformation(oFF.QInAConverter
					.lookupTextTransformation(inaTextTransformation));
		}
		dataSource = context.getDataSource();
		systemName = dataSource.getSystemName();
		queryName = dataSource.getFullQualifiedName();
		providerType = "";
		if (context.getQueryManager() !== null) {
			providerType = context.getQueryManager().getProviderType()
					.getName();
		}
		validationHash = dataSource.getValidationHash();
		olapEnvironment = importer.getApplication().getOlapEnvironment();
		openConnections = olapEnvironment.getConnectionPool()
				.getOpenConnections(systemName);
		if (openConnections.isEmpty()) {
			connection = olapEnvironment.getConnection(systemName);
		} else {
			connection = openConnections.get(0);
		}
		isSharedMetadata = connection.getSystemDescription().getSystemType()
				.isTypeOf(oFF.SystemType.ABAP)
				&& dataSource.getRriName() !== null;
		fieldMetadataKey = oFF.XStringUtils.concatenate3(oFF.XStringUtils
				.concatenate5(oFF.XStringUtils.concatenate5(systemName, "~",
						isSharedMetadata ? null : queryName, "~", fieldName),
						"~", providerType, "~", dimensionNameFromInA), "~",
				validationHash);
		fieldMetadata = olapEnvironment.getFieldMetadataByKey(fieldMetadataKey);
		queryModel = context.getQueryModel();
		if (oFF.isNull(fieldMetadata)) {
			fieldMetadata = oFF.QFieldMetadata.create(systemName,
					isSharedMetadata ? null : queryName, fieldName,
					providerType, dimensionNameFromInA, validationHash);
			fieldMetadata
					.setAliasName(inaStructure.getStringByKey("AliasName"));
			fieldMetadata.setMappedColumnName(inaStructure.getStringByKeyExt(
					"MappedColumn", null));
			fieldMetadata.setSqlType(inaStructure.getStringByKeyExt("SQLType",
					null));
			fieldMetadata.setSemanticType(inaStructure.getStringByKeyExt(
					"SemanticType", null));
			inaDataType = inaStructure.getStringByKey("DataType");
			attValueType = oFF.QInAConverter.lookupValueType(inaDataType);
			if (attValueType === oFF.XValueType.UNSUPPORTED) {
				dimensionName = field.getDimension().getName();
				if (queryModel.getUniversalDisplayHierarchies().getByName(
						dimensionName) !== null) {
					attValueType = oFF.XValueType.STRING;
				}
			}
			fieldMetadata.setValueType(attValueType);
			if (!this.updatePresentationType(importer, inaStructure,
					fieldMetadata)) {
				return null;
			}
			if (importer.hasCapability(oFF.InACapabilities.RESULTSET_INTERVAL)) {
				fieldMetadata.setUpperBound(inaStructure
						.getStringByKey("UpperBound"));
				fieldMetadata.setLowerBound(inaStructure
						.getStringByKey("LowerBound"));
			}
			fieldMetadata.setIsFilterable(inaStructure.getBooleanByKeyExt(
					"IsFilterable", true));
			fieldMetadata.setIsLowerCaseEnabled(inaStructure
					.getBooleanByKeyExt("LowerCaseEnabled", false));
			fieldMetadata.setInitialValue(inaStructure.getStringByKeyExt(
					"InitialValue", null));
			fieldMetadata.setLength(inaStructure
					.getIntegerByKeyExt("Length", 0));
			fieldMetadata.setDecimals(inaStructure.getIntegerByKeyExt(
					"Decimals", 0));
			precision = inaStructure.getIntegerByKeyExt("FractDigits", 0);
			if (precision !== 0) {
				fieldMetadata.setPrecision(precision);
			}
			fieldMetadata.setIsDisplayAttributeField(inaStructure
					.getBooleanByKeyExt("IsDisplayAttribute", false));
			fieldMetadata.setAttributeType(inaStructure.getStringByKeyExt(
					"AttributeType", null));
			fieldMetadata
					.setNavigationalAttributeDescription(inaStructure
							.getStringByKeyExt(
									"NavigationalAttributeDescription", null));
			this.importDependencies(inaStructure, fieldMetadata);
			usageTypeValue = inaStructure.getStringByKey("UsageType");
			if (oFF.notNull(usageTypeValue)) {
				fieldMetadata.setUsageType(oFF.FieldUsageType
						.lookup(usageTypeValue));
			}
			inaInfoObjectType = inaStructure.getStringByKeyExt("InfoobjType",
					null);
			if (oFF.notNull(inaInfoObjectType)) {
				infoObjectType = oFF.QInAConverter
						.lookupInfoObjectType(inaInfoObjectType);
				fieldMetadata.setInfoObjectType(infoObjectType);
			}
			inaVisibilityType = inaStructure.getStringByKeyExt(
					"VisibilityType", null);
			if (oFF.notNull(inaVisibilityType)) {
				visibilityType = oFF.QInAConverter
						.lookupVisibilityType(inaVisibilityType);
				fieldMetadata.setVisibilityType(visibilityType);
			}
			dimension = parentComponent;
			if (oFF.notNull(dimension)) {
				dimSelectionCapabilities = dimension.getMetadataBase()
						.getFilterCapabilitiesBase();
				fieldSelectionCapability = oFF.QInAMdFilterCapability.importMd(
						importer, inaStructure, field,
						dimSelectionCapabilities, context);
				if (oFF.notNull(fieldSelectionCapability)) {
					dimSelectionCapabilities
							.addFilterCapability(fieldSelectionCapability);
				}
			}
			fieldMetadata.setMimeType(inaStructure.getStringByKey("MIMEType"));
			olapEnvironment.setFieldMetadata(fieldMetadata);
		}
		if (oFF.notNull(queryModel)
				&& queryModel.getSystemType().isTypeOf(oFF.SystemType.ABAP)) {
			if (!this.updatePresentationType(importer, inaStructure,
					fieldMetadata)) {
				return null;
			}
		}
		field.setMetadata(fieldMetadata);
		return field;
	};
	oFF.QInAMdField.prototype.updatePresentationType = function(importer,
			inaStructure, fieldMetadata) {
		var attPresentationType = inaStructure
				.getStringByKey("PresentationType");
		var presentationType = oFF.QInAConverter
				.lookupPresentationType(attPresentationType);
		if (presentationType === oFF.PresentationType.WHY_FOUND
				&& oFF.QInAConverter.lookupValueType(inaStructure
						.getStringByKey("DataType")) !== oFF.XValueType.PROPERTIES) {
			importer.addError(oFF.ErrorCodes.INVALID_STATE,
					"Why found has not properties type");
			return false;
		}
		fieldMetadata.setPresentationType(presentationType);
		return true;
	};
	oFF.QInAMdField.prototype.exportComponentWithStructure = function(exporter,
			modelComponent, inaStructure, flags) {
		var field = modelComponent;
		var obtain;
		var infoObjectType;
		var visibilityType;
		var textTransformationType;
		var inaDependentAttributes;
		var selectionCapabilities;
		var selectionCapability;
		inaStructure.putString("Name", field.getName());
		inaStructure.putString("AliasName", field.getAliasName());
		inaStructure.putString("Description", field.getText());
		inaStructure.putString("DataType", oFF.QInAConverter
				.lookupValueTypeInA(field.getValueType()));
		inaStructure.putString("PresentationType", oFF.QInAConverter
				.lookupPresentationTypeInA(field.getPresentationType()));
		obtain = field.getObtainability();
		inaStructure.putString("Obtainability", oFF.isNull(obtain) ? null
				: obtain.getName());
		inaStructure.putBoolean("IsFilterable", field.isFilterable());
		inaStructure.putBoolean("LowerCaseEnabled", field
				.getIsLowerCaseEnabled());
		inaStructure.putString("InitialValue", field.getInitialValue());
		inaStructure.putInteger("Length", field.getLength());
		inaStructure.putInteger("Decimals", field.getDecimals());
		inaStructure.putBoolean("IsDisplayAttribute", field
				.isDisplayAttributeField());
		inaStructure.putString("MappedColumn", field.getMappedColumnName());
		inaStructure.putString("AttributeType", field.getAttributeType());
		inaStructure.putString("NavigationalAttributeDescription", field
				.getNavigationalAttributeDescription());
		inaStructure.putStringNotNull("SQLType", field.getSqlType());
		inaStructure.putStringNotNull("SemanticType", field.getSemanticType());
		inaStructure.putString("UsageType", field.getUsageType().getName());
		inaStructure.putStringNotNull("LowerBound", field.getLowerBound());
		inaStructure.putStringNotNull("UpperBound", field.getUpperBound());
		if (field.getPrecision() !== 0) {
			inaStructure.putInteger("FractDigits", field.getPrecision());
		}
		infoObjectType = field.getInfoObjectType();
		if (oFF.notNull(infoObjectType)) {
			inaStructure.putString("InfoobjType", oFF.QInAConverter
					.lookupInfoObjectTypeInA(infoObjectType));
		}
		visibilityType = field.getVisibilityType();
		if (oFF.notNull(visibilityType)) {
			inaStructure.putString("VisibilityType", oFF.QInAConverter
					.lookupVisibilityTypeInA(visibilityType));
		}
		textTransformationType = field.getTextTransformation();
		if (oFF.notNull(textTransformationType)) {
			inaStructure.putString("TextTransformation", oFF.QInAConverter
					.lookupTextTransformationInA(textTransformationType));
		}
		if (!exporter.mode.isTypeOf(oFF.QModelFormat.INA_DATA_BLENDING_SOURCE)) {
			inaStructure.putStringNotNull("DisplayFormat", field
					.getDisplayFormat());
		}
		inaStructure.putStringNotNull("MIMEType", field.getMimeType());
		inaDependentAttributes = inaStructure.putNewList("DependentAttributes");
		inaDependentAttributes.addAllStrings(field.getDependencyFields());
		selectionCapabilities = field.getDimension().getFilterCapabilities();
		selectionCapability = selectionCapabilities
				.getFilterCapabilitiesByField(field);
		oFF.QInAMdFilterCapability.exportMd(exporter, selectionCapability,
				inaStructure, field.getQueryModel());
		return inaStructure;
	};
	oFF.QInAMdField.prototype.importDependencies = function(inaStructure,
			metadata) {
		var inaDependentAttributes;
		var dependentSize;
		var i;
		var dependentAttribute;
		if (oFF.notNull(inaStructure)) {
			inaDependentAttributes = inaStructure
					.getListByKey("DependentAttributes");
			if (oFF.notNull(inaDependentAttributes)) {
				dependentSize = inaDependentAttributes.size();
				for (i = 0; i < dependentSize; i++) {
					dependentAttribute = inaDependentAttributes.getStringAt(i);
					if (oFF.notNull(dependentAttribute)) {
						metadata.addDependencyField(dependentAttribute);
					}
				}
			}
		}
	};
	oFF.QInAMdFieldsAttributes = function() {
	};
	oFF.QInAMdFieldsAttributes.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdFieldsAttributes.importMd = function(dimension, inaStructure) {
		var udh = dimension.getUniversalDisplayHierarchy();
		var inaAttributeHierarchy = oFF.isNull(udh) ? inaStructure
				.getStructureByKey("AttributeHierarchy") : inaStructure;
		var rootAttribute;
		if (oFF.notNull(inaAttributeHierarchy)) {
			rootAttribute = oFF.QInAMdFieldsAttributes
					.importMdAttributeHierarchyNode(inaAttributeHierarchy,
							dimension, udh);
			if (oFF.notNull(rootAttribute)) {
				dimension.getMetadataBase().addSupportedFieldLayoutType(
						oFF.FieldLayoutType.ATTRIBUTE_BASED);
				dimension.getAttributeContainerBase().setMainAttribute(
						rootAttribute);
			}
		}
	};
	oFF.QInAMdFieldsAttributes.importMdAttributeHierarchyNode = function(
			inaAttributeHierarchy, dimension, udh) {
		var attribute;
		var fields;
		var defaultKeyField;
		var defaultDisplayKeyField;
		var defaultTextField;
		var hierarchyKeyField;
		var hierarchyDisplayKeyField;
		var hierarchyTextField;
		var hierarchyNavigationField;
		var inaChildren;
		var childSize;
		var k;
		var childAttribute;
		if (oFF.isNull(inaAttributeHierarchy)) {
			return null;
		}
		attribute = oFF.QAttribute.createAttribute(dimension.getContext(),
				dimension);
		attribute.setName(inaAttributeHierarchy.getStringByKey("Name"));
		attribute.setText(inaAttributeHierarchy.getStringByKey("Description"));
		fields = dimension.getFields();
		defaultKeyField = fields.getByKey(inaAttributeHierarchy
				.getStringByKey("DefaultKeyAttribute"));
		if (oFF.notNull(udh)) {
			defaultKeyField = udh.getKeyField(dimension, inaAttributeHierarchy);
		}
		if (oFF.notNull(defaultKeyField)) {
			attribute.setFlatKeyField(defaultKeyField);
		}
		defaultDisplayKeyField = fields.getByKey(inaAttributeHierarchy
				.getStringByKey("DefaultDisplayKeyAttribute"));
		if (oFF.notNull(udh)) {
			defaultDisplayKeyField = udh.getDisplayKeyField(dimension);
		}
		if (oFF.notNull(defaultDisplayKeyField)) {
			attribute.setFlatDisplayKeyField(defaultDisplayKeyField);
		}
		defaultTextField = fields.getByKey(inaAttributeHierarchy
				.getStringByKey("DefaultTextAttribute"));
		if (oFF.notNull(udh)) {
			defaultTextField = udh.getTextField(dimension);
		}
		if (oFF.notNull(defaultTextField)) {
			attribute.setFlatTextField(defaultTextField);
		}
		hierarchyKeyField = fields.getByKey(inaAttributeHierarchy
				.getStringByKey("HierarchyKeyAttribute"));
		if (oFF.notNull(hierarchyKeyField)) {
			attribute.setHierachyKeyField(hierarchyKeyField);
			oFF.QInAMdFieldsAttributes.setFieldUsage(defaultKeyField,
					hierarchyKeyField);
		}
		hierarchyDisplayKeyField = fields.getByKey(inaAttributeHierarchy
				.getStringByKey("HierarchyDisplayKeyAttribute"));
		if (oFF.notNull(hierarchyDisplayKeyField)) {
			attribute.setHierarchyDisplayKeyField(hierarchyDisplayKeyField);
			oFF.QInAMdFieldsAttributes.setFieldUsage(defaultDisplayKeyField,
					hierarchyDisplayKeyField);
		}
		hierarchyTextField = fields.getByKey(inaAttributeHierarchy
				.getStringByKey("HierarchyTextAttribute"));
		if (oFF.notNull(hierarchyTextField)) {
			attribute.setHierarchyTextField(hierarchyTextField);
			oFF.QInAMdFieldsAttributes.setFieldUsage(defaultTextField,
					hierarchyTextField);
		}
		hierarchyNavigationField = fields.getByKey(inaAttributeHierarchy
				.getStringByKey("HierarchyNavigationAttribute"));
		if (oFF.notNull(hierarchyNavigationField)) {
			attribute.setHierachyNavigationField(hierarchyNavigationField);
			oFF.QInAMdFieldsAttributes.setFieldUsage(null,
					hierarchyNavigationField);
		}
		oFF.QInAMdFieldsAttributes.importAttributeFields(attribute, fields,
				inaAttributeHierarchy);
		dimension.getAttributeContainerBase().addAttributeInternal(attribute);
		inaChildren = inaAttributeHierarchy.getListByKey("Children");
		if (oFF.notNull(inaChildren)) {
			childSize = inaChildren.size();
			for (k = 0; k < childSize; k++) {
				childAttribute = oFF.QInAMdFieldsAttributes
						.importMdAttributeHierarchyNode(inaChildren
								.getStructureAt(k), dimension, udh);
				attribute.addChildAttribute(childAttribute);
			}
		}
		return attribute;
	};
	oFF.QInAMdFieldsAttributes.setFieldUsage = function(flatField,
			hierarchyField) {
		if (hierarchyField !== flatField) {
			if (oFF.notNull(flatField)) {
				flatField.getMetadataBase().setUsageType(
						oFF.FieldUsageType.FLAT);
			}
			if (oFF.notNull(hierarchyField)) {
				hierarchyField.getMetadataBase().setUsageType(
						oFF.FieldUsageType.HIERARCHY);
			}
		} else {
			if (oFF.notNull(flatField)) {
				flatField.getMetadataBase()
						.setUsageType(oFF.FieldUsageType.ALL);
			}
		}
	};
	oFF.QInAMdFieldsAttributes.importAttributeFields = function(attribute,
			fields, inaAttributeHierarchy) {
		var inaFieldNames = inaAttributeHierarchy
				.getListByKey("AttributeNames");
		var inaDefaultResultSetAttributes = inaAttributeHierarchy
				.getListByKey("DefaultResultSetAttributes");
		var size;
		var idxFieldName;
		var field;
		var duplicates;
		var fieldName;
		if (oFF.notNull(inaFieldNames)
				&& oFF.notNull(inaDefaultResultSetAttributes)) {
			size = inaFieldNames.size();
			for (idxFieldName = 0; idxFieldName < size; idxFieldName++) {
				field = fields
						.getByKey(inaFieldNames.getStringAt(idxFieldName));
				if (oFF.notNull(field)) {
					attribute.addFieldInternal(field);
				}
			}
			size = inaDefaultResultSetAttributes.size();
			duplicates = oFF.XHashSetOfString.create();
			for (idxFieldName = 0; idxFieldName < size; idxFieldName++) {
				fieldName = inaDefaultResultSetAttributes
						.getStringAt(idxFieldName);
				if (!duplicates.contains(fieldName)) {
					duplicates.add(fieldName);
					field = attribute.getFieldByName(fieldName);
					if (oFF.notNull(field)) {
						attribute.addDefaultResultSetField(field);
					}
				}
			}
		}
	};
	oFF.QInAMdFieldsAttributes.exportMd = function(inaStructure, dimension) {
		var attributeContainer = dimension.getAttributeContainer();
		var mainAttribute = attributeContainer.getMainAttribute();
		var inaAttributeHierarchy;
		if (oFF.notNull(mainAttribute)) {
			inaAttributeHierarchy = inaStructure
					.putNewStructure("AttributeHierarchy");
			oFF.QInAMdFieldsAttributes.exportMdAttribute(mainAttribute,
					inaAttributeHierarchy);
		}
		inaStructure.putString("FieldLayoutType", oFF.QInAConverter
				.lookupFieldLayoutTypeInA(dimension.getFieldLayoutType()));
	};
	oFF.QInAMdFieldsAttributes.exportMdAttribute = function(attribute,
			inaAttributeHierarchy) {
		var maKeyField;
		var maTextField;
		var childAttributes;
		var inaChildren;
		var childAttrSize;
		var i;
		inaAttributeHierarchy.putString("Name", attribute.getName());
		inaAttributeHierarchy.putString("Description", attribute.getText());
		maKeyField = attribute.getKeyField();
		oFF.QInAExportUtil.setNameIfNotNull(inaAttributeHierarchy,
				"DefaultKeyAttribute", maKeyField);
		maTextField = attribute.getTextField();
		oFF.QInAExportUtil.setNameIfNotNull(inaAttributeHierarchy,
				"DefaultTextAttribute", maTextField);
		inaAttributeHierarchy.put("AttributeNames", oFF.QInAMdFieldsAttributes
				.exportFieldNames(attribute.getFields()));
		inaAttributeHierarchy.put("DefaultResultSetAttributes",
				oFF.QInAMdFieldsAttributes.exportFieldNames(attribute
						.getResultSetFields()));
		childAttributes = attribute.getChildAttributes();
		inaChildren = inaAttributeHierarchy.putNewList("Children");
		if (oFF.notNull(childAttributes)) {
			childAttrSize = childAttributes.size();
			for (i = 0; i < childAttrSize; i++) {
				oFF.QInAMdFieldsAttributes.exportMdAttribute(childAttributes
						.get(i), inaChildren.addNewStructure());
			}
		}
	};
	oFF.QInAMdFieldsAttributes.exportFieldNames = function(fields) {
		var inaFieldNames = oFF.PrFactory.createList();
		var size = fields.size();
		var m;
		for (m = 0; m < size; m++) {
			inaFieldNames.addString(fields.get(m).getName());
		}
		return inaFieldNames;
	};
	oFF.QInAMdFieldsAttributes.prototype.getComponentType = function() {
		return null;
	};
	oFF.QInAMdFieldsAttributes.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var dimension = modelComponent;
		oFF.QInAMdFieldsAttributes.importMd(dimension, inaStructure);
		return modelComponent;
	};
	oFF.QInAMdFieldsAttributes.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		oFF.QInAMdFieldsAttributes.exportMd(inaStructure, modelComponent);
		return inaStructure;
	};
	oFF.QInAMdFieldsList = function() {
	};
	oFF.QInAMdFieldsList.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdFieldsList.importMd = function(importer, inaStructure, dimension) {
		var inaFieldList = inaStructure.getListByKey("AttributesMd");
		var len;
		var fieldIdx;
		var inaField;
		var field;
		if (oFF.isNull(inaFieldList)) {
			inaFieldList = inaStructure.getListByKey("Attributes");
		}
		if (oFF.notNull(inaFieldList)) {
			len = inaFieldList.size();
			for (fieldIdx = 0; fieldIdx < len; fieldIdx++) {
				inaField = inaFieldList.getStructureAt(fieldIdx);
				field = importer.importComponent(oFF.OlapComponentType.FIELD,
						inaField, null, dimension, dimension);
				if (oFF.notNull(field)) {
					dimension.addFieldInternal(field);
				}
			}
		}
	};
	oFF.QInAMdFieldsList.exportMd = function(exporter, inaStructure, dimension) {
		var inaList = oFF.PrFactory.createList();
		var fields = dimension.getFields();
		var len = fields.size();
		var i;
		for (i = 0; i < len; i++) {
			inaList.add(exporter.exportComponent(oFF.OlapComponentType.FIELD,
					fields.get(i), null, oFF.QImExFlag.DEFAULT_ALL));
		}
		inaStructure.put("AttributesMd", inaList);
	};
	oFF.QInAMdFieldsList.prototype.getComponentType = function() {
		return null;
	};
	oFF.QInAMdFieldsList.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var dimension = modelComponent;
		oFF.QInAMdFieldsList.importMd(importer, inaStructure, dimension);
		return modelComponent;
	};
	oFF.QInAMdFieldsList.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		oFF.QInAMdFieldsList.exportMd(exporter, inaStructure, modelComponent);
		return inaStructure;
	};
	oFF.QInAMdFieldsResultSet = function() {
	};
	oFF.QInAMdFieldsResultSet.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdFieldsResultSet.importMd = function(importer, inaStructure,
			dimension) {
		var inaDefaultResultSetFields = inaStructure
				.getListByKey("DefaultResultSetAttributesMd");
		var inaDefaultResultSetNodes;
		var fieldLayoutTypeValue;
		var fieldLayoutType;
		var resultSetFields;
		var selectorFields;
		var duplicateNames;
		var defaultFieldSize;
		var i;
		var fieldName;
		var field;
		var attributeContainer;
		var rootAttribute;
		var resultSetAttributes;
		var selectorAttributes;
		var defaultNodeSize;
		var k;
		var attribute;
		var attributeResultSetFields;
		var attributeSize;
		var m;
		var field2;
		var isFixed;
		var dimResultSetFields;
		var resultSize;
		var s;
		if (oFF.isNull(inaDefaultResultSetFields)) {
			inaDefaultResultSetFields = inaStructure
					.getListByKey("DefaultResultSetAttributes");
		}
		inaDefaultResultSetNodes = inaStructure
				.getListByKey("DefaultResultSetAttributeNodesMd");
		if (oFF.isNull(inaDefaultResultSetNodes)) {
			inaDefaultResultSetNodes = inaStructure
					.getListByKey("DefaultResultSetAttributeNodes");
		}
		fieldLayoutTypeValue = inaStructure.getStringByKey("FieldLayoutType");
		fieldLayoutType = null;
		if (oFF.notNull(fieldLayoutTypeValue)) {
			fieldLayoutType = oFF.QInAConverter
					.lookupFieldLayoutType(fieldLayoutTypeValue);
		}
		if (oFF.isNull(fieldLayoutType)) {
			if (oFF.notNull(inaDefaultResultSetNodes)
					&& dimension
							.supportsFieldLayoutType(oFF.FieldLayoutType.ATTRIBUTE_BASED)) {
				fieldLayoutType = oFF.FieldLayoutType.ATTRIBUTE_BASED;
			} else {
				fieldLayoutType = oFF.FieldLayoutType.FIELD_BASED;
			}
		}
		dimension.setFieldLayoutType(fieldLayoutType);
		dimension.getMetadataBase().setDefaultFieldLayoutType(fieldLayoutType);
		resultSetFields = dimension.getResultSetFields();
		selectorFields = dimension.getSelectorFields();
		if (oFF.notNull(inaDefaultResultSetFields)) {
			duplicateNames = oFF.XHashSetOfString.create();
			defaultFieldSize = inaDefaultResultSetFields.size();
			for (i = 0; i < defaultFieldSize; i++) {
				fieldName = inaDefaultResultSetFields.getStringAt(i);
				if (duplicateNames.contains(fieldName)) {
					continue;
				}
				duplicateNames.add(fieldName);
				field = dimension.getFieldByName(fieldName);
				if (oFF.isNull(field)) {
					importer.addError(oFF.ErrorCodes.INVALID_PARAMETER,
							fieldName);
					return;
				}
				dimension.addDefaultResultSetField(field);
				resultSetFields.addInternal(field);
				selectorFields.addInternal(field);
			}
		}
		if (oFF.notNull(inaDefaultResultSetNodes)) {
			if (dimension
					.supportsFieldLayoutType(oFF.FieldLayoutType.ATTRIBUTE_BASED)) {
				attributeContainer = dimension.getAttributeContainerBase();
				rootAttribute = attributeContainer.getMainAttribute();
				if (oFF.notNull(rootAttribute)) {
					resultSetAttributes = attributeContainer
							.getResultSetAttributes();
					selectorAttributes = attributeContainer
							.getSelectorAttributes();
					if (fieldLayoutType === oFF.FieldLayoutType.ATTRIBUTE_BASED) {
						resultSetFields.clear();
						selectorFields.clear();
					}
					defaultNodeSize = inaDefaultResultSetNodes.size();
					for (k = 0; k < defaultNodeSize; k++) {
						attribute = attributeContainer
								.getAttributeByName(inaDefaultResultSetNodes
										.getStringAt(k));
						if (oFF.notNull(attribute)) {
							attributeContainer
									.addDefaultResultSetAttribute(attribute);
							resultSetAttributes.add(attribute);
							selectorAttributes.add(attribute);
							if (fieldLayoutType === oFF.FieldLayoutType.ATTRIBUTE_BASED) {
								attributeResultSetFields = attribute
										.getResultSetFields();
								attributeSize = attributeResultSetFields.size();
								for (m = 0; m < attributeSize; m++) {
									field2 = attributeResultSetFields.get(m);
									resultSetFields.add(field2);
									selectorFields.add(field2);
								}
							}
						}
					}
				}
			}
		}
		isFixed = inaStructure.getBooleanByKeyExt("ResultSetFixedAttributes",
				false);
		dimension.setHasFixedResultSetFields(isFixed);
		resultSetFields.setIsFixed(isFixed);
		selectorFields.setIsFixed(isFixed);
		if (!inaStructure.containsKey("FieldLayoutType")) {
			if (inaStructure.containsKey("DefaultResultSetAttributes")) {
				dimension.clearDefaultResultSetFields();
			} else {
				if (!inaStructure.containsKey("ResultSetFields")) {
					if (dimension
							.supportsFieldLayoutType(oFF.FieldLayoutType.FIELD_BASED)) {
						dimension
								.setFieldLayoutType(oFF.FieldLayoutType.FIELD_BASED);
						dimension.getMetadataBase().setDefaultFieldLayoutType(
								oFF.FieldLayoutType.FIELD_BASED);
						dimension.clearDefaultResultSetFields();
						dimResultSetFields = dimension.getResultSetFields();
						resultSize = dimResultSetFields.size();
						for (s = 0; s < resultSize; s++) {
							dimension
									.addDefaultResultSetField(dimResultSetFields
											.get(s));
						}
					}
				}
			}
		}
	};
	oFF.QInAMdFieldsResultSet.exportMd = function(inaStructure, dimension) {
		var inaDefaultResultSetFields = inaStructure
				.putNewList("DefaultResultSetAttributesMd");
		var resultSetFields = dimension.getDefaultResultSetFields();
		var resultFieldSize = resultSetFields.size();
		var i;
		var attributeContainer;
		var resultSetAttributes;
		var inaDefaultResultSetNodes;
		var resultAttributeSize;
		var j;
		for (i = 0; i < resultFieldSize; i++) {
			inaDefaultResultSetFields.addString(resultSetFields.get(i)
					.getName());
		}
		if (dimension
				.supportsFieldLayoutType(oFF.FieldLayoutType.ATTRIBUTE_BASED)) {
			attributeContainer = dimension.getAttributeContainer();
			resultSetAttributes = attributeContainer
					.getDefaultResultSetAttributes();
			inaDefaultResultSetNodes = inaStructure
					.putNewList("DefaultResultSetAttributeNodesMd");
			resultAttributeSize = resultSetAttributes.size();
			for (j = 0; j < resultAttributeSize; j++) {
				inaDefaultResultSetNodes.addString(resultSetAttributes.get(j)
						.getName());
			}
		}
		inaStructure.putBoolean("ResultSetFixedAttributes", dimension
				.hasFixedResultSetFields());
	};
	oFF.QInAMdFieldsResultSet.prototype.getComponentType = function() {
		return null;
	};
	oFF.QInAMdFieldsResultSet.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var dimension = modelComponent;
		oFF.QInAMdFieldsResultSet.importMd(importer, inaStructure, dimension);
		return modelComponent;
	};
	oFF.QInAMdFieldsResultSet.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		oFF.QInAMdFieldsResultSet.exportMd(inaStructure, modelComponent);
		return inaStructure;
	};
	oFF.QInAMdFieldsRoles = function() {
	};
	oFF.QInAMdFieldsRoles.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdFieldsRoles.getFieldBySuffix = function(suffix, dimension) {
		var fields = dimension.getFields();
		var size = fields.size();
		var i;
		var field;
		var isFieldWithSuffix;
		for (i = 0; i < size; i++) {
			field = fields.get(i);
			isFieldWithSuffix = oFF.XString.endsWith(field.getName(), suffix);
			if (isFieldWithSuffix) {
				return field;
			}
		}
		return null;
	};
	oFF.QInAMdFieldsRoles.importMd = function(importer, inaStructure, dimension) {
		var inaFieldDefaults = inaStructure.getStructureByKey("FieldDefaults");
		var inaFieldRoles = oFF.isNull(inaFieldDefaults) ? inaStructure
				: inaFieldDefaults;
		var flatKeyField = dimension.getFieldByName(inaFieldRoles
				.getStringByKey("KeyAttribute"));
		var flatTextField = dimension.getFieldByName(inaFieldRoles
				.getStringByKey("TextAttribute"));
		var flatDisplayKeyField = dimension.getFieldByName(inaFieldRoles
				.getStringByKey("DisplayKeyAttribute"));
		var hierKeyField = dimension.getFieldByName(inaFieldRoles
				.getStringByKey("HierarchyKeyAttribute"));
		var hierTextField = dimension.getFieldByName(inaFieldRoles
				.getStringByKey("HierarchyTextAttribute"));
		var hierDisplayKeyField = dimension.getFieldByName(inaFieldRoles
				.getStringByKey("HierarchyDisplayKeyAttribute"));
		var hierPathField = dimension.getFieldByName(inaFieldRoles
				.getStringByKey("HierarchyPathAttribute"));
		var hierarchyNavigationField = dimension.getFieldByName(inaFieldRoles
				.getStringByKey("HierarchyNavigationAttribute"));
		var inaAttributeHierarchy;
		var blendingPropertiesField;
		var attributeContainer;
		var rootAttribute;
		var hierKey;
		var udh;
		if (oFF.isNull(hierarchyNavigationField)) {
			inaAttributeHierarchy = inaFieldRoles
					.getStructureByKey("AttributeHierarchy");
			if (oFF.notNull(inaAttributeHierarchy)) {
				hierarchyNavigationField = dimension
						.getFieldByName(inaAttributeHierarchy
								.getStringByKey("HierarchyNavigationAttribute"));
			}
		}
		if (importer.supportsSpatialChoropleth) {
			dimension.setGeoShapeField(dimension.getFieldByName(inaFieldRoles
					.getStringByKey("GeoShapeAttribute")));
			dimension.setGeoPointField(dimension.getFieldByName(inaFieldRoles
					.getStringByKey("GeoPointAttribute")));
			dimension.setGeoLevelField(dimension.getFieldByName(inaFieldRoles
					.getStringByKey("GeoLevelAttribute")));
			dimension.setGeoAreaNameField(dimension
					.getFieldByName(inaFieldRoles
							.getStringByKey("TextAttribute")));
		}
		blendingPropertiesField = null;
		if (oFF.isNull(inaFieldDefaults)) {
			if (oFF.isNull(hierPathField)) {
				hierPathField = oFF.QInAMdFieldsRoles.getFieldBySuffix(".path",
						dimension);
			}
			if (importer.supportsCubeBlendingProperties) {
				blendingPropertiesField = oFF.QInAMdFieldsRoles
						.getFieldBySuffix(".cubeBlendingProperties", dimension);
			}
			attributeContainer = dimension.getAttributeContainer();
			rootAttribute = attributeContainer.getMainAttribute();
			if (oFF.notNull(rootAttribute)) {
				flatKeyField = rootAttribute.getKeyField();
				flatDisplayKeyField = rootAttribute.getDisplayKeyField();
				flatTextField = rootAttribute.getTextField();
				if (importer.supportsHierAttHierFields) {
					hierKeyField = rootAttribute.getHierarchyKeyField();
					hierTextField = rootAttribute.getHierarchyTextField();
					hierDisplayKeyField = rootAttribute
							.getHierarchyDisplayKeyField();
				}
			}
			if (dimension.getDimensionType().isTypeOf(
					oFF.DimensionType.ABSTRACT_STRUCTURE)) {
				if (oFF.isNull(flatKeyField)) {
					flatKeyField = dimension
							.getFirstFieldByType(oFF.PresentationType.KEY);
				}
				if (oFF.isNull(flatDisplayKeyField)) {
					flatDisplayKeyField = dimension
							.getFirstFieldByType(oFF.PresentationType.DISPLAY_KEY);
				}
				if (oFF.isNull(flatTextField)) {
					flatTextField = dimension
							.getFirstFieldByType(oFF.PresentationType.TEXT);
				}
				if (oFF.isNull(hierKeyField)) {
					hierKey = dimension
							.getFirstFieldByType(oFF.PresentationType.HIERARCHY_KEY);
					if (oFF.isNull(hierKey)) {
						hierKeyField = flatKeyField;
					} else {
						hierKeyField = hierKey;
					}
				}
				if (oFF.isNull(hierTextField)) {
					hierTextField = dimension
							.getFirstFieldByType(oFF.PresentationType.HIERARCHY_TEXT);
				}
				if (oFF.isNull(hierDisplayKeyField)) {
					hierDisplayKeyField = dimension
							.getFirstFieldByType(oFF.PresentationType.HIERARCHY_DISPLAY_KEY);
				}
				if (oFF.isNull(hierTextField)) {
					hierTextField = flatTextField;
				}
				if (oFF.isNull(hierDisplayKeyField)) {
					hierDisplayKeyField = flatDisplayKeyField;
				}
			}
			udh = dimension.getUniversalDisplayHierarchy();
			if (oFF.notNull(udh)) {
				flatKeyField = udh.getKeyField(dimension, inaStructure);
				flatDisplayKeyField = udh.getDisplayKeyField(dimension);
				flatTextField = udh.getTextField(dimension);
			}
		}
		if (oFF.notNull(flatKeyField)) {
			flatKeyField.getMetadataBase().setIsFlatKeyField(true);
		}
		if (oFF.notNull(flatTextField)) {
			flatTextField.getMetadataBase().setIsFlatTextField(true);
		}
		if (oFF.notNull(hierPathField)) {
			hierPathField.getMetadataBase().setIsHierarchyPathField(true);
		}
		if (oFF.notNull(hierKeyField)) {
			hierKeyField.getMetadataBase().setIsHierarchyKeyField(true);
		}
		if (oFF.notNull(blendingPropertiesField)) {
			blendingPropertiesField.getMetadataBase()
					.setIsCubeBlendingPropertiesField(true);
		}
		if (oFF.notNull(hierarchyNavigationField)) {
			hierarchyNavigationField.getMetadataBase()
					.setIsHierarchyNavigationField(true);
		}
		dimension.setFlatKeyField(flatKeyField);
		dimension.setFlatTextField(flatTextField);
		dimension.setFlatDisplayKeyField(flatDisplayKeyField);
		dimension.setHierachyKeyField(hierKeyField);
		dimension.setHierarchyTextField(hierTextField);
		dimension.setHierarchyDisplayKeyField(hierDisplayKeyField);
		dimension.setHierarchyPathField(hierPathField);
		dimension.setHierachyNavigationField(hierarchyNavigationField);
		dimension.setCubeBlendingPropertiesField(blendingPropertiesField);
	};
	oFF.QInAMdFieldsRoles.exportMd = function(inaStructure, dimension) {
		var inaFieldDefaults = inaStructure.putNewStructure("FieldDefaults");
		oFF.QInAExportUtil.setNameIfNotNull(inaFieldDefaults, "KeyAttribute",
				dimension.getFlatKeyField());
		oFF.QInAExportUtil.setNameIfNotNull(inaFieldDefaults, "TextAttribute",
				dimension.getFlatTextField());
		oFF.QInAExportUtil.setNameIfNotNull(inaFieldDefaults,
				"DisplayKeyAttribute", dimension.getFlatDisplayKeyField());
		oFF.QInAExportUtil.setNameIfNotNull(inaFieldDefaults,
				"HierarchyKeyAttribute", dimension.getHierarchyKeyField());
		oFF.QInAExportUtil.setNameIfNotNull(inaFieldDefaults,
				"HierarchyTextAttribute", dimension.getHierarchyTextField());
		oFF.QInAExportUtil.setNameIfNotNull(inaFieldDefaults,
				"HierarchyDisplayKeyAttribute", dimension
						.getHierarchyDisplayKeyField());
		oFF.QInAExportUtil.setNameIfNotNull(inaFieldDefaults,
				"HierarchyPathAttribute", dimension.getHierarchyPathField());
		oFF.QInAExportUtil.setNameIfNotNull(inaFieldDefaults,
				"HierarchyNavigationAttribute", dimension
						.getHierarchyNavigationField());
		oFF.QInAExportUtil.setNameIfNotNull(inaFieldDefaults,
				"GeoShapeAttribute", dimension.getGeoShapeField());
		oFF.QInAExportUtil.setNameIfNotNull(inaFieldDefaults,
				"GeoPointAttribute", dimension.getGeoPointField());
		oFF.QInAExportUtil.setNameIfNotNull(inaFieldDefaults,
				"GeoLevelAttribute", dimension.getGeoLevelField());
		oFF.QInAExportUtil.setNameIfNotNull(inaFieldDefaults, "TextAttribute",
				dimension.getGeoAreaNameField());
	};
	oFF.QInAMdFieldsRoles.prototype.getComponentType = function() {
		return null;
	};
	oFF.QInAMdFieldsRoles.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		oFF.QInAMdFieldsRoles.importMd(importer, inaStructure, modelComponent);
		return modelComponent;
	};
	oFF.QInAMdFieldsRoles.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		oFF.QInAMdFieldsRoles.exportMd(inaStructure, modelComponent);
		return inaStructure;
	};
	oFF.QInAMdFilterCapability = function() {
	};
	oFF.QInAMdFilterCapability.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdFilterCapability.importMd = function(importer, inaStructure,
			field, parentContext, context) {
		var inaFilterCapability = inaStructure
				.getStructureByKey("FilterCapability");
		var inaComparisonGroup;
		var filterCapability;
		var capabilityGroup;
		var inaComparison;
		var message;
		var filterCapabilityBase;
		if (oFF.isNull(inaFilterCapability)) {
			inaComparisonGroup = inaStructure.getStringByKeyExt(
					"ComparisonGroup", null);
		} else {
			inaComparisonGroup = inaFilterCapability.getStringByKeyExt(
					"ComparisonGroup", null);
		}
		filterCapability = null;
		if (oFF.notNull(inaComparisonGroup)) {
			capabilityGroup = oFF.QFilterCapabilityGroup
					._createFilterCapabilityGroup(context, parentContext, field);
			capabilityGroup.setGroup(oFF.QInAConverter
					.lookupComparisonGroup(inaComparisonGroup));
			filterCapability = capabilityGroup;
		} else {
			if (oFF.notNull(inaFilterCapability)
					&& inaFilterCapability.hasElements()) {
				inaComparison = inaFilterCapability
						.getStructureByKey("Comparison");
				if (oFF.isNull(inaComparison)) {
					message = oFF.XStringBuffer.create();
					message
							.append("Metadata warning: No filter capability found for field ");
					if (oFF.notNull(field)) {
						message.append(field.getName());
					}
					importer.addWarning(
							oFF.ErrorCodes.IMPORT_FILTER_CAPABILITY_NOT_FOUND,
							message.toString());
				} else {
					filterCapabilityBase = oFF.QFilterCapability
							._createFilterCapability(context, parentContext,
									field);
					filterCapability = filterCapabilityBase;
					oFF.QInAMdFilterCapability.importOperators(importer,
							inaComparison, filterCapabilityBase, "Including",
							oFF.SetSign.INCLUDING);
					oFF.QInAMdFilterCapability.importOperators(importer,
							inaComparison, filterCapabilityBase, "Excluding",
							oFF.SetSign.EXCLUDING);
				}
			}
		}
		return filterCapability;
	};
	oFF.QInAMdFilterCapability.importOperators = function(importer,
			inaComparison, filterCapabilityBase, inaName, setSign) {
		var inaOperators = inaComparison.getListByKey(inaName);
		var comparisonOperators;
		var size;
		var i;
		var inaSupportedComparisonOperator;
		var comparisonOperator;
		if (!oFF.PrUtils.isListEmpty(inaOperators)) {
			filterCapabilityBase.addSupportedSetSign(setSign);
			comparisonOperators = filterCapabilityBase
					.getModifiableSupportedComparisonOperators(setSign);
			size = inaOperators.size();
			for (i = 0; i < size; i++) {
				inaSupportedComparisonOperator = inaOperators.getStringAt(i);
				if (oFF.notNull(inaSupportedComparisonOperator)) {
					comparisonOperator = oFF.QInAConverter
							.lookupComparison(inaSupportedComparisonOperator);
					if (oFF.isNull(comparisonOperator)) {
						importer
								.addWarning(
										oFF.ErrorCodes.IMPORT_FILTER_CAPABILITY_UNSUPPORTED_OPERATORS,
										oFF.XStringUtils
												.concatenate3(
														"Metadata warning: Unsupported Comparison Operator '",
														inaSupportedComparisonOperator,
														"'!"));
					} else {
						comparisonOperators.add(comparisonOperator);
					}
				}
			}
		}
	};
	oFF.QInAMdFilterCapability.updateFilterCapabilities = function(dimension) {
		var hierarchyKeyField = dimension.getHierarchyKeyField();
		var filterCapabilities;
		var filterCapabilitiesGroup;
		if (oFF.notNull(hierarchyKeyField)
				&& !hierarchyKeyField.isFlatKeyField()) {
			filterCapabilities = dimension.getFilterCapabilities()
					.getFilterCapabilitiesByField(hierarchyKeyField);
			if (oFF.notNull(filterCapabilities)
					&& filterCapabilities.isFilterCapabilityGroup()) {
				filterCapabilitiesGroup = filterCapabilities;
				filterCapabilitiesGroup
						.setGroup(oFF.QInAConverter
								.switchComparisonGroupToIncludeOnly(filterCapabilitiesGroup
										.getGroup()));
			}
		}
	};
	oFF.QInAMdFilterCapability.exportMd = function(exporter, filterCapability,
			inaParent, queryModel) {
		var inaStructure = oFF.PrFactory.createStructure();
		var capabilityGroup;
		var inaComparisonGroup;
		var isBw;
		var inaComparison;
		if (oFF.notNull(filterCapability)) {
			if (filterCapability.getComponentType().isTypeOf(
					oFF.OlapComponentType.FILTER_CAPABILITY_GROUP)) {
				capabilityGroup = filterCapability;
				inaComparisonGroup = oFF.QInAConverter
						.lookupComparisonGroupInA(capabilityGroup.getGroup());
				inaStructure.putString("ComparisonGroup", inaComparisonGroup);
			} else {
				isBw = exporter.isAbap(queryModel);
				inaComparison = inaStructure.putNewStructure("Comparison");
				oFF.QInAMdFilterCapability.exportOperators(isBw, inaComparison,
						filterCapability, "Including", oFF.SetSign.INCLUDING);
				oFF.QInAMdFilterCapability.exportOperators(isBw, inaComparison,
						filterCapability, "Excluding", oFF.SetSign.EXCLUDING);
			}
		}
		if (oFF.notNull(inaParent)) {
			inaParent.put("FilterCapability", inaStructure);
		}
		return inaStructure;
	};
	oFF.QInAMdFilterCapability.exportOperators = function(isBw, inaStructure,
			filterCapability, inaName, setSign) {
		var inaOperators;
		var comparisonOperators;
		var size;
		var i;
		var comparisonOperator;
		var comparison;
		if (filterCapability.supportsSetSign(setSign)) {
			inaOperators = inaStructure.putNewList(inaName);
			comparisonOperators = filterCapability
					.getSupportedComparisonOperators(setSign);
			size = comparisonOperators.size();
			for (i = 0; i < size; i++) {
				comparisonOperator = comparisonOperators.get(i);
				if (comparisonOperator === oFF.ComparisonOperator.NOT_BETWEEN
						&& isBw) {
					comparison = "NOTBETWEEN";
				} else {
					comparison = oFF.QInAConverter
							.lookupComparisonInA(comparisonOperator);
				}
				inaOperators.addString(comparison);
			}
		}
	};
	oFF.QInAMdFilterCapability.prototype.getComponentType = function() {
		return null;
	};
	oFF.QInAMdFilterCapability.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		return oFF.QInAMdFilterCapability.importMd(importer, inaStructure,
				parentComponent, null, context);
	};
	oFF.QInAMdFilterCapability.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		return oFF.QInAMdFilterCapability.exportMd(exporter, modelComponent,
				inaStructure, modelComponent.getQueryModel());
	};
	oFF.QInAMdGenericComponent = function() {
	};
	oFF.QInAMdGenericComponent.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdGenericComponent.prototype.getComponentType = function() {
		return oFF.OlapComponentType.OLAP;
	};
	oFF.QInAMdGenericComponent.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		return modelComponent;
	};
	oFF.QInAMdGenericComponent.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		inaStructure.putString("Name", modelComponent.getName());
		inaStructure.putString("Type", modelComponent.getComponentType()
				.getName());
		return inaStructure;
	};
	oFF.QInAMdGenericComponent.prototype.extendCustom = function(exporter,
			modelComponent, inaStructure) {
		var olapComponentType = modelComponent.getOlapComponentType();
		var ctypeValue = oFF.QInAConverter
				.lookupComponentTypeInA(olapComponentType);
		if (oFF.notNull(ctypeValue)) {
			inaStructure.putString("CType", ctypeValue);
		}
		return inaStructure;
	};
	oFF.QInAMdHierarchy = function() {
	};
	oFF.QInAMdHierarchy.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdHierarchy.importMdHierarchy = function(importer, inaStructure,
			dimension) {
		var hierarchyManagerBase = dimension.getHierarchyManagerBase();
		var supportsHierarchy = oFF.PrUtils.getBooleanValueProperty(
				inaStructure, "HierarchiesPossible", false);
		var defaultHierarchyName;
		var availableLevelHierarchies;
		var hierarchies;
		hierarchyManagerBase.setSupportsHierarchy(supportsHierarchy);
		defaultHierarchyName = oFF.PrUtils.getStringValueProperty(inaStructure,
				"DefaultHierarchy", "");
		hierarchyManagerBase.setDefaultHierarchyName(defaultHierarchyName);
		hierarchyManagerBase
				.setNumberOfHierarchies(oFF.PrUtils.getIntegerValueProperty(
						inaStructure, "NumberOfHierarchies", 0));
		if (importer.getApplication().getVersion() >= oFF.XVersion.V101_ACTIVATE_DEFAULT_HIERARCHY) {
			if (supportsHierarchy
					&& oFF.XStringUtils
							.isNotNullAndNotEmpty(defaultHierarchyName)) {
				hierarchyManagerBase.setHierarchyName(defaultHierarchyName);
				hierarchyManagerBase.setHierarchyActive(true);
			}
		}
		availableLevelHierarchies = oFF.PrUtils.getListProperty(inaStructure,
				"LevelHierarchies");
		if (hierarchyManagerBase.supportsDimensionHierarchyLevels()) {
			oFF.QInAMdHierarchy.importLevelHierarchyDetails(importer,
					dimension, availableLevelHierarchies);
		}
		if (!dimension.supportsHierarchyMetadata()) {
			return;
		}
		hierarchies = oFF.PrUtils.getListProperty(inaStructure, "Hierarchies");
		hierarchyManagerBase.setHierarchies(oFF.HierarchyCatalogResult
				.createFromDimensionMetadata(hierarchies, dimension.getName()));
		if (oFF.notNull(hierarchies)) {
			oFF.QInAMdHierarchy.importLevelHierarchyDetails(importer,
					dimension, hierarchies);
		}
	};
	oFF.QInAMdHierarchy.importLevelHierarchyDetails = function(importer,
			dimension, hierarchies) {
		var metadataModel;
		var metaHierarchies;
		var size;
		var hierIdx;
		var hier;
		if (!oFF.PrUtils.isListEmpty(hierarchies)) {
			metadataModel = dimension.getQueryModelBase().getQueryManagerBase()
					.getMetadataModelBase();
			metaHierarchies = metadataModel.getLeveledHierarchiesBase();
			size = hierarchies.size();
			for (hierIdx = 0; hierIdx < size; hierIdx++) {
				hier = oFF.QInAMdHierarchy.importLeveledHierarchy(importer,
						dimension.getContext(), dimension, hierarchies
								.getStructureAt(hierIdx));
				if (!metaHierarchies.contains(hier)) {
					metaHierarchies.add(hier);
				}
			}
		}
	};
	oFF.QInAMdHierarchy.importLeveledHierarchy = function(importer, context,
			dimension, inaHierarchy) {
		var hier = oFF.QLeveledHierarchy
				.create(context, dimension,
						inaHierarchy
								.getStringByKey(inaHierarchy
										.containsKey("Name") ? "Name"
										: "HierarchyName"));
		var hierDueDate;
		var inaLevels;
		hier.setHierarchyUniqueName(inaHierarchy.getStringByKey("UniqueName"));
		if (inaHierarchy.getStringByKey("DimensionName") === null) {
			hier.setDimensionName(dimension.getName());
		} else {
			hier.setDimensionName(inaHierarchy.getStringByKey("DimensionName"));
		}
		hier.setHierarchyType(oFF.HierarchyType.lookup(inaHierarchy
				.getStringByKey("Structure")));
		hier.setIsModeled(inaHierarchy.getBooleanByKeyExt("IsModeled", false));
		hierDueDate = inaHierarchy.getStringByKey("DueDate");
		if (oFF.XStringUtils.isNotNullAndNotEmpty(hierDueDate)) {
			hier.setDateTo(oFF.XDate.createDateFromStringWithFlag(hierDueDate,
					importer.supportsSAPDateFormat));
		}
		hier
				.setHierarchyDescription(inaHierarchy
						.getStringByKey("Description"));
		inaLevels = inaHierarchy.getListByKey("Levels");
		if (!oFF.PrUtils.isListEmpty(inaLevels)) {
			oFF.QInAMdHierarchy.importLevels(hier, inaLevels);
		}
		return hier;
	};
	oFF.QInAMdHierarchy.importLevels = function(hier, inaLevels) {
		var size = inaLevels.size();
		var levelIdx;
		var inaLevel;
		var level;
		for (levelIdx = 0; levelIdx < size; levelIdx++) {
			inaLevel = inaLevels.getStructureAt(levelIdx);
			level = oFF.QHierarchyLevel.create(hier, inaLevel
					.getStringByKey("LevelUniqueName"), inaLevel
					.getIntegerByKey("Level"));
			level.setLevelName(inaLevel.getStringByKey("LevelName"));
			level.setLevelText(inaLevel.getStringByKey("LevelCaption"));
			level.setLevelDimensionName(inaLevel
					.getStringByKey("DimensionName"));
			level.setLevelType(oFF.QInAConverter
					.lookupHierarchyLevelType(inaLevel
							.getIntegerByKey("LevelType")));
			hier.getAllLevelBase().add(level);
		}
	};
	oFF.QInAMdHierarchy.exportLevelsLevelHierarchy = function(inaHierarchy,
			hierarchyItem) {
		var inaLevels = inaHierarchy.putNewList("Levels");
		var hierarchyLevels = hierarchyItem.getAllLevel();
		var size = hierarchyLevels.size();
		var levelIdx;
		var currentLevel;
		var inaLevel;
		for (levelIdx = 0; levelIdx < size; levelIdx++) {
			currentLevel = hierarchyLevels.get(levelIdx);
			inaLevel = inaLevels.addNewStructure();
			inaLevel.putInteger("Level", currentLevel.getLevelNumber());
			inaLevel.putStringNotNull("LevelUniqueName", currentLevel
					.getLevelUniqueName());
			inaLevel.putString("LevelName", currentLevel.getLevelName());
			inaLevel.putString("LevelCaption", currentLevel.getLevelText());
			inaLevel.putStringNotNull("DimensionName", currentLevel
					.getLevelDimensionName());
			inaLevel.putInteger("LevelType", oFF.QInAConverter
					.lookupHierarchyLevelTypeIna(currentLevel.getLevelType()));
		}
	};
	oFF.QInAMdHierarchy.exportMdHierarchy = function(exporter, inaStructure,
			dimension) {
		var leveledHierarchies;
		var inaLevelHierarchies;
		var numberOfLeveledHierarchies;
		var i;
		var inaHierarchies;
		var hierarchies;
		var hierIt;
		inaStructure.putBoolean("HierarchiesPossible", dimension
				.supportsHierarchy());
		inaStructure.putInteger("NumberOfHierarchies", dimension
				.getNumberOfHierarchies());
		inaStructure.putString("DefaultHierarchy", dimension
				.getDefaultHierarchyName());
		leveledHierarchies = dimension.getLeveledHierarchies();
		if (oFF.XCollectionUtils.hasElements(leveledHierarchies)
				&& dimension.supportsDimensionHierarchyLevels()) {
			inaLevelHierarchies = inaStructure.putNewList("LevelHierarchies");
			numberOfLeveledHierarchies = leveledHierarchies.size();
			for (i = 0; i < numberOfLeveledHierarchies; i++) {
				oFF.QInAMdHierarchy.exportLevelHierarchyDetails(exporter,
						inaLevelHierarchies, leveledHierarchies.get(i));
			}
		}
		if (dimension.supportsHierarchyMetadata()) {
			inaHierarchies = inaStructure.putNewList("Hierarchies");
			hierarchies = dimension.getHierarchies();
			hierIt = hierarchies.getObjectsIterator();
			while (hierIt.hasNext()) {
				oFF.QInAMdHierarchy.exportHierarchyDetails(exporter,
						inaHierarchies, hierIt);
			}
			oFF.XObjectExt.release(hierIt);
		}
	};
	oFF.QInAMdHierarchy.exportLevelHierarchyDetails = function(exporter,
			inaHierarchies, hierarchyItem) {
		var inaHierarchy = inaHierarchies.addNewStructure();
		inaHierarchy.putString("Name", hierarchyItem.getHierarchyName());
		inaHierarchy.putString("Description", hierarchyItem
				.getHierarchyDescription());
		inaHierarchy.putString("DimensionName", hierarchyItem
				.getDimensionName());
		inaHierarchy.putString("Structure", hierarchyItem.getHierarchyType()
				.getName());
		inaHierarchy.putBoolean("IsModeled", hierarchyItem.isModeled());
		oFF.QInAExportUtil.setDate(exporter, inaHierarchy, "DueDate",
				hierarchyItem.getDateTo());
		oFF.QInAMdHierarchy.exportLevelsLevelHierarchy(inaHierarchy,
				hierarchyItem);
	};
	oFF.QInAMdHierarchy.exportHierarchyDetails = function(exporter,
			inaHierarchies, hierIt) {
		var hierarchyItem = hierIt.next();
		var inaHierarchy = inaHierarchies.addNewStructure();
		var hierarchyType;
		inaHierarchy.putString("Name", hierarchyItem.getHierarchyName());
		inaHierarchy.putString("Description", hierarchyItem
				.getHierarchyDescription());
		if (hierarchyItem.hasVersionName()) {
			inaHierarchy.putString("Version", hierarchyItem.getVersionName());
		}
		hierarchyType = hierarchyItem.getHierarchyType();
		if (hierarchyType !== oFF.HierarchyType.UNKNOWN) {
			inaHierarchy.putString("Structure", hierarchyType.getName());
		}
		inaHierarchy.putString("RestNode", hierarchyItem.getRestNode());
		inaHierarchy.putString("VirtualRootNode", hierarchyItem
				.getVirtualRootNode());
		oFF.QInAExportUtil.setDate(exporter, inaHierarchy, "DueDate",
				hierarchyItem.getDateTo());
		oFF.QInAMdHierarchy.exportLevels(inaHierarchy, hierarchyItem);
	};
	oFF.QInAMdHierarchy.exportLevels = function(inaHierarchy, hierarchyItem) {
		var inaLevels;
		var hierarchyLevels;
		var size;
		var levelIdx;
		var currentLevel;
		var inaLevel;
		if (hierarchyItem.supportsHierarchyLevels()) {
			inaLevels = inaHierarchy.putNewList("Levels");
			hierarchyLevels = hierarchyItem.getHierarchyLevels();
			size = hierarchyLevels.size();
			for (levelIdx = 0; levelIdx < size; levelIdx++) {
				currentLevel = hierarchyLevels.get(levelIdx);
				inaLevel = inaLevels.addNewStructure();
				inaLevel.putString("LevelUniqueName", currentLevel
						.getLevelUniqueName());
				inaLevel.putInteger("Level", currentLevel.getLevel());
				inaLevel.putString("LevelName", currentLevel.getLevelName());
				inaLevel.putString("LevelCaption", currentLevel
						.getLevelDescription());
				inaLevel.putStringNotNull("DimensionName", currentLevel
						.getLevelDimensionName());
				inaLevel.putInteger("LevelType", oFF.QInAConverter
						.lookupHierarchyLevelTypeIna(currentLevel
								.getLevelType()));
			}
		}
	};
	oFF.QInAMdHierarchy.prototype.getComponentType = function() {
		return null;
	};
	oFF.QInAMdHierarchy.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		oFF.QInAMdHierarchy.importMdHierarchy(importer, inaStructure,
				modelComponent);
		return modelComponent;
	};
	oFF.QInAMdHierarchy.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		oFF.QInAMdHierarchy.exportMdHierarchy(exporter, inaStructure,
				modelComponent);
		return inaStructure;
	};
	oFF.QInAMdQuery = function() {
	};
	oFF.QInAMdQuery.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdQuery.importVariants = function(inaStructure, queryModel) {
		var queryManager;
		var inaVariants;
		var size;
		var idx;
		var inaVariant;
		var variant;
		if (oFF.isNull(inaStructure)) {
			return;
		}
		queryManager = queryModel.getQueryManagerBase();
		if (oFF.isNull(queryManager)) {
			return;
		}
		inaVariants = inaStructure.getListByKey("VariableVariants");
		if (oFF.isNull(inaVariants)) {
			return;
		}
		size = inaVariants.size();
		for (idx = 0; idx < size; idx++) {
			inaVariant = inaVariants.getStructureAt(idx);
			variant = oFF.QVariableVariant.createVariantWithTypeAndScope(
					inaVariant.getStringByKey("Name"), inaVariant
							.getStringByKey("Description"),
					oFF.VariableVariantType.lookupByName(inaVariant
							.getStringByKey("Type")), oFF.Scope
							.lookupByName(inaVariant.getStringByKey("Scope")));
			queryManager.addVariableVariant(variant);
		}
	};
	oFF.QInAMdQuery.exportVariants = function(inaStructure, queryModel) {
		var variants = queryModel.getQueryManager().getVariableVariants();
		var inaVariants;
		var size;
		var idx;
		var variant;
		var inaVariant;
		if (oFF.notNull(variants)) {
			inaVariants = inaStructure.putNewList("VariableVariants");
			size = variants.size();
			for (idx = 0; idx < size; idx++) {
				variant = variants.get(idx);
				inaVariant = inaVariants.addNewStructure();
				inaVariant.putString("Name", variant.getName());
				inaVariant.putString("Description", variant.getText());
				inaVariant.putString("Type", variant.getVariableVariantType()
						.getName());
				inaVariant.putString("Scope", variant.getScope().getName());
			}
		}
	};
	oFF.QInAMdQuery.importPlanning = function(inaStructure, queryModel) {
		if (oFF.PrUtils.getBooleanValueProperty(inaStructure,
				"SupportsDataEntryReadOnly", false)) {
			queryModel.setSupportsDataEntryReadOnly(true);
		}
		if (oFF.PrUtils.getBooleanValueProperty(inaStructure,
				"DataEntryEnabled", false)) {
			queryModel.setDataEntryEnabled(true);
		}
	};
	oFF.QInAMdQuery.exportPlanning = function(inaStructure, queryModel) {
		if (queryModel.supportsDataEntryReadOnly()) {
			inaStructure.putBoolean("SupportsDataEntryReadOnly", true);
		}
		if (queryModel.isDataEntryEnabled()) {
			inaStructure.putBoolean("DataEntryEnabled", true);
		}
	};
	oFF.QInAMdQuery.importSupportsFlags = function(importer, inaStructure,
			queryModel) {
		var capabilities;
		var capabilityContainer;
		queryModel.setExportEachMeasure(inaStructure.getBooleanByKeyExt(
				"ExportingEachMeasure", true));
		queryModel.setExportFixedFilter(inaStructure.getBooleanByKeyExt(
				"ExportingFixedFilter", true));
		queryModel.setExportVariables(inaStructure.getBooleanByKeyExt(
				"ExportingVariables", true));
		capabilities = queryModel.getModelCapabilitiesBase();
		capabilityContainer = queryModel.getQueryManager()
				.getMainCapabilities();
		capabilityContainer.remove(oFF.InACapabilities.QUERY_DATA_CELLS);
		capabilityContainer.remove(oFF.InACapabilities.CONDITIONS);
		capabilityContainer.remove(oFF.InACapabilities.EXTENDED_SORT);
		capabilityContainer
				.remove(oFF.InACapabilities.EXCEPTION_AGGREGATION_DIMENSIONS_AND_FORMULAS);
		if (inaStructure.getBooleanByKeyExt("SupportsDataCells",
				importer.supportsDataCells)) {
			capabilityContainer
					.addCapability(oFF.InACapabilities.QUERY_DATA_CELLS);
		}
		if (inaStructure.getBooleanByKeyExt("SupportsConditions",
				importer.supportsConditions)) {
			capabilityContainer.addCapability(oFF.InACapabilities.CONDITIONS);
		}
		if (inaStructure.getBooleanByKeyExt("SupportsExtendedSort",
				importer.supportsExtendedSort)) {
			capabilityContainer
					.addCapability(oFF.InACapabilities.EXTENDED_SORT);
		}
		if (inaStructure.getBooleanByKeyExt(
				"ExceptionAggregationDimsAndFormulas",
				importer.supportsExceptionAggregationDimsFormulas)) {
			capabilityContainer
					.addCapability(oFF.InACapabilities.EXCEPTION_AGGREGATION_DIMENSIONS_AND_FORMULAS);
		}
		capabilities.setSupportsResultsetFacets(inaStructure
				.getBooleanByKeyExt("SupportsResultsetFacets", false));
		importer.supportsDataCells = queryModel
				.supportsAnalyticCapabilityActive(oFF.InACapabilities.QUERY_DATA_CELLS);
		importer.supportsConditions = queryModel
				.supportsAnalyticCapabilityActive(oFF.InACapabilities.CONDITIONS);
		importer.supportsExtendedSort = queryModel
				.supportsAnalyticCapabilityActive(oFF.InACapabilities.EXTENDED_SORT);
		importer.supportsExceptionAggregationDimsFormulas = queryModel
				.supportsAnalyticCapabilityActive(oFF.InACapabilities.EXCEPTION_AGGREGATION_DIMENSIONS_AND_FORMULAS);
	};
	oFF.QInAMdQuery.exportSupportsFlags = function(exporter, inaStructure,
			queryModel) {
		inaStructure.putBoolean("SupportsConditions", queryModel
				.supportsConditions());
		inaStructure.putBoolean("SupportsDataCells", queryModel
				.supportsDataCells());
		inaStructure.putBoolean("SupportsExtendedSort", queryModel
				.supportsExtendedSort());
		inaStructure.putBoolean("ExceptionAggregationDimsAndFormulas",
				queryModel.supportsExceptionAggregationDimsFormulas());
		inaStructure.putBoolean("SupportsResultsetFacets", queryModel
				.supportsResultsetFacets());
		if (!queryModel.isExportingEachMeasure()) {
			inaStructure.putBoolean("ExportingEachMeasure", false);
		}
		if (!queryModel.isExportingFixedFilter()) {
			inaStructure.putBoolean("ExportingFixedFilter", false);
		}
		if (!queryModel.isExportingVariables()) {
			inaStructure.putBoolean("ExportingVariables", false);
		}
	};
	oFF.QInAMdQuery.importTotals = function(inaStructure, queryModel) {
		var capabilities = queryModel.getModelCapabilitiesBase();
		var inaQuery = inaStructure.getStructureByKey("QueryMd");
		var currencyTranslationEnabledInA;
		var inaResultStructureFeature;
		var rc;
		var inaResultAlignment;
		var inaResultAlignmentConfigLevel;
		var supportedAlignmentLocation;
		var inaResultAlignments;
		var alignmentSize;
		var idxAlignment;
		var alignment;
		var inaReordering;
		var conditionalResultsSupported;
		var inaConditionalTotals;
		var conditionSize;
		var idxCondition;
		var inaConditionalTotalResult;
		if (oFF.isNull(inaQuery)) {
			inaQuery = inaStructure.getStructureByKey("Query");
		}
		if (oFF.notNull(inaQuery)) {
			if (queryModel.supportsQueryCurrencyTranslation()) {
				currencyTranslationEnabledInA = inaQuery
						.getStringByKey("CurrencyTranslationEnabled");
				queryModel.getMetadataPropertiesBase().putString(
						"CurrencyTranslationEnabled",
						currencyTranslationEnabledInA);
				if (oFF.XString.isEqual(currencyTranslationEnabledInA,
						"NoCurrency")) {
					queryModel.setCurrencyTranslationDetails(null);
				}
			}
			inaResultStructureFeature = inaQuery
					.getStructureByKey("ResultStructureFeature");
			rc = queryModel.getMdResultStructureControllerBase();
			if (oFF.notNull(inaResultStructureFeature)
					&& inaResultStructureFeature.getBooleanByKeyExt("Enabled",
							false)) {
				oFF.QInAMdQuery
						.importReturnedDataSelections(
								inaResultStructureFeature, queryModel
										.getQueryManager());
				rc.setSupportsTotals(true);
				inaResultAlignment = inaResultStructureFeature
						.getStructureByKey("ResultAlignment");
				inaResultAlignmentConfigLevel = inaResultAlignment
						.getStringByKey("ConfigLevel");
				supportedAlignmentLocation = oFF.QInAConverter
						.lookupConfigLevel(inaResultAlignmentConfigLevel);
				capabilities
						.setSupportedResultAlignmentLevel(supportedAlignmentLocation);
				inaResultAlignments = inaResultAlignment
						.getListByKey("ResultAlignmentList");
				capabilities.clearSupportedResultAlignment();
				alignmentSize = inaResultAlignments.size();
				for (idxAlignment = 0; idxAlignment < alignmentSize; idxAlignment++) {
					alignment = oFF.QInAConverter
							.lookupAlignment(inaResultAlignments
									.getStringAt(idxAlignment));
					capabilities.addSupportedResultAlignment(alignment);
				}
				if (queryModel.getResultStructureReorderingCapability() === oFF.ReorderingCapability.FULL) {
					capabilities
							.addSupportedResultAlignment(oFF.ResultAlignment.STRUCTURE);
				}
				capabilities
						.setSupportedVisibilityLocation(oFF.QModelLevel.DIMENSIONS);
				capabilities
						.setSupportsConditionalResultVisibility(inaResultStructureFeature
								.getBooleanByKeyExt("ConditionalVisibility",
										false));
				inaReordering = inaResultStructureFeature.getStringByKeyExt(
						"Reordering", "None");
				capabilities
						.setResultStructureReorderingCapability(oFF.QInAConverter
								.lookupReordering(inaReordering));
				conditionalResultsSupported = inaResultStructureFeature
						.getBooleanByKeyExt("ConditionalTotals", false);
				capabilities
						.setSupportsConditionalResult(conditionalResultsSupported);
				if (conditionalResultsSupported) {
					inaConditionalTotals = inaResultStructureFeature
							.getListByKey("ConditionalTotalsList");
					conditionSize = inaConditionalTotals.size();
					for (idxCondition = 0; idxCondition < conditionSize; idxCondition++) {
						inaConditionalTotalResult = inaConditionalTotals
								.getStringAt(idxCondition);
						if (oFF.XString.isEqual(inaConditionalTotalResult,
								"TotalIncludedMembers")) {
							capabilities
									.addSupportedConditionalElement(oFF.ResultStructureElement.TOTAL_INCLUDED_MEMBERS);
						} else {
							if (oFF.XString.isEqual(inaConditionalTotalResult,
									"TotalRemainingMembers")) {
								capabilities
										.addSupportedConditionalElement(oFF.ResultStructureElement.TOTAL_REMAINING_MEMBERS);
							}
						}
					}
				}
			} else {
				rc.setSupportsTotals(false);
				capabilities
						.setSupportedResultAlignmentLevel(oFF.QModelLevel.NONE);
				capabilities
						.setSupportedVisibilityLocation(oFF.QModelLevel.NONE);
				capabilities.setSupportsConditionalResultVisibility(false);
				capabilities
						.setResultStructureReorderingCapability(oFF.ReorderingCapability.NONE);
				capabilities.setSupportsConditionalResult(false);
			}
		}
	};
	oFF.QInAMdQuery.importReturnedDataSelections = function(
			inaResultStructureFeature, queryManager) {
		var inaReturnedDataSelection;
		var inaElementNames;
		var size;
		var i;
		var dataSelection;
		if (oFF.isNull(queryManager)
				|| !queryManager.supportsReturnedDataSelection()) {
			return;
		}
		inaReturnedDataSelection = inaResultStructureFeature
				.getStructureByKey("ReturnedDataSelection");
		if (oFF.isNull(inaReturnedDataSelection)
				|| !inaReturnedDataSelection.hasElements()) {
			return;
		}
		inaElementNames = inaReturnedDataSelection
				.getKeysAsReadOnlyListOfString();
		size = inaElementNames.size();
		queryManager.clearDataSelections();
		for (i = 0; i < size; i++) {
			dataSelection = oFF.ReturnedDataSelection
					.lookupOrCreate(inaElementNames.get(i));
			if (oFF.isNull(dataSelection)) {
				continue;
			}
			if (dataSelection === oFF.ReturnedDataSelection.TUPLE_ELEMENT_IDS) {
				queryManager.enableReturnedDataSelection(dataSelection);
				continue;
			}
			if (inaReturnedDataSelection.getBooleanByKey(dataSelection
					.getName())) {
				queryManager.enableReturnedDataSelection(dataSelection);
			} else {
				queryManager.disableReturnedDataSelection(dataSelection);
			}
		}
	};
	oFF.QInAMdQuery.exportReturnedDataSelections = function(
			inaResultStructureFeature, queryManager) {
		var inaReturnedDataSelection;
		var itActive;
		var itInactive;
		if (!queryManager.supportsReturnedDataSelection()) {
			return;
		}
		inaReturnedDataSelection = inaResultStructureFeature
				.putNewStructure("ReturnedDataSelection");
		itActive = queryManager.getAllEnabledReturnedDataSelections()
				.getIterator();
		while (itActive.hasNext()) {
			inaReturnedDataSelection.putBoolean(itActive.next(), true);
		}
		oFF.XObjectExt.release(itActive);
		itInactive = queryManager.getAllDisabledReturnedDataSelections()
				.getIterator();
		while (itInactive.hasNext()) {
			inaReturnedDataSelection.putBoolean(itInactive.next(), false);
		}
		oFF.XObjectExt.release(itInactive);
	};
	oFF.QInAMdQuery.exportTotals = function(exporter, inaStructure, queryModel) {
		var inaQuery = inaStructure.putNewStructure("QueryMd");
		var inaResultStructureFeature;
		var inaResultAlignment;
		var supportedAlignmentLocation;
		var supportedResultAlignments;
		var inaResultAlignments;
		var alignmentSize;
		var iResultAlignment;
		var supportsConditionalResults;
		var inaConditionalTotals;
		var supportedConditionalResults;
		var conditionSize;
		var iSupportedConditionResults;
		var rse;
		if (exporter.mode.containsMetadata()
				|| exporter.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)
				|| exporter.mode === oFF.QModelFormat.INA_METADATA_CORE) {
			if (queryModel.supportsQueryCurrencyTranslation()) {
				inaQuery.putString("CurrencyTranslationEnabled", queryModel
						.getCurrencyTranslationEnabledType());
			}
			if (queryModel.supportsResultVisibility()) {
				inaResultStructureFeature = inaQuery
						.putNewStructure("ResultStructureFeature");
				inaResultStructureFeature.putBoolean("Enabled", queryModel
						.supportsResultVisibility());
				inaResultStructureFeature.putBoolean("ConditionalVisibility",
						queryModel.supportsConditionalResultVisibility());
				inaResultStructureFeature.putString("Reordering",
						oFF.QInAConverter.lookupReorderingInA(queryModel
								.getResultStructureReorderingCapability()));
				inaResultAlignment = inaResultStructureFeature
						.putNewStructure("ResultAlignment");
				supportedAlignmentLocation = queryModel
						.getSupportedResultAlignmentLevel();
				inaResultAlignment.putString("ConfigLevel", oFF.QInAConverter
						.lookupConfigLevelInA(supportedAlignmentLocation));
				supportedResultAlignments = queryModel
						.getSupportedResultAlignments();
				if (supportedResultAlignments.hasElements()) {
					inaResultAlignments = inaResultAlignment
							.putNewList("ResultAlignmentList");
					alignmentSize = supportedResultAlignments.size();
					for (iResultAlignment = 0; iResultAlignment < alignmentSize; iResultAlignment++) {
						inaResultAlignments.addString(oFF.QInAConverter
								.lookupAlignmentInA(supportedResultAlignments
										.get(iResultAlignment)));
					}
				}
				supportsConditionalResults = queryModel
						.supportsConditionalResults();
				inaResultStructureFeature.putBoolean("ConditionalTotals",
						supportsConditionalResults);
				if (supportsConditionalResults) {
					inaConditionalTotals = inaResultStructureFeature
							.putNewList("ConditionalTotalsList");
					supportedConditionalResults = queryModel
							.getSupportedConditionalResults();
					conditionSize = supportedConditionalResults.size();
					for (iSupportedConditionResults = 0; iSupportedConditionResults < conditionSize; iSupportedConditionResults++) {
						rse = supportedConditionalResults
								.get(iSupportedConditionResults);
						if (rse === oFF.ResultStructureElement.TOTAL_INCLUDED_MEMBERS) {
							inaConditionalTotals
									.addString("TotalIncludedMembers");
						} else {
							if (rse === oFF.ResultStructureElement.TOTAL_REMAINING_MEMBERS) {
								inaConditionalTotals
										.addString("TotalRemainingMembers");
							}
						}
					}
				}
				oFF.QInAMdQuery
						.exportReturnedDataSelections(
								inaResultStructureFeature, queryModel
										.getQueryManager());
			}
		}
	};
	oFF.QInAMdQuery.importDimensions = function(importer, inaStructure,
			queryModel) {
		var inaDimensions = inaStructure.getListByKey("Dimensions");
		var supportsLazyLoading;
		var len;
		var i;
		var inaDimension;
		var isReference;
		var axisDefault;
		var dimType;
		if (oFF.notNull(inaDimensions)) {
			supportsLazyLoading = queryModel.supportsDimensionLazyLoad()
					&& queryModel.getServerBaseSerialization() !== null;
			len = inaDimensions.size();
			for (i = 0; i < len; i++) {
				inaDimension = inaDimensions.getStructureAt(i);
				isReference = inaDimension.getBooleanByKeyExt("IsReference",
						false);
				if (supportsLazyLoading
						&& (isReference || importer.getOriginalMode() !== oFF.QModelFormat.INA_CLONE)) {
					axisDefault = oFF.AxisType.lookup(inaDimension
							.getStringByKey("AxisDefault"));
					if (axisDefault !== oFF.AxisType.COLUMNS
							&& axisDefault !== oFF.AxisType.ROWS
							&& queryModel
									.getDimensionByNameFromExistingMetadata(inaDimension
											.getStringByKey("Name")) === null) {
						dimType = oFF.QInAMdQuery.getDimensionType(queryModel,
								inaDimension);
						queryModel.addDimensionReference(inaDimension
								.getStringByKey("Name"), dimType);
						continue;
					}
				}
				oFF.QInAMdQuery.importDimension(importer, inaDimension,
						queryModel);
			}
		}
	};
	oFF.QInAMdQuery.getDimensionType = function(queryModel, inaDimension) {
		var inaDimType = inaDimension.getIntegerByKeyExt("DimensionType", 3);
		var dimType = oFF.QInAConverter.lookupDimensionType(inaDimType);
		if (inaDimType === 0
				&& queryModel.supportsExpandQueryAndDetailedResponse()) {
			dimType = oFF.DimensionType.DIMENSION_INCOMPLETE;
		}
		return dimType;
	};
	oFF.QInAMdQuery.importDimension = function(importer, inaDimension,
			queryModel) {
		var dimension = importer.importDimension(inaDimension, queryModel);
		var dimensionExisting = queryModel
				.getDimensionByNameInternal(inaDimension.getStringByKey("Name"));
		var settings;
		var defaultAxis;
		var dimensionManagerBase;
		if (oFF.isNull(dimensionExisting)) {
			queryModel.addDimension(dimension);
		} else {
			if (queryModel.getQueryManagerBase()
					.getPreviousVariableProcessorState() === oFF.VariableProcessorState.PROCESSING_EMPTY_VARIABLE_DEFINITION) {
				settings = oFF.InAQMgrMergeSettings.create(false);
				dimensionExisting.mergeDeepRecursive(settings, dimension);
				oFF.XObjectExt.release(dimension);
				dimension = dimensionExisting;
			} else {
				dimensionExisting.setText(dimension.getText());
				dimension = dimensionExisting;
			}
		}
		defaultAxis = queryModel.getAxis(dimension.getDefaultAxisType());
		defaultAxis.add(dimension);
		dimensionManagerBase = queryModel.getDimensionManagerBase();
		dimensionManagerBase.finalizeDimensionMetadataSetup(dimension);
	};
	oFF.QInAMdQuery.exportDimensions = function(exporter, queryModel,
			inaStructure) {
		var inaDimensions = oFF.PrFactory.createList();
		var dimNames;
		var len;
		var optimizedExportModeActive;
		var i;
		var dimName;
		var dimension;
		var dimStruct;
		if (exporter.getOriginalMode() === oFF.QModelFormat.INA_METADATA) {
			queryModel.getDimensions();
		}
		dimNames = oFF.XListOfString.createFromReadOnlyList(queryModel
				.getDimensionNames());
		dimNames.sortByDirection(oFF.XSortDirection.ASCENDING);
		len = dimNames.size();
		optimizedExportModeActive = queryModel.isOptimizedExportModeActive();
		for (i = 0; i < len; i++) {
			dimName = dimNames.get(i);
			dimension = queryModel.getDimensionByNameInternal(dimName);
			if (oFF.isNull(dimension)) {
				if (exporter.getOriginalMode().isTypeOf(
						oFF.QModelFormat.INA_CLONE)) {
					dimStruct = oFF.PrFactory.createStructure();
					dimStruct.putString("Name", dimName);
					dimStruct.putBoolean("IsReference", true);
				} else {
					continue;
				}
			} else {
				if (optimizedExportModeActive
						&& dimension.isIgnoredOnOptimizedExport()) {
					continue;
				}
				if (dimension.getDimensionType() === oFF.DimensionType.CALCULATED_DIMENSION) {
					continue;
				}
				dimStruct = exporter.exportDimension(dimension, null);
			}
			inaDimensions.add(dimStruct);
		}
		inaStructure.put("Dimensions", inaDimensions);
	};
	oFF.QInAMdQuery.importProperties = function(inaStructure, queryModel) {
		var description = inaStructure.getStringByKey("Description");
		var metadataPropertiesBase;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(description)) {
			queryModel.setText(inaStructure.getStringByKey("Description"));
		}
		metadataPropertiesBase = queryModel.getMetadataPropertiesBase();
		metadataPropertiesBase.putString("Type", inaStructure
				.getStringByKey("Type"));
		if (inaStructure.hasStringByKey("LastDataUpdateOn")) {
			metadataPropertiesBase.putString("LastDataUpdateOn", inaStructure
					.getStringByKey("LastDataUpdateOn"));
		} else {
			metadataPropertiesBase.putString("LastDataUpdate", inaStructure
					.getStringByKey("LastDataUpdate"));
		}
		metadataPropertiesBase.putString("LastDataUpdateBy", inaStructure
				.getStringByKey("LastDataUpdateBy"));
		metadataPropertiesBase.putString("CreatedBy", inaStructure
				.getStringByKey("CreatedBy"));
		metadataPropertiesBase.putString("CreatedOn", inaStructure
				.getStringByKey("CreatedOn"));
		metadataPropertiesBase.putString("RepositoryType", inaStructure
				.getStringByKey("RepositoryType"));
		metadataPropertiesBase.putString("DueDate", inaStructure
				.getStringByKey("DueDate"));
	};
	oFF.QInAMdQuery.exportProperties = function(inaStructure, queryModel) {
		var metadataProperties;
		var lastUpdate;
		var infoProvider;
		inaStructure.putString("Description", queryModel.getText());
		metadataProperties = queryModel.getMetadataProperties();
		inaStructure.putString("Type", metadataProperties
				.getStringByKey("Type"));
		lastUpdate = metadataProperties.getStringByKey("LastDataUpdateOn");
		if (oFF.isNull(lastUpdate)) {
			inaStructure.putString("LastDataUpdate", metadataProperties
					.getStringByKey("LastDataUpdate"));
		} else {
			inaStructure.putString("LastDataUpdateOn", lastUpdate);
		}
		inaStructure.putString("LastDataUpdateBy", metadataProperties
				.getStringByKey("LastDataUpdateBy"));
		inaStructure.putString("RepositoryType", metadataProperties
				.getStringByKey("RepositoryType"));
		inaStructure.putString("CreatedBy", metadataProperties
				.getStringByKey("CreatedBy"));
		inaStructure.putString("CreatedOn", metadataProperties
				.getStringByKey("CreatedOn"));
		inaStructure.putString("DueDate", metadataProperties
				.getStringByKey("DueDate"));
		infoProvider = queryModel.getInfoProvider();
		oFF.QInAExportUtil.setNameIfNotNull(inaStructure, "BaseDataSource",
				infoProvider);
	};
	oFF.QInAMdQuery.prototype.getComponentType = function() {
		return oFF.OlapComponentType.QUERY_MODEL;
	};
	oFF.QInAMdQuery.prototype.newModelComponent = function(application,
			parentComponent, context) {
		return oFF.QueryModel.create(application, null, oFF.QCapabilities
				.create());
	};
	oFF.QInAMdQuery.prototype.importComponentWithStructure = function(importer,
			inaStructure, modelComponent, parentComponent, context) {
		var queryModel = modelComponent;
		var importerMode;
		oFF.QInAMdDataSource.importMd(importer, inaStructure, queryModel,
				queryModel);
		importerMode = importer.getMode();
		if (importerMode === oFF.QModelFormat.INA_METADATA
				|| importerMode === oFF.QModelFormat.INA_METADATA_CORE) {
			queryModel.setServerBaseSerialization(inaStructure);
		}
		if (oFF.notNull(inaStructure)) {
			oFF.QInAMdQuery.importSupportsFlags(importer, inaStructure,
					queryModel);
			oFF.QInAMdQuery.importProperties(inaStructure, queryModel);
			oFF.QInAMdQuery.importTotals(inaStructure, queryModel);
			oFF.QInAMdQuery
					.importDimensions(importer, inaStructure, queryModel);
		}
		importer.importSortingManager(inaStructure, queryModel
				.getSortingManagerBase(), null);
		importer.importVariableContainer(inaStructure, queryModel
				.getVariableManagerBase(), queryModel);
		importer.importDrillManager(inaStructure, queryModel
				.getDrillManagerBase(), queryModel);
		importer.importExceptionAggregationManager(inaStructure, queryModel
				._getExceptionAggregationManagerBase(), queryModel);
		importer.importUniversalDisplayHierarchies(inaStructure, queryModel
				.getUniversalDisplayHierarchiesBase(), queryModel);
		oFF.QInAMdQuery.importPlanning(inaStructure, queryModel);
		oFF.QInAMdQuery.importVariants(inaStructure, queryModel);
		return queryModel;
	};
	oFF.QInAMdQuery.prototype.exportComponentWithStructure = function(exporter,
			modelComponent, inaStructure, flags) {
		var queryModel = modelComponent;
		oFF.QInAMdQuery.exportSupportsFlags(exporter, inaStructure, queryModel);
		if (flags === oFF.QImExFlag.DEFAULT_ALL) {
			oFF.QInAMdDataSource.exportMd(exporter, inaStructure, queryModel);
			exporter.exportVariableContainer(queryModel.getVariableManager(),
					inaStructure);
			oFF.QInAMdQuery.exportVariants(inaStructure, queryModel);
		} else {
			if (flags === oFF.QImExFlag.VARIABLES) {
				exporter.exportVariableContainer(queryModel
						.getVariableManager(), inaStructure);
				oFF.QInAMdQuery.exportVariants(inaStructure, queryModel);
			} else {
				if (flags === oFF.QImExFlag.DATASOURCE) {
					oFF.QInAMdDataSource.exportMd(exporter, inaStructure,
							queryModel);
				}
			}
		}
		oFF.QInAMdQuery.exportProperties(inaStructure, queryModel);
		oFF.QInAMdQuery.exportTotals(exporter, inaStructure, queryModel);
		oFF.QInAMdQuery.exportDimensions(exporter, queryModel, inaStructure);
		exporter.exportSortingManager(queryModel.getSortingManager(),
				inaStructure);
		exporter.exportDrillManager(queryModel.getDrillManager(), inaStructure);
		exporter.exportExceptionAggregationManager(queryModel
				._getExceptionAggregationManagerBase(), inaStructure);
		exporter.exportUniversalDisplayHierarchies(queryModel
				.getUniversalDisplayHierarchies(), inaStructure);
		oFF.QInAMdQuery.exportPlanning(inaStructure, queryModel);
		return inaStructure;
	};
	oFF.QInAMdSort = function() {
	};
	oFF.QInAMdSort.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdSort.prototype.getComponentType = function() {
		return oFF.OlapComponentType.SORT_MANAGER;
	};
	oFF.QInAMdSort.prototype.importComponentWithStructure = function(importer,
			inaStructure, modelComponent, parentComponent, context) {
		var sortingManager = modelComponent;
		var sortTypes;
		var sortSize;
		var i;
		var inaSortType;
		var sortType;
		var breakingGroups;
		var breakingSize;
		var j;
		var sortType2;
		if (importer.supportsExtendedSort && oFF.notNull(inaStructure)) {
			sortTypes = inaStructure.getListByKey("ExtendedSortTypes");
			if (oFF.notNull(sortTypes)) {
				sortingManager.clearSupportedSortType();
				sortSize = sortTypes.size();
				for (i = 0; i < sortSize; i++) {
					inaSortType = sortTypes.getStringAt(i);
					sortType = oFF.QInAConverter.lookupSortType(inaSortType);
					if (oFF.isNull(sortType)) {
						importer.addWarning(oFF.ErrorCodes.INVALID_PARAMETER,
								oFF.XStringUtils.concatenate2(
										"Sort type unknown: ", inaSortType));
					} else {
						sortingManager.addSupportedSortType(sortType);
					}
				}
			}
			breakingGroups = inaStructure
					.getListByKey("SortTypesBreakGrouping");
			if (oFF.notNull(breakingGroups)) {
				breakingSize = breakingGroups.size();
				for (j = 0; j < breakingSize; j++) {
					sortType2 = oFF.QInAConverter.lookupSortType(breakingGroups
							.getStringAt(j));
					sortingManager.addSupportedBreakGrouping(sortType2);
				}
			}
		}
		return sortingManager;
	};
	oFF.QInAMdSort.prototype.exportComponentWithStructure = function(exporter,
			modelComponent, inaStructure, flags) {
		var sortManager = modelComponent;
		var inaSortTypes;
		var allSortTypes;
		var allSize;
		var i;
		var sortType;
		var inaBreakingGroups;
		var j;
		var sortType2;
		if (exporter.supportsExtendedSort) {
			inaSortTypes = inaStructure.putNewList("ExtendedSortTypes");
			allSortTypes = oFF.SortType.getAllSortTypes();
			allSize = allSortTypes.size();
			for (i = 0; i < allSize; i++) {
				sortType = allSortTypes.get(i);
				if (sortManager.supportsSortType(sortType)) {
					inaSortTypes.addString(oFF.QInAConverter
							.lookupSortTypeInA(sortType));
				}
			}
			inaBreakingGroups = inaStructure
					.putNewList("SortTypesBreakGrouping");
			for (j = 0; j < allSize; j++) {
				sortType2 = allSortTypes.get(j);
				if (sortManager.supportsBreakGrouping(sortType2)) {
					inaBreakingGroups.addString(oFF.QInAConverter
							.lookupSortTypeInA(sortType2));
				}
			}
		}
		return inaStructure;
	};
	oFF.QInAMdUniversalDisplayHierarchies = function() {
	};
	oFF.QInAMdUniversalDisplayHierarchies.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdUniversalDisplayHierarchies.importUdhDimension = function(
			importer, queryModel, name) {
		var inaDimension;
		var axisConstraints;
		if (!queryModel.getDimensionNames().contains(name)) {
			inaDimension = oFF.PrFactory.createStructure();
			inaDimension.putString("Name", name);
			inaDimension.putString("AxisDefault", "Virtual");
			axisConstraints = inaDimension.putNewList("AxisConstraints");
			axisConstraints.addString("Virtual");
			oFF.QInAMdQuery.importDimension(importer, inaDimension, queryModel);
		}
	};
	oFF.QInAMdUniversalDisplayHierarchies.importHierarchy = function(
			universalDisplayHierarchies, hierarchy) {
		var hierarchyDimensions = hierarchy.getListByKey("DimensionNames");
		var dimensionNames = oFF.XListOfString.create();
		var size = hierarchyDimensions.size();
		var i;
		var name;
		var initialDrillLevel;
		var alignment;
		var active;
		var customDimensions;
		for (i = 0; i < size; i++) {
			dimensionNames.add(hierarchyDimensions.getStringAt(i));
		}
		name = hierarchy.getStringByKey("Name");
		initialDrillLevel = hierarchy.getIntegerByKey("InitialDrillLevel");
		alignment = oFF.QInAConverter.lookupLowerLevelNodeAlignment(hierarchy
				.getStringByKey("LowerLevelNodeAlignment"));
		active = hierarchy.getBooleanByKeyExt("Active", false);
		customDimensions = hierarchy.getBooleanByKeyExt("CustomDimensions",
				false);
		universalDisplayHierarchies.addHierarchy(name, dimensionNames,
				initialDrillLevel, alignment, active, null, customDimensions);
	};
	oFF.QInAMdUniversalDisplayHierarchies.assignAxesToHierarchies = function(
			universalDisplayHierarchies) {
		var queryModel = universalDisplayHierarchies.getQueryModel();
		var hierarchies = universalDisplayHierarchies.getHierarchies();
		var assignedAxisTypes = oFF.XList.create();
		var size = hierarchies.size();
		var i;
		var udh;
		var axis;
		var k;
		var hierarchy;
		for (i = 0; i < size; i++) {
			udh = hierarchies.get(i);
			if (udh.getHierarchyDedicatedAxis() !== null) {
				assignedAxisTypes
						.add(udh.getHierarchyDedicatedAxis().getType());
				continue;
			}
			axis = oFF.QInAMdUniversalDisplayHierarchies
					.getAxisForDimensionList(udh.getDimensionNames(),
							queryModel);
			if (oFF.notNull(axis)
					&& !assignedAxisTypes.contains(axis.getType())) {
				udh.setAxis(axis);
				assignedAxisTypes.add(axis.getType());
			}
		}
		for (k = 0; k < size; k++) {
			hierarchy = hierarchies.get(k);
			if (hierarchy.getHierarchyDedicatedAxis() === null) {
				hierarchy
						.setAxis(assignedAxisTypes.contains(oFF.AxisType.ROWS) ? queryModel
								.getColumnsAxis()
								: queryModel.getRowsAxis());
			}
		}
	};
	oFF.QInAMdUniversalDisplayHierarchies.getAxisForDimensionList = function(
			dimensions, queryModel) {
		var i;
		var dimension;
		var axisType;
		if (oFF.notNull(dimensions)) {
			for (i = 0; i < dimensions.size(); i++) {
				dimension = queryModel
						.getDimensionByNameFromExistingMetadata(dimensions
								.get(i));
				if (oFF.notNull(dimension)) {
					axisType = dimension.getAxisType();
					if (axisType === oFF.AxisType.ROWS
							|| axisType === oFF.AxisType.COLUMNS) {
						return dimension.getAxis();
					}
				}
			}
		}
		return null;
	};
	oFF.QInAMdUniversalDisplayHierarchies.prototype.getComponentType = function() {
		return oFF.OlapComponentType.UNIVERSAL_DISPLAY_HIERARCHIES;
	};
	oFF.QInAMdUniversalDisplayHierarchies.prototype.newModelComponent = function(
			application, parentComponent, context) {
		return oFF.QFactory.newUniversalDisplayHierarchies(context);
	};
	oFF.QInAMdUniversalDisplayHierarchies.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var universalDisplayHierarchies = modelComponent;
		var udh;
		var hierarchies;
		var size;
		var queryModel;
		var i;
		var inaHierarchy;
		if (oFF.notNull(inaStructure)
				&& importer.supportsUniversalDisplayHierarchy) {
			udh = inaStructure.getStructureByKey("UniversalDisplayHierarchies");
			if (oFF.notNull(udh)) {
				hierarchies = udh.getListByKey("DefinedHierarchies");
				size = hierarchies.size();
				queryModel = universalDisplayHierarchies.getQueryModel();
				for (i = 0; i < size; i++) {
					inaHierarchy = hierarchies.getStructureAt(i);
					oFF.QInAMdUniversalDisplayHierarchies.importHierarchy(
							universalDisplayHierarchies, inaHierarchy);
					oFF.QInAMdUniversalDisplayHierarchies.importUdhDimension(
							importer, queryModel, inaHierarchy
									.getStringByKey("Name"));
				}
			}
		}
		oFF.QInAMdUniversalDisplayHierarchies
				.assignAxesToHierarchies(universalDisplayHierarchies);
		return universalDisplayHierarchies;
	};
	oFF.QInAMdUniversalDisplayHierarchies.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		return inaStructure;
	};
	oFF.QInAMdVarDimMember = function() {
	};
	oFF.QInAMdVarDimMember.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdVarDimMember.prototype.getComponentType = function() {
		return oFF.VariableType.DIMENSION_MEMBER_VARIABLE;
	};
	oFF.QInAMdVarDimMember.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var variableContainer = parentComponent;
		var variableType = oFF.VariableType.DIMENSION_MEMBER_VARIABLE;
		var inaSemanticType;
		var memberVariable;
		var name;
		var variables;
		var supportsValuehelp;
		var dimension;
		var inaDimensionReference;
		var dimensionName;
		var dimensionAccessor;
		var isPartialData;
		var message;
		var queryModel;
		var queryManager;
		var inaValues;
		var selectionContainer;
		var tmp;
		var newSelectionContainer;
		var cProduct;
		var cartesianList;
		if (inaStructure.containsKey("isHierarchical")) {
			if (inaStructure.getBooleanByKeyExt("isHierarchical", false)) {
				variableType = oFF.VariableType.HIERARCHY_NODE_VARIABLE;
			}
		} else {
			inaSemanticType = oFF.PrUtils.getStringValueProperty(inaStructure,
					"SemanticType", null);
			if (oFF.notNull(inaSemanticType)) {
				if (oFF.XString.isEqual(inaSemanticType,
						"HierarchyNodeVariable")) {
					variableType = oFF.VariableType.HIERARCHY_NODE_VARIABLE;
				} else {
					if (oFF.XString.isEqual(inaSemanticType,
							"HierarchyNameVariable")) {
						variableType = oFF.VariableType.HIERARCHY_NAME_VARIABLE;
					}
				}
			}
		}
		name = inaStructure.getStringByKey("Name");
		variables = variableContainer.getVariables();
		if (variables.containsKey(name)) {
			memberVariable = variables.getByKey(name);
		} else {
			if (variableType === oFF.VariableType.HIERARCHY_NODE_VARIABLE) {
				memberVariable = oFF.QHierarchyNodeVariable
						.createHierarchyNodeVariable(context,
								variableContainer, name, null);
			} else {
				if (variableType === oFF.VariableType.HIERARCHY_NAME_VARIABLE) {
					memberVariable = oFF.QHierarchyNameVariable
							.createDimensionHierarchyVariable(context,
									variableContainer, name, null);
				} else {
					memberVariable = oFF.QDimensionMemberVariable
							.createDimensionMemberVariable(context,
									variableContainer, name, null);
				}
			}
		}
		if (inaStructure.containsKey("IsInputEnabledAndExit")) {
			memberVariable.setIsInputEnabledAndExit(inaStructure
					.getBooleanByKey("IsInputEnabledAndExit"));
		}
		oFF.QInAMdVarMisc.importMd(inaStructure, memberVariable);
		supportsValuehelp = inaStructure.getBooleanByKeyExt(
				"SupportsValueHelp", true);
		memberVariable.setSupportsValueHelp(supportsValuehelp);
		dimension = null;
		inaDimensionReference = oFF.PrUtils.getStructureProperty(inaStructure,
				"DimensionReference");
		if (oFF.notNull(inaDimensionReference)) {
			dimensionName = inaDimensionReference.getStringByKey("Name");
			if (oFF.notNull(dimensionName)) {
				dimensionAccessor = variableContainer.getDimensionAccessor();
				if (oFF.notNull(dimensionAccessor)) {
					dimension = dimensionAccessor
							.getDimensionByNameFromExistingMetadata(dimensionName);
				}
			}
		}
		if (oFF.isNull(dimension)) {
			isPartialData = variableContainer.getQueryModel() !== null
					&& (variableContainer.getQueryModel().isPartialResponse(
							variableContainer.getQueryManager()) || variableContainer
							.getQueryModel().hasPartialAxes(
									variableContainer.getQueryManager()));
			if (!isPartialData) {
				message = oFF.XStringUtils
						.concatenate3(
								"Error in importing Variables: No dimension specified for variable ",
								name, " !");
				if (memberVariable.isInputEnabled()) {
					importer.addError(oFF.ErrorCodes.INVALID_STATE, message);
					return null;
				}
				importer.addInfo(oFF.ErrorCodes.IMPORT_VARIABE_NO_DIMENSION,
						message);
			}
		} else {
			memberVariable.setDimension(dimension);
		}
		oFF.QInAMdVarSelectionCap.importMd(importer, inaStructure,
				memberVariable, context);
		oFF.QInAMdVarHierInfo.importMd(importer, inaStructure, memberVariable,
				context);
		memberVariable.setIsUsedInFixedFilter(inaStructure.getBooleanByKeyExt(
				"UsedInFixedFilter", false));
		memberVariable.setIsUsedInDynamicFilter(inaStructure
				.getBooleanByKeyExt("UsedInDynamicFilter", false));
		queryModel = memberVariable.getQueryModel();
		queryManager = null;
		if (oFF.notNull(queryModel)) {
			queryManager = queryModel.getQueryManager();
		}
		inaValues = inaStructure.getStructureByKey("Values");
		if (oFF.notNull(inaValues)
				&& oFF.notNull(queryManager)
				&& queryManager.getVariableProcessorState() !== oFF.VariableProcessorState.PROCESSING_REINIT) {
			selectionContainer = oFF.QFilterExpression._createByApplication(
					context, memberVariable);
			tmp = importer.mode;
			importer.mode = oFF.QModelFormat.INA_DATA;
			newSelectionContainer = importer.importFilterExpression(
					selectionContainer, inaValues, memberVariable, context);
			importer.mode = tmp;
			cProduct = newSelectionContainer.getCartesianProduct();
			if (oFF.notNull(cProduct)) {
				cartesianList = cProduct.getCartesianList(memberVariable
						.getDimension());
				memberVariable.setDefaultMemberFilter(cartesianList
						.cloneOlapComponent(memberVariable, null));
			}
		}
		return memberVariable;
	};
	oFF.QInAMdVarDimMember.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var memberVariable = modelComponent;
		var variableType;
		var inaDimensionReference;
		var defaultMemberSelection;
		var tmp;
		var inaVariableValues;
		var inaSelection;
		inaStructure.putString("VariableType", "DimensionMemberVariable");
		variableType = memberVariable.getVariableType();
		if (variableType === oFF.VariableType.HIERARCHY_NAME_VARIABLE) {
			inaStructure.putString("SemanticType", "HierarchyNameVariable");
		} else {
			if (variableType === oFF.VariableType.HIERARCHY_NODE_VARIABLE) {
				inaStructure.putString("SemanticType", "HierarchyNodeVariable");
			} else {
				inaStructure.putString("SemanticType",
						"DimensionMemberVariable");
			}
		}
		if (memberVariable.isInputEnabledAndExitProvidedInMd()) {
			inaStructure.putBoolean("IsInputEnabledAndExit", memberVariable
					.isEnforcedDynamicValue());
		}
		oFF.QInAMdVarMisc.exportMd(exporter, memberVariable, inaStructure);
		inaStructure.putBoolean("SupportsValueHelp", memberVariable
				.supportsValueHelp());
		if (memberVariable.getDimension() !== null) {
			inaDimensionReference = inaStructure
					.putNewStructure("DimensionReference");
			inaDimensionReference.putString("Name", memberVariable
					.getDimension().getName());
		}
		oFF.QInAMdVarSelectionCap.exportMd(exporter, inaStructure,
				memberVariable);
		oFF.QInAMdVarHierInfo.exportMd(inaStructure, memberVariable);
		inaStructure.putBoolean("UsedInFixedFilter", memberVariable
				.isUsedInFixedFilter());
		inaStructure.putBoolean("UsedInDynamicFilter", memberVariable
				.isUsedInDynamicFilter());
		defaultMemberSelection = memberVariable.getDefaultMemberFilter();
		if (oFF.notNull(defaultMemberSelection)
				&& defaultMemberSelection.hasElements()) {
			tmp = exporter.mode;
			exporter.mode = oFF.QModelFormat.INA_DATA;
			inaVariableValues = inaStructure.putNewStructure("Values");
			inaSelection = inaVariableValues.putNewStructure("Selection");
			exporter.exportCartesianList(defaultMemberSelection, inaSelection);
			exporter.mode = tmp;
		}
		return inaStructure;
	};
	oFF.QInAMdVarHierInfo = function() {
	};
	oFF.QInAMdVarHierInfo.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdVarHierInfo.importMd = function(importer, inaStructure, variable,
			context) {
		var inaHierarchy;
		var date;
		var variableType;
		var variableContainer;
		var dimensionHierarchyVariable;
		var hierarchyBaseDimName;
		var dimensionAccessor;
		var hierarchyDimension;
		var variableMode;
		var hierarchyName;
		var dimension;
		var hierarchy;
		var hierarchyVersion;
		var hierarchyKeyDate;
		var dueDate;
		variable.setHierarchyName(null);
		variable.setHierarchyVersion(null);
		variable.setHierarchyKeyDate(null);
		variable.setHierarchyBaseDimension(null);
		inaHierarchy = oFF.PrUtils.getStructureProperty(inaStructure,
				"Hierarchy");
		if (oFF.notNull(inaHierarchy)) {
			variable.setHierarchyBaseDimension(inaHierarchy
					.getStringByKey("BaseDimension"));
			variable.setHierarchyName(inaHierarchy.getStringByKey("Name"));
			variable
					.setHierarchyVersion(inaHierarchy.getStringByKey("Version"));
			date = inaHierarchy.getStringByKey("DueDate");
			if (oFF.isNull(date)) {
				date = inaHierarchy.getStringByKey("DateTo");
			}
			variable.setHierarchyKeyDate(date);
		}
		variableType = variable.getVariableType();
		variableContainer = variable.getVariableContext();
		if (variableType === oFF.VariableType.HIERARCHY_NAME_VARIABLE) {
			dimensionHierarchyVariable = variable;
			hierarchyBaseDimName = inaStructure
					.getStringByKey("HierarchyBaseDimension");
			if (oFF.isNull(hierarchyBaseDimName)) {
				hierarchyBaseDimName = inaStructure
						.getStringByKey("HierachyBaseDimension");
			}
			if (oFF.notNull(hierarchyBaseDimName)) {
				dimensionAccessor = variableContainer.getDimensionAccessor();
				if (oFF.notNull(dimensionAccessor)) {
					hierarchyDimension = dimensionAccessor
							.getDimensionByNameFromExistingMetadata(hierarchyBaseDimName);
					dimensionHierarchyVariable
							.setHierarchyNameDimension(hierarchyDimension);
				}
			}
		} else {
			if (variableType === oFF.VariableType.HIERARCHY_NODE_VARIABLE) {
				variableMode = variableContainer.getVariableMode();
				if (variableMode === oFF.VariableMode.DIRECT_VALUE_TRANSFER) {
					hierarchyName = variable.getHierarchyName();
					dimension = variable.getDimension();
					if (oFF.notNull(hierarchyName) && oFF.notNull(dimension)) {
						hierarchy = oFF.QHierarchy.create(context, dimension,
								hierarchyName);
						hierarchyVersion = variable.getHierarchyVersion();
						hierarchy.setHierarchyVersion(hierarchyVersion);
						hierarchyKeyDate = variable.getHierarchyKeyDate();
						if (!oFF.XString.isEqual(hierarchyKeyDate, "")) {
							dueDate = oFF.XDate.createDateFromStringWithFlag(
									hierarchyKeyDate,
									importer.supportsSAPDateFormat);
							if (oFF.notNull(dueDate)) {
								hierarchy.setHierarchyDueDate(dueDate);
							}
							dimension.setHierarchy(hierarchy);
						}
					}
				}
			}
		}
	};
	oFF.QInAMdVarHierInfo.exportMd = function(inaStructure, variable) {
		var inaHierarchy = inaStructure.putNewStructure("Hierarchy");
		var variableType;
		var hierarchyNameDimension;
		inaHierarchy.putStringNotNull("BaseDimension", variable
				.getHierarchyBaseDimension());
		inaHierarchy.putStringNotNull("Name", variable.getHierarchyName());
		inaHierarchy
				.putStringNotNull("Version", variable.getHierarchyVersion());
		inaHierarchy
				.putStringNotNull("DueDate", variable.getHierarchyKeyDate());
		variableType = variable.getVariableType();
		if (variableType === oFF.VariableType.HIERARCHY_NAME_VARIABLE) {
			hierarchyNameDimension = variable.getHierarchyNameDimension();
			oFF.QInAExportUtil.setNameIfNotNull(inaStructure,
					"HierarchyBaseDimension", hierarchyNameDimension);
		}
	};
	oFF.QInAMdVarHierInfo.prototype.getComponentType = function() {
		return null;
	};
	oFF.QInAMdVarHierInfo.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		oFF.QInAMdVarHierInfo.importMd(importer, inaStructure, modelComponent,
				context);
		return modelComponent;
	};
	oFF.QInAMdVarHierInfo.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		oFF.QInAMdVarHierInfo.exportMd(inaStructure, modelComponent);
		return inaStructure;
	};
	oFF.QInAMdVarMisc = function() {
	};
	oFF.QInAMdVarMisc.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdVarMisc.importMd = function(inaStructure, variable) {
		var inaInputEnabled;
		var inaInputType;
		var screenOrder;
		var inaDependentVariables;
		var dependentSize;
		var i;
		if (oFF.notNull(variable)) {
			variable.setText(inaStructure.getStringByKey("Description"));
			inaInputEnabled = inaStructure.getBooleanByKeyExt("InputEnabled",
					false);
			variable.setInputEnabled(inaInputEnabled);
			variable.setNameExternal(inaStructure
					.getStringByKey("NameExternal"));
			inaInputType = inaStructure.getStringByKeyExt("InputType",
					"Optional");
			if (oFF.XString.isEqual(inaInputType, "Optional")) {
				variable.setMandatory(false);
				variable.setInitialValueAllowed(true);
			} else {
				if (oFF.XString.isEqual(inaInputType, "Mandatory")) {
					variable.setMandatory(true);
					variable.setInitialValueAllowed(true);
				} else {
					if (oFF.XString
							.isEqual(inaInputType, "MandatoryNotInitial")) {
						variable.setMandatory(true);
						variable.setInitialValueAllowed(false);
					}
				}
			}
			variable.setIsDynamicVariable(inaStructure.getBooleanByKeyExt(
					"IsDynamicValue", false));
			screenOrder = inaStructure.getIntegerByKeyExt("ScreenOrder", 0);
			variable.setVariableOrder(screenOrder);
			inaDependentVariables = inaStructure
					.getListByKey("DependentOfVariable");
			if (!oFF.PrUtils.isListEmpty(inaDependentVariables)) {
				dependentSize = inaDependentVariables.size();
				for (i = 0; i < dependentSize; i++) {
					variable.addDependentVariableName(inaDependentVariables
							.getStringAt(i));
				}
			}
		}
	};
	oFF.QInAMdVarMisc.exportMd = function(exporter, variable, inaStructure) {
		var dependentVariables;
		var inaDependentVariables;
		inaStructure.putString("Name", variable.getName());
		inaStructure.putString("Description", variable.getText());
		inaStructure.putBoolean("InputEnabled", variable.isInputEnabled());
		inaStructure.putString("NameExternal", variable.getNameExternal());
		if (variable.isDynamicVariable()) {
			inaStructure.putBoolean("IsDynamicValue", variable
					.isDynamicVariable());
		}
		if (variable.isMandatory()) {
			if (variable.isInitialValueAllowed()) {
				inaStructure.putString("InputType", "Mandatory");
			} else {
				inaStructure.putString("InputType", "MandatoryNotInitial");
			}
		} else {
			if (variable.isInitialValueAllowed()) {
				inaStructure.putString("InputType", "Optional");
			} else {
				exporter
						.addError(oFF.ErrorCodes.INVALID_STATE,
								"illegal combination: optional variables must support initial values");
			}
		}
		inaStructure.putInteger("ScreenOrder", variable.getVariableOrder());
		dependentVariables = variable.getDependentVariablesNames();
		if (oFF.XCollectionUtils.hasElements(dependentVariables)) {
			inaDependentVariables = inaStructure
					.putNewList("DependentOfVariable");
			inaDependentVariables.addAllStrings(dependentVariables);
		}
	};
	oFF.QInAMdVarMisc.prototype.getComponentType = function() {
		return null;
	};
	oFF.QInAMdVarMisc.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		oFF.QInAMdVarMisc.exportMd(exporter, modelComponent, inaStructure);
		return inaStructure;
	};
	oFF.QInAMdVarMisc.prototype.importComponentWithStructure = oFF.noSupport;
	oFF.QInAMdVarOptionList = function() {
	};
	oFF.QInAMdVarOptionList.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdVarOptionList.prototype.getComponentType = function() {
		return oFF.VariableType.OPTION_LIST_VARIABLE;
	};
	oFF.QInAMdVarOptionList.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var variableContainer = context.getVariableContainer();
		var name = inaStructure.getStringByKey("Name");
		var variables = variableContainer.getVariables();
		var optionListVariable;
		var variable;
		var inaSemanticType;
		var hasMultipleValues;
		var inaOptionList;
		var len;
		var i;
		var inaOption;
		var inaOptionName;
		var inaOptionDescription;
		if (variables.containsKey(name)) {
			variable = variables.getByKey(name);
			optionListVariable = variable;
		} else {
			inaSemanticType = oFF.PrUtils.getStringValueProperty(inaStructure,
					"SemanticType", null);
			hasMultipleValues = inaStructure.getBooleanByKeyExt(
					"MultipleValues", false);
			if (oFF.XString.isEqual("HierarchyVariable", inaSemanticType)) {
				optionListVariable = oFF.QSimpleTypeVariable
						.createHierarchyVariable(context, variableContainer,
								name, null, hasMultipleValues);
			} else {
				optionListVariable = oFF.QSimpleTypeVariable
						.createOptionListVariable(context, variableContainer,
								name, null, hasMultipleValues);
			}
		}
		oFF.QInAMdVarMisc.importMd(inaStructure, optionListVariable);
		optionListVariable.clearOptions();
		inaOptionList = inaStructure.getListByKey("Options");
		if (!oFF.PrUtils.isListEmpty(inaOptionList)) {
			len = inaOptionList.size();
			for (i = 0; i < len; i++) {
				inaOption = inaOptionList.getStructureAt(i);
				inaOptionName = inaOption.getStringByKey("Name");
				inaOptionDescription = inaOption.getStringByKey("Description");
				optionListVariable.createAndAddOption(inaOptionName,
						inaOptionDescription);
			}
		}
		return optionListVariable;
	};
	oFF.QInAMdVarOptionList.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var variable = modelComponent;
		var variableType;
		var options;
		var inaOptionList;
		var len;
		var i;
		var option;
		var inaOption;
		inaStructure.putString("VariableType", "OptionListVariable");
		variableType = variable.getVariableType();
		if (variableType === oFF.VariableType.HIERARCHY_VARIABLE) {
			inaStructure.putString("SemanticType", "HierarchyVariable");
		} else {
			inaStructure.putString("SemanticType", "OptionListVariable");
		}
		oFF.QInAMdVarMisc.exportMd(exporter, variable, inaStructure);
		inaStructure.putBoolean("MultipleValues", variable
				.supportsMultipleValues());
		options = variable.getOptions();
		inaOptionList = inaStructure.putNewList("Options");
		len = options.size();
		for (i = 0; i < len; i++) {
			option = options.get(i);
			inaOption = inaOptionList.addNewStructure();
			inaOption.putString("Name", option.getName());
			inaOption.putString("Description", option.getText());
		}
		return inaStructure;
	};
	oFF.QInAMdVarSelectionCap = function() {
	};
	oFF.QInAMdVarSelectionCap.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdVarSelectionCap.importMd = function(importer, inaStructure,
			memberVariable, context) {
		var variableField = null;
		var dimension = memberVariable.getDimension();
		var inaValues;
		var inaSelection;
		var inaSetOperand;
		var definedSelectionCapability;
		var queryModel;
		var variableSelectionCapabilities;
		var supportsMultipleValues;
		if (oFF.notNull(dimension)) {
			inaValues = inaStructure.getStructureByKey("Values");
			if (oFF.notNull(inaValues)) {
				inaSelection = inaValues.getStructureByKey("Selection");
				if (oFF.notNull(inaSelection)) {
					inaSetOperand = inaSelection
							.getStructureByKey("SetOperand");
					if (oFF.notNull(inaSetOperand)) {
						variableField = dimension.getFieldByName(inaSetOperand
								.getStringByKey("FieldName"));
					}
				}
			}
		}
		definedSelectionCapability = oFF.QInAMdFilterCapability.importMd(
				importer, inaStructure, variableField, memberVariable, context);
		queryModel = memberVariable.getQueryModel();
		if (oFF.notNull(queryModel) && importer.isAbap(queryModel)) {
			if (definedSelectionCapability.getGroup() === oFF.QSetSignComparisonOperatorGroup.SINGLE_VALUE) {
				definedSelectionCapability
						.setGroup(oFF.QSetSignComparisonOperatorGroup.SINGLE_VALUE_INCLUDE_ONLY);
			}
		}
		memberVariable.setFilterCapability(definedSelectionCapability);
		variableSelectionCapabilities = oFF.QFilterCapabilityList
				.createFilterCapabilitiesForVariable(context, memberVariable);
		memberVariable.setFilterCapabilities(variableSelectionCapabilities);
		supportsMultipleValues = oFF.PrUtils.getBooleanValueProperty(
				inaStructure, "MultipleValues", false);
		variableSelectionCapabilities
				.setSupportsMultipleValues(supportsMultipleValues);
		oFF.QInAMdVarSelectionCap.mergeCapabilities(dimension,
				definedSelectionCapability, variableSelectionCapabilities);
	};
	oFF.QInAMdVarSelectionCap.mergeCapabilities = function(dimension,
			definedSelectionCapability, variableSelectionCapabilities) {
		var dimFilterCapabilities;
		var dimFilterableFields;
		var fieldSize;
		var i;
		var fieldName;
		var dimFilterCapability;
		var newVariableCapability;
		if (oFF.notNull(dimension) && oFF.notNull(definedSelectionCapability)) {
			dimFilterCapabilities = dimension.getFilterCapabilities();
			dimFilterableFields = dimFilterCapabilities
					.getSelectableFieldNames();
			fieldSize = dimFilterableFields.size();
			for (i = 0; i < fieldSize; i++) {
				fieldName = dimFilterableFields.get(i);
				dimFilterCapability = dimFilterCapabilities
						.getFilterCapabilitiesByFieldName(fieldName);
				if (dimFilterCapability.supportsSetSign(oFF.SetSign.INCLUDING)) {
					newVariableCapability = variableSelectionCapabilities
							.createAndAddFilterCapabilitiesForFieldName(fieldName);
					oFF.QInAMdVarSelectionCap.mergeOperators(
							oFF.SetSign.INCLUDING, newVariableCapability,
							dimFilterCapability, definedSelectionCapability);
					if (dimFilterCapability
							.supportsSetSign(oFF.SetSign.EXCLUDING)) {
						oFF.QInAMdVarSelectionCap
								.mergeOperators(oFF.SetSign.EXCLUDING,
										newVariableCapability,
										dimFilterCapability,
										definedSelectionCapability);
					}
				}
			}
		}
	};
	oFF.QInAMdVarSelectionCap.mergeOperators = function(setSign,
			newVariableCapability, dimFilterCapability,
			definedSelectionCapability) {
		var newIncludingOperators;
		var includingsByField;
		var includingsVariable;
		var size;
		var j;
		var comparionsOperator;
		if (oFF.notNull(definedSelectionCapability)) {
			if (definedSelectionCapability.supportsSetSign(setSign)) {
				newVariableCapability.addSupportedSetSign(setSign);
				newIncludingOperators = newVariableCapability
						.getModifiableSupportedComparisonOperators(setSign);
				includingsByField = dimFilterCapability
						.getSupportedComparisonOperators(setSign);
				includingsVariable = definedSelectionCapability
						.getSupportedComparisonOperators(setSign);
				size = includingsVariable.size();
				for (j = 0; j < size; j++) {
					comparionsOperator = includingsVariable.get(j);
					if (includingsByField.contains(comparionsOperator)) {
						newIncludingOperators.add(comparionsOperator);
					}
				}
			}
		}
	};
	oFF.QInAMdVarSelectionCap.exportMd = function(exporter, inaStructure,
			memberVariable) {
		var selectionCapability = memberVariable.getFilterCapability();
		var selectionCapabilities;
		oFF.QInAMdFilterCapability.exportMd(exporter, selectionCapability,
				inaStructure, memberVariable.getQueryModel());
		selectionCapabilities = memberVariable.getFilterCapabilities();
		if (oFF.notNull(selectionCapabilities)) {
			inaStructure.putBoolean("MultipleValues", selectionCapabilities
					.supportsMultipleValues());
		}
	};
	oFF.QInAMdVarSelectionCap.prototype.getComponentType = function() {
		return null;
	};
	oFF.QInAMdVarSelectionCap.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		oFF.QInAMdVarSelectionCap.importMd(importer, inaStructure,
				modelComponent, context);
		return modelComponent;
	};
	oFF.QInAMdVarSelectionCap.prototype.exportComponent = function(exporter,
			modelComponent, inaParentStructure, flags) {
		return this.exportComponentWithStructure(exporter, modelComponent, oFF
				.isNull(inaParentStructure) ? oFF.PrFactory.createStructure()
				: inaParentStructure, flags);
	};
	oFF.QInAMdVarSelectionCap.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		oFF.QInAMdVarSelectionCap.exportMd(exporter, inaStructure,
				modelComponent);
		return inaStructure;
	};
	oFF.QInAMdVarSimpleType = function() {
	};
	oFF.QInAMdVarSimpleType.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdVarSimpleType.importMd = function(inaStructure, variableContext,
			context) {
		var simpleTypeVariable = null;
		var name = oFF.PrUtils.getStringValueProperty(inaStructure, "Name",
				null);
		var variables;
		var inaSemanticType;
		var hasMultipleValues;
		var inaValueType;
		var valueType;
		var inaScale;
		var inaLength;
		if (oFF.notNull(name)) {
			variables = variableContext.getVariables();
			if (variables.containsKey(name)) {
				simpleTypeVariable = variables.getByKey(name);
			} else {
				inaSemanticType = oFF.PrUtils.getStringValueProperty(
						inaStructure, "SemanticType", null);
				hasMultipleValues = inaStructure.getBooleanByKeyExt(
						"MultipleValues", false);
				if (oFF.XString.isEqual("FormulaVariable", inaSemanticType)) {
					simpleTypeVariable = oFF.QSimpleTypeVariable
							.createFormulaVariable(context, variableContext,
									name, null, hasMultipleValues);
				} else {
					if (oFF.XString.isEqual("TextVariable", inaSemanticType)) {
						simpleTypeVariable = oFF.QSimpleTypeVariable
								.createTextVariable(context, variableContext,
										name, null, hasMultipleValues);
					} else {
						inaValueType = oFF.PrUtils.getStringValueProperty(
								inaStructure, "ValueType", null);
						valueType = oFF.QInAConverter
								.lookupValueType(inaValueType);
						simpleTypeVariable = oFF.QSimpleTypeVariable
								.createSimpleTypeVariable(context,
										variableContext, valueType, name, null,
										hasMultipleValues);
					}
				}
			}
			oFF.QInAMdVarMisc.importMd(inaStructure, simpleTypeVariable);
			inaScale = inaStructure.getIntegerByKeyExt("Scale", -1);
			if (inaScale !== -1) {
				simpleTypeVariable.setValueScale(inaScale);
			}
			inaLength = inaStructure.getIntegerByKeyExt("Length", -1);
			if (inaLength !== -1) {
				simpleTypeVariable.setValueLength(inaLength);
			}
		}
		return simpleTypeVariable;
	};
	oFF.QInAMdVarSimpleType.exportMd = function(exporter, variable,
			inaStructure) {
		var variableType;
		var valueType;
		inaStructure.putString("VariableType", "SimpleTypeVariable");
		variableType = variable.getVariableType();
		if (variableType === oFF.VariableType.FORMULA_VARIABLE) {
			inaStructure.putString("SemanticType", "FormulaVariable");
		} else {
			if (variableType === oFF.VariableType.TEXT_VARIABLE) {
				inaStructure.putString("SemanticType", "TextVariable");
			} else {
				inaStructure.putString("SemanticType", "ValueVariable");
				valueType = variable.getValueType();
				inaStructure.putString("ValueType", oFF.QInAConverter
						.lookupValueTypeInA(valueType));
			}
		}
		oFF.QInAMdVarMisc.exportMd(exporter, variable, inaStructure);
		inaStructure.putInteger("Scale", variable.getValueScale());
		inaStructure.putInteger("Length", variable.getValueLength());
		inaStructure.putBoolean("MultipleValues", variable
				.supportsMultipleValues());
		return inaStructure;
	};
	oFF.QInAMdVarSimpleType.prototype.getComponentType = function() {
		return null;
	};
	oFF.QInAMdVarSimpleType.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		return oFF.QInAMdVarSimpleType.exportMd(exporter, modelComponent,
				inaStructure);
	};
	oFF.QInAMdVarSimpleType.prototype.importComponentWithStructure = oFF.noSupport;
	oFF.QInAMdVariable = function() {
	};
	oFF.QInAMdVariable.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdVariable.prototype.getComponentType = function() {
		return oFF.VariableType.ANY_VARIABLE;
	};
	oFF.QInAMdVariable.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var variableContext = parentComponent;
		var variable;
		var inaVariableType = oFF.PrUtils.getStringValueProperty(inaStructure,
				"VariableType", null);
		if (oFF.XString.isEqual("DimensionMemberVariable", inaVariableType)) {
			variable = importer.importDimensionMemberVariable(inaStructure,
					null, variableContext, variableContext);
		} else {
			if (oFF.XString.isEqual("OptionListVariable", inaVariableType)) {
				variable = importer.importOptionListVariable(inaStructure,
						null, variableContext);
			} else {
				if (oFF.XString.isEqual("SimpleTypeVariable", inaVariableType)) {
					variable = oFF.QInAMdVarSimpleType.importMd(inaStructure,
							variableContext, context);
				} else {
					importer.addError(0, oFF.XStringUtils.concatenate2(
							"Variable type not supported: ", inaVariableType));
					return null;
				}
			}
		}
		return variable;
	};
	oFF.QInAMdVariable.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var variable = modelComponent;
		var variableType = variable.getVariableType();
		if (variableType.isTypeOf(oFF.VariableType.DIMENSION_MEMBER_VARIABLE)) {
			return exporter.exportDimensionMemberVariable(variable,
					inaStructure);
		} else {
			if (variableType.isTypeOf(oFF.VariableType.SIMPLE_TYPE_VARIABLE)) {
				oFF.QInAMdVarSimpleType.exportMd(exporter, variable,
						inaStructure);
			} else {
				if (variableType
						.isTypeOf(oFF.VariableType.OPTION_LIST_VARIABLE)) {
					exporter.exportOptionListVariable(variable, inaStructure);
				} else {
					exporter.addError(0, oFF.XStringUtils.concatenate2(
							"Variable type not supported: ", variableType
									.getName()));
				}
			}
		}
		return inaStructure;
	};
	oFF.QInAMdVariableContainer = function() {
	};
	oFF.QInAMdVariableContainer.prototype = new oFF.QInAComponentMetadata();
	oFF.QInAMdVariableContainer.resolveVariableDependencies = function(
			variableContainer) {
		var variables = variableContainer.getVariables();
		var variableSize = variables.size();
		var i;
		var variable;
		var dependentVariablesNames;
		var dependentSize;
		var j;
		var otherVariable;
		for (i = 0; i < variableSize; i++) {
			variable = variables.get(i);
			dependentVariablesNames = variable.getDependentVariablesNames();
			dependentSize = dependentVariablesNames.size();
			for (j = 0; j < dependentSize; j++) {
				otherVariable = variables.getByKey(dependentVariablesNames
						.get(j));
				variable.addDependentVariable(otherVariable);
			}
		}
	};
	oFF.QInAMdVariableContainer.prototype.getComponentType = function() {
		return oFF.OlapComponentType.VARIABLE_CONTAINER;
	};
	oFF.QInAMdVariableContainer.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var variableContainer;
		var inaList;
		if (oFF.notNull(inaStructure)) {
			variableContainer = modelComponent;
			inaList = inaStructure.getListByKey("VariablesMd");
			if (oFF.isNull(inaList)) {
				inaList = inaStructure.getListByKey("Variables");
			}
			this.importVariableList(importer, inaList, variableContainer);
		}
		return modelComponent;
	};
	oFF.QInAMdVariableContainer.prototype.importVariableList = function(
			importer, inaElement, modelComponent) {
		var variableContainer = modelComponent;
		var inaVariablesList = inaElement;
		var variables;
		var variableSize;
		var i;
		var inaStructure;
		var variable;
		if (oFF.notNull(inaVariablesList)) {
			variables = variableContainer.getVariables();
			variableSize = inaVariablesList.size();
			for (i = 0; i < variableSize; i++) {
				inaStructure = oFF.PrUtils.getStructureElement(
						inaVariablesList, i);
				if (oFF.notNull(inaStructure)) {
					variable = importer.importVariable(inaStructure,
							variableContainer);
					if (oFF.notNull(variable) && !variables.contains(variable)) {
						variableContainer.addVariable(variable);
					}
				}
			}
			oFF.QInAMdVariableContainer
					.resolveVariableDependencies(variableContainer);
		}
	};
	oFF.QInAMdVariableContainer.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var varMgr = modelComponent;
		var inaList = inaStructure.putNewList("VariablesMd");
		var variables = varMgr.getVariables();
		var variableSize = variables.size();
		var i;
		for (i = 0; i < variableSize; i++) {
			inaList.add(exporter.exportVariable(variables.get(i), null));
		}
		return inaStructure;
	};
	oFF.QInACalculatedDimension = function() {
	};
	oFF.QInACalculatedDimension.prototype = new oFF.QInADimension();
	oFF.QInACalculatedDimension.prototype.getComponentType = function() {
		return oFF.DimensionType.CALCULATED_DIMENSION;
	};
	oFF.QInACalculatedDimension.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var dimension = modelComponent;
		var inaDataSource;
		var inaJoinFields;
		var size;
		var idx;
		var inaJoinField;
		var inaFieldMappings;
		var inaFieldMapping;
		var fieldByName;
		if (oFF.isNull(dimension)) {
			dimension = oFF.QCalculatedDimension._createCalculatedDimension(
					context, parentComponent, null);
		}
		dimension.setName(inaStructure.getStringByKey("Name"));
		dimension.setTopEntries(inaStructure.getIntegerByKeyExt("Top", 0));
		dimension.setSkipEntries(inaStructure.getIntegerByKeyExt("Skip", 0));
		inaDataSource = inaStructure.getStructureByKey("DataSource");
		dimension.setPreQueryName(inaDataSource.getStringByKey("ObjectName"));
		dimension.setJoinType(oFF.JoinType.lookup(inaStructure
				.getStringByKey("JoinType")));
		inaJoinFields = inaStructure.getListByKey("JoinFields");
		size = inaJoinFields.size();
		for (idx = 0; idx < size; idx++) {
			inaJoinField = inaJoinFields.getStructureAt(idx);
			dimension.addJoinFieldByString(inaJoinField
					.getStringByKey("JoinFieldName"), inaJoinField
					.getStringByKey("JoinFieldNameInReferencedData"));
		}
		inaFieldMappings = inaStructure.getListByKey("FieldMappings");
		size = inaFieldMappings.size();
		for (idx = 0; idx < size; idx++) {
			inaFieldMapping = inaFieldMappings.getStructureAt(idx);
			dimension.addFieldMappingByString(inaFieldMapping
					.getStringByKey("FieldName"), inaFieldMapping
					.getStringByKey("FieldNameInReferencedData"));
			if (importer.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
				if (inaFieldMapping
						.getStringByKey("CalculatedDimensionFieldValueType") !== null) {
					fieldByName = dimension.getFieldByName(inaFieldMapping
							.getStringByKey("FieldName"));
					fieldByName
							.setValueType(oFF.QInAConverter
									.lookupValueType(inaFieldMapping
											.getStringByKey("CalculatedDimensionFieldValueType")));
				}
			}
		}
		oFF.QInADimension.importFieldsLayout(importer, inaStructure, dimension,
				context);
		importer.importTotals(inaStructure, dimension
				.getResultStructureControllerBase(), context);
		return dimension;
	};
	oFF.QInACalculatedDimension.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var dimension = modelComponent;
		var type;
		var topEntries;
		var skipEntries;
		var inaDataSource;
		var inaJoinFields;
		var joinFields;
		var size;
		var i;
		var fieldNamePair;
		var inaJoinField;
		var inaFieldMappings;
		var fieldMappings;
		var fieldMapping;
		var inaFieldMapping;
		var localFieldName;
		var inaValueType;
		inaStructure.putString("Name", dimension.getName());
		type = dimension.getAxisType();
		inaStructure.putString("Axis", oFF.QInAConverter
				.lookupAxisTypeInA(type));
		topEntries = dimension.getTopEntries();
		if (topEntries > 0) {
			inaStructure.putInteger("Top", topEntries);
		}
		skipEntries = dimension.getSkipEntries();
		if (skipEntries > 0) {
			inaStructure.putInteger("Skip", skipEntries);
		}
		inaDataSource = inaStructure.putNewStructure("DataSource");
		inaDataSource.putString("ObjectName", dimension.getPreQueryName());
		inaDataSource.putString("Type", "Query");
		inaStructure.putString("JoinType", dimension.getJoinType().getName());
		inaJoinFields = inaStructure.putNewList("JoinFields");
		joinFields = dimension.getJoinFields();
		size = joinFields.size();
		for (i = 0; i < size; i++) {
			fieldNamePair = joinFields.get(i);
			inaJoinField = inaJoinFields.addNewStructure();
			inaJoinField.putString("JoinFieldName", fieldNamePair
					.getLocaleFieldName());
			inaJoinField.putString("JoinFieldNameInReferencedData",
					fieldNamePair.getReferencedFieldName());
		}
		inaFieldMappings = inaStructure.putNewList("FieldMappings");
		fieldMappings = dimension.getFieldMappings();
		size = fieldMappings.size();
		for (i = 0; i < size; i++) {
			fieldMapping = fieldMappings.get(i);
			inaFieldMapping = inaFieldMappings.addNewStructure();
			inaFieldMapping.putString("FieldName", fieldMapping
					.getLocaleFieldName());
			inaFieldMapping.putString("FieldNameInReferencedData", fieldMapping
					.getReferencedFieldName());
			if (exporter.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
				localFieldName = fieldMapping.getLocaleFieldName();
				if (dimension.getFieldByName(localFieldName).getValueType() !== oFF.XValueType.STRING) {
					inaValueType = oFF.QInAConverter
							.lookupValueTypeInA(dimension.getFieldByName(
									localFieldName).getValueType());
					inaFieldMapping.putString(
							"CalculatedDimensionFieldValueType", inaValueType);
				}
			}
		}
		oFF.QInADimension.exportFieldLayout(exporter, inaStructure, dimension);
		exporter.exportTotals(dimension, inaStructure);
		return inaStructure;
	};
	oFF.QInAFilterDynamic = function() {
	};
	oFF.QInAFilterDynamic.prototype = new oFF.QInAFilter();
	oFF.QInAFilterDynamic.prototype.getComponentType = function() {
		return oFF.OlapComponentType.FILTER_DYNAMIC;
	};
	oFF.QInAFilterDynamic.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var inaFilter = inaStructure.getStructureByKey("DynamicFilter");
		var filter;
		var filterExpression;
		if (oFF.isNull(inaFilter)) {
			inaFilter = inaStructure.getStructureByKey("Filter");
		}
		filter = parentComponent;
		filterExpression = null;
		if (oFF.notNull(filter)) {
			filterExpression = filter.getDynamicFilter();
			filterExpression.setComplexRoot(null);
			if (filterExpression.supportsCellValueOperands()) {
				filterExpression.setIsSuppressingNulls(false);
			}
			filter.resetEffectiveFilter();
		}
		if (oFF.isNull(inaFilter)) {
			return null;
		}
		filterExpression = importer.importFilterExpression(filterExpression,
				inaFilter, filter, context);
		if (oFF.notNull(filter) && oFF.notNull(filterExpression)) {
			filter.setDynamicFilter(filterExpression);
		}
		return filterExpression;
	};
	oFF.QInAFilterDynamic.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var filter = modelComponent;
		var filterExpressionState = filter.getDynamicFilter();
		var queryModel = modelComponent.getQueryModel();
		var isAbap = exporter.isAbap(queryModel);
		var inaName;
		var useOnlyInternalFilter;
		var inaSelectionState;
		var tmpFilter;
		var exportedFilter;
		if (isAbap) {
			inaName = "Filter";
		} else {
			inaName = "DynamicFilter";
		}
		useOnlyInternalFilter = oFF
				.notNull(exporter.variableProcessingDirective)
				&& queryModel
						.supportsAnalyticCapabilityActive(oFF.InACapabilities.VARIABLE_MASKING);
		if (useOnlyInternalFilter) {
			inaSelectionState = exporter
					.exportFilterExpression(filterExpressionState);
			if (oFF.notNull(inaSelectionState)) {
				inaStructure.put(inaName, inaSelectionState);
			}
		} else {
			tmpFilter = null;
			if (filter.hasTmpFilter()) {
				tmpFilter = filter.getTmpFilter();
			}
			exportedFilter = this.exportFilter(exporter, filter,
					filterExpressionState, filter.getLayeredFilters(),
					tmpFilter);
			if (oFF.notNull(exportedFilter)) {
				inaStructure.put(inaName, exportedFilter);
			}
		}
		return inaStructure;
	};
	oFF.QInAFilterVisibility = function() {
	};
	oFF.QInAFilterVisibility.prototype = new oFF.QInAFilter();
	oFF.QInAFilterVisibility.prototype.getComponentType = function() {
		return oFF.OlapComponentType.FILTER_VISIBILITY;
	};
	oFF.QInAFilterVisibility.prototype.getTagName = function() {
		return "VisibilityFilter";
	};
	oFF.QInAFilterVisibility.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var filter = parentComponent;
		var filterExpression;
		var selectionContainerVisibility;
		if (oFF.notNull(filter)) {
			filterExpression = filter.getVisibilityFilter();
			filterExpression.setComplexRoot(null);
			if (filterExpression.supportsCellValueOperands()) {
				filterExpression.setIsSuppressingNulls(false);
			}
		}
		if (oFF.isNull(inaStructure)) {
			return null;
		}
		selectionContainerVisibility = importer.importFilterExpression(null,
				inaStructure, filter, context);
		if (oFF.notNull(filter) && oFF.notNull(selectionContainerVisibility)) {
			filter.setVisibilityFilter(selectionContainerVisibility);
		}
		return selectionContainerVisibility;
	};
	oFF.QInAFilterVisibility.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var filter = modelComponent;
		var tmpVisibilityFilter;
		if (filter.supportsVisibilityFilter()) {
			tmpVisibilityFilter = null;
			if (filter.hasTmpVisibilityFilter()) {
				tmpVisibilityFilter = filter.getTmpVisibilityFilter();
			}
			return this.exportFilter(exporter, filter, filter
					.getVisibilityFilter(), filter
					.getLayeredVisibilityFilters(), tmpVisibilityFilter);
		}
		return null;
	};
	oFF.QInAFilterVisibility.prototype.isValidFilterExpression = function(
			filterExpressionState) {
		return oFF.notNull(filterExpressionState);
	};
	oFF.QInAVarHierNode = function() {
	};
	oFF.QInAVarHierNode.prototype = new oFF.QInAVarDimMember();
	oFF.QInAVarHierNode.prototype.getComponentType = function() {
		return oFF.VariableType.HIERARCHY_NODE_VARIABLE;
	};
	oFF.QInAVarHierNode.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var nodeVariable = modelComponent;
		var inaNodeValues = inaStructure.getStructureByKey("Values");
		var selectionContainerNode = oFF.QFilterExpression
				._createByApplication(context, nodeVariable);
		importer.importFilterExpression(selectionContainerNode, inaNodeValues,
				nodeVariable, context);
		nodeVariable.setFilter(selectionContainerNode);
		return nodeVariable;
	};
	oFF.QInARepoAxis = function() {
	};
	oFF.QInARepoAxis.prototype = new oFF.QInARepository();
	oFF.QInARepoAxis.prototype.getComponentType = function() {
		return oFF.OlapComponentType.AXIS;
	};
	oFF.QInARepoAxis.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var queryModel = context.getQueryModel();
		var axisType;
		var axisTypeValue = inaStructure.getStringByKey("Axis");
		var axisTypeIntValue;
		var axis;
		var valueType;
		var suppressionType;
		var inaLayout;
		var i;
		var dimensionName;
		var dimension;
		if (oFF.notNull(axisTypeValue)) {
			axisType = oFF.QInAConverter.lookupAxisType(axisTypeValue);
		} else {
			axisTypeIntValue = inaStructure.getIntegerByKey("Type");
			axisType = oFF.QInAConverter.lookupAxisTypeInt(axisTypeIntValue);
		}
		axis = queryModel.getAxisBase(axisType);
		if (oFF.notNull(axis)) {
			if (axis.supportsZeroSuppression()) {
				valueType = inaStructure.getIntegerByKeyExt(
						"ZeroSuppressionType", 0);
				suppressionType = oFF.QInAConverter
						.lookupSuppressionType(valueType);
				axis.setZeroSuppressionType(suppressionType);
			}
			inaLayout = inaStructure.getListByKey("Layout");
			if (oFF.notNull(inaLayout)) {
				axis.clear();
				for (i = 0; i < inaLayout.size(); i++) {
					dimensionName = inaLayout.getStringAt(i);
					dimension = queryModel
							.getDimensionByNameInternal(dimensionName);
					axis.add(dimension);
				}
			}
			importer.importTotals(inaStructure, axis
					.getResultStructureControllerBase(), context);
		}
		return axis;
	};
	oFF.QInARepoAxis.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var axis = modelComponent;
		var typeZeroSuppression;
		var inaLayout;
		var i;
		var dimension;
		inaStructure.putString("Axis", oFF.QInAConverter.lookupAxisTypeInA(axis
				.getType()));
		inaStructure.putInteger("Type", oFF.QInAConverter
				.lookupAxisTypeInAInt(axis.getType()));
		typeZeroSuppression = axis.getZeroSuppressionType();
		inaStructure.putInteger("ZeroSuppressionType", oFF.QInAConverter
				.lookupSuppressionTypeInA(typeZeroSuppression));
		inaLayout = inaStructure.putNewList("Layout");
		for (i = 0; i < axis.size(); i++) {
			dimension = axis.getDimensionAt(i);
			inaLayout.addString(dimension.getName());
		}
		exporter
				.exportTotals(axis.getResultStructureController(), inaStructure);
		return inaStructure;
	};
	oFF.QInARepoDimension = function() {
	};
	oFF.QInARepoDimension.prototype = new oFF.QInARepository();
	oFF.QInARepoDimension.importRsAttributeNodes = function(inaDimension,
			dimension) {
		var inaResultSetAttributes = inaDimension
				.getListByKey("ResultSetAttributeNodes");
		var inaRsAttributeFields = inaDimension
				.getListByKey("ResultSetAttributeFields");
		var resultSetAttributes;
		var attributeSize;
		var idxAttribute;
		var attributeName;
		var attribute;
		if (oFF.notNull(inaResultSetAttributes)) {
			resultSetAttributes = dimension.getResultSetAttributes();
			resultSetAttributes.clear();
			attributeSize = inaResultSetAttributes.size();
			for (idxAttribute = 0; idxAttribute < attributeSize; idxAttribute++) {
				attributeName = inaResultSetAttributes
						.getStringAt(idxAttribute);
				attribute = dimension.getAttributeByName(attributeName);
				if (oFF.notNull(attribute)) {
					resultSetAttributes.add(attribute);
					oFF.QInARepoDimension.importRsFieldsForAttribute(attribute,
							inaRsAttributeFields, idxAttribute);
				}
			}
		}
	};
	oFF.QInARepoDimension.importRsFieldsForAttribute = function(attribute,
			inaRsAttributeFields, idxAttribute) {
		var inaRsAttributeFieldNames;
		var attibuteRsFields;
		var rsSize;
		var i;
		if (oFF.isNull(inaRsAttributeFields)
				|| inaRsAttributeFields.size() <= idxAttribute) {
			return;
		}
		inaRsAttributeFieldNames = inaRsAttributeFields.getListAt(idxAttribute);
		attibuteRsFields = attribute.getResultSetFields();
		attibuteRsFields.clear();
		rsSize = inaRsAttributeFieldNames.size();
		for (i = 0; i < rsSize; i++) {
			attibuteRsFields.add(attribute
					.getFieldByName(inaRsAttributeFieldNames.getStringAt(i)));
		}
	};
	oFF.QInARepoDimension.importRsFields = function(inaDimension, dimension) {
		var inaResultSetFields = inaDimension.getListByKey("ResultSetFields");
		var resultSetFields;
		var fieldSize;
		var idxField;
		var fieldName;
		var field;
		if (oFF.notNull(inaResultSetFields)) {
			resultSetFields = dimension.getResultSetFields();
			resultSetFields.clear();
			fieldSize = inaResultSetFields.size();
			for (idxField = 0; idxField < fieldSize; idxField++) {
				fieldName = inaResultSetFields.getStringAt(idxField);
				field = dimension.getFieldByName(fieldName);
				if (oFF.notNull(field)) {
					resultSetFields.add(field);
				}
			}
		}
	};
	oFF.QInARepoDimension.importFieldsLayout = function(importer, inaDimension,
			dimension, context) {
		var inaAllFields = inaDimension.getListByKey("FieldSettings");
		var inaAllFieldSize;
		var p1;
		var inaAllAttributes;
		var inaAllAttributesSize;
		var p2;
		var fieldLayoutType;
		if (oFF.notNull(inaAllFields)) {
			inaAllFieldSize = inaAllFields.size();
			for (p1 = 0; p1 < inaAllFieldSize; p1++) {
				importer.importComponent(oFF.OlapComponentType.FIELD,
						inaAllFields.getStructureAt(p1), null, dimension,
						context);
			}
		}
		inaAllAttributes = inaDimension.getListByKey("AttributeSettings");
		if (oFF.notNull(inaAllAttributes)) {
			inaAllAttributesSize = inaAllAttributes.size();
			for (p2 = 0; p2 < inaAllAttributesSize; p2++) {
				importer.importAttribute(inaAllAttributes.getStructureAt(p2),
						dimension, context);
			}
		}
		fieldLayoutType = oFF.QInAConverter.lookupFieldLayoutType(inaDimension
				.getStringByKey("FieldLayoutType"));
		oFF.QInARepoDimension.importRsFields(inaDimension, dimension);
		oFF.QInARepoDimension.importRsAttributeNodes(inaDimension, dimension);
		dimension.setFieldLayoutType(fieldLayoutType);
	};
	oFF.QInARepoDimension.exportFieldLayout = function(exporter, inaDimension,
			dimension) {
		var fieldLayoutType = dimension.getFieldLayoutType();
		var inaAllFields;
		var resultSetFieldsAtDim;
		var inaResultSetFields;
		var resultFieldSize;
		var idxResultField;
		var exportAttribtueRsFields;
		var inaResultSetAttributes;
		var inaAttributeRsFields;
		var resultSetAttributesAtDim;
		var resultAttributeSize;
		var idxResultAttribute;
		var rsAttribute;
		var attributeFields;
		var attributeRsFields;
		var attRsFields;
		var i;
		inaDimension.putString("FieldLayoutType", oFF.QInAConverter
				.lookupFieldLayoutTypeInA(fieldLayoutType));
		inaAllFields = inaDimension.putNewList("FieldSettings");
		oFF.QInARepoDimension.exportListOfFields(dimension.getFields(),
				inaAllFields, exporter);
		resultSetFieldsAtDim = dimension.getResultSetFields();
		inaResultSetFields = inaDimension.putNewList("ResultSetFields");
		resultFieldSize = resultSetFieldsAtDim.size();
		for (idxResultField = 0; idxResultField < resultFieldSize; idxResultField++) {
			inaResultSetFields.addString(resultSetFieldsAtDim.get(
					idxResultField).getName());
		}
		exportAttribtueRsFields = exporter.getApplication().getVersion() >= oFF.XVersion.V92_REPO_RS_EXPORT;
		inaResultSetAttributes = inaDimension
				.putNewList("ResultSetAttributeNodes");
		inaAttributeRsFields = inaDimension
				.putNewList("ResultSetAttributeFields");
		resultSetAttributesAtDim = dimension.getResultSetAttributes();
		resultAttributeSize = resultSetAttributesAtDim.size();
		for (idxResultAttribute = 0; idxResultAttribute < resultAttributeSize; idxResultAttribute++) {
			rsAttribute = resultSetAttributesAtDim.get(idxResultAttribute);
			inaResultSetAttributes.addString(rsAttribute.getName());
			if (exportAttribtueRsFields) {
				attributeFields = inaAttributeRsFields.addNewList();
				attributeRsFields = rsAttribute.getResultSetFields();
				attRsFields = attributeRsFields.size();
				for (i = 0; i < attRsFields; i++) {
					attributeFields.addString(attributeRsFields.get(i)
							.getName());
				}
			}
		}
	};
	oFF.QInARepoDimension.exportListOfFields = function(fields, inaFields,
			exporter) {
		var fieldsSize = fields.size();
		var i;
		var field;
		for (i = 0; i < fieldsSize; i++) {
			field = fields.get(i);
			if (field.getTextTransformation() === null) {
				continue;
			}
			inaFields.add(exporter.exportComponent(oFF.OlapComponentType.FIELD,
					field, null, oFF.QImExFlag.DEFAULT_ALL));
		}
	};
	oFF.QInARepoDimension.prototype.getComponentType = function() {
		return oFF.OlapComponentType.ABSTRACT_DIMENSION;
	};
	oFF.QInARepoDimension.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var queryModel = context.getQueryModel();
		var dimension = modelComponent;
		var dimName;
		var skipMetadataValidationOnRepoImport;
		var sortingManager;
		var inaSortOrder;
		var sortOrder;
		var skipEntries;
		var topEntries;
		var inaReadMode;
		var readMode;
		if (oFF.isNull(dimension)) {
			dimName = inaStructure.getStringByKey("Name");
			if (oFF.isNull(queryModel)) {
				return null;
			}
			dimension = queryModel.getDimensionByNameInternal(dimName);
			skipMetadataValidationOnRepoImport = inaStructure
					.getBooleanByKeyExt("SkipMetadataValidationOnRepoImport",
							false);
			if (oFF.isNull(dimension) && skipMetadataValidationOnRepoImport) {
				dimension = this.addNewDimensionWithDummyMetadata(importer,
						context, queryModel, dimName);
			}
			if (oFF.isNull(dimension)) {
				importer
						.addWarning(
								oFF.ErrorCodes.INVALID_DIMENSION,
								oFF.XStringUtils
										.concatenate3("Dimension '", dimName,
												"' not found in QueryModel! Can't deserialize dimension."));
				return null;
			}
		}
		importer.importMembers(inaStructure, dimension, context);
		oFF.QInARepoDimension.importFieldsLayout(importer, inaStructure,
				dimension, context);
		importer.importHierarchy(dimension, inaStructure);
		if (!queryModel.supportsExtendedSort()) {
			sortingManager = queryModel.getSortingManager();
			if (sortingManager.supportsDimensionSorting(dimension,
					oFF.SortType.MEMBER_KEY)) {
				inaSortOrder = inaStructure
						.getIntegerByKeyExt(
								"SortOrder",
								oFF.QInAConverter
										.lookupSortDirectionInA(oFF.XSortDirection.DEFAULT_VALUE));
				sortOrder = oFF.QInAConverter.lookupSortDirection(inaSortOrder);
				dimension.getResultSetSorting().setDirection(sortOrder);
			}
		}
		if (importer.supportsCummulative && dimension.supportsCumulative()) {
			dimension.setIsCumulative(inaStructure.getBooleanByKeyExt(
					"IsCummulative", false));
		}
		skipEntries = inaStructure.getIntegerByKeyExt("Skip", 0);
		dimension.setSkipEntries(skipEntries);
		topEntries = inaStructure.getIntegerByKeyExt("Top", 0);
		dimension.setTopEntries(topEntries);
		inaReadMode = inaStructure.getStringByKey("ReadMode");
		if (oFF.notNull(inaReadMode)) {
			readMode = oFF.QInAConverter.lookupReadMode(inaReadMode);
			dimension
					.setReadModeGraceful(oFF.QContextType.RESULT_SET, readMode);
		}
		importer.importTotals(inaStructure, dimension
				.getResultStructureControllerBase(), context);
		this.importAlternativeFieldValues(inaStructure, dimension);
		return dimension;
	};
	oFF.QInARepoDimension.prototype.addNewDimensionWithDummyMetadata = function(
			importer, context, queryModel, dimName) {
		var providerType = context.getQueryManager().getProviderType()
				.getName();
		var dataSource = context.getDataSource();
		var systemName = dataSource.getSystemName();
		var queryName = dataSource.getFullQualifiedName();
		var dimensionMetadata = oFF.QDimensionMetadata.create(systemName,
				queryName, dimName, providerType, "");
		var olapEnvironment;
		var dimension;
		dimensionMetadata
				.addSupportedFieldLayoutType(oFF.FieldLayoutType.ATTRIBUTE_BASED);
		dimensionMetadata.addSupportedAxis(oFF.AxisType.FREE);
		dimensionMetadata.addSupportedAxis(oFF.AxisType.ROWS);
		dimensionMetadata.addSupportedAxis(oFF.AxisType.COLUMNS);
		dimensionMetadata.setDimensionType(oFF.DimensionType.DIMENSION);
		olapEnvironment = importer.getApplication().getOlapEnvironment();
		olapEnvironment.setDimensionMetadata(dimensionMetadata);
		dimension = oFF.QDimension._create(context, queryModel
				.getDimensionManagerBase());
		dimension.setName(dimName);
		dimension.setText(dimName);
		dimension.setMetadata(dimensionMetadata);
		dimension.setSkipMetadataValidationOnRepoImport(true);
		queryModel.addDimension(dimension);
		return dimension;
	};
	oFF.QInARepoDimension.prototype.importAlternativeFieldValues = function(
			inaStructure, dimension) {
		var alternativeFieldValuesList = inaStructure
				.getListByKey("AlternativeFieldValues");
		var size;
		var i;
		var currentElement;
		var currentStructure;
		var strValueType;
		var valueType;
		var valueAsString;
		var value;
		var hierarchyKey;
		var memberKey;
		var fieldName;
		var language;
		if (oFF.notNull(alternativeFieldValuesList)) {
			size = alternativeFieldValuesList.size();
			for (i = 0; i < size; i++) {
				currentElement = alternativeFieldValuesList.get(i);
				if (currentElement.isStructure()) {
					currentStructure = currentElement;
					strValueType = currentStructure.getStringByKey("ValueType");
					valueType = oFF.QInAConverter.lookupValueType(strValueType);
					valueAsString = currentStructure.getStringByKey("Value");
					value = null;
					if (valueType === oFF.XValueType.INTEGER) {
						value = oFF.XIntegerValue.create(oFF.XInteger
								.convertFromStringWithRadix(valueAsString, 10));
					} else {
						if (valueType === oFF.XValueType.LONG) {
							value = oFF.XLongValue.create(oFF.XLong
									.convertFromString(valueAsString));
						} else {
							if (valueType === oFF.XValueType.DOUBLE) {
								value = oFF.XDoubleValue.create(oFF.XDouble
										.convertFromString(valueAsString));
							} else {
								if (valueType === oFF.XValueType.STRING) {
									value = oFF.XStringValue
											.create(valueAsString);
								} else {
									if (valueType === oFF.XValueType.DATE) {
										value = oFF.XDate
												.createDateFromIsoFormat(valueAsString);
									} else {
										if (valueType === oFF.XValueType.DATE_TIME) {
											value = oFF.XDateTime
													.createDateTimeFromIsoFormat(valueAsString);
										}
									}
								}
							}
						}
					}
					if (oFF.notNull(value)) {
						hierarchyKey = currentStructure
								.getBooleanByKey("HierarchyKey");
						memberKey = currentStructure
								.getStringByKey("MemberKey");
						fieldName = currentStructure
								.getStringByKey("FieldName");
						language = currentStructure.getStringByKey("Language");
						dimension.setAlternativeFieldValue(hierarchyKey,
								memberKey, fieldName, value, language);
					}
				}
			}
		}
	};
	oFF.QInARepoDimension.prototype.exportAlternativeFieldValues = function(
			inaStructure, dimension) {
		this.exportAlternativeFieldValuesForKeyType(inaStructure, dimension,
				dimension.getAlternativeFieldValueMemberKeys(false), false);
		this.exportAlternativeFieldValuesForKeyType(inaStructure, dimension,
				dimension.getAlternativeFieldValueMemberKeys(true), true);
	};
	oFF.QInARepoDimension.prototype.exportAlternativeFieldValuesForKeyType = function(
			inaStructure, dimension, alternativeFieldValueMemberKeys,
			hierarchyKey) {
		var alternativeFieldValuesList;
		var sizeKeys;
		var i;
		var memberKey;
		var alternativeFieldValueFields;
		var sizeFields;
		var j;
		var fieldName;
		var alternativeFieldValueLanguages;
		var sizeLanguages;
		var k;
		var language;
		var alternativeFieldValue;
		var fieldTransformationStruct;
		if (oFF.notNull(alternativeFieldValueMemberKeys)) {
			alternativeFieldValuesList = oFF.PrFactory.createList();
			sizeKeys = alternativeFieldValueMemberKeys.size();
			for (i = 0; i < sizeKeys; i++) {
				memberKey = alternativeFieldValueMemberKeys.get(i);
				alternativeFieldValueFields = dimension
						.getAlternativeFieldValueFields(hierarchyKey, memberKey);
				if (oFF.notNull(alternativeFieldValueFields)) {
					sizeFields = alternativeFieldValueFields.size();
					for (j = 0; j < sizeFields; j++) {
						fieldName = alternativeFieldValueFields.get(j);
						alternativeFieldValueLanguages = dimension
								.getAlternativeFieldValueLanguages(
										hierarchyKey, memberKey, fieldName);
						if (oFF.notNull(alternativeFieldValueLanguages)) {
							sizeLanguages = alternativeFieldValueLanguages
									.size();
							for (k = 0; k < sizeLanguages; k++) {
								language = alternativeFieldValueLanguages
										.get(k);
								alternativeFieldValue = dimension
										.getAlternativeFieldValue(hierarchyKey,
												memberKey, fieldName, language);
								if (oFF.notNull(alternativeFieldValue)) {
									fieldTransformationStruct = alternativeFieldValuesList
											.addNewStructure();
									fieldTransformationStruct.putBoolean(
											"HierarchyKey", hierarchyKey);
									fieldTransformationStruct.putString(
											"MemberKey", memberKey);
									fieldTransformationStruct.putString(
											"FieldName", fieldName);
									fieldTransformationStruct.putString(
											"Language", language);
									fieldTransformationStruct
											.putString(
													"ValueType",
													oFF.QInAConverter
															.lookupValueTypeInA(alternativeFieldValue
																	.getValueType()));
									fieldTransformationStruct.putString(
											"Value", alternativeFieldValue
													.getStringRepresentation());
								}
							}
						}
					}
				}
			}
			if (alternativeFieldValuesList.size() > 0) {
				inaStructure.put("AlternativeFieldValues",
						alternativeFieldValuesList);
			}
		}
	};
	oFF.QInARepoDimension.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var dimension = modelComponent;
		var readMode;
		var skipEntries;
		var topEntries;
		inaStructure.putString("Name", dimension.getName());
		readMode = dimension.getReadMode(oFF.QContextType.RESULT_SET);
		oFF.QInAExportUtil.setNameIfNotNull(inaStructure, "ReadMode", readMode);
		inaStructure.putString("Axis", oFF.QInAConverter
				.lookupAxisTypeInA(dimension.getAxisType()));
		skipEntries = dimension.getSkipEntries();
		if (skipEntries > 0) {
			inaStructure.putInteger("Skip", skipEntries);
		}
		topEntries = dimension.getTopEntries();
		if (topEntries > 0) {
			inaStructure.putInteger("Top", topEntries);
		}
		if (dimension.supportsCumulative()) {
			inaStructure.putBoolean("IsCummulative", dimension.isCumulative());
		}
		exporter.exportHierarchy(dimension, inaStructure);
		if (dimension.supportsTotals()) {
			exporter.exportTotals(dimension, inaStructure);
		}
		if (dimension.getStructureLayout() !== null) {
			exporter.exportMembers(dimension, inaStructure);
		}
		oFF.QInARepoDimension.exportFieldLayout(exporter, inaStructure,
				dimension);
		this.exportAlternativeFieldValues(inaStructure, dimension);
		if (dimension.getSkipMetadataValidationOnRepoImport()) {
			inaStructure.putBoolean("SkipMetadataValidationOnRepoImport", true);
		}
		return inaStructure;
	};
	oFF.QInARepoField = function() {
	};
	oFF.QInARepoField.prototype = new oFF.QInARepository();
	oFF.QInARepoField.prototype.getComponentType = function() {
		return oFF.OlapComponentType.FIELD;
	};
	oFF.QInARepoField.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var field = modelComponent;
		var name;
		var dimension;
		var inaTextTransformation;
		var textTransformation;
		if (oFF.isNull(field)) {
			name = inaStructure.getStringByKey("Name");
			dimension = parentComponent;
			field = dimension.getFieldByName(name);
			if (oFF.isNull(field)) {
				return null;
			}
		}
		inaTextTransformation = inaStructure
				.getStringByKey("TextTransformation");
		if (oFF.notNull(inaTextTransformation)) {
			textTransformation = oFF.QInAConverter
					.lookupTextTransformation(inaTextTransformation);
			field.setTextTransformation(textTransformation);
		}
		field.setDisplayFormat(inaStructure.getStringByKey("DisplayFormat"));
		return field;
	};
	oFF.QInARepoField.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var field = modelComponent;
		var textTransformationType;
		var inaTextTransform;
		inaStructure.putString("Name", field.getName());
		inaStructure
				.putStringNotNull("DisplayFormat", field.getDisplayFormat());
		textTransformationType = field.getTextTransformation();
		if (oFF.notNull(textTransformationType)) {
			inaTextTransform = oFF.QInAConverter
					.lookupTextTransformationInA(textTransformationType);
			inaStructure.putString("TextTransformation", inaTextTransform);
		}
		return inaStructure;
	};
	oFF.QInARepoFilterAlgebra = function() {
	};
	oFF.QInARepoFilterAlgebra.prototype = new oFF.QInARepository();
	oFF.QInARepoFilterAlgebra.prototype.getComponentType = function() {
		return oFF.FilterComponentType.BOOLEAN_ALGEBRA;
	};
	oFF.QInARepoFilterAlgebra.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var filterExpression = null;
		var parentFilterElement;
		var code;
		var filterAlgebra;
		var uniqueId;
		var inaSubSelections;
		var size;
		var i;
		var subSelection;
		var child;
		if (oFF.notNull(parentComponent)) {
			parentFilterElement = parentComponent;
			filterExpression = parentFilterElement.getFilterExpression();
		}
		code = inaStructure.getStringByKey("Code");
		if (oFF.XString.isEqual(code, "And")) {
			filterAlgebra = oFF.QFilterAnd._create(context, filterExpression);
		} else {
			if (oFF.XString.isEqual(code, "Not")) {
				filterAlgebra = oFF.QFilterNot._create(context,
						filterExpression);
			} else {
				filterAlgebra = oFF.QFilterOr
						._create(context, filterExpression);
			}
		}
		uniqueId = inaStructure.getStringByKey("Id");
		filterAlgebra.setUniqueId(uniqueId);
		inaSubSelections = inaStructure.getListByKey("SubSelections");
		if (oFF.notNull(inaSubSelections)) {
			size = inaSubSelections.size();
			for (i = 0; i < size; i++) {
				subSelection = inaSubSelections.getStructureAt(i);
				child = importer.importComponent(null, subSelection, null,
						filterAlgebra, context);
				if (oFF.notNull(child)) {
					filterAlgebra.add(child);
				}
			}
		}
		return filterAlgebra;
	};
	oFF.QInARepoFilterAlgebra.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var type = modelComponent.getComponentType();
		var qLogicalContainer = modelComponent;
		var inaSubSelections;
		var size;
		var i;
		var inaChildElement;
		if (type.isTypeOf(oFF.FilterComponentType.AND)) {
			inaStructure.putString("Code", "And");
			inaStructure.putString("Id", qLogicalContainer.getUniqueId());
		} else {
			if (type.isTypeOf(oFF.FilterComponentType.OR)) {
				inaStructure.putString("Code", "Or");
				inaStructure.putString("Id", qLogicalContainer.getUniqueId());
			} else {
				if (type.isTypeOf(oFF.FilterComponentType.NOT)) {
					inaStructure.putString("Code", "Not");
					inaStructure.putString("Id", qLogicalContainer
							.getUniqueId());
				}
			}
		}
		inaSubSelections = inaStructure.putNewList("SubSelections");
		size = qLogicalContainer.size();
		for (i = 0; i < size; i++) {
			inaChildElement = exporter.exportComponent(null, qLogicalContainer
					.get(i), null, flags);
			if (oFF.notNull(inaChildElement)) {
				inaSubSelections.add(inaChildElement);
			}
		}
		return inaStructure;
	};
	oFF.QInARepoFilterAll = function() {
	};
	oFF.QInARepoFilterAll.prototype = new oFF.QInARepository();
	oFF.QInARepoFilterAll.prototype.getComponentType = function() {
		return oFF.OlapComponentType.SELECTOR;
	};
	oFF.QInARepoFilterAll.prototype.getTagName = function() {
		return "FilterRepo";
	};
	oFF.QInARepoFilterAll.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var filter = modelComponent;
		var selectionStateContainer = filter.getDynamicFilter();
		var inaFilterExpression = inaStructure
				.getStructureByKey("DynamicFilter");
		var selectionVisibilityContainer;
		var inaVisibilityExpression;
		var selectionSpaceContainer;
		var inaSpaceExpression;
		var valueHelpContainer;
		var inaValueHelpExpression;
		importer.importFilterExpression(selectionStateContainer,
				inaFilterExpression, filter, context);
		selectionVisibilityContainer = filter.getVisibilityFilter();
		inaVisibilityExpression = inaStructure
				.getStructureByKey("VisibilityFilter");
		importer.importFilterExpression(selectionVisibilityContainer,
				inaVisibilityExpression, filter, context);
		selectionSpaceContainer = filter.getFixedFilter();
		inaSpaceExpression = inaStructure.getStructureByKey("FixedFilter");
		importer.importFilterExpression(selectionSpaceContainer,
				inaSpaceExpression, filter, context);
		valueHelpContainer = filter.getValuehelpFilter();
		inaValueHelpExpression = inaStructure
				.getStructureByKey("ValueHelpFilter");
		importer.importFilterExpression(valueHelpContainer,
				inaValueHelpExpression, filter, context);
		return filter;
	};
	oFF.QInARepoFilterAll.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var filter = modelComponent;
		var selectionStateContainer = filter.getDynamicFilter();
		var inaState = exporter.exportFilterExpression(selectionStateContainer);
		var selectionVisibilityContainer;
		var inaVisibility;
		var selectionSpaceContainer;
		var inaSpace;
		var valueHelpContainer;
		var inaValueHelp;
		inaStructure.put("DynamicFilter", inaState);
		selectionVisibilityContainer = filter.getVisibilityFilter();
		inaVisibility = exporter
				.exportFilterExpression(selectionVisibilityContainer);
		inaStructure.put("VisibilityFilter", inaVisibility);
		selectionSpaceContainer = filter.getFixedFilter();
		inaSpace = exporter.exportFilterExpression(selectionSpaceContainer);
		inaStructure.put("FixedFilter", inaSpace);
		valueHelpContainer = filter.getValuehelpFilter();
		inaValueHelp = exporter.exportFilterExpression(valueHelpContainer);
		inaStructure.put("ValueHelpFilter", inaValueHelp);
		return inaStructure;
	};
	oFF.QInARepoFilterCartesianList = function() {
	};
	oFF.QInARepoFilterCartesianList.prototype = new oFF.QInARepository();
	oFF.QInARepoFilterCartesianList.prototype.getComponentType = function() {
		return oFF.FilterComponentType.CARTESIAN_LIST;
	};
	oFF.QInARepoFilterCartesianList.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var filterExpression = null;
		var parentFilterElement;
		var cartesianList;
		var fieldName;
		var fieldAccessor;
		var field;
		var uniqueId;
		var hierarchyName;
		var isConvertToFlatFilter;
		var inaElements;
		var size;
		var i;
		var inaSelection;
		var child;
		var filterElement;
		if (oFF.notNull(parentComponent)) {
			parentFilterElement = parentComponent;
			filterExpression = parentFilterElement.getFilterExpression();
		}
		cartesianList = modelComponent;
		if (oFF.isNull(cartesianList)) {
			cartesianList = oFF.QFactory
					.newFilterCartesianList(filterExpression);
		}
		fieldName = inaStructure.getStringByKey("FieldName");
		if (oFF.notNull(fieldName) && oFF.notNull(context)) {
			fieldAccessor = context.getFieldAccessorSingle();
			field = fieldAccessor.getFieldByName(fieldName);
			if (oFF.isNull(field)) {
				return null;
			}
			if (field.getDimension().isEnforcedDynamicValue()
					&& context.getQueryManager()
							.isSuppressExitVariableValuesInRepoMode()) {
				return null;
			}
			cartesianList.setField(field);
		}
		uniqueId = inaStructure.getStringByKey("Id");
		cartesianList.setUniqueId(uniqueId);
		hierarchyName = inaStructure.getStringByKey("HierarchyName");
		cartesianList.setHierarchyName(hierarchyName);
		isConvertToFlatFilter = inaStructure.getBooleanByKeyExt(
				"ConvertToFlatSelection", false);
		cartesianList.setConvertToFlatFilter(isConvertToFlatFilter);
		inaElements = inaStructure.getListByKey("Elements");
		cartesianList.clear();
		if (oFF.notNull(inaElements)) {
			size = inaElements.size();
			for (i = 0; i < size; i++) {
				inaSelection = inaElements.getStructureAt(i);
				child = importer.importComponent(null, inaSelection, null,
						cartesianList, context);
				filterElement = child;
				cartesianList.add(filterElement);
			}
		}
		return cartesianList;
	};
	oFF.QInARepoFilterCartesianList.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var cartesianList = modelComponent;
		var field = cartesianList.getField();
		var hierarchyName;
		var isConvertToFlatFilter;
		var inaElements;
		var size;
		var j;
		var cartesianElement;
		var inaInnerElement;
		if (oFF.notNull(field)) {
			if (field.getDimension().isEnforcedDynamicValue()
					&& cartesianList.getQueryManager()
							.isSuppressExitVariableValuesInRepoMode()) {
				return null;
			}
			inaStructure.putString("FieldName", field.getName());
		}
		inaStructure.putString("Id", cartesianList.getUniqueId());
		hierarchyName = cartesianList.getHierarchyName();
		if (oFF.notNull(hierarchyName)) {
			inaStructure.putString("HierarchyName", hierarchyName);
		}
		isConvertToFlatFilter = cartesianList.isConvertToFlatFilter();
		inaElements = inaStructure.putNewList("Elements");
		size = cartesianList.size();
		for (j = 0; j < size; j++) {
			cartesianElement = cartesianList.getOp(j);
			inaInnerElement = exporter.exportComponent(null, cartesianElement,
					null, flags);
			inaElements.add(inaInnerElement);
			isConvertToFlatFilter = isConvertToFlatFilter
					|| cartesianElement.isConvertToFlatFilter();
		}
		inaStructure
				.putBoolean("ConvertToFlatSelection", isConvertToFlatFilter);
		return inaStructure;
	};
	oFF.QInARepoFilterCartesianProduct = function() {
	};
	oFF.QInARepoFilterCartesianProduct.prototype = new oFF.QInARepository();
	oFF.QInARepoFilterCartesianProduct.prototype.getComponentType = function() {
		return oFF.FilterComponentType.CARTESIAN_PRODUCT;
	};
	oFF.QInARepoFilterCartesianProduct.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var filterExpression = null;
		var parentFilterElement;
		var cartesianProduct;
		var uniqueId;
		var inaElements;
		var i;
		var inaSelection;
		var child;
		var msl;
		if (oFF.notNull(parentComponent)) {
			parentFilterElement = parentComponent;
			filterExpression = parentFilterElement.getFilterExpression();
		}
		cartesianProduct = modelComponent;
		if (oFF.isNull(cartesianProduct)) {
			cartesianProduct = oFF.QFactory
					.newFilterCartesianProduct(filterExpression);
		}
		cartesianProduct.clear();
		uniqueId = inaStructure.getStringByKey("Id");
		cartesianProduct.setUniqueId(uniqueId);
		inaElements = inaStructure.getListByKey("Elements");
		if (oFF.notNull(inaElements)) {
			for (i = 0; i < inaElements.size(); i++) {
				inaSelection = inaElements.getStructureAt(i);
				child = importer.importComponent(null, inaSelection, null,
						cartesianProduct, context);
				msl = child;
				cartesianProduct.add(msl);
			}
		}
		return cartesianProduct;
	};
	oFF.QInARepoFilterCartesianProduct.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var cartesianProduct = modelComponent;
		var inaSubSelections;
		var i;
		var msl;
		var innerElement;
		inaStructure.putString("Id", cartesianProduct.getUniqueId());
		inaSubSelections = inaStructure.putNewList("Elements");
		for (i = 0; i < cartesianProduct.size(); i++) {
			msl = cartesianProduct.getCartesianChild(i);
			innerElement = exporter.exportComponent(null, msl, null, flags);
			if (oFF.notNull(innerElement)) {
				inaSubSelections.add(innerElement);
			}
		}
		return inaStructure;
	};
	oFF.QInARepoFilterCellValueOperand = function() {
	};
	oFF.QInARepoFilterCellValueOperand.prototype = new oFF.QInARepository();
	oFF.QInARepoFilterCellValueOperand.prototype.getComponentType = function() {
		return oFF.OlapComponentType.FILTER_CELL_VALUE_OPERAND;
	};
	oFF.QInARepoFilterCellValueOperand.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var operand = modelComponent;
		var comparison;
		var operator;
		var isExcluding;
		var inaValueList;
		if (oFF.isNull(operand)) {
			operand = oFF.QFilterCellValueOperand._create(context, null, null,
					null, null);
		}
		comparison = inaStructure.getStringByKey("Comparison");
		operator = oFF.QInAConverter.lookupComparison(comparison);
		operand.setComparisonOperator(operator);
		isExcluding = inaStructure.getBooleanByKey("IsExcluding");
		operand.setIsExcluding(isExcluding);
		inaValueList = inaStructure.getListByKey("Values");
		oFF.QInARepoFilterOperation.importValues(importer, inaValueList,
				operand, null, context);
		return operand;
	};
	oFF.QInARepoFilterCellValueOperand.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var cellValueOperand = modelComponent;
		var comparisonOperator;
		var inaValueList;
		inaStructure.putBoolean("IsExcluding", cellValueOperand.isExcluding());
		comparisonOperator = cellValueOperand.getComparisonOperator();
		inaStructure.putString("Comparison", oFF.QInAConverter
				.lookupComparisonInA(comparisonOperator));
		inaValueList = oFF.QInARepoFilterOperation.exportValues(exporter,
				cellValueOperand);
		inaStructure.put("Values", inaValueList);
		return inaStructure;
	};
	oFF.QInARepoFilterExpression = function() {
	};
	oFF.QInARepoFilterExpression.prototype = new oFF.QInARepository();
	oFF.QInARepoFilterExpression.prototype.getComponentType = function() {
		return oFF.OlapComponentType.FILTER_EXPRESSION;
	};
	oFF.QInARepoFilterExpression.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var expression = modelComponent;
		var uniqueId;
		var isSuppressingNulls;
		var inaFilterElement;
		var component;
		var filterElement;
		var inaElements;
		var i;
		var inaCellValueOperand;
		var cellValueOperand;
		if (oFF.XString
				.isEqual(expression.getName(), "selectionSpaceContainer")
				&& expression.getFilterRootElement() !== null) {
			return modelComponent;
		}
		expression.setComplexRoot(null);
		if (expression.supportsCellValueOperands()) {
			expression.setIsSuppressingNulls(false);
			expression.clearCellValueFilter();
		}
		if (oFF.notNull(inaStructure)) {
			uniqueId = inaStructure.getStringByKey("Id");
			expression.setUniqueId(uniqueId);
			if (expression.supportsCellValueOperands()) {
				isSuppressingNulls = inaStructure.getBooleanByKeyExt(
						"IsSuppressingNulls", false);
				expression.setIsSuppressingNulls(isSuppressingNulls);
			}
			inaFilterElement = inaStructure.getStructureByKey("FilterRoot");
			if (oFF.notNull(inaFilterElement)) {
				component = importer.importComponent(null, inaFilterElement,
						null, expression, context);
				filterElement = component;
				expression.setComplexRoot(filterElement);
			}
			if (expression.supportsCellValueOperands()) {
				inaElements = inaStructure.getListByKey("CellValueOperand");
				if (oFF.notNull(inaElements)) {
					for (i = 0; i < inaElements.size(); i++) {
						inaCellValueOperand = inaElements.getStructureAt(i);
						cellValueOperand = importer
								.importComponent(
										oFF.OlapComponentType.FILTER_CELL_VALUE_OPERAND,
										inaCellValueOperand, null, expression,
										context);
						expression.addCellValueFilter(cellValueOperand);
					}
				}
			}
		}
		return modelComponent;
	};
	oFF.QInARepoFilterExpression.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var expression = modelComponent;
		var rootElement;
		var inaRootElement;
		var inaElements;
		var cellValueOperands;
		var i;
		var cellValueOperand;
		var inaCellValueOperand;
		inaStructure.putString("Id", expression.getUniqueId());
		inaStructure.putBoolean("IsSuppressingNulls", expression
				.isSuppressingNulls());
		rootElement = expression.getFilterRootElement();
		if (oFF.notNull(rootElement)) {
			inaRootElement = exporter.exportComponent(null, rootElement, null,
					oFF.QImExFlag.DEFAULT_ALL);
			inaStructure.put("FilterRoot", inaRootElement);
		}
		if (expression.supportsCellValueOperands()) {
			inaElements = inaStructure.putNewList("CellValueOperand");
			cellValueOperands = expression.getCellValueOperands();
			for (i = 0; i < cellValueOperands.size(); i++) {
				cellValueOperand = cellValueOperands.get(i);
				inaCellValueOperand = exporter
						.exportCellValueOperand(cellValueOperand);
				inaElements.add(inaCellValueOperand);
			}
		}
		return inaStructure;
	};
	oFF.QInARepoFilterOperation = function() {
	};
	oFF.QInARepoFilterOperation.prototype = new oFF.QInARepository();
	oFF.QInARepoFilterOperation.importValues = function(importer, inaValueList,
			filterValueContainer, field, context) {
		var size = inaValueList.size();
		var i;
		var inaValueStructure;
		var valueBag;
		var inaType;
		var filterValueType;
		var varName;
		var variables;
		var variable;
		var inaNavigationList;
		var navigations;
		var inaNaviSize;
		var naviIdx;
		var memberNavigation;
		for (i = 0; i < size && i < 3; i++) {
			inaValueStructure = inaValueList.getStructureAt(i);
			valueBag = filterValueContainer.getValueAt(i);
			inaType = inaValueStructure.getStringByKey("Type");
			filterValueType = oFF.QInAConverter.lookupValueType(inaType);
			if (filterValueType === oFF.XValueType.VARIABLE) {
				valueBag.setFilterValueType(filterValueType);
				varName = inaValueStructure.getStringByKey("Value");
				if (oFF.notNull(varName)) {
					variables = context.getVariableContainer().getVariables();
					variable = variables.getByKey(varName);
					valueBag.setVariableValue(variable);
				}
			} else {
				if (filterValueType === oFF.XValueType.CURRENT_MEMBER) {
					valueBag.setFilterValueType(filterValueType);
				}
				inaNavigationList = oFF.PrUtils.getListProperty(
						inaValueStructure, "LowNavigations");
				if (oFF.isNull(inaNavigationList)) {
					inaNavigationList = oFF.PrUtils.getListProperty(
							inaValueStructure, "Value");
				}
				if (oFF.notNull(inaNavigationList)) {
					navigations = valueBag.getMemberNavigations();
					navigations.clear();
					inaNaviSize = inaNavigationList.size();
					for (naviIdx = 0; naviIdx < inaNaviSize; naviIdx++) {
						memberNavigation = oFF.QInARepoFilterOperation
								.importMemberNavigation(inaNavigationList
										.getStructureAt(naviIdx));
						navigations.add(memberNavigation);
					}
				}
				if (filterValueType !== oFF.XValueType.CURRENT_MEMBER) {
					oFF.QInAValueUtils.importSupplementsAndValue(importer,
							valueBag, inaValueStructure, null, null, field);
				}
			}
		}
	};
	oFF.QInARepoFilterOperation.importMemberNavigation = function(inaNavigation) {
		var memberNavigation = oFF.QFactory
				.createMemberNavigation(oFF.CurrentMemberFunction
						.lookup(inaNavigation.getStringByKey("Function")));
		var inaParameters;
		var inaParaSize;
		var idxPara;
		var inaParameter;
		var inaNavigations;
		var inaNaviSize;
		var idxNavi;
		var inaLevelValue;
		var inaShift;
		var inaRange;
		var inaConstantValue;
		if (inaNavigation.containsKey("Parameters")) {
			inaParameters = inaNavigation.getListByKey("Parameters");
			inaParaSize = inaParameters.size();
			for (idxPara = 0; idxPara < inaParaSize; idxPara++) {
				inaParameter = inaParameters.getStructureAt(idxPara);
				if (inaParameter.containsKey("Navigations")) {
					inaNavigations = inaParameter.getListByKey("Navigations");
					inaNaviSize = inaNavigations.size();
					for (idxNavi = 0; idxNavi < inaNaviSize; idxNavi++) {
						memberNavigation
								.addNavigation(oFF.QInARepoFilterOperation
										.importMemberNavigation(inaNavigations
												.getStructureAt(idxNavi)));
					}
				} else {
					if (inaParameter.containsKey("Level")) {
						inaLevelValue = inaParameter.getByKey("Level");
						if (inaLevelValue.isNumeric()) {
							memberNavigation
									.addParameter(oFF.QFactory
											.createNavigationParameterWithLevelNumber(inaLevelValue
													.getInteger()));
						} else {
							memberNavigation
									.addParameter(oFF.QFactory
											.createNavigationParameterWithLevelLiteral(inaLevelValue
													.getString()));
						}
					} else {
						if (inaParameter.containsKey("Member")) {
							memberNavigation
									.addParameter(oFF.QFactory
											.createNavigationParameterWithMemberName(inaParameter
													.getStringByKey("Member")));
						} else {
							if (inaParameter.containsKey("NoValuesAboveLevel")) {
								memberNavigation
										.addParameter(oFF.QFactory
												.createNavigationParameterWithNoValuesAboveLevel(inaParameter
														.getStringByKey("NoValuesAboveLevel")));
							} else {
								if (inaParameter.containsKey("Shift")) {
									inaShift = inaParameter
											.getStructureByKey("Shift");
									memberNavigation
											.addParameter(oFF.QFactory
													.createNavigationParameterWithShift(
															inaShift
																	.getStringByKey("Level"),
															inaShift
																	.getIntegerByKey("Constant")));
								} else {
									if (inaParameter.containsKey("Range")) {
										inaRange = inaParameter
												.getStructureByKey("Range");
										memberNavigation
												.addParameter(oFF.QFactory
														.createNavigationParameterWithRange(
																inaRange
																		.getStringByKey("Level"),
																inaRange
																		.getIntegerByKey("OffsetLow"),
																inaRange
																		.getIntegerByKey("OffsetHigh")));
									} else {
										inaConstantValue = inaParameter
												.getByKey("Constant");
										if (inaConstantValue.isNumeric()) {
											memberNavigation
													.addParameter(oFF.QFactory
															.createNavigationParameterWithIntegerConstant(inaConstantValue
																	.getInteger()));
										} else {
											memberNavigation
													.addParameter(oFF.QFactory
															.createNavigationParameterWithStringConstant(inaConstantValue
																	.getString()));
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return memberNavigation;
	};
	oFF.QInARepoFilterOperation.exportValues = function(exporter,
			filterValueContainer) {
		var inaValueList = oFF.PrFactory.createList();
		var size = filterValueContainer.size();
		var i;
		var valueBag;
		var inaValueStructure;
		var filterValueType;
		var inaNavigationList;
		var literalField;
		var fieldValue;
		var memberNavigations;
		var memberNavigationSize;
		var mnIdx;
		for (i = 0; i < size; i++) {
			valueBag = filterValueContainer.getValueAt(i);
			inaValueStructure = inaValueList.addNewStructure();
			filterValueType = valueBag.getFilterValueType();
			if (filterValueType === oFF.XValueType.VARIABLE) {
				inaValueStructure.putString("Type", "Variable");
				oFF.QInAExportUtil.setNameIfNotNull(inaValueStructure, "Value",
						valueBag.getVariableValue());
			} else {
				if (filterValueType === oFF.XValueType.CURRENT_MEMBER) {
					inaValueStructure.putString("Type", "CurrentMember");
				}
				literalField = null;
				fieldValue = valueBag.getFieldValue();
				if (oFF.notNull(fieldValue)) {
					literalField = fieldValue.getField();
				}
				oFF.QInAValueUtils.exportSupplementsAndValue(exporter, null,
						inaValueStructure, literalField, valueBag, null);
				memberNavigations = valueBag.getMemberNavigations();
				memberNavigationSize = memberNavigations.size();
				if (memberNavigationSize > 0) {
					inaNavigationList = inaValueStructure
							.putNewList("LowNavigations");
					for (mnIdx = 0; mnIdx < memberNavigationSize; mnIdx++) {
						oFF.QInAFilterOperation.exportMemberNavigation(
								memberNavigations.get(mnIdx), inaNavigationList
										.addNewStructure());
					}
				}
			}
		}
		return inaValueList;
	};
	oFF.QInARepoFilterOperation.prototype.getComponentType = function() {
		return oFF.FilterComponentType.OPERATION;
	};
	oFF.QInARepoFilterOperation.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var filterExpression = null;
		var parentFilterElement;
		var filterOperation;
		var fieldName;
		var field;
		var fieldAccessor;
		var inaComparison;
		var comparisonOperator;
		var isExcluding;
		var hasLevelOffset;
		var levelOffset;
		var hasDepth;
		var depth;
		var uniqueId;
		var exactness;
		var hierarchyName;
		var inaValueList;
		if (oFF.notNull(parentComponent)) {
			parentFilterElement = parentComponent;
			filterExpression = parentFilterElement.getFilterExpression();
		}
		filterOperation = modelComponent;
		if (oFF.isNull(filterOperation)) {
			filterOperation = oFF.QFactory.newFilterOperation(filterExpression,
					null);
		}
		fieldName = inaStructure.getStringByKey("FieldName");
		field = null;
		if (oFF.notNull(fieldName) && oFF.notNull(context)) {
			fieldAccessor = context.getFieldAccessorSingle();
			field = fieldAccessor.getFieldByName(fieldName);
			if (oFF.isNull(field)) {
				return null;
			}
			filterOperation.setField(field);
		}
		inaComparison = inaStructure.getStringByKeyExt("Comparison", "=");
		if (oFF.notNull(inaComparison)) {
			comparisonOperator = oFF.QInAConverter
					.lookupComparison(inaComparison);
			if (oFF.isNull(comparisonOperator)) {
				importer.addError(oFF.ErrorCodes.INVALID_OPERATOR,
						oFF.XStringUtils.concatenate2(
								"Unsupported comparison operator: ",
								inaComparison));
			}
			filterOperation.setComparisonOperator(comparisonOperator);
		} else {
			filterOperation.setComparisonOperator(null);
		}
		isExcluding = inaStructure.getBooleanByKeyExt("IsExcluding", false);
		if (isExcluding) {
			filterOperation.setSetSign(oFF.SetSign.EXCLUDING);
		} else {
			filterOperation.setSetSign(oFF.SetSign.INCLUDING);
		}
		hasLevelOffset = inaStructure.getBooleanByKeyExt("HasLevelOffset",
				false);
		if (!hasLevelOffset) {
			filterOperation.resetLevelOffset();
		} else {
			levelOffset = inaStructure.getIntegerByKeyExt("LevelOffset", 0);
			filterOperation.setLevelOffset(levelOffset);
		}
		hasDepth = inaStructure.getBooleanByKeyExt("HasDepth", false);
		if (!hasDepth) {
			filterOperation.resetDepth();
		} else {
			depth = inaStructure.getIntegerByKeyExt("Depth", 0);
			filterOperation.setDepth(depth);
		}
		filterOperation.setConvertToFlatFilter(inaStructure.getBooleanByKeyExt(
				"ConvertToFlatSelection", false));
		uniqueId = inaStructure.getStringByKey("Id");
		filterOperation.setUniqueId(uniqueId);
		exactness = inaStructure.getDoubleByKeyExt("Exactness", 0);
		filterOperation.setExactness(exactness);
		hierarchyName = inaStructure.getStringByKey("HierarchyName");
		filterOperation.setHierarchyName(hierarchyName);
		inaValueList = inaStructure.getListByKey("Values");
		oFF.QInARepoFilterOperation.importValues(importer, inaValueList,
				filterOperation, field, context);
		return filterOperation;
	};
	oFF.QInARepoFilterOperation.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var filterOperation = modelComponent;
		var comparisonOperator;
		var inaValueList;
		inaStructure.putString("Id", filterOperation.getUniqueId());
		oFF.QInAExportUtil.setNameIfNotNull(inaStructure, "FieldName",
				filterOperation.getField());
		comparisonOperator = filterOperation.getComparisonOperator();
		inaStructure.putString("Comparison", oFF.QInAConverter
				.lookupComparisonInA(comparisonOperator));
		inaStructure.putBoolean("IsExcluding",
				filterOperation.getSetSign() === oFF.SetSign.EXCLUDING);
		inaStructure.putBoolean("HasLevelOffset", filterOperation
				.hasLevelOffset());
		if (filterOperation.hasLevelOffset()) {
			inaStructure.putInteger("LevelOffset", filterOperation
					.getLevelOffset());
		}
		inaStructure.putBoolean("HasDepth", filterOperation.hasDepth());
		if (filterOperation.hasDepth()) {
			inaStructure.putInteger("Depth", filterOperation.getDepth());
		}
		inaStructure.putDouble("Exactness", filterOperation.getExactness());
		inaStructure.putStringNotNull("HierarchyName", filterOperation
				.getHierarchyName());
		inaValueList = oFF.QInARepoFilterOperation.exportValues(exporter,
				filterOperation);
		inaStructure.put("Values", inaValueList);
		if (filterOperation.isConvertToFlatFilter()) {
			inaStructure.putBoolean("ConvertToFlatSelection", true);
		}
		return inaStructure;
	};
	oFF.QInARepoFilterTuple = function() {
	};
	oFF.QInARepoFilterTuple.prototype = new oFF.QInARepository();
	oFF.QInARepoFilterTuple.prototype.getComponentType = function() {
		return oFF.FilterComponentType.TUPLE;
	};
	oFF.QInARepoFilterTuple.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var filterExpression = null;
		var parentFilterElement;
		var filterTuple;
		var inaSubSelectionsOfTuples;
		var tuplesOperandInInA;
		var fieldNamesFromInA;
		var fieldNames;
		var j;
		var tuplesFromInA;
		var k;
		var tupleDataInInA;
		var tupleData;
		var l;
		if (oFF.notNull(parentComponent)) {
			parentFilterElement = parentComponent;
			filterExpression = parentFilterElement.getFilterExpression();
		}
		filterTuple = oFF.QFilterTuple._create(context, filterExpression);
		filterTuple.setUniqueId(inaStructure.getStringByKey("Id"));
		inaSubSelectionsOfTuples = inaStructure.getListByKey("SubSelections");
		if (oFF.notNull(inaSubSelectionsOfTuples)) {
			tuplesOperandInInA = inaSubSelectionsOfTuples.getStructureAt(0);
			tuplesOperandInInA = tuplesOperandInInA
					.getStructureByKey("TuplesOperand");
			fieldNamesFromInA = tuplesOperandInInA.getListByKey("FieldNames");
			fieldNames = oFF.XListOfString.create();
			for (j = 0; j < fieldNamesFromInA.size(); j++) {
				fieldNames.add(fieldNamesFromInA.getStringAt(j));
			}
			filterTuple.setFieldNames(fieldNames);
			tuplesFromInA = tuplesOperandInInA.getListByKey("Tuples");
			for (k = 0; k < tuplesFromInA.size(); k++) {
				tupleDataInInA = tuplesFromInA.getListAt(k);
				tupleData = oFF.XListOfString.create();
				for (l = 0; l < tupleDataInInA.size(); l++) {
					tupleData.add(tupleDataInInA.getStringAt(l));
				}
				filterTuple.addTupleCriteria(tupleData);
			}
		}
		return filterTuple;
	};
	oFF.QInARepoFilterTuple.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var filterTuple = modelComponent;
		var inaSubSelectionsTuples;
		var tupleStructureInSubSelections;
		var tuplesOperandStructure;
		var fieldNames;
		var fieldNamesForFiltering;
		var tuplesInInA;
		var tuples;
		var l;
		var singleTupleCondition;
		var tuplesData;
		var j;
		inaStructure.putString("Code", "Tuple");
		inaStructure.putString("Id", filterTuple.getUniqueId());
		inaSubSelectionsTuples = inaStructure.putNewList("SubSelections");
		tupleStructureInSubSelections = inaSubSelectionsTuples
				.addNewStructure();
		tuplesOperandStructure = tupleStructureInSubSelections
				.putNewStructure("TuplesOperand");
		fieldNames = tuplesOperandStructure.putNewList("FieldNames");
		fieldNamesForFiltering = filterTuple.getFieldNames();
		fieldNames.addAllStrings(fieldNamesForFiltering);
		tuplesInInA = tuplesOperandStructure.putNewList("Tuples");
		tuples = filterTuple.getTuples();
		for (l = 0; l < tuples.size(); l++) {
			singleTupleCondition = tuples.get(l);
			tuplesData = tuplesInInA.addNewList();
			for (j = 0; j < fieldNamesForFiltering.size(); j++) {
				tuplesData.addString(singleTupleCondition.get(j));
			}
		}
		return inaStructure;
	};
	oFF.QInARepoMember = function() {
	};
	oFF.QInARepoMember.prototype = new oFF.QInARepository();
	oFF.QInARepoMember.setIntegerIfNotNull = function(structure, name, value) {
		if (oFF.notNull(value)) {
			structure.putInteger(name, value.getInteger());
		}
	};
	oFF.QInARepoMember.prototype.importGenericMemberProperties = function(
			member, inaMember) {
		var inaVisibility;
		var inaPostAggregation;
		var postAggregationType;
		var inaPostAggregationDimensions;
		var size;
		var postDimIdx;
		if (inaMember.containsKey("NumericShift")) {
			member.setNumericShift(inaMember.getIntegerByKey("NumericShift"));
		}
		if (inaMember.containsKey("NumericScale")) {
			member.setNumericScale(inaMember.getIntegerByKey("NumericScale"));
		}
		if (inaMember.containsKey("NumericPrecision")) {
			member.setNumericPrecision(inaMember
					.getIntegerByKey("NumericPrecision"));
		}
		if (member.getQueryModel().supportsMemberVisibility()) {
			inaVisibility = inaMember
					.getStringByKeyExt("Visibility", "Visible");
			member.setResultVisibility(oFF.QInAConverter
					.lookupResultSetVisibility(inaVisibility));
		}
		inaPostAggregation = inaMember.getStringByKey("PostAggregation");
		postAggregationType = oFF.QInAConverter
				.lookupAggregationType(inaPostAggregation);
		member.setPostAggregationType(postAggregationType);
		if (inaMember.containsKey("PostAggregationIgnoreHierarchy")) {
			member.setPostAggregationIgnoreHierarchy(true);
		}
		member.clearPostAggregationDimensions();
		inaPostAggregationDimensions = inaMember
				.getListByKey("PostAggregationDimensions");
		if (oFF.notNull(inaPostAggregationDimensions)) {
			size = inaPostAggregationDimensions.size();
			for (postDimIdx = 0; postDimIdx < size; postDimIdx++) {
				member
						.addPostAggregationDimensionName(inaPostAggregationDimensions
								.getStringAt(postDimIdx));
			}
		}
	};
	oFF.QInARepoMember.prototype.exportGenericMemberProperties = function(
			member, inaMember) {
		var resultVisibility;
		var postAggregationType;
		var postAggregationDimensions;
		var inaPostAggregationDimensions;
		var iterator;
		oFF.QInARepoMember.setIntegerIfNotNull(inaMember, "NumericShift",
				member.getNumericShift());
		oFF.QInARepoMember.setIntegerIfNotNull(inaMember, "NumericScale",
				member.getNumericScale());
		oFF.QInARepoMember.setIntegerIfNotNull(inaMember, "NumericPrecision",
				member.getNumericPrecision());
		resultVisibility = member.getResultVisibility();
		if (oFF.isNull(resultVisibility)) {
			resultVisibility = oFF.ResultVisibility.VISIBLE;
		}
		inaMember.putString("Visibility", oFF.QInAConverter
				.lookupResultSetVisibilityInA(resultVisibility));
		postAggregationType = member.getPostAggregationType();
		if (oFF.notNull(postAggregationType)) {
			inaMember.putString("PostAggregation", oFF.QInAConverter
					.lookupAggregationTypeInA(postAggregationType));
		}
		if (member.isPostAggregationIgnoringHierarchy()) {
			inaMember.putBoolean("PostAggregationIgnoreHierarchy", true);
		}
		postAggregationDimensions = member.getPostAggregationDimensions();
		if (postAggregationDimensions.hasElements()) {
			inaPostAggregationDimensions = inaMember
					.putNewList("PostAggregationDimensions");
			iterator = postAggregationDimensions.getIterator();
			while (iterator.hasNext()) {
				inaPostAggregationDimensions.add(oFF.PrString
						.createWithValue(iterator.next()));
			}
		}
	};
	oFF.QInARepoMember.prototype.getComponentType = function() {
		return oFF.MemberType.ABSTRACT_MEMBER;
	};
	oFF.QInARepoMember.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		this.importGenericMemberProperties(modelComponent, inaStructure);
		return modelComponent;
	};
	oFF.QInARepoMember.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		this.exportGenericMemberProperties(modelComponent, inaStructure);
		return inaStructure;
	};
	oFF.QInARepoMemberBasicMeasure = function() {
	};
	oFF.QInARepoMemberBasicMeasure.prototype = new oFF.QInARepository();
	oFF.QInARepoMemberBasicMeasure.fillValue = function(exporter,
			memberOperandElement, fieldValue, valueType, comparsionOperator) {
		memberOperandElement.putString("Comparison", oFF.QInAConverter
				.lookupComparisonInA(comparsionOperator));
		oFF.QInAValueUtils.exportValue(exporter, "Value", memberOperandElement,
				fieldValue, valueType);
	};
	oFF.QInARepoMemberBasicMeasure.prototype.getComponentType = function() {
		return oFF.MemberType.BASIC_MEASURE;
	};
	oFF.QInARepoMemberBasicMeasure.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var dimension = parentComponent;
		var newMemberName;
		var newMemberText;
		var keyField;
		var keyName;
		var textField;
		var textName;
		var memberOperand;
		var isFilterOnMeasures;
		var isFilterEqual;
		var member;
		var inaExceptionAggregationDimensions;
		var size;
		var idx;
		var exceptionAggregation;
		var inaAggregationDimension;
		if (oFF.isNull(dimension)) {
			dimension = context.getDimensionAccessor()
					.getDimensionByNameFromExistingMetadata(
							inaStructure.getStringByKey("Dimension"));
		}
		newMemberName = inaStructure.getStringByKey("Name");
		newMemberText = inaStructure.getStringByKey("Description");
		if (oFF.isNull(newMemberName) && oFF.isNull(newMemberText)) {
			keyField = dimension.getKeyField();
			keyName = keyField.getName();
			newMemberName = inaStructure.getStringByKey(keyName);
			textField = dimension.getTextField();
			textName = null;
			if (oFF.notNull(textField)) {
				textName = textField.getName();
			}
			newMemberText = inaStructure.getStringByKey(textName);
		}
		if (oFF.XStringUtils.isNullOrEmpty(newMemberName)) {
			memberOperand = inaStructure.getStructureByKey("MemberOperand");
			if (oFF.notNull(memberOperand)) {
				isFilterOnMeasures = oFF.XString.isEqual(memberOperand
						.getStringByKey("AttributeName"), "Measures");
				isFilterEqual = oFF.QInAConverter
						.lookupComparison(memberOperand
								.getStringByKey("Comparison")) === oFF.ComparisonOperator.EQUAL;
				if (isFilterOnMeasures && isFilterEqual) {
					newMemberName = memberOperand.getStringByKey("Value");
				}
			}
		}
		member = modelComponent;
		if (oFF.isNull(member)) {
			member = dimension.getStructureMember(newMemberName);
			if (oFF.isNull(member)) {
				member = oFF.QBasicMeasure._createBasicMeasure(context,
						dimension);
				member.setName(newMemberName);
				if (oFF.notNull(newMemberText) && member.getText() === null) {
					member.setText(newMemberText);
				}
				member.initializeFieldValues();
			}
		} else {
			member.setDimension(dimension);
			member.setName(newMemberName);
			if (oFF.notNull(newMemberText) && member.getText() === null) {
				member.setText(newMemberText);
			}
			member.initializeFieldValues();
		}
		if (dimension.getQueryModel()
				.supportsExceptionAggregationDimsFormulas()) {
			member.clearExceptionAggregationDimensions();
			member.setExceptionAggregationType(null);
			inaExceptionAggregationDimensions = inaStructure
					.getListByKey("ExceptionAggregationDimensions");
			if (oFF.notNull(inaExceptionAggregationDimensions)) {
				size = inaExceptionAggregationDimensions.size();
				for (idx = 0; idx < size; idx++) {
					member
							.addExceptionAggregationDimensionName(inaExceptionAggregationDimensions
									.getStringAt(idx));
				}
			}
			exceptionAggregation = inaStructure
					.getStringByKey("ExceptionAggregation");
			member.setExceptionAggregationType(oFF.AggregationType
					.lookupOrCreate(exceptionAggregation));
		} else {
			inaAggregationDimension = inaStructure
					.getStringByKey("AggregationDimension");
			if (oFF.XStringUtils.isNotNullAndNotEmpty(inaAggregationDimension)) {
				member.setAggregationDimensionName(inaAggregationDimension);
			}
		}
		oFF.QInAMember.importQdMemberProperties(importer, member, inaStructure);
		importer.importExceptions(inaStructure, member);
		return member;
	};
	oFF.QInARepoMemberBasicMeasure.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var basicMeasure = modelComponent;
		var dimension = basicMeasure.getDimension();
		var text;
		var memberOperandElement;
		var basicAggregationType;
		var basicAggregationDimensionName;
		var value;
		var measureSorting;
		if (dimension.getDimensionType() === oFF.DimensionType.ACCOUNT) {
			inaStructure.putString("Name", basicMeasure.getName());
			return inaStructure;
		}
		text = basicMeasure.getText();
		if (oFF.notNull(text)) {
			inaStructure.putString("Description", text);
		}
		inaStructure.putString("Dimension", dimension.getName());
		memberOperandElement = oFF.PrFactory.createStructure();
		memberOperandElement.putString("AttributeName", "Measures");
		inaStructure.put("MemberOperand", memberOperandElement);
		basicAggregationType = basicMeasure.getAggregationType();
		if (oFF.notNull(basicAggregationType)) {
			inaStructure.putString("Aggregation", basicAggregationType
					.toString());
		}
		if (!basicMeasure.getQueryModel()
				.supportsExceptionAggregationDimsFormulas()) {
			basicAggregationDimensionName = basicMeasure
					.getAggregationDimensionName();
			if (oFF.notNull(basicAggregationDimensionName)) {
				inaStructure.putString("AggregationDimension",
						basicAggregationDimensionName);
			}
		}
		value = basicMeasure.getKeyFieldValue();
		oFF.QInARepoMemberBasicMeasure.fillValue(exporter,
				memberOperandElement, value, value.getValueType(),
				oFF.ComparisonOperator.EQUAL);
		if (!exporter.supportsExtendedSort
				&& !exporter.isVirtualInA(dimension.getQueryModel())) {
			measureSorting = basicMeasure.getQueryModel().getSortingManager()
					.getMeasureSorting(basicMeasure, false);
			if (oFF.notNull(measureSorting)) {
				inaStructure.putInteger("SortOrder", oFF.QInAConverter
						.lookupSortDirectionInA(measureSorting.getDirection()));
			} else {
				inaStructure.putInteger("SortOrder", 0);
			}
		}
		return inaStructure;
	};
	oFF.QInARepoMemberFormulaMeasure = function() {
	};
	oFF.QInARepoMemberFormulaMeasure.prototype = new oFF.QInARepository();
	oFF.QInARepoMemberFormulaMeasure.importQdFormula = function(importer,
			dimension, inaFormula, formulaItemx, context) {
		var inaFunction;
		var formulaItem;
		var functionName;
		var functionParameters;
		var newFormulaFunction;
		var paramSize;
		var paraIdx;
		var constPara;
		var formulaConstant;
		var value;
		var variableManager;
		var valueTypePara;
		var valueIsNull;
		var constUnit;
		var constCurrency;
		var memberPara;
		var formulaMember;
		var memberParaName;
		var attribute;
		var attributeName;
		var formulaAttribute;
		if (oFF.isNull(inaFormula)) {
			return null;
		}
		inaFunction = inaFormula.getStructureByKey("Function");
		formulaItem = formulaItemx;
		if (oFF.notNull(inaFunction)) {
			functionName = inaFunction.getStringByKey("Name");
			functionParameters = inaFunction.getListByKey("Parameters");
			newFormulaFunction = oFF.QFactory.newFormulaFunction(context);
			if (oFF.notNull(functionParameters)) {
				newFormulaFunction.setFunctionName(functionName);
				paramSize = functionParameters.size();
				for (paraIdx = 0; paraIdx < paramSize; paraIdx++) {
					oFF.QInARepoMemberFormulaMeasure.importQdFormula(importer,
							dimension, functionParameters
									.getStructureAt(paraIdx),
							newFormulaFunction, context);
				}
			}
			newFormulaFunction.setSolveOrder(inaFormula.getIntegerByKeyExt(
					"SolveOrder", 0));
			if (oFF.isNull(formulaItem)) {
				formulaItem = newFormulaFunction;
			} else {
				formulaItem.add(newFormulaFunction);
			}
		} else {
			constPara = inaFormula.getStructureByKey("Constant");
			if (oFF.notNull(constPara)) {
				formulaConstant = oFF.QFactory.newFormulaConstant(context);
				if (oFF.XString.isEqual("Variable", constPara
						.getStringByKey("ValueIs"))) {
					value = constPara.getStringByKey("Value");
					if (oFF.XStringUtils.isNotNullAndNotEmpty(value)) {
						variableManager = dimension.getQueryModel()
								.getVariableManager();
						formulaConstant.setVariable(variableManager
								.getVariables().getByKey(value));
					}
					if (oFF.isNull(formulaItem)) {
						formulaItem = formulaConstant;
					} else {
						formulaItem.add(formulaConstant);
					}
				} else {
					valueTypePara = constPara.getStringByKey("ValueType");
					valueIsNull = !constPara.containsKey("Value")
							|| constPara.getElementTypeByKey("Value") === oFF.PrElementType.THE_NULL;
					if (oFF.XString.isEqual(valueTypePara, "Number")) {
						if (valueIsNull) {
							formulaConstant
									.setNullByType(oFF.XValueType.DOUBLE);
						} else {
							formulaConstant.setDouble(constPara
									.getDoubleByKey("Value"));
						}
					} else {
						if (oFF.XString.isEqual(valueTypePara, "String")) {
							if (valueIsNull) {
								formulaConstant
										.setNullByType(oFF.XValueType.STRING);
							} else {
								formulaConstant.setString(constPara
										.getStringByKey("Value"));
							}
						} else {
							if (oFF.XString.isEqual(valueTypePara, "Bool")) {
								if (valueIsNull) {
									formulaConstant
											.setNullByType(oFF.XValueType.BOOLEAN);
								} else {
									formulaConstant.setBoolean(constPara
											.getBooleanByKey("Value"));
								}
							} else {
								if (oFF.XString.isEqual(valueTypePara,
										"DateTime")) {
									if (valueIsNull) {
										formulaConstant
												.setNullByType(oFF.XValueType.DATE_TIME);
									} else {
										formulaConstant
												.setDateTime(oFF.XDateTime
														.createDateTimeFromStringWithFlag(
																constPara
																		.getStringByKey("Value"),
																false));
									}
								} else {
									if (oFF.XString.isEqual(valueTypePara,
											"Date")) {
										if (valueIsNull) {
											formulaConstant
													.setNullByType(oFF.XValueType.DATE);
										} else {
											formulaConstant
													.setDate(oFF.XDate
															.createDateFromStringWithFlag(
																	constPara
																			.getStringByKey("Value"),
																	false));
										}
									} else {
										importer
												.addError(
														oFF.ErrorCodes.INVALID_TOKEN,
														"Constant value type is not supported");
										return null;
									}
								}
							}
						}
					}
					constUnit = constPara.getStringByKey("Unit");
					if (oFF.XStringUtils.isNotNullAndNotEmpty(constUnit)) {
						formulaConstant.setUnit(constUnit);
					}
					constCurrency = constPara.getStringByKey("Currency");
					if (oFF.XStringUtils.isNotNullAndNotEmpty(constCurrency)) {
						formulaConstant.setCurrency(constCurrency);
					}
					if (oFF.isNull(formulaItem)) {
						formulaItem = formulaConstant;
					} else {
						formulaItem.add(formulaConstant);
					}
				}
			} else {
				memberPara = inaFormula.getStructureByKey("Member");
				if (oFF.notNull(memberPara)) {
					formulaMember = oFF.QFactory.newFormulaMember(context);
					memberParaName = memberPara.getStringByKey("Name");
					formulaMember.setMemberName(memberParaName);
					formulaMember.setDimensionName(memberPara
							.getStringByKey("Dimension"));
					if (oFF.isNull(formulaItem)) {
						formulaItem = formulaMember;
					} else {
						formulaItem.add(formulaMember);
					}
				} else {
					attribute = inaFormula.getStructureByKey("AttributeValue");
					if (oFF.notNull(attribute)) {
						attributeName = attribute.getStringByKey("Name");
						formulaAttribute = oFF.QFactory
								.newFormulaAttributeWithName(context,
										attributeName);
						if (oFF.isNull(formulaItem)) {
							formulaItem = formulaAttribute;
						} else {
							formulaItem.add(formulaAttribute);
						}
					}
				}
			}
		}
		return formulaItem;
	};
	oFF.QInARepoMemberFormulaMeasure.buildFormula = function(exporter,
			formulaMeasure, inaContainer) {
		var componentType;
		var fic;
		var constStructure;
		var ficUnit;
		var ficCurrency;
		var fio;
		var opStructure;
		var parameters;
		var fif;
		var funcStructure;
		var funcParameters;
		var functionSize;
		var i;
		var solveOrder;
		var fim;
		var memberStructure;
		var memberVariable;
		var fia;
		var inaAttributeValue;
		if (oFF.notNull(formulaMeasure)) {
			componentType = formulaMeasure.getComponentType();
			if (componentType === oFF.OlapComponentType.FORMULA_CONSTANT) {
				fic = formulaMeasure;
				constStructure = inaContainer.putNewStructure("Constant");
				ficUnit = fic.getUnit();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(ficUnit)) {
					constStructure.putString("Unit", ficUnit);
				}
				ficCurrency = fic.getCurrency();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(ficCurrency)) {
					constStructure.putString("Currency", ficCurrency);
				}
				oFF.QInARepoMemberFormulaMeasure.setFormulaConstantValue(
						constStructure, fic);
			} else {
				if (componentType === oFF.OlapComponentType.FORMULA_OPERATION) {
					fio = formulaMeasure;
					opStructure = inaContainer.putNewStructure("Function");
					opStructure.putString("Name", fio.getOperator()
							.getDisplayString());
					parameters = opStructure.putNewList("Parameters");
					oFF.QInARepoMemberFormulaMeasure.buildFormula(exporter, fio
							.getLeftSide(), parameters.addNewStructure());
					oFF.QInARepoMemberFormulaMeasure.buildFormula(exporter, fio
							.getRightSide(), parameters.addNewStructure());
				} else {
					if (componentType === oFF.OlapComponentType.FORMULA_FUNCTION) {
						fif = formulaMeasure;
						funcStructure = inaContainer
								.putNewStructure("Function");
						funcStructure.putString("Name", fif.getFunctionName());
						funcParameters = funcStructure.putNewList("Parameters");
						functionSize = fif.size();
						for (i = 0; i < functionSize; i++) {
							oFF.QInARepoMemberFormulaMeasure.buildFormula(
									exporter, fif.get(i), funcParameters
											.addNewStructure());
						}
						solveOrder = fif.getSolveOrder();
						if (solveOrder !== 0) {
							inaContainer.putInteger("SolveOrder", solveOrder);
						}
					} else {
						if (componentType === oFF.OlapComponentType.FORMULA_ITEM_MEMBER) {
							fim = formulaMeasure;
							memberStructure = inaContainer
									.putNewStructure("Member");
							memberVariable = fim.getVariable();
							if (oFF.isNull(memberVariable)) {
								memberStructure.putString("Name", fim
										.getMemberName());
								memberStructure.putStringNotNull("Dimension",
										fim.getDimensionName());
							} else {
								memberStructure.putString("Name",
										memberVariable.getName());
								memberStructure.putString("NameIs", "Variable");
							}
						} else {
							if (componentType === oFF.OlapComponentType.FORMULA_ITEM_ATTRIBUTE) {
								fia = formulaMeasure;
								inaAttributeValue = inaContainer
										.putNewStructure("AttributeValue");
								inaAttributeValue.putString("Name", fia
										.getFieldName());
							}
						}
					}
				}
			}
		}
	};
	oFF.QInARepoMemberFormulaMeasure.setFormulaConstantValue = function(
			constStructure, fic) {
		var valueIsNull = fic.getValue() === null;
		var variable = fic.getVariable();
		var valueType;
		var dateValue;
		var dateTimeValue;
		var timeSpanValue;
		if (valueIsNull && oFF.isNull(variable)) {
			constStructure.putNull("Value");
		}
		valueType = fic.getValueType();
		if (valueType === oFF.XValueType.INTEGER) {
			constStructure.putString("ValueType", "Number");
			if (!valueIsNull) {
				constStructure.putInteger("Value", fic.getInteger());
			}
		} else {
			if (valueType === oFF.XValueType.DOUBLE
					|| valueType === oFF.XValueType.DECIMAL_FLOAT) {
				constStructure.putString("ValueType", "Number");
				if (!valueIsNull) {
					constStructure.putDouble("Value", fic.getDouble());
				}
			} else {
				if (valueType === oFF.XValueType.LONG) {
					constStructure.putString("ValueType", "Number");
					if (!valueIsNull) {
						constStructure.putLong("Value", fic.getLong());
					}
				} else {
					if (valueType === oFF.XValueType.STRING) {
						constStructure.putString("ValueType", "String");
						if (!valueIsNull) {
							constStructure.putString("Value", fic.getString());
						}
					} else {
						if (valueType === oFF.XValueType.BOOLEAN) {
							constStructure.putString("ValueType", "Bool");
							if (!valueIsNull) {
								constStructure.putBoolean("Value", fic
										.getBoolean());
							}
						} else {
							if (valueType === oFF.XValueType.DATE) {
								constStructure.putString("ValueType", "Date");
								if (!valueIsNull) {
									dateValue = fic.getDate();
									constStructure.putString("Value", dateValue
											.toString());
								}
							} else {
								if (valueType === oFF.XValueType.DATE_TIME) {
									constStructure.putString("ValueType",
											"DateTime");
									if (!valueIsNull) {
										dateTimeValue = fic.getDateTime();
										constStructure.putString("Value",
												dateTimeValue.toString());
									}
								} else {
									if (valueType.isSpatial()) {
										constStructure.putString("ValueType",
												"String");
										if (!valueIsNull) {
											constStructure.putString("Value",
													fic.getGeometry().toWKT());
										}
									} else {
										if (valueType === oFF.XValueType.TIMESPAN) {
											constStructure.putString(
													"ValueType", "String");
											if (!valueIsNull) {
												timeSpanValue = fic
														.getTimeSpan();
												constStructure.putString(
														"Value", timeSpanValue
																.toString());
											}
										} else {
											if (valueType === oFF.XValueType.VARIABLE) {
												oFF.QInAExportUtil
														.setNameIfNotNull(
																constStructure,
																"Value",
																variable);
												constStructure.putString(
														"ValueIs", "Variable");
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};
	oFF.QInARepoMemberFormulaMeasure.prototype.getComponentType = function() {
		return oFF.MemberType.FORMULA;
	};
	oFF.QInARepoMemberFormulaMeasure.prototype.newModelComponent = function(
			application, parentComponent, context) {
		var formulaMeasure = oFF.QFormulaMeasure._createFormulaMeasure(context,
				null);
		formulaMeasure.setParent(parentComponent);
		return formulaMeasure;
	};
	oFF.QInARepoMemberFormulaMeasure.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var dimension = parentComponent;
		var queryModel = context.getQueryModel();
		var newMemberName;
		var newMemberText;
		var keyField;
		var keyName;
		var textField;
		var textName;
		var member;
		var inaFormula;
		var importFormula;
		var calculateBeforeAggregation;
		if (oFF.isNull(dimension)) {
			dimension = queryModel.getMeasureDimension();
		}
		newMemberName = inaStructure.getStringByKey("Name");
		newMemberText = inaStructure.getStringByKey("Description");
		if (oFF.isNull(newMemberName) && oFF.isNull(newMemberText)) {
			if (oFF.notNull(dimension)) {
				keyField = dimension.getKeyField();
				keyName = keyField.getName();
				newMemberName = inaStructure.getStringByKey(keyName);
				textField = dimension.getTextField();
				textName = null;
				if (oFF.notNull(textField)) {
					textName = textField.getName();
				}
				newMemberText = inaStructure.getStringByKey(textName);
			}
		}
		member = modelComponent;
		if (oFF.isNull(member)) {
			member = oFF.QFormulaMeasure._createFormulaMeasure(context,
					dimension);
		} else {
			member.setDimension(dimension);
		}
		if (oFF.XStringUtils.isNullOrEmpty(newMemberName)
				&& oFF.XStringUtils.isNullOrEmpty(newMemberText)) {
			member.setName(inaStructure.getStringByKey("Name"));
			member.setText(inaStructure.getStringByKey("Description"));
		} else {
			member.setName(newMemberName);
			member.setText(newMemberText);
		}
		inaFormula = inaStructure.getStructureByKey("Formula");
		importFormula = oFF.QInARepoMemberFormulaMeasure.importQdFormula(
				importer, dimension, inaFormula, null, context);
		oFF.QInAMember.importQdMemberProperties(importer, member, inaStructure);
		importer.importExceptions(inaStructure, member);
		member.setFormula(importFormula);
		if (member.supportsCalculatedBeforeAggregation()) {
			calculateBeforeAggregation = oFF.XString.isEqual(
					"CalculationBeforeAggregation", inaStructure
							.getStringByKey("ExecutionStep"));
			member.setIsCalculatedBeforeAggregation(calculateBeforeAggregation);
		}
		return member;
	};
	oFF.QInARepoMemberFormulaMeasure.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var formulaMeasure = modelComponent;
		var inaFormula;
		inaStructure.putString("Name", formulaMeasure.getName());
		inaStructure.putString("Description", formulaMeasure.getText());
		inaFormula = oFF.PrFactory.createStructure();
		oFF.QInARepoMemberFormulaMeasure.buildFormula(exporter, formulaMeasure
				.getFormula(), inaFormula);
		inaStructure.put("Formula", inaFormula);
		if (formulaMeasure.supportsCalculatedBeforeAggregation()
				&& formulaMeasure.isCalculatedBeforeAggregation()) {
			inaStructure.putString("ExecutionStep",
					"CalculationBeforeAggregation");
		}
		return inaStructure;
	};
	oFF.QInARepoMembersAll = function() {
	};
	oFF.QInARepoMembersAll.prototype = new oFF.QInARepository();
	oFF.QInARepoMembersAll.prototype.getComponentType = function() {
		return oFF.OlapComponentType.MEMBERS;
	};
	oFF.QInARepoMembersAll.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var dimension = modelComponent;
		var inaMemberList;
		var structureLayout;
		var len;
		var iMember;
		var inaMember;
		var member;
		var name;
		var member2;
		if (dimension.supportsCustomMembers()) {
			dimension.removeCustomMembers();
		}
		inaMemberList = inaStructure.getListByKey("MembersRepo");
		if (oFF.isNull(inaMemberList)) {
			return null;
		}
		structureLayout = dimension.getStructureLayout();
		if (oFF.notNull(structureLayout)) {
			dimension.removeCustomMembers();
			structureLayout.clear();
			len = inaMemberList.size();
			for (iMember = 0; iMember < len; iMember++) {
				inaMember = inaMemberList.getStructureAt(iMember);
				member = importer.importStructureMember(dimension, inaMember,
						context);
				if (oFF.notNull(member)) {
					name = member.getName();
					member2 = dimension.getStructureMember(name);
					if (oFF.isNull(member2)) {
						dimension.addMeasure(member);
					} else {
						if (member2 !== member) {
							throw oFF.XException
									.createIllegalStateException(oFF.XStringUtils
											.concatenate3(
													"Internal error: New member with same name not allowed: '",
													name, "'!"));
						}
						structureLayout.removeElement(member2);
						structureLayout.add(member2);
					}
				}
			}
		}
		return dimension;
	};
	oFF.QInARepoMembersAll.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var dimension = modelComponent;
		var allStructureMembers = dimension.getStructureLayout();
		var membersList;
		var len;
		var i;
		var structureMember;
		var inaMember;
		var type;
		if (oFF.notNull(allStructureMembers)) {
			if (!dimension.supportsBasicStructureMembers()
					&& allStructureMembers.isEmpty()) {
				return null;
			}
			membersList = inaStructure.putNewList("MembersRepo");
			len = allStructureMembers.size();
			for (i = 0; i < len; i++) {
				structureMember = allStructureMembers.get(i);
				inaMember = exporter.exportStructureMember(structureMember);
				type = structureMember.getMemberType();
				if (type === oFF.MemberType.RESTRICTED_MEASURE
						|| type === oFF.MemberType.FORMULA) {
					inaMember.putString("MemberType", oFF.QInAConverter
							.lookupMeasureStructureMemberTypeIna(type));
				}
				membersList.add(inaMember);
			}
		}
		return inaStructure;
	};
	oFF.QInARepoSort = function() {
	};
	oFF.QInARepoSort.prototype = new oFF.QInARepository();
	oFF.QInARepoSort.prototype.getComponentType = function() {
		return oFF.OlapComponentType.SORT_MANAGER;
	};
	oFF.QInARepoSort.prototype.getTagName = function() {
		return "SortRepo";
	};
	oFF.QInARepoSort.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var inaList = inaStructure.getListByKey("Elements");
		var sortingManager = modelComponent;
		var sortingOperations = sortingManager.getSortingOperations();
		var sortIdx;
		var inaSort;
		var sortingOp;
		sortingOperations.clear();
		if (oFF.notNull(inaList)) {
			for (sortIdx = 0; sortIdx < inaList.size(); sortIdx++) {
				inaSort = inaList.getStructureAt(sortIdx);
				sortingOp = importer.importComponent(
						oFF.OlapComponentType.GENERIC_SORTING, inaSort, null,
						sortingManager, context);
				sortingOperations.add(sortingOp);
			}
		}
		return sortingManager;
	};
	oFF.QInARepoSort.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var sortingManager = modelComponent;
		var inaSortOps = inaStructure.putNewList("Elements");
		var sortingOperations = sortingManager.getSortingOperations();
		var i;
		var inaSortOp;
		for (i = 0; i < sortingOperations.size(); i++) {
			inaSortOp = exporter.exportComponent(null,
					sortingOperations.get(i), null, flags);
			inaSortOps.add(inaSortOp);
		}
		return inaStructure;
	};
	oFF.QInARepoSortOperation = function() {
	};
	oFF.QInARepoSortOperation.prototype = new oFF.QInARepository();
	oFF.QInARepoSortOperation.prototype.getComponentType = function() {
		return oFF.OlapComponentType.GENERIC_SORTING;
	};
	oFF.QInARepoSortOperation.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var sortingManager = parentComponent;
		var sortingOp;
		var queryModel = context.getQueryModel();
		var inaSortType = inaStructure.getStringByKey("SortType");
		var sortType = oFF.QInAConverter.lookupSortType(inaSortType);
		if (sortType === oFF.SortType.FIELD) {
			sortingOp = this.importFieldSorting(inaStructure, sortingManager,
					queryModel);
		} else {
			if (sortType === oFF.SortType.MEASURE) {
				sortingOp = this.importMeasureSorting(inaStructure,
						sortingManager, queryModel);
			} else {
				if (sortType === oFF.SortType.DATA_CELL_VALUE
						|| sortType === oFF.SortType.COMPLEX
						&& (sortingManager.supportsComplexSorting() || sortingManager
								.supportsDataCellSorting())) {
					sortingOp = this.importPathSorting(importer, inaStructure,
							context, sortingManager, queryModel, sortType);
				} else {
					sortingOp = this.importDimensionSorting(inaStructure,
							sortingManager, queryModel, sortType);
				}
			}
		}
		if (oFF.notNull(sortingOp)) {
			this.importGenericSorting(inaStructure, sortingOp, queryModel);
		}
		return sortingOp;
	};
	oFF.QInARepoSortOperation.prototype.importGenericSorting = function(
			inaStructure, sortingOp, queryModel) {
		var inaDirection = inaStructure.getStringByKey("Direction");
		var sortDirection;
		var dimName;
		var inaCollator;
		if (oFF.notNull(inaDirection)) {
			sortDirection = oFF.QInAConverter
					.lookupSortDirection2(inaDirection);
			if (oFF.notNull(sortDirection)) {
				sortingOp.setDirection(sortDirection);
			}
		}
		if (sortingOp.supportsPreserveGrouping()
				&& sortingOp.supportsBreakGrouping()) {
			sortingOp.setPreserveGrouping(inaStructure.getBooleanByKeyExt(
					"PreserveGrouping", false));
		}
		if (sortingOp.supportsDimension()) {
			dimName = inaStructure.getStringByKey("Dimension");
			if (oFF.isNull(dimName)) {
				sortingOp.setDimension(null);
			} else {
				sortingOp.setDimension(queryModel
						.getDimensionByNameFromExistingMetadata(dimName));
			}
		}
		if (queryModel.supportsLocaleSorting()) {
			inaCollator = inaStructure.getStructureByKey("Collator");
			if (oFF.notNull(inaCollator)) {
				sortingOp.setIsCaseSensitive(inaCollator.getBooleanByKeyExt(
						"CaseSensitive", false));
				sortingOp.setLocale(inaCollator.getStringByKeyExt("Locale",
						null));
			}
		}
	};
	oFF.QInARepoSortOperation.prototype.importDimensionSorting = function(
			inaStructure, sortingManager, queryModel, sortType) {
		var dimensionName = inaStructure.getStringByKey("Dimension");
		var dimension;
		var dimensionSorting;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(dimensionName)) {
			dimension = queryModel
					.getDimensionByNameFromExistingMetadata(dimensionName);
			if (sortingManager.supportsDimensionSorting(dimension, sortType)) {
				dimensionSorting = sortingManager
						.newDimensionSorting(dimension);
				if (oFF.isNull(dimensionSorting)) {
					return null;
				}
				if (sortType === oFF.SortType.FILTER) {
					dimensionSorting.setSortByFilter();
				} else {
					if (sortType === oFF.SortType.MEMBER_KEY) {
						dimensionSorting.setSortByKey();
						dimensionSorting.setCustomSort(this
								.getCustomSortOrder(inaStructure));
						dimensionSorting.setCustomSortPosition(this
								.getCustomSortPosition(inaStructure));
					} else {
						if (sortType === oFF.SortType.MEMBER_TEXT) {
							dimensionSorting.setSortByText();
						} else {
							if (sortType === oFF.SortType.HIERARCHY) {
								dimensionSorting.setSortByHierarchy();
							}
						}
					}
				}
				return dimensionSorting;
			}
		}
		return null;
	};
	oFF.QInARepoSortOperation.prototype.importPathSorting = function(importer,
			inaStructure, context, sortingManager, queryModel, sortType) {
		var inaPath = inaStructure.getListByKey("SortTuple");
		var path;
		var idxStruct;
		var pathElement;
		var fieldName;
		var inaValue;
		var field;
		var inaHierarchyName;
		var dimElement;
		if (inaPath.isEmpty()) {
			return null;
		}
		path = oFF.XList.create();
		for (idxStruct = 0; idxStruct < inaPath.size(); idxStruct++) {
			pathElement = inaPath.getStructureAt(idxStruct);
			fieldName = pathElement.getStringByKey("FieldName");
			inaValue = pathElement.getStringByKey("Value");
			if (oFF.isNull(fieldName) || oFF.isNull(inaValue)) {
				return null;
			}
			field = queryModel.getFieldByName(fieldName);
			if (oFF.isNull(field)) {
				return null;
			}
			inaHierarchyName = pathElement.getStringByKey("Hierarchy");
			dimElement = oFF.QSelectValue._createDimensionElement2(context,
					field, inaHierarchyName, inaValue);
			oFF.QInAImportUtil.importComponentTagging(importer, pathElement,
					dimElement);
			path.add(dimElement);
		}
		if (sortType === oFF.SortType.DATA_CELL_VALUE) {
			return sortingManager.newDataCellSorting(path);
		}
		return sortingManager.newComplexSorting(path);
	};
	oFF.QInARepoSortOperation.prototype.importMeasureSorting = function(
			inaStructure, sortingManager, queryModel) {
		var measureSorting = null;
		var measureName = inaStructure.getStringByKey("MeasureName");
		var measureStructure;
		var measure;
		var structureName;
		var structure;
		if (oFF.notNull(measureName)) {
			measureStructure = queryModel.getMeasureDimension();
			measure = measureStructure.getStructureMember(measureName);
			if (oFF.notNull(measure) && sortingManager.supportsMeasureSorting()) {
				measureSorting = sortingManager.newMeasureSorting(measure);
			}
			structureName = inaStructure.getStringByKey("StructureName");
			structure = queryModel.getNonMeasureDimension();
			if (oFF.notNull(structureName) && oFF.notNull(structure)
					&& oFF.notNull(measureSorting)) {
				measureSorting.setStructure(structure
						.getStructureMember(structureName));
			}
		}
		return measureSorting;
	};
	oFF.QInARepoSortOperation.prototype.importFieldSorting = function(
			inaStructure, sortingManager, queryModel) {
		var fieldSorting = null;
		var fieldName = inaStructure.getStringByKey("FieldName");
		var field;
		if (oFF.notNull(fieldName)) {
			field = queryModel.getFieldByName(fieldName);
			if (oFF.notNull(field)
					&& sortingManager.supportsFieldSorting(field)) {
				fieldSorting = sortingManager.newFieldSorting(field);
				fieldSorting.setCustomSort(this
						.getCustomSortOrder(inaStructure));
				fieldSorting.setCustomSortPosition(this
						.getCustomSortPosition(inaStructure));
			}
		}
		return fieldSorting;
	};
	oFF.QInARepoSortOperation.prototype.getCustomSortPosition = function(
			inaStructure) {
		var customSortPosition = inaStructure
				.getStringByKey("CustomSortPosition");
		if (oFF.notNull(customSortPosition)) {
			return oFF.CustomSortPosition.lookup(customSortPosition);
		}
		return null;
	};
	oFF.QInARepoSortOperation.prototype.getCustomSortOrder = function(
			inaStructure) {
		var customOrder = null;
		var customOrderList = inaStructure.getListByKey("CustomSort");
		var customOrderIndex;
		if (oFF.notNull(customOrderList) && customOrderList.hasElements()) {
			customOrder = oFF.XListOfString.create();
			for (customOrderIndex = 0; customOrderIndex < customOrderList
					.size(); customOrderIndex++) {
				customOrder.add(customOrderList.getStringAt(customOrderIndex));
			}
		}
		return customOrder;
	};
	oFF.QInARepoSortOperation.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var sortingOp = modelComponent;
		var sortingType = sortingOp.getSortingType();
		var measureDimensionSorting;
		this.exportGenericSorting(inaStructure, sortingOp, sortingType);
		if (sortingType === oFF.SortType.FIELD) {
			this.exportFieldSorting(inaStructure, sortingOp);
		} else {
			if (sortingType === oFF.SortType.MEASURE) {
				this.exportMeasureSorting(inaStructure, sortingOp);
			} else {
				if (sortingType === oFF.SortType.DATA_CELL_VALUE
						|| sortingType === oFF.SortType.COMPLEX) {
					this.exportPathSorting(exporter, inaStructure, sortingOp);
				} else {
					if (sortingType === oFF.SortType.MEMBER_KEY) {
						measureDimensionSorting = sortingOp;
						this.exportCustomSortDetails(measureDimensionSorting
								.getCustomSort(), measureDimensionSorting
								.getCustomSortPosition(), inaStructure);
					}
				}
			}
		}
		return inaStructure;
	};
	oFF.QInARepoSortOperation.prototype.exportFieldSorting = function(
			inaStructure, sortingOp) {
		var fieldSorting = sortingOp;
		inaStructure.putString("FieldName", fieldSorting.getField().getName());
		this.exportCustomSortDetails(fieldSorting.getCustomSort(), fieldSorting
				.getCustomSortPosition(), inaStructure);
	};
	oFF.QInARepoSortOperation.prototype.exportCustomSortDetails = function(
			customOrder, customSortPosition, inaStructure) {
		var customOrderList;
		var customOrderSize;
		var customOrderIndex;
		if (oFF.XCollectionUtils.hasElements(customOrder)) {
			customOrderList = inaStructure.putNewList("CustomSort");
			customOrderSize = customOrder.size();
			for (customOrderIndex = 0; customOrderIndex < customOrderSize; customOrderIndex++) {
				customOrderList.addString(customOrder.get(customOrderIndex));
			}
		}
		oFF.QInAExportUtil.setNameIfNotNull(inaStructure, "CustomSortPosition",
				customSortPosition);
	};
	oFF.QInARepoSortOperation.prototype.exportGenericSorting = function(
			inaStructure, sortingOp, sortingType) {
		var inaSortType = oFF.QInAConverter.lookupSortTypeInA(sortingType);
		var direction;
		var inaCollator;
		inaStructure.putString("SortType", inaSortType);
		direction = sortingOp.getDirection();
		if (direction !== oFF.XSortDirection.DEFAULT_VALUE) {
			inaStructure.putString("Direction", oFF.QInAConverter
					.lookupSortDirectionInA2(direction));
		}
		if (sortingOp.supportsPreserveGrouping()
				&& sortingOp.supportsBreakGrouping()) {
			inaStructure.putBoolean("PreserveGrouping", sortingOp
					.isPreserveGroupingEnabled());
		}
		if (sortingOp.getQueryModel().supportsLocaleSorting()) {
			inaCollator = oFF.PrFactory.createStructure();
			inaCollator
					.putBoolean("CaseSensitive", sortingOp.isCaseSensitive());
			inaCollator.putString("Locale", sortingOp.getLocale());
			inaStructure.put("Collator", inaCollator);
		}
		if (sortingOp.supportsDimension()) {
			oFF.QInAExportUtil.setNameIfNotNull(inaStructure, "Dimension",
					sortingOp.getDimension());
		}
	};
	oFF.QInARepoSortOperation.prototype.exportPathSorting = function(exporter,
			inaStructure, sortingOp) {
		var pathOperation = sortingOp;
		var inaPath = inaStructure.putNewList("SortTuple");
		var elementPath = pathOperation.getElementPath();
		var size = elementPath.size();
		var i;
		var dimElement;
		var inaPathElement;
		var selectHierarchyName;
		for (i = 0; i < size; i++) {
			dimElement = elementPath.get(i);
			inaPathElement = inaPath.addNewStructure();
			inaPathElement.putString("FieldName", dimElement.getSelectField()
					.getName());
			inaPathElement.putString("Value", dimElement.getSelectValue());
			selectHierarchyName = dimElement.getSelectHierarchyName();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(selectHierarchyName)) {
				inaPathElement.putString("Hierarchy", selectHierarchyName);
			}
			oFF.QInAExportUtil.extendStructureWithTagging(exporter, dimElement,
					inaPathElement);
		}
	};
	oFF.QInARepoSortOperation.prototype.exportMeasureSorting = function(
			inaStructure, sortingOp) {
		var measureSorting = sortingOp;
		var measureName = measureSorting.getMeasure().getName();
		inaStructure.putString("MeasureName", measureName);
		oFF.QInAExportUtil.setNameIfNotNull(inaStructure, "StructureName",
				measureSorting.getStructure());
	};
	oFF.QInARepoTotals = function() {
	};
	oFF.QInARepoTotals.prototype = new oFF.QInARepository();
	oFF.QInARepoTotals.prototype.getComponentType = function() {
		return oFF.OlapComponentType.TOTALS;
	};
	oFF.QInARepoTotals.prototype.getTagName = function() {
		return "ResultStructureRepo";
	};
	oFF.QInARepoTotals.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var rc = modelComponent;
		var rsAlignment;
		var inaAlignment;
		var inaResultStructure;
		var advancedResultStructure;
		var i;
		var inaElement;
		var inaResult;
		var result;
		var resultSetVisibility;
		var inaVisibility;
		var inaVisibilitySettings;
		var visibility;
		var k;
		var inaTriplet;
		var alignment;
		var element;
		var cvisibility;
		if (!rc.supportsTotals()) {
			return rc;
		}
		rsAlignment = null;
		if (rc.supportsResultAlignment()) {
			inaAlignment = inaStructure.getStringByKey("ResultAlignment");
			if (oFF.XString.isEqual("Default", inaAlignment)) {
				rc.restoreTotalsAlignment(oFF.RestoreAction.DEFAULT_VALUE,
						false);
			} else {
				rsAlignment = oFF.QInAConverter.lookupAlignment(inaAlignment);
				rc.setResultAlignmentBase(rsAlignment, false);
			}
		}
		if (rsAlignment === oFF.ResultAlignment.STRUCTURE) {
			inaResultStructure = inaStructure.getListByKey("ResultStructure");
			if (oFF.notNull(inaResultStructure)) {
				advancedResultStructure = rc.getAdvancedResultStructure();
				advancedResultStructure.clear();
				for (i = 0; i < inaResultStructure.size(); i++) {
					inaElement = inaResultStructure.getStructureAt(i);
					inaResult = inaElement.getStringByKey("Result");
					result = oFF.QInAConverter
							.lookupResultStructureElement(inaResult);
					resultSetVisibility = oFF.QInAConverter
							.lookupResultSetVisibility(inaElement
									.getStringByKey("Visibility"));
					advancedResultStructure.addWithVisibility(result,
							resultSetVisibility);
				}
			}
		} else {
			if (rc.supportsResultVisibility()) {
				inaVisibility = inaStructure.getStringByKey("Visibility");
				if (oFF.XString.isEqual("Default", inaVisibility)) {
					rc.restoreTotalsVisibility(oFF.RestoreAction.DEFAULT_VALUE,
							false);
				} else {
					inaVisibilitySettings = inaStructure
							.getListByKey("VisibilitySettings");
					if (oFF.isNull(inaVisibilitySettings)) {
						visibility = oFF.QInAConverter
								.lookupResultSetVisibility(inaVisibility);
						rc.setResultVisibility(visibility);
					} else {
						rc.clearResultVisibilitySettings();
						for (k = 0; k < inaVisibilitySettings.size(); k++) {
							inaTriplet = inaVisibilitySettings
									.getStructureAt(k);
							alignment = oFF.QInAConverter
									.lookupAlignment(inaTriplet
											.getStringByKey("ResultAlignment"));
							element = oFF.QInAConverter
									.lookupResultStructureElement(inaTriplet
											.getStringByKey("Result"));
							cvisibility = oFF.QInAConverter
									.lookupResultSetVisibility(inaTriplet
											.getStringByKey("Visibility"));
							rc.setResultVisibilityByElementAndAlignment(
									alignment, element, cvisibility);
						}
					}
				}
			}
		}
		return rc;
	};
	oFF.QInARepoTotals.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var rc = modelComponent;
		var resultAlignment;
		var structure;
		var resultStructure;
		var i;
		var item;
		var resultStructureLine;
		var element;
		var visibility;
		var inaVisibility;
		var settings;
		var inaVisibilitySettings;
		var triplet;
		var inaTriplet;
		if (!rc.supportsTotals()) {
			return null;
		}
		resultAlignment = null;
		if (rc.supportsResultAlignment()) {
			if (rc.isTotalsAlignmentOnDefault()) {
				inaStructure.putString("ResultAlignment", "Default");
			} else {
				resultAlignment = rc.getResultAlignment();
				inaStructure.putString("ResultAlignment", oFF.QInAConverter
						.lookupAlignmentInA(resultAlignment));
			}
		}
		if (resultAlignment === oFF.ResultAlignment.STRUCTURE) {
			structure = inaStructure.putNewList("ResultStructure");
			resultStructure = rc.getTotalsStructure();
			if (oFF.notNull(resultStructure)) {
				for (i = 0; i < resultStructure.size(); i++) {
					item = resultStructure.get(i);
					resultStructureLine = structure.addNewStructure();
					element = item.getResultStructureElement();
					resultStructureLine.putString("Result", oFF.QInAConverter
							.lookupResultStructureElementInA(element));
					visibility = item.getResultVisibility();
					resultStructureLine.putString("Visibility",
							oFF.QInAConverter
									.lookupResultSetVisibilityInA(visibility));
				}
			}
			return inaStructure;
		}
		if (rc.supportsResultVisibility()) {
			if (rc.isTotalsVisibilityOnDefault()) {
				inaStructure.putString("Visibility", "Default");
			} else {
				inaVisibility = oFF.QInAConverter
						.lookupResultSetVisibilityInA(rc.getResultVisibility());
				inaStructure.putString("Visibility", inaVisibility);
				settings = rc.getResultVisibilitySettings();
				if (oFF.notNull(settings)) {
					inaVisibilitySettings = inaStructure
							.putNewList("VisibilitySettings");
					while (settings.hasNext()) {
						triplet = settings.next();
						inaTriplet = inaVisibilitySettings.addNewStructure();
						inaTriplet.putString("ResultAlignment",
								oFF.QInAConverter.lookupAlignmentInA(triplet
										.getAlignment()));
						inaTriplet.putString("Result", oFF.QInAConverter
								.lookupResultStructureElementInA(triplet
										.getElement()));
						inaTriplet.putString("Visibility", oFF.QInAConverter
								.lookupResultSetVisibilityInA(triplet
										.getVisibility()));
					}
					oFF.XObjectExt.release(settings);
				}
			}
		}
		return inaStructure;
	};
	oFF.QInARepoVarDimMember = function() {
	};
	oFF.QInARepoVarDimMember.prototype = new oFF.QInARepository();
	oFF.QInARepoVarDimMember.prototype.getComponentType = function() {
		return oFF.VariableType.DIMENSION_MEMBER_VARIABLE;
	};
	oFF.QInARepoVarDimMember.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var memberVariable = modelComponent;
		var skipExitSelection = memberVariable.isEnforcedDynamicValue()
				&& modelComponent.getQueryManager()
						.isSuppressExitVariableValuesInRepoMode();
		var inaFilterElement;
		var filterElement;
		if (!skipExitSelection) {
			inaFilterElement = inaStructure.getStructureByKey("Selection");
			if (oFF.isNull(inaFilterElement)) {
				memberVariable.setMemberFilter(null);
			} else {
				filterElement = importer.importComponent(null,
						inaFilterElement, null, memberVariable, context);
				memberVariable.setMemberFilter(filterElement);
			}
		}
		return memberVariable;
	};
	oFF.QInARepoVarDimMember.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var memberVariable = modelComponent;
		var skipExitSelection;
		var memberSelection;
		var memberSelectionComponent;
		inaStructure.putString("Name", memberVariable.getName());
		skipExitSelection = memberVariable.isEnforcedDynamicValue()
				&& modelComponent.getQueryManager()
						.isSuppressExitVariableValuesInRepoMode();
		if (memberVariable.hasMemberFilter() && !skipExitSelection) {
			memberSelection = memberVariable.getMemberFilter();
			memberSelectionComponent = exporter.exportComponent(null,
					memberSelection, null, flags);
			if (oFF.notNull(memberSelectionComponent)) {
				inaStructure.put("Selection", memberSelectionComponent);
			}
		}
		return inaStructure;
	};
	oFF.InARsDataCellProvider = function() {
	};
	oFF.InARsDataCellProvider.prototype = new oFF.DfApplicationContext();
	oFF.InARsDataCellProvider.create = function(application, queryProvider) {
		var provider = new oFF.InARsDataCellProvider();
		provider.setupProvider(application, queryProvider);
		return provider;
	};
	oFF.InARsDataCellProvider.prototype.m_supportsDataCellMixedValues = false;
	oFF.InARsDataCellProvider.prototype.m_supportsSAPDateFormat = false;
	oFF.InARsDataCellProvider.prototype.m_supportsInputReadinessStates = false;
	oFF.InARsDataCellProvider.prototype.m_supportsComplexUnits = false;
	oFF.InARsDataCellProvider.prototype.m_ocpStructure = null;
	oFF.InARsDataCellProvider.prototype.m_exceptionSettings = null;
	oFF.InARsDataCellProvider.prototype.m_rowsCount = 0;
	oFF.InARsDataCellProvider.prototype.m_columnsCount = 0;
	oFF.InARsDataCellProvider.prototype.m_csValueException = null;
	oFF.InARsDataCellProvider.prototype.m_csMaxAlertLevelName = null;
	oFF.InARsDataCellProvider.prototype.m_csMaxAlertLevel = null;
	oFF.InARsDataCellProvider.prototype.m_csExceptionSetting = null;
	oFF.InARsDataCellProvider.prototype.m_csExceptionPriority = null;
	oFF.InARsDataCellProvider.prototype.m_lastX = 0;
	oFF.InARsDataCellProvider.prototype.m_lastY = 0;
	oFF.InARsDataCellProvider.prototype.m_valueType = null;
	oFF.InARsDataCellProvider.prototype.m_csStringValue = null;
	oFF.InARsDataCellProvider.prototype.m_csFormattedValue = null;
	oFF.InARsDataCellProvider.prototype.m_csFormatString = null;
	oFF.InARsDataCellProvider.prototype.m_csPlanningCommandIds = null;
	oFF.InARsDataCellProvider.prototype.m_csQueryDataCellReference = null;
	oFF.InARsDataCellProvider.prototype.m_csFormattedCurrencyUnit = null;
	oFF.InARsDataCellProvider.prototype.m_csCurrencyUnit = null;
	oFF.InARsDataCellProvider.prototype.m_csDoubleValue = 0;
	oFF.InARsDataCellProvider.prototype.m_csCurrencyUnitType = 0;
	oFF.InARsDataCellProvider.prototype.m_csCurrencyUnitPosition = 0;
	oFF.InARsDataCellProvider.prototype.m_csComplexUnitIndex = 0;
	oFF.InARsDataCellProvider.prototype.m_csInputReadinessIndex = 0;
	oFF.InARsDataCellProvider.prototype.m_csInputEnabled = false;
	oFF.InARsDataCellProvider.prototype.m_csLockedValue = false;
	oFF.InARsDataCellProvider.prototype.m_csIsInsideBounds = false;
	oFF.InARsDataCellProvider.prototype.m_exceptions = null;
	oFF.InARsDataCellProvider.prototype.m_inputEnabled = null;
	oFF.InARsDataCellProvider.prototype.m_inputReadinessIndex = null;
	oFF.InARsDataCellProvider.prototype.m_lockedValue = null;
	oFF.InARsDataCellProvider.prototype.m_unitDescriptions = null;
	oFF.InARsDataCellProvider.prototype.m_unitTypes = null;
	oFF.InARsDataCellProvider.prototype.m_unitPositions = null;
	oFF.InARsDataCellProvider.prototype.m_units = null;
	oFF.InARsDataCellProvider.prototype.m_values = null;
	oFF.InARsDataCellProvider.prototype.m_roundedValues = null;
	oFF.InARsDataCellProvider.prototype.m_valuesFormatted = null;
	oFF.InARsDataCellProvider.prototype.m_formatStrings = null;
	oFF.InARsDataCellProvider.prototype.m_cellValueTypes = null;
	oFF.InARsDataCellProvider.prototype.m_cellDataTypes = null;
	oFF.InARsDataCellProvider.prototype.m_queryDataCellReferences = null;
	oFF.InARsDataCellProvider.prototype.m_exceptionNameWithSettings = null;
	oFF.InARsDataCellProvider.prototype.m_exceptionName = null;
	oFF.InARsDataCellProvider.prototype.m_exceptionAlertLevel = null;
	oFF.InARsDataCellProvider.prototype.m_exceptionSettingIndex = null;
	oFF.InARsDataCellProvider.prototype.m_planningCommandIds = null;
	oFF.InARsDataCellProvider.prototype.m_complexUnitIndices = null;
	oFF.InARsDataCellProvider.prototype.m_supportsUnifiedDataCells = false;
	oFF.InARsDataCellProvider.prototype.m_csDecimalPlaces = 0;
	oFF.InARsDataCellProvider.prototype.m_csScalingFactor = 0;
	oFF.InARsDataCellProvider.prototype.m_decimalPlaces = null;
	oFF.InARsDataCellProvider.prototype.m_scalingFactors = null;
	oFF.InARsDataCellProvider.prototype.setupProvider = function(application,
			queryProvider) {
		this.setupApplicationContext(application);
		this.m_supportsSAPDateFormat = queryProvider
				.supportsAnalyticCapabilityActive(oFF.InACapabilities.SAP_DATE);
		this.m_supportsUnifiedDataCells = queryProvider
				.supportsAnalyticCapabilityActive(oFF.InACapabilities.UNIFIED_DATA_CELLS);
		this.m_supportsDataCellMixedValues = queryProvider
				.supportsAnalyticCapabilityActive(oFF.InACapabilities.DATA_CELL_MIXED_VALUES);
		this.m_supportsInputReadinessStates = queryProvider
				.supportsInputReadinessStates();
		this.m_supportsComplexUnits = queryProvider
				.supportsAnalyticCapabilityActive(oFF.InactiveCapabilities.RESULTSET_UNIT_INDEX
						.getName());
	};
	oFF.InARsDataCellProvider.prototype.releaseObject = function() {
		this.m_ocpStructure = null;
		this.m_exceptionSettings = null;
		this.m_csValueException = null;
		this.m_csMaxAlertLevelName = null;
		this.m_csExceptionSetting = oFF.XObjectExt
				.release(this.m_csExceptionSetting);
		this.m_csExceptionPriority = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_csExceptionPriority);
		this.m_csMaxAlertLevel = null;
		this.m_csFormattedValue = null;
		this.m_csFormatString = null;
		this.m_csPlanningCommandIds = null;
		this.m_csQueryDataCellReference = null;
		this.m_csFormattedCurrencyUnit = null;
		this.m_csCurrencyUnit = null;
		this.m_exceptions = oFF.XObjectExt.release(this.m_exceptions);
		this.m_inputEnabled = oFF.XObjectExt.release(this.m_inputEnabled);
		this.m_inputReadinessIndex = oFF.XObjectExt
				.release(this.m_inputReadinessIndex);
		this.m_lockedValue = oFF.XObjectExt.release(this.m_lockedValue);
		this.m_unitDescriptions = oFF.XObjectExt
				.release(this.m_unitDescriptions);
		this.m_unitTypes = oFF.XObjectExt.release(this.m_unitTypes);
		this.m_unitPositions = oFF.XObjectExt.release(this.m_unitPositions);
		this.m_units = oFF.XObjectExt.release(this.m_units);
		this.m_values = oFF.XObjectExt.release(this.m_values);
		this.m_valuesFormatted = oFF.XObjectExt.release(this.m_valuesFormatted);
		this.m_formatStrings = oFF.XObjectExt.release(this.m_formatStrings);
		this.m_cellValueTypes = oFF.XObjectExt.release(this.m_cellValueTypes);
		this.m_cellDataTypes = oFF.XObjectExt.release(this.m_cellDataTypes);
		this.m_queryDataCellReferences = oFF.XObjectExt
				.release(this.m_queryDataCellReferences);
		this.m_exceptionNameWithSettings = null;
		this.m_exceptionName = oFF.XObjectExt.release(this.m_exceptionName);
		this.m_exceptionAlertLevel = oFF.XObjectExt
				.release(this.m_exceptionAlertLevel);
		this.m_exceptionSettingIndex = oFF.XObjectExt
				.release(this.m_exceptionSettingIndex);
		this.m_planningCommandIds = oFF.XObjectExt
				.release(this.m_planningCommandIds);
		this.m_decimalPlaces = oFF.XObjectExt.release(this.m_decimalPlaces);
		this.m_scalingFactors = oFF.XObjectExt.release(this.m_scalingFactors);
		this.m_complexUnitIndices = oFF.XObjectExt
				.release(this.m_complexUnitIndices);
		oFF.DfApplicationContext.prototype.releaseObject.call(this);
	};
	oFF.InARsDataCellProvider.prototype.setOcpStructure = function(
			ocpStructure, columnsCount, rowsCount, exceptionSettings) {
		this.m_ocpStructure = ocpStructure;
		this.m_rowsCount = rowsCount;
		this.m_columnsCount = columnsCount;
		if (oFF.notNull(this.m_ocpStructure)) {
			this.m_exceptions = this.getColumn("Exceptions");
			if (oFF.isNull(exceptionSettings)) {
				this.m_exceptionName = this.getColumn("ExceptionName");
				this.m_exceptionAlertLevel = this
						.getColumn("ExceptionAlertLevel");
			} else {
				this.m_exceptionSettings = exceptionSettings;
				this.m_exceptionSettingIndex = this
						.getColumn("ExceptionSettingIndex");
			}
			if (this.m_supportsInputReadinessStates) {
				this.m_inputReadinessIndex = this
						.getColumn("InputReadinessIndex");
			} else {
				this.m_inputEnabled = this.getColumn("InputEnabled");
			}
			this.m_lockedValue = this.getColumn("LockedValue");
			this.m_unitDescriptions = this.getColumn("UnitDescriptions");
			this.m_unitTypes = this.getColumn("UnitTypes");
			this.m_unitPositions = this.getColumn("UnitPositions");
			this.m_units = this.getColumn("Units");
			if (this.m_supportsComplexUnits) {
				this.m_complexUnitIndices = this.getColumn("UnitIndex");
			}
			this.m_values = this.getColumn("Values");
			this.m_valuesFormatted = this.getColumn("ValuesFormatted");
			if (this.m_supportsDataCellMixedValues) {
				this.m_roundedValues = this.getColumn("ValuesRounded");
			} else {
				this.m_roundedValues = null;
			}
			this.m_planningCommandIds = this.getColumn("Actions");
			this.m_formatStrings = this.getColumn("CellFormat");
			this.m_cellValueTypes = this.getColumn("CellValueTypes");
			this.m_cellDataTypes = this.getColumn("CellDataType");
			this.m_queryDataCellReferences = this
					.getColumn("QueryDataCellReferences");
			if (this.m_supportsUnifiedDataCells) {
				this.m_decimalPlaces = this.getColumn("NumericRounding");
				this.m_scalingFactors = this.getColumn("NumericShift");
			}
		}
		this.m_lastX = -1;
		this.m_lastY = -1;
		this.m_csIsInsideBounds = true;
		this.m_csMaxAlertLevel = oFF.AlertLevel.NORMAL;
	};
	oFF.InARsDataCellProvider.prototype.getColumn = function(name) {
		var inaValueElement = this.m_ocpStructure.getStructureByKey(name);
		if (oFF.isNull(inaValueElement)) {
			return null;
		}
		return oFF.InARsEncodedValues.createByStructure(inaValueElement);
	};
	oFF.InARsDataCellProvider.prototype.resetIfNotNull = function(cursor) {
		if (oFF.notNull(cursor)) {
			cursor.resetCursor();
		}
	};
	oFF.InARsDataCellProvider.prototype.resetCursor = function() {
		this.m_lastX = -1;
		this.m_lastY = -1;
		this.m_csIsInsideBounds = true;
		this.resetIfNotNull(this.m_exceptions);
		this.resetIfNotNull(this.m_exceptionName);
		this.resetIfNotNull(this.m_exceptionAlertLevel);
		this.resetIfNotNull(this.m_exceptionSettingIndex);
		this.resetIfNotNull(this.m_inputEnabled);
		this.resetIfNotNull(this.m_inputReadinessIndex);
		this.resetIfNotNull(this.m_lockedValue);
		this.resetIfNotNull(this.m_unitDescriptions);
		this.resetIfNotNull(this.m_unitTypes);
		this.resetIfNotNull(this.m_unitPositions);
		this.resetIfNotNull(this.m_units);
		this.resetIfNotNull(this.m_values);
		this.resetIfNotNull(this.m_roundedValues);
		this.resetIfNotNull(this.m_valuesFormatted);
		this.resetIfNotNull(this.m_planningCommandIds);
		this.resetIfNotNull(this.m_formatStrings);
		this.resetIfNotNull(this.m_cellValueTypes);
		this.resetIfNotNull(this.m_queryDataCellReferences);
		this.resetIfNotNull(this.m_cellDataTypes);
		this.resetIfNotNull(this.m_decimalPlaces);
		this.resetIfNotNull(this.m_scalingFactors);
		this.resetIfNotNull(this.m_complexUnitIndices);
	};
	oFF.InARsDataCellProvider.prototype.notifyCursorChange = function(cell, x,
			y) {
		cell.setColumn(x);
		cell.setRow(y);
		cell.reset();
		if (y < this.m_lastY || y === this.m_lastY && x < this.m_lastX) {
			this.resetCursor();
		}
		while (this.m_csIsInsideBounds
				&& (y > this.m_lastY || x > this.m_lastX)) {
			this.readNextIndex();
			this.m_lastX++;
			if (this.m_lastX >= this.m_columnsCount || this.m_lastY === -1) {
				this.m_lastX = 0;
				this.m_lastY++;
			}
		}
		if (!this.m_csIsInsideBounds) {
			cell.setValueException(oFF.ValueException.NULL_VALUE);
			if (this.m_supportsUnifiedDataCells) {
				cell.setFormattedValue("");
			} else {
				cell.setFormattedValue(oFF.ValueException.NULL_VALUE.getName());
			}
			cell.setInitialValue(null);
		} else {
			if (y === this.m_lastY && x === this.m_lastX) {
				this.updateValidCell(cell);
			} else {
				cell.setValueException(oFF.ValueException.NULL_VALUE);
				if (this.m_supportsUnifiedDataCells) {
					cell.setFormattedValue("");
				} else {
					cell.setFormattedValue(oFF.ValueException.NULL_VALUE
							.getName());
				}
				cell.setInitialValue(null);
			}
		}
	};
	oFF.InARsDataCellProvider.prototype.updateValidCell = function(cell) {
		var isValueExceptionIndicationEmptyValue;
		var planningCommandIdsBase;
		var planningCommandIds;
		cell.setValueType(this.m_valueType);
		isValueExceptionIndicationEmptyValue = this.m_supportsUnifiedDataCells
				&& this.m_csValueException !== oFF.ValueException.NORMAL
				&& this.m_csValueException !== oFF.ValueException.ZERO
				&& this.m_csValueException !== oFF.ValueException.MIXED_CURRENCIES_OR_UNITS;
		if (this.m_csValueException === oFF.ValueException.NULL_VALUE
				|| this.m_csValueException === oFF.ValueException.UNDEFINED
				|| isValueExceptionIndicationEmptyValue) {
			cell.setInitialValue(null);
		} else {
			cell.setInitialValue(this.getXValue());
		}
		if (isValueExceptionIndicationEmptyValue) {
			cell.setFormattedValue("");
		} else {
			cell.setFormattedValue(this.m_csFormattedValue);
		}
		cell.setFormatString(this.m_csFormatString);
		cell.setValueException(this.m_csValueException);
		if (oFF.isNull(this.m_csMaxAlertLevelName)) {
			cell.setMaxAlertLevelName(this.m_exceptionNameWithSettings);
		} else {
			cell.setMaxAlertLevelName(this.m_csMaxAlertLevelName);
		}
		cell.setMaxAlertLevel(this.m_csMaxAlertLevel);
		cell.setDataEntryEnabled(this.m_csInputEnabled);
		cell.setInputReadinessIndex(this.m_csInputReadinessIndex);
		cell.setExceptionSettings(this.m_csExceptionSetting);
		cell.setExceptionPriorities(this.m_csExceptionPriority);
		cell.setOriginalValueLock(this.m_csLockedValue);
		cell.setQueryDataCellReference(this.m_csQueryDataCellReference);
		if (oFF.notNull(this.m_complexUnitIndices)) {
			cell.setUnitIndex(this.m_csComplexUnitIndex);
		}
		this.updateCurrencyUnit(cell.getCurrencyUnitBase());
		planningCommandIdsBase = cell.getPlanningCommandIdsBase();
		planningCommandIdsBase.clear();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_csPlanningCommandIds)) {
			planningCommandIds = oFF.XStringTokenizer.splitString(
					this.m_csPlanningCommandIds, " ");
			if (oFF.notNull(planningCommandIds)) {
				planningCommandIdsBase.addAll(planningCommandIds);
			}
		}
		if (this.m_supportsUnifiedDataCells && !this.m_valueType.isNumber()) {
			cell.setDecimalPlaces(0);
			cell.setScalingFactor(0);
		} else {
			cell.setDecimalPlaces(this.m_csDecimalPlaces);
			cell.setScalingFactor(this.m_csScalingFactor);
		}
	};
	oFF.InARsDataCellProvider.prototype.updateCurrencyUnit = function(
			currencyUnitBase) {
		if (this.m_csCurrencyUnitType === 1) {
			currencyUnitBase.setIsEmpty(false);
			currencyUnitBase.setHasCurrency(true);
			currencyUnitBase.setHasUnit(false);
			currencyUnitBase.setIsMixed(false);
		} else {
			if (this.m_csCurrencyUnitType === 2) {
				currencyUnitBase.setIsEmpty(false);
				currencyUnitBase.setHasCurrency(false);
				currencyUnitBase.setHasUnit(true);
				currencyUnitBase.setIsMixed(false);
			} else {
				if (this.m_csCurrencyUnitType === 3) {
					currencyUnitBase.setIsEmpty(false);
					currencyUnitBase.setHasCurrency(true);
					currencyUnitBase.setHasUnit(true);
					currencyUnitBase.setIsMixed(false);
				} else {
					if (this.m_csCurrencyUnitType === -1) {
						currencyUnitBase.setIsEmpty(false);
						currencyUnitBase.setIsMixed(true);
						currencyUnitBase.setHasCurrency(true);
						currencyUnitBase.setHasUnit(true);
					} else {
						currencyUnitBase.setIsEmpty(true);
						currencyUnitBase.setHasCurrency(false);
						currencyUnitBase.setHasUnit(false);
						currencyUnitBase.setIsMixed(false);
					}
				}
			}
		}
		if (!currencyUnitBase.isEmpty()) {
			if (oFF.notNull(this.m_csFormattedCurrencyUnit)) {
				currencyUnitBase.setFormatted(this.m_csFormattedCurrencyUnit);
			}
			if (oFF.notNull(this.m_csCurrencyUnit)) {
				if (this.m_csCurrencyUnitPosition === 2) {
					currencyUnitBase.setPrefix(this.m_csCurrencyUnit);
				} else {
					currencyUnitBase.setSuffix(this.m_csCurrencyUnit);
				}
			}
		}
	};
	oFF.InARsDataCellProvider.prototype.getXValue = function() {
		if (this.m_valueType.isNumber()) {
			return oFF.XDoubleValue.create(this.m_csDoubleValue);
		} else {
			if (this.m_valueType === oFF.XValueType.TIMESPAN) {
				return oFF.XTimeSpan.create(oFF.XDouble
						.convertToLong(this.m_csDoubleValue));
			} else {
				if (this.m_valueType === oFF.XValueType.DATE) {
					return oFF.XDate.createDateFromStringWithFlag(
							this.m_csStringValue, this.m_supportsSAPDateFormat);
				} else {
					if (this.m_valueType === oFF.XValueType.TIME) {
						return oFF.XTime.createTimeFromStringWithFlag(
								this.m_csStringValue,
								this.m_supportsSAPDateFormat);
					} else {
						if (this.m_valueType === oFF.XValueType.DATE_TIME) {
							return oFF.XDateTime
									.createDateTimeFromStringWithFlag(
											this.m_csStringValue,
											this.m_supportsSAPDateFormat);
						} else {
							if (this.m_valueType === oFF.XValueType.STRING) {
								if (oFF.XStringUtils
										.isNotNullAndNotEmpty(this.m_csStringValue)) {
									return oFF.XStringValue
											.create(this.m_csStringValue);
								}
								return null;
							}
						}
					}
				}
			}
		}
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils
				.concatenate2("Unsupported type:", this.m_valueType.getName()));
	};
	oFF.InARsDataCellProvider.prototype.setExceptionSettings = function(
			exceptionSettingIndex) {
		var isAlertLevelInSettings = false;
		var activeExceptionSettings;
		var exceptionSize;
		var idx;
		var exceptionSetting;
		var exceptionSettingName;
		var exceptionSettingValue;
		var inaAlertLevel;
		if (exceptionSettingIndex === -1) {
			this.m_csExceptionSetting = null;
			this.m_csExceptionPriority = null;
			this.m_exceptionNameWithSettings = null;
		} else {
			activeExceptionSettings = this.m_exceptionSettings
					.getListAt(exceptionSettingIndex);
			this.m_csExceptionSetting = oFF.XHashMapOfStringByString.create();
			this.m_csExceptionPriority = oFF.XHashMapByString.create();
			exceptionSize = activeExceptionSettings.size();
			for (idx = 0; idx < exceptionSize; idx++) {
				exceptionSetting = activeExceptionSettings.getStructureAt(idx);
				exceptionSettingName = exceptionSetting
						.getStringByKey("SettingName");
				exceptionSettingValue = exceptionSetting
						.getStringByKey("Value");
				this.m_csExceptionSetting.put(exceptionSettingName,
						exceptionSettingValue);
				this.m_csExceptionPriority.put(exceptionSettingName,
						oFF.XIntegerValue.create(exceptionSetting
								.getIntegerByKey("Priority")));
				if (oFF.ExceptionSetting.getByName(exceptionSettingName) === oFF.ExceptionSetting.ALERT_LEVEL) {
					isAlertLevelInSettings = true;
					inaAlertLevel = oFF.XInteger.convertFromStringWithRadix(
							exceptionSettingValue, 10);
					this.m_csMaxAlertLevel = oFF.QInAConverter
							.lookupAlertLevel(inaAlertLevel);
					this.m_exceptionNameWithSettings = exceptionSetting
							.getStringByKey("ExceptionName");
				}
			}
		}
		if (!isAlertLevelInSettings) {
			this.m_csMaxAlertLevel = oFF.AlertLevel.NORMAL;
		}
	};
	oFF.InARsDataCellProvider.prototype.readNextIndex = function() {
		if (oFF.notNull(this.m_values) && this.m_values.hasNextValue()) {
			if (oFF.notNull(this.m_exceptions)) {
				this.m_csValueException = oFF.QInAConverter
						.lookupException(this.m_exceptions
								.getNextIntegerValue());
			}
			if (oFF.notNull(this.m_exceptionSettingIndex)) {
				this.setExceptionSettings(this.m_exceptionSettingIndex
						.getNextIntegerValue());
			} else {
				if (oFF.notNull(this.m_exceptionAlertLevel)) {
					this.m_csMaxAlertLevel = oFF.QInAConverter
							.lookupAlertLevel(this.m_exceptionAlertLevel
									.getNextIntegerValue());
				}
			}
			if (oFF.notNull(this.m_exceptionSettingIndex)) {
				this.m_csMaxAlertLevelName = this.m_exceptionNameWithSettings;
			} else {
				if (oFF.notNull(this.m_exceptionAlertLevel)) {
					this.m_csMaxAlertLevelName = this.m_exceptionName
							.getNextStringValue();
				}
			}
			if (oFF.notNull(this.m_valuesFormatted)) {
				this.m_csFormattedValue = this.m_valuesFormatted
						.getNextStringValue();
			}
			if (oFF.notNull(this.m_planningCommandIds)) {
				this.m_csPlanningCommandIds = this.m_planningCommandIds
						.getNextStringValue();
			}
			if (oFF.notNull(this.m_formatStrings)) {
				this.m_csFormatString = this.m_formatStrings
						.getNextStringValue();
			}
			if (oFF.notNull(this.m_queryDataCellReferences)) {
				this.m_csQueryDataCellReference = this.m_queryDataCellReferences
						.getNextStringValue();
			}
			if (oFF.notNull(this.m_units)) {
				this.m_csFormattedCurrencyUnit = this.m_units
						.getNextStringValue();
				this.m_csCurrencyUnitType = 1;
			}
			if (oFF.notNull(this.m_unitTypes)) {
				this.m_csCurrencyUnitType = this.m_unitTypes
						.getNextIntegerValue();
			}
			if (oFF.notNull(this.m_unitPositions)) {
				this.m_csCurrencyUnitPosition = this.m_unitPositions
						.getNextIntegerValue();
			}
			if (oFF.notNull(this.m_unitDescriptions)) {
				this.m_csCurrencyUnit = this.m_unitDescriptions
						.getNextStringValue();
			}
			if (oFF.notNull(this.m_complexUnitIndices)) {
				this.m_csComplexUnitIndex = this.m_complexUnitIndices
						.getNextIntegerValue();
			}
			this.readNextValues();
			if (oFF.isNull(this.m_inputEnabled)) {
				this.m_csInputEnabled = false;
			} else {
				this.m_csInputEnabled = this.m_inputEnabled
						.getNextIntegerValue() !== 0;
			}
			if (oFF.notNull(this.m_inputReadinessIndex)) {
				this.m_csInputReadinessIndex = this.m_inputReadinessIndex
						.getNextIntegerValue();
			}
			if (oFF.isNull(this.m_lockedValue)) {
				this.m_csLockedValue = false;
			} else {
				this.m_csLockedValue = this.m_lockedValue.getNextIntegerValue() !== 0;
			}
			if (oFF.notNull(this.m_decimalPlaces)) {
				this.m_csDecimalPlaces = this.m_decimalPlaces
						.getNextIntegerValue();
			}
			if (oFF.notNull(this.m_scalingFactors)) {
				this.m_csScalingFactor = this.m_scalingFactors
						.getNextIntegerValue();
			}
		} else {
			this.m_csIsInsideBounds = false;
		}
	};
	oFF.InARsDataCellProvider.prototype.readNextValues = function() {
		var cellDataTypeStr;
		var cellDataType;
		var inaValueType2;
		if (this.m_supportsDataCellMixedValues) {
			this.m_valueType = oFF.XValueType.DOUBLE;
			if (oFF.notNull(this.m_cellValueTypes)) {
				this.m_valueType = oFF.QInAConverter
						.lookupValueTypeByInt(this.m_cellValueTypes
								.getNextIntegerValue());
			}
			if (this.m_csValueException === oFF.ValueException.NORMAL
					|| this.m_csValueException === oFF.ValueException.MIXED_CURRENCIES_OR_UNITS) {
				if (this.m_valueType.isNumber()) {
					this.m_csDoubleValue = this.m_values.getNextDoubleValue();
				} else {
					this.m_csDoubleValue = 0;
					this.m_values.skip();
				}
				if (oFF.notNull(this.m_roundedValues)) {
					this.m_csStringValue = this.m_roundedValues
							.getNextStringValue();
				}
			} else {
				this.m_csDoubleValue = 0;
				this.m_csStringValue = null;
				this.m_values.skip();
				if (oFF.notNull(this.m_roundedValues)) {
					this.m_roundedValues.skip();
				}
			}
		} else {
			if (oFF.notNull(this.m_cellDataTypes)) {
				cellDataTypeStr = this.m_cellDataTypes.getNextStringValue();
				cellDataType = oFF.QInAConverter
						.lookupValueType(cellDataTypeStr);
				this.m_valueType = cellDataType;
				if (cellDataType.isNumber()) {
					this.m_csDoubleValue = this.m_values.getNextDoubleValue();
					this.m_csStringValue = null;
				} else {
					this.m_csStringValue = this.m_values.getNextStringValue();
					this.m_csDoubleValue = 0;
				}
			} else {
				if (oFF.notNull(this.m_cellValueTypes)) {
					inaValueType2 = this.m_cellValueTypes.getNextIntegerValue();
					this.m_valueType = oFF.QInAConverter
							.lookupValueTypeByInt(inaValueType2);
					this.m_csDoubleValue = this.m_values.getNextDoubleValue();
				} else {
					throw oFF.XException
							.createIllegalStateException("Bad protocol: Values cannot be retrieved");
				}
			}
		}
	};
	oFF.InARsDataCellProvider.prototype.getAvailableDataCellCount = function() {
		return this.m_columnsCount * this.m_rowsCount;
	};
	oFF.InARsDataCellProvider.prototype.getAvailableDataCellColumns = function() {
		return this.m_columnsCount;
	};
	oFF.InARsDataCellProvider.prototype.getAvailableDataCellRows = function() {
		return this.m_rowsCount;
	};
	oFF.QInA = function() {
	};
	oFF.QInA.prototype = new oFF.MessageManager();
	oFF.QInA.m_repoData91 = null;
	oFF.QInA.m_repoNoVar91 = null;
	oFF.QInA.s_lookupByFormat = null;
	oFF.QInA.staticSetup = function() {
		oFF.QInA.s_lookupByFormat = oFF.XHashMapByString.create();
		oFF.QInA.addAllFormats();
		oFF.QInA.addAllTypes();
		oFF.QInA.addAllComponents();
		oFF.QInA.removeEmptyContainers();
	};
	oFF.QInA.addAllComponents = function() {
		oFF.QInA.addInAComponent(new oFF.QInAMdVariableContainer());
		oFF.QInA.addInAComponent(new oFF.QInAMdVarDimMember());
		oFF.QInA.addInAComponent(new oFF.QInAMdVarOptionList());
		oFF.QInA.addInAComponent(new oFF.QInAMdVariable());
		oFF.QInA.addInAComponent(new oFF.QInAMdBasicMeasure());
		oFF.QInA.addInAComponent(new oFF.QInAMdField());
		oFF.QInA.addInAComponent(new oFF.QInAMdDimension());
		oFF.QInA.addInAComponent(new oFF.QInAMdSort());
		oFF.QInA.addInAComponent(new oFF.QInAMdDrillManager());
		oFF.QInA.addInAComponent(new oFF.QInAMdExceptionAggregationManager());
		oFF.QInA.addInAComponent(new oFF.QInAMdUniversalDisplayHierarchies());
		oFF.QInA.addInAComponent(new oFF.QInAMdQuery());
		oFF.QInA.addInAComponent(new oFF.QInAMdGenericComponent());
		oFF.QInA.addInAComponent(new oFF.QInARepoField());
		oFF.QInA.addInAComponent(new oFF.QInARepoTotals());
		oFF.QInA.addInAComponent(new oFF.QInARepoSortOperation());
		oFF.QInA.addInAComponent(new oFF.QInARepoDimension());
		oFF.QInA.addInAComponent(new oFF.QInARepoSort());
		oFF.QInA.addInAComponent(new oFF.QInARepoFilterCellValueOperand());
		oFF.QInA.addInAComponent(new oFF.QInARepoVarHierNode());
		oFF.QInA.addInAComponent(new oFF.QInARepoVarDimMember());
		oFF.QInA.addInAComponent(new oFF.QInARepoMembersAll());
		oFF.QInA.addInAComponent(new oFF.QInARepoMemberRestricted());
		oFF.QInA.addInAComponent(new oFF.QInARepoMemberFormulaMeasure());
		oFF.QInA.addInAComponent(new oFF.QInARepoMemberBasicMeasure());
		oFF.QInA.addInAComponent(new oFF.QInARepoFilterOperation());
		oFF.QInA.addInAComponent(new oFF.QInARepoFilterCartesianList());
		oFF.QInA.addInAComponent(new oFF.QInARepoFilterCartesianProduct());
		oFF.QInA.addInAComponent(new oFF.QInARepoFilterExpression());
		oFF.QInA.addInAComponent(new oFF.QInARepoFilterAlgebra());
		oFF.QInA.addInAComponent(new oFF.QInARepoFilterAll());
		oFF.QInA.addInAComponent(new oFF.QInARepoAxis());
		oFF.QInA.addInAComponent(new oFF.QInARepoFilterTuple());
		oFF.QInA.addInAComponent(new oFF.QInAQuery());
		oFF.QInA.addInAComponent(new oFF.QInADimension());
		oFF.QInA.addInAComponent(new oFF.QInACalculatedDimension());
		oFF.QInA.addInAComponent(new oFF.QInASort());
		oFF.QInA.addInAComponent(new oFF.QInAConditionManager());
		oFF.QInA.addInAComponent(new oFF.QInAConditionsCondition());
		oFF.QInA.addInAComponent(new oFF.QInAConditionsThreshold());
		oFF.QInA.addInAComponent(new oFF.QInADataSource());
		oFF.QInA.addInAComponent(new oFF.QInAQuerySettings());
		oFF.QInA.addInAComponent(new oFF.QInATotals());
		oFF.QInA.addInAComponent(new oFF.QInAAttribute());
		oFF.QInA.addInAComponent(new oFF.QInAAxesSettings());
		oFF.QInA.addInAComponent(new oFF.QInAAxis());
		oFF.QInA.addInAComponent(new oFF.QInADataCell());
		oFF.QInA.addInAComponent(new oFF.QInADataCellsAll());
		oFF.QInA.addInAComponent(new oFF.QInADrillManager());
		oFF.QInA.addInAComponent(new oFF.QInAUniversalDisplayHierarchies());
		oFF.QInA.addInAComponent(new oFF.QInADrillPathElement());
		oFF.QInA.addInAComponent(new oFF.QInADrillPathOperation());
		oFF.QInA.addInAComponent(new oFF.QInAField());
		oFF.QInA.addInAComponent(new oFF.QInAVariableContainer());
		oFF.QInA.addInAComponent(new oFF.QInAVariablesList());
		oFF.QInA.addInAComponent(new oFF.QInAVarSimpleType());
		oFF.QInA.addInAComponent(new oFF.QInAVarDimMember());
		oFF.QInA.addInAComponent(new oFF.QInAVarOptionList());
		oFF.QInA.addInAComponent(new oFF.QInAVarHierNode());
		oFF.QInA.addInAComponent(new oFF.QInAMember());
		oFF.QInA.addInAComponent(new oFF.QInAMembersAll());
		oFF.QInA.addInAComponent(new oFF.QInAMemberRestrictedMeasure());
		oFF.QInA.addInAComponent(new oFF.QInAMemberBasicMeasure());
		oFF.QInA.addInAComponent(new oFF.QInAMemberFormulaMeasure());
		oFF.QInA.addInAComponent(new oFF.QInAFilterExpression());
		oFF.QInA.addInAComponent(new oFF.QInAFilterCellValueOperand());
		oFF.QInA.addInAComponent(new oFF.QInAFilterTuple());
		oFF.QInA.addInAComponent(new oFF.QInAFilterElement());
		oFF.QInA.addInAComponent(new oFF.QInAFilterAlgebra());
		oFF.QInA.addInAComponent(new oFF.QInAFilterCartesianList());
		oFF.QInA.addInAComponent(new oFF.QInAFilterFixed());
		oFF.QInA.addInAComponent(new oFF.QInAFilterDynamic());
		oFF.QInA.addInAComponent(new oFF.QInAFilterVisibility());
		oFF.QInA.addInAComponent(new oFF.QInAFilterAll());
		oFF.QInA.addInAComponent(new oFF.QInAFilterOperation());
		oFF.QInA.addInAComponent(new oFF.QInAFilterGeo());
		oFF.QInA.addInAComponent(new oFF.QInAFilterMemberOp());
		oFF.QInA.addInAComponent(new oFF.QInAFilterCartesianProduct());
		oFF.QInA.addInAComponent(new oFF.QInAFilterVirtualDatasource());
		oFF.QInA.addInAComponent(new oFF.QInAHierarchyValueHelp());
		oFF.QInA.addInAComponent(new oFF.QInAHierarchy());
		oFF.QInA.addInAComponent(new oFF.QInADimensionsAll());
		oFF.QInA.addInAComponent(new oFF.QInAExceptions());
		oFF.QInA.addInAComponent(new oFF.QInAGenericComponent());
		oFF.QInA.addInAComponent(new oFF.QCsnMdQuery());
		oFF.QInA.addInAComponent(new oFF.QCsnMdDimensions());
		oFF.QInA.addInAComponent(new oFF.QCsnMdDimension());
		oFF.QInA.addInAComponent(new oFF.QCsnMdDimMembers());
		oFF.QInA.addInAComponent(new oFF.QCsnMdVariables());
		oFF.QInA.addInAComponent(new oFF.QCsnMdVariable());
	};
	oFF.QInA.addInAComponent = function(inaComponent) {
		var key = inaComponent.getComponentType().getName();
		var modelFormat = inaComponent.getModelFormat();
		var usages;
		var size;
		var k;
		var list;
		var container2;
		if (oFF.isNull(modelFormat)) {
			modelFormat = oFF.QModelFormat.INA_DATA;
		}
		usages = modelFormat.getUsages();
		size = usages.size();
		for (k = 0; k < size; k++) {
			list = oFF.QInA.s_lookupByFormat.getByKey(usages.get(k).getName());
			container2 = list.getByKey(key);
			oFF.XObjectExt.checkNotNull(container2, oFF.XStringUtils
					.concatenate2("Container not defined: ", key));
			container2.add(inaComponent);
		}
	};
	oFF.QInA.addAllTypes = function() {
		oFF.QInA.addType(oFF.OlapComponentType.CONDITIONS_MANAGER);
		oFF.QInA.addType(oFF.OlapComponentType.CONDITION);
		oFF.QInA.addType(oFF.OlapComponentType.CONDITIONS_THRESHOLD);
		oFF.QInA.addType(oFF.OlapComponentType.CONDITIONS);
		oFF.QInA.addType(oFF.OlapComponentType.QUERY_MODEL);
		oFF.QInA.addType(oFF.OlapComponentType.DATA_CELL);
		oFF.QInA.addType(oFF.OlapComponentType.AXIS);
		oFF.QInA.addType(oFF.OlapComponentType.SORT_MANAGER);
		oFF.QInA.addType(oFF.OlapComponentType.LAYER_MODEL);
		oFF.QInA.addType(oFF.OlapComponentType.DATA_SOURCE);
		oFF.QInA.addType(oFF.OlapComponentType.SELECTOR);
		oFF.QInA.addType(oFF.OlapComponentType.ATTRIBUTE_CONTAINER);
		oFF.QInA.addType(oFF.OlapComponentType.ATTRIBUTE);
		oFF.QInA.addType(oFF.OlapComponentType.DRILL_MANAGER);
		oFF.QInA.addType(oFF.OlapComponentType.DRILL_OPERATION);
		oFF.QInA.addType(oFF.MemberType.DRILL_PATH_ELEMENT);
		oFF.QInA.addType(oFF.OlapComponentType.FIELD_CONTAINER);
		oFF.QInA.addType(oFF.OlapComponentType.FIELD_LIST);
		oFF.QInA.addType(oFF.OlapComponentType.FIELD);
		oFF.QInA.addType(oFF.OlapComponentType.RESULT_STRUCTURE);
		oFF.QInA.addType(oFF.OlapComponentType.DATA_CELLS);
		oFF.QInA.addType(oFF.OlapComponentType.TOTALS);
		oFF.QInA.addType(oFF.OlapComponentType.EXCEPTION_MANAGER);
		oFF.QInA.addType(oFF.OlapComponentType.QUERY_SETTINGS);
		oFF.QInA.addType(oFF.OlapComponentType.HIERARCHY);
		oFF.QInA.addType(oFF.OlapComponentType.AXES_SETTINGS);
		oFF.QInA.addType(oFF.OlapComponentType.PROPERTY);
		oFF.QInA.addType(oFF.OlapComponentType.PLANNING_COMMAND);
		oFF.QInA.addType(oFF.OlapComponentType.UNIVERSAL_DISPLAY_HIERARCHIES);
		oFF.QInA.addType(oFF.MemberType.MEMBER);
		oFF.QInA.addType(oFF.MemberType.SINGLE_MEMBER_EXIT);
		oFF.QInA.addType(oFF.MemberType.MEMBER_EXITS);
		oFF.QInA.addType(oFF.MemberType.LITERAL_MEMBER);
		oFF.QInA.addType(oFF.MemberType.BASIC_MEASURE);
		oFF.QInA.addType(oFF.MemberType.FORMULA);
		oFF.QInA.addType(oFF.MemberType.SERVER_BASED_FORMULA);
		oFF.QInA.addType(oFF.MemberType.RESTRICTED_MEASURE);
		oFF.QInA.addType(oFF.MemberType.HIERARCHY_NODE);
		oFF.QInA.addType(oFF.MemberType.RESULT);
		oFF.QInA.addType(oFF.MemberType.CONDITION_RESULT);
		oFF.QInA.addType(oFF.MemberType.CONDITION_OTHERS_RESULT);
		oFF.QInA.addType(oFF.MemberType.MEASURE);
		oFF.QInA.addType(oFF.MemberType.ABSTRACT_MEMBER);
		oFF.QInA.addType(oFF.OlapComponentType.EXCEPTION_AGGREGATION_MANAGER);
		oFF.QInA.addType(oFF.OlapComponentType.FORMULA_CONSTANT);
		oFF.QInA.addType(oFF.OlapComponentType.FORMULA_ITEM_MEMBER);
		oFF.QInA.addType(oFF.OlapComponentType.FORMULA_OPERATION);
		oFF.QInA.addType(oFF.OlapComponentType.FORMULA_FUNCTION);
		oFF.QInA.addType(oFF.OlapComponentType.MEMBERS);
		oFF.QInA.addType(oFF.OlapComponentType.DIMENSION_SORTING);
		oFF.QInA.addType(oFF.OlapComponentType.FIELD_SORTING);
		oFF.QInA.addType(oFF.OlapComponentType.DATA_CELL_SORTING);
		oFF.QInA.addType(oFF.OlapComponentType.COMPLEX_SORTING);
		oFF.QInA.addType(oFF.OlapComponentType.MEASURE_SORTING);
		oFF.QInA.addType(oFF.OlapComponentType.GENERIC_SORTING);
		oFF.QInA.addType(oFF.OlapComponentType.LAYER);
		oFF.QInA.addType(oFF.OlapComponentType.LAYER_SYNC_DEFINITION);
		oFF.QInA.addType(oFF.OlapComponentType.LAYER_REFERENCE_DEFINITION);
		oFF.QInA.addType(oFF.OlapComponentType.ABSTRACT_LAYER_MODEL);
		oFF.QInA.addType(oFF.OlapComponentType.VARIABLE_MANAGER);
		oFF.QInA.addType(oFF.OlapComponentType.VARIABLE_CONTAINER);
		oFF.QInA.addType(oFF.OlapComponentType.VARIABLE_LIST);
		oFF.QInA.addType(oFF.VariableType.TEXT_VARIABLE);
		oFF.QInA.addType(oFF.VariableType.FORMULA_VARIABLE);
		oFF.QInA.addType(oFF.VariableType.HIERARCHY_NODE_VARIABLE);
		oFF.QInA.addType(oFF.VariableType.HIERARCHY_NAME_VARIABLE);
		oFF.QInA.addType(oFF.VariableType.HIERARCHY_VARIABLE);
		oFF.QInA.addType(oFF.VariableType.OPTION_LIST_VARIABLE);
		oFF.QInA.addType(oFF.VariableType.DIMENSION_MEMBER_VARIABLE);
		oFF.QInA.addType(oFF.VariableType.SIMPLE_TYPE_VARIABLE);
		oFF.QInA.addType(oFF.VariableType.ANY_VARIABLE);
		oFF.QInA.addType(oFF.OlapComponentType.VARIABLE_CONTEXT);
		oFF.QInA.addType(oFF.OlapComponentType.FILTER_CAPABILITY_GROUP);
		oFF.QInA.addType(oFF.OlapComponentType.FILTER_CAPABILITY);
		oFF.QInA.addType(oFF.OlapComponentType.FILTER_EXPRESSION);
		oFF.QInA.addType(oFF.OlapComponentType.FILTER_LITERAL);
		oFF.QInA.addType(oFF.OlapComponentType.FILTER_FIXED);
		oFF.QInA.addType(oFF.OlapComponentType.FILTER_DYNAMIC);
		oFF.QInA.addType(oFF.OlapComponentType.FILTER_VISIBILITY);
		oFF.QInA.addType(oFF.OlapComponentType.FILTER_CELL_VALUE_OPERAND);
		oFF.QInA.addType(oFF.FilterComponentType.CARTESIAN_SPATIAL_LIST);
		oFF.QInA.addType(oFF.FilterComponentType.CARTESIAN_LIST);
		oFF.QInA.addType(oFF.FilterComponentType.CARTESIAN_PRODUCT);
		oFF.QInA.addType(oFF.FilterComponentType.AND);
		oFF.QInA.addType(oFF.FilterComponentType.OR);
		oFF.QInA.addType(oFF.FilterComponentType.NOT);
		oFF.QInA.addType(oFF.FilterComponentType.SPATIAL_FILTER);
		oFF.QInA.addType(oFF.FilterComponentType.MEMBER_OPERAND);
		oFF.QInA.addType(oFF.FilterComponentType.BOOLEAN_ALGEBRA);
		oFF.QInA.addType(oFF.FilterComponentType.OPERATION);
		oFF.QInA.addType(oFF.OlapComponentType.FILTER_ELEMENT);
		oFF.QInA.addType(oFF.OlapComponentType.DIMENSION_CONTEXT);
		oFF.QInA.addType(oFF.OlapComponentType.DIMENSIONS);
		oFF.QInA.addType(oFF.DimensionType.PRESENTATION);
		oFF.QInA.addType(oFF.DimensionType.CONTAINER);
		oFF.QInA.addType(oFF.DimensionType.ATTRIBUTE_DIM);
		oFF.QInA.addType(oFF.DimensionType.CURRENCY);
		oFF.QInA.addType(oFF.DimensionType.UNIT);
		oFF.QInA.addType(oFF.DimensionType.TIME);
		oFF.QInA.addType(oFF.DimensionType.DATE);
		oFF.QInA.addType(oFF.DimensionType.HIERARCHY_VERSION);
		oFF.QInA.addType(oFF.DimensionType.HIERARCHY_NAME);
		oFF.QInA.addType(oFF.DimensionType.SEARCH_DIMENSION);
		oFF.QInA.addType(oFF.DimensionType.VERSION);
		oFF.QInA.addType(oFF.DimensionType.ACCOUNT);
		oFF.QInA.addType(oFF.DimensionType.GIS_DIMENSION);
		oFF.QInA.addType(oFF.DimensionType.SEARCH_RESULT);
		oFF.QInA.addType(oFF.DimensionType.SUGGEST_TERM);
		oFF.QInA.addType(oFF.DimensionType.SUGGEST_SCOPE);
		oFF.QInA.addType(oFF.DimensionType.SUGGEST_ATTRIBUTE);
		oFF.QInA.addType(oFF.DimensionType.MEASURE_STRUCTURE);
		oFF.QInA.addType(oFF.DimensionType.SECONDARY_STRUCTURE);
		oFF.QInA.addType(oFF.DimensionType.ABSTRACT_STRUCTURE);
		oFF.QInA.addType(oFF.DimensionType.DIMENSION);
		oFF.QInA.addType(oFF.DimensionType.CALCULATED_DIMENSION);
		oFF.QInA.addType(oFF.OlapComponentType.ABSTRACT_DIMENSION);
		oFF.QInA.addType(oFF.OlapComponentType.COMPONENT_LIST);
		oFF.QInA.addType(oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.QInA.addType(oFF.OlapComponentType.OLAP);
		oFF.QInA.addType(oFF.FilterComponentType.TUPLE);
		oFF.QInA.addType(oFF.FilterComponentType.VIRTUAL_DATASOURCE);
	};
	oFF.QInA.addType = function(componentType) {
		var all = oFF.QModelFormat.getAll();
		var size = all.size();
		var i;
		var list;
		for (i = 0; i < size; i++) {
			list = oFF.QInA.s_lookupByFormat.getByKey(all.get(i).getName());
			list.add(oFF.QInAComponentContainer.create(componentType));
		}
	};
	oFF.QInA.addAllFormats = function() {
		var all = oFF.QModelFormat.getAll();
		var size = all.size();
		var i;
		var list;
		for (i = 0; i < size; i++) {
			list = oFF.XListOfNameObject.create();
			oFF.QInA.s_lookupByFormat.put(all.get(i).getName(), list);
		}
	};
	oFF.QInA.removeEmptyContainers = function() {
		var all = oFF.QModelFormat.getAll();
		var allSize = all.size();
		var i;
		var list;
		var k;
		for (i = 0; i < allSize; i++) {
			list = oFF.QInA.s_lookupByFormat.getByKey(all.get(i).getName());
			for (k = 0; k < list.size();) {
				if (list.get(k).isEmpty()) {
					list.removeAt(k);
				} else {
					k++;
				}
			}
		}
	};
	oFF.QInA.prototype.m_application = null;
	oFF.QInA.prototype.capabilities = null;
	oFF.QInA.prototype.mode = null;
	oFF.QInA.prototype.m_originalMode = null;
	oFF.QInA.prototype.m_version = 0;
	oFF.QInA.prototype.m_isUsingX91Settings = false;
	oFF.QInA.prototype.supportsSetOperand = false;
	oFF.QInA.prototype.supportsSAPDateFormat = false;
	oFF.QInA.prototype.supportsCummulative = false;
	oFF.QInA.prototype.supportsExceptionsV2 = false;
	oFF.QInA.prototype.supportsExceptionAggregationDimsFormulas = false;
	oFF.QInA.prototype.supportsHierNavCounter = false;
	oFF.QInA.prototype.supportsHierAttHierFields = false;
	oFF.QInA.prototype.supportsExtendedSort = false;
	oFF.QInA.prototype.supportsSpatialFilter = false;
	oFF.QInA.prototype.supportsSpatialFilterSrid = false;
	oFF.QInA.prototype.supportsSpatialTransformations = false;
	oFF.QInA.prototype.supportsMemberVisibility = false;
	oFF.QInA.prototype.supportsCustomDimensionMemberExecutionStep = false;
	oFF.QInA.prototype.supportsConvertToFlatFilter = false;
	oFF.QInA.prototype.supportsExtendedDimensions = false;
	oFF.QInA.prototype.supportsIgnoreExternalDimensions = false;
	oFF.QInA.prototype.supportsSupplements = false;
	oFF.QInA.prototype.supportsDataCells = false;
	oFF.QInA.prototype.supportsConditions = false;
	oFF.QInA.prototype.supportsCubeBlendingProperties = false;
	oFF.QInA.prototype.supportsUniversalDisplayHierarchy = false;
	oFF.QInA.prototype.supportsNumberAsString = false;
	oFF.QInA.prototype.supportsSpatialChoropleth = false;
	oFF.QInA.prototype.supportsDimensionVisibility = false;
	oFF.QInA.prototype.supportsDimensionDefaultMember = false;
	oFF.QInA.prototype.variableProcessingDirective = null;
	oFF.QInA.prototype.modelContext = null;
	oFF.QInA.prototype.setupImportExport = function(application, mode,
			capabilities, memberReadModeContext) {
		var session = null;
		if (oFF.notNull(application)) {
			session = application.getSession();
		}
		this.setupSessionContext(session);
		this.setApplication(application);
		if (oFF.isNull(application)) {
			this.m_version = oFF.XVersion.MAX;
		} else {
			this.m_version = application.getVersion();
		}
		this.mode = mode;
		this.m_originalMode = mode;
		this.modelContext = memberReadModeContext;
		this.capabilities = capabilities;
		if (oFF.notNull(capabilities)) {
			this.supportsSetOperand = capabilities
					.containsKey(oFF.InACapabilities.SET_OPERAND);
			this.supportsConvertToFlatFilter = capabilities
					.containsKey(oFF.InACapabilities.HIERARCHY_SELECTION_AS_FLAT_SELECTION);
			this.supportsSAPDateFormat = capabilities
					.containsKey(oFF.InACapabilities.SAP_DATE);
			this.supportsCummulative = capabilities
					.containsKey(oFF.InACapabilities.CUMMULATIVE);
			this.supportsExceptionsV2 = capabilities
					.containsKey(oFF.InACapabilities.EXCEPTIONS_V2);
			this.supportsExceptionAggregationDimsFormulas = capabilities
					.containsKey(oFF.InACapabilities.EXCEPTION_AGGREGATION_DIMENSIONS_AND_FORMULAS);
			this.supportsHierNavCounter = capabilities
					.containsKey(oFF.InACapabilities.HIERARCHY_NAVIGATION_COUNTER);
			this.supportsHierAttHierFields = capabilities
					.containsKey(oFF.InACapabilities.ATTRIBUTE_HIERARCHY_HIERARCHY_FIELDS);
			this.supportsExtendedSort = capabilities
					.containsKey(oFF.InACapabilities.EXTENDED_SORT);
			this.supportsSpatialFilter = capabilities
					.containsKey(oFF.InACapabilities.SPATIAL_FILTER);
			if (this.supportsSpatialFilter) {
				this.supportsSpatialFilterSrid = capabilities
						.containsKey(oFF.InACapabilities.SPATIAL_FILTER_WITH_SRID);
			}
			this.supportsSpatialTransformations = capabilities
					.containsKey(oFF.InACapabilities.SPATIAL_TRANSFORMATIONS);
			this.supportsMemberVisibility = capabilities
					.containsKey(oFF.InACapabilities.MEMBER_VISIBILITY);
			this.supportsCustomDimensionMemberExecutionStep = capabilities
					.containsKey(oFF.InACapabilities.CUSTOM_DIMENSION_MEMBER_EXECUTION_STEP);
			this.supportsExtendedDimensions = capabilities
					.containsKey(oFF.InACapabilities.EXTENDED_DIMENSIONS);
			this.supportsIgnoreExternalDimensions = capabilities
					.containsKey(oFF.InACapabilities.IGNORE_EXTERNAL_DIMENSIONS);
			this.supportsSupplements = capabilities
					.containsKey(oFF.InACapabilities.SUPPLEMENTS);
			this.supportsDataCells = capabilities
					.containsKey(oFF.InACapabilities.QUERY_DATA_CELLS);
			this.supportsConditions = capabilities
					.containsKey(oFF.InACapabilities.CONDITIONS);
			this.supportsCubeBlendingProperties = capabilities
					.containsKey(oFF.InACapabilities.CUBE_BLENDING)
					&& capabilities
							.containsKey(oFF.InACapabilities.CUBE_BLENDING_PROPERTIES);
			this.supportsUniversalDisplayHierarchy = capabilities
					.containsKey(oFF.InACapabilities.UNIVERSAL_DISPLAY_HIERARCHIES);
			this.supportsNumberAsString = capabilities
					.containsKey(oFF.InACapabilities.NUMBER_AS_STRING);
			this.supportsSpatialChoropleth = capabilities
					.containsKey(oFF.InACapabilities.SPATIAL_CHOROPLETH);
			this.supportsDimensionVisibility = capabilities
					.containsKey(oFF.InactiveCapabilities.DIMENSION_VISIBILITY
							.getName());
			this.supportsDimensionDefaultMember = capabilities
					.containsKey(oFF.InactiveCapabilities.DIMENSION_DEFAULT_MEMBER
							.getName());
		} else {
			this.supportsSetOperand = true;
			this.supportsConvertToFlatFilter = true;
			this.supportsSAPDateFormat = false;
			this.supportsCummulative = true;
			this.supportsExceptionsV2 = false;
			this.supportsHierNavCounter = false;
			this.supportsHierAttHierFields = false;
			this.supportsExtendedSort = true;
			this.supportsSpatialFilter = true;
			this.supportsSpatialFilterSrid = true;
			this.supportsSpatialTransformations = true;
			this.supportsMemberVisibility = true;
			this.supportsCustomDimensionMemberExecutionStep = true;
			this.supportsExtendedDimensions = true;
			this.supportsIgnoreExternalDimensions = true;
			this.supportsSupplements = true;
			this.supportsDataCells = false;
			this.supportsConditions = false;
			this.supportsCubeBlendingProperties = false;
			this.supportsUniversalDisplayHierarchy = false;
			this.supportsNumberAsString = false;
		}
	};
	oFF.QInA.prototype.getComponentName = function() {
		return "QInAImportExport";
	};
	oFF.QInA.prototype.lookupInAComponent = function(olapComponentType,
			inaImportElement) {
		var componentModel;
		var containerList;
		var container;
		var size;
		var i;
		if (!this.m_isUsingX91Settings
				&& this.m_version >= oFF.XVersion.V92_REPO_RS_EXPORT) {
			this.addModelFormatUsage(oFF.QModelFormat.INA_REPOSITORY_DATA);
			this.addModelFormatUsage(oFF.QModelFormat.INA_REPOSITORY_NO_VARS);
			this.m_isUsingX91Settings = false;
		}
		if (!this.m_isUsingX91Settings
				&& this.m_version < oFF.XVersion.V92_REPO_RS_EXPORT) {
			this.removeModelFormatUsage(oFF.QModelFormat.INA_REPOSITORY_DATA);
			this
					.removeModelFormatUsage(oFF.QModelFormat.INA_REPOSITORY_NO_VARS);
			this.m_isUsingX91Settings = true;
		}
		componentModel = null;
		containerList = oFF.QInA.s_lookupByFormat.getByKey(this.mode.getName());
		container = containerList.getByKey(olapComponentType.getName());
		if (oFF.isNull(container)) {
			size = containerList.size();
			for (i = 0; i < size; i++) {
				container = containerList.get(i);
				if (olapComponentType.isTypeOf(container.getComponentType())) {
					componentModel = container.get(this.m_version,
							inaImportElement);
					break;
				}
			}
		} else {
			componentModel = container.get(this.m_version, inaImportElement);
		}
		if (oFF.isNull(componentModel)) {
			this
					.addError(
							0,
							oFF.XStringUtils
									.concatenate2(
											"Cannot find serialization/deserialization component for type: ",
											olapComponentType.getName()));
		}
		return componentModel;
	};
	oFF.QInA.prototype.addModelFormatUsage = function(modelFormat) {
		var sourceList;
		var targetList;
		var list01Size;
		var j;
		var container01;
		var components01;
		var key01;
		var container02;
		var components02;
		if (modelFormat === oFF.QModelFormat.INA_REPOSITORY_DATA
				&& oFF.isNull(oFF.QInA.m_repoData91)) {
			oFF.QInA.m_repoData91 = oFF.XListOfNameObject.create();
			oFF.QInA.m_repoData91.addAll(oFF.QInA.s_lookupByFormat
					.getByKey(modelFormat.getName()));
		}
		if (modelFormat === oFF.QModelFormat.INA_REPOSITORY_NO_VARS
				&& oFF.isNull(oFF.QInA.m_repoNoVar91)) {
			oFF.QInA.m_repoNoVar91 = oFF.XListOfNameObject.create();
			oFF.QInA.m_repoNoVar91.addAll(oFF.QInA.s_lookupByFormat
					.getByKey(modelFormat.getName()));
		}
		sourceList = oFF.QInA.s_lookupByFormat
				.getByKey(oFF.QModelFormat.INA_REPOSITORY.getName());
		if (oFF.notNull(sourceList)
				&& !oFF.QModelFormat.INA_REPOSITORY.getUsages().contains(
						modelFormat)) {
			oFF.QModelFormat.INA_REPOSITORY.addUsage(modelFormat);
			targetList = oFF.QInA.s_lookupByFormat.getByKey(modelFormat
					.getName());
			targetList.clear();
			list01Size = sourceList.size();
			for (j = 0; j < list01Size; j++) {
				container01 = sourceList.get(j);
				components01 = container01.getComponents();
				key01 = container01.getName();
				container02 = targetList.getByKey(key01);
				if (oFF.isNull(container02)) {
					container02 = oFF.QInAComponentContainer.create(container01
							.getComponentType());
					targetList.add(container02);
				}
				components02 = container02.getComponents();
				components02.clear();
				components02.addAll(components01);
			}
		}
	};
	oFF.QInA.prototype.removeModelFormatUsage = function(modelFormat) {
		var sourceList = null;
		var targetList;
		var list01Size;
		var j;
		var container01;
		var components01;
		var key01;
		var container02;
		var components02;
		if (modelFormat === oFF.QModelFormat.INA_REPOSITORY_DATA) {
			if (oFF.isNull(oFF.QInA.m_repoData91)) {
				oFF.QInA.m_repoData91 = oFF.XListOfNameObject.create();
				oFF.QInA.m_repoData91.addAll(oFF.QInA.s_lookupByFormat
						.getByKey(modelFormat.getName()));
			}
			sourceList = oFF.QInA.m_repoData91;
		}
		if (modelFormat === oFF.QModelFormat.INA_REPOSITORY_NO_VARS) {
			if (oFF.isNull(oFF.QInA.m_repoNoVar91)) {
				oFF.QInA.m_repoNoVar91 = oFF.XListOfNameObject.create();
				oFF.QInA.m_repoNoVar91.addAll(oFF.QInA.s_lookupByFormat
						.getByKey(modelFormat.getName()));
			}
			sourceList = oFF.QInA.m_repoNoVar91;
		}
		if (oFF.notNull(sourceList)) {
			oFF.QModelFormat.INA_REPOSITORY.removeUsage(modelFormat);
			targetList = oFF.QInA.s_lookupByFormat.getByKey(modelFormat
					.getName());
			targetList.clear();
			list01Size = sourceList.size();
			for (j = 0; j < list01Size; j++) {
				container01 = sourceList.get(j);
				components01 = container01.getComponents();
				key01 = container01.getName();
				container02 = targetList.getByKey(key01);
				if (oFF.isNull(container02)) {
					container02 = oFF.QInAComponentContainer.create(container01
							.getComponentType());
					targetList.add(container02);
				}
				components02 = container02.getComponents();
				components02.clear();
				components02.addAll(components01);
			}
		}
	};
	oFF.QInA.prototype.getApplication = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_application);
	};
	oFF.QInA.prototype.setApplication = function(application) {
		this.m_application = oFF.XWeakReferenceUtil.getWeakRef(application);
	};
	oFF.QInA.prototype.getMode = function() {
		return this.mode;
	};
	oFF.QInA.prototype.getOriginalMode = function() {
		return this.m_originalMode;
	};
	oFF.QInA.prototype.hasCapability = function(name) {
		return oFF.notNull(this.capabilities)
				&& this.capabilities.containsKey(name);
	};
	oFF.QInA.prototype.isAbap = function(queryModel) {
		return queryModel.getSystemType().isTypeOf(oFF.SystemType.ABAP);
	};
	oFF.QInA.prototype.isVirtualInA = function(queryModel) {
		return oFF.notNull(queryModel)
				&& queryModel.getSystemType().isTypeOf(
						oFF.SystemType.VIRTUAL_INA)
				&& !this.getMode().isTypeOf(
						oFF.QModelFormat.INA_DATA_BLENDING_SOURCE);
	};
	oFF.QInARepoMemberRestricted = function() {
	};
	oFF.QInARepoMemberRestricted.prototype = new oFF.QInARepoMember();
	oFF.QInARepoMemberRestricted.prototype.getComponentType = function() {
		return oFF.MemberType.RESTRICTED_MEASURE;
	};
	oFF.QInARepoMemberRestricted.prototype.newModelComponent = function(
			application, parentComponent, context) {
		var newMember = oFF.QRestrictedMeasure._createRestrictedMeasure(
				context, null);
		newMember.setParent(parentComponent);
		return newMember;
	};
	oFF.QInARepoMemberRestricted.prototype.importComponentWithStructure = function(
			importer, inaStructure, modelComponent, parentComponent, context) {
		var restrictedMeasure = modelComponent;
		var dimension = parentComponent;
		var newMemberName = inaStructure.getStringByKey("Name");
		var newMemberText = inaStructure.getStringByKey("Description");
		var inaExceptionAggregationDimensions;
		var idx;
		var dimName;
		var filter;
		var filterElement;
		var inaFilterElement;
		if (oFF.isNull(restrictedMeasure)) {
			restrictedMeasure = dimension.addNewRestrictedMeasure(
					newMemberName, newMemberText);
		} else {
			restrictedMeasure.setDimension(dimension);
			restrictedMeasure.setName(newMemberName);
			restrictedMeasure.setText(newMemberText);
		}
		restrictedMeasure.setAggregationType(oFF.QInAConverter
				.lookupAggregationType(inaStructure
						.getStringByKey("Aggregation")));
		if (restrictedMeasure.supportsExceptionAggregationDimsFormulas()) {
			restrictedMeasure.setExceptionAggregationType(oFF.AggregationType
					.lookupOrCreate(inaStructure
							.getStringByKey("ExceptionAggregation")));
			restrictedMeasure.clearExceptionAggregationDimensions();
			inaExceptionAggregationDimensions = inaStructure
					.getListByKey("ExceptionAggregationDimensions");
			if (oFF.notNull(inaExceptionAggregationDimensions)) {
				for (idx = 0; idx < inaExceptionAggregationDimensions.size(); idx++) {
					dimName = inaExceptionAggregationDimensions
							.getStringAt(idx);
					restrictedMeasure
							.addExceptionAggregationDimensionName(dimName);
				}
			}
		} else {
			restrictedMeasure.setAggregationDimensionName(inaStructure
					.getStringByKey("AggregationDimension"));
		}
		this.importGenericMemberProperties(restrictedMeasure, inaStructure);
		filter = restrictedMeasure.getFilter();
		filterElement = null;
		inaFilterElement = inaStructure.getStructureByKey("Selection");
		if (oFF.notNull(inaFilterElement)) {
			filterElement = importer.importComponent(null, inaFilterElement,
					null, filter, context);
		}
		filter.setComplexRoot(filterElement);
		return restrictedMeasure;
	};
	oFF.QInARepoMemberRestricted.prototype.exportComponentWithStructure = function(
			exporter, modelComponent, inaStructure, flags) {
		var restrictedMeasure = modelComponent;
		var restrictedAggregationType;
		var inaAggType;
		var inaExceptionAggregationDimensions;
		var aggregationDimensionName;
		var filterRoot;
		var inaElement;
		inaStructure.putString("Name", restrictedMeasure.getName());
		inaStructure.putString("Description", restrictedMeasure.getText());
		restrictedAggregationType = restrictedMeasure.getAggregationType();
		if (oFF.notNull(restrictedAggregationType)) {
			inaAggType = oFF.QInAConverter
					.lookupAggregationTypeInA(restrictedAggregationType);
			inaStructure.putStringNotNull("Aggregation", inaAggType);
		}
		if (restrictedMeasure.supportsExceptionAggregationDimsFormulas()) {
			inaExceptionAggregationDimensions = inaStructure
					.putNewList("ExceptionAggregationDimensions");
			inaExceptionAggregationDimensions.addAllStrings(restrictedMeasure
					.getExceptionAggregationDimensions());
		} else {
			aggregationDimensionName = restrictedMeasure
					.getAggregationDimensionName();
			inaStructure.putStringNotNull("AggregationDimension",
					aggregationDimensionName);
		}
		this.exportGenericMemberProperties(restrictedMeasure, inaStructure);
		filterRoot = restrictedMeasure.getFilter().getFilterRootElement();
		if (oFF.notNull(filterRoot)) {
			inaElement = exporter
					.exportComponent(null, filterRoot, null, flags);
			inaStructure.put("Selection", inaElement);
		}
		return inaStructure;
	};
	oFF.QInARepoVarHierNode = function() {
	};
	oFF.QInARepoVarHierNode.prototype = new oFF.QInARepoVarDimMember();
	oFF.QInARepoVarHierNode.prototype.getComponentType = function() {
		return oFF.VariableType.HIERARCHY_NODE_VARIABLE;
	};
	oFF.InARsAxisProvider = function() {
	};
	oFF.InARsAxisProvider.prototype = new oFF.DfRsAxisProvider();
	oFF.InARsAxisProvider.create = function(application, axisType,
			requestContext, supportsSapDateFormat, supportsObtainability) {
		var provider;
		if (oFF.AxisType.ROWS !== axisType && oFF.AxisType.COLUMNS !== axisType) {
			throw oFF.XException
					.createIllegalStateException("illegal axis type");
		}
		provider = new oFF.InARsAxisProvider();
		provider.setupProvider(application, requestContext,
				supportsSapDateFormat, supportsObtainability);
		return provider;
	};
	oFF.InARsAxisProvider.prototype.m_dataCount = 0;
	oFF.InARsAxisProvider.prototype.m_tuplesCount = 0;
	oFF.InARsAxisProvider.prototype.m_tuplesCountTotal = 0;
	oFF.InARsAxisProvider.prototype.m_tupleElementsCount = 0;
	oFF.InARsAxisProvider.prototype.m_rsDimensionsList = null;
	oFF.InARsAxisProvider.prototype.m_supportsObtainability = false;
	oFF.InARsAxisProvider.prototype.m_supportsSapDateFormat = false;
	oFF.InARsAxisProvider.prototype.m_currentIndex = 0;
	oFF.InARsAxisProvider.prototype.m_alertLevel = null;
	oFF.InARsAxisProvider.prototype.m_exceptionNames = null;
	oFF.InARsAxisProvider.prototype.m_requestContext = null;
	oFF.InARsAxisProvider.prototype.m_lbhToUdhConversionEnabled = false;
	oFF.InARsAxisProvider.prototype.setupProvider = function(application,
			requestContext, supportsSapDateFormat, supportsObtainability) {
		this.setupApplicationContext(application);
		this.m_supportsObtainability = supportsObtainability;
		this.m_supportsSapDateFormat = supportsSapDateFormat;
		this.m_requestContext = requestContext;
		this.m_currentIndex = -1;
	};
	oFF.InARsAxisProvider.prototype.releaseObject = function() {
		var rsDimsSize;
		var i;
		if (oFF.notNull(this.m_rsDimensionsList)) {
			rsDimsSize = this.m_rsDimensionsList.size();
			for (i = 0; i < rsDimsSize; i++) {
				oFF.XObjectExt.release(this.m_rsDimensionsList.get(i));
				this.m_rsDimensionsList.set(i, null);
			}
			oFF.XObjectExt.release(this.m_rsDimensionsList);
			this.m_rsDimensionsList = null;
		}
		this.m_alertLevel = oFF.XObjectExt.release(this.m_alertLevel);
		this.m_exceptionNames = oFF.XObjectExt.release(this.m_exceptionNames);
		this.m_requestContext = null;
		oFF.DfRsAxisProvider.prototype.releaseObject.call(this);
	};
	oFF.InARsAxisProvider.prototype.getElementAsListByName = function(
			ocpStructure, name) {
		var inaElement = ocpStructure.getByKey(name);
		var inaStructure;
		var inaValues;
		var valuesSize;
		if (oFF.isNull(inaElement)) {
			return null;
		}
		if (inaElement.isStructure()) {
			inaStructure = inaElement;
			inaValues = inaStructure.getListByKey("Values");
			valuesSize = inaStructure.getIntegerByKey("Size");
			if (valuesSize !== inaValues.size()) {
				throw oFF.XException
						.createIllegalStateException(oFF.XStringUtils
								.concatenate3("Indicated size of ", name,
										" names and actual size differ!"));
			}
			if (valuesSize !== this.m_tuplesCount) {
				throw oFF.XException
						.createIllegalStateException(oFF.XStringUtils
								.concatenate3("Indicated size of ", name,
										" names and tuple count differ!"));
			}
			return inaValues;
		}
		return inaElement.isList() ? inaElement : null;
	};
	oFF.InARsAxisProvider.prototype.importRsDimensions = function(ocpStructure,
			queryModel, rsDefAxis) {
		var inaDimensions;
		var dimensionCount;
		var inaTupleElements;
		var importer;
		var dimIdx;
		var inaDimension;
		var name;
		var inaHierarchy;
		var dimension;
		var rsDimension;
		var inaValueElement;
		this.m_tuplesCount = ocpStructure.getIntegerByKey("TupleCount");
		this.m_tuplesCountTotal = ocpStructure.getIntegerByKeyExt(
				"TupleCountTotal", -1);
		inaDimensions = ocpStructure.getListByKey("Dimensions");
		dimensionCount = inaDimensions.size();
		this.m_rsDimensionsList = oFF.XArray.create(dimensionCount);
		inaTupleElements = ocpStructure.getListByKey("Tuples");
		if (dimensionCount !== inaTupleElements.size()) {
			throw oFF.XException
					.createIllegalStateException("Indicated dimension count and tuple element count is not the same");
		}
		importer = null;
		for (dimIdx = 0; dimIdx < dimensionCount; dimIdx++) {
			inaDimension = inaDimensions.getStructureAt(dimIdx);
			name = this.getDimensionName(inaDimension, queryModel, rsDefAxis);
			inaHierarchy = inaDimension.getStructureByKey("Hierarchy");
			dimension = null;
			if (oFF.notNull(queryModel)) {
				dimension = queryModel
						.getDimensionByNameFromExistingMetadata(name);
				if (oFF.notNull(inaHierarchy)
						&& dimension.supportsDimensionHierarchyLevels()
						&& !oFF.PrUtils.isListEmpty(inaHierarchy
								.getListByKey("Levels"))) {
					if (oFF.isNull(importer)) {
						importer = oFF.QInAImportFactory
								.createWithQueryManagerCapabilities(this
										.getApplication(),
										oFF.QModelFormat.INA_DATA, queryModel
												.getQueryManager());
					}
					if (oFF.notNull(importer)) {
						queryModel.stopEventing();
						importer.importHierarchy(dimension, inaDimension);
						queryModel.resumeEventing();
					}
				}
			}
			rsDimension = oFF.InARsDimension.create(inaDimension, dimension,
					this.m_requestContext, rsDefAxis);
			if (oFF.isNull(dimension)) {
				rsDimension.setName(name);
				rsDimension.setText(inaDimension.getStringByKey("Description"));
			}
			inaValueElement = inaDimension.getStructureByKey("MemberTypes");
			if (oFF.notNull(inaValueElement)) {
				rsDimension.setMemberTypes(oFF.InARsEncodedValues
						.createByStructure(inaValueElement));
			}
			rsDimension.setupFromRsTuple(inaTupleElements
					.getStructureAt(dimIdx));
			this.m_rsDimensionsList.set(dimIdx, rsDimension);
		}
		this.m_alertLevel = this.getElementAsListByName(ocpStructure,
				"ExceptionAlertLevel");
		this.m_exceptionNames = this.getElementAsListByName(ocpStructure,
				"ExceptionName");
		this.m_tupleElementsCount = dimensionCount;
	};
	oFF.InARsAxisProvider.prototype.getDimensionName = function(inaDimension,
			queryModel, rsDefAxis) {
		var name = inaDimension.getStringByKey("Name");
		var axis;
		if (this.m_lbhToUdhConversionEnabled
				&& queryModel.getUniversalDisplayHierarchies().getByName(name) !== null) {
			axis = queryModel.getAxis(rsDefAxis.getType());
			name = oFF.QInAUniversalDisplayHierarchies
					.getDimensionWithLeveledHierarchy(axis).getName();
			inaDimension.putString("Name", name);
		}
		return name;
	};
	oFF.InARsAxisProvider.prototype.setOcpStructure = function(queryModel,
			ocpStructure, dataCount, rsDefAxis) {
		var axis;
		this.m_dataCount = dataCount;
		if (oFF.notNull(queryModel)
				&& queryModel.getQueryManager()
						.isHierarchyToUDHConversionEnabled()) {
			axis = queryModel.getAxis(rsDefAxis.getType());
			this.m_lbhToUdhConversionEnabled = oFF.QInAUniversalDisplayHierarchies
					.getDimensionWithLeveledHierarchy(axis) !== null;
		}
		if (oFF.notNull(ocpStructure)) {
			this.importRsDimensions(ocpStructure, queryModel, rsDefAxis);
		}
	};
	oFF.InARsAxisProvider.prototype.getRsDimensionSize = function() {
		return oFF.isNull(this.m_rsDimensionsList) ? 0
				: this.m_rsDimensionsList.size();
	};
	oFF.InARsAxisProvider.prototype.notifySetAxisMetadata = function() {
		var cursorAxis = this.getCursorAxis();
		var dimensionCount = this.getRsDimensionSize();
		var idxDimension;
		var rsDimension;
		var fields;
		var fieldCount;
		var idxField;
		var field;
		var isVisible;
		cursorAxis.startAddMetadata(dimensionCount);
		for (idxDimension = 0; idxDimension < dimensionCount; idxDimension++) {
			rsDimension = this.m_rsDimensionsList.get(idxDimension);
			cursorAxis.addNextTupleElementMetadata(idxDimension, rsDimension);
			fields = rsDimension.getFields();
			fieldCount = fields.size();
			for (idxField = 0; idxField < fieldCount; idxField++) {
				field = fields.get(idxField);
				isVisible = !this.m_supportsObtainability || field.isVisible();
				cursorAxis.addNextFieldMetadata(field.getName(), field
						.getText(), isVisible, field.getPresentationType(),
						field.getValueType());
			}
		}
		cursorAxis.endAddMetadata();
	};
	oFF.InARsAxisProvider.prototype.resetIfNotNull = function(cursor) {
		if (oFF.notNull(cursor)) {
			cursor.resetCursor();
		}
	};
	oFF.InARsAxisProvider.prototype.resetAxisCursor = function(newIndex) {
		var size;
		var dimensionIndex;
		var rsDimension;
		if (newIndex !== 0) {
			throw oFF.XException
					.createIllegalStateException("The axis cursor can only be resetted to 0.");
		}
		size = this.getRsDimensionSize();
		for (dimensionIndex = 0; dimensionIndex < size; dimensionIndex++) {
			rsDimension = this.m_rsDimensionsList.get(dimensionIndex);
			this.resetIfNotNull(rsDimension.getMemberIndexes());
			this.resetIfNotNull(rsDimension.getParentIndexes());
			this.resetIfNotNull(rsDimension.getDisplayValues());
			this.resetIfNotNull(rsDimension.getAbsoluteLevelValues());
			this.resetIfNotNull(rsDimension.getDrillStates());
			this.resetIfNotNull(rsDimension.getNodeIds());
		}
	};
	oFF.InARsAxisProvider.prototype.notifyAxisCursorChange = function(newIndex) {
		var line;
		var isAlertLevelValid;
		var isExceptionNameValid;
		var size;
		var dimensionIndex;
		var rsDimension;
		var memberIndexes;
		var memberIndex;
		var parentIndexes;
		var displayValues;
		var drillStates;
		var absoluteLevelValues;
		var nodeIds;
		var childCountValues;
		var childCount;
		if (this.m_currentIndex >= newIndex) {
			this.resetAxisCursor(newIndex);
		}
		this.m_currentIndex = newIndex;
		line = this.getCursorAxis();
		line.setTupleElementCursorBeforeStart();
		isAlertLevelValid = !oFF.PrUtils.isListEmpty(this.m_alertLevel);
		isExceptionNameValid = !oFF.PrUtils.isListEmpty(this.m_exceptionNames);
		size = this.getRsDimensionSize();
		for (dimensionIndex = 0; dimensionIndex < size; dimensionIndex++) {
			line.nextTupleElement();
			rsDimension = this.m_rsDimensionsList.get(dimensionIndex);
			memberIndexes = rsDimension.getMemberIndexes();
			memberIndex = memberIndexes.getNextIntegerValue();
			line.setDimensionMemberType(rsDimension.getMemberType(memberIndex));
			parentIndexes = rsDimension.getParentIndexes();
			if (oFF.notNull(parentIndexes)) {
				line.setParentNodeIndex(memberIndexes
						.getIndexForIntegerValue(parentIndexes
								.getNextIntegerValue()));
			}
			displayValues = rsDimension.getDisplayValues();
			if (oFF.notNull(displayValues)) {
				line.setDisplayLevel(displayValues.getNextIntegerValue());
			}
			drillStates = rsDimension.getDrillStates();
			if (oFF.notNull(drillStates)) {
				line.setDrillState(oFF.QInAConverter.lookupDrillState(
						drillStates.getNextIntegerValue(),
						this.m_lbhToUdhConversionEnabled));
			}
			absoluteLevelValues = rsDimension.getAbsoluteLevelValues();
			if (oFF.notNull(absoluteLevelValues)
					&& absoluteLevelValues.hasNextValue()) {
				line
						.setAbsoluteLevel(absoluteLevelValues
								.getNextIntegerValue());
			} else {
				line.setAbsoluteLevel(-1);
			}
			nodeIds = rsDimension.getNodeIds();
			if (oFF.notNull(nodeIds)) {
				line.setNodeId(nodeIds.getNextStringValue());
			}
			childCountValues = rsDimension.getChildCountValues();
			if (oFF.notNull(childCountValues)) {
				childCount = childCountValues.getNextIntegerValue();
				line.setChildCount(childCount);
			} else {
				line.setChildCount(-1);
			}
			if (isAlertLevelValid && isExceptionNameValid) {
				line.setAlertLevel(this.m_alertLevel.getIntegerAtExt(
						memberIndex, 0));
				line.setExceptionName(this.m_exceptionNames.getStringAtExt(
						memberIndex, null));
			}
			this.iterateFields(line, rsDimension, memberIndex);
		}
	};
	oFF.InARsAxisProvider.prototype.iterateFields = function(line, rsDimension,
			memberIndex) {
		var keyFieldIndex = rsDimension.getKeyFieldIndex();
		var hierarchyNavigationKeyIndex = rsDimension
				.getHierarchyNavigationKeyIndex();
		var rsFields = rsDimension.getFields();
		var fieldCount = rsFields.size();
		var fieldIdx;
		var rsField;
		var inaValueException;
		var formattedValue;
		for (fieldIdx = 0; fieldIdx < fieldCount; fieldIdx++) {
			line.nextFieldValue();
			rsField = rsFields.get(fieldIdx);
			inaValueException = rsField.getValueExceptionAt(memberIndex);
			if (inaValueException !== -1) {
				line.setValueException(oFF.QInAConverter
						.lookupException(inaValueException));
			}
			formattedValue = this.setValueAndReturnFormattedValue(line, rsField
					.getValues(), memberIndex, rsField.getValueType());
			if (fieldIdx === keyFieldIndex) {
				line.setDimensionMemberName(formattedValue);
				line.setDimensionMemberNameValueException(line
						.getValueException());
			}
			if (fieldIdx === hierarchyNavigationKeyIndex) {
				line.setValueOfHierarchyNavigationKey(formattedValue);
			}
			line.setFormattedValue(formattedValue);
		}
	};
	oFF.InARsAxisProvider.prototype.setValueAndReturnFormattedValue = function(
			line, inaFieldValues, memberIndex, rsValueType) {
		var fieldValueType;
		var field;
		var formattedValue;
		var memberType;
		var isTypeTotals;
		var valueException;
		var isNullValue;
		var booleanValue;
		var intValue;
		var longValue;
		var doubleValue;
		var dateValue;
		var timeValue;
		var dateTimeValue;
		var geometry;
		var spatialType;
		var error;
		if (oFF.isNull(inaFieldValues)) {
			return "InA Error: No data available";
		}
		fieldValueType = rsValueType;
		if (fieldValueType === oFF.XValueType.UNSUPPORTED) {
			field = line.getField();
			if (oFF.isNull(field) || field.getMetadata() === null) {
				fieldValueType = oFF.XValueType.STRING;
			} else {
				fieldValueType = field.getValueType();
			}
		}
		memberType = line.getDimensionMemberType();
		isTypeTotals = memberType === oFF.MemberType.RESULT
				|| memberType === oFF.MemberType.CONDITION_RESULT
				|| memberType === oFF.MemberType.CONDITION_OTHERS_RESULT;
		valueException = line.getValueException();
		isNullValue = valueException === oFF.ValueException.NULL_VALUE;
		if (fieldValueType === oFF.XValueType.STRING || isTypeTotals) {
			formattedValue = inaFieldValues.getStringAt(memberIndex);
			if (isTypeTotals && oFF.notNull(valueException)) {
				if (memberType === oFF.MemberType.RESULT) {
					formattedValue = "Total";
				} else {
					if (memberType === oFF.MemberType.CONDITION_RESULT) {
						formattedValue = "Total Including";
					} else {
						formattedValue = "Total Remaining";
					}
				}
				line.setValueException(oFF.ValueException.NORMAL);
			}
			if (line.getValueException() === oFF.ValueException.NULL_VALUE) {
				formattedValue = "";
			}
			line.setString(formattedValue);
		} else {
			if (fieldValueType === oFF.XValueType.BOOLEAN) {
				booleanValue = inaFieldValues.getBooleanAt(memberIndex);
				line.setBoolean(booleanValue);
				formattedValue = oFF.XBoolean.convertToString(booleanValue);
			} else {
				if (fieldValueType === oFF.XValueType.INTEGER) {
					intValue = inaFieldValues.getIntegerAt(memberIndex);
					line.setInteger(intValue);
					formattedValue = oFF.XInteger.convertToString(intValue);
				} else {
					if (fieldValueType === oFF.XValueType.LONG) {
						longValue = inaFieldValues.getLongAt(memberIndex);
						line.setLong(longValue);
						formattedValue = oFF.XLong.convertToString(longValue);
					} else {
						if (fieldValueType === oFF.XValueType.DOUBLE
								|| fieldValueType === oFF.XValueType.DECIMAL_FLOAT) {
							doubleValue = inaFieldValues
									.getDoubleAt(memberIndex);
							line.setDouble(doubleValue);
							formattedValue = oFF.XDouble
									.convertToString(doubleValue);
						} else {
							if (fieldValueType === oFF.XValueType.DATE) {
								formattedValue = inaFieldValues
										.getStringAt(memberIndex);
								if (isNullValue) {
									line.setNullByType(fieldValueType);
								} else {
									dateValue = oFF.XDate
											.createDateFromStringWithFlag(
													formattedValue,
													this.m_supportsSapDateFormat);
									if (this.m_supportsSapDateFormat
											&& oFF.notNull(dateValue)) {
										formattedValue = dateValue
												.toIsoFormat();
									}
									line.setDate(dateValue);
								}
							} else {
								if (fieldValueType === oFF.XValueType.TIME) {
									formattedValue = inaFieldValues
											.getStringAt(memberIndex);
									if (isNullValue) {
										line.setNullByType(fieldValueType);
									} else {
										timeValue = oFF.XTime
												.createTimeFromStringWithFlag(
														formattedValue,
														this.m_supportsSapDateFormat);
										if (this.m_supportsSapDateFormat
												&& oFF.notNull(timeValue)) {
											formattedValue = timeValue
													.toIsoFormat();
										}
										line.setTime(timeValue);
									}
								} else {
									if (fieldValueType === oFF.XValueType.DATE_TIME) {
										formattedValue = inaFieldValues
												.getStringAt(memberIndex);
										if (isNullValue) {
											line.setNullByType(fieldValueType);
										} else {
											dateTimeValue = oFF.XDateTime
													.createDateTimeFromStringWithFlag(
															formattedValue,
															this.m_supportsSapDateFormat);
											if (this.m_supportsSapDateFormat
													&& oFF
															.notNull(dateTimeValue)) {
												formattedValue = dateTimeValue
														.toIsoFormat();
											}
											line.setDateTime(dateTimeValue);
										}
									} else {
										if (fieldValueType.isSpatial()) {
											formattedValue = inaFieldValues
													.getStringAt(memberIndex);
											geometry = oFF.XGeometryValue
													.createGeometryValueWithWkt(formattedValue);
											if (oFF.isNull(geometry)) {
												line.setString(formattedValue);
											} else {
												spatialType = geometry
														.getValueType();
												if (spatialType === oFF.XValueType.MULTI_POLYGON) {
													line
															.setMultiPolygon(geometry);
												} else {
													if (spatialType === oFF.XValueType.LINE_STRING) {
														line
																.setLineString(geometry);
													} else {
														if (spatialType === oFF.XValueType.MULTI_LINE_STRING) {
															line
																	.setMultiLineString(geometry);
														} else {
															if (spatialType === oFF.XValueType.POINT) {
																line
																		.setPoint(geometry);
															} else {
																if (spatialType === oFF.XValueType.POLYGON) {
																	line
																			.setPolygon(geometry);
																} else {
																	if (spatialType === oFF.XValueType.MULTI_POINT) {
																		line
																				.setMultiPoint(geometry);
																	}
																}
															}
														}
													}
												}
											}
										} else {
											error = oFF.XMessage
													.createErrorWithCode(
															oFF.OriginLayer.UTILITY,
															oFF.ErrorCodes.INVALID_DATATYPE,
															"Unsupported datatype",
															null, false,
															fieldValueType);
											line.setErrorValue(error);
											formattedValue = error.getText();
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return formattedValue;
	};
	oFF.InARsAxisProvider.prototype.getTuplesCount = function() {
		return this.m_tuplesCount;
	};
	oFF.InARsAxisProvider.prototype.getTuplesCountTotal = function() {
		return this.m_tuplesCountTotal;
	};
	oFF.InARsAxisProvider.prototype.getTupleElementsCount = function() {
		return this.m_tupleElementsCount;
	};
	oFF.InARsAxisProvider.prototype.getDataCount = function() {
		return this.m_dataCount;
	};
	oFF.InARsDimension = function() {
	};
	oFF.InARsDimension.prototype = new oFF.DfNameTextObject();
	oFF.InARsDimension.create = function(inaDimension, dimension,
			requestContext, rsDefAxis) {
		var object = new oFF.InARsDimension();
		var name = inaDimension.getStringByKey("Name");
		var inaHierarchy = inaDimension.getStructureByKey("Hierarchy");
		var hierarchyName;
		var childAlignment;
		var isBottomUp;
		var inaAttributes;
		var dimensionType;
		if (oFF.isNull(inaHierarchy)) {
			hierarchyName = null;
			childAlignment = oFF.Alignment.DEFAULT_VALUE;
		} else {
			hierarchyName = inaHierarchy.getStringByKey("Name");
			isBottomUp = inaHierarchy.getBooleanByKeyExt("ExpandBottomUp",
					false);
			childAlignment = isBottomUp ? oFF.Alignment.CHILDREN_ABOVE_PARENT
					: oFF.Alignment.CHILDREN_BELOW_PARENT;
		}
		inaAttributes = inaDimension.getListByKey("Attributes");
		dimensionType = oFF.QInAConverter.lookupDimensionType(inaDimension
				.getIntegerByKeyExt("DimensionType", 0));
		object.setupExt(name, inaAttributes, dimension, requestContext,
				rsDefAxis, hierarchyName, dimensionType, childAlignment);
		return object;
	};
	oFF.InARsDimension.prototype.m_fields = null;
	oFF.InARsDimension.prototype.m_displayValues = null;
	oFF.InARsDimension.prototype.m_drillStates = null;
	oFF.InARsDimension.prototype.m_memberIndexes = null;
	oFF.InARsDimension.prototype.m_parentIndexes = null;
	oFF.InARsDimension.prototype.m_nodeIds = null;
	oFF.InARsDimension.prototype.m_childCountValues = null;
	oFF.InARsDimension.prototype.m_memberTypesEncoded = null;
	oFF.InARsDimension.prototype.m_memberTypes = null;
	oFF.InARsDimension.prototype.m_keyFieldIndex = 0;
	oFF.InARsDimension.prototype.m_hierarchyNavigationKeyIndex = 0;
	oFF.InARsDimension.prototype.m_absoluteLevels = null;
	oFF.InARsDimension.prototype.m_isHierarchyActive = false;
	oFF.InARsDimension.prototype.m_hierarchyName = null;
	oFF.InARsDimension.prototype.m_dimensionType = null;
	oFF.InARsDimension.prototype.m_childAlignment = null;
	oFF.InARsDimension.prototype.releaseObject = function() {
		this.m_fields = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_fields);
		this.m_displayValues = oFF.XObjectExt.release(this.m_displayValues);
		this.m_drillStates = oFF.XObjectExt.release(this.m_drillStates);
		this.m_memberIndexes = oFF.XObjectExt.release(this.m_memberIndexes);
		this.m_parentIndexes = oFF.XObjectExt.release(this.m_parentIndexes);
		this.m_nodeIds = oFF.XObjectExt.release(this.m_nodeIds);
		this.m_memberTypesEncoded = oFF.XObjectExt
				.release(this.m_memberTypesEncoded);
		this.m_memberTypes = oFF.XObjectExt.release(this.m_memberTypes);
		this.m_childCountValues = oFF.XObjectExt
				.release(this.m_childCountValues);
		this.m_absoluteLevels = oFF.XObjectExt.release(this.m_absoluteLevels);
		this.m_dimensionType = null;
		this.m_hierarchyName = null;
		this.m_childAlignment = null;
		oFF.DfNameTextObject.prototype.releaseObject.call(this);
	};
	oFF.InARsDimension.prototype.setupExt = function(name, inaAttributes,
			dimension, requestContext, rsDefAxis, hierarchyName, dimensionType,
			childAlignment) {
		var rsDimension;
		var keyField;
		var hierarchyNavigationKeyField;
		var flatKey;
		var hierarchyKey;
		var valueHelp;
		var flatKeyIndex;
		var hierarchyKeyIndex;
		var isValueHelp;
		var size;
		var idxInaField;
		var inaField;
		var fieldName;
		var fieldSufix;
		var inaPresentationType;
		var presentationType;
		this.setName(name);
		this.m_keyFieldIndex = -1;
		this.m_hierarchyNavigationKeyIndex = -1;
		this.m_hierarchyName = hierarchyName;
		rsDimension = oFF.XCollectionUtils.getByName(rsDefAxis
				.getRsDimensions(), name);
		this.m_isHierarchyActive = oFF.isNull(rsDimension) ? oFF.XStringUtils
				.isNotNullAndNotEmpty(hierarchyName) : rsDimension
				.isHierarchyActive();
		this.m_dimensionType = dimensionType;
		this.m_childAlignment = childAlignment;
		if (oFF.notNull(inaAttributes)) {
			keyField = null;
			hierarchyNavigationKeyField = null;
			flatKey = null;
			hierarchyKey = null;
			valueHelp = false;
			flatKeyIndex = -1;
			hierarchyKeyIndex = -1;
			if (oFF.notNull(dimension)) {
				isValueHelp = requestContext === oFF.QContextType.SELECTOR;
				if (isValueHelp) {
					keyField = dimension.getKeyField();
				}
				if (isValueHelp || this.m_isHierarchyActive) {
					hierarchyKey = dimension.getHierarchyKeyField();
					hierarchyNavigationKeyField = dimension
							.getHierarchyNavigationField();
				}
				flatKey = dimension.getFlatKeyField();
				this.m_dimensionType = dimension.getDimensionType();
			} else {
				flatKeyIndex = 0;
			}
			size = inaAttributes.size();
			this.m_fields = oFF.XList.create();
			for (idxInaField = 0; idxInaField < size; idxInaField++) {
				inaField = inaAttributes.getStructureAt(idxInaField);
				fieldName = this.getFieldName(inaField, dimension, rsDefAxis);
				if (oFF.notNull(keyField)
						&& oFF.XString.isEqual(fieldName, keyField.getName())) {
					valueHelp = true;
					this.m_keyFieldIndex = idxInaField;
				}
				if (oFF.notNull(hierarchyKey)
						&& oFF.XString.isEqual(fieldName, hierarchyKey
								.getName())) {
					hierarchyKeyIndex = idxInaField;
				} else {
					if (oFF.notNull(flatKey)
							&& oFF.XString
									.isEqual(fieldName, flatKey.getName())) {
						flatKeyIndex = idxInaField;
					}
				}
				if (oFF.notNull(hierarchyNavigationKeyField)
						&& oFF.XString.isEqual(fieldName,
								hierarchyNavigationKeyField.getName())) {
					this.m_hierarchyNavigationKeyIndex = idxInaField;
				}
				if (oFF.notNull(dimension) && dimension.isMeasureStructure()
						&& oFF.XString.startsWith(fieldName, "1ROWCOUNT")) {
					fieldSufix = oFF.XStringTokenizer.splitString(fieldName,
							".").get(1);
					if (oFF.XString.endsWith(dimension.getKeyField().getName(),
							fieldSufix)) {
						flatKeyIndex = idxInaField;
					}
				}
				inaPresentationType = inaField
						.getStringByKey("PresentationType");
				presentationType = oFF.QInAConverter
						.lookupPresentationType(inaPresentationType);
				if (presentationType === oFF.PresentationType.KEY) {
					flatKeyIndex = idxInaField;
				} else {
					if (presentationType === oFF.PresentationType.HIERARCHY_KEY) {
						hierarchyKeyIndex = idxInaField;
					}
				}
				this.m_fields.add(oFF.InARsField.create(fieldName, inaField));
			}
			if (!valueHelp) {
				if (hierarchyKeyIndex === -1) {
					this.m_keyFieldIndex = flatKeyIndex;
				} else {
					this.m_keyFieldIndex = hierarchyKeyIndex;
				}
			}
		}
	};
	oFF.InARsDimension.prototype.getFieldName = function(inaField, dimension,
			rsDefAxis) {
		var name = inaField.getStringByKey("Name");
		var queryModel;
		var fieldDimName;
		var udh;
		var axis;
		var originalDimension;
		var dimName;
		if (oFF.notNull(dimension)) {
			queryModel = dimension.getQueryModel();
			if (queryModel.getQueryManager()
					.isHierarchyToUDHConversionEnabled()) {
				fieldDimName = oFF.XString.containsString(name, ".") ? oFF.XString
						.substring(name, 0, oFF.XString.indexOf(name, "."))
						: name;
				udh = queryModel.getUniversalDisplayHierarchies().getByName(
						fieldDimName);
				if (oFF.notNull(udh)) {
					axis = queryModel.getAxis(rsDefAxis.getType());
					originalDimension = oFF.QInAUniversalDisplayHierarchies
							.getDimensionWithLeveledHierarchy(axis);
					if (oFF.notNull(originalDimension)) {
						dimName = originalDimension.getName();
						name = oFF.XString
								.replace(name, udh.getName(), dimName);
						inaField.putString("Name", name);
					}
				}
			}
		}
		return name;
	};
	oFF.InARsDimension.prototype.getHierarchyName = function() {
		return this.m_hierarchyName;
	};
	oFF.InARsDimension.prototype.getDimensionType = function() {
		return this.m_dimensionType;
	};
	oFF.InARsDimension.prototype.getFields = function() {
		return this.m_fields;
	};
	oFF.InARsDimension.prototype.getMemberIndexes = function() {
		return this.m_memberIndexes;
	};
	oFF.InARsDimension.prototype.getParentIndexes = function() {
		return this.m_parentIndexes;
	};
	oFF.InARsDimension.prototype.getDisplayValues = function() {
		return this.m_displayValues;
	};
	oFF.InARsDimension.prototype.getAbsoluteLevelValues = function() {
		return this.m_absoluteLevels;
	};
	oFF.InARsDimension.prototype.getDrillStates = function() {
		return this.m_drillStates;
	};
	oFF.InARsDimension.prototype.getNodeIds = function() {
		return this.m_nodeIds;
	};
	oFF.InARsDimension.prototype.setMemberTypes = function(encodedValues) {
		var index;
		var memberTypeValue;
		this.m_memberTypesEncoded = encodedValues;
		this.m_memberTypes = oFF.XArray
				.create(this.m_memberTypesEncoded.size());
		for (index = 0; this.m_memberTypesEncoded.hasNextValue(); index++) {
			memberTypeValue = this.m_memberTypesEncoded.getNextIntegerValue();
			this.m_memberTypes.set(index, oFF.QInAConverter
					.lookupMemberType(memberTypeValue));
		}
	};
	oFF.InARsDimension.prototype.getMemberType = function(memberIndex) {
		if (oFF.isNull(this.m_memberTypes)
				|| memberIndex >= this.m_memberTypes.size()) {
			return oFF.MemberType.MEMBER;
		}
		return this.m_memberTypes.get(memberIndex);
	};
	oFF.InARsDimension.prototype.getKeyFieldIndex = function() {
		return this.m_keyFieldIndex;
	};
	oFF.InARsDimension.prototype.getHierarchyNavigationKeyIndex = function() {
		return this.m_hierarchyNavigationKeyIndex;
	};
	oFF.InARsDimension.prototype.getChildCountValues = function() {
		return this.m_childCountValues;
	};
	oFF.InARsDimension.prototype.setupFromRsTuple = function(rsTuple) {
		var rsTupleProperty = rsTuple.getStructureByKey("DisplayLevel");
		if (oFF.notNull(rsTupleProperty)) {
			this.m_displayValues = oFF.InARsEncodedValues
					.createByStructure(rsTupleProperty);
		}
		rsTupleProperty = rsTuple.getStructureByKey("Level");
		if (oFF.notNull(rsTupleProperty)) {
			this.m_absoluteLevels = oFF.InARsEncodedValues
					.createByStructure(rsTupleProperty);
		}
		rsTupleProperty = rsTuple.getStructureByKey("DrillState");
		if (oFF.notNull(rsTupleProperty)) {
			this.m_drillStates = oFF.InARsEncodedValues
					.createByStructure(rsTupleProperty);
		}
		rsTupleProperty = rsTuple.getStructureByKey("MemberIndexes");
		if (oFF.notNull(rsTupleProperty)) {
			this.m_memberIndexes = oFF.InARsEncodedValues
					.createByStructure(rsTupleProperty);
		}
		rsTupleProperty = rsTuple.getStructureByKey("ParentIndexes");
		if (oFF.notNull(rsTupleProperty)) {
			this.m_parentIndexes = oFF.InARsEncodedValues
					.createByStructure(rsTupleProperty);
		}
		rsTupleProperty = rsTuple.getStructureByKey("TupleElementIds");
		if (oFF.notNull(rsTupleProperty)) {
			this.m_nodeIds = oFF.InARsEncodedValues
					.createByStructure(rsTupleProperty);
		}
		rsTupleProperty = rsTuple.getStructureByKey("ChildCount");
		if (oFF.notNull(rsTupleProperty)) {
			this.m_childCountValues = oFF.InARsEncodedValues
					.createByStructure(rsTupleProperty);
		}
	};
	oFF.InARsDimension.prototype.getLowerLevelNodeAlignment = function() {
		return this.m_childAlignment;
	};
	oFF.InARsDimension.prototype.hasDefaultLowerLevelNodeAlignment = function() {
		return this.m_childAlignment === oFF.Alignment.DEFAULT_VALUE;
	};
	oFF.InARsDimension.prototype.isHierarchyActive = function() {
		return this.m_isHierarchyActive;
	};
	oFF.InARsField = function() {
	};
	oFF.InARsField.prototype = new oFF.DfNameTextObject();
	oFF.InARsField.create = function(name, inaField) {
		var object = new oFF.InARsField();
		var fieldText = inaField.getStringByKey("Description");
		var valueType = oFF.QInAConverter.lookupValueType(inaField
				.getStringByKey("ValueType"));
		var presentationType;
		var inaPresentationType = inaField.getStringByKey("PresentationType");
		var obtainability;
		var isVisible;
		var inaValueExceptions;
		var inaValues;
		if (oFF.isNull(inaPresentationType)) {
			presentationType = oFF.PresentationType.UNDEFINED;
		} else {
			presentationType = oFF.QInAConverter
					.lookupPresentationType(inaPresentationType);
		}
		obtainability = inaField.getStringByKeyExt("Obtainability", "Always");
		isVisible = oFF.XString.isEqual("Always", obtainability);
		inaValueExceptions = inaField.getListByKey("ValuesException");
		inaValues = inaField.getListByKey("Values");
		object.setupExt(name, fieldText, inaValues, isVisible,
				inaValueExceptions, valueType, presentationType);
		return object;
	};
	oFF.InARsField.prototype.m_values = null;
	oFF.InARsField.prototype.m_valueExceptions = null;
	oFF.InARsField.prototype.m_isVisible = false;
	oFF.InARsField.prototype.m_valueType = null;
	oFF.InARsField.prototype.m_presentationType = null;
	oFF.InARsField.prototype.setupExt = function(name, text, values, isVisible,
			inaValueExceptions, valueType, presentationType) {
		this.setName(name);
		this.setText(text);
		this.m_values = values;
		this.m_isVisible = isVisible;
		this.m_valueExceptions = inaValueExceptions;
		this.m_valueType = valueType;
		this.m_presentationType = presentationType;
	};
	oFF.InARsField.prototype.releaseObject = function() {
		this.m_valueType = null;
		this.m_presentationType = null;
		this.m_values = oFF.XObjectExt.release(this.m_values);
		this.m_valueExceptions = oFF.XObjectExt.release(this.m_valueExceptions);
		oFF.DfNameTextObject.prototype.releaseObject.call(this);
	};
	oFF.InARsField.prototype.getValues = function() {
		return this.m_values;
	};
	oFF.InARsField.prototype.getValueExceptionAt = function(index) {
		return oFF.isNull(this.m_valueExceptions) ? -1 : this.m_valueExceptions
				.getIntegerAt(index);
	};
	oFF.InARsField.prototype.isVisible = function() {
		return this.m_isVisible;
	};
	oFF.InARsField.prototype.getValueType = function() {
		return this.m_valueType;
	};
	oFF.InARsField.prototype.getPresentationType = function() {
		return this.m_presentationType;
	};
	oFF.QInAExport = function() {
	};
	oFF.QInAExport.prototype = new oFF.QInA();
	oFF.QInAExport.prototype.exportMemberHelpRequest = function(queryModel,
			dimension) {
		return oFF.QInAValueHelp.exportMemberHelpRequest(this, queryModel,
				dimension);
	};
	oFF.QInAExport.prototype.exportVariableHelpRequest = function(queryModel,
			dimension, variable) {
		return oFF.QInAValueHelp.exportVariableHelpRequest(this, queryModel,
				dimension, variable);
	};
	oFF.QInAExport.prototype.exportComponent = function(componentType,
			modelComponent, inaParentStructure, flags) {
		var olapComponentType = componentType;
		var inaComponent;
		var inaCloneRoot;
		var inaMetadataElement;
		var inaModelElement;
		if (oFF.isNull(olapComponentType) && oFF.notNull(modelComponent)) {
			olapComponentType = modelComponent.getOlapComponentType();
		}
		if (oFF.isNull(olapComponentType)) {
			this.addError(0, "No component type given for export");
			return null;
		}
		if (this.mode === oFF.QModelFormat.INA_CLONE) {
			inaCloneRoot = inaParentStructure;
			if (oFF.isNull(inaCloneRoot)) {
				inaCloneRoot = oFF.PrFactory.createStructure();
			}
			this.mode = oFF.QModelFormat.INA_METADATA_CORE;
			inaComponent = this.lookupInAComponent(olapComponentType, null);
			if (oFF.isNull(inaComponent)) {
				return null;
			}
			inaMetadataElement = inaComponent.exportComponent(this,
					modelComponent, inaParentStructure, flags);
			if (oFF.notNull(inaMetadataElement)) {
				inaCloneRoot.put("Metadata", inaMetadataElement);
			}
			this.mode = oFF.QModelFormat.INA_REPOSITORY;
			inaComponent = this.lookupInAComponent(olapComponentType, null);
			if (oFF.isNull(inaComponent)) {
				return null;
			}
			inaModelElement = inaComponent.exportComponent(this,
					modelComponent, inaParentStructure, flags);
			if (oFF.notNull(inaModelElement)) {
				inaCloneRoot.put("Runtime", inaModelElement);
			}
			this.mode = oFF.QModelFormat.INA_CLONE;
			return inaCloneRoot;
		}
		inaComponent = this.lookupInAComponent(olapComponentType, null);
		if (oFF.isNull(inaComponent)) {
			return null;
		}
		return inaComponent.exportComponent(this, modelComponent,
				inaParentStructure, flags);
	};
	oFF.QInAExport.prototype.exportQueryModel = function(queryModel,
			withVariables, withDataSource) {
		var flags = oFF.QImExFlag.DEFAULT_ALL;
		if (!withDataSource) {
			flags = oFF.XMath.binaryXOr(flags, oFF.QImExFlag.DATASOURCE);
		}
		if (!withVariables) {
			flags = oFF.XMath.binaryXOr(flags, oFF.QImExFlag.VARIABLES);
		}
		return this.exportComponent(null, queryModel, null, flags);
	};
	oFF.QInAExport.prototype.exportQuerySettings = function(queryModel,
			inaStructure) {
		this.exportComponent(oFF.OlapComponentType.QUERY_SETTINGS, queryModel,
				inaStructure, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportTotals = function(rc, inaStructure) {
		this.exportComponent(oFF.OlapComponentType.TOTALS, rc, inaStructure,
				oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportAxesSettings = function(queryModel,
			inaStructure) {
		this.exportComponent(oFF.OlapComponentType.AXES_SETTINGS, queryModel,
				inaStructure, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportAxis = function(axis, inaStructure) {
		return this.exportComponent(oFF.OlapComponentType.AXIS, axis,
				inaStructure, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportDataCell = function(queryDataCell,
			inaQueryModel) {
		return this.exportComponent(oFF.OlapComponentType.DATA_CELL,
				queryDataCell, inaQueryModel, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportDataCells = function(queryModel,
			inaQueryModel) {
		this.exportComponent(oFF.OlapComponentType.DATA_CELLS, queryModel,
				inaQueryModel, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportDrillPathElement = function(element,
			isDrillContext) {
		var flags = oFF.QImExFlag.DEFAULT_ALL;
		if (isDrillContext) {
			flags = oFF.XMath.binaryXOr(flags, oFF.QImExFlag.DRILL_CONTEXT);
		}
		return this.exportComponent(oFF.MemberType.DRILL_PATH_ELEMENT, element,
				null, flags);
	};
	oFF.QInAExport.prototype.exportDrillOperation = function(operation) {
		return this.exportComponent(oFF.OlapComponentType.DRILL_OPERATION,
				operation, null, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportDrillManager = function(drillManager,
			inaQueryModel) {
		this.exportComponent(oFF.OlapComponentType.DRILL_MANAGER, drillManager,
				inaQueryModel, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportExceptionAggregationManager = function(
			excepAggrManager, inaQueryModel) {
		this.exportComponent(
				oFF.OlapComponentType.EXCEPTION_AGGREGATION_MANAGER,
				excepAggrManager, inaQueryModel, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportStructureDimension = function(
			structureDimension) {
		return this.exportComponent(null, structureDimension, null,
				oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportVariables = function(variableContainer,
			parentStructure) {
		return this.exportComponent(null, variableContainer, parentStructure,
				oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportVariableContainer = function(
			variableContainer, parentStructure) {
		this.exportComponent(oFF.OlapComponentType.VARIABLE_CONTAINER,
				variableContainer, parentStructure, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportVariableList = function(variableContainer) {
		return this.exportComponent(oFF.OlapComponentType.VARIABLE_LIST,
				variableContainer, null, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportDataSource = function(datasource,
			withRunAsUser) {
		var flags = oFF.QImExFlag.DEFAULT_ALL;
		if (withRunAsUser) {
			flags = oFF.XMath.binaryXOr(flags, oFF.QImExFlag.RUN_AS_USER);
		}
		return this.exportComponent(null, datasource, null, flags);
	};
	oFF.QInAExport.prototype.exportSortingManager = function(sortingManager,
			inaQueryModel) {
		this.exportComponent(oFF.OlapComponentType.SORT_MANAGER,
				sortingManager, inaQueryModel, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportCondition = function(condition) {
		return this.exportComponent(oFF.OlapComponentType.CONDITION, condition,
				null, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportMembers = function(dimension,
			inaParentStructure) {
		var orderedStructureMemberNames;
		var orderedNamesList;
		this.exportComponent(oFF.OlapComponentType.MEMBERS, dimension,
				inaParentStructure, oFF.QImExFlag.DEFAULT_ALL);
		if (this.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
			orderedStructureMemberNames = dimension
					.getOrderedStructureMemberNames();
			if (oFF.notNull(orderedStructureMemberNames)) {
				orderedNamesList = inaParentStructure
						.putNewList("OrderedStructureMemberNames");
				orderedNamesList.addAllStrings(orderedStructureMemberNames);
			}
		}
	};
	oFF.QInAExport.prototype.exportConditionThreshold = function(
			conditionThreshold) {
		return this.exportComponent(oFF.OlapComponentType.CONDITIONS_THRESHOLD,
				conditionThreshold, null, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportDimensionMemberVariable = function(
			dimensionMemberVariable, inaParentStructure) {
		return this.exportComponent(oFF.VariableType.DIMENSION_MEMBER_VARIABLE,
				dimensionMemberVariable, inaParentStructure,
				oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportOptionListVariable = function(variable,
			inaStructure) {
		this.exportComponent(oFF.VariableType.OPTION_LIST_VARIABLE, variable,
				inaStructure, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportRestrictedMeasure = function(
			restrictedMeasure, inaParentStructure) {
		this.exportComponent(oFF.MemberType.RESTRICTED_MEASURE,
				restrictedMeasure, inaParentStructure,
				oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportBasicMeasure = function(basicMeasure,
			inaMember) {
		this.exportComponent(oFF.MemberType.BASIC_MEASURE, basicMeasure,
				inaMember, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportFormulaMeasure = function(formulaMeasure,
			inaMember) {
		this.exportComponent(oFF.MemberType.FORMULA, formulaMeasure, inaMember,
				oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportFilterTuple = function(filterTuple) {
		return this.exportComponent(oFF.FilterComponentType.TUPLE, filterTuple,
				null, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportFilterVirtualDatasource = function(
			filterVirtualDatasource) {
		return this.exportComponent(oFF.FilterComponentType.VIRTUAL_DATASOURCE,
				filterVirtualDatasource, null, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportFilterElement = function(filterElement) {
		return this.exportComponent(oFF.OlapComponentType.FILTER_ELEMENT,
				filterElement, null, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportFilterAlgebra = function(logicalContainer,
			inaParentStructure) {
		this
				.exportComponent(oFF.FilterComponentType.BOOLEAN_ALGEBRA,
						logicalContainer, inaParentStructure,
						oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportStructureMember = function(member) {
		return this.exportComponent(oFF.MemberType.ABSTRACT_MEMBER, member,
				null, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportCartesianList = function(cartesianList,
			inaParentStructure) {
		return this.exportComponent(oFF.FilterComponentType.CARTESIAN_LIST,
				cartesianList, inaParentStructure, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportFilterExpression = function(filterExpression) {
		return this.exportComponent(oFF.OlapComponentType.FILTER_EXPRESSION,
				filterExpression, null, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportFixedFilter = function(filter, inaQueryModel) {
		this.exportComponent(oFF.OlapComponentType.FILTER_FIXED, filter,
				inaQueryModel, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportDynamicFilter = function(filter,
			inaQueryModel) {
		this.exportComponent(oFF.OlapComponentType.FILTER_DYNAMIC, filter,
				inaQueryModel, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportVisibilityFilter = function(filter,
			inaQueryModel) {
		this.exportComponent(oFF.OlapComponentType.FILTER_VISIBILITY, filter,
				inaQueryModel, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportFilter = function(filter, inaParentStructure) {
		this.exportComponent(oFF.OlapComponentType.SELECTOR, filter,
				inaParentStructure, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportFilterOperation = function(filterOperation,
			inaParentStructure) {
		this.exportComponent(oFF.FilterComponentType.OPERATION,
				filterOperation, inaParentStructure, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportCellValueOperand = function(cellValueOperand) {
		return this.exportComponent(
				oFF.OlapComponentType.FILTER_CELL_VALUE_OPERAND,
				cellValueOperand, null, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportFilterGeo = function(operation,
			inaParentStructure) {
		this.exportComponent(oFF.FilterComponentType.SPATIAL_FILTER, operation,
				inaParentStructure, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportFilterMemberOperand = function(operation,
			inaParent) {
		this.exportComponent(oFF.FilterComponentType.MEMBER_OPERAND, operation,
				inaParent, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportFilterCartesianProduct = function(
			cartesianProduct, inaParentStructure) {
		this
				.exportComponent(oFF.FilterComponentType.CARTESIAN_PRODUCT,
						cartesianProduct, inaParentStructure,
						oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportConditionManager = function(
			conditionManager, inaParentStructure) {
		this
				.exportComponent(oFF.OlapComponentType.CONDITIONS_MANAGER,
						conditionManager, inaParentStructure,
						oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportDimension = function(dimension, inaStructure) {
		if (dimension.getDimensionType() === oFF.DimensionType.CALCULATED_DIMENSION) {
			return this.exportComponent(oFF.DimensionType.CALCULATED_DIMENSION,
					dimension, inaStructure, oFF.QImExFlag.DEFAULT_ALL);
		}
		return this.exportComponent(oFF.OlapComponentType.ABSTRACT_DIMENSION,
				dimension, inaStructure, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportVariable = function(variable, inaStructure) {
		return this.exportComponent(variable.getVariableType(), variable,
				inaStructure, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportHierarchy = function(dimension,
			inaParentStructure) {
		this.exportComponent(oFF.OlapComponentType.HIERARCHY, dimension,
				inaParentStructure, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportDimensions = function(query,
			inaParentStructure) {
		this.exportComponent(oFF.OlapComponentType.DIMENSIONS, query,
				inaParentStructure, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportExceptions = function(structureMember,
			inaParentStructure) {
		this.exportComponent(oFF.OlapComponentType.EXCEPTION_MANAGER,
				structureMember, inaParentStructure, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportPreQuery = function(query) {
		return this.exportComponent(oFF.OlapComponentType.QUERY_MODEL, query,
				null, oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportUniversalDisplayHierarchies = function(
			universalDisplayHierarchies, inaParentStructure) {
		this.exportComponent(
				oFF.OlapComponentType.UNIVERSAL_DISPLAY_HIERARCHIES,
				universalDisplayHierarchies, inaParentStructure,
				oFF.QImExFlag.DEFAULT_ALL);
	};
	oFF.QInAExport.prototype.exportBlendingMappings = function(mappings) {
		return oFF.QInADataSourceBlending.exportBlendingMappings(mappings);
	};
	oFF.QInAImport = function() {
	};
	oFF.QInAImport.prototype = new oFF.QInA();
	oFF.QInAImport.prototype.importComponent = function(componentType,
			inaElement, modelComponent, parentComponent, context) {
		var component;
		var queryModel;
		if (oFF.notNull(modelComponent)) {
			if (this.mode === oFF.QModelFormat.INA_METADATA
					|| this.mode === oFF.QModelFormat.INA_CLONE
					|| this.mode === oFF.QModelFormat.INA_METADATA_CORE) {
				modelComponent.stopEventing();
			} else {
				modelComponent.queueEventing();
			}
		}
		component = this.innerImportComponent(componentType, inaElement,
				modelComponent, parentComponent, context);
		if (oFF.notNull(modelComponent)) {
			modelComponent.resumeEventing();
		}
		if (componentType === oFF.OlapComponentType.QUERY_MODEL
				&& oFF.notNull(modelComponent) && oFF.notNull(inaElement)) {
			queryModel = modelComponent;
			if (this.mode === oFF.QModelFormat.INA_METADATA
					|| this.mode === oFF.QModelFormat.INA_METADATA_CORE) {
				queryModel.setServerBaseSerialization(inaElement.asStructure());
			}
		}
		return component;
	};
	oFF.QInAImport.prototype.innerImportComponent = function(componentType,
			inaElement, modelComponent, parentComponent, context) {
		var olapComponentType = componentType;
		var inaStructure;
		var cType;
		var componentModel;
		var importedModelComponent;
		var inaClone;
		var inaMetadataElement;
		var inaModelElement;
		if (oFF.isNull(olapComponentType) && oFF.notNull(modelComponent)) {
			olapComponentType = modelComponent.getOlapComponentType();
		}
		if (oFF.isNull(olapComponentType) && oFF.notNull(inaElement)
				&& inaElement.isStructure()) {
			inaStructure = inaElement;
			cType = inaStructure.getStringByKey("CType");
			if (oFF.notNull(cType)) {
				olapComponentType = oFF.QInAConverter
						.lookupComponentType(cType);
			}
		}
		if (oFF.isNull(olapComponentType)) {
			this.addError(0, "Cannot find olap component type for import");
			return modelComponent;
		}
		importedModelComponent = modelComponent;
		if (this.mode === oFF.QModelFormat.INA_METADATA) {
			this.mode = oFF.QModelFormat.INA_METADATA_CORE;
			componentModel = this.lookupInAComponent(olapComponentType,
					inaElement);
			if (oFF.isNull(componentModel)) {
				return modelComponent;
			}
			importedModelComponent = componentModel.importComponent(this,
					inaElement, importedModelComponent, parentComponent,
					context);
			this.mode = oFF.QModelFormat.INA_DATA;
			componentModel = this.lookupInAComponent(olapComponentType,
					inaElement);
			if (oFF.isNull(componentModel)) {
				return modelComponent;
			}
			importedModelComponent = componentModel.importComponent(this,
					inaElement, importedModelComponent, parentComponent,
					context);
			this.mode = oFF.QModelFormat.INA_METADATA;
		} else {
			if (this.mode === oFF.QModelFormat.INA_CLONE) {
				inaClone = inaElement;
				this.mode = oFF.QModelFormat.INA_METADATA_CORE;
				inaMetadataElement = inaClone.getByKey("Metadata");
				componentModel = this.lookupInAComponent(olapComponentType,
						inaMetadataElement);
				if (oFF.isNull(componentModel)) {
					return modelComponent;
				}
				importedModelComponent = componentModel.importComponent(this,
						inaMetadataElement, importedModelComponent,
						parentComponent, context);
				this.mode = oFF.QModelFormat.INA_REPOSITORY;
				inaModelElement = inaClone.getByKey("Runtime");
				componentModel = this.lookupInAComponent(olapComponentType,
						inaModelElement);
				if (oFF.isNull(componentModel)) {
					return modelComponent;
				}
				importedModelComponent = componentModel.importComponent(this,
						inaModelElement, importedModelComponent,
						parentComponent, context);
				this.mode = oFF.QModelFormat.INA_CLONE;
			} else {
				componentModel = this.lookupInAComponent(olapComponentType,
						inaElement);
				if (oFF.isNull(componentModel)) {
					return modelComponent;
				}
				importedModelComponent = componentModel.importComponent(this,
						inaElement, importedModelComponent, parentComponent,
						context);
			}
		}
		return importedModelComponent;
	};
	oFF.QInAImport.prototype.importQueryModel = function(inaQueryModel,
			queryModel) {
		this.importComponent(oFF.OlapComponentType.QUERY_MODEL, inaQueryModel,
				queryModel, null, queryModel);
	};
	oFF.QInAImport.prototype.importQuerySettings = function(inaStructure,
			queryModel) {
		this.importComponent(oFF.OlapComponentType.QUERY_SETTINGS,
				inaStructure, null, null, queryModel);
	};
	oFF.QInAImport.prototype.importDataSource = function(inaStructure) {
		return this.importComponent(oFF.OlapComponentType.DATA_SOURCE,
				inaStructure, null, null, null);
	};
	oFF.QInAImport.prototype.importTotals = function(inaStructure, rc, context) {
		this.importComponent(oFF.OlapComponentType.TOTALS, inaStructure, rc,
				null, context);
	};
	oFF.QInAImport.prototype.importAttribute = function(inaAttribute,
			dimension, context) {
		this.importComponent(oFF.OlapComponentType.ATTRIBUTE, inaAttribute,
				null, dimension, context);
	};
	oFF.QInAImport.prototype.importAxesSettings = function(inaStructure,
			queryModel) {
		this.importComponent(oFF.OlapComponentType.AXES_SETTINGS, inaStructure,
				queryModel, null, queryModel);
	};
	oFF.QInAImport.prototype.importAxis = function(inaStructure, axis, context) {
		this.importComponent(oFF.OlapComponentType.AXIS, inaStructure, axis,
				null, context);
	};
	oFF.QInAImport.prototype.importExceptionAggregationManager = function(
			inaDefinition, excepAggrManager, context) {
		this.importComponent(
				oFF.OlapComponentType.EXCEPTION_AGGREGATION_MANAGER,
				inaDefinition, excepAggrManager, null, context);
	};
	oFF.QInAImport.prototype.importSortingManager = function(inaDefinition,
			qSortingManager, context) {
		this.importComponent(oFF.OlapComponentType.SORT_MANAGER, inaDefinition,
				qSortingManager, null, context);
	};
	oFF.QInAImport.prototype.importHierarchy = function(dimension, inaHierarchy) {
		this.importComponent(oFF.OlapComponentType.HIERARCHY, inaHierarchy,
				dimension, null, dimension.getContext());
	};
	oFF.QInAImport.prototype.importExceptions = function(inaStructure, member) {
		this.importComponent(oFF.OlapComponentType.EXCEPTION_MANAGER,
				inaStructure, member, null, null);
	};
	oFF.QInAImport.prototype.importUniversalDisplayHierarchies = function(
			inaStructure, universalDisplayHierarchies, context) {
		this.importComponent(
				oFF.OlapComponentType.UNIVERSAL_DISPLAY_HIERARCHIES,
				inaStructure, universalDisplayHierarchies, null, context);
	};
	oFF.QInAImport.prototype.importFixedFilter = function(inaElement,
			filterComponent, context) {
		this.importComponent(oFF.OlapComponentType.FILTER_FIXED, inaElement,
				null, filterComponent, context);
	};
	oFF.QInAImport.prototype.importDynamicFilter = function(inaElement,
			filterComponent, context) {
		this.importComponent(oFF.OlapComponentType.FILTER_DYNAMIC, inaElement,
				null, filterComponent, context);
	};
	oFF.QInAImport.prototype.importVisibilityFilter = function(inaElement,
			filterComponent, context) {
		this.importComponent(oFF.OlapComponentType.FILTER_VISIBILITY,
				inaElement, null, filterComponent, context);
	};
	oFF.QInAImport.prototype.importFilterElement = function(inaFilterElement,
			filterElementExt, filterExpression, context) {
		return this.importComponent(oFF.OlapComponentType.FILTER_ELEMENT,
				inaFilterElement, filterElementExt, filterExpression, context);
	};
	oFF.QInAImport.prototype.importFilterAlgebra = function(filterExpression,
			inaParentStructure, context) {
		return this.importComponent(oFF.FilterComponentType.BOOLEAN_ALGEBRA,
				inaParentStructure, null, filterExpression, context);
	};
	oFF.QInAImport.prototype.importCartesianList = function(inaCartesianList,
			cartesianListExt, filterExpression, context) {
		return this.importComponent(oFF.FilterComponentType.CARTESIAN_LIST,
				inaCartesianList, cartesianListExt, filterExpression, context);
	};
	oFF.QInAImport.prototype.importFilterExpression = function(
			qDefaultExpression, inaExpression, parent, context) {
		return this.importComponent(oFF.OlapComponentType.FILTER_EXPRESSION,
				inaExpression, qDefaultExpression, parent, context);
	};
	oFF.QInAImport.prototype.importFilter = function(inaDefinition, filter,
			context) {
		this.importComponent(oFF.OlapComponentType.SELECTOR, inaDefinition,
				filter, null, context);
	};
	oFF.QInAImport.prototype.importFilterOperation = function(inaOperation,
			cartesianList, context) {
		return this.importComponent(oFF.FilterComponentType.OPERATION,
				inaOperation, null, cartesianList, context);
	};
	oFF.QInAImport.prototype.importFilterCellValueOperand = function(
			inaStructure, context) {
		return this.importComponent(
				oFF.OlapComponentType.FILTER_CELL_VALUE_OPERAND, inaStructure,
				null, null, context);
	};
	oFF.QInAImport.prototype.importFilterGeo = function(filterExpression,
			inaGeoOperand, context) {
		return this.importComponent(oFF.FilterComponentType.SPATIAL_FILTER,
				inaGeoOperand, null, filterExpression, context);
	};
	oFF.QInAImport.prototype.importFilterMemberOperand = function(container,
			inaParent, context) {
		return this.importComponent(oFF.FilterComponentType.MEMBER_OPERAND,
				inaParent, null, container, context);
	};
	oFF.QInAImport.prototype.importDrillManager = function(inaQueryModel,
			drillManager, context) {
		this.importComponent(oFF.OlapComponentType.DRILL_MANAGER,
				inaQueryModel, drillManager, null, context);
	};
	oFF.QInAImport.prototype.importDrillPathElement = function(inaDrillMember,
			drillManager, context) {
		return this.importComponent(oFF.MemberType.DRILL_PATH_ELEMENT,
				inaDrillMember, null, drillManager, context);
	};
	oFF.QInAImport.prototype.importDrillOperation = function(
			inaHierarchyNavigation, drillManager, context) {
		this.importComponent(oFF.OlapComponentType.DRILL_OPERATION,
				inaHierarchyNavigation, null, drillManager, context);
	};
	oFF.QInAImport.prototype.importVariableContainer = function(inaElement,
			variableContainer, context) {
		this.importComponent(oFF.OlapComponentType.VARIABLE_CONTAINER,
				inaElement, variableContainer, null, context);
	};
	oFF.QInAImport.prototype.importVariables = function(variables,
			variableContainer) {
		this.importComponent(oFF.OlapComponentType.VARIABLE_CONTAINER,
				variables, variableContainer, null, null);
	};
	oFF.QInAImport.prototype.importVariableList = function(variables,
			variableContainer) {
		this.importComponent(oFF.OlapComponentType.VARIABLE_LIST, variables,
				variableContainer, null, null);
	};
	oFF.QInAImport.prototype.importSimpleTypeVariable = function(inaStructure,
			simpleTypeVariable, context) {
		this.importComponent(oFF.VariableType.SIMPLE_TYPE_VARIABLE,
				inaStructure, simpleTypeVariable, null, context);
	};
	oFF.QInAImport.prototype.importDimensionMemberVariable = function(
			inaVariable, memberVariable, variableContainer, context) {
		return this.importComponent(oFF.VariableType.DIMENSION_MEMBER_VARIABLE,
				inaVariable, memberVariable, variableContainer, context);
	};
	oFF.QInAImport.prototype.importOptionListVariable = function(inaVariable,
			optionListVariable, context) {
		return this.importComponent(oFF.VariableType.OPTION_LIST_VARIABLE,
				inaVariable, optionListVariable, null, context);
	};
	oFF.QInAImport.prototype.importConditionManager = function(inAModel,
			conditionManager, context) {
		this.importComponent(oFF.OlapComponentType.CONDITIONS_MANAGER,
				inAModel, conditionManager, null, context);
	};
	oFF.QInAImport.prototype.importCondition = function(queryModelBase,
			inaCondition, condition) {
		return this.importComponent(oFF.OlapComponentType.CONDITION,
				inaCondition, condition, null, queryModelBase);
	};
	oFF.QInAImport.prototype.importConditionThreshold = function(queryModel,
			inaSingleThreshold, conditionThreshold) {
		return this.importComponent(oFF.OlapComponentType.CONDITIONS_THRESHOLD,
				inaSingleThreshold, conditionThreshold, null, queryModel);
	};
	oFF.QInAImport.prototype.importDataCell = function(inaQDataCell, queryModel) {
		this.importComponent(oFF.OlapComponentType.DATA_CELL, inaQDataCell,
				null, null, queryModel);
	};
	oFF.QInAImport.prototype.importDataCells = function(inaQueryModel,
			queryModel) {
		this.importComponent(oFF.OlapComponentType.DATA_CELLS, inaQueryModel,
				null, null, queryModel);
	};
	oFF.QInAImport.prototype.importMembers = function(inaDimension, dimension,
			context) {
		var orderedNamesList;
		var orderedStructureMemberNames;
		var len;
		var orderedNameIndex;
		var orderedNameString;
		this.importComponent(oFF.OlapComponentType.MEMBERS, inaDimension,
				dimension, null, context);
		if (this.mode.isTypeOf(oFF.QModelFormat.INA_REPOSITORY)) {
			orderedNamesList = oFF.PrUtils.getListProperty(inaDimension,
					"OrderedStructureMemberNames");
			if (oFF.notNull(orderedNamesList)) {
				orderedStructureMemberNames = oFF.XListOfString.create();
				len = oFF.PrUtils.getListSize(orderedNamesList, 0);
				for (orderedNameIndex = 0; orderedNameIndex < len; orderedNameIndex++) {
					orderedNameString = oFF.PrUtils.getStringElement(
							orderedNamesList, orderedNameIndex);
					oFF.XObjectExt.checkNotNull(orderedNameString,
							"illegal state");
					orderedStructureMemberNames.add(orderedNameString
							.getString());
				}
				dimension.reOrderStructureMembers(orderedStructureMemberNames);
			}
		}
	};
	oFF.QInAImport.prototype.importRestrictedMeasure = function(inaMember,
			dimension, context) {
		return this.importComponent(oFF.MemberType.RESTRICTED_MEASURE,
				inaMember, null, dimension, context);
	};
	oFF.QInAImport.prototype.importBasicMeasure = function(inaMember,
			qStructure, context) {
		return this.importComponent(oFF.MemberType.BASIC_MEASURE, inaMember,
				null, qStructure, context);
	};
	oFF.QInAImport.prototype.importFormulaMeasure = function(inaMember,
			dimension, queryModel) {
		return this.importComponent(oFF.MemberType.FORMULA, inaMember, null,
				dimension, queryModel);
	};
	oFF.QInAImport.prototype.importStructureMember = function(dimension,
			inaMember, context) {
		return this.importComponent(oFF.MemberType.ABSTRACT_MEMBER, inaMember,
				null, dimension, context);
	};
	oFF.QInAImport.prototype.importDimensions = function(inaQueryModel,
			queryModel, context) {
		this.importComponent(oFF.OlapComponentType.DIMENSIONS, inaQueryModel,
				queryModel, null, context);
	};
	oFF.QInAImport.prototype.importDimension = function(inaDimension, context) {
		return this.importComponent(oFF.OlapComponentType.ABSTRACT_DIMENSION,
				inaDimension, null, null, context);
	};
	oFF.QInAImport.prototype.importCalculatedDimension = function(inaDimension,
			context) {
		return this.importComponent(oFF.DimensionType.CALCULATED_DIMENSION,
				inaDimension, null, null, context);
	};
	oFF.QInAImport.prototype.importVariable = function(inaStructure,
			variableContext) {
		return this.importComponent(oFF.VariableType.ANY_VARIABLE,
				inaStructure, null, variableContext, variableContext);
	};
	oFF.QInAImport.prototype.importBasicQueryModelCapabilities = function(
			queryModel) {
		this.importComponent(oFF.OlapComponentType.QUERY_MODEL, null,
				queryModel, null, queryModel);
	};
	oFF.QInAImport.prototype.importPreQuery = function(inaPreQuery, preQuery) {
		this.importQueryModel(inaPreQuery, preQuery);
	};
	oFF.QInAImport.prototype.importDataSourceExternalDimensions = function(
			inaDataSource, dataSource) {
		oFF.QInADataSourceExtDims.importQd(this, dataSource, inaDataSource);
	};
	oFF.QInAImport.prototype.processImport = function(syncType, listener,
			customIdentifier, componentType, inaElement, modelComponent,
			parentComponent, context) {
		var action = oFF.QInAImportAction.create(this, componentType,
				inaElement, modelComponent, parentComponent, context);
		action.processSyncAction(syncType, listener, customIdentifier);
		return action;
	};
	oFF.QInAImportAction = function() {
	};
	oFF.QInAImportAction.prototype = new oFF.SyncAction();
	oFF.QInAImportAction.create = function(context, componentType, inaElement,
			modelComponent, parentComponent, modelContext) {
		var newObj = new oFF.QInAImportAction();
		newObj.setupSynchronizingObject(context);
		return newObj;
	};
	oFF.QInAImportAction.prototype.m_componentType = null;
	oFF.QInAImportAction.prototype.m_inaElement = null;
	oFF.QInAImportAction.prototype.m_modelComponent = null;
	oFF.QInAImportAction.prototype.m_parentComponent = null;
	oFF.QInAImportAction.prototype.m_modelContext = null;
	oFF.QInAImportAction.prototype.releaseObject = function() {
		this.m_componentType = null;
		this.m_inaElement = null;
		this.m_modelComponent = null;
		this.m_parentComponent = null;
		this.m_modelContext = null;
		oFF.SyncAction.prototype.releaseObject.call(this);
	};
	oFF.QInAImportAction.prototype.processSynchronization = function(syncType) {
		var importer = this.getActionContext();
		var component = importer.importComponent(this.m_componentType,
				this.m_inaElement, this.m_modelComponent,
				this.m_parentComponent, this.m_modelContext);
		this.setData(component);
		this.endSync();
		return false;
	};
	oFF.QInAImportAction.prototype.callListener = function(extResult, listener,
			data, customIdentifier) {
		listener.onImportDone(extResult, data, customIdentifier);
	};
	oFF.InAQMgrApplyStateAction = function() {
	};
	oFF.InAQMgrApplyStateAction.prototype = new oFF.QOlapSyncAction();
	oFF.InAQMgrApplyStateAction.createAndRun = function(syncType, context,
			listener, customerIdentifier, stateId, stateManager) {
		var action = new oFF.InAQMgrApplyStateAction();
		action.stateId = stateId;
		action.m_stateManager = stateManager;
		action.setupActionAndRun(syncType, context, listener,
				customerIdentifier);
		return action;
	};
	oFF.InAQMgrApplyStateAction.prototype.stateId = null;
	oFF.InAQMgrApplyStateAction.prototype.m_stateManager = null;
	oFF.InAQMgrApplyStateAction.prototype.processSynchronization = function(
			syncType) {
		var result = this.m_stateManager.applyState(this.stateId);
		if (result.hasErrors()) {
			this.addAllMessages(result);
		}
		this.setData(result.getData());
		return false;
	};
	oFF.InAQMgrApplyStateAction.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.modelStateApplied(extResult, data, customIdentifier);
	};
	oFF.InAQMgrSyncAction = function() {
	};
	oFF.InAQMgrSyncAction.prototype = new oFF.QOlapSyncAction();
	oFF.InAQMgrSyncAction.prototype.m_rpcFunction = null;
	oFF.InAQMgrSyncAction.prototype.releaseObject = function() {
		this.m_rpcFunction = oFF.XObjectExt.release(this.m_rpcFunction);
		oFF.QOlapSyncAction.prototype.releaseObject.call(this);
	};
	oFF.InAQMgrSyncAction.prototype.createFunction = function() {
		return this.getActionContext().createFunction();
	};
	oFF.InAQMgrSyncAction.prototype.cancelSynchronization = function() {
		oFF.QOlapSyncAction.prototype.cancelSynchronization.call(this);
		this.m_rpcFunction.cancelSynchronization();
	};
	oFF.InAQMgrSyncAction.prototype.initPlanningSupport = function(
			inaStructure, beforeVariables) {
		var provider = this.getActionContext();
		var capabilities = provider.getCapabilitiesBase();
		var isBW = capabilities.getSystemType().isTypeOf(oFF.SystemType.BW);
		var supportsDataEntryReadOnly = provider.supportsDataEntryReadOnly();
		var isDataEntryEnabled = provider.isDataEntryEnabled();
		var isDataEntryReadOnly;
		if (isBW) {
			isDataEntryEnabled = oFF.PrUtils.getBooleanProperty(inaStructure,
					"DefaultInputMode") !== null;
			if (isDataEntryEnabled) {
				if (beforeVariables) {
					isDataEntryReadOnly = !oFF.PrUtils.getBooleanValueProperty(
							inaStructure, "DefaultInputMode", false);
				} else {
					isDataEntryReadOnly = !oFF.PrUtils.getBooleanValueProperty(
							inaStructure, "InputEnabled", false);
				}
			} else {
				isDataEntryReadOnly = true;
			}
			supportsDataEntryReadOnly = isDataEntryEnabled;
		} else {
			if (!isDataEntryEnabled) {
				isDataEntryEnabled = oFF.PrUtils.getBooleanValueProperty(
						inaStructure, "InputEnabled", false);
			}
			isDataEntryReadOnly = !isDataEntryEnabled;
		}
		provider.getQueryModelBase().setSupportsDataEntryReadOnly(
				supportsDataEntryReadOnly);
		provider.setDataEntryReadOnly(isDataEntryReadOnly);
		provider.setDataEntryEnabled(isDataEntryEnabled);
		if (isBW && isDataEntryEnabled) {
			provider.initializeDataAreaState();
		}
	};
	oFF.InARsEnProvider = function() {
	};
	oFF.InARsEnProvider.prototype = new oFF.DfResultSetProvider();
	oFF.InARsEnProvider.create = function(queryProvider, initProcedure,
			initStructure, context) {
		var provider = new oFF.InARsEnProvider();
		provider.setupHanalyticsResultSetProvider(queryProvider, initProcedure,
				initStructure, context);
		return provider;
	};
	oFF.InARsEnProvider.prototype.m_columnAxisProvider = null;
	oFF.InARsEnProvider.prototype.m_dataCellProvider = null;
	oFF.InARsEnProvider.prototype.m_rowsAxisProvider = null;
	oFF.InARsEnProvider.prototype.m_initProcedure = null;
	oFF.InARsEnProvider.prototype.m_initStructure = null;
	oFF.InARsEnProvider.prototype.m_queryProvider = null;
	oFF.InARsEnProvider.prototype.m_complexUnitsSetting = null;
	oFF.InARsEnProvider.prototype.m_supportsComplexUnits = false;
	oFF.InARsEnProvider.prototype.setupHanalyticsResultSetProvider = function(
			queryProvider, initProcedure, initStructure, context) {
		var application = queryProvider.getApplication();
		var supportsSapDateFormat;
		var supportsObtainability;
		this.setupSynchronizingObject(queryProvider);
		this.m_queryProvider = queryProvider;
		this.m_initProcedure = initProcedure;
		this.m_initStructure = initStructure;
		this.m_supportsComplexUnits = queryProvider
				.supportsAnalyticCapabilityActive(oFF.InactiveCapabilities.RESULTSET_UNIT_INDEX
						.getName());
		this.m_dataCellProvider = oFF.InARsDataCellProvider.create(application,
				queryProvider);
		supportsSapDateFormat = queryProvider
				.supportsAnalyticCapabilityActive(oFF.InACapabilities.SAP_DATE);
		supportsObtainability = queryProvider
				.supportsAnalyticCapabilityActive(oFF.InACapabilities.OBTAINABILITY);
		this.m_columnAxisProvider = oFF.InARsAxisProvider.create(application,
				oFF.AxisType.COLUMNS, context, supportsSapDateFormat,
				supportsObtainability);
		this.m_rowsAxisProvider = oFF.InARsAxisProvider.create(application,
				oFF.AxisType.ROWS, context, supportsSapDateFormat,
				supportsObtainability);
	};
	oFF.InARsEnProvider.prototype.releaseObject = function() {
		this.m_columnAxisProvider = oFF.XObjectExt
				.release(this.m_columnAxisProvider);
		this.m_rowsAxisProvider = oFF.XObjectExt
				.release(this.m_rowsAxisProvider);
		this.m_dataCellProvider = oFF.XObjectExt
				.release(this.m_dataCellProvider);
		this.m_complexUnitsSetting = oFF.XObjectExt
				.release(this.m_complexUnitsSetting);
		oFF.DfResultSetProvider.prototype.releaseObject.call(this);
	};
	oFF.InARsEnProvider.prototype.getComponentName = function() {
		return "InARsEnProvider";
	};
	oFF.InARsEnProvider.prototype.getColumnAxisProvider = function() {
		return this.m_columnAxisProvider;
	};
	oFF.InARsEnProvider.prototype.getDataCellProvider = function() {
		return this.m_dataCellProvider;
	};
	oFF.InARsEnProvider.prototype.getRowsAxisProvider = function() {
		return this.m_rowsAxisProvider;
	};
	oFF.InARsEnProvider.prototype.processSynchronization = function(syncType) {
		var ocpFunction = this.m_queryProvider.createFunction();
		var requestStructure;
		var request;
		var decorator;
		this.setSyncChild(ocpFunction);
		requestStructure = null;
		if (this.m_initProcedure === oFF.ProviderInitProcedure.REQUEST_BY_MODEL) {
			requestStructure = this.m_queryProvider
					.fillDataRequestStructure(true);
		} else {
			if (this.m_initProcedure === oFF.ProviderInitProcedure.REQUEST_BY_STRUCTURE) {
				requestStructure = this.m_initStructure;
			}
		}
		request = ocpFunction.getRequest();
		decorator = oFF.RsRequestDecoratorFactory.getResultsetRequestDecorator(
				this.m_queryProvider.getApplication(), this.m_queryProvider
						.getSystemDescription(), requestStructure);
		if (oFF.isNull(decorator)) {
			request.setRequestStructure(requestStructure);
		} else {
			request.setRequestStructure(decorator.getDecoratedRequest());
		}
		ocpFunction.processFunctionExecution(syncType, this, decorator);
		return true;
	};
	oFF.InARsEnProvider.prototype.onFunctionExecuted = function(extResult,
			response, customIdentifier) {
		var responseStructure;
		var updatePlanning;
		var planningRequest;
		var planningResponse;
		var decorator;
		var ok;
		this.addAllMessages(extResult);
		if (extResult.isValid() && oFF.notNull(response)) {
			responseStructure = response.getRootElement();
			updatePlanning = true;
			planningRequest = null;
			planningResponse = null;
			if (oFF.notNull(customIdentifier)) {
				updatePlanning = false;
				decorator = customIdentifier;
				responseStructure = decorator.buildResponse(responseStructure);
				planningRequest = decorator.getPlanningRequest();
				planningResponse = decorator.getPlanningResponse();
			}
			ok = this.setResultStructure(responseStructure, updatePlanning);
			if (!ok) {
				this.addError(oFF.ErrorCodes.MODEL_INFRASTRUCTURE_TERMINATED,
						"Model infrastructure terminated");
			}
			if (oFF.notNull(planningRequest) && oFF.notNull(planningResponse)) {
				oFF.PlanningStateHandler.updateFromResponse(this
						.getApplication(), this.getSystemName(),
						planningRequest, planningResponse, this);
			}
		}
		this.trackRequestExecuted(extResult);
		this.endSync();
	};
	oFF.InARsEnProvider.prototype.trackRequestExecuted = function(result) {
		var usageTracker = oFF.UsageTrackerProvider.getUsageTracker();
		var response;
		var event;
		var request;
		var connectionInfo;
		var systemName;
		var parameters;
		var systemType;
		var errors;
		var messages;
		var message;
		if (usageTracker.isEnabled()) {
			response = result.getData();
			if (oFF.isNull(response)) {
				return;
			}
			try {
				event = new oFF.UTEvent();
				event.setFeature("InaRequest");
				event.setSession(this.getSession());
				request = response.getFunction().getRequest();
				event.setEventId(request.getRequestType().getName());
				connectionInfo = request.getConnectionInfo();
				systemName = connectionInfo.getSystemName();
				parameters = oFF.XHashMapOfStringByString.create();
				parameters.put("SystemName", systemName);
				parameters.put("SystemHost", connectionInfo.getHost());
				systemType = connectionInfo.getSystemType();
				parameters.put("SystemType", systemType.getName());
				event.setParameters(parameters);
				if (result.hasErrors()) {
					errors = oFF.XHashMapOfStringByString.create();
					messages = result.getErrors().getIterator();
					while (messages.hasNext()) {
						message = messages.next();
						errors.put(oFF.XInteger.convertToString(message
								.getCode()), message.getText());
					}
				}
				usageTracker.track(event);
			} catch (ignored) {
				return;
			}
		}
	};
	oFF.InARsEnProvider.prototype.getSystemName = function() {
		return this.m_queryProvider.getSystemName();
	};
	oFF.InARsEnProvider.prototype.setResultStructure = function(
			resultStructure, updatePlanning) {
		var resultSet;
		var application;
		var inaResultSetList;
		if (oFF.notNull(resultStructure)) {
			resultSet = this.getResultSet();
			if (oFF.isNull(resultSet)) {
				return false;
			}
			application = resultSet.getApplication();
			if (oFF.isNull(application)) {
				return false;
			}
			this.addProfileStep("setResultStructure");
			if (updatePlanning) {
				oFF.PlanningStateHandler.update(application, this
						.getSystemName(), resultStructure, this);
			}
			if (oFF.InAHelper.importMessages(resultStructure, this)) {
				resultSet.setState(oFF.ResultSetState.ERROR);
			}
			if (this.isValid()) {
				inaResultSetList = resultStructure.getListByKey("Grids");
				this.processGrids(inaResultSetList, resultSet);
			}
			this.importSerializedData(resultStructure, resultSet);
			this.endProfileStep();
		}
		return true;
	};
	oFF.InARsEnProvider.prototype.processGrids = function(inaGridsList,
			resultSet) {
		var rsStructure;
		var inaResultSetState;
		var resultSetState;
		if (!oFF.PrUtils.isListEmpty(inaGridsList)) {
			rsStructure = inaGridsList.getStructureAt(0);
			inaResultSetState = rsStructure.getIntegerByKeyExt(
					"ResultSetState", 0);
			resultSetState = oFF.QInAConverter
					.lookupResultSetState(inaResultSetState);
			resultSet.setState(resultSetState);
			if (resultSetState === oFF.ResultSetState.DATA_AVAILABLE) {
				this.processGridData(resultSet, rsStructure);
			}
		}
	};
	oFF.InARsEnProvider.prototype.processGridData = function(resultSet,
			rsStructure) {
		var queryModel = resultSet.getQueryModel();
		var dataSource;
		var dataEntryMask;
		var isInputEnabled;
		var inputReadinessStateList;
		var rows;
		var columns;
		var axes;
		var size;
		var i;
		var axis;
		var type;
		var axisType;
		var name;
		var rsQueryModelDef;
		if (oFF.notNull(queryModel)) {
			dataSource = rsStructure.getStructureByKey("DataSource");
			if (oFF.notNull(dataSource)) {
				if (queryModel.supportsDataRefreshAndDataTopicality()) {
					queryModel.setLastDataUpdate(dataSource
							.getStringByKey("DataLastRefresh"));
					queryModel.setDataRollUp(dataSource
							.getStringByKey("DataRollupMin"), dataSource
							.getStringByKey("DataRollupMax"));
				} else {
					queryModel.setLastDataUpdate(dataSource
							.getStringByKey("LastDataUpdate"));
				}
			}
			if (this.getApplication().getVersion() >= oFF.XVersion.V104_IS_USED_CONDITION) {
				this.processRsConditions(
						rsStructure.getListByKey("Conditions"), queryModel
								.getConditionManager());
			}
		}
		dataEntryMask = rsStructure.getStructureByKey("DataEntryMask");
		this.setDataEntryMask(dataEntryMask);
		isInputEnabled = rsStructure.getBooleanByKeyExt("InputEnabled", false);
		resultSet.setDataEntryEnabled(isInputEnabled);
		inputReadinessStateList = rsStructure
				.getListByKey("InputReadinessStates");
		this.setInputReadinessStates(inputReadinessStateList);
		if (this.m_supportsComplexUnits) {
			this.processComplexUnitsSetting(rsStructure.getListByKey("Units"));
		}
		this.connectDataCells(rsStructure);
		rows = null;
		columns = null;
		axes = rsStructure.getListByKey("Axes");
		size = axes.size();
		for (i = 0; i < size; i++) {
			axis = axes.getStructureAt(i);
			type = axis.getStringByKey("Type");
			if (oFF.notNull(type)) {
				axisType = oFF.QInAConverter.lookupAxisType(type);
				if (axisType === oFF.AxisType.ROWS) {
					rows = axis;
				} else {
					if (axisType === oFF.AxisType.COLUMNS) {
						columns = axis;
					} else {
						this.addWarning(oFF.ErrorCodes.ET_WRONG_TYPE,
								"Unrecognized axis type");
					}
				}
			} else {
				name = oFF.XString.toLowerCase(axis.getStringByKey("Name"));
				if (oFF.XString.isEqual("columns", name)) {
					columns = axis;
				} else {
					if (oFF.XString.isEqual("rows", name)) {
						rows = axis;
					} else {
						if (i === 0) {
							rows = axis;
						} else {
							if (i === 1) {
								columns = axis;
							} else {
								this.addWarning(oFF.ErrorCodes.ET_WRONG_TYPE,
										"Unrecognized axis index");
							}
						}
					}
				}
			}
		}
		this.importUniversalDisplayHierarchyDimensions(queryModel, rows,
				columns);
		rsQueryModelDef = this.getResultSet().getRsQueryModelDef();
		this.m_rowsAxisProvider.setOcpStructure(queryModel, rows,
				this.m_dataCellProvider.getAvailableDataCellRows(),
				rsQueryModelDef.getRowsAxisDef());
		this.m_columnAxisProvider.setOcpStructure(queryModel, columns,
				this.m_dataCellProvider.getAvailableDataCellColumns(),
				rsQueryModelDef.getColumnsAxisDef());
	};
	oFF.InARsEnProvider.prototype.processRsConditions = function(
			inaConditionsList, conditionManager) {
		var inaCondSize;
		var effectiveConds;
		var i;
		var inaConditionStructure;
		var condition;
		if (oFF.notNull(conditionManager)
				&& !oFF.PrUtils.isListEmpty(inaConditionsList)) {
			inaCondSize = inaConditionsList.size();
			effectiveConds = conditionManager.getEffectiveConditions();
			oFF.XBooleanUtils
					.checkTrue(
							inaCondSize === effectiveConds.size(),
							"Number of conditions returned in result-set is not equal to query's conditions!");
			for (i = 0; i < inaCondSize; i++) {
				inaConditionStructure = inaConditionsList.getStructureAt(i);
				condition = effectiveConds.getByKey(inaConditionStructure
						.getStringByKey("Name"));
				condition.setUsedState(inaConditionStructure
						.getStringByKey("IsUsed"));
			}
		}
	};
	oFF.InARsEnProvider.prototype.importSerializedData = function(
			resultStructure, resultSet) {
		var view;
		var cube;
		var serializedData;
		var queryManager;
		if (resultSet.getState() !== oFF.ResultSetState.EMPTY_JSON) {
			view = null;
			cube = null;
			serializedData = resultStructure
					.getStructureByKey("SerializedData");
			queryManager = resultSet.getQueryManager();
			if (this.isValid() && oFF.notNull(serializedData)) {
				view = serializedData.getStringByKey("View");
				cube = serializedData.getStringByKey("Cube");
				this.getOlapEnv().cacheRemoteBlendingData(
						queryManager.getResultSetPersistenceIdentifier(), view,
						cube);
			}
			queryManager.getActiveResultSetContainer().setSerializedData(view,
					cube);
		}
	};
	oFF.InARsEnProvider.prototype.importUniversalDisplayHierarchyDimensions = function(
			queryModel, rows, columns) {
		var udh;
		var hierarchies;
		var rsQueryModelDef;
		var hierarchy;
		var axis;
		var hierarchyName;
		if (oFF.notNull(queryModel)
				&& queryModel.supportsUniversalDisplayHierarchies()) {
			udh = queryModel.getUniversalDisplayHierarchies();
			hierarchies = udh.getHierarchies().getIterator();
			rsQueryModelDef = this.getResultSet().getRsQueryModelDef();
			while (hierarchies.hasNext()) {
				hierarchy = hierarchies.next();
				if (hierarchy.isActive()) {
					axis = hierarchy.getHierarchyDedicatedAxis();
					hierarchyName = hierarchy.getName();
					if (oFF.notNull(axis)
							&& oFF.AxisType.ROWS === axis.getType()) {
						this.importUdhDimension(rows, hierarchyName,
								queryModel, rsQueryModelDef.getRowsAxisDef());
					} else {
						if (oFF.notNull(axis)
								&& oFF.AxisType.COLUMNS === axis.getType()) {
							this.importUdhDimension(columns, hierarchyName,
									queryModel, rsQueryModelDef
											.getColumnsAxisDef());
						}
					}
				}
			}
		}
	};
	oFF.InARsEnProvider.prototype.importUdhDimension = function(inaStructure,
			udhName, queryModel, rsDefAxis) {
		var inaDimensions;
		var size;
		var i;
		var inaDimension;
		var dimensionName;
		var importer;
		var existingDim;
		var importedDim;
		if (oFF.notNull(inaStructure)) {
			inaDimensions = inaStructure.getListByKey("Dimensions");
			if (oFF.notNull(inaDimensions)) {
				size = inaDimensions.size();
				for (i = 0; i < size; i++) {
					inaDimension = inaDimensions.getStructureAt(i);
					dimensionName = inaDimension.getStringByKey("Name");
					if (oFF.XString.isEqual(dimensionName, udhName)) {
						importer = oFF.QInAImportFactory.createForMetadata(this
								.getApplication(), null);
						queryModel.stopEventing();
						existingDim = queryModel.getDimensionByName(udhName);
						importedDim = importer.importDimension(inaDimension,
								queryModel);
						existingDim.setText(importedDim.getText());
						existingDim.getFieldContainer().reinit(
								importedDim.getFieldContainer());
						existingDim.getAttributeContainer().reinit(
								importedDim.getAttributeContainer());
						this.updateDimensionDefinitions(inaDimensions,
								queryModel, rsDefAxis);
						queryModel.resumeEventing();
						return;
					}
				}
			}
		}
	};
	oFF.InARsEnProvider.prototype.updateDimensionDefinitions = function(
			inaDimensions, queryModel, rsDefAxis) {
		var size;
		var i;
		var inaDimension;
		var dimension;
		rsDefAxis.clearDimensions();
		size = inaDimensions.size();
		for (i = 0; i < size; i++) {
			inaDimension = inaDimensions.getStructureAt(i);
			dimension = queryModel.getDimensionByName(inaDimension
					.getStringByKey("Name"));
			rsDefAxis.addDimension(dimension);
		}
	};
	oFF.InARsEnProvider.prototype.connectDataCells = function(
			firstResultSetStructure) {
		var cellsSparse = firstResultSetStructure.getStructureByKey("Cells");
		var listByName;
		var size;
		var dataCountRows;
		var dataCountColumns;
		var exceptionSettings;
		if (oFF.notNull(cellsSparse)) {
			listByName = firstResultSetStructure.getListByKey("CellArraySizes");
			size = oFF.PrUtils.getListSize(listByName, 0);
			dataCountRows = 0;
			dataCountColumns = 0;
			if (size > 0) {
				dataCountRows = listByName.getIntegerAt(0);
			}
			if (size > 1) {
				dataCountColumns = listByName.getIntegerAt(1);
			}
			exceptionSettings = firstResultSetStructure
					.getListByKey(oFF.InACapabilities.EXCEPTION_SETTINGS);
			this.m_dataCellProvider.setOcpStructure(cellsSparse,
					dataCountColumns, dataCountRows, exceptionSettings);
		}
	};
	oFF.InARsEnProvider.prototype.setDataEntryMask = function(dataEntryMask) {
		var inaCellNames;
		var cellNames;
		var size;
		var k;
		if (oFF.isNull(dataEntryMask)) {
			return;
		}
		inaCellNames = dataEntryMask.getListByKey("QueryCellNames");
		if (oFF.isNull(inaCellNames)) {
			return;
		}
		cellNames = oFF.XListOfString.create();
		size = inaCellNames.size();
		for (k = 0; k < size; k++) {
			cellNames.add(inaCellNames.getStringAt(k));
		}
		this.getResultSet().setDataEntryMask(cellNames);
	};
	oFF.InARsEnProvider.prototype.setInputReadinessStates = function(
			stateListStructure) {
		var states;
		var i;
		if (oFF.isNull(stateListStructure)) {
			return;
		}
		states = oFF.XList.create();
		for (i = 0; i < stateListStructure.size(); i++) {
			states.add(oFF.RsInputReadinessState.create(i, stateListStructure
					.getListAt(i)));
		}
		if (states.isEmpty()) {
			return;
		}
		this.getResultSet().setInputReadinessStates(states);
	};
	oFF.InARsEnProvider.prototype.processComplexUnitsSetting = function(
			unitsSetting) {
		var unitsSettingSize;
		var i;
		var unit;
		if (oFF.notNull(unitsSetting)) {
			unitsSettingSize = unitsSetting.size();
			if (oFF.isNull(this.m_complexUnitsSetting)) {
				this.m_complexUnitsSetting = oFF.XList.create();
			}
			for (i = 0; i < unitsSettingSize; i++) {
				unit = unitsSetting.getStructureAt(i);
				if (oFF.notNull(unit)) {
					this.m_complexUnitsSetting.add(this.buildComplexUnit(unit
							.getListByKey("Type"), unit.getListByKey("Value"),
							unit.getListByKey("Description"), unit
									.getListByKey("Exp")));
				}
			}
		}
	};
	oFF.InARsEnProvider.prototype.buildComplexUnit = function(typesList,
			valuesList, descriptionsList, exponentList) {
		var types;
		var values;
		var descriptions;
		var exponents;
		var size;
		var j;
		if (oFF.PrUtils.isListEmpty(typesList)
				|| oFF.PrUtils.isListEmpty(valuesList)
				|| oFF.PrUtils.isListEmpty(descriptionsList)
				|| oFF.PrUtils.isListEmpty(exponentList)) {
			throw oFF.XException
					.createIllegalArgumentException("Invalid component of Complex Unit");
		}
		types = oFF.XListOfString.create();
		values = oFF.XListOfString.create();
		descriptions = oFF.XListOfString.create();
		exponents = oFF.XList.create();
		size = valuesList.size();
		for (j = 0; j < size; j++) {
			types.add(typesList.getStringAt(j));
			values.add(valuesList.getStringAt(j));
			descriptions.add(descriptionsList.getStringAt(j));
			exponents.add(oFF.XIntegerValue
					.create(exponentList.getIntegerAt(j)));
		}
		return oFF.RsComplexUnit.create(types, values, descriptions, exponents);
	};
	oFF.InARsEnProvider.prototype.getComplexUnitsSetting = function() {
		return this.m_complexUnitsSetting;
	};
	oFF.InAQMgrCancelThreadsAction = function() {
	};
	oFF.InAQMgrCancelThreadsAction.prototype = new oFF.InAQMgrSyncAction();
	oFF.InAQMgrCancelThreadsAction.createAndRun = function(syncType, listener,
			customIdentifier, parent) {
		var newObject = new oFF.InAQMgrCancelThreadsAction();
		newObject.setupActionAndRun(syncType, parent, listener,
				customIdentifier);
		return newObject;
	};
	oFF.InAQMgrCancelThreadsAction.prototype.getComponentName = function() {
		return "InAQMgrCancelThreadsAction";
	};
	oFF.InAQMgrCancelThreadsAction.prototype.processSynchronization = function(
			syncType) {
		var request;
		var requestStructure;
		this.m_rpcFunction = this.getActionContext().createFunction();
		request = this.m_rpcFunction.getRequest();
		requestStructure = this.fillRequestStructure();
		if (oFF.isNull(requestStructure)) {
			return false;
		}
		request.setRequestStructure(requestStructure);
		this.m_rpcFunction.processFunctionExecution(syncType, this, null);
		return true;
	};
	oFF.InAQMgrCancelThreadsAction.prototype.fillRequestStructure = function() {
		var parent = this.getActionContext();
		var instanceId = parent.getInstanceId();
		var requestStructure;
		var inaAnalytics;
		var inaActions;
		var inaCloseAction;
		var inaDataSources;
		if (oFF.isNull(instanceId)) {
			return null;
		}
		requestStructure = oFF.PrFactory.createStructure();
		inaAnalytics = requestStructure.putNewStructure("Analytics");
		inaActions = inaAnalytics.putNewList("Actions");
		inaCloseAction = inaActions.addNewStructure();
		inaCloseAction.putString("Type", "Close");
		inaDataSources = inaCloseAction.putNewList("DataSources");
		inaDataSources.addString(instanceId);
		return requestStructure;
	};
	oFF.InAQMgrCancelThreadsAction.prototype.onFunctionExecuted = function(
			extResult, response, customIdentifier) {
		this.addAllMessages(extResult);
		this.setData(this.getActionContext());
		this.endSync();
	};
	oFF.InAQMgrCancelThreadsAction.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onProviderCancelThreads(extResult, data, customIdentifier);
	};
	oFF.InAQMgrClearCacheAction = function() {
	};
	oFF.InAQMgrClearCacheAction.prototype = new oFF.InAQMgrSyncAction();
	oFF.InAQMgrClearCacheAction.createAndRun = function(syncType, listener,
			customIdentifier, parent, timestamp) {
		var newObject = new oFF.InAQMgrClearCacheAction();
		newObject.m_timestamp = timestamp;
		newObject.setupActionAndRun(syncType, parent, listener,
				customIdentifier);
		return newObject;
	};
	oFF.InAQMgrClearCacheAction.prototype.m_timestamp = null;
	oFF.InAQMgrClearCacheAction.prototype.getComponentName = function() {
		return "InAQMgrClearCacheAction";
	};
	oFF.InAQMgrClearCacheAction.prototype.processSynchronization = function(
			syncType) {
		var request;
		var requestStructure;
		this.m_rpcFunction = this.getActionContext().createFunction();
		request = this.m_rpcFunction.getRequest();
		requestStructure = this.fillRequestStructure();
		if (oFF.notNull(requestStructure)) {
			request.setRequestStructure(requestStructure);
			this.m_rpcFunction.processFunctionExecution(syncType, this, null);
			return true;
		}
		return false;
	};
	oFF.InAQMgrClearCacheAction.prototype.fillRequestStructure = function() {
		var parent = this.getActionContext();
		var instanceId = parent.getInstanceId();
		var requestStructure;
		var inaAnalytics;
		var inaActions;
		var inaClearCacheAction;
		var inaDataSources;
		var instance;
		var currentDateTimeAtLocalTimezone;
		var millisecondsForDateTime;
		if (oFF.isNull(instanceId)) {
			return null;
		}
		requestStructure = oFF.PrFactory.createStructure();
		inaAnalytics = requestStructure.putNewStructure("Analytics");
		inaActions = inaAnalytics.putNewList("Actions");
		inaClearCacheAction = inaActions.addNewStructure();
		inaClearCacheAction.putString("Type", "ClearCache");
		inaDataSources = inaClearCacheAction.putNewList("DataSources");
		inaDataSources.addString(instanceId);
		if (oFF.isNull(this.m_timestamp)) {
			instance = oFF.XDateTimeProvider.getInstance();
			currentDateTimeAtLocalTimezone = instance
					.getCurrentDateTimeAtLocalTimezone();
			millisecondsForDateTime = instance
					.getMillisecondsForDateTime(currentDateTimeAtLocalTimezone);
			this.m_timestamp = oFF.XLong
					.convertToString(millisecondsForDateTime);
		}
		inaClearCacheAction.putString("Id", this.m_timestamp);
		return requestStructure;
	};
	oFF.InAQMgrClearCacheAction.prototype.onFunctionExecuted = function(
			extResult, response, customIdentifier) {
		this.addAllMessages(extResult);
		this.setData(this.getActionContext());
		this.endSync();
	};
	oFF.InAQMgrClearCacheAction.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onProviderClearCache(extResult, data, customIdentifier);
	};
	oFF.InAQMgrShutdownAction = function() {
	};
	oFF.InAQMgrShutdownAction.prototype = new oFF.InAQMgrSyncAction();
	oFF.InAQMgrShutdownAction.createAndRun = function(syncType, listener,
			customIdentifier, parent) {
		var newObject = new oFF.InAQMgrShutdownAction();
		newObject.setupActionAndRun(syncType, parent, listener,
				customIdentifier);
		return newObject;
	};
	oFF.InAQMgrShutdownAction.prototype.getComponentName = function() {
		return "InAQMgrShutdownAction";
	};
	oFF.InAQMgrShutdownAction.prototype.processSynchronization = function(
			syncType) {
		var provider = this.getActionContext();
		var request;
		var requestStructure;
		if (provider.supportsShutdown()) {
			this.m_rpcFunction = this.getActionContext().createFunction();
			request = this.m_rpcFunction.getRequest();
			requestStructure = this.fillRequestStructure();
			if (oFF.notNull(requestStructure)) {
				request.setRequestStructure(requestStructure);
				this.m_rpcFunction.processFunctionExecution(syncType, this,
						null);
				return true;
			}
		}
		return false;
	};
	oFF.InAQMgrShutdownAction.prototype.fillRequestStructure = function() {
		var parent = this.getActionContext();
		var instanceId = parent.getInstanceId();
		var requestStructure;
		var inaAnalytics;
		var inaActions;
		var inaCloseAction;
		var inaDataSources;
		if (oFF.isNull(instanceId)) {
			return null;
		}
		requestStructure = oFF.PrFactory.createStructure();
		inaAnalytics = requestStructure.putNewStructure("Analytics");
		inaActions = inaAnalytics.putNewList("Actions");
		inaCloseAction = inaActions.addNewStructure();
		inaCloseAction.putString("Type", "Close");
		inaDataSources = inaCloseAction.putNewList("DataSources");
		inaDataSources.addString(instanceId);
		return requestStructure;
	};
	oFF.InAQMgrShutdownAction.prototype.onFunctionExecuted = function(
			extResult, response, customIdentifier) {
		this.addAllMessages(extResult);
		this.setData(this.getActionContext());
		this.endSync();
	};
	oFF.InAQMgrShutdownAction.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onProviderShutdown(extResult, data, customIdentifier);
	};
	oFF.InAQMgrStartupAction = function() {
	};
	oFF.InAQMgrStartupAction.prototype = new oFF.InAQMgrSyncAction();
	oFF.InAQMgrStartupAction.createServiceInitAndRun = function(syncType,
			listener, customIdentifier, parent, genericData) {
		var newObject = new oFF.InAQMgrStartupAction();
		newObject.m_isServiceInit = true;
		newObject.setData(genericData);
		newObject.setupActionAndRun(syncType, parent, listener,
				customIdentifier);
		return newObject;
	};
	oFF.InAQMgrStartupAction.createMetadataInitAndRun = function(syncType,
			listener, customIdentifier, parent, genericData) {
		var newObject = new oFF.InAQMgrStartupAction();
		newObject.m_isServiceInit = false;
		newObject.setData(genericData);
		newObject.setupActionAndRun(syncType, parent, listener,
				customIdentifier);
		return newObject;
	};
	oFF.InAQMgrStartupAction.prototype.m_isServiceInit = false;
	oFF.InAQMgrStartupAction.prototype.m_isQueryModelVersionValid = false;
	oFF.InAQMgrStartupAction.prototype.getComponentName = function() {
		return "QmStartupAction";
	};
	oFF.InAQMgrStartupAction.prototype.processSynchronization = function(
			syncType) {
		var provider = this.getActionContext();
		var mode;
		var queryModel;
		var dataSource;
		var protocolCapabilities;
		var inaCapabilities;
		var instanceId;
		var dataSourceBase;
		var definitionAsStructure;
		var definitionType;
		var storedMetadata;
		var extendedDimensions;
		var key;
		var serviceConfig;
		var olapEnv;
		var targetQMAndListener;
		var existingListeners;
		var newListeners;
		var blendingMgr;
		var extResult;
		if (this.m_isServiceInit) {
			if (provider.getLifeCycleState() !== oFF.LifeCycleState.INITIAL) {
				this.addError(oFF.ErrorCodes.INVALID_STATE,
						"Query Manager is not initial");
				return false;
			}
			provider.setLifeCycleState(oFF.LifeCycleState.STARTING_UP);
		}
		mode = provider.getMode();
		queryModel = this.getQueryModelBase();
		if (oFF.isNull(queryModel)) {
			if (mode === oFF.QueryManagerMode.RAW_QUERY) {
				provider.setLifeCycleState(oFF.LifeCycleState.ACTIVE);
				this.endSync();
				return true;
			}
			provider.setupDesignTimeMode();
			queryModel = this.getQueryModelBase();
		}
		dataSource = provider.getDataSource();
		if (mode === oFF.QueryManagerMode.DEFAULT && oFF.isNull(dataSource)) {
			this.addError(oFF.ErrorCodes.INVALID_STATE, "No datasource given");
			return false;
		}
		protocolCapabilities = queryModel.getProtocolCapabilities();
		inaCapabilities = provider.getInaCapabilities();
		protocolCapabilities.setClientCapabilities(inaCapabilities
				.getClientMainCapabilities());
		protocolCapabilities.setServerCapabilities(inaCapabilities
				.getServerMainCapabilities());
		protocolCapabilities.setIntersectCapabilities(inaCapabilities
				.getActiveMainCapabilities());
		queryModel.setDataSource(dataSource);
		instanceId = queryModel.getDataSource().getInstanceId();
		if (oFF.isNull(instanceId)) {
			instanceId = provider.getInstanceId();
			if (oFF.isNull(instanceId)) {
				instanceId = provider.getApplication().createNextInstanceId();
			}
			dataSourceBase = queryModel.getDataSourceBase();
			dataSourceBase.setInstanceId(instanceId);
			dataSourceBase.setSystemName(provider.getSystemName());
		}
		if (mode === oFF.QueryManagerMode.RAW_QUERY && this.m_isServiceInit) {
			return false;
		}
		definitionAsStructure = provider.getDefinitionAsStructure();
		definitionType = provider.getDefinitionType();
		storedMetadata = null;
		if (oFF.notNull(definitionAsStructure) && oFF.notNull(definitionType)
				&& definitionType.containsMetadata()) {
			storedMetadata = definitionAsStructure;
		} else {
			if (oFF.notNull(dataSource)) {
				extendedDimensions = dataSource.getExtendedDimensions();
				key = oFF.XStringBuffer.create();
				key.append(dataSource.getFullQualifiedName());
				if (oFF.isNull(extendedDimensions)) {
					key.append("[]");
				} else {
					if (dataSource.getExtendedDimensions().hasElements()
							&& mode === oFF.QueryManagerMode.BLENDING) {
						this
								.addWarningExt(
										oFF.OriginLayer.SERVER,
										oFF.ErrorCodes.INVALID_DIMENSION,
										"Joining ExtendedDimensions on a BlendingQuery is not supported by the backend!");
					}
					key.append(extendedDimensions.toString());
				}
				key.append(":").append(provider.getProviderType().getName());
				serviceConfig = provider.getServiceConfig();
				if (serviceConfig.getDefinitionAsJson() !== null) {
					storedMetadata = this.getApplication().getOlapEnvironment()
							.getQueryMetadata(key.toString());
					definitionType = oFF.QModelFormat.INA_METADATA;
				} else {
					if (serviceConfig.canUseCache()) {
						olapEnv = this.getApplication().getOlapEnvironment();
						if (olapEnv.getQueryMetadata(key.toString()) === null) {
							targetQMAndListener = oFF.XSimpleMap.create();
							targetQMAndListener.put(this, provider);
							if (olapEnv.getdatasourceKeysToListeners()
									.getByKey(key.toString()) !== null) {
								existingListeners = olapEnv
										.getdatasourceKeysToListeners()
										.getByKey(key.toString());
								existingListeners.add(targetQMAndListener);
								return true;
							}
							newListeners = oFF.XList.create();
							newListeners.add(targetQMAndListener);
							olapEnv.getdatasourceKeysToListeners().put(
									key.toString(), newListeners);
						} else {
							storedMetadata = olapEnv.getQueryMetadata(key
									.toString());
							definitionType = oFF.QModelFormat.INA_METADATA;
						}
					}
				}
			}
		}
		if (oFF.notNull(storedMetadata)) {
			this.applyMetadataStructure(queryModel, storedMetadata,
					definitionType, mode, true);
			return true;
		} else {
			if (mode === oFF.QueryManagerMode.BLENDING) {
				this.addProfileStep("Prepare Metadata Request");
				blendingMgr = oFF.InAQMgrStartupBlending.create(this);
				blendingMgr.prepare(syncType);
				this.endProfileStep();
				blendingMgr.process(this, syncType);
				return this.isValid();
			} else {
				if (provider.supportsAndAllowsEmptyExtendedVarDefinition()) {
					extResult = provider.emptyVariableDefinition(syncType,
							null, null);
					this.addAllMessages(extResult);
				} else {
					this.addProfileStep("Prepare Metadata Request");
					this.createRpcFunction(provider, mode);
					this.endProfileStep();
					this.m_rpcFunction.processFunctionExecution(syncType, this,
							mode);
					return true;
				}
			}
		}
		return false;
	};
	oFF.InAQMgrStartupAction.prototype.createBlendingFunction = function() {
		this.createRpcFunction(this.getActionContext(),
				oFF.QueryManagerMode.BLENDING);
		return this.m_rpcFunction;
	};
	oFF.InAQMgrStartupAction.prototype.createRpcFunction = function(provider,
			mode) {
		var request;
		var requestStructure;
		this.m_rpcFunction = provider.createFunction();
		request = this.m_rpcFunction.getRequest();
		requestStructure = oFF.PrStructure.create();
		this.fillMetadataRequestStructure(requestStructure, mode);
		request.setRequestStructure(requestStructure);
	};
	oFF.InAQMgrStartupAction.prototype.fillMetadataRequestStructure = function(
			requestStructure, mode) {
		var provider = this.getActionContext();
		var innerRequestStructure = provider.setInnerStructure(
				requestStructure, "Metadata", null);
		var providerType = provider.getProviderTypeProx();
		var serviceConfig;
		var blendingDefinition;
		var metadataRequest;
		if (providerType === oFF.ProviderType.ANALYTICS
				|| providerType === oFF.ProviderType.CATALOG) {
			innerRequestStructure.putString("Context", "Analytics");
		} else {
			if (providerType === oFF.ProviderType.PLANNING) {
				innerRequestStructure.putString("Context", "Planning");
			} else {
				if (providerType === oFF.ProviderType.LIST_REPORTING) {
					innerRequestStructure.putString("Context", "ListReporting");
				}
			}
		}
		if (mode === oFF.QueryManagerMode.BLENDING) {
			serviceConfig = this.getServiceConfig();
			blendingDefinition = serviceConfig.getBlendingDefinition();
			metadataRequest = oFF.QInADataSourceBlending
					.exportDataSourceBlending(oFF.QModelFormat.INA_DATA,
							blendingDefinition, false);
			oFF.QInAExportUtil.setNonEmptyString(metadataRequest, "InstanceId",
					serviceConfig.getInstanceId());
			innerRequestStructure.put("DataSource", metadataRequest);
		}
		if (this.getApplication().getVersion() >= oFF.XVersion.V112_CLIENT_INFO_METADATA) {
			oFF.QInAClientInfo
					.exportClientInfo(
							requestStructure,
							provider.getApplication(),
							provider
									.supportsAnalyticCapabilityActive(oFF.InAConstantsBios.QY_CLIENT_INFO));
		}
	};
	oFF.InAQMgrStartupAction.prototype.onFunctionExecuted = function(extResult,
			response, customIdentifier) {
		var mode;
		var provider;
		var queryModelBase;
		var isInitWithStructure;
		var rootElement;
		var dataRequest;
		this.addAllMessages(extResult);
		this.addProfileStep("Process metadata");
		mode = customIdentifier;
		provider = this.getActionContext();
		queryModelBase = this.getQueryModelBase();
		isInitWithStructure = false;
		if (oFF.isNull(mode)) {
			isInitWithStructure = true;
		}
		if (this.isValidResponse(extResult, response)) {
			queryModelBase.stopEventing();
			rootElement = response.getRootElement();
			this.applyMetadataStructure(queryModelBase, rootElement,
					oFF.QModelFormat.INA_METADATA, mode, isInitWithStructure);
			dataRequest = provider.getQueryServiceConfig().getDataRequest();
			if (oFF.notNull(dataRequest)) {
				queryModelBase.stopEventing();
				queryModelBase.deserializeFromElementExt(
						oFF.QModelFormat.INA_DATA, dataRequest);
				queryModelBase.resumeEventing();
			}
		} else {
			provider.setLifeCycleState(oFF.LifeCycleState.TERMINATED);
			this.endProfileStep();
			this.endSync();
		}
	};
	oFF.InAQMgrStartupAction.prototype.isValidResponse = function(extResult,
			response) {
		if (!extResult.isValid()) {
			return false;
		}
		if (oFF.isNull(response)) {
			return false;
		}
		if (response.getRootElement() === null) {
			this.addError(oFF.ErrorCodes.PARSER_ERROR, "No json inside");
			return false;
		}
		return true;
	};
	oFF.InAQMgrStartupAction.prototype.applyMetadataStructure = function(
			queryModel, rootElement, modelFormat, mode, isInitWithStructure) {
		var provider;
		var application;
		var cubeStructure;
		var dataSourceValidation;
		var activeMainCapabilities;
		var importInAMetadata;
		var queryConfig;
		var removed;
		var metaDataImporter;
		var varQueryModel;
		var dimensions;
		var dimensionIndex;
		var dimension;
		var originalDimension;
		this.addProfileStep("applyDataModelStructure");
		if (oFF.notNull(rootElement)) {
			provider = this.getActionContext();
			application = this.getApplication();
			oFF.PlanningStateHandler.update(application, provider
					.getSystemName(), rootElement, this);
			if (!oFF.InAHelper.importMessages(rootElement, this)) {
				cubeStructure = rootElement;
				if (modelFormat !== oFF.QModelFormat.INA_CLONE) {
					cubeStructure = rootElement.getStructureByKey("Cube");
					if (oFF.isNull(cubeStructure)) {
						dataSourceValidation = rootElement
								.getStructureByKey("DataSourceValidation");
						if (isInitWithStructure) {
							cubeStructure = rootElement;
						} else {
							if (oFF.notNull(dataSourceValidation)
									&& dataSourceValidation
											.getBooleanByKey("Valid")) {
								this.endProfileStep();
								this.endSync();
								this.m_isQueryModelVersionValid = true;
								return;
							} else {
								if (oFF.notNull(dataSourceValidation)) {
									this
											.addErrorExt(
													oFF.OriginLayer.DRIVER,
													oFF.ErrorCodes.SERVER_METADATA_NOT_FOUND,
													"Server metadata not available",
													null);
									this.endProfileStep();
									this.endSync();
									return;
								}
							}
						}
					}
				}
				if (oFF.isNull(cubeStructure)) {
					this.addErrorExt(oFF.OriginLayer.DRIVER,
							oFF.ErrorCodes.QM_CUBE_ENTRY_NOT_FOUND,
							"Cube tag in structure not found", null);
				} else {
					queryModel.stopEventing();
					activeMainCapabilities = provider.getInaCapabilities()
							.getActiveMainCapabilities();
					if (mode === oFF.QueryManagerMode.BLENDING) {
						importInAMetadata = oFF.QInAImportFactory
								.createForMetadata(application,
										activeMainCapabilities);
					} else {
						queryConfig = this.getServiceConfig();
						if (modelFormat === oFF.QModelFormat.INA_CLONE) {
							importInAMetadata = oFF.QInAImportFactory
									.createForCloning(application,
											activeMainCapabilities);
						} else {
							if (queryConfig.isLoadingDefaultQuery()) {
								importInAMetadata = oFF.QInAImportFactory
										.createForMetadata(application,
												activeMainCapabilities);
							} else {
								importInAMetadata = oFF.QInAImportFactory
										.createForMetadataCore(application,
												activeMainCapabilities);
							}
						}
					}
					if (oFF.notNull(mode)) {
						removed = this
								.removeAlreadyLoadedDimensions(queryModel);
						if (removed) {
							importInAMetadata.importQueryModel(cubeStructure,
									queryModel);
						} else {
							metaDataImporter = oFF.QInAImportFactory
									.createForMetadata(application, provider
											.getInaCapabilities()
											.getActiveMainCapabilities());
							varQueryModel = oFF.QueryModel.create(this
									.getOlapEnv(), provider, queryModel
									.getModelCapabilitiesBase());
							varQueryModel.setDataSource(queryModel
									.getDataSource());
							metaDataImporter.importQueryModel(cubeStructure,
									varQueryModel);
							dimensions = varQueryModel
									.getDimensionManagerBase().getDimensions();
							for (dimensionIndex = 0; dimensionIndex < dimensions
									.size(); dimensionIndex++) {
								dimension = dimensions.get(dimensionIndex);
								originalDimension = queryModel
										.getDimensionByNameFromExistingMetadata(dimension
												.getName());
								if (oFF.notNull(originalDimension)
										&& originalDimension.getDimensionType() === oFF.DimensionType.DIMENSION_INCOMPLETE) {
									originalDimension.copyDimension(dimension);
								}
							}
							queryModel
									.setServerBaseSerialization(oFF.PrStructure
											.createDeepCopy(cubeStructure));
							cubeStructure = queryModel
									.getServerBaseSerialization();
							oFF.XObjectExt.release(varQueryModel);
						}
					}
					if (mode !== oFF.QueryManagerMode.BLENDING) {
						this.initPlanningSupport(cubeStructure, true);
					}
					queryModel.resumeEventing();
					this.addAllMessages(importInAMetadata);
					oFF.InAQMgrUtils.applyResultSetFeatureCapabilities(
							provider, cubeStructure);
					if (provider.getDataSource() !== null) {
						provider.getDataSource().setValidationHash(
								queryModel.getDataSource().getValidationHash());
					}
				}
			}
		}
		this.endProfileStep();
		this.step2(mode, isInitWithStructure);
	};
	oFF.InAQMgrStartupAction.prototype.removeAlreadyLoadedDimensions = function(
			queryModel) {
		var i;
		if (queryModel.isPartialResponse(queryModel.getQueryManagerBase())) {
			return false;
		}
		for (i = 0; i < queryModel.getLoadedDimensions().size();) {
			queryModel.removeDimension(queryModel.getLoadedDimensions().get(i));
		}
		return true;
	};
	oFF.InAQMgrStartupAction.prototype.step2 = function(mode,
			isInitWithStructure) {
		var provider = this.getActionContext();
		var queryModelBase;
		var deserializationStructure;
		var importer;
		var serviceConfig;
		var blendingDefinition;
		var dataSourceBase;
		var exportBlendingMappings;
		var sources;
		provider.setLifeCycleState(oFF.LifeCycleState.ACTIVE);
		if (!isInitWithStructure) {
			queryModelBase = this.getQueryModelBase();
			deserializationStructure = provider.getDeserializationStructure();
			importer = provider.getDeserializationImporter();
			if (oFF.notNull(deserializationStructure) && oFF.notNull(importer)) {
				importer.importQueryModel(deserializationStructure,
						queryModelBase);
			}
			if (mode === oFF.QueryManagerMode.BLENDING) {
				serviceConfig = this.getServiceConfig();
				blendingDefinition = serviceConfig.getBlendingDefinition();
				if (oFF.notNull(blendingDefinition)) {
					queryModelBase.setBlendingDefinition(blendingDefinition);
					dataSourceBase = queryModelBase.getDataSourceBase();
					exportBlendingMappings = oFF.QInADataSourceBlending
							.exportBlendingMappings(blendingDefinition
									.getMappings());
					dataSourceBase.setMappings(exportBlendingMappings);
					sources = blendingDefinition.getSources();
					dataSourceBase.setBlendingSources(sources);
				}
			}
			queryModelBase.resumeEventing();
			if (!provider.isDirectVariableTransferEnabled()) {
				provider
						.setVariableProcessorState(oFF.VariableProcessorState.CHANGEABLE_STARTUP);
			}
			provider.prepareAfterVariables();
			this.endProfileStep();
		}
		this.endSync();
	};
	oFF.InAQMgrStartupAction.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		var serviceListener;
		var modelInitListener;
		if (this.m_isServiceInit) {
			serviceListener = listener;
			serviceListener.onServiceInitialized(extResult, data,
					customIdentifier);
		} else {
			modelInitListener = listener;
			modelInitListener.onQueryModelInitialized(extResult, data,
					customIdentifier);
		}
	};
	oFF.InAQMgrStartupAction.prototype.getServiceConfig = function() {
		return this.getQueryManager().getServiceConfig();
	};
	oFF.InAQMgrStartupAction.prototype.isQueryModelVersionValid = function() {
		return this.m_isQueryModelVersionValid;
	};
	oFF.InAQMgrVarAction = function() {
	};
	oFF.InAQMgrVarAction.prototype = new oFF.InAQMgrSyncAction();
	oFF.InAQMgrVarAction.createAndRunDefinition = function(parent, syncType,
			listener, customIdentifier) {
		var state;
		var parentState = parent.getVariableProcessorState();
		var newObject;
		if (parentState === oFF.VariableProcessorState.PROCESSING_EMPTY_VARIABLE_DEFINITION) {
			state = oFF.VariableProcessorState.PROCESSING_EMPTY_VARIABLE_DEFINITION;
		} else {
			state = oFF.VariableProcessorState.PROCESSING_DEFINITION;
		}
		newObject = new oFF.InAQMgrVarAction();
		newObject
				.setupVarActionAndRun(syncType, parent, listener,
						customIdentifier, state, "VariableDefinition", true,
						true, true);
		return newObject;
	};
	oFF.InAQMgrVarAction.createAndRunSubmit = function(parent, syncType,
			listener, customIdentifier) {
		var state;
		var newObject;
		if (parent.getVariableProcessorState() === oFF.VariableProcessorState.CHANGEABLE_REINIT) {
			state = oFF.VariableProcessorState.PROCESSING_SUBMIT_AFTER_REINIT;
		} else {
			state = oFF.VariableProcessorState.PROCESSING_SUBMIT;
		}
		newObject = new oFF.InAQMgrVarAction();
		newObject.setupVarActionAndRun(syncType, parent, listener,
				customIdentifier, state, "VariableSubmit", true, true, parent
						.isVariableSubmitNeeded());
		return newObject;
	};
	oFF.InAQMgrVarAction.createAndRunCancel = function(parent, syncType,
			listener, customIdentifier) {
		var newObject = new oFF.InAQMgrVarAction();
		newObject.setupVarActionAndRun(syncType, parent, listener,
				customIdentifier, oFF.VariableProcessorState.PROCESSING_CANCEL,
				"VariableCancel", false, false, !parent.isSubmitted());
		return newObject;
	};
	oFF.InAQMgrVarAction.createAndRunCheck = function(parent, syncType,
			listener, customIdentifier) {
		var newObject = new oFF.InAQMgrVarAction();
		newObject.setupVarActionAndRun(syncType, parent, listener,
				customIdentifier, oFF.VariableProcessorState.PROCESSING_CHECK,
				null, false, false, true);
		return newObject;
	};
	oFF.InAQMgrVarAction.createAndRunGetRuntimeInfo = function(parent,
			syncType, listener, customIdentifier) {
		var newObject = new oFF.InAQMgrVarAction();
		newObject.setupVarActionAndRun(syncType, parent, listener,
				customIdentifier,
				oFF.VariableProcessorState.PROCESSING_DEFINITION,
				"VariableDefinition", true, false, true);
		return newObject;
	};
	oFF.InAQMgrVarAction.createAndRunReInitAfterSubmit = function(parent,
			syncType, listener, customIdentifier) {
		var newObject = new oFF.InAQMgrVarAction();
		newObject.setupVarActionAndRun(syncType, parent, listener,
				customIdentifier, oFF.VariableProcessorState.PROCESSING_REINIT,
				"VariableDefinition", true, false, parent.isSubmitted());
		return newObject;
	};
	oFF.InAQMgrVarAction.createAndRunSetGetValues = function(parent, syncType,
			listener, customIdentifier) {
		var newObject = new oFF.InAQMgrVarAction();
		newObject.setupVarActionAndRun(syncType, parent, listener,
				customIdentifier,
				oFF.VariableProcessorState.PROCESSING_UPDATE_VALUES,
				"VariableDefinition", true, false, true);
		return newObject;
	};
	oFF.InAQMgrVarAction.createAndRunEmptyVariableDefinition = function(parent,
			syncType, listener, customIdentifier) {
		var newObject = new oFF.InAQMgrVarAction();
		newObject
				.setupVarActionAndRun(
						syncType,
						parent,
						listener,
						customIdentifier,
						oFF.VariableProcessorState.PROCESSING_EMPTY_VARIABLE_DEFINITION,
						"VariableDefinition", true, false, true);
		return newObject;
	};
	oFF.InAQMgrVarAction.prototype.m_applyVariableStates = false;
	oFF.InAQMgrVarAction.prototype.m_applyVariableAndModelStates = false;
	oFF.InAQMgrVarAction.prototype.m_processingStep = null;
	oFF.InAQMgrVarAction.prototype.m_state = null;
	oFF.InAQMgrVarAction.prototype.m_needsProcessing = false;
	oFF.InAQMgrVarAction.prototype.m_isProcessingEmptyDef = false;
	oFF.InAQMgrVarAction.prototype.setupVarActionAndRun = function(syncType,
			context, listener, customIdentifier, state, processingStep,
			applyVarStates, applyVarAndModelStates, needsProcessing) {
		var queryModel;
		this.m_applyVariableStates = applyVarStates;
		this.m_applyVariableAndModelStates = applyVarAndModelStates;
		this.m_processingStep = processingStep;
		this.m_state = state;
		this.m_needsProcessing = needsProcessing;
		if (this.m_state === oFF.VariableProcessorState.PROCESSING_REINIT) {
			queryModel = context.getQueryModel();
			context.setStateBeforeVarScreen(queryModel.serializeToElement(
					oFF.QModelFormat.INA_REPOSITORY, null));
			context.setMetadataStateBeforeVarScreen(queryModel
					.serializeToElement(oFF.QModelFormat.INA_METADATA, null));
		} else {
			if (this.m_state === oFF.VariableProcessorState.PROCESSING_EMPTY_VARIABLE_DEFINITION) {
				this.m_isProcessingEmptyDef = true;
			}
		}
		oFF.InAQMgrSyncAction.prototype.setupActionAndRun.call(this, syncType,
				context, listener, customIdentifier);
	};
	oFF.InAQMgrVarAction.prototype.releaseObject = function() {
		this.m_rpcFunction = null;
		this.m_processingStep = null;
		this.m_state = null;
		oFF.InAQMgrSyncAction.prototype.releaseObject.call(this);
	};
	oFF.InAQMgrVarAction.prototype.getComponentName = function() {
		return "InAQMgrVarAction";
	};
	oFF.InAQMgrVarAction.prototype.processSynchronization = function(syncType) {
		var requestStructure;
		var withVariables;
		var actionContext;
		this.setData(this);
		if (this.m_needsProcessing) {
			this.m_rpcFunction = this.createFunction();
			requestStructure = oFF.PrStructure.create();
			withVariables = this.m_state !== oFF.VariableProcessorState.PROCESSING_REINIT;
			actionContext = this.getActionContext();
			actionContext.fillAnalyticRequestStructure(requestStructure,
					"Analytics", withVariables, this.m_processingStep);
			actionContext.setVariableProcessorState(this.m_state);
			this.m_rpcFunction.getRequest().setRequestStructure(
					requestStructure);
			this.m_rpcFunction.processFunctionExecution(syncType, this, null);
			return true;
		}
		return false;
	};
	oFF.InAQMgrVarAction.prototype.onFunctionExecuted = function(extResult,
			response, customIdentifier) {
		var context;
		var queryModel;
		var application;
		var rootElement;
		var inaQueryModel;
		var nextState;
		this.addProfileStep("applyDataModelStructure");
		this.addAllMessages(extResult);
		context = this.getActionContext();
		queryModel = context.getQueryModelBase();
		application = this.getApplication();
		if (extResult.isValid() && oFF.notNull(response)) {
			rootElement = response.getRootElement();
			if (oFF.isNull(rootElement)) {
				this.addError(oFF.ErrorCodes.PARSER_ERROR,
						"Root element is missing");
			} else {
				if (!oFF.InAHelper.importMessages(rootElement, this)) {
					oFF.PlanningStateHandler.update(application, context
							.getSystemName(), rootElement, this);
					if (this.m_applyVariableStates) {
						inaQueryModel = rootElement.getStructureByKey("Cube");
						if (oFF.isNull(inaQueryModel)) {
							this.addError(oFF.ErrorCodes.PARSER_ERROR,
									"Cannot find 'Cube' element.");
						} else {
							this.processCubeElement(queryModel, rootElement,
									inaQueryModel, context);
						}
					}
				}
			}
		}
		nextState = this.m_state.getNextState();
		if (this.isValid() && oFF.notNull(nextState)) {
			if (this.m_state === oFF.VariableProcessorState.PROCESSING_CANCEL) {
				this.addAllMessages(queryModel.deserializeFromElementExt(
						oFF.QModelFormat.INA_METADATA, context
								.getMetadataStateBeforeVarScreen()));
				this.addAllMessages(queryModel.deserializeFromElementExt(
						oFF.QModelFormat.INA_REPOSITORY, context
								.getStateBeforeVarScreen()));
				context.setStateBeforeVarScreen(null);
				context.setMetadataStateBeforeVarScreen(null);
			} else {
				if (this.m_state
						.isTypeOf(oFF.VariableProcessorState.PROCESSING_SUBMIT)) {
					context.setStateBeforeVarScreen(null);
					context.setMetadataStateBeforeVarScreen(null);
					context.getNewResultsetContainer();
				}
			}
			context.setVariableProcessorState(nextState);
		} else {
			if (!oFF.XString.isEqual(this.m_processingStep,
					"VariableDefinition")
					|| this.m_state === oFF.VariableProcessorState.PROCESSING_UPDATE_VALUES) {
				context.returnToPreviousProcessorState();
			}
		}
		if (this.isValid()) {
			context.prepareAfterVariables();
		}
		this.endProfileStep();
		this.endSync();
	};
	oFF.InAQMgrVarAction.prototype.processCubeElement = function(queryModel,
			rootElement, cubeElement, context) {
		var inaImporterForEmptyVarDef;
		var inaImporter;
		if (this.m_applyVariableAndModelStates) {
			this.applyServerModel(queryModel, rootElement, cubeElement);
		} else {
			if (this.m_isProcessingEmptyDef) {
				inaImporterForEmptyVarDef = context.getVariablesImporter();
				oFF.QInAMdQuery.importDimensions(inaImporterForEmptyVarDef,
						cubeElement, queryModel);
				inaImporterForEmptyVarDef.importDimensions(cubeElement,
						queryModel, queryModel);
				oFF.QInAMdQuery.importVariants(cubeElement, queryModel);
				inaImporterForEmptyVarDef.importVariables(cubeElement, context
						.getVariableContainerBase());
				oFF.QInAMdDataSource.importMd(inaImporterForEmptyVarDef,
						cubeElement, queryModel, queryModel);
				this.addAllMessages(inaImporterForEmptyVarDef);
				this.m_isProcessingEmptyDef = false;
			} else {
				inaImporter = context.getVariablesImporter();
				inaImporter.importVariables(cubeElement, context
						.getVariableContainerBase());
				this.addAllMessages(inaImporter);
			}
		}
	};
	oFF.InAQMgrVarAction.prototype.applyServerModel = function(queryModel,
			inaStructure, inaQueryModel) {
		var queryModelInAStructure = inaQueryModel;
		var provider = this.getActionContext();
		var mergeNeeded = false;
		var environment;
		var application;
		var metaDataImporter;
		var varQueryModel;
		var deserializationStructure;
		var importer;
		var variableProcessorState;
		var settings;
		if (provider.getPreviousVariableProcessorState() !== oFF.VariableProcessorState.PROCESSING_EMPTY_VARIABLE_DEFINITION) {
			mergeNeeded = true;
		}
		environment = this.getOlapEnv();
		application = this.getApplication();
		oFF.PlanningStateHandler.update(application, provider.getSystemName(),
				inaStructure, this);
		metaDataImporter = oFF.QInAImportFactory.createForMetadata(application,
				provider.getInaCapabilities().getActiveMainCapabilities());
		varQueryModel = oFF.QueryModel.create(environment, provider, queryModel
				.getModelCapabilitiesBase());
		varQueryModel.setDataSource(queryModel.getDataSource());
		if (oFF.XString.isEqual(this.m_processingStep, "VariableDefinition")) {
			metaDataImporter.importVariableContainer(inaStructure
					.getStructureByKey("Cube"), queryModel
					.getVariableManagerBase(), queryModel);
		} else {
			if (!mergeNeeded) {
				metaDataImporter.importQueryModel(queryModelInAStructure,
						queryModel);
				deserializationStructure = provider
						.getDeserializationStructure();
				importer = provider.getDeserializationImporter();
				if (oFF.notNull(deserializationStructure)
						&& oFF.notNull(importer)) {
					importer.importQueryModel(deserializationStructure,
							queryModel);
				}
			} else {
				metaDataImporter.importQueryModel(queryModelInAStructure,
						varQueryModel);
				queryModel.setServerBaseSerialization(oFF.PrStructure
						.createDeepCopy(queryModelInAStructure));
				queryModelInAStructure = queryModel
						.getServerBaseSerialization();
			}
		}
		this.addAllMessages(metaDataImporter);
		if (mergeNeeded) {
			queryModel.queueEventing();
			variableProcessorState = provider.getVariableProcessorState();
			settings = oFF.InAQMgrMergeSettings
					.create(variableProcessorState === oFF.VariableProcessorState.PROCESSING_SUBMIT);
			this.revertUdhStateOnVariableModel(varQueryModel, queryModel,
					settings);
			queryModel.mergeDeepRecursive(settings, varQueryModel);
		}
		oFF.XObjectExt.release(varQueryModel);
		this.initPlanningSupport(queryModelInAStructure, false);
		oFF.InAQMgrUtils.applyResultSetFeatureCapabilities(provider,
				queryModelInAStructure);
		if (mergeNeeded) {
			queryModel.resumeEventing();
		}
	};
	oFF.InAQMgrVarAction.prototype.revertUdhStateOnVariableModel = function(
			varQueryModel, queryModel, settings) {
		var universalDisplayHierarchies;
		var hierarchyList;
		var varQueryModelUniversalDisplayHierarchies;
		var varQueryModelHierarchyList;
		var i;
		var varQueryModelUdh;
		var axisType;
		var dimension;
		if (queryModel.getQueryManager().isHierarchyToUDHConversionEnabled()) {
			universalDisplayHierarchies = queryModel
					.getUniversalDisplayHierarchies();
			hierarchyList = universalDisplayHierarchies.getHierarchies();
			varQueryModelUniversalDisplayHierarchies = varQueryModel
					.getUniversalDisplayHierarchies();
			varQueryModelHierarchyList = varQueryModelUniversalDisplayHierarchies
					.getHierarchies();
			if (oFF.XCollectionUtils.hasElements(hierarchyList)
					&& oFF.XCollectionUtils
							.hasElements(varQueryModelHierarchyList)) {
				for (i = 0; i < varQueryModelHierarchyList.size(); i++) {
					varQueryModelUdh = varQueryModelHierarchyList.get(i);
					if (varQueryModelUdh.isActive()) {
						axisType = varQueryModelUdh.getHierarchyDedicatedAxis()
								.getType();
						dimension = oFF.QInAUniversalDisplayHierarchies
								.getDimensionWithLeveledHierarchy(queryModel
										.getAxis(axisType));
						if (oFF.notNull(dimension)) {
							this.revertUdhState(varQueryModel, dimension,
									varQueryModelUniversalDisplayHierarchies,
									universalDisplayHierarchies, settings);
						}
					}
				}
			}
		}
	};
	oFF.InAQMgrVarAction.prototype.revertUdhState = function(varQueryModel,
			convertedDimension, varQueryModelUdh, udh, settings) {
		var varQueryModelDimension = varQueryModel
				.getDimensionByName(convertedDimension.getName());
		var varQueryModelFilter;
		if (oFF.notNull(varQueryModelDimension)) {
			varQueryModelDimension.getHierarchyManager().copyHierarchy(
					convertedDimension.getHierarchyManager());
			varQueryModelFilter = varQueryModelDimension.getFilter();
			if (oFF.notNull(varQueryModelFilter)) {
				varQueryModelFilter.clear();
			}
			varQueryModelUdh.mergeDeepRecursive(settings, udh);
		}
	};
	oFF.InAQMgrVarAction.prototype.isSuccessfullyProcessed = function() {
		return this.isValid();
	};
	oFF.InAQMgrVarAction.prototype.callListener = function(extResult, listener,
			data, customIdentifier) {
		listener.onVariableProcessorExecuted(extResult, data, customIdentifier);
	};
	oFF.InAQMgrVarImmediateSuccess = function() {
	};
	oFF.InAQMgrVarImmediateSuccess.prototype = new oFF.InAQMgrSyncAction();
	oFF.InAQMgrVarImmediateSuccess.create = function(parent, syncType,
			listener, customIdentifier) {
		var obj = new oFF.InAQMgrVarImmediateSuccess();
		obj.setupActionAndRun(syncType, parent, listener, customIdentifier);
		return obj;
	};
	oFF.InAQMgrVarImmediateSuccess.prototype.onFunctionExecuted = function(
			extResult, response, customIdentifier) {
	};
	oFF.InAQMgrVarImmediateSuccess.prototype.isSuccessfullyProcessed = function() {
		return true;
	};
	oFF.InAQMgrVarImmediateSuccess.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onVariableProcessorExecuted(this, this, customIdentifier);
	};
	oFF.InAQRriTargetsSyncAction = function() {
	};
	oFF.InAQRriTargetsSyncAction.prototype = new oFF.InAQMgrSyncAction();
	oFF.InAQRriTargetsSyncAction.createAndRun = function(syncType, parent,
			identifier) {
		var result = new oFF.InAQRriTargetsSyncAction();
		result.m_parent = parent;
		result.m_identifier = identifier;
		result.setupActionAndRun(syncType, parent, null, null);
		return result;
	};
	oFF.InAQRriTargetsSyncAction.extractRriTargets = function(targets) {
		var result = oFF.XList.create();
		var len = oFF.PrUtils.getListSize(targets, 0);
		var i;
		var target;
		var rriTarget;
		var parameterNames;
		var parameters;
		var j;
		var parameterName;
		var parameterValue;
		var properties;
		var propertyNames;
		var customProperties;
		var k;
		var propertyName;
		var propertyValue;
		for (i = 0; i < len; i++) {
			target = oFF.PrUtils.getStructureElement(targets, i);
			if (oFF.isNull(target)) {
				continue;
			}
			rriTarget = oFF.QRriTarget.create();
			parameterNames = oFF.PrUtils.getKeysAsReadOnlyListOfString(target,
					null);
			if (oFF.notNull(parameterNames)) {
				parameters = rriTarget.getParameters();
				for (j = 0; j < parameterNames.size(); j++) {
					parameterName = parameterNames.get(j);
					parameterValue = oFF.PrUtils.getStringProperty(target,
							parameterName);
					if (oFF.notNull(parameterValue)) {
						parameters.put(parameterName, parameterValue
								.getString());
					}
				}
			}
			properties = oFF.PrUtils.getStructureProperty(target, "Properties");
			propertyNames = oFF.PrUtils.getKeysAsReadOnlyListOfString(
					properties, null);
			if (oFF.notNull(propertyNames)) {
				customProperties = rriTarget.getCustomProperties();
				for (k = 0; k < propertyNames.size(); k++) {
					propertyName = propertyNames.get(k);
					propertyValue = oFF.PrUtils.getStringProperty(properties,
							propertyName);
					if (oFF.notNull(propertyValue)) {
						customProperties.put(propertyName, propertyValue
								.getString());
					}
				}
			}
			result.add(rriTarget);
		}
		return result;
	};
	oFF.InAQRriTargetsSyncAction.prototype.m_parent = null;
	oFF.InAQRriTargetsSyncAction.prototype.m_identifier = null;
	oFF.InAQRriTargetsSyncAction.prototype.releaseObject = function() {
		this.m_parent = null;
		this.m_identifier = null;
		oFF.InAQMgrSyncAction.prototype.releaseObject.call(this);
	};
	oFF.InAQRriTargetsSyncAction.prototype.onFunctionExecuted = function(
			extResult, response, customIdentifier) {
		var rriTargets;
		var extResultRriTargets;
		this.addAllMessages(extResult);
		rriTargets = null;
		if (extResult.isValid()) {
			rriTargets = oFF.InAQRriTargetsSyncAction
					.extractRriTargets(oFF.PrUtils.getListProperty(response
							.getRootElement(), "RRITargets"));
		}
		extResultRriTargets = oFF.ExtResult.create(rriTargets, extResult);
		this.m_identifier.manager.setResult(extResultRriTargets,
				this.m_identifier);
		this.endSync();
	};
	oFF.InAQRriTargetsSyncAction.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
	};
	oFF.InAQRriTargetsSyncAction.prototype.processSynchronization = function(
			syncType) {
		var requestJson = this.exportRequestJson();
		var connection = this.m_parent.getApplication().getConnection(
				this.m_parent.getSystemName());
		var serverMetadata = connection.getServerMetadata();
		var capabilities = serverMetadata
				.getMetadataForService(oFF.ServerService.ANALYTIC);
		var fastPath = capabilities.getByKey(oFF.InACapabilities.FAST_PATH);
		var path;
		var ocpFunction;
		var request;
		if (oFF.notNull(fastPath)) {
			path = fastPath.getValue();
		} else {
			path = this.m_parent.getSystemType().getInAPath();
		}
		ocpFunction = connection.newRpcFunction(path);
		request = ocpFunction.getRequest();
		request.setRequestStructure(requestJson);
		ocpFunction.processFunctionExecution(syncType, this, null);
		return true;
	};
	oFF.InAQRriTargetsSyncAction.prototype.exportRequestJson = function() {
		var requestStructure = oFF.PrFactory.createStructure();
		var innerRequestStructure = this.m_parent.setInnerStructure(
				requestStructure, "Analytics", null);
		var exportInAData = oFF.QInAExportFactory.createForData(this.m_parent
				.getApplication(), this.m_parent.getInaCapabilities()
				.getActiveMainCapabilities());
		var queryModel = this.m_parent.getQueryModel();
		var inaDefinition = exportInAData.exportQueryModel(queryModel, true,
				false);
		var options;
		var rriTargetManager;
		var rriContext;
		innerRequestStructure.put("Definition", inaDefinition);
		innerRequestStructure.put("DataSource", exportInAData.exportDataSource(
				queryModel.getDataSource(), false));
		innerRequestStructure.getStructureByKey("DataSource").putString("Type",
				"Query/RRI");
		options = inaDefinition.putNewStructure("ResultSetFeatureRequest");
		options.putBoolean("UseDefaultAttributeKey", false);
		if (this.m_parent.useEncodedRs()) {
			options.putString("ResultFormat", "Version2");
			options.putString("ResultEncoding", "None");
		}
		rriTargetManager = queryModel.getQueryManager().getRriTargetManager();
		rriContext = innerRequestStructure.putNewStructure("RRIContext");
		rriContext.putInteger("Column", rriTargetManager.getResultSetColumn());
		rriContext.putInteger("Row", rriTargetManager.getResultSetRow());
		return requestStructure;
	};
	oFF.InAQRriTargetsSyncAction.prototype.getComponentName = function() {
		return "InAQRriTargetsSyncAction";
	};
	oFF.InAQueryManagerProvider = function() {
	};
	oFF.InAQueryManagerProvider.prototype = new oFF.QueryManager();
	oFF.InAQueryManagerProvider.CLAZZ = null;
	oFF.InAQueryManagerProvider.staticSetupProvider = function() {
		oFF.InAQueryManagerProvider.CLAZZ = oFF.XClass
				.create(oFF.InAQueryManagerProvider);
	};
	oFF.InAQueryManagerProvider.prototype.m_exportData = null;
	oFF.InAQueryManagerProvider.prototype.m_importMetaData = null;
	oFF.InAQueryManagerProvider.prototype.m_exportValueHelp = null;
	oFF.InAQueryManagerProvider.prototype.m_importer = null;
	oFF.InAQueryManagerProvider.prototype.m_isVariableSubmitNeeded = false;
	oFF.InAQueryManagerProvider.prototype.m_directVariableTransfer = false;
	oFF.InAQueryManagerProvider.prototype.m_useEncodedRs = false;
	oFF.InAQueryManagerProvider.prototype.m_deserializationStructure = null;
	oFF.InAQueryManagerProvider.prototype.m_deserializationFormat = null;
	oFF.InAQueryManagerProvider.prototype.m_inaCapabilities = null;
	oFF.InAQueryManagerProvider.prototype.m_inaCapabilitiesValueHelp = null;
	oFF.InAQueryManagerProvider.prototype.m_valuehelpCallbacks = null;
	oFF.InAQueryManagerProvider.prototype.m_valuehelpResults = null;
	oFF.InAQueryManagerProvider.prototype.m_valuehelpIdentifiers = null;
	oFF.InAQueryManagerProvider.prototype.m_valuehelpProcessedKeys = null;
	oFF.InAQueryManagerProvider.prototype.m_valuehelpIdentifier = 0;
	oFF.InAQueryManagerProvider.prototype.m_isMetadataCached = false;
	oFF.InAQueryManagerProvider.prototype.m_rriTargetManager = null;
	oFF.InAQueryManagerProvider.prototype.m_savedStateBeforeVarScreen = null;
	oFF.InAQueryManagerProvider.prototype.m_savedMetadataStateBeforeVarScreen = null;
	oFF.InAQueryManagerProvider.prototype.m_lastDataRequest = null;
	oFF.InAQueryManagerProvider.prototype.m_capabilities = null;
	oFF.InAQueryManagerProvider.prototype.m_availableVariants = null;
	oFF.InAQueryManagerProvider.prototype.m_activeVariant = null;
	oFF.InAQueryManagerProvider.prototype.m_preQueryName = null;
	oFF.InAQueryManagerProvider.prototype.m_suppressExitVariableValues = false;
	oFF.InAQueryManagerProvider.prototype.m_isForValueHelp = false;
	oFF.InAQueryManagerProvider.prototype.m_updateRuntimeCapabilities = false;
	oFF.InAQueryManagerProvider.prototype.m_noVariableSubmitResponse = false;
	oFF.InAQueryManagerProvider.prototype.m_processingImageRequest = null;
	oFF.InAQueryManagerProvider.prototype.m_listOfRequestedResources = null;
	oFF.InAQueryManagerProvider.prototype.m_stateManager = null;
	oFF.InAQueryManagerProvider.prototype.isServiceConfigMatching = function(
			serviceConfig, connection, messages) {
		var serverMetadata = connection.getServerMetadata();
		var initSettings;
		if (oFF.isNull(serverMetadata)) {
			messages.addErrorExt(oFF.OriginLayer.DRIVER,
					oFF.ErrorCodes.SERVER_METADATA_NOT_FOUND,
					"Server metadata not available", null);
			return false;
		}
		initSettings = serviceConfig;
		return oFF.InAQMgrCapabilities.checkMainVersion(serverMetadata,
				initSettings.getProviderType());
	};
	oFF.InAQueryManagerProvider.prototype.cloneQueryManagerBase = function(
			cloneMode) {
		var queryMgr;
		this.assertLifeCycleActive();
		queryMgr = new oFF.InAQueryManagerProvider();
		queryMgr.setupClone(this, cloneMode, null);
		return queryMgr;
	};
	oFF.InAQueryManagerProvider.prototype.cloneQueryManagerOptimized = function(
			neededDimensions) {
		var queryModel = this.getQueryModelBase();
		var usedDimensions = oFF.XHashSetOfString.create();
		var dimensionsRequestedFromClient = oFF.XHashSetOfString.create();
		var cloneQueryManagerBase;
		dimensionsRequestedFromClient.putAll(neededDimensions);
		dimensionsRequestedFromClient.add(queryModel.getMeasureDimension()
				.getName());
		this.setDimensionsRequestedFromClient(dimensionsRequestedFromClient);
		usedDimensions.putAll(neededDimensions);
		oFF.DimensionUsageAnalyzer.addDimensionsUsedByVariables(queryModel,
				usedDimensions);
		oFF.DimensionUsageAnalyzer.addDimensionsUsedInFilters(queryModel,
				usedDimensions);
		oFF.DimensionUsageAnalyzer
				.addDimensionsUsedInUniversalDisplayHierarchies(queryModel,
						usedDimensions);
		oFF.DimensionUsageAnalyzer.addDimensionsUsedByLeveledHierarchies(
				queryModel, usedDimensions);
		usedDimensions
				.add(this.getQueryModel().getMeasureDimension().getName());
		this.setDimensionsToClone(usedDimensions);
		cloneQueryManagerBase = this
				.cloneQueryManagerBase(oFF.QueryCloneMode.CURRENT_STATE);
		cloneQueryManagerBase.getQueryServiceConfig().setRequiredDimensions(
				oFF.XListOfString.createFromReadOnlyList(usedDimensions
						.getValuesAsReadOnlyListOfString()));
		this.getDimensionsToClone().clear();
		this.getDimensionsRequestedFromClient().clear();
		return cloneQueryManagerBase;
	};
	oFF.InAQueryManagerProvider.prototype.updateQueryManager = function(
			masterQueryManager, neededDimensions) {
		var thisQueryModel;
		var masterQueryModel;
		var i;
		var originalDimension;
		var cloneDim;
		var dimensionManagerBase;
		this.getDimensionsRequestedFromClient().putAll(neededDimensions);
		this.getDimensionsToClone().putAll(neededDimensions);
		thisQueryModel = this.getQueryModelBase();
		masterQueryModel = masterQueryManager.getQueryModel();
		for (i = 0; i < neededDimensions.size(); i++) {
			if (thisQueryModel.getDimensionByName(neededDimensions.get(i)) === null) {
				originalDimension = masterQueryModel
						.getDimensionByName(neededDimensions.get(i));
				if (oFF.notNull(originalDimension)) {
					cloneDim = oFF.QDimension._create(this.getContext(),
							thisQueryModel.getDimensionAccessor());
					cloneDim.copyDimension(originalDimension);
					thisQueryModel.addDimension(cloneDim);
					dimensionManagerBase = thisQueryModel
							.getDimensionManagerBase();
					dimensionManagerBase
							.finalizeDimensionMetadataSetup(cloneDim);
				}
			}
		}
		this.getQueryServiceConfig().setRequiredDimensions(
				oFF.XListOfString.createFromReadOnlyList(this
						.getDimensionsToClone()
						.getValuesAsReadOnlyListOfString()));
	};
	oFF.InAQueryManagerProvider.prototype.cloneQueryManagerUsingExtDataSource = function(
			cloneMode, dataSource) {
		var qMgrProvider;
		if (cloneMode !== oFF.QueryCloneMode.MICRO_CUBE) {
			throw oFF.XException
					.createIllegalStateException("Cloning query manager using external datasource is supported for MicroCube use only.");
		}
		oFF.XObjectExt.checkNotNull(dataSource,
				"External datasource can't be null.");
		this.assertLifeCycleActive();
		qMgrProvider = new oFF.InAQueryManagerProvider();
		qMgrProvider.setupClone(this, cloneMode, dataSource);
		return qMgrProvider;
	};
	oFF.InAQueryManagerProvider.prototype.setupDesignTimeMode = function() {
		this.m_importMetaData = oFF.QInAImportFactory.createForMetadata(this
				.getApplication(), this.getMainCapabilities());
		this.initQueryModel();
	};
	oFF.InAQueryManagerProvider.prototype.setupValues = function() {
		var activeMainCapabilities;
		var application;
		var noMetadata;
		var dataSource;
		var definitionType;
		var activeDeserializationCapabilities;
		oFF.QueryManager.prototype.setupValues.call(this);
		this.prepareExperimentalCapabilities();
		activeMainCapabilities = this.getMainCapabilities();
		application = this.getApplication();
		this.m_exportData = oFF.QInAExportFactory.createForData(application,
				activeMainCapabilities);
		noMetadata = this.getMode() === oFF.QueryManagerMode.RAW_QUERY
				&& this.getInitSettings().getDataRequest() !== null;
		this.m_updateRuntimeCapabilities = true;
		if (!noMetadata) {
			this.m_importMetaData = oFF.QInAImportFactory.createForMetadata(
					application, activeMainCapabilities);
			this.m_isVariableSubmitNeeded = true;
		}
		dataSource = this.getDataSource();
		if (oFF.notNull(dataSource)
				&& dataSource.getType() === oFF.MetaObjectType.CATALOG_VIEW_2
				&& !this.getCapabilitiesBase().supportsCatalogServiceV2()) {
			dataSource.setType(oFF.MetaObjectType.CATALOG_VIEW);
		}
		this.setDirectVariableTransferEnabled(true);
		if (!noMetadata) {
			this.initQueryModel();
		}
		definitionType = this.getDefinitionType();
		if (oFF.notNull(definitionType)
				&& definitionType !== oFF.QModelFormat.UQM) {
			this.m_deserializationFormat = definitionType;
			this.m_deserializationStructure = this.getDefinitionAsStructure();
			if (oFF.notNull(this.m_deserializationStructure)) {
				this.m_inaCapabilities
						.importDeserializationDocumentCapabilities(this.m_deserializationStructure);
				activeDeserializationCapabilities = this.m_inaCapabilities
						.getActiveDeserializationCapabilities();
				this.m_importer = oFF.QInAImportFactory.create(application,
						this.m_deserializationFormat,
						activeDeserializationCapabilities);
				if (this.getDataSource() === null
						&& this.getMode() === oFF.QueryManagerMode.DEFAULT) {
					this.setDataSource(this.m_importer
							.importDataSource(this.m_deserializationStructure));
				}
			}
		}
		this.m_useEncodedRs = activeMainCapabilities
				.containsKey(oFF.InACapabilities.ENCODED_RESULTSET);
		this.m_valuehelpIdentifier = 0;
		this.m_isMetadataCached = false;
		this.m_listOfRequestedResources = oFF.XListOfString.create();
		this.resetMaxResultRecords();
		this.m_stateManager = oFF.QueryModelStateManager.create(this);
	};
	oFF.InAQueryManagerProvider.prototype.prepareExperimentalCapabilities = function() {
		var serverMetadata = this.getConnection().getServerMetadata();
		var providerType = this.getProviderType();
		var associatedValueHelp;
		var serverBetaCapabilities;
		var serverMainCapabilities;
		var serviceConfig;
		var experimentalFeatures;
		var activeMainCapabilities;
		var devCapaNames;
		var experimentalFeature;
		var isAlreadyActive;
		this.m_inaCapabilities = oFF.InAQMgrCapabilities.create(serverMetadata,
				providerType);
		associatedValueHelp = providerType.getAssociatedValueHelp();
		this.m_inaCapabilitiesValueHelp = oFF.InAQMgrCapabilities.create(
				serverMetadata, associatedValueHelp);
		serverBetaCapabilities = this.m_inaCapabilities
				.getServerBetaCapabilities();
		serverMainCapabilities = this.m_inaCapabilities
				.getServerMainCapabilities();
		serviceConfig = oFF.QueryManager.prototype.getServiceConfig.call(this);
		experimentalFeatures = serviceConfig.getExperimentalFeatureSet();
		if (oFF.notNull(experimentalFeatures)) {
			activeMainCapabilities = this.getMainCapabilities();
			devCapaNames = experimentalFeatures.getKeysAsIteratorOfString();
			while (devCapaNames.hasNext()) {
				experimentalFeature = devCapaNames.next();
				isAlreadyActive = activeMainCapabilities
						.containsKey(experimentalFeature);
				if (serverBetaCapabilities.containsKey(experimentalFeature)
						&& !isAlreadyActive) {
					activeMainCapabilities.addCapability(experimentalFeature);
				}
				if (serverMainCapabilities.containsKey(experimentalFeature)
						&& !isAlreadyActive) {
					activeMainCapabilities.addCapability(experimentalFeature);
				}
			}
		}
	};
	oFF.InAQueryManagerProvider.prototype.releaseObject = function() {
		var environment;
		var i;
		this.m_availableVariants = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_availableVariants);
		this.m_activeVariant = null;
		this.m_importMetaData = oFF.XObjectExt.release(this.m_importMetaData);
		this.m_importer = oFF.XObjectExt.release(this.m_importer);
		this.m_exportData = oFF.XObjectExt.release(this.m_exportData);
		this.m_exportValueHelp = oFF.XObjectExt.release(this.m_exportValueHelp);
		this.m_capabilities = oFF.XObjectExt.release(this.m_capabilities);
		this.m_lastDataRequest = oFF.XObjectExt.release(this.m_lastDataRequest);
		this.m_inaCapabilitiesValueHelp = oFF.XObjectExt
				.release(this.m_inaCapabilitiesValueHelp);
		this.m_rriTargetManager = oFF.XObjectExt
				.release(this.m_rriTargetManager);
		this.m_deserializationStructure = null;
		this.m_deserializationFormat = null;
		this.m_valuehelpCallbacks = oFF.XObjectExt
				.release(this.m_valuehelpCallbacks);
		this.m_valuehelpResults = oFF.XObjectExt
				.release(this.m_valuehelpResults);
		this.m_valuehelpIdentifiers = oFF.XObjectExt
				.release(this.m_valuehelpIdentifiers);
		this.m_valuehelpProcessedKeys = oFF.XObjectExt
				.release(this.m_valuehelpProcessedKeys);
		this.m_savedStateBeforeVarScreen = null;
		this.m_savedMetadataStateBeforeVarScreen = null;
		environment = this.getOlapEnv();
		if (oFF.XCollectionUtils.hasElements(this.m_listOfRequestedResources)) {
			for (i = 0; i < this.m_listOfRequestedResources.size(); i++) {
				environment.releaseResource(this.m_listOfRequestedResources
						.get(i));
			}
		}
		this.m_listOfRequestedResources = oFF.XObjectExt
				.release(this.m_listOfRequestedResources);
		oFF.QueryManager.prototype.releaseObject.call(this);
		this.m_inaCapabilities = null;
		this.m_stateManager = oFF.XObjectExt.release(this.m_stateManager);
	};
	oFF.InAQueryManagerProvider.prototype.createFunction = function() {
		var systemDescription = this.getSystemDescription();
		var fastPathCap;
		var path;
		var connection;
		var connectionPool;
		var openConnections;
		var ocpFunction;
		var request;
		var dataSource;
		oFF.XObjectExt.checkNotNull(systemDescription,
				"System description is null");
		fastPathCap = this.getMainCapabilities().getByKey(
				oFF.InACapabilities.FAST_PATH);
		if (oFF.notNull(fastPathCap) && fastPathCap.getValue() !== null) {
			path = fastPathCap.getValue();
		} else {
			path = systemDescription.getSystemType().getInAPath();
		}
		connection = this.getConnection();
		if (oFF.isNull(connection)) {
			connectionPool = this.getApplication().getConnectionPool();
			openConnections = connectionPool
					.getOpenConnections(systemDescription.getSystemName());
			if (openConnections.hasElements()) {
				connection = openConnections.get(0);
			} else {
				connection = connectionPool.getConnection(systemDescription
						.getSystemName());
			}
		}
		ocpFunction = null;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.getResourcePath())) {
			ocpFunction = connection.newRpcFunctionForBLOB(this
					.getResourcePath());
			ocpFunction.getRequest().setMethod(oFF.HttpRequestMethod.HTTP_GET);
			return ocpFunction;
		}
		ocpFunction = connection.newRpcFunction(path);
		request = ocpFunction.getRequest();
		request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
		dataSource = this.getDataSource();
		if (oFF.notNull(dataSource)) {
			request.setTokens(dataSource.getSCPOpenConnectorsUserToken(),
					dataSource.getSCPOpenConnectorsOrganizationToken(),
					dataSource.getSCPOpenConnectorsElementToken());
		}
		return ocpFunction;
	};
	oFF.InAQueryManagerProvider.prototype.setLanguage = function(
			requestStructure) {
		var language = this.getConnection().getSystemDescription()
				.getLanguage();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(language)) {
			requestStructure.putString("Language", language);
		}
	};
	oFF.InAQueryManagerProvider.prototype.getSystemName = function() {
		var systemDescription = this.getSystemDescription();
		if (oFF.isNull(systemDescription)) {
			return null;
		}
		return systemDescription.getSystemName();
	};
	oFF.InAQueryManagerProvider.prototype.getSystemType = function() {
		return this.getSystemDescription().getSystemType();
	};
	oFF.InAQueryManagerProvider.prototype.setMiscRequest = function(request) {
		var inaAnalytics = request.getStructureByKey("Analytics");
		var inaDefinition;
		this.setLanguage(inaAnalytics);
		this.fillOptions(request);
		this.m_inaCapabilities.exportActiveMainCapabilities(inaAnalytics);
		inaDefinition = inaAnalytics.getStructureByKey("Definition");
		this.exportOptimizerHints(inaDefinition, this.getQueryModel());
		this.exportReturnedDataSelections(inaDefinition
				.getStructureByKey("ResultSetFeatureRequest"));
	};
	oFF.InAQueryManagerProvider.prototype.processProviderShutdown = function(
			syncType, listener, customIdentifier) {
		return oFF.InAQMgrShutdownAction.createAndRun(syncType, listener,
				customIdentifier, this);
	};
	oFF.InAQueryManagerProvider.prototype.processProviderCancelThreads = function(
			syncType, listener, customIdentifier) {
		if (this
				.supportsAnalyticCapability(oFF.InACapabilities.CANCEL_RUNNING_REQUESTS)) {
			return oFF.InAQMgrCancelThreadsAction.createAndRun(syncType,
					listener, customIdentifier, this);
		}
		return null;
	};
	oFF.InAQueryManagerProvider.prototype.processProviderClearCache = function(
			syncType, listener, customIdentifier, timestamp) {
		var systemType = this.getSystemType();
		if (systemType.isTypeOf(oFF.SystemType.HANA)
				|| systemType.isTypeOf(oFF.SystemType.UNV)
				|| systemType.isTypeOf(oFF.SystemType.UQAS)) {
			return oFF.InAQMgrClearCacheAction.createAndRun(syncType, listener,
					customIdentifier, this, timestamp);
		}
		return null;
	};
	oFF.InAQueryManagerProvider.prototype.processInitialization = function(
			syncType, listener, customIdentifier) {
		this.setupValues();
		return oFF.InAQMgrStartupAction.createServiceInitAndRun(syncType,
				listener, customIdentifier, this, this);
	};
	oFF.InAQueryManagerProvider.prototype.processReInitialization = function(
			syncType, listener, customIdentifier) {
		return oFF.InAQMgrStartupAction.createMetadataInitAndRun(syncType,
				listener, customIdentifier, this, this);
	};
	oFF.InAQueryManagerProvider.prototype.processReInitializationForNewQueryManager = function(
			syncType, listener, customIdentifier) {
		this.setupValues();
		return oFF.InAQMgrStartupAction.createMetadataInitAndRun(syncType,
				listener, customIdentifier, this, this);
	};
	oFF.InAQueryManagerProvider.prototype.processModelInitialization = function(
			syncType, listener, customIdentifier) {
		this.setMode(oFF.QueryManagerMode.DEFAULT);
		this.getNewResultsetContainer();
		return oFF.InAQMgrStartupAction.createMetadataInitAndRun(syncType,
				listener, customIdentifier, this, this);
	};
	oFF.InAQueryManagerProvider.prototype.loadQueryModel = function(syncType,
			listener, customIdentifier) {
		if (this.isShallow()) {
			return this.processModelInitialization(syncType, listener,
					customIdentifier);
		}
		if (oFF.notNull(listener)) {
			listener.onQueryModelInitialized(this.getQueryServiceConfig(),
					this, customIdentifier);
		}
		return this.getQueryServiceConfig();
	};
	oFF.InAQueryManagerProvider.prototype.getDataAreas = function() {
		var systemType = this.getSystemType();
		var queryModel;
		var dataAreaState;
		var list;
		if (!systemType.isTypeOf(oFF.SystemType.BW)) {
			return null;
		}
		queryModel = this.getQueryModel();
		if (oFF.isNull(queryModel)) {
			return null;
		}
		dataAreaState = oFF.PlanningStateHandler.getDataAreaStateByName(this
				.getApplication(), this.getSystemName(), queryModel
				.getDataArea());
		if (oFF.isNull(dataAreaState)) {
			return null;
		}
		if (dataAreaState.isSubmitted()) {
			return null;
		}
		list = oFF.PrFactory.createList();
		list.add(dataAreaState.serializeToJson());
		return list;
	};
	oFF.InAQueryManagerProvider.prototype.addDimensionMemberKeys = function(
			keys, dimensionMembers) {
		var dimensionMembersSize = dimensionMembers.size();
		var idxDimMember;
		var dimensionMember;
		for (idxDimMember = 0; idxDimMember < dimensionMembersSize; idxDimMember++) {
			dimensionMember = dimensionMembers.get(idxDimMember);
			keys.addString(dimensionMember.getKeyFieldValue().getString());
		}
	};
	oFF.InAQueryManagerProvider.prototype.exportNewLines = function(
			inaDefinition) {
		var resultSetContainer = this.getActiveResultSetContainer();
		var newLineCollection;
		var validNewLines;
		var newLines;
		var dimensionContext;
		var dimensionMembers;
		var dimensionMembersSize;
		var idxDimMember;
		var dimensionMember;
		var values;
		var validNewLinesSize;
		var idxNewLines;
		var prNewLine;
		var newLine;
		var keys;
		var cellValues;
		if (oFF.isNull(resultSetContainer)) {
			return;
		}
		if (!resultSetContainer.hasNewLineCollection()) {
			return;
		}
		newLineCollection = resultSetContainer.getNewLineCollection();
		validNewLines = newLineCollection.getValidNewLines();
		if (oFF.isNull(validNewLines)) {
			return;
		}
		newLines = inaDefinition.putNewStructure("DataEntries");
		dimensionContext = newLines.putNewList("DimensionContext");
		dimensionMembers = validNewLines.get(0).getDimensionMembers();
		dimensionMembersSize = dimensionMembers.size();
		for (idxDimMember = 0; idxDimMember < dimensionMembersSize; idxDimMember++) {
			dimensionMember = dimensionMembers.get(idxDimMember);
			dimensionContext
					.addString(dimensionMember.getDimension().getName());
		}
		values = newLines.putNewList("Values");
		validNewLinesSize = validNewLines.size();
		for (idxNewLines = 0; idxNewLines < validNewLinesSize; idxNewLines++) {
			prNewLine = values.addNewStructure();
			newLine = validNewLines.get(idxNewLines);
			prNewLine.putString("Action", "NewLine");
			prNewLine.putInteger("LineId", newLine.getLineId());
			keys = prNewLine.putNewList("Keys");
			this.addDimensionMemberKeys(keys, newLine.getDimensionMembers());
			cellValues = prNewLine.putNewList("CellValues");
			this.addCellValues(newLine, cellValues);
		}
	};
	oFF.InAQueryManagerProvider.prototype.addCellValues = function(newLine,
			cellValues) {
		var newEntries = newLine.getNewLineEntries();
		var newEntriesSize = newEntries.size();
		var idxNewEntries;
		var newEntry;
		var prNewEntry;
		var newXValue;
		var newXValueType;
		for (idxNewEntries = 0; idxNewEntries < newEntriesSize; idxNewEntries++) {
			newEntry = newEntries.get(idxNewEntries);
			if (!newEntry.isValueChanged()) {
				continue;
			}
			prNewEntry = oFF.PrFactory.createStructure();
			prNewEntry.putString("QueryDataCell", newEntry.getQueryDataCell()
					.getName());
			newXValue = newEntry.getNewXValue();
			newXValueType = newXValue.getValueType();
			if (newXValueType === oFF.XValueType.DOUBLE) {
				prNewEntry.putDouble("NewValue", newXValue.getDouble());
			} else {
				if (newXValueType === oFF.XValueType.STRING) {
					prNewEntry.putString("NewValueExternal", newXValue
							.getString());
				} else {
					oFF.noSupport();
				}
			}
			cellValues.add(prNewEntry);
		}
	};
	oFF.InAQueryManagerProvider.prototype.exportValuesAbapNotExtended = function(
			dataEntry, newValues) {
		var newValueBW = newValues.addNewList();
		newValueBW.addInteger(dataEntry.getRow() + 1);
		newValueBW.addInteger(dataEntry.getColumn() + 1);
		newValueBW.addDouble(dataEntry.getDouble());
		if (dataEntry.isValueLocked()) {
			newValueBW.addInteger(1);
		} else {
			newValueBW.addInteger(0);
		}
	};
	oFF.InAQueryManagerProvider.prototype.exportValues = function(dataEntry,
			newValues) {
		var newValue = newValues.addNewStructure();
		var coordinates = newValue.putNewList("Coordinates");
		var isBW;
		var isHana;
		var entryValue;
		var entryType;
		coordinates.addInteger(dataEntry.getRow());
		coordinates.addInteger(dataEntry.getColumn());
		isBW = this.getSystemType().isTypeOf(oFF.SystemType.BW);
		isHana = this.getSystemType().isTypeOf(oFF.SystemType.HANA);
		if (dataEntry.isValueChanged() || dataEntry.isNewValueForced()) {
			entryValue = dataEntry.getXValue();
			entryType = entryValue.getValueType();
			if (entryType === oFF.XValueType.DOUBLE) {
				newValue.putDouble("NewValue", entryValue.getDouble());
			} else {
				if (entryType === oFF.XValueType.STRING) {
					if (isHana) {
						newValue.putString("NewValueAsString", entryValue
								.getString());
					} else {
						if (isBW) {
							newValue.putString("NewValueExternal", entryValue
									.getString());
						}
					}
				} else {
					if (entryType === oFF.XValueType.DATE && isBW) {
						newValue.putString("NewValueExternal", entryValue
								.toSAPFormat());
					} else {
						oFF.noSupport();
					}
				}
			}
			if (dataEntry.isNewValueForced() && isHana) {
				newValue.putBoolean("KeepValue", true);
			}
		}
		this.exportValueInfo(newValue, dataEntry);
	};
	oFF.InAQueryManagerProvider.prototype.exportValueInfo = function(newValue,
			dataEntry) {
		var command;
		var action;
		var params;
		var targetVersionId;
		if (dataEntry.isValueLockChanged()) {
			newValue.putBoolean("LockedCell", dataEntry.isValueLocked());
		}
		if (this.getCapabilitiesBase().supportsSortNewValues()) {
			newValue.putInteger("Priority", dataEntry.getPriority());
		}
		oFF.QInAExportUtil.setNameIfNotNull(newValue, "ProcessingType",
				dataEntry.getProcessingType());
		command = dataEntry.getPlanningCommand();
		if (oFF.notNull(command)
				&& command.getCommandType() === oFF.PlanningCommandType.PLANNING_ACTION) {
			action = command;
			newValue.putString("ActionId", action.getActionForQueryIdentifier()
					.getActionId());
			params = oFF.PrStructure.createDeepCopy(action
					.getActionParameters());
			if (oFF.notNull(params)) {
				newValue.put("ActionParameters", params);
			}
			if (action.getActionForQueryIdentifier().getActionType() === oFF.PlanningActionType.QUERY_SINGLE) {
				targetVersionId = action.getTargetVersionId();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(targetVersionId)) {
					newValue.putString("TargetVersionId", targetVersionId);
				}
			}
		}
	};
	oFF.InAQueryManagerProvider.prototype.exportNewValues = function(
			inaDefinition, planningExtension) {
		var resultSetContainer = this.getActiveResultSetContainer();
		var newValues;
		var dataEntryCollection;
		if (oFF.isNull(resultSetContainer)) {
			return;
		}
		if (!resultSetContainer.hasDataEntryCollection()) {
			return;
		}
		newValues = oFF.PrFactory.createList();
		dataEntryCollection = resultSetContainer.getDataEntryCollection();
		this.exportRsDataEntries(newValues, dataEntryCollection);
		this.exportRsDataEntriesViaMember(newValues, dataEntryCollection);
		if (newValues.isEmpty()) {
			return;
		}
		inaDefinition.put("NewValues", newValues);
		this.exportPublicVersionEdit(planningExtension);
	};
	oFF.InAQueryManagerProvider.prototype.exportRsDataEntries = function(
			newValues, dataEntryCollection) {
		var changedEntries = dataEntryCollection.getChangedDataEntries();
		var activeMainCapabilities;
		var newValuesImplicitUnlock;
		var newValuesExtendedFormat;
		var isBW;
		var isHana;
		var changedEntriesSize;
		var i;
		var dataEntry;
		if (changedEntries.isEmpty()) {
			return;
		}
		activeMainCapabilities = this.getMainCapabilities();
		newValuesImplicitUnlock = activeMainCapabilities
				.containsKey(oFF.InACapabilities.NEW_VALUES_IMPLICIT_UNLOCK);
		newValuesExtendedFormat = activeMainCapabilities
				.containsKey(oFF.InACapabilities.NEW_VALUES_EXTENDED_FORMAT);
		isBW = this.getSystemType().isTypeOf(oFF.SystemType.BW);
		isHana = this.getSystemType().isTypeOf(oFF.SystemType.HANA);
		changedEntriesSize = changedEntries.size();
		for (i = 0; i < changedEntriesSize; i++) {
			dataEntry = changedEntries.get(i);
			if (!dataEntry.isNewValueForced() && !dataEntry.isValueChanged()
					&& !dataEntry.isValueLockChanged()) {
				if (isHana && dataEntry.getPlanningCommand() === null) {
					continue;
				} else {
					if (isBW && newValuesExtendedFormat) {
						continue;
					}
				}
			}
			if (!newValuesExtendedFormat && newValuesImplicitUnlock
					&& !dataEntry.isNewValueForced()
					&& !dataEntry.isValueChanged()
					&& !dataEntry.isValueLocked()) {
				continue;
			}
			if (isBW && !newValuesExtendedFormat) {
				this.exportValuesAbapNotExtended(dataEntry, newValues);
			} else {
				if (isHana || isBW && newValuesExtendedFormat) {
					this.exportValues(dataEntry, newValues);
				}
			}
		}
	};
	oFF.InAQueryManagerProvider.prototype.exportRsDataEntriesViaMember = function(
			newValues, dataEntryCollection) {
		var entries = dataEntryCollection.getDataEntriesViaMember();
		var i;
		var entry;
		var xValue;
		var newValue;
		var memberList;
		var memberContext;
		var keys;
		var j;
		var dimensionName;
		var memberName;
		var member;
		if (entries.isEmpty()) {
			return;
		}
		for (i = 0; i < entries.size(); i++) {
			entry = entries.get(i);
			xValue = entry.getXValue();
			newValue = oFF.PrFactory.createStructure();
			if (xValue.getValueType() === oFF.XValueType.STRING) {
				newValue.putString("NewValue", xValue.getString());
			} else {
				if (xValue.getValueType() === oFF.XValueType.DOUBLE) {
					newValue.putDouble("NewValue", xValue.getDouble());
				} else {
					continue;
				}
			}
			memberList = newValue.putNewList("Context");
			memberContext = entry.getMemberContext();
			keys = memberContext.getKeysAsReadOnlyListOfString();
			keys.sortByDirection(oFF.XSortDirection.ASCENDING);
			for (j = 0; j < keys.size(); j++) {
				dimensionName = keys.get(j);
				memberName = memberContext.getByKey(dimensionName);
				member = memberList.addNewStructure();
				member.putString("Dimension", dimensionName);
				member.putString("Member", memberName);
			}
			this.exportValueInfo(newValue, entry);
			newValues.add(newValue);
		}
	};
	oFF.InAQueryManagerProvider.prototype.exportPublicVersionEdit = function(
			planningExtension) {
		var planningModel;
		var versionList;
		var versions;
		var versionsSize;
		var j;
		var version;
		var sourceVersionName;
		if (this.getPlanningMode() !== oFF.PlanningMode.FORCE_PLANNING) {
			return;
		}
		planningModel = this.getPlanningModel();
		if (oFF.isNull(planningModel)
				|| !planningModel.supportsPublicVersionEdit()
				|| !planningModel.isPublicVersionEditInProgress()) {
			return;
		}
		versionList = planningExtension.putNewList("RefreshVersionStates");
		versions = planningModel.getVersions();
		versionsSize = versions.size();
		for (j = 0; j < versionsSize; j++) {
			version = versions.get(j);
			sourceVersionName = version.getSourceVersionName();
			if (version.isShowingAsPublicVersion()
					&& oFF.XStringUtils.isNotNullAndNotEmpty(sourceVersionName)) {
				versionList.addString(sourceVersionName);
				version.setShowingAsPublicVersion(false);
				version.setSourceVersionName(null);
			}
		}
		planningModel.setPublicVersionEditInProgress(false);
	};
	oFF.InAQueryManagerProvider.prototype.exportPlanningVersionRestriction = function(
			planningExtension) {
		var versionRestriction = this.getPlanningVersionRestrictionEffective();
		var isVersionRestricted;
		if (versionRestriction === oFF.PlanningVersionRestrictionType.SERVER_DEFAULT) {
			return;
		}
		isVersionRestricted = versionRestriction === oFF.PlanningVersionRestrictionType.ONLY_PRIVATE_VERSIONS;
		planningExtension.putBoolean("RestrictToPrivateVersions",
				isVersionRestricted);
	};
	oFF.InAQueryManagerProvider.prototype.exportPlanningVersionSettings = function(
			planningExtension) {
		var allVersionSettings = this
				.getAllPlanningActionSequenceSettingsEffective();
		var versionsList;
		var versionRestriction;
		var allVersionSettingsSize;
		var i;
		var sequenceSettings;
		var hasActionSequence;
		var versionStructure;
		var versionId;
		if (oFF.isNull(allVersionSettings)) {
			return;
		}
		versionsList = null;
		versionRestriction = this.getPlanningVersionRestrictionEffective();
		allVersionSettingsSize = allVersionSettings.size();
		for (i = 0; i < allVersionSettingsSize; i++) {
			sequenceSettings = allVersionSettings.get(i);
			hasActionSequence = sequenceSettings.getActionSequenceId() !== null;
			if (!hasActionSequence) {
				if (versionRestriction !== oFF.PlanningVersionRestrictionType.ONLY_PRIVATE_VERSIONS) {
					continue;
				}
				if (!sequenceSettings.getIsRestrictionEnabled()) {
					continue;
				}
			}
			if (oFF.isNull(versionsList)) {
				versionsList = planningExtension.putNewList("Versions");
			}
			versionStructure = versionsList.addNewStructure();
			versionStructure.putBoolean("UseExternalView", sequenceSettings
					.getUseExternalView());
			versionId = sequenceSettings.getVersionId();
			if (versionId === -1) {
				versionStructure.putString("Version", sequenceSettings
						.getVersionUniqueName());
			} else {
				versionStructure.putInteger("Version", versionId);
			}
			if (hasActionSequence) {
				versionStructure.putString("SequenceId", sequenceSettings
						.getActionSequenceId());
			}
			if (sequenceSettings.isSharedVersion()) {
				versionStructure.putString("Owner", sequenceSettings
						.getVersionOwner());
			}
		}
	};
	oFF.InAQueryManagerProvider.prototype.exportPlanningVersionAliases = function(
			planningExtension) {
		var versionAliases = this.getVersionAliases();
		var aliasMapping;
		var keys;
		var len;
		var i;
		var aliasName;
		var versionName;
		var mapping;
		if (!oFF.XCollectionUtils.hasElements(versionAliases)) {
			return;
		}
		aliasMapping = planningExtension.putNewList("AliasMapping");
		keys = versionAliases.getKeysAsReadOnlyListOfString();
		keys.sortByDirection(oFF.XSortDirection.ASCENDING);
		len = keys.size();
		for (i = 0; i < len; i++) {
			aliasName = keys.get(i);
			versionName = versionAliases.getByKey(aliasName);
			mapping = oFF.PrFactory.createStructure();
			mapping.putString("Alias", aliasName);
			mapping.putString("Version", versionName);
			aliasMapping.add(mapping);
		}
	};
	oFF.InAQueryManagerProvider.prototype.exportDataEntryDescription = function(
			planningExtension) {
		var resultSetContainer = this.getActiveResultSetContainer();
		var dataEntryCollection;
		var dataCellEntryDescription;
		if (oFF.isNull(resultSetContainer)) {
			return;
		}
		if (!resultSetContainer.hasDataEntryCollection()) {
			return;
		}
		dataEntryCollection = resultSetContainer.getDataEntryCollection();
		if (!dataEntryCollection.hasChangedDataEntries()) {
			return;
		}
		dataCellEntryDescription = dataEntryCollection
				.getDataCellEntryDescription();
		if (oFF.XStringUtils.isNullOrEmpty(dataCellEntryDescription)) {
			return;
		}
		planningExtension.putString("ActionDescription",
				dataCellEntryDescription);
	};
	oFF.InAQueryManagerProvider.prototype.createResultSetProvider = function(
			procedure, structure) {
		oFF.XBooleanUtils.checkTrue(this.m_useEncodedRs,
				"Only encoded resultset is supported");
		if (this.m_isForValueHelp) {
			return oFF.InARsEnProvider.create(this, procedure, structure,
					oFF.QContextType.SELECTOR);
		}
		return oFF.InARsEnProvider.create(this, procedure, structure,
				oFF.QContextType.RESULT_SET);
	};
	oFF.InAQueryManagerProvider.prototype.setInnerStructure = function(
			requestStructure, name, processingDirective) {
		var dataAreas = this.getDataAreas();
		var innerRequestStructure;
		var queryModel;
		var queryServiceConfig;
		var expandList;
		var localSystemDescription;
		var inaDatasource;
		var exportActiveMainCapabilities;
		var protocolCapabilities;
		if (oFF.notNull(dataAreas)) {
			requestStructure.put("DataAreas", dataAreas);
		}
		this.fillOptions(requestStructure);
		innerRequestStructure = requestStructure.putNewStructure(name);
		queryModel = this.getQueryModel();
		queryServiceConfig = this.getQueryServiceConfig();
		if (oFF.XString.isEqual("Metadata", name)) {
			oFF.QInAMdDataSource.exportMd(this.m_exportData,
					innerRequestStructure, queryModel);
			if (queryServiceConfig.getMinimizedMetadata()
					&& !oFF.XCollectionUtils.hasElements(queryServiceConfig
							.getRequiredDimensions())) {
				this.addEmptyExpand(innerRequestStructure);
			} else {
				if (oFF.XCollectionUtils.hasElements(queryServiceConfig
						.getRequiredDimensions())) {
					innerRequestStructure.putIfNotNull("Expand", this
							.addListOfDimensions(queryServiceConfig, true));
				} else {
					if (oFF.XCollectionUtils.hasElements(queryServiceConfig
							.getDimensionsOnAxes())) {
						innerRequestStructure.putIfNotNull("Expand", this
								.specifyAxes(queryServiceConfig, true));
					}
				}
			}
			if (innerRequestStructure.getByKey("Expand") === null) {
				expandList = oFF.PrFactory.createList();
				expandList.addString("Cube");
				innerRequestStructure.put("Expand", expandList);
			}
		} else {
			if (this.isPersistedPreQuery()) {
				localSystemDescription = this.getConnection()
						.getSystemDescription();
				oFF.QInADataSourceBlending.updateRemoteDataSource(
						innerRequestStructure, this, true,
						localSystemDescription);
			} else {
				inaDatasource = this.m_exportData
						.exportDataSource(
								queryModel.getDataSource(),
								this
										.supportsAnalyticCapabilityActive(oFF.InACapabilities.RUN_AS_USER));
				innerRequestStructure.put("DataSource", inaDatasource);
			}
			if (oFF.XString.isEqual(processingDirective, "VariableSubmit")) {
				if (this.getNoVariableSubmitResponse()) {
					this.addEmptyExpand(innerRequestStructure);
				} else {
					if (oFF.XCollectionUtils.hasElements(queryServiceConfig
							.getRequiredDimensions())) {
						innerRequestStructure.putIfNotNull("Expand", this
								.addListOfDimensions(queryServiceConfig, true));
					} else {
						if (oFF.XCollectionUtils.hasElements(queryServiceConfig
								.getDimensionsOnAxes())) {
							innerRequestStructure.putIfNotNull("Expand", this
									.specifyAxes(queryServiceConfig, false));
						}
					}
				}
			}
		}
		exportActiveMainCapabilities = this.m_inaCapabilities
				.exportActiveMainCapabilitiesAsList();
		protocolCapabilities = queryModel.getProtocolCapabilities();
		exportActiveMainCapabilities = oFF.QInAExportUtil.extendList(
				protocolCapabilities, exportActiveMainCapabilities);
		if (oFF.notNull(exportActiveMainCapabilities)) {
			innerRequestStructure.put("Capabilities",
					exportActiveMainCapabilities);
		}
		this.setLanguage(innerRequestStructure);
		return innerRequestStructure;
	};
	oFF.InAQueryManagerProvider.prototype.isPersistedPreQuery = function() {
		return this.getPreQueryName() !== null
				&& this.getResultSetPersistenceIdentifier() !== null;
	};
	oFF.InAQueryManagerProvider.prototype.addListOfDimensions = function(
			queryServiceConfig, needVariablesInResponse) {
		if (this.getCapabilitiesBase().supportsDetailedResponseExpansion()) {
			return this.createExpandStructure(needVariablesInResponse,
					"Dimensions?Name", queryServiceConfig
							.getRequiredDimensions());
		}
		return null;
	};
	oFF.InAQueryManagerProvider.prototype.specifyAxes = function(
			queryServiceConfig, metadataCall) {
		if (this.getCapabilitiesBase().supportsExpandQueryAxis()
				&& this.getCapabilitiesBase()
						.supportsDetailedResponseExpansion()) {
			return this.createExpandStructure(metadataCall, "Axis?Name",
					queryServiceConfig.getDimensionsOnAxes());
		}
		return null;
	};
	oFF.InAQueryManagerProvider.prototype.createExpandStructure = function(
			needVariablesInResponse, dimensionOrAxis, requiredList) {
		var expandDetails = oFF.PrFactory.createList();
		var iterator;
		requiredList.sortByDirection(oFF.XSortDirection.ASCENDING);
		iterator = requiredList.getIterator();
		while (iterator.hasNext()) {
			expandDetails.addString(oFF.XStringUtils.concatenate3(
					dimensionOrAxis, "=", iterator.next()));
		}
		if (needVariablesInResponse) {
			expandDetails.addString("Variables");
			expandDetails.addString("Sort");
			expandDetails.addString("DynamicFilter");
			expandDetails.addString("QueryDataCells");
			expandDetails.addString("UniversalDisplayHierarchies");
		}
		return expandDetails;
	};
	oFF.InAQueryManagerProvider.prototype.addEmptyExpand = function(
			innerRequestStructure) {
		if (this.getCapabilitiesBase().supportsDetailedResponseExpansion()) {
			innerRequestStructure.putString("Expand", "#");
		}
	};
	oFF.InAQueryManagerProvider.prototype.processRriTargetSync = function(
			syncType, identifier) {
		return oFF.InAQRriTargetsSyncAction.createAndRun(syncType, this,
				identifier);
	};
	oFF.InAQueryManagerProvider.prototype.fillOptions = function(
			requestStructure) {
		var options = oFF.PrFactory.createList();
		var serverCustomizations;
		if (this.getMainCapabilities().containsKey(
				oFF.InACapabilities.STATEFUL_SERVER)) {
			options.addString("StatefulServer");
		}
		serverCustomizations = this.getServerCustomizations();
		options.addAllStrings(serverCustomizations
				.getValuesAsReadOnlyListOfString());
		if (this.getApplication().getVersion() < oFF.XVersion.V96_NO_EMPTY_OPTIONS
				|| options.hasElements()) {
			requestStructure.put("Options", options);
		}
	};
	oFF.InAQueryManagerProvider.prototype.getDeserializationStructure = function() {
		return this.m_deserializationStructure;
	};
	oFF.InAQueryManagerProvider.prototype.setDeserializationStructureAsNull = function() {
		this.m_deserializationStructure = null;
	};
	oFF.InAQueryManagerProvider.prototype.getDeserializationImporter = function() {
		return this.m_importer;
	};
	oFF.InAQueryManagerProvider.prototype.processSpatialClustering = function(
			clusterSettings, syncType, listener, customIdentifier) {
		var clusterField;
		var request;
		var rsDefQueryModel;
		var resultSetManager;
		if (!this.getQueryModel().supportsSpatialClustering()) {
			return oFF.ExtResult
					.createWithErrorMessage("Spatial Clustering is not supported by the backend!");
		}
		if (oFF.isNull(clusterSettings)) {
			return oFF.ExtResult
					.createWithErrorMessage("The cluster settings must not be null!");
		}
		clusterField = clusterSettings.getClusterField();
		if (oFF.isNull(clusterField)) {
			return oFF.ExtResult
					.createWithErrorMessage("The cluster field must not be null!");
		}
		request = oFF.QInASpatialClustering.exportSpatialClusteringRequest(
				this.m_exportData, clusterSettings);
		this.setMiscRequest(request);
		rsDefQueryModel = oFF.RsDefQueryModel.create(this, clusterField
				.getDimension());
		resultSetManager = oFF.ResultSetContainer.createWithRequest(this, this,
				request, rsDefQueryModel);
		return resultSetManager.processExecution(syncType, listener,
				customIdentifier);
	};
	oFF.InAQueryManagerProvider.prototype.lazyLoadValueHelpObjects = function() {
		var iter;
		var key;
		if (oFF.isNull(this.m_exportValueHelp)) {
			this.m_exportValueHelp = oFF.QInAExportFactory.createForValueHelp(
					this.getApplication(), this.getMainCapabilities());
			this.m_valuehelpCallbacks = oFF.XHashMapByString.create();
			this.m_valuehelpResults = oFF.XHashMapByString.create();
			this.m_valuehelpIdentifiers = oFF.XHashMapByString.create();
			this.m_valuehelpProcessedKeys = oFF.XHashSetOfString.create();
		}
		iter = this.m_valuehelpProcessedKeys.getIterator();
		while (iter.hasNext()) {
			key = iter.next();
			this.m_valuehelpResults.remove(key);
			this.m_valuehelpCallbacks.remove(key);
			this.m_valuehelpIdentifiers.remove(key);
		}
		this.m_valuehelpProcessedKeys.clear();
	};
	oFF.InAQueryManagerProvider.prototype.processMemberHelp = function(
			dimension, syncType, listener, customIdentifier) {
		var listenerDecorator = oFF.ValueHelpListenerDecorator.create(listener);
		this.processValueHelp(dimension, syncType, listenerDecorator,
				customIdentifier);
		return listenerDecorator.getResult();
	};
	oFF.InAQueryManagerProvider.prototype.processValueHelp = function(
			dimension, syncType, listener, customIdentifier) {
		var request;
		this.lazyLoadValueHelpObjects();
		request = this.m_exportValueHelp.exportMemberHelpRequest(this
				.getQueryModel(), dimension);
		return this.internalProcessValueHelp(dimension, syncType, listener,
				customIdentifier, request);
	};
	oFF.InAQueryManagerProvider.prototype.processVariablehelp = function(
			dimension, variable, syncType, listener, customIdentifier) {
		var listenerDecorator = oFF.ValueHelpListenerDecorator.create(listener);
		this.processVarHelp(dimension, variable, syncType, listenerDecorator,
				customIdentifier);
		return listenerDecorator.getResult();
	};
	oFF.InAQueryManagerProvider.prototype.processVarHelp = function(dimension,
			variable, syncType, listener, customIdentifier) {
		var request;
		this.lazyLoadValueHelpObjects();
		request = this.m_exportValueHelp.exportVariableHelpRequest(this
				.getQueryModel(), dimension, variable);
		return this.internalProcessValueHelp(dimension, syncType, listener,
				customIdentifier, request);
	};
	oFF.InAQueryManagerProvider.prototype.internalProcessValueHelp = function(
			dimension, syncType, listener, customIdentifier, request) {
		var key;
		var rsDefQueryModel;
		var resultSetManager;
		this.setMiscRequest(request);
		this.m_valuehelpIdentifier++;
		key = oFF.XInteger.convertToString(this.m_valuehelpIdentifier);
		this.m_valuehelpCallbacks.put(key, listener);
		this.m_valuehelpIdentifiers.put(key, customIdentifier);
		rsDefQueryModel = oFF.RsDefQueryModel.create(this, dimension);
		this.m_isForValueHelp = true;
		resultSetManager = oFF.ResultSetContainer.createWithRequest(this, this,
				request, rsDefQueryModel);
		resultSetManager.setOffsetRows(dimension.getSelectorPagingStart());
		resultSetManager.setMaxRows(dimension.getSelectorPagingEnd()
				- dimension.getSelectorPagingStart());
		resultSetManager.processExecution(syncType, this, oFF.XIntegerValue
				.create(this.m_valuehelpIdentifier));
		if (!this.isReleased()) {
			this.m_isForValueHelp = false;
			return this.m_valuehelpResults.getByKey(key);
		}
		return null;
	};
	oFF.InAQueryManagerProvider.prototype.transform = function(extResult) {
		var data;
		var cursorResultSet;
		var profileTransform;
		var parentIndices;
		var nodes;
		var cursorRowsAxis;
		var tupleElement;
		var dimensionMemberName;
		var dimension;
		var member;
		var fieldValue;
		var field;
		var value;
		var stringValue;
		var sizeNodes;
		var idxNode;
		var parentIdx;
		var parentNode;
		if (extResult.hasErrors()) {
			return oFF.ExtResult.create(null, extResult);
		}
		data = extResult.getData();
		if (oFF.isNull(data) || data.hasErrors()) {
			return oFF.ExtResult.create(null, extResult);
		}
		cursorResultSet = data.getCursorResultSet();
		if (cursorResultSet.hasErrors()
				|| cursorResultSet.getState() === oFF.ResultSetState.ERROR) {
			return oFF.ExtResult.create(null, extResult);
		}
		profileTransform = oFF.ProfileNode.create("ValueHelp", 0);
		profileTransform.addProfileStep("Transforming ResultSet to List");
		parentIndices = oFF.XList.create();
		nodes = oFF.XList.create();
		cursorRowsAxis = cursorResultSet.getCursorRowsAxis();
		while (cursorRowsAxis.hasNextTuple()) {
			cursorRowsAxis.nextTuple();
			while (cursorRowsAxis.hasNextTupleElement()) {
				tupleElement = cursorRowsAxis.nextTupleElement();
				dimensionMemberName = tupleElement.getDimensionMemberName();
				dimension = tupleElement
						.getDimensionAtCurrentPositionFromQueryModel();
				member = dimension.getDimensionMemberWithFormat(
						dimensionMemberName, null);
				member.setName(dimensionMemberName);
				member.setDimensionMemberNameValueException(tupleElement
						.getDimensionMemberNameValueException());
				while (cursorRowsAxis.hasNextFieldValue()) {
					fieldValue = cursorRowsAxis.nextFieldValue();
					field = fieldValue.getField();
					value = fieldValue.getValue();
					member.createAndAddFieldWithValue(field, value);
					if (oFF.notNull(value)) {
						stringValue = value.toString();
						if (field.isEqualTo(dimension.getSelectorTextField())) {
							member.setText(stringValue);
						} else {
							if (field
									.isEqualTo(dimension.getSelectorKeyField())) {
								member.setName(stringValue);
							}
						}
					}
				}
				parentIndices.add(oFF.XIntegerValue.create(tupleElement
						.getParentNodeIndex()));
				nodes.add(oFF.QValueHelpNode2.createValueHelpNode(member
						.getName(), member, tupleElement.getDrillState(),
						tupleElement.getDisplayLevel(), tupleElement
								.getChildCount(), tupleElement
								.getAbsoluteLevel()));
			}
		}
		profileTransform.addProfileStep("Assign parent nodes");
		sizeNodes = nodes.size();
		for (idxNode = 0; idxNode < sizeNodes; idxNode++) {
			parentIdx = parentIndices.get(idxNode).getInteger();
			if (parentIdx >= 0) {
				parentNode = nodes.get(parentIdx);
				parentNode.addChildNode(nodes.get(idxNode));
			}
		}
		oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(parentIndices);
		profileTransform.endProfileStep();
		extResult.getRootProfileNode().addProfileNode(profileTransform);
		return oFF.ExtResult.create(nodes, extResult);
	};
	oFF.InAQueryManagerProvider.prototype.onQueryExecuted = function(extResult,
			resultSetContainer, customIdentifier) {
		var newExtResult = this.transform(extResult);
		var key = customIdentifier.toString();
		var realCallback;
		var realIdentifier;
		this.m_valuehelpResults.put(key, newExtResult);
		realCallback = this.m_valuehelpCallbacks.getByKey(key);
		this.m_valuehelpProcessedKeys.add(key);
		if (oFF.notNull(realCallback)) {
			realIdentifier = this.m_valuehelpIdentifiers.getByKey(key);
			realCallback.onValuehelpExecuted(newExtResult, resultSetContainer,
					realIdentifier);
		}
	};
	oFF.InAQueryManagerProvider.prototype.getInaCapabilities = function() {
		return this.m_inaCapabilities;
	};
	oFF.InAQueryManagerProvider.prototype.useEncodedRs = function() {
		return this.m_useEncodedRs;
	};
	oFF.InAQueryManagerProvider.prototype.setUseEncodedRs = function(
			useEncodedRs) {
		this.m_useEncodedRs = useEncodedRs;
	};
	oFF.InAQueryManagerProvider.prototype.getProviderTypeProx = function() {
		return this.getProviderType();
	};
	oFF.InAQueryManagerProvider.prototype.getResultSetProviderFactory = function() {
		return this;
	};
	oFF.InAQueryManagerProvider.prototype.importVariables = oFF.noSupport;
	oFF.InAQueryManagerProvider.prototype.exportVariables = function(
			variablesContext, parentStructure) {
		this.m_exportData.exportVariables(variablesContext, parentStructure);
	};
	oFF.InAQueryManagerProvider.prototype.setIsMetadataCached = function(
			isMetadataCached) {
		this.m_isMetadataCached = isMetadataCached;
	};
	oFF.InAQueryManagerProvider.prototype.isMetadataCached = function() {
		return this.m_isMetadataCached;
	};
	oFF.InAQueryManagerProvider.prototype.assertNotDirectValueTransfer = function() {
		if (this.isDirectVariableTransferEnabled()) {
			throw oFF.XException
					.createIllegalStateException("stateful variable handling cannot be mixed with direct variable transfer");
		}
	};
	oFF.InAQueryManagerProvider.prototype.processRetrieveVariableRuntimeInformation = function(
			syncType, listener, customIdentifier) {
		this.assertNotDirectValueTransfer();
		return oFF.InAQMgrVarAction.createAndRunGetRuntimeInfo(this, syncType,
				listener, customIdentifier);
	};
	oFF.InAQueryManagerProvider.prototype.processSetGetVariableValues = function(
			syncType, listener, customIdentifier) {
		this.assertNotDirectValueTransfer();
		return oFF.InAQMgrVarAction.createAndRunSetGetValues(this, syncType,
				listener, customIdentifier);
	};
	oFF.InAQueryManagerProvider.prototype.processEmptyVariableDefinition = function(
			syncType, listener, customIdentifier) {
		this.assertNotDirectValueTransfer();
		return oFF.InAQMgrVarAction.createAndRunEmptyVariableDefinition(this,
				syncType, listener, customIdentifier);
	};
	oFF.InAQueryManagerProvider.prototype.processVariableSubmit = function(
			syncType, listener, customIdentifier) {
		if (this.isDirectVariableTransferEnabled()) {
			return oFF.InAQMgrVarImmediateSuccess.create(this, syncType,
					listener, customIdentifier);
		}
		return oFF.InAQMgrVarAction.createAndRunSubmit(this, syncType,
				listener, customIdentifier);
	};
	oFF.InAQueryManagerProvider.prototype.processReInitVariableAfterSubmit = function(
			syncType, listener, customIdentifier) {
		if (this.isDirectVariableTransferEnabled()) {
			return oFF.InAQMgrVarImmediateSuccess.create(this, syncType,
					listener, customIdentifier);
		}
		return oFF.InAQMgrVarAction.createAndRunReInitAfterSubmit(this,
				syncType, listener, customIdentifier);
	};
	oFF.InAQueryManagerProvider.prototype.processVariableCancel = function(
			syncType, listener, customIdentifier) {
		if (this.isDirectVariableTransferEnabled()) {
			return oFF.InAQMgrVarImmediateSuccess.create(this, syncType,
					listener, customIdentifier);
		}
		return oFF.InAQMgrVarAction.createAndRunCancel(this, syncType,
				listener, customIdentifier);
	};
	oFF.InAQueryManagerProvider.prototype.processCheckVariables = function(
			syncType, listener, customIdentifier) {
		oFF.XBooleanUtils.checkTrue(this.supportsCheckVariables(),
				"Check variables is not supported");
		return oFF.InAQMgrVarAction.createAndRunCheck(this, syncType, listener,
				customIdentifier);
	};
	oFF.InAQueryManagerProvider.prototype.transferVariables = function(
			syncType, listener, customIdentifier) {
		return this.processSetGetVariableValues(syncType, listener,
				customIdentifier);
	};
	oFF.InAQueryManagerProvider.prototype.emptyVariableDefinition = function(
			syncType, listener, customIdentifier) {
		return this.processEmptyVariableDefinition(syncType, listener,
				customIdentifier);
	};
	oFF.InAQueryManagerProvider.prototype.transferVariablesByVariable = function(
			variable, syncType, listener, customIdentifier) {
		if (this.getVariables().contains(variable)) {
			return this.processSetGetVariableValues(syncType, listener,
					customIdentifier);
		}
		return null;
	};
	oFF.InAQueryManagerProvider.prototype.getVariablesExporter = function() {
		return this.m_exportData;
	};
	oFF.InAQueryManagerProvider.prototype.getVariablesImporter = function() {
		return this.m_importMetaData;
	};
	oFF.InAQueryManagerProvider.prototype.isVariableValuesRuntimeNeeded = function() {
		return this.getSystemType().isTypeOf(oFF.SystemType.BW);
	};
	oFF.InAQueryManagerProvider.prototype.isVariableSubmitNeeded = function() {
		return this.m_isVariableSubmitNeeded;
	};
	oFF.InAQueryManagerProvider.prototype.setIsVariableSubmitNeeded = function(
			submit) {
		this.m_isVariableSubmitNeeded = submit;
	};
	oFF.InAQueryManagerProvider.prototype.isDirectVariableTransfer = function() {
		return this.m_directVariableTransfer;
	};
	oFF.InAQueryManagerProvider.prototype.setDirectVariableTransfer = function(
			directVariableTransfer) {
		this.m_directVariableTransfer = directVariableTransfer;
	};
	oFF.InAQueryManagerProvider.prototype.fillDataRequestStructure = function(
			withVariables) {
		var mode = this.getMode();
		var providerType;
		var context;
		var processingDirective;
		var initSettings;
		if (mode === oFF.QueryManagerMode.DEFAULT
				|| mode === oFF.QueryManagerMode.BLENDING) {
			this.m_lastDataRequest = oFF.PrFactory.createStructure();
			providerType = this.getProviderType();
			if (providerType === oFF.ProviderType.PLANNING) {
				context = "Planning";
			} else {
				if (providerType === oFF.ProviderType.LIST_REPORTING) {
					context = "ListReporting";
				} else {
					context = "Analytics";
				}
			}
			processingDirective = null;
			if (providerType !== oFF.ProviderType.PLANNING
					&& this.getVariableProcessorState() === oFF.VariableProcessorState.VALUE_HELP) {
				processingDirective = "VariableDefinition";
			}
			this.fillAnalyticRequestStructure(this.m_lastDataRequest, context,
					withVariables, processingDirective);
		} else {
			if (mode === oFF.QueryManagerMode.RAW_QUERY) {
				initSettings = this.getInitSettings();
				this.m_lastDataRequest = initSettings.getDataRequest();
				if (oFF.isNull(this.m_lastDataRequest)) {
					if (initSettings.getDefinitionType().isTypeOf(
							oFF.QModelFormat.INA_DATA)) {
						this.m_lastDataRequest = this.getInitSettings()
								.getDefinitionAsStructure();
					}
				}
				this.validateDataRequest();
				this.updateDataRequest();
				if (this.isUpdatingDataRequestCapabilities()) {
					if (this
							.getApplication()
							.getConnection(this.getSystemName())
							.supportsAnalyticCapability(
									oFF.InACapabilities.RESULTSETV2_METADATA_EXTENSION1)) {
						this.m_inaCapabilities
								.getActiveMainCapabilities()
								.addCapability(
										oFF.InACapabilities.RESULTSETV2_METADATA_EXTENSION1);
					}
					this.m_inaCapabilities
							.exportActiveMainCapabilities(this.m_lastDataRequest
									.getStructureByKey("Analytics"));
				}
				this.enableRuntimeVariables();
			} else {
				throw oFF.XException
						.createIllegalStateException("Unknown mode");
			}
		}
		return this.m_lastDataRequest;
	};
	oFF.InAQueryManagerProvider.prototype.updateDataRequest = function() {
		var inaAnalytics = this.m_lastDataRequest
				.getStructureByKey("Analytics");
		var inaDefinition;
		var inaDataSource;
		if (oFF.notNull(inaAnalytics)) {
			inaDefinition = inaAnalytics.getStructureByKey("Definition");
			inaDataSource = inaAnalytics.getStructureByKey("DataSource");
			if (oFF.isNull(inaDataSource)) {
				inaDataSource = inaDefinition.getStructureByKey("DataSource");
			}
			if (oFF.notNull(inaDataSource)) {
				inaDataSource.putString("InstanceId", this.getInstanceId());
			}
			this.setLanguage(inaAnalytics);
			this.fillOptions(this.m_lastDataRequest);
			this.exportReturnedDataSelections(inaDefinition
					.getStructureByKey("ResultSetFeatureRequest"));
		}
	};
	oFF.InAQueryManagerProvider.prototype.enableRuntimeVariables = function() {
		var inaBatch;
		var inaAnalytics;
		var inaDefinition;
		var inaVariables;
		var requestAsSubmit;
		var processingDirectives;
		var inaRoot;
		if (this
				.supportsAnalyticCapabilityActive(oFF.InACapabilities.STATEFUL_SERVER)
				&& this.getMode() === oFF.QueryManagerMode.RAW_QUERY) {
			if (this.getVariableProcessorState() === oFF.VariableProcessorState.SUBMITTED) {
				inaBatch = this.m_lastDataRequest
						.getListByKey(oFF.ConnectionConstants.INA_BATCH);
				if (oFF.notNull(inaBatch)) {
					this.m_lastDataRequest = inaBatch.getStructureAt(1);
				}
			} else {
				inaAnalytics = this.m_lastDataRequest
						.getStructureByKey("Analytics");
				if (oFF.isNull(inaAnalytics)) {
					return;
				}
				inaDefinition = inaAnalytics.getStructureByKey("Definition");
				if (oFF.isNull(inaDefinition)) {
					return;
				}
				inaVariables = inaDefinition.getListByKey("Variables");
				if (oFF.notNull(inaVariables)) {
					requestAsSubmit = oFF.PrUtils
							.createDeepCopy(this.m_lastDataRequest);
					processingDirectives = requestAsSubmit.getStructureByKey(
							"Analytics")
							.putNewStructure("ProcessingDirectives");
					processingDirectives.putString("ProcessingStep",
							"VariableSubmit");
					inaRoot = oFF.PrFactory.createStructure();
					inaBatch = inaRoot
							.putNewList(oFF.ConnectionConstants.INA_BATCH);
					inaBatch.add(requestAsSubmit);
					inaBatch.add(this.m_lastDataRequest);
					this.m_lastDataRequest = inaRoot;
				}
			}
		}
	};
	oFF.InAQueryManagerProvider.prototype.validateDataRequest = function() {
		var inaAnalytics = this.m_lastDataRequest
				.getStructureByKey("Analytics");
		var inaPayload;
		var dataRequest;
		var inaDefinition;
		var inaRsFeatureRequest;
		if (oFF.isNull(inaAnalytics)) {
			inaPayload = oFF.PrFactory.createStructure();
			inaAnalytics = inaPayload.putNewStructure("Analytics");
			inaAnalytics.put("DataSource", this.m_lastDataRequest
					.getStructureByKey("DataSource"));
			dataRequest = oFF.PrUtils.deepCopyElement(this.m_lastDataRequest);
			dataRequest.remove("DataSource");
			dataRequest.put("ResultSetFeatureRequest", this.exportOptions());
			inaAnalytics.put("Definition", dataRequest);
			this.m_lastDataRequest = inaPayload;
		}
		inaDefinition = inaAnalytics.getStructureByKey("Definition");
		if (oFF.notNull(inaDefinition)) {
			inaRsFeatureRequest = inaDefinition
					.getStructureByKey("ResultSetFeatureRequest");
			if (oFF.isNull(inaRsFeatureRequest)) {
				inaRsFeatureRequest = inaDefinition
						.putNewStructure("ResultSetFeatureRequest");
				inaRsFeatureRequest.putString("ResultEncoding", "None");
				inaRsFeatureRequest.putString("ResultFormat", "Version2");
			} else {
				this
						.updateString(inaRsFeatureRequest, "ResultEncoding",
								"None");
				this.updateString(inaRsFeatureRequest, "ResultFormat",
						"Version2");
			}
		}
	};
	oFF.InAQueryManagerProvider.prototype.updateString = function(structure,
			name, value) {
		if (!oFF.XString.isEqual(structure.getStringByKey(name), value)) {
			structure.putString(name, value);
		}
	};
	oFF.InAQueryManagerProvider.prototype.fillAnalyticRequestStructure = function(
			requestStructure, requestName, withVariables, processingDirective) {
		var activeMainCapabilities;
		var query;
		var requestStructureName;
		var innerRequestStructure;
		var exportInAData;
		var hasDataSourceAtService;
		var inaDefinition;
		var inputEnabled;
		var planningExtensionStructure;
		var inaOptions;
		var inaContext;
		var inaProcessingDirective;
		var inaVariableVariant;
		this.addProfileStep("fillAnalyticRequestStructure");
		activeMainCapabilities = this.getMainCapabilities();
		query = this.getQueryModelBase();
		requestStructureName = this.checkRequestStructureName(requestName, this
				.hasNewValues());
		innerRequestStructure = this.setInnerStructure(requestStructure,
				requestStructureName, processingDirective);
		exportInAData = oFF.QInAExportFactory.createForData(this
				.getApplication(), activeMainCapabilities);
		exportInAData.variableProcessingDirective = processingDirective;
		query.setHasProcessingStep(oFF.notNull(processingDirective));
		hasDataSourceAtService = activeMainCapabilities
				.containsKey(oFF.InACapabilities.DATASOURCE_AT_SERVICE);
		inaDefinition = exportInAData.exportQueryModel(query, withVariables,
				!hasDataSourceAtService);
		inaDefinition.putStringNotNull("Name", this.m_preQueryName);
		innerRequestStructure.put("Definition", inaDefinition);
		if (this.supportsDataEntryReadOnly()) {
			inputEnabled = !this.isDataEntryReadOnly();
			inaDefinition.putBoolean("InputEnabled", inputEnabled);
		}
		planningExtensionStructure = oFF.PrFactory.createStructure();
		oFF.QInAExportUtil.setNameIfNotNull(planningExtensionStructure,
				"PlanningMode", this.getPlanningModeEffective());
		this.exportPlanningVersionRestriction(planningExtensionStructure);
		this.exportPlanningVersionSettings(planningExtensionStructure);
		this.exportPlanningVersionAliases(planningExtensionStructure);
		this.exportDataEntryDescription(planningExtensionStructure);
		this.exportNewValues(inaDefinition, planningExtensionStructure);
		this.exportNewLines(inaDefinition);
		if (planningExtensionStructure.hasElements()) {
			inaDefinition.put("PlanningExtensions", planningExtensionStructure);
		}
		this.addAllMessages(exportInAData);
		this.endProfileStep();
		if (this.isPersistedPreQuery()) {
			inaDefinition.put("ResultSetFeatureRequest",
					oFF.QInADataSourceBlending.exportResultSetFeatures(query,
							false));
		} else {
			inaOptions = this.exportOptions();
			this.exportReturnedDataSelections(inaOptions);
			inaDefinition.put("ResultSetFeatureRequest", inaOptions);
		}
		if (oFF.notNull(processingDirective)) {
			inaContext = requestStructure
					.getStructureByKey(requestStructureName);
			inaProcessingDirective = inaContext
					.putNewStructure("ProcessingDirectives");
			inaProcessingDirective.putString("ProcessingStep",
					processingDirective);
			if (oFF.notNull(this.m_activeVariant)
					&& oFF.XString.isEqual(processingDirective,
							"VariableDefinition")) {
				inaVariableVariant = inaDefinition
						.putNewStructure("VariableVariant");
				inaVariableVariant.putString("Name", this.m_activeVariant
						.getName());
				inaVariableVariant.putString("Type", this.m_activeVariant
						.getVariableVariantType().getName());
				inaVariableVariant.putString("Scope", this.m_activeVariant
						.getScope().getName());
			}
		}
		this.exportOptimizerHints(inaDefinition, query);
		oFF.QInAClientInfo
				.exportClientInfo(
						requestStructure,
						this.getApplication(),
						this
								.supportsAnalyticCapabilityActive(oFF.InAConstantsBios.QY_CLIENT_INFO));
	};
	oFF.InAQueryManagerProvider.prototype.exportOptions = function() {
		var inaOptions = oFF.PrFactory.createStructure();
		var resultSetContainer;
		var dataRefreshEnabled;
		var hasSchemaAndTable;
		var queryModel;
		inaOptions.putBoolean("UseDefaultAttributeKey", false);
		resultSetContainer = this.getActiveResultSetContainer();
		if (resultSetContainer.getMaxResultRecords() !== -1) {
			inaOptions.putLong("MaxResultRecords", resultSetContainer
					.getMaxResultRecords());
		}
		dataRefreshEnabled = resultSetContainer.getDataRefreshEnabled();
		if (dataRefreshEnabled === oFF.ActionChoice.ON
				|| dataRefreshEnabled === oFF.ActionChoice.ONCE) {
			inaOptions.putBoolean("Refresh", true);
		}
		hasSchemaAndTable = false;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(resultSetContainer
				.getResultSetPersistenceTable())) {
			inaOptions.putString("ResultSetPersistanceTable",
					resultSetContainer.getResultSetPersistenceTable());
			if (oFF.XStringUtils.isNotNullAndNotEmpty(resultSetContainer
					.getResultSetPersistenceSchema())) {
				inaOptions.putString("ResultSetPersistanceSchema",
						resultSetContainer.getResultSetPersistenceSchema());
				hasSchemaAndTable = true;
			}
		}
		if (!resultSetContainer.isResultSetTransportEnabled()) {
			inaOptions.putBoolean("ReturnEmptyJsonResultSet", true);
		}
		this.fillPaging(inaOptions);
		if (this.getExecuteRequestOnOldResultSet()) {
			inaOptions.putBoolean("ExecuteRequestOnOldResultSet", true);
		}
		if (this.m_includePerformanceData !== oFF.TriStateBool._DEFAULT
				&& this.getApplication().getVersion() >= oFF.XVersion.V114_DONT_REQUEST_PERFORMANCE_DATA_BY_DEFAULT) {
			inaOptions.putBoolean("IncludePerformanceData",
					this.m_includePerformanceData.getBoolean());
		}
		if (this.m_useEncodedRs) {
			inaOptions.putString("ResultFormat", "Version2");
			inaOptions.putString("ResultEncoding", "None");
			if (resultSetContainer.getResultSetPersistenceIdentifier() !== null) {
				if (!resultSetContainer.isRemotePreQuery()) {
					inaOptions.putBoolean("IsCubeBlendingSubquery", true);
				}
				if (this.isCubeCacheQuery()) {
					inaOptions.putString("ResultSetPersistanceIdentifier",
							resultSetContainer
									.getResultSetPersistenceIdentifier());
				} else {
					inaOptions.putString("ResultFormat", "SerializedData");
					if (hasSchemaAndTable) {
						inaOptions.putString("ResultSetPersistanceIdentifier",
								resultSetContainer
										.getResultSetPersistenceIdentifier());
					}
				}
			}
		}
		queryModel = this.getQueryModel();
		if (oFF.notNull(queryModel) && queryModel.supportsKeepOriginalTexts()) {
			inaOptions.putBoolean("ResultKeepOriginalTexts", queryModel
					.isKeepingOriginalTexts());
		}
		return inaOptions;
	};
	oFF.InAQueryManagerProvider.prototype.isCubeCacheQuery = function() {
		var queryModel = this.getQueryModel();
		var hints = queryModel
				.getOptimizerHintsByExecutionEngine(oFF.ExecutionEngine.MDS);
		return oFF.notNull(hints) && hints.containsKey("cube_cache_with_id");
	};
	oFF.InAQueryManagerProvider.prototype.getPlanningModeEffective = function() {
		var currentSystemtype;
		var planningMode;
		if (!this.isDataEntryEnabled()) {
			return null;
		}
		currentSystemtype = this.getSystemType();
		if (!currentSystemtype.isTypeOf(oFF.SystemType.HANA)) {
			return null;
		}
		planningMode = this.getPlanningMode();
		if (planningMode === oFF.PlanningMode.SERVER_DEFAULT) {
			return null;
		}
		if (oFF.isNull(planningMode)) {
			return oFF.PlanningMode.DISABLE_PLANNING;
		}
		return planningMode;
	};
	oFF.InAQueryManagerProvider.prototype.getPlanningVersionRestrictionEffective = function() {
		var currentSystemtype;
		var settingsMode;
		var planningRestriction;
		if (!this.isDataEntryEnabled()) {
			return oFF.PlanningVersionRestrictionType.SERVER_DEFAULT;
		}
		currentSystemtype = this.getSystemType();
		if (!currentSystemtype.isTypeOf(oFF.SystemType.HANA)) {
			return oFF.PlanningVersionRestrictionType.SERVER_DEFAULT;
		}
		settingsMode = this.getPlanningVersionSettingsMode();
		if (settingsMode === oFF.PlanningVersionSettingsMode.SERVER_DEFAULT) {
			return oFF.PlanningVersionRestrictionType.SERVER_DEFAULT;
		}
		planningRestriction = this.getPlanningRestriction();
		if (oFF.isNull(planningRestriction)) {
			return oFF.PlanningVersionRestrictionType.SERVER_DEFAULT;
		}
		return planningRestriction;
	};
	oFF.InAQueryManagerProvider.prototype.getPlanningActionSequenceSettingsModeEffective = function() {
		var currentSystemtype;
		var settingsMode;
		if (!this.isDataEntryEnabled()) {
			return null;
		}
		currentSystemtype = this.getSystemType();
		if (!currentSystemtype.isTypeOf(oFF.SystemType.HANA)) {
			return null;
		}
		settingsMode = this.getPlanningVersionSettingsMode();
		if (settingsMode === oFF.PlanningVersionSettingsMode.SERVER_DEFAULT) {
			return null;
		}
		return settingsMode;
	};
	oFF.InAQueryManagerProvider.prototype.getAllPlanningActionSequenceSettingsEffective = function() {
		var settingsMode = this
				.getPlanningActionSequenceSettingsModeEffective();
		var allSettings;
		var planningService;
		var planningModel;
		var allVersions;
		var versionsSettings;
		var allVersionsSize;
		var i;
		var version;
		var settingsMap;
		var allSettingsSize;
		var j;
		var settings;
		var keys;
		var result;
		var keysSize;
		var k;
		if (oFF.isNull(settingsMode)) {
			return null;
		}
		allSettings = null;
		if (settingsMode === oFF.PlanningVersionSettingsMode.PLANNING_SERVICE) {
			planningService = oFF.PlanningModelUtil
					.getPlanningServiceFromQueryDataSource(this
							.getApplication(), this.getSystemName(), this
							.getDataSource());
			if (oFF.notNull(planningService)) {
				planningModel = planningService.getPlanningContext();
				allVersions = planningModel.getAllVersions();
				if (oFF.XCollectionUtils.hasElements(allVersions)) {
					versionsSettings = oFF.XList.create();
					allVersionsSize = allVersions.size();
					for (i = 0; i < allVersionsSize; i++) {
						version = allVersions.get(i);
						versionsSettings.add(version);
					}
					allSettings = versionsSettings;
				}
			}
		} else {
			if (settingsMode === oFF.PlanningVersionSettingsMode.QUERY_SERVICE) {
				allSettings = this.getAllPlanningVersionSettings();
			}
		}
		if (!oFF.XCollectionUtils.hasElements(allSettings)) {
			return null;
		}
		settingsMap = oFF.XHashMapByString.create();
		allSettingsSize = allSettings.size();
		for (j = 0; j < allSettingsSize; j++) {
			settings = allSettings.get(j);
			settingsMap.put(settings.getVersionUniqueName(), settings
					.createVersionSettings());
		}
		if (!oFF.XCollectionUtils.hasElements(settingsMap)) {
			return null;
		}
		keys = oFF.XListOfString.createFromReadOnlyList(settingsMap
				.getKeysAsReadOnlyListOfString());
		keys.sortByDirection(oFF.XSortDirection.ASCENDING);
		result = oFF.XList.create();
		keysSize = keys.size();
		for (k = 0; k < keysSize; k++) {
			result.add(settingsMap.getByKey(keys.get(k)));
		}
		return result;
	};
	oFF.InAQueryManagerProvider.prototype.fillPaging = function(inaOptions) {
		var resultSetContainer = this.getActiveResultSetContainer();
		var subSetDescription = inaOptions.putNewStructure("SubSetDescription");
		var maxRows = resultSetContainer.getMaxRows();
		var offsetRows = resultSetContainer.getOffsetRows();
		var maxColumns;
		var offsetColumns;
		subSetDescription.putInteger("RowFrom", offsetRows);
		if (maxRows === -1) {
			subSetDescription.putInteger("RowTo", -1);
		} else {
			subSetDescription.putInteger("RowTo", offsetRows + maxRows);
		}
		maxColumns = resultSetContainer.getMaxColumns();
		offsetColumns = resultSetContainer.getOffsetColumns();
		subSetDescription.putInteger("ColumnFrom", offsetColumns);
		if (maxColumns === -1) {
			subSetDescription.putInteger("ColumnTo", -1);
		} else {
			subSetDescription
					.putInteger("ColumnTo", offsetColumns + maxColumns);
		}
		if (resultSetContainer.isKeyfigureCalculationSuppressed()) {
			inaOptions.putBoolean("SuppressKeyfigureCalculation", true);
		}
	};
	oFF.InAQueryManagerProvider.prototype.exportReturnedDataSelections = function(
			inaOptions) {
		var inaReturnedDataSelection;
		var itActive;
		var itInactive;
		if (!this.supportsReturnedDataSelection()) {
			return;
		}
		inaReturnedDataSelection = inaOptions
				.putNewStructure("ReturnedDataSelection");
		itActive = this.getAllEnabledReturnedDataSelections().getIterator();
		while (itActive.hasNext()) {
			inaReturnedDataSelection.putBoolean(itActive.next(), true);
		}
		oFF.XObjectExt.release(itActive);
		itInactive = this.getAllDisabledReturnedDataSelections().getIterator();
		while (itInactive.hasNext()) {
			inaReturnedDataSelection.putBoolean(itInactive.next(), false);
		}
		oFF.XObjectExt.release(itInactive);
	};
	oFF.InAQueryManagerProvider.prototype.exportOptimizerHints = function(
			inaDefinition, queryModel) {
		var inaOptimizerHints;
		if (!queryModel.supportsCeScenarioParams()) {
			return;
		}
		inaOptimizerHints = oFF.PrFactory.createStructure();
		this.exportOptimizerHintsByEngine(inaOptimizerHints, queryModel,
				oFF.ExecutionEngine.CALC_ENGINE);
		this.exportOptimizerHintsByEngine(inaOptimizerHints, queryModel,
				oFF.ExecutionEngine.MDS);
		this.exportOptimizerHintsByEngine(inaOptimizerHints, queryModel,
				oFF.ExecutionEngine.SQL);
		if (inaOptimizerHints.hasElements()) {
			inaDefinition.put("Hints", inaOptimizerHints);
		}
	};
	oFF.InAQueryManagerProvider.prototype.exportOptimizerHintsByEngine = function(
			inaOptimizerHints, queryModel, engine) {
		var optimizerHints = queryModel
				.getOptimizerHintsByExecutionEngine(engine);
		var sortedList;
		var inaAEngineHints;
		var sortedListSize;
		var i;
		var hintName;
		var inaHint;
		if (oFF.isNull(optimizerHints) || optimizerHints.isEmpty()) {
			return;
		}
		sortedList = optimizerHints.getKeysAsReadOnlyListOfString();
		sortedList.sortByDirection(oFF.XSortDirection.ASCENDING);
		inaAEngineHints = inaOptimizerHints.putNewList(engine.getName());
		sortedListSize = sortedList.size();
		for (i = 0; i < sortedListSize; i++) {
			hintName = sortedList.get(i);
			inaHint = inaAEngineHints.addNewStructure();
			inaHint.putString("Key", hintName);
			inaHint.putString("Value", optimizerHints.getByKey(hintName));
		}
	};
	oFF.InAQueryManagerProvider.prototype.checkRequestStructureName = function(
			requestName, newValues) {
		var systemType;
		if (!oFF.XString.isEqual("Analytics", requestName)) {
			return requestName;
		}
		systemType = this.getSystemType();
		if (oFF.isNull(systemType)) {
			return requestName;
		}
		if (!systemType.isTypeOf(oFF.SystemType.BW)) {
			return requestName;
		}
		if (newValues) {
			return "Planning";
		}
		return requestName;
	};
	oFF.InAQueryManagerProvider.prototype.getVariableMode = function() {
		if (this.isDirectVariableTransfer()) {
			return oFF.VariableMode.DIRECT_VALUE_TRANSFER;
		}
		return oFF.VariableMode.SUBMIT_AND_REINIT;
	};
	oFF.InAQueryManagerProvider.prototype.getMainCapabilities = function() {
		return this.m_inaCapabilities.getActiveMainCapabilities();
	};
	oFF.InAQueryManagerProvider.prototype.hasMoreColumnRecordsAvailable = function() {
		return this.getActiveResultSetContainer()
				.hasMoreColumnRecordsAvailable();
	};
	oFF.InAQueryManagerProvider.prototype.hasMoreRowRecordsAvailable = function() {
		return this.getActiveResultSetContainer().hasMoreRowRecordsAvailable();
	};
	oFF.InAQueryManagerProvider.prototype.getRriTargetManager = function() {
		if (oFF.isNull(this.m_rriTargetManager)
				&& this.getMainCapabilities().containsKey(
						oFF.InACapabilities.REPORT_REPORT_INTERFACE)) {
			this.m_rriTargetManager = oFF.QRriTargetManager.create(this);
		}
		return this.m_rriTargetManager;
	};
	oFF.InAQueryManagerProvider.prototype.getInputEnabledVariable = function(
			name) {
		return this.getVariableContainer().getInputEnabledVariable(name);
	};
	oFF.InAQueryManagerProvider.prototype.getHierarchyNodeVariable = function(
			name) {
		return this.getVariableContainer().getHierarchyNodeVariable(name);
	};
	oFF.InAQueryManagerProvider.prototype.getHierarchyNameVariable = function(
			name) {
		return this.getVariableContainer().getHierarchyNameVariable(name);
	};
	oFF.InAQueryManagerProvider.prototype.getHierarchyNameVariables = function() {
		return this.getVariableContainer().getHierarchyNameVariables();
	};
	oFF.InAQueryManagerProvider.prototype.getDimensionMemberVariables = function() {
		return this.getVariableContainer().getDimensionMemberVariables();
	};
	oFF.InAQueryManagerProvider.prototype.getStateBeforeVarScreen = function() {
		return this.m_savedStateBeforeVarScreen;
	};
	oFF.InAQueryManagerProvider.prototype.setStateBeforeVarScreen = function(
			savedStateBeforeVarScreen) {
		this.m_savedStateBeforeVarScreen = savedStateBeforeVarScreen;
	};
	oFF.InAQueryManagerProvider.prototype.getMetadataStateBeforeVarScreen = function() {
		return this.m_savedMetadataStateBeforeVarScreen;
	};
	oFF.InAQueryManagerProvider.prototype.setMetadataStateBeforeVarScreen = function(
			savedMetadataStateBeforeVarScreen) {
		this.m_savedMetadataStateBeforeVarScreen = savedMetadataStateBeforeVarScreen;
	};
	oFF.InAQueryManagerProvider.prototype.applyValueHelpCapabilities = function() {
		var activeMainCapabilities;
		var importer;
		var queryModelBase;
		if (oFF.notNull(this.m_inaCapabilitiesValueHelp)) {
			this.m_inaCapabilities = this.m_inaCapabilitiesValueHelp;
			this.m_inaCapabilitiesValueHelp = null;
			activeMainCapabilities = this.m_inaCapabilities
					.getActiveMainCapabilities();
			importer = oFF.QInAImportFactory.createForMetadataCore(this
					.getApplication(), activeMainCapabilities);
			queryModelBase = this.getQueryModelBase();
			importer.importBasicQueryModelCapabilities(queryModelBase);
		}
	};
	oFF.InAQueryManagerProvider.prototype.getDataRequest = function() {
		if (oFF.isNull(this.m_lastDataRequest)
				&& this.getMode() !== oFF.QueryManagerMode.RAW_QUERY) {
			this.fillDataRequestStructure(true);
		}
		return this.m_lastDataRequest;
	};
	oFF.InAQueryManagerProvider.prototype.getDataRequestAsString = function() {
		var dataRequest = this.getDataRequest();
		return oFF.isNull(dataRequest) ? null : dataRequest.toString();
	};
	oFF.InAQueryManagerProvider.prototype.getCapabilitiesBase = function() {
		var mainCapabilities;
		if (oFF.isNull(this.m_capabilities)) {
			this.m_capabilities = oFF.QCapabilities.create();
			this.m_capabilities.setSystemType(this.getSystemType());
			mainCapabilities = this.getMainCapabilities();
			oFF.QInAMdCapabilities.importCapabilities(mainCapabilities,
					this.m_capabilities);
		}
		return this.m_capabilities;
	};
	oFF.InAQueryManagerProvider.prototype.getVariableVariants = function() {
		if (oFF.isNull(this.m_availableVariants)) {
			return null;
		}
		return this.m_availableVariants.getValuesAsReadOnlyList();
	};
	oFF.InAQueryManagerProvider.prototype.processActivateVariableVariant = function(
			variableVariant, syncType, listener, customIdentifier) {
		this.m_activeVariant = variableVariant;
		return oFF.InAQMgrVarAction.createAndRunDefinition(this, syncType,
				listener, customIdentifier);
	};
	oFF.InAQueryManagerProvider.prototype.addVariableVariant = function(variant) {
		if (oFF.isNull(this.m_availableVariants)) {
			this.m_availableVariants = oFF.XLinkedHashMapByString.create();
		}
		this.m_availableVariants.put(variant.getName(), variant);
	};
	oFF.InAQueryManagerProvider.prototype.getVariableVariantByName = function(
			variableVariantName) {
		return this.m_availableVariants.getByKey(variableVariantName);
	};
	oFF.InAQueryManagerProvider.prototype.getPreQueryName = function() {
		return this.m_preQueryName;
	};
	oFF.InAQueryManagerProvider.prototype.setPreQueryName = function(
			preQueryName) {
		this.m_preQueryName = preQueryName;
	};
	oFF.InAQueryManagerProvider.prototype.activateVariableVariant = function(
			variableVariant, syncType, listener, customIdentifier) {
		return this.processActivateVariableVariant(variableVariant, syncType,
				listener, customIdentifier);
	};
	oFF.InAQueryManagerProvider.prototype.isSuppressExitVariableValuesInRepoMode = function() {
		return this.m_suppressExitVariableValues;
	};
	oFF.InAQueryManagerProvider.prototype.setSuppressExitVariableValuesInRepoMode = function(
			suppress) {
		this.m_suppressExitVariableValues = suppress;
	};
	oFF.InAQueryManagerProvider.prototype.getMessageManager = function() {
		return this;
	};
	oFF.InAQueryManagerProvider.prototype.getNewResultsetContainer = function() {
		return this.getResultsetContainer(true);
	};
	oFF.InAQueryManagerProvider.prototype.isUpdatingDataRequestCapabilities = function() {
		return this.m_updateRuntimeCapabilities;
	};
	oFF.InAQueryManagerProvider.prototype.setUpdatingDataRequestCapabilities = function(
			updateCapabilities) {
		this.m_updateRuntimeCapabilities = updateCapabilities;
	};
	oFF.InAQueryManagerProvider.prototype.getNoVariableSubmitResponse = function() {
		return this.m_noVariableSubmitResponse;
	};
	oFF.InAQueryManagerProvider.prototype.setNoVariableSubmitResponse = function(
			noVariableSubmitResponse) {
		this.m_noVariableSubmitResponse = noVariableSubmitResponse;
	};
	oFF.InAQueryManagerProvider.prototype.updateDynamicVariables = function(
			syncType, listener, customIdentifier) {
		this.getConvenienceCommands().updateDynamicVariables(syncType,
				listener, customIdentifier);
	};
	oFF.InAQueryManagerProvider.prototype.processUpdateDynamicVariables = function(
			syncType, listener, customIdentifier) {
		this.getConvenienceCommands().updateDynamicVariables(syncType,
				listener, customIdentifier);
	};
	oFF.InAQueryManagerProvider.prototype.processBLOB = function(syncType,
			listener, customIdentifier, imagePath) {
		var connection = this.getConnection();
		var container;
		var blobContainer;
		var rsContainerImage;
		var response;
		if (!connection.supportsWebServiceForBLOBObjects()) {
			this.getActiveResultSetContainer().addError(
					oFF.ErrorCodes.INVALID_SYSTEM,
					"No Support for retrieving BLOBs.");
			container = oFF.BLOBContainer.createBLOBContainer(this, null);
			if (oFF.notNull(listener)) {
				listener
						.onBLOBAvailable(container, container, customIdentifier);
			}
			return container;
		}
		if (this.getOlapEnv().hasBLOBForResourceId(imagePath)) {
			blobContainer = oFF.BLOBContainer.createBLOBContainer(this, null);
			if (oFF.notNull(listener)) {
				listener.onBLOBAvailable(blobContainer, blobContainer,
						customIdentifier);
			}
			return blobContainer;
		}
		this.m_processingImageRequest = imagePath;
		this.m_listOfRequestedResources.add(imagePath);
		rsContainerImage = oFF.BLOBContainer.createBLOBContainer(this, this
				.createFunction());
		response = rsContainerImage.processExecution(syncType, listener,
				customIdentifier);
		this.m_processingImageRequest = null;
		return response;
	};
	oFF.InAQueryManagerProvider.prototype.getResourcePath = function() {
		return this.m_processingImageRequest;
	};
	oFF.InAQueryManagerProvider.prototype.getResourceDetailsFromResourceIdentifier = function(
			resourceKey) {
		if (!this.m_listOfRequestedResources.contains(resourceKey)) {
			this.m_listOfRequestedResources.add(resourceKey);
			return this.getOlapEnv().useBLOBDetailsForResourceId(resourceKey);
		}
		return this.getOlapEnv().getBLOBDetailsForResourceId(resourceKey);
	};
	oFF.InAQueryManagerProvider.prototype.isShallow = function() {
		var initSettings = this.getInitSettings();
		return initSettings.getDataRequestAsString() !== null
				&& this.getQueryModel() === null;
	};
	oFF.InAQueryManagerProvider.prototype.recordState = function() {
		return this.m_stateManager.recordState();
	};
	oFF.InAQueryManagerProvider.prototype.applyState = function(syncType,
			listener, customerIdentifier, stateId) {
		return oFF.InAQMgrApplyStateAction.createAndRun(syncType, this,
				listener, customerIdentifier, stateId, this.m_stateManager);
	};
	oFF.ProviderModule = function() {
	};
	oFF.ProviderModule.prototype = new oFF.DfModule();
	oFF.ProviderModule.s_module = null;
	oFF.ProviderModule.getInstance = function() {
		return oFF.ProviderModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.ProviderModule.initVersion = function(version) {
		var timestamp;
		var registrationService;
		if (oFF.isNull(oFF.ProviderModule.s_module)) {
			oFF.DfModule.checkInitialized(oFF.OlapImplModule
					.initVersion(version));
			oFF.DfModule.checkInitialized(oFF.OlapCmdImplModule
					.initVersion(version));
			timestamp = oFF.DfModule.start("ProviderModule...");
			oFF.ProviderModule.s_module = new oFF.ProviderModule();
			registrationService = oFF.RegistrationService.getInstance();
			oFF.QInA.staticSetup();
			oFF.QInAImportFactoryImpl.staticSetupImpl();
			oFF.QInAExportFactoryImpl.staticSetupImpl();
			oFF.InAQMgrCapabilities.staticSetup();
			oFF.PlanningStateHandler
					.setInstance(new oFF.PlanningStateHandlerDummyImpl());
			oFF.InAQueryManagerProvider.staticSetupProvider();
			oFF.QCsnConverter.staticSetup();
			registrationService.addService(oFF.OlapApiModule.XS_QUERY_CONSUMER,
					oFF.InAQueryManagerProvider.CLAZZ);
			oFF.DfModule.stop(timestamp);
		}
		return oFF.ProviderModule.s_module;
	};
	oFF.ProviderModule.getInstance();
})(sap.firefly);