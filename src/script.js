const PWD = process.cwd();

const Mustache = require("mustache");
const inquirer = require("inquirer");

const fs = require("fs");
const path = require("path");

const templateFolder = path.join(__dirname, "..", "templates");

const templateNames = fs.readdirSync(templateFolder);

const prompt = inquirer.createPromptModule();

let selectedTemplate = "";
let templateOptions = {};

let templateOutput = [];

const getTemplateDetails = () => {
  const selectedTemplatePath = path.join(templateFolder, selectedTemplate);

  const optionsFile = path.join(selectedTemplatePath, "options.json");

  const templateDetails = fs.readFileSync(optionsFile, { encoding: "utf8" });
  const unparsedOptions = JSON.parse(templateDetails);
  const filesInTemplate = fs.readdirSync(selectedTemplatePath);

  const generateTemplatesFromInput = () => {
    for (const file of filesInTemplate) {
      if (file === "options.json") continue;

      const templateFileContent = fs.readFileSync(
        path.join(selectedTemplatePath, file),
        { encoding: "utf-8" }
      );

      templateOutput.push({
        name: `${templateOptions[file].name}.${templateOptions[file].extension}`,
        content: Mustache.render(templateFileContent, templateOptions[file]),
      });
    }

    templateOutput.forEach((file) => {
      fs.writeFileSync(path.join(PWD, file.name), file.content, (err) => {
        if (err) console.error(err);
      });
    });
  };

  const getOtherTemplateDetails = () => {
    let otherTemplateDetailsQuestions = [];

    for (const [fileKey, _] of Object.entries(unparsedOptions)) {
      if (fileKey === "general") continue;

      for (const [fileQuestion, _] of Object.entries(
        unparsedOptions[fileKey]
      )) {
        if (fileQuestion === "extension") continue;

        otherTemplateDetailsQuestions.push({
          type: "input",
          name: `${fileKey}-${fileQuestion}`,
          message: `Please provide ${fileQuestion}:`,
        });
      }
    }

    // Ask said questions
    prompt(otherTemplateDetailsQuestions)
      .then((answer) => {
        for (const [answerKey, answerValue] of Object.entries(answer)) {
          const [answerKeyFile, answerKeyFileOption] = answerKey.split("-");
          templateOptions[answerKeyFile][answerKeyFileOption] = answerValue;
        }
      })
      .finally(() => {
        generateTemplatesFromInput();
      });
  };

  if (unparsedOptions.general) {
    const generalOptions = { ...unparsedOptions.general };
    let generalOptionsQuestions = [];

    // Place the general keys in the template options
    for (const fileName of filesInTemplate) {
      if (fileName === "options.json") continue;
      templateOptions[fileName] = { ...generalOptions };

      if (unparsedOptions[fileName].extension) {
        templateOptions[fileName].extension =
          unparsedOptions[fileName].extension;
      }
    }

    // Create questions for each general input key
    for (const [key, _] of Object.entries(unparsedOptions.general)) {
      generalOptionsQuestions.push({
        type: "input",
        name: key,
        message: `Please provide ${key}:`,
      });
    }

    // Ask said questions
    prompt(generalOptionsQuestions).then((answer) => {
      // Add the value of each question to the corresponding key in the template options
      for (const [templateOptionKey, _] of Object.entries(templateOptions)) {
        for (const [answerKey, questionResponse] of Object.entries(answer)) {
          templateOptions[templateOptionKey][answerKey] = questionResponse;
        }
      }

      getOtherTemplateDetails();
    });
  }
};

const askTemplateName = () => {
  prompt({
    type: "list",
    name: "selection",
    message: "What template do you need?",
    choices: [...templateNames],
  }).then((answer) => {
    selectedTemplate = answer.selection;
    getTemplateDetails();
  });
};

askTemplateName();