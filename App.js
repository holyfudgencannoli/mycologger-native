import 'react-native-reanimated';
// import Navigation from '@features/Navigation/index.jsx';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from '@hooks/useTheme';
import { migrateDbIfNeeded } from '@db/migrations';
// import { SQLiteProvider } from "expo-sqlite";
import { FormProvider } from 'react-hook-form';
import * as Form from 'custom_modules/react-native-forms/src'
import { ScreenPrimative } from '@components/screen-primative';
import NewItem from '@features/raw-materials/new-item';
import { SQLiteProvider } from 'expo-sqlite';
import PurchaseLogForm from '@features/raw-materials/purchase-log-form';
import Navigation from '@navigation';
import { Platform } from 'react-native';
import { FormStateProvider } from 'src/context/FormStateProvider';

export default function App() {

	const handleInit = async (db) => {
        console.log("Initializing...")
		try {
			await migrateDbIfNeeded(db);
			console.log("✅ Migration complete!");
		} catch (err) {
			console.error("❌ Migration failed:", err);
		} 
    }

	return (
		<SQLiteProvider databaseName='mycologger_v2.1_dev.db' onInit={handleInit}>
			<FormStateProvider>
				<PaperProvider>
					<ThemeProvider>
						<FormProvider>
							<Navigation />
						</FormProvider>	
					</ThemeProvider>
				</PaperProvider>
			</FormStateProvider>
		</SQLiteProvider>
	);
}

