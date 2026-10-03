from typing import Any, Dict, Optional
from app.db.models.study import ImagingStudy
from app.schemas.study import ViewerInfo


class ViewerService:
    """
    Viewer Service abstraction.
    Currently provides mock DICOM metadata/URLs.
    Prepared to be swapped with MedDream / PACS tokenized session URLs in production.
    """

    @staticmethod
    def get_viewer_session(study: ImagingStudy, user_id: int) -> ViewerInfo:
        # Future MedDream integration logic goes here:
        # meddream_token = generate_meddream_token(study.accession_number, user_id)
        # return ViewerInfo(type="MEDDREAM", url=f"https://pacs.smg.sg/meddream?token={meddream_token}")

        return ViewerInfo(
            type="MOCK",
            url=None
        )
