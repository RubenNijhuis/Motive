#!/usr/bin/env node
// Node
import fs from "fs";
import path from "path";
// Get current
import { fileURLToPath } from "url";
// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pwd = process.env.PWD;
// Utils
import { askTemplateName } from "./question.js";
import { getFilesFromTemplateOptions, getOptionsConfig } from "./utils.js";
////////////////////////////////////////////////////////////////////////////////
try {
    const templateFolder = path.join(__dirname, "..", "templates");
    const templateNames = fs.readdirSync(templateFolder);
    if (templateNames.length === 0) {
        throw Error("You haven't created any templates yet");
    }
    let selectedTemplate = await askTemplateName(templateNames);
    const selectedTemplatePath = path.join(templateFolder, selectedTemplate);
    const templateOptions = await getOptionsConfig(selectedTemplatePath);
    const templateFiles = await getFilesFromTemplateOptions(selectedTemplatePath, templateOptions);
    for (const file of templateFiles) {
        await file.getAnswers();
    }
    for (const file of templateFiles) {
        await file.renderOutput(pwd);
    }
}
catch (err) {
    if (err instanceof Error) {
        console.error(`Error: ${err.message}`);
        console.error(err);
    }
    else {
        console.log(err);
    }
}
//# sourceMappingURL=index.js.map