import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import {
	Button,
	Flex,
	Heading,
	Text,
	View,
	withAuthenticator,
} from "@aws-amplify/ui-react";
import { listTodos } from "./graphql/queries";
import {
	createTodo as createTodoMutation,
	deleteTodo as deleteTodoMutation,
} from "./graphql/mutations";
import { Input, Select, DatePicker } from "antd";

const { TextArea } = Input;

const selectOptions = [
	{
		label: "Not Started",
		value: "not started",
	},
	{
		label: "In Progress",
		value: "in progress",
	},
	{
		label: "Completed",
		value: "completed",
	},
];

const App = ({ signOut }) => {
	const [notes, setNotes] = useState([]);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("Not Started");
	const [date, setDate] = useState();

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
	}

	async function deleteNote({ id }) {
		const newNotes = notes.filter((note) => note.id !== id);
		setNotes(newNotes);
		await API.graphql({
			query: deleteTodoMutation,
			variables: { input: { id } },
		});
	}

	return (
		<View className='App'>
			<Heading level={1}>My Notes App</Heading>
			<Flex direction='Row' justifyContent='center'>
				<View>
					<Input
						placeholder='Title'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<TextArea
						placeholder='A short description.'
						allowClear
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					>
						<br />
						<br />
					</TextArea>
					<Select
						options={selectOptions}
						value={status}
						onChange={(value) => setStatus(value)}
						style={{ width: "auto" }}
					/>
					<DatePicker
						allowClear
						onChange={(date) => setDate(date.format("MM-DD-YYYY"))}
					/>
					<br />
					<Button onClick={createTodo}>Sumbit</Button>
				</View>
			</Flex>
			<View margin='3rem 0'>
				{notes.map((note) => (
					<Flex
						key={note.id || note.title}
						direction='column'
						justifyContent='center'
						alignItems='center'
					>
						<Heading level={2}>Current Notes</Heading>
						<Text as='strong' fontWeight={700}>
							{note.title}
						</Text>
						<Text as='span'>{note.description}</Text>
						<Text as='span'>{note.status}</Text>
						<Text as='span'>{note.dueDate}</Text>
						<Button variation='link' onClick={() => deleteNote(note)}>
							Delete note
						</Button>
					</Flex>
				))}
			</View>
			<Button onClick={signOut}>Sign Out</Button>
		</View>
	);
};

export default withAuthenticator(App);
