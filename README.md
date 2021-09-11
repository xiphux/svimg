# svimg

svimg is an image preprocessing and lazy loading component for [Svelte](https://svelte.dev). It consists of:

* A Svelte preprocessor that automatically resizes your images to multiple resolutions in a `srcset`, creates additional [AVIF](https://en.wikipedia.org/wiki/AV1) and [WebP](https://developers.google.com/speed/webp) versions, and generates blurred placeholder images
* A Svelte component that displays the blurred placeholder and automatically lazy loads the proper resolution image when it comes into view

svimg uses native browser lazy loading with a fallback to IntersectionObserver, and automatically calculates the appropriate `sizes` attribute. Some other image components do not set a proper `sizes` attribute, which can cause the browser to download a much larger resolution image than necessary if you are resizing the image with CSS. svimg will also use a literal width if specified to control image preprocessing and only generate the necessary image files for that width.

## Getting Started

### Installation

Since svimg is an external Svelte component, you'll want to make sure it gets bundled by Svelte during compile by installing it as a dev dependency (or modifying your rollup/webpack config to not treat it as an external). 

```bash
npm install -D svimg
```

In `rollup.config.js`, add `imagePreprocessor` as a preprocessor for `rollup-plugin-svelte`:

```js
import imagePreprocessor from 'svimg';

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

If you're using [Sapper](https://sapper.svelte.dev/), add the preprocessor to both the client and the server svelte plugins. Make sure to use the same instance of `imagePreprocessor` for both client and server, to avoid redundant double-processing of image files:

```js
import imagePreprocessor from 'svimg';

const preprocess = [
    imagePreprocessor({
        inputDir: 'static',
        outputDir: 'static/g',
        webp: true,
        avif: true
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

### Usage

#### Svelte Component

```html
<script>
import Image from 'svimg';
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
import 'svimg/dist/s-image';
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

#### Preprocessor Options

| Option    | Default    |            |
| --------- | ---------- | ---------- |
| inputDir | *required* | The static asset directory where image urls are retrieved from |
| outputDir | *required* | The output directory where resized image files should be written to. This should usually be a subdirectory within the normal static asset directory |
| publicPath | The `outputDir` relative to the `inputDir` static asset directory | The public path that images will be served from. This will be prepended to the src url during preprocessing. The default behavior will work for most use cases, where the `outputDir` is a subdirectory of the `inputDir` static asset directory and the site is served from the root of the domain. This can be overridden for more advanced use cases, such as a site served from a subdirectory of the domain or for images served from a separate domain such as a CDN or static asset domain.
| avif      | `true`     | Whether to generate AVIF versions of images in addition to the original image formats |
| webp      | `true`     | Whether to generate WebP versions of images in addition to the original image formats |

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