// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import { useLocation } from "react-router-dom";

// interface ProtectedRouteProps {
//   children: JSX.Element;
//   role?: "user" | "tutor" | "admin";
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
//   const navigate = useNavigate();

//   const location = useLocation();
//   let arr = location.pathname.split("/");
//   arr.shift();
//   arr.pop();

//   const user = useSelector((state: RootState) => state.user);
//   const tutor = useSelector((state: RootState) => state.tutor);
//   const admin = useSelector((state: RootState) => state.adminLogin);

//   let isAuthenticated = false;
//   let hasRoleAccess = false;

//   if (role === "user" && user.isAuthenticated) {
//     isAuthenticated = true;
//     hasRoleAccess = true;
//   } else if (role === "tutor" && tutor.isAuthenticated) {
//     isAuthenticated = true;
//     hasRoleAccess = true;
//   } else if (role === "admin" && admin.isAuthenticated) {
//     isAuthenticated = true;
//     hasRoleAccess = true;
//   }

//   useEffect(() => {
//     if (!isAuthenticated) {
//       if (!arr[0]) {
//         navigate("/login", { replace: true });
//       } else if (arr[0] === "tutor") {
//         navigate("/tutor/login", { replace: true });
//       } else {
//         navigate("/admin/login", { replace: true });
//       }
//     }
//   }, [isAuthenticated, hasRoleAccess, navigate, role]);

//   if (!isAuthenticated || (role && !hasRoleAccess)) {
//     return null;
//   }

//   return children;
// };

// export default ProtectedRoute;
