import { exec } from "child_process";
import cors from "cors";
import voice from "elevenlabs-node";
import express from "express";
import { promises as fs } from "fs";
import scriptD from "./japanScript.js";

const elevenLabsApiKey = "sk_f3a96b3c7c5a67f6ebe8ca13a2fea2c5ad2f07c4c2175703";
const MalevoiceID = "cjVigY5qzO86Huf0OWal";
const FemaleVoiceId = "cgSgspJ2msm6clMCkdW9";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (i, j,k) => {
  const time = new Date().getTime();
  console.log(`Starting conversion for message ${k}${i}${j}`);
  await execCommand(
    `ffmpeg -y -i ./public/audios/dialog_${k}${i}${j}.mp3 ./public/audios/dialog_${k}${i}${j}.wav`
    // -y to overwrite the file
  );
  console.log(`Conversion done in ${new Date().getTime() - time}ms`);
  await execCommand(
    `bin\\rhubarb.exe -f json -o .\\public\\audios\\dialog_${k}${i}${j}.json .\\public\\audios\\dialog_${k}${i}${j}.wav -r phonetic`
  );
  // -r phonetic is faster but less accurate
  console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
};

export const createAudio = async () => {
  console.log("Creating audio");
  let audioData = [];
  for(let k=0;k< scriptD.length;k++){



  const speechArr = scriptD[k].script;
  let SceneaudioData = [];
  for (let i = 0; i < speechArr.length; i++) {

    let SpeechAudioData = [];
    const isFemale = speechArr[i].speaker === "Kieth" ? false : true;
    const dialogArr = speechArr[i].speech;

    for (let j = 0; j < dialogArr.length; j++) {
      const dialog = dialogArr[j].text;
      console.log("Current DIalog: " + dialog);
      const fileName = `./public/audios/dialog_${k}${i}${j}.mp3`;
      await voice.textToSpeech(
        elevenLabsApiKey,
        isFemale ? FemaleVoiceId : MalevoiceID,
        fileName,
        dialog
      );
      await lipSyncMessage(i, j,k);
      const currentAudioData = {
        audio: await audioFileToBase64(fileName),
        lipsync: await readJsonTranscript(
          `./public/audios/dialog_${k}${i}${j}.json`
        ),
      };
      SpeechAudioData.push(currentAudioData);
    }
    SceneaudioData.push(SpeechAudioData);
  } 
      audioData.push(SceneaudioData);
  }


  const jsonString = JSON.stringify(audioData, null, 2);

  try {
    await fs.writeFile("audioData.json", jsonString);
    console.log("File has been saved!");
  } catch (err) {
    console.error("Error writing file:", err);
  }

  console.log("pello");
};

const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};

app.listen(port, () => {
  createAudio();
  console.log(`Virtual Girlfriend listening on port ${port}`);
});
