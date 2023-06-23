import React, { useState } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import {
	Button,
	Heading,
	View,
	Authenticator,
	useTheme,
} from "@aws-amplify/ui-react";
import { listTodos } from "./graphql/queries";
import {
	createTodo as createTodoMutation,
	deleteTodo as deleteTodoMutation,
	updateTodo as updateTodoMutation,
} from "./graphql/mutations";
import { Alert } from "antd";
import EditorModal from "./EditorModal/EditorModal";
import Content from "./Content/Content";

const App = () => {
	const [notes, setNotes] = useState([]);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("Not Started");
	const [date, setDate] = useState();
	const [openEditor, setOpenEditor] = useState(false);
	const [editorId, setEditorId] = useState();
	const [submitError, setSubmitError] = useState(false);
	const [updateError, setUpdateError] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	const components = {
		Header() {
			const { tokens } = useTheme();

			return (
				<View textAlign='center' padding={tokens.space.large}>
					<Heading
						level={1}
						style={{
							position: "relative",
							zIndex: "2",
							textAlign: "center",
							marginTop: "3rem",
							fontWeight: "500",
						}}
					>
						Sign In and Get Organized!
					</Heading>
				</View>
			);
		},
	};

	async function fetchNotes() {
		const apiData = await API.graphql({ query: listTodos });
		const notesFromAPI = apiData.data.listTodos.items;
		setNotes(notesFromAPI);
	}

	async function createTodo() {
		if (title === "" || description === "" || date === null) {
			setSubmitError(true);
			setTimeout(() => {
				setSubmitError(false);
			}, 7000);
		} else {
			const data = {
				title: title,
				description: description,
				status: status,
				dueDate: date.format("MM/DD/YYYY"),
			};
			await API.graphql({
				query: createTodoMutation,
				variables: { input: data },
				authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
			});
			setSubmitSuccess(true);
			setTimeout(() => {
				setSubmitSuccess(false);
			}, 7000);
			fetchNotes();
			setTitle("");
			setDescription("");
			setStatus("Not Started");
			setDate(null);
			setSubmitError(false);
		}
	}

	async function updateNote() {
		if (title === "" || description === "" || date === null) {
			setUpdateError(true);
			setTimeout(() => {
				setUpdateError(false);
			}, 7000);
		} else {
			const data = {
				id: editorId,
				title: title,
				description: description,
				status: status,
				dueDate: date.format("MM/DD/YYYY"),
			};

			await API.graphql({
				query: updateTodoMutation,
				variables: { input: data },
			});

			fetchNotes();
			setTitle("");
			setDescription("");
			setStatus("Not Started");
			setDate(null);
			setOpenEditor(!openEditor);
		}
	}

	const editNote = ({ id }) => {
		setOpenEditor(!openEditor);
		setEditorId(id);
		notes.map((el) => {
			if (el.id === id) {
				setTitle(el.title);
				setDescription(el.description);
				setStatus(el.status);
			}
			return el;
		});
	};

	async function deleteNote({ id }) {
		const newNotes = notes.filter((note) => note.id !== id);
		setNotes(newNotes);
		await API.graphql({
			query: deleteTodoMutation,
			variables: { input: { id: id } },
		});
	}

	return (
		<Authenticator components={components} initialState='signUp'>
			{({ signOut, user }) => (
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
							updateError={updateError}
						/>
					)}
					{submitError && (
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
								description="Please make sure you've completed all available fields."
								type='error'
								showIcon
							/>
						</div>
					)}
					{submitSuccess && (
						<div
							style={{
								position: "absolute",
								zIndex: "1000",
								top: 0,
								left: "50%",
								transform: "translateX(-50%)",
								width: "20rem",
							}}
						>
							<Alert
								message='Success'
								description='New task added!'
								type='success'
								showIcon
							/>
						</div>
					)}
					<Content
						notes={notes}
						user={user}
						createTodo={createTodo}
						editNote={editNote}
						deleteNote={deleteNote}
						title={title}
						setTitle={setTitle}
						fetchNotes={fetchNotes}
						status={status}
						setStatus={setStatus}
						description={description}
						setDescription={setDescription}
						setDate={setDate}
					/>
					<Button
						onClick={signOut}
						style={{ position: "absolute", top: "1rem", right: "1rem" }}
					>
						Sign Out
					</Button>
				</View>
			)}
		</Authenticator>
	);
};

export default App;
