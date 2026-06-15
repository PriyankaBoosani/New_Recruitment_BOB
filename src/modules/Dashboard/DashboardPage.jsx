import React, { useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import DashboardFilters from "./components/DashboardFilters";
import SummaryCards from "./components/SummaryCards";
import RequisitionStatus from "./components/RequisitionStatus";
import Vacancies from "./components/Vacancies";
import MetricDetailsModal from "./modals/MetricDetailsModal";
import CategoryWiseDistribution from "./components/CategoryWiseDistribution";
import CandidatePipelineMetrics from "./components/CandidatePipelineMetrics";
import CandidateMetricDetailsModal from "./modals/CandidateMetricDetailsModal";
import ApplicationsByDepartment from "./components/ApplicationsByDepartment";
import MonthlyRecruitmentTrends from "./components/MonthlyRecruitmentTrends";
import ZonalRecruitmentHeatmap from "./components/ZonalRecruitmentHeatmap";
import StateWiseDistribution from "./components/StateWiseDistribution";
import Committee from "./components/Committee";
import CandidateRegistrationOverview from "./components/CandidateRegistrationOverview";
import CommitteeDetailsModal from "./modals/CommitteeDetailsModal";
import RecruiterPerformanceTable from "./components/RecruiterPerformanceTable";
import useDashboardFilters from "./hooks/useDashboardFilters";
import useDashboardDetails from "./hooks/useDashboardDetails";
const DashboardPage = () => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [selectedCandidateMetric, setSelectedCandidateMetric] = useState(null);
  const [selectedCommitteeMetric, setSelecteedCommitteeMetric] = useState(null);
  const { filters, loading } = useDashboardFilters();
  const { dashboardData, refreshDashboard } = useDashboardDetails();
  return (
    <div className="dashboard-page p-4 bg-light min-vh-100">
      <DashboardHeader />
      <DashboardFilters filters={filters} loading={loading} onApply={refreshDashboard} />
      <SummaryCards
        summary={dashboardData?.executiveSummary}
        onCardClick={setSelectedMetric}
      />
      <div className="row mt-4">
        <div className="col-lg-6 mb-4">
          <RequisitionStatus
            summary={dashboardData?.requisitionStatus}
            onCardClick={(item) => setSelectedMetric(item)}
          />{" "}
        </div>

        <div className="col-lg-6 mb-4">
          <Vacancies summary={dashboardData?.executiveSummary} />
        </div>
        <MetricDetailsModal
          show={!!selectedMetric}
          metric={selectedMetric}
          dashboardData={dashboardData}
          onClose={() => setSelectedMetric(null)}
        />
      </div>
      <div>
        {/* <CategoryWiseDistribution /> */}
        <CategoryWiseDistribution
          categories={dashboardData?.categoryDistribution || []}
        />
      </div>
      <CandidatePipelineMetrics
        candidatePipeline={dashboardData?.candidatePipeline}
        onCardClick={setSelectedCandidateMetric}
      />
      <CandidateMetricDetailsModal
        show={!!selectedCandidateMetric}
        metric={selectedCandidateMetric}
        pipelineDetails={
          dashboardData?.candidatePipeline?.pipelineDetails || []
        }
        onClose={() => setSelectedCandidateMetric(null)}
      />
      <ApplicationsByDepartment
        applicationsByDepartment={
          dashboardData?.candidatePipeline?.applicationsByDepartment || []
        }
      />
      <MonthlyRecruitmentTrends
        monthlyTrends={dashboardData?.candidatePipeline?.monthlyTrends || []}
      />
      <ZonalRecruitmentHeatmap
        zonalHeatmap={dashboardData?.zonalHeatmap || []}
      />
      <StateWiseDistribution
        stateVacancyDistribution={dashboardData?.stateVacancyDistribution || []}
      />{" "}
      <div className="row mt-4 align-items-stretch">
        <div className="col-lg-6 mb-4 d-flex">
          <Committee
            committeeOverview={dashboardData?.committeeOverview}
            onCardClick={setSelecteedCommitteeMetric}
          />
        </div>

        <div className="col-lg-6 mb-4 d-flex">
          <CandidateRegistrationOverview
            data={dashboardData?.candidatePipeline?.candidateRegistration}
          />{" "}
        </div>
      </div>
      <CommitteeDetailsModal
        show={!!selectedCommitteeMetric}
        metric={selectedCommitteeMetric}
        onClose={() => setSelecteedCommitteeMetric(null)}
        committeeData={dashboardData?.committeeOverview}
      />
      <RecruiterPerformanceTable
        recruiterPerformance={dashboardData?.recruiterPerformance || []}
      />{" "}
    </div>
  );
};

export default DashboardPage;
