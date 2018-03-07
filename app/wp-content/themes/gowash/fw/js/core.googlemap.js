function gowash_googlemap_init(dom_obj, coords) {
	"use strict";
	if (typeof GOWASH_STORAGE['googlemap_init_obj'] == 'undefined') gowash_googlemap_init_styles();
	GOWASH_STORAGE['googlemap_init_obj'].geocoder = '';
	try {
		var id = dom_obj.id;
		GOWASH_STORAGE['googlemap_init_obj'][id] = {
			dom: dom_obj,
			markers: coords.markers,
			geocoder_request: false,
			opt: {
				zoom: coords.zoom,
				center: null,
				scrollwheel: false,
				scaleControl: false,
				disableDefaultUI: false,
				panControl: true,
				zoomControl: true, //zoom
				mapTypeControl: false,
				streetViewControl: false,
				overviewMapControl: false,
				styles: GOWASH_STORAGE['googlemap_styles'][coords.style ? coords.style : 'default'],
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
		};
		
		gowash_googlemap_create(id);

	} catch (e) {
		
		dcl(GOWASH_STORAGE['strings']['googlemap_not_avail']);

	};
}

function gowash_googlemap_create(id) {
	"use strict";

	// Create map
	GOWASH_STORAGE['googlemap_init_obj'][id].map = new google.maps.Map(GOWASH_STORAGE['googlemap_init_obj'][id].dom, GOWASH_STORAGE['googlemap_init_obj'][id].opt);

	// Add markers
	for (var i in GOWASH_STORAGE['googlemap_init_obj'][id].markers)
		GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].inited = false;
	gowash_googlemap_add_markers(id);
	
	// Add resize listener
	jQuery(window).resize(function() {
		if (GOWASH_STORAGE['googlemap_init_obj'][id].map)
			GOWASH_STORAGE['googlemap_init_obj'][id].map.setCenter(GOWASH_STORAGE['googlemap_init_obj'][id].opt.center);
	});
}

function gowash_googlemap_add_markers(id) {
	"use strict";
	for (var i in GOWASH_STORAGE['googlemap_init_obj'][id].markers) {
		
		if (GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].inited) continue;
		
		if (GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].latlng == '') {
			
			if (GOWASH_STORAGE['googlemap_init_obj'][id].geocoder_request!==false) continue;
			
			if (GOWASH_STORAGE['googlemap_init_obj'].geocoder == '') GOWASH_STORAGE['googlemap_init_obj'].geocoder = new google.maps.Geocoder();
			GOWASH_STORAGE['googlemap_init_obj'][id].geocoder_request = i;
			GOWASH_STORAGE['googlemap_init_obj'].geocoder.geocode({address: GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].address}, function(results, status) {
				"use strict";
				if (status == google.maps.GeocoderStatus.OK) {
					var idx = GOWASH_STORAGE['googlemap_init_obj'][id].geocoder_request;
					if (results[0].geometry.location.lat && results[0].geometry.location.lng) {
						GOWASH_STORAGE['googlemap_init_obj'][id].markers[idx].latlng = '' + results[0].geometry.location.lat() + ',' + results[0].geometry.location.lng();
					} else {
						GOWASH_STORAGE['googlemap_init_obj'][id].markers[idx].latlng = results[0].geometry.location.toString().replace(/\(\)/g, '');
					}
					GOWASH_STORAGE['googlemap_init_obj'][id].geocoder_request = false;
					setTimeout(function() { 
						gowash_googlemap_add_markers(id); 
						}, 200);
				} else
					dcl(GOWASH_STORAGE['strings']['geocode_error'] + ' ' + status);
			});
		
		} else {
			
			// Prepare marker object
			var latlngStr = GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].latlng.split(',');
			var markerInit = {
				map: GOWASH_STORAGE['googlemap_init_obj'][id].map,
				position: new google.maps.LatLng(latlngStr[0], latlngStr[1]),
				clickable: GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].description!=''
			};
			if (GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].point) markerInit.icon = GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].point;
			if (GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].title) markerInit.title = GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].title;
			GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].marker = new google.maps.Marker(markerInit);
			
			// Set Map center
			if (GOWASH_STORAGE['googlemap_init_obj'][id].opt.center == null) {
				GOWASH_STORAGE['googlemap_init_obj'][id].opt.center = markerInit.position;
				GOWASH_STORAGE['googlemap_init_obj'][id].map.setCenter(GOWASH_STORAGE['googlemap_init_obj'][id].opt.center);				
			}
			
			// Add description window
			if (GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].description!='') {
				GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].infowindow = new google.maps.InfoWindow({
					content: GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].description
				});
				google.maps.event.addListener(GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].marker, "click", function(e) {
					var latlng = e.latLng.toString().replace("(", '').replace(")", "").replace(" ", "");
					for (var i in GOWASH_STORAGE['googlemap_init_obj'][id].markers) {
						if (latlng == GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].latlng) {
							GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].infowindow.open(
								GOWASH_STORAGE['googlemap_init_obj'][id].map,
								GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].marker
							);
							break;
						}
					}
				});
			}
			
			GOWASH_STORAGE['googlemap_init_obj'][id].markers[i].inited = true;
		}
	}
}

function gowash_googlemap_refresh() {
	"use strict";
	for (id in GOWASH_STORAGE['googlemap_init_obj']) {
		gowash_googlemap_create(id);
	}
}

function gowash_googlemap_init_styles() {
	// Init Google map
	GOWASH_STORAGE['googlemap_init_obj'] = {};
	GOWASH_STORAGE['googlemap_styles'] = {
		'default': []
	};
	if (window.gowash_theme_googlemap_styles!==undefined)
		GOWASH_STORAGE['googlemap_styles'] = gowash_theme_googlemap_styles(GOWASH_STORAGE['googlemap_styles']);
}