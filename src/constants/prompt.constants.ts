import { ISystemPrompt } from '../interfaces/ai/prompt.interface';
import { IHardwareType } from '../interfaces/computer/hardware.interface';

export const AI_PROMPT_SYSTEM_TEMPLATE = (
  hardware: IHardwareType | string,
): ISystemPrompt => {
  return `Your task is search and analyze ${hardware} information in the document about my query.
    The document is about hardware component generation, name and price.
    
    
    Answer to JSON object.
    JSON Keys are "name", "tablePrice", "buyingPrice".
    "name" field is string. use the input query's ${hardware} name.
    "tablePrice" field is number. use the price in the document. if price contain ',' remove it.
    "buyingPrice" field is number. it's "tablePrice" * 0.5. if price contain ',' remove it.
    
    
    Here's reference documents. You can use this documents to find ${hardware} information.
    If you don't find the price in the document, just return the field as null.
    ================================================================================================
    {context}
`;
};
export const AI_PROMPT_INPUT_TEMPLATE = `{input}'`;

export const AI_PROMPT_INTEL_CORE_SERIES_NORMALIZE_TEMPLATE = `
Transform the following Intel Core series component names into a standardized format for matching with a pricing table.
Focus on extracting the series (e.g., i3, i5, i7, i9) and the specific model number, precisely maintaining any original suffixes (K, KS, F, KF) present in the input. Remove any trademark symbols, unnecessary descriptions, and frequency information.
The output should simplify prefixes and normalize capitalization inconsistencies, ensuring the format aligns with the persistent names in the vector store, without introducing or altering suffixes unless specifically mentioned in the input.

Example Input Intel Core Series Component Names:
1. Intel(R) Core(TM) i5-4590 CPU @ 3.40GHz
2. Intel(R) Core(TM) i7-9700K CPU @ 3.90GHz
3. Intel(R) Core(TM) i3-10100F CPU @ 3.70GHz
4. Intel(R) Core(TM) i9-13900KS CPU @ 6.00GHz
5. Intel(R) Core(TM) i9-14900K CPU @ 6.00GHz

Required Transformations:
- Remove "Intel(R) Core(TM)" and "CPU" labels.
- Normalize capitalization (e.g., "i5" to "I5").
- Retain the series designation (e.g., i3, i5, i7, i9) and the specific model number, including suffixes (K, KS, F, KF). Do not alter or introduce new suffixes that were not present in the original input.
- Eliminate frequency information (e.g., "@ 3.70GHz").
- Remove the dash between the series designation and the model number.
- Ensure model identifiers, including suffixes, are accurately simplified and compatible with the persistent names in the vector store.

Example Transformed Intel Core Series Component Names:
1. I5 4590
2. I7 9700K
3. I3 10100F
4. I9 13900KS
5. I9 14900K

Human: Source Intel Core Series CPU Name is "{input}"
AI: 
`;

export const AI_PROMPT_PENTIUM_SERIES_NORMALIZE_TEMPLATE = `
Transform the following Pentium series component names into a standardized format for matching with a pricing table.
Focus on extracting the specific model number while removing any trademark symbols, unnecessary descriptions, and frequency information.
The output should simplify prefixes and normalize capitalization inconsistencies, ensuring the format aligns with the persistent names in the vector store, without altering the model identifiers unless simplification is required.

Example Input Pentium Series Component Name:
1. Intel(R) Pentium(R) CPU G645 @ 2.90GHz
2. Intel(R) Pentium(R) CPU G4560 @ 3.50GHz

Required Transformations:
- Remove "Intel(R) Pentium(R)" and "CPU" labels.
- Eliminate frequency information (e.g., "@ 2.90GHz").
- Ensure the model identifier is accurately simplified and compatible with the persistent names in the vector store, maintaining any relevant model numbers without introducing or altering characters.

Example Transformed Pentium Series Component Name:
1. G645
2. G4560

Human: Source Pentium Series CPU Name is {input}
AI: 
`;

export const AI_PROMPT_CELERON_SERIES_NORMALIZE_TEMPLATE = `
Transform the following Celeron series component names into a standardized format for matching with a pricing table.
Focus on extracting the specific model number while removing any trademark symbols, unnecessary descriptions, and frequency information.
The output should remove prefixes, simplify any suffixes, and normalize capitalization inconsistencies, ensuring the format aligns with the persistent names in the vector store.

Example Input Celeron Series Component Name:
1. Intel(R) Celeron(R) CPU G5900 @ 3.50GHz
2. Intel(R) Celeron(R) CPU G5905 @ 3.50GHz


Required Transformations:
- Remove "Intel(R) Celeron(R)" and "CPU" labels.
- Eliminate frequency information (e.g., "@ 3.50GHz").
- Retain the model number, ensuring it is accurately simplified and compatible with the persistent names in the vector store.
- Normalize capitalization and remove any unnecessary characters or spaces, ensuring a clean and standardized output.

Example Transformed Celeron Series Component Name:
1. G5900
2. G5905

Human: Source Celeron Series CPU Name is {input}
AI: 
`;

export const AI_PROMPT_RYZEN_SERIES_NORMALIZE_TEMPLATE = `
Transform the following Ryzen series component names into a standardized format for matching with a pricing table, incorporating Korean characters, specific suffixes (X, XT, G, X3D, F), handling models without any suffix, and mapping series numbers to their corresponding code names in Korean. It is crucial to accurately reflect the presence or absence of suffixes in the model number and to map series numbers to Korean code names accurately. Focus on extracting the series designation (e.g., Ryzen 3, Ryzen 5, Ryzen 7, Ryzen 9) translated to Korean (e.g., 라이젠) and the specific model number, while removing any trademark symbols, unnecessary descriptions, and frequency information.
The output should retain the translated series designation, model number, any suffixes, and include the correct Korean code name based on the series number, ensuring the format aligns with the persistent names in the vector store that include Korean characters, specific suffix details, models without suffixes, and correct code name mappings.

Instructions for AI:
- If a model number does not include a suffix in the input (e.g., no "X", "XT", "G", "X3D" or "F" following the number), do not add any suffix in the output.
- Translate "Ryzen" to "라이젠" and remove "AMD", "Processor", any core count information (e.g., "6-Core"), and any mention of integrated graphics or frequency information.
- Map series numbers to their corresponding Korean code names according to the specified rules, ensuring to apply the correct code name even for newer or less common suffixes like "F":
  - 1000 series => 서밋릿지
  - 2000 series (G suffix) => 레이븐릿지
  - 2000 series (Non G suffix) => 피나클릿지
  - 3000 series (G suffix) => 피카소
  - 3000 series (Non G suffix) => 마티스
  - 4000 series (G suffix) => 르누아르
  - 5000 series (G suffix) => 세잔
  - 5000 series (Non G suffix) => 버미어
  - 7000 series (Any suffix, including F) => 라파엘
- Ensure the presence or absence of suffixes and correct code name mapping is accurately reflected in the output.
- Normalize capitalization and remove any unnecessary characters or spaces, ensuring a clean and standardized output compatible with the vector store's requirements.

Example Input Ryzen Series Component Names:
1. AMD Ryzen 5 1600 6-Core Processor @ 3.20GHz
2. AMD Ryzen 3 2200G 4-Core Processor with Radeon Vega Graphics @ 3.50GHz
3. AMD Ryzen 5 2600 6-Core Processor @ 3.80GHz
4. AMD Ryzen 7 3700X 8-Core Processor @ 3.80GHz
5. AMD Ryzen 5 5500G 6-Core Processor with Radeon Vega Graphics @ 3.70GHz
6. AMD Ryzen 9 5900X 12-Core Processor @ 3.70GHz
7. AMD Ryzen 5 7600 8-Core Processor @ 4.30GHz
8. AMD Ryzen 9 7950X3D 16-Core Processor @ 4.50GHz

Example Transformed Ryzen Series Component Names:
1. 라이젠5 서밋릿지1600
2. 라이젠3 레이븐릿지2200G
3. 라이젠5 피나클릿지2600
4. 라이젠7 마티스3700X
5. 라이젠5 세잔5500G
6. 라이젠9 버미어5900X
7. 라이젠5 라파엘7600
8. 라이젠9 라파엘7950X3D

Human: Source Ryzen Series CPU Name is "{input}"
AI: 
`;

export const RETRIEVAL_QA_SIMPLE_PROMPT = `How much is the price of the hardware component?
    The document is about hardware price table(parsed from html tbody).
    The input model name is usually not exactly same as the model name in the document.
    So you need to analyze the input model name and find the closest model name in the document.
    If you can't find a specific model price then set "tablePrice" field 100.
    
    
    
    Here's Intel CPU name convention.
    e.g. i5 2500k
    i7: CPU series 
    2: Generation
    500: Model number
    k: Model suffix (e.g. k, f, ks, etc)
    
    
    
    e.g. i9 12900K
    i9: CPU series
    12: Generation
    900: Model number
    K: Model suffix (e.g. K, F, KS, etc)
    
    

    


    
    Answer to JSON object. 
    JSON Keys are "name", "tablePrice", "buyingPrice". 
    "name" field is string and use input model name.
    "tablePrice" field is number.
    "buyingPrice" field is tablePrice * 0.5 and also number.
    
    
    Query: {query} 
`;

export const AI_SAMPLE_COMPUTER_PROMPT = `
    You are an AI designed to estimate the buying price of a wide range of used PC's hardware, it's including CPU, GPU, motherboard, RAM and storage.
    Your task is to analyze it and respond with the estimated price in JSON format.
    Be careful check model name's detail (e.g. in cpu case, like K, F, S model).
    
    Answer to json format. 
    "name" field type is string.
    "tablePrice" field type is number. 
    "buyingPrice" field type is number. "buyingPrice" field is tablePrice * 0.5.
    
    price must be non-negative number.
    If you don't know the price then set 100000.
`;
