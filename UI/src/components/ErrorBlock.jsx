export default function ErrorBlock({ errorCode, errorMessage, className }) {
  return (
    <div
      className={`col-md-8 mb-3 text-center p-2 bg-danger text-white ${className}`}
      style={{ display: errorCode ? "" : "none" }}
    >
      {errorCode} - {errorMessage}
    </div>
  );
}
