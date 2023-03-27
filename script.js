const PWD = process.cwd();

const Mustache = require("mustache");
const prompt = require("prompt");
const fs = require("fs");
const path = require("path");

const templateFolder = path.join(__dirname, "templates");

let templateNames = [];

fs.readdir(templateFolder, (err, files) => {
  if (err) {
    console.log(err);
    return;
  }
  files.forEach((file) => {
    templateNames.push(file);
  });

  console.log("Select a template");
  for (const name of templateNames) {
    console.log(name);
  }

  prompt.start();

  const askTemplateName = () => {
    prompt.get(["templateSelection"], (err, result) => {
      const found = templateNames.find(
        (name) => name === result.templateSelection
      );

      if (!found) {
        console.log(result.templateSelection);
        console.log("this template doesn't exist");
        return;
      }

      console.log("Selected " + found);
    });
  };
  askTemplateName();
});

// const output = Mustache.render("")
