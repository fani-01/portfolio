$(document).ready(function () {

  // Live system clock updater
  function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    const timeStr = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    $("#system-time").text(timeStr);
  }
  updateTime();
  setInterval(updateTime, 1000);

  var siriWave;

  // Initialize SiriWave
  function initSiriWave() {
    try {
      const container = document.getElementById("siri-container");
      if (container) {
        siriWave = new SiriWave({
          container: container,
          width: container.offsetWidth || 500,
          style: "ios9",
          amplitude: "1.2",
          speed: "0.20",
          height: 60,
          autostart: true,
          waveColor: "#002bff",
          waveOffset: 0,
          rippleEffect: true,
        });
      }
    } catch (err) {
      console.warn("SiriWave initialization failed:", err);
    }
  }

  // Handle initialization overlay click
  $("#activate-btn").click(function (e) {
    e.preventDefault();
    
    // Hide overlay with fade effect
    $("#activation-overlay").css("opacity", 0);
    setTimeout(function () {
      $("#activation-overlay").hide();
    }, 500);

    // Play welcome sound and speak the welcome intro ONLY ONCE
    eel.init()();

    // Init SiriWave after overlay is cleared
    initSiriWave();
  });

  // Handle Voice Input click
  $("#MicBtn").click(function (e) {
    e.preventDefault();
    eel.play_assistant_sound();
    $("#siri-wave-wrapper").show();
    eel.takeAllCommands()();
  });

  // Keyboard shortcut (Alt + J) to trigger voice
  function doc_keyUp(e) {
    if (e.key === "j" && e.altKey) {
      e.preventDefault();
      eel.play_assistant_sound();
      $("#siri-wave-wrapper").show();
      eel.takeAllCommands()();
    }
  }
  document.addEventListener("keyup", doc_keyUp, false);

  // Send message helper
  function PlayAssistant(message) {
    if (message.trim() != "") {
      // Append user prompt to chat log
      $("#chat-log").append(`
        <div class="width-size align-self-end text-end mb-2 ms-auto">
          <div class="sender_message">${message}</div>
        </div>
      `);
      
      // Auto scroll to bottom
      $("#chat-log").scrollTop($("#chat-log")[0].scrollHeight);

      // Trigger Jarvis command processing
      $("#siri-wave-wrapper").show();
      eel.takeAllCommands(message)();
      
      // Reset input bar
      $("#chatbox").val("");
      $("#MicBtn").show();
      $("#SendBtn").hide();
    }
  }

  // Show/hide Send and Mic buttons based on input
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
    ShowHideButton(message);
  });

  $("#SendBtn").click(function (e) {
    e.preventDefault();
    let message = $("#chatbox").val();
    PlayAssistant(message);
  });

  $("#chatbox").keypress(function (e) {
    if (e.which == 13) {
      e.preventDefault();
      let message = $("#chatbox").val();
      PlayAssistant(message);
    }
  });

  // Toggle SiriWave wrapper on Chat button click
  $("#ChatBtn").click(function (e) {
    e.preventDefault();
    $("#siri-wave-wrapper").toggle();
  });

  // Ensure window resizing keeps SiriWave responsive
  $(window).resize(function() {
    if (siriWave && document.getElementById("siri-container")) {
      const w = document.getElementById("siri-container").offsetWidth || 500;
      siriWave.width = w;
      siriWave.start();
    }
  });

});