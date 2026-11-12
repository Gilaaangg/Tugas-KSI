export default function PublicLayout({ children }) {
  // App owns the single global navbar/footer. This wrapper only preserves
  // the page contract used by public pages and avoids duplicate chrome.
  return children;
}
