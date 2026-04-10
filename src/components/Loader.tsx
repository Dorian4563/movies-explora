export default function Loader() {
  return (
    <div className="loader-container">
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loader-text">Loading...</p>
    </div>
  );
}
