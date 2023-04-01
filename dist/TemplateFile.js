import { askListOfQuestions } from "./question.js";
import Mustache from "mustache";
import path from "path";
import fs from "fs";
class TemplateFile {
    constructor({ generalAnswered, name, filePath, fileConfig, }) {
        this.name = name;
        this.filePath = filePath;
        if (fileConfig.values !== undefined) {
            this.questions = fileConfig.values;
        }
        else {
            this.questions = null;
        }
        if (fileConfig)
            this.fileConfig = fileConfig;
        this.preContent = fs.readFileSync(this.filePath, { encoding: "utf-8" });
        if (generalAnswered) {
            this.answers = generalAnswered;
        }
        this.hasAnswered = false;
    }
    async getAnswers() {
        if (this.questions) {
            const questionsAnswered = await askListOfQuestions(this.questions);
            this.answers = { ...this.answers, ...questionsAnswered };
        }
        this.hasAnswered = true;
    }
    async renderOutput(outputFolder) {
        if (!this.answers) {
            throw new Error(`No answers give yet for ${this.name}`);
        }
        const rendered = Mustache.render(this.preContent, this.answers);
        let fileName = this.name;
        if (this.fileConfig?.config?.fileName) {
            if (this.answers[this.fileConfig.config.fileName]) {
                fileName = this.answers[this.fileConfig.config.fileName];
            }
            else {
                fileName = this.fileConfig.config.fileName;
                console.log(`The key ${this.fileConfig.config.fileName} for ${this.name} wasn't found so the filename defaulted to "${this.fileConfig.config.fileName}"`);
            }
        }
        fileName += this.fileConfig?.config?.extension
            ? this.fileConfig?.config.extension
            : "";
        const outputPath = path.join(outputFolder, fileName);
        fs.writeFileSync(outputPath, rendered);
    }
}
export default TemplateFile;
//# sourceMappingURL=TemplateFile.js.map