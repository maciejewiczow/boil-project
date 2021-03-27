import Form from 'react-bootstrap/Form';
import { CgArrowsHAlt } from 'react-icons/cg';
import styled from 'styled-components';

export const Wrapper = styled.div`
    padding: 12px 18px;
    margin-right: 24px;
    font-size: 15px;
    height: auto;

    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    background: white;

    display: flex;
    flex-flow: column nowrap;
`;

export const Subtitle = styled.div`
    font-size: 12px;
    color: #444;
`;

export const Title = styled.div`
    font-size: 22px;
`;

export const Arrow = styled(CgArrowsHAlt)`
    margin: 0 4px;
`;

export const FormGroup = styled(Form.Group)`
    &:last-child {
        margin-bottom: 0;
    }
`;

export const FormWrapper = styled.div`
    margin-top: 12px;
`;
