import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import Select from "react-select";
import { useTranslation } from "react-i18next";
export default function ApprovalHeader({
  selectStyles,

  requisitionOptions,
  positionOptions,

  selectedRequisitionOption,
  selectedPositionOption,

  loadingRequisitions,
  loadingPositions,

  onRequisitionChange,
  onPositionChange,
  activeTab,
  searchText,
  onSearch,
}) {
  const { t } = useTranslation("approvalHistory");
  return (
    
    <>
    
      <Row className="mb-3 align-items-center">
        <Col>
          <h5 className="page-title">{t("candidate_selection_approval")}</h5>

          <p className="page-subtitle">
            {t("review_and_approve_candidate_workflow_requests")}
          </p>
        </Col>

        <Col xs={12} md={4}>
          <div className="search-boxpost">
            <Search />
            <Form.Control
              placeholder={t("search_candidate")}
              value={searchText}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </Col>
      </Row>

      <Row className="mb-3 align-items-end filters-row">
        {/* Requisition */}
        <Col md={4}>
          <div className="filter-label"> {t("requisition")}</div>

          <Select
            styles={selectStyles}
            options={requisitionOptions}
            value={selectedRequisitionOption}
            isLoading={loadingRequisitions}
            placeholder={t("select_requisition")}
            classNamePrefix="filter-select"
            menuPortalTarget={document.body}
            onChange={(opt) => onRequisitionChange(opt?.raw || null)}
          />
        </Col>

        {/* Position */}
        <Col md={4}>
          <div className="filter-label"> {t("position")}</div>

          <Select
            styles={selectStyles}
            options={positionOptions}
            value={selectedPositionOption}
            isLoading={loadingPositions}
            isDisabled={!selectedRequisitionOption}
            placeholder={t("select_position")}
            classNamePrefix="filter-select"
            menuPortalTarget={document.body}
            onChange={(opt) =>
              onPositionChange(
                opt?.raw || null,
                activeTab === "screening" ? "SCREENING" : "INTERVIEW"
              )
            }
          />
        </Col>

        {/* Status */}
        {/* <Col md={2} className="ms-auto">
          <div className="filter-label">Status</div>

          <Form.Select>
            <option>L1 Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </Form.Select>
        </Col> */}
      </Row>
    </>
  );
}
