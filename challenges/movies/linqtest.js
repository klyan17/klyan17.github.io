var movieList;
var matrixList = ["IFC Films", "Magnolia Pictures", "Warner Bros."
						, "Kino Lorber", "20th Century Fox", "Sony Pictures"
						, "Lionsgate", "Sony Pictures Classics", "Universal"
						, "Walt Disney", "Drama", "Comedy", "Documentary"
						, "Adventure", "Action", "Thriller/Suspense", "Horror"
						, "Romantic Comedy", "Musical", "Black Comedy"];
var top10Distributors;
var resultMovies;

$(document).ready(function() {
	//parse data
	var datapath = "movies-2014.csv";
	var csvfile = $.ajax({
		type: "GET",
		url: datapath,
	    async: false,
		dataType: "text",
		
	});

	movieList = Papa.parse(csvfile.responseText, {
					    header: true,
					    dynamicTyping: true,
					}).data;

	//linq edit

	top10Distributors = movieList
	.where(function(x) { return filterTopDistributor(x)})
	.orderBy(function(x) { return x.distributor});

	resultMovies = top10Distributors;
	//console.log(top10Distributors);
	//console.log(genreList);
	setMatrixFilmCount(resultMovies);
	createChart(movieMatrix);
});

function filterTopDistributor(x) {
	if (x.distributor != null) {
		return $.inArray(x.distributor, matrixList) >= 0;
	}
	return false;
}

// function setFilteredMovie(date1, date2) {
// 	resultMovies = top10Distributors.where(function(x) { return filterByDate(x,date1,date2)});
// 	//console.log(resultMovies);
// }

// function filterByDate(x, date1, date2) {
// 	var maxDate = (date1 > date2 ? date1 : date2);
// 	var minDate = (date1 < date2 ? date1 : date2);
// 	var xDate = new Date(x.released);
// 	return minDate <= xDate && xDate <= maxDate;
// }

function createMovieMatrix() {
	for (var i = 0; i < 20; i++) {
		for (var j = 0; j < 20; j++) {
			movieMatrix[i][j] = 0;
		}
	}
}

function setMatrixFilmCount(m) {
	createMovieMatrix();
	jQuery.each(m, function() {
		var distIndex = matrixList.indexOf(this.distributor);
		var genreIndex = matrixList.indexOf(this.genre);
		movieMatrix[distIndex][genreIndex] += 1;
		movieMatrix[genreIndex][distIndex] += 1;
		// console.log(this.distributor + ":" + distIndex);
		// console.log(this.genre + ":" + genreIndex);
	});
	getMaxValue();
}

function setMatrixGross(m) {
	createMovieMatrix();
	jQuery.each(m, function() {
		var distIndex = matrixList.indexOf(this.distributor);
		var genreIndex = matrixList.indexOf(this.genre);
		movieMatrix[distIndex][genreIndex] += this.gross;
		movieMatrix[genreIndex][distIndex] += this.gross;
		// console.log(this.distributor + ":" + distIndex);
		// console.log(this.genre + ":" + genreIndex);
	});
	getMaxValue();
}

function getMaxValue() {
	var result = 0;
	for (var i = 0; i < 20; i++) {
		for (var j = 0; j < 20; j++) {
			var value = movieMatrix[i][j];
			result = (value > result) ? value : result;
		}
	}
	maxValue = result;
}

function getGenreDetail(genre) {
//set up
	var list = top10Distributors.where(function(x) { return x.genre == genre});
	var result = "<h2>" + genre + "</h2>"
				+"<p><strong>There were " + list.length + " " + genre + " films released</strong></p>"
				+"\n<table>"
				+"\n<tr><th>Distributor</th><th>Number of Releases</th></tr>";
	var distResult = [0,0,0,0,0,0,0,0,0,0];
	var grossResult = [0,0,0,0,0,0,0,0,0,0];
	var totalGross = 0;

//collect data
	jQuery.each(list, function() {
		var distIndex = matrixList.indexOf(this.distributor);
		distResult[distIndex] += 1;
		grossResult[distIndex] += this.gross;
		totalGross += this.gross;
	});

//how many films released	
	for (var i = 0; i < 10; i++) {
		genreCount = distResult[i];
		if (genreCount > 0) {
			result += "\n<tr>"
						+"\n<td>" + matrixList[i] + "</td>"
					   	+"\n<td>" + genreCount + "</td>"
			   		  +"\n</tr>";
		}
	}
	result += "\n</table>";

//how much money it made
	result += "\n<p><strong>" + genre + " movies grossed $" + intToMoney(totalGross) + "</strong></p>"
			 +"\n<table>"
			 +"\n<tr><th>Distributor</th><th>Gross Amount</th></tr>";
	for (var i = 0; i < 10; i++) {
		grossCount = grossResult[i];
		if (grossCount > 0) {
			result += "\n<tr>"
						+"\n<td>" + matrixList[i] + "</td>"
					   	+"\n<td>$" + intToMoney(grossCount) + "</td>"
			   		  +"\n</tr>";
		}
	}
	result += "\n</table>";
	
	$("#details").html(result);
}

//returns html of distributor detail
function getDistDetail(dist) {
//set up
	var list = top10Distributors.where(function(x) { return x.distributor == dist});
	var result = "<h2>" + dist + "</h2>"
				+"<p><strong>" + dist + " released " + list.length + " films</strong></p>"
				+"\n<table>"
				+"\n<tr><th>Genre</th><th>Number of Releases</th></tr>";
	var genreResult = [0,0,0,0,0,0,0,0,0,0];
	var grossResult = [0,0,0,0,0,0,0,0,0,0];
	var totalGross = 0;

//collect data
	jQuery.each(list, function() {
		var genreIndex = matrixList.indexOf(this.genre) - 10;
		genreResult[genreIndex] += 1;
		grossResult[genreIndex] += this.gross;
		totalGross += this.gross;
	});

//how many films released	
	for (var i = 0; i < 10; i++) {
		genreCount = genreResult[i];
		if (genreCount > 0) {
			result += "\n<tr>"
						+"\n<td>" + matrixList[i + 10] + "</td>"
					   	+"\n<td>" + genreCount + "</td>"
			   		  +"\n</tr>";
		}
	}
	result += "\n</table>";

//how much money it made
	result += "\n<p><strong>" + dist + " grossed $" + intToMoney(totalGross) + "</strong></p>"
			 +"\n<table>"
			 +"\n<tr><th>Genre</th><th>Gross Amount</th></tr>";
	for (var i = 0; i < 10; i++) {
		grossCount = grossResult[i];
		if (grossCount > 0) {
			result += "\n<tr>"
						+"\n<td>" + matrixList[i + 10] + "</td>"
					   	+"\n<td>$" + intToMoney(grossCount) + "</td>"
			   		  +"\n</tr>";
		}
	}
	result += "\n</table>";
	
	$("#details").html(result);
}

function intToMoney(i) {
	return i.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}