$(document).ready(function () {

  eel.init()()
  $(".text").textillate({
    loop: true,
    speed: 1500,
    sync: true,
    in: {
      effect: "bounceIn",
    },
    out: {
      effect: "bounceOut",
    },
  });

  $(".siri-message").textillate({
    loop: true,
    sync: true,
    in: {
      effect: "fadeInUp",
      sync: true,
    },
    out: {
      effect: "fadeOutUp",
      sync: true,
    },
  });

  var siriWave = new SiriWave({
    container: document.getElementById("siri-container"),
    width: 940,
    style: "ios9",
    amplitude: "1",
    speed: "0.30",
    height: 200,
    autostart: true,
    waveColor: "#ff0000",
    waveOffset: 0,
    rippleEffect: true,
    rippleColor: "#ffffff",
  });

  $("#MicBtn").click(function () {
    eel.play_assistant_sound();
    $("#Oval").hide();
    $("#SiriWave").show();

    eel.takeAllCommands()();
  });

  function doc_keyUp(e) {

    if (e.key === "j" && e.metaKey) {
      eel.play_assistant_sound();
      $("#Oval").hide();
      $("#SiriWave").show();
      eel.takeAllCommands()();
    }
  }
  document.addEventListener("keyup", doc_keyUp, false);

  function PlayAssistant(message) {
    if (message != "") {
      $("#Oval").hide();
      $("#SiriWave").show();
      eel.takeAllCommands(message)();
      $("#chatbox").val("");
      $("#MicBtn").show();
      $("#SendBtn").hide();
    } else {
      console.log("Empty message, nothing sent."); 
    }
  }

  function ShowHideButton(message) {
    if (message.length == 0) {
      $("#MicBtn").show();
      $("#SendBtn").hide();
    } else {
      $("#MicBtn").hide();
      $("#SendBtn").show();
    }
  }

  $("#chatbox").keyup(function () {
    let message = $("#chatbox").val();
    console.log("Current chatbox input: ", message); 
    ShowHideButton(message);
  });

  $("#SendBtn").click(function () {
    let message = $("#chatbox").val();
    PlayAssistant(message);
  });

  $("#chatbox").keypress(function (e) {
    key = e.which;
    if (key == 13) {
      let message = $("#chatbox").val();
      PlayAssistant(message);
    }
  });
});