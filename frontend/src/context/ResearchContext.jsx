import { createContext, useContext, useState } from "react";

const ResearchContext = createContext();

export function ResearchProvider({ children }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [gaps, setGaps] = useState(null);
  const [report, setReport] = useState(null);
  const [messages, setMessages] = useState([]);

  return (
    <ResearchContext.Provider
      value={{
        uploadedFile,
        setUploadedFile,
        summary,
        setSummary,
        gaps,
        setGaps,
        report,
        setReport,
        messages,
        setMessages,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch() {
  return useContext(ResearchContext);
}