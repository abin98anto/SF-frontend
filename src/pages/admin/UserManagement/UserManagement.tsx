import React, { useEffect } from "react";
import { Table, Button, ConfigProvider, theme } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  fetchUsers,
  selectUsers,
  selectUsersStatus,
  selectUsersError,
} from "../../../redux/features/userListSlice";
import "./UserManagement.scss";
import ErrorBoundary from "../../../components/ErrorBoundary/ErrorBoundary";

const { useToken } = theme;

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const status = useAppSelector(selectUsersStatus);
  const error = useAppSelector(selectUsersError);

  const toISOStringDate = (date: string): string => {
    return new Date(date)
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("-"); // Converts to YYYY-MM-DD
  };

  const { token } = useToken();

  useEffect(() => {
    // Dispatch fetchUsers on component mount
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDeleteUser = (name: string) => {
    console.log(`Delete user: ${name}`);
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
      render: (date: string) => toISOStringDate(date),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: { name: string }) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteUser(record.name)}
          style={{
            backgroundColor: token.colorError,
            borderColor: token.colorError,
          }}
        >
          Delete
        </Button>
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
              dataSource={Array.isArray(users) ? users : []}
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
