import React from "react";
import styled from "styled-components";
import {ComponentSize} from "../../enums/componentSize";

export const AppScreen = styled.div`
  display: flex;
  justify-content: center;

  width: 100vw;
  height: 100vh;
`;

export const AppScreenContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  width: ${ComponentSize.COEFFICIENT_OF_MAIN_PANE * 100}%;
  height: 100%;
`;

export const AppScreenControlsText = styled.div`
  display: flex;
`;

export const AppScreenControlsPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  
  padding: 6px;
  
  width: calc(100% - 6px*2);
  
  button {
    width: fit-content;
  }
  
  input {
    width: 100px;
  }
  
`;
