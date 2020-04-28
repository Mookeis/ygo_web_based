// Following the tutorial which can be found here: https://css-tricks.com/jquery-php-chat/
var instanse = false;
var state;
var mes;
var file;

function Chat() {
  this.update = updateChat;
  this.send = sendChat;
  this.getState = getStateOfChat;
}

function getStateOfChat() {
  if (!instanse) {
    instanse = true;
    $.ajax({
      type: "POST",
      url: "process.php",
      data: {
        function: "getState",
        file: file,
      },
      dataType: "json",

      success: function (data) {
        state = data.state;
        instanse = false;
      },
    });
  }
}

function updateChat() {
  if (!instanse) {
    instanse = true;
    $.ajax({
      type: "POST",
      url: "process.php",
      data: {
        function: "update",
        state: state,
        file: file,
      },
      dataType: "json",
      success: function (data) {
        if (data.text) {
          for (var i = 0; i < data.text.length; i++) {
            $("#chat-area").append($("<p>" + data.text[i] + "</p>"));
            $("#chat-area").append($("<hr>"));
          }
        }
        document.getElementById(
          "chat-area"
        ).scrollTop = document.getElementById("chat-area").scrollHeight;
        instanse = false;
        state = data.state;
      },
    });
  } else {
    setTimeout(updateChat, 1500);
  }
}

function sendChat(message, nickname) {
  updateChat();
  $.ajax({
    type: "POST",
    url: "process.php",
    data: {
      function: "send",
      message: message,
      nickname: nickname,
      file: file,
    },
    dataType: "json",
    success: function (data) {
      updateChat();
    },
  });
}

let name = "Anon ";
if ($("#userlogin").length) {
  name = $("#userlogin").text();
}
var chat = new Chat();
$(function () {
  chat.getState();

  $("#sendie").keydown(function (event) {
    var key = event.which;

    if (key >= 33) {
      var maxLength = $(this).attr("maxlength");
      var length = this.value.length;

      if (length >= maxLength) {
        event.preventDefault();
      }
    }
  });
  $("#sendie").keyup(function (e) {
    if (e.keyCode == 13) {
      var text = $(this).val();
      var maxLength = $(this).attr("maxlength");
      var length = text.length;

      if (length <= maxLength + 1) {
        chat.send(text, name);
        $(this).val("");
      } else {
        $(this).val(text.substring(0, maxLength));
      }
    }
  });
});
