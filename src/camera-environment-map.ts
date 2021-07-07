import { CameraEnvironmentMap } from "@zappar/zappar-threejs-for-aframe";

// eslint-disable-next-line no-undef
export default AFRAME.registerComponent("zappar-environment-map", {
  dependencies: ["material"],
  schema: {},
  init(data) {
    const sceneEl = document.querySelector("a-scene");
    const system = document.querySelector("a-scene").systems["zappar-camera"] as any;
    const { camera } = system;
    const { renderer } = sceneEl;
    const envMap = new CameraEnvironmentMap();
    if (this.el.object3D.type === "Scene") {
      this.el.object3D.environment = envMap.environmentMap;
    } else {
      this.el.components.material.material.envMap = envMap.environmentMap;
    }

    system.registerForCallbacks(
      // eslint-disable-next-line no-underscore-dangle
      (this._frameUpdate = () => {
        envMap.update(renderer, camera as any);
      })
    );
  },
  remove() {
    const system = document.querySelector("a-scene").systems["zappar-camera"] as any;
    // eslint-disable-next-line no-underscore-dangle
    system.unregisterForCallbacks(this._frameUpdate);
    this.el.omponents.material.material.envMap.dipose();
  },
});
