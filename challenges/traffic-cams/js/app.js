'use strict';

$(function () {

	var map = L.map('map').setView([47.6097, -122.3331], 12);

	L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia2x5YW4xNyIsImEiOiJjaWZ3M2c0ZDQyaXJtdHRseTNtMWRmdmJiIn0.3rLCbathLQPPHUd2LDGtAg', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    	maxZoom: 18,
    	accessToken: 'pk.eyJ1Ijoia2x5YW4xNyIsImEiOiJjaWZ3M2c0ZDQyaXJtdHRseTNtMWRmdmJiIn0.3rLCbathLQPPHUd2LDGtAg',
    	id: 'klyan17.cifw3g2cw3urclfkrdt7tpw5b'
	}).addTo(map);

	var sdot = new L.layerGroup();
	var wsdot = new L.layerGroup();
	$.getJSON('https://data.seattle.gov/resource/65fc-btcc.json', function(data) {

		placeMarkers(data);

		// converting data into map markers, on load and on filter
		function placeMarkers(data) {
			sdot = new L.layerGroup();
			wsdot = new L.layerGroup(); 
			$.each(data, function(i, value) {
				var lat = value.location.latitude;
				var lon = value.location.longitude;
				var cam = value.imageurl.url;
				var label = value.cameralabel;
				var own = value.ownershipcd;
				if (own == 'SDOT') {
					L.circleMarker([lat, lon], {
						color: '#E9847A',
						weight: 3.5,
						opacity: .8
					}).addTo(sdot).addTo(map).bindPopup('<h2 style="color: #E9847A">' +
						label + '</h2> <img src='+ cam +' alt='+label+' width=250px>');

				} else {
					L.circleMarker([lat, lon], {
						color: '#7ADFE9',
						weight: 3.5,
						opacity: .8
					}).addTo(wsdot).addTo(map).bindPopup('<h2 style="color: #7ADFE9">' +
						label + '</h2> <img src='+ cam +' alt='+label+' width=250px>');
				}
			});
		countCameras(sdot, wsdot); // updates camera count to match # of markers
		}

		// filters visible map markers as soon as the user types into the filter
		$("#cam-filter").keyup(function() {
			$('g').html('');
			var filter = this.value.toLowerCase();
			var filteredCams = data.filter(function(value) {
				return value.cameralabel.toLowerCase().indexOf(filter) >= 0;
			});
			placeMarkers(filteredCams);
		});

		// counts how many sdot and wsdot cameras are currently being shown 
		function countCameras(sdot, wsdot) {
			var sdotArray = sdot.getLayers();
			var wsdotArray = wsdot.getLayers();
			document.getElementById('sdotp-count').innerText = sdotArray.length;
			document.getElementById('wsdotp-count').innerText = wsdotArray.length;;
		}
	});
});