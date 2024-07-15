// ==UserScript==
// @name         Auto Click Complete and Yes Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks the complete button and confirms the action on the lesson page
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function clickCompleteButton() {
        // Select the complete button using its class name
        const completeButton = document.querySelector('.lp-button.button.button-complete-item.button-complete-lesson.lp-btn-complete-item');

        // Check if the button exists, then click it
        if (completeButton) {
            completeButton.click();
            console.log('Complete button clicked.');
            setTimeout(clickYesButton, 1000); // Wait for the modal to appear before clicking Yes
        } else {
            console.log('Complete button not found.');
        }
    }

    function clickYesButton() {
        // Select the Yes button in the modal
        const yesButton = document.querySelector('.lp-modal-footer .btn-yes');

        // Check if the Yes button exists, then click it
        if (yesButton) {
            yesButton.click();
            console.log('Yes button clicked.');
        } else {
            console.log('Yes button not found.');
        }
    }

    // Wait for the DOM to be fully loaded before trying to click the button
    window.addEventListener('load', function() {
        setTimeout(clickCompleteButton, 2000); // Adjust the delay if necessary
    });

})();
