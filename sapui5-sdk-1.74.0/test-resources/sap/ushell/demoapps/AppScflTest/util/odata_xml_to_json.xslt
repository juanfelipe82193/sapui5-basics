<!--

	Description
	===========
	This is an XSL transformation to transform an OData XML response into a JSON file.
	Originally it was meant to provide simple JSON files for the SAP UI5 Mock Server only. 
	Since then it has been extended to support inline feeds in order to generate more 
	genberic JSON files.

	Instructions
	============
	Use an XSLT processor, for instance Saxon, available on http://saxon.sourceforge.net/
	Command line: java -jar saxon9he.jar -s:input.xml -xsl:odata_xml_to_json.xslt -o:output.json
	API: refer to http://www.saxonica.com/documentation/#!using-xsl/embedding
	
	In theory the ABAP kernel XSLT processor should work, too, but has not been tested.

	Author
	======
	Dr. Martin Rogge, SAP SE, 2013-08-22

-->

<xsl:transform version="1.0"
	xmlns:xhtml="http://www.w3.org/1999/xhtml"
	xmlns="http://www.w3.org/1999/xhtml"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	xmlns:a="http://www.w3.org/2005/Atom"
	xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata"
	xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices"
	exclude-result-prefixes="xhtml xsl xs"
>

<!-- Eclipse complains about a seemingly valid attribute, don't ask -->
<!-- <xsl:output method="text" omit-xml-declaration="yes" byte-order-mark="no" /> -->

<xsl:output method="text" omit-xml-declaration="yes" />

	<xsl:strip-space elements="*" />

	<!-- switch off builtin template rules -->
	
	<xsl:template match="node()|@*" priority="-9" />

	<!-- document rules -->
	
	<xsl:template match="/">
		<xsl:text>{&#x0D;&#x0A;</xsl:text>
		<xsl:if test="child::a:entry">
			<xsl:if test="a:entry/a:link[@rel='edit']">
				<xsl:text>&#x09;"</xsl:text>
				<xsl:choose>
					<xsl:when test="contains(string(a:entry/a:link[@rel='edit']/@href),'(')">
						<xsl:value-of select="substring-before(string(a:entry/a:link[@rel='edit']/@href),'(')" />
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="string(a:entry/a:link[@rel='edit']/@href)" />
					</xsl:otherwise>
				</xsl:choose>
				<xsl:text>" : [&#x0D;&#x0A;</xsl:text>
			</xsl:if>
		</xsl:if>
		<xsl:apply-templates select="a:feed|a:entry" />
		<xsl:if test="child::a:entry">
			<xsl:if test="a:entry/a:link[@rel='edit']">
				<xsl:text>&#x09;]&#x0D;&#x0A;</xsl:text>
			</xsl:if>
		</xsl:if>
		<xsl:text>}&#x0D;&#x0A;</xsl:text>
	</xsl:template>

	<xsl:template match="a:feed">
		<xsl:if test="child::a:entry">
			<xsl:if test="child::a:link[@rel='self']">
				<xsl:for-each select="/|ancestor-or-self::a:entry|ancestor-or-self::m:inline|ancestor-or-self::d:*">
					<xsl:text>&#x09;</xsl:text>
				</xsl:for-each>
				<xsl:text>"</xsl:text>
				<xsl:choose>
					<xsl:when test="contains(string(child::a:link[@rel='self']/@href),'/')">
						<xsl:value-of select="substring-after(string(child::a:link[@rel='self']/@href),'/')" />
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="string(child::a:link[@rel='self']/@href)" />
					</xsl:otherwise>
				</xsl:choose>
				<xsl:text>" : [&#x0D;&#x0A;</xsl:text>
			</xsl:if>
		</xsl:if>
		<xsl:apply-templates select="a:entry" />
		<xsl:if test="child::a:entry">
			<xsl:if test="child::a:link[@rel='self']">
				<xsl:for-each select="/|ancestor-or-self::a:entry|ancestor-or-self::m:inline|ancestor-or-self::d:*">
					<xsl:text>&#x09;</xsl:text>
				</xsl:for-each>
				<xsl:text>]</xsl:text>
				<!-- the following test works in most cases, but may have false positives -->
				<xsl:if test="ancestor::a:link[1]/following-sibling::*">
					<xsl:text>,</xsl:text>
				</xsl:if>
				<xsl:text>&#x0D;&#x0A;</xsl:text>
			</xsl:if>
		</xsl:if>
	</xsl:template>

	<xsl:template match="a:entry">
		<xsl:for-each select="/|ancestor-or-self::a:entry|ancestor-or-self::m:inline|ancestor-or-self::d:*">
			<xsl:text>&#x09;</xsl:text>
		</xsl:for-each>
		<xsl:text>{&#x0D;&#x0A;</xsl:text>
		<xsl:apply-templates select="a:content|a:link" />
		<xsl:for-each select="/|ancestor-or-self::a:entry|ancestor-or-self::m:inline|ancestor-or-self::d:*">
			<xsl:text>&#x09;</xsl:text>
		</xsl:for-each>
		<xsl:text>}</xsl:text>
		<xsl:if test="following-sibling::*">
			<xsl:text>,</xsl:text>
		</xsl:if>
		<xsl:text>&#x0D;&#x0A;</xsl:text>
	</xsl:template>

	<xsl:template match="a:link">
		<xsl:apply-templates select="m:inline" />
	</xsl:template>

	<xsl:template match="m:inline">
		<xsl:apply-templates select="a:feed" />
	</xsl:template>

	<xsl:template match="a:content">
		<xsl:apply-templates select="m:properties" />
	</xsl:template>

	<xsl:template match="m:properties">
		<xsl:apply-templates select="*" mode="properties" />
	</xsl:template>

	<xsl:template match="*" mode="properties">
		<xsl:for-each select="/|ancestor-or-self::a:entry|ancestor-or-self::m:inline|ancestor-or-self::d:*">
			<xsl:text>&#x09;</xsl:text>
		</xsl:for-each>
		<xsl:text>"</xsl:text>
		<xsl:value-of select="local-name(.)" />
		<xsl:text>" : </xsl:text>
		<xsl:choose>
			<xsl:when test="child::*">
				<xsl:text>{&#x0D;&#x0A;</xsl:text>
				<xsl:apply-templates select="*" mode="properties" />
				<xsl:for-each select="/|ancestor-or-self::a:entry|ancestor-or-self::m:inline|ancestor-or-self::d:*">
					<xsl:text>&#x09;</xsl:text>
				</xsl:for-each>
				<xsl:text>}</xsl:text>
			</xsl:when>
			<xsl:when test="child::text()">
				<xsl:apply-templates select="text()" mode="properties" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>""</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="following-sibling::*">
			<xsl:text>,</xsl:text>
		</xsl:if>
		<xsl:text>&#x0D;&#x0A;</xsl:text>
	</xsl:template>

	<xsl:template match="text()" mode="properties">
		<xsl:text>"</xsl:text>
		<xsl:value-of select="replace(., '&#x22;', '\\&#x22;')" />
		<xsl:text>"</xsl:text>
	</xsl:template>

</xsl:transform>
