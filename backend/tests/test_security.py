def test_unauthenticated_requests(client):
    assert client.get("/api/v1/auth/me").status_code == 401
    assert client.get("/api/v1/patient/dashboard").status_code == 401
    assert client.get("/api/v1/doctor/dashboard").status_code == 401


def test_patient_cannot_access_doctor_endpoint(client, patient_headers):
    res = client.get("/api/v1/doctor/dashboard", headers=patient_headers)
    assert res.status_code == 403
    assert "Access restricted to doctor accounts" in res.json()["detail"]


def test_doctor_cannot_access_patient_endpoint(client, doctor_headers):
    res = client.get("/api/v1/patient/dashboard", headers=doctor_headers)
    assert res.status_code == 403
    assert "Access restricted to patient accounts" in res.json()["detail"]


def test_patient_cannot_access_other_patient_study(client, patient_headers):
    # John Tan owns studies 1-8. Studies 9-10 belong to Jane Wong (patient 2).
    res = client.get("/api/v1/patient/studies/9", headers=patient_headers)
    assert res.status_code == 404
    assert "Study not found" in res.json()["detail"]

    # Also viewer and report must return 404
    res_viewer = client.get("/api/v1/patient/studies/9/viewer", headers=patient_headers)
    assert res_viewer.status_code == 404

    res_report = client.get("/api/v1/patient/studies/9/report", headers=patient_headers)
    assert res_report.status_code == 404


def test_doctor_cannot_access_unassigned_study(client, doctor_headers):
    # Study 1 (Brain MRI) is assigned only to Dr. James Wong (D00025).
    # Dr. Sarah Lim (D00021) should NOT be able to access it.
    res = client.get("/api/v1/doctor/studies/1", headers=doctor_headers)
    assert res.status_code == 404
    assert "Study not found" in res.json()["detail"]

    res_viewer = client.get("/api/v1/doctor/studies/1/viewer", headers=doctor_headers)
    assert res_viewer.status_code == 404

    res_report = client.get("/api/v1/doctor/studies/1/report", headers=doctor_headers)
    assert res_report.status_code == 404


def test_doctor_cannot_access_unassigned_patient(client, doctor_headers):
    # Robert Koh (patient 5) has studies assigned ONLY to Dr. James Wong (D00025) and Dr. Emily Tan (D00030).
    # Dr. Sarah Lim (D00021) has zero studies for patient 5.
    res = client.get("/api/v1/doctor/patients/5", headers=doctor_headers)
    assert res.status_code == 404
