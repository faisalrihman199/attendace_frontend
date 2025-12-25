import React from 'react';
import './ComingSoon.css';
import { BsChatDots } from 'react-icons/bs';
import { AiOutlineRocket } from 'react-icons/ai';

const ComingSoon = () => {
  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        

        {/* Main Content */}
        <div className="coming-soon-card">
          {/* Animated Icon */}
          <div className="icon-wrapper">
            <div className="icon-circle pulse-animation">
              <BsChatDots className="chat-icon" />
            </div>
            <div className="icon-glow"></div>
          </div>

          {/* Rocket Icon */}
          <div className="rocket-container">
            <AiOutlineRocket className="rocket-icon" />
          </div>

          {/* Text Content */}
          <h1 className="coming-soon-title">
            <span className="gradient-text">Chat Feature</span>
          </h1>
          
          <h2 className="coming-soon-subtitle">
            Coming Very Soon!
          </h2>

          <p className="coming-soon-description">
            We're working hard to bring you an amazing real-time chat experience. 
            Connect with your team, athletes, and parents seamlessly.
          </p>

          {/* Feature Pills */}
          <div className="feature-pills">
            <div className="pill pill-1">
              <span className="pill-icon">💬</span>
              Real-time Messaging
            </div>
            <div className="pill pill-2">
              <span className="pill-icon">👥</span>
              Group Chats
            </div>
            <div className="pill pill-3">
              <span className="pill-icon">📎</span>
              File Sharing
            </div>
            <div className="pill pill-4">
              <span className="pill-icon">🔔</span>
              Instant Notifications
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-label">
              <span>Development Progress</span>
              <span className="progress-percentage">85%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
              <div className="progress-shimmer"></div>
            </div>
          </div>

          {/* CTA Button */}
          <button className="notify-button">
            <span className="button-text">Get Notified When Ready</span>
            <span className="button-shimmer"></span>
          </button>

          {/* Bottom Text */}
          <p className="coming-soon-footer">
            Stay tuned for updates! This feature is being crafted with care.
          </p>
        </div>

        {/* Animated Dots */}
        <div className="loading-dots">
          <span className="dot dot-1"></span>
          <span className="dot dot-2"></span>
          <span className="dot dot-3"></span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
