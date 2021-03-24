import React from "react";
import styled from "styled-components";
import img from "../../assets/img/showcase_logo_small.svg";

interface ModalImageProps {
  url?: string;
}

const ModalImage: React.FC<ModalImageProps> = () => <StyledModalImage />;

const StyledModalImage = styled.div`
  min-height: 110px;
  min-width: 90px;
  background: url(${img});
`;

export default ModalImage;
