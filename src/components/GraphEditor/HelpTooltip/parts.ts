import { IoIosHelpCircleOutline } from 'react-icons/io';
import styled from 'styled-components';

export const Wrapper = styled.div``;

export const HelpBody = styled.div`
    position: absolute;
    right: 8px;
    top: 8px;
    z-index: 19;
    background: rgba(255,255,255,0.8);
    padding: 12px 18px;
    padding-right: 35px;

    box-shadow: 0 5px 10px 0 rgba(0,0,0,0.4);
`;

export const Icon = styled(IoIosHelpCircleOutline)`
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
    color: #777;
    width: 35px;
    height: 35px;
    z-index: 20;
`;
