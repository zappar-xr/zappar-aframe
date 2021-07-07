import * as ZapparThree from "@zappar/zappar-threejs-for-aframe";

// eslint-disable-next-line no-undef
export default AFRAME.registerComponent("zappar-image", {
  schema: {
    target: { type: "asset", default: "" },
    enabled: { type: "boolean", default: true },
  },
  update(oldData) {
    if (this.data.target !== oldData.target) {
      this.trackerGroup.imageTracker.loadTarget(this.data.target);
    }
    if (this.data.enabled !== oldData.enabled) {
      this.trackerGroup.imageTracker.enabled = this.data.enabled;
    }
  },
  init() {
    const { el } = this;
    const system = document.querySelector("a-scene").systems["zappar-camera"] as any;
    const { camera } = system;
    const scene = document.querySelector("a-scene").object3D;

    this.trackerGroup = new ZapparThree.ImageAnchorGroup(camera, new ZapparThree.ImageTracker());
    scene.add(this.trackerGroup);

    el.object3D.matrixAutoUpdate = false;
    system.registerForCallbacks(
      // eslint-disable-next-line no-underscore-dangle
      (this._frameUpdate = () => {
        el.object3D.matrix = this.trackerGroup.matrix;
      })
    );

    this.trackerGroup.imageTracker.onVisible.bind((anchor) => el.emit("zappar-visible", anchor));
    this.trackerGroup.imageTracker.onNotVisible.bind((anchor) => el.emit("zappar-notvisible", anchor));
    this.trackerGroup.imageTracker.onNewAnchor.bind((anchor) => el.emit("zappar-newanchor", anchor));
  },

  remove() {
    const system = document.querySelector("a-scene").systems["zappar-camera"] as any;
    // eslint-disable-next-line no-underscore-dangle
    system.unregisterForCallbacks(this._frameUpdate);

    const { trackerGroup } = this;
    trackerGroup.imageTracker.destroy();
  },
});
