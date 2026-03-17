import { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { askLlama } from "../api/llama";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickReplies = [
    "✈️ Beach Destinations",
    "🏔️ Mountain Getaways",
    "🌆 City Adventures",
  ];

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const extractDestination = (text) => {
    const knownPlaces = [
      "Paris",
      "London",
      "Rome",
      "Dubai",
      "New York",
      "Tokyo",
      "Bali",
      "Barcelona",
      "Amsterdam",
      "Maldives",
      "Switzerland",
      "Thailand",
      "Singapore",
      "Malaysia",
      "Vietnam",
      "Iceland",
      "Goa",
      "Kerala",
      "Mumbai",
      "Delhi",
      "Bangalore",
      "Jaipur",
      "Manali",
      "Shimla",
      "Udaipur",
      "Kashmir",
      "Ladakh",
      "Rishikesh",
    ];

    for (const place of knownPlaces) {
      if (new RegExp(`\\b${place}\\b`, "i").test(text)) {
        return place;
      }
    }

    const patterns = [
      /(?:visit|trip to|travel to|tell me about|places in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1];
    }

    return null;
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { text, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const conversationHistory = [...messages, userMessage].map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const botText = await askLlama(text, conversationHistory);
      let images = [];
      let links = null;
      let imageSource = null;
      let destinationMatch =
        extractDestination(text) || extractDestination(botText);

      if (destinationMatch) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/images/${encodeURIComponent(destinationMatch)}`,
          );
          const data = await response.json();

          if (data.images && data.images.length > 0) {
            images = data.images;
            imageSource = data.source;
          }
        } catch {
          images = [
            `https://picsum.photos/800/600?random=${destinationMatch}1`,
            `https://picsum.photos/800/600?random=${destinationMatch}2`,
            `https://picsum.photos/800/600?random=${destinationMatch}3`,
            `https://picsum.photos/800/600?random=${destinationMatch}4`,
          ];
          imageSource = "fallback";
        }

        links = {
          maps: `https://www.google.com/maps/search/${encodeURIComponent(destinationMatch)}`,
          hotels: `https://www.google.com/maps/search/hotels+in+${encodeURIComponent(destinationMatch)}`,
          restaurants: `https://www.google.com/maps/search/restaurants+in+${encodeURIComponent(destinationMatch)}`,
          attractions: `https://www.google.com/maps/search/tourist+attractions+in+${encodeURIComponent(destinationMatch)}`,
          booking: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destinationMatch)}`,
          weather: `https://www.google.com/search?q=weather+in+${encodeURIComponent(destinationMatch)}`,
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          text: botText,
          sender: "bot",
          images,
          links,
          destination: destinationMatch,
          imageSource,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm having trouble connecting. Please try again! 🔄",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(79, 70, 229, 0.4), 
                        0 0 40px rgba(37, 99, 235, 0.3); 
          }
          50% { 
            box-shadow: 0 0 30px rgba(79, 70, 229, 0.6), 
                        0 0 60px rgba(37, 99, 235, 0.5); 
          }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        .chat-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          animation: glow 3s ease-in-out infinite;
        }
                .chat-window {
                  position: fixed;
                  bottom: 110px;
                  right: 24px;
                  width: min(440px, 92vw);
                  height: min(650px, 75vh);
                }

                @media (max-width: 600px) {
                  .chat-button {
                    bottom: 16px;
                    right: 16px;
                    width: 56px;
                    height: 56px;
                  }

                  .chat-window {
                    left: 12px;
                    right: 12px;
                    bottom: 88px;
                    width: auto;
                    height: min(70vh, 520px);
                  }
                }

                @media (max-width: 380px) {
                  .chat-button {
                    width: 52px;
                    height: 52px;
                    bottom: 12px;
                    right: 12px;
                  }

                  .chat-window {
                    left: 8px;
                    right: 8px;
                    bottom: 72px;
                    height: min(66vh, 500px);
                  }
                }
        
        .chat-button:hover {
          animation: glow 1.5s ease-in-out infinite, float 2s ease-in-out infinite;
        }

        .message-enter {
          animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .link-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .link-button:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .slick-dots li button:before {
          color: #4f46e5 !important;
        }

        .slick-dots li.slick-active button:before {
          color: #2563eb !important;
        }
      `}</style>

      {/* Floating Button - Matches Header Style */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="chat-button"
        style={{
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 9999,
          border: "3px solid rgba(255, 255, 255, 0.4)",
        }}
      >
        {!isOpen ? (
          <div style={{ position: "relative" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7117 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92176 4.44061 8.37485 5.27072 7.03255C6.10083 5.69025 7.28825 4.60557 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                width: 12,
                height: 12,
                background: "#10b981",
                borderRadius: "50%",
                border: "2px solid white",
              }}
            />
          </div>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      {/* Chat Window - Matches Header Design */}
      {isOpen && (
        <div
          className="glass-effect chat-window"
          style={{
            borderRadius: 24,
            display: "flex",
            flexDirection: "column",
            zIndex: 9998,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            animation: "slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            overflow: "hidden",
          }}
        >
          {/* Header - Same gradient as your header */}
          <div
            style={{
              background: "linear-gradient(to right, #2563eb, #4f46e5)",
              padding: "24px",
              borderRadius: "24px 24px 0 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <span style={{ fontSize: 24 }}>✈️</span>
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "white",
                    letterSpacing: "-0.02em",
                  }}
                >
                  AI Travel Assistant
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 500,
                    marginTop: 2,
                  }}
                >
                  ✨ Powered by TravelPlanner
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 24,
              background: "linear-gradient(to bottom, #f8fafc, #f1f5f9)",
            }}
          >
            {messages.length === 0 && (
              <div style={{ textAlign: "center", marginTop: 100 }}>
                <div
                  style={{
                    width: 100,
                    height: 100,
                    margin: "0 auto 24px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "float 3s ease-in-out infinite",
                  }}
                >
                  <span style={{ fontSize: 50 }}>🌍</span>
                </div>
                <h3
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    margin: "0 0 12px",
                    background: "linear-gradient(to right, #2563eb, #4f46e5)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Hey there, Traveler!
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: "#64748b",
                    lineHeight: 1.6,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  I'm your AI travel companion.
                  <br />
                  Ask me about any destination! 🌏
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className="message-enter"
                style={{
                  textAlign: msg.sender === "bot" ? "left" : "right",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    borderRadius: 20,
                    display: "inline-block",
                    background:
                      msg.sender === "bot"
                        ? "white"
                        : "linear-gradient(to right, #2563eb, #4f46e5)",
                    color: msg.sender === "bot" ? "#1e293b" : "white",
                    maxWidth: "85%",
                    wordWrap: "break-word",
                    boxShadow:
                      msg.sender === "bot"
                        ? "0 4px 16px rgba(0, 0, 0, 0.08)"
                        : "0 8px 24px rgba(79, 70, 229, 0.4)",
                    fontSize: 15,
                    lineHeight: 1.7,
                    fontWeight: 500,
                  }}
                >
                  {msg.text}
                </div>

                {msg.images && msg.images.length > 0 && (
                  <div style={{ marginTop: 16, maxWidth: "92%" }}>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                        marginBottom: 10,
                        fontWeight: 600,
                      }}
                    >
                      📸 {msg.destination}
                      {msg.imageSource === "pexels" && " • Real Photos"}
                    </div>
                    <Slider {...sliderSettings}>
                      {msg.images.map((imgUrl, idx) => (
                        <div key={idx}>
                          <img
                            src={imgUrl}
                            alt={`Photo ${idx + 1}`}
                            style={{
                              width: "100%",
                              height: 260,
                              objectFit: "cover",
                              borderRadius: 16,
                              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                            }}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                )}

                {msg.links && (
                  <div
                    style={{
                      marginTop: 16,
                      background: "white",
                      padding: 18,
                      borderRadius: 16,
                      maxWidth: "92%",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        marginBottom: 14,
                        fontSize: 15,
                        color: "#1e293b",
                      }}
                    >
                      🔗 Explore {msg.destination}
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10,
                      }}
                    >
                      {[
                        {
                          href: msg.links.maps,
                          icon: "📍",
                          text: "Maps",
                          bg: "linear-gradient(135deg, #2563eb, #4f46e5)",
                        },
                        {
                          href: msg.links.weather,
                          icon: "🌤️",
                          text: "Weather",
                          bg: "linear-gradient(135deg, #10b981, #059669)",
                        },
                        {
                          href: msg.links.hotels,
                          icon: "🏨",
                          text: "Hotels",
                          bg: "linear-gradient(135deg, #f59e0b, #d97706)",
                        },
                        {
                          href: msg.links.restaurants,
                          icon: "🍽️",
                          text: "Food",
                          bg: "linear-gradient(135deg, #ef4444, #dc2626)",
                        },
                        {
                          href: msg.links.attractions,
                          icon: "🎯",
                          text: "Places",
                          bg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                        },
                        {
                          href: msg.links.booking,
                          icon: "💼",
                          text: "Book",
                          bg: "linear-gradient(135deg, #06b6d4, #0891b2)",
                        },
                      ].map((link, idx) => (
                        <a
                          key={idx}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="link-button"
                          style={{
                            padding: "12px",
                            background: link.bg,
                            color: "white",
                            textDecoration: "none",
                            borderRadius: 12,
                            fontSize: 14,
                            fontWeight: 700,
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                          }}
                        >
                          <span>{link.icon}</span>
                          <span>{link.text}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="message-enter" style={{ textAlign: "left" }}>
                <div
                  style={{
                    padding: "16px 20px",
                    borderRadius: 20,
                    display: "inline-block",
                    background: "white",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#2563eb",
                        animation: "float 1s ease-in-out infinite",
                      }}
                    />
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#4f46e5",
                        animation: "float 1s ease-in-out 0.2s infinite",
                      }}
                    />
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#6366f1",
                        animation: "float 1s ease-in-out 0.4s infinite",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div
            style={{
              padding: "16px 20px",
              background: "white",
              borderTop: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#64748b",
                marginBottom: 10,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Quick Start
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {quickReplies.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q.replace(/[✈️🏔️🌆]/g, "").trim())}
                  disabled={loading}
                  className="link-button"
                  style={{
                    flex: "1 1 auto",
                    minWidth: "96px",
                    padding: "10px 16px",
                    fontSize: 13,
                    borderRadius: 12,
                    background: loading
                      ? "#e2e8f0"
                      : "linear-gradient(to right, #2563eb, #4f46e5)",
                    color: "white",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: 700,
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input - Same style as header buttons */}
          <div
            style={{
              padding: "20px",
              background: "white",
              borderRadius: "0 0 24px 24px",
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage(input)
                }
                placeholder="Ask me anything..."
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "16px 20px",
                  borderRadius: 999,
                  border: "2px solid #e2e8f0",
                  outline: "none",
                  fontSize: 15,
                  fontWeight: 500,
                  transition: "all 0.3s",
                  background: "#f8fafc",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4f46e5";
                  e.target.style.background = "white";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.background = "#f8fafc";
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                style={{
                  padding: "16px 28px",
                  background:
                    loading || !input.trim()
                      ? "#e2e8f0"
                      : "linear-gradient(to right, #2563eb, #4f46e5)",
                  color: "white",
                  border: "none",
                  borderRadius: 999,
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  fontSize: 18,
                  transition: "all 0.3s",
                  boxShadow:
                    loading || !input.trim()
                      ? "none"
                      : "0 4px 16px rgba(79, 70, 229, 0.3)",
                }}
                onMouseEnter={(e) => {
                  if (!loading && input.trim()) {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
