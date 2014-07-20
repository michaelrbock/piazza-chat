
var room;

window.onload = function() {

  console.log('running the onload thing');
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {
      chrome.tabs.executeScript(
        activeTabs[0].id, {file: 'send_links.js', allFrames: true});
    });
  });

  chrome.extension.onRequest.addListener(function(info_to_send) {
    console.log("chat.js received info: " + info_to_send);

    //var randInt = Math.random()*10000;
    var me = {userId: '1', klassId: '200', klass: 'CSE 101', name: 'User'};

    var socket = io.connect('http://ec2-54-186-60-145.us-west-2.compute.amazonaws.com:3456');


    me.name = info_to_send.user_full_name;
    me.userId = info_to_send.user_full_name; //+ randInt.toString();
    $('#class_name').text(info_to_send.class_name);

    socket.on('connect', function(){
      socket.emit('init_message', me);
    });

    // Received from the server
    socket.on('render_chat', function(content) {
      // content : {room: room, content: 'some string'}
      room = content.room;
      console.log(content);
      $("#messagesDiv").text("");
      content.room.messages.slice(content.room.messages.length-50, content.room.messages.length-1)
      for (var i = 0; i < content.room.messages.length; ++i) {
        displayChatMessage(content.room.messages[i].poster.name, content.room.messages[i].content,
          Date.parse(content.room.messages[i].time));
      }
      // displayChatMessage(content.name, content.text);
    });

    // Sent to the server
    function sendMessage(message) {
      console.log('sendMessage ran');
      // terrible hack to wait till room is defined
      if (!room) {
        console.log('no room');
        return;
      }
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

    function displayChatMessage(name, text, time) {
      var date = new Date(time);
      var time_string = moment(date).format('h:mm:ss a');
      $('<div/>').text('(' + time_string + '): ' + text).prepend($('<em/>').text(name)).appendTo($('#messagesDiv'));
      $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
    };

  });
};