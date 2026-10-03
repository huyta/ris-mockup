def test_patient_dashboard(client, patient_headers):
    res = client.get("/api/v1/patient/dashboard", headers=patient_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["total_studies"] == 8
    assert data["reports_available"] >= 5
    assert data["latest_study_date"] is not None


def test_patient_studies_list(client, patient_headers):
    res = client.get("/api/v1/patient/studies", headers=patient_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 8
    assert len(data["items"]) == 8
    assert data["page"] == 1

    first = data["items"][0]
    assert first["patient_name"] == "John Tan"
    assert first["accession_number"].startswith("ACC-")


def test_patient_studies_filter_modality(client, patient_headers):
    res = client.get("/api/v1/patient/studies?modality=MRI", headers=patient_headers)
    assert res.status_code == 200
    data = res.json()
    assert all(item["modality"] == "MRI" for item in data["items"])


def test_patient_study_detail(client, patient_headers):
    # Study 1 is John Tan's MRI Brain
    res = client.get("/api/v1/patient/studies/1", headers=patient_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == 1
    assert data["modality"] == "MRI"
    assert data["body_part"] == "Brain"
    assert len(data["series"]) >= 1


def test_patient_study_viewer(client, patient_headers):
    res = client.get("/api/v1/patient/studies/1/viewer", headers=patient_headers)
    assert res.status_code == 200
    data = res.json()
    assert "study" in data
    assert "series" in data
    assert "viewer" in data
    assert data["viewer"]["type"] == "MOCK"
    assert len(data["series"]) > 0
    assert len(data["series"][0]["images"]) > 0


def test_patient_study_report(client, patient_headers):
    res = client.get("/api/v1/patient/studies/1/report", headers=patient_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["study_id"] == 1
    assert data["status"] == "FINAL"
    assert "Dr. Michael Lee" in data["reported_by"]
    assert "Circle of Willis" in data["impression"]
