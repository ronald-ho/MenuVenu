# Stage 1: Build Stage
FROM python:3.11.4 as builder

WORKDIR /app

# Copy the requirements file
COPY requirements.txt /app/

# Install dependencies in a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Final Stage
FROM python:3.11.4

WORKDIR /app

# Copy the virtualenv from the builder stage
COPY --from=builder /opt/venv /opt/venv

# Set environment to use the virtualenv
ENV PATH="/opt/venv/bin:$PATH"

# Copy the application code and scripts to the container
COPY . /app
COPY ./wait-for-db.sh /app/wait-for-db.sh

# Ensure the script is executable
RUN chmod +x /app/wait-for-db.sh

# Run the application as a non-root user for better security
RUN useradd -m myuser
USER myuser

# Inform Docker that the container listens on the specified network port at runtime
EXPOSE 5000

# Use an array form of CMD to ensure signals are passed to the Python process
CMD ["python", "app.py"]

# Optional: Add a health check (adjust the command as per your app's health check)
# HEALTHCHECK CMD curl --fail http://localhost:5000/health || exit 1
