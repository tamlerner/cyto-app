interface AuthBackgroundProps {
  expanded?: boolean;
  repeat?: boolean;
  cover?: boolean;
}

export function AuthBackground({ expanded, repeat, cover }: AuthBackgroundProps) {
  return (
    <div className={`fixed inset-0 ${expanded ? 'h-full' : 'h-screen'} overflow-hidden -z-10`}>
      <div className="grid grid-cols-3 gap-0">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="w-96 h-96 opacity-5">
            <svg
              className="w-full h-full"
              style={{ 
                animation: `spin 4s linear infinite`,
                animationDelay: `${index * 0.3}s`
              }}
              viewBox="0 0 2834.65 2834.65"
            >
              <g>
                <path className="stroke-primary" strokeWidth="55" strokeLinecap="round" strokeMiterlimit="10" d="M1039.66,1895.84"/>
                <path 
                  className="stroke-primary"
                  style={{ 
                    animation: `drawPath 2s ease-in-out infinite`,
                    animationDelay: `${index * 0.3}s`
                  }}
                  strokeWidth="55" 
                  strokeLinecap="round" 
                  strokeMiterlimit="10" 
                  d="M1834.29,989.78C1725.7,884.56,1577.67,819.8,1414.52,819.8c-333.2,0-603.3,270.11-603.3,603.3
                  c0,139.42,47.29,267.79,126.7,369.95"
                />
                <path className="stroke-primary" strokeWidth="55" strokeLinecap="round" strokeMiterlimit="10" d="M1839.85,1850.96"/>
                <path 
                  className="stroke-primary"
                  style={{ 
                    animation: `drawPath 2s ease-in-out infinite`,
                    animationDelay: `${index * 0.3 + 0.2}s`
                  }}
                  strokeWidth="55" 
                  strokeLinecap="round" 
                  strokeMiterlimit="10" 
                  d="M1039.66,1895.84c102.94,81.74,233.2,130.56,374.86,130.56c163.71,0,312.19-65.21,420.88-171.06"
                />
                <path 
                  className="stroke-primary"
                  style={{ 
                    animation: `drawPath 2s ease-in-out infinite`,
                    animationDelay: `${index * 0.3 + 0.4}s`
                  }}
                  strokeWidth="55" 
                  strokeLinecap="round" 
                  strokeMiterlimit="10" 
                  d="M1154.91,1260.17c-29.68,47.2-46.85,103.06-46.85,162.93c0,169.26,137.21,306.47,306.47,306.47
                  c85.65,0,163.1-35.14,218.71-91.79"
                />
                <path className="stroke-primary" strokeWidth="55" strokeLinecap="round" strokeMiterlimit="10" d="M1154.91,1260.17"/>
                <path 
                  className="stroke-primary"
                  style={{ 
                    animation: `drawPath 2s ease-in-out infinite`,
                    animationDelay: `${index * 0.3 + 0.6}s`
                  }}
                  strokeWidth="55" 
                  strokeLinecap="round" 
                  strokeMiterlimit="10" 
                  d="M1632.06,1207.24c-55.52-55.95-132.49-90.6-217.54-90.6c-60.62,0-117.14,17.6-164.71,47.98"
                />
                <circle 
                  className="fill-primary/20"
                  style={{ 
                    animation: `pulse 2s ease-in-out infinite`,
                    animationDelay: `${index * 0.3 + 0.8}s`
                  }}
                  cx="1414.52" 
                  cy="1423.1" 
                  r="147.98"
                />
              </g>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}