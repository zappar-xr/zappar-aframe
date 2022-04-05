import * as ZapparThree from "@zappar/zappar-threejs-for-aframe";

// eslint-disable-next-line no-undef
export default AFRAME.registerComponent("zappar-instant", {
  schema: {
    placementMode: { type: "boolean", default: false },
    enabled: { type: "boolean", default: true },
    anchorPoseOffset: { type: "vec3", default: { x: 0, y: 0, z: -5 } },
  },
  update(oldData) {
    if (this.data.enabled !== oldData.enabled) {
      this.trackerGroup.instantTracker.enabled = this.data.enabled;
    }
  },
  init() {
    const { el } = this;
    const system = document.querySelector("a-scene").systems["zappar-camera"] as any;
    const { camera } = system;
    const scene = document.querySelector("a-scene").object3D;

    const instantTracker = new ZapparThree.InstantWorldTracker();
    this.trackerGroup = new ZapparThree.InstantWorldAnchorGroup(camera, instantTracker);
    scene.add(this.trackerGroup);

    el.object3D.matrixAutoUpdate = false;
    system.registerForCallbacks(
      // eslint-disable-next-line no-underscore-dangle
      (this._frameUpdate = () => {
        const { x, y, z } = this.data.anchorPoseOffset;
        if (this.data.placementMode) instantTracker.setAnchorPoseFromCameraOffset(x, y, z);
        el.object3D.matrix = this.trackerGroup.matrix;
      })
    );
  },

  remove() {
    const system = document.querySelector("a-scene").systems["zappar-camera"] as any;
    // eslint-disable-next-line no-underscore-dangle
    system.unregisterForCallbacks(this._frameUpdate);

    const { trackerGroup } = this;
    trackerGroup.instantTracker.destroy();
  },
});
