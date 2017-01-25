Parse.initialize("vS67fP41jcZatWntOTqBtZgtiDMrEp5bvv8FR43Q", "Bxnq4h7gZrXEUpgzdZPDY5a7v1HVdkdB5NOYMk1Y");
$(function() {
	'use strict';

	// review class from parse
	var Review = Parse.Object.extend('Review');
	var reviewsQuery = new Parse.Query(Review);
	reviewsQuery.ascending('createdAt');
	reviewsQuery.notEqualTo('done', true);

	// review set
	var reviews = [];

	// accessing  html body elements
	var reviewsList = $('#reviews-list');
	var errorMessage = $('#error-message');
	var ratingElem = $('#rating');
	var avgRatingElem = $('#avgrating');

	function displayError(err) {
		errorMessage.text(err.message);
		errorMessage.fadeIn();
	}

	function clearError() {
		errorMessage.hide();
	}

	function showSpinner() {
		$('.fa-spin').show();
	}

	function hideSpinner() {
		$('.fa-spin').hide();
	}

	function getReviews() {
		showSpinner();
		reviewsQuery.find().then(onData, displayError)
			.always(hideSpinner);
	}

	function onData(results) {
		reviews = results;
		renderReviews();
	}

	// gets reviews from parse and inserts them into the reviews section
	function renderReviews() {
		reviewsList.empty();

		var reviewCount = 0;
		var reviewStars = 0;

		reviews.forEach(function(review) {
			reviewCount++;
			reviewStars += parseInt(review.get('rating') || 1);
			var div = $(document.createElement('div'));

			//thumbs down
			div.append($('<img src="img/thumbsdown.png"" class="thumbsdown">')
				.click(function() {
					review.increment('total');
					review.save();
				}));
			//thumbs up				
			div.append($('<img src="img/thumbsup.png" class="thumbsup">')
				.click(function() {
					review.increment('pos');
					review.increment('total');
					review.save();
				}));

			$(document.createElement('h2')).text(review.get('title')).appendTo(div);
			$(document.createElement('span'))
				.raty({readOnly: true,
					score: (review.get('rating') || 0),
					hints: ['Undead', 'Betrayer', 'Helpless Survivor', 'Forager', 'Colony Leader']}).appendTo(div);
			$(document.createElement('p')).text(review.get('review')).appendTo(div);
			//trash
			div.append($('<img src="img/garbage.png" class="trash">')
				.click(function() {
					review.set('done', !review.get('done'));
					review.save().then(getReviews(), displayError());
			}));				
			$(document.createElement('p')).text('by ' + review.get('author')).appendTo(div);		
			var helpful = $('<div class="helpful">').text(review.get('pos') + ' out of ' + review.get('total') + ' found this review helpful');
			helpful.appendTo(div);
			div.appendTo(reviewsList);
		});

		// average rating calculation
		var avgReview = reviewStars / reviewCount;
		avgRatingElem.raty({readOnly: true, score: avgReview});
	}

	// new user review form and submission to parse
	$('#new-review-form').submit(function(evt) {
		evt.preventDefault();

		var authorInput = $(this).find('[name="author"]');
		var author = authorInput.val();
		var titleInput = $(this).find('[name="title"]');
		var title = titleInput.val();
		var reviewInput = $(this).find('[name="review"]');
		var rev = reviewInput.val();
		var review = new Review();
		review.set('author', author);
		review.set('title', title);
		review.set('rating', ratingElem.raty('score'));
		review.set('review', rev);
		review.set('pos', 0);
		review.set('total', 0);
		review.save().then(getReviews, displayError.then(function() {
			authorInput.val('');
			titleInput.val('');
			reviewInput.val('');
			ratingElem.raty('set', {
				hints: ['Undead', 'Betrayer', 'Helpless Survivor'
				, 'Forager', 'Colony Leader']});
		}));
		return false;
	});

	getReviews();
	ratingElem.raty();

	window.setInterval(getReviews, 3000);
});