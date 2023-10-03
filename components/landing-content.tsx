"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonials = [
    {
        name: "Sarah",
        avatar: "S",
        title: "Marketing Manager",
        description: "I'm amazed by the capabilities of this AI application. It has greatly improved our marketing strategies."
    },
    {
        name: "John",
        avatar: "J",
        title: "Data Scientist",
        description: "As a data scientist, I find this AI application extremely helpful in data analysis. It saves me a lot of time!"
    },
    {
        name: "Emily",
        avatar: "E",
        title: "Graphic Designer",
        description: "This AI application has revolutionized my design workflow. It's a game-changer for designers like me."
    },
    {
        name: "David",
        avatar: "D",
        title: "Sales Representative",
        description: "I've seen a significant increase in sales since using this AI application. It's a must-have for any sales team."
    },
];

export const LandingContent = () => {
    return (
        <div className="px-10 pb-20">
            <h2 className="text-center text-4xl text-white font-extrabold mb-10">
                Testimonials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {testimonials.map((item) => (
                    <Card key={item.description} className="bg-[#192339] border-none text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <div>
                                    <p className="text-lg">{item.name}</p>
                                    <p className="text-zinc-400 text-sm">{item.title}</p>
                                </div>
                            </CardTitle>
                            <CardContent className="pt-4 px-0">
                                {item.description}
                            </CardContent>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}