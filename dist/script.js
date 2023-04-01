#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { askTemplateName } from "./question.js";
import { getFilesFromTemplateOptions, getOptionsConfig } from "./utils.js";
////////////////////////////////////////////////////////////////////////////////
const templateFolder = path.join(__dirname, "..", "templates");
const templateNames = fs.readdirSync(templateFolder);
////////////////////////////////////////////////////////////////////////////////
let selectedTemplate = await askTemplateName(templateNames);
const selectedTemplatePath = path.join(templateFolder, selectedTemplate);
const templateOptions = getOptionsConfig(selectedTemplatePath);
const templateFiles = await getFilesFromTemplateOptions(selectedTemplatePath, templateOptions);
for (const file of templateFiles) {
    await file.getAnswers();
}
for (const file of templateFiles) {
    await file.renderOutput(__dirname);
}
//# sourceMappingURL=script.js.map