/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// <!-- build-remove-start -->
import { LogLevel, setLogLevel } from "@zappar/zappar-threejs-for-aframe";
import * as AFRAME from "aframe";
import * as ZapparAFrame from "../../../src";
// <!-- build-remove-end -->

ZapparAFrame.setLogLevel(ZapparAFrame.LogLevel.LOG_LEVEL_VERBOSE);

AFRAME.registerComponent("alpha", {
  dependencies: ["material"],
  init() {
    this.el.getObject3D("mesh").material.opacity = 0.75;
    this.el.getObject3D("mesh").material.transparent = true;
  },
});
