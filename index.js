// ==UserScript==
// @name Shows I'm Watching
// @namespace http://horriblesubs.info/
// @description highlights the shows I'm watching
// @include http://horriblesubs.info/
// @run-at document-idle
// ==/UserScript==

const script1 = document.createElement('script')
script1.type = "text/javascript";
script1.appendChild(document.createTextNode(addToList));

const script2 = document.createElement('script')
script2.type = "text/javascript";
script2.appendChild(document.createTextNode(removeFromList));

(document.body || document.head || document.documentElement).appendChild(script1);
(document.body || document.head || document.documentElement).appendChild(script2);

function createButton(show, buttonType){
  const element = document.createElement('td');
  if(buttonType === "add"){
  	element.innerHTML = `<button style="background-color:#fcfcfc;border:1px solid #d4d4d4;margin:1px;" onClick="addToList('${show}')">+</button>`
  } else if (buttonType == "remove"){
  	element.innerHTML = `<button style="background-color:#fcfcfc;border:1px solid #d4d4d4;margin:1px;" onClick="removeFromList('${show}')">-</button>`
  }
  return element;
}

function addToList(show){
	let listOfShows = JSON.parse(localStorage.getItem("listOfShows"));
  if(listOfShows != null){
  	listOfShows.indexOf(show) === -1 ? listOfShows.push(show) : null;
  	localStorage.setItem("listOfShows", JSON.stringify(listOfShows));
  } else {
    const shows = []
    shows[0] = show
  	localStorage.setItem("listOfShows", JSON.stringify(shows));
  }
}

function removeFromList(show){
	let listOfShows = JSON.parse(localStorage.getItem("listOfShows"));
  if(listOfShows.indexOf(show) > -1){
    listOfShows.splice(listOfShows.indexOf(show), 1)
    localStorage.setItem("listOfShows", JSON.stringify(listOfShows));
  }
}

setInterval(function(){
  let listOfShows = localStorage.getItem("listOfShows") || [];
  document.querySelectorAll(".latest > table > tbody > tr > td > a").forEach(element => {
    const row = element.parentElement.parentElement
    if(row.children.length == 4){
    	row.appendChild(createButton(element.text, "add"));
    	row.appendChild(createButton(element.text, "remove"));
    }
    if (listOfShows.indexOf(element.text) >= 0){
      element.style.backgroundColor = "#91ffd0";
    } else {
    	element.style.backgroundColor = "transparent";
    }
  });
}, 500);