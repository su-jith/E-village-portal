import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

//Dashboard Components
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from './pages/EmployeeDashboard';
import HealthcareWorkerDashboard from './pages/HealthcareWorkerDashboard';
import RationOfficerDashboard from './pages/RationOfficerDashboard';
import FamilyDashboard from './pages/FamilyDashboard';

//ward assginment components
import AssignWard from "./components/AssignWard";
import AssignRation from "./pages/AssignRation";
import AssignWardtoEmployee from "./pages/AssignWardtoEmployee"; 
import AssignHealth from "./pages/AssignHealth";

// Corrected Import
import WardManagement from "./pages/WardManagement";
import EmployeeManagement from "./pages/EmployeeManagement";
import HealthcareWorkerManagement from "./pages/HealthcareWorkerManagement";  
import RationOfficerManagement from "./pages/RationOfficerManagement";
import HouseManagement from './pages/HouseManagement'; 
import UserManagement from "./pages/UserManagement";
import HealthDataCollection from "./pages/HealthDataCollection";






// Placeholder components for other login pages
import AdminLogin from "./pages/AdminLogin";
import EmployeeLogin from './pages/EmployeeLogin';
import HealthcareWorkerLogin from "./pages/HealthcareWorkerLogin";
import RationOfficerLogin from "./pages/RationOfficerLogin";
import FamilyLogin from "./pages/FamilyLogin";


// Placeholder components for data collection
import FamilyDataCollection from './pages/FamilyDataCollection';
import FamilyDetails from './pages/FamilyDetails';
import HealthFaamilyMemberDetails from './pages/HealthFamilyMemberDetails';
import HealthDataEntry from './pages/HealthDataEntry';
import RationNotificationPage from "./pages/RationNotificationPage";
import AdminJobPost from "./pages/AdminJobPost";
import JobApplicationForm from "./pages/JobApplicationForm";
import ViewJobApplications from "./pages/ViewJobApplications";
import FamilyFullDetails from "./pages/Familyfulldetails";
import ComplaintForm from "./pages/ComplaintForm";
import ViewComplaints from "./pages/ViewComplaints";
import HouseDashboard from "./pages/HouseDashboard";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/employee" element={<EmployeeLogin />} />
        <Route path="/login/healthcare-worker" element={<HealthcareWorkerLogin />} />
        <Route path="/login/ration-officer" element={<RationOfficerLogin />} />
        <Route path="/login/family" element={<FamilyLogin />} />
      

      
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard/assign-ward" element={<AssignWard />} />
        <Route path="/dashboard/assign-ward/employee" element={<AssignWardtoEmployee />} />
        <Route path="/dashboard/wards" element={<WardManagement />} />
        <Route path="/dashboard/employees" element={<EmployeeManagement />} />
        <Route path="/dashboard/healthcare-workers" element={<HealthcareWorkerManagement />} />
        <Route path="/dashboard/ration-officers" element={<RationOfficerManagement/>} />
        <Route path="/dashboard/assign-ward/healthcare-worker" element={<AssignHealth />} />
        <Route path="/dashboard/assign-ward/ration-officer" element={<AssignRation />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        
        <Route path="/employee/collect-data" element={<HouseManagement />} />
        <Route path="/employee/house-management" element={<HouseManagement />} />
        <Route path="/employee/family/add/:wardNumber/:houseNumber" element={<FamilyDataCollection />} />
        <Route path="/employee/family/edit/:houseNumber/:familyMemberId" element={<FamilyDataCollection />} />

        <Route path="/employee/family-details/:wardNumber/:houseNumber" element={<FamilyDetails />} />

        <Route path="/healthcareworker-dashboard" element={<HealthcareWorkerDashboard />}/>
        <Route path="/health-data-collection" element={<HealthDataCollection />}/>
        <Route path="/family-member-details/:memberId" element={<HealthFaamilyMemberDetails />} />
        <Route path="/add-health-data/:memberId" element={<HealthDataEntry />} />
        <Route path="/ration-officer-dashboard" element={<RationOfficerDashboard />} />
        <Route path="/ration-notification" element={<RationNotificationPage />} />
        
        <Route path="/family-dashboard/ward/:wardNumber/:houseNumber" element={<FamilyDashboard />} />
        <Route path="/dashboard/job-portal" element={<AdminJobPost />} />
        <Route path="/job-application/:jobId" element={<JobApplicationForm />} />
        <Route path="/view-job-applications/:jobId" element={<ViewJobApplications />} />
        <Route path="/family-full-details/:memberId" element={<FamilyFullDetails />} />
        <Route path="/api/complaints" element={<ComplaintForm />} />
        <Route path="/api/view-complaints" element={<ViewComplaints />} />
        <Route path="/dashboard/user-management" element={<UserManagement />} />
        <Route path="/dashboard/overview" element={<HouseDashboard/>} />


      
        
        




        
        
      
      </Routes>
    </Router>
  );
}

export default App;
