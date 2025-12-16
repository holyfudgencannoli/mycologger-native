import { ItemProps } from '@db/items/types';
import { RecipeBatch } from '@db/recipe-batches/types';
import { useFocusEffect } from '@react-navigation/native';
import React, { SetStateAction, useCallback, useState } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

interface RecipeData {
    id: number;
    name: string;
    ingredients: JSON;
}




const RecipeBatchModal = ({ visible, setModalOpen, item}: {visible: boolean, setModalOpen: React.Dispatch<SetStateAction<boolean>>, item: RecipeBatch}) => {

    const closeModal = () => {
        // Close the modal (e.g., using a parent component's state)
        setModalOpen(false)
        console.log('Modal closed'); // Replace with your actual close logic
    };

    const { name,   real_volume, real_volume_unit, loss, notes, recipe_id,  } = item
    return (
        <View style={styles.modalContainer}>
            <Modal
                transparent={true}
                animationType="slide"
                onRequestClose={() => {}} // Handle outside tap to close modal
                visible={visible} // Make sure the modal is visible initially
            >
                <View style={styles.modalContent}>
                    <Text>{name}</Text>
                    <Text>Real Yield: {real_volume} {real_volume_unit}</Text>
                    <Text>Loss: {loss} </Text>
                    <Text>Notes: {notes ? notes: "No recorded notes"}</Text>
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

export default RecipeBatchModal;
        
