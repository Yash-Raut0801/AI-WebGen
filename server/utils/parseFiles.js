export function parseFiles(text) {

    const files = [];

    const regex = /FILE:\s*(.+?)\n([\s\S]*?)(?=\nFILE:|$)/g;

    let match;

    if (!text || !text.includes("FILE:")) {
        throw new Error("Invalid AI output");
    }

    while ((match = regex.exec(text)) !== null) {

        const fileName = match[1].trim();
        const content = match[2]
            .replace(/```[a-z]*\n?/g, "")
            .replace(/```/g, "")
            .trim();

        files.push({
            name: fileName,
            content: content
        });

    }

    return files;

}