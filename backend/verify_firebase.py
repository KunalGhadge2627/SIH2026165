import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
import uuid

def verify_firebase():
    load_dotenv()
    cred_path = os.environ.get("FIREBASE_CREDENTIALS")
    project_id = os.environ.get("FIREBASE_PROJECT_ID")
    
    print("FIREBASE_CREDENTIALS:", cred_path)
    print("FIREBASE_PROJECT_ID:", project_id)
    
    if not cred_path or not os.path.exists(cred_path):
        print(f"FAILED: Credentials file {cred_path} not found.")
        return False
        
    print("Initializing Firebase...")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    
    print("Connecting to Firestore...")
    db = firestore.client()
    
    test_id = f"test-{uuid.uuid4().hex}"
    test_ref = db.collection("_connection_tests").document(test_id)
    
    print(f"Writing test document: {test_id}")
    test_ref.set({"status": "connected", "test_id": test_id})
    
    print("Reading test document...")
    doc = test_ref.get()
    if doc.exists:
        print("Read successful:", doc.to_dict())
    else:
        print("FAILED: Document not found after write.")
        return False
        
    print("Cleaning up test document...")
    test_ref.delete()
    
    print("SUCCESS: Firebase connection verified.")
    return True

if __name__ == "__main__":
    verify_firebase()
