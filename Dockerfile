FROM python:3.10-slim

WORKDIR /app

# Copy requirements from backend directory
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend files to the container
COPY backend/ ./backend

# Expose port (Railway will override this with PORT environment variable)
EXPOSE 8000

# Start command pointing to backend/main.py
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
