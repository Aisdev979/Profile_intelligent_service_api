# Genderizer API

## Overview
This project gives you a straightforward way to predict a person's gender just by their name. It takes a name you provide, checks it against a broad dataset, and returns a probabilistic gender prediction. You won't have to manually guess or rely on assumptions; this API provides a quick and data-driven estimate.

## Features
- Predicts gender based on a given name using an external data source.
- Provides a probability score and the sample size used for each prediction.
- Calculates a confidence indicator to help assess the prediction's reliability.
- Includes robust error handling for missing, invalid, or unclassifiable names.
- Offers a lightweight and easy-to-integrate API endpoint.

## Getting Started

### Installation
To get this project up and running on your local machine, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Aisdev979/Genderizer_power_data_api.git
    cd Genderizer_power_data_api
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

### Environment Variables
This project currently doesn't require any specific environment variables for basic operation. All necessary external API configurations are handled internally.

## Usage
Once you've installed the dependencies, you can start the API server:

1.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
    This will start the server on `http://localhost:3000`. You'll see a message in your console indicating the server is running.

2.  **Make API Requests**:
    You can now send `GET` requests to the `/api/classify` endpoint with a `name` query parameter to get gender predictions.
    For example, using `curl`:
    ```bash
    curl "http://localhost:3000/api/classify?name=john"
    ```
    Or visit it directly in your browser:
    `http://localhost:3000/api/classify?name=jane`

## API Documentation

### Base URL
`http://localhost:3000`

### Endpoints

#### GET /api/classify
**Description**: Predicts the gender of a given name. It returns the predicted gender, its probability, the sample size used for the prediction, and a confidence indicator.

**Request**: This endpoint expects a `name` query parameter. There is no request body.
```
GET /api/classify?name=exampleName
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "name": "john",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1000,
    "is_confident": true,
    "processed_at": "2023-10-27T10:00:00.000Z"
  }
}
```

**Errors**:
-   **400 Bad Request**:
    -   `{"status": "error", "error": "Missing or empty name parameter"}`: Occurs when the `name` query parameter is missing or empty.
-   **422 Unprocessable Entity**:
    -   `{"status": "error", "error": "name is not a string"}`: Occurs when the `name` query parameter is provided but is not a string.
    -   `{"status": "error", "error": "No prediction available for the provided name"}`: Occurs when the external API cannot provide a gender prediction for the given name (e.g., name is too rare or unknown).
-   **500 Internal Server Error**:
    -   `{"status": "error", "error": "Internal Server Error"}`: A generic error indicating something went wrong on the server side, often due to an issue with the external API or an unhandled exception.

## Technologies Used

| Technology  | Description                           | Link                                           |
| :---------- | :------------------------------------ | :--------------------------------------------- |
| Node.js     | JavaScript runtime environment        | [Node.js](https://nodejs.org/en/)              |
| Express.js  | Web application framework for Node.js | [Express.js](https://expressjs.com/)           |
| Axios       | Promise-based HTTP client             | [Axios](https://axios-http.com/)               |
| Nodemon     | Tool for monitoring changes (dev)     | [Nodemon](https://nodemon.io/)                 |

## Contributing
We welcome contributions to this project! If you'd like to help, please follow these guidelines:

1.  **Fork the repository**.
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `bugfix/issue-description`.
3.  **Make your changes**.
4.  **Commit your changes** with a clear and descriptive message: `git commit -m "feat: add new feature"`.
5.  **Push to your fork**: `git push origin feature/your-feature-name`.
6.  **Open a Pull Request** to the `main` branch of this repository.

Please ensure your code adheres to the existing style and conventions.

## License
This project is licensed under the ISC License.

## Author Info
-   **LinkedIn**: [Your LinkedIn Profile](https://www.linkedin.com/in/your-username)
-   **X (formerly Twitter)**: [@your_x_handle](https://x.com/your_x_handle)

## Badges
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Axios](https://img.shields.io/badge/Axios-671ddf?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
