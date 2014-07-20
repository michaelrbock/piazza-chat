// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Send back to the popup a sorted deduped list of valid link URLs on this page.
// The popup injects this script into all frames in the active tab.

var links = [].slice.apply(document.getElementsByTagName('a'));
var test = [].slice.apply(document.getElementsByTagName('span'));

var user_full_name = $(".my_name").text();
var class_name = $(".current_class_name").text();
var info_to_send = {
	'user_full_name': user_full_name,
	'class_name': class_name
};
//alert(user_full_name)
chrome.extension.sendRequest(info_to_send);

// var $test2 = $( "span" ).get();
// console.log("send_links.js");

// var users = [];

// $("span").each(function(index) {
//   if ($(this).attr("anon") == "no") {
//     users.push({
//       "user_id": $(this).attr("class"),
//       "user_name": $(this).text()
//     });
//   }
// });

// console.log(users);

// function compare(a,b) {
//   if (a.user_name < b.user_name)
//      return -1;
//   if (a.last_nom > b.last_nom)
//     return 1;
//   return 0;
// }

// users.sort(compare);


// links = links.map(function(element) {
//   // Return an anchor's href attribute, stripping any URL fragment (hash '#').
//   // If the html specifies a relative path, chrome converts it to an absolute
//   // URL.
//   var href = element.href;
//   var hashIndex = href.indexOf('#');
//   if (hashIndex >= 0) {
//     href = href.substr(0, hashIndex);
//   }
//   return href;
// });

// links.sort();

// // Remove duplicates and invalid URLs.
// var kBadPrefix = 'javascript';
// for (var i = 0; i < links.length;) {
//   if (((i > 0) && (links[i] == links[i - 1])) ||
//       (links[i] == '') ||
//       (kBadPrefix == links[i].toLowerCase().substr(0, kBadPrefix.length))) {
//     links.splice(i, 1);
//   } else {
//     ++i;
//   }
// }

//chrome.extension.sendRequest(links);
