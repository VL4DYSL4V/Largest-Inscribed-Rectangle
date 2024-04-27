import { css } from 'styled-components';

const unselectableText = css`
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
`;

const ellipsisOverflow = css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const selectableText = css`
    -webkit-touch-callout: text; /* iOS Safari */
    -webkit-user-select: text; /* Safari */
    -khtml-user-select: text; /* Konqueror HTML */
    -moz-user-select: text; /* Old versions of Firefox */
    -ms-user-select: text; /* Internet Explorer/Edge */
    user-select: text; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
`;

const numberInputHiddenArrows = css`
    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    -moz-appearance: textfield;
`;

export const SharedStyles = {
    unselectableText,
    ellipsisOverflow,
    selectableText,
    numberInputHiddenArrows
};
