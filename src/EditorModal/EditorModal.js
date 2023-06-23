import React from "react";
import { Button } from "@aws-amplify/ui-react";
import { Input, Select, DatePicker, Alert } from "antd";
import close from "../imgs/close.png";
import "./editorModal.css";

const { TextArea } = Input;

const selectOptions = [
	{
		label: "Not Started",
		value: "Not Started",
	},
	{
		label: "In Progress",
		value: "In Progress",
	},
	{
		label: "Completed",
		value: "Completed",
	},
];

const EditorModal = ({
	updateNote,
	title,
	setTitle,
	description,
	setDescription,
	status,
	setStatus,
	setDate,
	setOpenEditor,
	openEditor,
	updateError,
}) => {
	const closeModal = () => {
		setTitle("");
		setDescription("");
		setStatus("Not Started");
		setDate();
		setOpenEditor(!openEditor);
	};
	return (
		<div className='modal-container'>
			{updateError && (
				<div
					style={{
						position: "absolute",
						zIndex: "1000",
						top: 0,
						left: "50%",
						transform: "translateX(-50%)",
					}}
				>
					<Alert
						message='Error'
						description='Please check and make sure all fields are filled in.'
						type='error'
						showIcon
					/>
				</div>
			)}
			<div className='modal-mask' />
			<div className='modal-content'>
				<img src={close} alt='CLOSE' onClick={closeModal} />
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						width: "50%",
						margin: "auto",
					}}
				>
					<label htmlFor='title' style={{ fontWeight: "500" }}>
						Title
					</label>
					<Input
						name='title'
						placeholder='Title'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						style={{ margin: "1rem", width: "100%", alignSelf: "center" }}
					/>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						width: "100%",
						margin: "auto",
					}}
				>
					<label htmlFor='title' style={{ fontWeight: "500" }}>
						Description
					</label>
					<TextArea
						placeholder='A short description.'
						allowClear
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						style={{ margin: "1rem", alignSelf: "center" }}
					>
						<br />
						<br />
					</TextArea>
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "fit-content",
						}}
					>
						<label htmlFor='status' style={{ fontWeight: "500" }}>
							Status
						</label>
						<Select
							name='status'
							options={selectOptions}
							value={status}
							onChange={(value) => setStatus(value)}
							style={{ width: "auto", margin: "0 1rem", padding: ".5rem" }}
						/>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "fit-content",
						}}
					>
						<label htmlFor='dueDate' style={{ fontWeight: "500" }}>
							Due Date
						</label>
						<DatePicker
							name='dueDate'
							allowClear
							onChange={(date) => setDate(date)}
							style={{ margin: ".5rem 1rem" }}
						/>
					</div>
				</div>
				<br />
				<Button onClick={updateNote} style={{ margin: "1rem" }}>
					Update
				</Button>
			</div>
		</div>
	);
};

export default EditorModal;
