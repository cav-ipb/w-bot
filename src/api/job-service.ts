import { Job, JobTask, JobStatus } from "../types/job";
import api from "./api-interceptor";
import { store } from "../store/store";
import { BaseApiService } from "./base-api-service";

export class JobService extends BaseApiService {
	url = "api/desktop/job";

	getJobs(): Promise<Job[]> {
		return this.handleRequest(api.get<Job[]>(`${this.url}/all`, {})).then(
			(data: Job[]) => {
				data.forEach((job) => {
					job.completed = job.total === job.progress;
					job.date = job.date ? new Date(job.date) : null;
					job.createdAt = new Date(job.createdAt);

					// if the job is in the queue mark it as running
					const index = store.store.queue.findIndex(
						(x) => x.id === job.id
					);
					job.jobStatus =
						index >= 0 ? JobStatus.running : JobStatus.paused;
				});
				return Promise.resolve(data);
			}
		);
	}

	getNextLocums(jobId: string, take: number): Promise<JobTask[]> {
		return this.handleRequest(
			api.get<JobTask[]>(`${this.url}/next/${jobId}/${take}`, {})
		);
	}

	markCompletedTasks(jobId: string, locumIds: number[]): Promise<number> {
		return this.handleRequest(
			api.post<number>(`${this.url}/mark-completed/${jobId}`, locumIds)
		);
	}
}
