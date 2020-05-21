import Image from './Image.svelte';

if (typeof window !== undefined && window.customElements) {
    customElements.define('s-image', Image);
}