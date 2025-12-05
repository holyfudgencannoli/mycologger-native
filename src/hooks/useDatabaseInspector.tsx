import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { File } from 'expo-file-system';  // NEW: SDK 54+

export function useDatabaseInspector(dbFileUri: string | null) {
    const [dbInfo, setDbInfo] = useState<{ tables: Array<{ table: string; data: any[]; error?: string }>; error: string | null }>({
        tables: [],
        error: null,
    });

    useEffect(() => {
        if (!dbFileUri) {
            setDbInfo({ tables: [], error: null });
            return;
        }

        const inspect = async () => {
            try {
                // NEW: Sync existence check (replaces deprecated getInfoAsync)
                const file = new File(dbFileUri);
                if (!file.exists) {
                    setDbInfo({ tables: [], error: 'Backup file not found' });
                    return;
                }

                // Convert file:// URI → plain path (required by openDatabaseSync)
                const filePath = dbFileUri.replace('file://', '');
                
                // Open the backup database (this works!)
                const db = SQLite.openDatabaseSync(filePath);

                // Get table names (exclude system tables)
                const tableRows = db.getAllSync(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
                );

                const tables = tableRows.map((row: any) => row.name);

                // Fetch data from each table
                const tablesData = tables.map((table: string) => {
                    try {
                        const rows = db.getAllSync(`SELECT * FROM "${table}"`);
                        return { table, data: rows || [] };
                    } catch (err) {
                        console.warn(`Error fetching data from ${table}:`, err);
                        return { table, data: [], error: (err as Error).message };
                    }
                });

                setDbInfo({ tables: tablesData, error: null });
                db.closeSync();
            } catch (error: any) {
                console.error('Inspector error:', error);
                setDbInfo({
                    tables: [],
                    error: error.message || 'Failed to open backup database',
                });
            }
        };

        inspect();
    }, [dbFileUri]);

    return dbInfo;
}