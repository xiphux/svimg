export default function injectBlocks(content: string, type: 'script' | 'style', blocks: string[]): string {
    if (!(content && blocks.length)) {
        return content;
    }

    const regex = new RegExp(`(<${type}[^>]*>)(</${type}>)`, 'gi');

    return content.replace(regex, (match, start, end) => {
        const block = blocks.shift();
        return `${start}${block || ''}${end}`;
    });
}