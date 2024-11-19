# LogprobsViz

This is a simple tool to visualize the [log probabilities](https://cookbook.openai.com/examples/using_logprobs) of OpenAI GPT completions. 
It is useful for debugging and understanding the model's behavior. 

![Screenshot](https://raw.githubusercontent.com/simonmysun/logprobsvz/gh-pages/screenshot.png)

## Usage

Navigate to [LogprobsViz](https://simonmysun.github.io/logprobsvz/).

The parameters are stored in your browser's LocalStorage. Click "Clear" button in case you don't want to.

A common usage is to tick the "logprobs" checkbox and enter a number of 1 to 20 in "top_logprobs. 
Enter your prompt and click "Complete". 
The log probabilities will be displayed below. 
Mouse over the tokens to see the log probabilities of candidates. 
Enable "stream" to see result in real-time.

Other parameters are not fully tested. 
Use them at your own risk. 
"n" > 1 is known not supported. 
Text input will be first attempted to be parsed with JSON. 
Mouse over the parameter names to see the descriptions.

In case anything goes wrong, check your console and contact me at [mail@maoyin.eu](mailto:mail@maoyin.eu)" or try fixing it yourself on [GitHub](https://github.com/simonmysun/logprobsvz).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).