import React, { useEffect, useState } from "react";
import { Row, Col, Alert, Spinner, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ComponentCard from "../../../components/ComponentCard";

const ViewJob = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const jobDataFromState = location.state;

  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        let data = jobDataFromState;
        if (!data) {
          const jobId = window.location.pathname.split("/").pop();
          const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/jobs/${jobId}`);
          data = res.data;
        }

        // Ensure all sections exist with both descriptions
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

        setJob(data);
      } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.message || "Failed to fetch job data.");
        setVariant("danger");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobDataFromState]);

  if (loading) return <Spinner animation="border" className="m-4" />;

  if (!job)
    return <Alert variant={variant}>{message || "Job not found."}</Alert>;

  const Field = ({ label, value, isHtml }) => (
    <div className="mb-3">
      <strong>{label}:</strong>{" "}
      {isHtml ? (
        <div className="text-muted" dangerouslySetInnerHTML={{ __html: value || "N/A" }} />
      ) : (
        <span className="text-muted">{value || "N/A"}</span>
      )}
    </div>
  );

  const RenderSection = ({ title, section }) => (
    <ComponentCard title={title} className="mb-3">
      <Row>
        <Col md={12}>
          <Field label="Title" value={section?.title} />
          <Field label="Plain Description" value={section?.description} />
          <Field label="Rich Description" value={section?.richDescription} isHtml />
        </Col>
      </Row>
    </ComponentCard>
  );

  return (
    <div className="pt-4">
      <ComponentCard title="Job Details" className="mb-4">
        {/* Basic Job Details */}
        <Row>
          <Col md={4}><Field label="Job Title " value={job.postName} /></Col>
          <Col md={4}><Field label="Short Description" value={job.shotDescription} /></Col>
          <Col md={4}><Field label="Organization / Department" value={job.organization} /></Col>
      
        </Row>

        <Row>
              <Col md={4}><Field label="Advt. Number / Reference ID" value={job.advtNumber} /></Col>
          <Col md={4}><Field label="Job Type" value={job.jobType} /></Col>
          <Col md={4}><Field label="Job Category" value={job.jobCategory} /></Col>
         
        </Row>

        <Row>
           <Col md={4}><Field label="Job Location" value={job.jobLocation} /></Col>
          <Col md={4}><Field label="Application Start Date" value={job.applicationStartDate?.split("T")[0]} /></Col>
          <Col md={4}><Field label="Last Date to Apply" value={job.lastDateToApply?.split("T")[0]} /></Col>
        </Row>

        {/* Important Dates */}
        {job.importantDates?.length > 0 && (
          <ComponentCard title="Important Dates" className="mb-3">
            {job.importantDates.map((item, idx) => (
              <Row key={idx}>
                <Col md={6}><Field label="Title" value={item.title} /></Col>
                <Col md={6}><Field label="Date" value={item.date} /></Col>
              </Row>
            ))}
          </ComponentCard>
        )}

        {/* Sections with Plain + Rich Text */}
        {[
          { key: "applicationFee", label: "Application Fee" },
          { key: "vacancyDetails", label: "Vacancy Details" },
          { key: "eligibilityCriteria", label: "Eligibility Criteria" },
          { key: "salaryBenefits", label: "Salary & Benefits" },
          { key: "selectionProcess", label: "Selection Process" },
          { key: "importantLinks", label: "Important Links" },
          { key: "howToApply", label: "How to Apply" },
        ].map(
          (section) =>
            job[section.key] && (
              <RenderSection
                key={section.key}
                title={section.label}
                section={job[section.key]}
              />
            )
        )}

        {/* Meta Details */}
        {job.metaDetails && (
          <ComponentCard title="Meta Details" className="mb-3">
            <Row>
              <Col md={3}><Field label="Title" value={job.metaDetails.title} /></Col>
              <Col md={3}><Field label="Keywords" value={job.metaDetails.keywords} /></Col>
              <Col md={3}><Field label="Description" value={job.metaDetails.description} isHtml /></Col>
              <Col md={3}><Field label="Schemas" value={job.metaDetails.schemas} /></Col>
            </Row>
          </ComponentCard>
        )}

        {/* Go Back Button */}
        <div className="text-start mt-4">
          <Button variant="secondary" onClick={() => navigate("/admin/jobs")}>
            Go Back
          </Button>
        </div>
      </ComponentCard>
    </div>
  );
};

export default ViewJob;
