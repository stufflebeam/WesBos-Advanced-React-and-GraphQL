import ReactLoading from 'react-loading';
import styled from 'styled-components';

const LoadingAnimationStyles = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

// export default function LoadingAnimation() {
const LoadingAnimation = (props) => {
  const { type, color, delay, height, width, className } = props.config;
  // Loading animation config -- TODO: standardize this across all components
  const loadingConfig = {
    type: type || 'bubbles',
    color: color || '#000',
    delay: delay || 0,
    height: height || 64,
    width: width || 64,
    className: className || 'loading-animation',
  };
  return (
    <LoadingAnimationStyles>
      <ReactLoading
        type={loadingConfig.type}
        color={loadingConfig.color}
        height={loadingConfig.height}
        width={loadingConfig.width}
        className={loadingConfig.className}
      />
    </LoadingAnimationStyles>
  );
};

export default LoadingAnimation;
