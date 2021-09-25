/*
	Simple script - facebook unliker
	(c) FreeAngel - 2021
	https://www.youtube.com/channel/UCqRqvw9n7Lrh79x3dRDOkDg
*/

/* you can edit this value ----------------------------------------------------- */
const interval = 5000;
const wait_delay = 5;
const reload_after_unlike = 40;
const ignore_names =[
						"Mak Lambe Turah",
						"Japanese﻿﻿",
						"Series You By Ann Lisa﻿"
					];
/* ----------------------------------------------------------------------------- */

const _NO_SECTION_TIMEOUT = 120; // every 120 secs (two minutes) if no item found will reload the page
cur_tick = 0;
no_section = false;
unlike_count = 0;

    
	   var readyStateCheckInterval = setInterval(function() {

	   if (document.readyState === "complete") {

	    cur_tick += interval/1000;
		
		DoJob();

		console.log("Wait ...");
	   }
	}, interval);
	
function DoJob(){
	
	if(cur_tick < wait_delay ) { console.log("waiting delay (10s) : "+cur_tick); return; }

	var cur_url = window.location.href;
	
	if(no_section) { 
	
		if (cur_tick >= _NO_SECTION_TIMEOUT) { console.log("reloading page ..."); window.location.href = cur_url; }
		return; 
	}

	if(cur_url.indexOf("facebook.com") === -1) { return; }
	if(cur_url.indexOf("/likes") === -1) { return; }
	
	if(unlike_count >= reload_after_unlike) { console.log("reloading page ..."); window.location.href = cur_url; }
	
	QuerySection();
}

function QuerySection(){
	var div = document.querySelector('div[class="j83agx80 btwxx1t3 lhclo0ds"]');
	var section = div.querySelectorAll('div[class="l9j0dhe7"]');
	if(!section) { no_section = true; return; }
	
	var sign = null;
	var img = null;
	var uname = "";
	var lastSection = null;
	var found = 0;
	
	for(var i=0; i<section.length; i++){
	
		lastSection = section[i];
		img = section[i].getElementsByTagName("img");
		if(img === null) { continue; }
		sign = section[i].getAttribute("signed");
		if(sign === "1"){ 
			continue; 
		}
		
		section[i].setAttribute("signed",1);
		uname = getUser(section[i]);
		console.log(uname);
		if(isIgnored(uname)){
			console.log("ignored");
			continue;
		}
		
		found++;
		var hv = section[i].getElementsByTagName("div")[0];
		hover(hv);
		unlike_count++;

		setTimeout(function(){
			UnLike();
		}, 2000);
		
		break;
	}
	
	if(lastSection) { lastSection.scrollIntoView(); }
	
	if(found < 1) { no_section = true; }
}

function getUser(sec){
	
	var div = sec.querySelectorAll('span[dir="auto"]');
	if(!div) { return ""; }
	var s = div[0].textContent;
	if(s) {	return s.trim(); } else { return ""; }
}

function hover(element){
	element.addEventListener('mouseover', null);

	var event = new MouseEvent('mouseover', {
	  'view': window,
	  'bubbles': true,
	  'cancelable': true
	});

	element.dispatchEvent(event);
}

function UnLike(){
	var ar = document.querySelector('div[aria-label="Liked"]');
	if(ar){
		ar.click();
	} else {
		ar = document.querySelector('div[aria-label="Like"]');
	}

	if(!ar){ return; }
	
	var ch = ar;
	var pr = ar.parentElement;
	var found = null;
	while (pr){
		
		if((pr.className === '__fb-light-mode') || (pr.className === '__fb-dark-mode')){
			
			found = pr;
			break;
		}
		
		ch = pr;
		pr = pr.parentElement;
	}
	
	if(!found) { return; }
	
	setTimeout(function(){
		pr.removeChild(ch);
	},1000);
}

function isIgnored(uname){

	var b = false;
	for(var i=0; i<ignore_names.length; i++){
		
		var s = ignore_names[i].trim();
		if(uname === s){
			
			b = true;
			break;
		}
	}
	
	return b;
}
