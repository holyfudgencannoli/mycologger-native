import 'react-native-reanimated';
// import Navigation from '@features/Navigation/index.jsx';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from '@hooks/useTheme';
// import { migrateDbIfNeeded } from './data/db/migrations';
// import { SQLiteProvider } from "expo-sqlite";
import { FormProvider } from 'react-hook-form';
import * as Form from 'custom_modules/react-native-forms/src'
import { ScreenPrimative } from '@components/screen-primative';
import NewItem from '@features/raw-materials/new-item';
import { SQLiteProvider } from 'expo-sqlite';
import PurchaseLogForm from '@features/raw-materials/purchase-log-form';
import Navigation from '@navigation';


export default function App() {

	const handleInit = async (db) => {
        console.log("Initializes")
		// try {
		// 	await migrateDbIfNeeded(db);
		// 	console.log("✅ Migration complete!");
		// } catch (err) {
		// 	console.error("❌ Migration failed:", err);
		// } 
    }

	return (
		<SQLiteProvider databaseName='mycologger.db' onInit={handleInit}>
			<PaperProvider>
				<ThemeProvider>
					<ScreenPrimative>
						<FormProvider>
                            <Navigation />
						</FormProvider>	
					</ScreenPrimative>              
				</ThemeProvider>
			</PaperProvider>
		</SQLiteProvider>
	);
}

