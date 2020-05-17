# svimg

svimg is an image preprocessing and lazy loading component for Svelte. It consists of:

* A Svelte preprocessor that automatically resizes your images to multiple resolutions in a `srcset`, creates additional [WebP](https://developers.google.com/speed/webp) versions, and generates blurred placeholder images
* A Svelte component that displays the blurred placeholder and automatically lazy loads the proper resolution image when it comes into view

svimg uses [lazysizes](https://github.com/aFarkas/lazysizes) to do lazy loading and takes advantage of lazysizes' automatic `sizes` calculation. Some other Svelte image components do not set a proper `sizes` attribute, which can cause the browser to download a much larger resolution image than necessary if you are resizing the image with CSS. svimg will also use a literal width if specified to control image preprocessing and only generate the necessary image files for that width.

This project is inspired by [Gridsome's](https://gridsome.org/docs/images/) image processing component. It's also inspired by [svelte-image](https://github.com/matyunya/svelte-image), and was originally going to be a fork of that project but ended up needing to diverge significantly in functionality.

## Installation

```bash
npm install -D svimg
```

Since svimg is an external Svelte component, you'll want to make sure it gets bundled by Svelte during compile by installing it as a dev dependency (or modifying your rollup/webpack config to not treat it as an external). 

In `rollup.config.js`, add `imagePreprocessor` as a preprocessor for `rollup-plugin-svelte`:

```js
import imagePreprocessor from 'svimg';

export default {
    plugins: [
        svelte({
            preprocess: [
                imagePreprocessor({
                    publicDir: 'public',
                    outputDir: 'public/g',
                    webp: true
                })
            ]
        })
    ]
};
```

If you're using [Sapper](https://sapper.svelte.dev/), add the preprocessor to both the client and the server svelte plugins. Make sure to use the same instance of `imagePreprocessor` for both client and server, to avoid redundant double-processing of image files:

```js
import imagePreprocessor from 'svimg';

const preprocess = [
    imagePreprocessor({
        publicDir: 'static',
        outputDir: 'static/g',
        webp: true
    })
];

export default {
    client: {
        plugins: [
            svelte({
                preprocess
            })
        ]
    },
    server: {
        plugins: [
            svelte({
                preprocess
            })
        ]
    }
};
```

## Usage

```html
<script>
import Image from 'svimg';
</script>

<Image src="images/splash.jpg" />

<Image src="images/avatar.jpg" width="150" alt="Avatar" class="blue-border" />
```

The `Image` component will render a blurred placeholder, a srcset with multiple resolutions, a sizes attribute, and a source of type `image/webp` with webp images. It'll use the original `src` for legacy browsers that don't support srcset.

## Options

### Component attributes

| Property | Default    |           |
| -------- | ---------- | --------- |
| src      | *required* | Image url |
| alt      |            | Alternate text for the image |
| class    |            | CSS classes to apply to image |
| width    |            | Resize image to specified width in pixels. If not specified, generates images of widths 480, 1024, 1920, and 2560. |

The following properties will be automatically populated by the preprocessor:

| Property    |         |
| ----------- | ------- |
| srcset      | Responsive images and widths |
| srcsetWebp  | Responsive WebP images and widths |
| placeholder | Blurred placeholder image |

### Preprocessor options

| Option    | Default    |            |
| --------- | ---------- | ---------- |
| publicDir | *required* | The static asset directory where image urls are retrieved from |
| outputDir | *required* | The output directory where resized image files should be written to. This should usually be a subfolder within the normal static asset directory |
| webp      | true       | Whether to generate WebP versions of images in addition to the original image formats |