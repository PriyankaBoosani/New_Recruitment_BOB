// src/routes/AppRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import User from "../pages/User";
import Department from "../pages/department";
import Location from "../pages/Location";
import JobGrade from "../pages/JobGrade";
import Position from "../pages/Position";
import Category from "../pages/Category";
import SpecialCategory from "../pages/SpecialCategory";
import RelaxationType from "../pages/RelaxationType";
import Document from "../pages/Document";
import InterviewPanel from "../pages/InterviewPanel";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<User />} />
      <Route path="/department" element={<Department />} />
      <Route path="/location" element={<Location />} />
      <Route path="/jobgrade" element={<JobGrade />} />
      <Route path="/position" element={<Position />} />
      <Route path="/category" element={<Category />} />
      <Route path="/specialcategory" element={<SpecialCategory />} />
      <Route path="/relaxationtype" element={<RelaxationType />} />
      <Route path="/document" element={<Document />} />
      <Route path="/interviewpanel" element={<InterviewPanel />} />
    </Routes>
  );
};

export default AppRoutes;
