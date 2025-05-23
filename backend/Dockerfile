# First stage: build dependencies
FROM python:3.10-alpine AS builder

# System deps needed for compiling packages like numpy, psycopg2 etc.
RUN apk add --no-cache gcc musl-dev libffi-dev

WORKDIR /app
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

# Final stage: minimal runtime image
FROM python:3.10-alpine

WORKDIR /app

# Install runtime deps
RUN apk add --no-cache libffi

# Copy built wheels from builder
COPY --from=builder /wheels /wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels /wheels/*

# Copy source code
COPY . /app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
