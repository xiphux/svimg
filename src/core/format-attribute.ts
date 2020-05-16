export default function formatAttribute(attribute: string, value: string | boolean) {
    if (!attribute || !value) {
        return '';
    }

    return value === true ? attribute : `${attribute}="${value}"`
}