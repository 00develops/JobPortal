import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
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
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");

  const { register, handleSubmit, setValue, control, watch } = useForm({
    defaultValues: {
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
    },
  });

  // Fetch job data by ID
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/jobs/${id}`);
        const job = res.data;

        // Populate form fields
        Object.keys(job).forEach((key) => {
          if (key === "categoryReservation" || key === "selectionProcess") {
            // convert arrays to Select format
            setValue(
              key,
              job[key]?.map((v) => ({ value: v, label: v })) || []
            );
          } else if (key === "ageLimit") {
            setValue("ageMin", job.ageLimit?.min || "");
            setValue("ageMax", job.ageLimit?.max || "");
            setValue("referenceDate", job.ageLimit?.referenceDate || "");
            setValue("relaxations", job.ageLimit?.relaxations || "");
          } else {
            setValue(key, job[key]);
          }
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch job data.");
        setVariant("danger");
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        ageLimit: {
          min: Number(data.ageMin),
          max: Number(data.ageMax),
          referenceDate: data.referenceDate,
          relaxations: data.relaxations,
        },
        categoryReservation: data.categoryReservation.map((opt) => opt.value),
        selectionProcess: data.selectionProcess.map((opt) => opt.value),
      };

      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/jobs/${id}`, payload);
      setMessage("Job updated successfully!");
      setVariant("success");

      setTimeout(() => navigate("/admin/jobs"), 1000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to update job.");
      setVariant("danger");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Container fluid className="p-4">
      {message && <Alert variant={variant}>{message}</Alert>}
      <h3>Edit Job</h3>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Sector *</Form.Label>
          <Form.Control type="text" {...register("sector")} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Department *</Form.Label>
          <Form.Control type="text" {...register("department")} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Post Name *</Form.Label>
          <Form.Control type="text" {...register("postName")} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Total Vacancies *</Form.Label>
          <Form.Control type="number" {...register("totalVacancies")} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Min Age *</Form.Label>
          <Form.Control type="number" {...register("ageMin")} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Max Age *</Form.Label>
          <Form.Control type="number" {...register("ageMax")} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Reference Date *</Form.Label>
          <Form.Control type="date" {...register("referenceDate")} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Relaxations</Form.Label>
          <Form.Control type="text" {...register("relaxations")} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Qualification *</Form.Label>
          <Form.Control type="text" {...register("qualification")} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check type="checkbox" label="Final Year Eligible" {...register("finalYearEligible")} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check type="checkbox" label="Experience Required" {...register("experienceRequired")} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Gender Restriction</Form.Label>
          <Form.Select {...register("genderRestriction")}>
            <option value="None">None</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category Reservation</Form.Label>
          <Controller
            control={control}
            name="categoryReservation"
            render={({ field }) => (
              <Select
                {...field}
                options={categoryOptions}

                placeholder="Select categories..."
              />
            )}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Job Location *</Form.Label>
          <Form.Control type="text" {...register("jobLocation")} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Selection Process</Form.Label>
          <Controller
            control={control}
            name="selectionProcess"
            render={({ field }) => (
              <Select
                {...field}
                options={selectionOptions}
               
                placeholder="Select selection process..."
              />
            )}
          />
        </Form.Group>

        <Button type="submit">Update Job</Button>
      </Form>
    </Container>
  );
};

export default EditJob;
