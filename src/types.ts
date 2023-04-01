export interface QuestionList {
	[key: string]: string;
}

export interface AnswerList {
	[key: string]: string;
}

export interface FileConfig {
	values?: QuestionList;
    config?: {
        fileName: string;
		extension: string;
	};
}

export interface OptionsConfig {
	general?: {
		[key: string]: string;
	};
	files: {
		[key: string]: FileConfig;
	};
}
