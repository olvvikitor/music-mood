import Image from "next/image";

export function AppBrand({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center ${className}`}>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex-shrink-0">
                <Image
                    src="/app_logo/dark mode.png"
                    alt="Logo"
                    fill
                    className="object-contain drop-shadow-md block dark-logo"
                />
                <Image
                    src="/app_logo/white mode.png"
                    alt="Logo"
                    fill
                    className="object-contain drop-shadow-md hidden light-logo"
                />
            </div>
        </div>
    );
}

