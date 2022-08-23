/* eslint-disable camelcase */
import { LogLevel, setLogLevel, SequenceSource } from "@zappar/zappar-threejs-for-aframe";
import * as ZapparThreeForAFrame from "@zappar/zappar-threejs-for-aframe";
import { VERSION } from "./version";

import * as camera from "./camera";
import * as instant_tracker from "./trackers/instant-tracking";
import * as image_tracker from "./trackers/image-tracking";
import * as face_tracker from "./trackers/face-tracking";
import * as face_mesh from "./face-mesh";
import * as head_mask from "./head-mask";
import * as face_landmark from "./trackers/face-landmark";
import * as permission_ui from "./permissions";
import * as compatibility_ui from "./compatibility";
import * as environment_map from "./camera-environment-map";
import * as image_preview from "./target-image-preview-mesh";

console.log(`Zappar for A-Frame v${VERSION}`);

export {
  camera,
  instant_tracker,
  image_tracker,
  face_tracker,
  face_mesh,
  head_mask,
  face_landmark,
  permission_ui,
  compatibility_ui,
  environment_map,
  LogLevel,
  setLogLevel,
  ZapparThreeForAFrame,
  SequenceSource,
  image_preview,
};
