import { IHardwareType } from '../../interfaces/computer/hardware.interface';
import { ISystemPrompt } from '../../interfaces/ai/prompt.interface';

export const AI_PROMPT_SYSTEM_TEMPLATE = (
  hardwareType: IHardwareType | string,
): ISystemPrompt => {
  return `Your task is search and analyze ${hardwareType} information in the document about my query.
    The document is about hardware component generation, name and price.
    
    
    Answer to JSON object.
    JSON Keys are "name", "tablePrice", "buyingPrice".
    "name" field is string. use the input query's ${hardwareType} name.
    "tablePrice" field is number. use the price in the document. if price contain ',' remove it.
    "buyingPrice" field is number. it's "tablePrice" * 0.5. if price contain ',' remove it.
    
    
    Here's reference documents. You can use this documents to find ${hardwareType} information.
    If you don't find the price in the document, just return the field as null.
    ================================================================================================
    {context}
`;
};

export const AI_PROMPT_INPUT_TEMPLATE = `How much is the "{input}" price?`;
