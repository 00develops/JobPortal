import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import ComponentCard from "../../../components/ComponentCard";

const categoryOptions = [
  { value: "UR", label: "UR" },
  { value: "OBC", label: "OBC" },
  { value: "SC", label: "SC" },
  { value: "ST", label: "ST" },
  { value: "EWS", label: "EWS" },
];

const selectionOptions = [
  { value: "Tier-I", label: "Tier-I" },
  { value: "Tier-II", label: "Tier-II" },
  { value: "Interview", label: "Interview" },
  { value: "DV", label: "DV" },
  { value: "Medical", label: "Medical" },
];

const EditJob = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const jobData = location.state;

  const [form, setForm] = useState({
    sector: "",
    department: "",
    postName: "",
    totalVacancies: "",
    ageMin: "",
    ageMax: "",
    referenceDate: "",
    relaxations: "",
    qualification: "",
    finalYearEligible: false,
    experienceRequired: false,
    genderRestriction: "None",
    categoryReservation: [],
    jobLocation: "",
    selectionProcess: [],
  });

  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");

  useEffect(() => {
    if (jobData) {
      setForm({
        sector: jobData.sector || "",
        department: jobData.department || "",
        postName: jobData.postName || "",
        totalVacancies: jobData.totalVacancies || "",
        ageMin: jobData.ageLimit?.min || "",
        ageMax: jobData.ageLimit?.max || "",
        referenceDate: jobData.ageLimit?.referenceDate
          ? new Date(jobData.ageLimit.referenceDate).toISOString().slice(0, 10)
          : "",
        relaxations: jobData.ageLimit?.relaxations || "",
        qualification: jobData.qualification || "",
        finalYearEligible: jobData.finalYearEligible || false,
        experienceRequired: jobData.experienceRequired || false,
        genderRestriction: jobData.genderRestriction || "None",
        categoryReservation: jobData.categoryReservation?.map((v) => ({ value: v, label: v })) || [],
        jobLocation: jobData.jobLocation || "",
        selectionProcess: jobData.selectionProcess?.map((v) => ({ value: v, label: v })) || [],
      });
    }
  }, [jobData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSelectChange = (selected, name) => {
    setForm((prev) => ({ ...prev, [name]: selected || [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      ageLimit: {
        min: Number(form.ageMin),
        max: Number(form.ageMax),
        referenceDate: form.referenceDate ? new Date(form.referenceDate).toISOString() : null,
        relaxations: form.relaxations,
      },
      categoryReservation: form.categoryReservation.map((opt) => opt.value),
      selectionProcess: form.selectionProcess.map((opt) => opt.value),
    };

    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/jobs/${jobData._id}`, payload);
      setMessage("Job updated successfully!");
      setVariant("success");
      setTimeout(() => navigate("/admin/jobs"), 1000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to update job.");
      setVariant("danger");
    }
  };

  return (
    <div  className="pt-4">
      <ComponentCard  title="Edit Job">
        {message && <Alert variant={variant}>{message}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Sector *</Form.Label>
                <Form.Control type="text" name="sector" value={form.sector} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Department *</Form.Label>
                <Form.Control type="text" name="department" value={form.department} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Post Name *</Form.Label>
                <Form.Control type="text" name="postName" value={form.postName} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          {/* Row 2 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Total Vacancies *</Form.Label>
                <Form.Control type="number" name="totalVacancies" value={form.totalVacancies} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Min Age *</Form.Label>
                <Form.Control type="number" name="ageMin" value={form.ageMin} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Max Age *</Form.Label>
                <Form.Control type="number" name="ageMax" value={form.ageMax} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          {/* Row 3 */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Reference Date *</Form.Label>
                <Form.Control type="date" name="referenceDate" value={form.referenceDate} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Relaxations</Form.Label>
                <Form.Control type="text" name="relaxations" value={form.relaxations} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Qualification *</Form.Label>
                <Form.Control type="text" name="qualification" value={form.qualification} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          {/* Row 4: Checkboxes, Gender, Job Location */}
          <Row className="mb-3">
            <Col md={4} className="d-flex flex-column justify-content-center">
              <Form.Check type="checkbox" label="Final Year Eligible" name="finalYearEligible" checked={form.finalYearEligible} onChange={handleChange} className="mb-2" />
              <Form.Check type="checkbox" label="Experience Required" name="experienceRequired" checked={form.experienceRequired} onChange={handleChange} />
            </Col>
            <Col md={4} className="d-flex flex-column justify-content-center">
              <Form.Label className="mb-1">Gender Restriction</Form.Label>
              <Form.Select name="genderRestriction" value={form.genderRestriction} onChange={handleChange}>
                <option value="None">None</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Female">Other</option>
                  <option value="Female">All</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Job Location *</Form.Label>
                <Form.Control type="text" name="jobLocation" value={form.jobLocation} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          {/* Row 5: Category & Selection Process */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Category Reservation</Form.Label>
              <Select isMulti options={categoryOptions} value={form.categoryReservation} onChange={(selected) => handleSelectChange(selected, "categoryReservation")} placeholder="Select categories..." />
            </Col>
            <Col md={6}>
              <Form.Label>Selection Process</Form.Label>
              <Select isMulti options={selectionOptions} value={form.selectionProcess} onChange={(selected) => handleSelectChange(selected, "selectionProcess")} placeholder="Select selection process..." />
            </Col>
          </Row>
          <Button type="submit">Update Job</Button>
        </Form>
      </ComponentCard>
    </div>
  );
};

export default EditJob;
