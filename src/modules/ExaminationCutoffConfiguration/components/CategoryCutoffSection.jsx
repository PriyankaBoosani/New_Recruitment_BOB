// import React from "react";
// import { Row, Col, Form } from "react-bootstrap";

// export default function CategoryCutoffSection({
//   categoryWiseCutoff = {
//     scst: "",
//     obc: "",
//     ur: ""
//   },

//   onChange = () => {}
// }) {
//   return (
//     <div className="category-cutoff-box">
//       {/* ================= TITLE ================= */}

//       <h5 className="section-title">
//         Category Wise Cut-off (%)
//       </h5>

//       {/* ================= INPUTS ================= */}

//       <Row>
//         {/* ================= SC/ST ================= */}

//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>
//               SC/ST
//               <span className="required-star">
//                 *
//               </span>
//             </Form.Label>

//             <Form.Control
//               type="number"
//               placeholder="e.g. 40"

//               value={
//                 categoryWiseCutoff.scst
//               }

//               onChange={e =>
//                 onChange(
//                   "scst",
//                   e.target.value
//                 )
//               }
//             />
//           </Form.Group>
//         </Col>

//         {/* ================= OBC ================= */}

//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>
//               OBC
//               <span className="required-star">
//                 *
//               </span>
//             </Form.Label>

//             <Form.Control
//               type="number"
//               placeholder="e.g. 50"

//               value={
//                 categoryWiseCutoff.obc
//               }

//               onChange={e =>
//                 onChange(
//                   "obc",
//                   e.target.value
//                 )
//               }
//             />
//           </Form.Group>
//         </Col>

//         {/* ================= UR ================= */}

//         <Col md={4}>
//           <Form.Group>
//             <Form.Label>
//               UR
//               <span className="required-star">
//                 *
//               </span>
//             </Form.Label>

//             <Form.Control
//               type="number"
//               placeholder="e.g. 60"

//               value={
//                 categoryWiseCutoff.ur
//               }

//               onChange={e =>
//                 onChange(
//                   "ur",
//                   e.target.value
//                 )
//               }
//             />
//           </Form.Group>
//         </Col>
//       </Row>
//     </div>
//   );
// }