import injectBlocks from '../../src/preprocessor/inject-blocks';

describe('injectBlocks', () => {

    it('returns the content if none is provided', () => {
        expect(injectBlocks('', 'script', ['<script></script>'])).toEqual('');
    });

    it('returns the input if no blocks are provided', () => {
        expect(injectBlocks('<div></div>','script', [])).toEqual('<div></div>');
    });

    it('injects a script block', () => {
        expect(injectBlocks(
            `<script></script>

            <div class="red">
                Some content
            </div>
            
            <style>
                .red {
                    color: red;
                }
            </style>`,
            'script',
            [
                `
                let hello = 'world';
                $: hello2 = hello + '2';
            `
            ]
        )).toEqual(
            `<script>
                let hello = 'world';
                $: hello2 = hello + '2';
            </script>

            <div class="red">
                Some content
            </div>
            
            <style>
                .red {
                    color: red;
                }
            </style>`
        );
    });

    it('injects a typescript block', () => {
        expect(injectBlocks(
            `<script lang="ts"></script>

            <div class="red">
                Some content
            </div>
            
            <style>
                .red {
                    color: red;
                }
            </style>`,
            'script',
            [
                `
                let hello: string = 'world';
                $: hello2 = hello + '2';
            `
            ]
        )).toEqual(
            `<script lang="ts">
                let hello: string = 'world';
                $: hello2 = hello + '2';
            </script>

            <div class="red">
                Some content
            </div>
            
            <style>
                .red {
                    color: red;
                }
            </style>`
        );
    });

    it('injects a style block', () => {
        expect(injectBlocks(
            `<script>
                let hello = 'world';
                $: hello2 = hello + '2';
            </script>

            <div class="red">
                Some content
            </div>
            
            <style></style>`,
            'style',
            [
                `
                .red {
                    color: red;
                }
            `
            ]
        )).toEqual(
            `<script>
                let hello = 'world';
                $: hello2 = hello + '2';
            </script>

            <div class="red">
                Some content
            </div>
            
            <style>
                .red {
                    color: red;
                }
            </style>`
        );
    });

    it('injects an scss block', () => {
        expect(injectBlocks(
            `<script>
                let hello = 'world';
                $: hello2 = hello + '2';
            </script>

            <div class="red">
                Some content
            </div>
            
            <style lang="scss"></style>`,
            'style',
            [
                `
                .red {
                    color: red;
                    .text {
                        color: black;
                    }
                }
            `
            ]
        )).toEqual(
            `<script>
                let hello = 'world';
                $: hello2 = hello + '2';
            </script>

            <div class="red">
                Some content
            </div>
            
            <style lang="scss">
                .red {
                    color: red;
                    .text {
                        color: black;
                    }
                }
            </style>`
        );
    });

    it('injects multiple script blocks', () => {
        expect(injectBlocks(
            `<script context="module"></script>
            
            <script></script>

            <div class="red">
                Some content
            </div>
            
            <style>
                .red {
                    color: red;
                }
            </style>`,
            'script',
            [
                `
                export function popup(msg) {
                    alert(msg);
                }
            `,
                `
                let hello = 'world';
                $: hello2 = hello + '2';
            `
            ]
        )).toEqual(
            `<script context="module">
                export function popup(msg) {
                    alert(msg);
                }
            </script>
            
            <script>
                let hello = 'world';
                $: hello2 = hello + '2';
            </script>

            <div class="red">
                Some content
            </div>
            
            <style>
                .red {
                    color: red;
                }
            </style>`
        );
    });

});