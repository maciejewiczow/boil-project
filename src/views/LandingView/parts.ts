import { Link } from 'react-router-dom';
import { ImageSvg } from 'components/ImageSVG';
import styled from 'styled-components';

export const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;

    padding: 0 10vw;

    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-flow: row wrap;
`;

export const LinkCard = styled(Link)`
    width: 300px;
    height: 350px;
    padding: 18px 24px;
    border-radius: 3px;
    background: #eee;

    color: black;
    text-decoration: none;

    display: flex;
    flex-flow: column nowrap;

    box-shadow: 0 6px 12px 0px rgba(0,0,0,0.5);
    transition: box-shadow 0.3s ease-in-out;

    &:hover{
        box-shadow: 0 8px 16px 3px rgba(0,0,0,0.65);
        color: inherit;
        text-decoration: none;
    }
`;

export const CardDescription = styled.div`
    text-align: center;
    font-size: 18px;
    margin-bottom: 6px;
`;

export const CardImageWrapper = styled(ImageSvg)`
    flex-grow: 1;
`;
