# Use a lightweight Python base image
FROM python:3.10-slim
WORKDIR /app

# Install system dependencies required by scikit-learn
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file
COPY requirements.txt .

# Upgrade pip first, then install dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy all the ML scripts and models into the container
COPY . .

# Expose the port Flask will run on
EXPOSE 5000

# Command to run the Flask API
CMD ["python", "app.py"]