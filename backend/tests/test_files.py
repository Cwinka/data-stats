import sys, os 
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from config import API_VER, TEST_TOKEN
from main import app
from fastapi.testclient import TestClient
from functools import wraps

client = TestClient(app)

def put_test_data(func):
    @wraps(func)
    def w(*a, **kw):
        with open(f"{BASE_DIR}/data.csv", 'rb') as f:
            client.post(f"/{API_VER}/files/upl/testdata?token={TEST_TOKEN}", files={"data": ("data.csv", f)})
        res = func(*a, **kw)
        client.delete(f"/{API_VER}/files/delete/testdata", json={
            "token": TEST_TOKEN,
            "data_filename": "data.csv"
        })
        return res
    return w


#  Test UPLOADS
def test_upl():
    with open(f"{BASE_DIR}/data.csv", 'rb') as f:
        responce = client.post(f"/{API_VER}/files/upl/data?token={TEST_TOKEN}", files={"data": ("data.csv", f)})
    assert responce.status_code == 201

def test_upl_testdata():
    with open(f"{BASE_DIR}/data.csv", 'rb') as f:
        responce = client.post(f"/{API_VER}/files/upl/testdata?token={TEST_TOKEN}", files={"data": ("data.csv", f)})
    assert responce.status_code == 201