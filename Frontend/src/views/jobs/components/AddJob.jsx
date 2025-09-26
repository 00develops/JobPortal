import { useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SnowEditor from "@/components/SnowEditor";
import ComponentCard from "../../../components/ComponentCard";

const AddJob = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState({
    postName: "",
    organization: "",
    advtNumber: "",
    jobType: "",
    jobCategory: "",
    jobLocation: "",
    shotDescription: "",
    applicationStartDate: "",
    lastDateToApply: "",
    importantDates: [{ title: "", date: "" }],
    applicationFee: { title: "", description: "", richDescription: "" },
    vacancyDetails: { title: "", description: "", richDescription: "" },
    eligibilityCriteria: { title: "", description: "", richDescription: "" },
    salaryBenefits: { title: "", description: "", richDescription: "" },
    selectionProcess: { title: "", description: "", richDescription: "" },
    importantLinks: { title: "", description: "", richDescription: "" },
    howToApply: { title: "", description: "", richDescription: "" },
    metaDetails: { title: "", description: "", keywords: "", schemas: "" },
  });

  const [message, setMessage] = useState({ text: "", variant: "" });

  // ------------------ Plain Text Input ------------------
  const handleChange = (e, section, field, index) => {
    const { name, value: inputValue } = e.target;

    if (section === "importantDates") {
      const dates = [...value.importantDates];
      dates[index][field] = inputValue;
      setValue({ ...value, importantDates: dates });
    } else if (section) {
      setValue({
        ...value,
        [section]: { ...value[section], [field]: inputValue },
      });
    } else {
      setValue({ ...value, [name]: inputValue });
    }
  };

  // ------------------ Rich Text Editor Input ------------------
  const handleRichEditorChange = (content, section) => {
    setValue({
      ...value,
      [section]: { ...value[section], richDescription: content },
    });
  };

  // ------------------ Important Dates ------------------
  const addImportantDate = () => {
    setValue({
      ...value,
      importantDates: [...value.importantDates, { title: "", date: "" }],
    });
  };

  const deleteImportantDate = (index) => {
    const dates = [...value.importantDates];
    dates.splice(index, 1);
    setValue({ ...value, importantDates: dates });
  };

  // ------------------ Submit Handler ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/jobs`,
        value
      );
      setMessage({ text: "Job submitted successfully!", variant: "success" });
      setTimeout(() => navigate("/admin/jobs"), 1500);
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting job:", error);
      setMessage({ text: "Failed to submit job.", variant: "danger" });
    }
  };

  return ( 
    <Form onSubmit={handleSubmit} className="pt-4 pb-2">
      {message.text && (
        <Alert
          variant={message.variant}
          onClose={() => setMessage({ text: "", variant: "" })}
          dismissible
        >
          {message.text}
        </Alert>
      )}

      {/* -------------------- Basic Job Details -------------------- */}
      <ComponentCard title="Basic Job Details" className="py-1" isCollapsible defaultOpen={false}>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Job Title </Form.Label>
              <Form.Control
                type="text"
                name="postName"
                value={value.postName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
           <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Short Description</Form.Label>
              <Form.Control
                type="text"
                name="shotDescription"
                value={value.shotDescription}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Organization / Department</Form.Label>
              <Form.Control
                type="text"
                name="organization"
                value={value.organization}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Advt. Number / Reference ID</Form.Label>
              <Form.Control
                type="text"
                name="advtNumber"
                value={value.advtNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Job Type</Form.Label>
              <Form.Control
                type="text"
                name="jobType"
                value={value.jobType}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Category of Job</Form.Label>
              <Form.Control
                type="text"
                name="jobCategory"
                value={value.jobCategory}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Job Location</Form.Label>
              <Form.Control
                type="text"
                name="jobLocation"
                value={value.jobLocation}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
       
         
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Application Start Date</Form.Label>
              <Form.Control
                type="date"
                name="applicationStartDate"
                value={value.applicationStartDate?.split("T")[0] || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Last Date to Apply</Form.Label>
              <Form.Control
                type="date"
                name="lastDateToApply"
                value={value.lastDateToApply?.split("T")[0] || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
      </ComponentCard>

      {/* -------------------- Important Dates -------------------- */}
      <ComponentCard title="Important Dates" className="py-1" isCollapsible defaultOpen>
        {value.importantDates.map((dateItem, idx) => (
          <Row className="mb-2 align-items-end" key={idx}>
            <Col md={5}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={dateItem.title}
                  onChange={(e) => handleChange(e, "importantDates", "title", idx)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dateItem.date}
                  onChange={(e) => handleChange(e, "importantDates", "date", idx)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={1} className="d-flex justify-content-center align-items-left">
              <Button  className="me-2 btn-icon btn btn-primary sm "  onClick={addImportantDate}>+</Button>
              {value.importantDates.length > 1 && (
                <Button  className="me-2 btn-icon btn btn-light sm "  onClick={() => deleteImportantDate(idx)}>-</Button>
              )}
            </Col>
          </Row>
        ))}
      </ComponentCard>

      {/* -------------------- Sections with Text + Rich Text -------------------- */}
      {[
        { key: "applicationFee", label: "Application Fee" },
        { key: "vacancyDetails", label: "Vacancy Details" },
        { key: "eligibilityCriteria", label: "Eligibility Criteria" },
        { key: "salaryBenefits", label: "Salary & Benefits" },
        { key: "selectionProcess", label: "Selection Process" },
        { key: "importantLinks", label: "Important Links" },
        { key: "howToApply", label: "How to Apply" },
      ].map((section) => (
        <ComponentCard key={section.key} title={section.label} className="py-1" isCollapsible defaultOpen>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={value[section.key].title || ""}
                  onChange={(e) => handleChange(e, section.key, "title")}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>Description (Text Input)</Form.Label>
                <Form.Control
                  type="text"
                  value={value[section.key].description || ""}
                  onChange={(e) => handleChange(e, section.key, "description")}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-2">
                <Form.Label>Description (Rich Text)</Form.Label>
                <SnowEditor
                  value={value[section.key].richDescription || ""}
                  onChange={(content) => handleRichEditorChange(content, section.key)}
                />
              </Form.Group>
            </Col>
          </Row>
        </ComponentCard>
      ))}

      {/* -------------------- Meta Details -------------------- */}
      <ComponentCard title="Meta Details" className="py-1" isCollapsible defaultOpen>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={value.metaDetails.title || ""}
                onChange={(e) => handleChange(e, "metaDetails", "title")}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Keywords</Form.Label>
              <Form.Control
                type="text"
                value={value.metaDetails.keywords || ""}
                onChange={(e) => handleChange(e, "metaDetails", "keywords")}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={value.metaDetails.description || ""}
                onChange={(e) => handleChange(e, "metaDetails", "description")}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-2">
              <Form.Label>Schemas</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={value.metaDetails.schemas || ""}
                onChange={(e) => handleChange(e, "metaDetails", "schemas")}
              />
            </Form.Group>
          </Col>
        </Row>
      </ComponentCard>

      <Button type="submit" variant="primary" className="mt-3">
        Submit Job
      </Button>
    </Form>
  );
};

export default AddJob;
