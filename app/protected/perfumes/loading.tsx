export default function LoadingPerfumes() {
    return (
        <div className="flex flex-col gap-6 animate-pulse">
            <div>
                <div className="h-9 w-40 rounded bg-muted" />
                <div className="mt-2 h-5 w-64 rounded bg-muted" />
            </div>

            <div className="h-10 w-full rounded-md bg-muted" />

            <div className="h-10 w-full rounded-md bg-muted" />

            <div className="space-y-3">
                <div className="h-20 rounded-xl bg-muted" />
                <div className="h-20 rounded-xl bg-muted" />
                <div className="h-20 rounded-xl bg-muted" />
            </div>
        </div>
    );
}