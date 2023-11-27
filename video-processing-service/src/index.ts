
import express from "express"; // handles HTTP requests in node app
import ffmpeg from "fluent-ffmpeg"; // wrapper, allows video and audio processing

const app = express(); //create an instance of express for server

app.post("/processed-video", (req, res) => { // POST route at "" path, run below function when accessed 
    
  // get path of the input/output video file from the request body and store
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  // Good practice for error handling. If above parameters are null.
  if (!inputFilePath || !outputFilePath) {          
    res.status(400).send("Bad request: Missing file path");     
  }

  // create ffmpeg command and inputFilePath is source file 
  ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=-1:360") // converting the video to 360p
    .on("end", () => {      // event listener for when FFmpeg finishes processing
      res.status(200).send("Processing finished successfully.");    
    })
    .on("error", (err) => {     // event listener for FFmpeg processing error
      console.log(`An error occured: ${err.message}`);      // logs error
      res.status(500).send(`Internal Server Error: ${err.message}`);
    })
    .save(outputFilePath);      // processed video is saved as outputFilePath
});


const port = process.env.PORT || 3000; //a standard way to set port as any port if given or port = 3000;

app.listen(port, () => {        // starts express server, listening for port
  console.log(`Server running at http://localhost:${port}`);
});