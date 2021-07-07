interface ExtractBlocksOutput {
    content: string;
    blocks: string[];
}

export default function extractBlocks(content: string, type: 'script' | 'style'): ExtractBlocksOutput {
    if (!content) {
        return {
            content,
            blocks: [],
        };
    }

    const regex = new RegExp(`(<${type}[^>]*>)([^]*?)(</${type}>)`, 'gi');

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
