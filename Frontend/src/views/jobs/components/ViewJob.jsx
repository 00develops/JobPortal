import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table, Alert, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SnowEditor from "@/components/SnowEditor";

export default function ViewJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState({ text: "", variant: "" });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job:", err);
        setMessage({ text: "Error loading job data", variant: "danger" });
      }
    };
    fetchJob();
  }, [id]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>View Job — Admin Panel</Card.Title>

        {message.text && (
          <Alert variant={message.variant} onClose={() => setMessage({ text: "", variant: "" })} dismissible>
            {message.text}
          </Alert>
        )}

        {/* Meta Info */}
        <Card className="mb-3">
          <Card.Header>SEO & Meta Info</Card.Header>
          <Card.Body>
            <p><strong>Meta Title:</strong> {job.meta?.title}</p>
            <p><strong>Meta Keywords:</strong> {job.meta?.keywords}</p>
            <p><strong>Meta Description:</strong> {job.meta?.description}</p>
          </Card.Body>
        </Card>

        {/* Basic Job Details */}
        <Card className="mb-3">
          <Card.Header>Basic Job Details</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}><p><strong>Post Name:</strong> {job.postName}</p></Col>
              <Col md={6}><p><strong>Organization:</strong> {job.organization}</p></Col>
            </Row>
            <Row>
              <Col md={4}><p><strong>Advt No.:</strong> {job.advtNumber}</p></Col>
              <Col md={4}><p><strong>Job Type:</strong> {job.jobType}</p></Col>
              <Col md={4}><p><strong>Sector:</strong> {job.sector}</p></Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Important Dates */}
        {Array.isArray(job.dates) && job.dates.length > 0 && (
          <Card className="mb-3">
            <Card.Header>Important Dates</Card.Header>
            <Card.Body>
              <Table bordered size="sm">
                <thead><tr><th>Label</th><th>Date</th></tr></thead>
                <tbody>
                  {job.dates.map((d, idx) => (
                    <tr key={idx}>
                      <td>{d.label}</td>
                      <td>{d.date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* Fees */}
        {Array.isArray(job.fees) && job.fees.length > 0 && (
          <Card className="mb-3">
            <Card.Header>Application Fees</Card.Header>
            <Card.Body>
              <Table bordered size="sm">
                <thead><tr><th>Category</th><th>Fee</th></tr></thead>
                <tbody>
                  {job.fees.map((f, idx) => (
                    <tr key={idx}>
                      <td>{f.category}</td>
                      <td>{f.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* Vacancy */}
        {Array.isArray(job.vacancies) && job.vacancies.length > 0 && (
          <Card className="mb-3">
            <Card.Header>Vacancy Details</Card.Header>
            <Card.Body>
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Post</th><th>Total</th><th>UR</th><th>EWS</th><th>OBC</th><th>SC</th><th>ST</th><th>PwBD</th>
                  </tr>
                </thead>
                <tbody>
                  {job.vacancies.map((v, idx) => (
                    <tr key={idx}>
                      <td>{v.postName}</td>
                      <td>{v.total}</td>
                      <td>{v.UR}</td>
                      <td>{v.EWS}</td>
                      <td>{v.OBC}</td>
                      <td>{v.SC}</td>
                      <td>{v.ST}</td>
                      <td>{v.PwBD}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* Eligibility */}
        <Card className="mb-3">
          <Card.Header>Eligibility Criteria</Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}><p><strong>Qualification:</strong> {job.eligibility?.qualification}</p></Col>
              <Col md={4}><p><strong>Age Min:</strong> {job.eligibility?.ageMin}</p></Col>
              <Col md={4}><p><strong>Age Max:</strong> {job.eligibility?.ageMax}</p></Col>
            </Row>
            {job.eligibility?.extraRequirements && (
              <div>
                <strong>Extra Requirements:</strong>
                <SnowEditor value={job.eligibility.extraRequirements} readOnly />
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Salary */}
        <Card className="mb-3">
          <Card.Header>Salary</Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}><p><strong>Pay Scale:</strong> {job.salary?.payScale}</p></Col>
              <Col md={4}><p><strong>In-hand:</strong> {job.salary?.inHand}</p></Col>
              <Col md={4}><p><strong>Allowances:</strong> {job.salary?.allowances}</p></Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Selection */}
        {Array.isArray(job.selection) && job.selection.length > 0 && (
          <Card className="mb-3">
            <Card.Header>Selection Process</Card.Header>
            <Card.Body>
              <ul>
                {job.selection.map((s, idx) => <li key={idx}>{s}</li>)}
              </ul>
            </Card.Body>
          </Card>
        )}

        {/* Links */}
        {Array.isArray(job.links) && job.links.length > 0 && (
          <Card className="mb-3">
            <Card.Header>Important Links</Card.Header>
            <Card.Body>
              <Table bordered size="sm">
                <thead><tr><th>Type</th><th>Label</th><th>URL</th></tr></thead>
                <tbody>
                  {job.links.map((l, idx) => (
                    <tr key={idx}>
                      <td>{l.type}</td>
                      <td>{l.label}</td>
                      <td><a href={l.url} target="_blank" rel="noreferrer">{l.url}</a></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* How to Apply & Attachments */}
        <Card className="mb-3">
          <Card.Header>How to Apply & Attachments</Card.Header>
          <Card.Body>
            {job.howToApply && (
              <div>
                <strong>How to Apply:</strong>
                <SnowEditor value={job.howToApply} readOnly />
              </div>
            )}
            {Array.isArray(job.files) && job.files.length > 0 && (
              <div className="mt-2">
                <strong>Attachments:</strong>
                <ul>
                  {job.files.map((f, idx) => (
                    <li key={idx}>
                      <a href={`${import.meta.env.VITE_BASE_URL}/uploads/${f}`} target="_blank" rel="noreferrer">{f}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {job.logo && (
              <div className="mt-2">
                <strong>Logo:</strong>
                <div>
                  <img src={`${import.meta.env.VITE_BASE_URL}/uploads/${job.logo}`} alt="Logo" style={{ maxHeight: 100 }} />
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        <Button variant="outline-secondary" onClick={() => navigate("/admin/jobs")}>Back to Jobs</Button>
      </Card.Body>
    </Card>
  );
}
