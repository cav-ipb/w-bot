import { Outlet, useNavigate } from "react-router";
import { Menubar } from "primereact/menubar";
import useLayout from "../hooks/use-layout";
import "./app-layout.css";

const AppLayout: React.FC = () => {
	const navigate = useNavigate();
	const { userName } = useLayout();


	const items = [
		{
			label: "Settings",
			icon: "pi pi-cog",
		},
	];

	return (
		<div className="flex flex-col h-screen">
			<div>
				<Menubar
					model={items}
					end={() => {
						return (
							<div style={{ paddingRight: "10px" }}>
								Welcome, {userName}
							</div>
						);
					}}
				/>
			</div>
			<div className="outlet-container">
				<Outlet />
			</div>
		</div>
	);
};

export default AppLayout;
