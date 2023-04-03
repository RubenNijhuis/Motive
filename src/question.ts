import inquirer, { Question } from "inquirer";
import { AnswerList } from "./types.js";

const askTemplateName = async (templateNames: string[]): Promise<string> => {
	try {
		const { selectedTemplate } = await inquirer.prompt({
			type: "list",
			name: "selectedTemplate",
			message: "What template do you need?",
			choices: templateNames,
		});

		return selectedTemplate;
	} catch (err) {
		throw err;
	}
};

const askListOfQuestions = async (
	questions: Question[]
): Promise<AnswerList> => {
	try {
		const response = await inquirer.prompt(questions);
		return response;
	} catch (err) {
		throw err;
	}
};

export { askTemplateName, askListOfQuestions };
