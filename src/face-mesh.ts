import { FaceMeshLoader, FaceBufferGeometry } from "@zappar/zappar-threejs-for-aframe";

// eslint-disable-next-line no-undef
export default AFRAME.registerGeometry("face-mesh", {
  schema: {
    face: { type: "string" },
    model: { type: "string" },
    fillMouth: { type: "boolean" },
    fillEyeLeft: { type: "boolean" },
    fillEyeRight: { type: "boolean" },
    fillNeck: { type: "boolean" },
  },
  init(data) {
    // eslint-disable-next-line no-param-reassign
    data.buffer = false; // It's already a buffer geometry

    const opts = {
      fillMouth: data.fillMouth || false,
      fillEyeLeft: data.fillEyeLeft || false,
      fillEyeRight: data.fillEyeRight || false,
      fillNeck: data.fillNeck || false,
    };

    const mesh = data.model === "full-head-simplified" ? new FaceMeshLoader().loadFullHeadSimplified(opts) : new FaceMeshLoader().loadFace(opts);
    const geometry = new FaceBufferGeometry(mesh);
    this.geometry = geometry;

    const system = document.querySelector("a-scene").systems["zappar-camera"] as any;
    system.registerForCallbacks(
      // eslint-disable-next-line no-underscore-dangle
      (this._frameUpdate = () => {
        const face = document.querySelector(data.face) as any;
        if (!face || !face.components || !face.components["zappar-face"] || !face.components["zappar-face"].trackerGroup) return;
        geometry.updateFromFaceAnchorGroup(face.components["zappar-face"].trackerGroup);
      })
    );
  },
});
