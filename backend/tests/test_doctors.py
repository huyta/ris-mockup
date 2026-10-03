def test_doctor_dashboard(client, doctor_headers):
    res = client.get("/api/v1/doctor/dashboard", headers=doctor_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["assigned_patients"] >= 1
    assert data["reports_available"] >= 1


def test_doctor_patients_list(client, doctor_headers):
    res = client.get("/api/v1/doctor/patients", headers=doctor_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 1
    # Check that patients returned are assigned to Dr. Sarah Lim
    names = [p["full_name"] for p in data["items"]]
    assert "John Tan" in names


def test_doctor_patient_detail(client, doctor_headers):
    # Patient 1 is John Tan, assigned to Dr. Sarah Lim
    res = client.get("/api/v1/doctor/patients/1", headers=doctor_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["patient"]["full_name"] == "John Tan"
    assert data["study_count"] >= 1
    assert len(data["studies"]) == data["study_count"]


def test_doctor_studies_list(client, doctor_headers):
    res = client.get("/api/v1/doctor/studies", headers=doctor_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 1
    # Check that each study has Dr. Sarah Lim (D00021) in assigned_doctor_ids
    for s in data["items"]:
        assert "D00021" in s["assigned_doctor_ids"]


def test_doctor_study_detail(client, doctor_headers):
    # Study 2 (ACC-2026-009740, Left Knee) is assigned to Dr. Sarah Lim
    res = client.get("/api/v1/doctor/studies/2", headers=doctor_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == 2
    assert data["body_part"] == "Left Knee"


def test_doctor_study_viewer(client, doctor_headers):
    res = client.get("/api/v1/doctor/studies/2/viewer", headers=doctor_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["viewer"]["type"] == "MOCK"
    assert len(data["series"]) >= 1


def test_doctor_study_report(client, doctor_headers):
    res = client.get("/api/v1/doctor/studies/2/report", headers=doctor_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["study_id"] == 2
    assert "horizontal cleavage tear" in data["findings"]
