import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';

import Colors from '@/constants/Colors';

import Button from '../onboard/Button';

interface ModalProps {
    visible: boolean;
    onRequestClose: () => void;
    title: string;
    message: string;
    handlePressAction: () => void;
    handleCancel: () => void;
    actionLoading: boolean;
    otherProps: { [key: string]: any };
}

export default function CustomModal({
    visible,
    onRequestClose,
    title,
    message,
    handlePressAction,
    handleCancel,
    actionLoading,
    otherProps
}: ModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            accessible={true}
            animationType="fade"
            onRequestClose={onRequestClose}
            {...otherProps}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle} accessibilityRole='header' accessibilityLabel={title}>
                        {title}
                    </Text>
                    <Text style={styles.modalText} accessibilityRole='text' accessibilityLabel={message}>
                        {message}
                    </Text>
                    <Button
                        title={title}
                        onPress={handlePressAction}
                        loading={actionLoading}
                        disabled={actionLoading}
                    />
                    <TouchableOpacity
                        onPress={handleCancel}
                        style={{ marginTop: 20 }}
                        accessible={true}
                        accessibilityRole='button'
                        accessibilityLabel='Cancel'
                    >
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay background
    },
    modalContent: {
        width: '80%',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 24,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 20,
    },
    modalText: {
        marginBottom: 29,
    },
    cancelText: {
        color: Colors.primary,
        textAlign: 'center',
    },
})