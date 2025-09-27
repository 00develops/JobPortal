import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table, Alert, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import SnowEditor from "@/components/SnowEditor";
import ComponentCard from "@/components/ComponentCard";

export default function ViewJob() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", variant: "" });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/jobs/${id}`);
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
        setMessage({ text: "Error loading job data.", variant: "danger" });
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <div className="d-flex justify-content-center mt-5"><Spinner animation="border" /></div>;
  if (!job) return null;

  return (
    <div className="mb-4 pt-4">
      <Card.Body>
        {message.text && (
          <Alert variant={message.variant} dismissible onClose={() => setMessage({ text: "", variant: "" })}>
            {message.text}
          </Alert>
        )}

        {/* Meta Details */}
        <ComponentCard className="mb-3" title="SEO & Meta Info"   defaultOpen={false}>
          <Card.Body>
            <Row>
              <Col md={3}><strong>Title:</strong> {job.metaDetails?.title}</Col>
              <Col md={3}><strong>Description:</strong> {job.metaDetails?.description}</Col>
              <Col md={3}><strong>Keywords:</strong> {job.metaDetails?.keywords}</Col>
              <Col md={3}><strong>Schemas:</strong> {job.metaDetails?.schemas}</Col>
            </Row>
          </Card.Body>
        </ComponentCard>

        {/* Basic Job Details */}
        <ComponentCard className="my-4" title="Basic Job Details" defaultOpen>
          <Card.Body className=" mb-4">
            <Row>
              <Col md={3}><strong>Post Name:</strong> {job.postName}</Col>
              <Col md={3}><strong>Organization:</strong> {job.organization}</Col>
              <Col md={3}><strong>Advertisement No:</strong> {job.advtNumber}</Col>
              <Col md={3}><strong>Job Type:</strong> {job.jobType}</Col>
            </Row>
            <Row>
              <Col md={3}><strong>Sector:</strong> {job.sector}</Col>
              <Col md={3}><strong>Category:</strong> {job.jobCategory}</Col>
              <Col md={3}><strong>Location:</strong> {job.jobLocation}</Col>
              <Col md={3}><strong>Experience:</strong> {job.experience}</Col>
            </Row>
            <Row>
              <Col md={12}><strong>Mode of Exam:</strong> {job.modeOfExam}</Col>
            </Row>
            <Row>
              <Col md={12}><strong>Short Description:</strong> {job.shortDescription}</Col>
            </Row>
          </Card.Body>
        </ComponentCard>

        {/* Important Dates */}
        <ComponentCard className="mb-3" title="Important Dates"   defaultOpen>
          <Card.Body className="mb-3">
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {job.dates?.map((d, idx) => (
                  <tr key={idx}>
                    <td>{d.label}</td>
                    <td>{d.date ? new Date(d.date).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </ComponentCard>

        {/* Application Fee */}
        <ComponentCard className="mb-3" title="Application Fee"   defaultOpen>
          <Card.Body>
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Fee (₹)</th>
                </tr>
              </thead>
              <tbody>
                {job.fees?.map((f, idx) => (
                  <tr key={idx}>
                    <td>{f.category}</td>
                    <td>{f.fee}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </ComponentCard>

        {/* Vacancies */}
        <ComponentCard className="mb-3" title="Vacancies"   defaultOpen>
          <Card.Body>
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Post Name</th><th>Total</th><th>UR</th><th>EWS</th><th>OBC</th><th>SC</th><th>ST</th><th>PwBD</th>
                </tr>
              </thead>
              <tbody>
                {job.vacancies?.map((v, idx) => (
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
        </ComponentCard>

        {/* Eligibility */}
        <ComponentCard className="mb-3" title="Eligibility"   defaultOpen>
          <Card.Body className="mb-3">
            <Row>
              <Col md={3}><strong>Qualification:</strong> {job.eligibility?.qualification}</Col>
              <Col md={1}><strong>Final Year Eligible:</strong> {job.eligibility?.finalYearEligible ? "Yes" : "No"}</Col>
              <Col md={1}><strong>Min Age:</strong> {job.eligibility?.ageMin}</Col>
              <Col md={1}><strong>Max Age:</strong> {job.eligibility?.ageMax}</Col>
              <Col md={2}><strong>Age Relaxation:</strong> {job.eligibility?.ageRelaxation}</Col>
              <Col md={1}><strong>GATE Required:</strong> {job.eligibility?.gateRequired ? "Yes" : "No"}</Col>
              <Col md={3}><strong>GATE Codes:</strong> {job.eligibility?.gateCodes}</Col>
            </Row>
            <Row className="mt-2">
              <Col md={12}><strong>Extra Requirements:</strong>
                <SnowEditor value={job.eligibility?.extraRequirements || ""} readOnly />
              </Col>
            </Row>
          </Card.Body>
        </ComponentCard>

        {/* Salary */}
        <ComponentCard className="mb-3" title="Salary"   defaultOpen>
          <Card.Body className="mb-3">
            <Row>
              <Col md={4}><strong>Pay Scale:</strong> {job.salary?.payScale}</Col>
              <Col md={4}><strong>In Hand:</strong> {job.salary?.inHand}</Col>
              <Col md={4}><strong>Allowances:</strong> {job.salary?.allowances}</Col>
            </Row>
          </Card.Body>
        </ComponentCard>

        {/* Selection Process */}
        <ComponentCard className="mb-3" title="Selection Process"   defaultOpen>
          <Card.Body className="mb-3">
            <ul>
              {job.selection?.map((step, idx) => <li key={idx}>{step}</li>)}
            </ul>
          </Card.Body>
        </ComponentCard>

        {/* Links */}
        <ComponentCard className="mb-3" title="Links"   defaultOpen>
          <Card.Body>
            <ul>
              {job.links?.map((l, idx) => (
                <li key={idx}><strong>{l.type}:</strong> <a href={l.url} target="_blank">{l.label}</a></li>
              ))}
            </ul>
          </Card.Body>
        </ComponentCard>

        {/* How To Apply */}
        <ComponentCard className="mb-3" title="How To Apply"   defaultOpen>
          <Card.Body className="mb-3">
            <SnowEditor value={job.howToApply || ""} readOnly />
          </Card.Body>
        </ComponentCard>

        {/* Files & Logo */}
        <ComponentCard className="mb-3" title="Files & Logo"   defaultOpen>
          <Card.Body className="mb-3">
            <Row>
              <Col md={6}>
                <strong>Files:</strong>
                <ul>
                  {job.files?.map((f, idx) => <li key={idx}>{f}</li>)}
                </ul>
              </Col>
              <Col md={6}>
                <strong>Logo:</strong> {job.logo || "No Logo"}
              </Col>
            </Row>
          </Card.Body>
        </ComponentCard>
      </Card.Body>
    </div>
  );
}
