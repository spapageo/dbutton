/*
 *     This file is part of dbutton.
 *
 *  dbutton is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  dbutton is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with dbutton.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * 
 */


// Get rid of all the iframes in the page the make it down so slow;
$("iframe").remove();
//Get rid of all the javascript in the pages
$("script").remove();
$("#bottomad").remove();

// Fix the pages input filleds
$("input").css("max-width","140px");
$("select").css("max-width","140px");
$("input[type=\"submit\"]").addClass("btn");


// Add the buttton html bellow every post tittle and use jquery-ui to style it
$(".entry > .entrymeta").append("	<div class=\"btn-group\"><button class=\"dbutton btn btn-large btn-primary\">Download!</button>\
					<button data-toggle=\"dropdown\" class=\"dbutton-drop btn btn-large btn-primary dropdown-toggle\">@</span></button> <ul class=\"dropdown-menu\"></div>");

// Make the button group float t the right
$(".dbutton").parent().css("float","right");


// The function that finds the element caller
var clfun = function(event){
  var $target = $(event.target);
  var title = $target.closest(".entrymeta").siblings(".entrytitle").children("a").html();
  var categories = $target.closest(".entrymeta").children("a[rel=\"category tag\"]").map(function(index,element){
    return $(element).text();
  }).toArray();
  if($target.hasClass("dbutton-drop")){
    $(".dropdown-menu").empty();
    pbRequest(title,categories,true);
  }else{
    pbRequest(title,categories,false);
  }
}

// The funtion that processes the pirate bay search result page
var processRes = function(data, textStatus, jqXHR){
  if($("img[alt=\"Magnet link\"]",data).size() != 0){
    window.open($("img[alt=\"Magnet link\"]",data).parent().attr("href"));
  }else{
    alert("No torrent found.");
  }
};

// The funtion that processes the pirate bay search result page
var processResList = function(data, textStatus, jqXHR){
  var $titlesLinks = $(".detName > a",data);
  $titlesLinks.each(function(index,element){
    element.href = $(".detName",data).eq(index).next().attr("href");
    element.title = "Magnet Link";
  });
  var $seeders = $(".detName",data).parent().next().map(function(index,element){
    return $("<p />").text($(element).text()+" |");
  });
  
  $seeders.each(function(index,element){
    $titlesLinks.eq(index).text($(element).text() + $titlesLinks.eq(index).text());
  });
  
  $titlesLinks.wrap("<li />");
  $(".open > ul").append($titlesLinks);
};


// The funtion that requests the pirate bay search result page
var pbRequest = function(title, categories,showList){
  var url;
  if (jQuery.inArray("Movies",categories) != -1) {
    url = "http://thepiratebay.se/search/%s/0/7/201";
  } else if(jQuery.inArray("TV Shows",categories) != -1){
    url = "http://thepiratebay.se/search/%s/0/7/205";
  } else if(jQuery.inArray("Games",categories) != -1){
    url = "http://thepiratebay.se/search/%s/0/7/400"
  } else {
    url = "http://thepiratebay.se/search/%s/0/7/0";
  }
  
  // Remove all dots and dashes
  var regex = new RegExp("[^a-z0-9]", 'gi');
  var t = title.toLowerCase().trim().replace(regex," ");
  
  //find the release type
  var result = t.match("ts|dvdrip|720p|cam|vod|r5|r6|r9|dvdscr|dvdvod|dvdr|bdrip|bluray|1080p");
  
  // Try to crop the title after the release year
  var cutIndex = t.search("[12][0-9]{3}");
  t = (cutIndex === -1) ? t : t.slice(0,cutIndex+5);
  // Try to crop the title afte the release quality
  cutIndex = t.search("ts|dvdrip|720p|cam|vod|r5|r6|r9|dvdscr|dvdvod|dvdr|bdrip|bluray|1080p");
  t = (cutIndex === -1) ? t : t.slice(0,cutIndex);
  
  // Prepare the url to be used in the get request
  if(result != null){
    url = url.replace("%s",t.trim()+"+"+result[0]);
  }else{
    url = url.replace("%s",t.trim());
  }
  
  // Perform the request and assign a success callback function
  if(showList){
    $.get(url, processResList);
  }else{
    $.get(url, processRes);
  }


};

//Set the onclick function for every button, with the current arguments
$(".dbutton").on("click",clfun);
$(".dropdown-toggle").on("click",clfun);