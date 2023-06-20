import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import {
	withAuthenticator,
	Button,
	Heading,
	Image,
	View,
	Card,
} from "@aws-amplify/ui-react";

function App({ signOut }) {
	return (
		<View className='App'>
			<Card>
				<Heading level={1}>Temp Auth Heading</Heading>
			</Card>
			<Button onClick={signOut}>Sign Out</Button>
		</View>
	);
}

export default withAuthenticator(App);
