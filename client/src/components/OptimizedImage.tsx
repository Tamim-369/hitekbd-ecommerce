export function OptimizedImage({ src, alt, className }: {
    src: string;
    alt: string;
    className?: string;
}) {
    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            className={className}
            onError={(e) => {
                const target = e.currentTarget;
                // Only set fallback if it's not already the fallback image
                if (!target.src.endsWith('/fallback.png')) {
                    target.src = '/fallback.png';
                }
            }}
        />
    );
}
