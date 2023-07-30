# React Multi-Step Form with Formik, Material UI, and Pokemon API

This GitHub repository contains a multi-step form built using React, Formik, and Material UI. The form allows users to input data across multiple steps and utilizes the Pokemon API to search for Pokemon based on their types and names. Additionally, the form data is stored in the browser's local storage, allowing users to resume their progress even if they close or refresh the page.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Local Storage](#local-storage)
- [Pokemon API Integration](#pokemon-api-integration)
- [Contributing](#contributing)
- [License](#license)

## Demo

Before diving into the details, check out the live demo of the multi-step form [here](http://johnsongnow.github.io/nascent-take-home).

## Features

- Multi-step form with an intuitive user interface.
- Utilizes Formik for form management and validation.
- Styling done using Material UI components for a polished look.
- Integration with the Pokemon API to search for Pokemon by types and names.
- Local storage support to save form data and resume progress.

## Getting Started

### Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (at least version 12)
- npm or yarn (npm is installed along with Node.js)

### Installation

1. Clone this repository to your local machine using:

   ```bash
   git clone https://github.com/johnsongnow/nascent-take-home.git
   ```

2. Navigate to the project directory:

   ```bash
   cd nascent-take-home
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

## Usage

To start the development server and view the multi-step form, run the following command:

```bash
npm start
```

The development server will be accessible at `http://localhost:3000`, and the multi-step form can be accessed through the browser.

## Local Storage

The form data is automatically saved to the browser's local storage after each step. If the user navigates away from the page or refreshes it, their progress will be saved. When the user revisits the form, their data will be pre-filled, allowing them to continue from where they left off.

There is a button available that resets the local storage. Note that this does **NOT** clear the form.

## Pokemon API Integration

The form has an integrated feature that allows users to search for Pokemon based on their types and names. This is achieved by making API requests to the Pokemon API (https://pokeapi.co/) and displaying the results in real-time.

You can use the checkboxes to the right to filter by all types that are currently checked, and search inside the dropdown to a specified pokemon.

## Contributing

Contributions are welcome! If you find any issues or want to add new features, please submit a pull request. Before making significant changes, it's best to open an issue to discuss the proposed changes.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

Thank you for checking out our React multi-step form with Formik, Material UI, and Pokemon API integration. If you have any questions or feedback, feel free to contact us or open an issue in the repository. Happy coding!
