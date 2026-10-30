/**
 * Runs before paint to apply the stored theme + language, avoiding a flash.
 * Kept tiny and dependency-free; the interactive toggles live in client components.
 */
const script = `
(function () {
  try {
    var t = localStorage.getItem('tripsavor:theme');
    var dark = t === 'dark' || (t !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', !!dark);
    // The store saves JSON, so the value is the string "ur" including quotes.
    var lang = JSON.parse(localStorage.getItem('tripsavor:lang') || 'null');
    if (lang === 'ur') {
      document.documentElement.setAttribute('lang', 'ur');
      document.documentElement.setAttribute('dir', 'rtl');
    }
  } catch (e) {}
})();
`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
