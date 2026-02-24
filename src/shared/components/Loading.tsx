export default function LoadingComponent() {
    return (
        <div className="flex flex-col gap-4 animate-pulse pt-2">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 bg-white/5 rounded-md w-full"></div>
            ))}
        </div>
    )
}