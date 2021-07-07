import * as ZapparThree from "@zappar/zappar-threejs-for-aframe";

// eslint-disable-next-line no-undef
export default AFRAME.registerComponent("zappar-compatibility-ui", {
  init() {
    this.el.setAttribute("visible", false);

    if (ZapparThree.browserIncompatible()) {
      if (this.el.children.length > 0) {
        this.el.setAttribute("visible", true);
      } else {
        ZapparThree.browserIncompatibleUI();
      }
    }
  },
  remove() {
    this.el.setAttribute("visible", false);
  },
});
