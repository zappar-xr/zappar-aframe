# Zappar for A-Frame

<!-- ![Build](https://github.com/zappar-xr/zappar-aframe/workflows/Build/badge.svg) -->

This library allows you use Zappar's best-in-class AR technology with content built using the 3D platform A-Frame.

It provides high performance (30 frames-per-second) face, image and world tracking, in the browsers already installed on your users' mobile phones.

<img src="preview/preview.gif" width="450"/>

You may also be interested in:

- Zappar for ThreeJS ([website](https://zap.works/universal-ar/threejs/), [NPM](https://www.npmjs.com/package/@zappar/zappar-threejs))
- Zappar for React+three.js ([website](https://zap.works/universal-ar/react/), [NPM](https://www.npmjs.com/package/@zappar/zappar-react-three-fiber))
- Zappar for Unity ([website](https://zap.works/universal-ar/unity/))
- Zappar for JavaScript ([website](https://zap.works/universal-ar/aframe/), [NPM](https://www.npmjs.com/package/@zappar/zappar)), if you'd like to build content with a different 3D rendering platform
- ZapWorks Studio ([website](https://zap.works/studio/)), a full 3D development environment built for AR, VR and MR

## Table Of Contents

<details>
<summary>Click to expand table of contents</summary>

<!--ts-->
   * [Zappar for A-Frame](#zappar-for-a-frame)
      * [Table Of Contents](#table-of-contents)
      * [Getting Started](#getting-started)
         * [Bootstrap Projects](#bootstrap-projects)
         * [Example Projects](#example-projects)
      * [Starting Development](#starting-development)
         * [Standalone Download](#standalone-download)
         * [CDN](#cdn)
         * [NPM Webpack Module](#npm-webpack-module)
      * [Overview](#overview)
      * [Local Preview and Testing](#local-preview-and-testing)
      * [Compatibility and Browser Support](#compatibility-and-browser-support)
         * [Detecting Browser Compatibility](#detecting-browser-compatibility)
      * [Hosting and Publishing Content](#hosting-and-publishing-content)
         * [Licensing](#licensing)
         * [ZapWorks Hosting](#zapworks-hosting)
         * [Self-hosting](#self-hosting)
         * [Permissions](#permissions)
      * [Setting up the Camera](#setting-up-the-camera)
         * [User Facing Camera](#user-facing-camera)
         * [Mirroring the Camera](#mirroring-the-camera)
            * [Events](#events)
         * [Realtime Camera-based Reflections](#realtime-camera-based-reflections)
         * [Camera Pose](#camera-pose)
      * [Tracking](#tracking)
         * [Image Tracking](#image-tracking)
            * [Target File](#target-file)
            * [Image Target Preview Mesh](#image-target-preview-mesh)
            * [Events](#events-1)
         * [Face Tracking](#face-tracking)
            * [Events](#events-2)
         * [Face Landmarks](#face-landmarks)
         * [Face Mesh](#face-mesh)
         * [Head Masking](#head-masking)
         * [Instant World Tracking](#instant-world-tracking)
      * [Disabling tracking](#disabling-tracking)
      * [Links and Resources](#links-and-resources)

<!-- Added by: zapparadmin, at: Mon Nov 14 15:29:26 GMT 2022 -->

<!--te-->
</details>

## Getting Started

### Bootstrap Projects

Check out these repositories that contain `index.html` files to get you started:
<https://github.com/zappar-xr/zappar-aframe-face-tracking-standalone-bootstrap>
<https://github.com/zappar-xr/zappar-aframe-instant-tracking-standalone-bootstrap>
<https://github.com/zappar-xr/zappar-aframe-image-tracking-standalone-bootstrap>

Or these repositories that have `webpack` setups optimized for development and deployment:
<https://github.com/zappar-xr/zappar-aframe-face-tracking-webpack-bootstrap>
<https://github.com/zappar-xr/zappar-aframe-instant-tracking-webpack-bootstrap>
<https://github.com/zappar-xr/zappar-aframe-image-tracking-webpack-bootstrap>

### Example Projects

There's a repository of example projects for your delectation over here:

<https://github.com/zappar-xr/zappar-aframe-examples>

## Starting Development

You can use this library by downloading a standalone zip containing the necessary files, by linking to our CDN, or by installing from NPM for use in a webpack project.

### Standalone Download

Download the bundle from this link:
<https://libs.zappar.com/zappar-aframe/2.0.1/zappar-aframe.zip>

Unzip into your web project and reference from your HTML like this:

```html
<script src="zappar-aframe.js"></script>
```

### CDN

Reference the zappar.js library from your HTML like this:

```html
<script src="https://libs.zappar.com/zappar-aframe/2.0.1/zappar-aframe.js"></script>
```

### NPM Webpack Module

Run the following NPM command inside your project directory:

```bash
npm install --save @zappar/zappar-aframe
```

Then import the library into your JavaScript or TypeScript files:

```ts
import * as ZapparAFrame from "@zappar/zappar-aframe";
```

Please note - This library supports Webpack 5 and later.

## Overview

You can integrate the Zappar library with an existing A-Frame scene. A typical project may look like this. The remainder of this document goes into more detail about each of the component elements of this example.

```html
<body>
      <a-scene>
          <a-assets>
              <a-asset-item id="target-file" src="myTarget.zpt"/>
          </a-assets>

          <a-entity camera zappar-camera></a-entity>

          <a-entity zappar-image="target: #target-file">
              <!-- YOUR 3D CONTENT GOES HERE -->
          </a-entity>
      </a-scene>
  </body>
```

## Local Preview and Testing

Due to browser restrictions surrounding use of the camera, you must use HTTPS to view or preview your site, even if doing so locally from your computer. If you're using `webpack`, consider using `webpack-dev-server` which has an `https` option to enable this.

Alternatively you can use the [ZapWorks command-line tool](https://www.npmjs.com/package/@zappar/zapworks-cli) to serve a folder over HTTPS for access on your local computer, like this:

```bash
zapworks serve .
```

The command also lets you serve the folder for access by other devices on your local network, like this:

```bash
zapworks serve . --lan
```

## Compatibility and Browser Support

This library works well on the browsers that enjoy the vast majority of mobile market-share. That said, there are a number of web browsers available across the mobile and desktop device landscape.

*Best support:*

- Safari for iOS (version 11.3 and later)
- Chrome for Android (versions from at least the last year)

*Functional but not our primary support target (support quality):*

- Most Webkit/Blink-based web browsers for Android, including Brave (good)
- Most third-party web browsers for iOS from iOS 14.3 and later (good)
- iOS in-app web views implemented with SFSafariViewController (good)
- iOS in-app web views implemented with WKWebView from iOS 14.3 (good)
- Firefox for Android (good, however performance may be lower than other browsers)
- Chrome for Mac/Windows (*)
- Firefox for Mac/Windows (*)
- Safari for Mac (*)

*Known to not work:*

- iOS in-app web views implemented with WKWebView or UIWebView - these iOS technologies do not support camera access at all and thus we're unable to support them. We hope that Apple will rectify this issue in a future iOS release.
- Non-Safari web browsers on iOS, including Chrome, Firefox and Brave - these browsers use WKWebView due to App Store restrictions and thus do not support camera access.

\* Browsers without motion sensor access (e.g desktop browsers) don't support instant world tracking or attitude-based camera poses.

### Detecting Browser Compatibility

To make it easy to detect if your page is running in a browser that's not supported, we've provided the `zappar-compatibility-ui` entity:

```html
<!-- Browser Compatibility -->
<a-entity zappar-compatibility-ui id="compatibility">
    <!-- Remove the text entity to use Zappar's default compatibility UI -->
    <a-entity text="value: Browser incompatible!" position="0 0 -2"></a-entity>
</a-entity>
```

The default compatibility UI shows a full-page dialog that informs the user they're using an unsupported browser, and provides a button to 'copy' the current page URL so they can 'paste' it into the address bar of a compatible alternative.

## Hosting and Publishing Content

Once you've built your site, you have a number of options for hosting your site:

- Using ZapWork's integrated hosting
- Self-hosting on servers and a domain that you manage

### Licensing

You need to maintain an activate subscription at ZapWorks in order to use this library.

If you are self-hosting your experience, you will have to register the full domain name with ZapWorks in order for the license check to complete successfully. Contact support@zappar.com to find out more.

You do **not** need to register if you're hosting your experience:

- with ZapWorks (a `*.zappar.io` domain name); or,
- locally for testing (with the one of following hostnames: `0.0.0.0`, `127.*`); or,
- on your local network (with the one of following hostnames: `192.*`, `10.*`); or,
- using [ngrok](https://ngrok.com/) (a `*.ngrok.io` domain name).

### ZapWorks Hosting

ZapWorks provides an easy-to-use and robust hosting solution for your AR experiences as part of your subscription. To get started, head over to [zap.works](https://zap.works).

Once you've logged in, you can create a new 'Universal AR' project using the + button.

Having created a 'Universal AR' project, head over to the "Experience" tab where you can either:

- upload a ZIP of your website directly, or
- find instructions for using the [ZapWorks command-line tool](https://www.npmjs.com/package/@zappar/zapworks-cli) to complete the upload.

For more information, head over to our [Publishing and Hosting](https://docs.zap.works/universal-ar/publishing-and-hosting/) docs article.

### Self-hosting

If you'd like to self-host your content, there are a number of recommendations we make to ensure the best experience for end-users:

- You need to register your domain name with ZapWorks so that it passes the license check. For more information contact support@zappar.com
- You must serve the content over HTTPS (due to browser restrictions surrounding the camera)
- Files in the Zappar library ending with the `.wasm` file extension should be served with the `application/wasm` mime-type
- Several files in this library (and likely others in your project too) compress well using `Content-Encoding: gzip`. In particular you should serve files with the following extensions with gzip content-encoding: `.wasm`, `.js`, `.zbin`, `.zpt`

### Permissions

The library needs to ask the user for permission to access the camera and motion sensors on the device.

To do this, you can use the following entity to show a built-in UI informing the user of the need and providing a button to trigger the browser's permission prompts.

```html
<!-- Ask user for camera permissions, display some text if permission is denied -->
<a-entity zappar-permissions-ui id="permissions">
    <!-- Remove the text entity to use Zappar's default permission denied UI -->
    <a-entity text="value: Please reload the page, accepting the camera permissions." position="0 0 -2"></a-entity>
</a-entity>
```

## Setting up the Camera

The first step is to add or replace any existing camera you have in your scene with one using the `zappar-camera` component, like this:

```html
<a-entity camera zappar-camera></a-entity>
```

Don't change the position or rotation of the camera yourself - the Zappar library will do this automatically.

### User Facing Camera

Some experiences, e.g. face tracked experiences, require the use of the user-facing camera on the device. To activate the user-facing, camera, provide the `user-facing: true` parameter to the `zappar-camera` component:

```html
<a-entity camera zappar-camera="user-facing: true;"></a-entity>
```

### Mirroring the Camera

Users expect user-facing cameras to be shown mirrored, so by default the `zappar-camera` will mirror the camera view for the user-facing camera.

Configure this behavior with the following option:

```html
<a-entity camera zappar-camera="user-facing: true; user-camera-mirror-mode: poses"></a-entity>
```

The values you can pass to `user-camera-mirror-mode` are:

- `poses`: this option mirrors the camera view and makes sure your content aligns correctly with what you're tracking on screen. Your content itself is not mirrored - so text, for example, is readable. This option is the default.
- `css`: this option mirrors the entire canvas. With this mode selected, both the camera and your content appear mirrored.
- `no-mirror`: no mirroring of content or camera view is performed

There's also a `rear-camera-mirror-mode` parameter that takes the same values should you want to mirror the rear-facing camera. The default `rear-camera-mirror-mode` is `no-mirror`.


#### Events

The `zappar-camera` component will emit the following event on the element it's attached to:

- `first-frame` - emitted when the first camera frame is processed.

Here's an example of using these events:

```html
<a-camera zappar-camera id="zappar-camera">
</a-camera>

<script>
    let camera = document.getElementById("zappar-camera");
    camera.addEventListener("first-frame", () => {
        console.log("The camera is ready!");
    });
</script>
```

### Realtime Camera-based Reflections

The SDK provides an automatically generated environment map that's useful if you're using materials that support reflections (e.g. `MeshStandardMaterial`, `MeshPhysicalMaterial`). The map uses the camera feed to create an approximate environment that can add some realism to your scene.

To apply the map to your scene, simply add `zappar-environment-map` attribute to your scene element.

```html
<a-scene zappar-environment-map>
</a-scene>
```

Alternatively, you may apply the texture to specific object materials by using the same attribute.

```html
<a-sphere position="0 0 -5" environment-map metalness="1" roughness="0" radius="1"></a-sphere>
```

### Camera Pose

The Zappar library provides multiple modes for the camera to move around in the A-Frame scene. You can set this mode with the `pose-mode` parameter of the `zappar-camera` component. There are the following options:

- `default`: in this mode the camera stays at the origin of the scene, pointing down the negative Z axis. Any tracked groups will move around in your scene as the user moves the physical camera and real-world tracked objects.
- `attitude`: the camera stays at the origin of the scene, but rotates as the user rotates the physical device. When the Zappar library initializes, the negative Z axis of world space points forward in front of the user.
- `anchor-origin`: the origin of the scene is the center of the group specified by the camera's `pose-anchor-origin` parameter. In this case the camera moves and rotates in world space around the group at the origin.

 The correct choice of camera pose with depend on your given use case and content. Here are some examples you might like to consider when choosing which is best for you:

- To have a light that always shines down from above the user, regardless of the angle of the device or anchors, use `attitude` and place a light shining down the negative Y axis is world space.
- In an application with a physics simulation of stacked blocks, and with gravity pointing down the negative Y axis of world space, using `anchor-origin` would allow the blocks to rest on a tracked image regardless of how the image is held by the user, while using `attitude` would allow the user to tip the blocks off the image by tilting it.

## Tracking

The Zappar library offers three types of tracking for you to use to build augmented reality experiences:

- *Image Tracking* can detect and track a flat image in 3D space. This is great for building content that's augmented onto business cards, posters, magazine pages, etc.
- *Face Tracking* detects and tracks the user's face. You can attach 3D objects to the face itself, or render a 3D mesh that's fit to (and deforms with) the face as the user moves and changes their expression. You could build face-filter experiences to allow users to try on different virtual sunglasses, for example, or to simulate face paint.
- *Instant World Tracking* lets you tracking 3D content to a point chosen by the user in the room or immediate environment around them. With this tracking type you could build a 3D model viewer that lets users walk around to view the model from different angles, or an experience that places an animated character in their room.

### Image Tracking

To track content from a flat image in the camera view, use the `zappar-image` component:

```html
<a-entity zappar-image="target: #target-file">
  <!-- PLACE CONTENT TO APPEAR ON THE IMAGE HERE -->
</a-entity>
```

The group provides a coordinate system that has its origin at the center of the image, with positive X axis to the right, the positive Y axis towards the top and the positive Z axis coming up out of the plane of the image. The scale of the coordinate system is such that a Y value of +1 corresponds to the top of the image, and a Y value of -1 corresponds to the bottom of the image. The X axis positions of the left and right edges of the target image therefore depend on the aspect ratio of the image.

#### Target File

`ImageTracker`s use a special 'target file' that's been generated from the source image you'd like to track. You can generate them using the ZapWorks command-line utility like this:

```bash
zapworks train myImage.png
```

The resulting file can be loaded into an A-Frame as an asset and its ID passed as the parameter of the `zappar-image` component:

```html
<a-assets>
    <a-asset-item id="target-file" src="myTarget.zpt"/>
</a-assets>
<a-entity zappar-image="target: #target-file">
  <!-- PLACE CONTENT TO APPEAR ON THE IMAGE HERE -->
</a-entity>
```

#### Image Target Preview Mesh

In addition to tracking the center of the target image using `zappar-image`, the Zappar library provides a `target-image-preview` entity. This is a mesh which will fit to the target image and use it's texture as a material.

To use a target image preview mesh, create an entity within your `zappar-image` entity and use the `target-image-preview` primitive type, like this:

```html
<a-entity zappar-image="target: #target-file" id="anchor">
    <a-entity target-image-preview="anchor: #anchor;"></a-entity>
</a-entity>
```

#### Events

The `zappar-image` component will emit the following events on the element it's attached to:

- `zappar-visible` - emitted when the image appears in the camera view
- `zappar-notvisible` - emitted when the image is no longer visible in the camera view

Here's an example of using these events:

```html
<a-assets>
    <a-asset-item id="target-file" src="myTarget.zpt"/>
</a-assets>
<a-entity zappar-image="target: #target-file" id="my-image-tracker">
  <!-- PLACE CONTENT TO APPEAR ON THE IMAGE HERE -->
</a-entity>

<script>

let myImageTracker = document.getElementById("my-image-tracker");

myImageTracker.addEventListener("zappar-visible", () => {
  console.log("Image has become visible");
});

myImageTracker.addEventListener("zappar-notvisible", () => {
  console.log("Image is no longer visible");
});

</script>
```

### Face Tracking

To place content on or around a user's face, create a new `zapapr-face` component:

```html
<a-entity zappar-face>
  <!-- PLACE CONTENT TO APPEAR ON THE FACE HERE -->
</a-entity>
```

The group provides a coordinate system that has its origin at the center of the head, with positive X axis to the right, the positive Y axis towards the top and the positive Z axis coming forward out of the user's head.

Note that users typically expect to see a mirrored view of any user-facing camera feed. Please see the section on mirroring the camera view earlier in this document.

#### Events

The `zappar-face` component will emit the following events on the element it's attached to:

- `zappar-visible` - emitted when the face appears in the camera view
- `zappar-notvisible` - emitted when the face is no longer visible in the camera view

Here's an example of using these events:

```html
<a-entity zappar-face id="my-face-tracker">
  <!-- PLACE CONTENT TO APPEAR ON THE IMAGE HERE -->
</a-entity>

<script>

let myFaceTracker = document.getElementById("my-face-tracker");

myFaceTracker.addEventListener("zappar-visible", () => {
  console.log("Face has become visible");
});

myFaceTracker.addEventListener("zappar-notvisible", () => {
  console.log("Face is no longer visible");
});

</script>
```

### Face Landmarks

In addition to tracking the center of the head, you can use `FaceLandmarkGroup` to track content from various points on the user's face. These landmarks will remain accurate, even as the user's expression changes.

To track a landmark, construct a new `FaceLandmarkGroup` component, passing your face tracker, and the name of the landmark you'd like to track:

```html
<a-entity zappar-face-landmark="face: #face-anchor; target: nose-tip" id="zappar-face-landmark">
    <!-- Add in any 3D objects you'd like to track to this face -->
    <a-box width="0.05" height="0.05" depth="0.05" color="#4CC3D9"></a-box>
</a-entity>
```

The following landmarks are available: `eye-left`, `eye-right`, `ear-left`, `ear-right`, `nose-bridge`, `nose-tip`, `nose-base`, `lip-top`, `lip-bottom`, `mouth-center`, `chin`, `eyebrow-left`, and `eyebrow-right`. Note that 'left' and 'right' here are from the user's perspective.

### Face Mesh

In addition to tracking the center of the face using `zappar-face`, the Zappar library provides a number of meshes that will fit to the face/head and deform as the user's expression changes. These can be used to apply a texture to the user's skin, much like face paint, or to mask out the back of 3D models so the user's head is not occluded where it shouldn't be.

To use a face mesh, create an entity within your `zappar-face` entity and use the `face-mesh` primitive type, like this:

```html
<a-entity zappar-face id="my-face-tracker">
    <a-entity geometry="primitive: face-mesh; face: #my-face-tracker" material="src:#my-texture; transparent: true;"></a-entity>
</a-entity>
```

At this time there are two meshes included with the library. The default mesh covers the user's face, from the chin at the bottom to the forehead, and from the sideburns on each side. There are optional parameters that determine if the mouth and eyes are filled or not:

```html
<a-entity geometry="primitive: face-mesh; face: #my-face-tracker; fill-mouth: true; fill-eye-left: true; fill-eye-right: true;" material="src:#my-texture; transparent: true;"></a-entity>
```

The full head simplified mesh covers the whole of the user's head, including some neck. It's ideal for drawing into the depth buffer in order to mask out the back of 3D models placed on the user's head (see Head Masking below). There are optional parameters that determine if the mouth, eyes and neck are filled or not:

```html
<a-entity geometry="primitive: face-mesh; face: #my-face-tracker; model: full-head-simplified; fill-mouth: true; fill-eye-left: true; fill-eye-right: true; fill-neck: true;" material="src:#my-texture; transparent: true;"></a-entity>
```

### Head Masking

If you're placing a 3D model around the user's head, such as a helmet, it's important to make sure the camera view of the user's real face is not hidden by the back of the model. To achieve this, the library provides `zappar-head-mask`. It's an entity that fits the user's head and fills the depth buffer, ensuring that the camera image shows instead of any 3D elements behind it in the scene.

To use it, add the entity into your `zappar-face` entity, before any other 3D content:

```html
<a-entity zappar-face id="my-face-tracker">
    <a-entity zappar-head-mask="face: #my-face-tracker;"></a-entity>

    <!-- OTHER 3D CONTENT GOES HERE -->
</a-entity>
```

### Instant World Tracking

To track content from a point on a surface in front of the user, use the `zappar-instant` component:

```html
<a-entity zappar-instant="placement-mode: true;" id="my-instant-tracker">
    <!-- PLACE CONTENT TO APPEAR IN THE WORLD HERE -->
</a-entity>
```

With the `placement-mode: true` parameter set, the instant tracker will let the user choose a location for the content by pointing their camera around the room. When the user indicates that they're happy with the placement, e.g. by tapping a button on-screen, remove that parameter to fix the content in that location:

```html
<a-entity zappar-instant="placement-mode: true;" id="my-instant-tracker">
    <!-- PLACE CONTENT TO APPEAR IN THE WORLD HERE -->
</a-entity>
<script>
    let myInstantTracker = document.getElementById("my-instant-tracker");
    document.body.addEventListener("click", () => {
        myInstantTracker.setAttribute("zappar-instant", "placement-mode: false;");
    })
</script>
```

The group provides a coordinate system that has its origin at the point that's been set, with the positive Y coordinate pointing up out of the surface, and the X and Z coordinates in the plane of the surface.

To choose the point in the user's environment that the anchor tracks from, use the `anchorPoseOffset` parameter, like this:

```html
<a-entity zappar-instant="placement-mode: true; anchorPoseOffset: 0 0 -5" id="anchor">
<!-- ... -->
</a-entity>
```

The parameters passed in to this function correspond to the X, Y and Z coordinates (in camera space) of the point to track. Choosing a position with X and Y coordinates of zero, and a negative Z coordinate, will select a point on a surface directly in front of the center of the screen.

This parameter defaults to `0 0 -5` when not supplied.

## Disabling tracking

You may disable the trackers on-the-go using the ``enabled`` parameter:

```html
<a-entity zappar-image="target: #target-file; enabled: false" id="anchor">
</a-entity>
```

## Links and Resources

- [Web site](https://zap.works/universal-ar/)
- [Documentation](https://docs.zap.works/universal-ar/web-libraries/a-frame/)
- [Forum](https://forum.zap.works/)
- [Issue tracker](https://github.com/zappar-xr/zappar-aframe/issues)
- [Source code](https://github.com/zappar-xr/zappar-aframe)
