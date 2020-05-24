import getOptionsHash from "../image-processing/get-options-hash";
import ProcessingQueue from "../core/processing-queue";
import createPlaceholder, { CreatePlaceholderOptions } from "./create-placeholder";

interface PlaceholderQueueInput {
    inputFile: string;
    options?: CreatePlaceholderOptions;
}

export default class PlaceholderQueue extends ProcessingQueue<PlaceholderQueueInput, string> {

    protected async getHashKey({ inputFile, options }: PlaceholderQueueInput): Promise<string> {
        return getOptionsHash({
            inputFile,
            options: options ? getOptionsHash({
                blur: options.blur,
            }) : undefined,
        });
    }

    protected async run({ inputFile, options }: PlaceholderQueueInput): Promise<string> {
        return createPlaceholder(inputFile, options);
    }
}