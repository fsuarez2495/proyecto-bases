# Use a slim Python base image
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Install system dependencies (PostgreSQL client + build essentials)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libpq-dev gcc curl build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy requirements first (better caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy the entire application
COPY . .

# Remove .env to avoid leaking secrets inside the container
RUN rm -f .env

# Expose FastAPI default port
EXPOSE 8000

# Start FastAPI with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
 