import { TargetImagePreviewMesh } from "@zappar/zappar-threejs-for-aframe";
// eslint-disable-next-line no-undef
export default AFRAME.registerComponent("target-image-preview", {
  schema: {
    anchor: { type: "string" },
    targetId: { type: "string", default: "0" },
  },
  init() {
    const { el } = this;
    let initialised = false;
    const system = document.querySelector("a-scene").systems["zappar-camera"] as any;
    system.registerForCallbacks(
      // eslint-disable-next-line no-underscore-dangle
      (this._frameUpdate = () => {
        const image = document.querySelector(this.data.anchor) as any;
        if (!image || !image.components || !image.components["zappar-image"] || !image.components["zappar-image"].trackerGroup) return;
        if (!initialised && image.components["zappar-image"].trackerGroup.imageTracker.targets[this.data.targetId]) {
          this.mesh = new TargetImagePreviewMesh(image.components["zappar-image"].trackerGroup.imageTracker.targets[this.data.targetId]);
          el.setObject3D("mesh", this.mesh);
          initialised = true;
        }
      })
    );
  },
});
