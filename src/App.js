import { useEffect, useRef, useState } from "react";

import Header from "./components/Header";
import HomePage from "./components/HomePage";
import TransportReview from "./components/TransportReview";
import AnalysisLoading from "./components/AnalysisLoading";

import { dummyTransportData } from "./data/dummyData";

function App() {
  // ============================================================
  // PAGE
  // ============================================================

  const [page, setPage] = useState("home");

  // ============================================================
  // CONNECTION
  // ============================================================

  // CURRENT DEMO MODE

  const connected = true;
  const checkingConnection = false;

  /*
   * ==========================================================
   * REAL CONNECTION VERSION
   * ==========================================================
   *
   * Replace the constants above with:
   *
   * const [connected, setConnected] = useState(false);
   * const [checkingConnection, setCheckingConnection] =
   *   useState(true);
   *
   * Then uncomment:
   */

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

        const data =
          await response.json();

        const isConnected =
          data === true ||
          data?.connected === true ||
          data?.status === true;

        setConnected(isConnected);

      } catch (err) {
        console.error(
          "Connection check failed:",
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
  // SYSTEM
  // ============================================================

  const [selectedSystem, setSelectedSystem] = useState("");

  // ============================================================
  // ANALYSIS
  // ============================================================

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [reviewData, setReviewData] = useState(null);

  // ============================================================
  // LOADING PAGE CONTEXT
  // ============================================================

  const [analysisContext, setAnalysisContext] = useState({
    transportRequest: "",
    system: "",
  });

  const [elapsed, setElapsed] = useState(0);

  // Used for retry.

  const lastRequestRef = useRef(null);

  // ============================================================
  // LOADING TIMER
  // ============================================================

  useEffect(() => {
    if (page !== "loading") {
      return undefined;
    }

    setElapsed(0);

    const timer = setInterval(() => {
      setElapsed((current) => Math.min(current + 1, 10));
    }, 1000);

    return () => clearInterval(timer);
  }, [page]);

  // ============================================================
  // ERROR MESSAGE MAPPER
  // ============================================================
  //
  // This converts HTTP / backend errors into useful messages.
  //
  // You can extend this once your FastAPI backend reason codes
  // are finalized.
  // ============================================================

  const getAnalysisErrorMessage = (status, backendData) => {
    /*
     * BEST OPTION:
     *
     * Backend returns:
     *
     * {
     *   "reason_code": "TRANSPORT_NOT_FOUND",
     *   "message": "Transport DS4K900123 was not found."
     * }
     */

    const reasonCode =
      backendData?.reason_code || backendData?.code || backendData?.error_code;

    const backendMessage = backendData?.message || backendData?.detail;

    // ----------------------------------------------------------
    // REASON CODES
    // ----------------------------------------------------------

    switch (reasonCode) {
      case "TRANSPORT_NOT_FOUND":
        return (
          backendMessage ||
          "The transport request could not be found in the selected SAP system."
        );

      default:
        break;
    }

    // ----------------------------------------------------------
    // HTTP FALLBACKS
    // ----------------------------------------------------------

    switch (status) {
      case 400:
        return backendMessage || "The transport analysis request is invalid.";

      default:
        return backendMessage || "Transport analysis could not be completed.";
    }
  };

  // ============================================================
  // ANALYZE
  // ============================================================

  const handleAnalyze = async (transportRequest, retrySystem = null) => {
    const normalizedTransport = transportRequest?.trim().toUpperCase();

    const targetSystem = retrySystem || selectedSystem;

    // ==========================================================
    // VALIDATION
    // ==========================================================

    if (!normalizedTransport) {
      setError("Please enter a transport request.");

      return;
    }

    if (!targetSystem) {
      setError("Please select an SAP system.");

      return;
    }

    // ==========================================================
    // STORE REQUEST
    // ==========================================================

    lastRequestRef.current = {
      transportRequest: normalizedTransport,

      system: targetSystem,
    };

    setAnalysisContext({
      transportRequest: normalizedTransport,

      system: targetSystem,
    });

    // ==========================================================
    // SHOW LOADING PAGE IMMEDIATELY
    // ==========================================================

    setError(null);
    setReviewData(null);
    setLoading(true);
    setElapsed(0);
    setPage("loading");

    try {
      // ========================================================
      // DUMMY / DEMO MODE
      // ========================================================
      //
      // This deliberately takes 10 seconds so you can see the
      // complete loading experience.
      // ========================================================

      await new Promise((resolve) => setTimeout(resolve, 10000));

      const result = JSON.parse(JSON.stringify(dummyTransportData));

      result.transport_request = normalizedTransport;

      result.system = targetSystem;

      setReviewData(result);

      setPage("review");

      // ========================================================
      // REAL API VERSION
      // ========================================================
      //
      // When ready:
      //
      // 1. Remove/comment the dummy block above.
      // 2. Uncomment this block.
      //
      // IMPORTANT:
      // Do NOT add a 10-second delay to the real API unless you
      // deliberately want the user to wait after data is ready.
      // ========================================================

      /*
      const response = await fetch(
        "http://localhost:7888/api/review/transport/",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            transport_request:
              normalizedTransport,

            system:
              targetSystem,
          }),
        }
      );

      // ------------------------------------------
      // READ RESPONSE
      // ------------------------------------------

      let responseData = null;

      try {
        responseData =
          await response.json();
      } catch {
        responseData = null;
      }

      // ------------------------------------------
      // BACKEND FAILURE
      // ------------------------------------------

      if (!response.ok) {
        throw new Error(
          getAnalysisErrorMessage(
            response.status,
            responseData
          )
        );
      }

      // ------------------------------------------
      // OPTIONAL BACKEND-LEVEL FAILURE
      // ------------------------------------------
      //
      // Useful if backend returns HTTP 200 but:
      //
      // {
      //   success: false,
      //   reason_code: "...",
      //   message: "..."
      // }
      // ------------------------------------------

      if (
        responseData?.success === false
      ) {
        throw new Error(
          getAnalysisErrorMessage(
            response.status,
            responseData
          )
        );
      }

      // ------------------------------------------
      // SUCCESS
      // ------------------------------------------

      setReviewData(
        responseData
      );

      setPage("review");
      */
    } catch (err) {
      console.error("Transport analysis failed:", err);

      /*
       * IMPORTANT:
       *
       * We DO NOT navigate back home.
       *
       * page remains:
       *
       * "loading"
       *
       * Therefore AnalysisLoading changes from its loading
       * presentation into its error presentation.
       */

      setError(err?.message || "Transport analysis could not be completed.");
      setError("Transport analysis could not be completed.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RETRY
  // ============================================================

  const handleRetry = () => {
    const request = lastRequestRef.current;

    if (!request) {
      setPage("home");
      return;
    }

    handleAnalyze(request.transportRequest, request.system);
  };

  // ============================================================
  // BACK FROM ERROR
  // ============================================================

  const handleAnalysisBack = () => {
    setError(null);
    setLoading(false);
    setElapsed(0);
    setPage("home");
  };

  // ============================================================
  // NEW TRANSPORT
  // ============================================================

  const handleNewTransport = () => {
    setReviewData(null);
    setError(null);
    setElapsed(0);
    setPage("home");
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <Header connected={connected} checkingConnection={checkingConnection} />
      {/* ======================================================
          HOME
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
          ANALYSIS / LOADING / ERROR
      ====================================================== */}

      {page === "loading" && (
        <AnalysisLoading
          transportRequest={analysisContext.transportRequest}
          system={analysisContext.system}
          elapsed={elapsed}
          error={error}
          onRetry={handleRetry}
          onBack={handleAnalysisBack}
        />
      )}
      {/* ======================================================
          REVIEW
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
