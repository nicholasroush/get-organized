import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import {
	Button,
	Flex,
	Heading,
	View,
	withAuthenticator,
} from "@aws-amplify/ui-react";
import { listTodos } from "./graphql/queries";
import {
	createTodo as createTodoMutation,
	deleteTodo as deleteTodoMutation,
	updateTodo as updateTodoMutation,
} from "./graphql/mutations";
import { Input, Select, DatePicker, Table, Dropdown } from "antd";
import ellipsis from "./imgs/ellipsis.png";
import EditorModal from "./EditorModal/EditorModal";

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

const App = ({ signOut, user }) => {
	const [notes, setNotes] = useState([]);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("Not Started");
	const [date, setDate] = useState();
	const [openEditor, setOpenEditor] = useState(false);
	const [editorId, setEditorId] = useState();
	const activeUser = user.username;
	const username = activeUser.charAt(0).toUpperCase() + activeUser.slice(1);

	useEffect(() => {
		fetchNotes();
	}, []);

	async function fetchNotes() {
		const apiData = await API.graphql({ query: listTodos });
		const notesFromAPI = apiData.data.listTodos.items;
		setNotes(notesFromAPI);
	}

	async function createTodo() {
		const data = {
			title: title,
			description: description,
			status: status,
			dueDate: date,
		};
		await API.graphql({
			query: createTodoMutation,
			variables: { input: data },
			authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
		});
		fetchNotes();
		setTitle("");
		setDescription("");
		setStatus("Not Started");
		setDate();
	}

	async function updateNote() {
		const data = {
			id: editorId,
			title: title,
			description: description,
			status: status,
			dueDate: date,
		};

		await API.graphql({
			query: updateTodoMutation,
			variables: { input: data },
		});

		fetchNotes();
		setTitle("");
		setDescription("");
		setStatus("Not Started");
		setDate();
		setOpenEditor(!openEditor);
	}

	const editNote = ({ id }) => {
		setOpenEditor(!openEditor);
		setEditorId(id);
		notes.map((el) => {
			if (el.id === id) {
				setTitle(el.title);
				setDescription(el.description);
				setStatus(el.status);
				setDate(el.date);
			}
			return el;
		});
	};

	async function deleteNote({ id }) {
		const newNotes = notes.filter((note) => note.id !== id);
		setNotes(newNotes);
		await API.graphql({
			query: deleteTodoMutation,
			variables: { input: { id } },
		});
	}

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
			sorter: {
				compare: (a, b) => a.description.localeCompare(b.description),
			},
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

	return (
		<View className='App'>
			{openEditor && (
				<EditorModal
					updateNote={updateNote}
					title={title}
					setTitle={setTitle}
					description={description}
					setDescription={setDescription}
					status={status}
					setStatus={setStatus}
					setDate={setDate}
					setOpenEditor={setOpenEditor}
					openEditor={openEditor}
				/>
			)}
			<Heading level={1} style={{ margin: "3rem 0" }}>
				{username}'s Organizer App
			</Heading>
			<Flex direction='Row' justifyContent='center'>
				<View>
					<Input
						name='title'
						placeholder='Title'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						style={{ margin: "1rem", width: "50%" }}
					/>
					<TextArea
						placeholder='A short description.'
						allowClear
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						style={{ margin: "1rem" }}
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
							<label htmlFor='dueDate'>Due Date</label>
							<DatePicker
								name='dueDate'
								allowClear
								onChange={(date) => setDate(date.format("YYYY-MM-DD"))}
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
			<View margin='3rem 0'>
				{notes.length > 0 && (
					<Flex direction='column' justifyContent='center' alignItems='center'>
						<Heading level={2}>Current Notes</Heading>
						<Table
							rowKey='id'
							bordered
							dataSource={notes}
							columns={tableColumns}
							style={{ width: "60%" }}
						/>
					</Flex>
				)}
			</View>
			<Button
				onClick={signOut}
				style={{ position: "absolute", top: "1rem", right: "1rem" }}
			>
				Sign Out
			</Button>
		</View>
	);
};

export default withAuthenticator(App);
