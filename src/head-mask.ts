import * as ZapparThree from "@zappar/zappar-threejs-for-aframe";

// eslint-disable-next-line no-undef
export default AFRAME.registerComponent("zappar-head-mask", {
  schema: {
    face: { type: "string" },
  },
  init() {
    const { el } = this;

    const mesh = new ZapparThree.HeadMaskMeshLoader().load();
    this.mesh = mesh;
    this.mesh.material.colorWrite = false;

    el.setObject3D("mesh", this.mesh);

    const system = document.querySelector("a-scene").systems["zappar-camera"] as any;
    system.registerForCallbacks(
      // eslint-disable-next-line no-underscore-dangle
      (this._frameUpdate = () => {
        if (!this.data) return;
        const face = document.querySelector(this.data.face) as any;
        if (!face || !face.components || !face.components["zappar-face"] || !face.components["zappar-face"].trackerGroup) return;
        mesh.updateFromFaceAnchorGroup(face.components["zappar-face"].trackerGroup);
      })
    );
  },

  remove() {
    const system = document.querySelector("a-scene").systems["zappar-camera"] as any;
    // eslint-disable-next-line no-underscore-dangle
    system.unregisterForCallbacks(this._frameUpdate);

    this.el.removeObject3D("mesh");
  },
});
