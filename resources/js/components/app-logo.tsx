import AppLogoIcon from './app-logo-icon';

interface AppLogoProps {
    className?: string;
}

export default function AppLogo({ className }: AppLogoProps) {
    return (
        <>
            <div
                className={
                    className || 'bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md'
                }
            >
                <AppLogoIcon />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-semibold leading-tight">Cigi Global</span>
            </div>
        </>
    );
}
