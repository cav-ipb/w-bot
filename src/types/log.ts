export interface Log {
    datetime: Date;
    severity: "info" | "success" | "danger" | "warning";
    message: string;
}