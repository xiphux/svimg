<script context="module">
  import "lazysizes";
</script>

<script>
  export let src;
  export let alt;
  let className;
  export { className as class };
  export let srcset;
  export let srcsetWebp;
  export let placeholder;
  export let width;

  $: fixedWidth = !!(width && /^[0-9]+$/.test(width));
</script>

<picture>
  {#if srcsetWebp}
    <source
      type="image/webp"
      data-srcset={srcsetWebp}
      sizes={fixedWidth ? width + 'px' : undefined} />
  {/if}
  <img
    {src}
    srcset={placeholder}
    data-srcset={srcset}
    sizes={fixedWidth ? width + 'px' : undefined}
    data-sizes={fixedWidth ? undefined : 'auto'}
    {alt}
    {width}
    class="lazyload {className}" />
</picture>
