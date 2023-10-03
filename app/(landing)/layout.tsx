const LandingLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return(
        <main className="h-full bg-gradient-to-r from-blue-600 via-purple-900 to-red-900 overflow-auto">
            <div className="mx-auto max-w-screen-xl h-full w-full">
                {children}
            </div>
        </main>
    );
}

export default LandingLayout;