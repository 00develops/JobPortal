import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import SnowEditor from "@/components/SnowEditor";
import ComponentCard from "../../../components/ComponentCard";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [value, setvalue] = useState({
    postName: "",
    organization: "",
    advtNumber: "",
    jobType: "",
    jobCategory: "",
    jobLocation: "",
    payScale: "",
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

  const formatDateForInput = (isoDate) => (isoDate ? isoDate.split("T")[0] : "");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/jobs/${id}`);
        const data = response.data;

        // Ensure all sections exist
        [
          "applicationFee",
          "vacancyDetails",
          "eligibilityCriteria",
          "salaryBenefits",
          "selectionProcess",
          "importantLinks",
          "howToApply",
        ].forEach((key) => {
          if (!data[key]) data[key] = { title: "", description: "", richDescription: "" };
          if (!data[key].description) data[key].description = "";
          if (!data[key].richDescription) data[key].richDescription = "";
        });

        setvalue(data);
      } catch (error) {
        console.error("Error fetching job data:", error);
        setMessage({ text: "Failed to load job data.", variant: "danger" });
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e, section, field, index) => {
    const { value } = e.target;
    if (section === "importantDates") {
      const dates = [...value.importantDates];
      dates[index][field] = value;
      setvalue({ ...value, importantDates: dates });
    } else if (section) {
      setvalue({ ...value, [section]: { ...value[section], [field]: value } });
    } else {
      setvalue({ ...value, [e.target.name]: value });
    }
  };

  const handleRichEditorChange = (content, section) => {
    setvalue({ ...value, [section]: { ...value[section], richDescription: content } });
  };

  const addImportantDate = () => {
    setvalue({ ...value, importantDates: [...value.importantDates, { title: "", date: "" }] });
  };

  const deleteImportantDate = (index) => {
    const dates = [...value.importantDates];
    dates.splice(index, 1);
    setvalue({ ...value, importantDates: dates });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/jobs/${id}`, value);
      setMessage({ text: "Job updated successfully!", variant: "success" });
      setTimeout(() => navigate("/admin/jobs"), 1500);
    } catch (error) {
      console.error("Error updating job:", error);
      setMessage({ text: "Failed to update job.", variant: "danger" });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {message.text && (
        <Alert variant={message.variant} onClose={() => setMessage({ text: "", variant: "" })} dismissible>
          {message.text}
        </Alert>
      )}

      <div className="mt-4 pb-2">
        {/* Basic Job Details */}
        <fieldset>
          <ComponentCard title="Basic Job Details"  className="py-1" isCollapsible defaultOpen={false}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Job Title / Post Name</Form.Label>
                  <Form.Control type="text" name="postName" value={value.postName} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Organization / Department</Form.Label>
                  <Form.Control type="text" name="organization" value={value.organization} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Advt. Number / Reference ID</Form.Label>
                  <Form.Control type="text" name="advtNumber" value={value.advtNumber} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Job Type</Form.Label>
                  <Form.Control type="text" name="jobType" value={value.jobType} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Category of Job</Form.Label>
                  <Form.Control type="text" name="jobCategory" value={value.jobCategory} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Job Location</Form.Label>
                  <Form.Control type="text" name="jobLocation" value={value.jobLocation} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Pay Scale / Salary</Form.Label>
                  <Form.Control type="text" name="payScale" value={value.payScale} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Application Start Date</Form.Label>
                  <Form.Control type="date" name="applicationStartDate" value={formatDateForInput(value.applicationStartDate)} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Last Date to Apply</Form.Label>
                  <Form.Control type="date" name="lastDateToApply" value={formatDateForInput(value.lastDateToApply)} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
          </ComponentCard>
        </fieldset>

        {/* Important Dates */}
        <fieldset>
          <ComponentCard title="Important Dates" isCollapsible   className="py-1" >
          {value.importantDates.map((dateItem, idx) => (
              <Row className="mb-2 align-items-end">
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" value={dateItem.title} onChange={(e) => handleChange(e, "importantDates", "title", idx)} required />
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" value={formatDateForInput(dateItem.date)} onChange={(e) => handleChange(e, "importantDates", "date", idx)} required />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex justify-content-center align-item-left">
                  <Button variant="" className="me-2 btn-icon btn btn-primary sm "  onClick={addImportantDate}>+</Button>
                  {value.importantDates.length > 1 && (
                    <Button className="btn-icon btn btn-primary sm" variant="" onClick={() => deleteImportantDate(idx)}>-</Button>
                  )}
                </Col>
              </Row>
          ))}
          </ComponentCard>
        </fieldset>

        {/* Sections with Text + Rich Text */}
        {[
          { key: "applicationFee", label: "Application Fee" },
          { key: "vacancyDetails", label: "Vacancy Details" },
          { key: "eligibilityCriteria", label: "Eligibility Criteria" },
          { key: "salaryBenefits", label: "Salary & Benefits" },
          { key: "selectionProcess", label: "Selection Process" },
          { key: "importantLinks", label: "Important Links" },
          { key: "howToApply", label: "How to Apply" },
        ].map((section) => (
          <fieldset key={section.key}>
            <ComponentCard title={section.label}  className="py-1"  isCollapsible>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" value={value[section.key].title || ""} onChange={(e) => handleChange(e, section.key, "title")} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Description (Text Input)</Form.Label>
                    <Form.Control type="text" value={value[section.key].description || ""} onChange={(e) => handleChange(e, section.key, "description")} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-2">
                    <Form.Label>Description (Rich Text)</Form.Label>
                    <SnowEditor
                      key={section.key}
                      initialValue={value[section.key].richDescription || ""}
                      onChange={(content) => handleRichEditorChange(content, section.key)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </ComponentCard>
          </fieldset>
        ))}

        {/* Meta Details */}
        <fieldset>
          <ComponentCard title="Meta Details"  className="py-1"  isCollapsible>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" value={value.metaDetails.title || ""} onChange={(e) => handleChange(e, "metaDetails", "title")} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Keywords</Form.Label>
                  <Form.Control type="text" value={value.metaDetails.keywords || ""} onChange={(e) => handleChange(e, "metaDetails", "keywords")} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" value={value.metaDetails.description || ""} onChange={(e) => handleChange(e, "metaDetails", "description")} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-2">
                  <Form.Label>Schemas</Form.Label>
                  <Form.Control as="textarea" rows={4} value={value.metaDetails.schemas || ""} onChange={(e) => handleChange(e, "metaDetails", "schemas")} />
                </Form.Group>
              </Col>
            </Row>
          </ComponentCard>
        </fieldset>

        <Button type="submit" variant="primary" className="text-right">Update Job</Button>
      </div>
    </Form>
  );
};

export default EditJob;
