
# AI POWERED CHATBOT APPLICATION

This is a full-stack chatbot application built using React with TypeScript for the frontend and Python with FastAPI for the backend. The application leverages the OpenAI GPT-3.5 Turbo model to generate responses, Redis for caching, and PostgreSQL as the database. Unit tests are implemented using Pytest. All dependencies are installed and managed inside a virtual environment.

# How it Looks

![Alt text](/chatBot.png)

## Table of Contents

- Features
- Flow Diagram
- Figma Design
- How The Frontend Works
- How The Backend Works
- Edge Cases
- Installation
   - Using Docker (Recommended)
   - Without Docker
- Backend Setup
  - Python Virtual Environment
  - Database Setup
  - Environment Variables
  - Redis Setup
  - Running the Backend
  - Backend Unit Tests
- Frontend Setup
  - Installing Node.js and React
  - Running the Frontend
- Folder Structure
- API Endpoints

## Features

- **Frontend**: Developed using React with TypeScript, providing a dynamic chat interface.
- **Backend**: Built with FastAPI for handling API requests.
- **Database**: PostgreSQL is used for storing chat messages.
- **Caching**: Redis is used to cache responses to improve performance.
- **Unit Testing**: Pytest is used for creating unit tests to ensure application reliability.

## FLOW DIAGRAM

![Alt text](/flowchart.jpg)

## Figma Design

[https://www.figma.com/design/7z8gsNZ2Johqv5DoeEy3dB/AI-Chat-Bot?m=auto&t=tX2RRINdFV2a7OSs-6](https://www.figma.com/design/7z8gsNZ2Johqv5DoeEy3dB/AI-Chat-Bot?m=auto&t=tX2RRINdFV2a7OSs-6)

## How The Frontend Works

- **User Interaction**: The user interacts with the chat interface by typing a message or clicking on a predefined option.

- **Sending Messages**: When a user sends a message, the handleSendMessage function is triggered. This function posts the message content to the backend via an API call using Axios.

- **Receiving and Displaying Responses**: The backend processes the message, generates a response (either from the AI or from the cache), and sends it back to the frontend. The frontend then displays this response as a new chat bubble. The frontend also simulates a typing indicator to enhance the user experience.

- **Message Persistence**: The messages are stored in the local storage so that even if the user refreshes the page, the chat history remains intact. However, this history is cleared every 5 minutes to prevent the local storage from growing too large.

## How The Backend Works

- **API Endpoints**: The backend exposes several RESTful API endpoints, such as /messages/ for sending and receiving messages, and /messages/{id} for updating and deleting specific messages.

- **Processing Requests**: When the frontend sends a message, the backend first checks Redis to see if a response to this query is already cached. If so, it retrieves the cached response. If not, it processes the message, generates a response (using an AI model or predefined logic), saves it to the database, and caches it in Redis for future requests.

- **Database Operations**: All chat messages are stored in PostgreSQL. When a new message is received, it's saved in the database along with the bot's response. Similarly, when a message is edited or deleted, these changes are reflected in the database.

- **Unit Testing with Pytest**: The backend is equipped with unit tests using Pytest. These tests ensure that each component of the backend, from API endpoints to database operations, works as expected.

## Edge Cases

[https://docs.google.com/document/d/1ncqfzEOKYPt6hLeQN05GBfNyP6gtQF0gJvSJLe67ys4/edit?usp=sharing](https://docs.google.com/document/d/1ncqfzEOKYPt6hLeQN05GBfNyP6gtQF0gJvSJLe67ys4/edit?usp=sharing)

## Installation

### Using Docker (Recommended)
I recommend using Docker as it simplifies the setup headaches. Also it'll automatically runs the Unit Tests for Backend.

   1. Install Docker

      ```
      Download Docker Desktop from the official website.
      ```
   2. Clone the Repository:
      ```
      git clone https://github.com/SaiSriramKurapati/chatBot.git
      cd chatBot
      ```
   3. Build and run the Dockker containers:
      ```
      docker-compose up --build
      ```
   4. Access the application
      - The frontend application will be running at http://localhost:3000.
      - The backend API will be running at http://localhost:8000.

### Without Docker

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Python 3.8+
- Node.js (with npm or yarn)
- PostgreSQL
- Redis

### Respository Setup

``` 
git clone https://github.com/SaiSriramKurapati/chatBot.git
cd chatBot
```

### Backend Setup

1. Create and activate a virtual environment

   ``` 
    python3 -m venv env
    source env/bin/activate
   ```
2. Install the dependencies:
   ```
   pip install -r requirements.txt
   ```

#### Database Setup

1. Install PostgreSQL (if not already installed).
2. Create a database:

   ```
   CREATE DATABASE chat_db;
   ```
3. Update the database configuration:

Modify config.yml in the backend directory:
   ```
   database:
    main: "postgresql://<username>:<password>@localhost/chat_db"
    test: "postgresql://<username>:<password>@localhost/test_db"
 ```
Replace <username> and <password> with your PostgreSQL credentials.

#### Environment Variables

1. Setup Environment Variables

   Create a .env file in the root directory with the following content:
   ```
   POSTGRES_USER=<Db User Name>
   POSTGRES_PASSWORD=<Db Password>
   POSTGRES_DB=<DB Name>
   POSTGRES_HOST=<DB Host>

   REDIS_URL=<redis://redis:6379>
   OPENAI_API_KEY=<your-openai-api-secret-key>

   # Test database
   TEST_POSTGRES_DB=<Test DB Name>
   TEST_POSTGRES_HOST=<Test DB Host>
   ```
   Replace DB configuration, and your-openai-api-secret-key with your actual values.

#### Redis Setup

```
brew install redis
```

#### Running the Backend

```
uvicorn app.main:app --reload
```
The backend API should now be running on http://127.0.0.1:8000.

#### Backend Unit Tests 

```
pytest
```

### Frontend Setup

#### Installing Node.js

1. Install Node.js and npm:
    
    ```
    brew install node
    ```
2. Navigate to the frontend directory:

    ```
    cd ../frontend
    ```
3. Install the dependencies

   ```
   npm install
   ```

#### Run Frontend

```
npm start
```
The frontend should now be running on http://localhost:3000.

## Folder Structure

```
chat-widget/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── tests/
│   │   └── ...
│   ├── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBox.tsx
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── ChatOptions.tsx
│   │   │   ├── FooterForm.tsx
│   │   │   └── ...
│   │   ├── App.tsx
│   │   └── ...
│   ├── package.json
│   └── ...
└── README.md
```
## API ENDPOINTS

- POST /messages/ - Send a message to the bot and receive a response.
- PUT /messages/{id} - Update an existing message.
- DELETE /messages/{id} - Delete a message and all subsequent messages.
- GET /messages/ - Retrieve all messages (for receiving cached response).
