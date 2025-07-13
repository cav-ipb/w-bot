import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "./app-login.css";
import { NavLink } from "react-router";
import useLogin from "../hooks/use-login";
import { Login } from "../types/login";

const schema = Yup.object({
	email: Yup.string()
		.trim()
		.email("Please enter a valid email")
		.required("Please enter your email"),
	password: Yup.string().required("Please enter your password"),
});

const AppLogin: React.FC = () => {
	const { loading, handleLogin } = useLogin();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		// resolver: yupResolver(schema),
	});

	const onSubmit = async (login: Login) => {
		console.log(login);
		const result = await handleLogin(login);
		console.log(result);
	};

	return (
		<div className="login-page">
			<div className="login-container card">
				<div className="login-container-header">
					<div className="mb-3 company-logo"></div>
					<h6 className="m-0">
						Welcome to the WhatsApp advertisement bot!
					</h6>
				</div>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="login-form">
						<div>
							<label htmlFor="email">Email</label>
							<InputText
								{...register("email")}
								id="email"
								type="text"
								style={{ width: "100%" }}
								invalid={errors.email != null}
							/>
						</div>

						<div className="mb-2">
                            <label htmlFor="password">Password</label>
							<Controller
								name="password"
								defaultValue=""
								control={control}
								render={({ field }) => (
									<Password
										{...field}
										id="password"
										inputClassName="password-input"
										panelClassName="password-panel"
										invalid={errors.password != null}
										feedback={false}
										style={{ width: "100%" }}
										toggleMask
									/>
								)}
							/>
						</div>

						<Button
							type="submit"
							label="Log in"
							disabled={loading}
						></Button>

						<span>
							Do you need to&nbsp;
							<NavLink
								className="underline"
								to="/account/registration"
							>
								recover a forgotten password?
							</NavLink>
						</span>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AppLogin;
