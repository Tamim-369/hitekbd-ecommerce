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
                e.currentTarget.src = '/fallback.png';
            }}
        />
    );
}
