import iconDark from "../assets/logo/logo-finnomena-icon-dark.svg";
import iconLight from "../assets/logo/logo-finnomena-icon-light.svg";
import textDark from "../assets/logo/logo-finnomena-text-dark.svg";
import textLight from "../assets/logo/logo-finnomena-text-light.svg";

type LogoProps = {
  variant?: "full" | "icon";
  tone?: "light" | "dark";
};

const assets = {
  full: { light: textLight, dark: textDark },
  icon: { light: iconLight, dark: iconDark },
};

/** Canonical Finnomena wordmark and compact mark. */
export function Logo({ variant = "full", tone = "light" }: LogoProps) {
  const isFull = variant === "full";

  return (
    <a href="https://www.finnomena.com" target="_blank" rel="noopener noreferrer">
      <img
        src={assets[variant][tone]}
        alt="Finnomena"
        width={isFull ? 136 : 32}
        height={32}
        style={{ display: "block" }}
      />
    </a>
  );
}
