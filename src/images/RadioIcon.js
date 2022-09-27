const RadioIcon = ({
  fill,
  onClick,
  height,
  width,
  className,
  isActive = false,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      height={`${height ? height : "32"}`}
      width={`${width ? width : "32"}`}
      fill={`${fill ? fill : ""}`}
      className={`${className ? className : ""}`}
      onClick={onClick}
    >
      <path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,26A12,12,0,1,1,28,16,12,12,0,0,1,16,28Z" />
      {isActive && (
        <path
          className="radio-button-active"
          d="M16,10a6,6,0,1,0,6,6A6,6,0,0,0,16,10Z"
        />
      )}
    </svg>
  );
};
export default RadioIcon;
