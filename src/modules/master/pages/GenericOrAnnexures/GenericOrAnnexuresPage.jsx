import React, { useRef, useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import FileStatusCard from "./components/UploadField";
import { useGenericOrAnnexures } from "./hooks/useGenericOrAnnexures";
import masterApiService from "../../services/masterApiService";
import bulbIcon from "../../../../assets/bulb-icon.png";
import { toast } from "react-toastify";



const GenericOrAnnexuresPage = () => {

  const { items, addItem } = useGenericOrAnnexures();

  const [localItems, setLocalItems] = useState([]);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const genericRef = useRef();
  const annexureRef = useRef();

  const genericDoc = localItems.find(i => i.type === "Generic");
  const annexureDoc = localItems.find(i => i.type === "Annexures");

  const handleUpload = (type, file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    addItem({ type, file });
  };

  const handleView = async (fileUrl) => {
    if (!fileUrl) return;

    try {
      const sasUrl = await masterApiService.getAzureBlobSasUrl(fileUrl);
      if (!sasUrl) return;

      window.open(sasUrl, "_blank");
    } catch (error) {
      console.error("View failed:", error);
    }
  };

  const handleLocalDelete = (type) => {
    setLocalItems(prev => prev.filter(i => i.type !== type));
  };

  return (
    <Container
      className="mt-4"
      style={{
        minHeight: "calc(100vh - 120px)"
      }}
    >
      <Card className="shadow-sm border-0 mb-4">

        <Card.Body>

          <div className="d-flex align-items-start mb-4">
            <img
              src={bulbIcon}
              alt="Info"
              style={{
                width: "22px",
                height: "22px",
                marginRight: "8px",
                marginTop: "2px"
              }}
            />

            <p className="orange_text mb-0">
              Please ensure all uploaded documents are clear and eligible.
              File size should not exceed 2MB per document.
            </p>
          </div>


          <div className="row">

            <FileStatusCard
              label="Generic Document"
              required
              file={
                genericDoc
                  ? {
                    name: genericDoc.fileName,
                    url: genericDoc.fileUrl
                  }
                  : null
              }
              ref={genericRef}
              onBrowse={() => genericRef.current.click()}
              onChange={(e) =>
                handleUpload("Generic", e.target.files[0])
              }
              onView={() =>
                handleView(genericDoc?.fileUrl)
              }
              onDelete={() =>
                handleLocalDelete("Generic")
              }
            />

            <FileStatusCard
              label="Annexures Document"
              required
              file={
                annexureDoc
                  ? {
                    name: annexureDoc.fileName,
                    url: annexureDoc.fileUrl
                  }
                  : null
              }
              ref={annexureRef}
              onBrowse={() => annexureRef.current.click()}
              onChange={(e) =>
                handleUpload("Annexures", e.target.files[0])
              }
              onView={() =>
                handleView(annexureDoc?.fileUrl)
              }
              onDelete={() =>
                handleLocalDelete("Annexures")
              }
            />

          </div>

        </Card.Body>

      </Card>

    </Container>
  );
};

export default GenericOrAnnexuresPage;
