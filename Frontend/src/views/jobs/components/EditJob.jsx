import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";

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
        categoryReservation: jobData.categoryReservation?.map((v) => ({
          value: v,
          label: v,
        })) || [],
        jobLocation: jobData.jobLocation || "",
        selectionProcess: jobData.selectionProcess?.map((v) => ({
          value: v,
          label: v,
        })) || [],
      });
    }
  }, [jobData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (selected, name) => {
    setForm((prev) => ({
      ...prev,
      [name]: selected || [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      ageLimit: {
        min: Number(form.ageMin),
        max: Number(form.ageMax),
        referenceDate: form.referenceDate
          ? new Date(form.referenceDate).toISOString()
          : null,
        relaxations: form.relaxations,
      },
      categoryReservation: form.categoryReservation.map((opt) => opt.value),
      selectionProcess: form.selectionProcess.map((opt) => opt.value),
    };

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/jobs/${jobData._id}`,
        payload
      );
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
    <Container fluid className="p-4">
      {message && <Alert variant={variant}>{message}</Alert>}
      <h3>Edit Job</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Sector *</Form.Label>
          <Form.Control
            type="text"
            name="sector"
            value={form.sector}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Department *</Form.Label>
          <Form.Control
            type="text"
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Post Name *</Form.Label>
          <Form.Control
            type="text"
            name="postName"
            value={form.postName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Total Vacancies *</Form.Label>
          <Form.Control
            type="number"
            name="totalVacancies"
            value={form.totalVacancies}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Min Age *</Form.Label>
          <Form.Control
            type="number"
            name="ageMin"
            value={form.ageMin}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Max Age *</Form.Label>
          <Form.Control
            type="number"
            name="ageMax"
            value={form.ageMax}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Reference Date *</Form.Label>
          <Form.Control
            type="date"
            name="referenceDate"
            value={form.referenceDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Relaxations</Form.Label>
          <Form.Control
            type="text"
            name="relaxations"
            value={form.relaxations}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Qualification *</Form.Label>
          <Form.Control
            type="text"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Final Year Eligible"
            name="finalYearEligible"
            checked={form.finalYearEligible}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Experience Required"
            name="experienceRequired"
            checked={form.experienceRequired}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Gender Restriction</Form.Label>
          <Form.Select
            name="genderRestriction"
            value={form.genderRestriction}
            onChange={handleChange}
          >
            <option value="None">None</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category Reservation</Form.Label>
          <Select
            isMulti
            options={categoryOptions}
            value={form.categoryReservation}
            onChange={(selected) => handleSelectChange(selected, "categoryReservation")}
            placeholder="Select categories..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Job Location *</Form.Label>
          <Form.Control
            type="text"
            name="jobLocation"
            value={form.jobLocation}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Selection Process</Form.Label>
          <Select
            isMulti
            options={selectionOptions}
            value={form.selectionProcess}
            onChange={(selected) => handleSelectChange(selected, "selectionProcess")}
            placeholder="Select selection process..."
          />
        </Form.Group>

        <Button type="submit">Update Job</Button>
      </Form>
    </Container>
  );
};

export default EditJob;
