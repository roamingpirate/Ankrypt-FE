// worker.js
onmessage = function (e) {
    const { action, data } = e.data;
  
    if (action === "capture-frame") {
      // Process the frame data (e.g., compress or prepare it for video creation)
      // For simplicity, let's just log the frame data
      console.log("Received frame data", data);
  
      // Here you can do any processing, like compressing the frame or saving it to a queue
  
      // Once a frame is processed, send a response back to the main thread
      postMessage({
        action: "frame-processed",
        data: "frame processed successfully",
      });
    }
  };
  