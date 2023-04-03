// Node
import fs from "fs";
import path from "path";

// Prompt utils
import { askListOfQuestions } from "./question.js";

// Template handler
import TemplateFile from "./TemplateFile.js";

// Types
import { AnswerList, OptionsConfig } from "./types.js";

////////////////////////////////////////////////////////////////////////////////

/**
 * Generates template file classes from the options file
 *
 * @param templateDirectory
 * @param options
 * @returns
 */
export const getFilesFromTemplateOptions = async (
	templateDirectory: string,
	options: OptionsConfig
): Promise<TemplateFile[]> => {
	try {
		let templateFiles: TemplateFile[] = [];

		let generalAnswered: AnswerList;

		if (options.general) {
			generalAnswered = await askListOfQuestions(options.general);
		} else {
			generalAnswered = {};
		}

		for (const [fileName, value] of Object.entries(options.files)) {
			const filePath = path.join(templateDirectory, fileName);

			templateFiles.push(
				new TemplateFile({
					generalAnswered,
					name: fileName,
					filePath,
					fileConfig: value,
				})
			);
		}

		return templateFiles;
	} catch (err) {
		throw err;
	}
};

/**
 *
 * @param selectedTemplatePath
 * @returns
 */
export const getOptionsConfig = async (
	selectedTemplatePath: string
): Promise<OptionsConfig> => {
	try {
		const templateOptionsPath = path.join(
			selectedTemplatePath,
			"options.json"
		);

		let optionsContent = fs.readFileSync(templateOptionsPath, {
			encoding: "utf-8",
		});

		const templateOptions: OptionsConfig = JSON.parse(optionsContent);

		return templateOptions;
	} catch (err) {
		throw err;
	}
};
