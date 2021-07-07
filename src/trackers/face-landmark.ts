/* eslint-disable no-underscore-dangle */
import * as ZapparThree from "@zappar/zappar-threejs-for-aframe";

// eslint-disable-next-line no-undef
export default AFRAME.registerComponent("zappar-face-landmark", {
  schema: {
    target: { type: "string", default: "nose-tip" },
    face: { type: "string" },
  },
  init() {
    const { el } = this;
    const system = document.querySelector("a-scene").systems["zappar-camera"] as any;
    const { camera } = system;
    const scene = document.querySelector("a-scene").object3D;

    const face = document.querySelector(this.data.face) as any;
    if (!face || !face.components || !face.components["zappar-face"] || !face.components["zappar-face"].trackerGroup) {
      throw new Error("Face tracker could not be found.");
    }

    this.trackerGroup = new ZapparThree.FaceLandmarkGroup(
      camera,
      face.components["zappar-face"].trackerGroup.faceTracker,
      // String to enum key format conversion. I.e nose-tip -> ZapparThree.FaceLandmarkName.NOSE_TIP
      ZapparThree.FaceLandmarkName[(this.data.target as any).toUpperCase().replace("-", "_")] as any
    );

    scene.add(this.trackerGroup);

    el.object3D.matrixAutoUpdate = false;

    system.registerForCallbacks(
      (this._frameUpdate = () => {
        el.object3D.matrix = this.trackerGroup.matrix;
      })
    );
  },
  remove() {
    const system = document.querySelector("a-scene").systems["zappar-camera"] as any;
    system.unregisterForCallbacks(this._frameUpdate);

    const { trackerGroup } = this;
    trackerGroup.landmark.destroy();
  },
});
