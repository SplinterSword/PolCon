# PolCon

PolCon is a web application for researching public contradictions made by political figures. Enter a politician's name, and PolCon asks the backend to search for well-sourced contradictions, validate the sources, and return a structured list with summaries and article links.

The goal is to make political research faster and easier to review, while still keeping the source articles visible so users can verify the information themselves.

## Important Links

- [Live app](https://pol-con.vercel.app/)
- [GitHub repository](https://github.com/SplinterSword/PolCon)

## How It Works

1. The Next.js frontend collects the politician name from the user.
2. The frontend sends a `POST` request to the FastAPI backend at `/getContradictions`.
3. The backend uses an OpenAI-compatible Responses API client with web search to find possible contradictions.
4. The backend formats results with a strict JSON schema and runs a validation pass against the source URLs.
5. The frontend displays verified contradictions, summaries, and source article links.

## Tech Stack

### Frontend

- [Next.js](https://nextjs.org/) 15
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) primitives and shadcn-style UI configuration
- [Lucide React](https://lucide.dev/)
- [Vercel](https://vercel.com/) for the linked frontend deployment

### Backend

- [Python](https://www.python.org/) 3.10
- [FastAPI](https://fastapi.tiangolo.com/)
- [Pydantic](https://docs.pydantic.dev/)
- [OpenAI Python SDK](https://github.com/openai/openai-python) with an OpenAI-compatible base URL
- Docker for containerized backend deployment

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/SplinterSword/PolCon.git
cd PolCon
```

### 2. Start the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Create a backend `.env` file before starting the API:

```env
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=your_model_name
OPENAI_BASE_URL=https://api.openai.com/v1
```

Supported aliases are `AI_API_KEY`, `AI_MODEL_NAME`, and `AI_URL`. Optional tuning variables include `AI_MIN_INTERVAL_SECONDS`, `AI_MAX_RETRIES`, `AI_RETRY_BASE_BACKOFF_SECONDS`, and `AI_RETRY_MAX_BACKOFF_SECONDS`.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Create a frontend `.env.local` file so the browser can reach the backend:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Open [http://localhost:3000](http://localhost:3000) to use the app locally.

## API Reference

### `GET /`

Returns a simple backend health/welcome message.

### `POST /getContradictions`

Request body:

```json
{
  "name": "Politician Name"
}
```

Response shape:

```json
{
  "contradictions": [
    {
      "contradiction_id": 1,
      "topic": "Topic name",
      "statement_1": "Initial statement",
      "statement_2": "Contradicting statement",
      "summary": "Short explanation",
      "articles": ["https://example.com/source-1", "https://example.com/source-2"]
    }
  ]
}
```

FastAPI also exposes local interactive docs at [http://localhost:8000/docs](http://localhost:8000/docs) when the backend is running.

## Docker Backend

From the `backend` directory:

```bash
docker build -t polcon-backend .
docker run --env-file .env -p 8000:8000 polcon-backend
```

When deploying the frontend, set `NEXT_PUBLIC_BACKEND_URL` to the deployed backend URL.

## Contributing

Suggestions and feedback are welcome. Please [open an issue](https://github.com/SplinterSword/PolCon/issues) or [create a pull request](https://github.com/SplinterSword/PolCon/pulls).
