// ==UserScript==
// @name Shows I'm Watching
// @namespace https://github.com/McSlurryHole/what-im-watching
// @description highlights the shows I'm watching
// @include http://horriblesubs.info/
// @author your mum
// @run-at document-idle
// ==/UserScript==

"use strict";

// SETTINGS
	// background color of the row.
var HIGHLIGHT_COLOR = "#91ffd0";
	// css for the + - buttons.
var BUTTON_STYLES = "background-color:#fcfcfc;border:none;color:#0066cc;margin:1px;width:25px;";
	// changes dates to the format that the rest of the world uses - DD/MM
var CORRECT_DATE_FORMAT = true


// BEGIN SCRIPT
var script1 = document.createElement('script');
script1.type = "text/javascript";
script1.appendChild(document.createTextNode(addToList));

var script2 = document.createElement('script');
script2.type = "text/javascript";
script2.appendChild(document.createTextNode(removeFromList));

var thePage = document.body || document.head || document.documentElement;

thePage.appendChild(script1);
thePage.appendChild(script2);

function createButton(anime, type) {
  var element = document.createElement('td');
  element.innerHTML = "<button style=\"" + BUTTON_STYLES + "\"onClick=\"" + (type === "add" ? "addToList" : "removeFromList") + "('" + anime + "')\">" + (type === "add" ? "+" : "-") + "</button>";
  return element;
}

function addToList(show) {
  var listOfShows = localStorage.getItem("listOfShows");
  if (listOfShows !== null) {
    listOfShows = JSON.parse(listOfShows);
    listOfShows.indexOf(show) === -1 ? listOfShows.push(show) : null;
    localStorage.setItem("listOfShows", JSON.stringify(listOfShows));
  } else {
    var shows = [];
    shows[0] = show;
    localStorage.setItem("listOfShows", JSON.stringify(shows));
  }
}

function removeFromList(show) {
  var listOfShows = localStorage.getItem("listOfShows");
  if (listOfShows !== null) {
    listOfShows = JSON.parse(listOfShows);
    if (listOfShows.indexOf(show) > -1) {
      listOfShows.splice(listOfShows.indexOf(show), 1);
      localStorage.setItem("listOfShows", JSON.stringify(listOfShows));
    }
  }
}

setInterval(function () {
  var listOfShows = localStorage.getItem("listOfShows") || [];
  document.querySelectorAll(".rls-label").forEach(function (element) {  
    var hasA = element.getElementsByTagName('A');
    // get the show name even if not a link
    var elementText = (hasA.length > 0) ? hasA[0].text : (element.innerHTML).match(/ +(.*)- +\d+?/)[1].trim(); 
    var row = element.parentElement;
    if (!element.classList.contains("updated-row")) {
      row.insertBefore(createButton(elementText, "remove"), row.children[0]);
      row.insertBefore(createButton(elementText, "add"), row.children[0]);
      if(CORRECT_DATE_FORMAT){
    		var dateRegex = element.innerHTML.match(/\((\d+)\/(\d+)\)/);
      	if(typeof dateRegex !== "undefined" && dateRegex !== null ){
    			var newDate = dateRegex[2] + "/" + dateRegex[1]
      		element.innerHTML = element.innerHTML.replace(/\((\d+)\/(\d+)\)/, newDate)
      	}
    	}
      element.classList.add("updated-row")
    }
    if(listOfShows.indexOf(elementText) >= 0) {
      row.style.backgroundColor = HIGHLIGHT_COLOR;
    } else {
      row.style.backgroundColor = "transparent";
    }
  });
}, 500);
