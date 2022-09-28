import "./Header.css";

function Header({
  onPrimaryClick = null,
  primaryText = "Save",
  onSecondaryClick = null,
  secondaryText = "",
}) {
  return (
    <div className="Header">
      <div className="container">
        <p>Admin</p>
        {onSecondaryClick && (
          <button className="secondary" onClick={() => onSecondaryClick()}>
            {secondaryText}
          </button>
        )}
        {onPrimaryClick && (
          <button className="primary" onClick={() => onPrimaryClick()}>
            {primaryText}
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
