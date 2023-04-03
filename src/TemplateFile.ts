import path from "path";
import fs from "fs";

import Handlebars from "handlebars";

import { askListOfQuestions } from "./question.js";
import { AnswerList, FileConfig, TemplateConfig } from "./types.js";

import { Question } from "inquirer";
import { isVariableName } from "./utils.js";

///////////////////////////////////////////////////////////////////////////////

interface ITemplateFileConstructorProperties {
	templateConfig: TemplateConfig;
	filePath: string;
}

class TemplateFile {
	private templateConfig: TemplateConfig;
	private filePath: string;

	private questions: Question[] | null;
	private answers?: AnswerList;

	private preContent: string;
	private hasAnswered: boolean;

	constructor({
		templateConfig,
		filePath,
	}: ITemplateFileConstructorProperties) {
		this.templateConfig = templateConfig;
		this.filePath = filePath;

		this.questions = templateConfig.questions || null;
		this.preContent = fs.readFileSync(this.filePath, { encoding: "utf-8" });
		this.hasAnswered = false;
	}

	getFileName(): string {
		let fileName = "";

		if (this.templateConfig.config?.fileName) {
			const { name, isVariable } = isVariableName(
				this.templateConfig.config.fileName
            );

			// If its formatted like {{name}} we get it from our
			// answers which can be merged from global and local

			if (isVariable) {
				if (this.answers) {
					fileName += this.answers[name] || "";
				}
			} else {
				fileName += this.templateConfig.config.fileName;
			}
		}

		if (this.templateConfig.config?.extension) {
			fileName += this.templateConfig.config.extension;
		}

		return fileName;
	}

	addGlobalAnswers(answers: AnswerList): void {
		this.answers = { ...answers };
	}

	addGlobalConfig(config: FileConfig): void {
		this.templateConfig.config = {
			...config,
			...this.templateConfig.config,
		};
	}

	async getAnswers() {
		if (this.questions) {
			const questionsAnswered = await askListOfQuestions(this.questions);
			this.answers = { ...this.answers, ...questionsAnswered };
		}
		this.hasAnswered = true;
	}

	async renderOutput(outputFolder: string) {
		if (!this.hasAnswered) {
			throw new Error(
				`No answers give yet for ${this.templateConfig.template}`
			);
        }
        
        Handlebars.registerHelper('loud', (str) => {
            return str.toUpperCase();
        })

        const template = Handlebars.compile(this.preContent);
		const rendered = template(this.answers);
		const fileName = this.getFileName();
        const outputPath = path.join(outputFolder, fileName);
    
		fs.writeFileSync(outputPath, rendered);
	}
}

///////////////////////////////////////////////////////////////////////////////

export default TemplateFile;
