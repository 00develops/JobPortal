import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Form, Button, Row, Col, Card, Table, Alert } from "react-bootstrap";
import axios from "axios";
import SnowEditor from "@/components/SnowEditor";
import { useNavigate } from "react-router-dom";
import ComponentCard from "@/components/ComponentCard";

export default function AddJob() {
  const navigate = useNavigate();

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
    dates: [
      { label: "Application Start Date", date: "" },
      { label: "Application End Date", date: "" },
    ],
    fees: [
      { category: "General / UR", fee: 0 },
      { category: "OBC", fee: 0 },
      { category: "EWS", fee: 0 },
      { category: "SC", fee: 0 },
      { category: "ST", fee: 0 },
      { category: "PwD", fee: 0 },
      { category: "Female", fee: 0 },
    ],
    vacancies: [
      { postName: "", total: 0, UR: 0, EWS: 0, OBC: 0, SC: 0, ST: 0, PwBD: 0 },
    ],
    eligibility: { qualification: "Graduate", ageMin: 0, ageMax: 0, extraRequirements: "" },
    salary: { payScale: "", inHand: 0, allowances: "" },
    selection: ["Shortlisting / Written Test", "Document Verification", "Medical / DV"],
    links: [{ type: "Apply Online", label: "Apply Online", url: "" }],
    howToApply: "",
  };

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });

  const { fields: dateFields, append: appendDate, remove: removeDate } = useFieldArray({ control, name: "dates" });
  const { fields: feeFields, append: appendFee, remove: removeFee } = useFieldArray({ control, name: "fees" });
  const { fields: vacancyFields, append: appendVacancy, remove: removeVacancy } = useFieldArray({ control, name: "vacancies" });
  const { fields: selectionFields, append: appendSelection, remove: removeSelection } = useFieldArray({ control, name: "selection" });
  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({ control, name: "links" });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [message, setMessage] = useState({ text: "", variant: "" });

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

      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/jobs`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      reset();
      setUploadedFiles([]);
      setLogoFile(null);
      setMessage({ text: "Job saved successfully!", variant: "success" });
      setTimeout(() => navigate("/admin/jobs"), 1000);
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
      setMessage({ text: "Error saving job. Check console for details.", variant: "danger" });
    }
  };

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
                  {["title", "keywords", "description", "schemas"].map((field) => (
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
                {[
                  { name: "jobTitle", label: "Post Name" },
                  { name: "organization", label: "Organization" },
                  { name: "advtNumber", label: "Advt No." },
                ].map((field) => (
                  <Col md={4} key={field.name}>
                    <Form.Group className="mb-2">
                      <Form.Label>{field.label} <span className="text-danger">*</span></Form.Label>
                      <Form.Control {...register(`basic.${field.name}`, { required: `${field.label} is required` })} />
                      {errors.basic?.[field.name] && <Form.Text className="text-danger">{errors.basic[field.name].message}</Form.Text>}
                    </Form.Group>
                  </Col>
                ))}
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
                  <tr>
                    <th>Label</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
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
                  <tr>
                    <th>Category</th>
                    <th>Fee</th>
                    <th></th>
                  </tr>
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

          {/* Vacancies */}
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
                      <td>
                        <Form.Control {...register(`vacancies.${idx}.postName`, { required: "Post Name is required" })} />
                        {errors.vacancies?.[idx]?.postName && <Form.Text className="text-danger">{errors.vacancies[idx].postName.message}</Form.Text>}
                      </td>
                      <td>
                        <Form.Control type="number" {...register(`vacancies.${idx}.total`, { required: "Total is required", valueAsNumber: true, min: { value: 0, message: "Value must be >= 0" } })} />
                        {errors.vacancies?.[idx]?.total && <Form.Text className="text-danger">{errors.vacancies[idx].total.message}</Form.Text>}
                      </td>
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
                    <Form.Label>Qualification <span className="text-danger">*</span></Form.Label>
                    <Form.Select {...register("eligibility.qualification", { required: "Qualification is required" })}>
                      <option>10th</option>
                      <option>12th</option>
                      <option>Graduate</option>
                    </Form.Select>
                    {errors.eligibility?.qualification && <Form.Text className="text-danger">{errors.eligibility.qualification.message}</Form.Text>}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Age Min <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="number" {...register("eligibility.ageMin", { required: "Minimum age is required", valueAsNumber: true, min: 0 })} />
                    {errors.eligibility?.ageMin && <Form.Text className="text-danger">{errors.eligibility.ageMin.message}</Form.Text>}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Age Max <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="number" {...register("eligibility.ageMax", { required: "Maximum age is required", valueAsNumber: true, min: 0 })} />
                    {errors.eligibility?.ageMax && <Form.Text className="text-danger">{errors.eligibility.ageMax.message}</Form.Text>}
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-2">
                <Form.Label>Extra Requirements</Form.Label>
                <Controller
                  control={control}
                  name="eligibility.extraRequirements"
                  render={({ field }) => <SnowEditor value={field.value} onChange={field.onChange} />}
                />
              </Form.Group>
            </Card.Body>
          </ComponentCard>

          {/* Salary */}
          <ComponentCard className="mb-3" title="Salary" isCollapsible defaultOpen>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Pay Scale <span className="text-danger">*</span></Form.Label>
                    <Form.Control {...register("salary.payScale", { required: "Pay Scale is required" })} />
                    {errors.salary?.payScale && <Form.Text className="text-danger">{errors.salary.payScale.message}</Form.Text>}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>In-hand <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="number" {...register("salary.inHand", { required: "In-hand salary is required", valueAsNumber: true, min: 0 })} />
                    {errors.salary?.inHand && <Form.Text className="text-danger">{errors.salary.inHand.message}</Form.Text>}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Allowances <span className="text-danger">*</span></Form.Label>
                    <Form.Control {...register("salary.allowances", { required: "Allowances are required" })} />
                    {errors.salary?.allowances && <Form.Text className="text-danger">{errors.salary.allowances.message}</Form.Text>}
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </ComponentCard>

          {/* Selection Process */}
          <ComponentCard className="mb-3" title="Selection Process" isCollapsible defaultOpen>
            <Card.Body>
              {selectionFields.map((s, idx) => (
                <Row key={idx} className="mb-2">
                  <Col md={10}>
                    <Form.Control {...register(`selection.${idx}`, { required: "Selection step is required" })} />
                    {errors.selection?.[idx] && <Form.Text className="text-danger">{errors.selection[idx].message}</Form.Text>}
                  </Col>
                  <Col md={2}>
                    <Button size="sm" variant="danger" onClick={() => removeSelection(idx)}>Remove</Button>
                  </Col>
                </Row>
              ))}
              <Button size="sm" onClick={() => appendSelection("")}>+ Add Step</Button>
            </Card.Body>
          </ComponentCard>

          {/* Links */}
          <ComponentCard className="mb-3" title="Links" isCollapsible defaultOpen>
            <Card.Body>
              {linkFields.map((l, idx) => (
                <Row key={l.id} className="mb-2">
                  <Col md={3}>
                    <Form.Control {...register(`links.${idx}.type`, { required: "Type is required" })} placeholder="Type" />
                    {errors.links?.[idx]?.type && <Form.Text className="text-danger">{errors.links[idx].type.message}</Form.Text>}
                  </Col>
                  <Col md={3}>
                    <Form.Control {...register(`links.${idx}.label`, { required: "Label is required" })} placeholder="Label" />
                    {errors.links?.[idx]?.label && <Form.Text className="text-danger">{errors.links[idx].label.message}</Form.Text>}
                  </Col>
                  <Col md={4}>
                    <Form.Control {...register(`links.${idx}.url`, { required: "URL is required" })} placeholder="URL" />
                    {errors.links?.[idx]?.url && <Form.Text className="text-danger">{errors.links[idx].url.message}</Form.Text>}
                  </Col>
                  <Col md={2}>
                    <Button size="sm" variant="danger" onClick={() => removeLink(idx)}>Remove</Button>
                  </Col>
                </Row>
              ))}
              <Button size="sm" onClick={() => appendLink({ type: "", label: "", url: "" })}>+ Add Link</Button>
            </Card.Body>
          </ComponentCard>

          {/* How To Apply */}
          <ComponentCard className="mb-3" title="How To Apply" isCollapsible defaultOpen>
            <Card.Body>
              <Controller
                control={control}
                name="howToApply"
                rules={{ required: "How to apply is required" }}
                render={({ field }) => <SnowEditor value={field.value} onChange={field.onChange} />}
              />
              {errors.howToApply && <Form.Text className="text-danger">{errors.howToApply.message}</Form.Text>}
            </Card.Body>
          </ComponentCard>

          {/* Files */}
          <ComponentCard className="mb-3" title="Upload Files / Logo" isCollapsible defaultOpen>
            <Card.Body>
              <Form.Group className="mb-2">
                <Form.Label>Job Logo</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={onLogoPicked} />
                {logoFile && <div className="mt-1">{logoFile.name} <Button size="sm" variant="danger" onClick={removeLogo}>Remove</Button></div>}
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Other Files</Form.Label>
                <Form.Control type="file" multiple onChange={onFilesPicked} />
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="mt-1">{file.name} <Button size="sm" variant="danger" onClick={() => removeUploadedFile(idx)}>Remove</Button></div>
                ))}
              </Form.Group>
            </Card.Body>
          </ComponentCard>

          <div className="text-end">
            <Button type="submit">Save Job</Button>
          </div>
        </Form>
      </Card.Body>
    </div>
  );
}
