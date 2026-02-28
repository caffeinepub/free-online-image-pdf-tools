import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ToolUsage {
    usageCount: bigint;
    toolName: string;
}
export interface BlogPost {
    title: string;
    content: string;
    relatedTools: Array<string>;
    date: string;
    author: string;
    category: string;
}
export interface DailyAnalytics {
    date: string;
    visitorCount: bigint;
    toolUsage: Array<ToolUsage>;
}
export interface backendInterface {
    addBlogPost(title: string, content: string, author: string, date: string, category: string, relatedTools: Array<string>): Promise<void>;
    addContactMessage(name: string, email: string, message: string): Promise<void>;
    getBlogPostsByCategory(category: string): Promise<Array<BlogPost>>;
    getBlogPostsSortedByDate(): Promise<Array<BlogPost>>;
    getDailyAnalytics(date: string): Promise<DailyAnalytics>;
    updateAnalytics(date: string, toolName: string): Promise<void>;
}
