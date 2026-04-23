import React from "react";

/**
 * ErrorBoundary
 * Catches React runtime errors and prevents full app crash
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, textAlign: "center" }}>
          <h2>⚠️ Something went wrong</h2>
          <p>{this.state.error?.message || "Unexpected error occurred"}</p>

          <button
            onClick={this.handleReload}
            style={{
              padding: "10px 16px",
              marginTop: 10,
              background: "#0d6efd",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
