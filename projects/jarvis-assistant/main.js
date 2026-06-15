$(document).ready(function () {

  // Initialize Eel mock
  eel.init()();

  // Commented out textillate animation calls since they are not loaded in index.html
  /*
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
  */

  var siriWave = new SiriWave({
    container: document.getElementById("siri-container"),
    width: 600,
    style: "ios9",
    amplitude: "1",
    speed: "0.30",
    height: 60,
    autostart: true,
    waveColor: "#ff0000",
    waveOffset: 0,
    rippleEffect: true,
    rippleColor: "#ffffff",
  });

  $("#MicBtn").click(function () {
    eel.play_assistant_sound();
    $("#siri-wave-wrapper").show();

    eel.takeAllCommands()();
  });

  function doc_keyUp(e) {

    if (e.key === "j" && e.metaKey) {
      eel.play_assistant_sound();
      $("#siri-wave-wrapper").show();
      eel.takeAllCommands()();
    }
  }
  document.addEventListener("keyup", doc_keyUp, false);

  function PlayAssistant(message) {
    if (message != "") {
      // Append user prompt to chat log
      $("#chat-log").append(`
        <div class="width-size align-self-end text-end mb-2 ms-auto">
          <div class="sender_message" style="display: inline-block; padding: 8px 12px; border-radius: 15px 15px 0 15px; background: #0045ff; color: white; text-align: left;">${message}</div>
        </div>
      `);
      
      // Auto scroll to bottom
      $("#chat-log").scrollTop($("#chat-log")[0].scrollHeight);

      $("#siri-wave-wrapper").show();
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