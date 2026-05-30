// import React from "react";
// import { Form } from "react-bootstrap";

// export default function WeightageConfigurationSection({
//   sections = [],

//   selectedWeightageSections = [],

//   writtenExamWeightage = "",

//   onCheckboxChange = () => {},

//   onWeightageChange = () => {}
// }) {
//   return (
//     <div className="weightage-box">
//       {/* ================= TITLE ================= */}

//       <h5 className="section-title">
//         Weightage Configuration
//       </h5>

//       <p className="section-subtitle">
//         Select sections applicable for
//         written examination weightage
//       </p>

//       {/* ================= SECTION CHECKBOXES ================= */}

//       <div className="weightage-chip-wrapper">
//         {sections.length > 0 ? (
//           sections.map((section, index) => (
//             <div
//               className={`weightage-chip ${
//                 selectedWeightageSections.includes(
//                   index
//                 )
//                   ? "active"
//                   : ""
//               }`}
//               key={index}
//             >
//               <Form.Check
//                 type="checkbox"

//                 id={`weightage-section-${index}`}

//                 checked={selectedWeightageSections.includes(
//                   index
//                 )}

//                 onChange={() =>
//                   onCheckboxChange(index)
//                 }

//                 label={`Section ${
//                   index + 1
//                 }: ${
//                   section.sectionName ||
//                   "-"
//                 }`}
//               />
//             </div>
//           ))
//         ) : (
//           <div className="empty-weightage">
//             No sections added yet
//           </div>
//         )}
//       </div>

//       {/* ================= WEIGHTAGE INPUT ================= */}

//       <div className="weightage-input-section mt-4">
//         <Form.Group>
//           <Form.Label>
//             Written Exam Weightage (%)
//             <span className="required-star">
//               *
//             </span>
//           </Form.Label>

//           <Form.Control
//             type="number"

//             placeholder="e.g. 40"

//             value={writtenExamWeightage}

//             onChange={e =>
//               onWeightageChange(
//                 e.target.value
//               )
//             }
//           />

//           <small className="text-muted">
//             Enter the percentage
//             weightage allocated for
//             written examination.
//           </small>
//         </Form.Group>
//       </div>
//     </div>
//   );
// }
