import React, { useEffect, useRef, useState } from "react";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Share2,
  Star,
} from "lucide-react";

import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";


interface DocumentItem {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  status: "Draft" | "In Review" | "Signed";
  shared: boolean;
  starred: boolean;
  deleted: boolean;
  url: string;
}

export const DocumentsPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [signatureHistory, setSignatureHistory] = useState<string[]>([]);
const [isDrawing, setIsDrawing] = useState(false);

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem("document-chamber");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDocument, setSelectedDocument] =
    useState<DocumentItem | null>(null);

  const [activeTab, setActiveTab] = useState<
    "recent" | "shared" | "starred" | "trash"
  >("recent");

  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    localStorage.setItem(
      "document-chamber",
      JSON.stringify(documents)
    );
  }, [documents]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const newDocument: DocumentItem = {
        id: Date.now(),
        name: file.name,
        type: file.type || "Document",
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        lastModified: new Date().toLocaleDateString(),
        status: "Draft",
        shared: false,
        starred: false,
        deleted: false,
        url: reader.result as string,
      };

      setDocuments((prev) => [...prev, newDocument]);
    };

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleDownload = (doc: DocumentItem) => {
    const link = document.createElement("a");
    link.href = doc.url;
    link.download = doc.name;
    link.click();
  };

  const handleShare = (id: number) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? { ...doc, shared: !doc.shared }
          : doc
      )
    );
  };

  const handleStar = (id: number) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? { ...doc, starred: !doc.starred }
          : doc
      )
    );
  };

  const handleDelete = (id: number) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? { ...doc, deleted: true }
          : doc
      )
    );
  };

  const handleStatusChange = (
    id: number,
    status: "Draft" | "In Review" | "Signed"
  ) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? { ...doc, status }
          : doc
      )
    );
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {

  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;


  const snapshot = canvas.toDataURL();

  setSignatureHistory(prev => [
    ...prev,
    snapshot
  ]);


  setIsDrawing(true);

  ctx.beginPath();

  ctx.moveTo(
    e.nativeEvent.offsetX,
    e.nativeEvent.offsetY
  );
};

const draw = (
  e: React.MouseEvent<HTMLCanvasElement>
) => {
  if (!isDrawing) return;

  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";

  ctx.lineTo(
    e.nativeEvent.offsetX,
    e.nativeEvent.offsetY
  );

  ctx.stroke();
};

const stopDrawing = () => {
  setIsDrawing(false);
};
const undoSignature = () => {

  const canvas = canvasRef.current;

  if (!canvas || signatureHistory.length === 0)
    return;


  const ctx = canvas.getContext("2d");

  if (!ctx) return;


  const history = [...signatureHistory];


  history.pop();


  setSignatureHistory(history);


  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  if(history.length > 0){

    const img = new Image();

    img.src = history[history.length - 1];


    img.onload = () => {

      ctx.drawImage(
        img,
        0,
        0
      );

    };

  }

};


const saveSignature = () => {

  if (!selectedDocument) return;

  setDocuments((prev) =>
    prev.map((doc) =>
      doc.id === selectedDocument.id
        ? {
            ...doc,
            status: "Signed",
          }
        : doc
    )
  );

  setSelectedDocument({
    ...selectedDocument,
    status: "Signed",
  });

  alert("Signature Saved Successfully!");
};
  

  const visibleDocuments = documents
    .filter((doc) => {
      if (activeTab === "trash") {
        return doc.deleted;
      }

      if (activeTab === "shared") {
        return doc.shared && !doc.deleted;
      }

      if (activeTab === "starred") {
        return doc.starred && !doc.deleted;
      }

      return !doc.deleted;
    })
    .sort((a, b) => {
      return sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    return (
  <div className="space-y-6 animate-fade-in">

    {/* Header */}
    <div className="flex justify-between items-center">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Documents
        </h1>

        <p className="text-gray-600">
          Manage your startup's important files
        </p>
      </div>

      <>
        <Button
          leftIcon={<Upload size={18} />}
          onClick={handleUploadClick}
        >
          Upload Document
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          hidden
          onChange={handleUpload}
        />
      </>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

      {/* Sidebar */}

      <Card className="lg:col-span-1">

        <CardHeader>
          <h2 className="text-lg font-semibold">
            Quick Access
          </h2>
        </CardHeader>

        <CardBody className="space-y-2">

          <Button
            variant={activeTab === "recent" ? "primary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("recent")}
          >
            Recent Files
          </Button>

          <Button
            variant={activeTab === "shared" ? "primary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("shared")}
          >
            Shared with Me
          </Button>

          <Button
            variant={activeTab === "starred" ? "primary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("starred")}
          >
            Starred
          </Button>

          <Button
            variant={activeTab === "trash" ? "primary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("trash")}
          >
            Trash
          </Button>

        </CardBody>

      </Card>

      {/* Right Side */}

      <div className="lg:col-span-3">

        <Card>

          <CardHeader className="flex justify-between items-center">

            <h2 className="text-lg font-semibold">
              All Documents
            </h2>

            <div className="flex gap-2">

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortAsc(!sortAsc)}
              >
                Sort {sortAsc ? "A-Z" : "Z-A"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setActiveTab(
                    activeTab === "shared"
                      ? "recent"
                      : "shared"
                  )
                }
              >
                Filter
              </Button>

            </div>

          </CardHeader>

          <CardBody>

            {visibleDocuments.length === 0 ? (

              <div className="text-center py-10 text-gray-500">
                No documents found
              </div>

            ) : (

              visibleDocuments.map((doc) => (

                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 border-b"
                >

                  <div className="flex items-center gap-4">

                    <div className="bg-primary-50 p-3 rounded-lg">

                      <FileText
                        size={24}
                        className="text-primary-600"
                      />

                    </div>

                    <div>

                      <h3
                        className="font-medium text-primary-600 cursor-pointer hover:underline"
                        onClick={() =>
                          setSelectedDocument(doc)
                        }
                      >
                        {doc.name}
                      </h3>

                      <div className="flex gap-3 text-sm text-gray-500 mt-1">

                        <span>{doc.type}</span>

                        <span>{doc.size}</span>

                        <span>{doc.lastModified}</span>

                      </div>

                      <div className="flex gap-2 mt-2">

                        {doc.shared && (
                          <Badge
                            variant="secondary"
                            size="sm"
                          >
                            Shared
                          </Badge>
                        )}

                        {doc.starred && (
                          <Badge
                            variant="primary"
                            size="sm"
                          >
                            Starred
                          </Badge>
                        )}

                        <Badge
                          variant="secondary"
                          size="sm"
                        >
                          {doc.status}
                        </Badge>

                      </div>

                    </div>

                  </div>

                  <div className="flex items-center gap-2">

                    <select
                      value={doc.status}
                      onChange={(e) =>
                        handleStatusChange(
                          doc.id,
                          e.target.value as
                            | "Draft"
                            | "In Review"
                            | "Signed"
                        )
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="Draft">
                        Draft
                      </option>

                      <option value="In Review">
                        In Review
                      </option>

                      <option value="Signed">
                        Signed
                      </option>

                    </select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDownload(doc)
                      }
                    >
                      <Download size={18} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleShare(doc.id)
                      }
                    >
                      <Share2 size={18} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleStar(doc.id)
                      }
                    >
                      <Star
                        size={18}
                        fill={
                          doc.starred
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDelete(doc.id)
                      }
                    >
                      <Trash2 size={18} />
                    </Button>

                  </div>

                </div>

              ))

            )}

          </CardBody>

        </Card>

      </div>

    </div>
        {/* Document Preview Form */}

{/* Document Preview Modal */}

{selectedDocument && (

  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">


    <form
      className="
        w-full
        max-w-2xl
        max-h-[90vh]
        overflow-y-auto
        bg-white
        rounded-2xl
        shadow-2xl
        p-6
        space-y-6
      "
    >


      {/* Form Header */}

      <div className="flex justify-between items-center border-b pb-4">

        <div>
          <h2 className="text-xl font-semibold">
            Document Preview
          </h2>

          <p className="text-sm text-gray-500">
            Review document and add signature
          </p>
        </div>


        <Button
          type="button"
          variant="ghost"
          onClick={() => setSelectedDocument(null)}
        >
          ✕
        </Button>


      </div>




      {/* Document Information */}

      <div className="border rounded-xl p-4">

        <h3 className="font-semibold mb-4">
          Document Information
        </h3>


        <div className="grid grid-cols-2 gap-4">


          <div>
            <label className="text-sm text-gray-500">
              File Name
            </label>

            <input
              value={selectedDocument.name}
              readOnly
              className="w-full border rounded p-2"
            />

          </div>



          <div>
            <label className="text-sm text-gray-500">
              File Type
            </label>

            <input
              value={selectedDocument.type}
              readOnly
              className="w-full border rounded p-2"
            />

          </div>



          <div>
            <label className="text-sm text-gray-500">
              File Size
            </label>

            <input
              value={selectedDocument.size}
              readOnly
              className="w-full border rounded p-2"
            />

          </div>



          <div>
            <label className="text-sm text-gray-500">
              Status
            </label>

            <input
              value={selectedDocument.status}
              readOnly
              className="w-full border rounded p-2"
            />

          </div>


        </div>

      </div>





      {/* PDF / Image Preview */}

      <div className="border rounded-xl p-4">


        <h3 className="font-semibold mb-3">
          Document View
        </h3>


        <div className="flex justify-center">


          {selectedDocument.type === "application/pdf" ? (

            <iframe
              src={selectedDocument.url}
              className="w-full h-[350px] border rounded"
            />

          ) : (

            <img
              src={selectedDocument.url}
              className="max-h-[350px] rounded"
            />

          )}


        </div>


      </div>





      {/* Signature */}

      <div className="border rounded-xl p-4">

        <h3 className="font-semibold mb-3">
          E-Signature
        </h3>


        <div className="flex justify-center">

          <canvas
            ref={canvasRef}
            width={400}
            height={180}
            className="border rounded cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />


        </div>


        <div className="flex justify-end gap-3 mt-4">


          <Button
            type="button"
            variant="outline"
            onClick={undoSignature}
          >
            Undo
          </Button>


          <Button
            type="button"
            variant="outline"
            onClick={clearSignature}
          >
            Clear
          </Button>


          <Button
            type="button"
            onClick={saveSignature}
          >
            Save Signature
          </Button>


        </div>


      </div>



    </form>


  </div>

)}
  </div>
);
};