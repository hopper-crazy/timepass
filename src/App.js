import { useEffect, useState } from "react";

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
   * No connection API is currently called.
   */

  const connected = true;
  const checkingConnection = false;

  /*
   * ==========================================================
   * REAL CONNECTION STATE
   * ==========================================================
   *
   * Uncomment these when enabling the backend API.
  /*
  const [connected, setConnected] = useState(false);

  const [checkingConnection, setCheckingConnection] =
    useState(true);
  */

  // ============================================================
  // SELECTED SAP SYSTEM
  // ============================================================

  /*
   * No SAP system is selected by default.
   */

  const [selectedSystem, setSelectedSystem] = useState("");

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
    // ==========================================================
    // NORMALIZE TRANSPORT
    // ==========================================================

    const normalizedTransport = transportRequest?.trim().toUpperCase();

    // ==========================================================
    // VALIDATE TRANSPORT
    // ==========================================================

    if (!normalizedTransport) {
      setError("Please enter a transport request.");
      return;
    }

    // ==========================================================
    // VALIDATE SAP SYSTEM
    // ==========================================================
    //
    // IMPORTANT:
    //
    // The system is checked BEFORE:
    //
    // - loading state
    // - dummy processing
    // - fetch()
    // - POST request
    //
    // Therefore the backend cannot be called without a system.
    // ==========================================================

    if (!selectedSystem) {
      setError("Please select an SAP system.");
      return;
    }

    // ==========================================================
    // START ANALYSIS
    // ==========================================================

    setLoading(true);
    setError(null);

    try {
      // ========================================================
      // CURRENT TEST / DUMMY MODE
      // ========================================================
      //
      // This section is currently ACTIVE.
      //
      // When enabling the real API:
      //
      // 1. Comment/remove this dummy section.
      // 2. Uncomment the REAL TRANSPORT REVIEW API below.
      // ========================================================

      /*
       * Simulate backend processing.
       */

      await new Promise((resolve) => setTimeout(resolve, 800));

      /*
       * Clone dummy data so the imported dummy object itself
       * is never modified.
       */

      const result = JSON.parse(JSON.stringify(dummyTransportData));

      /*
       * Replace dummy TR with the TR entered by the developer.
       */

      result.transport_request = normalizedTransport;

      /*
       * Add selected SAP system to the dummy result.
       *
       * This lets the review data know which system was used
       * even while running in frontend demo mode.
       */

      result.system = selectedSystem;

      console.log("SPICE dummy analysis:", {
        transport_request: normalizedTransport,
        system: selectedSystem,
      });

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
      //
      // When enabling the backend:
      //
      // 1. Remove/comment the dummy section above.
      // 2. Uncomment this entire block.
      //
      // Request body:
      //
      // {
      //   "transport_request": "DS4K900123",
      //   "system": "DS4"
      // }
      // ========================================================

      /*
      const response = await fetch(
        "http://localhost:7888/api/review/transport/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            transport_request: normalizedTransport,
            system: selectedSystem,
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

    /*
     * selectedSystem is intentionally NOT reset.
     *
     * Example:
     *
     * Developer reviews:
     *
     * DS4K900123 -> DS4
     *
     * Then clicks "New Transport".
     *
     * DS4 remains selected because developers will commonly
     * review multiple transports from the same SAP system.
     *
     * If you want the system to reset every time instead:
     *
     * setSelectedSystem("");
     */
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
          selectedSystem={selectedSystem}
          setSelectedSystem={setSelectedSystem}
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
