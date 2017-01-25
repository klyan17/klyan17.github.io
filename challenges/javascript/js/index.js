/**
 * application script for index.html
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    function forEachElement(collection, fn) {
        var i;
        for (i = 0; i < collection.length; i++) {
            fn(collection[i]);
        }
    }

    var clickMeButton = document.getElementById("click-me");
    clickMeButton.addEventListener('click', function() {
       var alerts = document.querySelectorAll('.alert');
        forEachElement(alerts, function(alert) {
            alert.style.display = 'block';
        });
    });

    var closeButtons = document.querySelectorAll('.alert .close');
    forEachElement(closeButtons, function(button) {
       button.addEventListener('click', function() {
            button.parentElement.style.display = 'none';
        });
    });
});