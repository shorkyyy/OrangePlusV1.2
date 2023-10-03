import React, { useState }  from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Change 'FontAwesome5' to the desired icon set
import DeleteConfirmationModal from './DeleteConfirmationModal';
import * as Haptics from 'expo-haptics';

const ExpenseDetailsScreen = ({ route, navigation }) => {
  const { expense, handleUpdateExpense} = route.params; // get handleUpdateExpense from params
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  
  const iconMap = {
    'Mua Sắm': 'shopping-bag',
    'Mua Hàng Online': 'shopping-cart',
    'Ăn Uống': 'utensils',
    'Thú Cưng': 'paw',
    'Khác' : 'ellipsis-h',
    // Add more descriptions and icons as needed...
  };

  // Function to format the amount with "." as a thousand separator and add "đ" for VND
  function formatAmount(amount) {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  // Function to format the date to "dd/mm/yyyy" format
  function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  const descriptionIcon = iconMap[expense.description] || 'question-circle';

  // Function to handle the edit button press
  const handleEditExpense = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('EditExpenseScreen', {
      expense,
      handleUpdateExpense, // Pass the handleUpdateExpense function to EditExpenseScreen
      icon: descriptionIcon, // Pass the icon to EditExpenseScreen
    });
  };

  // Function to handle the delete button press
  const handleDeleteButton = () => {
     setShowDeleteModal(true);
     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    navigation.navigate('MainScreen', { expenseId: expense.id });
 };
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name={descriptionIcon} size={30} color="#fff" />
      </View>
      <Text style={styles.expenseTitle}>{expense.title.charAt(0).toUpperCase() + expense.title.slice(1)}</Text>
      <Text style={styles.expenseDescription}>{expense.description}</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.detailsRow}>
          <FontAwesome5 name="money-bill-wave" size={20} color="#8FCB8F" style={styles.detailsIcon} />
          <Text style={styles.detailsLabel}>Số Tiền:</Text>
          <Text style={styles.detailsValue}>{formatAmount(expense.amount)}</Text>
        </View>
        <View style={styles.detailsRow}>
          <FontAwesome5 name="calendar" size={20} color="#8FCB8F" style={styles.detailsIcon} />
          <Text style={[styles.detailsLabel]}>Ngày:</Text>
          <Text style={[styles.detailsValue]}>{formatDate(expense.date)}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditExpense}>
          <FontAwesome5 name="edit" size={20} color="#fff" />
          <Text style={styles.buttonText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteButton}>
          <FontAwesome5 name="trash" size={20} color="#fff" />
          <Text style={styles.buttonText}>Xoá</Text>
        </TouchableOpacity>
      </View>
      <DeleteConfirmationModal
        isVisible={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        expense={expense}
        error={null} // Pass null as the error prop since we don't have an error here
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: '#8FCB8F',
    justifyContent: 'center', 
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  expenseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8FCB8F',
    textAlign: 'center',
  },
  expenseDescription: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 5,
  },
  detailsIcon: {
    marginRight: 10,
  },
  detailsLabel: {
    fontSize: 18,
    color: '#555',
  },
  detailsLabelText: {
    lineHeight: 18, // Set the line height to match the font size
  },
  detailsValue: {
    fontSize: 18,
    marginTop: 10,
    marginLeft: 'auto', // Push the value to the right side of the row
  },
  detailsValueText: {
    lineHeight: 18, // Set the line height to match the font size
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#8FCB8F',
    paddingHorizontal: 57,
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,

  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF6A63',
    paddingHorizontal: 57,
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',

  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExpenseDetailsScreen;
