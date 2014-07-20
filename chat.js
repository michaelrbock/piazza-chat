
var room;
var me;

window.onload = function() {

  var tablink;

  console.log('running the onload thing');
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {
      chrome.tabs.executeScript(
        activeTabs[0].id, {file: 'send_links.js', allFrames: true});
    });
    //to get class id
    chrome.tabs.getSelected(null,function(tab) {
      tablink = tab.url;
    });

  });

  chrome.extension.onRequest.addListener(function(info_to_send) {
    console.log("chat.js received info: " + info_to_send);

    var classId = tablink.split('class/')[1];
    classId = classId.split('?')[0];

    me = {userId: info_to_send.user_full_name, klassId: classId,
          klass: info_to_send.class_name, name: info_to_send.user_full_name};

    var socket = io.connect('http://ec2-54-186-60-145.us-west-2.compute.amazonaws.com:3456');

    socket.on('connect', function(){
      socket.emit('init_message', me);
    });

    $('#class_name').text(info_to_send.class_name + ' Chat');

    // Received from the server
    socket.on('render_chat', function(content) {
      // content : {room: room, content: 'some string'}
      room = content.room;
      console.log(content);
      $("#messagesDiv").text("");
      content.room.messages.slice(content.room.messages.length-50, content.room.messages.length-1);
      for (var i = 0; i < content.room.messages.length; ++i) {
        displayChatMessage(content.room.messages[i].poster.name, content.room.messages[i].content,
          Date.parse(content.room.messages[i].time));
      }
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

      var wrapper = $('<div/>');
      wrapper.appendTo($('#messagesDiv'));

      var userText = $('<span/>').text(name + ' ');
      userText.css('font-weight', 'bold')
      userText.appendTo(wrapper);

      var timeText = $('<span/>').text('(' + time_string + '): ');
      timeText.css('color', '#8D8C8F');
      timeText.css('font-size', '0.8em');
      timeText.appendTo(wrapper);

      var chatText = $('<span/>').text(text);
      chatText.appendTo(wrapper);
      $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
    };

    function open_video_chat_window(url){
      chrome.windows.create({
        type: 'popup',
        url: url
      });
    }

    $("button").bind("click", function() {
      open_video_chat_window('http://ec2-54-186-60-145.us-west-2.compute.amazonaws.com:3456/?klassId='+me.klassId+'&userId='+me.userId);
    });

  });

};