import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Change 'FontAwesome' to the desired icon set

const DeleteConfirmationModal = ({ isVisible, expense, onCancel, onDelete }) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Icon name="trash" size={40} color="#FF6A63" style={styles.trashIcon} />
          <Text style={styles.modalTitle}>Xác nhận xóa</Text>
          <Text style={styles.modalMessage}>
            Bạn có chắc xóa khoản chi tiêu này?
          </Text>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(expense.id)}>
              <Text style={styles.deleteButtonText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    marginHorizontal: 5,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF6A63',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  trashIcon: {
    marginBottom: 20,
  },
});

export default DeleteConfirmationModal;
