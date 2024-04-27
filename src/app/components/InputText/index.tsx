import styled from "styled-components";
import {Theme} from "../../styles/theme";

interface InputTextProps {
    value?: string | any;
    error?: boolean;
    onChange?: (e: any) => void;
}

export const InputText = styled.input<InputTextProps>`
    min-width: 0;
    height: 40px;
    min-height: 40px;
    
    font-size: 14px;
    border: 1px solid ${Theme.darkGrey};
    outline: none;
    
    padding: 0 6px;
    
    transition: all 0.1s;

    &:focus {
        border: 1px solid ${Theme.black};
    }

    input[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    border-radius: 4px;

    ${({error}) => error && `
      border: 1px solid ${Theme.red};
      filter: grayscale(0);
      ::placeholder {
        color: ${Theme.red};
      };
  `};
`;

export const InputTextArea = styled.textarea<{ error?: any }>`
  min-width: 0;
  min-height: 40px;

  resize: none;

  font-size: 14px;
  border: 1px solid ${Theme.darkGrey};
  outline: none;

  padding: 0 6px;

  transition: all 0.1s;

  &:focus {
    border: 1px solid ${Theme.black};
  }

  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  border-radius: 4px;

  ${({error}) => error && `
      border: 1px solid ${Theme.red};
      filter: grayscale(0);
      ::placeholder {
        color: ${Theme.red};
      };
  `};
`;

