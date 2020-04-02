sap.ui.getCore().attachInit(function() {
	sap.ui.require([
		"jquery.sap.global",
		"sap/ui/thirdparty/d3",
		"jquery.sap.encoder"
	], function(jQuery, d3) {
		"use strict";

		var Version = jQuery.sap.Version;
		var encodeXML = jQuery.sap.encodeHTML;
		var toUrl = function(res) {
			return jQuery.sap.getResourcePath(res, "");
		};
		var getVersionInfo = sap.ui.getVersionInfo;

		var sBCP = undefined;
		var sGitHub = "https://github.com/SAP/openui5/issues/";

		try {
			sBCP = localStorage.getItem("sap-support-url");
		} catch (e) {
			// ignore
		}

		var MAX_COLORS = 20;

		function generateStyleClasses() {
			var gencolor =
				d3.scale.linear()
				.domain([0, MAX_COLORS])
				.range(["hsl(0,80%,80%)", "hsl(360,80%,80%)"])
				.interpolate(d3.interpolateString);
			var sStyle = "";
			for(var i = 0; i < MAX_COLORS; i++) {
				sStyle += ".patch" + i + ".released { " + "background-color: " + gencolor((32 - i % MAX_COLORS) % MAX_COLORS) + "; }\n";
			}
			jQuery("<style></style>").html(sStyle).appendTo("head");
		}

		function fetch(params) {
			return Promise.resolve(
				jQuery.ajax(params)
			);
		}

		function loadRelnotes(data) {
			var latestVersion = Version(data.version);
			var relnotes = {};
			return Promise.all(
				data.libraries.map(function(lib) {
					relnotes[lib.name] = {
					};

					var url;
					if ( /^themelib_/.test(lib.name) ) {
						url = toUrl("versiondata/resources/sap/ui/core/themes/" + lib.name.slice('themelib_'.length) + "/") + "/.theme";

					} else {
						url = toUrl("versiondata/resources/" + lib.name.replace(/\./g, "/") + "/") + "/.library";
					}

					return fetch({
						url: url,
						dataType: 'xml'
					}).then(function(data) {
						var $rd = jQuery("appData>releasenotes", data);
						var libNotes = relnotes[lib.name] = {
							urlPattern: $rd.attr("url"),
							resolve: $rd.attr("resolve")
						};
						if ( libNotes.urlPattern ) {
							var rnUrl = libNotes.urlPattern.replace("{major}", latestVersion.getMajor()).replace("{minor}", latestVersion.getMinor());
							if ( libNotes.resolve === 'lib' ) {
								rnUrl = new URI(rnUrl, url).toString();
							}
							return fetch({
								url: rnUrl,
								dataType: 'json'
							}).then(function(changes) {
								libNotes.changes = changes;
							}, function() {
								libNotes.changes = null;
							});
						}
					},function() {
						relnotes[lib.name] = {
							url: null
						};
					});
				})
			).catch(function(err) {
				console.error(err);
			}).then(function() {
				return relnotes;
			});
		}

			function formatVersion(v) {
				return String(v).replace("-SNAPSHOT", "");
			}

			function width(span, offset) {
				return "width:" + ((offset || 0) + span * 46 + (span-1) * 14) + "px;"
				// return "width:" + (span * 8) + "ex;"
			}

			function versionClasses(v) {
				if ( !v ) {
					return "";
				}
				v = Version(v);
				return " patch" + (v.getPatch() % MAX_COLORS) + " " + (v.getSuffix() ? " snapshot" : " released");
			}

		function renderVersionOverview(data) {

			var latestVersion = Version(data.version);
			var numberOfPatches = latestVersion.getPatch() + 1;
			var libs = data.libraries.slice().sort(function(libA,libB) {
				return libA.name === libB.name ? 0 : (libA.name < libB.name ? -1 : 1);
			});

			var html=[];
			html.push("<section class='release'>");
			html.push("<div class='label' style='", width(numberOfPatches, 300), "'>",data.name, " ", latestVersion.getMajor() + "." + latestVersion.getMinor(), "</div>");
			html.push("<div class='header' style='", width(numberOfPatches, 300), "'>");
			html.push("<span class='lib'>Patch Version</span>");
			for ( var patch = 0; patch < numberOfPatches; patch++ ) {
				var span = 1;
				var patchVersion = patch < latestVersion.getPatch() ? Version(latestVersion.getMajor(), latestVersion.getMinor(), patch) : latestVersion;
				html.push("<span id='block-", patchVersion, "' class='patch", versionClasses(patchVersion), "' style='", width(span), "'>", formatVersion(patchVersion), "</span>");
			}
			html.push("</div>");
			libs.forEach(function(libData) {
				html.push("<div style='", width(numberOfPatches + 1, 300), "'>");
				var last = null;
				var span = 0;
				html.push("<span class='lib", libData.oldStyle ? " oldstyle" : "" , "'", libData.oldStyle ? " title='old style library (" + libData.parentPom + ")'" : "", ">", libData.name, "</span>");
				html.push("<span style='", width(numberOfPatches), "'>");
				for ( var patch = 0; patch < numberOfPatches; patch++ ) {
					var libVersion = (libData.patchHistory && libData.patchHistory[patch]) || libData.version;
					if ( last == null || last == libVersion || libVersion == null ) {
						last = last || libVersion;
						span++;
					} else {
						html.push("<span id='block-", libData.name + "-" + last, "' class='patch", versionClasses(last), "' style='", width(span), "'>", formatVersion(last || "???"), "</span>");
						last = libVersion;
						span = 1;
					}
				}
				if ( span > 0 ) {
					html.push("<span id='block-", libData.name + "-" + last, "' class='patch", versionClasses(last), "' style='", width(span), "'>", formatVersion(last || "???"), "</span>");
				}
				html.push("</span>");
				html.push("</div>");
			});
			html.push("</div></section>");

			return html.join('');

		}

		function decorate(id, options) {
			var elem = document.getElementById(id);
			if ( elem ) {
				if ( options.href ) {
					// <a href='#changes-", patchVersion, "'>"
					var a = document.createElement("a");
					a.href = options.href;
					while ( elem.firstChild ) {
						a.appendChild(elem.firstChild);
					}
					elem.appendChild(a);
				}
				if ( options.title ) {
					elem.title = options.title;
				}
			}
		}

		function renderChangeLog(data, relnotes) {
			var latestVersion = Version(data.version);
			var numberOfPatches = latestVersion.getPatch() + 1;
			var libs = data.libraries.slice().sort(function(libA,libB) {
				return libA.name === libB.name ? 0 : (libA.name < libB.name ? -1 : 1);
			});

			var html = [];
			var patch = numberOfPatches;
			html.push("<h2>Change Log</h2>");
			while ( --patch >= 0 ) {
				var patchVersion = patch < latestVersion.getPatch() ? Version(latestVersion.getMajor(), latestVersion.getMinor(), patch) : latestVersion;
				html.push("<section class='patchinfo'>");
				html.push("<div id='changes-", patchVersion, "' class='label' style='", width(numberOfPatches, 300), "'>", patchVersion, "</div>");
				// console.log(patchVersion.toString());
				var counts = {
					libs: 0,
					totalChanges: 0,
					changes: 0
				};
				libs.forEach(function(libData) {
					var libPatchVersion = (libData.patchHistory && libData.patchHistory[patch]) || libData.version;
					if ( libPatchVersion
						 && patch === 0 || (libData.patchHistory && libData.patchHistory[patch - 1] !== libPatchVersion) ) {
						libPatchVersion = new Version(libPatchVersion);
						var libNotes = relnotes[libData.name];
						var libPatchVersionInChanges = new Version(libPatchVersion.getMajor(), libPatchVersion.getMinor(), libPatchVersion.getPatch());
						var changes = libNotes && libNotes.changes && libNotes.changes[libPatchVersionInChanges];
						if ( changes ) {
							counts.libs++;
							counts.changes = 0;
							html.push("<div id='changes-", libData.name + "-" + libPatchVersion, "' class='lib'>", libData.name, " <span class='version'>(", libPatchVersion, ")</span></div>");
							//console.log("  " + libData.name + " (" + libPatchVersion + ")");
							changes.notes.slice().filter(function(note) { return !!note; }).sort(function(na,nb) {
								if ( na.text === nb.text ) {
									return 0;
								}
								return na.text < nb.text ? -1 : 1;
							}).forEach(function(note) {
								counts.changes++;
								counts.totalChanges++;
								var msg = note.id.slice(0,7) + ' ' + note.text;
								var refs = note.references && note.references.filter(function(ref) { return ref.type === 'GitHub' || ref.type === 'BCP'; });
								if ( refs && refs.length > 0 ) {
									refs = "<span class=\"refs\"> (" + refs.map(function(ref) {
										if ( ref.type === 'GitHub' ) {
											return "<a href=\"" + sGitHub + ref.reference + "\" target=\"_blank\">#" + ref.reference + "</a>";
										}
										if ( ref.type === 'BCP' && sBCP ) {
											return "<a href=\"" + sBCP + ref.reference + "\" target=\"_blank\">" + ref.reference + "</a>";
										}
										return "<span>" + ref.reference + "</span>";
									}).join(", ") + ")</span>";
								} else {
									refs = "";
								}
								//console.log("    " + msg);
								html.push("<div class='change'><span class='sha'>", note.id.slice(0,7), "</span> <span class='commitmsg'>", encodeXML(note.text), "</span>", refs, "</div>");
							})
							decorate("block-" + libData.name + "-" + libPatchVersion, {
								href: "#changes-" + libData.name + "-" + libPatchVersion,
								title:
									(counts.changes == 0 ? "no" : counts.changes)
									+ " documented " + (counts.changes == 1 ? "change" : "changes")
							});
						}
					}
				});
				html.push("</section>");
				decorate("block-" + patchVersion, {
					href: "#changes-" + patchVersion,
					title:
						(counts.totalChanges == 0 ? "no" : counts.totalChanges)
						+ " documented " + (counts.totalChanges == 1 ? "change" : "changes")
						+ " in " + counts.libs + " " + (counts.libs == 1 ? "library" : "libraries")
				});
			}

			return html.join('');
		}

		function processData(data) {

			// update title and content
			jQuery("title").text(data.name + " - Version Overview");
			jQuery("#placeholder").replaceWith( renderVersionOverview(data) );

			loadRelnotes(data).then(function(relnotes) {
				jQuery("section.release").after( renderChangeLog(data, relnotes) );
			});

		}

		var versionInfoLoaded = getVersionInfo({async:true});

		generateStyleClasses();
		versionInfoLoaded.then(processData);

	});
});

