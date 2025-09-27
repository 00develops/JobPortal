import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Form, Button, Row, Col, Card, Table, Alert } from "react-bootstrap";
import axios from "axios";
import SnowEditor from "@/components/SnowEditor";
import { useNavigate } from "react-router-dom";
import ComponentCard from "@/components/ComponentCard";


export default function AddJob() {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [message, setMessage] = useState({ text: "", variant: "" });

  const defaultValues = {
    metaDetails: { title: "", description: "", meta: { keywords: "", schemas: "" } },
    postName: "",
    organization: "",
    advtNumber: "",
    jobType: "Permanent",
    sector: "Central Govt",
    jobCategory: "General",
    jobLocation: "All India",
    experience: "No/ Freshers",
    modeOfExam: "Online",
    shortDescription: "",
    dates: [
      { label: "Application Start Date", date: "" },
      { label: "Application End Date", date: "" },
    ],
    fees: [
      { category: "General / UR", fee: "" },
      { category: "OBC", fee: "" },
      { category: "EWS", fee: "" },
      { category: "SC", fee: "" },
      { category: "ST", fee: "" },
      { category: "PwBD", fee: "" },
      { category: "Female", fee: "" },
    ],
    vacancies: [
      { postName: "", total: 0, UR: 0, EWS: 0, OBC: 0, SC: 0, ST: 0, PwBD: 0 },
    ],
    eligibility: {
      qualification: "Graduate",
      finalYearEligible: "Yes",
      ageMin: 0,
      ageMax: 0,
      ageRelaxation: "",
      gateRequired: "Yes",
      gateCodes: "",
      extraRequirements: "",
    },
    salary: { payScale: "", inHand: "", allowances: "" },
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

  const onFilesPicked = (e) => setUploadedFiles((s) => [...s, ...Array.from(e.target.files)]);
  const removeUploadedFile = (idx) => setUploadedFiles((s) => s.filter((_, i) => i !== idx));
  const onLogoPicked = (e) => e.target.files[0] && setLogoFile(e.target.files[0]);
  const removeLogo = () => setLogoFile(null);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      const jobPayload = {
        postName: data.postName,
        organization: data.organization,
        advtNumber: data.advtNumber,
        jobType: data.jobType,
        sector: data.sector,
        jobCategory: data.jobCategory,
        jobLocation: data.jobLocation,
        experience: data.experience,
        modeOfExam: data.modeOfExam,
        shortDescription: data.shortDescription,

        dates: data.dates,
        fees: data.fees,
        vacancies: data.vacancies,
        eligibility: data.eligibility,
        salary: data.salary,
        selection: data.selection,
        links: data.links,
        howToApply: data.howToApply,

        metaDetails: {
          title: data.metaDetails.title,
          description: data.metaDetails.description,

          keywords: data.metaDetails.keywords,
          schemas: data.metaDetails.schemas,

        },
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

          {/* Meta Details */}
          <ComponentCard className="mb-3" title="SEO & Meta Info" isCollapsible defaultOpen={false}>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label>Meta Title</Form.Label>
                    <Form.Control {...register("metaDetails.title", { required: "Meta Title is required" })} />
                    {errors.metaDetails?.title && <Form.Text className="text-danger">{errors.metaDetails.title.message}</Form.Text>}
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label>Meta Description</Form.Label>
                    <Form.Control {...register("metaDetails.description")} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label>Meta Keywords</Form.Label>
                    <Form.Control {...register("metaDetails.keywords")} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label>Meta Schemas</Form.Label>
                    <Form.Control {...register("metaDetails.schemas")} />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </ComponentCard>

          {/* Basic Job Details */}
          <ComponentCard className="mb-3" title="Basic Job Details" isCollapsible defaultOpen>
            <Card.Body>
              <Row>
                {[
                  { name: "postName", label: "Post Title" },
                  { name: "shortDescription", label: "Post Description" },
                  { name: "organization", label: "Organization" },
                  { name: "advtNumber", label: "Advt No." },
                ].map((field) => (
                  <Col md={4} key={field.name}>
                    <Form.Group className="mb-2">
                      <Form.Label>{field.label} <span className="text-danger">*</span></Form.Label>
                      <Form.Control {...register(field.name, { required: `${field.label} is required` })} />
                      {errors[field.name] && <Form.Text className="text-danger">{errors[field.name].message}</Form.Text>}
                    </Form.Group>
                  </Col>
                ))}
                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label>Job Type</Form.Label>
                    <Form.Select {...register("jobType")}>
                      <option>Permanent</option>
                      <option>Contract</option>
                      <option>Apprentice</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label>Sector</Form.Label>
                    <Form.Select {...register("sector")}>
                      <option>Central Govt</option>
                      <option>State Govt</option>
                      <option>PSU</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

              </Row>
            </Card.Body>
          </ComponentCard>

          {/* Important Dates */}
          <ComponentCard className="mb-3" title="Important Dates" isCollapsible defaultOpen>
            <Card.Body className="overflow-auto">
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Label</th>
                    <th>Date</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dateFields.map((field, idx) => (
                    <tr key={field.id} >
                      <td>
                        <Form.Control className="border-0 shadow-none" type="text" {...register(`dates.${idx}.label`, { required: "Label is required" })} />
                        {errors.dates?.[idx]?.label && <Form.Text className="text-danger">{errors.dates[idx].label.message}</Form.Text>}
                      </td>
                      <td>
                        <Form.Control className="border-0 shadow-none" type="date" {...register(`dates.${idx}.date`, { required: "Date is required" })} />
                        {errors.dates?.[idx]?.date && <Form.Text className="text-danger">{errors.dates[idx].date.message}</Form.Text>}
                      </td>
                      <td><Button className="p-1   btn-light w-100" variant="danger" onClick={() => removeDate(idx)}>Remove</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="border-top border-dashed mt-4 text-end">
                <Button className="mt-3 me-2 sm" onClick={() => appendDate({ label: "New Date", date: "" })}>+ Add Date</Button>
              </div>
            </Card.Body>
          </ComponentCard>

          {/* Application Fee */}
          <ComponentCard className="mb-3" title="Application Fee" isCollapsible defaultOpen>
            <Card.Body className="overflow-auto">
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Fee ⟨₹⟩</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {feeFields.map((f, idx) => (
                    <tr key={f.id}>
                      <td>
                        <Form.Control className="border-0  shadow-none" type="text" {...register(`fees.${idx}.category`, { required: "Category is required" })} />
                        {errors.fees?.[idx]?.category && <Form.Text className="text-danger">{errors.fees[idx].category.message}</Form.Text>}
                      </td>
                      <td>
                        <Form.Control className="border-0 shadow-none" type="number" {...register(`fees.${idx}.fee`, { required: "Fee is required" })} />
                        {errors.fees?.[idx]?.fee && <Form.Text className="text-danger">{errors.fees[idx].fee.message}</Form.Text>}
                      </td>
                      <td><Button className="p-1   btn-light w-100 w-100" variant="danger" onClick={() => removeFee(idx)}>Remove</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="border-top border-dashed mt-4 text-end">
                <Button className="mt-3 me-2  sm" onClick={() => appendFee({ category: "", fee: "" })}>+ Add Fee</Button>
              </div>
            </Card.Body>
          </ComponentCard>

          {/* Vacancies */}
          <ComponentCard className="mb-3" title="Vacancies" isCollapsible defaultOpen>
            <Card.Body  className="overflow-auto">
              <Table bordered size="sm" >
                <thead>
                  <tr>
                    <th>Post Name</th><th>Total</th><th>UR</th><th>EWS</th><th>OBC</th><th>SC</th><th>ST</th><th>PwBD</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vacancyFields.map((v, idx) => (
                    <tr key={v.id}>
                      {["postName", "total", "UR", "EWS", "OBC", "SC", "ST", "PwBD"].map((field) => (
                        <td key={field} >
                          <Form.Control className="border-0 shadow-none p-1" {...register(`vacancies.${idx}.${field}`, { required: true })} type={field === "postName" ? "text" : "number"} />
                        </td>
                      ))}
                      <td><Button className="p-1 btn-light" variant="danger" onClick={() => removeVacancy(idx)}>Remove</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="border-top border-dashed mt-4 text-end">
                <Button className="mt-3 sm" onClick={() => appendVacancy({ postName: "", total: 0, UR: 0, EWS: 0, OBC: 0, SC: 0, ST: 0, PwBD: 0 })}>+ Add Vacancy</Button>
              </div>
            </Card.Body>
          </ComponentCard>

          {/* Eligibility */}
          <ComponentCard className="mb-3" title="Eligibility" isCollapsible defaultOpen>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label>Qualification</Form.Label>
                    <Form.Control {...register("eligibility.qualification")} />
                  </Form.Group>
                </Col>
                <Col md-md={3} lg={1}>
                  <Form.Group className="mb-2">

                    <Form.Label>Final Year Eligible</Form.Label>
                    <Form.Select {...register("eligibility.finalYearEligible")}>
                      <option>Yes</option>
                      <option>No</option>
                    </Form.Select>


                  </Form.Group>

                </Col>
                <Col md={1}>
                  <Form.Group className="mb-2">
                    <Form.Label>Min Age</Form.Label>
                    <Form.Control type="number" {...register("eligibility.ageMin")} />
                  </Form.Group>
                </Col>
                <Col md={1}>
                  <Form.Group className="mb-2">
                    <Form.Label>Max Age</Form.Label>
                    <Form.Control type="number" {...register("eligibility.ageMax")} />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2 align-start">
                    <Form.Label>Age Relaxation</Form.Label>
                    <Form.Control {...register("eligibility.ageRelaxation")} />
                  </Form.Group>
                </Col>
                <Col md-md={3} lg={1} >

                  <Form.Group className="mb-2">

                    <Form.Label>GATE Required</Form.Label>

                    <Form.Select {...register("eligibility.gateRequired")}>
                      <option>Yes</option>
                      <option>No</option>
                    </Form.Select>


                  </Form.Group>

                </Col>
                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label>GATE Codes</Form.Label>
                    <Form.Control {...register("eligibility.gateCodes")} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-2">
                <Form.Label>Extra Requirements</Form.Label>
                <Controller
                  control={control}
                  name="eligibility.extraRequirements"
                  render={({ field }) => <SnowEditor {...field} />}
                />
              </Form.Group>
            </Card.Body>
          </ComponentCard>

          {/* Salary */}
          <ComponentCard className="mb-3" title="Salary & Benefits" isCollapsible defaultOpen>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Pay Scale</Form.Label>
                    <Form.Control {...register("salary.payScale")} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>In Hand</Form.Label>
                    <Form.Control type="number" {...register("salary.inHand")} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label>Allowances</Form.Label>
                    <Form.Control {...register("salary.allowances")} />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </ComponentCard>

          {/* Selection Process */}
          <ComponentCard className="mb-3" title="Selection Process" isCollapsible defaultOpen>
            <Card.Body>
              {selectionFields.map((s, idx) => (
                <Row key={s.id} className="mb-2">
                  <Col md={11}><Form.Control {...register(`selection.${idx}`)} /></Col>
                  <Col md={1}><Button className="p-1  btn-light w-100" variant="danger" onClick={() => removeSelection(idx)}>Remove</Button></Col>
                </Row>
              ))}
              <div className="border-top border-dashed mt-4 text-end">
                <Button className="mt-3 me-2 sm" onClick={() => appendSelection("")}>+ Add Selection Step</Button>
              </div>
            </Card.Body>
          </ComponentCard>

          {/* Links */}
          <ComponentCard className="mb-3" title="Important Links" isCollapsible defaultOpen>
            <Card.Body>
              {linkFields.map((l, idx) => (
                <Row key={l.id} className="mb-2">
                  <Col md={3}><Form.Control {...register(`links.${idx}.type`)} placeholder="Type" /></Col>
                  <Col md={4}><Form.Control {...register(`links.${idx}.label`)} placeholder="Label" /></Col>
                  <Col md={4}><Form.Control {...register(`links.${idx}.url`)} placeholder="URL" type="url" /></Col>
                  <Col md={1}><Button className="p-1   btn-light w-100" variant="danger" onClick={() => removeLink(idx)}>Remove</Button></Col>
                </Row>
              ))}
              <div className="border-top  border-dashed mt-4 text-end">

                <Button className="mt-3 me-2 sm" onClick={() => appendLink({ type: "", label: "", url: "" })}>+ Add Link</Button>
              </div>
            </Card.Body>
          </ComponentCard>

          {/* How To Apply */}
          <ComponentCard className="mb-3" title="How To Apply" isCollapsible defaultOpen>
            <Card.Body>
              <Controller
                control={control}
                name="howToApply"
                render={({ field }) => <SnowEditor {...field} />}
              />
            </Card.Body>
          </ComponentCard>

          {/* File Uploads */}
          <ComponentCard className="mb-3" title="Files / Logo" isCollapsible defaultOpen>
            <Card.Body>
              <Row>
                <Col md={6} className="m-0">

                  <Form.Group className="mb-2">
                    <Form.Label>Upload Files</Form.Label>
                    <Form.Control type="file" multiple onChange={onFilesPicked} />
                  </Form.Group>
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="d-flex align-items-center mb-1">
                      <span>{file.name}</span>
                      <Button size="sm" variant="danger" className="ms-2" onClick={() => removeUploadedFile(idx)}>Remove</Button>
                    </div>
                  ))}
                </Col>
                <Col md={6} className="m-0">
                  <Form.Group className="mb-2 ">
                    <Form.Label>Upload Logo</Form.Label>
                    <Form.Control type="file" onChange={onLogoPicked} />
                  </Form.Group>
                  {logoFile && (
                    <div className="d-flex align-items-center mb-1">
                      <span>{logoFile.name}</span>
                      <Button size="sm" variant="danger" className="ms-2" onClick={removeLogo}>Remove</Button>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </ComponentCard>

          <div className="text-end mt-3 me-3">
            <Button type="submit">Save Job</Button>
          </div>
        </Form>
      </Card.Body>
    </div>
  );
}
