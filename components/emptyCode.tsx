import Image from "next/image";

interface EmptyProps {
    label: string;
}

export const EmptyCode = ({
    label
}: EmptyProps) => {
    return (
        <div className="h-full p-20 flex flex-col items-center justify-center">
            <div className="relative h-72 w-72">
                <Image 
                    alt="Empty"
                    fill
                    src="/emptyCode.png"
                />
            </div>
            <p className="text-muted-foreground text-sm text-center p-8">
                {label}
            </p>
        </div>
    );
}