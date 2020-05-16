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
</script>

<picture>
  {#if srcsetWebp}
    <source data-srcset={srcsetWebp} />
  {/if}
  <img
    src={placeholder}
    data-srcset={srcset}
    data-sizes="auto"
    {alt}
    class="lazyload {className}" />
</picture>
