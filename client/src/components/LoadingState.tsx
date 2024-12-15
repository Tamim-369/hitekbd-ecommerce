import { Skeleton } from "./Skeleton";


export default function LoadingState() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-40" />
            </div>
        </div>
    );
}


