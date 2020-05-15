import sharp from 'sharp';

export default async function getImageMetadata(inputFile: string): Promise<sharp.Metadata> {
    if (!inputFile) {
        throw new Error('Input file is required');
    }

    return sharp(inputFile).metadata();
}