/** The PeopleHub logo with a transparent background — light wordmark on the dark theme, black wordmark on the light one. */
export const logoSrc = () => (document.documentElement.dataset.theme === 'light' ? './logo-black.png' : './logo-light.png')

export function PHLogo({ className = '', glow = true }: { className?: string; glow?: boolean }) {
  return <img src={logoSrc()} alt="PeopleHub" className={`flex-none object-contain ${className}`} style={glow ? { filter: 'drop-shadow(0 0 16px rgba(59,107,224,.5))' } : undefined} />
}
