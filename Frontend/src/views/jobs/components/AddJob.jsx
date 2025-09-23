import React, { useState } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Row, Col, FormLabel } from "react-bootstrap";
import Select from 'react-select';

const AddJob = () => {
    const navigate = useNavigate();

    const [jobData, setJobData] = useState({
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked, options } = e.target;

        if (type === "checkbox") {
            setJobData((prev) => ({ ...prev, [name]: checked }));
        } else if (type === "select-multiple") {
            const values = Array.from(options)
                .filter((o) => o.selected)
                .map((o) => o.value);
            setJobData((prev) => ({ ...prev, [name]: values }));
        } else {
            setJobData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                ...jobData,
                ageLimit: {
                    min: Number(jobData.ageMin),
                    max: Number(jobData.ageMax),
                    referenceDate: jobData.referenceDate,
                    relaxations: jobData.relaxations,
                },
            };

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/jobs`, payload);

            setMessage(`Job "${response.data.postName}" added successfully!`);
            setVariant("success");

            // Reset form
            setJobData({
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

            // Redirect to job list after 1 second
            setTimeout(() => navigate("/admin/jobs"), 1000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to add job.");
            setVariant("danger");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container fluid className="p-4">
            {message && <Alert variant={variant}>{message}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Sector *</Form.Label>
                    <Form.Control
                        type="text"
                        name="sector"
                        value={jobData.sector}
                        onChange={handleChange}
                        placeholder="Sector"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Department *</Form.Label>
                    <Form.Control
                        type="text"
                        name="department"
                        value={jobData.department}
                        onChange={handleChange}
                        placeholder="Department"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Post Name *</Form.Label>
                    <Form.Control
                        type="text"
                        name="postName"
                        value={jobData.postName}
                        onChange={handleChange}
                        placeholder="Post Name"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Total Vacancies *</Form.Label>
                    <Form.Control
                        type="number"
                        name="totalVacancies"
                        value={jobData.totalVacancies}
                        onChange={handleChange}
                        placeholder="Total Vacancies"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Min Age *</Form.Label>
                    <Form.Control
                        type="number"
                        name="ageMin"
                        value={jobData.ageMin}
                        onChange={handleChange}
                        placeholder="Min Age"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Max Age *</Form.Label>
                    <Form.Control
                        type="number"
                        name="ageMax"
                        value={jobData.ageMax}
                        onChange={handleChange}
                        placeholder="Max Age"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Reference Date *</Form.Label>
                    <Form.Control
                        type="date"
                        name="referenceDate"
                        value={jobData.referenceDate}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Relaxations</Form.Label>
                    <Form.Control
                        type="text"
                        name="relaxations"
                        value={jobData.relaxations}
                        onChange={handleChange}
                        placeholder="Relaxations"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Qualification *</Form.Label>
                    <Form.Control
                        type="text"
                        name="qualification"
                        value={jobData.qualification}
                        onChange={handleChange}
                        placeholder="Qualification"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Final Year Eligible"
                        name="finalYearEligible"
                        checked={jobData.finalYearEligible}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Experience Required"
                        name="experienceRequired"
                        checked={jobData.experienceRequired}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Gender Restriction</Form.Label>
                    <Form.Select
                        name="genderRestriction"
                        value={jobData.genderRestriction}
                        onChange={handleChange}
                    >
                        <option value="None">None</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </Form.Select>
                </Form.Group>


                <Row className=" align-items-center">

                    <FormLabel>Category Reservation</FormLabel>

                    <Col >
                        <Select
                            name="categoryReservation"

                            options={[
                                { value: "UR", label: "UR" },
                                { value: "OBC", label: "OBC" },
                                { value: "SC", label: "SC" },
                                { value: "ST", label: "ST" },
                                { value: "EWS", label: "EWS" },
                            ]}
                            value={
                                jobData.categoryReservation
                                    ? { value: jobData.categoryReservation, label: jobData.categoryReservation }
                                    : null
                            }
                            onChange={(selectedOption) => {
                                setJobData((prev) => ({
                                    ...prev,
                                    categoryReservation: selectedOption ? selectedOption.value : "",
                                }));
                            }}
                            placeholder="Select category..."
                            isClearable
                        />
                    </Col>
                </Row>



                <Form.Group className="mb-3">
                    <Form.Label>Job Location *</Form.Label>
                    <Form.Control
                        type="text"
                        name="jobLocation"
                        value={jobData.jobLocation}
                        onChange={handleChange}
                        placeholder="Job Location"
                        required
                    />
                </Form.Group>


                <Form.Group className="mb-3">
                    <Form.Label>Selection Process</Form.Label>
                    <Select
                    name="selectionProcess"
                        options={[

                            { value: 'Tier-I', label: 'Tier-I' },
                            { value: 'Tier-II', label: 'Tier-II' },
                            { value: 'Interview', label: 'Interview' },
                            { value: 'DV', label: 'DV' },
                            { value: 'Medical', label: 'Medical' },
                        ]}
                        value={jobData.selectionProcess ? { value: jobData.selectionProcess, label: jobData.selectionProcess } : null}
                        onChange={(selectedOption) => {
                            setJobData(prev => ({ ...prev, selectionProcess: selectedOption ? selectedOption.value : '' }));
                        }}
                        placeholder="Select selection process..."
                    />
                </Form.Group>



                <Button type="submit" disabled={isSubmitting}>
                    Add Job
                </Button>
            </Form>
        </Container>
    );
};

export default AddJob;
