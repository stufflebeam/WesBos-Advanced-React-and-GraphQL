import ReactLoading from 'react-loading';

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
    <ReactLoading
      type={loadingConfig.type}
      color={loadingConfig.color}
      height={loadingConfig.height}
      width={loadingConfig.width}
      className={loadingConfig.className}
    />
  );
};

export default LoadingAnimation;
