import React, { useEffect } from "react";
import { Table, ConfigProvider, Switch, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  fetchUsers,
  selectUsers,
  selectUsersStatus,
  selectUsersError,
  updateUserStatusLocally,
} from "../../../redux/features/userListSlice";
import "./UserManagement.scss";
import ErrorBoundary from "../../../components/ErrorBoundary/ErrorBoundary";
import { toggleUserStatus } from "../../../redux/features/userSlice";

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const status = useAppSelector(selectUsersStatus);
  const error = useAppSelector(selectUsersError);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      const resultAction = await dispatch(toggleUserStatus(userId));
      if (toggleUserStatus.fulfilled.match(resultAction)) {
        const newStatus = isActive;
        message.success(
          `User status updated to ${newStatus ? "Active" : "Inactive"}`
        );

        dispatch(
          updateUserStatusLocally({
            userId,
            isActive: newStatus,
          })
        );
      } else {
        message.error(resultAction.payload || "Failed to update user status");
      }
    } catch {
      message.error("Unexpected error occurred");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Joining Date",
      dataIndex: "dateJoined",
      key: "dateJoined",
      render: (date: string) =>
        new Date(date)
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-"),
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: { _id: string; isActive: boolean }) => (
        <Switch
          checked={record.isActive}
          onChange={(checked) => handleToggleStatus(record._id, checked)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
  ];

  return (
    <ErrorBoundary>
      <h1 className="um-heading">User Management</h1>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#333",
            colorBorder: "#444",
            colorBorderSecondary: "#444",
          },
        }}
      >
        <div className="user-management">
          {status === "loading" && <p>Loading...</p>}
          {status === "failed" && <p>Error: {error}</p>}
          {status === "succeeded" && (
            <Table
              dataSource={
                Array.isArray(users)
                  ? users.map((user) => ({
                      ...user,
                      key: user._id,
                      isActive: user.isActive ?? false,
                    }))
                  : []
              }
              columns={columns}
              rowKey="_id"
            />
          )}
        </div>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default UserManagement;
