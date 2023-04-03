import { Question } from "inquirer";

export interface AnswerList {
	[key: string]: string;
}

export interface FileConfig {
	fileName?: string;
	extension?: string;
}

export interface TemplateConfig {
	template: string;
	name?: string;
	questions?: Question[];
	config?: FileConfig;
}

export interface GlobalConfig {
	questions?: Question[];
	config?: FileConfig;
}

export interface OptionsConfig {
	global?: GlobalConfig;
	files: TemplateConfig[];
}
