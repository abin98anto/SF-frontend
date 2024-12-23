import React, { useEffect } from "react";
import styled from "styled-components";

const SnackbarContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: 50px;
  left: 55%;
  transform: translateX(-50%);
  background-color: #323232;
  color: white;
  padding: 16px;
  border-radius: 4px;
  z-index: 1000;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 0.3s;
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
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return <SnackbarContainer isVisible={isVisible}>{message}</SnackbarContainer>;
};
