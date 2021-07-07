const scriptRegex = /(<script[^>]*>)(<\/script>)/gi;
const styleRegex = /(<style[^>]*>)(<\/style>)/gi;

export default function injectBlocks(content: string, type: 'script' | 'style', blocks: string[]): string {
    if (!(content && blocks.length && ['script', 'style'].includes(type))) {
        return content;
    }

    let regex: RegExp;

    if (type === 'script') {
        regex = scriptRegex;
    } else if (type === 'style') {
        regex = styleRegex;
    }

    return content.replace(regex, (match, start, end) => {
        const block = blocks.shift();
        return `${start}${block || ''}${end}`;
    });
}