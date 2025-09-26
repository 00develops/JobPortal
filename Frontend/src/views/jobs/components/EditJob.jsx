import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Form, Button, Row, Col, Card, Table, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import SnowEditor from "@/components/SnowEditor";
import { useNavigate, useParams } from "react-router-dom";
import ComponentCard from "@/components/ComponentCard";

export default function EditJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", variant: "" });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [logoFile, setLogoFile] = useState(null);

  const defaultValues = {
    meta: { title: "", keywords: "", description: "", schemas: "" },
    basic: {
      jobTitle: "",
      organization: "",
      advtNumber: "",
      jobType: "Permanent",
      sector: "Central Govt",
      jobCategory: "General",
      jobLocation: "All India",
      experience: "No/ Freshers",
      modeOfExam: "Online",
    },
    dates: [],
    fees: [],
    vacancies: [],
    eligibility: { qualification: "Graduate", ageMin: 0, ageMax: 0, extraRequirements: "" },
    salary: { payScale: "", inHand: 0, allowances: "" },
    selection: [],
    links: [],
    howToApply: "",
  };

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });

  const { fields: dateFields, append: appendDate, remove: removeDate } = useFieldArray({ control, name: "dates" });
  const { fields: feeFields, append: appendFee, remove: removeFee } = useFieldArray({ control, name: "fees" });
  const { fields: vacancyFields, append: appendVacancy, remove: removeVacancy } = useFieldArray({ control, name: "vacancies" });
  const { fields: selectionFields, append: appendSelection, remove: removeSelection } = useFieldArray({ control, name: "selection" });
  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({ control, name: "links" });

  const fetchJob = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/jobs/${id}`);
      const jobData = res.data;

      reset({
        meta: jobData.meta,
        basic: {
          jobTitle: jobData.postName,
          organization: jobData.organization,
          advtNumber: jobData.advtNumber,
          jobType: jobData.jobType,
          sector: jobData.sector,
          jobCategory: jobData.jobCategory,
          jobLocation: jobData.jobLocation,
          experience: jobData.experience,
          modeOfExam: jobData.modeOfExam,
        },
        dates: jobData.dates || [],
        fees: jobData.fees || [],
        vacancies: jobData.vacancies || [],
        eligibility: jobData.eligibility || defaultValues.eligibility,
        salary: jobData.salary || defaultValues.salary,
        selection: jobData.selection || [],
        links: jobData.links || [],
        howToApply: jobData.howToApply || "",
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching job:", error.response?.data || error.message);
      setMessage({ text: "Error fetching job data.", variant: "danger" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const onFilesPicked = (e) => setUploadedFiles((s) => [...s, ...Array.from(e.target.files)]);
  const removeUploadedFile = (idx) => setUploadedFiles((s) => s.filter((_, i) => i !== idx));
  const onLogoPicked = (e) => e.target.files[0] && setLogoFile(e.target.files[0]);
  const removeLogo = () => setLogoFile(null);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      const jobPayload = {
        advtNumber: data.basic.advtNumber,
        postName: data.basic.jobTitle,
        organization: data.basic.organization,
        jobType: data.basic.jobType,
        sector: data.basic.sector,
        jobCategory: data.basic.jobCategory,
        jobLocation: data.basic.jobLocation,
        experience: data.basic.experience,
        modeOfExam: data.basic.modeOfExam,
        dates: data.dates,
        fees: data.fees,
        vacancies: data.vacancies,
        eligibility: data.eligibility,
        salary: data.salary,
        selection: data.selection,
        links: data.links,
        howToApply: data.howToApply,
        meta: data.meta,
      };

      formData.append("jobData", JSON.stringify(jobPayload));
      uploadedFiles.forEach((file) => formData.append("files", file));
      if (logoFile) formData.append("logo", logoFile);

      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/jobs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ text: "Job updated successfully!", variant: "success" });
      setTimeout(() => navigate("/admin/jobs"), 1000);

    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
      setMessage({ text: "Error updating job. Check console for details.", variant: "danger" });
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;

  return (
    <div className="mb-4 pt-4">
      <Card.Body>
        {message.text && (
          <Alert variant={message.variant} onClose={() => setMessage({ text: "", variant: "" })} dismissible>
            {message.text}
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>

          {/* SEO & Meta Info */}
          <ComponentCard className="mb-3" title="SEO & Meta Info" isCollapsible defaultOpen={false}>
            <Card.Body>
              <Row>
                <Col>
                  {["title", "keywords", "description","schemas"].map((field) => (
                    <Form.Group key={field} className="mb-2">
                      <Form.Label className="fw-bold">
                        {`Meta ${field.charAt(0).toUpperCase() + field.slice(1)}`} <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control {...register(`meta.${field}`, { required: `Meta ${field} is required` })} />
                      {errors.meta?.[field] && <Form.Text className="text-danger">{errors.meta[field].message}</Form.Text>}
                    </Form.Group>
                  ))}
                </Col>
              </Row>
            </Card.Body>
          </ComponentCard>

          {/* Basic Job Details */}
          <ComponentCard className="mb-3" title="Basic Job Details" isCollapsible defaultOpen>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Post Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control {...register("basic.jobTitle", { required: "Post Name is required" })} />
                    {errors.basic?.jobTitle && <Form.Text className="text-danger">{errors.basic.jobTitle.message}</Form.Text>}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Organization <span className="text-danger">*</span></Form.Label>
                    <Form.Control {...register("basic.organization", { required: "Organization is required" })} />
                    {errors.basic?.organization && <Form.Text className="text-danger">{errors.basic.organization.message}</Form.Text>}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Advt No. <span className="text-danger">*</span></Form.Label>
                    <Form.Control {...register("basic.advtNumber", { required: "Advt No. is required" })} />
                    {errors.basic?.advtNumber && <Form.Text className="text-danger">{errors.basic.advtNumber.message}</Form.Text>}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Job Type <span className="text-danger">*</span></Form.Label>
                    <Form.Select {...register("basic.jobType", { required: "Job Type is required" })}>
                      <option>Permanent</option>
                      <option>Contract</option>
                      <option>Apprentice</option>
                    </Form.Select>
                    {errors.basic?.jobType && <Form.Text className="text-danger">{errors.basic.jobType.message}</Form.Text>}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Sector <span className="text-danger">*</span></Form.Label>
                    <Form.Select {...register("basic.sector", { required: "Sector is required" })}>
                      <option>Central Govt</option>
                      <option>State Govt</option>
                      <option>PSU</option>
                    </Form.Select>
                    {errors.basic?.sector && <Form.Text className="text-danger">{errors.basic.sector.message}</Form.Text>}
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </ComponentCard>

          {/* Important Dates */}
          <ComponentCard className="mb-3" title="Important Dates" isCollapsible defaultOpen>
            <Card.Body>
              <Table bordered size="sm">
                <thead>
                  <tr><th>Label</th><th>Date</th><th></th></tr>
                </thead>
                <tbody>
                  {dateFields.map((field, idx) => (
                    <tr key={field.id}>
                      <td>
                        <Form.Control {...register(`dates.${idx}.label`, { required: "Label is required" })} />
                        {errors.dates?.[idx]?.label && <Form.Text className="text-danger">{errors.dates[idx].label.message}</Form.Text>}
                      </td>
                      <td>
                        <Form.Control type="date" {...register(`dates.${idx}.date`, { required: "Date is required" })} />
                        {errors.dates?.[idx]?.date && <Form.Text className="text-danger">{errors.dates[idx].date.message}</Form.Text>}
                      </td>
                      <td><Button size="sm" variant="danger" onClick={() => removeDate(idx)}>Remove</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button size="sm" onClick={() => appendDate({ label: "New Date", date: "" })}>+ Add Date</Button>
            </Card.Body>
          </ComponentCard>

          {/* Application Fee */}
          <ComponentCard className="mb-3" title="Application Fee" isCollapsible defaultOpen>
            <Card.Body>
              <Table bordered size="sm">
                <thead>
                  <tr><th>Category</th><th>Fee</th><th></th></tr>
                </thead>
                <tbody>
                  {feeFields.map((f, idx) => (
                    <tr key={f.id}>
                      <td>
                        <Form.Control {...register(`fees.${idx}.category`, { required: "Category is required" })} />
                        {errors.fees?.[idx]?.category && <Form.Text className="text-danger">{errors.fees[idx].category.message}</Form.Text>}
                      </td>
                      <td>
                        <Form.Control type="number" {...register(`fees.${idx}.fee`, { required: "Fee is required", valueAsNumber: true, min: { value: 0, message: "Fee must be >= 0" } })} />
                        {errors.fees?.[idx]?.fee && <Form.Text className="text-danger">{errors.fees[idx].fee.message}</Form.Text>}
                      </td>
                      <td><Button size="sm" variant="danger" onClick={() => removeFee(idx)}>Remove</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button size="sm" onClick={() => appendFee({ category: "Other", fee: 0 })}>+ Add Category</Button>
            </Card.Body>
          </ComponentCard>

          {/* Vacancy Details */}
          <ComponentCard className="mb-3" title="Vacancy Details" isCollapsible defaultOpen>
            <Card.Body>
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Post</th><th>Total</th><th>UR</th><th>EWS</th><th>OBC</th><th>SC</th><th>ST</th><th>PwBD</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {vacancyFields.map((v, idx) => (
                    <tr key={v.id}>
                      <td><Form.Control {...register(`vacancies.${idx}.postName`, { required: "Post Name is required" })} /></td>
                      <td><Form.Control type="number" {...register(`vacancies.${idx}.total`, { required: "Total is required", valueAsNumber: true, min: { value: 0 } })} /></td>
                      <td><Form.Control type="number" {...register(`vacancies.${idx}.UR`, { valueAsNumber: true, min: 0 })} /></td>
                      <td><Form.Control type="number" {...register(`vacancies.${idx}.EWS`, { valueAsNumber: true, min: 0 })} /></td>
                      <td><Form.Control type="number" {...register(`vacancies.${idx}.OBC`, { valueAsNumber: true, min: 0 })} /></td>
                      <td><Form.Control type="number" {...register(`vacancies.${idx}.SC`, { valueAsNumber: true, min: 0 })} /></td>
                      <td><Form.Control type="number" {...register(`vacancies.${idx}.ST`, { valueAsNumber: true, min: 0 })} /></td>
                      <td><Form.Control type="number" {...register(`vacancies.${idx}.PwBD`, { valueAsNumber: true, min: 0 })} /></td>
                      <td><Button size="sm" variant="danger" onClick={() => removeVacancy(idx)}>Remove</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button size="sm" onClick={() => appendVacancy({ postName: "", total: 0 })}>+ Add Vacancy</Button>
            </Card.Body>
          </ComponentCard>

          {/* Eligibility */}
          <ComponentCard className="mb-3" title="Eligibility Criteria" isCollapsible defaultOpen>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Qualification</Form.Label>
                    <Form.Select {...register("eligibility.qualification")}>
                      <option>10th</option>
                      <option>12th</option>
                      <option>Graduate</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Age Min</Form.Label>
                    <Form.Control type="number" {...register("eligibility.ageMin", { valueAsNumber: true, min: 0 })} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Age Max</Form.Label>
                    <Form.Control type="number" {...register("eligibility.ageMax", { valueAsNumber: true, min: 0 })} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-2">
                <Form.Label>Extra Requirements</Form.Label>
                <Controller control={control} name="eligibility.extraRequirements" render={({ field }) => <SnowEditor value={field.value} onChange={field.onChange} />} />
              </Form.Group>
            </Card.Body>
          </ComponentCard>

          {/* Salary */}
          <ComponentCard className="mb-3" title="Salary" isCollapsible defaultOpen>
            <Card.Body>
              <Row>
                <Col md={4}><Form.Group className="mb-2"><Form.Label>Pay Scale</Form.Label><Form.Control {...register("salary.payScale")} /></Form.Group></Col>
                <Col md={4}><Form.Group className="mb-2"><Form.Label>In-hand</Form.Label><Form.Control type="number" {...register("salary.inHand", { valueAsNumber: true, min: 0 })} /></Form.Group></Col>
                <Col md={4}><Form.Group className="mb-2"><Form.Label>Allowances</Form.Label><Form.Control {...register("salary.allowances")} /></Form.Group></Col>
              </Row>
            </Card.Body>
          </ComponentCard>

          {/* Selection */}
          <ComponentCard className="mb-3" title="Selection Process" isCollapsible defaultOpen>
            <Card.Body>
              <Table bordered size="sm">
                <thead><tr><th>Stage</th><th>Details</th><th></th></tr></thead>
                <tbody>
                  {selectionFields.map((s, idx) => (
                    <tr key={s.id}>
                      <td><Form.Control {...register(`selection.${idx}.stage`)} /></td>
                      <td><Form.Control {...register(`selection.${idx}.details`)} /></td>
                      <td><Button size="sm" variant="danger" onClick={() => removeSelection(idx)}>Remove</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button size="sm" onClick={() => appendSelection({ stage: "", details: "" })}>+ Add Stage</Button>
            </Card.Body>
          </ComponentCard>

          {/* Links */}
          <ComponentCard className="mb-3" title="Important Links" isCollapsible defaultOpen>
            <Card.Body>
              <Table bordered size="sm">
                <thead><tr><th>Label</th><th>URL</th><th></th></tr></thead>
                <tbody>
                  {linkFields.map((l, idx) => (
                    <tr key={l.id}>
                      <td><Form.Control {...register(`links.${idx}.label`)} /></td>
                      <td><Form.Control {...register(`links.${idx}.url`)} /></td>
                      <td><Button size="sm" variant="danger" onClick={() => removeLink(idx)}>Remove</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button size="sm" onClick={() => appendLink({ label: "", url: "" })}>+ Add Link</Button>
            </Card.Body>
          </ComponentCard>

          {/* How to Apply */}
          <ComponentCard className="mb-3" title="How to Apply" isCollapsible defaultOpen>
            <Card.Body>
              <Controller control={control} name="howToApply" render={({ field }) => <SnowEditor value={field.value} onChange={field.onChange} />} />
            </Card.Body>
          </ComponentCard>

          {/* File Uploads */}
          <ComponentCard className="mb-3" title="Upload Files & Logo" isCollapsible defaultOpen>
            <Card.Body>
              <Form.Group className="mb-2">
                <Form.Label>Upload Files</Form.Label>
                <Form.Control type="file" multiple onChange={onFilesPicked} />
              </Form.Group>
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="d-flex justify-content-between align-items-center mb-1">
                  <span>{file.name}</span>
                  <Button size="sm" variant="danger" onClick={() => removeUploadedFile(idx)}>Remove</Button>
                </div>
              ))}

              <Form.Group className="mb-2 mt-3">
                <Form.Label>Logo</Form.Label>
                <Form.Control type="file" onChange={onLogoPicked} />
                {logoFile && <div className="d-flex justify-content-between align-items-center mt-1">
                  <span>{logoFile.name}</span>
                  <Button size="sm" variant="danger" onClick={removeLogo}>Remove</Button>
                </div>}
              </Form.Group>
            </Card.Body>
          </ComponentCard>

          {/* Submit */}
          <div className="text-end">
            <Button type="submit">Update Job</Button>
          </div>
        </Form>
      </Card.Body>
    </div>
  );
}
