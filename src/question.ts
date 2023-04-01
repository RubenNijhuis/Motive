import inquirer from "inquirer";
import { QuestionList } from "./types.js";

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
	questions: QuestionList
): Promise<QuestionList> => {
	try {
		let questionsList: any[] = [];

        for (const [key, value] of Object.entries(questions)) {
			questionsList.push({
				type: "input",
				name: key,
				message: value,
			});
		}

		const response = await inquirer.prompt(questionsList);
		return response;
	} catch (err) {
		throw err;
	}
};

export { askTemplateName, askListOfQuestions };
