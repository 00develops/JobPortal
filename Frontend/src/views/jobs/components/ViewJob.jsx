import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import ComponentCard from "@/components/ComponentCard";

export default function ViewJob() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState({ text: "", variant: "" });
  

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/jobs/${id}`);
        setJob(res.data);
        
      } catch (err) {
        console.error(err);
        setMessage({ text: "Error fetching job data.", variant: "danger" });
      }
    };
    fetchJob();
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <div className="mb-4 pt-4">
      <Card.Body>
        {message.text && <Alert variant={message.variant}>{message.text}</Alert>}

        {/* Meta Details */}
        <ComponentCard className="mb-3" title="SEO & Meta Info" isCollapsible defaultOpen={false}>
          <Card.Body>
            <Row>
              <Col className="py-2" md={6}><strong>Meta Title:</strong> <br /> {job.metaDetails?.title}</Col>
              <Col className="py-2" md={6}><strong>Meta Description:</strong> <div dangerouslySetInnerHTML={{ __html: job.metaDetails?.description }} /></Col>
              <Col className="py-2" md={6}><strong>Meta Keywords:</strong> <br /> {job.metaDetails?.keywords}</Col>
              <Col className="py-2" md={6}><strong>Meta Schemas:</strong> <div dangerouslySetInnerHTML={{ __html: job.metaDetails?.schemas }} /></Col>
            </Row>
          </Card.Body>
        </ComponentCard>

        {/* Basic Job Details */}
        <ComponentCard className="mb-3" title="Basic Job Details" isCollapsible defaultOpen={false} >
          <Card.Body>
            <Row>
              <Col className="py-2" md={6}><strong>Post Title:</strong> <br /> {job.postName}</Col>
              <Col className="py-2" md={6}><strong>Short Description:</strong> <div dangerouslySetInnerHTML={{ __html: job.shortDescription }} /></Col>
              <Col className="py-2" md={3}><strong>Organization:</strong> <br /> {job.organization}</Col>
              <Col className="py-2" md={3}><strong>Advertisement Number:</strong> <br /> {job.advtNumber}</Col>
              <Col className="py-2" md={3}><strong>Job Type:</strong> <br /> {job.jobType}</Col>
              <Col className="py-2" md={3}><strong>Sector:</strong> <br /> {job.sector}</Col>
            </Row>
          </Card.Body>
        </ComponentCard>

        {/* Important Dates */}
        <ComponentCard className="mb-3" title="Important Dates" isCollapsible defaultOpen={false}>
          <Card.Body>
            <Table bordered size="sm">
              <thead><tr><th>Label</th><th>Date</th></tr></thead>
              <tbody>
                {job.dates?.map((d, idx) => {
                  const localDate = new Date(d.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <tr key={idx}>
                      <td>{d.label}</td>
                      <td>{localDate}</td>
                    </tr>
                  );
                })}
              </tbody>

            </Table>
          </Card.Body>
        </ComponentCard>

        {/* Application Fee */}
        <ComponentCard className="mb-3" title="Application Fee" isCollapsible defaultOpen={false}>
          <Card.Body>
            <Table bordered size="sm">
              <thead><tr><th>Category</th><th>Fee ⟨₹⟩</th></tr></thead>
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
        <ComponentCard className="mb-3" title="Vacancies" isCollapsible defaultOpen={false}>
          <Card.Body>
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Post Name</th>
                  <th>Total</th>
                  <th>UR</th>
                  <th>EWS</th>
                  <th>OBC</th>
                  <th>SC</th>
                  <th>ST</th>
                  <th>PwBD</th>
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
            <div>
              <strong>Extra Requirements:</strong>
              <div className="form-control" dangerouslySetInnerHTML={{ __html: job.vacancies?.[0]?.extraRequirements }} />
            </div>
          </Card.Body>
        </ComponentCard>

        {/* Eligibility */}
        <ComponentCard className="mb-3" title="Eligibility" isCollapsible defaultOpen={false}>
          <Card.Body>
            <Row>
              <Col className="py-2" md={3}><strong>Qualification:</strong> <br /> {job.eligibility?.qualification}</Col>
              <Col className="py-2" md={3}><strong>Final Year Eligible:</strong> <br /> {job.eligibility?.finalYearEligible}</Col>
              <Col className="py-2" md={1}><strong>Min Age:</strong> <br /> {job.eligibility?.ageMin}</Col>
              <Col className="py-2" md={1}><strong>Max Age:</strong> <br /> {job.eligibility?.ageMax}</Col>
              <Col className="py-2" md={2}><strong>Age Relaxation:</strong> <br /> {job.eligibility?.ageRelaxation}</Col>
              <Col className="py-2" md={3}><strong>GATE Required:</strong> <br /> {job.eligibility?.gateRequired}</Col>
              <Col className="py-2" md={3}><strong>GATE Codes:</strong> <br /> {job.eligibility?.gateCodes}</Col>
            </Row>
            <div>
              <strong className="py-2">Extra Requirements:</strong>
              <div className="form-control" dangerouslySetInnerHTML={{ __html: job.eligibility?.extraRequirements }} />
            </div>
          </Card.Body>
        </ComponentCard>

        {/* Salary & Benefits */}
        <ComponentCard className="mb-3" title="Salary & Benefits" isCollapsible defaultOpen={false}>
          <Card.Body>
            <Row>
              <Col md={4}><strong>Pay Scale:</strong> <br /> {job.salary?.payScale}</Col>
              <Col md={4}><strong>In Hand:</strong> <br /> {job.salary?.inHand}</Col>
              <Col md={4}><strong>Allowances:</strong> <br /> {job.salary?.allowances}</Col>
            </Row>
          </Card.Body>
        </ComponentCard>

        {/* Selection Process */}
        <ComponentCard className="mb-3" title="Selection Process" isCollapsible defaultOpen={false}>
          <Card.Body>
            <ul>
              {job.selection?.map((s, idx) => <li key={idx}>{s}</li>)}
            </ul>
          </Card.Body>
        </ComponentCard>

        {/* Important Links */}
        <ComponentCard className="mb-3" title="Important Links" isCollapsible defaultOpen={false}>
          <Card.Body>
            <ul>
              {job.links?.map((l, idx) => (
                <li key={idx}><a href={l.url} target="_blank" rel="noopener noreferrer">{l.label} ({l.type})</a></li>
              ))}
            </ul>
          </Card.Body>
        </ComponentCard>

        {/* How To Apply */}
        <ComponentCard className="mb-3" title="How To Apply" isCollapsible defaultOpen={false}>
          <Card.Body>
            <div className="form-control" dangerouslySetInnerHTML={{ __html: job.howToApply }} />
          </Card.Body>
        </ComponentCard>

        {/* Files / Logo */}
        <ComponentCard className="mb-3" title="Uploaded Files" isCollapsible defaultOpen={false}>
          <Card.Body>
            <strong>Files:</strong>
            <ul className="list-unstyled mt-2 d-flex flex-wrap gap-3">
              {job.files?.map((f, idx) => {
                const fileName = f.split("/").pop();
                const ext = fileName.split(".").pop()?.toLowerCase();

                // Image preview
                if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName)) {
                  return (
                    <li key={idx} className="text-center">
                      <a href={f} target="_blank" rel="noopener noreferrer">
                        <img
                          src={`${import.meta.env.VITE_BASE_URL}/${f}`}

                          style={{ height: "50px", width: "auto", objectFit: "cover", borderRadius: "4px" }}
                          className="mb-1 border"
                        />
                      </a>
                      {/* <div style={{ fontSize: "0.75rem", maxWidth: "auto", wordBreak: "break-word" }}>{fileName}</div> */}
                    </li>
                  );
                }

                // PDF preview (small embed)
                if (ext === "pdf") {
                  return (
                    <li key={idx} className="text-center">
                      <embed
                        src={`${import.meta.env.VITE_BASE_URL}/${f}`}
                        type="application/pdf"
                        width="50"
                        height="50"
                        className="border rounded mb-1"
                      />
                      <div style={{ fontSize: "0.75rem", maxWidth: "60px", wordBreak: "break-word" }}>
                        <a href={f} target="_blank" rel="noopener noreferrer">{fileName}</a>
                      </div>
                    </li>
                  );
                }

                // Video preview
                if (/\.(mp4|webm|ogg)$/i.test(fileName)) {
                  return (
                    <li key={idx} className="text-center">
                      <video
                        src={`${import.meta.env.VITE_BASE_URL}/${f}`}
                        width="80"
                        height="50"
                        controls
                        className="border rounded mb-1"
                      />
                      <div style={{ fontSize: "0.75rem", maxWidth: "80px", wordBreak: "break-word" }}>
                        <img src={`${import.meta.env.VITE_BASE_URL}/${f}`} target="_blank" rel="noopener noreferrer" />
                      </div>
                    </li>
                  );
                }

                // Other files
                return (
                  <li key={idx} className="text-center">
                    <div className="border rounded p-2 mb-1" style={{ width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {ext.toUpperCase()}
                    </div>
                    <div style={{ fontSize: "0.75rem", maxWidth: "60px", wordBreak: "break-word" }}>
                      <a href={f} target="_blank" rel="noopener noreferrer">{fileName}</a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card.Body>
        </ComponentCard>



      </Card.Body >
    </div >
  );
}
