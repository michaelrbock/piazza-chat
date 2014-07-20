var room;
var me = {userId: '1', klassId: '200', klass: 'CSE 101', name: 'User'};

var socket = io.connect('http://ec2-54-186-60-145.us-west-2.compute.amazonaws.com:3456');

// Received from the server
socket.on('render_chat', function(content) {
  // content : {room: room, content: 'some string'}
  room = content.room;
  console.log(content);
  $("#messagesDiv").text("");
  for (var i = 0; i < content.room.messages.length; ++i) {
    displayChatMessage(content.room.messages[i].poster.name, content.room.messages[i].content,
      content.room.messages[i]);
  }
  // displayChatMessage(content.name, content.text);
});

// Sent to the server
function sendMessage(message) {
    socket.emit('send_message', {content: message, room: room, messageType: 'chat', poster: me});
}



// var myDataRef = new Firebase('https://qpv6vlip1d8.firebaseio-demo.com/');
$('#messageInput').keypress(function (e) {
  if (e.keyCode == 13 && $("#messageInput").val() != "") {
    var text = $('#messageInput').val();
    sendMessage(text);
    $('#messageInput').val('');
  }
});
// myDataRef.on('child_added', function(snapshot) {
//   var message = snapshot.val();
//   displayChatMessage(message.name, message.text);
// });
function displayChatMessage(name, text, time) {
  $('<div/>').text(text + '(' + time + ')').prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
  $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
};

chrome.extension.onRequest.addListener(function(info_to_send) {

  console.log("chat.js received info: " + info_to_send);
  me.name = info_to_send.user_full_name;
  me.userId = info_to_send.user_full_name;
  $('#class_name').text(info_to_send.class_name);

  socket.on('connect', function(){
    socket.emit('init_message', me);
  });

});

window.onload = function() {

  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {
      chrome.tabs.executeScript(
        activeTabs[0].id, {file: 'send_links.js', allFrames: true});
    });
  });
};