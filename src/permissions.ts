import * as ZapparThree from "@zappar/zappar-threejs-for-aframe";

// eslint-disable-next-line no-undef
export default AFRAME.registerComponent("zappar-permissions-ui", {
  init() {
    this.el.setAttribute("visible", false);
    ZapparThree.permissionRequestUI().then((granted) => {
      const system = document.querySelector("a-scene").systems["zappar-camera"] as any;
      system.permissionGranted = granted;
      if (granted) {
        system.camera.start(system.userFacing);
        return;
      }
      if (this.el.children.length > 0) {
        this.el.setAttribute("visible", true);
      } else {
        ZapparThree.permissionDeniedUI();
      }
    });
  },
  remove() {
    this.el.setAttribute("visible", false);
  },
});
