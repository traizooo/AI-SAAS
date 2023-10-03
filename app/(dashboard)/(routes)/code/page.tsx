"use client";

import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionRequestMessage } from "openai";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import ReactMarkdown from 'react-markdown'
import { EmptyCode } from "@/components/emptyCode";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";

const CodePage = () => {
    const proModal = useProModal();

    const placeholders = [
        "Generate a basic HTML page with a doctype, <html>, <head>, and <body> elements.",
        "Create a JavaScript function that adds two numbers and returns the result.",
        "Generate CSS code for a flexbox layout with three div elements horizontally aligned.",
        "Create a Python class named 'Person' with attributes for 'name' and 'age'.",
        "Write an SQL query to retrieve all records from a 'users' table.",
        "Create a React functional component called 'Button' that renders a button element.",
        "Write Java code to generate a random integer between 1 and 100.",
        "Create a PHP form that accepts user input for 'name' and 'email' and submits to 'process.php'.",
        "Generate a TypeScript interface named 'Product' with properties 'id', 'name', and 'price'.",
        "Write a Bash script that lists all files in the current directory.",
        "Create a C# class called 'Car' with properties 'Make', 'Model', and 'Year'.",
        "Generate an Angular component named 'ProductList' that displays a list of products.",
        "Write a Swift function called 'calculateArea' that calculates the area of a rectangle.",
        "Create a Ruby module named 'MathUtils' with a method for finding the factorial of a number.",
        "Generate a Dockerfile for a Node.js application with necessary dependencies.",
        "Write a PowerShell script that renames all .txt files in a directory.",
        "Create an Android Activity named 'MainActivity' with a layout file 'activity_main.xml'.",
        "Generate a GraphQL query to retrieve a user's profile information.",
        "Write a Perl script that counts the number of lines in a text file.",
        "Create a Vue.js component called 'Counter' that increments and displays a counter value."
        // Add more prompts as needed
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

             const response = await axios.post("/api/code", {
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
            console.log(error);
        } finally {
            router.refresh();
        }
    }

    return (
        <div>
            <Heading
                title="Code Generation"
                description="Generate code using the newest AI tools."
                icon={Code}
                iconColor="text-green-700"
                bgColor="bg-green-700/10"
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
                        <EmptyCode label="No code generated." />
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message) => (
                            <div 
                                key={message.content}
                                className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg", message.role === "user" ? "bg-white border border-black/10" : "bg-muted")}
                            >
                                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                <ReactMarkdown
                                    components={{
                                        pre: ({ node, ...props }) => (
                                            <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                <pre {...props} />
                                            </div>
                                        ),
                                        code: ({ node, ...props }) => (
                                            <code className="bg-black/10 rounded-lg p-1" {...props}/>
                                        )
                                    }}
                                    className="text-sm overflow-hidden leading-7"
                                >
                                    {message.content || ""}
                                </ReactMarkdown>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CodePage;