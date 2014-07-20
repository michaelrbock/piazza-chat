var user_full_name = $(".my_name").text();
var class_name = $(".current_class_name").text();

var info_to_send = {
  'user_full_name': user_full_name,
  'class_name': class_name
};

chrome.extension.sendRequest(info_to_send);

