# svimg

svimg is an image preprocessing and lazy loading component for [Svelte](https://svelte.dev). It consists of:

* A Svelte preprocessor that automatically resizes your images to multiple resolutions in a `srcset`, creates additional [AVIF](https://en.wikipedia.org/wiki/AV1) and [WebP](https://developers.google.com/speed/webp) versions, and generates blurred placeholder images
* A Svelte component that displays the blurred placeholder and automatically lazy loads the proper resolution image when it comes into view

svimg uses native browser lazy loading with a fallback to IntersectionObserver, and automatically calculates the appropriate `sizes` attribute. Some other image components do not set a proper `sizes` attribute, which can cause the browser to download a much larger resolution image than necessary if you are resizing the image with CSS. svimg will also use a literal width if specified to control image preprocessing and only generate the necessary image files for that width.

## Getting Started

### Installation

Since svimg is an external Svelte component, you'll want to make sure it gets bundled by Svelte during compile by installing it as a dev dependency (or modifying your bundler config to not treat it as an external).

```bash
npm install -D svimg
```

In `svelte.config.js`, add `imagePreprocessor` as a preprocessor:
```js
import { vitePreprocess } from '@sveltejs/kit/vite';
import { imagePreprocessor } from 'svimg';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [
        imagePreprocessor({
            inputDir: 'static',
            outputDir: 'static/g',
            webp: true,
            avif: true
        }), 
        vitePreprocess()
    ]
};

export default config;
```

`rollup-plugin-svelte` does not yet have support for `svelte.config.js`, so if you're using it you must pass the options inline. In `rollup.config.js`, add `imagePreprocessor` as a preprocessor for `rollup-plugin-svelte`:

```js
import { imagePreprocessor } from 'svimg';

export default {
    plugins: [
        svelte({
            preprocess: [
                imagePreprocessor({
                    inputDir: 'public',
                    outputDir: 'public/g',
                    webp: true,
                    avif: true
                })
            ]
        })
    ]
};
```

### Usage

#### Svelte Component

```html
<script>
import Image from 'svimg/Image.svelte';
</script>

<Image src="images/splash.jpg" />

<Image src="images/avatar.jpg" width="150" alt="Avatar" class="blue-border" quality="85" immediate />
```

The `Image` component will render a blurred placeholder, a srcset with multiple resolutions, a sizes attribute, and sources of type `image/avif` with avif images and `image/webp` with webp images.

#### Custom Element

svimg is also exposed as a [custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements), which means it can be used independently of Svelte with the `<s-image>` tag.

Usage as a custom element expects that the attributes that would normally be filled in by the Svelte preprocessor (`srcset`, `srcsetavif`, `srcsetwebp`, `placeholder`) are populated by another method.

Generally, you'd use another tool to create these elements such as [rehype-svimg](https://github.com/xiphux/rehype-svimg) rather than using the custom element directly.

```html
<script>
import 'svimg/s-image';
</script>

<s-image srcset="images/splash-600.jpg 600w, images/splash-1200.jpg 1200w" srcsetavif="images/splash-600.avif 600w, images/splash-1200.avif 1200w" srcsetwebp="images/splash-600.webp 600w, images/splash-1200.webp 1200w" />
```

### Configuration

#### Component Attributes

| Property  | Default    |           |
| --------- | ---------- | --------- |
| src       | *required* | Image url |
| alt       |            | Alternate text for the image |
| class     |            | CSS classes to apply to image |
| width     |            | Resize image to specified width in pixels. If not specified, generates images of widths 480, 1024, 1920, and 2560. |
| immediate | `false`    | Set to `true` to disable lazy-loading |
| blur      | `40`       | Amount of blur to apply to placeholder |
| quality   | *sharp default* | Quality of the resized images, defaults to sharp's default quality for each image format |

The following properties will be automatically populated by the preprocessor:

| Property    |         |
| ----------- | ------- |
| srcset      | Responsive images and widths |
| srcsetavif  | Responsive AVIF images and widths |
| srcsetwebp  | Responsive WebP images and widths |
| placeholder | Blurred placeholder image |
| aspectratio | Aspect ratio of image |
| placeholdersrc | Placeholder file src |
| placeholderwebp | Placeholder webp file src |
| placeholderavif | Placeholder avif file src |

#### Preprocessor Options

| Option    | Default    |            |
| --------- | ---------- | ---------- |
| inputDir | *required* | The static asset directory where image urls are retrieved from |
| outputDir | *required* | The output directory where resized image files should be written to. This should usually be a subdirectory within the normal static asset directory |
| srcGenerator | | An optional function to override the logic of how src URLs are generated for the srcset. This is called once per generated image file, and can be used to customize the generated image URLs - for example, to add or remove path components or to specify a CDN domain.<br />The expected callback signature is:<br />`(path: string, { src, inputDir, outputDir }?: SrcGeneratorInfo) => string`<br />The first parameter is the path to the generated image **relative to the `outputDir`**, with path separators already normalized to `/`. The second optional parameter provides the original image `src` and the `inputDir`/`outputDir` options, and the return value is the URL for the image to be used in the srcset.<br />The default behavior without this parameter will work for common use cases, where the `outputDir` is a subdirectory of the `inputDir` static asset directory and the site is served from the root of the domain.
| avif      | `true`     | Whether to generate AVIF versions of images in addition to the original image formats |
| webp      | `true`     | Whether to generate WebP versions of images in addition to the original image formats |
| embedPlaceholder | `true` | Set to false to generate placeholder images as separate image files, rather than embedding them into the document. This will save network traffic since standalone image files are noticeably smaller than ones embedded in the HTML document, will allow the placeholder to be served in next-gen image formats like avif/webp with fallbacks like the main image is, and will allow the browser to better optimize caching of the files. However, as a separate network request, there is the potential for a slight delay in render of the placeholder, particularly if the image is above-the fold (consider using `immediate` to disable lazy-loading for known above-the-fold images, which will perform better). Non-embedded placeholders are likely to become the default in a future major release.

## Built With

* [Svelte](https://svelte.dev)
* [sharp](https://sharp.pixelplumbing.com)

## Authors

* **Chris Han** - *Initial work* - [xiphux](https://github.com/xiphux)

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgements

* [Gridsome](https://gridsome.org/docs/images/)
* [svelte-image](https://github.com/matyunya/svelte-image)
