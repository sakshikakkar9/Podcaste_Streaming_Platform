from airflow.decorators import dag, task
import pendulum
import requests
import xmltodict
from supabase import create_client, Client
import os

# Your Supabase Credentials
SUPABASE_URL = "https://cskaqlhejxmtzyizhbbw.supabase.co"
# Using the Publishable/Anon key as requested
SUPABASE_KEY = "sb_publishable_a3N683WX496TWnPHKGQS3w_QSQN9W7a"

@dag(
    dag_id='podcast_summary',
    schedule='@daily',
    start_date=pendulum.datetime(2026, 3, 28),
    catchup=False
)
def podcast_summary():

    @task()
    def get_episodes():
        response = requests.get("https://feeds.publicradio.org/public_feeds/marketplace")
        feed = xmltodict.parse(response.text)
        return feed["rss"]["channel"]["item"]

    @task()
    def load_episodes(episodes):
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        success_count = 0
        for episode in episodes:
            # RSS pubDate format needs to be converted for Supabase timestamptz
            raw_date = episode.get('pubDate')
            try:
                # Parsing the string into a valid ISO 8601 timestamp
                formatted_date = pendulum.parse(raw_date, strict=False).to_iso8601_string()
            except Exception:
                formatted_date = pendulum.now().to_iso8601_string()

            data = {
                "title": episode.get('title'),
                "description": episode.get('description'),
                "audio_url": episode.get('enclosure', {}).get('@url'),
                "published_at": formatted_date
            }
            
            try:
                # Using upsert with on_conflict ensures you don't get 
                # "Duplicate" errors if the task runs twice.
                supabase.table("episodes").upsert(data, on_conflict="title").execute()
                success_count += 1
            except Exception as e:
                # This will show up in your Airflow logs if the insert fails
                print(f"Error syncing {data['title']}: {e}")
        
        print(f"Successfully Synced {success_count} episodes to Supabase!")

    @task()
    def download_episodes(episodes):
        download_path = "/opt/airflow/downloads"
        if not os.path.exists(download_path):
            os.makedirs(download_path, exist_ok=True)

        for episode in episodes[:5]:
            audio_url = episode.get('enclosure', {}).get('@url')
            if not audio_url:
                continue
                
            # Extract filename safely from the link
            file_name = f"{episode.get('link', 'audio').split('/')[-1]}.mp3"
            full_path = os.path.join(download_path, file_name)
            
            if not os.path.exists(full_path):
                print(f"Downloading: {file_name}")
                audio_data = requests.get(audio_url)
                with open(full_path, "wb") as f:
                    f.write(audio_data.content)

    # DAG Flow
    api_data = get_episodes()
    load_episodes(api_data)
    download_episodes(api_data)

podcast_summary()