// ==UserScript==
// @name Shows I'm Watching
// @namespace https://github.com/McSlurryHole/what-im-watching
// @description highlights the shows I'm watching
// @include https://horriblesubs.info/
// @author your mum
// @run-at document-idle
// ==/UserScript==

"use strict";

// SETTINGS
	// background color of the row.
var HIGHLIGHT_COLOR = "#91ffd0";

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

Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
  for(var i = this.length - 1; i >= 0; i--) {
      if(this[i] && this[i].parentElement) {
          this[i].parentElement.removeChild(this[i]);
      }
  }
}

// hide - rearrange bullshit
var pageWrapper = document.querySelector(".index-container");
var ScheduleWrapper = document.querySelector(".index-body");
var featuredSection = document.querySelector(".featured").parentElement.parentElement.parentElement;
var showList = document.querySelector("#secondary");
var disqus = document.querySelector("#disqus_thread")
var disqusClone = disqus.cloneNode(true);

pageWrapper.style.flexDirection = "column";
ScheduleWrapper.style.width = "100%";
ScheduleWrapper.style.order = "1";
showList.style.width = "100%";
showList.style.order = "2";
disqusClone.style.order = "3";
featuredSection.remove();
disqus.remove();
pageWrapper.appendChild(disqusClone);

function createButton(anime, type) {
  var element = document.createElement('span');
  element.classList.add("badge")
  element.setAttribute("onClick", (type === "add" ? "addToList" : "removeFromList") + "('" + anime + "')")
  element.innerText = (type === "add" ? "+" : "–")
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

function notify(anime, number) {
  var listOfNotifications = localStorage.getItem("listOfNotifications") || [];
  var show = anime + " " + number
  if(listOfNotifications !== null && listOfNotifications.length !== 0){
    listOfNotifications = JSON.parse(listOfNotifications);
    listOfNotifications.indexOf(show) === -1 ? listOfNotifications.push(show) : null;
    localStorage.setItem("listOfNotifications", JSON.stringify(listOfNotifications));
  } else {
    var shows = [];
    shows[0] = show;
    localStorage.setItem("listOfNotifications", JSON.stringify(shows));
  }

  var notificationOptions = {
    icon: "https://i.imgur.com/FzuPOUP.jpg"
  }

  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(anime + " - " + number + " released!", notificationOptions);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function(permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(anime + " - " + number + " released!", notificationOptions);
      }
    });
  }
}


setInterval(function () {
  var listOfShows = localStorage.getItem("listOfShows") || [];
  var listOfNotifications = localStorage.getItem("listOfNotifications") || [];

  document.querySelectorAll(".latest-releases > ul > li > a").forEach(function (element) {
    var rowText = element.childNodes[1].nodeValue
    var episodeNumber = element.childNodes[2].innerText
    var date = element.childNodes[0]

    date.style.marginTop = "0";
    date.style.width = "100px";
    date.style.textAlign = "right"

    if (!element.classList.contains("updated-row")) {
      var link = element.getAttribute("href");
      element.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); return false; }, null)

      var resChild = element.childNodes[3];
      var linker = function () { window.location = link }

      resChild.style.display = "inline-block"
      resChild.style.float = "right"
      
      resChild.childNodes[0].addEventListener("click", linker, null)
      resChild.childNodes[1].addEventListener("click", linker, null)
      resChild.childNodes[2].addEventListener("click", linker, null)
      resChild.appendChild(createButton(rowText, "remove"));
      resChild.appendChild(createButton(rowText, "add"));
      element.classList.add("updated-row");
    }

    if (listOfShows.indexOf(rowText) >= 0) {
      element.style.backgroundColor = HIGHLIGHT_COLOR;
      if(listOfNotifications.indexOf(rowText + " " + episodeNumber) === -1){
        console.log("match found")
        notify(rowText, episodeNumber);
      }
    } else {
      element.style.backgroundColor = "#ffffff";
    }
  })
}, 500)


