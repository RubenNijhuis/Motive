## Motive

<img src="./assets/terminal-example.png">

Quickly generate files using an easy to use command line application.
Select one of your templates, answer the questions and in no time the files will be generated.

## How to configure your template
Two things are important.

The file name and the file name in the `option.json` match!
There are no missing properties (names in the template or in the `options.json`)
I haven't fully configured error/file checking

An example of an options.json file
```json
{
    // These will be set for all files
	"general": {
		"name": "What is the name of the class?"
	},
    // Index of all files (might turn this into an array)
	"files": {
		"CPP_CLASS_CPP": {
            // Config regarding the file name output
			"config": {
                "fileName": "name",
				"extension": ".cpp"
			}
		},
		"CPP_CLASS_HPP": {
            // Additional info that might be needed per file
			"values": {
				"name_upppercase": "What is the class name in uppercase?"
			},
			"config": {
                "fileName": "name",
				"extension": ".hpp"
			}
		}
	}
}

```

An example of a template file
```cpp
#include "{{name}}.hpp"

{{name}}::{{name}}(void)
{
    std::cout << "{{name}} created with an empty construcor" << std::endl;

    this->_type = "{{name}}";

    return;
}

{{name}}::~{{name}}(void)
{
    std::cout << "{{name}} " << this->_type << " deconstructed" << std::endl;
    return;
}

{{name}}::{{name}}(const {{name}}& other)
{
    std::cout << "{{name}} created by copy" << std::endl;
    *this = other;
    return;
}

{{name}}& {{name}}::operator=(const {{name}}& other)
{
    std::cout << "{{name}} created by assertion" << std::endl;

    if (this != &other)
    {
        this->_type = other._type;
    }

    return (*this);
}
```

The output is created using MustacheJS