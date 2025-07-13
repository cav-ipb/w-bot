export enum JobStatus {
    paused,
    running
}

export interface Job {
    id: string;
    completed: boolean;
    createdAt: Date;
    shiftId?: number;
    county?: string;
    date?: Date;
    total: number;
    progress: number;
    jobStatus: JobStatus;
}

export interface JobTask {
    jobId: number;
    locumId: number;
    phoneNumber: string;
    message: string;
    ignore: boolean; 
}