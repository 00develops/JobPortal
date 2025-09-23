// import React, { useState } from "react";
// import { Form, Button, Alert, Row, Col } from "react-bootstrap";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import ComponentCard from "../../../components/ComponentCard";

// const AddJob = () => {
//   const navigate = useNavigate();

//   const [jobData, setJobData] = useState({
//     sector: "",
//     department: "",
//     postName: "",
//     totalVacancies: "",
//     ageMin: "",
//     ageMax: "",
//     referenceDate: "",
//     relaxations: "",
//     qualification: "",
//     finalYearEligible: false,
//     experienceRequired: false,
//     genderRestriction: "None",
//     categoryReservation: [],
//     jobLocation: "",
//     selectionProcess: [],
//   });

//   const [message, setMessage] = useState("");
//   const [variant, setVariant] = useState("success");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (type === "checkbox") {
//       setJobData((prev) => ({ ...prev, [name]: checked }));
//     } else {
//       setJobData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const payload = {
//         ...jobData,
//         ageLimit: {
//           min: Number(jobData.ageMin),
//           max: Number(jobData.ageMax),
//           referenceDate: jobData.referenceDate,
//           relaxations: jobData.relaxations,
//         },
//       };

//       const response = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/api/jobs`,
//         payload
//       );

//       setMessage(`Job "${response.data.postName}" added successfully!`);
//       setVariant("success");

//       setJobData({
//         sector: "",
//         department: "",
//         postName: "",
//         totalVacancies: "",
//         ageMin: "",
//         ageMax: "",
//         referenceDate: "",
//         relaxations: "",
//         qualification: "",
//         finalYearEligible: false,
//         experienceRequired: false,
//         genderRestriction: "None",
//         categoryReservation: [],
//         jobLocation: "",
//         selectionProcess: [],
//       });

//       setTimeout(() => navigate("/admin/jobs"), 1000);
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Failed to add job.");
//       setVariant("danger");
//       console.error(err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="pt-4">
//       <ComponentCard title="Add Job">
//         {message && <Alert variant={variant}>{message}</Alert>}
//         <Form onSubmit={handleSubmit}>
//           {/* Row 1 */}
//           <Row className="mb-3">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Sector *</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="sector"
//                   value={jobData.sector}
//                   onChange={handleChange}
//                   placeholder="Sector"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Department *</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="department"
//                   value={jobData.department}
//                   onChange={handleChange}
//                   placeholder="Department"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Post Name *</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="postName"
//                   value={jobData.postName}
//                   onChange={handleChange}
//                   placeholder="Post Name"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Row 2 */}
//           <Row className="mb-3">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Total Vacancies *</Form.Label>
//                 <Form.Control
//                   type="number"
//                   name="totalVacancies"
//                   value={jobData.totalVacancies}
//                   onChange={handleChange}
//                   placeholder="Total Vacancies"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Min Age *</Form.Label>
//                 <Form.Control
//                   type="number"
//                   name="ageMin"
//                   value={jobData.ageMin}
//                   onChange={handleChange}
//                   placeholder="Min Age"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Max Age *</Form.Label>
//                 <Form.Control
//                   type="number"
//                   name="ageMax"
//                   value={jobData.ageMax}
//                   onChange={handleChange}
//                   placeholder="Max Age"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Row 3 */}
//           <Row className="mb-3">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Reference Date *</Form.Label>
//                 <Form.Control
//                   type="date"
//                   name="referenceDate"
//                   value={jobData.referenceDate}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Relaxations</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="relaxations"
//                   value={jobData.relaxations}
//                   onChange={handleChange}
//                   placeholder="Relaxations"
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Qualification *</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="qualification"
//                   value={jobData.qualification}
//                   onChange={handleChange}
//                   placeholder="Qualification"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Row 4: Checkboxes, Gender, Job Location */}
//           <Row className="mb-3">
//             <Col md={4} className="d-flex flex-column justify-content-center">
//               <Form.Check
//                 type="checkbox"
//                 label="Final Year Eligible"
//                 name="finalYearEligible"
//                 checked={jobData.finalYearEligible}
//                 onChange={handleChange}
//                 className="mb-2"
//               />
//               <Form.Check
//                 type="checkbox"
//                 label="Experience Required"
//                 name="experienceRequired"
//                 checked={jobData.experienceRequired}
//                 onChange={handleChange}
//               />
//             </Col>
//             <Col md={4} className="d-flex flex-column justify-content-center">
//               <Form.Label className="mb-1">Gender Restriction</Form.Label>
//               <Form.Select
//                 name="genderRestriction"
//                 value={jobData.genderRestriction}
//                 onChange={handleChange}
//               >
//                 <option value="None">None</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//               </Form.Select>
//             </Col>
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Job Location *</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="jobLocation"
//                   value={jobData.jobLocation}
//                   onChange={handleChange}
//                   placeholder="Job Location"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Row 5: Category & Selection Process */}
//           <Row className="mb-3">
//             <Col md={4}>
//               <Form.Label>Category Reservation</Form.Label>
//               <Select
                
//                 name="categoryReservation"
//                 options={[
//                   { value: "UR", label: "UR" },
//                   { value: "OBC", label: "OBC" },
//                   { value: "SC", label: "SC" },
//                   { value: "ST", label: "ST" },
//                   { value: "EWS", label: "EWS" },
//                 ]}
//                 value={jobData.categoryReservation.map((c) => ({ value: c, label: c }))}
//                 onChange={(selectedOptions) => {
//                   setJobData((prev) => ({
//                     ...prev,
//                     categoryReservation: selectedOptions
//                       ? selectedOptions.map((o) => o.value)
//                       : [],
//                   }));
//                 }}
//                 placeholder="Select category..."
//               />
//             </Col>
//             <Col md={4}>
//               <Form.Label>Selection Process</Form.Label>
//               <Select
                
//                 name="selectionProcess"
//                 options={[
//                   { value: "Tier-I", label: "Tier-I" },
//                   { value: "Tier-II", label: "Tier-II" },
//                   { value: "Interview", label: "Interview" },
//                   { value: "DV", label: "DV" },
//                   { value: "Medical", label: "Medical" },
//                 ]}
//                 value={jobData.selectionProcess.map((s) => ({ value: s, label: s }))}
//                 onChange={(selectedOptions) => {
//                   setJobData((prev) => ({
//                     ...prev,
//                     selectionProcess: selectedOptions
//                       ? selectedOptions.map((o) => o.value)
//                       : [],
//                   }));
//                 }}
//                 placeholder="Select selection process..."
//               />
//             </Col>
//           </Row>

//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "Submitting..." : "Add Job"}
//           </Button>
//         </Form>
//       </ComponentCard>
//     </div>
//   );
// };

// export default AddJob;
import React, { useState } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
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
    const { name, value, type, checked } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (selected, name) => {
    setJobData((prev) => ({
      ...prev,
      [name]: selected ? selected.map((opt) => opt.value) : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...jobData,
      ageLimit: {
        min: Number(jobData.ageMin),
        max: Number(jobData.ageMax),
        referenceDate: jobData.referenceDate,
        relaxations: jobData.relaxations,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/jobs`,
        payload
      );
      setMessage(`Job "${response.data.postName}" added successfully!`);
      setVariant("success");

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

      setTimeout(() => navigate("/admin/jobs"), 1000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to add job.");
      setVariant("danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-4">
      <ComponentCard title="Add Job">
        {message && <Alert variant={variant}>{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          {/* Row 1: Sector, Department, Post Name */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Sector *</Form.Label>
                <Form.Control
                  type="text"
                  name="sector"
                  value={jobData.sector}
                  onChange={handleChange}
                  placeholder="Central Govt / State Govt / PSU"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Department *</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  value={jobData.department}
                  onChange={handleChange}
                  placeholder="Department Name"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
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
            </Col>
          </Row>

          {/* Row 2: Total Vacancies, Age Min, Age Max */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
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
            </Col>
            <Col md={4}>
              <Form.Group>
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
            </Col>
            <Col md={4}>
              <Form.Group>
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
            </Col>
          </Row>

          {/* Row 3: Reference Date, Relaxations, Qualification */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Reference Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="referenceDate"
                  value={jobData.referenceDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Relaxations</Form.Label>
                <Form.Control
                  type="text"
                  name="relaxations"
                  value={jobData.relaxations}
                  onChange={handleChange}
                  placeholder="SC/ST/OBC/PWD"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Qualification *</Form.Label>
                <Form.Control
                  type="text"
                  name="qualification"
                  value={jobData.qualification}
                  onChange={handleChange}
                  placeholder="Bachelor's / Master's / etc."
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 4: Checkboxes + Gender */}
          <Row className="mb-3">
            <Col md={4}>
              <div className="d-flex flex-column">
                <Form.Check
                  type="checkbox"
                  label="Final Year Eligible"
                  name="finalYearEligible"
                  checked={jobData.finalYearEligible}
                  onChange={handleChange}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  label="Experience Required"
                  name="experienceRequired"
                  checked={jobData.experienceRequired}
                  onChange={handleChange}
                />
              </div>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Gender Restriction</Form.Label>
                <Form.Select
                  name="genderRestriction"
                  value={jobData.genderRestriction}
                  onChange={handleChange}
                >
                  <option value="None">None</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Female">Other</option>
                  <option value="Female">All</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Job Location *</Form.Label>
                <Form.Control
                  type="text"
                  name="jobLocation"
                  value={jobData.jobLocation}
                  onChange={handleChange}
                  placeholder="All India / City / State"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 5: Category Reservation, Mode of Selection */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Category-wise Reservation</Form.Label>
                <Select
                  isMulti
                  options={categoryOptions}
                  value={jobData.categoryReservation.map((c) => ({
                    value: c,
                    label: c,
                  }))}
                  onChange={(selected) => handleSelectChange(selected, "categoryReservation")}
                  placeholder="Select categories..."
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Mode of Selection</Form.Label>
                <Select
                  isMulti
                  options={selectionOptions}
                  value={jobData.selectionProcess.map((s) => ({
                    value: s,
                    label: s,
                  }))}
                  onChange={(selected) => handleSelectChange(selected, "selectionProcess")}
                  placeholder="Select stages..."
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Add Job"}
          </Button>
        </Form>
      </ComponentCard>
    </div>
  );
};

export default AddJob;
