import React, { useEffect } from "react";
import ellipsis from "../imgs/ellipsis.png";
import { Input, Select, DatePicker, Table, Dropdown } from "antd";
import { Button, Flex, Heading, View } from "@aws-amplify/ui-react";

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

const menuItems = [
	{
		key: "1",
		label: "Edit",
	},
	{
		key: "2",
		label: "Delete",
	},
];

const Content = ({
	notes,
	user,
	deleteNote,
	editNote,
	createTodo,
	title,
	setTitle,
	status,
	setStatus,
	description,
	setDescription,
	setDate,
	fetchNotes,
}) => {
	let screenWidth = window.innerWidth;

	const tableColumns = [
		{
			title: "Title",
			dataIndex: "title",
			key: "name",
			sorter: {
				compare: (a, b) => a.title.localeCompare(b.title),
			},
		},
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
			width: "50%",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			sorter: {
				compare: (a, b) => a.status.localeCompare(b.status),
			},
		},
		{
			title: "Due Date",
			dataIndex: "dueDate",
			key: "dueDate",
			sorter: {
				compare: (a, b) => a.dueDate.localeCompare(b.dueDate),
			},
		},
		{
			title: "Actions",
			dataIndex: "actions",
			key: "actions",
			render: (_, id) => {
				return (
					<Dropdown
						trigger={["click"]}
						menu={{
							items: menuItems,
							onClick: (e) => handleMenuClick(e, id),
						}}
					>
						<img
							src={ellipsis}
							alt='More Options'
							style={{ height: "1.25rem", width: "auto", cursor: "pointer" }}
						/>
					</Dropdown>
				);
			},
			align: "center",
		},
	];

	const handleMenuClick = (e, id) => {
		switch (e.key) {
			case "1":
				editNote(id);
				break;

			case "2":
				deleteNote(id);
				break;

			default:
				break;
		}
	};

	useEffect(() => {
		fetchNotes();
	}, [fetchNotes]);

	return (
		<div>
			<Heading level={1} style={{ margin: "3rem 0" }}>
				{user?.username}'s Organizer App
			</Heading>
			<Flex direction='Row' justifyContent='center'>
				<View>
					<Input
						name='title'
						placeholder='Title'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						style={{
							margin: "1rem",
							width: "50%",
						}}
						required
					/>
					<TextArea
						placeholder='A short description.'
						allowClear
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						style={{
							margin: "1rem",
						}}
						required
					>
						<br />
						<br />
					</TextArea>
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
							<label htmlFor='status'>Status</label>
							<Select
								name='status'
								options={selectOptions}
								value={status}
								onChange={(value) => setStatus(value)}
								style={{
									width: "auto",
									margin: "0 1rem",
									padding: ".5rem",
								}}
							/>
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								width: "fit-content",
							}}
						>
							<label htmlFor='dueDate'>Due Date</label>
							<DatePicker
								name='dueDate'
								allowClear
								onChange={(date) => setDate(date)}
								style={{ margin: ".5rem 1rem" }}
							/>
						</div>
					</div>
					<br />
					<Button onClick={createTodo} style={{ margin: "1rem" }}>
						Sumbit
					</Button>
				</View>
			</Flex>
			<View margin='3rem auto'>
				{notes.length > 0 && (
					<Flex direction='column' justifyContent='center' alignItems='center'>
						<Heading level={2}>Current Tasks</Heading>
						<Table
							rowKey='id'
							bordered
							dataSource={notes}
							columns={tableColumns}
							style={{ width: screenWidth < 670 ? "100%" : "60%" }}
						/>
					</Flex>
				)}
			</View>
		</div>
	);
};

export default Content;
