// EdDiscussionData.ts - Structured data for the Ed Discussion section

export interface QAItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  hasCode: boolean;
  codeSnippet?: string;
}

export const categories = [
  "General FAQ",
  "Built-ins & Functions",
  "Testing & Validation",
  "GitHub & Workflow",
  "Code Style & Documentation"
];

export const qaItems: QAItem[] = [
  {
    id: "faq-1",
    category: "General FAQ",
    question: "What built-in functions can we use in our project?",
    answer: "You may use the built-in functions in your `tests.py` file, NOT in `task.py`. The restriction is on functions that would directly solve the entire task for you. For example, you cannot use `int()` or `float()` to convert strings to numbers in `conv_num`, `datetime.datetime.fromtimestamp()` in `my_datetime`, or built-in byte/hex conversion functions in `conv_endian`. However, you can use helper functions like `isdigit()`, `ord()`, and bitwise operators that still require you to implement the core logic yourself.",
    hasCode: false
  },
  {
    id: "faq-2",
    category: "General FAQ",
    question: "How should we handle timezone issues with datetime?",
    answer: "Some students are seeing different dates returned by the datetime module when passed a given number of seconds when working locally or remotely. This is because `datetime.datetime.fromtimestamp()` uses the local timezone. To avoid this, you want to use UTC, so `datetime.datetime.fromtimestamp(epoch_sec, tz=timezone.utc)`.",
    hasCode: true,
    codeSnippet: "datetime.datetime.fromtimestamp(epoch_sec, tz=timezone.utc)"
  },
  {
    id: "faq-3",
    category: "General FAQ",
    question: "What should we do if a group mate drops?",
    answer: "If a group mate drops, let the instructor know immediately.",
    hasCode: false
  },
  {
    id: "faq-4",
    category: "General FAQ",
    question: "Are there any platform-specific issues to be aware of?",
    answer: "If you are developing locally on a Windows machine, you may run into an upper limit for `datetime.datetime.fromtimestamp(epoch_sec, tz=timezone.utc)` that is very low. You need to be able to handle up to the year 9999, so it is best to run your tests on a Linux system, like GitHub.",
    hasCode: true,
    codeSnippet: "datetime.datetime.fromtimestamp(epoch_sec, tz=timezone.utc)"
  },
  {
    id: "built-ins-1",
    category: "Built-ins & Functions",
    question: "Can we use functions like isdigit() or ord() for the conv_num function?",
    answer: "Yes, you can use functions like `isdigit()`, `ord()`, and bitwise operators. The restriction is on functions that would directly solve the entire task for you. You cannot use `int()` or `float()` to convert strings to numbers in `conv_num`, but you can use helper functions that still require you to implement the core logic yourself.",
    hasCode: false
  },
  {
    id: "built-ins-2",
    category: "Built-ins & Functions",
    question: "Are we allowed to use regular expressions for parsing in the conv_num function?",
    answer: "Yes, you can use regular expressions for parsing in your implementation. However, you still need to do the actual conversion manually - you can't use regex to parse and then pass the result to `int()` or `float()`. Regex can be helpful for validating input formats, but the core conversion logic must be implemented by your code.",
    hasCode: false
  },
  {
    id: "built-ins-3",
    category: "Built-ins & Functions",
    question: "For the conv_num function, how should we handle commas in numbers?",
    answer: "Commas should not be considered valid in the input for `conv_num`. If the input contains commas (e.g., '1,234'), the function should return None. The function should only accept digits, a single decimal point (if a float), and a single leading negative sign if applicable. Any other characters, including commas, should cause the function to return None.",
    hasCode: false
  },
  {
    id: "built-ins-4",
    category: "Built-ins & Functions",
    question: "How should we handle very large or very small numbers in conv_num?",
    answer: "Your implementation should handle reasonably large and small numbers within Python's floating-point precision limits. You don't need to implement arbitrary precision. For scientific notation (e.g., '1.23e+10'), you should parse it correctly and return the appropriate value. The same applies to very small numbers with negative exponents. Just make sure your implementation doesn't break on edge cases like '1e10' or '1.2e-5'.",
    hasCode: false
  },
  {
    id: "testing-1",
    category: "Testing & Validation",
    question: "When running our tests, we're getting output like 'AssertionError: assert None == 123'. Is this a problem?",
    answer: "This is showing that your function is returning `None` when it should be returning `123`. The test expected `conv_num('0123')` to return `123`, but your function returned `None` instead. This is not a linting error but an actual test failure. You need to fix your implementation to handle leading zeros correctly.",
    hasCode: true,
    codeSnippet: "E       AssertionError: assert None == 123\nE        +  where None = conv_num('0123')"
  },
  {
    id: "testing-2",
    category: "Testing & Validation",
    question: "What test cases should we include for the conv_endian function?",
    answer: "For the `conv_endian` function, make sure to test: 1) Converting between 'big' and 'little' endian for various values, 2) Handling of negative numbers, 3) Proper padding (e.g., 2 → '02' in hex), 4) Zero handling (should be '00'), 5) Case sensitivity of the 'endian' parameter (only 'big' and 'little' lowercase are valid), 6) Invalid inputs (should return None), 7) Boundary values. Remember that negative numbers should be represented with a leading '-' sign followed by the hex representation of the absolute value, not using two's complement.",
    hasCode: false
  },
  {
    id: "testing-3",
    category: "Testing & Validation",
    question: "Should we keep the tests from Part 1 in our tests.py file for Part 2, or start fresh?",
    answer: "You should keep and build upon the tests from Part 1. Part 2 extends the functionality, so your tests should cover both the original requirements and the new ones. Make sure your tests are organized clearly, perhaps with separate test classes for each function, and that you're testing all the requirements from both parts.",
    hasCode: false
  },
  {
    id: "testing-4",
    category: "Testing & Validation",
    question: "What's the best way to structure our tests?",
    answer: "For your tests.py file: 1) Make sure you're testing all edge cases mentioned in the requirements, 2) Structure your tests using separate test classes for each function, 3) Include tests for both valid and invalid inputs, 4) Verify return types (int vs float) as specified in the requirements, 5) You can use built-in functions in your test file (unlike in task.py). Remember that thorough testing is part of your grade, so make sure you cover all the requirements and edge cases.",
    hasCode: false
  },
  {
    id: "github-1",
    category: "GitHub & Workflow",
    question: "Do we need GitHub Pro for this project?",
    answer: "No, you don't need GitHub Pro for this project. The free tier of GitHub provides all the features you need: private repositories, collaboration with your group members, CI/CD with GitHub Actions, and issue tracking. If you're a student, you can also sign up for the GitHub Student Developer Pack, which provides GitHub Pro for free, but it's not required for this assignment.",
    hasCode: false
  },
  {
    id: "github-2",
    category: "GitHub & Workflow",
    question: "Do we need to update our main branch before the grading deadline?",
    answer: "You must update your main branch with your final submission before the grading deadline. While working in feature branches is good practice during development, your final submission must be merged into the main branch. Make sure that: 1) All your code is merged to main, 2) The main branch passes all tests, 3) All required files are present in the main branch. We will only grade what's in the main branch at the deadline.",
    hasCode: false
  },
  {
    id: "github-3",
    category: "GitHub & Workflow",
    question: "What's the recommended workflow for collaborating on this project?",
    answer: "The recommended workflow is: 1) Create a new branch for each feature or task, 2) Work on your assigned task in your branch, 3) Write tests for your code, 4) Submit a pull request when your feature is complete, 5) Have at least one team member review the code, 6) Merge to main after approval. This approach helps prevent conflicts and ensures code quality through peer review. It also makes it easier to track who did what and to revert changes if necessary.",
    hasCode: false
  },
  {
    id: "github-4",
    category: "GitHub & Workflow",
    question: "Our team created a GitHub organization for the project, but some team members are having trouble accessing it. What should we do?",
    answer: "Make sure that: 1) All team members have been invited to the organization with appropriate permissions, 2) Everyone has accepted their invitation (check email), 3) The repository visibility is set to private, not public, 4) Team members have the right roles (at least Write access). If you're still having issues, you can try adding members directly to the repository instead of through teams, check if there are any organization settings restricting access, or contact GitHub support if the problem persists. Remember to document your GitHub repository URL in your submission so we can access it for grading.",
    hasCode: false
  },
  {
    id: "style-1",
    category: "Code Style & Documentation",
    question: "Are there any restrictions on the length of our code?",
    answer: "Yes, there are line length restrictions. Your code should follow PEP 8 guidelines, which recommend a maximum line length of 79 characters. However, for this project, we're allowing up to 127 characters per line. If you're using flake8 for linting, you can configure it with `--max-line-length=127` to match our grading environment.",
    hasCode: true,
    codeSnippet: "flake8 --max-line-length=127"
  },
  {
    id: "style-2",
    category: "Code Style & Documentation",
    question: "We're getting a 'function too complex' linting error for our implementation. Is this a problem?",
    answer: "While it's generally good practice to keep functions simple and maintainable, you won't be penalized specifically for complexity metrics in this assignment as long as your code works correctly and meets all requirements. If you're concerned about the complexity, consider breaking down complex logic into helper functions, using clearer variable names, and adding comments to explain complex sections. But don't worry too much about linting warnings about complexity as long as your code is correct and readable.",
    hasCode: false
  },
  {
    id: "style-3",
    category: "Code Style & Documentation",
    question: "For Part 3, what writing style should we use for our documentation?",
    answer: "Your documentation should be clear, concise, and professional. Use a formal technical writing style that would be appropriate for software documentation. Include clear explanations of your implementation choices, any assumptions you made, how you handled edge cases, and brief examples where helpful. Avoid overly casual language, but also don't make it unnecessarily complex. The goal is clarity and completeness.",
    hasCode: false
  },
  {
    id: "style-4",
    category: "Code Style & Documentation",
    question: "There seems to be a slight discrepancy between the project instructions and the rubric. Which should we prioritize?",
    answer: "When there's a discrepancy, follow the most recent instructions provided. If you're unsure, it's always best to ask for clarification. For specific cases: if the rubric mentions something not in the instructions, include it; if the instructions are more detailed than the rubric, follow the instructions; if there's a direct contradiction, follow the instructions and note the discrepancy in your submission. The key is to ensure you meet all requirements from both sources where possible.",
    hasCode: false
  }
];