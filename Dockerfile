FROM apache/airflow:2.10.0

# Switch to the airflow user so pip doesn't complain about being root
USER airflow

# Install your project dependencies
RUN pip install --no-cache-dir \
    xmltodict \
    requests \
    pendulum \
    supabase \
    python-dotenv