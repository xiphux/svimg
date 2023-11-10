# Changelog

## 4.0.0

* BREAKING: svimg is now pure ESM for Svelte 4. CommonJS is no longer supported
* BREAKING: Entry points have changed
    * The Image svelte component is now at the `/Image.svelte` entry point (`import Image from 'svimg/Image.svelte'` instead of `import Image from 'svelte'`)
    * The s-image custom element is now at the `/s-image` entry point (`import 'svimg/s-image'` instead of `import 'svimg/dist/s-image'`)
    * The process entry point's contents are now just part of the default `'svimg'` entry point
* BREAKING: Remove `publicPath` option. Please use a `srcGenerator` function instead: `(path) => '/public/path' + path`
* BREAKING: Drop Node 14 support
* BREAKING: Target ES2021. Support modern browsers and Node versions, but not older browsers like IE

## 3.2.0

* Add `embedPlaceholder` option to support placeholders as separate images files rather than embedded content
* Fix ResizeObserver error on dynamically hidden images

## 3.1.0

* Add `srcGenerator` option for more flexibility of src transformation
* Deprecate `publicPath` option in favor of `srcGenerator`
* Fix image generation when an explicit width larger than the original image width is specified

## 3.0.0

* BREAKING: Drop Node 12 support
* Export ImagePreprocessorOptions type

## 2.0.0

* BREAKING: Image preprocessor is now a named export instead of a default export (`import { imagePreprocessor } from 'svimg'` instead of `import imagePreprocessor from 'svimg'`)
* TypeScript definitions are now provided for the Image component
* JSDoc has been added for the Image component and imagePreprocessor
* Image preprocessor code now targets ES2017

## 1.1.1

* Avoid rendering alt text while an immediate image is still loading

## 1.1.0

* Add publicPath override option
* Fix preprocessing of Image tags with line breaks

## 1.0.0

* Drop Node 10 support
* Fix issue with placeholder image's aspect ratio being slightly off
* Suppress warnings when optional parameters aren't passed

## 0.5.0

* Replace preprocessor parser to better handle unrecognized script/style languages (eg TypeScript/SCSS)

## 0.4.1

* Fix issue with Chrome downloading larger than necessary image sizes

## 0.4.0

* Add AVIF generation support
* Use sharp's default quality for each image format by default

## 0.3.1

* Reduce size of placeholder image in HTML
* Suppress warnings when blur/quality attributes aren't passed
* Preserve aspect ratio when loading placeholder

## 0.3.0

* Allow specifying image placeholder blur amount
* Allow specifying resized image quality

## 0.2.1

* Remove will-change to avoid unnecessary resource usage

## 0.2.0

* Add immediate option to disable lazy loading

## 0.1.8

* Fix overflow of image on Safari

## 0.1.7

* Add blur up transition from placeholder to actual image
* Use width as max-width
* Fallback without sizes if browser doesn't support ResizeObserver

## 0.1.6

* Fix issue with placeholder/real image height mismatch
* Adjust css to avoid accidental purging by purgecss

## 0.1.5

* Parallelization improvements

## 0.1.4

* Custom element support

## 0.1.3

* Fix some issues with automatic width calculation
* Avoid adding bad class name 'undefined'

## 0.1.2

* Replace lazyimages with native lazy loading and IntersectionObserver fallback

## 0.1.1

* Initial release of Svelte component and preprocessor, supporting image preprocessing, lazy loading, and explicit image width.