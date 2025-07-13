import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Job, JobStatus } from "../types/job";
import { Checkbox } from "primereact/checkbox";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Badge } from "primereact/badge";
import { Dialog } from "primereact/dialog";
import WhatsAppLogin from "./whatsapp-login";
import "./job-dashboard.css";
import useDashboard from "../hooks/use-dashboard";

const JobDashboard: React.FC = () => {

    const {
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

    } = useDashboard();

	const customHeader = (
		<div>
			<i className="pi pi-book"></i> Job logs
		</div>
	);

	const actionsButtonsTemplate = (job: Job) => {
		return (
			<div style={{ display: "flex", gap: "5px" }}>
				<Button
					icon="pi pi-trash"
					size="small"
					rounded
					text
					severity="danger"
				/>
				<Button
					icon="pi pi-play"
					size="small"
					visible={
						job.jobStatus === JobStatus.paused && !job.completed
					}
					onClick={() => {
						job.jobStatus = JobStatus.running;
						setKey(key + 1);
						window.electronApi.enqueueJob(job);
					}}
					rounded
					text
				/>
				<Button
					icon="pi pi-pause"
					size="small"
					visible={job.jobStatus === JobStatus.running}
					onClick={() => {
						job.jobStatus = JobStatus.paused;
						setKey(key + 1);
						window.electronApi.dequeueJob(job);
					}}
					rounded
					text
				/>
			</div>
		);
	};

	return (
		<div>
			<div className="table-container card">
				<div style={{ display: "flex", gap: "10px" }}>
					<Button
						label="Refresh"
						size="small"
						icon="pi pi-refresh"
						onClick={() => getJobs()}
					/>
					<Button
						label="Show logs"
						size="small"
						icon="pi pi-book"
						onClick={() => setShowLog(true)}
					/>
					<Button
						label="Log In to WhatsApp"
						size="small"
						icon="pi pi-whatsapp"
						onClick={() => setShowWhatsappLoginDialog(true)}
					>
						{!whatsappConnected && (
							<Badge severity="danger"></Badge>
						)}
						{whatsappConnected && (
							<Badge severity="success"></Badge>
						)}
					</Button>
				</div>

				<DataTable
					paginator
					rows={10}
					key={key}
					value={jobs}
					tableStyle={{ minWidth: "50rem" }}
                    content="center"
				>
					<Column
						field="completed"
						header={() => <i className="pi pi-check" />}
						body={(job: Job) => (
							<Checkbox checked={job.completed}></Checkbox>
						)}
					></Column>
					<Column
						field="createdAt"
						header="Created At"
						body={(job: Job) =>
							job.createdAt.toISOString().split("T")[0]
						}
					></Column>
					<Column field="shiftId" header="Shift Id"></Column>
					<Column
						field="countyDate"
						header="County & Date"
						body={(job: Job) =>
							job.county +
							" " +
							job.date?.toISOString()?.split("T")[0]
						}
					></Column>
                    <Column field="total" header="Locums"></Column>
					<Column
						field="progress"
						header="Progress"
						body={(job: Job) => (
                            <div className="px-1">
                                <ProgressBar
                                    value={(job.progress * 100) / job.total}
                                    showValue
                                ></ProgressBar>
                            </div>
						)}
					></Column>
					<Column body={actionsButtonsTemplate} style={{width:'120px'}}></Column>
				</DataTable>

				<Sidebar
					header={customHeader}
					style={{ height: "300px" }}
					visible={showLog}
					dismissable={false}
					modal={false}
					position="bottom"
					onHide={() => setShowLog(false)}
				>
					<div className="log-container">
						{logs.map((x) => (
							<div key={`k-${x.datetime.toISOString()}`} className="log">
								<Badge severity={x.severity}></Badge> &nbsp; [
								{x.datetime.toLocaleString()}]: {x.message}
							</div>
						))}
					</div>
				</Sidebar>
			</div>
			<Dialog
				header="Log In to WhatsApp"
				visible={showWhatsappLoginDialog}
				onHide={() => {
					if (!showWhatsappLoginDialog) return;
					setShowWhatsappLoginDialog(false);
				}}
			>
				<WhatsAppLogin />
			</Dialog>
		</div>
	);
};

export default JobDashboard;
