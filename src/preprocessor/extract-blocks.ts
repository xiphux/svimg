interface ExtractBlocksOutput {
    content: string;
    blocks: string[];
}

const scriptRegex = /(<script[^>]*>)([^]*?)(<\/script>)/gi;
const styleRegex = /(<style[^>]*>)([^]*?)(<\/style>)/gi;

export default function extractBlocks(content: string, type: 'script' | 'style'): ExtractBlocksOutput {
    if (!(content && ['script', 'style'].includes(type))) {
        return {
            content,
            blocks: [],
        };
    }

    let regex: RegExp;

    if (type === 'script') {
        regex = scriptRegex;
    } else if (type === 'style') {
        regex = styleRegex;
    }

    const blocks: string[] = [];
    const newContent = content.replace(regex, (match, start, block, end) => {
        blocks.push(block);
        return `${start}${end}`;
    });

    return {
        content: newContent,
        blocks,
    };
}
