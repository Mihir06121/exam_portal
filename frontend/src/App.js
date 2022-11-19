import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminRoute from "./components/admin/AdminRoutes";
import RequireAuth from "./components/RequireAuth"
import UserRoute from "./components/user/UserRoutes"
import { AuthProvider } from "./actions/auth";
import CreateCenter from "./components/subAdmin/CreateCenter";
import CenterInfo from "./components/user/CenterInfo";
import Dashboard from "./components/user/Dashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import SubAdminDashboard from "./components/subAdmin/SubAdminDashboard";
import DeactivatedDashboard from "./components/deactivated/Dashboard";
import SubAdminRoute from "./components/subAdmin/SubAdminRoute";
import AdminCenterInfo from "./components/admin/AdminCenterInfo";
import AdminQuestionCenter from "./components/admin/AdminQuestionCenter";
import AdminUserInfo from "./components/admin/AdminUsersInfo";
import DeactivatedRoute from "./components/deactivated/DeactivatedRoutes";

const App = () => {

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<RequireAuth>
          <Home/>
        </RequireAuth>} />

        <Route path="/admin">
          <Route path="dashboard" element={<AdminRoute><AdminDashboard/></AdminRoute>}/>
          <Route path="center-info" element={<AdminRoute><AdminCenterInfo/></AdminRoute>}/>
          <Route path="question-center" element={<AdminRoute><AdminQuestionCenter/></AdminRoute>}/>
          <Route path="users-info" element={<AdminRoute><AdminUserInfo/></AdminRoute>}/>
        </Route>

        <Route path="/sub-admin">
          <Route path="dashboard" element={<SubAdminRoute><SubAdminDashboard/></SubAdminRoute>}/>
          <Route path="create-sub-center" element={<SubAdminRoute><CreateCenter/></SubAdminRoute>}/>
        </Route>

        <Route path="/user">
          <Route path="dashboard" element={<UserRoute><Dashboard/></UserRoute>}/>
          <Route path="center-info" element={<UserRoute><CenterInfo/></UserRoute>}/>
        </Route>

        <Route path="/deactivated">
          <Route path="dashboard" element={<DeactivatedRoute><DeactivatedDashboard/></DeactivatedRoute>}/>
          {/* <Route path="center-info" element={<DeactivatedRoute><CenterInfo/></DeactivatedRoute>}/> */}
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App