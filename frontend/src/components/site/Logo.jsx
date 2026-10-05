export const Logo = ({ testId = "brand-logo", className = "h-9 sm:h-11" }) => (
  <a href="/" data-testid={testId} className="group flex items-center" aria-label="Wypożyczalnia JaroSpeedRent — strona główna">
    <img src="/img/logo.png" alt="Jaro Speed Rent" className={`${className} w-auto transition-transform duration-500 group-hover:translate-x-1`} />
  </a>
);
