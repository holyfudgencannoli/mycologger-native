import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import * as Sterile from '@db/sterilizations'
import * as Germ from '@db/germinations'
import * as Inoc from '@db/inoculations'
import * as Contam from '@db/contaminations'
import * as Colony from '@db/colonizations'
import * as Harvests from '@db/harvests'
import { Colonization, Contamination, Germination, Harvest, Inoculation, Sterilization } from 'src/types/models';

interface RecipeData {
    id: number;
    name: string;
    ingredients: JSON;
}




export const CultureDetailModal = ({ visible, setModalOpen, item}) => {
    const db = useSQLiteContext();
    const [sterilized, setSterilized] = useState<Sterilization>();
    const [germed, setGermed] = useState<Germination>();
    const [colony, setColony] = useState<Colonization>();
    const [contam, setContam] = useState<Contamination>();
    const [inoc, setInoc] = useState<Inoculation>();
    const [harvest, setHarvest] = useState<Harvest>();

    const closeModal = () => {
        // Close the modal (e.g., using a parent component's state)
        setModalOpen(false)
        console.log('Modal closed'); // Replace with your actual close logic
    };



    const getItemData = async() => {
        setSterilized(item.sterilized_id ? await Sterile.getById(db, item.sterilized_id) : null)
        setGermed(item.germinated_id ? await Germ.getById(db, item.germinated_id) : null)
        setColony(item.colonization_id ? await Colony.getById(db, item.colonization_id) : null)
        setContam(item.contamination_id ? await Contam.getById(db, item.contamination_id) : null)
        setInoc(item.inoculation_id ? await Inoc.getById(db, item.inoculation_id) : null)
        setHarvest(item.harvest_id ? await Harvests.getById(db, item.harvest_id) : null)
        
    }

    useFocusEffect(
        useCallback(() => {
            getItemData()
        }, [])
    )

    return (
        <View style={styles.modalContainer}>
            <Modal
                transparent={true}
                animationType="slide"
                onRequestClose={() => {}} // Handle outside tap to close modal
                visible={visible} // Make sure the modal is visible initially
            >
                <View style={styles.modalContent}>
                    <Text style={styles.headerText}>Culture Data</Text>
                    <Surface>
                        <Text>Sterilized: {sterilized === null || sterilized === undefined ? 'Not Yet Sterilized' : `${new Date(sterilized.created_at)}`}</Text>
                        <Text>Inoculated: {inoc === null || sterilized === undefined ? 'Not Yet Inoculated' : `${new Date(inoc.created_at)}`}</Text>
                        <Text>Germinated: {germed === null || sterilized === undefined ? 'Not Yet Germinated' : `${new Date(germed.created_at)}`}</Text>
                        <Text>Colonized: {colony === null || sterilized === undefined ? 'Not Yet Colonized' : `${new Date(colony.created_at)}`}</Text>
                        <Text>Contaminations: {contam === null || sterilized === undefined ? 'No Contaminations' : `${new Date(contam.created_at)}`}</Text>
                        <Text>Harvested: {harvest === null || sterilized === undefined ? 'Not Yet Harvested' : `${new Date(harvest.created_at)}`}</Text>
                    </Surface>
                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View> 
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1, // Take up full screen space
        justifyContent: 'center',
        alignItems: 'center',
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
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    logItem: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    closeButton: {
        backgroundColor: 'red',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 14,
    },
});

export default CultureDetailModal;
        
