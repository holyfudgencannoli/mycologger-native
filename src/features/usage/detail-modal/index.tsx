// import Itemerial from '@features/raw-materials/types/raw-material';
import { useFocusEffect, useRoutePath } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import * as Item from '@db/items'
import * as UsageLogs from '@db/usage_logs'
import * as Vendor from '@db/vendors'
import * as Batch from '@db/recipe-batches'
import { useSQLiteContext } from 'expo-sqlite';
import { PurchaseLogProp } from '../types/purchase-log';
import Button from '@components/button';
import { Item as ItemType, ItemProps } from '@db/items/types';
import { PurchaseLogData } from '@db/purchase-logs/types';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@constants/colors';
import { UsageLogType } from '@db/usage_logs/types';
import { CaseHelper } from '@utils/case-helper';
import { ScrollView } from 'react-native-gesture-handler';
import RecipeBatch from  '@db/recipe-batches/types'


export const UsageLogsModal = ({ visible, setModalOpen, item}: {visible: boolean, setModalOpen: (arg0: boolean) => void, item: ItemProps}) => {
    const [usageLogs, setUsageLogs] = useState<UsageLogType[]>([]);
    const [vendors, setVendors] = useState([]);
    const [itemObject, setItemObject] = useState<ItemType>();
    const db = useSQLiteContext();
    const path = useRoutePath();

    const closeModal = () => {
        // Close the modal (e.g., using a parent component's state)
        setModalOpen(false)
        console.log('Modal closed'); // Replace with your actual close logic
    };

    const defineType = () => { 
        const TYPE = CaseHelper.toSnakeCase(decodeURIComponent(path.split('/')[3]));
        let trueType: string;

        if (TYPE === 'recipe_batches') {
            trueType = TYPE.slice(0, -2);
        } else {
            trueType = TYPE.slice(0, -1);
        }
        console.log(trueType)
        return trueType;
    }

    const getUsageLogs = async() => {
        const TYPE = defineType()
        let itemObj: any;
        if (TYPE === 'recipe_batch') {
            itemObj = await Batch.getById(db, item.id)
            setItemObject(itemObj)
        } else {
            itemObj = await Item.getById(db, item.id)
            setItemObject(itemObj)
        }
        const logs = await UsageLogs.getByItemIdAndType(db, item.id, defineType())
        const material = await Item.getById(db, item.id)
        setUsageLogs(logs)

    }

    useFocusEffect(
        useCallback(() => {
            getUsageLogs()
            console.log(path)
        }, [])
    )

    
        const handleDelete = (id: number) => {
            Alert.alert(
                "Delete entry",
                "Are you sure you want to remove this time record?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                    text: "Delete",
                    style: "destructive",
                    onPress: async() => {
                        await Item.destroy(db, id)
                    },
                    },
                ],
                { cancelable: true }
            );
        };
            
            

    return (
        <View style={styles.modalContainer}>
            <Modal
                transparent={true}
                animationType="slide"
                onRequestClose={() => {}} // Handle outside tap to close modal
                visible={visible} // Make sure the modal is visible initially
            >
                <ScrollView>
                <View style={styles.modalContent}>
                    <Text style={styles.headerText}>Usage Logs</Text>
                    <Text>Usage logs will appear below</Text>
                    {usageLogs.map((log, index) => {
                        return(
                            <View style={styles.logItem} key={index}>
                                <LinearGradient
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0.3, y: 0.9 }}
                                    colors={COLORS.BACKGROUND_GRADIENT.PRIMARY}
                                    style={{ flexDirection: 'column', padding: 16, borderRadius: 4, width: '75%' }}
                                >
                                    <Text style={styles.text}>{new Date(log.last_updated).toLocaleDateString('en-GB',{
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}</Text>
                                    <Text style={styles.text}>{new Date(log.last_updated).toLocaleTimeString()}</Text>
                                    <Text style={styles.text}>{CaseHelper.toCleanCase(log.type)}</Text>
                                    <Text style={styles.text}>{item.name}</Text>
                                    <Text style={styles.text}>{log.usage_amout} {log.usage_unit}</Text>
                                    {/* {item.log.notes && <Text>{item.log.notes}</Text>} */}

                                    
                                </LinearGradient>
                                <Button
                                viewStyle={{ margin: 'auto' }}
                                    title="Delete"
                                    color="#d32f2f"          // red – feel free to change
                                    onPress={() => handleDelete(log.id)}
                                />
                            </View>
                        )
                    })}
                    
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1, // Take up full screen space
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    text: {
        color: 'white',
         fontWeight: 'bold',
         fontSize: 18
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    logItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    closeButton: {
        backgroundColor: 'red',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 24,
        paddingVertical: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 14,
    },
});

export default UsageLogsModal;
        
