import fs from "fs";
import path from "path";
import { askListOfQuestions } from "./question.js";

import TemplateFile from "./TemplateFile.js";
import { AnswerList, OptionsConfig } from "./types.js";

export const getFilesFromTemplateOptions = async (
	templateDirectory: string,
	options: OptionsConfig
): Promise<TemplateFile[]> => {
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
};

export const getOptionsConfig = (
	selectedTemplatePath: string
): OptionsConfig => {
	const templateOptionsPath = path.join(selectedTemplatePath, "options.json");

	const optionsContent = fs.readFileSync(templateOptionsPath, {
		encoding: "utf-8",
	});

	const templateOptions: OptionsConfig = JSON.parse(optionsContent);

	return templateOptions;
};
