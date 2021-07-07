import * as ZapparThree from "@zappar/zappar-threejs-for-aframe";

// eslint-disable-next-line no-undef
export default AFRAME.registerComponent("zappar-face", {
  schema: {
    enabled: { type: "boolean", default: true },
  },
  update(oldData) {
    if (this.data.enabled !== oldData.enabled) {
      this.trackerGroup.faceTracker.enabled = this.data.enabled;
    }
  },
  init() {
    const { el } = this;
    const system = document.querySelector("a-scene").systems["zappar-camera"] as any;
    const { camera } = system;
    const scene = document.querySelector("a-scene").object3D;

    this.trackerGroup = new ZapparThree.FaceAnchorGroup(camera, new ZapparThree.FaceTrackerLoader().load());
    scene.add(this.trackerGroup);

    this.trackerGroup.faceTracker.onVisible.bind((anchor) => el.emit("zappar-visible", anchor));
    this.trackerGroup.faceTracker.onNotVisible.bind((anchor) => el.emit("zappar-notvisible", anchor));
    this.trackerGroup.faceTracker.onNewAnchor.bind((anchor) => el.emit("zappar-newanchor", anchor));

    el.object3D.matrixAutoUpdate = false;

    system.registerForCallbacks(
      // eslint-disable-next-line no-underscore-dangle
      (this._frameUpdate = () => {
        el.object3D.matrix = this.trackerGroup.matrix;
      })
    );
  },
  remove() {
    const system = document.querySelector("a-scene").systems["zappar-camera"] as any;
    // eslint-disable-next-line no-underscore-dangle
    system.unregisterForCallbacks(this._frameUpdate);

    const { trackerGroup } = this;
    trackerGroup.faceTracker.destroy();
  },
});
