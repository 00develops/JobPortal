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
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/jobs/${jobId}`
          );
          data = res.data;
        }
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

  if (!job) return <Alert variant={variant}>{message || "Job not found."}</Alert>;

  const Field = ({ label, value }) => (
    <div className="mb-3">
      <strong>{label}:</strong>{" "}
      <span className="text-muted">{value || "N/A"}</span>
    </div>
  );

  return (
    <div className="pt-4">
      <ComponentCard title="Job Details">
        <Row>
          <Col md={4}>
            <Field label="Sector" value={job.sector} />
          </Col>
          <Col md={4}>
            <Field label="Department" value={job.department} />
          </Col>
          <Col md={4}>
            <Field label="Post Name" value={job.postName} />
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Field label="Total Vacancies" value={job.totalVacancies} />
          </Col>
          <Col md={4}>
            <Field
              label="Age Limit"
              value={
                job.ageLimit
                  ? `${job.ageLimit.min}–${job.ageLimit.max} (as on ${job.ageLimit.referenceDate})`
                  : "N/A"
              }
            />
          </Col>
          <Col md={4}>
            <Field
              label="Relaxations"
              value={job.ageLimit?.relaxations || "As per govt rules"}
            />
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Field label="Qualification" value={job.qualification} />
          </Col>
          <Col md={4}>
            <Field
              label="Final Year Eligible"
              value={job.finalYearEligible ? "Yes" : "No"}
            />
          </Col>
          <Col md={4}>
            <Field
              label="Experience Required"
              value={job.experienceRequired ? "Yes" : "No"}
            />
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Field label="Gender Restriction" value={job.genderRestriction} />
          </Col>
          <Col md={4}>
            <Field
              label="Category Reservation"
              value={
                job.categoryReservation?.length
                  ? job.categoryReservation.join(", ")
                  : "N/A"
              }
            />
          </Col>
          <Col md={4}>
            <Field label="Job Location" value={job.jobLocation} />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Field
              label="Mode of Selection"
              value={
                job.selectionProcess?.length
                  ? job.selectionProcess.join(" → ")
                  : "N/A"
              }
            />
          </Col>
        </Row>

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
