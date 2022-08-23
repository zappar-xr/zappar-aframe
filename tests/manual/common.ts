import * as AFRAME from "aframe";
import * as ZapparThree from "@zappar/zappar-threejs-for-aframe";
import * as ZapparAFrame from "../../src";

console.log(AFRAME.version);
console.log(ZapparAFrame);
ZapparAFrame.setLogLevel(ZapparAFrame.LogLevel.LOG_LEVEL_VERBOSE);

const setupDomButtons = () => {
  document.body.style.display = "flex";
  document.body.style.flexDirection = "column";

  const options = document.createElement("div") as unknown as HTMLDivElement;
  const style = {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    height: "50px",
    width: "100%",
    zIndex: "300",
  };

  Object.assign(options.style, style);

  document.body.appendChild(options);

  const recordSequence = document.createElement("button") as unknown as HTMLButtonElement;
  recordSequence.id = "recordSequence";
  recordSequence.innerHTML = "Record";

  const playSequence = document.createElement("button") as unknown as HTMLButtonElement;
  playSequence.id = "playSequence";
  playSequence.innerHTML = "Play";

  options.appendChild(recordSequence);
  options.appendChild(playSequence);
};

window.onload = () => {
  setupDomButtons();
  const system = document.querySelector("a-scene").systems["zappar-camera"];
  const { camera } = system as any;
  const recordSequence = document.querySelector("#recordSequence") as unknown as HTMLButtonElement;
  recordSequence.addEventListener("click", () => {
    camera.pipeline.sequenceRecordStart(6 * 25);
    recordSequence.disabled = true;
    setTimeout(() => {
      camera.pipeline.sequenceRecordStop();
      const data = camera.pipeline.sequenceRecordData();
      const blob = new Blob([data], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a") as unknown as HTMLAreaElement;
      a.download = "sequence.uar";
      a.href = url;
      a.click();
      recordSequence.disabled = false;
    }, 5000);
  });

  let sequenceSource: ZapparAFrame.SequenceSource | undefined;

  const playSequence = document.querySelector("#playSequence") as unknown as HTMLButtonElement;
  playSequence.addEventListener("click", () => {
    const upload = document.createElement("input") as unknown as HTMLInputElement;
    upload.type = "file";
    upload.addEventListener("change", async () => {
      if (!sequenceSource) sequenceSource = new ZapparAFrame.SequenceSource(camera.pipeline);
      const f = upload.files?.[0];
      if (!f) return;
      sequenceSource.load(await f.arrayBuffer());
      sequenceSource.start();
    });
    upload.click();
  });
};
