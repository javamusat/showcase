import React from "react";
import styled from "styled-components";

export interface LoginStepperProps {
  currentStep: number;
}
const LoginStepper: React.FC<LoginStepperProps> = ({ currentStep }) => {
  return (
    <LoginStepperContainer>
      <StepContainer>
        <Step active={currentStep === 1}>1</Step>
        <Line />
        <Step active={currentStep === 2}>2</Step>
      </StepContainer>
      <StepTextContainer>
        <StepText>Sign up with Twitter</StepText>
        <div style={{ margin: ".5rem" }} />
        <StepText>Connect with Metamask</StepText>
      </StepTextContainer>
    </LoginStepperContainer>
  );
};

export interface StepProps {
  active: boolean;
}

const LoginStepperContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const StepTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  // justify-content: center;
  // align-items: center;
  font-size: 12px;
  padding-left: 1.5rem;
`;

const Step = styled.div<StepProps>`
  width: 20px;
  height: 20px;
  border: 3px solid #3a486b;
  text-align: center;
  background: ${(props) =>
    props.active && "linear-gradient(135deg, #0EACE7 0%, #086EEB 100%)"};
`;

const Line = styled.div`
  height: 1px;
  width: 120px;
  border-bottom: 3px solid #3a486b;
`;

const StepText = styled.div`
  padding: 0.5rem;
`;

export default LoginStepper;
