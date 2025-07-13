import { useEffect, useState } from "react";
import { Job, JobStatus } from "../types/job";
import { Log } from "../types/log";
import useSession from "./use-session";

const useDashboard = () => {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [key, setKey] = useState<number>(0);

	const [showLog, setShowLog] = useState<boolean>(false);
	const [logs, setLogs] = useState<Log[]>([]);

	const [showWhatsappLoginDialog, setShowWhatsappLoginDialog] =
		useState<boolean>(false);
	const [whatsappConnected, setWhatsappConnected] = useState<boolean>(false);

	const { checkSession } = useSession();

	useEffect(() => {
		init();
	}, []);

	const init = async () => {
		const session = await checkSession();
		if (!session) return;

		await getJobs();

		window.electronApi.onLog((log) => {
			setLogs((previous) => {
				if (previous.length >= 50) previous.splice(0, 1);
				return [...previous, log];
			});
		});

		window.electronApi.onWhatsAppDisconnected(() => {
			setWhatsappConnected(false);
			setShowWhatsappLoginDialog(true);
		});

		window.electronApi.onWhatsAppConnected(() => {
			setWhatsappConnected(true);
			setShowWhatsappLoginDialog(false);
		});

		window.electronApi.onTasksCompleted((result) => {
			setJobs((previous) => {
				const job = previous.find((x) => x.id === result.jobId);
				job.progress = job.total - result.remaining;

				if (job.progress === job.total) {
					job.completed = true;
					job.jobStatus = JobStatus.paused;
				}
				return previous;
			});

			setKey((previous) => {
				return previous + 1;
			});
		});
	};

	const getJobs = async () => {
        try {
            const result = await window.electronApi.getJobs();
            setJobs(result);
        } catch (error) {
            return;
        }
	};

	
	return {
		jobs,
        getJobs,
        key,
        setKey,
        showLog,
        setShowLog,
        logs,
        showWhatsappLoginDialog,
        setShowWhatsappLoginDialog,
        whatsappConnected
	};
};

export default useDashboard;
