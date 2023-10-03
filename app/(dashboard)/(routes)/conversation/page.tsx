"use client";

import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionRequestMessage } from "openai";
import { EmptyConversation } from "@/components/emptyConversation";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";

const ConverstionPage = () => {
    const proModal = useProModal();

    const placeholders = [
        "Can you explain the concept of black holes and their influence on surrounding space?",
        "What are the fundamental principles of quantum mechanics?",
        "How does photosynthesis work in plants?",
        "Explain the theory of relativity in simple terms.",
        "How do computers execute programs through machine code?",
        "Discuss the major events of World War II and their impact.",
        "Explain the process of how stars are formed and evolve.",
        "What is the role of the United Nations in maintaining global peace?",
        "Discuss the key elements of a healthy lifestyle, including diet and exercise.",
        "Explain the difference between classical and operant conditioning in psychology.",
        "How does globalization affect economies and cultures?",
        "Discuss the causes and consequences of the Industrial Revolution.",
        "Explain the structure and function of the human cardiovascular system.",
        "What is the importance of the periodic table in chemistry?",
        "Discuss the principles of supply and demand in economics.",
        "Explain the concept of civil rights and their historical context.",
        "How do different forms of government, like democracy and monarchy, work?",
        "Discuss the impact of social media on communication and society.",
        "Explain the process of artistic creativity and its significance.",
        "What is the role of the immune system in protecting the body from diseases?"
        // Add more placeholders as needed
    ];    

    // Generate a random index between 0 and the length of the placeholders array
    const randomIndex = Math.floor(Math.random() * placeholders.length);

    // Use the randomly selected placeholder
    const randomPlaceholder = placeholders[randomIndex];

    const router = useRouter();

    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionRequestMessage = { 
                role: "user",
                content: values.prompt,
             };
             const newMessages = [...messages, userMessage];

             const response = await axios.post("/api/conversation", {
                messages: newMessages,
             });

             setMessages((current) => [...current, userMessage, response.data])

             form.reset();
        } catch (error: any) {
            if(error?.response?.status === 403) {
                proModal.onOpen();
            } else {
                toast.error("Something went wrong...")
            }
        } finally {
            router.refresh();
        }
    }

    return (
        <div>
            <Heading
                title="Conversation"
                description="Our most advanced conversation model."
                icon={MessageSquare}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input 
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder={randomPlaceholder}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && (
                        <EmptyConversation label="No conversation started." />
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message) => (
                            <div 
                                key={message.content}
                                className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg", message.role === "user" ? "bg-white border border-black/10" : "bg-muted")}
                            >
                                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                <p className="text-sm">
                                    {message.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConverstionPage;