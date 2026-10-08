"use client";

type SmartReviewProps = {
  businessName: string;
  googleReviewUrl: string | null;
};

export default function SmartReview({
  businessName,
  googleReviewUrl,
}: SmartReviewProps) {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#fffdf8",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "white",
          border: "3px solid #202124",
          borderRadius: "30px",
          padding: "30px",
          boxShadow: "8px 8px 0 #4285f4",
        }}
      >
        <div style={{ fontSize: "40px" }}>👋 ✨</div>

        <p
          style={{
            fontSize: "13px",
            fontWeight: 800,
            color: "#4285f4",
            letterSpacing: "1px",
          }}
        >
          SMART REVIEW
        </p>

        <h1
          style={{
            fontSize: "42px",
            lineHeight: 1,
            margin: "15px 0",
          }}
        >
          How was your
          <br />
          experience?
        </h1>

        <p style={{ color: "#666", fontSize: "17px" }}>
          You visited
        </p>

        <h2>{businessName}</h2>

        <div
          style={{
            display: "flex",
            gap: "8px",
            margin: "25px 0",
            fontSize: "45px",
          }}
        >
          ⭐⭐⭐⭐⭐
        </div>

        <button
          style={{
            width: "100%",
            padding: "17px",
            borderRadius: "16px",
            border: "2px solid #202124",
            background: "#4285f4",
            color: "white",
            fontWeight: 800,
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => alert("Review system is working!")}
        >
          ✨ Start my review
        </button>

        <p
          style={{
            marginTop: "25px",
            fontSize: "12px",
            color: "#777",
          }}
        >
          Google Review: {googleReviewUrl || "Not configured"}
        </p>
      </div>
    </main>
  );
}