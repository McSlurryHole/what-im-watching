// ==UserScript==
// @name Shows I'm Watching
// @namespace http://horriblesubs.info/
// @description highlights the shows I'm watching
// @include http://horriblesubs.info/
// @run-at document-idle
// ==/UserScript==

// SETTINGS
const HIGHLIGHT_COLOR = "#91ffd0";
const BUTTON_STYLES = `background-color:#fcfcfc;
											 border:none;
											 color:#0066cc;
											 margin:1px;
											 width:25px;`

// BEGIN SCRIPT
const script1 = document.createElement('script')
script1.type = "text/javascript";
script1.appendChild(document.createTextNode(addToList));

const script2 = document.createElement('script')
script2.type = "text/javascript";
script2.appendChild(document.createTextNode(removeFromList));

const thePage = (document.body || document.head || document.documentElement)

thePage.appendChild(script1)
thePage.appendChild(script2)

function createButton(anime, type){
  const element = document.createElement('td');
  element.innerHTML = `<button 
													style="${BUTTON_STYLES}"
													onClick="${(type === "add")? "addToList" : "removeFromList"}('${anime}')">
													${(type === "add")? "+" : "-"}
											 </button>`
  return element;
}

function addToList(show){
	let listOfShows = localStorage.getItem("listOfShows");
  if(listOfShows !== null){
   	listOfShows = JSON.parse(listOfShows)
  	listOfShows.indexOf(show) === -1 ? listOfShows.push(show) : null;
  	localStorage.setItem("listOfShows", JSON.stringify(listOfShows));
  } else {
    const shows = []
    shows[0] = show
  	localStorage.setItem("listOfShows", JSON.stringify(shows));
  }
}

function removeFromList(show){
  let listOfShows = localStorage.getItem("listOfShows");
  if(listOfShows !== null){
  	listOfShows = JSON.parse(listOfShows)
  	if(listOfShows.indexOf(show) > -1){
    	listOfShows.splice(listOfShows.indexOf(show), 1)
    	localStorage.setItem("listOfShows", JSON.stringify(listOfShows));
    }
  }
}

setInterval(function(){
  let listOfShows = localStorage.getItem("listOfShows") || [];
  document.querySelectorAll(".latest > table > tbody > tr > td > a").forEach(element => {
    const row = element.parentElement.parentElement
    if(row.children.length == 4){
    	row.insertBefore(createButton(element.text, "remove"), row.children[0]);
    	row.insertBefore(createButton(element.text, "add"), row.children[0]);
    }
    if (listOfShows.indexOf(element.text) >= 0){
      row.style.backgroundColor = HIGHLIGHT_COLOR;
    } else {
    	row.style.backgroundColor = "transparent";
    }
  });
}, 500);
