import os, sys

db_path = r"C:\Users\Prachita Jadhav\SIH2026165\backend\oil_safety.db"
if os.path.exists(db_path):
    os.remove(db_path)
    print(f"[OK] Deleted: {db_path}")
else:
    print(f"[INFO] DB already gone: {db_path}")

print("[OK] Database will be re-seeded with 30 unique reports from sample_reports.csv on next backend startup.")
