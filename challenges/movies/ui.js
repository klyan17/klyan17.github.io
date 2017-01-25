var date1;
var date2;
$(document).ready(function() {
// //date slider======================================
// 	$("#date-slider").dateRangeSlider({
// 		defaultValues:{
// 			min: new Date(2013,0,1),
// 			max: new Date(2014,11,31)},
// 		bounds: {
// 			min: new Date(2013,0,1),
// 			max: new Date(2014,11,31)},
// 		arrows: false});

// 	$("#date-slider").on("valuesChanging", function(e, data) {
// 		// console.log("min date: " + data.values.min + " max date: " + data.values.max);
// 		date1 = data.values.min 
// 		date2 = data.values.max
// 		setFilteredMovie(date1, date2);
// 	});

	$(function() {
    	$( "#radioColor" ).buttonset();
  });

	$("#radioMovie").click(function() {
		swapColors();
		console.log("swap to movies");	
  });

	$("#radioGenre").click(function() {
		swapColors("target");
		console.log("swap to movies");
  });

  $(function() {
    $( "#radioValue" ).buttonset();
  });

  $("#radioFilmCount").click(function() {
    showFilmCount()
    console.log("show film count");  
  });

  $("#radioGross").click(function() {
    showGross();
    console.log("show gross total");
  });

});	