# Advanced EV Battery Diagnostics

A modern, AI-powered Minimum Viable Product (MVP) for a diagnostic platform for EV batteries, tailored for the Indian 2/3-wheeler market. This application provides real-time visualization of battery cell health, uses machine learning for anomaly detection, and leverages the Google Gemini API for intelligent repair suggestions.

## Key Features

- **Real-Time Data Visualization**: Live streaming of battery pack data, including individual cell voltages and internal resistance, visualized in an intuitive and responsive chart.
- **AI-Powered Anomaly Detection**: Utilizes a k-means clustering algorithm to automatically identify and flag cells that are behaving abnormally compared to the rest of the pack.
- **Detailed Cell-Level Analysis**: Click on any cell in the chart to get a detailed breakdown of its metrics, including voltage, resistance, and Z-score.
- **AI Assistant (Gemini-Powered)**: For any anomalous cell, get instant, actionable repair and diagnostic suggestions from an expert AI assistant powered by the Google Gemini API.
- **Scan History & Session Management**: Stop a live scan to save a snapshot of the battery's state. Review, compare, and clear past diagnostic sessions.
- **Modern, "Vibe Coded" UI**: A sleek, high-contrast dark theme designed for clarity and a futuristic aesthetic, built with Tailwind CSS.

## Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Charting**: Recharts
- **AI Integration**: Google Gemini API (`@google/genai`)

## Getting Started

This is a client-side only application and can be run by serving the files with any simple web server.

### Using the AI Assistant

The AI Assistant feature requires a Google Gemini API key.

1.  Obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  In the application, click the **"Set API Key"** button in the top-right corner of the header.
3.  Paste your API key into the modal and click "Save".
4.  The key will be saved in your browser's local storage for future sessions.

You can now select an anomalous cell and click "Get Repair Suggestion" to interact with the AI assistant.

## File Structure

- `/components`: Contains all the React components that make up the UI.
- `/services`: Houses the logic for external interactions, such as the mock battery data stream, scan history management, and the AI assistant service.
- `/utils`: Includes utility functions for calculations, data processing, and algorithms (like k-means clustering).
- `/types.ts`: Defines the core TypeScript types and interfaces used throughout the application.
