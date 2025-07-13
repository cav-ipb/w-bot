import { ReactNode, useEffect, useState } from "react";
import { Timeline } from "primereact/timeline";
import { ProgressSpinner } from "primereact/progressspinner";
import { Checkbox } from "primereact/checkbox";
import "./whatsapp-login.css";

const WhatsAppLogin: React.FC = () => {
	const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
	const [localAuth, setLocalAuth] = useState<boolean>(false);

	useEffect(() => {
		window.electronApi.onWhatsAppQRUpdate((qr) => setQrCodeUrl(qr));
		window.electronApi.startWhatsAppClient();
	}, []);

	const events = [
		{
			status: "1.",
			node: () => (
				<div>
					Open <b>WhatsApp</b> <i className="pi pi-whatsapp"></i> on
					your phone.
				</div>
			),
		},
		{
			status: "2.",
			node: () => (
				<div>
					On Android tap <b>Menu</b>{" "}
					<i className="pi pi-ellipsis-v"></i> on your phone &middot;
					On iPhone tap <b>Settings</b> <i className="pi pi-cog"></i>
				</div>
			),
		},
		{
			status: "3.",
			node: () => (
				<div>
					Tap <b>Linked devices</b>, then <b>Link device</b>
				</div>
			),
		},
		{ status: "4.", node: () => <div>Scan de QR code to confirm</div> },
	];

	const customizedContent = (item: {status:string, node: () => ReactNode}) => {
		return (
			<div style={{ display: "flex" }}>
				<label className="mr-3">{item.status}</label>
				{item.node()}
			</div>
		);
	};

	return (
		<div>
			<div className="login-container card">
				<div className="login-container-header">
					<h5 className="m-0">
						Please follow the steps to log in to WhatsApp
					</h5>
				</div>

				<div className="row">
					<div
						style={{ width: "400px", height: "280px" }}
						className="flex-center-vh"
					>
						<Timeline
							value={events}
							align="left"
							className="customized-timeline"
							content={customizedContent}
						/>
					</div>
					<div style={{ height: "280px", width: "276px" }}>
						{qrCodeUrl ? (
							<img src={qrCodeUrl} alt="QR Code" />
						) : (
							<div className="flex-center-vh h-100">
								<ProgressSpinner
									style={{ width: "50px", height: "50px" }}
									strokeWidth="8"
									fill="var(--surface-ground)"
									animationDuration=".5s"
								/>
							</div>
						)}
					</div>
				</div>
				<div className="flex-center-vh">
					<span>Keep me signed in: &nbsp;</span>
					<Checkbox
						checked={localAuth}
						onChange={() => {
							setLocalAuth(!localAuth);
							window.electronApi.toggleWhatsAppLocalAuth();
						}}
					/>
				</div>
			</div>

			<div></div>
		</div>
	);
};

export default WhatsAppLogin;
