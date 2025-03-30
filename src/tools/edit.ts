import { readFile, writeFile } from './filesystem.js';

interface SearchReplace {
    search: string;
    replace: string;
}

export async function performSearchReplace(filePath: string, block: SearchReplace): Promise<void> {
    const content = await readFile(filePath);
    
    // Find first occurrence
    const searchIndex = content.indexOf(block.search);
    if (searchIndex === -1) {
        throw new Error(`Search content not found in ${filePath}`);
    }

    // Replace content
    const newContent = 
        content.substring(0, searchIndex) + 
        block.replace + 
        content.substring(searchIndex + block.search.length);

    await writeFile(filePath, newContent);
}

export async function parseEditBlock(blockContent: string): Promise<{
    filePath: string;
    searchReplace: SearchReplace;
}> {
    const lines = blockContent.split('\n');
    
    // First line should be the file path
    const filePath = lines[0].trim();
    
    // Find the markers
    const searchStart = lines.indexOf('<<<<<<< SEARCH');
    const divider = lines.indexOf('=======');
    const replaceEnd = lines.indexOf('>>>>>>> REPLACE');
    
    if (searchStart === -1 || divider === -1 || replaceEnd === -1) {
        throw new Error('Invalid edit block format - missing markers');
    }
    
    // Extract search and replace content
    const search = lines.slice(searchStart + 1, divider).join('\n');
    const replace = lines.slice(divider + 1, replaceEnd).join('\n');
    
    return {
        filePath,
        searchReplace: { search, replace }
    };
}