import React, { useEffect } from "react";
import styled from "styled-components";

const SnackbarContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 10px;
  left: 55%;
  transform: translateX(-50%);
  background-color: #ff3333;
  color: white;
  padding: 10px;
  border-radius: 4px;
  z-index: 1000;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  height: 40px;
`;

interface SnackbarProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  isVisible,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return <SnackbarContainer isVisible={isVisible}>{message}</SnackbarContainer>;
};
