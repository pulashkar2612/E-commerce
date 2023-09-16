export default function Spinner({ loading }) {
  return (
    <div className="spinner-wrapper" style={{ display: loading ? "" : "none" }}>
      <div className="spinner text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden ">Loading...</span>
        </div>
      </div>
    </div>
  );
}
