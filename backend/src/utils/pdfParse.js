import fs from "fs";
import { PDFParse } from "pdf-parse";

const extractPdfText = async (filePath) => {
    let parser;

    try {
        if (!filePath) {
            throw new Error("PDF file path is missing");
        }

        if (!fs.existsSync(filePath)) {
            throw new Error(`PDF file not found: ${filePath}`);
        }

        const buffer = fs.readFileSync(filePath);

        parser = new PDFParse({
            data: buffer,
        });

        const result = await parser.getText();

        if (!result?.text || !result.text.trim()) {
            throw new Error("No text could be extracted from PDF");
        }

        return result.text.trim();

    } catch (error) {

        console.error(
            "PDF PARSING ERROR:",
            error?.message || error
        );

        throw new Error(
            `Failed to extract text from PDF: ${
                error?.message || "Unknown error"
            }`
        );

    } finally {

        if (parser) {
            await parser.destroy();
        }
    }
};

export {
    extractPdfText,
};