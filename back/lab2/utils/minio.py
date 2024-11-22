from minio import Minio
import os

def get_minio_client():
    return Minio(
        "minio:9000",
        access_key="minioadmin",
        secret_key="minioadmin",
        secure=False
    )

def create_bucket_if_not_exists(client, bucket_name):
    if not client.bucket_exists(bucket_name):
        client.make_bucket(bucket_name)

def upload_images_to_minio(client, bucket_name, local_dir):
    create_bucket_if_not_exists(client, bucket_name)

    print("Uploading images to minio")
    print(f"Current working directory: {os.getcwd()}")
    files = os.listdir(local_dir)
    print(f"Files in directory {local_dir}: {files}")
    
    for filename in files:
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            filepath = os.path.join(local_dir, filename)
            
            try:
                client.stat_object(bucket_name, filename)
                print(f"Skipping {filename}, already exists in bucket.")
            except Exception:
                client.fput_object(bucket_name, filename, filepath)
                print(f"Uploaded {filename}")
        else:
            print(f"Skipping {filename}, unsupported format.")

def minio_routine(img_dir: str = "./data/images", bucket_name: str = "images"):
    """
    Uploading images to minio from local directory 
    """
    os.makedirs(img_dir, exist_ok=True)
    
    upload_images_to_minio(get_minio_client(), bucket_name, img_dir)
