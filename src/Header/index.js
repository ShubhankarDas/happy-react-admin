import "./Header.css";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

function Header({
  onPrimaryClick = null,
  onSecondaryClick = null,
  showCancel = false,
  primaryText = "Save",
}) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onButtonClick = () => {
    if (isLoading || !onPrimaryClick) return;

    setIsLoading(true);
    onPrimaryClick(() => {
      setIsLoading(false);
    });
  };

  const showSecondaryButton = onSecondaryClick || showCancel;

  if (!onSecondaryClick && showSecondaryButton) {
    onSecondaryClick = () => {
      navigate("/messages");
    };
  }

  return (
    <div className="Header">
      <div className="container">
        <p>Admin</p>
        {showSecondaryButton && (
          <button
            className={`secondary ${isLoading ? "disabled" : ""}`}
            onClick={onSecondaryClick}
          >
            Cancel
          </button>
        )}
        {onPrimaryClick && (
          <button
            className={`primary ${isLoading ? "disabled" : ""}`}
            onClick={onButtonClick}
          >
            {primaryText}
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
