import React from "react";
import styled from "styled-components";
import {SharedStyles} from "../../styles/shared-styles";
import {Theme} from "../../styles/theme";

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  width: 100%;

  font-size: 16px;
  font-weight: bold;

  padding: 12px 24px;

  border-radius: 6px;

  ${SharedStyles.unselectableText};

  border: none;

  &:hover {
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.5;
    cursor: unset;
  }

  background-color: ${Theme.red};
  color: ${Theme.white};
`;
