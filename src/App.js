import { useState } from "react";

/*
 * ============================================================
 * PRODUCTION IMPORT
 * ============================================================
 *
 * Uncomment useEffect when enabling the real connection API:
 *
 * import { useEffect, useState } from "react";
 *
 * And remove:
 * import { useState } from "react";
 */

import Header from "./components/Header";
import HomePage from "./components/HomePage";
import TransportReview from "./components/TransportReview";

import { dummyTransportData } from "./data/dummyData";

function App() {
  // ============================================================
  // PAGE STATE
  // ============================================================

  const [page, setPage] = useState("home");

  // ============================================================
  // CONNECTION STATE
  // ============================================================

  /*
   * ==========================================================
   * CURRENT TEST / DEMO MODE
   * ==========================================================
   *
   * For frontend testing we are forcing the connection to TRUE.
   * No connection API is called.
   */

  const connected = true;
  const checkingConnection = false;

  /*
   * ==========================================================
   * REAL CONNECTION STATE
   * ==========================================================
   *
   * Uncomment these when enabling the backend API.
   *
   * IMPORTANT:
   * Also change the React import at the top to:
   *
   * import { useEffect, useState } from "react";
   */

  /*
  const [connected, setConnected] = useState(false);

  const [checkingConnection, setCheckingConnection] =
    useState(true);
  */

  // ============================================================
  // TRANSPORT ANALYSIS STATE
  // ============================================================

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [reviewData, setReviewData] = useState(null);

  // ============================================================
  // REAL SAP CONNECTION CHECK
  // CURRENTLY COMMENTED FOR FRONTEND TESTING
  // ============================================================

  /*
  useEffect(() => {
    const checkConnection = async () => {
      setCheckingConnection(true);

      try {
        const response = await fetch(
          "http://localhost:7888/check_connection"
        );

        if (!response.ok) {
          throw new Error(
            `Connection check failed: HTTP ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          "SPICE connection response:",
          data
        );

        /*
         * Adjust this logic if your FastAPI response
         * has a different structure.
         *
         * Supported examples:
         *
         * true
         *
         * {
         *   "connected": true
         * }
         *
         * {
         *   "status": true
         * }
         */

  /*
        const isConnected =
          data === true ||
          data?.connected === true ||
          data?.status === true;

        setConnected(isConnected);

      } catch (err) {
        console.error(
          "SPICE connection check failed:",
          err
        );

        setConnected(false);

      } finally {
        setCheckingConnection(false);
      }
    };

    checkConnection();
  }, []);
  */

  // ============================================================
  // ANALYZE TRANSPORT
  // ============================================================

  const handleAnalyze = async (transportRequest) => {
    if (!transportRequest) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ========================================================
      // CURRENT TEST / DUMMY MODE
      // ========================================================

      /*
       * Simulate a small backend processing delay.
       *
       * This allows the loading state to be visible during
       * frontend testing and leadership demonstrations.
       */

      await new Promise((resolve) => setTimeout(resolve, 800));

      /*
       * Clone dummy data so the imported object itself
       * is never modified.
       */

      const result = JSON.parse(JSON.stringify(dummyTransportData));

      /*
       * Replace the dummy TR number with whatever the
       * user entered on the Home Page.
       */

      result.transport_request = transportRequest;

      /*
       * Store analysis result.
       */

      setReviewData(result);

      /*
       * Navigate to Transport Review.
       */

      setPage("review");

      // ========================================================
      // REAL TRANSPORT REVIEW API
      // CURRENTLY COMMENTED FOR FRONTEND TESTING
      // ========================================================

      /*
       * IMPORTANT:
       *
       * When enabling the real API:
       *
       * 1. Comment/remove the dummy section above.
       * 2. Uncomment the API section below.
       */

      /*
      const response = await fetch(
        "http://localhost:7888/api/review/transport/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            transport_request: transportRequest,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage =
          `Transport analysis failed: HTTP ${response.status}`;

        try {
          const errorData = await response.json();

          if (errorData?.detail) {
            errorMessage = errorData.detail;
          } else if (errorData?.message) {
            errorMessage = errorData.message;
          }

        } catch {
          // Response did not contain JSON.
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();

      console.log(
        "Transport review response:",
        result
      );

      setReviewData(result);

      setPage("review");
      */
    } catch (err) {
      console.error("Transport analysis failed:", err);

      setError(err?.message || "Unable to analyze the transport request.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // NEW TRANSPORT
  // ============================================================

  const handleNewTransport = () => {
    setReviewData(null);

    setError(null);

    setPage("home");
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      {/* ======================================================
          GLOBAL HEADER
      ====================================================== */}

      <Header connected={connected} checkingConnection={checkingConnection} />

      {/* ======================================================
          HOME PAGE
      ====================================================== */}

      {page === "home" && (
        <HomePage
          onAnalyze={handleAnalyze}
          loading={loading}
          error={error}
          connected={connected}
          checkingConnection={checkingConnection}
        />
      )}

      {/* ======================================================
          TRANSPORT REVIEW PAGE
      ====================================================== */}

      {page === "review" && reviewData && (
        <TransportReview
          data={reviewData}
          onNewTransport={handleNewTransport}
        />
      )}
    </div>
  );
}

export default App;
