/* eslint-disable no-underscore-dangle */
import * as ZapparThree from "@zappar/zappar-threejs-for-aframe";

// eslint-disable-next-line no-undef
AFRAME.registerSystem("zappar-camera", {
  init() {
    this.camera = new ZapparThree.Camera();
    this._callbacks = new Set<() => void>();
  },
  emitCallbacks() {
    // eslint-disable-next-line no-restricted-syntax
    for (const callback of this._callbacks) callback();
  },
  registerForCallbacks(cb) {
    this._callbacks.add(cb);
  },
  unregisterForCallbacks(cb) {
    this._callbacks.delete(cb);
  },
});

// eslint-disable-next-line no-undef
const camera = AFRAME.registerComponent("zappar-camera", {
  schema: {
    userFacing: { type: "boolean", default: false },
    userCameraMirrorMode: { type: "string", default: "poses" },
    rearCameraMirrorMode: { type: "string", default: "no-mirror" },
    poseMode: { type: "string", default: "default" },
    poseAnchorOrigin: { type: "selector" },
    cameraSource: { type: "string", default: "" },
  },
  init() {
    const sceneEl = document.querySelector("a-scene");
    sceneEl.setAttribute("vr-mode-ui", "enabled: false");

    // HTML Source camera.
    if (this.data.cameraSource !== "") {
      const sourceElement = document.querySelector(this.data.cameraSource);
      // Throw if source is not IMG or VIDEO.
      if (!(sourceElement.tagName === "IMG" || sourceElement.tagName === "VIDEO"))
        throw new Error(`Provided camera source "${this.data.cameraSource}" must be an IMG or VIDEO element.`);
      // Set the source to rear/user according to provided userFacing mode.
      const cameraSource = this.system.userFacing ? "userCameraSource" : "rearCameraSource";
      this.system.camera[cameraSource] = new ZapparThree.HTMLElementSource(sourceElement as any);
    }

    const scene = sceneEl.object3D;
    const { renderer } = sceneEl;
    ZapparThree.glContextSet(renderer.getContext());
    scene.background = this.system.camera.backgroundTexture;
    this.hadFirstFrame = false;
  },
  update(oldData) {
    const { camera } = this.system;
    this.system.userFacing = this.data.userFacing;

    const cameraDirectionDidChange = oldData.userFacing !== this.data.userFacing;

    // Permissions are not needed for HTML sources.
    const cameraHasPermissions = this.system.permissionGranted || this.data.cameraSource !== "";

    if (cameraDirectionDidChange && cameraHasPermissions) {
      this.system.camera.start(this.data.userFacing);
    }

    switch (this.data.poseMode) {
      case "attitude":
        camera.poseMode = ZapparThree.CameraPoseMode.Attitude;
        break;
      case "anchor-origin":
        camera.poseMode = ZapparThree.CameraPoseMode.AnchorOrigin;
        break;
      default:
        camera.poseMode = ZapparThree.CameraPoseMode.Default;
        break;
    }

    switch (this.data.userCameraMirrorMode) {
      case "poses":
        camera.userCameraMirrorMode = ZapparThree.CameraMirrorMode.Poses;
        break;
      case "css":
        camera.userCameraMirrorMode = ZapparThree.CameraMirrorMode.CSS;
        break;
      case "no-mirror":
        camera.userCameraMirrorMode = ZapparThree.CameraMirrorMode.None;
        break;
      default:
        camera.userCameraMirrorMode = ZapparThree.CameraMirrorMode.Poses;
        break;
    }

    switch (this.data.rearCameraMirrorMode) {
      case "poses":
        camera.rearCameraMirrorMode = ZapparThree.CameraMirrorMode.Poses;
        break;
      case "css":
        camera.rearCameraMirrorMode = ZapparThree.CameraMirrorMode.CSS;
        break;
      case "no-mirror":
        camera.rearCameraMirrorMode = ZapparThree.CameraMirrorMode.None;
        break;
      default:
        camera.rearCameraMirrorMode = ZapparThree.CameraMirrorMode.None;
        break;
    }
  },
  tick() {
    const { camera } = this.system;
    const { renderer } = document.querySelector("a-scene");
    if (this.data && this.data.poseAnchorOrigin && this.data.poseAnchorOrigin.components) {
      const { components } = this.data.poseAnchorOrigin;
      if (components["zappar-face"]) camera.poseAnchorOrigin = components["zappar-face"].trackerGroup.currentAnchor;
      else if (components["zappar-image"]) camera.poseAnchorOrigin = components["zappar-image"].trackerGroup.currentAnchor;
      else if (components["zappar-instant"]) camera.poseAnchorOrigin = components["zappar-instant"].trackerGroup.currentAnchor;
    }

    this.system.camera.updateFrame(renderer);
    if (!this.hadFirstFrame && camera.pipeline.frameNumber() > 0) {
      this.hadFirstFrame = true;
      this.el.emit("first-frame", {});
    }

    this.el.object3DMap.camera.matrixAutoUpdate = false;
    this.el.object3DMap.camera.projectionMatrix = camera.projectionMatrix;
    this.el.object3DMap.camera.projectionMatrixInverse = camera.projectionMatrixInverse;

    this.el.object3D.matrixAutoUpdate = false;
    this.el.object3D.matrix.fromArray(camera.rawPose);

    this.system.emitCallbacks();
  },
});

export default camera;
