import extractBlocks from '../../src/preprocessor/extract-blocks';

describe('extractBlocks', () => {

    it('returns nothing if no content is provided', () => {
        expect(extractBlocks('', 'script')).toEqual({
            content: '',
            blocks: [],
        });
    });

    it('extracts a script block', () => {
        const { content, blocks } = extractBlocks(
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
            </style>`,
            'script'
        );

        expect(content).toEqual(
            `<script></script>

            <div class="red">
                Some content
            </div>
            
            <style>
                .red {
                    color: red;
                }
            </style>`
        );
        expect(blocks).toEqual([
            `
                let hello = 'world';
                $: hello2 = hello + '2';
            `
        ]);
    });

    it('extracts a typescript block', () => {
        const { content, blocks } = extractBlocks(
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
            </style>`,
            'script'
        );

        expect(content).toEqual(
            `<script lang="ts"></script>

            <div class="red">
                Some content
            </div>
            
            <style>
                .red {
                    color: red;
                }
            </style>`
        );
        expect(blocks).toEqual([
            `
                let hello: string = 'world';
                $: hello2 = hello + '2';
            `
        ]);
    });

    it('extracts a style block', () => {
        const { content, blocks } = extractBlocks(
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
            </style>`,
            'style'
        );

        expect(content).toEqual(
            `<script>
                let hello = 'world';
                $: hello2 = hello + '2';
            </script>

            <div class="red">
                Some content
            </div>
            
            <style></style>`
        );
        expect(blocks).toEqual([
            `
                .red {
                    color: red;
                }
            `
        ]);
    });

    it('extracts an scss block', () => {
        const { content, blocks } = extractBlocks(
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
            </style>`,
            'style'
        );

        expect(content).toEqual(
            `<script>
                let hello = 'world';
                $: hello2 = hello + '2';
            </script>

            <div class="red">
                Some content
            </div>
            
            <style lang="scss"></style>`
        );
        expect(blocks).toEqual([
            `
                .red {
                    color: red;
                    .text {
                        color: black;
                    }
                }
            `
        ]);
    });

    it('extracts multiple script blocks', () => {
        const { content, blocks } = extractBlocks(
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
            </style>`,
            'script'
        );

        expect(content).toEqual(
            `<script context="module"></script>
            
            <script></script>

            <div class="red">
                Some content
            </div>
            
            <style>
                .red {
                    color: red;
                }
            </style>`
        );
        expect(blocks).toEqual([
            `
                export function popup(msg) {
                    alert(msg);
                }
            `,
            `
                let hello = 'world';
                $: hello2 = hello + '2';
            `
        ]);
    });

});